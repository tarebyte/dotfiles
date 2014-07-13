(function() {
  var $, $$, AutocompleteView, Editor, FuzzyProvider, Perf, Range, SimpleSelectListView, Utils, minimatch, path, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require("atom"), Editor = _ref.Editor, $ = _ref.$, $$ = _ref.$$, Range = _ref.Range;

  _ = require("underscore-plus");

  path = require("path");

  minimatch = require("minimatch");

  SimpleSelectListView = require("./simple-select-list-view");

  FuzzyProvider = require("./fuzzy-provider");

  Perf = require("./perf");

  Utils = require("./utils");

  module.exports = AutocompleteView = (function(_super) {
    __extends(AutocompleteView, _super);

    function AutocompleteView() {
      this.onChanged = __bind(this.onChanged, this);
      this.onSaved = __bind(this.onSaved, this);
      this.cursorMoved = __bind(this.cursorMoved, this);
      this.contentsModified = __bind(this.contentsModified, this);
      this.runAutocompletion = __bind(this.runAutocompletion, this);
      this.cancel = __bind(this.cancel, this);
      return AutocompleteView.__super__.constructor.apply(this, arguments);
    }

    AutocompleteView.prototype.currentBuffer = null;

    AutocompleteView.prototype.debug = false;

    AutocompleteView.prototype.initialize = function(editorView) {
      this.editorView = editorView;
      this.editor = this.editorView.editor;
      AutocompleteView.__super__.initialize.apply(this, arguments);
      this.addClass("autocomplete-plus");
      this.providers = [];
      if (this.currentFileBlacklisted()) {
        return;
      }
      this.registerProvider(new FuzzyProvider(this.editorView));
      this.handleEvents();
      this.setCurrentBuffer(this.editor.getBuffer());
      this.subscribeToCommand(this.editorView, "autocomplete-plus:activate", this.runAutocompletion);
      this.on("autocomplete-plus:select-next", (function(_this) {
        return function() {
          return _this.selectNextItemView();
        };
      })(this));
      this.on("autocomplete-plus:select-previous", (function(_this) {
        return function() {
          return _this.selectPreviousItemView();
        };
      })(this));
      return this.on("autocomplete-plus:cancel", (function(_this) {
        return function() {
          return _this.cancel();
        };
      })(this));
    };

    AutocompleteView.prototype.currentFileBlacklisted = function() {
      var blacklist, blacklistGlob, fileName, _i, _len;
      blacklist = (atom.config.get("autocomplete-plus.fileBlacklist") || "").split(",").map(function(s) {
        return s.trim();
      });
      fileName = path.basename(this.editor.getBuffer().getPath());
      for (_i = 0, _len = blacklist.length; _i < _len; _i++) {
        blacklistGlob = blacklist[_i];
        if (minimatch(fileName, blacklistGlob)) {
          return true;
        }
      }
      return false;
    };

    AutocompleteView.prototype.viewForItem = function(_arg) {
      var className, item, label, renderLabelAsHtml, word;
      word = _arg.word, label = _arg.label, renderLabelAsHtml = _arg.renderLabelAsHtml, className = _arg.className;
      item = $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.span(word, {
              "class": "word"
            });
            if (label != null) {
              return _this.span(label, {
                "class": "label"
              });
            }
          };
        })(this));
      });
      if (renderLabelAsHtml) {
        item.find(".label").html(label);
      }
      if (className != null) {
        item.addClass(className);
      }
      return item;
    };

    AutocompleteView.prototype.escapeHtml = function(string) {
      var escapedString;
      escapedString = string.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return escapedString;
    };

    AutocompleteView.prototype.handleEvents = function() {
      this.list.on("mousewheel", function(event) {
        return event.stopPropagation();
      });
      this.editor.on("title-changed-subscription-removed", this.cancel);
      this.editor.on("cursor-moved", this.cursorMoved);
      this.hiddenInput.on('compositionstart', (function(_this) {
        return function() {
          _this.compositionInProgress = true;
          return null;
        };
      })(this));
      return this.hiddenInput.on('compositionend', (function(_this) {
        return function() {
          _this.compositionInProgress = false;
          return null;
        };
      })(this));
    };

    AutocompleteView.prototype.registerProvider = function(provider) {
      if (_.findWhere(this.providers, provider) == null) {
        return this.providers.push(provider);
      }
    };

    AutocompleteView.prototype.unregisterProvider = function(provider) {
      return _.remove(this.providers, provider);
    };

    AutocompleteView.prototype.confirmed = function(match) {
      var position, replace;
      replace = match.provider.confirm(match);
      this.editor.getSelection().clear();
      this.cancel();
      if (!match) {
        return;
      }
      if (replace) {
        this.replaceTextWithMatch(match);
        position = this.editor.getCursorBufferPosition();
        return this.editor.setCursorBufferPosition([position.row, position.column]);
      }
    };

    AutocompleteView.prototype.cancel = function() {
      AutocompleteView.__super__.cancel.apply(this, arguments);
      if (!this.editorView.hasFocus()) {
        return this.editorView.focus();
      }
    };

    AutocompleteView.prototype.runAutocompletion = function() {
      var provider, providerSuggestions, suggestions, _i, _len, _ref1;
      if (this.compositionInProgress) {
        return;
      }
      suggestions = [];
      _ref1 = this.providers.slice().reverse();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        provider = _ref1[_i];
        providerSuggestions = provider.buildSuggestions();
        if (!(providerSuggestions != null ? providerSuggestions.length : void 0)) {
          continue;
        }
        if (provider.exclusive) {
          suggestions = providerSuggestions;
          break;
        } else {
          suggestions = suggestions.concat(providerSuggestions);
        }
      }
      if (!suggestions.length) {
        return this.cancel();
      }
      this.setItems(suggestions);
      this.editorView.appendToLinesView(this);
      this.setPosition();
      return this.setActive();
    };

    AutocompleteView.prototype.contentsModified = function() {
      var delay;
      delay = parseInt(atom.config.get("autocomplete-plus.autoActivationDelay"));
      if (this.delayTimeout) {
        clearTimeout(this.delayTimeout);
      }
      return this.delayTimeout = setTimeout(this.runAutocompletion, delay);
    };

    AutocompleteView.prototype.cursorMoved = function(data) {
      if (!data.textChanged) {
        return this.cancel();
      }
    };

    AutocompleteView.prototype.onSaved = function() {
      return this.cancel();
    };

    AutocompleteView.prototype.onChanged = function(e) {
      var typedText;
      typedText = e.newText.trim();
      if (typedText.length === 1 && atom.config.get("autocomplete-plus.enableAutoActivation")) {
        return this.contentsModified();
      } else {
        return this.cancel();
      }
    };

    AutocompleteView.prototype.setPosition = function() {
      var abovePosition, belowLowerPosition, belowPosition, cursorLeft, cursorTop, left, top, _ref1;
      _ref1 = this.editorView.pixelPositionForScreenPosition(this.editor.getCursorScreenPosition()), left = _ref1.left, top = _ref1.top;
      cursorLeft = left;
      cursorTop = top;
      belowPosition = cursorTop + this.editorView.lineHeight;
      belowLowerPosition = belowPosition + this.outerHeight();
      abovePosition = cursorTop;
      if (belowLowerPosition > this.editorView.outerHeight() + this.editorView.scrollTop()) {
        this.css({
          left: cursorLeft,
          top: abovePosition
        });
        return this.css("-webkit-transform", "translateY(-100%)");
      } else {
        this.css({
          left: cursorLeft,
          top: belowPosition
        });
        return this.css("-webkit-transform", "");
      }
    };

    AutocompleteView.prototype.replaceTextWithMatch = function(match) {
      var buffer, cursorPosition, selection, startPosition, suffixLength;
      selection = this.editor.getSelection();
      startPosition = selection.getBufferRange().start;
      buffer = this.editor.getBuffer();
      cursorPosition = this.editor.getCursorBufferPosition();
      buffer["delete"](Range.fromPointWithDelta(cursorPosition, 0, -match.prefix.length));
      this.editor.insertText(match.word);
      suffixLength = match.word.length - match.prefix.length;
      return this.editor.setSelectedBufferRange([startPosition, [startPosition.row, startPosition.column + suffixLength]]);
    };

    AutocompleteView.prototype.afterAttach = function(onDom) {
      var widestCompletion;
      if (!onDom) {
        return;
      }
      widestCompletion = parseInt(this.css("min-width")) || 0;
      this.list.find("li").each(function() {
        var labelWidth, totalWidth, wordWidth;
        wordWidth = $(this).find("span.word").outerWidth();
        labelWidth = $(this).find("span.label").outerWidth();
        totalWidth = wordWidth + labelWidth + 40;
        return widestCompletion = Math.max(widestCompletion, totalWidth);
      });
      this.list.width(widestCompletion);
      return this.width(this.list.outerWidth());
    };

    AutocompleteView.prototype.populateList = function() {
      var p;
      p = new Perf("Populating list", {
        debug: this.debug
      });
      p.start();
      AutocompleteView.__super__.populateList.apply(this, arguments);
      p.stop();
      return this.setPosition();
    };

    AutocompleteView.prototype.setCurrentBuffer = function(currentBuffer) {
      this.currentBuffer = currentBuffer;
      this.currentBuffer.on("saved", this.onSaved);
      return this.currentBuffer.on("changed", this.onChanged);
    };

    AutocompleteView.prototype.getModel = function() {
      return null;
    };

    AutocompleteView.prototype.dispose = function() {
      var provider, _i, _len, _ref1, _ref2, _ref3, _results;
      if ((_ref1 = this.currentBuffer) != null) {
        _ref1.off("changed", this.onChanged);
      }
      if ((_ref2 = this.currentBuffer) != null) {
        _ref2.off("saved", this.onSaved);
      }
      this.editor.off("title-changed-subscription-removed", this.cancel);
      this.editor.off("cursor-moved", this.cursorMoved);
      _ref3 = this.providers;
      _results = [];
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        provider = _ref3[_i];
        if (provider.dispose != null) {
          _results.push(provider.dispose());
        }
      }
      return _results;
    };

    return AutocompleteView;

  })(SimpleSelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtIQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBMEIsT0FBQSxDQUFRLE1BQVIsQ0FBMUIsRUFBQyxjQUFBLE1BQUQsRUFBUyxTQUFBLENBQVQsRUFBWSxVQUFBLEVBQVosRUFBZ0IsYUFBQSxLQUFoQixDQUFBOztBQUFBLEVBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQURKLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxXQUFSLENBSFosQ0FBQTs7QUFBQSxFQUlBLG9CQUFBLEdBQXVCLE9BQUEsQ0FBUSwyQkFBUixDQUp2QixDQUFBOztBQUFBLEVBS0EsYUFBQSxHQUFnQixPQUFBLENBQVEsa0JBQVIsQ0FMaEIsQ0FBQTs7QUFBQSxFQU1BLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUixDQU5QLENBQUE7O0FBQUEsRUFPQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVIsQ0FQUixDQUFBOztBQUFBLEVBU0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHVDQUFBLENBQUE7Ozs7Ozs7Ozs7S0FBQTs7QUFBQSwrQkFBQSxhQUFBLEdBQWUsSUFBZixDQUFBOztBQUFBLCtCQUNBLEtBQUEsR0FBTyxLQURQLENBQUE7O0FBQUEsK0JBT0EsVUFBQSxHQUFZLFNBQUUsVUFBRixHQUFBO0FBQ1YsTUFEVyxJQUFDLENBQUEsYUFBQSxVQUNaLENBQUE7QUFBQSxNQUFDLElBQUMsQ0FBQSxTQUFVLElBQUMsQ0FBQSxXQUFYLE1BQUYsQ0FBQTtBQUFBLE1BRUEsa0RBQUEsU0FBQSxDQUZBLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxRQUFELENBQVUsbUJBQVYsQ0FKQSxDQUFB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
//# sourceURL=/Users/mark/src/tarebyte/dotfiles/atom.symlink/packages/autocomplete-plus/lib/autocomplete-view.coffee
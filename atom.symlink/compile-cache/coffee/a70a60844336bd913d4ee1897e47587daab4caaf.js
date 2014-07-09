(function() {
  var FuzzyProvider, Perf, Provider, Suggestion, Utils, fuzzaldrin, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require("underscore-plus");

  Suggestion = require("./suggestion");

  Utils = require("./utils");

  fuzzaldrin = require("fuzzaldrin");

  Provider = require("./provider");

  Perf = require("./perf");

  module.exports = FuzzyProvider = (function(_super) {
    __extends(FuzzyProvider, _super);

    function FuzzyProvider() {
      this.onChanged = __bind(this.onChanged, this);
      this.onSaved = __bind(this.onSaved, this);
      return FuzzyProvider.__super__.constructor.apply(this, arguments);
    }

    FuzzyProvider.prototype.wordList = null;

    FuzzyProvider.prototype.debug = false;

    FuzzyProvider.prototype.initialize = function() {
      this.buildWordList();
      this.currentBuffer = this.editor.getBuffer();
      this.currentBuffer.on("saved", this.onSaved);
      return this.currentBuffer.on("changed", this.onChanged);
    };

    FuzzyProvider.prototype.buildSuggestions = function() {
      var prefix, selection, suggestions;
      selection = this.editor.getSelection();
      prefix = this.prefixOfSelection(selection);
      if (!prefix.length) {
        return;
      }
      suggestions = this.findSuggestionsForWord(prefix);
      if (!suggestions.length) {
        return;
      }
      return suggestions;
    };

    FuzzyProvider.prototype.confirm = function(item) {
      return true;
    };

    FuzzyProvider.prototype.onSaved = function() {
      return this.buildWordList();
    };

    FuzzyProvider.prototype.onChanged = function(e) {
      var newline, wordChars;
      wordChars = "ąàáäâãåæăćęèéëêìíïîłńòóöôõøśșțùúüûñçżź" + "abcdefghijklmnopqrstuvwxyz1234567890";
      if (wordChars.indexOf(e.newText.toLowerCase()) === -1) {
        newline = e.newText === "\n";
        return this.addLastWordToList(e.newRange.start.row, e.newRange.start.column, newline);
      }
    };

    FuzzyProvider.prototype.addLastWordToList = function(row, column, newline) {
      var lastWord;
      lastWord = this.lastTypedWord(row, column, newline);
      if (!lastWord) {
        return;
      }
      if (this.wordList.indexOf(lastWord) < 0) {
        return this.wordList.push(lastWord);
      }
    };

    FuzzyProvider.prototype.lastTypedWord = function(row, column, newline) {
      var lastWord, lineRange, maxColumn;
      if (newline) {
        if (!(column = 0)) {
          maxColumn = column - 1;
        }
      } else {
        maxColumn = column;
      }
      lineRange = [[row, 0], [row, column]];
      lastWord = null;
      this.currentBuffer.scanInRange(this.wordRegex, lineRange, function(_arg) {
        var match, range, stop;
        match = _arg.match, range = _arg.range, stop = _arg.stop;
        return lastWord = match[0];
      });
      return lastWord;
    };

    FuzzyProvider.prototype.buildWordList = function() {
      var buffer, buffers, matches, p, wordList, _i, _len;
      wordList = [];
      if (atom.config.get("autocomplete-plus.includeCompletionsFromAllBuffers")) {
        buffers = atom.project.getBuffers();
      } else {
        buffers = [this.editor.getBuffer()];
      }
      p = new Perf("Building word list", {
        debug: this.debug
      });
      p.start();
      matches = [];
      for (_i = 0, _len = buffers.length; _i < _len; _i++) {
        buffer = buffers[_i];
        matches.push(buffer.getText().match(this.wordRegex));
      }
      wordList = _.flatten(matches);
      wordList = Utils.unique(wordList);
      this.wordList = wordList;
      return p.stop();
    };

    FuzzyProvider.prototype.findSuggestionsForWord = function(prefix) {
      var p, results, word, wordList, words;
      p = new Perf("Finding matches for '" + prefix + "'", {
        debug: this.debug
      });
      p.start();
      wordList = this.wordList.concat(this.getCompletionsForCursorScope());
      words = fuzzaldrin.filter(wordList, prefix);
      results = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = words.length; _i < _len; _i++) {
          word = words[_i];
          if (word !== prefix) {
            _results.push(new Suggestion(this, {
              word: word,
              prefix: prefix
            }));
          }
        }
        return _results;
      }).call(this);
      p.stop();
      return results;
    };

    FuzzyProvider.prototype.getCompletionsForCursorScope = function() {
      var completions, cursorScope;
      cursorScope = this.editor.scopesForBufferPosition(this.editor.getCursorBufferPosition());
      completions = atom.syntax.propertiesForScope(cursorScope, "editor.completions");
      completions = completions.map(function(properties) {
        return _.valueForKeyPath(properties, "editor.completions");
      });
      return Utils.unique(_.flatten(completions));
    };

    FuzzyProvider.prototype.dispose = function() {
      var _ref, _ref1;
      if ((_ref = this.currentBuffer) != null) {
        _ref.off("changed", this.onChanged);
      }
      return (_ref1 = this.currentBuffer) != null ? _ref1.off("saved", this.onSaved) : void 0;
    };

    return FuzzyProvider;

  })(Provider);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtEQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FEYixDQUFBOztBQUFBLEVBRUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSLENBRlIsQ0FBQTs7QUFBQSxFQUdBLFVBQUEsR0FBYSxPQUFBLENBQVEsWUFBUixDQUhiLENBQUE7O0FBQUEsRUFJQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVIsQ0FKWCxDQUFBOztBQUFBLEVBS0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSLENBTFAsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixvQ0FBQSxDQUFBOzs7Ozs7S0FBQTs7QUFBQSw0QkFBQSxRQUFBLEdBQVUsSUFBVixDQUFBOztBQUFBLDRCQUNBLEtBQUEsR0FBTyxLQURQLENBQUE7O0FBQUEsNEJBR0EsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLE1BQUEsSUFBQyxDQUFBLGFBQUQsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUixDQUFBLENBRmpCLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxhQUFhLENBQUMsRUFBZixDQUFrQixPQUFsQixFQUEyQixJQUFDLENBQUEsT0FBNUIsQ0FIQSxDQUFBO2FBSUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxFQUFmLENBQWtCLFNBQWxCLEVBQTZCLElBQUMsQ0FBQSxTQUE5QixFQUxVO0lBQUEsQ0FIWixDQUFBOztBQUFBLDRCQWVBLGdCQUFBLEdBQWtCLFNBQUEsR0FBQTtBQUNoQixVQUFBLDhCQUFBO0FB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
//# sourceURL=/Users/mark/.atom/packages/autocomplete-plus/lib/fuzzy-provider.coffee
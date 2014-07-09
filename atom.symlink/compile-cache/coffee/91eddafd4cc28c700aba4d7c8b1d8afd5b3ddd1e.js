(function() {
  var $, $$$, AtomHtmlPreviewView, ScrollView, path, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  path = require('path');

  _ref = require('atom'), $ = _ref.$, $$$ = _ref.$$$, ScrollView = _ref.ScrollView;

  _ = require('underscore-plus');

  module.exports = AtomHtmlPreviewView = (function(_super) {
    __extends(AtomHtmlPreviewView, _super);

    atom.deserializers.add(AtomHtmlPreviewView);

    AtomHtmlPreviewView.deserialize = function(state) {
      return new AtomHtmlPreviewView(state);
    };

    AtomHtmlPreviewView.content = function() {
      return this.div({
        "class": 'atom-html-preview native-key-bindings',
        tabindex: -1
      });
    };

    function AtomHtmlPreviewView(_arg) {
      var filePath;
      this.editorId = _arg.editorId, filePath = _arg.filePath;
      AtomHtmlPreviewView.__super__.constructor.apply(this, arguments);
      if (this.editorId != null) {
        this.resolveEditor(this.editorId);
      } else {
        if (atom.workspace != null) {
          this.subscribeToFilePath(filePath);
        } else {
          this.subscribe(atom.packages.once('activated', (function(_this) {
            return function() {
              return _this.subscribeToFilePath(filePath);
            };
          })(this)));
        }
      }
    }

    AtomHtmlPreviewView.prototype.serialize = function() {
      return {
        deserializer: 'AtomHtmlPreviewView',
        filePath: this.getPath(),
        editorId: this.editorId
      };
    };

    AtomHtmlPreviewView.prototype.destroy = function() {
      return this.unsubscribe();
    };

    AtomHtmlPreviewView.prototype.subscribeToFilePath = function(filePath) {
      this.trigger('title-changed');
      this.handleEvents();
      return this.renderHTML();
    };

    AtomHtmlPreviewView.prototype.resolveEditor = function(editorId) {
      var resolve;
      resolve = (function(_this) {
        return function() {
          var _ref1;
          _this.editor = _this.editorForId(editorId);
          if (_this.editor != null) {
            if (_this.editor != null) {
              _this.trigger('title-changed');
            }
            return _this.handleEvents();
          } else {
            return (_ref1 = _this.parents('.pane').view()) != null ? _ref1.destroyItem(_this) : void 0;
          }
        };
      })(this);
      if (atom.workspace != null) {
        return resolve();
      } else {
        return this.subscribe(atom.packages.once('activated', (function(_this) {
          return function() {
            resolve();
            return _this.renderHTML();
          };
        })(this)));
      }
    };

    AtomHtmlPreviewView.prototype.editorForId = function(editorId) {
      var editor, _i, _len, _ref1, _ref2;
      _ref1 = atom.workspace.getEditors();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        editor = _ref1[_i];
        if (((_ref2 = editor.id) != null ? _ref2.toString() : void 0) === editorId.toString()) {
          return editor;
        }
      }
      return null;
    };

    AtomHtmlPreviewView.prototype.handleEvents = function() {
      var changeHandler;
      changeHandler = (function(_this) {
        return function() {
          var pane;
          _this.renderHTML();
          pane = atom.workspace.paneForUri(_this.getUri());
          if ((pane != null) && pane !== atom.workspace.getActivePane()) {
            return pane.activateItem(_this);
          }
        };
      })(this);
      if (this.editor != null) {
        this.subscribe(this.editor.getBuffer(), 'contents-modified', changeHandler);
        return this.subscribe(this.editor, 'path-changed', (function(_this) {
          return function() {
            return _this.trigger('title-changed');
          };
        })(this));
      }
    };

    AtomHtmlPreviewView.prototype.renderHTML = function() {
      this.showLoading();
      if (this.editor != null) {
        return this.renderHTMLCode(this.editor.getText());
      }
    };

    AtomHtmlPreviewView.prototype.renderHTMLCode = function(text) {
      var iframe;
      text = "<!doctype html>\n<html>\n  <head>\n    <meta charset=\"utf-8\">\n    <title>HTML Preview</title>\n    <style>\n      body {\n        font-family: \"Helvetica Neue\", Helvetica, sans-serif;\n        font-size: 14px;\n        line-height: 1.6;\n        background-color: #fff;\n        overflow: scroll;\n        box-sizing: border-box;\n      }\n    </style>\n  </head>\n  <body>\n    " + text + "\n  </body>\n</html>";
      iframe = document.createElement("iframe");
      iframe.src = "data:text/html;charset=utf-8," + (encodeURI(text));
      this.html($(iframe));
      return this.trigger('atom-html-preview:html-changed');
    };

    AtomHtmlPreviewView.prototype.getTitle = function() {
      if (this.editor != null) {
        return "" + (this.editor.getTitle()) + " Preview";
      } else {
        return "HTML Preview";
      }
    };

    AtomHtmlPreviewView.prototype.getUri = function() {
      return "html-preview://editor/" + this.editorId;
    };

    AtomHtmlPreviewView.prototype.getPath = function() {
      if (this.editor != null) {
        return this.editor.getPath();
      }
    };

    AtomHtmlPreviewView.prototype.showError = function(result) {
      var failureMessage;
      failureMessage = result != null ? result.message : void 0;
      return this.html($$$(function() {
        this.h2('Previewing HTML Failed');
        if (failureMessage != null) {
          return this.h3(failureMessage);
        }
      }));
    };

    AtomHtmlPreviewView.prototype.showLoading = function() {
      return this.html($$$(function() {
        return this.div({
          "class": 'atom-html-spinner'
        }, 'Loading HTML Preview\u2026');
      }));
    };

    return AtomHtmlPreviewView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsT0FBdUIsT0FBQSxDQUFRLE1BQVIsQ0FBdkIsRUFBQyxTQUFBLENBQUQsRUFBSSxXQUFBLEdBQUosRUFBUyxrQkFBQSxVQURULENBQUE7O0FBQUEsRUFFQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBRkosQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiwwQ0FBQSxDQUFBOztBQUFBLElBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFuQixDQUF1QixtQkFBdkIsQ0FBQSxDQUFBOztBQUFBLElBRUEsbUJBQUMsQ0FBQSxXQUFELEdBQWMsU0FBQyxLQUFELEdBQUE7YUFDUixJQUFBLG1CQUFBLENBQW9CLEtBQXBCLEVBRFE7SUFBQSxDQUZkLENBQUE7O0FBQUEsSUFLQSxtQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sdUNBQVA7QUFBQSxRQUFnRCxRQUFBLEVBQVUsQ0FBQSxDQUExRDtPQUFMLEVBRFE7SUFBQSxDQUxWLENBQUE7O0FBUWEsSUFBQSw2QkFBQyxJQUFELEdBQUE7QUFDWCxVQUFBLFFBQUE7QUFBQSxNQURhLElBQUMsQ0FBQSxnQkFBQSxVQUFVLGdCQUFBLFFBQ3hCLENBQUE7QUFBQSxNQUFBLHNEQUFBLFNBQUEsQ0FBQSxDQUFBO0FBRUEsTUFBQSxJQUFHLHFCQUFIO0FBQ0UsUUFBQSxJQUFDLENBQUEsYUFBRCxDQUFlLElBQUMsQ0FBQSxRQUFoQixDQUFBLENBREY7T0FBQSxNQUFBO0FBR0UsUUFBQSxJQUFHLHNC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
//# sourceURL=/Users/mark/.atom/packages/atom-html-preview/lib/atom-html-preview-view.coffee
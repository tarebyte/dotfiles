(function() {
  var $, EditorView, PromptView, View, method, noop, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), $ = _ref.$, EditorView = _ref.EditorView, View = _ref.View;

  noop = function() {};

  method = function(delegate, method) {
    var _ref1;
    return (delegate != null ? (_ref1 = delegate[method]) != null ? _ref1.bind(delegate) : void 0 : void 0) || noop;
  };

  module.exports = PromptView = (function(_super) {
    __extends(PromptView, _super);

    function PromptView() {
      return PromptView.__super__.constructor.apply(this, arguments);
    }

    PromptView.attach = function() {
      return new PromptView;
    };

    PromptView.content = function() {
      return this.div({
        "class": 'emmet-prompt mini'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'emmet-prompt__input'
          }, function() {
            return _this.subview('panelInput', new EditorView({
              mini: true
            }));
          });
        };
      })(this));
    };

    PromptView.prototype.initialize = function() {
      this.panelEditor = this.panelInput.getEditor();
      this.panelEditor.on('contents-modified', (function(_this) {
        return function() {
          if (!_this.attached) {
            return;
          }
          return _this.handleUpdate(_this.panelEditor.getText());
        };
      })(this));
      this.on('core:confirm', (function(_this) {
        return function() {
          return _this.confirm();
        };
      })(this));
      return this.on('core:cancel', (function(_this) {
        return function() {
          return _this.cancel();
        };
      })(this));
    };

    PromptView.prototype.show = function(delegate) {
      var text;
      this.delegate = delegate != null ? delegate : {};
      this.editor = this.delegate.editor;
      this.editorView = this.delegate.editorView;
      this.panelInput.setPlaceholderText(this.delegate.label || 'Enter Abbreviation');
      this.updated = false;
      this.attach();
      text = this.panelEditor.getText();
      if (text) {
        return this.handleUpdate(text);
      }
    };

    PromptView.prototype.undo = function() {
      if (this.updated) {
        return this.editor.undo();
      }
    };

    PromptView.prototype.handleUpdate = function(text) {
      this.undo();
      this.updated = true;
      return this.editor.transact((function(_this) {
        return function() {
          return method(_this.delegate, 'update')(text);
        };
      })(this));
    };

    PromptView.prototype.confirm = function() {
      this.handleUpdate(this.panelEditor.getText());
      this.trigger('confirm');
      method(this.delegate, 'confirm')();
      return this.detach();
    };

    PromptView.prototype.cancel = function() {
      this.undo();
      this.trigger('cancel');
      method(this.delegate, 'cancel')();
      return this.detach();
    };

    PromptView.prototype.detach = function() {
      var _ref1;
      if (!this.hasParent()) {
        return;
      }
      this.detaching = true;
      if ((_ref1 = this.previouslyFocusedElement) != null ? _ref1.isOnDom() : void 0) {
        this.previouslyFocusedElement.focus();
      } else {
        atom.workspaceView.focus();
      }
      PromptView.__super__.detach.apply(this, arguments);
      this.detaching = false;
      this.attached = false;
      this.trigger('detach');
      return method(this.delegate, 'hide')();
    };

    PromptView.prototype.attach = function() {
      this.attached = true;
      this.previouslyFocusedElement = $(':focus');
      atom.workspaceView.prependToBottom(this);
      this.panelInput.focus();
      this.trigger('attach');
      return method(this.delegate, 'show')();
    };

    return PromptView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1EQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUF3QixPQUFBLENBQVEsTUFBUixDQUF4QixFQUFDLFNBQUEsQ0FBRCxFQUFJLGtCQUFBLFVBQUosRUFBZ0IsWUFBQSxJQUFoQixDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLFNBQUEsR0FBQSxDQUZQLENBQUE7O0FBQUEsRUFJQSxNQUFBLEdBQVMsU0FBQyxRQUFELEVBQVcsTUFBWCxHQUFBO0FBQ1IsUUFBQSxLQUFBO3lFQUFpQixDQUFFLElBQW5CLENBQXdCLFFBQXhCLG9CQUFBLElBQXFDLEtBRDdCO0VBQUEsQ0FKVCxDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNMLGlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFVBQUMsQ0FBQSxNQUFELEdBQVMsU0FBQSxHQUFBO2FBQUcsR0FBQSxDQUFBLFdBQUg7SUFBQSxDQUFULENBQUE7O0FBQUEsSUFFQSxVQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNULElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxtQkFBUDtPQUFMLEVBQWlDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBRWhDLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxxQkFBUDtXQUFMLEVBQW1DLFNBQUEsR0FBQTttQkFDbEMsS0FBQyxDQUFBLE9BQUQsQ0FBUyxZQUFULEVBQTJCLElBQUEsVUFBQSxDQUFXO0FBQUEsY0FBQSxJQUFBLEVBQU0sSUFBTjthQUFYLENBQTNCLEVBRGtDO1VBQUEsQ0FBbkMsRUFGZ0M7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQyxFQURTO0lB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
//# sourceURL=/Users/mark/.atom/packages/emmet/lib/prompt.coffee
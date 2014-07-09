(function() {
  var EditorView, View, VimCommandModeInputView, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), View = _ref.View, EditorView = _ref.EditorView;

  module.exports = VimCommandModeInputView = (function(_super) {
    __extends(VimCommandModeInputView, _super);

    function VimCommandModeInputView() {
      this.remove = __bind(this.remove, this);
      this.focus = __bind(this.focus, this);
      this.confirm = __bind(this.confirm, this);
      this.autosubmit = __bind(this.autosubmit, this);
      return VimCommandModeInputView.__super__.constructor.apply(this, arguments);
    }

    VimCommandModeInputView.content = function() {
      return this.div({
        "class": 'command-mode-input'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'editor-container',
            outlet: 'editorContainer'
          }, function() {
            return _this.subview('editor', new EditorView({
              mini: true
            }));
          });
        };
      })(this));
    };

    VimCommandModeInputView.prototype.initialize = function(viewModel, opts) {
      var statusBar;
      this.viewModel = viewModel;
      if (opts == null) {
        opts = {};
      }
      this.editor.setFontSize(atom.config.get('vim-mode.commandModeInputViewFontSize'));
      if (opts["class"] != null) {
        this.editorContainer.addClass(opts["class"]);
      }
      if (opts.hidden != null) {
        this.editorContainer.addClass('hidden-input');
      }
      if (opts.singleChar != null) {
        this.singleChar = true;
      }
      if (atom.workspaceView == null) {
        this.focus();
        this.handleEvents();
        return;
      }
      statusBar = atom.workspaceView.find('.status-bar');
      if (statusBar.length > 0) {
        this.insertBefore(statusBar);
      } else {
        atom.workspace.getActivePane().append(this);
      }
      this.focus();
      return this.handleEvents();
    };

    VimCommandModeInputView.prototype.handleEvents = function() {
      if (this.singleChar != null) {
        this.editor.find('input').on('textInput', this.autosubmit);
      }
      this.editor.on('core:confirm', this.confirm);
      this.editor.on('core:cancel', this.remove);
      return this.editor.find('input').on('blur', this.remove);
    };

    VimCommandModeInputView.prototype.autosubmit = function(event) {
      this.editor.setText(event.originalEvent.data);
      return this.confirm();
    };

    VimCommandModeInputView.prototype.confirm = function() {
      this.value = this.editor.getText();
      this.viewModel.confirm(this);
      return this.remove();
    };

    VimCommandModeInputView.prototype.focus = function() {
      return this.editorContainer.find('.editor').focus();
    };

    VimCommandModeInputView.prototype.remove = function() {
      if (atom.workspaceView != null) {
        atom.workspaceView.focus();
      }
      return VimCommandModeInputView.__super__.remove.call(this);
    };

    return VimCommandModeInputView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtDQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBcUIsT0FBQSxDQUFRLE1BQVIsQ0FBckIsRUFBQyxZQUFBLElBQUQsRUFBTyxrQkFBQSxVQUFQLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUVNO0FBQ0osOENBQUEsQ0FBQTs7Ozs7Ozs7S0FBQTs7QUFBQSxJQUFBLHVCQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxvQkFBUDtPQUFMLEVBQWtDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ2hDLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxrQkFBUDtBQUFBLFlBQTJCLE1BQUEsRUFBUSxpQkFBbkM7V0FBTCxFQUEyRCxTQUFBLEdBQUE7bUJBQ3pELEtBQUMsQ0FBQSxPQUFELENBQVMsUUFBVCxFQUF1QixJQUFBLFVBQUEsQ0FBVztBQUFBLGNBQUEsSUFBQSxFQUFNLElBQU47YUFBWCxDQUF2QixFQUR5RDtVQUFBLENBQTNELEVBRGdDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEMsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSxzQ0FLQSxVQUFBLEdBQVksU0FBRSxTQUFGLEVBQWEsSUFBYixHQUFBO0FBQ1YsVUFBQSxTQUFBO0FBQUEsTUFEVyxJQUFDLENBQUEsWUFBQSxTQUNaLENBQUE7O1FBRHVCLE9BQU87T0FDOUI7QUFBQSxNQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBUixDQUFvQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUNBQWhCLENBQXBCLENBQUEsQ0FBQTtB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
//# sourceURL=/Users/mark/.atom/packages/vim-mode/lib/vim-command-mode-input-view.coffee
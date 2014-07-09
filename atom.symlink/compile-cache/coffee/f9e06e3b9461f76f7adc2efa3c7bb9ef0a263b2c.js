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
      this.cancel = __bind(this.cancel, this);
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
      this.editor.on('core:cancel', this.cancel);
      return this.editor.find('input').on('blur', this.cancel);
    };

    VimCommandModeInputView.prototype.stopHandlingEvents = function() {
      if (this.singleChar != null) {
        this.editor.find('input').off('textInput', this.autosubmit);
      }
      this.editor.off('core:confirm', this.confirm);
      this.editor.off('core:cancel', this.cancel);
      return this.editor.find('input').off('blur', this.cancel);
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

    VimCommandModeInputView.prototype.cancel = function(e) {
      this.viewModel.cancel(this);
      return this.remove();
    };

    VimCommandModeInputView.prototype.remove = function() {
      this.stopHandlingEvents();
      if (atom.workspaceView != null) {
        atom.workspaceView.focus();
      }
      return VimCommandModeInputView.__super__.remove.call(this);
    };

    return VimCommandModeInputView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtDQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBcUIsT0FBQSxDQUFRLE1BQVIsQ0FBckIsRUFBQyxZQUFBLElBQUQsRUFBTyxrQkFBQSxVQUFQLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUVNO0FBQ0osOENBQUEsQ0FBQTs7Ozs7Ozs7O0tBQUE7O0FBQUEsSUFBQSx1QkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sb0JBQVA7T0FBTCxFQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNoQyxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sa0JBQVA7QUFBQSxZQUEyQixNQUFBLEVBQVEsaUJBQW5DO1dBQUwsRUFBMkQsU0FBQSxHQUFBO21CQUN6RCxLQUFDLENBQUEsT0FBRCxDQUFTLFFBQVQsRUFBdUIsSUFBQSxVQUFBLENBQVc7QUFBQSxjQUFBLElBQUEsRUFBTSxJQUFOO2FBQVgsQ0FBdkIsRUFEeUQ7VUFBQSxDQUEzRCxFQURnQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsc0NBS0EsVUFBQSxHQUFZLFNBQUUsU0FBRixFQUFhLElBQWIsR0FBQTtBQUNWLFVBQUEsU0FBQTtBQUFBLE1BRFcsSUFBQyxDQUFBLFlBQUEsU0FDWixDQUFBOztRQUR1QixPQUFPO09BQzlCO0FBQUEsTUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVIsQ0FBb0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVDQUFoQixDQUFwQixDQUFBLENBQUE7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
//# sourceURL=/Users/mark/.atom/packages/vim-mode/lib/view-models/vim-command-mode-input-view.coffee
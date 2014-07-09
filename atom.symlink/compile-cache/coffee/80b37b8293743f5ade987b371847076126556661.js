(function() {
  var ReplaceViewModel, VimCommandModeInputView;

  VimCommandModeInputView = require('./vim-command-mode-input-view');

  module.exports = ReplaceViewModel = (function() {
    function ReplaceViewModel(replaceOperator) {
      this.replaceOperator = replaceOperator;
      this.editorView = this.replaceOperator.editorView;
      this.vimState = this.replaceOperator.state;
      this.view = new VimCommandModeInputView(this, {
        "class": 'replace',
        hidden: true,
        singleChar: true
      });
      this.editorView.editor.commandModeInputView = this.view;
    }

    ReplaceViewModel.prototype.confirm = function(view) {
      this.char = this.view.value;
      return this.editorView.trigger('vim-mode:replace-complete');
    };

    return ReplaceViewModel;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlDQUFBOztBQUFBLEVBQUEsdUJBQUEsR0FBMEIsT0FBQSxDQUFRLCtCQUFSLENBQTFCLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUtNO0FBQ1MsSUFBQSwwQkFBRSxlQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxrQkFBQSxlQUNiLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBQyxDQUFBLGVBQWUsQ0FBQyxVQUEvQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsUUFBRCxHQUFjLElBQUMsQ0FBQSxlQUFlLENBQUMsS0FEL0IsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLElBQUQsR0FBWSxJQUFBLHVCQUFBLENBQXdCLElBQXhCLEVBQTJCO0FBQUEsUUFBQSxPQUFBLEVBQU8sU0FBUDtBQUFBLFFBQWtCLE1BQUEsRUFBUSxJQUExQjtBQUFBLFFBQWdDLFVBQUEsRUFBWSxJQUE1QztPQUEzQixDQUhaLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxVQUFVLENBQUMsTUFBTSxDQUFDLG9CQUFuQixHQUEwQyxJQUFDLENBQUEsSUFKM0MsQ0FEVztJQUFBLENBQWI7O0FBQUEsK0JBT0EsT0FBQSxHQUFTLFNBQUMsSUFBRCxHQUFBO0FBQ1AsTUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBZCxDQUFBO2FBQ0EsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQW9CLDJCQUFwQixFQUZPO0lBQUEsQ0FQVCxDQUFBOzs0QkFBQTs7TUFSRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/mark/.atom/packages/vim-mode/lib/replace-view-model.coffee
(function() {
  var Input, ViewModel, VimCommandModeInputView;

  VimCommandModeInputView = require('./vim-command-mode-input-view');

  ViewModel = (function() {
    function ViewModel(operation, opts) {
      this.operation = operation;
      if (opts == null) {
        opts = {};
      }
      this.editorView = this.operation.editorView;
      this.vimState = this.operation.vimState;
      this.view = new VimCommandModeInputView(this, opts);
      this.editorView.editor.commandModeInputView = this.view;
      this.editorView.on('vim-mode:compose-failure', (function(_this) {
        return function() {
          return _this.view.remove();
        };
      })(this));
    }

    ViewModel.prototype.confirm = function(view) {
      return this.vimState.pushOperations(new Input(this.view.value));
    };

    ViewModel.prototype.cancel = function(view) {
      return this.vimState.pushOperations(new Input(''));
    };

    return ViewModel;

  })();

  Input = (function() {
    function Input(characters) {
      this.characters = characters;
    }

    Input.prototype.isComplete = function() {
      return true;
    };

    Input.prototype.isRecordable = function() {
      return true;
    };

    return Input;

  })();

  module.exports = {
    ViewModel: ViewModel,
    Input: Input
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlDQUFBOztBQUFBLEVBQUEsdUJBQUEsR0FBMEIsT0FBQSxDQUFRLCtCQUFSLENBQTFCLENBQUE7O0FBQUEsRUFlTTtBQWFTLElBQUEsbUJBQUUsU0FBRixFQUFhLElBQWIsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFlBQUEsU0FDYixDQUFBOztRQUR3QixPQUFLO09BQzdCO0FBQUEsTUFBQSxJQUFDLENBQUEsVUFBRCxHQUFjLElBQUMsQ0FBQSxTQUFTLENBQUMsVUFBekIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFFBQUQsR0FBYyxJQUFDLENBQUEsU0FBUyxDQUFDLFFBRHpCLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxJQUFELEdBQVksSUFBQSx1QkFBQSxDQUF3QixJQUF4QixFQUEyQixJQUEzQixDQUhaLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxVQUFVLENBQUMsTUFBTSxDQUFDLG9CQUFuQixHQUEwQyxJQUFDLENBQUEsSUFKM0MsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxFQUFaLENBQWUsMEJBQWYsRUFBMkMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsSUFBSSxDQUFDLE1BQU4sQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0MsQ0FOQSxDQURXO0lBQUEsQ0FBYjs7QUFBQSx3QkFnQkEsT0FBQSxHQUFTLFNBQUMsSUFBRCxHQUFBO2FBQ1AsSUFBQyxDQUFBLFFBQVEsQ0FBQyxjQUFWLENBQTZCLElBQUEsS0FBQSxDQUFNLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBWixDQUE3QixFQURPO0lBQUEsQ0FoQlQsQ0FBQTs7QUFBQSx3QkEwQkEsTUFBQSxHQUFRLFNBQUMsSUFBRCxHQUFBO2FBQ04sSUFBQyxDQUFBLFFBQVEsQ0FBQyxjQUFWLENBQTZCLElBQUEsS0FBQSxDQUFNLEVBQU4sQ0FBN0IsRUFETTtJQUFBLENBMUJSLENBQUE7O3FCQUFBOztNQTVCRixDQUFBOztBQUFBLEVBeURNO0FBQ1MsSUFBQSxlQUFFLFVBQUYsR0FBQTtBQUFlLE1BQWQsSUFBQyxDQUFBLGFBQUEsVUFBYSxDQUFmO0lBQUEsQ0FBYjs7QUFBQSxvQkFDQSxVQUFBLEdBQVksU0FBQSxHQUFBO2FBQUcsS0FBSDtJQUFBLENBRFosQ0FBQTs7QUFBQSxvQkFFQSxZQUFBLEdBQWMsU0FBQSxHQUFBO2FBQUcsS0FBSDtJQUFBLENBRmQsQ0FBQTs7aUJBQUE7O01BMURGLENBQUE7O0FBQUEsRUE4REEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUFBQSxJQUNmLFdBQUEsU0FEZTtBQUFBLElBQ0osT0FBQSxLQURJO0dBOURqQixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/mark/.atom/packages/vim-mode/lib/view-models/view-model.coffee
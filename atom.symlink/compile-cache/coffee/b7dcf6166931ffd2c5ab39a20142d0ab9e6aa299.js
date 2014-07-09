(function() {
  var VimState;

  VimState = require('./vim-state');

  module.exports = {
    configDefaults: {
      'commandModeInputViewFontSize': 11,
      'startInInsertMode': false
    },
    _initializeWorkspaceState: function() {
      var _base, _base1, _base2;
      (_base = atom.workspace).vimState || (_base.vimState = {});
      (_base1 = atom.workspace.vimState).registers || (_base1.registers = {});
      return (_base2 = atom.workspace.vimState).searchHistory || (_base2.searchHistory = []);
    },
    activate: function(state) {
      this._initializeWorkspaceState();
      return atom.workspaceView.eachEditorView((function(_this) {
        return function(editorView) {
          if (!editorView.attached) {
            return;
          }
          if (editorView.mini) {
            return;
          }
          editorView.addClass('vim-mode');
          return editorView.vimState = new VimState(editorView);
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFFBQUE7O0FBQUEsRUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FBWCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsY0FBQSxFQUNFO0FBQUEsTUFBQSw4QkFBQSxFQUFnQyxFQUFoQztBQUFBLE1BQ0EsbUJBQUEsRUFBcUIsS0FEckI7S0FERjtBQUFBLElBSUEseUJBQUEsRUFBMkIsU0FBQSxHQUFBO0FBQ3pCLFVBQUEscUJBQUE7QUFBQSxlQUFBLElBQUksQ0FBQyxVQUFTLENBQUMsa0JBQUQsQ0FBQyxXQUFhLEdBQTVCLENBQUE7QUFBQSxnQkFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVEsQ0FBQyxvQkFBRCxDQUFDLFlBQWMsR0FEdEMsQ0FBQTt1QkFFQSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVEsQ0FBQyx3QkFBRCxDQUFDLGdCQUFrQixJQUhqQjtJQUFBLENBSjNCO0FBQUEsSUFTQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSx5QkFBRCxDQUFBLENBQUEsQ0FBQTthQUNBLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBbkIsQ0FBa0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsVUFBRCxHQUFBO0FBQ2hDLFVBQUEsSUFBQSxDQUFBLFVBQXdCLENBQUMsUUFBekI7QUFBQSxrQkFBQSxDQUFBO1dBQUE7QUFDQSxVQUFBLElBQVUsVUFBVSxDQUFDLElBQXJCO0FBQUEsa0JBQUEsQ0FBQTtXQURBO0FBQUEsVUFHQSxVQUFVLENBQUMsUUFBWCxDQUFvQixVQUFwQixDQUhBLENBQUE7aUJBSUEsVUFBVSxDQUFDLFFBQVgsR0FBMEIsSUFBQSxRQUFBLENBQVMsVUFBVCxFQUxNO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEMsRUFGUTtJQUFBLENBVFY7R0FIRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/mark/.atom/packages/vim-mode/lib/vim-mode.coffee
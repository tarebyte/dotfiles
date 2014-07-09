(function() {
  var VimState;

  VimState = require('./vim-state');

  module.exports = {
    configDefaults: {
      'commandModeInputViewFontSize': 11
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
          editorView.addClass('vim-mode');
          return editorView.vimState = new VimState(editorView);
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFFBQUE7O0FBQUEsRUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FBWCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsY0FBQSxFQUNFO0FBQUEsTUFBQSw4QkFBQSxFQUFnQyxFQUFoQztLQURGO0FBQUEsSUFHQSx5QkFBQSxFQUEyQixTQUFBLEdBQUE7QUFDekIsVUFBQSxxQkFBQTtBQUFBLGVBQUEsSUFBSSxDQUFDLFVBQVMsQ0FBQyxrQkFBRCxDQUFDLFdBQWEsR0FBNUIsQ0FBQTtBQUFBLGdCQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUSxDQUFDLG9CQUFELENBQUMsWUFBYyxHQUR0QyxDQUFBO3VCQUVBLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUSxDQUFDLHdCQUFELENBQUMsZ0JBQWtCLElBSGpCO0lBQUEsQ0FIM0I7QUFBQSxJQVFBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLHlCQUFELENBQUEsQ0FBQSxDQUFBO2FBQ0EsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFuQixDQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxVQUFELEdBQUE7QUFDaEMsVUFBQSxJQUFBLENBQUEsVUFBd0IsQ0FBQyxRQUF6QjtBQUFBLGtCQUFBLENBQUE7V0FBQTtBQUFBLFVBRUEsVUFBVSxDQUFDLFFBQVgsQ0FBb0IsVUFBcEIsQ0FGQSxDQUFBO2lCQUdBLFVBQVUsQ0FBQyxRQUFYLEdBQTBCLElBQUEsUUFBQSxDQUFTLFVBQVQsRUFKTTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLEVBRlE7SUFBQSxDQVJWO0dBSEYsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/mark/.atom/packages/vim-mode/lib/vim-mode.coffee
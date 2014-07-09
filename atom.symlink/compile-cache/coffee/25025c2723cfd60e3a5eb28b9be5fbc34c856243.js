(function() {
  module.exports = {
    activate: function(state) {
      return atom.workspaceView.command("zen:toggle", (function(_this) {
        return function() {
          return _this.toggle();
        };
      })(this));
    },
    toggle: function() {
      var bgColor, tabs, workspace;
      workspace = atom.workspaceView;
      tabs = atom.packages.activePackages.tabs;
      if (workspace.is('.zen')) {
        bgColor = workspace.find('.panes .pane').css('background-color');
        if (tabs != null) {
          tabs.activate();
        }
      } else {
        bgColor = workspace.find('.editor-colors').css('background-color');
        if (tabs != null) {
          tabs.deactivate();
        }
      }
      workspace.find('.panes .pane').css('background-color', bgColor);
      return workspace.toggleClass('zen');
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTthQUNSLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIsWUFBM0IsRUFBeUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsTUFBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QyxFQURRO0lBQUEsQ0FBVjtBQUFBLElBR0EsTUFBQSxFQUFRLFNBQUEsR0FBQTtBQUNOLFVBQUEsd0JBQUE7QUFBQSxNQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsYUFBakIsQ0FBQTtBQUFBLE1BQ0EsSUFBQSxHQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBRHBDLENBQUE7QUFHQSxNQUFBLElBQUcsU0FBUyxDQUFDLEVBQVYsQ0FBYSxNQUFiLENBQUg7QUFDRSxRQUFBLE9BQUEsR0FBVSxTQUFTLENBQUMsSUFBVixDQUFlLGNBQWYsQ0FBOEIsQ0FBQyxHQUEvQixDQUFtQyxrQkFBbkMsQ0FBVixDQUFBOztVQUNBLElBQUksQ0FBRSxRQUFOLENBQUE7U0FGRjtPQUFBLE1BQUE7QUFJRSxRQUFBLE9BQUEsR0FBVSxTQUFTLENBQUMsSUFBVixDQUFlLGdCQUFmLENBQWdDLENBQUMsR0FBakMsQ0FBcUMsa0JBQXJDLENBQVYsQ0FBQTs7VUFDQSxJQUFJLENBQUUsVUFBTixDQUFBO1NBTEY7T0FIQTtBQUFBLE1BVUEsU0FBUyxDQUFDLElBQVYsQ0FBZSxjQUFmLENBQThCLENBQUMsR0FBL0IsQ0FBbUMsa0JBQW5DLEVBQXVELE9BQXZELENBVkEsQ0FBQTthQVdBLFNBQVMsQ0FBQyxXQUFWLENBQXNCLEtBQXRCLEVBWk07SUFBQSxDQUhSO0dBREYsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/mark/.atom/packages/Zen/lib/zen.coffee
(function() {
  var RdioView;

  RdioView = require('./rdio-view');

  module.exports = {
    configDefaults: (function() {
      var configData, configName, configs, _ref;
      configs = {};
      _ref = RdioView.CONFIGS;
      for (configName in _ref) {
        configData = _ref[configName];
        configs[configData.key] = configData["default"];
      }
      return configs;
    })(),
    activate: function(state) {
      return this.rdioView = new RdioView(state.rdioViewState);
    },
    deactivate: function() {
      return this.rdioView.destroy();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFFBQUE7O0FBQUEsRUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FBWCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsY0FBQSxFQUFtQixDQUFBLFNBQUEsR0FBQTtBQUNqQixVQUFBLHFDQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsRUFBVixDQUFBO0FBQ0E7QUFBQSxXQUFBLGtCQUFBO3NDQUFBO0FBQ0UsUUFBQSxPQUFRLENBQUEsVUFBVSxDQUFDLEdBQVgsQ0FBUixHQUEwQixVQUFVLENBQUMsU0FBRCxDQUFwQyxDQURGO0FBQUEsT0FEQTthQUlBLFFBTGlCO0lBQUEsQ0FBQSxDQUFILENBQUEsQ0FBaEI7QUFBQSxJQU9BLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTthQUNSLElBQUMsQ0FBQSxRQUFELEdBQWdCLElBQUEsUUFBQSxDQUFTLEtBQUssQ0FBQyxhQUFmLEVBRFI7SUFBQSxDQVBWO0FBQUEsSUFVQSxVQUFBLEVBQVksU0FBQSxHQUFBO2FBQ1YsSUFBQyxDQUFBLFFBQVEsQ0FBQyxPQUFWLENBQUEsRUFEVTtJQUFBLENBVlo7R0FIRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/mark/.atom/packages/Rdio/lib/rdio.coffee
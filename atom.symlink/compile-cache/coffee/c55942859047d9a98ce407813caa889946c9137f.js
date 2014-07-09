(function() {
  var FiletypeColorView;

  FiletypeColorView = require('./filetype-color-view');

  module.exports = {
    filetypeColorView: null,
    activate: function(state) {
      return this.filetypeColorView = new FiletypeColorView(state.filetypeColorViewState);
    },
    deactivate: function() {
      return this.filetypeColorView.destroy();
    },
    serialize: function() {
      return {
        filetypeColorViewState: this.filetypeColorView.serialize()
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlCQUFBOztBQUFBLEVBQUEsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHVCQUFSLENBQXBCLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxpQkFBQSxFQUFtQixJQUFuQjtBQUFBLElBRUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO2FBQ1IsSUFBQyxDQUFBLGlCQUFELEdBQXlCLElBQUEsaUJBQUEsQ0FBa0IsS0FBSyxDQUFDLHNCQUF4QixFQURqQjtJQUFBLENBRlY7QUFBQSxJQUtBLFVBQUEsRUFBWSxTQUFBLEdBQUE7YUFDVixJQUFDLENBQUEsaUJBQWlCLENBQUMsT0FBbkIsQ0FBQSxFQURVO0lBQUEsQ0FMWjtBQUFBLElBUUEsU0FBQSxFQUFXLFNBQUEsR0FBQTthQUNUO0FBQUEsUUFBQSxzQkFBQSxFQUF3QixJQUFDLENBQUEsaUJBQWlCLENBQUMsU0FBbkIsQ0FBQSxDQUF4QjtRQURTO0lBQUEsQ0FSWDtHQUhGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/mark/.atom/packages/filetype-color/lib/filetype-color.coffee
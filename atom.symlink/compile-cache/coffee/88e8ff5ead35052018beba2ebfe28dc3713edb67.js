(function() {
  module.exports = {
    item: function(definition, condition) {
      return atom.workspaceView.contextmenu((function(_this) {
        return function() {
          var i, item, _command, _definitions, _hasItem, _i, _j, _label, _len, _len1, _results;
          _label = definition.label;
          _command = definition.command;
          _definitions = atom.contextMenu.definitions['.overlayer'];
          for (_i = 0, _len = _definitions.length; _i < _len; _i++) {
            item = _definitions[_i];
            if (item.label === _label && item.command === _command) {
              _hasItem = true;
            }
          }
          if (condition()) {
            if (!_hasItem) {
              return _definitions.unshift({
                label: _label,
                command: _command
              });
            }
          } else {
            _results = [];
            for (i = _j = 0, _len1 = _definitions.length; _j < _len1; i = ++_j) {
              item = _definitions[i];
              if (item) {
                if (item.label === _label) {
                  _results.push(_definitions.splice(i, 1));
                } else {
                  _results.push(void 0);
                }
              }
            }
            return _results;
          }
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBSUk7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBSUk7QUFBQSxJQUFBLElBQUEsRUFBTSxTQUFDLFVBQUQsRUFBYSxTQUFiLEdBQUE7YUFBMkIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFuQixDQUErQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQzVELGNBQUEsZ0ZBQUE7QUFBQSxVQUFBLE1BQUEsR0FBUyxVQUFVLENBQUMsS0FBcEIsQ0FBQTtBQUFBLFVBQ0EsUUFBQSxHQUFXLFVBQVUsQ0FBQyxPQUR0QixDQUFBO0FBQUEsVUFHQSxZQUFBLEdBQWUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFZLENBQUEsWUFBQSxDQUg1QyxDQUFBO0FBSUEsZUFBQSxtREFBQTtvQ0FBQTtnQkFBOEMsSUFBSSxDQUFDLEtBQUwsS0FBYyxNQUFkLElBQXlCLElBQUksQ0FBQyxPQUFMLEtBQWdCO0FBQXZGLGNBQUEsUUFBQSxHQUFXLElBQVg7YUFBQTtBQUFBLFdBSkE7QUFNQSxVQUFBLElBQUcsU0FBQSxDQUFBLENBQUg7QUFBb0IsWUFBQSxJQUFBLENBQUEsUUFBQTtxQkFDaEIsWUFBWSxDQUFDLE9BQWIsQ0FDSTtBQUFBLGdCQUFBLEtBQUEsRUFBTyxNQUFQO0FBQUEsZ0JBQ0EsT0FBQSxFQUFTLFFBRFQ7ZUFESixFQURnQjthQUFwQjtXQUFBLE1BQUE7QUFJSztpQkFBQSw2REFBQTtxQ0FBQTtrQkFBaUM7QUFDbEMsZ0JBQUEsSUFBRyxJQUFJLENBQUMsS0FBTCxLQUFjLE1BQWpCO2dDQUNJLFlBQVksQ0FBQyxNQUFiLENBQW9CLENBQXBCLEVBQXVCLENBQXZCLEdBREo7aUJBQUEsTUFBQTt3Q0FBQTs7ZUFEQztBQUFBOzRCQUpMO1dBUDREO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBL0IsRUFBM0I7SUFBQSxDQUFOO0dBSkosQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/mark/.atom/packages/color-picker/lib/conditional-contextmenu.coffee
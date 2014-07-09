(function() {
  var AutocompleteView, Provider, Suggestion, _;

  _ = require("underscore-plus");

  AutocompleteView = require("./autocomplete-view");

  Provider = require("./provider");

  Suggestion = require("./suggestion");

  module.exports = {
    configDefaults: {
      includeCompletionsFromAllBuffers: false,
      fileBlacklist: ".*, *.md",
      enableAutoActivation: true,
      autoActivationDelay: 100
    },
    autocompleteViews: [],
    editorSubscription: null,
    activate: function() {
      if (atom.packages.isPackageLoaded("autosave") && atom.config.get("autosave.enabled") && atom.config.get("autocomplete-plus.enableAutoActivation")) {
        atom.config.set("autocomplete-plus.enableAutoActivation", false);
        alert("Warning from autocomplete+:\n\nautocomplete+ is not compatible with the autosave package when the auto-activation feature is enabled. Therefore, auto-activation has been disabled.\n\nautocomplete+ can now only be triggered using the keyboard shortcut `ctrl+space`.");
      }
      return this.editorSubscription = atom.workspaceView.eachEditorView((function(_this) {
        return function(editor) {
          var autocompleteView;
          if (editor.attached && !editor.mini) {
            autocompleteView = new AutocompleteView(editor);
            editor.on("editor:will-be-removed", function() {
              if (!autocompleteView.hasParent()) {
                autocompleteView.remove();
              }
              autocompleteView.dispose();
              return _.remove(_this.autocompleteViews, autocompleteView);
            });
            return _this.autocompleteViews.push(autocompleteView);
          }
        };
      })(this));
    },
    deactivate: function() {
      var _ref;
      if ((_ref = this.editorSubscription) != null) {
        _ref.off();
      }
      this.editorSubscription = null;
      this.autocompleteViews.forEach(function(autocompleteView) {
        return autocompleteView.remove();
      });
      return this.autocompleteViews = [];
    },
    registerProviderForEditorView: function(provider, editorView) {
      var autocompleteView;
      autocompleteView = _.findWhere(this.autocompleteViews, {
        editorView: editorView
      });
      if (autocompleteView == null) {
        throw new Error("Could not register provider", provider.constructor.name);
      }
      return autocompleteView.registerProvider(provider);
    },
    unregisterProvider: function(provider) {
      var view, _i, _len, _ref, _results;
      _ref = this.autocompleteViews;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view = _ref[_i];
        _results.push(view.unregisterProvider);
      }
      return _results;
    },
    Provider: Provider,
    Suggestion: Suggestion
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlDQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQSxnQkFBQSxHQUFtQixPQUFBLENBQVEscUJBQVIsQ0FEbkIsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQUZYLENBQUE7O0FBQUEsRUFHQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FIYixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsY0FBQSxFQUNFO0FBQUEsTUFBQSxnQ0FBQSxFQUFrQyxLQUFsQztBQUFBLE1BQ0EsYUFBQSxFQUFlLFVBRGY7QUFBQSxNQUVBLG9CQUFBLEVBQXNCLElBRnRCO0FBQUEsTUFHQSxtQkFBQSxFQUFxQixHQUhyQjtLQURGO0FBQUEsSUFNQSxpQkFBQSxFQUFtQixFQU5uQjtBQUFBLElBT0Esa0JBQUEsRUFBb0IsSUFQcEI7QUFBQSxJQVVBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFHUixNQUFBLElBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFVBQTlCLENBQUEsSUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isa0JBQWhCLENBREMsSUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0NBQWhCLENBRkY7QUFHSSxRQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3Q0FBaEIsRUFBMEQsS0FBMUQsQ0FBQSxDQUFBO0FBQUEsUUFFQSxLQUFBLENBQU0sMFFBQU4sQ0FGQSxDQUhKO09BQUE7YUFXQSxJQUFDLENBQUEsa0JBQUQsR0FBc0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFuQixDQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxNQUFELEdBQUE7QUFDdEQsY0FBQSxnQkFBQTtBQUFBLFVBQUEsSUFBRyxNQUFNLENBQUMsUUFBUCxJQUFvQixDQUFBLE1BQVUsQ0FBQyxJQUFsQztBQUNFLFlBQUEsZ0JBQUEsR0FBdUIsSUFBQSxnQkFBQSxDQUFpQixNQUFqQixDQUF2QixDQUFBO0FBQUEsWUFDQSxNQUFNLENBQUMsRUFBUCxDQUFVLHdCQUFWLEVBQW9DLFNBQUEsR0FBQTtBQUNsQyxjQUFBLElBQUEsQ0FBQSxnQkFBaUQsQ0FBQyxTQUFqQixDQUFBLENBQWpDO0FBQUEsZ0JBQUEsZ0JBQWdCLENBQUMsTUFBakIsQ0FBQSxDQUFBLENBQUE7ZUFBQTtBQUFBLGNBQ0EsZ0JBQWdCLENBQUMsT0FBakIsQ0FBQSxDQURBLENBQUE7cUJBRUEsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxLQUFDLENBQUEsaUJBQVYsRUFBNkIsZ0JBQTdCLEVBSGtDO1lBQUEsQ0FBcEMsQ0FEQSxDQUFBO21CQUtBLEtBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxJQUFuQixDQUF3QixnQkFBeEIsRUFORjtXQURzRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLEVBZGQ7SUFBQSxDQVZWO0FBQUEsSUFrQ0EsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsSUFBQTs7WUFBbUIsQ0FBRSxHQUFyQixDQUFBO09BQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxrQkFBRCxHQUFzQixJQUR0QixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsaUJBQWlCLENBQUMsT0FBbkIsQ0FBMkIsU0FBQyxnQkFBRCxHQUFBO2VBQXNCLGdCQUFnQixDQUFDLE1BQWpCLENBQUEsRUFBdEI7TUFBQSxDQUEzQixDQUZBLENBQUE7YUFHQSxJQUFDLENBQUEsaUJBQUQsR0FBcUIsR0FKWDtJQUFBLENBbENaO0FBQUEsSUE2Q0EsNkJBQUEsRUFBK0IsU0FBQyxRQUFELEVBQVcsVUFBWCxHQUFBO0FBQzdCLFVBQUEsZ0JBQUE7QUFBQSxNQUFBLGdCQUFBLEdBQW1CLENBQUMsQ0FBQyxTQUFGLENBQVksSUFBQyxDQUFBLGlCQUFiLEVBQWdDO0FBQUEsUUFBQSxVQUFBLEVBQVksVUFBWjtPQUFoQyxDQUFuQixDQUFBO0FBQ0EsTUFBQSxJQUFPLHdCQUFQO0FBQ0UsY0FBVSxJQUFBLEtBQUEsQ0FBTSw2QkFBTixFQUFxQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQTFELENBQVYsQ0FERjtPQURBO2FBSUEsZ0JBQWdCLENBQUMsZ0JBQWpCLENBQWtDLFFBQWxDLEVBTDZCO0lBQUEsQ0E3Qy9CO0FBQUEsSUF3REEsa0JBQUEsRUFBb0IsU0FBQyxRQUFELEdBQUE7QUFDbEIsVUFBQSw4QkFBQTtBQUFBO0FBQUE7V0FBQSwyQ0FBQTt3QkFBQTtBQUFBLHNCQUFBLElBQUksQ0FBQyxtQkFBTCxDQUFBO0FBQUE7c0JBRGtCO0lBQUEsQ0F4RHBCO0FBQUEsSUEyREEsUUFBQSxFQUFVLFFBM0RWO0FBQUEsSUE0REEsVUFBQSxFQUFZLFVBNURaO0dBTkYsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/mark/.atom/packages/autocomplete-plus/lib/autocomplete.coffee
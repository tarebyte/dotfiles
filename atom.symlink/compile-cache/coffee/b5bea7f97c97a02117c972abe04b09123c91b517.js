(function() {
  var SearchViewModel, ViewModel, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  ViewModel = require('./view-model').ViewModel;

  module.exports = SearchViewModel = (function(_super) {
    __extends(SearchViewModel, _super);

    function SearchViewModel(searchMotion) {
      this.searchMotion = searchMotion;
      this.confirm = __bind(this.confirm, this);
      this.decreaseHistorySearch = __bind(this.decreaseHistorySearch, this);
      this.increaseHistorySearch = __bind(this.increaseHistorySearch, this);
      SearchViewModel.__super__.constructor.call(this, this.searchMotion, {
        "class": 'search'
      });
      this.historyIndex = -1;
      this.view.editor.on('core:move-up', this.increaseHistorySearch);
      this.view.editor.on('core:move-down', this.decreaseHistorySearch);
    }

    SearchViewModel.prototype.restoreHistory = function(index) {
      return this.view.editor.setText(this.history(index).value);
    };

    SearchViewModel.prototype.history = function(index) {
      return this.vimState.getSearchHistoryItem(index);
    };

    SearchViewModel.prototype.increaseHistorySearch = function() {
      if (this.history(this.historyIndex + 1) != null) {
        this.historyIndex += 1;
        return this.restoreHistory(this.historyIndex);
      }
    };

    SearchViewModel.prototype.decreaseHistorySearch = function() {
      if (this.historyIndex <= 0) {
        this.historyIndex = -1;
        return this.view.editor.setText('');
      } else {
        this.historyIndex -= 1;
        return this.restoreHistory(this.historyIndex);
      }
    };

    SearchViewModel.prototype.confirm = function(view) {
      this.vimState.pushSearchHistory(this);
      return SearchViewModel.__super__.confirm.call(this, view);
    };

    return SearchViewModel;

  })(ViewModel);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZCQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQyxZQUFhLE9BQUEsQ0FBUSxjQUFSLEVBQWIsU0FERCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHNDQUFBLENBQUE7O0FBQWEsSUFBQSx5QkFBRSxZQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxlQUFBLFlBQ2IsQ0FBQTtBQUFBLCtDQUFBLENBQUE7QUFBQSwyRUFBQSxDQUFBO0FBQUEsMkVBQUEsQ0FBQTtBQUFBLE1BQUEsaURBQU0sSUFBQyxDQUFBLFlBQVAsRUFBcUI7QUFBQSxRQUFBLE9BQUEsRUFBTyxRQUFQO09BQXJCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsQ0FBQSxDQURoQixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFiLENBQWdCLGNBQWhCLEVBQWdDLElBQUMsQ0FBQSxxQkFBakMsQ0FIQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFiLENBQWdCLGdCQUFoQixFQUFrQyxJQUFDLENBQUEscUJBQW5DLENBSkEsQ0FEVztJQUFBLENBQWI7O0FBQUEsOEJBT0EsY0FBQSxHQUFnQixTQUFDLEtBQUQsR0FBQTthQUNkLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQWIsQ0FBcUIsSUFBQyxDQUFBLE9BQUQsQ0FBUyxLQUFULENBQWUsQ0FBQyxLQUFyQyxFQURjO0lBQUEsQ0FQaEIsQ0FBQTs7QUFBQSw4QkFVQSxPQUFBLEdBQVMsU0FBQyxLQUFELEdBQUE7YUFDUCxJQUFDLENBQUEsUUFBUSxDQUFDLG9CQUFWLENBQStCLEtBQS9CLEVBRE87SUFBQSxDQVZULENBQUE7O0FBQUEsOEJBYUEscUJBQUEsR0FBdUIsU0FBQSxHQUFBO0FBQ3JCLE1BQUEsSUFBRywyQ0FBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLFlBQUQsSUFBaUIsQ0FBakIsQ0FBQTtlQUNBLElBQUMsQ0FBQSxjQUFELENBQWdCLElBQUMsQ0FBQSxZQUFqQixFQUZGO09BRHFCO0lBQUEsQ0FidkIsQ0FBQTs7QUFBQSw4QkFrQkEscUJBQUEsR0FBdUIsU0FBQSxHQUFBO0FBQ3JCLE1BQUEsSUFBRyxJQUFDLENBQUEsWUFBRCxJQUFpQixDQUFwQjtBQUVFLFFBQUEsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsQ0FBQSxDQUFoQixDQUFBO2VBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBYixDQUFxQixFQUFyQixFQUhGO09BQUEsTUFBQTtBQUtFLFFBQUEsSUFBQyxDQUFBLFlBQUQsSUFBaUIsQ0FBakIsQ0FBQTtlQUNBLElBQUMsQ0FBQSxjQUFELENBQWdCLElBQUMsQ0FBQSxZQUFqQixFQU5GO09BRHFCO0lBQUEsQ0FsQnZCLENBQUE7O0FBQUEsOEJBMkJBLE9BQUEsR0FBUyxTQUFDLElBQUQsR0FBQTtBQUNQLE1BQUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxpQkFBVixDQUE0QixJQUE1QixDQUFBLENBQUE7YUFDQSw2Q0FBTSxJQUFOLEVBRk87SUFBQSxDQTNCVCxDQUFBOzsyQkFBQTs7S0FENEIsVUFKOUIsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/mark/.atom/packages/vim-mode/lib/view-models/search-view-model.coffee
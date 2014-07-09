(function() {
  var SearchViewModel, VimCommandModeInputView, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore-plus');

  VimCommandModeInputView = require('./vim-command-mode-input-view');

  module.exports = SearchViewModel = (function() {
    function SearchViewModel(searchMotion) {
      this.searchMotion = searchMotion;
      this.select = __bind(this.select, this);
      this.execute = __bind(this.execute, this);
      this.repeat = __bind(this.repeat, this);
      this.confirm = __bind(this.confirm, this);
      this.reversed = __bind(this.reversed, this);
      this.decreaseHistorySearch = __bind(this.decreaseHistorySearch, this);
      this.increaseHistorySearch = __bind(this.increaseHistorySearch, this);
      this.historyIndex = -1;
      this.editorView = this.searchMotion.editorView;
      this.editor = this.searchMotion.editor;
      this.vimState = this.searchMotion.state;
      this.view = new VimCommandModeInputView(this, {
        "class": 'search'
      });
      this.editorView.editor.commandModeInputView = this.view;
      this.view.editor.on('core:move-up', this.increaseHistorySearch);
      this.view.editor.on('core:move-down', this.decreaseHistorySearch);
    }

    SearchViewModel.prototype.restoreHistory = function(index) {
      return this.view.editor.setText(this.history(index).searchTerm);
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

    SearchViewModel.prototype.reversed = function() {
      return this.initiallyReversed = this.reverse = true;
    };

    SearchViewModel.prototype.confirm = function(view) {
      this.searchTerm = view.value;
      this.vimState.pushSearchHistory(this);
      return this.editorView.trigger('vim-mode:search-complete');
    };

    SearchViewModel.prototype.repeat = function(opts) {
      var reverse;
      reverse = opts.backwards;
      if (this.initiallyReversed && reverse) {
        return this.reverse = false;
      } else {
        return this.reverse = reverse || this.initiallyReversed;
      }
    };

    SearchViewModel.prototype.execute = function(count) {
      this.scan();
      return this.match(count, (function(_this) {
        return function(pos) {
          return _this.editor.setCursorBufferPosition(pos);
        };
      })(this));
    };

    SearchViewModel.prototype.select = function(count) {
      var cur;
      this.scan();
      cur = this.editor.getCursorBufferPosition();
      this.match(count, (function(_this) {
        return function(pos) {
          return _this.editor.setSelectedBufferRange([cur, pos]);
        };
      })(this));
      return [true];
    };

    SearchViewModel.prototype.match = function(count, callback) {
      var pos;
      pos = this.matches[(count - 1) % this.matches.length];
      if (pos != null) {
        return callback(pos);
      } else {
        return atom.beep();
      }
    };

    SearchViewModel.prototype.scan = function() {
      var after, cur, iterator, matchPoints, previous, regexp, term;
      term = this.searchTerm;
      regexp = new RegExp(term, 'g');
      cur = this.editor.getCursorBufferPosition();
      matchPoints = [];
      iterator = (function(_this) {
        return function(item) {
          return matchPoints.push(item.range.start);
        };
      })(this);
      this.editor.scan(regexp, iterator);
      previous = _.filter(matchPoints, (function(_this) {
        return function(point) {
          if (_this.reverse) {
            return point.compare(cur) < 0;
          } else {
            return point.compare(cur) <= 0;
          }
        };
      })(this));
      after = _.difference(matchPoints, previous);
      after.push.apply(after, previous);
      if (this.reverse) {
        after = after.reverse();
      }
      return this.matches = after;
    };

    return SearchViewModel;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJDQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLHVCQUFBLEdBQTBCLE9BQUEsQ0FBUSwrQkFBUixDQUQxQixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FLTTtBQUNTLElBQUEseUJBQUUsWUFBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsZUFBQSxZQUNiLENBQUE7QUFBQSw2Q0FBQSxDQUFBO0FBQUEsK0NBQUEsQ0FBQTtBQUFBLDZDQUFBLENBQUE7QUFBQSwrQ0FBQSxDQUFBO0FBQUEsaURBQUEsQ0FBQTtBQUFBLDJFQUFBLENBQUE7QUFBQSwyRUFBQSxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsWUFBRCxHQUFnQixDQUFBLENBQWhCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBQyxDQUFBLFlBQVksQ0FBQyxVQUQ1QixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsTUFBRCxHQUFjLElBQUMsQ0FBQSxZQUFZLENBQUMsTUFGNUIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFFBQUQsR0FBYyxJQUFDLENBQUEsWUFBWSxDQUFDLEtBSDVCLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxJQUFELEdBQVksSUFBQSx1QkFBQSxDQUF3QixJQUF4QixFQUEyQjtBQUFBLFFBQUEsT0FBQSxFQUFPLFFBQVA7T0FBM0IsQ0FMWixDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsVUFBVSxDQUFDLE1BQU0sQ0FBQyxvQkFBbkIsR0FBMEMsSUFBQyxDQUFBLElBTjNDLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQWIsQ0FBZ0IsY0FB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
//# sourceURL=/Users/mark/.atom/packages/vim-mode/lib/search-view-model.coffee
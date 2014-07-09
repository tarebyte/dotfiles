(function() {
  var Scroll, ScrollDown, ScrollUp,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Scroll = (function() {
    Scroll.prototype.isComplete = function() {
      return true;
    };

    Scroll.prototype.isRecordable = function() {
      return false;
    };

    function Scroll(editorView, editor) {
      this.editorView = editorView;
      this.editor = editor;
      this.scrolloff = 2;
    }

    return Scroll;

  })();

  ScrollDown = (function(_super) {
    __extends(ScrollDown, _super);

    function ScrollDown() {
      return ScrollDown.__super__.constructor.apply(this, arguments);
    }

    ScrollDown.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      this.keepCursorOnScreen(count);
      return this.scrollUp(count);
    };

    ScrollDown.prototype.keepCursorOnScreen = function(count) {
      var column, firstScreenRow, row, _ref;
      _ref = this.editor.getCursorScreenPosition(), row = _ref.row, column = _ref.column;
      firstScreenRow = this.editorView.getFirstVisibleScreenRow() + this.scrolloff + 1;
      if (row - count <= firstScreenRow) {
        return this.editor.setCursorScreenPosition([firstScreenRow + count, column]);
      }
    };

    ScrollDown.prototype.scrollUp = function(count) {
      var lastScreenRow;
      lastScreenRow = this.editorView.getLastVisibleScreenRow() - this.scrolloff;
      return this.editorView.scrollToScreenPosition([lastScreenRow + count, 0]);
    };

    return ScrollDown;

  })(Scroll);

  ScrollUp = (function(_super) {
    __extends(ScrollUp, _super);

    function ScrollUp() {
      return ScrollUp.__super__.constructor.apply(this, arguments);
    }

    ScrollUp.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      this.keepCursorOnScreen(count);
      return this.scrollDown(count);
    };

    ScrollUp.prototype.keepCursorOnScreen = function(count) {
      var column, lastScreenRow, row, _ref;
      _ref = this.editor.getCursorScreenPosition(), row = _ref.row, column = _ref.column;
      lastScreenRow = this.editorView.getLastVisibleScreenRow() - this.scrolloff - 1;
      if (row + count >= lastScreenRow) {
        return this.editor.setCursorScreenPosition([lastScreenRow - count, column]);
      }
    };

    ScrollUp.prototype.scrollDown = function(count) {
      var firstScreenRow;
      firstScreenRow = this.editorView.getFirstVisibleScreenRow() + this.scrolloff;
      return this.editorView.scrollToScreenPosition([firstScreenRow - count, 0]);
    };

    return ScrollUp;

  })(Scroll);

  module.exports = {
    ScrollDown: ScrollDown,
    ScrollUp: ScrollUp
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBTTtBQUNKLHFCQUFBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFBRyxLQUFIO0lBQUEsQ0FBWixDQUFBOztBQUFBLHFCQUNBLFlBQUEsR0FBYyxTQUFBLEdBQUE7YUFBRyxNQUFIO0lBQUEsQ0FEZCxDQUFBOztBQUVhLElBQUEsZ0JBQUUsVUFBRixFQUFlLE1BQWYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLGFBQUEsVUFDYixDQUFBO0FBQUEsTUFEeUIsSUFBQyxDQUFBLFNBQUEsTUFDMUIsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxDQUFiLENBRFc7SUFBQSxDQUZiOztrQkFBQTs7TUFERixDQUFBOztBQUFBLEVBTU07QUFDSixpQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEseUJBQUEsT0FBQSxHQUFTLFNBQUMsS0FBRCxHQUFBOztRQUFDLFFBQU07T0FDZDtBQUFBLE1BQUEsSUFBQyxDQUFBLGtCQUFELENBQW9CLEtBQXBCLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxRQUFELENBQVUsS0FBVixFQUZPO0lBQUEsQ0FBVCxDQUFBOztBQUFBLHlCQUlBLGtCQUFBLEdBQW9CLFNBQUMsS0FBRCxHQUFBO0FBQ2xCLFVBQUEsaUNBQUE7QUFBQSxNQUFBLE9BQWdCLElBQUMsQ0FBQSxNQUFNLENBQUMsdUJBQVIsQ0FBQSxDQUFoQixFQUFDLFdBQUEsR0FBRCxFQUFNLGNBQUEsTUFBTixDQUFBO0FBQUEsTUFDQSxjQUFBLEdBQWlCLElBQUMsQ0FBQSxVQUFVLENBQUMsd0JBQVosQ0FBQSxDQUFBLEdBQXlDLElBQUMsQ0FBQSxTQUExQyxHQUFzRCxDQUR2RSxDQUFBO0FBRUEsTUFBQSxJQUFHLEdBQUEsR0FBTSxLQUFOLElBQWUsY0FBbEI7ZUFDRSxJQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQWdDLENBQUMsY0FBQSxHQUFpQixLQUFsQixFQUF5QixNQUF6QixDQUFoQyxFQURGO09BSGtCO0lBQUEsQ0FKcEIsQ0FBQTs7QUFBQSx5QkFVQSxRQUFBLEdBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixVQUFBLGFBQUE7QUFBQSxNQUFBLGFBQUEsR0FBZ0IsSUFBQyxDQUFBLFVBQVUsQ0FBQyx1QkFBWixDQUFBLENBQUEsR0FBd0MsSUFBQyxDQUFBLFNBQXpELENBQUE7YUFDQSxJQUFDLENBQUEsVUFBVSxDQUFDLHNCQUFaLENBQW1DLENBQUMsYUFBQSxHQUFnQixLQUFqQixFQUF3QixDQUF4QixDQUFuQyxFQUZRO0lBQUEsQ0FWVixDQUFBOztzQkFBQTs7S0FEdUIsT0FOekIsQ0FBQTs7QUFBQSxFQXFCTTtBQUNKLCtCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx1QkFBQSxPQUFBLEdBQVMsU0FBQyxLQUFELEdBQUE7O1FBQUMsUUFBTTtPQUNkO0FBQUEsTUFBQSxJQUFDLENBQUEsa0JBQUQsQ0FBb0IsS0FBcEIsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLFVBQUQsQ0FBWSxLQUFaLEVBRk87SUFBQSxDQUFULENBQUE7O0FBQUEsdUJBSUEsa0JBQUEsR0FBb0IsU0FBQyxLQUFELEdBQUE7QUFDbEIsVUFBQSxnQ0FBQTtBQUFBLE1BQUEsT0FBZ0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyx1QkFBUixDQUFBLENBQWhCLEVBQUMsV0FBQSxHQUFELEVBQU0sY0FBQSxNQUFOLENBQUE7QUFBQSxNQUNBLGFBQUEsR0FBZ0IsSUFBQyxDQUFBLFVBQVUsQ0FBQyx1QkFBWixDQUFBLENBQUEsR0FBd0MsSUFBQyxDQUFBLFNBQXpDLEdBQXFELENBRHJFLENBQUE7QUFFQSxNQUFBLElBQUcsR0FBQSxHQUFNLEtBQU4sSUFBZSxhQUFsQjtlQUNJLElBQUMsQ0FBQSxNQUFNLENBQUMsdUJBQVIsQ0FBZ0MsQ0FBQyxhQUFBLEdBQWdCLEtBQWpCLEVBQXdCLE1BQXhCLENBQWhDLEVBREo7T0FIa0I7SUFBQSxDQUpwQixDQUFBOztBQUFBLHVCQVVBLFVBQUEsR0FBWSxTQUFDLEtBQUQsR0FBQTtBQUNWLFVBQUEsY0FBQTtBQUFBLE1BQUEsY0FBQSxHQUFpQixJQUFDLENBQUEsVUFBVSxDQUFDLHdCQUFaLENBQUEsQ0FBQSxHQUF5QyxJQUFDLENBQUEsU0FBM0QsQ0FBQTthQUNBLElBQUMsQ0FBQSxVQUFVLENBQUMsc0JBQVosQ0FBbUMsQ0FBQyxjQUFBLEdBQWlCLEtBQWxCLEVBQXlCLENBQXpCLENBQW5DLEVBRlU7SUFBQSxDQVZaLENBQUE7O29CQUFBOztLQURxQixPQXJCdkIsQ0FBQTs7QUFBQSxFQW9DQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtBQUFBLElBQUUsWUFBQSxVQUFGO0FBQUEsSUFBYyxVQUFBLFFBQWQ7R0FwQ2pCLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/mark/.atom/packages/vim-mode/lib/scroll.coffee
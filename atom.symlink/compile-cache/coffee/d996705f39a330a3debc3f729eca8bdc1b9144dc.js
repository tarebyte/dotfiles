(function() {
  var FocusAction, FocusPaneViewAbove, FocusPaneViewBelow, FocusPaneViewOnLeft, FocusPaneViewOnRight, FocusPreviousPaneView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FocusAction = (function() {
    function FocusAction() {}

    FocusAction.prototype.isComplete = function() {
      return true;
    };

    FocusAction.prototype.isRecordable = function() {
      return false;
    };

    FocusAction.prototype.focusCursor = function() {
      var cursorPosition, editor, editorView;
      editor = atom.workspaceView.getActivePaneItem();
      editorView = atom.workspaceView.getActiveView();
      if ((editor != null) && (editorView != null)) {
        cursorPosition = editor.getCursorBufferPosition();
        return editorView.scrollToBufferPosition(cursorPosition);
      }
    };

    return FocusAction;

  })();

  FocusPaneViewOnLeft = (function(_super) {
    __extends(FocusPaneViewOnLeft, _super);

    function FocusPaneViewOnLeft() {
      return FocusPaneViewOnLeft.__super__.constructor.apply(this, arguments);
    }

    FocusPaneViewOnLeft.prototype.execute = function() {
      atom.workspaceView.focusPaneViewOnLeft();
      return this.focusCursor();
    };

    return FocusPaneViewOnLeft;

  })(FocusAction);

  FocusPaneViewOnRight = (function(_super) {
    __extends(FocusPaneViewOnRight, _super);

    function FocusPaneViewOnRight() {
      return FocusPaneViewOnRight.__super__.constructor.apply(this, arguments);
    }

    FocusPaneViewOnRight.prototype.execute = function() {
      atom.workspaceView.focusPaneViewOnRight();
      return this.focusCursor();
    };

    return FocusPaneViewOnRight;

  })(FocusAction);

  FocusPaneViewAbove = (function(_super) {
    __extends(FocusPaneViewAbove, _super);

    function FocusPaneViewAbove() {
      return FocusPaneViewAbove.__super__.constructor.apply(this, arguments);
    }

    FocusPaneViewAbove.prototype.execute = function() {
      atom.workspaceView.focusPaneViewAbove();
      return this.focusCursor();
    };

    return FocusPaneViewAbove;

  })(FocusAction);

  FocusPaneViewBelow = (function(_super) {
    __extends(FocusPaneViewBelow, _super);

    function FocusPaneViewBelow() {
      return FocusPaneViewBelow.__super__.constructor.apply(this, arguments);
    }

    FocusPaneViewBelow.prototype.execute = function() {
      atom.workspaceView.focusPaneViewBelow();
      return this.focusCursor();
    };

    return FocusPaneViewBelow;

  })(FocusAction);

  FocusPreviousPaneView = (function(_super) {
    __extends(FocusPreviousPaneView, _super);

    function FocusPreviousPaneView() {
      return FocusPreviousPaneView.__super__.constructor.apply(this, arguments);
    }

    FocusPreviousPaneView.prototype.execute = function() {
      atom.workspaceView.focusPreviousPaneView();
      return this.focusCursor();
    };

    return FocusPreviousPaneView;

  })(FocusAction);

  module.exports = {
    FocusPaneViewOnLeft: FocusPaneViewOnLeft,
    FocusPaneViewOnRight: FocusPaneViewOnRight,
    FocusPaneViewAbove: FocusPaneViewAbove,
    FocusPaneViewBelow: FocusPaneViewBelow,
    FocusPreviousPaneView: FocusPreviousPaneView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFIQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBTTtBQUNTLElBQUEscUJBQUEsR0FBQSxDQUFiOztBQUFBLDBCQUNBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFBRyxLQUFIO0lBQUEsQ0FEWixDQUFBOztBQUFBLDBCQUVBLFlBQUEsR0FBYyxTQUFBLEdBQUE7YUFBRyxNQUFIO0lBQUEsQ0FGZCxDQUFBOztBQUFBLDBCQUlBLFdBQUEsR0FBYSxTQUFBLEdBQUE7QUFDWCxVQUFBLGtDQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxpQkFBbkIsQ0FBQSxDQUFULENBQUE7QUFBQSxNQUNBLFVBQUEsR0FBYSxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQW5CLENBQUEsQ0FEYixDQUFBO0FBRUEsTUFBQSxJQUFHLGdCQUFBLElBQVksb0JBQWY7QUFDRSxRQUFBLGNBQUEsR0FBaUIsTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBakIsQ0FBQTtlQUNBLFVBQVUsQ0FBQyxzQkFBWCxDQUFrQyxjQUFsQyxFQUZGO09BSFc7SUFBQSxDQUpiLENBQUE7O3VCQUFBOztNQURGLENBQUE7O0FBQUEsRUFZTTtBQUNKLDBDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxrQ0FBQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLG1CQUFuQixDQUFBLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxXQUFELENBQUEsRUFGTztJQUFBLENBQVQsQ0FBQTs7K0JBQUE7O0tBRGdDLFlBWmxDLENBQUE7O0FBQUEsRUFpQk07QUFDSiwyQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsbUNBQUEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLE1BQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxvQkFBbkIsQ0FBQSxDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsV0FBRCxDQUFBLEVBRk87SUFBQSxDQUFULENBQUE7O2dDQUFBOztLQURpQyxZQWpCbkMsQ0FBQTs7QUFBQSxFQXNCTTtBQUNKLHlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxpQ0FBQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFuQixDQUFBLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxXQUFELENBQUEsRUFGTztJQUFBLENBQVQsQ0FBQTs7OEJBQUE7O0tBRCtCLFlBdEJqQyxDQUFBOztBQUFBLEVBMkJNO0FBQ0oseUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLGlDQUFBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxNQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsa0JBQW5CLENBQUEsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLFdBQUQsQ0FBQSxFQUZPO0lBQUEsQ0FBVCxDQUFBOzs4QkFBQTs7S0FEK0IsWUEzQmpDLENBQUE7O0FBQUEsRUFnQ007QUFDSiw0Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsb0NBQUEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLE1BQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxxQkFBbkIsQ0FBQSxDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsV0FBRCxDQUFBLEVBRk87SUFBQSxDQUFULENBQUE7O2lDQUFBOztLQURrQyxZQWhDcEMsQ0FBQTs7QUFBQSxFQXFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtBQUFBLElBQUUscUJBQUEsbUJBQUY7QUFBQSxJQUF1QixzQkFBQSxvQkFBdkI7QUFBQSxJQUNmLG9CQUFBLGtCQURlO0FBQUEsSUFDSyxvQkFBQSxrQkFETDtBQUFBLElBQ3lCLHVCQUFBLHFCQUR6QjtHQXJDakIsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/mark/.atom/packages/vim-mode/lib/panes.coffee
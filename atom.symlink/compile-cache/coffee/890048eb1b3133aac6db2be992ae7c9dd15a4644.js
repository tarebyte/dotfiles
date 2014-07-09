(function() {
  var Command, Insert, InsertAboveWithNewline, InsertAfter, InsertBelowWithNewline, Substitute, SubstituteLine, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  Command = (function() {
    function Command(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
    }

    Command.prototype.isComplete = function() {
      return true;
    };

    Command.prototype.isRecordable = function() {
      return false;
    };

    return Command;

  })();

  Insert = (function(_super) {
    __extends(Insert, _super);

    function Insert() {
      return Insert.__super__.constructor.apply(this, arguments);
    }

    Insert.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return this.vimState.activateInsertMode();
    };

    return Insert;

  })(Command);

  InsertAfter = (function(_super) {
    __extends(InsertAfter, _super);

    function InsertAfter() {
      return InsertAfter.__super__.constructor.apply(this, arguments);
    }

    InsertAfter.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      this.vimState.activateInsertMode();
      if (!this.editor.getCursor().isAtEndOfLine()) {
        return this.editor.moveCursorRight();
      }
    };

    return InsertAfter;

  })(Command);

  InsertAboveWithNewline = (function(_super) {
    __extends(InsertAboveWithNewline, _super);

    function InsertAboveWithNewline() {
      return InsertAboveWithNewline.__super__.constructor.apply(this, arguments);
    }

    InsertAboveWithNewline.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      this.vimState.activateInsertMode();
      this.editor.insertNewlineAbove();
      return this.editor.getCursor().skipLeadingWhitespace();
    };

    return InsertAboveWithNewline;

  })(Command);

  InsertBelowWithNewline = (function(_super) {
    __extends(InsertBelowWithNewline, _super);

    function InsertBelowWithNewline() {
      return InsertBelowWithNewline.__super__.constructor.apply(this, arguments);
    }

    InsertBelowWithNewline.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      this.vimState.activateInsertMode();
      this.editor.insertNewlineBelow();
      return this.editor.getCursor().skipLeadingWhitespace();
    };

    return InsertBelowWithNewline;

  })(Command);

  Substitute = (function(_super) {
    __extends(Substitute, _super);

    function Substitute() {
      return Substitute.__super__.constructor.apply(this, arguments);
    }

    Substitute.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      _.times(count, (function(_this) {
        return function() {
          return _this.editor.selectRight();
        };
      })(this));
      this.editor["delete"]();
      return this.vimState.activateInsertMode();
    };

    return Substitute;

  })(Command);

  SubstituteLine = (function(_super) {
    __extends(SubstituteLine, _super);

    function SubstituteLine() {
      return SubstituteLine.__super__.constructor.apply(this, arguments);
    }

    SubstituteLine.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      this.editor.moveCursorToBeginningOfLine();
      _.times(count, (function(_this) {
        return function() {
          return _this.editor.selectDown();
        };
      })(this));
      this.editor["delete"]();
      this.editor.insertNewline();
      this.editor.moveCursorUp();
      return this.vimState.activateInsertMode();
    };

    return SubstituteLine;

  })(Command);

  module.exports = {
    Insert: Insert,
    InsertAfter: InsertAfter,
    InsertAboveWithNewline: InsertAboveWithNewline,
    InsertBelowWithNewline: InsertBelowWithNewline,
    Substitute: Substitute,
    SubstituteLine: SubstituteLine
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJHQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUVNO0FBQ1MsSUFBQSxpQkFBRSxNQUFGLEVBQVcsUUFBWCxHQUFBO0FBQXNCLE1BQXJCLElBQUMsQ0FBQSxTQUFBLE1BQW9CLENBQUE7QUFBQSxNQUFaLElBQUMsQ0FBQSxXQUFBLFFBQVcsQ0FBdEI7SUFBQSxDQUFiOztBQUFBLHNCQUNBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFBRyxLQUFIO0lBQUEsQ0FEWixDQUFBOztBQUFBLHNCQUVBLFlBQUEsR0FBYyxTQUFBLEdBQUE7YUFBRyxNQUFIO0lBQUEsQ0FGZCxDQUFBOzttQkFBQTs7TUFIRixDQUFBOztBQUFBLEVBT007QUFDSiw2QkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEscUJBQUEsT0FBQSxHQUFTLFNBQUMsS0FBRCxHQUFBOztRQUFDLFFBQU07T0FDZDthQUFBLElBQUMsQ0FBQSxRQUFRLENBQUMsa0JBQVYsQ0FBQSxFQURPO0lBQUEsQ0FBVCxDQUFBOztrQkFBQTs7S0FEbUIsUUFQckIsQ0FBQTs7QUFBQSxFQVdNO0FBQ0osa0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLDBCQUFBLE9BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTs7UUFBQyxRQUFNO09BQ2Q7QUFBQSxNQUFBLElBQUMsQ0FBQSxRQUFRLENBQUMsa0JBQVYsQ0FBQSxDQUFBLENBQUE7QUFDQSxNQUFBLElBQUEsQ0FBQSxJQUFrQyxDQUFBLE1BQU0sQ0FBQyxTQUFSLENBQUEsQ0FBbUIsQ0FBQyxhQUFwQixDQUFBLENBQWpDO2VBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxlQUFSLENBQUEsRUFBQTtPQUZPO0lBQUEsQ0FBVCxDQUFBOzt1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
//# sourceURL=/Users/mark/.atom/packages/vim-mode/lib/commands.coffee
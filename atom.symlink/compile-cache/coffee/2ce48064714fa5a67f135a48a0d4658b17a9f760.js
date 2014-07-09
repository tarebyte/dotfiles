(function() {
  var Change, Delete, Insert, InsertAboveWithNewline, InsertAfter, InsertBelowWithNewline, Operator, Substitute, SubstituteLine, TransactionBundler, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('./general-operators'), Operator = _ref.Operator, Delete = _ref.Delete;

  _ = require('underscore-plus');

  Insert = (function(_super) {
    __extends(Insert, _super);

    function Insert() {
      return Insert.__super__.constructor.apply(this, arguments);
    }

    Insert.prototype.standalone = true;

    Insert.prototype.isComplete = function() {
      return this.standalone || Insert.__super__.isComplete.apply(this, arguments);
    };

    Insert.prototype.confirmTransaction = function(transaction) {
      var bundler;
      bundler = new TransactionBundler(transaction);
      return this.typedText = bundler.buildInsertText();
    };

    Insert.prototype.execute = function() {
      if (this.typingCompleted) {
        if (!((this.typedText != null) && this.typedText.length > 0)) {
          return;
        }
        return this.undoTransaction((function(_this) {
          return function() {
            return _this.editor.getBuffer().insert(_this.editor.getCursorBufferPosition(), _this.typedText, true);
          };
        })(this));
      } else {
        this.vimState.activateInsertMode();
        return this.typingCompleted = true;
      }
    };

    Insert.prototype.inputOperator = function() {
      return true;
    };

    return Insert;

  })(Operator);

  InsertAfter = (function(_super) {
    __extends(InsertAfter, _super);

    function InsertAfter() {
      return InsertAfter.__super__.constructor.apply(this, arguments);
    }

    InsertAfter.prototype.execute = function() {
      if (!this.editor.getCursor().isAtEndOfLine()) {
        this.editor.moveCursorRight();
      }
      return InsertAfter.__super__.execute.apply(this, arguments);
    };

    return InsertAfter;

  })(Insert);

  InsertAboveWithNewline = (function(_super) {
    __extends(InsertAboveWithNewline, _super);

    function InsertAboveWithNewline() {
      return InsertAboveWithNewline.__super__.constructor.apply(this, arguments);
    }

    InsertAboveWithNewline.prototype.execute = function(count) {
      var transactionStarted;
      if (count == null) {
        count = 1;
      }
      if (!this.typingCompleted) {
        this.editor.beginTransaction();
      }
      this.editor.insertNewlineAbove();
      this.editor.getCursor().skipLeadingWhitespace();
      if (this.typingCompleted) {
        this.typedText = this.typedText.trimLeft();
        return InsertAboveWithNewline.__super__.execute.apply(this, arguments);
      }
      this.vimState.activateInsertMode(transactionStarted = true);
      return this.typingCompleted = true;
    };

    return InsertAboveWithNewline;

  })(Insert);

  InsertBelowWithNewline = (function(_super) {
    __extends(InsertBelowWithNewline, _super);

    function InsertBelowWithNewline() {
      return InsertBelowWithNewline.__super__.constructor.apply(this, arguments);
    }

    InsertBelowWithNewline.prototype.execute = function(count) {
      var transactionStarted;
      if (count == null) {
        count = 1;
      }
      if (!this.typingCompleted) {
        this.editor.beginTransaction();
      }
      this.editor.insertNewlineBelow();
      this.editor.getCursor().skipLeadingWhitespace();
      if (this.typingCompleted) {
        this.typedText = this.typedText.trimLeft();
        return InsertBelowWithNewline.__super__.execute.apply(this, arguments);
      }
      this.vimState.activateInsertMode(transactionStarted = true);
      return this.typingCompleted = true;
    };

    return InsertBelowWithNewline;

  })(Insert);

  Change = (function(_super) {
    __extends(Change, _super);

    function Change() {
      return Change.__super__.constructor.apply(this, arguments);
    }

    Change.prototype.standalone = false;

    Change.prototype.execute = function(count) {
      var lastRow, onlyRow, operator, transactionStarted, _base;
      if (count == null) {
        count = 1;
      }
      if (!this.typingCompleted) {
        this.editor.beginTransaction();
      }
      operator = new Delete(this.editor, this.vimState, {
        allowEOL: true,
        selectOptions: {
          excludeWhitespace: true
        }
      });
      operator.compose(this.motion);
      lastRow = this.onLastRow();
      onlyRow = this.editor.getBuffer().getLineCount() === 1;
      operator.execute(count);
      if ((typeof (_base = this.motion).isLinewise === "function" ? _base.isLinewise() : void 0) && !onlyRow) {
        if (lastRow) {
          this.editor.insertNewlineBelow();
        } else {
          this.editor.insertNewlineAbove();
        }
      }
      if (this.typingCompleted) {
        return Change.__super__.execute.apply(this, arguments);
      }
      this.vimState.activateInsertMode(transactionStarted = true);
      return this.typingCompleted = true;
    };

    Change.prototype.onLastRow = function() {
      var column, row, _ref1;
      _ref1 = this.editor.getCursorBufferPosition(), row = _ref1.row, column = _ref1.column;
      return row === this.editor.getBuffer().getLastRow();
    };

    return Change;

  })(Insert);

  Substitute = (function(_super) {
    __extends(Substitute, _super);

    function Substitute() {
      return Substitute.__super__.constructor.apply(this, arguments);
    }

    Substitute.prototype.execute = function(count) {
      var transactionStarated;
      if (count == null) {
        count = 1;
      }
      if (!this.typingCompleted) {
        this.editor.beginTransaction();
      }
      _.times(count, (function(_this) {
        return function() {
          return _this.editor.selectRight();
        };
      })(this));
      this.editor["delete"]();
      if (this.typingCompleted) {
        this.typedText = this.typedText.trimLeft();
        return Substitute.__super__.execute.apply(this, arguments);
      }
      this.vimState.activateInsertMode(transactionStarated = true);
      return this.typingCompleted = true;
    };

    return Substitute;

  })(Insert);

  SubstituteLine = (function(_super) {
    __extends(SubstituteLine, _super);

    function SubstituteLine() {
      return SubstituteLine.__super__.constructor.apply(this, arguments);
    }

    SubstituteLine.prototype.execute = function(count) {
      var transactionStarated;
      if (count == null) {
        count = 1;
      }
      if (!this.typingCompleted) {
        this.editor.beginTransaction();
      }
      this.editor.moveCursorToBeginningOfLine();
      _.times(count, (function(_this) {
        return function() {
          return _this.editor.selectDown();
        };
      })(this));
      this.editor["delete"]();
      this.editor.insertNewlineAbove();
      this.editor.getCursor().skipLeadingWhitespace();
      if (this.typingCompleted) {
        this.typedText = this.typedText.trimLeft();
        return SubstituteLine.__super__.execute.apply(this, arguments);
      }
      this.vimState.activateInsertMode(transactionStarated = true);
      return this.typingCompleted = true;
    };

    return SubstituteLine;

  })(Insert);

  TransactionBundler = (function() {
    function TransactionBundler(transaction) {
      this.transaction = transaction;
    }

    TransactionBundler.prototype.buildInsertText = function() {
      var chars, patch, _i, _len, _ref1;
      if (!this.transaction.patches) {
        return "";
      }
      chars = [];
      _ref1 = this.transaction.patches;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        patch = _ref1[_i];
        switch (false) {
          case !this.isTypedChar(patch):
            chars.push(this.isTypedChar(patch));
            break;
          case !this.isBackspacedChar(patch):
            chars.pop();
        }
      }
      return chars.join("");
    };

    TransactionBundler.prototype.isTypedChar = function(patch) {
      var _ref1, _ref2;
      if (!(((_ref1 = patch.newText) != null ? _ref1.length : void 0) >= 1 && ((_ref2 = patch.oldText) != null ? _ref2.length : void 0) === 0)) {
        return false;
      }
      return patch.newText;
    };

    TransactionBundler.prototype.isBackspacedChar = function(patch) {
      var _ref1;
      return patch.newText === "" && ((_ref1 = patch.oldText) != null ? _ref1.length : void 0) === 1;
    };

    return TransactionBundler;

  })();

  module.exports = {
    Insert: Insert,
    InsertAfter: InsertAfter,
    InsertAboveWithNewline: InsertAboveWithNewline,
    InsertBelowWithNewline: InsertBelowWithNewline,
    Change: Change,
    Substitute: Substitute,
    SubstituteLine: SubstituteLine
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNKQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFxQixPQUFBLENBQVEscUJBQVIsQ0FBckIsRUFBQyxnQkFBQSxRQUFELEVBQVcsY0FBQSxNQUFYLENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBREosQ0FBQTs7QUFBQSxFQU9NO0FBQ0osNkJBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHFCQUFBLFVBQUEsR0FBWSxJQUFaLENBQUE7O0FBQUEscUJBRUEsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxVQUFELElBQWUsd0NBQUEsU0FBQSxFQUFsQjtJQUFBLENBRlosQ0FBQTs7QUFBQSxxQkFJQSxrQkFBQSxHQUFvQixTQUFDLFdBQUQsR0FBQTtBQUNsQixVQUFBLE9BQUE7QUFBQSxNQUFBLE9BQUEsR0FBYyxJQUFBLGtCQUFBLENBQW1CLFdBQW5CLENBQWQsQ0FBQTthQUNBLElBQUMsQ0FBQSxTQUFELEdBQWEsT0FBTyxDQUFDLGVBQVIsQ0FBQSxFQUZLO0lBQUEsQ0FKcEIsQ0FBQTs7QUFBQSxxQkFRQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFHLElBQUMsQ0FBQSxlQUFKO0FBQ0UsUUFBQSxJQUFBLENBQUEsQ0FBYyx3QkFBQSxJQUFnQixJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsR0FBb0IsQ0FBbEQsQ0FBQTtBQUFBLGdCQUFBLENBQUE7U0FBQTtlQUNBLElBQUMsQ0FBQSxlQUFELENBQWlCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUNmLEtBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUixDQUFBLENBQW1CLENBQUMsTUFBcEIsQ0FBMkIsS0FBQyxDQUFBLE1BQU0sQ0FBQyx1QkFB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
//# sourceURL=/Users/mark/.atom/packages/vim-mode/lib/operators/input.coffee
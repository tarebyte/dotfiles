(function() {
  var $$, Change, Delete, Join, Mark, Operator, OperatorError, OperatorWithInput, Range, Repeat, ToggleCase, ViewModel, Yank, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  _ref = require('atom'), $$ = _ref.$$, Range = _ref.Range;

  ViewModel = require('../view-models/view-model').ViewModel;

  OperatorError = (function() {
    function OperatorError(message) {
      this.message = message;
      this.name = 'Operator Error';
    }

    return OperatorError;

  })();

  Operator = (function() {
    Operator.prototype.vimState = null;

    Operator.prototype.motion = null;

    Operator.prototype.complete = null;

    Operator.prototype.selectOptions = null;

    function Operator(editor, vimState, _arg) {
      this.editor = editor;
      this.vimState = vimState;
      this.selectOptions = (_arg != null ? _arg : {}).selectOptions;
      this.complete = false;
    }

    Operator.prototype.isComplete = function() {
      return this.complete;
    };

    Operator.prototype.isRecordable = function() {
      return true;
    };

    Operator.prototype.compose = function(motion) {
      if (!motion.select) {
        throw new OperatorError('Must compose with a motion');
      }
      this.motion = motion;
      return this.complete = true;
    };

    Operator.prototype.canComposeWith = function(operation) {
      return operation.select != null;
    };

    Operator.prototype.undoTransaction = function(fn) {
      return this.editor.getBuffer().transact(fn);
    };

    return Operator;

  })();

  OperatorWithInput = (function(_super) {
    __extends(OperatorWithInput, _super);

    function OperatorWithInput(editorView, vimState) {
      this.editorView = editorView;
      this.vimState = vimState;
      this.editor = this.editorView.editor;
      this.complete = false;
    }

    OperatorWithInput.prototype.canComposeWith = function(operation) {
      return operation.characters != null;
    };

    OperatorWithInput.prototype.compose = function(input) {
      if (!input.characters) {
        throw new OperatorError('Must compose with an Input');
      }
      this.input = input;
      return this.complete = true;
    };

    return OperatorWithInput;

  })(Operator);

  Delete = (function(_super) {
    __extends(Delete, _super);

    Delete.prototype.allowEOL = null;

    function Delete(editor, vimState, _arg) {
      var _base, _ref1;
      this.editor = editor;
      this.vimState = vimState;
      _ref1 = _arg != null ? _arg : {}, this.allowEOL = _ref1.allowEOL, this.selectOptions = _ref1.selectOptions;
      this.complete = false;
      if (this.selectOptions == null) {
        this.selectOptions = {};
      }
      if ((_base = this.selectOptions).requireEOL == null) {
        _base.requireEOL = true;
      }
    }

    Delete.prototype.execute = function(count) {
      var cursor, validSelection, _base, _base1;
      if (count == null) {
        count = 1;
      }
      cursor = this.editor.getCursor();
      if (_.contains(this.motion.select(count, this.selectOptions), true)) {
        validSelection = true;
      }
      if (validSelection != null) {
        this.editor["delete"]();
        if (!this.allowEOL && cursor.isAtEndOfLine() && !(typeof (_base = this.motion).isLinewise === "function" ? _base.isLinewise() : void 0)) {
          this.editor.moveCursorLeft();
        }
      }
      if (typeof (_base1 = this.motion).isLinewise === "function" ? _base1.isLinewise() : void 0) {
        this.editor.setCursorScreenPosition([cursor.getScreenRow(), 0]);
      }
      return this.vimState.activateCommandMode();
    };

    return Delete;

  })(Operator);

  ToggleCase = (function(_super) {
    __extends(ToggleCase, _super);

    function ToggleCase(editor, vimState, _arg) {
      this.editor = editor;
      this.vimState = vimState;
      this.selectOptions = (_arg != null ? _arg : {}).selectOptions;
      this.complete = true;
    }

    ToggleCase.prototype.execute = function(count) {
      var lastCharIndex, pos;
      if (count == null) {
        count = 1;
      }
      pos = this.editor.getCursorBufferPosition();
      lastCharIndex = this.editor.lineLengthForBufferRow(pos.row) - 1;
      count = Math.min(count, this.editor.lineLengthForBufferRow(pos.row) - pos.column);
      if (this.editor.getBuffer().isRowBlank(pos.row)) {
        return;
      }
      this.undoTransaction((function(_this) {
        return function() {
          return _.times(count, function() {
            var char, point, range;
            point = _this.editor.getCursorBufferPosition();
            range = Range.fromPointWithDelta(point, 0, 1);
            char = _this.editor.getTextInBufferRange(range);
            if (char === char.toLowerCase()) {
              _this.editor.setTextInBufferRange(range, char.toUpperCase());
            } else {
              _this.editor.setTextInBufferRange(range, char.toLowerCase());
            }
            if (!(point.column >= lastCharIndex)) {
              return _this.editor.moveCursorRight();
            }
          });
        };
      })(this));
      return this.vimState.activateCommandMode();
    };

    return ToggleCase;

  })(Operator);

  Change = (function(_super) {
    __extends(Change, _super);

    function Change() {
      return Change.__super__.constructor.apply(this, arguments);
    }

    Change.prototype.execute = function(count) {
      var operator;
      if (count == null) {
        count = 1;
      }
      operator = new Delete(this.editor, this.vimState, {
        allowEOL: true,
        selectOptions: {
          excludeWhitespace: true
        }
      });
      operator.compose(this.motion);
      this.editor.transact((function(_this) {
        return function() {
          var lastRow, onlyRow, _base;
          lastRow = _this.onLastRow();
          onlyRow = _this.editor.getBuffer().getLineCount() === 1;
          operator.execute(count);
          if ((typeof (_base = _this.motion).isLinewise === "function" ? _base.isLinewise() : void 0) && !onlyRow) {
            if (lastRow) {
              return _this.editor.insertNewlineBelow();
            } else {
              return _this.editor.insertNewlineAbove();
            }
          }
        };
      })(this));
      return this.vimState.activateInsertMode();
    };

    Change.prototype.onLastRow = function() {
      var column, row, _ref1;
      _ref1 = this.editor.getCursorBufferPosition(), row = _ref1.row, column = _ref1.column;
      return row === this.editor.getBuffer().getLastRow();
    };

    return Change;

  })(Operator);

  Yank = (function(_super) {
    __extends(Yank, _super);

    function Yank() {
      return Yank.__super__.constructor.apply(this, arguments);
    }

    Yank.prototype.register = '"';

    Yank.prototype.execute = function(count) {
      var originalPosition, text, type, _base, _base1;
      if (count == null) {
        count = 1;
      }
      originalPosition = this.editor.getCursorScreenPosition();
      if (_.contains(this.motion.select(count), true)) {
        text = this.editor.getSelection().getText();
      } else {
        text = '';
      }
      type = (typeof (_base = this.motion).isLinewise === "function" ? _base.isLinewise() : void 0) ? 'linewise' : 'character';
      this.vimState.setRegister(this.register, {
        text: text,
        type: type
      });
      if (typeof (_base1 = this.motion).isLinewise === "function" ? _base1.isLinewise() : void 0) {
        this.editor.setCursorScreenPosition(originalPosition);
      } else {
        this.editor.clearSelections();
      }
      return this.vimState.activateCommandMode();
    };

    return Yank;

  })(Operator);

  Join = (function(_super) {
    __extends(Join, _super);

    function Join(editor, vimState, _arg) {
      this.editor = editor;
      this.vimState = vimState;
      this.selectOptions = (_arg != null ? _arg : {}).selectOptions;
      this.complete = true;
    }

    Join.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      this.undoTransaction((function(_this) {
        return function() {
          return _.times(count, function() {
            return _this.editor.joinLines();
          });
        };
      })(this));
      return this.vimState.activateCommandMode();
    };

    return Join;

  })(Operator);

  Repeat = (function(_super) {
    __extends(Repeat, _super);

    function Repeat(editor, vimState, _arg) {
      this.editor = editor;
      this.vimState = vimState;
      this.selectOptions = (_arg != null ? _arg : {}).selectOptions;
      this.complete = true;
    }

    Repeat.prototype.isRecordable = function() {
      return false;
    };

    Repeat.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return this.undoTransaction((function(_this) {
        return function() {
          return _.times(count, function() {
            var cmd;
            cmd = _this.vimState.history[0];
            return cmd != null ? cmd.execute() : void 0;
          });
        };
      })(this));
    };

    return Repeat;

  })(Operator);

  Mark = (function(_super) {
    __extends(Mark, _super);

    function Mark(editorView, vimState, _arg) {
      this.editorView = editorView;
      this.vimState = vimState;
      this.selectOptions = (_arg != null ? _arg : {}).selectOptions;
      Mark.__super__.constructor.call(this, this.editorView, this.vimState);
      this.viewModel = new ViewModel(this, {
        "class": 'mark',
        singleChar: true,
        hidden: true
      });
    }

    Mark.prototype.execute = function() {
      this.vimState.setMark(this.input.characters, this.editorView.editor.getCursorBufferPosition());
      return this.vimState.activateCommandMode();
    };

    return Mark;

  })(OperatorWithInput);

  module.exports = {
    Operator: Operator,
    OperatorWithInput: OperatorWithInput,
    OperatorError: OperatorError,
    Delete: Delete,
    ToggleCase: ToggleCase,
    Change: Change,
    Yank: Yank,
    Join: Join,
    Repeat: Repeat,
    Mark: Mark
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtIQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLE9BQWMsT0FBQSxDQUFRLE1BQVIsQ0FBZCxFQUFDLFVBQUEsRUFBRCxFQUFLLGFBQUEsS0FETCxDQUFBOztBQUFBLEVBRUMsWUFBYSxPQUFBLENBQVEsMkJBQVIsRUFBYixTQUZELENBQUE7O0FBQUEsRUFJTTtBQUNTLElBQUEsdUJBQUUsT0FBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsVUFBQSxPQUNiLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxJQUFELEdBQVEsZ0JBQVIsQ0FEVztJQUFBLENBQWI7O3lCQUFBOztNQUxGLENBQUE7O0FBQUEsRUFRTTtBQUNKLHVCQUFBLFFBQUEsR0FBVSxJQUFWLENBQUE7O0FBQUEsdUJBQ0EsTUFBQSxHQUFRLElBRFIsQ0FBQTs7QUFBQSx1QkFFQSxRQUFBLEdBQVUsSUFGVixDQUFBOztBQUFBLHVCQUdBLGFBQUEsR0FBZSxJQUhmLENBQUE7O0FBT2EsSUFBQSxrQkFBRSxNQUFGLEVBQVcsUUFBWCxFQUFxQixJQUFyQixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsU0FBQSxNQUNiLENBQUE7QUFBQSxNQURxQixJQUFDLENBQUEsV0FBQSxRQUN0QixDQUFBO0FBQUEsTUFEaUMsSUFBQyxDQUFBLGdDQUFGLE9BQWlCLElBQWYsYUFDbEMsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQUFaLENBRFc7SUFBQSxDQVBiOztBQUFBLHVCQWFBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsU0FBSjtJQUFBLENBYlosQ0FBQTs7QUFBQSx1QkFtQkEsWUFBQSxHQUFjLFNBQUEsR0FBQTthQUFHLEtBQUg7SUFBQSxDQW5CZCxDQUFBOztBQUFBLHVCQTBCQSxPQUFBLEdBQVMsU0FBQyxNQUFELEdBQUE7QUFDUCxNQUFBLElBQUcsQ0FBQSxNQUFVLENBQUMsTUFBZDtBQUNFLGNBQVUsSUFBQSxhQUFBLENBQWMsNEJBQWQsQ0FBVixDQURGO09BQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxNQUFELEdBQVUsTUFIVixDQUFBO2FBSUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQUxMO0lBQUEsQ0ExQlQsQ0FBQTs7QUFBQSx1QkFpQ0EsY0FBQSxHQUFnQixTQUFDLFNBQUQsR0FBQTthQUFlLHlCQUFmO0lBQUEsQ0FqQ2hCLENBQUE7O0FBQUEsdUJBd0NBLGVBQUEsR0FBaUIsU0FBQyxFQUFELEdBQUE7YUFDZixJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVIsQ0FBQSxDQUFtQixDQUFDLFFBQXBCLENBQTZCLEVBQTdCLEVBRGU7SUFBQSxDQXhDakIsQ0FBQTs7b0JBQUE7O01BVEYsQ0FBQTs7QUFBQSxFQXFETTtBQUNKLHdDQUFBLENBQUE7O0FBQWEsSUFBQSwyQkFBRSxVQUFGLEVBQWUsUUFBZixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsYUFBQSxVQUNiLENBQUE7QUFBQSxNQUR5QixJQUFDLENBQUEsV0FBQSxRQUMxQixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxVQUFVLENBQUMsTUFBdEIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQURaLENBRFc7SUFBQSxDQUFiOztBQUFBLGdDQUlBLGNBQUEsR0FBZ0IsU0FBQyxTQUFELEdBQUE7YUFBZSw2QkFBZjtJQUFBLENBSmhCLENBQUE7O0FBQUEsZ0NBTUEsT0FBQSxHQUFTLFNBQUMsS0FBRCxHQUFBO0FBQ1AsTUFBQSxJQUFHLENBQUEsS0FBUyxDQUFDLFVBQWI7QUFDRSxjQUFVLElBQUEsYUFBQSxDQUFjLDRCQUFkLENBQVYsQ0FERjtPQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsS0FBRCxHQUFTLEtBSFQsQ0FBQTthQUlBLElBQUMsQ0FBQSxRQUFELEdBQVksS0FMTDtJQUFBLENBTlQsQ0FBQTs7NkJBQUE7O0tBRDhCLFNBckRoQyxDQUFBOztBQUFBLEVBc0VNO0FBQ0osNkJBQUEsQ0FBQTs7QUFBQSxxQkFBQSxRQUFBLEdBQVUsSUFBVixDQUFBOztBQUlhLElBQUEsZ0JBQUUsTUFBRixFQUFXLFFBQVgsRUFBcUIsSUFBckIsR0FBQTtBQUNYLFVBQUEsWUFBQTtBQUFBLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFEcUIsSUFBQyxDQUFBLFdBQUEsUUFDdEIsQ0FBQTtBQUFBLDZCQURnQyxPQUE0QixJQUEzQixJQUFDLENBQUEsaUJBQUEsVUFBVSxJQUFDLENBQUEsc0JBQUEsYUFDN0MsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQUFaLENBQUE7O1FBQ0EsSUFBQyxDQUFBLGdCQUFpQjtPQURsQjs7YUFFYyxDQUFDLGFBQWM7T0FIbEI7SUFBQSxDQUpiOztBQUFBLHFCQWNBLE9BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTtBQUNQLFVBQUEscUNBQUE7O1FBRFEsUUFBTTtPQUNkO0FBQUEsTUFBQSxNQUFBLEdBQVMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFSLENBQUEsQ0FBVCxDQUFBO0FBRUEsTUFBQSxJQUFHLENBQUMsQ0FBQyxRQUFGLENBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLENBQWUsS0FBZixFQUFzQixJQUFDLENBQUEsYUFBdkIsQ0FBWCxFQUFrRCxJQUFsRCxDQUFIO0FBQ0UsUUFBQSxjQUFBLEdBQWlCLElBQWpCLENBREY7T0FGQTtBQUtBLE1BQUEsSUFBRyxzQkFBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFELENBQVAsQ0FBQSxDQUFBLENBQUE7QUFDQSxRQUFBLElBQUcsQ0FBQSxJQUFFLENBQUEsUUFBRixJQUFlLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBZixJQUEwQyxDQUFBLCtEQUFRLENBQUMsc0JBQXREO0FBQ0UsVUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLGNBQVIsQ0FBQSxDQUFBLENBREY7U0FGRjtPQUxBO0FBVUEsTUFBQSxvRUFBVSxDQUFDLHFCQUFYO0FBQ0UsUUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQWdDLENBQUMsTUFBTSxDQUFDLFlBQVAsQ0FBQSxDQUFELEVBQXdCLENBQXhCLENBQWhDLENBQUEsQ0FERjtPQVZBO2FBYUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxtQkFBVixDQUFBLEVBZE87SUFBQSxDQWRULENBQUE7O2tCQUFBOztLQURtQixTQXRFckIsQ0FBQTs7QUFBQSxFQXVHTTtBQUVKLGlDQUFBLENBQUE7O0FBQWEsSUFBQSxvQkFBRSxNQUFGLEVBQVcsUUFBWCxFQUFxQixJQUFyQixHQUFBO0FBQTZDLE1BQTVDLElBQUMsQ0FBQSxTQUFBLE1BQTJDLENBQUE7QUFBQSxNQUFuQyxJQUFDLENBQUEsV0FBQSxRQUFrQyxDQUFBO0FBQUEsTUFBdkIsSUFBQyxDQUFBLGdDQUFGLE9BQWlCLElBQWYsYUFBc0IsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFaLENBQTdDO0lBQUEsQ0FBYjs7QUFBQSx5QkFFQSxPQUFBLEdBQVMsU0FBQyxLQUFELEdBQUE7QUFDUCxVQUFBLGtCQUFBOztRQURRLFFBQU07T0FDZDtBQUFBLE1BQUEsR0FBQSxHQUFNLElBQUMsQ0FBQSxNQUFNLENBQUMsdUJBQVIsQ0FBQSxDQUFOLENBQUE7QUFBQSxNQUNBLGFBQUEsR0FBZ0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxzQkFBUixDQUErQixHQUFHLENBQUMsR0FBbkMsQ0FBQSxHQUEwQyxDQUQxRCxDQUFBO0FBQUEsTUFFQSxLQUFBLEdBQVEsSUFBSSxDQUFDLEdBQUwsQ0FBUyxLQUFULEVBQWdCLElBQUMsQ0FBQSxNQUFNLENBQUMsc0JBQVIsQ0FBK0IsR0FBRyxDQUFDLEdBQW5DLENBQUEsR0FBMEMsR0FBRyxDQUFDLE1BQTlELENBRlIsQ0FBQTtBQUtBLE1BQUEsSUFBVSxJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVIsQ0FBQSxDQUFtQixDQUFDLFVBQXBCLENBQStCLEdBQUcsQ0FBQyxHQUFuQyxDQUFWO0FBQUEsY0FBQSxDQUFBO09BTEE7QUFBQSxNQU9BLElBQUMsQ0FBQSxlQUFELENBQWlCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ2YsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxLQUFSLEVBQWUsU0FBQSxHQUFBO0FBQ2IsZ0JBQUEsa0JBQUE7QUFBQSxZQUFBLEtBQUEsR0FBUSxLQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQUEsQ0FBUixDQUFBO0FBQUEsWUFDQSxLQUFBLEdBQVEsS0FBSyxDQUFDLGtCQUFOLENBQXlCLEtBQXpCLEVBQWdDLENBQWhDLEVBQW1DLENBQW5DLENBRFIsQ0FBQTtBQUFBLFlBRUEsSUFBQSxHQUFPLEtBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsS0FBN0IsQ0FGUCxDQUFBO0FBSUEsWUFBQSxJQUFHLElBQUEsS0FBUSxJQUFJLENBQUMsV0FBTCxDQUFBLENBQVg7QUFDRSxjQUFBLEtBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsS0FBN0IsRUFBb0MsSUFBSSxDQUFDLFdBQUwsQ0FBQSxDQUFwQyxDQUFBLENBREY7YUFBQSxNQUFBO0FBR0UsY0FBQSxLQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQTZCLEtBQTdCLEVBQW9DLElBQUksQ0FBQyxXQUFMLENBQUEsQ0FBcEMsQ0FBQSxDQUhGO2FBSkE7QUFTQSxZQUFBLElBQUEsQ0FBQSxDQUFPLEtBQUssQ0FBQyxNQUFOLElBQWdCLGFBQXZCLENBQUE7cUJBQ0UsS0FBQyxDQUFBLE1BQU0sQ0FBQyxlQUFSLENBQUEsRUFERjthQVZhO1VBQUEsQ0FBZixFQURlO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakIsQ0FQQSxDQUFBO2FBcUJBLElBQUMsQ0FBQSxRQUFRLENBQUMsbUJBQVYsQ0FBQSxFQXRCTztJQUFBLENBRlQsQ0FBQTs7c0JBQUE7O0tBRnVCLFNBdkd6QixDQUFBOztBQUFBLEVBcUlNO0FBTUosNkJBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHFCQUFBLE9BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTtBQUNQLFVBQUEsUUFBQTs7UUFEUSxRQUFNO09BQ2Q7QUFBQSxNQUFBLFFBQUEsR0FBZSxJQUFBLE1BQUEsQ0FBTyxJQUFDLENBQUEsTUFBUixFQUFnQixJQUFDLENBQUEsUUFBakIsRUFBMkI7QUFBQSxRQUFBLFFBQUEsRUFBVSxJQUFWO0FBQUEsUUFBZ0IsYUFBQSxFQUFlO0FBQUEsVUFBQyxpQkFBQSxFQUFtQixJQUFwQjtTQUEvQjtPQUEzQixDQUFmLENBQUE7QUFBQSxNQUNBLFFBQVEsQ0FBQyxPQUFULENBQWlCLElBQUMsQ0FBQSxNQUFsQixDQURBLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixDQUFpQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ2YsY0FBQSx1QkFBQTtBQUFBLFVBQUEsT0FBQSxHQUFVLEtBQUMsQ0FBQSxTQUFELENBQUEsQ0FBVixDQUFBO0FBQUEsVUFDQSxPQUFBLEdBQVUsS0FBQyxDQUFBLE1BQU0sQ0FBQyxTQUFSLENBQUEsQ0FBbUIsQ0FBQyxZQUFwQixDQUFBLENBQUEsS0FBc0MsQ0FEaEQsQ0FBQTtBQUFBLFVBRUEsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsS0FBakIsQ0FGQSxDQUFBO0FBR0EsVUFBQSxvRUFBVSxDQUFDLHNCQUFSLElBQTBCLENBQUEsT0FBN0I7QUFDRSxZQUFBLElBQUcsT0FBSDtxQkFDRSxLQUFDLENBQUEsTUFBTSxDQUFDLGtCQUFSLENBQUEsRUFERjthQUFBLE1BQUE7cUJBR0UsS0FBQyxDQUFBLE1BQU0sQ0FBQyxrQkFBUixDQUFBLEVBSEY7YUFERjtXQUplO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakIsQ0FIQSxDQUFBO2FBYUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxrQkFBVixDQUFBLEVBZE87SUFBQSxDQUFULENBQUE7O0FBQUEscUJBZ0JBLFNBQUEsR0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLGtCQUFBO0FBQUEsTUFBQSxRQUFnQixJQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQUEsQ0FBaEIsRUFBQyxZQUFBLEdBQUQsRUFBTSxlQUFBLE1BQU4sQ0FBQTthQUNBLEdBQUEsS0FBTyxJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVIsQ0FBQSxDQUFtQixDQUFDLFVBQXBCLENBQUEsRUFGRTtJQUFBLENBaEJYLENBQUE7O2tCQUFBOztLQU5tQixTQXJJckIsQ0FBQTs7QUFBQSxFQWtLTTtBQUNKLDJCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxtQkFBQSxRQUFBLEdBQVUsR0FBVixDQUFBOztBQUFBLG1CQU9BLE9BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTtBQUNQLFVBQUEsMkNBQUE7O1FBRFEsUUFBTTtPQUNkO0FBQUEsTUFBQSxnQkFBQSxHQUFtQixJQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQUEsQ0FBbkIsQ0FBQTtBQUVBLE1BQUEsSUFBRyxDQUFDLENBQUMsUUFBRixDQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixDQUFlLEtBQWYsQ0FBWCxFQUFrQyxJQUFsQyxDQUFIO0FBQ0UsUUFBQSxJQUFBLEdBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQyxZQUFSLENBQUEsQ0FBc0IsQ0FBQyxPQUF2QixDQUFBLENBQVAsQ0FERjtPQUFBLE1BQUE7QUFHRSxRQUFBLElBQUEsR0FBTyxFQUFQLENBSEY7T0FGQTtBQUFBLE1BTUEsSUFBQSxrRUFBaUIsQ0FBQyxzQkFBWCxHQUE4QixVQUE5QixHQUE4QyxXQU5yRCxDQUFBO0FBQUEsTUFRQSxJQUFDLENBQUEsUUFBUSxDQUFDLFdBQVYsQ0FBc0IsSUFBQyxDQUFBLFFBQXZCLEVBQWlDO0FBQUEsUUFBQyxNQUFBLElBQUQ7QUFBQSxRQUFPLE1BQUEsSUFBUDtPQUFqQyxDQVJBLENBQUE7QUFVQSxNQUFBLG9FQUFVLENBQUMscUJBQVg7QUFDRSxRQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsdUJBQVIsQ0FBZ0MsZ0JBQWhDLENBQUEsQ0FERjtPQUFBLE1BQUE7QUFHRSxRQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsZUFBUixDQUFBLENBQUEsQ0FIRjtPQVZBO2FBZUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxtQkFBVixDQUFBLEVBaEJPO0lBQUEsQ0FQVCxDQUFBOztnQkFBQTs7S0FEaUIsU0FsS25CLENBQUE7O0FBQUEsRUErTE07QUFDSiwyQkFBQSxDQUFBOztBQUFhLElBQUEsY0FBRSxNQUFGLEVBQVcsUUFBWCxFQUFxQixJQUFyQixHQUFBO0FBQTZDLE1BQTVDLElBQUMsQ0FBQSxTQUFBLE1BQTJDLENBQUE7QUFBQSxNQUFuQyxJQUFDLENBQUEsV0FBQSxRQUFrQyxDQUFBO0FBQUEsTUFBdkIsSUFBQyxDQUFBLGdDQUFGLE9BQWlCLElBQWYsYUFBc0IsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFaLENBQTdDO0lBQUEsQ0FBYjs7QUFBQSxtQkFPQSxPQUFBLEdBQVMsU0FBQyxLQUFELEdBQUE7O1FBQUMsUUFBTTtPQUNkO0FBQUEsTUFBQSxJQUFDLENBQUEsZUFBRCxDQUFpQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNmLENBQUMsQ0FBQyxLQUFGLENBQVEsS0FBUixFQUFlLFNBQUEsR0FBQTttQkFDYixLQUFDLENBQUEsTUFBTSxDQUFDLFNBQVIsQ0FBQSxFQURhO1VBQUEsQ0FBZixFQURlO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakIsQ0FBQSxDQUFBO2FBR0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxtQkFBVixDQUFBLEVBSk87SUFBQSxDQVBULENBQUE7O2dCQUFBOztLQURpQixTQS9MbkIsQ0FBQTs7QUFBQSxFQWdOTTtBQUNKLDZCQUFBLENBQUE7O0FBQWEsSUFBQSxnQkFBRSxNQUFGLEVBQVcsUUFBWCxFQUFxQixJQUFyQixHQUFBO0FBQTZDLE1BQTVDLElBQUMsQ0FBQSxTQUFBLE1BQTJDLENBQUE7QUFBQSxNQUFuQyxJQUFDLENBQUEsV0FBQSxRQUFrQyxDQUFBO0FBQUEsTUFBdkIsSUFBQyxDQUFBLGdDQUFGLE9BQWlCLElBQWYsYUFBc0IsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFaLENBQTdDO0lBQUEsQ0FBYjs7QUFBQSxxQkFFQSxZQUFBLEdBQWMsU0FBQSxHQUFBO2FBQUcsTUFBSDtJQUFBLENBRmQsQ0FBQTs7QUFBQSxxQkFJQSxPQUFBLEdBQVMsU0FBQyxLQUFELEdBQUE7O1FBQUMsUUFBTTtPQUNkO2FBQUEsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDZixDQUFDLENBQUMsS0FBRixDQUFRLEtBQVIsRUFBZSxTQUFBLEdBQUE7QUFDYixnQkFBQSxHQUFBO0FBQUEsWUFBQSxHQUFBLEdBQU0sS0FBQyxDQUFBLFFBQVEsQ0FBQyxPQUFRLENBQUEsQ0FBQSxDQUF4QixDQUFBO2lDQUNBLEdBQUcsQ0FBRSxPQUFMLENBQUEsV0FGYTtVQUFBLENBQWYsRUFEZTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpCLEVBRE87SUFBQSxDQUpULENBQUE7O2tCQUFBOztLQURtQixTQWhOckIsQ0FBQTs7QUFBQSxFQTZOTTtBQUNKLDJCQUFBLENBQUE7O0FBQWEsSUFBQSxjQUFFLFVBQUYsRUFBZSxRQUFmLEVBQXlCLElBQXpCLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxhQUFBLFVBQ2IsQ0FBQTtBQUFBLE1BRHlCLElBQUMsQ0FBQSxXQUFBLFFBQzFCLENBQUE7QUFBQSxNQURxQyxJQUFDLENBQUEsZ0NBQUYsT0FBaUIsSUFBZixhQUN0QyxDQUFBO0FBQUEsTUFBQSxzQ0FBTSxJQUFDLENBQUEsVUFBUCxFQUFtQixJQUFDLENBQUEsUUFBcEIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsU0FBRCxHQUFpQixJQUFBLFNBQUEsQ0FBVSxJQUFWLEVBQWE7QUFBQSxRQUFBLE9BQUEsRUFBTyxNQUFQO0FBQUEsUUFBZSxVQUFBLEVBQVksSUFBM0I7QUFBQSxRQUFpQyxNQUFBLEVBQVEsSUFBekM7T0FBYixDQURqQixDQURXO0lBQUEsQ0FBYjs7QUFBQSxtQkFRQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFDLENBQUEsUUFBUSxDQUFDLE9BQVYsQ0FBa0IsSUFBQyxDQUFBLEtBQUssQ0FBQyxVQUF6QixFQUFxQyxJQUFDLENBQUEsVUFBVSxDQUFDLE1BQU0sQ0FBQyx1QkFBbkIsQ0FBQSxDQUFyQyxDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsUUFBUSxDQUFDLG1CQUFWLENBQUEsRUFGTztJQUFBLENBUlQsQ0FBQTs7Z0JBQUE7O0tBRGlCLGtCQTdObkIsQ0FBQTs7QUFBQSxFQTBPQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtBQUFBLElBQ2YsVUFBQSxRQURlO0FBQUEsSUFDTCxtQkFBQSxpQkFESztBQUFBLElBQ2MsZUFBQSxhQURkO0FBQUEsSUFDNkIsUUFBQSxNQUQ3QjtBQUFBLElBQ3FDLFlBQUEsVUFEckM7QUFBQSxJQUNpRCxRQUFBLE1BRGpEO0FBQUEsSUFFZixNQUFBLElBRmU7QUFBQSxJQUVULE1BQUEsSUFGUztBQUFBLElBRUgsUUFBQSxNQUZHO0FBQUEsSUFFSyxNQUFBLElBRkw7R0ExT2pCLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/mark/.atom/packages/vim-mode/lib/operators/general-operators.coffee
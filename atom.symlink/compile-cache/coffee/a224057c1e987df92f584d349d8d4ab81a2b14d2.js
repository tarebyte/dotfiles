(function() {
  var $$, Delete, Join, Mark, Operator, OperatorError, OperatorWithInput, Range, Repeat, ToggleCase, ViewModel, Yank, _, _ref,
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
    Yank: Yank,
    Join: Join,
    Repeat: Repeat,
    Mark: Mark
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVIQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLE9BQWMsT0FBQSxDQUFRLE1BQVIsQ0FBZCxFQUFDLFVBQUEsRUFBRCxFQUFLLGFBQUEsS0FETCxDQUFBOztBQUFBLEVBRUMsWUFBYSxPQUFBLENBQVEsMkJBQVIsRUFBYixTQUZELENBQUE7O0FBQUEsRUFJTTtBQUNTLElBQUEsdUJBQUUsT0FBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsVUFBQSxPQUNiLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxJQUFELEdBQVEsZ0JBQVIsQ0FEVztJQUFBLENBQWI7O3lCQUFBOztNQUxGLENBQUE7O0FBQUEsRUFRTTtBQUNKLHVCQUFBLFFBQUEsR0FBVSxJQUFWLENBQUE7O0FBQUEsdUJBQ0EsTUFBQSxHQUFRLElBRFIsQ0FBQTs7QUFBQSx1QkFFQSxRQUFBLEdBQVUsSUFGVixDQUFBOztBQUFBLHVCQUdBLGFBQUEsR0FBZSxJQUhmLENBQUE7O0FBT2EsSUFBQSxrQkFBRSxNQUFGLEVBQVcsUUFBWCxFQUFxQixJQUFyQixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsU0FBQSxNQUNiLENBQUE7QUFBQSxNQURxQixJQUFDLENBQUEsV0FBQSxRQUN0QixDQUFBO0FBQUEsTUFEaUMsSUFBQyxDQUFBLGdDQUFGLE9BQWlCLElBQWYsYUFDbEMsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQUFaLENBRFc7SUFBQSxDQVBiOztBQUFBLHVCQWFBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsU0FBSjtJQUFBLENBYlosQ0FBQTs7QUFBQSx1QkFtQkEsWUFBQSxHQUFjLFNBQUEsR0FBQTthQUFHLEtBQUg7SUFBQSxDQW5CZCxDQUFBOztBQUFBLHVCQTBCQSxPQUFBLEdBQVMsU0FBQyxNQUFELEdBQUE7QUFDUCxNQUFBLElBQUcsQ0FBQSxNQUFVLENBQUMsTUFBZDtBQUNFLGNBQVUsSUFBQSxhQUFBLENBQWMsNEJBQWQsQ0FBVixDQURGO09BQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxNQUFELEdBQVUsTUFIVixDQUFBO2FBSUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQUxMO0lBQUEsQ0ExQlQsQ0FBQTs7QUFBQSx1QkFpQ0EsY0FBQSxHQUFnQixTQUFDLFNBQUQsR0FBQTthQUFlLHlCQUFmO0lBQUEsQ0FqQ2hCLENBQUE7O0FBQUEsdUJBd0NBLGVBQUEsR0FBaUIsU0FBQyxFQUFELEdBQUE7YUFDZixJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVIsQ0FBQSxDQUFtQixDQUFDLFFBQXBCLENBQTZCLEVBQTdCLEVBRGU7SUFBQSxDQXhDakIsQ0FBQTs7b0JBQUE7O01BVEYsQ0FBQTs7QUFBQSxFQXFETTtBQUNKLHdDQUFBLENBQUE7O0FBQWEsSUFBQSwyQkFBRSxVQUFGLEVBQWUsUUFBZixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsYUFBQSxVQUNiLENBQUE7QUFBQSxNQUR5QixJQUFDLENBQUEsV0FBQSxRQUMxQixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxVQUFVLENBQUMsTUFBdEIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQURaLENBRFc7SUFBQSxDQUFiOztBQUFBLGdDQUlBLGNBQUEsR0FBZ0IsU0FBQyxTQUFELEdBQUE7YUFBZSw2QkFBZjtJQUFBLENBSmhCLENBQUE7O0FBQUEsZ0NBTUEsT0FBQSxHQUFTLFNBQUMsS0FBRCxHQUFBO0FBQ1AsTUFBQSxJQUFHLENBQUEsS0FBUyxDQUFDLFVBQWI7QUFDRSxjQUFVLElBQUEsYUFBQSxDQUFjLDRCQUFkLENBQVYsQ0FERjtPQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsS0FBRCxHQUFTLEtBSFQsQ0FBQTthQUlBLElBQUMsQ0FBQSxRQUFELEdBQVksS0FMTDtJQUFBLENBTlQsQ0FBQTs7NkJBQUE7O0tBRDhCLFNBckRoQyxDQUFBOztBQUFBLEVBc0VNO0FBQ0osNkJBQUEsQ0FBQTs7QUFBQSxxQkFBQSxRQUFBLEdBQVUsSUFBVixDQUFBOztBQUlhLElBQUEsZ0JBQUUsTUFBRixFQUFXLFFBQVgsRUFBcUIsSUFBckIsR0FBQTtBQUNYLFVBQUEsWUFBQTtBQUFBLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFEcUIsSUFBQyxDQUFBLFdBQUEsUUFDdEIsQ0FBQTtBQUFBLDZCQURnQyxPQUE0QixJQUEzQixJQUFDLENBQUEsaUJBQUEsVUFBVSxJQUFDLENBQUEsc0JBQUEsYUFDN0MsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQUFaLENBQUE7O1FBQ0EsSUFBQyxDQUFBLGdCQUFpQjtPQURsQjs7YUFFYyxDQUFDLGFBQWM7T0FIbEI7SUFBQSxDQUpiOztBQUFBLHFCQWNBLE9BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTtBQUNQLFVBQUEscUNBQUE7O1FBRFEsUUFBTTtPQUNkO0FBQUEsTUFBQSxNQUFBLEdBQVMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFSLENBQUEsQ0FBVCxDQUFBO0FBRUEsTUFBQSxJQUFHLENBQUMsQ0FBQyxRQUFGLENBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLENBQWUsS0FBZixFQUFzQixJQUFDLENBQUEsYUFBdkIsQ0FBWCxFQUFrRCxJQUFsRCxDQUFIO0FBQ0UsUUFBQSxjQUFBLEdBQWlCLElBQWpCLENBREY7T0FGQTtBQUtBLE1BQUEsSUFBRyxzQkFBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFELENBQVAsQ0FBQSxDQUFBLENBQUE7QUFDQSxRQUFBLElBQUcsQ0FBQSxJQUFFLENBQUEsUUFBRixJQUFlLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBZixJQUEwQyxDQUFBLCtEQUFRLENBQUMsc0JBQXREO0FBQ0UsVUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLGNBQVIsQ0FBQSxDQUFBLENBREY7U0FGRjtPQUxBO0FBVUEsTUFBQSxvRUFBVSxDQUFDLHFCQUFYO0FBQ0UsUUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQWdDLENBQUMsTUFBTSxDQUFDLFlBQVAsQ0FBQSxDQUFELEVBQXdCLENBQXhCLENBQWhDLENBQUEsQ0FERjtPQVZBO2FBYUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxtQkFBVixDQUFBLEVBZE87SUFBQSxDQWRULENBQUE7O2tCQUFBOztLQURtQixTQXRFckIsQ0FBQTs7QUFBQSxFQXVHTTtBQUVKLGlDQUFBLENBQUE7O0FBQWEsSUFBQSxvQkFBRSxNQUFGLEVBQVcsUUFBWCxFQUFxQixJQUFyQixHQUFBO0FBQTZDLE1BQTVDLElBQUMsQ0FBQSxTQUFBLE1BQTJDLENBQUE7QUFBQSxNQUFuQyxJQUFDLENBQUEsV0FBQSxRQUFrQyxDQUFBO0FBQUEsTUFBdkIsSUFBQyxDQUFBLGdDQUFGLE9BQWlCLElBQWYsYUFBc0IsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFaLENBQTdDO0lBQUEsQ0FBYjs7QUFBQSx5QkFFQSxPQUFBLEdBQVMsU0FBQyxLQUFELEdBQUE7QUFDUCxVQUFBLGtCQUFBOztRQURRLFFBQU07T0FDZDtBQUFBLE1BQUEsR0FBQSxHQUFNLElBQUMsQ0FBQSxNQUFNLENBQUMsdUJBQVIsQ0FBQSxDQUFOLENBQUE7QUFBQSxNQUNBLGFBQUEsR0FBZ0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxzQkFBUixDQUErQixHQUFHLENBQUMsR0FBbkMsQ0FBQSxHQUEwQyxDQUQxRCxDQUFBO0FBQUEsTUFFQSxLQUFBLEdBQVEsSUFBSSxDQUFDLEdBQUwsQ0FBUyxLQUFULEVBQWdCLElBQUMsQ0FBQSxNQUFNLENBQUMsc0JBQVIsQ0FBK0IsR0FBRyxDQUFDLEdBQW5DLENBQUEsR0FBMEMsR0FBRyxDQUFDLE1BQTlELENBRlIsQ0FBQTtBQUtBLE1BQUEsSUFBVSxJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVIsQ0FBQSxDQUFtQixDQUFDLFVBQXBCLENBQStCLEdBQUcsQ0FBQyxHQUFuQyxDQUFWO0FBQUEsY0FBQSxDQUFBO09BTEE7QUFBQSxNQU9BLElBQUMsQ0FBQSxlQUFELENBQWlCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ2YsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxLQUFSLEVBQWUsU0FBQSxHQUFBO0FBQ2IsZ0JBQUEsa0JBQUE7QUFBQSxZQUFBLEtBQUEsR0FBUSxLQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQUEsQ0FBUixDQUFBO0FBQUEsWUFDQSxLQUFBLEdBQVEsS0FBSyxDQUFDLGtCQUFOLENBQXlCLEtBQXpCLEVBQWdDLENBQWhDLEVBQW1DLENBQW5DLENBRFIsQ0FBQTtBQUFBLFlBRUEsSUFBQSxHQUFPLEtBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsS0FBN0IsQ0FGUCxDQUFBO0FBSUEsWUFBQSxJQUFHLElBQUEsS0FBUSxJQUFJLENBQUMsV0FBTCxDQUFBLENBQVg7QUFDRSxjQUFBLEtBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsS0FBN0IsRUFBb0MsSUFBSSxDQUFDLFdBQUwsQ0FBQSxDQUFwQyxDQUFBLENBREY7YUFBQSxNQUFBO0FBR0UsY0FBQSxLQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQTZCLEtBQTdCLEVBQW9DLElBQUksQ0FBQyxXQUFMLENBQUEsQ0FBcEMsQ0FBQSxDQUhGO2FBSkE7QUFTQSxZQUFBLElBQUEsQ0FBQSxDQUFPLEtBQUssQ0FBQyxNQUFOLElBQWdCLGFBQXZCLENBQUE7cUJBQ0UsS0FBQyxDQUFBLE1BQU0sQ0FBQyxlQUFSLENBQUEsRUFERjthQVZhO1VBQUEsQ0FBZixFQURlO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakIsQ0FQQSxDQUFBO2FBcUJBLElBQUMsQ0FBQSxRQUFRLENBQUMsbUJBQVYsQ0FBQSxFQXRCTztJQUFBLENBRlQsQ0FBQTs7c0JBQUE7O0tBRnVCLFNBdkd6QixDQUFBOztBQUFBLEVBc0lNO0FBQ0osMkJBQUEsQ0FBQTs7OztLQUFBOztBQUFBLG1CQUFBLFFBQUEsR0FBVSxHQUFWLENBQUE7O0FBQUEsbUJBT0EsT0FBQSxHQUFTLFNBQUMsS0FBRCxHQUFBO0FBQ1AsVUFBQSwyQ0FBQTs7UUFEUSxRQUFNO09BQ2Q7QUFBQSxNQUFBLGdCQUFBLEdBQW1CLElBQUMsQ0FBQSxNQUFNLENBQUMsdUJBQVIsQ0FBQSxDQUFuQixDQUFBO0FBRUEsTUFBQSxJQUFHLENBQUMsQ0FBQyxRQUFGLENBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLENBQWUsS0FBZixDQUFYLEVBQWtDLElBQWxDLENBQUg7QUFDRSxRQUFBLElBQUEsR0FBTyxJQUFDLENBQUEsTUFBTSxDQUFDLFlBQVIsQ0FBQSxDQUFzQixDQUFDLE9BQXZCLENBQUEsQ0FBUCxDQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsSUFBQSxHQUFPLEVBQVAsQ0FIRjtPQUZBO0FBQUEsTUFNQSxJQUFBLGtFQUFpQixDQUFDLHNCQUFYLEdBQThCLFVBQTlCLEdBQThDLFdBTnJELENBQUE7QUFBQSxNQVFBLElBQUMsQ0FBQSxRQUFRLENBQUMsV0FBVixDQUFzQixJQUFDLENBQUEsUUFBdkIsRUFBaUM7QUFBQSxRQUFDLE1BQUEsSUFBRDtBQUFBLFFBQU8sTUFBQSxJQUFQO09BQWpDLENBUkEsQ0FBQTtBQVVBLE1BQUEsb0VBQVUsQ0FBQyxxQkFBWDtBQUNFLFFBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyx1QkFBUixDQUFnQyxnQkFBaEMsQ0FBQSxDQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxlQUFSLENBQUEsQ0FBQSxDQUhGO09BVkE7YUFlQSxJQUFDLENBQUEsUUFBUSxDQUFDLG1CQUFWLENBQUEsRUFoQk87SUFBQSxDQVBULENBQUE7O2dCQUFBOztLQURpQixTQXRJbkIsQ0FBQTs7QUFBQSxFQW1LTTtBQUNKLDJCQUFBLENBQUE7O0FBQWEsSUFBQSxjQUFFLE1BQUYsRUFBVyxRQUFYLEVBQXFCLElBQXJCLEdBQUE7QUFBNkMsTUFBNUMsSUFBQyxDQUFBLFNBQUEsTUFBMkMsQ0FBQTtBQUFBLE1BQW5DLElBQUMsQ0FBQSxXQUFBLFFBQWtDLENBQUE7QUFBQSxNQUF2QixJQUFDLENBQUEsZ0NBQUYsT0FBaUIsSUFBZixhQUFzQixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLElBQVosQ0FBN0M7SUFBQSxDQUFiOztBQUFBLG1CQU9BLE9BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTs7UUFBQyxRQUFNO09BQ2Q7QUFBQSxNQUFBLElBQUMsQ0FBQSxlQUFELENBQWlCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ2YsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxLQUFSLEVBQWUsU0FBQSxHQUFBO21CQUNiLEtBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUixDQUFBLEVBRGE7VUFBQSxDQUFmLEVBRGU7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQixDQUFBLENBQUE7YUFHQSxJQUFDLENBQUEsUUFBUSxDQUFDLG1CQUFWLENBQUEsRUFKTztJQUFBLENBUFQsQ0FBQTs7Z0JBQUE7O0tBRGlCLFNBbktuQixDQUFBOztBQUFBLEVBb0xNO0FBQ0osNkJBQUEsQ0FBQTs7QUFBYSxJQUFBLGdCQUFFLE1BQUYsRUFBVyxRQUFYLEVBQXFCLElBQXJCLEdBQUE7QUFBNkMsTUFBNUMsSUFBQyxDQUFBLFNBQUEsTUFBMkMsQ0FBQTtBQUFBLE1BQW5DLElBQUMsQ0FBQSxXQUFBLFFBQWtDLENBQUE7QUFBQSxNQUF2QixJQUFDLENBQUEsZ0NBQUYsT0FBaUIsSUFBZixhQUFzQixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLElBQVosQ0FBN0M7SUFBQSxDQUFiOztBQUFBLHFCQUVBLFlBQUEsR0FBYyxTQUFBLEdBQUE7YUFBRyxNQUFIO0lBQUEsQ0FGZCxDQUFBOztBQUFBLHFCQUlBLE9BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTs7UUFBQyxRQUFNO09BQ2Q7YUFBQSxJQUFDLENBQUEsZUFBRCxDQUFpQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNmLENBQUMsQ0FBQyxLQUFGLENBQVEsS0FBUixFQUFlLFNBQUEsR0FBQTtBQUNiLGdCQUFBLEdBQUE7QUFBQSxZQUFBLEdBQUEsR0FBTSxLQUFDLENBQUEsUUFBUSxDQUFDLE9BQVEsQ0FBQSxDQUFBLENBQXhCLENBQUE7aUNBQ0EsR0FBRyxDQUFFLE9BQUwsQ0FBQSxXQUZhO1VBQUEsQ0FBZixFQURlO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakIsRUFETztJQUFBLENBSlQsQ0FBQTs7a0JBQUE7O0tBRG1CLFNBcExyQixDQUFBOztBQUFBLEVBaU1NO0FBQ0osMkJBQUEsQ0FBQTs7QUFBYSxJQUFBLGNBQUUsVUFBRixFQUFlLFFBQWYsRUFBeUIsSUFBekIsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLGFBQUEsVUFDYixDQUFBO0FBQUEsTUFEeUIsSUFBQyxDQUFBLFdBQUEsUUFDMUIsQ0FBQTtBQUFBLE1BRHFDLElBQUMsQ0FBQSxnQ0FBRixPQUFpQixJQUFmLGFBQ3RDLENBQUE7QUFBQSxNQUFBLHNDQUFNLElBQUMsQ0FBQSxVQUFQLEVBQW1CLElBQUMsQ0FBQSxRQUFwQixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxTQUFELEdBQWlCLElBQUEsU0FBQSxDQUFVLElBQVYsRUFBYTtBQUFBLFFBQUEsT0FBQSxFQUFPLE1BQVA7QUFBQSxRQUFlLFVBQUEsRUFBWSxJQUEzQjtBQUFBLFFBQWlDLE1BQUEsRUFBUSxJQUF6QztPQUFiLENBRGpCLENBRFc7SUFBQSxDQUFiOztBQUFBLG1CQVFBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxNQUFBLElBQUMsQ0FBQSxRQUFRLENBQUMsT0FBVixDQUFrQixJQUFDLENBQUEsS0FBSyxDQUFDLFVBQXpCLEVBQXFDLElBQUMsQ0FBQSxVQUFVLENBQUMsTUFBTSxDQUFDLHVCQUFuQixDQUFBLENBQXJDLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxRQUFRLENBQUMsbUJBQVYsQ0FBQSxFQUZPO0lBQUEsQ0FSVCxDQUFBOztnQkFBQTs7S0FEaUIsa0JBak1uQixDQUFBOztBQUFBLEVBOE1BLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBQUEsSUFDZixVQUFBLFFBRGU7QUFBQSxJQUNMLG1CQUFBLGlCQURLO0FBQUEsSUFDYyxlQUFBLGFBRGQ7QUFBQSxJQUM2QixRQUFBLE1BRDdCO0FBQUEsSUFDcUMsWUFBQSxVQURyQztBQUFBLElBRWYsTUFBQSxJQUZlO0FBQUEsSUFFVCxNQUFBLElBRlM7QUFBQSxJQUVILFFBQUEsTUFGRztBQUFBLElBRUssTUFBQSxJQUZMO0dBOU1qQixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/mark/.atom/packages/vim-mode/lib/operators/general-operators.coffee
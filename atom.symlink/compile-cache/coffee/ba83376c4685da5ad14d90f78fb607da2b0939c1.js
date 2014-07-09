(function() {
  var $$, Autoindent, Change, Delete, Indent, Join, Operator, OperatorError, Outdent, Put, Range, Repeat, Replace, ReplaceViewModel, Yank, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  _ref = require('atom'), $$ = _ref.$$, Range = _ref.Range;

  ReplaceViewModel = require('./replace-view-model');

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

    Operator.prototype.undoTransaction = function(fn) {
      return this.editor.getBuffer().transact(fn);
    };

    return Operator;

  })();

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
        return this.editor.setCursorScreenPosition([cursor.getScreenRow(), 0]);
      }
    };

    return Delete;

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
      operator.execute(count);
      return this.vimState.activateInsertMode();
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
        return this.editor.setCursorScreenPosition(originalPosition);
      } else {
        return this.editor.clearSelections();
      }
    };

    return Yank;

  })(Operator);

  Indent = (function(_super) {
    __extends(Indent, _super);

    function Indent() {
      return Indent.__super__.constructor.apply(this, arguments);
    }

    Indent.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return this.indent(count);
    };

    Indent.prototype.indent = function(count, direction) {
      var row;
      if (direction == null) {
        direction = 'indent';
      }
      row = this.editor.getCursorScreenRow();
      this.motion.select(count);
      if (direction === 'indent') {
        this.editor.indentSelectedRows();
      } else if (direction === 'outdent') {
        this.editor.outdentSelectedRows();
      } else if (direction === 'auto') {
        this.editor.autoIndentSelectedRows();
      }
      this.editor.setCursorScreenPosition([row, 0]);
      return this.editor.moveCursorToFirstCharacterOfLine();
    };

    return Indent;

  })(Operator);

  Outdent = (function(_super) {
    __extends(Outdent, _super);

    function Outdent() {
      return Outdent.__super__.constructor.apply(this, arguments);
    }

    Outdent.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return this.indent(count, 'outdent');
    };

    return Outdent;

  })(Indent);

  Autoindent = (function(_super) {
    __extends(Autoindent, _super);

    function Autoindent() {
      return Autoindent.__super__.constructor.apply(this, arguments);
    }

    Autoindent.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return this.indent(count, 'auto');
    };

    return Autoindent;

  })(Indent);

  Put = (function(_super) {
    __extends(Put, _super);

    Put.prototype.register = '"';

    function Put(editor, vimState, _arg) {
      var _ref1;
      this.editor = editor;
      this.vimState = vimState;
      _ref1 = _arg != null ? _arg : {}, this.location = _ref1.location, this.selectOptions = _ref1.selectOptions;
      if (this.location == null) {
        this.location = 'after';
      }
      this.complete = true;
    }

    Put.prototype.execute = function(count) {
      var originalPosition, text, textToInsert, type, _ref1;
      if (count == null) {
        count = 1;
      }
      _ref1 = this.vimState.getRegister(this.register) || {}, text = _ref1.text, type = _ref1.type;
      if (!text) {
        return;
      }
      if (this.location === 'after') {
        if (type === 'linewise') {
          if (this.onLastRow()) {
            this.editor.moveCursorToEndOfLine();
            originalPosition = this.editor.getCursorScreenPosition();
            originalPosition.row += 1;
          } else {
            this.editor.moveCursorDown();
          }
        } else {
          if (!this.onLastColumn()) {
            this.editor.moveCursorRight();
          }
        }
      }
      if (type === 'linewise' && (originalPosition == null)) {
        this.editor.moveCursorToBeginningOfLine();
        originalPosition = this.editor.getCursorScreenPosition();
      }
      textToInsert = _.times(count, function() {
        return text;
      }).join('');
      if (this.location === 'after' && type === 'linewise' && this.onLastRow()) {
        textToInsert = "\n" + (textToInsert.substring(0, textToInsert.length - 1));
      }
      this.editor.insertText(textToInsert);
      if (originalPosition != null) {
        this.editor.setCursorScreenPosition(originalPosition);
        return this.editor.moveCursorToFirstCharacterOfLine();
      }
    };

    Put.prototype.onLastRow = function() {
      var column, row, _ref1;
      _ref1 = this.editor.getCursorBufferPosition(), row = _ref1.row, column = _ref1.column;
      return row === this.editor.getBuffer().getLastRow();
    };

    Put.prototype.onLastColumn = function() {
      return this.editor.getCursor().isAtEndOfLine();
    };

    return Put;

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
      return this.undoTransaction((function(_this) {
        return function() {
          return _.times(count, function() {
            return _this.editor.joinLines();
          });
        };
      })(this));
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

  Replace = (function(_super) {
    __extends(Replace, _super);

    function Replace(editorView, vimState, _arg) {
      this.editorView = editorView;
      this.vimState = vimState;
      this.selectOptions = (_arg != null ? _arg : {}).selectOptions;
      this.editor = this.editorView.editor;
      this.complete = true;
      this.viewModel = new ReplaceViewModel(this);
    }

    Replace.prototype.execute = function(count) {
      var currentRowLength, editor, pos;
      if (count == null) {
        count = 1;
      }
      editor = this.editorView.editor;
      pos = editor.getCursorBufferPosition();
      currentRowLength = editor.lineLengthForBufferRow(pos.row);
      if (!(currentRowLength > 0)) {
        return;
      }
      if (!(currentRowLength - pos.column >= count)) {
        return;
      }
      return this.undoTransaction((function(_this) {
        return function() {
          var start;
          start = editor.getCursorBufferPosition();
          _.times(count, function() {
            var point;
            point = editor.getCursorBufferPosition();
            editor.setTextInBufferRange(Range.fromPointWithDelta(point, 0, 1), _this.viewModel.char);
            return editor.moveCursorRight();
          });
          return editor.setCursorBufferPosition(start);
        };
      })(this));
    };

    return Replace;

  })(Operator);

  module.exports = {
    Operator: Operator,
    OperatorError: OperatorError,
    Delete: Delete,
    Change: Change,
    Yank: Yank,
    Indent: Indent,
    Outdent: Outdent,
    Autoindent: Autoindent,
    Put: Put,
    Join: Join,
    Repeat: Repeat,
    Replace: Replace
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRJQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLE9BQWMsT0FBQSxDQUFRLE1BQVIsQ0FBZCxFQUFDLFVBQUEsRUFBRCxFQUFLLGFBQUEsS0FETCxDQUFBOztBQUFBLEVBRUEsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHNCQUFSLENBRm5CLENBQUE7O0FBQUEsRUFJTTtBQUNTLElBQUEsdUJBQUUsT0FBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsVUFBQSxPQUNiLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxJQUFELEdBQVEsZ0JBQVIsQ0FEVztJQUFBLENBQWI7O3lCQUFBOztNQUxGLENBQUE7O0FBQUEsRUFRTTtBQUNKLHVCQUFBLFFBQUEsR0FBVSxJQUFWLENBQUE7O0FBQUEsdUJBQ0EsTUFBQSxHQUFRLElBRFIsQ0FBQTs7QUFBQSx1QkFFQSxRQUFBLEdBQVUsSUFGVixDQUFBOztBQUFBLHVCQUdBLGFBQUEsR0FBZSxJQUhmLENBQUE7O0FBT2EsSUFBQSxrQkFBRSxNQUFGLEVBQVcsUUFBWCxFQUFxQixJQUFyQixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsU0FBQSxNQUNiLENBQUE7QUFBQSxNQURxQixJQUFDLENBQUEsV0FBQSxRQUN0QixDQUFBO0FBQUEsTUFEaUMsSUFBQyxDQUFBLGdDQUFGLE9BQWlCLElBQWYsYUFDbEMsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQUFaLENBRFc7SUFBQSxDQVBiOztBQUFBLHVCQWFBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsU0FBSjtJQUFBLENBYlosQ0FBQTs7QUFBQSx1QkFtQkEsWUFBQSxHQUFjLFNBQUEsR0FBQTthQUFHLEtBQUg7SUFBQSxDQW5CZCxDQUFBOztBQUFBLHVCQTBCQSxPQUFBLEdBQVMsU0FBQyxNQUFELEdBQUE7QUFDUCxNQUFBLElBQUcsQ0FBQSxNQUFVLENBQUMsTUFBZDtBQUNFLGNBQVUsSUFBQSxhQUFBLENBQWMsNEJBQWQsQ0FBVixDQURGO09BQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxNQUFELEdBQVUsTUFIVixDQUFBO2FBSUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQUxMO0lBQUEsQ0ExQlQsQ0FBQTs7QUFBQSx1QkFzQ0EsZUFBQSxHQUFpQixTQUFDLEVBQUQsR0FBQTthQUNmLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUixDQUFBLENBQW1CLENBQUMsUUFBcEIsQ0FBNkIsRUFBN0IsRUFEZTtJQUFBLENBdENqQixDQUFBOztvQkFBQTs7TUFURixDQUFBOztBQUFBLEVBb0RNO0FBQ0osNkJBQUEsQ0FBQTs7QUFBQSxxQkFBQSxRQUFBLEdBQVUsSUFBVixDQUFBOztBQUlhLElBQUEsZ0JBQUUsTUFBRixFQUFXLFFBQVgsRUFBcUIsSUFBckIsR0FBQTtBQUNYLFVBQUEsWUFBQTtBQUFBLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFEcUIsSUFBQyxDQUFBLFdBQUEsUUFDdEIsQ0FBQTtBQUFBLDZCQURnQyxPQUE0QixJQUEzQixJQUFDLENBQUEsaUJBQUEsVUFBVSxJQUFDLENBQUEsc0JBQUEsYUFDN0MsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQUFaLENBQUE7O1FBQ0EsSUFBQyxDQUFBLGdCQUFpQjtPQURsQjs7YUFFYyxDQUFDLGFBQWM7T0FIbEI7SUFBQSxDQUpiOztBQUFBLHFCQWNBLE9BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTtBQUNQLFVBQUEscUNBQUE7O1FBRFEsUUFBTTtPQUNkO0FBQUEsTUFBQSxNQUFBLEdBQVMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFSLENBQUEsQ0FBVCxDQUFBO0FBRUEsTUFBQSxJQUFHLENBQUMsQ0FBQyxRQUFGLENBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLENBQWUsS0FBZixFQUFzQixJQUFDLENBQUEsYUFBdkIsQ0FBWCxFQUFrRCxJQUFsRCxDQUFIO0FBQ0UsUUFBQSxjQUFBLEdBQWlCLElBQWpCLENBREY7T0FGQTtBQUtBLE1BQUEsSUFBRyxzQkFBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFELENBQVAsQ0FBQSxDQUFBLENBQUE7QUFDQSxRQUFBLElBQUcsQ0FBQSxJQUFFLENBQUEsUUFBRixJQUFlLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBZixJQUEwQyxDQUFBLCtEQUFRLENBQUMsc0JBQXREO0FBQ0UsVUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLGNBQVIsQ0FBQSxDQUFBLENBREY7U0FGRjtPQUxBO0FBVUEsTUFBQSxvRUFBVSxDQUFDLHFCQUFYO2VBQ0UsSUFBQyxDQUFBLE1BQU0sQ0FBQyx1QkFBUixDQUFnQyxDQUFDLE1BQU0sQ0FBQyxZQUFQLENBQUEsQ0FBRCxFQUF3QixDQUF4QixDQUFoQyxFQURGO09BWE87SUFBQSxDQWRULENBQUE7O2tCQUFBOztLQURtQixTQXBEckIsQ0FBQTs7QUFBQSxFQW9GTTtBQU1KLDZCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxxQkFBQSxPQUFBLEdBQVMsU0FBQyxLQUFELEdBQUE7QUFDUCxVQUFBLFFBQUE7O1FBRFEsUUFBTTtPQUNkO0FBQUEsTUFBQSxRQUFBLEdBQWUsSUFBQSxNQUFBLENBQU8sSUFBQyxDQUFBLE1BQVIsRUFBZ0IsSUFBQyxDQUFBLFFBQWpCLEVBQTJCO0FBQUEsUUFBQSxRQUFBLEVBQVUsSUFBVjtBQUFBLFFBQWdCLGFBQUEsRUFBZTtBQUFBLFVBQUMsaUJBQUEsRUFBbUIsSUFBcEI7U0FBL0I7T0FBM0IsQ0FBZixDQUFBO0FBQUEsTUFDQSxRQUFRLENBQUMsT0FBVCxDQUFpQixJQUFDLENBQUEsTUFBbEIsQ0FEQSxDQUFBO0FBQUEsTUFFQSxRQUFRLENBQUMsT0FBVCxDQUFpQixLQUFqQixDQUZBLENBQUE7YUFJQSxJQUFDLENBQUEsUUFBUSxDQUFDLGtCQUFWLENBQUEsRUFMTztJQUFBLENBQVQsQ0FBQTs7a0JBQUE7O0tBTm1CLFNBcEZyQixDQUFBOztBQUFBLEVBb0dNO0FBQ0osMkJBQUEsQ0FBQTs7OztLQUFBOztBQUFBLG1CQUFBLFFBQUEsR0FBVSxHQUFWLENBQUE7O0FBQUEsbUJBT0EsT0FBQSxHQUFTLFNBQUMsS0FBRCxHQUFBO0FBQ1AsVUFBQSwyQ0FBQTs7UUFEUSxRQUFNO09BQ2Q7QUFBQSxNQUFBLGdCQUFBLEdBQW1CLElBQUMsQ0FBQSxNQUFNLENBQUMsdUJBQVIsQ0FBQSxDQUFuQixDQUFBO0FBRUEsTUFBQSxJQUFHLENBQUMsQ0FBQyxRQUFGLENBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLENBQWUsS0FBZixDQUFYLEVBQWtDLElBQWxDLENBQUg7QUFDRSxRQUFBLElBQUEsR0FBTyxJQUFDLENBQUEsTUFBTSxDQUFDLFlBQVIsQ0FBQSxDQUFzQixDQUFDLE9BQXZCLENBQUEsQ0FBUCxDQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsSUFBQSxHQUFPLEVBQVAsQ0FIRjtPQUZBO0FBQUEsTUFNQSxJQUFBLGtFQUFpQixDQUFDLHNCQUFYLEdBQThCLFVBQTlCLEdBQThDLFdBTnJELENBQUE7QUFBQSxNQVFBLElBQUMsQ0FBQSxRQUFRLENBQUMsV0FBVixDQUFzQixJQUFDLENBQUEsUUFBdkIsRUFBaUM7QUFBQSxRQUFDLE1BQUEsSUFBRDtBQUFBLFFBQU8sTUFBQSxJQUFQO09BQWpDLENBUkEsQ0FBQTtBQVVBLE1BQUEsb0VBQVUsQ0FBQyxxQkFBWDtlQUNFLElBQUMsQ0FBQSxNQUFNLENBQUMsdUJBQVIsQ0FBZ0MsZ0JBQWhDLEVBREY7T0FBQSxNQUFBO2VBR0UsSUFBQyxDQUFBLE1BQU0sQ0FBQyxlQUFSLENBQUEsRUFIRjtPQVhPO0lBQUEsQ0FQVCxDQUFBOztnQkFBQTs7S0FEaUIsU0FwR25CLENBQUE7O0FBQUEsRUErSE07QUFNSiw2QkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEscUJBQUEsT0FBQSxHQUFTLFNBQUMsS0FBRCxHQUFBOztRQUFDLFFBQU07T0FDZDthQUFBLElBQUMsQ0FBQSxNQUFELENBQVEsS0FBUixFQURPO0lBQUEsQ0FBVCxDQUFBOztBQUFBLHFCQVNBLE1BQUEsR0FBUSxTQUFDLEtBQUQsRUFBUSxTQUFSLEdBQUE7QUFDTixVQUFBLEdBQUE7O1FBRGMsWUFBVTtPQUN4QjtBQUFBLE1BQUEsR0FBQSxHQUFNLElBQUMsQ0FBQSxNQUFNLENBQUMsa0JBQVIsQ0FBQSxDQUFOLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixDQUFlLEtBQWYsQ0FGQSxDQUFBO0FBR0EsTUFBQSxJQUFHLFNBQUEsS0FBYSxRQUFoQjtBQUNFLFFBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxrQkFBUixDQUFBLENBQUEsQ0FERjtPQUFBLE1BRUssSUFBRyxTQUFBLEtBQWEsU0FBaEI7QUFDSCxRQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsbUJBQVIsQ0FBQSxDQUFBLENBREc7T0FBQSxNQUVBLElBQUcsU0FBQSxLQUFhLE1BQWhCO0FBQ0gsUUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLHNCQUFSLENBQUEsQ0FBQSxDQURHO09BUEw7QUFBQSxNQVVBLElBQUMsQ0FBQSxNQUFNLENBQUMsdUJBQVIsQ0FBZ0MsQ0FBQyxHQUFELEVBQU0sQ0FBTixDQUFoQyxDQVZBLENBQUE7YUFXQSxJQUFDLENBQUEsTUFBTSxDQUFDLGdDQUFSLENBQUEsRUFaTTtJQUFBLENBVFIsQ0FBQTs7a0JBQUE7O0tBTm1CLFNBL0hyQixDQUFBOztBQUFBLEVBK0pNO0FBTUosOEJBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHNCQUFBLE9BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTs7UUFBQyxRQUFNO09BQ2Q7YUFBQSxJQUFDLENBQUEsTUFBRCxDQUFRLEtBQVIsRUFBZSxTQUFmLEVBRE87SUFBQSxDQUFULENBQUE7O21CQUFBOztLQU5vQixPQS9KdEIsQ0FBQTs7QUFBQSxFQTJLTTtBQU1KLGlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx5QkFBQSxPQUFBLEdBQVMsU0FBQyxLQUFELEdBQUE7O1FBQUMsUUFBTTtPQUNkO2FBQUEsSUFBQyxDQUFBLE1BQUQsQ0FBUSxLQUFSLEVBQWUsTUFBZixFQURPO0lBQUEsQ0FBVCxDQUFBOztzQkFBQTs7S0FOdUIsT0EzS3pCLENBQUE7O0FBQUEsRUF1TE07QUFDSiwwQkFBQSxDQUFBOztBQUFBLGtCQUFBLFFBQUEsR0FBVSxHQUFWLENBQUE7O0FBRWEsSUFBQSxhQUFFLE1BQUYsRUFBVyxRQUFYLEVBQXFCLElBQXJCLEdBQUE7QUFDWCxVQUFBLEtBQUE7QUFBQSxNQURZLElBQUMsQ0FBQSxTQUFBLE1BQ2IsQ0FBQTtBQUFBLE1BRHFCLElBQUMsQ0FBQSxXQUFBLFFBQ3RCLENBQUE7QUFBQSw2QkFEZ0MsT0FBNEIsSUFBM0IsSUFBQyxDQUFBLGlCQUFBLFVBQVUsSUFBQyxDQUFBLHNCQUFBLGFBQzdDLENBQUE7O1FBQUEsSUFBQyxDQUFBLFdBQVk7T0FBYjtBQUFBLE1BQ0EsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQURaLENBRFc7SUFBQSxDQUZiOztBQUFBLGtCQVdBLE9BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTtBQUNQLFVBQUEsaURBQUE7O1FBRFEsUUFBTTtPQUNkO0FBQUEsTUFBQSxRQUFlLElBQUMsQ0FBQSxRQUFRLENBQUMsV0FBVixDQUFzQixJQUFDLENBQUEsUUFBdkIsQ0FBQSxJQUFvQyxFQUFuRCxFQUFDLGFBQUEsSUFBRCxFQUFPLGFBQUEsSUFBUCxDQUFBO0FBQ0EsTUFBQSxJQUFBLENBQUEsSUFBQTtBQUFBLGNBQUEsQ0FBQTtPQURBO0FBR0EsTUFBQSxJQUFHLElBQUMsQ0FBQSxRQUFELEtBQWEsT0FBaEI7QUFDRSxRQUFBLElBQUcsSUFBQSxLQUFRLFVBQVg7QUFDRSxVQUFBLElBQUcsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUFIO0FBQ0UsWUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLHFCQUFSLENBQUEsQ0FBQSxDQUFBO0FBQUEsWUFFQSxnQkFBQSxHQUFtQixJQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQUEsQ0FGbkIsQ0FBQTtBQUFBLFlBR0EsZ0JBQWdCLENBQUMsR0FBakIsSUFBd0IsQ0FIeEIsQ0FERjtXQUFBLE1BQUE7QUFNRSxZQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsY0FBUixDQUFBLENBQUEsQ0FORjtXQURGO1NBQUEsTUFBQTtBQVNFLFVBQUEsSUFBQSxDQUFBLElBQVEsQ0FBQSxZQUFELENBQUEsQ0FBUDtBQUNFLFlBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxlQUFSLENBQUEsQ0FBQSxDQURGO1dBVEY7U0FERjtPQUhBO0FBZ0JBLE1BQUEsSUFBRyxJQUFBLEtBQVEsVUFBUixJQUF3QiwwQkFBM0I7QUFDRSxRQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsMkJBQVIsQ0FBQSxDQUFBLENBQUE7QUFBQSxRQUNBLGdCQUFBLEdBQW1CLElBQUMsQ0FBQSxNQUFNLENBQUMsdUJBQVIsQ0FBQSxDQURuQixDQURGO09BaEJBO0FBQUEsTUFvQkEsWUFBQSxHQUFlLENBQUMsQ0FBQyxLQUFGLENBQVEsS0FBUixFQUFlLFNBQUEsR0FBQTtlQUFHLEtBQUg7TUFBQSxDQUFmLENBQXVCLENBQUMsSUFBeEIsQ0FBNkIsRUFBN0IsQ0FwQmYsQ0FBQTtBQXFCQSxNQUFBLElBQUcsSUFBQyxDQUFBLFFBQUQsS0FBYSxPQUFiLElBQXlCLElBQUEsS0FBUSxVQUFqQyxJQUFnRCxJQUFDLENBQUEsU0FBRCxDQUFBLENBQW5EO0FBQ0UsUUFBQSxZQUFBLEdBQWdCLElBQUEsR0FBRyxDQUFBLFlBQVksQ0FBQyxTQUFiLENBQXVCLENBQXZCLEVBQTBCLFlBQVksQ0FBQyxNQUFiLEdBQXNCLENBQWhELENBQUEsQ0FBbkIsQ0FERjtPQXJCQTtBQUFBLE1BdUJBLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFtQixZQUFuQixDQXZCQSxDQUFBO0FBeUJBLE1BQUEsSUFBRyx3QkFBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyx1QkFBUixDQUFnQyxnQkFBaEMsQ0FBQSxDQUFBO2VBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxnQ0FBUixDQUFBLEVBRkY7T0ExQk87SUFBQSxDQVhULENBQUE7O0FBQUEsa0JBNENBLFNBQUEsR0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLGtCQUFBO0FBQUEsTUFBQSxRQUFnQixJQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQUEsQ0FBaEIsRUFBQyxZQUFBLEdBQUQsRUFBTSxlQUFBLE1BQU4sQ0FBQTthQUNBLEdBQUEsS0FBTyxJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVIsQ0FBQSxDQUFtQixDQUFDLFVBQXBCLENBQUEsRUFGRTtJQUFBLENBNUNYLENBQUE7O0FBQUEsa0JBZ0RBLFlBQUEsR0FBYyxTQUFBLEdBQUE7YUFDWixJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVIsQ0FBQSxDQUFtQixDQUFDLGFBQXBCLENBQUEsRUFEWTtJQUFBLENBaERkLENBQUE7O2VBQUE7O0tBRGdCLFNBdkxsQixDQUFBOztBQUFBLEVBNk9NO0FBQ0osMkJBQUEsQ0FBQTs7QUFBYSxJQUFBLGNBQUUsTUFBRixFQUFXLFFBQVgsRUFBcUIsSUFBckIsR0FBQTtBQUE2QyxNQUE1QyxJQUFDLENBQUEsU0FBQSxNQUEyQyxDQUFBO0FBQUEsTUFBbkMsSUFBQyxDQUFBLFdBQUEsUUFBa0MsQ0FBQTtBQUFBLE1BQXZCLElBQUMsQ0FBQSxnQ0FBRixPQUFpQixJQUFmLGFBQXNCLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBWixDQUE3QztJQUFBLENBQWI7O0FBQUEsbUJBT0EsT0FBQSxHQUFTLFNBQUMsS0FBRCxHQUFBOztRQUFDLFFBQU07T0FDZDthQUFBLElBQUMsQ0FBQSxlQUFELENBQWlCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ2YsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxLQUFSLEVBQWUsU0FBQSxHQUFBO21CQUNiLEtBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUixDQUFBLEVBRGE7VUFBQSxDQUFmLEVBRGU7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQixFQURPO0lBQUEsQ0FQVCxDQUFBOztnQkFBQTs7S0FEaUIsU0E3T25CLENBQUE7O0FBQUEsRUE2UE07QUFDSiw2QkFBQSxDQUFBOztBQUFhLElBQUEsZ0JBQUUsTUFBRixFQUFXLFFBQVgsRUFBcUIsSUFBckIsR0FBQTtBQUE2QyxNQUE1QyxJQUFDLENBQUEsU0FBQSxNQUEyQyxDQUFBO0FBQUEsTUFBbkMsSUFBQyxDQUFBLFdBQUEsUUFBa0MsQ0FBQTtBQUFBLE1BQXZCLElBQUMsQ0FBQSxnQ0FBRixPQUFpQixJQUFmLGFBQXNCLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBWixDQUE3QztJQUFBLENBQWI7O0FBQUEscUJBRUEsWUFBQSxHQUFjLFNBQUEsR0FBQTthQUFHLE1BQUg7SUFBQSxDQUZkLENBQUE7O0FBQUEscUJBSUEsT0FBQSxHQUFTLFNBQUMsS0FBRCxHQUFBOztRQUFDLFFBQU07T0FDZDthQUFBLElBQUMsQ0FBQSxlQUFELENBQWlCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ2YsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxLQUFSLEVBQWUsU0FBQSxHQUFBO0FBQ2IsZ0JBQUEsR0FBQTtBQUFBLFlBQUEsR0FBQSxHQUFNLEtBQUMsQ0FBQSxRQUFRLENBQUMsT0FBUSxDQUFBLENBQUEsQ0FBeEIsQ0FBQTtpQ0FDQSxHQUFHLENBQUUsT0FBTCxDQUFBLFdBRmE7VUFBQSxDQUFmLEVBRGU7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQixFQURPO0lBQUEsQ0FKVCxDQUFBOztrQkFBQTs7S0FEbUIsU0E3UHJCLENBQUE7O0FBQUEsRUEyUU07QUFDSiw4QkFBQSxDQUFBOztBQUFhLElBQUEsaUJBQUUsVUFBRixFQUFlLFFBQWYsRUFBeUIsSUFBekIsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLGFBQUEsVUFDYixDQUFBO0FBQUEsTUFEeUIsSUFBQyxDQUFBLFdBQUEsUUFDMUIsQ0FBQTtBQUFBLE1BRHFDLElBQUMsQ0FBQSxnQ0FBRixPQUFpQixJQUFmLGFBQ3RDLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLFVBQVUsQ0FBQyxNQUF0QixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsUUFBRCxHQUFZLElBRFosQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFNBQUQsR0FBaUIsSUFBQSxnQkFBQSxDQUFpQixJQUFqQixDQUZqQixDQURXO0lBQUEsQ0FBYjs7QUFBQSxzQkFLQSxPQUFBLEdBQVMsU0FBQyxLQUFELEdBQUE7QUFDUCxVQUFBLDZCQUFBOztRQURRLFFBQU07T0FDZDtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxVQUFVLENBQUMsTUFBckIsQ0FBQTtBQUFBLE1BQ0EsR0FBQSxHQUFNLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBRE4sQ0FBQTtBQUFBLE1BRUEsZ0JBQUEsR0FBbUIsTUFBTSxDQUFDLHNCQUFQLENBQThCLEdBQUcsQ0FBQyxHQUFsQyxDQUZuQixDQUFBO0FBS0EsTUFBQSxJQUFBLENBQUEsQ0FBYyxnQkFBQSxHQUFtQixDQUFqQyxDQUFBO0FBQUEsY0FBQSxDQUFBO09BTEE7QUFPQSxNQUFBLElBQUEsQ0FBQSxDQUFjLGdCQUFBLEdBQW1CLEdBQUcsQ0FBQyxNQUF2QixJQUFpQyxLQUEvQyxDQUFBO0FBQUEsY0FBQSxDQUFBO09BUEE7YUFTQSxJQUFDLENBQUEsZUFBRCxDQUFpQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ2YsY0FBQSxLQUFBO0FBQUEsVUFBQSxLQUFBLEdBQVEsTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUixDQUFBO0FBQUEsVUFDQSxDQUFDLENBQUMsS0FBRixDQUFRLEtBQVIsRUFBZSxTQUFBLEdBQUE7QUFDYixnQkFBQSxLQUFBO0FBQUEsWUFBQSxLQUFBLEdBQVEsTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUixDQUFBO0FBQUEsWUFDQSxNQUFNLENBQUMsb0JBQVAsQ0FBNEIsS0FBSyxDQUFDLGtCQUFOLENBQXlCLEtBQXpCLEVBQWdDLENBQWhDLEVBQW1DLENBQW5DLENBQTVCLEVBQW1FLEtBQUMsQ0FBQSxTQUFTLENBQUMsSUFBOUUsQ0FEQSxDQUFBO21CQUVBLE1BQU0sQ0FBQyxlQUFQLENBQUEsRUFIYTtVQUFBLENBQWYsQ0FEQSxDQUFBO2lCQUtBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixLQUEvQixFQU5lO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakIsRUFWTztJQUFBLENBTFQsQ0FBQTs7bUJBQUE7O0tBRG9CLFNBM1F0QixDQUFBOztBQUFBLEVBbVNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBQUEsSUFBRSxVQUFBLFFBQUY7QUFBQSxJQUFZLGVBQUEsYUFBWjtBQUFBLElBQTJCLFFBQUEsTUFBM0I7QUFBQSxJQUFtQyxRQUFBLE1BQW5DO0FBQUEsSUFBMkMsTUFBQSxJQUEzQztBQUFBLElBQWlELFFBQUEsTUFBakQ7QUFBQSxJQUNmLFNBQUEsT0FEZTtBQUFBLElBQ04sWUFBQSxVQURNO0FBQUEsSUFDTSxLQUFBLEdBRE47QUFBQSxJQUNXLE1BQUEsSUFEWDtBQUFBLElBQ2lCLFFBQUEsTUFEakI7QUFBQSxJQUN5QixTQUFBLE9BRHpCO0dBblNqQixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/mark/.atom/packages/vim-mode/lib/operators.coffee
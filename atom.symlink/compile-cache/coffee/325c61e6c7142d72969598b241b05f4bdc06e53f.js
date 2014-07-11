(function() {
  var $$, CurrentSelection, Motion, MotionError, MotionWithInput, MoveDown, MoveLeft, MoveRight, MoveToBeginningOfLine, MoveToBottomOfScreen, MoveToEndOfWholeWord, MoveToEndOfWord, MoveToFirstCharacterOfLine, MoveToFirstCharacterOfLineDown, MoveToFirstCharacterOfLineUp, MoveToLastCharacterOfLine, MoveToLine, MoveToMiddleOfScreen, MoveToNextParagraph, MoveToNextWholeWord, MoveToNextWord, MoveToPreviousParagraph, MoveToPreviousWholeWord, MoveToPreviousWord, MoveToScreenLine, MoveToStartOfFile, MoveToTopOfScreen, MoveUp, MoveVertically, Point, Range, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore-plus');

  _ref = require('atom'), $$ = _ref.$$, Point = _ref.Point, Range = _ref.Range;

  MotionError = (function() {
    function MotionError(message) {
      this.message = message;
      this.name = 'Motion Error';
    }

    return MotionError;

  })();

  Motion = (function() {
    function Motion(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.vimState.desiredCursorColumn = null;
    }

    Motion.prototype.isComplete = function() {
      return true;
    };

    Motion.prototype.isRecordable = function() {
      return false;
    };

    Motion.prototype.inVisualMode = function() {
      return this.vimState.mode === "visual";
    };

    return Motion;

  })();

  CurrentSelection = (function(_super) {
    __extends(CurrentSelection, _super);

    function CurrentSelection() {
      return CurrentSelection.__super__.constructor.apply(this, arguments);
    }

    CurrentSelection.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        return true;
      });
    };

    CurrentSelection.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        return true;
      });
    };

    CurrentSelection.prototype.isLinewise = function() {
      return this.vimState.mode === 'visual' && this.vimState.submode === 'linewise';
    };

    return CurrentSelection;

  })(Motion);

  MotionWithInput = (function(_super) {
    __extends(MotionWithInput, _super);

    function MotionWithInput(editorView, vimState) {
      this.editorView = editorView;
      this.vimState = vimState;
      MotionWithInput.__super__.constructor.call(this, this.editorView.editor, this.vimState);
      this.complete = false;
    }

    MotionWithInput.prototype.isComplete = function() {
      return this.complete;
    };

    MotionWithInput.prototype.canComposeWith = function(operation) {
      return operation.characters != null;
    };

    MotionWithInput.prototype.compose = function(input) {
      if (!input.characters) {
        throw new MotionError('Must compose with an Input');
      }
      this.input = input;
      return this.complete = true;
    };

    return MotionWithInput;

  })(Motion);

  MoveLeft = (function(_super) {
    __extends(MoveLeft, _super);

    function MoveLeft() {
      return MoveLeft.__super__.constructor.apply(this, arguments);
    }

    MoveLeft.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var column, row, _ref1;
          _ref1 = _this.editor.getCursorScreenPosition(), row = _ref1.row, column = _ref1.column;
          if (column > 0) {
            return _this.editor.moveCursorLeft();
          }
        };
      })(this));
    };

    MoveLeft.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var column, row, _ref1;
          _ref1 = _this.editor.getCursorScreenPosition(), row = _ref1.row, column = _ref1.column;
          if (column > 0) {
            _this.editor.selectLeft();
            return true;
          } else {
            return false;
          }
        };
      })(this));
    };

    return MoveLeft;

  })(Motion);

  MoveRight = (function(_super) {
    __extends(MoveRight, _super);

    function MoveRight() {
      return MoveRight.__super__.constructor.apply(this, arguments);
    }

    MoveRight.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var column, lastCharIndex, row, _ref1;
          _ref1 = _this.editor.getCursorScreenPosition(), row = _ref1.row, column = _ref1.column;
          lastCharIndex = _this.editor.getBuffer().lineForRow(row).length - 1;
          if (!(column >= lastCharIndex)) {
            return _this.editor.moveCursorRight();
          }
        };
      })(this));
    };

    MoveRight.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var end, rowLength, start, _ref1;
          _ref1 = _this.editor.getSelectedBufferRange(), start = _ref1.start, end = _ref1.end;
          rowLength = _this.editor.getCursor().getCurrentBufferLine().length;
          if (end.column < rowLength) {
            _this.editor.selectRight();
            return true;
          } else {
            return false;
          }
        };
      })(this));
    };

    return MoveRight;

  })(Motion);

  MoveVertically = (function(_super) {
    __extends(MoveVertically, _super);

    function MoveVertically(editor, vimState) {
      var column;
      this.editor = editor;
      this.vimState = vimState;
      column = this.vimState.desiredCursorColumn;
      MoveVertically.__super__.constructor.call(this, this.editor, this.vimState);
      this.vimState.desiredCursorColumn = column;
    }

    MoveVertically.prototype.execute = function(count) {
      var column, nextColumn, nextLineLength, nextRow, row, _ref1;
      if (count == null) {
        count = 1;
      }
      _ref1 = this.editor.getCursorBufferPosition(), row = _ref1.row, column = _ref1.column;
      nextRow = this.nextValidRow(count);
      if (nextRow !== row) {
        nextLineLength = this.editor.lineLengthForBufferRow(nextRow);
        nextColumn = this.vimState.desiredCursorColumn || column;
        if (nextColumn >= nextLineLength) {
          this.editor.setCursorBufferPosition([nextRow, nextLineLength - 1]);
          return this.vimState.desiredCursorColumn = nextColumn;
        } else {
          this.editor.setCursorBufferPosition([nextRow, nextColumn]);
          return this.vimState.desiredCursorColumn = null;
        }
      }
    };

    MoveVertically.prototype.nextValidRow = function(count) {
      var column, maxRow, minRow, row, _ref1;
      _ref1 = this.editor.getCursorBufferPosition(), row = _ref1.row, column = _ref1.column;
      maxRow = this.editor.getLastBufferRow();
      minRow = 0;
      _.times(count, (function(_this) {
        return function() {
          var _results;
          if (_this.editor.isFoldedAtBufferRow(row)) {
            _results = [];
            while (_this.editor.isFoldedAtBufferRow(row)) {
              _results.push(row += _this.directionIncrement());
            }
            return _results;
          } else {
            return row += _this.directionIncrement();
          }
        };
      })(this));
      if (row > maxRow) {
        return maxRow;
      } else if (row < minRow) {
        return minRow;
      } else {
        return row;
      }
    };

    return MoveVertically;

  })(Motion);

  MoveUp = (function(_super) {
    __extends(MoveUp, _super);

    function MoveUp() {
      return MoveUp.__super__.constructor.apply(this, arguments);
    }

    MoveUp.prototype.directionIncrement = function() {
      return -1;
    };

    MoveUp.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      if (!this.inVisualMode()) {
        this.editor.moveCursorToBeginningOfLine();
        this.editor.moveCursorDown();
        this.editor.selectUp();
      }
      return _.times(count, (function(_this) {
        return function() {
          _this.editor.selectUp();
          return true;
        };
      })(this));
    };

    return MoveUp;

  })(MoveVertically);

  MoveDown = (function(_super) {
    __extends(MoveDown, _super);

    function MoveDown() {
      return MoveDown.__super__.constructor.apply(this, arguments);
    }

    MoveDown.prototype.directionIncrement = function() {
      return 1;
    };

    MoveDown.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      if (!this.inVisualMode()) {
        this.editor.selectLine();
      }
      return _.times(count, (function(_this) {
        return function() {
          _this.editor.selectDown();
          return true;
        };
      })(this));
    };

    return MoveDown;

  })(MoveVertically);

  MoveToPreviousWord = (function(_super) {
    __extends(MoveToPreviousWord, _super);

    function MoveToPreviousWord() {
      return MoveToPreviousWord.__super__.constructor.apply(this, arguments);
    }

    MoveToPreviousWord.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          return _this.editor.moveCursorToBeginningOfWord();
        };
      })(this));
    };

    MoveToPreviousWord.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          _this.editor.selectToBeginningOfWord();
          return true;
        };
      })(this));
    };

    return MoveToPreviousWord;

  })(Motion);

  MoveToPreviousWholeWord = (function(_super) {
    __extends(MoveToPreviousWholeWord, _super);

    function MoveToPreviousWholeWord() {
      return MoveToPreviousWholeWord.__super__.constructor.apply(this, arguments);
    }

    MoveToPreviousWholeWord.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var _results;
          _this.editor.moveCursorToBeginningOfWord();
          _results = [];
          while (!_this.isWholeWord() && !_this.isBeginningOfFile()) {
            _results.push(_this.editor.moveCursorToBeginningOfWord());
          }
          return _results;
        };
      })(this));
    };

    MoveToPreviousWholeWord.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          _this.editor.selectToBeginningOfWord();
          while (!_this.isWholeWord() && !_this.isBeginningOfFile()) {
            _this.editor.selectToBeginningOfWord();
          }
          return true;
        };
      })(this));
    };

    MoveToPreviousWholeWord.prototype.isWholeWord = function() {
      var char;
      char = this.editor.getCursor().getCurrentWordPrefix().slice(-1);
      return char === ' ' || char === '\n';
    };

    MoveToPreviousWholeWord.prototype.isBeginningOfFile = function() {
      var cur;
      cur = this.editor.getCursorBufferPosition();
      return !cur.row && !cur.column;
    };

    return MoveToPreviousWholeWord;

  })(Motion);

  MoveToNextWord = (function(_super) {
    __extends(MoveToNextWord, _super);

    function MoveToNextWord() {
      return MoveToNextWord.__super__.constructor.apply(this, arguments);
    }

    MoveToNextWord.prototype.execute = function(count) {
      var cursor;
      if (count == null) {
        count = 1;
      }
      cursor = this.editor.getCursor();
      return _.times(count, (function(_this) {
        return function() {
          var current, next;
          current = cursor.getBufferPosition();
          next = cursor.getBeginningOfNextWordBufferPosition();
          if (_this.isEndOfFile()) {
            return;
          }
          if (cursor.isAtEndOfLine()) {
            cursor.moveDown();
            cursor.moveToBeginningOfLine();
            return cursor.skipLeadingWhitespace();
          } else if (current.row === next.row && current.column === next.column) {
            return cursor.moveToEndOfWord();
          } else {
            return cursor.moveToBeginningOfNextWord();
          }
        };
      })(this));
    };

    MoveToNextWord.prototype.select = function(count, _arg) {
      var cursor, excludeWhitespace;
      if (count == null) {
        count = 1;
      }
      excludeWhitespace = (_arg != null ? _arg : {}).excludeWhitespace;
      cursor = this.editor.getCursor();
      return _.times(count, (function(_this) {
        return function() {
          var current, next;
          current = cursor.getBufferPosition();
          next = cursor.getBeginningOfNextWordBufferPosition();
          if (current.row !== next.row || excludeWhitespace || current === next) {
            _this.editor.selectToEndOfWord();
          } else {
            _this.editor.selectToBeginningOfNextWord();
          }
          return true;
        };
      })(this));
    };

    MoveToNextWord.prototype.isEndOfFile = function() {
      var cur, eof;
      cur = this.editor.getCursor().getBufferPosition();
      eof = this.editor.getEofBufferPosition();
      return cur.row === eof.row && cur.column === eof.column;
    };

    return MoveToNextWord;

  })(Motion);

  MoveToNextWholeWord = (function(_super) {
    __extends(MoveToNextWholeWord, _super);

    function MoveToNextWholeWord() {
      return MoveToNextWholeWord.__super__.constructor.apply(this, arguments);
    }

    MoveToNextWholeWord.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var _results;
          _this.editor.moveCursorToBeginningOfNextWord();
          _results = [];
          while (!_this.isWholeWord() && !_this.isEndOfFile()) {
            _results.push(_this.editor.moveCursorToBeginningOfNextWord());
          }
          return _results;
        };
      })(this));
    };

    MoveToNextWholeWord.prototype.select = function(count, _arg) {
      var cursor, excludeWhitespace;
      if (count == null) {
        count = 1;
      }
      excludeWhitespace = (_arg != null ? _arg : {}).excludeWhitespace;
      cursor = this.editor.getCursor();
      return _.times(count, (function(_this) {
        return function() {
          var current, next;
          current = cursor.getBufferPosition();
          next = cursor.getBeginningOfNextWordBufferPosition(/[^\s]/);
          if (current.row !== next.row || excludeWhitespace) {
            _this.editor.selectToEndOfWord();
          } else {
            _this.editor.selectToBeginningOfNextWord();
            while (!_this.isWholeWord() && !_this.isEndOfFile()) {
              _this.editor.selectToBeginningOfNextWord();
            }
          }
          return true;
        };
      })(this));
    };

    MoveToNextWholeWord.prototype.isWholeWord = function() {
      var char;
      char = this.editor.getCursor().getCurrentWordPrefix().slice(-1);
      return char === ' ' || char === '\n';
    };

    MoveToNextWholeWord.prototype.isEndOfFile = function() {
      var cur, last;
      last = this.editor.getEofBufferPosition();
      cur = this.editor.getCursorBufferPosition();
      return last.row === cur.row && last.column === cur.column;
    };

    return MoveToNextWholeWord;

  })(Motion);

  MoveToEndOfWord = (function(_super) {
    __extends(MoveToEndOfWord, _super);

    function MoveToEndOfWord() {
      return MoveToEndOfWord.__super__.constructor.apply(this, arguments);
    }

    MoveToEndOfWord.prototype.execute = function(count) {
      var cursor;
      if (count == null) {
        count = 1;
      }
      cursor = this.editor.getCursor();
      return _.times(count, (function(_this) {
        return function() {
          return cursor.setBufferPosition(_this.nextBufferPosition({
            exclusive: true
          }));
        };
      })(this));
    };

    MoveToEndOfWord.prototype.select = function(count) {
      var cursor;
      if (count == null) {
        count = 1;
      }
      cursor = this.editor.getCursor();
      return _.times(count, (function(_this) {
        return function() {
          var bufferPosition, screenPosition;
          bufferPosition = _this.nextBufferPosition();
          screenPosition = _this.editor.screenPositionForBufferPosition(bufferPosition);
          _this.editor.selectToScreenPosition(screenPosition);
          return true;
        };
      })(this));
    };

    MoveToEndOfWord.prototype.nextBufferPosition = function(_arg) {
      var current, cursor, exclusive, next;
      exclusive = (_arg != null ? _arg : {}).exclusive;
      cursor = this.editor.getCursor();
      current = cursor.getBufferPosition();
      next = cursor.getEndOfCurrentWordBufferPosition();
      if (exclusive) {
        next.column -= 1;
      }
      if (exclusive && current.row === next.row && current.column === next.column) {
        cursor.moveRight();
        next = cursor.getEndOfCurrentWordBufferPosition();
        next.column -= 1;
      }
      return next;
    };

    return MoveToEndOfWord;

  })(Motion);

  MoveToEndOfWholeWord = (function(_super) {
    __extends(MoveToEndOfWholeWord, _super);

    function MoveToEndOfWholeWord() {
      return MoveToEndOfWholeWord.__super__.constructor.apply(this, arguments);
    }

    MoveToEndOfWholeWord.prototype.execute = function(count) {
      var cursor;
      if (count == null) {
        count = 1;
      }
      cursor = this.editor.getCursor();
      return _.times(count, (function(_this) {
        return function() {
          return cursor.setBufferPosition(_this.nextBufferPosition({
            exclusive: true
          }));
        };
      })(this));
    };

    MoveToEndOfWholeWord.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var bufferPosition, screenPosition;
          bufferPosition = _this.nextBufferPosition();
          screenPosition = _this.editor.screenPositionForBufferPosition(bufferPosition);
          _this.editor.selectToScreenPosition(screenPosition);
          return true;
        };
      })(this));
    };

    MoveToEndOfWholeWord.prototype.nextBufferPosition = function(_arg) {
      var column, exclusive, position, row, scanRange, start, _ref1;
      exclusive = (_arg != null ? _arg : {}).exclusive;
      _ref1 = this.editor.getCursorBufferPosition(), row = _ref1.row, column = _ref1.column;
      start = new Point(row, column + 1);
      scanRange = [start, this.editor.getEofBufferPosition()];
      position = this.editor.getEofBufferPosition();
      this.editor.scanInBufferRange(/\S+/, scanRange, (function(_this) {
        return function(_arg1) {
          var range, stop;
          range = _arg1.range, stop = _arg1.stop;
          position = range.end;
          return stop();
        };
      })(this));
      if (exclusive) {
        position.column -= 1;
      }
      return position;
    };

    return MoveToEndOfWholeWord;

  })(Motion);

  MoveToNextParagraph = (function(_super) {
    __extends(MoveToNextParagraph, _super);

    function MoveToNextParagraph() {
      return MoveToNextParagraph.__super__.constructor.apply(this, arguments);
    }

    MoveToNextParagraph.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          return _this.editor.setCursorScreenPosition(_this.nextPosition());
        };
      })(this));
    };

    MoveToNextParagraph.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          _this.editor.selectToScreenPosition(_this.nextPosition());
          return true;
        };
      })(this));
    };

    MoveToNextParagraph.prototype.nextPosition = function() {
      var column, position, row, scanRange, start, _ref1;
      start = this.editor.getCursorBufferPosition();
      scanRange = [start, this.editor.getEofBufferPosition()];
      _ref1 = this.editor.getEofBufferPosition(), row = _ref1.row, column = _ref1.column;
      position = new Point(row, column - 1);
      this.editor.scanInBufferRange(/^\n*$/g, scanRange, (function(_this) {
        return function(_arg) {
          var range, stop;
          range = _arg.range, stop = _arg.stop;
          if (!range.start.isEqual(start)) {
            position = range.start;
            return stop();
          }
        };
      })(this));
      return this.editor.screenPositionForBufferPosition(position);
    };

    return MoveToNextParagraph;

  })(Motion);

  MoveToPreviousParagraph = (function(_super) {
    __extends(MoveToPreviousParagraph, _super);

    function MoveToPreviousParagraph() {
      return MoveToPreviousParagraph.__super__.constructor.apply(this, arguments);
    }

    MoveToPreviousParagraph.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          return _this.editor.setCursorScreenPosition(_this.previousPosition());
        };
      })(this));
    };

    MoveToPreviousParagraph.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          _this.editor.selectToScreenPosition(_this.previousPosition());
          return true;
        };
      })(this));
    };

    MoveToPreviousParagraph.prototype.previousPosition = function() {
      var column, position, row, scanRange, start;
      start = this.editor.getCursorBufferPosition();
      row = start.row, column = start.column;
      scanRange = [[row - 1, column], [0, 0]];
      position = new Point(0, 0);
      this.editor.backwardsScanInBufferRange(/^\n*$/g, scanRange, (function(_this) {
        return function(_arg) {
          var range, stop;
          range = _arg.range, stop = _arg.stop;
          if (!range.start.isEqual(new Point(0, 0))) {
            position = range.start;
            return stop();
          }
        };
      })(this));
      return this.editor.screenPositionForBufferPosition(position);
    };

    return MoveToPreviousParagraph;

  })(Motion);

  MoveToLine = (function(_super) {
    __extends(MoveToLine, _super);

    function MoveToLine() {
      this.selectRows = __bind(this.selectRows, this);
      return MoveToLine.__super__.constructor.apply(this, arguments);
    }

    MoveToLine.prototype.isLinewise = function() {
      return true;
    };

    MoveToLine.prototype.execute = function(count) {
      this.setCursorPosition(count);
      return this.editor.getCursor().skipLeadingWhitespace();
    };

    MoveToLine.prototype.select = function(count, _arg) {
      var column, requireEOL, row, _ref1;
      if (count == null) {
        count = this.editor.getLineCount();
      }
      requireEOL = (_arg != null ? _arg : {}).requireEOL;
      _ref1 = this.editor.getCursorBufferPosition(), row = _ref1.row, column = _ref1.column;
      this.editor.setSelectedBufferRange(this.selectRows(row, row + (count - 1), {
        requireEOL: requireEOL
      }));
      return _.times(count, function() {
        return true;
      });
    };

    MoveToLine.prototype.selectRows = function(start, end, _arg) {
      var buffer, endPoint, requireEOL, startPoint;
      requireEOL = (_arg != null ? _arg : {}).requireEOL;
      startPoint = null;
      endPoint = null;
      buffer = this.editor.getBuffer();
      if (end === buffer.getLastRow()) {
        if (start > 0 && requireEOL) {
          startPoint = [start - 1, buffer.lineLengthForRow(start - 1)];
        } else {
          startPoint = [start, 0];
        }
        endPoint = [end, buffer.lineLengthForRow(end)];
      } else {
        startPoint = [start, 0];
        endPoint = [end + 1, 0];
      }
      return new Range(startPoint, endPoint);
    };

    MoveToLine.prototype.setCursorPosition = function(count) {
      return this.editor.setCursorBufferPosition([this.getDestinationRow(count), 0]);
    };

    MoveToLine.prototype.getDestinationRow = function(count) {
      if (count != null) {
        return count - 1;
      } else {
        return this.editor.getLineCount() - 1;
      }
    };

    return MoveToLine;

  })(Motion);

  MoveToScreenLine = (function(_super) {
    __extends(MoveToScreenLine, _super);

    function MoveToScreenLine(editor, vimState, editorView, scrolloff) {
      this.editor = editor;
      this.vimState = vimState;
      this.editorView = editorView;
      this.scrolloff = scrolloff;
      this.scrolloff = 2;
      MoveToScreenLine.__super__.constructor.call(this, this.editor, this.vimState);
    }

    MoveToScreenLine.prototype.setCursorPosition = function(count) {
      return this.editor.setCursorScreenPosition([this.getDestinationRow(count), 0]);
    };

    return MoveToScreenLine;

  })(MoveToLine);

  MoveToBeginningOfLine = (function(_super) {
    __extends(MoveToBeginningOfLine, _super);

    function MoveToBeginningOfLine() {
      return MoveToBeginningOfLine.__super__.constructor.apply(this, arguments);
    }

    MoveToBeginningOfLine.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return this.editor.moveCursorToBeginningOfLine();
    };

    MoveToBeginningOfLine.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          _this.editor.selectToBeginningOfLine();
          return true;
        };
      })(this));
    };

    return MoveToBeginningOfLine;

  })(Motion);

  MoveToFirstCharacterOfLine = (function(_super) {
    __extends(MoveToFirstCharacterOfLine, _super);

    function MoveToFirstCharacterOfLine(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.cursor = this.editor.getCursor();
      MoveToFirstCharacterOfLine.__super__.constructor.call(this, this.editor, this.vimState);
    }

    MoveToFirstCharacterOfLine.prototype.execute = function() {
      return this.editor.setCursorBufferPosition([this.cursor.getBufferRow(), this.getDestinationColumn()]);
    };

    MoveToFirstCharacterOfLine.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      if (this.getDestinationColumn() !== this.cursor.getBufferColumn()) {
        return _.times(count, (function(_this) {
          return function() {
            _this.editor.selectToFirstCharacterOfLine();
            return true;
          };
        })(this));
      }
    };

    MoveToFirstCharacterOfLine.prototype.getDestinationColumn = function() {
      return this.editor.lineForBufferRow(this.cursor.getBufferRow()).search(/\S/);
    };

    return MoveToFirstCharacterOfLine;

  })(Motion);

  MoveToLastCharacterOfLine = (function(_super) {
    __extends(MoveToLastCharacterOfLine, _super);

    function MoveToLastCharacterOfLine() {
      return MoveToLastCharacterOfLine.__super__.constructor.apply(this, arguments);
    }

    MoveToLastCharacterOfLine.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      this.vimState.desiredCursorColumn = Infinity;
      return _.times(count, (function(_this) {
        return function() {
          _this.editor.moveCursorToEndOfLine();
          if (_this.editor.getCursor().getBufferColumn() !== 0) {
            return _this.editor.moveCursorLeft();
          }
        };
      })(this));
    };

    MoveToLastCharacterOfLine.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          _this.editor.selectToEndOfLine();
          return true;
        };
      })(this));
    };

    return MoveToLastCharacterOfLine;

  })(Motion);

  MoveToFirstCharacterOfLineUp = (function(_super) {
    __extends(MoveToFirstCharacterOfLineUp, _super);

    function MoveToFirstCharacterOfLineUp() {
      return MoveToFirstCharacterOfLineUp.__super__.constructor.apply(this, arguments);
    }

    MoveToFirstCharacterOfLineUp.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      (new MoveUp(this.editor, this.vimState)).execute(count);
      return (new MoveToFirstCharacterOfLine(this.editor, this.vimState)).execute();
    };

    MoveToFirstCharacterOfLineUp.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return (new MoveUp(this.editor, this.vimState)).select(count);
    };

    return MoveToFirstCharacterOfLineUp;

  })(Motion);

  MoveToFirstCharacterOfLineDown = (function(_super) {
    __extends(MoveToFirstCharacterOfLineDown, _super);

    function MoveToFirstCharacterOfLineDown() {
      return MoveToFirstCharacterOfLineDown.__super__.constructor.apply(this, arguments);
    }

    MoveToFirstCharacterOfLineDown.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      (new MoveDown(this.editor, this.vimState)).execute(count);
      return (new MoveToFirstCharacterOfLine(this.editor, this.vimState)).execute();
    };

    MoveToFirstCharacterOfLineDown.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return (new MoveDown(this.editor, this.vimState)).select(count);
    };

    return MoveToFirstCharacterOfLineDown;

  })(Motion);

  MoveToStartOfFile = (function(_super) {
    __extends(MoveToStartOfFile, _super);

    function MoveToStartOfFile() {
      return MoveToStartOfFile.__super__.constructor.apply(this, arguments);
    }

    MoveToStartOfFile.prototype.isLinewise = function() {
      return this.vimState.mode === 'visual' && this.vimState.submode === 'linewise';
    };

    MoveToStartOfFile.prototype.getDestinationRow = function(count) {
      if (count == null) {
        count = 1;
      }
      return count - 1;
    };

    MoveToStartOfFile.prototype.getDestinationColumn = function(row) {
      if (this.isLinewise()) {
        return 0;
      } else {
        return this.editor.lineForBufferRow(row).search(/\S/);
      }
    };

    MoveToStartOfFile.prototype.getStartingColumn = function(column) {
      if (this.isLinewise()) {
        return column;
      } else {
        return column + 1;
      }
    };

    MoveToStartOfFile.prototype.select = function(count) {
      var bufferRange, column, destinationCol, destinationRow, row, startingCol, _ref1;
      if (count == null) {
        count = 1;
      }
      _ref1 = this.editor.getCursorBufferPosition(), row = _ref1.row, column = _ref1.column;
      startingCol = this.getStartingColumn(column);
      destinationRow = this.getDestinationRow(count);
      destinationCol = this.getDestinationColumn(destinationRow);
      bufferRange = new Range([row, startingCol], [destinationRow, destinationCol]);
      return this.editor.setSelectedBufferRange(bufferRange, {
        reversed: true
      });
    };

    return MoveToStartOfFile;

  })(MoveToLine);

  MoveToTopOfScreen = (function(_super) {
    __extends(MoveToTopOfScreen, _super);

    function MoveToTopOfScreen() {
      return MoveToTopOfScreen.__super__.constructor.apply(this, arguments);
    }

    MoveToTopOfScreen.prototype.getDestinationRow = function(count) {
      var firstScreenRow, offset;
      if (count == null) {
        count = 0;
      }
      firstScreenRow = this.editorView.getFirstVisibleScreenRow();
      if (firstScreenRow > 0) {
        offset = Math.max(count - 1, this.scrolloff);
      } else {
        offset = count > 0 ? count - 1 : count;
      }
      return firstScreenRow + offset;
    };

    return MoveToTopOfScreen;

  })(MoveToScreenLine);

  MoveToBottomOfScreen = (function(_super) {
    __extends(MoveToBottomOfScreen, _super);

    function MoveToBottomOfScreen() {
      return MoveToBottomOfScreen.__super__.constructor.apply(this, arguments);
    }

    MoveToBottomOfScreen.prototype.getDestinationRow = function(count) {
      var lastRow, lastScreenRow, offset;
      if (count == null) {
        count = 0;
      }
      lastScreenRow = this.editorView.getLastVisibleScreenRow();
      lastRow = this.editor.getBuffer().getLastRow();
      if (lastScreenRow !== lastRow) {
        offset = Math.max(count - 1, this.scrolloff);
      } else {
        offset = count > 0 ? count - 1 : count;
      }
      return lastScreenRow - offset;
    };

    return MoveToBottomOfScreen;

  })(MoveToScreenLine);

  MoveToMiddleOfScreen = (function(_super) {
    __extends(MoveToMiddleOfScreen, _super);

    function MoveToMiddleOfScreen() {
      return MoveToMiddleOfScreen.__super__.constructor.apply(this, arguments);
    }

    MoveToMiddleOfScreen.prototype.getDestinationRow = function(count) {
      var firstScreenRow, height, lastScreenRow;
      firstScreenRow = this.editorView.getFirstVisibleScreenRow();
      lastScreenRow = this.editorView.getLastVisibleScreenRow();
      height = lastScreenRow - firstScreenRow;
      return Math.floor(firstScreenRow + (height / 2));
    };

    return MoveToMiddleOfScreen;

  })(MoveToScreenLine);

  module.exports = {
    Motion: Motion,
    MotionWithInput: MotionWithInput,
    CurrentSelection: CurrentSelection,
    MoveLeft: MoveLeft,
    MoveRight: MoveRight,
    MoveUp: MoveUp,
    MoveDown: MoveDown,
    MoveToPreviousWord: MoveToPreviousWord,
    MoveToPreviousWholeWord: MoveToPreviousWholeWord,
    MoveToNextWord: MoveToNextWord,
    MoveToNextWholeWord: MoveToNextWholeWord,
    MoveToEndOfWord: MoveToEndOfWord,
    MoveToNextParagraph: MoveToNextParagraph,
    MoveToPreviousParagraph: MoveToPreviousParagraph,
    MoveToLine: MoveToLine,
    MoveToBeginningOfLine: MoveToBeginningOfLine,
    MoveToFirstCharacterOfLineUp: MoveToFirstCharacterOfLineUp,
    MoveToFirstCharacterOfLineDown: MoveToFirstCharacterOfLineDown,
    MoveToFirstCharacterOfLine: MoveToFirstCharacterOfLine,
    MoveToLastCharacterOfLine: MoveToLastCharacterOfLine,
    MoveToStartOfFile: MoveToStartOfFile,
    MoveToTopOfScreen: MoveToTopOfScreen,
    MoveToBottomOfScreen: MoveToBottomOfScreen,
    MoveToMiddleOfScreen: MoveToMiddleOfScreen,
    MoveToEndOfWholeWord: MoveToEndOfWholeWord,
    MotionError: MotionError
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJpQkFBQTtJQUFBOztzRkFBQTs7QUFBQSxFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsT0FBcUIsT0FBQSxDQUFRLE1BQVIsQ0FBckIsRUFBQyxVQUFBLEVBQUQsRUFBSyxhQUFBLEtBQUwsRUFBWSxhQUFBLEtBRFosQ0FBQTs7QUFBQSxFQUdNO0FBQ1MsSUFBQSxxQkFBRSxPQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxVQUFBLE9BQ2IsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxjQUFSLENBRFc7SUFBQSxDQUFiOzt1QkFBQTs7TUFKRixDQUFBOztBQUFBLEVBT007QUFDUyxJQUFBLGdCQUFFLE1BQUYsRUFBVyxRQUFYLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxTQUFBLE1BQ2IsQ0FBQTtBQUFBLE1BRHFCLElBQUMsQ0FBQSxXQUFBLFFBQ3RCLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxRQUFRLENBQUMsbUJBQVYsR0FBZ0MsSUFBaEMsQ0FEVztJQUFBLENBQWI7O0FBQUEscUJBR0EsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUFHLEtBQUg7SUFBQSxDQUhaLENBQUE7O0FBQUEscUJBSUEsWUFBQSxHQUFjLFNBQUEsR0FBQTthQUFHLE1BQUg7SUFBQSxDQUpkLENBQUE7O0FBQUEscUJBS0EsWUFBQSxHQUFjLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixLQUFrQixTQUFyQjtJQUFBLENBTGQsQ0FBQTs7a0JBQUE7O01BUkYsQ0FBQTs7QUFBQSxFQWVNO0FBQ0osdUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLCtCQUFBLE9BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTs7UUFBQyxR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
//# sourceURL=/Users/mark/src/tarebyte/dotfiles/atom.symlink/packages/vim-mode/lib/motions/general-motions.coffee
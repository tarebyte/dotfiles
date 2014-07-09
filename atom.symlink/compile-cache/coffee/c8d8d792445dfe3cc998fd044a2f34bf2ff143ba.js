(function() {
  var $$, CurrentSelection, Motion, MotionError, MotionWithInput, MoveDown, MoveLeft, MoveRight, MoveToBeginningOfLine, MoveToBottomOfScreen, MoveToEndOfWholeWord, MoveToEndOfWord, MoveToFirstCharacterOfLine, MoveToLastCharacterOfLine, MoveToLine, MoveToMiddleOfScreen, MoveToNextParagraph, MoveToNextWholeWord, MoveToNextWord, MoveToPreviousParagraph, MoveToPreviousWholeWord, MoveToPreviousWord, MoveToScreenLine, MoveToStartOfFile, MoveToTopOfScreen, MoveUp, Point, Range, _, _ref,
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
    }

    Motion.prototype.isComplete = function() {
      return true;
    };

    Motion.prototype.isRecordable = function() {
      return false;
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
      return this.editor.mode === 'visual' && this.editor.submode === 'linewise';
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

  MoveUp = (function(_super) {
    __extends(MoveUp, _super);

    function MoveUp() {
      return MoveUp.__super__.constructor.apply(this, arguments);
    }

    MoveUp.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var column, row, _ref1;
          _ref1 = _this.editor.getCursorScreenPosition(), row = _ref1.row, column = _ref1.column;
          if (row > 0) {
            return _this.editor.moveCursorUp();
          }
        };
      })(this));
    };

    MoveUp.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          _this.editor.selectUp();
          return true;
        };
      })(this));
    };

    return MoveUp;

  })(Motion);

  MoveDown = (function(_super) {
    __extends(MoveDown, _super);

    function MoveDown() {
      return MoveDown.__super__.constructor.apply(this, arguments);
    }

    MoveDown.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var column, row, _ref1;
          _ref1 = _this.editor.getCursorScreenPosition(), row = _ref1.row, column = _ref1.column;
          if (row < (_this.editor.getBuffer().getLineCount() - 1)) {
            return _this.editor.moveCursorDown();
          }
        };
      })(this));
    };

    MoveDown.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          _this.editor.selectDown();
          return true;
        };
      })(this));
    };

    return MoveDown;

  })(Motion);

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
        count = 1;
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

    function MoveToScreenLine(editor, editorView, scrolloff) {
      this.editor = editor;
      this.editorView = editorView;
      this.scrolloff = scrolloff;
      this.scrolloff = 2;
      MoveToScreenLine.__super__.constructor.call(this, this.editor);
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

    function MoveToFirstCharacterOfLine(editor) {
      this.editor = editor;
      this.cursor = this.editor.getCursor();
      MoveToFirstCharacterOfLine.__super__.constructor.call(this, this.editor);
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

  MoveToStartOfFile = (function(_super) {
    __extends(MoveToStartOfFile, _super);

    function MoveToStartOfFile() {
      return MoveToStartOfFile.__super__.constructor.apply(this, arguments);
    }

    MoveToStartOfFile.prototype.getDestinationRow = function(count) {
      if (count == null) {
        count = 1;
      }
      return count - 1;
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZkQUFBO0lBQUE7O3NGQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQSxPQUFxQixPQUFBLENBQVEsTUFBUixDQUFyQixFQUFDLFVBQUEsRUFBRCxFQUFLLGFBQUEsS0FBTCxFQUFZLGFBQUEsS0FEWixDQUFBOztBQUFBLEVBR007QUFDUyxJQUFBLHFCQUFFLE9BQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFVBQUEsT0FDYixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRLGNBQVIsQ0FEVztJQUFBLENBQWI7O3VCQUFBOztNQUpGLENBQUE7O0FBQUEsRUFPTTtBQUNTLElBQUEsZ0JBQUUsTUFBRixFQUFXLFFBQVgsR0FBQTtBQUFzQixNQUFyQixJQUFDLENBQUEsU0FBQSxNQUFvQixDQUFBO0FBQUEsTUFBWixJQUFDLENBQUEsV0FBQSxRQUFXLENBQXRCO0lBQUEsQ0FBYjs7QUFBQSxxQkFFQSxVQUFBLEdBQVksU0FBQSxHQUFBO2FBQUcsS0FBSDtJQUFBLENBRlosQ0FBQTs7QUFBQSxxQkFHQSxZQUFBLEdBQWMsU0FBQSxHQUFBO2FBQUcsTUFBSDtJQUFBLENBSGQsQ0FBQTs7a0JBQUE7O01BUkYsQ0FBQTs7QUFBQSxFQWFNO0FBQ0osdUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLCtCQUFBLE9BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTs7UUFBQyxRQUFNO09BQ2Q7YUFBQSxDQUFDLENBQUMsS0FBRixDQUFRLEtBQVIsRUFBZSxTQUFBLEdBQUE7ZUFBRyxLQUFIO01BQUEsQ0FBZixFQURPO0lBQUEsQ0FBVCxDQUFBOztBQUFBLCtCQUdBLE1BQUEsR0FBUSxTQUFDLEtBQUQsR0FBQTs7UUFBQyxRQUFN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
//# sourceURL=/Users/mark/.atom/packages/vim-mode/lib/motions/general-motions.coffee
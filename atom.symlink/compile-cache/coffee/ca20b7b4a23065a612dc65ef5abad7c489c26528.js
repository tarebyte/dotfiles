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
          if (current !== next) {
            return cursor.moveToBeginningOfNextWord();
          } else {
            return cursor.moveToEndOfWord();
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
      var exclusive, position, scanRange, start;
      exclusive = (_arg != null ? _arg : {}).exclusive;
      this.editor.moveCursorRight();
      start = this.editor.getCursorBufferPosition();
      this.editor.moveCursorLeft();
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
          return _this.editor.moveCursorToEndOfLine();
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
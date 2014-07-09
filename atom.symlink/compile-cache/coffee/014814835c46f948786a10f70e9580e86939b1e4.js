(function() {
  var $$, CurrentSelection, Motion, MoveDown, MoveLeft, MoveRight, MoveToBeginningOfLine, MoveToBottomOfScreen, MoveToEndOfWholeWord, MoveToEndOfWord, MoveToFirstCharacterOfLine, MoveToLastCharacterOfLine, MoveToLine, MoveToMiddleOfScreen, MoveToNextParagraph, MoveToNextWholeWord, MoveToNextWord, MoveToPreviousParagraph, MoveToPreviousWholeWord, MoveToPreviousWord, MoveToScreenLine, MoveToStartOfFile, MoveToTopOfScreen, MoveUp, Point, Range, Search, SearchViewModel, SelectLeft, SelectRight, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore-plus');

  _ref = require('atom'), $$ = _ref.$$, Point = _ref.Point, Range = _ref.Range;

  SearchViewModel = require('./search-view-model');

  Motion = (function() {
    function Motion(editor, state) {
      this.editor = editor;
      this.state = state;
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

  SelectLeft = (function(_super) {
    __extends(SelectLeft, _super);

    function SelectLeft() {
      return SelectLeft.__super__.constructor.apply(this, arguments);
    }

    SelectLeft.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return this.select(count);
    };

    SelectLeft.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          _this.editor.selectLeft();
          return true;
        };
      })(this));
    };

    return SelectLeft;

  })(Motion);

  SelectRight = (function(_super) {
    __extends(SelectRight, _super);

    function SelectRight() {
      return SelectRight.__super__.constructor.apply(this, arguments);
    }

    SelectRight.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return this.select(count);
    };

    SelectRight.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          _this.editor.selectRight();
          return true;
        };
      })(this));
    };

    return SelectRight;

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

    function MoveToFirstCharacterOfLine() {
      return MoveToFirstCharacterOfLine.__super__.constructor.apply(this, arguments);
    }

    MoveToFirstCharacterOfLine.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          return _this.editor.moveCursorToFirstCharacterOfLine();
        };
      })(this));
    };

    MoveToFirstCharacterOfLine.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          _this.editor.selectToFirstCharacterOfLine();
          return true;
        };
      })(this));
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
        count = 0;
      }
      return count;
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

  Search = (function(_super) {
    __extends(Search, _super);

    function Search(editorView, state) {
      this.editorView = editorView;
      this.state = state;
      this.reversed = __bind(this.reversed, this);
      this.repeat = __bind(this.repeat, this);
      Search.__super__.constructor.call(this, this.editorView.editor, this.state);
      this.viewModel = new SearchViewModel(this);
    }

    Search.prototype.repeat = function(opts) {
      if (opts == null) {
        opts = {};
      }
      this.viewModel.repeat(opts);
      return this;
    };

    Search.prototype.reversed = function() {
      this.viewModel.reversed();
      return this;
    };

    Search.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return this.viewModel.execute(count);
    };

    Search.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return this.viewModel.select(count);
    };

    return Search;

  })(Motion);

  module.exports = {
    Motion: Motion,
    CurrentSelection: CurrentSelection,
    SelectLeft: SelectLeft,
    SelectRight: SelectRight,
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
    Search: Search,
    MoveToEndOfWholeWord: MoveToEndOfWholeWord
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlmQUFBO0lBQUE7O3NGQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQSxPQUFxQixPQUFBLENBQVEsTUFBUixDQUFyQixFQUFDLFVBQUEsRUFBRCxFQUFLLGFBQUEsS0FBTCxFQUFZLGFBQUEsS0FEWixDQUFBOztBQUFBLEVBRUEsZUFBQSxHQUFrQixPQUFBLENBQVEscUJBQVIsQ0FGbEIsQ0FBQTs7QUFBQSxFQUlNO0FBQ1MsSUFBQSxnQkFBRSxNQUFGLEVBQVcsS0FBWCxHQUFBO0FBQW1CLE1BQWxCLElBQUMsQ0FBQSxTQUFBLE1BQWlCLENBQUE7QUFBQSxNQUFULElBQUMsQ0FBQSxRQUFBLEtBQVEsQ0FBbkI7SUFBQSxDQUFiOztBQUFBLHFCQUVBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFBRyxLQUFIO0lBQUEsQ0FGWixDQUFBOztBQUFBLHFCQUdBLFlBQUEsR0FBYyxTQUFBLEdBQUE7YUFBRyxNQUFIO0lBQUEsQ0FIZCxDQUFBOztrQkFBQTs7TUFMRixDQUFBOztBQUFBLEVBVU07QUFDSix1Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsK0JBQUEsT0FBQSxHQUFTLFNBQUMsS0FBRCxHQUFBOztRQUFDLFFBQU07T0FDZDthQUFBLENBQUMsQ0FBQyxLQUFGLENBQVEsS0FBUixFQUFlLFNBQUEsR0FBQTtlQUFHLEtBQUg7TUFBQSxDQUFmLEVBRE87SUFBQSxDQUFULENBQUE7O0FBQUEsK0JBR0EsTUFBQSxHQUFRLFNBQUMsS0FBRCxHQUFBOztRQUFDLFFBQU07T0FDYjthQUFBLENBQUMsQ0FBQyxLQUFGLENBQVEsS0FBUixFQUFlLFNBQUEsR0FBQTtlQUFHLEtBQUg7TUFBQSxDQUFmLEVBRE07SUFBQSxDQUhSLENBQUE7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
//# sourceURL=/Users/mark/.atom/packages/vim-mode/lib/motions.coffee
(function() {
  var SelectInsideBrackets, SelectInsideQuotes, SelectInsideWord, TextObject,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TextObject = (function() {
    function TextObject(editor, state) {
      this.editor = editor;
      this.state = state;
    }

    TextObject.prototype.isComplete = function() {
      return true;
    };

    TextObject.prototype.isRecordable = function() {
      return false;
    };

    return TextObject;

  })();

  SelectInsideWord = (function(_super) {
    __extends(SelectInsideWord, _super);

    function SelectInsideWord() {
      return SelectInsideWord.__super__.constructor.apply(this, arguments);
    }

    SelectInsideWord.prototype.select = function() {
      this.editor.selectWord();
      return [true];
    };

    return SelectInsideWord;

  })(TextObject);

  SelectInsideQuotes = (function(_super) {
    __extends(SelectInsideQuotes, _super);

    function SelectInsideQuotes(editor, char) {
      this.editor = editor;
      this.char = char;
    }

    SelectInsideQuotes.prototype.findOpeningQuote = function(pos) {
      var line;
      pos = pos.copy();
      while (pos.row >= 0) {
        line = this.editor.lineForBufferRow(pos.row);
        if (pos.column === -1) {
          pos.column = line.length - 1;
        }
        while (pos.column >= 0) {
          if (line[pos.column] === this.char) {
            if (pos.column === 0 || line[pos.column - 1] !== '\\') {
              return pos;
            }
          }
          --pos.column;
        }
        pos.column = -1;
        --pos.row;
      }
    };

    SelectInsideQuotes.prototype.findClosingQuote = function(start) {
      var end, endLine, escaping;
      end = start.copy();
      escaping = false;
      while (end.row < this.editor.getLineCount()) {
        endLine = this.editor.lineForBufferRow(end.row);
        while (end.column < endLine.length) {
          if (endLine[end.column] === '\\') {
            ++end.column;
          } else if (endLine[end.column] === this.char) {
            this.editor.expandSelectionsForward((function(_this) {
              return function(selection) {
                selection.cursor.setBufferPosition(start);
                return selection.selectToBufferPosition(end);
              };
            })(this));
            return {
              select: [true],
              end: end
            };
          }
          ++end.column;
        }
        end.column = 0;
        ++end.row;
      }
      return {
        select: [false],
        end: end
      };
    };

    SelectInsideQuotes.prototype.select = function() {
      var end, select, start, _ref;
      start = this.findOpeningQuote(this.editor.getCursorBufferPosition());
      if (start == null) {
        return [false];
      }
      ++start.column;
      _ref = this.findClosingQuote(start), select = _ref.select, end = _ref.end;
      return select;
    };

    return SelectInsideQuotes;

  })(TextObject);

  SelectInsideBrackets = (function(_super) {
    __extends(SelectInsideBrackets, _super);

    function SelectInsideBrackets(editor, beginChar, endChar) {
      this.editor = editor;
      this.beginChar = beginChar;
      this.endChar = endChar;
    }

    SelectInsideBrackets.prototype.findOpeningBracket = function(pos) {
      var depth, line;
      pos = pos.copy();
      depth = 0;
      while (pos.row >= 0) {
        line = this.editor.lineForBufferRow(pos.row);
        if (pos.column === -1) {
          pos.column = line.length - 1;
        }
        while (pos.column >= 0) {
          switch (line[pos.column]) {
            case this.endChar:
              ++depth;
              break;
            case this.beginChar:
              if (--depth < 0) {
                return pos;
              }
          }
          --pos.column;
        }
        pos.column = -1;
        --pos.row;
      }
    };

    SelectInsideBrackets.prototype.findClosingBracket = function(start) {
      var depth, end, endLine;
      end = start.copy();
      depth = 0;
      while (end.row < this.editor.getLineCount()) {
        endLine = this.editor.lineForBufferRow(end.row);
        while (end.column < endLine.length) {
          switch (endLine[end.column]) {
            case this.beginChar:
              ++depth;
              break;
            case this.endChar:
              if (--depth < 0) {
                this.editor.expandSelectionsForward((function(_this) {
                  return function(selection) {
                    selection.cursor.setBufferPosition(start);
                    return selection.selectToBufferPosition(end);
                  };
                })(this));
                return {
                  select: [true],
                  end: end
                };
              }
          }
          ++end.column;
        }
        end.column = 0;
        ++end.row;
      }
      return {
        select: [false],
        end: end
      };
    };

    SelectInsideBrackets.prototype.select = function() {
      var end, select, start, _ref;
      start = this.findOpeningBracket(this.editor.getCursorBufferPosition());
      if (start == null) {
        return [false];
      }
      ++start.column;
      _ref = this.findClosingBracket(start), select = _ref.select, end = _ref.end;
      return select;
    };

    return SelectInsideBrackets;

  })(TextObject);

  module.exports = {
    TextObject: TextObject,
    SelectInsideWord: SelectInsideWord,
    SelectInsideQuotes: SelectInsideQuotes,
    SelectInsideBrackets: SelectInsideBrackets
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNFQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBTTtBQUNTLElBQUEsb0JBQUUsTUFBRixFQUFXLEtBQVgsR0FBQTtBQUFtQixNQUFsQixJQUFDLENBQUEsU0FBQSxNQUFpQixDQUFBO0FBQUEsTUFBVCxJQUFDLENBQUEsUUFBQSxLQUFRLENBQW5CO0lBQUEsQ0FBYjs7QUFBQSx5QkFFQSxVQUFBLEdBQVksU0FBQSxHQUFBO2FBQUcsS0FBSDtJQUFBLENBRlosQ0FBQTs7QUFBQSx5QkFHQSxZQUFBLEdBQWMsU0FBQSxHQUFBO2FBQUcsTUFBSDtJQUFBLENBSGQsQ0FBQTs7c0JBQUE7O01BREYsQ0FBQTs7QUFBQSxFQU1NO0FBQ0osdUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLCtCQUFBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixNQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFBLENBQUEsQ0FBQTthQUNBLENBQUMsSUFBRCxFQUZNO0lBQUEsQ0FBUixDQUFBOzs0QkFBQTs7S0FENkIsV0FOL0IsQ0FBQTs7QUFBQSxFQWVNO0FBQ0oseUNBQUEsQ0FBQTs7QUFBYSxJQUFBLDRCQUFFLE1BQUYsRUFBVyxJQUFYLEdBQUE7QUFBa0IsTUFBakIsSUFBQyxDQUFBLFNBQUEsTUFBZ0IsQ0FBQTtBQUFBLE1BQVIsSUFBQyxDQUFBLE9BQUEsSUFBTyxDQUFsQjtJQUFBLENBQWI7O0FBQUEsaUNBRUEsZ0JBQUEsR0FBa0IsU0FBQyxHQUFELEdBQUE7QUFDaEIsVUFBQSxJQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sR0FBRyxDQUFDLElBQUosQ0FBQSxDQUFOLENBQUE7QUFDQSxhQUFNLEdBQUcsQ0FBQyxHQUFKLElBQVcsQ0FBakIsR0FBQTtBQUNFLFFBQUEsSUFBQSxHQUFPLElBQUMs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
//# sourceURL=/Users/mark/.atom/packages/vim-mode/lib/text-objects.coffee
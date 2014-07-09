(function() {
  var $$, BracketMatchingMotion, Input, MotionWithInput, Point, Range, Search, SearchBase, SearchCurrentWord, SearchViewModel, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  MotionWithInput = require('./general-motions').MotionWithInput;

  SearchViewModel = require('../view-models/search-view-model');

  Input = require('../view-models/view-model').Input;

  _ref = require('atom'), $$ = _ref.$$, Point = _ref.Point, Range = _ref.Range;

  SearchBase = (function(_super) {
    __extends(SearchBase, _super);

    SearchBase.currentSearch = null;

    function SearchBase(editorView, vimState) {
      this.editorView = editorView;
      this.vimState = vimState;
      this.reversed = __bind(this.reversed, this);
      this.repeat = __bind(this.repeat, this);
      SearchBase.__super__.constructor.call(this, this.editorView, this.vimState);
      Search.currentSearch = this;
      this.reverse = this.initiallyReversed = false;
    }

    SearchBase.prototype.repeat = function(opts) {
      var reverse;
      if (opts == null) {
        opts = {};
      }
      reverse = opts.backwards;
      if (this.initiallyReversed && reverse) {
        this.reverse = false;
      } else {
        this.reverse = reverse || this.initiallyReversed;
      }
      return this;
    };

    SearchBase.prototype.reversed = function() {
      this.initiallyReversed = this.reverse = true;
      return this;
    };

    SearchBase.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      this.scan();
      return this.match(count, (function(_this) {
        return function(pos) {
          return _this.editor.setCursorBufferPosition(pos.range.start);
        };
      })(this));
    };

    SearchBase.prototype.select = function(count) {
      var selectionStart;
      if (count == null) {
        count = 1;
      }
      this.scan();
      selectionStart = this.getSelectionStart();
      this.match(count, (function(_this) {
        return function(pos) {
          var reversed;
          reversed = selectionStart.compare(pos.range.start) > 0;
          return _this.editor.setSelectedBufferRange([selectionStart, pos.range.start], {
            reversed: reversed
          });
        };
      })(this));
      return [true];
    };

    SearchBase.prototype.getSelectionStart = function() {
      var cur, end, start, _ref1;
      cur = this.editor.getCursorBufferPosition();
      _ref1 = this.editor.getSelectedBufferRange(), start = _ref1.start, end = _ref1.end;
      if (start.compare(cur) === 0) {
        return end;
      } else {
        return start;
      }
    };

    SearchBase.prototype.match = function(count, callback) {
      var pos;
      pos = this.matches[(count - 1) % this.matches.length];
      if (pos != null) {
        return callback(pos);
      } else {
        return atom.beep();
      }
    };

    SearchBase.prototype.scan = function() {
      var after, cur, iterator, matchPoints, previous, regexp, term;
      term = this.input.characters;
      regexp = (function() {
        try {
          return new RegExp(term, 'g');
        } catch (_error) {
          return new RegExp(_.escapeRegExp(term), 'g');
        }
      })();
      cur = this.editor.getCursorBufferPosition();
      matchPoints = [];
      iterator = (function(_this) {
        return function(item) {
          var matchPointItem;
          matchPointItem = {
            range: item.range
          };
          return matchPoints.push(matchPointItem);
        };
      })(this);
      this.editor.scan(regexp, iterator);
      previous = _.filter(matchPoints, (function(_this) {
        return function(point) {
          if (_this.reverse) {
            return point.range.start.compare(cur) < 0;
          } else {
            return point.range.start.compare(cur) <= 0;
          }
        };
      })(this));
      after = _.difference(matchPoints, previous);
      after.push.apply(after, previous);
      if (this.reverse) {
        after = after.reverse();
      }
      return this.matches = after;
    };

    return SearchBase;

  })(MotionWithInput);

  Search = (function(_super) {
    __extends(Search, _super);

    function Search(editorView, vimState) {
      this.editorView = editorView;
      this.vimState = vimState;
      Search.__super__.constructor.call(this, this.editorView, this.vimState);
      this.viewModel = new SearchViewModel(this);
      Search.currentSearch = this;
      this.reverse = this.initiallyReversed = false;
    }

    Search.prototype.compose = function(input) {
      Search.__super__.compose.call(this, input);
      return this.viewModel.value = this.input.characters;
    };

    return Search;

  })(SearchBase);

  SearchCurrentWord = (function(_super) {
    __extends(SearchCurrentWord, _super);

    SearchCurrentWord.keywordRegex = null;

    function SearchCurrentWord(editorView, vimState) {
      var defaultIsKeyword, userIsKeyword;
      this.editorView = editorView;
      this.vimState = vimState;
      SearchCurrentWord.__super__.constructor.call(this, this.editorView, this.vimState);
      Search.currentSearch = this;
      this.reverse = this.initiallyReversed = false;
      defaultIsKeyword = "[@a-zA-Z0-9_\-]+";
      userIsKeyword = atom.config.get('vim-mode.iskeyword');
      this.keywordRegex = new RegExp(userIsKeyword || defaultIsKeyword);
      this.input = new Input(this.getCurrentWordMatch());
    }

    SearchCurrentWord.prototype.getCurrentWord = function(onRecursion) {
      var characters, cursor, wordRange;
      if (onRecursion == null) {
        onRecursion = false;
      }
      cursor = this.editor.getCursor();
      wordRange = cursor.getCurrentWordBufferRange({
        wordRegex: this.keywordRegex
      });
      characters = this.editor.getTextInBufferRange(wordRange);
      if (characters.length === 0 && !onRecursion) {
        if (this.cursorIsOnEOF()) {
          return "";
        } else {
          cursor.moveToNextWordBoundary({
            wordRegex: this.keywordRegex
          });
          return this.getCurrentWord(true);
        }
      } else {
        return characters;
      }
    };

    SearchCurrentWord.prototype.cursorIsOnEOF = function() {
      var cursor, eofPos, pos;
      cursor = this.editor.getCursor();
      pos = cursor.getMoveNextWordBoundaryBufferPosition({
        wordRegex: this.keywordRegex
      });
      eofPos = this.editor.getEofBufferPosition();
      return pos.row === eofPos.row && pos.column === eofPos.column;
    };

    SearchCurrentWord.prototype.getCurrentWordMatch = function() {
      var characters;
      characters = this.getCurrentWord();
      if (characters.length > 0) {
        if (/\W/.test(characters)) {
          return "" + characters + "\\b";
        } else {
          return "\\b" + characters + "\\b";
        }
      } else {
        return characters;
      }
    };

    SearchCurrentWord.prototype.isComplete = function() {
      return true;
    };

    SearchCurrentWord.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      if (this.input.characters.length > 0) {
        return SearchCurrentWord.__super__.execute.call(this, count);
      }
    };

    return SearchCurrentWord;

  })(SearchBase);

  BracketMatchingMotion = (function(_super) {
    __extends(BracketMatchingMotion, _super);

    BracketMatchingMotion.keywordRegex = null;

    function BracketMatchingMotion(editorView, vimState) {
      this.editorView = editorView;
      this.vimState = vimState;
      BracketMatchingMotion.__super__.constructor.call(this, this.editorView, this.vimState);
      Search.currentSearch = this;
      this.reverse = this.initiallyReversed = false;
      this.characters = [')', '(', '}', '{', ']', '['];
      this.charactersMatching = ['(', ')', '{', '}', '[', ']'];
      this.reverseSearch = [true, false, true, false, true, false];
      this.input = new Input(this.getCurrentWordMatch());
    }

    BracketMatchingMotion.prototype.getCurrentWord = function(onRecursion) {
      var cursor, index, tempPoint;
      if (onRecursion == null) {
        onRecursion = false;
      }
      cursor = this.editor.getCursor();
      tempPoint = cursor.getBufferPosition().toArray();
      this.character = this.editor.getTextInBufferRange([cursor.getBufferPosition(), new Point(tempPoint[0], tempPoint[1] + 1)]);
      this.startUp = false;
      index = this.characters.indexOf(this.character);
      if (index >= 0) {
        this.matching = this.charactersMatching[index];
        this.reverse = this.reverseSearch[index];
      } else {
        this.startUp = true;
      }
      return this.character;
    };

    BracketMatchingMotion.prototype.getCurrentWordMatch = function() {
      var characters;
      characters = this.getCurrentWord();
      return characters;
    };

    BracketMatchingMotion.prototype.isComplete = function() {
      return true;
    };

    BracketMatchingMotion.prototype.searchFor = function(character) {
      var after, cur, iterator, matchPoints, matches, previous, regexp, term;
      term = character;
      regexp = new RegExp(_.escapeRegExp(term), 'g');
      cur = this.editor.getCursorBufferPosition();
      matchPoints = [];
      iterator = (function(_this) {
        return function(item) {
          var matchPointItem;
          matchPointItem = {
            range: item.range
          };
          return matchPoints.push(matchPointItem);
        };
      })(this);
      this.editor.scan(regexp, iterator);
      previous = _.filter(matchPoints, (function(_this) {
        return function(point) {
          if (_this.reverse) {
            return point.range.start.compare(cur) < 0;
          } else {
            return point.range.start.compare(cur) <= 0;
          }
        };
      })(this));
      if (this.reverse) {
        after = [];
        after.push.apply(after, previous);
        after = after.reverse();
      } else {
        after = _.difference(matchPoints, previous);
      }
      matches = after;
      return matches;
    };

    BracketMatchingMotion.prototype.select = function(count) {
      var cur;
      if (count == null) {
        count = 1;
      }
      this.scan();
      cur = this.startUp ? this.startUpPos : this.editor.getCursorBufferPosition();
      this.match(count, (function(_this) {
        return function(pos) {
          var tempPoint;
          if (_this.reverse) {
            tempPoint = cur.toArray();
            return _this.editor.setSelectedBufferRange([pos.range.start, new Point(tempPoint[0], tempPoint[1] + 1)], {
              reversed: true
            });
          } else {
            tempPoint = pos.range.start.toArray();
            return _this.editor.setSelectedBufferRange([cur, new Point(tempPoint[0], tempPoint[1] + 1)], {
              reversed: true
            });
          }
        };
      })(this));
      return [true];
    };

    BracketMatchingMotion.prototype.scan = function() {
      var charIndex, compVal, counter, dst, i, iwin, line, matchIndex, matchesCharacter, matchesMatching, min, retVal, winner, _i, _ref1;
      if (this.startUp) {
        this.startUpPos = this.editor.getCursorBufferPosition();
        min = -1;
        iwin = -1;
        for (i = _i = 0, _ref1 = this.characters.length - 1; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
          matchesCharacter = this.searchFor(this.characters[i]);
          if (matchesCharacter.length > 0) {
            dst = matchesCharacter[0].range.start.toArray();
            if (this.startUpPos.toArray()[0] === dst[0] && this.startUpPos.toArray()[1] < dst[1]) {
              if (dst[1] < min || min === -1) {
                line = dst[0];
                min = dst[1];
                iwin = i;
              }
            }
          }
        }
        if (iwin !== -1) {
          this.editor.setCursorBufferPosition(new Point(line, min));
          this.character = this.characters[iwin];
          this.matching = this.charactersMatching[iwin];
          this.reverse = this.reverseSearch[iwin];
        }
      }
      matchesCharacter = this.searchFor(this.character);
      matchesMatching = this.searchFor(this.matching);
      if (matchesMatching.length === 0) {
        this.matches = [];
      } else {
        charIndex = 0;
        matchIndex = 0;
        counter = 1;
        winner = -1;
        if (this.reverse) {
          compVal = 1;
        } else {
          compVal = -1;
        }
        while (counter > 0) {
          if (matchIndex < matchesMatching.length && charIndex < matchesCharacter.length) {
            if (matchesCharacter[charIndex].range.compare(matchesMatching[matchIndex].range) === compVal) {
              counter = counter + 1;
              charIndex = charIndex + 1;
            } else {
              counter = counter - 1;
              winner = matchIndex;
              matchIndex = matchIndex + 1;
            }
          } else if (matchIndex < matchesMatching.length) {
            counter = counter - 1;
            winner = matchIndex;
            matchIndex = matchIndex + 1;
          } else {
            break;
          }
        }
        retVal = [];
        if (counter === 0) {
          retVal.push(matchesMatching[winner]);
        }
        this.matches = retVal;
      }
      if (this.matches.length === 0 && this.startUp) {
        return this.editor.setCursorBufferPosition(this.startUpPos);
      }
    };

    BracketMatchingMotion.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      if (this.input.characters.length > 0) {
        return BracketMatchingMotion.__super__.execute.call(this, count);
      }
    };

    return BracketMatchingMotion;

  })(SearchBase);

  module.exports = {
    Search: Search,
    SearchCurrentWord: SearchCurrentWord,
    BracketMatchingMotion: BracketMatchingMotion
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdJQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQyxrQkFBbUIsT0FBQSxDQUFRLG1CQUFSLEVBQW5CLGVBREQsQ0FBQTs7QUFBQSxFQUVBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLGtDQUFSLENBRmxCLENBQUE7O0FBQUEsRUFHQyxRQUFTLE9BQUEsQ0FBUSwyQkFBUixFQUFULEtBSEQsQ0FBQTs7QUFBQSxFQUlBLE9BQXFCLE9BQUEsQ0FBUSxNQUFSLENBQXJCLEVBQUMsVUFBQSxFQUFELEVBQUssYUFBQSxLQUFMLEVBQVksYUFBQSxLQUpaLENBQUE7O0FBQUEsRUFNTTtBQUNKLGlDQUFBLENBQUE7O0FBQUEsSUFBQSxVQUFDLENBQUEsYUFBRCxHQUFnQixJQUFoQixDQUFBOztBQUNhLElBQUEsb0JBQUUsVUFBRixFQUFlLFFBQWYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLGFBQUEsVUFDYixDQUFBO0FBQUEsTUFEeUIsSUFBQyxDQUFBLFdBQUEsUUFDMUIsQ0FBQTtBQUFBLGlEQUFBLENBQUE7QUFBQSw2Q0FBQSxDQUFBO0FBQUEsTUFBQSw0Q0FBTSxJQUFDLENBQUEsVUFBUCxFQUFtQixJQUFDLENBQUEsUUFBcEIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxNQUFNLENBQUMsYUFBUCxHQUF1QixJQUR2QixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUMsQ0FBQSxpQkFBRCxHQUFxQixLQUZoQyxDQURXO0lBQUEsQ0FEYjs7QUFBQSx5QkFNQSxNQUFBLEdBQVEsU0FBQyxJQUFELEdBQUE7QUFDTixVQUFBLE9BQUE7O1FBRE8sT0FBTztPQUNkO0FBQUEsTUFBQSxPQUFBLEdBQVUs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
//# sourceURL=/Users/mark/.atom/packages/vim-mode/lib/motions/search-motion.coffee
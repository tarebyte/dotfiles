(function() {
  var Input, MotionWithInput, Search, SearchBase, SearchCurrentWord, SearchViewModel, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  MotionWithInput = require('./general-motions').MotionWithInput;

  SearchViewModel = require('../view-models/search-view-model');

  Input = require('../view-models/view-model').Input;

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
          return _this.editor.setCursorBufferPosition(pos);
        };
      })(this));
    };

    SearchBase.prototype.select = function(count) {
      var cur;
      if (count == null) {
        count = 1;
      }
      this.scan();
      cur = this.editor.getCursorBufferPosition();
      this.match(count, (function(_this) {
        return function(pos) {
          return _this.editor.setSelectedBufferRange([cur, pos]);
        };
      })(this));
      return [true];
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
          return matchPoints.push(item.range.start);
        };
      })(this);
      this.editor.scan(regexp, iterator);
      previous = _.filter(matchPoints, (function(_this) {
        return function(point) {
          if (_this.reverse) {
            return point.compare(cur) < 0;
          } else {
            return point.compare(cur) <= 0;
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

  module.exports = {
    Search: Search,
    SearchCurrentWord: SearchCurrentWord
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlGQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQyxrQkFBbUIsT0FBQSxDQUFRLG1CQUFSLEVBQW5CLGVBREQsQ0FBQTs7QUFBQSxFQUVBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLGtDQUFSLENBRmxCLENBQUE7O0FBQUEsRUFHQyxRQUFTLE9BQUEsQ0FBUSwyQkFBUixFQUFULEtBSEQsQ0FBQTs7QUFBQSxFQUtNO0FBQ0osaUNBQUEsQ0FBQTs7QUFBQSxJQUFBLFVBQUMsQ0FBQSxhQUFELEdBQWdCLElBQWhCLENBQUE7O0FBQ2EsSUFBQSxvQkFBRSxVQUFGLEVBQWUsUUFBZixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsYUFBQSxVQUNiLENBQUE7QUFBQSxNQUR5QixJQUFDLENBQUEsV0FBQSxRQUMxQixDQUFBO0FBQUEsaURBQUEsQ0FBQTtBQUFBLDZDQUFBLENBQUE7QUFBQSxNQUFBLDRDQUFNLElBQUMsQ0FBQSxVQUFQLEVBQW1CLElBQUMsQ0FBQSxRQUFwQixDQUFBLENBQUE7QUFBQSxNQUNBLE1BQU0sQ0FBQyxhQUFQLEdBQXVCLElBRHZCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBQyxDQUFBLGlCQUFELEdBQXFCLEtBRmhDLENBRFc7SUFBQSxDQURiOztBQUFBLHlCQU1BLE1BQUEsR0FBUSxTQUFDLElBQUQsR0FBQTtBQUNOLFVBQUEsT0FBQTs7UUFETyxPQUFPO09BQ2Q7QUFBQSxNQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsU0FBZixDQUFBO0FBQ0EsTUFBQSxJQUFHLElBQUMsQ0FBQSxpQkFBRCxJQUF1QixPQUExQjtBQUNFLFFBQUEsSUFBQyxDQUFBLE9BQUQs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
//# sourceURL=/Users/mark/.atom/packages/vim-mode/lib/motions/search-motion.coffee
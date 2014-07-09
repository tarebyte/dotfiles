(function() {
  var Find, MotionWithInput, Point, Range, Till, ViewModel, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  MotionWithInput = require('./general-motions').MotionWithInput;

  ViewModel = require('../view-models/view-model').ViewModel;

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range;

  Find = (function(_super) {
    __extends(Find, _super);

    function Find(editorView, vimState) {
      this.editorView = editorView;
      this.vimState = vimState;
      Find.__super__.constructor.call(this, this.editorView, this.vimState);
      this.viewModel = new ViewModel(this, {
        "class": 'find',
        singleChar: true,
        hidden: true
      });
      this.reversed = false;
      this.offset = 0;
    }

    Find.prototype.match = function(count) {
      var currentPosition, i, index, line, point, _i, _j, _ref1, _ref2;
      currentPosition = this.editorView.editor.getCursorBufferPosition();
      line = this.editorView.editor.lineForBufferRow(currentPosition.row);
      if (this.reversed) {
        index = currentPosition.column;
        for (i = _i = 0, _ref1 = count - 1; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
          index = line.lastIndexOf(this.input.characters, index - 1);
        }
        if (index !== -1) {
          point = new Point(currentPosition.row, index + this.offset);
          return {
            point: point,
            range: new Range(point, currentPosition)
          };
        }
      } else {
        index = currentPosition.column;
        for (i = _j = 0, _ref2 = count - 1; 0 <= _ref2 ? _j <= _ref2 : _j >= _ref2; i = 0 <= _ref2 ? ++_j : --_j) {
          index = line.indexOf(this.input.characters, index + 1);
        }
        if (index !== -1) {
          point = new Point(currentPosition.row, index - this.offset);
          return {
            point: point,
            range: new Range(currentPosition, point.translate([0, 1]))
          };
        }
      }
    };

    Find.prototype.reverse = function() {
      this.reversed = !this.reversed;
      return this;
    };

    Find.prototype.execute = function(count) {
      var match;
      if (count == null) {
        count = 1;
      }
      if ((match = this.match(count)) != null) {
        return this.editorView.editor.setCursorBufferPosition(match.point);
      }
    };

    Find.prototype.select = function(count, _arg) {
      var match, requireEOL;
      if (count == null) {
        count = 1;
      }
      requireEOL = (_arg != null ? _arg : {}).requireEOL;
      if ((match = this.match(count)) != null) {
        this.editorView.editor.setSelectedBufferRange(match.range);
        return [true];
      }
      return [false];
    };

    return Find;

  })(MotionWithInput);

  Till = (function(_super) {
    __extends(Till, _super);

    function Till(editorView, vimState) {
      this.editorView = editorView;
      this.vimState = vimState;
      Till.__super__.constructor.call(this, this.editorView, this.vimState);
      this.offset = 1;
    }

    return Till;

  })(Find);

  module.exports = {
    Find: Find,
    Till: Till
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxrQkFBbUIsT0FBQSxDQUFRLG1CQUFSLEVBQW5CLGVBQUQsQ0FBQTs7QUFBQSxFQUNDLFlBQWEsT0FBQSxDQUFRLDJCQUFSLEVBQWIsU0FERCxDQUFBOztBQUFBLEVBRUEsT0FBaUIsT0FBQSxDQUFRLE1BQVIsQ0FBakIsRUFBQyxhQUFBLEtBQUQsRUFBUSxhQUFBLEtBRlIsQ0FBQTs7QUFBQSxFQUlNO0FBQ0osMkJBQUEsQ0FBQTs7QUFBYSxJQUFBLGNBQUUsVUFBRixFQUFlLFFBQWYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLGFBQUEsVUFDYixDQUFBO0FBQUEsTUFEeUIsSUFBQyxDQUFBLFdBQUEsUUFDMUIsQ0FBQTtBQUFBLE1BQUEsc0NBQU0sSUFBQyxDQUFBLFVBQVAsRUFBbUIsSUFBQyxDQUFBLFFBQXBCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFNBQUQsR0FBaUIsSUFBQSxTQUFBLENBQVUsSUFBVixFQUFhO0FBQUEsUUFBQSxPQUFBLEVBQU8sTUFBUDtBQUFBLFFBQWUsVUFBQSxFQUFZLElBQTNCO0FBQUEsUUFBaUMsTUFBQSxFQUFRLElBQXpDO09BQWIsQ0FEakIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQUZaLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxNQUFELEdBQVUsQ0FIVixDQURXO0lBQUEsQ0FBYjs7QUFBQSxtQkFNQSxLQUFBLEdBQU8sU0FBQyxLQUFELEdBQUE7QUFDTCxVQUFBLDREQUFBO0FBQUEsTUFBQSxlQUFBLEdBQWtCLElBQUMsQ0FBQSxVQUFVLENBQUMsTUFBTSxDQUFDLHVCQUFuQixDQUFBLENBQWxCLENBQUE7QUFBQSxNQUNBLElBQUEsR0FBTyxJQUFD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
//# sourceURL=/Users/mark/.atom/packages/vim-mode/lib/motions/find-motion.coffee
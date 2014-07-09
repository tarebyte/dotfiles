(function() {
  var MotionWithInput, MoveToMark, Point, Range, ViewModel, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  MotionWithInput = require('./general-motions').MotionWithInput;

  ViewModel = require('../view-models/view-model').ViewModel;

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range;

  module.exports = MoveToMark = (function(_super) {
    __extends(MoveToMark, _super);

    function MoveToMark(editorView, vimState, linewise) {
      this.editorView = editorView;
      this.vimState = vimState;
      this.linewise = linewise != null ? linewise : true;
      MoveToMark.__super__.constructor.call(this, this.editorView, this.vimState);
      this.viewModel = new ViewModel(this, {
        "class": 'move-to-mark',
        singleChar: true,
        hidden: true
      });
    }

    MoveToMark.prototype.isLinewise = function() {
      return this.linewise;
    };

    MoveToMark.prototype.execute = function() {
      var markPosition;
      markPosition = this.vimState.getMark(this.input.characters);
      if (markPosition != null) {
        this.editor.setCursorBufferPosition(markPosition);
      }
      if (this.linewise) {
        return this.editorView.trigger('vim-mode:move-to-first-character-of-line');
      }
    };

    MoveToMark.prototype.select = function(count, _arg) {
      var currentPosition, markPosition, requireEOL, selectionRange;
      if (count == null) {
        count = 1;
      }
      requireEOL = (_arg != null ? _arg : {}).requireEOL;
      markPosition = this.vimState.getMark(this.input.characters);
      if (markPosition == null) {
        return [false];
      }
      currentPosition = this.editor.getCursorBufferPosition();
      selectionRange = null;
      if (currentPosition.isGreaterThan(markPosition)) {
        if (this.linewise) {
          currentPosition = this.editor.clipBufferPosition([currentPosition.row, Infinity]);
          markPosition = new Point(markPosition.row, 0);
        }
        selectionRange = new Range(markPosition, currentPosition);
      } else {
        if (this.linewise) {
          markPosition = this.editor.clipBufferPosition([markPosition.row, Infinity]);
          currentPosition = new Point(currentPosition.row, 0);
        }
        selectionRange = new Range(currentPosition, markPosition);
      }
      this.editor.setSelectedBufferRange(selectionRange, {
        requireEOL: requireEOL
      });
      return [true];
    };

    return MoveToMark;

  })(MotionWithInput);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxrQkFBbUIsT0FBQSxDQUFRLG1CQUFSLEVBQW5CLGVBQUQsQ0FBQTs7QUFBQSxFQUNDLFlBQWEsT0FBQSxDQUFRLDJCQUFSLEVBQWIsU0FERCxDQUFBOztBQUFBLEVBRUEsT0FBaUIsT0FBQSxDQUFRLE1BQVIsQ0FBakIsRUFBQyxhQUFBLEtBQUQsRUFBUSxhQUFBLEtBRlIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixpQ0FBQSxDQUFBOztBQUFhLElBQUEsb0JBQUUsVUFBRixFQUFlLFFBQWYsRUFBMEIsUUFBMUIsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLGFBQUEsVUFDYixDQUFBO0FBQUEsTUFEeUIsSUFBQyxDQUFBLFdBQUEsUUFDMUIsQ0FBQTtBQUFBLE1BRG9DLElBQUMsQ0FBQSw4QkFBQSxXQUFTLElBQzlDLENBQUE7QUFBQSxNQUFBLDRDQUFNLElBQUMsQ0FBQSxVQUFQLEVBQW1CLElBQUMsQ0FBQSxRQUFwQixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxTQUFELEdBQWlCLElBQUEsU0FBQSxDQUFVLElBQVYsRUFBYTtBQUFBLFFBQUEsT0FBQSxFQUFPLGNBQVA7QUFBQSxRQUF1QixVQUFBLEVBQVksSUFBbkM7QUFBQSxRQUF5QyxNQUFBLEVBQVEsSUFBakQ7T0FBYixDQURqQixDQURXO0lBQUEsQ0FBYjs7QUFBQSx5QkFJQSxVQUFBLEdBQVksU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLFNBQUo7SUFBQSxDQUpaLENBQUE7O0FBQUEseUJBTUEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLFVBQUEsWUFBQTtBQUFBLE1BQUEsWUFBQSxHQUFlLElBQUMsQ0FBQSxRQUFRLENBQUMsT0FBVixDQUFrQixJQUFDLENBQUEsS0FBSyxDQUFDLFVBQXpCLENBQWYsQ0FBQTtBQUNBLE1BQUEsSUFBaUQsb0JBQWpEO0FBQUEsUUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQWdDLFlBQWhDLENBQUEsQ0FBQTtPQURBO0FBRUEsTUFBQSxJQUFHLElBQUMsQ0FBQSxRQUFKO2VBQ0UsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQW9CLDBDQUFwQixFQURGO09BSE87SUFBQSxDQU5ULENBQUE7O0FBQUEseUJBWUEsTUFBQSxHQUFRLFNBQUMsS0FBRCxFQUFVLElBQVYsR0FBQTtBQUNOLFVBQUEseURBQUE7O1FBRE8sUUFBTTtPQUNiO0FBQUEsTUFEaUIsNkJBQUQsT0FBYSxJQUFaLFVBQ2pCLENBQUE7QUFBQSxNQUFBLFlBQUEsR0FBZSxJQUFDLENBQUEsUUFBUSxDQUFDLE9BQVYsQ0FBa0IsSUFBQyxDQUFBLEtBQUssQ0FBQyxVQUF6QixDQUFmLENBQUE7QUFDQSxNQUFBLElBQXNCLG9CQUF0QjtBQUFBLGVBQU8sQ0FBQyxLQUFELENBQVAsQ0FBQTtPQURBO0FBQUEsTUFFQSxlQUFBLEdBQWtCLElBQUMsQ0FBQSxNQUFNLENBQUMsdUJBQVIsQ0FBQSxDQUZsQixDQUFBO0FBQUEsTUFHQSxjQUFBLEdBQWlCLElBSGpCLENBQUE7QUFJQSxNQUFBLElBQUcsZUFBZSxDQUFDLGFBQWhCLENBQThCLFlBQTlCLENBQUg7QUFDRSxRQUFBLElBQUcsSUFBQyxDQUFBLFFBQUo7QUFDRSxVQUFBLGVBQUEsR0FBa0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxrQkFBUixDQUEyQixDQUFDLGVBQWUsQ0FBQyxHQUFqQixFQUFzQixRQUF0QixDQUEzQixDQUFsQixDQUFBO0FBQUEsVUFDQSxZQUFBLEdBQW1CLElBQUEsS0FBQSxDQUFNLFlBQVksQ0FBQyxHQUFuQixFQUF3QixDQUF4QixDQURuQixDQURGO1NBQUE7QUFBQSxRQUdBLGNBQUEsR0FBcUIsSUFBQSxLQUFBLENBQU0sWUFBTixFQUFvQixlQUFwQixDQUhyQixDQURGO09BQUEsTUFBQTtBQU1FLFFBQUEsSUFBRyxJQUFDLENBQUEsUUFBSjtBQUNFLFVBQUEsWUFBQSxHQUFlLElBQUMsQ0FBQSxNQUFNLENBQUMsa0JBQVIsQ0FBMkIsQ0FBQyxZQUFZLENBQUMsR0FBZCxFQUFtQixRQUFuQixDQUEzQixDQUFmLENBQUE7QUFBQSxVQUNBLGVBQUEsR0FBc0IsSUFBQSxLQUFBLENBQU0sZUFBZSxDQUFDLEdBQXRCLEVBQTJCLENBQTNCLENBRHRCLENBREY7U0FBQTtBQUFBLFFBR0EsY0FBQSxHQUFxQixJQUFBLEtBQUEsQ0FBTSxlQUFOLEVBQXVCLFlBQXZCLENBSHJCLENBTkY7T0FKQTtBQUFBLE1BY0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxzQkFBUixDQUErQixjQUEvQixFQUErQztBQUFBLFFBQUEsVUFBQSxFQUFZLFVBQVo7T0FBL0MsQ0FkQSxDQUFBO2FBZUEsQ0FBQyxJQUFELEVBaEJNO0lBQUEsQ0FaUixDQUFBOztzQkFBQTs7S0FEdUIsZ0JBTHpCLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/mark/.atom/packages/vim-mode/lib/motions/move-to-mark-motion.coffee
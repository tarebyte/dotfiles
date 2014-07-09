(function() {
  var OperatorWithInput, Range, Replace, ViewModel, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  OperatorWithInput = require('./general-operators').OperatorWithInput;

  ViewModel = require('../view-models/view-model').ViewModel;

  Range = require('atom').Range;

  module.exports = Replace = (function(_super) {
    __extends(Replace, _super);

    function Replace(editorView, vimState, _arg) {
      this.editorView = editorView;
      this.vimState = vimState;
      this.selectOptions = (_arg != null ? _arg : {}).selectOptions;
      Replace.__super__.constructor.call(this, this.editorView, this.vimState);
      this.viewModel = new ViewModel(this, {
        "class": 'replace',
        hidden: true,
        singleChar: true
      });
    }

    Replace.prototype.execute = function(count) {
      var currentRowLength, pos;
      if (count == null) {
        count = 1;
      }
      pos = this.editor.getCursorBufferPosition();
      currentRowLength = this.editor.lineLengthForBufferRow(pos.row);
      if (!(currentRowLength > 0)) {
        return;
      }
      if (!(currentRowLength - pos.column >= count)) {
        return;
      }
      this.undoTransaction((function(_this) {
        return function() {
          var start;
          start = _this.editor.getCursorBufferPosition();
          _.times(count, function() {
            var point;
            point = _this.editor.getCursorBufferPosition();
            _this.editor.setTextInBufferRange(Range.fromPointWithDelta(point, 0, 1), _this.input.characters);
            return _this.editor.moveCursorRight();
          });
          return _this.editor.setCursorBufferPosition(start);
        };
      })(this));
      return this.vimState.activateCommandMode();
    };

    return Replace;

  })(OperatorWithInput);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNDLG9CQUFxQixPQUFBLENBQVEscUJBQVIsRUFBckIsaUJBREQsQ0FBQTs7QUFBQSxFQUVDLFlBQWEsT0FBQSxDQUFRLDJCQUFSLEVBQWIsU0FGRCxDQUFBOztBQUFBLEVBR0MsUUFBUyxPQUFBLENBQVEsTUFBUixFQUFULEtBSEQsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiw4QkFBQSxDQUFBOztBQUFhLElBQUEsaUJBQUUsVUFBRixFQUFlLFFBQWYsRUFBeUIsSUFBekIsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLGFBQUEsVUFDYixDQUFBO0FBQUEsTUFEeUIsSUFBQyxDQUFBLFdBQUEsUUFDMUIsQ0FBQTtBQUFBLE1BRHFDLElBQUMsQ0FBQSxnQ0FBRixPQUFpQixJQUFmLGFBQ3RDLENBQUE7QUFBQSxNQUFBLHlDQUFNLElBQUMsQ0FBQSxVQUFQLEVBQW1CLElBQUMsQ0FBQSxRQUFwQixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxTQUFELEdBQWlCLElBQUEsU0FBQSxDQUFVLElBQVYsRUFBYTtBQUFBLFFBQUEsT0FBQSxFQUFPLFNBQVA7QUFBQSxRQUFrQixNQUFBLEVBQVEsSUFBMUI7QUFBQSxRQUFnQyxVQUFBLEVBQVksSUFBNUM7T0FBYixDQURqQixDQURXO0lBQUEsQ0FBYjs7QUFBQSxzQkFJQSxPQUFBLEdBQVMsU0FBQyxLQUFELEdBQUE7QUFDUCxVQUFBLHFCQUFBOztRQURRLFFBQU07T0FDZDtBQUFBLE1BQUEsR0FBQSxHQUFNLElBQUMsQ0FBQSxNQUFNLENBQUMsdUJBQVIsQ0FBQSxDQUFOLENBQUE7QUFBQSxNQUNBLGdCQUFBLEdBQW1CLElBQUMsQ0FBQSxNQUFNLENBQUMsc0JBQVIsQ0FBK0IsR0FBRyxDQUFDLEdBQW5DLENBRG5CLENBQUE7QUFJQSxNQUFBLElBQUEsQ0FBQSxDQUFjLGdCQUFBLEdBQW1CLENBQWpDLENBQUE7QUFBQSxjQUFBLENBQUE7T0FKQTtBQU1BLE1BQUEsSUFBQSxDQUFBLENBQWMsZ0JBQUEsR0FBbUIsR0FBRyxDQUFDLE1BQXZCLElBQWlDLEtBQS9DLENBQUE7QUFBQSxjQUFBLENBQUE7T0FOQTtBQUFBLE1BUUEsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNmLGNBQUEsS0FBQTtBQUFBLFVBQUEsS0FBQSxHQUFRLEtBQUMsQ0FBQSxNQUFNLENBQUMsdUJBQVIsQ0FBQSxDQUFSLENBQUE7QUFBQSxVQUNBLENBQUMsQ0FBQyxLQUFGLENBQVEsS0FBUixFQUFlLFNBQUEsR0FBQTtBQUNiLGdCQUFBLEtBQUE7QUFBQSxZQUFBLEtBQUEsR0FBUSxLQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQUEsQ0FBUixDQUFBO0FBQUEsWUFDQSxLQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQTZCLEtBQUssQ0FBQyxrQkFBTixDQUF5QixLQUF6QixFQUFnQyxDQUFoQyxFQUFtQyxDQUFuQyxDQUE3QixFQUFvRSxLQUFDLENBQUEsS0FBSyxDQUFDLFVBQTNFLENBREEsQ0FBQTttQkFFQSxLQUFDLENBQUEsTUFBTSxDQUFDLGVBQVIsQ0FBQSxFQUhhO1VBQUEsQ0FBZixDQURBLENBQUE7aUJBS0EsS0FBQyxDQUFBLE1BQU0sQ0FBQyx1QkFBUixDQUFnQyxLQUFoQyxFQU5lO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakIsQ0FSQSxDQUFBO2FBZ0JBLElBQUMsQ0FBQSxRQUFRLENBQUMsbUJBQVYsQ0FBQSxFQWpCTztJQUFBLENBSlQsQ0FBQTs7bUJBQUE7O0tBRG9CLGtCQU50QixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/mark/.atom/packages/vim-mode/lib/operators/replace-operator.coffee
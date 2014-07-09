(function() {
  var Autoindent, Indent, Operator, Outdent,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Operator = require('./general-operators').Operator;

  Indent = (function(_super) {
    __extends(Indent, _super);

    function Indent() {
      return Indent.__super__.constructor.apply(this, arguments);
    }

    Indent.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      this.indent(count);
      return this.vimState.activateCommandMode();
    };

    Indent.prototype.indent = function(count, direction) {
      var row;
      if (direction == null) {
        direction = 'indent';
      }
      row = this.editor.getCursorScreenRow();
      this.motion.select(count);
      if (direction === 'indent') {
        this.editor.indentSelectedRows();
      } else if (direction === 'outdent') {
        this.editor.outdentSelectedRows();
      } else if (direction === 'auto') {
        this.editor.autoIndentSelectedRows();
      }
      this.editor.setCursorScreenPosition([row, 0]);
      return this.editor.moveCursorToFirstCharacterOfLine();
    };

    return Indent;

  })(Operator);

  Outdent = (function(_super) {
    __extends(Outdent, _super);

    function Outdent() {
      return Outdent.__super__.constructor.apply(this, arguments);
    }

    Outdent.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      this.indent(count, 'outdent');
      return this.vimState.activateCommandMode();
    };

    return Outdent;

  })(Indent);

  Autoindent = (function(_super) {
    __extends(Autoindent, _super);

    function Autoindent() {
      return Autoindent.__super__.constructor.apply(this, arguments);
    }

    Autoindent.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      this.indent(count, 'auto');
      return this.vimState.activateCommandMode();
    };

    return Autoindent;

  })(Indent);

  module.exports = {
    Indent: Indent,
    Outdent: Outdent,
    Autoindent: Autoindent
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxXQUFZLE9BQUEsQ0FBUSxxQkFBUixFQUFaLFFBQUQsQ0FBQTs7QUFBQSxFQUlNO0FBTUosNkJBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHFCQUFBLE9BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTs7UUFBQyxRQUFNO09BQ2Q7QUFBQSxNQUFBLElBQUMsQ0FBQSxNQUFELENBQVEsS0FBUixDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsUUFBUSxDQUFDLG1CQUFWLENBQUEsRUFGTztJQUFBLENBQVQsQ0FBQTs7QUFBQSxxQkFVQSxNQUFBLEdBQVEsU0FBQyxLQUFELEVBQVEsU0FBUixHQUFBO0FBQ04sVUFBQSxHQUFBOztRQURjLFlBQVU7T0FDeEI7QUFBQSxNQUFBLEdBQUEsR0FBTSxJQUFDLENBQUEsTUFBTSxDQUFDLGtCQUFSLENBQUEsQ0FBTixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsQ0FBZSxLQUFmLENBRkEsQ0FBQTtBQUdBLE1BQUEsSUFBRyxTQUFBLEtBQWEsUUFBaEI7QUFDRSxRQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsa0JBQVIsQ0FBQSxDQUFBLENBREY7T0FBQSxNQUVLLElBQUcsU0FBQSxLQUFhLFNBQWhCO0FBQ0gsUUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLG1CQUFSLENBQUEsQ0FBQSxDQURHO09BQUEsTUFFQSxJQUFHLFNBQUEsS0FBYSxNQUFoQjtBQUNILFFBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxzQkFBUixDQUFBLENBQUEsQ0FERztPQVBMO0FBQUEsTUFVQSxJQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQWdDLENBQUMsR0FBRCxFQUFNLENBQU4sQ0FBaEMsQ0FWQSxDQUFBO2FBV0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxnQ0FBUixDQUFBLEVBWk07SUFBQSxDQVZSLENBQUE7O2tCQUFBOztLQU5tQixTQUpyQixDQUFBOztBQUFBLEVBcUNNO0FBTUosOEJBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHNCQUFBLE9BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTs7UUFBQyxRQUFNO09BQ2Q7QUFBQSxNQUFBLElBQUMsQ0FBQSxNQUFELENBQVEsS0FBUixFQUFlLFNBQWYsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxtQkFBVixDQUFBLEVBRk87SUFBQSxDQUFULENBQUE7O21CQUFBOztLQU5vQixPQXJDdEIsQ0FBQTs7QUFBQSxFQWtETTtBQU1KLGlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx5QkFBQSxPQUFBLEdBQVMsU0FBQyxLQUFELEdBQUE7O1FBQUMsUUFBTTtPQUNkO0FBQUEsTUFBQSxJQUFDLENBQUEsTUFBRCxDQUFRLEtBQVIsRUFBZSxNQUFmLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxRQUFRLENBQUMsbUJBQVYsQ0FBQSxFQUZPO0lBQUEsQ0FBVCxDQUFBOztzQkFBQTs7S0FOdUIsT0FsRHpCLENBQUE7O0FBQUEsRUE0REEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUFBQSxJQUFDLFFBQUEsTUFBRDtBQUFBLElBQVMsU0FBQSxPQUFUO0FBQUEsSUFBa0IsWUFBQSxVQUFsQjtHQTVEakIsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/mark/.atom/packages/vim-mode/lib/operators/indent-operators.coffee
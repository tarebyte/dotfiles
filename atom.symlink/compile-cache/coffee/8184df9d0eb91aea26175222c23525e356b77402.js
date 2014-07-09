(function() {
  var Operator, Put, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  Operator = require('./general-operators').Operator;

  module.exports = Put = (function(_super) {
    __extends(Put, _super);

    Put.prototype.register = '"';

    function Put(editor, vimState, _arg) {
      var _ref;
      this.editor = editor;
      this.vimState = vimState;
      _ref = _arg != null ? _arg : {}, this.location = _ref.location, this.selectOptions = _ref.selectOptions;
      if (this.location == null) {
        this.location = 'after';
      }
      this.complete = true;
    }

    Put.prototype.execute = function(count) {
      var originalPosition, text, textToInsert, type, _ref;
      if (count == null) {
        count = 1;
      }
      _ref = this.vimState.getRegister(this.register) || {}, text = _ref.text, type = _ref.type;
      if (!text) {
        return;
      }
      textToInsert = _.times(count, function() {
        return text;
      }).join('');
      if (type === 'linewise') {
        textToInsert = textToInsert.replace(/\n$/, '');
        if (this.location === 'after' && this.onLastRow()) {
          textToInsert = "\n" + textToInsert;
        } else {
          textToInsert = "" + textToInsert + "\n";
        }
      }
      if (this.location === 'after') {
        if (type === 'linewise') {
          if (this.onLastRow()) {
            this.editor.moveCursorToEndOfLine();
            originalPosition = this.editor.getCursorScreenPosition();
            originalPosition.row += 1;
          } else {
            this.editor.moveCursorDown();
          }
        } else {
          if (!this.onLastColumn()) {
            this.editor.moveCursorRight();
          }
        }
      }
      if (type === 'linewise' && (originalPosition == null)) {
        this.editor.moveCursorToBeginningOfLine();
        originalPosition = this.editor.getCursorScreenPosition();
      }
      this.editor.insertText(textToInsert);
      if (originalPosition != null) {
        this.editor.setCursorScreenPosition(originalPosition);
        this.editor.moveCursorToFirstCharacterOfLine();
      }
      return this.vimState.activateCommandMode();
    };

    Put.prototype.onLastRow = function() {
      var column, row, _ref;
      _ref = this.editor.getCursorBufferPosition(), row = _ref.row, column = _ref.column;
      return row === this.editor.getBuffer().getLastRow();
    };

    Put.prototype.onLastColumn = function() {
      return this.editor.getCursor().isAtEndOfLine();
    };

    return Put;

  })(Operator);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNDLFdBQVksT0FBQSxDQUFRLHFCQUFSLEVBQVosUUFERCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FJTTtBQUNKLDBCQUFBLENBQUE7O0FBQUEsa0JBQUEsUUFBQSxHQUFVLEdBQVYsQ0FBQTs7QUFFYSxJQUFBLGFBQUUsTUFBRixFQUFXLFFBQVgsRUFBcUIsSUFBckIsR0FBQTtBQUNYLFVBQUEsSUFBQTtBQUFBLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFEcUIsSUFBQyxDQUFBLFdBQUEsUUFDdEIsQ0FBQTtBQUFBLDRCQURnQyxPQUE0QixJQUEzQixJQUFDLENBQUEsZ0JBQUEsVUFBVSxJQUFDLENBQUEscUJBQUEsYUFDN0MsQ0FBQTs7UUFBQSxJQUFDLENBQUEsV0FBWTtPQUFiO0FBQUEsTUFDQSxJQUFDLENBQUEsUUFBRCxHQUFZLElBRFosQ0FEVztJQUFBLENBRmI7O0FBQUEsa0JBV0EsT0FBQSxHQUFTLFNBQUMsS0FBRCxHQUFBO0FBQ1AsVUFBQSxnREFBQTs7UUFEUSxRQUFNO09BQ2Q7QUFBQSxNQUFBLE9BQWUsSUFBQyxDQUFBLFFBQVEsQ0FBQyxXQUFWLENBQXNCLElBQUMsQ0FBQSxRQUF2QixDQUFBLElBQW9DLEVBQW5ELEVBQUMsWUFBQSxJQUFELEVBQU8sWUFBQSxJQUFQLENBQUE7QUFDQSxNQUFBLElBQUEsQ0FBQSxJQUFBO0FBQUEsY0FBQSxDQUFBO09BREE7QUFBQSxNQUdBLFlBQUEsR0FBZSxDQUFDLENBQUMsS0FBRixDQUFRLEtBQVIsRUFBZSxTQUFBLEdBQUE7ZUFBRyxLQUFIO01BQUEsQ0FBZixDQUF1QixDQUFDLElBQXhCLENBQTZCLEVBQTdCLENBSGYsQ0FBQTtBQU1BLE1BQUEsSUFBRyxJQUFBLEtBQVEsVUFBWDtBQUNFLFFBQUEsWUFBQSxHQUFlLFlBQVksQ0FBQyxPQUFiLENBQXFCLEtBQXJCLEVBQTRCLEVBQTVCLENBQWYsQ0FBQTtBQUNBLFFBQUEsSUFBRyxJQUFDLENBQUEsUUFBRCxLQUFhLE9BQWIsSUFBeUIsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUE1QjtBQUNFLFVBQUEsWUFBQSxHQUFnQixJQUFBLEdBQUcsWUFBbkIsQ0FERjtTQUFBLE1BQUE7QUFHRSxVQUFBLFlBQUEsR0FBZSxFQUFBLEdBQUUsWUFBRixHQUFnQixJQUEvQixDQUhGO1NBRkY7T0FOQTtBQWFBLE1BQUEsSUFBRyxJQUFDLENBQUEsUUFBRCxLQUFhLE9BQWhCO0FBQ0UsUUFBQSxJQUFHLElBQUEsS0FBUSxVQUFYO0FBQ0UsVUFBQSxJQUFHLElBQUMsQ0FBQSxTQUFELENBQUEsQ0FBSDtBQUNFLFlBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxxQkFBUixDQUFBLENBQUEsQ0FBQTtBQUFBLFlBRUEsZ0JBQUEsR0FBbUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyx1QkFBUixDQUFBLENBRm5CLENBQUE7QUFBQSxZQUdBLGdCQUFnQixDQUFDLEdBQWpCLElBQXdCLENBSHhCLENBREY7V0FBQSxNQUFBO0FBTUUsWUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLGNBQVIsQ0FBQSxDQUFBLENBTkY7V0FERjtTQUFBLE1BQUE7QUFTRSxVQUFBLElBQUEsQ0FBQSxJQUFRLENBQUEsWUFBRCxDQUFBLENBQVA7QUFDRSxZQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsZUFBUixDQUFBLENBQUEsQ0FERjtXQVRGO1NBREY7T0FiQTtBQTBCQSxNQUFBLElBQUcsSUFBQSxLQUFRLFVBQVIsSUFBd0IsMEJBQTNCO0FBQ0UsUUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLDJCQUFSLENBQUEsQ0FBQSxDQUFBO0FBQUEsUUFDQSxnQkFBQSxHQUFtQixJQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQUEsQ0FEbkIsQ0FERjtPQTFCQTtBQUFBLE1BOEJBLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFtQixZQUFuQixDQTlCQSxDQUFBO0FBZ0NBLE1BQUEsSUFBRyx3QkFBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyx1QkFBUixDQUFnQyxnQkFBaEMsQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLGdDQUFSLENBQUEsQ0FEQSxDQURGO09BaENBO2FBb0NBLElBQUMsQ0FBQSxRQUFRLENBQUMsbUJBQVYsQ0FBQSxFQXJDTztJQUFBLENBWFQsQ0FBQTs7QUFBQSxrQkFxREEsU0FBQSxHQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsaUJBQUE7QUFBQSxNQUFBLE9BQWdCLElBQUMsQ0FBQSxNQUFNLENBQUMsdUJBQVIsQ0FBQSxDQUFoQixFQUFDLFdBQUEsR0FBRCxFQUFNLGNBQUEsTUFBTixDQUFBO2FBQ0EsR0FBQSxLQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUixDQUFBLENBQW1CLENBQUMsVUFBcEIsQ0FBQSxFQUZFO0lBQUEsQ0FyRFgsQ0FBQTs7QUFBQSxrQkF5REEsWUFBQSxHQUFjLFNBQUEsR0FBQTthQUNaLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUixDQUFBLENBQW1CLENBQUMsYUFBcEIsQ0FBQSxFQURZO0lBQUEsQ0F6RGQsQ0FBQTs7ZUFBQTs7S0FEZ0IsU0FQbEIsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/mark/.atom/packages/vim-mode/lib/operators/put-operator.coffee
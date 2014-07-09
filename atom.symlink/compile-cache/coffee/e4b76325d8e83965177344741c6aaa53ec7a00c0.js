(function() {
  var SelectInsideWord, TextObject,
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

  module.exports = {
    TextObject: TextObject,
    SelectInsideWord: SelectInsideWord
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBTTtBQUNTLElBQUEsb0JBQUUsTUFBRixFQUFXLEtBQVgsR0FBQTtBQUFtQixNQUFsQixJQUFDLENBQUEsU0FBQSxNQUFpQixDQUFBO0FBQUEsTUFBVCxJQUFDLENBQUEsUUFBQSxLQUFRLENBQW5CO0lBQUEsQ0FBYjs7QUFBQSx5QkFFQSxVQUFBLEdBQVksU0FBQSxHQUFBO2FBQUcsS0FBSDtJQUFBLENBRlosQ0FBQTs7QUFBQSx5QkFHQSxZQUFBLEdBQWMsU0FBQSxHQUFBO2FBQUcsTUFBSDtJQUFBLENBSGQsQ0FBQTs7c0JBQUE7O01BREYsQ0FBQTs7QUFBQSxFQU1NO0FBQ0osdUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLCtCQUFBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixNQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFBLENBQUEsQ0FBQTthQUNBLENBQUMsSUFBRCxFQUZNO0lBQUEsQ0FBUixDQUFBOzs0QkFBQTs7S0FENkIsV0FOL0IsQ0FBQTs7QUFBQSxFQVdBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBQUEsSUFBQyxZQUFBLFVBQUQ7QUFBQSxJQUFhLGtCQUFBLGdCQUFiO0dBWGpCLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/mark/.atom/packages/vim-mode/lib/text-objects.coffee
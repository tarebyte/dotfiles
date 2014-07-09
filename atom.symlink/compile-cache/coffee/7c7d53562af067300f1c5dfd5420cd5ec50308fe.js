(function() {
  var Prefix, Register, Repeat,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Prefix = (function() {
    function Prefix() {}

    Prefix.prototype.complete = null;

    Prefix.prototype.composedObject = null;

    Prefix.prototype.isComplete = function() {
      return this.complete;
    };

    Prefix.prototype.isRecordable = function() {
      return this.composedObject.isRecordable();
    };

    Prefix.prototype.compose = function(composedObject) {
      this.composedObject = composedObject;
      return this.complete = true;
    };

    Prefix.prototype.execute = function() {
      var _base;
      return typeof (_base = this.composedObject).execute === "function" ? _base.execute(this.count) : void 0;
    };

    Prefix.prototype.select = function() {
      var _base;
      return typeof (_base = this.composedObject).select === "function" ? _base.select(this.count) : void 0;
    };

    return Prefix;

  })();

  Repeat = (function(_super) {
    __extends(Repeat, _super);

    Repeat.prototype.count = null;

    function Repeat(count) {
      this.count = count;
      this.complete = false;
    }

    Repeat.prototype.addDigit = function(digit) {
      return this.count = this.count * 10 + digit;
    };

    return Repeat;

  })(Prefix);

  Register = (function(_super) {
    __extends(Register, _super);

    Register.prototype.name = null;

    function Register(name) {
      this.name = name;
      this.complete = false;
    }

    Register.prototype.compose = function(composedObject) {
      Register.__super__.compose.call(this, composedObject);
      if (composedObject.register != null) {
        return composedObject.register = this.name;
      }
    };

    return Register;

  })(Prefix);

  module.exports = {
    Repeat: Repeat,
    Register: Register
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBTTt3QkFDSjs7QUFBQSxxQkFBQSxRQUFBLEdBQVUsSUFBVixDQUFBOztBQUFBLHFCQUNBLGNBQUEsR0FBZ0IsSUFEaEIsQ0FBQTs7QUFBQSxxQkFHQSxVQUFBLEdBQVksU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLFNBQUo7SUFBQSxDQUhaLENBQUE7O0FBQUEscUJBS0EsWUFBQSxHQUFjLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxjQUFjLENBQUMsWUFBaEIsQ0FBQSxFQUFIO0lBQUEsQ0FMZCxDQUFBOztBQUFBLHFCQVlBLE9BQUEsR0FBUyxTQUFFLGNBQUYsR0FBQTtBQUNQLE1BRFEsSUFBQyxDQUFBLGlCQUFBLGNBQ1QsQ0FBQTthQUFBLElBQUMsQ0FBQSxRQUFELEdBQVksS0FETDtJQUFBLENBWlQsQ0FBQTs7QUFBQSxxQkFrQkEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLFVBQUEsS0FBQTtnRkFBZSxDQUFDLFFBQVMsSUFBQyxDQUFBLGdCQURuQjtJQUFBLENBbEJULENBQUE7O0FBQUEscUJBd0JBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixVQUFBLEtBQUE7K0VBQWUsQ0FBQyxPQUFRLElBQUMsQ0FBQSxnQkFEbkI7SUFBQSxDQXhCUixDQUFBOztrQkFBQTs7TUFERixDQUFBOztBQUFBLEVBZ0NNO0FBQ0osNkJBQUEsQ0FBQTs7QUFBQSxxQkFBQSxLQUFBLEdBQU8sSUFBUCxDQUFBOztBQUdhLElBQUEsZ0JBQUUsS0FBRixHQUFBO0FBQVksTUFBWCxJQUFDLENBQUEsUUFBQSxLQUFVLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxRQUFELEdBQVksS0FBWixDQUFaO0lBQUEsQ0FIYjs7QUFBQSxxQkFVQSxRQUFBLEdBQVUsU0FBQyxLQUFELEdBQUE7YUFDUixJQUFDLENBQUEsS0FBRCxHQUFTLElBQUMsQ0FBQSxLQUFELEdBQVMsRUFBVCxHQUFjLE1BRGY7SUFBQSxDQVZWLENBQUE7O2tCQUFBOztLQURtQixPQWhDckIsQ0FBQTs7QUFBQSxFQWlETTtBQUNKLCtCQUFBLENBQUE7O0FBQUEsdUJBQUEsSUFBQSxHQUFNLElBQU4sQ0FBQTs7QUFHYSxJQUFBLGtCQUFFLElBQUYsR0FBQTtBQUFXLE1BQVYsSUFBQyxDQUFBLE9BQUEsSUFBUyxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLEtBQVosQ0FBWDtJQUFBLENBSGI7O0FBQUEsdUJBVUEsT0FBQSxHQUFTLFNBQUMsY0FBRCxHQUFBO0FBQ1AsTUFBQSxzQ0FBTSxjQUFOLENBQUEsQ0FBQTtBQUNBLE1BQUEsSUFBbUMsK0JBQW5DO2VBQUEsY0FBYyxDQUFDLFFBQWYsR0FBMEIsSUFBQyxDQUFBLEtBQTNCO09BRk87SUFBQSxDQVZULENBQUE7O29CQUFBOztLQURxQixPQWpEdkIsQ0FBQTs7QUFBQSxFQWdFQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtBQUFBLElBQUUsUUFBQSxNQUFGO0FBQUEsSUFBVSxVQUFBLFFBQVY7R0FoRWpCLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/mark/.atom/packages/vim-mode/lib/prefixes.coffee
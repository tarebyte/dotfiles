(function() {
  var IndentOperators, Operators, Put, Replace, _;

  _ = require('underscore-plus');

  IndentOperators = require('./indent-operators');

  Put = require('./put-operator');

  Replace = require('./replace-operator');

  Operators = require('./general-operators');

  Operators.Put = Put;

  Operators.Replace = Replace;

  _.extend(Operators, IndentOperators);

  module.exports = Operators;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJDQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxvQkFBUixDQURsQixDQUFBOztBQUFBLEVBRUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxnQkFBUixDQUZOLENBQUE7O0FBQUEsRUFHQSxPQUFBLEdBQVUsT0FBQSxDQUFRLG9CQUFSLENBSFYsQ0FBQTs7QUFBQSxFQUlBLFNBQUEsR0FBWSxPQUFBLENBQVEscUJBQVIsQ0FKWixDQUFBOztBQUFBLEVBTUEsU0FBUyxDQUFDLEdBQVYsR0FBZ0IsR0FOaEIsQ0FBQTs7QUFBQSxFQU9BLFNBQVMsQ0FBQyxPQUFWLEdBQW9CLE9BUHBCLENBQUE7O0FBQUEsRUFRQSxDQUFDLENBQUMsTUFBRixDQUFTLFNBQVQsRUFBb0IsZUFBcEIsQ0FSQSxDQUFBOztBQUFBLEVBVUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FWakIsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/mark/.atom/packages/vim-mode/lib/operators/index.coffee
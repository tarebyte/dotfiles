(function() {
  var IndentOperators, InputOperators, Operators, Put, Replace, _;

  _ = require('underscore-plus');

  IndentOperators = require('./indent-operators');

  Put = require('./put-operator');

  InputOperators = require('./input');

  Replace = require('./replace-operator');

  Operators = require('./general-operators');

  Operators.Put = Put;

  Operators.Replace = Replace;

  _.extend(Operators, IndentOperators);

  _.extend(Operators, InputOperators);

  module.exports = Operators;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJEQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxvQkFBUixDQURsQixDQUFBOztBQUFBLEVBRUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxnQkFBUixDQUZOLENBQUE7O0FBQUEsRUFHQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxTQUFSLENBSGpCLENBQUE7O0FBQUEsRUFJQSxPQUFBLEdBQVUsT0FBQSxDQUFRLG9CQUFSLENBSlYsQ0FBQTs7QUFBQSxFQUtBLFNBQUEsR0FBWSxPQUFBLENBQVEscUJBQVIsQ0FMWixDQUFBOztBQUFBLEVBT0EsU0FBUyxDQUFDLEdBQVYsR0FBZ0IsR0FQaEIsQ0FBQTs7QUFBQSxFQVFBLFNBQVMsQ0FBQyxPQUFWLEdBQW9CLE9BUnBCLENBQUE7O0FBQUEsRUFTQSxDQUFDLENBQUMsTUFBRixDQUFTLFNBQVQsRUFBb0IsZUFBcEIsQ0FUQSxDQUFBOztBQUFBLEVBVUEsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxTQUFULEVBQW9CLGNBQXBCLENBVkEsQ0FBQTs7QUFBQSxFQVdBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBWGpCLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/mark/.atom/packages/vim-mode/lib/operators/index.coffee
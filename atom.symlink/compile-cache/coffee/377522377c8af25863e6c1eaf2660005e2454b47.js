(function() {
  var Find, Motions, MoveToMark, Search, SearchCurrentWord, Till, _ref, _ref1;

  Motions = require('./general-motions');

  _ref = require('./search-motion'), Search = _ref.Search, SearchCurrentWord = _ref.SearchCurrentWord;

  MoveToMark = require('./move-to-mark-motion');

  _ref1 = require('./find-motion'), Find = _ref1.Find, Till = _ref1.Till;

  Motions.Search = Search;

  Motions.SearchCurrentWord = SearchCurrentWord;

  Motions.MoveToMark = MoveToMark;

  Motions.Find = Find;

  Motions.Till = Till;

  module.exports = Motions;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVFQUFBOztBQUFBLEVBQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxtQkFBUixDQUFWLENBQUE7O0FBQUEsRUFDQSxPQUE4QixPQUFBLENBQVEsaUJBQVIsQ0FBOUIsRUFBQyxjQUFBLE1BQUQsRUFBUyx5QkFBQSxpQkFEVCxDQUFBOztBQUFBLEVBRUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSx1QkFBUixDQUZiLENBQUE7O0FBQUEsRUFHQSxRQUFlLE9BQUEsQ0FBUSxlQUFSLENBQWYsRUFBQyxhQUFBLElBQUQsRUFBTyxhQUFBLElBSFAsQ0FBQTs7QUFBQSxFQUtBLE9BQU8sQ0FBQyxNQUFSLEdBQWlCLE1BTGpCLENBQUE7O0FBQUEsRUFNQSxPQUFPLENBQUMsaUJBQVIsR0FBNEIsaUJBTjVCLENBQUE7O0FBQUEsRUFPQSxPQUFPLENBQUMsVUFBUixHQUFxQixVQVByQixDQUFBOztBQUFBLEVBUUEsT0FBTyxDQUFDLElBQVIsR0FBZSxJQVJmLENBQUE7O0FBQUEsRUFTQSxPQUFPLENBQUMsSUFBUixHQUFlLElBVGYsQ0FBQTs7QUFBQSxFQVdBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE9BWGpCLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/mark/.atom/packages/vim-mode/lib/motions/index.coffee
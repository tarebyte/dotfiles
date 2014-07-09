(function() {
  var Suggestion;

  module.exports = Suggestion = (function() {
    function Suggestion(provider, options) {
      this.provider = provider;
      if (options.word != null) {
        this.word = options.word;
      }
      if (options.prefix != null) {
        this.prefix = options.prefix;
      }
      if (options.label != null) {
        this.label = options.label;
      }
      if (options.data != null) {
        this.data = options.data;
      }
      if (options.renderLabelAsHtml != null) {
        this.renderLabelAsHtml = options.renderLabelAsHtml;
      }
    }

    return Suggestion;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFVBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSxvQkFBRSxRQUFGLEVBQVksT0FBWixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsV0FBQSxRQUNiLENBQUE7QUFBQSxNQUFBLElBQXdCLG9CQUF4QjtBQUFBLFFBQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxPQUFPLENBQUMsSUFBaEIsQ0FBQTtPQUFBO0FBQ0EsTUFBQSxJQUE0QixzQkFBNUI7QUFBQSxRQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsT0FBTyxDQUFDLE1BQWxCLENBQUE7T0FEQTtBQUVBLE1BQUEsSUFBMEIscUJBQTFCO0FBQUEsUUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLE9BQU8sQ0FBQyxLQUFqQixDQUFBO09BRkE7QUFHQSxNQUFBLElBQXdCLG9CQUF4QjtBQUFBLFFBQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxPQUFPLENBQUMsSUFBaEIsQ0FBQTtPQUhBO0FBSUEsTUFBQSxJQUFrRCxpQ0FBbEQ7QUFBQSxRQUFBLElBQUMsQ0FBQSxpQkFBRCxHQUFxQixPQUFPLENBQUMsaUJBQTdCLENBQUE7T0FMVztJQUFBLENBQWI7O3NCQUFBOztNQUZGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/mark/.atom/packages/autocomplete-plus/lib/suggestion.coffee
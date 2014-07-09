(function() {
  var Provider;

  module.exports = Provider = (function() {
    Provider.prototype.wordRegex = /\b\w*[a-zA-Z_-]+\w*\b/g;

    function Provider(editorView) {
      this.editorView = editorView;
      this.editor = editorView.editor;
      this.initialize.apply(this, arguments);
    }

    Provider.prototype.initialize = function() {};

    Provider.prototype.exclusive = false;

    Provider.prototype.buildSuggestions = function() {
      throw new Error("Subclass must implement a buildWordList(prefix) method");
    };

    Provider.prototype.confirm = function(suggestion) {
      return true;
    };

    Provider.prototype.prefixOfSelection = function(selection) {
      var lineRange, prefix, selectionRange;
      selectionRange = selection.getBufferRange();
      lineRange = [[selectionRange.start.row, 0], [selectionRange.end.row, this.editor.lineLengthForBufferRow(selectionRange.end.row)]];
      prefix = "";
      this.editor.getBuffer().scanInRange(this.wordRegex, lineRange, function(_arg) {
        var match, prefixOffset, range, stop;
        match = _arg.match, range = _arg.range, stop = _arg.stop;
        if (range.start.isGreaterThan(selectionRange.end)) {
          stop();
        }
        if (range.intersectsWith(selectionRange)) {
          prefixOffset = selectionRange.start.column - range.start.column;
          if (range.start.isLessThan(selectionRange.start)) {
            return prefix = match[0].slice(0, prefixOffset);
          }
        }
      });
      return prefix;
    };

    return Provider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBR0E7QUFBQSxNQUFBLFFBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osdUJBQUEsU0FBQSxHQUFXLHdCQUFYLENBQUE7O0FBRWEsSUFBQSxrQkFBRSxVQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxhQUFBLFVBQ2IsQ0FBQTtBQUFBLE1BQUMsSUFBQyxDQUFBLFNBQVUsV0FBVixNQUFGLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxVQUFVLENBQUMsS0FBWixDQUFrQixJQUFsQixFQUF3QixTQUF4QixDQURBLENBRFc7SUFBQSxDQUZiOztBQUFBLHVCQU9BLFVBQUEsR0FBWSxTQUFBLEdBQUEsQ0FQWixDQUFBOztBQUFBLHVCQVlBLFNBQUEsR0FBVyxLQVpYLENBQUE7O0FBQUEsdUJBbUJBLGdCQUFBLEdBQWtCLFNBQUEsR0FBQTtBQUNoQixZQUFVLElBQUEsS0FBQSxDQUFNLHdEQUFOLENBQVYsQ0FEZ0I7SUFBQSxDQW5CbEIsQ0FBQTs7QUFBQSx1QkE2QkEsT0FBQSxHQUFTLFNBQUMsVUFBRCxHQUFBO0FBQ1AsYUFBTyxJQUFQLENBRE87SUFBQSxDQTdCVCxDQUFBOztBQUFBLHVCQXFDQSxpQkFBQSxHQUFtQixTQUFDLFNBQUQsR0FBQTtBQUNqQixVQUFBLGlDQUFBO0FBQUEsTUFBQSxjQUFBLEdBQWlCLFNBQVMsQ0FBQyxjQUFWLENBQUEsQ0FBakIsQ0FBQTtBQUFBLE1BQ0EsU0FBQSxHQUFZLENBQUMsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQXRCLEVBQTJCLENBQTNCLENBQUQsRUFBZ0MsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEdBQXBCLEVBQXlCLElBQUMsQ0FBQSxNQUFNLENBQUMsc0JBQVIsQ0FBK0IsY0FBYyxDQUFDLEdBQUcsQ0FBQyxHQUFsRCxDQUF6QixDQUFoQyxDQURaLENBQUE7QUFBQSxNQUVBLE1BQUEsR0FBUyxFQUZULENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUixDQUFBLENBQW1CLENBQUMsV0FBcEIsQ0FBZ0MsSUFBQyxDQUFBLFNBQWpDLEVBQTRDLFNBQTVDLEVBQXVELFNBQUMsSUFBRCxHQUFBO0FBQ3JELFlBQUEsZ0NBQUE7QUFBQSxRQUR1RCxhQUFBLE9BQU8sYUFBQSxPQUFPLFlBQUEsSUFDckUsQ0FBQTtBQUFBLFFBQUEsSUFBVSxLQUFLLENBQUMsS0FBSyxDQUFDLGFBQVosQ0FBMEIsY0FBYyxDQUFDLEdBQXpDLENBQVY7QUFBQSxVQUFBLElBQUEsQ0FBQSxDQUFBLENBQUE7U0FBQTtBQUVBLFFBQUEsSUFBRyxLQUFLLENBQUMsY0FBTixDQUFxQixjQUFyQixDQUFIO0FBQ0UsVUFBQSxZQUFBLEdBQWUsY0FBYyxDQUFDLEtBQUssQ0FBQyxNQUFyQixHQUE4QixLQUFLLENBQUMsS0FBSyxDQUFDLE1BQXpELENBQUE7QUFDQSxVQUFBLElBQXVDLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBWixDQUF1QixjQUFjLENBQUMsS0FBdEMsQ0FBdkM7bUJBQUEsTUFBQSxHQUFTLEtBQU0sQ0FBQSxDQUFBLENBQUcsd0JBQWxCO1dBRkY7U0FIcUQ7TUFBQSxDQUF2RCxDQUhBLENBQUE7QUFVQSxhQUFPLE1BQVAsQ0FYaUI7SUFBQSxDQXJDbkIsQ0FBQTs7b0JBQUE7O01BRkYsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/mark/.atom/packages/autocomplete-plus/lib/provider.coffee
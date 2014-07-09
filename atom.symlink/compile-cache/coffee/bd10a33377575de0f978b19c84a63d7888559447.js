(function() {
  var Html2hamlView;

  Html2hamlView = require('./html2haml-view');

  module.exports = {
    html2hamlView: null,
    activate: function(state) {
      this.html2hamlView = new Html2hamlView(state.html2hamlViewState);
      return atom.workspaceView.command("html2haml:convert", (function(_this) {
        return function() {
          return _this.convert();
        };
      })(this));
    },
    deactivate: function() {
      return this.html2hamlView.destroy();
    },
    serialize: function() {
      return {
        html2hamlViewState: this.html2hamlView.serialize()
      };
    },
    convert: function() {
      var callback, editor, encoding, html, http, options, post_data, request, selection;
      editor = atom.workspace.activePaneItem;
      selection = editor.getSelection();
      html = selection.getText();
      post_data = JSON.stringify({
        'page': {
          'html': html
        }
      });
      http = require("http");
      options = {
        host: "html2haml.heroku.com",
        path: "/api.json",
        method: "POST",
        headers: {
          "Content-Type": 'text/html;charset=utf-8',
          "Content-Length": post_data.length
        }
      };
      callback = function(response) {
        var str;
        str = "";
        response.on("data", function(chunk) {
          str += chunk;
        });
        response.on("end", function() {
          var result;
          result = JSON.parse(str);
          editor.insertText(result.page.haml);
        });
      };
      request = http.request(options, callback);
      request.end();
      return request.write(post_data, encoding = 'utf8');
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGFBQUE7O0FBQUEsRUFBQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxrQkFBUixDQUFoQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsYUFBQSxFQUFlLElBQWY7QUFBQSxJQUVBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBcUIsSUFBQSxhQUFBLENBQWMsS0FBSyxDQUFDLGtCQUFwQixDQUFyQixDQUFBO2FBQ0EsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQixtQkFBM0IsRUFBZ0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsT0FBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoRCxFQUZRO0lBQUEsQ0FGVjtBQUFBLElBTUEsVUFBQSxFQUFZLFNBQUEsR0FBQTthQUNWLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBLEVBRFU7SUFBQSxDQU5aO0FBQUEsSUFTQSxTQUFBLEVBQVcsU0FBQSxHQUFBO2FBQ1Q7QUFBQSxRQUFBLGtCQUFBLEVBQW9CLElBQUMsQ0FBQSxhQUFhLENBQUMsU0FBZixDQUFBLENBQXBCO1FBRFM7SUFBQSxDQVRYO0FBQUEsSUFZQSxPQUFBLEVBQVMsU0FBQSxHQUFBO0FBQ1AsVUFBQSw4RUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBeEIsQ0FBQTtBQUFBLE1BQ0EsU0FBQSxHQUFZLE1BQU0sQ0FBQyxZQUFQLENBQUEsQ0FEWixDQUFBO0FBQUEsTUFHQSxJQUFBLEdBQU8sU0FBUyxDQUFDLE9BQVYsQ0FBQSxDQUhQLENBQUE7QUFBQSxNQUlBLFNBQUEsR0FBWSxJQUFJLENBQUMsU0FBTCxDQUFlO0FBQUEsUUFBQyxNQUFBLEVBQVE7QUFBQSxVQUFDLE1BQUEsRUFBUSxJQUFUO1NBQVQ7T0FBZixDQUpaLENBQUE7QUFBQSxNQU9BLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQVBQLENBQUE7QUFBQSxNQVFBLE9BQUEsR0FDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLHNCQUFOO0FBQUEsUUFDQSxJQUFBLEVBQU0sV0FETjtBQUFBLFFBRUEsTUFBQSxFQUFRLE1BRlI7QUFBQSxRQUdBLE9BQUEsRUFDRTtBQUFBLFVBQUEsY0FBQSxFQUFnQix5QkFBaEI7QUFBQSxVQUNBLGdCQUFBLEVBQWtCLFNBQVMsQ0FBQyxNQUQ1QjtTQUpGO09BVEYsQ0FBQTtBQUFBLE1BZ0JBLFFBQUEsR0FBVyxTQUFDLFFBQUQsR0FBQTtBQUNULFlBQUEsR0FBQTtBQUFBLFFBQUEsR0FBQSxHQUFNLEVBQU4sQ0FBQTtBQUFBLFFBQ0EsUUFBUSxDQUFDLEVBQVQsQ0FBWSxNQUFaLEVBQW9CLFNBQUMsS0FBRCxHQUFBO0FBQ2xCLFVBQUEsR0FBQSxJQUFPLEtBQVAsQ0FEa0I7UUFBQSxDQUFwQixDQURBLENBQUE7QUFBQSxRQUtBLFFBQVEsQ0FBQyxFQUFULENBQVksS0FBWixFQUFtQixTQUFBLEdBQUE7QUFDakIsY0FBQSxNQUFBO0FBQUEsVUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLEtBQUwsQ0FBVyxHQUFYLENBQVQsQ0FBQTtBQUFBLFVBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUE5QixDQURBLENBRGlCO1FBQUEsQ0FBbkIsQ0FMQSxDQURTO01BQUEsQ0FoQlgsQ0FBQTtBQUFBLE1BNEJBLE9BQUEsR0FBVSxJQUFJLENBQUMsT0FBTCxDQUFhLE9BQWIsRUFBc0IsUUFBdEIsQ0E1QlYsQ0FBQTtBQUFBLE1BOEJBLE9BQU8sQ0FBQyxHQUFSLENBQUEsQ0E5QkEsQ0FBQTthQStCQSxPQUFPLENBQUMsS0FBUixDQUFjLFNBQWQsRUFBeUIsUUFBQSxHQUFXLE1BQXBDLEVBaENPO0lBQUEsQ0FaVDtHQUhGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/mark/.atom/packages/html2haml/lib/html2haml.coffee
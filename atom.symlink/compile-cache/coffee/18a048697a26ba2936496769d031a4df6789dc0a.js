(function() {
  var Html2hamlView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom').View;

  module.exports = Html2hamlView = (function(_super) {
    __extends(Html2hamlView, _super);

    function Html2hamlView() {
      return Html2hamlView.__super__.constructor.apply(this, arguments);
    }

    Html2hamlView.content = function() {
      return this.div({
        "class": 'html2haml overlay from-top'
      }, (function(_this) {
        return function() {
          return _this.div("The Html2haml package is Alive! It's ALIVE!", {
            "class": "message"
          });
        };
      })(this));
    };

    Html2hamlView.prototype.initialize = function(serializeState) {};

    Html2hamlView.prototype.convert = function() {
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
          console.log(str);
          result = JSON.parse(str);
          editor.insertText(result.page.haml);
        });
      };
      request = http.request(options, callback);
      request.end();
      return request.write(post_data, encoding = 'utf8');
    };

    Html2hamlView.prototype.serialize = function() {};

    Html2hamlView.prototype.destroy = function() {
      return this.detach();
    };

    return Html2hamlView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxNQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLG9DQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGFBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLDRCQUFQO09BQUwsRUFBMEMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDeEMsS0FBQyxDQUFBLEdBQUQsQ0FBSyw2Q0FBTCxFQUFvRDtBQUFBLFlBQUEsT0FBQSxFQUFPLFNBQVA7V0FBcEQsRUFEd0M7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExQyxFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLDRCQUlBLFVBQUEsR0FBWSxTQUFDLGNBQUQsR0FBQSxDQUpaLENBQUE7O0FBQUEsNEJBTUEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLFVBQUEsOEVBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQXhCLENBQUE7QUFBQSxNQUNBLFNBQUEsR0FBWSxNQUFNLENBQUMsWUFBUCxDQUFBLENBRFosQ0FBQTtBQUFBLE1BR0EsSUFBQSxHQUFPLFNBQVMsQ0FBQyxPQUFWLENBQUEsQ0FIUCxDQUFBO0FBQUEsTUFJQSxTQUFBLEdBQVksSUFBSSxDQUFDLFNBQUwsQ0FBZTtBQUFBLFFBQUMsTUFBQSxFQUFRO0FBQUEsVUFBQyxNQUFBLEVBQVEsSUFBVDtTQUFUO09BQWYsQ0FKWixDQUFBO0FBQUEsTUFRQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FSUCxDQUFBO0FBQUEsTUFVQSxPQUFBLEdBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxzQkFBTjtBQUFBLFFBQ0EsSUFBQSxFQUFNLFdBRE47QUFBQSxRQUdBLE1BQUEsRUFBUSxNQUhSO0FBQUEsUUFJQSxPQUFBLEVBQ0U7QUFBQSxVQUFBLGNBQUEsRUFBZ0IseUJBQWhCO0FBQUEsVUFDQSxnQkFBQSxFQUFrQixTQUFTLENBQUMsTUFENUI7U0FMRjtPQVhGLENBQUE7QUFBQSxNQW1CQSxRQUFBLEdBQVcsU0FBQyxRQUFELEdBQUE7QUFDVCxZQUFBLEdBQUE7QUFBQSxRQUFBLEdBQUEsR0FBTSxFQUFOLENBQUE7QUFBQSxRQUNBLFFBQVEsQ0FBQyxFQUFULENBQVksTUFBWixFQUFvQixTQUFDLEtBQUQsR0FBQTtBQUNsQixVQUFBLEdBQUEsSUFBTyxLQUFQLENBRGtCO1FBQUEsQ0FBcEIsQ0FEQSxDQUFBO0FBQUEsUUFLQSxRQUFRLENBQUMsRUFBVCxDQUFZLEtBQVosRUFBbUIsU0FBQSxHQUFBO0FBQ2pCLGNBQUEsTUFBQTtBQUFBLFVBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxHQUFaLENBQUEsQ0FBQTtBQUFBLFVBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxLQUFMLENBQVcsR0FBWCxDQURULENBQUE7QUFBQSxVQUVBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBOUIsQ0FGQSxDQURpQjtRQUFBLENBQW5CLENBTEEsQ0FEUztNQUFBLENBbkJYLENBQUE7QUFBQSxNQWlDQSxPQUFBLEdBQVUsSUFBSSxDQUFDLE9BQUwsQ0FBYSxPQUFiLEVBQXNCLFFBQXRCLENBakNWLENBQUE7QUFBQSxNQW1DQSxPQUFPLENBQUMsR0FBUixDQUFBLENBbkNBLENBQUE7YUFvQ0EsT0FBTyxDQUFDLEtBQVIsQ0FBYyxTQUFkLEVBQXlCLFFBQUEsR0FBVyxNQUFwQyxFQXJDTztJQUFBLENBTlQsQ0FBQTs7QUFBQSw0QkE4Q0EsU0FBQSxHQUFXLFNBQUEsR0FBQSxDQTlDWCxDQUFBOztBQUFBLDRCQWlEQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBQ1AsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQURPO0lBQUEsQ0FqRFQsQ0FBQTs7eUJBQUE7O0tBRDBCLEtBSDVCLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/mark/.atom/packages/html2haml/lib/html2haml-view.coffee
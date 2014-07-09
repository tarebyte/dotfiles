(function() {
  var HtmlPreviewView, url;

  url = require('url');

  HtmlPreviewView = require('./atom-html-preview-view');

  module.exports = {
    htmlPreviewView: null,
    activate: function(state) {
      atom.workspaceView.command('atom-html-preview:toggle', (function(_this) {
        return function() {
          return _this.toggle();
        };
      })(this));
      return atom.workspace.registerOpener(function(uriToOpen) {
        var error, host, pathname, protocol, _ref;
        try {
          _ref = url.parse(uriToOpen), protocol = _ref.protocol, host = _ref.host, pathname = _ref.pathname;
        } catch (_error) {
          error = _error;
          return;
        }
        if (protocol !== 'html-preview:') {
          return;
        }
        try {
          if (pathname) {
            pathname = decodeURI(pathname);
          }
        } catch (_error) {
          error = _error;
          return;
        }
        if (host === 'editor') {
          return new HtmlPreviewView({
            editorId: pathname.substring(1)
          });
        } else {
          return new HtmlPreviewView({
            filePath: pathname
          });
        }
      });
    },
    toggle: function() {
      var editor, previewPane, previousActivePane, uri;
      editor = atom.workspace.getActiveEditor();
      if (editor == null) {
        return;
      }
      uri = "html-preview://editor/" + editor.id;
      previewPane = atom.workspace.paneForUri(uri);
      if (previewPane) {
        previewPane.destroyItem(previewPane.itemForUri(uri));
        return;
      }
      previousActivePane = atom.workspace.getActivePane();
      return atom.workspace.open(uri, {
        split: 'right',
        searchAllPanes: true
      }).done(function(htmlPreviewView) {
        if (htmlPreviewView instanceof HtmlPreviewView) {
          htmlPreviewView.renderHTML();
          return previousActivePane.activate();
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9CQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxLQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUVBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLDBCQUFSLENBRmxCLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxlQUFBLEVBQWlCLElBQWpCO0FBQUEsSUFFQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixNQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIsMEJBQTNCLEVBQXVELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ3JELEtBQUMsQ0FBQSxNQUFELENBQUEsRUFEcUQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF2RCxDQUFBLENBQUE7YUFHQSxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWYsQ0FBOEIsU0FBQyxTQUFELEdBQUE7QUFDNUIsWUFBQSxxQ0FBQTtBQUFBO0FBQ0UsVUFBQSxPQUE2QixHQUFHLENBQUMsS0FBSixDQUFVLFNBQVYsQ0FBN0IsRUFBQyxnQkFBQSxRQUFELEVBQVcsWUFBQSxJQUFYLEVBQWlCLGdCQUFBLFFBQWpCLENBREY7U0FBQSxjQUFBO0FBR0UsVUFESSxjQUNKLENBQUE7QUFBQSxnQkFBQSxDQUhGO1NBQUE7QUFLQSxRQUFBLElBQWMsUUFBQSxLQUFZLGVBQTFCO0FBQUEsZ0JBQUEsQ0FBQTtTQUxBO0FBT0E7QUFDRSxVQUFBLElBQWtDLFFBQWxDO0FBQUEsWUFBQSxRQUFBLEdBQVcsU0FBQSxDQUFVLFFBQVYsQ0FBWCxDQUFBO1dBREY7U0FBQSxjQUFBO0FBR0UsVUFESSxjQUNKLENBQUE7QUFBQSxnQkFBQSxDQUhGO1NBUEE7QUFZQSxRQUFBLElBQUcsSUFBQSxLQUFRLFFBQVg7aUJBQ00sSUFBQSxlQUFBLENBQWdCO0FBQUEsWUFBQSxRQUFBLEVBQVUsUUFBUSxDQUFDLFNBQVQsQ0FBbUIsQ0FBbkIsQ0FBVjtXQUFoQixFQUROO1NBQUEsTUFBQTtpQkFHTSxJQUFBLGVBQUEsQ0FBZ0I7QUFBQSxZQUFBLFFBQUEsRUFBVSxRQUFWO1dBQWhCLEVBSE47U0FiNEI7TUFBQSxDQUE5QixFQUpRO0lBQUEsQ0FGVjtBQUFBLElBd0JBLE1BQUEsRUFBUSxTQUFBLEdBQUE7QUFDTixVQUFBLDRDQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFmLENBQUEsQ0FBVCxDQUFBO0FBQ0EsTUFBQSxJQUFjLGNBQWQ7QUFBQSxjQUFBLENBQUE7T0FEQTtBQUFBLE1BR0EsR0FBQSxHQUFPLHdCQUFBLEdBQXVCLE1BQU0sQ0FBQyxFQUhyQyxDQUFBO0FBQUEsTUFLQSxXQUFBLEdBQWMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFmLENBQTBCLEdBQTFCLENBTGQsQ0FBQTtBQU1BLE1BQUEsSUFBRyxXQUFIO0FBQ0UsUUFBQSxXQUFXLENBQUMsV0FBWixDQUF3QixXQUFXLENBQUMsVUFBWixDQUF1QixHQUF2QixDQUF4QixDQUFBLENBQUE7QUFDQSxjQUFBLENBRkY7T0FOQTtBQUFBLE1BVUEsa0JBQUEsR0FBcUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FWckIsQ0FBQTthQVdBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixHQUFwQixFQUF5QjtBQUFBLFFBQUEsS0FBQSxFQUFPLE9BQVA7QUFBQSxRQUFnQixjQUFBLEVBQWdCLElBQWhDO09BQXpCLENBQThELENBQUMsSUFBL0QsQ0FBb0UsU0FBQyxlQUFELEdBQUE7QUFDbEUsUUFBQSxJQUFHLGVBQUEsWUFBMkIsZUFBOUI7QUFDRSxVQUFBLGVBQWUsQ0FBQyxVQUFoQixDQUFBLENBQUEsQ0FBQTtpQkFDQSxrQkFBa0IsQ0FBQyxRQUFuQixDQUFBLEVBRkY7U0FEa0U7TUFBQSxDQUFwRSxFQVpNO0lBQUEsQ0F4QlI7R0FMRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/mark/.atom/packages/atom-html-preview/lib/atom-html-preview.coffee
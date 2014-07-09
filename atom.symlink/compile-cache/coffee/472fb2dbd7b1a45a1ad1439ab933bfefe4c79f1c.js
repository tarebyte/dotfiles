(function() {
  var RdioDesktop, applescript;

  applescript = require('applescript');

  module.exports = RdioDesktop = (function() {
    RdioDesktop.COMMANDS = [
      {
        name: 'add',
        "function": 'execute',
        action: 'add to collection'
      }, {
        name: 'next',
        "function": 'execute',
        action: 'next track'
      }, {
        name: 'pause',
        "function": 'execute',
        action: 'pause'
      }, {
        name: 'play',
        "function": 'execute',
        action: 'play'
      }, {
        name: 'previous',
        "function": 'execute',
        action: 'previous track'
      }, {
        name: 'remove',
        "function": 'execute',
        action: 'remove from collection'
      }, {
        name: 'sync',
        "function": 'execute',
        action: 'sync to mobile'
      }, {
        name: 'toggle',
        "function": 'execute',
        action: 'playpause'
      }, {
        name: 'unsync',
        "function": 'execute',
        action: 'remove from mobile'
      }
    ];

    RdioDesktop.prototype.playTrack = function(trackKey) {
      return this.execute("play source \"t" + trackKey + "\"");
    };

    RdioDesktop.prototype.currentState = function(callback) {
      return this.get('player state', callback);
    };

    RdioDesktop.prototype.currentAlbum = function(callback) {
      return this.getCurrent('album', callback);
    };

    RdioDesktop.prototype.currentArtist = function(callback) {
      return this.getCurrent('artist', callback);
    };

    RdioDesktop.prototype.currentTrack = function(callback) {
      return this.getCurrent('name', callback);
    };

    RdioDesktop.prototype.currentUrl = function(callback) {
      return this.getCurrent('rdio url', callback);
    };

    function RdioDesktop() {
      var command, _fn, _i, _len, _ref;
      _ref = RdioDesktop.COMMANDS;
      _fn = function(command) {
        return RdioDesktop.prototype[command.name] = function() {
          return this[command["function"]](command.action);
        };
      };
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        command = _ref[_i];
        _fn(command);
      }
    }

    RdioDesktop.prototype.currentlyPlaying = function(callback) {
      return this.currentArtist((function(_this) {
        return function(artist) {
          return _this.currentTrack(function(track) {
            return _this.currentUrl(function(url) {
              return callback({
                artist: artist,
                track: track,
                url: url
              });
            });
          });
        };
      })(this));
    };

    RdioDesktop.prototype.getCurrent = function(data, callback) {
      return this.get("" + data + " of the current track", callback);
    };

    RdioDesktop.prototype.get = function(data, callback) {
      return this.execute("get the " + data, callback);
    };

    RdioDesktop.prototype.execute = function(action, callback) {
      return setTimeout((function(_this) {
        return function() {
          var command;
          command = "if application \"Rdio\" is running then tell application \"Rdio\" to " + action;
          return applescript.execString(command, function(err, data) {
            return typeof callback === "function" ? callback(data) : void 0;
          });
        };
      })(this), 0);
    };

    return RdioDesktop;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdCQUFBOztBQUFBLEVBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxhQUFSLENBQWQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixJQUFBLFdBQUMsQ0FBQSxRQUFELEdBQVk7TUFDVjtBQUFBLFFBQUUsSUFBQSxFQUFNLEtBQVI7QUFBQSxRQUFvQixVQUFBLEVBQVUsU0FBOUI7QUFBQSxRQUF5QyxNQUFBLEVBQVEsbUJBQWpEO09BRFUsRUFFVjtBQUFBLFFBQUUsSUFBQSxFQUFNLE1BQVI7QUFBQSxRQUFvQixVQUFBLEVBQVUsU0FBOUI7QUFBQSxRQUF5QyxNQUFBLEVBQVEsWUFBakQ7T0FGVSxFQUdWO0FBQUEsUUFBRSxJQUFBLEVBQU0sT0FBUjtBQUFBLFFBQW9CLFVBQUEsRUFBVSxTQUE5QjtBQUFBLFFBQXlDLE1BQUEsRUFBUSxPQUFqRDtPQUhVLEVBSVY7QUFBQSxRQUFFLElBQUEsRUFBTSxNQUFSO0FBQUEsUUFBb0IsVUFBQSxFQUFVLFNBQTlCO0FBQUEsUUFBeUMsTUFBQSxFQUFRLE1BQWpEO09BSlUsRUFLVjtBQUFBLFFBQUUsSUFBQSxFQUFNLFVBQVI7QUFBQSxRQUFvQixVQUFBLEVBQVUsU0FBOUI7QUFBQSxRQUF5QyxNQUFBLEVBQVEsZ0JBQWpEO09BTFUsRUFNVjtBQUFBLFFBQUUsSUFBQSxFQUFNLFFBQVI7QUFBQSxRQUFvQixVQUFBLEVBQVUsU0FBOUI7QUFBQSxRQUF5QyxNQUFBLEVBQVEsd0JBQWpEO09BTlUsRUFPVjtBQUFBLFFBQUUsSUFBQSxFQUFNLE1BQVI7QUFBQSxRQUFvQixVQUFBLEVBQVUsU0FBOUI7QUFBQSxRQUF5QyxNQUFBLEVBQVEsZ0JBQWpEO09BUFUsRUFRVjtBQUFBLFFBQUUsSUFBQSxFQUFNLFFBQVI7QUFBQSxR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
//# sourceURL=/Users/mark/.atom/packages/Rdio/lib/rdio-desktop.coffee
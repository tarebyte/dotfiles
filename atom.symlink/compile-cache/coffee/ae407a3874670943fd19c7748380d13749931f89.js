(function() {
  var RdioDesktop, RdioView, View, md5, open,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom').View;

  open = require('open');

  md5 = require('MD5');

  RdioDesktop = require('./rdio-desktop');

  module.exports = RdioView = (function(_super) {
    __extends(RdioView, _super);

    function RdioView() {
      this.afterAttach = __bind(this.afterAttach, this);
      this.attach = __bind(this.attach, this);
      this.currentMood = __bind(this.currentMood, this);
      return RdioView.__super__.constructor.apply(this, arguments);
    }

    RdioView.CONFIGS = {
      showEqualizer: {
        key: 'showEqualizer (WindowResizePerformanceIssue )',
        action: 'toggleEqualizer',
        "default": true
      }
    };

    RdioView.content = function() {
      return this.div({
        "class": 'rdio'
      }, (function(_this) {
        return function() {
          return _this.div({
            outlet: 'container',
            "class": 'rdio-container inline-block'
          }, function() {
            _this.span({
              outlet: 'soundBars',
              "class": 'rdio-sound-bars'
            }, function() {
              _this.span({
                "class": 'rdio-sound-bar'
              });
              _this.span({
                "class": 'rdio-sound-bar'
              });
              _this.span({
                "class": 'rdio-sound-bar'
              });
              _this.span({
                "class": 'rdio-sound-bar'
              });
              return _this.span({
                "class": 'rdio-sound-bar'
              });
            });
            return _this.a({
              outlet: 'currentlyPlaying',
              href: 'javascript:'
            }, '');
          });
        };
      })(this));
    };

    RdioView.prototype.initialize = function() {
      this.currentTrack = {};
      this.currentState = null;
      this.initiated = false;
      this.rdioDesktop = new RdioDesktop;
      this.addCommands();
      if (atom.workspaceView.statusBar) {
        return this.attach();
      } else {
        return this.subscribe(atom.packages.once('activated', (function(_this) {
          return function() {
            return setTimeout(_this.attach, 1);
          };
        })(this)));
      }
    };

    RdioView.prototype.destroy = function() {
      return this.detach();
    };

    RdioView.prototype.addCommands = function() {
      var command, _fn, _i, _len, _ref;
      _ref = RdioDesktop.COMMANDS;
      _fn = (function(_this) {
        return function(command) {
          return atom.workspaceView.command("rdio:" + command.name, '.editor', function() {
            return _this.rdioDesktop[command.name]();
          });
        };
      })(this);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        command = _ref[_i];
        _fn(command);
      }
      atom.workspaceView.command('rdio:open-current-track', '.editor', (function(_this) {
        return function() {
          return _this.openWithRdio(_this.currentlyPlaying.attr('href'));
        };
      })(this));
      return atom.workspaceView.command('rdio:play-code-mood', '.editor', this.currentMood);
    };

    RdioView.prototype.currentMood = function() {
      var content, digits, editor;
      editor = atom.workspaceView.getActivePaneItem();
      content = (editor.getSelectedText() || editor.getText()).replace(/(\n)/gm, '');
      digits = md5(content).replace(/\D/g, '').substring(0, 6);
      console.log("Rdio Code Mood: See http://rdioconsole.appspot.com/#keys%3Dt" + digits + "%26method%3Dget for more track info.");
      return this.rdioDesktop.playTrack(digits);
    };

    RdioView.prototype.attach = function() {
      var showEqualizerKey;
      atom.workspaceView.statusBar.appendRight(this);
      this.currentlyPlaying.on('click', (function(_this) {
        return function(e) {
          return _this.openWithRdio(e.currentTarget.href);
        };
      })(this));
      showEqualizerKey = "Rdio." + RdioView.CONFIGS.showEqualizer.key;
      return this.subscribe(atom.config.observe(showEqualizerKey, {
        callNow: true
      }, (function(_this) {
        return function() {
          if (atom.config.get(showEqualizerKey)) {
            return _this.soundBars.removeAttr('data-hidden');
          } else {
            return _this.soundBars.attr('data-hidden', true);
          }
        };
      })(this)));
    };

    RdioView.prototype.openWithRdio = function(href) {
      return open(href);
    };

    RdioView.prototype.afterAttach = function() {
      return setInterval((function(_this) {
        return function() {
          return _this.rdioDesktop.currentState(function(state) {
            if (state !== _this.currentState) {
              _this.currentState = state;
              _this.soundBars.attr('data-state', state);
            }
            if (state === void 0) {
              if (_this.initiated) {
                _this.initiated = false;
                _this.currentTrack = {};
                _this.container.removeAttr('data-initiated');
              }
              return;
            }
            if (state === 'paused' && _this.initiated) {
              return;
            }
            return _this.rdioDesktop.currentlyPlaying(function(data) {
              if (!(data.artist && data.track)) {
                return;
              }
              if (data.artist === _this.currentTrack.artist && data.track === _this.currentTrack.track) {
                return;
              }
              _this.currentlyPlaying.text("" + data.artist + " - " + data.track);
              _this.currentlyPlaying.attr('href', "rdio://www.rdio.com" + data.url);
              _this.currentTrack = data;
              if (_this.initiated) {
                return;
              }
              _this.initiated = true;
              return _this.container.attr('data-initiated', true);
            });
          });
        };
      })(this), 1500);
    };

    return RdioView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNDQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsTUFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVIsQ0FGTixDQUFBOztBQUFBLEVBR0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQUhkLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osK0JBQUEsQ0FBQTs7Ozs7OztLQUFBOztBQUFBLElBQUEsUUFBQyxDQUFBLE9BQUQsR0FBVztBQUFBLE1BQ1QsYUFBQSxFQUNFO0FBQUEsUUFBQSxHQUFBLEVBQUssK0NBQUw7QUFBQSxRQUNBLE1BQUEsRUFBUSxpQkFEUjtBQUFBLFFBRUEsU0FBQSxFQUFTLElBRlQ7T0FGTztLQUFYLENBQUE7O0FBQUEsSUFPQSxRQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxNQUFQO09BQUwsRUFBb0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDbEIsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsTUFBQSxFQUFRLFdBQVI7QUFBQSxZQUFxQixPQUFBLEVBQU8sNkJBQTVCO1dBQUwsRUFBZ0UsU0FBQSxHQUFBO0FBQzlELFlBQUEsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLGNBQUEsTUFBQSxFQUFRLFdBQVI7QUFBQSxjQUFxQixPQUFBLEVBQU8saUJBQTVCO2FBQU4sRUFBcUQsU0FBQSxHQUFBO0FBQ25ELGNBQUEsS0FBQyxDQUFBLElBQUQsQ0FB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
//# sourceURL=/Users/mark/.atom/packages/Rdio/lib/rdio-view.coffee
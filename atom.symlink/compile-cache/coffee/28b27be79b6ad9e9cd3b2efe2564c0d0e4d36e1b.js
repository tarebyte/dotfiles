(function() {
  var Perf;

  Perf = (function() {
    function Perf(name, options) {
      var _base, _base1, _base2;
      this.name = name;
      this.options = options != null ? options : {};
      if ((_base = this.options).good == null) {
        _base.good = 100;
      }
      if ((_base1 = this.options).bad == null) {
        _base1.bad = 500;
      }
      if ((_base2 = this.options).debug == null) {
        _base2.debug = true;
      }
      this.started = false;
    }

    Perf.prototype.start = function() {
      if (this.started || !this.options.debug) {
        return;
      }
      this.start = +new Date();
      return this.started = true;
    };

    Perf.prototype.stop = function(printLine) {
      var background, color, duration, end, message;
      if (!this.started || !this.options.debug) {
        return;
      }
      end = +new Date();
      duration = end - this.start;
      if (this.name != null) {
        message = this.name + ' took';
      } else {
        message = 'Code execution time:';
      }
      if (typeof window !== "undefined" && window !== null) {
        if (duration < this.options.good) {
          background = 'darkgreen';
          color = 'white';
        } else if (duration > this.options.good && duration < this.options.bad) {
          background = 'orange';
          color = 'black';
        } else {
          background = 'darkred';
          color = 'white';
        }
        console.log('%c perf %c ' + message + ' %c ' + duration.toFixed(2) + 'ms ', 'background: #222; color: #bada55', '', 'background: ' + background + '; color: ' + color);
      } else {
        console.log('[perf] ' + message + ' ' + duration.toFixed(2) + 'ms');
      }
      this.started = false;
      if (printLine && (typeof window !== "undefined" && window !== null)) {
        return console.log('%c perf %c -- END --                                                                          ', 'background: #222; color: #bada55', 'background: #222; color: #ffffff');
      }
    };

    return Perf;

  })();

  module.exports = Perf;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLElBQUE7O0FBQUEsRUFBTTtBQUNTLElBQUEsY0FBRSxJQUFGLEVBQVMsT0FBVCxHQUFBO0FBQ1gsVUFBQSxxQkFBQTtBQUFBLE1BRFksSUFBQyxDQUFBLE9BQUEsSUFDYixDQUFBO0FBQUEsTUFEbUIsSUFBQyxDQUFBLDRCQUFBLFVBQVEsRUFDNUIsQ0FBQTs7YUFBUSxDQUFDLE9BQVM7T0FBbEI7O2NBQ1EsQ0FBQyxNQUFTO09BRGxCOztjQUVRLENBQUMsUUFBUztPQUZsQjtBQUFBLE1BSUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxLQUpYLENBRFc7SUFBQSxDQUFiOztBQUFBLG1CQU9BLEtBQUEsR0FBTyxTQUFBLEdBQUE7QUFDTCxNQUFBLElBQVUsSUFBQyxDQUFBLE9BQUQsSUFBWSxDQUFBLElBQUUsQ0FBQSxPQUFPLENBQUMsS0FBaEM7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxDQUFBLElBQUssSUFBQSxDQUFBLENBRGQsQ0FBQTthQUVBLElBQUMsQ0FBQSxPQUFELEdBQVcsS0FITjtJQUFBLENBUFAsQ0FBQTs7QUFBQSxtQkFZQSxJQUFBLEdBQU0sU0FBQyxTQUFELEdBQUE7QUFDSixVQUFBLHlDQUFBO0FBQUEsTUFBQSxJQUFVLENBQUEsSUFBRSxDQUFBLE9BQUYsSUFBYSxDQUFBLElBQUUsQ0FBQSxPQUFPLENBQUMsS0FBakM7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsR0FBQSxHQUFNLENBQUEsSUFBSyxJQUFBLENBQUEsQ0FEWCxDQUFBO0FBQUEsTUFFQSxRQUFBLEdBQVcsR0FBQSxHQUFNLElBQUMsQ0FBQSxLQUZsQixDQUFBO0FBSUEsTUFBQSxJQUFHLGlCQUFIO0FBQ0UsUUFBQSxPQUFBLEdBQVUsSUFBQyxDQUFBLElBQUQsR0FBUSxPQUFsQixDQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsT0FBQSxHQUFVLHNCQUFWLENBSEY7T0FKQTtBQVNBLE1BQUEsSUFBRyxnREFBSDtBQUNFLFFBQUEsSUFBRyxRQUFBLEdBQVcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUF2QjtBQUNFLFVBQUEsVUFBQSxHQUFhLFdBQWIsQ0FBQTtBQUFBLFVBQ0EsS0FBQSxHQUFRLE9BRFIsQ0FERjtTQUFBLE1BR0ssSUFBRyxRQUFBLEdBQVcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFwQixJQUE2QixRQUFBLEdBQVcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxHQUFwRDtBQUNILFVBQUEsVUFBQSxHQUFhLFFBQWIsQ0FBQTtBQUFBLFVBQ0EsS0FBQSxHQUFRLE9BRFIsQ0FERztTQUFBLE1BQUE7QUFJSCxVQUFBLFVBQUEsR0FBYSxTQUFiLENBQUE7QUFBQSxVQUNBLEtBQUEsR0FBUSxPQURSLENBSkc7U0FITDtBQUFBLFFBVUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxhQUFBLEdBQWdCLE9BQWhCLEdBQTBCLE1BQTFCLEdBQW1DLFFBQVEsQ0FBQyxPQUFULENBQWlCLENBQWpCLENBQW5DLEdBQXlELEtBQXJFLEVBQTRFLGtDQUE1RSxFQUFnSCxFQUFoSCxFQUFvSCxjQUFBLEdBQWlCLFVBQWpCLEdBQThCLFdBQTlCLEdBQTRDLEtBQWhLLENBVkEsQ0FERjtPQUFBLE1BQUE7QUFhRSxRQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksU0FBQSxHQUFZLE9BQVosR0FBc0IsR0FBdEIsR0FBNEIsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsQ0FBakIsQ0FBNUIsR0FBa0QsSUFBOUQsQ0FBQSxDQWJGO09BVEE7QUFBQSxNQXdCQSxJQUFDLENBQUEsT0FBRCxHQUFXLEtBeEJYLENBQUE7QUEwQkEsTUFBQSxJQUFHLFNBQUEsSUFBYyxrREFBakI7ZUFDRSxPQUFPLENBQUMsR0FBUixDQUFZLGdHQUFaLEVBQThHLGtDQUE5RyxFQUFrSixrQ0FBbEosRUFERjtPQTNCSTtJQUFBLENBWk4sQ0FBQTs7Z0JBQUE7O01BREYsQ0FBQTs7QUFBQSxFQTJDQSxNQUFNLENBQUMsT0FBUCxHQUFpQixJQTNDakIsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/mark/.atom/packages/autocomplete-plus/lib/perf.coffee
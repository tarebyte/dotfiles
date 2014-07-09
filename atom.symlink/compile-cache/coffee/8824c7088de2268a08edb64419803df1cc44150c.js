(function() {
  var ConditionalContextMenu, Convert, VariableInspector, _regexes;

  Convert = require('./ColorPicker-convert');

  ConditionalContextMenu = require('./conditional-contextmenu');

  VariableInspector = require('./variable-inspector');

  _regexes = require('./ColorPicker-regexes');

  module.exports = {
    view: null,
    match: null,
    activate: function() {
      var ColorPickerView;
      atom.workspaceView.command("color-picker:open", (function(_this) {
        return function() {
          return _this.open(true);
        };
      })(this));
      ConditionalContextMenu.item({
        label: 'Color picker',
        command: 'color-picker:open'
      }, (function(_this) {
        return function() {
          if (_this.match = _this.getMatchAtCursor()) {
            return true;
          }
        };
      })(this));
      ColorPickerView = require('./ColorPicker-view');
      return this.view = new ColorPickerView;
    },
    deactivate: function() {
      return this.view.destroy();
    },
    getMatchAtCursor: function() {
      var _cursorBuffer, _cursorColumn, _cursorRow, _editor, _line;
      if (!(_editor = atom.workspace.getActiveEditor())) {
        return;
      }
      _line = _editor.getCursor().getCurrentBufferLine();
      _cursorBuffer = _editor.getCursorBufferPosition();
      _cursorRow = _cursorBuffer.row;
      _cursorColumn = _cursorBuffer.column;
      return this.matchAtPosition(_cursorColumn, this.matchesOnLine(_line, _cursorRow));
    },
    matchesOnLine: function(line, cursorRow) {
      var match, regex, type, _filteredMatches, _i, _index, _j, _len, _len1, _matches, _ref;
      if (!(line && typeof cursorRow === 'number')) {
        return;
      }
      _filteredMatches = [];
      for (_i = 0, _len = _regexes.length; _i < _len; _i++) {
        _ref = _regexes[_i], type = _ref.type, regex = _ref.regex;
        if (!(_matches = line.match(regex))) {
          continue;
        }
        for (_j = 0, _len1 = _matches.length; _j < _len1; _j++) {
          match = _matches[_j];
          if ((_index = line.indexOf(match)) === -1) {
            continue;
          }
          _filteredMatches.push({
            match: match,
            regexMatch: match.match(RegExp(regex.source, 'i')),
            type: type,
            index: _index,
            end: _index + match.length,
            row: cursorRow
          });
          line = line.replace(match, (Array(match.length + 1)).join(' '));
        }
      }
      if (!(_filteredMatches.length > 0)) {
        return;
      }
      return _filteredMatches;
    },
    matchAtPosition: function(column, matches) {
      var _match;
      if (!(column && matches)) {
        return;
      }
      _match = (function() {
        var match, _i, _len;
        for (_i = 0, _len = matches.length; _i < _len; _i++) {
          match = matches[_i];
          if (match.index <= column && match.end >= column) {
            return match;
          }
        }
      })();
      return _match;
    },
    open: function(getMatch) {
      var randomRGBFragment, _cursorBuffer, _cursorColumn, _cursorRow, _line, _match;
      if (getMatch == null) {
        getMatch = false;
      }
      if (getMatch) {
        this.match = this.getMatchAtCursor();
      }
      if (!this.match) {
        randomRGBFragment = function() {
          return (Math.random() * 255) << 0;
        };
        _line = '#' + Convert.rgbToHex([randomRGBFragment(), randomRGBFragment(), randomRGBFragment()]);
        _cursorBuffer = atom.workspace.getActiveEditor().getCursorBufferPosition();
        _cursorRow = _cursorBuffer.row;
        _cursorColumn = _cursorBuffer.column;
        _match = (this.matchesOnLine(_line, _cursorRow))[0];
        _match.index = _cursorColumn;
        _match.end = _cursorColumn;
        this.match = _match;
      }
      if (!this.match) {
        return;
      }
      this.view.reset();
      this.setMatchColor();
      return this.view.open();
    },
    setMatchColor: function() {
      var _callback;
      if (!this.match) {
        return;
      }
      this.view.storage.selectedColor = null;
      if (this.match.hasOwnProperty('color')) {
        this.view.storage.selectedColor = this.match;
        this.view.inputColor(this.match);
        return;
      }
      _callback = (function(_this) {
        return function() {
          return _this.setMatchColor();
        };
      })(this);
      switch (this.match.type) {
        case 'variable:sass':
          return this.setVariableDefinitionColor(this.match, _callback);
        case 'variable:less':
          return this.setVariableDefinitionColor(this.match, _callback);
        default:
          return (function(_this) {
            return function() {
              _this.match.color = _this.match.match;
              return _callback(_this.match);
            };
          })(this)();
      }
    },
    setVariableDefinitionColor: function(match, callback) {
      var regex, type, _i, _len, _matchRegex, _ref, _variableName;
      if (!(match && callback)) {
        return;
      }
      for (_i = 0, _len = _regexes.length; _i < _len; _i++) {
        _ref = _regexes[_i], type = _ref.type, regex = _ref.regex;
        if (type === match.type) {
          _matchRegex = regex;
        }
      }
      _variableName = (match.match.match(RegExp(_matchRegex.source, 'i')))[2];
      return (this.findVariableDefinition(_variableName, match.type)).then(function(_arg) {
        var color, pointer;
        color = _arg.color, pointer = _arg.pointer;
        match.color = color.match;
        match.type = color.type;
        match.pointer = pointer;
        return callback(match);
      });
    },
    findVariableDefinition: function(name, type, pointer) {
      return (VariableInspector.findDefinition(name, type)).then((function(_this) {
        return function(definition) {
          var _color, _matches;
          if (pointer == null) {
            pointer = definition.pointer;
          }
          _matches = _this.matchesOnLine(definition.definition, 1);
          if (!(_matches && (_color = _matches[0]))) {
            return _this.view.error();
          }
          if ((_color.type.split(':'))[0] === 'variable') {
            return _this.findVariableDefinition(_color.regexMatch[2], _color.type, pointer);
          }
          return {
            color: _color,
            pointer: pointer
          };
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBSVE7QUFBQSxNQUFBLDREQUFBOztBQUFBLEVBQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSx1QkFBUixDQUFWLENBQUE7O0FBQUEsRUFDQSxzQkFBQSxHQUF5QixPQUFBLENBQVEsMkJBQVIsQ0FEekIsQ0FBQTs7QUFBQSxFQUVBLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSxzQkFBUixDQUZwQixDQUFBOztBQUFBLEVBSUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSx1QkFBUixDQUpYLENBQUE7O0FBQUEsRUFTQSxNQUFNLENBQUMsT0FBUCxHQUNJO0FBQUEsSUFBQSxJQUFBLEVBQU0sSUFBTjtBQUFBLElBQ0EsS0FBQSxFQUFPLElBRFA7QUFBQSxJQUdBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDTixVQUFBLGVBQUE7QUFBQSxNQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIsbUJBQTNCLEVBQWdELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLElBQUQsQ0FBTSxJQUFOLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoRCxDQUFBLENBQUE7QUFBQSxNQUVBLHNCQUFzQixDQUFDLElBQXZCLENBQTRCO0FBQUEsUUFDeEIsS0FBQSxFQUFPLGNBRGlCO0FBQUEsUUFFeEIsT0FBQSxFQUFTLG1CQUZlO09BQTVCLEVBR0csQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUFHLFVBQUEsSUFBZSxLQUFDLENBQUEsS0FBRCxHQUFTLEtBQUMsQ0FBQSxnQkFBRCxDQUFBLENBQXhCO0FBQUEsbUJBQU8sSUFBUCxDQUFBO1dBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUhILENBRkEsQ0FBQTtB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
//# sourceURL=/Users/mark/.atom/packages/color-picker/lib/ColorPicker.coffee
(function() {
  var $, Commands, Motions, Operators, Panes, Prefixes, Scroll, TextObjects, Utils, VimState, _;

  _ = require('underscore-plus');

  $ = require('atom').$;

  Operators = require('./operators/index');

  Prefixes = require('./prefixes');

  Commands = require('./commands');

  Motions = require('./motions/index');

  TextObjects = require('./text-objects');

  Utils = require('./utils');

  Panes = require('./panes');

  Scroll = require('./scroll');

  module.exports = VimState = (function() {
    VimState.prototype.editor = null;

    VimState.prototype.opStack = null;

    VimState.prototype.mode = null;

    VimState.prototype.submode = null;

    function VimState(editorView) {
      this.editorView = editorView;
      this.editor = this.editorView.editor;
      this.opStack = [];
      this.history = [];
      this.marks = {};
      this.setupCommandMode();
      this.registerInsertIntercept();
      if (atom.config.get('vim-mode.startInInsertMode')) {
        this.activateInsertMode();
      } else {
        this.activateCommandMode();
      }
      atom.project.eachBuffer((function(_this) {
        return function(buffer) {
          return _this.registerChangeHandler(buffer);
        };
      })(this));
    }

    VimState.prototype.registerInsertIntercept = function() {
      return this.editorView.preempt('textInput', (function(_this) {
        return function(e) {
          if ($(e.currentTarget).hasClass('mini')) {
            return;
          }
          if (_this.mode === 'insert') {
            return true;
          } else {
            _this.clearOpStack();
            return false;
          }
        };
      })(this));
    };

    VimState.prototype.registerChangeHandler = function(buffer) {
      return buffer.on('changed', (function(_this) {
        return function(_arg) {
          var newRange, newText, oldRange, oldText;
          newRange = _arg.newRange, newText = _arg.newText, oldRange = _arg.oldRange, oldText = _arg.oldText;
          if (_this.setRegister == null) {
            return;
          }
          if (newText === '') {
            return _this.setRegister('"', {
              text: oldText,
              type: Utils.copyType(oldText)
            });
          }
        };
      })(this));
    };

    VimState.prototype.setupCommandMode = function() {
      this.registerCommands({
        'activate-command-mode': (function(_this) {
          return function() {
            return _this.activateCommandMode();
          };
        })(this),
        'activate-insert-mode': (function(_this) {
          return function() {
            return _this.activateInsertMode();
          };
        })(this),
        'activate-linewise-visual-mode': (function(_this) {
          return function() {
            return _this.activateVisualMode('linewise');
          };
        })(this),
        'activate-characterwise-visual-mode': (function(_this) {
          return function() {
            return _this.activateVisualMode('characterwise');
          };
        })(this),
        'activate-blockwise-visual-mode': (function(_this) {
          return function() {
            return _this.activateVisualMode('blockwise');
          };
        })(this),
        'reset-command-mode': (function(_this) {
          return function() {
            return _this.resetCommandMode();
          };
        })(this),
        'repeat-prefix': (function(_this) {
          return function(e) {
            return _this.repeatPrefix(e);
          };
        })(this)
      });
      return this.registerOperationCommands({
        'substitute': (function(_this) {
          return function() {
            return new Commands.Substitute(_this.editor, _this);
          };
        })(this),
        'substitute-line': (function(_this) {
          return function() {
            return new Commands.SubstituteLine(_this.editor, _this);
          };
        })(this),
        'insert-after': (function(_this) {
          return function() {
            return new Commands.InsertAfter(_this.editor, _this);
          };
        })(this),
        'insert-after-end-of-line': (function(_this) {
          return function() {
            return [new Motions.MoveToLastCharacterOfLine(_this.editor), new Commands.InsertAfter(_this.editor, _this)];
          };
        })(this),
        'insert-at-beginning-of-line': (function(_this) {
          return function() {
            return [new Motions.MoveToFirstCharacterOfLine(_this.editor), new Commands.Insert(_this.editor, _this)];
          };
        })(this),
        'insert-above-with-newline': (function(_this) {
          return function() {
            return new Commands.InsertAboveWithNewline(_this.editor, _this);
          };
        })(this),
        'insert-below-with-newline': (function(_this) {
          return function() {
            return new Commands.InsertBelowWithNewline(_this.editor, _this);
          };
        })(this),
        'delete': (function(_this) {
          return function() {
            return _this.linewiseAliasedOperator(Operators.Delete);
          };
        })(this),
        'change': (function(_this) {
          return function() {
            return _this.linewiseAliasedOperator(Operators.Change);
          };
        })(this),
        'change-to-last-character-of-line': (function(_this) {
          return function() {
            return [new Operators.Change(_this.editor, _this), new Motions.MoveToLastCharacterOfLine(_this.editor)];
          };
        })(this),
        'delete-right': (function(_this) {
          return function() {
            return [new Operators.Delete(_this.editor, _this), new Motions.MoveRight(_this.editor)];
          };
        })(this),
        'delete-left': (function(_this) {
          return function() {
            return [new Operators.Delete(_this.editor, _this), new Motions.MoveLeft(_this.editor)];
          };
        })(this),
        'delete-to-last-character-of-line': (function(_this) {
          return function() {
            return [new Operators.Delete(_this.editor, _this), new Motions.MoveToLastCharacterOfLine(_this.editor)];
          };
        })(this),
        'toggle-case': (function(_this) {
          return function() {
            return new Operators.ToggleCase(_this.editor, _this);
          };
        })(this),
        'yank': (function(_this) {
          return function() {
            return _this.linewiseAliasedOperator(Operators.Yank);
          };
        })(this),
        'yank-line': (function(_this) {
          return function() {
            return [new Operators.Yank(_this.editor, _this), new Motions.MoveToLine(_this.editor)];
          };
        })(this),
        'put-before': (function(_this) {
          return function() {
            return new Operators.Put(_this.editor, _this, {
              location: 'before'
            });
          };
        })(this),
        'put-after': (function(_this) {
          return function() {
            return new Operators.Put(_this.editor, _this, {
              location: 'after'
            });
          };
        })(this),
        'join': (function(_this) {
          return function() {
            return new Operators.Join(_this.editor, _this);
          };
        })(this),
        'indent': (function(_this) {
          return function() {
            return _this.linewiseAliasedOperator(Operators.Indent);
          };
        })(this),
        'outdent': (function(_this) {
          return function() {
            return _this.linewiseAliasedOperator(Operators.Outdent);
          };
        })(this),
        'auto-indent': (function(_this) {
          return function() {
            return _this.linewiseAliasedOperator(Operators.Autoindent);
          };
        })(this),
        'move-left': (function(_this) {
          return function() {
            return new Motions.MoveLeft(_this.editor);
          };
        })(this),
        'move-up': (function(_this) {
          return function() {
            return new Motions.MoveUp(_this.editor);
          };
        })(this),
        'move-down': (function(_this) {
          return function() {
            return new Motions.MoveDown(_this.editor);
          };
        })(this),
        'move-right': (function(_this) {
          return function() {
            return new Motions.MoveRight(_this.editor);
          };
        })(this),
        'move-to-next-word': (function(_this) {
          return function() {
            return new Motions.MoveToNextWord(_this.editor);
          };
        })(this),
        'move-to-next-whole-word': (function(_this) {
          return function() {
            return new Motions.MoveToNextWholeWord(_this.editor);
          };
        })(this),
        'move-to-end-of-word': (function(_this) {
          return function() {
            return new Motions.MoveToEndOfWord(_this.editor);
          };
        })(this),
        'move-to-end-of-whole-word': (function(_this) {
          return function() {
            return new Motions.MoveToEndOfWholeWord(_this.editor);
          };
        })(this),
        'move-to-previous-word': (function(_this) {
          return function() {
            return new Motions.MoveToPreviousWord(_this.editor);
          };
        })(this),
        'move-to-previous-whole-word': (function(_this) {
          return function() {
            return new Motions.MoveToPreviousWholeWord(_this.editor);
          };
        })(this),
        'move-to-next-paragraph': (function(_this) {
          return function() {
            return new Motions.MoveToNextParagraph(_this.editor);
          };
        })(this),
        'move-to-previous-paragraph': (function(_this) {
          return function() {
            return new Motions.MoveToPreviousParagraph(_this.editor);
          };
        })(this),
        'move-to-first-character-of-line': (function(_this) {
          return function() {
            return new Motions.MoveToFirstCharacterOfLine(_this.editor);
          };
        })(this),
        'move-to-last-character-of-line': (function(_this) {
          return function() {
            return new Motions.MoveToLastCharacterOfLine(_this.editor);
          };
        })(this),
        'move-to-beginning-of-line': (function(_this) {
          return function(e) {
            return _this.moveOrRepeat(e);
          };
        })(this),
        'move-to-start-of-file': (function(_this) {
          return function() {
            return new Motions.MoveToStartOfFile(_this.editor);
          };
        })(this),
        'move-to-line': (function(_this) {
          return function() {
            return new Motions.MoveToLine(_this.editor);
          };
        })(this),
        'move-to-top-of-screen': (function(_this) {
          return function() {
            return new Motions.MoveToTopOfScreen(_this.editor, _this.editorView);
          };
        })(this),
        'move-to-bottom-of-screen': (function(_this) {
          return function() {
            return new Motions.MoveToBottomOfScreen(_this.editor, _this.editorView);
          };
        })(this),
        'move-to-middle-of-screen': (function(_this) {
          return function() {
            return new Motions.MoveToMiddleOfScreen(_this.editor, _this.editorView);
          };
        })(this),
        'scroll-down': (function(_this) {
          return function() {
            return new Scroll.ScrollDown(_this.editorView, _this.editor);
          };
        })(this),
        'scroll-up': (function(_this) {
          return function() {
            return new Scroll.ScrollUp(_this.editorView, _this.editor);
          };
        })(this),
        'select-inside-word': (function(_this) {
          return function() {
            return new TextObjects.SelectInsideWord(_this.editor);
          };
        })(this),
        'register-prefix': (function(_this) {
          return function(e) {
            return _this.registerPrefix(e);
          };
        })(this),
        'repeat': (function(_this) {
          return function(e) {
            return new Operators.Repeat(_this.editor, _this);
          };
        })(this),
        'repeat-search': (function(_this) {
          return function(e) {
            var currentSearch;
            if ((currentSearch = Motions.Search.currentSearch) != null) {
              return currentSearch.repeat();
            }
          };
        })(this),
        'repeat-search-backwards': (function(_this) {
          return function(e) {
            var currentSearch;
            if ((currentSearch = Motions.Search.currentSearch) != null) {
              return currentSearch.repeat({
                backwards: true
              });
            }
          };
        })(this),
        'focus-pane-view-on-left': (function(_this) {
          return function() {
            return new Panes.FocusPaneViewOnLeft();
          };
        })(this),
        'focus-pane-view-on-right': (function(_this) {
          return function() {
            return new Panes.FocusPaneViewOnRight();
          };
        })(this),
        'focus-pane-view-above': (function(_this) {
          return function() {
            return new Panes.FocusPaneViewAbove();
          };
        })(this),
        'focus-pane-view-below': (function(_this) {
          return function() {
            return new Panes.FocusPaneViewBelow();
          };
        })(this),
        'focus-previous-pane-view': (function(_this) {
          return function() {
            return new Panes.FocusPreviousPaneView();
          };
        })(this),
        'move-to-mark': (function(_this) {
          return function(e) {
            return new Motions.MoveToMark(_this.editorView, _this);
          };
        })(this),
        'move-to-mark-literal': (function(_this) {
          return function(e) {
            return new Motions.MoveToMark(_this.editorView, _this, false);
          };
        })(this),
        'mark': (function(_this) {
          return function(e) {
            return new Operators.Mark(_this.editorView, _this);
          };
        })(this),
        'find': (function(_this) {
          return function(e) {
            return new Motions.Find(_this.editorView, _this);
          };
        })(this),
        'find-backwards': (function(_this) {
          return function(e) {
            return new Motions.Find(_this.editorView, _this).reverse();
          };
        })(this),
        'till': (function(_this) {
          return function(e) {
            return new Motions.Till(_this.editorView, _this);
          };
        })(this),
        'till-backwards': (function(_this) {
          return function(e) {
            return new Motions.Till(_this.editorView, _this).reverse();
          };
        })(this),
        'replace': (function(_this) {
          return function(e) {
            return new Operators.Replace(_this.editorView, _this);
          };
        })(this),
        'search': (function(_this) {
          return function(e) {
            return new Motions.Search(_this.editorView, _this);
          };
        })(this),
        'reverse-search': (function(_this) {
          return function(e) {
            return (new Motions.Search(_this.editorView, _this)).reversed();
          };
        })(this),
        'search-current-word': (function(_this) {
          return function(e) {
            return new Motions.SearchCurrentWord(_this.editorView, _this);
          };
        })(this),
        'reverse-search-current-word': (function(_this) {
          return function(e) {
            return (new Motions.SearchCurrentWord(_this.editorView, _this)).reversed();
          };
        })(this)
      });
    };

    VimState.prototype.registerCommands = function(commands) {
      var commandName, fn, _results;
      _results = [];
      for (commandName in commands) {
        fn = commands[commandName];
        _results.push((function(_this) {
          return function(fn) {
            return _this.editorView.command("vim-mode:" + commandName, fn);
          };
        })(this)(fn));
      }
      return _results;
    };

    VimState.prototype.registerOperationCommands = function(operationCommands) {
      var commandName, commands, operationFn, _fn;
      commands = {};
      _fn = (function(_this) {
        return function(operationFn) {
          return commands[commandName] = function(event) {
            return _this.pushOperations(operationFn(event));
          };
        };
      })(this);
      for (commandName in operationCommands) {
        operationFn = operationCommands[commandName];
        _fn(operationFn);
      }
      return this.registerCommands(commands);
    };

    VimState.prototype.pushOperations = function(operations) {
      var operation, topOp, _i, _len, _results;
      if (operations == null) {
        return;
      }
      if (!_.isArray(operations)) {
        operations = [operations];
      }
      _results = [];
      for (_i = 0, _len = operations.length; _i < _len; _i++) {
        operation = operations[_i];
        if (this.mode === 'visual' && (operation instanceof Motions.Motion || operation instanceof TextObjects.TextObject)) {
          operation.execute = operation.select;
        }
        if (((topOp = this.topOperation()) != null) && (topOp.canComposeWith != null) && !topOp.canComposeWith(operation)) {
          this.editorView.trigger('vim-mode:compose-failure');
          this.resetCommandMode();
          break;
        }
        this.opStack.push(operation);
        if (this.mode === 'visual' && operation instanceof Operators.Operator) {
          this.opStack.push(new Motions.CurrentSelection(this));
        }
        _results.push(this.processOpStack());
      }
      return _results;
    };

    VimState.prototype.clearOpStack = function() {
      return this.opStack = [];
    };

    VimState.prototype.processOpStack = function() {
      var e, poppedOperation;
      if (!(this.opStack.length > 0)) {
        return;
      }
      if (!this.topOperation().isComplete()) {
        if (this.mode === 'command' && this.topOperation() instanceof Operators.Operator) {
          this.activateOperatorPendingMode();
        }
        return;
      }
      poppedOperation = this.opStack.pop();
      if (this.opStack.length) {
        try {
          this.topOperation().compose(poppedOperation);
          return this.processOpStack();
        } catch (_error) {
          e = _error;
          return ((e instanceof Operators.OperatorError) || (e instanceof Motions.MotionError)) && this.resetCommandMode() || (function() {
            throw e;
          })();
        }
      } else {
        if (poppedOperation.isRecordable()) {
          this.history.unshift(poppedOperation);
        }
        return poppedOperation.execute();
      }
    };

    VimState.prototype.topOperation = function() {
      return _.last(this.opStack);
    };

    VimState.prototype.getRegister = function(name) {
      var text, type;
      if (name === '*' || name === '+') {
        text = atom.clipboard.read();
        type = Utils.copyType(text);
        return {
          text: text,
          type: type
        };
      } else if (name === '%') {
        text = this.editor.getUri();
        type = Utils.copyType(text);
        return {
          text: text,
          type: type
        };
      } else if (name === "_") {
        text = '';
        type = Utils.copyType(text);
        return {
          text: text,
          type: type
        };
      } else {
        return atom.workspace.vimState.registers[name];
      }
    };

    VimState.prototype.getMark = function(name) {
      return this.marks[name];
    };

    VimState.prototype.setRegister = function(name, value) {
      if (name === '*' || name === '+') {
        return atom.clipboard.write(value.text);
      } else if (name === '_') {

      } else {
        return atom.workspace.vimState.registers[name] = value;
      }
    };

    VimState.prototype.setMark = function(name, pos) {
      var charCode;
      if ((charCode = name.charCodeAt(0)) >= 97 && charCode <= 122) {
        return this.marks[name] = pos;
      }
    };

    VimState.prototype.pushSearchHistory = function(search) {
      return atom.workspace.vimState.searchHistory.unshift(search);
    };

    VimState.prototype.getSearchHistoryItem = function(index) {
      return atom.workspace.vimState.searchHistory[index];
    };

    VimState.prototype.activateCommandMode = function() {
      var cursor;
      this.mode = 'command';
      this.submode = null;
      if (this.editorView.is(".insert-mode")) {
        cursor = this.editor.getCursor();
        if (!cursor.isAtBeginningOfLine()) {
          cursor.moveLeft();
        }
      }
      this.changeModeClass('command-mode');
      this.clearOpStack();
      this.editor.clearSelections();
      return this.updateStatusBar();
    };

    VimState.prototype.activateInsertMode = function() {
      this.mode = 'insert';
      this.submode = null;
      this.changeModeClass('insert-mode');
      return this.updateStatusBar();
    };

    VimState.prototype.activateVisualMode = function(type) {
      this.mode = 'visual';
      this.submode = type;
      this.changeModeClass('visual-mode');
      if (this.submode === 'linewise') {
        this.editor.selectLine();
      }
      return this.updateStatusBar();
    };

    VimState.prototype.activateOperatorPendingMode = function() {
      this.mode = 'operator-pending';
      this.submodule = null;
      this.changeModeClass('operator-pending-mode');
      return this.updateStatusBar();
    };

    VimState.prototype.changeModeClass = function(targetMode) {
      var mode, _i, _len, _ref, _results;
      _ref = ['command-mode', 'insert-mode', 'visual-mode', 'operator-pending-mode'];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        mode = _ref[_i];
        if (mode === targetMode) {
          _results.push(this.editorView.addClass(mode));
        } else {
          _results.push(this.editorView.removeClass(mode));
        }
      }
      return _results;
    };

    VimState.prototype.resetCommandMode = function() {
      return this.activateCommandMode();
    };

    VimState.prototype.registerPrefix = function(e) {
      var name;
      name = atom.keymap.keystrokeStringForEvent(e.originalEvent);
      return new Prefixes.Register(name);
    };

    VimState.prototype.repeatPrefix = function(e) {
      var num;
      num = parseInt(atom.keymap.keystrokeStringForEvent(e.originalEvent));
      if (this.topOperation() instanceof Prefixes.Repeat) {
        return this.topOperation().addDigit(num);
      } else {
        if (num === 0) {
          return e.abortKeyBinding();
        } else {
          return this.pushOperations(new Prefixes.Repeat(num));
        }
      }
    };

    VimState.prototype.moveOrRepeat = function(e) {
      if (this.topOperation() instanceof Prefixes.Repeat) {
        return this.repeatPrefix(e);
      } else {
        return new Motions.MoveToBeginningOfLine(this.editor);
      }
    };

    VimState.prototype.linewiseAliasedOperator = function(constructor) {
      if (this.isOperatorPending(constructor)) {
        return new Motions.MoveToLine(this.editor);
      } else {
        return new constructor(this.editor, this);
      }
    };

    VimState.prototype.isOperatorPending = function(constructor) {
      var op, _i, _len, _ref;
      _ref = this.opStack;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        op = _ref[_i];
        if (op instanceof constructor) {
          return op;
        }
      }
      return false;
    };

    VimState.prototype.updateStatusBar = function() {
      if (!$('#status-bar-vim-mode').length) {
        atom.packages.once('activated', function() {
          var _ref;
          return (_ref = atom.workspaceView.statusBar) != null ? _ref.prependRight("<div id='status-bar-vim-mode' class='inline-block'>Command</div>") : void 0;
        });
      }
      if (this.mode === "insert") {
        return $('#status-bar-vim-mode').html("Insert");
      } else if (this.mode === "command") {
        return $('#status-bar-vim-mode').html("Command");
      } else if (this.mode === "visual") {
        return $('#status-bar-vim-mode').html("Visual");
      }
    };

    return VimState;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlGQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQyxJQUFLLE9BQUEsQ0FBUSxNQUFSLEVBQUwsQ0FERCxDQUFBOztBQUFBLEVBR0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxtQkFBUixDQUhaLENBQUE7O0FBQUEsRUFJQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVIsQ0FKWCxDQUFBOztBQUFBLEVBS0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSLENBTFgsQ0FBQTs7QUFBQSxFQU1BLE9BQUEsR0FBVSxPQUFBLENBQVEsaUJBQVIsQ0FOVixDQUFBOztBQUFBLEVBT0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQVBkLENBQUE7O0FBQUEsRUFRQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVIsQ0FSUixDQUFBOztBQUFBLEVBU0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSLENBVFIsQ0FBQTs7QUFBQSxFQVVBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQVZULENBQUE7O0FBQUEsRUFZQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osdUJBQUEsTUFBQSxHQUFRLElBQVIsQ0FBQTs7QUFBQSx1QkFDQSxPQUFBLEdBQVMsSUFEVCxDQUFBOztBQUFBLHVCQUVBLElBQUEsR0FBTSxJQUZOLENBQUE7O0FBQUEsdUJBR0EsT0FBQSxHQUFTLElBSFQsQ0FBQTs7QUFLYSxJQUFBLGtCQUFFLFVBQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLGFBQUEsVUFDYixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxVQUFVLENBQUMsTUFBdEIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQUQs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
//# sourceURL=/Users/mark/.atom/packages/vim-mode/lib/vim-state.coffee
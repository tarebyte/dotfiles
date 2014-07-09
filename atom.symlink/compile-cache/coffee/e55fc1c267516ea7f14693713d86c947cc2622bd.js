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
            return _this.editorView.command("vim-mode:" + commandName + ".vim-mode", fn);
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
      if ((charCode = name.charCodeAt(0)) >= 96 && charCode <= 122) {
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
        this.repeatPrefix(e);
        return null;
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
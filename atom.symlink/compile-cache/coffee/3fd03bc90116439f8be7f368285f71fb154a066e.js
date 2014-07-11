(function() {
  var $, $$, Marker, Motions, Operators, Panes, Point, Prefixes, Range, Scroll, TextObjects, Utils, VimState, _, _ref;

  _ = require('underscore-plus');

  $ = require('atom').$;

  Operators = require('./operators/index');

  Prefixes = require('./prefixes');

  Motions = require('./motions/index');

  TextObjects = require('./text-objects');

  Utils = require('./utils');

  Panes = require('./panes');

  Scroll = require('./scroll');

  _ref = require('atom'), $$ = _ref.$$, Point = _ref.Point, Range = _ref.Range;

  Marker = require('atom');

  module.exports = VimState = (function() {
    VimState.prototype.editor = null;

    VimState.prototype.opStack = null;

    VimState.prototype.mode = null;

    VimState.prototype.submode = null;

    function VimState(editorView) {
      var params, _base;
      this.editorView = editorView;
      this.editor = this.editorView.editor;
      this.opStack = [];
      this.history = [];
      this.marks = {};
      this.desiredCursorColumn = null;
      params = {};
      params.manager = this;
      params.id = 0;
      this.setupCommandMode();
      if (typeof (_base = this.editorView).setInputEnabled === "function") {
        _base.setInputEnabled(false);
      }
      this.registerInsertIntercept();
      this.registerInsertTransactionResets();
      this.registerUndoIntercept();
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

    VimState.prototype.registerUndoIntercept = function() {
      return this.editorView.preempt('core:undo', (function(_this) {
        return function(e) {
          if (_this.mode !== 'insert') {
            return true;
          }
          _this.activateCommandMode();
          return true;
        };
      })(this));
    };

    VimState.prototype.registerInsertTransactionResets = function() {
      var events;
      events = ['core:move-up', 'core:move-down', 'core:move-right', 'core:move-left'];
      return this.editorView.on(events.join(' '), (function(_this) {
        return function() {
          return _this.resetInputTransactions();
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
        'activate-insert-mode': (function(_this) {
          return function() {
            return new Operators.Insert(_this.editor, _this);
          };
        })(this),
        'substitute': (function(_this) {
          return function() {
            return new Operators.Substitute(_this.editor, _this);
          };
        })(this),
        'substitute-line': (function(_this) {
          return function() {
            return new Operators.SubstituteLine(_this.editor, _this);
          };
        })(this),
        'insert-after': (function(_this) {
          return function() {
            return new Operators.InsertAfter(_this.editor, _this);
          };
        })(this),
        'insert-after-end-of-line': (function(_this) {
          return function() {
            return [new Motions.MoveToLastCharacterOfLine(_this.editor, _this), new Operators.InsertAfter(_this.editor, _this)];
          };
        })(this),
        'insert-at-beginning-of-line': (function(_this) {
          return function() {
            return [new Motions.MoveToFirstCharacterOfLine(_this.editor, _this), new Operators.Insert(_this.editor, _this)];
          };
        })(this),
        'insert-above-with-newline': (function(_this) {
          return function() {
            return new Operators.InsertAboveWithNewline(_this.editor, _this);
          };
        })(this),
        'insert-below-with-newline': (function(_this) {
          return function() {
            return new Operators.InsertBelowWithNewline(_this.editor, _this);
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
            return [new Operators.Change(_this.editor, _this), new Motions.MoveToLastCharacterOfLine(_this.editor, _this)];
          };
        })(this),
        'delete-right': (function(_this) {
          return function() {
            return [new Operators.Delete(_this.editor, _this), new Motions.MoveRight(_this.editor, _this)];
          };
        })(this),
        'delete-left': (function(_this) {
          return function() {
            return [new Operators.Delete(_this.editor, _this), new Motions.MoveLeft(_this.editor, _this)];
          };
        })(this),
        'delete-to-last-character-of-line': (function(_this) {
          return function() {
            return [new Operators.Delete(_this.editor, _this), new Motions.MoveToLastCharacterOfLine(_this.editor, _this)];
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
            return [new Operators.Yank(_this.editor, _this), new Motions.MoveToLine(_this.editor, _this)];
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
            return new Motions.MoveLeft(_this.editor, _this);
          };
        })(this),
        'move-up': (function(_this) {
          return function() {
            return new Motions.MoveUp(_this.editor, _this);
          };
        })(this),
        'move-down': (function(_this) {
          return function() {
            return new Motions.MoveDown(_this.editor, _this);
          };
        })(this),
        'move-right': (function(_this) {
          return function() {
            return new Motions.MoveRight(_this.editor, _this);
          };
        })(this),
        'move-to-next-word': (function(_this) {
          return function() {
            return new Motions.MoveToNextWord(_this.editor, _this);
          };
        })(this),
        'move-to-next-whole-word': (function(_this) {
          return function() {
            return new Motions.MoveToNextWholeWord(_this.editor, _this);
          };
        })(this),
        'move-to-end-of-word': (function(_this) {
          return function() {
            return new Motions.MoveToEndOfWord(_this.editor, _this);
          };
        })(this),
        'move-to-end-of-whole-word': (function(_this) {
          return function() {
            return new Motions.MoveToEndOfWholeWord(_this.editor, _this);
          };
        })(this),
        'move-to-previous-word': (function(_this) {
          return function() {
            return new Motions.MoveToPreviousWord(_this.editor, _this);
          };
        })(this),
        'move-to-previous-whole-word': (function(_this) {
          return function() {
            return new Motions.MoveToPreviousWholeWord(_this.editor, _this);
          };
        })(this),
        'move-to-next-paragraph': (function(_this) {
          return function() {
            return new Motions.MoveToNextParagraph(_this.editor, _this);
          };
        })(this),
        'move-to-previous-paragraph': (function(_this) {
          return function() {
            return new Motions.MoveToPreviousParagraph(_this.editor, _this);
          };
        })(this),
        'move-to-first-character-of-line': (function(_this) {
          return function() {
            return new Motions.MoveToFirstCharacterOfLine(_this.editor, _this);
          };
        })(this),
        'move-to-last-character-of-line': (function(_this) {
          return function() {
            return new Motions.MoveToLastCharacterOfLine(_this.editor, _this);
          };
        })(this),
        'move-to-beginning-of-line': (function(_this) {
          return function(e) {
            return _this.moveOrRepeat(e);
          };
        })(this),
        'move-to-first-character-of-line-up': (function(_this) {
          return function() {
            return new Motions.MoveToFirstCharacterOfLineUp(_this.editor, _this);
          };
        })(this),
        'move-to-first-character-of-line-down': (function(_this) {
          return function() {
            return new Motions.MoveToFirstCharacterOfLineDown(_this.editor, _this);
          };
        })(this),
        'move-to-start-of-file': (function(_this) {
          return function() {
            return new Motions.MoveToStartOfFile(_this.editor, _this);
          };
        })(this),
        'move-to-line': (function(_this) {
          return function() {
            return new Motions.MoveToLine(_this.editor, _this);
          };
        })(this),
        'move-to-top-of-screen': (function(_this) {
          return function() {
            return new Motions.MoveToTopOfScreen(_this.editor, _this, _this.editorView);
          };
        })(this),
        'move-to-bottom-of-screen': (function(_this) {
          return function() {
            return new Motions.MoveToBottomOfScreen(_this.editor, _this, _this.editorView);
          };
        })(this),
        'move-to-middle-of-screen': (function(_this) {
          return function() {
            return new Motions.MoveToMiddleOfScreen(_this.editor, _this, _this.editorView);
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
        'select-inside-double-quotes': (function(_this) {
          return function() {
            return new TextObjects.SelectInsideQuotes(_this.editor, '"');
          };
        })(this),
        'select-inside-single-quotes': (function(_this) {
          return function() {
            return new TextObjects.SelectInsideQuotes(_this.editor, '\'');
          };
        })(this),
        'select-inside-curly-brackets': (function(_this) {
          return function() {
            return new TextObjects.SelectInsideBrackets(_this.editor, '{', '}');
          };
        })(this),
        'select-inside-angle-brackets': (function(_this) {
          return function() {
            return new TextObjects.SelectInsideBrackets(_this.editor, '<', '>');
          };
        })(this),
        'select-inside-parentheses': (function(_this) {
          return function() {
            return new TextObjects.SelectInsideBrackets(_this.editor, '(', ')');
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
        'bracket-matching-motion': (function(_this) {
          return function(e) {
            return new Motions.BracketMatchingMotion(_this.editorView, _this);
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
          this.opStack.push(new Motions.CurrentSelection(this.editor, this));
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
      if (this.marks[name]) {
        return this.marks[name].getBufferRange().start;
      } else {
        return void 0;
      }
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
      var charCode, marker;
      if ((charCode = name.charCodeAt(0)) >= 96 && charCode <= 122) {
        marker = this.editor.markBufferRange(new Range(pos, pos), {
          invalidate: 'never',
          persistent: false
        });
        return this.marks[name] = marker;
      }
    };

    VimState.prototype.pushSearchHistory = function(search) {
      return atom.workspace.vimState.searchHistory.unshift(search);
    };

    VimState.prototype.getSearchHistoryItem = function(index) {
      return atom.workspace.vimState.searchHistory[index];
    };

    VimState.prototype.resetInputTransactions = function() {
      var _ref1;
      if (!(this.mode === 'insert' && ((_ref1 = this.history[0]) != null ? typeof _ref1.inputOperator === "function" ? _ref1.inputOperator() : void 0 : void 0))) {
        return;
      }
      this.deactivateInsertMode();
      return this.activateInsertMode();
    };

    VimState.prototype.activateCommandMode = function() {
      var cursor;
      this.deactivateInsertMode();
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

    VimState.prototype.activateInsertMode = function(transactionStarted) {
      var _base;
      if (transactionStarted == null) {
        transactionStarted = false;
      }
      this.mode = 'insert';
      if (typeof (_base = this.editorView).setInputEnabled === "function") {
        _base.setInputEnabled(true);
      }
      if (!transactionStarted) {
        this.editor.beginTransaction();
      }
      this.submode = null;
      this.changeModeClass('insert-mode');
      return this.updateStatusBar();
    };

    VimState.prototype.deactivateInsertMode = function() {
      var item, transaction, _base;
      if (this.mode !== 'insert') {
        return;
      }
      if (typeof (_base = this.editorView).setInputEnabled === "function") {
        _base.setInputEnabled(false);
      }
      this.editor.commitTransaction();
      transaction = _.last(this.editor.buffer.history.undoStack);
      item = this.inputOperator(this.history[0]);
      if ((item != null) && (transaction != null)) {
        return item.confirmTransaction(transaction);
      }
    };

    VimState.prototype.inputOperator = function(item) {
      var _ref1;
      if (item == null) {
        return item;
      }
      if (typeof item.inputOperator === "function" ? item.inputOperator() : void 0) {
        return item;
      }
      if ((_ref1 = item.composedObject) != null ? typeof _ref1.inputOperator === "function" ? _ref1.inputOperator() : void 0 : void 0) {
        return item.composedObject;
      }
    };

    VimState.prototype.activateVisualMode = function(type) {
      this.deactivateInsertMode();
      this.mode = 'visual';
      this.submode = type;
      this.changeModeClass('visual-mode');
      if (this.submode === 'linewise') {
        this.editor.selectLine();
      }
      return this.updateStatusBar();
    };

    VimState.prototype.activateOperatorPendingMode = function() {
      this.deactivateInsertMode();
      this.mode = 'operator-pending';
      this.submodule = null;
      this.changeModeClass('operator-pending-mode');
      return this.updateStatusBar();
    };

    VimState.prototype.changeModeClass = function(targetMode) {
      var mode, _i, _len, _ref1, _results;
      _ref1 = ['command-mode', 'insert-mode', 'visual-mode', 'operator-pending-mode'];
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        mode = _ref1[_i];
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
        return new Motions.MoveToBeginningOfLine(this.editor, this);
      }
    };

    VimState.prototype.linewiseAliasedOperator = function(constructor) {
      if (this.isOperatorPending(constructor)) {
        return new Motions.MoveToLine(this.editor, this);
      } else {
        return new constructor(this.editor, this);
      }
    };

    VimState.prototype.isOperatorPending = function(constructor) {
      var op, _i, _len, _ref1;
      if (constructor != null) {
        _ref1 = this.opStack;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          op = _ref1[_i];
          if (op instanceof constructor) {
            return op;
          }
        }
        return false;
      } else {
        return this.opStack.length > 0;
      }
    };

    VimState.prototype.updateStatusBar = function() {
      atom.packages.once('activated', (function(_this) {
        return function() {
          var _ref1;
          if (!$('#status-bar-vim-mode').length) {
            if ((_ref1 = atom.workspaceView.statusBar) != null) {
              _ref1.prependRight("<div id='status-bar-vim-mode' class='inline-block'>Command</div>");
            }
            return _this.updateStatusBar();
          }
        };
      })(this));
      this.removeStatusBarClass();
      switch (this.mode) {
        case 'insert':
          return $('#status-bar-vim-mode').addClass('status-bar-vim-mode-insert').html("Insert");
        case 'command':
          return $('#status-bar-vim-mode').addClass('status-bar-vim-mode-command').html("Command");
        case 'visual':
          return $('#status-bar-vim-mode').addClass('status-bar-vim-mode-visual').html("Visual");
      }
    };

    VimState.prototype.removeStatusBarClass = function() {
      return $('#status-bar-vim-mode').removeClass('status-bar-vim-mode-insert status-bar-vim-mode-command status-bar-vim-mode-visual');
    };

    return VimState;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtHQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQyxJQUFLLE9BQUEsQ0FBUSxNQUFSLEVBQUwsQ0FERCxDQUFBOztBQUFBLEVBR0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxtQkFBUixDQUhaLENBQUE7O0FBQUEsRUFJQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVIsQ0FKWCxDQUFBOztBQUFBLEVBS0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxpQkFBUixDQUxWLENBQUE7O0FBQUEsRUFPQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBUGQsQ0FBQTs7QUFBQSxFQVFBLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUixDQVJSLENBQUE7O0FBQUEsRUFTQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVIsQ0FUUixDQUFBOztBQUFBLEVBVUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBVlQsQ0FBQTs7QUFBQSxFQVdBLE9BQXFCLE9BQUEsQ0FBUSxNQUFSLENBQXJCLEVBQUMsVUFBQSxFQUFELEVBQUssYUFBQSxLQUFMLEVBQVksYUFBQSxLQVhaLENBQUE7O0FBQUEsRUFZQSxNQUFBLEdBQVMsT0FBQSxDQUFRLE1BQVIsQ0FaVCxDQUFBOztBQUFBLEVBY0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHVCQUFBLE1BQUEsR0FBUSxJQUFSLENBQUE7O0FBQUEsdUJBQ0EsT0FBQSxHQUFTLElBRFQsQ0FBQTs7QUFBQSx1QkFFQSxJQUFBLEdBQU0sSUFGTixDQUFBOztBQUFBLHVCQUdBLE9BQUEsR0FBUyxJQUhULENBQUE7O0FBS2EsSUFBQSxrQkFBRSxVQUFGLEdBQUE7QUFDWCxVQUFBLGFBQUE7QUFBQSxNQURZLElBQUMsQ0FB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
//# sourceURL=/Users/mark/src/tarebyte/dotfiles/atom.symlink/packages/vim-mode/lib/vim-state.coffee
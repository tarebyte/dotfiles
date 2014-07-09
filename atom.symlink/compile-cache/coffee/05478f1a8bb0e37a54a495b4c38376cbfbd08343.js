(function() {
  var $, VimState, commands, motions, operators, panes, prefixes, scroll, utils, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore-plus');

  $ = require('atom').$;

  operators = require('./operators');

  prefixes = require('./prefixes');

  commands = require('./commands');

  motions = require('./motions');

  utils = require('./utils');

  panes = require('./panes');

  scroll = require('./scroll');

  module.exports = VimState = (function() {
    VimState.prototype.editor = null;

    VimState.prototype.opStack = null;

    VimState.prototype.mode = null;

    VimState.prototype.submode = null;

    function VimState(editorView) {
      this.editorView = editorView;
      this.moveCursorBeforeNewline = __bind(this.moveCursorBeforeNewline, this);
      this.editor = this.editorView.editor;
      this.opStack = [];
      this.history = [];
      this.mode = 'command';
      this.setupCommandMode();
      this.registerInsertIntercept();
      this.activateCommandMode();
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
              type: utils.copyType(oldText)
            });
          }
        };
      })(this));
    };

    VimState.prototype.setupCommandMode = function() {
      this.editorView.command('vim-mode:search', (function(_this) {
        return function() {
          return _this.currentSearch = new motions.Search(_this.editorView, _this);
        };
      })(this));
      this.editorView.command('vim-mode:reverse-search', (function(_this) {
        return function() {
          _this.currentSearch = new motions.Search(_this.editorView, _this);
          return _this.currentSearch.reversed();
        };
      })(this));
      this.editorView.command('vim-mode:replace', (function(_this) {
        return function() {
          return _this.currentReplace = new operators.Replace(_this.editorView, _this);
        };
      })(this));
      return this.handleCommands({
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
        'substitute': (function(_this) {
          return function() {
            return new commands.Substitute(_this.editor, _this);
          };
        })(this),
        'substitute-line': (function(_this) {
          return function() {
            return new commands.SubstituteLine(_this.editor, _this);
          };
        })(this),
        'insert-after': (function(_this) {
          return function() {
            return new commands.InsertAfter(_this.editor, _this);
          };
        })(this),
        'insert-after-eol': (function(_this) {
          return function() {
            return [new motions.MoveToLastCharacterOfLine(_this.editor), new commands.InsertAfter(_this.editor, _this)];
          };
        })(this),
        'insert-at-bol': (function(_this) {
          return function() {
            return [new motions.MoveToFirstCharacterOfLine(_this.editor), new commands.Insert(_this.editor, _this)];
          };
        })(this),
        'insert-above-with-newline': (function(_this) {
          return function() {
            return new commands.InsertAboveWithNewline(_this.editor, _this);
          };
        })(this),
        'insert-below-with-newline': (function(_this) {
          return function() {
            return new commands.InsertBelowWithNewline(_this.editor, _this);
          };
        })(this),
        'delete': (function(_this) {
          return function() {
            return _this.linewiseAliasedOperator(operators.Delete);
          };
        })(this),
        'change': (function(_this) {
          return function() {
            return _this.linewiseAliasedOperator(operators.Change);
          };
        })(this),
        'change-to-last-character-of-line': (function(_this) {
          return function() {
            return [new operators.Change(_this.editor, _this), new motions.MoveToLastCharacterOfLine(_this.editor)];
          };
        })(this),
        'delete-right': (function(_this) {
          return function() {
            return [new operators.Delete(_this.editor), new motions.MoveRight(_this.editor)];
          };
        })(this),
        'delete-left': (function(_this) {
          return function() {
            return [new operators.Delete(_this.editor), new motions.MoveLeft(_this.editor)];
          };
        })(this),
        'delete-to-last-character-of-line': (function(_this) {
          return function() {
            return [new operators.Delete(_this.editor), new motions.MoveToLastCharacterOfLine(_this.editor)];
          };
        })(this),
        'yank': (function(_this) {
          return function() {
            return _this.linewiseAliasedOperator(operators.Yank);
          };
        })(this),
        'yank-line': (function(_this) {
          return function() {
            return [new operators.Yank(_this.editor, _this), new motions.MoveToLine(_this.editor)];
          };
        })(this),
        'put-before': (function(_this) {
          return function() {
            return new operators.Put(_this.editor, _this, {
              location: 'before'
            });
          };
        })(this),
        'put-after': (function(_this) {
          return function() {
            return new operators.Put(_this.editor, _this, {
              location: 'after'
            });
          };
        })(this),
        'join': (function(_this) {
          return function() {
            return new operators.Join(_this.editor);
          };
        })(this),
        'indent': (function(_this) {
          return function() {
            return _this.linewiseAliasedOperator(operators.Indent);
          };
        })(this),
        'outdent': (function(_this) {
          return function() {
            return _this.linewiseAliasedOperator(operators.Outdent);
          };
        })(this),
        'auto-indent': (function(_this) {
          return function() {
            return _this.linewiseAliasedOperator(operators.Autoindent);
          };
        })(this),
        'select-left': (function(_this) {
          return function() {
            return new motions.SelectLeft(_this.editor);
          };
        })(this),
        'select-right': (function(_this) {
          return function() {
            return new motions.SelectRight(_this.editor);
          };
        })(this),
        'move-left': (function(_this) {
          return function() {
            return new motions.MoveLeft(_this.editor);
          };
        })(this),
        'move-up': (function(_this) {
          return function() {
            return new motions.MoveUp(_this.editor);
          };
        })(this),
        'move-down': (function(_this) {
          return function() {
            return new motions.MoveDown(_this.editor);
          };
        })(this),
        'move-right': (function(_this) {
          return function() {
            return new motions.MoveRight(_this.editor);
          };
        })(this),
        'move-to-next-word': (function(_this) {
          return function() {
            return new motions.MoveToNextWord(_this.editor);
          };
        })(this),
        'move-to-next-whole-word': (function(_this) {
          return function() {
            return new motions.MoveToNextWholeWord(_this.editor);
          };
        })(this),
        'move-to-end-of-word': (function(_this) {
          return function() {
            return new motions.MoveToEndOfWord(_this.editor);
          };
        })(this),
        'move-to-end-of-whole-word': (function(_this) {
          return function() {
            return new motions.MoveToEndOfWholeWord(_this.editor);
          };
        })(this),
        'move-to-previous-word': (function(_this) {
          return function() {
            return new motions.MoveToPreviousWord(_this.editor);
          };
        })(this),
        'move-to-previous-whole-word': (function(_this) {
          return function() {
            return new motions.MoveToPreviousWholeWord(_this.editor);
          };
        })(this),
        'move-to-next-paragraph': (function(_this) {
          return function() {
            return new motions.MoveToNextParagraph(_this.editor);
          };
        })(this),
        'move-to-previous-paragraph': (function(_this) {
          return function() {
            return new motions.MoveToPreviousParagraph(_this.editor);
          };
        })(this),
        'move-to-first-character-of-line': (function(_this) {
          return function() {
            return new motions.MoveToFirstCharacterOfLine(_this.editor);
          };
        })(this),
        'move-to-last-character-of-line': (function(_this) {
          return function() {
            return new motions.MoveToLastCharacterOfLine(_this.editor);
          };
        })(this),
        'move-to-beginning-of-line': (function(_this) {
          return function(e) {
            return _this.moveOrRepeat(e);
          };
        })(this),
        'move-to-start-of-file': (function(_this) {
          return function() {
            return new motions.MoveToStartOfFile(_this.editor);
          };
        })(this),
        'move-to-line': (function(_this) {
          return function() {
            return new motions.MoveToLine(_this.editor);
          };
        })(this),
        'move-to-top-of-screen': (function(_this) {
          return function() {
            return new motions.MoveToTopOfScreen(_this.editor, _this.editorView);
          };
        })(this),
        'move-to-bottom-of-screen': (function(_this) {
          return function() {
            return new motions.MoveToBottomOfScreen(_this.editor, _this.editorView);
          };
        })(this),
        'move-to-middle-of-screen': (function(_this) {
          return function() {
            return new motions.MoveToMiddleOfScreen(_this.editor, _this.editorView);
          };
        })(this),
        'scroll-down': (function(_this) {
          return function() {
            return new scroll.ScrollDown(_this.editorView, _this.editor);
          };
        })(this),
        'scroll-up': (function(_this) {
          return function() {
            return new scroll.ScrollUp(_this.editorView, _this.editor);
          };
        })(this),
        'register-prefix': (function(_this) {
          return function(e) {
            return _this.registerPrefix(e);
          };
        })(this),
        'repeat-prefix': (function(_this) {
          return function(e) {
            return _this.repeatPrefix(e);
          };
        })(this),
        'repeat': (function(_this) {
          return function(e) {
            return new operators.Repeat(_this.editor, _this);
          };
        })(this),
        'search-complete': (function(_this) {
          return function(e) {
            return _this.currentSearch;
          };
        })(this),
        'replace-complete': (function(_this) {
          return function(e) {
            return _this.currentReplace;
          };
        })(this),
        'repeat-search': (function(_this) {
          return function(e) {
            if (_this.currentSearch != null) {
              return _this.currentSearch.repeat();
            }
          };
        })(this),
        'repeat-search-backwards': (function(_this) {
          return function(e) {
            if (_this.currentSearch != null) {
              return _this.currentSearch.repeat({
                backwards: true
              });
            }
          };
        })(this),
        'focus-pane-view-on-left': (function(_this) {
          return function() {
            return new panes.FocusPaneViewOnLeft();
          };
        })(this),
        'focus-pane-view-on-right': (function(_this) {
          return function() {
            return new panes.FocusPaneViewOnRight();
          };
        })(this),
        'focus-pane-view-above': (function(_this) {
          return function() {
            return new panes.FocusPaneViewAbove();
          };
        })(this),
        'focus-pane-view-below': (function(_this) {
          return function() {
            return new panes.FocusPaneViewBelow();
          };
        })(this),
        'focus-previous-pane-view': (function(_this) {
          return function() {
            return new panes.FocusPreviousPaneView();
          };
        })(this)
      });
    };

    VimState.prototype.handleCommands = function(commands) {
      return _.each(commands, (function(_this) {
        return function(fn, commandName) {
          var eventName;
          eventName = "vim-mode:" + commandName;
          return _this.editorView.command(eventName, function(e) {
            var possibleOperator, possibleOperators, _i, _len, _results;
            possibleOperators = fn(e);
            possibleOperators = _.isArray(possibleOperators) ? possibleOperators : [possibleOperators];
            _results = [];
            for (_i = 0, _len = possibleOperators.length; _i < _len; _i++) {
              possibleOperator = possibleOperators[_i];
              if (_this.mode === 'visual' && possibleOperator instanceof motions.Motion) {
                possibleOperator.origExecute = possibleOperator.execute;
                possibleOperator.execute = possibleOperator.select;
              }
              if (possibleOperator != null ? possibleOperator.execute : void 0) {
                _this.pushOperator(possibleOperator);
              }
              if (_this.mode === 'visual' && possibleOperator instanceof operators.Operator) {
                _this.pushOperator(new motions.CurrentSelection(_this));
                if (_this.mode === 'visual') {
                  _results.push(_this.activateCommandMode());
                } else {
                  _results.push(void 0);
                }
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          });
        };
      })(this));
    };

    VimState.prototype.moveCursorBeforeNewline = function() {
      if (!this.editor.getSelection().modifyingSelection && this.editor.cursor.isOnEOL() && this.editor.getCurrentBufferLine().length > 0) {
        return this.editor.setCursorBufferColumn(this.editor.getCurrentBufferLine().length - 1);
      }
    };

    VimState.prototype.pushOperator = function(operation) {
      this.opStack.push(operation);
      return this.processOpStack();
    };

    VimState.prototype.clearOpStack = function() {
      return this.opStack = [];
    };

    VimState.prototype.processOpStack = function() {
      var e, poppedOperator;
      if (!this.topOperator().isComplete()) {
        return;
      }
      poppedOperator = this.opStack.pop();
      if (this.opStack.length) {
        try {
          this.topOperator().compose(poppedOperator);
          return this.processOpStack();
        } catch (_error) {
          e = _error;
          return (e instanceof operators.OperatorError) && this.resetCommandMode() || (function() {
            throw e;
          })();
        }
      } else {
        if (poppedOperator.isRecordable()) {
          this.history.unshift(poppedOperator);
        }
        return poppedOperator.execute();
      }
    };

    VimState.prototype.topOperator = function() {
      return _.last(this.opStack);
    };

    VimState.prototype.getRegister = function(name) {
      var text, type;
      if (name === '*' || name === '+') {
        text = atom.clipboard.read();
        type = utils.copyType(text);
        return {
          text: text,
          type: type
        };
      } else if (name === '%') {
        text = this.editor.getUri();
        type = utils.copyType(text);
        return {
          text: text,
          type: type
        };
      } else if (name === "_") {
        text = '';
        type = utils.copyType(text);
        return {
          text: text,
          type: type
        };
      } else {
        return atom.workspace.vimState.registers[name];
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
      this.editorView.removeClass('insert-mode visual-mode');
      this.editorView.addClass('command-mode');
      this.editor.clearSelections();
      return this.editorView.on('cursor:position-changed', this.moveCursorBeforeNewline);
    };

    VimState.prototype.activateInsertMode = function() {
      this.mode = 'insert';
      this.submode = null;
      this.editorView.removeClass('command-mode visual-mode');
      this.editorView.addClass('insert-mode');
      return this.editorView.off('cursor:position-changed', this.moveCursorBeforeNewline);
    };

    VimState.prototype.activateVisualMode = function(type) {
      this.mode = 'visual';
      this.submode = type;
      this.editorView.removeClass('command-mode insert-mode');
      this.editorView.addClass('visual-mode');
      this.editor.off('cursor:position-changed', this.moveCursorBeforeNewline);
      if (this.submode === 'linewise') {
        return this.editor.selectLine();
      }
    };

    VimState.prototype.resetCommandMode = function() {
      return this.clearOpStack();
    };

    VimState.prototype.registerPrefix = function(e) {
      var name;
      name = atom.keymap.keystrokeStringForEvent(e.originalEvent);
      return this.pushOperator(new prefixes.Register(name));
    };

    VimState.prototype.repeatPrefix = function(e) {
      var num;
      num = parseInt(atom.keymap.keystrokeStringForEvent(e.originalEvent));
      if (this.topOperator() instanceof prefixes.Repeat) {
        return this.topOperator().addDigit(num);
      } else {
        return this.pushOperator(new prefixes.Repeat(num));
      }
    };

    VimState.prototype.moveOrRepeat = function(e) {
      if (this.topOperator() instanceof prefixes.Repeat) {
        return this.repeatPrefix(e);
      } else {
        return new motions.MoveToBeginningOfLine(this.editor);
      }
    };

    VimState.prototype.linewiseAliasedOperator = function(constructor) {
      if (this.isOperatorPending(constructor)) {
        return new motions.MoveToLine(this.editor);
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

    return VimState;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRFQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNDLElBQUssT0FBQSxDQUFRLE1BQVIsRUFBTCxDQURELENBQUE7O0FBQUEsRUFHQSxTQUFBLEdBQVksT0FBQSxDQUFRLGFBQVIsQ0FIWixDQUFBOztBQUFBLEVBSUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSLENBSlgsQ0FBQTs7QUFBQSxFQUtBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQUxYLENBQUE7O0FBQUEsRUFNQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FOVixDQUFBOztBQUFBLEVBT0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSLENBUFIsQ0FBQTs7QUFBQSxFQVFBLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUixDQVJSLENBQUE7O0FBQUEsRUFTQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FUVCxDQUFBOztBQUFBLEVBV0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHVCQUFBLE1BQUEsR0FBUSxJQUFSLENBQUE7O0FBQUEsdUJBQ0EsT0FBQSxHQUFTLElBRFQsQ0FBQTs7QUFBQSx1QkFFQSxJQUFBLEdBQU0sSUFGTixDQUFBOztBQUFBLHVCQUdBLE9BQUEsR0FBUyxJQUhULENBQUE7O0FBS2EsSUFBQSxrQkFBRSxVQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxhQUFBLFVBQ2IsQ0FBQTtBQUFBLCtFQUFBLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLFVBQVUsQ0FBQyxNQUF0QixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXLEVBRFgsQ0FBQTtBQUFBLE1B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
//# sourceURL=/Users/mark/.atom/packages/vim-mode/lib/vim-state.coffee
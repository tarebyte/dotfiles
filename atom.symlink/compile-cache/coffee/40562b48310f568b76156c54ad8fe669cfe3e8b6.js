(function() {
  var actionDecorator, atomActionName, editorProxy, emmet, emmetActions, fs, getUserHome, interactive, loadExtensions, multiSelectionActionDecorator, path, registerInteractiveActions, resources, runAction, singleSelectionActions, toggleCommentSyntaxes;

  path = require('path');

  fs = require('fs');

  emmet = require('emmet');

  emmetActions = require('emmet/lib/action/main');

  resources = require('emmet/lib/assets/resources');

  editorProxy = require('./editor-proxy');

  interactive = require('./interactive');

  singleSelectionActions = ['prev_edit_point', 'next_edit_point', 'merge_lines', 'reflect_css_value', 'select_next_item', 'select_previous_item', 'wrap_with_abbreviation', 'update_tag', 'insert_formatted_line_break_only'];

  toggleCommentSyntaxes = ['html', 'css', 'less', 'scss'];

  getUserHome = function() {
    if (process.platform === 'win32') {
      return process.env.USERPROFILE;
    }
    return process.env.HOME;
  };

  actionDecorator = function(action) {
    return function(editorView, evt) {
      editorProxy.setup(editorView);
      return editorProxy.editor.transact((function(_this) {
        return function() {
          return runAction(action, evt);
        };
      })(this));
    };
  };

  multiSelectionActionDecorator = function(action) {
    return function(editorView, evt) {
      editorProxy.setup(editorView);
      return editorProxy.editor.transact((function(_this) {
        return function() {
          return editorProxy.exec(function(i) {
            runAction(action, evt);
            if (evt.keyBindingAborted) {
              return false;
            }
          });
        };
      })(this));
    };
  };

  runAction = function(action, evt) {
    var activeEditor, result, se, syntax;
    syntax = editorProxy.getSyntax();
    if (action === 'expand_abbreviation_with_tab') {
      activeEditor = editorProxy.editor;
      if (!resources.hasSyntax(syntax) || !activeEditor.getSelection().isEmpty()) {
        return evt.abortKeyBinding();
      }
      if (activeEditor.snippetExpansion) {
        se = activeEditor.snippetExpansion;
        if (se.tabStopIndex + 1 >= se.tabStopMarkers.length) {
          se.destroy();
        } else {
          return evt.abortKeyBinding();
        }
      }
    }
    if (action === 'toggle_comment' && toggleCommentSyntaxes.indexOf(syntax) === -1) {
      return evt.abortKeyBinding();
    }
    if (action === 'insert_formatted_line_break_only') {
      if (syntax !== 'html' || !atom.config.get('emmet.formatLineBreaks')) {
        return evt.abortKeyBinding();
      }
      result = emmet.run(action, editorProxy);
      if (!result) {
        return evt.abortKeyBinding();
      } else {
        return true;
      }
    }
    return emmet.run(action, editorProxy);
  };

  atomActionName = function(name) {
    return 'emmet:' + name.replace(/_/g, '-');
  };

  registerInteractiveActions = function(actions) {
    var name, _i, _len, _ref, _results;
    _ref = ['wrap_with_abbreviation', 'update_tag', 'interactive_expand_abbreviation'];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      _results.push((function(name) {
        var atomAction;
        atomAction = atomActionName(name);
        return actions[atomAction] = function(editorView, evt) {
          editorProxy.setup(editorView);
          return interactive.run(name, editorProxy);
        };
      })(name));
    }
    return _results;
  };

  loadExtensions = function() {
    var extPath, files;
    extPath = atom.config.get('emmet.extensionsPath');
    console.log('Loading Emmet extensions from', extPath);
    if (!extPath) {
      return;
    }
    if (extPath[0] === '~') {
      extPath = getUserHome() + extPath.substr(1);
    }
    if (fs.existsSync(extPath)) {
      emmet.resetUserData();
      files = fs.readdirSync(extPath);
      files = files.map(function(item) {
        return path.join(extPath, item);
      }).filter(function(file) {
        return !fs.statSync(file).isDirectory();
      });
      return emmet.loadExtensions(files);
    } else {
      return console.warn('Emmet: no such extension folder:', extPath);
    }
  };

  module.exports = {
    editorSubscription: null,
    configDefaults: {
      extensionsPath: '~/emmet',
      formatLineBreaks: true
    },
    activate: function(state) {
      var action, atomAction, cmd, _i, _len, _ref;
      this.state = state;
      if (!this.actions) {
        atom.config.observe('emmet.extensionsPath', loadExtensions);
        this.actions = {};
        registerInteractiveActions(this.actions);
        _ref = emmetActions.getList();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          action = _ref[_i];
          atomAction = atomActionName(action.name);
          if (this.actions[atomAction] != null) {
            continue;
          }
          cmd = singleSelectionActions.indexOf(action.name) !== -1 ? actionDecorator(action.name) : multiSelectionActionDecorator(action.name);
          this.actions[atomAction] = cmd;
        }
      }
      return this.editorViewSubscription = atom.workspaceView.eachEditorView((function(_this) {
        return function(editorView) {
          var name, _ref1, _results;
          if (editorView.attached && !editorView.mini) {
            _ref1 = _this.actions;
            _results = [];
            for (name in _ref1) {
              action = _ref1[name];
              _results.push((function(name, action) {
                return editorView.command(name, function(e) {
                  return action(editorView, e);
                });
              })(name, action));
            }
            return _results;
          }
        };
      })(this));
    },
    deactivate: function() {
      var _ref;
      if ((_ref = this.editorViewSubscription) != null) {
        _ref.off();
      }
      return this.editorViewSubscription = null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFQQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBTyxPQUFBLENBQVEsSUFBUixDQURQLENBQUE7O0FBQUEsRUFHQSxLQUFBLEdBQWUsT0FBQSxDQUFRLE9BQVIsQ0FIZixDQUFBOztBQUFBLEVBSUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSx1QkFBUixDQUpmLENBQUE7O0FBQUEsRUFLQSxTQUFBLEdBQWUsT0FBQSxDQUFRLDRCQUFSLENBTGYsQ0FBQTs7QUFBQSxFQU9BLFdBQUEsR0FBZSxPQUFBLENBQVEsZ0JBQVIsQ0FQZixDQUFBOztBQUFBLEVBUUEsV0FBQSxHQUFlLE9BQUEsQ0FBUSxlQUFSLENBUmYsQ0FBQTs7QUFBQSxFQVVBLHNCQUFBLEdBQXlCLENBQ3ZCLGlCQUR1QixFQUNKLGlCQURJLEVBQ2UsYUFEZixFQUV2QixtQkFGdUIsRUFFRixrQkFGRSxFQUVrQixzQkFGbEIsRUFHdkIsd0JBSHVCLEVBR0csWUFISCxFQUdpQixrQ0FIakIsQ0FWekIsQ0FBQTs7QUFBQSxFQWdCQSxxQkFBQSxHQUF3QixDQUFDLE1BQUQsRUFBUyxLQUFULEVBQWdCLE1BQWhCLEVBQXdCLE1BQXhCLENBaEJ4QixDQUFBOztBQUFBLEVBa0JBLFdBQUEsR0FBYyxTQUFBLEdBQUE7QUFDWixJQUFBLElBQUcsT0FBTyxDQUFDLFFBQVIsS0FBb0IsT0FBdkI7QUFDRSxhQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBbkIsQ0FERjtLQUFBO1dBR0EsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUpBO0VBQUEsQ0FsQmQsQ0FBQTs7QUFBQSxFQTZCQSxlQUFBLEdBQWtCLFNBQUMsTUFBRCxHQUFBO1dBQ2hCLFNBQUMsVUFBRCxFQUFh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
//# sourceURL=/Users/mark/.atom/packages/emmet/lib/emmet.coffee
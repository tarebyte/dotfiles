(function() {
  var AlphaSelector, ColorPicker, ColorPickerView, Convert, HueSelector, SaturationSelector, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom').View;

  Convert = require('./ColorPicker-convert');

  ColorPicker = void 0;

  SaturationSelector = void 0;

  HueSelector = void 0;

  AlphaSelector = void 0;

  module.exports = ColorPickerView = (function(_super) {
    __extends(ColorPickerView, _super);

    function ColorPickerView() {
      return ColorPickerView.__super__.constructor.apply(this, arguments);
    }

    ColorPickerView.content = function() {
      var c;
      c = 'ColorPicker-';
      return this.div({
        id: 'ColorPicker',
        "class": 'ColorPicker'
      }, (function(_this) {
        return function() {
          _this.div({
            id: c + 'loader',
            "class": c + 'loader'
          }, function() {
            _this.div({
              "class": c + 'loaderDot'
            });
            _this.div({
              "class": c + 'loaderDot'
            });
            return _this.div({
              "class": c + 'loaderDot'
            });
          });
          _this.div({
            id: c + 'color',
            "class": c + 'color'
          }, function() {
            return _this.div({
              id: c + 'value',
              "class": c + 'value'
            });
          });
          _this.div({
            id: c + 'initialWrapper',
            "class": c + 'initialWrapper'
          }, function() {
            return _this.div({
              id: c + 'initial',
              "class": c + 'initial'
            });
          });
          return _this.div({
            id: c + 'picker',
            "class": c + 'picker'
          }, function() {
            _this.div({
              id: c + 'saturationSelectorWrapper',
              "class": c + 'saturationSelectorWrapper'
            }, function() {
              _this.div({
                id: c + 'saturationSelection',
                "class": c + 'saturationSelection'
              });
              return _this.canvas({
                id: c + 'saturationSelector',
                "class": c + 'saturationSelector',
                width: '180px',
                height: '180px'
              });
            });
            _this.div({
              id: c + 'alphaSelectorWrapper',
              "class": c + 'alphaSelectorWrapper'
            }, function() {
              _this.div({
                id: c + 'alphaSelection',
                "class": c + 'alphaSelection'
              });
              return _this.canvas({
                id: c + 'alphaSelector',
                "class": c + 'alphaSelector',
                width: '20px',
                height: '180px'
              });
            });
            return _this.div({
              id: c + 'hueSelectorWrapper',
              "class": c + 'hueSelectorWrapper'
            }, function() {
              _this.div({
                id: c + 'hueSelection',
                "class": c + 'hueSelection'
              });
              return _this.canvas({
                id: c + 'hueSelector',
                "class": c + 'hueSelector',
                width: '20px',
                height: '180px'
              });
            });
          });
        };
      })(this));
    };

    ColorPickerView.prototype.initialize = function() {
      (atom.workspaceView.find('.vertical')).append(this);
      ColorPicker = require('./ColorPicker');
      SaturationSelector = require('./ColorPicker-saturationSelector');
      AlphaSelector = require('./ColorPicker-alphaSelector');
      HueSelector = require('./ColorPicker-hueSelector');
      HueSelector.render();
      return this.bind();
    };

    ColorPickerView.prototype.destroy = function() {
      this.close();
      this.remove();
      return this.detach();
    };

    ColorPickerView.prototype.storage = {
      activeView: null,
      selectedColor: null,
      pickedColor: null,
      saturation: {
        x: 0,
        y: 0
      },
      hue: 0,
      alpha: 0
    };

    ColorPickerView.prototype.isOpen = false;

    ColorPickerView.prototype.reset = function() {
      this.addClass('is--visible is--initial');
      this.removeClass('no--arrow is--pointer is--searching');
      (this.find('#ColorPicker-value')).html('');
      (this.find('#ColorPicker-color')).css('background-color', '').css('border-bottom-color', '');
      return (this.find('#ColorPicker-value')).attr('data-variable', '');
    };

    ColorPickerView.prototype.open = function() {
      var _colorPickerHeight, _colorPickerWidth, _gutterWidth, _halfColorPickerWidth, _left, _pane, _paneOffset, _position, _scroll, _selectedColor, _tabBarHeight, _top, _view, _viewHeight, _viewWidth;
      this.isOpen = true;
      _selectedColor = this.storage.selectedColor;
      if (!_selectedColor) {
        this.addClass('is--searching');
      }
      if (!_selectedColor || _selectedColor.hasOwnProperty('pointer')) {
        this.addClass('is--pointer');
      }
      _colorPickerWidth = this.width();
      _colorPickerHeight = this.height();
      _halfColorPickerWidth = _colorPickerWidth / 2;
      _pane = atom.workspaceView.getActivePaneView();
      _paneOffset = {
        top: _pane[0].offsetTop,
        left: _pane[0].offsetLeft
      };
      _tabBarHeight = (_pane.find('.tab-bar')).height();
      this.storage.activeView = _view = _pane.activeView;
      _position = _view.pixelPositionForScreenPosition(_view.getEditor().getCursorScreenPosition());
      _gutterWidth = (_view.find('.gutter')).width();
      _scroll = {
        top: _view.scrollTop(),
        left: _view.scrollLeft()
      };
      _view.verticalScrollbar.on('scroll.color-picker', (function(_this) {
        return function() {
          return _this.scroll();
        };
      })(this));
      _top = 15 + _position.top - _scroll.top + _view.lineHeight + _tabBarHeight;
      _left = _position.left - _scroll.left + _gutterWidth;
      _viewWidth = _view.width();
      _viewHeight = _view.height();
      if (_top + _colorPickerHeight - 15 > _viewHeight) {
        _top = _viewHeight + _tabBarHeight - _colorPickerHeight - 20;
        this.addClass('no--arrow');
      }
      _top += _paneOffset.top;
      if (_left + _halfColorPickerWidth > _viewWidth) {
        _left = _viewWidth - _halfColorPickerWidth - 20;
        this.addClass('no--arrow');
      }
      _left += _paneOffset.left - _halfColorPickerWidth;
      return this.css('top', Math.max(20, _top)).css('left', Math.max(20, _left));
    };

    ColorPickerView.prototype.close = function() {
      this.isOpen = false;
      this.removeClass('is--visible is--initial is--searching is--error');
      if (!this.storage.activeView) {
        return;
      }
      return this.storage.activeView.verticalScrollbar.off('scroll.color-picker');
    };

    ColorPickerView.prototype.error = function() {
      this.storage.selectedColor = null;
      return this.removeClass('is--searching').addClass('is--error');
    };

    ColorPickerView.prototype.scroll = function() {
      if (this.isOpen) {
        return this.close();
      }
    };

    ColorPickerView.prototype.bind = function() {
      var $body;
      window.onresize = (function(_this) {
        return function() {
          if (_this.isOpen) {
            return _this.close();
          }
        };
      })(this);
      atom.workspaceView.on('pane:active-item-changed', (function(_this) {
        return function() {
          return _this.close();
        };
      })(this));
      $body = this.parents('body');
      (function(_this) {
        return (function() {
          return $body.on('mousedown', function(e) {
            var _className, _color, _pointer, _target;
            _target = e.target;
            _className = _target.className;
            if (!/ColorPicker/.test(_className)) {
              return _this.close();
            }
            _color = _this.storage.selectedColor;
            switch (_className) {
              case 'ColorPicker-color':
                if ((_color != null ? _color.hasOwnProperty('pointer') : void 0) && (_pointer = _color.pointer)) {
                  (atom.workspace.open(_pointer.filePath))["finally"](function() {
                    var _editor;
                    _editor = atom.workspace.activePaneItem;
                    _editor.clearSelections();
                    return _editor.setSelectedBufferRange(_pointer.range);
                  });
                } else {
                  _this.replaceColor();
                }
                return _this.close();
              case 'ColorPicker-initialWrapper':
                _this.inputColor(_color);
                return _this.addClass('is--initial');
            }
          }).on('keydown', function(e) {
            if (!_this.isOpen) {
              return;
            }
            if (e.which !== 13) {
              return _this.close();
            }
            e.preventDefault();
            e.stopPropagation();
            _this.replaceColor();
            return _this.close();
          });
        });
      })(this)();
      (function(_this) {
        return (function() {
          var _isGrabbingSaturationSelection;
          _isGrabbingSaturationSelection = false;
          return $body.on('mousedown mousemove mouseup', function(e) {
            var _offset, _offsetX, _offsetY;
            _offset = SaturationSelector.$el.offset();
            _offsetY = Math.max(1, Math.min(SaturationSelector.height, e.pageY - _offset.top));
            _offsetX = Math.max(1, Math.min(SaturationSelector.width, e.pageX - _offset.left));
            switch (e.type) {
              case 'mousedown':
                if (e.target.className !== 'ColorPicker-saturationSelector') {
                  return;
                }
                e.preventDefault();
                _isGrabbingSaturationSelection = true;
                break;
              case 'mousemove':
                if (!_isGrabbingSaturationSelection) {
                  return;
                }
                e.preventDefault();
                break;
              case 'mouseup':
                _isGrabbingSaturationSelection = false;
            }
            if (!_isGrabbingSaturationSelection) {
              return;
            }
            _this.setSaturation(_offsetX, _offsetY);
            return _this.refreshColor('saturation');
          });
        });
      })(this)();
      (function(_this) {
        return (function() {
          var _isGrabbingAlphaSelection;
          _isGrabbingAlphaSelection = false;
          return $body.on('mousedown mousemove mouseup', function(e) {
            var _offsetTop, _offsetY;
            _offsetTop = AlphaSelector.$el.offset().top;
            _offsetY = Math.max(1, Math.min(AlphaSelector.height, e.pageY - _offsetTop));
            switch (e.type) {
              case 'mousedown':
                if (e.target.className !== 'ColorPicker-alphaSelector') {
                  return;
                }
                e.preventDefault();
                _isGrabbingAlphaSelection = true;
                break;
              case 'mousemove':
                if (!_isGrabbingAlphaSelection) {
                  return;
                }
                e.preventDefault();
                break;
              case 'mouseup':
                _isGrabbingAlphaSelection = false;
            }
            if (!_isGrabbingAlphaSelection) {
              return;
            }
            _this.setAlpha(_offsetY);
            return _this.refreshColor('alpha');
          });
        });
      })(this)();
      return (function(_this) {
        return function() {
          var _isGrabbingHueSelection;
          _isGrabbingHueSelection = false;
          return $body.on('mousedown mousemove mouseup', function(e) {
            var _offsetTop, _offsetY;
            _offsetTop = HueSelector.$el.offset().top;
            _offsetY = Math.max(1, Math.min(HueSelector.height, e.pageY - _offsetTop));
            switch (e.type) {
              case 'mousedown':
                if (e.target.className !== 'ColorPicker-hueSelector') {
                  return;
                }
                e.preventDefault();
                _isGrabbingHueSelection = true;
                break;
              case 'mousemove':
                if (!_isGrabbingHueSelection) {
                  return;
                }
                e.preventDefault();
                break;
              case 'mouseup':
                _isGrabbingHueSelection = false;
            }
            if (!_isGrabbingHueSelection) {
              return;
            }
            _this.setHue(_offsetY);
            return _this.refreshColor('hue');
          });
        };
      })(this)();
    };

    ColorPickerView.prototype.setSaturation = function(positionX, positionY) {
      var _percentageLeft, _percentageTop;
      this.storage.saturation.x = positionX;
      this.storage.saturation.y = positionY;
      _percentageTop = (positionY / SaturationSelector.height) * 100;
      _percentageLeft = (positionX / SaturationSelector.width) * 100;
      return SaturationSelector.$selection.css('top', _percentageTop + '%').css('left', _percentageLeft + '%');
    };

    ColorPickerView.prototype.refreshSaturationCanvas = function() {
      var _color;
      _color = HueSelector.getColorAtPosition(this.storage.hue);
      return SaturationSelector.render(_color.color);
    };

    ColorPickerView.prototype.setAlpha = function(positionY) {
      this.storage.alpha = positionY;
      return AlphaSelector.$selection.css('top', (positionY / AlphaSelector.height) * 100 + '%');
    };

    ColorPickerView.prototype.refreshAlphaCanvas = function() {
      var _color, _saturation;
      _saturation = this.storage.saturation;
      _color = SaturationSelector.getColorAtPosition(_saturation.x, _saturation.y);
      return AlphaSelector.render(Convert.hexToRgb(_color.color));
    };

    ColorPickerView.prototype.setHue = function(positionY) {
      this.storage.hue = positionY;
      return HueSelector.$selection.css('top', (positionY / HueSelector.height) * 100 + '%');
    };

    ColorPickerView.prototype.setColor = function(color, preferredColorType) {
      var _alphaValue, _color, _displayColor, _h, _hexRgbFragments, _l, _ref, _rgb, _s, _saturation, _setInitialColor;
      if (!color) {
        this.removeClass('is--initial');
      } else {
        _setInitialColor = true;
      }
      _saturation = this.storage.saturation;
      if (color == null) {
        color = SaturationSelector.getColorAtPosition(_saturation.x, _saturation.y);
      }
      _color = _displayColor = color.color;
      _alphaValue = 100 - (((this.storage.alpha / AlphaSelector.height) * 100) << 0);
      if (preferredColorType) {
        if (preferredColorType !== 'hsl' && preferredColorType !== 'hsla') {
          _hexRgbFragments = (Convert.hexToRgb(_color)).join(', ');
        } else {
          _ref = Convert.hsvToHsl(Convert.rgbToHsv(Convert.hexToRgb(_color))), _h = _ref[0], _s = _ref[1], _l = _ref[2];
        }
        if (_alphaValue === 100) {
          _displayColor = (function() {
            switch (preferredColorType) {
              case 'rgb':
              case 'rgba':
                return "rgb(" + _hexRgbFragments + ")";
              case 'hsl':
              case 'hsla':
                return "hsl(" + (_h << 0) + ", " + ((_s * 100) << 0) + "%, " + ((_l * 100) << 0) + "%)";
              default:
                return _displayColor = _color;
            }
          })();
        } else {
          _displayColor = (function() {
            switch (preferredColorType) {
              case 'rgb':
              case 'rgba':
              case 'hex':
                return ("rgba(" + _hexRgbFragments + ", ") + _alphaValue / 100 + ')';
              case 'hexa':
                return ("rgba(" + _color + ", ") + _alphaValue / 100 + ')';
              case 'hsl':
              case 'hsla':
                return ("hsla(" + (_h << 0) + ", " + ((_s * 100) << 0) + "%, " + ((_l * 100) << 0) + "%, ") + _alphaValue / 100 + ')';
            }
          })();
        }
      }
      if (_alphaValue !== 100) {
        _rgb = (function() {
          switch (color.type) {
            case 'hexa':
              return Convert.hexaToRgb(_color);
            case 'hex':
              return Convert.hexToRgb(_color);
            case 'rgb':
              return _color;
          }
        })();
        if (_rgb) {
          _color = "rgba(" + (_rgb.join(', ')) + ", " + (_alphaValue / 100) + ")";
        }
      }
      this.storage.pickedColor = _displayColor;
      (this.find('#ColorPicker-value')).html(_displayColor);
      (this.find('#ColorPicker-color')).css('background-color', _color).css('border-bottom-color', _color);
      if (_setInitialColor) {
        (this.find('#ColorPicker-initial')).css('background-color', _color).html(_color);
      }
      if (color.hasOwnProperty('pointer')) {
        return this.removeClass('is--searching').find('#ColorPicker-value').attr('data-variable', color.match);
      }
    };

    ColorPickerView.prototype.refreshColor = function(trigger) {
      if (trigger === 'hue') {
        this.refreshSaturationCanvas();
      }
      if (trigger === 'hue' || trigger === 'saturation') {
        this.refreshAlphaCanvas();
      }
      return this.setColor(void 0, this.storage.selectedColor.type);
    };

    ColorPickerView.prototype.inputColor = function(color) {
      var _alpha, _color, _hasClass, _hsv, _saturationX, _saturationY;
      _hasClass = this[0].className.match(/(is\-\-color\_(\w+))\s/);
      if (_hasClass) {
        this.removeClass(_hasClass[1]);
      }
      this.addClass('is--color_' + color.type);
      _color = color.color;
      _hsv = (function() {
        switch (color.type) {
          case 'hex':
            return Convert.rgbToHsv(Convert.hexToRgb(_color));
          case 'hexa':
            return Convert.rgbToHsv(Convert.hexaToRgb(_color));
          case 'rgb':
          case 'rgba':
            return Convert.rgbToHsv(_color);
          case 'hsl':
          case 'hsla':
            return Convert.hslToHsv([parseInt(color.regexMatch[1], 10), (parseInt(color.regexMatch[2], 10)) / 100, (parseInt(color.regexMatch[3], 10)) / 100]);
        }
      })();
      if (!_hsv) {
        return;
      }
      this.setHue((HueSelector.height / 360) * _hsv[0]);
      _saturationX = Math.max(1, SaturationSelector.width * _hsv[1]);
      _saturationY = Math.max(1, SaturationSelector.height * (1 - _hsv[2]));
      this.setSaturation(_saturationX, _saturationY);
      this.refreshSaturationCanvas();
      _alpha = (function() {
        switch (color.type) {
          case 'rgba':
            return color.regexMatch[7];
          case 'hexa':
            return color.regexMatch[4];
          case 'hsla':
            return color.regexMatch[4];
        }
      })();
      if (_alpha) {
        this.setAlpha(AlphaSelector.height * (1 - parseFloat(_alpha)));
      } else if (!_alpha) {
        this.setAlpha(0);
      }
      this.refreshAlphaCanvas();
      return this.setColor(color);
    };

    ColorPickerView.prototype.selectColor = function() {
      var _color, _editor;
      _color = this.storage.selectedColor;
      _editor = atom.workspace.getActiveEditor();
      if (!_color) {
        return;
      }
      _editor.clearSelections();
      return _editor.addSelectionForBufferRange({
        start: {
          column: _color.index,
          row: _color.row
        },
        end: {
          column: _color.end,
          row: _color.row
        }
      });
    };

    ColorPickerView.prototype.replaceColor = function() {
      var _color, _editor, _newColor;
      _color = this.storage.selectedColor;
      _newColor = this.storage.pickedColor;
      _editor = atom.workspace.getActiveEditor();
      if (!_color) {
        return;
      }
      this.selectColor();
      _editor.replaceSelectedText(null, (function(_this) {
        return function() {
          return _newColor;
        };
      })(this));
      _editor.clearSelections();
      return _editor.addSelectionForBufferRange({
        start: {
          column: _color.index,
          row: _color.row
        },
        end: {
          column: _color.index + _newColor.length,
          row: _color.row
        }
      });
    };

    return ColorPickerView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBR0k7QUFBQSxNQUFBLDJGQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxNQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBQ0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSx1QkFBUixDQURWLENBQUE7O0FBQUEsRUFHQSxXQUFBLEdBQWMsTUFIZCxDQUFBOztBQUFBLEVBSUEsa0JBQUEsR0FBcUIsTUFKckIsQ0FBQTs7QUFBQSxFQUtBLFdBQUEsR0FBYyxNQUxkLENBQUE7O0FBQUEsRUFNQSxhQUFBLEdBQWdCLE1BTmhCLENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNuQixzQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxlQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTtBQUNOLFVBQUEsQ0FBQTtBQUFBLE1BQUEsQ0FBQSxHQUFJLGNBQUosQ0FBQTthQUVBLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLEVBQUEsRUFBSSxhQUFKO0FBQUEsUUFBbUIsT0FBQSxFQUFPLGFBQTFCO09BQUwsRUFBOEMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUMxQyxVQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLEVBQUEsRUFBSSxDQUFBLEdBQUksUUFBUjtBQUFBLFlBQWtCLE9BQUEsRUFBTyxDQUFBLEdBQUksUUFBN0I7V0FBTCxFQUE0QyxTQUFBLEdBQUE7QUFDeEMsWUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sQ0FBQSxHQUFJLFdBQVg7YUFBTCxDQUFBLENBQUE7QUFBQSxZQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxDQUFBLEdBQUksV0FBWDth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
//# sourceURL=/Users/mark/.atom/packages/color-picker/lib/ColorPicker-view.coffee
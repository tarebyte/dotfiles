(function() {
  var AlphaSelector, ColorPicker, ColorPickerView, Convert, HueSelector, SaturationSelector, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom').View;

  Convert = require('./ColorPicker-convert');

  ColorPicker = null;

  SaturationSelector = null;

  HueSelector = null;

  AlphaSelector = null;

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
            id: "" + c + "loader",
            "class": "" + c + "loader"
          }, function() {
            _this.div({
              "class": "" + c + "loaderDot"
            });
            _this.div({
              "class": "" + c + "loaderDot"
            });
            return _this.div({
              "class": "" + c + "loaderDot"
            });
          });
          _this.div({
            id: "" + c + "color",
            "class": "" + c + "color"
          }, function() {
            return _this.div({
              id: "" + c + "value",
              "class": "" + c + "value"
            });
          });
          _this.div({
            id: "" + c + "initialWrapper",
            "class": "" + c + "initialWrapper"
          }, function() {
            return _this.div({
              id: "" + c + "initial",
              "class": "" + c + "initial"
            });
          });
          return _this.div({
            id: "" + c + "picker",
            "class": "" + c + "picker"
          }, function() {
            _this.div({
              id: "" + c + "saturationSelectorWrapper",
              "class": "" + c + "saturationSelectorWrapper"
            }, function() {
              _this.div({
                id: "" + c + "saturationSelection",
                "class": "" + c + "saturationSelection"
              });
              return _this.canvas({
                id: "" + c + "saturationSelector",
                "class": "" + c + "saturationSelector",
                width: '180px',
                height: '180px'
              });
            });
            _this.div({
              id: "" + c + "alphaSelectorWrapper",
              "class": "" + c + "alphaSelectorWrapper"
            }, function() {
              _this.div({
                id: "" + c + "alphaSelection",
                "class": "" + c + "alphaSelection"
              });
              return _this.canvas({
                id: "" + c + "alphaSelector",
                "class": "" + c + "alphaSelector",
                width: '20px',
                height: '180px'
              });
            });
            return _this.div({
              id: "" + c + "hueSelectorWrapper",
              "class": "" + c + "hueSelectorWrapper"
            }, function() {
              _this.div({
                id: "" + c + "hueSelection",
                "class": "" + c + "hueSelection"
              });
              return _this.canvas({
                id: "" + c + "hueSelector",
                "class": "" + c + "hueSelector",
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
      (this.find('#ColorPicker-color')).css('background-color', '').css('border-bottom-color', '');
      return (this.find('#ColorPicker-value')).attr('data-variable', '').html('');
    };

    ColorPickerView.prototype.open = function() {
      var _colorPickerHeight, _colorPickerWidth, _gutterWidth, _halfColorPickerWidth, _left, _pane, _paneOffset, _position, _scroll, _selectedColor, _tabBarHeight, _top, _view, _viewHeight, _viewWidth;
      this.isOpen = true;
      _selectedColor = this.storage.selectedColor;
      if (!_selectedColor || _selectedColor.hasOwnProperty('pointer')) {
        this.addClass('is--pointer');
      }
      if (!_selectedColor) {
        this.addClass('is--searching');
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
      var _alphaFactor, _alphaValue, _color, _displayColor, _h, _hexRgbFragments, _hsl, _l, _rgb, _s, _saturation, _setInitialColor;
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
      _alphaFactor = _alphaValue / 100;
      if (preferredColorType) {
        if (preferredColorType === 'hsl' || preferredColorType === 'hsla') {
          _hsl = Convert.hsvToHsl(Convert.rgbToHsv(Convert.hexToRgb(_color)));
          _h = _hsl[0] << 0;
          _s = (_hsl[1] * 100) << 0;
          _l = (_hsl[2] * 100) << 0;
        } else {
          _hexRgbFragments = (Convert.hexToRgb(_color)).join(', ');
        }
        if (_alphaValue === 100) {
          _displayColor = (function() {
            switch (preferredColorType) {
              case 'rgb':
              case 'rgba':
                return "rgb(" + _hexRgbFragments + ")";
              case 'hsl':
              case 'hsla':
                return "hsl(" + _h + ", " + _s + "%, " + _l + "%)";
              default:
                return _color;
            }
          })();
        } else {
          _displayColor = (function() {
            switch (preferredColorType) {
              case 'rgb':
              case 'rgba':
              case 'hex':
                return "rgba(" + _hexRgbFragments + ", " + _alphaFactor + ")";
              case 'hexa':
                return "rgba(" + _color + ", " + _alphaFactor + ")";
              case 'hsl':
              case 'hsla':
                return "hsla(" + _h + ", " + _s + "%, " + _l + "%, " + _alphaFactor + ")";
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
          _color = "rgba(" + (_rgb.join(', ')) + ", " + _alphaFactor + ")";
        }
      }
      this.storage.pickedColor = _displayColor;
      (this.find('#ColorPicker-color')).css('background-color', _color).css('border-bottom-color', _color);
      (this.find('#ColorPicker-value')).html(_displayColor);
      if (_setInitialColor) {
        (this.find('#ColorPicker-initial')).css('background-color', _color).html(_displayColor);
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
      this.addClass("is--color_" + color.type);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBR0k7QUFBQSxNQUFBLDJGQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBRSxPQUFTLE9BQUEsQ0FBUSxNQUFSLEVBQVQsSUFBRixDQUFBOztBQUFBLEVBQ0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSx1QkFBUixDQURWLENBQUE7O0FBQUEsRUFHQSxXQUFBLEdBQWMsSUFIZCxDQUFBOztBQUFBLEVBSUEsa0JBQUEsR0FBcUIsSUFKckIsQ0FBQTs7QUFBQSxFQUtBLFdBQUEsR0FBYyxJQUxkLENBQUE7O0FBQUEsRUFNQSxhQUFBLEdBQWdCLElBTmhCLENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNuQixzQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxlQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTtBQUNOLFVBQUEsQ0FBQTtBQUFBLE1BQUEsQ0FBQSxHQUFJLGNBQUosQ0FBQTthQUVBLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLEVBQUEsRUFBSSxhQUFKO0FBQUEsUUFBbUIsT0FBQSxFQUFPLGFBQTFCO09BQUwsRUFBOEMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUMxQyxVQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLEVBQUEsRUFBSSxFQUFBLEdBQXhCLENBQXdCLEdBQU8sUUFBWDtBQUFBLFlBQW9CLE9BQUEsRUFBTyxFQUFBLEdBQS9DLENBQStDLEdBQU8sUUFBbEM7V0FBTCxFQUFnRCxTQUFBLEdBQUE7QUFDNUMsWUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sRUFBQSxHQUEvQixDQUErQixHQUFPLFdBQWQ7YUFBTCxDQUFBLENBQUE7QUFBQSxZQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7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
//# sourceURL=/Users/mark/.atom/packages/color-picker/lib/ColorPicker-view.coffee
(function() {
  var $, $$, Keys, SimpleSelectListView, View, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require("atom"), $ = _ref.$, $$ = _ref.$$, View = _ref.View;

  _ = require("underscore-plus");

  Keys = {
    Escape: 27,
    Enter: 13,
    Tab: 9
  };

  SimpleSelectListView = (function(_super) {
    __extends(SimpleSelectListView, _super);

    function SimpleSelectListView() {
      return SimpleSelectListView.__super__.constructor.apply(this, arguments);
    }

    SimpleSelectListView.prototype.maxItems = 10;

    SimpleSelectListView.content = function() {
      return this.div({
        "class": "select-list popover-list"
      }, (function(_this) {
        return function() {
          _this.input({
            "class": "hidden-input",
            outlet: "hiddenInput"
          });
          return _this.ol({
            "class": "list-group",
            outlet: "list"
          });
        };
      })(this));
    };

    SimpleSelectListView.prototype.initialize = function() {
      this.on("autocomplete-plus:confirm", (function(_this) {
        return function() {
          return _this.confirmSelection();
        };
      })(this));
      this.list.on("mousedown", "li", (function(_this) {
        return function(e) {
          e.preventDefault();
          e.stopPropagation();
          return _this.selectItemView($(e.target).closest("li"));
        };
      })(this));
      return this.list.on("mouseup", "li", (function(_this) {
        return function(e) {
          e.preventDefault();
          e.stopPropagation();
          if ($(e.target).closest("li").hasClass("selected")) {
            return _this.confirmSelection();
          }
        };
      })(this));
    };

    SimpleSelectListView.prototype.selectPreviousItemView = function() {
      var view;
      view = this.getSelectedItemView().prev();
      if (!view.length) {
        view = this.list.find("li:last");
      }
      this.selectItemView(view);
      return false;
    };

    SimpleSelectListView.prototype.selectNextItemView = function() {
      var view;
      view = this.getSelectedItemView().next();
      if (!view.length) {
        view = this.list.find("li:first");
      }
      this.selectItemView(view);
      return false;
    };

    SimpleSelectListView.prototype.setItems = function(items) {
      if (items == null) {
        items = [];
      }
      this.items = items;
      return this.populateList();
    };

    SimpleSelectListView.prototype.selectItemView = function(view) {
      if (!view.length) {
        return;
      }
      this.list.find(".selected").removeClass("selected");
      view.addClass("selected");
      return this.scrollToItemView(view);
    };

    SimpleSelectListView.prototype.scrollToItemView = function(view) {
      var desiredBottom, desiredTop, scrollTop;
      scrollTop = this.list.scrollTop();
      desiredTop = view.position().top + scrollTop;
      desiredBottom = desiredTop + view.outerHeight();
      if (desiredTop < scrollTop) {
        return this.list.scrollTop(desiredTop);
      } else {
        return this.list.scrollBottom(desiredBottom);
      }
    };

    SimpleSelectListView.prototype.getSelectedItemView = function() {
      return this.list.find("li.selected");
    };

    SimpleSelectListView.prototype.getSelectedItem = function() {
      return this.getSelectedItemView().data("select-list-item");
    };

    SimpleSelectListView.prototype.confirmSelection = function() {
      var item;
      item = this.getSelectedItem();
      if (item != null) {
        return this.confirmed(item);
      } else {
        return this.cancel();
      }
    };

    SimpleSelectListView.prototype.setActive = function() {
      this.active = true;
      return this.hiddenInput.focus();
    };

    SimpleSelectListView.prototype.populateList = function() {
      var i, item, itemView, _i, _ref1;
      if (this.items == null) {
        return;
      }
      this.list.empty();
      for (i = _i = 0, _ref1 = Math.min(this.items.length, this.maxItems); 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
        item = this.items[i];
        itemView = this.viewForItem(item);
        $(itemView).data("select-list-item", item);
        this.list.append(itemView);
      }
      return this.selectItemView(this.list.find("li:first"));
    };

    SimpleSelectListView.prototype.viewForItem = function(_arg) {
      var word;
      word = _arg.word;
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            return _this.span(word);
          };
        })(this));
      });
    };

    SimpleSelectListView.prototype.cancel = function() {
      if (!this.active) {
        return;
      }
      this.active = false;
      this.list.empty();
      return this.detach();
    };

    return SimpleSelectListView;

  })(View);

  module.exports = SimpleSelectListView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFnQixPQUFBLENBQVEsTUFBUixDQUFoQixFQUFDLFNBQUEsQ0FBRCxFQUFJLFVBQUEsRUFBSixFQUFRLFlBQUEsSUFBUixDQUFBOztBQUFBLEVBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQURKLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFBUSxFQUFSO0FBQUEsSUFDQSxLQUFBLEVBQU8sRUFEUDtBQUFBLElBRUEsR0FBQSxFQUFLLENBRkw7R0FKRixDQUFBOztBQUFBLEVBUU07QUFDSiwyQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsbUNBQUEsUUFBQSxHQUFVLEVBQVYsQ0FBQTs7QUFBQSxJQUNBLG9CQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTywwQkFBUDtPQUFMLEVBQXdDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDdEMsVUFBQSxLQUFDLENBQUEsS0FBRCxDQUFPO0FBQUEsWUFBQSxPQUFBLEVBQU8sY0FBUDtBQUFBLFlBQXVCLE1BQUEsRUFBUSxhQUEvQjtXQUFQLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsRUFBRCxDQUFJO0FBQUEsWUFBQSxPQUFBLEVBQU8sWUFBUDtBQUFBLFlBQXFCLE1BQUEsRUFBUSxNQUE3QjtXQUFKLEVBRnNDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEMsRUFEUTtJQUFBLENBRFYsQ0FBQTs7QUFBQSxtQ0FPQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBRVYsTUFBQSxJQUFDLENBQUEsRUFBRCxDQUFJLDJC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
//# sourceURL=/Users/mark/.atom/packages/autocomplete-plus/lib/simple-select-list-view.coffee
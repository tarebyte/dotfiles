var View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
        for (var key in parent) {
            if (__hasProp.call(parent, key)) child[key] = parent[key];
        }

        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    };

View = require('atom').View;
var observer;
var observerPanes;


module.exports = FiletypeColorView = (function(_super) {
    __extends(FiletypeColorView, _super);

    function FiletypeColorView() {
        return FiletypeColorView.__super__.constructor.apply(this, arguments);
    }

    FiletypeColorView.content = function() {
        return this.div({
            //"class": 'filetype-color overlay from-top'
        }, (function(_this) {
            return function() {
                return;
                //_this.div("The FiletypeColor package is Alive! It's GONE!", {"class": "message"});
            };
        })(this));
    };

    FiletypeColorView.prototype.initialize = function(serializeState) {
        return atom.workspaceView.command("filetype-color:toggle", (function(_this) {
            return function() {
                return _this.toggle();
            };
        })(this));
    };

    FiletypeColorView.prototype.serialize = function() {};

    FiletypeColorView.prototype.destroy = function() {
        return this.detach();
    };

    FiletypeColorView.prototype.toggle = function() {
        if (this.hasParent()) {
            this.clearAll();
            this.clearAllPanes();
            if (observer) {
                observer.disconnect();
                observerPanes.disconnect();
            }
            return this.detach();
        } else {

            if(document.querySelector('.tree-view'))
            {
                this.colorAll();
                this.createTreeViewObserver();
            }

            this.colorAllPanes();
            this.createPaneViewObserver();

            return atom.workspaceView.append(this);
        }
    };

    FiletypeColorView.prototype.createPaneViewObserver = function(mutation) {
        var target = document.querySelector('.panes .pane ul');
        var config = {
            attributes: true,
            childList: true,
            characterData: false
        };
        var bubbles = false;
        var self = this;
        observerPanes = new WebKitMutationObserver(function(mutations) {
            mutations.forEach(function() {
                var that = self;
                setTimeout(function() {
                    that.colorAllPanes();
                }, 200);
            });
        });

        observerPanes.observe(target, {
            attributes: true,
            subtree: bubbles
        });
    };

    FiletypeColorView.prototype.createTreeViewObserver = function(mutation) {
        var target = document.querySelector('.tree-view');
        var config = {
            attributes: true,
            childList: true,
            characterData: false
        };
        var bubbles = false;
        var self = this;
        observer = new WebKitMutationObserver(function(mutations) {
            mutations.forEach(function() {
                var that = self;
                setTimeout(function() {
                    that.colorAll();
                }, 200);
            });
        });

        observer.observe(target, {
            attributes: true,
            subtree: bubbles
        });
    };

    FiletypeColorView.prototype.attrModified = function(mutation) {
        // var name = mutation.attributeName,
        // newValue = mutation.target.getAttribute(name),
        // oldValue = mutation.oldValue;
        // console.log(name, newValue, oldValue);
        // console.log(mutation.target);
    };

    FiletypeColorView.prototype.colorAll = function() {
        treeView = document.querySelector(".tree-view");
        elements = treeView.querySelectorAll("li.file span");

        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            this.colorElement(el);
        }
    };

    FiletypeColorView.prototype.colorAllPanes = function() {

        paneView = document.querySelector(".panes");
        elements = paneView.querySelectorAll("li .title");
        console.log(elements);
        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            this.colorElement(el);
        }
    };

    FiletypeColorView.prototype.clearAll = function() {
        if(document.querySelector('.tree-view'))
        {
            treeView = document.querySelector(".tree-view");
            elements = treeView.querySelectorAll("li.file span");

            for (var i = 0; i < elements.length; i++) {
                var el = elements[i];
                this.clearElement(el);
            }
        }
    };

    FiletypeColorView.prototype.clearAllPanes = function() {
        paneView = document.querySelector(".panes");
        elements = paneView.querySelectorAll("li .title");

        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            this.clearElement(el);
        }
    };

    FiletypeColorView.prototype.colorElement = function(el) {
        var fileName = el.innerHTML;

        var ext = fileName.split('.').pop();
        var className = "filetype-color-" + ext;
        this.clearElement(el);
        el.className = el.className + " " + className;
    };

    FiletypeColorView.prototype.clearElement = function(el) {
        el.className = el.className.replace(/\sfiletype-color-[\S]+/, '');
    };

    return FiletypeColorView;

})(View);

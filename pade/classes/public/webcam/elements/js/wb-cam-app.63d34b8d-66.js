
Polymer({
    is: "iron-collapse",
    behaviors: [Polymer.IronResizableBehavior],
    properties: {
        horizontal: {
            type: Boolean,
            value: !1,
            observer: "_horizontalChanged"
        },
        opened: {
            type: Boolean,
            value: !1,
            notify: !0,
            observer: "_openedChanged"
        },
        transitioning: {
            type: Boolean,
            notify: !0,
            readOnly: !0
        },
        noAnimation: {
            type: Boolean
        },
        _desiredSize: {
            type: String,
            value: ""
        }
    },
    get dimension() {
        return this.horizontal ? "width" : "height"
    },
    get _dimensionMax() {
        return this.horizontal ? "maxWidth" : "maxHeight"
    },
    get _dimensionMaxCss() {
        return this.horizontal ? "max-width" : "max-height"
    },
    hostAttributes: {
        role: "group",
        "aria-hidden": "true",
        "aria-expanded": "false"
    },
    listeners: {
        transitionend: "_onTransitionEnd"
    },
    toggle: function() {
        this.opened = !this.opened
    },
    show: function() {
        this.opened = !0
    },
    hide: function() {
        this.opened = !1
    },
    updateSize: function(i, t) {
        i = "auto" === i ? "" : i;
        var e = t && !this.noAnimation && this.isAttached && this._desiredSize !== i;
        if (this._desiredSize = i, this._updateTransition(!1), e) {
            var n = this._calcSize();
            "" === i && (this.style[this._dimensionMax] = "", i = this._calcSize()), this.style[this._dimensionMax] = n, this.scrollTop = this.scrollTop, this._updateTransition(!0), e = i !== n
        }
        this.style[this._dimensionMax] = i, e || this._transitionEnd()
    },
    enableTransition: function(i) {
        Polymer.Base._warn("`enableTransition()` is deprecated, use `noAnimation` instead."), this.noAnimation = !i
    },
    _updateTransition: function(i) {
        this.style.transitionDuration = i && !this.noAnimation ? "" : "0s"
    },
    _horizontalChanged: function() {
        this.style.transitionProperty = this._dimensionMaxCss;
        var i = "maxWidth" === this._dimensionMax ? "maxHeight" : "maxWidth";
        this.style[i] = "", this.updateSize(this.opened ? "auto" : "0px", !1)
    },
    _openedChanged: function() {
        this.setAttribute("aria-expanded", this.opened), this.setAttribute("aria-hidden", !this.opened), this._setTransitioning(!0), this.toggleClass("iron-collapse-closed", !1), this.toggleClass("iron-collapse-opened", !1), this.updateSize(this.opened ? "auto" : "0px", !0), this.opened && this.focus()
    },
    _transitionEnd: function() {
        this.style[this._dimensionMax] = this._desiredSize, this.toggleClass("iron-collapse-closed", !this.opened), this.toggleClass("iron-collapse-opened", this.opened), this._updateTransition(!1), this.notifyResize(), this._setTransitioning(!1)
    },
    _onTransitionEnd: function(i) {
        Polymer.dom(i).rootTarget === this && this._transitionEnd()
    },
    _calcSize: function() {
        return this.getBoundingClientRect()[this.dimension] + "px"
    }
});

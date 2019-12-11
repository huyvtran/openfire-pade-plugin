
! function() {
    "use strict";
    Polymer.PaperScrollHeaderPanel = Polymer({
        is: "paper-scroll-header-panel",
        behaviors: [Polymer.IronResizableBehavior],
        properties: {
            condenses: {
                type: Boolean,
                value: !1
            },
            noDissolve: {
                type: Boolean,
                value: !1
            },
            noReveal: {
                type: Boolean,
                value: !1
            },
            fixed: {
                type: Boolean,
                value: !1
            },
            keepCondensedHeader: {
                type: Boolean,
                value: !1
            },
            headerHeight: {
                type: Number,
                value: 0
            },
            condensedHeaderHeight: {
                type: Number,
                value: 0
            },
            scrollAwayTopbar: {
                type: Boolean,
                value: !1
            },
            headerState: {
                type: Number,
                readOnly: !0,
                notify: !0,
                value: 0
            },
            _defaultCondsensedHeaderHeight: {
                type: Number,
                value: 0
            }
        },
        observers: ["_setup(headerHeight, condensedHeaderHeight, fixed)", "_condensedHeaderHeightChanged(condensedHeaderHeight)", "_headerHeightChanged(headerHeight, condensedHeaderHeight)", "_condensesChanged(condenses)"],
        listeners: {
            "iron-resize": "measureHeaderHeight"
        },
        ready: function() {
            this._scrollHandler = this._scroll.bind(this), this.scroller.addEventListener("scroll", this._scrollHandler)
        },
        attached: function() {
            this.async(this.measureHeaderHeight, 1)
        },
        get header() {
            return Polymer.dom(this.$.headerContent).getDistributedNodes()[0]
        },
        get content() {
            return Polymer.dom(this.$.mainContent).getDistributedNodes()[0]
        },
        get scroller() {
            return this.$.mainContainer
        },
        get _headerMaxDelta() {
            return this.keepCondensedHeader ? this._headerMargin : this.headerHeight
        },
        get _headerMargin() {
            return this.headerHeight - this.condensedHeaderHeight
        },
        _y: 0,
        _prevScrollTop: 0,
        measureHeaderHeight: function() {
            var e = this.header;
            e && e.offsetHeight && (this.headerHeight = e.offsetHeight)
        },
        scroll: function(e, t) {
            if (t) {
                var s = function(e, t, s, r) {
                        return e /= r, -s * e * (e - 2) + t
                    },
                    r = Math.random(),
                    a = 200,
                    i = Date.now(),
                    n = this.scroller.scrollTop,
                    h = e - n;
                this._currentAnimationId = r,
                    function t() {
                        var o = Date.now(),
                            d = o - i;
                        d > a ? (this.scroller.scrollTop = e, this._updateScrollState(e)) : this._currentAnimationId === r && (this.scroller.scrollTop = s(d, n, h, a), requestAnimationFrame(t.bind(this)))
                    }.call(this)
            } else this.scroller.scrollTop = e, this._updateScrollState(e)
        },
        condense: function(e) {
            if (this.condenses && !this.fixed && !this.noReveal) switch (this.headerState) {
                case 1:
                    this.scroll(this.scroller.scrollTop - (this._headerMaxDelta - this._headerMargin), e);
                    break;
                case 0:
                case 3:
                    this.scroll(this._headerMargin, e)
            }
        },
        scrollToTop: function(e) {
            this.scroll(0, e)
        },
        _headerHeightChanged: function(e) {
            null !== this._defaultCondsensedHeaderHeight && (this._defaultCondsensedHeaderHeight = Math.round(1 * e / 3), this.condensedHeaderHeight = this._defaultCondsensedHeaderHeight)
        },
        _condensedHeaderHeightChanged: function(e) {
            e && this._defaultCondsensedHeaderHeight != e && (this._defaultCondsensedHeaderHeight = null)
        },
        _condensesChanged: function() {
            this._updateScrollState(this.scroller.scrollTop), this._condenseHeader(null)
        },
        _setup: function() {
            var e = this.scroller.style;
            if (e.paddingTop = this.fixed ? "" : this.headerHeight + "px", e.top = this.fixed ? this.headerHeight + "px" : "", this.fixed) this._setHeaderState(0), this._transformHeader(null);
            else switch (this.headerState) {
                case 1:
                    this._transformHeader(this._headerMaxDelta);
                    break;
                case 2:
                    this._transformHeader(this._headerMargin)
            }
        },
        _transformHeader: function(e) {
            this._translateY(this.$.headerContainer, -e), this.condenses && this._condenseHeader(e), this.fire("paper-header-transform", {
                y: e,
                height: this.headerHeight,
                condensedHeight: this.condensedHeaderHeight
            })
        },
        _condenseHeader: function(e) {
            var t = null === e;
            !this.scrollAwayTopbar && this.header && this.header.$ && this.header.$.topBar && this._translateY(this.header.$.topBar, t ? null : Math.min(e, this._headerMargin)), this.noDissolve || (this.$.headerBg.style.opacity = t ? "" : (this._headerMargin - e) / this._headerMargin), this._translateY(this.$.headerBg, t ? null : e / 2), this.noDissolve || (this.$.condensedHeaderBg.style.opacity = t ? "" : e / this._headerMargin, this._translateY(this.$.condensedHeaderBg, t ? null : e / 2))
        },
        _translateY: function(e, t) {
            this.transform(null === t ? "" : "translate3d(0, " + t + "px, 0)", e)
        },
        _scroll: function(e) {
            this.header && (this._updateScrollState(this.scroller.scrollTop), this.fire("content-scroll", {
                target: this.scroller
            }, {
                cancelable: !1
            }))
        },
        _updateScrollState: function(e) {
            var t = e - this._prevScrollTop,
                s = Math.max(0, this.noReveal ? e : this._y + t);
            s > this._headerMaxDelta ? (s = this._headerMaxDelta, this.keepCondensedHeader ? this._setHeaderState(2) : this._setHeaderState(1)) : this.condenses && e >= this._headerMargin ? (s = Math.max(s, this._headerMargin), this._setHeaderState(2)) : 0 === s ? this._setHeaderState(0) : this._setHeaderState(3), this.fixed || s === this._y || this._transformHeader(s), this._prevScrollTop = Math.max(e, 0), this._y = s
        }
    }), Polymer.PaperScrollHeaderPanel.HEADER_STATE_EXPANDED = 0, Polymer.PaperScrollHeaderPanel.HEADER_STATE_HIDDEN = 1, Polymer.PaperScrollHeaderPanel.HEADER_STATE_CONDENSED = 2, Polymer.PaperScrollHeaderPanel.HEADER_STATE_INTERPOLATED = 3
}();

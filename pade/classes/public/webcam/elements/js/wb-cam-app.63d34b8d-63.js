
Polymer({
    is: "iron-image",
    properties: {
        src: {
            observer: "_srcChanged",
            type: String,
            value: ""
        },
        alt: {
            type: String,
            value: null
        },
        preventLoad: {
            type: Boolean,
            value: !1,
            observer: "_preventLoadChanged"
        },
        sizing: {
            type: String,
            value: null,
            reflectToAttribute: !0
        },
        position: {
            type: String,
            value: "center"
        },
        preload: {
            type: Boolean,
            value: !1
        },
        placeholder: {
            type: String,
            value: null,
            observer: "_placeholderChanged"
        },
        fade: {
            type: Boolean,
            value: !1
        },
        loaded: {
            notify: !0,
            readOnly: !0,
            type: Boolean,
            value: !1
        },
        loading: {
            notify: !0,
            readOnly: !0,
            type: Boolean,
            value: !1
        },
        error: {
            notify: !0,
            readOnly: !0,
            type: Boolean,
            value: !1
        },
        width: {
            observer: "_widthChanged",
            type: Number,
            value: null
        },
        height: {
            observer: "_heightChanged",
            type: Number,
            value: null
        }
    },
    observers: ["_transformChanged(sizing, position)"],
    ready: function() {
        var e = this.$.img;
        e.onload = function() {
            this.$.img.src === this._resolveSrc(this.src) && (this._setLoading(!1), this._setLoaded(!0), this._setError(!1))
        }.bind(this), e.onerror = function() {
            this.$.img.src === this._resolveSrc(this.src) && (this._reset(), this._setLoading(!1), this._setLoaded(!1), this._setError(!0))
        }.bind(this), this._resolvedSrc = ""
    },
    _load: function(e) {
        e ? this.$.img.src = e : this.$.img.removeAttribute("src"), this.$.sizedImgDiv.style.backgroundImage = e ? 'url("' + e + '")' : "", this._setLoading(!!e), this._setLoaded(!1), this._setError(!1)
    },
    _reset: function() {
        this.$.img.removeAttribute("src"), this.$.sizedImgDiv.style.backgroundImage = "", this._setLoading(!1), this._setLoaded(!1), this._setError(!1)
    },
    _computePlaceholderHidden: function() {
        return !this.preload || !this.fade && !this.loading && this.loaded
    },
    _computePlaceholderClassName: function() {
        return this.preload && this.fade && !this.loading && this.loaded ? "faded-out" : ""
    },
    _computeImgDivHidden: function() {
        return !this.sizing
    },
    _computeImgDivARIAHidden: function() {
        return "" === this.alt ? "true" : void 0
    },
    _computeImgDivARIALabel: function() {
        if (null !== this.alt) return this.alt;
        if ("" === this.src) return "";
        var e = new URL(this._resolveSrc(this.src)).pathname.split("/");
        return e[e.length - 1]
    },
    _computeImgHidden: function() {
        return !!this.sizing
    },
    _widthChanged: function() {
        this.style.width = isNaN(this.width) ? this.width : this.width + "px"
    },
    _heightChanged: function() {
        this.style.height = isNaN(this.height) ? this.height : this.height + "px"
    },
    _preventLoadChanged: function() {
        this.preventLoad || this.loaded || (this._reset(), this._load(this.src))
    },
    _srcChanged: function(e, t) {
        var i = this._resolveSrc(e);
        i !== this._resolvedSrc && (this._resolvedSrc = i, this._reset(), this.preventLoad || this._load(e))
    },
    _placeholderChanged: function() {
        this.$.placeholder.style.backgroundImage = this.placeholder ? 'url("' + this.placeholder + '")' : ""
    },
    _transformChanged: function() {
        var e = this.$.sizedImgDiv.style,
            t = this.$.placeholder.style;
        e.backgroundSize = t.backgroundSize = this.sizing, e.backgroundPosition = t.backgroundPosition = this.sizing ? this.position : "", e.backgroundRepeat = t.backgroundRepeat = this.sizing ? "no-repeat" : ""
    },
    _resolveSrc: function(e) {
        var t = this.ownerDocument.baseURI;
        return new URL(Polymer.ResolveUrl.resolveUrl(e, t), t).href
    }
});

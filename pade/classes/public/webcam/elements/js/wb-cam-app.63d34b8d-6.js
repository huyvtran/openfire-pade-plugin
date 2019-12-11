
Polymer({
    is: "iron-iconset-svg",
    properties: {
        name: {
            type: String,
            observer: "_nameChanged"
        },
        size: {
            type: Number,
            value: 24
        },
        rtlMirroring: {
            type: Boolean,
            value: !1
        }
    },
    attached: function() {
        this.style.display = "none"
    },
    getIconNames: function() {
        return this._icons = this._createIconMap(), Object.keys(this._icons).map(function(e) {
            return this.name + ":" + e
        }, this)
    },
    applyIcon: function(e, t) {
        e = e.root || e, this.removeIcon(e);
        var n = this._cloneIcon(t, this.rtlMirroring && this._targetIsRTL(e));
        if (n) {
            var r = Polymer.dom(e);
            return r.insertBefore(n, r.childNodes[0]), e._svgIcon = n
        }
        return null
    },
    removeIcon: function(e) {
        e = e.root || e, e._svgIcon && (Polymer.dom(e).removeChild(e._svgIcon), e._svgIcon = null)
    },
    _targetIsRTL: function(e) {
        return null == this.__targetIsRTL && (e && e.nodeType !== Node.ELEMENT_NODE && (e = e.host), this.__targetIsRTL = e && "rtl" === window.getComputedStyle(e).direction), this.__targetIsRTL
    },
    _nameChanged: function() {
        new Polymer.IronMeta({
            type: "iconset",
            key: this.name,
            value: this
        }), this.async(function() {
            this.fire("iron-iconset-added", this, {
                node: window
            })
        })
    },
    _createIconMap: function() {
        var e = Object.create(null);
        return Polymer.dom(this).querySelectorAll("[id]").forEach(function(t) {
            e[t.id] = t
        }), e
    },
    _cloneIcon: function(e, t) {
        return this._icons = this._icons || this._createIconMap(), this._prepareSvgClone(this._icons[e], this.size, t)
    },
    _prepareSvgClone: function(e, t, n) {
        if (e) {
            var r = e.cloneNode(!0),
                i = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
                o = r.getAttribute("viewBox") || "0 0 " + t + " " + t,
                s = "pointer-events: none; display: block; width: 100%; height: 100%;";
            return n && r.hasAttribute("mirror-in-rtl") && (s += "-webkit-transform:scale(-1,1);transform:scale(-1,1);"), i.setAttribute("viewBox", o), i.setAttribute("preserveAspectRatio", "xMidYMid meet"), i.setAttribute("focusable", "false"), i.style.cssText = s, i.appendChild(r).removeAttribute("id"), i
        }
        return null
    }
});


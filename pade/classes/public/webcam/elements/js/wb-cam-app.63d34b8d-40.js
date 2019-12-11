
Polymer.PaperSpinnerBehavior = {
    listeners: {
        animationend: "__reset",
        webkitAnimationEnd: "__reset"
    },
    properties: {
        active: {
            type: Boolean,
            value: !1,
            reflectToAttribute: !0,
            observer: "__activeChanged"
        },
        alt: {
            type: String,
            value: "loading",
            observer: "__altChanged"
        },
        __coolingDown: {
            type: Boolean,
            value: !1
        }
    },
    __computeContainerClasses: function(e, t) {
        return [e || t ? "active" : "", t ? "cooldown" : ""].join(" ")
    },
    __activeChanged: function(e, t) {
        this.__setAriaHidden(!e), this.__coolingDown = !e && t
    },
    __altChanged: function(e) {
        e === this.getPropertyInfo("alt").value ? this.alt = this.getAttribute("aria-label") || e : (this.__setAriaHidden("" === e), this.setAttribute("aria-label", e))
    },
    __setAriaHidden: function(e) {
        var t = "aria-hidden";
        e ? this.setAttribute(t, "true") : this.removeAttribute(t)
    },
    __reset: function() {
        this.active = !1, this.__coolingDown = !1
    }
};

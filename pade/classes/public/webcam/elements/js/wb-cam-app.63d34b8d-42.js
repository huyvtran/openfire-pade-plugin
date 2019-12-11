
Polymer({
    is: "iron-localstorage",
    properties: {
        name: {
            type: String,
            value: ""
        },
        value: {
            type: Object,
            notify: !0
        },
        useRaw: {
            type: Boolean,
            value: !1
        },
        autoSaveDisabled: {
            type: Boolean,
            value: !1
        },
        errorMessage: {
            type: String,
            notify: !0
        },
        _loaded: {
            type: Boolean,
            value: !1
        }
    },
    observers: ["_debounceReload(name,useRaw)", "_trySaveValue(autoSaveDisabled)", "_trySaveValue(value.*)"],
    ready: function() {
        this._boundHandleStorage = this._handleStorage.bind(this)
    },
    attached: function() {
        window.addEventListener("storage", this._boundHandleStorage)
    },
    detached: function() {
        window.removeEventListener("storage", this._boundHandleStorage)
    },
    _handleStorage: function(e) {
        e.key == this.name && this._load(!0)
    },
    _trySaveValue: function() {
        this._doNotSave || this._loaded && !this.autoSaveDisabled && this.debounce("save", this.save)
    },
    _debounceReload: function() {
        this.debounce("reload", this.reload)
    },
    reload: function() {
        this._loaded = !1, this._load()
    },
    _load: function(e) {
        try {
            var a = window.localStorage.getItem(this.name)
        } catch (e) {
            this.errorMessage = e.message, this._error("Could not save to localStorage.  Try enabling cookies for this page.", e)
        }
        if (null === a) this._loaded = !0, this._doNotSave = !0, this.value = null, this._doNotSave = !1, this.fire("iron-localstorage-load-empty", {
            externalChange: e
        });
        else {
            if (!this.useRaw) try {
                a = JSON.parse(a)
            } catch (e) {
                this.errorMessage = "Could not parse local storage value", Polymer.Base._error("could not parse local storage value", a), a = null
            }
            this._loaded = !0, this._doNotSave = !0, this.value = a, this._doNotSave = !1, this.fire("iron-localstorage-load", {
                externalChange: e
            })
        }
    },
    save: function() {
        var e = this.useRaw ? this.value : JSON.stringify(this.value);
        try {
            null === this.value || void 0 === this.value ? window.localStorage.removeItem(this.name) : window.localStorage.setItem(this.name, e)
        } catch (e) {
            this.errorMessage = e.message, Polymer.Base._error("Could not save to localStorage. Incognito mode may be blocking this action", e)
        }
    }
});

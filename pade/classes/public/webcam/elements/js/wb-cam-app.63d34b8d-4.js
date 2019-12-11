
! function() {
    var e = {},
        t = {},
        i = null;
    Polymer.IronMeta = Polymer({
        is: "iron-meta",
        properties: {
            type: {
                type: String,
                value: "default",
                observer: "_typeChanged"
            },
            key: {
                type: String,
                observer: "_keyChanged"
            },
            value: {
                type: Object,
                notify: !0,
                observer: "_valueChanged"
            },
            self: {
                type: Boolean,
                observer: "_selfChanged"
            },
            list: {
                type: Array,
                notify: !0
            }
        },
        hostAttributes: {
            hidden: !0
        },
        factoryImpl: function(e) {
            if (e)
                for (var t in e) switch (t) {
                    case "type":
                    case "key":
                    case "value":
                        this[t] = e[t]
                }
        },
        created: function() {
            this._metaDatas = e, this._metaArrays = t
        },
        _keyChanged: function(e, t) {
            this._resetRegistration(t)
        },
        _valueChanged: function(e) {
            this._resetRegistration(this.key)
        },
        _selfChanged: function(e) {
            e && (this.value = this)
        },
        _typeChanged: function(i) {
            this._unregisterKey(this.key), e[i] || (e[i] = {}), this._metaData = e[i], t[i] || (t[i] = []), this.list = t[i], this._registerKeyValue(this.key, this.value)
        },
        byKey: function(e) {
            return this._metaData && this._metaData[e]
        },
        _resetRegistration: function(e) {
            this._unregisterKey(e), this._registerKeyValue(this.key, this.value)
        },
        _unregisterKey: function(e) {
            this._unregister(e, this._metaData, this.list)
        },
        _registerKeyValue: function(e, t) {
            this._register(e, t, this._metaData, this.list)
        },
        _register: function(e, t, i, a) {
            e && i && void 0 !== t && (i[e] = t, a.push(t))
        },
        _unregister: function(e, t, i) {
            if (e && t && e in t) {
                var a = t[e];
                delete t[e], this.arrayDelete(i, a)
            }
        }
    }), Polymer.IronMeta.getIronMeta = function() {
        return null === i && (i = new Polymer.IronMeta), i
    }, Polymer.IronMetaQuery = Polymer({
        is: "iron-meta-query",
        properties: {
            type: {
                type: String,
                value: "default",
                observer: "_typeChanged"
            },
            key: {
                type: String,
                observer: "_keyChanged"
            },
            value: {
                type: Object,
                notify: !0,
                readOnly: !0
            },
            list: {
                type: Array,
                notify: !0
            }
        },
        factoryImpl: function(e) {
            if (e)
                for (var t in e) switch (t) {
                    case "type":
                    case "key":
                        this[t] = e[t]
                }
        },
        created: function() {
            this._metaDatas = e, this._metaArrays = t
        },
        _keyChanged: function(e) {
            this._setValue(this._metaData && this._metaData[e])
        },
        _typeChanged: function(i) {
            this._metaData = e[i], this.list = t[i], this.key && this._keyChanged(this.key)
        },
        byKey: function(e) {
            return this._metaData && this._metaData[e]
        }
    })
}();

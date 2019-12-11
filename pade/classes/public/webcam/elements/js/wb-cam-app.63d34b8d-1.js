! function() {
    function e() {
        document.body.removeAttribute("unresolved")
    }
    window.WebComponents ? addEventListener("WebComponentsReady", e) : "interactive" === document.readyState || "complete" === document.readyState ? e() : addEventListener("DOMContentLoaded", e)
}(), window.Polymer = {
        Settings: function() {
            var e = window.Polymer || {};
            if (!e.noUrlSettings)
                for (var t, r = location.search.slice(1).split("&"), i = 0; i < r.length && (t = r[i]); i++) t = t.split("="), t[0] && (e[t[0]] = t[1] || !0);
            return e.wantShadow = "shadow" === e.dom, e.hasShadow = Boolean(Element.prototype.createShadowRoot), e.nativeShadow = e.hasShadow && !window.ShadowDOMPolyfill, e.useShadow = e.wantShadow && e.hasShadow, e.hasNativeImports = Boolean("import" in document.createElement("link")), e.useNativeImports = e.hasNativeImports, e.useNativeCustomElements = !window.CustomElements || window.CustomElements.useNative, e.useNativeShadow = e.useShadow && e.nativeShadow, e.usePolyfillProto = !e.useNativeCustomElements && !Object.__proto__, e.hasNativeCSSProperties = !navigator.userAgent.match(/AppleWebKit\/601|Edge\/15/) && window.CSS && CSS.supports && CSS.supports("box-shadow", "0 0 0 var(--foo)"), e.useNativeCSSProperties = e.hasNativeCSSProperties && e.lazyRegister && e.useNativeCSSProperties, e.isIE = navigator.userAgent.match("Trident"), e.passiveTouchGestures = e.passiveTouchGestures || !1, e
        }()
    },
    function() {
        var e = window.Polymer;
        window.Polymer = function(e) {
            "function" == typeof e && (e = e.prototype), e || (e = {}), e = t(e);
            var r = e === e.constructor.prototype ? e.constructor : null,
                i = {
                    prototype: e
                };
            e.extends && (i.extends = e.extends), Polymer.telemetry._registrate(e);
            var s = document.registerElement(e.is, i);
            return r || s
        };
        var t = function(e) {
            var t = Polymer.Base;
            return e.extends && (t = Polymer.Base._getExtendedPrototype(e.extends)), e = Polymer.Base.chainObject(e, t), e.registerCallback(), e
        };
        if (e)
            for (var r in e) Polymer[r] = e[r];
        Polymer.Class = function(e) {
            return e.factoryImpl || (e.factoryImpl = function() {}), t(e).constructor
        }
    }(), Polymer.telemetry = {
        registrations: [],
        _regLog: function(e) {
            console.log("[" + e.is + "]: registered")
        },
        _registrate: function(e) {
            this.registrations.push(e), Polymer.log && this._regLog(e)
        },
        dumpRegistrations: function() {
            this.registrations.forEach(this._regLog)
        }
    }, Object.defineProperty(window, "currentImport", {
        enumerable: !0,
        configurable: !0,
        get: function() {
            return (document._currentScript || document.currentScript || {}).ownerDocument
        }
    }), Polymer.RenderStatus = {
        _ready: !1,
        _callbacks: [],
        whenReady: function(e) {
            this._ready ? e() : this._callbacks.push(e)
        },
        _makeReady: function() {
            this._ready = !0;
            for (var e = 0; e < this._callbacks.length; e++) this._callbacks[e]();
            this._callbacks = []
        },
        _catchFirstRender: function() {
            requestAnimationFrame(function() {
                Polymer.RenderStatus._makeReady()
            })
        },
        _afterNextRenderQueue: [],
        _waitingNextRender: !1,
        afterNextRender: function(e, t, r) {
            this._watchNextRender(), this._afterNextRenderQueue.push([e, t, r])
        },
        hasRendered: function() {
            return this._ready
        },
        _watchNextRender: function() {
            if (!this._waitingNextRender) {
                this._waitingNextRender = !0;
                var e = function() {
                    Polymer.RenderStatus._flushNextRender()
                };
                this._ready ? requestAnimationFrame(e) : this.whenReady(e)
            }
        },
        _flushNextRender: function() {
            var e = this;
            setTimeout(function() {
                e._flushRenderCallbacks(e._afterNextRenderQueue), e._afterNextRenderQueue = [], e._waitingNextRender = !1
            })
        },
        _flushRenderCallbacks: function(e) {
            for (var t, r = 0; r < e.length; r++) t = e[r], t[1].apply(t[0], t[2] || Polymer.nar)
        }
    }, window.HTMLImports ? HTMLImports.whenReady(function() {
        Polymer.RenderStatus._catchFirstRender()
    }) : Polymer.RenderStatus._catchFirstRender(), Polymer.ImportStatus = Polymer.RenderStatus, Polymer.ImportStatus.whenLoaded = Polymer.ImportStatus.whenReady,
    function() {
        "use strict";
        var e = Polymer.Settings;
        Polymer.Base = {
            __isPolymerInstance__: !0,
            _addFeature: function(e) {
                this.mixin(this, e)
            },
            registerCallback: function() {
                if ("max" === e.lazyRegister) this.beforeRegister && this.beforeRegister();
                else {
                    this._desugarBehaviors();
                    for (var t, r = 0; r < this.behaviors.length; r++) t = this.behaviors[r], t.beforeRegister && t.beforeRegister.call(this);
                    this.beforeRegister && this.beforeRegister()
                }
                this._registerFeatures(), e.lazyRegister || this.ensureRegisterFinished()
            },
            createdCallback: function() {
                if (e.disableUpgradeEnabled) {
                    if (this.hasAttribute("disable-upgrade")) return this._propertySetter = t, this._configValue = null, void(this.__data__ = {});
                    this.__hasInitialized = !0
                }
                this.__initialize()
            },
            __initialize: function() {
                this.__hasRegisterFinished || this._ensureRegisterFinished(this.__proto__), Polymer.telemetry.instanceCount++, this.root = this;
                for (var e, t = 0; t < this.behaviors.length; t++) e = this.behaviors[t], e.created && e.created.call(this);
                this.created && this.created(), this._initFeatures()
            },
            ensureRegisterFinished: function() {
                this._ensureRegisterFinished(this)
            },
            _ensureRegisterFinished: function(t) {
                if (t.__hasRegisterFinished !== t.is || !t.is) {
                    if ("max" === e.lazyRegister) {
                        t._desugarBehaviors();
                        for (var r, i = 0; i < t.behaviors.length; i++) r = t.behaviors[i], r.beforeRegister && r.beforeRegister.call(t)
                    }
                    t.__hasRegisterFinished = t.is, t._finishRegisterFeatures && t._finishRegisterFeatures();
                    for (var s, o = 0; o < t.behaviors.length; o++) s = t.behaviors[o], s.registered && s.registered.call(t);
                    t.registered && t.registered(), e.usePolyfillProto && t !== this && t.extend(this, t)
                }
            },
            attachedCallback: function() {
                var e = this;
                Polymer.RenderStatus.whenReady(function() {
                    e.isAttached = !0;
                    for (var t, r = 0; r < e.behaviors.length; r++) t = e.behaviors[r], t.attached && t.attached.call(e);
                    e.attached && e.attached()
                })
            },
            detachedCallback: function() {
                var e = this;
                Polymer.RenderStatus.whenReady(function() {
                    e.isAttached = !1;
                    for (var t, r = 0; r < e.behaviors.length; r++) t = e.behaviors[r], t.detached && t.detached.call(e);
                    e.detached && e.detached()
                })
            },
            attributeChangedCallback: function(e, t, r) {
                this._attributeChangedImpl(e);
                for (var i, s = 0; s < this.behaviors.length; s++) i = this.behaviors[s], i.attributeChanged && i.attributeChanged.call(this, e, t, r);
                this.attributeChanged && this.attributeChanged(e, t, r)
            },
            _attributeChangedImpl: function(e) {
                this._setAttributeToProperty(this, e)
            },
            extend: function(e, t) {
                if (e && t)
                    for (var r, i = Object.getOwnPropertyNames(t), s = 0; s < i.length && (r = i[s]); s++) this.copyOwnProperty(r, t, e);
                return e || t
            },
            mixin: function(e, t) {
                for (var r in t) e[r] = t[r];
                return e
            },
            copyOwnProperty: function(e, t, r) {
                var i = Object.getOwnPropertyDescriptor(t, e);
                i && Object.defineProperty(r, e, i)
            },
            _logger: function(e, t) {
                switch (1 === t.length && Array.isArray(t[0]) && (t = t[0]), e) {
                    case "log":
                    case "warn":
                    case "error":
                        console[e].apply(console, t)
                }
            },
            _log: function() {
                var e = Array.prototype.slice.call(arguments, 0);
                this._logger("log", e)
            },
            _warn: function() {
                var e = Array.prototype.slice.call(arguments, 0);
                this._logger("warn", e)
            },
            _error: function() {
                var e = Array.prototype.slice.call(arguments, 0);
                this._logger("error", e)
            },
            _logf: function() {
                return this._logPrefix.concat(this.is).concat(Array.prototype.slice.call(arguments, 0))
            }
        }, Polymer.Base._logPrefix = function() {
            var e = window.chrome && !/edge/i.test(navigator.userAgent) || /firefox/i.test(navigator.userAgent);
            return e ? ["%c[%s::%s]:", "font-weight: bold; background-color:#EEEE00;"] : ["[%s::%s]:"]
        }(), Polymer.Base.chainObject = function(e, t) {
            return e && t && e !== t && (Object.__proto__ || (e = Polymer.Base.extend(Object.create(t), e)), e.__proto__ = t), e
        }, Polymer.Base = Polymer.Base.chainObject(Polymer.Base, HTMLElement.prototype), Polymer.BaseDescriptors = {};
        var t;
        if (e.disableUpgradeEnabled) {
            t = function(e, t) {
                this.__data__[e] = t
            };
            var r = Polymer.Base.attributeChangedCallback;
            Polymer.Base.attributeChangedCallback = function(e, t, i) {
                this.__hasInitialized || "disable-upgrade" !== e || (this.__hasInitialized = !0, this._propertySetter = Polymer.Bind._modelApi._propertySetter, this._configValue = Polymer.Base._configValue, this.__initialize()), r.call(this, e, t, i)
            }
        }
        window.CustomElements ? Polymer.instanceof = CustomElements.instanceof : Polymer.instanceof = function(e, t) {
            return e instanceof t
        }, Polymer.isInstance = function(e) {
            return Boolean(e && e.__isPolymerInstance__)
        }, Polymer.telemetry.instanceCount = 0
    }(),
    function() {
        function e() {
            if (o)
                for (var e, t = document._currentScript || document.currentScript, r = t && t.ownerDocument || document, i = r.querySelectorAll("dom-module"), s = i.length - 1; s >= 0 && (e = i[s]); s--) {
                    if (e.__upgraded__) return;
                    CustomElements.upgrade(e)
                }
        }
        var t = {},
            r = {},
            i = function(e) {
                return t[e] || r[e.toLowerCase()]
            },
            s = function() {
                return document.createElement("dom-module")
            };
        s.prototype = Object.create(HTMLElement.prototype), Polymer.Base.mixin(s.prototype, {
            createdCallback: function() {
                this.register()
            },
            register: function(e) {
                e = e || this.id || this.getAttribute("name") || this.getAttribute("is"), e && (this.id = e, t[e] = this, r[e.toLowerCase()] = this)
            },
            import: function(t, r) {
                if (t) {
                    var s = i(t);
                    return s || (e(), s = i(t)), s && r && (s = s.querySelector(r)), s
                }
            }
        }), Object.defineProperty(s.prototype, "constructor", {
            value: s,
            configurable: !0,
            writable: !0
        });
        var o = window.CustomElements && !CustomElements.useNative;
        document.registerElement("dom-module", s)
    }(), Polymer.Base._addFeature({
        _prepIs: function() {
            if (!this.is) {
                var e = (document._currentScript || document.currentScript).parentNode;
                if ("dom-module" === e.localName) {
                    var t = e.id || e.getAttribute("name") || e.getAttribute("is");
                    this.is = t
                }
            }
            this.is && (this.is = this.is.toLowerCase())
        }
    }), Polymer.Base._addFeature({
        behaviors: [],
        _desugarBehaviors: function() {
            this.behaviors.length && (this.behaviors = this._desugarSomeBehaviors(this.behaviors))
        },
        _desugarSomeBehaviors: function(e) {
            var t = [];
            e = this._flattenBehaviorsList(e);
            for (var r = e.length - 1; r >= 0; r--) {
                var i = e[r];
                t.indexOf(i) === -1 && (this._mixinBehavior(i), t.unshift(i))
            }
            return t
        },
        _flattenBehaviorsList: function(e) {
            for (var t = [], r = 0; r < e.length; r++) {
                var i = e[r];
                i instanceof Array ? t = t.concat(this._flattenBehaviorsList(i)) : i ? t.push(i) : this._warn(this._logf("_flattenBehaviorsList", "behavior is null, check for missing or 404 import"))
            }
            return t
        },
        _mixinBehavior: function(e) {
            for (var t, r = Object.getOwnPropertyNames(e), i = e._noAccessors, s = 0; s < r.length && (t = r[s]); s++) Polymer.Base._behaviorProperties[t] || this.hasOwnProperty(t) || (i ? this[t] = e[t] : this.copyOwnProperty(t, e, this))
        },
        _prepBehaviors: function() {
            this._prepFlattenedBehaviors(this.behaviors)
        },
        _prepFlattenedBehaviors: function(e) {
            for (var t = 0, r = e.length; t < r; t++) this._prepBehavior(e[t]);
            this._prepBehavior(this)
        },
        _marshalBehaviors: function() {
            for (var e = 0; e < this.behaviors.length; e++) this._marshalBehavior(this.behaviors[e]);
            this._marshalBehavior(this)
        }
    }), Polymer.Base._behaviorProperties = {
        hostAttributes: !0,
        beforeRegister: !0,
        registered: !0,
        properties: !0,
        observers: !0,
        listeners: !0,
        created: !0,
        attached: !0,
        detached: !0,
        attributeChanged: !0,
        ready: !0,
        _noAccessors: !0
    }, Polymer.Base._addFeature({
        _getExtendedPrototype: function(e) {
            return this._getExtendedNativePrototype(e)
        },
        _nativePrototypes: {},
        _getExtendedNativePrototype: function(e) {
            var t = this._nativePrototypes[e];
            if (!t) {
                t = Object.create(this.getNativePrototype(e));
                for (var r, i = Object.getOwnPropertyNames(Polymer.Base), s = 0; s < i.length && (r = i[s]); s++) Polymer.BaseDescriptors[r] || (t[r] = Polymer.Base[r]);
                Object.defineProperties(t, Polymer.BaseDescriptors), this._nativePrototypes[e] = t
            }
            return t
        },
        getNativePrototype: function(e) {
            return Object.getPrototypeOf(document.createElement(e))
        }
    }), Polymer.Base._addFeature({
        _prepConstructor: function() {
            this._factoryArgs = this.extends ? [this.extends, this.is] : [this.is];
            var e = function() {
                return this._factory(arguments)
            };
            this.hasOwnProperty("extends") && (e.extends = this.extends), Object.defineProperty(this, "constructor", {
                value: e,
                writable: !0,
                configurable: !0
            }), e.prototype = this
        },
        _factory: function(e) {
            var t = document.createElement.apply(document, this._factoryArgs);
            return this.factoryImpl && this.factoryImpl.apply(t, e), t
        }
    }), Polymer.nob = Object.create(null), Polymer.Base._addFeature({
        getPropertyInfo: function(e) {
            var t = this._getPropertyInfo(e, this.properties);
            if (!t)
                for (var r = 0; r < this.behaviors.length; r++)
                    if (t = this._getPropertyInfo(e, this.behaviors[r].properties)) return t;
            return t || Polymer.nob
        },
        _getPropertyInfo: function(e, t) {
            var r = t && t[e];
            return "function" == typeof r && (r = t[e] = {
                type: r
            }), r && (r.defined = !0), r
        },
        _prepPropertyInfo: function() {
            this._propertyInfo = {};
            for (var e = 0; e < this.behaviors.length; e++) this._addPropertyInfo(this._propertyInfo, this.behaviors[e].properties);
            this._addPropertyInfo(this._propertyInfo, this.properties), this._addPropertyInfo(this._propertyInfo, this._propertyEffects)
        },
        _addPropertyInfo: function(e, t) {
            if (t) {
                var r, i;
                for (var s in t) r = e[s], i = t[s], ("_" !== s[0] || i.readOnly) && (e[s] ? (r.type || (r.type = i.type), r.readOnly || (r.readOnly = i.readOnly)) : e[s] = {
                    type: "function" == typeof i ? i : i.type,
                    readOnly: i.readOnly,
                    attribute: Polymer.CaseMap.camelToDashCase(s)
                })
            }
        }
    }),
    function() {
        var e = {
            configurable: !0,
            writable: !0,
            enumerable: !0,
            value: {}
        };
        Polymer.BaseDescriptors.properties = e, Object.defineProperty(Polymer.Base, "properties", e)
    }(), Polymer.CaseMap = {
        _caseMap: {},
        _rx: {
            dashToCamel: /-[a-z]/g,
            camelToDash: /([A-Z])/g
        },
        dashToCamelCase: function(e) {
            return this._caseMap[e] || (this._caseMap[e] = e.indexOf("-") < 0 ? e : e.replace(this._rx.dashToCamel, function(e) {
                return e[1].toUpperCase()
            }))
        },
        camelToDashCase: function(e) {
            return this._caseMap[e] || (this._caseMap[e] = e.replace(this._rx.camelToDash, "-$1").toLowerCase())
        }
    }, Polymer.Base._addFeature({
        _addHostAttributes: function(e) {
            this._aggregatedAttributes || (this._aggregatedAttributes = {}), e && this.mixin(this._aggregatedAttributes, e)
        },
        _marshalHostAttributes: function() {
            this._aggregatedAttributes && this._applyAttributes(this, this._aggregatedAttributes)
        },
        _applyAttributes: function(e, t) {
            for (var r in t)
                if (!this.hasAttribute(r) && "class" !== r) {
                    var i = t[r];
                    this.serializeValueToAttribute(i, r, this)
                }
        },
        _marshalAttributes: function() {
            this._takeAttributesToModel(this)
        },
        _takeAttributesToModel: function(e) {
            if (this.hasAttributes())
                for (var t in this._propertyInfo) {
                    var r = this._propertyInfo[t];
                    this.hasAttribute(r.attribute) && this._setAttributeToProperty(e, r.attribute, t, r)
                }
        },
        _setAttributeToProperty: function(e, t, r, i) {
            if (!this._serializing && (r = r || Polymer.CaseMap.dashToCamelCase(t), i = i || this._propertyInfo && this._propertyInfo[r], i && !i.readOnly)) {
                var s = this.getAttribute(t);
                e[r] = this.deserialize(s, i.type)
            }
        },
        _serializing: !1,
        reflectPropertyToAttribute: function(e, t, r) {
            this._serializing = !0, r = void 0 === r ? this[e] : r, this.serializeValueToAttribute(r, t || Polymer.CaseMap.camelToDashCase(e)), this._serializing = !1
        },
        serializeValueToAttribute: function(e, t, r) {
            var i = this.serialize(e);
            r = r || this, void 0 === i ? r.removeAttribute(t) : r.setAttribute(t, i)
        },
        deserialize: function(e, t) {
            switch (t) {
                case Number:
                    e = Number(e);
                    break;
                case Boolean:
                    e = null != e;
                    break;
                case Object:
                    try {
                        e = JSON.parse(e)
                    } catch (e) {}
                    break;
                case Array:
                    try {
                        e = JSON.parse(e)
                    } catch (t) {
                        e = null, console.warn("Polymer::Attributes: couldn`t decode Array as JSON")
                    }
                    break;
                case Date:
                    e = new Date(e);
                    break;
                case String:
            }
            return e
        },
        serialize: function(e) {
            switch (typeof e) {
                case "boolean":
                    return e ? "" : void 0;
                case "object":
                    if (e instanceof Date) return e.toString();
                    if (e) try {
                        return JSON.stringify(e)
                    } catch (e) {
                        return ""
                    }
                    default: return null != e ? e : void 0
            }
        }
    }), Polymer.version = "1.11.2", Polymer.Base._addFeature({
        _registerFeatures: function() {
            this._prepIs(), this._prepBehaviors(), this._prepConstructor(), this._prepPropertyInfo()
        },
        _prepBehavior: function(e) {
            this._addHostAttributes(e.hostAttributes)
        },
        _marshalBehavior: function(e) {},
        _initFeatures: function() {
            this._marshalHostAttributes(), this._marshalBehaviors()
        }
    });

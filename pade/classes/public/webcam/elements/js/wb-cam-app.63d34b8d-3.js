
! function() {
    Polymer.nar = [];
    var e = Polymer.Settings.disableUpgradeEnabled;
    Polymer.Annotations = {
        parseAnnotations: function(e, t) {
            var n = [],
                r = e._content || e.content;
            return this._parseNodeAnnotations(r, n, t || e.hasAttribute("strip-whitespace")), n
        },
        _parseNodeAnnotations: function(e, t, n) {
            return e.nodeType === Node.TEXT_NODE ? this._parseTextNodeAnnotation(e, t) : this._parseElementAnnotations(e, t, n)
        },
        _bindingRegex: function() {
            var e = "(?:[a-zA-Z_$][\\w.:$\\-*]*)",
                t = "(?:[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?)",
                n = "(?:'(?:[^'\\\\]|\\\\.)*')",
                r = '(?:"(?:[^"\\\\]|\\\\.)*")',
                s = "(?:" + n + "|" + r + ")",
                i = "(?:" + e + "|" + t + "|" + s + "\\s*)",
                o = "(?:" + i + "(?:,\\s*" + i + ")*)",
                a = "(?:\\(\\s*(?:" + o + "?)\\)\\s*)",
                l = "(" + e + "\\s*" + a + "?)",
                c = "(\\[\\[|{{)\\s*",
                h = "(?:]]|}})",
                u = "(?:(!)\\s*)?",
                f = c + u + l + h;
            return new RegExp(f, "g")
        }(),
        _parseBindings: function(e) {
            for (var t, n = this._bindingRegex, r = [], s = 0; null !== (t = n.exec(e));) {
                t.index > s && r.push({
                    literal: e.slice(s, t.index)
                });
                var i, o, a, l = t[1][0],
                    c = Boolean(t[2]),
                    h = t[3].trim();
                "{" == l && (a = h.indexOf("::")) > 0 && (o = h.substring(a + 2), h = h.substring(0, a), i = !0), r.push({
                    compoundIndex: r.length,
                    value: h,
                    mode: l,
                    negate: c,
                    event: o,
                    customEvent: i
                }), s = n.lastIndex
            }
            if (s && s < e.length) {
                var u = e.substring(s);
                u && r.push({
                    literal: u
                })
            }
            if (r.length) return r
        },
        _literalFromParts: function(e) {
            for (var t = "", n = 0; n < e.length; n++) {
                var r = e[n].literal;
                t += r || ""
            }
            return t
        },
        _parseTextNodeAnnotation: function(e, t) {
            var n = this._parseBindings(e.textContent);
            if (n) {
                e.textContent = this._literalFromParts(n) || " ";
                var r = {
                    bindings: [{
                        kind: "text",
                        name: "textContent",
                        parts: n,
                        isCompound: 1 !== n.length
                    }]
                };
                return t.push(r), r
            }
        },
        _parseElementAnnotations: function(e, t, n) {
            var r = {
                bindings: [],
                events: []
            };
            return "content" === e.localName && (t._hasContent = !0), this._parseChildNodesAnnotations(e, r, t, n), e.attributes && (this._parseNodeAttributeAnnotations(e, r, t), this.prepElement && this.prepElement(e)), (r.bindings.length || r.events.length || r.id) && t.push(r), r
        },
        _parseChildNodesAnnotations: function(e, t, n, r) {
            if (e.firstChild)
                for (var s = e.firstChild, i = 0; s;) {
                    var o = s.nextSibling;
                    if ("template" !== s.localName || s.hasAttribute("preserve-content") || this._parseTemplate(s, i, n, t, r), "slot" == s.localName && (s = this._replaceSlotWithContent(s)), s.nodeType === Node.TEXT_NODE) {
                        for (var a = o; a && a.nodeType === Node.TEXT_NODE;) s.textContent += a.textContent, o = a.nextSibling, e.removeChild(a), a = o;
                        r && !s.textContent.trim() && (e.removeChild(s), i--)
                    }
                    if (s.parentNode) {
                        var l = this._parseNodeAnnotations(s, n, r);
                        l && (l.parent = t, l.index = i)
                    }
                    s = o, i++
                }
        },
        _replaceSlotWithContent: function(e) {
            for (var t = e.ownerDocument.createElement("content"); e.firstChild;) t.appendChild(e.firstChild);
            for (var n = e.attributes, r = 0; r < n.length; r++) {
                var s = n[r];
                t.setAttribute(s.name, s.value)
            }
            var i = e.getAttribute("name");
            return i && t.setAttribute("select", "[slot='" + i + "']"), e.parentNode.replaceChild(t, e), t
        },
        _parseTemplate: function(e, t, n, r, s) {
            var i = document.createDocumentFragment();
            i._notes = this.parseAnnotations(e, s), i.appendChild(e.content), n.push({
                bindings: Polymer.nar,
                events: Polymer.nar,
                templateContent: i,
                parent: r,
                index: t
            })
        },
        _parseNodeAttributeAnnotations: function(e, t) {
            for (var n, r = Array.prototype.slice.call(e.attributes), s = r.length - 1; n = r[s]; s--) {
                var i, o = n.name,
                    a = n.value;
                "on-" === o.slice(0, 3) ? (e.removeAttribute(o), t.events.push({
                    name: o.slice(3),
                    value: a
                })) : (i = this._parseNodeAttributeAnnotation(e, o, a)) ? t.bindings.push(i) : "id" === o && (t.id = a)
            }
        },
        _parseNodeAttributeAnnotation: function(t, n, r) {
            var s = this._parseBindings(r);
            if (s) {
                var i = n,
                    o = "property";
                "$" == n[n.length - 1] && (n = n.slice(0, -1), o = "attribute");
                var a = this._literalFromParts(s);
                a && "attribute" == o && t.setAttribute(n, a), "input" === t.localName && "value" === i && t.setAttribute(i, ""), e && "disable-upgrade$" === i && t.setAttribute(n, ""), t.removeAttribute(i);
                var l = Polymer.CaseMap.dashToCamelCase(n);
                return "property" === o && (n = l), {
                    kind: o,
                    name: n,
                    propertyName: l,
                    parts: s,
                    literal: a,
                    isCompound: 1 !== s.length
                }
            }
        },
        findAnnotatedNode: function(e, t) {
            var n = t.parent && Polymer.Annotations.findAnnotatedNode(e, t.parent);
            if (!n) return e;
            for (var r = n.firstChild, s = 0; r; r = r.nextSibling)
                if (t.index === s++) return r
        }
    }
}(), Polymer.Path = {
        root: function(e) {
            var t = e.indexOf(".");
            return t === -1 ? e : e.slice(0, t)
        },
        isDeep: function(e) {
            return e.indexOf(".") !== -1
        },
        isAncestor: function(e, t) {
            return 0 === e.indexOf(t + ".")
        },
        isDescendant: function(e, t) {
            return 0 === t.indexOf(e + ".")
        },
        translate: function(e, t, n) {
            return t + n.slice(e.length)
        },
        matches: function(e, t, n) {
            return e === n || this.isAncestor(e, n) || Boolean(t) && this.isDescendant(e, n)
        }
    }, Polymer.Base._addFeature({
        _prepAnnotations: function() {
            if (this._template) {
                var e = this;
                Polymer.Annotations.prepElement = function(t) {
                    e._prepElement(t)
                }, this._template._content && this._template._content._notes ? this._notes = this._template._content._notes : (this._notes = Polymer.Annotations.parseAnnotations(this._template), this._processAnnotations(this._notes)), Polymer.Annotations.prepElement = null
            } else this._notes = []
        },
        _processAnnotations: function(e) {
            for (var t = 0; t < e.length; t++) {
                for (var n = e[t], r = 0; r < n.bindings.length; r++)
                    for (var s = n.bindings[r], i = 0; i < s.parts.length; i++) {
                        var o = s.parts[i];
                        if (!o.literal) {
                            var a = this._parseMethod(o.value);
                            a ? o.signature = a : o.model = Polymer.Path.root(o.value)
                        }
                    }
                if (n.templateContent) {
                    this._processAnnotations(n.templateContent._notes);
                    var l = n.templateContent._parentProps = this._discoverTemplateParentProps(n.templateContent._notes),
                        c = [];
                    for (var h in l) {
                        var u = "_parent_" + h;
                        c.push({
                            index: n.index,
                            kind: "property",
                            name: u,
                            propertyName: u,
                            parts: [{
                                mode: "{",
                                model: h,
                                value: h
                            }]
                        })
                    }
                    n.bindings = n.bindings.concat(c)
                }
            }
        },
        _discoverTemplateParentProps: function(e) {
            for (var t, n = {}, r = 0; r < e.length && (t = e[r]); r++) {
                for (var s, i = 0, o = t.bindings; i < o.length && (s = o[i]); i++)
                    for (var a, l = 0, c = s.parts; l < c.length && (a = c[l]); l++)
                        if (a.signature) {
                            for (var h = a.signature.args, u = 0; u < h.length; u++) {
                                var f = h[u].model;
                                f && (n[f] = !0)
                            }
                            a.signature.dynamicFn && (n[a.signature.method] = !0)
                        } else a.model && (n[a.model] = !0);
                if (t.templateContent) {
                    var p = t.templateContent._parentProps;
                    Polymer.Base.mixin(n, p)
                }
            }
            return n
        },
        _prepElement: function(e) {
            Polymer.ResolveUrl.resolveAttrs(e, this._template.ownerDocument)
        },
        _findAnnotatedNode: Polymer.Annotations.findAnnotatedNode,
        _marshalAnnotationReferences: function() {
            this._template && (this._marshalIdNodes(), this._marshalAnnotatedNodes(), this._marshalAnnotatedListeners())
        },
        _configureAnnotationReferences: function() {
            for (var e = this._notes, t = this._nodes, n = 0; n < e.length; n++) {
                var r = e[n],
                    s = t[n];
                this._configureTemplateContent(r, s), this._configureCompoundBindings(r, s)
            }
        },
        _configureTemplateContent: function(e, t) {
            e.templateContent && (t._content = e.templateContent)
        },
        _configureCompoundBindings: function(e, t) {
            for (var n = e.bindings, r = 0; r < n.length; r++) {
                var s = n[r];
                if (s.isCompound) {
                    for (var i = t.__compoundStorage__ || (t.__compoundStorage__ = {}), o = s.parts, a = new Array(o.length), l = 0; l < o.length; l++) a[l] = o[l].literal;
                    var c = s.name;
                    i[c] = a, s.literal && "property" == s.kind && (t._configValue ? t._configValue(c, s.literal) : t[c] = s.literal)
                }
            }
        },
        _marshalIdNodes: function() {
            this.$ = {};
            for (var e, t = 0, n = this._notes.length; t < n && (e = this._notes[t]); t++) e.id && (this.$[e.id] = this._findAnnotatedNode(this.root, e))
        },
        _marshalAnnotatedNodes: function() {
            if (this._notes && this._notes.length) {
                for (var e = new Array(this._notes.length), t = 0; t < this._notes.length; t++) e[t] = this._findAnnotatedNode(this.root, this._notes[t]);
                this._nodes = e
            }
        },
        _marshalAnnotatedListeners: function() {
            for (var e, t = 0, n = this._notes.length; t < n && (e = this._notes[t]); t++)
                if (e.events && e.events.length)
                    for (var r, s = this._findAnnotatedNode(this.root, e), i = 0, o = e.events; i < o.length && (r = o[i]); i++) this.listen(s, r.name, r.value)
        }
    }), Polymer.Base._addFeature({
        listeners: {},
        _listenListeners: function(e) {
            var t, n, r;
            for (r in e) r.indexOf(".") < 0 ? (t = this, n = r) : (n = r.split("."), t = this.$[n[0]], n = n[1]), this.listen(t, n, e[r])
        },
        listen: function(e, t, n) {
            var r = this._recallEventHandler(this, t, e, n);
            r || (r = this._createEventHandler(e, t, n)), r._listening || (this._listen(e, t, r), r._listening = !0)
        },
        _boundListenerKey: function(e, t) {
            return e + ":" + t
        },
        _recordEventHandler: function(e, t, n, r, s) {
            var i = e.__boundListeners;
            i || (i = e.__boundListeners = new WeakMap);
            var o = i.get(n);
            o || (o = {}, Polymer.Settings.isIE && n == window || i.set(n, o));
            var a = this._boundListenerKey(t, r);
            o[a] = s
        },
        _recallEventHandler: function(e, t, n, r) {
            var s = e.__boundListeners;
            if (s) {
                var i = s.get(n);
                if (i) {
                    var o = this._boundListenerKey(t, r);
                    return i[o]
                }
            }
        },
        _createEventHandler: function(e, t, n) {
            var r = this,
                s = function(e) {
                    r[n] ? r[n](e, e.detail) : r._warn(r._logf("_createEventHandler", "listener method `" + n + "` not defined"))
                };
            return s._listening = !1, this._recordEventHandler(r, t, e, n, s), s
        },
        unlisten: function(e, t, n) {
            var r = this._recallEventHandler(this, t, e, n);
            r && (this._unlisten(e, t, r), r._listening = !1)
        },
        _listen: function(e, t, n) {
            e.addEventListener(t, n)
        },
        _unlisten: function(e, t, n) {
            e.removeEventListener(t, n)
        }
    }),
    function() {
        "use strict";

        function e(e) {
            return v.indexOf(e) > -1
        }

        function t(t) {
            if (!e(t) && "touchend" !== t) return h && S && Polymer.Settings.passiveTouchGestures ? {
                passive: !0
            } : void 0
        }

        function n(e) {
            for (var t, n = E ? ["click"] : v, r = 0; r < n.length; r++) t = n[r], e ? document.addEventListener(t, C, !0) : document.removeEventListener(t, C, !0)
        }

        function r(e) {
            x.mouse.mouseIgnoreJob || n(!0);
            var t = function() {
                n(), x.mouse.target = null, x.mouse.mouseIgnoreJob = null
            };
            x.mouse.target = Polymer.dom(e).rootTarget, x.mouse.mouseIgnoreJob = Polymer.Debounce(x.mouse.mouseIgnoreJob, t, y)
        }

        function s(t) {
            var n = t.type;
            if (!e(n)) return !1;
            if ("mousemove" === n) {
                var r = void 0 === t.buttons ? 1 : t.buttons;
                return t instanceof window.MouseEvent && !P && (r = g[t.which] || 0), Boolean(1 & r)
            }
            var s = void 0 === t.button ? 0 : t.button;
            return 0 === s
        }

        function i(e) {
            if ("click" === e.type) {
                if (0 === e.detail) return !0;
                var t = b.findOriginalTarget(e),
                    n = t.getBoundingClientRect(),
                    r = e.pageX,
                    s = e.pageY;
                return !(r >= n.left && r <= n.right && s >= n.top && s <= n.bottom)
            }
            return !1
        }

        function o(e) {
            for (var t, n = Polymer.dom(e).path, r = "auto", s = 0; s < n.length; s++)
                if (t = n[s], t[p]) {
                    r = t[p];
                    break
                }
            return r
        }

        function a(e, t, n) {
            e.movefn = t, e.upfn = n, document.addEventListener("mousemove", t), document.addEventListener("mouseup", n)
        }

        function l(e) {
            document.removeEventListener("mousemove", e.movefn), document.removeEventListener("mouseup", e.upfn), e.movefn = null, e.upfn = null
        }
        var c = Polymer.DomApi.wrap,
            h = "string" == typeof document.head.style.touchAction,
            u = "__polymerGestures",
            f = "__polymerGesturesHandled",
            p = "__polymerGesturesTouchAction",
            d = 25,
            _ = 5,
            m = 2,
            y = 2500,
            v = ["mousedown", "mousemove", "mouseup", "click"],
            g = [0, 1, 4, 2],
            P = function() {
                try {
                    return 1 === new MouseEvent("test", {
                        buttons: 1
                    }).buttons
                } catch (e) {
                    return !1
                }
            }(),
            S = !1;
        ! function() {
            try {
                var e = Object.defineProperty({}, "passive", {
                    get: function() {
                        S = !0
                    }
                });
                window.addEventListener("test", null, e), window.removeEventListener("test", null, e)
            } catch (e) {}
        }();
        var E = navigator.userAgent.match(/iP(?:[oa]d|hone)|Android/),
            C = function(e) {
                var t = e.sourceCapabilities;
                if ((!t || t.firesTouchEvents) && (e[f] = {
                        skip: !0
                    }, "click" === e.type)) {
                    for (var n = Polymer.dom(e).path, r = 0; r < n.length; r++)
                        if (n[r] === x.mouse.target) return;
                    e.preventDefault(), e.stopPropagation()
                }
            },
            x = {
                mouse: {
                    target: null,
                    mouseIgnoreJob: null
                },
                touch: {
                    x: 0,
                    y: 0,
                    id: -1,
                    scrollDecided: !1
                }
            };
        document.addEventListener("touchend", r, !!S && {
            passive: !0
        });
        var b = {
            gestures: {},
            recognizers: [],
            deepTargetFind: function(e, t) {
                for (var n = document.elementFromPoint(e, t), r = n; r && r.shadowRoot;) r = r.shadowRoot.elementFromPoint(e, t), r && (n = r);
                return n
            },
            findOriginalTarget: function(e) {
                return e.path ? e.path[0] : e.target
            },
            handleNative: function(e) {
                var t, n = e.type,
                    r = c(e.currentTarget),
                    s = r[u];
                if (s) {
                    var i = s[n];
                    if (i) {
                        if (!e[f] && (e[f] = {}, "touch" === n.slice(0, 5))) {
                            var o = e.changedTouches[0];
                            if ("touchstart" === n && 1 === e.touches.length && (x.touch.id = o.identifier), x.touch.id !== o.identifier) return;
                            h || "touchstart" !== n && "touchmove" !== n || b.handleTouchAction(e)
                        }
                        if (t = e[f], !t.skip) {
                            for (var a, l = b.recognizers, p = 0; p < l.length; p++) a = l[p], i[a.name] && !t[a.name] && a.flow && a.flow.start.indexOf(e.type) > -1 && a.reset && a.reset();
                            for (p = 0, a; p < l.length; p++) a = l[p], i[a.name] && !t[a.name] && (t[a.name] = !0, a[n](e))
                        }
                    }
                }
            },
            handleTouchAction: function(e) {
                var t = e.changedTouches[0],
                    n = e.type;
                if ("touchstart" === n) x.touch.x = t.clientX, x.touch.y = t.clientY, x.touch.scrollDecided = !1;
                else if ("touchmove" === n) {
                    if (x.touch.scrollDecided) return;
                    x.touch.scrollDecided = !0;
                    var r = o(e),
                        s = !1,
                        i = Math.abs(x.touch.x - t.clientX),
                        a = Math.abs(x.touch.y - t.clientY);
                    e.cancelable && ("none" === r ? s = !0 : "pan-x" === r ? s = a > i : "pan-y" === r && (s = i > a)), s ? e.preventDefault() : b.prevent("track")
                }
            },
            add: function(n, r, s) {
                n = c(n);
                var i = this.gestures[r],
                    o = i.deps,
                    a = i.name,
                    l = n[u];
                l || (n[u] = l = {});
                for (var h, f, p = 0; p < o.length; p++) h = o[p], E && e(h) && "click" !== h || (f = l[h], f || (l[h] = f = {
                    _count: 0
                }), 0 === f._count && n.addEventListener(h, this.handleNative, t(h)), f[a] = (f[a] || 0) + 1, f._count = (f._count || 0) + 1);
                n.addEventListener(r, s), i.touchAction && this.setTouchAction(n, i.touchAction)
            },
            remove: function(e, n, r) {
                e = c(e);
                var s = this.gestures[n],
                    i = s.deps,
                    o = s.name,
                    a = e[u];
                if (a)
                    for (var l, h, f = 0; f < i.length; f++) l = i[f], h = a[l], h && h[o] && (h[o] = (h[o] || 1) - 1, h._count = (h._count || 1) - 1, 0 === h._count && e.removeEventListener(l, this.handleNative, t(l)));
                e.removeEventListener(n, r)
            },
            register: function(e) {
                this.recognizers.push(e);
                for (var t = 0; t < e.emits.length; t++) this.gestures[e.emits[t]] = e
            },
            findRecognizerByEvent: function(e) {
                for (var t, n = 0; n < this.recognizers.length; n++) {
                    t = this.recognizers[n];
                    for (var r, s = 0; s < t.emits.length; s++)
                        if (r = t.emits[s], r === e) return t
                }
                return null
            },
            setTouchAction: function(e, t) {
                h && (e.style.touchAction = t), e[p] = t
            },
            fire: function(e, t, n) {
                var r = Polymer.Base.fire(t, n, {
                    node: e,
                    bubbles: !0,
                    cancelable: !0
                });
                if (r.defaultPrevented) {
                    var s = n.preventer || n.sourceEvent;
                    s && s.preventDefault && s.preventDefault()
                }
            },
            prevent: function(e) {
                var t = this.findRecognizerByEvent(e);
                t.info && (t.info.prevent = !0)
            },
            resetMouseCanceller: function() {
                x.mouse.mouseIgnoreJob && x.mouse.mouseIgnoreJob.complete()
            }
        };
        b.register({
            name: "downup",
            deps: ["mousedown", "touchstart", "touchend"],
            flow: {
                start: ["mousedown", "touchstart"],
                end: ["mouseup", "touchend"]
            },
            emits: ["down", "up"],
            info: {
                movefn: null,
                upfn: null
            },
            reset: function() {
                l(this.info)
            },
            mousedown: function(e) {
                if (s(e)) {
                    var t = b.findOriginalTarget(e),
                        n = this,
                        r = function(e) {
                            s(e) || (n.fire("up", t, e), l(n.info))
                        },
                        i = function(e) {
                            s(e) && n.fire("up", t, e), l(n.info)
                        };
                    a(this.info, r, i), this.fire("down", t, e)
                }
            },
            touchstart: function(e) {
                this.fire("down", b.findOriginalTarget(e), e.changedTouches[0], e)
            },
            touchend: function(e) {
                this.fire("up", b.findOriginalTarget(e), e.changedTouches[0], e)
            },
            fire: function(e, t, n, r) {
                b.fire(t, e, {
                    x: n.clientX,
                    y: n.clientY,
                    sourceEvent: n,
                    preventer: r,
                    prevent: function(e) {
                        return b.prevent(e)
                    }
                })
            }
        }), b.register({
            name: "track",
            touchAction: "none",
            deps: ["mousedown", "touchstart", "touchmove", "touchend"],
            flow: {
                start: ["mousedown", "touchstart"],
                end: ["mouseup", "touchend"]
            },
            emits: ["track"],
            info: {
                x: 0,
                y: 0,
                state: "start",
                started: !1,
                moves: [],
                addMove: function(e) {
                    this.moves.length > m && this.moves.shift(), this.moves.push(e)
                },
                movefn: null,
                upfn: null,
                prevent: !1
            },
            reset: function() {
                this.info.state = "start", this.info.started = !1, this.info.moves = [], this.info.x = 0, this.info.y = 0, this.info.prevent = !1, l(this.info)
            },
            hasMovedEnough: function(e, t) {
                if (this.info.prevent) return !1;
                if (this.info.started) return !0;
                var n = Math.abs(this.info.x - e),
                    r = Math.abs(this.info.y - t);
                return n >= _ || r >= _
            },
            mousedown: function(e) {
                if (s(e)) {
                    var t = b.findOriginalTarget(e),
                        n = this,
                        r = function(e) {
                            var r = e.clientX,
                                i = e.clientY;
                            n.hasMovedEnough(r, i) && (n.info.state = n.info.started ? "mouseup" === e.type ? "end" : "track" : "start", "start" === n.info.state && b.prevent("tap"), n.info.addMove({
                                x: r,
                                y: i
                            }), s(e) || (n.info.state = "end", l(n.info)), n.fire(t, e), n.info.started = !0)
                        },
                        i = function(e) {
                            n.info.started && r(e), l(n.info)
                        };
                    a(this.info, r, i), this.info.x = e.clientX, this.info.y = e.clientY
                }
            },
            touchstart: function(e) {
                var t = e.changedTouches[0];
                this.info.x = t.clientX, this.info.y = t.clientY
            },
            touchmove: function(e) {
                var t = b.findOriginalTarget(e),
                    n = e.changedTouches[0],
                    r = n.clientX,
                    s = n.clientY;
                this.hasMovedEnough(r, s) && ("start" === this.info.state && b.prevent("tap"), this.info.addMove({
                    x: r,
                    y: s
                }), this.fire(t, n), this.info.state = "track", this.info.started = !0)
            },
            touchend: function(e) {
                var t = b.findOriginalTarget(e),
                    n = e.changedTouches[0];
                this.info.started && (this.info.state = "end", this.info.addMove({
                    x: n.clientX,
                    y: n.clientY
                }), this.fire(t, n, e))
            },
            fire: function(e, t, n) {
                var r, s = this.info.moves[this.info.moves.length - 2],
                    i = this.info.moves[this.info.moves.length - 1],
                    o = i.x - this.info.x,
                    a = i.y - this.info.y,
                    l = 0;
                return s && (r = i.x - s.x, l = i.y - s.y), b.fire(e, "track", {
                    state: this.info.state,
                    x: t.clientX,
                    y: t.clientY,
                    dx: o,
                    dy: a,
                    ddx: r,
                    ddy: l,
                    sourceEvent: t,
                    preventer: n,
                    hover: function() {
                        return b.deepTargetFind(t.clientX, t.clientY)
                    }
                })
            }
        }), b.register({
            name: "tap",
            deps: ["mousedown", "click", "touchstart", "touchend"],
            flow: {
                start: ["mousedown", "touchstart"],
                end: ["click", "touchend"]
            },
            emits: ["tap"],
            info: {
                x: NaN,
                y: NaN,
                prevent: !1
            },
            reset: function() {
                this.info.x = NaN, this.info.y = NaN, this.info.prevent = !1
            },
            save: function(e) {
                this.info.x = e.clientX, this.info.y = e.clientY
            },
            mousedown: function(e) {
                s(e) && this.save(e)
            },
            click: function(e) {
                s(e) && this.forward(e)
            },
            touchstart: function(e) {
                this.save(e.changedTouches[0], e)
            },
            touchend: function(e) {
                this.forward(e.changedTouches[0], e)
            },
            forward: function(e, t) {
                var n = Math.abs(e.clientX - this.info.x),
                    r = Math.abs(e.clientY - this.info.y),
                    s = b.findOriginalTarget(e);
                (isNaN(n) || isNaN(r) || n <= d && r <= d || i(e)) && (this.info.prevent || b.fire(s, "tap", {
                    x: e.clientX,
                    y: e.clientY,
                    sourceEvent: e,
                    preventer: t
                }))
            }
        });
        var A = {
            x: "pan-x",
            y: "pan-y",
            none: "none",
            all: "auto"
        };
        Polymer.Base._addFeature({
            _setupGestures: function() {
                this.__polymerGestures = null
            },
            _listen: function(e, t, n) {
                b.gestures[t] ? b.add(e, t, n) : e.addEventListener(t, n)
            },
            _unlisten: function(e, t, n) {
                b.gestures[t] ? b.remove(e, t, n) : e.removeEventListener(t, n)
            },
            setScrollDirection: function(e, t) {
                t = t || this, b.setTouchAction(t, A[e] || "auto")
            }
        }), Polymer.Gestures = b
    }(),
    function() {
        "use strict";
        if (Polymer.Base._addFeature({
                $$: function(e) {
                    return Polymer.dom(this.root).querySelector(e)
                },
                toggleClass: function(e, t, n) {
                    n = n || this, 1 == arguments.length && (t = !n.classList.contains(e)), t ? Polymer.dom(n).classList.add(e) : Polymer.dom(n).classList.remove(e)
                },
                toggleAttribute: function(e, t, n) {
                    n = n || this, 1 == arguments.length && (t = !n.hasAttribute(e)), t ? Polymer.dom(n).setAttribute(e, "") : Polymer.dom(n).removeAttribute(e)
                },
                classFollows: function(e, t, n) {
                    n && Polymer.dom(n).classList.remove(e), t && Polymer.dom(t).classList.add(e)
                },
                attributeFollows: function(e, t, n) {
                    n && Polymer.dom(n).removeAttribute(e), t && Polymer.dom(t).setAttribute(e, "")
                },
                getEffectiveChildNodes: function() {
                    return Polymer.dom(this).getEffectiveChildNodes()
                },
                getEffectiveChildren: function() {
                    var e = Polymer.dom(this).getEffectiveChildNodes();
                    return e.filter(function(e) {
                        return e.nodeType === Node.ELEMENT_NODE
                    })
                },
                getEffectiveTextContent: function() {
                    for (var e, t = this.getEffectiveChildNodes(), n = [], r = 0; e = t[r]; r++) e.nodeType !== Node.COMMENT_NODE && n.push(Polymer.dom(e).textContent);
                    return n.join("")
                },
                queryEffectiveChildren: function(e) {
                    var t = Polymer.dom(this).queryDistributedElements(e);
                    return t && t[0]
                },
                queryAllEffectiveChildren: function(e) {
                    return Polymer.dom(this).queryDistributedElements(e)
                },
                getContentChildNodes: function(e) {
                    var t = Polymer.dom(this.root).querySelector(e || "content");
                    return t ? Polymer.dom(t).getDistributedNodes() : []
                },
                getContentChildren: function(e) {
                    return this.getContentChildNodes(e).filter(function(e) {
                        return e.nodeType === Node.ELEMENT_NODE
                    })
                },
                fire: function(e, t, n) {
                    n = n || Polymer.nob;
                    var r = n.node || this;
                    t = null === t || void 0 === t ? {} : t;
                    var s = void 0 === n.bubbles || n.bubbles,
                        i = Boolean(n.cancelable),
                        o = n._useCache,
                        a = this._getEvent(e, s, i, o);
                    return a.detail = t, o && (this.__eventCache[e] = null), r.dispatchEvent(a), o && (this.__eventCache[e] = a), a
                },
                __eventCache: {},
                _getEvent: function(e, t, n, r) {
                    var s = r && this.__eventCache[e];
                    return s && s.bubbles == t && s.cancelable == n || (s = new Event(e, {
                        bubbles: Boolean(t),
                        cancelable: n
                    })), s
                },
                async: function(e, t) {
                    var n = this;
                    return Polymer.Async.run(function() {
                        e.call(n)
                    }, t)
                },
                cancelAsync: function(e) {
                    Polymer.Async.cancel(e)
                },
                arrayDelete: function(e, t) {
                    var n;
                    if (Array.isArray(e)) {
                        if (n = e.indexOf(t), n >= 0) return e.splice(n, 1)
                    } else {
                        var r = this._get(e);
                        if (n = r.indexOf(t), n >= 0) return this.splice(e, n, 1)
                    }
                },
                transform: function(e, t) {
                    t = t || this, t.style.webkitTransform = e, t.style.transform = e
                },
                translate3d: function(e, t, n, r) {
                    r = r || this, this.transform("translate3d(" + e + "," + t + "," + n + ")", r)
                },
                importHref: function(e, t, n, r) {
                    var s = document.createElement("link");
                    s.rel = "import", s.href = e;
                    var i = Polymer.Base.importHref.imported = Polymer.Base.importHref.imported || {},
                        o = i[s.href],
                        a = o || s,
                        l = this,
                        c = function(e) {
                            return e.target.__firedLoad = !0, e.target.removeEventListener("load", c), e.target.removeEventListener("error", h), t.call(l, e)
                        },
                        h = function(e) {
                            return e.target.__firedError = !0, e.target.removeEventListener("load", c), e.target.removeEventListener("error", h), n.call(l, e)
                        };
                    return t && a.addEventListener("load", c), n && a.addEventListener("error", h), o ? (o.__firedLoad && o.dispatchEvent(new Event("load")), o.__firedError && o.dispatchEvent(new Event("error"))) : (i[s.href] = s, r = Boolean(r), r && s.setAttribute("async", ""), document.head.appendChild(s)), a
                },
                create: function(e, t) {
                    var n = document.createElement(e);
                    if (t)
                        for (var r in t) n[r] = t[r];
                    return n
                },
                isLightDescendant: function(e) {
                    return this !== e && this.contains(e) && Polymer.dom(this).getOwnerRoot() === Polymer.dom(e).getOwnerRoot()
                },
                isLocalDescendant: function(e) {
                    return this.root === Polymer.dom(e).getOwnerRoot()
                }
            }), !Polymer.Settings.useNativeCustomElements) {
            var e = Polymer.Base.importHref;
            Polymer.Base.importHref = function(t, n, r, s) {
                CustomElements.ready = !1;
                var i = function(e) {
                    if (CustomElements.upgradeDocumentTree(document), CustomElements.ready = !0, n) return n.call(this, e)
                };
                return e.call(this, t, i, r, s)
            }
        }
    }(), Polymer.Bind = {
        prepareModel: function(e) {
            Polymer.Base.mixin(e, this._modelApi)
        },
        _modelApi: {
            _notifyChange: function(e, t, n) {
                n = void 0 === n ? this[e] : n, t = t || Polymer.CaseMap.camelToDashCase(e) + "-changed", this.fire(t, {
                    value: n
                }, {
                    bubbles: !1,
                    cancelable: !1,
                    _useCache: Polymer.Settings.eventDataCache || !Polymer.Settings.isIE
                })
            },
            _propertySetter: function(e, t, n, r) {
                var s = this.__data__[e];
                return s === t || s !== s && t !== t || (this.__data__[e] = t, "object" == typeof t && this._clearPath(e), this._propertyChanged && this._propertyChanged(e, t, s), n && this._effectEffects(e, t, n, s, r)), s
            },
            __setProperty: function(e, t, n, r) {
                r = r || this;
                var s = r._propertyEffects && r._propertyEffects[e];
                s ? r._propertySetter(e, t, s, n) : r[e] !== t && (r[e] = t)
            },
            _effectEffects: function(e, t, n, r, s) {
                for (var i, o = 0, a = n.length; o < a && (i = n[o]); o++) i.fn.call(this, e, this[e], i.effect, r, s)
            },
            _clearPath: function(e) {
                for (var t in this.__data__) Polymer.Path.isDescendant(e, t) && (this.__data__[t] = void 0)
            }
        },
        ensurePropertyEffects: function(e, t) {
            e._propertyEffects || (e._propertyEffects = {});
            var n = e._propertyEffects[t];
            return n || (n = e._propertyEffects[t] = []), n
        },
        addPropertyEffect: function(e, t, n, r) {
            var s = this.ensurePropertyEffects(e, t),
                i = {
                    kind: n,
                    effect: r,
                    fn: Polymer.Bind["_" + n + "Effect"]
                };
            return s.push(i), i
        },
        createBindings: function(e) {
            var t = e._propertyEffects;
            if (t)
                for (var n in t) {
                    var r = t[n];
                    r.sort(this._sortPropertyEffects), this._createAccessors(e, n, r)
                }
        },
        _sortPropertyEffects: function() {
            var e = {
                compute: 0,
                annotation: 1,
                annotatedComputation: 2,
                reflect: 3,
                notify: 4,
                observer: 5,
                complexObserver: 6,
                function: 7
            };
            return function(t, n) {
                return e[t.kind] - e[n.kind]
            }
        }(),
        _createAccessors: function(e, t, n) {
            var r = {
                    get: function() {
                        return this.__data__[t]
                    }
                },
                s = function(e) {
                    this._propertySetter(t, e, n)
                },
                i = e.getPropertyInfo && e.getPropertyInfo(t);
            i && i.readOnly ? i.computed || (e["_set" + this.upper(t)] = s) : r.set = s, Object.defineProperty(e, t, r)
        },
        upper: function(e) {
            return e[0].toUpperCase() + e.substring(1)
        },
        _addAnnotatedListener: function(e, t, n, r, s, i) {
            e._bindListeners || (e._bindListeners = []);
            var o = this._notedListenerFactory(n, r, Polymer.Path.isDeep(r), i),
                a = s || Polymer.CaseMap.camelToDashCase(n) + "-changed";
            e._bindListeners.push({
                index: t,
                property: n,
                path: r,
                changedFn: o,
                event: a
            })
        },
        _isEventBogus: function(e, t) {
            return e.path && e.path[0] !== t
        },
        _notedListenerFactory: function(e, t, n, r) {
            return function(s, i, o) {
                if (o) {
                    var a = Polymer.Path.translate(e, t, o);
                    this._notifyPath(a, i)
                } else i = s[e], r && (i = !i), n ? this.__data__[t] != i && this.set(t, i) : this[t] = i
            }
        },
        prepareInstance: function(e) {
            e.__data__ = Object.create(null)
        },
        setupBindListeners: function(e) {
            for (var t, n = e._bindListeners, r = 0, s = n.length; r < s && (t = n[r]); r++) {
                var i = e._nodes[t.index];
                this._addNotifyListener(i, e, t.event, t.changedFn)
            }
        },
        _addNotifyListener: function(e, t, n, r) {
            e.addEventListener(n, function(e) {
                return t._notifyListener(r, e)
            })
        }
    }, Polymer.Base.mixin(Polymer.Bind, {
        _shouldAddListener: function(e) {
            return e.name && "attribute" != e.kind && "text" != e.kind && !e.isCompound && "{" === e.parts[0].mode
        },
        _annotationEffect: function(e, t, n) {
            e != n.value && (t = this._get(n.value), this.__data__[n.value] = t), this._applyEffectValue(n, t)
        },
        _reflectEffect: function(e, t, n) {
            this.reflectPropertyToAttribute(e, n.attribute, t)
        },
        _notifyEffect: function(e, t, n, r, s) {
            s || this._notifyChange(e, n.event, t)
        },
        _functionEffect: function(e, t, n, r, s) {
            n.call(this, e, t, r, s)
        },
        _observerEffect: function(e, t, n, r) {
            var s = this[n.method];
            s ? s.call(this, t, r) : this._warn(this._logf("_observerEffect", "observer method `" + n.method + "` not defined"))
        },
        _complexObserverEffect: function(e, t, n) {
            var r = this[n.method];
            if (r) {
                var s = Polymer.Bind._marshalArgs(this.__data__, n, e, t);
                s && r.apply(this, s)
            } else n.dynamicFn || this._warn(this._logf("_complexObserverEffect", "observer method `" + n.method + "` not defined"))
        },
        _computeEffect: function(e, t, n) {
            var r = this[n.method];
            if (r) {
                var s = Polymer.Bind._marshalArgs(this.__data__, n, e, t);
                if (s) {
                    var i = r.apply(this, s);
                    this.__setProperty(n.name, i)
                }
            } else n.dynamicFn || this._warn(this._logf("_computeEffect", "compute method `" + n.method + "` not defined"))
        },
        _annotatedComputationEffect: function(e, t, n) {
            var r = this._rootDataHost || this,
                s = r[n.method];
            if (s) {
                var i = Polymer.Bind._marshalArgs(this.__data__, n, e, t);
                if (i) {
                    var o = s.apply(r, i);
                    this._applyEffectValue(n, o)
                }
            } else n.dynamicFn || r._warn(r._logf("_annotatedComputationEffect", "compute method `" + n.method + "` not defined"))
        },
        _marshalArgs: function(e, t, n, r) {
            for (var s = [], i = t.args, o = i.length > 1 || t.dynamicFn, a = 0, l = i.length; a < l; a++) {
                var c, h = i[a],
                    u = h.name;
                if (h.literal ? c = h.value : n === u ? c = r : (c = e[u], void 0 === c && h.structured && (c = Polymer.Base._get(u, e))), o && void 0 === c) return;
                if (h.wildcard) {
                    var f = Polymer.Path.isAncestor(n, u);
                    s[a] = {
                        path: f ? n : u,
                        value: f ? r : c,
                        base: c
                    }
                } else s[a] = c
            }
            return s
        }
    }), Polymer.Base._addFeature({
        _addPropertyEffect: function(e, t, n) {
            var r = Polymer.Bind.addPropertyEffect(this, e, t, n);
            r.pathFn = this["_" + r.kind + "PathEffect"]
        },
        _prepEffects: function() {
            Polymer.Bind.prepareModel(this), this._addAnnotationEffects(this._notes)
        },
        _prepBindings: function() {
            Polymer.Bind.createBindings(this)
        },
        _addPropertyEffects: function(e) {
            if (e)
                for (var t in e) {
                    var n = e[t];
                    if (n.observer && this._addObserverEffect(t, n.observer), n.computed && (n.readOnly = !0, this._addComputedEffect(t, n.computed)), n.notify && this._addPropertyEffect(t, "notify", {
                            event: Polymer.CaseMap.camelToDashCase(t) + "-changed"
                        }), n.reflectToAttribute) {
                        var r = Polymer.CaseMap.camelToDashCase(t);
                        "-" === r[0] ? this._warn(this._logf("_addPropertyEffects", "Property " + t + " cannot be reflected to attribute " + r + ' because "-" is not a valid starting attribute name. Use a lowercase first letter for the property instead.')) : this._addPropertyEffect(t, "reflect", {
                            attribute: r
                        })
                    }
                    n.readOnly && Polymer.Bind.ensurePropertyEffects(this, t)
                }
        },
        _addComputedEffect: function(e, t) {
            for (var n, r = this._parseMethod(t), s = r.dynamicFn, i = 0; i < r.args.length && (n = r.args[i]); i++) this._addPropertyEffect(n.model, "compute", {
                method: r.method,
                args: r.args,
                trigger: n,
                name: e,
                dynamicFn: s
            });
            s && this._addPropertyEffect(r.method, "compute", {
                method: r.method,
                args: r.args,
                trigger: null,
                name: e,
                dynamicFn: s
            })
        },
        _addObserverEffect: function(e, t) {
            this._addPropertyEffect(e, "observer", {
                method: t,
                property: e
            })
        },
        _addComplexObserverEffects: function(e) {
            if (e)
                for (var t, n = 0; n < e.length && (t = e[n]); n++) this._addComplexObserverEffect(t)
        },
        _addComplexObserverEffect: function(e) {
            var t = this._parseMethod(e);
            if (!t) throw new Error("Malformed observer expression '" + e + "'");
            for (var n, r = t.dynamicFn, s = 0; s < t.args.length && (n = t.args[s]); s++) this._addPropertyEffect(n.model, "complexObserver", {
                method: t.method,
                args: t.args,
                trigger: n,
                dynamicFn: r
            });
            r && this._addPropertyEffect(t.method, "complexObserver", {
                method: t.method,
                args: t.args,
                trigger: null,
                dynamicFn: r
            })
        },
        _addAnnotationEffects: function(e) {
            for (var t, n = 0; n < e.length && (t = e[n]); n++)
                for (var r, s = t.bindings, i = 0; i < s.length && (r = s[i]); i++) this._addAnnotationEffect(r, n)
        },
        _addAnnotationEffect: function(e, t) {
            Polymer.Bind._shouldAddListener(e) && Polymer.Bind._addAnnotatedListener(this, t, e.name, e.parts[0].value, e.parts[0].event, e.parts[0].negate);
            for (var n = 0; n < e.parts.length; n++) {
                var r = e.parts[n];
                r.signature ? this._addAnnotatedComputationEffect(e, r, t) : r.literal || ("attribute" === e.kind && "-" === e.name[0] ? this._warn(this._logf("_addAnnotationEffect", "Cannot set attribute " + e.name + ' because "-" is not a valid attribute starting character')) : this._addPropertyEffect(r.model, "annotation", {
                    kind: e.kind,
                    index: t,
                    name: e.name,
                    propertyName: e.propertyName,
                    value: r.value,
                    isCompound: e.isCompound,
                    compoundIndex: r.compoundIndex,
                    event: r.event,
                    customEvent: r.customEvent,
                    negate: r.negate
                }))
            }
        },
        _addAnnotatedComputationEffect: function(e, t, n) {
            var r = t.signature;
            if (r.static) this.__addAnnotatedComputationEffect("__static__", n, e, t, null);
            else {
                for (var s, i = 0; i < r.args.length && (s = r.args[i]); i++) s.literal || this.__addAnnotatedComputationEffect(s.model, n, e, t, s);
                r.dynamicFn && this.__addAnnotatedComputationEffect(r.method, n, e, t, null)
            }
        },
        __addAnnotatedComputationEffect: function(e, t, n, r, s) {
            this._addPropertyEffect(e, "annotatedComputation", {
                index: t,
                isCompound: n.isCompound,
                compoundIndex: r.compoundIndex,
                kind: n.kind,
                name: n.name,
                negate: r.negate,
                method: r.signature.method,
                args: r.signature.args,
                trigger: s,
                dynamicFn: r.signature.dynamicFn
            })
        },
        _parseMethod: function(e) {
            var t = e.match(/([^\s]+?)\(([\s\S]*)\)/);
            if (t) {
                var n = {
                    method: t[1],
                    static: !0
                };
                if (this.getPropertyInfo(n.method) !== Polymer.nob && (n.static = !1, n.dynamicFn = !0), t[2].trim()) {
                    var r = t[2].replace(/\\,/g, "&comma;").split(",");
                    return this._parseArgs(r, n)
                }
                return n.args = Polymer.nar, n
            }
        },
        _parseArgs: function(e, t) {
            return t.args = e.map(function(e) {
                var n = this._parseArg(e);
                return n.literal || (t.static = !1), n
            }, this), t
        },
        _parseArg: function(e) {
            var t = e.trim().replace(/&comma;/g, ",").replace(/\\(.)/g, "$1"),
                n = {
                    name: t
                },
                r = t[0];
            switch ("-" === r && (r = t[1]), r >= "0" && r <= "9" && (r = "#"), r) {
                case "'":
                case '"':
                    n.value = t.slice(1, -1), n.literal = !0;
                    break;
                case "#":
                    n.value = Number(t), n.literal = !0
            }
            return n.literal || (n.model = Polymer.Path.root(t), n.structured = Polymer.Path.isDeep(t), n.structured && (n.wildcard = ".*" == t.slice(-2), n.wildcard && (n.name = t.slice(0, -2)))), n
        },
        _marshalInstanceEffects: function() {
            Polymer.Bind.prepareInstance(this), this._bindListeners && Polymer.Bind.setupBindListeners(this)
        },
        _applyEffectValue: function(e, t) {
            var n = this._nodes[e.index],
                r = e.name;
            if (t = this._computeFinalAnnotationValue(n, r, t, e), "attribute" == e.kind) this.serializeValueToAttribute(t, r, n);
            else {
                var s = n._propertyInfo && n._propertyInfo[r];
                if (s && s.readOnly) return;
                this.__setProperty(r, t, Polymer.Settings.suppressBindingNotifications, n)
            }
        },
        _computeFinalAnnotationValue: function(e, t, n, r) {
            if (r.negate && (n = !n), r.isCompound) {
                var s = e.__compoundStorage__[t];
                s[r.compoundIndex] = n, n = s.join("")
            }
            return "attribute" !== r.kind && ("className" === t && (n = this._scopeElementClass(e, n)), ("textContent" === t || "input" == e.localName && "value" == t) && (n = void 0 == n ? "" : n)), n
        },
        _executeStaticEffects: function() {
            this._propertyEffects && this._propertyEffects.__static__ && this._effectEffects("__static__", null, this._propertyEffects.__static__)
        }
    }),
    function() {
        var e = Polymer.Settings.usePolyfillProto,
            t = Boolean(Object.getOwnPropertyDescriptor(document.documentElement, "properties"));
        Polymer.Base._addFeature({
            _setupConfigure: function(e) {
                if (this._config = {}, this._handlers = [], this._aboveConfig = null, e)
                    for (var t in e) void 0 !== e[t] && (this._config[t] = e[t])
            },
            _marshalAttributes: function() {
                this._takeAttributesToModel(this._config)
            },
            _attributeChangedImpl: function(e) {
                var t = this._clientsReadied ? this : this._config;
                this._setAttributeToProperty(t, e)
            },
            _configValue: function(e, t) {
                var n = this._propertyInfo[e];
                n && n.readOnly || (this._config[e] = t)
            },
            _beforeClientsReady: function() {
                this._configure()
            },
            _configure: function() {
                this._configureAnnotationReferences(), this._configureInstanceProperties(), this._aboveConfig = this.mixin({}, this._config);
                for (var e = {}, n = 0; n < this.behaviors.length; n++) this._configureProperties(this.behaviors[n].properties, e);
                this._configureProperties(t ? this.__proto__.properties : this.properties, e), this.mixin(e, this._aboveConfig), this._config = e, this._clients && this._clients.length && this._distributeConfig(this._config)
            },
            _configureInstanceProperties: function() {
                for (var t in this._propertyEffects) !e && this.hasOwnProperty(t) && (this._configValue(t, this[t]),
                    delete this[t])
            },
            _configureProperties: function(e, t) {
                for (var n in e) {
                    var r = e[n];
                    if (void 0 !== r.value) {
                        var s = r.value;
                        "function" == typeof s && (s = s.call(this, this._config)), t[n] = s
                    }
                }
            },
            _distributeConfig: function(e) {
                var t = this._propertyEffects;
                if (t)
                    for (var n in e) {
                        var r = t[n];
                        if (r)
                            for (var s, i = 0, o = r.length; i < o && (s = r[i]); i++)
                                if ("annotation" === s.kind) {
                                    var a = this._nodes[s.effect.index],
                                        l = s.effect.propertyName,
                                        c = "attribute" == s.effect.kind,
                                        h = a._propertyEffects && a._propertyEffects[l];
                                    if (a._configValue && (h || !c)) {
                                        var u = n === s.effect.value ? e[n] : this._get(s.effect.value, e);
                                        u = this._computeFinalAnnotationValue(a, l, u, s.effect), c && (u = a.deserialize(this.serialize(u), a._propertyInfo[l].type)), a._configValue(l, u)
                                    }
                                }
                    }
            },
            _afterClientsReady: function() {
                this.importPath = this._importPath, this.rootPath = Polymer.rootPath, this._executeStaticEffects(), this._applyConfig(this._config, this._aboveConfig), this._flushHandlers()
            },
            _applyConfig: function(e, t) {
                for (var n in e) void 0 === this[n] && this.__setProperty(n, e[n], n in t)
            },
            _notifyListener: function(e, t) {
                if (!Polymer.Bind._isEventBogus(t, t.target)) {
                    var n, r;
                    if (t.detail && (n = t.detail.value, r = t.detail.path), this._clientsReadied) return e.call(this, t.target, n, r);
                    this._queueHandler([e, t.target, n, r])
                }
            },
            _queueHandler: function(e) {
                this._handlers.push(e)
            },
            _flushHandlers: function() {
                for (var e, t = this._handlers, n = 0, r = t.length; n < r && (e = t[n]); n++) e[0].call(this, e[1], e[2], e[3]);
                this._handlers = []
            }
        })
    }(),
    function() {
        "use strict";
        var e = Polymer.Path;
        Polymer.Base._addFeature({
            notifyPath: function(e, t, n) {
                var r = {},
                    s = this._get(e, this, r);
                1 === arguments.length && (t = s), r.path && this._notifyPath(r.path, t, n)
            },
            _notifyPath: function(e, t, n) {
                var r = this._propertySetter(e, t);
                if (r !== t && (r === r || t === t)) return this._pathEffector(e, t), n || this._notifyPathUp(e, t), !0
            },
            _getPathParts: function(e) {
                if (Array.isArray(e)) {
                    for (var t = [], n = 0; n < e.length; n++)
                        for (var r = e[n].toString().split("."), s = 0; s < r.length; s++) t.push(r[s]);
                    return t
                }
                return e.toString().split(".")
            },
            set: function(e, t, n) {
                var r, s = n || this,
                    i = this._getPathParts(e),
                    o = i[i.length - 1];
                if (i.length > 1) {
                    for (var a = 0; a < i.length - 1; a++) {
                        var l = i[a];
                        if (r && "#" == l[0] ? s = Polymer.Collection.get(r).getItem(l) : (s = s[l], r && parseInt(l, 10) == l && (i[a] = Polymer.Collection.get(r).getKey(s))), !s) return;
                        r = Array.isArray(s) ? s : null
                    }
                    if (r) {
                        var c, h, u = Polymer.Collection.get(r);
                        "#" == o[0] ? (h = o, c = u.getItem(h), o = r.indexOf(c), u.setItem(h, t)) : parseInt(o, 10) == o && (c = s[o], h = u.getKey(c), i[a] = h, u.setItem(h, t))
                    }
                    s[o] = t, n || this._notifyPath(i.join("."), t)
                } else s[e] = t
            },
            get: function(e, t) {
                return this._get(e, t)
            },
            _get: function(e, t, n) {
                for (var r, s = t || this, i = this._getPathParts(e), o = 0; o < i.length; o++) {
                    if (!s) return;
                    var a = i[o];
                    r && "#" == a[0] ? s = Polymer.Collection.get(r).getItem(a) : (s = s[a], n && r && parseInt(a, 10) == a && (i[o] = Polymer.Collection.get(r).getKey(s))), r = Array.isArray(s) ? s : null
                }
                return n && (n.path = i.join(".")), s
            },
            _pathEffector: function(t, n) {
                var r = e.root(t),
                    s = this._propertyEffects && this._propertyEffects[r];
                if (s)
                    for (var i, o = 0; o < s.length && (i = s[o]); o++) {
                        var a = i.pathFn;
                        a && a.call(this, t, n, i.effect)
                    }
                this._boundPaths && this._notifyBoundPaths(t, n)
            },
            _annotationPathEffect: function(t, n, r) {
                if (e.matches(r.value, !1, t)) Polymer.Bind._annotationEffect.call(this, t, n, r);
                else if (!r.negate && e.isDescendant(r.value, t)) {
                    var s = this._nodes[r.index];
                    if (s && s._notifyPath) {
                        var i = e.translate(r.value, r.name, t);
                        s._notifyPath(i, n, !0)
                    }
                }
            },
            _complexObserverPathEffect: function(t, n, r) {
                e.matches(r.trigger.name, r.trigger.wildcard, t) && Polymer.Bind._complexObserverEffect.call(this, t, n, r)
            },
            _computePathEffect: function(t, n, r) {
                e.matches(r.trigger.name, r.trigger.wildcard, t) && Polymer.Bind._computeEffect.call(this, t, n, r)
            },
            _annotatedComputationPathEffect: function(t, n, r) {
                e.matches(r.trigger.name, r.trigger.wildcard, t) && Polymer.Bind._annotatedComputationEffect.call(this, t, n, r)
            },
            linkPaths: function(e, t) {
                this._boundPaths = this._boundPaths || {}, t ? this._boundPaths[e] = t : this.unlinkPaths(e)
            },
            unlinkPaths: function(e) {
                this._boundPaths && delete this._boundPaths[e]
            },
            _notifyBoundPaths: function(t, n) {
                for (var r in this._boundPaths) {
                    var s = this._boundPaths[r];
                    e.isDescendant(r, t) ? this._notifyPath(e.translate(r, s, t), n) : e.isDescendant(s, t) && this._notifyPath(e.translate(s, r, t), n)
                }
            },
            _notifyPathUp: function(t, n) {
                var r = e.root(t),
                    s = Polymer.CaseMap.camelToDashCase(r),
                    i = s + this._EVENT_CHANGED;
                this.fire(i, {
                    path: t,
                    value: n
                }, {
                    bubbles: !1,
                    _useCache: Polymer.Settings.eventDataCache || !Polymer.Settings.isIE
                })
            },
            _EVENT_CHANGED: "-changed",
            notifySplices: function(e, t) {
                var n = {},
                    r = this._get(e, this, n);
                this._notifySplices(r, n.path, t)
            },
            _notifySplices: function(e, t, n) {
                var r = {
                        keySplices: Polymer.Collection.applySplices(e, n),
                        indexSplices: n
                    },
                    s = t + ".splices";
                this._notifyPath(s, r), this._notifyPath(t + ".length", e.length), this.__data__[s] = {
                    keySplices: null,
                    indexSplices: null
                }
            },
            _notifySplice: function(e, t, n, r, s) {
                this._notifySplices(e, t, [{
                    index: n,
                    addedCount: r,
                    removed: s,
                    object: e,
                    type: "splice"
                }])
            },
            push: function(e) {
                var t = {},
                    n = this._get(e, this, t),
                    r = Array.prototype.slice.call(arguments, 1),
                    s = n.length,
                    i = n.push.apply(n, r);
                return r.length && this._notifySplice(n, t.path, s, r.length, []), i
            },
            pop: function(e) {
                var t = {},
                    n = this._get(e, this, t),
                    r = Boolean(n.length),
                    s = Array.prototype.slice.call(arguments, 1),
                    i = n.pop.apply(n, s);
                return r && this._notifySplice(n, t.path, n.length, 0, [i]), i
            },
            splice: function(e, t) {
                var n = {},
                    r = this._get(e, this, n);
                t = t < 0 ? r.length - Math.floor(-t) : Math.floor(t), t || (t = 0);
                var s = Array.prototype.slice.call(arguments, 1),
                    i = r.splice.apply(r, s),
                    o = Math.max(s.length - 2, 0);
                return (o || i.length) && this._notifySplice(r, n.path, t, o, i), i
            },
            shift: function(e) {
                var t = {},
                    n = this._get(e, this, t),
                    r = Boolean(n.length),
                    s = Array.prototype.slice.call(arguments, 1),
                    i = n.shift.apply(n, s);
                return r && this._notifySplice(n, t.path, 0, 0, [i]), i
            },
            unshift: function(e) {
                var t = {},
                    n = this._get(e, this, t),
                    r = Array.prototype.slice.call(arguments, 1),
                    s = n.unshift.apply(n, r);
                return r.length && this._notifySplice(n, t.path, 0, r.length, []), s
            },
            prepareModelNotifyPath: function(e) {
                this.mixin(e, {
                    fire: Polymer.Base.fire,
                    _getEvent: Polymer.Base._getEvent,
                    __eventCache: Polymer.Base.__eventCache,
                    notifyPath: Polymer.Base.notifyPath,
                    _get: Polymer.Base._get,
                    _EVENT_CHANGED: Polymer.Base._EVENT_CHANGED,
                    _notifyPath: Polymer.Base._notifyPath,
                    _notifyPathUp: Polymer.Base._notifyPathUp,
                    _pathEffector: Polymer.Base._pathEffector,
                    _annotationPathEffect: Polymer.Base._annotationPathEffect,
                    _complexObserverPathEffect: Polymer.Base._complexObserverPathEffect,
                    _annotatedComputationPathEffect: Polymer.Base._annotatedComputationPathEffect,
                    _computePathEffect: Polymer.Base._computePathEffect,
                    _notifyBoundPaths: Polymer.Base._notifyBoundPaths,
                    _getPathParts: Polymer.Base._getPathParts
                })
            }
        })
    }(), Polymer.Base._addFeature({
        resolveUrl: function(e) {
            return Polymer.ResolveUrl.resolveUrl(e, this._importPath)
        }
    }), Polymer.CssParse = function() {
        return {
            parse: function(e) {
                return e = this._clean(e), this._parseCss(this._lex(e), e)
            },
            _clean: function(e) {
                return e.replace(this._rx.comments, "").replace(this._rx.port, "")
            },
            _lex: function(e) {
                for (var t = {
                        start: 0,
                        end: e.length
                    }, n = t, r = 0, s = e.length; r < s; r++) switch (e[r]) {
                    case this.OPEN_BRACE:
                        n.rules || (n.rules = []);
                        var i = n,
                            o = i.rules[i.rules.length - 1];
                        n = {
                            start: r + 1,
                            parent: i,
                            previous: o
                        }, i.rules.push(n);
                        break;
                    case this.CLOSE_BRACE:
                        n.end = r + 1, n = n.parent || t
                }
                return t
            },
            _parseCss: function(e, t) {
                var n = t.substring(e.start, e.end - 1);
                if (e.parsedCssText = e.cssText = n.trim(), e.parent) {
                    var r = e.previous ? e.previous.end : e.parent.start;
                    n = t.substring(r, e.start - 1), n = this._expandUnicodeEscapes(n), n = n.replace(this._rx.multipleSpaces, " "), n = n.substring(n.lastIndexOf(";") + 1);
                    var s = e.parsedSelector = e.selector = n.trim();
                    e.atRule = 0 === s.indexOf(this.AT_START), e.atRule ? 0 === s.indexOf(this.MEDIA_START) ? e.type = this.types.MEDIA_RULE : s.match(this._rx.keyframesRule) && (e.type = this.types.KEYFRAMES_RULE, e.keyframesName = e.selector.split(this._rx.multipleSpaces).pop()) : 0 === s.indexOf(this.VAR_START) ? e.type = this.types.MIXIN_RULE : e.type = this.types.STYLE_RULE
                }
                var i = e.rules;
                if (i)
                    for (var o, a = 0, l = i.length; a < l && (o = i[a]); a++) this._parseCss(o, t);
                return e
            },
            _expandUnicodeEscapes: function(e) {
                return e.replace(/\\([0-9a-f]{1,6})\s/gi, function() {
                    for (var e = arguments[1], t = 6 - e.length; t--;) e = "0" + e;
                    return "\\" + e
                })
            },
            stringify: function(e, t, n) {
                n = n || "";
                var r = "";
                if (e.cssText || e.rules) {
                    var s = e.rules;
                    if (s && !this._hasMixinRules(s))
                        for (var i, o = 0, a = s.length; o < a && (i = s[o]); o++) r = this.stringify(i, t, r);
                    else r = t ? e.cssText : this.removeCustomProps(e.cssText), r = r.trim(), r && (r = "  " + r + "\n")
                }
                return r && (e.selector && (n += e.selector + " " + this.OPEN_BRACE + "\n"), n += r, e.selector && (n += this.CLOSE_BRACE + "\n\n")), n
            },
            _hasMixinRules: function(e) {
                return 0 === e[0].selector.indexOf(this.VAR_START)
            },
            removeCustomProps: function(e) {
                return e = this.removeCustomPropAssignment(e), this.removeCustomPropApply(e)
            },
            removeCustomPropAssignment: function(e) {
                return e.replace(this._rx.customProp, "").replace(this._rx.mixinProp, "")
            },
            removeCustomPropApply: function(e) {
                return e.replace(this._rx.mixinApply, "").replace(this._rx.varApply, "")
            },
            types: {
                STYLE_RULE: 1,
                KEYFRAMES_RULE: 7,
                MEDIA_RULE: 4,
                MIXIN_RULE: 1e3
            },
            OPEN_BRACE: "{",
            CLOSE_BRACE: "}",
            _rx: {
                comments: /\/\*[^*]*\*+([^\/*][^*]*\*+)*\//gim,
                port: /@import[^;]*;/gim,
                customProp: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim,
                mixinProp: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim,
                mixinApply: /@apply\s*\(?[^);]*\)?\s*(?:[;\n]|$)?/gim,
                varApply: /[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim,
                keyframesRule: /^@[^\s]*keyframes/,
                multipleSpaces: /\s+/g
            },
            VAR_START: "--",
            MEDIA_START: "@media",
            AT_START: "@"
        }
    }(), Polymer.StyleUtil = function() {
        var e = Polymer.Settings;
        return {
            unscopedStyleImports: new WeakMap,
            SHADY_UNSCOPED_ATTR: "shady-unscoped",
            NATIVE_VARIABLES: Polymer.Settings.useNativeCSSProperties,
            MODULE_STYLES_SELECTOR: "style, link[rel=import][type~=css], template",
            INCLUDE_ATTR: "include",
            toCssText: function(e, t) {
                return "string" == typeof e && (e = this.parser.parse(e)), t && this.forEachRule(e, t), this.parser.stringify(e, this.NATIVE_VARIABLES)
            },
            forRulesInStyles: function(e, t, n) {
                if (e)
                    for (var r, s = 0, i = e.length; s < i && (r = e[s]); s++) this.forEachRuleInStyle(r, t, n)
            },
            forActiveRulesInStyles: function(e, t, n) {
                if (e)
                    for (var r, s = 0, i = e.length; s < i && (r = e[s]); s++) this.forEachRuleInStyle(r, t, n, !0)
            },
            rulesForStyle: function(e) {
                return !e.__cssRules && e.textContent && (e.__cssRules = this.parser.parse(e.textContent)), e.__cssRules
            },
            isKeyframesSelector: function(e) {
                return e.parent && e.parent.type === this.ruleTypes.KEYFRAMES_RULE
            },
            forEachRuleInStyle: function(e, t, n, r) {
                var s, i, o = this.rulesForStyle(e);
                t && (s = function(n) {
                    t(n, e)
                }), n && (i = function(t) {
                    n(t, e)
                }), this.forEachRule(o, s, i, r)
            },
            forEachRule: function(e, t, n, r) {
                if (e) {
                    var s = !1;
                    if (r && e.type === this.ruleTypes.MEDIA_RULE) {
                        var i = e.selector.match(this.rx.MEDIA_MATCH);
                        i && (window.matchMedia(i[1]).matches || (s = !0))
                    }
                    e.type === this.ruleTypes.STYLE_RULE ? t(e) : n && e.type === this.ruleTypes.KEYFRAMES_RULE ? n(e) : e.type === this.ruleTypes.MIXIN_RULE && (s = !0);
                    var o = e.rules;
                    if (o && !s)
                        for (var a, l = 0, c = o.length; l < c && (a = o[l]); l++) this.forEachRule(a, t, n, r)
                }
            },
            applyCss: function(e, t, n, r) {
                var s = this.createScopeStyle(e, t);
                return this.applyStyle(s, n, r)
            },
            applyStyle: function(e, t, n) {
                t = t || document.head;
                var r = n && n.nextSibling || t.firstChild;
                return this.__lastHeadApplyNode = e, t.insertBefore(e, r)
            },
            createScopeStyle: function(e, t) {
                var n = document.createElement("style");
                return t && n.setAttribute("scope", t), n.textContent = e, n
            },
            __lastHeadApplyNode: null,
            applyStylePlaceHolder: function(e) {
                var t = document.createComment(" Shady DOM styles for " + e + " "),
                    n = this.__lastHeadApplyNode ? this.__lastHeadApplyNode.nextSibling : null,
                    r = document.head;
                return r.insertBefore(t, n || r.firstChild), this.__lastHeadApplyNode = t, t
            },
            cssFromModules: function(e, t) {
                for (var n = e.trim().split(/\s+/), r = "", s = 0; s < n.length; s++) r += this.cssFromModule(n[s], t);
                return r
            },
            cssFromModule: function(e, t) {
                var n = Polymer.DomModule.import(e);
                return n && !n._cssText && (n._cssText = this.cssFromElement(n)), !n && t && console.warn("Could not find style data in module named", e), n && n._cssText || ""
            },
            cssFromElement: function(t) {
                for (var n, r = "", s = t.content || t, i = Polymer.TreeApi.arrayCopy(s.querySelectorAll(this.MODULE_STYLES_SELECTOR)), o = 0; o < i.length; o++)
                    if (n = i[o], "template" === n.localName) n.hasAttribute("preserve-content") || (r += this.cssFromElement(n));
                    else if ("style" === n.localName) {
                    var a = n.getAttribute(this.INCLUDE_ATTR);
                    a && (r += this.cssFromModules(a, !0)), n = n.__appliedElement || n, n.parentNode.removeChild(n);
                    var l = this.resolveCss(n.textContent, t.ownerDocument);
                    !e.useNativeShadow && n.hasAttribute(this.SHADY_UNSCOPED_ATTR) ? (n.textContent = l, document.head.insertBefore(n, document.head.firstChild)) : r += l
                } else if (n.import && n.import.body) {
                    var c = this.resolveCss(n.import.body.textContent, n.import);
                    if (!e.useNativeShadow && n.hasAttribute(this.SHADY_UNSCOPED_ATTR)) {
                        if (!this.unscopedStyleImports.has(n.import)) {
                            this.unscopedStyleImports.set(n.import, !0);
                            var h = document.createElement("style");
                            h.setAttribute(this.SHADY_UNSCOPED_ATTR, ""), h.textContent = c, document.head.insertBefore(h, document.head.firstChild)
                        }
                    } else r += c
                }
                return r
            },
            styleIncludesToTemplate: function(e) {
                for (var t, n = e.content.querySelectorAll("style[include]"), r = 0; r < n.length; r++) t = n[r], t.parentNode.insertBefore(this._includesToFragment(t.getAttribute("include")), t)
            },
            _includesToFragment: function(e) {
                for (var t = e.trim().split(" "), n = document.createDocumentFragment(), r = 0; r < t.length; r++) {
                    var s = Polymer.DomModule.import(t[r], "template");
                    s && this._addStylesToFragment(n, s.content)
                }
                return n
            },
            _addStylesToFragment: function(e, t) {
                for (var n, r = t.querySelectorAll("style"), s = 0; s < r.length; s++) {
                    n = r[s];
                    var i = n.getAttribute("include");
                    i && e.appendChild(this._includesToFragment(i)), n.textContent && e.appendChild(n.cloneNode(!0))
                }
            },
            isTargetedBuild: function(t) {
                return e.useNativeShadow ? "shadow" === t : "shady" === t
            },
            cssBuildTypeForModule: function(e) {
                var t = Polymer.DomModule.import(e);
                if (t) return this.getCssBuildType(t)
            },
            getCssBuildType: function(e) {
                return e.getAttribute("css-build")
            },
            _findMatchingParen: function(e, t) {
                for (var n = 0, r = t, s = e.length; r < s; r++) switch (e[r]) {
                    case "(":
                        n++;
                        break;
                    case ")":
                        if (0 === --n) return r
                }
                return -1
            },
            processVariableAndFallback: function(e, t) {
                var n = e.indexOf("var(");
                if (n === -1) return t(e, "", "", "");
                var r = this._findMatchingParen(e, n + 3),
                    s = e.substring(n + 4, r),
                    i = e.substring(0, n),
                    o = this.processVariableAndFallback(e.substring(r + 1), t),
                    a = s.indexOf(",");
                if (a === -1) return t(i, s.trim(), "", o);
                var l = s.substring(0, a).trim(),
                    c = s.substring(a + 1).trim();
                return t(i, l, c, o)
            },
            rx: {
                VAR_ASSIGN: /(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:([^;{]*)|{([^}]*)})(?:(?=[;\s}])|$)/gi,
                MIXIN_MATCH: /(?:^|\W+)@apply\s*\(?([^);\n]*)\)?/gi,
                VAR_CONSUMED: /(--[\w-]+)\s*([:,;)]|$)/gi,
                ANIMATION_MATCH: /(animation\s*:)|(animation-name\s*:)/,
                MEDIA_MATCH: /@media[^(]*(\([^)]*\))/,
                IS_VAR: /^--/,
                BRACKETED: /\{[^}]*\}/g,
                HOST_PREFIX: "(?:^|[^.#[:])",
                HOST_SUFFIX: "($|[.:[\\s>+~])"
            },
            resolveCss: Polymer.ResolveUrl.resolveCss,
            parser: Polymer.CssParse,
            ruleTypes: Polymer.CssParse.types
        }
    }(), Polymer.StyleTransformer = function() {
        var e = Polymer.StyleUtil,
            t = Polymer.Settings,
            n = {
                dom: function(e, t, n, r) {
                    this._transformDom(e, t || "", n, r)
                },
                _transformDom: function(e, t, n, r) {
                    e.setAttribute && this.element(e, t, n, r);
                    for (var s = Polymer.dom(e).childNodes, i = 0; i < s.length; i++) this._transformDom(s[i], t, n, r)
                },
                element: function(e, t, n, s) {
                    if (n) s ? e.removeAttribute(r) : e.setAttribute(r, t);
                    else if (t)
                        if (e.classList) s ? (e.classList.remove(r), e.classList.remove(t)) : (e.classList.add(r), e.classList.add(t));
                        else if (e.getAttribute) {
                        var i = e.getAttribute(g);
                        s ? i && e.setAttribute(g, i.replace(r, "").replace(t, "")) : e.setAttribute(g, (i ? i + " " : "") + r + " " + t)
                    }
                },
                elementStyles: function(n, r) {
                    var s, i = n._styles,
                        o = "",
                        a = n.__cssBuild,
                        l = t.useNativeShadow || "shady" === a;
                    if (l) {
                        var h = this;
                        s = function(e) {
                            e.selector = h._slottedToContent(e.selector), e.selector = e.selector.replace(c, ":host > *"), e.selector = h._dirShadowTransform(e.selector), r && r(e)
                        }
                    }
                    for (var u, f = 0, p = i.length; f < p && (u = i[f]); f++) {
                        var d = e.rulesForStyle(u);
                        o += l ? e.toCssText(d, s) : this.css(d, n.is, n.extends, r, n._scopeCssViaAttr) + "\n\n"
                    }
                    return o.trim()
                },
                css: function(t, n, r, s, i) {
                    var o = this._calcHostScope(n, r);
                    n = this._calcElementScope(n, i);
                    var a = this;
                    return e.toCssText(t, function(e) {
                        e.isScoped || (a.rule(e, n, o), e.isScoped = !0), s && s(e, n, o)
                    })
                },
                _calcElementScope: function(e, t) {
                    return e ? t ? m + e + y : _ + e : ""
                },
                _calcHostScope: function(e, t) {
                    return t ? "[is=" + e + "]" : e
                },
                rule: function(e, t, n) {
                    this._transformRule(e, this._transformComplexSelector, t, n)
                },
                _transformRule: function(e, t, n, r) {
                    e.selector = e.transformedSelector = this._transformRuleCss(e, t, n, r)
                },
                _splitSelectorList: function(t) {
                    for (var n = [], r = "", s = 0; s >= 0 && s < t.length; s++)
                        if ("(" === t[s]) {
                            var o = e._findMatchingParen(t, s);
                            r += t.slice(s, o + 1), s = o
                        } else t[s] === i ? (n.push(r), r = "") : r += t[s];
                    return r && n.push(r), 0 === n.length && n.push(t), n
                },
                _transformRuleCss: function(t, n, r, s) {
                    var o = this._splitSelectorList(t.selector);
                    if (!e.isKeyframesSelector(t))
                        for (var a, l = 0, c = o.length; l < c && (a = o[l]); l++) o[l] = n.call(this, a, r, s);
                    return o.join(i)
                },
                _ensureScopedDir: function(e) {
                    var t = e.match(x);
                    return t && "" === t[1] && t[0].length === e.length && (e = "*" + e), e
                },
                _additionalDirSelectors: function(e, t, n) {
                    return e && t ? (n = n || "", i + n + " " + e + " " + t) : ""
                },
                _transformComplexSelector: function(e, t, n) {
                    var r = !1,
                        s = !1,
                        a = !1,
                        h = this;
                    return e = e.trim(), e = this._slottedToContent(e), e = e.replace(c, ":host > *"), e = e.replace(P, l + " $1"), e = this._ensureScopedDir(e), e = e.replace(o, function(e, i, o) {
                        if (r) o = o.replace(d, " ");
                        else {
                            var l = h._transformCompoundSelector(o, i, t, n);
                            r = r || l.stop, s = s || l.hostContext, a = a || l.dir, i = l.combinator, o = l.value
                        }
                        return i + o
                    }), s && (e = e.replace(f, function(e, t, r, s) {
                        var o = t + r + " " + n + s + i + " " + t + n + r + s;
                        return a && (o += h._additionalDirSelectors(r, s, n)), o
                    })), e
                },
                _transformDir: function(e) {
                    return e = e.replace(A, T), e = e.replace(x, b)
                },
                _transformCompoundSelector: function(e, t, n, r) {
                    var s = e.search(d),
                        i = !1,
                        o = !1;
                    e.match(x) && (e = this._transformDir(e), o = !0), e.indexOf(u) >= 0 ? i = !0 : e.indexOf(l) >= 0 ? e = this._transformHostSelector(e, r) : 0 !== s && (e = n ? this._transformSimpleSelector(e, n) : e), e.indexOf(p) >= 0 && (t = "");
                    var a;
                    return s >= 0 && (e = e.replace(d, " "), a = !0), {
                        value: e,
                        combinator: t,
                        stop: a,
                        hostContext: i,
                        dir: o
                    }
                },
                _transformSimpleSelector: function(e, t) {
                    var n = e.split(v);
                    return n[0] += t, n.join(v)
                },
                _transformHostSelector: function(e, t) {
                    var n = e.match(h),
                        r = n && n[2].trim() || "";
                    if (r) {
                        if (r[0].match(a)) return e.replace(h, function(e, n, r) {
                            return t + r
                        });
                        var s = r.split(a)[0];
                        return s === t ? r : S
                    }
                    return e.replace(l, t)
                },
                documentRule: function(e) {
                    e.selector = e.parsedSelector, this.normalizeRootSelector(e), t.useNativeShadow || this._transformRule(e, this._transformDocumentSelector)
                },
                normalizeRootSelector: function(e) {
                    e.selector = e.selector.replace(c, "html");
                    var t = this._splitSelectorList(e.selector);
                    t = t.filter(function(e) {
                        return !e.match(C)
                    }), e.selector = t.join(i)
                },
                _transformDocumentSelector: function(e) {
                    return this._transformComplexSelector(e, s)
                },
                _slottedToContent: function(e) {
                    return e.replace(E, p + "> $1")
                },
                _dirShadowTransform: function(e) {
                    return e.match(/:dir\(/) ? this._splitSelectorList(e).map(function(e) {
                        e = this._ensureScopedDir(e), e = this._transformDir(e);
                        var t = f.exec(e);
                        return t && (e += this._additionalDirSelectors(t[2], t[3], "")), e
                    }, this).join(i) : e
                },
                SCOPE_NAME: "style-scope"
            },
            r = n.SCOPE_NAME,
            s = ":not([" + r + "]):not(." + r + ")",
            i = ",",
            o = /(^|[\s>+~]+)((?:\[.+?\]|[^\s>+~=\[])+)/g,
            a = /[[.:#*]/,
            l = ":host",
            c = ":root",
            h = /(:host)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/,
            u = ":host-context",
            f = /(.*)(?::host-context)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))(.*)/,
            p = "::content",
            d = /::content|::shadow|\/deep\//,
            _ = ".",
            m = "[" + r + "~=",
            y = "]",
            v = ":",
            g = "class",
            P = new RegExp("^(" + p + ")"),
            S = "should_not_match",
            E = /(?:::slotted)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/g,
            C = /:host(?:\s*>\s*\*)?/,
            x = /(.*):dir\((ltr|rtl)\)/,
            b = ':host-context([dir="$2"]) $1',
            A = /:host\(:dir\((rtl|ltr)\)\)/g,
            T = ':host-context([dir="$1"])';
        return n
    }(), Polymer.StyleExtends = function() {
        var e = Polymer.StyleUtil;
        return {
            hasExtends: function(e) {
                return Boolean(e.match(this.rx.EXTEND))
            },
            transform: function(t) {
                var n = e.rulesForStyle(t),
                    r = this;
                return e.forEachRule(n, function(e) {
                    if (r._mapRuleOntoParent(e), e.parent)
                        for (var t; t = r.rx.EXTEND.exec(e.cssText);) {
                            var n = t[1],
                                s = r._findExtendor(n, e);
                            s && r._extendRule(e, s)
                        }
                    e.cssText = e.cssText.replace(r.rx.EXTEND, "")
                }), e.toCssText(n, function(e) {
                    e.selector.match(r.rx.STRIP) && (e.cssText = "")
                }, !0)
            },
            _mapRuleOntoParent: function(e) {
                if (e.parent) {
                    for (var t, n = e.parent.map || (e.parent.map = {}), r = e.selector.split(","), s = 0; s < r.length; s++) t = r[s], n[t.trim()] = e;
                    return n
                }
            },
            _findExtendor: function(e, t) {
                return t.parent && t.parent.map && t.parent.map[e] || this._findExtendor(e, t.parent)
            },
            _extendRule: function(e, t) {
                e.parent !== t.parent && this._cloneAndAddRuleToParent(t, e.parent), e.extends = e.extends || [], e.extends.push(t), t.selector = t.selector.replace(this.rx.STRIP, ""), t.selector = (t.selector && t.selector + ",\n") + e.selector, t.extends && t.extends.forEach(function(t) {
                    this._extendRule(e, t)
                }, this)
            },
            _cloneAndAddRuleToParent: function(e, t) {
                e = Object.create(e), e.parent = t, e.extends && (e.extends = e.extends.slice()), t.rules.push(e)
            },
            rx: {
                EXTEND: /@extends\(([^)]*)\)\s*?;/gim,
                STRIP: /%[^,]*$/
            }
        }
    }(), Polymer.ApplyShim = function() {
        "use strict";

        function e(e, t) {
            e = e.trim(), m[e] = {
                properties: t,
                dependants: {}
            }
        }

        function t(e) {
            return e = e.trim(), m[e]
        }

        function n(e, t) {
            var n = d.exec(t);
            return n && (t = n[1] ? y._getInitialValueForProperty(e) : "apply-shim-inherit"), t
        }

        function r(e) {
            for (var t, r, s, i, o = e.split(";"), a = {}, l = 0; l < o.length; l++) s = o[l], s && (i = s.split(":"), i.length > 1 && (t = i[0].trim(), r = n(t, i.slice(1).join(":")), a[t] = r));
            return a
        }

        function s(e) {
            var t = y.__currentElementProto,
                n = t && t.is;
            for (var r in e.dependants) r !== n && (e.dependants[r].__applyShimInvalid = !0)
        }

        function i(n, i, o, a) {
            if (o && c.processVariableAndFallback(o, function(e, n) {
                    n && t(n) && (a = "@apply " + n + ";")
                }), !a) return n;
            var h = l(a),
                u = n.slice(0, n.indexOf("--")),
                f = r(h),
                p = f,
                d = t(i),
                m = d && d.properties;
            m ? (p = Object.create(m), p = Polymer.Base.mixin(p, f)) : e(i, p);
            var y, v, g = [],
                P = !1;
            for (y in p) v = f[y], void 0 === v && (v = "initial"), !m || y in m || (P = !0), g.push(i + _ + y + ": " + v);
            return P && s(d), d && (d.properties = p), o && (u = n + ";" + u), u + g.join("; ") + ";"
        }

        function o(e, t, n) {
            return "var(" + t + ",var(" + n + "))"
        }

        function a(n, r) {
            n = n.replace(p, "");
            var s = [],
                i = t(n);
            if (i || (e(n, {}), i = t(n)), i) {
                var o = y.__currentElementProto;
                o && (i.dependants[o.is] = o);
                var a, l, c;
                for (a in i.properties) c = r && r[a], l = [a, ": var(", n, _, a], c && l.push(",", c), l.push(")"), s.push(l.join(""))
            }
            return s.join("; ")
        }

        function l(e) {
            for (var t; t = h.exec(e);) {
                var n = t[0],
                    s = t[1],
                    i = t.index,
                    o = i + n.indexOf("@apply"),
                    l = i + n.length,
                    c = e.slice(0, o),
                    u = e.slice(l),
                    f = r(c),
                    p = a(s, f);
                e = [c, p, u].join(""), h.lastIndex = i + p.length
            }
            return e
        }
        var c = Polymer.StyleUtil,
            h = c.rx.MIXIN_MATCH,
            u = c.rx.VAR_ASSIGN,
            f = /var\(\s*(--[^,]*),\s*(--[^)]*)\)/g,
            p = /;\s*/m,
            d = /^\s*(initial)|(inherit)\s*$/,
            _ = "_-_",
            m = {},
            y = {
                _measureElement: null,
                _map: m,
                _separator: _,
                transform: function(e, t) {
                    this.__currentElementProto = t, c.forRulesInStyles(e, this._boundFindDefinitions), c.forRulesInStyles(e, this._boundFindApplications), t && (t.__applyShimInvalid = !1), this.__currentElementProto = null
                },
                _findDefinitions: function(e) {
                    var t = e.parsedCssText;
                    t = t.replace(f, o), t = t.replace(u, i), e.cssText = t, ":root" === e.selector && (e.selector = ":host > *")
                },
                _findApplications: function(e) {
                    e.cssText = l(e.cssText)
                },
                transformRule: function(e) {
                    this._findDefinitions(e), this._findApplications(e)
                },
                _getInitialValueForProperty: function(e) {
                    return this._measureElement || (this._measureElement = document.createElement("meta"), this._measureElement.style.all = "initial", document.head.appendChild(this._measureElement)), window.getComputedStyle(this._measureElement).getPropertyValue(e)
                }
            };
        return y._boundTransformRule = y.transformRule.bind(y), y._boundFindDefinitions = y._findDefinitions.bind(y), y._boundFindApplications = y._findApplications.bind(y), y
    }(),
    function() {
        var e = Polymer.Base._prepElement,
            t = Polymer.Settings.useNativeShadow,
            n = Polymer.StyleUtil,
            r = Polymer.StyleTransformer,
            s = Polymer.StyleExtends,
            i = Polymer.ApplyShim,
            o = Polymer.Settings;
        Polymer.Base._addFeature({
            _prepElement: function(t) {
                this._encapsulateStyle && "shady" !== this.__cssBuild && r.element(t, this.is, this._scopeCssViaAttr), e.call(this, t)
            },
            _prepStyles: function() {
                void 0 === this._encapsulateStyle && (this._encapsulateStyle = !t), t || (this._scopeStyle = n.applyStylePlaceHolder(this.is)), this.__cssBuild = n.cssBuildTypeForModule(this.is)
            },
            _prepShimStyles: function() {
                if (this._template) {
                    var e = n.isTargetedBuild(this.__cssBuild);
                    if (o.useNativeCSSProperties && "shadow" === this.__cssBuild && e) return void(o.preserveStyleIncludes && n.styleIncludesToTemplate(this._template));
                    this._styles = this._styles || this._collectStyles(), o.useNativeCSSProperties && !this.__cssBuild && i.transform(this._styles, this);
                    var s = o.useNativeCSSProperties && e ? this._styles.length && this._styles[0].textContent.trim() : r.elementStyles(this);
                    this._prepStyleProperties(), !this._needsStyleProperties() && s && n.applyCss(s, this.is, t ? this._template.content : null, this._scopeStyle)
                } else this._styles = []
            },
            _collectStyles: function() {
                var e = [],
                    t = "",
                    r = this.styleModules;
                if (r)
                    for (var i, o = 0, a = r.length; o < a && (i = r[o]); o++) t += n.cssFromModule(i);
                t += n.cssFromModule(this.is);
                var l = this._template && this._template.parentNode;
                if (!this._template || l && l.id.toLowerCase() === this.is || (t += n.cssFromElement(this._template)), t) {
                    var c = document.createElement("style");
                    c.textContent = t, s.hasExtends(c.textContent) && (t = s.transform(c)), e.push(c)
                }
                return e
            },
            _elementAdd: function(e) {
                this._encapsulateStyle && (e.__styleScoped ? e.__styleScoped = !1 : r.dom(e, this.is, this._scopeCssViaAttr))
            },
            _elementRemove: function(e) {
                this._encapsulateStyle && r.dom(e, this.is, this._scopeCssViaAttr, !0)
            },
            scopeSubtree: function(e, n) {
                if (!t) {
                    var r = this,
                        s = function(e) {
                            if (e.nodeType === Node.ELEMENT_NODE) {
                                var t = e.getAttribute("class");
                                e.setAttribute("class", r._scopeElementClass(e, t));
                                for (var n, s = e.querySelectorAll("*"), i = 0; i < s.length && (n = s[i]); i++) t = n.getAttribute("class"), n.setAttribute("class", r._scopeElementClass(n, t))
                            }
                        };
                    if (s(e), n) {
                        var i = new MutationObserver(function(e) {
                            for (var t, n = 0; n < e.length && (t = e[n]); n++)
                                if (t.addedNodes)
                                    for (var r = 0; r < t.addedNodes.length; r++) s(t.addedNodes[r])
                        });
                        return i.observe(e, {
                            childList: !0,
                            subtree: !0
                        }), i
                    }
                }
            }
        })
    }(), Polymer.StyleProperties = function() {
        "use strict";

        function e(e, t) {
            var n = parseInt(e / 32),
                r = 1 << e % 32;
            t[n] = (t[n] || 0) | r
        }
        var t = Polymer.DomApi.matchesSelector,
            n = Polymer.StyleUtil,
            r = Polymer.StyleTransformer,
            s = navigator.userAgent.match("Trident"),
            i = Polymer.Settings;
        return {
            decorateStyles: function(e, t) {
                var s = this,
                    i = {},
                    o = [],
                    a = 0,
                    l = r._calcHostScope(t.is, t.extends);
                n.forRulesInStyles(e, function(e, r) {
                    s.decorateRule(e), e.index = a++, s.whenHostOrRootRule(t, e, r, function(r) {
                        if (e.parent.type === n.ruleTypes.MEDIA_RULE && (t.__notStyleScopeCacheable = !0), r.isHost) {
                            var s = r.selector.split(" ").some(function(e) {
                                return 0 === e.indexOf(l) && e.length !== l.length
                            });
                            t.__notStyleScopeCacheable = t.__notStyleScopeCacheable || s
                        }
                    }), s.collectPropertiesInCssText(e.propertyInfo.cssText, i)
                }, function(e) {
                    o.push(e)
                }), e._keyframes = o;
                var c = [];
                for (var h in i) c.push(h);
                return c
            },
            decorateRule: function(e) {
                if (e.propertyInfo) return e.propertyInfo;
                var t = {},
                    n = {},
                    r = this.collectProperties(e, n);
                return r && (t.properties = n, e.rules = null), t.cssText = this.collectCssText(e), e.propertyInfo = t, t
            },
            collectProperties: function(e, t) {
                var n = e.propertyInfo;
                if (!n) {
                    for (var r, s, i, o = this.rx.VAR_ASSIGN, a = e.parsedCssText; r = o.exec(a);) s = (r[2] || r[3]).trim(), "inherit" !== s && (t[r[1].trim()] = s), i = !0;
                    return i
                }
                if (n.properties) return Polymer.Base.mixin(t, n.properties), !0
            },
            collectCssText: function(e) {
                return this.collectConsumingCssText(e.parsedCssText)
            },
            collectConsumingCssText: function(e) {
                return e.replace(this.rx.BRACKETED, "").replace(this.rx.VAR_ASSIGN, "")
            },
            collectPropertiesInCssText: function(e, t) {
                for (var n; n = this.rx.VAR_CONSUMED.exec(e);) {
                    var r = n[1];
                    ":" !== n[2] && (t[r] = !0)
                }
            },
            reify: function(e) {
                for (var t, n = Object.getOwnPropertyNames(e), r = 0; r < n.length; r++) t = n[r], e[t] = this.valueForProperty(e[t], e)
            },
            valueForProperty: function(e, t) {
                if (e)
                    if (e.indexOf(";") >= 0) e = this.valueForProperties(e, t);
                    else {
                        var r = this,
                            s = function(e, n, s, i) {
                                var o = r.valueForProperty(t[n], t);
                                return o && "initial" !== o ? "apply-shim-inherit" === o && (o = "inherit") : o = r.valueForProperty(t[s] || s, t) || s, e + (o || "") + i
                            };
                        e = n.processVariableAndFallback(e, s)
                    }
                return e && e.trim() || ""
            },
            valueForProperties: function(e, t) {
                for (var n, r, s = e.split(";"), i = 0; i < s.length; i++)
                    if (n = s[i]) {
                        if (this.rx.MIXIN_MATCH.lastIndex = 0, r = this.rx.MIXIN_MATCH.exec(n)) n = this.valueForProperty(t[r[1]], t);
                        else {
                            var o = n.indexOf(":");
                            if (o !== -1) {
                                var a = n.substring(o);
                                a = a.trim(), a = this.valueForProperty(a, t) || a, n = n.substring(0, o) + a
                            }
                        }
                        s[i] = n && n.lastIndexOf(";") === n.length - 1 ? n.slice(0, -1) : n || ""
                    }
                return s.join(";")
            },
            applyProperties: function(e, t) {
                var n = "";
                e.propertyInfo || this.decorateRule(e), e.propertyInfo.cssText && (n = this.valueForProperties(e.propertyInfo.cssText, t)), e.cssText = n
            },
            applyKeyframeTransforms: function(e, t) {
                var n = e.cssText,
                    r = e.cssText;
                if (null == e.hasAnimations && (e.hasAnimations = this.rx.ANIMATION_MATCH.test(n)), e.hasAnimations) {
                    var s;
                    if (null == e.keyframeNamesToTransform) {
                        e.keyframeNamesToTransform = [];
                        for (var i in t) s = t[i], r = s(n), n !== r && (n = r, e.keyframeNamesToTransform.push(i))
                    } else {
                        for (var o = 0; o < e.keyframeNamesToTransform.length; ++o) s = t[e.keyframeNamesToTransform[o]], n = s(n);
                        r = n
                    }
                }
                e.cssText = r
            },
            propertyDataFromStyles: function(r, s) {
                var i = {},
                    o = this,
                    a = [];
                return n.forActiveRulesInStyles(r, function(n) {
                    n.propertyInfo || o.decorateRule(n);
                    var r = n.transformedSelector || n.parsedSelector;
                    s && n.propertyInfo.properties && r && t.call(s, r) && (o.collectProperties(n, i), e(n.index, a))
                }), {
                    properties: i,
                    key: a
                }
            },
            _rootSelector: /:root|:host\s*>\s*\*/,
            _checkRoot: function(e, t) {
                return Boolean(t.match(this._rootSelector)) || "html" === e && t.indexOf("html") > -1
            },
            whenHostOrRootRule: function(e, t, n, s) {
                if (t.propertyInfo || self.decorateRule(t), t.propertyInfo.properties) {
                    var o = e.is ? r._calcHostScope(e.is, e.extends) : "html",
                        a = t.parsedSelector,
                        l = this._checkRoot(o, a),
                        c = !l && 0 === a.indexOf(":host"),
                        h = e.__cssBuild || n.__cssBuild;
                    if ("shady" === h && (l = a === o + " > *." + o || a.indexOf("html") > -1, c = !l && 0 === a.indexOf(o)), l || c) {
                        var u = o;
                        c && (i.useNativeShadow && !t.transformedSelector && (t.transformedSelector = r._transformRuleCss(t, r._transformComplexSelector, e.is, o)), u = t.transformedSelector || t.parsedSelector), l && "html" === o && (u = t.transformedSelector || t.parsedSelector), s({
                            selector: u,
                            isHost: c,
                            isRoot: l
                        })
                    }
                }
            },
            hostAndRootPropertiesForScope: function(e) {
                var r = {},
                    s = {},
                    i = this;
                return n.forActiveRulesInStyles(e._styles, function(n, o) {
                    i.whenHostOrRootRule(e, n, o, function(o) {
                        var a = e._element || e;
                        t.call(a, o.selector) && (o.isHost ? i.collectProperties(n, r) : i.collectProperties(n, s))
                    })
                }), {
                    rootProps: s,
                    hostProps: r
                }
            },
            transformStyles: function(e, t, n) {
                var s = this,
                    o = r._calcHostScope(e.is, e.extends),
                    a = e.extends ? "\\" + o.slice(0, -1) + "\\]" : o,
                    l = new RegExp(this.rx.HOST_PREFIX + a + this.rx.HOST_SUFFIX),
                    c = this._elementKeyframeTransforms(e, n);
                return r.elementStyles(e, function(r) {
                    s.applyProperties(r, t), i.useNativeShadow || Polymer.StyleUtil.isKeyframesSelector(r) || !r.cssText || (s.applyKeyframeTransforms(r, c), s._scopeSelector(r, l, o, e._scopeCssViaAttr, n))
                })
            },
            _elementKeyframeTransforms: function(e, t) {
                var n = e._styles._keyframes,
                    r = {};
                if (!i.useNativeShadow && n)
                    for (var s = 0, o = n[s]; s < n.length; o = n[++s]) this._scopeKeyframes(o, t), r[o.keyframesName] = this._keyframesRuleTransformer(o);
                return r
            },
            _keyframesRuleTransformer: function(e) {
                return function(t) {
                    return t.replace(e.keyframesNameRx, e.transformedKeyframesName)
                }
            },
            _scopeKeyframes: function(e, t) {
                e.keyframesNameRx = new RegExp(e.keyframesName, "g"), e.transformedKeyframesName = e.keyframesName + "-" + t, e.transformedSelector = e.transformedSelector || e.selector, e.selector = e.transformedSelector.replace(e.keyframesName, e.transformedKeyframesName)
            },
            _hasDirOrHostContext: function(e) {
                return /:host-context|:dir/.test(e)
            },
            _scopeSelector: function(e, t, n, s, i) {
                e.transformedSelector = e.transformedSelector || e.selector;
                for (var o, a = e.transformedSelector, l = r._calcElementScope(i, s), c = r._calcElementScope(n, s), h = a.split(","), u = this._hasDirOrHostContext(e.parsedSelector), f = 0, p = h.length; f < p && (o = h[f]); f++) h[f] = o.match(t) ? o.replace(n, l) : u ? o.replace(c, l + " " + c) : l + " " + o;
                e.selector = h.join(",")
            },
            applyElementScopeSelector: function(e, t, n, s) {
                var i = s ? e.getAttribute(r.SCOPE_NAME) : e.getAttribute("class") || "",
                    o = n ? i.replace(n, t) : (i ? i + " " : "") + this.XSCOPE_NAME + " " + t;
                i !== o && (s ? e.setAttribute(r.SCOPE_NAME, o) : e.setAttribute("class", o))
            },
            applyElementStyle: function(e, t, r, o) {
                var a = o ? o.textContent || "" : this.transformStyles(e, t, r),
                    l = e._customStyle;
                return l && !i.useNativeShadow && l !== o && (l._useCount--, l._useCount <= 0 && l.parentNode && l.parentNode.removeChild(l)), i.useNativeShadow ? e._customStyle ? (e._customStyle.textContent = a, o = e._customStyle) : a && (o = n.applyCss(a, r, e.root, e._scopeStyle)) : o ? o.parentNode || (s && a.indexOf("@media") > -1 && (o.textContent = a), n.applyStyle(o, null, e._scopeStyle)) : a && (o = n.applyCss(a, r, null, e._scopeStyle)), o && (o._useCount = o._useCount || 0,
                    e._customStyle != o && o._useCount++, e._customStyle = o), o
            },
            mixinCustomStyle: function(e, t) {
                var n;
                for (var r in t) n = t[r], (n || 0 === n) && (e[r] = n)
            },
            updateNativeStyleProperties: function(e, t) {
                var n = e.__customStyleProperties;
                if (n)
                    for (var r = 0; r < n.length; r++) e.style.removeProperty(n[r]);
                var s = [];
                for (var i in t) null !== t[i] && (e.style.setProperty(i, t[i]), s.push(i));
                e.__customStyleProperties = s
            },
            rx: n.rx,
            XSCOPE_NAME: "x-scope"
        }
    }(),
    function() {
        Polymer.StyleCache = function() {
            this.cache = {}
        }, Polymer.StyleCache.prototype = {
            MAX: 100,
            store: function(e, t, n, r) {
                t.keyValues = n, t.styles = r;
                var s = this.cache[e] = this.cache[e] || [];
                s.push(t), s.length > this.MAX && s.shift()
            },
            retrieve: function(e, t, n) {
                var r = this.cache[e];
                if (r)
                    for (var s, i = r.length - 1; i >= 0; i--)
                        if (s = r[i], n === s.styles && this._objectsEqual(t, s.keyValues)) return s
            },
            clear: function() {
                this.cache = {}
            },
            _objectsEqual: function(e, t) {
                var n, r;
                for (var s in e)
                    if (n = e[s], r = t[s], !("object" == typeof n && n ? this._objectsStrictlyEqual(n, r) : n === r)) return !1;
                return !Array.isArray(e) || e.length === t.length
            },
            _objectsStrictlyEqual: function(e, t) {
                return this._objectsEqual(e, t) && this._objectsEqual(t, e)
            }
        }
    }(), Polymer.StyleDefaults = function() {
        var e = Polymer.StyleProperties,
            t = Polymer.StyleCache,
            n = Polymer.Settings.useNativeCSSProperties,
            r = {
                _styles: [],
                _properties: null,
                customStyle: {},
                _styleCache: new t,
                _element: Polymer.DomApi.wrap(document.documentElement),
                addStyle: function(e) {
                    this._styles.push(e), this._properties = null
                },
                get _styleProperties() {
                    return this._properties || (e.decorateStyles(this._styles, this), this._styles._scopeStyleProperties = null, this._properties = e.hostAndRootPropertiesForScope(this).rootProps, e.mixinCustomStyle(this._properties, this.customStyle), e.reify(this._properties)), this._properties
                },
                hasStyleProperties: function() {
                    return Boolean(this._properties)
                },
                _needsStyleProperties: function() {},
                _computeStyleProperties: function() {
                    return this._styleProperties
                },
                updateStyles: function(t) {
                    this._properties = null, t && Polymer.Base.mixin(this.customStyle, t), this._styleCache.clear();
                    for (var r, s = 0; s < this._styles.length; s++) r = this._styles[s], r = r.__importElement || r, r._apply();
                    n && e.updateNativeStyleProperties(document.documentElement, this.customStyle)
                }
            };
        return r
    }(),
    function() {
        "use strict";
        var e = Polymer.Base.serializeValueToAttribute,
            t = Polymer.StyleProperties,
            n = Polymer.StyleTransformer,
            r = Polymer.StyleDefaults,
            s = Polymer.Settings.useNativeShadow,
            i = Polymer.Settings.useNativeCSSProperties;
        Polymer.Base._addFeature({
            _prepStyleProperties: function() {
                i || (this._ownStylePropertyNames = this._styles && this._styles.length ? t.decorateStyles(this._styles, this) : null)
            },
            customStyle: null,
            getComputedStyleValue: function(e) {
                return i || this._styleProperties || this._computeStyleProperties(), !i && this._styleProperties && this._styleProperties[e] || getComputedStyle(this).getPropertyValue(e)
            },
            _setupStyleProperties: function() {
                this.customStyle = {}, this._styleCache = null, this._styleProperties = null, this._scopeSelector = null, this._ownStyleProperties = null, this._customStyle = null
            },
            _needsStyleProperties: function() {
                return Boolean(!i && this._ownStylePropertyNames && this._ownStylePropertyNames.length)
            },
            _validateApplyShim: function() {
                if (this.__applyShimInvalid) {
                    Polymer.ApplyShim.transform(this._styles, this.__proto__);
                    var e = n.elementStyles(this);
                    if (s) {
                        var t = this._template.content.querySelector("style");
                        t && (t.textContent = e)
                    } else {
                        var r = this._scopeStyle && this._scopeStyle.nextSibling;
                        r && (r.textContent = e)
                    }
                }
            },
            _beforeAttached: function() {
                this._scopeSelector && !this.__stylePropertiesInvalid || !this._needsStyleProperties() || (this.__stylePropertiesInvalid = !1, this._updateStyleProperties())
            },
            _findStyleHost: function() {
                for (var e, t = this; e = Polymer.dom(t).getOwnerRoot();) {
                    if (Polymer.isInstance(e.host)) return e.host;
                    t = e.host
                }
                return r
            },
            _updateStyleProperties: function() {
                var e, n = this._findStyleHost();
                n._styleProperties || n._computeStyleProperties(), n._styleCache || (n._styleCache = new Polymer.StyleCache);
                var r = t.propertyDataFromStyles(n._styles, this),
                    i = !this.__notStyleScopeCacheable;
                i && (r.key.customStyle = this.customStyle, e = n._styleCache.retrieve(this.is, r.key, this._styles));
                var a = Boolean(e);
                a ? this._styleProperties = e._styleProperties : this._computeStyleProperties(r.properties), this._computeOwnStyleProperties(), a || (e = o.retrieve(this.is, this._ownStyleProperties, this._styles));
                var l = Boolean(e) && !a,
                    c = this._applyStyleProperties(e);
                a || (c = c && s ? c.cloneNode(!0) : c, e = {
                    style: c,
                    _scopeSelector: this._scopeSelector,
                    _styleProperties: this._styleProperties
                }, i && (r.key.customStyle = {}, this.mixin(r.key.customStyle, this.customStyle), n._styleCache.store(this.is, e, r.key, this._styles)), l || o.store(this.is, Object.create(e), this._ownStyleProperties, this._styles))
            },
            _computeStyleProperties: function(e) {
                var n = this._findStyleHost();
                n._styleProperties || n._computeStyleProperties();
                var r = Object.create(n._styleProperties),
                    s = t.hostAndRootPropertiesForScope(this);
                this.mixin(r, s.hostProps), e = e || t.propertyDataFromStyles(n._styles, this).properties, this.mixin(r, e), this.mixin(r, s.rootProps), t.mixinCustomStyle(r, this.customStyle), t.reify(r), this._styleProperties = r
            },
            _computeOwnStyleProperties: function() {
                for (var e, t = {}, n = 0; n < this._ownStylePropertyNames.length; n++) e = this._ownStylePropertyNames[n], t[e] = this._styleProperties[e];
                this._ownStyleProperties = t
            },
            _scopeCount: 0,
            _applyStyleProperties: function(e) {
                var n = this._scopeSelector;
                this._scopeSelector = e ? e._scopeSelector : this.is + "-" + this.__proto__._scopeCount++;
                var r = t.applyElementStyle(this, this._styleProperties, this._scopeSelector, e && e.style);
                return s || t.applyElementScopeSelector(this, this._scopeSelector, n, this._scopeCssViaAttr), r
            },
            serializeValueToAttribute: function(t, n, r) {
                if (r = r || this, "class" === n && !s) {
                    var i = r === this ? this.domHost || this.dataHost : this;
                    i && (t = i._scopeElementClass(r, t))
                }
                r = this.shadyRoot && this.shadyRoot._hasDistributed ? Polymer.dom(r) : r, e.call(this, t, n, r)
            },
            _scopeElementClass: function(e, t) {
                return s || this._scopeCssViaAttr || (t = (t ? t + " " : "") + a + " " + this.is + (e._scopeSelector ? " " + l + " " + e._scopeSelector : "")), t
            },
            updateStyles: function(e) {
                e && this.mixin(this.customStyle, e), i ? t.updateNativeStyleProperties(this, this.customStyle) : (this.isAttached ? this._needsStyleProperties() ? this._updateStyleProperties() : this._styleProperties = null : this.__stylePropertiesInvalid = !0, this._styleCache && this._styleCache.clear(), this._updateRootStyles())
            },
            _updateRootStyles: function(e) {
                e = e || this.root;
                for (var t, n = Polymer.dom(e)._query(function(e) {
                        return e.shadyRoot || e.shadowRoot
                    }), r = 0, s = n.length; r < s && (t = n[r]); r++) t.updateStyles && t.updateStyles()
            }
        }), Polymer.updateStyles = function(e) {
            r.updateStyles(e), Polymer.Base._updateRootStyles(document)
        };
        var o = new Polymer.StyleCache;
        Polymer.customStyleCache = o;
        var a = n.SCOPE_NAME,
            l = t.XSCOPE_NAME
    }(), Polymer.Base._addFeature({
        _registerFeatures: function() {
            this._prepIs(), this.factoryImpl && this._prepConstructor(), this._prepStyles()
        },
        _finishRegisterFeatures: function() {
            this._prepTemplate(), this._prepShimStyles(), this._prepAnnotations(), this._prepEffects(), this._prepBehaviors(), this._prepPropertyInfo(), this._prepBindings(), this._prepShady()
        },
        _prepBehavior: function(e) {
            this._addPropertyEffects(e.properties), this._addComplexObserverEffects(e.observers), this._addHostAttributes(e.hostAttributes)
        },
        _initFeatures: function() {
            this._setupGestures(), this._setupConfigure(this.__data__), this._setupStyleProperties(), this._setupDebouncers(), this._setupShady(), this._registerHost(), this._template && (this._validateApplyShim(), this._poolContent(), this._beginHosting(), this._stampTemplate(), this._endHosting(), this._marshalAnnotationReferences()), this._marshalInstanceEffects(), this._marshalBehaviors(), this._marshalHostAttributes(), this._marshalAttributes(), this._tryReady()
        },
        _marshalBehavior: function(e) {
            e.listeners && this._listenListeners(e.listeners)
        }
    }),
    function() {
        var e, t = Polymer.StyleProperties,
            n = Polymer.StyleUtil,
            r = Polymer.CssParse,
            s = Polymer.StyleDefaults,
            i = Polymer.StyleTransformer,
            o = Polymer.ApplyShim,
            a = Polymer.Debounce,
            l = Polymer.Settings;
        Polymer({
            is: "custom-style",
            extends: "style",
            _template: null,
            properties: {
                include: String
            },
            ready: function() {
                this.__appliedElement = this.__appliedElement || this, this.__cssBuild = n.getCssBuildType(this), this.__appliedElement !== this && (this.__appliedElement.__cssBuild = this.__cssBuild), this.ownerDocument !== window.document && this.__appliedElement === this && document.head.appendChild(this), this._tryApply()
            },
            attached: function() {
                this._tryApply()
            },
            _tryApply: function() {
                if (!this._appliesToDocument && this.parentNode && "dom-module" !== this.parentNode.localName) {
                    this._appliesToDocument = !0;
                    var e = this.__appliedElement;
                    if (l.useNativeCSSProperties || (this.__needsUpdateStyles = s.hasStyleProperties(), s.addStyle(e)), e.textContent || this.include) this._apply(!0);
                    else {
                        var t = this,
                            n = new MutationObserver(function() {
                                n.disconnect(), t._apply(!0)
                            });
                        n.observe(e, {
                            childList: !0
                        })
                    }
                }
            },
            _updateStyles: function() {
                Polymer.updateStyles()
            },
            _apply: function(e) {
                var t = this.__appliedElement;
                if (this.include && (t.textContent = n.cssFromModules(this.include, !0) + t.textContent), t.textContent) {
                    var r = this.__cssBuild,
                        s = n.isTargetedBuild(r);
                    if (!l.useNativeCSSProperties || !s) {
                        var a = n.rulesForStyle(t);
                        if (s || (n.forEachRule(a, function(e) {
                                i.documentRule(e)
                            }), l.useNativeCSSProperties && !r && o.transform([t])), l.useNativeCSSProperties) t.textContent = n.toCssText(a);
                        else {
                            var c = this,
                                h = function() {
                                    c._flushCustomProperties()
                                };
                            e ? Polymer.RenderStatus.whenReady(h) : h()
                        }
                    }
                }
            },
            _flushCustomProperties: function() {
                this.__needsUpdateStyles ? (this.__needsUpdateStyles = !1, e = a(e, this._updateStyles)) : this._applyCustomProperties()
            },
            _applyCustomProperties: function() {
                var e = this.__appliedElement;
                this._computeStyleProperties();
                var s = this._styleProperties,
                    i = n.rulesForStyle(e);
                i && (e.textContent = n.toCssText(i, function(e) {
                    var n = e.cssText = e.parsedCssText;
                    e.propertyInfo && e.propertyInfo.cssText && (n = r.removeCustomPropAssignment(n), e.cssText = t.valueForProperties(n, s))
                }))
            }
        })
    }(), Polymer.Templatizer = {
        properties: {
            __hideTemplateChildren__: {
                observer: "_showHideChildren"
            }
        },
        _instanceProps: Polymer.nob,
        _parentPropPrefix: "_parent_",
        templatize: function(e) {
            if (this._templatized = e, e._content || (e._content = e.content), e._content._ctor) return this.ctor = e._content._ctor, void this._prepParentProperties(this.ctor.prototype, e);
            var t = Object.create(Polymer.Base);
            this._customPrepAnnotations(t, e), this._prepParentProperties(t, e), t._prepEffects(), this._customPrepEffects(t), t._prepBehaviors(), t._prepPropertyInfo(), t._prepBindings(), t._notifyPathUp = this._notifyPathUpImpl, t._scopeElementClass = this._scopeElementClassImpl, t.listen = this._listenImpl, t._showHideChildren = this._showHideChildrenImpl, t.__setPropertyOrig = this.__setProperty, t.__setProperty = this.__setPropertyImpl;
            var n = this._constructorImpl,
                r = function(e, t) {
                    n.call(this, e, t)
                };
            r.prototype = t, t.constructor = r, e._content._ctor = r, this.ctor = r
        },
        _getRootDataHost: function() {
            return this.dataHost && this.dataHost._rootDataHost || this.dataHost
        },
        _showHideChildrenImpl: function(e) {
            for (var t = this._children, n = 0; n < t.length; n++) {
                var r = t[n];
                Boolean(e) != Boolean(r.__hideTemplateChildren__) && (r.nodeType === Node.TEXT_NODE ? e ? (r.__polymerTextContent__ = r.textContent, r.textContent = "") : r.textContent = r.__polymerTextContent__ : r.style && (e ? (r.__polymerDisplay__ = r.style.display, r.style.display = "none") : r.style.display = r.__polymerDisplay__)), r.__hideTemplateChildren__ = e
            }
        },
        __setPropertyImpl: function(e, t, n, r) {
            r && r.__hideTemplateChildren__ && "textContent" == e && (e = "__polymerTextContent__"), this.__setPropertyOrig(e, t, n, r)
        },
        _debounceTemplate: function(e) {
            Polymer.dom.addDebouncer(this.debounce("_debounceTemplate", e))
        },
        _flushTemplates: function() {
            Polymer.dom.flush()
        },
        _customPrepEffects: function(e) {
            var t = e._parentProps;
            for (var n in t) e._addPropertyEffect(n, "function", this._createHostPropEffector(n));
            for (n in this._instanceProps) e._addPropertyEffect(n, "function", this._createInstancePropEffector(n))
        },
        _customPrepAnnotations: function(e, t) {
            e._template = t;
            var n = t._content;
            if (!n._notes) {
                var r = e._rootDataHost;
                r && (Polymer.Annotations.prepElement = function() {
                    r._prepElement()
                }), n._notes = Polymer.Annotations.parseAnnotations(t), Polymer.Annotations.prepElement = null, this._processAnnotations(n._notes)
            }
            e._notes = n._notes, e._parentProps = n._parentProps
        },
        _prepParentProperties: function(e, t) {
            var n = this._parentProps = e._parentProps;
            if (this._forwardParentProp && n) {
                var r, s = e._parentPropProto;
                if (!s) {
                    for (r in this._instanceProps) delete n[r];
                    s = e._parentPropProto = Object.create(null), t != this && (Polymer.Bind.prepareModel(s), Polymer.Base.prepareModelNotifyPath(s));
                    for (r in n) {
                        var i = this._parentPropPrefix + r,
                            o = [{
                                kind: "function",
                                effect: this._createForwardPropEffector(r),
                                fn: Polymer.Bind._functionEffect
                            }, {
                                kind: "notify",
                                fn: Polymer.Bind._notifyEffect,
                                effect: {
                                    event: Polymer.CaseMap.camelToDashCase(i) + "-changed"
                                }
                            }];
                        s._propertyEffects = s._propertyEffects || {}, s._propertyEffects[i] = o, Polymer.Bind._createAccessors(s, i, o)
                    }
                }
                var a = this;
                t != this && (Polymer.Bind.prepareInstance(t), t._forwardParentProp = function(e, t) {
                    a._forwardParentProp(e, t)
                }), this._extendTemplate(t, s), t._pathEffector = function(e, t, n) {
                    return a._pathEffectorImpl(e, t, n)
                }
            }
        },
        _createForwardPropEffector: function(e) {
            return function(t, n) {
                this._forwardParentProp(e, n)
            }
        },
        _createHostPropEffector: function(e) {
            var t = this._parentPropPrefix;
            return function(n, r) {
                this.dataHost._templatized[t + e] = r
            }
        },
        _createInstancePropEffector: function(e) {
            return function(t, n, r, s) {
                s || this.dataHost._forwardInstanceProp(this, e, n)
            }
        },
        _extendTemplate: function(e, t) {
            var n = Object.getOwnPropertyNames(t);
            t._propertySetter && (e._propertySetter = t._propertySetter);
            for (var r, s = 0; s < n.length && (r = n[s]); s++) {
                var i = e[r];
                if (i && "_propertyEffects" == r) {
                    var o = Polymer.Base.mixin({}, i);
                    e._propertyEffects = Polymer.Base.mixin(o, t._propertyEffects)
                } else {
                    var a = Object.getOwnPropertyDescriptor(t, r);
                    Object.defineProperty(e, r, a), void 0 !== i && e._propertySetter(r, i)
                }
            }
        },
        _showHideChildren: function(e) {},
        _forwardInstancePath: function(e, t, n) {},
        _forwardInstanceProp: function(e, t, n) {},
        _notifyPathUpImpl: function(e, t) {
            var n = this.dataHost,
                r = Polymer.Path.root(e);
            n._forwardInstancePath.call(n, this, e, t), r in n._parentProps && n._templatized._notifyPath(n._parentPropPrefix + e, t)
        },
        _pathEffectorImpl: function(e, t, n) {
            if (this._forwardParentPath && 0 === e.indexOf(this._parentPropPrefix)) {
                var r = e.substring(this._parentPropPrefix.length),
                    s = Polymer.Path.root(r);
                s in this._parentProps && this._forwardParentPath(r, t)
            }
            Polymer.Base._pathEffector.call(this._templatized, e, t, n)
        },
        _constructorImpl: function(e, t) {
            this._rootDataHost = t._getRootDataHost(), this._setupConfigure(e), this._registerHost(t), this._beginHosting(), this.root = this.instanceTemplate(this._template), this.root.__noContent = !this._notes._hasContent, this.root.__styleScoped = !0, this._endHosting(), this._marshalAnnotatedNodes(), this._marshalInstanceEffects(), this._marshalAnnotatedListeners();
            for (var n = [], r = this.root.firstChild; r; r = r.nextSibling) n.push(r), r._templateInstance = this;
            this._children = n, t.__hideTemplateChildren__ && this._showHideChildren(!0), this._tryReady()
        },
        _listenImpl: function(e, t, n) {
            var r = this,
                s = this._rootDataHost,
                i = s._createEventHandler(e, t, n),
                o = function(e) {
                    e.model = r, i(e)
                };
            s._listen(e, t, o)
        },
        _scopeElementClassImpl: function(e, t) {
            var n = this._rootDataHost;
            return n ? n._scopeElementClass(e, t) : t
        },
        stamp: function(e) {
            if (e = e || {}, this._parentProps) {
                var t = this._templatized;
                for (var n in this._parentProps) void 0 === e[n] && (e[n] = t[this._parentPropPrefix + n])
            }
            return new this.ctor(e, this)
        },
        modelForElement: function(e) {
            for (var t; e;)
                if (t = e._templateInstance) {
                    if (t.dataHost == this) return t;
                    e = t.dataHost
                } else e = e.parentNode
        }
    }, Polymer({
        is: "dom-template",
        extends: "template",
        _template: null,
        behaviors: [Polymer.Templatizer],
        ready: function() {
            this.templatize(this)
        }
    }), Polymer._collections = new WeakMap, Polymer.Collection = function(e) {
        Polymer._collections.set(e, this), this.userArray = e, this.store = e.slice(), this.initMap()
    }, Polymer.Collection.prototype = {
        constructor: Polymer.Collection,
        initMap: function() {
            for (var e = this.omap = new WeakMap, t = this.pmap = {}, n = this.store, r = 0; r < n.length; r++) {
                var s = n[r];
                s && "object" == typeof s ? e.set(s, r) : t[s] = r
            }
        },
        add: function(e) {
            var t = this.store.push(e) - 1;
            return e && "object" == typeof e ? this.omap.set(e, t) : this.pmap[e] = t, "#" + t
        },
        removeKey: function(e) {
            (e = this._parseKey(e)) && (this._removeFromMap(this.store[e]), delete this.store[e])
        },
        _removeFromMap: function(e) {
            e && "object" == typeof e ? this.omap.delete(e) : delete this.pmap[e]
        },
        remove: function(e) {
            var t = this.getKey(e);
            return this.removeKey(t), t
        },
        getKey: function(e) {
            var t;
            if (t = e && "object" == typeof e ? this.omap.get(e) : this.pmap[e], void 0 != t) return "#" + t
        },
        getKeys: function() {
            return Object.keys(this.store).map(function(e) {
                return "#" + e
            })
        },
        _parseKey: function(e) {
            if (e && "#" == e[0]) return e.slice(1)
        },
        setItem: function(e, t) {
            if (e = this._parseKey(e)) {
                var n = this.store[e];
                n && this._removeFromMap(n), t && "object" == typeof t ? this.omap.set(t, e) : this.pmap[t] = e, this.store[e] = t
            }
        },
        getItem: function(e) {
            if (e = this._parseKey(e)) return this.store[e]
        },
        getItems: function() {
            var e = [],
                t = this.store;
            for (var n in t) e.push(t[n]);
            return e
        },
        _applySplices: function(e) {
            for (var t, n, r = {}, s = 0; s < e.length && (n = e[s]); s++) {
                n.addedKeys = [];
                for (var i = 0; i < n.removed.length; i++) t = this.getKey(n.removed[i]), r[t] = r[t] ? null : -1;
                for (i = 0; i < n.addedCount; i++) {
                    var o = this.userArray[n.index + i];
                    t = this.getKey(o), t = void 0 === t ? this.add(o) : t, r[t] = r[t] ? null : 1, n.addedKeys.push(t)
                }
            }
            var a = [],
                l = [];
            for (t in r) r[t] < 0 && (this.removeKey(t), a.push(t)), r[t] > 0 && l.push(t);
            return [{
                removed: a,
                added: l
            }]
        }
    }, Polymer.Collection.get = function(e) {
        return Polymer._collections.get(e) || new Polymer.Collection(e)
    }, Polymer.Collection.applySplices = function(e, t) {
        var n = Polymer._collections.get(e);
        return n ? n._applySplices(t) : null
    }, Polymer({
        is: "dom-repeat",
        extends: "template",
        _template: null,
        properties: {
            items: {
                type: Array
            },
            as: {
                type: String,
                value: "item"
            },
            indexAs: {
                type: String,
                value: "index"
            },
            sort: {
                type: Function,
                observer: "_sortChanged"
            },
            filter: {
                type: Function,
                observer: "_filterChanged"
            },
            observe: {
                type: String,
                observer: "_observeChanged"
            },
            delay: Number,
            renderedItemCount: {
                type: Number,
                notify: !Polymer.Settings.suppressTemplateNotifications,
                readOnly: !0
            },
            initialCount: {
                type: Number,
                observer: "_initializeChunking"
            },
            targetFramerate: {
                type: Number,
                value: 20
            },
            notifyDomChange: {
                type: Boolean
            },
            _targetFrameTime: {
                type: Number,
                computed: "_computeFrameTime(targetFramerate)"
            }
        },
        behaviors: [Polymer.Templatizer],
        observers: ["_itemsChanged(items.*)"],
        created: function() {
            this._instances = [], this._pool = [], this._limit = 1 / 0;
            var e = this;
            this._boundRenderChunk = function() {
                e._renderChunk()
            }
        },
        detached: function() {
            this.__isDetached = !0;
            for (var e = 0; e < this._instances.length; e++) this._detachInstance(e)
        },
        attached: function() {
            if (this.__isDetached) {
                this.__isDetached = !1;
                var e, t = Polymer.dom(this).parentNode;
                t.localName == this.is ? (e = t, t = Polymer.dom(t).parentNode) : e = this;
                for (var n = Polymer.dom(t), r = 0; r < this._instances.length; r++) this._attachInstance(r, n, e)
            }
        },
        ready: function() {
            this._instanceProps = {
                __key__: !0
            }, this._instanceProps[this.as] = !0, this._instanceProps[this.indexAs] = !0, this.ctor || this.templatize(this)
        },
        _sortChanged: function(e) {
            var t = this._getRootDataHost();
            this._sortFn = e && ("function" == typeof e ? e : function() {
                return t[e].apply(t, arguments)
            }), this._needFullRefresh = !0, this.items && this._debounceTemplate(this._render)
        },
        _filterChanged: function(e) {
            var t = this._getRootDataHost();
            this._filterFn = e && ("function" == typeof e ? e : function() {
                return t[e].apply(t, arguments)
            }), this._needFullRefresh = !0, this.items && this._debounceTemplate(this._render)
        },
        _computeFrameTime: function(e) {
            return Math.ceil(1e3 / e)
        },
        _initializeChunking: function() {
            this.initialCount && (this._limit = this.initialCount, this._chunkCount = this.initialCount, this._lastChunkTime = performance.now())
        },
        _tryRenderChunk: function() {
            this.items && this._limit < this.items.length && this.debounce("renderChunk", this._requestRenderChunk)
        },
        _requestRenderChunk: function() {
            requestAnimationFrame(this._boundRenderChunk)
        },
        _renderChunk: function() {
            var e = performance.now(),
                t = this._targetFrameTime / (e - this._lastChunkTime);
            this._chunkCount = Math.round(this._chunkCount * t) || 1, this._limit += this._chunkCount, this._lastChunkTime = e, this._debounceTemplate(this._render)
        },
        _observeChanged: function() {
            this._observePaths = this.observe && this.observe.replace(".*", ".").split(" ")
        },
        _itemsChanged: function(e) {
            if ("items" == e.path) Array.isArray(this.items) ? this.collection = Polymer.Collection.get(this.items) : this.items ? this._error(this._logf("dom-repeat", "expected array for `items`, found", this.items)) : this.collection = null, this._keySplices = [], this._indexSplices = [], this._needFullRefresh = !0, this._initializeChunking(), this._debounceTemplate(this._render);
            else if ("items.splices" == e.path) this._keySplices = this._keySplices.concat(e.value.keySplices), this._indexSplices = this._indexSplices.concat(e.value.indexSplices), this._debounceTemplate(this._render);
            else {
                var t = e.path.slice(6);
                this._forwardItemPath(t, e.value), this._checkObservedPaths(t)
            }
        },
        _checkObservedPaths: function(e) {
            if (this._observePaths) {
                e = e.substring(e.indexOf(".") + 1);
                for (var t = this._observePaths, n = 0; n < t.length; n++)
                    if (0 === e.indexOf(t[n])) return this._needFullRefresh = !0, void(this.delay ? this.debounce("render", this._render, this.delay) : this._debounceTemplate(this._render))
            }
        },
        render: function() {
            this._needFullRefresh = !0, this._debounceTemplate(this._render), this._flushTemplates()
        },
        _render: function() {
            this._needFullRefresh ? (this._applyFullRefresh(), this._needFullRefresh = !1) : this._keySplices.length && (this._sortFn ? this._applySplicesUserSort(this._keySplices) : this._filterFn ? this._applyFullRefresh() : this._applySplicesArrayOrder(this._indexSplices)), this._keySplices = [], this._indexSplices = [];
            for (var e = this._keyToInstIdx = {}, t = this._instances.length - 1; t >= 0; t--) {
                var n = this._instances[t];
                n.isPlaceholder && t < this._limit ? n = this._insertInstance(t, n.__key__) : !n.isPlaceholder && t >= this._limit && (n = this._downgradeInstance(t, n.__key__)), e[n.__key__] = t, n.isPlaceholder || n.__setProperty(this.indexAs, t, !0)
            }
            this._pool.length = 0, this._setRenderedItemCount(this._instances.length), Polymer.Settings.suppressTemplateNotifications && !this.notifyDomChange || this.fire("dom-change"), this._tryRenderChunk()
        },
        _applyFullRefresh: function() {
            var e, t = this.collection;
            if (this._sortFn) e = t ? t.getKeys() : [];
            else {
                e = [];
                var n = this.items;
                if (n)
                    for (var r = 0; r < n.length; r++) e.push(t.getKey(n[r]))
            }
            var s = this;
            for (this._filterFn && (e = e.filter(function(e) {
                    return s._filterFn(t.getItem(e))
                })), this._sortFn && e.sort(function(e, n) {
                    return s._sortFn(t.getItem(e), t.getItem(n))
                }), r = 0; r < e.length; r++) {
                var i = e[r],
                    o = this._instances[r];
                o ? (o.__key__ = i, !o.isPlaceholder && r < this._limit && o.__setProperty(this.as, t.getItem(i), !0)) : r < this._limit ? this._insertInstance(r, i) : this._insertPlaceholder(r, i)
            }
            for (var a = this._instances.length - 1; a >= r; a--) this._detachAndRemoveInstance(a)
        },
        _numericSort: function(e, t) {
            return e - t
        },
        _applySplicesUserSort: function(e) {
            for (var t, n, r = this.collection, s = {}, i = 0; i < e.length && (n = e[i]); i++) {
                for (var o = 0; o < n.removed.length; o++) t = n.removed[o], s[t] = s[t] ? null : -1;
                for (o = 0; o < n.added.length; o++) t = n.added[o], s[t] = s[t] ? null : 1
            }
            var a = [],
                l = [];
            for (t in s) s[t] === -1 && a.push(this._keyToInstIdx[t]), 1 === s[t] && l.push(t);
            if (a.length)
                for (a.sort(this._numericSort), i = a.length - 1; i >= 0; i--) {
                    var c = a[i];
                    void 0 !== c && this._detachAndRemoveInstance(c)
                }
            var h = this;
            if (l.length) {
                this._filterFn && (l = l.filter(function(e) {
                    return h._filterFn(r.getItem(e))
                })), l.sort(function(e, t) {
                    return h._sortFn(r.getItem(e), r.getItem(t))
                });
                var u = 0;
                for (i = 0; i < l.length; i++) u = this._insertRowUserSort(u, l[i])
            }
        },
        _insertRowUserSort: function(e, t) {
            for (var n = this.collection, r = n.getItem(t), s = this._instances.length - 1, i = -1; e <= s;) {
                var o = e + s >> 1,
                    a = this._instances[o].__key__,
                    l = this._sortFn(n.getItem(a), r);
                if (l < 0) e = o + 1;
                else {
                    if (!(l > 0)) {
                        i = o;
                        break
                    }
                    s = o - 1
                }
            }
            return i < 0 && (i = s + 1), this._insertPlaceholder(i, t), i
        },
        _applySplicesArrayOrder: function(e) {
            for (var t, n = 0; n < e.length && (t = e[n]); n++) {
                for (var r = 0; r < t.removed.length; r++) this._detachAndRemoveInstance(t.index);
                for (r = 0; r < t.addedKeys.length; r++) this._insertPlaceholder(t.index + r, t.addedKeys[r])
            }
        },
        _detachInstance: function(e) {
            var t = this._instances[e];
            if (!t.isPlaceholder) {
                for (var n = 0; n < t._children.length; n++) {
                    var r = t._children[n];
                    Polymer.dom(t.root).appendChild(r)
                }
                return t
            }
        },
        _attachInstance: function(e, t, n) {
            var r = this._instances[e];
            r.isPlaceholder || t.insertBefore(r.root, n)
        },
        _detachAndRemoveInstance: function(e) {
            var t = this._detachInstance(e);
            t && this._pool.push(t), this._instances.splice(e, 1)
        },
        _insertPlaceholder: function(e, t) {
            this._instances.splice(e, 0, {
                isPlaceholder: !0,
                __key__: t
            })
        },
        _stampInstance: function(e, t) {
            var n = {
                __key__: t
            };
            return n[this.as] = this.collection.getItem(t), n[this.indexAs] = e, this.stamp(n)
        },
        _insertInstance: function(e, t) {
            var n = this._pool.pop();
            n ? (n.__setProperty(this.as, this.collection.getItem(t), !0), n.__setProperty("__key__", t, !0)) : n = this._stampInstance(e, t);
            var r = this._instances[e + 1],
                s = r && !r.isPlaceholder ? r._children[0] : this,
                i = Polymer.dom(this).parentNode;
            return i.localName == this.is && (s == this && (s = i), i = Polymer.dom(i).parentNode), Polymer.dom(i).insertBefore(n.root, s), this._instances[e] = n, n
        },
        _downgradeInstance: function(e, t) {
            var n = this._detachInstance(e);
            return n && this._pool.push(n), n = {
                isPlaceholder: !0,
                __key__: t
            }, this._instances[e] = n, n
        },
        _showHideChildren: function(e) {
            for (var t = 0; t < this._instances.length; t++) this._instances[t].isPlaceholder || this._instances[t]._showHideChildren(e)
        },
        _forwardInstanceProp: function(e, t, n) {
            if (t == this.as) {
                var r;
                r = this._sortFn || this._filterFn ? this.items.indexOf(this.collection.getItem(e.__key__)) : e[this.indexAs], this.set("items." + r, n)
            }
        },
        _forwardInstancePath: function(e, t, n) {
            0 === t.indexOf(this.as + ".") && this._notifyPath("items." + e.__key__ + "." + t.slice(this.as.length + 1), n)
        },
        _forwardParentProp: function(e, t) {
            for (var n, r = this._instances, s = 0; s < r.length && (n = r[s]); s++) n.isPlaceholder || n.__setProperty(e, t, !0)
        },
        _forwardParentPath: function(e, t) {
            for (var n, r = this._instances, s = 0; s < r.length && (n = r[s]); s++) n.isPlaceholder || n._notifyPath(e, t, !0)
        },
        _forwardItemPath: function(e, t) {
            if (this._keyToInstIdx) {
                var n = e.indexOf("."),
                    r = e.substring(0, n < 0 ? e.length : n),
                    s = this._keyToInstIdx[r],
                    i = this._instances[s];
                i && !i.isPlaceholder && (n >= 0 ? (e = this.as + "." + e.substring(n + 1), i._notifyPath(e, t, !0)) : i.__setProperty(this.as, t, !0))
            }
        },
        itemForElement: function(e) {
            var t = this.modelForElement(e);
            return t && t[this.as]
        },
        keyForElement: function(e) {
            var t = this.modelForElement(e);
            return t && t.__key__
        },
        indexForElement: function(e) {
            var t = this.modelForElement(e);
            return t && t[this.indexAs]
        }
    }), Polymer({
        is: "array-selector",
        _template: null,
        properties: {
            items: {
                type: Array,
                observer: "clearSelection"
            },
            multi: {
                type: Boolean,
                value: !1,
                observer: "clearSelection"
            },
            selected: {
                type: Object,
                notify: !0
            },
            selectedItem: {
                type: Object,
                notify: !0
            },
            toggle: {
                type: Boolean,
                value: !1
            }
        },
        clearSelection: function() {
            if (Array.isArray(this.selected))
                for (var e = 0; e < this.selected.length; e++) this.unlinkPaths("selected." + e);
            else this.unlinkPaths("selected"), this.unlinkPaths("selectedItem");
            this.multi ? this.selected && !this.selected.length || (this.selected = [], this._selectedColl = Polymer.Collection.get(this.selected)) : (this.selected = null, this._selectedColl = null), this.selectedItem = null
        },
        isSelected: function(e) {
            return this.multi ? void 0 !== this._selectedColl.getKey(e) : this.selected == e
        },
        deselect: function(e) {
            if (this.multi) {
                if (this.isSelected(e)) {
                    var t = this._selectedColl.getKey(e);
                    this.arrayDelete("selected", e), this.unlinkPaths("selected." + t)
                }
            } else this.selected = null, this.selectedItem = null, this.unlinkPaths("selected"), this.unlinkPaths("selectedItem")
        },
        select: function(e) {
            var t = Polymer.Collection.get(this.items),
                n = t.getKey(e);
            if (this.multi)
                if (this.isSelected(e)) this.toggle && this.deselect(e);
                else {
                    this.push("selected", e);
                    var r = this._selectedColl.getKey(e);
                    this.linkPaths("selected." + r, "items." + n)
                }
            else this.toggle && e == this.selected ? this.deselect() : (this.selected = e, this.selectedItem = e, this.linkPaths("selected", "items." + n), this.linkPaths("selectedItem", "items." + n))
        }
    }), Polymer({
        is: "dom-if",
        extends: "template",
        _template: null,
        properties: {
            if: {
                type: Boolean,
                value: !1,
                observer: "_queueRender"
            },
            restamp: {
                type: Boolean,
                value: !1,
                observer: "_queueRender"
            },
            notifyDomChange: {
                type: Boolean
            }
        },
        behaviors: [Polymer.Templatizer],
        _queueRender: function() {
            this._debounceTemplate(this._render)
        },
        detached: function() {
            var e = this.parentNode;
            e && e.localName == this.is && (e = Polymer.dom(e).parentNode), e && (e.nodeType != Node.DOCUMENT_FRAGMENT_NODE || Polymer.Settings.hasShadow && e instanceof ShadowRoot) || this._teardownInstance()
        },
        attached: function() {
            this.if && this.ctor && this.async(this._ensureInstance)
        },
        render: function() {
            this._flushTemplates()
        },
        _render: function() {
            this.if ? (this.ctor || this.templatize(this), this._ensureInstance(), this._showHideChildren()) : this.restamp && this._teardownInstance(), !this.restamp && this._instance && this._showHideChildren(), this.if != this._lastIf && (Polymer.Settings.suppressTemplateNotifications && !this.notifyDomChange || this.fire("dom-change"), this._lastIf = this.if)
        },
        _ensureInstance: function() {
            var e, t = Polymer.dom(this).parentNode;
            if (t && t.localName == this.is ? (e = t, t = Polymer.dom(t).parentNode) : e = this, t)
                if (this._instance) {
                    var n = this._instance._children;
                    if (n && n.length) {
                        var r = Polymer.dom(e).previousSibling;
                        if (r !== n[n.length - 1])
                            for (var s, i = 0; i < n.length && (s = n[i]); i++) Polymer.dom(t).insertBefore(s, e)
                    }
                } else {
                    this._instance = this.stamp();
                    var o = this._instance.root;
                    Polymer.dom(t).insertBefore(o, e)
                }
        },
        _teardownInstance: function() {
            if (this._instance) {
                var e = this._instance._children;
                if (e && e.length)
                    for (var t, n = Polymer.dom(Polymer.dom(e[0]).parentNode), r = 0; r < e.length && (t = e[r]); r++) n.removeChild(t);
                this._instance = null
            }
        },
        _showHideChildren: function() {
            var e = this.__hideTemplateChildren__ || !this.if;
            this._instance && this._instance._showHideChildren(e)
        },
        _forwardParentProp: function(e, t) {
            this._instance && this._instance.__setProperty(e, t, !0)
        },
        _forwardParentPath: function(e, t) {
            this._instance && this._instance._notifyPath(e, t, !0)
        }
    }), Polymer({
        is: "dom-bind",
        properties: {
            notifyDomChange: {
                type: Boolean
            }
        },
        extends: "template",
        _template: null,
        created: function() {
            var e = this;
            Polymer.RenderStatus.whenReady(function() {
                "loading" == document.readyState ? document.addEventListener("DOMContentLoaded", function() {
                    e._markImportsReady()
                }) : e._markImportsReady()
            })
        },
        _ensureReady: function() {
            this._readied || this._readySelf()
        },
        _markImportsReady: function() {
            this._importsReady = !0, this._ensureReady()
        },
        _registerFeatures: function() {
            this._prepConstructor()
        },
        _insertChildren: function() {
            var e, t = Polymer.dom(this).parentNode;
            t.localName == this.is ? (e = t, t = Polymer.dom(t).parentNode) : e = this, Polymer.dom(t).insertBefore(this.root, e)
        },
        _removeChildren: function() {
            if (this._children)
                for (var e = 0; e < this._children.length; e++) this.root.appendChild(this._children[e])
        },
        _initFeatures: function() {},
        _scopeElementClass: function(e, t) {
            return this.dataHost ? this.dataHost._scopeElementClass(e, t) : t
        },
        _configureInstanceProperties: function() {},
        _prepConfigure: function() {
            var e = {};
            for (var t in this._propertyEffects) e[t] = this[t];
            var n = this._setupConfigure;
            this._setupConfigure = function() {
                n.call(this, e)
            }
        },
        attached: function() {
            this._importsReady && this.render()
        },
        detached: function() {
            this._removeChildren()
        },
        render: function() {
            this._ensureReady(), this._children || (this._template = this, this._prepAnnotations(), this._prepEffects(), this._prepBehaviors(), this._prepConfigure(), this._prepBindings(), this._prepPropertyInfo(), Polymer.Base._initFeatures.call(this), this._children = Polymer.TreeApi.arrayCopyChildNodes(this.root)), this._insertChildren(), Polymer.Settings.suppressTemplateNotifications && !this.notifyDomChange || this.fire("dom-change")
        }
    });


Polymer.NeonAnimationBehavior = {
    properties: {
        animationTiming: {
            type: Object,
            value: function() {
                return {
                    duration: 500,
                    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                    fill: "both"
                }
            }
        }
    },
    isNeonAnimation: !0,
    timingFromConfig: function(i) {
        if (i.timing)
            for (var n in i.timing) this.animationTiming[n] = i.timing[n];
        return this.animationTiming
    },
    setPrefixedProperty: function(i, n, r) {
        for (var t, o = {
                transform: ["webkitTransform"],
                transformOrigin: ["mozTransformOrigin", "webkitTransformOrigin"]
            }, e = o[n], m = 0; t = e[m]; m++) i.style[t] = r;
        i.style[n] = r
    },
    complete: function() {}
};


! function(t, e) {
    var i = {},
        n = {},
        r = {};
    ! function(t, e) {
        function i(t) {
            if ("number" == typeof t) return t;
            var e = {};
            for (var i in t) e[i] = t[i];
            return e
        }

        function n() {
            this._delay = 0, this._endDelay = 0, this._fill = "none", this._iterationStart = 0, this._iterations = 1, this._duration = 0, this._playbackRate = 1, this._direction = "normal", this._easing = "linear", this._easingFunction = x
        }

        function r() {
            return t.isDeprecated("Invalid timing inputs", "2016-03-02", "TypeError exceptions will be thrown instead.", !0)
        }

        function o(e, i, r) {
            var o = new n;
            return i && (o.fill = "both", o.duration = "auto"), "number" != typeof e || isNaN(e) ? void 0 !== e && Object.getOwnPropertyNames(e).forEach(function(i) {
                if ("auto" != e[i]) {
                    if (("number" == typeof o[i] || "duration" == i) && ("number" != typeof e[i] || isNaN(e[i]))) return;
                    if ("fill" == i && -1 == w.indexOf(e[i])) return;
                    if ("direction" == i && -1 == T.indexOf(e[i])) return;
                    if ("playbackRate" == i && 1 !== e[i] && t.isDeprecated("AnimationEffectTiming.playbackRate", "2014-11-28", "Use Animation.playbackRate instead.")) return;
                    o[i] = e[i]
                }
            }) : o.duration = e, o
        }

        function a(t) {
            return "number" == typeof t && (t = isNaN(t) ? {
                duration: 0
            } : {
                duration: t
            }), t
        }

        function s(e, i) {
            return e = t.numericTimingToObject(e), o(e, i)
        }

        function u(t, e, i, n) {
            return t < 0 || t > 1 || i < 0 || i > 1 ? x : function(r) {
                function o(t, e, i) {
                    return 3 * t * (1 - i) * (1 - i) * i + 3 * e * (1 - i) * i * i + i * i * i
                }
                if (r <= 0) {
                    var a = 0;
                    return t > 0 ? a = e / t : !e && i > 0 && (a = n / i), a * r
                }
                if (r >= 1) {
                    var s = 0;
                    return i < 1 ? s = (n - 1) / (i - 1) : 1 == i && t < 1 && (s = (e - 1) / (t - 1)), 1 + s * (r - 1)
                }
                for (var u = 0, c = 1; u < c;) {
                    var f = (u + c) / 2,
                        l = o(t, i, f);
                    if (Math.abs(r - l) < 1e-5) return o(e, n, f);
                    l < r ? u = f : c = f
                }
                return o(e, n, f)
            }
        }

        function c(t, e) {
            return function(i) {
                if (i >= 1) return 1;
                var n = 1 / t;
                return (i += e * n) - i % n
            }
        }

        function f(t) {
            N || (N = document.createElement("div").style), N.animationTimingFunction = "", N.animationTimingFunction = t;
            var e = N.animationTimingFunction;
            if ("" == e && r()) throw new TypeError(t + " is not a valid value for easing");
            return e
        }

        function l(t) {
            if ("linear" == t) return x;
            var e = k.exec(t);
            if (e) return u.apply(this, e.slice(1).map(Number));
            var i = O.exec(t);
            return i ? c(Number(i[1]), {
                start: E,
                middle: A,
                end: P
            }[i[2]]) : j[t] || x
        }

        function h(t) {
            return Math.abs(m(t) / t.playbackRate)
        }

        function m(t) {
            return 0 === t.duration || 0 === t.iterations ? 0 : t.duration * t.iterations
        }

        function d(t, e, i) {
            if (null == e) return S;
            var n = i.delay + t + i.endDelay;
            return e < Math.min(i.delay, n) ? C : e >= Math.min(i.delay + t, n) ? D : F
        }

        function p(t, e, i, n, r) {
            switch (n) {
                case C:
                    return "backwards" == e || "both" == e ? 0 : null;
                case F:
                    return i - r;
                case D:
                    return "forwards" == e || "both" == e ? t : null;
                case S:
                    return null
            }
        }

        function _(t, e, i, n, r) {
            var o = r;
            return 0 === t ? e !== C && (o += i) : o += n / t, o
        }

        function g(t, e, i, n, r, o) {
            var a = t === 1 / 0 ? e % 1 : t % 1;
            return 0 !== a || i !== D || 0 === n || 0 === r && 0 !== o || (a = 1), a
        }

        function b(t, e, i, n) {
            return t === D && e === 1 / 0 ? 1 / 0 : 1 === i ? Math.floor(n) - 1 : Math.floor(n)
        }

        function v(t, e, i) {
            var n = t;
            if ("normal" !== t && "reverse" !== t) {
                var r = e;
                "alternate-reverse" === t && (r += 1), n = "normal", r !== 1 / 0 && r % 2 != 0 && (n = "reverse")
            }
            return "normal" === n ? i : 1 - i
        }

        function y(t, e, i) {
            var n = d(t, e, i),
                r = p(t, i.fill, e, n, i.delay);
            if (null === r) return null;
            var o = _(i.duration, n, i.iterations, r, i.iterationStart),
                a = g(o, i.iterationStart, n, i.iterations, r, i.duration),
                s = b(n, i.iterations, a, o),
                u = v(i.direction, s, a);
            return i._easingFunction(u)
        }
        var w = "backwards|forwards|both|none".split("|"),
            T = "reverse|alternate|alternate-reverse".split("|"),
            x = function(t) {
                return t
            };
        n.prototype = {
            _setMember: function(e, i) {
                this["_" + e] = i, this._effect && (this._effect._timingInput[e] = i, this._effect._timing = t.normalizeTimingInput(this._effect._timingInput), this._effect.activeDuration = t.calculateActiveDuration(this._effect._timing), this._effect._animation && this._effect._animation._rebuildUnderlyingAnimation())
            },
            get playbackRate() {
                return this._playbackRate
            },
            set delay(t) {
                this._setMember("delay", t)
            },
            get delay() {
                return this._delay
            },
            set endDelay(t) {
                this._setMember("endDelay", t)
            },
            get endDelay() {
                return this._endDelay
            },
            set fill(t) {
                this._setMember("fill", t)
            },
            get fill() {
                return this._fill
            },
            set iterationStart(t) {
                if ((isNaN(t) || t < 0) && r()) throw new TypeError("iterationStart must be a non-negative number, received: " + timing.iterationStart);
                this._setMember("iterationStart", t)
            },
            get iterationStart() {
                return this._iterationStart
            },
            set duration(t) {
                if ("auto" != t && (isNaN(t) || t < 0) && r()) throw new TypeError("duration must be non-negative or auto, received: " + t);
                this._setMember("duration", t)
            },
            get duration() {
                return this._duration
            },
            set direction(t) {
                this._setMember("direction", t)
            },
            get direction() {
                return this._direction
            },
            set easing(t) {
                this._easingFunction = l(f(t)), this._setMember("easing", t)
            },
            get easing() {
                return this._easing
            },
            set iterations(t) {
                if ((isNaN(t) || t < 0) && r()) throw new TypeError("iterations must be non-negative, received: " + t);
                this._setMember("iterations", t)
            },
            get iterations() {
                return this._iterations
            }
        };
        var E = 1,
            A = .5,
            P = 0,
            j = {
                ease: u(.25, .1, .25, 1),
                "ease-in": u(.42, 0, 1, 1),
                "ease-out": u(0, 0, .58, 1),
                "ease-in-out": u(.42, 0, .58, 1),
                "step-start": c(1, E),
                "step-middle": c(1, A),
                "step-end": c(1, P)
            },
            N = null,
            R = "\\s*(-?\\d+\\.?\\d*|-?\\.\\d+)\\s*",
            k = new RegExp("cubic-bezier\\(" + R + "," + R + "," + R + "," + R + "\\)"),
            O = /steps\(\s*(\d+)\s*,\s*(start|middle|end)\s*\)/,
            S = 0,
            C = 1,
            D = 2,
            F = 3;
        t.cloneTimingInput = i, t.makeTiming = o, t.numericTimingToObject = a, t.normalizeTimingInput = s, t.calculateActiveDuration = h, t.calculateIterationProgress = y, t.calculatePhase = d, t.normalizeEasing = f, t.parseEasingFunction = l
    }(i),
    function(t, e) {
        function i(t, e) {
            return t in f ? f[t][e] || e : e
        }

        function n(t) {
            return "display" === t || 0 === t.lastIndexOf("animation", 0) || 0 === t.lastIndexOf("transition", 0)
        }

        function r(t, e, r) {
            if (!n(t)) {
                var o = s[t];
                if (o) {
                    u.style[t] = e;
                    for (var a in o) {
                        var c = o[a],
                            f = u.style[c];
                        r[c] = i(c, f)
                    }
                } else r[t] = i(t, e)
            }
        }

        function o(t) {
            var e = [];
            for (var i in t)
                if (!(i in ["easing", "offset", "composite"])) {
                    var n = t[i];
                    Array.isArray(n) || (n = [n]);
                    for (var r, o = n.length, a = 0; a < o; a++) r = {}, r.offset = "offset" in t ? t.offset : 1 == o ? 1 : a / (o - 1), "easing" in t && (r.easing = t.easing), "composite" in t && (r.composite = t.composite), r[i] = n[a], e.push(r)
                }
            return e.sort(function(t, e) {
                return t.offset - e.offset
            }), e
        }

        function a(e) {
            function i() {
                var t = n.length;
                null == n[t - 1].offset && (n[t - 1].offset = 1), t > 1 && null == n[0].offset && (n[0].offset = 0);
                for (var e = 0, i = n[0].offset, r = 1; r < t; r++) {
                    var o = n[r].offset;
                    if (null != o) {
                        for (var a = 1; a < r - e; a++) n[e + a].offset = i + (o - i) * a / (r - e);
                        e = r, i = o
                    }
                }
            }
            if (null == e) return [];
            window.Symbol && Symbol.iterator && Array.prototype.from && e[Symbol.iterator] && (e = Array.from(e)), Array.isArray(e) || (e = o(e));
            for (var n = e.map(function(e) {
                    var i = {};
                    for (var n in e) {
                        var o = e[n];
                        if ("offset" == n) {
                            if (null != o) {
                                if (o = Number(o), !isFinite(o)) throw new TypeError("Keyframe offsets must be numbers.");
                                if (o < 0 || o > 1) throw new TypeError("Keyframe offsets must be between 0 and 1.")
                            }
                        } else if ("composite" == n) {
                            if ("add" == o || "accumulate" == o) throw {
                                type: DOMException.NOT_SUPPORTED_ERR,
                                name: "NotSupportedError",
                                message: "add compositing is not supported"
                            };
                            if ("replace" != o) throw new TypeError("Invalid composite mode " + o + ".")
                        } else o = "easing" == n ? t.normalizeEasing(o) : "" + o;
                        r(n, o, i)
                    }
                    return void 0 == i.offset && (i.offset = null), void 0 == i.easing && (i.easing = "linear"), i
                }), a = !0, s = -1 / 0, u = 0; u < n.length; u++) {
                var c = n[u].offset;
                if (null != c) {
                    if (c < s) throw new TypeError("Keyframes are not loosely sorted by offset. Sort or specify offsets.");
                    s = c
                } else a = !1
            }
            return n = n.filter(function(t) {
                return t.offset >= 0 && t.offset <= 1
            }), a || i(), n
        }
        var s = {
                background: ["backgroundImage", "backgroundPosition", "backgroundSize", "backgroundRepeat", "backgroundAttachment", "backgroundOrigin", "backgroundClip", "backgroundColor"],
                border: ["borderTopColor", "borderTopStyle", "borderTopWidth", "borderRightColor", "borderRightStyle", "borderRightWidth", "borderBottomColor", "borderBottomStyle", "borderBottomWidth", "borderLeftColor", "borderLeftStyle", "borderLeftWidth"],
                borderBottom: ["borderBottomWidth", "borderBottomStyle", "borderBottomColor"],
                borderColor: ["borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor"],
                borderLeft: ["borderLeftWidth", "borderLeftStyle", "borderLeftColor"],
                borderRadius: ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"],
                borderRight: ["borderRightWidth", "borderRightStyle", "borderRightColor"],
                borderTop: ["borderTopWidth", "borderTopStyle", "borderTopColor"],
                borderWidth: ["borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth"],
                flex: ["flexGrow", "flexShrink", "flexBasis"],
                font: ["fontFamily", "fontSize", "fontStyle", "fontVariant", "fontWeight", "lineHeight"],
                margin: ["marginTop", "marginRight", "marginBottom", "marginLeft"],
                outline: ["outlineColor", "outlineStyle", "outlineWidth"],
                padding: ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"]
            },
            u = document.createElementNS("http://www.w3.org/1999/xhtml", "div"),
            c = {
                thin: "1px",
                medium: "3px",
                thick: "5px"
            },
            f = {
                borderBottomWidth: c,
                borderLeftWidth: c,
                borderRightWidth: c,
                borderTopWidth: c,
                fontSize: {
                    "xx-small": "60%",
                    "x-small": "75%",
                    small: "89%",
                    medium: "100%",
                    large: "120%",
                    "x-large": "150%",
                    "xx-large": "200%"
                },
                fontWeight: {
                    normal: "400",
                    bold: "700"
                },
                outlineWidth: c,
                textShadow: {
                    none: "0px 0px 0px transparent"
                },
                boxShadow: {
                    none: "0px 0px 0px 0px transparent"
                }
            };
        t.convertToArrayForm = o, t.normalizeKeyframes = a
    }(i),
    function(t) {
        var e = {};
        t.isDeprecated = function(t, i, n, r) {
            var o = r ? "are" : "is",
                a = new Date,
                s = new Date(i);
            return s.setMonth(s.getMonth() + 3), !(a < s && (t in e || console.warn("Web Animations: " + t + " " + o + " deprecated and will stop working on " + s.toDateString() + ". " + n), e[t] = !0, 1))
        }, t.deprecated = function(e, i, n, r) {
            var o = r ? "are" : "is";
            if (t.isDeprecated(e, i, n, r)) throw new Error(e + " " + o + " no longer supported. " + n)
        }
    }(i),
    function() {
        if (document.documentElement.animate) {
            var t = document.documentElement.animate([], 0),
                e = !0;
            if (t && (e = !1, "play|currentTime|pause|reverse|playbackRate|cancel|finish|startTime|playState".split("|").forEach(function(i) {
                    void 0 === t[i] && (e = !0)
                })), !e) return
        }! function(t, e, i) {
            function n(t) {
                for (var e = {}, i = 0; i < t.length; i++)
                    for (var n in t[i])
                        if ("offset" != n && "easing" != n && "composite" != n) {
                            var r = {
                                offset: t[i].offset,
                                easing: t[i].easing,
                                value: t[i][n]
                            };
                            e[n] = e[n] || [], e[n].push(r)
                        }
                for (var o in e) {
                    var a = e[o];
                    if (0 != a[0].offset || 1 != a[a.length - 1].offset) throw {
                        type: DOMException.NOT_SUPPORTED_ERR,
                        name: "NotSupportedError",
                        message: "Partial keyframes are not supported"
                    }
                }
                return e
            }

            function r(i) {
                var n = [];
                for (var r in i)
                    for (var o = i[r], a = 0; a < o.length - 1; a++) {
                        var s = a,
                            u = a + 1,
                            c = o[s].offset,
                            f = o[u].offset,
                            l = c,
                            h = f;
                        0 == a && (l = -1 / 0, 0 == f && (u = s)), a == o.length - 2 && (h = 1 / 0, 1 == c && (s = u)), n.push({
                            applyFrom: l,
                            applyTo: h,
                            startOffset: o[s].offset,
                            endOffset: o[u].offset,
                            easingFunction: t.parseEasingFunction(o[s].easing),
                            property: r,
                            interpolation: e.propertyInterpolation(r, o[s].value, o[u].value)
                        })
                    }
                return n.sort(function(t, e) {
                    return t.startOffset - e.startOffset
                }), n
            }
            e.convertEffectInput = function(i) {
                var o = t.normalizeKeyframes(i),
                    a = n(o),
                    s = r(a);
                return function(t, i) {
                    if (null != i) s.filter(function(t) {
                        return i >= t.applyFrom && i < t.applyTo
                    }).forEach(function(n) {
                        var r = i - n.startOffset,
                            o = n.endOffset - n.startOffset,
                            a = 0 == o ? 0 : n.easingFunction(r / o);
                        e.apply(t, n.property, n.interpolation(a))
                    });
                    else
                        for (var n in a) "offset" != n && "easing" != n && "composite" != n && e.clear(t, n)
                }
            }
        }(i, n),
        function(t, e, i) {
            function n(t) {
                return t.replace(/-(.)/g, function(t, e) {
                    return e.toUpperCase()
                })
            }

            function r(t, e, i) {
                s[i] = s[i] || [], s[i].push([t, e])
            }

            function o(t, e, i) {
                for (var o = 0; o < i.length; o++) r(t, e, n(i[o]))
            }

            function a(i, r, o) {
                var a = i;
                /-/.test(i) && !t.isDeprecated("Hyphenated property names", "2016-03-22", "Use camelCase instead.", !0) && (a = n(i)), "initial" != r && "initial" != o || ("initial" == r && (r = u[a]), "initial" == o && (o = u[a]));
                for (var c = r == o ? [] : s[a], f = 0; c && f < c.length; f++) {
                    var l = c[f][0](r),
                        h = c[f][0](o);
                    if (void 0 !== l && void 0 !== h) {
                        var m = c[f][1](l, h);
                        if (m) {
                            var d = e.Interpolation.apply(null, m);
                            return function(t) {
                                return 0 == t ? r : 1 == t ? o : d(t)
                            }
                        }
                    }
                }
                return e.Interpolation(!1, !0, function(t) {
                    return t ? o : r
                })
            }
            var s = {};
            e.addPropertiesHandler = o;
            var u = {
                backgroundColor: "transparent",
                backgroundPosition: "0% 0%",
                borderBottomColor: "currentColor",
                borderBottomLeftRadius: "0px",
                borderBottomRightRadius: "0px",
                borderBottomWidth: "3px",
                borderLeftColor: "currentColor",
                borderLeftWidth: "3px",
                borderRightColor: "currentColor",
                borderRightWidth: "3px",
                borderSpacing: "2px",
                borderTopColor: "currentColor",
                borderTopLeftRadius: "0px",
                borderTopRightRadius: "0px",
                borderTopWidth: "3px",
                bottom: "auto",
                clip: "rect(0px, 0px, 0px, 0px)",
                color: "black",
                fontSize: "100%",
                fontWeight: "400",
                height: "auto",
                left: "auto",
                letterSpacing: "normal",
                lineHeight: "120%",
                marginBottom: "0px",
                marginLeft: "0px",
                marginRight: "0px",
                marginTop: "0px",
                maxHeight: "none",
                maxWidth: "none",
                minHeight: "0px",
                minWidth: "0px",
                opacity: "1.0",
                outlineColor: "invert",
                outlineOffset: "0px",
                outlineWidth: "3px",
                paddingBottom: "0px",
                paddingLeft: "0px",
                paddingRight: "0px",
                paddingTop: "0px",
                right: "auto",
                strokeDasharray: "none",
                strokeDashoffset: "0px",
                textIndent: "0px",
                textShadow: "0px 0px 0px transparent",
                top: "auto",
                transform: "",
                verticalAlign: "0px",
                visibility: "visible",
                width: "auto",
                wordSpacing: "normal",
                zIndex: "auto"
            };
            e.propertyInterpolation = a
        }(i, n),
        function(t, e, i) {
            function n(e) {
                var i = t.calculateActiveDuration(e),
                    n = function(n) {
                        return t.calculateIterationProgress(i, n, e)
                    };
                return n._totalDuration = e.delay + i + e.endDelay, n
            }
            e.KeyframeEffect = function(i, r, o, a) {
                var s, u = n(t.normalizeTimingInput(o)),
                    c = e.convertEffectInput(r),
                    f = function() {
                        c(i, s)
                    };
                return f._update = function(t) {
                    return null !== (s = u(t))
                }, f._clear = function() {
                    c(i, null)
                }, f._hasSameTarget = function(t) {
                    return i === t
                }, f._target = i, f._totalDuration = u._totalDuration, f._id = a, f
            }
        }(i, n),
        function(t, e) {
            t.apply = function(e, i, n) {
                e.style[t.propertyName(i)] = n
            }, t.clear = function(e, i) {
                e.style[t.propertyName(i)] = ""
            }
        }(n),
        function(t) {
            window.Element.prototype.animate = function(e, i) {
                var n = "";
                return i && i.id && (n = i.id), t.timeline._play(t.KeyframeEffect(this, e, i, n))
            }
        }(n),
        function(t, e) {
            function i(t, e, n) {
                if ("number" == typeof t && "number" == typeof e) return t * (1 - n) + e * n;
                if ("boolean" == typeof t && "boolean" == typeof e) return n < .5 ? t : e;
                if (t.length == e.length) {
                    for (var r = [], o = 0; o < t.length; o++) r.push(i(t[o], e[o], n));
                    return r
                }
                throw "Mismatched interpolation arguments " + t + ":" + e
            }
            t.Interpolation = function(t, e, n) {
                return function(r) {
                    return n(i(t, e, r))
                }
            }
        }(n),
        function(t, e, i) {
            t.sequenceNumber = 0;
            var n = function(t, e, i) {
                this.target = t, this.currentTime = e, this.timelineTime = i, this.type = "finish", this.bubbles = !1, this.cancelable = !1, this.currentTarget = t, this.defaultPrevented = !1, this.eventPhase = Event.AT_TARGET, this.timeStamp = Date.now()
            };
            e.Animation = function(e) {
                this.id = "", e && e._id && (this.id = e._id), this._sequenceNumber = t.sequenceNumber++, this._currentTime = 0, this._startTime = null, this._paused = !1, this._playbackRate = 1, this._inTimeline = !0, this._finishedFlag = !0, this.onfinish = null, this._finishHandlers = [], this._effect = e, this._inEffect = this._effect._update(0), this._idle = !0, this._currentTimePending = !1
            }, e.Animation.prototype = {
                _ensureAlive: function() {
                    this.playbackRate < 0 && 0 === this.currentTime ? this._inEffect = this._effect._update(-1) : this._inEffect = this._effect._update(this.currentTime), this._inTimeline || !this._inEffect && this._finishedFlag || (this._inTimeline = !0, e.timeline._animations.push(this))
                },
                _tickCurrentTime: function(t, e) {
                    t != this._currentTime && (this._currentTime = t, this._isFinished && !e && (this._currentTime = this._playbackRate > 0 ? this._totalDuration : 0), this._ensureAlive())
                },
                get currentTime() {
                    return this._idle || this._currentTimePending ? null : this._currentTime
                },
                set currentTime(t) {
                    t = +t, isNaN(t) || (e.restart(), this._paused || null == this._startTime || (this._startTime = this._timeline.currentTime - t / this._playbackRate), this._currentTimePending = !1, this._currentTime != t && (this._idle && (this._idle = !1, this._paused = !0), this._tickCurrentTime(t, !0), e.applyDirtiedAnimation(this)))
                },
                get startTime() {
                    return this._startTime
                },
                set startTime(t) {
                    t = +t, isNaN(t) || this._paused || this._idle || (this._startTime = t, this._tickCurrentTime((this._timeline.currentTime - this._startTime) * this.playbackRate), e.applyDirtiedAnimation(this))
                },
                get playbackRate() {
                    return this._playbackRate
                },
                set playbackRate(t) {
                    if (t != this._playbackRate) {
                        var i = this.currentTime;
                        this._playbackRate = t, this._startTime = null, "paused" != this.playState && "idle" != this.playState && (this._finishedFlag = !1, this._idle = !1, this._ensureAlive(), e.applyDirtiedAnimation(this)), null != i && (this.currentTime = i)
                    }
                },
                get _isFinished() {
                    return !this._idle && (this._playbackRate > 0 && this._currentTime >= this._totalDuration || this._playbackRate < 0 && this._currentTime <= 0)
                },
                get _totalDuration() {
                    return this._effect._totalDuration
                },
                get playState() {
                    return this._idle ? "idle" : null == this._startTime && !this._paused && 0 != this.playbackRate || this._currentTimePending ? "pending" : this._paused ? "paused" : this._isFinished ? "finished" : "running"
                },
                _rewind: function() {
                    if (this._playbackRate >= 0) this._currentTime = 0;
                    else {
                        if (!(this._totalDuration < 1 / 0)) throw new DOMException("Unable to rewind negative playback rate animation with infinite duration", "InvalidStateError");
                        this._currentTime = this._totalDuration
                    }
                },
                play: function() {
                    this._paused = !1, (this._isFinished || this._idle) && (this._rewind(), this._startTime = null), this._finishedFlag = !1, this._idle = !1, this._ensureAlive(), e.applyDirtiedAnimation(this)
                },
                pause: function() {
                    this._isFinished || this._paused || this._idle ? this._idle && (this._rewind(), this._idle = !1) : this._currentTimePending = !0, this._startTime = null, this._paused = !0
                },
                finish: function() {
                    this._idle || (this.currentTime = this._playbackRate > 0 ? this._totalDuration : 0, this._startTime = this._totalDuration - this.currentTime, this._currentTimePending = !1, e.applyDirtiedAnimation(this))
                },
                cancel: function() {
                    this._inEffect && (this._inEffect = !1, this._idle = !0, this._paused = !1, this._isFinished = !0, this._finishedFlag = !0, this._currentTime = 0, this._startTime = null, this._effect._update(null), e.applyDirtiedAnimation(this))
                },
                reverse: function() {
                    this.playbackRate *= -1, this.play()
                },
                addEventListener: function(t, e) {
                    "function" == typeof e && "finish" == t && this._finishHandlers.push(e)
                },
                removeEventListener: function(t, e) {
                    if ("finish" == t) {
                        var i = this._finishHandlers.indexOf(e);
                        i >= 0 && this._finishHandlers.splice(i, 1)
                    }
                },
                _fireEvents: function(t) {
                    if (this._isFinished) {
                        if (!this._finishedFlag) {
                            var e = new n(this, this._currentTime, t),
                                i = this._finishHandlers.concat(this.onfinish ? [this.onfinish] : []);
                            setTimeout(function() {
                                i.forEach(function(t) {
                                    t.call(e.target, e)
                                })
                            }, 0), this._finishedFlag = !0
                        }
                    } else this._finishedFlag = !1
                },
                _tick: function(t, e) {
                    this._idle || this._paused || (null == this._startTime ? e && (this.startTime = t - this._currentTime / this.playbackRate) : this._isFinished || this._tickCurrentTime((t - this._startTime) * this.playbackRate)), e && (this._currentTimePending = !1, this._fireEvents(t))
                },
                get _needsTick() {
                    return this.playState in {
                        pending: 1,
                        running: 1
                    } || !this._finishedFlag
                },
                _targetAnimations: function() {
                    var t = this._effect._target;
                    return t._activeAnimations || (t._activeAnimations = []), t._activeAnimations
                },
                _markTarget: function() {
                    var t = this._targetAnimations(); - 1 === t.indexOf(this) && t.push(this)
                },
                _unmarkTarget: function() {
                    var t = this._targetAnimations(),
                        e = t.indexOf(this); - 1 !== e && t.splice(e, 1)
                }
            }
        }(i, n),
        function(t, e, i) {
            function n(t) {
                var e = c;
                c = [], t < _.currentTime && (t = _.currentTime), _._animations.sort(r), _._animations = s(t, !0, _._animations)[0], e.forEach(function(e) {
                    e[1](t)
                }), a(), l = void 0
            }

            function r(t, e) {
                return t._sequenceNumber - e._sequenceNumber
            }

            function o() {
                this._animations = [], this.currentTime = window.performance && performance.now ? performance.now() : 0
            }

            function a() {
                d.forEach(function(t) {
                    t()
                }), d.length = 0
            }

            function s(t, i, n) {
                p = !0, m = !1, e.timeline.currentTime = t, h = !1;
                var r = [],
                    o = [],
                    a = [],
                    s = [];
                return n.forEach(function(e) {
                    e._tick(t, i), e._inEffect ? (o.push(e._effect), e._markTarget()) : (r.push(e._effect), e._unmarkTarget()), e._needsTick && (h = !0);
                    var n = e._inEffect || e._needsTick;
                    e._inTimeline = n, n ? a.push(e) : s.push(e)
                }), d.push.apply(d, r), d.push.apply(d, o), h && requestAnimationFrame(function() {}), p = !1, [a, s]
            }
            var u = window.requestAnimationFrame,
                c = [],
                f = 0;
            window.requestAnimationFrame = function(t) {
                var e = f++;
                return 0 == c.length && u(n), c.push([e, t]), e
            }, window.cancelAnimationFrame = function(t) {
                c.forEach(function(e) {
                    e[0] == t && (e[1] = function() {})
                })
            }, o.prototype = {
                _play: function(i) {
                    i._timing = t.normalizeTimingInput(i.timing);
                    var n = new e.Animation(i);
                    return n._idle = !1, n._timeline = this, this._animations.push(n), e.restart(), e.applyDirtiedAnimation(n), n
                }
            };
            var l = void 0,
                h = !1,
                m = !1;
            e.restart = function() {
                return h || (h = !0, requestAnimationFrame(function() {}), m = !0), m
            }, e.applyDirtiedAnimation = function(t) {
                if (!p) {
                    t._markTarget();
                    var i = t._targetAnimations();
                    i.sort(r), s(e.timeline.currentTime, !1, i.slice())[1].forEach(function(t) {
                        var e = _._animations.indexOf(t); - 1 !== e && _._animations.splice(e, 1)
                    }), a()
                }
            };
            var d = [],
                p = !1,
                _ = new o;
            e.timeline = _
        }(i, n),
        function(t) {
            function e(t, e) {
                var i = t.exec(e);
                if (i) return i = t.ignoreCase ? i[0].toLowerCase() : i[0], [i, e.substr(i.length)]
            }

            function i(t, e) {
                e = e.replace(/^\s*/, "");
                var i = t(e);
                if (i) return [i[0], i[1].replace(/^\s*/, "")]
            }

            function n(t, n, r) {
                t = i.bind(null, t);
                for (var o = [];;) {
                    var a = t(r);
                    if (!a) return [o, r];
                    if (o.push(a[0]), r = a[1], !(a = e(n, r)) || "" == a[1]) return [o, r];
                    r = a[1]
                }
            }

            function r(t, e) {
                for (var i = 0, n = 0; n < e.length && (!/\s|,/.test(e[n]) || 0 != i); n++)
                    if ("(" == e[n]) i++;
                    else if (")" == e[n] && (i--, 0 == i && n++, i <= 0)) break;
                var r = t(e.substr(0, n));
                return void 0 == r ? void 0 : [r, e.substr(n)]
            }

            function o(t, e) {
                for (var i = t, n = e; i && n;) i > n ? i %= n : n %= i;
                return i = t * e / (i + n)
            }

            function a(t) {
                return function(e) {
                    var i = t(e);
                    return i && (i[0] = void 0), i
                }
            }

            function s(t, e) {
                return function(i) {
                    return t(i) || [e, i]
                }
            }

            function u(e, i) {
                for (var n = [], r = 0; r < e.length; r++) {
                    var o = t.consumeTrimmed(e[r], i);
                    if (!o || "" == o[0]) return;
                    void 0 !== o[0] && n.push(o[0]), i = o[1]
                }
                if ("" == i) return n
            }

            function c(t, e, i, n, r) {
                for (var a = [], s = [], u = [], c = o(n.length, r.length), f = 0; f < c; f++) {
                    var l = e(n[f % n.length], r[f % r.length]);
                    if (!l) return;
                    a.push(l[0]), s.push(l[1]), u.push(l[2])
                }
                return [a, s, function(e) {
                    var n = e.map(function(t, e) {
                        return u[e](t)
                    }).join(i);
                    return t ? t(n) : n
                }]
            }

            function f(t, e, i) {
                for (var n = [], r = [], o = [], a = 0, s = 0; s < i.length; s++)
                    if ("function" == typeof i[s]) {
                        var u = i[s](t[a], e[a++]);
                        n.push(u[0]), r.push(u[1]), o.push(u[2])
                    } else ! function(t) {
                        n.push(!1), r.push(!1), o.push(function() {
                            return i[t]
                        })
                    }(s);
                return [n, r, function(t) {
                    for (var e = "", i = 0; i < t.length; i++) e += o[i](t[i]);
                    return e
                }]
            }
            t.consumeToken = e, t.consumeTrimmed = i, t.consumeRepeated = n, t.consumeParenthesised = r, t.ignore = a, t.optional = s, t.consumeList = u, t.mergeNestedRepeated = c.bind(null, null), t.mergeWrappedNestedRepeated = c, t.mergeList = f
        }(n),
        function(t) {
            function e(e) {
                function i(e) {
                    var i = t.consumeToken(/^inset/i, e);
                    if (i) return n.inset = !0, i;
                    var i = t.consumeLengthOrPercent(e);
                    if (i) return n.lengths.push(i[0]), i;
                    var i = t.consumeColor(e);
                    return i ? (n.color = i[0], i) : void 0
                }
                var n = {
                        inset: !1,
                        lengths: [],
                        color: null
                    },
                    r = t.consumeRepeated(i, /^/, e);
                if (r && r[0].length) return [n, r[1]]
            }

            function i(i) {
                var n = t.consumeRepeated(e, /^,/, i);
                if (n && "" == n[1]) return n[0]
            }

            function n(e, i) {
                for (; e.lengths.length < Math.max(e.lengths.length, i.lengths.length);) e.lengths.push({
                    px: 0
                });
                for (; i.lengths.length < Math.max(e.lengths.length, i.lengths.length);) i.lengths.push({
                    px: 0
                });
                if (e.inset == i.inset && !!e.color == !!i.color) {
                    for (var n, r = [], o = [
                            [], 0
                        ], a = [
                            [], 0
                        ], s = 0; s < e.lengths.length; s++) {
                        var u = t.mergeDimensions(e.lengths[s], i.lengths[s], 2 == s);
                        o[0].push(u[0]), a[0].push(u[1]), r.push(u[2])
                    }
                    if (e.color && i.color) {
                        var c = t.mergeColors(e.color, i.color);
                        o[1] = c[0], a[1] = c[1], n = c[2]
                    }
                    return [o, a, function(t) {
                        for (var i = e.inset ? "inset " : " ", o = 0; o < r.length; o++) i += r[o](t[0][o]) + " ";
                        return n && (i += n(t[1])), i
                    }]
                }
            }

            function r(e, i, n, r) {
                function o(t) {
                    return {
                        inset: t,
                        color: [0, 0, 0, 0],
                        lengths: [{
                            px: 0
                        }, {
                            px: 0
                        }, {
                            px: 0
                        }, {
                            px: 0
                        }]
                    }
                }
                for (var a = [], s = [], u = 0; u < n.length || u < r.length; u++) {
                    var c = n[u] || o(r[u].inset),
                        f = r[u] || o(n[u].inset);
                    a.push(c), s.push(f)
                }
                return t.mergeNestedRepeated(e, i, a, s)
            }
            var o = r.bind(null, n, ", ");
            t.addPropertiesHandler(i, o, ["box-shadow", "text-shadow"])
        }(n),
        function(t, e) {
            function i(t) {
                return t.toFixed(3).replace(/0+$/, "").replace(/\.$/, "")
            }

            function n(t, e, i) {
                return Math.min(e, Math.max(t, i))
            }

            function r(t) {
                if (/^\s*[-+]?(\d*\.)?\d+\s*$/.test(t)) return Number(t)
            }

            function o(t, e) {
                return [t, e, i]
            }

            function a(t, e) {
                if (0 != t) return u(0, 1 / 0)(t, e)
            }

            function s(t, e) {
                return [t, e, function(t) {
                    return Math.round(n(1, 1 / 0, t))
                }]
            }

            function u(t, e) {
                return function(r, o) {
                    return [r, o, function(r) {
                        return i(n(t, e, r))
                    }]
                }
            }

            function c(t) {
                var e = t.trim().split(/\s*[\s,]\s*/);
                if (0 !== e.length) {
                    for (var i = [], n = 0; n < e.length; n++) {
                        var o = r(e[n]);
                        if (void 0 === o) return;
                        i.push(o)
                    }
                    return i
                }
            }

            function f(t, e) {
                if (t.length == e.length) return [t, e, function(t) {
                    return t.map(i).join(" ")
                }]
            }

            function l(t, e) {
                return [t, e, Math.round]
            }
            t.clamp = n, t.addPropertiesHandler(c, f, ["stroke-dasharray"]), t.addPropertiesHandler(r, u(0, 1 / 0), ["border-image-width", "line-height"]), t.addPropertiesHandler(r, u(0, 1), ["opacity", "shape-image-threshold"]), t.addPropertiesHandler(r, a, ["flex-grow", "flex-shrink"]), t.addPropertiesHandler(r, s, ["orphans", "widows"]), t.addPropertiesHandler(r, l, ["z-index"]), t.parseNumber = r, t.parseNumberList = c, t.mergeNumbers = o, t.numberToString = i
        }(n),
        function(t, e) {
            function i(t, e) {
                if ("visible" == t || "visible" == e) return [0, 1, function(i) {
                    return i <= 0 ? t : i >= 1 ? e : "visible"
                }]
            }
            t.addPropertiesHandler(String, i, ["visibility"])
        }(n),
        function(t, e) {
            function i(t) {
                t = t.trim(), o.fillStyle = "#000", o.fillStyle = t;
                var e = o.fillStyle;
                if (o.fillStyle = "#fff", o.fillStyle = t, e == o.fillStyle) {
                    o.fillRect(0, 0, 1, 1);
                    var i = o.getImageData(0, 0, 1, 1).data;
                    o.clearRect(0, 0, 1, 1);
                    var n = i[3] / 255;
                    return [i[0] * n, i[1] * n, i[2] * n, n]
                }
            }

            function n(e, i) {
                return [e, i, function(e) {
                    function i(t) {
                        return Math.max(0, Math.min(255, t))
                    }
                    if (e[3])
                        for (var n = 0; n < 3; n++) e[n] = Math.round(i(e[n] / e[3]));
                    return e[3] = t.numberToString(t.clamp(0, 1, e[3])), "rgba(" + e.join(",") + ")"
                }]
            }
            var r = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
            r.width = r.height = 1;
            var o = r.getContext("2d");
            t.addPropertiesHandler(i, n, ["background-color", "border-bottom-color", "border-left-color", "border-right-color", "border-top-color", "color", "fill", "flood-color", "lighting-color", "outline-color", "stop-color", "stroke", "text-decoration-color"]), t.consumeColor = t.consumeParenthesised.bind(null, i), t.mergeColors = n
        }(n),
        function(t, e) {
            function i(t) {
                function e() {
                    var e = s.exec(t);
                    a = e ? e[0] : void 0
                }

                function i() {
                    var t = Number(a);
                    return e(), t
                }

                function n() {
                    if ("(" !== a) return i();
                    e();
                    var t = o();
                    return ")" !== a ? NaN : (e(), t)
                }

                function r() {
                    for (var t = n();
                        "*" === a || "/" === a;) {
                        var i = a;
                        e();
                        var r = n();
                        "*" === i ? t *= r : t /= r
                    }
                    return t
                }

                function o() {
                    for (var t = r();
                        "+" === a || "-" === a;) {
                        var i = a;
                        e();
                        var n = r();
                        "+" === i ? t += n : t -= n
                    }
                    return t
                }
                var a, s = /([\+\-\w\.]+|[\(\)\*\/])/g;
                return e(), o()
            }

            function n(t, e) {
                if ("0" == (e = e.trim().toLowerCase()) && "px".search(t) >= 0) return {
                    px: 0
                };
                if (/^[^(]*$|^calc/.test(e)) {
                    e = e.replace(/calc\(/g, "(");
                    var n = {};
                    e = e.replace(t, function(t) {
                        return n[t] = null, "U" + t
                    });
                    for (var r = "U(" + t.source + ")", o = e.replace(/[-+]?(\d*\.)?\d+([Ee][-+]?\d+)?/g, "N").replace(new RegExp("N" + r, "g"), "D").replace(/\s[+-]\s/g, "O").replace(/\s/g, ""), a = [/N\*(D)/g, /(N|D)[*\/]N/g, /(N|D)O\1/g, /\((N|D)\)/g], s = 0; s < a.length;) a[s].test(o) ? (o = o.replace(a[s], "$1"), s = 0) : s++;
                    if ("D" == o) {
                        for (var u in n) {
                            var c = i(e.replace(new RegExp("U" + u, "g"), "").replace(new RegExp(r, "g"), "*0"));
                            if (!isFinite(c)) return;
                            n[u] = c
                        }
                        return n
                    }
                }
            }

            function r(t, e) {
                return o(t, e, !0)
            }

            function o(e, i, n) {
                var r, o = [];
                for (r in e) o.push(r);
                for (r in i) o.indexOf(r) < 0 && o.push(r);
                return e = o.map(function(t) {
                    return e[t] || 0
                }), i = o.map(function(t) {
                    return i[t] || 0
                }), [e, i, function(e) {
                    var i = e.map(function(i, r) {
                        return 1 == e.length && n && (i = Math.max(i, 0)), t.numberToString(i) + o[r]
                    }).join(" + ");
                    return e.length > 1 ? "calc(" + i + ")" : i
                }]
            }
            var a = "px|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc",
                s = n.bind(null, new RegExp(a, "g")),
                u = n.bind(null, new RegExp(a + "|%", "g")),
                c = n.bind(null, /deg|rad|grad|turn/g);
            t.parseLength = s, t.parseLengthOrPercent = u, t.consumeLengthOrPercent = t.consumeParenthesised.bind(null, u), t.parseAngle = c, t.mergeDimensions = o;
            var f = t.consumeParenthesised.bind(null, s),
                l = t.consumeRepeated.bind(void 0, f, /^/),
                h = t.consumeRepeated.bind(void 0, l, /^,/);
            t.consumeSizePairList = h;
            var m = function(t) {
                    var e = h(t);
                    if (e && "" == e[1]) return e[0]
                },
                d = t.mergeNestedRepeated.bind(void 0, r, " "),
                p = t.mergeNestedRepeated.bind(void 0, d, ",");
            t.mergeNonNegativeSizePair = d, t.addPropertiesHandler(m, p, ["background-size"]), t.addPropertiesHandler(u, r, ["border-bottom-width", "border-image-width", "border-left-width", "border-right-width", "border-top-width", "flex-basis", "font-size", "height", "line-height", "max-height", "max-width", "outline-width", "width"]), t.addPropertiesHandler(u, o, ["border-bottom-left-radius", "border-bottom-right-radius", "border-top-left-radius", "border-top-right-radius", "bottom", "left", "letter-spacing", "margin-bottom", "margin-left", "margin-right", "margin-top", "min-height", "min-width", "outline-offset", "padding-bottom", "padding-left", "padding-right", "padding-top", "perspective", "right", "shape-margin", "stroke-dashoffset", "text-indent", "top", "vertical-align", "word-spacing"])
        }(n),
        function(t, e) {
            function i(e) {
                return t.consumeLengthOrPercent(e) || t.consumeToken(/^auto/, e)
            }

            function n(e) {
                var n = t.consumeList([t.ignore(t.consumeToken.bind(null, /^rect/)), t.ignore(t.consumeToken.bind(null, /^\(/)), t.consumeRepeated.bind(null, i, /^,/), t.ignore(t.consumeToken.bind(null, /^\)/))], e);
                if (n && 4 == n[0].length) return n[0]
            }

            function r(e, i) {
                return "auto" == e || "auto" == i ? [!0, !1, function(n) {
                    var r = n ? e : i;
                    if ("auto" == r) return "auto";
                    var o = t.mergeDimensions(r, r);
                    return o[2](o[0])
                }] : t.mergeDimensions(e, i)
            }

            function o(t) {
                return "rect(" + t + ")"
            }
            var a = t.mergeWrappedNestedRepeated.bind(null, o, r, ", ");
            t.parseBox = n, t.mergeBoxes = a, t.addPropertiesHandler(n, a, ["clip"])
        }(n),
        function(t, e) {
            function i(t) {
                return function(e) {
                    var i = 0;
                    return t.map(function(t) {
                        return t === f ? e[i++] : t
                    })
                }
            }

            function n(t) {
                return t
            }

            function r(e) {
                if ("none" == (e = e.toLowerCase().trim())) return [];
                for (var i, n = /\s*(\w+)\(([^)]*)\)/g, r = [], o = 0; i = n.exec(e);) {
                    if (i.index != o) return;
                    o = i.index + i[0].length;
                    var a = i[1],
                        s = m[a];
                    if (!s) return;
                    var u = i[2].split(","),
                        c = s[0];
                    if (c.length < u.length) return;
                    for (var f = [], d = 0; d < c.length; d++) {
                        var p, _ = u[d],
                            g = c[d];
                        if (void 0 === (p = _ ? {
                                A: function(e) {
                                    return "0" == e.trim() ? h : t.parseAngle(e)
                                },
                                N: t.parseNumber,
                                T: t.parseLengthOrPercent,
                                L: t.parseLength
                            }[g.toUpperCase()](_) : {
                                a: h,
                                n: f[0],
                                t: l
                            }[g])) return;
                        f.push(p)
                    }
                    if (r.push({
                            t: a,
                            d: f
                        }), n.lastIndex == e.length) return r
                }
            }

            function o(t) {
                return t.toFixed(6).replace(".000000", "")
            }

            function a(e, i) {
                if (e.decompositionPair !== i) {
                    e.decompositionPair = i;
                    var n = t.makeMatrixDecomposition(e)
                }
                if (i.decompositionPair !== e) {
                    i.decompositionPair = e;
                    var r = t.makeMatrixDecomposition(i)
                }
                return null == n[0] || null == r[0] ? [
                    [!1],
                    [!0],
                    function(t) {
                        return t ? i[0].d : e[0].d
                    }
                ] : (n[0].push(0), r[0].push(1), [n, r, function(e) {
                    var i = t.quat(n[0][3], r[0][3], e[5]);
                    return t.composeMatrix(e[0], e[1], e[2], i, e[4]).map(o).join(",")
                }])
            }

            function s(t) {
                return t.replace(/[xy]/, "")
            }

            function u(t) {
                return t.replace(/(x|y|z|3d)?$/, "3d")
            }

            function c(e, i) {
                var n = t.makeMatrixDecomposition && !0,
                    r = !1;
                if (!e.length || !i.length) {
                    e.length || (r = !0, e = i, i = []);
                    for (var o = 0; o < e.length; o++) {
                        var c = e[o].t,
                            f = e[o].d,
                            l = "scale" == c.substr(0, 5) ? 1 : 0;
                        i.push({
                            t: c,
                            d: f.map(function(t) {
                                if ("number" == typeof t) return l;
                                var e = {};
                                for (var i in t) e[i] = l;
                                return e
                            })
                        })
                    }
                }
                var h = function(t, e) {
                        return "perspective" == t && "perspective" == e || ("matrix" == t || "matrix3d" == t) && ("matrix" == e || "matrix3d" == e)
                    },
                    d = [],
                    p = [],
                    _ = [];
                if (e.length != i.length) {
                    if (!n) return;
                    var g = a(e, i);
                    d = [g[0]], p = [g[1]], _ = [
                        ["matrix", [g[2]]]
                    ]
                } else
                    for (var o = 0; o < e.length; o++) {
                        var c, b = e[o].t,
                            v = i[o].t,
                            y = e[o].d,
                            w = i[o].d,
                            T = m[b],
                            x = m[v];
                        if (h(b, v)) {
                            if (!n) return;
                            var g = a([e[o]], [i[o]]);
                            d.push(g[0]), p.push(g[1]), _.push(["matrix", [g[2]]])
                        } else {
                            if (b == v) c = b;
                            else if (T[2] && x[2] && s(b) == s(v)) c = s(b), y = T[2](y), w = x[2](w);
                            else {
                                if (!T[1] || !x[1] || u(b) != u(v)) {
                                    if (!n) return;
                                    var g = a(e, i);
                                    d = [g[0]], p = [g[1]], _ = [
                                        ["matrix", [g[2]]]
                                    ];
                                    break
                                }
                                c = u(b), y = T[1](y), w = x[1](w)
                            }
                            for (var E = [], A = [], P = [], j = 0; j < y.length; j++) {
                                var N = "number" == typeof y[j] ? t.mergeNumbers : t.mergeDimensions,
                                    g = N(y[j], w[j]);
                                E[j] = g[0], A[j] = g[1], P.push(g[2])
                            }
                            d.push(E), p.push(A), _.push([c, P])
                        }
                    }
                if (r) {
                    var R = d;
                    d = p, p = R
                }
                return [d, p, function(t) {
                    return t.map(function(t, e) {
                        var i = t.map(function(t, i) {
                            return _[e][1][i](t)
                        }).join(",");
                        return "matrix" == _[e][0] && 16 == i.split(",").length && (_[e][0] = "matrix3d"), _[e][0] + "(" + i + ")"
                    }).join(" ")
                }]
            }
            var f = null,
                l = {
                    px: 0
                },
                h = {
                    deg: 0
                },
                m = {
                    matrix: ["NNNNNN", [f, f, 0, 0, f, f, 0, 0, 0, 0, 1, 0, f, f, 0, 1], n],
                    matrix3d: ["NNNNNNNNNNNNNNNN", n],
                    rotate: ["A"],
                    rotatex: ["A"],
                    rotatey: ["A"],
                    rotatez: ["A"],
                    rotate3d: ["NNNA"],
                    perspective: ["L"],
                    scale: ["Nn", i([f, f, 1]), n],
                    scalex: ["N", i([f, 1, 1]), i([f, 1])],
                    scaley: ["N", i([1, f, 1]), i([1, f])],
                    scalez: ["N", i([1, 1, f])],
                    scale3d: ["NNN", n],
                    skew: ["Aa", null, n],
                    skewx: ["A", null, i([f, h])],
                    skewy: ["A", null, i([h, f])],
                    translate: ["Tt", i([f, f, l]), n],
                    translatex: ["T", i([f, l, l]), i([f, l])],
                    translatey: ["T", i([l, f, l]), i([l, f])],
                    translatez: ["L", i([l, l, f])],
                    translate3d: ["TTL", n]
                };
            t.addPropertiesHandler(r, c, ["transform"]), t.transformToSvgMatrix = function(e) {
                var i = t.transformListToMatrix(r(e));
                return "matrix(" + o(i[0]) + " " + o(i[1]) + " " + o(i[4]) + " " + o(i[5]) + " " + o(i[12]) + " " + o(i[13]) + ")";
            }
        }(n),
        function(t, e) {
            function i(t, e) {
                e.concat([t]).forEach(function(e) {
                    e in document.documentElement.style && (n[t] = e), r[e] = t
                })
            }
            var n = {},
                r = {};
            i("transform", ["webkitTransform", "msTransform"]), i("transformOrigin", ["webkitTransformOrigin"]), i("perspective", ["webkitPerspective"]), i("perspectiveOrigin", ["webkitPerspectiveOrigin"]), t.propertyName = function(t) {
                return n[t] || t
            }, t.unprefixedPropertyName = function(t) {
                return r[t] || t
            }
        }(n)
    }(),
    function() {
        if (void 0 === document.createElement("div").animate([]).oncancel) {
            var t;
            if (window.performance && performance.now) var t = function() {
                return performance.now()
            };
            else var t = function() {
                return Date.now()
            };
            var e = function(t, e, i) {
                    this.target = t, this.currentTime = e, this.timelineTime = i, this.type = "cancel", this.bubbles = !1, this.cancelable = !1, this.currentTarget = t, this.defaultPrevented = !1, this.eventPhase = Event.AT_TARGET, this.timeStamp = Date.now()
                },
                i = window.Element.prototype.animate;
            window.Element.prototype.animate = function(n, r) {
                var o = i.call(this, n, r);
                o._cancelHandlers = [], o.oncancel = null;
                var a = o.cancel;
                o.cancel = function() {
                    a.call(this);
                    var i = new e(this, null, t()),
                        n = this._cancelHandlers.concat(this.oncancel ? [this.oncancel] : []);
                    setTimeout(function() {
                        n.forEach(function(t) {
                            t.call(i.target, i)
                        })
                    }, 0)
                };
                var s = o.addEventListener;
                o.addEventListener = function(t, e) {
                    "function" == typeof e && "cancel" == t ? this._cancelHandlers.push(e) : s.call(this, t, e)
                };
                var u = o.removeEventListener;
                return o.removeEventListener = function(t, e) {
                    if ("cancel" == t) {
                        var i = this._cancelHandlers.indexOf(e);
                        i >= 0 && this._cancelHandlers.splice(i, 1)
                    } else u.call(this, t, e)
                }, o
            }
        }
    }(),
    function(t) {
        var e = document.documentElement,
            i = null,
            n = !1;
        try {
            var r = getComputedStyle(e).getPropertyValue("opacity"),
                o = "0" == r ? "1" : "0";
            i = e.animate({
                opacity: [o, o]
            }, {
                duration: 1
            }), i.currentTime = 0, n = getComputedStyle(e).getPropertyValue("opacity") == o
        } catch (t) {} finally {
            i && i.cancel()
        }
        if (!n) {
            var a = window.Element.prototype.animate;
            window.Element.prototype.animate = function(e, i) {
                return window.Symbol && Symbol.iterator && Array.prototype.from && e[Symbol.iterator] && (e = Array.from(e)), Array.isArray(e) || null === e || (e = t.convertToArrayForm(e)), a.call(this, e, i)
            }
        }
    }(i),
    function(t, e, i) {
        function n(t) {
            var i = e.timeline;
            i.currentTime = t, i._discardAnimations(), 0 == i._animations.length ? o = !1 : requestAnimationFrame(n)
        }
        var r = window.requestAnimationFrame;
        window.requestAnimationFrame = function(t) {
            return r(function(i) {
                e.timeline._updateAnimationsPromises(), t(i), e.timeline._updateAnimationsPromises()
            })
        }, e.AnimationTimeline = function() {
            this._animations = [], this.currentTime = void 0
        }, e.AnimationTimeline.prototype = {
            getAnimations: function() {
                return this._discardAnimations(), this._animations.slice()
            },
            _updateAnimationsPromises: function() {
                e.animationsWithPromises = e.animationsWithPromises.filter(function(t) {
                    return t._updatePromises()
                })
            },
            _discardAnimations: function() {
                this._updateAnimationsPromises(), this._animations = this._animations.filter(function(t) {
                    return "finished" != t.playState && "idle" != t.playState
                })
            },
            _play: function(t) {
                var i = new e.Animation(t, this);
                return this._animations.push(i), e.restartWebAnimationsNextTick(), i._updatePromises(), i._animation.play(), i._updatePromises(), i
            },
            play: function(t) {
                return t && t.remove(), this._play(t)
            }
        };
        var o = !1;
        e.restartWebAnimationsNextTick = function() {
            o || (o = !0, requestAnimationFrame(n))
        };
        var a = new e.AnimationTimeline;
        e.timeline = a;
        try {
            Object.defineProperty(window.document, "timeline", {
                configurable: !0,
                get: function() {
                    return a
                }
            })
        } catch (t) {}
        try {
            window.document.timeline = a
        } catch (t) {}
    }(0, r),
    function(t, e, i) {
        e.animationsWithPromises = [], e.Animation = function(e, i) {
            if (this.id = "", e && e._id && (this.id = e._id), this.effect = e, e && (e._animation = this), !i) throw new Error("Animation with null timeline is not supported");
            this._timeline = i, this._sequenceNumber = t.sequenceNumber++, this._holdTime = 0, this._paused = !1, this._isGroup = !1, this._animation = null, this._childAnimations = [], this._callback = null, this._oldPlayState = "idle", this._rebuildUnderlyingAnimation(), this._animation.cancel(), this._updatePromises()
        }, e.Animation.prototype = {
            _updatePromises: function() {
                var t = this._oldPlayState,
                    e = this.playState;
                return this._readyPromise && e !== t && ("idle" == e ? (this._rejectReadyPromise(), this._readyPromise = void 0) : "pending" == t ? this._resolveReadyPromise() : "pending" == e && (this._readyPromise = void 0)), this._finishedPromise && e !== t && ("idle" == e ? (this._rejectFinishedPromise(), this._finishedPromise = void 0) : "finished" == e ? this._resolveFinishedPromise() : "finished" == t && (this._finishedPromise = void 0)), this._oldPlayState = this.playState, this._readyPromise || this._finishedPromise
            },
            _rebuildUnderlyingAnimation: function() {
                this._updatePromises();
                var t, i, n, r, o = !!this._animation;
                o && (t = this.playbackRate, i = this._paused, n = this.startTime, r = this.currentTime, this._animation.cancel(), this._animation._wrapper = null, this._animation = null), (!this.effect || this.effect instanceof window.KeyframeEffect) && (this._animation = e.newUnderlyingAnimationForKeyframeEffect(this.effect), e.bindAnimationForKeyframeEffect(this)), (this.effect instanceof window.SequenceEffect || this.effect instanceof window.GroupEffect) && (this._animation = e.newUnderlyingAnimationForGroup(this.effect), e.bindAnimationForGroup(this)), this.effect && this.effect._onsample && e.bindAnimationForCustomEffect(this), o && (1 != t && (this.playbackRate = t), null !== n ? this.startTime = n : null !== r ? this.currentTime = r : null !== this._holdTime && (this.currentTime = this._holdTime), i && this.pause()), this._updatePromises()
            },
            _updateChildren: function() {
                if (this.effect && "idle" != this.playState) {
                    var t = this.effect._timing.delay;
                    this._childAnimations.forEach(function(i) {
                        this._arrangeChildren(i, t), this.effect instanceof window.SequenceEffect && (t += e.groupChildDuration(i.effect))
                    }.bind(this))
                }
            },
            _setExternalAnimation: function(t) {
                if (this.effect && this._isGroup)
                    for (var e = 0; e < this.effect.children.length; e++) this.effect.children[e]._animation = t, this._childAnimations[e]._setExternalAnimation(t)
            },
            _constructChildAnimations: function() {
                if (this.effect && this._isGroup) {
                    var t = this.effect._timing.delay;
                    this._removeChildAnimations(), this.effect.children.forEach(function(i) {
                        var n = e.timeline._play(i);
                        this._childAnimations.push(n), n.playbackRate = this.playbackRate, this._paused && n.pause(), i._animation = this.effect._animation, this._arrangeChildren(n, t), this.effect instanceof window.SequenceEffect && (t += e.groupChildDuration(i))
                    }.bind(this))
                }
            },
            _arrangeChildren: function(t, e) {
                null === this.startTime ? t.currentTime = this.currentTime - e / this.playbackRate : t.startTime !== this.startTime + e / this.playbackRate && (t.startTime = this.startTime + e / this.playbackRate)
            },
            get timeline() {
                return this._timeline
            },
            get playState() {
                return this._animation ? this._animation.playState : "idle"
            },
            get finished() {
                return window.Promise ? (this._finishedPromise || (-1 == e.animationsWithPromises.indexOf(this) && e.animationsWithPromises.push(this), this._finishedPromise = new Promise(function(t, e) {
                    this._resolveFinishedPromise = function() {
                        t(this)
                    }, this._rejectFinishedPromise = function() {
                        e({
                            type: DOMException.ABORT_ERR,
                            name: "AbortError"
                        })
                    }
                }.bind(this)), "finished" == this.playState && this._resolveFinishedPromise()), this._finishedPromise) : (console.warn("Animation Promises require JavaScript Promise constructor"), null)
            },
            get ready() {
                return window.Promise ? (this._readyPromise || (-1 == e.animationsWithPromises.indexOf(this) && e.animationsWithPromises.push(this), this._readyPromise = new Promise(function(t, e) {
                    this._resolveReadyPromise = function() {
                        t(this)
                    }, this._rejectReadyPromise = function() {
                        e({
                            type: DOMException.ABORT_ERR,
                            name: "AbortError"
                        })
                    }
                }.bind(this)), "pending" !== this.playState && this._resolveReadyPromise()), this._readyPromise) : (console.warn("Animation Promises require JavaScript Promise constructor"), null)
            },
            get onfinish() {
                return this._animation.onfinish
            },
            set onfinish(t) {
                this._animation.onfinish = "function" == typeof t ? function(e) {
                    e.target = this, t.call(this, e)
                }.bind(this) : t
            },
            get oncancel() {
                return this._animation.oncancel
            },
            set oncancel(t) {
                this._animation.oncancel = "function" == typeof t ? function(e) {
                    e.target = this, t.call(this, e)
                }.bind(this) : t
            },
            get currentTime() {
                this._updatePromises();
                var t = this._animation.currentTime;
                return this._updatePromises(), t
            },
            set currentTime(t) {
                this._updatePromises(), this._animation.currentTime = isFinite(t) ? t : Math.sign(t) * Number.MAX_VALUE, this._register(), this._forEachChild(function(e, i) {
                    e.currentTime = t - i
                }), this._updatePromises()
            },
            get startTime() {
                return this._animation.startTime
            },
            set startTime(t) {
                this._updatePromises(), this._animation.startTime = isFinite(t) ? t : Math.sign(t) * Number.MAX_VALUE, this._register(), this._forEachChild(function(e, i) {
                    e.startTime = t + i
                }), this._updatePromises()
            },
            get playbackRate() {
                return this._animation.playbackRate
            },
            set playbackRate(t) {
                this._updatePromises();
                var e = this.currentTime;
                this._animation.playbackRate = t, this._forEachChild(function(e) {
                    e.playbackRate = t
                }), null !== e && (this.currentTime = e), this._updatePromises()
            },
            play: function() {
                this._updatePromises(), this._paused = !1, this._animation.play(), -1 == this._timeline._animations.indexOf(this) && this._timeline._animations.push(this), this._register(), e.awaitStartTime(this), this._forEachChild(function(t) {
                    var e = t.currentTime;
                    t.play(), t.currentTime = e
                }), this._updatePromises()
            },
            pause: function() {
                this._updatePromises(), this.currentTime && (this._holdTime = this.currentTime), this._animation.pause(), this._register(), this._forEachChild(function(t) {
                    t.pause()
                }), this._paused = !0, this._updatePromises()
            },
            finish: function() {
                this._updatePromises(), this._animation.finish(), this._register(), this._updatePromises()
            },
            cancel: function() {
                this._updatePromises(), this._animation.cancel(), this._register(), this._removeChildAnimations(), this._updatePromises()
            },
            reverse: function() {
                this._updatePromises();
                var t = this.currentTime;
                this._animation.reverse(), this._forEachChild(function(t) {
                    t.reverse()
                }), null !== t && (this.currentTime = t), this._updatePromises()
            },
            addEventListener: function(t, e) {
                var i = e;
                "function" == typeof e && (i = function(t) {
                    t.target = this, e.call(this, t)
                }.bind(this), e._wrapper = i), this._animation.addEventListener(t, i)
            },
            removeEventListener: function(t, e) {
                this._animation.removeEventListener(t, e && e._wrapper || e)
            },
            _removeChildAnimations: function() {
                for (; this._childAnimations.length;) this._childAnimations.pop().cancel()
            },
            _forEachChild: function(e) {
                var i = 0;
                if (this.effect.children && this._childAnimations.length < this.effect.children.length && this._constructChildAnimations(), this._childAnimations.forEach(function(t) {
                        e.call(this, t, i), this.effect instanceof window.SequenceEffect && (i += t.effect.activeDuration)
                    }.bind(this)), "pending" != this.playState) {
                    var n = this.effect._timing,
                        r = this.currentTime;
                    null !== r && (r = t.calculateIterationProgress(t.calculateActiveDuration(n), r, n)), (null == r || isNaN(r)) && this._removeChildAnimations()
                }
            }
        }, window.Animation = e.Animation
    }(i, r),
    function(t, e, i) {
        function n(e) {
            this._frames = t.normalizeKeyframes(e)
        }

        function r() {
            for (var t = !1; u.length;) u.shift()._updateChildren(), t = !0;
            return t
        }
        var o = function(t) {
            if (t._animation = void 0, t instanceof window.SequenceEffect || t instanceof window.GroupEffect)
                for (var e = 0; e < t.children.length; e++) o(t.children[e])
        };
        e.removeMulti = function(t) {
            for (var e = [], i = 0; i < t.length; i++) {
                var n = t[i];
                n._parent ? (-1 == e.indexOf(n._parent) && e.push(n._parent), n._parent.children.splice(n._parent.children.indexOf(n), 1), n._parent = null, o(n)) : n._animation && n._animation.effect == n && (n._animation.cancel(), n._animation.effect = new KeyframeEffect(null, []), n._animation._callback && (n._animation._callback._animation = null), n._animation._rebuildUnderlyingAnimation(), o(n))
            }
            for (i = 0; i < e.length; i++) e[i]._rebuild()
        }, e.KeyframeEffect = function(e, i, r, o) {
            return this.target = e, this._parent = null, r = t.numericTimingToObject(r), this._timingInput = t.cloneTimingInput(r), this._timing = t.normalizeTimingInput(r), this.timing = t.makeTiming(r, !1, this), this.timing._effect = this, "function" == typeof i ? (t.deprecated("Custom KeyframeEffect", "2015-06-22", "Use KeyframeEffect.onsample instead."), this._normalizedKeyframes = i) : this._normalizedKeyframes = new n(i), this._keyframes = i, this.activeDuration = t.calculateActiveDuration(this._timing), this._id = o, this
        }, e.KeyframeEffect.prototype = {
            getFrames: function() {
                return "function" == typeof this._normalizedKeyframes ? this._normalizedKeyframes : this._normalizedKeyframes._frames
            },
            set onsample(t) {
                if ("function" == typeof this.getFrames()) throw new Error("Setting onsample on custom effect KeyframeEffect is not supported.");
                this._onsample = t, this._animation && this._animation._rebuildUnderlyingAnimation()
            },
            get parent() {
                return this._parent
            },
            clone: function() {
                if ("function" == typeof this.getFrames()) throw new Error("Cloning custom effects is not supported.");
                var e = new KeyframeEffect(this.target, [], t.cloneTimingInput(this._timingInput), this._id);
                return e._normalizedKeyframes = this._normalizedKeyframes, e._keyframes = this._keyframes, e
            },
            remove: function() {
                e.removeMulti([this])
            }
        };
        var a = Element.prototype.animate;
        Element.prototype.animate = function(t, i) {
            var n = "";
            return i && i.id && (n = i.id), e.timeline._play(new e.KeyframeEffect(this, t, i, n))
        };
        var s = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
        e.newUnderlyingAnimationForKeyframeEffect = function(t) {
            if (t) {
                var e = t.target || s,
                    i = t._keyframes;
                "function" == typeof i && (i = []);
                var n = t._timingInput;
                n.id = t._id
            } else var e = s,
                i = [],
                n = 0;
            return a.apply(e, [i, n])
        }, e.bindAnimationForKeyframeEffect = function(t) {
            t.effect && "function" == typeof t.effect._normalizedKeyframes && e.bindAnimationForCustomEffect(t)
        };
        var u = [];
        e.awaitStartTime = function(t) {
            null === t.startTime && t._isGroup && (0 == u.length && requestAnimationFrame(r), u.push(t))
        };
        var c = window.getComputedStyle;
        Object.defineProperty(window, "getComputedStyle", {
            configurable: !0,
            enumerable: !0,
            value: function() {
                e.timeline._updateAnimationsPromises();
                var t = c.apply(this, arguments);
                return r() && (t = c.apply(this, arguments)), e.timeline._updateAnimationsPromises(), t
            }
        }), window.KeyframeEffect = e.KeyframeEffect, window.Element.prototype.getAnimations = function() {
            return document.timeline.getAnimations().filter(function(t) {
                return null !== t.effect && t.effect.target == this
            }.bind(this))
        }
    }(i, r),
    function(t, e, i) {
        function n(t) {
            t._registered || (t._registered = !0, a.push(t), s || (s = !0, requestAnimationFrame(r)))
        }

        function r(t) {
            var e = a;
            a = [], e.sort(function(t, e) {
                return t._sequenceNumber - e._sequenceNumber
            }), e = e.filter(function(t) {
                t();
                var e = t._animation ? t._animation.playState : "idle";
                return "running" != e && "pending" != e && (t._registered = !1), t._registered
            }), a.push.apply(a, e), a.length ? (s = !0, requestAnimationFrame(r)) : s = !1
        }
        var o = (document.createElementNS("http://www.w3.org/1999/xhtml", "div"), 0);
        e.bindAnimationForCustomEffect = function(e) {
            var i, r = e.effect.target,
                a = "function" == typeof e.effect.getFrames();
            i = a ? e.effect.getFrames() : e.effect._onsample;
            var s = e.effect.timing,
                u = null;
            s = t.normalizeTimingInput(s);
            var c = function() {
                var n = c._animation ? c._animation.currentTime : null;
                null !== n && (n = t.calculateIterationProgress(t.calculateActiveDuration(s), n, s), isNaN(n) && (n = null)), n !== u && (a ? i(n, r, e.effect) : i(n, e.effect, e.effect._animation)), u = n
            };
            c._animation = e, c._registered = !1, c._sequenceNumber = o++, e._callback = c, n(c)
        };
        var a = [],
            s = !1;
        e.Animation.prototype._register = function() {
            this._callback && n(this._callback)
        }
    }(i, r),
    function(t, e, i) {
        function n(t) {
            return t._timing.delay + t.activeDuration + t._timing.endDelay
        }

        function r(e, i, n) {
            this._id = n, this._parent = null, this.children = e || [], this._reparent(this.children), i = t.numericTimingToObject(i), this._timingInput = t.cloneTimingInput(i), this._timing = t.normalizeTimingInput(i, !0), this.timing = t.makeTiming(i, !0, this), this.timing._effect = this, "auto" === this._timing.duration && (this._timing.duration = this.activeDuration)
        }
        window.SequenceEffect = function() {
            r.apply(this, arguments)
        }, window.GroupEffect = function() {
            r.apply(this, arguments)
        }, r.prototype = {
            _isAncestor: function(t) {
                for (var e = this; null !== e;) {
                    if (e == t) return !0;
                    e = e._parent
                }
                return !1
            },
            _rebuild: function() {
                for (var t = this; t;) "auto" === t.timing.duration && (t._timing.duration = t.activeDuration), t = t._parent;
                this._animation && this._animation._rebuildUnderlyingAnimation()
            },
            _reparent: function(t) {
                e.removeMulti(t);
                for (var i = 0; i < t.length; i++) t[i]._parent = this
            },
            _putChild: function(t, e) {
                for (var i = e ? "Cannot append an ancestor or self" : "Cannot prepend an ancestor or self", n = 0; n < t.length; n++)
                    if (this._isAncestor(t[n])) throw {
                        type: DOMException.HIERARCHY_REQUEST_ERR,
                        name: "HierarchyRequestError",
                        message: i
                    };
                for (var n = 0; n < t.length; n++) e ? this.children.push(t[n]) : this.children.unshift(t[n]);
                this._reparent(t), this._rebuild()
            },
            append: function() {
                this._putChild(arguments, !0)
            },
            prepend: function() {
                this._putChild(arguments, !1)
            },
            get parent() {
                return this._parent
            },
            get firstChild() {
                return this.children.length ? this.children[0] : null
            },
            get lastChild() {
                return this.children.length ? this.children[this.children.length - 1] : null
            },
            clone: function() {
                for (var e = t.cloneTimingInput(this._timingInput), i = [], n = 0; n < this.children.length; n++) i.push(this.children[n].clone());
                return this instanceof GroupEffect ? new GroupEffect(i, e) : new SequenceEffect(i, e)
            },
            remove: function() {
                e.removeMulti([this])
            }
        }, window.SequenceEffect.prototype = Object.create(r.prototype), Object.defineProperty(window.SequenceEffect.prototype, "activeDuration", {
            get: function() {
                var t = 0;
                return this.children.forEach(function(e) {
                    t += n(e)
                }), Math.max(t, 0)
            }
        }), window.GroupEffect.prototype = Object.create(r.prototype), Object.defineProperty(window.GroupEffect.prototype, "activeDuration", {
            get: function() {
                var t = 0;
                return this.children.forEach(function(e) {
                    t = Math.max(t, n(e))
                }), t
            }
        }), e.newUnderlyingAnimationForGroup = function(i) {
            var n, r = null,
                o = function(e) {
                    var i = n._wrapper;
                    if (i && "pending" != i.playState && i.effect) return null == e ? void i._removeChildAnimations() : 0 == e && i.playbackRate < 0 && (r || (r = t.normalizeTimingInput(i.effect.timing)), e = t.calculateIterationProgress(t.calculateActiveDuration(r), -1, r), isNaN(e) || null == e) ? (i._forEachChild(function(t) {
                        t.currentTime = -1
                    }), void i._removeChildAnimations()) : void 0
                },
                a = new KeyframeEffect(null, [], i._timing, i._id);
            return a.onsample = o, n = e.timeline._play(a)
        }, e.bindAnimationForGroup = function(t) {
            t._animation._wrapper = t, t._isGroup = !0, e.awaitStartTime(t), t._constructChildAnimations(), t._setExternalAnimation(t)
        }, e.groupChildDuration = n
    }(i, r), e.true = t
}({}, function() {
    return this
}());


Polymer({
    is: "opaque-animation",
    behaviors: [Polymer.NeonAnimationBehavior],
    configure: function(e) {
        var i = e.node;
        return this._effect = new KeyframeEffect(i, [{
            opacity: "1"
        }, {
            opacity: "1"
        }], this.timingFromConfig(e)), i.style.opacity = "0", this._effect
    },
    complete: function(e) {
        e.node.style.opacity = ""
    }
});


! function() {
    "use strict";
    var e = {
            pageX: 0,
            pageY: 0
        },
        t = null,
        l = [],
        n = ["wheel", "mousewheel", "DOMMouseScroll", "touchstart", "touchmove"];
    Polymer.IronDropdownScrollManager = {
        get currentLockingElement() {
            return this._lockingElements[this._lockingElements.length - 1]
        },
        elementIsScrollLocked: function(e) {
            var t = this.currentLockingElement;
            if (void 0 === t) return !1;
            var l;
            return !!this._hasCachedLockedElement(e) || !this._hasCachedUnlockedElement(e) && (l = !!t && t !== e && !this._composedTreeContains(t, e), l ? this._lockedElementCache.push(e) : this._unlockedElementCache.push(e), l)
        },
        pushScrollLock: function(e) {
            this._lockingElements.indexOf(e) >= 0 || (0 === this._lockingElements.length && this._lockScrollInteractions(), this._lockingElements.push(e), this._lockedElementCache = [], this._unlockedElementCache = [])
        },
        removeScrollLock: function(e) {
            var t = this._lockingElements.indexOf(e);
            t !== -1 && (this._lockingElements.splice(t, 1), this._lockedElementCache = [], this._unlockedElementCache = [], 0 === this._lockingElements.length && this._unlockScrollInteractions())
        },
        _lockingElements: [],
        _lockedElementCache: null,
        _unlockedElementCache: null,
        _hasCachedLockedElement: function(e) {
            return this._lockedElementCache.indexOf(e) > -1
        },
        _hasCachedUnlockedElement: function(e) {
            return this._unlockedElementCache.indexOf(e) > -1
        },
        _composedTreeContains: function(e, t) {
            var l, n, o, r;
            if (e.contains(t)) return !0;
            for (l = Polymer.dom(e).querySelectorAll("content"), o = 0; o < l.length; ++o)
                for (n = Polymer.dom(l[o]).getDistributedNodes(), r = 0; r < n.length; ++r)
                    if (this._composedTreeContains(n[r], t)) return !0;
            return !1
        },
        _scrollInteractionHandler: function(t) {
            if (t.cancelable && this._shouldPreventScrolling(t) && t.preventDefault(), t.targetTouches) {
                var l = t.targetTouches[0];
                e.pageX = l.pageX, e.pageY = l.pageY
            }
        },
        _lockScrollInteractions: function() {
            this._boundScrollHandler = this._boundScrollHandler || this._scrollInteractionHandler.bind(this);
            for (var e = 0, t = n.length; e < t; e++) document.addEventListener(n[e], this._boundScrollHandler, {
                capture: !0,
                passive: !1
            })
        },
        _unlockScrollInteractions: function() {
            for (var e = 0, t = n.length; e < t; e++) document.removeEventListener(n[e], this._boundScrollHandler, {
                capture: !0,
                passive: !1
            })
        },
        _shouldPreventScrolling: function(e) {
            var n = Polymer.dom(e).rootTarget;
            if ("touchmove" !== e.type && t !== n && (t = n, l = this._getScrollableNodes(Polymer.dom(e).path)), !l.length) return !0;
            if ("touchstart" === e.type) return !1;
            var o = this._getScrollInfo(e);
            return !this._getScrollingNode(l, o.deltaX, o.deltaY)
        },
        _getScrollableNodes: function(e) {
            for (var t = [], l = e.indexOf(this.currentLockingElement), n = 0; n <= l; n++)
                if (e[n].nodeType === Node.ELEMENT_NODE) {
                    var o = e[n],
                        r = o.style;
                    "scroll" !== r.overflow && "auto" !== r.overflow && (r = window.getComputedStyle(o)), "scroll" !== r.overflow && "auto" !== r.overflow || t.push(o)
                }
            return t
        },
        _getScrollingNode: function(e, t, l) {
            if (t || l)
                for (var n = Math.abs(l) >= Math.abs(t), o = 0; o < e.length; o++) {
                    var r = e[o],
                        c = !1;
                    if (c = n ? l < 0 ? r.scrollTop > 0 : r.scrollTop < r.scrollHeight - r.clientHeight : t < 0 ? r.scrollLeft > 0 : r.scrollLeft < r.scrollWidth - r.clientWidth) return r
                }
        },
        _getScrollInfo: function(t) {
            var l = {
                deltaX: t.deltaX,
                deltaY: t.deltaY
            };
            if ("deltaX" in t);
            else if ("wheelDeltaX" in t) l.deltaX = -t.wheelDeltaX, l.deltaY = -t.wheelDeltaY;
            else if ("axis" in t) l.deltaX = 1 === t.axis ? t.detail : 0, l.deltaY = 2 === t.axis ? t.detail : 0;
            else if (t.targetTouches) {
                var n = t.targetTouches[0];
                l.deltaX = e.pageX - n.pageX, l.deltaY = e.pageY - n.pageY
            }
            return l
        }
    }
}();

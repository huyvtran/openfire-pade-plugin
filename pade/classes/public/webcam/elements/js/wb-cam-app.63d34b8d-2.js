! function() {
    function e(e, t) {
        return e.replace(a, function(e, i, n, r) {
            return i + "'" + o(n.replace(/["']/g, ""), t) + "'" + r
        })
    }

    function t(t, i) {
        for (var n in l)
            for (var r, s, d, a = l[n], h = 0, c = a.length; h < c && (r = a[h]); h++) "*" !== n && t.localName !== n || (s = t.attributes[r], d = s && s.value, d && d.search(u) < 0 && (s.value = "style" === r ? e(d, i) : o(d, i)))
    }

    function o(e, t) {
        if (e && h.test(e)) return e;
        var o = n(t);
        return o.href = e, o.href || e
    }

    function i(e, t) {
        return s || (s = document.implementation.createHTMLDocument("temp"), d = s.createElement("base"), s.head.appendChild(d)), d.href = t, o(e, s)
    }

    function n(e) {
        return e.body.__urlResolver || (e.body.__urlResolver = e.createElement("a"))
    }

    function r(e) {
        return e.substring(0, e.lastIndexOf("/") + 1)
    }
    var s, d, a = /(url\()([^)]*)(\))/g,
        l = {
            "*": ["href", "src", "style", "url"],
            form: ["action"]
        },
        h = /(^\/)|(^#)|(^[\w-\d]*:)/,
        u = /\{\{|\[\[/;
    Polymer.ResolveUrl = {
        resolveCss: e,
        resolveAttrs: t,
        resolveUrl: i,
        pathFromUrl: r
    }, Polymer.rootPath = Polymer.Settings.rootPath || r(document.baseURI || window.location.href)
}(), Polymer.Base._addFeature({
        _prepTemplate: function() {
            var e;
            if (void 0 === this._template && (e = Polymer.DomModule.import(this.is), this._template = e && e.querySelector("template")), e) {
                var t = e.getAttribute("assetpath") || "",
                    o = Polymer.ResolveUrl.resolveUrl(t, e.ownerDocument.baseURI);
                this._importPath = Polymer.ResolveUrl.pathFromUrl(o)
            } else this._importPath = "";
            this._template && this._template.hasAttribute("is") && this._warn(this._logf("_prepTemplate", "top-level Polymer template must not be a type-extension, found", this._template, "Move inside simple <template>.")), this._template && !this._template.content && window.HTMLTemplateElement && HTMLTemplateElement.decorate && HTMLTemplateElement.decorate(this._template)
        },
        _stampTemplate: function() {
            this._template && (this.root = this.instanceTemplate(this._template))
        },
        instanceTemplate: function(e) {
            var t = document.importNode(e._content || e.content, !0);
            return t
        }
    }),
    function() {
        var e = Polymer.Base.attachedCallback,
            t = Polymer.Base.detachedCallback;
        Polymer.Base._addFeature({
            _hostStack: [],
            ready: function() {},
            _registerHost: function(e) {
                this.dataHost = e = e || Polymer.Base._hostStack[Polymer.Base._hostStack.length - 1], e && e._clients && e._clients.push(this), this._clients = null, this._clientsReadied = !1
            },
            _beginHosting: function() {
                Polymer.Base._hostStack.push(this), this._clients || (this._clients = [])
            },
            _endHosting: function() {
                Polymer.Base._hostStack.pop()
            },
            _tryReady: function() {
                this._readied = !1, this._canReady() && this._ready()
            },
            _canReady: function() {
                return !this.dataHost || this.dataHost._clientsReadied
            },
            _ready: function() {
                this._beforeClientsReady(), this._template && (this._setupRoot(), this._readyClients()), this._clientsReadied = !0, this._clients = null, this._afterClientsReady(), this._readySelf()
            },
            _readyClients: function() {
                this._beginDistribute();
                var e = this._clients;
                if (e)
                    for (var t, o = 0, i = e.length; o < i && (t = e[o]); o++) t._ready();
                this._finishDistribute()
            },
            _readySelf: function() {
                for (var e, t = 0; t < this.behaviors.length; t++) e = this.behaviors[t], e.ready && e.ready.call(this);
                this.ready && this.ready(), this._readied = !0, this._attachedPending && (this._attachedPending = !1, this.attachedCallback())
            },
            _beforeClientsReady: function() {},
            _afterClientsReady: function() {},
            _beforeAttached: function() {},
            attachedCallback: function() {
                this._readied ? (this._beforeAttached(), e.call(this)) : this._attachedPending = !0
            },
            detachedCallback: function() {
                this._readied ? t.call(this) : this._attachedPending = !1
            }
        })
    }(), Polymer.ArraySplice = function() {
        function e(e, t, o) {
            return {
                index: e,
                removed: t,
                addedCount: o
            }
        }

        function t() {}
        var o = 0,
            i = 1,
            n = 2,
            r = 3;
        return t.prototype = {
            calcEditDistances: function(e, t, o, i, n, r) {
                for (var s = r - n + 1, d = o - t + 1, a = new Array(s), l = 0; l < s; l++) a[l] = new Array(d), a[l][0] = l;
                for (var h = 0; h < d; h++) a[0][h] = h;
                for (l = 1; l < s; l++)
                    for (h = 1; h < d; h++)
                        if (this.equals(e[t + h - 1], i[n + l - 1])) a[l][h] = a[l - 1][h - 1];
                        else {
                            var u = a[l - 1][h] + 1,
                                c = a[l][h - 1] + 1;
                            a[l][h] = u < c ? u : c
                        }
                return a
            },
            spliceOperationsFromEditDistances: function(e) {
                for (var t = e.length - 1, s = e[0].length - 1, d = e[t][s], a = []; t > 0 || s > 0;)
                    if (0 != t)
                        if (0 != s) {
                            var l, h = e[t - 1][s - 1],
                                u = e[t - 1][s],
                                c = e[t][s - 1];
                            l = u < c ? u < h ? u : h : c < h ? c : h, l == h ? (h == d ? a.push(o) : (a.push(i), d = h), t--, s--) : l == u ? (a.push(r), t--, d = u) : (a.push(n), s--, d = c)
                        } else a.push(r), t--;
                else a.push(n), s--;
                return a.reverse(), a
            },
            calcSplices: function(t, s, d, a, l, h) {
                var u = 0,
                    c = 0,
                    _ = Math.min(d - s, h - l);
                if (0 == s && 0 == l && (u = this.sharedPrefix(t, a, _)), d == t.length && h == a.length && (c = this.sharedSuffix(t, a, _ - u)), s += u, l += u, d -= c, h -= c, d - s == 0 && h - l == 0) return [];
                if (s == d) {
                    for (var f = e(s, [], 0); l < h;) f.removed.push(a[l++]);
                    return [f]
                }
                if (l == h) return [e(s, [], d - s)];
                var m = this.spliceOperationsFromEditDistances(this.calcEditDistances(t, s, d, a, l, h));
                f = void 0;
                for (var p = [], v = s, g = l, b = 0; b < m.length; b++) switch (m[b]) {
                    case o:
                        f && (p.push(f), f = void 0), v++, g++;
                        break;
                    case i:
                        f || (f = e(v, [], 0)), f.addedCount++, v++, f.removed.push(a[g]), g++;
                        break;
                    case n:
                        f || (f = e(v, [], 0)), f.addedCount++, v++;
                        break;
                    case r:
                        f || (f = e(v, [], 0)), f.removed.push(a[g]), g++
                }
                return f && p.push(f), p
            },
            sharedPrefix: function(e, t, o) {
                for (var i = 0; i < o; i++)
                    if (!this.equals(e[i], t[i])) return i;
                return o
            },
            sharedSuffix: function(e, t, o) {
                for (var i = e.length, n = t.length, r = 0; r < o && this.equals(e[--i], t[--n]);) r++;
                return r
            },
            calculateSplices: function(e, t) {
                return this.calcSplices(e, 0, e.length, t, 0, t.length)
            },
            equals: function(e, t) {
                return e === t
            }
        }, new t
    }(), Polymer.domInnerHTML = function() {
        function e(e) {
            switch (e) {
                case "&":
                    return "&amp;";
                case "<":
                    return "&lt;";
                case ">":
                    return "&gt;";
                case '"':
                    return "&quot;";
                case " ":
                    return "&nbsp;"
            }
        }

        function t(t) {
            return t.replace(s, e)
        }

        function o(t) {
            return t.replace(d, e)
        }

        function i(e) {
            for (var t = {}, o = 0; o < e.length; o++) t[e[o]] = !0;
            return t
        }

        function n(e, i, n) {
            switch (e.nodeType) {
                case Node.ELEMENT_NODE:
                    for (var s, d = e.localName, h = "<" + d, u = e.attributes, c = 0; s = u[c]; c++) h += " " + s.name + '="' + t(s.value) + '"';
                    return h += ">", a[d] ? h : h + r(e, n) + "</" + d + ">";
                case Node.TEXT_NODE:
                    var _ = e.data;
                    return i && l[i.localName] ? _ : o(_);
                case Node.COMMENT_NODE:
                    return "<!--" + e.data + "-->";
                default:
                    throw console.error(e), new Error("not implemented")
            }
        }

        function r(e, t) {
            e instanceof HTMLTemplateElement && (e = e.content);
            for (var o, i = "", r = Polymer.dom(e).childNodes, s = 0, d = r.length; s < d && (o = r[s]); s++) i += n(o, e, t);
            return i
        }
        var s = /[&\u00A0"]/g,
            d = /[&\u00A0<>]/g,
            a = i(["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"]),
            l = i(["style", "script", "xmp", "iframe", "noembed", "noframes", "plaintext", "noscript"]);
        return {
            getInnerHTML: r
        }
    }(),
    function() {
        "use strict";
        var e = Element.prototype.insertBefore,
            t = Element.prototype.appendChild,
            o = Element.prototype.removeChild;
        Polymer.TreeApi = {
            arrayCopyChildNodes: function(e) {
                for (var t = [], o = 0, i = e.firstChild; i; i = i.nextSibling) t[o++] = i;
                return t
            },
            arrayCopyChildren: function(e) {
                for (var t = [], o = 0, i = e.firstElementChild; i; i = i.nextElementSibling) t[o++] = i;
                return t
            },
            arrayCopy: function(e) {
                for (var t = e.length, o = new Array(t), i = 0; i < t; i++) o[i] = e[i];
                return o
            }
        }, Polymer.TreeApi.Logical = {
            hasParentNode: function(e) {
                return Boolean(e.__dom && e.__dom.parentNode)
            },
            hasChildNodes: function(e) {
                return Boolean(e.__dom && void 0 !== e.__dom.childNodes)
            },
            getChildNodes: function(e) {
                return this.hasChildNodes(e) ? this._getChildNodes(e) : e.childNodes
            },
            _getChildNodes: function(e) {
                if (!e.__dom.childNodes) {
                    e.__dom.childNodes = [];
                    for (var t = e.__dom.firstChild; t; t = t.__dom.nextSibling) e.__dom.childNodes.push(t)
                }
                return e.__dom.childNodes
            },
            getParentNode: function(e) {
                return e.__dom && void 0 !== e.__dom.parentNode ? e.__dom.parentNode : e.parentNode
            },
            getFirstChild: function(e) {
                return e.__dom && void 0 !== e.__dom.firstChild ? e.__dom.firstChild : e.firstChild
            },
            getLastChild: function(e) {
                return e.__dom && void 0 !== e.__dom.lastChild ? e.__dom.lastChild : e.lastChild
            },
            getNextSibling: function(e) {
                return e.__dom && void 0 !== e.__dom.nextSibling ? e.__dom.nextSibling : e.nextSibling
            },
            getPreviousSibling: function(e) {
                return e.__dom && void 0 !== e.__dom.previousSibling ? e.__dom.previousSibling : e.previousSibling
            },
            getFirstElementChild: function(e) {
                return e.__dom && void 0 !== e.__dom.firstChild ? this._getFirstElementChild(e) : e.firstElementChild
            },
            _getFirstElementChild: function(e) {
                for (var t = e.__dom.firstChild; t && t.nodeType !== Node.ELEMENT_NODE;) t = t.__dom.nextSibling;
                return t
            },
            getLastElementChild: function(e) {
                return e.__dom && void 0 !== e.__dom.lastChild ? this._getLastElementChild(e) : e.lastElementChild
            },
            _getLastElementChild: function(e) {
                for (var t = e.__dom.lastChild; t && t.nodeType !== Node.ELEMENT_NODE;) t = t.__dom.previousSibling;
                return t
            },
            getNextElementSibling: function(e) {
                return e.__dom && void 0 !== e.__dom.nextSibling ? this._getNextElementSibling(e) : e.nextElementSibling
            },
            _getNextElementSibling: function(e) {
                for (var t = e.__dom.nextSibling; t && t.nodeType !== Node.ELEMENT_NODE;) t = t.__dom.nextSibling;
                return t
            },
            getPreviousElementSibling: function(e) {
                return e.__dom && void 0 !== e.__dom.previousSibling ? this._getPreviousElementSibling(e) : e.previousElementSibling
            },
            _getPreviousElementSibling: function(e) {
                for (var t = e.__dom.previousSibling; t && t.nodeType !== Node.ELEMENT_NODE;) t = t.__dom.previousSibling;
                return t
            },
            saveChildNodes: function(e) {
                if (!this.hasChildNodes(e)) {
                    e.__dom = e.__dom || {}, e.__dom.firstChild = e.firstChild, e.__dom.lastChild = e.lastChild, e.__dom.childNodes = [];
                    for (var t = e.firstChild; t; t = t.nextSibling) t.__dom = t.__dom || {}, t.__dom.parentNode = e, e.__dom.childNodes.push(t), t.__dom.nextSibling = t.nextSibling, t.__dom.previousSibling = t.previousSibling
                }
            },
            recordInsertBefore: function(e, t, o) {
                if (t.__dom.childNodes = null, e.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
                    for (var i = e.firstChild; i; i = i.nextSibling) this._linkNode(i, t, o);
                else this._linkNode(e, t, o)
            },
            _linkNode: function(e, t, o) {
                e.__dom = e.__dom || {}, t.__dom = t.__dom || {}, o && (o.__dom = o.__dom || {}), e.__dom.previousSibling = o ? o.__dom.previousSibling : t.__dom.lastChild, e.__dom.previousSibling && (e.__dom.previousSibling.__dom.nextSibling = e), e.__dom.nextSibling = o || null, e.__dom.nextSibling && (e.__dom.nextSibling.__dom.previousSibling = e), e.__dom.parentNode = t, o ? o === t.__dom.firstChild && (t.__dom.firstChild = e) : (t.__dom.lastChild = e, t.__dom.firstChild || (t.__dom.firstChild = e)), t.__dom.childNodes = null
            },
            recordRemoveChild: function(e, t) {
                e.__dom = e.__dom || {}, t.__dom = t.__dom || {}, e === t.__dom.firstChild && (t.__dom.firstChild = e.__dom.nextSibling), e === t.__dom.lastChild && (t.__dom.lastChild = e.__dom.previousSibling);
                var o = e.__dom.previousSibling,
                    i = e.__dom.nextSibling;
                o && (o.__dom.nextSibling = i), i && (i.__dom.previousSibling = o), e.__dom.parentNode = e.__dom.previousSibling = e.__dom.nextSibling = void 0, t.__dom.childNodes = null
            }
        }, Polymer.TreeApi.Composed = {
            getChildNodes: function(e) {
                return Polymer.TreeApi.arrayCopyChildNodes(e)
            },
            getParentNode: function(e) {
                return e.parentNode
            },
            clearChildNodes: function(e) {
                e.textContent = ""
            },
            insertBefore: function(t, o, i) {
                return e.call(t, o, i || null)
            },
            appendChild: function(e, o) {
                return t.call(e, o)
            },
            removeChild: function(e, t) {
                return o.call(e, t)
            }
        }
    }(), Polymer.DomApi = function() {
        "use strict";
        var e = Polymer.Settings,
            t = Polymer.TreeApi,
            o = function(e) {
                this.node = i ? o.wrap(e) : e
            },
            i = e.hasShadow && !e.nativeShadow;
        o.wrap = window.wrap ? window.wrap : function(e) {
            return e
        }, o.prototype = {
            flush: function() {
                Polymer.dom.flush()
            },
            deepContains: function(e) {
                if (this.node.contains(e)) return !0;
                for (var t = e, o = e.ownerDocument; t && t !== o && t !== this.node;) t = Polymer.dom(t).parentNode || t.host;
                return t === this.node
            },
            queryDistributedElements: function(e) {
                for (var t, i = this.getEffectiveChildNodes(), n = [], r = 0, s = i.length; r < s && (t = i[r]); r++) t.nodeType === Node.ELEMENT_NODE && o.matchesSelector.call(t, e) && n.push(t);
                return n
            },
            getEffectiveChildNodes: function() {
                for (var e, t = [], o = this.childNodes, i = 0, s = o.length; i < s && (e = o[i]); i++)
                    if (e.localName === n)
                        for (var d = r(e).getDistributedNodes(), a = 0; a < d.length; a++) t.push(d[a]);
                    else t.push(e);
                return t
            },
            observeNodes: function(e) {
                if (e) return this.observer || (this.observer = this.node.localName === n ? new o.DistributedNodesObserver(this) : new o.EffectiveNodesObserver(this)), this.observer.addListener(e)
            },
            unobserveNodes: function(e) {
                this.observer && this.observer.removeListener(e)
            },
            notifyObserver: function() {
                this.observer && this.observer.notify()
            },
            _query: function(e, o, i) {
                o = o || this.node;
                var n = [];
                return this._queryElements(t.Logical.getChildNodes(o), e, i, n), n
            },
            _queryElements: function(e, t, o, i) {
                for (var n, r = 0, s = e.length; r < s && (n = e[r]); r++)
                    if (n.nodeType === Node.ELEMENT_NODE && this._queryElement(n, t, o, i)) return !0
            },
            _queryElement: function(e, o, i, n) {
                var r = o(e);
                return r && n.push(e), i && i(r) ? r : void this._queryElements(t.Logical.getChildNodes(e), o, i, n)
            }
        };
        var n = o.CONTENT = "content",
            r = o.factory = function(e) {
                return e = e || document, e.__domApi || (e.__domApi = new o.ctor(e)), e.__domApi
            };
        o.hasApi = function(e) {
            return Boolean(e.__domApi)
        }, o.ctor = o, Polymer.dom = function(e, t) {
            return e instanceof Event ? Polymer.EventApi.factory(e) : o.factory(e, t)
        };
        var s = Element.prototype;
        return o.matchesSelector = s.matches || s.matchesSelector || s.mozMatchesSelector || s.msMatchesSelector || s.oMatchesSelector || s.webkitMatchesSelector, o
    }(),
    function() {
        "use strict";
        var e = Polymer.Settings,
            t = Polymer.DomApi,
            o = t.factory,
            i = Polymer.TreeApi,
            n = Polymer.domInnerHTML.getInnerHTML,
            r = t.CONTENT;
        if (!e.useShadow) {
            var s = Element.prototype.cloneNode,
                d = Document.prototype.importNode;
            Polymer.Base.mixin(t.prototype, {
                _lazyDistribute: function(e) {
                    e.shadyRoot && e.shadyRoot._distributionClean && (e.shadyRoot._distributionClean = !1, Polymer.dom.addDebouncer(e.debounce("_distribute", e._distributeContent)))
                },
                appendChild: function(e) {
                    return this.insertBefore(e)
                },
                insertBefore: function(e, n) {
                    if (n && i.Logical.getParentNode(n) !== this.node) throw Error("The ref_node to be inserted before is not a child of this node");
                    if (e.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
                        var s = i.Logical.getParentNode(e);
                        s ? (t.hasApi(s) && o(s).notifyObserver(), this._removeNode(e)) : this._removeOwnerShadyRoot(e)
                    }
                    if (!this._addNode(e, n)) {
                        n && (n = n.localName === r ? this._firstComposedNode(n) : n);
                        var d = this.node._isShadyRoot ? this.node.host : this.node;
                        n ? i.Composed.insertBefore(d, e, n) : i.Composed.appendChild(d, e)
                    }
                    return this.notifyObserver(), e
                },
                _addNode: function(e, t) {
                    var o = this.getOwnerRoot();
                    if (o) {
                        var n = this._maybeAddInsertionPoint(e, this.node);
                        o._invalidInsertionPoints || (o._invalidInsertionPoints = n), this._addNodeToHost(o.host, e)
                    }
                    i.Logical.hasChildNodes(this.node) && i.Logical.recordInsertBefore(e, this.node, t);
                    var r = this._maybeDistribute(e) || this.node.shadyRoot;
                    if (r)
                        if (e.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
                            for (; e.firstChild;) i.Composed.removeChild(e, e.firstChild);
                        else {
                            var s = i.Composed.getParentNode(e);
                            s && i.Composed.removeChild(s, e)
                        }
                    return r
                },
                removeChild: function(e) {
                    if (i.Logical.getParentNode(e) !== this.node) throw Error("The node to be removed is not a child of this node: " + e);
                    if (!this._removeNode(e)) {
                        var t = this.node._isShadyRoot ? this.node.host : this.node,
                            o = i.Composed.getParentNode(e);
                        t === o && i.Composed.removeChild(t, e)
                    }
                    return this.notifyObserver(), e
                },
                _removeNode: function(e) {
                    var t, n = i.Logical.hasParentNode(e) && i.Logical.getParentNode(e),
                        r = this._ownerShadyRootForNode(e);
                    return n && (t = o(e)._maybeDistributeParent(), i.Logical.recordRemoveChild(e, n), r && this._removeDistributedChildren(r, e) && (r._invalidInsertionPoints = !0, this._lazyDistribute(r.host))), this._removeOwnerShadyRoot(e), r && this._removeNodeFromHost(r.host, e), t
                },
                replaceChild: function(e, t) {
                    return this.insertBefore(e, t), this.removeChild(t), e
                },
                _hasCachedOwnerRoot: function(e) {
                    return Boolean(void 0 !== e._ownerShadyRoot)
                },
                getOwnerRoot: function() {
                    return this._ownerShadyRootForNode(this.node)
                },
                _ownerShadyRootForNode: function(e) {
                    if (e) {
                        var t = e._ownerShadyRoot;
                        if (void 0 === t) {
                            if (e._isShadyRoot) t = e;
                            else {
                                var o = i.Logical.getParentNode(e);
                                t = o ? o._isShadyRoot ? o : this._ownerShadyRootForNode(o) : null
                            }(t || document.documentElement.contains(e)) && (e._ownerShadyRoot = t)
                        }
                        return t
                    }
                },
                _maybeDistribute: function(e) {
                    var t = e.nodeType === Node.DOCUMENT_FRAGMENT_NODE && !e.__noContent && o(e).querySelector(r),
                        n = t && i.Logical.getParentNode(t).nodeType !== Node.DOCUMENT_FRAGMENT_NODE,
                        s = t || e.localName === r;
                    if (s) {
                        var d = this.getOwnerRoot();
                        d && this._lazyDistribute(d.host)
                    }
                    var a = this._nodeNeedsDistribution(this.node);
                    return a && this._lazyDistribute(this.node), a || s && !n
                },
                _maybeAddInsertionPoint: function(e, t) {
                    var n;
                    if (e.nodeType !== Node.DOCUMENT_FRAGMENT_NODE || e.__noContent) e.localName === r && (i.Logical.saveChildNodes(t), i.Logical.saveChildNodes(e), n = !0);
                    else
                        for (var s, d, a, l = o(e).querySelectorAll(r), h = 0; h < l.length && (s = l[h]); h++) d = i.Logical.getParentNode(s), d === e && (d = t), a = this._maybeAddInsertionPoint(s, d), n = n || a;
                    return n
                },
                _updateInsertionPoints: function(e) {
                    for (var t, n = e.shadyRoot._insertionPoints = o(e.shadyRoot).querySelectorAll(r), s = 0; s < n.length; s++) t = n[s], i.Logical.saveChildNodes(t), i.Logical.saveChildNodes(i.Logical.getParentNode(t))
                },
                _nodeNeedsDistribution: function(e) {
                    return e && e.shadyRoot && t.hasInsertionPoint(e.shadyRoot)
                },
                _addNodeToHost: function(e, t) {
                    e._elementAdd && e._elementAdd(t)
                },
                _removeNodeFromHost: function(e, t) {
                    e._elementRemove && e._elementRemove(t)
                },
                _removeDistributedChildren: function(e, t) {
                    for (var n, r = e._insertionPoints, s = 0; s < r.length; s++) {
                        var d = r[s];
                        if (this._contains(t, d))
                            for (var a = o(d).getDistributedNodes(), l = 0; l < a.length; l++) {
                                n = !0;
                                var h = a[l],
                                    u = i.Composed.getParentNode(h);
                                u && i.Composed.removeChild(u, h)
                            }
                    }
                    return n
                },
                _contains: function(e, t) {
                    for (; t;) {
                        if (t == e) return !0;
                        t = i.Logical.getParentNode(t)
                    }
                },
                _removeOwnerShadyRoot: function(e) {
                    if (this._hasCachedOwnerRoot(e))
                        for (var t, o = i.Logical.getChildNodes(e), n = 0, r = o.length; n < r && (t = o[n]); n++) this._removeOwnerShadyRoot(t);
                    e._ownerShadyRoot = void 0
                },
                _firstComposedNode: function(e) {
                    for (var t, i, n = o(e).getDistributedNodes(), r = 0, s = n.length; r < s && (t = n[r]); r++)
                        if (i = o(t).getDestinationInsertionPoints(), i[i.length - 1] === e) return t
                },
                querySelector: function(e) {
                    var o = this._query(function(o) {
                        return t.matchesSelector.call(o, e)
                    }, this.node, function(e) {
                        return Boolean(e)
                    })[0];
                    return o || null
                },
                querySelectorAll: function(e) {
                    return this._query(function(o) {
                        return t.matchesSelector.call(o, e)
                    }, this.node)
                },
                getDestinationInsertionPoints: function() {
                    return this.node._destinationInsertionPoints || []
                },
                getDistributedNodes: function() {
                    return this.node._distributedNodes || []
                },
                _clear: function() {
                    for (; this.childNodes.length;) this.removeChild(this.childNodes[0])
                },
                setAttribute: function(e, t) {
                    this.node.setAttribute(e, t), this._maybeDistributeParent()
                },
                removeAttribute: function(e) {
                    this.node.removeAttribute(e), this._maybeDistributeParent()
                },
                _maybeDistributeParent: function() {
                    if (this._nodeNeedsDistribution(this.parentNode)) return this._lazyDistribute(this.parentNode), !0
                },
                cloneNode: function(e) {
                    var t = s.call(this.node, !1);
                    if (e)
                        for (var i, n = this.childNodes, r = o(t), d = 0; d < n.length; d++) i = o(n[d]).cloneNode(!0), r.appendChild(i);
                    return t
                },
                importNode: function(e, t) {
                    var n = this.node instanceof Document ? this.node : this.node.ownerDocument,
                        r = d.call(n, e, !1);
                    if (t)
                        for (var s, a = i.Logical.getChildNodes(e), l = o(r), h = 0; h < a.length; h++) s = o(n).importNode(a[h], !0), l.appendChild(s);
                    return r
                },
                _getComposedInnerHTML: function() {
                    return n(this.node, !0)
                }
            }), Object.defineProperties(t.prototype, {
                activeElement: {
                    get: function() {
                        var e = document.activeElement;
                        if (!e) return null;
                        var t = !!this.node._isShadyRoot;
                        if (this.node !== document) {
                            if (!t) return null;
                            if (this.node.host === e || !this.node.host.contains(e)) return null
                        }
                        for (var i = o(e).getOwnerRoot(); i && i !== this.node;) e = i.host, i = o(e).getOwnerRoot();
                        return this.node === document ? i ? null : e : i === this.node ? e : null
                    },
                    configurable: !0
                },
                childNodes: {
                    get: function() {
                        var e = i.Logical.getChildNodes(this.node);
                        return Array.isArray(e) ? e : i.arrayCopyChildNodes(this.node)
                    },
                    configurable: !0
                },
                children: {
                    get: function() {
                        return i.Logical.hasChildNodes(this.node) ? Array.prototype.filter.call(this.childNodes, function(e) {
                            return e.nodeType === Node.ELEMENT_NODE
                        }) : i.arrayCopyChildren(this.node)
                    },
                    configurable: !0
                },
                parentNode: {
                    get: function() {
                        return i.Logical.getParentNode(this.node)
                    },
                    configurable: !0
                },
                firstChild: {
                    get: function() {
                        return i.Logical.getFirstChild(this.node)
                    },
                    configurable: !0
                },
                lastChild: {
                    get: function() {
                        return i.Logical.getLastChild(this.node)
                    },
                    configurable: !0
                },
                nextSibling: {
                    get: function() {
                        return i.Logical.getNextSibling(this.node)
                    },
                    configurable: !0
                },
                previousSibling: {
                    get: function() {
                        return i.Logical.getPreviousSibling(this.node)
                    },
                    configurable: !0
                },
                firstElementChild: {
                    get: function() {
                        return i.Logical.getFirstElementChild(this.node)
                    },
                    configurable: !0
                },
                lastElementChild: {
                    get: function() {
                        return i.Logical.getLastElementChild(this.node)
                    },
                    configurable: !0
                },
                nextElementSibling: {
                    get: function() {
                        return i.Logical.getNextElementSibling(this.node)
                    },
                    configurable: !0
                },
                previousElementSibling: {
                    get: function() {
                        return i.Logical.getPreviousElementSibling(this.node)
                    },
                    configurable: !0
                },
                textContent: {
                    get: function() {
                        var e = this.node.nodeType;
                        if (e === Node.TEXT_NODE || e === Node.COMMENT_NODE) return this.node.textContent;
                        for (var t, o = [], i = 0, n = this.childNodes; t = n[i]; i++) t.nodeType !== Node.COMMENT_NODE && o.push(t.textContent);
                        return o.join("")
                    },
                    set: function(e) {
                        var t = this.node.nodeType;
                        t === Node.TEXT_NODE || t === Node.COMMENT_NODE ? this.node.textContent = e : (this._clear(), e && this.appendChild(document.createTextNode(e)))
                    },
                    configurable: !0
                },
                innerHTML: {
                    get: function() {
                        var e = this.node.nodeType;
                        return e === Node.TEXT_NODE || e === Node.COMMENT_NODE ? null : n(this.node)
                    },
                    set: function(e) {
                        var t = this.node.nodeType;
                        if (t !== Node.TEXT_NODE || t !== Node.COMMENT_NODE) {
                            this._clear();
                            var o = document.createElement("div");
                            o.innerHTML = e;
                            for (var n = i.arrayCopyChildNodes(o), r = 0; r < n.length; r++) this.appendChild(n[r])
                        }
                    },
                    configurable: !0
                }
            }), t.hasInsertionPoint = function(e) {
                return Boolean(e && e._insertionPoints.length)
            }
        }
    }(),
    function() {
        "use strict";
        var e = Polymer.Settings,
            t = Polymer.TreeApi,
            o = Polymer.DomApi;
        if (e.useShadow) {
            Polymer.Base.mixin(o.prototype, {
                querySelectorAll: function(e) {
                    return t.arrayCopy(this.node.querySelectorAll(e))
                },
                getOwnerRoot: function() {
                    for (var e = this.node; e;) {
                        if (e.nodeType === Node.DOCUMENT_FRAGMENT_NODE && e.host) return e;
                        e = e.parentNode
                    }
                },
                importNode: function(e, t) {
                    var o = this.node instanceof Document ? this.node : this.node.ownerDocument;
                    return o.importNode(e, t)
                },
                getDestinationInsertionPoints: function() {
                    var e = this.node.getDestinationInsertionPoints && this.node.getDestinationInsertionPoints();
                    return e ? t.arrayCopy(e) : []
                },
                getDistributedNodes: function() {
                    var e = this.node.getDistributedNodes && this.node.getDistributedNodes();
                    return e ? t.arrayCopy(e) : []
                }
            }), Object.defineProperties(o.prototype, {
                activeElement: {
                    get: function() {
                        var e = o.wrap(this.node),
                            t = e.activeElement;
                        return e.contains(t) ? t : null
                    },
                    configurable: !0
                },
                childNodes: {
                    get: function() {
                        return t.arrayCopyChildNodes(this.node)
                    },
                    configurable: !0
                },
                children: {
                    get: function() {
                        return t.arrayCopyChildren(this.node)
                    },
                    configurable: !0
                },
                textContent: {
                    get: function() {
                        return this.node.textContent
                    },
                    set: function(e) {
                        return this.node.textContent = e
                    },
                    configurable: !0
                },
                innerHTML: {
                    get: function() {
                        return this.node.innerHTML
                    },
                    set: function(e) {
                        return this.node.innerHTML = e
                    },
                    configurable: !0
                }
            });
            var i = function(e) {
                    for (var t = 0; t < e.length; t++) n(e[t])
                },
                n = function(e) {
                    o.prototype[e] = function() {
                        return this.node[e].apply(this.node, arguments)
                    }
                };
            i(["cloneNode", "appendChild", "insertBefore", "removeChild", "replaceChild", "setAttribute", "removeAttribute", "querySelector"]);
            var r = function(e) {
                    for (var t = 0; t < e.length; t++) s(e[t])
                },
                s = function(e) {
                    Object.defineProperty(o.prototype, e, {
                        get: function() {
                            return this.node[e]
                        },
                        configurable: !0
                    })
                };
            r(["parentNode", "firstChild", "lastChild", "nextSibling", "previousSibling", "firstElementChild", "lastElementChild", "nextElementSibling", "previousElementSibling"])
        }
    }(), Polymer.Base.mixin(Polymer.dom, {
        _flushGuard: 0,
        _FLUSH_MAX: 100,
        _needsTakeRecords: !Polymer.Settings.useNativeCustomElements,
        _debouncers: [],
        _staticFlushList: [],
        _finishDebouncer: null,
        flush: function() {
            for (this._flushGuard = 0, this._prepareFlush(); this._debouncers.length && this._flushGuard < this._FLUSH_MAX;) {
                for (; this._debouncers.length;) this._debouncers.shift().complete();
                this._finishDebouncer && this._finishDebouncer.complete(), this._prepareFlush(), this._flushGuard++
            }
            this._flushGuard >= this._FLUSH_MAX && console.warn("Polymer.dom.flush aborted. Flush may not be complete.")
        },
        _prepareFlush: function() {
            this._needsTakeRecords && CustomElements.takeRecords();
            for (var e = 0; e < this._staticFlushList.length; e++) this._staticFlushList[e]()
        },
        addStaticFlush: function(e) {
            this._staticFlushList.push(e)
        },
        removeStaticFlush: function(e) {
            var t = this._staticFlushList.indexOf(e);
            t >= 0 && this._staticFlushList.splice(t, 1)
        },
        addDebouncer: function(e) {
            this._debouncers.push(e), this._finishDebouncer = Polymer.Debounce(this._finishDebouncer, this._finishFlush)
        },
        _finishFlush: function() {
            Polymer.dom._debouncers = []
        }
    }), Polymer.EventApi = function() {
        "use strict";
        var e = Polymer.DomApi.ctor,
            t = Polymer.Settings;
        e.Event = function(e) {
            this.event = e
        }, t.useShadow ? e.Event.prototype = {
            get rootTarget() {
                return this.event.path[0]
            },
            get localTarget() {
                return this.event.target
            },
            get path() {
                var e = this.event.path;
                return Array.isArray(e) || (e = Array.prototype.slice.call(e)), e
            }
        } : e.Event.prototype = {
            get rootTarget() {
                return this.event.target
            },
            get localTarget() {
                for (var e = this.event.currentTarget, t = e && Polymer.dom(e).getOwnerRoot(), o = this.path, i = 0; i < o.length; i++)
                    if (Polymer.dom(o[i]).getOwnerRoot() === t) return o[i]
            },
            get path() {
                if (!this.event._path) {
                    for (var e = [], t = this.rootTarget; t;) {
                        e.push(t);
                        var o = Polymer.dom(t).getDestinationInsertionPoints();
                        if (o.length) {
                            for (var i = 0; i < o.length - 1; i++) e.push(o[i]);
                            t = o[o.length - 1]
                        } else t = Polymer.dom(t).parentNode || t.host
                    }
                    e.push(window), this.event._path = e
                }
                return this.event._path
            }
        };
        var o = function(t) {
            return t.__eventApi || (t.__eventApi = new e.Event(t)), t.__eventApi
        };
        return {
            factory: o
        }
    }(),
    function() {
        "use strict";
        var e = Polymer.DomApi.ctor,
            t = Polymer.Settings.useShadow;
        Object.defineProperty(e.prototype, "classList", {
            get: function() {
                return this._classList || (this._classList = new e.ClassList(this)), this._classList
            },
            configurable: !0
        }), e.ClassList = function(e) {
            this.domApi = e, this.node = e.node
        }, e.ClassList.prototype = {
            add: function() {
                this.node.classList.add.apply(this.node.classList, arguments), this._distributeParent()
            },
            remove: function() {
                this.node.classList.remove.apply(this.node.classList, arguments), this._distributeParent()
            },
            toggle: function() {
                this.node.classList.toggle.apply(this.node.classList, arguments), this._distributeParent()
            },
            _distributeParent: function() {
                t || this.domApi._maybeDistributeParent()
            },
            contains: function() {
                return this.node.classList.contains.apply(this.node.classList, arguments)
            }
        }
    }(),
    function() {
        "use strict";
        var e = Polymer.DomApi.ctor,
            t = Polymer.Settings;
        if (e.EffectiveNodesObserver = function(e) {
                this.domApi = e, this.node = this.domApi.node, this._listeners = []
            }, e.EffectiveNodesObserver.prototype = {
                addListener: function(e) {
                    this._isSetup || (this._setup(), this._isSetup = !0);
                    var t = {
                        fn: e,
                        _nodes: []
                    };
                    return this._listeners.push(t), this._scheduleNotify(), t
                },
                removeListener: function(e) {
                    var t = this._listeners.indexOf(e);
                    t >= 0 && (this._listeners.splice(t, 1), e._nodes = []), this._hasListeners() || (this._cleanup(), this._isSetup = !1)
                },
                _setup: function() {
                    this._observeContentElements(this.domApi.childNodes)
                },
                _cleanup: function() {
                    this._unobserveContentElements(this.domApi.childNodes)
                },
                _hasListeners: function() {
                    return Boolean(this._listeners.length)
                },
                _scheduleNotify: function() {
                    this._debouncer && this._debouncer.stop(), this._debouncer = Polymer.Debounce(this._debouncer, this._notify), this._debouncer.context = this, Polymer.dom.addDebouncer(this._debouncer)
                },
                notify: function() {
                    this._hasListeners() && this._scheduleNotify()
                },
                _notify: function() {
                    this._beforeCallListeners(), this._callListeners()
                },
                _beforeCallListeners: function() {
                    this._updateContentElements()
                },
                _updateContentElements: function() {
                    this._observeContentElements(this.domApi.childNodes)
                },
                _observeContentElements: function(e) {
                    for (var t, o = 0; o < e.length && (t = e[o]); o++) this._isContent(t) && (t.__observeNodesMap = t.__observeNodesMap || new WeakMap, t.__observeNodesMap.has(this) || t.__observeNodesMap.set(this, this._observeContent(t)))
                },
                _observeContent: function(e) {
                    var t = this,
                        o = Polymer.dom(e).observeNodes(function() {
                            t._scheduleNotify()
                        });
                    return o._avoidChangeCalculation = !0, o
                },
                _unobserveContentElements: function(e) {
                    for (var t, o, i = 0; i < e.length && (t = e[i]); i++) this._isContent(t) && (o = t.__observeNodesMap.get(this), o && (Polymer.dom(t).unobserveNodes(o), t.__observeNodesMap.delete(this)))
                },
                _isContent: function(e) {
                    return "content" === e.localName
                },
                _callListeners: function() {
                    for (var e, t = this._listeners, o = this._getEffectiveNodes(), i = 0; i < t.length && (e = t[i]); i++) {
                        var n = this._generateListenerInfo(e, o);
                        (n || e._alwaysNotify) && this._callListener(e, n)
                    }
                },
                _getEffectiveNodes: function() {
                    return this.domApi.getEffectiveChildNodes()
                },
                _generateListenerInfo: function(e, t) {
                    if (e._avoidChangeCalculation) return !0;
                    for (var o, i = e._nodes, n = {
                            target: this.node,
                            addedNodes: [],
                            removedNodes: []
                        }, r = Polymer.ArraySplice.calculateSplices(t, i), s = 0; s < r.length && (o = r[s]); s++)
                        for (var d, a = 0; a < o.removed.length && (d = o.removed[a]); a++) n.removedNodes.push(d);
                    for (s = 0, o; s < r.length && (o = r[s]); s++)
                        for (a = o.index; a < o.index + o.addedCount; a++) n.addedNodes.push(t[a]);
                    return e._nodes = t, n.addedNodes.length || n.removedNodes.length ? n : void 0
                },
                _callListener: function(e, t) {
                    return e.fn.call(this.node, t)
                },
                enableShadowAttributeTracking: function() {}
            }, t.useShadow) {
            var o = e.EffectiveNodesObserver.prototype._setup,
                i = e.EffectiveNodesObserver.prototype._cleanup;
            Polymer.Base.mixin(e.EffectiveNodesObserver.prototype, {
                _setup: function() {
                    if (!this._observer) {
                        var e = this;
                        this._mutationHandler = function(t) {
                            t && t.length && e._scheduleNotify()
                        }, this._observer = new MutationObserver(this._mutationHandler), this._boundFlush = function() {
                            e._flush()
                        }, Polymer.dom.addStaticFlush(this._boundFlush), this._observer.observe(this.node, {
                            childList: !0
                        })
                    }
                    o.call(this)
                },
                _cleanup: function() {
                    this._observer.disconnect(), this._observer = null, this._mutationHandler = null, Polymer.dom.removeStaticFlush(this._boundFlush), i.call(this)
                },
                _flush: function() {
                    this._observer && this._mutationHandler(this._observer.takeRecords())
                },
                enableShadowAttributeTracking: function() {
                    if (this._observer) {
                        this._makeContentListenersAlwaysNotify(), this._observer.disconnect(), this._observer.observe(this.node, {
                            childList: !0,
                            attributes: !0,
                            subtree: !0
                        });
                        var e = this.domApi.getOwnerRoot(),
                            t = e && e.host;
                        t && Polymer.dom(t).observer && Polymer.dom(t).observer.enableShadowAttributeTracking()
                    }
                },
                _makeContentListenersAlwaysNotify: function() {
                    for (var e, t = 0; t < this._listeners.length; t++) e = this._listeners[t], e._alwaysNotify = e._isContentListener
                }
            })
        }
    }(),
    function() {
        "use strict";
        var e = Polymer.DomApi.ctor,
            t = Polymer.Settings;
        e.DistributedNodesObserver = function(t) {
            e.EffectiveNodesObserver.call(this, t)
        }, e.DistributedNodesObserver.prototype = Object.create(e.EffectiveNodesObserver.prototype), Polymer.Base.mixin(e.DistributedNodesObserver.prototype, {
            _setup: function() {},
            _cleanup: function() {},
            _beforeCallListeners: function() {},
            _getEffectiveNodes: function() {
                return this.domApi.getDistributedNodes()
            }
        }), t.useShadow && Polymer.Base.mixin(e.DistributedNodesObserver.prototype, {
            _setup: function() {
                if (!this._observer) {
                    var e = this.domApi.getOwnerRoot(),
                        t = e && e.host;
                    if (t) {
                        var o = this;
                        this._observer = Polymer.dom(t).observeNodes(function() {
                            o._scheduleNotify()
                        }), this._observer._isContentListener = !0, this._hasAttrSelect() && Polymer.dom(t).observer.enableShadowAttributeTracking()
                    }
                }
            },
            _hasAttrSelect: function() {
                var e = this.node.getAttribute("select");
                return e && e.match(/[[.]+/)
            },
            _cleanup: function() {
                var e = this.domApi.getOwnerRoot(),
                    t = e && e.host;
                t && Polymer.dom(t).unobserveNodes(this._observer), this._observer = null
            }
        })
    }(),
    function() {
        function e(e, t) {
            t._distributedNodes.push(e);
            var o = e._destinationInsertionPoints;
            o ? o.push(t) : e._destinationInsertionPoints = [t]
        }

        function t(e) {
            var t = e._distributedNodes;
            if (t)
                for (var o = 0; o < t.length; o++) {
                    var i = t[o]._destinationInsertionPoints;
                    i && i.splice(i.indexOf(e) + 1, i.length)
                }
        }

        function o(e, t) {
            var o = u.Logical.getParentNode(e);
            o && o.shadyRoot && h.hasInsertionPoint(o.shadyRoot) && o.shadyRoot._distributionClean && (o.shadyRoot._distributionClean = !1, t.shadyRoot._dirtyRoots.push(o))
        }

        function i(e, t) {
            var o = t._destinationInsertionPoints;
            return o && o[o.length - 1] === e
        }

        function n(e) {
            return "content" == e.localName
        }

        function r(e) {
            for (; e && s(e);) e = e.domHost;
            return e
        }

        function s(e) {
            for (var t, o = u.Logical.getChildNodes(e), i = 0; i < o.length; i++)
                if (t = o[i], t.localName && "content" === t.localName) return e.domHost
        }

        function d(e) {
            for (var t, o = 0; o < e._insertionPoints.length; o++) t = e._insertionPoints[o], h.hasApi(t) && Polymer.dom(t).notifyObserver()
        }

        function a(e) {
            h.hasApi(e) && Polymer.dom(e).notifyObserver()
        }

        function l(e) {
            if (_ && e)
                for (var t = 0; t < e.length; t++) CustomElements.upgrade(e[t])
        }
        var h = Polymer.DomApi,
            u = Polymer.TreeApi;
        Polymer.Base._addFeature({
            _prepShady: function() {
                this._useContent = this._useContent || Boolean(this._template)
            },
            _setupShady: function() {
                this.shadyRoot = null, this.__domApi || (this.__domApi = null), this.__dom || (this.__dom = null), this._ownerShadyRoot || (this._ownerShadyRoot = void 0)
            },
            _poolContent: function() {
                this._useContent && u.Logical.saveChildNodes(this)
            },
            _setupRoot: function() {
                this._useContent && (this._createLocalRoot(), this.dataHost || l(u.Logical.getChildNodes(this)))
            },
            _createLocalRoot: function() {
                this.shadyRoot = this.root, this.shadyRoot._distributionClean = !1, this.shadyRoot._hasDistributed = !1, this.shadyRoot._isShadyRoot = !0, this.shadyRoot._dirtyRoots = [];
                var e = this.shadyRoot._insertionPoints = !this._notes || this._notes._hasContent ? this.shadyRoot.querySelectorAll("content") : [];
                u.Logical.saveChildNodes(this.shadyRoot);
                for (var t, o = 0; o < e.length; o++) t = e[o], u.Logical.saveChildNodes(t), u.Logical.saveChildNodes(t.parentNode);
                this.shadyRoot.host = this
            },
            distributeContent: function(e) {
                if (this.shadyRoot) {
                    this.shadyRoot._invalidInsertionPoints = this.shadyRoot._invalidInsertionPoints || e;
                    var t = r(this);
                    Polymer.dom(this)._lazyDistribute(t)
                }
            },
            _distributeContent: function() {
                this._useContent && !this.shadyRoot._distributionClean && (this.shadyRoot._invalidInsertionPoints && (Polymer.dom(this)._updateInsertionPoints(this), this.shadyRoot._invalidInsertionPoints = !1), this._beginDistribute(), this._distributeDirtyRoots(), this._finishDistribute())
            },
            _beginDistribute: function() {
                this._useContent && h.hasInsertionPoint(this.shadyRoot) && (this._resetDistribution(), this._distributePool(this.shadyRoot, this._collectPool()))
            },
            _distributeDirtyRoots: function() {
                for (var e, t = this.shadyRoot._dirtyRoots, o = 0, i = t.length; o < i && (e = t[o]); o++) e._distributeContent();
                this.shadyRoot._dirtyRoots = []
            },
            _finishDistribute: function() {
                if (this._useContent) {
                    if (this.shadyRoot._distributionClean = !0, h.hasInsertionPoint(this.shadyRoot)) this._composeTree(), d(this.shadyRoot);
                    else if (this.shadyRoot._hasDistributed) {
                        var e = this._composeNode(this);
                        this._updateChildNodes(this, e)
                    } else u.Composed.clearChildNodes(this), this.appendChild(this.shadyRoot);
                    this.shadyRoot._hasDistributed || a(this), this.shadyRoot._hasDistributed = !0
                }
            },
            elementMatches: function(e, t) {
                return t = t || this, h.matchesSelector.call(t, e)
            },
            _resetDistribution: function() {
                for (var e = u.Logical.getChildNodes(this), o = 0; o < e.length; o++) {
                    var i = e[o];
                    i._destinationInsertionPoints && (i._destinationInsertionPoints = void 0), n(i) && t(i)
                }
                for (var r = this.shadyRoot, s = r._insertionPoints, d = 0; d < s.length; d++) s[d]._distributedNodes = []
            },
            _collectPool: function() {
                for (var e = [], t = u.Logical.getChildNodes(this), o = 0; o < t.length; o++) {
                    var i = t[o];
                    n(i) ? e.push.apply(e, i._distributedNodes) : e.push(i)
                }
                return e
            },
            _distributePool: function(e, t) {
                for (var i, n = e._insertionPoints, r = 0, s = n.length; r < s && (i = n[r]); r++) this._distributeInsertionPoint(i, t), o(i, this)
            },
            _distributeInsertionPoint: function(t, o) {
                for (var i, n = !1, r = 0, s = o.length; r < s; r++) i = o[r], i && this._matchesContentSelect(i, t) && (e(i, t), o[r] = void 0, n = !0);
                if (!n)
                    for (var d = u.Logical.getChildNodes(t), a = 0; a < d.length; a++) e(d[a], t)
            },
            _composeTree: function() {
                this._updateChildNodes(this, this._composeNode(this));
                for (var e, t, o = this.shadyRoot._insertionPoints, i = 0, n = o.length; i < n && (e = o[i]); i++) t = u.Logical.getParentNode(e), t._useContent || t === this || t === this.shadyRoot || this._updateChildNodes(t, this._composeNode(t))
            },
            _composeNode: function(e) {
                for (var t = [], o = u.Logical.getChildNodes(e.shadyRoot || e), r = 0; r < o.length; r++) {
                    var s = o[r];
                    if (n(s))
                        for (var d = s._distributedNodes, a = 0; a < d.length; a++) {
                            var l = d[a];
                            i(s, l) && t.push(l)
                        } else t.push(s)
                }
                return t
            },
            _updateChildNodes: function(e, t) {
                for (var o, i = u.Composed.getChildNodes(e), n = Polymer.ArraySplice.calculateSplices(t, i), r = 0, s = 0; r < n.length && (o = n[r]); r++) {
                    for (var d, a = 0; a < o.removed.length && (d = o.removed[a]); a++) u.Composed.getParentNode(d) === e && u.Composed.removeChild(e, d), i.splice(o.index + s, 1);
                    s -= o.addedCount
                }
                for (var o, l, r = 0; r < n.length && (o = n[r]); r++)
                    for (l = i[o.index], a = o.index, d; a < o.index + o.addedCount; a++) d = t[a], u.Composed.insertBefore(e, d, l), i.splice(a, 0, d)
            },
            _matchesContentSelect: function(e, t) {
                var o = t.getAttribute("select");
                if (!o) return !0;
                if (o = o.trim(), !o) return !0;
                if (!(e instanceof Element)) return !1;
                var i = /^(:not\()?[*.#[a-zA-Z_|]/;
                return !!i.test(o) && this.elementMatches(o, e)
            },
            _elementAdd: function() {},
            _elementRemove: function() {}
        });
        var c = {
            get: function() {
                var e = Polymer.dom(this).getOwnerRoot();
                return e && e.host
            },
            configurable: !0
        };
        Object.defineProperty(Polymer.Base, "domHost", c), Polymer.BaseDescriptors.domHost = c;
        var _ = window.CustomElements && !CustomElements.useNative
    }(), Polymer.Settings.useShadow && Polymer.Base._addFeature({
        _poolContent: function() {},
        _beginDistribute: function() {},
        distributeContent: function() {},
        _distributeContent: function() {},
        _finishDistribute: function() {},
        _createLocalRoot: function() {
            this.createShadowRoot(), this.shadowRoot.appendChild(this.root), this.root = this.shadowRoot
        }
    }), Polymer.Async = {
        _currVal: 0,
        _lastVal: 0,
        _callbacks: [],
        _twiddleContent: 0,
        _twiddle: document.createTextNode(""),
        run: function(e, t) {
            return t > 0 ? ~setTimeout(e, t) : (this._twiddle.textContent = this._twiddleContent++, this._callbacks.push(e), this._currVal++)
        },
        cancel: function(e) {
            if (e < 0) clearTimeout(~e);
            else {
                var t = e - this._lastVal;
                if (t >= 0) {
                    if (!this._callbacks[t]) throw "invalid async handle: " + e;
                    this._callbacks[t] = null
                }
            }
        },
        _atEndOfMicrotask: function() {
            for (var e = this._callbacks.length, t = 0; t < e; t++) {
                var o = this._callbacks[t];
                if (o) try {
                    o()
                } catch (e) {
                    throw t++, this._callbacks.splice(0, t), this._lastVal += t, this._twiddle.textContent = this._twiddleContent++, e
                }
            }
            this._callbacks.splice(0, e), this._lastVal += e
        }
    }, new window.MutationObserver(function() {
        Polymer.Async._atEndOfMicrotask()
    }).observe(Polymer.Async._twiddle, {
        characterData: !0
    }), Polymer.Debounce = function() {
        function e(e, t, i) {
            return e ? e.stop() : e = new o(this), e.go(t, i), e
        }
        var t = Polymer.Async,
            o = function(e) {
                this.context = e;
                var t = this;
                this.boundComplete = function() {
                    t.complete()
                }
            };
        return o.prototype = {
            go: function(e, o) {
                var i;
                this.finish = function() {
                    t.cancel(i)
                }, i = t.run(this.boundComplete, o), this.callback = e
            },
            stop: function() {
                this.finish && (this.finish(), this.finish = null, this.callback = null)
            },
            complete: function() {
                if (this.finish) {
                    var e = this.callback;
                    this.stop(), e.call(this.context)
                }
            }
        }, e
    }(), Polymer.Base._addFeature({
        _setupDebouncers: function() {
            this._debouncers = {}
        },
        debounce: function(e, t, o) {
            return this._debouncers[e] = Polymer.Debounce.call(this, this._debouncers[e], t, o)
        },
        isDebouncerActive: function(e) {
            var t = this._debouncers[e];
            return !(!t || !t.finish)
        },
        flushDebouncer: function(e) {
            var t = this._debouncers[e];
            t && t.complete()
        },
        cancelDebouncer: function(e) {
            var t = this._debouncers[e];
            t && t.stop()
        }
    }), Polymer.DomModule = document.createElement("dom-module"), Polymer.Base._addFeature({
        _registerFeatures: function() {
            this._prepIs(), this._prepBehaviors(), this._prepConstructor(), this._prepTemplate(), this._prepShady(), this._prepPropertyInfo()
        },
        _prepBehavior: function(e) {
            this._addHostAttributes(e.hostAttributes)
        },
        _initFeatures: function() {
            this._registerHost(), this._template && (this._poolContent(), this._beginHosting(), this._stampTemplate(), this._endHosting()), this._marshalHostAttributes(), this._setupDebouncers(), this._marshalBehaviors(), this._tryReady()
        },
        _marshalBehavior: function(e) {}
    });

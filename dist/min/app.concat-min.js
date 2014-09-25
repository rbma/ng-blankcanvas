(function(n, e, A) {
    "use strict";
    function x(s, g, h) {
        return {
            restrict: "ECA",
            terminal: !0,
            priority: 400,
            transclude: "element",
            link: function(a, c, b, f, w) {
                function y() {
                    p && (p.remove(), p = null);
                    k && (k.$destroy(), k = null);
                    l && (h.leave(l, function() {
                        p = null;
                    }), p = l, l = null);
                }
                function v() {
                    var b = s.current && s.current.locals;
                    if (e.isDefined(b && b.$template)) {
                        var b = a.$new(), d = s.current;
                        l = w(b, function(d) {
                            h.enter(d, null, l || c, function() {
                                !e.isDefined(t) || t && !a.$eval(t) || g();
                            });
                            y();
                        });
                        k = d.scope = b;
                        k.$emit("$viewContentLoaded");
                        k.$eval(u);
                    } else y();
                }
                var k, l, p, t = b.autoscroll, u = b.onload || "";
                a.$on("$routeChangeSuccess", v);
                v();
            }
        };
    }
    function z(e, g, h) {
        return {
            restrict: "ECA",
            priority: -400,
            link: function(a, c) {
                var b = h.current, f = b.locals;
                c.html(f.$template);
                var w = e(c.contents());
                b.controller && (f.$scope = a, f = g(b.controller, f), b.controllerAs && (a[b.controllerAs] = f), 
                c.data("$ngControllerController", f), c.children().data("$ngControllerController", f));
                w(a);
            }
        };
    }
    n = e.module("ngRoute", [ "ng" ]).provider("$route", function() {
        function s(a, c) {
            return e.extend(new (e.extend(function() {}, {
                prototype: a
            }))(), c);
        }
        function g(a, e) {
            var b = e.caseInsensitiveMatch, f = {
                originalPath: a,
                regexp: a
            }, h = f.keys = [];
            a = a.replace(/([().])/g, "\\$1").replace(/(\/)?:(\w+)([\?\*])?/g, function(a, e, b, c) {
                a = "?" === c ? c : null;
                c = "*" === c ? c : null;
                h.push({
                    name: b,
                    optional: !!a
                });
                e = e || "";
                return "" + (a ? "" : e) + "(?:" + (a ? e : "") + (c && "(.+?)" || "([^/]+)") + (a || "") + ")" + (a || "");
            }).replace(/([\/$\*])/g, "\\$1");
            f.regexp = RegExp("^" + a + "$", b ? "i" : "");
            return f;
        }
        var h = {};
        this.when = function(a, c) {
            h[a] = e.extend({
                reloadOnSearch: !0
            }, c, a && g(a, c));
            if (a) {
                var b = "/" == a[a.length - 1] ? a.substr(0, a.length - 1) : a + "/";
                h[b] = e.extend({
                    redirectTo: a
                }, g(b, c));
            }
            return this;
        };
        this.otherwise = function(a) {
            this.when(null, a);
            return this;
        };
        this.$get = [ "$rootScope", "$location", "$routeParams", "$q", "$injector", "$http", "$templateCache", "$sce", function(a, c, b, f, g, n, v, k) {
            function l() {
                var d = p(), m = r.current;
                if (d && m && d.$$route === m.$$route && e.equals(d.pathParams, m.pathParams) && !d.reloadOnSearch && !u) m.params = d.params, 
                e.copy(m.params, b), a.$broadcast("$routeUpdate", m); else if (d || m) u = !1, a.$broadcast("$routeChangeStart", d, m), 
                (r.current = d) && d.redirectTo && (e.isString(d.redirectTo) ? c.path(t(d.redirectTo, d.params)).search(d.params).replace() : c.url(d.redirectTo(d.pathParams, c.path(), c.search())).replace()), 
                f.when(d).then(function() {
                    if (d) {
                        var a = e.extend({}, d.resolve), c, b;
                        e.forEach(a, function(d, c) {
                            a[c] = e.isString(d) ? g.get(d) : g.invoke(d);
                        });
                        e.isDefined(c = d.template) ? e.isFunction(c) && (c = c(d.params)) : e.isDefined(b = d.templateUrl) && (e.isFunction(b) && (b = b(d.params)), 
                        b = k.getTrustedResourceUrl(b), e.isDefined(b) && (d.loadedTemplateUrl = b, c = n.get(b, {
                            cache: v
                        }).then(function(a) {
                            return a.data;
                        })));
                        e.isDefined(c) && (a.$template = c);
                        return f.all(a);
                    }
                }).then(function(c) {
                    d == r.current && (d && (d.locals = c, e.copy(d.params, b)), a.$broadcast("$routeChangeSuccess", d, m));
                }, function(c) {
                    d == r.current && a.$broadcast("$routeChangeError", d, m, c);
                });
            }
            function p() {
                var a, b;
                e.forEach(h, function(f, h) {
                    var q;
                    if (q = !b) {
                        var g = c.path();
                        q = f.keys;
                        var l = {};
                        if (f.regexp) if (g = f.regexp.exec(g)) {
                            for (var k = 1, p = g.length; k < p; ++k) {
                                var n = q[k - 1], r = g[k];
                                n && r && (l[n.name] = r);
                            }
                            q = l;
                        } else q = null; else q = null;
                        q = a = q;
                    }
                    q && (b = s(f, {
                        params: e.extend({}, c.search(), a),
                        pathParams: a
                    }), b.$$route = f);
                });
                return b || h[null] && s(h[null], {
                    params: {},
                    pathParams: {}
                });
            }
            function t(a, c) {
                var b = [];
                e.forEach((a || "").split(":"), function(a, d) {
                    if (0 === d) b.push(a); else {
                        var e = a.match(/(\w+)(.*)/), f = e[1];
                        b.push(c[f]);
                        b.push(e[2] || "");
                        delete c[f];
                    }
                });
                return b.join("");
            }
            var u = !1, r = {
                routes: h,
                reload: function() {
                    u = !0;
                    a.$evalAsync(l);
                }
            };
            a.$on("$locationChangeSuccess", l);
            return r;
        } ];
    });
    n.provider("$routeParams", function() {
        this.$get = function() {
            return {};
        };
    });
    n.directive("ngView", x);
    n.directive("ngView", z);
    x.$inject = [ "$route", "$anchorScroll", "$animate" ];
    z.$inject = [ "$compile", "$controller", "$route" ];
})(window, window.angular);

/**
 * angular-ui-utils - Swiss-Army-Knife of AngularJS tools (with no external dependencies!)
 * @version v0.1.1 - 2014-08-07
 * @link http://angular-ui.github.com
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
"use strict";

angular.module("ui.alias", []).config([ "$compileProvider", "uiAliasConfig", function(a, b) {
    b = b || {}, angular.forEach(b, function(b, c) {
        angular.isString(b) && (b = {
            replace: !0,
            template: b
        }), a.directive(c, function() {
            return b;
        });
    });
} ]), angular.module("ui.event", []).directive("uiEvent", [ "$parse", function(a) {
    return function(b, c, d) {
        var e = b.$eval(d.uiEvent);
        angular.forEach(e, function(d, e) {
            var f = a(d);
            c.bind(e, function(a) {
                var c = Array.prototype.slice.call(arguments);
                c = c.splice(1), f(b, {
                    $event: a,
                    $params: c
                }), b.$$phase || b.$apply();
            });
        });
    };
} ]), angular.module("ui.format", []).filter("format", function() {
    return function(a, b) {
        var c = a;
        if (angular.isString(c) && void 0 !== b) if (angular.isArray(b) || angular.isObject(b) || (b = [ b ]), 
        angular.isArray(b)) {
            var d = b.length, e = function(a, c) {
                return c = parseInt(c, 10), c >= 0 && d > c ? b[c] : a;
            };
            c = c.replace(/\$([0-9]+)/g, e);
        } else angular.forEach(b, function(a, b) {
            c = c.split(":" + b).join(a);
        });
        return c;
    };
}), angular.module("ui.highlight", []).filter("highlight", function() {
    return function(a, b, c) {
        return a && (b || angular.isNumber(b)) ? (a = a.toString(), b = b.toString(), c ? a.split(b).join('<span class="ui-match">' + b + "</span>") : a.replace(new RegExp(b, "gi"), '<span class="ui-match">$&</span>')) : a;
    };
}), angular.module("ui.include", []).directive("uiInclude", [ "$http", "$templateCache", "$anchorScroll", "$compile", function(a, b, c, d) {
    return {
        restrict: "ECA",
        terminal: !0,
        compile: function(e, f) {
            var g = f.uiInclude || f.src, h = f.fragment || "", i = f.onload || "", j = f.autoscroll;
            return function(e, f) {
                function k() {
                    var k = ++m, o = e.$eval(g), p = e.$eval(h);
                    o ? a.get(o, {
                        cache: b
                    }).success(function(a) {
                        if (k === m) {
                            l && l.$destroy(), l = e.$new();
                            var b;
                            b = p ? angular.element("<div/>").html(a).find(p) : angular.element("<div/>").html(a).contents(), 
                            f.html(b), d(b)(l), !angular.isDefined(j) || j && !e.$eval(j) || c(), l.$emit("$includeContentLoaded"), 
                            e.$eval(i);
                        }
                    }).error(function() {
                        k === m && n();
                    }) : n();
                }
                var l, m = 0, n = function() {
                    l && (l.$destroy(), l = null), f.html("");
                };
                e.$watch(h, k), e.$watch(g, k);
            };
        }
    };
} ]), angular.module("ui.indeterminate", []).directive("uiIndeterminate", [ function() {
    return {
        compile: function(a, b) {
            return b.type && "checkbox" === b.type.toLowerCase() ? function(a, b, c) {
                a.$watch(c.uiIndeterminate, function(a) {
                    b[0].indeterminate = !!a;
                });
            } : angular.noop;
        }
    };
} ]), angular.module("ui.inflector", []).filter("inflector", function() {
    function a(a) {
        return a.replace(/^([a-z])|\s+([a-z])/g, function(a) {
            return a.toUpperCase();
        });
    }
    function b(a, b) {
        return a.replace(/[A-Z]/g, function(a) {
            return b + a;
        });
    }
    var c = {
        humanize: function(c) {
            return a(b(c, " ").split("_").join(" "));
        },
        underscore: function(a) {
            return a.substr(0, 1).toLowerCase() + b(a.substr(1), "_").toLowerCase().split(" ").join("_");
        },
        variable: function(b) {
            return b = b.substr(0, 1).toLowerCase() + a(b.split("_").join(" ")).substr(1).split(" ").join("");
        }
    };
    return function(a, b) {
        return b !== !1 && angular.isString(a) ? (b = b || "humanize", c[b](a)) : a;
    };
}), angular.module("ui.jq", []).value("uiJqConfig", {}).directive("uiJq", [ "uiJqConfig", "$timeout", function(a, b) {
    return {
        restrict: "A",
        compile: function(c, d) {
            if (!angular.isFunction(c[d.uiJq])) throw new Error('ui-jq: The "' + d.uiJq + '" function does not exist');
            var e = a && a[d.uiJq];
            return function(a, c, d) {
                function f() {
                    b(function() {
                        c[d.uiJq].apply(c, g);
                    }, 0, !1);
                }
                var g = [];
                d.uiOptions ? (g = a.$eval("[" + d.uiOptions + "]"), angular.isObject(e) && angular.isObject(g[0]) && (g[0] = angular.extend({}, e, g[0]))) : e && (g = [ e ]), 
                d.ngModel && c.is("select,input,textarea") && c.bind("change", function() {
                    c.trigger("input");
                }), d.uiRefresh && a.$watch(d.uiRefresh, function() {
                    f();
                }), f();
            };
        }
    };
} ]), angular.module("ui.keypress", []).factory("keypressHelper", [ "$parse", function(a) {
    var b = {
        8: "backspace",
        9: "tab",
        13: "enter",
        27: "esc",
        32: "space",
        33: "pageup",
        34: "pagedown",
        35: "end",
        36: "home",
        37: "left",
        38: "up",
        39: "right",
        40: "down",
        45: "insert",
        46: "delete"
    }, c = function(a) {
        return a.charAt(0).toUpperCase() + a.slice(1);
    };
    return function(d, e, f, g) {
        var h, i = [];
        h = e.$eval(g["ui" + c(d)]), angular.forEach(h, function(b, c) {
            var d, e;
            e = a(b), angular.forEach(c.split(" "), function(a) {
                d = {
                    expression: e,
                    keys: {}
                }, angular.forEach(a.split("-"), function(a) {
                    d.keys[a] = !0;
                }), i.push(d);
            });
        }), f.bind(d, function(a) {
            var c = !(!a.metaKey || a.ctrlKey), f = !!a.altKey, g = !!a.ctrlKey, h = !!a.shiftKey, j = a.keyCode;
            "keypress" === d && !h && j >= 97 && 122 >= j && (j -= 32), angular.forEach(i, function(d) {
                var i = d.keys[b[j]] || d.keys[j.toString()], k = !!d.keys.meta, l = !!d.keys.alt, m = !!d.keys.ctrl, n = !!d.keys.shift;
                i && k === c && l === f && m === g && n === h && e.$apply(function() {
                    d.expression(e, {
                        $event: a
                    });
                });
            });
        });
    };
} ]), angular.module("ui.keypress").directive("uiKeydown", [ "keypressHelper", function(a) {
    return {
        link: function(b, c, d) {
            a("keydown", b, c, d);
        }
    };
} ]), angular.module("ui.keypress").directive("uiKeypress", [ "keypressHelper", function(a) {
    return {
        link: function(b, c, d) {
            a("keypress", b, c, d);
        }
    };
} ]), angular.module("ui.keypress").directive("uiKeyup", [ "keypressHelper", function(a) {
    return {
        link: function(b, c, d) {
            a("keyup", b, c, d);
        }
    };
} ]), angular.module("ui.mask", []).value("uiMaskConfig", {
    maskDefinitions: {
        9: /\d/,
        A: /[a-zA-Z]/,
        "*": /[a-zA-Z0-9]/
    }
}).directive("uiMask", [ "uiMaskConfig", "$parse", function(a, b) {
    return {
        priority: 100,
        require: "ngModel",
        restrict: "A",
        compile: function() {
            var c = a;
            return function(a, d, e, f) {
                function g(a) {
                    return angular.isDefined(a) ? (t(a), O ? (l(), m(), !0) : k()) : k();
                }
                function h(a) {
                    angular.isDefined(a) && (E = a, O && x());
                }
                function i(a) {
                    return O ? (H = p(a || ""), J = o(H), f.$setValidity("mask", J), J && H.length ? q(H) : void 0) : a;
                }
                function j(a) {
                    return O ? (H = p(a || ""), J = o(H), f.$viewValue = H.length ? q(H) : "", f.$setValidity("mask", J), 
                    "" === H && e.required && f.$setValidity("required", !1), J ? H : void 0) : a;
                }
                function k() {
                    return O = !1, n(), angular.isDefined(Q) ? d.attr("placeholder", Q) : d.removeAttr("placeholder"), 
                    angular.isDefined(R) ? d.attr("maxlength", R) : d.removeAttr("maxlength"), d.val(f.$modelValue), 
                    f.$viewValue = f.$modelValue, !1;
                }
                function l() {
                    H = L = p(f.$modelValue || ""), I = K = q(H), J = o(H);
                    var a = J && H.length ? I : "";
                    e.maxlength && d.attr("maxlength", 2 * C[C.length - 1]), d.attr("placeholder", E), 
                    d.val(a), f.$viewValue = a;
                }
                function m() {
                    P || (d.bind("blur", u), d.bind("mousedown mouseup", v), d.bind("input keyup click focus", x), 
                    P = !0);
                }
                function n() {
                    P && (d.unbind("blur", u), d.unbind("mousedown", v), d.unbind("mouseup", v), d.unbind("input", x), 
                    d.unbind("keyup", x), d.unbind("click", x), d.unbind("focus", x), P = !1);
                }
                function o(a) {
                    return a.length ? a.length >= G : !0;
                }
                function p(a) {
                    var b = "", c = D.slice();
                    return a = a.toString(), angular.forEach(F, function(b) {
                        a = a.replace(b, "");
                    }), angular.forEach(a.split(""), function(a) {
                        c.length && c[0].test(a) && (b += a, c.shift());
                    }), b;
                }
                function q(a) {
                    var b = "", c = C.slice();
                    return angular.forEach(E.split(""), function(d, e) {
                        a.length && e === c[0] ? (b += a.charAt(0) || "_", a = a.substr(1), c.shift()) : b += d;
                    }), b;
                }
                function r(a) {
                    var b = e.placeholder;
                    return "undefined" != typeof b && b[a] ? b[a] : "_";
                }
                function s() {
                    return E.replace(/[_]+/g, "_").replace(/([^_]+)([a-zA-Z0-9])([^_])/g, "$1$2_$3").split("_");
                }
                function t(a) {
                    var b = 0;
                    if (C = [], D = [], E = "", "string" == typeof a) {
                        G = 0;
                        var c = !1, d = a.split("");
                        angular.forEach(d, function(a, d) {
                            S.maskDefinitions[a] ? (C.push(b), E += r(d), D.push(S.maskDefinitions[a]), b++, 
                            c || G++) : "?" === a ? c = !0 : (E += a, b++);
                        });
                    }
                    C.push(C.slice().pop() + 1), F = s(), O = C.length > 1 ? !0 : !1;
                }
                function u() {
                    M = 0, N = 0, J && 0 !== H.length || (I = "", d.val(""), a.$apply(function() {
                        f.$setViewValue("");
                    }));
                }
                function v(a) {
                    "mousedown" === a.type ? d.bind("mouseout", w) : d.unbind("mouseout", w);
                }
                function w() {
                    N = B(this), d.unbind("mouseout", w);
                }
                function x(b) {
                    b = b || {};
                    var c = b.which, e = b.type;
                    if (16 !== c && 91 !== c) {
                        var g, h = d.val(), i = K, j = p(h), k = L, l = !1, m = z(this) || 0, n = M || 0, o = m - n, r = C[0], s = C[j.length] || C.slice().shift(), t = N || 0, u = B(this) > 0, v = t > 0, w = h.length > i.length || t && h.length > i.length - t, x = h.length < i.length || t && h.length === i.length - t, D = c >= 37 && 40 >= c && b.shiftKey, E = 37 === c, F = 8 === c || "keyup" !== e && x && -1 === o, G = 46 === c || "keyup" !== e && x && 0 === o && !v, H = (E || F || "click" === e) && m > r;
                        if (N = B(this), !D && (!u || "click" !== e && "keyup" !== e)) {
                            if ("input" === e && x && !v && j === k) {
                                for (;F && m > r && !y(m); ) m--;
                                for (;G && s > m && -1 === C.indexOf(m); ) m++;
                                var I = C.indexOf(m);
                                j = j.substring(0, I) + j.substring(I + 1), l = !0;
                            }
                            for (g = q(j), K = g, L = j, d.val(g), l && a.$apply(function() {
                                f.$setViewValue(j);
                            }), w && r >= m && (m = r + 1), H && m--, m = m > s ? s : r > m ? r : m; !y(m) && m > r && s > m; ) m += H ? -1 : 1;
                            (H && s > m || w && !y(n)) && m++, M = m, A(this, m);
                        }
                    }
                }
                function y(a) {
                    return C.indexOf(a) > -1;
                }
                function z(a) {
                    if (!a) return 0;
                    if (void 0 !== a.selectionStart) return a.selectionStart;
                    if (document.selection) {
                        a.focus();
                        var b = document.selection.createRange();
                        return b.moveStart("character", a.value ? -a.value.length : 0), b.text.length;
                    }
                    return 0;
                }
                function A(a, b) {
                    if (!a) return 0;
                    if (0 !== a.offsetWidth && 0 !== a.offsetHeight) if (a.setSelectionRange) a.focus(), 
                    a.setSelectionRange(b, b); else if (a.createTextRange) {
                        var c = a.createTextRange();
                        c.collapse(!0), c.moveEnd("character", b), c.moveStart("character", b), c.select();
                    }
                }
                function B(a) {
                    return a ? void 0 !== a.selectionStart ? a.selectionEnd - a.selectionStart : document.selection ? document.selection.createRange().text.length : 0 : 0;
                }
                var C, D, E, F, G, H, I, J, K, L, M, N, O = !1, P = !1, Q = e.placeholder, R = e.maxlength, S = {};
                e.uiOptions ? (S = a.$eval("[" + e.uiOptions + "]"), angular.isObject(S[0]) && (S = function(a, b) {
                    for (var c in a) Object.prototype.hasOwnProperty.call(a, c) && (b[c] ? angular.extend(b[c], a[c]) : b[c] = angular.copy(a[c]));
                    return b;
                }(c, S[0]))) : S = c, e.$observe("uiMask", g), e.$observe("placeholder", h);
                var T = !1;
                e.$observe("modelViewValue", function(a) {
                    "true" === a && (T = !0);
                }), a.$watch(e.ngModel, function(c) {
                    if (T && c) {
                        var d = b(e.ngModel);
                        d.assign(a, f.$viewValue);
                    }
                }), f.$formatters.push(i), f.$parsers.push(j), d.bind("mousedown mouseup", v), Array.prototype.indexOf || (Array.prototype.indexOf = function(a) {
                    if (null === this) throw new TypeError();
                    var b = Object(this), c = b.length >>> 0;
                    if (0 === c) return -1;
                    var d = 0;
                    if (arguments.length > 1 && (d = Number(arguments[1]), d !== d ? d = 0 : 0 !== d && 1 / 0 !== d && d !== -1 / 0 && (d = (d > 0 || -1) * Math.floor(Math.abs(d)))), 
                    d >= c) return -1;
                    for (var e = d >= 0 ? d : Math.max(c - Math.abs(d), 0); c > e; e++) if (e in b && b[e] === a) return e;
                    return -1;
                });
            };
        }
    };
} ]), angular.module("ui.reset", []).value("uiResetConfig", null).directive("uiReset", [ "uiResetConfig", function(a) {
    var b = null;
    return void 0 !== a && (b = a), {
        require: "ngModel",
        link: function(a, c, d, e) {
            var f;
            f = angular.element('<a class="ui-reset" />'), c.wrap('<span class="ui-resetwrap" />').after(f), 
            f.bind("click", function(c) {
                c.preventDefault(), a.$apply(function() {
                    e.$setViewValue(d.uiReset ? a.$eval(d.uiReset) : b), e.$render();
                });
            });
        }
    };
} ]), angular.module("ui.route", []).directive("uiRoute", [ "$location", "$parse", function(a, b) {
    return {
        restrict: "AC",
        scope: !0,
        compile: function(c, d) {
            var e;
            if (d.uiRoute) e = "uiRoute"; else if (d.ngHref) e = "ngHref"; else {
                if (!d.href) throw new Error("uiRoute missing a route or href property on " + c[0]);
                e = "href";
            }
            return function(c, d, f) {
                function g(b) {
                    var d = b.indexOf("#");
                    d > -1 && (b = b.substr(d + 1)), (j = function() {
                        i(c, a.path().indexOf(b) > -1);
                    })();
                }
                function h(b) {
                    var d = b.indexOf("#");
                    d > -1 && (b = b.substr(d + 1)), (j = function() {
                        var d = new RegExp("^" + b + "$", [ "i" ]);
                        i(c, d.test(a.path()));
                    })();
                }
                var i = b(f.ngModel || f.routeModel || "$uiRoute").assign, j = angular.noop;
                switch (e) {
                  case "uiRoute":
                    f.uiRoute ? h(f.uiRoute) : f.$observe("uiRoute", h);
                    break;

                  case "ngHref":
                    f.ngHref ? g(f.ngHref) : f.$observe("ngHref", g);
                    break;

                  case "href":
                    g(f.href);
                }
                c.$on("$routeChangeSuccess", function() {
                    j();
                }), c.$on("$stateChangeSuccess", function() {
                    j();
                });
            };
        }
    };
} ]), angular.module("ui.scroll.jqlite", [ "ui.scroll" ]).service("jqLiteExtras", [ "$log", "$window", function(a, b) {
    return {
        registerFor: function(a) {
            var c, d, e, f, g, h, i;
            return d = angular.element.prototype.css, a.prototype.css = function(a, b) {
                var c, e;
                return e = this, c = e[0], c && 3 !== c.nodeType && 8 !== c.nodeType && c.style ? d.call(e, a, b) : void 0;
            }, h = function(a) {
                return a && a.document && a.location && a.alert && a.setInterval;
            }, i = function(a, b, c) {
                var d, e, f, g, i;
                return d = a[0], i = {
                    top: [ "scrollTop", "pageYOffset", "scrollLeft" ],
                    left: [ "scrollLeft", "pageXOffset", "scrollTop" ]
                }[b], e = i[0], g = i[1], f = i[2], h(d) ? angular.isDefined(c) ? d.scrollTo(a[f].call(a), c) : g in d ? d[g] : d.document.documentElement[e] : angular.isDefined(c) ? d[e] = c : d[e];
            }, b.getComputedStyle ? (f = function(a) {
                return b.getComputedStyle(a, null);
            }, c = function(a, b) {
                return parseFloat(b);
            }) : (f = function(a) {
                return a.currentStyle;
            }, c = function(a, b) {
                var c, d, e, f, g, h, i;
                return c = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, f = new RegExp("^(" + c + ")(?!px)[a-z%]+$", "i"), 
                f.test(b) ? (i = a.style, d = i.left, g = a.runtimeStyle, h = g && g.left, g && (g.left = i.left), 
                i.left = b, e = i.pixelLeft, i.left = d, h && (g.left = h), e) : parseFloat(b);
            }), e = function(a, b) {
                var d, e, g, i, j, k, l, m, n, o, p, q, r;
                return h(a) ? (d = document.documentElement[{
                    height: "clientHeight",
                    width: "clientWidth"
                }[b]], {
                    base: d,
                    padding: 0,
                    border: 0,
                    margin: 0
                }) : (r = {
                    width: [ a.offsetWidth, "Left", "Right" ],
                    height: [ a.offsetHeight, "Top", "Bottom" ]
                }[b], d = r[0], l = r[1], m = r[2], k = f(a), p = c(a, k["padding" + l]) || 0, q = c(a, k["padding" + m]) || 0, 
                e = c(a, k["border" + l + "Width"]) || 0, g = c(a, k["border" + m + "Width"]) || 0, 
                i = k["margin" + l], j = k["margin" + m], n = c(a, i) || 0, o = c(a, j) || 0, {
                    base: d,
                    padding: p + q,
                    border: e + g,
                    margin: n + o
                });
            }, g = function(a, b, c) {
                var d, g, h;
                return g = e(a, b), g.base > 0 ? {
                    base: g.base - g.padding - g.border,
                    outer: g.base,
                    outerfull: g.base + g.margin
                }[c] : (d = f(a), h = d[b], (0 > h || null === h) && (h = a.style[b] || 0), h = parseFloat(h) || 0, 
                {
                    base: h - g.padding - g.border,
                    outer: h,
                    outerfull: h + g.padding + g.border + g.margin
                }[c]);
            }, angular.forEach({
                before: function(a) {
                    var b, c, d, e, f, g, h;
                    if (f = this, c = f[0], e = f.parent(), b = e.contents(), b[0] === c) return e.prepend(a);
                    for (d = g = 1, h = b.length - 1; h >= 1 ? h >= g : g >= h; d = h >= 1 ? ++g : --g) if (b[d] === c) return void angular.element(b[d - 1]).after(a);
                    throw new Error("invalid DOM structure " + c.outerHTML);
                },
                height: function(a) {
                    var b;
                    return b = this, angular.isDefined(a) ? (angular.isNumber(a) && (a += "px"), d.call(b, "height", a)) : g(this[0], "height", "base");
                },
                outerHeight: function(a) {
                    return g(this[0], "height", a ? "outerfull" : "outer");
                },
                offset: function(a) {
                    var b, c, d, e, f, g;
                    if (f = this, arguments.length) {
                        if (void 0 === a) return f;
                        throw new Error("offset setter method is not implemented");
                    }
                    return b = {
                        top: 0,
                        left: 0
                    }, e = f[0], (c = e && e.ownerDocument) ? (d = c.documentElement, null != e.getBoundingClientRect && (b = e.getBoundingClientRect()), 
                    g = c.defaultView || c.parentWindow, {
                        top: b.top + (g.pageYOffset || d.scrollTop) - (d.clientTop || 0),
                        left: b.left + (g.pageXOffset || d.scrollLeft) - (d.clientLeft || 0)
                    }) : void 0;
                },
                scrollTop: function(a) {
                    return i(this, "top", a);
                },
                scrollLeft: function(a) {
                    return i(this, "left", a);
                }
            }, function(b, c) {
                return a.prototype[c] ? void 0 : a.prototype[c] = b;
            });
        }
    };
} ]).run([ "$log", "$window", "jqLiteExtras", function(a, b, c) {
    return b.jQuery ? void 0 : c.registerFor(angular.element);
} ]), angular.module("ui.scroll", []).directive("uiScrollViewport", [ "$log", function() {
    return {
        controller: [ "$scope", "$element", function(a, b) {
            return b;
        } ]
    };
} ]).directive("uiScroll", [ "$log", "$injector", "$rootScope", "$timeout", function(a, b, c, d) {
    return {
        require: [ "?^uiScrollViewport" ],
        transclude: "element",
        priority: 1e3,
        terminal: !0,
        compile: function(e, f, g) {
            return function(e, f, h, i) {
                var j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, $, _, ab, bb;
                if (I = a.debug || a.log, J = h.uiScroll.match(/^\s*(\w+)\s+in\s+(\w+)\s*$/), !J) throw new Error("Expected uiScroll in form of '_item_ in _datasource_' but got '" + h.uiScroll + "'");
                if (G = J[1], u = J[2], E = function(a) {
                    return angular.isObject(a) && a.get && angular.isFunction(a.get);
                }, t = e[u], !E(t) && (t = b.get(u), !E(t))) throw new Error("" + u + " is not a valid datasource");
                return q = Math.max(3, +h.bufferSize || 10), p = function() {
                    return _.outerHeight() * Math.max(.1, +h.padding || .1);
                }, R = function(a) {
                    var b;
                    return null != (b = a[0].scrollHeight) ? b : a[0].document.documentElement.scrollHeight;
                }, j = null, g(V = e.$new(), function(a) {
                    var b, c, d, e, g, h;
                    if (e = a[0].localName, "dl" === e) throw new Error("ui-scroll directive does not support <" + a[0].localName + "> as a repeating tag: " + a[0].outerHTML);
                    return "li" !== e && "tr" !== e && (e = "div"), h = i[0] || angular.element(window), 
                    h.css({
                        "overflow-y": "auto",
                        display: "block"
                    }), d = function(a) {
                        var b, c, d;
                        switch (a) {
                          case "tr":
                            return d = angular.element("<table><tr><td><div></div></td></tr></table>"), b = d.find("div"), 
                            c = d.find("tr"), c.paddingHeight = function() {
                                return b.height.apply(b, arguments);
                            }, c;

                          default:
                            return c = angular.element("<" + a + "></" + a + ">"), c.paddingHeight = c.height, 
                            c;
                        }
                    }, c = function(a, b, c) {
                        return b[{
                            top: "before",
                            bottom: "after"
                        }[c]](a), {
                            paddingHeight: function() {
                                return a.paddingHeight.apply(a, arguments);
                            },
                            insert: function(b) {
                                return a[{
                                    top: "after",
                                    bottom: "before"
                                }[c]](b);
                            }
                        };
                    }, g = c(d(e), f, "top"), b = c(d(e), f, "bottom"), V.$destroy(), j = {
                        viewport: h,
                        topPadding: g.paddingHeight,
                        bottomPadding: b.paddingHeight,
                        append: b.insert,
                        prepend: g.insert,
                        bottomDataPos: function() {
                            return R(h) - b.paddingHeight();
                        },
                        topDataPos: function() {
                            return g.paddingHeight();
                        }
                    };
                }), _ = j.viewport, ab = _.scope() || c, angular.isDefined(h.topVisible) && (Y = function(a) {
                    return ab[h.topVisible] = a;
                }), angular.isDefined(h.topVisibleElement) && (X = function(a) {
                    return ab[h.topVisibleElement] = a;
                }), angular.isDefined(h.topVisibleScope) && ($ = function(a) {
                    return ab[h.topVisibleScope] = a;
                }), W = function(a) {
                    return Y && Y(a.scope[G]), X && X(a.element), $ && $(a.scope), t.topVisible ? t.topVisible(a) : void 0;
                }, H = angular.isDefined(h.isLoading) ? function(a) {
                    return ab[h.isLoading] = a, t.loading ? t.loading(a) : void 0;
                } : function(a) {
                    return t.loading ? t.loading(a) : void 0;
                }, P = 0, B = 1, K = 1, o = [], L = [], x = !1, m = !1, F = !1, N = function(a, b) {
                    var c, d;
                    for (c = d = a; b >= a ? b > d : d > b; c = b >= a ? ++d : --d) o[c].scope.$destroy(), 
                    o[c].element.remove();
                    return o.splice(a, b - a);
                }, M = function() {
                    return P++, B = 1, K = 1, N(0, o.length), j.topPadding(0), j.bottomPadding(0), L = [], 
                    x = !1, m = !1, k(P, !1);
                }, n = function() {
                    return _.scrollTop() + _.outerHeight();
                }, Z = function() {
                    return _.scrollTop();
                }, S = function() {
                    return !x && j.bottomDataPos() < n() + p();
                }, r = function() {
                    var a, b, c, d, e, f, g, h, i, k;
                    for (a = 0, g = 0, b = i = k = o.length - 1; 0 >= k ? 0 >= i : i >= 0; b = 0 >= k ? ++i : --i) if (c = o[b], 
                    e = c.element.offset().top, f = h !== e, h = e, f && (d = c.element.outerHeight(!0)), 
                    j.bottomDataPos() - a - d > n() + p()) f && (a += d), g++, x = !1; else {
                        if (f) break;
                        g++;
                    }
                    return g > 0 ? (j.bottomPadding(j.bottomPadding() + a), N(o.length - g, o.length), 
                    K -= g, I("clipped off bottom " + g + " bottom padding " + j.bottomPadding())) : void 0;
                }, T = function() {
                    return !m && j.topDataPos() > Z() - p();
                }, s = function() {
                    var a, b, c, d, e, f, g, h, i;
                    for (g = 0, e = 0, h = 0, i = o.length; i > h; h++) if (a = o[h], c = a.element.offset().top, 
                    d = f !== c, f = c, d && (b = a.element.outerHeight(!0)), j.topDataPos() + g + b < Z() - p()) d && (g += b), 
                    e++, m = !1; else {
                        if (d) break;
                        e++;
                    }
                    return e > 0 ? (j.topPadding(j.topPadding() + g), N(0, e), B += e, I("clipped off top " + e + " top padding " + j.topPadding())) : void 0;
                }, w = function(a, b, c) {
                    return F || (F = !0, H(!0)), 1 === L.push(b) ? z(a, c) : void 0;
                }, C = function(a) {
                    return a.displayTemp = a.css("display"), a.css("display", "none");
                }, U = function(a) {
                    return a.hasOwnProperty("displayTemp") ? a.css("display", a.displayTemp) : void 0;
                }, D = function(a, b) {
                    var c, d, f;
                    return c = e.$new(), c[G] = b, d = a > B, c.$index = a, d && c.$index--, f = {
                        scope: c
                    }, g(c, function(b) {
                        return f.element = b, d ? a === K ? (C(b), j.append(b), o.push(f)) : (o[a - B].element.after(b), 
                        o.splice(a - B + 1, 0, f)) : (C(b), j.prepend(b), o.unshift(f));
                    }), {
                        appended: d,
                        wrapper: f
                    };
                }, l = function(a, b) {
                    var c;
                    return a ? j.bottomPadding(Math.max(0, j.bottomPadding() - b.element.outerHeight(!0))) : (c = j.topPadding() - b.element.outerHeight(!0), 
                    c >= 0 ? j.topPadding(c) : _.scrollTop(_.scrollTop() + b.element.outerHeight(!0)));
                }, v = function(a, b, c) {
                    var d, e, f, g, h, i, k, l, m;
                    if (I("top {actual=" + j.topDataPos() + " visible from=" + Z() + " bottom {visible through=" + n() + " actual=" + j.bottomDataPos() + "}"), 
                    S() ? w(a, !0, b) : T() && w(a, !1, b), c && c(a), 0 === L.length) {
                        for (i = 0, m = [], k = 0, l = o.length; l > k; k++) {
                            if (d = o[k], f = d.element.offset().top, g = h !== f, h = f, g && (e = d.element.outerHeight(!0)), 
                            !(g && j.topDataPos() + i + e < Z())) {
                                g && W(d);
                                break;
                            }
                            m.push(i += e);
                        }
                        return m;
                    }
                }, k = function(a, b, c, e) {
                    return c && c.length ? d(function() {
                        var d, g, h, i, j, k, m, n;
                        for (i = [], j = 0, m = c.length; m > j; j++) g = c[j], f = g.wrapper.element, U(f), 
                        d = f.offset().top, h !== d && (i.push(g), h = d);
                        for (k = 0, n = i.length; n > k; k++) g = i[k], l(g.appended, g.wrapper);
                        return v(a, b, e);
                    }) : v(a, b, e);
                }, A = function(a, b, c) {
                    return k(a, b, c, function() {
                        return L.shift(), 0 === L.length ? (F = !1, H(!1)) : z(a, b);
                    });
                }, z = function(a, b) {
                    var c;
                    return c = L[0], c ? o.length && !S() ? A(a, b) : t.get(K, q, function(c) {
                        var d, e, f, g;
                        if (!a || a === P) {
                            if (e = [], c.length < q && (x = !0, j.bottomPadding(0)), c.length > 0) for (s(), 
                            f = 0, g = c.length; g > f; f++) d = c[f], e.push(D(++K, d));
                            return A(a, b, e);
                        }
                    }) : o.length && !T() ? A(a, b) : t.get(B - q, q, function(c) {
                        var d, e, f, g;
                        if (!a || a === P) {
                            if (e = [], c.length < q && (m = !0, j.topPadding(0)), c.length > 0) for (o.length && r(), 
                            d = f = g = c.length - 1; 0 >= g ? 0 >= f : f >= 0; d = 0 >= g ? ++f : --f) e.unshift(D(--B, c[d]));
                            return A(a, b, e);
                        }
                    });
                }, O = function() {
                    return c.$$phase || F ? void 0 : (k(null, !1), e.$apply());
                }, _.bind("resize", O), Q = function() {
                    return c.$$phase || F ? void 0 : (k(null, !0), e.$apply());
                }, _.bind("scroll", Q), bb = function(a) {
                    var b, c;
                    return b = _[0].scrollTop, c = _[0].scrollHeight - _[0].clientHeight, 0 === b && !m || b === c && !x ? a.preventDefault() : void 0;
                }, _.bind("mousewheel", bb), e.$watch(t.revision, function() {
                    return M();
                }), y = t.scope ? t.scope.$new() : e.$new(), e.$on("$destroy", function() {
                    return y.$destroy(), _.unbind("resize", O), _.unbind("scroll", Q), _.unbind("mousewheel", bb);
                }), y.$on("update.items", function(a, b, c) {
                    var d, e, f, g, h;
                    if (angular.isFunction(b)) for (e = function(a) {
                        return b(a.scope);
                    }, f = 0, g = o.length; g > f; f++) d = o[f], e(d); else 0 <= (h = b - B - 1) && h < o.length && (o[b - B - 1].scope[G] = c);
                    return null;
                }), y.$on("delete.items", function(a, b) {
                    var c, d, e, f, g, h, i, j, l, m, n, p;
                    if (angular.isFunction(b)) {
                        for (e = [], h = 0, l = o.length; l > h; h++) d = o[h], e.unshift(d);
                        for (g = function(a) {
                            return b(a.scope) ? (N(e.length - 1 - c, e.length - c), K--) : void 0;
                        }, c = i = 0, m = e.length; m > i; c = ++i) f = e[c], g(f);
                    } else 0 <= (p = b - B - 1) && p < o.length && (N(b - B - 1, b - B), K--);
                    for (c = j = 0, n = o.length; n > j; c = ++j) d = o[c], d.scope.$index = B + c;
                    return k(null, !1);
                }), y.$on("insert.item", function(a, b, c) {
                    var d, e, f, g, h;
                    if (e = [], angular.isFunction(b)) throw new Error("not implemented - Insert with locator function");
                    for (0 <= (h = b - B - 1) && h < o.length && (e.push(D(b, c)), K++), d = f = 0, 
                    g = o.length; g > f; d = ++f) c = o[d], c.scope.$index = B + d;
                    return k(null, !1, e);
                });
            };
        }
    };
} ]), angular.module("ui.scrollfix", []).directive("uiScrollfix", [ "$window", function(a) {
    function b() {
        if (angular.isDefined(a.pageYOffset)) return a.pageYOffset;
        var b = document.compatMode && "BackCompat" !== document.compatMode ? document.documentElement : document.body;
        return b.scrollTop;
    }
    return {
        require: "^?uiScrollfixTarget",
        link: function(c, d, e, f) {
            function g() {
                var a = f ? i[0].scrollTop : b();
                !d.hasClass("ui-scrollfix") && a > e.uiScrollfix ? d.addClass("ui-scrollfix") : d.hasClass("ui-scrollfix") && a < e.uiScrollfix && d.removeClass("ui-scrollfix");
            }
            var h = d[0].offsetTop, i = f && f.$element || angular.element(a);
            e.uiScrollfix ? "string" == typeof e.uiScrollfix && ("-" === e.uiScrollfix.charAt(0) ? e.uiScrollfix = h - parseFloat(e.uiScrollfix.substr(1)) : "+" === e.uiScrollfix.charAt(0) && (e.uiScrollfix = h + parseFloat(e.uiScrollfix.substr(1)))) : e.uiScrollfix = h, 
            i.on("scroll", g), c.$on("$destroy", function() {
                i.off("scroll", g);
            });
        }
    };
} ]).directive("uiScrollfixTarget", [ function() {
    return {
        controller: [ "$element", function(a) {
            this.$element = a;
        } ]
    };
} ]), angular.module("ui.showhide", []).directive("uiShow", [ function() {
    return function(a, b, c) {
        a.$watch(c.uiShow, function(a) {
            a ? b.addClass("ui-show") : b.removeClass("ui-show");
        });
    };
} ]).directive("uiHide", [ function() {
    return function(a, b, c) {
        a.$watch(c.uiHide, function(a) {
            a ? b.addClass("ui-hide") : b.removeClass("ui-hide");
        });
    };
} ]).directive("uiToggle", [ function() {
    return function(a, b, c) {
        a.$watch(c.uiToggle, function(a) {
            a ? b.removeClass("ui-hide").addClass("ui-show") : b.removeClass("ui-show").addClass("ui-hide");
        });
    };
} ]), angular.module("ui.unique", []).filter("unique", [ "$parse", function(a) {
    return function(b, c) {
        if (c === !1) return b;
        if ((c || angular.isUndefined(c)) && angular.isArray(b)) {
            var d = [], e = angular.isString(c) ? a(c) : function(a) {
                return a;
            }, f = function(a) {
                return angular.isObject(a) ? e(a) : a;
            };
            angular.forEach(b, function(a) {
                for (var b = !1, c = 0; c < d.length; c++) if (angular.equals(f(d[c]), f(a))) {
                    b = !0;
                    break;
                }
                b || d.push(a);
            }), b = d;
        }
        return b;
    };
} ]), angular.module("ui.validate", []).directive("uiValidate", function() {
    return {
        restrict: "A",
        require: "ngModel",
        link: function(a, b, c, d) {
            function e(b) {
                return angular.isString(b) ? void a.$watch(b, function() {
                    angular.forEach(g, function(a) {
                        a(d.$modelValue);
                    });
                }) : angular.isArray(b) ? void angular.forEach(b, function(b) {
                    a.$watch(b, function() {
                        angular.forEach(g, function(a) {
                            a(d.$modelValue);
                        });
                    });
                }) : void (angular.isObject(b) && angular.forEach(b, function(b, c) {
                    angular.isString(b) && a.$watch(b, function() {
                        g[c](d.$modelValue);
                    }), angular.isArray(b) && angular.forEach(b, function(b) {
                        a.$watch(b, function() {
                            g[c](d.$modelValue);
                        });
                    });
                }));
            }
            var f, g = {}, h = a.$eval(c.uiValidate);
            h && (angular.isString(h) && (h = {
                validator: h
            }), angular.forEach(h, function(b, c) {
                f = function(e) {
                    var f = a.$eval(b, {
                        $value: e
                    });
                    return angular.isObject(f) && angular.isFunction(f.then) ? (f.then(function() {
                        d.$setValidity(c, !0);
                    }, function() {
                        d.$setValidity(c, !1);
                    }), e) : f ? (d.$setValidity(c, !0), e) : (d.$setValidity(c, !1), e);
                }, g[c] = f, d.$formatters.push(f), d.$parsers.push(f);
            }), c.uiValidateWatch && e(a.$eval(c.uiValidateWatch)));
        }
    };
}), angular.module("ui.utils", [ "ui.event", "ui.format", "ui.highlight", "ui.include", "ui.indeterminate", "ui.inflector", "ui.jq", "ui.keypress", "ui.mask", "ui.reset", "ui.route", "ui.scrollfix", "ui.scroll", "ui.scroll.jqlite", "ui.showhide", "ui.unique", "ui.validate" ]);

!function(e) {
    if ("object" == typeof exports) module.exports = e(); else if ("function" == typeof define && define.amd) define(e); else {
        var f;
        "undefined" != typeof window ? f = window : "undefined" != typeof global ? f = global : "undefined" != typeof self && (f = self), 
        f.contentful = e();
    }
}(function() {
    var define, module, exports;
    return function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;
                    if (!u && a) return a(o, !0);
                    if (i) return i(o, !0);
                    throw new Error("Cannot find module '" + o + "'");
                }
                var f = n[o] = {
                    exports: {}
                };
                t[o][0].call(f.exports, function(e) {
                    var n = t[o][1][e];
                    return s(n ? n : e);
                }, f, f.exports, e, t, n, r);
            }
            return n[o].exports;
        }
        var i = typeof require == "function" && require;
        for (var o = 0; o < r.length; o++) s(r[o]);
        return s;
    }({
        1: [ function(require, module, exports) {
            "use strict";
            var _ = require("underscore-contrib");
            var questor = require("questor");
            var redefine = require("redefine");
            var querystring = require("querystring");
            var Client = redefine.Class({
                constructor: function Client(options) {
                    enforcep(options, "accessToken");
                    enforcep(options, "space");
                    this.options = _.defaults({}, options, {
                        host: "cdn.contentful.com",
                        secure: true
                    });
                },
                request: function(path, options) {
                    if (!options) options = {};
                    if (!options.headers) options.headers = {};
                    if (!options.query) options.query = {};
                    options.headers["Content-Type"] = "application/vnd.contentful.delivery.v1+json";
                    options.query.access_token = this.options.accessToken;
                    var uri = [ this.options.secure ? "https" : "http", "://", _.first(this.options.host.split(":")), ":", this.options.secure ? "443" : "80", "/spaces/", this.options.space, path, "?", querystring.stringify(options.query) ].join("");
                    return questor(uri, options).then(parseJSONBody).catch(Error, function(error) {
                        throw error;
                    }).catch(function(error) {
                        throw parseJSONBody(error);
                    });
                },
                asset: function(id, callback) {
                    return this.request("/assets/" + id).then(Asset.parse).nodeify(callback);
                },
                assets: function(object, callback) {
                    var query = Query.parse(object);
                    return this.request("/assets", {
                        query: query
                    }).then(_.partial(SearchResult.parse, Asset)).nodeify(callback);
                },
                contentType: function(id, callback) {
                    return this.request("/content_types/" + id).then(ContentType.parse).nodeify(callback);
                },
                contentTypes: function(object, callback) {
                    var query = Query.parse(object);
                    return this.request("/content_types", {
                        query: query
                    }).then(_.partial(SearchResult.parse, ContentType)).nodeify(callback);
                },
                entry: function(id, callback) {
                    return this.request("/entries/" + id).then(Entry.parse).nodeify(callback);
                },
                entries: function(object, callback) {
                    var query = Query.parse(object);
                    return this.request("/entries", {
                        query: query
                    }).then(_.partial(SearchResult.parse, Entry)).nodeify(callback);
                },
                space: function(callback) {
                    return this.request("").nodeify(callback);
                }
            });
            var Asset = redefine.Class({
                constructor: function Asset() {},
                statics: {
                    parse: function(object) {
                        return _.extend(new Asset(), {
                            sys: Sys.parse(object.sys),
                            fields: object.fields
                        });
                    }
                }
            });
            var Entry = redefine.Class({
                constructor: function Entry() {},
                statics: {
                    parse: function(object) {
                        return _.extend(new Entry(), {
                            sys: Sys.parse(object.sys),
                            fields: object.fields
                        });
                    }
                }
            });
            var ContentType = redefine.Class({
                constructor: function ContentType() {},
                statics: {
                    parse: function(object) {
                        return _.extend(new ContentType(), {
                            sys: Sys.parse(object.sys),
                            fields: object.fields.map(Field.parse)
                        }, _.pick(object, "name", "displayField"));
                    }
                }
            });
            var Field = redefine.Class({
                constructor: function Field() {},
                statics: {
                    parse: function(object) {
                        return _.extend(new Field(), object);
                    }
                }
            });
            var SearchResult = redefine.Class({
                constructor: function SearchResult() {},
                statics: {
                    parse: function(ItemType, object) {
                        walkMutate(object, isParseableResource, parseResource);
                        var items = resolveLinks(object);
                        return redefine(items, {
                            limit: object.limit,
                            skip: object.skip,
                            total: object.total
                        }, {
                            enumerable: false
                        });
                    }
                }
            });
            var Query = redefine.Class({
                constructor: function Query() {},
                toQueryString: function() {
                    return querystring.stringify(this);
                },
                statics: {
                    parse: function(object) {
                        return _.extend(new Query(), stringifyArrayValues(object));
                    }
                }
            });
            var Space = redefine.Class({
                constructor: function Space() {},
                statics: {
                    parse: function(object) {
                        return _.extend(new Space(), object);
                    }
                }
            });
            var Sys = redefine.Class({
                constructor: function Sys() {},
                statics: {
                    parse: function(object) {
                        return _.extend(new Sys(), _.pick(object, "id", "revision", "type", "locale"), compacto({
                            contentType: object.contentType && Link.parse(object.contentType),
                            createdAt: object.createdAt && new Date(object.createdAt),
                            linkType: object.linkType,
                            updatedAt: object.updatedAt && new Date(object.updatedAt),
                            space: object.space && Link.parse(object.space)
                        }));
                    }
                }
            });
            var Link = redefine.Class({
                constructor: function Link() {},
                statics: {
                    parse: function(object) {
                        return _.extend(new Link(), {
                            sys: Sys.parse(object.sys)
                        });
                    }
                }
            });
            exports.createClient = _.fnull(function(options) {
                return new Client(options);
            }, {});
            function compacto(object) {
                return _.reduce(object, function(compacted, value, key) {
                    if (_.truthy(value)) compacted[key] = value;
                    return compacted;
                }, {});
            }
            function enforcep(object, property) {
                if (!_.exists(object[property])) throw new TypeError("Expected property " + property);
            }
            var parseableResourceTypes = {
                Asset: Asset,
                ContentType: ContentType,
                Entry: Entry,
                Space: Space
            };
            function isParseableResource(object) {
                return _.getPath(object, [ "sys", "type" ]) in parseableResourceTypes;
            }
            function parseResource(resource) {
                var Type = parseableResourceTypes[resource.sys.type];
                return Type.parse(resource);
            }
            function parseJSONBody(response) {
                return JSON.parse(response.body);
            }
            function stringifyArrayValues(object) {
                return _.reduce(object, function(object, value, key) {
                    object[key] = _.isArray(value) ? value.join(",") : value;
                    return object;
                }, {});
            }
            function resolveLinks(response) {
                walkMutate(response, isLink, function(link) {
                    return getLink(response, link) || link;
                });
                return response.items;
            }
            function isLink(object) {
                return _.getPath(object, [ "sys", "type" ]) === "Link";
            }
            function getLink(response, link) {
                var type = link.sys.linkType;
                var id = link.sys.id;
                var pred = function(resource) {
                    return resource.sys.type === type && resource.sys.id === id;
                };
                return _.find(response.items, pred) || response.includes && _.find(response.includes[type], pred);
            }
            function walkMutate(input, pred, mutator) {
                if (pred(input)) return mutator(input);
                if (_.isArray(input) || _.isObject(input)) {
                    _.each(input, function(item, key) {
                        input[key] = walkMutate(item, pred, mutator);
                    });
                    return input;
                }
                return input;
            }
        }, {
            querystring: 22,
            questor: 19,
            redefine: 2,
            "underscore-contrib": 3
        } ],
        2: [ function(require, module, exports) {
            var _ = this._ = function(e, t, n) {
                function q(e, t) {
                    for (var n = {}, r = T(e), i = 0, s = r.length, o; i < s; i++) o = r[i], n[o] = x(e, o);
                    return k(t === undefined ? N(e) : t, n);
                }
                function R(e, t, n, r) {
                    j(n || Z.defaults || {}, _), j(r, _);
                    if (S.call(r, a) || S.call(r, p)) delete _[g], delete _[m];
                    E(e, t, _), A(_);
                }
                function U(e, t, n, r) {
                    R(e, t, r, n instanceof V ? n : n instanceof G ? X(e, t, n) : (P[m] = n, P)), delete P[m];
                }
                function z(e, t, n) {
                    for (var r in t) S.call(t, r) && U(e, r, t[r], n);
                }
                function W(e, t) {
                    for (var n = 0, r, i; n < t.length; n++) r = t[n], Q(r) && (r = (r.type || r.name) === "mixin" ? r.call(r) || r : r[h]), 
                    C(e, r);
                }
                function X(e, t, n) {
                    var r = n._, s = S.call(n, i) ? !!n[i] : !0, u = S.call(n, o) && n[o], f = S.call(n, g) && n[g], l;
                    return n[a] = function() {
                        return H && (n = x(e, t), delete e[t]), _[m] = r.call(l = this), _[i] = s, _[o] = u, 
                        _[g] = f, E(l, t, _), A(_), H && (j(n, _), E(e, t, _), A(_)), l[t];
                    }, H && (n[i] = !0), n;
                }
                function V(e) {
                    j(e, this);
                }
                function $(e) {
                    return new V(e);
                }
                function J(e) {
                    return k(Q(e) ? e[h] : e);
                }
                function K(e, t, n) {
                    var r = J(e);
                    return t ? Z(r, t, n) : r;
                }
                function Q(e) {
                    return typeof e == "function";
                }
                function G(e) {
                    this._ = Q(e) ? e : j(e, this) || e[m];
                }
                function Y(e) {
                    return new G(e);
                }
                function Z(e, t, n, r) {
                    return (typeof t == "string" ? U(e, t, n, r) : z(e, t, n)) || e;
                }
                function et(e) {
                    return function(n, r, i) {
                        return (typeof r == "string" ? U(n, r, i, e) : z(n, r, e)) || n;
                    };
                }
                function tt(e, t) {
                    var n, r, i, s;
                    while (t = N(t)) {
                        i = T(t), n = i.length;
                        while (n--) if (t[r = i[n]] === e) {
                            do s = N(t), t = s; while (s[r] === e);
                            return s[r];
                        }
                    }
                }
                function nt() {
                    return tt(nt.caller, this).apply(this, arguments);
                }
                function rt(e, t) {
                    return typeof e == "string" ? rt(this, e) : e[l + t] || it(e, t);
                }
                function it(e, t) {
                    return O[m] = b.call(e[t], e), E(e, l + t, O), O[m] = rt, e[l + t];
                }
                function st(e, t) {
                    var n = S.call(e, s) ? e[s] : function() {}, i = S.call(e, d) && e[d], o = S.call(e, u) && e[u], a;
                    t || (t = {}, t[g] = !0), delete e[s];
                    if (o) {
                        delete e[u], Z(n[h] = J(o), "constructor", n);
                        if (Q(o)) for (a in o) S.call(o, a) && a !== "name" && a !== "length" && R(n, a, _, x(o, a));
                    }
                    return i && (delete e[d], z(n, i, D)), S.call(e, f) && (W(n[h], [].concat(e[f])), 
                    delete e[f]), z(n[h], e, t), ot(n[h]), r in n[h] || E(n[h], r, O), n;
                }
                function ot(e) {
                    return S.call(e, v) ? object : E(e, v, M);
                }
                var r = "bound", i = "configurable", s = "constructor", o = "enumerable", u = "extend", a = "get", f = "mixin", l = "__@", c = "__proto__", h = "prototype", p = "set", d = "statics", v = "super", m = "value", g = "writable", y = t, b = t.bind || function(t) {
                    var n = this;
                    return function() {
                        return n.apply(t, arguments);
                    };
                }, w = function(t, r) {
                    return e[t] || n[t] || r;
                }, E = w("defineProperty"), S = w("hasOwnProperty"), x = w("getOwnPropertyDescriptor"), T = w("getOwnPropertyNames", n.keys), N = w("getPrototypeOf", function(t) {
                    return t[c];
                }), C = n.mixin || function(t, n) {
                    for (var r = T(n), i = r.length; i--; R(t, r[i], _, x(n, r[i]))) ;
                    return t;
                }, k = e.create || e.inherit || n.create, L = [ i, o, a, p, m, g ], A = y("o", "delete o." + L.join(";delete o.")), O = k(null), M = k(null), _ = k(null), D = {}, P = {}, H = !1, B, j, F, I;
                D[g] = !0, D[o] = !0;
                for (B = 0; B < L.length; B++) L[B] = [ 'if(h.call(a,"', '"))b.', "=a.", ";" ].join(L[B]);
                j = y("h", "return function(a,b){" + L.join("") + "}")(S), M[m] = function at(e) {
                    return b.apply(tt(at.caller, e), arguments);
                }, M[i] = M[o] = M[g] = !1, E(nt, "bind", M), M[m] = nt, O[o] = !1, O[i] = O[g] = !0, 
                O[m] = rt, Z.from = K, Z.Class = st, Z[v] = ot, Z.mixin = C, Z.bound = rt, Z.clone = q, 
                Z.as = $, Z.later = Y, Z.using = et, Z.defaults = {}, "undefined" != typeof module && module.exports && ((module.exports = Z).redefine = Z), 
                e.mixin ? e.mixin({
                    redefine: Z
                }) : e.redefine = Z;
                try {
                    I = k(Z({}, {
                        _: Y(n)
                    }))._;
                } catch (ut) {
                    A(_), H = !0;
                }
                return e;
            }(_ || this, Function, Object);
        }, {} ],
        3: [ function(require, module, exports) {
            require("./underscore.array.builders");
            require("./underscore.array.selectors");
            require("./underscore.collections.walk");
            require("./underscore.function.arity");
            require("./underscore.function.combinators");
            require("./underscore.function.dispatch");
            require("./underscore.function.iterators");
            require("./underscore.function.predicates");
            require("./underscore.object.builders");
            require("./underscore.object.selectors");
            require("./underscore.util.existential");
            require("./underscore.util.operators");
            require("./underscore.util.strings");
            require("./underscore.util.trampolines");
            module.exports = require("underscore");
        }, {
            "./underscore.array.builders": 5,
            "./underscore.array.selectors": 6,
            "./underscore.collections.walk": 7,
            "./underscore.function.arity": 8,
            "./underscore.function.combinators": 9,
            "./underscore.function.dispatch": 10,
            "./underscore.function.iterators": 11,
            "./underscore.function.predicates": 12,
            "./underscore.object.builders": 13,
            "./underscore.object.selectors": 14,
            "./underscore.util.existential": 15,
            "./underscore.util.operators": 16,
            "./underscore.util.strings": 17,
            "./underscore.util.trampolines": 18,
            underscore: 4
        } ],
        4: [ function(require, module, exports) {
            (function() {
                var root = this;
                var previousUnderscore = root._;
                var breaker = {};
                var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
                var push = ArrayProto.push, slice = ArrayProto.slice, concat = ArrayProto.concat, toString = ObjProto.toString, hasOwnProperty = ObjProto.hasOwnProperty;
                var nativeForEach = ArrayProto.forEach, nativeMap = ArrayProto.map, nativeReduce = ArrayProto.reduce, nativeReduceRight = ArrayProto.reduceRight, nativeFilter = ArrayProto.filter, nativeEvery = ArrayProto.every, nativeSome = ArrayProto.some, nativeIndexOf = ArrayProto.indexOf, nativeLastIndexOf = ArrayProto.lastIndexOf, nativeIsArray = Array.isArray, nativeKeys = Object.keys, nativeBind = FuncProto.bind;
                var _ = function(obj) {
                    if (obj instanceof _) return obj;
                    if (!(this instanceof _)) return new _(obj);
                    this._wrapped = obj;
                };
                if (typeof exports !== "undefined") {
                    if (typeof module !== "undefined" && module.exports) {
                        exports = module.exports = _;
                    }
                    exports._ = _;
                } else {
                    root._ = _;
                }
                _.VERSION = "1.5.2";
                var each = _.each = _.forEach = function(obj, iterator, context) {
                    if (obj == null) return;
                    if (nativeForEach && obj.forEach === nativeForEach) {
                        obj.forEach(iterator, context);
                    } else if (obj.length === +obj.length) {
                        for (var i = 0, length = obj.length; i < length; i++) {
                            if (iterator.call(context, obj[i], i, obj) === breaker) return;
                        }
                    } else {
                        var keys = _.keys(obj);
                        for (var i = 0, length = keys.length; i < length; i++) {
                            if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
                        }
                    }
                };
                _.map = _.collect = function(obj, iterator, context) {
                    var results = [];
                    if (obj == null) return results;
                    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
                    each(obj, function(value, index, list) {
                        results.push(iterator.call(context, value, index, list));
                    });
                    return results;
                };
                var reduceError = "Reduce of empty array with no initial value";
                _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
                    var initial = arguments.length > 2;
                    if (obj == null) obj = [];
                    if (nativeReduce && obj.reduce === nativeReduce) {
                        if (context) iterator = _.bind(iterator, context);
                        return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
                    }
                    each(obj, function(value, index, list) {
                        if (!initial) {
                            memo = value;
                            initial = true;
                        } else {
                            memo = iterator.call(context, memo, value, index, list);
                        }
                    });
                    if (!initial) throw new TypeError(reduceError);
                    return memo;
                };
                _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
                    var initial = arguments.length > 2;
                    if (obj == null) obj = [];
                    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
                        if (context) iterator = _.bind(iterator, context);
                        return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
                    }
                    var length = obj.length;
                    if (length !== +length) {
                        var keys = _.keys(obj);
                        length = keys.length;
                    }
                    each(obj, function(value, index, list) {
                        index = keys ? keys[--length] : --length;
                        if (!initial) {
                            memo = obj[index];
                            initial = true;
                        } else {
                            memo = iterator.call(context, memo, obj[index], index, list);
                        }
                    });
                    if (!initial) throw new TypeError(reduceError);
                    return memo;
                };
                _.find = _.detect = function(obj, iterator, context) {
                    var result;
                    any(obj, function(value, index, list) {
                        if (iterator.call(context, value, index, list)) {
                            result = value;
                            return true;
                        }
                    });
                    return result;
                };
                _.filter = _.select = function(obj, iterator, context) {
                    var results = [];
                    if (obj == null) return results;
                    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
                    each(obj, function(value, index, list) {
                        if (iterator.call(context, value, index, list)) results.push(value);
                    });
                    return results;
                };
                _.reject = function(obj, iterator, context) {
                    return _.filter(obj, function(value, index, list) {
                        return !iterator.call(context, value, index, list);
                    }, context);
                };
                _.every = _.all = function(obj, iterator, context) {
                    iterator || (iterator = _.identity);
                    var result = true;
                    if (obj == null) return result;
                    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
                    each(obj, function(value, index, list) {
                        if (!(result = result && iterator.call(context, value, index, list))) return breaker;
                    });
                    return !!result;
                };
                var any = _.some = _.any = function(obj, iterator, context) {
                    iterator || (iterator = _.identity);
                    var result = false;
                    if (obj == null) return result;
                    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
                    each(obj, function(value, index, list) {
                        if (result || (result = iterator.call(context, value, index, list))) return breaker;
                    });
                    return !!result;
                };
                _.contains = _.include = function(obj, target) {
                    if (obj == null) return false;
                    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
                    return any(obj, function(value) {
                        return value === target;
                    });
                };
                _.invoke = function(obj, method) {
                    var args = slice.call(arguments, 2);
                    var isFunc = _.isFunction(method);
                    return _.map(obj, function(value) {
                        return (isFunc ? method : value[method]).apply(value, args);
                    });
                };
                _.pluck = function(obj, key) {
                    return _.map(obj, function(value) {
                        return value[key];
                    });
                };
                _.where = function(obj, attrs, first) {
                    if (_.isEmpty(attrs)) return first ? void 0 : [];
                    return _[first ? "find" : "filter"](obj, function(value) {
                        for (var key in attrs) {
                            if (attrs[key] !== value[key]) return false;
                        }
                        return true;
                    });
                };
                _.findWhere = function(obj, attrs) {
                    return _.where(obj, attrs, true);
                };
                _.max = function(obj, iterator, context) {
                    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
                        return Math.max.apply(Math, obj);
                    }
                    if (!iterator && _.isEmpty(obj)) return -Infinity;
                    var result = {
                        computed: -Infinity,
                        value: -Infinity
                    };
                    each(obj, function(value, index, list) {
                        var computed = iterator ? iterator.call(context, value, index, list) : value;
                        computed > result.computed && (result = {
                            value: value,
                            computed: computed
                        });
                    });
                    return result.value;
                };
                _.min = function(obj, iterator, context) {
                    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
                        return Math.min.apply(Math, obj);
                    }
                    if (!iterator && _.isEmpty(obj)) return Infinity;
                    var result = {
                        computed: Infinity,
                        value: Infinity
                    };
                    each(obj, function(value, index, list) {
                        var computed = iterator ? iterator.call(context, value, index, list) : value;
                        computed < result.computed && (result = {
                            value: value,
                            computed: computed
                        });
                    });
                    return result.value;
                };
                _.shuffle = function(obj) {
                    var rand;
                    var index = 0;
                    var shuffled = [];
                    each(obj, function(value) {
                        rand = _.random(index++);
                        shuffled[index - 1] = shuffled[rand];
                        shuffled[rand] = value;
                    });
                    return shuffled;
                };
                _.sample = function(obj, n, guard) {
                    if (arguments.length < 2 || guard) {
                        return obj[_.random(obj.length - 1)];
                    }
                    return _.shuffle(obj).slice(0, Math.max(0, n));
                };
                var lookupIterator = function(value) {
                    return _.isFunction(value) ? value : function(obj) {
                        return obj[value];
                    };
                };
                _.sortBy = function(obj, value, context) {
                    var iterator = lookupIterator(value);
                    return _.pluck(_.map(obj, function(value, index, list) {
                        return {
                            value: value,
                            index: index,
                            criteria: iterator.call(context, value, index, list)
                        };
                    }).sort(function(left, right) {
                        var a = left.criteria;
                        var b = right.criteria;
                        if (a !== b) {
                            if (a > b || a === void 0) return 1;
                            if (a < b || b === void 0) return -1;
                        }
                        return left.index - right.index;
                    }), "value");
                };
                var group = function(behavior) {
                    return function(obj, value, context) {
                        var result = {};
                        var iterator = value == null ? _.identity : lookupIterator(value);
                        each(obj, function(value, index) {
                            var key = iterator.call(context, value, index, obj);
                            behavior(result, key, value);
                        });
                        return result;
                    };
                };
                _.groupBy = group(function(result, key, value) {
                    (_.has(result, key) ? result[key] : result[key] = []).push(value);
                });
                _.indexBy = group(function(result, key, value) {
                    result[key] = value;
                });
                _.countBy = group(function(result, key) {
                    _.has(result, key) ? result[key]++ : result[key] = 1;
                });
                _.sortedIndex = function(array, obj, iterator, context) {
                    iterator = iterator == null ? _.identity : lookupIterator(iterator);
                    var value = iterator.call(context, obj);
                    var low = 0, high = array.length;
                    while (low < high) {
                        var mid = low + high >>> 1;
                        iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
                    }
                    return low;
                };
                _.toArray = function(obj) {
                    if (!obj) return [];
                    if (_.isArray(obj)) return slice.call(obj);
                    if (obj.length === +obj.length) return _.map(obj, _.identity);
                    return _.values(obj);
                };
                _.size = function(obj) {
                    if (obj == null) return 0;
                    return obj.length === +obj.length ? obj.length : _.keys(obj).length;
                };
                _.first = _.head = _.take = function(array, n, guard) {
                    if (array == null) return void 0;
                    return n == null || guard ? array[0] : slice.call(array, 0, n);
                };
                _.initial = function(array, n, guard) {
                    return slice.call(array, 0, array.length - (n == null || guard ? 1 : n));
                };
                _.last = function(array, n, guard) {
                    if (array == null) return void 0;
                    if (n == null || guard) {
                        return array[array.length - 1];
                    } else {
                        return slice.call(array, Math.max(array.length - n, 0));
                    }
                };
                _.rest = _.tail = _.drop = function(array, n, guard) {
                    return slice.call(array, n == null || guard ? 1 : n);
                };
                _.compact = function(array) {
                    return _.filter(array, _.identity);
                };
                var flatten = function(input, shallow, output) {
                    if (shallow && _.every(input, _.isArray)) {
                        return concat.apply(output, input);
                    }
                    each(input, function(value) {
                        if (_.isArray(value) || _.isArguments(value)) {
                            shallow ? push.apply(output, value) : flatten(value, shallow, output);
                        } else {
                            output.push(value);
                        }
                    });
                    return output;
                };
                _.flatten = function(array, shallow) {
                    return flatten(array, shallow, []);
                };
                _.without = function(array) {
                    return _.difference(array, slice.call(arguments, 1));
                };
                _.uniq = _.unique = function(array, isSorted, iterator, context) {
                    if (_.isFunction(isSorted)) {
                        context = iterator;
                        iterator = isSorted;
                        isSorted = false;
                    }
                    var initial = iterator ? _.map(array, iterator, context) : array;
                    var results = [];
                    var seen = [];
                    each(initial, function(value, index) {
                        if (isSorted ? !index || seen[seen.length - 1] !== value : !_.contains(seen, value)) {
                            seen.push(value);
                            results.push(array[index]);
                        }
                    });
                    return results;
                };
                _.union = function() {
                    return _.uniq(_.flatten(arguments, true));
                };
                _.intersection = function(array) {
                    var rest = slice.call(arguments, 1);
                    return _.filter(_.uniq(array), function(item) {
                        return _.every(rest, function(other) {
                            return _.indexOf(other, item) >= 0;
                        });
                    });
                };
                _.difference = function(array) {
                    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
                    return _.filter(array, function(value) {
                        return !_.contains(rest, value);
                    });
                };
                _.zip = function() {
                    var length = _.max(_.pluck(arguments, "length").concat(0));
                    var results = new Array(length);
                    for (var i = 0; i < length; i++) {
                        results[i] = _.pluck(arguments, "" + i);
                    }
                    return results;
                };
                _.object = function(list, values) {
                    if (list == null) return {};
                    var result = {};
                    for (var i = 0, length = list.length; i < length; i++) {
                        if (values) {
                            result[list[i]] = values[i];
                        } else {
                            result[list[i][0]] = list[i][1];
                        }
                    }
                    return result;
                };
                _.indexOf = function(array, item, isSorted) {
                    if (array == null) return -1;
                    var i = 0, length = array.length;
                    if (isSorted) {
                        if (typeof isSorted == "number") {
                            i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
                        } else {
                            i = _.sortedIndex(array, item);
                            return array[i] === item ? i : -1;
                        }
                    }
                    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
                    for (;i < length; i++) if (array[i] === item) return i;
                    return -1;
                };
                _.lastIndexOf = function(array, item, from) {
                    if (array == null) return -1;
                    var hasIndex = from != null;
                    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
                        return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
                    }
                    var i = hasIndex ? from : array.length;
                    while (i--) if (array[i] === item) return i;
                    return -1;
                };
                _.range = function(start, stop, step) {
                    if (arguments.length <= 1) {
                        stop = start || 0;
                        start = 0;
                    }
                    step = arguments[2] || 1;
                    var length = Math.max(Math.ceil((stop - start) / step), 0);
                    var idx = 0;
                    var range = new Array(length);
                    while (idx < length) {
                        range[idx++] = start;
                        start += step;
                    }
                    return range;
                };
                var ctor = function() {};
                _.bind = function(func, context) {
                    var args, bound;
                    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
                    if (!_.isFunction(func)) throw new TypeError();
                    args = slice.call(arguments, 2);
                    return bound = function() {
                        if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
                        ctor.prototype = func.prototype;
                        var self = new ctor();
                        ctor.prototype = null;
                        var result = func.apply(self, args.concat(slice.call(arguments)));
                        if (Object(result) === result) return result;
                        return self;
                    };
                };
                _.partial = function(func) {
                    var args = slice.call(arguments, 1);
                    return function() {
                        return func.apply(this, args.concat(slice.call(arguments)));
                    };
                };
                _.bindAll = function(obj) {
                    var funcs = slice.call(arguments, 1);
                    if (funcs.length === 0) throw new Error("bindAll must be passed function names");
                    each(funcs, function(f) {
                        obj[f] = _.bind(obj[f], obj);
                    });
                    return obj;
                };
                _.memoize = function(func, hasher) {
                    var memo = {};
                    hasher || (hasher = _.identity);
                    return function() {
                        var key = hasher.apply(this, arguments);
                        return _.has(memo, key) ? memo[key] : memo[key] = func.apply(this, arguments);
                    };
                };
                _.delay = function(func, wait) {
                    var args = slice.call(arguments, 2);
                    return setTimeout(function() {
                        return func.apply(null, args);
                    }, wait);
                };
                _.defer = function(func) {
                    return _.delay.apply(_, [ func, 1 ].concat(slice.call(arguments, 1)));
                };
                _.throttle = function(func, wait, options) {
                    var context, args, result;
                    var timeout = null;
                    var previous = 0;
                    options || (options = {});
                    var later = function() {
                        previous = options.leading === false ? 0 : new Date();
                        timeout = null;
                        result = func.apply(context, args);
                    };
                    return function() {
                        var now = new Date();
                        if (!previous && options.leading === false) previous = now;
                        var remaining = wait - (now - previous);
                        context = this;
                        args = arguments;
                        if (remaining <= 0) {
                            clearTimeout(timeout);
                            timeout = null;
                            previous = now;
                            result = func.apply(context, args);
                        } else if (!timeout && options.trailing !== false) {
                            timeout = setTimeout(later, remaining);
                        }
                        return result;
                    };
                };
                _.debounce = function(func, wait, immediate) {
                    var timeout, args, context, timestamp, result;
                    return function() {
                        context = this;
                        args = arguments;
                        timestamp = new Date();
                        var later = function() {
                            var last = new Date() - timestamp;
                            if (last < wait) {
                                timeout = setTimeout(later, wait - last);
                            } else {
                                timeout = null;
                                if (!immediate) result = func.apply(context, args);
                            }
                        };
                        var callNow = immediate && !timeout;
                        if (!timeout) {
                            timeout = setTimeout(later, wait);
                        }
                        if (callNow) result = func.apply(context, args);
                        return result;
                    };
                };
                _.once = function(func) {
                    var ran = false, memo;
                    return function() {
                        if (ran) return memo;
                        ran = true;
                        memo = func.apply(this, arguments);
                        func = null;
                        return memo;
                    };
                };
                _.wrap = function(func, wrapper) {
                    return function() {
                        var args = [ func ];
                        push.apply(args, arguments);
                        return wrapper.apply(this, args);
                    };
                };
                _.compose = function() {
                    var funcs = arguments;
                    return function() {
                        var args = arguments;
                        for (var i = funcs.length - 1; i >= 0; i--) {
                            args = [ funcs[i].apply(this, args) ];
                        }
                        return args[0];
                    };
                };
                _.after = function(times, func) {
                    return function() {
                        if (--times < 1) {
                            return func.apply(this, arguments);
                        }
                    };
                };
                _.keys = nativeKeys || function(obj) {
                    if (obj !== Object(obj)) throw new TypeError("Invalid object");
                    var keys = [];
                    for (var key in obj) if (_.has(obj, key)) keys.push(key);
                    return keys;
                };
                _.values = function(obj) {
                    var keys = _.keys(obj);
                    var length = keys.length;
                    var values = new Array(length);
                    for (var i = 0; i < length; i++) {
                        values[i] = obj[keys[i]];
                    }
                    return values;
                };
                _.pairs = function(obj) {
                    var keys = _.keys(obj);
                    var length = keys.length;
                    var pairs = new Array(length);
                    for (var i = 0; i < length; i++) {
                        pairs[i] = [ keys[i], obj[keys[i]] ];
                    }
                    return pairs;
                };
                _.invert = function(obj) {
                    var result = {};
                    var keys = _.keys(obj);
                    for (var i = 0, length = keys.length; i < length; i++) {
                        result[obj[keys[i]]] = keys[i];
                    }
                    return result;
                };
                _.functions = _.methods = function(obj) {
                    var names = [];
                    for (var key in obj) {
                        if (_.isFunction(obj[key])) names.push(key);
                    }
                    return names.sort();
                };
                _.extend = function(obj) {
                    each(slice.call(arguments, 1), function(source) {
                        if (source) {
                            for (var prop in source) {
                                obj[prop] = source[prop];
                            }
                        }
                    });
                    return obj;
                };
                _.pick = function(obj) {
                    var copy = {};
                    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
                    each(keys, function(key) {
                        if (key in obj) copy[key] = obj[key];
                    });
                    return copy;
                };
                _.omit = function(obj) {
                    var copy = {};
                    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
                    for (var key in obj) {
                        if (!_.contains(keys, key)) copy[key] = obj[key];
                    }
                    return copy;
                };
                _.defaults = function(obj) {
                    each(slice.call(arguments, 1), function(source) {
                        if (source) {
                            for (var prop in source) {
                                if (obj[prop] === void 0) obj[prop] = source[prop];
                            }
                        }
                    });
                    return obj;
                };
                _.clone = function(obj) {
                    if (!_.isObject(obj)) return obj;
                    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
                };
                _.tap = function(obj, interceptor) {
                    interceptor(obj);
                    return obj;
                };
                var eq = function(a, b, aStack, bStack) {
                    if (a === b) return a !== 0 || 1 / a == 1 / b;
                    if (a == null || b == null) return a === b;
                    if (a instanceof _) a = a._wrapped;
                    if (b instanceof _) b = b._wrapped;
                    var className = toString.call(a);
                    if (className != toString.call(b)) return false;
                    switch (className) {
                      case "[object String]":
                        return a == String(b);

                      case "[object Number]":
                        return a != +a ? b != +b : a == 0 ? 1 / a == 1 / b : a == +b;

                      case "[object Date]":
                      case "[object Boolean]":
                        return +a == +b;

                      case "[object RegExp]":
                        return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase;
                    }
                    if (typeof a != "object" || typeof b != "object") return false;
                    var length = aStack.length;
                    while (length--) {
                        if (aStack[length] == a) return bStack[length] == b;
                    }
                    var aCtor = a.constructor, bCtor = b.constructor;
                    if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor)) {
                        return false;
                    }
                    aStack.push(a);
                    bStack.push(b);
                    var size = 0, result = true;
                    if (className == "[object Array]") {
                        size = a.length;
                        result = size == b.length;
                        if (result) {
                            while (size--) {
                                if (!(result = eq(a[size], b[size], aStack, bStack))) break;
                            }
                        }
                    } else {
                        for (var key in a) {
                            if (_.has(a, key)) {
                                size++;
                                if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
                            }
                        }
                        if (result) {
                            for (key in b) {
                                if (_.has(b, key) && !size--) break;
                            }
                            result = !size;
                        }
                    }
                    aStack.pop();
                    bStack.pop();
                    return result;
                };
                _.isEqual = function(a, b) {
                    return eq(a, b, [], []);
                };
                _.isEmpty = function(obj) {
                    if (obj == null) return true;
                    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
                    for (var key in obj) if (_.has(obj, key)) return false;
                    return true;
                };
                _.isElement = function(obj) {
                    return !!(obj && obj.nodeType === 1);
                };
                _.isArray = nativeIsArray || function(obj) {
                    return toString.call(obj) == "[object Array]";
                };
                _.isObject = function(obj) {
                    return obj === Object(obj);
                };
                each([ "Arguments", "Function", "String", "Number", "Date", "RegExp" ], function(name) {
                    _["is" + name] = function(obj) {
                        return toString.call(obj) == "[object " + name + "]";
                    };
                });
                if (!_.isArguments(arguments)) {
                    _.isArguments = function(obj) {
                        return !!(obj && _.has(obj, "callee"));
                    };
                }
                if (typeof /./ !== "function") {
                    _.isFunction = function(obj) {
                        return typeof obj === "function";
                    };
                }
                _.isFinite = function(obj) {
                    return isFinite(obj) && !isNaN(parseFloat(obj));
                };
                _.isNaN = function(obj) {
                    return _.isNumber(obj) && obj != +obj;
                };
                _.isBoolean = function(obj) {
                    return obj === true || obj === false || toString.call(obj) == "[object Boolean]";
                };
                _.isNull = function(obj) {
                    return obj === null;
                };
                _.isUndefined = function(obj) {
                    return obj === void 0;
                };
                _.has = function(obj, key) {
                    return hasOwnProperty.call(obj, key);
                };
                _.noConflict = function() {
                    root._ = previousUnderscore;
                    return this;
                };
                _.identity = function(value) {
                    return value;
                };
                _.times = function(n, iterator, context) {
                    var accum = Array(Math.max(0, n));
                    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
                    return accum;
                };
                _.random = function(min, max) {
                    if (max == null) {
                        max = min;
                        min = 0;
                    }
                    return min + Math.floor(Math.random() * (max - min + 1));
                };
                var entityMap = {
                    escape: {
                        "&": "&amp;",
                        "<": "&lt;",
                        ">": "&gt;",
                        '"': "&quot;",
                        "'": "&#x27;"
                    }
                };
                entityMap.unescape = _.invert(entityMap.escape);
                var entityRegexes = {
                    escape: new RegExp("[" + _.keys(entityMap.escape).join("") + "]", "g"),
                    unescape: new RegExp("(" + _.keys(entityMap.unescape).join("|") + ")", "g")
                };
                _.each([ "escape", "unescape" ], function(method) {
                    _[method] = function(string) {
                        if (string == null) return "";
                        return ("" + string).replace(entityRegexes[method], function(match) {
                            return entityMap[method][match];
                        });
                    };
                });
                _.result = function(object, property) {
                    if (object == null) return void 0;
                    var value = object[property];
                    return _.isFunction(value) ? value.call(object) : value;
                };
                _.mixin = function(obj) {
                    each(_.functions(obj), function(name) {
                        var func = _[name] = obj[name];
                        _.prototype[name] = function() {
                            var args = [ this._wrapped ];
                            push.apply(args, arguments);
                            return result.call(this, func.apply(_, args));
                        };
                    });
                };
                var idCounter = 0;
                _.uniqueId = function(prefix) {
                    var id = ++idCounter + "";
                    return prefix ? prefix + id : id;
                };
                _.templateSettings = {
                    evaluate: /<%([\s\S]+?)%>/g,
                    interpolate: /<%=([\s\S]+?)%>/g,
                    escape: /<%-([\s\S]+?)%>/g
                };
                var noMatch = /(.)^/;
                var escapes = {
                    "'": "'",
                    "\\": "\\",
                    "\r": "r",
                    "\n": "n",
                    "	": "t",
                    "\u2028": "u2028",
                    "\u2029": "u2029"
                };
                var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
                _.template = function(text, data, settings) {
                    var render;
                    settings = _.defaults({}, settings, _.templateSettings);
                    var matcher = new RegExp([ (settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source ].join("|") + "|$", "g");
                    var index = 0;
                    var source = "__p+='";
                    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
                        source += text.slice(index, offset).replace(escaper, function(match) {
                            return "\\" + escapes[match];
                        });
                        if (escape) {
                            source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
                        }
                        if (interpolate) {
                            source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
                        }
                        if (evaluate) {
                            source += "';\n" + evaluate + "\n__p+='";
                        }
                        index = offset + match.length;
                        return match;
                    });
                    source += "';\n";
                    if (!settings.variable) source = "with(obj||{}){\n" + source + "}\n";
                    source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n";
                    try {
                        render = new Function(settings.variable || "obj", "_", source);
                    } catch (e) {
                        e.source = source;
                        throw e;
                    }
                    if (data) return render(data, _);
                    var template = function(data) {
                        return render.call(this, data, _);
                    };
                    template.source = "function(" + (settings.variable || "obj") + "){\n" + source + "}";
                    return template;
                };
                _.chain = function(obj) {
                    return _(obj).chain();
                };
                var result = function(obj) {
                    return this._chain ? _(obj).chain() : obj;
                };
                _.mixin(_);
                each([ "pop", "push", "reverse", "shift", "sort", "splice", "unshift" ], function(name) {
                    var method = ArrayProto[name];
                    _.prototype[name] = function() {
                        var obj = this._wrapped;
                        method.apply(obj, arguments);
                        if ((name == "shift" || name == "splice") && obj.length === 0) delete obj[0];
                        return result.call(this, obj);
                    };
                });
                each([ "concat", "join", "slice" ], function(name) {
                    var method = ArrayProto[name];
                    _.prototype[name] = function() {
                        return result.call(this, method.apply(this._wrapped, arguments));
                    };
                });
                _.extend(_.prototype, {
                    chain: function() {
                        this._chain = true;
                        return this;
                    },
                    value: function() {
                        return this._wrapped;
                    }
                });
            }).call(this);
        }, {} ],
        5: [ function(require, module, exports) {
            (function(root) {
                var _ = root._ || require("underscore");
                var slice = Array.prototype.slice, concat = Array.prototype.concat;
                var existy = function(x) {
                    return x != null;
                };
                _.mixin({
                    cat: function() {
                        return _.reduce(arguments, function(acc, elem) {
                            if (_.isArguments(elem)) {
                                return concat.call(acc, slice.call(elem));
                            } else {
                                return concat.call(acc, elem);
                            }
                        }, []);
                    },
                    cons: function(head, tail) {
                        return _.cat([ head ], tail);
                    },
                    partition: function(array, n, pad) {
                        var p = function(array) {
                            if (array == null) return [];
                            var part = _.take(array, n);
                            if (n === _.size(part)) {
                                return _.cons(part, p(_.drop(array, n)));
                            } else {
                                return pad ? [ _.take(_.cat(part, pad), n) ] : [];
                            }
                        };
                        return p(array);
                    },
                    partitionAll: function(array, n, step) {
                        step = step != null ? step : n;
                        var p = function(array, n, step) {
                            if (_.isEmpty(array)) return [];
                            return _.cons(_.take(array, n), p(_.drop(array, step), n, step));
                        };
                        return p(array, n, step);
                    },
                    mapcat: function(array, fun) {
                        return _.cat.apply(null, _.map(array, fun));
                    },
                    interpose: function(array, inter) {
                        if (!_.isArray(array)) throw new TypeError();
                        var sz = _.size(array);
                        if (sz === 0) return array;
                        if (sz === 1) return array;
                        return slice.call(_.mapcat(array, function(elem) {
                            return _.cons(elem, [ inter ]);
                        }), 0, -1);
                    },
                    weave: function() {
                        if (!_.some(arguments)) return [];
                        if (arguments.length == 1) return arguments[0];
                        return _.filter(_.flatten(_.zip.apply(null, arguments), true), function(elem) {
                            return elem != null;
                        });
                    },
                    interleave: _.weave,
                    repeat: function(t, elem) {
                        return _.times(t, function() {
                            return elem;
                        });
                    },
                    cycle: function(t, elems) {
                        return _.flatten(_.times(t, function() {
                            return elems;
                        }), true);
                    },
                    splitAt: function(array, index) {
                        return [ _.take(array, index), _.drop(array, index) ];
                    },
                    iterateUntil: function(doit, checkit, seed) {
                        var ret = [];
                        var result = doit(seed);
                        while (checkit(result)) {
                            ret.push(result);
                            result = doit(result);
                        }
                        return ret;
                    },
                    takeSkipping: function(array, n) {
                        var ret = [];
                        var sz = _.size(array);
                        if (n <= 0) return [];
                        if (n === 1) return array;
                        for (var index = 0; index < sz; index += n) {
                            ret.push(array[index]);
                        }
                        return ret;
                    },
                    reductions: function(array, fun, init) {
                        var ret = [];
                        var acc = init;
                        _.each(array, function(v, k) {
                            acc = fun(acc, array[k]);
                            ret.push(acc);
                        });
                        return ret;
                    },
                    keepIndexed: function(array, pred) {
                        return _.filter(_.map(_.range(_.size(array)), function(i) {
                            return pred(i, array[i]);
                        }), existy);
                    },
                    reverseOrder: function(obj) {
                        if (typeof obj == "string") throw new TypeError("Strings cannot be reversed by _.reverseOrder");
                        return slice.call(obj).reverse();
                    }
                });
            })(this);
        }, {
            underscore: 4
        } ],
        6: [ function(require, module, exports) {
            (function(root) {
                var _ = root._ || require("underscore");
                var slice = Array.prototype.slice, concat = Array.prototype.concat;
                var existy = function(x) {
                    return x != null;
                };
                var truthy = function(x) {
                    return x !== false && existy(x);
                };
                var isSeq = function(x) {
                    return _.isArray(x) || _.isArguments(x);
                };
                _.mixin({
                    second: function(array, n, guard) {
                        if (array == null) return void 0;
                        return n != null && !guard ? slice.call(array, 1, n) : array[1];
                    },
                    third: function(array, n, guard) {
                        if (array == null) return void 0;
                        return n != null && !guard ? slice.call(array, 2, n) : array[2];
                    },
                    nth: function(array, index, guard) {
                        if (index != null && !guard) return array[index];
                    },
                    takeWhile: function(array, pred) {
                        if (!isSeq(array)) throw new TypeError();
                        var sz = _.size(array);
                        for (var index = 0; index < sz; index++) {
                            if (!truthy(pred(array[index]))) {
                                break;
                            }
                        }
                        return _.take(array, index);
                    },
                    dropWhile: function(array, pred) {
                        if (!isSeq(array)) throw new TypeError();
                        var sz = _.size(array);
                        for (var index = 0; index < sz; index++) {
                            if (!truthy(pred(array[index]))) break;
                        }
                        return _.drop(array, index);
                    },
                    splitWith: function(array, pred) {
                        return [ _.takeWhile(array, pred), _.dropWhile(array, pred) ];
                    },
                    partitionBy: function(array, fun) {
                        if (_.isEmpty(array) || !existy(array)) return [];
                        var fst = _.first(array);
                        var fstVal = fun(fst);
                        var run = concat.call([ fst ], _.takeWhile(_.rest(array), function(e) {
                            return _.isEqual(fstVal, fun(e));
                        }));
                        return concat.call([ run ], _.partitionBy(_.drop(array, _.size(run)), fun));
                    },
                    best: function(array, fun) {
                        return _.reduce(array, function(x, y) {
                            return fun(x, y) ? x : y;
                        });
                    },
                    keep: function(array, fun) {
                        if (!isSeq(array)) throw new TypeError("expected an array as the first argument");
                        return _.filter(_.map(array, function(e) {
                            return fun(e);
                        }), existy);
                    }
                });
            })(this);
        }, {
            underscore: 4
        } ],
        7: [ function(require, module, exports) {
            (function(root) {
                var _ = root._ || require("underscore");
                var stopRecursion = {};
                var stopWalk = {};
                var notTreeError = "Not a tree: same object found in two different branches";
                function defaultTraversal(obj) {
                    return _.isElement(obj) ? obj.children : obj;
                }
                function walkImpl(root, traversalStrategy, beforeFunc, afterFunc, context, collectResults) {
                    var visited = [];
                    return function _walk(value, key, parent) {
                        if (_.isObject(value)) {
                            if (visited.indexOf(value) >= 0) throw new TypeError(notTreeError);
                            visited.push(value);
                        }
                        if (beforeFunc) {
                            var result = beforeFunc.call(context, value, key, parent);
                            if (result === stopWalk) return stopWalk;
                            if (result === stopRecursion) return;
                        }
                        var subResults;
                        var target = traversalStrategy(value);
                        if (_.isObject(target) && !_.isEmpty(target)) {
                            if (collectResults) subResults = _.isArray(value) ? [] : {};
                            var stop = _.any(target, function(obj, key) {
                                var result = _walk(obj, key, value);
                                if (result === stopWalk) return true;
                                if (subResults) subResults[key] = result;
                            });
                            if (stop) return stopWalk;
                        }
                        if (afterFunc) return afterFunc.call(context, value, key, parent, subResults);
                    }(root);
                }
                function pluck(obj, propertyName, recursive) {
                    var results = [];
                    this.preorder(obj, function(value, key) {
                        if (!recursive && key == propertyName) return stopRecursion;
                        if (_.has(value, propertyName)) results[results.length] = value[propertyName];
                    });
                    return results;
                }
                var exports = {
                    find: function(obj, visitor, context) {
                        var result;
                        this.preorder(obj, function(value, key, parent) {
                            if (visitor.call(context, value, key, parent)) {
                                result = value;
                                return stopWalk;
                            }
                        }, context);
                        return result;
                    },
                    filter: function(obj, strategy, visitor, context) {
                        var results = [];
                        if (obj == null) return results;
                        strategy(obj, function(value, key, parent) {
                            if (visitor.call(context, value, key, parent)) results.push(value);
                        }, null, this._traversalStrategy);
                        return results;
                    },
                    reject: function(obj, strategy, visitor, context) {
                        return this.filter(obj, strategy, function(value, key, parent) {
                            return !visitor.call(context, value, key, parent);
                        });
                    },
                    map: function(obj, strategy, visitor, context) {
                        var results = [];
                        strategy(obj, function(value, key, parent) {
                            results[results.length] = visitor.call(context, value, key, parent);
                        }, null, this._traversalStrategy);
                        return results;
                    },
                    pluck: function(obj, propertyName) {
                        return pluck.call(this, obj, propertyName, false);
                    },
                    pluckRec: function(obj, propertyName) {
                        return pluck.call(this, obj, propertyName, true);
                    },
                    postorder: function(obj, visitor, context, traversalStrategy) {
                        traversalStrategy = traversalStrategy || this._traversalStrategy;
                        walkImpl(obj, traversalStrategy, null, visitor, context);
                    },
                    preorder: function(obj, visitor, context, traversalStrategy) {
                        traversalStrategy = traversalStrategy || this._traversalStrategy;
                        walkImpl(obj, traversalStrategy, visitor, null, context);
                    },
                    reduce: function(obj, visitor, leafMemo, context) {
                        var reducer = function(value, key, parent, subResults) {
                            return visitor(subResults || leafMemo, value, key, parent);
                        };
                        return walkImpl(obj, this._traversalStrategy, null, reducer, context, true);
                    }
                };
                exports.collect = exports.map;
                exports.detect = exports.find;
                exports.select = exports.filter;
                _.walk = function(traversalStrategy) {
                    var walker = _.clone(exports);
                    _.bindAll.apply(null, [ walker ].concat(_.keys(walker)));
                    walker._traversalStrategy = traversalStrategy || defaultTraversal;
                    return walker;
                };
                _.extend(_.walk, _.walk());
            })(this);
        }, {
            underscore: 4
        } ],
        8: [ function(require, module, exports) {
            (function(root) {
                var _ = root._ || require("underscore");
                function enforcesUnary(fn) {
                    return function mustBeUnary() {
                        if (arguments.length === 1) {
                            return fn.apply(this, arguments);
                        } else throw new RangeError("Only a single argument may be accepted.");
                    };
                }
                var curry = function() {
                    function collectArgs(func, that, argCount, args, newArg, reverse) {
                        if (reverse === true) {
                            args.unshift(newArg);
                        } else {
                            args.push(newArg);
                        }
                        if (args.length == argCount) {
                            return func.apply(that, args);
                        } else {
                            return enforcesUnary(function() {
                                return collectArgs(func, that, argCount, args.slice(0), arguments[0], reverse);
                            });
                        }
                    }
                    return function curry(func, reverse) {
                        var that = this;
                        return enforcesUnary(function() {
                            return collectArgs(func, that, func.length, [], arguments[0], reverse);
                        });
                    };
                }();
                var enforce = function() {
                    var CACHE = [];
                    return function enforce(func) {
                        if (typeof func !== "function") {
                            throw new Error("Argument 1 must be a function.");
                        }
                        var funcLength = func.length;
                        if (CACHE[funcLength] === undefined) {
                            CACHE[funcLength] = function(enforceFunc) {
                                return function() {
                                    if (arguments.length !== funcLength) {
                                        throw new RangeError(funcLength + " arguments must be applied.");
                                    }
                                    return enforceFunc.apply(this, arguments);
                                };
                            };
                        }
                        return CACHE[funcLength](func);
                    };
                }();
                _.mixin({
                    fix: function(fun) {
                        var fixArgs = _.rest(arguments);
                        var f = function() {
                            var args = fixArgs.slice();
                            var arg = 0;
                            for (var i = 0; i < args.length || arg < arguments.length; i++) {
                                if (args[i] === _) {
                                    args[i] = arguments[arg++];
                                }
                            }
                            return fun.apply(null, args);
                        };
                        f._original = fun;
                        return f;
                    },
                    unary: function(fun) {
                        return function unary(a) {
                            return fun.call(this, a);
                        };
                    },
                    binary: function(fun) {
                        return function binary(a, b) {
                            return fun.call(this, a, b);
                        };
                    },
                    ternary: function(fun) {
                        return function ternary(a, b, c) {
                            return fun.call(this, a, b, c);
                        };
                    },
                    quaternary: function(fun) {
                        return function quaternary(a, b, c, d) {
                            return fun.call(this, a, b, c, d);
                        };
                    },
                    curry: curry,
                    rCurry: function(func) {
                        return curry.call(this, func, true);
                    },
                    curry2: function(fun) {
                        return enforcesUnary(function curried(first) {
                            return enforcesUnary(function(last) {
                                return fun.call(this, first, last);
                            });
                        });
                    },
                    curry3: function(fun) {
                        return enforcesUnary(function(first) {
                            return enforcesUnary(function(second) {
                                return enforcesUnary(function(last) {
                                    return fun.call(this, first, second, last);
                                });
                            });
                        });
                    },
                    rcurry2: function(fun) {
                        return enforcesUnary(function(last) {
                            return enforcesUnary(function(first) {
                                return fun.call(this, first, last);
                            });
                        });
                    },
                    rcurry3: function(fun) {
                        return enforcesUnary(function(last) {
                            return enforcesUnary(function(second) {
                                return enforcesUnary(function(first) {
                                    return fun.call(this, first, second, last);
                                });
                            });
                        });
                    },
                    enforce: enforce
                });
                _.arity = function() {
                    var FUNCTIONS = {};
                    return function arity(numberOfArgs, fun) {
                        if (FUNCTIONS[numberOfArgs] == null) {
                            var parameters = new Array(numberOfArgs);
                            for (var i = 0; i < numberOfArgs; ++i) {
                                parameters[i] = "__" + i;
                            }
                            var pstr = parameters.join();
                            var code = "return function (" + pstr + ") { return fun.apply(this, arguments); };";
                            FUNCTIONS[numberOfArgs] = new Function([ "fun" ], code);
                        }
                        if (fun == null) {
                            return function(fun) {
                                return arity(numberOfArgs, fun);
                            };
                        } else return FUNCTIONS[numberOfArgs](fun);
                    };
                }();
            })(this);
        }, {
            underscore: 4
        } ],
        9: [ function(require, module, exports) {
            (function(root) {
                var _ = root._ || require("underscore");
                var existy = function(x) {
                    return x != null;
                };
                var truthy = function(x) {
                    return x !== false && existy(x);
                };
                var __reverse = [].reverse;
                var __slice = [].slice;
                var __map = [].map;
                var curry2 = function(fun) {
                    return function curried(first, optionalLast) {
                        if (arguments.length === 1) {
                            return function(last) {
                                return fun(first, last);
                            };
                        } else return fun(first, optionalLast);
                    };
                };
                function baseMapArgs(fun, mapFun) {
                    return _.arity(fun.length, function() {
                        return fun.apply(this, __map.call(arguments, mapFun));
                    });
                }
                _.mixin({
                    always: function(value) {
                        return function() {
                            return value;
                        };
                    },
                    pipeline: function() {
                        var funs = _.isArray(arguments[0]) ? arguments[0] : arguments;
                        return function(seed) {
                            return _.reduce(funs, function(l, r) {
                                return r(l);
                            }, seed);
                        };
                    },
                    conjoin: function() {
                        var preds = arguments;
                        return function(array) {
                            return _.every(array, function(e) {
                                return _.every(preds, function(p) {
                                    return p(e);
                                });
                            });
                        };
                    },
                    disjoin: function() {
                        var preds = arguments;
                        return function(array) {
                            return _.some(array, function(e) {
                                return _.some(preds, function(p) {
                                    return p(e);
                                });
                            });
                        };
                    },
                    comparator: function(fun) {
                        return function(x, y) {
                            if (truthy(fun(x, y))) return -1; else if (truthy(fun(y, x))) return 1; else return 0;
                        };
                    },
                    complement: function(pred) {
                        return function() {
                            return !pred.apply(null, arguments);
                        };
                    },
                    splat: function(fun) {
                        return function(array) {
                            return fun.apply(null, array);
                        };
                    },
                    unsplat: function(fun) {
                        var funLength = fun.length;
                        if (funLength < 1) {
                            return fun;
                        } else if (funLength === 1) {
                            return function() {
                                return fun.call(this, __slice.call(arguments, 0));
                            };
                        } else {
                            return function() {
                                var numberOfArgs = arguments.length, namedArgs = __slice.call(arguments, 0, funLength - 1), numberOfMissingNamedArgs = Math.max(funLength - numberOfArgs - 1, 0), argPadding = new Array(numberOfMissingNamedArgs), variadicArgs = __slice.call(arguments, fun.length - 1);
                                return fun.apply(this, namedArgs.concat(argPadding).concat([ variadicArgs ]));
                            };
                        }
                    },
                    unsplatl: function(fun) {
                        var funLength = fun.length;
                        if (funLength < 1) {
                            return fun;
                        } else if (funLength === 1) {
                            return function() {
                                return fun.call(this, __slice.call(arguments, 0));
                            };
                        } else {
                            return function() {
                                var numberOfArgs = arguments.length, namedArgs = __slice.call(arguments, Math.max(numberOfArgs - funLength + 1, 0)), variadicArgs = __slice.call(arguments, 0, Math.max(numberOfArgs - funLength + 1, 0));
                                return fun.apply(this, [ variadicArgs ].concat(namedArgs));
                            };
                        }
                    },
                    mapArgs: curry2(baseMapArgs),
                    juxt: function() {
                        var funs = arguments;
                        return function() {
                            var args = arguments;
                            return _.map(funs, function(f) {
                                return f.apply(null, args);
                            });
                        };
                    },
                    fnull: function(fun) {
                        var defaults = _.rest(arguments);
                        return function() {
                            var args = _.toArray(arguments);
                            var sz = _.size(defaults);
                            for (var i = 0; i < sz; i++) {
                                if (!existy(args[i])) args[i] = defaults[i];
                            }
                            return fun.apply(null, args);
                        };
                    },
                    flip2: function(fun) {
                        return function() {
                            var flipped = __slice.call(arguments);
                            flipped[0] = arguments[1];
                            flipped[1] = arguments[0];
                            return fun.apply(null, flipped);
                        };
                    },
                    flip: function(fun) {
                        return function() {
                            var reversed = __reverse.call(arguments);
                            return fun.apply(null, reversed);
                        };
                    },
                    functionalize: function(method) {
                        return function(ctx) {
                            return method.apply(ctx, _.rest(arguments));
                        };
                    },
                    methodize: function(func) {
                        return function() {
                            return func.apply(null, _.cons(this, arguments));
                        };
                    },
                    k: _.always,
                    t: _.pipeline
                });
                _.unsplatr = _.unsplat;
                _.mapArgsWith = curry2(_.flip(baseMapArgs));
                _.bound = function(obj, fname) {
                    var fn = obj[fname];
                    if (!_.isFunction(fn)) throw new TypeError("Expected property to be a function");
                    return _.bind(fn, obj);
                };
            })(this);
        }, {
            underscore: 4
        } ],
        10: [ function(require, module, exports) {
            (function(root) {
                var _ = root._ || require("underscore");
                var slice = Array.prototype.slice;
                _.mixin({
                    attempt: function(object, method) {
                        if (object == null) return void 0;
                        var func = object[method];
                        var args = slice.call(arguments, 2);
                        return _.isFunction(func) ? func.apply(object, args) : void 0;
                    }
                });
            })(this);
        }, {
            underscore: 4
        } ],
        11: [ function(require, module, exports) {
            (function(root, undefined) {
                var _ = root._ || require("underscore");
                var HASNTBEENRUN = {};
                function unary(fun) {
                    return function(first) {
                        return fun.call(this, first);
                    };
                }
                function binary(fun) {
                    return function(first, second) {
                        return fun.call(this, first, second);
                    };
                }
                function foldl(iter, binaryFn, seed) {
                    var state, element;
                    if (seed !== void 0) {
                        state = seed;
                    } else {
                        state = iter();
                    }
                    element = iter();
                    while (element != null) {
                        state = binaryFn.call(element, state, element);
                        element = iter();
                    }
                    return state;
                }
                function unfold(seed, unaryFn) {
                    var state = HASNTBEENRUN;
                    return function() {
                        if (state === HASNTBEENRUN) {
                            state = seed;
                        } else if (state != null) {
                            state = unaryFn.call(state, state);
                        }
                        return state;
                    };
                }
                function unfoldWithReturn(seed, unaryFn) {
                    var state = seed, pair, value;
                    return function() {
                        if (state != null) {
                            pair = unaryFn.call(state, state);
                            value = pair[1];
                            state = value != null ? pair[0] : void 0;
                            return value;
                        } else return void 0;
                    };
                }
                function accumulate(iter, binaryFn, initial) {
                    var state = initial;
                    return function() {
                        var element = iter();
                        if (element == null) {
                            return element;
                        } else {
                            if (state === void 0) {
                                state = element;
                            } else {
                                state = binaryFn.call(element, state, element);
                            }
                            return state;
                        }
                    };
                }
                function accumulateWithReturn(iter, binaryFn, initial) {
                    var state = initial, stateAndReturnValue, element;
                    return function() {
                        element = iter();
                        if (element == null) {
                            return element;
                        } else {
                            if (state === void 0) {
                                state = element;
                                return state;
                            } else {
                                stateAndReturnValue = binaryFn.call(element, state, element);
                                state = stateAndReturnValue[0];
                                return stateAndReturnValue[1];
                            }
                        }
                    };
                }
                function map(iter, unaryFn) {
                    return function() {
                        var element;
                        element = iter();
                        if (element != null) {
                            return unaryFn.call(element, element);
                        } else {
                            return void 0;
                        }
                    };
                }
                function mapcat(iter, unaryFn) {
                    var lastIter = null;
                    return function() {
                        var element;
                        var gen;
                        if (lastIter == null) {
                            gen = iter();
                            if (gen == null) {
                                lastIter = null;
                                return void 0;
                            }
                            lastIter = unaryFn.call(gen, gen);
                        }
                        while (element == null) {
                            element = lastIter();
                            if (element == null) {
                                gen = iter();
                                if (gen == null) {
                                    lastIter = null;
                                    return void 0;
                                } else {
                                    lastIter = unaryFn.call(gen, gen);
                                }
                            }
                        }
                        return element;
                    };
                }
                function select(iter, unaryPredicateFn) {
                    return function() {
                        var element;
                        element = iter();
                        while (element != null) {
                            if (unaryPredicateFn.call(element, element)) {
                                return element;
                            }
                            element = iter();
                        }
                        return void 0;
                    };
                }
                function reject(iter, unaryPredicateFn) {
                    return select(iter, function(something) {
                        return !unaryPredicateFn(something);
                    });
                }
                function find(iter, unaryPredicateFn) {
                    return select(iter, unaryPredicateFn)();
                }
                function slice(iter, numberToDrop, numberToTake) {
                    var count = 0;
                    while (numberToDrop-- > 0) {
                        iter();
                    }
                    if (numberToTake != null) {
                        return function() {
                            if (++count <= numberToTake) {
                                return iter();
                            } else {
                                return void 0;
                            }
                        };
                    } else return iter;
                }
                function drop(iter, numberToDrop) {
                    return slice(iter, numberToDrop == null ? 1 : numberToDrop);
                }
                function take(iter, numberToTake) {
                    return slice(iter, 0, numberToTake == null ? 1 : numberToTake);
                }
                function List(array) {
                    var index = 0;
                    return function() {
                        return array[index++];
                    };
                }
                function Tree(array) {
                    var index, myself, state;
                    index = 0;
                    state = [];
                    myself = function() {
                        var element, tempState;
                        element = array[index++];
                        if (element instanceof Array) {
                            state.push({
                                array: array,
                                index: index
                            });
                            array = element;
                            index = 0;
                            return myself();
                        } else if (element === void 0) {
                            if (state.length > 0) {
                                tempState = state.pop();
                                array = tempState.array;
                                index = tempState.index;
                                return myself();
                            } else {
                                return void 0;
                            }
                        } else {
                            return element;
                        }
                    };
                    return myself;
                }
                function K(value) {
                    return function() {
                        return value;
                    };
                }
                function upRange(from, to, by) {
                    return function() {
                        var was;
                        if (from > to) {
                            return void 0;
                        } else {
                            was = from;
                            from = from + by;
                            return was;
                        }
                    };
                }
                function downRange(from, to, by) {
                    return function() {
                        var was;
                        if (from < to) {
                            return void 0;
                        } else {
                            was = from;
                            from = from - by;
                            return was;
                        }
                    };
                }
                function range(from, to, by) {
                    if (from == null) {
                        return upRange(1, Infinity, 1);
                    } else if (to == null) {
                        return upRange(from, Infinity, 1);
                    } else if (by == null) {
                        if (from <= to) {
                            return upRange(from, to, 1);
                        } else return downRange(from, to, 1);
                    } else if (by > 0) {
                        return upRange(from, to, by);
                    } else if (by < 0) {
                        return downRange(from, to, Math.abs(by));
                    } else return k(from);
                }
                var numbers = unary(range);
                _.iterators = {
                    accumulate: accumulate,
                    accumulateWithReturn: accumulateWithReturn,
                    foldl: foldl,
                    reduce: foldl,
                    unfold: unfold,
                    unfoldWithReturn: unfoldWithReturn,
                    map: map,
                    mapcat: mapcat,
                    select: select,
                    reject: reject,
                    filter: select,
                    find: find,
                    slice: slice,
                    drop: drop,
                    take: take,
                    List: List,
                    Tree: Tree,
                    constant: K,
                    K: K,
                    numbers: numbers,
                    range: range
                };
            })(this, void 0);
        }, {
            underscore: 4
        } ],
        12: [ function(require, module, exports) {
            (function(root) {
                var _ = root._ || require("underscore");
                _.mixin({
                    isInstanceOf: function(x, t) {
                        return x instanceof t;
                    },
                    isAssociative: function(x) {
                        return _.isArray(x) || _.isObject(x) || _.isArguments(x);
                    },
                    isIndexed: function(x) {
                        return _.isArray(x) || _.isString(x) || _.isArguments(x);
                    },
                    isSequential: function(x) {
                        return _.isArray(x) || _.isArguments(x);
                    },
                    isPlainObject: function(x) {
                        return _.isObject(x) && x.constructor === root.Object;
                    },
                    isZero: function(x) {
                        return 0 === x;
                    },
                    isEven: function(x) {
                        return _.isFinite(x) && (x & 1) === 0;
                    },
                    isOdd: function(x) {
                        return _.isFinite(x) && !_.isEven(x);
                    },
                    isPositive: function(x) {
                        return x > 0;
                    },
                    isNegative: function(x) {
                        return x < 0;
                    },
                    isValidDate: function(x) {
                        return _.isDate(x) && !_.isNaN(x.getTime());
                    },
                    isNumeric: function(n) {
                        return !isNaN(parseFloat(n)) && isFinite(n);
                    },
                    isInteger: function(i) {
                        return _.isNumeric(i) && i % 1 === 0;
                    },
                    isFloat: function(n) {
                        return _.isNumeric(n) && !_.isInteger(n);
                    },
                    isJSON: function(str) {
                        try {
                            JSON.parse(str);
                        } catch (e) {
                            return false;
                        }
                        return true;
                    },
                    isIncreasing: function() {
                        var count = _.size(arguments);
                        if (count === 1) return true;
                        if (count === 2) return arguments[0] < arguments[1];
                        for (var i = 1; i < count; i++) {
                            if (arguments[i - 1] >= arguments[i]) {
                                return false;
                            }
                        }
                        return true;
                    },
                    isDecreasing: function() {
                        var count = _.size(arguments);
                        if (count === 1) return true;
                        if (count === 2) return arguments[0] > arguments[1];
                        for (var i = 1; i < count; i++) {
                            if (arguments[i - 1] <= arguments[i]) {
                                return false;
                            }
                        }
                        return true;
                    }
                });
            })(this);
        }, {
            underscore: 4
        } ],
        13: [ function(require, module, exports) {
            (function(root) {
                var _ = root._ || require("underscore");
                var slice = Array.prototype.slice, concat = Array.prototype.concat;
                var existy = function(x) {
                    return x != null;
                };
                var truthy = function(x) {
                    return x !== false && existy(x);
                };
                var isAssociative = function(x) {
                    return _.isArray(x) || _.isObject(x);
                };
                var curry2 = function(fun) {
                    return function(last) {
                        return function(first) {
                            return fun(first, last);
                        };
                    };
                };
                _.mixin({
                    merge: function() {
                        var dest = _.some(arguments) ? {} : null;
                        if (truthy(dest)) {
                            _.extend.apply(null, concat.call([ dest ], _.toArray(arguments)));
                        }
                        return dest;
                    },
                    renameKeys: function(obj, kobj) {
                        return _.reduce(kobj, function(o, nu, old) {
                            if (existy(obj[old])) {
                                o[nu] = obj[old];
                                return o;
                            } else return o;
                        }, _.omit.apply(null, concat.call([ obj ], _.keys(kobj))));
                    },
                    snapshot: function(obj) {
                        if (obj == null || typeof obj != "object") {
                            return obj;
                        }
                        var temp = new obj.constructor();
                        for (var key in obj) {
                            if (obj.hasOwnProperty(key)) {
                                temp[key] = _.snapshot(obj[key]);
                            }
                        }
                        return temp;
                    },
                    updatePath: function(obj, fun, ks, defaultValue) {
                        if (!isAssociative(obj)) throw new TypeError("Attempted to update a non-associative object.");
                        if (!existy(ks)) return fun(obj);
                        var deepness = _.isArray(ks);
                        var keys = deepness ? ks : [ ks ];
                        var ret = deepness ? _.snapshot(obj) : _.clone(obj);
                        var lastKey = _.last(keys);
                        var target = ret;
                        _.each(_.initial(keys), function(key) {
                            if (defaultValue && !_.has(target, key)) {
                                target[key] = _.clone(defaultValue);
                            }
                            target = target[key];
                        });
                        target[lastKey] = fun(target[lastKey]);
                        return ret;
                    },
                    setPath: function(obj, value, ks, defaultValue) {
                        if (!existy(ks)) throw new TypeError("Attempted to set a property at a null path.");
                        return _.updatePath(obj, function() {
                            return value;
                        }, ks, defaultValue);
                    },
                    frequencies: curry2(_.countBy)(_.identity)
                });
            })(this);
        }, {
            underscore: 4
        } ],
        14: [ function(require, module, exports) {
            (function(root) {
                var _ = root._ || require("underscore");
                var concat = Array.prototype.concat;
                var ArrayProto = Array.prototype;
                var slice = ArrayProto.slice;
                _.mixin({
                    accessor: function(field) {
                        return function(obj) {
                            return obj && obj[field];
                        };
                    },
                    dictionary: function(obj) {
                        return function(field) {
                            return obj && field && obj[field];
                        };
                    },
                    selectKeys: function(obj, ks) {
                        return _.pick.apply(null, concat.call([ obj ], ks));
                    },
                    kv: function(obj, key) {
                        if (_.has(obj, key)) {
                            return [ key, obj[key] ];
                        }
                        return void 0;
                    },
                    getPath: function getPath(obj, ks) {
                        if (typeof ks == "string") ks = ks.split(".");
                        if (obj === undefined) return void 0;
                        if (ks.length === 0) return obj;
                        if (obj === null) return void 0;
                        return getPath(obj[_.first(ks)], _.rest(ks));
                    },
                    hasPath: function hasPath(obj, ks) {
                        if (typeof ks == "string") ks = ks.split(".");
                        var numKeys = ks.length;
                        if (obj == null && numKeys > 0) return false;
                        if (!(ks[0] in obj)) return false;
                        if (numKeys === 1) return true;
                        return hasPath(obj[_.first(ks)], _.rest(ks));
                    },
                    pickWhen: function(obj, pred) {
                        var copy = {};
                        _.each(obj, function(value, key) {
                            if (pred(obj[key])) copy[key] = obj[key];
                        });
                        return copy;
                    },
                    omitWhen: function(obj, pred) {
                        return _.pickWhen(obj, function(e) {
                            return !pred(e);
                        });
                    }
                });
            })(this);
        }, {
            underscore: 4
        } ],
        15: [ function(require, module, exports) {
            (function(root) {
                var _ = root._ || require("underscore");
                _.mixin({
                    exists: function(x) {
                        return x != null;
                    },
                    truthy: function(x) {
                        return x !== false && _.exists(x);
                    },
                    falsey: function(x) {
                        return !_.truthy(x);
                    },
                    not: function(b) {
                        return !b;
                    },
                    firstExisting: function() {
                        for (var i = 0; i < arguments.length; i++) {
                            if (arguments[i] != null) return arguments[i];
                        }
                    }
                });
            })(this);
        }, {
            underscore: 4
        } ],
        16: [ function(require, module, exports) {
            (function(root) {
                var _ = root._ || require("underscore");
                function variadicMath(operator) {
                    return function() {
                        return _.reduce(arguments, operator);
                    };
                }
                function variadicComparator(comparator) {
                    return function() {
                        var result;
                        for (var i = 0; i < arguments.length - 1; i++) {
                            result = comparator(arguments[i], arguments[i + 1]);
                            if (result === false) return result;
                        }
                        return result;
                    };
                }
                function invert(fn) {
                    return function() {
                        return !fn.apply(this, arguments);
                    };
                }
                function add(x, y) {
                    return x + y;
                }
                function sub(x, y) {
                    return x - y;
                }
                function mul(x, y) {
                    return x * y;
                }
                function div(x, y) {
                    return x / y;
                }
                function mod(x, y) {
                    return x % y;
                }
                function inc(x) {
                    return ++x;
                }
                function dec(x) {
                    return --x;
                }
                function neg(x) {
                    return -x;
                }
                function bitwiseAnd(x, y) {
                    return x & y;
                }
                function bitwiseOr(x, y) {
                    return x | y;
                }
                function bitwiseXor(x, y) {
                    return x ^ y;
                }
                function bitwiseLeft(x, y) {
                    return x << y;
                }
                function bitwiseRight(x, y) {
                    return x >> y;
                }
                function bitwiseZ(x, y) {
                    return x >>> y;
                }
                function bitwiseNot(x) {
                    return ~x;
                }
                function eq(x, y) {
                    return x == y;
                }
                function seq(x, y) {
                    return x === y;
                }
                function not(x) {
                    return !x;
                }
                function gt(x, y) {
                    return x > y;
                }
                function lt(x, y) {
                    return x < y;
                }
                function gte(x, y) {
                    return x >= y;
                }
                function lte(x, y) {
                    return x <= y;
                }
                _.mixin({
                    add: variadicMath(add),
                    sub: variadicMath(sub),
                    mul: variadicMath(mul),
                    div: variadicMath(div),
                    mod: mod,
                    inc: inc,
                    dec: dec,
                    neg: neg,
                    eq: variadicComparator(eq),
                    seq: variadicComparator(seq),
                    neq: invert(variadicComparator(eq)),
                    sneq: invert(variadicComparator(seq)),
                    not: not,
                    gt: variadicComparator(gt),
                    lt: variadicComparator(lt),
                    gte: variadicComparator(gte),
                    lte: variadicComparator(lte),
                    bitwiseAnd: variadicMath(bitwiseAnd),
                    bitwiseOr: variadicMath(bitwiseOr),
                    bitwiseXor: variadicMath(bitwiseXor),
                    bitwiseNot: bitwiseNot,
                    bitwiseLeft: variadicMath(bitwiseLeft),
                    bitwiseRight: variadicMath(bitwiseRight),
                    bitwiseZ: variadicMath(bitwiseZ)
                });
            })(this);
        }, {
            underscore: 4
        } ],
        17: [ function(require, module, exports) {
            (function(root) {
                var _ = root._ || require("underscore");
                _.mixin({
                    explode: function(s) {
                        return s.split("");
                    },
                    implode: function(a) {
                        return a.join("");
                    },
                    camelCase: function(string) {
                        return string.replace(/-([a-z])/g, function(g) {
                            return g[1].toUpperCase();
                        });
                    },
                    toDash: function(string) {
                        string = string.replace(/([A-Z])/g, function($1) {
                            return "-" + $1.toLowerCase();
                        });
                        return string.charAt(0) == "-" ? string.substr(1) : string;
                    },
                    strContains: function(str, search) {
                        if (typeof str != "string") throw new TypeError();
                        return str.indexOf(search) != -1;
                    }
                });
            })(this);
        }, {
            underscore: 4
        } ],
        18: [ function(require, module, exports) {
            (function(root) {
                var _ = root._ || require("underscore");
                _.mixin({
                    done: function(value) {
                        var ret = _(value);
                        ret.stopTrampoline = true;
                        return ret;
                    },
                    trampoline: function(fun) {
                        var result = fun.apply(fun, _.rest(arguments));
                        while (_.isFunction(result)) {
                            result = result();
                            if (result instanceof _ && result.stopTrampoline) break;
                        }
                        return result.value();
                    }
                });
            })(this);
        }, {
            underscore: 4
        } ],
        19: [ function(require, module, exports) {
            var global = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};
            !function(t) {
                if ("object" == typeof exports) module.exports = t(); else if ("function" == typeof define && define.amd) define(t); else {
                    var e;
                    "undefined" != typeof window ? e = window : "undefined" != typeof global ? e = global : "undefined" != typeof self && (e = self), 
                    e.questor = t();
                }
            }(function() {
                return function t(e, r, i) {
                    function n(s, a) {
                        if (!r[s]) {
                            if (!e[s]) {
                                var u = "function" == typeof require && require;
                                if (!a && u) return u(s, !0);
                                if (o) return o(s, !0);
                                throw new Error("Cannot find module '" + s + "'");
                            }
                            var c = r[s] = {
                                exports: {}
                            };
                            e[s][0].call(c.exports, function(t) {
                                var r = e[s][1][t];
                                return n(r ? r : t);
                            }, c, c.exports, t, e, r, i);
                        }
                        return r[s].exports;
                    }
                    for (var o = "function" == typeof require && require, s = 0; s < i.length; s++) n(i[s]);
                    return n;
                }({
                    1: [ function(t, e) {
                        "use strict";
                        function r(t, e) {
                            return e || (e = {}), o({
                                headers: e.headers,
                                method: e.method,
                                uri: t
                            }).spread(function(t) {
                                var e = {
                                    body: t.body,
                                    headers: i(t.getAllResponseHeaders()),
                                    status: t.statusCode
                                };
                                if (e.status >= 300) {
                                    var r = new Error(e.body);
                                    throw r.body = e.body, r.headers = e.headers, r.status = e.status, r;
                                }
                                return e;
                            });
                        }
                        function i(t) {
                            var e = {};
                            if (!t) return e;
                            for (var r = t.split("\r\n"), i = 0; i < r.length; i++) {
                                var n = r[i], o = n.indexOf(": ") || n.indexOf(":");
                                if (o > 0) {
                                    var s = n.substring(0, o), a = n.substring(o + 2);
                                    e[s] = a;
                                }
                            }
                            return e;
                        }
                        var n = t("bluebird"), o = n.promisify(t("xhr"));
                        e.exports = r;
                    }, {
                        bluebird: 5,
                        xhr: 41
                    } ],
                    2: [ function(t, e) {
                        "use strict";
                        e.exports = function(e, r, i) {
                            function n(t, e, i) {
                                var n = r(t, o, i, e === !0 && t._isBound() ? t._boundTo : void 0), s = n.promise();
                                return s.isRejected() ? s : (n.setHowMany(1), n.setUnwrap(), n.init(), s);
                            }
                            {
                                var o = t("./some_promise_array.js")(i);
                                t("./assert.js");
                            }
                            e.any = function(t) {
                                return n(t, !1, e.any);
                            }, e.prototype.any = function() {
                                return n(this, !0, this.any);
                            };
                        };
                    }, {
                        "./assert.js": 3,
                        "./some_promise_array.js": 36
                    } ],
                    3: [ function(t, e) {
                        "use strict";
                        e.exports = function() {
                            var t = function() {
                                function t(t) {
                                    this.constructor$(t), this.message = t, this.name = "AssertionError";
                                }
                                return t.prototype = new Error(), t.prototype.constructor = t, t.prototype.constructor$ = Error, 
                                t;
                            }();
                            return function e(r, i) {
                                if (r !== !0) {
                                    var n = new t(i);
                                    throw Error.captureStackTrace && Error.captureStackTrace(n, e), console && console.error && console.error(n.stack + ""), 
                                    n;
                                }
                            };
                        }();
                    }, {} ],
                    4: [ function(t, e) {
                        "use strict";
                        function r() {
                            this._isTickUsed = !1, this._length = 0, this._lateBuffer = new n(), this._functionBuffer = new n(75e3);
                            var t = this;
                            this.consumeFunctionBuffer = function() {
                                t._consumeFunctionBuffer();
                            };
                        }
                        var i = (t("./assert.js"), t("./schedule.js")), n = t("./queue.js"), o = t("./util.js").errorObj, s = t("./util.js").tryCatch1;
                        r.prototype.haveItemsQueued = function() {
                            return this._length > 0;
                        }, r.prototype.invokeLater = function(t, e, r) {
                            this._lateBuffer.push(t, e, r), this._queueTick();
                        }, r.prototype.invoke = function(t, e, r) {
                            var i = this._functionBuffer;
                            i.push(t, e, r), this._length = i.length(), this._queueTick();
                        }, r.prototype._consumeFunctionBuffer = function() {
                            for (var t = this._functionBuffer; t.length() > 0; ) {
                                var e = t.shift(), r = t.shift(), i = t.shift();
                                e.call(r, i);
                            }
                            this._reset(), this._consumeLateBuffer();
                        }, r.prototype._consumeLateBuffer = function() {
                            for (var t = this._lateBuffer; t.length() > 0; ) {
                                var e = t.shift(), r = t.shift(), i = t.shift(), n = s(e, r, i);
                                if (n === o) throw this._queueTick(), n.e;
                            }
                        }, r.prototype._queueTick = function() {
                            this._isTickUsed || (i(this.consumeFunctionBuffer), this._isTickUsed = !0);
                        }, r.prototype._reset = function() {
                            this._isTickUsed = !1, this._length = 0;
                        }, e.exports = new r();
                    }, {
                        "./assert.js": 3,
                        "./queue.js": 29,
                        "./schedule.js": 32,
                        "./util.js": 40
                    } ],
                    5: [ function(t, e) {
                        "use strict";
                        var r = t("./promise.js")();
                        e.exports = r;
                    }, {
                        "./promise.js": 21
                    } ],
                    6: [ function(t, e) {
                        "use strict";
                        e.exports = function(t) {
                            function e(t) {
                                var e = "string" == typeof this ? this : "" + this;
                                return t[e];
                            }
                            t.prototype.call = function(t) {
                                for (var e = arguments.length, r = new Array(e - 1), i = 1; e > i; ++i) r[i - 1] = arguments[i];
                                return this._then(function(e) {
                                    return e[t].apply(e, r);
                                }, void 0, void 0, void 0, void 0, this.call);
                            }, t.prototype.get = function(t) {
                                return this._then(e, void 0, void 0, t, void 0, this.get);
                            };
                        };
                    }, {} ],
                    7: [ function(t, e) {
                        "use strict";
                        e.exports = function(e, r) {
                            var i = t("./errors.js"), n = t("./async.js"), o = (t("./assert.js"), i.CancellationError), s = {};
                            e.prototype._cancel = function() {
                                if (!this.isCancellable()) return this;
                                var t;
                                if (void 0 !== (t = this._cancellationParent)) return void t.cancel(s);
                                var e = new o();
                                this._attachExtraTrace(e), this._rejectUnchecked(e);
                            }, e.prototype.cancel = function(t) {
                                return this.isCancellable() ? t === s ? (this._cancel(), this) : (n.invokeLater(this._cancel, this, void 0), 
                                this) : this;
                            }, e.prototype.cancellable = function() {
                                return this._cancellable() ? this : (this._setCancellable(), this._cancellationParent = void 0, 
                                this);
                            }, e.prototype.uncancellable = function() {
                                var t = new e(r);
                                return t._setTrace(this.uncancellable, this), t._follow(this), t._unsetCancellable(), 
                                this._isBound() && t._setBoundTo(this._boundTo), t;
                            }, e.prototype.fork = function(t, e, r) {
                                var i = this._then(t, e, r, void 0, void 0, this.fork);
                                return i._setCancellable(), i._cancellationParent = void 0, i;
                            };
                        };
                    }, {
                        "./assert.js": 3,
                        "./async.js": 4,
                        "./errors.js": 11
                    } ],
                    8: [ function(t, e) {
                        "use strict";
                        e.exports = function() {
                            function e(t) {
                                var e;
                                if ("function" == typeof t) e = "[function " + (t.name || "anonymous") + "]"; else {
                                    e = t.toString();
                                    var i = /\[object [a-zA-Z0-9$_]+\]/;
                                    if (i.test(e)) try {
                                        var n = JSON.stringify(t);
                                        e = n;
                                    } catch (o) {}
                                    0 === e.length && (e = "(empty array)");
                                }
                                return "(<" + r(e) + ">, no stack trace)";
                            }
                            function r(t) {
                                var e = 41;
                                return t.length < e ? t : t.substr(0, e - 3) + "...";
                            }
                            function i(t, e) {
                                this.captureStackTrace(t, e);
                            }
                            var n = (t("./assert.js"), t("./util.js").inherits), o = t("./es5.js").defineProperty, s = new RegExp("\\b(?:[\\w.]*Promise(?:Array|Spawn)?\\$_\\w+|tryCatch(?:1|2|Apply)|new \\w*PromiseArray|\\w*PromiseArray\\.\\w*PromiseArray|setTimeout|CatchFilter\\$_\\w+|makeNodePromisified|processImmediate|process._tickCallback|nextTick|Async\\$\\w+)\\b"), a = null, u = null, c = !1;
                            n(i, Error), i.prototype.captureStackTrace = function(t, e) {
                                l(this, t, e);
                            }, i.possiblyUnhandledRejection = function(t) {
                                if ("object" == typeof console) {
                                    var e;
                                    if ("object" == typeof t || "function" == typeof t) {
                                        var r = t.stack;
                                        e = "Possibly unhandled " + u(r, t);
                                    } else e = "Possibly unhandled " + String(t);
                                    "function" == typeof console.error || "object" == typeof console.error ? console.error(e) : ("function" == typeof console.log || "object" == typeof console.error) && console.log(e);
                                }
                            }, c = "CapturedTrace$captureStackTrace" !== i.prototype.captureStackTrace.name, 
                            i.combine = function(t, e) {
                                for (var r = t.length - 1, i = e.length - 1; i >= 0; --i) {
                                    var n = e[i];
                                    if (t[r] !== n) break;
                                    t.pop(), r--;
                                }
                                t.push("From previous event:");
                                for (var o = t.concat(e), u = [], i = 0, c = o.length; c > i; ++i) s.test(o[i]) || i > 0 && !a.test(o[i]) && "From previous event:" !== o[i] || u.push(o[i]);
                                return u;
                            }, i.isSupported = function() {
                                return "function" == typeof l;
                            };
                            var l = function f() {
                                if ("number" == typeof Error.stackTraceLimit && "function" == typeof Error.captureStackTrace) {
                                    a = /^\s*at\s*/, u = function(t, r) {
                                        return "string" == typeof t ? t : void 0 !== r.name && void 0 !== r.message ? r.name + ". " + r.message : e(r);
                                    };
                                    var t = Error.captureStackTrace;
                                    return function(e, r) {
                                        t(e, r);
                                    };
                                }
                                var r = new Error();
                                if (!c && "string" == typeof r.stack && "function" == typeof "".startsWith && r.stack.startsWith("stackDetection@") && "stackDetection" === f.name) {
                                    o(Error, "stackTraceLimit", {
                                        writable: !0,
                                        enumerable: !1,
                                        configurable: !1,
                                        value: 25
                                    }), a = /@/;
                                    var i = /[@\n]/;
                                    return u = function(t, r) {
                                        return "string" == typeof t ? r.name + ". " + r.message + "\n" + t : void 0 !== r.name && void 0 !== r.message ? r.name + ". " + r.message : e(r);
                                    }, function(t, e) {
                                        var r, n = e.name, o = new Error().stack, s = o.split(i), a = s.length;
                                        for (r = 0; a > r && s[r] !== n; r += 2) ;
                                        s = s.slice(r + 2), a = s.length - 2;
                                        var u = "";
                                        for (r = 0; a > r; r += 2) u += s[r], u += "@", u += s[r + 1], u += "\n";
                                        t.stack = u;
                                    };
                                }
                                return u = function(t, r) {
                                    return "string" == typeof t ? t : "object" != typeof r && "function" != typeof r || void 0 === r.name || void 0 === r.message ? e(r) : r.name + ". " + r.message;
                                }, null;
                            }();
                            return i;
                        };
                    }, {
                        "./assert.js": 3,
                        "./es5.js": 13,
                        "./util.js": 40
                    } ],
                    9: [ function(t, e) {
                        "use strict";
                        e.exports = function(e) {
                            function r(t, e, r) {
                                this._instances = t, this._callback = e, this._promise = r;
                            }
                            function i(t, e) {
                                var r = {}, i = o(t, r, e);
                                if (i === s) return i;
                                var n = a(r);
                                return n.length ? (s.e = new TypeError("Catch filter must inherit from Error or be a simple predicate function"), 
                                s) : i;
                            }
                            var n = t("./util.js"), o = n.tryCatch1, s = n.errorObj, a = t("./es5.js").keys;
                            return r.prototype.doFilter = function(t) {
                                for (var r = this._callback, n = this._promise, a = n._isBound() ? n._boundTo : void 0, u = 0, c = this._instances.length; c > u; ++u) {
                                    var l = this._instances[u], f = l === Error || null != l && l.prototype instanceof Error;
                                    if (f && t instanceof l) {
                                        var p = o(r, a, t);
                                        return p === s ? (e.e = p.e, e) : p;
                                    }
                                    if ("function" == typeof l && !f) {
                                        var h = i(l, t);
                                        if (h === s) {
                                            this._promise._attachExtraTrace(s.e), t = s.e;
                                            break;
                                        }
                                        if (h) {
                                            var p = o(r, a, t);
                                            return p === s ? (e.e = p.e, e) : p;
                                        }
                                    }
                                }
                                return e.e = t, e;
                            }, r;
                        };
                    }, {
                        "./es5.js": 13,
                        "./util.js": 40
                    } ],
                    10: [ function(t, e) {
                        "use strict";
                        var r = t("./util.js"), i = (t("./assert.js"), r.isPrimitive), n = r.wrapsPrimitiveReceiver;
                        e.exports = function(t) {
                            var e = function() {
                                return this;
                            }, r = function() {
                                throw this;
                            }, o = function(t, e) {
                                return 1 === e ? function() {
                                    throw t;
                                } : 2 === e ? function() {
                                    return t;
                                } : void 0;
                            };
                            t.prototype["return"] = t.prototype.thenReturn = function(t) {
                                return n && i(t) ? this._then(o(t, 2), void 0, void 0, void 0, void 0, this.thenReturn) : this._then(e, void 0, void 0, t, void 0, this.thenReturn);
                            }, t.prototype["throw"] = t.prototype.thenThrow = function(t) {
                                return n && i(t) ? this._then(o(t, 1), void 0, void 0, void 0, void 0, this.thenThrow) : this._then(r, void 0, void 0, t, void 0, this.thenThrow);
                            };
                        };
                    }, {
                        "./assert.js": 3,
                        "./util.js": 40
                    } ],
                    11: [ function(t, e) {
                        "use strict";
                        function r(t) {
                            return (1 & t) > 0;
                        }
                        function i(t) {
                            return (2 & t) > 0;
                        }
                        function n(t) {
                            return 1 | t;
                        }
                        function o(t) {
                            return 2 | t;
                        }
                        function s(t) {
                            return -3 & t;
                        }
                        function a(t) {
                            var e;
                            return j(t) && void 0 !== (e = t.__promiseHandled__) && (t.__promiseHandled__ = s(e)), 
                            t;
                        }
                        function u(t) {
                            try {
                                g(t, "__rejectionError__", d);
                            } catch (e) {}
                        }
                        function c(t) {
                            return null == t ? !1 : t instanceof d || t.__rejectionError__ === d;
                        }
                        function l(t) {
                            try {
                                return g(t, "__promiseHandled__", 0), !0;
                            } catch (e) {
                                return !1;
                            }
                        }
                        function f(t) {
                            return t instanceof b;
                        }
                        function p(t) {
                            if (f(t)) {
                                var e = t.__promiseHandled__;
                                return void 0 === e ? l(t) : !r(e);
                            }
                            return !1;
                        }
                        function h(t, e) {
                            function r(r) {
                                this.message = "string" == typeof r ? r : e, this.name = t, b.captureStackTrace && b.captureStackTrace(this, this.constructor);
                            }
                            return m(r, b), r;
                        }
                        function d(t) {
                            this.name = "RejectionError", this.message = t, this.cause = t, t instanceof b ? (this.message = t.message, 
                            this.stack = t.stack) : b.captureStackTrace && b.captureStackTrace(this, this.constructor);
                        }
                        var _ = t("./global.js"), v = t("./es5.js").freeze, y = t("./util.js"), m = y.inherits, j = y.isObject, g = y.notEnumerableProp, b = _.Error, w = _.TypeError;
                        "function" != typeof w && (w = h("TypeError", "type error"));
                        var k = _.RangeError;
                        "function" != typeof k && (k = h("RangeError", "range error"));
                        var x = h("CancellationError", "cancellation error"), T = h("TimeoutError", "timeout error");
                        m(d, b);
                        var P = "__BluebirdErrorTypes__", F = _[P];
                        F || (F = v({
                            CancellationError: x,
                            TimeoutError: T,
                            RejectionError: d
                        }), g(_, P, F)), e.exports = {
                            Error: b,
                            TypeError: w,
                            RangeError: k,
                            CancellationError: F.CancellationError,
                            RejectionError: F.RejectionError,
                            TimeoutError: F.TimeoutError,
                            originatesFromRejection: c,
                            markAsOriginatingFromRejection: u,
                            attachDefaultState: l,
                            ensureNotHandled: a,
                            withHandledUnmarked: s,
                            withHandledMarked: o,
                            withStackAttached: n,
                            isStackAttached: r,
                            isHandled: i,
                            canAttach: p
                        };
                    }, {
                        "./es5.js": 13,
                        "./global.js": 17,
                        "./util.js": 40
                    } ],
                    12: [ function(t, e) {
                        "use strict";
                        e.exports = function(e) {
                            function r(t) {
                                var r = new i(t), n = e.rejected(r), o = n._peekContext();
                                return null != o && o._attachExtraTrace(r), n;
                            }
                            var i = t("./errors.js").TypeError;
                            return r;
                        };
                    }, {
                        "./errors.js": 11
                    } ],
                    13: [ function(t, e) {
                        function r(t) {
                            var e = [];
                            for (var r in t) u.call(t, r) && e.push(r);
                            return e;
                        }
                        function i(t, e, r) {
                            return t[e] = r.value, t;
                        }
                        function n(t) {
                            return t;
                        }
                        function o(t) {
                            try {
                                return Object(t).constructor.prototype;
                            } catch (e) {
                                return l;
                            }
                        }
                        function s(t) {
                            try {
                                return "[object Array]" === c.call(t);
                            } catch (e) {
                                return !1;
                            }
                        }
                        var a = function() {
                            "use strict";
                            return void 0 === this;
                        }();
                        if (a) e.exports = {
                            freeze: Object.freeze,
                            defineProperty: Object.defineProperty,
                            keys: Object.keys,
                            getPrototypeOf: Object.getPrototypeOf,
                            isArray: Array.isArray,
                            isES5: a
                        }; else {
                            var u = {}.hasOwnProperty, c = {}.toString, l = {}.constructor.prototype;
                            e.exports = {
                                isArray: s,
                                keys: r,
                                defineProperty: i,
                                freeze: n,
                                getPrototypeOf: o,
                                isES5: a
                            };
                        }
                    }, {} ],
                    14: [ function(t, e) {
                        "use strict";
                        e.exports = function(e) {
                            function r(t) {
                                for (var e = this._settledValue, r = e.length, i = new Array(r), n = 0, o = 0; r > o; ++o) {
                                    var s = t[o];
                                    (void 0 !== s || o in t) && s && (i[n++] = e[o]);
                                }
                                return i.length = n, i;
                            }
                            var i = (t("./assert.js"), t("./util.js").isArray, {
                                ref: null
                            });
                            e.filter = function(t, n) {
                                return e.map(t, n, i)._then(r, void 0, void 0, i.ref, void 0, e.filter);
                            }, e.prototype.filter = function(t) {
                                return this.map(t, i)._then(r, void 0, void 0, i.ref, void 0, this.filter);
                            };
                        };
                    }, {
                        "./assert.js": 3,
                        "./util.js": 40
                    } ],
                    15: [ function(t, e) {
                        e.exports = function(e, r) {
                            function i() {
                                return this;
                            }
                            function n() {
                                throw l(this), this;
                            }
                            function o(t) {
                                return function() {
                                    return t;
                                };
                            }
                            function s(t) {
                                return function() {
                                    throw l(t), t;
                                };
                            }
                            function a(t, e, r) {
                                var u = f && p(e);
                                return r ? t._then(u ? i : o(e), h, void 0, e, void 0, a) : t._then(u ? n : s(e), h, void 0, e, void 0, a);
                            }
                            function u(t) {
                                var i = this.promise, n = this.handler, o = i._isBound() ? n.call(i._boundTo) : n();
                                if (void 0 !== o) {
                                    var s = e._cast(o, u, void 0);
                                    if (e.is(s)) return a(s, t, i.isFulfilled());
                                }
                                return i.isRejected() ? (l(t), r.e = t, r) : t;
                            }
                            var c = t("./util.js"), l = t("./errors.js").ensureNotHandled, f = c.wrapsPrimitiveReceiver, p = c.isPrimitive, h = c.thrower;
                            e.prototype.lastly = e.prototype["finally"] = function(t) {
                                if ("function" != typeof t) return this.then();
                                var e = {
                                    promise: this,
                                    handler: t
                                };
                                return this._then(u, u, void 0, e, void 0, this.lastly);
                            };
                        };
                    }, {
                        "./errors.js": 11,
                        "./util.js": 40
                    } ],
                    16: [ function(t, e) {
                        "use strict";
                        e.exports = function(e, r, i) {
                            var n = t("./promise_spawn.js")(e, i), o = t("./errors.js"), s = o.TypeError;
                            e.coroutine = function(t) {
                                if ("function" != typeof t) throw new s("generatorFunction must be a function");
                                var e = n;
                                return function r() {
                                    var i = t.apply(this, arguments), n = new e(void 0, void 0, r);
                                    return n._generator = i, n._next(void 0), n.promise();
                                };
                            }, e.spawn = function(t) {
                                if ("function" != typeof t) return r("generatorFunction must be a function");
                                var i = new n(t, this, e.spawn), o = i.promise();
                                return i._run(e.spawn), o;
                            };
                        };
                    }, {
                        "./errors.js": 11,
                        "./promise_spawn.js": 25
                    } ],
                    17: [ function(t, e) {
                        var r = t("__browserify_process"), i = "undefined" != typeof self ? self : "undefined" != typeof window ? window : {};
                        e.exports = function() {
                            return "undefined" != typeof this ? this : "undefined" != typeof r && "undefined" != typeof i && "string" == typeof r.execPath ? i : "undefined" != typeof window && "undefined" != typeof document && "undefined" != typeof navigator && null !== navigator && "string" == typeof navigator.appName ? void 0 !== window.wrappedJSObject ? window.wrappedJSObject : window : void 0;
                        }();
                    }, {
                        __browserify_process: 76
                    } ],
                    18: [ function(t, e) {
                        "use strict";
                        e.exports = function(e, r, i, n) {
                            function o(t) {
                                var n = this, s = void 0;
                                "function" != typeof n && (s = n.receiver, n = n.fn);
                                var a = !1, u = new Array(t.length);
                                if (void 0 === s) {
                                    for (var c = 0, l = t.length; l > c; ++c) if (void 0 !== t[c] || c in t) {
                                        var f = n(t[c], c, l);
                                        if (!a) {
                                            var p = e._cast(f, o, void 0);
                                            if (p instanceof e) {
                                                if (p.isFulfilled()) {
                                                    u[c] = p._settledValue;
                                                    continue;
                                                }
                                                a = !0, f = p;
                                            }
                                        }
                                        u[c] = f;
                                    }
                                } else for (var c = 0, l = t.length; l > c; ++c) if (void 0 !== t[c] || c in t) {
                                    var f = n.call(s, t[c], c, l);
                                    if (!a) {
                                        var p = e._cast(f, o, void 0);
                                        if (p instanceof e) {
                                            if (p.isFulfilled()) {
                                                u[c] = p._settledValue;
                                                continue;
                                            }
                                            a = !0, f = p;
                                        }
                                    }
                                    u[c] = f;
                                }
                                return a ? r(u, i, o, void 0).promise() : u;
                            }
                            function s(t, e, s, a, u) {
                                if ("function" != typeof e) return n("fn must be a function");
                                s === !0 && t._isBound() && (e = {
                                    fn: e,
                                    receiver: t._boundTo
                                });
                                var c = r(t, i, a, s === !0 && t._isBound() ? t._boundTo : void 0).promise();
                                return void 0 !== u && (u.ref = c), c._then(o, void 0, void 0, e, void 0, a);
                            }
                            t("./assert.js");
                            e.prototype.map = function(t, e) {
                                return s(this, t, !0, this.map, e);
                            }, e.map = function(t, r, i) {
                                return s(t, r, !1, e.map, i);
                            };
                        };
                    }, {
                        "./assert.js": 3
                    } ],
                    19: [ function(t, e) {
                        "use strict";
                        e.exports = function(e) {
                            function r(t) {
                                throw t;
                            }
                            function i(t, e) {
                                var i = this, n = a(i, e, null, t);
                                n === c && s.invokeLater(r, void 0, n.e);
                            }
                            function n(t, e) {
                                var i = this, n = u(i, e, t);
                                n === c && s.invokeLater(r, void 0, n.e);
                            }
                            var o = t("./util.js"), s = t("./async.js"), a = (t("./assert.js"), o.tryCatch2), u = o.tryCatch1, c = o.errorObj;
                            e.prototype.nodeify = function(t) {
                                return "function" == typeof t && this._then(i, n, void 0, t, this._isBound() ? this._boundTo : null, this.nodeify), 
                                this;
                            };
                        };
                    }, {
                        "./assert.js": 3,
                        "./async.js": 4,
                        "./util.js": 40
                    } ],
                    20: [ function(t, e) {
                        "use strict";
                        e.exports = function(e, r) {
                            var i = (t("./assert.js"), t("./util.js")), n = t("./async.js"), o = i.tryCatch1, s = i.errorObj;
                            e.prototype.progressed = function(t) {
                                return this._then(void 0, void 0, t, void 0, void 0, this.progressed);
                            }, e.prototype._progress = function(t) {
                                this._isFollowingOrFulfilledOrRejected() || this._progressUnchecked(t);
                            }, e.prototype._progressHandlerAt = function(t) {
                                return 0 === t ? this._progressHandler0 : this[t + 2 - 5];
                            }, e.prototype._doProgressWith = function(t) {
                                var r = t.value, i = t.handler, n = t.promise, a = t.receiver;
                                this._pushContext();
                                var u = o(i, a, r);
                                this._popContext(), u === s ? null != u.e && "StopProgressPropagation" === u.e.name ? u.e.__promiseHandled__ = 2 : (n._attachExtraTrace(u.e), 
                                n._progress(u.e)) : e.is(u) ? u._then(n._progress, null, null, n, void 0, this._progress) : n._progress(u);
                            }, e.prototype._progressUnchecked = function(t) {
                                if (this.isPending()) for (var i = this._length(), o = 0; i > o; o += 5) {
                                    var s = this._progressHandlerAt(o), a = this._promiseAt(o);
                                    if (e.is(a)) "function" == typeof s ? n.invoke(this._doProgressWith, this, {
                                        handler: s,
                                        promise: a,
                                        receiver: this._receiverAt(o),
                                        value: t
                                    }) : n.invoke(a._progress, a, t); else {
                                        var u = this._receiverAt(o);
                                        "function" == typeof s ? s.call(u, t, a) : e.is(u) && u._isProxied() ? u._progressUnchecked(t) : r(u, a) && u._promiseProgressed(t, a);
                                    }
                                }
                            };
                        };
                    }, {
                        "./assert.js": 3,
                        "./async.js": 4,
                        "./util.js": 40
                    } ],
                    21: [ function(t, e) {
                        var r = t("__browserify_process");
                        e.exports = function() {
                            function e(t) {
                                return void 0 === t ? !1 : t instanceof n;
                            }
                            function i(t, e) {
                                return t instanceof d ? e >= 0 : !1;
                            }
                            function n(t) {
                                if ("function" != typeof t) throw new F("the promise constructor requires a resolver function");
                                if (this.constructor !== n) throw new F("the promise constructor cannot be invoked directly");
                                this._bitField = 0, this._fulfillmentHandler0 = void 0, this._rejectionHandler0 = void 0, 
                                this._promise0 = void 0, this._receiver0 = void 0, this._settledValue = void 0, 
                                this._boundTo = void 0, t !== f && this._resolveFromResolver(t);
                            }
                            function o(t, e, r) {
                                return s(t, d, r, e === !0 && t._isBound() ? t._boundTo : void 0).promise();
                            }
                            function s(t, r, i, o) {
                                var a = null;
                                return m(t) ? a = t : (a = n._cast(t, i, void 0), a !== t ? a._setBoundTo(o) : e(a) || (a = null)), 
                                null !== a ? new r(a, "function" == typeof i ? i : s, o) : {
                                    promise: function() {
                                        return q("expecting an array, a promise or a thenable");
                                    }
                                };
                            }
                            var a = t("./global.js"), u = (t("./assert.js"), t("./util.js")), c = t("./async.js"), l = t("./errors.js"), f = function() {}, p = {}, h = {
                                e: null
                            }, d = t("./promise_array.js")(n, f), _ = t("./captured_trace.js")(), v = t("./catch_filter.js")(h), y = t("./promise_resolver.js"), m = u.isArray, j = u.notEnumerableProp, g = u.isObject, b = u.ensurePropertyExpansion, w = u.errorObj, k = u.tryCatch1, x = u.tryCatch2, T = u.tryCatchApply, P = l.RangeError, F = l.TypeError, E = l.CancellationError, R = l.TimeoutError, A = l.RejectionError, C = l.originatesFromRejection, O = l.markAsOriginatingFromRejection, H = l.ensureNotHandled, S = l.withHandledMarked, B = l.withStackAttached, V = l.isStackAttached, M = l.isHandled, U = l.canAttach, L = u.thrower, q = t("./errors_api_rejection")(n), N = function() {
                                return new F("circular promise resolution chain");
                            };
                            n.prototype.bind = function(t) {
                                var e = new n(f);
                                return $ && e._setTrace(this.bind, this), e._follow(this), e._setBoundTo(t), this._cancellable() && (e._setCancellable(), 
                                e._cancellationParent = this), e;
                            }, n.prototype.toString = function() {
                                return "[object Promise]";
                            }, n.prototype.caught = n.prototype["catch"] = function(t) {
                                var e = arguments.length;
                                if (e > 1) {
                                    var r, i = new Array(e - 1), n = 0;
                                    for (r = 0; e - 1 > r; ++r) {
                                        var o = arguments[r];
                                        if ("function" != typeof o) {
                                            var s = new F("A catch filter must be an error constructor or a filter function");
                                            return this._attachExtraTrace(s), void c.invoke(this._reject, this, s);
                                        }
                                        i[n++] = o;
                                    }
                                    i.length = n, t = arguments[r], this._resetTrace(this.caught);
                                    var a = new v(i, t, this);
                                    return this._then(void 0, a.doFilter, void 0, a, void 0, this.caught);
                                }
                                return this._then(void 0, t, void 0, void 0, void 0, this.caught);
                            }, n.prototype.then = function(t, e, r) {
                                return this._then(t, e, r, void 0, void 0, this.then);
                            }, n.prototype.done = function(t, e, r) {
                                var i = this._then(t, e, r, void 0, void 0, this.done);
                                i._setIsFinal();
                            }, n.prototype.spread = function(t, e) {
                                return this._then(t, e, void 0, p, void 0, this.spread);
                            }, n.prototype.isFulfilled = function() {
                                return (268435456 & this._bitField) > 0;
                            }, n.prototype.isRejected = function() {
                                return (134217728 & this._bitField) > 0;
                            }, n.prototype.isPending = function() {
                                return !this.isResolved();
                            }, n.prototype.isResolved = function() {
                                return (402653184 & this._bitField) > 0;
                            }, n.prototype.isCancellable = function() {
                                return !this.isResolved() && this._cancellable();
                            }, n.prototype.toJSON = function() {
                                var t = {
                                    isFulfilled: !1,
                                    isRejected: !1,
                                    fulfillmentValue: void 0,
                                    rejectionReason: void 0
                                };
                                return this.isFulfilled() ? (t.fulfillmentValue = this._settledValue, t.isFulfilled = !0) : this.isRejected() && (t.rejectionReason = this._settledValue, 
                                t.isRejected = !0), t;
                            }, n.prototype.all = function() {
                                return o(this, !0, this.all);
                            }, n.is = e, n.all = function(t) {
                                return o(t, !1, n.all);
                            }, n.join = function() {
                                for (var t = arguments.length, e = new Array(t), r = 0; t > r; ++r) e[r] = arguments[r];
                                return s(e, d, n.join, void 0).promise();
                            }, n.resolve = n.fulfilled = function(t, e) {
                                var r = new n(f);
                                return $ && r._setTrace("function" == typeof e ? e : n.resolve, void 0), r._tryFollow(t) ? r : (r._cleanValues(), 
                                r._setFulfilled(), r._settledValue = t, r);
                            }, n.reject = n.rejected = function(t) {
                                var e = new n(f);
                                return $ && e._setTrace(n.reject, void 0), O(t), e._cleanValues(), e._setRejected(), 
                                e._settledValue = t, e;
                            }, n.prototype.error = function(t) {
                                return this.caught(C, t);
                            }, n.prototype._resolveFromSyncValue = function(t, e) {
                                if (t === w) this._cleanValues(), this._setRejected(), this._settledValue = t.e; else {
                                    var r = n._cast(t, e, void 0);
                                    r instanceof n ? this._follow(r) : (this._cleanValues(), this._setFulfilled(), this._settledValue = t);
                                }
                            }, n.method = function(t) {
                                if ("function" != typeof t) throw new F("fn must be a function");
                                return function e() {
                                    var r;
                                    switch (arguments.length) {
                                      case 0:
                                        r = k(t, this, void 0);
                                        break;

                                      case 1:
                                        r = k(t, this, arguments[0]);
                                        break;

                                      case 2:
                                        r = x(t, this, arguments[0], arguments[1]);
                                        break;

                                      default:
                                        for (var i = arguments.length, o = new Array(i), s = 0; i > s; ++s) o[s] = arguments[s];
                                        r = T(t, o, this);
                                    }
                                    var a = new n(f);
                                    return $ && a._setTrace(e, void 0), a._resolveFromSyncValue(r, e), a;
                                };
                            }, n["try"] = n.attempt = function(t, e, r) {
                                if ("function" != typeof t) return q("fn must be a function");
                                var i = m(e) ? T(t, e, r) : k(t, r, e), o = new n(f);
                                return $ && o._setTrace(n.attempt, void 0), o._resolveFromSyncValue(i, n.attempt), 
                                o;
                            }, n.defer = n.pending = function(t) {
                                var e = new n(f);
                                return $ && e._setTrace("function" == typeof t ? t : n.defer, void 0), new y(e);
                            }, n.bind = function(t) {
                                var e = new n(f);
                                return $ && e._setTrace(n.bind, void 0), e._setFulfilled(), e._setBoundTo(t), e;
                            }, n.cast = function(t, e) {
                                "function" != typeof e && (e = n.cast);
                                var r = n._cast(t, e, void 0);
                                return r instanceof n ? r : n.resolve(r, e);
                            }, n.onPossiblyUnhandledRejection = function(t) {
                                _.possiblyUnhandledRejection = "function" == typeof t ? t : void 0;
                            };
                            var $ = !1 || !("undefined" == typeof r || "string" != typeof r.execPath || "object" != typeof r.env || !r.env.BLUEBIRD_DEBUG && "development" !== r.env.NODE_ENV);
                            n.longStackTraces = function() {
                                if (c.haveItemsQueued() && $ === !1) throw new Error("cannot enable long stack traces after promises have been created");
                                $ = _.isSupported();
                            }, n.hasLongStackTraces = function() {
                                return $ && _.isSupported();
                            }, n.prototype._setProxyHandlers = function(t, e) {
                                var r = this._length();
                                if (r >= 4194298 && (r = 0, this._setLength(0)), 0 === r) this._promise0 = e, this._receiver0 = t; else {
                                    var i = r - 5;
                                    this[i + 3] = e, this[i + 4] = t, this[i + 0] = this[i + 1] = this[i + 2] = void 0;
                                }
                                this._setLength(r + 5);
                            }, n.prototype._proxyPromiseArray = function(t, e) {
                                this._setProxyHandlers(t, e);
                            }, n.prototype._proxyPromise = function(t) {
                                t._setProxied(), this._setProxyHandlers(t, -1);
                            }, n.prototype._then = function(t, e, r, i, o, s) {
                                var a = void 0 !== o, u = a ? o : new n(f);
                                if ($ && !a) {
                                    var l = this._peekContext() === this._traceParent;
                                    u._traceParent = l ? this._traceParent : this, u._setTrace("function" == typeof s ? s : this._then, this);
                                }
                                !a && this._isBound() && u._setBoundTo(this._boundTo);
                                var p = this._addCallbacks(t, e, r, u, i);
                                return !a && this._cancellable() && (u._setCancellable(), u._cancellationParent = this), 
                                this.isResolved() && c.invoke(this._queueSettleAt, this, p), u;
                            }, n.prototype._length = function() {
                                return 4194303 & this._bitField;
                            }, n.prototype._isFollowingOrFulfilledOrRejected = function() {
                                return (939524096 & this._bitField) > 0;
                            }, n.prototype._isFollowing = function() {
                                return 536870912 === (536870912 & this._bitField);
                            }, n.prototype._setLength = function(t) {
                                this._bitField = -4194304 & this._bitField | 4194303 & t;
                            }, n.prototype._cancellable = function() {
                                return (67108864 & this._bitField) > 0;
                            }, n.prototype._setFulfilled = function() {
                                this._bitField = 268435456 | this._bitField;
                            }, n.prototype._setRejected = function() {
                                this._bitField = 134217728 | this._bitField;
                            }, n.prototype._setFollowing = function() {
                                this._bitField = 536870912 | this._bitField;
                            }, n.prototype._setIsFinal = function() {
                                this._bitField = 33554432 | this._bitField;
                            }, n.prototype._isFinal = function() {
                                return (33554432 & this._bitField) > 0;
                            }, n.prototype._setCancellable = function() {
                                this._bitField = 67108864 | this._bitField;
                            }, n.prototype._unsetCancellable = function() {
                                this._bitField = -67108865 & this._bitField;
                            }, n.prototype._receiverAt = function(t) {
                                var e;
                                return e = 0 === t ? this._receiver0 : this[t + 4 - 5], this._isBound() && void 0 === e ? this._boundTo : e;
                            }, n.prototype._promiseAt = function(t) {
                                return 0 === t ? this._promise0 : this[t + 3 - 5];
                            }, n.prototype._fulfillmentHandlerAt = function(t) {
                                return 0 === t ? this._fulfillmentHandler0 : this[t + 0 - 5];
                            }, n.prototype._rejectionHandlerAt = function(t) {
                                return 0 === t ? this._rejectionHandler0 : this[t + 1 - 5];
                            }, n.prototype._unsetAt = function(t) {
                                0 === t ? this._fulfillmentHandler0 = this._rejectionHandler0 = this._progressHandler0 = this._promise0 = this._receiver0 = void 0 : this[t - 5 + 0] = this[t - 5 + 1] = this[t - 5 + 2] = this[t - 5 + 3] = this[t - 5 + 4] = void 0;
                            }, n.prototype._resolveFromResolver = function(t) {
                                function e(t) {
                                    i._tryFollow(t) || i._fulfill(t);
                                }
                                function r(t) {
                                    i._attachExtraTrace(t), O(t), i._reject(t);
                                }
                                var i = this, n = $;
                                n && (this._setTrace(this._resolveFromResolver, void 0), this._pushContext());
                                var o = x(t, void 0, e, r);
                                n && this._popContext(), void 0 !== o && o === w && i._reject(o.e);
                            }, n.prototype._addCallbacks = function(t, e, r, i, n) {
                                var o = this._length();
                                if (o >= 4194298 && (o = 0, this._setLength(0)), 0 === o) this._promise0 = i, void 0 !== n && (this._receiver0 = n), 
                                "function" == typeof t && (this._fulfillmentHandler0 = t), "function" == typeof e && (this._rejectionHandler0 = e), 
                                "function" == typeof r && (this._progressHandler0 = r); else {
                                    var s = o - 5;
                                    this[s + 3] = i, this[s + 4] = n, this[s + 0] = "function" == typeof t ? t : void 0, 
                                    this[s + 1] = "function" == typeof e ? e : void 0, this[s + 2] = "function" == typeof r ? r : void 0;
                                }
                                return this._setLength(o + 5), o;
                            }, n.prototype._setBoundTo = function(t) {
                                void 0 !== t ? (this._bitField = 8388608 | this._bitField, this._boundTo = t) : this._bitField = -8388609 & this._bitField;
                            }, n.prototype._isBound = function() {
                                return 8388608 === (8388608 & this._bitField);
                            }, n.prototype._spreadSlowCase = function(t, e, r, i) {
                                var n = s(r, d, this._spreadSlowCase, i).promise()._then(function() {
                                    return t.apply(i, arguments);
                                }, void 0, void 0, p, void 0, this._spreadSlowCase);
                                e._follow(n);
                            }, n.prototype._markHandled = function(t) {
                                if ("object" == typeof t && null !== t) {
                                    var e = t.__promiseHandled__;
                                    void 0 === e ? j(t, "__promiseHandled__", 2) : t.__promiseHandled__ = S(e);
                                }
                            }, n.prototype._callSpread = function(t, r, i, o) {
                                var s = this._isBound() ? this._boundTo : void 0;
                                if (m(i)) for (var a = this._settlePromiseFromHandler, u = 0, c = i.length; c > u; ++u) if (e(n._cast(i[u], a, void 0))) return void this._spreadSlowCase(t, r, i, s);
                                return o && r._pushContext(), T(t, i, s);
                            }, n.prototype._callHandler = function(t, e, r, i, n) {
                                var o;
                                return e !== p || this.isRejected() ? (n && r._pushContext(), o = k(t, e, i)) : o = this._callSpread(t, r, i, n), 
                                n && r._popContext(), o;
                            }, n.prototype._settlePromiseFromHandler = function(t, r, i, o) {
                                if (!e(o)) return void t.call(r, i, o);
                                this.isRejected() && this._markHandled(i);
                                var s = $, a = this._callHandler(t, r, o, i, s);
                                if (!o._isFollowing()) if (a === w || a === o || a === h) {
                                    var u = a === o ? N() : H(a.e);
                                    a !== h && o._attachExtraTrace(u), o._rejectUnchecked(u);
                                } else {
                                    var c = n._cast(a, s ? this._settlePromiseFromHandler : void 0, o);
                                    e(c) ? (o._follow(c), c._cancellable() && (o._cancellationParent = c, o._setCancellable())) : o._fulfillUnchecked(a);
                                }
                            }, n.prototype._follow = function(t) {
                                this._setFollowing(), t.isPending() ? (t._cancellable() && (this._cancellationParent = t, 
                                this._setCancellable()), t._proxyPromise(this)) : t.isFulfilled() ? this._fulfillUnchecked(t._settledValue) : this._rejectUnchecked(t._settledValue), 
                                $ && null == t._traceParent && (t._traceParent = this);
                            }, n.prototype._tryFollow = function(t) {
                                if (this._isFollowingOrFulfilledOrRejected() || t === this) return !1;
                                var r = n._cast(t, this._tryFollow, void 0);
                                return e(r) ? (this._follow(r), !0) : !1;
                            }, n.prototype._resetTrace = function(t) {
                                if ($) {
                                    var e = this._peekContext(), r = void 0 === e;
                                    this._trace = new _("function" == typeof t ? t : this._resetTrace, r);
                                }
                            }, n.prototype._setTrace = function(t, e) {
                                if ($) {
                                    var r = this._peekContext();
                                    this._traceParent = r;
                                    var i = void 0 === r;
                                    this._trace = void 0 !== e && e._traceParent === r ? e._trace : new _("function" == typeof t ? t : this._setTrace, i);
                                }
                                return this;
                            }, n.prototype._attachExtraTrace = function(t) {
                                if ($ && U(t)) {
                                    var e = this, r = t.stack;
                                    r = "string" == typeof r ? r.split("\n") : [];
                                    for (var i = 1; null != e && null != e._trace; ) r = _.combine(r, e._trace.stack.split("\n")), 
                                    e = e._traceParent;
                                    var n = Error.stackTraceLimit + i, o = r.length;
                                    o > n && (r.length = n), t.stack = r.length <= i ? "(No stack trace)" : r.join("\n"), 
                                    t.__promiseHandled__ = B(t.__promiseHandled__);
                                }
                            }, n.prototype._notifyUnhandledRejection = function(t) {
                                M(t.__promiseHandled__) || (t.__promiseHandled__ = S(t.__promiseHandled__), _.possiblyUnhandledRejection(t, this));
                            }, n.prototype._unhandledRejection = function(t) {
                                M(t.__promiseHandled__) || c.invokeLater(this._notifyUnhandledRejection, this, t);
                            }, n.prototype._cleanValues = function() {
                                this._cancellable() && (this._cancellationParent = void 0);
                            }, n.prototype._fulfill = function(t) {
                                this._isFollowingOrFulfilledOrRejected() || this._fulfillUnchecked(t);
                            }, n.prototype._reject = function(t) {
                                this._isFollowingOrFulfilledOrRejected() || this._rejectUnchecked(t);
                            }, n.prototype._settlePromiseAt = function(t) {
                                var e = this.isFulfilled() ? this._fulfillmentHandlerAt(t) : this._rejectionHandlerAt(t), r = this._settledValue, o = this._receiverAt(t), s = this._promiseAt(t);
                                if ("function" == typeof e) this._settlePromiseFromHandler(e, o, r, s); else {
                                    var a = !1, u = this.isFulfilled();
                                    void 0 !== o && (o instanceof n && o._isProxied() ? (o._unsetProxied(), u ? o._fulfillUnchecked(r) : o._rejectUnchecked(r), 
                                    a = !0) : i(o, s) && (u ? o._promiseFulfilled(r, s) : o._promiseRejected(r, s), 
                                    a = !0)), a || (u ? s._fulfill(r) : s._reject(r));
                                }
                                t >= 256 && this._queueGC();
                            }, n.prototype._isProxied = function() {
                                return 4194304 === (4194304 & this._bitField);
                            }, n.prototype._setProxied = function() {
                                this._bitField = 4194304 | this._bitField;
                            }, n.prototype._unsetProxied = function() {
                                this._bitField = -4194305 & this._bitField;
                            }, n.prototype._isGcQueued = function() {
                                return -1073741824 === (-1073741824 & this._bitField);
                            }, n.prototype._setGcQueued = function() {
                                this._bitField = -1073741824 | this._bitField;
                            }, n.prototype._unsetGcQueued = function() {
                                this._bitField = 1073741823 & this._bitField;
                            }, n.prototype._queueGC = function() {
                                this._isGcQueued() || (this._setGcQueued(), c.invokeLater(this._gc, this, void 0));
                            }, n.prototype._gc = function() {
                                var t = this._length();
                                this._unsetAt(0);
                                for (var e = 0; t > e; e++) delete this[e];
                                this._setLength(0), this._unsetGcQueued();
                            }, n.prototype._queueSettleAt = function(t) {
                                c.invoke(this._settlePromiseAt, this, t);
                            }, n.prototype._fulfillUnchecked = function(t) {
                                if (this.isPending()) {
                                    if (t === this) {
                                        var e = N();
                                        return this._attachExtraTrace(e), this._rejectUnchecked(e);
                                    }
                                    this._cleanValues(), this._setFulfilled(), this._settledValue = t;
                                    var r = this._length();
                                    r > 0 && c.invoke(this._fulfillPromises, this, r);
                                }
                            }, n.prototype._fulfillPromises = function(t) {
                                t = this._length();
                                for (var e = 0; t > e; e += 5) this._settlePromiseAt(e);
                            }, n.prototype._rejectUnchecked = function(t) {
                                if (this.isPending()) {
                                    if (t === this) {
                                        var e = N();
                                        return this._attachExtraTrace(e), this._rejectUnchecked(e);
                                    }
                                    if (this._cleanValues(), this._setRejected(), this._settledValue = t, this._isFinal()) return void c.invokeLater(L, void 0, t);
                                    var r = this._length();
                                    r > 0 ? c.invoke(this._rejectPromises, this, r) : this._ensurePossibleRejectionHandled(t);
                                }
                            }, n.prototype._rejectPromises = function(t) {
                                t = this._length();
                                for (var r = !1, n = 0; t > n; n += 5) {
                                    var o = this._rejectionHandlerAt(n);
                                    if (!r) if ("function" == typeof o) r = !0; else {
                                        var s = this._promiseAt(n);
                                        if (e(s) && s._length() > 0) r = !0; else {
                                            var a = this._receiverAt(n);
                                            (e(a) && a._length() > 0 || i(a, s)) && (r = !0);
                                        }
                                    }
                                    this._settlePromiseAt(n);
                                }
                                r || this._ensurePossibleRejectionHandled(this._settledValue);
                            }, n.prototype._ensurePossibleRejectionHandled = function(t) {
                                if (void 0 !== _.possiblyUnhandledRejection && g(t)) {
                                    var e = t.__promiseHandled__, r = t;
                                    if (void 0 === e) r = b(t, "__promiseHandled__", 0), e = 0; else if (M(e)) return;
                                    V(e) || this._attachExtraTrace(r), c.invoke(this._unhandledRejection, this, r);
                                }
                            };
                            var D = [];
                            n.prototype._peekContext = function() {
                                var t = D.length - 1;
                                return t >= 0 ? D[t] : void 0;
                            }, n.prototype._pushContext = function() {
                                $ && D.push(this);
                            }, n.prototype._popContext = function() {
                                $ && D.pop();
                            };
                            var W = a.Promise;
                            return n.noConflict = function() {
                                return a.Promise === n && (a.Promise = W), n;
                            }, _.isSupported() || (n.longStackTraces = function() {}, $ = !1), n._makeSelfResolutionError = N, 
                            t("./finally.js")(n, h), t("./direct_resolve.js")(n), t("./thenables.js")(n), n.RangeError = P, 
                            n.CancellationError = E, n.TimeoutError = R, n.TypeError = F, n.RejectionError = A, 
                            t("./timers.js")(n, f), t("./synchronous_inspection.js")(n), t("./any.js")(n, s, d), 
                            t("./race.js")(n, f), t("./call_get.js")(n), t("./filter.js")(n, s, d, q), t("./generators.js")(n, q, f), 
                            t("./map.js")(n, s, d, q), t("./nodeify.js")(n), t("./promisify.js")(n, f), t("./props.js")(n, d), 
                            t("./reduce.js")(n, s, d, q), t("./settle.js")(n, s, d), t("./some.js")(n, s, d, q), 
                            t("./progress.js")(n, i), t("./cancel.js")(n, f), n.prototype = n.prototype, n;
                        };
                    }, {
                        "./any.js": 2,
                        "./assert.js": 3,
                        "./async.js": 4,
                        "./call_get.js": 6,
                        "./cancel.js": 7,
                        "./captured_trace.js": 8,
                        "./catch_filter.js": 9,
                        "./direct_resolve.js": 10,
                        "./errors.js": 11,
                        "./errors_api_rejection": 12,
                        "./filter.js": 14,
                        "./finally.js": 15,
                        "./generators.js": 16,
                        "./global.js": 17,
                        "./map.js": 18,
                        "./nodeify.js": 19,
                        "./progress.js": 20,
                        "./promise_array.js": 22,
                        "./promise_resolver.js": 24,
                        "./promisify.js": 26,
                        "./props.js": 28,
                        "./race.js": 30,
                        "./reduce.js": 31,
                        "./settle.js": 33,
                        "./some.js": 35,
                        "./synchronous_inspection.js": 37,
                        "./thenables.js": 38,
                        "./timers.js": 39,
                        "./util.js": 40,
                        __browserify_process: 76
                    } ],
                    22: [ function(t, e) {
                        "use strict";
                        e.exports = function(e, r) {
                            function i(t) {
                                switch (t) {
                                  case -1:
                                    return void 0;

                                  case -2:
                                    return [];

                                  case -3:
                                    return {};
                                }
                            }
                            function n(t, i, n) {
                                var o = this._promise = new e(r), s = void 0;
                                e.is(t) && (s = t, t._cancellable() && (o._setCancellable(), o._cancellationParent = t), 
                                t._isBound() && o._setBoundTo(n)), o._setTrace(i, s), this._values = t, this._length = 0, 
                                this._totalResolved = 0, this._init(void 0, -2);
                            }
                            var o = (t("./assert.js"), t("./errors.js").ensureNotHandled), s = t("./util.js"), a = t("./async.js"), u = {}.hasOwnProperty, c = s.isArray;
                            return n.PropertiesPromiseArray = function() {}, n.prototype.length = function() {
                                return this._length;
                            }, n.prototype.promise = function() {
                                return this._promise;
                            }, n.prototype._init = function(t, r) {
                                var o = this._values;
                                if (e.is(o)) {
                                    if (!o.isFulfilled()) return o.isPending() ? void o._then(this._init, this._reject, void 0, this, r, this.constructor) : void this._reject(o._settledValue);
                                    if (o = o._settledValue, !c(o)) {
                                        var s = new e.TypeError("expecting an array, a promise or a thenable");
                                        return void this.__hardReject__(s);
                                    }
                                    this._values = o;
                                }
                                if (0 === o.length) return void this._resolve(i(r));
                                var l, f = o.length, p = f;
                                l = this instanceof n.PropertiesPromiseArray ? this._values : new Array(f);
                                for (var h = !1, d = 0; f > d; ++d) {
                                    var _ = o[d];
                                    if (void 0 !== _ || u.call(o, d)) {
                                        var v = e._cast(_, void 0, void 0);
                                        v instanceof e && v.isPending() ? v._proxyPromiseArray(this, d) : h = !0, l[d] = v;
                                    } else p--;
                                }
                                if (0 === p) return void this._resolve(-2 === r ? l : i(r));
                                if (this._values = l, this._length = p, h) {
                                    var y = p === f ? this._scanDirectValues : this._scanDirectValuesHoled;
                                    a.invoke(y, this, f);
                                }
                            }, n.prototype._settlePromiseAt = function(t) {
                                var r = this._values[t];
                                e.is(r) ? r.isFulfilled() ? this._promiseFulfilled(r._settledValue, t) : r.isRejected() && this._promiseRejected(r._settledValue, t) : this._promiseFulfilled(r, t);
                            }, n.prototype._scanDirectValuesHoled = function(t) {
                                for (var e = 0; t > e && !this._isResolved(); ++e) u.call(this._values, e) && this._settlePromiseAt(e);
                            }, n.prototype._scanDirectValues = function(t) {
                                for (var e = 0; t > e && !this._isResolved(); ++e) this._settlePromiseAt(e);
                            }, n.prototype._isResolved = function() {
                                return null === this._values;
                            }, n.prototype._resolve = function(t) {
                                this._values = null, this._promise._fulfill(t);
                            }, n.prototype.__hardReject__ = n.prototype._reject = function(t) {
                                o(t), this._values = null, this._promise._attachExtraTrace(t), this._promise._reject(t);
                            }, n.prototype._promiseProgressed = function(t, e) {
                                this._isResolved() || this._promise._progress({
                                    index: e,
                                    value: t
                                });
                            }, n.prototype._promiseFulfilled = function(t, e) {
                                if (!this._isResolved()) {
                                    this._values[e] = t;
                                    var r = ++this._totalResolved;
                                    r >= this._length && this._resolve(this._values);
                                }
                            }, n.prototype._promiseRejected = function(t) {
                                this._isResolved() || (this._totalResolved++, this._reject(t));
                            }, n;
                        };
                    }, {
                        "./assert.js": 3,
                        "./async.js": 4,
                        "./errors.js": 11,
                        "./util.js": 40
                    } ],
                    23: [ function(t, e) {
                        "use strict";
                        function r(t) {
                            void 0 !== t ? (this._bitField = t._bitField, this._settledValue = t.isResolved() ? t._settledValue : void 0) : (this._bitField = 0, 
                            this._settledValue = void 0);
                        }
                        var i = t("./errors.js").TypeError;
                        r.prototype.isFulfilled = function() {
                            return (268435456 & this._bitField) > 0;
                        }, r.prototype.isRejected = function() {
                            return (134217728 & this._bitField) > 0;
                        }, r.prototype.isPending = function() {
                            return 0 === (402653184 & this._bitField);
                        }, r.prototype.value = function() {
                            if (!this.isFulfilled()) throw new i("cannot get fulfillment value of a non-fulfilled promise");
                            return this._settledValue;
                        }, r.prototype.error = function() {
                            if (!this.isRejected()) throw new i("cannot get rejection reason of a non-rejected promise");
                            return this._settledValue;
                        }, e.exports = r;
                    }, {
                        "./errors.js": 11
                    } ],
                    24: [ function(t, e) {
                        "use strict";
                        function r(t) {
                            return t instanceof Error && h.getPrototypeOf(t) === Error.prototype;
                        }
                        function i(t) {
                            var e;
                            return e = r(t) ? new l(t) : t, u.markAsOriginatingFromRejection(e), e;
                        }
                        function n(t) {
                            function e(e, r) {
                                if (e) {
                                    var n = i(a(e));
                                    t._attachExtraTrace(n), t._reject(n);
                                } else if (arguments.length > 2) {
                                    for (var o = arguments.length, s = new Array(o - 1), u = 1; o > u; ++u) s[u - 1] = arguments[u];
                                    t._fulfill(s);
                                } else t._fulfill(r);
                            }
                            return e;
                        }
                        var o, s = t("./util.js"), a = s.maybeWrapAsError, u = t("./errors.js"), c = u.TimeoutError, l = u.RejectionError, f = t("./async.js"), p = s.haveGetters, h = t("./es5.js");
                        if (o = p ? function(t) {
                            this.promise = t;
                        } : function(t) {
                            this.promise = t, this.asCallback = n(t), this.callback = this.asCallback;
                        }, p) {
                            var d = {
                                get: function() {
                                    return n(this.promise);
                                }
                            };
                            h.defineProperty(o.prototype, "asCallback", d), h.defineProperty(o.prototype, "callback", d);
                        }
                        o._nodebackForPromise = n, o.prototype.toString = function() {
                            return "[object PromiseResolver]";
                        }, o.prototype.resolve = o.prototype.fulfill = function(t) {
                            var e = this.promise;
                            e._tryFollow(t) || f.invoke(e._fulfill, e, t);
                        }, o.prototype.reject = function(t) {
                            var e = this.promise;
                            u.markAsOriginatingFromRejection(t), e._attachExtraTrace(t), f.invoke(e._reject, e, t);
                        }, o.prototype.progress = function(t) {
                            f.invoke(this.promise._progress, this.promise, t);
                        }, o.prototype.cancel = function() {
                            f.invoke(this.promise.cancel, this.promise, void 0);
                        }, o.prototype.timeout = function() {
                            this.reject(new c("timeout"));
                        }, o.prototype.isResolved = function() {
                            return this.promise.isResolved();
                        }, o.prototype.toJSON = function() {
                            return this.promise.toJSON();
                        }, e.exports = o;
                    }, {
                        "./async.js": 4,
                        "./errors.js": 11,
                        "./es5.js": 13,
                        "./util.js": 40
                    } ],
                    25: [ function(t, e) {
                        "use strict";
                        e.exports = function(e, r) {
                            function i(t, i, n) {
                                var o = this._promise = new e(r);
                                o._setTrace(n, void 0), this._generatorFunction = t, this._receiver = i, this._generator = void 0;
                            }
                            var n = t("./errors.js"), o = n.TypeError, s = n.ensureNotHandled, a = t("./util.js"), u = a.isArray, c = a.errorObj, l = a.tryCatch1;
                            return i.prototype.promise = function() {
                                return this._promise;
                            }, i.prototype._run = function() {
                                this._generator = this._generatorFunction.call(this._receiver), this._receiver = this._generatorFunction = void 0, 
                                this._next(void 0);
                            }, i.prototype._continue = function f(t) {
                                if (t === c) return this._generator = void 0, this._promise._attachExtraTrace(t.e), 
                                void this._promise._reject(t.e);
                                var r = t.value;
                                if (t.done === !0) this._generator = void 0, this._promise._fulfill(r); else {
                                    var i = e._cast(r, f, void 0);
                                    if (!(i instanceof e)) {
                                        if (!u(i)) return void this._throw(new o("A value was yielded that could not be treated as a promise"));
                                        i = e.all(i);
                                    }
                                    i._then(this._next, this._throw, void 0, this, null, void 0);
                                }
                            }, i.prototype._throw = function(t) {
                                s(t), this._promise._attachExtraTrace(t), this._continue(l(this._generator["throw"], this._generator, t));
                            }, i.prototype._next = function(t) {
                                this._continue(l(this._generator.next, this._generator, t));
                            }, i;
                        };
                    }, {
                        "./errors.js": 11,
                        "./util.js": 40
                    } ],
                    26: [ function(t, e) {
                        "use strict";
                        e.exports = function(e, r) {
                            function i(t) {
                                return t.__isPromisified__ === !0;
                            }
                            function n(t, i, n) {
                                function o(e) {
                                    for (var r = new Array(e), n = 0, o = r.length; o > n; ++n) r[n] = "a" + (n + 1);
                                    var s = e > 0 ? "," : "";
                                    return "string" == typeof t && i === u ? "this['" + t + "'](" + r.join(",") + s + " fn);break;" : (void 0 === i ? "callback(" + r.join(",") + s + " fn);" : "callback.call(" + (i === u ? "this" : "receiver") + ", " + r.join(",") + s + " fn);") + "break;";
                                }
                                function s() {
                                    return "var args = new Array(len + 1);var i = 0;for (var i = 0; i < len; ++i) {    args[i] = arguments[i];}args[i] = fn;";
                                }
                                var a = "string" == typeof n ? n + "Async" : "promisified";
                                return new Function("Promise", "callback", "receiver", "withAppended", "maybeWrapAsError", "nodebackForPromise", "INTERNAL", "var ret = function " + a + '(a1, a2, a3, a4, a5) {"use strict";var len = arguments.length;var promise = new Promise(INTERNAL);promise._setTrace(' + a + ", void 0);var fn = nodebackForPromise(promise);try{switch(len) {case 1:" + o(1) + "case 2:" + o(2) + "case 3:" + o(3) + "case 0:" + o(0) + "case 4:" + o(4) + "case 5:" + o(5) + "default: " + s() + ("string" == typeof t ? "this['" + t + "'].apply(" : "callback.apply(") + (i === u ? "this" : "receiver") + ", args); break;}}catch(e){ var wrapped = maybeWrapAsError(e);promise._attachExtraTrace(wrapped);promise._reject(wrapped);}return promise;}; ret.__isPromisified__ = true; return ret;")(e, t, i, p, h, f, r);
                            }
                            function o(t, i) {
                                function n() {
                                    var o = i;
                                    i === u && (o = this), "string" == typeof t && (t = o[t]);
                                    var s = new e(r);
                                    s._setTrace(n, void 0);
                                    var a = f(s);
                                    try {
                                        t.apply(o, p(arguments, a));
                                    } catch (c) {
                                        var l = h(c);
                                        s._attachExtraTrace(l), s._reject(l);
                                    }
                                    return s;
                                }
                                return n.__isPromisified__ = !0, n;
                            }
                            function s() {}
                            function a(t, e, r) {
                                if (r) {
                                    for (var i = j(t), n = 0, o = i.length; o > n; n += 2) {
                                        var a = i[n], c = i[n + 1], l = a + "__beforePromisified__", f = a + "Async";
                                        _(t, l, c), t[f] = g(l, u, a);
                                    }
                                    return i.length > 16 && (s.prototype = t), t;
                                }
                                return g(t, e, void 0);
                            }
                            var u = {}, c = t("./util.js"), l = t("./es5.js"), f = t("./promise_resolver.js")._nodebackForPromise, p = c.withAppended, h = c.maybeWrapAsError, d = c.canEvaluate, _ = c.notEnumerableProp, v = c.deprecated, y = (t("./assert.js"), 
                            new RegExp("__beforePromisified__$")), m = {}.hasOwnProperty, j = function() {
                                if (l.isES5) {
                                    var t = Object.create, e = Object.getOwnPropertyDescriptor;
                                    return function(r) {
                                        for (var n = r, o = [], s = t(null); null !== r; ) {
                                            for (var a = l.keys(r), u = 0, c = a.length; c > u; ++u) {
                                                var f = a[u];
                                                if (!(s[f] || y.test(f) || m.call(n, f + "__beforePromisified__"))) {
                                                    s[f] = !0;
                                                    var p = e(r, f);
                                                    null == p || "function" != typeof p.value || i(p.value) || o.push(f, p.value);
                                                }
                                            }
                                            r = l.getPrototypeOf(r);
                                        }
                                        return o;
                                    };
                                }
                                return function(t) {
                                    var e = [];
                                    for (var r in t) if (!y.test(r) && !m.call(t, r + "__beforePromisified__")) {
                                        var n = t[r];
                                        "function" != typeof n || i(n) || e.push(r, n);
                                    }
                                    return e;
                                };
                            }(), g = d ? n : o;
                            e.promisify = function(t, e) {
                                if ("object" == typeof t && null !== t) return v("Promise.promisify for promisifying entire objects is deprecated. Use Promise.promisifyAll instead."), 
                                a(t, e, !0);
                                if ("function" != typeof t) throw new TypeError("fn must be a function");
                                return i(t) ? t : a(t, arguments.length < 2 ? u : e, !1);
                            }, e.promisifyAll = function(t) {
                                if ("function" != typeof t && "object" != typeof t) throw new TypeError("the target of promisifyAll must be an object or a function");
                                return a(t, void 0, !0);
                            };
                        };
                    }, {
                        "./assert.js": 3,
                        "./es5.js": 13,
                        "./promise_resolver.js": 24,
                        "./util.js": 40
                    } ],
                    27: [ function(t, e) {
                        "use strict";
                        e.exports = function(e, r) {
                            function i(t, e, r) {
                                for (var i = s.keys(t), n = new Array(i.length), o = 0, a = n.length; a > o; ++o) n[o] = t[i[o]];
                                if (this.constructor$(n, e, r), !this._isResolved()) for (var o = 0, a = i.length; a > o; ++o) n.push(i[o]);
                            }
                            var n = (t("./assert.js"), t("./util.js")), o = n.inherits, s = t("./es5.js");
                            return o(i, r), i.prototype._init = function() {
                                this._init$(void 0, -3);
                            }, i.prototype._promiseFulfilled = function(t, e) {
                                if (!this._isResolved()) {
                                    this._values[e] = t;
                                    var r = ++this._totalResolved;
                                    if (r >= this._length) {
                                        for (var i = {}, n = this.length(), o = 0, s = this.length(); s > o; ++o) i[this._values[o + n]] = this._values[o];
                                        this._resolve(i);
                                    }
                                }
                            }, i.prototype._promiseProgressed = function(t, e) {
                                this._isResolved() || this._promise._progress({
                                    key: this._values[e + this.length()],
                                    value: t
                                });
                            }, r.PropertiesPromiseArray = i, i;
                        };
                    }, {
                        "./assert.js": 3,
                        "./es5.js": 13,
                        "./util.js": 40
                    } ],
                    28: [ function(t, e) {
                        "use strict";
                        e.exports = function(e, r) {
                            function i(t, r, i) {
                                var o, u = e._cast(t, i, void 0);
                                return a(u) ? (e.is(u) ? o = u._then(e.props, void 0, void 0, void 0, void 0, i) : (o = new n(u, i, r === !0 && u._isBound() ? u._boundTo : void 0).promise(), 
                                r = !1), r === !0 && u._isBound() && o._setBoundTo(u._boundTo), o) : s("cannot await properties of a non-object");
                            }
                            var n = t("./properties_promise_array.js")(e, r), o = t("./util.js"), s = t("./errors_api_rejection")(e), a = o.isObject;
                            e.prototype.props = function() {
                                return i(this, !0, this.props);
                            }, e.props = function(t) {
                                return i(t, !1, e.props);
                            };
                        };
                    }, {
                        "./errors_api_rejection": 12,
                        "./properties_promise_array.js": 27,
                        "./util.js": 40
                    } ],
                    29: [ function(t, e) {
                        "use strict";
                        function r(t, e, r, i, n) {
                            for (var o = 0; n > o; ++o) r[o + i] = t[o + e];
                        }
                        function i(t) {
                            return t >>>= 0, t -= 1, t |= t >> 1, t |= t >> 2, t |= t >> 4, t |= t >> 8, t |= t >> 16, 
                            t + 1;
                        }
                        function n(t) {
                            return "number" != typeof t ? 16 : i(Math.min(Math.max(16, t), 1073741824));
                        }
                        function o(t) {
                            this._capacity = n(t), this._length = 0, this._front = 0, this._makeCapacity();
                        }
                        t("./assert.js");
                        o.prototype._willBeOverCapacity = function(t) {
                            return this._capacity < t;
                        }, o.prototype._pushOne = function(t) {
                            var e = this.length();
                            this._checkCapacity(e + 1);
                            var r = this._front + e & this._capacity - 1;
                            this[r] = t, this._length = e + 1;
                        }, o.prototype.push = function(t, e, r) {
                            var i = this.length() + 3;
                            if (this._willBeOverCapacity(i)) return this._pushOne(t), this._pushOne(e), void this._pushOne(r);
                            var n = this._front + i - 3;
                            this._checkCapacity(i);
                            var o = this._capacity - 1;
                            this[n + 0 & o] = t, this[n + 1 & o] = e, this[n + 2 & o] = r, this._length = i;
                        }, o.prototype.shift = function() {
                            var t = this._front, e = this[t];
                            return this[t] = void 0, this._front = t + 1 & this._capacity - 1, this._length--, 
                            e;
                        }, o.prototype.length = function() {
                            return this._length;
                        }, o.prototype._makeCapacity = function() {
                            for (var t = this._capacity, e = 0; t > e; ++e) this[e] = void 0;
                        }, o.prototype._checkCapacity = function(t) {
                            this._capacity < t && this._resizeTo(this._capacity << 3);
                        }, o.prototype._resizeTo = function(t) {
                            var e = this._front, i = this._capacity, n = new Array(i), o = this.length();
                            if (r(this, 0, n, 0, i), this._capacity = t, this._makeCapacity(), this._front = 0, 
                            i >= e + o) r(n, e, this, 0, o); else {
                                var s = o - (e + o & i - 1);
                                r(n, e, this, 0, s), r(n, 0, this, s, o - s);
                            }
                        }, e.exports = o;
                    }, {
                        "./assert.js": 3
                    } ],
                    30: [ function(t, e) {
                        "use strict";
                        e.exports = function(e, r) {
                            function i(t, i, u) {
                                var c = e._cast(t, i, void 0);
                                if (e.is(c)) return s(c);
                                if (!o(t)) return n("expecting an array, a promise or a thenable");
                                var l = new e(r);
                                l._setTrace(i, u), void 0 !== u && (u._isBound() && l._setBoundTo(u._boundTo), u._cancellable() && (l._setCancellable(), 
                                l._cancellationParent = u));
                                for (var f = l._fulfill, p = l._reject, h = 0, d = t.length; d > h; ++h) {
                                    var _ = t[h];
                                    (void 0 !== _ || a.call(t, h)) && e.cast(_)._then(f, p, void 0, l, null, i);
                                }
                                return l;
                            }
                            var n = t("./errors_api_rejection.js")(e), o = t("./util.js").isArray, s = function(t) {
                                return t.then(function e(r) {
                                    return i(r, e, t);
                                });
                            }, a = {}.hasOwnProperty;
                            e.race = function(t) {
                                return i(t, e.race, void 0);
                            }, e.prototype.race = function() {
                                return i(this, this.race, void 0);
                            };
                        };
                    }, {
                        "./errors_api_rejection.js": 12,
                        "./util.js": 40
                    } ],
                    31: [ function(t, e) {
                        "use strict";
                        e.exports = function(e, r, i, n) {
                            function o(t, e) {
                                var r = this, i = void 0;
                                "function" != typeof r && (i = r.receiver, r = r.fn);
                                var n = t.length, o = void 0, s = 0;
                                if (void 0 !== e) o = e, s = 0; else if (s = 1, n > 0) for (var a = 0; n > a; ++a) if (void 0 !== t[a] || a in t) {
                                    o = t[a], s = a + 1;
                                    break;
                                }
                                if (void 0 === i) for (var a = s; n > a; ++a) (void 0 !== t[a] || a in t) && (o = r(o, t[a], a, n)); else for (var a = s; n > a; ++a) (void 0 !== t[a] || a in t) && (o = r.call(i, o, t[a], a, n));
                                return o;
                            }
                            function s(t) {
                                var e = this.fn, r = this.initialValue;
                                return o.call(e, t, r);
                            }
                            function a(t, e, r, i, n) {
                                return r._then(function o(r) {
                                    return u(t, e, r, i, o);
                                }, void 0, void 0, void 0, void 0, n);
                            }
                            function u(t, u, c, l, f) {
                                if ("function" != typeof u) return n("fn must be a function");
                                if (l === !0 && t._isBound() && (u = {
                                    fn: u,
                                    receiver: t._boundTo
                                }), void 0 !== c) {
                                    if (e.is(c)) {
                                        if (!c.isFulfilled()) return a(t, u, c, l, f);
                                        c = c._settledValue;
                                    }
                                    return r(t, i, f, l === !0 && t._isBound() ? t._boundTo : void 0).promise()._then(s, void 0, void 0, {
                                        fn: u,
                                        initialValue: c
                                    }, void 0, e.reduce);
                                }
                                return r(t, i, f, l === !0 && t._isBound() ? t._boundTo : void 0).promise()._then(o, void 0, void 0, u, void 0, f);
                            }
                            t("./assert.js");
                            e.reduce = function(t, r, i) {
                                return u(t, r, i, !1, e.reduce);
                            }, e.prototype.reduce = function(t, e) {
                                return u(this, t, e, !0, this.reduce);
                            };
                        };
                    }, {
                        "./assert.js": 3
                    } ],
                    32: [ function(t, e) {
                        {
                            var r, i = t("__browserify_process"), n = t("./global.js");
                            t("./assert.js");
                        }
                        if ("undefined" != typeof i && null !== i && "function" == typeof i.cwd && "function" == typeof i.nextTick) r = i.nextTick; else if ("function" != typeof MutationObserver && "function" != typeof WebkitMutationObserver && "function" != typeof WebKitMutationObserver || "undefined" == typeof document || "function" != typeof document.createElement) if ("function" == typeof n.postMessage && "function" != typeof n.importScripts && "function" == typeof n.addEventListener && "function" == typeof n.removeEventListener) {
                            var o = "bluebird_message_key_" + Math.random();
                            r = function() {
                                function t(t) {
                                    if (t.source === n && t.data === o) {
                                        var r = e;
                                        e = void 0, r();
                                    }
                                }
                                var e = void 0;
                                return n.addEventListener("message", t, !1), function(t) {
                                    e = t, n.postMessage(o, "*");
                                };
                            }();
                        } else r = "function" == typeof MessageChannel ? function() {
                            var t = void 0, e = new MessageChannel();
                            return e.port1.onmessage = function() {
                                var e = t;
                                t = void 0, e();
                            }, function(r) {
                                t = r, e.port2.postMessage(null);
                            };
                        }() : n.setTimeout ? function(t) {
                            setTimeout(t, 4);
                        } : function(t) {
                            t();
                        }; else r = function() {
                            var t = n.MutationObserver || n.WebkitMutationObserver || n.WebKitMutationObserver, e = document.createElement("div"), r = void 0, i = new t(function() {
                                var t = r;
                                r = void 0, t();
                            });
                            return i.observe(e, {
                                attributes: !0
                            }), function(t) {
                                r = t, e.setAttribute("class", "foo");
                            };
                        }();
                        e.exports = r;
                    }, {
                        "./assert.js": 3,
                        "./global.js": 17,
                        __browserify_process: 76
                    } ],
                    33: [ function(t, e) {
                        "use strict";
                        e.exports = function(e, r, i) {
                            function n(t, e, i) {
                                return r(t, o, i, e === !0 && t._isBound() ? t._boundTo : void 0).promise();
                            }
                            var o = t("./settled_promise_array.js")(e, i);
                            e.settle = function(t) {
                                return n(t, !1, e.settle);
                            }, e.prototype.settle = function() {
                                return n(this, !0, this.settle);
                            };
                        };
                    }, {
                        "./settled_promise_array.js": 34
                    } ],
                    34: [ function(t, e) {
                        "use strict";
                        e.exports = function(e, r) {
                            function i(t, e, r) {
                                this.constructor$(t, e, r);
                            }
                            var n = (t("./assert.js"), t("./promise_inspection.js")), o = t("./util.js"), s = o.inherits;
                            return s(i, r), i.prototype._promiseResolved = function(t, e) {
                                this._values[t] = e;
                                var r = ++this._totalResolved;
                                r >= this._length && this._resolve(this._values);
                            }, i.prototype._promiseFulfilled = function(t, e) {
                                if (!this._isResolved()) {
                                    var r = new n();
                                    r._bitField = 268435456, r._settledValue = t, this._promiseResolved(e, r);
                                }
                            }, i.prototype._promiseRejected = function(t, e) {
                                if (!this._isResolved()) {
                                    var r = new n();
                                    r._bitField = 134217728, r._settledValue = t, this._promiseResolved(e, r);
                                }
                            }, i;
                        };
                    }, {
                        "./assert.js": 3,
                        "./promise_inspection.js": 23,
                        "./util.js": 40
                    } ],
                    35: [ function(t, e) {
                        "use strict";
                        e.exports = function(e, r, i, n) {
                            function o(t, e, i, o) {
                                if ((0 | e) !== e || 0 > e) return n("expecting a positive integer");
                                var a = r(t, s, o, i === !0 && t._isBound() ? t._boundTo : void 0), u = a.promise();
                                return u.isRejected() ? u : (a.setHowMany(e), a.init(), u);
                            }
                            {
                                var s = t("./some_promise_array.js")(i);
                                t("./assert.js");
                            }
                            e.some = function(t, r) {
                                return o(t, r, !1, e.some);
                            }, e.prototype.some = function(t) {
                                return o(this, t, !0, this.some);
                            };
                        };
                    }, {
                        "./assert.js": 3,
                        "./some_promise_array.js": 36
                    } ],
                    36: [ function(t, e) {
                        "use strict";
                        e.exports = function(e) {
                            function r(t, e, r) {
                                this.constructor$(t, e, r), this._howMany = 0, this._unwrap = !1, this._initialized = !1;
                            }
                            var i = t("./util.js"), n = t("./errors.js").RangeError, o = i.inherits, s = i.isArray;
                            return o(r, e), r.prototype._init = function() {
                                if (this._initialized) {
                                    if (0 === this._howMany) return void this._resolve([]);
                                    this._init$(void 0, -2);
                                    var t = s(this._values);
                                    if (this._holes = t ? this._values.length - this.length() : 0, !this._isResolved() && t && this._howMany > this._canPossiblyFulfill()) {
                                        var e = "(Promise.some) input array contains less than " + this._howMany + " promises";
                                        this._reject(new n(e));
                                    }
                                }
                            }, r.prototype.init = function() {
                                this._initialized = !0, this._init();
                            }, r.prototype.setUnwrap = function() {
                                this._unwrap = !0;
                            }, r.prototype.howMany = function() {
                                return this._howMany;
                            }, r.prototype.setHowMany = function(t) {
                                this._isResolved() || (this._howMany = t);
                            }, r.prototype._promiseFulfilled = function(t) {
                                this._isResolved() || (this._addFulfilled(t), this._fulfilled() === this.howMany() && (this._values.length = this.howMany(), 
                                this._resolve(1 === this.howMany() && this._unwrap ? this._values[0] : this._values)));
                            }, r.prototype._promiseRejected = function(t) {
                                this._isResolved() || (this._addRejected(t), this.howMany() > this._canPossiblyFulfill() && this._reject(this._values.length === this.length() ? [] : this._values.slice(this.length() + this._holes)));
                            }, r.prototype._fulfilled = function() {
                                return this._totalResolved;
                            }, r.prototype._rejected = function() {
                                return this._values.length - this.length() - this._holes;
                            }, r.prototype._addRejected = function(t) {
                                this._values.push(t);
                            }, r.prototype._addFulfilled = function(t) {
                                this._values[this._totalResolved++] = t;
                            }, r.prototype._canPossiblyFulfill = function() {
                                return this.length() - this._rejected();
                            }, r;
                        };
                    }, {
                        "./errors.js": 11,
                        "./util.js": 40
                    } ],
                    37: [ function(t, e) {
                        "use strict";
                        e.exports = function(e) {
                            var r = t("./promise_inspection.js");
                            e.prototype.inspect = function() {
                                return new r(this);
                            };
                        };
                    }, {
                        "./promise_inspection.js": 23
                    } ],
                    38: [ function(t, e) {
                        "use strict";
                        e.exports = function(e) {
                            function r(t) {
                                try {
                                    return t.then;
                                } catch (e) {
                                    return a.e = e, a;
                                }
                            }
                            function i(t, o, s) {
                                if (u(t)) {
                                    if (t instanceof e) return t;
                                    var c = r(t);
                                    if (c === a) return o = "function" == typeof o ? o : i, void 0 !== s && s._attachExtraTrace(c.e), 
                                    e.reject(c.e, o);
                                    if ("function" == typeof c) return o = "function" == typeof o ? o : i, n(t, c, o, s);
                                }
                                return t;
                            }
                            function n(t, r, i, n) {
                                function s(r) {
                                    if (!f) {
                                        if (f = !0, t === r) {
                                            var i = e._makeSelfResolutionError();
                                            return void 0 !== n && n._attachExtraTrace(i), void l.reject(i);
                                        }
                                        l.resolve(r);
                                    }
                                }
                                function u(t) {
                                    f || (f = !0, o.markAsOriginatingFromRejection(t), void 0 !== n && n._attachExtraTrace(t), 
                                    l.reject(t));
                                }
                                var l = e.defer(i), f = !1, p = c(r, t, s, u);
                                return p !== a || f || (f = !0, void 0 !== n && n._attachExtraTrace(p.e), l.promise._reject(p.e)), 
                                l.promise;
                            }
                            var o = (t("./assert.js"), t("./errors.js")), s = t("./util.js"), a = s.errorObj, u = s.isObject, c = s.tryCatch2;
                            e._cast = i;
                        };
                    }, {
                        "./assert.js": 3,
                        "./errors.js": 11,
                        "./util.js": 40
                    } ],
                    39: [ function(t, e) {
                        "use strict";
                        var r = t("./global.js"), i = function(t, e) {
                            for (var i = arguments.length, n = new Array(i - 2), o = 2; i > o; ++o) n[o - 2] = arguments[o];
                            r.setTimeout(function() {
                                t.apply(void 0, n);
                            }, e);
                        }, n = {};
                        r.setTimeout(function(t) {
                            t === n && (i = r.setTimeout);
                        }, 1, n), e.exports = function(e, r) {
                            var n = (t("./util.js"), t("./assert.js"), t("./errors.js")), o = t("./errors_api_rejection")(e), s = e.TimeoutError, a = function(t, e, r) {
                                if (t.isPending()) {
                                    "string" != typeof e && (e = "operation timed out after " + r + " ms");
                                    var i = new s(e);
                                    n.markAsOriginatingFromRejection(i), t._attachExtraTrace(i), t._rejectUnchecked(i);
                                }
                            }, u = function(t, e) {
                                e._fulfill(t);
                            };
                            e.delay = function(t, n, s) {
                                if (void 0 === n && (n = t, t = void 0), (0 | n) !== n || 0 > n) return o("expecting a positive integer");
                                "function" != typeof s && (s = e.delay);
                                var a = e._cast(t, s, void 0), c = new e(r);
                                return e.is(a) ? (a._isBound() && c._setBoundTo(a._boundTo), a._cancellable() && (c._setCancellable(), 
                                c._cancellationParent = a), c._setTrace(s, a), c._follow(a), c.then(function(t) {
                                    return e.delay(t, n);
                                })) : (c._setTrace(s, void 0), i(u, n, t, c), c);
                            }, e.prototype.delay = function(t) {
                                return e.delay(this, t, this.delay);
                            }, e.prototype.timeout = function(t, n) {
                                if ((0 | t) !== t || 0 > t) return o("expecting a positive integer");
                                var s = new e(r);
                                return s._setTrace(this.timeout, this), this._isBound() && s._setBoundTo(this._boundTo), 
                                this._cancellable() && (s._setCancellable(), s._cancellationParent = this), s._follow(this), 
                                i(a, t, s, n, t), s;
                            };
                        };
                    }, {
                        "./assert.js": 3,
                        "./errors.js": 11,
                        "./errors_api_rejection": 12,
                        "./global.js": 17,
                        "./util.js": 40
                    } ],
                    40: [ function(t, e) {
                        "use strict";
                        function r(t) {
                            "undefined" != typeof console && null !== console && "function" == typeof console.warn && console.warn("Bluebird: " + t);
                        }
                        function i(t, e, r) {
                            try {
                                return t.call(e, r);
                            } catch (i) {
                                return m.e = i, m;
                            }
                        }
                        function n(t, e, r, i) {
                            try {
                                return t.call(e, r, i);
                            } catch (n) {
                                return m.e = n, m;
                            }
                        }
                        function o(t, e, r) {
                            try {
                                return t.apply(r, e);
                            } catch (i) {
                                return m.e = i, m;
                            }
                        }
                        function s(t) {
                            return "string" == typeof t ? t : "" + t;
                        }
                        function a(t) {
                            return null == t || t === !0 || t === !1 || "string" == typeof t || "number" == typeof t;
                        }
                        function u(t) {
                            return !a(t);
                        }
                        function c(t) {
                            return a(t) ? new Error(s(t)) : t;
                        }
                        function l(t, e) {
                            var r, i = t.length, n = new Array(i + 1);
                            for (r = 0; i > r; ++r) n[r] = t[r];
                            return n[r] = e, n;
                        }
                        function f(t, e, r) {
                            var i = {
                                value: r,
                                configurable: !0,
                                enumerable: !1,
                                writable: !0
                            };
                            return d.defineProperty(t, e, i), t;
                        }
                        function p(t) {
                            throw t;
                        }
                        var h = t("./global.js"), d = (t("./assert.js"), t("./es5.js")), _ = function() {
                            try {
                                var t = {};
                                return d.defineProperty(t, "f", {
                                    get: function() {
                                        return 3;
                                    }
                                }), 3 === t.f;
                            } catch (e) {
                                return !1;
                            }
                        }(), v = function(t, e, r) {
                            try {
                                return f(t, e, r), t;
                            } catch (i) {
                                for (var n = {}, o = d.keys(t), s = 0, a = o.length; a > s; ++s) try {
                                    var u = o[s];
                                    n[u] = t[u];
                                } catch (c) {
                                    n[u] = c;
                                }
                                return f(n, e, r), n;
                            }
                        }, y = function() {
                            return "undefined" != typeof window && null !== window && "undefined" != typeof window.document && "undefined" != typeof navigator && null !== navigator && "string" == typeof navigator.appName && window === h ? !1 : !0;
                        }(), m = {
                            e: {}
                        }, j = function(t, e) {
                            function r() {
                                this.constructor = t, this.constructor$ = e;
                                for (var r in e.prototype) i.call(e.prototype, r) && "$" !== r.charAt(r.length - 1) && (this[r + "$"] = e.prototype[r]);
                            }
                            var i = {}.hasOwnProperty;
                            return r.prototype = e.prototype, t.prototype = new r(), t.prototype;
                        }, g = function() {
                            return "string" !== this;
                        }.call("string"), b = {
                            thrower: p,
                            isArray: d.isArray,
                            haveGetters: _,
                            notEnumerableProp: f,
                            isPrimitive: a,
                            isObject: u,
                            ensurePropertyExpansion: v,
                            canEvaluate: y,
                            deprecated: r,
                            errorObj: m,
                            tryCatch1: i,
                            tryCatch2: n,
                            tryCatchApply: o,
                            inherits: j,
                            withAppended: l,
                            asString: s,
                            maybeWrapAsError: c,
                            wrapsPrimitiveReceiver: g
                        };
                        e.exports = b;
                    }, {
                        "./assert.js": 3,
                        "./es5.js": 13,
                        "./global.js": 17
                    } ],
                    41: [ function(t, e) {
                        function r(t, e) {
                            function r() {
                                4 === p.readyState && n();
                            }
                            function n() {
                                var t = null, r = p.statusCode = p.status, i = p.body = p.response || p.responseText || p.responseXML;
                                if (0 === r) {
                                    var n = p.responseText || u[String(p.status).charAt(0)];
                                    t = new Error(n), t.statusCode = p.status;
                                }
                                e(t, p, i);
                            }
                            function f(t) {
                                e(t, p);
                            }
                            "string" == typeof t && (t = {
                                uri: t
                            }), t = t || {}, e = o(e);
                            var p;
                            p = t.cors ? new l() : new c();
                            var h = p.url = t.uri, d = p.method = t.method || "GET", _ = t.body || t.data, v = p.headers = t.headers || {}, y = !!t.sync;
                            return p.onreadystatechange = r, p.onload = n, p.onerror = f, p.onprogress = function() {}, 
                            p.ontimeout = i, p.open(d, h, !y), t.cors && (p.withCredentials = !0), y || (p.timeout = "timeout" in t ? t.timeout : 5e3), 
                            p.setRequestHeader && a(s(v), function(t) {
                                p.setRequestHeader(t, v[t]);
                            }), p.send(_), p;
                        }
                        function i() {}
                        var n = t("global/window"), o = t("once"), s = t("lodash.keys"), a = t("lodash.foreach"), u = {
                            0: "Internal XMLHttpRequest Error"
                        }, c = n.XMLHttpRequest || i, l = "withCredentials" in new c() ? n.XMLHttpRequest : n.XDomainRequest;
                        e.exports = r;
                    }, {
                        "global/window": 42,
                        "lodash.foreach": 43,
                        "lodash.keys": 69,
                        once: 75
                    } ],
                    42: [ function(t, e) {
                        var r = "undefined" != typeof self ? self : "undefined" != typeof window ? window : {};
                        e.exports = "undefined" != typeof window ? window : "undefined" != typeof r ? r : {};
                    }, {} ],
                    43: [ function(t, e) {
                        function r(t, e, r) {
                            var o = -1, s = t ? t.length : 0;
                            if (e = e && "undefined" == typeof r ? e : i(e, r, 3), "number" == typeof s) for (;++o < s && e(t[o], o, t) !== !1; ) ; else n(t, e);
                            return t;
                        }
                        var i = t("lodash._basecreatecallback"), n = t("lodash.forown");
                        e.exports = r;
                    }, {
                        "lodash._basecreatecallback": 44,
                        "lodash.forown": 67
                    } ],
                    44: [ function(t, e) {
                        function r(t, e, r) {
                            if ("function" != typeof t) return n;
                            if ("undefined" == typeof e || !("prototype" in t)) return t;
                            var l = t.__bindData__;
                            if ("undefined" == typeof l && (s.funcNames && (l = !t.name), l = l || !s.funcDecomp, 
                            !l)) {
                                var f = c.call(t);
                                s.funcNames || (l = !a.test(f)), l || (l = u.test(f), o(t, l));
                            }
                            if (l === !1 || l !== !0 && 1 & l[1]) return t;
                            switch (r) {
                              case 1:
                                return function(r) {
                                    return t.call(e, r);
                                };

                              case 2:
                                return function(r, i) {
                                    return t.call(e, r, i);
                                };

                              case 3:
                                return function(r, i, n) {
                                    return t.call(e, r, i, n);
                                };

                              case 4:
                                return function(r, i, n, o) {
                                    return t.call(e, r, i, n, o);
                                };
                            }
                            return i(t, e);
                        }
                        var i = t("lodash.bind"), n = t("lodash.identity"), o = t("lodash._setbinddata"), s = t("lodash.support"), a = /^\s*function[ \n\r\t]+\w/, u = /\bthis\b/, c = Function.prototype.toString;
                        e.exports = r;
                    }, {
                        "lodash._setbinddata": 45,
                        "lodash.bind": 48,
                        "lodash.identity": 64,
                        "lodash.support": 65
                    } ],
                    45: [ function(t, e) {
                        var r = t("lodash._isnative"), i = t("lodash.noop"), n = {
                            configurable: !1,
                            enumerable: !1,
                            value: null,
                            writable: !1
                        }, o = function() {
                            try {
                                var t = {}, e = r(e = Object.defineProperty) && e, i = e(t, t, t) && e;
                            } catch (n) {}
                            return i;
                        }(), s = o ? function(t, e) {
                            n.value = e, o(t, "__bindData__", n);
                        } : i;
                        e.exports = s;
                    }, {
                        "lodash._isnative": 46,
                        "lodash.noop": 47
                    } ],
                    46: [ function(t, e) {
                        function r(t) {
                            return "function" == typeof t && o.test(t);
                        }
                        var i = Object.prototype, n = i.toString, o = RegExp("^" + String(n).replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/toString| for [^\]]+/g, ".*?") + "$");
                        e.exports = r;
                    }, {} ],
                    47: [ function(t, e) {
                        function r() {}
                        e.exports = r;
                    }, {} ],
                    48: [ function(t, e) {
                        function r(t, e) {
                            return arguments.length > 2 ? i(t, 17, n(arguments, 2), null, e) : i(t, 1, null, null, e);
                        }
                        var i = t("lodash._createwrapper"), n = t("lodash._slice");
                        e.exports = r;
                    }, {
                        "lodash._createwrapper": 49,
                        "lodash._slice": 63
                    } ],
                    49: [ function(t, e) {
                        function r(t, e, a, l, f, p) {
                            var h = 1 & e, d = 2 & e, _ = 4 & e, v = 16 & e, y = 32 & e;
                            if (!d && !o(t)) throw new TypeError();
                            v && !a.length && (e &= -17, v = a = !1), y && !l.length && (e &= -33, y = l = !1);
                            var m = t && t.__bindData__;
                            if (m && m !== !0) return m = s(m), m[2] && (m[2] = s(m[2])), m[3] && (m[3] = s(m[3])), 
                            !h || 1 & m[1] || (m[4] = f), !h && 1 & m[1] && (e |= 8), !_ || 4 & m[1] || (m[5] = p), 
                            v && u.apply(m[2] || (m[2] = []), a), y && c.apply(m[3] || (m[3] = []), l), m[1] |= e, 
                            r.apply(null, m);
                            var j = 1 == e || 17 === e ? i : n;
                            return j([ t, e, a, l, f, p ]);
                        }
                        var i = t("lodash._basebind"), n = t("lodash._basecreatewrapper"), o = t("lodash.isfunction"), s = t("lodash._slice"), a = [], u = a.push, c = a.unshift;
                        e.exports = r;
                    }, {
                        "lodash._basebind": 50,
                        "lodash._basecreatewrapper": 56,
                        "lodash._slice": 63,
                        "lodash.isfunction": 62
                    } ],
                    50: [ function(t, e) {
                        function r(t) {
                            function e() {
                                if (a) {
                                    var t = s(a);
                                    u.apply(t, arguments);
                                }
                                if (this instanceof e) {
                                    var o = i(r.prototype), l = r.apply(o, t || arguments);
                                    return n(l) ? l : o;
                                }
                                return r.apply(c, t || arguments);
                            }
                            var r = t[0], a = t[2], c = t[4];
                            return o(e, t), e;
                        }
                        var i = t("lodash._basecreate"), n = t("lodash.isobject"), o = t("lodash._setbinddata"), s = t("lodash._slice"), a = [], u = a.push;
                        e.exports = r;
                    }, {
                        "lodash._basecreate": 51,
                        "lodash._setbinddata": 45,
                        "lodash._slice": 63,
                        "lodash.isobject": 54
                    } ],
                    51: [ function(t, e) {
                        function r(t) {
                            return o(t) ? s(t) : {};
                        }
                        var i = "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, n = t("lodash._isnative"), o = t("lodash.isobject"), s = (t("lodash.noop"), 
                        n(s = Object.create) && s);
                        s || (r = function() {
                            function t() {}
                            return function(e) {
                                if (o(e)) {
                                    t.prototype = e;
                                    var r = new t();
                                    t.prototype = null;
                                }
                                return r || i.Object();
                            };
                        }()), e.exports = r;
                    }, {
                        "lodash._isnative": 52,
                        "lodash.isobject": 54,
                        "lodash.noop": 53
                    } ],
                    52: [ function(t, e) {
                        e.exports = t(46);
                    }, {} ],
                    53: [ function(t, e) {
                        e.exports = t(47);
                    }, {} ],
                    54: [ function(t, e) {
                        function r(t) {
                            return !(!t || !i[typeof t]);
                        }
                        var i = t("lodash._objecttypes");
                        e.exports = r;
                    }, {
                        "lodash._objecttypes": 55
                    } ],
                    55: [ function(t, e) {
                        var r = {
                            "boolean": !1,
                            "function": !0,
                            object: !0,
                            number: !1,
                            string: !1,
                            undefined: !1
                        };
                        e.exports = r;
                    }, {} ],
                    56: [ function(t, e) {
                        function r(t) {
                            function e() {
                                var t = d ? p : this;
                                if (l) {
                                    var o = s(l);
                                    u.apply(o, arguments);
                                }
                                if ((f || v) && (o || (o = s(arguments)), f && u.apply(o, f), v && o.length < h)) return c |= 16, 
                                r([ a, y ? c : -4 & c, o, null, p, h ]);
                                if (o || (o = arguments), _ && (a = t[m]), this instanceof e) {
                                    t = i(a.prototype);
                                    var j = a.apply(t, o);
                                    return n(j) ? j : t;
                                }
                                return a.apply(t, o);
                            }
                            var a = t[0], c = t[1], l = t[2], f = t[3], p = t[4], h = t[5], d = 1 & c, _ = 2 & c, v = 4 & c, y = 8 & c, m = a;
                            return o(e, t), e;
                        }
                        var i = t("lodash._basecreate"), n = t("lodash.isobject"), o = t("lodash._setbinddata"), s = t("lodash._slice"), a = [], u = a.push;
                        e.exports = r;
                    }, {
                        "lodash._basecreate": 57,
                        "lodash._setbinddata": 45,
                        "lodash._slice": 63,
                        "lodash.isobject": 60
                    } ],
                    57: [ function(t, e, r) {
                        arguments[4][51][0].apply(r, arguments);
                    }, {
                        "lodash._isnative": 58,
                        "lodash.isobject": 60,
                        "lodash.noop": 59
                    } ],
                    58: [ function(t, e) {
                        e.exports = t(46);
                    }, {} ],
                    59: [ function(t, e) {
                        e.exports = t(47);
                    }, {} ],
                    60: [ function(t, e) {
                        e.exports = t(54);
                    }, {
                        "lodash._objecttypes": 61
                    } ],
                    61: [ function(t, e) {
                        e.exports = t(55);
                    }, {} ],
                    62: [ function(t, e) {
                        function r(t) {
                            return "function" == typeof t;
                        }
                        e.exports = r;
                    }, {} ],
                    63: [ function(t, e) {
                        function r(t, e, r) {
                            e || (e = 0), "undefined" == typeof r && (r = t ? t.length : 0);
                            for (var i = -1, n = r - e || 0, o = Array(0 > n ? 0 : n); ++i < n; ) o[i] = t[e + i];
                            return o;
                        }
                        e.exports = r;
                    }, {} ],
                    64: [ function(t, e) {
                        function r(t) {
                            return t;
                        }
                        e.exports = r;
                    }, {} ],
                    65: [ function(t, e) {
                        var r = "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, i = t("lodash._isnative"), n = /\bthis\b/, o = {};
                        o.funcDecomp = !i(r.WinRTError) && n.test(function() {
                            return this;
                        }), o.funcNames = "string" == typeof Function.name, e.exports = o;
                    }, {
                        "lodash._isnative": 66
                    } ],
                    66: [ function(t, e) {
                        e.exports = t(46);
                    }, {} ],
                    67: [ function(t, e) {
                        var r = t("lodash._basecreatecallback"), i = t("lodash.keys"), n = t("lodash._objecttypes"), o = function(t, e, o) {
                            var s, a = t, u = a;
                            if (!a) return u;
                            if (!n[typeof a]) return u;
                            e = e && "undefined" == typeof o ? e : r(e, o, 3);
                            for (var c = -1, l = n[typeof a] && i(a), f = l ? l.length : 0; ++c < f; ) if (s = l[c], 
                            e(a[s], s, t) === !1) return u;
                            return u;
                        };
                        e.exports = o;
                    }, {
                        "lodash._basecreatecallback": 44,
                        "lodash._objecttypes": 68,
                        "lodash.keys": 69
                    } ],
                    68: [ function(t, e) {
                        e.exports = t(55);
                    }, {} ],
                    69: [ function(t, e) {
                        var r = t("lodash._isnative"), i = t("lodash.isobject"), n = t("lodash._shimkeys"), o = r(o = Object.keys) && o, s = o ? function(t) {
                            return i(t) ? o(t) : [];
                        } : n;
                        e.exports = s;
                    }, {
                        "lodash._isnative": 70,
                        "lodash._shimkeys": 71,
                        "lodash.isobject": 73
                    } ],
                    70: [ function(t, e) {
                        e.exports = t(46);
                    }, {} ],
                    71: [ function(t, e) {
                        var r = t("lodash._objecttypes"), i = Object.prototype, n = i.hasOwnProperty, o = function(t) {
                            var e, i = t, o = [];
                            if (!i) return o;
                            if (!r[typeof t]) return o;
                            for (e in i) n.call(i, e) && o.push(e);
                            return o;
                        };
                        e.exports = o;
                    }, {
                        "lodash._objecttypes": 72
                    } ],
                    72: [ function(t, e) {
                        e.exports = t(55);
                    }, {} ],
                    73: [ function(t, e) {
                        e.exports = t(54);
                    }, {
                        "lodash._objecttypes": 74
                    } ],
                    74: [ function(t, e) {
                        e.exports = t(55);
                    }, {} ],
                    75: [ function(t, e) {
                        function r(t) {
                            var e = !1;
                            return function() {
                                return e ? void 0 : (e = !0, t.apply(this, arguments));
                            };
                        }
                        e.exports = r, r.proto = r(function() {
                            Object.defineProperty(Function.prototype, "once", {
                                value: function() {
                                    return r(this);
                                },
                                configurable: !0
                            });
                        });
                    }, {} ],
                    76: [ function(t, e) {
                        var r = e.exports = {};
                        r.nextTick = function() {
                            var t = "undefined" != typeof window && window.setImmediate, e = "undefined" != typeof window && window.postMessage && window.addEventListener;
                            if (t) return function(t) {
                                return window.setImmediate(t);
                            };
                            if (e) {
                                var r = [];
                                return window.addEventListener("message", function(t) {
                                    var e = t.source;
                                    if ((e === window || null === e) && "process-tick" === t.data && (t.stopPropagation(), 
                                    r.length > 0)) {
                                        var i = r.shift();
                                        i();
                                    }
                                }, !0), function(t) {
                                    r.push(t), window.postMessage("process-tick", "*");
                                };
                            }
                            return function(t) {
                                setTimeout(t, 0);
                            };
                        }(), r.title = "browser", r.browser = !0, r.env = {}, r.argv = [], r.binding = function() {
                            throw new Error("process.binding is not supported");
                        }, r.cwd = function() {
                            return "/";
                        }, r.chdir = function() {
                            throw new Error("process.chdir is not supported");
                        };
                    }, {} ]
                }, {}, [ 1 ])(1);
            });
        }, {} ],
        20: [ function(require, module, exports) {
            "use strict";
            function hasOwnProperty(obj, prop) {
                return Object.prototype.hasOwnProperty.call(obj, prop);
            }
            module.exports = function(qs, sep, eq, options) {
                sep = sep || "&";
                eq = eq || "=";
                var obj = {};
                if (typeof qs !== "string" || qs.length === 0) {
                    return obj;
                }
                var regexp = /\+/g;
                qs = qs.split(sep);
                var maxKeys = 1e3;
                if (options && typeof options.maxKeys === "number") {
                    maxKeys = options.maxKeys;
                }
                var len = qs.length;
                if (maxKeys > 0 && len > maxKeys) {
                    len = maxKeys;
                }
                for (var i = 0; i < len; ++i) {
                    var x = qs[i].replace(regexp, "%20"), idx = x.indexOf(eq), kstr, vstr, k, v;
                    if (idx >= 0) {
                        kstr = x.substr(0, idx);
                        vstr = x.substr(idx + 1);
                    } else {
                        kstr = x;
                        vstr = "";
                    }
                    k = decodeURIComponent(kstr);
                    v = decodeURIComponent(vstr);
                    if (!hasOwnProperty(obj, k)) {
                        obj[k] = v;
                    } else if (isArray(obj[k])) {
                        obj[k].push(v);
                    } else {
                        obj[k] = [ obj[k], v ];
                    }
                }
                return obj;
            };
            var isArray = Array.isArray || function(xs) {
                return Object.prototype.toString.call(xs) === "[object Array]";
            };
        }, {} ],
        21: [ function(require, module, exports) {
            "use strict";
            var stringifyPrimitive = function(v) {
                switch (typeof v) {
                  case "string":
                    return v;

                  case "boolean":
                    return v ? "true" : "false";

                  case "number":
                    return isFinite(v) ? v : "";

                  default:
                    return "";
                }
            };
            module.exports = function(obj, sep, eq, name) {
                sep = sep || "&";
                eq = eq || "=";
                if (obj === null) {
                    obj = undefined;
                }
                if (typeof obj === "object") {
                    return map(objectKeys(obj), function(k) {
                        var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
                        if (isArray(obj[k])) {
                            return obj[k].map(function(v) {
                                return ks + encodeURIComponent(stringifyPrimitive(v));
                            }).join(sep);
                        } else {
                            return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
                        }
                    }).join(sep);
                }
                if (!name) return "";
                return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
            };
            var isArray = Array.isArray || function(xs) {
                return Object.prototype.toString.call(xs) === "[object Array]";
            };
            function map(xs, f) {
                if (xs.map) return xs.map(f);
                var res = [];
                for (var i = 0; i < xs.length; i++) {
                    res.push(f(xs[i], i));
                }
                return res;
            }
            var objectKeys = Object.keys || function(obj) {
                var res = [];
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
                }
                return res;
            };
        }, {} ],
        22: [ function(require, module, exports) {
            "use strict";
            exports.decode = exports.parse = require("./decode");
            exports.encode = exports.stringify = require("./encode");
        }, {
            "./decode": 20,
            "./encode": 21
        } ]
    }, {}, [ 1 ])(1);
});

/**
 * @license AngularJS v1.2.24-build.407+sha.7e239f9
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {
    "use strict";
    angular.mock = {};
    angular.mock.$BrowserProvider = function() {
        this.$get = function() {
            return new angular.mock.$Browser();
        };
    };
    angular.mock.$Browser = function() {
        var self = this;
        this.isMock = true;
        self.$$url = "http://server/";
        self.$$lastUrl = self.$$url;
        self.pollFns = [];
        self.$$completeOutstandingRequest = angular.noop;
        self.$$incOutstandingRequestCount = angular.noop;
        self.onUrlChange = function(listener) {
            self.pollFns.push(function() {
                if (self.$$lastUrl != self.$$url) {
                    self.$$lastUrl = self.$$url;
                    listener(self.$$url);
                }
            });
            return listener;
        };
        self.cookieHash = {};
        self.lastCookieHash = {};
        self.deferredFns = [];
        self.deferredNextId = 0;
        self.defer = function(fn, delay) {
            delay = delay || 0;
            self.deferredFns.push({
                time: self.defer.now + delay,
                fn: fn,
                id: self.deferredNextId
            });
            self.deferredFns.sort(function(a, b) {
                return a.time - b.time;
            });
            return self.deferredNextId++;
        };
        self.defer.now = 0;
        self.defer.cancel = function(deferId) {
            var fnIndex;
            angular.forEach(self.deferredFns, function(fn, index) {
                if (fn.id === deferId) fnIndex = index;
            });
            if (fnIndex !== undefined) {
                self.deferredFns.splice(fnIndex, 1);
                return true;
            }
            return false;
        };
        self.defer.flush = function(delay) {
            if (angular.isDefined(delay)) {
                self.defer.now += delay;
            } else {
                if (self.deferredFns.length) {
                    self.defer.now = self.deferredFns[self.deferredFns.length - 1].time;
                } else {
                    throw new Error("No deferred tasks to be flushed");
                }
            }
            while (self.deferredFns.length && self.deferredFns[0].time <= self.defer.now) {
                self.deferredFns.shift().fn();
            }
        };
        self.$$baseHref = "";
        self.baseHref = function() {
            return this.$$baseHref;
        };
    };
    angular.mock.$Browser.prototype = {
        poll: function poll() {
            angular.forEach(this.pollFns, function(pollFn) {
                pollFn();
            });
        },
        addPollFn: function(pollFn) {
            this.pollFns.push(pollFn);
            return pollFn;
        },
        url: function(url, replace) {
            if (url) {
                this.$$url = url;
                return this;
            }
            return this.$$url;
        },
        cookies: function(name, value) {
            if (name) {
                if (angular.isUndefined(value)) {
                    delete this.cookieHash[name];
                } else {
                    if (angular.isString(value) && value.length <= 4096) {
                        this.cookieHash[name] = value;
                    }
                }
            } else {
                if (!angular.equals(this.cookieHash, this.lastCookieHash)) {
                    this.lastCookieHash = angular.copy(this.cookieHash);
                    this.cookieHash = angular.copy(this.cookieHash);
                }
                return this.cookieHash;
            }
        },
        notifyWhenNoOutstandingRequests: function(fn) {
            fn();
        }
    };
    angular.mock.$ExceptionHandlerProvider = function() {
        var handler;
        this.mode = function(mode) {
            switch (mode) {
              case "rethrow":
                handler = function(e) {
                    throw e;
                };
                break;

              case "log":
                var errors = [];
                handler = function(e) {
                    if (arguments.length == 1) {
                        errors.push(e);
                    } else {
                        errors.push([].slice.call(arguments, 0));
                    }
                };
                handler.errors = errors;
                break;

              default:
                throw new Error("Unknown mode '" + mode + "', only 'log'/'rethrow' modes are allowed!");
            }
        };
        this.$get = function() {
            return handler;
        };
        this.mode("rethrow");
    };
    angular.mock.$LogProvider = function() {
        var debug = true;
        function concat(array1, array2, index) {
            return array1.concat(Array.prototype.slice.call(array2, index));
        }
        this.debugEnabled = function(flag) {
            if (angular.isDefined(flag)) {
                debug = flag;
                return this;
            } else {
                return debug;
            }
        };
        this.$get = function() {
            var $log = {
                log: function() {
                    $log.log.logs.push(concat([], arguments, 0));
                },
                warn: function() {
                    $log.warn.logs.push(concat([], arguments, 0));
                },
                info: function() {
                    $log.info.logs.push(concat([], arguments, 0));
                },
                error: function() {
                    $log.error.logs.push(concat([], arguments, 0));
                },
                debug: function() {
                    if (debug) {
                        $log.debug.logs.push(concat([], arguments, 0));
                    }
                }
            };
            $log.reset = function() {
                $log.log.logs = [];
                $log.info.logs = [];
                $log.warn.logs = [];
                $log.error.logs = [];
                $log.debug.logs = [];
            };
            $log.assertEmpty = function() {
                var errors = [];
                angular.forEach([ "error", "warn", "info", "log", "debug" ], function(logLevel) {
                    angular.forEach($log[logLevel].logs, function(log) {
                        angular.forEach(log, function(logItem) {
                            errors.push("MOCK $log (" + logLevel + "): " + String(logItem) + "\n" + (logItem.stack || ""));
                        });
                    });
                });
                if (errors.length) {
                    errors.unshift("Expected $log to be empty! Either a message was logged unexpectedly, or " + "an expected log message was not checked and removed:");
                    errors.push("");
                    throw new Error(errors.join("\n---------\n"));
                }
            };
            $log.reset();
            return $log;
        };
    };
    angular.mock.$IntervalProvider = function() {
        this.$get = [ "$rootScope", "$q", function($rootScope, $q) {
            var repeatFns = [], nextRepeatId = 0, now = 0;
            var $interval = function(fn, delay, count, invokeApply) {
                var deferred = $q.defer(), promise = deferred.promise, iteration = 0, skipApply = angular.isDefined(invokeApply) && !invokeApply;
                count = angular.isDefined(count) ? count : 0;
                promise.then(null, null, fn);
                promise.$$intervalId = nextRepeatId;
                function tick() {
                    deferred.notify(iteration++);
                    if (count > 0 && iteration >= count) {
                        var fnIndex;
                        deferred.resolve(iteration);
                        angular.forEach(repeatFns, function(fn, index) {
                            if (fn.id === promise.$$intervalId) fnIndex = index;
                        });
                        if (fnIndex !== undefined) {
                            repeatFns.splice(fnIndex, 1);
                        }
                    }
                    if (!skipApply) $rootScope.$apply();
                }
                repeatFns.push({
                    nextTime: now + delay,
                    delay: delay,
                    fn: tick,
                    id: nextRepeatId,
                    deferred: deferred
                });
                repeatFns.sort(function(a, b) {
                    return a.nextTime - b.nextTime;
                });
                nextRepeatId++;
                return promise;
            };
            $interval.cancel = function(promise) {
                if (!promise) return false;
                var fnIndex;
                angular.forEach(repeatFns, function(fn, index) {
                    if (fn.id === promise.$$intervalId) fnIndex = index;
                });
                if (fnIndex !== undefined) {
                    repeatFns[fnIndex].deferred.reject("canceled");
                    repeatFns.splice(fnIndex, 1);
                    return true;
                }
                return false;
            };
            $interval.flush = function(millis) {
                now += millis;
                while (repeatFns.length && repeatFns[0].nextTime <= now) {
                    var task = repeatFns[0];
                    task.fn();
                    task.nextTime += task.delay;
                    repeatFns.sort(function(a, b) {
                        return a.nextTime - b.nextTime;
                    });
                }
                return millis;
            };
            return $interval;
        } ];
    };
    var R_ISO8061_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?:\:?(\d\d)(?:\:?(\d\d)(?:\.(\d{3}))?)?)?(Z|([+-])(\d\d):?(\d\d)))?$/;
    function jsonStringToDate(string) {
        var match;
        if (match = string.match(R_ISO8061_STR)) {
            var date = new Date(0), tzHour = 0, tzMin = 0;
            if (match[9]) {
                tzHour = int(match[9] + match[10]);
                tzMin = int(match[9] + match[11]);
            }
            date.setUTCFullYear(int(match[1]), int(match[2]) - 1, int(match[3]));
            date.setUTCHours(int(match[4] || 0) - tzHour, int(match[5] || 0) - tzMin, int(match[6] || 0), int(match[7] || 0));
            return date;
        }
        return string;
    }
    function int(str) {
        return parseInt(str, 10);
    }
    function padNumber(num, digits, trim) {
        var neg = "";
        if (num < 0) {
            neg = "-";
            num = -num;
        }
        num = "" + num;
        while (num.length < digits) num = "0" + num;
        if (trim) num = num.substr(num.length - digits);
        return neg + num;
    }
    angular.mock.TzDate = function(offset, timestamp) {
        var self = new Date(0);
        if (angular.isString(timestamp)) {
            var tsStr = timestamp;
            self.origDate = jsonStringToDate(timestamp);
            timestamp = self.origDate.getTime();
            if (isNaN(timestamp)) throw {
                name: "Illegal Argument",
                message: "Arg '" + tsStr + "' passed into TzDate constructor is not a valid date string"
            };
        } else {
            self.origDate = new Date(timestamp);
        }
        var localOffset = new Date(timestamp).getTimezoneOffset();
        self.offsetDiff = localOffset * 60 * 1e3 - offset * 1e3 * 60 * 60;
        self.date = new Date(timestamp + self.offsetDiff);
        self.getTime = function() {
            return self.date.getTime() - self.offsetDiff;
        };
        self.toLocaleDateString = function() {
            return self.date.toLocaleDateString();
        };
        self.getFullYear = function() {
            return self.date.getFullYear();
        };
        self.getMonth = function() {
            return self.date.getMonth();
        };
        self.getDate = function() {
            return self.date.getDate();
        };
        self.getHours = function() {
            return self.date.getHours();
        };
        self.getMinutes = function() {
            return self.date.getMinutes();
        };
        self.getSeconds = function() {
            return self.date.getSeconds();
        };
        self.getMilliseconds = function() {
            return self.date.getMilliseconds();
        };
        self.getTimezoneOffset = function() {
            return offset * 60;
        };
        self.getUTCFullYear = function() {
            return self.origDate.getUTCFullYear();
        };
        self.getUTCMonth = function() {
            return self.origDate.getUTCMonth();
        };
        self.getUTCDate = function() {
            return self.origDate.getUTCDate();
        };
        self.getUTCHours = function() {
            return self.origDate.getUTCHours();
        };
        self.getUTCMinutes = function() {
            return self.origDate.getUTCMinutes();
        };
        self.getUTCSeconds = function() {
            return self.origDate.getUTCSeconds();
        };
        self.getUTCMilliseconds = function() {
            return self.origDate.getUTCMilliseconds();
        };
        self.getDay = function() {
            return self.date.getDay();
        };
        if (self.toISOString) {
            self.toISOString = function() {
                return padNumber(self.origDate.getUTCFullYear(), 4) + "-" + padNumber(self.origDate.getUTCMonth() + 1, 2) + "-" + padNumber(self.origDate.getUTCDate(), 2) + "T" + padNumber(self.origDate.getUTCHours(), 2) + ":" + padNumber(self.origDate.getUTCMinutes(), 2) + ":" + padNumber(self.origDate.getUTCSeconds(), 2) + "." + padNumber(self.origDate.getUTCMilliseconds(), 3) + "Z";
            };
        }
        var unimplementedMethods = [ "getUTCDay", "getYear", "setDate", "setFullYear", "setHours", "setMilliseconds", "setMinutes", "setMonth", "setSeconds", "setTime", "setUTCDate", "setUTCFullYear", "setUTCHours", "setUTCMilliseconds", "setUTCMinutes", "setUTCMonth", "setUTCSeconds", "setYear", "toDateString", "toGMTString", "toJSON", "toLocaleFormat", "toLocaleString", "toLocaleTimeString", "toSource", "toString", "toTimeString", "toUTCString", "valueOf" ];
        angular.forEach(unimplementedMethods, function(methodName) {
            self[methodName] = function() {
                throw new Error("Method '" + methodName + "' is not implemented in the TzDate mock");
            };
        });
        return self;
    };
    angular.mock.TzDate.prototype = Date.prototype;
    angular.mock.animate = angular.module("ngAnimateMock", [ "ng" ]).config([ "$provide", function($provide) {
        var reflowQueue = [];
        $provide.value("$$animateReflow", function(fn) {
            var index = reflowQueue.length;
            reflowQueue.push(fn);
            return function cancel() {
                reflowQueue.splice(index, 1);
            };
        });
        $provide.decorator("$animate", function($delegate, $$asyncCallback) {
            var animate = {
                queue: [],
                enabled: $delegate.enabled,
                triggerCallbacks: function() {
                    $$asyncCallback.flush();
                },
                triggerReflow: function() {
                    angular.forEach(reflowQueue, function(fn) {
                        fn();
                    });
                    reflowQueue = [];
                }
            };
            angular.forEach([ "enter", "leave", "move", "addClass", "removeClass", "setClass" ], function(method) {
                animate[method] = function() {
                    animate.queue.push({
                        event: method,
                        element: arguments[0],
                        args: arguments
                    });
                    $delegate[method].apply($delegate, arguments);
                };
            });
            return animate;
        });
    } ]);
    angular.mock.dump = function(object) {
        return serialize(object);
        function serialize(object) {
            var out;
            if (angular.isElement(object)) {
                object = angular.element(object);
                out = angular.element("<div></div>");
                angular.forEach(object, function(element) {
                    out.append(angular.element(element).clone());
                });
                out = out.html();
            } else if (angular.isArray(object)) {
                out = [];
                angular.forEach(object, function(o) {
                    out.push(serialize(o));
                });
                out = "[ " + out.join(", ") + " ]";
            } else if (angular.isObject(object)) {
                if (angular.isFunction(object.$eval) && angular.isFunction(object.$apply)) {
                    out = serializeScope(object);
                } else if (object instanceof Error) {
                    out = object.stack || "" + object.name + ": " + object.message;
                } else {
                    out = angular.toJson(object, true);
                }
            } else {
                out = String(object);
            }
            return out;
        }
        function serializeScope(scope, offset) {
            offset = offset || "  ";
            var log = [ offset + "Scope(" + scope.$id + "): {" ];
            for (var key in scope) {
                if (Object.prototype.hasOwnProperty.call(scope, key) && !key.match(/^(\$|this)/)) {
                    log.push("  " + key + ": " + angular.toJson(scope[key]));
                }
            }
            var child = scope.$$childHead;
            while (child) {
                log.push(serializeScope(child, offset + "  "));
                child = child.$$nextSibling;
            }
            log.push("}");
            return log.join("\n" + offset);
        }
    };
    angular.mock.$HttpBackendProvider = function() {
        this.$get = [ "$rootScope", createHttpBackendMock ];
    };
    function createHttpBackendMock($rootScope, $delegate, $browser) {
        var definitions = [], expectations = [], responses = [], responsesPush = angular.bind(responses, responses.push), copy = angular.copy;
        function createResponse(status, data, headers, statusText) {
            if (angular.isFunction(status)) return status;
            return function() {
                return angular.isNumber(status) ? [ status, data, headers, statusText ] : [ 200, status, data ];
            };
        }
        function $httpBackend(method, url, data, callback, headers, timeout, withCredentials) {
            var xhr = new MockXhr(), expectation = expectations[0], wasExpected = false;
            function prettyPrint(data) {
                return angular.isString(data) || angular.isFunction(data) || data instanceof RegExp ? data : angular.toJson(data);
            }
            function wrapResponse(wrapped) {
                if (!$browser && timeout && timeout.then) timeout.then(handleTimeout);
                return handleResponse;
                function handleResponse() {
                    var response = wrapped.response(method, url, data, headers);
                    xhr.$$respHeaders = response[2];
                    callback(copy(response[0]), copy(response[1]), xhr.getAllResponseHeaders(), copy(response[3] || ""));
                }
                function handleTimeout() {
                    for (var i = 0, ii = responses.length; i < ii; i++) {
                        if (responses[i] === handleResponse) {
                            responses.splice(i, 1);
                            callback(-1, undefined, "");
                            break;
                        }
                    }
                }
            }
            if (expectation && expectation.match(method, url)) {
                if (!expectation.matchData(data)) throw new Error("Expected " + expectation + " with different data\n" + "EXPECTED: " + prettyPrint(expectation.data) + "\nGOT:      " + data);
                if (!expectation.matchHeaders(headers)) throw new Error("Expected " + expectation + " with different headers\n" + "EXPECTED: " + prettyPrint(expectation.headers) + "\nGOT:      " + prettyPrint(headers));
                expectations.shift();
                if (expectation.response) {
                    responses.push(wrapResponse(expectation));
                    return;
                }
                wasExpected = true;
            }
            var i = -1, definition;
            while (definition = definitions[++i]) {
                if (definition.match(method, url, data, headers || {})) {
                    if (definition.response) {
                        ($browser ? $browser.defer : responsesPush)(wrapResponse(definition));
                    } else if (definition.passThrough) {
                        $delegate(method, url, data, callback, headers, timeout, withCredentials);
                    } else throw new Error("No response defined !");
                    return;
                }
            }
            throw wasExpected ? new Error("No response defined !") : new Error("Unexpected request: " + method + " " + url + "\n" + (expectation ? "Expected " + expectation : "No more request expected"));
        }
        $httpBackend.when = function(method, url, data, headers) {
            var definition = new MockHttpExpectation(method, url, data, headers), chain = {
                respond: function(status, data, headers, statusText) {
                    definition.response = createResponse(status, data, headers, statusText);
                }
            };
            if ($browser) {
                chain.passThrough = function() {
                    definition.passThrough = true;
                };
            }
            definitions.push(definition);
            return chain;
        };
        createShortMethods("when");
        $httpBackend.expect = function(method, url, data, headers) {
            var expectation = new MockHttpExpectation(method, url, data, headers);
            expectations.push(expectation);
            return {
                respond: function(status, data, headers, statusText) {
                    expectation.response = createResponse(status, data, headers, statusText);
                }
            };
        };
        createShortMethods("expect");
        $httpBackend.flush = function(count) {
            $rootScope.$digest();
            if (!responses.length) throw new Error("No pending request to flush !");
            if (angular.isDefined(count)) {
                while (count--) {
                    if (!responses.length) throw new Error("No more pending request to flush !");
                    responses.shift()();
                }
            } else {
                while (responses.length) {
                    responses.shift()();
                }
            }
            $httpBackend.verifyNoOutstandingExpectation();
        };
        $httpBackend.verifyNoOutstandingExpectation = function() {
            $rootScope.$digest();
            if (expectations.length) {
                throw new Error("Unsatisfied requests: " + expectations.join(", "));
            }
        };
        $httpBackend.verifyNoOutstandingRequest = function() {
            if (responses.length) {
                throw new Error("Unflushed requests: " + responses.length);
            }
        };
        $httpBackend.resetExpectations = function() {
            expectations.length = 0;
            responses.length = 0;
        };
        return $httpBackend;
        function createShortMethods(prefix) {
            angular.forEach([ "GET", "DELETE", "JSONP" ], function(method) {
                $httpBackend[prefix + method] = function(url, headers) {
                    return $httpBackend[prefix](method, url, undefined, headers);
                };
            });
            angular.forEach([ "PUT", "POST", "PATCH" ], function(method) {
                $httpBackend[prefix + method] = function(url, data, headers) {
                    return $httpBackend[prefix](method, url, data, headers);
                };
            });
        }
    }
    function MockHttpExpectation(method, url, data, headers) {
        this.data = data;
        this.headers = headers;
        this.match = function(m, u, d, h) {
            if (method != m) return false;
            if (!this.matchUrl(u)) return false;
            if (angular.isDefined(d) && !this.matchData(d)) return false;
            if (angular.isDefined(h) && !this.matchHeaders(h)) return false;
            return true;
        };
        this.matchUrl = function(u) {
            if (!url) return true;
            if (angular.isFunction(url.test)) return url.test(u);
            return url == u;
        };
        this.matchHeaders = function(h) {
            if (angular.isUndefined(headers)) return true;
            if (angular.isFunction(headers)) return headers(h);
            return angular.equals(headers, h);
        };
        this.matchData = function(d) {
            if (angular.isUndefined(data)) return true;
            if (data && angular.isFunction(data.test)) return data.test(d);
            if (data && angular.isFunction(data)) return data(d);
            if (data && !angular.isString(data)) return angular.equals(data, angular.fromJson(d));
            return data == d;
        };
        this.toString = function() {
            return method + " " + url;
        };
    }
    function createMockXhr() {
        return new MockXhr();
    }
    function MockXhr() {
        MockXhr.$$lastInstance = this;
        this.open = function(method, url, async) {
            this.$$method = method;
            this.$$url = url;
            this.$$async = async;
            this.$$reqHeaders = {};
            this.$$respHeaders = {};
        };
        this.send = function(data) {
            this.$$data = data;
        };
        this.setRequestHeader = function(key, value) {
            this.$$reqHeaders[key] = value;
        };
        this.getResponseHeader = function(name) {
            var header = this.$$respHeaders[name];
            if (header) return header;
            name = angular.lowercase(name);
            header = this.$$respHeaders[name];
            if (header) return header;
            header = undefined;
            angular.forEach(this.$$respHeaders, function(headerVal, headerName) {
                if (!header && angular.lowercase(headerName) == name) header = headerVal;
            });
            return header;
        };
        this.getAllResponseHeaders = function() {
            var lines = [];
            angular.forEach(this.$$respHeaders, function(value, key) {
                lines.push(key + ": " + value);
            });
            return lines.join("\n");
        };
        this.abort = angular.noop;
    }
    angular.mock.$TimeoutDecorator = function($delegate, $browser) {
        $delegate.flush = function(delay) {
            $browser.defer.flush(delay);
        };
        $delegate.verifyNoPendingTasks = function() {
            if ($browser.deferredFns.length) {
                throw new Error("Deferred tasks to flush (" + $browser.deferredFns.length + "): " + formatPendingTasksAsString($browser.deferredFns));
            }
        };
        function formatPendingTasksAsString(tasks) {
            var result = [];
            angular.forEach(tasks, function(task) {
                result.push("{id: " + task.id + ", " + "time: " + task.time + "}");
            });
            return result.join(", ");
        }
        return $delegate;
    };
    angular.mock.$RAFDecorator = function($delegate) {
        var queue = [];
        var rafFn = function(fn) {
            var index = queue.length;
            queue.push(fn);
            return function() {
                queue.splice(index, 1);
            };
        };
        rafFn.supported = $delegate.supported;
        rafFn.flush = function() {
            if (queue.length === 0) {
                throw new Error("No rAF callbacks present");
            }
            var length = queue.length;
            for (var i = 0; i < length; i++) {
                queue[i]();
            }
            queue = [];
        };
        return rafFn;
    };
    angular.mock.$AsyncCallbackDecorator = function($delegate) {
        var callbacks = [];
        var addFn = function(fn) {
            callbacks.push(fn);
        };
        addFn.flush = function() {
            angular.forEach(callbacks, function(fn) {
                fn();
            });
            callbacks = [];
        };
        return addFn;
    };
    angular.mock.$RootElementProvider = function() {
        this.$get = function() {
            return angular.element("<div ng-app></div>");
        };
    };
    angular.module("ngMock", [ "ng" ]).provider({
        $browser: angular.mock.$BrowserProvider,
        $exceptionHandler: angular.mock.$ExceptionHandlerProvider,
        $log: angular.mock.$LogProvider,
        $interval: angular.mock.$IntervalProvider,
        $httpBackend: angular.mock.$HttpBackendProvider,
        $rootElement: angular.mock.$RootElementProvider
    }).config([ "$provide", function($provide) {
        $provide.decorator("$timeout", angular.mock.$TimeoutDecorator);
        $provide.decorator("$$rAF", angular.mock.$RAFDecorator);
        $provide.decorator("$$asyncCallback", angular.mock.$AsyncCallbackDecorator);
    } ]);
    angular.module("ngMockE2E", [ "ng" ]).config([ "$provide", function($provide) {
        $provide.decorator("$httpBackend", angular.mock.e2e.$httpBackendDecorator);
    } ]);
    angular.mock.e2e = {};
    angular.mock.e2e.$httpBackendDecorator = [ "$rootScope", "$delegate", "$browser", createHttpBackendMock ];
    angular.mock.clearDataCache = function() {
        var key, cache = angular.element.cache;
        for (key in cache) {
            if (Object.prototype.hasOwnProperty.call(cache, key)) {
                var handle = cache[key].handle;
                handle && angular.element(handle.elem).off();
                delete cache[key];
            }
        }
    };
    if (window.jasmine || window.mocha) {
        var currentSpec = null, isSpecRunning = function() {
            return !!currentSpec;
        };
        (window.beforeEach || window.setup)(function() {
            currentSpec = this;
        });
        (window.afterEach || window.teardown)(function() {
            var injector = currentSpec.$injector;
            angular.forEach(currentSpec.$modules, function(module) {
                if (module && module.$$hashKey) {
                    module.$$hashKey = undefined;
                }
            });
            currentSpec.$injector = null;
            currentSpec.$modules = null;
            currentSpec = null;
            if (injector) {
                injector.get("$rootElement").off();
                injector.get("$browser").pollFns.length = 0;
            }
            angular.mock.clearDataCache();
            angular.forEach(angular.element.fragments, function(val, key) {
                delete angular.element.fragments[key];
            });
            MockXhr.$$lastInstance = null;
            angular.forEach(angular.callbacks, function(val, key) {
                delete angular.callbacks[key];
            });
            angular.callbacks.counter = 0;
        });
        window.module = angular.mock.module = function() {
            var moduleFns = Array.prototype.slice.call(arguments, 0);
            return isSpecRunning() ? workFn() : workFn;
            function workFn() {
                if (currentSpec.$injector) {
                    throw new Error("Injector already created, can not register a module!");
                } else {
                    var modules = currentSpec.$modules || (currentSpec.$modules = []);
                    angular.forEach(moduleFns, function(module) {
                        if (angular.isObject(module) && !angular.isArray(module)) {
                            modules.push(function($provide) {
                                angular.forEach(module, function(value, key) {
                                    $provide.value(key, value);
                                });
                            });
                        } else {
                            modules.push(module);
                        }
                    });
                }
            }
        };
        var ErrorAddingDeclarationLocationStack = function(e, errorForStack) {
            this.message = e.message;
            this.name = e.name;
            if (e.line) this.line = e.line;
            if (e.sourceId) this.sourceId = e.sourceId;
            if (e.stack && errorForStack) this.stack = e.stack + "\n" + errorForStack.stack;
            if (e.stackArray) this.stackArray = e.stackArray;
        };
        ErrorAddingDeclarationLocationStack.prototype.toString = Error.prototype.toString;
        window.inject = angular.mock.inject = function() {
            var blockFns = Array.prototype.slice.call(arguments, 0);
            var errorForStack = new Error("Declaration Location");
            return isSpecRunning() ? workFn.call(currentSpec) : workFn;
            function workFn() {
                var modules = currentSpec.$modules || [];
                modules.unshift("ngMock");
                modules.unshift("ng");
                var injector = currentSpec.$injector;
                if (!injector) {
                    injector = currentSpec.$injector = angular.injector(modules);
                }
                for (var i = 0, ii = blockFns.length; i < ii; i++) {
                    try {
                        injector.invoke(blockFns[i] || angular.noop, this);
                    } catch (e) {
                        if (e.stack && errorForStack) {
                            throw new ErrorAddingDeclarationLocationStack(e, errorForStack);
                        }
                        throw e;
                    } finally {
                        errorForStack = null;
                    }
                }
            }
        };
    }
})(window, window.angular);

var duScrollDefaultEasing = function(e) {
    "use strict";
    return .5 > e ? Math.pow(2 * e, 2) / 2 : 1 - Math.pow(2 * (1 - e), 2) / 2;
};

angular.module("duScroll", [ "duScroll.scrollspy", "duScroll.smoothScroll", "duScroll.scrollContainer", "duScroll.spyContext", "duScroll.scrollHelpers" ]).value("duScrollDuration", 350).value("duScrollSpyWait", 100).value("duScrollGreedy", !1).value("duScrollEasing", duScrollDefaultEasing), 
angular.module("duScroll.scrollHelpers", [ "duScroll.requestAnimation" ]).run([ "$window", "$q", "cancelAnimation", "requestAnimation", "duScrollEasing", function(e, t, n, r, o) {
    "use strict";
    var l = angular.element.prototype, i = function(e) {
        return "undefined" != typeof HTMLDocument && e instanceof HTMLDocument || e.nodeType && e.nodeType === e.DOCUMENT_NODE;
    }, u = function(e) {
        return "undefined" != typeof HTMLElement && e instanceof HTMLElement || e.nodeType && e.nodeType === e.ELEMENT_NODE;
    }, c = function(e) {
        return u(e) || i(e) ? e : e[0];
    };
    l.scrollTo = function(t, n, r) {
        var o;
        if (angular.isElement(t) ? o = this.scrollToElement : r && (o = this.scrollToAnimated), 
        o) return o.apply(this, arguments);
        var l = c(this);
        return i(l) ? e.scrollTo(t, n) : (l.scrollLeft = t, void (l.scrollTop = n));
    };
    var a, s;
    l.scrollToAnimated = function(e, l, i, u) {
        i && !u && (u = o);
        var c = this.scrollLeft(), d = this.scrollTop(), f = Math.round(e - c), p = Math.round(l - d), m = null, g = this, v = "scroll mousedown mousewheel touchmove keydown", y = function(e) {
            (!e || e.which > 0) && (g.unbind(v, y), n(a), s.reject(), a = null);
        };
        if (a && y(), s = t.defer(), !f && !p) return s.resolve(), s.promise;
        var h = function(e) {
            null === m && (m = e);
            var t = e - m, n = t >= i ? 1 : u(t / i);
            g.scrollTo(c + Math.ceil(f * n), d + Math.ceil(p * n)), 1 > n ? a = r(h) : (g.unbind(v, y), 
            a = null, s.resolve());
        };
        return g.scrollTo(c, d), g.bind(v, y), a = r(h), s.promise;
    }, l.scrollToElement = function(e, t, n, r) {
        var o = c(this), l = this.scrollTop() + c(e).getBoundingClientRect().top - (t || 0);
        return u(o) && (l -= o.getBoundingClientRect().top), this.scrollTo(0, l, n, r);
    };
    var d = {
        scrollLeft: function(t, n, r) {
            if (angular.isNumber(t)) return this.scrollTo(t, this.scrollTop(), n, r);
            var o = c(this);
            return i(o) ? e.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft : o.scrollLeft;
        },
        scrollTop: function(t, n, r) {
            if (angular.isNumber(t)) return this.scrollTo(this.scrollTop(), t, n, r);
            var o = c(this);
            return i(o) ? e.scrollY || document.documentElement.scrollTop || document.body.scrollTop : o.scrollTop;
        }
    }, f = function(e, t) {
        return function(n, r) {
            return r ? t.apply(this, arguments) : e.apply(this, arguments);
        };
    };
    for (var p in d) l[p] = l[p] ? f(l[p], d[p]) : d[p];
} ]), angular.module("duScroll.polyfill", []).factory("polyfill", [ "$window", function(e) {
    "use strict";
    var t = [ "webkit", "moz", "o", "ms" ];
    return function(n, r) {
        if (e[n]) return e[n];
        for (var o, l = n.substr(0, 1).toUpperCase() + n.substr(1), i = 0; i < t.length; i++) if (o = t[i] + l, 
        e[o]) return e[o];
        return r;
    };
} ]), angular.module("duScroll.requestAnimation", [ "duScroll.polyfill" ]).factory("requestAnimation", [ "polyfill", "$timeout", function(e, t) {
    "use strict";
    var n = 0, r = function(e) {
        var r = new Date().getTime(), o = Math.max(0, 16 - (r - n)), l = t(function() {
            e(r + o);
        }, o);
        return n = r + o, l;
    };
    return e("requestAnimationFrame", r);
} ]).factory("cancelAnimation", [ "polyfill", "$timeout", function(e, t) {
    "use strict";
    var n = function(e) {
        t.cancel(e);
    };
    return e("cancelAnimationFrame", n);
} ]), angular.module("duScroll.spyAPI", [ "duScroll.scrollContainerAPI" ]).factory("spyAPI", [ "$rootScope", "$timeout", "scrollContainerAPI", "duScrollGreedy", "duScrollSpyWait", function(e, t, n, r, o) {
    "use strict";
    var l = function(n) {
        var l = !1, i = !1, u = function() {
            i = !1;
            var t = n.container, o = t[0], l = 0;
            ("undefined" != typeof HTMLElement && o instanceof HTMLElement || o.nodeType && o.nodeType === o.ELEMENT_NODE) && (l = o.getBoundingClientRect().top);
            var u, c, a, s, d, f;
            for (s = n.spies, c = n.currentlyActive, a = void 0, u = 0; u < s.length; u++) d = s[u], 
            f = d.getTargetPosition(), f && f.top + d.offset - l < 20 && -1 * f.top + l < f.height && (!a || a.top < f.top) && (a = {
                top: f.top,
                spy: d
            });
            a && (a = a.spy), c === a || r && !a || (c && (c.$element.removeClass("active"), 
            e.$broadcast("duScrollspy:becameInactive", c.$element)), a && (a.$element.addClass("active"), 
            e.$broadcast("duScrollspy:becameActive", a.$element)), n.currentlyActive = a);
        };
        return o ? function() {
            l ? i = !0 : (u(), l = t(function() {
                l = !1, i && u();
            }, o));
        } : u;
    }, i = {}, u = function(e) {
        var t = e.$id, n = {
            spies: []
        };
        return n.handler = l(n), i[t] = n, e.$on("$destroy", function() {
            c(e);
        }), t;
    }, c = function(e) {
        var t = e.$id, n = i[t], r = n.container;
        r && r.off("scroll", n.handler), delete i[t];
    }, a = u(e), s = function(e) {
        return i[e.$id] ? i[e.$id] : e.$parent ? s(e.$parent) : i[a];
    }, d = function(e) {
        var t, n, r = e.$element.scope();
        if (r) return s(r);
        for (n in i) if (t = i[n], -1 !== t.spies.indexOf(e)) return t;
    }, f = function(e) {
        for (;e.parentNode; ) if (e = e.parentNode, e === document) return !0;
        return !1;
    }, p = function(e) {
        var t = d(e);
        d(e).spies.push(e), t.container && f(t.container) || (t.container && t.container.off("scroll", t.handler), 
        t.container = n.getContainer(e.$element.scope()), t.container.on("scroll", t.handler).triggerHandler("scroll"));
    }, m = function(e) {
        var t = d(e);
        e === t.currentlyActive && (t.currentlyActive = null);
        var n = t.spies.indexOf(e);
        -1 !== n && t.spies.splice(n, 1);
    };
    return {
        addSpy: p,
        removeSpy: m,
        createContext: u,
        destroyContext: c,
        getContextForScope: s
    };
} ]), angular.module("duScroll.scrollContainerAPI", []).factory("scrollContainerAPI", [ "$document", function(e) {
    "use strict";
    var t = {}, n = function(e, n) {
        var r = e.$id;
        return t[r] = n, r;
    }, r = function(e) {
        return t[e.$id] ? e.$id : e.$parent ? r(e.$parent) : void 0;
    }, o = function(n) {
        var o = r(n);
        return o ? t[o] : e;
    }, l = function(e) {
        var n = r(e);
        n && delete t[n];
    };
    return {
        getContainerId: r,
        getContainer: o,
        setContainer: n,
        removeContainer: l
    };
} ]), angular.module("duScroll.smoothScroll", [ "duScroll.scrollHelpers", "duScroll.scrollContainerAPI" ]).directive("duSmoothScroll", [ "duScrollDuration", "scrollContainerAPI", function(e, t) {
    "use strict";
    return {
        link: function(n, r, o) {
            r.on("click", function(r) {
                if (o.href && -1 !== o.href.indexOf("#")) {
                    var l = document.getElementById(o.href.replace(/.*(?=#[^\s]+$)/, "").substring(1));
                    if (l && l.getBoundingClientRect) {
                        r.stopPropagation && r.stopPropagation(), r.preventDefault && r.preventDefault();
                        var i = o.offset ? parseInt(o.offset, 10) : 0, u = o.duration ? parseInt(o.duration, 10) : e, c = t.getContainer(n);
                        c.scrollToElement(angular.element(l), isNaN(i) ? 0 : i, isNaN(u) ? 0 : u);
                    }
                }
            });
        }
    };
} ]), angular.module("duScroll.spyContext", [ "duScroll.spyAPI" ]).directive("duSpyContext", [ "spyAPI", function(e) {
    "use strict";
    return {
        restrict: "A",
        scope: !0,
        compile: function() {
            return {
                pre: function(t) {
                    e.createContext(t);
                }
            };
        }
    };
} ]), angular.module("duScroll.scrollContainer", [ "duScroll.scrollContainerAPI" ]).directive("duScrollContainer", [ "scrollContainerAPI", function(e) {
    "use strict";
    return {
        restrict: "A",
        scope: !0,
        compile: function() {
            return {
                pre: function(t, n, r) {
                    r.$observe("duScrollContainer", function(r) {
                        angular.isString(r) && (r = document.getElementById(r)), r = angular.isElement(r) ? angular.element(r) : n, 
                        e.setContainer(t, r), t.$on("$destroy", function() {
                            e.removeContainer(t);
                        });
                    });
                }
            };
        }
    };
} ]), angular.module("duScroll.scrollspy", [ "duScroll.spyAPI" ]).directive("duScrollspy", [ "spyAPI", "$timeout", "$rootScope", function(e, t, n) {
    "use strict";
    var r = function(e, t, n) {
        angular.isElement(e) ? this.target = e : angular.isString(e) && (this.targetId = e), 
        this.$element = t, this.offset = n;
    };
    return r.prototype.getTargetElement = function() {
        return !this.target && this.targetId && (this.target = document.getElementById(this.targetId)), 
        this.target;
    }, r.prototype.getTargetPosition = function() {
        var e = this.getTargetElement();
        return e ? e.getBoundingClientRect() : void 0;
    }, r.prototype.flushTargetCache = function() {
        this.targetId && (this.target = void 0);
    }, {
        link: function(o, l, i) {
            var u, c = i.ngHref || i.href;
            c && -1 !== c.indexOf("#") ? u = c.replace(/.*(?=#[^\s]+$)/, "").substring(1) : i.duScrollspy && (u = i.duScrollspy), 
            u && t(function() {
                var t = new r(u, l, -(i.offset ? parseInt(i.offset, 10) : 0));
                e.addSpy(t), o.$on("$destroy", function() {
                    e.removeSpy(t);
                }), o.$on("$locationChangeSuccess", t.flushTargetCache.bind(t)), n.$on("$stateChangeSuccess", t.flushTargetCache.bind(t));
            }, 0);
        }
    };
} ]);

(function() {
    var t = [].indexOf || function(t) {
        for (var e = 0, n = this.length; e < n; e++) {
            if (e in this && this[e] === t) return e;
        }
        return -1;
    }, e = [].slice;
    (function(t, e) {
        if (typeof define === "function" && define.amd) {
            return define("waypoints", [ "jquery" ], function(n) {
                return e(n, t);
            });
        } else {
            return e(t.jQuery, t);
        }
    })(window, function(n, r) {
        var i, o, l, s, f, u, c, a, h, d, p, y, v, w, g, m;
        i = n(r);
        a = t.call(r, "ontouchstart") >= 0;
        s = {
            horizontal: {},
            vertical: {}
        };
        f = 1;
        c = {};
        u = "waypoints-context-id";
        p = "resize.waypoints";
        y = "scroll.waypoints";
        v = 1;
        w = "waypoints-waypoint-ids";
        g = "waypoint";
        m = "waypoints";
        o = function() {
            function t(t) {
                var e = this;
                this.$element = t;
                this.element = t[0];
                this.didResize = false;
                this.didScroll = false;
                this.id = "context" + f++;
                this.oldScroll = {
                    x: t.scrollLeft(),
                    y: t.scrollTop()
                };
                this.waypoints = {
                    horizontal: {},
                    vertical: {}
                };
                this.element[u] = this.id;
                c[this.id] = this;
                t.bind(y, function() {
                    var t;
                    if (!(e.didScroll || a)) {
                        e.didScroll = true;
                        t = function() {
                            e.doScroll();
                            return e.didScroll = false;
                        };
                        return r.setTimeout(t, n[m].settings.scrollThrottle);
                    }
                });
                t.bind(p, function() {
                    var t;
                    if (!e.didResize) {
                        e.didResize = true;
                        t = function() {
                            n[m]("refresh");
                            return e.didResize = false;
                        };
                        return r.setTimeout(t, n[m].settings.resizeThrottle);
                    }
                });
            }
            t.prototype.doScroll = function() {
                var t, e = this;
                t = {
                    horizontal: {
                        newScroll: this.$element.scrollLeft(),
                        oldScroll: this.oldScroll.x,
                        forward: "right",
                        backward: "left"
                    },
                    vertical: {
                        newScroll: this.$element.scrollTop(),
                        oldScroll: this.oldScroll.y,
                        forward: "down",
                        backward: "up"
                    }
                };
                if (a && (!t.vertical.oldScroll || !t.vertical.newScroll)) {
                    n[m]("refresh");
                }
                n.each(t, function(t, r) {
                    var i, o, l;
                    l = [];
                    o = r.newScroll > r.oldScroll;
                    i = o ? r.forward : r.backward;
                    n.each(e.waypoints[t], function(t, e) {
                        var n, i;
                        if (r.oldScroll < (n = e.offset) && n <= r.newScroll) {
                            return l.push(e);
                        } else if (r.newScroll < (i = e.offset) && i <= r.oldScroll) {
                            return l.push(e);
                        }
                    });
                    l.sort(function(t, e) {
                        return t.offset - e.offset;
                    });
                    if (!o) {
                        l.reverse();
                    }
                    return n.each(l, function(t, e) {
                        if (e.options.continuous || t === l.length - 1) {
                            return e.trigger([ i ]);
                        }
                    });
                });
                return this.oldScroll = {
                    x: t.horizontal.newScroll,
                    y: t.vertical.newScroll
                };
            };
            t.prototype.refresh = function() {
                var t, e, r, i = this;
                r = n.isWindow(this.element);
                e = this.$element.offset();
                this.doScroll();
                t = {
                    horizontal: {
                        contextOffset: r ? 0 : e.left,
                        contextScroll: r ? 0 : this.oldScroll.x,
                        contextDimension: this.$element.width(),
                        oldScroll: this.oldScroll.x,
                        forward: "right",
                        backward: "left",
                        offsetProp: "left"
                    },
                    vertical: {
                        contextOffset: r ? 0 : e.top,
                        contextScroll: r ? 0 : this.oldScroll.y,
                        contextDimension: r ? n[m]("viewportHeight") : this.$element.height(),
                        oldScroll: this.oldScroll.y,
                        forward: "down",
                        backward: "up",
                        offsetProp: "top"
                    }
                };
                return n.each(t, function(t, e) {
                    return n.each(i.waypoints[t], function(t, r) {
                        var i, o, l, s, f;
                        i = r.options.offset;
                        l = r.offset;
                        o = n.isWindow(r.element) ? 0 : r.$element.offset()[e.offsetProp];
                        if (n.isFunction(i)) {
                            i = i.apply(r.element);
                        } else if (typeof i === "string") {
                            i = parseFloat(i);
                            if (r.options.offset.indexOf("%") > -1) {
                                i = Math.ceil(e.contextDimension * i / 100);
                            }
                        }
                        r.offset = o - e.contextOffset + e.contextScroll - i;
                        if (r.options.onlyOnScroll && l != null || !r.enabled) {
                            return;
                        }
                        if (l !== null && l < (s = e.oldScroll) && s <= r.offset) {
                            return r.trigger([ e.backward ]);
                        } else if (l !== null && l > (f = e.oldScroll) && f >= r.offset) {
                            return r.trigger([ e.forward ]);
                        } else if (l === null && e.oldScroll >= r.offset) {
                            return r.trigger([ e.forward ]);
                        }
                    });
                });
            };
            t.prototype.checkEmpty = function() {
                if (n.isEmptyObject(this.waypoints.horizontal) && n.isEmptyObject(this.waypoints.vertical)) {
                    this.$element.unbind([ p, y ].join(" "));
                    return delete c[this.id];
                }
            };
            return t;
        }();
        l = function() {
            function t(t, e, r) {
                var i, o;
                if (r.offset === "bottom-in-view") {
                    r.offset = function() {
                        var t;
                        t = n[m]("viewportHeight");
                        if (!n.isWindow(e.element)) {
                            t = e.$element.height();
                        }
                        return t - n(this).outerHeight();
                    };
                }
                this.$element = t;
                this.element = t[0];
                this.axis = r.horizontal ? "horizontal" : "vertical";
                this.callback = r.handler;
                this.context = e;
                this.enabled = r.enabled;
                this.id = "waypoints" + v++;
                this.offset = null;
                this.options = r;
                e.waypoints[this.axis][this.id] = this;
                s[this.axis][this.id] = this;
                i = (o = this.element[w]) != null ? o : [];
                i.push(this.id);
                this.element[w] = i;
            }
            t.prototype.trigger = function(t) {
                if (!this.enabled) {
                    return;
                }
                if (this.callback != null) {
                    this.callback.apply(this.element, t);
                }
                if (this.options.triggerOnce) {
                    return this.destroy();
                }
            };
            t.prototype.disable = function() {
                return this.enabled = false;
            };
            t.prototype.enable = function() {
                this.context.refresh();
                return this.enabled = true;
            };
            t.prototype.destroy = function() {
                delete s[this.axis][this.id];
                delete this.context.waypoints[this.axis][this.id];
                return this.context.checkEmpty();
            };
            t.getWaypointsByElement = function(t) {
                var e, r;
                r = t[w];
                if (!r) {
                    return [];
                }
                e = n.extend({}, s.horizontal, s.vertical);
                return n.map(r, function(t) {
                    return e[t];
                });
            };
            return t;
        }();
        d = {
            init: function(t, e) {
                var r;
                e = n.extend({}, n.fn[g].defaults, e);
                if ((r = e.handler) == null) {
                    e.handler = t;
                }
                this.each(function() {
                    var t, r, i, s;
                    t = n(this);
                    i = (s = e.context) != null ? s : n.fn[g].defaults.context;
                    if (!n.isWindow(i)) {
                        i = t.closest(i);
                    }
                    i = n(i);
                    r = c[i[0][u]];
                    if (!r) {
                        r = new o(i);
                    }
                    return new l(t, r, e);
                });
                n[m]("refresh");
                return this;
            },
            disable: function() {
                return d._invoke.call(this, "disable");
            },
            enable: function() {
                return d._invoke.call(this, "enable");
            },
            destroy: function() {
                return d._invoke.call(this, "destroy");
            },
            prev: function(t, e) {
                return d._traverse.call(this, t, e, function(t, e, n) {
                    if (e > 0) {
                        return t.push(n[e - 1]);
                    }
                });
            },
            next: function(t, e) {
                return d._traverse.call(this, t, e, function(t, e, n) {
                    if (e < n.length - 1) {
                        return t.push(n[e + 1]);
                    }
                });
            },
            _traverse: function(t, e, i) {
                var o, l;
                if (t == null) {
                    t = "vertical";
                }
                if (e == null) {
                    e = r;
                }
                l = h.aggregate(e);
                o = [];
                this.each(function() {
                    var e;
                    e = n.inArray(this, l[t]);
                    return i(o, e, l[t]);
                });
                return this.pushStack(o);
            },
            _invoke: function(t) {
                this.each(function() {
                    var e;
                    e = l.getWaypointsByElement(this);
                    return n.each(e, function(e, n) {
                        n[t]();
                        return true;
                    });
                });
                return this;
            }
        };
        n.fn[g] = function() {
            var t, r;
            r = arguments[0], t = 2 <= arguments.length ? e.call(arguments, 1) : [];
            if (d[r]) {
                return d[r].apply(this, t);
            } else if (n.isFunction(r)) {
                return d.init.apply(this, arguments);
            } else if (n.isPlainObject(r)) {
                return d.init.apply(this, [ null, r ]);
            } else if (!r) {
                return n.error("jQuery Waypoints needs a callback function or handler option.");
            } else {
                return n.error("The " + r + " method does not exist in jQuery Waypoints.");
            }
        };
        n.fn[g].defaults = {
            context: r,
            continuous: true,
            enabled: true,
            horizontal: false,
            offset: 0,
            triggerOnce: false
        };
        h = {
            refresh: function() {
                return n.each(c, function(t, e) {
                    return e.refresh();
                });
            },
            viewportHeight: function() {
                var t;
                return (t = r.innerHeight) != null ? t : i.height();
            },
            aggregate: function(t) {
                var e, r, i;
                e = s;
                if (t) {
                    e = (i = c[n(t)[0][u]]) != null ? i.waypoints : void 0;
                }
                if (!e) {
                    return [];
                }
                r = {
                    horizontal: [],
                    vertical: []
                };
                n.each(r, function(t, i) {
                    n.each(e[t], function(t, e) {
                        return i.push(e);
                    });
                    i.sort(function(t, e) {
                        return t.offset - e.offset;
                    });
                    r[t] = n.map(i, function(t) {
                        return t.element;
                    });
                    return r[t] = n.unique(r[t]);
                });
                return r;
            },
            above: function(t) {
                if (t == null) {
                    t = r;
                }
                return h._filter(t, "vertical", function(t, e) {
                    return e.offset <= t.oldScroll.y;
                });
            },
            below: function(t) {
                if (t == null) {
                    t = r;
                }
                return h._filter(t, "vertical", function(t, e) {
                    return e.offset > t.oldScroll.y;
                });
            },
            left: function(t) {
                if (t == null) {
                    t = r;
                }
                return h._filter(t, "horizontal", function(t, e) {
                    return e.offset <= t.oldScroll.x;
                });
            },
            right: function(t) {
                if (t == null) {
                    t = r;
                }
                return h._filter(t, "horizontal", function(t, e) {
                    return e.offset > t.oldScroll.x;
                });
            },
            enable: function() {
                return h._invoke("enable");
            },
            disable: function() {
                return h._invoke("disable");
            },
            destroy: function() {
                return h._invoke("destroy");
            },
            extendFn: function(t, e) {
                return d[t] = e;
            },
            _invoke: function(t) {
                var e;
                e = n.extend({}, s.vertical, s.horizontal);
                return n.each(e, function(e, n) {
                    n[t]();
                    return true;
                });
            },
            _filter: function(t, e, r) {
                var i, o;
                i = c[n(t)[0][u]];
                if (!i) {
                    return [];
                }
                o = [];
                n.each(i.waypoints[e], function(t, e) {
                    if (r(i, e)) {
                        return o.push(e);
                    }
                });
                o.sort(function(t, e) {
                    return t.offset - e.offset;
                });
                return n.map(o, function(t) {
                    return t.element;
                });
            }
        };
        n[m] = function() {
            var t, n;
            n = arguments[0], t = 2 <= arguments.length ? e.call(arguments, 1) : [];
            if (h[n]) {
                return h[n].apply(null, t);
            } else {
                return h.aggregate.call(null, n);
            }
        };
        n[m].settings = {
            resizeThrottle: 100,
            scrollThrottle: 30
        };
        return i.on("load.waypoints", function() {
            return n[m]("refresh");
        });
    });
}).call(this);

(function() {
    "use strict";
    var app;
    app = angular.module("listfeature", [ "ngRoute", "ngSanitize", "listControllers", "listDirectives", "ui.utils", "duScroll", "ngProgress", "listServices" ]);
    app.config([ "$routeProvider", function($routeProvider) {
        return $routeProvider.when("/lists", {
            templateUrl: "partials/list.html",
            controller: "ListListCtrl"
        }).when("/lists/:listId", {
            templateUrl: "partials/detail.html",
            controller: "ListDetailCtrl"
        }).otherwise({
            redirectTo: "/lists"
        });
    } ]);
}).call(this);

(function() {
    "use strict";
    var client, listControllers;
    listControllers = angular.module("listControllers", []);
    client = contentful.createClient({
        accessToken: "c74b04faaa839cf30d0fbf6d0fa5827984c15b39864d7fc3c48a6fe57ad6ad0d",
        space: "6s2rqhmim2vw"
    });
    listControllers.controller("ListListCtrl", [ "$scope", "$http", function($scope, $http) {
        $scope.lists = "";
        return client.entries({
            content_type: "1iKCsUgXpSuSouwuMIYACy",
            include: 1
        }).done(function(data) {
            return $scope.$apply(function() {
                $scope.lists = data;
                return console.log($scope.lists);
            });
        });
    } ]);
    listControllers.controller("ListDetailCtrl", [ "$scope", "$routeParams", "$http", "$location", "$sce", "listService", function($scope, $routeParams, $http, $location, $sce, listService) {
        var converter;
        converter = new Showdown.converter();
        listService.progressInit();
        client.entries({
            "sys.id": $routeParams.listId,
            include: 10
        }).done(function(data) {
            $scope.$apply(function() {
                $scope.list = data[0];
                console.log($scope.list);
                return $scope.list.fields.body = converter.makeHtml($scope.list.fields.body);
            });
            return setTimeout(listService.removeSpinner, 2e3);
        });
        return $scope.trust = function(body) {
            return $sce.trustAsHtml(body);
        };
    } ]);
}).call(this);

(function() {
    "use strict";
    var listDirectives;
    listDirectives = angular.module("listDirectives", []);
    listDirectives.directive("sendHeight", function() {
        var link;
        link = function($scope, element, attrs) {
            var height, reset, sendHeight;
            height = element.parent().innerHeight();
            reset = function() {
                height = element.parent().innerHeight();
                return sendHeight(height);
            };
            sendHeight = function(height) {
                var message, messageJSON;
                message = {
                    height: height
                };
                messageJSON = JSON.stringify(message);
                console.log(messageJSON);
                return window.parent.postMessage(messageJSON, "*");
            };
            sendHeight(height);
            return $(window).on("resize", function() {
                return reset();
            });
        };
        return {
            restrict: "A",
            replace: false,
            link: link
        };
    });
    listDirectives.directive("sticky", function() {
        var link;
        link = function($scope, element, attrs) {
            return element.waypoint({
                context: ".frame",
                handler: function(direction) {
                    if (direction === "down") {
                        return element.addClass("sticky");
                    } else {
                        return element.removeClass("sticky");
                    }
                }
            });
        };
        return {
            link: link
        };
    });
}).call(this);

(function() {
    "use strict";
    var listServices;
    listServices = angular.module("listServices", []);
    listServices.factory("listService", [ "ngProgress", function(ngProgress) {
        var progressInit, removeSpinner;
        progressInit = function() {
            ngProgress.height("10px");
            ngProgress.color("#ffffff");
            return ngProgress.start();
        };
        removeSpinner = function() {
            ngProgress.complete();
            return $("#spinner").animate({
                opacity: 0
            }, 600, function() {
                return $("#spinner").remove();
            });
        };
        return {
            progressInit: function() {
                return progressInit();
            },
            removeSpinner: function() {
                return removeSpinner();
            }
        };
    } ]);
}).call(this);
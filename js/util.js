/*global define: true*/
define("util", function (){
    function isArray(o) {
        return Object.prototype.toString.call(o) === "[object Array]";
    }
    function func(name) {
        var rest = Array.prototype.slice.call(arguments, 1);
        return function (ctx) {
            return ctx[name].apply(ctx, rest);
        };
    }
    function prop(name) {
        return function (ctx) {
            return ctx[name];
        };
    }
    function last(arr) {
        if (! isArray(arr)) {
            return null;
        }
        return arr[arr.length - 1];
    }
    function truthy(what) {
        return !!what;
    }
    function within(lower, upper, value) {
        return Math.min(upper, Math.max(lower, value));
    }
    function curry(ctx, fn) {
        var rest = Array.prototype.slice.call(arguments, 2);
        return function () {
            var args = rest.concat(Array.prototype.slice.call(arguments, 0));
            return fn.apply(ctx, args);
        };
    }
    function relativeformat(when) {
        var now = Date.now(),
            diff = (now - when.getTime()) / 1000,
            thresholds = [
                { limit: 60, div:    60, fmt: ["just now", "%d minute ago", "%d minutes ago"] },
                { limit: 24, div:  3600, fmt: ["about an hour ago", "%d hour ago", "%d hours ago"] },
                { limit:  7, div: 86400, fmt: ["today", "yesterday", "%d days ago"] }
                ],
            limit = curry(null, within, 0, 2),
            t, v;
        while (!!(t = thresholds.shift())) {
            v = Math.floor(diff / t.div);
            if (v < t.limit) {
                return t.fmt[limit(v)].replace(/%d/g, v);
            }
        }
        return "on " + when.toLocaleString();
    }
    return {
        isArray: isArray,
        func: func,
        prop: func,
        last: last,
        truthy: truthy,
        within: within,
        relativeformat: relativeformat,
        curry: curry
    };
});

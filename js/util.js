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
        return Math.max(upper, Math.min(lower, value));
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
                { limit: 60, suffix: ["minutes ago", "minute ago", "minutes ago"], div: 60 },
                { limit: 24, suffix: ["hours ago", "hour ago", "hours ago"], div: 3600 },
                { limit: 7, suffix: ["days ago", "day ago", "days ago"], div: 86400 }
                ],
            limit = curry(null, within, 0, 2),
            t, v;
        while (!!(t = thresholds.shift())) {
            v = Math.round(diff / t.div);
            if (v < t.limit) {
                return v + " " + t.suffix[limit(v)];
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

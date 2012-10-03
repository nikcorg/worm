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
    function relativeformat(when) {
        var now = Date.now(),
            diff = (now - when.getTime()) / 1000,
            thresholds = [
                { limit: 3600, suffix: "minutes ago", div: 60 },
                { limit: 86400, suffix: "hours ago", div: 3600 }
                ],
            t;
console.log("relative format", when, diff);
        while (!!(t = thresholds.shift())) {
console.log(t);
            if (diff < t.limit) {
                return Math.round(diff / t.div) + " " + t.suffix;
            }
        }
console.log("no suitable match");
        return "on " + when.toLocaleString();
    }
    return {
        isArray: isArray,
        func: func,
        prop: func,
        last: last,
        truthy: truthy,
        relativeformat: relativeformat
    };
});

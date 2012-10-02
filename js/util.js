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

    return {
        isArray: isArray,
        func: func,
        prop: func,
        last: last,
        truthy: truthy
    };
});

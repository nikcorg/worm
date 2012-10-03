/*global define: true*/
define("caps", ["util"], function (Util) {
    "use strict";
    function isset(o) {
        return o != null;
    }
    function has(o, p) {
        return p in o;
    }
    function callable(o) {
        return Object.prototype.call(o) === "[object Function]";
    }
    var div = document.createElement("canvas"),
        canvas = document.createElement("canvas"),
        tests = {
                "Array.forEach": has(Array.prototype, "forEach"),
                "Array.map": has(Array.prototype, "map"),
                "Array.reduce": has(Array.prototype, "reduce"),
                "Array.some": has(Array.prototype, "some"),
                "Canvas": isset(canvas),
                "Canvas.fillText": isset(canvas) && has(canvas.getContext("2d"), "fillText"),
                "classList": has(div, "classList"),
                "querySelector": has(document, "querySelector")
            };
    function exists(caps) {
        var passed = Object.prototype.toString.call(caps) === "[object Array]",
            cap;
        while (passed && (cap = caps.pop())) {
            passed = passed && has(tests, cap) && !!tests[cap];
        }
        return passed;
    }
    function satisfy(caps, success) {
        var satisfied = exists(caps);

        if (! satisfied) {
            throw new Error("not satisfactory");
        }

        return success.apply(null, Array.prototype.slice.call(arguments, 2));
    }
    return {
        satisfy: satisfy
    };
});

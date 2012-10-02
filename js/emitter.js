var Emitter = (function (w, d) {
    function Emitter() {
    }
    var p = Emitter.prototype;
    Emitter.mixin = function (dest) {
        var prop;
        for (prop in p) {
            if (p.hasOwnProperty(prop)) {
                dest[prop] = p[prop];
            }
        }
    };
    Emitter.emit = function (recvr, args) {
        recvr.fn.apply(recvr.who, args);
    };
    p.subs = {};
    p.on = function (what, fn, who) {
        who = who || null;
        this.subs[what] = (this.subs[what] || []);
        this.subs[what].push({ fn: fn, who: who });
        return this;
    };
    p.off = function (what, fn, who) {
        var i, l;
        who = who || null;
        for (i = 0, l = this.subs[what].length; i < l; i++) {
            if (fn === this.subs[what][i].fn && who === this.subs[what][i].who) {
                this.subs[what].splice(i, 1);
                return true;
            }
        }
        return false;
    };
    p.trigger = function (l, e) {
        var args = Array.prototype.slice.call(arguments, 1);
        l.forEach(function (s) { Emitter.emit(s, args); });
    };
    return Emitter;
}(window, document));

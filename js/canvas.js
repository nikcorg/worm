/*global define: true*/
define("canvas", ["emitter"], function (Emitter) {
    var w = window, d = document;

    var requestAnimFrame = (function(){
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
            }());
    var Canvas = function (w, h, fps) {
        this.dims = { w: w, h: h };
        this.fps = Math.min(fps, 60);
        this.cnv = d.createElement("canvas");
        this.cnv.setAttribute("width", this.dims.w);
        this.cnv.setAttribute("height", this.dims.h);
        this.ctx = this.cnv.getContext("2d");
    };
    var p = Canvas.prototype;
    Emitter.mixin(p);
    p.subs = {
        "tick": []
    };
    p.ticking = false;
    p.cnv = null;
    p.ctx = null;
    p.fps = 0;
    p.dims = { w: 0, h: 0 };
    p.tick = function (fn) {
        var ticker;
        if (this.ticking) {
            ticker = this.tick.bind(this);
            setTimeout(
                function () { requestAnimFrame(ticker); },
                1000 / this.fps
                );
        }
        this.trigger(this.subs.tick, "tick");
    };
    p.startTick = function () {
        this.ticking = true;
        this.tick();
    };
    p.stopTick = function () {
        this.ticking = false;
    };
    p.attach = function (node) {
        node.appendChild(this.cnv);
        this.startTick();
    };
    p.detach = function () {
        if (this.cnv.parentNode) {
            this.cnv.parentNode.removeChild(this.cnv);
            this.stopTick();
        }
    };
    p.clear = function () {
        this.ctx.clearRect(0, 0, this.dims.w, this.dims.h);
    };
    p.fill = function (c) {
        var restore = !!c ? this.applyOptions({ fillStyle: c }) : null;
        this.ctx.fillRect(0, 0, this.dims.w, this.dims.h);
        this.applyOptions(restore);
    };
    p.applyOptions = function (options) {
        var restore = {},
            opt;
        if (!!options) {
            for (opt in options) {
                if (opt in this.ctx) {
                    restore[opt] = this.ctx[opt];
                    this.ctx[opt] = options[opt];
                }
            }
        }
        return restore;
    };
    p.draw = function (canvas, x, y, options) {
        var restore = !!options ? this.applyOptions(options) : null;
        this.ctx.drawImage(canvas.cnv, x, y);
        this.applyOptions(restore);
    };
    return Canvas;
});

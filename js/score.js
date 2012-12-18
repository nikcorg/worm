/*global define: true*/
define(["canvas"], function (Canvas) {
    function Score(canvas) {
        this.canvas = canvas;
        this.cache = new Canvas(100, 24);
        this.cachePrep();
    }
    var p = Score.prototype;
    p.displaytext = 0;
    p.score = 0;
    p.alpha = 1;
    p.cache = null;
    p.cachePrep = function () {
        this.cache.ctx.fillStyle = "#FFF";
        this.cache.ctx.font = "24px Courier";
        this.cache.ctx.textAlign = "left";
        this.cache.ctx.shadowColor = "#FA6";
        this.cache.ctx.shadowBlur = 10;
    };
    p.update = function () {
        if (this.cache.ctx.measureText(this.displaytext).width > this.cache.dims.w) {
            this.cache = new Canvas(this.cache.dims.w * 2);
            this.cachePrep();
        }
        this.cache.clear();
        this.cache.ctx.fillText(this.displaytext, 0, this.cache.dims.h);
    };
    p.inc = function (n) {
        this.score += n;
        this.alpha = 1;
        this.canvas.on("tick", this.tick, this);
        return this;
    };
    p.tick = function () {
        var diff = this.score - this.displaytext;
        if (diff > 2) {
            this.displaytext += Math.ceil(diff / 10);
        } else if (diff > 0) {
            this.displaytext = this.score;
        } else if (diff === 0 && this.alpha > 0.3) {
            this.alpha -= 0.05;
        } else {
            this.canvas.off("tick", this.tick, this);
        }
        this.update();
    };
    p.draw = function () {
        this.canvas.draw(
            this.cache,
            10,
            10,
            {
                globalAlpha: this.alpha,
                shadowColor: "#FFF",
                shadowBlur: this.alpha * 30
                }
            );
        return this;
    };
    return Score;
});

/*global define: true*/
define("target", ["canvas", "point", "rectangle"], function (Canvas, Point, Rectangle) {
    function Target(canvas) {
        this.canvas = canvas;
        this.randomize();
        this.canvas.on("tick", this.reduceBonus, this);
    }
    Target.height = 10;
    Target.width = 10;
    Target.cache = new Canvas(Target.width, Target.height);
    Target.cache.fill("#F00");
    var p = Target.prototype;
    p.pos = null;
    p.rect = null;
    p.cache = null;
    p.canvas = null;
    p.value = 0;
    p.timebonus = 3;
    p.reduceBonus = function () {
        this.timebonus *= 0.98;
    };
    p.getValue = function () {
        return this.value * Math.max(1, this.timebonus);
    };
    p.randomize = function () {
        var x = Math.random() * this.canvas.dims.w / Target.width,
            y = Math.random() * this.canvas.dims.h / Target.height;
        this.value = Math.ceil(Math.random() * 10);
        this.timebonus = 3;
        this.pos = new Point(
            Math.floor(x) * Target.width,
            Math.floor(y) * Target.height
            );
        this.rect = new Rectangle(this.pos, Target.width, Target.height);
        return this;
    };
    p.draw = function () {
        this.canvas.draw(
            Target.cache,
            this.pos.x,
            this.pos.y,
            {
                shadowColor: "#FFF",
                shadowBlur: (this.timebonus - 1) * 15
                }
            );
        return this;
    };
    p.hitTest = function (point) {
        return this.rect.contains(point);
    };
    return Target;
});

var Target = (function (w, d) {
    function Target(canvas) {
        this.canvas = canvas;
        this.randomize();
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
    p.randomize = function () {
        var x = Math.random() * this.canvas.dims.w / Target.width,
            y = Math.random() * this.canvas.dims.h / Target.height;
        this.value = Math.ceil(Math.random() * 10);
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
            this.pos.y
            );
        return this;
    };
    p.hitTest = function (point) {
        return this.rect.contains(point);
    };
    return Target;
}(window, document));

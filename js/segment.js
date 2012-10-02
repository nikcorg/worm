var Segment = (function (w, d) {
    function Segment(canvas) {
        this.canvas = canvas;
        this.rect = new Rectangle(null, Segment.width, Segment.height);
        this.setPos(new Point(0, 0));
    }
    Segment.height = 10;
    Segment.width = 10;
    Segment.color = "#0F0";
    Segment.cache = new Canvas(Segment.width, Segment.height);
    Segment.cache.fill(Segment.color);
    var p = Segment.prototype;
    p.canvas = null;
    p.pos = null;
    p.rect = null;
    p.hitTest = function (point) {
        return this.rect.setPos(this.pos).contains(point);
    };
    p.draw = function () {
        this.canvas.draw(Segment.cache, this.pos.x, this.pos.y);
        return this;
    };
    p.setPos = function (point) {
        this.pos = point;
        return this;
    };
    return Segment;
}(window, document));

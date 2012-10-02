var Point = (function (w, d) {
    function Point(x, y) {
        this.x = x || this.x;
        this.y = y || this.y;
    }
    var p = Point.prototype;
    p.x = 0;
    p.y = 0;
    p.clone = function () {
        return new Point(this.x, this.y);
    };
    p.cloneInto = function (o) {
        o.x = this.x;
        o.y = this.y;
    };
    return Point;
}(window, document));

var Rectangle = (function (w, d) {
    function Rectangle(point, width, height) {
        this.pos = point;
        this.width = width;
        this.height = height;
    }
    var p = Rectangle.prototype;
    p.pos = null;
    p.width = 0;
    p.height = 0;
    p.contains = function (point) {
        return point.x >= this.pos.x && point.x < this.pos.x + this.width &&
            point.y >= this.pos.y && point.y < this.pos.y + this.height;
    };
    p.setPos = function (point) {
        this.pos = point;
        return this;
    };
    return Rectangle;
}(window, document));

/*global define: true*/
define("rectangle", function () {
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
});

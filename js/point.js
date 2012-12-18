/*global define: true*/
define(function () {
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
});

/*global define: true*/
define(["util", "segment", "point"], function (Util, Segment, Point) {
    function Worm(canvas) {
        this.canvas = canvas;
        this.init();
        this.direction = Math.floor(Math.random() * 4) + 1;
    }
    Worm.DIRECTION = {
        UP: 1,
        DOWN: 2,
        LEFT: 3,
        RIGHT: 4
    };
    var p = Worm.prototype;
    p.canvas = null;
    p.direction = Worm.DIRECTION.LEFT;
    p.directionNext = null;
    p.speed = 1;
    p.length = 1;
    p.segments = [];
    p.segmentQueue = [];
    p.init = function () {
        var firstSegment = new Segment(this.canvas),
            x = Math.random() * this.canvas.dims.w / Segment.width,
            y = Math.random() * this.canvas.dims.h / Segment.height;
        firstSegment.pos = new Point(
            Math.floor(x) * Segment.width,
            Math.floor(y) * Segment.height
            );
        this.segments.push(firstSegment);
        this.grow(2);
    };
    p.setDirection = function (d) {
        this.directionNext = d;
        return this;
    };
    p.nullIfOpposite = function (d) {
        switch (d) {
            case Worm.DIRECTION.UP:
                return this.direction === Worm.DIRECTION.DOWN ? null : d;

            case Worm.DIRECTION.DOWN:
                return this.direction === Worm.DIRECTION.UP ? null : d;

            case Worm.DIRECTION.LEFT:
                return this.direction === Worm.DIRECTION.RIGHT ? null : d;

            case Worm.DIRECTION.RIGHT:
                return this.direction === Worm.DIRECTION.LEFT ? null : d;
        }

        return null;
    };
    p.move = function () {
        var newSegment, lastPos = Util.last(this.segments).pos.clone();
        if (this.segments.length > 0) {
            // Replace head-segment with new segment or tail
            if (this.segmentQueue.length > 0) {
                this.segments.unshift(
                    this.segmentQueue.pop().setPos(this.head().pos.clone())
                    );
            } else {
                this.segments.unshift(
                    this.segments.pop().setPos(this.head().pos.clone())
                    );
            }
            // Validate direction change if one is queued
            if (!!this.directionNext) {
                this.direction = this.nullIfOpposite(this.directionNext) || this.direction;
                this.directionNext = null;
            }
            // Move head segment
            switch (this.direction) {
                case Worm.DIRECTION.UP:
                    this.head().pos.y -= this.speed * Segment.height;
                    break;
                case Worm.DIRECTION.DOWN:
                    this.head().pos.y += this.speed * Segment.height;
                    break;
                case Worm.DIRECTION.LEFT:
                    this.head().pos.x -= this.speed * Segment.height;
                    break;
                case Worm.DIRECTION.RIGHT:
                    this.head().pos.x += this.speed * Segment.height;
                    break;
            }
            // Wrap y-axis
            if (this.head().pos.y < 0) {
                this.head().pos.y = this.canvas.dims.h - Segment.height;
            } else if (this.segments[0].pos.y >= this.canvas.dims.h) {
                this.head().pos.y = 0;
            }
            // Wrap x-axis
            if (this.head().pos.x < 0) {
                this.head().pos.x = this.canvas.dims.w;
            } else if (this.segments[0].pos.x >= this.canvas.dims.w) {
                this.head().pos.x = 0;
            }
        }
        return this;
    };
    p.hitTest = function (point) {
        var hit = this.segments.
            map(Util.func("hitTest", point)).
            some(Util.truthy);
        return hit;
    };
    p.head = function () {
        return this.segments[0];
    };
    p.tail = function () {
        return this.segments.slice(1);
    };
    p.grow = function (amount) {
        while (amount-- > 0) {
            this.segmentQueue.push(new Segment(this.canvas));
        }
        return this;
    };
    p.draw = function () {
        this.segments.forEach(Util.func("draw"));
        return this;
    };
    return Worm;
});

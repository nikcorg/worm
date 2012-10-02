var Worm = (function (w, d) {
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
    p.speed = 1;
    p.length = 1;
    p.segments = [];
    p.segmentQueue = [];
    p.directionChangeAllowed = true;
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
        // Hack to allow dir change only once per tick,
        // preventing turning into yourself when doing
        // a quick 180° turn
        if (this.directionChangeAllowed) {
            this.direction = d;
            this.directionChangeAllowed = false;
        }
        return this;
    };
    p.move = function () {
        var newSegment, lastPos = last(this.segments).pos.clone();
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
        // Reset direction change allowing flag
        this.directionChangeAllowed = true;
        return this;
    };
    p.hitTest = function (point) {
        var hit = this.segments.
            map(func("hitTest", point)).
            some(truthy);
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
        this.segments.forEach(func("draw"));
        return this;
    };
    return Worm;
}(window, document));

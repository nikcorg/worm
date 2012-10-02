/*global define: true*/
define("game", ["util", "emitter", "worm", "target", "score"], function (Util, Emitter, Worm, Target, Score) {
    var w = window, d = document;

    function Game(canvas) {
        this.canvas = canvas;
        this.canvas.on("tick", this.tick, this);
        this.worm = new Worm(this.canvas);
        this.target = new Target(this.canvas);
        this.score = new Score(this.canvas);
        this.started = Date.now();
        this.elems = [this.score, this.target, this.worm];
        w.addEventListener("keydown", this.keydown.bind(this), false);
    }
    Game.KEYCODES = {
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39,
        SPACE: 32,
        UP: 38
    };
    var p = Game.prototype;
    Emitter.mixin(p);
    p.subs = { "gameover": [] };
    p.canvas = null;
    p.paused = false;
    p.score = null;
    p.elems = null;
    p.ended = false;
    p.started = 0;
    p.duration = 0;
    p.tick = function () {
        if (this.worm.head().hitTest(this.target.pos)) {
            this.worm.grow(this.target.value);
            this.score.inc(this.target.value * 10);
            do {
                this.target.randomize();
            } while (this.worm.hitTest(this.target.pos));
        }
        if (this.worm.tail().
            map(Util.func("hitTest", this.worm.head().pos)).
            some(Util.truthy)
        ) {
            this.gameover();
            return;
        }
        this.worm.move();
        this.canvas.fill();
        // Redrawing everything on every tick is terribly wasteful,
        // but we don't care right now.
        this.elems.map(Util.func("draw"));
    };
    p.keydown = function (e) {
        if (! ("keyCode" in e) || (this.paused && e.keyCode !== Game.KEYCODES.SPACE)) { return; }
        switch (e.keyCode) {
            case Game.KEYCODES.DOWN:
                e.preventDefault();
                this.worm.setDirection(Worm.DIRECTION.DOWN);
                if (this.worm.direction !== Worm.DIRECTION.UP) {

                }
                break;
            case Game.KEYCODES.UP:
                e.preventDefault();
                this.worm.setDirection(Worm.DIRECTION.UP);
                if (this.worm.direction !== Worm.DIRECTION.DOWN) {

                }
                break;
            case Game.KEYCODES.LEFT:
                e.preventDefault();
                this.worm.setDirection(Worm.DIRECTION.LEFT);
                if (this.worm.direction !== Worm.DIRECTION.RIGHT) {

                }
                break;
            case Game.KEYCODES.RIGHT:
                e.preventDefault();
                this.worm.setDirection(Worm.DIRECTION.RIGHT);
                if (this.worm.direction !== Worm.DIRECTION.LEFT) {

                }
                break;
            case Game.KEYCODES.SPACE:
                e.preventDefault();
                this.pause();
                break;
        }
    };
    p.gameover = function () {
        this.ended = true;
        this.canvas.off("tick", this.tick, this);
        this.canvas.applyOptions({
            font: "90px Courier",
            fillStyle: "#FFF",
            textAlign: "center",
            shadowColor: "#FA6",
            shadowBlur: 10
            });
        this.canvas.ctx.fillText(
            "GAME OVER",
            Math.round(this.canvas.dims.w / 2),
            Math.round(this.canvas.dims.h / 2)
            );
        this.canvas.ctx.font = "40px Courier";
        this.canvas.ctx.fillText(
            "You scored " + this.score.score + " points",
            Math.round(this.canvas.dims.w / 2),
            Math.round(this.canvas.dims.h / 2) + 95
            );
        this.updateDuration();
        this.trigger(this.subs.gameover, "gameover", this);
    };
    p.updateDuration = function () {
        this.duration += Date.now() - this.started;
    };
    p.pause = function () {
        if (this.paused && ! this.ended) {
            this.canvas.on("tick", this.tick, this);
            this.paused = false;
            this.started = Date.now();
        } else {
            this.paused = this.canvas.off("tick", this.tick, this);

            if (this.paused) {
                this.updateDuration();
            }
        }
    };
    return Game;
});

/*global require: true*/
require(["canvas", "game"], function (Canvas, Game){
    var w = window, d = document;

    function renderToplist(data) {
        var container = d.querySelector(".toplist ol");
        while (container.firstChild !== null) {
            container.removeChild(container.firstChild);
        }
        data.forEach(function (score) {
            var points = parseInt(score[0], 10),
                duration = parseInt(score[1], 10) / 1000,
                when = new Date(parseInt(score[2], 10)),
                li = d.createElement("li"),
                txt = d.createTextNode(
                    points + " points in " +
                    duration + " seconds on " +
                    when.toLocaleString()
                    ),
                snap;
            if (score.length === 4) {
                snap = document.createElement("a");
                snap.setAttribute("href", score[3]);
                snap.setAttribute("title", "Screenshot of Game Over screen for this game");
                snap.setAttribute("target", "snap");
                snap.appendChild(txt);
                li.appendChild(snap);
            } else {
                li.appendChild(txt);
            }
            container.appendChild(li);
        });
        container.parentNode.removeAttribute("hidden");
    }
    function compileQueryString(vars) {
        var keys = (function (vars, p) {
                var ret = [];
                for (p in vars) {
                    ret.push(p);
                }
                ret.sort();
                return ret;
                }(vars));
        return keys.map(
            function (key) {
                return key + "=" + encodeURIComponent(vars[key]);
                }).
                join("&");
    }
    function appendChecksum(qs) {
        var cs = qs.split("").
            reduce(
                function (acc, curr) {
                    return acc + curr.charCodeAt(0);
                    },
                0
                );
        return qs + "&cs=" + String(cs);
    }
    function persistScore(score, duration, snap, nonce) {
        var xhr = new XMLHttpRequest();
        if (nonce == null) {
            xhr.open("GET", "./score.php", true);
            xhr.onreadystatechange = function (e) {
                var xhr = e.target,
                    data;
                if (xhr.readyState === xhr.DONE) {
                    try {
                        data = JSON.parse(xhr.responseText);
                        renderToplist(data.scores);
                        if ("nonce" in data) {
                            persistScore(score, duration, snap, data.nonce);
                        }
                    } catch (x) {}
                }
            };
            xhr.send();
        } else if (!!score && score > 0 && !!duration && !!nonce) {
            xhr.open("POST", "./score.php", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function (e) {
                var xhr = e.target,
                    data;
                if (xhr.readyState === xhr.DONE) {
                    try {
                        data = JSON.parse(xhr.responseText);
                        renderToplist(data.scores);
                    } catch (x) {}
                }
            };
            xhr.send(appendChecksum(compileQueryString({
                duration: duration,
                nonce: nonce,
                score: score,
                snap: snap || ""
                })));
        }
    }
    w.addEventListener(
        "load",
        function () {
                var g = new Game(new Canvas(640, 480, 15));
                g.canvas.attach(d.querySelector(".canvasContainer"));
                g.on(
                    "gameover",
                    function (evt, game) {
                        persistScore(
                            game.score.score,
                            game.duration,
                            game.canvas.cnv.toDataURL("image/png")
                            );
                        }
                    );
                persistScore(-1);
            },
        false
        );
});

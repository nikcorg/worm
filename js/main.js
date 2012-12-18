/*global define: true*/
define(["util", "canvas", "game"], function (Util, Canvas, Game) {
    var w = window, d = document;

    function readableDuration(duration) {
        var minutes = Math.floor(duration / 60),
            seconds = Math.round(duration - (minutes * 60));

        return minutes + "m " + seconds + "s";
    }
    function renderToplist(data) {
        var container = d.querySelector(".toplist ol");
        while (container.firstChild !== null) {
            container.removeChild(container.firstChild);
        }
        data.forEach(function (score) {
            var points = parseInt(score[0], 10),
                duration = parseInt(score[1], 10) / 1000,
                when = new Date(parseInt(score[2], 10)),
                name = score[4] || "Anonymous",
                li = d.createElement("li"),
                txt = d.createTextNode(
                    name + " scored " +
                    points + " points in " +
                    readableDuration(duration) + " " +
                    Util.relativeformat(when)
                    ),
                snap;
            if (score.length >= 4) {
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
        var cs;
        // Calc checksum
        cs = qs.split("").
            reduce(
                function (acc, curr) {
                    return acc + curr.charCodeAt(0);
                    },
                0
                );
        // Append check bit
        cs += String(cs).split("").
            reduce(
                function (acc, curr) {
                    return acc + parseInt(curr, 10);
                    },
                0
                ).
            toString().
            substr(-1, 1);
        return qs + "&cs=" + String(cs);
    }
    function persistScore(name, score, duration, snap, nonce) {
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
                            persistScore(name, score, duration, snap, data.nonce);
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
                name: name,
                nonce: nonce,
                score: score,
                snap: snap || ""
                })));
        }
    }
    function persistNickname(name) {
        localStorage.setItem("nickname", name);
    }
    function init() {
        var nameinput,
            game;

        w.addEventListener(
            "load",
            function () {
                    game = new Game(new Canvas(640, 480, 15));

                    nameinput = d.querySelector("input[name=nick]");

                    if (!!localStorage["nickname"]) {
                        nameinput.value = localStorage["nickname"];
                    }

                    game.canvas.attach(d.querySelector(".canvasContainer"), true);
                    game.on(
                        "gameover",
                        function (evt, game) {
                            var name = nameinput.value;
                            persistScore(
                                name || "Anonymous",
                                game.score.score,
                                game.duration,
                                game.canvas.cnv.toDataURL("image/png")
                                );

                            if (!!name) {
                                localStorage["nickname"] = name;
                            }

                            }
                        );
                    persistScore(-1);
                },
            false
            );
    }

    return { init: init };
});

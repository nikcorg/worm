<?php
session_start();
$scores = file("./worm-scores.txt", FILE_IGNORE_NEW_LINES|FILE_SKIP_EMPTY_LINES);
function calcChecksum($str) {
    $i = 0;
    $l = strlen($str);
    $cs = 0;
    for (; $i < $l; $i++) {
        $cs += ord($str{$i});
    }
    return $cs;
}
if (isset($_POST["nonce"]) &&
    isset($_SESSION["nonce"]) &&
    isset($_SESSION["nonce_expires"]) &&
    $_SESSION["nonce_expires"] > time() &&
    $_SESSION["nonce"] === $_POST["nonce"] &&
    intval($_POST["score"]) > 0
) {
    unset($_SESSION["nonce"]);
    unset($_SESSION["nonce_expires"]);
    $qs = sprintf(
        "duration=%d&nonce=%s&score=%d&snap=%s",
        urlencode(intval($_POST["duration"])),
        urlencode($_POST["nonce"]),
        urlencode(intval($_POST["score"])),
        urlencode($_POST["snap"])
        );
    $cs = calcChecksum($qs);
    if ($cs === intval($_POST["cs"])) {
        list($meta, $snapdata) = explode(",", $_POST["snap"], 2);
        if ($img = imagecreatefromstring(base64_decode($snapdata))) {
            $snapfile = "snaps/" . $_POST["nonce"] . ".jpg";
            if (! imagejpeg($img, $snapfile)) {
                $snapfile = null;
            }
        }
        $scores[] = implode("|", array(
            $_POST["score"],
            $_POST["duration"],
            time() * 1000,
            $snapfile
            ));
        natsort($scores);
        $scores = array_reverse($scores);
        file_put_contents("worm-scores.txt", implode(PHP_EOL, $scores));
    }
}
header("Content-Type: application/json");
$nonce = sha1(time() + mt_rand());
$_SESSION["nonce"] = $nonce;
$_SESSION["nonce_expires"] = time() + (30 * 1000);
echo json_encode(array(
        "nonce" => $nonce,
        "scores" => array_map(
            function ($s) {
                return explode("|", $s, 4);
                },
            array_slice($scores, 0, 20)
            )
        ));


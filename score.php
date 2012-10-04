<?php
session_start();
define("OUTFILE", __DIR__ . "/.scores");
define("SNAPS_FS", __DIR__ . "/snaps");
define("SNAPS_WEB", "snaps");
$scores = file(OUTFILE, FILE_IGNORE_NEW_LINES|FILE_SKIP_EMPTY_LINES);
function checksum_is_valid($cs) {
    $check = substr($cs, -1, 1);
    $rest = preg_split("//", substr($cs, 0, -1), -1, PREG_SPLIT_NO_EMPTY);
    $sum = array_sum($rest);
    $ret = substr($sum, -1, 1) === $check;
    return $ret;
}
function checksum($str) {
    $i = 0;
    $l = strlen($str);
    $cs = 0;
    for (; $i < $l; $i++) {
        $cs += ord($str{$i});
    }
    $cs .= substr(array_sum(preg_split("//", $cs, -1, PREG_SPLIT_NO_EMPTY)), -1, 1);
    return intval($cs);
}
function require_in($cn, $vars) {
    foreach ($vars as $nm) {
        if (! isset($cn[$nm])) {
            return false;
        }
    }
    return true;
}
if (require_in($_POST, array("name", "nonce", "score", "duration", "cs")) &&
    require_in($_SESSION, array("nonce", "nonce_expires")) &&
    checksum_is_valid($_POST["cs"]) &&
    $_SESSION["nonce_expires"] > time() &&
    $_SESSION["nonce"] === $_POST["nonce"] &&
    intval($_POST["score"]) > 0
) {
    unset($_SESSION["nonce"]);
    unset($_SESSION["nonce_expires"]);
    $qs = sprintf(
        "duration=%d&name=%s&nonce=%s&score=%d&snap=%s",
        urlencode(intval($_POST["duration"])),
        urlencode($_POST["name"]),
        urlencode($_POST["nonce"]),
        urlencode(intval($_POST["score"])),
        urlencode($_POST["snap"])
        );
    $cs = checksum($qs);
    if (checksum_is_valid($cs) && $cs === intval($_POST["cs"])) {
        list($meta, $snapdata) = explode(",", $_POST["snap"], 2);
        if ($img = imagecreatefromstring(base64_decode($snapdata))) {
            $snap_fs = sprintf("%s/%s.jpg", SNAPS_FS, $_POST["nonce"]);
            $snap_web = sprintf("%s/%s", SNAPS_WEB, basename($snap_fs));
            if (! imagejpeg($img, $snap_fs)) {
                $snap_web = null;
            }
        }
        $scores[] = implode("|", array(
            intval($_POST["score"]),
            floatval($_POST["duration"]),
            time() * 1000,
            $snap_web,
            str_replace("/[^[:alnum:]-_ ]/", "", $_POST["name"])
            ));
        natsort($scores);
        $scores = array_reverse($scores);
        file_put_contents(OUTFILE, implode(PHP_EOL, $scores));
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
                return explode("|", $s, 5);
                },
            array_slice($scores, 0, 20)
            )
        ));


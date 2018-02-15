<?php

$MAX_IMAGES = 50;
$TIMEOUT = 1;
session_start();

if(!isset($_SESSION['imageIndex'])) {
    $_SESSION['imageIndex'] = 0;
}

if(!isset($_SESSION['lastUpdate'])) {
    $_SESSION['lastUpdate'] = 0;
}

if(time() - $_SESSION['lastUpdate'] > $TIMEOUT) {
    $_SESSION['imageIndex'] = rand(0, $MAX_IMAGES);
    $_SESSION['lastUpdate']= time();
}

header("Content-Type:image/png");
echo file_get_contents(__DIR__.'/../imgs/random/picture-'.$_SESSION['imageIndex'].'.png');
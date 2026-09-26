<?php

/*
 * Use this file ONLY if your host does not let you change the domain's
 * document root. Copy everything from the app's "public" folder into
 * public_html, then replace public_html/index.php with this file and
 * fix APP_DIR below so it points at the folder where you extracted the app.
 */

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

$appDir = __DIR__.'/../10mschool'; // <- change if you extracted the app somewhere else

if (file_exists($maintenance = $appDir.'/storage/framework/maintenance.php')) {
    require $maintenance;
}

require $appDir.'/vendor/autoload.php';

/** @var Application $app */
$app = require_once $appDir.'/bootstrap/app.php';

// Uploaded images and built assets are served from public_html.
$app->usePublicPath(__DIR__);

$app->handleRequest(Request::capture());

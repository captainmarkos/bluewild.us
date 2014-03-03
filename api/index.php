<?php

// The .htaccess redirects every request to index.php.

require_once('classes/request.php');
require_once('config/db.php');

$DEBUG = false;

// The controllers are reliably found in the controllers directory, called
// something ending in *Controller.php. This makes it simple to add to an
// autoload rule.

spl_autoload_register('apiAutoload');
function apiAutoload($classname) {
    if($DEBUG) echo "[DEBUG] classname: $classname\n";

    if(preg_match('/[a-zA-Z]+Controller$/', $classname)) {
      if($DEBUG) echo "[DEBUG] including: " . __DIR__ . '/controllers/' . $classname . ".php\n";
        include __DIR__ . '/controllers/' . $classname . '.php';
        return true;
    }
    elseif(preg_match('/[a-zA-Z]+Model$/', $classname)) {
        include __DIR__ . '/models/' . $classname . '.php';
        return true;
    }
    elseif(preg_match('/[a-zA-Z]+View$/', $classname)) {
        include __DIR__ . '/views/' . $classname . '.php';
        return true;
    }
}

$request = new Request();

if($DEBUG) {
    echo "[DEBUG] request->verb: " . $request->verb . "\n";
    echo "[DEBUG] request->url_elements:\n"; var_dump($request->url_elements); echo "\n";
    echo "[DEBUG] request->parameters:\n"; var_dump($request->parameters); echo "\n";
}

// Route the request to the right controller.
$controller_name = ucfirst($request->url_elements[1]) . 'Controller';
if(class_exists($controller_name)) {
    if($DEBUG) echo "[DEBUG] controller_name: " . $controller_name . "\n";
    $controller = new $controller_name($dbconn);
    $action_name = strtolower($request->verb);
    $result = $controller->$action_name($request);
    print_r($result);
}
else {
    $result = json_encode(array('status' => 'failed',
                                'timestamp' => date("Y-m-d H:i:s"),
                                'errno' => '401',
                                'error' => 'Invalid controller'));

    print_r($result);
}

?>

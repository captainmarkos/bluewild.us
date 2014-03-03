<?php
    // http://bluewild.local/divelog_v3/test.php?id=70
    // http://bluewild.local/divelog_v3/test.php?email=captainmarkos@gmail.com

    require('config/db.php');
    require('classes/divelog_api.php');

    $api = new DivelogAPI($dbconn);

    //$_REQUEST['email'] = 'captainmarkos@gmail.com';
    //$_REQUEST['id'] = 70;


    if(isset($_REQUEST['id'])) {
        $json_response = $api->find_by_id($_REQUEST['id']);
        echo $json_response;
    }

    if(isset($_REQUEST['email'])) {
        $json_response = $api->find_all($_REQUEST['email']);
        echo $json_response;
    }

    exit(0);
?>

<?php
    require_once('../lib/config.php');

    $action = (isset($_REQUEST['action'])) ? $_REQUEST['action'] : '';
    $fname = (isset($_REQUEST['fname'])) ? $_REQUEST['fname'] : '';
    $lname = (isset($_REQUEST['lname'])) ? $_REQUEST['lname'] : '';
    $email = (isset($_REQUEST['email'])) ? $_REQUEST['email'] : '';
    $passwd = (isset($_REQUEST['passwd'])) ? $_REQUEST['passwd'] : '';
    $user_id = (isset($_REQUEST['user_id'])) ? $_REQUEST['user_id'] : '';

    if($action == '') { die('ERROR: undefined action.'); }
    else if($action == 'sign_in') {
        $em = $dbconn->real_escape_string($email);
        $pw = $dbconn->real_escape_string($passwd);
        $sql = "select * from users where email='$em' and passwd=PASSWORD('$pw')";
        $res = $dbconn->query($sql);
        if($res->num_rows < 1) { die('ERROR: invalid email or password.'); }
        else {
            $_SESSION['email'] = $email;
            die('SUCCESS');
	}
    }
    else if($action == 'sign_out') {
        $_SESSION['email'] = '';
        die('SUCCESS');
    }
    else if($action == 'create_user') {
        $fn = $dbconn->real_escape_string($fname);
        $ln = $dbconn->real_escape_string($lname);
        $em = $dbconn->real_escape_string($email);
        $sql  = "insert into users (email, fname, lname, passwd) values ";
        $sql .= "('$em', '$fn', '$ln', PASSWORD('$passwd'))";
        $res = $dbconn->query($sql);
        if(!$res) { die('ERROR: Insert failed: ' . $dbconn->error); }
        $_SESSION['email'] = $email;
        print "SUCCESS";
    }
    else if($action == 'update_user') {
        $fn = $dbconn->real_escape_string($fname);
        $ln = $dbconn->real_escape_string($lname);
        $em = $dbconn->real_escape_string($email);
        $sql  = "update users set email='$em', fname='$fname', lname='$lname' ";
        $sql .= "where id=$user_id";
        $res = $dbconn->query($sql);
        if(!$res) { die('ERROR: Update failed: ' . $dbconn->error); }
        $_SESSION['email'] = $email;
        print "SUCCESS";
    }
    else if($action == 'delete_user') {
        $em = $_SESSION['email'];
        $sql  = "delete from users where email='$em'";
        $res = $dbconn->query($sql);
        if(!$res) { die('ERROR: Delete failed: ' . $dbconn->error); }
        $_SESSION['email'] = '';
        print "SUCCESS";
    }
    else if($action == 'forgot_passwd') {
        include('Mail.php');
        include('Mail/mime.php');
        $em = $dbconn->real_escape_string($email);
        $sql = "select * from users where email='$em'";
        $res = $dbconn->query($sql);
        if(!$res) { die('ERROR: Email address not found.'); }
        else {
            $temp_passwd = rand_passwd();
            $sql = "update users set passwd=PASSWORD('$temp_passwd') where email='$em'";
            $res = $dbconn->query($sql);

            $text  = "You have requested a password reset.  Your password has been reset ";
            $text .= "to:\n\n" . $temp_passwd . "\n\n";
            $text .= "Please change your password after you log in using the above temporary ";
            $text .= "password.\n\n";

            $html  = "You have requested a password reset.  Your password has been reset ";
            $html .= "to:<br /><br />" . $temp_passwd . "<br /><br />";
            $html .= "Please change your password after you log in using the above temporary ";
            $html .= "password.<br /><br />";

            $subject = "Password reset request";

            $hdrs = array('From'     => 'BlueWild.us <bluewild.us@gmail.com>',
                          'Reply-To' => 'bluewild.us@gmail.com',
                          'Bcc'      => 'captainmarkos@gmail.com',
                          'Subject'  => $subject);

            $crlf = "\n";
            $mime = new Mail_mime($crlf);
            $mime->setTXTBody($text);
            $mime->setHTMLBody($html);

            //do not ever try to call these lines in reverse order
            $body = $mime->get();
            $hdrs = $mime->headers($hdrs);

            $mail =& Mail::factory('mail');
            $res = $mail->send($email, $hdrs, $body);
            if($res == false) { die('ERROR: sending email: $mail->send() failed.'); }
        }
    }
    
?>

<?php

function rand_passwd() {
    $chars = Array();
    $randpass = '';
    $i = 0;
    for($j = 48; $j <= 57; $j++) $chars[$i++] = chr($j);
    for($j = 65; $j <= 90; $j++) $chars[$i++] = chr($j);
    for($j = 97; $j <=122; $j++) $chars[$i++] = chr($j);

    for($j = 0; $j < 8; $j++) {
        $randpass .= $chars[rand(0, count($chars) -1)];
    }
    return $randpass;
}

?>

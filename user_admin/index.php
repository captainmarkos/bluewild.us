<?php
    require('lib/config.php');
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="description" content="User Administration" />
<meta name="keywords" content="dive log, image gallery, online diver logbook, diver logbook" />
<title>BlueWild.us - User Administration</title>
<link type="text/css" rel="stylesheet" href="user_admin.css" />
<script type="text/javascript" src="/javascript/jquery-1.9.1.min.js"></script>
<script type="text/javascript" src="/javascript/jquery-migrate-1.1.1.js"></script>
<script type="text/javascript">
$(document).ready(function() {
    // Attach onclick event handlers to elements.
    $('#sign_in').click(function() {
        $('#user_admin_display').load('sign_in.php');
    });

    $('#create_user').click(function() {
        $('#user_admin_display').load('user_create.php');
    });


    $("#update_user").click(function() {
        $('#user_admin_display').load('user_update.php');
    });

     $('#sign_out').click(function() {
        $.ajax({
            type: "POST",
            url: 'ajax/user_admin.php',
            data: { action: 'sign_out' }
        }).done(function(result) {
            if(result.substr(0, 7) == 'SUCCESS') {
                window.location = 'index.php';
            }
        }).fail(function(jqXHR, textStatus) { 
            alert("Request failed: " + jqXHR.status + " " + textStatus); 
            $('#user_admin_display').html('');
        });
    });

    $("#delete_user").click(function() {
        var msg  = 'All user data will be deleted forever.\n\n';
            msg += 'Delete this user?';
        var result = confirm(msg);
        if(result != true) { return false; }
        $.ajax({
            type: "POST",
            url: 'ajax/user_admin.php',
            data: { action: 'delete_user' }
        }).done(function(result) {
            if(result.substr(0, 7) == 'SUCCESS') {
                window.location = 'index.php';
            }
            else { alert(result); }
        }).fail(function(jqXHR, textStatus) {
            alert("Request failed: " + jqXHR.status + " " + textStatus);
            $('#user_admin_display').html('');
        });
    });

    $('#forgot_password').click(function() {
        $('#user_admin_display').load('forgot_password.php');
    });
});
</script>
</head>
<body>
<div style="text-align: center;"><h2>User Administration</h2></div>
<hr />
<div style="font: 9pt Arial, sans-serif; border-left: 1px solid #a0a0a0; border-top: 1px solid #a0a0a0; border-right: 1px solid #000000; border-bottom: 1px solid #000000; background-color:#ffff99; color:#0000ff; width:260px; padding:4px 0px 4px 4px;">Logged In: <?php echo @$_SESSION['email']; ?></div>
<ul>
    <li><span id="sign_in">Sign In</span></li>
    <li><span id="sign_out">Sign Out</span></li>
    <li><span id="create_user">Create User Account</span></li>
    <li><span id="update_user">Update User Account</span></li>
    <li><span id="delete_user">Delete User Account</span></li>
    <li><span id="forgot_password">Forgotten Password</span></li>
</ul>

<div id="user_admin_display"></div>

</body>
</html>

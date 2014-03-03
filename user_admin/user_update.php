<?php

    require('lib/config.php');

    if(isset($_SESSION['email']) && $_SESSION['email'] != '') {
        $sql  = "select * from users where email='" . $_SESSION['email'] . "' ";
        $sql .= "and deleted='N'";
        $res = $dbconn->query($sql);
        if($res) { 
            $row = $res->fetch_assoc();
            $user_id = $row['id'];
            $fname = $row['fname'];
            $lname = $row['lname'];
            $email = $row['email'];
            $passwd = $row['passwd'];
        }
    }
?>
<script type="text/javascript" src="/javascript/jquery-1.9.1.min.js"></script>
<script type="text/javascript" src="/javascript/jquery-migrate-1.1.1.js"></script>
<script type="text/javascript">

$('#update_user_submit').click(function() {
    var user_id = $('#user_id').val() ? $('#user_id').val() : '';
    var fname = $('#ua_fname').val() ? $('#ua_fname').val() : '';
    var lname = $('#ua_lname').val() ? $('#ua_lname').val() : '';
    var email = $('#ua_email').val() ? $('#ua_email').val() : '';

    // Reset label colors
    $('#email_label').css({'color' : '#000000'});

    // Confirm email exists and is valid.
    if(email == '' || !email.match(/@/)) {
        $('#ua_email').val('');
        $('#email_label').css({'color' : '#cd0000'});
        $('#ua_email').focus();
        return false;
    }

    $.ajax({
        type: "POST",
        url: 'ajax/user_admin.php',
        data: { action: 'update_user', user_id: user_id, fname: fname, lname: lname, email: email }
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

</script>

<input type="hidden" id="user_id" value="<?=$user_id?>" />
<table border="0" width="420" cellspacing="0" cellpadding="2" style="border: 1px solid #0000ff;">

    <tr>
        <td align="center" valign="top" colspan="2" style="height: 30px;" class="myfont2"><b>Update User Account</b></td>
    </tr>

    <tr>
        <td align="left">First Name:</td>
        <td align="left"><input type="text" id="ua_fname" value="<?=$fname?>" maxlength="64" size="36" /></td>
    </tr>

    <tr>
        <td align="left">Last Name:</td>
        <td align="left"><input type="text" id="ua_lname" value="<?=$lname?>" maxlength="64" size="36" /></td>
    </tr>

    <tr>
        <td align="left" id="email_label">Email Address:</td>
        <td align="left"><input type="text" id="ua_email" value="<?=$email?>" maxlength="128" size="36" /></span></td>
    </tr>

    <tr>
        <td align="left" id="passwd1_label">Password:</td>
        <td align="left"><input type="password" id="ua_passwd1" value="" maxlength="16" size="16" /></td>
    </tr>

    <tr>
        <td align="left" id="passwd2_label">Confirm Password:</td>
        <td align="left"><input type="password" id="ua_passwd2" value="" maxlength="16" size="16" /></td>
    </tr>

    <tr><td align="left" colspan="2" style="height: 20px;">&nbsp;</td></tr>

    <tr>
        <td align="center" colspan="2" style="height: 30px;">
            <input type="button" id="update_user_submit" value=" Update " />
        </td>
    </tr>

</table>

<script type="text/javascript" src="/javascript/jquery-1.9.1.min.js"></script>
<script type="text/javascript" src="/javascript/jquery-migrate-1.1.1.js"></script>
<script type="text/javascript">

$('#create_user_submit').click(function() {
    var fname = $('#ua_fname').val() ? $('#ua_fname').val() : '';
    var lname = $('#ua_lname').val() ? $('#ua_lname').val() : '';
    var email = $('#ua_email').val() ? $('#ua_email').val() : '';
    var passwd1 = $('#ua_passwd1').val() ? $('#ua_passwd1').val() : '';
    var passwd2 = $('#ua_passwd2').val() ? $('#ua_passwd2').val() : '';

    // Reset label colors
    $('#email_label').css({'color' : '#000000'});
    $('#passwd1_label').css({'color' : '#000000'});
    $('#passwd2_label').css({'color' : '#000000'});
    $('#passwd_msg').html('');

    // Confirm email exists and is valid.
    if(email == '' || !email.match(/@/)) {
        $('#ua_email').val('');
        $('#email_label').css({'color' : '#cd0000'});
        $('#ua_email').focus();
        return false;
    }
    // Confirm passwords match.
    if(passwd1 == '' || passwd2 == '') {
        passwd_error_highlight('password required');
        return false;
    }
    else if(passwd1 != passwd2) {
        passwd_error_highlight('passwords do not match');
        return false;
    }
    else if(passwd1.length < 8) {
        passwd_error_highlight('8 characters minimum');
        return false;
    }

    $.ajax({
        type: "POST",
        url: 'ajax/user_admin.php',
        data: { action: 'create_user', fname: fname, lname: lname, email: email, passwd: passwd1 }
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

var passwd_error_highlight = function(msg) {
    $('#passwd_msg').html(msg);
    $('#passwd_msg').css({'font' : '9pt Arial, sans-serif', 'color' : '#cd0000'});
    $('#ua_passwd1').val('');
    $('#ua_passwd2').val('');
    $('#passwd1_label').css({'color' : '#cd0000'});
    $('#passwd2_label').css({'color' : '#cd0000'});
    $('#ua_passwd1').focus();
}

</script>
<table border="0" width="420" cellspacing="0" cellpadding="2" style="border: 1px solid #0000ff;">

    <tr>
        <td align="center" valign="top" colspan="2" style="height: 30px;" class="myfont2"><b>Create User Account</b></td>
    </tr>

    <tr>
        <td align="left">First Name:</td>
        <td align="left"><input type="text" id="ua_fname" value="" maxlength="64" size="36" /></td>
    </tr>

    <tr>
        <td align="left">Last Name:</td>
        <td align="left"><input type="text" id="ua_lname" value="" maxlength="64" size="36" /></td>
    </tr>

    <tr>
        <td align="left" id="email_label">Email Address:</td>
        <td align="left"><input type="text" id="ua_email" value="" maxlength="128" size="36" /></span></td>
    </tr>

    <tr>
        <td align="left" id="passwd1_label">Password:</td>
        <td align="left"><input type="password" id="ua_passwd1" value="" maxlength="16" size="16" /> <span id="passwd_msg"></span></td>
    </tr>

    <tr>
        <td align="left" id="passwd2_label">Confirm Password:</td>
        <td align="left"><input type="password" id="ua_passwd2" value="" maxlength="16" size="16" /></td>
    </tr>

    <tr><td align="left" colspan="2" style="height: 20px;">&nbsp;</td></tr>

    <tr>
        <td align="center" colspan="2" style="height: 30px;">
            <input type="button" id="create_user_submit" value=" Create " />
        </td>
    </tr>

</table>

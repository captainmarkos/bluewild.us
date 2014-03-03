<script type="text/javascript" src="/javascript/jquery-1.9.1.min.js"></script>
<script type="text/javascript" src="/javascript/jquery-migrate-1.1.1.js"></script>
<script type="text/javascript">

$('#forgot_passwd_submit').click(function() {
    var username = $('#email').val() ? $('#email').val() : '';
    if(username == '') {
        alert('Invalid email address.');
    }
    else {
        $.ajax({
            type: "POST",
            url: 'ajax/user_admin.php',
            data: { action: 'forgot_passwd', email: username }
        }).done(function(result) {
            if(result.substr(0, 7) == 'SUCCESS') {
                window.location = 'index.php';
	    }
            else { alert(result); }
        }).fail(function(jqXHR, textStatus) {
            alert("Request failed: " + jqXHR.status + " " + textStatus);
            $('#user_admin_display').html('');
        });
    }
});

</script>
<table style="border: 1px solid #0000ff;" width="240">
    <tr><td align="center" colspan="2">Forgotten Password<br /><br /></td></tr>
    <tr>
        <td align="right">Email:</td>
        <td align="left"><input style="width: 165px;" type="text" id="email" value="" maxlength="128" /></td>
    </tr>

    <tr><td colspan="2" >&nbsp;</td></tr>

    <tr>
        <td align="center" colspan="2"><input type="submit" id="forgot_passwd_submit" value=" Send " /></td>
    </tr>

    <tr><td colspan="2">&nbsp;</td></tr>
    <tr>
        <td colspan="2"><span style="font: 9pt Arial, sans-serif;">
            A password reset will be emailed to you shortly.</span>
        </td>
    </tr>

</table>

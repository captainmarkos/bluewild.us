<script type="text/javascript" src="/javascript/jquery-1.9.1.min.js"></script>
<script type="text/javascript" src="/javascript/jquery-migrate-1.1.1.js"></script>
<script type="text/javascript">

$('#sign_in_submit').click(function() {
    var username = $('#email').val() ? $('#email').val() : '';
    var password = $('#passwd').val() ? $('#passwd').val() : '';
    if(username == '' || password == '') {
        alert('Invalid username or password');
    }
    else {
        $.ajax({
            type: "POST",
            url: 'ajax/user_admin.php',
            data: { action: 'sign_in', email: username, passwd: password }
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

$('#sign_in_create_user').click(function() {
    $('#user_admin_display').load('user_create.php');
});

$('#sign_in_forgot_password').click(function() {
    $('#user_admin_display').load('forgot_password.php');
});

</script>
<table style="border: 1px solid #0000ff;" width="240">
    <tr><td align="center" colspan="2">Sign In<br /><br /></td></tr>
    <tr>
        <td align="right">Email:</td>
        <td align="left"><input style="width: 160px;" type="text" id="email" value="" maxlength="128" /></td>
    </tr>

    <tr>
        <td align="right">Password:</td>
        <td align="left"><input style="width: 160px;" type="password" id="passwd" value="" maxlength="16" /></td>
    </tr>

    <tr><td colspan="2" >&nbsp;</td></tr>

    <tr>
        <td align="center" colspan="2"><input type="submit" id="sign_in_submit" value=" Sign In " /></td>
    </tr>

    <tr><td colspan="2">&nbsp;</td></tr>

    <tr>
        <td align="center" colspan="2" class="myfont_small"><span id="sign_in_create_user">Create an Account</span></td>
    </tr>

    <tr>
        <td align="center" colspan="2" class="myfont_small"><span id="sign_in_forgot_password">Forgot Password</span></td>
    </tr>
</table>

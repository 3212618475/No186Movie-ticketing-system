var user_id=sessionStorage.getItem('id');
var user_name=sessionStorage.getItem('username');

$(document).ready(function () {
    document.getElementById('user-name').innerText =user_name;
    getUser();


function getUser(){
    getRequest(
        '/get/user/?userId='+user_id,
        function (res) {
            $("#user-name-input").attr('value',res.content.username);
            $("#user-password-input").attr('value',res.content.password);
        },
        function (error) {
            alert(error);
        }
    );
}

$("#user-update-btn").click(function(){//alert("123");
    var new_name=$("#user-name-input").val();
    var new_password=$("#user-password-input").val();
    if(!validateName(new_name)||!validatePassword(new_password)){
        return;
    }
    var new_user={
        id:user_id,
        username:new_name,
        password:new_password,
    };
    postRequest(
        '/update/user',
        new_user,
        function(res){
            if(res.success){
                alert("修改成功");
                sessionStorage.setItem('username', new_name);
                window.location.reload();
            }
        },
        function (error){
            alert(error);
        }
    );
});

function validateName(data){
    var isValidate = true;
    if (!data || data.length < 4 || data.length > 10) {
        isValidate = false;
        $('#user-name-input').parent('.input-group').addClass('has-error');
        $('#user-name-input-error').css("visibility", "visible");
    }
    return isValidate;
}
function validatePassword(data){
    var isValidate = true;
    if (!data || data.length < 6 || data.length > 12) {
        isValidate = false;
        $('#user-password-input').parent('.input-group').addClass('has-error');
        $('#user-password-input-error').css("visibility", "visible");
    }
    return isValidate;
}
});
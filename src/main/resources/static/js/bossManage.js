var user_name=sessionStorage.getItem('username');
var userList=[];
var adminList=[];
var accountList=[];
$(document).ready(function () {
    document.getElementById('user-name').innerText = user_name;
    getAllUser();

    function getAllUser(){
        getRequest(
            '/get/all/user',
            function (res) {
                if(res.success){
                    userList=res.content;
                    renderList(userList);
                }
            },
            function (error) {
                alert(error);
            }
        );
    }
    function renderList(list){
        for(let it of list){
            if(it.kind==1){
                adminList.push(it);
            }
            if(it.kind==2){
                accountList.push(it);
            }
        }//alert(adminList.length);
        var info=getInfo(adminList);
        $("#admin-list").html(info);
    }
    function getInfo(list){
        var result="";
        for(let it of list){
            result+="<tr><td>"+it.username+"</td>";
            if(it.kind==2){
                result+="<td>"+"用户隐私，不可见"+"</td></tr>";
            }
            if(it.kind==1){
                result+="<td>"+it.password+"</td></tr>";
            }
        }
        return result;
    }

    $("#admin-form-btn").click(function(){
       var data=getAdminUpForm();
       if(!validateAdminForm(data)){
           return;
       }
        postRequest(
            '/register',
            data,
            function (res) {
                if (res.success) {
                    alert("添加成功");
                    window.location.reload();
                } else {
                    alert(res.message);
                }
            },
            function (error) {
                alert(error);
            });

    });

    $("#admin-edit-btn").click(function(){
        $("#admin-edit-id-input").empty();
        for(var i =0;i<adminList.length;i++){
            $("#admin-edit-id-input").append("<option value="+adminList[i].id+">"+adminList[i].id+"</option>");  //为Select追加一个Option(下拉项)
        }
        $("#admin-edit-name").attr('value',adminList[0].username);
        $("#admin-edit-password").attr('value',adminList[0].password);
    });
    $("#admin-edit-id-input").on('change',function() {
        var p1=$(this).children('option:selected').val();//alert(p1);
        var d=0;
        for(var i=0;i<adminList.length;i++){
            if(adminList[i].id==p1){
                d=i;
                break;
            }
        }//alert(d);
        $("#admin-edit-name").attr('value',adminList[d].username);
        $("#admin-edit-password").attr('value',adminList[d].password);
    });
    $("#admin-update-btn").click(function(){
        var data=getEditAdminUpForm();
        if(!validateAdminForm(data)){
            return;
        }
        postRequest(
            '/update/user',
            data,
            function (res) {
                if (res.success) {
                    alert("修改成功");
                    window.location.reload();
                } else {
                    alert(res.message);
                }
            },
            function (error) {
                alert(error);
            });
    });

    $("#admin-drop-btn").click(function () {
        var a=1;
        $("#admin-drop-id-input").empty();
        for(var i =0;i<adminList.length;i++){
            $("#admin-drop-id-input").append("<option value="+adminList[i].id+">"+adminList[i].id+"</option>");  //为Select追加一个Option(下拉项)
            a++;
        }

    });


    $("#admin-delete-btn").click(function () {
        var r=confirm("确认要改管理员吗？");
        if(r){
            var target=$("#admin-drop-id-input").children('option:selected').val();
            postRequest(
                '/delete/user?userId='+target,
                null,
                function(res){alert("删除成功");
                    window.location.reload();
                    $("#adminDeleteModal").modal('hide');
                },
                function (error) {
                    alert(JSON.stringify(error));
                }
            )
        }
    })

    function getEditAdminUpForm() {
        return {
            id:$("#admin-edit-id-input").children('option:selected').val(),
            username: $('#admin-edit-name').val(),
            password: $('#admin-edit-password').val(),
            kind:1
        };
    }
    function getAdminUpForm() {
        return {
            username: $('#admin-name').val(),
            password: $('#admin-password').val(),
            kind:1
        };
    }
    function validateAdminForm(data) {
        var isValidate = true;
        if (!data.username || data.username.length < 4 || data.username.length > 10) {
            isValidate = false;
            $('#admin-name').parent('.input-group').addClass('has-error');
            $('#admin-name-error').css("visibility", "visible");
        }
        if (!data.password || data.password.length < 6 || data.password.length > 12) {
            isValidate = false;
            $('#admin-password').parent('.input-group').addClass('has-error');
            $('#admin-password-error').css("visibility", "visible");
        }

        return isValidate;
    }

});
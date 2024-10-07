var user_name=sessionStorage.getItem('username');

$(document).ready(function() {
    $("#admin-name").html(user_name);
    var halls=[];
    var canSeeDate = 0;

    getCanSeeDayNum();
    getCinemaHalls();

    function getCinemaHalls() {

        getRequest(
            '/hall/all',
            function (res) {
                halls = res.content;
                renderHall(halls);
                //window.alert(halls[3].id)
            },
            function (error) {
                alert(JSON.stringify(error));
            }
        );
    }

    function renderHall(halls){
        $('#hall-card').empty();
        var hallDomStr = "";
        halls.forEach(function (hall) {
            var seat = "";
            for(var i =0;i<hall.row;i++){
                var temp = ""
                for(var j =0;j<hall.column;j++){
                    temp+="<div class='cinema-hall-seat'></div>";
                }
                seat+= "<div>"+temp+"</div>";
            }
            var hallDom =
                "<div class='cinema-hall'>" +
                "<div>" +
                "<span class='cinema-hall-name'>"+ hall.name +"</span>" +
                "<span class='cinema-hall-size'>"+ hall.column +'*'+ hall.row +"</span>" +
                "</div>" +
                "<div class='cinema-seat'>" + seat +
                "</div>" +
                "</div>";
            hallDomStr+=hallDom;
        });
        $('#hall-card').append(hallDomStr);
    }

    function getCanSeeDayNum() {
        getRequest(
            '/schedule/view',
            function (res) {
                canSeeDate = res.content;
                $("#can-see-num").text(canSeeDate);
            },
            function (error) {
                alert(JSON.stringify(error));
            }
        );
    }

    $('#canview-modify-btn').click(function () {
       $("#canview-modify-btn").hide();
       $("#canview-set-input").val(canSeeDate);
       $("#canview-set-input").show();
       $("#canview-confirm-btn").show();
    });

    $('#canview-confirm-btn').click(function () {
        var dayNum = $("#canview-set-input").val();
        // 验证一下是否为数字
        postRequest(
            '/schedule/view/set',
            {day:dayNum},
            function (res) {
                if(res.success){
                    getCanSeeDayNum();
                    canSeeDate = dayNum;
                    $("#canview-modify-btn").show();
                    $("#canview-set-input").hide();
                    $("#canview-confirm-btn").hide();
                } else{
                    alert(res.message);
                }
            },
            function (error) {
                alert(JSON.stringify(error));
            }
        );
    });

    $("#hall-form-btn").click(function () {
        var form={
            id:$('#hall-id-input').val(),
            name:$('#hall-name-input').val(),
            row:$('#hall-row-input').val(),
            column:$('#hall-column-input').val(),
        }
        //window.alert("92!")
        postRequest(
            '/hall/add',
            form,
            function (res) {
                halls=res.content;
                renderHall(halls);
                $("#hallModal").modal('hide');
            },
            function (error) {
                alert(error);
            });
    });


    $("#hall-update-btn").click(function () {
        $("#hall-edit-id-input").empty();
        var a=1;
        for(var i =0;i<halls.length;i++){
            $("#hall-edit-id-input").append("<option value="+a+">"+halls[i].id+"</option>");  //为Select追加一个Option(下拉项)
            a++;
        }
        $('#hall-edit-name-input').attr('value',halls[0].name);
        $('#hall-edit-row-input').attr('value',halls[0].row);
        $('#hall-edit-column-input').attr('value',halls[0].column);
    });
    $("#hall-edit-id-input").on('change',function() {//alert('nmsl');
        //alert($(this).children('option:selected').val());
        var p1=$(this).children('option:selected').val();//alert(p1);
        $('#hall-edit-name-input').attr('value',halls[p1-1].name);
        $('#hall-edit-row-input').attr('value',halls[p1-1].row);
        $('#hall-edit-column-input').attr('value',halls[p1-1].column);
    });
    $("#hall-edit-btn").click(function () {
        var form={
            id:$("#hall-edit-id-input").children('option:selected').val(),
            name:$('#hall-edit-name-input').val(),
            row:$('#hall-edit-row-input').val(),
            column:$('#hall-edit-column-input').val(),
        }

        //window.alert("92!")
        postRequest(
            '/hall/update',
            form,
            function (res) {
                if(res.success){
                    halls=res.content;
                    renderHall(halls);
                    $("#hallEditModal").modal('hide');
                }
                else{
                    alert(res.message);
                    $("#hallEditModal").modal('hide');
                }
            },
            function (error) {
                alert(error);
            });
    });
});

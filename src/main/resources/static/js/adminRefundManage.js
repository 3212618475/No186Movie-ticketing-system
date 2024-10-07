var user_name=sessionStorage.getItem('username');

var policyList=[];
var movieList=[];
$(document).ready(function () {
    getAllMovie();
    getAllPolicy();
    $("#admin-name").html(user_name);
    function getAllMovie(){
        getRequest(
            '/movie/all/exclude/off',
            function (res) {
               movieList = res.content;
                //$('#activity-movie-input').append("<option value="+ -1 +">所有电影</option>");
                movieList.forEach(function (movie) {
                    $('#refund-movie-input').append("<option value="+ movie.id +">"+movie.name+"</option>");
                    $('#refund-edit-movie-input').append("<option value="+ movie.id +">"+movie.name+"</option>");
                });
            },
            function (error) {
                alert(error);
            }
        );
    }
    function getAllPolicy(){
        getRequest(
            '/get/all/refund',
            function (res) {
                policyList = res.content;
                renderPolicy(policyList);
            },
            function (error) {
                alert(JSON.stringify(error));
            }
        );
    }

    function renderPolicy(policyList) {
        $(".content-refund").empty();
        var refundDomStr = "";

        for (let policy of policyList) {

            refundDomStr +=
                "<div class='refund-container'>" +
                "    <div class='refund-card card'>" +
                "       <div class='refund-line'>" +
                "           <span class='title'>" + "退票策略：" + policy.id + "</span>" +
                "       </div>" +
                "       <div class='refund-line'>" +
                "           <span>活动时间：" + formatDate(new Date(policy.startTime)) + " 至 " +formatDate(new Date(policy.endTime)) + "</span>" +
                "       </div>" +
                "       <div class='refund-line'>" +
                "           <span>适用电影：</span>" +
                "               <ul>" + policy.movieName + "</ul>" +
                "       </div>" +
                "    </div>" +
                "    <div class='refund-coupon primary-bg'>" +
                "        <span class='title'>电影开始前：" + policy.timeBefore+"小时" + "</span>" +
                "         <span class='title'>手续费：" + policy.rate*100 + "%"+ "</span>      "+
                "    </div>" +
                "</div>";
        }
        $(".content-refund").html(refundDomStr);
    }

    $("#refund-form-btn").click(function () {

        var data={
            movieId:$("#refund-movie-input").val(),
            timeBefore:$("#refund-time-input").val(),
            startTime:$("#refund-start-date-input").val(),
            endTime:$("#refund-end-date-input").val(),
            rate:parseFloat($("#refund-rate-input").val())/100
        };
        postRequest(
            '/add/refund',
            data,
            function(res){//alert(res.content);
                window.location.reload();
            },
            function (error) {
                alert(JSON.stringify(error));
            }
        )
    });

    $("#refund-edit-btn").click(function () {
        var a=1;
        $("#refund-edit-id-input").empty();
        for(var i =0;i<policyList.length;i++){
            $("#refund-edit-id-input").append("<option value="+policyList[i].id+">"+policyList[i].id+"</option>");  //为Select追加一个Option(下拉项)
            a++;
        }

        $('#refund-edit-movie-input').children(policyList[0].movieName);
        $('#refund-edit-start-date-input').val(policyList[0].startTime.slice(0,10));
        $('#refund-edit-end-date-input').val(policyList[0].endTime.slice(0,10));
        $('#refund-edit-time-input').attr('value',policyList[0].timeBefore);
        $('#refund-edit-rate-input').attr('value',policyList[0].rate*100);
    });

    $("#refund-edit-id-input").on('change',function() {
        var p1=$(this).children('option:selected').val();
        var d=0;
        for(var i=0;i<policyList.length;i++){
            if(policyList[i].id==p1){
                d=i;
                break;
            }
        }
        //alert(policyList[d].movieName)
        $('#refund-edit-movie-input').children(policyList[d].movieName);
        $('#refund-edit-start-date-input').val(policyList[d].startTime.slice(0,10));
        $('#refund-edit-end-date-input').val(policyList[d].endTime.slice(0,10));
        $('#refund-edit-time-input').attr('value',policyList[d].timeBefore);
        $('#refund-rate-input').attr('value',policyList[d].rate);
    });

    $("#refund-update-btn").click(function () {

        var data={
            id:$("#refund-edit-id-input").children('option:selected').val(),
            movieId:$("#refund-edit-movie-input").children('option:selected').val(),
            timeBefore:$("#refund-edit-time-input").val(),
            startTime:$("#refund-edit-start-date-input").val(),
            endTime:$("#refund-edit-end-date-input").val(),
            rate:parseFloat($("#refund-edit-rate-input").val())/100
        };
        postRequest(
            '/update/refund',
            data,
            function(res){//alert(res.content);
                window.location.reload();
            },
            function (error) {
                alert(JSON.stringify(error));
            }
        )
    })

    $("#refund-drop-btn").click(function () {
        var a=1;
        $("#refund-drop-id-input").empty();
        for(var i =0;i<policyList.length;i++){
            $("#refund-drop-id-input").append("<option value="+policyList[i].id+">"+policyList[i].id+"</option>");  //为Select追加一个Option(下拉项)
            a++;
        }

    });


    $("#refund-delete-btn").click(function () {
        var r=confirm("确认要删除该退票策略吗？");
        if(r){
            var target=$("#refund-drop-id-input").children('option:selected').val();
            postRequest(
                '/delete/refund?target_id='+target,
                null,
                function(res){alert("删除成功");
                    policyList=res.content;
                    renderPolicy(policyList);
                    $("#refundDeleteModal").modal('hide');
                },
                function (error) {
                    alert(JSON.stringify(error));
                }
            )
        }
    })
})
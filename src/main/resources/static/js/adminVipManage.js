var user_name=sessionStorage.getItem('username');

$(document).ready(function() {
    $("#admin-name").html(user_name);
    var strategyList=[];
    var vipList=[];
    var couponList=[];
    getAllVipStrategy();
    getVipList();
    getAllCoupon();
    function getAllVipStrategy() {
        getRequest(
            '/vip/get/all/strategy',
            function (res) {
                strategyList=res.content;
                renderStrategy(strategyList);
            },
            function (error) {
                alert(error);
            });

    }

    function renderStrategy(List) {
        $(".content-strategy").empty();
        var strategyDomStr = "";

        for (let it of List) {

            strategyDomStr +=
                "<div class='strategy-container'>" +
                "    <div class='strategy-card card'>" +
                "       <div class='strategy-line'>" +
                "           <span class='title'>" + "id：" + it.id + "</span>" +
                "       </div>" +
                "    </div>" +
                "    <div class='strategy-coupon primary-bg'>" +
                "        <span class='title'>" +it.description + "</span>" +
                "    </div>" +
                "</div>";
        }
        $(".content-strategy").html(strategyDomStr);
    }

    function getVipList(){
        var limit=0;
        getRequest(
            '/vip/get/by/money?target='+limit,
            function (res) {
                vipList=res.content;//alert(vipList.length)
                renderVip(vipList);
            },
            function (error) {
                alert(error);
            });
    }

    function renderVip(vipList){
        var vipInfo="";
        for(let vip of vipList){
            vipInfo+="<tr><td>"+vip.name+"</td>"
            +"<td>"+vip.total+"</td></tr>";
        }
        $('#vip-list').html(vipInfo);
    }

    $("#strategy-form-btn").click(function () {
        var limit=$("#strategy-limit-input").val();
        var gift=$("#strategy-gift-input").val();
        postRequest(
            '/vip/add/strategy?chargeLimit='+limit+'&giftAmount='+gift,
            null,
            function(res){//alert(res.content);
                window.location.reload();
            },
            function (error) {
                alert(JSON.stringify(error));
            }
        )
    });

    $("#strategy-edit-btn").click(function () {
        var a=1;
        $("#strategy-edit-id-input").empty();
        for(var i =0;i<strategyList.length;i++){
            $("#strategy-edit-id-input").append("<option value="+strategyList[i].id+">"+strategyList[i].id+"</option>");  //为Select追加一个Option(下拉项)
            a++;
        }
        $('#strategy-edit-limit-input').val(strategyList[0].chargeLimit);
        $('#strategy-edit-gift-input').val(strategyList[0].giftAmount);
    });

    $("#strategy-edit-id-input").on('change',function() {
        var p1=$(this).children('option:selected').val();
        var d=0;
        for(var i=0;i<strategyList.length;i++){
            if(strategyList[i].id==p1){
                d=i;
                break;
            }
        }//alert(d);
        $('#strategy-edit-limit-input').val(strategyList[d].chargeLimit);
        $('#strategy-edit-gift-input').val(strategyList[d].giftAmount);
    });

    $("#strategy-update-btn").click(function () {
        var strategyId=$("#strategy-edit-id-input").children('option:selected').val();
        var limit=$("#strategy-edit-limit-input").val();
        var gift=$("#strategy-edit-gift-input").val();
        postRequest(
            '/vip/update/strategy?id='+strategyId+'&chargeLimit='+limit+'&giftAmount='+gift,
            null,
            function(res){alert("修改会员卡充值优惠策略成功");
                window.location.reload();
            },
            function (error) {
                alert(JSON.stringify(error));
            }
        )
    })

    $("#strategy-drop-btn").click(function () {
        var a=1;
        $("#strategy-drop-id-input").empty();
        for(var i =0;i<strategyList.length;i++){
            $("#strategy-drop-id-input").append("<option value="+strategyList[i].id+">"+strategyList[i].id+"</option>");  //为Select追加一个Option(下拉项)
            a++;
        }

    });

    $("#strategy-delete-btn").click(function () {
        var dropId=$("#strategy-drop-id-input").val();
        var r=confirm("确认要删除该会员卡充值优惠策略吗？");
        if(r){
            var target=$("#strategy-drop-id-input").children('option:selected').val();
            postRequest(
                '/vip/delete/strategy?id='+dropId,
                null,
                function(res){alert("删除成功");
                    window.location.reload();
                },
                function (error) {
                    alert(JSON.stringify(error));
                }
            )
        }
    })
    $("#select-vip-btn").click(function(){
        var limit=parseInt($("#vip-limit-input").val());//alert(limit)
        getRequest(
            '/vip/get/by/money?target='+limit,
            function (res) {
                renderVip(res.content);
            },
            function (error) {
                alert(error);
            });
    })
    $("#all-vip-btn").click(function(){

       renderVip(vipList);
    })


    function getAllCoupon() {
        getRequest(
            '/coupon/get/all',
            function (res) {
                if (res.success) {
                    couponList = res.content;
                    for(let it of couponList){
                        $("#coupon-id-input").append("<option value="+it.id+">"+it.name+"</option>");
                    }
                    var couponListContent = '';
                    for (let coupon of couponList) {
                        couponListContent += '<div class="coupon"><div class="content">' +
                            '<div class="col-md-8 left">' +
                            '<div class="name">' +
                            coupon.name +
                            '</div>' +
                            '<div class="description">' +
                            coupon.description +
                            '</div>' +
                            '<div class="price">' +
                            '满' + coupon.targetAmount + '减' + coupon.discountAmount +
                            '</div>' +
                            '</div>' +
                            '<div class="col-md-4 right">' +
                            '<div>有效日期：</div>' +
                            '<div>' + formatDate(coupon.startTime) + ' ~ ' + formatDate(coupon.endTime) + '</div>' +
                            '</div></div></div>'
                    }
                    $('#all-coupon-list').html(couponListContent);

                }
            },
            function (error) {
                alert(error);
            });
    }

    $("#send-coupon-btn").click(function(){
        var userList=[];//alert(vipList.length);
        for(let it of vipList){
            userList.push(it.userId);
        }
        var target=parseInt($("#coupon-id-input").children('option:selected').val());//alert(target)
        //alert(userList.length);
        postRequest(
            '/coupon/send?couponId='+target+'&userId='+userList,
            null,
            function(res){
                if(res.success){
                    alert("赠送成功");
                }
            },
            function (error) {
                alert(JSON.stringify(error));
            }
        )
    })

});
function formatDate(date) {
    return date.substring(5, 10).replace("-", ".");
}
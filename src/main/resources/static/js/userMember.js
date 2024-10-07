var isBuyState = true;
var vipCardId;
var strategyList=[];
var userId_fk = sessionStorage.getItem('id');
var vipcount="";
var user_name=sessionStorage.getItem('username');
$(document).ready(function () {
    getStrategy();
    getVIP();
    getCoupon();
    document.getElementById('user-name').innerText =user_name;
});

function getStrategy(){
    getRequest(
        '/vip/get/all/strategy',
        function (res) {
            strategyList=res.content;
            for(var i =0;i<strategyList.length;i++){
                $("#strategy-id-input").append("<option value="+strategyList[i].id+">"+strategyList[i].id+"</option>");  //为Select追加一个Option(下拉项)
            }
        },
        function (error) {
            alert(error);
        });
}

function getVIP() {
    getRequest(
        '/vip/' + sessionStorage.getItem('id') + '/get',
        function (res) {
            if (res.success) {
                // 是会员
                $("#member-card").css("visibility", "visible");
                $("#member-card").css("display", "");
                $("#nonmember-card").css("display", "none");
                vipcount=res.content.balance;
                vipCardId = res.content.id;
                $("#member-id").text(res.content.id);
                $("#member-balance").text("¥" + res.content.balance.toFixed(2));
                $("#member-joinDate").text(res.content.joinDate.substring(0, 10));
            } else {
                // 非会员
                $("#member-card").css("display", "none");
                $("#nonmember-card").css("display", "");
            }
        },
        function (error) {
            alert(error);
        });

    getRequest(
        '/vip/getVIPInfo',
        function (res) {
            if (res.success) {
                $("#member-buy-price").text(res.content.price);
                var descriptionForm="";
                //alert("50  "+strategyList.length);
                for(let it of strategyList){
                    descriptionForm+="<tr>"+"<td>id:" + it.id + "</td>"

                        +"<td align='right'>  "  + it.description + "</td></tr>"
                }
                vipcount+=res.giftAmount;
                $("#member-buy-description").html(descriptionForm);
                $("#member-description").html(descriptionForm);
            } else {
                alert(res.content);
            }

        },
        function (error) {
            alert(error);
        });
}

function buyClick() {
    clearForm();
    $('#buyModal').modal('show')
    $("#userMember-amount-group").css("display", "none");
    isBuyState = true;
}

function chargeClick() {
    clearForm();
    $('#buyModal').modal('show')
    $("#userMember-amount-group").css("display", "");
    isBuyState = false;
}

function clearForm() {
    $('#userMember-form input').val("");
    $('#userMember-form .form-group').removeClass("has-error");
    $('#userMember-form p').css("visibility", "hidden");
}

function confirmCommit() {
    if (validateForm()) {
        if ($('#userMember-cardNum').val() === "123123123" && $('#userMember-cardPwd').val() === "123123") {
            if (isBuyState) {
                var history_data={
                    userId:userId_fk,
                    kind:0,
                    money:25,
                    description:"购买会员卡；价格：25"
                };
                postRequest(
                    '/vip/add?userId=' + sessionStorage.getItem('id'),
                    null,
                    function (res) {
                        $('#buyModal').modal('hide');
                        alert("购买会员卡成功");
                        getVIP();
                    },
                    function (error) {
                        alert(error);
                    });

                postRequest(
                    '/vip/insert/history',
                    history_data,
                    function (res){

                    },
                    function (error) {
                        alert(error);
                    }
                )
            } else {
                var t=0;

                postRequest(
                    '/vip/charge',
                    {vipId: vipCardId,
                        amount: parseInt($('#userMember-amount').val()),
                        vipStrategyID:parseInt($("#strategy-id-input").val())},
                    function (res) {
                        $('#buyModal').modal('hide');
                        alert("充值成功");
                        getVIP();
                        t=res.content.balance.toFixed(2);//alert(t);
                        var history_data={
                            userId:userId_fk,
                            kind:1,
                            money:parseInt($('#userMember-amount').val()),
                            description: "充值会员卡 ；"+"余额： "+t
                        };
                        postRequest(
                            '/vip/insert/history',
                            history_data,
                            function (res){

                            },
                            function (error) {
                                alert(error);
                            }
                        )
                    },
                    function (error) {
                        alert(error);
                    });


            }
        } else {
            alert("银行卡号或密码错误");
        }
    }
}

function validateForm() {
    var isValidate = true;
    if (!$('#userMember-cardNum').val()) {
        isValidate = false;
        $('#userMember-cardNum').parent('.form-group').addClass('has-error');
        $('#userMember-cardNum-error').css("visibility", "visible");
    }
    if (!$('#userMember-cardPwd').val()) {
        isValidate = false;
        $('#userMember-cardPwd').parent('.form-group').addClass('has-error');
        $('#userMember-cardPwd-error').css("visibility", "visible");
    }
    if (!isBuyState && (!$('#userMember-amount').val() || parseInt($('#userMember-amount').val()) <= 0)) {
        isValidate = false;
        $('#userMember-amount').parent('.form-group').addClass('has-error');
        $('#userMember-amount-error').css("visibility", "visible");
    }
    return isValidate;
}

function getCoupon() {
    getRequest(
        '/coupon/' + sessionStorage.getItem('id') + '/get',
        function (res) {
            if (res.success) {
                var couponList = res.content;
                var couponListContent = '';
                for (let coupon of couponList) {
                    couponListContent += '<div class="col-md-6 coupon-wrapper"><div class="coupon"><div class="content">' +
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
                        '</div></div></div></div>'
                }
                $('#coupon-list').html(couponListContent);

            }
        },
        function (error) {
            alert(error);
        });
}

function formatDate(date) {
    return date.substring(5, 10).replace("-", ".");
}
var userId_fk = sessionStorage.getItem('id');
var list=[];
var reverselist=[];
var numberOfCost=0;
var numberOfAdd=0;
var Costlist=[];
var Addlist=[];
var i=0;
var j=0;
var k=0;
var user_name=sessionStorage.getItem('username');
$(document).ready(function () {
    document.getElementById('user-name').innerText =user_name;
    getHistoryList();
    function getHistoryList() {
        getRequest(
            '/get/history?userId='+userId_fk,
            function (res) {
                list=res.content;
                renderhistoryList(list);
            },
            function (error) {
                alert(error);
            });
    }


    // TODO:填空
    function renderhistoryList(list) {
        reverselist=list.reverse();
        ShowHide("a");
    }

});


function ShowHide(v){
    var historyInfo = "";
    var Descripiton=["购买会员卡","充值会员卡","购买电影票","退票"];
    if(v=="a"){
        j=0;
        for (let history of reverselist) {
            if(history.kind==2){
                historyInfo += "<tr><td>" + new Date(history.time).Format("yyyy-MM-dd hh:mm:ss") + "</td>" +
                    "<td>" +"- "+history.money + "</td>" +
                    "<td>" + Descripiton[history.kind] +"</td>"+
                    "<td>"+"<button id=\"flip\" onclick='detailClick("+j+")'>查看详情</button>"+
                    "<p id=\"panel\" hidden>"+history.description.split("；")[0]+"<br>"+history.description.split("；")[1]+"<br>"+history.description.split("；")[2]+"</p>"+
                    "</td></tr>";
                j+=1
            }
            if(history.kind==0){
                historyInfo += "<tr><td>" + new Date(history.time).Format("yyyy-MM-dd hh:mm:ss") + "</td>" +
                    "<td>" +"- "+history.money + "</td>" +
                    "<td>" + Descripiton[history.kind] +"</td>"+
                    "<td>"+"<button id=\"flip\" onclick='detailClick("+j+")'>查看详情</button>"+
                    "<p id=\"panel\" hidden>"+history.description.split("；")[0]+"<br>"+history.description.split("；")[1]+"</p>"+
                    "</td></tr>";
                j+=1
            }
            if(history.kind==3){
                historyInfo += "<tr><td>" + new Date(history.time).Format("yyyy-MM-dd hh:mm:ss") + "</td>" +
                    "<td>" +"+ "+history.money + "</td>" +
                    "<td>" + Descripiton[history.kind] +"</td>"+
                    "<td>"+"<button id=\"flip\" onclick='detailClick("+j+")'>查看详情</button>"+
                    "<p id=\"panel\" hidden>"+history.description.split("；")[0]+"<br>"+history.description.split("；")[1]+"</p>"+
                    "</td></tr>";
                j+=1
            }

        }
        $("#history-list").html(historyInfo);
    }
    else if(v =="b"){k=0;
        for (let history of reverselist){
            if(history.kind==1){
                historyInfo += "<tr><td>" + new Date(history.time).Format("yyyy-MM-dd hh:mm:ss") + "</td>" +
                    "<td>" +"+ "+history.money + "</td>" +
                    "<td>" + Descripiton[history.kind] +"</td>"+
                    "<td>"+"<button id=\"flip\" onclick='detailClick("+k+")'>查看详情</button>"+
                    "<p id=\"panel\" hidden>"+history.description.split("；")[0]+"<br>"+history.description.split("；")[1]+"</p>"+
                    "</td></tr>";
                k+=1
            }

        }
        $("#history-list").html(historyInfo);
    }
}
Date.prototype.Format = function(format){
    var o = {
        "M+" : this.getMonth()+1, //month 
        "d+" : this.getDate(), //day 
        "h+" : this.getHours(), //hour 
        "m+" : this.getMinutes(), //minute 
        "s+" : this.getSeconds(), //second 
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter 
        "S" : this.getMilliseconds() //millisecond 
    };
    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    return format;
};
function len(l) {
    var count=0;
    for(var i in l){
        count+=1;
    }
    return count;
}

function detailClick(id){
    //id=id-2;
    //id=len(list)-1-id;
    $("p").eq(id).slideToggle("slow");
}

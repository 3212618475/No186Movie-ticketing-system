var user_name=sessionStorage.getItem('username');
$(document).ready(function () {
    document.getElementById('user-name').innerText =user_name;
    var list=[];
    getMovieList();

    function getMovieList() {
        getRequest(
            '/ticket/get/' + sessionStorage.getItem('id'),
            function (res) {
                list=res.content;
                renderTicketList(list);
            },
            function (error) {
                alert(error);
            });
    }

    // TODO:填空
    function renderTicketList(list) {//alert(list[0].ticketId)

        var ticketInfo = "";
        for (let ticket of list.reverse()) {
        ticketInfo += "<tr><td>" + ticket.movieName  + "</td>" +
            "<td>" +ticket.hallName + "</td>" +
            "<td>" + (ticket.row+1) +"排"+(ticket.column+1)+"座" +"</td>" +
            "<td>"  +ticket.startTime.toString()+ "</td>" +
            "<td>"  + ticket.endTime+"</td>" ;
            if(ticket.state=="已完成"){
                ticketInfo+= "<td style='color: #0eaf26 '>"+ticket.state+"</td>"+
                    "<td><button type='button' style='background-color: #4CAF50; /* Green */\n" +
                    "border: 2px solid #4CAF50;" +
                    "color: white;\n" +
                    "    padding: 15px 32px;\n" +
                    "    text-align: center;\n" +
                    " border-radius: 12px;\n"+
                    "    text-decoration: none;\n" +
                    "    display: inline-block;\n" +
                    "    font-size:14px;' onclick='ticketClick("+ticket.ticketId+")'>退票</button>"+"</td></tr>";
            }
            else if(ticket.state=="已失效"){
                ticketInfo+= "<td style='color: #ed1c32;'>"+ticket.state+"</td></tr>";
            }
            else if(ticket.state=="未支付"){
                ticketInfo+= "<td style='color: gold;'>"+ticket.state+"</td></tr>";
            }

        }
        $('#buy-on-list').html(ticketInfo);
    }



});
function  ticketClick(a) {
    var r=confirm("确定要退票吗？");
    if(r){
        postRequest(
            '/refund?ticketId='+a,
            null,
            function (res) {
                if(res.success){
                    if(res.content==-1)alert("退票失败");
                    else alert("退票成功");
                    window.location.reload();
                }
                else{
                    alert("退票失败");
                }
            },
            function (error) {
                alert(JSON.stringify(error));
            }
        );
    }
}
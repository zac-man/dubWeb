/**
 * Created by manjh on 2017/7/30.
 */


$(document).ready(function () {

    getCheckList();

    function getCheckList() {
        var tabLists = [];

        $.ajax({
            url: '/api/findCheckedList',
            type: 'GET',
            success: function (res) {
                drawTabs(res.data);
            },
            error: function () {
                $.alert("与服务器通信发生错误");
            }
        })
    }


    function drawTabs(items) {
        $.each(items, function (i, item) {
            $("#tabsList").append(drawTab(i, item.name));
            $("#tab-content").append(drawTabBody(i, item));
        });
        initListen();
    }

    function drawTab(i, tab) {
        var str = "";
        if (i == 0) {
            str = "<li class='tabLists active' data-set='" + tab + "'>";
        } else {
            str = "<li class='tabLists' data-set='" + tab + "'>";
        }
        str += "<a href='#dubList_" + i + "' aria-controls='dubList_" + i + "' data-toggle='tab' aria-expanded='false'>" + tab + "</a>";
        str += "</li>";
        return str;
    }


    function drawTabBody(i, tabData) {
        var str = "";
        if (i == 0) {
            str = "<div class='tab-pane active fade in' data-set='" + tabData.name + "' data-class='#dubList_" + i + "' id='#dubList_" + i + "'>";
        } else {
            str = "<div class='tab-pane  fade in' data-set='" + tabData.name + "' data-class='#dubList_" + i + "' id='#dubList_" + i + "'>";
        }
        str += drawDubListBody(tabData);
        str += "</div>";
        return str;
    }

    function drawDubListBody(tabData) {
        var temp = '';
        $.each(tabData.data, function (i, item) {
            temp += drawTabBodyELe(item);
        });
        return temp;
    }

    function drawTabBodyELe(data) {
        console.log(data);
        var tempStr = '<div class="col-md-4 no-padding">';
        tempStr += '<div class="dubItem">' + data.name + '<i class="fa fa-play pull-right fa-radio"></i></div>';
        tempStr += '</div>';
        return tempStr;
    }

    function initListen() {
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            var nowHref = $(this).attr("href");
            $("#tab-content").find(".active").removeClass("active");
            $("#tab-content").find('[data-class=' + nowHref + ']').addClass("active");
        });

        $(".dubItem").click(function () {

        });
    }

});
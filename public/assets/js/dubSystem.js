/**
 * Created by manjh on 2017/7/13.
 */
$(document).ready(function () {
    var checklist_id = '';
    var options = {
        beforeSubmit: showRequest,  // pre-submit callback
        success: showResponse  // post-submit callback
    };

    // bind to the form's submit event
    $('#frmUploader').submit(function () {
        $("#btnSubmit").attr("disabled", true);
        $(this).ajaxSubmit(options);
        return false;
    });
    // pre-submit callback
    function showRequest(formData, jqForm, options) {
        // alert('Uploading is starting.');
        return true;
    }

    // post-submit callback
    function showResponse(responseText, statusText, xhr, $form) {
        $("#btnSubmit").attr("disabled", false);
        $("#dubUrl").show().text(responseText.files[0].filename);
        //alert('status: ' + statusText + '\n\nresponseText: \n' + responseText );
    }


    var selectOption = ["专题配音", "宣传片配音", "广告配音",
        "飞碟说配音", "英语配音", "纪录片配音", "游戏配音",
        "模仿配音", "独白配音", "童声配音", "方言配音",
        "角色配音", "粤语配音", "各国语言"];
    init();
    function init() {
        $.each(selectOption, function (i, value) {
            var option = '<option value="' + value + '">' + value + '</option>';
            $("#dubType").append(option);
            $("#editDubType").append(option);
            $("#checkboxList").append(drawLableInput(value));
        });
        getCheckList();

        $(".typeChecked").click(function(){
            var tempArr = geTypeListChecked().join(",");
            updateTypeCheckList(tempArr)

        });
        function geTypeListChecked(){
           var tempArr = [];
            $(".typeChecked").each(function() {
                if ($(this).is(':checked')) {
                    tempArr.push($(this).val());
                }
            });
            return tempArr;
        }
        function updateTypeCheckList(checkList){
            console.log(checkList);
            console.log(checklist_id);
            console.log(checkList);
            $.ajax({
                url: '/api/updateCheckedList',
                type: 'POST',
                data: {
                    _id: checklist_id,
                    checkList: checkList
                },
                cache: false,
                success: function (data) {
                    console.log(data);
                    /*if (!data.success) {
                        $.alert("更新失败");
                    } else {
                        $.alert("更新成功");
                        table.ajax.reload(null, true);
                        $("#editModal").modal('hide');
                    }*/
                },
                error: function () {
                    $.alert("与服务器通信发生错误");
                }
            });
        }
    }


    var table = $('#dubListTable').DataTable({
        "ajax": {
            "url": "/api/dubAll"
        },
        "searching": true,
        "bLengthChange": true,
        "aLengthMenu": [[5, 10, 20, -1], [5, 10, 20, "所有"]],
        "iDisplayLength": 20,
        "columns": [
            {"data": null},
            {"data": "name"},
            {"data": "type"},
            {"data": null},
            {"data": null},
            {"data": null}
        ],
        columnDefs: [
            {
                "searchable": false,
                "orderable": false,
                "targets": 0,
                render: function (data, type, row, meta) {
                    var checkbox = '';
                    checkbox = "<input type='checkbox' class='dubItem' data-set='" + data._id + "'/>";
                    if (data.checked) {
                        checkbox = "<input type='checkbox' class='dubItem' data-set='" + data._id + "' checked/>";
                    }
                    return checkbox;
                }
            },
            {
                "searchable": false,
                "orderable": false,
                targets: 3,
                render: function (data, type, row, meta) {
                    return '<audio class="audioEle" src="/upload/' + data.url + '" preload="auto" controls loop>'
                        + window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '') +
                        '/upload/' + data.url + '' +
                        '</audio>';
                }
            },
            {
                targets: 4,
                render: function (data, type, row, meta) {
                    return moment(Number(data.createTime)).format('YYYY-MM-DD HH:mm:ss');
                }
            },
            {
                targets: 5,
                render: function (data, type, row, meta) {

                    var btnStr = '<div class="btn-group">';
                    btnStr += '<button type="button" class="btn btn-xs btn-success editBtn">修改</button>';
                    btnStr += '<button type="button" class="btn btn-xs btn-danger delBtn">删除</button>';
                    btnStr += '<a href="/upload/' + data.url + '" download="" class="btn btn-xs btn-warning downloadBtn">下载</a>';
                    btnStr += '</div>';
                    return btnStr
                }
            },
            {"orderable": false, "targets": 4}
        ],
        "order": [[1, 'asc']],
        "fnPreDrawCallback": function (oSettings) {
        },
        "initComplete": function (settings, json) {
            //$(".audioEle").audioPlayer();
        }
    });
    /*    table.on('order.dt search.dt',
     function () {
     table.column(0, {
     search: 'applied',
     order: 'applied'
     }).nodes().each(function (cell, i) {
     cell.innerHTML = i + 1;
     });
     }).draw();*/

    table.on('click', '.editBtn', function () {
        var dubData = table.row($(this).parents('tr')).data();
        $("#editModal").modal('show');
        $("#editDubId").val(dubData._id);
        $("#editDubType").val(dubData.type);
        $("#editDubName").val(dubData.name);

    }).on('click', '.delBtn', function () {
        var dubData = table.row($(this).parents('tr')).data();
        $.confirm({
            content: '确认删除【 ' + dubData.name + ' 】吗？',
            buttons: {
                'confirmDelBtn': {
                    text: '删除',
                    btnClass: 'btn-red',
                    action: function () {
                        delDub(dubData);
                    }
                },
                'confirmNoBtn': {
                    text: '取消',
                    btnClass: 'btn-blue'
                }
            }
        });
    }).on('click', '.downloadBtn', function () {

    }).on('click', '.dubItem', function () {
        var dubData = table.row($(this).parents('tr')).data();
        var checked = $(this).is(':checked');
        changeStatus(dubData._id, checked);

    });

    function changeStatus(_id, checked) {
        $.ajax({
            url: '/api/updateChecked',
            type: 'POST',
            data: {
                _id: _id,
                checked: checked
            },
            cache: false,
            success: function (data) {
                if (!data.success) {
                   $.alert("更新失败");
                } else {
                    // $.alert("更新成功");
                    table.ajax.reload(null, true);
                    $("#editModal").modal('hide');
                }
            },
            error: function () {
                $.alert("与服务器通信发生错误");
            }
        });
    }

    function delDub(dubData) {
        $.ajax({
            url: '/api/delete',
            type: 'POST',
            data: dubData,
            cache: false,
            success: function (data) {
                if (!data.success) {
                    $.alert("删除失败");
                } else {
                    table.ajax.reload(null, true);
                    $.alert("删除成功");
                }
            },
            error: function () {
                $.alert("与服务器通信发生错误");
            }
        });
    }

    $("#saveEditBtn").click(function () {
        var editData = {
            _id: $("#editDubId").val(),
            type: $("#editDubType").val(),
            name: $("#editDubName").val()
        };
        updateDub(editData);
    });

    function updateDub(dubDate) {
        $.ajax({
            url: '/api/update',
            type: 'POST',
            data: dubDate,
            cache: false,
            success: function (data) {
                if (!data.success) {
                    $.alert("更新失败");
                } else {
                    $.alert("更新成功");
                    table.ajax.reload(null, true);
                    $("#editModal").modal('hide');
                }
            },
            error: function () {
                $.alert("与服务器通信发生错误");
            }
        });
    }

    $('#dubListTab').on('show.bs.tab', function (e) {

    });

    $("#saveBtn").click(function () {
        var dubDate = {
            type: $("#dubType").val(),
            name: $("#dubName").val(),
            url: $("#dubUrl").text()
        };
        saveData(dubDate);
    });

    function saveData(dubDate) {
        $.ajax({
            url: '/api/create',
            type: 'POST',
            data: dubDate,
            cache: false,
            success: function (data) {
                if (!data.success) {
                    $.alert("存储信息不全，请检查");
                } else {
                    table.ajax.reload(null, true);
                    $.alert("保存成功");
                }
            },
            error: function () {
                $.alert("与服务器通信发生错误");
            }
        });
    }

    function getCheckList() {

        $.ajax({
            url: '/api/findDubTypeList',
            type: 'GET',
            cache: false,
            success: function (res) {
                drawCheckBoxList(res.data[0]);
                checklist_id = res.data[0]._id;
            },
            error: function () {
                $.alert("与服务器通信发生错误");
            }
        });
    }

    function drawCheckBoxList(data) {
        var list = data.list.split(",");
        $.each(list,function (index,item) {
            $(".typeChecked[value='"+item+"']").prop("checked", true);
        });
    }

    function drawLableInput(name) {
        var checkboxStr = '<label class="checkbox-inline">';
        checkboxStr += '<input type="checkbox" class="typeChecked" name="typeChecked" value="' + name + '" />' + name;
        checkboxStr += '</label>';
        return checkboxStr;
    }


});
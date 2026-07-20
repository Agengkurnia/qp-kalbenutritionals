"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var programCode = '';
let selectedValue = "";
var oTable;
//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    $(".select2").select2();

    $('.select2').css('width', "100%");

    $('#programSelect').on('change', function () {
        selectedValue = $(this).find(':selected').val();
        updateDataTable(selectedValue);
    });

    p_InitForm();
});

//=======================
// FUNCTION
//=======================
function p_InitForm() {
    p_MasterParameter();
}

function updateDataTable(selectedValue) {
    debugger
    programCode = selectedValue;
    $('#dataTableApproval').DataTable().ajax.url(base_path + '/Master/MasterApproval/GetDataTable?Code=' + encodeURIComponent(selectedValue)).load();
}

function p_MasterParameter() {
    oTable = $("#dataTableApproval").DataTable({
        "bPaginate": true,
        search: {
            return: true
        },
        scrollY: "400px",
        scrollX: "100%",
        lengthMenu: [5, 10, 25, 50, 100],
        "iDisplayLength": 10,
        serverSide: true,
        destroy: true,
        retrive: true,
        order: [[0, 'asc']],
        scrollCollapse: true,
        ajax: {
            type: "POST",
            url: base_path + '/Master/MasterApproval/GetDataTable',
            contentType: 'application/json',
            dataSrc: function (retDat) {
                if (retDat.bitSuccess == false) {
                    if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                        clsGlobal.swalWarning(retDat.objData);
                    }
                    else {
                        clsGlobal.swalError(retDat.txtMessage);
                    }
                }
                else {
                    console.log(retDat.data);
                    return retDat.data;
                }
            },
            beforeSend: function (request) {
                request.setRequestHeader("RequestVerificationToken", $('#FormApproval input[name=__RequestVerificationToken]').val());
            },
            data: function (d) {
                return JSON.stringify(d);
            },
            datatype: "json",
            error: function (xhr, status, error) {
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                }
                else {
                    clsGlobal.swalError(xhr.responseText);
                }
            }
        },
        searching: true,
        columns: [
            {
                data: 'ApprovalName',
                name: "ApprovalName",
                render: function (data, type, row, meta) {
                    console.log(data);
                    let userGuid = row.Uuid;
                    return data;
                }
            },
            {
                data: 'Active',
                name: "bitActive",
                render: function (data, type, row, meta) {
                    return (data == true) ? "True" : "False";
                }
            },
            {
                data: 'ApprovalName',
                name: "ApprovalName",
                orderable: false,
                render: function (data, type, row, meta) {
                    let userGuid = row.Uuid;
                    let strhtml = "<td> ";
                    strhtml += `<a href="/Master/MasterApproval/Detail?Id=${encodeURIComponent(userGuid)}&Type=${"Edit"}" asp-action="Edit" asp-route-id="${data}" class="p-2 btn btn-sm btn-warning noborder-radius"> Edit</a> &nbsp;`;
                    strhtml += `<a href="javascript:void(0)" onclick="p_DeleteApprovalHeader('${userGuid}')" class="p-2 btn btn-sm btn-danger noborder-radius"> Delete</a>`;

                    strhtml += "</td>";
                    return strhtml;
                }
            },
        ],
    });
}

const p_DeleteApprovalHeader = (IdHeader) => {
    $.ajax({
        type: "POST",
        url: "/Master/MasterApproval/DetactiveHeaderApproval",
        data: {
            idHeader: IdHeader,
            __RequestVerificationToken: $('#FormApproval input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat, status, xhr) {
            if (xhr.responseText.includes("!DOCTYPE html")) {
                clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
            }
            else {
                if (retDat.bitSuccess == true) {
                    clsGlobal.swalSuccess("Sucess Delete Approval");
                    oTable.draw();
                }
                else {
                    if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                        clsGlobal.swalWarning(retDat.objData);
                    }
                    else {
                        clsGlobal.swalError(retDat.txtMessage);
                    }
                }
                $("#txtGUID").val(retDat.txtGUID);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
//=======================
// HANDLER
//=======================

$("#btnNew").on('click', function () {
    window.location.href = base_path + `/Master/MasterApproval/Detail`;
});

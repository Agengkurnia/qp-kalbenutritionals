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

    p_InitForm();

    $('#programSelect').on('change', function () {
        selectedValue = $(this).find(':selected').val();
        updateDataTable(selectedValue);
    });
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
    $('#dataTableApproval').DataTable().ajax.url(base_path + '/Master/MappingApproval/GetDataTable?Code=' + encodeURIComponent(selectedValue)).load();
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
            url: base_path + '/Master/MappingApproval/GetDataTable',
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
                    return retDat.data;
                }
            },
            beforeSend: function (request) {
                request.setRequestHeader("RequestVerificationToken", $('#FormMappingApproval input[name=__RequestVerificationToken]').val());
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
                data: 'SistemCode',
                name: 'SistemCode',
                render: function (data, type, row, meta) {
                    let userGuid = row.uuid;
                    return data;
                    //return `<a href="javascript:void(0)" onclick="redirectButton('${encodeURIComponent(userGuid)}')"> ${data}</a>`;
                }
            },
            {
                data: 'MenuCode',
                name: 'MenuCode',
                render: function (data, type, row, meta) {
                    let userGuid = row.uuid;
                    return data;
                    //return `<a href="javascript:void(0)" onclick="redirectButton('${encodeURIComponent(userGuid)}')"> ${data}</a>`;
                }
            },
            {
                data: 'BitActive',
                name: 'BitActive',
                render: function (data, type, row, meta) {
                    return (data == true) ? "True" : "False";
                }
            },
            {
                data: 'MappingApprovalId',
                orderable: false,
                render: function (data, type, row, meta) {
                    let userGuid = row.MappingApprovalId;
                    let strhtml = "<td> ";
                    strhtml += `<a href="/Master/MappingApproval/Edit?Id=${encodeURIComponent(userGuid)}" asp-action="Edit" asp-route-id="${userGuid}" class="p-2 btn btn-sm btn-warning noborder-radius"> Edit</a> &nbsp;`;
                    //strhtml += `<a href="/Master/MappingApproval/View?Id=${encodeURIComponent(userGuid)}" asp-action="View" asp-route-id="${userGuid}" class="p-2 btn btn-sm btn-info noborder-radius"> View</a>`;

                    strhtml += "</td>";
                    return strhtml;
                }
            },
        ],
    });
}

function redirectButton(param) {
    return window.location.href = base_path + `/Master/MappingApproval/Edit?id=${encodeURIComponent(param)}`;
}

//=======================
// HANDLER
//=======================

$("#btnNew").on('click', function () {
    window.location.href = base_path + `/Master/MappingApproval/Create`;
});

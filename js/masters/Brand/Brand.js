"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var programCode = '';
var oTable;
//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    p_InitForm();
});

//=======================
// FUNCTION
//=======================
function p_InitForm() {
    p_MasterParameter();
}

function p_MasterParameter() {
    oTable = $("#dataTableBrand").DataTable({
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
            url: base_path + '/Master/Brand/GetDataTable',
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
                request.setRequestHeader("RequestVerificationToken", $('#FormParameter input[name=__RequestVerificationToken]').val());
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
                data: 'umbrandName',
                name: 'UmbrandName',
                render: function (data, type, row, meta) {
                    let userGuid = row.uuid;
                    return `<a href="javascript:void(0)" onclick="redirectButton('${encodeURIComponent(userGuid)}')"> ${data}</a>`;
                }
            },
            {
                data: 'umbrandDesc',
                name: 'UmbrandDescMasking',
            },
            {
                data: 'active',
                name: 'Active',
                render: function (data, type, row, meta) {
                    return (data == true) ? "True" : "False";
                }
            },
        ],
    });
}

function redirectButton(param) {
    return window.location.href = base_path + `/Master/Brand/Edit?id=${encodeURIComponent(param)}`;
}

//=======================
// HANDLER
//=======================

$("#btnNew").on('click', function () {
    window.location.href = base_path + `/Master/Brand/Create`;
});

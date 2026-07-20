"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
let selectedValue = "";
let oTable;
var programCode = '';
//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    p_InitForm();
    $("#programSelect").select2();
    $('#programSelect').on('change', function () {
        selectedValue = $(this).find(':selected').val();
        updateDataTable(selectedValue);
    });
});

//=======================
// FUNCTION
//=======================
function p_InitForm() {
    p_MasterUser();
}

function updateDataTable(selectedValue) {
    debugger
    programCode = selectedValue;
    $('#dataTableUserRole').DataTable().ajax.url(base_path + '/UserRole/GetDataTable?Code=' + encodeURIComponent(selectedValue)).load();
}

function p_MasterUser() {
    oTable = $("#dataTableUserRole").DataTable({
        "bPaginate": true,
        scrollY: "400px",
        search: {
            return: true
        },
        "type": "POST",
        scrollX: "100%",
        lengthMenu: [5, 10, 25, 50, 100],
        "iDisplayLength": 10,
        serverSide: true,
        destroy: true,
        retrieve: true,
        order: [[0, 'asc']],
        scrollCollapse: true,
        ajax: {
            type: "POST",
            url: base_path + '/UserRole/GetDataTable',
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
            data: function (d) {
                d.Code = selectedValue;
                return JSON.stringify(d);
            },
            datatype: "json",
            beforeSend: function (request) {
                request.setRequestHeader("RequestVerificationToken", $('#FormDashboardUserRole input[name=__RequestVerificationToken]').val());
            },
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
        columnDefs: [
            {
                defaultContent: "",
                className: 'dt-body-nowrap',
                targets: "_all",
            },
            {
                className: 'dt-body-center',
                targets: [2]
            },
        ],
        columns: [
            {
                data: 'username'
            },
            {
                data: 'programCode'
            },
            {
                data: 'roleCode'
            },
            {
                data: 'bitActive',
                render: function (data, type, full, meta) {
                    if (data == true) {
                        return "Yes";
                    }
                    else if (data == false) {
                        return "No";
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                data: 'encryptedData',
                orderable: false,
                render: function (data, type, full, meta) {
                    return `<div class="d-inline-block">
                                <button id="btnNew" type="button" onclick="redirectButton('${data}')" class="btn btn-warning btn-sm me-2">
                                    Edit
                                </button>
                            </div>`;
                },
            }
        ],
    });
}

function redirectButton(param) {
    return window.location.href = base_path + `/UserRole/Edit?Param=${encodeURIComponent(param)}`;
}

//=======================
// HANDLER
//=======================
$("#btnNew").on('click', function () {
    if (selectedValue === '') {
        clsGlobal.swalWarning("Pilih program terlebih dahulu!");
    }
    else
    {
        var encVal = clsGlobal.encrypt(selectedValue);
        window.open(base_path + `/UserRole/Create?Param=${encodeURIComponent(encVal)}`);
    }
});
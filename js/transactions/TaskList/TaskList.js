"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
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
    p_MasterUser();
}

function p_MasterUser() {
    debugger;
    $("#dataTableRequestTrial").DataTable({
        "bPaginate": true,
        scrollY: "400px",
        "type": "POST",
        scrollX: "100%",
        lengthMenu: [5, 10, 25, 50, 100],
        "iDisplayLength": 10,
        serverSide: true,
        destroy: true,
        retrieve: true,
        order: [[0, 'asc']],
        scrollCollapse: true,
        autoWidth: false,
        ajax: {
            type: "POST",
            url: base_path + '/TaskList/GetDataTable',
            contentType: 'application/json',
            dataSrc: function (retDat) {
                debugger
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
                width: '20%',
                data: 'requestNo',
                render: function (data, type, row, meta) {
                    var requestTrialGuid = row.requestTrialGuid;
                    return '<a href="#" onclick="redirectButton(\'' + requestTrialGuid + '\'); return false;">' + data + '</a>';
                }
            },
            {
                width: '20%',
                data: 'trialName'
            },
            {
                data: 'insertedBy'  
            },
            {
                data: 'manufacturerCode'
            },

            {
                data: 'statusRequestTrial',
            },

            {
                data: 'statusEvaluationTrial',
            },

            {
                data: 'statusDisposition',
            },
        ],
    });
}

$("#btnNew").on('click', function () {
    window.location.href = base_path + `/RequestTrial/Create`;
});

function redirectButton(param) {
    window.location.href = base_path + `/RequestTrial/Edit?param=${encodeURIComponent(param)}`;
}
"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var programCode = '';
//=======================
// ON PAGE LOAD
//=======================
var style = document.createElement('style');
style.textContent = `
.custom-checkbox input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
}

.custom-checkbox .checkbox-custom {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: lightgray;
    border: 1px solid gray;
    border-radius: 4px;
    vertical-align: middle;
}

.custom-checkbox input:checked + .checkbox-custom {
    background-color: darkgray;
}

.custom-checkbox input:disabled + .checkbox-custom {
    background-color: lightgray;
    border-color: gray;
    cursor: not-allowed;
}

`;
document.head.append(style);

$(document).ready(function () {
    $(".select2").select2();

    $('.select2').css('width', "100%");

    p_InitForm();

    $('#programSelect').on('change', function () {
        var selectedValue = $(this).val();
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
    programCode = selectedValue;
    $('#dataTableRoleAccess').DataTable().ajax.url(base_path + '/RoleAccess/GetDataTable?code=' + encodeURIComponent(selectedValue)).load();
}

function p_MasterUser() {
    $("#dataTableRoleAccess").DataTable({
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
        ajax: {
            type: "POST",
            url: base_path + '/RoleAccess/GetDataTable',
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
                else
                {
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
                data: 'txtRoleName',
                render: function (data, type, row, meta) {
                    debugger;
                    var encyptedData = row.encryptedData;
                    return '<a href="#" onclick="redirectButton(\'' + encyptedData + '\'); return false;">' + data + '</a>';
                }
            },
            {
                data: 'txtModuleName'
            },
            {
                data: 'bitEdit',
                render: function (data, type, full, meta) {
                    if (type === 'display') {
                        return '<input type="checkbox" disabled ' + (data ? 'checked' : '') + '>';
                    }
                    return data; 
                },
            },
            {
                data: 'bitView',
                render: function (data, type, full, meta) {
                    if (type === 'display') {
                        return '<input type="checkbox" disabled ' + (data ? 'checked' : '') + '>';
                    }
                    return data; 
                },
            },
            {
                data: 'bitDelete',
                render: function (data, type, full, meta) {
                    if (type === 'display') {
                        return '<input type="checkbox" disabled ' + (data ? 'checked' : '') + '>';
                    }
                    return data; 
                },
            },

            {
                data: 'bitPrint',
                render: function (data, type, full, meta) {
                    if (type === 'display') {
                        return '<input type="checkbox" disabled ' + (data ? 'checked' : '') + '>';
                    }
                    return data; 
                },
            },

            {
                data: 'bitActive',
                render: function (data, type, full, meta) {
                    if (data == true) {
                        return '<span class="badge bg-primary">Active</span>';
                    } else {
                        return '<span class="badge bg-danger">Inactive</span>';
                    }
                },
            },
        ],
    });
}

function redirectButton(param) {
    window.open(base_path + `/RoleAccess/Edit?param=${encodeURIComponent(param)}`, '_blank');
}

//=======================
// HANDLER
//=======================


function setChooseLOV(txtValue) {

    var arr = txtValue.split('|');
    switch (arr[0]) {
        case MODULE_PROGRAM:
            setUser(arr);
            break;
    }
    clsGlobal.closeLOV();
}

function setUser(arr) {
    $("#programName").val(arr[1]);
    updateDataTable(arr[2]);
}

function setSwallinstance() {
    return swalInstanceLOV;
}

$("#btnNew").on('click', function () {
    window.location.href = base_path + `/RoleAccess/Create`;
});

$("#btnProgram").on("click", () => {
    clsGlobal.generateLOV(MODULE_PROGRAM, "PROGRAM", "PROGRAM");
});

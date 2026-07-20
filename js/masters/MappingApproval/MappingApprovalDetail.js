"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var bitLoading = false;
let oTableApproval;
let lovId;
//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    debugger;
    $(".select2").select2();

    if (viewBagMsg !== "") {
        showSwalAlert(viewBagMsg);
    }
});

//=======================
// SET VALUE LOV
//=======================

function setChooseLOV(txtValue) {
    var arr = txtValue.split('|');
    switch (arr[0]) {
        case MODULE_LOV_APPROVAL_MENU:
            setMenu(arr);
            break;
        case MODULE_LOV_APPROVAL_USER:
            setUser(arr);
            break;
        case MODULE_LOV_APPROVAL_USERROLE:
            setUserRole(arr);
            break;
    }
    clsGlobal.closeLOV();
}

function setMenu(arr) {
    $("#MenuName").val(arr[1]);
    $("#MenuDesc").val(arr[2]);
}

//=======================
// HIDDEN OBJECT
//=======================

const p_GetHiddenObjectApproval = () => {
    return JSON.parse($("#txtHiddenObjectDetail").val());
}

const p_SetHiddenObjectApproval = (objDat) => {
    //console.log(objDat);
    $("#txtHiddenObjectDetail").val(JSON.stringify(objDat));
}

//=======================
// FUNCTION
//=======================
function showSwalAlert(txtMsg) {
    debugger;
    var txtUrl = `${base_path}/Master/MappingApproval/Index`;
    clsGlobal.swalSuccessSaveOrSubmit(txtMsg, txtUrl);
}

function p_GetSelectApprovalHeaderId(valSistem) {
    const $approvalSelect = $('#TxtApprovalHeaderId');
    dontBlock = true;
    $approvalSelect.val(null).empty().select2({
        placeholder: 'Select Approval',
        allowClear: true,
        ajax: {
            url: '/Master/MappingApproval/GetApprovalByProgramCode',
            type: 'GET',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    searchTerm: params.term,
                    paramSistem: valSistem
                };
            },
            processResults: function (data) {
                return {
                    results: data.map(item => ({
                        id: item.code,
                        text: item.name
                    }))
                };
            },
            cache: true
        }
    });
}

//=======================
// HANDLER
//=======================



$('#TxtSistemCode').on('select2:select', function (e) {
    dontBlock = true;
    e.preventDefault();
    let valSistem = $(this).find(':selected').val();
    p_GetSelectApprovalHeaderId(valSistem);
});

$("#btnMenu").on("click", (e) => {
    debugger;
    e.preventDefault();

    let valSistem = $("#TxtSistemCode").find(':selected').val();
    if (valSistem === "") {
        clsGlobal.swalWarning("Please Select Program Name!");
    }
    else {
        clsGlobal.generateLOV(MODULE_LOV_APPROVAL_MENU, MODULE_LOV_APPROVAL_MENU, valSistem);
    }
});

$("#TxtApprovalHeaderId").on("select2:select", (e) => {
    e.preventDefault();

    let valSistem = $("#TxtApprovalHeaderId").find(':selected').text();
    $("#TxtApprovalCode").val(valSistem);
});
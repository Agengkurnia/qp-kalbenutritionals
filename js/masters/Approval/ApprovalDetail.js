"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var bitLoading = false;
let oTableApproval;
let temStepCode = [];
let lovId;
let StepCodeExist;
let isSaveHeader = false;
let arrDetlApproval = [];
let isEditDetail = false;
//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    debugger;
    $(".select2").select2();

    initiateTableDetailApproval();

    if (IdHeader !== "" && IdHeader !== undefined) {
        p_GetDataApproval();
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
}

//=======================
// HIDDEN OBJECT
//=======================

const p_GetHiddenObjectDetailApproval = () => {
    return JSON.parse($("#txtHiddenObjectDetail").val());
}

const p_SetHiddenObjectDetailApproval = (objDat) => {
    //console.log(objDat);
    $("#txtHiddenObjectDetail").val(JSON.stringify(objDat));
}

const p_GetHiddenObjectHeaderApproval = () => {
    return JSON.parse($("#txtHiddenObjectHeader").val());
}

const p_SetHiddenObjectHeaderApproval = (objDat) => {
    //console.log(objDat);
    $("#txtHiddenObjectHeader").val(JSON.stringify(objDat));
}

//=======================
// FUNCTION
//=======================
const p_callLOVNextStepCode = () => {
    var data = p_GetHiddenObjectDetailApproval();

    if (data.length == 0) {
        clsGlobal.swalWarning("Step Empty, Please Submit Approval Step!");
    }
    else {
        p_popUpLOVNextStepCode(data);
    }
}
function p_popUpLOVNextStepCode(objData) {
    const dataTable = `<table id="lovTable" bordered=1 class="table table-bordered" style="width: 100%;" >
        <thead>
            <tr>
                <th>Next Step Approval</th>
                <th>Action</th>
            </tr>
        </thead>
</table>`;

    Swal.fire({
        title: 'LOV Next Step Approval',
        html: dataTable,
        showCloseButton: true,
        showConfirmButton: false,
        position: "center",
        width: "90%",
        heightAuto: true,
    });

    var table = $("#lovTable").DataTable({
        data: objData,
        deferRender: true,
        columnDefs: [
            {
                defaultContent: "",
                targets: "_all",

            },
            {
                targets: [0, 1],
                className: "dt-left",
            },
            {
                "width": "20%",
                "targets": [0]
            },
            {
                "width": "10%",
                "targets": 1
            }
        ],
        dataSrc: '',
        info: false,
        lengthChange: false,
        columns: [
            { data: 'stepCode' },
            { data: null, "defaultContent": `<button class='btn btn-success me-2'>Select</button>` }
        ],
    });

    table.on('click', 'button', function (e) {
        let data = table.row(e.target.closest('tr')).data();

        $("#txtNextCodeStep").val(data.stepCode);
        
        Swal.close();
    });

}

const p_callLOVPrevStepCode = () => {
    var data = p_GetHiddenObjectDetailApproval();

    if (data.length === 0) {
        clsGlobal.swalWarning("Step Empty, Please Submit Approval Step!");
    }
    else {
        p_popUpLOVPrevStepCode(data);
    }
}
function p_popUpLOVPrevStepCode(objData) {
    const dataTable = `<table id="lovTable" bordered=1 class="table table-bordered" style="width: 100%;" >
        <thead>
            <tr>
                <th>Prev Step Approval</th>
                <th>Action</th>
            </tr>
        </thead>
</table>`;

    Swal.fire({
        title: 'LOV Prev Step Approval',
        html: dataTable,
        showCloseButton: true,
        showConfirmButton: false,
        position: "center",
        width: "90%",
        heightAuto: true,
    });

    var table = $("#lovTable").DataTable({
        data: objData,
        deferRender: true,
        columnDefs: [
            {
                defaultContent: "",
                targets: "_all",

            },
            {
                targets: [0, 1],
                className: "dt-left",
            },
            {
                "width": "20%",
                "targets": [0]
            },
            {
                "width": "10%",
                "targets": 1
            }
        ],
        dataSrc: '',
        info: false,
        lengthChange: false,
        columns: [
            { data: 'stepCode' },
            { data: null, "defaultContent": `<button class='btn btn-success me-2'>Select</button>` }
        ],
    });

    table.on('click', 'button', function (e) {
        let data = table.row(e.target.closest('tr')).data();
        debugger;
        console.log(data);
        $("#txtPrevCodeStep").val(data.stepCode);

        Swal.close();
    });

}


const initiateTableDetailApproval = () => {
    if (!$.fn.DataTable.isDataTable('#tableDetailApproval')) {
        oTableApproval = $("#tableDetailApproval").DataTable({
            "bPaginate": true,
            "bSort": false,
            searching: false,
            scrollCollapse: true,
            scrollY: "400px",
            "type": "POST",
            scrollX: true,
            lengthMenu: [5, 10, 25, 50, 100],
            "iDisplayLength": 10,
            columns: [
                { title: 'Approval Step Code', width: 5, className: "center text-nowrap", "targets": [0], orderable: false },
                { title: 'Approval Step Name    ', width: 200, className: "text-left text-nowrap", "targets": [1], orderable: false },
                { title: 'Approver Username    ', width: 200, className: "text-left text-nowrap", "targets": [2], orderable: false },
                { title: 'Approver Superior    ', width: 200, className: "text-center text-nowrap", "targets": [3], orderable: false },
                { title: 'Approver User    ', width: 200, className: "text-center text-nowrap", "targets": [4], orderable: false },
                { title: 'Approver User Role    ', width: 250, className: "text-center text-nowrap", "targets": [5], orderable: false },
                { title: 'Approval Next Step   ', width: 250, className: "text-center text-nowrap", "targets": [6], orderable: false },
                { title: 'Approval Prev Step   ', width: 250, className: "text-center text-nowrap", "targets": [7], orderable: false },
                { title: 'Is Start?   ', width: 250, className: "text-center text-nowrap", "targets": [8], orderable: false },
                { title: 'Is Finish?   ', width: 250, className: "text-center text-nowrap", "targets": [9], orderable: false },
                { title: 'Bit Active   ', width: 250, className: "text-center text-nowrap", "targets": [10], orderable: false },
                { title: 'Edit   ', width: 50, className: "text-center text-nowrap", "targets": [11], orderable: false },
                { title: 'Delete   ', width: 50, className: "text-center text-nowrap", "targets": [12], orderable: false },
            ],
            aoColumnDefs: [
                {
                    aTargets: [0],
                    mRender: function (data, type, full) {
                        return full.stepCode;
                    },
                },
                {
                    aTargets: [1],
                    mRender: function (data, type, full) {
                        return full.stepName;
                    },
                },
                {
                    aTargets: [2],
                    mRender: function (data, type, full) {
                        return full.approvalUsername;
                    },
                },
                {
                    aTargets: [3],
                    mRender: function (data, type, full) {
                        return full.isSuperior ? "True" : "False";
                    }
                },
                {
                    aTargets: [4],
                    mRender: function (data, type, full) {
                        return full.approvalUser;
                    },
                },
                {
                    aTargets: [5],
                    mRender: function (data, type, full) {
                        return full.approvalUserRole;
                    }
                },
                {
                    aTargets: [6],
                    mRender: function (data, type, full) {
                        return full.nextCodeStep;

                    }
                },
                {
                    aTargets: [7],
                    mRender: function (data, type, full) {
                        return full.prevCodeStep;
                    }
                },
                {
                    aTargets: [8],
                    mRender: function (data, type, full) {
                        return full.isStart ? "True" : "False";
                    }
                },
                {
                    aTargets: [9],
                    mRender: function (data, type, full) {
                        return full.isFinish ? "True" : "False";
                    }
                },
                {
                    aTargets: [10],
                    mRender: function (data, type, full) {
                            return full.active ? "True" : "False";
                    }
                },
                {
                    aTargets: [11],
                    mRender: function (data, type, full, meta) {
                        if (txtTypeForm == "View") {
                            return ``;
                        }
                        else {
                            return `<div style="padding:0;margin:0">
                                          <button type="button" class="btn btn-warning btn-icon waves-effect waves-float waves-light button-group btnEditApproval" onclick="p_openModalEditApprovalDetail(this, '${full.approvalDetailId}')" value="Edit">
                                              <i class="fa fa-edit"></i>
                                          </button>
                                        </div>`;
                        }
                    }
                },
                {
                    aTargets: [12],
                    mRender: function (data, type, full, meta) {
                        if (txtTypeForm == "View") {
                            return ``;
                        }
                        else {
                            return `<div style="padding:0;margin:0">
                                          <button type="button" class="btn btn-danger btn-icon waves-effect waves-float waves-light button-group btnDetailDeleteApproval" onclick="p_DeleteApprovalDetail('${full.approvalDetailId}')" value="Delete">
                                              <i class="fa fa-trash"></i>
                                          </button>
                                        </div>`;
                        }
                    }
                },
            ]
        });
    }

    $('#tableDetailApproval tbody').on('click', 'tr', function () {
        if (!$(this).hasClass('selected')) {
            oTableApproval.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });
}


const p_btnDetailDeleteApproval_Click = (objCaller, intIndex) => {
    // Parse dari HiddenObject->JSON
    var objData = p_GetHiddenObjectDetailApproval();
    var arrIndex = [];
    for (var i = 0; i < objData.length; i++) {
        // Cari Index-nya.
        if (objData[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:

            // Remove from list.
            objData.splice(i, 1);

            oTableApproval.row(i).remove().draw(false);
            break;
        }
    }

    p_SetHiddenObjectApproval(objData);
    p_RefreshNumberDetailApproval();
}


const p_GetDataApproval = () => {
    $.ajax({
        type: "POST",
        url: "/Master/MasterApproval/GetDataDetailApprovalById",
        data: {
            Id: IdHeader,
            __RequestVerificationToken: $('#formApproval input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat, status, xhr) {
            if (xhr.responseText.includes("!DOCTYPE html")) {
                clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
            }
            else {
                if (retDat.bitSuccess == true) {
                    if (retDat.objData != undefined) {
                        debugger;
                        //Binding to Hidden Object
                        p_SetHiddenObjectHeaderApproval(retDat.objData.header);
                        p_SetHiddenObjectDetailApproval(retDat.objData.detail);

                        //Binding to UI Header
                        p_BindingDataHeader(retDat.objData.header);

                        //Adding to List for LOV
                        p_AddingListDataToListDetail(retDat.objData.detail);

                        //Generate DataTable
                        p_DataToUIApproval(retDat.objData.detail);
                        oTableApproval.page('last').draw(false);

                        isSaveHeader = true;
                    }
                } else {
                    clsGlobal.swalError(retDat.txtMessage);
                }
                $("#txtGUID").val(retDat.txtGUID);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}

const p_RefreshDataTable = () => {
    $.ajax({
        type: "POST",
        url: "/Master/MasterApproval/GetDataDetailApprovalById",
        data: {
            Id: IdHeader,
            __RequestVerificationToken: $('#formApproval input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat, status, xhr) {
            if (xhr.responseText.includes("!DOCTYPE html")) {
                clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
            }
            else {
                if (retDat.bitSuccess == true) {
                    if (retDat.objData != undefined) {
                        //Binding to Hidden Object
                        p_SetHiddenObjectDetailApproval(retDat.objData.detail);

                        //Adding to List for LOV
                        p_AddingListDataToListDetail(retDat.objData.detail);

                        //Generate DataTable
                        p_DataToUIApproval(retDat.objData.detail);
                        oTableApproval.page('last').draw(false);
                    }
                } else {
                    clsGlobal.swalError(retDat.txtMessage);
                }
                $("#txtGUID").val(retDat.txtGUID);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}

const p_DataToUIApproval = (lstDataPo) => {
    if (lstDataPo != null) {
        oTableApproval.clear();
        for (var i = 0; i < lstDataPo.length; i++) {
            lstDataPo[i].intIndex = i;
            oTableApproval.row.add(lstDataPo[i]);
        }
        oTableApproval.draw(false);
        var objDat = p_GetHiddenObjectDetailApproval();
        objDat = lstDataPo;
        p_SetHiddenObjectDetailApproval(objDat);
    }
    else {
        var objDat = p_GetHiddenObjectDetailApproval();
        p_SetHiddenObjectDetailApproval(objDat);
    }
}


const setUserRole = (arr) => {
    $("#TxtUserRole").val(arr[1]);
}

const setUser = (arr) => {
    $("#TxtUsername").val(arr[1]);
    $("#txtApprovalUser").val(arr[2]);
}


function validateInputCode(event) {
    const allowedValues = /^[a-zA-Z_0-9]$/; // Regular expression to match letters (a-z, A-Z) and numbers 0-1

    const inputValue = event.key;

    if (!allowedValues.test(inputValue)) {
        event.preventDefault(); // Prevent the input if it doesn't match the pattern
    }
}
function validateInputName(event) {
    const allowedValues = /^[a-zA-Z_0-9\s]+$/; // Regular expression to match letters (a-z, A-Z) and numbers 0-1 and whitespace

    const inputValue = event.key;

    if (!allowedValues.test(inputValue)) {
        event.preventDefault(); // Prevent the input if it doesn't match the pattern
    }
}


const p_SubmitDataHeaderApproval = () => {
    //Binding to payload
    let datCode = $("#ApprovalCode").val();
    let datName = $("#ApprovalName").val();
    let datProgramCode = $("#TxtSistemCode").find(":selected").val();
    let datBitAct = $('#BitActive').is(":checked") ? true : false;

    let payload = {
        ApprovalCode: datCode,
        ApprovalName: datName,
        BitActive: datBitAct,
        ProgramCode: datProgramCode,
    };

    if (p_validateDataHeader()) {
        $.ajax({
            type: "POST",
            url: "/Master/MasterApproval/SubmitHeaderApproval",
            data: {
                data: JSON.stringify(payload),
                __RequestVerificationToken: $('#formApproval input[name=__RequestVerificationToken]').val()
            },
            datatype: "json",
            success: function (retDat, status, xhr) {
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        isSaveHeader = true;
                        p_SetHiddenObjectHeaderApproval(retDat.objData);
                        clsGlobal.swalSuccess("Sucess Save Data Header");
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
}
const p_UpdateDataHeaderApproval = () => {
    let datHeder = p_GetHiddenObjectHeaderApproval();

    //Binding to payload
    let datCode = $("#ApprovalCode").val();
    let datName = $("#ApprovalName").val();
    let datProgramCode = $("#TxtSistemCode").find(":selected").val();
    let datBitAct = $('#BitActive').is(":checked") ? true : false;

    let payload = {
        ApprovalCode: datCode,
        ApprovalName: datName,
        BitActive: datBitAct,
        ProgramCode: datProgramCode,
        ApprovalHeaderId: datHeder.approvalHeaderId
    };

    if (p_validateDataHeader()) {
        $.ajax({
            type: "POST",
            url: "/Master/MasterApproval/UpdateHeaderApproval",
            data: {
                data: JSON.stringify(payload),
                __RequestVerificationToken: $('#formApproval input[name=__RequestVerificationToken]').val()
            },
            datatype: "json",
            success: function (retDat, status, xhr) {
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        isSaveHeader = true;
                        p_SetHiddenObjectHeaderApproval(retDat.objData);
                        clsGlobal.swalSuccess("Sucess Save Data Header");
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
}

const p_openModalApprovalDetail = () => {
    $("#txtStepCode").val("").removeAttr('disabled');
    $("#txtStepName").val("");
    $("#TxtUsername").val("");
    $("#txtApprovalUser").val("");
    $("#TxtUserRole").val("");
    $("#txtNextCodeStep").val("");
    $("#txtPrevCodeStep").val("");
    $('.checkbox-group').prop('checked', false);

    isEditDetail = false;

    $('#popUpApprovalDetail').modal('toggle');
    $('#popUpApprovalDetail').modal('show');
}

const p_openModalEditApprovalDetail = (event, datIdDetail) => {
    //Getting Data
    let lstData = p_GetHiddenObjectDetailApproval();
    let datDet = lstData.find(x => x.approvalDetailId == datIdDetail);
    console.log(datDet);


    $("#txtStepCode").val(datDet.stepCode).attr("disabled", true);
    $("#txtStepName").val(datDet.stepName);
    $("#TxtUsername").val(datDet.approvalUsername);
    $("#txtApprovalUser").val(datDet.approvalUser);
    $("#TxtUserRole").val(datDet.approvalUserRole);
    $("#txtNextCodeStep").val(datDet.nextCodeStep);
    $("#txtPrevCodeStep").val(datDet.prevCodeStep);
    $("#IsStart").prop("checked", datDet.isStart);
    $("#IsFinish").prop("checked", datDet.isFinish);

    $("#IsSuperior").prop("checked", datDet.IsSuperior);

    isEditDetail = true;

    $('#popUpApprovalDetail').modal('toggle');
    $('#popUpApprovalDetail').modal('show');
}

const p_SubmitDataDetailApproval = () => {
    //Binding to payload
    //Getting data Header
    var datHeader = p_GetHiddenObjectHeaderApproval();

    let datStepCode = $("#txtStepCode").val();
    let datStepName = $("#txtStepName").val();
    let datUsername = $("#TxtUsername").val();
    let datFullName = $("#txtApprovalUser").val();
    let datUserRole = $("#TxtUserRole").val();
    let datNextCode = $("#txtNextCodeStep").val();
    let datPrevCode = $("#txtPrevCodeStep").val();
    let datIsStart = $('#IsStart').is(':checked') ? true : false;
    let datIsFinish = $('#IsFinish').is(':checked') ? true : false;
    let datIsActive = $('#bitActive').is(':checked') ? true : false;
    let datIsSuperior = $('#IsFinish').is(':checked') ? true : false;

    let payload = {
        StepCode: datStepCode,
        StepName: datStepName,
        ApprovalUsername: datUsername,
        ApprovalUser: datFullName,
        ApprovalUserRole: datUserRole,
        NextCodeStep: datNextCode,
        PrevCodeStep: datPrevCode,
        IsStart: datIsStart,
        IsFinish: datIsFinish,
        BitActive: datIsActive,
        ApprovalHeaderId: datHeader.approvalHeaderId,
        IsSuperior: datIsSuperior
    };

    if (p_validateDataDetail()) {
        $.ajax({
            type: "POST",
            url: "/Master/MasterApproval/SubmitDetailApproval",
            data: {
                data: JSON.stringify(payload),
                __RequestVerificationToken: $('#frmApprovalDetail input[name=__RequestVerificationToken]').val()
            },
            datatype: "json",
            success: function (retDat, status, xhr) {
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        console.log(retDat);
                        p_AddingDataToListDetail(retDat.objData);
                        clsGlobal.swalSuccess("Sucess Save Data Detail");
                        $('#popUpApprovalDetail').modal('toggle');
                        $('#popUpApprovalDetail').modal('hide');
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
}

const p_UpdateDataDetailApproval = () => {
    //Binding to payload
    //Getting data Header
    var datHeader = p_GetHiddenObjectHeaderApproval();
    var lstDatDet = p_GetHiddenObjectDetailApproval();

    let datStepCode = $("#txtStepCode").val();
    let datStepName = $("#txtStepName").val();
    let datUsername = $("#TxtUsername").val();
    let datFullName = $("#txtApprovalUser").val();
    let datUserRole = $("#TxtUserRole").val();
    let datNextCode = $("#txtNextCodeStep").val();
    let datPrevCode = $("#txtPrevCodeStep").val();
    let datIsStart = $('#IsStart').is(':checked') ? true : false;
    let datIsFinish = $('#IsFinish').is(':checked') ? true : false;
    let datIsActive = $('#bitActive').is(':checked') ? true : false;

    let datIsSuperior = $('#IsSuperior').is(':checked') ? true : false;

    var datDet = lstDatDet.find(x => x.stepCode.toUpperCase() == datStepCode.toUpperCase())

    let payload = {
        StepCode: datStepCode,
        StepName: datStepName,
        ApprovalUsername: datUsername,
        ApprovalUser: datFullName,
        ApprovalUserRole: datUserRole,
        NextCodeStep: datNextCode,
        PrevCodeStep: datPrevCode,
        IsStart: datIsStart,
        IsFinish: datIsFinish,
        BitActive: datIsActive,
        ApprovalHeaderId: datHeader.approvalHeaderId,
        ApprovalDetailId: datDet.approvalDetailId,
        IsSuperior: datIsSuperior
    };


    $.ajax({
        type: "POST",
        url: "/Master/MasterApproval/UpdateDetailApproval",
        data: {
            data: JSON.stringify(payload),
            __RequestVerificationToken: $('#frmApprovalDetail input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat, status, xhr) {
            if (xhr.responseText.includes("!DOCTYPE html")) {
                clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
            }
            else {
                if (retDat.bitSuccess == true) {
                    clsGlobal.swalSuccess("Sucess Update Data Detail");
                    $('#popUpApprovalDetail').modal('toggle');
                    $('#popUpApprovalDetail').modal('hide');
                    p_RefreshDataTable();
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

const p_AddingDataToListDetail = (objData) => {
    let retDat = p_GetHiddenObjectDetailApproval();
    arrDetlApproval = retDat;

    arrDetlApproval.push(objData);

    p_SetHiddenObjectDetailApproval(arrDetlApproval);

    p_DataToUIApproval(retDat);
}

const p_AddingListDataToListDetail = (objData) => {
    debugger;
    $.each(objData, (index, item) => {
        debugger;
        //Check if StepCode already exists in arrDetlApproval
        let exists = arrDetlApproval.some(data => data.stepCode === item.stepCode);
        if (!exists) {
            arrDetlApproval.push(item);
            //pushDataTempStepCode(item.stepCode, index);
        }
    });

    p_SetHiddenObjectDetailApproval(arrDetlApproval);
}

const p_BindingDataHeader = (objData) => {
    $("#ApprovalCode").val(objData.approvalCode).attr("disabled", true);
    $("#ApprovalName").val(objData.approvalName);
    $("#TxtSistemCode").val(objData.programCode).trigger("change");
    $('#BitActive').prop("checked", objData.bitActive ? true : false);
}

const p_DeleteApprovalDetail = (IdDetail) => {
    $.ajax({
        type: "POST",
        url: "/Master/MasterApproval/DetactiveDetailApproval",
        data: {
            idDetail: IdDetail,
            __RequestVerificationToken: $('#formApproval input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat, status, xhr) {
            if (xhr.responseText.includes("!DOCTYPE html")) {
                clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
            }
            else {
                if (retDat.bitSuccess == true) {
                    clsGlobal.swalSuccess("Sucess Delete Approval Step");
                    p_RefreshDataTable();
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
const p_validateDataDetail = () => {
    let datStepCode = $("#txtStepCode").val();
    let datStepName = $("#txtStepName").val();
    let datUsername = $("#TxtUsername").val();
    let datUserRole = $("#TxtUserRole").val();

    if (datStepCode === '' || datStepCode === undefined) {
        clsGlobal.swalWarning("Please Input Step Approval Code");
        return false;
    }
    else if (datStepName === '' || datStepName === undefined) {
        clsGlobal.swalWarning("Please Input Step Approval Name");
        return false;
    }
    else if ((datUsername === '' || datUsername === undefined) && (datUserRole === '' || datUserRole === undefined)) {
        clsGlobal.swalWarning("Please Input a Username or a User Role. At least one is required");
        return false;
    }

    return true;
}

const p_validateDataHeader = () => {
    let datCode = $("#ApprovalCode").val();
    let datName = $("#ApprovalName").val();
    let datProgramCode = $("#TxtSistemCode").find(":selected").val();

    if (datCode === '' || datCode === undefined) {
        clsGlobal.swalWarning("Please Input Approval Code");
        return false;
    }
    else if (datName === '' || datName === undefined) {
        clsGlobal.swalWarning("Please Input Approval Name");
        return false;
    }
    else if (datProgramCode === '' || datProgramCode === undefined) {
        clsGlobal.swalWarning("Please Select Program Name");
        return false;
    }

    return true;
}
//=======================
// HANDLER
//=======================
$("#btnAddDetailApproval").on("click", (e) => {
    e.preventDefault();

    let valSistem = $("#TxtSistemCode").find(':selected').val();
    let valCode = $("#ApprovalCode").val();
    let valName = $("#ApprovalName").val();

    if (valSistem === "") {
        clsGlobal.swalWarning("Please Select Program Name!");
    }
    else if (valCode === "" || valCode === undefined) {
        clsGlobal.swalWarning("Please Input Approval Code!");
    }
    else if (valName === "" || valName === undefined) {
        clsGlobal.swalWarning("Please Input Approval Name!");
    }
    else if (!isSaveHeader) {
        debugger;
        console.log(isSaveHeader);
        clsGlobal.swalWarning("Please Save Form Approval Header First!");
    }
    else {
        p_openModalApprovalDetail();
    }
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

$("#btnLOVUser").on("click", (e) => {
    e.preventDefault();

    let valSistem = $("#TxtSistemCode").find(':selected').val();
    if (valSistem === "") {
        clsGlobal.swalWarning("Please Select Program Name!");
    }
    else {
        clsGlobal.generateLOV(MODULE_LOV_APPROVAL_USER, MODULE_LOV_APPROVAL_USER, valSistem);
    }
})

$("#btnLOVUserRole").on("click", (e) => {
    e.preventDefault();

    let valSistem = $("#TxtSistemCode").find(':selected').val();
    if (valSistem === "") {
        clsGlobal.swalWarning("Please Select Program Name!");
    }
    else {
        clsGlobal.generateLOV(MODULE_LOV_APPROVAL_USERROLE, MODULE_LOV_APPROVAL_USERROLE, valSistem);
    }
});

$("#btnLOVNextStepCode").on("click", (e) => {
    e.preventDefault();

    p_callLOVNextStepCode();
})

$("#btnLOVPrevStepCode").on("click", (e) => {
    e.preventDefault();

    p_callLOVPrevStepCode();
})
$("#btnSubmitHeader").on("click", (e) => {
    e.preventDefault();
    if (isSaveHeader) {
        p_UpdateDataHeaderApproval();
    }
    else {
        p_SubmitDataHeaderApproval();
    }

});

$("#btnSubmitApprovalDetail").on("click", (e) => {
    e.preventDefault();
    if (isEditDetail) {
        p_UpdateDataDetailApproval();
    }
    else {
        p_SubmitDataDetailApproval();
    }
});
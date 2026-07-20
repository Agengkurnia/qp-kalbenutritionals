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
//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    debugger;

    $(".select2-modal").select2({
        width: "100%",
        dropdownParent: $('#inputStageDetailModal')
    });

    initiateTableDetailStage();
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

const p_GetHiddenObjectDetail = () => {
    return JSON.parse($("#HiddenObjectDetail").val());
}

const p_GetLstHiddenObjectDetail = () => {
    return JSON.parse($("#LstHiddenObjectDetail").val());
}

const p_GetHiddenObjectHeader = () => {
    return JSON.parse($("#HiddenObjectHeader").val());
}

const p_SetLstHiddenObjectDetail = (objDat) => {
    //console.log(objDat);
    $("#LstHiddenObjectDetail").val(JSON.stringify(objDat));
}

const p_SetHiddenObjectDetail = (objDat) => {
    //console.log(objDat);
    $("#HiddenObjectDetail").val(JSON.stringify(objDat));
}

const p_SetHiddenObjectHeader = (objDat) => {
    //console.log(objDat);
    $("#HiddenObjectHeader").val(JSON.stringify(objDat));
}

//=======================
// FUNCTION
//=======================

function showSwalAlert(txtMsg) {
    debugger;
    var txtUrl = `${base_path}/Master/Approval/Index`;
    clsGlobal.swalSuccessSaveOrSubmit(txtMsg, txtUrl);
}

const initiateTableDetailStage = () => {
    if (!$.fn.DataTable.isDataTable('#tableDetailTask')) {
        oTableApproval = $("#tableDetailTask").DataTable({
            "paging": true,
            "searching": false,
            "ordering": false,
            "info": false,
            "autoWidth": false,
            "lengthMenu": [
                [5, 10, 25, 50, -1],
                ['5', '10', '25', '50', 'All'] 
            ],
            "iDisplayLength": -1,
            columns: [
                { title: 'Sequence', name: "IntSequence", className: "center text-nowrap", "targets": [0], orderable: false },
                { title: 'Task    ', name: "TaskName", className: "text-left text-nowrap", "targets": [1], orderable: false },
                { title: 'Task Type    ', name: "TxtTaskType", className: "text-left text-nowrap", "targets": [2], orderable: false },
                { title: 'Action   ', className: "text-center text-nowrap", "targets": [3], orderable: false },
            ],
            aoColumnDefs: [
                {
                    aTargets: [0],
                    width: "150px",
                    mRender: function (data, type, full) {
                        debugger;
                        let rowCounter = p_GetLstHiddenObjectDetail();
                        let totalItems = rowCounter.length;

                        let isFirst = full.intIndex === 0;
                        let isLast = full.intIndex === totalItems - 1;

                        return `
                                    <div style="width: 250px;">
                                        <div class="d-flex flex-row gap-2">
                                            <div style="width: 20px; text-align: center;">
                                                <a href="javascript:void(0)" onclick="moveUp(${full.intIndex})" style="${isFirst ? 'visibility:hidden;' : ''}">
                                                    <i class="fa fa-arrow-up text-success"></i>
                                                </a>
                                            </div>
                                            <div>
                                                <span class="txt-Sequence-val text-center" id="txtSequence${full.intIndex}">
                                                    ${full.IntSequence == null ? '' : full.IntSequence}
                                                </span>
                                            </div>
                                            <div style="width: 20px; text-align: center;">
                                                <a href="javascript:void(0)" onclick="moveDown(${full.intIndex})" style="${isLast ? 'visibility:hidden;' : ''}">
                                                    <i class="fa fa-arrow-down text-success"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                `;
                        
                    },
                },
                {
                    aTargets: [1],
                    width: "250px",
                    mRender: function (data, type, full) {
                        return `<div style="width: 200px;">
                                    <span>${full.TaskName == null ? '' : full.TaskName}</span>
                                    <input disabled class= "form-control txt-stepNameId-val" type = "hidden" value ="${full.TxtTaskId == null ? '' : full.TxtTaskId}" id="txtStepNameId${full.intIndex}" />
                                </div>`;
                    },
                },
                {
                    aTargets: [2],
                    width: "200px",
                    mRender: function (data, type, full) {
                        return `<div style="width: 200px;">
                                    <span>${full.TxtTaskType == null ? '' : full.TxtTaskType}</span>
                                </div>`;
                    },
                },
                {
                    aTargets: [3],
                    width: "100px",
                    mRender: function (data, type, full, meta) {
                        return '<div style="padding:0;margin:0">' +
                            '     <button type="button" class="btn btn-danger btn-icon waves-effect waves-float waves-light button-group btnDetailDeleteStage" id="btnDetailDeleteStage-' + full.intIndex + '" onclick="p_btnDetailDeleteStage_Click(this,' + full.intIndex + ')">' +
                            '         <i class="fa fa-trash"></i>' +
                            '     </button>' +
                            '</div>';

                        //if (txtTypeForm == "View") {
                        //    return ``;
                        //}
                        //else {
                        //    if (full.intId === 0) {
                        //        return '<div style="padding:0;margin:0">' +
                        //            '     <button class="btn btn-danger btn-icon waves-effect waves-float waves-light button-group btnDetailDeleteApproval" id="btnDetailDeleteApproval-' + full.intIndex + '" onclick="p_btnDetailDeleteApproval_Click(this,' + full.intIndex + ')" value="Delete">' +
                        //            '         <i class="fa fa-trash"></i>' +
                        //            '     </button>' +
                        //            '</div>';
                        //    }
                        //    else {
                        //        return '';
                        //    }
                        //}
                    }
                },
            ]
        });
    }

    $('#tableDetailTask tbody').on('click', 'tr', function () {
        if (!$(this).hasClass('selected')) {
            oTableApproval.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });

    oTableApproval.draw();
}

const p_RefreshNumberDetailStage = () => {
    debugger;
    var intRowIndex = 0;
    var objDat = p_GetLstHiddenObjectDetail();
    debugger;
    oTableApproval.rows().every(function (rowIdx, tableLoop, rowLoop) {
        var d = this.data();
        debugger;
        //console.log(d);
        d.IntSequence = (intRowIndex + 1); // update data source for the row
        objDat[intRowIndex].IntSequence = d.IntSequence;
        d.intIndex = intRowIndex;
        objDat[intRowIndex].intIndex = intRowIndex;

        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableApproval.draw(false);
    p_SetLstHiddenObjectDetail(objDat);
}

const p_btnDetailDeleteStage_Click = (objCaller, intIndex) => {
    // Parse dari HiddenObject->JSON
    var objData = p_GetLstHiddenObjectDetail();
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

    p_SetLstHiddenObjectDetail(objData);
    p_RefreshNumberDetailStage();
}

const p_DataToUITask = (lstDataTask) => {
    if (lstDataTask != null) {
        oTableApproval.clear();
        for (var i = 0; i < lstDataTask.length; i++) {
            lstDataTask[i].intIndex = i;
            oTableApproval.row.add(lstDataTask[i]);
        }
        oTableApproval.draw(false);
        var objDat = p_GetLstHiddenObjectDetail();
        objDat = lstDataTask;
        p_SetLstHiddenObjectDetail(objDat);
    }
    else {
        var objDat = p_GetLstHiddenObjectDetail();
        p_SetLstHiddenObjectDetail(objDat);
    }
}

const p_SubmitDataStage = () => {
    $.ajax({
        type: "POST",
        url: "/I2MS/Master/Stage/SaveData",
        data: {
            DataHeader: $("#HiddenObjectHeader").val(),
            DataDetail: $("#LstHiddenObjectDetail").val(),
            __RequestVerificationToken: $('#formStage input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat, status, xhr) {
            if (xhr.responseText.includes("!DOCTYPE html")) {
                clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
            }
            else {
                if (retDat.bitSuccess == true) {
                    isEdit = false;

                    clsGlobal.swalSuccess(retDat.objData);

                    $("#formInputStage").hide();
                    $("#formDataTable").show();

                    pSetFormDetailClear();
                    p_MasterParameter();
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

const pShowFreshModalInput = () => {
    debugger;
    let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('inputStageDetailModal'));
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };

    let valCounter = pHandleSequence();

    pInitModal(valCounter);

    modal.show();
}

const pCloseModalInputReset = () => {
    let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('inputStageDetailModal'));
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };

    modal.hide();
}

const pHandleSequence = () => {
    var lstDat = p_GetLstHiddenObjectDetail();

    return lstDat.length + 1;
}

const pInitModal = (counter = -1) => {
    $("#sequenceInput-modal").val(counter);
    $("#taskInput-modal").val(null).trigger("change");
    $("#taskTypeInput-modal").val(null).trigger("change");
}

const pValidateDataDetail = () => {
    //Getting Data
    let task = $("#taskInput-modal").find(":selected").val();
    let taskType = $("#taskTypeInput-modal").find(":selected").val();

    if (task == null || task == "") {
        clsGlobal.setMessageWarning("Task has not been selected!");
        return false;
    }
    else if (taskType == null || taskType == "") {
        clsGlobal.setMessageWarning("Task Type has not been selected!");
        return false;
    }

    return true;
}

const pSaveDataModal = () => {
    let DataDetail = p_GetHiddenObjectDetail();

    //Binding to Model
    let seq = $("#sequenceInput-modal").val();
    let taskId = $("#taskInput-modal").find(":selected").val();
    let taskName = $("#taskInput-modal").find(":selected").text();
    let taskType = $("#taskTypeInput-modal").find(":selected").val();

    DataDetail.IntSequence = parseInt(seq);
    DataDetail.TxtTaskId = taskId;
    DataDetail.TxtTaskType = taskType;
    DataDetail.BitActive = true;
    DataDetail.TaskName = taskName;


    let LstDatDetail = p_GetLstHiddenObjectDetail();

    let isExist = LstDatDetail.some(x => x.TaskName === taskName);

    if (isExist) {
        clsGlobal.swalWarning("This task name is already in use. Please enter a different name to continue")
    }
    else {
        LstDatDetail.push(DataDetail);

        //Set to Hidden Object Detail and Render
        p_SetLstHiddenObjectDetail(LstDatDetail);
        pToDataTable(LstDatDetail);

        //Close Modal
        pCloseModalInputReset();
    }
}

const pToDataTable = (lstData) => {
    p_DataToUITask(lstData);
    oTableApproval.page('last').draw(false);
}

const pSetFormDetailClear = () => {
    let lstData = p_GetLstHiddenObjectDetail();
    let datHeader = p_GetHiddenObjectHeader();

    //Clear List
    lstData = [];
    p_SetLstHiddenObjectDetail(lstData);
    pToDataTable(lstData);

    //Clear JSON Header
    datHeader.IntHeaderId = 0;
    datHeader.TxtHeaderId = "00000000-0000-0000-0000-000000000000";
    datHeader.MasterStageDetails = [];
    datHeader.MasterBisProDetails = [];
    datHeader.MasterBisProSubDetails = [];
    p_SetHiddenObjectHeader(datHeader);

    //Clear Data Header
    $("#StageName").val("");
    $("#BitActive").prop("checked", true);
}

const moveDown = (intIndex) => {
    debugger;
    let objData = p_GetLstHiddenObjectDetail();

    for (let i = 0; i < objData.length - 1; i++) {
        if (objData[i].intIndex === intIndex) {
            // Tukar dengan elemen di bawahnya
            [objData[i], objData[i + 1]] = [objData[i + 1], objData[i]];

            break;
        }
    }

    // Perbarui semua intIndex sesuai urutan baru
    objData.forEach((item, index) => {
        item.intIndex = index;
        item.IntSequence = (index + 1);
    });

    p_SetLstHiddenObjectDetail(objData);

    // Redraw tabel
    oTableApproval.clear().rows.add(objData).draw(false);
};

const moveUp = (intIndex) => {
    debugger;
    let objData = p_GetLstHiddenObjectDetail();

    for (let i = 1; i < objData.length; i++) {
        if (objData[i].intIndex === intIndex) {
            // Tukar dengan elemen di atasnya
            [objData[i], objData[i - 1]] = [objData[i - 1], objData[i]];

            break;
        }
    }

    // Perbarui semua intIndex sesuai urutan baru
    objData.forEach((item, index) => {
        item.intIndex = index;
        item.IntSequence = (index + 1);
    });

    p_SetLstHiddenObjectDetail(objData);

    // Redraw tabel
    oTableApproval.clear().rows.add(objData).draw(false);
};

const ValidateHeader = () => {
    debugger;
    //Getting Data
    let stageName = $("#StageName").val();
    let bitActive = $('#BitActive').is(":checked");

    if (stageName == null || stageName == "") {
        clsGlobal.setMessageWarning("Stage must be filled in!");
        return false;
    }
    else if (bitActive == false || bitActive == null) {
        clsGlobal.setMessageWarning("Please check the Active checkbox!");
        return false;
    }

    return true;
}

const ValidateSaveStage = () => {
    debugger;
    //Getting Data
    let stageName = $("#StageName").val();
    let bitActive = $('#BitActive').is(":checked");

    let lstObjDetail = p_GetLstHiddenObjectDetail();

    if (stageName == null || stageName == "") {
        clsGlobal.setMessageWarning("Stage must be filled in!");
        return false;
    }
    else if (bitActive == false || bitActive == null) {
        clsGlobal.setMessageWarning("Please check the Active checkbox!");
        return false;
    }
    else if (bitActive == null || lstObjDetail.length == 0) {
        clsGlobal.setMessageWarning("Please add at least one Task first!");
        return false;
    }

    return true;
}

const p_UpdateDataStage = () => {
    $.ajax({
        type: "POST",
        url: "/I2MS/Master/Stage/UpdateData",
        data: {
            DataHeader: $("#HiddenObjectHeader").val(),
            DataDetail: $("#LstHiddenObjectDetail").val(),
            __RequestVerificationToken: $('#formStage input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat, status, xhr) {
            if (xhr.responseText.includes("!DOCTYPE html")) {
                clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
            }
            else {
                if (retDat.bitSuccess == true) {
                    isEdit = false;

                    clsGlobal.swalSuccess(retDat.objData);

                    $("#formInputStage").hide();
                    $("#formDataTable").show();

                    pSetFormDetailClear();
                    p_MasterParameter();
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

$("#btnNew").click(function (e) {
    e.preventDefault();

    isEdit = false;

    $("#formDataTable").hide();
    $("#formInputStage").show();
});

$("#btnBack").click(function (e) {
    e.preventDefault();

    isEdit = false;

    $("#formInputStage").hide();
    $("#formDataTable").show();

    pSetFormDetailClear();
    p_MasterParameter();
});

$("#btnAddTaskModal").click(function (e) {
    debugger;
    e.preventDefault();

    if (ValidateHeader()) {
        pShowFreshModalInput();
    }
});

$("#btnCloseModal").click(function (e) {
    e.preventDefault();

    pCloseModalInputReset();
});

$("#btnSaveModal").click(function (e) {
    e.preventDefault();

    var val = pValidateDataDetail();

    if (val) {
        pSaveDataModal();
    }
});

$("#btnSaveDataStage").click(function (e) {
    e.preventDefault();

    //Getting Data Header
    var objHeader = p_GetHiddenObjectHeader();

    //Binding Data Header
    let stageName = $("#StageName").val();
    let bitActive = $('#BitActive').is(":checked");

    objHeader.TxtStageName = stageName;
    objHeader.BitActive = bitActive ? true : false;
    objHeader.MasterStageDetails = [];

    if (isEdit) {
        objHeader.TxtNewStageName = stageName;
    }

    //Set Data Header
    p_SetHiddenObjectHeader(objHeader);

    if (isEdit) {
        p_UpdateDataStage();
    }
    else if (ValidateSaveStage()) {
        p_SubmitDataStage();
    }
});
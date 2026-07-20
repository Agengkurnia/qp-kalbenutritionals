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

    $(".select2").select2({
        width: "100%",
    });

});

//=======================
// SET VALUE LOV
//=======================

//=======================
// HIDDEN OBJECT
//=======================

const p_GetHiddenObjectHeader = () => {
    return JSON.parse($("#HiddenObjectHeader").val());
}

const p_SetHiddenObjectHeader = (objDat) => {
    //console.log(objDat);
    $("#HiddenObjectHeader").val(JSON.stringify(objDat));
}

//=======================
// FUNCTION
//=======================

const p_SubmitDataStage = () => {
    $.ajax({
        type: "POST",
        url: "/Master/Stage/SaveData",
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

const pSetFormDetailClear = () => {
    //Clear Data Header
    $("#TaskName").val("");
    $("#Collaborator").val(null).trigger("change");
    $("#TasklistBreakdown").val(null).trigger("change");
    $("#BitActive").prop("checked", true);
}

const ValidateSaveTask = () => {
    debugger;
    //Getting Data
    let TaskName = $("#TaskName").val();
    let CollaboratorName = $("#Collaborator").find(":selected").val();
    let TaskListBreakDown = $("#TasklistBreakdown").find(":selected").val();

    if (TaskName == null || TaskName == "") {
        clsGlobal.setMessageWarning("Task must be filled in.");
        return false;
    }
    else if (TaskListBreakDown == null || TaskListBreakDown == "") {
        clsGlobal.setMessageWarning("TaskList Breakdown field is required. Select an option or choose 'N/A' if none applies.");
        return false;
    }
    else if (CollaboratorName == null || CollaboratorName == "") {
        clsGlobal.setMessageWarning("Collaborator is Require. Please Select Collaborator.");
        return false;
    }

    return true;
}

const p_SubmitDataTask = () => {
    $.ajax({
        type: "POST",
        url: "/I2MS/MasterTask/SaveData",
        data: {
            DataHeader: $("#HiddenObjectHeader").val(),
            __RequestVerificationToken: $('#formTask input[name=__RequestVerificationToken]').val()
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

                    $("#formInputTask").hide();
                    $("#formTaskList").show();

                    pSetFormDetailClear();
                    f_BindingGrid();
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

const p_UpdateDataTask = () => {
    $.ajax({
        type: "POST",
        url: "/I2MS/MasterTask/UpdateData",
        data: {
            DataHeader: $("#HiddenObjectHeader").val(),
            __RequestVerificationToken: $('#formTask input[name=__RequestVerificationToken]').val()
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

                    $("#formInputTask").hide();
                    $("#formTaskList").show();

                    pSetFormDetailClear();
                    f_BindingGrid();
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

    $("#formTaskList").hide();
    $("#formInputTask").show();
});

$("#btnBack").click(function (e) {
    e.preventDefault();

    isEdit = false;

    $("#formInputTask").hide();
    $("#formTaskList").show();

    pSetFormDetailClear();
    f_BindingGrid();
});

$("#btnSaveDataTask").click(function (e) {
    e.preventDefault();

    //Getting Data Header
    var objHeader = p_GetHiddenObjectHeader();

    //Binding Data Header
    let TaskName = $("#TaskName").val();
    let CollaboratorName = $("#Collaborator").find(":selected").val();
    let TaskBreakdown = $("#TasklistBreakdown").find(":selected").val();
    let bitActive = $('#BitActive').is(":checked");

    objHeader.TaskName = TaskName;
    objHeader.TaskCollaborator = CollaboratorName;
    objHeader.TaskBreakdown = TaskBreakdown;
    objHeader.IsActive = bitActive ? true : false;

    console.log(objHeader);

    if (isEdit) {
        objHeader.NewTaskName = TaskName;
    }

    //Set Data Header
    p_SetHiddenObjectHeader(objHeader);

    if (isEdit) {
        p_UpdateDataTask();
    }
    else if (ValidateSaveTask()) {
        p_SubmitDataTask();
    }
});
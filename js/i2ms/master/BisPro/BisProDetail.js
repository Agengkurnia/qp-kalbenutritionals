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
let oTableSubStage;
let tempStageDetailId;
let tempHeaderId;
let temSubDetail = [];
//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    $(".select2").select2({
        width: "100%"
    });

    $(".select2-modal").select2({
        width: "100%",
        dropdownParent: $('#inputBisProDetailModal')
    });

    initiateTableDetailBisPro();
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

const p_GetLstHiddenObjectSubDetail = () => {
    return JSON.parse($("#LstHiddenObjectSubDetail").val());
}

const p_GetHiddenObjectHeader = () => {
    return JSON.parse($("#HiddenObjectHeader").val());
}

const p_GetHiddenObjectSubDetail = () => {
    return JSON.parse($("#HiddenObjectSubDetail").val());
}

const p_SetLstHiddenObjectDetail = (objDat) => {
    //console.log(objDat);
    $("#LstHiddenObjectDetail").val(JSON.stringify(objDat));
}

const p_SetLstHiddenObjectSubDetail = (objDat) => {
    //console.log(objDat);
    $("#LstHiddenObjectSubDetail").val(JSON.stringify(objDat));
}

const p_SetHiddenObjectDetail = (objDat) => {
    //console.log(objDat);
    $("#HiddenObjectDetail").val(JSON.stringify(objDat));
}

const p_SetHiddenObjectSubDetail = (objDat) => {
    //console.log(objDat);
    $("#HiddenObjectSubDetail").val(JSON.stringify(objDat));
}

const p_SetHiddenObjectHeader = (objDat) => {
    //console.log(objDat);
    $("#HiddenObjectHeader").val(JSON.stringify(objDat));
}

//=======================
// FUNCTION
//=======================

function showSwalAlert(txtMsg) {
    
    var txtUrl = `${base_path}/Master/Approval/Index`;
    clsGlobal.swalSuccessSaveOrSubmit(txtMsg, txtUrl);
}

const initiateTableDetailBisPro = () => {
    
    if (!$.fn.DataTable.isDataTable('#tableDetailBisPro')) {
        oTableApproval = $("#tableDetailBisPro").DataTable({
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
                { title: 'Sequence', name: "IntSequence", width: '100px', className: "center text-nowrap", "targets": [0], orderable: false },
                { title: 'Stage    ', name: "TaskName", width: '200px', className: "text-left text-nowrap", "targets": [1], orderable: false },
                { title: 'Action   ', width: '100px', className: "text-center text-nowrap", "targets": [2], orderable: false },
            ],
            aoColumnDefs: [
                {
                    aTargets: [0],
                    width: "150px",
                    mRender: function (data, type, full) {
                        
                        let rowCounter = p_GetLstHiddenObjectDetail();
                        let totalItems = rowCounter.length;

                        let isFirst = full.intIndex === 0;
                        let isLast = full.intIndex === totalItems - 1;

                        return `
                                    <div style="width: 250px;">
                                        <div class="d-flex flex-row gap-2">
                                            <div style="width: 20px; text-align: center;">
                                                <a href="javascript:void(0)" onclick="moveUp(${full.intIndex}, 'DETAIL')" style="${isFirst ? 'visibility:hidden;' : ''}">
                                                    <i class="fa fa-arrow-up text-success"></i>
                                                </a>
                                            </div>
                                            <div>
                                                <span class="txt-Sequence-val text-center" id="txtSequence${full.intIndex}">
                                                    ${full.IntSequence == null ? '' : full.IntSequence}
                                                </span>
                                            </div>
                                            <div style="width: 20px; text-align: center;">
                                                <a href="javascript:void(0)" onclick="moveDown(${full.intIndex}, 'DETAIL')" style="${isLast ? 'visibility:hidden;' : ''}">
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
                                    <span>${full.StageName == null ? '' : full.StageName}</span>
                                    <input disabled class= "form-control txt-stepNameId-val" type = "hidden" value ="${full.TxtStageId == null ? '' : full.TxtStageId}" id="txtStepNameId${full.intIndex}" />
                                </div>`;
                    },
                },
                {
                    aTargets: [2],
                    width: "100px",
                    mRender: function (data, type, full, meta) {
                        return `<div class="d-flex justify-content-center" style="gap: 0.5rem;">
                                    <div style="padding:0;margin:0">
                                        <button type="button" class="btn btn-info waves-effect waves-float waves-light btnDetailDeleteStage"
                                            id="btnDetailDeleteStage-{{full.intIndex}}"
                                            onclick="pInitModalSubDetail('${full.TxtStageId}')">
                                            Sub Stage
                                        </button>
                                    </div>
                                    <div style="padding:0;margin:0">
                                        <button type="button" class="btn btn-danger btn-icon waves-effect waves-float waves-light button-group btnDetailDeleteStage"
                                            id="btnDetailDeleteStage-{{full.intIndex}}"
                                            onclick="p_btnDetailDeleteStage_Click(this, '${full.intIndex}')">
                                            <i class="fa fa-trash"></i>
                                        </button>
                                    </div>
                                </div>`;

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

    $('#tableDetailBisPro tbody').on('click', 'tr', function () {
        if (!$(this).hasClass('selected')) {
            oTableApproval.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });

    oTableApproval.draw();
}

const p_RefreshNumberDetailStage = () => {
    
    var intRowIndex = 0;
    var objDat = p_GetLstHiddenObjectDetail();
    
    oTableApproval.rows().every(function (rowIdx, tableLoop, rowLoop) {
        var d = this.data();
        
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
    var detailIndex = -1;
    var objData = p_GetLstHiddenObjectDetail();

    for (var i = 0; i < objData.length; i++) {
        // Cari Index-nya.
        if (objData[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            detailIndex = objData[i].DetailIndex;
            // Remove from list.
            objData.splice(i, 1);

            oTableApproval.row(i).remove().draw(false);
            break;
        }
    }

    debugger;

    //Delete Juga Detailnya kalau Ada
    let index = temSubDetail.findIndex(x => x.HeaderIndex === detailIndex);

    if (index != -1) {
        temSubDetail.splice(index, 1);
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
    //DeletingRelation
    let lstObjDatDetail = JSON.parse($("#LstHiddenObjectDetail").val());
    let lstObjDatSubDetail = JSON.parse($("#LstHiddenObjectSubDetail").val());

    console.log(typeof (lstObjDatDetail));
    console.log(typeof (lstObjDatSubDetail));

    lstObjDatDetail.forEach((item, index) => {
        item.MasterBisProSubDetails = [];
    });

    lstObjDatSubDetail.forEach((item, index) => {
        item.MasterStageHeader = {};
    });

    $.ajax({
        type: "POST",
        url: "/Master/BisPro/SaveData",
        data: {
            DataHeader: $("#HiddenObjectHeader").val(),
            DataDetail: JSON.stringify(lstObjDatDetail),
            DataSubDetail: JSON.stringify(lstObjDatSubDetail),
            __RequestVerificationToken: $('#formBisPro input[name=__RequestVerificationToken]').val()
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

                    $("#formInputBisPro").hide();
                    $("#formDatatable").show();

                    //Set TempData to Array Kosong
                    temSubDetail = [];

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

const pShowFreshModalInput = (type, stageId = "") => {
    

    if (type == "DETAIL") {
        let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('inputBisProDetailModal'));
        $.fn.modal.Constructor.prototype.enforceFocus = function () { };

        let valCounter = pHandleSequence(type);

        pInitModal(type, valCounter);

        modal.show();

        //Set Button Close trigger
        $("#btnCloseModal").val("DETAIL");
        $("#btnSaveModal").val("DETAIL");
    }
    if (type == "SUBDETAIL") {
        
        let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('inputBisProDetailModal'));
        $.fn.modal.Constructor.prototype.enforceFocus = function () { };

        let valCounter = pHandleSequence(type, stageId);

        pInitModal(type, valCounter);

        modal.show();

        //Set Button Close trigger
        $("#btnCloseModal").val("SUBDETAIL");
        $("#btnSaveModal").val("SUBDETAIL");
    }
}

const pCloseModalInputReset = (type) => {

    if (type == "DETAIL") {
        let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('inputBisProDetailModal'));
        $.fn.modal.Constructor.prototype.enforceFocus = function () { };

        modal.hide();
    }
    else if (type == "SUBDETAIL") {
        let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('inputBisProDetailModal'));
        $.fn.modal.Constructor.prototype.enforceFocus = function () { };

        modal.hide();

        let modalSub = bootstrap.Modal.getOrCreateInstance(document.getElementById('inputBisProSubDetailModal'));
        $.fn.modal.Constructor.prototype.enforceFocus = function () { };

        modalSub.show();
    }
}

const pHandleSequence = (type, stageId = "") => {

    if (type == "DETAIL") {

        var lstDatDetail = p_GetLstHiddenObjectDetail();

        return lstDatDetail.length + 1;
    }
    else if (type == "SUBDETAIL") {
        var datPerId;

        let group = temSubDetail.find(x => x.HeaderIndex === tempHeaderId);

        if (group) {
            datPerId = group.ListItem;
            return datPerId.length + 1;
        }
        else {
            return 1;
        }
    }
    
}

const pInitModal = (type, counter = -1) => {
    if (type == "DETAIL") {
        $("#inputBisProDetailModalLabel").text("Stage Detail Input");
        $("#sequenceInput-modal").val(counter);
        $("#stageInput-modal").val(null).trigger("change");
    }
    if (type == "SUBDETAIL") {
        $("#inputBisProDetailModalLabel").text("Sub Stage Detail Input");
        $("#sequenceInput-modal").val(counter);
        $("#stageInput-modal").val(null).trigger("change");
    }
}

const pInitModalSubDetail = (stageId) => {
    debugger;
    let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('inputBisProSubDetailModal'));
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };

    let lstData = p_GetLstHiddenObjectDetail();

    let lstDataSub = p_GetLstHiddenObjectSubDetail();

    let datSel = lstData.find((item) => item.TxtStageId === stageId);
    tempStageDetailId = stageId;
    tempHeaderId = datSel.DetailIndex;

       

    let group = temSubDetail.find(x => x.HeaderIndex === tempHeaderId);
    let index = temSubDetail.findIndex(x => x.HeaderIndex === tempHeaderId);

    initiateTableSubDetailBisPro();

    if (group) {
        if (group.ListItem.length > 0) {
            p_DataToUISubStage(group.ListItem);
        }
    }

    $("#StageDetailName").html(`<b>Stage Name: </b>${datSel.StageName}`);
    $("#StageDetailId").val(datSel.TxtStageId);

    modal.show();
}

const pCloseModalSubDetail = () => {
    oTableSubStage.destroy();
    $("#tableDetailSubBisPro").empty();

    let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('inputBisProSubDetailModal'));
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };

    $("#StageDetailName").html("");
    $("#StageDetailId").val("");

    modal.hide();
}

const pHideModalSubDetail = () => {
    let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('inputBisProSubDetailModal'));
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };

    modal.hide();
}

const pValidateDataDetail = () => {
    //Getting Data
    let stage = $("#stageInput-modal").find(":selected").val();

    if (stage == null || stage == "") {
        clsGlobal.setMessageWarning("Stage has not been selected!");
        return false;
    }

    return true;
}

const pSaveDataModal = (type) => {
    
    if (type == "DETAIL") {
        let DataDetail = p_GetHiddenObjectDetail();

        //Binding to Model
        let seq = $("#sequenceInput-modal").val();
        let stageId = $("#stageInput-modal").find(":selected").val();
        let stageName = $("#stageInput-modal").find(":selected").text();

        DataDetail.IntSequence = parseInt(seq);
        DataDetail.TxtStageId = stageId;
        DataDetail.BitActive = true;
        DataDetail.StageName = stageName;

        let LstDatDetail = p_GetLstHiddenObjectDetail();
        let isExist = LstDatDetail.some(x => x.StageName === stageName);
        
        if (isExist) {
            clsGlobal.swalWarning("This stage name is already in use. Please enter a different name to continue");
            return false;
        }
        else {
            DataDetail.DetailIndex = LstDatDetail.length;

            LstDatDetail.push(DataDetail);

            //Set to Hidden Object Detail and Render
            p_SetLstHiddenObjectDetail(LstDatDetail);
            pToDataTable(LstDatDetail, type);

            //Close Modal
            pCloseModalInputReset(type);
        }
    }

    if (type == "SUBDETAIL") {
        let LstDatDetail = p_GetLstHiddenObjectDetail();
        let DataSubDetail = p_GetHiddenObjectSubDetail();

        //Binding to Model
        let seq = $("#sequenceInput-modal").val();
        let stageId = $("#stageInput-modal").find(":selected").val();
        let stageName = $("#stageInput-modal").find(":selected").text();

        DataSubDetail.IntSequence = parseInt(seq);
        DataSubDetail.TxtStageId = stageId;
        DataSubDetail.BitActive = true;
        DataSubDetail.StageName = stageName;
        DataSubDetail.TxtDetailId = tempStageDetailId;
        DataSubDetail.DetailIndex = tempHeaderId;

        // Validasi Same Stage Name on SubStage Name
        let isExistStage = LstDatDetail[0].StageName === stageName;
        if (isExistStage) {
            clsGlobal.swalWarning("This stage name is already in use. Please enter a different name to continue");
            return false;
        }
        else {
            // Cari group berdasarkan HeaderIndex / DetailIndex
            let group = temSubDetail.find(x => x.HeaderIndex === tempHeaderId);
            let groupIndex = temSubDetail.findIndex(x => x.HeaderIndex === tempHeaderId);

            if (!group) {
                // Buat grup baru jika belum ada
                group = {
                    HeaderIndex: tempHeaderId,
                    ListItem: [DataSubDetail]
                };
                temSubDetail.push(group);
            }
            else {

                let isExist = temSubDetail[groupIndex].ListItem.some(x => x.StageName === stageName);

                if (isExist) {
                    clsGlobal.swalWarning("This stage name is already in use. Please enter a different name to continue");
                    return false;
                }
                //Update ke Variable
                temSubDetail[groupIndex].ListItem.push(DataSubDetail);
            }

            // Render tabel & reset modal
            pToDataTable(temSubDetail, type);
            pCloseModalInputReset(type);
        }
    }
}

const pToDataTable = (lstData, type) => {
    console.log(lstData);
    if (type == "DETAIL") {
        p_DataToUITask(lstData);
        oTableApproval.page('last').draw(false);
    }
    else if (type == "SUBDETAIL") {
        p_DataToUISubStage(lstData);
        oTableSubStage.page('last').draw(false);
    }
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
    datHeader.MasterBisProDetails = [];

    p_SetHiddenObjectHeader(datHeader);

    //Clear Data Header
    $("#BisProName").val("");
    $("#ProjectType").val(null).trigger("change");
    $("#BitActive").prop("checked", true);

    //Clear Data in Datatable
    oTableApproval.clear();
    oTableApproval.draw();
}

const ValidateHeader = () => {
    
    //Getting Data
    let BisProName = $("#BisProName").val();
    let ProjectTypeName = $("#ProjectType").find(":selected").val();
    let bitActive = $('#BitActive').is(":checked");

    if (BisProName == null || BisProName == "") {
        clsGlobal.setMessageWarning("Business Process must be filled in!");
        return false;
    }
    if (ProjectTypeName == null || ProjectTypeName == "") {
        clsGlobal.setMessageWarning("Project Type must be selected first!");
        return false;
    }
    else if (bitActive == false || bitActive == null) {
        clsGlobal.setMessageWarning("Please check the Active checkbox!");
        return false;
    }

    return true;
}

const ValidateSaveStage = () => {
    
    //Getting Data
    let BisProName = $("#BisProName").val();
    let ProjectTypeName = $("#ProjectType").find(":selected").val();
    let bitActive = $('#BitActive').is(":checked");

    let lstObjDetail = p_GetLstHiddenObjectDetail();

    if (BisProName == null || BisProName == "") {
        clsGlobal.setMessageWarning("Business Process must be filled in!");
        return false;
    }
    else if (ProjectTypeName == null || ProjectTypeName == "") {
        clsGlobal.setMessageWarning("Project Type must be selected first!");
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
    //DeletingRelation
    let lstObjDatDetail = JSON.parse($("#LstHiddenObjectDetail").val());
    let lstObjDatSubDetail = JSON.parse($("#LstHiddenObjectSubDetail").val());

    console.log(typeof (lstObjDatDetail));
    console.log(typeof (lstObjDatSubDetail));

    lstObjDatDetail.forEach((item, index) => {
        item.MasterBisProSubDetails = [];
    });

    lstObjDatSubDetail.forEach((item, index) => {
        item.MasterStageHeader = {};
    });

    $.ajax({
        type: "POST",
        url: "/Master/BisPro/UpdateData",
        headers: {
            'RequestVerificationToken': $('#formBisPro input[name=__RequestVerificationToken]').val()
        },
        data: {
            DataHeader: $("#HiddenObjectHeader").val(),
            DataDetail: JSON.stringify(lstObjDatDetail),
            DataSubDetail: JSON.stringify(lstObjDatSubDetail)
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

                    $("#formInputBisPro").hide();
                    $("#formDatatable").show();

                    //Set TempData to Array Kosong
                    temSubDetail = [];

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

const moveDown = (intIndex, type) => {
    if (type == "DETAIL") {
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
    }
    else if (type == "SUBDETAIL") {
        
        // Ambil grup berdasarkan HeaderIndex
        let groupIndex = temSubDetail.findIndex(x => x.HeaderIndex === tempHeaderId);
        if (groupIndex === -1) return;

        let items = temSubDetail[groupIndex].ListItem;

        // Cari index dari item yang akan dipindah
        let idx = items.findIndex(x => x.intIndex === intIndex);

        if (idx > -1 && idx < items.length - 1) {
            // Tukar posisi
            [items[idx], items[idx + 1]] = [items[idx + 1], items[idx]];

            // Re-index ulang
            items.forEach((item, i) => {
                item.intIndex = i;
                item.IntSequence = i + 1;
            });

            // Update hanya ListItem di grup yang aktif
            temSubDetail[groupIndex].ListItem = items;

            // Render ulang
            pToDataTable(temSubDetail, "SUBDETAIL");
        }
    }
};

const moveUp = (intIndex, type) => {
    if (type == "DETAIL") {
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
    }
    else if (type == "SUBDETAIL") {
        
        let groupIndex = temSubDetail.findIndex(x => x.HeaderIndex === tempHeaderId);
        if (groupIndex === -1) return;

        // Ambil ListItem yang ada di dalam grup tersebut
        let items = temSubDetail[groupIndex].ListItem;

        // Cari index item yang ingin dipindah
        let idx = items.findIndex(x => x.intIndex === intIndex);

        // Cek apakah item bisa dipindahkan ke atas
        if (idx > 0) {
            // Tukar posisi dengan item di atasnya
            [items[idx], items[idx - 1]] = [items[idx - 1], items[idx]];

            // Re-index ulang ListItem
            items.forEach((item, i) => {
                item.intIndex = i;
                item.IntSequence = i + 1;
            });

            // Update ListItem di grup yang aktif
            temSubDetail[groupIndex].ListItem = items;

            // Render ulang
            pToDataTable(temSubDetail, "SUBDETAIL");
        }
    }
};

//=======================
// SUB DETAIL
//=======================
const initiateTableSubDetailBisPro = () => {
    
    if (!$.fn.DataTable.isDataTable('#tableDetailSubBisPro')) {
        oTableSubStage = $("#tableDetailSubBisPro").DataTable({
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
                { title: 'Sequence', name: "IntSequence", width: '100px', className: "center text-nowrap", "targets": [0], orderable: false },
                { title: 'Stage    ', name: "TaskName", width: '200px', className: "text-left text-nowrap", "targets": [1], orderable: false },
                { title: 'Action   ', width: '100px', className: "text-center text-nowrap", "targets": [2], orderable: false },
            ],
            aoColumnDefs: [
                {
                    aTargets: [0],
                    width: "150px",
                    mRender: function (data, type, full) {
                        if (full.intIndex == undefined) {
                            return '';
                        }
                        else {
                            let group = temSubDetail.find(x => x.HeaderIndex === tempHeaderId);

                            let rowCounter;
                            rowCounter = group.ListItem;

                            let totalItems = rowCounter.length;

                            let isFirst = full.intIndex === 0;
                            let isLast = full.intIndex === totalItems - 1;

                            return `
                                    <div style="width: 250px;">
                                        <div class="d-flex flex-row gap-2">
                                            <div style="width: 20px; text-align: center;">
                                                <a href="javascript:void(0)" onclick="moveUp(${full.intIndex}, 'SUBDETAIL')" style="${isFirst ? 'visibility:hidden;' : ''}">
                                                    <i class="fa fa-arrow-up text-success"></i>
                                                </a>
                                            </div>
                                            <div>
                                                <span class="txt-Sequence-val text-center" id="txtSequence${full.intIndex}">
                                                    ${full.IntSequence == null ? '' : full.IntSequence}
                                                </span>
                                            </div>
                                            <div style="width: 20px; text-align: center;">
                                                <a href="javascript:void(0)" onclick="moveDown(${full.intIndex}, 'SUBDETAIL')" style="${isLast ? 'visibility:hidden;' : ''}">
                                                    <i class="fa fa-arrow-down text-success"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                `;
                        }
                    },
                },
                {
                    aTargets: [1],
                    width: "250px",
                    mRender: function (data, type, full) {
                        if (full.intIndex == undefined) {
                            return '';
                        }
                        else {
                            return `<div style="width: 200px;">
                                    <span>${full.StageName == null ? '' : full.StageName}</span>
                                    <input disabled class= "form-control txt-stepNameId-val" type = "hidden" value ="${full.TxtStageId == null ? '' : full.TxtStageId}" id="txtStepNameId${full.intIndex}" />
                                </div>`;
                        }
                    },
                },
                {
                    aTargets: [2],
                    width: "100px",
                    mRender: function (data, type, full, meta) {
                        if (full.intIndex == undefined) {
                            return '';
                        }
                        else {

                            return `<div class="d-flex justify-content-center" style="gap: 0.5rem;">
                                    <div style="padding:0;margin:0">
                                        <button type="button" class="btn btn-danger btn-icon waves-effect waves-float waves-light button-group btnDetailDeleteStage"
                                            id="btnDetailDeleteStage-{{full.intIndex}}"
                                            onclick="p_btnDetailDeleteSubStage_Click(this, '${full.intIndex}')">
                                            <i class="fa fa-trash"></i>
                                        </button>
                                    </div>
                                </div>`;
                        }
                    }
                },
            ]
        });
    }

    $('#tableDetailSubBisPro tbody').on('click', 'tr', function () {
        if (!$(this).hasClass('selected')) {
            oTableApproval.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });
}

const p_RefreshNumberSubDetailStage = () => {
    
    var intRowIndex = 0;

    let group = temSubDetail.find(x => x.HeaderIndex === tempHeaderId);
    let index = temSubDetail.findIndex(x => x.HeaderIndex === tempHeaderId);

    var objData = group;

    objData = objData.ListItem;
    
    oTableSubStage.rows().every(function (rowIdx, tableLoop, rowLoop) {
        var d = this.data();
        
        //console.log(d);
        d.IntSequence = (intRowIndex + 1); // update data source for the row
        objData[intRowIndex].IntSequence = d.IntSequence;
        d.intIndex = intRowIndex;
        objData[intRowIndex].intIndex = intRowIndex;

        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableSubStage.draw(false);
    temSubDetail[index].ListItem = objData;

}

const p_btnDetailDeleteSubStage_Click = (objCaller, intIndex) => {
    // Cari Dari Lokal Variable
    let group = temSubDetail.find(x => x.HeaderIndex === tempHeaderId);
    let index = temSubDetail.findIndex(x => x.HeaderIndex === tempHeaderId);

    var objData = group;

    objData = objData.ListItem;

    var arrIndex = [];
    for (var i = 0; i < objData.length; i++) {
        // Cari Index-nya.
        if (objData[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:

            // Remove from list.
            objData.splice(i, 1);

            oTableSubStage.row(i).remove().draw(false);
            break;
        }
    }

    

    //Update Local Variable
    temSubDetail[index].ListItem = objData;

    p_RefreshNumberSubDetailStage();
}

const p_DataToUISubStage = (lstData) => {
    oTableSubStage.clear();

    // Cari grup berdasarkan tempHeaderId
    let group = temSubDetail.find(x => x.HeaderIndex === tempHeaderId);
    let index = temSubDetail.findIndex(x => x.HeaderIndex === tempHeaderId);
    if (!group) return;

    // Langsung render semua item tanpa filter dan tanpa sort
    group.ListItem.forEach((item, i) => {
        item.intIndex = i;
        oTableSubStage.row.add(item);
    });

    //Saving to LocalVariable
    temSubDetail[index].ListItem = group.ListItem;

    oTableSubStage.draw(false);
}

const p_bindingToObjectGlobal = () => {
    debugger;

    //Getting ObjDataDet
    let objGlobalSubDet = p_GetLstHiddenObjectSubDetail();
    let objData = temSubDetail;

    if (objData.length) {

        //Looping untuk Masukin DataSubDetail
        objData.forEach((item, index) => {
            if (item.ListItem) {
                let objDatDet = item.ListItem;

                if (objDatDet.length) {
                    objDatDet.forEach((item, index) => {
                        objGlobalSubDet.push(objDatDet[index]);
                    })
                }
            }
        });
    }

    p_SetLstHiddenObjectSubDetail(objGlobalSubDet);

    //ReDeclare Object Clean
}

//=======================
// HANDLER
//=======================

$("#btnNew").click(function (e) {
    e.preventDefault();

    isEdit = false;

    $("#ProjectType").removeAttr("disabled");

    $("#formDatatable").hide();
    $("#formInputBisPro").show();
});

$("#btnBack").click(function (e) {
    debugger;
    e.preventDefault();

    isEdit = false;

    $("#formInputBisPro").hide();
    $("#formDatatable").show();

    //Set TempData to Array Kosong
    temSubDetail = [];

    pSetFormDetailClear();
    p_MasterParameter();
});

$("#btnAddStageModal").click(function (e) {
    
    e.preventDefault();

    if (ValidateHeader()) {
        pShowFreshModalInput("DETAIL");
    }
});

$("#btnCloseModal").click(function (e) {
    e.preventDefault();

    if ($(this).val() == "DETAIL") {
        pCloseModalInputReset("DETAIL");
    }
    else if ($(this).val() == "SUBDETAIL") {
        pCloseModalInputReset("SUBDETAIL");
    }
});

$("#btnCloseSubModal").click(function (e) {
    
    e.preventDefault();

    pCloseModalSubDetail();
});

$("#btnSaveModal").click(function (e) {
    
    e.preventDefault();

    var val = pValidateDataDetail();

    if (val) {
        if ($(this).val() == "DETAIL") {
            pSaveDataModal("DETAIL");
        }
        else if ($(this).val() == "SUBDETAIL") {
            pSaveDataModal("SUBDETAIL");
        }
    }
});

$("#btnSaveDataStage").click(function (e) {
    e.preventDefault();

    //Getting Data Header
    var objHeader = p_GetHiddenObjectHeader();

    //Binding Data Header
    let bisProName = $("#BisProName").val();
    let projectType = $("#ProjectType").find(":selected").val();
    let bitActive = $('#BitActive').is(":checked");

    objHeader.TxtBisProName = bisProName;
    objHeader.TxtProjectType = projectType
    objHeader.BitActive = bitActive ? true : false;
    objHeader.MasterBisProDetails = [];

    if (isEdit) {
        objHeader.TxtNewBisProName = bisProName;
    }

    //Set Data Header
    p_SetHiddenObjectHeader(objHeader);

    debugger;
    if (isEdit) {
        p_bindingToObjectGlobal();
        p_UpdateDataStage();
    }
    else if (ValidateSaveStage()) {
        p_bindingToObjectGlobal();
        p_SubmitDataStage();
    }
});

$("#btnAddSubStageModal").click(function (e) {
    e.preventDefault();

    pHideModalSubDetail();

    pShowFreshModalInput("SUBDETAIL", tempStageDetailId);
});
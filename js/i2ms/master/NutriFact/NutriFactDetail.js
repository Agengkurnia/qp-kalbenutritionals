"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var bitLoading = false;
let oTableNutriFact;
let oTableSubStage;
let lovId;
let StepCodeExist;

let nutriFact = [];

let currentSubFactList = null;
let currentParentItem = null;

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    $(".select2").select2({
        width: "100%"
    });

    $(".select2-modal").select2({
        width: "100%",
        dropdownParent: $('#inputNutriFactDetailModal')
    });

    // Inisialisasi tabel utama
    initiateTableDetailBisPro();
});

//=======================
// FUNGSI HELPER BARU
//=======================
function findItemInTreeById(list, itemId) {
    if (!Array.isArray(list)) {
        return null;
    }

    for (const item of list) {
        if (item.Id === itemId) {
            return item;
        }

        // Cari secara rekursif di dalam SubNutriFact
        const foundInChildren = findItemInTreeById(item.SubNutriFact, itemId);
        if (foundInChildren) {
            return foundInChildren;
        }
    }
    return null;
};

function findItemInTreeByName(list, nameToFind) {
    if (!Array.isArray(list)) {
        return null;
    }

    for (const item of list) {
        // 1. Cek item di level ini
        if (item.NutriFactName === nameToFind) {
            return item; // Ditemukan!
        }

        // 2. Jika tidak, cari di anak-anaknya (rekursif)
        const foundInChildren = findItemInTreeByName(item.SubNutriFact, nameToFind);
        if (foundInChildren) {
            return foundInChildren; // Ditemukan di level yang lebih dalam
        }
    }

    return null; // Tidak ditemukan di cabang ini
};

//=======================
// HIDDEN OBJECT (STUBS)
//=======================

function p_GetHiddenObjectHeader() {
    return JSON.parse($("#HiddenObjectHeader").val());
}

function p_SetHiddenObjectHeader(data) {
    return $("#HiddenObjectHeader").val(JSON.stringify(data));
}

function p_GetHiddenObjectDetail() {
    return JSON.parse($("#HiddenObjectDetail").val());
}

//=======================
// FUNGSI TABEL UTAMA
//=======================

function initiateTableDetailBisPro() {
    if (!$.fn.DataTable.isDataTable('#tableDetailBisPro')) {
        oTableNutriFact = $("#tableDetailBisPro").DataTable({
            "paging": true,
            "searching": false,
            "ordering": false,
            "info": false,
            "autoWidth": false,
            "lengthMenu": [[5, 10, 25, 50, -1], ['5', '10', '25', '50', 'All']],
            "iDisplayLength": -1,
            columns: [
                { title: 'Sequence', name: "IntSequence", width: '100px', className: "center text-nowrap", "targets": [0], orderable: false },
                { title: 'NutriFact    ', name: "TaskName", width: '100px', className: "text-left text-nowrap", "targets": [1], orderable: false },
                { title: 'Is Mandatory', name: "TaskName", width: '100px', className: "text-left text-nowrap", "targets": [2], orderable: false },
                { title: 'Action   ', width: '100px', className: "text-center text-nowrap", "targets": [3], orderable: false },
            ],
            aoColumnDefs: [
                {
                    aTargets: [0],
                    width: "150px",
                    mRender: function (data, type, full) {
                        let rowCounter = nutriFact;
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
                                            ${full.Seq == null ? '' : full.Seq}
                                        </span>
                                    </div>
                                    <div style="width: 20px; text-align: center;">
                                        <a href="javascript:void(0)" onclick="moveDown(${full.intIndex}, 'DETAIL')" style="${isLast ? 'visibility:hidden;' : ''}">
                                            <i class="fa fa-arrow-down text-success"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>`;
                    },
                },
                {
                    aTargets: [1],
                    width: "250px",
                    mRender: function (data, type, full) {
                        return `<div style="width: 200px;">
                                <span>${full.NutriFactName == null ? '' : full.NutriFactName}</span>
                                <input disabled class= "form-control txt-stepNameId-val" type = "hidden" value ="${full.Id == null ? '' : full.Id}" id="txtStepNameId${full.intIndex}" />
                            </div>`;
                    },
                },
                {
                    aTargets: [2],
                    width: "250px",
                    mRender: function (data, type, full) {
                        return `<div style="width: 200px;">
                                <span>${full.IsMandatory ? 'True' : 'False'}</span>
                            </div>`;
                    },
                },
                {
                    aTargets: [3],
                    width: "100px",
                    mRender: function (data, type, full, meta) {
                        return `<div class="d-flex justify-content-center" style="gap: 0.5rem;">
                                <div style="padding:0;margin:0">
                                    <button type="button" class="btn btn-info waves-effect waves-float waves-light"
                                        id="btnSubNutriFact-${full.intIndex}"
                                        onclick="pInitModalSubDetail('${full.Id}')">
                                        Sub NutriFact
                                    </button>
                                </div>
                                <div style="padding:0;margin:0">
                                    <button type="button" class="btn btn-warning btn-icon waves-effect waves-float waves-light button-group btnDetailEditStage"
                                        id="btnDetailEditStage-${full.intIndex}"
                                        onclick="p_btnDetailEditStage_Click(this, '${full.Id}')">
                                        <i class="fa fa-edit"></i>
                                    </button>
                                </div>
                                <div style="padding:0;margin:0">
                                    <button type="button" class="btn btn-danger btn-icon waves-effect waves-float waves-light button-group btnDetailDeleteStage"
                                        id="btnDetailDeleteStage-${full.intIndex}"
                                        onclick="p_btnDetailDeleteStage_Click(this, '${full.intIndex}')">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </div>
                            </div>`;
                    }
                },
            ]
        });
    }

    $('#tableDetailBisPro tbody').on('click', 'tr', function () {
        if (!$(this).hasClass('selected')) {
            oTableNutriFact.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });

    oTableNutriFact.draw();
}

function p_RefreshNumberDetailStage() {
    var intRowIndex = 0;
    var objDat = nutriFact; // Langsung pakai nutriFact

    oTableNutriFact.rows().every(function (rowIdx, tableLoop, rowLoop) {
        var d = this.data();

        d.Seq = (intRowIndex + 1);
        objDat[intRowIndex].Seq = d.Seq;
        d.intIndex = intRowIndex;
        objDat[intRowIndex].intIndex = intRowIndex;

        intRowIndex++;
        this.invalidate();
    });

    oTableNutriFact.draw(false);
    nutriFact = objDat;
}

function p_btnDetailDeleteStage_Click(objCaller, intIndex) {
    var objData = nutriFact; // Langsung pakai nutriFact

    for (var i = 0; i < objData.length; i++) {
        if (objData[i].intIndex == intIndex) {
            // Hapus dari array
            objData.splice(i, 1);
            // Hapus dari DataTable
            oTableNutriFact.row(i).remove().draw(false);
            break;
        }
    }

    nutriFact = objData;
    p_RefreshNumberDetailStage();
}

function p_btnDetailEditStage_Click(objCaller, Id) {
    var datDet = nutriFact.find(x => x.Id == Id);

    if (datDet != undefined) {
        pShowFreshModalInput("EDITDETAIL", Id);
    }
    else {
        clsGlobal.setMessageWarning("NutriFact not Found");
    }
}

function p_DataToUITask(lstDataTask) {
    oTableNutriFact.clear();
    if (lstDataTask != null) {
        for (var i = 0; i < lstDataTask.length; i++) {
            lstDataTask[i].intIndex = i;
            oTableNutriFact.row.add(lstDataTask[i]);
        }
    }
    oTableNutriFact.draw(false);
    nutriFact = lstDataTask;
}

//=======================
// MODAL SUB-DETAIL
//=======================

function pInitModalSubDetail(parentId) {
    debugger;
    let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('inputNutriFactSubDetailModal'));
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };

    let parentItem = findItemInTreeById(nutriFact, parentId);

    if (!parentItem) {
        console.error("Kesalahan: Item tidak ditemukan dengan ID:", parentId);
        return;
    }

    if (!Array.isArray(parentItem.SubNutriFact)) {
        parentItem.SubNutriFact = [];
    }

    currentSubFactList = parentItem.SubNutriFact;
    currentParentItem = parentItem;

    initiateTableSubDetailBisPro();

    p_DataToUISubStage(currentSubFactList);

    $("#StageDetailName").html(`<b>Sub NutriFact untuk: </b>${parentItem.NutriFactName}`);
    $("#StageDetailId").val(parentItem.Id);

    modal.show();
}

function pCloseModalSubDetail() {
    if (oTableSubStage) {
        oTableSubStage.destroy();
        $("#tableDetailSubBisPro").empty();
    }

    let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('inputNutriFactSubDetailModal'));
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };

    $("#StageDetailName").html("");
    $("#StageDetailId").val("");

    currentSubFactList = null;
    currentParentItem = null;

    modal.hide();
}

function pHideModalSubDetail() {
    let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('inputNutriFactSubDetailModal'));
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };
    modal.hide();
}


//=======================
// TABEL SUB DETAIL
//=======================

function initiateTableSubDetailBisPro() {
    if (!$.fn.DataTable.isDataTable('#tableDetailSubBisPro')) {
        oTableSubStage = $("#tableDetailSubBisPro").DataTable({
            "paging": true,
            "searching": false,
            "ordering": false,
            "info": false,
            "autoWidth": false,
            "lengthMenu": [[5, 10, 25, 50, -1], ['5', '10', '25', '50', 'All']],
            "iDisplayLength": -1,
            columns: [
                { title: 'Sequence', name: "IntSequence", width: '100px', className: "center text-nowrap", "targets": [0], orderable: false },
                { title: 'NutriFact', name: "TaskName", width: '200px', className: "text-left text-nowrap", "targets": [1], orderable: false },
                { title: 'Is Mandatory', name: "TaskName", width: '200px', className: "text-left text-nowrap", "targets": [2], orderable: false },
                { title: 'Action   ', width: '100px', className: "text-center text-nowrap", "targets": [3], orderable: false },
            ],
            aoColumnDefs: [
                {
                    aTargets: [0],
                    width: "150px",
                    mRender: function (data, type, full) {
                        if (full.intIndex == undefined) return '';

                        let rowCounter = currentSubFactList;
                        if (!rowCounter) return '';

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
                                            ${full.Seq == null ? '' : full.Seq}
                                        </span>
                                    </div>
                                    <div style="width: 20px; text-align: center;">
                                        <a href="javascript:void(0)" onclick="moveDown(${full.intIndex}, 'SUBDETAIL')" style="${isLast ? 'visibility:hidden;' : ''}">
                                            <i class="fa fa-arrow-down text-success"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>`;
                    },
                },
                {
                    aTargets: [1],
                    width: "250px",
                    mRender: function (data, type, full) {
                        if (full.intIndex == undefined) return '';
                        return `<div style="width: 200px;">
                                 <span>${full.NutriFactName == null ? '' : full.NutriFactName}</span>
                                 <input disabled class= "form-control txt-stepNameId-val" type = "hidden" value ="${full.Id == null ? '' : full.Id}" id="txtStepNameId${full.intIndex}" />
                               </div>`;
                    },
                },
                {
                    aTargets: [2],
                    width: "250px",
                    mRender: function (data, type, full) {
                        if (full.intIndex == undefined) return '';
                        return `<div style="width: 200px;">
                                 <span>${full.IsMandatory ? 'True' : 'False'}</span>
                               </div>`;
                    },
                },
                {
                    aTargets: [3],
                    width: "100px",
                    mRender: function (data, type, full, meta) {
                        if (full.intIndex == undefined) return '';

                        return `<div class="d-flex justify-content-center" style="gap: 0.5rem;">
                                <div style="padding:0;margin:0">
                                    <button type="button" class="btn btn-info waves-effect waves-float waves-light"
                                        id="btnSubNutriFact-${full.intIndex}"
                                        onclick="pInitModalSubDetail('${full.Id}')">
                                        Sub NutriFact
                                    </button>
                                </div>
                                <div style="padding:0;margin:0">
                                    <button type="button" class="btn btn-warning btn-icon waves-effect waves-float waves-light button-group"
                                        id="btnDetailEditSubStage-${full.intIndex}"
                                        onclick="p_btnDetailEditSubStage_Click(this, '${full.Id}')">
                                        <i class="fa fa-edit"></i>
                                    </button>
                                </div>
                                <div style="padding:0;margin:0">
                                    <button type="button" class="btn btn-danger btn-icon waves-effect waves-float waves-light button-group"
                                        id="btnDetailDeleteSubStage-${full.intIndex}"
                                        onclick="p_btnDetailDeleteSubStage_Click(this, '${full.intIndex}')">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </div>
                            </div>`;
                    }
                },
            ]
        });
    }

    $('#tableDetailSubBisPro tbody').on('click', 'tr', function () {
        if (!$(this).hasClass('selected')) {
            oTableSubStage.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });
}

function p_RefreshNumberSubDetailStage() {
    var intRowIndex = 0;

    var objData = currentSubFactList;
    if (!objData) return;

    oTableSubStage.rows().every(function (rowIdx, tableLoop, rowLoop) {
        var d = this.data();

        d.Seq = (intRowIndex + 1);
        objData[intRowIndex].Seq = d.Seq;
        d.intIndex = intRowIndex;
        objData[intRowIndex].intIndex = intRowIndex;

        intRowIndex++;
        this.invalidate();
    });

    oTableSubStage.draw(false);
}

function p_btnDetailDeleteSubStage_Click(objCaller, intIndex) {
    var objData = currentSubFactList;
    if (!objData) return;

    for (var i = 0; i < objData.length; i++) {
        // Cari Index-nya.
        if (objData[i].intIndex == intIndex) {
            // Remove from list.
            objData.splice(i, 1);
            // Remove from DataTable.
            oTableSubStage.row(i).remove().draw(false);
            break;
        }
    }

    p_RefreshNumberSubDetailStage();
}

function p_DataToUISubStage(lstData) {
    if (!oTableSubStage) return;
    oTableSubStage.clear();

    if (!lstData) return;

    lstData.forEach((item, i) => {
        item.intIndex = i;
        oTableSubStage.row.add(item);
    });

    oTableSubStage.draw(false);
}

function p_btnDetailEditSubStage_Click(objCaller, Id) {
    debugger;

    let itemToEdit = currentSubFactList.find(x => x.Id === Id);

    if (!itemToEdit) {
        clsGlobal.swalWarning("Item to edit not found in current list.");
        return;
    }

    pHideModalSubDetail();

    pShowFreshModalInput("EDITSUBDETAIL", Id);
}


//=======================
// FUNGSI SIMPAN & MODAL INPUT
//=======================

function pShowFreshModalInput(type, Id = "") {
    let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('inputNutriFactDetailModal'));
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };

    if (type == "DETAIL") {
        let valCounter = pHandleSequence(type);
        pInitModal(type, valCounter);
        modal.show();
        $("#btnCloseModal").val("DETAIL");
        $("#btnSaveModal").val("DETAIL");
    }
    else if (type == "EDITDETAIL") {
        pInitModal(type, -1, Id);
        modal.show();
        $("#btnCloseModal").val("EDITDETAIL");
        $("#btnSaveModal").val("EDITDETAIL");
    }
    else if (type == "SUBDETAIL") {
        let valCounter = pHandleSequence(type);
        pInitModal(type, valCounter);
        modal.show();
        $("#btnCloseModal").val("SUBDETAIL");
        $("#btnSaveModal").val("SUBDETAIL");
    }
    else if (type == "EDITSUBDETAIL") {
        pInitModal(type, -1, Id);
        modal.show();
        $("#btnCloseModal").val("EDITSUBDETAIL");
        $("#btnSaveModal").val("EDITSUBDETAIL");
    }
}

function pCloseModalInputReset(type) {
    let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('inputNutriFactDetailModal'));
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };
    modal.hide();

    if (type == "SUBDETAIL" || type == "EDITSUBDETAIL") {
        let modalSub = bootstrap.Modal.getOrCreateInstance(document.getElementById('inputNutriFactSubDetailModal'));
        $.fn.modal.Constructor.prototype.enforceFocus = function () { };
        modalSub.show();
    }
}

function pHandleSequence(type, stageId = "") {
    if (type == "DETAIL") {
        var lstDatDetail = nutriFact;
        return lstDatDetail.length + 1;
    }
    else if (type == "SUBDETAIL") {
        if (currentSubFactList) {
            return currentSubFactList.length + 1;
        } else {
            return 1;
        }
    }
}

function pInitModal(type, counter = -1, nutrifactId = "") {
    debugger;
    if (type == "DETAIL") {
        $("#inputBisProDetailModalLabel").text("NutriFact Detail Input");
        $("#nutfactName-existId").val("");
        $("#sequenceInput-modal").val(counter);
        $("#stageInput-modal").val(null).trigger("change");
        $("#isMandatory").prop("checked", false);
    }
    else if (type == "EDITDETAIL") {
        var datDet = nutriFact.find(x => x.Id == nutrifactId);
        $("#inputBisProDetailModalLabel").text("NutriFact Detail Edit");
        $("#nutfactName-existId").val(nutrifactId);
        $("#sequenceInput-modal").val(datDet.Seq);
        $("#stageInput-modal").val(datDet.NutriFactName).trigger("change");
        $("#isMandatory").prop("checked", datDet.IsMandatory);
    }
    else if (type == "SUBDETAIL") {
        $("#inputBisProDetailModalLabel").text("Sub NutriFact Detail Input");
        $("#nutfactName-existId").val("");
        $("#sequenceInput-modal").val(counter);
        $("#stageInput-modal").val(null).trigger("change");
        $("#isMandatory").prop("checked", false);
    }
    else if (type == "EDITSUBDETAIL") {
        var datDet = currentSubFactList.find(x => x.Id == nutrifactId);
        $("#inputBisProDetailModalLabel").text("Sub NutriFact Detail Edit");
        $("#nutfactName-existId").val(nutrifactId);
        $("#sequenceInput-modal").val(datDet.Seq);
        $("#stageInput-modal").val(datDet.NutriFactName).trigger("change");
        $("#isMandatory").prop("checked", datDet.IsMandatory);
    }
}

function pValidateDataDetail() {
    let stage = $("#stageInput-modal").find(":selected").val();
    if (stage == null || stage == "") {
        clsGlobal.setMessageWarning("NutriFact has not been selected!");
        return false;
    }
    return true;
}

function pSaveDataModal(type) {

    if (type == "DETAIL") {
        debugger;
        let DataDetail = p_GetHiddenObjectDetail();

        let seq = $("#sequenceInput-modal").val();
        let nutFactName = $("#stageInput-modal").find(":selected").val();
        let isMndtry = $("#isMandatory").is(":checked");

        if (DataDetail.Id == "00000000-0000-0000-0000-000000000000") {
            DataDetail.Id = crypto.randomUUID();
        }

        DataDetail.Seq = parseInt(seq);
        DataDetail.NutriFactName = nutFactName;
        DataDetail.BitActive = true;
        DataDetail.IsMandatory = isMndtry;
        DataDetail.SubNutriFact = [];
        DataDetail.DetailIndex = nutriFact.length;

        let LstDatDetail = nutriFact;
        let isExist = LstDatDetail.some(x => x.NutriFactName === nutFactName);

        if (isExist) {
            clsGlobal.swalWarning("This NutriFact is already in use.");
            return false;
        }
        else {
            LstDatDetail.push(DataDetail);
            pToDataTable(LstDatDetail, type);
            pCloseModalInputReset(type);
        }
    }
    else if (type == "EDITDETAIL") {
        debugger;
        let seq = $("#sequenceInput-modal").val();
        let nutFactName = $("#stageInput-modal").find(":selected").val();
        let isMndtry = $("#isMandatory").is(":checked");
        let Id = $("#nutfactName-existId").val();

        let LstDatDetail = nutriFact;
        let datDetIndx = LstDatDetail.findIndex(x => x.Id == Id);

        if (datDetIndx > -1) {

            if (LstDatDetail[datDetIndx].NutriFactName != nutFactName) {
                let existingItem = findItemInTreeByName(nutriFact, nutFactName);

                if (existingItem && existingItem.Id !== Id) {
                    clsGlobal.swalWarning("This NutriFact is already in use.");
                    return false;
                }
            }

            // Binding Data
            LstDatDetail[datDetIndx].NutriFactName = nutFactName;
            LstDatDetail[datDetIndx].BitActive = true;
            LstDatDetail[datDetIndx].IsMandatory = isMndtry;

            pToDataTable(LstDatDetail, type);
            pCloseModalInputReset(type);
        }
        else {
            clsGlobal.swalWarning("Data Not Found");
            return false;
        }
    }
    else if (type == "SUBDETAIL") {
        let DataSubDetail = p_GetHiddenObjectDetail();

        let seq = $("#sequenceInput-modal").val();
        let nutFactName = $("#stageInput-modal").find(":selected").val();
        let isMndtry = $("#isMandatory").is(":checked");

        if (DataSubDetail.Id == "00000000-0000-0000-0000-000000000000") {
            DataSubDetail.Id = crypto.randomUUID();
        }

        DataSubDetail.IdHeader = currentParentItem.Id;
        DataSubDetail.Seq = parseInt(seq);
        DataSubDetail.NutriFactName = nutFactName;
        DataSubDetail.BitActive = true;
        DataSubDetail.IsMandatory = isMndtry;
        DataSubDetail.SubNutriFact = [];
        DataSubDetail.DetailIndex = currentParentItem.DetailIndex;

        let existingItem = findItemInTreeByName(nutriFact, nutFactName);
        if (existingItem) {
            clsGlobal.swalWarning("This NutriFact name is already in use.");
            return false;
        }

        currentSubFactList.push(DataSubDetail);

        pToDataTable(currentSubFactList, type);
        pCloseModalInputReset(type);
    }
    else if (type == "EDITSUBDETAIL") {

        let nutFactName = $("#stageInput-modal").find(":selected").val();
        let isMndtry = $("#isMandatory").is(":checked");
        let Id = $("#nutfactName-existId").val();

        let LstDatSubDetail = currentSubFactList;
        let datDetIndx = LstDatSubDetail.findIndex(x => x.Id == Id);

        if (datDetIndx > -1) {
            if (LstDatSubDetail[datDetIndx].NutriFactName != nutFactName) {

                let existingItem = findItemInTreeByName(nutriFact, nutFactName);

                if (existingItem && existingItem.Id !== Id) {
                    clsGlobal.swalWarning("This NutriFact name is already in use.");
                    return false;
                }
            }

            LstDatSubDetail[datDetIndx].NutriFactName = nutFactName;
            LstDatSubDetail[datDetIndx].BitActive = true;
            LstDatSubDetail[datDetIndx].IsMandatory = isMndtry;

            pToDataTable(LstDatSubDetail, "SUBDETAIL");
            pCloseModalInputReset(type);
        }
        else {
            clsGlobal.swalWarning("Data Not Found in current sub-list");
            return false;
        }
    }
}

function pToDataTable(lstData, type) {
    console.log("Data changed:", lstData);
    if (type == "DETAIL" || type == "EDITDETAIL") {
        p_DataToUITask(lstData);
        oTableNutriFact.page('last').draw(false);
    }
    else if (type == "SUBDETAIL") {
        p_DataToUISubStage(lstData);
        if (oTableSubStage) oTableSubStage.page('last').draw(false);
    }
}

//=======================
// FUNGSI KIRIM KE SERVER
//=======================

function p_SubmitDataStage() {
    var dat = pMappingData();
    $.ajax({
        type: "POST",
        url: "/Master/NutriFact/SaveData",
        data: {
            DataHeader: dat,
            __RequestVerificationToken: $('#formNutriFact input[name=__RequestVerificationToken]').val()
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
                    $("#formInputNutriFact").hide();
                    $("#formDatatable").show();

                    pSetFormDetailClear();
                    p_MasterParameter();
                }
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}

function p_UpdateDataStage() {
    var dat = pMappingData();
    $.ajax({
        type: "POST",
        url: "/Master/NutriFact/UpdateData",
        headers: {
            'RequestVerificationToken': $('#formNutriFact input[name=__RequestVerificationToken]').val()
        },
        data: {
            DataHeader: dat,
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
                    $("#formInputNutriFact").hide();
                    $("#formDatatable").show();

                    pSetFormDetailClear();
                    p_MasterParameter();
                }
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}

function pSetFormDetailClear() {
    let datHeader = p_GetHiddenObjectHeader();

    nutriFact = [];

    pToDataTable([], "DETAIL");

    datHeader.Id = 0;
    datHeader.NutriFactId = "00000000-0000-0000-0000-000000000000";
    datHeader.NutriFact = "[]";
    p_SetHiddenObjectHeader(datHeader);

    $("#TemplateCode").val("");
    $("#TemplateName").val("");
    $("#TemplateCode").attr("disabled", false);
    $("#BitActive").prop("checked", true);
}

function pMappingData() {
    var objHeader = p_GetHiddenObjectHeader();

    let templateCode = $("#TemplateCode").val();
    let templateName = $("#TemplateName").val();
    let bitActive = $('#BitActive').is(":checked");

    objHeader.TemplateCode = templateCode;
    objHeader.TemplateName = templateName;
    objHeader.BitActive = bitActive ? true : false;
    objHeader.NutriFact = JSON.stringify(nutriFact);

    if (isEdit) {
        objHeader.TemplateNameNew = templateName;
    }

    return JSON.stringify(objHeader);
}

//=======================
// FUNGSI MOVE UP / DOWN
//=======================

function moveDown(intIndex, type) {
    if (type == "DETAIL") {
        let objData = nutriFact;
        let idx = objData.findIndex(x => x.intIndex === intIndex);

        if (idx > -1 && idx < objData.length - 1) {
            // Tukar dengan elemen di bawahnya
            [objData[idx], objData[idx + 1]] = [objData[idx + 1], objData[idx]];
        }

        // Perbarui semua intIndex dan Seq
        objData.forEach((item, index) => {
            item.intIndex = index;
            item.Seq = (index + 1);
        });

        nutriFact = objData;
        oTableNutriFact.clear().rows.add(objData).draw(false);
    }
    else if (type == "SUBDETAIL") {

        let items = currentSubFactList;
        if (!items) return;

        let idx = items.findIndex(x => x.intIndex === intIndex);

        if (idx > -1 && idx < items.length - 1) {
            [items[idx], items[idx + 1]] = [items[idx + 1], items[idx]];

            items.forEach((item, i) => {
                item.intIndex = i;
                item.Seq = i + 1;
            });

            p_DataToUISubStage(items);
        }
    }
};

function moveUp(intIndex, type) {
    if (type == "DETAIL") {
        let objData = nutriFact; // Langsung pakai nutriFact
        let idx = objData.findIndex(x => x.intIndex === intIndex);

        if (idx > 0) {
            // Tukar dengan elemen di atasnya
            [objData[idx], objData[idx - 1]] = [objData[idx - 1], objData[idx]];
        }

        // Perbarui semua intIndex dan Seq
        objData.forEach((item, index) => {
            item.intIndex = index;
            item.Seq = (index + 1);
        });

        nutriFact = objData; // Simpan
        oTableNutriFact.clear().rows.add(objData).draw(false);
    }
    else if (type == "SUBDETAIL") {
        let items = currentSubFactList;
        if (!items) return;

        let idx = items.findIndex(x => x.intIndex === intIndex);

        if (idx > 0) {
            [items[idx], items[idx - 1]] = [items[idx - 1], items[idx]];

            items.forEach((item, i) => {
                item.intIndex = i;
                item.Seq = i + 1;
            });

            p_DataToUISubStage(items);
        }
    }
};


//=======================
// VALIDASI (Tidak Berubah)
//=======================
function ValidateHeader() {
    let TemplateCode = $("#TemplateCode").val();
    let TemplateName = $("#TemplateName").val();
    let bitActive = $('#BitActive').is(":checked");

    if (TemplateCode == null || TemplateCode == "") {
        clsGlobal.setMessageWarning("Template Code must be filled in!");
        return false;
    }
    if (TemplateName == null || TemplateName == "") {
        clsGlobal.setMessageWarning("Template Name must be selected first!");
        return false;
    }
    else if (bitActive == null) {
        clsGlobal.setMessageWarning("Please check the Active checkbox!");
        return false;
    }
    return true;
}

//=======================
// HANDLER (Event Listeners)
//=======================

$("#btnNew").click(function (e) {
    e.preventDefault();
    isEdit = false;
    $("#formDatatable").hide();
    $("#formInputNutriFact").show();
});

$("#btnBack").click(function (e) {
    debugger;
    e.preventDefault();
    isEdit = false;
    $("#formInputNutriFact").hide();
    $("#formDatatable").show();

    pSetFormDetailClear();
    p_MasterParameter();
});

$("#btnAddNutFactModal").click(function (e) {
    e.preventDefault();
    pShowFreshModalInput("DETAIL");
});

$("#btnCloseModal").click(function (e) {
    e.preventDefault();
    pCloseModalInputReset($(this).val());
});

$("#btnCloseSubModal").click(function (e) {
    e.preventDefault();
    pCloseModalSubDetail();
});

$("#btnSaveModal").click(function (e) {
    e.preventDefault();
    var val = pValidateDataDetail();
    if (val) {
        pSaveDataModal($(this).val());
    }
});

$("#btnSaveDataStage").click(function (e) {
    e.preventDefault();

    debugger;

    if (ValidateHeader()) {
        if (isEdit) {
            p_UpdateDataStage();
        }
        else {
            p_SubmitDataStage();
        }
    }
    else {
        return;
    }

});

$("#btnAddSubStageModal").click(function (e) {
    e.preventDefault();


    pHideModalSubDetail();

    pShowFreshModalInput("SUBDETAIL");
});
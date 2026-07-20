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
let datDetailCopy = {};

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

    $("#docDetail-modal").select2({
        width: "100%",
        dropdownParent: $('#ShowCopyKardarModal')
    })

    // Inisialisasi tabel utama
    initiateTableDetailBisPro();

    $("#paramterName-modal").on("select2:select", function (e) {
        e.preventDefault();
        let curvalItemBthpHeader = this.value;

        BindingDataChangeParam(curvalItemBthpHeader);
    });
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
            scrollX: true,
            "autoWidth": false,
            "lengthMenu": [[5, 10, 25, 50, -1], ['5', '10', '25', '50', 'All']],
            "iDisplayLength": -1,
            columns: [
                { title: 'Sequence', name: "IntSequence", width: '100px', className: "text-center text-nowrap", "targets": [0], orderable: false },
                { title: 'Parameter', name: "Parameter", width: '100px', className: "text-center text-nowrap", "targets": [1], orderable: false },
                { title: 'UOM BPOM', name: "SatuanBPOM", width: '100px', className: "text-center text-nowrap", "targets": [2], orderable: false },
                { title: 'UOM System   ', name: "SatuanSystem", width: '100px', className: "text-center text-nowrap", "targets": [3], orderable: false },
                { title: 'Min', name: "NilaiMin", width: '100px', className: "text-center text-nowrap", "targets": [4], orderable: false },
                { title: 'Max', name: "NilaiMax", width: '100px', className: "text-center text-nowrap", "targets": [5], orderable: false },
                { title: 'Target', name: "NilaiTarget", width: '100px', className: "text-center text-nowrap", "targets": [6], orderable: false },
                { title: 'Is Active', name: "BitActive", width: '100px', className: "text-center text-nowrap", "targets": [7], orderable: false },
                { title: 'Action', name: "Action", width: '100px', className: "text-center text-nowrap", "targets": [8], orderable: false },
            ],
            aoColumnDefs: [
                {
                    aTargets: [0],
                    width: "50px",
                    mRender: function (data, type, full) {
                        let rowCounter = nutriFact;
                        let totalItems = rowCounter.length;
                        let isFirst = full.intIndex === 0;
                        let isLast = full.intIndex === totalItems - 1;

                        return `
                            <div style="width: 50px;">
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
                    width: "200px",
                    mRender: function (data, type, full) {
                        return `<div style="width: 200px;">
                                <span class="text-wrap">${full.Parameter == null ? '' : full.Parameter}</span>
                                <input disabled class= "form-control txt-stepNameId-val" type = "hidden" value ="${full.Id == null ? '' : full.Id}" id="txtStepNameId${full.intIndex}" />
                            </div>`;
                    },
                },
                {
                    aTargets: [2],
                    width: "50px",
                    mRender: function (data, type, full) {
                        return `<div style="width: 50px;">
                                <span>${full.SatuanBPOM == null ? '' : full.SatuanBPOM}</span>
                            </div>`;
                    },
                },
                {
                    aTargets: [3],
                    width: "50px",
                    mRender: function (data, type, full) {
                        return `<div style="width: 50px;">
                                <span>${full.SatuanSystem == null ? '' : full.SatuanSystem}</span>
                            </div>`;
                    },
                },
                {
                    aTargets: [4],
                    width: "50px",
                    mRender: function (data, type, full) {
                        return `<div style="width: 50px;">
                                <span class="text-center">${full.NilaiMin == null ? '' : full.NilaiMin}</span>
                            </div>`;
                    },
                },
                {
                    aTargets: [5],
                    width: "50px",
                    mRender: function (data, type, full) {
                        return `<div style="width: 50px;">
                                <span class="text-center">${full.NilaiMax == null ? '' : full.NilaiMax}</span>
                            </div>`;
                    },
                },
                {
                    aTargets: [6],
                    width: "50px",
                    mRender: function (data, type, full) {
                        return `<div style="width: 50px;">
                                <span class="text-center">${full.NilaiTarget == null ? '' : full.NilaiTarget}</span>
                            </div>`;
                    },
                },
                {
                    aTargets: [7],
                    width: "50px",
                    mRender: function (data, type, full) {
                        return `<div style="width: 50px;">
                                <span>${full.BitActive == null ? '' : full.BitActive ? '<i class="fas fa-check" style="color: green;"></i>' : '<i class="fas fa-times" style="color: red;"></i>'}</span>
                            </div>`;
                    },
                },
                {
                    aTargets: [8],
                    width: "100px",
                    mRender: function (data, type, full, meta) {
                        console.log(full);
                        return `<div class="d-flex justify-content-center" style="gap: 0.5rem;">
                                <div style="padding:0;margin:0">
                                    <button type="button" class="btn btn-warning btn-icon waves-effect waves-float waves-light button-group btnDetailEditStage"
                                        id="btnDetailEditStage-${full.intIndex}"
                                        onclick="p_btnDetailEditStage_Click(this, '${full.KarDarDetailId}')">
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
    var datDet = nutriFact.find(x => x.KarDarDetailId == Id);
    debugger;
    if (datDet != undefined) {
        pShowFreshModalInput("EDITDETAIL", Id);
    }
    else {
        clsGlobal.setMessageWarning("Parameter not Found");
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
}

function pCloseModalInputReset(type) {
    let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('inputNutriFactDetailModal'));
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };
    modal.hide();

    //if (type == "SUBDETAIL" || type == "EDITSUBDETAIL") {
    //    let modalSub = bootstrap.Modal.getOrCreateInstance(document.getElementById('inputNutriFactSubDetailModal'));
    //    $.fn.modal.Constructor.prototype.enforceFocus = function () { };
    //    modalSub.show();
    //}
}

function pHandleSequence(type, stageId = "") {
    if (type == "DETAIL") {
        var lstDatDetail = nutriFact;
        return lstDatDetail.length + 1;
    }
}

function pInitModal(type, counter = -1, nutrifactId = "") {
    debugger;
    if (type == "DETAIL") {
        $("#inputBisProDetailModalLabel").text("KarDar Detail Input");
        $("#nutfactName-existId").val("");
        $("#sequenceInput-modal").val(counter);
        $("#paramterName-modal").val(null).trigger("change");
        $("#uomBPOM-modal").val("");
        $("#uomSystem-modal").val("");
        $("#min-modal").val("");
        $("#max-modal").val("");
        $("#target-modal").val("");
        $("#remarks-modal").val("");
        $("#isActive-modal").prop("checked", true);
    }
    else if (type == "EDITDETAIL") {
        var datDet = nutriFact.find(x => x.KarDarDetailId == nutrifactId);
        $("#inputBisProDetailModalLabel").text("KarDar Detail Edit");
        $("#nutfactName-existId").val(nutrifactId);
        $("#sequenceInput-modal").val(datDet.Seq);
        $("#paramterName-modal").val(datDet.Parameter).trigger("change");
        $("#uomBPOM-modal").val(datDet.SatuanBPOM);
        $("#uomSystem-modal").val(datDet.SatuanSystem);
        $("#min-modal").val(datDet.NilaiMin);
        $("#max-modal").val(datDet.NilaiMax);
        $("#target-modal").val(datDet.NilaiTarget);
        $("#remarks-modal").val(datDet.Remarks);
        $("#isActive-modal").prop("checked", datDet.BitActive);
    }
}

function pValidateDataDetail() {
    let param = $("#paramterName-modal").find(":selected").val();
    let uomBPOM = $("#uomBPOM-modal").val();
    let uomSystem = $("#uomSystem-modal").val();
    let min = $("#min-modal").val();
    let max = $("#max-modal").val();
    let target = $("#target-modal").val();

    if (!param) {
        clsGlobal.setMessageWarning("Mohon pilih Nama Parameter terlebih dahulu.");
        return false;
    }
    else if (!uomBPOM) {
        clsGlobal.setMessageWarning("UOM BPOM tidak boleh kosong, ya.");
        return false;
    }
    else if (!uomSystem) {
        clsGlobal.setMessageWarning("Silakan isi UOM Sistem.");
        return false;
    }
    else if (!min) {
        clsGlobal.setMessageWarning("Nilai Minimum (Min) wajib diisi.");
        return false;
    }
    else if (!max) {
        clsGlobal.setMessageWarning("Nilai Maksimum (Max) wajib diisi.");
        return false;
    }
    else if (parseFloat(min) > parseFloat(max)) {
        clsGlobal.setMessageWarning("Nilai Min tidak boleh lebih besar dari nilai Max.");
        return false;
    }

    return true;
}

function pSaveDataModal(type) {

    if (type == "DETAIL") {
        debugger;
        let DataDetail = p_GetHiddenObjectDetail();

        let seq = $("#sequenceInput-modal").val();
        let param = $("#paramterName-modal").find(":selected").val();
        let uomBPOM = $("#uomBPOM-modal").val();
        let uomSystem = $("#uomSystem-modal").val();
        let min = $("#min-modal").val();
        let max = $("#max-modal").val();
        let target = $("#target-modal").val();
        let remarks = $("#remarks-modal").val();
        let isActive = $("#isActive-modal").is(":checked");

        if (DataDetail.KarDarDetailId == "00000000-0000-0000-0000-000000000000") {
            DataDetail.KarDarDetailId = crypto.randomUUID();
        }

        DataDetail.Seq = parseInt(seq);
        DataDetail.Parameter = param;
        DataDetail.SatuanBPOM = uomBPOM;
        DataDetail.SatuanSystem = uomSystem;
        DataDetail.NilaiMin = min;
        DataDetail.NilaiMax = max;
        DataDetail.NilaiTarget = target;
        DataDetail.Remarks = remarks;
        DataDetail.BitActive = isActive;
        DataDetail.DetailIndex = nutriFact.length;

        let LstDatDetail = nutriFact;
        let isExist = LstDatDetail.some(x => x.Parameter === param);

        if (isExist) {
            clsGlobal.swalWarning("This Paramater is already in use.");
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

        let param = $("#paramterName-modal").find(":selected").val();
        let uomBPOM = $("#uomBPOM-modal").val();
        let uomSystem = $("#uomSystem-modal").val();
        let min = $("#min-modal").val();
        let max = $("#max-modal").val();
        let target = $("#target-modal").val();
        let remarks = $("#remarks-modal").val();
        let isActive = $("#isActive-modal").is(":checked");
        let Id = $("#nutfactName-existId").val();

        let LstDatDetail = nutriFact;
        let datDetIndx = LstDatDetail.findIndex(x => x.KarDarDetailId == Id);

        if (datDetIndx > -1) {

            if (LstDatDetail[datDetIndx].Parameter != param) {
                let existingItem = findItemInTreeByName(nutriFact, nutFactName);

                if (existingItem && existingItem.Id !== Id) {
                    clsGlobal.swalWarning("This Parameter is already in use.");
                    return false;
                }
            }

            // Binding Data
            LstDatDetail[datDetIndx].Parameter = param;
            LstDatDetail[datDetIndx].SatuanBPOM = uomBPOM;
            LstDatDetail[datDetIndx].SatuanSystem = uomSystem;
            LstDatDetail[datDetIndx].NilaiMin = min;
            LstDatDetail[datDetIndx].NilaiMax = max;
            LstDatDetail[datDetIndx].NilaiTarget = target;
            LstDatDetail[datDetIndx].Remarks = remarks;
            LstDatDetail[datDetIndx].BitActive = isActive;

            pToDataTable(LstDatDetail, type);
            pCloseModalInputReset(type);
        }
        else {
            clsGlobal.swalWarning("Data Not Found");
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

function BindingDataChangeParam(ParamName) {
    let lstDataParam = JSON.parse($("#HiddenObjectParam").val());

    let datDetParam = lstDataParam.find(x => x.ParameterName.toLowerCase() == ParamName.toLowerCase());

    if (datDetParam == undefined) {

        clsGlobal.swalWarning("Data Parameter Kosong");

        return false;
    }

    $("#uomSystem-modal").val(datDetParam.UnitCode);
}

//=======================
// FUNGSI KIRIM KE SERVER
//=======================

function p_SubmitDataStage() {
    var dat = pMappingData();
    $.ajax({
        type: "POST",
        url: "/Master/KarDar/SaveData",
        data: {
            DataHeader: dat,
            __RequestVerificationToken: $('#formKardar input[name=__RequestVerificationToken]').val()
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
                    $("#formInputKarDar").hide();
                    $("#formDatatable").show();

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
        url: "/Master/KarDar/UpdateData",
        headers: {
            'RequestVerificationToken': $('#formInputKarDar input[name=__RequestVerificationToken]').val()
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
                    $("#formInputKarDar").hide();
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
    datHeader.KarDarId = "00000000-0000-0000-0000-000000000000";
    datHeader.DocMasterNo = "00000000-0000-0000-0000-000000000000";
    datHeader.AlgGroup = "";
    datHeader.KategoriPangan = "";
    datHeader.BitActive = true;
    datHeader.KarDarDetail = "[]";
    p_SetHiddenObjectHeader(datHeader);

    $("#DocMasterNo").val(null);
    $("#AlgKelUsia").val(null).trigger("change");
    $("#CatPangan").val(null).trigger("change");
    $("#AlgKelUsia").attr("disabled", false);
    $("#CatPangan").attr("disabled", false);
    $("#BitActive").prop("checked", true);
}

function pMappingData() {
    var objHeader = p_GetHiddenObjectHeader();

    let templateCode = $("#AlgKelUsia").find(":selected").val();
    let templateName = $("#CatPangan").find(":selected").val();
    let templateDocNo = $("#DocMasterNo").val();
    let bitActive = $('#BitActive').is(":checked");

    objHeader.AlgGroup = templateCode;
    objHeader.KategoriPangan = templateName;
    objHeader.DocMasterNo = templateDocNo;
    objHeader.BitActive = bitActive ? true : false;
    objHeader.KarDarDetail = JSON.stringify(nutriFact);

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
    let TemplateCode = $("#AlgKelUsia").find(":selected").val();
    let TemplateName = $("#CatPangan").find(":selected").val();
    let bitActive = $('#BitActive').is(":checked");

    if (TemplateCode == null || TemplateCode == "") {
        clsGlobal.setMessageWarning("ALG (Kelompok Usia) must be selected!");
        return false;
    }
    if (TemplateName == null || TemplateName == "") {
        clsGlobal.setMessageWarning("Kategori Pangan must be selected!");
        return false;
    }
    else if (bitActive == null) {
        clsGlobal.setMessageWarning("Please check the Active checkbox!");
        return false;
    }
    else if (nutriFact.length == 0) {
        clsGlobal.setMessageWarning("Please Input Parameter");
        return false;
    }

    return true;
}

function GettingDataDoc() {
    $.ajax({
        type: "POST",
        url: "/Master/KarDar/GetDataDoc",
        data: {
            __RequestVerificationToken: $('#formKardar input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat, status, xhr) {
            dontBlock = false;
            if (xhr.responseText.includes("!DOCTYPE html")) {
                clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
            }
            else {
                if (retDat.bitSuccess == true) {

                    MappingDataShowPopUp(retDat.objData);
                }
                else {
                    if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                        clsGlobal.swalWarning(retDat.objData);
                    }
                    else {
                        clsGlobal.swalError(retDat.txtMessage);
                    }
                }
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}

function MappingDataShowPopUp(items) {

    var $select = $('#docDetail-modal');

    $select.empty();

    $select.append('<option value="" disabled selected>Select</option>');

    $.each(items, function (i, item) {
        $select.append($('<option>', {
            value: item.txtCode,
            text: item.txtDescription
        }));
    });

    $select.trigger('change');

    $("#ShowCopyKardarModal").modal("toggle");
}

const p_initOrUpdateTable = (lstData, algGroup = "", catPangan = "") => {
    const tableId = '#tableCopyKardar';
    debugger;
    if ($.fn.DataTable.isDataTable(tableId)) {

        //const AlgGroup = document.getElementById('AlgCpyID');
        //AlgGroup.textContent = `ALG Group: ${algGroup}`;

        //const CatPangan = document.getElementById('CatCpyID');
        //CatPangan.textContent = `Cat Pangan: ${catPangan}`;

        const table = $(tableId).DataTable();
        table.clear().rows.add(lstData).draw();
        table.columns.adjust();
        return;
    }

    const modalBody = document.getElementById('modalShowCopyKardarBody');
    modalBody.innerHTML = '';

    //const AlgGroup = document.createElement('span');
    //const CatPangan = document.createElement('span');

    //AlgGroup.id = "AlgCpyID";
    //CatPangan.id = "CatCpyID";

    //AlgGroup.textContent = `ALG Group: ${algGroup}`;
    //CatPangan.textContent = `Cat Pangan: ${catPangan}`;
    //modalBody.appendChild(AlgGroup);
    //modalBody.appendChild(CatPangan);

    const table = document.createElement('table');
    table.id = 'tableCopyKardar';
    table.className = 'table table-hover display nowrap';
    table.style.width = '100%';
    modalBody.appendChild(table);

    $(table).DataTable({
        data: lstData,
        columns: [
            {
                data: 'Parameter', title: 'Parameter Name', render: function (data) {
                    return `<div style="width: 200px;">
                                <span class="text-wrap">${data == null ? '' : data}</span>
                            </div>`
                }
            },
            { data: 'SatuanBPOM', title: 'Satuan BPOM', orderable: false },
            { data: 'SatuanSystem', title: 'Satuan System', orderable: false },
            {
                data: 'BitActive', title: 'Is Active', orderable: false,
                render: function (data) { return data ? "True" : "False" }
            }
        ],
        scrollX: true,
        scrollY: '40vh',
        scrollCollapse: true,
        processing: true,
        paging: false,
        info: false,
        searching: false,
        language: {
            emptyTable: '<div class="text-center p-3"><i class="fas fa-spinner fa-spin"></i> Fetching data...</div>',
            zeroRecords: 'Data Tidak Ada'
        },
        createdRow: function (row, data, dataIndex) {
            if (data.BitActive === false) {
                $(row).css('color', 'red');
                $(row).css('font-weight', 'bold');
            }
        }
    });
};

const p_ShowCopyTable = (HeaderId) => {
    dontBlock = true;

    p_initOrUpdateTable([], "", "");

    $.ajax({
        type: "POST",
        url: "/Master/Kardar/GetDataBisProById",
        async: true,
        data: {
            Id: HeaderId,
            __RequestVerificationToken: $('#FormKardar input[name=__RequestVerificationToken]').val()
        },
        beforeSend: function (request) {
            return request;
        },
        datatype: "json",
        success: function (retDat, status, xhr) {
            dontBlock = false;
            if (xhr.responseText.includes("!DOCTYPE html")) {
                clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
            }
            else {
                if (retDat.bitSuccess == true) {
                    const capitalizedObject = capitalizeKeysDeep(retDat.objData);
                    console.log(capitalizedObject);
                    p_initOrUpdateTable(JSON.parse(capitalizedObject.KarDarDetail), capitalizedObject.AlgGroupDesc, capitalizedObject.KategoriPanganDesc);
                    datDetailCopy = capitalizedObject;
                }
                else {
                    if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                        clsGlobal.swalWarning(retDat.txtMessage);
                    }
                    else {
                        clsGlobal.swalError(retDat.txtMessage);
                    }
                }
            }
        },
        error: function (xhr, status, error) {
            dontBlock = false;
            clsGlobal.swalError(xhr.responseText);
        }
    });

}
//=======================
// HELPER
//=======================

var Helper = {
    RemoveElementFromArray: function (value, arr) {
        arr = arr.filter(item => item !== value);
    },
    IsElementExistsInArray: function (value, arr) {
        var isExist = false;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == value) {
                isExist = true;
                break;
            }
        }
        return isExist;
    },
    setRadioValue: function (name, value) {
        document.querySelectorAll(`input[type="radio"][name="${name}"]`).forEach(rb => {
            rb.checked = (rb.value === value);
        })
    },
    OnlyNumberRegex: function (event, id = "") {
        const numericRegex = /^[0-9.]$/;
        const inputValue = event.key;

        if (!numericRegex.test(inputValue)) {
            event.preventDefault();
        }

        //if (id != "") {
        //    let val = $(`#${id}`).val();
        //    console.log($(`#${id}`));
        //    let text = $(`#${id}`).text();
        //    let lstVal = val.split("");
        //    lstVal.push(inputValue);

        //    //debugger;
        //    let cntTtk = lstVal.filter(x => x === '.');
        //    let indxTtk = lstVal.indexOf('.');

        //    if ((lstVal.length > 2 && cntTtk.length == 0)) {
        //        event.preventDefault();
        //    }
        //    else if (lstVal.length > 2 && indxTtk > 2) {
        //        event.preventDefault();
        //    }
        //    else if (lstVal.length == 1 && cntTtk.length == 1) {
        //        lstVal.unshift("0");
        //        $(`#${id}`).val(lstVal.join(""));
        //        event.preventDefault();
        //    }
        //    else if (cntTtk.length > 1) {
        //        event.preventDefault();
        //    }
        //}
    },
    AllNumericFormat: function (event, id, type = "") {
        let val = $(`#${id}`).val();
        ////debugger;
        if (val != "") {
            ////debugger;
            let fltrTtk = val.split("").filter(x => x === ".");

            if (fltrTtk.length > 1) {
                $(`#${id}`).val(null);
                return clsGlobal.setMessageWarning("Please Input Valid Format, only input one dot (.)");
            }

            if (type == 'Currency') {
                let formatedVal = numeral(val).format(',.00');
                $(`#${id}`).val(formatedVal);
            }
            else if (type == 'Percent') {
                if (parseFloat(val) > 100) {
                    $(`#${id}`).val(null);
                    return clsGlobal.setMessageWarning("Value COGS must be in range of 1 - 100");
                }

                let formatedVal = numeral(val).format(',.00');
                $(`#${id}`).val(formatedVal);
            }
            else if (type == 'CustomFiveDigit') {
                if (parseFloat(val) >= 1000000) {
                    $(`#${id}`).val(null);

                    return clsGlobal.setMessageWarning(`Value ${$(`#${id}`).attr('name')} must be in range of 1 - 999999.99`);
                }
                let formatedVal = numeral(val).format(',.00');
                $(`#${id}`).val(formatedVal);
            }
            else if (type == 'CustomTwoDigit') {
                if (parseFloat(val) >= 100) {
                    $(`#${id}`).val(null);
                    return clsGlobal.setMessageWarning(`Value ${$(`#${id}`).attr('name')} must be in range of 1 - 99.99`);
                }
                let formatedVal = numeral(val).format(',.00');
                $(`#${id}`).val(formatedVal);
            }
            else {
                $(`#${id}`).val(val);
            }
        }
        else {
            $(`#${id}`).val(val);
        }
    },
    RenderImage: function (url, containerElement) {
        const img = $('<img>').attr('src', url).css('max-width', '100%');
        $(containerElement).append(img);
    },
    RenderDocx: function (source, containerElement) {
        // Tampilkan pesan loading
        $(containerElement).html('<p class="text-center p-5">Memuat pratinjau...</p>');

        /**
         * Helper function internal untuk menjalankan render
         * Menerima data sebagai Blob atau ArrayBuffer
         */
        const render = (data) => {
            $(containerElement).empty(); // Kosongkan pesan loading

            // docx.renderAsync mengembalikan promise, jadi kita tangkap errornya
            docx.renderAsync(data, containerElement)
                .catch(err => {
                    console.error('Error during docx.renderAsync:', err);
                    $(containerElement).html(`<p class="text-danger">Gagal merender file Docx.</p>`);
                });
        };

        // --- LOGIKA UTAMA ---
        if (typeof source === 'string') {
            // KASUS 1: 'source' adalah URL, kita perlu fetch
            fetch(source)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.blob(); // Dapatkan sebagai blob
                })
                .then(blob => {
                    render(blob); // Kirim blob ke helper render
                })
                .catch(err => {
                    console.error('Error fetching/rendering DOCX:', err);
                    $(containerElement).html(`<p class="text-danger">Gagal memuat pratinjau. Pastikan file valid dan URL bisa diakses.</p>`);
                });

        } else if (source instanceof Blob || source instanceof ArrayBuffer) {
            // KASUS 2: 'source' sudah berupa data (dari file input)
            try {
                render(source); // Langsung render
            } catch (err) {
                console.error('Error rendering local DOCX:', err);
                $(containerElement).html(`<p class="text-danger">Gagal merender file Docx lokal.</p>`);
            }

        } else {
            // KASUS 3: Tipe data tidak dikenal
            console.error('Invalid source type for RenderDocx:', source);
            $(containerElement).html(`<p class="text-danger">Sumber data pratinjau tidak dikenali.</p>`);
        }
    },
    RenderXlsx: function (source, containerElement) {
        // Tampilkan pesan loading
        $(containerElement).html('<p class="text-center p-5">Memuat pratinjau Excel...</p>');

        /**
         * Helper function internal untuk menjalankan render
         * Menerima data HANYA sebagai ArrayBuffer
         */
        const render = (arrayBufferData) => {
            try {
                const workbook = XLSX.read(arrayBufferData, { type: 'array' });
                let finalHtml = '';

                workbook.SheetNames.forEach(sheetName => {
                    const worksheet = workbook.Sheets[sheetName];
                    const htmlTable = XLSX.utils.sheet_to_html(worksheet);

                    finalHtml += `<h4>Sheet: ${sheetName}</h4>`;
                    finalHtml += htmlTable;
                    finalHtml += '<hr>';
                });

                $(containerElement).html(finalHtml);
                $(containerElement).find('table').addClass('table table-bordered table-sm');

            } catch (err) {
                console.error('Error during XLSX.read/render:', err);
                $(containerElement).html(`<p class="text-danger">Gagal merender file Excel.</p>`);
            }
        };

        // --- LOGIKA UTAMA ---
        if (typeof source === 'string') {
            // KASUS 1: 'source' adalah URL, kita perlu fetch
            fetch(source)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.arrayBuffer(); // Dapatkan sebagai arrayBuffer
                })
                .then(data => {
                    render(data); // Kirim arrayBuffer ke helper render
                })
                .catch(err => {
                    console.error('Error fetching XLSX:', err);
                    $(containerElement).html(`<p class="text-danger">Gagal memuat pratinjau Excel.</p>`);
                });

        } else if (source instanceof ArrayBuffer) {
            // KASUS 2: 'source' sudah berupa ArrayBuffer
            try {
                render(source); // Langsung render
            } catch (err) {
                console.error('Error rendering local XLSX (ArrayBuffer):', err);
                $(containerElement).html(`<p class="text-danger">Gagal merender file Excel lokal.</p>`);
            }

        } else if (source instanceof Blob) {
            // KASUS 3: 'source' adalah Blob, perlu dikonversi ke ArrayBuffer
            source.arrayBuffer()
                .then(arrayBuffer => {
                    render(arrayBuffer);
                })
                .catch(err => {
                    console.error('Error converting Blob to ArrayBuffer:', err);
                    $(containerElement).html(`<p class="text-danger">Gagal membaca data file Blob.</p>`);
                });

        } else {
            // KASUS 4: Tipe data tidak dikenal
            console.error('Invalid source type for RenderXlsx:', source);
            $(containerElement).html(`<p class="text-danger">Sumber data pratinjau tidak dikenali.</p>`);
        }
    },
    RenderTooltip: function () {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        })
    }
}

//=======================
// HANDLER (Event Listeners)
//=======================

$("#btnNew").click(function (e) {
    e.preventDefault();
    isEdit = false;

    showKardarForm();

    $("#btnCopy").removeClass("d-none");
});

$("#btnBack").click(function (e) {
    debugger;
    e.preventDefault();
    isEdit = false;
    $("#formInputKarDar").hide();
    $("#formDatatable").show();

    pSetFormDetailClear();
    p_MasterParameter();
});

$("#btnAddKardarModal").click(function (e) {
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

$("#btnCopy").on("click", function (e) {
    e.preventDefault();

    if ($.fn.DataTable.isDataTable('#tableCopyKardar')) {
        $('#tableCopyKardar').DataTable().destroy();
    }
    $('#modalShowCopyKardarBody').empty();

    GettingDataDoc();
});

$("#docDetail-modal").on("select2:select", function (e) {
    e.preventDefault();

    var selectedValue = this.value;

    p_ShowCopyTable(selectedValue);
});

$("#btnCloseShowCopyKardarModal").on("click", function (e) {
    e.preventDefault();

    $("#ShowCopyKardarModal").modal("toggle");
});

$("#btnCopyModal").on("click", function (e) {
    e.preventDefault();

    var datSel = $("#docDetail-modal").find(":selected").val();

    if (datSel == null || datSel == "") {
        clsGlobal.setMessageWarning("Pilih Dok No");
        return false;
    }

    let lstDatDet = JSON.parse(datDetailCopy.KarDarDetail);

    // Init Ulang Id Detailnya

    lstDatDet = lstDatDet.map(x => ({
        ...x,
        KarDarDetailId: crypto.randomUUID()
    }));

    console.log(lstDatDet);

    pToDataTable(lstDatDet, "DETAIL");

    $("#ShowCopyKardarModal").modal("toggle");
});

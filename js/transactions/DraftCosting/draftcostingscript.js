//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
let currentBrandInput = null;
let counter = 10;

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    p_InitForm();

});

function p_InitForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const draftId = urlParams.get('id');

    // Cek apakah sebelumnya klik "New"
    const isNewMode = sessionStorage.getItem("isNewMode");

    // Cek apakah sebelumnya klik "View"
    const isViewMode = sessionStorage.getItem("isViewMode");

    if (draftId) {
        debugger;
        $("#txtDraftCostingId").val(draftId);
        p_initiateData();
    } else {
        debugger;
        p_initiateData();

        // Kalau dari tombol New, aktifkan I2MS No
        if (isNewMode === "true") {
            $("#btnI2MSNo").prop("disabled", false);
            $("#btnProductCategory").prop("disabled", false);
            sessionStorage.removeItem("isNewMode"); // hapus biar gak nyangkut
        }

        // Kalau dari tombol View, aktifkan LOV ID
        if (isViewMode === "true") {
            $("#btnID").prop("disabled", false);
            sessionStorage.removeItem("isViewMode"); // hapus biar gak nyangkut
        }
    }
    //p_initiateData();

}

var tableDraftCosting = $("#tableDraftCosting").DataTable({
    scrollX: true,
    scrollY: "500px",
    fixedHeader: true,
    scrollCollapse: true,
    renderer: "bootstrap",
    processing: true,
    bAutoWidth: false,
    paging: true,
    aLengthMenu: [[-1, 5, 10, 100], ["ALL", 5, 10, 100]],
    fixedColumns: { left: [3] },
    order: [[1, "asc"], [2, "asc"], [3, "asc"], [4, "asc"]],
    search: { smart: false }, // important
    columnDefs: [
        {
            targets: "_all",
            render: function (data, type, row, meta) {
                // untuk sort / search (filter) - ambil value dari input / textarea / select
                if (type === "sort" || type === "filter") {
                    // data biasanya berupa string HTML (karena kamu menambah HTML string saat row.add)
                    var $el = $("<div>").html(data || "");
                    var input = $el.find("input, textarea, select");

                    if (input.length > 0) {
                        // untuk <input> ambil atribut value dulu (karena .val() mungkin kosong saat parsing HTML string)
                        if (input.is("input") || input.is("select")) {
                            return input.attr("value") || input.val() || input.text() || "";
                        }
                        // untuk textarea ambil inner text
                        if (input.is("textarea")) {
                            return input.text() || "";
                        }
                    }

                    // fallback: coba parse value via regex (robust terhadap string HTML)
                    var m = /value="([^"]*)"/.exec(data);
                    if (m) return m[1];

                    var mta = /<textarea[^>]*>([\s\S]*?)<\/textarea>/.exec(data);
                    if (mta) return mta[1];

                    // fallback final: plain text
                    return $el.text().trim();
                }

                // default: return original (untouched) untuk display
                return data;
            }
        },
        { visible: false, targets: [7] }
    ]
});

$(window).on('resize', function () {
    tableDraftCosting.columns.adjust().draw(false);
});

var tableDraftCostingUpload = $("#tableDraftCostingUpload").DataTable({
    scrollX: true,
    scrollY: "500px",
    fixedHeader: true,
    scrollCollapse: true,
    renderer: "bootstrap",
    processing: true,
    bAutoWidth: false,
    paging: true,
    aLengthMenu: [[-1, 5, 10, 100], ["ALL", 5, 10, 100]],
    fixedColumns: { left: [3] },
    order: [[1, "asc"], [2, "asc"], [3, "asc"], [4, "asc"]],
    search: { smart: false }, // important
    columnDefs: [
        {
            targets: "_all",
            render: function (data, type, row, meta) {
                // untuk sort / search (filter) - ambil value dari input / textarea / select
                if (type === "sort" || type === "filter") {
                    // data biasanya berupa string HTML (karena kamu menambah HTML string saat row.add)
                    var $el = $("<div>").html(data || "");
                    var input = $el.find("input, textarea, select");

                    if (input.length > 0) {
                        // untuk <input> ambil atribut value dulu (karena .val() mungkin kosong saat parsing HTML string)
                        if (input.is("input") || input.is("select")) {
                            return input.attr("value") || input.val() || input.text() || "";
                        }
                        // untuk textarea ambil inner text
                        if (input.is("textarea")) {
                            return input.text() || "";
                        }
                    }

                    // fallback: coba parse value via regex (robust terhadap string HTML)
                    var m = /value="([^"]*)"/.exec(data);
                    if (m) return m[1];

                    var mta = /<textarea[^>]*>([\s\S]*?)<\/textarea>/.exec(data);
                    if (mta) return mta[1];

                    // fallback final: plain text
                    return $el.text().trim();
                }

                // default: return original (untouched) untuk display
                return data;
            }
        },
        //    { visible: false, targets: [0] }
        {
            targets: [0], // ← kolom ke-1 (ingat: 0-based, jadi ini kolom kedua secara visual)
            className: "text-start" // Bootstrap: rata kiri
        }
    ]
});

$(window).on('resize', function () {
    tableDraftCostingUpload.columns.adjust().draw(false);
});

var tblComponenItemCost = $("#tblComponenItemCost").DataTable({
    scrollX: true,
    scrollY: "500px",
    fixedHeader: true,
    scrollCollapse: true,
    renderer: "bootstrap",
    processing: true,
    bAutoWidth: false,
    paging: true,
    aLengthMenu: [[-1, 5, 10, 100], ["ALL", 5, 10, 100]],
    fixedColumns: { left: [3] },
    order: [[1, "asc"], [2, "asc"], [3, "asc"], [4, "asc"]],
    search: { smart: false }, // important
    dom: 'tip',
    columnDefs: [
        {
            targets: "_all",
            render: function (data, type, row, meta) {
                // untuk sort / search (filter) - ambil value dari input / textarea / select
                if (type === "sort" || type === "filter") {
                    // data biasanya berupa string HTML (karena kamu menambah HTML string saat row.add)
                    var $el = $("<div>").html(data || "");
                    var input = $el.find("input, textarea, select");

                    if (input.length > 0) {
                        // untuk <input> ambil atribut value dulu (karena .val() mungkin kosong saat parsing HTML string)
                        if (input.is("input") || input.is("select")) {
                            return input.attr("value") || input.val() || input.text() || "";
                        }
                        // untuk textarea ambil inner text
                        if (input.is("textarea")) {
                            return input.text() || "";
                        }
                    }

                    // fallback: coba parse value via regex (robust terhadap string HTML)
                    var m = /value="([^"]*)"/.exec(data);
                    if (m) return m[1];

                    var mta = /<textarea[^>]*>([\s\S]*?)<\/textarea>/.exec(data);
                    if (mta) return mta[1];

                    // fallback final: plain text
                    return $el.text().trim();
                }

                // default: return original (untouched) untuk display
                return data;
            }
        },
        //    { visible: false, targets: [0] }
        {
            targets: [0], // ← kolom ke-1 (ingat: 0-based, jadi ini kolom kedua secara visual)
            className: "text-start" // Bootstrap: rata kiri
        }
    ]
});

$(window).on('resize', function () {
    tblComponenItemCost.columns.adjust().draw(false);
});

var tblComponenItemCostBudget = $("#tblComponenItemCostBudget").DataTable({
    scrollX: true,
    scrollY: "500px",
    fixedHeader: true,
    scrollCollapse: true,
    renderer: "bootstrap",
    processing: true,
    bAutoWidth: false,
    paging: true,
    aLengthMenu: [[-1, 5, 10, 100], ["ALL", 5, 10, 100]],
    fixedColumns: { left: [3] },
    order: [[1, "asc"], [2, "asc"], [3, "asc"], [4, "asc"]],
    search: { smart: false }, // important
    dom: 'tip',
    columnDefs: [
        {
            targets: "_all",
            render: function (data, type, row, meta) {
                // untuk sort / search (filter) - ambil value dari input / textarea / select
                if (type === "sort" || type === "filter") {
                    // data biasanya berupa string HTML (karena kamu menambah HTML string saat row.add)
                    var $el = $("<div>").html(data || "");
                    var input = $el.find("input, textarea, select");

                    if (input.length > 0) {
                        // untuk <input> ambil atribut value dulu (karena .val() mungkin kosong saat parsing HTML string)
                        if (input.is("input") || input.is("select")) {
                            return input.attr("value") || input.val() || input.text() || "";
                        }
                        // untuk textarea ambil inner text
                        if (input.is("textarea")) {
                            return input.text() || "";
                        }
                    }

                    // fallback: coba parse value via regex (robust terhadap string HTML)
                    var m = /value="([^"]*)"/.exec(data);
                    if (m) return m[1];

                    var mta = /<textarea[^>]*>([\s\S]*?)<\/textarea>/.exec(data);
                    if (mta) return mta[1];

                    // fallback final: plain text
                    return $el.text().trim();
                }

                // default: return original (untouched) untuk display
                return data;
            }
        },
        //    { visible: false, targets: [0] }
        {
            targets: [0], // ← kolom ke-1 (ingat: 0-based, jadi ini kolom kedua secara visual)
            className: "text-start" // Bootstrap: rata kiri
        }
    ]
});

$(window).on('resize', function () {
    tblComponenItemCostBudget.columns.adjust().draw(false);
});

var tblComponenItemCostPredictive = $("#tblComponenItemCostPredictive").DataTable({
    scrollX: true,
    scrollY: "500px",
    fixedHeader: true,
    scrollCollapse: true,
    renderer: "bootstrap",
    processing: true,
    bAutoWidth: false,
    paging: true,
    aLengthMenu: [[-1, 5, 10, 100], ["ALL", 5, 10, 100]],
    fixedColumns: { left: [3] },
    order: [[1, "asc"], [2, "asc"], [3, "asc"], [4, "asc"]],
    search: { smart: false }, // important
    dom: 'tip',
    columnDefs: [
        {
            targets: "_all",
            render: function (data, type, row, meta) {
                // untuk sort / search (filter) - ambil value dari input / textarea / select
                if (type === "sort" || type === "filter") {
                    // data biasanya berupa string HTML (karena kamu menambah HTML string saat row.add)
                    var $el = $("<div>").html(data || "");
                    var input = $el.find("input, textarea, select");

                    if (input.length > 0) {
                        // untuk <input> ambil atribut value dulu (karena .val() mungkin kosong saat parsing HTML string)
                        if (input.is("input") || input.is("select")) {
                            return input.attr("value") || input.val() || input.text() || "";
                        }
                        // untuk textarea ambil inner text
                        if (input.is("textarea")) {
                            return input.text() || "";
                        }
                    }

                    // fallback: coba parse value via regex (robust terhadap string HTML)
                    var m = /value="([^"]*)"/.exec(data);
                    if (m) return m[1];

                    var mta = /<textarea[^>]*>([\s\S]*?)<\/textarea>/.exec(data);
                    if (mta) return mta[1];

                    // fallback final: plain text
                    return $el.text().trim();
                }

                // default: return original (untouched) untuk display
                return data;
            }
        },
        //    { visible: false, targets: [0] }
        {
            targets: [0], // ← kolom ke-1 (ingat: 0-based, jadi ini kolom kedua secara visual)
            className: "text-start" // Bootstrap: rata kiri
        }
    ]
});

$(window).on('resize', function () {
    tblComponenItemCostPredictive.columns.adjust().draw(false);
});

//=======================
// FUNCTION
//=======================

function setChooseLOV(txtValue) {
    var arr = txtValue.split('|');



    switch (arr[0]) {
        case "btnID":
            debugger;
            $("#id").val(arr[1]);
            location.href = window.indexUrl + "?id=" + arr[3];
            break;
        case "txtI2MSNo":
            debugger;
            $("#txtI2MSNo").val(arr[1]);
            $("#txtProjectDesc").val(arr[2]);
            $("#txtBrand").val(arr[4]);
            $("#txtSubBrand").val(arr[5]);
            break;
        case "txtProductCategory":
            $("#txtProductCategory").val(arr[2]);
            break;


    }
    clsGlobal.closeLOV();
}

function p_initiateData() {
    debugger;
    clsGlobal.showLoading();

    $.ajax({
        type: "POST",
        url: "/DraftCosting/InitiateData",
        data: {
            id: $("#txtDraftCostingId").val(),
            __RequestVerificationToken: $('#FormDraftCosting input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess === true) {
                if (retDat.objData !== undefined) {
                    $("#txtHiddenObject").val(JSON.stringify(retDat.objData));
                    p_DataToUI(retDat.objData);

                    tableDraftCosting.clear().draw(false);

                    if (retDat.objData.listVmDraftCostingDetail != null) {
                        let details = retDat.objData.listVmDraftCostingDetail;
                        counter = 0;

                        for (let i = 0; i < details.length; i++) {
                            let d = details[i];
                            counter += 10; // <== kelipatan 10;

                            tableDraftCosting.row.add([
                                // No
                                counter,

                                // Doc ID
                                //`<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                //    <a href="javascript:void(0);"
                                //       onclick="location.href = window.detailUrl + '?id=' + '${d.intDraftCostingDetailId}'"
                                //       class="text-primary"
                                //       style="text-decoration:underline; cursor:pointer;">
                                //       ${d.intDocId || ''}
                                //    </a>
                                //    <input type="hidden" name="intDraftCostingDetailId" value="${d.intDraftCostingDetailId || ''}">
                                //</div>`,
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:70px">
                                    <a href="javascript:void(0);" 
                                       onclick="window.open(window.detailUrl + '?id=' + '${d.intDraftCostingDetailId}', '_blank')" 
                                       class="text-primary" 
                                       style="text-decoration:underline; cursor:pointer;">
                                       ${d.intDocId || ''}
                                    </a>
                                    <input type="hidden" name="intDraftCostingDetailId" value="${d.intDraftCostingDetailId || ''}">
                                </div>`,

                                // txtDocStatus
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                    <input type="text" class="form-control" name="txtDocStatus" 
                                        value="${d.txtDocStatus || ''}" readonly>
                                </div>`,

                                // Submitted Date
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                    <input type="text" class="form-control" name="dtmCreatedDate" 
                                        value="${d.dtmCreatedDate ? moment(d.dtmCreatedDate).format("YYYY-MM-DD HH:mm") : '-'}" readonly>
                                </div>`,

                                // Stage
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:70px">
                                    <input type="text" class="form-control" name="txtStageDevelopment" 
                                        value="${d.txtStageDevelopment || ''}" readonly>
                                </div>`,

                                // Item Code
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control" name="txtProductNo" value="${d.txtProductNo || ''}" readonly>
                                </div>`,

                                // Formula No
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control" name="txtFormulaNo" value="${d.txtFormulaNo || ''}" readonly>
                                </div>`,

                                //intVersion
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:70px">
                                    <input type="text" class="form-control" name="intVersion" value="${d.intVersion || ''}" readonly>
                                </div>`,

                                // txtFormulaComment
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                    <input type="text" class="form-control" name="txtFormulaComment" 
                                        value="${d.txtFormulaComment || ''}" readonly>
                                </div>`,

                                // txtVarianFormula Comment
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:70px">
                                    <input type="text" class="form-control" name="txtVarian" value="${d.txtVarian || ''}" readonly>
                                </div>`,

                                // decNettoGr
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control" name="decNettoGr" value="${d.decNettoGr || ''}" readonly>
                                </div>`,

                                // decNettoMl
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control" name="decNettoMl" value="${d.decNettoMl || ''}" readonly>
                                </div>`,                               

                                // txtPots
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:70px">
                                    <input type="text" class="form-control" name="txtPOTS" value="${d.txtPots || ''}" readonly>
                                </div>`,

                                // txtProductionLine
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control" name="txtProductionLine" value="${d.txtProductionLine || ''}" readonly>
                                </div>`,

                                // txtPotsFg
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:70px">
                                    <input type="text" class="form-control" name="txtPOTSFG" value="${d.txtPotsFg || ''}" readonly>
                                </div>`,

                                // txtProductionLineFg
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control" name="txtProductionLineFg" value="${d.txtProductionLineFg || ''}" readonly>
                                </div>`,

                                //// deleteRowVisualdata
                                //`<div style="text-align:center">
                                //    <i class="fas fa-trash fa-2x trash-icon" onclick="deleteRowVisualdata(this)"></i>
                                //</div>`,
                                // === Action Column ===
                                //(() => {
                                //    if (d.txtDocStatus?.toUpperCase() === "SUBMIT TO FA" || d.txtDocStatus?.toUpperCase() === "APPROVED" || d.txtDocStatus?.toUpperCase() === "VERIFIED") {
                                //        return `
                                //            <div class="text-center" style="padding-left:0; padding-right:0; min-width:120px">
                                //                <button type="button"
                                //                        class="btn btn-warning btn-sm"
                                //                        onclick="p_btnChangeStatus('${d.intDraftCostingDetailId}')">
                                //                    Change Status
                                //                </button>
                                //            </div>
                                //        `;
                                //    } else {
                                //        return `
                                //            <div style="text-align:center">
                                //                <i class="fas fa-trash fa-2x trash-icon" onclick="deleteRowVisualdata(this)"></i>
                                //            </div>
                                //        `;
                                //    }
                                //})(),

                                (() => {
                                    const status = d.txtDocStatus?.toUpperCase();
                                    const role = retDat.objData.txtRoleUser;

                                    const isCST = role === "CST";
                                    const isIT = role === "IT";

                                    let isDisabled = false;

                                    if (isIT) {
                                        // 🔹 IT selalu boleh
                                        isDisabled = false;
                                    }
                                    else if (status === "SUBMIT TO FA") {
                                        // 🔹 SUBMIT TO FA → hanya CST yang boleh
                                        isDisabled = !isCST;
                                    }
                                    else if (status === "APPROVED" || status === "VERIFIED") {
                                        // 🔹 APPROVED / VERIFIED → CST tidak boleh
                                        isDisabled = isCST;
                                    }

                                    if (status === "SUBMIT TO FA" || status === "APPROVED" || status === "VERIFIED") {
                                        return `
                                            <div class="text-center" style="padding-left:0; padding-right:0; min-width:120px">
                                                <button type="button"
                                                        class="btn btn-warning btn-sm btn-change-status"
                                                        data-status="${status}"
                                                        ${isDisabled ? "disabled" : ""}
                                                        onclick="p_btnChangeStatus('${d.intDraftCostingDetailId}')">
                                                    Change Status
                                                </button>
                                            </div>
                                        `;
                                    } else {
                                        return `
                                            <div style="text-align:center">
                                                <i class="fas fa-trash fa-2x trash-icon btn-delete-row"
                                                   onclick="deleteRowVisualdata(this)"></i>
                                            </div>
                                        `;
                                    }
                                })(),


                                // Print
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; text-align:center; min-width:50px">
                                    <input type="checkbox" name="bitPrint" class="bit-print">
                                </div>`
                            ]).draw(false);
                        }
                    }
                    debugger;
                    if (retDat.objData.txtRoleUser === "CST") {

                        disableAllByRole();

                    }

                } else {
                    p_showBlank();
                }
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }
            clsGlobal.hideLoading();
        },
        error: function () {
            clsGlobal.hideLoading();
        }
    });
}

function p_DataToUI(objData) {
    debugger;
    $("#id").val(clsGlobal.parseToInteger(objData.intDraftCostingId));
    $("#txtDraftCostingId").val(clsGlobal.parseToString(objData.txtDraftCostingId));
    $("#txtI2MSNo").val(clsGlobal.parseToString(objData.txtI2msno));
    $("#txtBrand").val(clsGlobal.parseToString(objData.txtBrand));
    $("#txtProjectDesc").val(clsGlobal.parseToString(objData.txtProjectDesc));
    $("#txtSubBrand").val(clsGlobal.parseToString(objData.txtSubBrand));
    $("#txtProductCategory").val(clsGlobal.parseToString(objData.txtProductCategory));

    $('#bitActive').prop('checked', objData.bitActive);
    if (objData.txtUpdatedBy == "" || objData.txtUpdatedBy == null) {
        $('#txtCreatedBy').val(objData.txtCreatedBy);
        $('#dtmCreatedDate').val(clsGlobal.parseJSONdateNew(objData.dtmCreatedDate));
    } else {
        $('#txtCreatedBy').val(objData.txtCreatedBy);
        $('#dtmCreatedDate').val(clsGlobal.parseJSONdateNew(objData.dtmCreatedDate));
    };
    if (objData.dtmCreatedDate) {
        let d = new Date(objData.dtmCreatedDate);

        // Ambil komponen dengan local time
        let year = d.getFullYear();
        let month = (d.getMonth() + 1).toString().padStart(2, "0");
        let day = d.getDate().toString().padStart(2, "0");

        let formattedCreated = `${year}-${month}-${day}`; // yyyy-MM-dd
        $('#dtmCreatedDate').val(formattedCreated);
    }

    tableDraftCosting.clear().draw(false);

    $("#txtHiddenObject").val(JSON.stringify(objData));


}

function p_UIToData() {
    debugger;

    var jsonObj = [];
    var htmlJSON = $("#txtHiddenObject").val();
    //jsonData = JSON.parse(htmlJSON);
    var jsonData = {};

    // jika kosong atau invalid, isi objek default
    if (!htmlJSON || htmlJSON.trim() === "") {
        jsonData = {};
    } else {
        try {
            jsonData = JSON.parse(htmlJSON);
        } catch (e) {
            console.warn("Invalid JSON in txtHiddenObject, creating empty object");
            jsonData = {};
        }
    }
    jsonData.intDraftCostingId = clsGlobal.parseToInteger($("#id").val());
    jsonData.txtDraftCostingId = $("#txtDraftCostingId").val();
    jsonData.txtI2MSNo = $("#txtI2MSNo").val();
    jsonData.txtBrand = $("#txtBrand").val();
    jsonData.txtProjectDesc = $("#txtProjectDesc").val();
    jsonData.txtSubBrand = $("#txtSubBrand").val();
    jsonData.txtProductCategory = $("#txtProductCategory").val();
    jsonData.bitActive = clsGlobal.parseToBoolean($("#bitActive").prop("checked"));

    jsonData.txtCreatedBy = $("#txtCreatedBy").val();
    jsonData.dtmCreatedDate = $("#dtmCreatedDate").val();
    jsonData.txtUpdatedBy = $("#txtUpdatedBy").val();
    jsonData.dtmUpdatedDate = $("#dtmUpdatedDate").val();

    jsonData.listDraftCostingUpload = $("#txtHiddenObjectList").val();

    $("#txtHiddenObject").val(JSON.stringify(jsonData));
}

function p_UIToDataList() {
    var dataList = [];

    // Ambil instance DataTable
    var table = $("#tableDraftCostingUpload").DataTable();

    // Ambil semua row (termasuk yg ke-filter/hidden) pakai dataTables API
    table.rows().every(function () {
        var $row = $(this.node());

        // Abaikan row placeholder
        if ($row.hasClass("dataTables_empty") || $row.text().trim() === "No data available in table") {
            return;
        }

        let obj = {
            txtProductCode: $row.find('input[name="txtProductCode"]').val() || "",
            txtVarian: $row.find('input[name="txtVarian"]').val() || "",
            decNettoGr: $row.find('input[name="decNettoGr"]').val() || "0",
            decNettoMl: $row.find('input[name="decNettoMl"]').val() || "0",
            txtStage: $row.find('input[name="txtStage"]').val() || "",
            txtFormulaClass: $row.find('input[name="txtFormulaClass"]').val() || "",
            txtItemCodeMapping: $row.find('input[name="txtItemCodeMapping"]').val() || "",
            txtItemCode: $row.find('input[name="txtItemCode"]').val() || "",
            txtPOTS: $row.find('input[name="txtPOTS"]').val() || "",
            txtPOTSFG: $row.find('input[name="txtPOTSFG"]').val() || "",
            decUnitVolume: $row.find('input[name="decUnitVolume"]').val() || "0",
            decTollFeeFg: $row.find('input[name="decTollFeeFg"]').val() || "0",
            decTollFeeBase: $row.find('input[name="decTollFeeBase"]').val() || "0",
            txtFormulaNo: $row.find('input[name="txtFormulaNo"]').val() || "",
            txtFormulaComment: $row.find('input[name="txtFormulaComment"]').val() || "",
            intSequence: $row.find('input[name="intSequence"]').val() || "",
            txtIngredientCode: $row.find('input[name="txtIngredientCode"]').val() || "",
            txtIngredientDesc: $row.find('input[name="txtIngredientDesc"]').val() || "",
            decQtyFormula: $row.find('input[name="decQtyFormula"]').val() || "0",
            txtUomFormula: $row.find('input[name="txtUomFormula"]').val() || "",
            txtProductionLine: $row.find('input[name="txtProductionLine"]').val() || "",
            txtProductionLineFg: $row.find('input[name="txtProductionLineFg"]').val() || "",
            decQtyOutput: $row.find('input[name="decQtyOutput"]').val() || "",
            txtUomFG: $row.find('input[name="txtUomFG"]').val() || ""
        };

        dataList.push(obj);
    });

    // simpan ke hidden input
    $("#txtHiddenObjectList").val(JSON.stringify(dataList));
}

function p_UIToDataBudgetList() {
    var dataList = [];

    // Ambil instance DataTable
    var table = $("#tableDraftCostingUpload").DataTable();

    // Ambil semua row (termasuk yg ke-filter/hidden) pakai dataTables API
    table.rows().every(function () {
        var $row = $(this.node());

        // Abaikan row placeholder
        if ($row.hasClass("dataTables_empty") || $row.text().trim() === "No data available in table") {
            return;
        }

        let obj = {
            txtProductCode_Budget: $row.find('input[name="txtProductCode_Budget"]').val() || "",
            txtVarian_Budget: $row.find('input[name="txtVarian_Budget"]').val() || "",
            decNettoGr_Budget: $row.find('input[name="decNettoGr_Budget"]').val() || "0",
            decNettoMl_Budget: $row.find('input[name="decNettoMl_Budget"]').val() || "0",
            txtFormulaClass_Budget: $row.find('input[name="txtFormulaClass_Budget"]').val() || "",
            txtItemCodeMapping_Budget: $row.find('input[name="txtItemCodeMapping_Budget"]').val() || "",
            txtItemCode_Budget: $row.find('input[name="txtItemCode_Budget"]').val() || "",
            txtFormulaNo_Budget: $row.find('input[name="txtFormulaNo_Budget"]').val() || "",
            txtFormulaComment_Budget: $row.find('input[name="txtFormulaComment_Budget"]').val() || "",
            intSequence_Budget: $row.find('input[name="intSequence_Budget"]').val() || "",
            txtIngredientCode_Budget: $row.find('input[name="txtIngredientCode_Budget"]').val() || "",
            txtIngredientDesc_Budget: $row.find('input[name="txtIngredientDesc_Budget"]').val() || "",
            decQtyFormula_Budget: $row.find('input[name="decQtyFormula_Budget"]').val() || "0",
            txtUomFormula_Budget: $row.find('input[name="txtUomFormula_Budget"]').val() || "",
            txtProductionLine_Budget: $row.find('input[name="txtProductionLine_Budget"]').val() || "",
            decQtyOutput_Budget: $row.find('input[name="decQtyOutput_Budget"]').val() || "",
            txtUomFG_Budget: $row.find('input[name="txtUomFG_Budget"]').val() || ""
        };

        dataList.push(obj);
    });

    // simpan ke hidden input
    $("#txtHiddenObjectBudgetList").val(JSON.stringify(dataList));
}

function p_UIToDataPredictiveList() {
    var dataList = [];

    // Ambil instance DataTable
    var table = $("#tableDraftCostingUpload").DataTable();

    // Ambil semua row (termasuk yg ke-filter/hidden) pakai dataTables API
    table.rows().every(function () {
        var $row = $(this.node());

        // Abaikan row placeholder
        if ($row.hasClass("dataTables_empty") || $row.text().trim() === "No data available in table") {
            return;
        }

        let obj = {
            txtProductCode_Predictive: $row.find('input[name="txtProductCode_Predictive"]').val() || "",
            txtVarian_Predictive: $row.find('input[name="txtVarian_Predictive"]').val() || "",
            decNettoGr_Predictive: $row.find('input[name="decNettoGr_Predictive"]').val() || "0",
            decNettoMl_Predictive: $row.find('input[name="decNettoMl_Predictive"]').val() || "0",
            txtFormulaClass_Predictive: $row.find('input[name="txtFormulaClass_Predictive"]').val() || "",
            txtItemCodeMapping_Predictive: $row.find('input[name="txtItemCodeMapping_Predictive"]').val() || "",
            txtItemCode_Predictive: $row.find('input[name="txtItemCode_Predictive"]').val() || "",
            txtFormulaNo_Predictive: $row.find('input[name="txtFormulaNo_Predictive"]').val() || "",
            txtFormulaComment_Predictive: $row.find('input[name="txtFormulaComment_Predictive"]').val() || "",
            intSequence_Predictive: $row.find('input[name="intSequence_Predictive"]').val() || "",
            txtIngredientCode_Predictive: $row.find('input[name="txtIngredientCode_Predictive"]').val() || "",
            txtIngredientDesc_Predictive: $row.find('input[name="txtIngredientDesc_Predictive"]').val() || "",
            decQtyFormula_Predictive: $row.find('input[name="decQtyFormula_Predictive"]').val() || "0",
            txtUomFormula_Predictive: $row.find('input[name="txtUomFormula_Predictive"]').val() || "",
            txtProductionLine_Predictive: $row.find('input[name="txtProductionLine_Predictive"]').val() || "",
            decQtyOutput_Predictive: $row.find('input[name="decQtyOutput_Predictive"]').val() || "",
            txtUomFG_Predictive: $row.find('input[name="txtUomFG_Predictive"]').val() || ""
        };

        dataList.push(obj);
    });

    // simpan ke hidden input
    $("#txtHiddenObjectPredictiveList").val(JSON.stringify(dataList));
}

var ProjectDetail = {
    DownloadTemplateDraftCosting: function () {
        $.ajax({
            type: "POST",
            url: "/DraftCosting/NPOIDowloadTemplate",
            data: {
                data: $("#txtHiddenObject").val(),
                __RequestVerificationToken: $('#FormDraftCosting input[name=__RequestVerificationToken]').val()

            },
            datatype: "json",
            success: function (url) {
                // Redirect to download URL
                window.location = url;
            },
            error: function (xhr, status, error) {
                console.error("Export failed: ", error);
                alert("Export failed. Please try again.");
            }
        });
    },


    UploadTemplateDraftCosting: function () {
        const formData = new FormData();
        formData.append("__RequestVerificationToken", $('#FormDraftCosting input[name=__RequestVerificationToken]').val());

        let file = $('#templateUploadNutriFact')[0].files[0];
        if (!file) {
            clsGlobal.swalWarning("Please select a file before upload");
            return;
        }
        formData.append("UploadNutriFact", file);

        $.ajax({
            type: "POST",
            url: "/DraftCosting/UploadTemplate",
            data: formData,
            processData: false,
            contentType: false,
            success: function (retDat, status, xhr) {
                clsGlobal.hideLoading();
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                    return;
                }

                if (retDat.bitSuccess && retDat.objData) {
                    tableDraftCostingUpload.clear().draw(false);
                    $('#modalDetail').modal('show');

                    for (var i = 0; i < retDat.objData.length; i++) {
                        var d = retDat.objData[i];
                        var row = d.listVmDraftCostingUpload[0];
                        var color = row.txtErrorMessage === "PASS" ? "text-success fw-bold" : "text-danger fw-bold";
                        debugger;
                        tableDraftCostingUpload.row.add([
                            // 🔴 Kolom ErrorMessage
                            `<div class="col-sm-12 ${color}" name="txtErrorMessage" style="min-width:150px">
                            ${row.txtErrorMessage || ''}
                        </div>`,
                            // TxtProductCode
                            `<div class="col-sm-12" style="min-width:200px">
                            <input type="text" class="form-control" name="txtProductCode" value="${row.txtProductCode || ''}" readonly>
                        </div>`,
                            `<div class="col-sm-12" style="min-width:200px">
                            <input type="text" class="form-control" name="txtVarian" value="${row.txtVarian || ''}" readonly>
                        </div>`,
                            `<div class="col-sm-12" style="min-width:200px">
                            <input type="text" class="form-control decimal-input" name="decNettoGr" placeholder="0.00" value="${row.decNettoGr || ''}" oninput="formatDecimal(this)">
                        </div>`,
                            `<div class="col-sm-12" style="min-width:200px">
                            <input type="text" class="form-control decimal-input" name="decNettoMl" placeholder="0.00" value="${row.decNettoMl || ''}" oninput="formatDecimal(this)">
                        </div>`,
                        //    `<div class="col-sm-12" style="min-width:200px">
                        //    <input type="text" class="form-control integer-input" name="intVersion" placeholder="0" value="${row.intVersion || ''}" oninput="formatInteger(this)">
                            //</div>`,
                            `<div class="col-sm-12" style="min-width:200px">
                            <input type="text" class="form-control" name="txtStage" value="${row.txtStage || ''}" readonly>
                        </div>`,
                            `<div class="col-sm-12" style="min-width:200px">
                            <input type="text" class="form-control" name="txtFormulaClass" value="${row.txtFormulaClass || ''}" readonly>
                        </div>`,
                            `<div class="col-sm-12" style="min-width:200px">
                            <input type="text" class="form-control" name="txtItemCodeMapping" value="${row.txtItemCodeMapping || ''}" readonly>
                        </div>`,
                            `<div class="col-sm-12" style="min-width:200px">
                            <input type="text" class="form-control" name="txtItemCode" value="${row.txtItemCode || ''}" readonly>
                        </div>`,
                            `<div class="col-sm-12" style="min-width:200px">
                            <input type="text" class="form-control" name="txtPOTS" value="${row.txtPOTS || ''}" readonly>
                        </div>`,
                            `<div class="col-sm-12" style="min-width:200px">
                            <input type="text" class="form-control" name="txtProductionLine" value="${row.txtProductionLine || ''}" readonly>
                        </div>`,
                            `<div class="col-sm-12" style="min-width:200px">
                            <input type="text" class="form-control" name="txtPOTSFG" value="${row.txtPotsFg || ''}" readonly>
                        </div>`,
                            `<div class="col-sm-12" style="min-width:200px">
                            <input type="text" class="form-control" name="txtProductionLineFg" value="${row.txtProductionLineFg || ''}" readonly>
                        </div>`,
                            `<div class="col-sm-12" style="min-width:200px">
                            <input type="text" class="form-control" name="decQtyOutput" value="${row.decQtyOutput || ''}" readonly>
                        </div>`,
                            `<div class="col-sm-12" style="min-width:200px">
                            <input type="text" class="form-control" name="txtUomFG" value="${row.txtUomFG || ''}" readonly>
                        </div>`,
                                `<div class="col-sm-12" style="min-width:200px">
                            <input type="text" class="form-control decimal-input" name="decUnitVolume" placeholder="0.00" value="${row.decUnitVolume || ''}" oninput="formatDecimal(this)">
                        </div>`,
                            `<div class="col-sm-12" style="min-width:200px">
                            <input type="text" class="form-control decimal-input" name="decTollFeeFg" placeholder="0.00" value="${row.decTollFeeFg || ''}" oninput="formatDecimal(this)">
                        </div>`,
                            `<div class="col-sm-12" style="min-width:200px">
                            <input type="text" class="form-control decimal-input" name="decTollFeeBase" placeholder="0.00" value="${row.decTollFeeBase || ''}" oninput="formatDecimal(this)">
                        </div>`,
                            `<div class="col-sm-12" style="min-width:200px">
                            <input type="text" class="form-control" name="txtFormulaNo" value="${row.txtFormulaNo || ''}" readonly>
                        </div>`,
                            `<div class="col-sm-12" style="min-width:200px">
                            <input type="text" class="form-control" name="txtFormulaComment" value="${row.txtFormulaComment || ''}" readonly>
                        </div>`,
                            `<div class="col-sm-12" style="min-width:200px">
                            <input type="text" class="form-control integer-input" name="intSequence" placeholder="0" value="${row.intSequence || ''}" oninput="formatInteger(this)">
                        </div>`,
                            `<div class="col-sm-12" style="min-width:200px">
                            <input type="text" class="form-control" name="txtIngredientCode" value="${row.txtIngredientCode || ''}" readonly>
                        </div>`,
                            `<div class="col-sm-12" style="min-width:200px">
                            <input type="text" class="form-control" name="txtIngredientDesc" value="${row.txtIngredientDesc || ''}" readonly>
                        </div>`,
                            `<div class="col-sm-12" style="min-width:200px">
                            <input type="text" class="form-control decimal-input" name="decQtyFormula" placeholder="0.00" value="${row.decQtyFormula || ''}" oninput="formatDecimal(this)">
                        </div>`,
                            `<div class="col-sm-12" style="min-width:200px">
                            <input type="text" class="form-control" name="txtUomFormula" value="${row.txtUomFormula || ''}" readonly>
                        </div>`
                            
                        ]).draw(false);
                    }

                    if (retDat.hasError) {
                        debugger;
                        showErrorPopup("Terjadi kesalahan saat upload.");
                        $('#btnSave').addClass('d-none');
                    } else {
                        showSuccessPopup("File berhasil diupload!");
                        $('#btnSave').removeClass('d-none');
                    }
                } else {
                    showErrorPopup(retDat.txtMessage || "Terjadi kesalahan saat upload.");
                }
            },
            error: function (xhr) {
                clsGlobal.hideLoading();
                clsGlobal.swalError(xhr.responseText);
            }
        });
    }

};
function formatDecimalValue(value) {
    if (value == null) return "";

    // Hilangkan koma dan karakter tak valid
    let clean = value.toString().replace(/,/g, '').replace(/[^0-9.]/g, '');

    // Cek trailing dot
    const hasTrailingDot = clean.endsWith('.') && clean.indexOf('.') === clean.lastIndexOf('.');

    // Split integer & decimal
    const parts = clean.split('.');
    let intPart = parts[0] || '0';
    let decPart = parts[1] || '';

    // Jika lebih dari 1 titik: gabungkan semua setelah titik pertama
    if (parts.length > 2) {
        decPart = parts.slice(1).join('');
    }

    // Maksimal 2 desimal
    decPart = decPart.substring(0, 2);

    // Format ribuan
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Gabung kembali
    let formatted = decPart.length > 0
        ? `${intPart}.${decPart}`
        : (hasTrailingDot ? `${intPart}.` : intPart);

    return formatted;
}

function formatDecimalValueFixed(value) {
    let formatted = formatDecimalValue(value);

    // Jika tidak ada desimal → pakai ".000"
    if (!formatted.includes(".")) {
        formatted += ".00";
    }

    return formatted;
}
function formatDecimal(input) {
    let value = input.value;

    let selectionStart = input.selectionStart;
    let afterCursor = value.length - selectionStart;

    let clean = value.replace(/,/g, '').replace(/[^0-9.]/g, '');

    const hasTrailingDot = clean.endsWith('.') && clean.indexOf('.') === clean.lastIndexOf('.');

    const parts = clean.split('.');
    let intPart = parts[0];
    let decPart = parts[1] || '';

    if (parts.length > 3) {
        decPart = parts.slice(1).join('');
    }

    decPart = decPart.substring(0, 3);
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    let formatted = decPart.length > 0
        ? `${intPart}.${decPart}`
        : (hasTrailingDot ? `${intPart}.` : intPart);

    input.value = formatted;

    const newCursor = input.value.length - afterCursor;
    input.setSelectionRange(newCursor, newCursor);
}

function formatInteger(input) {
    let value = input.value;

    // Simpan posisi kursor
    let selectionStart = input.selectionStart;
    let afterCursor = value.length - selectionStart;

    // Hanya angka, buang koma, titik, dll
    let clean = value.replace(/[^0-9]/g, '');

    // Update value
    input.value = clean;

    // Balikkan kursor ke posisi awal
    const newCursor = input.value.length - afterCursor;
    input.setSelectionRange(newCursor, newCursor);
}

// Delegasi event untuk input dan blur pada elemen .decimal-input
document.addEventListener('input', function (e) {
    if (e.target && e.target.classList.contains('decimal-input')) {
        formatDecimal(e.target);
    }
});

document.addEventListener('blur', function (e) {
    if (e.target && e.target.classList.contains('decimal-input')) {
        let value = e.target.value.replace(/,/g, '');
        if (value.includes('.')) return;

        let number = parseFloat(value);
        if (!isNaN(number)) {
            let intPart = Math.floor(number).toString();
            intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            e.target.value = `${intPart}.000`;
        }
    }
}, true); // Gunakan `true` agar blur bisa ditangkap (karena blur tidak bubble)

document.addEventListener('input', function (e) {
    if (e.target && e.target.classList.contains('integer-input')) {
        formatInteger(e.target);
    }
});

function showErrorPopup(message) {
    $("#modalUploadErrorBody").html(message || "Terjadi kesalahan saat upload.");
    $("#modalUploadError").modal("show");
}

function showSuccessPopup(message) {
    $("#modalSuccessBody").html(message || "Upload berhasil.");
    $("#modalSuccess").modal("show");
}

function showSaveConfirmation(actionText, isEdit) {
    debugger;
    Swal.fire({
        title: `Are you sure you want to ${actionText} the data?`,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: actionText.charAt(0).toUpperCase() + actionText.slice(1),
        denyButtonText: `Don't ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}`
    }).then((result) => {
        debugger;
        if (result.isConfirmed) {
            saveData(isEdit);
        } else if (result.isDenied) {
            Swal.fire(`Changes are not ${actionText}`, "", "info");
        }
    });
}

function saveData(isEdit) {
    debugger;

    p_UIToDataList();
    //p_UIToDataBudgetList();
    //p_UIToDataPredictiveList();
    p_UIToData();

    const url = isEdit ? window.updateUrl : window.saveUrl;
    debugger;

    // Buat FormData untuk kirim file + data JSON
    const formData = new FormData();
    formData.append("data", $("#txtHiddenObject").val());
    formData.append("__RequestVerificationToken", $('#FormDraftCosting input[name=__RequestVerificationToken]').val());


    $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        contentType: false, // WAJIB: biar tidak default ke application/x-www-form-urlencoded
        processData: false, // WAJIB: jangan proses FormData jadi string
        datatype: "json",
        success: function (retDat) {
            debugger;
            if (retDat.bitSuccess == true) {
                debugger;
                p_DataToUI(retDat.objData);
                clsGlobal.swalSuccessSaveOrSubmit(retDat.txtMessage, window.indexUrl + "?id=" + retDat.objData.txtDraftCostingId);
                /*clsGlobal.swalSuccessSaveOrSubmit(retDat.txtMessage, window.indexUrl);*/
                //window.location.href = window.indexUrl;

            } else {
                /*toastr.error(retDat.txtMessage);*/
                clsGlobal.getAlert(retDat.message);
            }
        },
        error: function (xhr) {
            toastr.error("Error saving data: " + xhr.responseText);
        }
    });
}

function p_enabled() {

    //$('#btnID').prop("disabled", false);
    $('#btnI2MSNo').prop("disabled", false);
    $('#btnProductCategory').prop("disabled", false);

}
function p_ExportData() {
    clsGlobal.getConfirmation("Export Data?", function (result) {
        if (result === true) {
            // Ambil data dari DataTable
            let dataExport = [];
            tableDraftCostingUpload.rows().every(function () {
                let row = $(this.node());
                let obj = {
                    txtErrorMessage: row.find('div[name="txtErrorMessage"]').text() || "",
                    txtProductCode: row.find('input[name="txtProductCode"]').val() || "",
                    txtVarian: row.find('input[name="txtVarian"]').val() || "",
                    decNettoGr: row.find('input[name="decNettoGr"]').val() || "",
                    decNettoMl: row.find('input[name="decNettoMl"]').val() || "",
                    txtStage: row.find('input[name="txtStage"]').val() || "",
                    txtFormulaClass: row.find('input[name="txtFormulaClass"]').val() || "",
                    txtItemCodeMapping: row.find('input[name="txtItemCodeMapping"]').val() || "",
                    txtItemCode: row.find('input[name="txtItemCode"]').val() || "",
                    txtPOTS: row.find('input[name="txtPOTS"]').val() || "",
                    txtProductionLine: row.find('input[name="txtProductionLine"]').val() || "",
                    txtPOTSFG: row.find('input[name="txtPOTSFG"]').val() || "",
                    txtProductionLineFg: row.find('input[name="txtProductionLineFg"]').val() || "",
                    decQtyOutput: row.find('input[name="decQtyOutput"]').val() || "",
                    txtUomFG: row.find('input[name="txtUomFG"]').val() || "",
                    decUnitVolume: row.find('input[name="decUnitVolume"]').val() || "",
                    decTollFeeFg: row.find('input[name="decTollFeeFg"]').val() || "",
                    decTollFeeBase: row.find('input[name="decTollFeeBase"]').val() || "",
                    txtFormulaNo: row.find('input[name="txtFormulaNo"]').val() || "",
                    txtFormulaComment: row.find('input[name="txtFormulaComment"]').val() || "",
                    intSequence: row.find('input[name="intSequence"]').val() || "",
                    txtIngredientCode: row.find('input[name="txtIngredientCode"]').val() || "",
                    txtIngredientDesc: row.find('input[name="txtIngredientDesc"]').val() || "",
                    decQtyFormula: row.find('input[name="decQtyFormula"]').val() || "",
                    txtUomFormula: row.find('input[name="txtUomFormula"]').val() || "",
                    
                };
                debugger;
                dataExport.push(obj);
            });
            debugger;
            $.ajax({
                type: "POST",
                url: "/DraftCosting/NPOIExportToExcelData",
                data: {
                    data: JSON.stringify(dataExport),
                    __RequestVerificationToken: $('#FormDraftCosting input[name=__RequestVerificationToken]').val()
                },
                datatype: "json",
                success: function (url) {
                    window.location = url; // Download file
                },
                error: function (xhr, status, error) {
                    console.error("Export failed: ", error);
                    alert("Export failed. Please try again.");
                }
            });
        }
    });
}

function p_ExportSummary() {
    clsGlobal.getConfirmation("Export Data?", function (result) {
        if (result !== true) return;

        let dataComponent = [];
        let dataBudget = [];
        let dataPredictive = [];

        // Fungsi helper ambil cell berdasarkan index
        function getCell(row, index) {
            return row.find("td").eq(index).text().trim();
        }

        // =============================
        // 📌 1. TABLE COMPONENT ITEM COST
        // =============================
        tblComponenItemCost.rows().every(function () {
            let row = $(this.node());
            let obj = {
                intSimulationId: getCell(row, 0),
                txtItemCode: getCell(row, 1),
                txtItemapping: getCell(row, 2),
                txtItemMappingFg: getCell(row, 3),
                txtFormulaNo: getCell(row, 4),
                txtProductDesc: getCell(row, 5),
                txtUOM: getCell(row, 6),
                decGramasi: getCell(row, 7),
                txtIO: getCell(row, 8),
                txtLine: getCell(row, 9),
                decRM: getCell(row, 10),
                decPM: getCell(row, 11),
                decConvCost: getCell(row, 12),
                decFeeFg: getCell(row, 13),
                decFeeBase: getCell(row, 14),
                decFreight: getCell(row, 15),
                decDepreInvest: getCell(row, 16),
                decAllowance: getCell(row, 17),
                decCOGS: getCell(row, 18),
                decHJP: getCell(row, 19),
                decCOGSPercentage: getCell(row, 20)
            };
            dataComponent.push(obj);
        });

        // =============================
        // 📌 2. TABLE BUDGET SUMMARY
        // =============================
        tblComponenItemCostBudget.rows().every(function () {
            let row = $(this.node());
            let obj = {
                intSimulationId: getCell(row, 0),
                txtItemCode: getCell(row, 1),
                txtItemapping: getCell(row, 2),
                txtItemMappingFg: getCell(row, 3),
                txtFormulaNo: getCell(row, 4),
                txtProductDesc: getCell(row, 5),
                txtUOM: getCell(row, 6),
                decGramasi: getCell(row, 7),
                txtIO: getCell(row, 8),
                txtLine: getCell(row, 9),
                decRM: getCell(row, 10),
                decPM: getCell(row, 11),
                decConvCost: getCell(row, 12),
                decFeeFg: getCell(row, 13),
                decFeeBase: getCell(row, 14),
                decFreight: getCell(row, 15),
                decDepreInvest: getCell(row, 16),
                decAllowance: getCell(row, 17),
                decCOGS: getCell(row, 18),
                decHJP: getCell(row, 19),
                decCOGSPercentage: getCell(row, 20)
            };
            dataBudget.push(obj);
        });

        // =============================
        // 📌 3. TABLE PREDICTIVE SUMMARY
        // =============================
        tblComponenItemCostPredictive.rows().every(function () {
            let row = $(this.node());
            let obj = {
                intSimulationId: getCell(row, 0),
                txtItemCode: getCell(row, 1),
                txtItemapping: getCell(row, 2),
                txtItemMappingFg: getCell(row, 3),
                txtFormulaNo: getCell(row, 4),
                txtProductDesc: getCell(row, 5),
                txtUOM: getCell(row, 6),
                decGramasi: getCell(row, 7),
                txtIO: getCell(row, 8),
                txtLine: getCell(row, 9),
                decRM: getCell(row, 10),
                decPM: getCell(row, 11),
                decConvCost: getCell(row, 12),
                decFeeFg: getCell(row, 13),
                decFeeBase: getCell(row, 14),
                decFreight: getCell(row, 15),
                decDepreInvest: getCell(row, 16),
                decAllowance: getCell(row, 17),
                decCOGS: getCell(row, 18),
                decHJP: getCell(row, 19),
                decCOGSPercentage: getCell(row, 20)
            };
            dataPredictive.push(obj);
        });

        // =============================
        // 📌 4. KIRIM KE SERVER
        // =============================
        $.ajax({
            type: "POST",
            url: "/DraftCosting/NPOIExportToExcelDataSummary",
            data: {
                dataComponent: JSON.stringify(dataComponent),
                dataBudget: JSON.stringify(dataBudget),
                dataPredictive: JSON.stringify(dataPredictive),
                projectNo: $("#txtI2MSNo_Summary").val(),
                submittedDate: $("#DtmSubmittedDate").val(),

                __RequestVerificationToken: $('#FormDraftCosting input[name=__RequestVerificationToken]').val()
            },
            success: function (url) {
                window.location = url;
            },
            error: function (xhr, status, error) {
                console.error("Export failed: ", error);
                alert("Export failed. Please try again.");
            }
        });

    });
}

function deleteRowVisualdata(btn) {
    debugger;
    const actionText = "delete";
    showDeleteConfirmation(actionText, btn);
};
function showDeleteConfirmation(actionText, btn) {
    debugger;
    Swal.fire({
        title: `Are you sure you want to ${actionText} the data?`,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: actionText.charAt(0).toUpperCase() + actionText.slice(1),
        denyButtonText: `Don't ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}`
    }).then((result) => {
        debugger;
        if (result.isConfirmed) {
            deleteData(btn);
        } else if (result.isDenied) {
            Swal.fire(`Changes are not ${actionText}`, "", "info");
        }
    });
}

function deleteData(btn) {
    debugger;
    var currentRow = $(btn).closest('tr');// baris saat ini
    var idDetail = currentRow.find('input[name="intDraftCostingDetailId"]').val();

    const url = deleteUrl;
    debugger;


    $.ajax({
        url: url,
        type: 'POST',
        data: {
            id: idDetail,
            __RequestVerificationToken: $('#FormMatrixStructureDetail input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            debugger;
            if (retDat.bitSuccess == true) {
                debugger;
                clsGlobal.swalSuccessSaveOrSubmit(retDat.txtMessage, window.indexUrl + "?id=" + $("#txtDraftCostingId").val());
                /*clsGlobal.swalSuccessSaveOrSubmit(retDat.txtMessage, window.indexUrl);*/
                //window.location.href = window.indexUrl;

            } else {
                /*toastr.error(retDat.txtMessage);*/
                clsGlobal.getAlert(retDat.message);
            }
        },
        error: function (xhr) {
            toastr.error("Error saving data: " + xhr.responseText);
        }
    });
}

function p_PrintSummaryData() {
    

    let selectedId = getSelectedDetailIds();

    if (selectedId.length === 0) {
        alert("Silakan pilih row dengan mencentang kolom Check.");
        return;
    }

    debugger;
    $('#modalPrint').modal('show');
    $.ajax({
        type: "POST",
        url: "/DraftCosting/PrintSummary",
        traditional: true,            // PENTING untuk kirim array!
        data: {
            id: selectedId,
            __RequestVerificationToken: $('#FormDraftCosting input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess === true) {
                if (retDat.objData !== undefined) {

                    let header = retDat.objData;
                    $("#txtI2MSNo_Summary").val($("#txtI2MSNo").val());
                    debugger;
                    if (retDat.objData.actualSummary[0].dtmCreatedDate) {
                        let d = new Date(retDat.objData.actualSummary[0].dtmCreatedDate);

                        // Ambil komponen dengan local time
                        let year = d.getFullYear();
                        let month = (d.getMonth() + 1).toString().padStart(2, "0");
                        let day = d.getDate().toString().padStart(2, "0");

                        let formatted = `${year}-${month}-${day}`; // yyyy-MM-dd
                        $('#DtmSubmittedDate').val(formatted);
                    }
                    tblComponenItemCost.clear().draw(false);
                    debugger;
                    //if (retDat.objData != null) {
                    //    let details = retDat.objData;

                    //    for (let i = 0; i < details.length; i++) {
                    //        let d = details[i];

                    //        tblComponenItemCost.row.add([
                    //            d.intSimulationId ?? "",
                    //            d.txtItemCode ?? "",
                    //            d.txtFormulaNo ?? "",
                    //            //d.txtProductDesc ?? "",
                    //            `<div style="min-width:250px; white-space:normal;">${d.txtProductDesc ?? ""}</div>`,
                    //            d.txtUOM ?? "",
                    //            formatDecimalValueFixed(d.decGramasi ?? 0),
                    //            d.txtIO ?? "",
                    //            d.txtLine ?? "",
                    //            formatDecimalValueFixed(d.decRM ?? 0),
                    //            formatDecimalValueFixed(d.decPM ?? 0),
                    //            formatDecimalValueFixed(d.decConvCost ?? 0),
                    //            formatDecimalValueFixed(d.decFeeFg ?? 0),
                    //            formatDecimalValueFixed(d.decFeeBase ?? 0),
                    //            formatDecimalValueFixed(d.decFreight ?? 0),
                    //            formatDecimalValueFixed(d.decAllowance ?? 0),
                    //            formatDecimalValueFixed(d.decCOGS ?? 0),
                    //            formatDecimalValueFixed(d.decHJP ?? 0),
                    //            formatDecimalValueFixed(d.decCOGSPercentage ?? 0)
                    //        ]);
                    //    }

                    //    tblComponenItemCost.draw(false);
                    //}

                    // ambil summary list
                    let details = header.actualSummary;

                    if (details && details.length > 0) {

                        for (let i = 0; i < details.length; i++) {
                            let d = details[i];

                            tblComponenItemCost.row.add([
                                d.intSimulationId ?? "",
                                d.txtItemCode ?? "",
                                d.txtItemapping ?? "",
                                d.txtItemMappingFg ?? "",
                                d.txtFormulaNo ?? "",
                                `<div style="min-width:250px; white-space:normal;">${d.txtProductDesc ?? ""}</div>`,
                                d.txtUOM ?? "",
                                formatDecimalValueFixed(d.decGramasi ?? 0),
                                d.txtIO ?? "",
                                d.txtLine ?? "",
                                formatDecimalValueFixed(d.decRM ?? 0),
                                formatDecimalValueFixed(d.decPM ?? 0),
                                formatDecimalValueFixed(d.decConvCost ?? 0),
                                formatDecimalValueFixed(d.decFeeFg ?? 0),
                                formatDecimalValueFixed(d.decFeeBase ?? 0),
                                formatDecimalValueFixed(d.decFreight ?? 0),
                                formatDecimalValueFixed(d.decDepreInvest ?? 0),
                                formatDecimalValueFixed(d.decAllowance ?? 0),
                                formatDecimalValueFixed(d.decCOGS ?? 0),
                                formatDecimalValueFixed(d.decHJP ?? 0),
                                formatDecimalValueFixed(d.decCOGSPercentage ?? 0)
                            ]);
                        }

                        tblComponenItemCost.draw(false);
                    }

                    tblComponenItemCostBudget.clear().draw(false);
                    debugger;

                    // ambil summary list
                    let detailBudgets = header.budgetSummary;

                    if (detailBudgets && detailBudgets.length > 0) {

                        for (let i = 0; i < detailBudgets.length; i++) {
                            let d = detailBudgets[i];

                            tblComponenItemCostBudget.row.add([
                                d.intSimulationId ?? "",
                                d.txtItemCode ?? "",
                                d.txtItemapping ?? "",
                                d.txtItemMappingFg ?? "",
                                d.txtFormulaNo ?? "",
                                `<div style="min-width:250px; white-space:normal;">${d.txtProductDesc ?? ""}</div>`,
                                d.txtUOM ?? "",
                                formatDecimalValueFixed(d.decGramasi ?? 0),
                                d.txtIO ?? "",
                                d.txtLine ?? "",
                                formatDecimalValueFixed(d.decRM ?? 0),
                                formatDecimalValueFixed(d.decPM ?? 0),
                                formatDecimalValueFixed(d.decConvCost ?? 0),
                                formatDecimalValueFixed(d.decFeeFg ?? 0),
                                formatDecimalValueFixed(d.decFeeBase ?? 0),
                                formatDecimalValueFixed(d.decFreight ?? 0),
                                formatDecimalValueFixed(d.decDepreInvest ?? 0),
                                formatDecimalValueFixed(d.decAllowance ?? 0),
                                formatDecimalValueFixed(d.decCOGS ?? 0),
                                formatDecimalValueFixed(d.decHJP ?? 0),
                                formatDecimalValueFixed(d.decCOGSPercentage ?? 0)
                            ]);
                        }

                        tblComponenItemCostBudget.draw(false);
                    }

                    tblComponenItemCostPredictive.clear().draw(false);
                    debugger;

                    // ambil summary list
                    let detailPredictives = header.predictiveSummary;

                    if (detailPredictives && detailPredictives.length > 0) {

                        for (let i = 0; i < detailPredictives.length; i++) {
                            let d = detailPredictives[i];

                            tblComponenItemCostPredictive.row.add([
                                d.intSimulationId ?? "",
                                d.txtItemCode ?? "",
                                d.txtItemapping ?? "",
                                d.txtItemMappingFg ?? "",
                                d.txtFormulaNo ?? "",
                                `<div style="min-width:250px; white-space:normal;">${d.txtProductDesc ?? ""}</div>`,
                                d.txtUOM ?? "",
                                formatDecimalValueFixed(d.decGramasi ?? 0),
                                d.txtIO ?? "",
                                d.txtLine ?? "",
                                formatDecimalValueFixed(d.decRM ?? 0),
                                formatDecimalValueFixed(d.decPM ?? 0),
                                formatDecimalValueFixed(d.decConvCost ?? 0),
                                formatDecimalValueFixed(d.decFeeFg ?? 0),
                                formatDecimalValueFixed(d.decFeeBase ?? 0),
                                formatDecimalValueFixed(d.decFreight ?? 0),
                                formatDecimalValueFixed(d.decDepreInvest ?? 0),
                                formatDecimalValueFixed(d.decAllowance ?? 0),
                                formatDecimalValueFixed(d.decCOGS ?? 0),
                                formatDecimalValueFixed(d.decHJP ?? 0),
                                formatDecimalValueFixed(d.decCOGSPercentage ?? 0)
                            ]);
                        }

                        tblComponenItemCostPredictive.draw(false);
                    }

                } else {
                    p_showBlank();
                }
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }
            clsGlobal.hideLoading();
        },
        error: function () {
            clsGlobal.hideLoading();
        }
    });
}

function getSelectedDetailIds() {
    let ids = [];
    debugger;
    tableDraftCosting.rows().every(function () {
        let row = $(this.node());
        let isChecked = row.find("input[name='bitPrint']").is(":checked");
        debugger;
        if (isChecked) {
            let id = row.find("input[name='intDraftCostingDetailId']").val();
            if (id) ids.push(id);
        }
    });

    return ids;
}

$('#modalPrint').on('shown.bs.modal', function () {
    tblComponenItemCost.columns.adjust().draw(false);
    tblComponenItemCostBudget.columns.adjust().draw(false);
    tblComponenItemCostPredictive.columns.adjust().draw(false);
});

function p_ProceedData() {
    let selectedId = getSelectedDetailIds();

    if (selectedId.length === 0) {
        alert("Silakan pilih row dengan mencentang kolom Check.");
        return;
    }

    // ======================================================
    // 🔥 VALIDASI DOCSTATUS
    // ======================================================
    let isRecalculate = false;

    tableDraftCosting.rows().every(function () {
        let row = $(this.node());

        let isChecked = row.find("input[name='bitPrint']").is(":checked");
        if (!isChecked) return; // hanya cek yang dicentang

        let docStatus = getDocStatusFromRow(row);

        //if (docStatus === "RECALCULATE") {
        //    isRecalculate = true;
        //}

        if (docStatus !== "DRAFT" && docStatus !== "NEW") {
            isRecalculate = true;
        }
    });

    if (isRecalculate) {
        alert("Doc Id dengan status selain NEW/DRAFT tidak dapat diproses.");
        return;
    }
    // ======================================================

    p_UIToDataList();
    p_UIToData();

    const url = window.proceedData;
    debugger;

    // Buat FormData untuk kirim file + data JSON
    const formData = new FormData();
    formData.append("data", $("#txtHiddenObject").val());
    // kirim array id (otomatis menjadi id[0], id[1]...)
    selectedId.forEach(i => formData.append("id", i));
    formData.append("__RequestVerificationToken", $('#FormDraftCosting input[name=__RequestVerificationToken]').val());

    debugger;
    $.ajax({
        url: url,
        type: 'POST',
        traditional: true,  
        data: formData,
        //data: {
        //    id: selectedId,
        //    formData
        //},
        contentType: false, // WAJIB: biar tidak default ke application/x-www-form-urlencoded
        processData: false, // WAJIB: jangan proses FormData jadi string
        datatype: "json",
        success: function (retDat) {
            debugger;
            if (retDat.bitSuccess == true) {
                debugger;
                p_DataToUI(retDat.objData);
                clsGlobal.swalSuccessSaveOrSubmit(retDat.txtMessage, window.indexUrl + "?id=" + retDat.objData.txtDraftCostingId);
                /*clsGlobal.swalSuccessSaveOrSubmit(retDat.txtMessage, window.indexUrl);*/
                //window.location.href = window.indexUrl;

            } else {
                /*toastr.error(retDat.txtMessage);*/
                clsGlobal.getAlert(retDat.message);
            }
        },
        error: function (xhr) {
            toastr.error("Error proceed data: " + xhr.responseText);
        }
    });
}

function getDocStatusFromRow(row) {
    let table = $("#tableDraftCosting").DataTable();
    let data = table.row(row).data();   // ambil array data row

    let colHtml = data[2]; // index ke-2 = txtDocStatus
    let docStatus = $(colHtml).find("input[name='txtDocStatus']").val();

    return (docStatus || "").trim();
}

function disableAllByRole() {

    if (!$('#approval-notice').length) {
        $('<div id="approval-notice" class="approval-notice">' +
            '<i class="fas fa-exclamation-circle me-2"></i>' +
            'The costing role is only allowed to process data.' +
            '</div>').insertAfter('.card-body h4');
    }

    const dtExceptions =
        '.dataTables_filter input, ' +
        '.dataTables_length select, ' +
        '.dataTables_paginate *, ' +
        '.dataTables_info';

    // Disable semua kecuali:
    // - hidden
    // - DataTables filter
    // - checkbox bitPrint
    $('input, select, textarea')
        .not('#btnView, input[type=hidden], .bit-print, #ddlToStatus')
        .not(dtExceptions)
        .prop('disabled', true);

    // ❌ Disable tombol delete (icon)
    $('.btn-delete-row').addClass('disabled')
        .css({ pointerEvents: 'none', opacity: 0.5 });

    // ❌ Sembunyikan tombol utama
    $('#btnNew, #btnUploadNutFact, #btnSubmitAll').addClass('d-none');
}

//=======================
// HANDLER
//=======================

$('#btnID').bind('click', function () {
    try {

        LOV = clsGlobal.generateLOV("COSTING_ID", "btnID");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});
$('#btnI2MSNo').bind('click', function () {
    try {

        LOV = clsGlobal.generateLOV("COSTING_I2MS_ACTIVE", "txtI2MSNo");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnProductCategory').bind('click', function () {
    try {

        LOV = clsGlobal.generateLOV("IDC_PRODUCTTYPE", "txtProductCategory");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$("#btnNew").on('click', function () {
    // Tambahkan flag agar tahu bahwa ini mode "new"
    sessionStorage.setItem("isNewMode", "true");

    window.location.href = base_path + `/DraftCosting`;   
    
});

$("#btnView").on('click', function () {
    // Tambahkan flag agar tahu bahwa ini mode "new"
    sessionStorage.setItem("isViewMode", "true");

    window.location.href = base_path + `/DraftCosting`;

});

$('#btnDownload').on('click', function (e) {
    debugger;
    e.preventDefault();
    debugger;
    ProjectDetail.DownloadTemplateDraftCosting();
});

$('#btnUploadNutFact').on('click', function (e) {
    e.preventDefault();

    ProjectDetail.UploadTemplateDraftCosting();

    $("#templateUploadNutriFact").val(null);
});

$('#btnSave').click(function () {
    debugger;
    const isEdit = parseInt($("#id").val()) > 0; // boolean: true or false
    const actionText = isEdit ? "update" : "save";
    showSaveConfirmation(actionText, isEdit);
});

$('#modalDetail').on('shown.bs.modal', function () {
    tableDraftCostingUpload.columns.adjust().draw(false);
});

$('#btnCancel').on('click', function () {
    try {
        // Tutup modal
        $('#modalDetail').modal('hide');

        // Bersihkan tabel detail
        let table = $('#tableDraftCostingUpload').DataTable();
        table.clear().draw(false);


        // Opsional: Bersihkan hidden GUID atau flag lain
        $('#txtGUID').val('');
        $('#txtHiddenObject').val('');
        $('#txtHiddenObjectList').val('');

    } catch (ex) {
        console.error("Cancel Error:", ex);
    }
});

function p_btnChangeStatus(intDraftCostingDetailId) {

    try {
        debugger;
        // Ambil semua data dari hidden object
        let obj = JSON.parse($("#txtHiddenObject").val());

        intDraftCostingDetailId = Number(intDraftCostingDetailId);

        let detail = obj.listVmDraftCostingDetail
            .find(x => Number(x.intDraftCostingDetailId) === intDraftCostingDetailId);

        if (!detail) {
            clsGlobal.getAlert("Detail not found!");
            return;
        }

        // Isi modal
        $("#txtStageCS").val(detail.txtStageDevelopment || "");
        $("#txtFormulaNoCS").val(detail.txtFormulaNo || "");
        $("#txtFormulaCommentCS").val(detail.txtFormulaComment || "");
        $("#txtVarianCS").val(detail.txtVarian || "");
        $("#decNettoGr").val(detail.decNettoGr || "");
        $("#decNettoMl").val(detail.decNettoMl || "");

        // simpan ID ke hidden supaya nanti dipakai waktu save
        $("#modalChangeStatus")
            .data("detail-id", intDraftCostingDetailId)
            .data("current-status", detail.txtDocStatus);           ;
        debugger;
        // buka modal
        $("#modalChangeStatus").modal("show");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}

//function p_btnChangeStatus() {
//    try {
//        $("#txtFromStatus").val($("#txtStatus").val());
//        $("#modalChangeStatus").modal("show");
//    } catch (ex) {
//        clsGlobal.showAlert(ex);
//    }
//}

//$('#modalChangeStatus').on('show.bs.modal', function () {
//    var currentStatus = $('#ddlToStatus').val().toUpperCase();
//    var ddl = $('#ddlToStatus');
//    ddl.empty(); // clear isi dropdown
//    debugger;
//    if (currentStatus === "SUBMIT TO FA") {
//        ddl.append('<option value="">-- Pilih Status --</option>');
//        ddl.append('<option value="APPROVED">APPROVED</option>');
//    } else {
//        ddl.append('<option value="">-- Pilih Status --</option>');
//        ddl.append('<option value="APPROVED">APPROVED</option>');
//        ddl.append('<option value="VERIFIED">VERIFIED</option>');
//    }

//    // set From Status sesuai kondisi
//    $('#ddlToStatus').val(currentStatus);
//});

$('#modalChangeStatus').on('show.bs.modal', function () {
    debugger;

    var modal = $(this);
    var currentStatus = (modal.data("current-status") || "").toUpperCase();
    var ddl = $('#ddlToStatus');

    ddl.empty();   

    if (currentStatus === "SUBMIT TO FA") {
        ddl.append('<option value="">-- Pilih Status --</option>');
        ddl.append('<option value="APPROVED">APPROVED</option>');
    } else if (currentStatus === "APPROVED") {
        ddl.append('<option value="">-- Pilih Status --</option>');
        ddl.append('<option value="VERIFIED">VERIFIED</option>');
    } else {
        ddl.append('<option value="">-- Pilih Status --</option>');
        ddl.append('<option value="APPROVED">APPROVED</option>');
        ddl.append('<option value="VERIFIED">VERIFIED</option>');
    }

    // set nilai awal dropdown (FROM STATUS)
    $('#ddlToStatus').val("");
});


function p_CHANGESTATUS() {
    clsGlobal.showLoading();
    try {
        // Ambil ID detail dari modal
        let intDraftCostingDetailId = $("#modalChangeStatus").data("detail-id");

        if (!intDraftCostingDetailId) {
            clsGlobal.getAlert("Detail ID not found!");
            clsGlobal.hideLoading();
            return;
        }

        let statusTo = $("#ddlToStatus").val();

        if (!statusTo) {
            clsGlobal.getAlert("Please select status to change!");
            clsGlobal.hideLoading();
            return;
        }

        // Prepare data
        var data = {
            intDraftCostingDetailId: Number(intDraftCostingDetailId),
            txtStatus: statusTo
        };

        $.ajax({
            type: "POST",
            url: "/DraftCosting/ChangeStatus",
            data: {
                data: JSON.stringify(data),
                __RequestVerificationToken: $('#FormDraftCosting input[name=__RequestVerificationToken]').val()
            },
            dataType: "json",
            success: function (retDat) {

                if (retDat.bitSuccess === true) {
                    $("#modalChangeStatus").modal("hide");

                    showSuccessStatusPopup(
                        "Update Status Success!",
                        retDat.objData.txtDraftCostingId
                    );

                } else {
                    clsGlobal.getAlert(retDat.message);
                }

                clsGlobal.hideLoading();
            },
            error: function (err) {
                clsGlobal.getAlert("Server error while updating status!");
                clsGlobal.hideLoading();
            }
        });
    }
    catch (ex) {
        clsGlobal.getAlert(ex);
        clsGlobal.hideLoading();
    }
}


function showSuccessStatusPopup(message) {
    $("#modalSuccessStatusBody").html(message || "Update Status Success.");
    $("#modalSuccessStatus").modal("show");
}

$(document).on("click", "#btnSuccessStatusOk", function () {
    var id = $("#txtDraftCostingId").val();
    if (id) {
        window.location.href = window.indexUrl + "?id=" + id;
    } else {
        $("#modalSuccessStatus").modal("hide");
    }
})

function submitDataAll() {
    debugger;

    let selectedId = getSelectedDetailIds();

    if (selectedId.length === 0) {
        alert("Silakan pilih row dengan mencentang kolom Check.");
        return;
    }

    // ======================================================
    // 🔥 VALIDASI DOCSTATUS
    // ======================================================
    let isSubmit = false;

    tableDraftCosting.rows().every(function () {
        let row = $(this.node());

        let isChecked = row.find("input[name='bitPrint']").is(":checked");
        if (!isChecked) return; // hanya cek yang dicentang

        let docStatus = getDocStatusFromRow(row);

        //if ((docStatus === "DRAFT") && (docStatus === "RECALCULATE")) {
        //    isSubmit = true;
        //}

        if (docStatus !== "DRAFT" && docStatus !== "RECALCULATE") {
            isSubmit = true;
        }
    });

    if (isSubmit) {
        alert("Hanya Doc ID dengan status DRAFT/RECALCULATE yang dapat diproses.");
        return;
    }
    // ======================================================

    p_UIToDataList();
    p_UIToData();

    const url = window.submitAllData;
    debugger;

    // Buat FormData untuk kirim file + data JSON
    const formData = new FormData();
    formData.append("data", $("#txtHiddenObject").val());
    // kirim array id (otomatis menjadi id[0], id[1]...)
    selectedId.forEach(i => formData.append("id", i));
    formData.append("__RequestVerificationToken", $('#FormDraftCosting input[name=__RequestVerificationToken]').val());

    debugger;
    $.ajax({
        url: url,
        type: 'POST',
        traditional: true,
        data: formData,
        //data: {
        //    id: selectedId,
        //    formData
        //},
        contentType: false, // WAJIB: biar tidak default ke application/x-www-form-urlencoded
        processData: false, // WAJIB: jangan proses FormData jadi string
        datatype: "json",
        success: function (retDat) {
            debugger;
            if (retDat.bitSuccess == true) {
                debugger;
                p_DataToUI(retDat.objData);
                clsGlobal.swalSuccessSaveOrSubmit(retDat.txtMessage, window.indexUrl + "?id=" + retDat.objData.txtDraftCostingId);
                /*clsGlobal.swalSuccessSaveOrSubmit(retDat.txtMessage, window.indexUrl);*/
                //window.location.href = window.indexUrl;

            } else {
                /*toastr.error(retDat.txtMessage);*/
                clsGlobal.getAlert(retDat.message);
            }
        },
        error: function (xhr) {
            toastr.error("Error submit data: " + xhr.responseText);
        }
    });
}

function showSubmitAllConfirmation(actionText) {
    debugger;
    Swal.fire({
        title: `Are you sure you want to ${actionText} the data?`,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: actionText.charAt(0).toUpperCase() + actionText.slice(1),
        denyButtonText: `Don't ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}`
    }).then((result) => {
        debugger;
        if (result.isConfirmed) {
            submitDataAll();
        } else if (result.isDenied) {
            Swal.fire(`Changes are not ${actionText}`, "", "info");
        }
    });
}
$('#btnSubmitAll').click(function () {
    debugger;
    const actionText = "Submit";
    showSubmitAllConfirmation(actionText);
});
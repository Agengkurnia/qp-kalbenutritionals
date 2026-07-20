//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
let currentBrandInput = null;

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
        $("#id").val(draftId);
        p_initiateData();
    } else {
        debugger;
        p_initiateData();

        // Kalau dari tombol New, aktifkan I2MS No
        if (isNewMode === "true") {
            $("#btnI2MSNo").prop("disabled", false);
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

var tableDraftCostingActual = $("#tableDraftCostingActual").DataTable({
    scrollX: true,
    scrollY: "500px",
    fixedHeader: true,
    scrollCollapse: true,
    renderer: "bootstrap",
    processing: true,
    bAutoWidth: false,
    paging: true,
    aLengthMenu: [[-1, 5, 10, 100], ["ALL", 5, 10, 100]],
    fixedColumns: { left: [4] },
    order: [[1, "asc"]],
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
            { visible: false, targets: [8] }
    ]
});

$(window).on('resize', function () {
    tableDraftCostingActual.columns.adjust().draw(false);
});

var tableDraftCostingBudget = $("#tableDraftCostingBudget").DataTable({
    scrollX: true,
    scrollY: "500px",
    fixedHeader: true,
    scrollCollapse: true,
    renderer: "bootstrap",
    processing: true,
    bAutoWidth: false,
    paging: true,
    aLengthMenu: [[-1, 5, 10, 100], ["ALL", 5, 10, 100]],
    fixedColumns: { left: [4] },
    order: [[1, "asc"]],
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
            { visible: false, targets: [8] }
    ]
});

$(window).on('resize', function () {
    tableDraftCostingBudget.columns.adjust().draw(false);
});

var tableDraftCostingPredictive = $("#tableDraftCostingPredictive").DataTable({
    scrollX: true,
    scrollY: "500px",
    fixedHeader: true,
    scrollCollapse: true,
    renderer: "bootstrap",
    processing: true,
    bAutoWidth: false,
    paging: true,
    aLengthMenu: [[-1, 5, 10, 100], ["ALL", 5, 10, 100]],
    fixedColumns: { left: [4] },
    order: [[1, "asc"]],
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
            { visible: false, targets: [8] }
    ]
});

$(window).on('resize', function () {
    tableDraftCostingPredictive.columns.adjust().draw(false);
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
    fixedColumns: { left: [4] },
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
    ]
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
            $("#txtI2MSNo").val(arr[1]);
            $("#txtProjectDesc").val(arr[2]);
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
    var a = $("#id").val();
    $.ajax({
        type: "POST",
        url: "/DraftCosting/InitiateDataDetail",
        data: {
            id: $("#id").val(),
            __RequestVerificationToken: $('#FormDraftCostingDetail input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    debugger;
                    $('#btnSave').removeClass('d-none');
                    $('#btnSubmit').removeClass('d-none');
                    $("#txtHiddenObject").val(JSON.stringify(retDat.objData));

                    p_DataToUI(retDat.objData);
                    //p_UIToDataList(retDat.objData.listVmDraftCostingDetailActual);

                    tableDraftCostingActual.clear().draw(false);

                    if (retDat.objData.listVmDraftCostingDetailActual != null) {
                        let details = retDat.objData.listVmDraftCostingDetailActual;
                        counter = 0;

                        for (let i = 0; i < details.length; i++) {
                            let d = details[i];
                            counter += 10; // <== kelipatan 10;
                            tableDraftCostingActual.row.add([
                                // intSequence
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:50px">
                                    <input type="text" class="form-control" name="intSequence"
                                        value="${Number(d.intSequence) || 0}" readonly>
                                </div>`,

                                // txtFormulaClass
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:100px">
                                    <input type="text" class="form-control" name="txtFormulaClass"
                                        value="${d.txtFormulaClass || ''}" readonly>
                                    <input type="hidden" name="intDraftCostingDetailActualId" value="${d.intDraftCostingDetailActualId || ''}">
                                </div>`,

                                // txtItemCode
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control" name="txtItemCode"
                                        value="${d.txtItemCode || ''}" readonly>
                                </div>`,

                                // txtIngredientCode
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control" name="txtIngredientCode"
                                        value="${d.txtIngredientCode || ''}" readonly>
                                </div>`,

                                // txtIngredientDesc
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                    <input type="text" class="form-control" name="txtIngredientDesc" value="${d.txtIngredientDesc || ''}" readonly>
                                </div>`,

                                // decOutput
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control" name="decOutput" value="${d.decOutput || ''}" readonly>
                                </div>`,

                                // txtUOMItemCode
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control" name="txtUOMItemCode" value="${d.txtUomitemCode || ''}" readonly>
                                </div>`,

                                // txtFormulaNo
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control" name="txtFormulaNo" value="${d.txtFormulaNo || ''}" readonly>
                                </div>`,

                                //intVersion
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control" name="intVersion" value="${d.intVersion || ''}" readonly>
                                </div>`,                               

                                // decQtyFormula
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control" name="decQtyFormula" value="${d.decQtyFormula || ''}" readonly>
                                </div>`,

                                // txtUomformula
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:70px">
                                    <input type="text" class="form-control" name="txtUomformula" value="${d.txtUomformula || ''}" readonly>
                                </div>`,

                                // decQtyPrimaryUom
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control" name="decQtyPrimaryUom"
                                        value="${d.decQtyPrimaryUom || ''}" readonly>
                                </div>`,

                                // txtPrimaryUom
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control" name="txtPrimaryUom" value="${d.txtPrimaryUom || ''}" readonly>
                                </div>`,

                                // decYield
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decYield" placeholder="0.00" value="${d.decYield || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decOutputAfterYield
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decOutputAfterYield" placeholder="0.00" value="${d.decOutputAfterYield || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decRm
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decRm" placeholder="0.00" value="${d.decRm || ''}" oninput="formatDecimal(this)" onchange="p_hiddenBtn()")>
                                </div>`,

                                // decPm
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decPm" placeholder="0.00" value="${d.decPm || ''}" oninput="formatDecimal(this)" onchange="p_hiddenBtn()">
                                </div>`,

                                // decFoh
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decFoh" placeholder="0.00" value="${d.decFoh || ''}" oninput="formatDecimal(this)" onchange="p_hiddenBtn()">
                                </div>`,

                                // decDl
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decDl" placeholder="0.00" value="${d.decDl || ''}" oninput="formatDecimal(this)" onchange="p_hiddenBtn()">
                                </div>`,

                                // decFreight
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decFreight" placeholder="0.00" value="${d.decFreight || ''}" oninput="formatDecimal(this)" onchange="p_hiddenBtn()">
                                </div>`,

                                // decFee
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decFee" placeholder="0.00" value="${d.decFee || ''}" oninput="formatDecimal(this)" onchange="p_hiddenBtn()">
                                </div>`,

                                // decDepr
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decDepr" placeholder="0.00" value="${d.decDepr || ''}" oninput="formatDecimal(this)" onchange="p_hiddenBtn()">
                                </div>`,

                                // decIdepr
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decIdepr" placeholder="0.00" value="${d.decIdepr || ''}" oninput="formatDecimal(this)" onchange="p_hiddenBtn()">
                                </div>`,

                                // decEnergy
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decEnergy" placeholder="0.00" value="${d.decEnergy || ''}" oninput="formatDecimal(this)" onchange="p_hiddenBtn()">
                                </div>`,

                                // decFg
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decFg" placeholder="0.00" value="${d.decFg || ''}" oninput="formatDecimal(this)" onchange="p_hiddenBtn()">
                                </div>`,

                                // decLanded
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decLanded" placeholder="0.00" value="${d.decLanded || ''}" oninput="formatDecimal(this)" onchange="p_hiddenBtn()">
                                </div>`,

                                // decIdl
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decIdl" placeholder="0.00" value="${d.decIdl || ''}" oninput="formatDecimal(this)" onchange="p_hiddenBtn()">
                                </div>`,

                                // decRepMai
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decRepMai" placeholder="0.00" value="${d.decRepMai || ''}" oninput="formatDecimal(this)" onchange="p_hiddenBtn()">
                                </div>`,

                                // decDlx
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decDlx" placeholder="0.00" value="${d.decDlx || ''}" oninput="formatDecimal(this)" onchange="p_hiddenBtn()">
                                </div>`,

                                // decDeprx
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decDeprx" placeholder="0.00" value="${d.decDeprx || ''}" oninput="formatDecimal(this)" onchange="p_hiddenBtn()">
                                </div>`,

                                // decFreightx
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decFreightx" placeholder="0.00" value="${d.decFreightx || ''}" oninput="formatDecimal(this)" onchange="p_hiddenBtn()">
                                </div>`,

                                // decRmValue
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decRmValue" placeholder="0.00" value="${d.decRmValue || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decPmValue
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decPmValue" placeholder="0.00" value="${d.decPmValue || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decFohValue
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decFohValue" placeholder="0.00" value="${d.decFohValue || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decDlValue
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decDlValue" placeholder="0.00" value="${d.decDlValue || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decFreightValue
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decFreightValue" placeholder="0.00" value="${d.decFreightValue || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decFeeValue
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decFeeValue" placeholder="0.00" value="${d.decFeeValue || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decDeprValue
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decDeprValue" placeholder="0.00" value="${d.decDeprValue || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decIdeprValue
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decIdeprValue" placeholder="0.00" value="${d.decIdeprValue || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decEnergyValue
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decEnergyValue" placeholder="0.00" value="${d.decEnergyValue || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decFgValue
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decFgValue" placeholder="0.00" value="${d.decFgValue || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decLandedValue
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decLandedValue" placeholder="0.00" value="${d.decLandedValue || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decIdlValue
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decIdlValue" placeholder="0.00" value="${d.decIdlValue || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decRepMaiValue
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decRepMaiValue" placeholder="0.00" value="${d.decRepMaiValue || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decDlxValue
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decDlxValue" placeholder="0.00" value="${d.decDlxValue || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decDeprxValue
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decDeprxValue" placeholder="0.00" value="${d.decDeprxValue || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decFreightxValue
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decFreightxValue" placeholder="0.00" value="${d.decFreightxValue || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decTotalValue
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decTotalValue" placeholder="0.00" value="${d.decTotalValue || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decRmUnit
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decRmUnit" placeholder="0.00" value="${d.decRmUnit || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decPmUnit
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decPmUnit" placeholder="0.00" value="${d.decPmUnit || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decFohUnit
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decFohUnit" placeholder="0.00" value="${d.decFohUnit || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decDlUnit
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decDlUnit" placeholder="0.00" value="${d.decDlUnit || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decFreightUnit
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decFreightUnit" placeholder="0.00" value="${d.decFreightUnit || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decFeeUnit
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decFeeUnit" placeholder="0.00" value="${d.decFeeUnit || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decDeprUnit
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decDeprUnit" placeholder="0.00" value="${d.decDeprUnit || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decIdeprUnit
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decIdeprUnit" placeholder="0.00" value="${d.decIdeprUnit || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decEnergyUnit
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decEnergyUnit" placeholder="0.00" value="${d.decEnergyUnit || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decFgUnit
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decFgUnit" placeholder="0.00" value="${d.decFgUnit || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decLandedUnit
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decLandedUnit" placeholder="0.00" value="${d.decLandedUnit || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decIdlUnit
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decIdlUnit" placeholder="0.00" value="${d.decIdlUnit || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decRepMaiUnit
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decRepMaiUnit" placeholder="0.00" value="${d.decRepMaiUnit || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decDlxUnit
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decDlxUnit" placeholder="0.00" value="${d.decDlxUnit || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decDeprxUnit
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decDeprxUnit" placeholder="0.00" value="${d.decDeprxUnit || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decFreightxUnit
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decFreightxUnit" placeholder="0.00" value="${d.decFreightxUnit || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decTotalUnit
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decTotalUnit" placeholder="0.00" value="${d.decTotalUnit || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,
                                
                            ]).draw(false);
                        }
                    }

                    tableDraftCostingBudget.clear().draw(false);

                    if (retDat.objData.listVmDraftCostingDetailBudget != null) {
                        let budgets = retDat.objData.listVmDraftCostingDetailBudget;
                        counter = 0;

                        for (let i = 0; i < budgets.length; i++) {
                            let d = budgets[i];
                            counter += 10; // <== kelipatan 10;
                            tableDraftCostingBudget.row.add([
                                // intSequence
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:50px">
                                    <input type="text" class="form-control" name="intSequence_Budget"
                                        value="${d.intSequence || ''}" readonly>
                                </div>`,

                                // txtFormulaClass
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:100px">
                                    <input type="text" class="form-control" name="txtFormulaClass_Budget"
                                        value="${d.txtFormulaClass || ''}" readonly>
                                    <input type="hidden" name="intDraftCostingDetailBudgetId" value="${d.intDraftCostingDetailBudgetId || ''}">
                                </div>`,

                                // txtItemCode
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control" name="txtItemCode_Budget"
                                        value="${d.txtItemCode || ''}" readonly>
                                </div>`,

                                // txtIngredientCode
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control" name="txtIngredientCode_Budget"
                                        value="${d.txtIngredientCode || ''}" readonly>
                                </div>`,

                                // txtIngredientDesc
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                    <input type="text" class="form-control" name="txtIngredientDesc_Budget" value="${d.txtIngredientDesc || ''}" readonly>
                                </div>`,

                                // decOutput
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control" name="decOutput_Budget" value="${d.decOutput || ''}" readonly>
                                </div>`,

                                // txtUOMItemCode
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control" name="txtUOMItemCode_Budget" value="${d.txtUomitemCode || ''}" readonly>
                                </div>`,

                                // txtFormulaNo
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                    <input type="text" class="form-control" name="txtFormulaNo_Budget" value="${d.txtFormulaNo || ''}" readonly>
                                </div>`,

                                //intVersion
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                    <input type="text" class="form-control" name="intVersion_Budget" value="${d.intVersion || ''}" readonly>
                                </div>`,                              

                                // decQtyFormula
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                    <input type="text" class="form-control" name="decQtyFormula_Budget" value="${d.decQtyFormula || ''}" readonly>
                                </div>`,

                                // txtUomformula
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:70px">
                                    <input type="text" class="form-control" name="txtUomformula_Budget" value="${d.txtUomformula || ''}" readonly>
                                </div>`,

                                // decQtyPrimaryUom
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                    <input type="text" class="form-control" name="decQtyPrimaryUom_Budget"
                                        value="${d.decQtyPrimaryUom || ''}" readonly>
                                </div>`,

                                // txtPrimaryUom
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                    <input type="text" class="form-control" name="txtPrimaryUom_Budget" value="${d.txtPrimaryUom || ''}" readonly>
                                </div>`,

                                // decYield
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decYield_Budget" placeholder="0.00" value="${d.decYield || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decOutputAfterYield
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decOutputAfterYield_Budget" placeholder="0.00" value="${d.decOutputAfterYield || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decRm
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decRm_Budget" placeholder="0.00" value="${d.decRm || ''}" oninput="formatDecimal(this)" onchange="p_hiddenBtn()">
                                </div>`,

                                // decPm
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decPm_Budget" placeholder="0.00" value="${d.decPm || ''}" oninput="formatDecimal(this)" onchange="p_hiddenBtn()">
                                </div>`,

                                // decRmUnit
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decRmUnit_Budget" placeholder="0.00" value="${d.decRmUnit || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decPmUnit
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decPmUnit_Budget" placeholder="0.00" value="${d.decPmUnit || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                            ]).draw(false);
                        }
                    }

                    tableDraftCostingPredictive.clear().draw(false);

                    if (retDat.objData.listVmDraftCostingDetailPredictive != null) {
                        let predictives = retDat.objData.listVmDraftCostingDetailPredictive;
                        counter = 0;

                        for (let i = 0; i < predictives.length; i++) {
                            let d = predictives[i];
                            counter += 10; // <== kelipatan 10;
                            tableDraftCostingPredictive.row.add([
                                // intSequence
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:50px">
                                    <input type="text" class="form-control" name="intSequence_Predictive"
                                        value="${d.intSequence || ''}" readonly>
                                </div>`,

                                // txtFormulaClass
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:100px">
                                    <input type="text" class="form-control" name="txtFormulaClass_Predictive"
                                        value="${d.txtFormulaClass || ''}" readonly>
                                    <input type="hidden" name="intDraftCostingDetailPredictiveId" value="${d.intDraftCostingDetailPredictiveId || ''}">
                                </div>`,

                                // txtItemCode
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control" name="txtItemCode_Predictive"
                                        value="${d.txtItemCode || ''}" readonly>
                                </div>`,

                                // txtIngredientCode
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control" name="txtIngredientCode_Predictive"
                                        value="${d.txtIngredientCode || ''}" readonly>
                                </div>`,

                                // txtIngredientDesc
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                    <input type="text" class="form-control" name="txtIngredientDesc_Predictive" value="${d.txtIngredientDesc || ''}" readonly>
                                </div>`,

                                // decOutput
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control" name="decOutput_Predictive" value="${d.decOutput || ''}" readonly>
                                </div>`,

                                // txtUOMItemCode
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control" name="txtUOMItemCode_Predictive" value="${d.txtUomitemCode || ''}" readonly>
                                </div>`,

                                // txtFormulaNo
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                    <input type="text" class="form-control" name="txtFormulaNo_Predictive" value="${d.txtFormulaNo || ''}" readonly>
                                </div>`,

                                //intVersion
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                    <input type="text" class="form-control" name="intVersion_Predictive" value="${d.intVersion || ''}" readonly>
                                </div>`,                                

                                // decQtyFormula
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                    <input type="text" class="form-control" name="decQtyFormula_Predictive" value="${d.decQtyFormula || ''}" readonly>
                                </div>`,

                                // txtUomformula
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:70px">
                                    <input type="text" class="form-control" name="txtUomformula_Predictive" value="${d.txtUomformula || ''}" readonly>
                                </div>`,

                                // decQtyPrimaryUom
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                    <input type="text" class="form-control" name="decQtyPrimaryUom_Predictive"
                                        value="${d.decQtyPrimaryUom || ''}" readonly>
                                </div>`,

                                // txtPrimaryUom
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                    <input type="text" class="form-control" name="txtPrimaryUom_Predictive" value="${d.txtPrimaryUom || ''}" readonly>
                                </div>`,

                                // decYield
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decYield_Predictive" placeholder="0.00" value="${d.decYield || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decOutputAfterYield
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decOutputAfterYield_Predictive" placeholder="0.00" value="${d.decOutputAfterYield || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decRm
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decRm_Predictive" placeholder="0.00" value="${d.decRm || ''}" oninput="formatDecimal(this)" onchange="p_hiddenBtn()">
                                </div>`,

                                // decPm
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decPm_Predictive" placeholder="0.00" value="${d.decPm || ''}" oninput="formatDecimal(this)" onchange="p_hiddenBtn()">
                                </div>`,

                                // decRmUnit
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decRmUnit_Predictive" placeholder="0.00" value="${d.decRmUnit || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                                // decPmUnit
                                `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                                    <input type="text" class="form-control decimal-input" name="decPmUnit_Predictive" placeholder="0.00" value="${d.decPmUnit || ''}" oninput="formatDecimal(this)" readonly>
                                </div>`,

                            ]).draw(false);
                        }
                    }

                    let status = (retDat.objData.txtDocStatus || "").toUpperCase();
                    debugger;
                    if (status !== "DRAFT" && status !== "NEW" && status !== "RECALCULATE" && status !== "SUBMIT TO FA") {
                        // Semua status selain DRAFT NEW & RECALCULATE masuk sini
                        disableAllForApproval();

                        //// Jika ada yang tetap boleh di-enable, taruh di sini:
                        //$('#ddlToStatus').prop('disabled', false);
                        //$('#txtNote').prop('disabled', false);
                    }

                    if (status === "SUBMIT TO FA") {
                        debugger;
                        if (retDat.objData.txtRoleUser === "CST") {

                            $('#btnSubmit').addClass('d-none');
                            

                        } else {
                            if (retDat.objData.txtRoleUser !== "IT") {

                                disableAllForApproval();

                            }
                            
                        }
                        
                    }

                } else {
                    p_showBlank();
                }
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }
            clsGlobal.hideLoading();
        },
        error: function (retDat) {
            clsGlobal.hideLoading();
        }
    });
}

function p_DataToUI(objData) {
    debugger;

    // ID & GUID
    $("#id").val(clsGlobal.parseToInteger(objData.intDraftCostingDetailId));
    $("#txtDraftCostingDetailId").val(clsGlobal.parseToString(objData.txtDraftCostingDetailId));
    $("#intDraftCostingHeaderId").val(clsGlobal.parseToInteger(objData.intDraftCostingHeaderId));
    $("#intSequence").val(clsGlobal.parseToInteger(objData.intSequence));
    $("#intDocId").val(clsGlobal.parseToInteger(objData.intDocId));

    // Text fields
    $("#txtStageDevelopment").val(clsGlobal.parseToString(objData.txtStageDevelopment));
    $("#txtProductNo").val(clsGlobal.parseToString(objData.txtProductNo));
    $("#txtFormulaNo").val(clsGlobal.parseToString(objData.txtFormulaNo));
    $("#intVersion").val(clsGlobal.parseToInteger(objData.intVersion));
    $("#txtFormulaComment").val(clsGlobal.parseToString(objData.txtFormulaComment));
    $("#txtItemCodeFG").val(clsGlobal.parseToString(objData.txtProductNo));
    $("#txtItemDesc").val(clsGlobal.parseToString(objData.txtItemDesc));
    $("#decQtyOutput").val(clsGlobal.parseToDecimal(objData.decQtyOutput));
    $("#txtUom").val(clsGlobal.parseToString(objData.txtUom));
    $("#txtItemMapping").val(clsGlobal.parseToString(objData.txtItemapping));
    $("#txtItemMappingFG").val(clsGlobal.parseToString(objData.txtItemMappingFg));
    $("#txtI2MSNo").val(clsGlobal.parseToString(objData.txtI2msno));
    $("#txtBrand").val(clsGlobal.parseToString(objData.txtBrand));
    $("#txtSubbrand").val(clsGlobal.parseToString(objData.txtSubbrand));
    $("#txtVarian").val(clsGlobal.parseToString(objData.txtVarian));
    $("#decNettoGr").val(clsGlobal.parseToDecimal(objData.decNettoGr));
    $("#decNettoMl").val(clsGlobal.parseToDecimal(objData.decNettoMl));
    $("#txtPOTSBase").val(clsGlobal.parseToString(objData.txtPots));
    $("#txtPOTSFG").val(clsGlobal.parseToString(objData.txtPotsFg));
    $("#txtProductionLineFg").val(clsGlobal.parseToString(objData.txtProductionLineFg));
    $("#txtDocStatus").val(clsGlobal.parseToString(objData.txtDocStatus));
    $("#decHJP").val(formatDecimalValueFixed(objData.decHjp));
    $("#decTollFeeFg").val(formatDecimalValueFixed(objData.decTollFeeFg));
    $("#decTollFeeBase").val(formatDecimalValueFixed(objData.decTollFeeBase));
    $("#decFreightFgcost").val(formatDecimalValueFixed(objData.decFreightFgcost));
    $("#decUnitVolume").val(clsGlobal.parseToDecimal(objData.decUnitVolume));
    $("#decConvCost").val(formatDecimalValueFixed(objData.decConvCost));
    $("#decDepreInvest").val(formatDecimalValueFixed(objData.decDepreInvest));

    // Created / Updated info
    $("#txtCreatedBy").val(clsGlobal.parseToString(objData.txtCreatedBy));
    $("#txtUpdatedBy").val(clsGlobal.parseToString(objData.txtUpdatedBy));

    // Format tanggal created & updated
    if (objData.dtmCreatedDate) {
        let d = new Date(objData.dtmCreatedDate);
        let year = d.getFullYear();
        let month = (d.getMonth() + 1).toString().padStart(2, "0");
        let day = d.getDate().toString().padStart(2, "0");
        $('#dtmCreatedDate').val(`${day}-${month}-${year}`);
    } else {
        $('#dtmCreatedDate').val('');
    }

    if (objData.dtmUpdatedDate) {
        let d = new Date(objData.dtmUpdatedDate);
        let year = d.getFullYear();
        let month = (d.getMonth() + 1).toString().padStart(2, "0");
        let day = d.getDate().toString().padStart(2, "0");
        $('#dtmUpdatedDate').val(`${day}-${month}-${year}`);
    } else {
        $('#dtmUpdatedDate').val('');
    }

    // Kalau ada list Actual (child data)
    //if (objData.listVmDraftCostingDetailActual && objData.listVmDraftCostingDetailActual.length > 0) {
    //    tableDraftCosting.clear().rows.add(objData.listVmDraftCostingDetailActual).draw();
    //} else {
    //    tableDraftCosting.clear().draw();
    //}
    tableDraftCostingActual.clear().draw();
    tableDraftCostingBudget.clear().draw();
    tableDraftCostingPredictive.clear().draw();

    // Simpan data hidden (kalau diperlukan untuk post balik)
    $("#txtHiddenObject").val(JSON.stringify(objData));
}


function p_UIToData() {
    debugger;

    var htmlJSON = $("#txtHiddenObject").val();
    let jsonData = JSON.parse(htmlJSON);

    // === HEADER ===
    jsonData.intDraftCostingDetailId = clsGlobal.parseToInteger($("#id").val());
    jsonData.txtDraftCostingDetailId = $("#txtDraftCostingDetailId").val();
    jsonData.intDraftCostingHeaderId = clsGlobal.parseToInteger($("#intDraftCostingHeaderId").val());
    jsonData.intSequence = clsGlobal.parseToInteger($("#intSequence").val());
    jsonData.intDocId = clsGlobal.parseToInteger($("#intDocId").val());

    jsonData.txtStageDevelopment = $("#txtStageDevelopment").val();
    jsonData.txtProductNo = $("#txtProductNo").val();
    jsonData.txtFormulaNo = $("#txtFormulaNo").val();
    jsonData.intVersion = clsGlobal.parseToInteger($("#intVersion").val());
    jsonData.txtFormulaComment = $("#txtFormulaComment").val();
    jsonData.txtItemCodeFG = $("#txtItemCodeFG").val();
    jsonData.txtItemDesc = $("#txtItemDesc").val();
    jsonData.decQtyOutput = clsGlobal.parseToDecimal($("#decQtyOutput").val());
    jsonData.txtUom = $("#txtUom").val();
    jsonData.txtItemapping = $("#txtItemMapping").val();
    jsonData.txtItemMappingFg = $("#txtItemMappingFG").val();

    jsonData.txtI2msno = $("#txtI2MSNo").val();
    jsonData.txtBrand = $("#txtBrand").val();
    jsonData.txtSubbrand = $("#txtSubbrand").val();
    jsonData.txtVarian = $("#txtVarian").val();

    jsonData.decNettoGr = clsGlobal.parseToDecimal($("#decNettoGr").val());
    jsonData.decNettoMl = clsGlobal.parseToDecimal($("#decNettoMl").val());
    jsonData.txtPots = $("#txtPOTS").val();
    jsonData.txtProductionLine = $("#txtProductionLine").val();
    jsonData.txtDocStatus = $("#txtDocStatus").val();

    jsonData.decHjp = clsGlobal.parseToDecimal($("#decHJP").val());
    jsonData.decTollFeeFg = clsGlobal.parseToDecimal($("#decTollFeeFg").val());
    jsonData.decTollFeeBase = clsGlobal.parseToDecimal($("#decTollFeeBase").val());
    jsonData.decFreightFgcost = clsGlobal.parseToDecimal($("#decFreightFgcost").val());
    jsonData.decUnitVolume = clsGlobal.parseToDecimal($("#decUnitVolume").val());
    jsonData.decConvCost = clsGlobal.parseToDecimal($("#decConvCost").val());
    jsonData.decDepreInvest = clsGlobal.parseToDecimal($("#decDepreInvest").val());

    // === CREATED & UPDATED ===
    jsonData.txtCreatedBy = $("#txtCreatedBy").val();
    jsonData.txtUpdatedBy = $("#txtUpdatedBy").val();
    jsonData.dtmCreatedDate = $("#dtmCreatedDate").val();
    jsonData.dtmUpdatedDate = $("#dtmUpdatedDate").val();

    // === ACTUAL LIST ===
    // HARUS PARSE !!! supaya tidak jadi string JSON
    let listActual = $("#txtHiddenObjectList").val();
    jsonData.listVmDraftCostingDetailActual = listActual ? JSON.parse(listActual) : [];

    let listBudget = $("#txtHiddenObjectListBudget").val();
    jsonData.listVmDraftCostingDetailBudget = listBudget ? JSON.parse(listBudget) : [];

    let listPredictive = $("#txtHiddenObjectListPredictive").val();
    jsonData.listVmDraftCostingDetailPredictive = listPredictive ? JSON.parse(listPredictive) : [];

    // SAVE kembali ke hidden
    $("#txtHiddenObject").val(JSON.stringify(jsonData));
}

function p_UIToDataList() {
    var dataList = [];

    var table = $("#tableDraftCostingActual").DataTable();
    debugger;
    table.rows().every(function () {
        var row = $(this.node());

        if (row.hasClass("dataTables_empty")) return;

        let obj = {
            intSequence: Number(row.find("input[name=intSequence]").val()) || 0,
            txtFormulaClass: row.find("input[name=txtFormulaClass]").val() || "",
            txtItemCode: row.find("input[name=txtItemCode]").val() || "",
            txtIngredientCode: row.find("input[name=txtIngredientCode]").val() || "",
            txtIngredientDesc: row.find("input[name=txtIngredientDesc]").val() || "",
            decOutput: clsGlobal.parseToDecimal(row.find("input[name=decOutput]").val()) || 0,
            txtUomitemCode: row.find("input[name=txtUOMItemCode]").val() || "",
            txtFormulaNo: row.find("input[name=txtFormulaNo]").val() || "",
            intVersion: Number(row.find("input[name=intVersion]").val()) || 0,
            decQtyFormula: clsGlobal.parseToDecimal(row.find("input[name=decQtyFormula]").val()) || 0,
            txtUomformula: row.find("input[name=txtUomformula]").val() || "",
            decQtyPrimaryUom: clsGlobal.parseToDecimal(row.find("input[name=decQtyPrimaryUom]").val()) || 0,
            txtPrimaryUom: row.find("input[name=txtPrimaryUom]").val() || "",

            // Editable decimal-input fields
            decYield: clsGlobal.parseToDecimal(row.find("input[name=decYield]").val()) || 0,
            decOutputAfterYield: clsGlobal.parseToDecimal(row.find("input[name=decOutputAfterYield]").val()) || 0,
            decRm: clsGlobal.parseToDecimal(row.find("input[name=decRm]").val()) || 0,
            decPm: clsGlobal.parseToDecimal(row.find("input[name=decPm]").val()) || 0,
            decFoh: clsGlobal.parseToDecimal(row.find("input[name=decFoh]").val()) || 0,
            decDl: clsGlobal.parseToDecimal(row.find("input[name=decDl]").val()) || 0,
            decFreight: clsGlobal.parseToDecimal(row.find("input[name=decFreight]").val()) || 0,
            decFee: clsGlobal.parseToDecimal(row.find("input[name=decFee]").val()) || 0,
            decDepr: clsGlobal.parseToDecimal(row.find("input[name=decDepr]").val()) || 0,
            decIdepr: clsGlobal.parseToDecimal(row.find("input[name=decIdepr]").val()) || 0,
            decEnergy: clsGlobal.parseToDecimal(row.find("input[name=decEnergy]").val()) || 0,
            decFg: clsGlobal.parseToDecimal(row.find("input[name=decFg]").val()) || 0,
            decLanded: clsGlobal.parseToDecimal(row.find("input[name=decLanded]").val()) || 0,
            decIdl: clsGlobal.parseToDecimal(row.find("input[name=decIdl]").val()) || 0,
            decRepMai: clsGlobal.parseToDecimal(row.find("input[name=decRepMai]").val()) || 0,
            decDlx: clsGlobal.parseToDecimal(row.find("input[name=decDlx]").val()) || 0,
            decDeprx: clsGlobal.parseToDecimal(row.find("input[name=decDeprx]").val()) || 0,
            decFreightx: clsGlobal.parseToDecimal(row.find("input[name=decFreightx]").val()) || 0,

            // Value Columns
            decRmValue: clsGlobal.parseToDecimal(row.find("input[name=decRmValue]").val()) || 0,
            decPmValue: clsGlobal.parseToDecimal(row.find("input[name=decPmValue]").val()) || 0,
            decFohValue: clsGlobal.parseToDecimal(row.find("input[name=decFohValue]").val()) || 0,
            decDlValue: clsGlobal.parseToDecimal(row.find("input[name=decDlValue]").val()) || 0,
            decFreightValue: clsGlobal.parseToDecimal(row.find("input[name=decFreightValue]").val()) || 0,
            decFeeValue: clsGlobal.parseToDecimal(row.find("input[name=decFeeValue]").val()) || 0,
            decDeprValue: clsGlobal.parseToDecimal(row.find("input[name=decDeprValue]").val()) || 0,
            decIdeprValue: clsGlobal.parseToDecimal(row.find("input[name=decIdeprValue]").val()) || 0,
            decEnergyValue: clsGlobal.parseToDecimal(row.find("input[name=decEnergyValue]").val()) || 0,
            decFgValue: clsGlobal.parseToDecimal(row.find("input[name=decFgValue]").val()) || 0,
            decLandedValue: clsGlobal.parseToDecimal(row.find("input[name=decLandedValue]").val()) || 0,
            decIdlValue: clsGlobal.parseToDecimal(row.find("input[name=decIdlValue]").val()) || 0,
            decRepMaiValue: clsGlobal.parseToDecimal(row.find("input[name=decRepMaiValue]").val()) || 0,
            decDlxValue: clsGlobal.parseToDecimal(row.find("input[name=decDlxValue]").val()) || 0
        };

        dataList.push(obj);
    });

    $("#txtHiddenObjectList").val(JSON.stringify(dataList));
}
function p_UIToDataListBudget() {
    var dataList = [];

    var table = $("#tableDraftCostingBudget").DataTable();
    debugger;
    table.rows().every(function () {
        var row = $(this.node());

        if (row.hasClass("dataTables_empty")) return;

        let obj = {
            intSequence: Number(row.find("input[name=intSequence_Budget]").val()) || 0,
            txtFormulaClass: row.find("input[name=txtFormulaClass_Budget]").val() || "",
            txtItemCode: row.find("input[name=txtItemCode_Budget]").val() || "",
            txtIngredientCode: row.find("input[name=txtIngredientCode_Budget]").val() || "",
            txtIngredientDesc: row.find("input[name=txtIngredientDesc_Budget]").val() || "",
            decOutput: clsGlobal.parseToDecimal(row.find("input[name=decOutput_Budget]").val()) || 0,
            txtUomitemCode: row.find("input[name=txtUOMItemCode_Budget]").val() || "",
            txtFormulaNo: row.find("input[name=txtFormulaNo_Budget]").val() || "",
            intVersion: Number(row.find("input[name=intVersion_Budget]").val()) || 0,
            decQtyFormula: clsGlobal.parseToDecimal(row.find("input[name=decQtyFormula_Budget]").val()) || 0,
            txtUomformula: row.find("input[name=txtUomformula_Budget]").val() || "",
            decQtyPrimaryUom: clsGlobal.parseToDecimal(row.find("input[name=decQtyPrimaryUom_Budget]").val()) || 0,
            txtPrimaryUom: row.find("input[name=txtPrimaryUom_Budget]").val() || "",

            // Editable decimal-input fields
            decYield: clsGlobal.parseToDecimal(row.find("input[name=decYield_Budget]").val()) || 0,
            decOutputAfterYield: clsGlobal.parseToDecimal(row.find("input[name=decOutputAfterYield_Budget]").val()) || 0,
            decRm: clsGlobal.parseToDecimal(row.find("input[name=decRm_Budget]").val()) || 0,
            decPm: clsGlobal.parseToDecimal(row.find("input[name=decPm_Budget]").val()) || 0
        };

        dataList.push(obj);
    });

    $("#txtHiddenObjectListBudget").val(JSON.stringify(dataList));
}
function p_UIToDataListPredictive() {
    var dataList = [];

    var table = $("#tableDraftCostingPredictive").DataTable();
    debugger;
    table.rows().every(function () {
        var row = $(this.node());

        if (row.hasClass("dataTables_empty")) return;

        let obj = {
            intSequence: Number(row.find("input[name=intSequence_Predictive]").val()) || 0,
            txtFormulaClass: row.find("input[name=txtFormulaClass_Predictive]").val() || "",
            txtItemCode: row.find("input[name=txtItemCode_Predictive]").val() || "",
            txtIngredientCode: row.find("input[name=txtIngredientCode_Predictive]").val() || "",
            txtIngredientDesc: row.find("input[name=txtIngredientDesc_Predictive]").val() || "",
            decOutput: clsGlobal.parseToDecimal(row.find("input[name=decOutput_Predictive]").val()) || 0,
            txtUomitemCode: row.find("input[name=txtUOMItemCode_Predictive]").val() || "",
            txtFormulaNo: row.find("input[name=txtFormulaNo_Predictive]").val() || "",
            intVersion: Number(row.find("input[name=intVersion_Predictive]").val()) || 0,
            decQtyFormula: clsGlobal.parseToDecimal(row.find("input[name=decQtyFormula_Predictive]").val()) || 0,
            txtUomformula: row.find("input[name=txtUomformula_Predictive]").val() || "",
            decQtyPrimaryUom: clsGlobal.parseToDecimal(row.find("input[name=decQtyPrimaryUom_Predictive]").val()) || 0,
            txtPrimaryUom: row.find("input[name=txtPrimaryUom_Predictive]").val() || "",

            // Editable decimal-input fields
            decYield: clsGlobal.parseToDecimal(row.find("input[name=decYield_Predictive]").val()) || 0,
            decOutputAfterYield: clsGlobal.parseToDecimal(row.find("input[name=decOutputAfterYield_Predictive]").val()) || 0,
            decRm: clsGlobal.parseToDecimal(row.find("input[name=decRm_Predictive]").val()) || 0,
            decPm: clsGlobal.parseToDecimal(row.find("input[name=decPm_Predictive]").val()) || 0
        };

        dataList.push(obj);
    });

    $("#txtHiddenObjectListPredictive").val(JSON.stringify(dataList));
}
function inisiasiActual() {
    // Set tab header
    document.getElementById('Budget').classList.remove('active-tab');
    document.getElementById('Predictive').classList.remove('active-tab');

    document.getElementById('Actual').classList.add('active-tab');

    // Hide other tab content
    const budTab = document.getElementById('form-tabs-Budget');
    budTab.classList.remove('show', 'active');

    const predTab = document.getElementById('form-tabs-Predictive');
    predTab.classList.remove('show', 'active');


    // Show tab content
    const actTab = document.getElementById('form-tabs-Actual');
    actTab.classList.add('show', 'active');

    setTimeout(() => {
        tableDraftCostingActual.columns.adjust().draw();
    }, 200);
}

function inisiasiBudget() {
    // Set tab header
    document.getElementById('Actual').classList.remove('active-tab');
    document.getElementById('Predictive').classList.remove('active-tab');

    document.getElementById('Budget').classList.add('active-tab');

    // Hide other tab content
    const actTab = document.getElementById('form-tabs-Actual');
    actTab.classList.remove('show', 'active');

    const predTab = document.getElementById('form-tabs-Predictive');
    predTab.classList.remove('show', 'active');


    // Show tab content
    const budTab = document.getElementById('form-tabs-Budget');
    budTab.classList.add('show', 'active');

    setTimeout(() => {
        tableDraftCostingBudget.columns.adjust().draw();
    }, 200);
}

function inisiasiPredictive() {
    // Set tab header
    document.getElementById('Actual').classList.remove('active-tab');
    document.getElementById('Budget').classList.remove('active-tab');

    document.getElementById('Predictive').classList.add('active-tab');

    // Hide other tab content
    const actTab = document.getElementById('form-tabs-Actual');
    actTab.classList.remove('show', 'active');

    const budTab = document.getElementById('form-tabs-Budget');
    budTab.classList.remove('show', 'active');


    // Show tab content
    const predTab = document.getElementById('form-tabs-Predictive');
    predTab.classList.add('show', 'active');

    setTimeout(() => {
        tableDraftCostingPredictive.columns.adjust().draw();
    }, 200);
}


function p_hiddenBtn() {
    $('#btnSave').addClass('d-none');
    $('#btnSubmit').addClass('d-none');
}
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
    if (value == null) return "0";
    let formatted = formatDecimalValue(value);
    debugger;
    // 🔹 Jika kosong atau nol → tetap "0"
    if (formatted === "" || formatted === "0") {
        return "0";
    }

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

    if (parts.length > 2) {
        decPart = parts.slice(1).join('');
    }

    decPart = decPart.substring(0, 2);
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    let formatted = decPart.length > 0
        ? `${intPart}.${decPart}`
        : (hasTrailingDot ? `${intPart}.` : intPart);

    input.value = formatted;

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
            e.target.value = `${intPart}.00`;
        }
    }
}, true); // Gunakan `true` agar blur bisa ditangkap (karena blur tidak bubble)

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


    UploadTemplateRule: function () {
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
                    $("#txtHiddenObject").val(JSON.stringify(retDat.objData[0]));
                    debugger;
                    tableDraftCosting.clear().draw(false);
                    debugger;

                    for (var i = 0; i < retDat.objData.length; i++) {
                        var d = retDat.objData[i];
                        counter++;
                        tableDraftCosting.row.add([
                            counter,

                            // Category
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <input type="text" class="form-control" name="txtCategory" value="${d.listMMatrixRuleDetail[0].txtCategory || ''}" readonly>
                        </div>`,
                            // Grand Parent
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <input type="text" class="form-control" name="txtGrandParent" value="${d.listMMatrixRuleDetail[0].txtGrandParent || ''}" readonly>
                        </div>`,
                            // Parent
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <input type="text" class="form-control" name="txtParent" value="${d.listMMatrixRuleDetail[0].txtParent || ''}" readonly>
                        </div>`,
                            // RM Code
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                             <input type="text" class="form-control" name="txtRMCode" value="${d.listMMatrixRuleDetail[0].txtRmcode || ''}" readonly>
                        </div>`,
                            // RM Description
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <textarea class="form-control" name="txtRMDescription" readonly rows="3">${d.listMMatrixRuleDetail[0].txtRmdesc || ''}</textarea>
                        </div>`,
                            // Brand
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <input type="text" class="form-control" name="txtBrand" value="${d.listMMatrixRuleDetail[0].txtBrand || ''}" readonly>
                        </div>`,
                            // MatrixRule
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <input type="text" class="form-control" name="intMatrixRule" value="${d.listMMatrixRuleDetail[0].intMatrixRule || ''}" readonly>
                        </div>`
                        ]).draw(false);
                    }
                    $('#btnEdit').prop('disabled', false);
                    p_updateRangeFormula();
                    showSuccessPopup("File berhasil diupload!");

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
function showSubmitConfirmation(actionText, isEdit) {
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
            submitDetailData(isEdit);
        } else if (result.isDenied) {
            Swal.fire(`Changes are not ${actionText}`, "", "info");
        }
    });
}
function saveData(isEdit) {
    debugger;

    p_UIToData();

    const url = window.updateUrl;
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
                clsGlobal.swalSuccessSaveOrSubmit(retDat.txtMessage, window.detailUrl + "?id=" + retDat.objData.intDraftCostingDetailId);
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
function submitDetailData(isEdit) {
    debugger;

    p_UIToData();

    const url = window.submitdetailUrl;
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

function disableAllForApproval() {

    // Tambahkan notice jika belum ada
    if (!$('#approval-notice').length) {
        $('<div id="approval-notice" class="approval-notice">' +
            '<i class="fas fa-exclamation-circle me-2"></i>' +
            'This document cannot be edited.' +
            '</div>').insertAfter('.card-body h4');
    }

    debugger;

    // Hilangkan disable pada elemen DataTables
    const dtExceptions =
        '.dataTables_filter input, ' +
        '.dataTables_length select, ' +
        '.dataTables_paginate *, ' +
        '.dataTables_info';

    // Disable semua input kecuali:
    //  - tombol back
    //  - hidden field
    //  - komponen filter/search DataTables
    $('input, select, textarea')
        .not('#btnBack, input[type=hidden]')
        .not(dtExceptions)
        .prop('disabled', true);

    // Sembunyikan tombol aksi
    $('#btnSubmit').addClass('d-none');
    $('#btnSave').addClass('d-none');
    $('#btnRecalculate').addClass('d-none'); 
}

//function disableAllByRole() {

//    // Tambahkan notice jika belum ada
//    if (!$('#approval-notice').length) {
//        $('<div id="approval-notice" class="approval-notice">' +
//            '<i class="fas fa-exclamation-circle me-2"></i>' +
//            'This document cannot be edited.' +
//            '</div>').insertAfter('.card-body h4');
//    }

//    debugger;

//    // Hilangkan disable pada elemen DataTables
//    const dtExceptions =
//        '.dataTables_filter input, ' +
//        '.dataTables_length select, ' +
//        '.dataTables_paginate *, ' +
//        '.dataTables_info';

//    // Disable semua input kecuali:
//    //  - tombol back
//    //  - hidden field
//    //  - komponen filter/search DataTables
//    $('input, select, textarea')
//        .not('#btnView, input[type=hidden]')
//        .not(dtExceptions)
//        .prop('disabled', true);

//    // Sembunyikan tombol aksi
//    $('#btnUploadNutFact').addClass('d-none');
//    $('#btnProceed').addClass('d-none');
//    $('#btnSubmitAll').addClass('d-none');
//}


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

        LOV = clsGlobal.generateLOV("COSTING_PRODUCT_CATEGORY", "txtProductCategory");
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

$('#btnSave').click(function () {
    debugger;
    const isEdit = parseInt($("#id").val()) > 0; // boolean: true or false
    const actionText = isEdit ? "update" : "save";
    showSaveConfirmation(actionText, isEdit);
});

$('#btnSubmit').click(function () {
    debugger;
    const isEdit = parseInt($("#id").val()) > 0; // boolean: true or false
    const actionText = "Submit";
    showSubmitConfirmation(actionText, isEdit);
});

$('#btnProceed').bind('click', function () {
    try {
        debugger;

        tableDraftCostingUpload.clear().draw(false);
        $('#modalDetail').modal('show');
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#modalDetail').on('shown.bs.modal', function () {
    tableDraftCostingUpload.columns.adjust().draw(false);
});

$('#btnBack').click(function () {

    Swal.fire({
        title: "The Data have not been saved, are you sure to go back to home page?",
        confirmButtonText: "Back",
    }).then((result) => {
        if (result.isConfirmed) {
            /* window.location.href = window.indexUrl + "?id=" + $("#TxtDraftCostingId").val();*/
            /*window.location.href = window.indexUrl;*/
            clsGlobal.showLoading();
            $.ajax({
                type: "POST",
                url: "/DraftCosting/GetHeaderById",
                data: {
                    id: $("#intDraftCostingHeaderId").val(),
                    __RequestVerificationToken: $('#FormDraftCostingDetail input[name=__RequestVerificationToken]').val()
                },
                datatype: "json",
                success: function (retDat) {
                    if (retDat.bitSuccess === true) {
                        if (retDat.objData !== undefined) {
                            window.location.href = window.indexUrl + "?id=" + retDat.objData.txtDraftCostingId;

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
    });
});

$("#btnRecalculate").on("click", function () {
    Recalculate();
});

//function Recalculate() {
//    $("#tableDraftCostingActual tbody tr").each(function () {

//        let tr = $(this);
//        let isChanged = false;
//        debugger;
//        tr.find("input").each(function () {
//            let input = $(this);

//            let oldVal = parseFloat((input.data("original") ?? "0").toString().replace(/,/g, ""));
//            let newVal = parseFloat((input.val() ?? "0").toString().replace(/,/g, ""));

//            if (oldVal !== newVal) {
//                isChanged = true;
//            }

//            debugger;
//        });
//        debugger;
//        if (isChanged) {
//            tr.css("background-color", "#fff3cd");   // kuning
//        } else {
//            tr.css("background-color", "");
//        }
//    });

//    clsGlobal.getAlert("Recalculate completed.");
//}


function Recalculate() {
    debugger;

    //// Hidden berisi LIST langsung, bukan object
    //let originalList = JSON.parse($("#txtHiddenObjectList").val());
    //if (!originalList || !Array.isArray(originalList)) return;

    //var table = $("#tableDraftCostingActual").DataTable();

    //table.rows().every(function () {

    //    let tr = $(this.node());  // <— baris asli, aman walau tidak tampil

    //    let key = tr.data("ingcode");
    //    if (!key) return;

    //    let ori = originalList.find(x => x.txtIngredientCode === key);
    //    if (!ori) return;

    //    let isChanged = false;
    //    debugger;
    //    let fields = [
    //        "decYield", "decOutputAfterYield", "decRm", "decPm", "decFoh",
    //        "decDl", "decFreight", "decFee", "decDepr", "decIdepr",
    //        "decEnergy", "decFg", "decLanded", "decIdl", "decRepMai",
    //        "decDlx", "decDeprx", "decFreightx", "decTotalUnit"
    //    ];

    //    fields.forEach(f => {
    //        let newVal = tr.find(`input[name=${f}]`).val() ?? "0";
    //        let oldVal = ori[f] ?? "0";

    //        let xNew = parseFloat(newVal.toString().replace(/,/g, "")) || 0;
    //        let xOld = parseFloat(oldVal.toString().replace(/,/g, "")) || 0;

    //        if (xNew !== xOld) {
    //            isChanged = true;
    //        }
    //    });

    //    if (isChanged) {
    //        tr.css("background-color", "#fff3cd"); // highlight
    //    } else {
    //        tr.css("background-color", "");
    //    }
    //});

    p_UIToDataList();
    p_UIToDataListBudget();
    p_UIToDataListPredictive();
    p_UIToData();

    const url = window.recalculateUrl;
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
                //$("#txtHiddenObject").val(JSON.stringify(retDat.objData));

                p_DataToUI(retDat.objData);
                clsGlobal.swalSuccessSaveOrSubmit(retDat.txtMessage, window.detailUrl + "?id=" + retDat.objData.intDraftCostingDetailId);

                //tableDraftCostingActual.clear().draw(false);

                //if (retDat.objData.listVmDraftCostingDetailActual != null) {
                //    let details = retDat.objData.listVmDraftCostingDetailActual;
                //    counter = 0;

                //    for (let i = 0; i < details.length; i++) {
                //        let d = details[i];
                //        counter += 10; // <== kelipatan 10;
                //        debugger;
                //        tableDraftCostingActual.row.add([
                //            // intSequence
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:50px">
                //                    <input type="text" class="form-control" name="intSequence"
                //                        value="${Number(d.intSequence) || 0}" readonly>
                //                </div>`,

                //            // txtFormulaClass
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:100px">
                //                    <input type="text" class="form-control" name="txtFormulaClass"
                //                        value="${d.txtFormulaClass || ''}" readonly>
                //                    <input type="hidden" name="intDraftCostingDetailActualId" value="${d.intDraftCostingDetailActualId || ''}">
                //                </div>`,

                //            // txtItemCode
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control" name="txtItemCode"
                //                        value="${d.txtItemCode || ''}" readonly>
                //                </div>`,

                //            // txtIngredientCode
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control" name="txtIngredientCode"
                //                        value="${d.txtIngredientCode || ''}" readonly>
                //                </div>`,

                //            // txtIngredientDesc
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                //                    <input type="text" class="form-control" name="txtIngredientDesc" value="${d.txtIngredientDesc || ''}" readonly>
                //                </div>`,

                //            // decOutput
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control" name="decOutput" value="${d.decOutput || ''}" readonly>
                //                </div>`,

                //            // txtUOMItemCode
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control" name="txtUOMItemCode" value="${d.txtUomitemCode || ''}" readonly>
                //                </div>`,

                //            // txtFormulaNo
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control" name="txtFormulaNo" value="${d.txtFormulaNo || ''}" readonly>
                //                </div>`,

                //            //intVersion
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control" name="intVersion" value="${d.intVersion || ''}" readonly>
                //                </div>`,

                //            // decQtyFormula
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control" name="decQtyFormula" value="${d.decQtyFormula || ''}" readonly>
                //                </div>`,

                //            // txtUomformula
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:70px">
                //                    <input type="text" class="form-control" name="txtUomformula" value="${d.txtUomformula || ''}" readonly>
                //                </div>`,

                //            // decQtyPrimaryUom
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control" name="decQtyPrimaryUom"
                //                        value="${d.decQtyPrimaryUom || ''}" readonly>
                //                </div>`,

                //            // txtPrimaryUom
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control" name="txtPrimaryUom" value="${d.txtPrimaryUom || ''}" readonly>
                //                </div>`,

                //            // decYield
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decYield" placeholder="0.00" value="${d.decYield || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decOutputAfterYield
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decOutputAfterYield" placeholder="0.00" value="${d.decOutputAfterYield || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decRm
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decRm" placeholder="0.00" value="${d.decRm || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decPm
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decPm" placeholder="0.00" value="${d.decPm || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decFoh
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decFoh" placeholder="0.00" value="${d.decFoh || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decDl
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decDl" placeholder="0.00" value="${d.decDl || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decFreight
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decFreight" placeholder="0.00" value="${d.decFreight || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decFee
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decFee" placeholder="0.00" value="${d.decFee || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decDepr
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decDepr" placeholder="0.00" value="${d.decDepr || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decIdepr
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decIdepr" placeholder="0.00" value="${d.decIdepr || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decEnergy
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decEnergy" placeholder="0.00" value="${d.decEnergy || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decFg
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decFg" placeholder="0.00" value="${d.decFg || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decLanded
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decLanded" placeholder="0.00" value="${d.decLanded || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decIdl
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decIdl" placeholder="0.00" value="${d.decIdl || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decRepMai
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decRepMai" placeholder="0.00" value="${d.decRepMai || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decDlx
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decDlx" placeholder="0.00" value="${d.decDlx || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decDeprx
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decDeprx" placeholder="0.00" value="${d.decDeprx || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decFreightx
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decFreightx" placeholder="0.00" value="${d.decFreightx || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decRmValue
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decRmValue" placeholder="0.00" value="${d.decRmValue || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decPmValue
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decPmValue" placeholder="0.00" value="${d.decPmValue || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decFohValue
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decFohValue" placeholder="0.00" value="${d.decFohValue || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decDlValue
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decDlValue" placeholder="0.00" value="${d.decDlValue || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decFreightValue
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decFreightValue" placeholder="0.00" value="${d.decFreightValue || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decFeeValue
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decFeeValue" placeholder="0.00" value="${d.decFeeValue || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decDeprValue
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decDeprValue" placeholder="0.00" value="${d.decDeprValue || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decIdeprValue
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decIdeprValue" placeholder="0.00" value="${d.decIdeprValue || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decEnergyValue
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decEnergyValue" placeholder="0.00" value="${d.decEnergyValue || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decFgValue
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decFgValue" placeholder="0.00" value="${d.decFgValue || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decLandedValue
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decLandedValue" placeholder="0.00" value="${d.decLandedValue || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decIdlValue
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decIdlValue" placeholder="0.00" value="${d.decIdlValue || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decRepMaiValue
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decRepMaiValue" placeholder="0.00" value="${d.decRepMaiValue || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decDlxValue
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decDlxValue" placeholder="0.00" value="${d.decDlxValue || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decDeprxValue
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decDeprxValue" placeholder="0.00" value="${d.decDeprxValue || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decFreightxValue
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decFreightxValue" placeholder="0.00" value="${d.decFreightxValue || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decTotalValue
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decTotalValue" placeholder="0.00" value="${d.decTotalValue || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decRmUnit
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decRmUnit" placeholder="0.00" value="${d.decRmUnit || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decPmUnit
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decPmUnit" placeholder="0.00" value="${d.decPmUnit || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decFohUnit
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decFohUnit" placeholder="0.00" value="${d.decFohUnit || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decDlUnit
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decDlUnit" placeholder="0.00" value="${d.decDlUnit || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decFreightUnit
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decFreightUnit" placeholder="0.00" value="${d.decFreightUnit || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decFeeUnit
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decFeeUnit" placeholder="0.00" value="${d.decFeeUnit || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decDeprUnit
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decDeprUnit" placeholder="0.00" value="${d.decDeprUnit || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decIdeprUnit
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decIdeprUnit" placeholder="0.00" value="${d.decIdeprUnit || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decEnergyUnit
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decEnergyUnit" placeholder="0.00" value="${d.decEnergyUnit || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decFgUnit
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decFgUnit" placeholder="0.00" value="${d.decFgUnit || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decLandedUnit
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decLandedUnit" placeholder="0.00" value="${d.decLandedUnit || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decIdlUnit
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decIdlUnit" placeholder="0.00" value="${d.decIdlUnit || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decRepMaiUnit
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decRepMaiUnit" placeholder="0.00" value="${d.decRepMaiUnit || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decDlxUnit
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decDlxUnit" placeholder="0.00" value="${d.decDlxUnit || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decDeprxUnit
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decDeprxUnit" placeholder="0.00" value="${d.decDeprxUnit || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decFreightxUnit
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decFreightxUnit" placeholder="0.00" value="${d.decFreightxUnit || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decTotalUnit
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decTotalUnit" placeholder="0.00" value="${d.decTotalUnit || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //        ]).draw(false);
                //    }
                //}

                //tableDraftCostingBudget.clear().draw(false);

                //if (retDat.objData.listVmDraftCostingDetailBudget != null) {
                //    let budgets = retDat.objData.listVmDraftCostingDetailBudget;
                //    counter = 0;

                //    for (let i = 0; i < budgets.length; i++) {
                //        let d = budgets[i];
                //        counter += 10; // <== kelipatan 10;
                //        debugger;
                //        tableDraftCostingBudget.row.add([
                //            // intSequence
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:50px">
                //                    <input type="text" class="form-control" name="intSequence_Budget"
                //                        value="${d.intSequence || ''}" readonly>
                //                </div>`,

                //            // txtFormulaClass
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:100px">
                //                    <input type="text" class="form-control" name="txtFormulaClass_Budget"
                //                        value="${d.txtFormulaClass || ''}" readonly>
                //                    <input type="hidden" name="intDraftCostingDetailBudgetId" value="${d.intDraftCostingDetailBudgetId || ''}">
                //                </div>`,

                //            // txtItemCode
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control" name="txtItemCode_Budget"
                //                        value="${d.txtItemCode || ''}" readonly>
                //                </div>`,

                //            // txtIngredientCode
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control" name="txtIngredientCode_Budget"
                //                        value="${d.txtIngredientCode || ''}" readonly>
                //                </div>`,

                //            // txtIngredientDesc
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                //                    <input type="text" class="form-control" name="txtIngredientDesc_Budget" value="${d.txtIngredientDesc || ''}" readonly>
                //                </div>`,

                //            // txtFormulaNo
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                //                    <input type="text" class="form-control" name="txtFormulaNo_Budget" value="${d.txtFormulaNo || ''}" readonly>
                //                </div>`,

                //            //intVersion
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                //                    <input type="text" class="form-control" name="intVersion_Budget" value="${d.intVersion || ''}" readonly>
                //                </div>`,

                //            // decQtyFormula
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                //                    <input type="text" class="form-control" name="decQtyFormula_Budget" value="${d.decQtyFormula || ''}" readonly>
                //                </div>`,

                //            // txtUomformula
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:70px">
                //                    <input type="text" class="form-control" name="txtUomformula_Budget" value="${d.txtUomformula || ''}" readonly>
                //                </div>`,

                //            // decQtyPrimaryUom
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                //                    <input type="text" class="form-control" name="decQtyPrimaryUom_Budget"
                //                        value="${d.decQtyPrimaryUom || ''}" readonly>
                //                </div>`,

                //            // txtPrimaryUom
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                //                    <input type="text" class="form-control" name="txtPrimaryUom_Budget" value="${d.txtPrimaryUom || ''}" readonly>
                //                </div>`,

                //            // decYield
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decYield_Budget" placeholder="0.00" value="${d.decYield || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decOutputAfterYield
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decOutputAfterYield_Budget" placeholder="0.00" value="${d.decOutputAfterYield || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decRm
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decRm_Budget" placeholder="0.00" value="${d.decRm || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decPm
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decPm_Budget" placeholder="0.00" value="${d.decPm || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //        ]).draw(false);
                //    }
                //}

                //tableDraftCostingPredictive.clear().draw(false);

                //if (retDat.objData.listVmDraftCostingDetailPredictive != null) {
                //    let predictives = retDat.objData.listVmDraftCostingDetailPredictive;
                //    counter = 0;

                //    for (let i = 0; i < predictives.length; i++) {
                //        let d = predictives[i];
                //        counter += 10; // <== kelipatan 10;
                //        debugger;
                //        tableDraftCostingPredictive.row.add([
                //            // intSequence
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:50px">
                //                    <input type="text" class="form-control" name="intSequence_Predictive"
                //                        value="${d.intSequence || ''}" readonly>
                //                </div>`,

                //            // txtFormulaClass
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:100px">
                //                    <input type="text" class="form-control" name="txtFormulaClass_Predictive"
                //                        value="${d.txtFormulaClass || ''}" readonly>
                //                    <input type="hidden" name="intDraftCostingDetailPredictiveId" value="${d.intDraftCostingDetailPredictiveId || ''}">
                //                </div>`,

                //            // txtItemCode
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control" name="txtItemCode_Predictive"
                //                        value="${d.txtItemCode || ''}" readonly>
                //                </div>`,

                //            // txtIngredientCode
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control" name="txtIngredientCode_Predictive"
                //                        value="${d.txtIngredientCode || ''}" readonly>
                //                </div>`,

                //            // txtIngredientDesc
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                //                    <input type="text" class="form-control" name="txtIngredientDesc_Predictive" value="${d.txtIngredientDesc || ''}" readonly>
                //                </div>`,

                //            // txtFormulaNo
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                //                    <input type="text" class="form-control" name="txtFormulaNo_Predictive" value="${d.txtFormulaNo || ''}" readonly>
                //                </div>`,

                //            //intVersion
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                //                    <input type="text" class="form-control" name="intVersion_Predictive" value="${d.intVersion || ''}" readonly>
                //                </div>`,

                //            // decQtyFormula
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                //                    <input type="text" class="form-control" name="decQtyFormula_Predictive" value="${d.decQtyFormula || ''}" readonly>
                //                </div>`,

                //            // txtUomformula
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:70px">
                //                    <input type="text" class="form-control" name="txtUomformula_Predictive" value="${d.txtUomformula || ''}" readonly>
                //                </div>`,

                //            // decQtyPrimaryUom
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                //                    <input type="text" class="form-control" name="decQtyPrimaryUom_Predictive"
                //                        value="${d.decQtyPrimaryUom || ''}" readonly>
                //                </div>`,

                //            // txtPrimaryUom
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                //                    <input type="text" class="form-control" name="txtPrimaryUom_Predictive" value="${d.txtPrimaryUom || ''}" readonly>
                //                </div>`,

                //            // decYield
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decYield_Predictive" placeholder="0.00" value="${d.decYield || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decOutputAfterYield
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decOutputAfterYield_Predictive" placeholder="0.00" value="${d.decOutputAfterYield || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decRm
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decRm_Predictive" placeholder="0.00" value="${d.decRm || ''}" oninput="formatDecimal(this)" >
                //                </div>`,

                //            // decPm
                //            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:120px">
                //                    <input type="text" class="form-control decimal-input" name="decPm_Predictive" placeholder="0.00" value="${d.decPm || ''}" oninput="formatDecimal(this)" >
                //                </div>`,
  

                //        ]).draw(false);
                //    }
                //}

                //clsGlobal.getAlert("Recalculate completed.");
            } else {
                /*toastr.error(retDat.txtMessage);*/
                clsGlobal.getAlert(retDat.message);
            }
        },
        error: function (xhr) {
            toastr.error("Error Recalculate data: " + xhr.responseText);
        }
    });

//    clsGlobal.getAlert("Recalculate completed.");
}


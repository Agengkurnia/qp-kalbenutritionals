//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
let lineCounter = 1;
let currentPlantInput = null;
let currentBrandInput = null;
let currentVarianRasaInput = null;
let currentGrandParentInput = null;
let currentParentInput = null;
let currentGroupInput = null;
let currentRMCodeInput = null;
let currentFGCodeInput = null;
let currentProductCodeInput = null;
let currentProductDesc = null;
let currentProductGroupInput = null;
let currentIntermedieteInput = null;
let currentUOMInput = null;
let currentRMDescription = null;
let currentPrimaryUOM = null;
let isEditMode = false;

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    p_InitForm();


});

function p_InitForm() {
    p_initiateData();

}

var tableIntermedieteMapping = $("#tableIntermedieteMapping").DataTable({
    "scrollX": true,
    "scrollY": "500px",
    "fixedHeader": true,
    "scrollCollapse": true,
    renderer: "bootstrap",
    "processing": true,
    "bAutoWidth": false,
    "paging": true,
    "order": [[2, "asc"]],
    "aLengthMenu": [[-1, 5, 10, 100], ["ALL", 5, 10, 100]],
    "fixedColumns": { "left": [4] },
    "searching": false,
    "columnDefs": [
        {
            //"targets": 2,
            //"render": function (data, type, row) {
            //    if (type === "sort" || type === "type") {
            //        const match = data.match(/value="(\d+)"/);
            //        return match ? parseInt(match[1]) : 0;
            //    }
            //    return data;
            //}

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
        //{ className: "text-center", "targets": [2] },
        { "visible": false, "targets": [1] },
        { "visible": false, "targets": [2] },
    ]
})

$(window).on('resize', function () {
    tableIntermedieteMapping.columns.adjust().draw(false);
});

var tableIntermedieteMappingDetail = $("#tableIntermedieteMappingDetail").DataTable({
    "scrollX": true,
    "scrollY": "500px",
    "fixedHeader": true,
    "scrollCollapse": true,
    renderer: "bootstrap",
    "processing": true,
    "bAutoWidth": false,
    "paging": true,
    "order": [[2, "asc"]],
    "aLengthMenu": [[-1, 5, 10, 100], ["ALL", 5, 10, 100]],
    "fixedColumns": { "left": [4] },
    "columnDefs": [
        {
            //"targets": 2,
            //"render": function (data, type, row) {
            //    if (type === "sort" || type === "type") {
            //        const match = data.match(/value="(\d+)"/);
            //        return match ? parseInt(match[1]) : 0;
            //    }
            //    return data;
            //}

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
        //{ className: "text-center", "targets": [2] },
        { "visible": false, "targets": [1] },
        { "visible": false, "targets": [2] },
    ]
    //"drawCallback": function () {
    //    tableIntermedieteMappingDetail.columns.adjust();
    //}
})

function setChooseLOV(txtValue) {
    var arr = txtValue.split('|');

    debugger;

    switch (arr[0]) {
        case "txtPlant":
            //$("#txtGroup").val(arr[1]);
            p_txtPlant_TextChanged(arr[2]);
            break;
        case "txtBrand":
            //$("#txtGroup").val(arr[1]);
            p_txtBrand_TextChanged(arr[2]);
            break;
        case "txtVarianRasa":
            //$("#txtGroup").val(arr[1]);
            p_txtVarianRasa_TextChanged(arr[2]);
            break;
        case "txtFGCode":
            //$("#txtGroup").val(arr[1]);
            p_txtFGCode_TextChanged(arr[1], arr[3], arr[4]);
            break;
        case "txtProductCode":
            //$("#txtGroup").val(arr[1]);
            p_txtProductCode_TextChanged(arr[1], arr[2]);
            break;
        case "txtGrandParent":
            //$("#txtCategory").val(arr[1]);
            p_TxtGrandParent_TextChanged(arr[2]);
            break;
        case "txtRMCode":
            //$("#txtCategory").val(arr[1]);
            p_TxtRMCode_TextChanged(arr[1], arr[2], arr[3]);
            break;
        case "intProductGroup":
            //$("#txtGroup").val(arr[1]);
            p_IntProductGroup_TextChanged(arr[1]);
            break;
        case "txtIntermediete":
            //$("#txtGroup").val(arr[1]);
            p_txtIntermediete_TextChanged(arr[1]);
            break;
        case "txtGroup":
            //$("#txtGroup").val(arr[1]);
            p_TxtGroup_TextChanged(arr[2]);
            break;
        case "txtItemEPMCode":
            //$("#txtGroup").val(arr[1]);
            p_txtItemEPMCode_TextChanged(arr[1], arr[2], arr[3]);
            break;
        case "txtPrimaryUom":
            //$("#txtGroup").val(arr[1]);
            p_txtPrimaryUom_TextChanged(arr[1]);
            break;
    }
    clsGlobal.closeLOV();
}

function p_initiateData() {
    debugger;
    clsGlobal.showLoading();

    $.ajax({
        type: "POST",
        url: "/IntermedieteMapping/InitiateData",
        data: {
            __RequestVerificationToken: $('#frmIntermedieteMapping input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    debugger;
                    $("#txtHiddenObject").val(JSON.stringify(retDat.objData));

                    p_DataToUI(retDat.objData);

                    tableIntermedieteMapping.clear().draw(false);

                    // Hitung total data dulu agar bisa pakai descending LineNo
                    let totalData = retDat.objData.length;
                    let lineNo = totalData;

                    for (var i = 0; i < retDat.objData.length; i++) {
                        var d = retDat.objData[i];

                        tableIntermedieteMapping.row.add([
                            // 1. Delete button
                            /*`<a class="btn btn-sm btn-edit-custom" onclick="p_EditDataFromRow(this)"><i class="fas fa-edit me-1"></i> Edit</a>`,*/
                            `<div style="text-align:center">
                                <i class="btn btn-sm btn-edit-custom" onclick="p_EditDataFromRow(this)"><i class="fas fa-edit me-1"></i> Edit</i>
                                <input type="hidden" name="intIntermedieteMappingIdH" value="${d.intIntermedieteMappingId || ''}">
                            </div>`,

                            // 2. Hidden ID
                            `<input type="hidden" name="intIntermedieteMappingIdH" value="${d.intIntermedieteMappingId || ''}">`,

                            // 3. LineNo (descending)
                            `<input type="text" name="lineNo" value="${lineNo--}" readonly>`,

                            // 4. Group
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:70px">
                                <input type="text" class="form-control" name="txtPlantH" value="${d.txtPlant || ''}" readonly>
                            </div>`,

                            // 5. Brand
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:150px">
                                <input type="text" class="form-control" name="txtBrandH" value="${d.txtBrand || ''}" readonly>
                            </div>`,

                            // 6. Parent
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtVarianRasaH" value="${d.txtVarianRasa || ''}" readonly>
                            </div>`,

                            // 7. FG Code
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtFGCodeH" value="${d.txtFgcode || ''}" readonly>
                            </div>`,

                            // 8. Product
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtProductCodeH" value="${d.txtProduct || ''}" readonly>
                            </div>`,

                            // 9. Product Desc
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtProductDescH" readonly rows="3" readonly>${d.txtProductDesc || ''}</textarea>
                            </div>`,

                            // 10. Grand Parent
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtGrandParentH" value="${d.txtGrandParent || ''}" readonly>
                            </div>`,

                            // 11. RM Code
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtRMCodeH" value="${d.txtRmcode || ''}" readonly>
                            </div>`,

                            // 12. RM Desc
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtRMDescH" readonly rows="3" readonly>${d.txtRmdesc || ''}</textarea>
                            </div>`,

                            // 13. RM FG
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control decimal-input" name="decRMFGH" placeholder="0.00" value="${d.decRmfg || ''}" oninput="formatDecimal(this)" onchange="updateRMPercentSummary()" readonly>
                            </div>`,

                            // 14. Product Group
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:100px">
                                <input type="text" class="form-control" name="intProductGroupH" value="${d.intProductGroup || ''}" readonly>
                            </div>`,

                            // 15. Product Group
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtIntermedieteH" value="${d.txtIntermediete || ''}" readonly>
                            </div>`
                        ]).draw(false);
                    }

                    // ✅ Refresh Line Numbers after insert
                    refreshVarianLineIDs();
                    // ✅ Paksa urut ulang sesuai Plant, Brand, VarianRasa, FGCode
                    tableIntermedieteMapping
                        .order([[3, "asc"], [4, "asc"], [5, "asc"], [6, "asc"]])
                        .draw();

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

//$('#filterPlant, #filterBrand, #filterVarian, #filterFGCode').on('change keyup', function () {}
$('#btnSearchFilter').on('click', function () {
    const plant = $('#filterPlant').val();
    const brand = $('#filterBrand').val();
    const varian = $('#filterVarian').val();
    const fgcode = $('#filterFGCode').val();

    $.ajax({
        type: "POST",
        url: "/IntermedieteMapping/InitiateDataFilter",
        data: {
            __RequestVerificationToken: $('#frmIntermedieteMapping input[name=__RequestVerificationToken]').val(),
            plant: plant,
            brand: brand,
            varian: varian,
            fgcode: fgcode
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    debugger;
                    $("#txtHiddenObject").val(JSON.stringify(retDat.objData));

                    p_DataToUI(retDat.objData);

                    tableIntermedieteMapping.clear().draw(false);

                    // Hitung total data dulu agar bisa pakai descending LineNo
                    let totalData = retDat.objData.length;
                    let lineNo = totalData;

                    for (var i = 0; i < retDat.objData.length; i++) {
                        var d = retDat.objData[i];

                        tableIntermedieteMapping.row.add([
                            // 1. Delete button
                            `<a class="btn btn-sm btn-edit-custom" onclick="p_EditDataFromRow(this)"><i class="fas fa-edit me-1"></i> Edit</a>`,

                            // 2. Hidden ID
                            `<input type="hidden" name="intIntermedieteMappingIdH" value="${d.intIntermedieteMappingId || ''}">`,

                            // 3. LineNo (descending)
                            `<input type="text" name="lineNo" value="${lineNo--}" readonly>`,

                            // 4. Plant
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:70px">
                                <input type="text" class="form-control" name="txtPlantH" value="${d.txtPlant || ''}" readonly>
                            </div>`,

                            // 5. Brand
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:150px">
                                <input type="text" class="form-control" name="txtBrandH" value="${d.txtBrand || ''}" readonly>
                            </div>`,

                            // 6. Parent
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                               <input type="text" class="form-control" name="txtVarianRasaH" value="${d.txtVarianRasa || ''}" readonly>
                            </div>`,

                            // 7. FG Code
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtFGCodeH" value="${d.txtFgcode || ''}" readonly>
                            </div>`,

                            // 8. Product
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtProductCodeH" value="${d.txtProduct || ''}" readonly>
                            </div>`,

                            // 9. Product Desc
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtProductDescH" readonly rows="3" readonly>${d.txtProductDesc || ''}</textarea>
                            </div>`,

                            // 10. Grand Parent
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtGrandParentH" value="${d.txtGrandParent || ''}" readonly>
                            </div>`,

                            // 11. RM Code
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtRMCodeH" value="${d.txtRmcode || ''}" readonly>
                            </div>`,

                            // 12. RM Desc
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtRMDescH" readonly rows="3" readonly>${d.txtRmdesc || ''}</textarea>
                            </div>`,

                            // 13. RM FG
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control decimal-input" name="decRMFGH" placeholder="0.00" value="${d.decRmfg || ''}" oninput="formatDecimal(this)" onchange="updateRMPercentSummary()" readonly>
                            </div>`,

                            // 14. Product Group
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:100px">
                                <input type="text" class="form-control" name="intProductGroupH" value="${d.intProductGroup || ''}" readonly>
                            </div>`,

                            // 15. Product Group
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtIntermedieteH" value="${d.txtIntermediete || ''}" readonly>
                            </div>`
                        ]).draw(false);
                    }

                    // ✅ Refresh Line Numbers after insert
                    refreshVarianLineIDs();

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
});

// Render table ulang
function p_RenderFilteredTable(data) {
    const tbody = $('#tBodyItemMapping');
    tbody.empty();

    if (data.length === 0) {
        tbody.append('<tr><td colspan="15" class="text-center">No data found</td></tr>');
        return;
    }

    $.each(data, function (i, item) {
        const row = `
            <tr>
                <td class="text-center">[Action Buttons]</td>
                <td>${item.intIntermedieteMappingId}</td>
                <td>${item.intLineNo}</td>
                <td>${item.txtPlant}</td>
                <td>${item.txtBrand}</td>
                <td>${item.txtVarianRasa}</td>
                <td>${item.txtFgCode}</td>
                <td>${item.txtProductCode}</td>
                <td>${item.txtProductDesc}</td>
                <td>${item.txtGrandParent}</td>
                <td>${item.txtRmCode}</td>
                <td>${item.txtRmDesc}</td>
                <td>${item.decRmfg}</td>
                <td>${item.intProductGroup}</td>
                <td>${item.txtIntermediete}</td>
            </tr>
        `;
        tbody.append(row);
    });
}


//function p_EditDataFromRow(btn) {
//    const $row = $(btn).closest('tr');
//    const txtPlant = $row.find('td:eq(0)').text().trim();       // kolom ke-1
//    const txtBrand = $row.find('td:eq(1)').text().trim();       // kolom ke-2
//    const txtVarianRasa = $row.find('td:eq(2)').text().trim();  // kolom ke-3

//    p_EditData(txtPlant, txtBrand, txtVarianRasa);
//}

function p_EditDataFromRow(btn) {
    const $row = $(btn).closest('tr');

    const txtPlant = $row.find('input[name="txtPlantH"]').val() || "";
    const txtBrand = $row.find('input[name="txtBrandH"]').val() || "";
    const txtVarianRasa = $row.find('input[name="txtVarianRasaH"]').val() || "";
    const txtFGCode = $row.find('input[name="txtFGCodeH"]').val() || "";

    // Set ke input form utama
    $("#plantH").val(txtPlant);
    $("#brandH").val(txtBrand);
    $("#varianH").val(txtVarianRasa);
    $("#txtFGCodeH").val(txtFGCode);

    //// Kosongkan nilai rmPercentSummary
    //$('#rmPercentSummary').val('');

    p_EditData(txtPlant, txtBrand, txtVarianRasa);
}

function p_EditData(txtPlant, txtBrand, txtVarianRasa) {
    debugger;
    clsGlobal.showLoading();
    isEditMode = true;
    $.ajax({
        type: "POST",
        url: "/IntermedieteMapping/EditData",
        data: {
            txtPlant: txtPlant,
            txtBrand: txtBrand,
            txtVarianRasa: txtVarianRasa,
            __RequestVerificationToken: $('#frmIntermedieteMapping input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    debugger;
                    //$("#txtHiddenObject").val(JSON.stringify(retDat.objData));

                    //p_DataToUI(retDat.objData);

                    $('#modalDetail').modal('show');

                    tableIntermedieteMappingDetail.clear().draw(false);                   

                    // Hitung total data dulu agar bisa pakai descending LineNo
                    let totalData = retDat.objData.length;
                    let lineNo = totalData;

                    for (var i = 0; i < retDat.objData.length; i++) {
                        var d = retDat.objData[i];

                        tableIntermedieteMappingDetail.row.add([
                            // 1. Delete button
                            /*`<a class="btn btn-sm btn-edit-custom"><i class="fas fa-edit me-1"></i> Edit</a>`,*/
                            `<div style="text-align:center">
                                <i class="fas fa-trash fa-2x trash-icon" onclick="deleteRowdataDetail(this)"></i>
                                <input type="hidden" name="intIntermedieteMappingId" value="${d.intIntermedieteMappingId || ''}">
                            </div>`,

                            // 2. Hidden ID
                            `<input type="hidden" name="intIntermedieteMappingId" value="${d.intIntermedieteMappingId || ''}">`,

                            // 3. LineNo (descending)
                            `<input type="text" name="lineNo" value="${lineNo--}" readonly>`,

                            //// 4. Group
                            //`<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            //    <div class="input-group">
                            //        <div class="input-group-btn">
                            //            <button type="button" class="btn btn-danger" onclick="p_btnLOVPOTSClick(this)" disabled>
                            //                <i class="fa fa-search"></i>
                            //            </button>
                            //        </div>
                            //        <input type="text" class="form-control" name="txtPlant" value="${d.txtPlant || ''}" readonly>
                            //    </div>
                            //</div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtPlant" value="${d.txtPlant || ''}" readonly>
                            </div>`,

                            //// 5. Brand
                            //`<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            //    <div class="input-group">
                            //        <div class="input-group-btn">
                            //            <button type="button" class="btn btn-danger" onclick="p_btnLOVBRANDClick(this)" disabled>
                            //                <i class="fa fa-search"></i>
                            //            </button>
                            //        </div>
                            //        <input type="text" class="form-control" name="txtBrand" value="${d.txtBrand || ''}" readonly>
                            //    </div>
                            //</div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtBrand" value="${d.txtBrand || ''}" readonly>
                            </div>`,

                            //// 6. Parent
                            //`<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            //    <div class="input-group">
                            //        <div class="input-group-btn">
                            //            <button type="button" class="btn btn-danger" onclick="p_btnLOVVARIANRASAClick(this)" disabled>
                            //                <i class="fa fa-search"></i>
                            //            </button>
                            //        </div>
                            //        <input type="text" class="form-control" name="txtVarianRasa" value="${d.txtVarianRasa || ''}" readonly>
                            //    </div>
                            //</div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                               <input type="text" class="form-control" name="txtVarianRasa" value="${d.txtVarianRasa || ''}" readonly>
                            </div>`,

                            //// 7. FG Code
                            //`<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            //    <div class="input-group">
                            //        <div class="input-group-btn">
                            //            <button type="button" class="btn btn-danger" onclick="p_btnLOVFGCODEClick(this)">
                            //                <i class="fa fa-search"></i>
                            //            </button>
                            //        </div>
                            //        <input type="text" class="form-control" name="txtFGCode" value="${d.txtFgcode || ''}" readonly>
                            //    </div>
                            //</div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtFGCode" value="${d.txtFgcode || ''}" readonly>
                            </div>`,

                            // 8. Product
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <div class="input-group-btn">
                                        <button type="button" class="btn btn-danger" onclick="p_btnLOVPRODUCTCODEClick(this)">
                                            <i class="fa fa-search"></i>
                                        </button>
                                    </div>
                                    <input type="text" class="form-control" name="txtProductCode" value="${d.txtProduct || ''}" readonly>
                                </div>
                            </div>`,

                            // 9. Product Desc
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtProductDesc" readonly rows="3">${d.txtProductDesc || ''}</textarea>
                            </div>`,

                            //// 10. Grand Parent
                            //`<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            //    <div class="input-group">
                            //        <div class="input-group-btn">
                            //            <button type="button" class="btn btn-danger" onclick="p_btnLOVGRANDPARENTClick(this)">
                            //                <i class="fa fa-search"></i>
                            //            </button>
                            //        </div>
                            //        <input type="text" class="form-control" name="txtGrandParent" value="${d.txtGrandParent || ''}" readonly>
                            //    </div>
                            //</div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtGrandParent" value="${d.txtGrandParent || ''}" readonly>
                            </div>`,

                            // 11. RM Code
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <div class="input-group-btn">
                                        <button type="button" class="btn btn-danger" onclick="p_btnLOVRMCODEClick(this)">
                                            <i class="fa fa-search"></i>
                                        </button>
                                    </div>
                                    <input type="text" class="form-control" name="txtRMCode" value="${d.txtRmcode || ''}" readonly>
                                </div>
                            </div>`,

                            // 12. RM Desc
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtRMDesc"readonly rows="3">${d.txtRmdesc || ''}</textarea>
                            </div>`,

                            // 13. RM FG
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control decimal-input" name="decRMFG" placeholder="0.00" value="${d.decRmfg || ''}" oninput="formatDecimal(this)" onchange="updateRMPercentSummary()">
                            </div>`,

                            // 14. Product Group
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <div class="input-group-btn">
                                        <button type="button" class="btn btn-danger" onclick="p_btnLOVPRODUCTGROUPClick(this)">
                                            <i class="fa fa-search"></i>
                                        </button>
                                    </div>
                                    <input type="text" class="form-control" name="intProductGroup" value="${d.intProductGroup || ''}" readonly>
                                </div>
                            </div>`,

                            // 15. Product Group
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <div class="input-group-btn">
                                        <button type="button" class="btn btn-danger" onclick="p_btnLOVINTERMEDIETEClick(this)">
                                            <i class="fa fa-search"></i>
                                        </button>
                                    </div>
                                    <input type="text" class="form-control" name="txtIntermediete" value="${d.txtIntermediete || ''}" readonly>
                                </div>
                            </div>`
                        ]).draw(false);
                    }
                    setTimeout(() => {
                        $('.DTFC_LeftBodyWrapper, .DTFC_RightBodyWrapper').css('overflow', 'visible');
                    }, 300);
                    //tableIntermedieteMappingDetail.columns.adjust().draw(false);

                    updateRMPercentSummary();

                    // ✅ Refresh Line Numbers after insert
                    refreshVarianLineDetailIDs();

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

$('#modalDetail').on('shown.bs.modal', function () {
    tableIntermedieteMappingDetail.columns.adjust().draw(false);
});
function p_DataToUI(objData) {
    debugger;

    tableIntermedieteMapping.clear().draw(false);

    $("#txtHiddenObject").val(JSON.stringify(objData));


}

//function p_UIToData() {
//    debugger;

//    var jsonObj = [];
//    var htmlJSON = $("#txtHiddenObject").val();
//    jsonData = JSON.parse(htmlJSON);

//    jsonData.MItemMappingList = $("#txtHiddenObjectList").val();

//    $("#txtHiddenObject").val(JSON.stringify(jsonData));
//}

function p_UIToData() {
    debugger;

    var htmlJSON = $("#txtHiddenObject").val();
    var jsonData = JSON.parse(htmlJSON) || {};

    // Fix jika jsonData adalah array
    if (!jsonData || typeof jsonData !== "object" || Array.isArray(jsonData)) {
        jsonData = {};
    }

    var listJSON = $("#txtHiddenObjectList").val();
    if (listJSON && listJSON.trim() !== "") {
        jsonData.MIntermedieteMappingList = JSON.parse(listJSON);
    } else {
        jsonData.MIntermedieteMappingList = [];
    }

    $("#txtHiddenObject").val(JSON.stringify(jsonData));

    var ho = $("#txtHiddenObject").val(); // sekarang seharusnya berisi MItemMappingList
    var dt = $("#txtHiddenObjectList").val();
}

function p_UIToDataList() {
    debugger;

    var jsonArray = "[";
    var table = $("#tableIntermedieteMappingDetail").DataTable(); // ambil instance DataTable
    let validRowCount = 0;

    table.rows().every(function () {
        let $row = $(this.node());

        // Abaikan baris placeholder "No data available"
        if ($row.hasClass("dataTables_empty") || $row.text().trim() === "No data available in table") {
            return;
        }

        // Ambil nilai dari setiap kolom
        let idVal = $row.find('input[name="intIntermedieteMappingId"]').val();
        let intIntermedieteMappingId = '"intIntermedieteMappingId" : ' + (idVal ? `"${idVal}"` : 0);
        let txtPlant = '"txtPlant" : "' + ($row.find('input[name="txtPlant"]').val() || "") + '"';
        let txtBrand = '"txtBrand" : "' + ($row.find('input[name="txtBrand"]').val() || "") + '"';
        let txtVarianRasa = '"txtVarianRasa" : "' + ($row.find('input[name="txtVarianRasa"]').val() || "") + '"';

        let txtFGCode = '"txtFGCode" : "' + ($row.find('input[name="txtFGCode"]').val() || "") + '"';
        let txtProductCode = '"txtProductCode" : "' + ($row.find('input[name="txtProductCode"]').val() || "") + '"';
        let txtProductDesc = '"txtProductDesc" : "' + ($row.find('textarea[name="txtProductDesc"]').val() || "") + '"';
        let txtGrandParent = '"txtGrandParent" : "' + ($row.find('input[name="txtGrandParent"]').val() || "") + '"';
        let txtRMCode = '"txtRMCode" : "' + ($row.find('input[name="txtRMCode"]').val() || "") + '"';
        let txtRMDesc = '"txtRMDesc" : "' + ($row.find('textarea[name="txtRMDesc"]').val() || "") + '"';

        let rawdecRMFG = $row.find('input[name="decRMFG"]').val() || "0";
        rawdecRMFG = rawdecRMFG.replace(/,/g, '');
        let decRMFG = '"decRMFG" : "' + rawdecRMFG + '"';

        let intProductGroup = '"intProductGroup" : "' + ($row.find('input[name="intProductGroup"]').val() || "") + '"';
        let txtIntermediete = '"txtIntermediete" : "' + ($row.find('input[name="txtIntermediete"]').val() || "") + '"';

        let jsonObj = "{" +
            intIntermedieteMappingId + "," +
            txtPlant + "," +
            txtBrand + "," +
            txtVarianRasa + "," +
            txtFGCode + "," +
            txtProductCode + "," +
            txtProductDesc + "," +
            txtGrandParent + "," +
            txtRMCode + "," +
            txtRMDesc + "," +
            decRMFG + "," +
            intProductGroup + "," +
            txtIntermediete +
            "}";

        if (validRowCount > 0) {
            jsonArray += ",";
        }

        jsonArray += jsonObj;
        validRowCount++;
    });

    jsonArray += "]";

    if (validRowCount === 0) {
        jsonArray = "[]";
    }

    $("#txtHiddenObjectList").val(jsonArray);
}


//function p_UIToDataList() {
//    debugger;

//    var jsonArray = "[";

//    const $rows = $("#tableIntermedieteMappingDetail tbody tr");

//    // Jika tidak ada baris, langsung set [] dan return
//    if ($rows.length === 0) {
//        $("#txtHiddenObjectList").val("[]");
//        return;
//    }

//    let validRowCount = 0;

//    $rows.each(function (index, row) {
//        let $row = $(row);
//        debugger;
//        // Abaikan baris jika placeholder "No data available"
//        if ($row.hasClass("dataTables_empty") || $row.text().trim() === "No data available in table") {
//            return;
//        }

//        // Ambil nilai dari setiap kolom
//        let idVal = $row.find('input[name="intIntermedieteMappingId"]').val();
//        let intIntermedieteMappingId = '"intIntermedieteMappingId" : ' + (idVal ? `"${idVal}"` : 0);
//        let txtPlant = '"txtPlant" : "' + ($row.find('input[name="txtPlant"]').val() || "") + '"';
//        let txtBrand = '"txtBrand" : "' + ($row.find('input[name="txtBrand"]').val() || "") + '"';
//        let txtVarianRasa = '"txtVarianRasa" : "' + ($row.find('input[name="txtVarianRasa"]').val() || "") + '"';      

//        let txtFGCode = '"txtFGCode" : "' + ($row.find('input[name="txtFGCode"]').val() || "") + '"';
//        let txtProductCode = '"txtProductCode" : "' + ($row.find('input[name="txtProductCode"]').val() || "") + '"';
//        let txtProductDesc = '"txtProductDesc" : "' + ($row.find('textarea[name="txtProductDesc"]').val() || "") + '"';
//        let txtGrandParent = '"txtGrandParent" : "' + ($row.find('input[name="txtGrandParent"]').val() || "") + '"';
//        let txtRMCode = '"txtRMCode" : "' + ($row.find('input[name="txtRMCode"]').val() || "") + '"';
//        let txtRMDesc = '"txtRMDesc" : "' + ($row.find('textarea[name="txtRMDesc"]').val() || "") + '"';

//        let rawdecRMFG = $row.find('input[name="decRMFG"]').val() || "0";
//        rawdecRMFG = rawdecRMFG.replace(/,/g, '');
//        let decRMFG = '"decRMFG" : "' + rawdecRMFG + '"';

//        let intProductGroup = '"intProductGroup" : "' + ($row.find('input[name="intProductGroup"]').val() || "") + '"';
//        let txtIntermediete = '"txtIntermediete" : "' + ($row.find('input[name="txtIntermediete"]').val() || "") + '"';

//        let jsonObj = "{" +
//            intIntermedieteMappingId + "," +
//            txtPlant + "," +
//            txtBrand + "," +
//            txtVarianRasa + "," +
//            txtFGCode + "," +
//            txtProductCode + "," +
//            txtProductDesc + "," +
//            txtGrandParent + "," +
//            txtRMCode + "," +
//            txtRMDesc + "," +
//            decRMFG + "," +
//            intProductGroup + "," +
//            txtIntermediete +
//            "}";

//        if (validRowCount > 0) {
//            jsonArray += ",";
//        }

//        jsonArray += jsonObj;
//        validRowCount++;
//    });

//    jsonArray += "]";

//    if (validRowCount === 0) {
//        jsonArray = "[]";
//    }

//    $("#txtHiddenObjectList").val(jsonArray);
//}

function p_PopulateDataTable() {
    debugger;
    const table = $('#tableIntermedieteMappingDetail').DataTable();
    const dataRows = table.rows().nodes();

    let $firstRow = null;
    if (dataRows.length > 0) {
        $firstRow = $(dataRows[0]);

        const fieldsToCheck = [
            { name: "txtPlant", label: "Plant" },
            { name: "txtBrand", label: "Brand" },
            { name: "txtVarianRasa", label: "Varian Rasa" },
            { name: "txtFGCode", label: "FG Code" }
        ];

        // Cek field mana saja yang kosong
        const emptyFields = fieldsToCheck.filter(field => {
            const input = $firstRow.find(`input[name="${field.name}"]`);
            return input.length && input.val().trim() === "";
        });

        if (emptyFields.length > 0) {
            const labels = emptyFields.map(f => f.label).join(', ');
            Swal.fire({
                icon: 'warning',
                title: 'Validasi Gagal',
                html: `Kolom berikut pada baris pertama wajib diisi sebelum menambahkan baris baru:<br><strong>${labels}</strong>`
            });
            return;
        }
    }

    // Default values jika ada baris pertama
    let defaultPlant = $firstRow?.find('input[name="txtPlant"]').val() || "";
    let defaultBrand = $firstRow?.find('input[name="txtBrand"]').val() || "";
    let defaultVarian = $firstRow?.find('input[name="txtVarianRasa"]').val() || "";
    let defaultFGCode = $firstRow?.find('input[name="txtFGCode"]').val() || "";

    let Plant = "";
    let fgCodeCol = "";
    if (!isEditMode) {
        // Mode ADD → tampilkan tombol search
        Plant = `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <div class="input-group">
                <div class="input-group-btn">
                    <button type="button" class="btn btn-danger" onclick="p_btnLOVPOTSClick(this)">
                        <i class="fa fa-search"></i>
                    </button>
                </div>
                <input type="text" class="form-control" name="txtPlant"  value="${defaultPlant}" readonly>
            </div>
        </div>`;

        fgCodeCol = `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <div class="input-group">
                <div class="input-group-btn">
                    <button type="button" class="btn btn-danger" onclick="p_btnLOVFGCODEClick(this)">
                        <i class="fa fa-search"></i>
                    </button>
                </div>
                <input type="text" class="form-control" name="txtFGCode" readonly>
            </div>
        </div>`;
    } else {
        // Mode EDIT → hanya textbox readonly, tanpa tombol
        Plant = `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <input type="text" class="form-control" name="txtPlant"  value="${defaultPlant}" readonly>
        </div>`;

        fgCodeCol = `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <input type="text" class="form-control" name="txtFGCode" value="${defaultFGCode}" readonly>
        </div>`;
    }

    tableIntermedieteMappingDetail.row.add([
        // 1. Action column
        `<div style="text-align:center">
            <i class="fas fa-trash fa-2x trash-icon" onclick="deleteRowdataDetail(this)"></i>
            <input type="hidden" name="intIntermedieteMappingId" value="">
        </div>`,

        // 2. Id (hidden)
        `<input type="hidden" name="intIntermedieteMappingId" value="">`,

        // 3. Line No (running number)
        `<input type="text" name="lineNo" value="${lineCounter++}" readonly>`,  // 🟢 Tambah running number

        //// 4. Plant
        //`<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
        //    <div class="input-group">
        //        <div class="input-group-btn">
        //            <button type="button" class="btn btn-danger" onclick="p_btnLOVPOTSClick(this)">
        //                <i class="fa fa-search"></i>
        //            </button>
        //        </div>
        //        <input type="text" class="form-control" name="txtPlant"  value="${defaultPlant}" readonly>
        //    </div>
        //</div>`,
        Plant,

        //// 5. Brand
        //`<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
        //    <div class="input-group">
        //        <div class="input-group-btn">
        //            <button type="button" class="btn btn-danger" onclick="p_btnLOVBRANDClick(this)">
        //                <i class="fa fa-search"></i>
        //            </button>
        //        </div>
        //        <input type="text" class="form-control" name="txtBrand"  value="${defaultBrand}" readonly>
        //    </div>
        //</div>`,
        // 5. Brand
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
             <input type="text" class="form-control" name="txtBrand"  value="${defaultBrand}" readonly>
        </div>`,

        //// 6. Varian Rasa
        //`<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
        //    <div class="input-group">
        //        <div class="input-group-btn">
        //            <button type="button" class="btn btn-danger" onclick="p_btnLOVVARIANRASAClick(this)">
        //                <i class="fa fa-search"></i>
        //            </button>
        //        </div>
        //        <input type="text" class="form-control" name="txtVarianRasa"  value="${defaultVarian}" readonly>
        //    </div>
        //</div>`,
        // 6. Varian Rasa
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <input type="text" class="form-control" name="txtVarianRasa"  value="${defaultVarian}" readonly>
        </div>`,

        //// 7. FG Code
        //`<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
        //    <div class="input-group">
        //        <div class="input-group-btn">
        //            <button type="button" class="btn btn-danger" onclick="p_btnLOVFGCODEClick(this)">
        //                <i class="fa fa-search"></i>
        //            </button>
        //        </div>
        //        <input type="text" class="form-control" name="txtFGCode" readonly>
        //    </div>
        //</div>`,
        fgCodeCol,

        // 8. Product
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <div class="input-group">
                <div class="input-group-btn">
                    <button type="button" class="btn btn-danger" onclick="p_btnLOVPRODUCTCODEClick(this)">
                        <i class="fa fa-search"></i>
                    </button>
                </div>
                <input type="text" class="form-control" name="txtProductCode" readonly>
            </div>
        </div>`,

        // 9. Product Desc
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <textarea class="form-control" name="txtProductDesc" readonly rows="3"></textarea>
        </div>`,

        //// 10. Grand Parent
        //`<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
        //    <div class="input-group">
        //        <div class="input-group-btn">
        //            <button type="button" class="btn btn-danger" onclick="p_btnLOVGRANDPARENTClick(this)">
        //                <i class="fa fa-search"></i>
        //            </button>
        //        </div>
        //        <input type="text" class="form-control" name="txtGrandParent" readonly>
        //    </div>
        //</div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <input type="text" class="form-control" name="txtGrandParent" readonly>
        </div>`,

        // 11. RM Code
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <div class="input-group">
                <div class="input-group-btn">
                    <button type="button" class="btn btn-danger" onclick="p_btnLOVRMCODEClick(this)">
                        <i class="fa fa-search"></i>
                    </button>
                </div>
                <input type="text" class="form-control" name="txtRMCode" readonly>
            </div>
        </div>`,

        // 12. RM Desc
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <textarea class="form-control" name="txtRMDesc" readonly rows="3"></textarea>
        </div>`,

        // 13. RM FG
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <input type="text" class="form-control decimal-input" name="decRMFG" placeholder="0.00" oninput="formatDecimal(this)" onchange="updateRMPercentSummary()">
        </div>`,

        // 14. Product Group
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <div class="input-group">
                <div class="input-group-btn">
                    <button type="button" class="btn btn-danger" onclick="p_btnLOVPRODUCTGROUPClick(this)">
                        <i class="fa fa-search"></i>
                    </button>
                </div>
                <input type="text" class="form-control" name="intProductGroup" readonly>
            </div>
        </div>`,

        // 15. Product Group
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <div class="input-group">
                <div class="input-group-btn">
                    <button type="button" class="btn btn-danger" onclick="p_btnLOVINTERMEDIETEClick(this)">
                        <i class="fa fa-search"></i>
                    </button>
                </div>
                <input type="text" class="form-control" name="txtIntermediete" readonly>
            </div>
        </div>`
    ]).draw();
    tableIntermedieteMappingDetail.order([[2, 'desc']]).draw();
}

function p_PopulateDataTableDetail() {
    const firstRow = $('#tableIntermedieteMappingDetail tbody tr:first');

    if (firstRow.length > 0) {
        const fields = [
            { name: 'txtPlant', label: 'Plant' },
            { name: 'txtBrand', label: 'Brand' },
            { name: 'txtVarianRasa', label: 'Varian Rasa' }
        ];

        for (let field of fields) {
            const input = firstRow.find(`input[name="${field.name}"]`);
            const value = input.val()?.trim();

            if (!value) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Peringatan',
                    text: `${field.label} pada baris pertama wajib diisi sebelum menambahkan baris baru.`
                });

                input.focus();
                return; // hentikan proses tambah baris
            }
        }
    }

    tableIntermedieteMappingDetail.row.add([
        // 1. Action column
        `<div style="text-align:center">
            <i class="fas fa-trash fa-2x trash-icon" onclick="deleteRowdataDetail(this)"></i>
            <input type="hidden" name="intIntermedieteMappingId" value="">
        </div>`,

        // 2. Id (hidden)
        `<input type="hidden" name="intIntermedieteMappingId" value="">`,

        // 3. Line No (running number)
        `<input type="text" name="lineNo" value="${lineCounter++}" readonly>`,  // 🟢 Tambah running number

        // 4. Plant
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <div class="input-group">
                <div class="input-group-btn">
                    <button type="button" class="btn btn-danger" onclick="p_btnLOVPOTSClick(this)">
                        <i class="fa fa-search"></i>
                    </button>
                </div>
                <input type="text" class="form-control" name="txtPlant" readonly>
            </div>
        </div>`,

        // 5. Brand
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <div class="input-group">
                <div class="input-group-btn">
                    <button type="button" class="btn btn-danger" onclick="p_btnLOVBRANDClick(this)">
                        <i class="fa fa-search"></i>
                    </button>
                </div>
                <input type="text" class="form-control" name="txtBrand" readonly>
            </div>
        </div>`,

        // 6. Varian Rasa
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <div class="input-group">
                <div class="input-group-btn">
                    <button type="button" class="btn btn-danger" onclick="p_btnLOVVARIANRASAClick(this)">
                        <i class="fa fa-search"></i>
                    </button>
                </div>
                <input type="text" class="form-control" name="txtVarianRasa" readonly>
            </div>
        </div>`,

        // 7. FG Code
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <div class="input-group">
                <div class="input-group-btn">
                    <button type="button" class="btn btn-danger" onclick="p_btnLOVFGCODEClick(this)">
                        <i class="fa fa-search"></i>
                    </button>
                </div>
                <input type="text" class="form-control" name="txtFGCode" readonly>
            </div>
        </div>`,

        // 8. Product
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <div class="input-group">
                <div class="input-group-btn">
                    <button type="button" class="btn btn-danger" onclick="p_btnLOVPRODUCTCODEClick(this)">
                        <i class="fa fa-search"></i>
                    </button>
                </div>
                <input type="text" class="form-control" name="txtProductCode" readonly>
            </div>
        </div>`,

        // 9. Product Desc
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <textarea class="form-control" name="txtProductDesc" readonly rows="3"></textarea>
        </div>`,

        // 10. Grand Parent
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <div class="input-group">
                <div class="input-group-btn">
                    <button type="button" class="btn btn-danger" onclick="p_btnLOVGRANDPARENTClick(this)">
                        <i class="fa fa-search"></i>
                    </button>
                </div>
                <input type="text" class="form-control" name="txtGrandParent" readonly>
            </div>
        </div>`,

        // 11. RM Code
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <div class="input-group">
                <div class="input-group-btn">
                    <button type="button" class="btn btn-danger" onclick="p_btnLOVRMCODEClick(this)">
                        <i class="fa fa-search"></i>
                    </button>
                </div>
                <input type="text" class="form-control" name="txtRMCode" readonly>
            </div>
        </div>`,

        // 12. RM Desc
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <textarea class="form-control" name="txtRMDesc" readonly rows="3"></textarea>
        </div>`,

        // 13. RM FG
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <input type="text" class="form-control decimal-input" name="decRMFG" placeholder="0.00" oninput="formatDecimal(this)" onchange="updateRMPercentSummary()">
        </div>`,

        // 14. Product Group
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <div class="input-group">
                <div class="input-group-btn">
                    <button type="button" class="btn btn-danger" onclick="p_btnLOVPRODUCTGROUPClick(this)">
                        <i class="fa fa-search"></i>
                    </button>
                </div>
                <input type="text" class="form-control" name="intProductGroup" readonly>
            </div>
        </div>`,

        // 15. Product Group
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <div class="input-group">
                <div class="input-group-btn">
                    <button type="button" class="btn btn-danger" onclick="p_btnLOVINTERMEDIETEClick(this)">
                        <i class="fa fa-search"></i>
                    </button>
                </div>
                <input type="text" class="form-control" name="txtIntermediete" readonly>
            </div>
        </div>`
    ]).draw();
    tableIntermedieteMappingDetail.order([[2, 'desc']]).draw();
}

function deleteRowdataDetail(data) {
    debugger;
    clsGlobal.getConfirmation("Delete this data?",
        function (result) {
            if (result == true) {
                debugger;
                tableIntermedieteMappingDetail.rows($(data).parent().parent().parent()).remove().draw();
                refreshVarianLineDetailIDs();
                updateRMPercentSummary();;
            } else {
                return false;
            }
        });
};

function refreshVarianLineIDs() {
    let totalRows = tableIntermedieteMapping.rows({ order: 'applied' }).count();
    let i = totalRows;

    // Loop berdasarkan urutan visual di layar (descending LINE NO)
    tableIntermedieteMapping.rows({ order: 'applied' }).every(function () {
        tableIntermedieteMapping.cell(this, 2).data(`<input type="text" name="lineNo" value="${i}" readonly>`);
        i--;
    });

    lineCounter = totalRows + 1; // untuk baris baru nanti
}

function refreshVarianLineDetailIDs() {
    let totalRows = tableIntermedieteMappingDetail.rows({ order: 'applied' }).count();
    let i = totalRows;

    // Loop berdasarkan urutan visual di layar (descending LINE NO)
    tableIntermedieteMappingDetail.rows({ order: 'applied' }).every(function () {
        tableIntermedieteMappingDetail.cell(this, 2).data(`<input type="text" name="lineNo" value="${i}" readonly>`);
        i--;
    });

    lineCounter = totalRows + 1; // untuk baris baru nanti
}


function p_txtPlant_TextChanged(POTS) {
    debugger;
    //var table_Length = $('#tableIntermedieteMapping tbody tr').length;
    //var index = $('#tableIntermedieteMapping tbody tr').length - 1;

    //tableIntermedieteMapping.cell(index, 2).nodes().to$().find('input').val(CATEGORY);

    if (currentPlantInput) {
        currentPlantInput.val(POTS);
        currentPlantInput = null; // reset setelah pakai
    }

}
function p_txtGroup_TextChanged(POTS) {
    debugger;
    //var table_Length = $('#tableIntermedieteMapping tbody tr').length;
    //var index = $('#tableIntermedieteMapping tbody tr').length - 1;

    //tableIntermedieteMapping.cell(index, 2).nodes().to$().find('input').val(CATEGORY);

    if (currentPlantInput) {
        currentPlantInput.val(POTS);
        currentPlantInput = null; // reset setelah pakai
    }

}
function p_txtBrand_TextChanged(GRANDPARENT) {
    debugger;
    //var table_Length = $('#tableIntermedieteMapping tbody tr').length;
    //var index = $('#tableIntermedieteMapping tbody tr').length - 1;

    //tableIntermedieteMapping.cell(index, 3).nodes().to$().find('input').val(GRANDPARENT);
    if (currentGrandParentInput) {
        currentGrandParentInput.val(GRANDPARENT);
        currentGrandParentInput = null; // reset setelah pakai
    }
}

function p_txtVarianRasa_TextChanged(VARIAN) {
    debugger;
    //var table_Length = $('#tableIntermedieteMapping tbody tr').length;
    //var index = $('#tableIntermedieteMapping tbody tr').length - 1;

    //tableIntermedieteMapping.cell(index, 4).nodes().to$().find('input').val(PARENT);
    if (currentVarianRasaInput) {
        currentVarianRasaInput.val(VARIAN);
        currentVarianRasaInput = null; // reset setelah pakai
    }
}

function p_TxtGroup_TextChanged(GROUP) {
    debugger;
    //var table_Length = $('#tableIntermedieteMapping tbody tr').length;
    //var index = $('#tableIntermedieteMapping tbody tr').length - 1;

    //tableIntermedieteMapping.cell(index, 5).nodes().to$().find('input').val(GROUP);
    if (currentGroupInput) {
        currentGroupInput.val(GROUP);
        currentGroupInput = null; // reset setelah pakai
    }
}

function p_txtItemEPMCode_TextChanged(RMCODE, RMDESC = '', UOM) {
    debugger;
    //var table_Length = $('#tableIntermedieteMapping tbody tr').length;
    //var index = $('#tableIntermedieteMapping tbody tr').length - 1;

    //tableIntermedieteMapping.cell(index, 5).nodes().to$().find('input').val(GROUP);
    if (currentRMCodeInput) {
        currentRMCodeInput.val(RMCODE);
        currentRMCodeInput = null; // reset setelah pakai
    }

    if (currentRMDescription) {
        currentRMDescription.val(RMDESC);
        currentRMDescription = null;
    }

    if (currentPrimaryUOM) {
        currentPrimaryUOM.val(UOM);
        currentPrimaryUOM = null;
    }
}

function p_txtFGCode_TextChanged(FGCODE, BRAND = '', VARIAN = '') {
    debugger;

    if (currentFGCodeInput) {
        currentFGCodeInput.val(FGCODE);
        currentFGCodeInput = null; // reset setelah pakai
    }

    if (currentBrandInput) {
        currentBrandInput.val(BRAND);
        currentBrandInput = null; // reset setelah pakai
    }

    if (currentVarianRasaInput) {
        currentVarianRasaInput.val(VARIAN);
        currentVarianRasaInput = null; // reset setelah pakai
    }
}

function p_txtProductCode_TextChanged(PRODUCTCODE, PRODUCTDESC = '') {
    debugger;

    if (currentProductCodeInput) {
        currentProductCodeInput.val(PRODUCTCODE);
        currentProductCodeInput = null; // reset setelah pakai
    }

    if (currentProductDesc) {
        currentProductDesc.val(PRODUCTDESC);
        currentProductDesc = null;
    }
}

function p_TxtGrandParent_TextChanged(GRANDPARENT) {
    debugger;

    if (currentGrandParentInput) {
        currentGrandParentInput.val(GRANDPARENT);
        currentGrandParentInput = null; // reset setelah pakai
    }
}

function p_TxtRMCode_TextChanged(RMCODE, RMDESC = '', GRANDPARENT = '') {
    debugger;

    if (currentRMCodeInput) {
        currentRMCodeInput.val(RMCODE);
        currentRMCodeInput = null; // reset setelah pakai
    }

    if (currentRMDescription) {
        currentRMDescription.val(RMDESC);
        currentRMDescription = null;
    }

    if (currentGrandParentInput) {
        currentGrandParentInput.val(GRANDPARENT);
        currentGrandParentInput = null;
    }
}
function p_IntProductGroup_TextChanged(PRODUCTGROUP) {
    debugger;
    if (currentProductGroupInput) {
        currentProductGroupInput.val(PRODUCTGROUP);
        currentProductGroupInput = null; // reset setelah pakai
    }
}

function p_txtIntermediete_TextChanged(INTERMEDIETE) {
    debugger;

    if (currentIntermedieteInput) {
        currentIntermedieteInput.val(INTERMEDIETE);
        currentIntermedieteInput = null; // reset setelah pakai
    }
}
function p_txtPrimaryUom_TextChanged(UOM) {
    debugger;
    //var table_Length = $('#tableIntermedieteMapping tbody tr').length;
    //var index = $('#tableIntermedieteMapping tbody tr').length - 1;

    //tableIntermedieteMapping.cell(index, 5).nodes().to$().find('input').val(GROUP);
    if (currentUomInput) {
        currentUomInput.val(UOM);
        currentUomInput = null; // reset setelah pakai
    }
}

function updateRMPercentSummary() {
    let total = 0;

    $('input[name="decRMFG"]').each(function () {
        let val = parseFloat($(this).val());
        if (!isNaN(val)) {
            total += val;
        }
    });

    let summaryField = $('#rmPercentSummary');
    let percentageText = total.toFixed(2) + '%';

    summaryField.val(percentageText);

    if (total >= 99.99 && total <= 100.01) {
        summaryField.removeClass('text-danger').addClass('text-success');
    } else {
        summaryField.removeClass('text-success').addClass('text-danger');
    }
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

function p_ExportData() {
    clsGlobal.getConfirmation("Export Data?", function (result) {
        if (result === true) {
            debugger;

            $.ajax({
                type: "POST",
                url: "/IntermedieteMapping/NPOIExportToExcelData",
                data: {
                    data: $("#txtHiddenObject").val(),
                    __RequestVerificationToken: $('#frmIntermedieteMapping input[name=__RequestVerificationToken]').val()

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
        } else {
            return false;
        }
    });
}

//=======================
// HANDLER
//=======================

function p_btnLOVPOTSClick(btn) {
    try {
        debugger;
        currentPlantInput = $(btn).closest('.input-group').find('input[name="txtPlant"]');

        // simpan sebagai global (bukan scoped var)
        LOV = clsGlobal.generateLOV("LOV_POTS", "txtPlant");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};
function p_btnLOVCATEGORYClick(btn) {
    try {
        debugger;
        currentPlantInput = $(btn).closest('.input-group').find('input[name="txtPlant"]');

        // simpan sebagai global (bukan scoped var)
        LOV = clsGlobal.generateLOV("MATRIX_CATEGORY", "txtPlant");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};
function p_btnLOVGROUPVARIANTClick(btn) {
    try {
        currentPlantInput = $(btn).closest('.input-group').find('input[name="txtPlant"]');
        LOV = clsGlobal.generateLOV("MATRIX_GROUP_VARIAN", "txtPlant");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};
function p_btnLOVGRANDPARENTClick(btn) {
    try {
        currentGrandParentInput = $(btn).closest('.input-group').find('input[name="txtGrandParent"]');
        LOV = clsGlobal.generateLOV("MATRIX_GRANDPARENT", "txtGrandParent");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVBRANDClick(btn) {
    try {
        currentGrandParentInput = $(btn).closest('.input-group').find('input[name="txtBrand"]');
        LOV = clsGlobal.generateLOV("MATRIX_BRAND", "txtBrand");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVPARENTClick(btn) {
    try {
        currentParentInput = $(btn).closest('.input-group').find('input[name="txtVarianRasa"]');
        LOV = clsGlobal.generateLOV("MATRIX_PARENT", "txtVarianRasa");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVVARIANRASAClick(btn) {
    try {
        currentVarianRasaInput = $(btn).closest('.input-group').find('input[name="txtVarianRasa"]');
        LOV = clsGlobal.generateLOV("MATRIX_VARIAN_RASA", "txtVarianRasa");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVGROUPClick(btn) {
    try {
        currentGroupInput = $(btn).closest('.input-group').find('input[name="txtGroup"]');
        LOV = clsGlobal.generateLOV("MATRIX_GROUP", "txtGroup");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVRMCODEClick(btn) {
    try {
        const group = $(btn).closest('tr'); // baris saat ini

        //currentRMCodeInput = $(btn).closest('.input-group').find('input[name="txtItemEPMCode"]');
        currentRMCodeInput = group.find('input[name="txtRMCode"]');

        currentRMDescription = group.find('textarea[name="txtRMDesc"]');

        currentGrandParentInput = group.find('input[name="txtGrandParent"]');

        LOV = clsGlobal.generateLOV("MATRIX_RMCODEITEMMAPPING", "txtRMCode");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVFGCODEClick(btn) {
    try {
        const group = $(btn).closest('tr'); // baris saat ini

        //currentRMCodeInput = $(btn).closest('.input-group').find('input[name="txtItemEPMCode"]');
        currentFGCodeInput = group.find('input[name="txtFGCode"]');

        currentBrandInput = group.find('input[name="txtBrand"]');

        currentVarianRasaInput = group.find('input[name="txtVarianRasa"]');       

        LOV = clsGlobal.generateLOV("MATRIX_FGCODEVARIANRASA", "txtFGCode");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVPRODUCTCODEClick(btn) {
    try {
        const group = $(btn).closest('tr'); // baris saat ini

        //currentRMCodeInput = $(btn).closest('.input-group').find('input[name="txtItemEPMCode"]');
        currentProductCodeInput = group.find('input[name="txtProductCode"]');

        currentProductDesc = group.find('textarea[name="txtProductDesc"]');

        LOV = clsGlobal.generateLOV("MATRIX_FORMULACODEORACLE", "txtProductCode");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVPRODUCTGROUPClick(btn) {
    try {
        currentProductGroupInput = $(btn).closest('.input-group').find('input[name="intProductGroup"]');
        LOV = clsGlobal.generateLOV("MATRIX_PRODUCT_GROUP", "intProductGroup");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};
function p_btnLOVINTERMEDIETEClick(btn) {
    try {
        const group = $(btn).closest('tr'); // baris saat ini

        //currentRMCodeInput = $(btn).closest('.input-group').find('input[name="txtItemEPMCode"]');
        currentIntermedieteInput = group.find('input[name="txtIntermediete"]');

        LOV = clsGlobal.generateLOV("MATRIX_RMCODEORACLE", "txtIntermediete");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};
function p_btnLOVUOMClick(btn) {
    try {
        currentUomInput = $(btn).closest('.input-group').find('input[name="txtPrimaryUom"]');
        LOV = clsGlobal.generateLOV("MATRIX_UOMORACLE", "txtPrimaryUom");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

$('#btnSave').click(function () {
    debugger;
    const actionText = "save";
    showSaveConfirmation(actionText);
});

function showSaveConfirmation(actionText) {
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
            saveData();
        } else if (result.isDenied) {
            Swal.fire(`Changes are not ${actionText}`, "", "info");
        }
    });
}

function saveData() {
    debugger;
    //if (!validateForm()) {
    //    return;
    //}

    p_UIToDataList();
    p_UIToData();

    const url = window.saveUrl;
    debugger;

    // Buat FormData untuk kirim file + data JSON
    const formData = new FormData();

    const plantH = $('#plantH').val();
    const brandH = $('#brandH').val();
    const varianH = $('#varianH').val();

    formData.append("data", $("#txtHiddenObject").val());
    formData.append("plantH", plantH);
    formData.append("brandH", brandH);
    formData.append("varianH", varianH);
    formData.append("__RequestVerificationToken", $('#IntermedieteMapping input[name=__RequestVerificationToken]').val());


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
                clsGlobal.swalSuccessSaveOrSubmit(retDat.txtMessage, window.indexUrl);
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

function validateForm() {
    debugger;
    let isValid = true;
    const errorMessages = [];

    const fieldDisplayNames = {
        'txtGroup': 'Category',
        'decRatio': 'Ratio'
    };


    const requiredFields = [
        'txtGroup', 'decRatio'
    ];

    requiredFields.forEach(fieldId => {
        const value = $('#' + fieldId).val();
        if (!value) {
            isValid = false;
            const displayName = fieldDisplayNames[fieldId] || fieldId;
            errorMessages.push(`${displayName} is required`);
            $('#' + fieldId).addClass('is-invalid');
        } else {
            $('#' + fieldId).removeClass('is-invalid');
        }
    });

    if (!isValid) {
        toastr.error(errorMessages.join('<br>'), 'Validation Error', { timeOut: 5000 });
    }

    return isValid;
}

$('#btnAdd').bind('click', function () {
    try {
        debugger;
        $("#plantH").val('');
        $("#brandH").val('');
        $("#varianH").val('');
        isEditMode = false;
        tableIntermedieteMappingDetail.clear().draw(false);
        $('#modalDetail').modal('show');

        //setTimeout(function () {
        //    tableIntermedieteMappingDetail.columns.adjust().draw();
        //}, 200);

        //p_PopulateDataTableDetail();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

        $('#btnCancel').on('click', function () {
    try {
        // Tutup modal
        $('#modalDetail').modal('hide');

        // Bersihkan tabel detail
        let table = $('#tableIntermedieteMappingDetail').DataTable();
        table.clear().draw(false);

        // Reset summary RM % jika perlu
        $('#rmPercentSummary').val('');

        // Opsional: Bersihkan hidden GUID atau flag lain
        $('#txtGUID').val('');
        $('#txtHiddenObject').val('');
        $('#txtHiddenObjectList').val('');

    } catch (ex) {
        console.error("Cancel Error:", ex);
    }
});
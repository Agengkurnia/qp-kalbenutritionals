//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
let currentCategoryInput = null;
let currentGrandParentInput = null;
let currentParentInput = null;
let currentGroupInput = null;
let currentRMCodeInput = null;
let currentUOMInput = null;
let currentRMDescription = null;
let currentPrimaryUOM = null;

let currentCategoryMorinagaInput = null;
let currentCategoryMorinagaCode = null;

let currentSubCategoryMorinagaInput = null;
let currentSubCategoryMorinagaCode = null;

let currentRow = null; // simpan row aktif global


//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    p_InitForm();


});

function p_InitForm() {
    p_initiateData();

}

var tableItemMapping = $("#tableItemMapping").DataTable({
    "scrollX": true,
    "scrollY": "500px",
    "fixedHeader": true,
    "scrollCollapse": true,
    renderer: "bootstrap",
    "processing": true,
    "bAutoWidth": false,
    "paging": true,
    //"deferRender": true, 
    "aLengthMenu": [[-1, 5, 10, 100], ["ALL", 5, 10, 100]],
    order: [[2, "asc"], [3, "asc"], [4, "asc"], [5, "asc"]],
    "columnDefs": [
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
        //{ className: "text-center", "targets": [2] },
        { "visible": false, "targets": [1] },
        //{ "visible": false, "targets": [8] },
        //{ "visible": false, "targets": [10] },
        { "className": "d-none", targets: [8, 10] }
    ]
})

$(window).on('resize', function () {
    tableItemMapping.columns.adjust().draw(false);
});

function setChooseLOV(txtValue) {
    var arr = txtValue.split('|');

    debugger;

    switch (arr[0]) {
        case "txtCategory":
            //$("#txtCategory").val(arr[1]);
            p_TxtCategory_TextChanged(arr[2]);
            break;
        case "txtGrandParent":
            //$("#txtCategory").val(arr[1]);
            p_TxtGrandParent_TextChanged(arr[2]);
            break;
        case "txtParent":
            //$("#txtCategory").val(arr[1]);
            p_TxtParent_TextChanged(arr[1]);
            break;
        case "txtGroup":
            //$("#txtCategory").val(arr[1]);
            p_TxtGroup_TextChanged(arr[2]);
            break;
        case "txtRMCode":
            //$("#txtCategory").val(arr[1]);
            p_TxtRMCode_TextChanged(arr[1], arr[2], arr[3]);
            break;
        case "txtPrimaryUom":
            //$("#txtCategory").val(arr[1]);
            p_txtPrimaryUom_TextChanged(arr[1]);
            break;
        case "txtCategoryMorinaga":
            //$("#txtCategory").val(arr[1]);
            p_TxtCategoryMorinaga_TextChanged(arr[2], arr[3]);
            break;
        case "txtSubCategoryMorinaga":
            //$("#txtCategory").val(arr[1]);
            p_TxtSubCategoryMorinaga_TextChanged(arr[2], arr[3]);
            break;
            
    }
    clsGlobal.closeLOV();
}

function p_initiateData() {
    debugger;
    clsGlobal.showLoading();

    $.ajax({
        type: "POST",
        url: "/ItemMapping/InitiateData",
        data: {
            __RequestVerificationToken: $('#frmItemMapping input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    debugger;
                    $("#txtHiddenObject").val(JSON.stringify(retDat.objData));

                    p_DataToUI(retDat.objData);

                    // === ganti cara add rows disini ===
                    tableItemMapping.clear();

                    let rows = [];
                    for (var i = 0; i < retDat.objData.length; i++) {
                        var d = retDat.objData[i];

                        rows.push([
                            // 1. Delete button
                            `<div style="text-align:center">
                                <i class="fas fa-trash fa-2x trash-icon" onclick="deleteRowVisualdata(this)"></i>
                                <input type="hidden" name="intItemMappingId" value="${d.intItemMappingId || ''}">
                            </div>`,

                            // 2. Hidden ID
                            `<input type="hidden" name="intItemMappingId" value="${d.intItemMappingId || ''}">`,

                            // 3. Category
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <div class="input-group-btn">
                                        <button type="button" class="btn btn-danger" onclick="p_btnLOVCATEGORYClick(this)">
                                            <i class="fa fa-search"></i>
                                        </button>
                                    </div>
                                    <input type="text" class="form-control" name="txtCategory" value="${d.txtCategory || ''}" readonly>
                                </div>
                            </div>`,

                            // 4. Grand Parent
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <div class="input-group-btn">
                                        <button type="button" class="btn btn-danger" onclick="p_btnLOVGRANDPARENTClick(this)">
                                            <i class="fa fa-search"></i>
                                        </button>
                                    </div>
                                    <input type="text" class="form-control" name="txtGrandParent" value="${d.txtGrandParent || ''}" readonly>
                                </div>
                            </div>`,

                            // 5. Parent
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <div class="input-group-btn">
                                        <button type="button" class="btn btn-danger" onclick="p_btnLOVPARENTClick(this)">
                                            <i class="fa fa-search"></i>
                                        </button>
                                    </div>
                                    <input type="text" class="form-control" name="txtParent" value="${d.txtParent || ''}" readonly>
                                </div>
                            </div>`,

                            // 6. RM Code
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

                            // 7. RM Description
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtRMDescription" readonly rows="3">${d.txtRmcodeDesc || ''}</textarea>
                            </div>`,

                            // 8. Primary UOM
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <div class="input-group-btn">
                                        <button type="button" class="btn btn-danger" onclick="p_btnLOVUOMClick(this)">
                                            <i class="fa fa-search"></i>
                                        </button>
                                    </div>
                                    <input type="text" class="form-control" maxlength="3" name="txtPrimaryUom" value="${d.txtPrimaryUom || ''}" readonly>
                                </div>
                            </div>`,

                            // 9. Category Morinaga Code
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtCategoryMorinagaCode" value="${d.txtCategoryMorinagaCode || ''}" readonly>
                            </div>`,

                            // 10. Category Morinaga
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <div class="input-group-btn">
                                        <button type="button" class="btn btn-danger" onclick="p_btnLOVCATEGORYMORINAGAClick(this)">
                                            <i class="fa fa-search"></i>
                                        </button>
                                    </div>
                                    <input type="text" class="form-control" name="txtCategoryMorinaga" value="${d.txtCategoryMorinaga || ''}" readonly>
                                </div>
                            </div>`,

                            // 11. Sub Category Morinaga Code
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtSubCategoryMorinagaCode" value="${d.txtSubCategoryMorinagaCode || ''}" readonly>
                            </div>`,

                            // 12. Sub Category Morinaga
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <div class="input-group-btn">
                                        <button type="button" class="btn btn-danger" onclick="p_btnLOVSUBCATEGORYMORINAGAClick(this)">
                                            <i class="fa fa-search"></i>
                                        </button>
                                    </div>
                                    <input type="text" class="form-control" name="txtSubCategoryMorinaga" value="${d.txtSubCategoryMorinaga || ''}" readonly>
                                </div>
                            </div>`,

                            // 13. Group
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <div class="input-group-btn">
                                        <button type="button" class="btn btn-danger" onclick="p_btnLOVGROUPClick(this)">
                                            <i class="fa fa-search"></i>
                                        </button>
                                    </div>
                                    <input type="text" class="form-control" name="txtGroup" value="${d.txtGroup || ''}" readonly>
                                </div>
                            </div>`,

                            // 14. Ratio
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control decimal-input" name="decRatio" placeholder="0.00" value="${d.decRatio || ''}" oninput="formatDecimal(this)">
                                </div>
                            </div>`
                        ]);
                    }

                    tableItemMapping.rows.add(rows).draw(false);
                    // === end ganti cara add rows ===

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


//function p_initiateData() {
//    debugger;
//    clsGlobal.showLoading();

//    $.ajax({
//        type: "POST",
//        url: "/ItemMapping/InitiateData",
//        data: {
//            __RequestVerificationToken: $('#frmItemMapping input[name=__RequestVerificationToken]').val()
//        },
//        datatype: "json",
//        success: function (retDat) {
//            if (retDat.bitSuccess == true) {
//                if (retDat.objData != undefined) {
//                    debugger;
//                    $("#txtHiddenObject").val(JSON.stringify(retDat.objData));

//                    p_DataToUI(retDat.objData);

//                    tableItemMapping.clear().draw(false);

//                    for (var i = 0; i < retDat.objData.length; i++) {
//                        var d = retDat.objData[i];

//                        tableItemMapping.row.add([
//                            // 1. Delete button
//                            `<div style="text-align:center">
//                                <i class="fas fa-trash fa-2x trash-icon" onclick="deleteRowVisualdata(this)"></i>
//                                <input type="hidden" name="intItemMappingId" value="${d.intItemMappingId || ''}">
//                            </div>`,

//                            // 2. Hidden ID
//                            /*`<input type="hidden" name="intItemMappingId" value="${d.intItemMappingId || ''}">`,*/
//                            //`<div style="display:none">
//                            //    <input type="text" name="intItemMappingId" value="${d.intItemMappingId || ''}" />
//                            //</div >`,
//                            //`<input type="number" name="intItemMappingId" value="${d.intItemMappingId || ''}">`,
//                            `<input type="hidden" name="intItemMappingId" value="${d.intItemMappingId || ''}">`,

//                            // 3. Category
//                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
//                                <div class="input-group">
//                                    <div class="input-group-btn">
//                                        <button type="button" class="btn btn-danger" onclick="p_btnLOVCATEGORYClick(this)">
//                                            <i class="fa fa-search"></i>
//                                        </button>
//                                    </div>
//                                    <input type="text" class="form-control" name="txtCategory" value="${d.txtCategory || ''}" readonly>
//                                </div>
//                            </div>`,

//                            // 4. Grand Parent
//                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
//                                <div class="input-group">
//                                    <div class="input-group-btn">
//                                        <button type="button" class="btn btn-danger" onclick="p_btnLOVGRANDPARENTClick(this)">
//                                            <i class="fa fa-search"></i>
//                                        </button>
//                                    </div>
//                                    <input type="text" class="form-control" name="txtGrandParent" value="${d.txtGrandParent || ''}" readonly>
//                                </div>
//                            </div>`,

//                            // 5. Parent
//                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
//                                <div class="input-group">
//                                    <div class="input-group-btn">
//                                        <button type="button" class="btn btn-danger" onclick="p_btnLOVPARENTClick(this)">
//                                            <i class="fa fa-search"></i>
//                                        </button>
//                                    </div>
//                                    <input type="text" class="form-control" name="txtParent" value="${d.txtParent || ''}" readonly>
//                                </div>
//                            </div>`,

//                            // 6. RM Code
//                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
//                                <div class="input-group">
//                                    <div class="input-group-btn">
//                                        <button type="button" class="btn btn-danger" onclick="p_btnLOVRMCODEClick(this)">
//                                            <i class="fa fa-search"></i>
//                                        </button>
//                                    </div>
//                                    <input type="text" class="form-control" name="txtRMCode" value="${d.txtRmcode || ''}" readonly>
//                                </div>
//                            </div>`,

//                            // 7. RM Description
//                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
//                                <textarea class="form-control" name="txtRMDescription" readonly rows="3">${d.txtRmcodeDesc || ''}</textarea>
//                            </div>`,

//                            // 8. Primary UOM
//                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
//                                <div class="input-group">
//                                    <div class="input-group-btn">
//                                        <button type="button" class="btn btn-danger" onclick="p_btnLOVUOMClick(this)">
//                                            <i class="fa fa-search"></i>
//                                        </button>
//                                    </div>
//                                    <input type="text" class="form-control" maxlength="3" name="txtPrimaryUom" value="${d.txtPrimaryUom || ''}" readonly>
//                                </div>
//                            </div>`,

//                            // 8. txtCategoryMorinagaCode
//                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
//                                <input type="text" class="form-control" name="txtCategoryMorinagaCode" value="${d.txtCategoryMorinagaCode || ''}" readonly>
//                            </div>`,

//                            // 8. txtCategoryMorinaga
//                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
//                                <div class="input-group">
//                                    <div class="input-group-btn">
//                                        <button type="button" class="btn btn-danger" onclick="p_btnLOVUOMClick(this)">
//                                            <i class="fa fa-search"></i>
//                                        </button>
//                                    </div>
//                                    <input type="text" class="form-control" name="txtCategoryMorinaga" value="${d.txtCategoryMorinaga || ''}" readonly>
//                                </div>
//                            </div>`,

//                            // 8. txtSubCategoryMorinagaCode
//                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
//                                <input type="text" class="form-control" name="txtSubCategoryMorinagaCode" value="${d.txtSubCategoryMorinagaCode || ''}" readonly>
//                            </div>`,

//                            // 8. txtSubCategoryMorinaga
//                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
//                                <div class="input-group">
//                                    <div class="input-group-btn">
//                                        <button type="button" class="btn btn-danger" onclick="p_btnLOVUOMClick(this)">
//                                            <i class="fa fa-search"></i>
//                                        </button>
//                                    </div>
//                                    <input type="text" class="form-control" name="txtSubCategoryMorinaga" value="${d.txtSubCategoryMorinaga || ''}" readonly>
//                                </div>
//                            </div>`,

//                            // 9. Group
//                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
//                                <div class="input-group">
//                                    <div class="input-group-btn">
//                                        <button type="button" class="btn btn-danger" onclick="p_btnLOVGROUPClick(this)">
//                                            <i class="fa fa-search"></i>
//                                        </button>
//                                    </div>
//                                    <input type="text" class="form-control" name="txtGroup" value="${d.txtGroup || ''}" readonly>
//                                </div>
//                            </div>`,

//                            // 10. Ratio
//                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
//                                <div class="input-group">
//                                    <input type="text" class="form-control decimal-input" name="decRatio" placeholder="0.00" value="${d.decRatio || ''}" oninput="formatDecimal(this)">
//                                </div>
//                            </div>`
//                        ]).draw(false);
//                    }

//                } else {
//                    p_showBlank();
//                }
//            } else {
//                clsGlobal.getAlert(retDat.txtMessage);
//            }
//            clsGlobal.hideLoading();
//        },
//        error: function (retDat) {
//            clsGlobal.hideLoading();
//        }
//    });
//}


function p_DataToUI(objData) {
    debugger;

    tableItemMapping.clear().draw(false);

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
        jsonData.MItemMappingList = JSON.parse(listJSON);
    } else {
        jsonData.MItemMappingList = [];
    }

    $("#txtHiddenObject").val(JSON.stringify(jsonData));

    var ho = $("#txtHiddenObject").val(); // sekarang seharusnya berisi MItemMappingList
    var dt = $("#txtHiddenObjectList").val();
}

function p_UIToDataList() {
    debugger;

    var jsonArray = [];
    var table = $("#tableItemMapping").DataTable();

    table.rows().every(function () {
        var $row = $(this.node());

        // Abaikan baris kosong
        if ($row.hasClass("dataTables_empty") || $row.text().trim() === "No data available in table") {
            return;
        }

        // Ambil nilai dari setiap kolom (sama kayak kode kamu sebelumnya)
        let idVal = $row.find('input[name="intItemMappingId"]').val();
        let obj = {
            intItemMappingId: idVal ? parseInt(idVal) : 0,
            txtCategory: $row.find('input[name="txtCategory"]').val() || "",
            txtGrandParent: $row.find('input[name="txtGrandParent"]').val() || "",
            txtParent: $row.find('input[name="txtParent"]').val() || "",
            txtRMCode: $row.find('input[name="txtRMCode"]').val() || "",
            txtRMCodeDesc: $row.find('textarea[name="txtRMDescription"]').val() || "",
            txtPrimaryUom: $row.find('input[name="txtPrimaryUom"]').val() || "",
            txtCategoryMorinagaCode: $row.find('input[name="txtCategoryMorinagaCode"]').val() || "",
            txtCategoryMorinaga: $row.find('input[name="txtCategoryMorinaga"]').val() || "",
            txtSubCategoryMorinagaCode: $row.find('input[name="txtSubCategoryMorinagaCode"]').val() || "",
            txtSubCategoryMorinaga: $row.find('input[name="txtSubCategoryMorinaga"]').val() || "",
            txtGroup: $row.find('input[name="txtGroup"]').val() || "",
            decRatio: ($row.find('input[name="decRatio"]').val() || "0").replace(/,/g, '')
        };

        jsonArray.push(obj);
    });

    $("#txtHiddenObjectList").val(JSON.stringify(jsonArray));
}


//function p_UIToDataList() {
//    debugger;

//    var jsonArray = "[";

//    const $rows = $("#tableItemMapping tbody tr");

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
//        let idVal = $row.find('input[name="intItemMappingId"]').val();
//        let intItemMappingId = '"intItemMappingId" : ' + (idVal ? `"${idVal}"` : 0);
//        let txtCategory = '"txtCategory" : "' + ($row.find('input[name="txtCategory"]').val() || "") + '"';
//        let txtGrandParent = '"txtGrandParent" : "' + ($row.find('input[name="txtGrandParent"]').val() || "") + '"';
//        let txtParent = '"txtParent" : "' + ($row.find('input[name="txtParent"]').val() || "") + '"';
//        let txtRMCode = '"txtRMCode" : "' + ($row.find('input[name="txtRMCode"]').val() || "") + '"';
//        let txtRMCodeDesc = '"txtRMCodeDesc" : "' + ($row.find('textarea[name="txtRMDescription"]').val() || "") + '"';
//        let txtPrimaryUom = '"txtPrimaryUom" : "' + ($row.find('input[name="txtPrimaryUom"]').val() || "") + '"';
//        let txtCategoryMorinagaCode = '"txtCategoryMorinagaCode" : "' + ($row.find('input[name="txtCategoryMorinagaCode"]').val() || "") + '"';
//        let txtCategoryMorinaga = '"txtCategoryMorinaga" : "' + ($row.find('input[name="txtCategoryMorinaga"]').val() || "") + '"';
//        let txtSubCategoryMorinagaCode = '"txtSubCategoryMorinagaCode" : "' + ($row.find('input[name="txtSubCategoryMorinagaCode"]').val() || "") + '"';
//        let txtSubCategoryMorinaga = '"txtSubCategoryMorinaga" : "' + ($row.find('input[name="txtSubCategoryMorinaga"]').val() || "") + '"';
//        let txtGroup = '"txtGroup" : "' + ($row.find('input[name="txtGroup"]').val() || "") + '"';

//        let rawDecRatio = $row.find('input[name="decRatio"]').val() || "0";
//        rawDecRatio = rawDecRatio.replace(/,/g, '');
//        let decRatio = '"decRatio" : "' + rawDecRatio + '"';

//        let jsonObj = "{" +
//            intItemMappingId + "," +
//            txtCategory + "," +
//            txtGrandParent + "," +
//            txtParent + "," +
//            txtRMCode + "," +
//            txtRMCodeDesc + "," +
//            txtPrimaryUom + "," +
//            txtCategoryMorinagaCode + "," +
//            txtCategoryMorinaga + "," +
//            txtSubCategoryMorinagaCode + "," +
//            txtSubCategoryMorinaga + "," +
//            txtGroup + "," +
//            decRatio +
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
    tableItemMapping.row.add([
        // 1. Action column
        `<div style="text-align:center">
            <i class="fas fa-trash fa-2x trash-icon" onclick="deleteRowVisualdata(this)"></i>
        </div>`,

        // 2. Id (hidden)
        `<input type="hidden" name="intItemMappingId" value="">`,
        //`<input type="number" name="intItemMappingId" value="">`,

        // 3. Category with LOV button
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <div class="input-group">
                <div class="input-group-btn">
                    <button type="button" class="btn btn-danger" onclick="p_btnLOVCATEGORYClick(this)">
                        <i class="fa fa-search"></i>
                    </button>
                </div>
                <input type="text" class="form-control" name="txtCategory" readonly>
            </div>
        </div>`,

        // 4. Grand Parent
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

        // 5. Parent
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <div class="input-group">
                <div class="input-group-btn">
                    <button type="button" class="btn btn-danger" onclick="p_btnLOVPARENTClick(this)">
                        <i class="fa fa-search"></i>
                    </button>
                </div>
                <input type="text" class="form-control" name="txtParent" readonly>
            </div>
        </div>`,

        // 6. RM Code
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

        // 7. RM Description
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <textarea class="form-control" name="txtRMDescription" readonly rows="3" readonly></textarea>
        </div>`,

        // 8. Primary UOM
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <div class="input-group">
                <div class="input-group-btn">
                    <button type="button" class="btn btn-danger" onclick="p_btnLOVUOMClick(this)">
                        <i class="fa fa-search"></i>
                    </button>
                </div>
                <input type="text" class="form-control" maxlength="3" name="txtPrimaryUom" readonly>
            </div>
        </div>`,

        // 8. txtCategoryMorinagaCode
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtCategoryMorinagaCode" readonly>
                            </div>`,

        // 8. txtCategoryMorinaga
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <div class="input-group-btn">
                                        <button type="button" class="btn btn-danger" onclick="p_btnLOVCATEGORYMORINAGAClick(this)">
                                            <i class="fa fa-search"></i>
                                        </button>
                                    </div>
                                    <input type="text" class="form-control" name="txtCategoryMorinaga" readonly>
                                </div>
                            </div>`,

        // 8. txtSubCategoryMorinagaCode
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtSubCategoryMorinagaCode" readonly>
                            </div>`,

        // 8. txtSubCategoryMorinaga
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <div class="input-group-btn">
                                        <button type="button" class="btn btn-danger" onclick="p_btnLOVSUBCATEGORYMORINAGAClick(this)">
                                            <i class="fa fa-search"></i>
                                        </button>
                                    </div>
                                    <input type="text" class="form-control" name="txtSubCategoryMorinaga" readonly>
                                </div>
                            </div>`,

        // 9. Usage Conversion - Group
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <div class="input-group">
                <div class="input-group-btn">
                    <button type="button" class="btn btn-danger" onclick="p_btnLOVGROUPClick(this)">
                        <i class="fa fa-search"></i>
                    </button>
                </div>
                <input type="text" class="form-control" name="txtGroup" readonly>
            </div>
        </div>`,

        // 10. Usage Conversion - Ratio (tanpa LOV)
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <div class="input-group">
                <input type="text" class="form-control decimal-input" name="decRatio" placeholder="0.00" oninput="formatDecimal(this)">
            </div>
        </div>`
    ]).draw();
}

//function deleteRowVisualdata(data) {
//    debugger;
//    clsGlobal.getConfirmation("Delete this data?",
//        function (result) {
//            if (result == true) {
//                debugger;
//                tableItemMapping.rows($(data).parent().parent().parent()).remove().draw();
//            } else {
//                return false;
//            }
//        });
//};

function deleteRowVisualdata(data) {
    debugger;

    clsGlobal.getConfirmation("Delete this data?",
        function (result) {
            if (result == true) {
                debugger;
                let $row = $(data).closest("tr");
                let rmCode = $row.find('input[name="txtRMCode"]').val();

                // Panggil API buat validasi ke server
                $.ajax({
                    type: "POST",
                    url: "/ItemMapping/ValidateDelete",   // bikin endpoint baru di controller
                    data: {
                        rmCode: rmCode,
                        __RequestVerificationToken: $('#frmItemMapping input[name=__RequestVerificationToken]').val()
                    },
                    dataType: "json",
                    success: function (retDat) {
                        if (retDat.bitSuccess === true) {
                            // kalau valid, baru konfirmasi delete
                            clsGlobal.getConfirmation("Delete this data?", function (result) {
                                if (result === true) {
                                    tableItemMapping.rows($row).remove().draw();
                                }
                            });
                        } else {
                            // kalau RM Code sudah ada di APPROVED
                            clsGlobal.getAlert(retDat.txtMessage);
                        }
                    },
                    error: function (xhr) {
                        clsGlobal.getAlert("Error saat validasi delete: " + xhr.responseText);
                    }
                });
            } else {
                return false;
            }
        });   
}


function p_TxtCategory_TextChanged(CATEGORY) {
    debugger;
    //var table_Length = $('#tableItemMapping tbody tr').length;
    //var index = $('#tableItemMapping tbody tr').length - 1;

    //tableItemMapping.cell(index, 2).nodes().to$().find('input').val(CATEGORY);

    if (currentCategoryInput) {
        currentCategoryInput.val(CATEGORY);
        currentCategoryInput = null; // reset setelah pakai
    }
}
function p_TxtGrandParent_TextChanged(GRANDPARENT) {
    debugger;
    //var table_Length = $('#tableItemMapping tbody tr').length;
    //var index = $('#tableItemMapping tbody tr').length - 1;

    //tableItemMapping.cell(index, 3).nodes().to$().find('input').val(GRANDPARENT);
    if (currentGrandParentInput) {
        currentGrandParentInput.val(GRANDPARENT);
        currentGrandParentInput = null; // reset setelah pakai
    }
}

function p_TxtParent_TextChanged(PARENT) {
    debugger;
    //var table_Length = $('#tableItemMapping tbody tr').length;
    //var index = $('#tableItemMapping tbody tr').length - 1;

    //tableItemMapping.cell(index, 4).nodes().to$().find('input').val(PARENT);
    if (currentParentInput) {
        currentParentInput.val(PARENT);
        currentParentInput = null; // reset setelah pakai
    }
}

function p_TxtGroup_TextChanged(GROUP) {
    debugger;
    //var table_Length = $('#tableItemMapping tbody tr').length;
    //var index = $('#tableItemMapping tbody tr').length - 1;

    //tableItemMapping.cell(index, 5).nodes().to$().find('input').val(GROUP);
    if (currentGroupInput) {
        currentGroupInput.val(GROUP);
        currentGroupInput = null; // reset setelah pakai
    }
}

function p_TxtRMCode_TextChanged(RMCODE, RMDESC = '', UOM) {
    debugger;
    //var table_Length = $('#tableItemMapping tbody tr').length;
    //var index = $('#tableItemMapping tbody tr').length - 1;

    //tableItemMapping.cell(index, 5).nodes().to$().find('input').val(GROUP);
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

function p_txtPrimaryUom_TextChanged(UOM) {
    debugger;
    //var table_Length = $('#tableItemMapping tbody tr').length;
    //var index = $('#tableItemMapping tbody tr').length - 1;

    //tableItemMapping.cell(index, 5).nodes().to$().find('input').val(GROUP);
    if (currentUomInput) {
        currentUomInput.val(UOM);
        currentUomInput = null; // reset setelah pakai
    }
}

function p_TxtCategoryMorinaga_TextChanged(CATMORCODE, CATMOR = '') {
    debugger;

    if (currentCategoryMorinagaInput) {
        currentCategoryMorinagaInput.val(CATMOR);
        currentCategoryMorinagaInput = null; // reset setelah pakai
    }

    if (currentCategoryMorinagaCode) {
        currentCategoryMorinagaCode.val(CATMORCODE);
        currentCategoryMorinagaCode = null;
    }
}

function p_TxtSubCategoryMorinaga_TextChanged(SUBCATMORCODE, SUBCATMOR = '') {
    debugger;

    if (currentSubCategoryMorinagaInput) {
        currentSubCategoryMorinagaInput.val(SUBCATMOR);
        currentSubCategoryMorinagaInput = null; // reset setelah pakai
    }

    if (currentSubCategoryMorinagaCode) {
        currentSubCategoryMorinagaCode.val(SUBCATMORCODE);
        currentSubCategoryMorinagaCode = null;
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

function p_ExportData() {
    clsGlobal.getConfirmation("Export Data?", function (result) {
        if (result === true) {
            debugger;

            $.ajax({
                type: "POST",
                url: "/ItemMapping/NPOIExportToExcelData",
                data: {
                    data: $("#txtHiddenObject").val(),
                    __RequestVerificationToken: $('#frmItemMapping input[name=__RequestVerificationToken]').val()
                    
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

function p_btnLOVCATEGORYClick(btn) {
    try {
        currentCategoryInput = $(btn).closest('.input-group').find('input[name="txtCategory"]');
        LOV = clsGlobal.generateLOV("MATRIX_CATEGORY", "txtCategory");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
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

function p_btnLOVPARENTClick(btn) {
    try {
        currentParentInput = $(btn).closest('.input-group').find('input[name="txtParent"]');
        LOV = clsGlobal.generateLOV("MATRIX_RMCODEORACLE", "txtParent");
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

        //currentRMCodeInput = $(btn).closest('.input-group').find('input[name="txtRMCode"]');
        currentRMCodeInput = group.find('input[name="txtRMCode"]');

        currentRMDescription = group.find('textarea[name="txtRMDescription"]');

        currentPrimaryUOM = group.find('input[name="txtPrimaryUom"]');
        LOV = clsGlobal.generateLOV("MATRIX_RMCODEORACLE", "txtRMCode");
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

function p_btnLOVCATEGORYMORINAGAClick(btn) {
    try {
        const group = $(btn).closest('tr'); // baris saat ini

        //currentRMCodeInput = $(btn).closest('.input-group').find('input[name="txtRMCode"]');
        currentCategoryMorinagaInput = group.find('input[name="txtCategoryMorinaga"]');

        currentCategoryMorinagaCode = group.find('input[name="txtCategoryMorinagaCode"]');
        LOV = clsGlobal.generateLOV("MATRIX_CATEGORY_MORINAGA", "txtCategoryMorinaga");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVSUBCATEGORYMORINAGAClick(btn) {
    try {
        const group = $(btn).closest('tr'); // baris saat ini
        currentRow = $(btn).closest('tr'); // simpan baris saat ini
        //currentRMCodeInput = $(btn).closest('.input-group').find('input[name="txtRMCode"]');
        currentSubCategoryMorinagaInput = group.find('input[name="txtSubCategoryMorinaga"]');

        currentSubCategoryMorinagaCode = group.find('input[name="txtSubCategoryMorinagaCode"]');

        let monacode = currentRow.find('input[name="txtCategoryMorinagaCode"]').val();

        currentRow = null; // reset

        LOV = clsGlobal.generateLOV("MATRIX_SUBCATEGORY_MORINAGA", "txtSubCategoryMorinaga", monacode);
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
    formData.append("data", $("#txtHiddenObject").val());
    formData.append("__RequestVerificationToken", $('#frmItemMapping input[name=__RequestVerificationToken]').val());


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
        'txtCategory': 'Category',
        'decRatio': 'Ratio'
    };


    const requiredFields = [
        'txtCategory', 'decRatio'
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
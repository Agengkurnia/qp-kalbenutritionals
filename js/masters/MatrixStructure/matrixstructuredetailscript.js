//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
let currentBrandInput = null;
let currentVarianRasaInput = null;
let currentCategoryInput = null;
let currentGrandParentInput = null;
let currentParentInput = null;
let currentGroupInput = null;
let currentRMCodeInput = null;
let currentUOMInput = null;
let currentRMDescription = null;
let currentPrimaryUOM = null;
let counter = 0;
let currentRow = null; // simpan row aktif global
let currentMatrixRule = null;

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    p_InitForm();


});

function p_InitForm() {
    p_initiateData();

}

var tableMatrix = $("#tableMatrix").DataTable({
    "scrollX": true,
    "scrollY": "500px",
    "fixedHeader": true,
    "scrollCollapse": true,
    renderer: "bootstrap",
    "processing": true,
    "bAutoWidth": false,
    "paging": true,
    "aLengthMenu": [[-1, 5, 10, 100], ["ALL", 5, 10, 100]],
    "fixedColumns": { "left": [2] },
    "order": [[0, "desc"]], // urutkan DESC supaya row terbaru di atas
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
        { "visible": false, "targets": [0] },
    ]
})

var tableTimeStamp = $("#tableTimeStamp").DataTable({
    "scrollX": true,
    "renderer": "bootstrap",
    "processing": true,
    "bAutoWidth": false,
    "paging": true,
    "aLengthMenu": [[-1, 5, 10, 100], ["ALL", 5, 10, 100]],
    //"fixedColumns": { "left": [2] },
    //"order": [[0, "desc"]], // urutkan DESC supaya row terbaru di atas
    "columnDefs": [
        //{ className: "text-center", "targets": [2] },
    //    { "visible": false, "targets": [0] },
    ]
})

// Biar header & body sejajar pas modal dibuka
$('#modalTimeStamp').on('shown.bs.modal', function () {
    tableTimeStamp.columns.adjust().draw();
});

function setChooseLOV(txtValue) {
    var arr = txtValue.split('|');

    debugger;

    switch (arr[0]) {
        case "txtBrand":
            p_TxtBrand_TextChanged(arr[2]);
            break;
        case "txtVarianRasa":
            p_txtVarianRasa_TextChanged(arr[2]);
            break;
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
            p_TxtParent_TextChanged(arr[2]);
            break;
        case "txtGroup":
            //$("#txtCategory").val(arr[1]);
            p_TxtGroup_TextChanged(arr[2]);
            break;
        case "txtRMCode":
            //$("#txtCategory").val(arr[1]);
            p_TxtRMCode_TextChanged(arr[1], arr[2], arr[3], arr[4], arr[5]);
            break;
        case "txtPrimaryUom":
            //$("#txtCategory").val(arr[1]);
            p_txtPrimaryUom_TextChanged(arr[1]);
            break;
        case "COPYFROM_MST":
            $("#modalCopyFrom").modal("show");
            $("#intNoCopy").val(arr[1]);
            $("#txtDocumentNoCopy").val(arr[2]);
            $("#txtBrandCopy").val(arr[3]);
            $("#txtVarianRasaCopy").val(arr[4]);
            $("#txtStatusCopy").val(arr[5]);
            break;
    }
    clsGlobal.closeLOV();
}
function p_initiateData() {
    debugger;
    clsGlobal.showLoading();
    var a = $("#txtMatrixStructureId").val();
    $.ajax({
        type: "POST",
        url: "/MatrixStructure/InitiateData",
        data: {
            id: $("#txtMatrixStructureId").val(),
            __RequestVerificationToken: $('#FormMatrixStructure input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    debugger;
                    $("#txtHiddenObject").val(JSON.stringify(retDat.objData));

                    p_DataToUI(retDat.objData);

                    if (retDat.objData.intMatrixStructureId === 0) {
                    } else {
                        hiddenBtn()
                    }

                    tableMatrix.clear().draw(false);

                    for (var i = 0; i < retDat.objData.listMMatrixStructureDetail.length; i++) {
                        var d = retDat.objData.listMMatrixStructureDetail[i];
                        counter++;
                        tableMatrix.row.add([
                            counter,
                            //`<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            //    <div class="input-group">
                            //        <div class="input-group-btn">
                            //            <button type="button" class="btn btn-danger" onclick="p_btnLOVBRANDClick(this)">
                            //                <i class="fa fa-search"></i>
                            //            </button>
                            //        </div>
                            //        <input type="text" class="form-control" name="txtBrand" value="${d.txtBrand || ''}" readonly>
                            //         <input type="hidden" name="intMatrixStructureDetailID" value="${d.intMatrixStructureDetailId || ''}">
                            //    </div>
                            //</div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                               <input type="text" class="form-control" name="txtBrand" value="${d.txtBrand || ''}" readonly>
                               <input type="hidden" name="intMatrixStructureDetailID" value="${d.intMatrixStructureDetailId || ''}">
                            </div>`,
                            //`<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            //    <div class="input-group">
                            //        <div class="input-group-btn">
                            //            <button type="button" class="btn btn-danger" onclick="p_btnLOVVARIANRASAClick(this)">
                            //                <i class="fa fa-search"></i>
                            //            </button>
                            //        </div>
                            //        <input type="text" class="form-control" name="txtVarianRasa" value="${d.txtVarianRasa || ''}" readonly>
                            //    </div>
                            //</div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                               <input type="text" class="form-control" name="txtVarianRasa" value="${d.txtVarianRasa || ''}" readonly>
                            </div>`,
                            //// 3. Category
                            //`<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            //    <div class="input-group">
                            //        <div class="input-group-btn">
                            //            <button type="button" class="btn btn-danger" onclick="p_btnLOVCATEGORYClick(this)">
                            //                <i class="fa fa-search"></i>
                            //            </button>
                            //        </div>
                            //        <input type="text" class="form-control" name="txtCategory" value="${d.txtCategory || ''}" readonly>
                            //    </div>
                            //</div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                               <input type="text" class="form-control" name="txtCategory" value="${d.txtCategory || ''}" readonly>
                            </div>`,
                            //// 4. Grand Parent
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
                            //// 5. Parent
                            //`<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            //    <div class="input-group">
                            //        <div class="input-group-btn">
                            //            <button type="button" class="btn btn-danger" onclick="p_btnLOVPARENTClick(this)">
                            //                <i class="fa fa-search"></i>
                            //            </button>
                            //        </div>
                            //        <input type="text" class="form-control" name="txtParent" value="${d.txtParent || ''}" readonly>
                            //    </div>
                            //</div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtParent" value="${d.txtParent || ''}" readonly>
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
                                <textarea class="form-control" name="txtRMDescription" readonly rows="3">${d.txtRmdesc || ''}</textarea>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control decimal-input" name="decFormulaPercentage1" placeholder="0.00" value="${d.decFormulaPercentage1 || ''}" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control integer-input" name="intMatrixRule1" placeholder="0" value="${d.intMatrixRule1 || ''}" oninput="formatInteger(this)">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtNote1"  rows="3">${d.txtNote1 || ''}</textarea>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control decimal-input" name="decFormulaPercentage2" placeholder="0.00" value="${d.decFormulaPercentage2 || ''}" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control integer-input" name="intMatrixRule2" placeholder="0" value="${d.intMatrixRule2 || ''}" oninput="formatInteger(this)">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtNote2" rows="3">${d.txtNote2 || ''}</textarea>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control decimal-input" name="decFormulaPercentage3" placeholder="0.00" value="${d.decFormulaPercentage3 || ''}" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control integer-input" name="intMatrixRule3" placeholder="0" value="${d.intMatrixRule3 || ''}" oninput="formatInteger(this)">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtNote3" rows="3">${d.txtNote3 || ''}</textarea>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control decimal-input" name="decFormulaPercentage4" placeholder="0.00" value="${d.decFormulaPercentage4 || ''}" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control integer-input" name="intMatrixRule4" placeholder="0" value="${d.intMatrixRule4 || ''}" oninput="formatInteger(this)">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtNote4" rows="3">${d.txtNote4 || ''}</textarea>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control decimal-input" name="decFormulaPercentage5" placeholder="0.00" value="${d.decFormulaPercentage5 || ''}" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control integer-input" name="intMatrixRule5" placeholder="0" value="${d.intMatrixRule5 || ''}" oninput="formatInteger(this)">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtNote5" rows="3">${d.txtNote5 || ''}</textarea>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control decimal-input" name="decFormulaPercentage6" placeholder="0.00" value="${d.decFormulaPercentage6 || ''}" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control integer-input" name="intMatrixRule6" placeholder="0" value="${d.intMatrixRule6 || ''}" oninput="formatInteger(this)">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtNote6" rows="3">${d.txtNote6 || ''}</textarea>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control decimal-input" name="decFormulaPercentage7" placeholder="0.00" value="${d.decFormulaPercentage7 || ''}" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control integer-input" name="intMatrixRule7" placeholder="0" value="${d.intMatrixRule7 || ''}" oninput="formatInteger(this)">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtNote7" rows="3">${d.txtNote7 || ''}</textarea>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control decimal-input" name="decFormulaPercentage8" placeholder="0.00" value="${d.decFormulaPercentage8 || ''}" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control integer-input" name="intMatrixRule8" placeholder="0" value="${d.intMatrixRule8 || ''}" oninput="formatInteger(this)">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtNote8" rows="3">${d.txtNote8 || ''}</textarea>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control decimal-input" name="decFormulaPercentage9" placeholder="0.00" value="${d.decFormulaPercentage9 || ''}" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control integer-input" name="intMatrixRule9" placeholder="0" value="${d.intMatrixRule9 || ''}" oninput="formatInteger(this)">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtNote9" rows="3">${d.txtNote9 || ''}</textarea>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control decimal-input" name="decFormulaPercentage10" placeholder="0.00" value="${d.decFormulaPercentage10 || ''}" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control integer-input" name="intMatrixRule10" placeholder="0" value="${d.intMatrixRule10 || ''}" oninput="formatInteger(this)">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtNote10" rows="3">${d.txtNote10 || ''}</textarea>
                            </div>`,
                            // 1. Delete button
                            `<div style="text-align:center">
                                <i class="fas fa-trash fa-2x trash-icon" onclick="deleteRowVisualdata(this)"></i>
                               
                            </div>`                           
                        ]).draw(false);
                    }
                    if (retDat.objData.listMMatrixStructureDetail.length > 0) {
                        $('#btnAdd').prop('disabled', false);
                    }
                    p_updateRangeFormula();

                    if (retDat.objData.txtStatus.toUpperCase() == "APPROVED") {
                        disableAllForApproval();
                        $('#ddlToStatus').prop('disabled', false);
                        $('#txtNote').prop('disabled', false);
                    }
                    if (retDat.objData.txtStatus.toUpperCase() == "OBSOLETE") {
                        disableAllForApproval();
                        $('#btnChangeStatus').addClass('d-none');
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
    $("#id").val(clsGlobal.parseToInteger(objData.intMatrixStructureId));
    $("#txtMatrixStructureId").val(clsGlobal.parseToString(objData.txtMatrixStructureId));
    $("#txtBrandH").val(clsGlobal.parseToString(objData.txtBrand));
    $("#txtVarianRasaH").val(clsGlobal.parseToString(objData.txtVarianRasa));
    $("#txtStatus").val(clsGlobal.parseToString(objData.txtStatus));
    $("#txtDocNo").val(clsGlobal.parseToString(objData.txtMatrixStructureNo));
    $('#bitActive').prop('checked', objData.bitActive);
    if (objData.txtUpdatedBy == "" || objData.txtUpdatedBy == null) {
        $('#txtCreatedBy').val(objData.txtCreatedBy);
        $('#dtmCreatedDate').val(clsGlobal.parseJSONdateNew(objData.dtmCreatedDate));
    } else {
        $('#txtCreatedBy').val(objData.txtCreatedBy);
        $('#dtmCreatedDate').val(clsGlobal.parseJSONdateNew(objData.dtmUpdatedDate));
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

    tableMatrix.clear().draw(false);

    $("#txtHiddenObject").val(JSON.stringify(objData));


}

function p_UIToData() {
    debugger;

    var jsonObj = [];
    var htmlJSON = $("#txtHiddenObject").val();
    jsonData = JSON.parse(htmlJSON);
    jsonData.intMatrixStructureId = clsGlobal.parseToInteger($("#id").val());
    jsonData.txtMatrixStructureId = $("#txtMatrixStructureId").val();
    jsonData.txtBrand = $("#txtBrandH").val();
    jsonData.txtVarianRasa = $("#txtVarianRasaH").val();
    jsonData.txtStatus = $("#txtStatus").val();
    jsonData.txtDocNo = $("#txtDocNo").val();
    jsonData.bitActive = clsGlobal.parseToBoolean($("#bitActive").prop("checked"));

    jsonData.txtCreatedBy = $("#txtCreatedBy").val();
    jsonData.dtmCreatedDate = $("#dtmCreatedDate").val();
    jsonData.txtUpdatedBy = $("#txtUpdatedBy").val();
    jsonData.dtmUpdatedDate = $("#dtmUpdatedDate").val();

    jsonData.listMMatrixStructureDetail = $("#txtHiddenObjectList").val();

    $("#txtHiddenObject").val(JSON.stringify(jsonData));

    var ho = $("#txtHiddenObject").val(); // sekarang seharusnya berisi MItemMappingList
    var dt = $("#txtHiddenObjectList").val();
}

function p_UIToDataList() {
    debugger;

    var jsonArray = "[";
    var validRowCount = 0;

    // Ambil instance DataTable
    var table = $("#tableMatrix").DataTable();

    // Loop semua row (bukan cuma yang kelihatan di layar)
    table.rows().every(function () {
        var $row = $(this.node());

        // Abaikan baris placeholder "No data available"
        if ($row.hasClass("dataTables_empty") || $row.text().trim() === "No data available in table") {
            return;
        }

        // Ambil nilai dari setiap kolom
        let idVal = $row.find('input[name="intMatrixStructureDetailID"]').val();
        let intMatrixStructureDetailID = '"intMatrixStructureDetailID" : ' + (idVal ? `"${idVal}"` : 0);
        let txtBrand = '"txtBrand" : "' + ($row.find('input[name="txtBrand"]').val() || "") + '"';
        let txtVarianRasa = '"txtVarianRasa" : "' + ($row.find('input[name="txtVarianRasa"]').val() || "") + '"';
        let txtCategory = '"txtCategory" : "' + ($row.find('input[name="txtCategory"]').val() || "") + '"';
        let txtGrandParent = '"txtGrandParent" : "' + ($row.find('input[name="txtGrandParent"]').val() || "") + '"';
        let txtParent = '"txtParent" : "' + ($row.find('input[name="txtParent"]').val() || "") + '"';
        let txtRMCode = '"txtRMCode" : "' + ($row.find('input[name="txtRMCode"]').val() || "") + '"';
        let txtRMDescription = '"txtRMDescription" : "' + ($row.find('textarea[name="txtRMDescription"]').val() || "") + '"';

        // -------------------------
        // Formula 1 - 10
        // -------------------------
        let formulaArr = [];
        for (let i = 1; i <= 10; i++) {
            let rawDec = $row.find(`input[name="decFormulaPercentage${i}"]`).val() || "0";
            rawDec = rawDec.replace(/,/g, '');
            let dec = `"decFormulaPercentage${i}" : "${rawDec}"`;

            let rawInt = $row.find(`input[name="intMatrixRule${i}"]`).val() || "0";
            let intRule = `"intMatrixRule${i}" : "${rawInt}"`;

            let txtNote = `"txtNote${i}" : "${$row.find(`textarea[name="txtNote${i}"]`).val() || ""}"`;

            formulaArr.push(dec, intRule, txtNote);
        }

        let jsonObj = "{" +
            intMatrixStructureDetailID + "," +
            txtBrand + "," +
            txtVarianRasa + "," +
            txtCategory + "," +
            txtGrandParent + "," +
            txtParent + "," +
            txtRMCode + "," +
            txtRMDescription + "," +
            formulaArr.join(",") +
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

//    const $rows = $("#tableMatrix tbody tr");

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
//        let idVal = $row.find('input[name="intMatrixStructureDetailID"]').val();
//        let intMatrixStructureDetailID = '"intMatrixStructureDetailID" : ' + (idVal ? `"${idVal}"` : 0);
//        let txtBrand = '"txtBrand" : "' + ($row.find('input[name="txtBrand"]').val() || "") + '"';
//        let txtVarianRasa = '"txtVarianRasa" : "' + ($row.find('input[name="txtVarianRasa"]').val() || "") + '"';
//        let txtCategory = '"txtCategory" : "' + ($row.find('input[name="txtCategory"]').val() || "") + '"';
//        let txtGrandParent = '"txtGrandParent" : "' + ($row.find('input[name="txtGrandParent"]').val() || "") + '"';
//        let txtParent = '"txtParent" : "' + ($row.find('input[name="txtParent"]').val() || "") + '"';
//        let txtRMCode = '"txtRMCode" : "' + ($row.find('input[name="txtRMCode"]').val() || "") + '"';
//        let txtRMDescription = '"txtRMDescription" : "' + ($row.find('textarea[name="txtRMDescription"]').val() || "") + '"';

//        let rawdecFormulaPercentage1 = $row.find('input[name="decFormulaPercentage1"]').val() || "0";
//        rawdecFormulaPercentage1 = rawdecFormulaPercentage1.replace(/,/g, '');
//        let decFormulaPercentage1 = '"decFormulaPercentage1" : "' + rawdecFormulaPercentage1 + '"';

//        let rawintMatrixRule1 = $row.find('input[name="intMatrixRule1"]').val() || "0";
//        let intMatrixRule1 = '"intMatrixRule1" : "' + rawintMatrixRule1 + '"';

//        let txtNote1 = '"txtNote1" : "' + ($row.find('textarea[name="txtNote1"]').val() || "") + '"';

//        let rawdecFormulaPercentage2 = $row.find('input[name="decFormulaPercentage2"]').val() || "0";
//        rawdecFormulaPercentage2 = rawdecFormulaPercentage2.replace(/,/g, '');
//        let decFormulaPercentage2 = '"decFormulaPercentage2" : "' + rawdecFormulaPercentage2 + '"';

//        let rawintMatrixRule2 = $row.find('input[name="intMatrixRule2"]').val() || "0";
//        let intMatrixRule2 = '"intMatrixRule2" : "' + rawintMatrixRule2 + '"';

//        let txtNote2 = '"txtNote2" : "' + ($row.find('textarea[name="txtNote2"]').val() || "") + '"';

//        let rawdecFormulaPercentage3 = $row.find('input[name="decFormulaPercentage3"]').val() || "0";
//        rawdecFormulaPercentage3 = rawdecFormulaPercentage3.replace(/,/g, '');
//        let decFormulaPercentage3 = '"decFormulaPercentage3" : "' + rawdecFormulaPercentage3 + '"';

//        let rawintMatrixRule3 = $row.find('input[name="intMatrixRule3"]').val() || "0";
//        let intMatrixRule3 = '"intMatrixRule3" : "' + rawintMatrixRule3 + '"';

//        let txtNote3 = '"txtNote3" : "' + ($row.find('textarea[name="txtNote3"]').val() || "") + '"';

//        let rawdecFormulaPercentage4 = $row.find('input[name="decFormulaPercentage4"]').val() || "0";
//        rawdecFormulaPercentage4 = rawdecFormulaPercentage4.replace(/,/g, '');
//        let decFormulaPercentage4 = '"decFormulaPercentage4" : "' + rawdecFormulaPercentage4 + '"';

//        let rawintMatrixRule4 = $row.find('input[name="intMatrixRule4"]').val() || "0";
//        let intMatrixRule4 = '"intMatrixRule4" : "' + rawintMatrixRule4 + '"';

//        let txtNote4 = '"txtNote4" : "' + ($row.find('textarea[name="txtNote4"]').val() || "") + '"';

//        let rawdecFormulaPercentage5 = $row.find('input[name="decFormulaPercentage5"]').val() || "0";
//        rawdecFormulaPercentage5 = rawdecFormulaPercentage5.replace(/,/g, '');
//        let decFormulaPercentage5 = '"decFormulaPercentage5" : "' + rawdecFormulaPercentage5 + '"';

//        let rawintMatrixRule5 = $row.find('input[name="intMatrixRule5"]').val() || "0";
//        let intMatrixRule5 = '"intMatrixRule5" : "' + rawintMatrixRule5 + '"';

//        let txtNote5 = '"txtNote5" : "' + ($row.find('textarea[name="txtNote5"]').val() || "") + '"';

//        let rawdecFormulaPercentage6 = $row.find('input[name="decFormulaPercentage6"]').val() || "0";
//        rawdecFormulaPercentage6 = rawdecFormulaPercentage6.replace(/,/g, '');
//        let decFormulaPercentage6 = '"decFormulaPercentage6" : "' + rawdecFormulaPercentage6 + '"';

//        let rawintMatrixRule6 = $row.find('input[name="intMatrixRule6"]').val() || "0";
//        let intMatrixRule6 = '"intMatrixRule6" : "' + rawintMatrixRule6 + '"';

//        let txtNote6 = '"txtNote6" : "' + ($row.find('textarea[name="txtNote6"]').val() || "") + '"';

//        let rawdecFormulaPercentage7 = $row.find('input[name="decFormulaPercentage7"]').val() || "0";
//        rawdecFormulaPercentage7 = rawdecFormulaPercentage7.replace(/,/g, '');
//        let decFormulaPercentage7 = '"decFormulaPercentage7" : "' + rawdecFormulaPercentage7 + '"';

//        let rawintMatrixRule7 = $row.find('input[name="intMatrixRule7"]').val() || "0";
//        let intMatrixRule7 = '"intMatrixRule7" : "' + rawintMatrixRule7 + '"';

//        let txtNote7 = '"txtNote7" : "' + ($row.find('textarea[name="txtNote7"]').val() || "") + '"';

//        let rawdecFormulaPercentage8 = $row.find('input[name="decFormulaPercentage8"]').val() || "0";
//        rawdecFormulaPercentage8 = rawdecFormulaPercentage8.replace(/,/g, '');
//        let decFormulaPercentage8 = '"decFormulaPercentage8" : "' + rawdecFormulaPercentage8 + '"';

//        let rawintMatrixRule8 = $row.find('input[name="intMatrixRule8"]').val() || "0";
//        let intMatrixRule8 = '"intMatrixRule8" : "' + rawintMatrixRule8 + '"';

//        let txtNote8 = '"txtNote8" : "' + ($row.find('textarea[name="txtNote8"]').val() || "") + '"';

//        let rawdecFormulaPercentage9 = $row.find('input[name="decFormulaPercentage9"]').val() || "0";
//        rawdecFormulaPercentage9 = rawdecFormulaPercentage9.replace(/,/g, '');
//        let decFormulaPercentage9 = '"decFormulaPercentage9" : "' + rawdecFormulaPercentage9 + '"';

//        let rawintMatrixRule9 = $row.find('input[name="intMatrixRule9"]').val() || "0";
//        let intMatrixRule9 = '"intMatrixRule9" : "' + rawintMatrixRule9 + '"';

//        let txtNote9 = '"txtNote9" : "' + ($row.find('textarea[name="txtNote9"]').val() || "") + '"';

//        let rawdecFormulaPercentage10 = $row.find('input[name="decFormulaPercentage10"]').val() || "0";
//        rawdecFormulaPercentage10 = rawdecFormulaPercentage10.replace(/,/g, '');
//        let decFormulaPercentage10 = '"decFormulaPercentage10" : "' + rawdecFormulaPercentage10 + '"';

//        let rawintMatrixRule10 = $row.find('input[name="intMatrixRule10"]').val() || "0";
//        let intMatrixRule10 = '"intMatrixRule10" : "' + rawintMatrixRule10 + '"';

//        let txtNote10 = '"txtNote10" : "' + ($row.find('textarea[name="txtNote10"]').val() || "") + '"';

//        let jsonObj = "{" +
//            intMatrixStructureDetailID + "," +
//            txtBrand + "," +
//            txtVarianRasa + "," +
//            txtCategory + "," +
//            txtGrandParent + "," +
//            txtParent + "," +
//            txtRMCode + "," +
//            txtRMDescription + "," +
//            decFormulaPercentage1 + "," +
//            intMatrixRule1 + "," +
//            txtNote1 + "," +
//            decFormulaPercentage2 + "," +
//            intMatrixRule2 + "," +
//            txtNote2 + "," +
//            decFormulaPercentage3 + "," +
//            intMatrixRule3 + "," +
//            txtNote3 + "," +
//            decFormulaPercentage4 + "," +
//            intMatrixRule4 + "," +
//            txtNote4 + "," +
//            decFormulaPercentage5 + "," +
//            intMatrixRule5 + "," +
//            txtNote5 + "," +
//            decFormulaPercentage6 + "," +
//            intMatrixRule6 + "," +
//            txtNote6 + "," +
//            decFormulaPercentage7 + "," +
//            intMatrixRule7 + "," +
//            txtNote7 + "," +
//            decFormulaPercentage8 + "," +
//            intMatrixRule8 + "," +
//            txtNote8 + "," +
//            decFormulaPercentage9 + "," +
//            intMatrixRule9 + "," +
//            txtNote9 + "," +
//            decFormulaPercentage10 + "," +
//            intMatrixRule10 + "," +
//            txtNote10 + 
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
    const table = $('#tableMatrix').DataTable();
    const dataRows = table.rows().nodes();

    let $firstRow = null;
    if (dataRows.length > 0) {
        $firstRow = $(dataRows[0]);

        const fieldsToCheck = [
            { name: "txtBrand", label: "Brand" },
            { name: "txtVarianRasa", label: "Varian Rasa" },
            { name: "txtCategory", label: "Category" },
            { name: "txtGrandParent", label: "Grand Parent" },
            { name: "txtParent", label: "Parent" },
            { name: "txtRMCode", label: "RM Code" },
            { name: "txtRMDescription", label: "RM Description" },
            //{ name: "decFormulaPercentage1", label: "Formula Percentage 1" },
            //{ name: "intMatrixRule1", label: "Matrix Rule 1" },
            //{ name: "txtNote1", label: "Note 1" },
            //{ name: "decFormulaPercentage2", label: "Formula Percentage 2" },
            //{ name: "intMatrixRule2", label: "Matrix Rule 2" },
            //{ name: "txtNote2", label: "Note 2" },
            //{ name: "decFormulaPercentage3", label: "Formula Percentage 3" },
            //{ name: "intMatrixRule3", label: "Matrix Rule 3" },
            //{ name: "txtNote3", label: "Note 3" },
            //{ name: "decFormulaPercentage4", label: "Formula Percentage 4" },
            //{ name: "intMatrixRule4", label: "Matrix Rule 4" },
            //{ name: "txtNote4", label: "Note 4" },
            //{ name: "decFormulaPercentage5", label: "Formula Percentage 5" },
            //{ name: "intMatrixRule5", label: "Matrix Rule 5" },
            //{ name: "txtNote5", label: "Note 5" },
            //{ name: "decFormulaPercentage6", label: "Formula Percentage 6" },
            //{ name: "intMatrixRule6", label: "Matrix Rule 6" },
            //{ name: "txtNote6", label: "Note 6" },
            //{ name: "decFormulaPercentage7", label: "Formula Percentage 7" },
            //{ name: "intMatrixRule7", label: "Matrix Rule 7" },
            //{ name: "txtNote7", label: "Note 7" },
            //{ name: "decFormulaPercentage8", label: "Formula Percentage 8" },
            //{ name: "intMatrixRule8", label: "Matrix Rule 8" },
            //{ name: "txtNote8", label: "Note 8" },
            //{ name: "decFormulaPercentage9", label: "Formula Percentage 9" },
            //{ name: "intMatrixRule9", label: "Matrix Rule 9" },
            //{ name: "txtNote9", label: "Note 9" },
            //{ name: "decFormulaPercentage10", label: "Formula Percentage 10" },
            //{ name: "intMatrixRule10", label: "Matrix Rule 10" },
            //{ name: "txtNote10", label: "Note 10" }
        ];

        // Cek field mana saja yang kosong
        const emptyFields = fieldsToCheck.filter(field => {
            const element = $firstRow.find(`input[name="${field.name}"], textarea[name="${field.name}"]`);
            return element.length && element.val().trim() === "";
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
    let defaultPlant = $firstRow?.find('input[name="txtBrand"]').val() || "";
    let defaultVarian = $firstRow?.find('input[name="txtVarianRasa"]').val() || "";

    counter++;
    tableMatrix.row.add([
        counter,
        //`<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
        //                        <div class="input-group">
        //                            <div class="input-group-btn">
        //                                <button type="button" class="btn btn-danger" onclick="p_btnLOVBRANDClick(this)">
        //                                    <i class="fa fa-search"></i>
        //                                </button>
        //                            </div>
        //                            <input type="text" class="form-control" name="txtBrand" value="${defaultPlant}" readonly>
        //                            <input type="hidden" name="intMatrixStructureDetailID">
        //                        </div>
        //                    </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtBrand" value="${defaultPlant}" readonly>
                                <input type="hidden" name="intMatrixStructureDetailID">
                            </div>`,
        //`<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
        //                        <div class="input-group">
        //                            <div class="input-group-btn">
        //                                <button type="button" class="btn btn-danger" onclick="p_btnLOVVARIANRASAClick(this)">
        //                                    <i class="fa fa-search"></i>
        //                                </button>
        //                            </div>
        //                            <input type="text" class="form-control" name="txtVarianRasa" value="${defaultVarian}" readonly>
        //                        </div>
        //                    </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtVarianRasa" value="${defaultVarian}" readonly>
                            </div>`,
        //// 3. Category
        //`<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
        //                        <div class="input-group">
        //                            <div class="input-group-btn">
        //                                <button type="button" class="btn btn-danger" onclick="p_btnLOVCATEGORYClick(this)">
        //                                    <i class="fa fa-search"></i>
        //                                </button>
        //                            </div>
        //                            <input type="text" class="form-control" name="txtCategory" readonly>
        //                        </div>
        //                    </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtCategory" readonly>
                            </div>`,
        //// 4. Grand Parent
        //`<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
        //                        <div class="input-group">
        //                            <div class="input-group-btn">
        //                                <button type="button" class="btn btn-danger" onclick="p_btnLOVGRANDPARENTClick(this)">
        //                                    <i class="fa fa-search"></i>
        //                                </button>
        //                            </div>
        //                            <input type="text" class="form-control" name="txtGrandParent" readonly>
        //                        </div>
        //                    </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtGrandParent" readonly>
                            </div>`,
        //// 5. Parent
        //`<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
        //                        <div class="input-group">
        //                            <div class="input-group-btn">
        //                                <button type="button" class="btn btn-danger" onclick="p_btnLOVPARENTClick(this)">
        //                                    <i class="fa fa-search"></i>
        //                                </button>
        //                            </div>
        //                            <input type="text" class="form-control" name="txtParent" readonly>
        //                        </div>
        //                    </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtParent" readonly>
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
                                <textarea class="form-control" name="txtRMDescription" readonly rows="3"></textarea>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control decimal-input" name="decFormulaPercentage1" placeholder="0.00" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                                </div>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control integer-input" name="intMatrixRule1" placeholder="0" oninput="formatInteger(this)">
                                </div>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtNote1" rows="3"></textarea>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control decimal-input" name="decFormulaPercentage2" placeholder="0.00" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                                </div>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control integer-input" name="intMatrixRule2" placeholder="0" oninput="formatInteger(this)">
                                </div>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtNote2" rows="3"></textarea>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control decimal-input" name="decFormulaPercentage3" placeholder="0.00" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                                </div>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control integer-input" name="intMatrixRule3" placeholder="0" oninput="formatInteger(this)">
                                </div>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtNote3" rows="3"></textarea>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control decimal-input" name="decFormulaPercentage4" placeholder="0.00" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                                </div>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control integer-input" name="intMatrixRule4" placeholder="0" oninput="formatInteger(this)">
                                </div>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtNote4" rows="3"></textarea>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control decimal-input" name="decFormulaPercentage5" placeholder="0.00" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                                </div>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control integer-input" name="intMatrixRule5" placeholder="0" oninput="formatInteger(this)">
                                </div>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtNote5" rows="3"></textarea>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control decimal-input" name="decFormulaPercentage6" placeholder="0.00" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                                </div>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control integer-input" name="intMatrixRule6" placeholder="0" oninput="formatInteger(this)">
                                </div>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtNote6" rows="3"></textarea>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control decimal-input" name="decFormulaPercentage7" placeholder="0.00" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                                </div>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control integer-input" name="intMatrixRule7" placeholder="0" oninput="formatInteger(this)">
                                </div>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtNote7" rows="3"></textarea>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control decimal-input" name="decFormulaPercentage8" placeholder="0.00" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                                </div>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control integer-input" name="intMatrixRule8" placeholder="0" oninput="formatInteger(this)">
                                </div>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtNote8" rows="3"></textarea>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control decimal-input" name="decFormulaPercentage9" placeholder="0.00" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                                </div>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control integer-input" name="intMatrixRule9" placeholder="0" oninput="formatInteger(this)">
                                </div>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtNote9" rows="3"></textarea>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control decimal-input" name="decFormulaPercentage10" placeholder="0.00" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                                </div>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control integer-input" name="intMatrixRule10" placeholder="0" oninput="formatInteger(this)">
                                </div>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtNote10" rows="3"></textarea>
                            </div>`,
        // 1. Delete button
        `<div style="text-align:center">
                                <i class="fas fa-trash fa-2x trash-icon" onclick="deleteRowVisualdata(this)"></i>                                
                            </div>`      
    ]).draw(false);
}

function deleteRowVisualdata(data) {
    debugger;
    clsGlobal.getConfirmation("Delete this data?",
        function (result) {
            if (result == true) {
                debugger;
                tableMatrix.rows($(data).parent().parent().parent()).remove().draw();
                p_updateRangeFormula();
            } else {
                return false;
            }
        });
};

function p_TxtBrand_TextChanged(BRAND) {
    debugger;

    if (currentBrandInput) {
        currentBrandInput.val(BRAND);
        currentBrandInput = null; // reset setelah pakai
    }
}
function p_txtVarianRasa_TextChanged(VARIANRASA) {
    debugger;

    if (currentVarianRasaInput) {
        currentVarianRasaInput.val(VARIANRASA);
        currentVarianRasaInput = null; // reset setelah pakai
    }
}
function p_TxtCategory_TextChanged(CATEGORY) {
    debugger;


    if (currentCategoryInput) {
        currentCategoryInput.val(CATEGORY);
        currentCategoryInput = null; // reset setelah pakai
    }
}
function p_TxtGrandParent_TextChanged(GRANDPARENT) {
    debugger;

    if (currentGrandParentInput) {
        currentGrandParentInput.val(GRANDPARENT);
        currentGrandParentInput = null; // reset setelah pakai
    }
}

function p_TxtParent_TextChanged(PARENT) {
    debugger;

    if (currentParentInput) {
        currentParentInput.val(PARENT);
        currentParentInput = null; // reset setelah pakai
    }
}

function p_TxtGroup_TextChanged(GROUP) {
    debugger;

    if (currentGroupInput) {
        currentGroupInput.val(GROUP);
        currentGroupInput = null; // reset setelah pakai
    }
}

function p_TxtRMCode_TextChanged(RMCODE, RMDESC = '', CATEGORY, GRANDPARENT, PARENT) {
    debugger;

    if (currentRMCodeInput) {
        currentRMCodeInput.val(RMCODE);
        currentRMCodeInput = null; // reset setelah pakai
    }

    if (currentRMDescription) {
        currentRMDescription.val(RMDESC);
        currentRMDescription = null;
    }

    //if (currentPrimaryUOM) {
    //    currentPrimaryUOM.val(UOM);
    //    currentPrimaryUOM = null;
    //}

    if (currentCategoryInput) {
        currentCategoryInput.val(CATEGORY);
        currentCategoryInput = null;
    }
    if (currentGrandParentInput) {
        currentGrandParentInput.val(GRANDPARENT);
        currentGrandParentInput = null;
    }
    if (currentParentInput) {
        currentParentInput.val(PARENT);
        currentParentInput = null;
    }

    if (currentRow) {
        let brand = currentRow.find('input[name="txtBrand"]').val();
        let varian = currentRow.find('input[name="txtVarianRasa"]').val();

        p_GETMATRIXRULE(RMCODE, brand, varian, currentMatrixRule);
        currentRow = null; // reset
    }
}

function p_txtPrimaryUom_TextChanged(UOM) {
    debugger;

    if (currentUomInput) {
        currentUomInput.val(UOM);
        currentUomInput = null; // reset setelah pakai
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
function p_ExportData() {
    clsGlobal.getConfirmation("Export Data?", function (result) {
        if (result === true) {
            debugger;

            $.ajax({
                type: "POST",
                url: "/MatrixStructure/NPOIExportToExcelData",
                data: {
                    data: $("#txtHiddenObject").val(),
                    id: $("#id").val(),
                    __RequestVerificationToken: $('#FormMatrixStructure input[name=__RequestVerificationToken]').val()

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

var ProjectDetail = {
    DownloadTemplate: function () {
        $.ajax({
            type: "POST",
            url: "/MatrixStructure/NPOIDowloadTemplate",
            data: {
                data: $("#txtHiddenObject").val(),
                __RequestVerificationToken: $('#FormMatrixStructure input[name=__RequestVerificationToken]').val()

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

    UploadTemplate: function () {
        const formData = new FormData();
        formData.append("__RequestVerificationToken", $('#FormMatrixStructure input[name=__RequestVerificationToken]').val());

        let file = $('#templateUploadNutriFact')[0].files[0];
        if (!file) {
            clsGlobal.swalWarning("Please select a file before upload");
            return;
        }
        formData.append("UploadNutriFact", file);

        $.ajax({
            type: "POST",
            url: "/MatrixStructure/UploadTemplate",
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
                    $("#txtBrandH").val(clsGlobal.parseToString(retDat.objData[0].txtBrand));
                    $("#txtVarianRasaH").val(clsGlobal.parseToString(retDat.objData[0].txtVarianRasa));

                    //p_DataToUI(retDat.objData);
                    // kosongkan & render ulang tableMatrix
                    tableMatrix.clear().draw(false);

                    for (var i = 0; i < retDat.objData.length; i++) {
                        var d = retDat.objData[i];
                        counter++;
                        tableMatrix.row.add([
                            counter,
                        //    // Brand
                        //    `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                        //    <div class="input-group">
                        //        <div class="input-group-btn">
                        //            <button type="button" class="btn btn-danger" onclick="p_btnLOVBRANDClick(this)">
                        //                <i class="fa fa-search"></i>
                        //            </button>
                        //        </div>
                        //        <input type="text" class="form-control" name="txtBrand" value="${d.txtBrand || ''}" readonly>
                        //        <input type="hidden" name="intMatrixStructureDetailID" value="${d.listMMatrixStructureDetail[0].intMatrixStructureDetailId || ''}">
                        //    </div>
                        //</div>`,
                        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtBrand" value="${d.txtBrand || ''}" readonly>
                                <input type="hidden" name="intMatrixStructureDetailID" value="${d.listMMatrixStructureDetail[0].intMatrixStructureDetailId || ''}">
                        </div>`,
                        //    // Varian Rasa
                        //    `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                        //    <div class="input-group">
                        //        <div class="input-group-btn">
                        //            <button type="button" class="btn btn-danger" onclick="p_btnLOVVARIANRASAClick(this)">
                        //                <i class="fa fa-search"></i>
                        //            </button>
                        //        </div>
                        //        <input type="text" class="form-control" name="txtVarianRasa" value="${d.txtVarianRasa || ''}" readonly>
                        //    </div>
                        //</div>`,
                        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <input type="text" class="form-control" name="txtVarianRasa" value="${d.txtVarianRasa || ''}" readonly>
                        </div>`,
                        //    // Category
                        //    `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                        //    <div class="input-group">
                        //        <div class="input-group-btn">
                        //            <button type="button" class="btn btn-danger" onclick="p_btnLOVCATEGORYClick(this)">
                        //                <i class="fa fa-search"></i>
                        //            </button>
                        //        </div>
                        //        <input type="text" class="form-control" name="txtCategory" value="${d.listMMatrixStructureDetail[0].txtCategory || ''}" readonly>
                        //    </div>
                        //</div>`,
                        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <input type="text" class="form-control" name="txtCategory" value="${d.listMMatrixStructureDetail[0].txtCategory || ''}" readonly>
                        </div>`,
                        //    // Grand Parent
                        //    `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                        //    <div class="input-group">
                        //        <div class="input-group-btn">
                        //            <button type="button" class="btn btn-danger" onclick="p_btnLOVGRANDPARENTClick(this)">
                        //                <i class="fa fa-search"></i>
                        //            </button>
                        //        </div>
                        //        <input type="text" class="form-control" name="txtGrandParent" value="${d.listMMatrixStructureDetail[0].txtGrandParent || ''}" readonly>
                        //    </div>
                            //</div>`,
                        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <input type="text" class="form-control" name="txtGrandParent" value="${d.listMMatrixStructureDetail[0].txtGrandParent || ''}" readonly>
                        </div>`,
                        //    // Parent
                        //    `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                        //    <div class="input-group">
                        //        <div class="input-group-btn">
                        //            <button type="button" class="btn btn-danger" onclick="p_btnLOVPARENTClick(this)">
                        //                <i class="fa fa-search"></i>
                        //            </button>
                        //        </div>
                        //        <input type="text" class="form-control" name="txtParent" value="${d.listMMatrixStructureDetail[0].txtParent || ''}" readonly>
                        //    </div>
                            //</div>`,
                        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <input type="text" class="form-control" name="txtParent" value="${d.listMMatrixStructureDetail[0].txtParent || ''}" readonly>
                        </div>`,
                            // RM Code
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <div class="input-group">
                                <div class="input-group-btn">
                                    <button type="button" class="btn btn-danger" onclick="p_btnLOVRMCODEClick(this)">
                                        <i class="fa fa-search"></i>
                                    </button>
                                </div>
                                <input type="text" class="form-control" name="txtRMCode" value="${d.listMMatrixStructureDetail[0].txtRmcode || ''}" readonly>
                            </div>
                        </div>`,
                            // RM Description
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <textarea class="form-control" name="txtRMDescription" readonly rows="3">${d.listMMatrixStructureDetail[0].txtRmdesc || ''}</textarea>
                        </div>`,
                            // Major 1 % Formula
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <div class="input-group">
                                <input type="text" class="form-control decimal-input" name="decFormulaPercentage1" placeholder="0.00" value="${d.listMMatrixStructureDetail[0].decFormulaPercentage1 || ''}" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                            </div>
                        </div>`,
                            // Major 1 Matrix Rule
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <div class="input-group">
                                <input type="text" class="form-control integer-input" name="intMatrixRule1" placeholder="0" value="${d.listMMatrixStructureDetail[0].intMatrixRule1 || ''}" oninput="formatInteger(this)">
                            </div>
                        </div>`,
                            // Major 1 Note
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <textarea class="form-control" name="txtNote1" rows="3">${d.listMMatrixStructureDetail[0].txtNote1 || ''}</textarea>
                        </div>`,
                            // Major 2 % Formula
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <div class="input-group">
                                <input type="text" class="form-control decimal-input" name="decFormulaPercentage2" placeholder="0.00" value="${d.listMMatrixStructureDetail[0].decFormulaPercentage2 || ''}" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                            </div>
                        </div>`,
                            // Major 2 Matrix Rule
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <div class="input-group">
                                <input type="text" class="form-control integer-input" name="intMatrixRule2" placeholder="0" value="${d.listMMatrixStructureDetail[0].intMatrixRule2 || ''}" oninput="formatInteger(this)">
                            </div>
                        </div>`,
                            // Major 2 Note
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <textarea class="form-control" name="txtNote2" rows="3">${d.listMMatrixStructureDetail[0].txtNote2 || ''}</textarea>
                        </div>`,
                            // Major 3 % Formula
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <div class="input-group">
                                <input type="text" class="form-control decimal-input" name="decFormulaPercentage3" placeholder="0.00" value="${d.listMMatrixStructureDetail[0].decFormulaPercentage3 || ''}" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                            </div>
                        </div>`,
                            // Major 3 Matrix Rule
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <div class="input-group">
                                <input type="text" class="form-control integer-input" name="intMatrixRule3" placeholder="0" value="${d.listMMatrixStructureDetail[0].intMatrixRule3 || ''}" oninput="formatInteger(this)">
                            </div>
                        </div>`,
                            // Major 3 Note
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <textarea class="form-control" name="txtNote3" rows="3">${d.listMMatrixStructureDetail[0].txtNote3 || ''}</textarea>
                        </div>`,
                            // Major 4 % Formula
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <div class="input-group">
                                <input type="text" class="form-control decimal-input" name="decFormulaPercentage4" placeholder="0.00" value="${d.listMMatrixStructureDetail[0].decFormulaPercentage4 || ''}" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                            </div>
                        </div>`,
                            // Major 4 Matrix Rule
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <div class="input-group">
                                <input type="text" class="form-control integer-input" name="intMatrixRule4" placeholder="0" value="${d.listMMatrixStructureDetail[0].intMatrixRule4 || ''}" oninput="formatInteger(this)">
                            </div>
                        </div>`,
                            // Major 4 Note
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <textarea class="form-control" name="txtNote4" rows="3">${d.listMMatrixStructureDetail[0].txtNote4 || ''}</textarea>
                        </div>`,
                            // Major 5 % Formula
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <div class="input-group">
                                <input type="text" class="form-control decimal-input" name="decFormulaPercentage5" placeholder="0.00" value="${d.listMMatrixStructureDetail[0].decFormulaPercentage5 || ''}" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                            </div>
                        </div>`,
                            // Major 5 Matrix Rule
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <div class="input-group">
                                <input type="text" class="form-control integer-input" name="intMatrixRule5" placeholder="0" value="${d.listMMatrixStructureDetail[0].intMatrixRule5 || ''}" oninput="formatInteger(this)">
                            </div>
                        </div>`,
                            // Major 5 Note
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <textarea class="form-control" name="txtNote5" rows="3">${d.listMMatrixStructureDetail[0].txtNote5 || ''}</textarea>
                        </div>`,
                            // Major 6 % Formula
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <div class="input-group">
                                <input type="text" class="form-control decimal-input" name="decFormulaPercentage6" placeholder="0.00" value="${d.listMMatrixStructureDetail[0].decFormulaPercentage6 || ''}" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                            </div>
                        </div>`,
                            // Major 6 Matrix Rule
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <div class="input-group">
                                <input type="text" class="form-control integer-input" name="intMatrixRule6" placeholder="0" value="${d.listMMatrixStructureDetail[0].intMatrixRule6 || ''}" oninput="formatInteger(this)">
                            </div>
                        </div>`,
                            // Major 6 Note
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <textarea class="form-control" name="txtNote6" rows="3">${d.listMMatrixStructureDetail[0].txtNote6 || ''}</textarea>
                        </div>`,
                            // Major 7 % Formula
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <div class="input-group">
                                <input type="text" class="form-control decimal-input" name="decFormulaPercentage7" placeholder="0.00" value="${d.listMMatrixStructureDetail[0].decFormulaPercentage7 || ''}" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                            </div>
                        </div>`,
                            // Major 7 Matrix Rule
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <div class="input-group">
                                <input type="text" class="form-control integer-input" name="intMatrixRule7" placeholder="0" value="${d.listMMatrixStructureDetail[0].intMatrixRule7 || ''}" oninput="formatInteger(this)">
                            </div>
                        </div>`,
                            // Major 7 Note
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <textarea class="form-control" name="txtNote7" rows="3">${d.listMMatrixStructureDetail[0].txtNote7 || ''}</textarea>
                        </div>`,
                            // Major 8 % Formula
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <div class="input-group">
                                <input type="text" class="form-control decimal-input" name="decFormulaPercentage8" placeholder="0.00" value="${d.listMMatrixStructureDetail[0].decFormulaPercentage8 || ''}" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                            </div>
                        </div>`,
                            // Major 8 Matrix Rule
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <div class="input-group">
                                <input type="text" class="form-control integer-input" name="intMatrixRule8" placeholder="0" value="${d.listMMatrixStructureDetail[0].intMatrixRule8 || ''}" oninput="formatInteger(this)">
                            </div>
                        </div>`,
                            // Major 8 Note
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <textarea class="form-control" name="txtNote8" rows="3">${d.listMMatrixStructureDetail[0].txtNote8 || ''}</textarea>
                        </div>`,
                            // Major 9 % Formula
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <div class="input-group">
                                <input type="text" class="form-control decimal-input" name="decFormulaPercentage9" placeholder="0.00" value="${d.listMMatrixStructureDetail[0].decFormulaPercentage9 || ''}" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                            </div>
                        </div>`,
                            // Major 9 Matrix Rule
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <div class="input-group">
                                <input type="text" class="form-control integer-input" name="intMatrixRule9" placeholder="0" value="${d.listMMatrixStructureDetail[0].intMatrixRule9 || ''}" oninput="formatInteger(this)">
                            </div>
                        </div>`,
                            // Major 9 Note
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <textarea class="form-control" name="txtNote9" rows="3">${d.listMMatrixStructureDetail[0].txtNote9 || ''}</textarea>
                        </div>`,
                            // Major 10 % Formula
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <div class="input-group">
                                <input type="text" class="form-control decimal-input" name="decFormulaPercentage10" placeholder="0.00" value="${d.listMMatrixStructureDetail[0].decFormulaPercentage10 || ''}" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                            </div>
                        </div>`,
                            // Major 10 Matrix Rule
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <div class="input-group">
                                <input type="text" class="form-control integer-input" name="intMatrixRule10" placeholder="0" value="${d.listMMatrixStructureDetail[0].intMatrixRule10 || ''}" oninput="formatInteger(this)">
                            </div>
                        </div>`,
                            // Major 10 Note
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <textarea class="form-control" name="txtNote10" rows="3">${d.listMMatrixStructureDetail[0].txtNote10 || ''}</textarea>
                        </div>`,
                            // Action
                            `<div style="text-align:center">
                            <i class="fas fa-trash fa-2x trash-icon" onclick="deleteRowVisualdata(this)"></i>                            
                        </div>`
                        ]).draw(false);
                    }
                    $('#btnAdd').prop('disabled', false);
                    p_updateRangeFormula();
                    showSuccessPopup("File berhasil diupload!");

                } else {
                    //    clsGlobal.swalError(retDat.txtMessage);
                    //$("#modalUploadErrorBody").html(retDat.txtMessage || "Terjadi kesalahan saat upload.");
                    //$("#modalUploadError").modal("show");
                    showErrorPopup(retDat.txtMessage || "Terjadi kesalahan saat upload.");
                }
            },
            error: function (xhr) {
                clsGlobal.hideLoading();
                clsGlobal.swalError(xhr.responseText);
            }
        });
    }


    //UploadTemplateNutriFact: function () {
    //    const formData = new FormData();
    //    debugger;
    //    // Token anti-forgery
    //    formData.append("__RequestVerificationToken", $('#FormMatrixStructure input[name=__RequestVerificationToken]').val());

    //    // Ambil file
    //    let file = $('#templateUploadNutriFact')[0].files[0];
    //    if (!file) {
    //        clsGlobal.swalWarning("Please select a file before upload");
    //        return;
    //    }
    //    formData.append("UploadNutriFact", file);

    //    $.ajax({
    //        type: "POST",
    //        url: "/MatrixStructure/UploadTemplateNutriFact",
    //        data: formData,
    //        processData: false,
    //        contentType: false,
    //        success: function (retDat, status, xhr) {
    //            clsGlobal.hideLoading();
    //            debugger;
    //            if (xhr.responseText.includes("!DOCTYPE html")) {
    //                clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
    //                return;
    //            }
    //            if (retDat.bitSuccess) {
    //                tableMatrix.clear().destroy();
    //                tableMatrix.Render();
    //            } else {
    //                clsGlobal.swalError(retDat.txtMessage);
    //            }
    //        },
    //        error: function (xhr) {
    //            clsGlobal.hideLoading();
    //            clsGlobal.swalError(xhr.responseText);
    //        }
    //    });
    //}


};

function showErrorPopup(message) {
    $("#modalUploadErrorBody").html(message || "Terjadi kesalahan saat upload.");
    $("#modalUploadError").modal("show");
}

function showSuccessPopup(message) {
    $("#modalSuccessBody").html(message || "Upload berhasil.");
    $("#modalSuccess").modal("show");
}

function showSuccessStatusPopup(message) {
    $("#modalSuccessStatusBody").html(message || "Update Status Success.");
    $("#modalSuccessStatus").modal("show");
}

//=======================
// HANDLER
//=======================

function p_btnLOVBRANDClick(btn) {
    try {
        currentBrandInput = $(btn).closest('.input-group').find('input[name="txtBrand"]');
        LOV = clsGlobal.generateLOV("MATRIX_BRAND", "txtBrand");
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
        LOV = clsGlobal.generateLOV("MATRIX_PARENT", "txtParent");
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
        currentRow = $(btn).closest('tr'); // simpan baris saat ini
        //currentRMCodeInput = $(btn).closest('.input-group').find('input[name="txtRMCode"]');
        currentRMCodeInput = group.find('input[name="txtRMCode"]');

        currentRMDescription = group.find('textarea[name="txtRMDescription"]');

        currentPrimaryUOM = group.find('input[name="txtPrimaryUom"]');

        currentMatrixRule = group.find('input[name="intMatrixRule1"]');

        currentCategoryInput = group.find('input[name="txtCategory"]');
        currentGrandParentInput = group.find('input[name="txtGrandParent"]');
        currentParentInput = group.find('input[name="txtParent"]');

        LOV = clsGlobal.generateLOV("MATRIX_RMCODEMRU", "txtRMCode");
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
function p_btnCopy() {
    try {
        LOV = clsGlobal.generateLOV("COPYFROM_MST", "COPYFROM_MST");
    //    $("#modalCopyFrom").modal("show");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_COPYFROMMST() {
    clsGlobal.showLoading();
    var intNoCopy = $("#intNoCopy").val();
    debugger;
    $.ajax({
        type: "POST",
        url: "/MatrixStructure/GetDataCopy",
        data: { intNoCopy: intNoCopy, __RequestVerificationToken: $('#FormMatrixStructure input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    debugger;
                    $("#txtBrandH").val(retDat.objData.txtBrand);
                    $("#txtVarianRasaH").val(retDat.objData.txtVarianRasa);
                    tableMatrix.clear().draw(false);

                    for (var i = 0; i < retDat.objData.listMMatrixStructureDetail.length; i++) {
                        var d = retDat.objData.listMMatrixStructureDetail[i];
                        counter++;
                        tableMatrix.row.add([
                            counter,
                            //`<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            //    <div class="input-group">
                            //        <div class="input-group-btn">
                            //            <button type="button" class="btn btn-danger" onclick="p_btnLOVBRANDClick(this)">
                            //                <i class="fa fa-search"></i>
                            //            </button>
                            //        </div>
                            //        <input type="text" class="form-control" name="txtBrand" value="${d.txtBrand || ''}" readonly>
                            //        <input type="hidden" name="intMatrixStructureDetailID" >
                            //    </div>
                            //</div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtBrand" value="${d.txtBrand || ''}" readonly>
                                <input type="hidden" name="intMatrixStructureDetailID" >
                            </div>`,
                            //`<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            //    <div class="input-group">
                            //        <div class="input-group-btn">
                            //            <button type="button" class="btn btn-danger" onclick="p_btnLOVVARIANRASAClick(this)">
                            //                <i class="fa fa-search"></i>
                            //            </button>
                            //        </div>
                            //        <input type="text" class="form-control" name="txtVarianRasa" value="${d.txtVarianRasa || ''}" readonly>
                            //    </div>
                            //</div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtVarianRasa" value="${d.txtVarianRasa || ''}" readonly>
                            </div>`,
                            //// 3. Category
                            //`<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            //    <div class="input-group">
                            //        <div class="input-group-btn">
                            //            <button type="button" class="btn btn-danger" onclick="p_btnLOVCATEGORYClick(this)">
                            //                <i class="fa fa-search"></i>
                            //            </button>
                            //        </div>
                            //        <input type="text" class="form-control" name="txtCategory" value="${d.txtCategory || ''}" readonly>
                            //    </div>
                            //</div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtCategory" value="${d.txtCategory || ''}" readonly>
                            </div>`,
                            //// 4. Grand Parent
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
                            //// 5. Parent
                            //`<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            //    <div class="input-group">
                            //        <div class="input-group-btn">
                            //            <button type="button" class="btn btn-danger" onclick="p_btnLOVPARENTClick(this)">
                            //                <i class="fa fa-search"></i>
                            //            </button>
                            //        </div>
                            //        <input type="text" class="form-control" name="txtParent" value="${d.txtParent || ''}" readonly>
                            //    </div>
                            //</div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtParent" value="${d.txtParent || ''}" readonly>
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
                                <textarea class="form-control" name="txtRMDescription" readonly rows="3">${d.txtRmdesc || ''}</textarea>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control decimal-input" name="decFormulaPercentage1" placeholder="0.00" value="${d.decFormulaPercentage1 || ''}" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control integer-input" name="intMatrixRule1" placeholder="0" value="${d.intMatrixRule1 || ''}" oninput="formatInteger(this)">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtNote1"  rows="3">${d.txtNote1 || ''}</textarea>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control decimal-input" name="decFormulaPercentage2" placeholder="0.00" value="${d.decFormulaPercentage2 || ''}" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control integer-input" name="intMatrixRule2" placeholder="0" value="${d.intMatrixRule2 || ''}" oninput="formatInteger(this)">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtNote2" rows="3">${d.txtNote2 || ''}</textarea>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control decimal-input" name="decFormulaPercentage3" placeholder="0.00" value="${d.decFormulaPercentage3 || ''}" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control integer-input" name="intMatrixRule3" placeholder="0" value="${d.intMatrixRule3 || ''}" oninput="formatInteger(this)">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtNote3" rows="3">${d.txtNote3 || ''}</textarea>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control decimal-input" name="decFormulaPercentage4" placeholder="0.00" value="${d.decFormulaPercentage4 || ''}" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control integer-input" name="intMatrixRule4" placeholder="0" value="${d.intMatrixRule4 || ''}" oninput="formatInteger(this)">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtNote4" rows="3">${d.txtNote4 || ''}</textarea>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control decimal-input" name="decFormulaPercentage5" placeholder="0.00" value="${d.decFormulaPercentage5 || ''}" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control integer-input" name="intMatrixRule5" placeholder="0" value="${d.intMatrixRule5 || ''}" oninput="formatInteger(this)">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtNote5" rows="3">${d.txtNote5 || ''}</textarea>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control decimal-input" name="decFormulaPercentage6" placeholder="0.00" value="${d.decFormulaPercentage6 || ''}" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control integer-input" name="intMatrixRule6" placeholder="0" value="${d.intMatrixRule6 || ''}" oninput="formatInteger(this)">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtNote6" rows="3">${d.txtNote6 || ''}</textarea>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control decimal-input" name="decFormulaPercentage7" placeholder="0.00" value="${d.decFormulaPercentage7 || ''}" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control integer-input" name="intMatrixRule7" placeholder="0" value="${d.intMatrixRule7 || ''}" oninput="formatInteger(this)">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtNote7" rows="3">${d.txtNote7 || ''}</textarea>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control decimal-input" name="decFormulaPercentage8" placeholder="0.00" value="${d.decFormulaPercentage8 || ''}" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control integer-input" name="intMatrixRule8" placeholder="0" value="${d.intMatrixRule8 || ''}" oninput="formatInteger(this)">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtNote8" rows="3">${d.txtNote8 || ''}</textarea>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control decimal-input" name="decFormulaPercentage9" placeholder="0.00" value="${d.decFormulaPercentage9 || ''}" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control integer-input" name="intMatrixRule9" placeholder="0" value="${d.intMatrixRule9 || ''}" oninput="formatInteger(this)">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtNote9" rows="3">${d.txtNote9 || ''}</textarea>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control decimal-input" name="decFormulaPercentage10" placeholder="0.00" value="${d.decFormulaPercentage10 || ''}" oninput="formatDecimal(this)" onchange="p_updateRangeFormula()">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control integer-input" name="intMatrixRule10" placeholder="0" value="${d.intMatrixRule10 || ''}" oninput="formatInteger(this)">
                                </div>
                            </div>`,
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtNote10" rows="3">${d.txtNote10 || ''}</textarea>
                            </div>`,
                            // 1. Delete button
                            `<div style="text-align:center">
                                <i class="fas fa-trash fa-2x trash-icon" onclick="deleteRowVisualdata(this)"></i>                                
                            </div>`
                        ]).draw(false);
                    }
                    p_updateRangeFormula();
                    $("#modalCopyFrom").modal("hide");
                } else {
                    p_showBlank();
                }
            } else {
                debugger;
                clsGlobal.getAlert(retDat.txtMessage);
            }
            clsGlobal.hideLoading();
        },
        error: function (retDat) {
            clsGlobal.hideLoading();
        }
    });
}

function p_btnChangeStatus() {
    try {
        $("#txtFromStatus").val($("#txtStatus").val());
        $("#modalChangeStatus").modal("show");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_CHANGESTATUS() {
    clsGlobal.showLoading();
    debugger;

    var a = $("#txtBrandH").val();
    var b = $("#txtVarianRasaH").val();
    debugger;
    var data = {
        intMatrixStructureId: $("#id").val(),
        txtStatus: $("#ddlToStatus").val(),
        txtNote: $("#txtNote").val(),
        txtBrand: $("#txtBrandH").val(),
        txtVarianRasa: $("#txtVarianRasaH").val(),

    };

    $.ajax({
        type: "POST",
        url: "/MatrixStructure/ChangeStatus",
        data: { data: JSON.stringify(data), __RequestVerificationToken: $('#FormMatrixStructure input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                debugger;
                $("#modalChangeStatus").modal("hide");
            //        showSuccessStatusPopup("Update Status Success!");
                //    clsGlobal.swalSuccessSaveOrSubmit(retDat.txtMessage, window.detailUrl + '?id=' + retDat.objData.id);
                showSuccessStatusPopup("Update Status Success!", retDat.objData.txtMatrixStructureId);
            } else {
                debugger;
                clsGlobal.getAlert(retDat.message);
            }
            clsGlobal.hideLoading();
        },
        error: function (retDat) {
            clsGlobal.hideLoading();
        }
    });
}
function p_btnTS() {
    try {
        var headerId = $("#id").val();
        // Show modal
        $("#modalTimeStamp").modal("show");

        // Clear dulu DataTable
        var table = $("#tableTimeStamp").DataTable();
        table.clear().draw();

        // Panggil API untuk ambil history
        $.ajax({
            type: "POST",
            url: "/MatrixStructure/GetMatrixStructureHistory",
            data: { headerId: headerId, __RequestVerificationToken: $('#FormMatrixStructure input[name=__RequestVerificationToken]').val() },
            datatype: "json",
            success: function (data) {
                if (data && data.length > 0) {
                    debugger;
                    data.forEach(function (row) {
                        table.row.add([
                            row.txtUserName ?? "-",
                            row.txtStatus ?? "-",
                            row.dtmCreatedDate ? moment(row.dtmCreatedDate).format("YYYY-MM-DD HH:mm") : "-",
                            row.txtNote ?? "-"
                        ]).draw(false);
                    });
                }
            },
            error: function (xhr) {
                clsGlobal.showAlert("Error load Time Stamp: " + xhr.responseText);
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}

function p_GETMATRIXRULE(RMCODE, brand, varian, currentMatrixRule) {
    $.ajax({
        type: "POST",
        url: "/MatrixStructure/GetDataMatrixRule",
        data: {
            RMCODE: RMCODE,
            brand: brand,
            varian: varian,
            __RequestVerificationToken: $('#FormMatrixStructure input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess === true) {
                if (retDat.objData != undefined) {
                    debugger;
                    if (currentMatrixRule) {
                        currentMatrixRule.val(retDat.objData);
                        currentMatrixRule = null;
                    }

                } else {
                    p_showBlank();
                }
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }
        },
        error: function (retDat) {
            clsGlobal.getAlert("Error calling API!");
        }
    });
}

$('#btnSave').click(function () {
    debugger;
    const isEdit = parseInt($("#id").val()) > 0; // boolean: true or false
    const actionText = isEdit ? "update" : "save";
    showSaveConfirmation(actionText, isEdit);
});
$('#btnDelete').click(function () {
    debugger;
    const actionText = "delete";
    showDeleteConfirmation(actionText);
});
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
function showDeleteConfirmation(actionText) {
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
            deleteData();
        } else if (result.isDenied) {
            Swal.fire(`Changes are not ${actionText}`, "", "info");
        }
    });
}
function saveData(isEdit) {
    debugger;
    //if (!validateForm()) {
    //    return;
    //}

    p_UIToDataList();
    p_UIToData();

    const url = isEdit ? window.updateUrl : window.saveUrl;
    debugger;

    // Buat FormData untuk kirim file + data JSON
    const formData = new FormData();
    formData.append("data", $("#txtHiddenObject").val());
    formData.append("__RequestVerificationToken", $('#FormMatrixStructureDetail input[name=__RequestVerificationToken]').val());


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
                clsGlobal.swalSuccessSaveOrSubmit(retDat.txtMessage, window.detailUrl + "?id=" + retDat.objData.txtMatrixStructureId);
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
function deleteData() {
    debugger;
    //if (!validateForm()) {
    //    return;
    //}

    p_UIToDataList();
    p_UIToData();

    const url = deleteUrl;
    debugger;

    // Buat FormData untuk kirim file + data JSON
    const formData = new FormData();
    formData.append("data", $("#txtHiddenObject").val());
    formData.append("__RequestVerificationToken", $('#FormMatrixStructureDetail input[name=__RequestVerificationToken]').val());


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

function p_updateRangeFormula() {
    let total1 = 0;
    let total2 = 0;
    let total3 = 0;
    let total4 = 0;
    let total5 = 0;
    let total6 = 0;
    let total7 = 0;
    let total8 = 0;
    let total9 = 0;
    let total10 = 0;

    // Hitung semua decFormulaPercentage1
    $("input[name='decFormulaPercentage1']").each(function () {
        let val = parseFloat($(this).val());
        if (!isNaN(val)) {
            total1 += val;
        }
    });

    // Hitung semua decFormulaPercentage2
    $("input[name='decFormulaPercentage2']").each(function () {
        let val = parseFloat($(this).val());
        if (!isNaN(val)) {
            total2 += val;
        }
    });

    // Hitung semua decFormulaPercentage3
    $("input[name='decFormulaPercentage3']").each(function () {
        let val = parseFloat($(this).val());
        if (!isNaN(val)) {
            total3 += val;
        }
    });

    // Hitung semua decFormulaPercentage4
    $("input[name='decFormulaPercentage4']").each(function () {
        let val = parseFloat($(this).val());
        if (!isNaN(val)) {
            total4 += val;
        }
    });

    // Hitung semua decFormulaPercentage5
    $("input[name='decFormulaPercentage5']").each(function () {
        let val = parseFloat($(this).val());
        if (!isNaN(val)) {
            total5 += val;
        }
    });

    // Hitung semua decFormulaPercentage6
    $("input[name='decFormulaPercentage6']").each(function () {
        let val = parseFloat($(this).val());
        if (!isNaN(val)) {
            total6 += val;
        }
    });

    // Hitung semua decFormulaPercentage7
    $("input[name='decFormulaPercentage7']").each(function () {
        let val = parseFloat($(this).val());
        if (!isNaN(val)) {
            total7 += val;
        }
    });

    // Hitung semua decFormulaPercentage8
    $("input[name='decFormulaPercentage8']").each(function () {
        let val = parseFloat($(this).val());
        if (!isNaN(val)) {
            total8 += val;
        }
    });

    // Hitung semua decFormulaPercentage9
    $("input[name='decFormulaPercentage9']").each(function () {
        let val = parseFloat($(this).val());
        if (!isNaN(val)) {
            total9 += val;
        }
    });

    // Hitung semua decFormulaPercentage10
    $("input[name='decFormulaPercentage10']").each(function () {
        let val = parseFloat($(this).val());
        if (!isNaN(val)) {
            total10 += val;
        }
    });

    // Update rangeFormula1
    let $range1 = $("#rangeFormula1");
    $range1.val(total1.toFixed(2) + " %");
    if (total1 >= 99.99 && total1 <= 100.01) {
        $range1.css({ "background-color": "green", "color": "white" });
    } else {
        $range1.css({ "background-color": "red", "color": "white" });
    }

    // Update rangeFormula2
    let $range2 = $("#rangeFormula2");
    $range2.val(total2.toFixed(2) + " %");
    if (total2 >= 99.99 && total2 <= 100.01) {
        $range2.css({ "background-color": "green", "color": "white" });
    } else {
        $range2.css({ "background-color": "red", "color": "white" });
    }

    // Update rangeFormula3
    let $range3 = $("#rangeFormula3");
    $range3.val(total3.toFixed(2) + " %");
    if (total3 >= 99.99 && total3 <= 100.01) {
        $range3.css({ "background-color": "green", "color": "white" });
    } else {
        $range3.css({ "background-color": "red", "color": "white" });
    }

    // Update rangeFormula4
    let $range4 = $("#rangeFormula4");
    $range4.val(total4.toFixed(2) + " %");
    if (total4 >= 99.99 && total4 <= 100.01) {
        $range4.css({ "background-color": "green", "color": "white" });
    } else {
        $range4.css({ "background-color": "red", "color": "white" });
    }

    // Update rangeFormula5
    let $range5 = $("#rangeFormula5");
    $range5.val(total5.toFixed(2) + " %");
    if (total5 >= 99.99 && total5 <= 100.01) {
        $range5.css({ "background-color": "green", "color": "white" });
    } else {
        $range5.css({ "background-color": "red", "color": "white" });
    }

    // Update rangeFormula6
    let $range6 = $("#rangeFormula6");
    $range6.val(total6.toFixed(2) + " %");
    if (total6 >= 99.99 && total6 <= 100.01) {
        $range6.css({ "background-color": "green", "color": "white" });
    } else {
        $range6.css({ "background-color": "red", "color": "white" });
    }

    // Update rangeFormula7
    let $range7 = $("#rangeFormula7");
    $range7.val(total7.toFixed(2) + " %");
    if (total7 >= 99.99 && total7 <= 100.01) {
        $range7.css({ "background-color": "green", "color": "white" });
    } else {
        $range7.css({ "background-color": "red", "color": "white" });
    }

    // Update rangeFormula8
    let $range8 = $("#rangeFormula8");
    $range8.val(total8.toFixed(2) + " %");
    if (total8 >= 99.99 && total8 <= 100.01) {
        $range8.css({ "background-color": "green", "color": "white" });
    } else {
        $range8.css({ "background-color": "red", "color": "white" });
    }

    // Update rangeFormula9
    let $range9 = $("#rangeFormula9");
    $range9.val(total9.toFixed(2) + " %");
    if (total9 >= 99.99 && total9 <= 100.01) {
        $range9.css({ "background-color": "green", "color": "white" });
    } else {
        $range9.css({ "background-color": "red", "color": "white" });
    }

    // Update rangeFormula9
    let $range10 = $("#rangeFormula10");
    $range10.val(total10.toFixed(2) + " %");
    if (total10 >= 99.99 && total10 <= 100.01) {
        $range10.css({ "background-color": "green", "color": "white" });
    } else {
        $range10.css({ "background-color": "red", "color": "white" });
    }
}


$('#btnDownload').on('click', function (e) {
    e.preventDefault();
    debugger;
    ProjectDetail.DownloadTemplate();
});

$('#btnUploadNutFact').on('click', function (e) {
    e.preventDefault();

    ProjectDetail.UploadTemplate();

    $("#templateUploadNutriFact").val(null);
});

// Handler klik OK: baru redirect
$(document).on("click", "#btnSuccessStatusOk", function () {
    var id = $("#txtMatrixStructureId").val();
    if (id) {
        window.location.href = window.detailUrl + "?id=" + id;
    } else {
        $("#modalSuccessStatus").modal("hide");
    }
});

$('#btnBack').click(function () {

    Swal.fire({
        title: "The Data have not been saved, are you sure to go back to home page?",
        confirmButtonText: "Back",
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = window.indexUrl;
        }
    });
});

function disableAllForApproval() {
    if (!$('#approval-notice').length) {
        $('<div id="approval-notice" class="approval-notice">' +
            '<i class="fas fa-exclamation-circle me-2"></i>' +
            'This document is in "Approved / Obsolete" status and cannot be edited.' +
            '</div>').insertAfter('.card-body h4');
    }
    debugger;
    $('input, select, textarea').not('#btnBack, input[type=hidden]').prop('disabled', true);
    $('#btnSubmit').addClass('d-none');
    $('#btnSave').addClass('d-none');
    $('#btnDownload').addClass('d-none');
    $('#templateUploadNutriFact').addClass('d-none');
    $('#btnUploadNutFact').addClass('d-none');
    $('#btnCopy').addClass('d-none');
    //$('#btnChangeStatus').addClass('d-none');
    //$('#btnTS').addClass('d-none');
    $('#btnDelete').addClass('d-none');
    $('#btnAdd').addClass('d-none');
    debugger;
    //    disableTableOperations();
}

function hiddenBtn() {
    debugger;
    $('#btnDownload').addClass('d-none');
    $('#templateUploadNutriFact').addClass('d-none');
    $('#btnUploadNutFact').addClass('d-none');
    $('#btnCopy').addClass('d-none');
    debugger;
    //    disableTableOperations();
}

$("#btnNew").on('click', function () {
    window.location.href = base_path + `/MatrixStructure/Detail`;
});

$('#modalChangeStatus').on('show.bs.modal', function () {
    var currentStatus = $('#txtStatus').val().toUpperCase();
    var ddl = $('#ddlToStatus');
    ddl.empty(); // clear isi dropdown

    if (currentStatus === "APPROVED") {
        ddl.append('<option value="">-- Pilih Status --</option>');
        ddl.append('<option value="OBSOLETE">OBSOLETE</option>');
    } else if (currentStatus === "DRAFT") {
        ddl.append('<option value="">-- Pilih Status --</option>');
        ddl.append('<option value="APPROVED">APPROVED</option>');
        ddl.append('<option value="OBSOLETE">OBSOLETE</option>');
    } else {
        ddl.append('<option value="">-- Pilih Status --</option>');
        ddl.append('<option value="DRAFT">DRAFT</option>');
        ddl.append('<option value="APPROVED">APPROVED</option>');
        ddl.append('<option value="OBSOLETE">OBSOLETE</option>');
    }

    // set From Status sesuai kondisi
    $('#txtFromStatus').val(currentStatus);
});
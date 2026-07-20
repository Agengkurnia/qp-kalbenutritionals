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
let hasCopyData = false; // default
let currentRow = null; // simpan row aktif global
//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    flatpickr("#dtmIntransitDate", {
        dateFormat: "d-M-Y",
        // minDate: "today",
        onChange: function (selectedDates, dateStr, instance) {
            // alert(`Selected date: ${dateStr}`);
            dateStr;
        }
    });
    p_InitForm();


});

function p_InitForm() {
    p_initiateData();

}

var tableMatrixRule = $("#tableMatrixRule").DataTable({
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
        { visible: false, targets: [0] }
    //    { "className": "d-none", targets: [1] }
    //    { visible: false, targets: [1] }
    ]
});

// sync edits to DataTables cache
$('#tableMatrixRule').on('input change', 'input, textarea, select', function () {
    var $el = $(this);
    var $td = $el.closest('td');
    var cell = tableMatrixRule.cell($td);

    var $clone = $el.clone();
    var normalizedVal = ($el.val() || '').replace(/\s+/g, ' ').trim();

    if ($el.is('textarea')) {
        $clone.text(normalizedVal);
    } else {
        $clone.attr('value', normalizedVal);
    }

    cell.data($clone.prop('outerHTML'));
    tableMatrixRule.row($td.closest('tr')).invalidate();
    tableMatrixRule.draw(false);
});


var tableMatrixRuleDetail = $("#tableMatrixRuleDetail").DataTable({
    "scrollX": true,
    scrollY: "500px",
    fixedHeader: true,
    "scrollCollapse": true,
    renderer: "bootstrap",
    "processing": true,
    "bAutoWidth": false,
    "paging": true,
    "aLengthMenu": [[-1, 5, 10, 100], ["ALL", 5, 10, 100]],
    //"fixedColumns": { "left": [3] },
    "order": [
        [1, "asc"], // Category
        [2, "asc"], // Grand Parent
        [3, "asc"], // Parent
        [4, "asc"]  // RM Code
    ],
    "columnDefs": [
        {

            targets: "_all",
            render: function (data, type, row, meta) {
                if (type === "sort" || type === "filter") {
                    var $el = $('<div>').html(data || "");
                    var input = $el.find('input, textarea, select');

                    if (input.length > 0) {
                        // baca atribut value atau text
                        var v = input.attr('value') || input.val() || input.text() || "";
                        return (v || "").toString().replace(/\s+/g, ' ').trim();
                    }
                    return $el.text().trim();
                }
                return data;
            }
        },
        //{ className: "text-center", "targets": [2] },
        { "visible": false, "targets": [0] }
    //    { "className": "d-none", targets: [1] }
    //    { visible: false, targets: [1] }
    ]
})

//// --- sync edits ke cache (contoh untuk tabel detail, sama untuk lainnya) ---
//$('#tableMatrixRuleDetail').on('input change', 'input, textarea, select', function () {
//    var $el = $(this);
//    var $td = $el.closest('td');
//    var cell = tableMatrixRuleDetail.cell($td);

//    var normalizedVal = ($el.val() || '').replace(/\s+/g, ' ').trim();
//    var $clone = $el.clone();

//    if ($el.is('textarea')) {
//        $clone.text(normalizedVal);
//    } else {
//        $clone.attr('value', normalizedVal);
//    }

//    cell.data($clone.prop('outerHTML'));
//    tableMatrixRuleDetail.row($td.closest('tr')).invalidate();
//    tableMatrixRuleDetail.draw(false); // false supaya paging tidak direset
//});


var tableMatrixRuleViewDetail = $("#tableMatrixRuleViewDetail").DataTable({
    "scrollX": true,
    "scrollY": "500px",
    "scrollCollapse": true,
    renderer: "bootstrap",
    "processing": true,
    "bAutoWidth": false,
    "paging": true,
    "aLengthMenu": [[-1, 5, 10, 100], ["ALL", 5, 10, 100]],
    "fixedHeader": true,
    "fixedColumns": { "left": [3] },
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

var tableReason = $("#tableReason").DataTable({
    "scrollX": true,
    "renderer": "bootstrap",
    "processing": true,
    "bAutoWidth": false,
    "paging": true,
    "aLengthMenu": [[-1, 5, 10, 100], ["ALL", 5, 10, 100]],
    //"fixedColumns": { "left": [2] },
    "order": [[0, "asc"]], // urutkan DESC supaya row terbaru di atas
    "columnDefs": [
        {

            targets: 0, // khusus kolom pertama
            render: function (data, type, row, meta) {
                if (type === "sort" || type === "filter") {
                    var $el = $('<div>').html(data || "");
                    var input = $el.find('input');
                    if (input.length > 0) {
                        return input.val() || input.attr('value') || "";
                    }
                    return $el.text().trim();
                }
                return data;
            }
        },
        {
            targets: "_all",
            render: function (data, type, row, meta) {
                if (type === "sort" || type === "filter") {
                    var $el = $('<div>').html(data || "");
                    var input = $el.find('input, textarea, select');
                    if (input.length > 0) {
                        return input.val() || input.attr('value') || input.text() || "";
                    }
                    return $el.text().trim();
                }
                return data;
            }
        },
        //{ className: "text-center", "targets": [2] },
        //    { "visible": false, "targets": [0] },
    ]
})

// Biar header & body sejajar pas modal dibuka
$('#modalTimeStamp').on('shown.bs.modal', function () {
    tableTimeStamp.columns.adjust().draw();
});

// helper: pasang custom search handler ke DataTable instance
function bindNormalizedSearch(table) {
    var $input = $(table.table().container()).find('input[type="search"]');

    // jika tidak ketemu, coba fallback ke selector global (opsional)
    if ($input.length === 0) {
        $input = $('#' + $(table.table().node()).attr('id') + '_filter input');
    }

    // detach handler sebelumnya lalu pasang kita sendiri
    $input.off('keyup.dtCustom').on('keyup.dtCustom', function () {
        var v = $(this).val() || '';
        v = v.replace(/\s+/g, ' ').trim();               // normalisasi spasi
        // gunakan regex=false, smart=false agar spasi dianggap literal
        table.search(v, false, false).draw();
    });
}

// pasang untuk kedua tabel
bindNormalizedSearch(tableMatrixRule);
bindNormalizedSearch(tableMatrixRuleDetail);

function setChooseLOV(txtValue) {
    var arr = txtValue.split('|');

    debugger;

    switch (arr[0]) {
        case "txtBrand":
            p_TxtBrand_TextChanged(arr[1]);
            break;
        case "txtVarianRasa":
            p_txtVarianRasa_TextChanged(arr[1]);
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
        case "COPYFROM_MRU":
            $("#modalCopyFrom").modal("show");
            $("#intNoCopy").val(arr[1]);
            $("#txtDocumentNoCopy").val(arr[2]);
            $("#txtStatusCopy").val(arr[3]);
            break;
    }
    clsGlobal.closeLOV();
}
function p_initiateData() {
    debugger;
    clsGlobal.showLoading();
    var a = $("#txtMatrixRuleId").val();
    $.ajax({
        type: "POST",
        url: "/MatrixRule/InitiateData",
        data: {
            id: $("#txtMatrixRuleId").val(),
            __RequestVerificationToken: $('#FormMatrixRule input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    debugger;
                    $("#txtHiddenObject").val(JSON.stringify(retDat.objData));

                    p_DataToUI(retDat.objData);

                    // ✅ Kondisi disable Reason button kalau intMatrixRuleId == 0
                    if (retDat.objData.intMatrixRuleId === 0) {
                        $("#btnReason").prop("disabled", true);
                        
                    } else {
                        $("#btnReason").prop("disabled", false);
                        hiddenBtn()
                        $('#dtmEffectiveDate').prop('readonly', true); 

                    }

                    tableMatrixRule.clear().draw(false);

                    for (var i = 0; i < retDat.objData.listMMatrixRuleDetail.length; i++) {
                        var d = retDat.objData.listMMatrixRuleDetail[i];
                        counter++;
                        tableMatrixRule.row.add([
                            counter,
                            //// 2. Hidden ID
                            //`<input  name="intMatrixRuleDetailId" value="${d.intMatrixRuleDetailId || ''}">`,
                            // Category
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <input type="text" class="form-control" name="txtCategory" value="${d.txtCategory || ''}" readonly>
                            <input type="hidden" name="intMatrixRuleDetailId" value="${d.intMatrixRuleDetailId || ''}">
                        </div>`,
                            // Grand Parent
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <input type="text" class="form-control" name="txtGrandParent" value="${d.txtGrandParent || ''}" readonly>
                        </div>`,
                            // Parent
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <input type="text" class="form-control" name="txtParent" value="${d.txtParent || ''}" readonly>
                        </div>`,
                            // RM Code
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                             <input type="text" class="form-control" name="txtRMCode" value="${d.txtRmcode || ''}" readonly>
                        </div>`,
                            // RM Description
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <textarea class="form-control" name="txtRMDescription" readonly rows="3">${d.txtRmdesc || ''}</textarea>
                        </div>`,
                            // Brand
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <input type="text" class="form-control" name="txtBrand" value="${d.txtBrand || ''}" readonly>
                        </div>`,
                            // Varian
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <input type="text" class="form-control" name="txtVarianRasa" value="${d.txtVarianRasa || ''}" readonly>
                        </div>`,
                            // MatrixRule
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <input type="text" class="form-control" name="intMatrixRule" value="${d.intMatrixRule || ''}" readonly>
                        </div>`,
                            // Action
                            `<div style="text-align:center">
                            <i class="fas fa-trash fa-2x trash-icon" onclick="deleteRowVisualdata(this)"></i>
                        </div>`
                        ]).draw(false);
                        
                        var bb = $("#intMatrixRuleDetailId").val();
                        debugger;
                    }
                    
                    if (retDat.objData.listMMatrixRuleDetail.length > 0) {
                        $('#btnEdit').prop('disabled', false);
                    }

                    if (retDat.objData.txtStatus.toUpperCase() == "APPROVED") {
                        disableAllForApproval();
                        $('#ddlToStatus').prop('disabled', false);
                        $('#txtNote').prop('disabled', false);
                    }
                    if (retDat.objData.txtStatus.toUpperCase() == "OBSOLETE") {
                        disableAllForApproval();
                        $('#btnChangeStatus').addClass('d-none');
                    }
                    //p_updateRangeFormula();

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
    $("#id").val(clsGlobal.parseToInteger(objData.intMatrixRuleId));
    $("#txtMatrixStructureId").val(clsGlobal.parseToString(objData.txtMatrixRuleId));
    $("#txtStatus").val(clsGlobal.parseToString(objData.txtStatus));
    $("#txtDocNo").val(clsGlobal.parseToString(objData.txtMatrixRuleNo));
    //$('#dtmEffectiveDate').val(clsGlobal.parseJSONdateNew(objData.dtmEffectiveDate));
    if (objData.dtmEffectiveDate) {
        let d = new Date(objData.dtmEffectiveDate);

        // Ambil komponen dengan local time
        let year = d.getFullYear();
        let month = (d.getMonth() + 1).toString().padStart(2, "0");
        let day = d.getDate().toString().padStart(2, "0");

        let formatted = `${year}-${month}-${day}`; // yyyy-MM-dd
        $('#dtmEffectiveDate').val(formatted);
    }
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

    tableMatrixRule.clear().draw(false);

    $("#txtHiddenObject").val(JSON.stringify(objData));


}

function p_UIToData() {
    debugger;

    var jsonObj = [];
    var htmlJSON = $("#txtHiddenObject").val();
    jsonData = JSON.parse(htmlJSON);
    jsonData.intMatrixRuleId = clsGlobal.parseToInteger($("#id").val());
    jsonData.txtMatrixRuleId = $("#txtMatrixRuleId").val();
    jsonData.txtStatus = $("#txtStatus").val();
    jsonData.txtDocNo = $("#txtDocNo").val();

    jsonData.dtmEffectiveDate = $("#dtmEffectiveDate").val();
    jsonData.bitActive = clsGlobal.parseToBoolean($("#bitActive").prop("checked"));

    jsonData.txtCreatedBy = $("#txtCreatedBy").val();
    jsonData.dtmCreatedDate = $("#dtmCreatedDate").val();
    jsonData.txtUpdatedBy = $("#txtUpdatedBy").val();
    jsonData.dtmUpdatedDate = $("#dtmUpdatedDate").val();

    jsonData.listMMatrixRuleDetail = $("#txtHiddenObjectList").val();
    jsonData.listMMatrixRuleReason = $("#txtHiddenObjectListReason").val();

    $("#txtHiddenObject").val(JSON.stringify(jsonData));

    var ho = $("#txtHiddenObject").val(); // sekarang seharusnya berisi MItemMappingList
    var dt = $("#txtHiddenObjectList").val();
}
function p_UIToDataDetail() {
    debugger;

    var jsonObj = [];
    var htmlJSON = $("#txtHiddenObject").val();
    jsonData = JSON.parse(htmlJSON);
    jsonData.intMatrixRuleId = clsGlobal.parseToInteger($("#id").val());
    jsonData.txtMatrixRuleId = $("#txtMatrixRuleId").val();
    jsonData.txtStatus = $("#txtStatus").val();
    jsonData.txtDocNo = $("#txtDocNo").val();

    jsonData.dtmEffectiveDate = $("#dtmEffectiveDate").val();

    jsonData.txtCreatedBy = $("#txtCreatedBy").val();
    jsonData.dtmCreatedDate = $("#dtmCreatedDate").val();
    jsonData.txtUpdatedBy = $("#txtUpdatedBy").val();
    jsonData.dtmUpdatedDate = $("#dtmUpdatedDate").val();

    jsonData.listMMatrixRuleDetail = $("#txtHiddenObjectListDetail").val();

    $("#txtHiddenObject").val(JSON.stringify(jsonData));

    var ho = $("#txtHiddenObject").val(); // sekarang seharusnya berisi MItemMappingList
    var dt = $("#txtHiddenObjectListDetail").val();
}

function p_UIToDataReason() {
    debugger;

    var jsonObj = [];
    var htmlJSON = $("#txtHiddenObject").val();
    jsonData = JSON.parse(htmlJSON);
    jsonData.intMatrixRuleId = clsGlobal.parseToInteger($("#id").val());
    jsonData.txtMatrixRuleId = $("#txtMatrixRuleId").val();
    jsonData.txtStatus = $("#txtStatus").val();
    jsonData.txtDocNo = $("#txtDocNo").val();

    jsonData.dtmEffectiveDate = $("#dtmEffectiveDate").val();

    jsonData.txtCreatedBy = $("#txtCreatedBy").val();
    jsonData.dtmCreatedDate = $("#dtmCreatedDate").val();
    jsonData.txtUpdatedBy = $("#txtUpdatedBy").val();
    jsonData.dtmUpdatedDate = $("#dtmUpdatedDate").val();

    jsonData.listMMatrixRuleReason = $("#txtHiddenObjectListReason").val();

    $("#txtHiddenObject").val(JSON.stringify(jsonData));

    var ho = $("#txtHiddenObject").val(); // sekarang seharusnya berisi MItemMappingList
    var dt = $("#txtHiddenObjectListReason").val();
}

function p_UIToDataList() {
    var dataList = [];

    // Ambil instance DataTable
    var table = $("#tableMatrixRule").DataTable();

    // Ambil semua row (termasuk yg ke-filter/hidden) pakai dataTables API
    table.rows().every(function () {
        var $row = $(this.node());

        // Abaikan row placeholder
        if ($row.hasClass("dataTables_empty") || $row.text().trim() === "No data available in table") {
            return;
        }

        let obj = {
            txtCategory: $row.find('input[name="txtCategory"]').val() || "",
            txtGrandParent: $row.find('input[name="txtGrandParent"]').val() || "",
            txtParent: $row.find('input[name="txtParent"]').val() || "",
            txtRMCode: $row.find('input[name="txtRMCode"]').val() || "",
            txtRMDescription: $row.find('textarea[name="txtRMDescription"]').val() || "",
            txtBrand: $row.find('input[name="txtBrand"]').val() || "",
            txtVarianRasa: $row.find('input[name="txtVarianRasa"]').val() || "",
            intMatrixRule: $row.find('input[name="intMatrixRule"]').val() || "0",
            intMatrixRuleDetailId: $row.find('input[name="intMatrixRuleDetailId"]').val() || "0"
        };

        dataList.push(obj);
    });

    // simpan ke hidden input
    $("#txtHiddenObjectList").val(JSON.stringify(dataList));
}

function p_UIToDataListDetail() {
    var dataList = [];

    // Ambil instance DataTable
    var table = $("#tableMatrixRuleDetail").DataTable();

    // Ambil semua row (termasuk yg tidak tampil karena filter/search)
    var rows = table.rows().nodes();

    // Kalau tidak ada row, langsung return []
    if (rows.length === 0) {
        $("#txtHiddenObjectListDetail").val("[]");
        return;
    }

    $(rows).each(function () {
        let $row = $(this);

        // Abaikan row placeholder DataTable "No data available"
        if ($row.hasClass("dataTables_empty") || $row.text().trim() === "No data available in table") {
            return;
        }

        let obj = {
            txtCategory: $row.find('input[name="txtCategoryDetail"]').val() || "",
            txtGrandParent: $row.find('input[name="txtGrandParentDetail"]').val() || "",
            txtParent: $row.find('input[name="txtParentDetail"]').val() || "",
            txtRMCode: $row.find('input[name="txtRMCodeDetail"]').val() || "",
            txtRMDescription: $row.find('textarea[name="txtRMDescriptionDetail"]').val() || "",
            txtBrand: $row.find('input[name="txtBrandDetail"]').val() || "",
            txtVarianRasa: $row.find('input[name="txtVarianRasaDetail"]').val() || "",
            intMatrixRule: $row.find('input[name="intMatrixRuleDetail"]').val() || "0",
            intMatrixRuleDetailId: $row.find('input[name="intMatrixRuleDetailIdDetail"]').val() || "0"
        };

        dataList.push(obj);
    });

    // simpan ke hidden input
    $("#txtHiddenObjectListDetail").val(JSON.stringify(dataList));
}


//function p_UIToDataList() {
//    var dataList = [];

//    const $rows = $("#tableMatrixRule tbody tr");
//    debugger;
//    // Kalau tidak ada row, langsung return []
//    if ($rows.length === 0) {
//        $("#txtHiddenObjectList").val("[]");
//        return;
//    }
//    $rows.each(function () {
//        let $row = $(this);
//        debugger;
//        // Abaikan row placeholder DataTable "No data available"
//        if ($row.hasClass("dataTables_empty") || $row.text().trim() === "No data available in table") {
//            return;
//        }
//        var c = $row.find('input[name="txtCategory"]').val();
//        let obj = {
//            txtCategory: $row.find('input[name="txtCategory"]').val() || "",
//            txtGrandParent: $row.find('input[name="txtGrandParent"]').val() || "",
//            txtParent: $row.find('input[name="txtParent"]').val() || "",
//            txtRMCode: $row.find('input[name="txtRMCode"]').val() || "",
//            txtRMDescription: $row.find('textarea[name="txtRMDescription"]').val() || "",
//            txtBrand: $row.find('input[name="txtBrand"]').val() || "",
//            txtVarianRasa: $row.find('input[name="txtVarianRasa"]').val() || "",
//            intMatrixRule: $row.find('input[name="intMatrixRule"]').val() || "0",
//            intMatrixRuleDetailId: $row.find('input[name="intMatrixRuleDetailId"]').val() || "0"
//        };

//        dataList.push(obj);
//    });

//    // simpan ke hidden input
//    $("#txtHiddenObjectList").val(JSON.stringify(dataList));
//}
//function p_UIToDataListDetail() {
//    var dataList = [];

//    const $rows = $("#tableMatrixRuleDetail tbody tr");
//    // Ambil instance DataTable
//    //const $rows = $(tableMatrixRuleDetail.rows().nodes());

//    // Kalau tidak ada row, langsung return []
//    if ($rows.length === 0) {
//        $("#txtHiddenObjectListDetail").val("[]");
//        return;
//    }
//    debugger;
//    $rows.each(function () {
//        let $row = $(this);
//        debugger;
//        // Abaikan row placeholder DataTable "No data available"
//        if ($row.hasClass("dataTables_empty") || $row.text().trim() === "No data available in table") {
//            return;
//        }
//        var c = $row.find('input[name="txtCategoryDetail"]').val();
//        let obj = {
//            txtCategory: $row.find('input[name="txtCategoryDetail"]').val() || "",
//            txtGrandParent: $row.find('input[name="txtGrandParentDetail"]').val() || "",
//            txtParent: $row.find('input[name="txtParentDetail"]').val() || "",
//            txtRMCode: $row.find('input[name="txtRMCodeDetail"]').val() || "",
//            txtRMDescription: $row.find('textarea[name="txtRMDescriptionDetail"]').val() || "",
//            txtBrand: $row.find('input[name="txtBrandDetail"]').val() || "",
//            txtVarianRasa: $row.find('input[name="txtVarianRasaDetail"]').val() || "",
//            intMatrixRule: $row.find('input[name="intMatrixRuleDetail"]').val() || "0",
//            intMatrixRuleDetailId: $row.find('input[name="intMatrixRuleDetailIdDetail"]').val() || "0"
//        };

//        dataList.push(obj);
//    });

//    // simpan ke hidden input
//    $("#txtHiddenObjectListDetail").val(JSON.stringify(dataList));
//}

function p_UIToDataListReason() {
    var dataList = [];

    const $rows = $("#tableReason tbody tr");
    // Ambil instance DataTable
    //const $rows = $(tableMatrixRuleDetail.rows().nodes());

    // Kalau tidak ada row, langsung return []
    if ($rows.length === 0) {
        $("#txtHiddenObjectListReason").val("[]");
        return;
    }
    debugger;
    $rows.each(function () {
        let $row = $(this);
        debugger;
        // Abaikan row placeholder DataTable "No data available"
        if ($row.hasClass("dataTables_empty") || $row.text().trim() === "No data available in table") {
            return;
        }
        // Cari elemen (edit: jika ada input/textarea gunakan itu)
        var $docInput = $row.find('input[name="txtDocNoReason"]');
        var $dateInput = $row.find('input[name="dtmEffectiveDateReason"]');
        var $reasonTextarea = $row.find('textarea[name="txtReason"]');
        var $idInput = $row.find('input[name="intMatrixRuleReasonID"]');

        // Fallback ke teks di td kalau input tidak ada
        var txtDocNo = ($docInput.length ? $docInput.val() : ($row.find('td').eq(0).text().trim())) || "";
        var dtmEffectiveDate = ($dateInput.length ? $dateInput.val() : ($row.find('td').eq(1).text().trim())) || "";
        var txtReason = ($reasonTextarea.length ? $reasonTextarea.val() : ($row.find('td').eq(2).text().trim())) || "";
        var intMatrixRuleReasonID = ($idInput.length ? $idInput.val() : ($row.data('id') || "0"));

        dataList.push({
            txtDocNo: txtDocNo,
            dtmEffectiveDate: dtmEffectiveDate,
            txtReason: txtReason,
            intMatrixRuleReasonID: intMatrixRuleReasonID
        });
    });

    // simpan ke hidden input
    $("#txtHiddenObjectListReason").val(JSON.stringify(dataList));
}

function p_PopulateDataTable() {
    const table = $('#tableMatrixRuleDetail').DataTable();
    const dataRows = table.rows().nodes();
    debugger;
    let $firstRow = null;
    if (dataRows.length > 0) {
        $firstRow = $(dataRows[0]);

        const fieldsToCheck = [
            
            { name: "txtCategoryDetail", label: "Category" },
            { name: "txtGrandParentDetail", label: "Grand Parent" },
            { name: "txtParentDetail", label: "Parent" },
            { name: "txtRMCodeDetail", label: "RM Code" },
            { name: "txtRMDescriptionDetail", label: "RM Description" },
            { name: "txtBrandDetail", label: "Brand" },
            { name: "txtVarianRasaDetail", label: "Varian Rasa" },
            { name: "intMatrixRuleDetail", label: "Matrix Rule" },
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
    //// Default values jika ada baris pertama
    //let defaultPlant = $firstRow?.find('input[name="txtBrand"]').val() || "";
    //let defaultVarian = $firstRow?.find('input[name="txtVarianRasa"]').val() || "";

    counter++;
    let newRow = [
        counter,
        //// 2. Hidden ID
        //`<input name="intMatrixRuleDetailIdDetail">`,
        //// 3. Category
        //`<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
        //                        <div class="input-group">
        //                            <div class="input-group-btn">
        //                                <button type="button" class="btn btn-danger" onclick="p_btnLOVCATEGORYClick(this)">
        //                                    <i class="fa fa-search"></i>
        //                                </button>
        //                            </div>
        //                            <input type="text" class="form-control" name="txtCategoryDetail" readonly>
        //                            <input type="hidden" name="intMatrixRuleDetailIdDetail">
        //                        </div>
        //                    </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtCategoryDetail" readonly>
                                <input type="hidden" name="intMatrixRuleDetailIdDetail">
                            </div>`,
        //// 4. Grand Parent
        //`<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
        //                        <div class="input-group">
        //                            <div class="input-group-btn">
        //                                <button type="button" class="btn btn-danger" onclick="p_btnLOVGRANDPARENTClick(this)">
        //                                    <i class="fa fa-search"></i>
        //                                </button>
        //                            </div>
        //                            <input type="text" class="form-control" name="txtGrandParentDetail" readonly>
        //                        </div>
        //                    </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtGrandParentDetail" readonly>
                            </div>`,
        //// 5. Parent
        //`<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
        //                        <div class="input-group">
        //                            <div class="input-group-btn">
        //                                <button type="button" class="btn btn-danger" onclick="p_btnLOVPARENTClick(this)">
        //                                    <i class="fa fa-search"></i>
        //                                </button>
        //                            </div>
        //                            <input type="text" class="form-control" name="txtParentDetail" readonly>
        //                        </div>
        //                    </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <input type="text" class="form-control" name="txtParentDetail" readonly>
                            </div>`,
        // 6. RM Code
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <div class="input-group-btn">
                                        <button type="button" class="btn btn-danger" onclick="p_btnLOVRMCODEClick(this)">
                                            <i class="fa fa-search"></i>
                                        </button>
                                    </div>
                                    <input type="text" class="form-control" name="txtRMCodeDetail" readonly>
                                </div>
                            </div>`,
        // 7. RM Description
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtRMDescriptionDetail" readonly rows="3"></textarea>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <div class="input-group-btn">
                                        <button type="button" class="btn btn-danger" onclick="p_btnLOVBRANDClick(this)">
                                            <i class="fa fa-search"></i>
                                        </button>
                                    </div>
                                    <input type="text" class="form-control" name="txtBrandDetail"  readonly>
                                </div>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <div class="input-group-btn">
                                        <button type="button" class="btn btn-danger" onclick="p_btnLOVVARIANRASAClick(this)">
                                            <i class="fa fa-search"></i>
                                        </button>
                                    </div>
                                    <input type="text" class="form-control" name="txtVarianRasaDetail"  readonly>
                                </div>
                            </div>`,
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control integer-input" name="intMatrixRuleDetail" placeholder="0" oninput="formatInteger(this)">
                                </div>
                            </div>`,
        // 1. Delete button
        `<div style="text-align:center">
                                <i class="fas fa-trash fa-2x trash-icon" onclick="deleteRowVisualdata(this)"></i>
                            </div>`
    ];
    /*tableMatrixRuleDetail.order([[0, 'desc']]).draw();*/
    //// 1. Tambahkan row baru
    //tableMatrixRuleDetail.row.add(newRow).draw(false);
    //debugger;
    //// 2. Ambil index row terakhir (baris baru yang ditambahkan)
    //let newRowIndex = tableMatrixRuleDetail.rows().count() - 1;
    //let newRowNode = tableMatrixRuleDetail.row(newRowIndex).node();

    //// 3. Pindahkan row baru ke posisi paling atas (row pertama)
    //$(newRowNode).prependTo(tableMatrixRuleDetail.table().body());

    // ✅ Tambahkan row tanpa redraw penuh
    let rowNode = tableMatrixRuleDetail.row.add(newRow).node();

    // ✅ Pindahkan baris baru ke paling atas
    $(rowNode).prependTo(tableMatrixRuleDetail.table().body());

//    $(rowNode).find('input[name="intMatrixRuleDetail"]').focus();
}
// Event listener global untuk semua input di tableMatrixRuleDetail
$('#tableMatrixRuleDetail').on('input change', 'input, textarea, select', function () {
    // setiap kali user ketik, update attribute value biar DataTables cache tetap sama
    this.setAttribute('value', this.value);
});
function deleteRowVisualdata(data) {
    debugger;
    clsGlobal.getConfirmation("Delete this data?",
        function (result) {
            if (result == true) {
                debugger;
                tableMatrixRuleDetail.rows($(data).parent().parent().parent()).remove().draw();
            //    p_updateRangeFormula();
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

function formatInteger(input) {
    let value = input.value;
    debugger;
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

document.addEventListener('input', function (e) {
    if (e.target && e.target.classList.contains('integer-input')) {
        formatInteger(e.target);
    }
});

//$('#tableMatrixRuleDetail').on('input', '.integer-input', function () {
//    formatInteger(this);
//});
function p_ExportData() {
    clsGlobal.getConfirmation("Export Data?", function (result) {
        if (result === true) {
            debugger;

            $.ajax({
                type: "POST",
                url: "/MatrixRule/NPOIExportToExcelData",
                data: {
                    data: $("#txtHiddenObject").val(),
                    id: $("#id").val(),
                    __RequestVerificationToken: $('#FormMatrixRule input[name=__RequestVerificationToken]').val()

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

function p_ExportDataMorinaga() {
    clsGlobal.getConfirmation("Export Data Morinaga?", function (result) {
        if (result === true) {
            debugger;

            $.ajax({
                type: "POST",
                url: "/MatrixRule/NPOIExportToExcelDataMorinaga",
                data: {
                    data: $("#txtHiddenObject").val(),
                    id: $("#id").val(),
                    __RequestVerificationToken: $('#FormMatrixRule input[name=__RequestVerificationToken]').val()

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

function initMatrixRuleDataTable(colCount) {
    debugger;
    if ($.fn.DataTable.isDataTable('#tableMatrixRule')) {
        $('#tableMatrixRule').DataTable().clear().destroy();
        $('#tableMatrixRule tbody').empty();
    }

    const cols = Array.from({ length: colCount }, () => ({ defaultContent: "" }));

    tableMatrixRule = $('#tableMatrixRule').DataTable({
        "scrollX": true,
        "autoWidth": false,
        "paging": false,
        "searching": false,
        "info": false,
        "order": [],
        "columns": cols,
        "columnDefs": [
            {
                targets: "_all",
                render: function (data, type) {
                    if (type === "sort" || type === "filter") {
                        const $el = $("<div>").html(data || "");
                        const $inp = $el.find("input, textarea, select");
                        if ($inp.length) {
                            if ($inp.is("textarea")) return $inp.text() || "";
                            return $inp.attr("value") || $inp.val() || $inp.text() || "";
                        }
                        const m = /value="([^"]*)"/.exec(data || "");
                        if (m) return m[1];
                        const mta = /<textarea[^>]*>([\s\S]*?)<\/textarea>/.exec(data || "");
                        if (mta) return mta[1];
                        return $el.text().trim();
                    }
                    return data;
                }
            }
        ]
    });
}



function buildHeader(maxBrand) {
    let html = `
        <tr>
            <th>Counter</th>
            <th>Category</th>
            <th>Grand Parent</th>
            <th>Parent</th>
            <th>RM Code</th>
            <th>RM Description</th>
    `;
    for (let b = 1; b <= maxBrand; b++) {
        html += `<th>Brand ${b}</th>`;
    }
    html += `<th>Action</th></tr>`;
    $("#tableMatrixRule thead").html(html);

    // 6 kolom fixed + kolom brand + 1 action
    return 6 + maxBrand + 1;
}


var ProjectDetail = {
    DownloadTemplateRule: function () {
        $.ajax({
            type: "POST",
            url: "/MatrixRule/NPOIDowloadTemplate",
            data: {
                data: $("#txtHiddenObject").val(),
                __RequestVerificationToken: $('#FormMatrixRule input[name=__RequestVerificationToken]').val()

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
        formData.append("__RequestVerificationToken", $('#FormMatrixRule input[name=__RequestVerificationToken]').val());

        let file = $('#templateUploadNutriFact')[0].files[0];
        if (!file) {
            clsGlobal.swalWarning("Please select a file before upload");
            return;
        }
        formData.append("UploadNutriFact", file);

        $.ajax({
            type: "POST",
            url: "/MatrixRule/UploadTemplate",
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
                    //$("#txtBrandH").val(clsGlobal.parseToString(retDat.objData[0].txtBrand));
                    //$("#txtVarianRasaH").val(clsGlobal.parseToString(retDat.objData[0].txtVarianRasa));

                    //p_DataToUI(retDat.objData);
                    // kosongkan & render ulang tableMatrixRule
                    tableMatrixRule.clear().draw(false);
                    debugger;

                    //for (var i = 0; i < retDat.objData.length; i++) {
                    //    var d = retDat.objData[i];
                    //    counter++;

                    //    // kolom fix (Category, GrandParent, Parent, RM Code, RM Desc)
                    //    var rowData = [
                    //        counter,
                    //        `<input type="text" class="form-control" readonly value="${d.listMMatrixRuleDetail[0].txtCategory || ''}">`,
                    //        `<input type="text" class="form-control" readonly value="${d.listMMatrixRuleDetail[0].txtGrandParent || ''}">`,
                    //        `<input type="text" class="form-control" readonly value="${d.listMMatrixRuleDetail[0].txtParent || ''}">`,
                    //        `<input type="text" class="form-control" readonly value="${d.listMMatrixRuleDetail[0].txtRmcode || ''}">`,
                    //        `<textarea class="form-control" readonly rows="3">${d.listMMatrixRuleDetail[0].txtRmdesc || ''}</textarea>`
                    //    ];

                    //    // kolom Brand dinamis
                    //    for (var j = 0; j < d.listMMatrixRuleDetail.length; j++) {
                    //        var det = d.listMMatrixRuleDetail[j];
                    //        rowData.push(
                    //            `<input type="text" class="form-control" readonly value="${det.intMatrixRule || '-'}">`
                    //        );
                    //    }

                    //    // kolom Action
                    //    rowData.push(`
                    //        <div style="text-align:center">
                    //            <i class="fas fa-trash fa-2x trash-icon" onclick="deleteRowVisualdata(this)"></i>
                    //            <input type="hidden" name="intMatrixStructureDetailID" value="${d.listMMatrixRuleDetail[0].intMatrixStructureDetailID || ''}">
                    //        </div>
                    //    `);

                    //    tableMatrixRule.row.add(rowData).draw(false);
                    //}


                    for (var i = 0; i < retDat.objData.length; i++) {
                        var d = retDat.objData[i];
                        counter++;
                        tableMatrixRule.row.add([
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
                            // Brand
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <input type="text" class="form-control" name="txtVarianRasa" value="${d.listMMatrixRuleDetail[0].txtVarianRasa || ''}" readonly>
                        </div>`,
                            // MatrixRule
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <input type="text" class="form-control" name="intMatrixRule" value="${d.listMMatrixRuleDetail[0].intMatrixRule || ''}" readonly>
                        </div>`
                        //    // Action
                        //    `<div style="text-align:center">
                        //    <i class="fas fa-trash fa-2x trash-icon" onclick="deleteRowVisualdata(this)"></i>
                        //    <input type="hidden" name="intMatrixStructureDetailID" value="${d.listMMatrixRuleDetail[0].intMatrixStructureDetailID || ''}">
                        //</div>`
                        ]).draw(false);
                    }
                    $('#btnEdit').prop('disabled', false);
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

};

//function p_EditData() {
//    $('#modalDetail').modal('show');

//    // Reset table detail
//    tableMatrixRuleDetail.clear().draw(false);

//    let counter = 0; // buat nomor urut

//    // Ambil semua data dari tableMatrixRule
//    tableMatrixRule.rows().every(function () {
//        var $row = $(this.node());
//        var rowData = [];

//        counter++;
//        // Counter
//        rowData.push(counter);

//        // Category
//        rowData.push(`
//            <div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
//                <div class="input-group">
//                    <div class="input-group-btn">
//                        <button type="button" class="btn btn-danger" onclick="p_btnLOVCATEGORYClick(this)">
//                            <i class="fa fa-search"></i>
//                        </button>
//                    </div>
//                    <input type="text" class="form-control" name="txtCategoryDetail"
//                           value="${$row.find('input[name=txtCategory]').val() || ''}" readonly>
//                </div>
//            </div>`);

//        // Grand Parent
//        rowData.push(`
//            <div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
//                <div class="input-group">
//                    <div class="input-group-btn">
//                        <button type="button" class="btn btn-danger" onclick="p_btnLOVGRANDPARENTClick(this)">
//                            <i class="fa fa-search"></i>
//                        </button>
//                    </div>
//                    <input type="text" class="form-control" name="txtGrandParentDetail"
//                           value="${$row.find('input[name=txtGrandParent]').val() || ''}" readonly>
//                </div>
//            </div>`);

//        // Parent
//        rowData.push(`
//            <div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
//                <div class="input-group">
//                    <div class="input-group-btn">
//                        <button type="button" class="btn btn-danger" onclick="p_btnLOVPARENTClick(this)">
//                            <i class="fa fa-search"></i>
//                        </button>
//                    </div>
//                    <input type="text" class="form-control" name="txtParentDetail"
//                           value="${$row.find('input[name=txtParent]').val() || ''}" readonly>
//                </div>
//            </div>`);

//        // RM Code
//        rowData.push(`
//            <div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
//                <div class="input-group">
//                    <div class="input-group-btn">
//                        <button type="button" class="btn btn-danger" onclick="p_btnLOVRMCODEClick(this)">
//                            <i class="fa fa-search"></i>
//                        </button>
//                    </div>
//                    <input type="text" class="form-control" name="txtRMCodeDetail"
//                           value="${$row.find('input[name=txtRMCode]').val() || ''}" readonly>
//                </div>
//            </div>`);

//        // RM Description
//        rowData.push(`
//            <div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
//                <textarea class="form-control" name="txtRMDescriptionDetail" readonly rows="3">
//                    ${$row.find('textarea[name=txtRMDescription]').val() || ''}
//                </textarea>
//            </div>`);

//        // Brand
//        rowData.push(`
//             <div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
//                <div class="input-group">
//                    <div class="input-group-btn">
//                        <button type="button" class="btn btn-danger" onclick="p_btnLOVBRANDClick(this)">
//                            <i class="fa fa-search"></i>
//                        </button>
//                    </div>
//                    <input type="text" class="form-control" name="txtBrandDetail"
//                           value="${$row.find('input[name=txtBrand]').val() || ''}" readonly>
//                </div>
//            </div>`);

//        // Matrix Rule
//        rowData.push(`
//            <div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
//                <input type="text" class="form-control integer-input" name="intMatrixRuleDetail" oninput="formatInteger(this)"
//                       value="${$row.find('input[name=intMatrixRule]').val() || ''}" >
//            </div>`);

//        // Action
//        rowData.push(`
//            <div style="text-align:center">
//                <i class="fas fa-trash fa-2x trash-icon" onclick="deleteRowVisualdata(this)"></i>
//                <input type="hidden" name="intMatrixStructureDetailIDDetail"
//                       value="${$row.find('input[name=intMatrixStructureDetailID]').val() || ''}">
//            </div>`);

//        tableMatrixRuleDetail.row.add(rowData).draw(false);

//    });
//}

function p_EditData() {
    $('#modalDetail').modal('show');

    // Reset table detail
    tableMatrixRuleDetail.clear().draw(false);

    let counter = 0; // buat nomor urut

    // Ambil semua data dari tableMatrixRule
    tableMatrixRule.rows().every(function () {
        var $row = $(this.node());

        counter++;
        debugger;
        var aa = $row.find('input[name=intMatrixRuleDetailId]').val();
        tableMatrixRuleDetail.row.add([
            // 1. Counter
            `<input type="text" name="lineNoDetail" value="${counter}" readonly>`,
            //// 2. Hidden ID
            //`<input name="intMatrixRuleDetailIdDetail" value="${$row.find('input[name=intMatrixRuleDetailId]').val() || ''}">`,
            //// 2. Category
            //`<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            //    <div class="input-group">
            //        <div class="input-group-btn">
            //            <button type="button" class="btn btn-danger" onclick="p_btnLOVCATEGORYClick(this)">
            //                <i class="fa fa-search"></i>
            //            </button>
            //        </div>
            //        <input type="text" class="form-control" name="txtCategoryDetail"
            //               value="${$row.find('input[name=txtCategory]').val() || ''}" readonly>
            //        <input type="hidden" name="intMatrixRuleDetailIdDetail" value="${$row.find('input[name=intMatrixRuleDetailId]').val() || ''}">
            //    </div>
            //</div>`,
            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                <input type="text" class="form-control" name="txtCategoryDetail"
                           value="${$row.find('input[name=txtCategory]').val() || ''}" readonly>
                <input type="hidden" name="intMatrixRuleDetailIdDetail" value="${$row.find('input[name=intMatrixRuleDetailId]').val() || ''}">
            </div>`,

            //// 3. Grand Parent
            //`<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            //    <div class="input-group">
            //        <div class="input-group-btn">
            //            <button type="button" class="btn btn-danger" onclick="p_btnLOVGRANDPARENTClick(this)">
            //                <i class="fa fa-search"></i>
            //            </button>
            //        </div>
            //        <input type="text" class="form-control" name="txtGrandParentDetail"
            //               value="${$row.find('input[name=txtGrandParent]').val() || ''}" readonly>
            //    </div>
            //</div>`,
            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                <input type="text" class="form-control" name="txtGrandParentDetail"
                           value="${$row.find('input[name=txtGrandParent]').val() || ''}" readonly>
            </div>`,

            //// 4. Parent
            //`<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            //    <div class="input-group">
            //        <div class="input-group-btn">
            //            <button type="button" class="btn btn-danger" onclick="p_btnLOVPARENTClick(this)">
            //                <i class="fa fa-search"></i>
            //            </button>
            //        </div>
            //        <input type="text" class="form-control" name="txtParentDetail"
            //               value="${$row.find('input[name=txtParent]').val() || ''}" readonly>
            //    </div>
            //</div>`,
            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                <input type="text" class="form-control" name="txtParentDetail"
                           value="${$row.find('input[name=txtParent]').val() || ''}" readonly>
            </div>`,

            // 5. RM Code
            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                <div class="input-group">
                    <div class="input-group-btn">
                        <button type="button" class="btn btn-danger" onclick="p_btnLOVRMCODEClick(this)">
                            <i class="fa fa-search"></i>
                        </button>
                    </div>
                    <input type="text" class="form-control" name="txtRMCodeDetail" 
                           value="${$row.find('input[name=txtRMCode]').val() || ''}" readonly>
                </div>
            </div>`,

            // 6. RM Description
            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                <textarea class="form-control" name="txtRMDescriptionDetail" readonly rows="3">
                    ${$row.find('textarea[name=txtRMDescription]').val() || ''}
                </textarea>
            </div>`,

            // 7. Brand
            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                <div class="input-group">
                    <div class="input-group-btn">
                        <button type="button" class="btn btn-danger" onclick="p_btnLOVBRANDClick(this)">
                            <i class="fa fa-search"></i>
                        </button>
                    </div>
                    <input type="text" class="form-control" name="txtBrandDetail"
                           value="${$row.find('input[name=txtBrand]').val() || ''}" readonly>
                </div>
            </div>`,

            // 7. VarianRasa
            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                <div class="input-group">
                    <div class="input-group-btn">
                        <button type="button" class="btn btn-danger" onclick="p_btnLOVVARIANRASAClick(this)">
                            <i class="fa fa-search"></i>
                        </button>
                    </div>
                    <input type="text" class="form-control" name="txtVarianRasaDetail"
                           value="${$row.find('input[name=txtVarianRasa]').val() || ''}" readonly>
                </div>
            </div>`,

            // 8. Matrix Rule
            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                <input type="text" class="form-control integer-input" name="intMatrixRuleDetail"
                       oninput="formatInteger(this)"
                       value="${$row.find('input[name=intMatrixRule]').val() || ''}">
            </div>`,

            // 9. Action
            `<div style="text-align:center">
                <i class="fas fa-trash fa-2x trash-icon" onclick="deleteRowVisualdata(this)"></i>
            </div>`
        ]).draw(false);

    });
}

$('#modalDetail').on('shown.bs.modal', function () {
    tableMatrixRuleDetail.columns.adjust().draw(false);
});

$('#modalViewDetail').on('shown.bs.modal', function () {
    tableMatrixRuleViewDetail.columns.adjust().draw(false);
    if (window.tableMatrixRuleViewDetail) {
        window.tableMatrixRuleViewDetail.fixedHeader.adjust();
    }
});

$('#modalReason').on('shown.bs.modal', function () {
    tableReason.columns.adjust().draw(false);
});
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

function showSuccessReasonPopup(message) {
    $("#modalSuccessReasonBody").html(message || "Insert Reason Success.");
    $("#modalSuccessReason").modal("show");
}

//=======================
// HANDLER
//=======================

function p_btnLOVBRANDClick(btn) {
    try {
        currentBrandInput = $(btn).closest('.input-group').find('input[name="txtBrandDetail"]');
        LOV = clsGlobal.generateLOV("MATRIX_BRAND_VARIANRASA", "txtBrand");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVVARIANRASAClick(btn) {
    try {
        debugger;
        const group = $(btn).closest('tr'); // baris saat ini
        currentRow = $(btn).closest('tr'); // simpan baris saat ini
        currentVarianRasaInput = group.find('input[name="txtVarianRasaDetail"]');

        let brand = currentRow.find('input[name="txtBrandDetail"]').val();

        currentRow = null; // reset

        LOV = clsGlobal.generateLOV("MATRIX_VARIAN_RASA_MASTER", "txtVarianRasa", brand);
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};
function p_btnLOVCATEGORYClick(btn) {
    try {
        currentCategoryInput = $(btn).closest('.input-group').find('input[name="txtCategoryDetail"]');
        LOV = clsGlobal.generateLOV("MATRIX_CATEGORY", "txtCategory");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};
function p_btnLOVGRANDPARENTClick(btn) {
    try {
        currentGrandParentInput = $(btn).closest('.input-group').find('input[name="txtGrandParentDetail"]');
        LOV = clsGlobal.generateLOV("MATRIX_GRANDPARENT", "txtGrandParent");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVPARENTClick(btn) {
    try {
        currentParentInput = $(btn).closest('.input-group').find('input[name="txtParentDetail"]');
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
        debugger;
        //currentRMCodeInput = $(btn).closest('.input-group').find('input[name="txtRMCode"]');
        currentRMCodeInput = group.find('input[name="txtRMCodeDetail"]');

        currentRMDescription = group.find('textarea[name="txtRMDescriptionDetail"]');
        currentCategoryInput = group.find('input[name="txtCategoryDetail"]');
        currentGrandParentInput = group.find('input[name="txtGrandParentDetail"]');
        currentParentInput = group.find('input[name="txtParentDetail"]');

        //currentPrimaryUOM = group.find('input[name="txtPrimaryUom"]');
        LOV = clsGlobal.generateLOV("MATRIX_RMCODEITEMMAPPINGMRU", "txtRMCode");
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
        LOV = clsGlobal.generateLOV("COPYFROM_MRU", "COPYFROM_MRU");
        //    $("#modalCopyFrom").modal("show");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_COPYFROMMRU() {
    clsGlobal.showLoading();
    var intNoCopy = $("#intNoCopy").val();
    debugger;
    $.ajax({
        type: "POST",
        url: "/MatrixRule/GetDataCopy",
        data: { intNoCopy: intNoCopy, __RequestVerificationToken: $('#FormMatrixRule input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    debugger;

                    tableMatrixRule.clear().draw(false);

                    for (var i = 0; i < retDat.objData.listMMatrixRuleDetail.length; i++) {
                        var d = retDat.objData.listMMatrixRuleDetail[i];
                        counter++;
                        tableMatrixRule.row.add([
                            counter,
                            //// 2. Hidden ID
                            //`<input name="intMatrixRuleDetailId" value="${d.intMatrixRuleDetailId || ''}">`,
                            // Category
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <input type="text" class="form-control" name="txtCategory" value="${d.txtCategory || ''}" readonly>
                            <input type="hidden" name="intMatrixRuleDetailId">
                        </div>`,
                            // Grand Parent
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <input type="text" class="form-control" name="txtGrandParent" value="${d.txtGrandParent || ''}" readonly>
                        </div>`,
                            // Parent
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <input type="text" class="form-control" name="txtParent" value="${d.txtParent || ''}" readonly>
                        </div>`,
                            // RM Code
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                             <input type="text" class="form-control" name="txtRMCode" value="${d.txtRmcode || ''}" readonly>
                        </div>`,
                            // RM Description
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <textarea class="form-control" name="txtRMDescription" readonly rows="3">${d.txtRmdesc || ''}</textarea>
                        </div>`,
                            // Brand
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <input type="text" class="form-control" name="txtBrand" value="${d.txtBrand || ''}" readonly>
                        </div>`,
                            // Vrian
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <input type="text" class="form-control" name="txtVarianRasa" value="${d.txtVarianRasa || ''}" readonly>
                        </div>`,
                            // MatrixRule
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                            <input type="text" class="form-control" name="intMatrixRule" value="${d.intMatrixRule || ''}" readonly>
                        </div>`,
                            // Action
                            `<div style="text-align:center">
                            <i class="fas fa-trash fa-2x trash-icon" onclick="deleteRowVisualdata(this)"></i>
                        </div>`
                        ]).draw(false);
                    }

                    // --- isi tableReason ---
                    debugger;
                    if (retDat.objData.listMMatrixRuleReason && retDat.objData.listMMatrixRuleReason.length > 0) {
                        tableReason.clear().draw(false);

                        retDat.objData.listMMatrixRuleReason.forEach(function (r) {
                            var eff = r.dtmEffectiveDate && moment(r.dtmEffectiveDate).isValid()
                                ? moment(r.dtmEffectiveDate).format("DD/MM/YYYY")
                                : "";

                            // gunakan input text supaya tampil konsisten DD/MM/YYYY
                            var node = tableReason.row.add([
                                `<input type="hidden" name="intMatrixRuleReasonID">` +
                                `<input type="text" class="form-control" name="txtDocNoReason" value="${r.txtDocNo || ''}" readonly>`,
                                `<input type="text" class="form-control dtmEffectiveDateReason" name="dtmEffectiveDateReason" value="${eff}" readonly>`,
                                `<textarea class="form-control" name="txtReason" rows="2" readonly>${r.txtReason || ''}</textarea>`
                            ]).draw(false).node();


                            // tandai sebagai copy-row agar tidak terhapus nanti
                            $(node).addClass("copy-row");
                        });
                    }
                    hasCopyData = true;
                    //p_updateRangeFormula();
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

    var data = {
        intMatrixRuleId: $("#id").val(),
        txtStatus: $("#ddlToStatus").val(),
        txtNote: $("#txtNote").val(),

    };

    $.ajax({
        type: "POST",
        url: "/MatrixRule/ChangeStatus",
        data: { data: JSON.stringify(data), __RequestVerificationToken: $('#FormMatrixRule input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                debugger;
                $("#modalChangeStatus").modal("hide");
                //        showSuccessStatusPopup("Update Status Success!");
                //    clsGlobal.swalSuccessSaveOrSubmit(retDat.txtMessage, window.detailUrl + '?id=' + retDat.objData.id);
                showSuccessStatusPopup("Update Status Success!", retDat.objData.txtMatrixRuleId);
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

function p_SAVEReason() {
    clsGlobal.showLoading();

    // Generate JSON ke hidden input
    p_UIToDataListReason();
    p_UIToDataReason();

    const formData = new FormData();
    formData.append("data", $("#txtHiddenObject").val()); // ganti ke benar
    formData.append("__RequestVerificationToken", $('#FormMatrixRuleDetail input[name=__RequestVerificationToken]').val());

    $.ajax({
        type: "POST",
        url: "/MatrixRule/SaveReason",
        data: formData,
        processData: false,   // penting kalau pakai FormData
        contentType: false,   // penting kalau pakai FormData
        dataType: "json",     // biar auto parse JSON
        success: function (retDat) {
            if (retDat.bitSuccess === true) {
                $("#modalReason").modal("hide");
                showSuccessReasonPopup("Insert Reason Success!", retDat.objData.txtMatrixRuleId);
            } else {
                clsGlobal.getAlert(retDat.message);
            }
            clsGlobal.hideLoading();
        },
        error: function (xhr) {
            clsGlobal.hideLoading();
            clsGlobal.getAlert("Error saving reason: " + xhr.responseText);
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
            url: "/MatrixRule/GetMatrixRuleHistory",
            data: { headerId: headerId, __RequestVerificationToken: $('#FormMatrixRule input[name=__RequestVerificationToken]').val() },
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

function p_btnReason() {
    try {
        var headerId = $("#id").val();
        // Show modal
        $("#modalReason").modal("show");

        var table = $("#tableReason").DataTable();

        // Hapus hanya baris yang berasal dari fetch sebelumnya (fetched-reason) dan dummy
        // biarkan copy-row tetap ada
        if (table.rows('.fetched-reason, .dummy-reason').any()) {
            table.rows('.fetched-reason, .dummy-reason').remove().draw(false);
        }

        // Ambil currentDocNo untuk pengecekan
        let currentDocNo = $("#txtDocNo").val();

        // Cek apakah ada copy-row yg punya docno sama (agar kita bisa ubah row copy jadi editable nanti)
        let copyHasSameDoc = false;
        $('#tableReason tbody tr.copy-row').each(function () {
            var v = $(this).find('input[name="txtDocNoReason"]').val();
            if (v === currentDocNo) copyHasSameDoc = true;
        });

        // Panggil API untuk ambil history
        $.ajax({
            type: "POST",
            url: "/MatrixRule/GetMatrixRuleReason",
            data: { headerId: headerId, __RequestVerificationToken: $('#FormMatrixRule input[name=__RequestVerificationToken]').val() },
            datatype: "json",
            success: function (data) {
                debugger;
                if (data && data.length > 0) {
                    let existSameDocNo = false;

                    data.forEach(function (row) {
                        var eff = row.dtmEffectiveDate && moment(row.dtmEffectiveDate).isValid()
                            ? moment(row.dtmEffectiveDate).format("DD/MM/YYYY")
                            : "";

                        if (row.txtDocNo === currentDocNo) {
                            existSameDocNo = true;

                            // Jika ada copy-row dengan docno yang sama -> update copy-row: make Reason editable & sync date
                            let updatedCopy = false;
                            $('#tableReason tbody tr.copy-row').each(function () {
                                var $tr = $(this);
                                var valDoc = $tr.find('input[name="txtDocNoReason"]').val();
                                if (valDoc === row.txtDocNo) {
                                    // set effective date (text input) dan make textarea editable (jika ada)
                                    $tr.find('.dtmEffectiveDateReason').val(eff);

                                    let $ta = $tr.find('textarea[name="txtReason"]');
                                    if ($ta.length) {
                                        $ta.prop('readonly', false).val(row.txtReason || "");
                                    } else {
                                        // jika sebelumnya tidak ada textarea, ganti kolom ke textarea
                                        $tr.find('td').eq(2).html(
                                            `<textarea class="form-control" name="txtReason" placeholder="Input reason here...">${row.txtReason || ""}</textarea>`
                                        );
                                    }
                                    updatedCopy = true;
                                    return false; // break each
                                }
                            });

                            // jika tidak ada copy-row yg matching, tambahkan row hasil fetch (editable)
                            if (!updatedCopy) {
                                var newNode = table.row.add([
                                    `<input type="text" class="form-control" name="txtDocNoReason" value="${row.txtDocNo || ''}" readonly>`,
                                    `<input type="text" class="form-control dtmEffectiveDateReason" name="dtmEffectiveDateReason" value="${eff}" readonly>`,
                                    `<textarea class="form-control" name="txtReason" placeholder="Input reason here...">${row.txtReason || ""}</textarea>`
                                ]).draw(false).node();
                                $(newNode).addClass('fetched-reason');
                            }
                        } else {
                            // Tambah hasil fetch lain (readonly reason)
                            var node = table.row.add([
                                `<input type="text" class="form-control" name="txtDocNoReason" value="${row.txtDocNo || ''}" readonly>`,
                                `<input type="text" class="form-control dtmEffectiveDateReason" name="dtmEffectiveDateReason" value="${eff}" readonly>`,
                                `<textarea class="form-control" name="txtReason" readonly>${row.txtReason || ""}</textarea>`
                            ]).draw(false).node();
                            $(node).addClass('fetched-reason');
                        }
                    });

                    // Jika tidak ada row existing untuk currentDocNo (baik dari fetch maupun copy),
                    // tambahkan satu dummy editable (hanya jika belum ada dummy)
                    if (!existSameDocNo && !copyHasSameDoc && !table.row('.dummy-reason').any()) {
                        var hdrEff = moment($("#dtmEffectiveDate").val()).isValid()
                            ? moment($("#dtmEffectiveDate").val()).format("DD/MM/YYYY")
                            : "";
                        var node = table.row.add([
                            `<input type="text" class="form-control" name="txtDocNoReason" value="${currentDocNo || ''}" readonly>`,
                            `<input type="text" class="form-control dtmEffectiveDateReason" name="dtmEffectiveDateReason" value="${hdrEff}" readonly>`,
                            `<textarea class="form-control" name="txtReason" placeholder="Input reason here..."></textarea>`
                        ]).draw(false).node();
                        $(node).addClass('dummy-reason');
                    }
                } else {
                    // jika server tidak mengembalikan data, tetap pastikan ada 1 dummy jika memang belum ada
                    if (!table.row('.dummy-reason').any() && !copyHasSameDoc) {
                        var hdrEff2 = moment($("#dtmEffectiveDate").val()).isValid()
                            ? moment($("#dtmEffectiveDate").val()).format("DD/MM/YYYY")
                            : "";
                        var node2 = table.row.add([
                            `<input type="text" class="form-control" name="txtDocNoReason" value="${currentDocNo || ''}" readonly>`,
                            `<input type="text" class="form-control dtmEffectiveDateReason" name="dtmEffectiveDateReason" value="${hdrEff2}" readonly>`,
                            `<textarea class="form-control" name="txtReason" placeholder="Input reason here..."></textarea>`
                        ]).draw(false).node();
                        $(node2).addClass('dummy-reason');
                    }
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
$('#btnSave').click(function () {
    debugger;
    const isEdit = parseInt($("#id").val()) > 0; // boolean: true or false
    const actionText = isEdit ? "update" : "save";
    showSaveConfirmation(actionText, isEdit);
});

$('#btnSaveDetail').click(function () {
    debugger;
    const isEdit = parseInt($("#id").val()) > 0; // boolean: true or false
    const actionText = isEdit ? "update" : "save";
    showSaveConfirmationDetail(actionText, isEdit);
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

function showSaveConfirmationDetail(actionText, isEdit) {
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
            saveDataDetail(isEdit);
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
    p_UIToDataListReason();
    p_UIToDataList();
    p_UIToData();

    const url = isEdit ? window.updateUrl : window.saveUrl;
    debugger;

    // Buat FormData untuk kirim file + data JSON
    const formData = new FormData();
    formData.append("data", $("#txtHiddenObject").val());
    formData.append("__RequestVerificationToken", $('#FormMatrixRuleDetail input[name=__RequestVerificationToken]').val());


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
                clsGlobal.swalSuccessSaveOrSubmit(retDat.txtMessage, window.detailUrl + "?id=" + retDat.objData.txtMatrixRuleId);
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
function saveDataDetail(isEdit) {
    debugger;
    //if (!validateForm()) {
    //    return;
    //}

    p_UIToDataListDetail();
    p_UIToDataDetail();

    const url = isEdit ? window.updateUrl : window.saveUrl;
    debugger;

    // Buat FormData untuk kirim file + data JSON
    const formData = new FormData();
    formData.append("data", $("#txtHiddenObject").val());
    formData.append("__RequestVerificationToken", $('#FormMatrixRuleDetail input[name=__RequestVerificationToken]').val());


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
                clsGlobal.swalSuccessSaveOrSubmit(retDat.txtMessage, window.detailUrl + "?id=" + retDat.objData.txtMatrixRuleId);
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
    formData.append("__RequestVerificationToken", $('#FormMatrixRuleDetail input[name=__RequestVerificationToken]').val());


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
    ProjectDetail.DownloadTemplateRule();
});

$('#btnUploadNutFact').on('click', function (e) {
    e.preventDefault();

    ProjectDetail.UploadTemplateRule();

    $("#templateUploadNutriFact").val(null);
});

// Handler klik OK: baru redirect
$(document).on("click", "#btnSuccessStatusOk", function () {
    debugger;
    var id = $("#txtMatrixRuleId").val();
    if (id) {
        window.location.href = window.detailUrl + "?id=" + id;
    } else {
        $("#modalSuccessStatus").modal("hide");
    }
});

$(document).on("click", "#btnSuccessReasonOk", function () {
    debugger;
    var id = $("#txtMatrixRuleId").val();
    if (id) {
        window.location.href = window.detailUrl + "?id=" + id;
    } else {
        $("#modalSuccessReason").modal("hide");
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

function p_ViewDetail() {
    console.clear();
    console.log("p_ViewDetail() called");

    var data = tableMatrixRule.rows().data().toArray();
    console.log("source rows:", data.length, data);
    if (!data || data.length === 0) {
        alert("Tidak ada data di tabel.");
        return;
    }

    // helper: ambil value dari HTML string (input, textarea, regex fallback, atau text)
    function extractValue(html) {
        if (!html) return "";
        var $el = $("<div>").html(html);
        var $input = $el.find("input");
        if ($input.length) {
            var v = $input.attr("value") || $input.val() || $input.prop("value");
            if (v !== undefined && v !== null && String(v).trim() !== "") return String(v).trim();
        }
        var $textarea = $el.find("textarea");
        if ($textarea.length) {
            var t = $textarea.text();
            if (t !== undefined && t !== null) return String(t).trim();
        }
        // fallback: parse value="..."
        var m = /value\s*=\s*"(.*?)"/.exec(html);
        if (m && m[1]) return m[1].trim();
        // last fallback: plain text
        return $el.text().trim();
    }

    var brands = [];
    var grouped = {}; // key -> {category, grandParent, parent, rmCode, rmDesc, brandValues: {} }

    for (var i = 0; i < data.length; i++) {
        var row = data[i];

        // sesuai urutan row.add
        var category = extractValue(row[1]);
        var grandParent = extractValue(row[2]);
        var parent = extractValue(row[3]);
        var rmCode = extractValue(row[4]);
        var rmDesc = extractValue(row[5]);
        var brand = extractValue(row[6]);
        var matrixRule = extractValue(row[8]);

        console.log("row", i, { category, grandParent, parent, rmCode, rmDesc, brand, matrixRule });

        // add brand unik
        if (brand && brands.indexOf(brand) === -1) brands.push(brand);

        // grup by key (gabungkan fields unik)
        var key = [category, grandParent, parent, rmCode, rmDesc].join("|||");
        if (!grouped[key]) {
            grouped[key] = {
                category: category,
                grandParent: grandParent,
                parent: parent,
                rmCode: rmCode,
                rmDesc: rmDesc,
                brandValues: {}
            };
        }
        grouped[key].brandValues[brand] = matrixRule;
    }

    // urutkan brands: Brand 1, Brand 2 dst (jika ada angka di akhir), kalau tidak alfabet
    brands.sort(function (a, b) {
        var numA = parseInt(a.match(/\d+$/)?.[0] || 0, 10);
        var numB = parseInt(b.match(/\d+$/)?.[0] || 0, 10);

        if (!isNaN(numA) && !isNaN(numB) && (numA !== 0 || numB !== 0)) {
            return numA - numB;
        }
        return a.localeCompare(b);
    });

    console.log("brands sorted:", brands);

    // build header (5 fixed + dynamic brand cols)
    var headerCols = [
        "<th>Category</th>",
        "<th>Grand Parent</th>",
        "<th>Parent</th>",
        "<th>RM Code</th>",
        "<th>RM Description</th>"
    ];
    brands.forEach(b => headerCols.push("<th>" + $('<div>').text(b).html() + "</th>"));
    var theadHtml = "<tr>" + headerCols.join("") + "</tr>";

    // build tbody
    var tbodyRows = [];
    Object.keys(grouped).forEach(function (k) {
        var it = grouped[k];
        var tds = [];
        tds.push("<td>" + $('<div>').text(it.category).html() + "</td>");
        tds.push("<td>" + $('<div>').text(it.grandParent).html() + "</td>");
        tds.push("<td>" + $('<div>').text(it.parent).html() + "</td>");
        tds.push("<td>" + $('<div>').text(it.rmCode).html() + "</td>");
        tds.push("<td>" + $('<div>').text(it.rmDesc).html() + "</td>");
        brands.forEach(function (b) {
            var val = it.brandValues[b] || "";
            tds.push("<td>" + $('<div>').text(val).html() + "</td>");
        });
        tbodyRows.push("<tr>" + tds.join("") + "</tr>");
    });
    var tbodyHtml = tbodyRows.join("");

    // destroy & recreate table
    var $modalBody = $("#modalViewDetail .modal-body");
    $modalBody.find("#tableMatrixRuleViewDetail").each(function () {
        if ($.fn.DataTable.isDataTable(this)) {
            try { $(this).DataTable().clear().destroy(); } catch (e) { console.warn("destroy failed:", e); }
        }
        $(this).remove();
    });

    var newTableHtml = '<table id="tableMatrixRuleViewDetail" class="table table-striped table-bordered" style="width:100%">' +
        '<thead>' + theadHtml + '</thead>' +
        '<tbody>' + tbodyHtml + '</tbody>' +
        '</table>';
    $modalBody.append(newTableHtml);

    // init DataTable
    if (window.tableMatrixRuleViewDetail && $.fn.DataTable.isDataTable("#tableMatrixRuleViewDetail")) {
        try { window.tableMatrixRuleViewDetail.clear().destroy(); } catch (e) { /* ignore */ }
    }
    window.tableMatrixRuleViewDetail = $("#tableMatrixRuleViewDetail").DataTable({
        scrollX: true,
        scrollY: "500px",
        scrollCollapse: true,
        renderer: "bootstrap",
        processing: true,
        bAutoWidth: false,
        paging: true,
        aLengthMenu: [[-1, 5, 10, 100], ["ALL", 5, 10, 100]],
        fixedHeader: true,
        fixedColumns: { left: 3 }, // sama kaya tableMatrixRule
        order: [
            [0, "asc"], // Category
            [1, "asc"], // Grand Parent
            [2, "asc"], // Parent
            [3, "asc"]  // RM Code
        ],
        columnDefs: [
            {
                targets: "_all",
                render: function (data, type, row, meta) {
                    if (type === "sort" || type === "filter") {
                        var $el = $("<div>").html(data || "");
                        var input = $el.find("input, textarea, select");
                        if (input.length > 0) {
                            if (input.is("input") || input.is("select")) {
                                return input.attr("value") || input.val() || input.text() || "";
                            }
                            if (input.is("textarea")) {
                                return input.text() || "";
                            }
                        }
                        var m = /value="([^"]*)"/.exec(data);
                        if (m) return m[1];
                        var mta = /<textarea[^>]*>([\s\S]*?)<\/textarea>/.exec(data);
                        if (mta) return mta[1];
                        return $el.text().trim();
                    }
                    return data;
                }
            },
        //    { "visible": false, "targets": [0] }
        ]
    });


    // tampilkan modal
    $("#modalViewDetail").modal("show");
    console.log("tableMatrixRuleViewDetail rows:", $("#tableMatrixRuleViewDetail tbody tr").length);
}

$('#btnCancel').on('click', function () {
    try {
        // Tutup modal
        $('#modalDetail').modal('hide');

        // Bersihkan tabel detail
        let table = $('#tableMatrixRuleDetail').DataTable();
        table.clear().draw(false);


        // Opsional: Bersihkan hidden GUID atau flag lain
        $('#txtGUID').val('');
        $('#txtHiddenObject').val('');
        $('#txtHiddenObjectList').val('');

    } catch (ex) {
        console.error("Cancel Error:", ex);
    }
});

$('#btnCancelReason').on('click', function () {
    try {
        // Tutup modal
        $('#modalReason').modal('hide');

        // Bersihkan tabel detail
        let table = $('#tableReason').DataTable();
        table.clear().draw(false);


        // Opsional: Bersihkan hidden GUID atau flag lain
        $('#txtGUID').val('');
        $('#txtHiddenObject').val('');
        $('#txtHiddenObjectList').val('');

    } catch (ex) {
        console.error("Cancel Error:", ex);
    }
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
    $('#btnEdit').addClass('d-none');
    /*$('#btnReason').prop('disabled', true);  // disable*/
    $('#btnCancelReason').addClass('d-none');
    $('#btnSaveReason').addClass('d-none');
    //$('#dtmEffectiveDate').prop('readonly', true); // disable
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
    window.location.href = base_path + `/MatrixRule/Detail`;
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
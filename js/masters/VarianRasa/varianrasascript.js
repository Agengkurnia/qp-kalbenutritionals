//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
let lineCounter = 1;
let currentCategoryInput = null;
let currentGrandParentInput = null;
let currentParentInput = null;
let currentGroupInput = null;
let currentRMCodeInput = null;
let currentUOMInput = null;
let currentRMDescription = null;
let currentPrimaryUOM = null;
let currentBrandCodeMorinagaInput = null;

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    p_InitForm();


});

function p_InitForm() {
    p_initiateData();

}

var tableVarianRasa = $("#tableVarianRasa").DataTable({
    "scrollX": true,
    "scrollY": "500px",
    "fixedHeader": true,
    "scrollCollapse": true,
    renderer: "bootstrap",
    "processing": true,
    "bAutoWidth": false,
    "paging": true,
    "order": [[3, "asc"], [4, "asc"], [5, "asc"], [6, "asc"]],
    "aLengthMenu": [[-1, 5, 10, 100], ["ALL", 5, 10, 100]],
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
        { "visible": false, "targets": [2] },
    ]
})

$(window).on('resize', function () {
    tableVarianRasa.columns.adjust().draw(false);
});
function setChooseLOV(txtValue) {
    var arr = txtValue.split('|');

    debugger;

    switch (arr[0]) {
        case "txtGroup":
            //$("#txtGroup").val(arr[1]);
            p_txtGroup_TextChanged(arr[2]);
            break;
        case "txtBrand":
            //$("#txtGroup").val(arr[1]);
            p_txtBrand_TextChanged(arr[2]);
            break;
        case "txtVarianRasa":
            //$("#txtGroup").val(arr[1]);
            p_txtVarianRasa_TextChanged(arr[2]);
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

        case "txtBrandCodeMorinaga":
            //$("#txtGroup").val(arr[1]);
            p_txtBrandCodeMorinaga_TextChanged(arr[3]);
            break;
    }
    clsGlobal.closeLOV();
}

function p_initiateData() {
    debugger;
    clsGlobal.showLoading();

    $.ajax({
        type: "POST",
        url: "/VarianRasa/InitiateData",
        data: {
            __RequestVerificationToken: $('#frmVarianRasa input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    debugger;
                    $("#txtHiddenObject").val(JSON.stringify(retDat.objData));

                    p_DataToUI(retDat.objData);

                    tableVarianRasa.clear().draw(false);

                    // Hitung total data dulu agar bisa pakai descending LineNo
                    let totalData = retDat.objData.length;
                    let lineNo = totalData;

                    for (var i = 0; i < retDat.objData.length; i++) {
                        var d = retDat.objData[i];

                        tableVarianRasa.row.add([
                            // 1. Delete button
                            `<div style="text-align:center">
                                <i class="fas fa-trash fa-2x trash-icon" onclick="deleteRowdata(this)"></i>
                                <input type="hidden" name="intVarianRasaId" value="${d.intVarianRasaId || ''}">
                            </div>`,

                            // 2. Hidden ID
                            `<input type="hidden" name="intVarianRasaId" value="${d.intVarianRasaId || ''}">`,

                            // 3. LineNo (descending)
                            `<input type="text" name="lineNo" value="${lineNo--}" readonly>`,

                            // 4. Group
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <div class="input-group-btn">
                                        <button type="button" class="btn btn-danger" onclick="p_btnLOVGROUPVARIANTClick(this)">
                                            <i class="fa fa-search"></i>
                                        </button>
                                    </div>
                                    <input type="text" class="form-control" name="txtGroup" value="${d.txtGroup || ''}" readonly>
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
                                    <input type="text" class="form-control" name="txtBrand" value="${d.txtBrand || ''}" readonly>
                                </div>
                            </div>`,

                            // 6. Parent
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <div class="input-group-btn">
                                        <button type="button" class="btn btn-danger" onclick="p_btnLOVVARIANRASAClick(this)">
                                            <i class="fa fa-search"></i>
                                        </button>
                                    </div>
                                    <input type="text" class="form-control" name="txtVarianRasa" value="${d.txtVarianRasa || ''}" readonly>
                                </div>
                            </div>`,

                            // 7. RM Code
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <div class="input-group-btn">
                                        <button type="button" class="btn btn-danger" onclick="p_btnLOVRMCODEClick(this)">
                                            <i class="fa fa-search"></i>
                                        </button>
                                    </div>
                                    <input type="text" class="form-control" name="txtItemEPMCode" value="${d.txtItemEpmcode || ''}" readonly>
                                </div>
                            </div>`,

                            // 8. RM Description
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <textarea class="form-control" name="txtItemEPMDesc" readonly rows="3">${d.txtItemEpmdesc || ''}</textarea>
                            </div>`,

                            // 9. Code Morinaga
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <div class="input-group-btn">
                                        <button type="button" class="btn btn-danger" onclick="p_btnLOVCODEMORINAGAClick(this)">
                                            <i class="fa fa-search"></i>
                                        </button>
                                    </div>
                                    <input type="text" class="form-control" name="txtBrandCodeMorinaga" value="${d.txtBrandCodeMorinaga || ''}" readonly>
                                </div>
                            </div>`,
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
}



function p_DataToUI(objData) {
    debugger;

    tableVarianRasa.clear().draw(false);

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
        jsonData.MVarianRasaList = JSON.parse(listJSON);
    } else {
        jsonData.MVarianRasaList = [];
    }

    $("#txtHiddenObject").val(JSON.stringify(jsonData));

    var ho = $("#txtHiddenObject").val(); // sekarang seharusnya berisi MItemMappingList
    var dt = $("#txtHiddenObjectList").val();
}

function p_UIToDataList() {
    debugger;

    var jsonArray = "[";
    var table = $("#tableVarianRasa").DataTable(); // ambil instance DataTable
    let validRowCount = 0;

    table.rows().every(function () {
        var $row = $(this.node());

        // Abaikan baris placeholder "No data available"
        if ($row.hasClass("dataTables_empty") || $row.text().trim() === "No data available in table") {
            return;
        }

        // Ambil nilai dari setiap kolom
        let idVal = $row.find('input[name="intVarianRasaId"]').val();
        let intVarianRasaId = '"intVarianRasaId" : ' + (idVal ? `"${idVal}"` : 0);
        let txtGroup = '"txtGroup" : "' + ($row.find('input[name="txtGroup"]').val() || "") + '"';
        let txtBrand = '"txtBrand" : "' + ($row.find('input[name="txtBrand"]').val() || "") + '"';
        let txtVarianRasa = '"txtVarianRasa" : "' + ($row.find('input[name="txtVarianRasa"]').val() || "") + '"';
        let txtItemEPMCode = '"txtItemEPMCode" : "' + ($row.find('input[name="txtItemEPMCode"]').val() || "") + '"';
        let txtItemEPMDesc = '"txtItemEPMDesc" : "' + ($row.find('textarea[name="txtItemEPMDesc"]').val() || "") + '"';
        let txtBrandCodeMorinaga = '"txtBrandCodeMorinaga" : "' + ($row.find('input[name="txtBrandCodeMorinaga"]').val() || "") + '"';

        let jsonObj = "{" +
            intVarianRasaId + "," +
            txtGroup + "," +
            txtBrand + "," +
            txtVarianRasa + "," +
            txtItemEPMCode + "," +
            txtItemEPMDesc + "," +
            txtBrandCodeMorinaga +
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

//    const $rows = $("#tableVarianRasa tbody tr");

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
//        let idVal = $row.find('input[name="intVarianRasaId"]').val();
//        let intVarianRasaId = '"intVarianRasaId" : ' + (idVal ? `"${idVal}"` : 0);
//        let txtGroup = '"txtGroup" : "' + ($row.find('input[name="txtGroup"]').val() || "") + '"';
//        let txtBrand = '"txtBrand" : "' + ($row.find('input[name="txtBrand"]').val() || "") + '"';
//        let txtVarianRasa = '"txtVarianRasa" : "' + ($row.find('input[name="txtVarianRasa"]').val() || "") + '"';
//        let txtItemEPMCode = '"txtItemEPMCode" : "' + ($row.find('input[name="txtItemEPMCode"]').val() || "") + '"';
//        let txtItemEPMDesc = '"txtItemEPMDesc" : "' + ($row.find('textarea[name="txtItemEPMDesc"]').val() || "") + '"';
//        let txtBrandCodeMorinaga = '"txtBrandCodeMorinaga" : "' + ($row.find('input[name="txtBrandCodeMorinaga"]').val() || "") + '"';
        

//        let jsonObj = "{" +
//            intVarianRasaId + "," +
//            txtGroup + "," +
//            txtBrand + "," +
//            txtVarianRasa + "," +
//            txtItemEPMCode + "," +
//            txtItemEPMDesc + "," +
//            txtBrandCodeMorinaga + 
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
    tableVarianRasa.row.add([
        // 1. Action column
        `<div style="text-align:center">
            <i class="fas fa-trash fa-2x trash-icon" onclick="deleteRowdata(this)"></i>
        </div>`,

        // 2. Id (hidden)
        `<input type="hidden" name="intVarianRasaId" value="">`,

        // 3. Line No (running number)
        `<input type="text" name="lineNo" value="${lineCounter++}" readonly>`,  // 🟢 Tambah running number

        // 4. Group
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <div class="input-group">
                <div class="input-group-btn">
                    <button type="button" class="btn btn-danger" onclick="p_btnLOVGROUPVARIANTClick(this)">
                        <i class="fa fa-search"></i>
                    </button>
                </div>
                <input type="text" class="form-control" name="txtGroup" readonly>
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

        // 7. Item EPM Code
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <div class="input-group">
                <div class="input-group-btn">
                    <button type="button" class="btn btn-danger" onclick="p_btnLOVRMCODEClick(this)">
                        <i class="fa fa-search"></i>
                    </button>
                </div>
                <input type="text" class="form-control" name="txtItemEPMCode" readonly>
            </div>
        </div>`,

        // 8. Item EPM Desc
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <textarea class="form-control" name="txtItemEPMDesc" readonly rows="3"></textarea>
        </div>`,

        // 9. Code Morinaga
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <div class="input-group">
                <div class="input-group-btn">
                    <button type="button" class="btn btn-danger" onclick="p_btnLOVCODEMORINAGAClick(this)">
                        <i class="fa fa-search"></i>
                    </button>
                </div>
                <input type="text" class="form-control" name="txtBrandCodeMorinaga" readonly>
            </div>
        </div>`,
    ]).draw();
    tableVarianRasa.order([[2, 'desc']]).draw();
}


function deleteRowdata(data) {
    debugger;
    clsGlobal.getConfirmation("Delete this data?",
        function (result) {
            if (result == true) {
                debugger;
                tableVarianRasa.rows($(data).parent().parent().parent()).remove().draw();
                refreshVarianLineIDs();
            } else {
                return false;
            }
        });
};

function refreshVarianLineIDs() {
    let totalRows = tableVarianRasa.rows({ order: 'applied' }).count();
    let i = totalRows;

    // Loop berdasarkan urutan visual di layar (descending LINE NO)
    tableVarianRasa.rows({ order: 'applied' }).every(function () {
        tableVarianRasa.cell(this, 2).data(`<input type="text" name="lineNo" value="${i}" readonly>`);
        i--;
    });

    lineCounter = totalRows + 1; // untuk baris baru nanti
}



function p_txtGroup_TextChanged(CATEGORY) {
    debugger;
    //var table_Length = $('#tableVarianRasa tbody tr').length;
    //var index = $('#tableVarianRasa tbody tr').length - 1;

    //tableVarianRasa.cell(index, 2).nodes().to$().find('input').val(CATEGORY);

    if (currentCategoryInput) {
        currentCategoryInput.val(CATEGORY);
        currentCategoryInput = null; // reset setelah pakai
    }
}
function p_txtBrand_TextChanged(GRANDPARENT) {
    debugger;
    //var table_Length = $('#tableVarianRasa tbody tr').length;
    //var index = $('#tableVarianRasa tbody tr').length - 1;

    //tableVarianRasa.cell(index, 3).nodes().to$().find('input').val(GRANDPARENT);
    if (currentGrandParentInput) {
        currentGrandParentInput.val(GRANDPARENT);
        currentGrandParentInput = null; // reset setelah pakai
    }
}

function p_txtVarianRasa_TextChanged(PARENT) {
    debugger;
    //var table_Length = $('#tableVarianRasa tbody tr').length;
    //var index = $('#tableVarianRasa tbody tr').length - 1;

    //tableVarianRasa.cell(index, 4).nodes().to$().find('input').val(PARENT);
    if (currentParentInput) {
        currentParentInput.val(PARENT);
        currentParentInput = null; // reset setelah pakai
    }
}

function p_TxtGroup_TextChanged(GROUP) {
    debugger;
    //var table_Length = $('#tableVarianRasa tbody tr').length;
    //var index = $('#tableVarianRasa tbody tr').length - 1;

    //tableVarianRasa.cell(index, 5).nodes().to$().find('input').val(GROUP);
    if (currentGroupInput) {
        currentGroupInput.val(GROUP);
        currentGroupInput = null; // reset setelah pakai
    }
}

function p_txtItemEPMCode_TextChanged(RMCODE, RMDESC = '', UOM) {
    debugger;
    //var table_Length = $('#tableVarianRasa tbody tr').length;
    //var index = $('#tableVarianRasa tbody tr').length - 1;

    //tableVarianRasa.cell(index, 5).nodes().to$().find('input').val(GROUP);
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
    //var table_Length = $('#tableVarianRasa tbody tr').length;
    //var index = $('#tableVarianRasa tbody tr').length - 1;

    //tableVarianRasa.cell(index, 5).nodes().to$().find('input').val(GROUP);
    if (currentUomInput) {
        currentUomInput.val(UOM);
        currentUomInput = null; // reset setelah pakai
    }
}

function p_txtBrandCodeMorinaga_TextChanged(CODEMORINAGA) {
    debugger;

    if (currentBrandCodeMorinagaInput) {
        currentBrandCodeMorinagaInput.val(CODEMORINAGA);
        currentBrandCodeMorinagaInput = null; // reset setelah pakai
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
                url: "/VarianRasa/NPOIExportToExcelData",
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
        currentCategoryInput = $(btn).closest('.input-group').find('input[name="txtGroup"]');
        LOV = clsGlobal.generateLOV("MATRIX_CATEGORY", "txtGroup");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};
function p_btnLOVGROUPVARIANTClick(btn) {
    try {
        currentCategoryInput = $(btn).closest('.input-group').find('input[name="txtGroup"]');
        LOV = clsGlobal.generateLOV("MATRIX_GROUP_VARIAN", "txtGroup");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};
function p_btnLOVGRANDPARENTClick(btn) {
    try {
        currentGrandParentInput = $(btn).closest('.input-group').find('input[name="txtBrand"]');
        LOV = clsGlobal.generateLOV("MATRIX_GRANDPARENT", "txtBrand");
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
        currentParentInput = $(btn).closest('.input-group').find('input[name="txtVarianRasa"]');
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
        currentRMCodeInput = group.find('input[name="txtItemEPMCode"]');

        currentRMDescription = group.find('textarea[name="txtItemEPMDesc"]');

        LOV = clsGlobal.generateLOV("MATRIX_SHPFGCODEORACLE", "txtItemEPMCode");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVCODEMORINAGAClick(btn) {
    try {
        const group = $(btn).closest('tr'); // baris saat ini

        //currentRMCodeInput = $(btn).closest('.input-group').find('input[name="txtItemEPMCode"]');
        currentBrandCodeMorinagaInput = group.find('input[name="txtBrandCodeMorinaga"]');

        LOV = clsGlobal.generateLOV("MATRIX_BRAND_CODE_MORINAGA", "txtBrandCodeMorinaga");
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
    formData.append("data", $("#txtHiddenObject").val());
    formData.append("__RequestVerificationToken", $('#frmVarianRasa input[name=__RequestVerificationToken]').val());


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
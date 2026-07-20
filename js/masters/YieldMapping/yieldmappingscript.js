//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
let lineCounter = 1;
let currentFormulaClassInput = null;
let currentProductTypeInput = null;
let currentProductionLineInput = null;

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    p_InitForm();


});

function p_InitForm() {
    p_initiateData();

}

var tableYieldMapping = $("#tableYieldMapping").DataTable({
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
    order: [[1, "asc"]],
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
        { "visible": false, "targets": [1] }
    ]
})

$(window).on('resize', function () {
    tableYieldMapping.columns.adjust().draw(false);
});

function setChooseLOV(txtValue) {
    var arr = txtValue.split('|');

    debugger;

    switch (arr[0]) {
        case "txtFormulaClass":
            //$("#txtGroup").val(arr[1]);
            p_txtFormulaClass_TextChanged(arr[1]);
            break;
        case "txtProductType":
            //$("#txtGroup").val(arr[1]);
            p_txtProductType_TextChanged(arr[1]);
            break;
        case "txtProductionLine":
            //$("#txtGroup").val(arr[1]);
            p_txtProductionLine_TextChanged(arr[1]);
            break;
    }
    clsGlobal.closeLOV();
}

function p_initiateData() {
    debugger;
    clsGlobal.showLoading();

    $.ajax({
        type: "POST",
        url: "/YieldMapping/InitiateData",
        data: {
            __RequestVerificationToken: $('#frmYieldMapping input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    debugger;
                    $("#txtHiddenObject").val(JSON.stringify(retDat.objData));

                    p_DataToUI(retDat.objData);

                    // === ganti cara add rows disini ===
                    tableYieldMapping.clear();

                    // Hitung total data dulu agar bisa pakai descending LineNo
                    let totalData = retDat.objData.length;
                    let lineNo = totalData;

                    let rows = [];
                    for (var i = 0; i < retDat.objData.length; i++) {
                        var d = retDat.objData[i];

                        rows.push([
                            // 1. Delete button
                            `<div style="text-align:center">
                                <i class="fas fa-trash fa-2x trash-icon" onclick="deleteRowdata(this)"></i>
                            </div>`,

                            // 2. LineNo (descending)
                            `<input type="text" name="lineNo" value="${lineNo--}" readonly>`,

                            // 3. txtFormulaClass
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <div class="input-group-btn">
                                        <button type="button" class="btn btn-danger" onclick="p_btnLOVFormulaClassClick(this)" >
                                            <i class="fa fa-search"></i>
                                        </button>
                                    </div>
                                    <input type="text" class="form-control" name="txtFormulaClass" value="${d.txtFormulaClass || ''}" readonly>
                                    <input type="hidden" name="intYieldMappingID" value="${d.intYieldMappingId || ''}">
                                    <input type="hidden" name="txtYieldMappingID" value="${d.txtYieldMappingId || ''}">
                                </div>
                            </div>`,

                            // 4. txtProductType
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <div class="input-group-btn">
                                        <button type="button" class="btn btn-danger" onclick="p_btnLOVProductTypeClick(this)" >
                                            <i class="fa fa-search"></i>
                                        </button>
                                    </div>
                                    <input type="text" class="form-control" name="txtProductType" value="${d.txtProductType || ''}" readonly>
                                </div>
                            </div>`,

                            // 5. txtProductionLine
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <div class="input-group-btn">
                                        <button type="button" class="btn btn-danger" onclick="p_btnLOVProductionLineClick(this)" >
                                            <i class="fa fa-search"></i>
                                        </button>
                                    </div>
                                    <input type="text" class="form-control" name="txtProductionLine" value="${d.txtProductionLine || ''}" readonly>
                                </div>
                            </div>`,                          

                            // 6. Ratio
                            `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
                                <div class="input-group">
                                    <input type="text" class="form-control decimal-input" name="decYield" placeholder="0.00" value="${d.decYield || ''}" oninput="formatDecimal(this)">
                                </div>
                            </div>`
                        ]);
                    }

                    tableYieldMapping.rows.add(rows).draw(false);
                    // === end ganti cara add rows ===

                    // ✅ Refresh Line Numbers after insert
                    refreshLineIDs();

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

    tableYieldMapping.clear().draw(false);

    $("#txtHiddenObject").val(JSON.stringify(objData));


}

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
        jsonData.MYieldMappingList = JSON.parse(listJSON);
    } else {
        jsonData.MYieldMappingList = [];
    }

    $("#txtHiddenObject").val(JSON.stringify(jsonData));

    var ho = $("#txtHiddenObject").val(); // sekarang seharusnya berisi MItemMappingList
    var dt = $("#txtHiddenObjectList").val();
}

function p_UIToDataList() {
    debugger;

    var jsonArray = [];
    var table = $("#tableYieldMapping").DataTable();

    table.rows().every(function () {
        var $row = $(this.node());

        // Abaikan baris kosong
        if ($row.hasClass("dataTables_empty") || $row.text().trim() === "No data available in table") {
            return;
        }

        // Ambil nilai dari setiap kolom (sama kayak kode kamu sebelumnya)
        let idVal = $row.find('input[name="intYieldMappingID"]').val();
        let obj = {
            intYieldMappingID: idVal ? parseInt(idVal) : 0,
            txtYieldMappingID: $row.find('input[name="txtYieldMappingID"]').val() || "",
            txtFormulaClass: $row.find('input[name="txtFormulaClass"]').val() || "",
            txtProductType: $row.find('input[name="txtProductType"]').val() || "",
            txtProductionLine: $row.find('input[name="txtProductionLine"]').val() || "",
            decYield: ($row.find('input[name="decYield"]').val() || "0").replace(/,/g, '')
        };

        jsonArray.push(obj);
    });

    $("#txtHiddenObjectList").val(JSON.stringify(jsonArray));
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

function p_PopulateDataTable() {
    debugger;
    const table = $('#tableYieldMapping').DataTable();
    const dataRows = table.rows().nodes();

    let $firstRow = null;
    if (dataRows.length > 0) {
        $firstRow = $(dataRows[0]);

        const fieldsToCheck = [
            { name: "txtFormulaClass", label: "Formula Class" },
            //{ name: "txtProductType", label: "Product Type" },
            //{ name: "txtProductionLine", label: "Production Line" },
            { name: "decYield", label: "Yield (%)" }
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
    tableYieldMapping.row.add([
        // 1. Action column
        `<div style="text-align:center">
            <i class="fas fa-trash fa-2x trash-icon" onclick="deleteRowdata(this)"></i>
        </div>`,

        // 3. Line No (running number)
        `<input type="text" name="lineNo" value="${lineCounter++}" readonly>`,  // 🟢 Tambah running number

        // 4. Group
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <div class="input-group">
                <div class="input-group-btn">
                    <button type="button" class="btn btn-danger" onclick="p_btnLOVFormulaClassClick(this)" >
                        <i class="fa fa-search"></i>
                    </button>
                </div>
                <input type="text" class="form-control" name="txtFormulaClass" readonly>
                <input type="hidden" name="intYieldMappingID" >
                <input type="hidden" name="txtYieldMappingID" >
            </div>
        </div>`,

        // 5. Brand
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <div class="input-group">
                <div class="input-group-btn">
                    <button type="button" class="btn btn-danger" onclick="p_btnLOVProductTypeClick(this)" >
                        <i class="fa fa-search"></i>
                    </button>
                </div>
                <input type="text" class="form-control" name="txtProductType" readonly>
            </div>
        </div>`,

        // 6. Varian Rasa
        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <div class="input-group">
                <div class="input-group-btn">
                    <button type="button" class="btn btn-danger" onclick="p_btnLOVProductionLineClick(this)" >
                        <i class="fa fa-search"></i>
                    </button>
                </div>
                <input type="text" class="form-control" name="txtProductionLine" readonly>
            </div>
        </div>`,

        `<div class="col-sm-12" style="padding-left:0; padding-right:0; min-width:200px">
            <div class="input-group">
                <input type="text" class="form-control decimal-input" name="decYield" placeholder="0.00" oninput="formatDecimal(this)">
            </div>
        </div>`
    ]).draw();
    tableYieldMapping.order([[1, 'desc']]).draw();
}

function validateDuplicateRow(input) {
    debugger;
    const $currentRow = $(input).closest("tr");
    const table = $('#tableYieldMapping').DataTable();

    const currentFormulaClass = $currentRow.find('input[name="txtFormulaClass"]').val().trim();
    const currentProductType = $currentRow.find('input[name="txtProductType"]').val().trim();
    const currentProductionLine = $currentRow.find('input[name="txtProductionLine"]').val().trim();

    // ✅ Cek hanya jika ketiganya sudah diisi
    if (currentFormulaClass && currentProductType && currentProductionLine) {
        let isDuplicate = false;

        table.rows().every(function () {
            const rowNode = $(this.node());

            // Lewati baris yang sedang diubah
            if (rowNode[0] === $currentRow[0]) return;

            const formulaClass = rowNode.find('input[name="txtFormulaClass"]').val().trim();
            const productType = rowNode.find('input[name="txtProductType"]').val().trim();
            const productionLine = rowNode.find('input[name="txtProductionLine"]').val().trim();

            if (
                formulaClass === currentFormulaClass &&
                productType === currentProductType &&
                productionLine === currentProductionLine
            ) {
                isDuplicate = true;
                return false; // keluar loop
            }
        });

        // ⚠️ Jika duplikat ditemukan
        if (isDuplicate) {
            Swal.fire({
                icon: 'warning',
                title: 'Data Duplikat',
                html: `Kombinasi <b>Formula Class</b>, <b>Product Type</b>, dan <b>Production Line</b> sudah ada di baris lain.`,
            });

            // Kosongkan field yang diubah
            $(input).val("");
        }
    }
}



function deleteRowdata(data) {
    debugger;
    clsGlobal.getConfirmation("Delete this data?",
        function (result) {
            if (result == true) {
                debugger;
                tableYieldMapping.rows($(data).parent().parent().parent()).remove().draw();
                refreshLineIDs();
            } else {
                return false;
            }
        });
};

function refreshLineIDs() {
    let totalRows = tableYieldMapping.rows({ order: 'applied' }).count();
    let i = totalRows;

    // Loop berdasarkan urutan visual di layar (descending LINE NO)
    tableYieldMapping.rows({ order: 'applied' }).every(function () {
        tableYieldMapping.cell(this, 1).data(`<input type="text" name="lineNo" value="${i}" readonly>`);
        i--;
    });

    lineCounter = totalRows + 1; // untuk baris baru nanti
}

function p_txtFormulaClass_TextChanged(FORMULACLASS) {
    debugger;
    //var table_Length = $('#tableVarianRasa tbody tr').length;
    //var index = $('#tableVarianRasa tbody tr').length - 1;

    //tableVarianRasa.cell(index, 2).nodes().to$().find('input').val(CATEGORY);
    debugger;
    if (currentFormulaClassInput) {
        currentFormulaClassInput.val(FORMULACLASS);

        // 🔍 Jalankan validasi setelah isi berubah
        validateDuplicateRow(currentFormulaClassInput);

        currentFormulaClassInput = null; // reset setelah pakai
    }
}

function p_txtProductType_TextChanged(PRODUCTTYPE) {
    debugger;
    //var table_Length = $('#tableVarianRasa tbody tr').length;
    //var index = $('#tableVarianRasa tbody tr').length - 1;

    //tableVarianRasa.cell(index, 2).nodes().to$().find('input').val(CATEGORY);
    debugger;
    if (currentProductTypeInput) {
        currentProductTypeInput.val(PRODUCTTYPE);

        // 🔍 Jalankan validasi setelah isi berubah
        validateDuplicateRow(currentProductTypeInput);

        currentProductTypeInput = null; // reset setelah pakai
    }
}
function p_txtProductionLine_TextChanged(PRODUCTIONLINE) {
    debugger;
    //var table_Length = $('#tableVarianRasa tbody tr').length;
    //var index = $('#tableVarianRasa tbody tr').length - 1;

    //tableVarianRasa.cell(index, 2).nodes().to$().find('input').val(CATEGORY);
    debugger;
    if (currentProductionLineInput) {
        currentProductionLineInput.val(PRODUCTIONLINE);

        // 🔍 Jalankan validasi setelah isi berubah
        validateDuplicateRow(currentProductionLineInput);

        currentProductionLineInput = null; // reset setelah pakai
    }
}

function p_btnLOVFormulaClassClick(btn) {
    try {
        debugger;
        currentFormulaClassInput = $(btn).closest('.input-group').find('input[name="txtFormulaClass"]');
        LOV = clsGlobal.generateLOV("COSTING_FORMULACLASS", "txtFormulaClass");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVProductTypeClick(btn) {
    try {
        debugger;
        currentProductTypeInput = $(btn).closest('.input-group').find('input[name="txtProductType"]');
        LOV = clsGlobal.generateLOV("IDC_PRODUCTTYPE", "txtProductType");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVProductionLineClick(btn) {
    try {
        debugger;
        currentProductionLineInput = $(btn).closest('.input-group').find('input[name="txtProductionLine"]');
        LOV = clsGlobal.generateLOV("IDC_PRODUCTION_LINE", "txtProductionLine");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

//=======================
// HANDLER
//=======================

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
    formData.append("__RequestVerificationToken", $('#frmYieldMapping input[name=__RequestVerificationToken]').val());


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
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false;
let attachmentFAList = [];
let attachmentPSList = [];
let isInitialLoad = true;

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    //clsGlobal.showLoading();
    debugger;
    //$('#bitAssignToPOTS').trigger('change');
    $('#btnSubmit').addClass('d-none');
    p_InitForm();
    //p_validatePage();
    //const config = {
    //    tabs: {
    //        visualAppearance: {
    //            name: 'visualAppearance',
    //            tableId: 'tableVisual'
    //        },
    //        dimension: {
    //            name: 'dimension',
    //            tableId: 'tableDimension'
    //        },
    //        material: {
    //            name: 'material',
    //            tableId: 'tableMaterial'
    //        },
    //        packagingIntegrity: {
    //            name: 'packagingIntegrity',
    //            tableId: 'tablePackaging'
    //        },
    //        contaminant: {
    //            name: 'contaminant',
    //            tableId: 'tableContaminant',
    //        }
    //    },
    //}

});

function p_InitForm() {

    p_initiateData();

}

const isEdit = document.getElementById("hdnIsEdit").value === "true";
document.getElementById("btnSaveText").textContent = isEdit ? "Update" : "Save";
function inisiasiVisual() {
    // Set tab header
    debugger;
    document.getElementById('Dimension').classList.remove('active-tab');
    document.getElementById('Material').classList.remove('active-tab');
    document.getElementById('Packaging').classList.remove('active-tab');
    document.getElementById('Contaminant').classList.remove('active-tab');
    document.getElementById('Visual').classList.add('active-tab');

    // Hide other tab content
    const dimTab = document.getElementById('form-tabs-Dimension');
    dimTab.classList.remove('show', 'active');

    const matTab = document.getElementById('form-tabs-Material');
    matTab.classList.remove('show', 'active');

    const pacTab = document.getElementById('form-tabs-Packaging');
    pacTab.classList.remove('show', 'active');

    const conTab = document.getElementById('form-tabs-Contaminant');
    conTab.classList.remove('show', 'active');

    // Show tab content
    const visTab = document.getElementById('form-tabs-Visual');
    visTab.classList.add('show', 'active');
}

function inisiasiDimension() {
    // Set tab header
    document.getElementById('Visual').classList.remove('active-tab');
    document.getElementById('Material').classList.remove('active-tab');
    document.getElementById('Packaging').classList.remove('active-tab');
    document.getElementById('Contaminant').classList.remove('active-tab');
    document.getElementById('Dimension').classList.add('active-tab');

    // Hide other tab content
    const visTab = document.getElementById('form-tabs-Visual');
    visTab.classList.remove('show', 'active');

    const matTab = document.getElementById('form-tabs-Material');
    matTab.classList.remove('show', 'active');

    const pacTab = document.getElementById('form-tabs-Packaging');
    pacTab.classList.remove('show', 'active');

    const conTab = document.getElementById('form-tabs-Contaminant');
    conTab.classList.remove('show', 'active');

    // Show tab content
    const dimTab = document.getElementById('form-tabs-Dimension');
    dimTab.classList.add('show', 'active');

    // 🛠️ Perbaiki lebar kolom setelah tab tampil
    setTimeout(() => {
        tableDimension.columns.adjust().draw();
    }, 200); // delay kecil untuk memastikan tab terlihat
}

function inisiasiMaterial() {
    // Set tab header
    document.getElementById('Visual').classList.remove('active-tab');
    document.getElementById('Dimension').classList.remove('active-tab');
    document.getElementById('Packaging').classList.remove('active-tab');
    document.getElementById('Contaminant').classList.remove('active-tab');
    document.getElementById('Material').classList.add('active-tab');

    // Hide other tab content
    const visTab = document.getElementById('form-tabs-Visual');
    visTab.classList.remove('show', 'active');

    const dimTab = document.getElementById('form-tabs-Dimension');
    dimTab.classList.remove('show', 'active');

    const pacTab = document.getElementById('form-tabs-Packaging');
    pacTab.classList.remove('show', 'active');

    const conTab = document.getElementById('form-tabs-Contaminant');
    conTab.classList.remove('show', 'active');

    // Show tab content
    const matTab = document.getElementById('form-tabs-Material');
    matTab.classList.add('show', 'active');

    setTimeout(() => {
        tableMaterial.columns.adjust().draw();
    }, 200); // delay kecil untuk memastikan tab terlihat
}

function inisiasiPackaging() {
    // Set tab header
    document.getElementById('Visual').classList.remove('active-tab');
    document.getElementById('Dimension').classList.remove('active-tab');
    document.getElementById('Material').classList.remove('active-tab');
    document.getElementById('Contaminant').classList.remove('active-tab');
    document.getElementById('Packaging').classList.add('active-tab');

    // Hide other tab content
    const visTab = document.getElementById('form-tabs-Visual');
    visTab.classList.remove('show', 'active');

    const dimTab = document.getElementById('form-tabs-Dimension');
    dimTab.classList.remove('show', 'active');

    const matTab = document.getElementById('form-tabs-Material');
    matTab.classList.remove('show', 'active');

    const conTab = document.getElementById('form-tabs-Contaminant');
    conTab.classList.remove('show', 'active');

    // Show tab content
    const pacTab = document.getElementById('form-tabs-Packaging');
    pacTab.classList.add('show', 'active');

    setTimeout(() => {
        tablePackaging.columns.adjust().draw();
    }, 200); // delay kecil untuk memastikan tab terlihat
}

function inisiasiContaminant() {
    // Set tab header
    document.getElementById('Visual').classList.remove('active-tab');
    document.getElementById('Dimension').classList.remove('active-tab');
    document.getElementById('Material').classList.remove('active-tab');
    document.getElementById('Packaging').classList.remove('active-tab');
    document.getElementById('Contaminant').classList.add('active-tab');

    // Hide other tab content
    const visTab = document.getElementById('form-tabs-Visual');
    visTab.classList.remove('show', 'active');

    const dimTab = document.getElementById('form-tabs-Dimension');
    dimTab.classList.remove('show', 'active');

    const matTab = document.getElementById('form-tabs-Material');
    matTab.classList.remove('show', 'active');

    const pacTab = document.getElementById('form-tabs-Packaging');
    pacTab.classList.remove('show', 'active');

    // Show tab content
    const conTab = document.getElementById('form-tabs-Contaminant');
    conTab.classList.add('show', 'active');

    setTimeout(() => {
        tableContaminant.columns.adjust().draw();
    }, 200); // delay kecil untuk memastikan tab terlihat
}

//=======================
// FUNCTION
//=======================

document.getElementById("TxtPMSubCategoryName").addEventListener("input", function () {
    if (this.value.length > 3) {
        this.value = this.value.substring(0, 3);
    }
});
//function updateTemplateSpecCode() {
//    debugger;
//    const subCatName = document.getElementById("TxtPMSubCategoryName").value.trim().toUpperCase();
//    const categorySelect = document.getElementById("TxtCategoryName");
//    const categoryText = categorySelect.options[categorySelect.selectedIndex].text.trim();

//    // Set value TxtPMSubCategoryDesc
//    if (categoryText && subCatName.length >= 1) {
//        const desc = `Template ${categoryText} ${subCatName}`;
//        document.getElementById("TxtPMSubCategoryDesc").value = desc;
//    } else {
//        document.getElementById("TxtPMSubCategoryDesc").value = "";
//    }

//    // Update TxtDocTemplateSpecificationCode
//    if (subCatName.length >= 1 && categoryText && categoryText !== "Select Category") {
//        const templateCode = `T-${categoryText}-${subCatName}`;
//        document.getElementById("TxtDocTemplateSpecificationCode").value = templateCode;
//    } else {
//        document.getElementById("TxtDocTemplateSpecificationCode").value = "";
//    }

//    //----Cara1

//    //const subCatName = document.getElementById("TxtPMSubCategoryName").value.trim().toUpperCase();
//    //const categorySelect = document.getElementById("TxtCategoryName");
//    //const categoryText = categorySelect.options[categorySelect.selectedIndex].text.trim();

//    //// Set value TxtPMSubCategoryDesc
//    //if (categoryText && subCatName) {
//    //    const desc = `Template ${categoryText} ${subCatName}`;
//    //    document.getElementById("TxtPMSubCategoryDesc").value = desc;
//    //}

//    //// Update TxtDocTemplateSpecificationCode
//    //if (subCatName.length >= 3 && categoryText && categoryText !== "Select Category") {
//    //    const templateCode = `T-${categoryText}-${subCatName}`;
//    //    document.getElementById("TxtDocTemplateSpecificationCode").value = templateCode;
//    //} else {
//    //    document.getElementById("TxtDocTemplateSpecificationCode").value = "";
//    //}

//}

function updateTemplateSpecCode() {
    debugger;
    const subCatName = document.getElementById("TxtPMSubCategoryName").value.trim().toUpperCase();
    const categorySelect = document.getElementById("TxtCategoryName");
    const selectedOption = categorySelect.options[categorySelect.selectedIndex];

    const categoryName = selectedOption.getAttribute("data-name"); // TxtPmcategoryName
    const categoryCode = selectedOption.getAttribute("data-code");

    // Set Desc
    if (categoryName && subCatName.length >= 3) {
        document.getElementById("TxtPMSubCategoryDesc").value = `TEMPLATE ${categoryName} ${subCatName}`;
    } else {
        document.getElementById("TxtPMSubCategoryDesc").value = "";
    }

    // Set Template Code
    if (categoryCode && subCatName.length >= 3) {
        document.getElementById("TxtDocTemplateSpecificationCode").value = `T-${categoryCode}-${subCatName}`;
    } else {
        document.getElementById("TxtDocTemplateSpecificationCode").value = "";
    }
}


//function onCategoryChange() {
//    debugger;
//    //var selectedVal = $("#TxtCategoryName").val();
//    //$("#IntCategoryId").val(selectedVal);

//    const categorySelect = document.getElementById("TxtCategoryName");
//    const selectedOption = categorySelect.options[categorySelect.selectedIndex];

//    const categoryId = selectedOption.getAttribute("data-id");
//    $("#IntCategoryId").val(categoryId); // Set ke hidden input jika diperlukan


//    if (!isInitialLoad) {
//        $("#TxtDocTemplateSpecificationCode").val("");
//        $("#TxtPMSubCategoryDesc").val("");
//        updateTemplateSpecCode();
//    }

//    //var IdVal = $("#id").val();
//    //if (IdVal === "0" || IdVal === null) {
//    //    document.getElementById("TxtDocTemplateSpecificationCode").value = "";
//    //    updateTemplateSpecCode();
//    //}
//    //var existingCode = $("#TxtDocTemplateSpecificationCode").val();

//    //if (!existingCode) {

//    //}

//}

function onCategoryChange() {
    debugger;
    const categorySelect = document.getElementById("TxtCategoryName");
    const selectedOption = categorySelect.options[categorySelect.selectedIndex];

    if (selectedOption) {
        const categoryId = selectedOption.value;
        const categoryCode = selectedOption.getAttribute("data-code");

        $("#IntCategoryId").val(categoryId);
        $("#TxtPmcategoryCode").val(categoryCode); // misalnya kamu mau taruh ini di hidden field
    }

    if (!isInitialLoad) {
        $("#TxtDocTemplateSpecificationCode").val("");
        $("#TxtPMSubCategoryDesc").val("");
        updateTemplateSpecCode();
    }
}


function setChooseLOV(txtValue) {
    var arr = txtValue.split('|');

    debugger;

    switch (arr[0]) {
        case "TxtParentSpecificationCode":
            $("#IntParentSpecificationId").val(arr[1]);
            $("#TxtParentSpecificationCode").val(arr[2]);
            $("#IntParentSpecificationVersion").val(arr[4]);
            p_ParentSpec_TextChanged(arr[1]);
            break;
        case "TxtItemCode":
            $("#TxtItemCode").val(arr[1]);
            $("#TxtItemDesc").val(arr[2]);
            $("#TxtSpecPMNo").val("S-" + arr[1]);
            $("#TxtSpecPMDesc").val("SPEC-" + arr[2]);
            break;
        case "TxtNameOfPOTS":
            $("#TxtNameOfPOTS").val(arr[2]);
            break;
        case "trTemplateSpecificationVisual_txtTestCode":
            //p_ItemValidation(arr[1]);
            p_txtTestCode_TextChanged(arr);
            break;
        case "trTemplateSpecificationDimension_txtTestCode":
            //p_ItemValidation(arr[1]);
            p_txtTestCodeDimension_TextChanged(arr);
            break;
        case "trTemplateSpecificationMaterial_txtTestCode":
            //p_ItemValidation(arr[1]);
            p_txtTestCodeMaterial_TextChanged(arr);
            break;
        case "trTemplateSpecificationPackaging_txtTestCode":
            //p_ItemValidation(arr[1]);
            p_txtTestCodePackaging_TextChanged(arr);
            break;
        case "trTemplateSpecificationContaminant_txtTestCode":
            //p_ItemValidation(arr[1]);
            p_txtTestCodeContaminant_TextChanged(arr);
            break;
        case "trTemplateSpecificationVisual_txtTarget":
            $("#trTemplateSpecificationVisual_txtTarget").val(arr[1]);
            break;
        case "trTemplateSpecificationDimension_txtTarget":
            $("#trTemplateSpecificationDimension_txtTarget").val(arr[1]);
            break;
        case "trTemplateSpecificationMaterial_txtTarget":
            $("#trTemplateSpecificationMaterial_txtTarget").val(arr[1]);
            break;
        case "trTemplateSpecificationPackaging_txtTarget":
            $("#trTemplateSpecificationPackaging_txtTarget").val(arr[1]);
            break;
        case "trTemplateSpecificationContaminant_txtTarget":
            $("#trTemplateSpecificationContaminant_txtTarget").val(arr[1]);
            break;
        case "COPYFROM_PME":
            p_COPYFROMPME_TextChanged(arr[1]);
            break;
        case "COPYFROM_TEMPLATESPEC":
            p_COPYFROMTEMPLATESPEC_TextChanged(arr[1]);
            break;
        case "trTemplateSpecificationMaterialInformation_txtStorageCondition":
            $("#trTemplateSpecificationMaterialInformation_intStorageCondition").val(arr[1]);
            $("#trTemplateSpecificationMaterialInformation_txtStorageCondition").val(arr[2]);
    }
    clsGlobal.closeLOV();
}

var tableVisual = $("#tableVisual").DataTable({
    "scrollX": true,
    renderer: "bootstrap",
    "processing": true,
    "bAutoWidth": false,
    "paging": true,
    //"bJQueryUI": true,
    //"aLengthMenu": [[5, 10, 100, -1], [5, 10, 100, "All"]],
    "aLengthMenu": [[-1, 5, 10, 100], ["ALL", 5, 10, 100]],
    "columnDefs": [
        //{ className: "text-center", "targets": [2] },
        { "visible": false, "targets": [2, 4] },
    ]
})

var tableDimension = $("#tableDimension").DataTable({
    "scrollX": true,
    renderer: "bootstrap",
    "processing": true,
    "bAutoWidth": false,
    "paging": true,
    //"bJQueryUI": true,
    //"aLengthMenu": [[5, 10, 100, -1], [5, 10, 100, "All"]],
    "aLengthMenu": [[-1, 5, 10, 100], ["ALL", 5, 10, 100]],
    "columnDefs": [
        //{ className: "text-center", "targets": [2] },
        { "visible": false, "targets": [2, 4] },
    ]
})

var tableMaterial = $("#tableMaterial").DataTable({
    "scrollX": true,
    renderer: "bootstrap",
    "processing": true,
    "bAutoWidth": false,
    "paging": true,
    //"bJQueryUI": true,
    //"aLengthMenu": [[5, 10, 100, -1], [5, 10, 100, "All"]],
    "aLengthMenu": [[-1, 5, 10, 100], ["ALL", 5, 10, 100]],
    "columnDefs": [
        //{ className: "text-center", "targets": [2] },
        { "visible": false, "targets": [2, 4] },
    ]
})

var tablePackaging = $("#tablePackaging").DataTable({
    "scrollX": true,
    renderer: "bootstrap",
    "processing": true,
    "bAutoWidth": false,
    "paging": true,
    //"bJQueryUI": true,
    //"aLengthMenu": [[5, 10, 100, -1], [5, 10, 100, "All"]],
    "aLengthMenu": [[-1, 5, 10, 100], ["ALL", 5, 10, 100]],
    "columnDefs": [
        //{ className: "text-center", "targets": [2] },
        { "visible": false, "targets": [2, 4] },
    ]
})

var tableContaminant = $("#tableContaminant").DataTable({
    "scrollX": true,
    renderer: "bootstrap",
    "processing": true,
    "bAutoWidth": false,
    "paging": true,
    //"bJQueryUI": true,
    //"aLengthMenu": [[5, 10, 100, -1], [5, 10, 100, "All"]],
    "aLengthMenu": [[-1, 5, 10, 100], ["ALL", 5, 10, 100]],
    "columnDefs": [
        //{ className: "text-center", "targets": [2] },
        { "visible": false, "targets": [2, 4] },
    ]
})


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

// Pasang event blur ke semua input yang punya oninput="formatDecimal(this)"
window.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input[oninput="formatDecimal(this)"]');

    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            let value = input.value.replace(/,/g, '');
            if (value.includes('.')) return;

            let number = parseFloat(value);
            if (!isNaN(number)) {
                let intPart = Math.floor(number).toString();
                intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                input.value = `${intPart}.00`;
            }
        });
    });
});

function p_initiateData() {
    debugger;
    clsGlobal.showLoading();
    //$.blockUI();
    //$('#btnAddItem').hide();
    $.ajax({
        type: "POST",
        url: "/TemplateSpecification/InitiateData",
        data: { id: $('#id').val(), __RequestVerificationToken: $('#frmTemplateSpecificationDetail input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            //isEvaluationInitialized = true;
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    debugger;
                    $("#txtHiddenObject").val(JSON.stringify(retDat.objData));

                    p_DataToUI(retDat.objData);

                    debugger;
                    tableVisual.clear().draw(false);

                    for (var i = 0; i < retDat.objData.listVmTrTemplateSpecificationVisual.length; i++) {

                        tableVisual.row.add([
                            '<div style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowVisual(this)" class="btn btn-primary btn-sm me-1">' +
                            '<i class="fas fa-edit me-1"></i> Edit' +
                            '</button>' +
                            '</div>',
                            '<div style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="deleteRowVisualdata(this)" class="btn btn-danger btn-sm">' +
                            '<i class="fas fa-trash me-1"></i> Delete' +
                            '</button>' +
                            '</div>',
                            retDat.objData.listVmTrTemplateSpecificationVisual[i].txtTemplateSpecificationVisualId || "",
                            retDat.objData.listVmTrTemplateSpecificationVisual[i].intLineNo || "",
                            retDat.objData.listVmTrTemplateSpecificationVisual[i].intTestId || "",
                            retDat.objData.listVmTrTemplateSpecificationVisual[i].txtTestCode || "",
                            retDat.objData.listVmTrTemplateSpecificationVisual[i].txtTestClass || "",
                            retDat.objData.listVmTrTemplateSpecificationVisual[i].txtTestUnit || "",
                            retDat.objData.listVmTrTemplateSpecificationVisual[i].txtTestMethodCode || "",
                            retDat.objData.listVmTrTemplateSpecificationVisual[i].txtTestType || "",
                            retDat.objData.listVmTrTemplateSpecificationVisual[i].txtParameterType || "",
                            retDat.objData.listVmTrTemplateSpecificationVisual[i].txtDetail || ""
                        ]).draw(false);
                    }

                    tableDimension.clear().draw(false);

                    for (var i = 0; i < retDat.objData.listVmTrTemplateSpecificationDimension.length; i++) {

                        tableDimension.row.add([
                            '<div style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowDimension(this)" class="btn btn-primary btn-sm me-1">' +
                            '<i class="fas fa-edit me-1"></i> Edit' +
                            '</button>' +
                            '</div>',
                            '<div style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="deleteRowDimensiondata(this)" class="btn btn-danger btn-sm">' +
                            '<i class="fas fa-trash me-1"></i> Delete' +
                            '</button>' +
                            '</div>',
                            retDat.objData.listVmTrTemplateSpecificationDimension[i].txtTemplateSpecificationDimensionId || "",
                            retDat.objData.listVmTrTemplateSpecificationDimension[i].intLineNo || "",
                            retDat.objData.listVmTrTemplateSpecificationDimension[i].intTestId || "",
                            retDat.objData.listVmTrTemplateSpecificationDimension[i].txtTestCode || "",
                            retDat.objData.listVmTrTemplateSpecificationDimension[i].txtTestClass || "",
                            retDat.objData.listVmTrTemplateSpecificationDimension[i].txtTestUnit || "",
                            retDat.objData.listVmTrTemplateSpecificationDimension[i].txtTestMethodCode || "",
                            retDat.objData.listVmTrTemplateSpecificationDimension[i].txtTestType || "",
                            retDat.objData.listVmTrTemplateSpecificationDimension[i].txtParameterType || "",
                            retDat.objData.listVmTrTemplateSpecificationDimension[i].txtDetail || ""
                        ]).draw(false);
                    }

                    tableMaterial.clear().draw(false);

                    for (var i = 0; i < retDat.objData.listVmTrTemplateSpecificationMaterial.length; i++) {

                        tableMaterial.row.add([
                            '<div style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowMaterial(this)" class="btn btn-primary btn-sm me-1">' +
                            '<i class="fas fa-edit me-1"></i> Edit' +
                            '</button>' +
                            '</div>',
                            '<div style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="deleteRowMaterialdata(this)" class="btn btn-danger btn-sm">' +
                            '<i class="fas fa-trash me-1"></i> Delete' +
                            '</button>' +
                            '</div>',
                            retDat.objData.listVmTrTemplateSpecificationMaterial[i].txtTemplateSpecificationMaterialId || "",
                            retDat.objData.listVmTrTemplateSpecificationMaterial[i].intLineNo || "",
                            retDat.objData.listVmTrTemplateSpecificationMaterial[i].intTestId || "",
                            retDat.objData.listVmTrTemplateSpecificationMaterial[i].txtTestCode || "",
                            retDat.objData.listVmTrTemplateSpecificationMaterial[i].txtTestClass || "",
                            retDat.objData.listVmTrTemplateSpecificationMaterial[i].txtTestUnit || "",
                            retDat.objData.listVmTrTemplateSpecificationMaterial[i].txtTestMethodCode || "",
                            retDat.objData.listVmTrTemplateSpecificationMaterial[i].txtTestType || "",
                            retDat.objData.listVmTrTemplateSpecificationMaterial[i].txtParameterType || "",
                            retDat.objData.listVmTrTemplateSpecificationMaterial[i].txtDetail || ""
                        ]).draw(false);
                    }

                    tablePackaging.clear().draw(false);
                    debugger;
                    for (var i = 0; i < retDat.objData.listVmTrTemplateSpecificationPackagingIntegrities.length; i++) {

                        tablePackaging.row.add([
                            '<div style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowPackaging(this)" class="btn btn-primary btn-sm me-1">' +
                            '<i class="fas fa-edit me-1"></i> Edit' +
                            '</button>' +
                            '</div>',
                            '<div style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="deleteRowPackagingdata(this)" class="btn btn-danger btn-sm">' +
                            '<i class="fas fa-trash me-1"></i> Delete' +
                            '</button>' +
                            '</div>',
                            retDat.objData.listVmTrTemplateSpecificationPackagingIntegrities[i].txtTemplateSpecificationPackagingIntegrityId || "",
                            retDat.objData.listVmTrTemplateSpecificationPackagingIntegrities[i].intLineNo || "",
                            retDat.objData.listVmTrTemplateSpecificationPackagingIntegrities[i].intTestId || "",
                            retDat.objData.listVmTrTemplateSpecificationPackagingIntegrities[i].txtTestCode || "",
                            retDat.objData.listVmTrTemplateSpecificationPackagingIntegrities[i].txtTestClass || "",
                            retDat.objData.listVmTrTemplateSpecificationPackagingIntegrities[i].txtTestUnit || "",
                            retDat.objData.listVmTrTemplateSpecificationPackagingIntegrities[i].txtTestMethodCode || "",
                            retDat.objData.listVmTrTemplateSpecificationPackagingIntegrities[i].txtTestType || "",
                            retDat.objData.listVmTrTemplateSpecificationPackagingIntegrities[i].txtParameterType || "",
                            retDat.objData.listVmTrTemplateSpecificationPackagingIntegrities[i].txtDetail || ""
                        ]).draw(false);
                    }

                    tableContaminant.clear().draw(false);

                    for (var i = 0; i < retDat.objData.listVmTrTemplateSpecificationContaminant.length; i++) {

                        tableContaminant.row.add([
                            '<div style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowContaminant(this)" class="btn btn-primary btn-sm me-1">' +
                            '<i class="fas fa-edit me-1"></i> Edit' +
                            '</button>' +
                            '</div>',
                            '<div style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="deleteRowContaminantdata(this)" class="btn btn-danger btn-sm">' +
                            '<i class="fas fa-trash me-1"></i> Delete' +
                            '</button>' +
                            '</div>',
                            retDat.objData.listVmTrTemplateSpecificationContaminant[i].txtTemplateSpecificationContaminantId || "",
                            retDat.objData.listVmTrTemplateSpecificationContaminant[i].intLineNo || "",
                            retDat.objData.listVmTrTemplateSpecificationContaminant[i].intTestId || "",
                            retDat.objData.listVmTrTemplateSpecificationContaminant[i].txtTestCode || "",
                            retDat.objData.listVmTrTemplateSpecificationContaminant[i].txtTestClass || "",
                            retDat.objData.listVmTrTemplateSpecificationContaminant[i].txtTestUnit || "",
                            retDat.objData.listVmTrTemplateSpecificationContaminant[i].txtTestMethodCode || "",
                            retDat.objData.listVmTrTemplateSpecificationContaminant[i].txtTestType || "",
                            retDat.objData.listVmTrTemplateSpecificationContaminant[i].txtParameterType || "",
                            retDat.objData.listVmTrTemplateSpecificationContaminant[i].txtDetail || ""
                        ]).draw(false);
                    }

                    debugger;
                    if (retDat.objData.txtDocStatus == "WAITING FOR APPROVAL") {
                        disableAllForApproval();
                    }

                } else {
                     p_showBlank();
                  debugger;
                 }
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }
            debugger;
            clsGlobal.hideLoading();
            //$.unblockUI();
        },
        error: function (retDat) {
            clsGlobal.hideLoading();
            //$.blockUI();
        }
    });

}

function p_DataToUI(objData) {
    debugger;
    $("#id").val(clsGlobal.parseToInteger(objData.id));
    $("#TxtTemplateSpecificationId").val(clsGlobal.parseToString(objData.txtTemplateSpecificationId));
    $("#TxtDocTemplateSpecificationCode").val(clsGlobal.parseToString(objData.txtDocTemplateSpecificationCode));
    $("#IntCategoryId").val(clsGlobal.parseToInteger(objData.intCategoryId));
    if ($("#IntCategoryId").val() == 0) {
        $("#TxtCategoryName").val(objData.txtCategoryName).trigger('change');
    } else {
        $("#TxtCategoryName").val(objData.intCategoryId).trigger('change');
    }
    //if ($("#IntCategoryId").val() == 0) {
    //    setTimeout(() => {
    //        $("#TxtCategoryName").val(objData.txtCategoryName).trigger('change');
    //    }, 50);
    //} else {
    //    setTimeout(() => {
    //        $("#TxtCategoryName").val(objData.intCategoryId).trigger('change');
    //    }, 50);
    //}
    var C = $('#TxtCategoryName').val();
    $("#TxtPMSubCategoryName").val(clsGlobal.parseToString(objData.txtPmsubCategoryName));
    $("#TxtPMSubCategoryDesc").val(clsGlobal.parseToString(objData.txtPmsubCategoryDesc));
    $('#bitActive').prop('checked', objData.bitActive);
    $("#TxtRemark").val(clsGlobal.parseToString(objData.txtRemark));
    var user = $('#TxtUpdatedBy').val();
    if (objData.txtUpdatedBy == "" || objData.txtUpdatedBy == null) {
        $('#txtCreatedBy').val(objData.txtCreatedBy);
        $('#dtmCreatedDate').val(clsGlobal.parseJSONdateNew(objData.dtmCreatedDate));
    } else {
        $('#txtCreatedBy').val(objData.txtCreatedBy);
        $('#dtmCreatedDate').val(clsGlobal.parseJSONdateNew(objData.dtmUpdatedDate));
    };

    tableVisual.clear().draw(false);
    tableDimension.clear().draw(false);
    tableMaterial.clear().draw(false);
    tablePackaging.clear().draw(false);
    tableContaminant.clear().draw(false);

    isInitialLoad = false; // setelah selesai load
    $("#txtHiddenObject").val(JSON.stringify(objData));


}

function p_UIToData() {
    debugger;

    var jsonObj = [];
    var htmlJSON = $("#txtHiddenObject").val();
    jsonData = JSON.parse(htmlJSON);
    jsonData.txtTemplateSpecificationId = $("#TxtTemplateSpecificationId").val();
    jsonData.txtDocTemplateSpecificationCode = $("#TxtDocTemplateSpecificationCode").val();
    jsonData.intCategoryId = clsGlobal.parseToInteger($("#IntCategoryId").val());
    jsonData.txtCategoryName = $("#TxtCategoryName option:selected").text();
    jsonData.txtPmsubCategoryName = $("#TxtPMSubCategoryName").val();
    jsonData.txtPmsubCategoryDesc = $("#TxtPMSubCategoryDesc").val();
    jsonData.bitActive = clsGlobal.parseToBoolean($("#bitActive").prop("checked"));
    jsonData.txtRemark = $("#TxtRemark").val();

    jsonData.txtCreatedBy = $("#txtCreatedBy").val();
    jsonData.dtmCreatedDate = $("#dtmCreatedDate").val();
    jsonData.txtUpdatedBy = $("#txtUpdatedBy").val();
    jsonData.dtmUpdatedDate = $("#dtmUpdatedDate").val();

    jsonData.trTemplateSpecificationVisual = $("#txtHiddenDetailVisualObject").val();
    jsonData.trTemplateSpecificationDimension = $("#txtHiddenDetailDimensionObject").val();
    jsonData.trTemplateSpecificationMaterial = $("#txtHiddenDetailMaterialObject").val();
    jsonData.trTemplateSpecificationPackagingIntegrities = $("#txtHiddenDetailPackagingObject").val();
    jsonData.trTemplateSpecificationContaminant = $("#txtHiddenDetailContaminantObject").val();

    $("#txtHiddenObject").val(JSON.stringify(jsonData));
}

function p_showBlank() {
    p_initiateData();
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

function validateForm() {
    let isValid = true;
    const errorMessages = [];

    const fieldDisplayNames = {
        'TxtDocTemplateSpecificationCode': 'Template PM Spec Code',
        'TxtPMSubCategoryDesc': 'Description',
        'TxtCategoryName': 'Category',
        'TxtPMSubCategoryName': 'PM Sub category',
        'TxtRemark': 'Remark'
    };


    const requiredFields = [
        'TxtDocTemplateSpecificationCode', 'TxtPMSubCategoryDesc', 'TxtCategoryName', 'TxtPMSubCategoryName', 'TxtRemark'
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

function validateFormTabVisual() {
    let isValid = true;
    const errorMessages = [];

    const fieldDisplayNames = {
        'trTemplateSpecificationVisual_txtTestCode': 'Test Code',
        'trTemplateSpecificationVisual_txtTestClass': 'Test Class',
        //'trTemplateSpecificationVisual_txtTestUnit': 'Test Unit',
        'trTemplateSpecificationVisual_txtTestMethodCode': 'Test Method',
        'trTemplateSpecificationVisual_txtTestType': 'Test Type',
        'trTemplateSpecificationVisual_txtParameterType': 'Parameter Type'
    };


    const requiredFields = [
        'trTemplateSpecificationVisual_txtTestCode', 'trTemplateSpecificationVisual_txtTestClass', 'trTemplateSpecificationVisual_txtTestMethodCode', 'trTemplateSpecificationVisual_txtTestType', 'trTemplateSpecificationVisual_txtParameterType'
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

function validateFormTabDimension() {
    let isValid = true;
    const errorMessages = [];

    const fieldDisplayNames = {
        'trTemplateSpecificationDimension_txtTestCode': 'Test Code',
        'trTemplateSpecificationDimension_txtTestClass': 'Test Class',
        //'trTemplateSpecificationDimension_txtTestUnit': 'Test Unit',
        'trTemplateSpecificationDimension_txtTestMethodCode': 'Test Method',
        'trTemplateSpecificationDimension_txtTestType': 'Test Type',
        'trTemplateSpecificationDimension_txtParameterType': 'Parameter Type'
    };


    const requiredFields = [
        'trTemplateSpecificationDimension_txtTestCode', 'trTemplateSpecificationDimension_txtTestClass', 'trTemplateSpecificationDimension_txtTestMethodCode', 'trTemplateSpecificationDimension_txtTestType', 'trTemplateSpecificationDimension_txtParameterType'
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

function validateFormTabMaterial() {
    let isValid = true;
    const errorMessages = [];

    const fieldDisplayNames = {
        'trTemplateSpecificationMaterial_txtTestCode': 'Test Code',
        'trTemplateSpecificationMaterial_txtTestClass': 'Test Class',
        //'trTemplateSpecificationMaterial_txtTestUnit': 'Test Unit',
        'trTemplateSpecificationMaterial_txtTestMethodCode': 'Test Method',
        'trTemplateSpecificationMaterial_txtTestType': 'Test Type',
        'trTemplateSpecificationMaterial_txtParameterType': 'Parameter Type'
    };


    const requiredFields = [
        'trTemplateSpecificationMaterial_txtTestCode', 'trTemplateSpecificationMaterial_txtTestClass', 'trTemplateSpecificationMaterial_txtTestMethodCode', 'trTemplateSpecificationMaterial_txtTestType', 'trTemplateSpecificationMaterial_txtParameterType'
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

function validateFormTabPackaging() {
    let isValid = true;
    const errorMessages = [];

    const fieldDisplayNames = {
        'trTemplateSpecificationPackaging_txtTestCode': 'Test Code',
        'trTemplateSpecificationPackaging_txtTestClass': 'Test Class',
        //'trTemplateSpecificationPackaging_txtTestUnit': 'Test Unit',
        'trTemplateSpecificationPackaging_txtTestMethodCode': 'Test Method',
        'trTemplateSpecificationPackaging_txtTestType': 'Test Type',
        'trTemplateSpecificationPackaging_txtParameterType': 'Parameter Type'
    };


    const requiredFields = [
        'trTemplateSpecificationPackaging_txtTestCode', 'trTemplateSpecificationPackaging_txtTestClass', 'trTemplateSpecificationPackaging_txtTestMethodCode', 'trTemplateSpecificationPackaging_txtTestType', 'trTemplateSpecificationPackaging_txtParameterType'
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

function validateFormTabContaminant() {
    let isValid = true;
    const errorMessages = [];

    const fieldDisplayNames = {
        'trTemplateSpecificationContaminant_txtTestCode': 'Test Code',
        'trTemplateSpecificationContaminant_txtTestClass': 'Test Class',
        //'trTemplateSpecificationContaminant_txtTestUnit': 'Test Unit',
        'trTemplateSpecificationContaminant_txtTestMethodCode': 'Test Method',
        'trTemplateSpecificationContaminant_txtTestType': 'Test Type',
        'trTemplateSpecificationContaminant_txtParameterType': 'Parameter Type'
    };


    const requiredFields = [
        'trTemplateSpecificationContaminant_txtTestCode', 'trTemplateSpecificationContaminant_txtTestClass', 'trTemplateSpecificationContaminant_txtTestMethodCode', 'trTemplateSpecificationContaminant_txtTestType', 'trTemplateSpecificationContaminant_txtParameterType'
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
function saveData(isEdit) {
    debugger;
    if (!validateForm()) {
        return;
    }

    p_UItrTemplateSpecificationVisualToData();
    p_UItrTemplateSpecificationDimensionToData();
    p_UItrTemplateSpecificationMaterialToData();
    p_UItrTemplateSpecificationPackagingToData();
    p_UItrTemplateSpecificationContaminantToData();
    p_UIToData();

    const url = isEdit ? window.updateUrl : window.saveUrl;
    debugger;

    // Buat FormData untuk kirim file + data JSON
    const formData = new FormData();
    formData.append("data", $("#txtHiddenObject").val());
    formData.append("__RequestVerificationToken", $('#frmTemplateSpecificationDetail input[name=__RequestVerificationToken]').val());


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
                clsGlobal.swalSuccessSaveOrSubmit(retDat.txtMessage, window.detailUrl + '?id=' + retDat.objData.id);
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

function submitData(isEdit) {
    debugger;
    if (!validateForm()) {
        return;
    }

    p_UItrTemplateSpecificationVisualToData()
    p_UItrTemplateSpecificationDimensionToData()
    p_UItrTemplateSpecificationMaterialToData()
    p_UItrTemplateSpecificationPackagingToData()
    p_UItrTemplateSpecificationContaminantToData()
    p_UIToData();

    const url = window.submitUrl;
    debugger;

    // Buat FormData untuk kirim file + data JSON
    const formData = new FormData();
    formData.append("data", $("#txtHiddenObject").val());
    formData.append("__RequestVerificationToken", $('#frmTrTemplateSpecificationDetail input[name=__RequestVerificationToken]').val());

    // Tambahkan file-file yang diupload ke formData
    //attachmentList.forEach((att, index) => {
    //    if (att.isUploadFile && att.attachment) {
    //        formData.append(`files`, att.attachment); // kamu bisa pakai `files[]` jika ingin array
    //    }
    //});

    // Tambahkan file FinalArtwork (jika ada)
    const finalArtwork = $('#TxtFinalArtwork')[0].files[0];
    if (finalArtwork) {
        formData.append("FinalArtwork", finalArtwork);
    }

    // Tambahkan file PackingStyle (jika ada)
    const packingStyle = $('#TxtPackingStyle')[0].files[0];
    if (packingStyle) {
        formData.append("PackingStyle", packingStyle);
    }

    $.ajax({
        url: url,
        type: 'POST',
        //data: {
        //    data: $("#txtHiddenObject").val(),
        //    __RequestVerificationToken: $('#frmTrTemplateSpecificationDetail input[name=__RequestVerificationToken]').val()
        //},
        data: formData,
        contentType: false, // WAJIB: biar tidak default ke application/x-www-form-urlencoded
        processData: false, // WAJIB: jangan proses FormData jadi string
        datatype: "json",
        success: function (retDat) {
            debugger;
            if (retDat.bitSuccess == true) {
                debugger;
                clsGlobal.swalSuccessSaveOrSubmit(retDat.txtMessage, window.indexUrl);
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

//function p_saveData() {

//    clsGlobal.showLoading();
//    debugger;
//    p_UIToData();
//    debugger;
//    $.ajax({
//        type: "POST",
//        url: "/TrTemplateSpecification/Save",
//        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmTrTemplateSpecificationDetail input[name=__RequestVerificationToken]').val() },
//        datatype: "json",
//        success: function (retDat) {
//            debugger;
//            if (retDat.bitSuccess == true) {
//                p_DataToUI(retDat.objData);
//                clsGlobal.swalSuccess(retDat.txtMessage);
//                /*clsGlobal.getInformationMessage(retDat.txtMessage);*/
//            } else {
//                clsGlobal.getAlert(retDat.txtMessage);
//            }
//            clsGlobal.hideLoading();
//        },
//        error: function (retDat) {
//            debugger;
//            clsGlobal.hideLoading();
//        }
//    });
//}

function p_txtTestCode_TextChanged(arr) {
    debugger;
    var table_Length = $('#tableVisual tbody tr').length;
    var index = $('#tableVisual tbody tr').length - 1;

    //if (table_Length > 1) {
    //    for (var i = 1; i <= index; i++) {
    //        if (document.getElementById("tableVisual").rows[i].cells[0].innerHTML == txtTestCode) {
    //            table_DTL.cell(index, 0).nodes().to$().find('input').val("");
    //            table_DTL.cell(index, 1).nodes().to$().find('input').val("");
    //            table_DTL.cell(index, 2).nodes().to$().find('input').val("0");
    //            table_DTL.draw(true);

    //            clsGlobal.closeLOV();
    //            clsGlobal.getAlert("Anda tidak bisa menginput item yang sama!!!");
    //            return false;
    //        }
    //    }
    //}
    $("#trTemplateSpecificationVisual_intTestID").val(arr[1]);
    $("#trTemplateSpecificationVisual_txtTestCode").val(arr[2]);
    $("#trTemplateSpecificationVisual_txtTestClass").val(arr[3]);
    $("#trTemplateSpecificationVisual_txtTestMethodCode").val(arr[4]);
    $("#trTemplateSpecificationVisual_txtTestType").val(arr[5]);
    $("#trTemplateSpecificationVisual_txtTestUnit").val(arr[6]);

    //if (!arr[6]) {
    //    $("#trTemplateSpecificationVisual_txtTestUnit").prop("readonly", false).val('');
    //} else {
    //    $("#trTemplateSpecificationVisual_txtTestUnit").prop("readonly", true).val(arr[6]);
    //}

}

function p_txtTestCodeDimension_TextChanged(arr) {
    debugger;
    var table_Length = $('#tableDimension tbody tr').length;
    var index = $('#tableDimension tbody tr').length - 1;

    $("#trTemplateSpecificationDimension_intTestID").val(arr[1]);
    $("#trTemplateSpecificationDimension_txtTestCode").val(arr[2]);
    $("#trTemplateSpecificationDimension_txtTestClass").val(arr[3]);
    $("#trTemplateSpecificationDimension_txtTestMethodCode").val(arr[4]);
    $("#trTemplateSpecificationDimension_txtTestType").val(arr[5]);
    $("#trTemplateSpecificationDimension_txtTestUnit").val(arr[6]);

    //if (!arr[6]) {
    //    $("#trTemplateSpecificationDimension_txtTestUnit").prop("readonly", false).val('');
    //} else {
    //    $("#trTemplateSpecificationDimension_txtTestUnit").prop("readonly", true).val(arr[6]);
    //}

}

function p_txtTestCodeMaterial_TextChanged(arr) {
    debugger;
    var table_Length = $('#tableMaterial tbody tr').length;
    var index = $('#tableMaterial tbody tr').length - 1;

    $("#trTemplateSpecificationMaterial_intTestID").val(arr[1]);
    $("#trTemplateSpecificationMaterial_txtTestCode").val(arr[2]);
    $("#trTemplateSpecificationMaterial_txtTestClass").val(arr[3]);
    $("#trTemplateSpecificationMaterial_txtTestMethodCode").val(arr[4]);
    $("#trTemplateSpecificationMaterial_txtTestType").val(arr[5]);
    $("#trTemplateSpecificationMaterial_txtTestUnit").val(arr[6]);

    //if (!arr[6]) {
    //    $("#trTemplateSpecificationMaterial_txtTestUnit").prop("readonly", false).val('');
    //} else {
    //    $("#trTemplateSpecificationMaterial_txtTestUnit").prop("readonly", true).val(arr[6]);
    //}

}

function p_txtTestCodePackaging_TextChanged(arr) {
    debugger;
    var table_Length = $('#tablePackaging tbody tr').length;
    var index = $('#tablePackaging tbody tr').length - 1;

    $("#trTemplateSpecificationPackaging_intTestID").val(arr[1]);
    $("#trTemplateSpecificationPackaging_txtTestCode").val(arr[2]);
    $("#trTemplateSpecificationPackaging_txtTestClass").val(arr[3]);
    $("#trTemplateSpecificationPackaging_txtTestMethodCode").val(arr[4]);
    $("#trTemplateSpecificationPackaging_txtTestType").val(arr[5]);
    $("#trTemplateSpecificationPackaging_txtTestUnit").val(arr[6]);

    // Enable test type if arr[5] is null or empty
    //if (!arr[6]) {
    //    $("#trTemplateSpecificationPackaging_txtTestUnit").prop("readonly", false).val('');
    //} else {
    //    $("#trTemplateSpecificationPackaging_txtTestUnit").prop("readonly", true).val(arr[6]);
    //}

}

function p_txtTestCodeContaminant_TextChanged(arr) {
    debugger;
    var table_Length = $('#tableContaminant tbody tr').length;
    var index = $('#tableContaminant tbody tr').length - 1;

    $("#trTemplateSpecificationContaminant_intTestID").val(arr[1]);
    $("#trTemplateSpecificationContaminant_txtTestCode").val(arr[2]);
    $("#trTemplateSpecificationContaminant_txtTestClass").val(arr[3]);
    $("#trTemplateSpecificationContaminant_txtTestMethodCode").val(arr[4]);
    $("#trTemplateSpecificationContaminant_txtTestType").val(arr[5]);
    $("#trTemplateSpecificationContaminant_txtTestUnit").val(arr[6]);

    // Enable test type if arr[5] is null or empty
    //if (!arr[6]) {
    //    $("#trTemplateSpecificationContaminant_txtTestUnit").prop("readonly", false).val('');
    //} else {
    //    $("#trTemplateSpecificationContaminant_txtTestUnit").prop("readonly", true).val(arr[6]);
    //}

}

function p_ShowBlankVisualDetail() {
    debugger;

    $("#trTemplateSpecificationVisual_txtTemplateSpecificationVisualID").val("");
    $("#trTemplateSpecificationVisual_intLineID").val("");
    $("#trTemplateSpecificationVisual_intTestID").val("");
    $("#trTemplateSpecificationVisual_txtTestCode").val("");
    $("#trTemplateSpecificationVisual_txtTestClass").val("");
    $("#trTemplateSpecificationVisual_txtTestUnit").val("");
    $("#trTemplateSpecificationVisual_txtTestMethodCode").val("");
    $("#trTemplateSpecificationVisual_txtTestType").val("");
    $("#trTemplateSpecificationVisual_txtParameterType").val("");
    $("#trTemplateSpecificationVisual_txtDetail").val("");

}

function p_ShowBlankDimensionDetail() {
    debugger;

    $("#trTemplateSpecificationDimension_txtTemplateSpecificationDimensionID").val("");
    $("#trTemplateSpecificationDimension_intLineID").val("");
    $("#trTemplateSpecificationDimension_intTestID").val("");
    $("#trTemplateSpecificationDimension_txtTestCode").val("");
    $("#trTemplateSpecificationDimension_txtTestClass").val("");
    $("#trTemplateSpecificationDimension_txtTestUnit").val("");
    $("#trTemplateSpecificationDimension_txtTestMethodCode").val("");
    $("#trTemplateSpecificationDimension_txtTestType").val("");
    $("#trTemplateSpecificationDimension_txtParameterType").val("");
    $("#trTemplateSpecificationDimension_txtDetail").val("");

}

function p_ShowBlankMaterialDetail() {
    debugger;

    $("#trTemplateSpecificationMaterial_txtTemplateSpecificationMaterialID").val("");
    $("#trTemplateSpecificationMaterial_intLineID").val("");
    $("#trTemplateSpecificationMaterial_intTestID").val("");
    $("#trTemplateSpecificationMaterial_txtTestCode").val("");
    $("#trTemplateSpecificationMaterial_txtTestClass").val("");
    $("#trTemplateSpecificationMaterial_txtTestUnit").val("");
    $("#trTemplateSpecificationMaterial_txtTestMethodCode").val("");
    $("#trTemplateSpecificationMaterial_txtTestType").val("");
    $("#trTemplateSpecificationMaterial_txtParameterType").val("");
    $("#trTemplateSpecificationMaterial_txtDetail").val("");

}

function p_ShowBlankPackagingDetail() {
    debugger;

    $("#trTemplateSpecificationPackaging_txtTemplateSpecificationPackagingID").val("");
    $("#trTemplateSpecificationPackaging_intLineID").val("");
    $("#trTemplateSpecificationPackaging_intTestID").val("");
    $("#trTemplateSpecificationPackaging_txtTestCode").val("");
    $("#trTemplateSpecificationPackaging_txtTestClass").val("");
    $("#trTemplateSpecificationPackaging_txtTestUnit").val("");
    $("#trTemplateSpecificationPackaging_txtTestMethodCode").val("");
    $("#trTemplateSpecificationPackaging_txtTestType").val("");
    $("#trTemplateSpecificationPackaging_txtParameterType").val("");
    $("#trTemplateSpecificationPackaging_txtDetail").val("");
}

function p_ShowBlankContaminantDetail() {
    debugger;

    $("#trTemplateSpecificationContaminant_txtTemplateSpecificationContaminantID").val("");
    $("#trTemplateSpecificationContaminant_intLineID").val("");
    $("#trTemplateSpecificationContaminant_intTestID").val("");
    $("#trTemplateSpecificationContaminant_txtTestCode").val("");
    $("#trTemplateSpecificationContaminant_txtTestClass").val("");
    $("#trTemplateSpecificationContaminant_txtTestUnit").val("");
    $("#trTemplateSpecificationContaminant_txtTestMethodCode").val("");
    $("#trTemplateSpecificationContaminant_txtTestType").val("");
    $("#trTemplateSpecificationContaminant_txtParameterType").val("");
    $("#trTemplateSpecificationContaminant_txtDetail").val("");

}

//=======================
// HANDLER
//=======================

//$('#btnSave').bind('click', function () {
//    try {
//        clsGlobal.getConfirmation("Save this data?", function (result) {
//            if (result == true) {
//                debugger;
//                p_saveData();
//            }
//            else {
//                return false;
//            }
//        });
//    } catch (ex) {
//        clsGlobal.showAlert(ex);
//    }
//});


$('#btnSampleNumber').bind('click', function () {
    try {
        debugger;
        LOV = clsGlobal.generateLOV("SAMPLE_NUMBER", "txtSampleNumber");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

//$('#btnSave').click(function () {
//    debugger;
//    const isEdit = (parseInt($("#id").val()) > 0).toString().toLowerCase();
//    const actionText = isEdit ? "update" : "save";
//    showSaveConfirmation(actionText, isEdit);
//});

$('#btnSave').click(function () {
    debugger;
    const isEdit = parseInt($("#id").val()) > 0; // boolean: true or false
    const actionText = isEdit ? "update" : "save";
    showSaveConfirmation(actionText, isEdit);
});

$('#btnSubmit').click(function () {
    debugger;
    var bol = parseInt($("#id").val());
    const isEdit = parseInt($("#id").val()) > 0;

    if (!isEdit) {
        toastr.error("Please save the data first before submitting");
        return;
    }

    Swal.fire({
        title: "Are you sure you want to submit this request?",
        text: "The status will be changed to 'Waiting for approval'",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, submit it!",
        cancelButtonText: "No, cancel"
    }).then((result) => {
        if (result.isConfirmed) {
            submitData();
        }
    });
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

$('#btnAddDetailVisual').bind('click',
    function () {
        try {
            debugger;
            p_ShowBlankVisualDetail();
            $('#modalVisual').modal('show');
            $('#SaveEditDetailVisual').val("SUBMIT");

        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    });

$('#btnAddDetailDimension').bind('click',
    function () {
        try {
            debugger;
            p_ShowBlankDimensionDetail();
            $('#modalDimension').modal('show');
            $('#SaveEditDetailDimension').val("SUBMIT");

        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    });

$('#btnAddDetailMaterial').bind('click',
    function () {
        try {
            debugger;
            p_ShowBlankMaterialDetail();
            $('#modalMaterial').modal('show');
            $('#SaveEditDetailMaterial').val("SUBMIT");

        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    });

$('#btnAddDetailPackaging').bind('click',
    function () {
        try {
            debugger;
            p_ShowBlankPackagingDetail();
            $('#modalPackaging').modal('show');
            $('#SaveEditDetailPackaging').val("SUBMIT");

        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    });

$('#btnAddDetailContaminant').bind('click',
    function () {
        try {
            debugger;
            p_ShowBlankContaminantDetail();
            $('#modalContaminant').modal('show');
            $('#SaveEditDetailContaminant').val("SUBMIT");

        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    });

function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if (d > 0) {//Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}


function p_UItrTemplateSpecificationVisualToData() {
    debugger;

    var jsonArray = "[";
    var jsonObj;

    var trTemplateSpecificationVisual_txtTemplateSpecificationVisualID;
    var trTemplateSpecificationVisual_intLineID;
    var trTemplateSpecificationVisual_intTestID;
    var trTemplateSpecificationVisual_txtTestCode;
    var trTemplateSpecificationVisual_txtTestClass;
    var trTemplateSpecificationVisual_txtTestUnit;
    var trTemplateSpecificationVisual_txtTestMethodCode;
    var trTemplateSpecificationVisual_txtTestType;
    var trTemplateSpecificationVisual_txtParameterType;
    var trTemplateSpecificationVisual_txtDetail;


    if ($('#tableVisual tbody td').length > 1) {
        for (var i = 1; i <= $('#tableVisual tbody tr').length; i++) {
            debugger;
            var index = i - 1;

            var a = document.getElementById("tableVisual").rows[i].cells[2].innerHTML;

            trTemplateSpecificationVisual_txtTemplateSpecificationVisualID = '"trTemplateSpecificationVisual_txtTemplateSpecificationVisualID" : "' +
                tableVisual.cell(index, 2).data() +
                '"';
            trTemplateSpecificationVisual_intLineID = '"trTemplateSpecificationVisual_intLineID" : "' +
                tableVisual.cell(index, 3).data() +
                '"';
            trTemplateSpecificationVisual_intTestID =
                '"trTemplateSpecificationVisual_intTestID" : "' + tableVisual.cell(index, 4).data() + '"';
            trTemplateSpecificationVisual_txtTestCode =
                '"trTemplateSpecificationVisual_txtTestCode" : "' + tableVisual.cell(index, 5).data() + '"';
            trTemplateSpecificationVisual_txtTestClass =
                '"trTemplateSpecificationVisual_txtTestClass" : "' + tableVisual.cell(index, 6).data() + '"';
            trTemplateSpecificationVisual_txtTestUnit =
                '"trTemplateSpecificationVisual_txtTestUnit" : "' + tableVisual.cell(index, 7).data() + '"';
            trTemplateSpecificationVisual_txtTestMethodCode =
                '"trTemplateSpecificationVisual_txtTestMethodCode" : "' + tableVisual.cell(index, 8).data() + '"';
            trTemplateSpecificationVisual_txtTestType =
                '"trTemplateSpecificationVisual_txtTestType" : "' + tableVisual.cell(index, 9).data() + '"';
            trTemplateSpecificationVisual_txtParameterType =
                '"trTemplateSpecificationVisual_txtParameterType" : "' + tableVisual.cell(index, 10).data() + '"';
            trTemplateSpecificationVisual_txtDetail =
                '"trTemplateSpecificationVisual_txtDetail" : "' + tableVisual.cell(index, 11).data() + '"';


            //var UsrCrt = '"trFSV_ProductDesc2ViewModels_UsrCrt" : "0"';
            //var DtmCrt = '"trFSV_ProductDesc2ViewModels_DtmCrt" : "/Date(946659600000)/"';
            //var UsrUpd = '"trFSV_ProductDesc2ViewModels_UsrUpd" : "0"';
            //var DtmUpd = '"trFSV_ProductDesc2ViewModels_DtmUpd" : "/Date(946659600000)/"';

            jsonObj = "{" +
                trTemplateSpecificationVisual_txtTemplateSpecificationVisualID +
                "," +
                trTemplateSpecificationVisual_intLineID +
                "," +
                trTemplateSpecificationVisual_intTestID +
                "," +
                trTemplateSpecificationVisual_txtTestCode +
                "," +
                trTemplateSpecificationVisual_txtTestClass +
                "," +
                trTemplateSpecificationVisual_txtTestUnit +
                "," +
                trTemplateSpecificationVisual_txtTestMethodCode +
                "," +
                trTemplateSpecificationVisual_txtTestType +
                "," +
                trTemplateSpecificationVisual_txtParameterType +
                "," +
                trTemplateSpecificationVisual_txtDetail +
                "}";

            if (i != $('#tableVisual tbody tr').length) {
                jsonArray = jsonArray + jsonObj + ",";
            }

            if (i == $('#tableVisual tbody tr').length) {
                jsonArray = jsonArray + jsonObj + "]";
            }
        }

        $("#txtHiddenDetailVisualObject").val(jsonArray);
    } else {
        $("#txtHiddenDetailVisualObject").val("");
    }

}

function p_UItrTemplateSpecificationDimensionToData() {
    debugger;

    var jsonArray = "[";
    var jsonObj;

    var trTemplateSpecificationDimension_txtTemplateSpecificationDimensionID;
    var trTemplateSpecificationDimension_intLineID;
    var trTemplateSpecificationDimension_intTestID;
    var trTemplateSpecificationDimension_txtTestCode;
    var trTemplateSpecificationDimension_txtTestClass;
    var trTemplateSpecificationDimension_txtTestUnit;
    var trTemplateSpecificationDimension_txtTestMethodCode;
    var trTemplateSpecificationDimension_txtTestType;
    var trTemplateSpecificationDimension_txtParameterType;
    var trTemplateSpecificationDimension_txtDetail;


    if ($('#tableDimension tbody td').length > 1) {
        for (var i = 1; i <= $('#tableDimension tbody tr').length; i++) {
            debugger;
            var index = i - 1;

            var a = document.getElementById("tableDimension").rows[i].cells[2].innerHTML;

            trTemplateSpecificationDimension_txtTemplateSpecificationDimensionID = '"trTemplateSpecificationDimension_txtTemplateSpecificationDimensionID" : "' +
                tableDimension.cell(index, 2).data() +
                '"';
            trTemplateSpecificationDimension_intLineID = '"trTemplateSpecificationDimension_intLineID" : "' +
                tableDimension.cell(index, 3).data() +
                '"';
            trTemplateSpecificationDimension_intTestID =
                '"trTemplateSpecificationDimension_intTestID" : "' + tableDimension.cell(index, 4).data() + '"';
            trTemplateSpecificationDimension_txtTestCode =
                '"trTemplateSpecificationDimension_txtTestCode" : "' + tableDimension.cell(index, 5).data() + '"';
            trTemplateSpecificationDimension_txtTestClass =
                '"trTemplateSpecificationDimension_txtTestClass" : "' + tableDimension.cell(index, 6).data() + '"';
            trTemplateSpecificationDimension_txtTestUnit =
                '"trTemplateSpecificationDimension_txtTestUnit" : "' + tableDimension.cell(index, 7).data() + '"';
            trTemplateSpecificationDimension_txtTestMethodCode =
                '"trTemplateSpecificationDimension_txtTestMethodCode" : "' + tableDimension.cell(index, 8).data() + '"';
            trTemplateSpecificationDimension_txtTestType =
                '"trTemplateSpecificationDimension_txtTestType" : "' + tableDimension.cell(index, 9).data() + '"';
            trTemplateSpecificationDimension_txtParameterType =
                '"trTemplateSpecificationDimension_txtParameterType" : "' + tableDimension.cell(index, 10).data() + '"';
            trTemplateSpecificationDimension_txtDetail =
                '"trTemplateSpecificationDimension_txtDetail" : "' + tableDimension.cell(index, 11).data() + '"';

            //var UsrCrt = '"trFSV_ProductDesc2ViewModels_UsrCrt" : "0"';
            //var DtmCrt = '"trFSV_ProductDesc2ViewModels_DtmCrt" : "/Date(946659600000)/"';
            //var UsrUpd = '"trFSV_ProductDesc2ViewModels_UsrUpd" : "0"';
            //var DtmUpd = '"trFSV_ProductDesc2ViewModels_DtmUpd" : "/Date(946659600000)/"';

            jsonObj = "{" +
                trTemplateSpecificationDimension_txtTemplateSpecificationDimensionID +
                "," +
                trTemplateSpecificationDimension_intLineID +
                "," +
                trTemplateSpecificationDimension_intTestID +
                "," +
                trTemplateSpecificationDimension_txtTestCode +
                "," +
                trTemplateSpecificationDimension_txtTestClass +
                "," +
                trTemplateSpecificationDimension_txtTestUnit +
                "," +
                trTemplateSpecificationDimension_txtTestMethodCode +
                "," +
                trTemplateSpecificationDimension_txtTestType +
                "," +
                trTemplateSpecificationDimension_txtParameterType +
                "," +
                trTemplateSpecificationDimension_txtDetail +
                "}";

            if (i != $('#tableDimension tbody tr').length) {
                jsonArray = jsonArray + jsonObj + ",";
            }

            if (i == $('#tableDimension tbody tr').length) {
                jsonArray = jsonArray + jsonObj + "]";
            }
        }

        $("#txtHiddenDetailDimensionObject").val(jsonArray);
    } else {
        $("#txtHiddenDetailDimensionObject").val("");
    }

}

function p_UItrTemplateSpecificationMaterialToData() {
    debugger;

    var jsonArray = "[";
    var jsonObj;

    var trTemplateSpecificationMaterial_txtTemplateSpecificationMaterialID;
    var trTemplateSpecificationMaterial_intLineID;
    var trTemplateSpecificationMaterial_intTestID;
    var trTemplateSpecificationMaterial_txtTestCode;
    var trTemplateSpecificationMaterial_txtTestClass;
    var trTemplateSpecificationMaterial_txtTestUnit;
    var trTemplateSpecificationMaterial_txtTestMethodCode;
    var trTemplateSpecificationMaterial_txtTestType;
    var trTemplateSpecificationMaterial_txtParameterType;
    var trTemplateSpecificationMaterial_txtDetail;


    if ($('#tableMaterial tbody td').length > 1) {
        for (var i = 1; i <= $('#tableMaterial tbody tr').length; i++) {
            debugger;
            var index = i - 1;

            var a = document.getElementById("tableMaterial").rows[i].cells[2].innerHTML;

            trTemplateSpecificationMaterial_txtTemplateSpecificationMaterialID = '"trTemplateSpecificationMaterial_txtTemplateSpecificationMaterialID" : "' +
                tableMaterial.cell(index, 2).data() +
                '"';
            trTemplateSpecificationMaterial_intLineID = '"trTemplateSpecificationMaterial_intLineID" : "' +
                tableMaterial.cell(index, 3).data() +
                '"';
            trTemplateSpecificationMaterial_intTestID =
                '"trTemplateSpecificationMaterial_intTestID" : "' + tableMaterial.cell(index, 4).data() + '"';
            trTemplateSpecificationMaterial_txtTestCode =
                '"trTemplateSpecificationMaterial_txtTestCode" : "' + tableMaterial.cell(index, 5).data() + '"';
            trTemplateSpecificationMaterial_txtTestClass =
                '"trTemplateSpecificationMaterial_txtTestClass" : "' + tableMaterial.cell(index, 6).data() + '"';
            trTemplateSpecificationMaterial_txtTestUnit =
                '"trTemplateSpecificationMaterial_txtTestUnit" : "' + tableMaterial.cell(index, 7).data() + '"';
            trTemplateSpecificationMaterial_txtTestMethodCode =
                '"trTemplateSpecificationMaterial_txtTestMethodCode" : "' + tableMaterial.cell(index, 8).data() + '"';
            trTemplateSpecificationMaterial_txtTestType =
                '"trTemplateSpecificationMaterial_txtTestType" : "' + tableMaterial.cell(index, 9).data() + '"';
            trTemplateSpecificationMaterial_txtParameterType =
                '"trTemplateSpecificationMaterial_txtParameterType" : "' + tableMaterial.cell(index, 10).data() + '"';
            trTemplateSpecificationMaterial_txtDetail =
                '"trTemplateSpecificationMaterial_txtDetail" : "' + tableMaterial.cell(index, 11).data() + '"';

            //var UsrCrt = '"trFSV_ProductDesc2ViewModels_UsrCrt" : "0"';
            //var DtmCrt = '"trFSV_ProductDesc2ViewModels_DtmCrt" : "/Date(946659600000)/"';
            //var UsrUpd = '"trFSV_ProductDesc2ViewModels_UsrUpd" : "0"';
            //var DtmUpd = '"trFSV_ProductDesc2ViewModels_DtmUpd" : "/Date(946659600000)/"';

            jsonObj = "{" +
                trTemplateSpecificationMaterial_txtTemplateSpecificationMaterialID +
                "," +
                trTemplateSpecificationMaterial_intLineID +
                "," +
                trTemplateSpecificationMaterial_intTestID +
                "," +
                trTemplateSpecificationMaterial_txtTestCode +
                "," +
                trTemplateSpecificationMaterial_txtTestClass +
                "," +
                trTemplateSpecificationMaterial_txtTestUnit +
                "," +
                trTemplateSpecificationMaterial_txtTestMethodCode +
                "," +
                trTemplateSpecificationMaterial_txtTestType +
                "," +
                trTemplateSpecificationMaterial_txtParameterType +
                "," +
                trTemplateSpecificationMaterial_txtDetail +
                "}";

            if (i != $('#tableMaterial tbody tr').length) {
                jsonArray = jsonArray + jsonObj + ",";
            }

            if (i == $('#tableMaterial tbody tr').length) {
                jsonArray = jsonArray + jsonObj + "]";
            }
        }

        $("#txtHiddenDetailMaterialObject").val(jsonArray);
    } else {
        $("#txtHiddenDetailMaterialObject").val("");
    }

}

function p_UItrTemplateSpecificationPackagingToData() {
    debugger;

    var jsonArray = "[";
    var jsonObj;

    var trTemplateSpecificationPackaging_txtTemplateSpecificationPackagingID;
    var trTemplateSpecificationPackaging_intLineID;
    var trTemplateSpecificationPackaging_intTestID;
    var trTemplateSpecificationPackaging_txtTestCode;
    var trTemplateSpecificationPackaging_txtTestClass;
    var trTemplateSpecificationPackaging_txtTestUnit;
    var trTemplateSpecificationPackaging_txtTestMethodCode;
    var trTemplateSpecificationPackaging_txtTestType;
    var trTemplateSpecificationPackaging_txtParameterType;
    var trTemplateSpecificationPackaging_txtDetail;


    if ($('#tablePackaging tbody td').length > 1) {
        for (var i = 1; i <= $('#tablePackaging tbody tr').length; i++) {
            debugger;
            var index = i - 1;

            var a = document.getElementById("tablePackaging").rows[i].cells[2].innerHTML;

            trTemplateSpecificationPackaging_txtTemplateSpecificationPackagingID = '"trTemplateSpecificationPackaging_txtTemplateSpecificationPackagingID" : "' +
                tablePackaging.cell(index, 2).data() +
                '"';
            trTemplateSpecificationPackaging_intLineID = '"trTemplateSpecificationPackaging_intLineID" : "' +
                tablePackaging.cell(index, 3).data() +
                '"';
            trTemplateSpecificationPackaging_intTestID =
                '"trTemplateSpecificationPackaging_intTestID" : "' + tablePackaging.cell(index, 4).data() + '"';
            trTemplateSpecificationPackaging_txtTestCode =
                '"trTemplateSpecificationPackaging_txtTestCode" : "' + tablePackaging.cell(index, 5).data() + '"';
            trTemplateSpecificationPackaging_txtTestClass =
                '"trTemplateSpecificationPackaging_txtTestClass" : "' + tablePackaging.cell(index, 6).data() + '"';
            trTemplateSpecificationPackaging_txtTestUnit =
                '"trTemplateSpecificationPackaging_txtTestUnit" : "' + tablePackaging.cell(index, 7).data() + '"';
            trTemplateSpecificationPackaging_txtTestMethodCode =
                '"trTemplateSpecificationPackaging_txtTestMethodCode" : "' + tablePackaging.cell(index, 8).data() + '"';
            trTemplateSpecificationPackaging_txtTestType =
                '"trTemplateSpecificationPackaging_txtTestType" : "' + tablePackaging.cell(index, 9).data() + '"';
            trTemplateSpecificationPackaging_txtParameterType =
                '"trTemplateSpecificationPackaging_txtParameterType" : "' + tablePackaging.cell(index, 10).data() + '"';
            trTemplateSpecificationPackaging_txtDetail =
                '"trTemplateSpecificationPackaging_txtDetail" : "' + tablePackaging.cell(index, 11).data() + '"';

            //var UsrCrt = '"trFSV_ProductDesc2ViewModels_UsrCrt" : "0"';
            //var DtmCrt = '"trFSV_ProductDesc2ViewModels_DtmCrt" : "/Date(946659600000)/"';
            //var UsrUpd = '"trFSV_ProductDesc2ViewModels_UsrUpd" : "0"';
            //var DtmUpd = '"trFSV_ProductDesc2ViewModels_DtmUpd" : "/Date(946659600000)/"';

            jsonObj = "{" +
                trTemplateSpecificationPackaging_txtTemplateSpecificationPackagingID +
                "," +
                trTemplateSpecificationPackaging_intLineID +
                "," +
                trTemplateSpecificationPackaging_intTestID +
                "," +
                trTemplateSpecificationPackaging_txtTestCode +
                "," +
                trTemplateSpecificationPackaging_txtTestClass +
                "," +
                trTemplateSpecificationPackaging_txtTestUnit +
                "," +
                trTemplateSpecificationPackaging_txtTestMethodCode +
                "," +
                trTemplateSpecificationPackaging_txtTestType +
                "," +
                trTemplateSpecificationPackaging_txtParameterType +
                "," +
                trTemplateSpecificationPackaging_txtDetail +
                "}";

            if (i != $('#tablePackaging tbody tr').length) {
                jsonArray = jsonArray + jsonObj + ",";
            }

            if (i == $('#tablePackaging tbody tr').length) {
                jsonArray = jsonArray + jsonObj + "]";
            }
        }

        $("#txtHiddenDetailPackagingObject").val(jsonArray);
    } else {
        $("#txtHiddenDetailPackagingObject").val("");
    }

}

function p_UItrTemplateSpecificationContaminantToData() {
    debugger;

    var jsonArray = "[";
    var jsonObj;

    var trTemplateSpecificationContaminant_txtTemplateSpecificationContaminantID;
    var trTemplateSpecificationContaminant_intLineID;
    var trTemplateSpecificationContaminant_intTestID;
    var trTemplateSpecificationContaminant_txtTestCode;
    var trTemplateSpecificationContaminant_txtTestClass;
    var trTemplateSpecificationContaminant_txtTestUnit;
    var trTemplateSpecificationContaminant_txtTestMethodCode;
    var trTemplateSpecificationContaminant_txtTestType;
    var trTemplateSpecificationContaminant_txtParameterType;
    var trTemplateSpecificationContaminant_txtDetail;


    if ($('#tableContaminant tbody td').length > 1) {
        for (var i = 1; i <= $('#tableContaminant tbody tr').length; i++) {
            debugger;
            var index = i - 1;

            var a = document.getElementById("tableContaminant").rows[i].cells[2].innerHTML;

            trTemplateSpecificationContaminant_txtTemplateSpecificationContaminantID = '"trTemplateSpecificationContaminant_txtTemplateSpecificationContaminantID" : "' +
                tableContaminant.cell(index, 2).data() +
                '"';
            trTemplateSpecificationContaminant_intLineID = '"trTemplateSpecificationContaminant_intLineID" : "' +
                tableContaminant.cell(index, 3).data() +
                '"';
            trTemplateSpecificationContaminant_intTestID =
                '"trTemplateSpecificationContaminant_intTestID" : "' + tableContaminant.cell(index, 4).data() + '"';
            trTemplateSpecificationContaminant_txtTestCode =
                '"trTemplateSpecificationContaminant_txtTestCode" : "' + tableContaminant.cell(index, 5).data() + '"';
            trTemplateSpecificationContaminant_txtTestClass =
                '"trTemplateSpecificationContaminant_txtTestClass" : "' + tableContaminant.cell(index, 6).data() + '"';
            trTemplateSpecificationContaminant_txtTestUnit =
                '"trTemplateSpecificationContaminant_txtTestUnit" : "' + tableContaminant.cell(index, 7).data() + '"';
            trTemplateSpecificationContaminant_txtTestMethodCode =
                '"trTemplateSpecificationContaminant_txtTestMethodCode" : "' + tableContaminant.cell(index, 8).data() + '"';
            trTemplateSpecificationContaminant_txtTestType =
                '"trTemplateSpecificationContaminant_txtTestType" : "' + tableContaminant.cell(index, 9).data() + '"';
            trTemplateSpecificationContaminant_txtParameterType =
                '"trTemplateSpecificationContaminant_txtParameterType" : "' + tableContaminant.cell(index, 10).data() + '"';
            trTemplateSpecificationContaminant_txtDetail =
                '"trTemplateSpecificationContaminant_txtDetail" : "' + tableContaminant.cell(index, 11).data() + '"';

            //var UsrCrt = '"trFSV_ProductDesc2ViewModels_UsrCrt" : "0"';
            //var DtmCrt = '"trFSV_ProductDesc2ViewModels_DtmCrt" : "/Date(946659600000)/"';
            //var UsrUpd = '"trFSV_ProductDesc2ViewModels_UsrUpd" : "0"';
            //var DtmUpd = '"trFSV_ProductDesc2ViewModels_DtmUpd" : "/Date(946659600000)/"';

            jsonObj = "{" +
                trTemplateSpecificationContaminant_txtTemplateSpecificationContaminantID +
                "," +
                trTemplateSpecificationContaminant_intLineID +
                "," +
                trTemplateSpecificationContaminant_intTestID +
                "," +
                trTemplateSpecificationContaminant_txtTestCode +
                "," +
                trTemplateSpecificationContaminant_txtTestClass +
                "," +
                trTemplateSpecificationContaminant_txtTestUnit +
                "," +
                trTemplateSpecificationContaminant_txtTestMethodCode +
                "," +
                trTemplateSpecificationContaminant_txtTestType +
                "," +
                trTemplateSpecificationContaminant_txtParameterType +
                "," +
                trTemplateSpecificationContaminant_txtDetail +
                "}";

            if (i != $('#tableContaminant tbody tr').length) {
                jsonArray = jsonArray + jsonObj + ",";
            }

            if (i == $('#tableContaminant tbody tr').length) {
                jsonArray = jsonArray + jsonObj + "]";
            }
        }

        $("#txtHiddenDetailContaminantObject").val(jsonArray);
    } else {
        $("#txtHiddenDetailContaminantObject").val("");
    }

}

function editRowVisual(data) {
    debugger;

    $('#trTemplateSpecificationVisual_txtTemplateSpecificationVisualID').val(tableVisual.rows($(data).parent().parent()).data()[0][2]);
    $('#trTemplateSpecificationVisual_intLineID').val(tableVisual.rows($(data).parent().parent()).data()[0][3]);
    $('#trTemplateSpecificationVisual_intTestID').val(tableVisual.rows($(data).parent().parent()).data()[0][4]);
    $('#trTemplateSpecificationVisual_txtTestCode').val(tableVisual.rows($(data).parent().parent()).data()[0][5]);
    $('#trTemplateSpecificationVisual_txtTestClass').val(tableVisual.rows($(data).parent().parent()).data()[0][6]);
    $('#trTemplateSpecificationVisual_txtTestUnit').val(tableVisual.rows($(data).parent().parent()).data()[0][7]);
    $('#trTemplateSpecificationVisual_txtTestMethodCode').val(tableVisual.rows($(data).parent().parent()).data()[0][8]);
    $('#trTemplateSpecificationVisual_txtTestType').val(tableVisual.rows($(data).parent().parent()).data()[0][9])
    //$('#trTemplateSpecificationContaminant_txtParameterType').val(tableVisual.rows($(data).parent().parent()).data()[0][10]);
    $('#trTemplateSpecificationVisual_txtParameterType')
        .val(tableVisual.rows($(data).parent().parent()).data()[0][10])
        .trigger('change');
    $('#trTemplateSpecificationVisual_txtDetail').val(tableVisual.rows($(data).parent().parent()).data()[0][11]);

    $('#SaveEditDetailVisual').val("EDIT");
    p_UItrTemplateSpecificationVisualToData();

    $('#modalVisual').modal('show');
};

function editRowDimension(data) {
    debugger;

    $('#trTemplateSpecificationDimension_txtTemplateSpecificationDimensionID').val(tableDimension.rows($(data).parent().parent()).data()[0][2]);
    $('#trTemplateSpecificationDimension_intLineID').val(tableDimension.rows($(data).parent().parent()).data()[0][3]);
    $('#trTemplateSpecificationDimension_intTestID').val(tableDimension.rows($(data).parent().parent()).data()[0][4]);
    $('#trTemplateSpecificationDimension_txtTestCode').val(tableDimension.rows($(data).parent().parent()).data()[0][5]);
    $('#trTemplateSpecificationDimension_txtTestClass').val(tableDimension.rows($(data).parent().parent()).data()[0][6]);
    $('#trTemplateSpecificationDimension_txtTestUnit').val(tableDimension.rows($(data).parent().parent()).data()[0][7]);
    $('#trTemplateSpecificationDimension_txtTestMethodCode').val(tableDimension.rows($(data).parent().parent()).data()[0][8]);
    $('#trTemplateSpecificationDimension_txtTestType').val(tableDimension.rows($(data).parent().parent()).data()[0][9]);
    $('#trTemplateSpecificationDimension_txtParameterType')
            .val(tableDimension.rows($(data).parent().parent()).data()[0][10])
            .trigger('change');
    $('#trTemplateSpecificationDimension_txtDetail').val(tableDimension.rows($(data).parent().parent()).data()[0][11]);


    $('#SaveEditDetailDimension').val("EDIT");
    p_UItrTemplateSpecificationDimensionToData();

    $('#modalDimension').modal('show');
};

function editRowMaterial(data) {
    debugger;

    $('#trTemplateSpecificationMaterial_txtTemplateSpecificationMaterialID').val(tableMaterial.rows($(data).parent().parent()).data()[0][2]);
    $('#trTemplateSpecificationMaterial_intLineID').val(tableMaterial.rows($(data).parent().parent()).data()[0][3]);
    $('#trTemplateSpecificationMaterial_intTestID').val(tableMaterial.rows($(data).parent().parent()).data()[0][4]);
    $('#trTemplateSpecificationMaterial_txtTestCode').val(tableMaterial.rows($(data).parent().parent()).data()[0][5]);
    $('#trTemplateSpecificationMaterial_txtTestClass').val(tableMaterial.rows($(data).parent().parent()).data()[0][6]);
    $('#trTemplateSpecificationMaterial_txtTestUnit').val(tableMaterial.rows($(data).parent().parent()).data()[0][7]);
    $('#trTemplateSpecificationMaterial_txtTestMethodCode').val(tableMaterial.rows($(data).parent().parent()).data()[0][8]);
    $('#trTemplateSpecificationMaterial_txtTestType').val(tableMaterial.rows($(data).parent().parent()).data()[0][9]);
    $('#trTemplateSpecificationMaterial_txtParameterType')
        .val(tableMaterial.rows($(data).parent().parent()).data()[0][10])
        .trigger('change');
    $('#trTemplateSpecificationMaterial_txtDetail').val(tableMaterial.rows($(data).parent().parent()).data()[0][11]);

    $('#SaveEditDetailMaterial').val("EDIT");
    p_UItrTemplateSpecificationMaterialToData();

    $('#modalMaterial').modal('show');
};

function editRowPackaging(data) {
    debugger;

    $('#trTemplateSpecificationPackaging_txtTemplateSpecificationPackagingID').val(tablePackaging.rows($(data).parent().parent()).data()[0][2]);
    $('#trTemplateSpecificationPackaging_intLineID').val(tablePackaging.rows($(data).parent().parent()).data()[0][3]);
    $('#trTemplateSpecificationPackaging_intTestID').val(tablePackaging.rows($(data).parent().parent()).data()[0][4]);
    $('#trTemplateSpecificationPackaging_txtTestCode').val(tablePackaging.rows($(data).parent().parent()).data()[0][5]);
    $('#trTemplateSpecificationPackaging_txtTestClass').val(tablePackaging.rows($(data).parent().parent()).data()[0][6]);
    $('#trTemplateSpecificationPackaging_txtTestUnit').val(tablePackaging.rows($(data).parent().parent()).data()[0][7]);

    $('#trTemplateSpecificationPackaging_txtTestMethodCode').val(tablePackaging.rows($(data).parent().parent()).data()[0][8]);
    $('#trTemplateSpecificationPackaging_txtTestType').val(tablePackaging.rows($(data).parent().parent()).data()[0][9]);
    $('#trTemplateSpecificationPackaging_txtParameterType')
        .val(tablePackaging.rows($(data).parent().parent()).data()[0][10])
        .trigger('change');
    $('#trTemplateSpecificationPackaging_txtDetail').val(tablePackaging.rows($(data).parent().parent()).data()[0][11]);

    $('#SaveEditDetailPackaging').val("EDIT");
    p_UItrTemplateSpecificationPackagingToData();

    $('#modalPackaging').modal('show');
};

function editRowContaminant(data) {
    debugger;

    $('#trTemplateSpecificationContaminant_txtTemplateSpecificationContaminantID').val(tableContaminant.rows($(data).parent().parent()).data()[0][2]);
    $('#trTemplateSpecificationContaminant_intLineID').val(tableContaminant.rows($(data).parent().parent()).data()[0][3]);
    $('#trTemplateSpecificationContaminant_intTestID').val(tableContaminant.rows($(data).parent().parent()).data()[0][4]);
    $('#trTemplateSpecificationContaminant_txtTestCode').val(tableContaminant.rows($(data).parent().parent()).data()[0][5]);
    $('#trTemplateSpecificationContaminant_txtTestClass').val(tableContaminant.rows($(data).parent().parent()).data()[0][6]);
    $('#trTemplateSpecificationContaminant_txtTestUnit').val(tableContaminant.rows($(data).parent().parent()).data()[0][7]);

    $('#trTemplateSpecificationContaminant_txtTestMethodCode').val(tableContaminant.rows($(data).parent().parent()).data()[0][8]);
    $('#trTemplateSpecificationContaminant_txtTestType').val(tableContaminant.rows($(data).parent().parent()).data()[0][9]);
    $('#trTemplateSpecificationContaminant_txtParameterType')
        .val(tableContaminant.rows($(data).parent().parent()).data()[0][10])
        .trigger('change');
    $('#trTemplateSpecificationContaminant_txtDetail').val(tableContaminant.rows($(data).parent().parent()).data()[0][11]);

    $('#SaveEditDetailContaminant').val("EDIT");
    p_UItrTemplateSpecificationContaminantToData();

    $('#modalContaminant').modal('show');
};

//function editRowVisual(data) {
//    debugger;

//    var row = tableVisual.row($(data).closest('tr')).data();

//    if (!row) return;

//    $('#trTemplateSpecificationVisual_txtTrTemplateSpecificationVisualID').val(row[2]);
//    $('#trTemplateSpecificationVisual_intLineID').val(row[3]);
//    $('#trTemplateSpecificationVisual_intTestID').val(row[4]);
//    $('#trTemplateSpecificationVisual_txtTestCode').val(row[5]);
//    $('#trTemplateSpecificationVisual_txtTestClass').val(row[6]);
//    $('#trTemplateSpecificationVisual_txtTestUnit').val(row[7]);
//    $('#trTemplateSpecificationVisual_txtTestMethodCode').val(row[8]);
//    $('#trTemplateSpecificationVisual_txtTestType').val(row[9]);
//    $('#trTemplateSpecificationVisual_txtTarget').val(row[10]);
//    $('#trTemplateSpecificationVisual_txtMin').val(row[11]);
//    $('#trTemplateSpecificationVisual_txtMax').val(row[12]);
//    $('#trTemplateSpecificationVisual_txtResult').val(row[13]);
//    $('#trTemplateSpecificationVisual_txtStatus').val(row[14]);
//    $('#trTemplateSpecificationVisual_txtDetail').val(row[15]);
//    $('#trTemplateSpecificationVisual_bitNotAnalyzed').val(row[16]);

//    $('#SaveEditDetailVisual').val("EDIT");

//    p_UItrTemplateSpecificationVisualToData();
//    $('#modalVisual').modal('show');
//}
function deleteRowVisualdata(data) {
    debugger;
    clsGlobal.getConfirmation("Delete this data?",
        function (result) {
            if (result == true) {
                debugger;
                tableVisual.rows($(data).parent().parent().parent()).remove().draw();
                // Refresh urutan
                refreshVisualLineIDs();
            } else {
                return false;
            }
        });
};

function deleteRowDimensiondata(data) {
    debugger;
    clsGlobal.getConfirmation("Delete this data?",
        function (result) {
            if (result == true) {
                debugger;
                tableDimension.rows($(data).parent().parent().parent()).remove().draw();
                // Refresh urutan
                refreshDimensionLineIDs();
            } else {
                return false;
            }
        });
};

function deleteRowMaterialdata(data) {
    debugger;
    clsGlobal.getConfirmation("Delete this data?",
        function (result) {
            if (result == true) {
                debugger;
                tableMaterial.rows($(data).parent().parent().parent()).remove().draw();
                // Refresh urutan
                refreshMaterialLineIDs();
            } else {
                return false;
            }
        });
};

function deleteRowPackagingdata(data) {
    debugger;
    clsGlobal.getConfirmation("Delete this data?",
        function (result) {
            if (result == true) {
                debugger;
                tablePackaging.rows($(data).parent().parent().parent()).remove().draw();
                // Refresh urutan
                refreshPackagingLineIDs();
            } else {
                return false;
            }
        });
};

function deleteRowContaminantdata(data) {
    debugger;
    clsGlobal.getConfirmation("Delete this data?",
        function (result) {
            if (result == true) {
                debugger;
                tableContaminant.rows($(data).parent().parent().parent()).remove().draw();
                // Refresh urutan
                refreshContaminantLineIDs();
            } else {
                return false;
            }
        });
};

function isDuplicateTestCode(testCode) {
    let isDuplicate = false;
    tableVisual.rows().every(function () {
        var data = this.data();
        if (data[5] === testCode) { // Kolom ke-5 = Test Code
            isDuplicate = true;
            return false; // stop loop
        }
    });
    return isDuplicate;
}

//function GetValidateDetail(txtTestCode, tab) {
//    debugger;

//    var context = "true";

//    if (tab === 'visual') {
//        var objData = JSON.parse($("#txtHiddenDetailVisualObject").val());

//        for (var i = 0; i < objData.length; i++) {
//            if ((objData[i].trTemplateSpecificationVisual_txtTestCode.toUpperCase() == txtTestCode.toUpperCase())) {
//                context = "false"
//                break;
//            }
//        }
//    }
//    if (tab === 'dimension') {
//        var objData = JSON.parse($("#txtHiddenDetailDimensionObject").val());

//        for (var i = 0; i < objData.length; i++) {
//            if ((objData[i].trTemplateSpecificationDimension_txtTestCode.toUpperCase() == txtTestCode.toUpperCase())) {
//                context = "false"
//                break;
//            }
//        }
//    }
//    if (tab === 'material') {
//        var objData = JSON.parse($("#txtHiddenDetailMaterialObject").val());

//        for (var i = 0; i < objData.length; i++) {
//            if ((objData[i].trTemplateSpecificationMaterial_txtTestCode.toUpperCase() == txtTestCode.toUpperCase())) {
//                context = "false"
//                break;
//            }
//        }
//    }
//    if (tab === 'packaging') {
//        var objData = JSON.parse($("#txtHiddenDetailPackagingObject").val());

//        for (var i = 0; i < objData.length; i++) {
//            if ((objData[i].trTemplateSpecificationPackaging_txtTestCode.toUpperCase() == txtTestCode.toUpperCase())) {
//                context = "false"
//                break;
//            }
//        }
//    }
//    if (tab === 'contaminant') {
//        var objData = JSON.parse($("#txtHiddenDetailContaminantObject").val());

//        for (var i = 0; i < objData.length; i++) {
//            if ((objData[i].trTemplateSpecificationContaminant_txtTestCode.toUpperCase() == txtTestCode.toUpperCase())) {
//                context = "false"
//                break;
//            }
//        }
//    }

    

//    return context;
//}

function GetValidateDetail(txtTestCode, tab, currentID = null) {
    var context = "true";

        if (tab === 'visual') {
            var objData = JSON.parse($("#txtHiddenDetailVisualObject").val());
            debugger;
            for (var i = 0; i < objData.length; i++) {
                const codeMatch = objData[i].trTemplateSpecificationVisual_txtTestCode.toUpperCase() === txtTestCode.toUpperCase();
                const isDifferentID = currentID == null || objData[i].trTemplateSpecificationVisual_txtTemplateSpecificationVisualID !== currentID;

                if (codeMatch && isDifferentID) {
                    context = "false";
                    break;
                }
            }
        }
        if (tab === 'dimension') {
            var objData = JSON.parse($("#txtHiddenDetailDimensionObject").val());
            debugger;
            for (var i = 0; i < objData.length; i++) {
                const codeMatch = objData[i].trTemplateSpecificationDimension_txtTestCode.toUpperCase() === txtTestCode.toUpperCase();
                const isDifferentID = currentID == null || objData[i].trTemplateSpecificationDimension_txtTemplateSpecificationDimensionID !== currentID;

                if (codeMatch && isDifferentID) {
                    context = "false";
                    break;
                }
            }
        }
        if (tab === 'material') {
            var objData = JSON.parse($("#txtHiddenDetailMaterialObject").val());

            for (var i = 0; i < objData.length; i++) {
                const codeMatch = objData[i].trTemplateSpecificationMaterial_txtTestCode.toUpperCase() === txtTestCode.toUpperCase();
                const isDifferentID = currentID == null || objData[i].trTemplateSpecificationMaterial_txtTemplateSpecificationMaterialID !== currentID;

                if (codeMatch && isDifferentID) {
                    context = "false";
                    break;
                }
            }
        }
        if (tab === 'packaging') {
            var objData = JSON.parse($("#txtHiddenDetailPackagingObject").val());

            for (var i = 0; i < objData.length; i++) {
                const codeMatch = objData[i].trTemplateSpecificationPackaging_txtTestCode.toUpperCase() === txtTestCode.toUpperCase();
                const isDifferentID = currentID == null || objData[i].trTemplateSpecificationPackaging_txtTemplateSpecificationPackagingID !== currentID;

                if (codeMatch && isDifferentID) {
                    context = "false";
                    break;
                }
            }
        }
        if (tab === 'contaminant') {
            var objData = JSON.parse($("#txtHiddenDetailContaminantObject").val());

            for (var i = 0; i < objData.length; i++) {
                const codeMatch = objData[i].trTemplateSpecificationContaminant_txtTestCode.toUpperCase() === txtTestCode.toUpperCase();
                const isDifferentID = currentID == null || objData[i].trTemplateSpecificationContaminant_txtTemplateSpecificationContaminantID !== currentID;

                if (codeMatch && isDifferentID) {
                    context = "false";
                    break;
                }
            }
        }

    

    return context;
}

$('#btnSubmitVisualDetail').bind('click',
    function () {
        try {
            debugger;
            p_UItrTemplateSpecificationVisualToData();
            debugger;
            var tab = 'visual';
            if ($('#tableVisual tbody td').length > 1) {
                //if ($('#trTemplateSpecificationVisual_txtTestCode').val() == "") {
                //    //$('#modalVisual').modal('hide');
                //    clsGlobal.getAlert("Pastikan bahwa semua kolom sudah Anda isi!!!!!!");
                //}
                if (!validateFormTabVisual()) {
                    return;
                }
                else if (GetValidateDetail($('#trTemplateSpecificationVisual_txtTestCode').val(), tab, $('#trTemplateSpecificationVisual_txtTemplateSpecificationVisualID').val()) == "false") {
                    //$('#modalVisual').modal('hide');
                    clsGlobal.getAlert("Test Code " + $('#trTemplateSpecificationVisual_txtTestCode').val() + " already exist!!!");
                }
                else {
                    debugger;

                    var b = $('#SaveEditDetailVisual').val();
                    if ($('#SaveEditDetailVisual').val() == "SUBMIT") {
                        var txtTrTemplateSpecificationVisualID = generateUUID();
                        let visualLineCounter = tableVisual.rows().count() + 1;
                        tableVisual.row.add([
                            '<div style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowVisual(this)" class="btn btn-primary btn-sm me-1">' +
                            '<i class="fas fa-edit me-1"></i> Edit' +
                            '</button>' +
                            '</div>',
                            '<div style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="deleteRowVisualdata(this)" class="btn btn-danger btn-sm">' +
                            '<i class="fas fa-trash me-1"></i> Delete' +
                            '</button>' +
                            '</div>',
                            txtTrTemplateSpecificationVisualID,
                            visualLineCounter++,
                            $('#trTemplateSpecificationVisual_intTestID').val(),
                            $('#trTemplateSpecificationVisual_txtTestCode').val(),
                            $('#trTemplateSpecificationVisual_txtTestClass').val(),
                            $('#trTemplateSpecificationVisual_txtTestUnit').val(),
                            $('#trTemplateSpecificationVisual_txtTestMethodCode').val(),
                            $('#trTemplateSpecificationVisual_txtTestType').val(),
                            $('#trTemplateSpecificationVisual_txtParameterType').val(),
                            $('#trTemplateSpecificationVisual_txtDetail').val()
                        ]).draw(false);

                        p_UItrTemplateSpecificationVisualToData();
                        $('#modalVisual').modal('hide');
                    } else {
                        //$.blockUI();
                        debugger;
                        tableVisual.clear().draw(false);
                        var idGuid = $('#trTemplateSpecificationVisual_txtTemplateSpecificationVisualID').val();
                        var jsonData = JSON.parse($("#txtHiddenDetailVisualObject").val());
                        for (var i = 0; i < jsonData.length; i++) {
                            if ((jsonData[i].trTemplateSpecificationVisual_txtTemplateSpecificationVisualID == $('#trTemplateSpecificationVisual_txtTemplateSpecificationVisualID').val())) {

                                tableVisual.row.add([
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowVisual(this)" class="btn btn-primary btn-sm me-1">' +
                                    '<i class="fas fa-edit me-1"></i> Edit' +
                                    '</button>' +
                                    '</div>',
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="deleteRowVisualdata(this)" class="btn btn-danger btn-sm">' +
                                    '<i class="fas fa-trash me-1"></i> Delete' +
                                    '</button>' +
                                    '</div>',
                                    $('#trTemplateSpecificationVisual_txtTemplateSpecificationVisualID').val(),
                                    $('#trTemplateSpecificationVisual_intLineID').val(),
                                    $('#trTemplateSpecificationVisual_intTestID').val(),
                                    $('#trTemplateSpecificationVisual_txtTestCode').val(),
                                    $('#trTemplateSpecificationVisual_txtTestClass').val(),
                                    $('#trTemplateSpecificationVisual_txtTestUnit').val(),
                                    $('#trTemplateSpecificationVisual_txtTestMethodCode').val(),
                                    $('#trTemplateSpecificationVisual_txtTestType').val(),
                                    $('#trTemplateSpecificationVisual_txtParameterType').val(),
                                    $('#trTemplateSpecificationVisual_txtDetail').val()
                                ]).draw(false);
                            } else {
                                debugger;

                                tableVisual.row.add([
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowVisual(this)" class="btn btn-primary btn-sm me-1">' +
                                    '<i class="fas fa-edit me-1"></i> Edit' +
                                    '</button>' +
                                    '</div>',
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="deleteRowVisualdata(this)" class="btn btn-danger btn-sm">' +
                                    '<i class="fas fa-trash me-1"></i> Delete' +
                                    '</button>' +
                                    '</div>',
                                    jsonData[i].trTemplateSpecificationVisual_txtTemplateSpecificationVisualID,
                                    jsonData[i].trTemplateSpecificationVisual_intLineID,
                                    jsonData[i].trTemplateSpecificationVisual_intTestID,
                                    jsonData[i].trTemplateSpecificationVisual_txtTestCode,
                                    jsonData[i].trTemplateSpecificationVisual_txtTestClass,
                                    jsonData[i].trTemplateSpecificationVisual_txtTestUnit,
                                    jsonData[i].trTemplateSpecificationVisual_txtTestMethodCode,
                                    jsonData[i].trTemplateSpecificationVisual_txtTestType,
                                    jsonData[i].trTemplateSpecificationVisual_txtParameterType,
                                    jsonData[i].trTemplateSpecificationVisual_txtDetail
                                ]).draw(false);
                            }
                        }
                        p_UItrTemplateSpecificationVisualToData();
                        $('#modalVisual').modal('hide');
                        //    $.UnblockUI();
                    }
                };
            } else {
                //if ($('#trTemplateSpecificationVisual_txtTestCode').val() == "") {
                //    //$('#modalVisual').modal('hide');
                //    clsGlobal.getAlert("Pastikan bahwa semua kolom sudah Anda isi!!!!!!");
                //}
                if (!validateFormTabVisual()) {
                    return;
                }
                else {
                    debugger;

                    var b = $('#SaveEditDetailVisual').val();
                    if ($('#SaveEditDetailVisual').val() == "SUBMIT") {
                        var txtTrTemplateSpecificationVisualID = generateUUID();
                        let visualLineCounter = tableVisual.rows().count() + 1;
                        tableVisual.row.add([
                            '<div style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowVisual(this)" class="btn btn-primary btn-sm me-1">' +
                            '<i class="fas fa-edit me-1"></i> Edit' +
                            '</button>' +
                            '</div>',
                            '<div style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="deleteRowVisualdata(this)" class="btn btn-danger btn-sm">' +
                            '<i class="fas fa-trash me-1"></i> Delete' +
                            '</button>' +
                            '</div>',
                            txtTrTemplateSpecificationVisualID,
                            visualLineCounter++,
                            $('#trTemplateSpecificationVisual_intTestID').val(),
                            $('#trTemplateSpecificationVisual_txtTestCode').val(),
                            $('#trTemplateSpecificationVisual_txtTestClass').val(),
                            $('#trTemplateSpecificationVisual_txtTestUnit').val(),
                            $('#trTemplateSpecificationVisual_txtTestMethodCode').val(),
                            $('#trTemplateSpecificationVisual_txtTestType').val(),
                            $('#trTemplateSpecificationVisual_txtParameterType').val(),
                            $('#trTemplateSpecificationVisual_txtDetail').val()
                        ]).draw(false);
                        p_UItrTemplateSpecificationVisualToData();
                        $('#modalVisual').modal('hide');
                    } else {
                        //$.blockUI();
                        debugger;
                        tableVisual.clear().draw(false);

                        var jsonData = JSON.parse($("#txtHiddenDetailVisualObject").val());
                        for (var i = 0; i < jsonData.length; i++) {
                            if ((jsonData[i].trTemplateSpecificationVisual_txtTemplateSpecificationVisualID == $('#trTemplateSpecificationVisual_txtTemplateSpecificationVisualID').val())) {

                                tableVisual.row.add([
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowVisual(this)" class="btn btn-primary btn-sm me-1">' +
                                    '<i class="fas fa-edit me-1"></i> Edit' +
                                    '</button>' +
                                    '</div>',
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="deleteRowVisualdata(this)" class="btn btn-danger btn-sm">' +
                                    '<i class="fas fa-trash me-1"></i> Delete' +
                                    '</button>' +
                                    '</div>',
                                    $('#trTemplateSpecificationVisual_txtTemplateSpecificationVisualID').val(),
                                    $('#trTemplateSpecificationVisual_intLineID').val(),
                                    $('#trTemplateSpecificationVisual_intTestID').val(),
                                    $('#trTemplateSpecificationVisual_txtTestCode').val(),
                                    $('#trTemplateSpecificationVisual_txtTestClass').val(),
                                    $('#trTemplateSpecificationVisual_txtTestUnit').val(),
                                    $('#trTemplateSpecificationVisual_txtTestMethodCode').val(),
                                    $('#trTemplateSpecificationVisual_txtTestType').val(),
                                    $('#trTemplateSpecificationVisual_txtParameterType').val(),
                                    $('#trTemplateSpecificationVisual_txtDetail').val()
                                ]).draw(false);
                            } else {
                                debugger;

                                tableVisual.row.add([
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowVisual(this)" class="btn btn-primary btn-sm me-1">' +
                                    '<i class="fas fa-edit me-1"></i> Edit' +
                                    '</button>' +
                                    '</div>',
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="deleteRowVisualdata(this)" class="btn btn-danger btn-sm">' +
                                    '<i class="fas fa-trash me-1"></i> Delete' +
                                    '</button>' +
                                    '</div>',
                                    jsonData[i].trTemplateSpecificationVisual_txtTemplateSpecificationVisualID,
                                    jsonData[i].trTemplateSpecificationVisual_intLineID,
                                    jsonData[i].trTemplateSpecificationVisual_intTestID,
                                    jsonData[i].trTemplateSpecificationVisual_txtTestCode,
                                    jsonData[i].trTemplateSpecificationVisual_txtTestClass,
                                    jsonData[i].trTemplateSpecificationVisual_txtTestUnit,
                                    jsonData[i].trTemplateSpecificationVisual_txtTestMethodCode,
                                    jsonData[i].trTemplateSpecificationVisual_txtTestType,
                                    jsonData[i].trTemplateSpecificationVisual_txtParameterType,
                                    jsonData[i].trTemplateSpecificationVisual_txtDetail
                                ]).draw(false);
                            }
                        }
                        p_UItrTemplateSpecificationVisualToData();
                        $('#modalVisual').modal('hide');
                        //    $.UnblockUI();
                    }
                };
            }

        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    });

$('#btnSubmitDimensionDetail').bind('click',
    function () {
        try {
            debugger;
            p_UItrTemplateSpecificationDimensionToData();
            debugger;
            var tab = 'dimension';
            if ($('#tableDimension tbody td').length > 1) {
                //if ($('#trTemplateSpecificationDimension_txtTestCode').val() == "") {
                //    //$('#modalRisk').modal('hide');
                //    clsGlobal.getAlert("Pastikan bahwa semua kolom sudah Anda isi!!!!!!");
                //}
                if (!validateFormTabDimension()) {
                    return;
                }
                else if (GetValidateDetail($('#trTemplateSpecificationDimension_txtTestCode').val(), tab, $('#trTemplateSpecificationDimension_txtTemplateSpecificationDimensionID').val()) == "false") {
                    //$('#modalVisual').modal('hide');
                    clsGlobal.getAlert("Test Code " + $('#trTemplateSpecificationDimension_txtTestCode').val() + " already exist!!!");
                }
                else {
                    debugger;
                    var b = $('#SaveEditDetailDimension').val();
                    if ($('#SaveEditDetailDimension').val() == "SUBMIT") {
                        var txtTrTemplateSpecificationDimensionID = generateUUID();
                        let DimensionLineCounter = tableDimension.rows().count() + 1;
                        tableDimension.row.add([
                            '<div style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowDimension(this)" class="btn btn-primary btn-sm me-1">' +
                            '<i class="fas fa-edit me-1"></i> Edit' +
                            '</button>' +
                            '</div>',
                            '<div style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="deleteRowDimensiondata(this)" class="btn btn-danger btn-sm">' +
                            '<i class="fas fa-trash me-1"></i> Delete' +
                            '</button>' +
                            '</div>',
                            txtTrTemplateSpecificationDimensionID,
                            DimensionLineCounter++,
                            $('#trTemplateSpecificationDimension_intTestID').val(),
                            $('#trTemplateSpecificationDimension_txtTestCode').val(),
                            $('#trTemplateSpecificationDimension_txtTestClass').val(),
                            $('#trTemplateSpecificationDimension_txtTestUnit').val(),
                            $('#trTemplateSpecificationDimension_txtTestMethodCode').val(),
                            $('#trTemplateSpecificationDimension_txtTestType').val(),
                            $('#trTemplateSpecificationDimension_txtParameterType').val(),
                            $('#trTemplateSpecificationDimension_txtDetail').val()
                        ]).draw(false);

                        p_UItrTemplateSpecificationDimensionToData();
                        $('#modalDimension').modal('hide');
                    } else {
                        //$.blockUI();
                        debugger;
                        tableDimension.clear().draw(false);

                        var jsonData = JSON.parse($("#txtHiddenDetailDimensionObject").val());
                        for (var i = 0; i < jsonData.length; i++) {
                            if ((jsonData[i].trTemplateSpecificationDimension_txtTemplateSpecificationDimensionID == $('#trTemplateSpecificationDimension_txtTemplateSpecificationDimensionID').val())) {

                                tableDimension.row.add([
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowDimension(this)" class="btn btn-primary btn-sm me-1">' +
                                    '<i class="fas fa-edit me-1"></i> Edit' +
                                    '</button>' +
                                    '</div>',
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="deleteRowDimensiondata(this)" class="btn btn-danger btn-sm">' +
                                    '<i class="fas fa-trash me-1"></i> Delete' +
                                    '</button>' +
                                    '</div>',
                                    $('#trTemplateSpecificationDimension_txtTemplateSpecificationDimensionID').val(),
                                    $('#trTemplateSpecificationDimension_intLineID').val(),
                                    $('#trTemplateSpecificationDimension_intTestID').val(),
                                    $('#trTemplateSpecificationDimension_txtTestCode').val(),
                                    $('#trTemplateSpecificationDimension_txtTestClass').val(),
                                    $('#trTemplateSpecificationDimension_txtTestUnit').val(),
                                    $('#trTemplateSpecificationDimension_txtTestMethodCode').val(),
                                    $('#trTemplateSpecificationDimension_txtTestType').val(),
                                    $('#trTemplateSpecificationDimension_txtParameterType').val(),
                                    $('#trTemplateSpecificationDimension_txtDetail').val()
                                ]).draw(false);
                            } else {
                                debugger;

                                tableDimension.row.add([
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowDimension(this)" class="btn btn-primary btn-sm me-1">' +
                                    '<i class="fas fa-edit me-1"></i> Edit' +
                                    '</button>' +
                                    '</div>',
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="deleteRowDimensiondata(this)" class="btn btn-danger btn-sm">' +
                                    '<i class="fas fa-trash me-1"></i> Delete' +
                                    '</button>' +
                                    '</div>',
                                    jsonData[i].trTemplateSpecificationDimension_txtTemplateSpecificationDimensionID,
                                    jsonData[i].trTemplateSpecificationDimension_intLineID,
                                    jsonData[i].trTemplateSpecificationDimension_intTestID,
                                    jsonData[i].trTemplateSpecificationDimension_txtTestCode,
                                    jsonData[i].trTemplateSpecificationDimension_txtTestClass,
                                    jsonData[i].trTemplateSpecificationDimension_txtTestUnit,
                                    jsonData[i].trTemplateSpecificationDimension_txtTestMethodCode,
                                    jsonData[i].trTemplateSpecificationDimension_txtTestType,
                                    jsonData[i].trTemplateSpecificationDimension_txtParameterType,
                                    jsonData[i].trTemplateSpecificationDimension_txtDetail
                                ]).draw(false);
                            }
                        }
                        p_UItrTemplateSpecificationDimensionToData();
                        $('#modalDimension').modal('hide');
                        //    $.UnblockUI();
                    }
                };
            } else {
                //if ($('#trTemplateSpecificationDimension_txtTestCode').val() == "") {
                //    //$('#modalDimension').modal('hide');
                //    clsGlobal.getAlert("Pastikan bahwa semua kolom sudah Anda isi!!!!!!");
                //}
                if (!validateFormTabDimension()) {
                    return;
                }
                else {
                    debugger;
                    var b = $('#SaveEditDetailDimension').val();
                    if ($('#SaveEditDetailDimension').val() == "SUBMIT") {
                        var txtTrTemplateSpecificationDimensionID = generateUUID();
                        let DimensionLineCounter = tableDimension.rows().count() + 1;
                        tableDimension.row.add([
                            '<div style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowDimension(this)" class="btn btn-primary btn-sm me-1">' +
                            '<i class="fas fa-edit me-1"></i> Edit' +
                            '</button>' +
                            '</div>',
                            '<div style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="deleteRowDimensiondata(this)" class="btn btn-danger btn-sm">' +
                            '<i class="fas fa-trash me-1"></i> Delete' +
                            '</button>' +
                            '</div>',
                            txtTrTemplateSpecificationDimensionID,
                            DimensionLineCounter++,
                            $('#trTemplateSpecificationDimension_intTestID').val(),
                            $('#trTemplateSpecificationDimension_txtTestCode').val(),
                            $('#trTemplateSpecificationDimension_txtTestClass').val(),
                            $('#trTemplateSpecificationDimension_txtTestUnit').val(),
                            $('#trTemplateSpecificationDimension_txtTestMethodCode').val(),
                            $('#trTemplateSpecificationDimension_txtTestType').val(),
                            $('#trTemplateSpecificationDimension_txtParameterType').val(),
                            $('#trTemplateSpecificationDimension_txtDetail').val()
                        ]).draw(false);
                        p_UItrTemplateSpecificationDimensionToData();
                        $('#modalDimension').modal('hide');
                    } else {
                        //$.blockUI();
                        debugger;
                        tableDimension.clear().draw(false);

                        var jsonData = JSON.parse($("#txtHiddenDetailDimensionObject").val());
                        for (var i = 0; i < jsonData.length; i++) {
                            if ((jsonData[i].trTemplateSpecificationDimension_txtTemplateSpecificationDimensionID == $('#trTemplateSpecificationDimension_txtTemplateSpecificationDimensionID').val())) {

                                tableDimension.row.add([
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowDimension(this)" class="btn btn-primary btn-sm me-1">' +
                                    '<i class="fas fa-edit me-1"></i> Edit' +
                                    '</button>' +
                                    '</div>',
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="deleteRowDimensiondata(this)" class="btn btn-danger btn-sm">' +
                                    '<i class="fas fa-trash me-1"></i> Delete' +
                                    '</button>' +
                                    '</div>',
                                    $('#trTemplateSpecificationDimension_txtTemplateSpecificationDimensionID').val(),
                                    $('#trTemplateSpecificationDimension_intLineID').val(),
                                    $('#trTemplateSpecificationDimension_intTestID').val(),
                                    $('#trTemplateSpecificationDimension_txtTestCode').val(),
                                    $('#trTemplateSpecificationDimension_txtTestClass').val(),
                                    $('#trTemplateSpecificationDimension_txtTestUnit').val(),
                                    $('#trTemplateSpecificationDimension_txtTestMethodCode').val(),
                                    $('#trTemplateSpecificationDimension_txtTestType').val(),
                                    $('#trTemplateSpecificationDimension_txtParameterType').val(),
                                    $('#trTemplateSpecificationDimension_txtDetail').val()
                                ]).draw(false);
                            } else {
                                debugger;

                                tableDimension.row.add([
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowDimension(this)" class="btn btn-primary btn-sm me-1">' +
                                    '<i class="fas fa-edit me-1"></i> Edit' +
                                    '</button>' +
                                    '</div>',
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="deleteRowDimensiondata(this)" class="btn btn-danger btn-sm">' +
                                    '<i class="fas fa-trash me-1"></i> Delete' +
                                    '</button>' +
                                    '</div>',
                                    jsonData[i].trTemplateSpecificationDimension_txtTemplateSpecificationDimensionID,
                                    jsonData[i].trTemplateSpecificationDimension_intLineID,
                                    jsonData[i].trTemplateSpecificationDimension_intTestID,
                                    jsonData[i].trTemplateSpecificationDimension_txtTestCode,
                                    jsonData[i].trTemplateSpecificationDimension_txtTestClass,
                                    jsonData[i].trTemplateSpecificationDimension_txtTestUnit,
                                    jsonData[i].trTemplateSpecificationDimension_txtTestMethodCode,
                                    jsonData[i].trTemplateSpecificationDimension_txtTestType,
                                    jsonData[i].trTemplateSpecificationDimension_txtParameterType,
                                    jsonData[i].trTemplateSpecificationDimension_txtDetail
                                ]).draw(false);
                            }
                        }
                        p_UItrTemplateSpecificationDimensionToData();
                        $('#modalDimension').modal('hide');
                        //    $.UnblockUI();
                    }
                };
            }

        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    });

$('#btnSubmitMaterialDetail').bind('click',
    function () {
        try {
            debugger;
            p_UItrTemplateSpecificationMaterialToData();
            debugger;
            var tab = 'material';
            if ($('#tableMaterial tbody td').length > 1) {
                //if ($('#trTemplateSpecificationMaterial_txtTestCode').val() == "") {
                //    //$('#modalRisk').modal('hide');
                //    clsGlobal.getAlert("Pastikan bahwa semua kolom sudah Anda isi!!!!!!");
                //}
                if (!validateFormTabMaterial()) {
                    return;
                }
                else if (GetValidateDetail($('#trTemplateSpecificationMaterial_txtTestCode').val(), tab, $('#trTemplateSpecificationMaterial_txtTemplateSpecificationMaterialID').val()) == "false") {
                    //$('#modalVisual').modal('hide');
                    clsGlobal.getAlert("Test Code " + $('#trTemplateSpecificationMaterial_txtTestCode').val() + " already exist!!!");
                }
                else {
                    debugger;
                    var b = $('#SaveEditDetailMaterial').val();
                    if ($('#SaveEditDetailMaterial').val() == "SUBMIT") {
                        var txtTemplateSpecificationMaterialID = generateUUID();
                        let MaterialLineCounter = tableMaterial.rows().count() + 1;
                        tableMaterial.row.add([
                            '<div style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowMaterial(this)" class="btn btn-primary btn-sm me-1">' +
                            '<i class="fas fa-edit me-1"></i> Edit' +
                            '</button>' +
                            '</div>',
                            '<div style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="deleteRowMaterialdata(this)" class="btn btn-danger btn-sm">' +
                            '<i class="fas fa-trash me-1"></i> Delete' +
                            '</button>' +
                            '</div>',
                            txtTemplateSpecificationMaterialID,
                            MaterialLineCounter++,
                            $('#trTemplateSpecificationMaterial_intTestID').val(),
                            $('#trTemplateSpecificationMaterial_txtTestCode').val(),
                            $('#trTemplateSpecificationMaterial_txtTestClass').val(),
                            $('#trTemplateSpecificationMaterial_txtTestUnit').val(),
                            $('#trTemplateSpecificationMaterial_txtTestMethodCode').val(),
                            $('#trTemplateSpecificationMaterial_txtTestType').val(),
                            $('#trTemplateSpecificationMaterial_txtParameterType').val(),
                            $('#trTemplateSpecificationMaterial_txtDetail').val()
                        ]).draw(false);

                        p_UItrTemplateSpecificationMaterialToData();
                        $('#modalMaterial').modal('hide');
                    } else {
                        //$.blockUI();
                        debugger;
                        tableMaterial.clear().draw(false);

                        var jsonData = JSON.parse($("#txtHiddenDetailMaterialObject").val());
                        for (var i = 0; i < jsonData.length; i++) {
                            if ((jsonData[i].trTemplateSpecificationMaterial_txtTemplateSpecificationMaterialID == $('#trTemplateSpecificationMaterial_txtTemplateSpecificationMaterialID').val())) {

                                tableMaterial.row.add([
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowMaterial(this)" class="btn btn-primary btn-sm me-1">' +
                                    '<i class="fas fa-edit me-1"></i> Edit' +
                                    '</button>' +
                                    '</div>',
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="deleteRowMaterialdata(this)" class="btn btn-danger btn-sm">' +
                                    '<i class="fas fa-trash me-1"></i> Delete' +
                                    '</button>' +
                                    '</div>',
                                    $('#trTemplateSpecificationMaterial_txtTemplateSpecificationMaterialID').val(),
                                    $('#trTemplateSpecificationMaterial_intLineID').val(),
                                    $('#trTemplateSpecificationMaterial_intTestID').val(),
                                    $('#trTemplateSpecificationMaterial_txtTestCode').val(),
                                    $('#trTemplateSpecificationMaterial_txtTestClass').val(),
                                    $('#trTemplateSpecificationMaterial_txtTestUnit').val(),
                                    $('#trTemplateSpecificationMaterial_txtTestMethodCode').val(),
                                    $('#trTemplateSpecificationMaterial_txtTestType').val(),
                                    $('#trTemplateSpecificationMaterial_txtParameterType').val(),
                                    $('#trTemplateSpecificationMaterial_txtDetail').val()
                                ]).draw(false);
                            } else {
                                debugger;

                                tableMaterial.row.add([
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowMaterial(this)" class="btn btn-primary btn-sm me-1">' +
                                    '<i class="fas fa-edit me-1"></i> Edit' +
                                    '</button>' +
                                    '</div>',
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="deleteRowMaterialdata(this)" class="btn btn-danger btn-sm">' +
                                    '<i class="fas fa-trash me-1"></i> Delete' +
                                    '</button>' +
                                    '</div>',
                                    jsonData[i].trTemplateSpecificationMaterial_txtTemplateSpecificationMaterialID,
                                    jsonData[i].trTemplateSpecificationMaterial_intLineID,
                                    jsonData[i].trTemplateSpecificationMaterial_intTestID,
                                    jsonData[i].trTemplateSpecificationMaterial_txtTestCode,
                                    jsonData[i].trTemplateSpecificationMaterial_txtTestClass,
                                    jsonData[i].trTemplateSpecificationMaterial_txtTestUnit,
                                    jsonData[i].trTemplateSpecificationMaterial_txtTestMethodCode,
                                    jsonData[i].trTemplateSpecificationMaterial_txtTestType,
                                    jsonData[i].trTemplateSpecificationMaterial_txtParameterType,
                                    jsonData[i].trTemplateSpecificationMaterial_txtDetail
                                ]).draw(false);
                            }
                        }
                        p_UItrTemplateSpecificationMaterialToData();
                        $('#modalMaterial').modal('hide');
                        //    $.UnblockUI();
                    }
                };
            } else {
                //if ($('#trTemplateSpecificationMaterial_txtTestCode').val() == "") {
                //    //$('#modalMaterial').modal('hide');
                //    clsGlobal.getAlert("Pastikan bahwa semua kolom sudah Anda isi!!!!!!");
                //}
                if (!validateFormTabMaterial()) {
                    return;
                }
                else {
                    debugger;
                    var b = $('#SaveEditDetailMaterial').val();
                    if ($('#SaveEditDetailMaterial').val() == "SUBMIT") {
                        var txtTemplateSpecificationMaterialID = generateUUID();
                        let MaterialLineCounter = tableMaterial.rows().count() + 1;
                        tableMaterial.row.add([
                            '<div style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowMaterial(this)" class="btn btn-primary btn-sm me-1">' +
                            '<i class="fas fa-edit me-1"></i> Edit' +
                            '</button>' +
                            '</div>',
                            '<div style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="deleteRowMaterialdata(this)" class="btn btn-danger btn-sm">' +
                            '<i class="fas fa-trash me-1"></i> Delete' +
                            '</button>' +
                            '</div>',
                            txtTemplateSpecificationMaterialID,
                            MaterialLineCounter++,
                            $('#trTemplateSpecificationMaterial_intTestID').val(),
                            $('#trTemplateSpecificationMaterial_txtTestCode').val(),
                            $('#trTemplateSpecificationMaterial_txtTestClass').val(),
                            $('#trTemplateSpecificationMaterial_txtTestUnit').val(),
                            $('#trTemplateSpecificationMaterial_txtTestMethodCode').val(),
                            $('#trTemplateSpecificationMaterial_txtTestType').val(),
                            $('#trTemplateSpecificationMaterial_txtParameterType').val(),
                            $('#trTemplateSpecificationMaterial_txtDetail').val()
                        ]).draw(false);
                        p_UItrTemplateSpecificationMaterialToData();
                        $('#modalMaterial').modal('hide');
                    } else {
                        //$.blockUI();
                        debugger;
                        tableMaterial.clear().draw(false);

                        var jsonData = JSON.parse($("#txtHiddenDetailMaterialObject").val());
                        for (var i = 0; i < jsonData.length; i++) {
                            if ((jsonData[i].trTemplateSpecificationMaterial_txtTemplateSpecificationMaterialID == $('#trTemplateSpecificationMaterial_txtTemplateSpecificationMaterialID').val())) {

                                tableMaterial.row.add([
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowMaterial(this)" class="btn btn-primary btn-sm me-1">' +
                                    '<i class="fas fa-edit me-1"></i> Edit' +
                                    '</button>' +
                                    '</div>',
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="deleteRowMaterialdata(this)" class="btn btn-danger btn-sm">' +
                                    '<i class="fas fa-trash me-1"></i> Delete' +
                                    '</button>' +
                                    '</div>',
                                    $('#trTemplateSpecificationMaterial_txtTemplateSpecificationMaterialID').val(),
                                    $('#trTemplateSpecificationMaterial_intLineID').val(),
                                    $('#trTemplateSpecificationMaterial_intTestID').val(),
                                    $('#trTemplateSpecificationMaterial_txtTestCode').val(),
                                    $('#trTemplateSpecificationMaterial_txtTestClass').val(),
                                    $('#trTemplateSpecificationMaterial_txtTestUnit').val(),
                                    $('#trTemplateSpecificationMaterial_txtTestMethodCode').val(),
                                    $('#trTemplateSpecificationMaterial_txtTestType').val(),
                                    $('#trTemplateSpecificationMaterial_txtParameterType').val(),
                                    $('#trTemplateSpecificationMaterial_txtDetail').val(),
                                ]).draw(false);
                            } else {
                                debugger;

                                tableMaterial.row.add([
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowMaterial(this)" class="btn btn-primary btn-sm me-1">' +
                                    '<i class="fas fa-edit me-1"></i> Edit' +
                                    '</button>' +
                                    '</div>',
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="deleteRowMaterialdata(this)" class="btn btn-danger btn-sm">' +
                                    '<i class="fas fa-trash me-1"></i> Delete' +
                                    '</button>' +
                                    '</div>',
                                    jsonData[i].trTemplateSpecificationMaterial_txtTemplateSpecificationMaterialID,
                                    jsonData[i].trTemplateSpecificationMaterial_intLineID,
                                    jsonData[i].trTemplateSpecificationMaterial_intTestID,
                                    jsonData[i].trTemplateSpecificationMaterial_txtTestCode,
                                    jsonData[i].trTemplateSpecificationMaterial_txtTestClass,
                                    jsonData[i].trTemplateSpecificationMaterial_txtTestUnit,
                                    jsonData[i].trTemplateSpecificationMaterial_txtTestMethodCode,
                                    jsonData[i].trTemplateSpecificationMaterial_txtTestType,
                                    jsonData[i].trTemplateSpecificationMaterial_txtParameterType,
                                    jsonData[i].trTemplateSpecificationMaterial_txtDetail
                                ]).draw(false);
                            }
                        }
                        p_UItrTemplateSpecificationMaterialToData();
                        $('#modalMaterial').modal('hide');
                        //    $.UnblockUI();
                    }
                };
            }

        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    });

$('#btnSubmitPackagingDetail').bind('click',
    function () {
        try {
            debugger;
            p_UItrTemplateSpecificationPackagingToData();
            debugger;
            var tab = 'packaging';
            if ($('#tablePackaging tbody td').length > 1) {
                //if ($('#trTemplateSpecificationPackaging_txtTestCode').val() == "") {
                //    //$('#modalRisk').modal('hide');
                //    clsGlobal.getAlert("Pastikan bahwa semua kolom sudah Anda isi!!!!!!");
                //}
                if (!validateFormTabPackaging()) {
                    return;
                }
                else if (GetValidateDetail($('#trTemplateSpecificationPackaging_txtTestCode').val(), tab, $('#trTemplateSpecificationPackaging_txtTemplateSpecificationPackagingID').val()) == "false") {
                    //$('#modalVisual').modal('hide');
                    clsGlobal.getAlert("Test Code " + $('#trTemplateSpecificationPackaging_txtTestCode').val() + " already exist!!!");
                }
                else {
                    debugger;
                    var b = $('#SaveEditDetailPackaging').val();
                    if ($('#SaveEditDetailPackaging').val() == "SUBMIT") {
                        var txtTrTemplateSpecificationPackagingID = generateUUID();
                        let PackagingLineCounter = tablePackaging.rows().count() + 1;
                        tablePackaging.row.add([
                            '<div style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowPackaging(this)" class="btn btn-primary btn-sm me-1">' +
                            '<i class="fas fa-edit me-1"></i> Edit' +
                            '</button>' +
                            '</div>',
                            '<div style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="deleteRowPackagingdata(this)" class="btn btn-danger btn-sm">' +
                            '<i class="fas fa-trash me-1"></i> Delete' +
                            '</button>' +
                            '</div>',
                            txtTrTemplateSpecificationPackagingID,
                            PackagingLineCounter++,
                            $('#trTemplateSpecificationPackaging_intTestID').val(),
                            $('#trTemplateSpecificationPackaging_txtTestCode').val(),
                            $('#trTemplateSpecificationPackaging_txtTestClass').val(),
                            $('#trTemplateSpecificationPackaging_txtTestUnit').val(),
                            $('#trTemplateSpecificationPackaging_txtTestMethodCode').val(),
                            $('#trTemplateSpecificationPackaging_txtTestType').val(),
                            $('#trTemplateSpecificationPackaging_txtParameterType').val(),
                            $('#trTemplateSpecificationPackaging_txtDetail').val()
                        ]).draw(false);

                        p_UItrTemplateSpecificationPackagingToData();
                        $('#modalPackaging').modal('hide');
                    } else {
                        //$.blockUI();
                        debugger;
                        tablePackaging.clear().draw(false);

                        var jsonData = JSON.parse($("#txtHiddenDetailPackagingObject").val());
                        for (var i = 0; i < jsonData.length; i++) {
                            if ((jsonData[i].trTemplateSpecificationPackaging_txtTemplateSpecificationPackagingID == $('#trTemplateSpecificationPackaging_txtTemplateSpecificationPackagingID').val())) {

                                tablePackaging.row.add([
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowPackaging(this)" class="btn btn-primary btn-sm me-1">' +
                                    '<i class="fas fa-edit me-1"></i> Edit' +
                                    '</button>' +
                                    '</div>',
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="deleteRowPackagingdata(this)" class="btn btn-danger btn-sm">' +
                                    '<i class="fas fa-trash me-1"></i> Delete' +
                                    '</button>' +
                                    '</div>',
                                    $('#trTemplateSpecificationPackaging_txtTemplateSpecificationPackagingID').val(),
                                    $('#trTemplateSpecificationPackaging_intLineID').val(),
                                    $('#trTemplateSpecificationPackaging_intTestID').val(),
                                    $('#trTemplateSpecificationPackaging_txtTestCode').val(),
                                    $('#trTemplateSpecificationPackaging_txtTestClass').val(),
                                    $('#trTemplateSpecificationPackaging_txtTestUnit').val(),
                                    $('#trTemplateSpecificationPackaging_txtTestMethodCode').val(),
                                    $('#trTemplateSpecificationPackaging_txtTestType').val(),
                                    $('#trTemplateSpecificationPackaging_txtParameterType').val(),
                                    $('#trTemplateSpecificationPackaging_txtDetail').val()
                                ]).draw(false);
                            } else {
                                debugger;

                                tablePackaging.row.add([
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowPackaging(this)" class="btn btn-primary btn-sm me-1">' +
                                    '<i class="fas fa-edit me-1"></i> Edit' +
                                    '</button>' +
                                    '</div>',
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="deleteRowPackagingdata(this)" class="btn btn-danger btn-sm">' +
                                    '<i class="fas fa-trash me-1"></i> Delete' +
                                    '</button>' +
                                    '</div>',
                                    jsonData[i].trTemplateSpecificationPackaging_txtTemplateSpecificationPackagingID,
                                    jsonData[i].trTemplateSpecificationPackaging_intLineID,
                                    jsonData[i].trTemplateSpecificationPackaging_intTestID,
                                    jsonData[i].trTemplateSpecificationPackaging_txtTestCode,
                                    jsonData[i].trTemplateSpecificationPackaging_txtTestClass,
                                    jsonData[i].trTemplateSpecificationPackaging_txtTestUnit,
                                    jsonData[i].trTemplateSpecificationPackaging_txtTestMethodCode,
                                    jsonData[i].trTemplateSpecificationPackaging_txtTestType,
                                    jsonData[i].trTemplateSpecificationPackaging_txtParameterType,
                                    jsonData[i].trTemplateSpecificationPackaging_txtDetail
                                ]).draw(false);
                            }
                        }
                        p_UItrTemplateSpecificationPackagingToData();
                        $('#modalPackaging').modal('hide');
                        //    $.UnblockUI();
                    }
                };
            } else {
                //if ($('#trTemplateSpecificationPackaging_txtTestCode').val() == "") {
                //    //$('#modalPackaging').modal('hide');
                //    clsGlobal.getAlert("Pastikan bahwa semua kolom sudah Anda isi!!!!!!");
                //}
                if (!validateFormTabPackaging()) {
                    return;
                }
                else {
                    debugger;
                    var b = $('#SaveEditDetailPackaging').val();
                    if ($('#SaveEditDetailPackaging').val() == "SUBMIT") {
                        var txtTrTemplateSpecificationPackagingID = generateUUID();
                        let PackagingLineCounter = tablePackaging.rows().count() + 1;
                        tablePackaging.row.add([
                            '<div style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowPackaging(this)" class="btn btn-primary btn-sm me-1">' +
                            '<i class="fas fa-edit me-1"></i> Edit' +
                            '</button>' +
                            '</div>',
                            '<div style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="deleteRowPackagingdata(this)" class="btn btn-danger btn-sm">' +
                            '<i class="fas fa-trash me-1"></i> Delete' +
                            '</button>' +
                            '</div>',
                            txtTrTemplateSpecificationPackagingID,
                            PackagingLineCounter++,
                            $('#trTemplateSpecificationPackaging_intTestID').val(),
                            $('#trTemplateSpecificationPackaging_txtTestCode').val(),
                            $('#trTemplateSpecificationPackaging_txtTestClass').val(),
                            $('#trTemplateSpecificationPackaging_txtTestUnit').val(),
                            $('#trTemplateSpecificationPackaging_txtTestMethodCode').val(),
                            $('#trTemplateSpecificationPackaging_txtTestType').val(),
                            $('#trTemplateSpecificationPackaging_txtParameterType').val(),
                            $('#trTemplateSpecificationPackaging_txtDetail').val()
                        ]).draw(false);
                        p_UItrTemplateSpecificationPackagingToData();
                        $('#modalPackaging').modal('hide');
                    } else {
                        //$.blockUI();
                        debugger;
                        tablePackaging.clear().draw(false);

                        var jsonData = JSON.parse($("#txtHiddenDetailPackagingObject").val());
                        for (var i = 0; i < jsonData.length; i++) {
                            if ((jsonData[i].trTemplateSpecificationPackaging_txtTemplateSpecificationPackagingID == $('#trTemplateSpecificationPackaging_txtTemplateSpecificationPackagingID').val())) {

                                tablePackaging.row.add([
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowPackaging(this)" class="btn btn-primary btn-sm me-1">' +
                                    '<i class="fas fa-edit me-1"></i> Edit' +
                                    '</button>' +
                                    '</div>',
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="deleteRowPackagingdata(this)" class="btn btn-danger btn-sm">' +
                                    '<i class="fas fa-trash me-1"></i> Delete' +
                                    '</button>' +
                                    '</div>',
                                    $('#trTemplateSpecificationPackaging_txtTemplateSpecificationPackagingID').val(),
                                    $('#trTemplateSpecificationPackaging_intLineID').val(),
                                    $('#trTemplateSpecificationPackaging_intTestID').val(),
                                    $('#trTemplateSpecificationPackaging_txtTestCode').val(),
                                    $('#trTemplateSpecificationPackaging_txtTestClass').val(),
                                    $('#trTemplateSpecificationPackaging_txtTestUnit').val(),
                                    $('#trTemplateSpecificationPackaging_txtTestMethodCode').val(),
                                    $('#trTemplateSpecificationPackaging_txtTestType').val(),
                                    $('#trTemplateSpecificationPackaging_txtParameterType').val(),
                                    $('#trTemplateSpecificationPackaging_txtDetail').val()
                                ]).draw(false);
                            } else {
                                debugger;

                                tablePackaging.row.add([
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowPackaging(this)" class="btn btn-primary btn-sm me-1">' +
                                    '<i class="fas fa-edit me-1"></i> Edit' +
                                    '</button>' +
                                    '</div>',
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="deleteRowPackagingdata(this)" class="btn btn-danger btn-sm">' +
                                    '<i class="fas fa-trash me-1"></i> Delete' +
                                    '</button>' +
                                    '</div>',
                                    jsonData[i].trTemplateSpecificationPackaging_txtTemplateSpecificationPackagingID,
                                    jsonData[i].trTemplateSpecificationPackaging_intLineID,
                                    jsonData[i].trTemplateSpecificationPackaging_intTestID,
                                    jsonData[i].trTemplateSpecificationPackaging_txtTestCode,
                                    jsonData[i].trTemplateSpecificationPackaging_txtTestClass,
                                    jsonData[i].trTemplateSpecificationPackaging_txtTestUnit,
                                    jsonData[i].trTemplateSpecificationPackaging_txtTestMethodCode,
                                    jsonData[i].trTemplateSpecificationPackaging_txtTestType,
                                    jsonData[i].trTemplateSpecificationPackaging_txtParameterType,
                                    jsonData[i].trTemplateSpecificationPackaging_txtDetail
                                ]).draw(false);
                            }
                        }
                        p_UItrTemplateSpecificationPackagingToData();
                        $('#modalPackaging').modal('hide');
                        //    $.UnblockUI();
                    }
                };
            }

        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    });

$('#btnSubmitContaminantDetail').bind('click',
    function () {
        try {
            debugger;
            p_UItrTemplateSpecificationContaminantToData();
            debugger;
            var tab = 'contaminant';
            if ($('#tableContaminant tbody td').length > 1) {
                //if ($('#trTemplateSpecificationContaminant_txtTestCode').val() == "") {
                //    //$('#modalRisk').modal('hide');
                //    clsGlobal.getAlert("Pastikan bahwa semua kolom sudah Anda isi!!!!!!");
                //}
                if (!validateFormTabContaminant()) {
                    return;
                }
                else if (GetValidateDetail($('#trTemplateSpecificationContaminant_txtTestCode').val(), tab, $('#trTemplateSpecificationContaminant_txtTemplateSpecificationContaminantID').val()) == "false") {
                    //$('#modalVisual').modal('hide');
                    clsGlobal.getAlert("Test Code " + $('#trTemplateSpecificationContaminant_txtTestCode').val() + " already exist!!!");
                }
                else {
                    debugger;
                    var b = $('#SaveEditDetailContaminant').val();
                    if ($('#SaveEditDetailContaminant').val() == "SUBMIT") {
                        var txtTrTemplateSpecificationContaminantID = generateUUID();
                        let ContaminantLineCounter = tableContaminant.rows().count() + 1;
                        tableContaminant.row.add([
                            '<div style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowContaminant(this)" class="btn btn-primary btn-sm me-1">' +
                            '<i class="fas fa-edit me-1"></i> Edit' +
                            '</button>' +
                            '</div>',
                            '<div style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="deleteRowContaminantdata(this)" class="btn btn-danger btn-sm">' +
                            '<i class="fas fa-trash me-1"></i> Delete' +
                            '</button>' +
                            '</div>',
                            txtTrTemplateSpecificationContaminantID,
                            ContaminantLineCounter++,
                            $('#trTemplateSpecificationContaminant_intTestID').val(),
                            $('#trTemplateSpecificationContaminant_txtTestCode').val(),
                            $('#trTemplateSpecificationContaminant_txtTestClass').val(),
                            $('#trTemplateSpecificationContaminant_txtTestUnit').val(),
                            $('#trTemplateSpecificationContaminant_txtTestMethodCode').val(),
                            $('#trTemplateSpecificationContaminant_txtTestType').val(),
                            $('#trTemplateSpecificationContaminant_txtParameterType').val(),
                            $('#trTemplateSpecificationContaminant_txtDetail').val()
                        ]).draw(false);

                        p_UItrTemplateSpecificationContaminantToData();
                        $('#modalContaminant').modal('hide');
                    } else {
                        //$.blockUI();
                        debugger;
                        tableContaminant.clear().draw(false);

                        var jsonData = JSON.parse($("#txtHiddenDetailContaminantObject").val());
                        for (var i = 0; i < jsonData.length; i++) {
                            if ((jsonData[i].trTemplateSpecificationContaminant_txtTemplateSpecificationContaminantID == $('#trTemplateSpecificationContaminant_txtTemplateSpecificationContaminantID').val())) {

                                tableContaminant.row.add([
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowContaminant(this)" class="btn btn-primary btn-sm me-1">' +
                                    '<i class="fas fa-edit me-1"></i> Edit' +
                                    '</button>' +
                                    '</div>',
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="deleteRowContaminantdata(this)" class="btn btn-danger btn-sm">' +
                                    '<i class="fas fa-trash me-1"></i> Delete' +
                                    '</button>' +
                                    '</div>',
                                    $('#trTemplateSpecificationContaminant_txtTemplateSpecificationContaminantID').val(),
                                    $('#trTemplateSpecificationContaminant_intLineID').val(),
                                    $('#trTemplateSpecificationContaminant_intTestID').val(),
                                    $('#trTemplateSpecificationContaminant_txtTestCode').val(),
                                    $('#trTemplateSpecificationContaminant_txtTestClass').val(),
                                    $('#trTemplateSpecificationContaminant_txtTestUnit').val(),
                                    $('#trTemplateSpecificationContaminant_txtTestMethodCode').val(),
                                    $('#trTemplateSpecificationContaminant_txtTestType').val(),
                                    $('#trTemplateSpecificationContaminant_txtParameterType').val(),
                                    $('#trTemplateSpecificationContaminant_txtDetail').val()
                                ]).draw(false);
                            } else {
                                debugger;

                                tableContaminant.row.add([
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowContaminant(this)" class="btn btn-primary btn-sm me-1">' +
                                    '<i class="fas fa-edit me-1"></i> Edit' +
                                    '</button>' +
                                    '</div>',
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="deleteRowContaminantdata(this)" class="btn btn-danger btn-sm">' +
                                    '<i class="fas fa-trash me-1"></i> Delete' +
                                    '</button>' +
                                    '</div>',
                                    jsonData[i].trTemplateSpecificationContaminant_txtTemplateSpecificationContaminantID,
                                    jsonData[i].trTemplateSpecificationContaminant_intLineID,
                                    jsonData[i].trTemplateSpecificationContaminant_intTestID,
                                    jsonData[i].trTemplateSpecificationContaminant_txtTestCode,
                                    jsonData[i].trTemplateSpecificationContaminant_txtTestClass,
                                    jsonData[i].trTemplateSpecificationContaminant_txtTestUnit,
                                    jsonData[i].trTemplateSpecificationContaminant_txtTestMethodCode,
                                    jsonData[i].trTemplateSpecificationContaminant_txtTestType,
                                    jsonData[i].trTemplateSpecificationContaminant_txtParameterType,
                                    jsonData[i].trTemplateSpecificationContaminant_txtDetail
                                ]).draw(false);
                            }
                        }
                        p_UItrTemplateSpecificationContaminantToData();
                        $('#modalContaminant').modal('hide');
                        //    $.UnblockUI();
                    }
                };
            } else {
                //if ($('#trTemplateSpecificationContaminant_txtTestCode').val() == "") {
                //    //$('#modalContaminant').modal('hide');
                //    clsGlobal.getAlert("Pastikan bahwa semua kolom sudah Anda isi!!!!!!");
                //}
                if (!validateFormTabContaminant()) {
                    return;
                }
                else {
                    debugger;
                    var b = $('#SaveEditDetailContaminant').val();
                    if ($('#SaveEditDetailContaminant').val() == "SUBMIT") {
                        var txtTrTemplateSpecificationContaminantID = generateUUID();
                        let ContaminantLineCounter = tableContaminant.rows().count() + 1;
                        tableContaminant.row.add([
                            '<div style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowContaminant(this)" class="btn btn-primary btn-sm me-1">' +
                            '<i class="fas fa-edit me-1"></i> Edit' +
                            '</button>' +
                            '</div>',
                            '<div style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="deleteRowContaminantdata(this)" class="btn btn-danger btn-sm">' +
                            '<i class="fas fa-trash me-1"></i> Delete' +
                            '</button>' +
                            '</div>',
                            txtTrTemplateSpecificationContaminantID,
                            ContaminantLineCounter++,
                            $('#trTemplateSpecificationContaminant_intTestID').val(),
                            $('#trTemplateSpecificationContaminant_txtTestCode').val(),
                            $('#trTemplateSpecificationContaminant_txtTestClass').val(),
                            $('#trTemplateSpecificationContaminant_txtTestUnit').val(),
                            $('#trTemplateSpecificationContaminant_txtTestMethodCode').val(),
                            $('#trTemplateSpecificationContaminant_txtTestType').val(),
                            $('#trTemplateSpecificationContaminant_txtParameterType').val(),
                            $('#trTemplateSpecificationContaminant_txtDetail').val()
                        ]).draw(false);
                        p_UItrTemplateSpecificationContaminantToData();
                        $('#modalContaminant').modal('hide');
                    } else {
                        //$.blockUI();
                        debugger;
                        tableContaminant.clear().draw(false);

                        var jsonData = JSON.parse($("#txtHiddenDetailContaminantObject").val());
                        for (var i = 0; i < jsonData.length; i++) {
                            if ((jsonData[i].trTemplateSpecificationContaminant_txtTemplateSpecificationContaminantID == $('#trTemplateSpecificationContaminant_txtTemplateSpecificationContaminantID').val())) {

                                tableContaminant.row.add([
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowContaminant(this)" class="btn btn-primary btn-sm me-1">' +
                                    '<i class="fas fa-edit me-1"></i> Edit' +
                                    '</button>' +
                                    '</div>',
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="deleteRowContaminantdata(this)" class="btn btn-danger btn-sm">' +
                                    '<i class="fas fa-trash me-1"></i> Delete' +
                                    '</button>' +
                                    '</div>',
                                    $('#trTemplateSpecificationContaminant_txtTemplateSpecificationContaminantID').val(),
                                    $('#trTemplateSpecificationContaminant_intLineID').val(),
                                    $('#trTemplateSpecificationContaminant_intTestID').val(),
                                    $('#trTemplateSpecificationContaminant_txtTestCode').val(),
                                    $('#trTemplateSpecificationContaminant_txtTestClass').val(),
                                    $('#trTemplateSpecificationContaminant_txtTestUnit').val(),
                                    $('#trTemplateSpecificationContaminant_txtTestMethodCode').val(),
                                    $('#trTemplateSpecificationContaminant_txtTestType').val(),
                                    $('#trTemplateSpecificationContaminant_txtParameterType').val(),
                                    $('#trTemplateSpecificationContaminant_txtDetail').val()
                                ]).draw(false);
                            } else {
                                debugger;

                                tableContaminant.row.add([
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowContaminant(this)" class="btn btn-primary btn-sm me-1">' +
                                    '<i class="fas fa-edit me-1"></i> Edit' +
                                    '</button>' +
                                    '</div>',
                                    '<div style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="deleteRowContaminantdata(this)" class="btn btn-danger btn-sm">' +
                                    '<i class="fas fa-trash me-1"></i> Delete' +
                                    '</button>' +
                                    '</div>',
                                    jsonData[i].trTemplateSpecificationContaminant_txtTemplateSpecificationContaminantID,
                                    jsonData[i].trTemplateSpecificationContaminant_intLineID,
                                    jsonData[i].trTemplateSpecificationContaminant_intTestID,
                                    jsonData[i].trTemplateSpecificationContaminant_txtTestCode,
                                    jsonData[i].trTemplateSpecificationContaminant_txtTestClass,
                                    jsonData[i].trTemplateSpecificationContaminant_txtTestUnit,
                                    jsonData[i].trTemplateSpecificationContaminant_txtTestMethodCode,
                                    jsonData[i].trTemplateSpecificationContaminant_txtTestType,
                                    jsonData[i].trTemplateSpecificationContaminant_txtParameterType,
                                    jsonData[i].trTemplateSpecificationContaminant_txtDetail
                                ]).draw(false);
                            }
                        }
                        p_UItrTemplateSpecificationContaminantToData();
                        $('#modalContaminant').modal('hide');
                        //    $.UnblockUI();
                    }
                };
            }

        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    });
function refreshVisualLineIDs() {
    visualLineCounter = 1;
    tableVisual.rows().every(function (rowIdx, tableLoop, rowLoop) {
        let rowData = this.data();
        rowData[3] = visualLineCounter++; // index ke-3 sesuai posisi trTemplateSpecificationVisual_intLineID
        this.data(rowData);
    });
    tableVisual.draw(false);
}

function refreshDimensionLineIDs() {
    DimensionLineCounter = 1;
    tableDimension.rows().every(function (rowIdx, tableLoop, rowLoop) {
        let rowData = this.data();
        rowData[3] = DimensionLineCounter++; // index ke-3 sesuai posisi trTemplateSpecificationDimension_intLineID
        this.data(rowData);
    });
    tableDimension.draw(false);
}

function refreshMaterialLineIDs() {
    MaterialLineCounter = 1;
    tableMaterial.rows().every(function (rowIdx, tableLoop, rowLoop) {
        let rowData = this.data();
        rowData[3] = MaterialLineCounter++; // index ke-3 sesuai posisi trTemplateSpecificationMaterial_intLineID
        this.data(rowData);
    });
    tableMaterial.draw(false);
}

function refreshPackagingLineIDs() {
    PackagingLineCounter = 1;
    tablePackaging.rows().every(function (rowIdx, tableLoop, rowLoop) {
        let rowData = this.data();
        rowData[3] = PackagingLineCounter++; // index ke-3 sesuai posisi trTemplateSpecificationPackaging_intLineID
        this.data(rowData);
    });
    tablePackaging.draw(false);
}

function refreshContaminantLineIDs() {
    ContaminantLineCounter = 1;
    tableContaminant.rows().every(function (rowIdx, tableLoop, rowLoop) {
        let rowData = this.data();
        rowData[3] = ContaminantLineCounter++; // index ke-3 sesuai posisi trTemplateSpecificationContaminant_intLineID
        this.data(rowData);
    });
    tableContaminant.draw(false);
}

function p_btnLOVTestCodeClick() {
    try {
        LOV = clsGlobal.generateLOV("TEST_CODE_VISUAL", "trTemplateSpecificationVisual_txtTestCode");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVTestCodeDimensionClick() {
    try {
        LOV = clsGlobal.generateLOV("TEST_CODE_DIMENSION", "trTemplateSpecificationDimension_txtTestCode");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVTestCodeMaterialClick() {
    try {
        LOV = clsGlobal.generateLOV("TEST_CODE_MATERIAL", "trTemplateSpecificationMaterial_txtTestCode");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVTestCodePackagingClick() {
    try {
        LOV = clsGlobal.generateLOV("TEST_CODE_PACKAGING", "trTemplateSpecificationPackaging_txtTestCode");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVTestCodeContaminantClick() {
    try {
        LOV = clsGlobal.generateLOV("TEST_CODE_CONTAMINANT", "trTemplateSpecificationContaminant_txtTestCode");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVtxtTargetClick() {
    try {
        LOV = clsGlobal.generateLOV("PME_TARGET", "trTemplateSpecificationVisual_txtTarget", $("#trTemplateSpecificationVisual_intTestID").val());
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVtxtTargetDimensionClick() {
    try {
        LOV = clsGlobal.generateLOV("PME_TARGET", "trTemplateSpecificationDimension_txtTarget", $("#trTemplateSpecificationDimension_intTestID").val());
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVtxtTargetMaterialClick() {
    try {
        LOV = clsGlobal.generateLOV("PME_TARGET", "trTemplateSpecificationMaterial_txtTarget", $("#trTemplateSpecificationMaterial_intTestID").val());
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVtxtTargetPackagingClick() {
    try {
        LOV = clsGlobal.generateLOV("PME_TARGET", "trTemplateSpecificationPackaging_txtTarget", $("#trTemplateSpecificationPackaging_intTestID").val());
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVtxtTargetContaminantClick() {
    try {
        LOV = clsGlobal.generateLOV("PME_TARGET", "trTemplateSpecificationContaminant_txtTarget", $("#trTemplateSpecificationContaminant_intTestID").val());
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVParentSpecificationCodeClick() {
    try {
        LOV = clsGlobal.generateLOV("LOV_PARENTSPEC", "TxtParentSpecificationCode");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVTxtItemCodePMClick() {
    try {
        LOV = clsGlobal.generateLOV("LOV_ITEMCODEPMORACLE", "TxtItemCode");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVTxtNameOfPOTSClick() {
    try {
        LOV = clsGlobal.generateLOV("LOV_POTS", "TxtNameOfPOTS");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVStorageClick() {
    try {
        LOV = clsGlobal.generateLOV("ISP_STORAGE", "trTemplateSpecificationMaterialInformation_txtStorageCondition");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

$('#bitAssignToPOTS').change(function () {
    if ($(this).is(':checked')) {
        $('#btnTxtNameOfPOTS').prop('disabled', false);
    } else {
        $('#btnTxtNameOfPOTS').prop('disabled', true);
    }
});
//function updateFileLabel(inputId, labelId) {
//    const input = document.getElementById(inputId);
//    const label = document.getElementById(labelId);
//    const fileName = input.files.length > 0 ? input.files[0].name : "No file chosen.";
//    label.textContent = fileName;
//}

function updateFileLabel(inputId, labelId) {
    var input = document.getElementById(inputId);
    var label = document.getElementById(labelId);
    if (input.files.length > 0) {
        label.textContent = input.files[0].name;
    } else {
        label.textContent = "No file chosen.";
    }

    // Optional: Hide download if user selects new file
    if (inputId === "TxtFinalArtwork") {
        $('#finalArtworkDownload').hide();
        $('#trTemplateSpecificationMaterialInformation_intFinalArtworkID').val('');
    } else if (inputId === "TxtPackingStyle") {
        $('#packingStyleDownload').hide();
        $('#trTemplateSpecificationMaterialInformation_intPackingStyleID').val('');
    }
}

function isWaitingForApproval() {
    const documentStatus = $('#txtDocStatus').val().toUpperCase();
    return documentStatus === 'WAITING FOR APPROVAL';
}

function disableAllForApproval() {
    if (!$('#approval-notice').length) {
        $('<div id="approval-notice" class="approval-notice">' +
            '<i class="fas fa-exclamation-circle me-2"></i>' +
            'This document is in "Waiting for Approval" status and cannot be edited.' +
            '</div>').insertAfter('.card-body h4');
    }
    debugger;
    $('input, select, textarea').not('#btnBack, input[type=hidden]').prop('disabled', true);
    //$('button').not('#btnBack').prop('disabled', true);
    //$('.select2').select2({ disabled: true });
    //$('.tab-pane').addClass('form-disabled');
    debugger;
    //    disableTableOperations();
}

$('#btnAddDetailVisual').bind('click',
    function () {
        try {
            debugger;
            p_ShowBlankVisualDetail();
            $('#modalVisual').modal('show');
            $('#SaveEditDetailVisual').val("SUBMIT");

        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    });

//function disableTableOperations() {
//    const tables = Object.keys(config.tabs).map(key => `#${config.tabs[key].tableId}`);
//    debugger;
//    tables.forEach(tableId => {
//        $(`${tableId} .edit-btn, ${tableId} .remove-btn`).prop('disabled', true)
//            .addClass('btn-disabled')
//            .css({
//                'opacity': '0.5',
//                'pointer-events': 'none',
//                'cursor': 'not-allowed'
//            })
//            .attr('title', 'Editing is disabled while document is waiting for approval');
//    });
//}
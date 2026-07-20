//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false;
let attachmentFAList = [];
let attachmentPSList = [];
let attachmentList = [];
var modelData;

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    //clsGlobal.showLoading();

    //$('#bitAssignToPOTS').trigger('change');
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
    $('#dataTableAttachment').DataTable({
        columnDefs: [
            {
                targets: 0,
                orderable: false,
            }
        ]
    });

});

function p_InitForm() {

    p_initiateData();

}

const isEdit = document.getElementById("hdnIsEdit").value === "true";
document.getElementById("btnSaveText").textContent = isEdit ? "Update" : "Save";

//function inisiasiEvaluation() {
//    // Set tab header
//    document.getElementById('Evaluation').classList.add('active-tab');

//    // Show Evaluation tab content
//    const evalTab = document.getElementById('form-tabs-Evaluation');
//    evalTab.classList.add('show', 'active');
//}

/////TabDetail

function inisiasiVisual() {
    // Set tab header
   
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

    setTimeout(() => {
        tableVisual.columns.adjust().draw();
    }, 200); // delay kecil untuk memastikan tab terlihat
}

function inisiasiDimension() {
    // Set tab header
    document.getElementById('Visual').classList.remove('active-tab');
    document.getElementById('Material').classList.remove('active-tab');
    document.getElementById('Packaging').classList.remove('active-tab');
    document.getElementById('Contaminant').classList.remove('active-tab');
    document.getElementById('Information').classList.remove('active-tab');
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

    const infTab = document.getElementById('form-tabs-Information');
    infTab.classList.remove('show', 'active');

    // Show tab content
    const dimTab = document.getElementById('form-tabs-Dimension');
    dimTab.classList.add('show', 'active');

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
    document.getElementById('Information').classList.remove('active-tab');
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

    const infTab = document.getElementById('form-tabs-Information');
    infTab.classList.remove('show', 'active');

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
    document.getElementById('Information').classList.remove('active-tab');
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

    const infTab = document.getElementById('form-tabs-Information');
    infTab.classList.remove('show', 'active');

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
    document.getElementById('Information').classList.remove('active-tab');
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

    const infTab = document.getElementById('form-tabs-Information');
    infTab.classList.remove('show', 'active');

    // Show tab content
    const conTab = document.getElementById('form-tabs-Contaminant');
    conTab.classList.add('show', 'active');

    setTimeout(() => {
        tableContaminant.columns.adjust().draw();
    }, 200); // delay kecil untuk memastikan tab terlihat
}

function inisiasiInformation() {
    // Set tab header
    document.getElementById('Visual').classList.remove('active-tab');
    document.getElementById('Dimension').classList.remove('active-tab');
    document.getElementById('Material').classList.remove('active-tab');
    document.getElementById('Packaging').classList.remove('active-tab');
    document.getElementById('Information').classList.remove('active-tab');
    document.getElementById('Contaminant').classList.remove('active-tab');
    document.getElementById('Information').classList.add('active-tab');

    // Hide other tab content
    const visTab = document.getElementById('form-tabs-Visual');
    visTab.classList.remove('show', 'active');

    const dimTab = document.getElementById('form-tabs-Dimension');
    dimTab.classList.remove('show', 'active');

    const matTab = document.getElementById('form-tabs-Material');
    matTab.classList.remove('show', 'active');

    const pacTab = document.getElementById('form-tabs-Packaging');
    pacTab.classList.remove('show', 'active');

    const conTab = document.getElementById('form-tabs-Contaminant');
    conTab.classList.remove('show', 'active');

    // Show tab content

    const infTab = document.getElementById('form-tabs-Information');
    infTab.classList.add('show', 'active');
}

//=======================
// FUNCTION
//=======================

function setChooseLOV(txtValue) {
    var arr = txtValue.split('|');

   

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
            $("#TxtSpecPMDesc").val("SPEC " + arr[2]);
            $("#trItemSpecPMMaterialInformation_decShelfLife").val(arr[4]);
            $("#trItemSpecPMMaterialInformation_decPackingSize").val(arr[5]);
            break;
        case "TxtNameOfPOTS":
            $("#TxtNameOfPOTS").val(arr[2]);
            break;
        case "trItemSpecPMVisual_txtTestCode":
            //p_ItemValidation(arr[1]);
            p_txtTestCode_TextChanged(arr);
            break;
        case "trItemSpecPMDimension_txtTestCode":
            //p_ItemValidation(arr[1]);
            p_txtTestCodeDimension_TextChanged(arr);
            break;
        case "trItemSpecPMMaterial_txtTestCode":
            //p_ItemValidation(arr[1]);
            p_txtTestCodeMaterial_TextChanged(arr);
            break;
        case "trItemSpecPMPackaging_txtTestCode":
            //p_ItemValidation(arr[1]);
            p_txtTestCodePackaging_TextChanged(arr);
            break;
        case "trItemSpecPMContaminant_txtTestCode":
            //p_ItemValidation(arr[1]);
            p_txtTestCodeContaminant_TextChanged(arr);
            break;
        case "trItemSpecPMVisual_txtTarget":
            $("#trItemSpecPMVisual_txtTarget").val(arr[1]);
            break;
        case "trItemSpecPMDimension_txtTarget":
            $("#trItemSpecPMDimension_txtTarget").val(arr[1]);
            break;
        case "trItemSpecPMMaterial_txtTarget":
            $("#trItemSpecPMMaterial_txtTarget").val(arr[1]);
            break;
        case "trItemSpecPMPackaging_txtTarget":
            $("#trItemSpecPMPackaging_txtTarget").val(arr[1]);
            break;
        case "trItemSpecPMContaminant_txtTarget":
            $("#trItemSpecPMContaminant_txtTarget").val(arr[1]);
            break;
        case "COPYFROM_PME":
            p_COPYFROMPME_TextChanged(arr[1]);
            break;
        case "COPYFROM_TEMPLATESPEC":
            p_COPYFROMTEMPLATESPEC_TextChanged(arr[1]);
            break;
        case "trItemSpecPMMaterialInformation_txtStorageCondition":
            $("#trItemSpecPMMaterialInformation_intStorageCondition").val(arr[1]);
            $("#trItemSpecPMMaterialInformation_txtStorageCondition").val(arr[2]);
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
    "order": [[1, "asc"]],
    "columnDefs": [
        //{ className: "text-center", "targets": [2] },
        { "visible": false, "targets": [0, 2] },
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
    "order": [[1, "asc"]],
    "columnDefs": [
        //{ className: "text-center", "targets": [2] },
        //    { className: "hidden", "targets": [0, 3, 7, 12] },
        { "visible": false, "targets": [0, 2] },
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
    "order": [[1, "asc"]],
    "columnDefs": [
        //{ className: "text-center", "targets": [2] },
        //    { className: "hidden", "targets": [0, 3, 7, 12] },
        { "visible": false, "targets": [0, 2] },
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
    "order": [[1, "asc"]],
    "columnDefs": [
        //{ className: "text-center", "targets": [2] },
        //    { className: "hidden", "targets": [0, 3, 7, 12] },
        { "visible": false, "targets": [0, 2] },
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
    "order": [[1, "asc"]],
    "columnDefs": [
        //{ className: "text-center", "targets": [2] },
        //    { className: "hidden", "targets": [0, 3, 7, 12] },
        { "visible": false, "targets": [0, 2] },
    ]
})


//const input = document.getElementById('decPackingSize');

//// Saat user mengetik
//input.addEventListener('input', function (e) {
//    let value = input.value;

//    // Simpan posisi kursor
//    let selectionStart = input.selectionStart;
//    let afterCursor = value.length - selectionStart;

//    // Hapus koma
//    let clean = value.replace(/,/g, '');
//    clean = clean.replace(/[^0-9.]/g, '');

//    // Cek titik di akhir dan hanya satu titik
//    const hasTrailingDot = clean.endsWith('.') && clean.indexOf('.') === clean.lastIndexOf('.');

//    const parts = clean.split('.');
//    let intPart = parts[0];
//    let decPart = parts[1] || '';

//    if (parts.length > 2) {
//        decPart = parts.slice(1).join('');
//    }

//    decPart = decPart.substring(0, 2);
//    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

//    let formatted = decPart.length > 0
//        ? `${intPart}.${decPart}`
//        : (hasTrailingDot ? `${intPart}.` : intPart);

//    input.value = formatted;

//    // Perbaiki posisi kursor
//    const newCursor = input.value.length - afterCursor;
//    input.setSelectionRange(newCursor, newCursor);
//});

//// Saat user selesai mengetik (blur)
//input.addEventListener('blur', function () {
//    let value = input.value.replace(/,/g, '');

//    // Sudah ada titik? biarkan
//    if (value.includes('.')) return;

//    // Tambahkan .00
//    let number = parseFloat(value);
//    if (!isNaN(number)) {
//        // Format dengan ribuan dan tambahkan .00
//        let intPart = Math.floor(number).toString();
//        intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
//        input.value = `${intPart}.00`;
//    }
//});

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
   
    clsGlobal.showLoading();
    //$.blockUI();
    //$('#btnAddItem').hide();
    $.ajax({
        type: "POST",
        url: "/ItemSpecPM/InitiateData",
        data: { id: $('#TxtItemSpecPMId').val(), __RequestVerificationToken: $('#frmItemSpecPMDetail input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            //isEvaluationInitialized = true;
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                   
                    $("#txtHiddenObject").val(JSON.stringify(retDat.objData));


                    p_DataToUI(retDat.objData);
                    //// Proses attachment
                    //attachmentFAList = JSON.parse(retDat.objData.attachmentFinalAtwork || "[]");
                    //attachmentPSList = JSON.parse(retDat.objData.attachmentPackingStyle || "[]");
                    //debugger;
                    //// Populate file info
                    //if (attachmentFAList.length > 0) {
                    //    const fileName = attachmentFAList[0].fileName || "File selected";
                    //    $('#finalArtworkText').text(fileName);
                    //    $('#trItemSpecPMMaterialInformation_intFinalArtworkID').val(attachmentFAList[0].Id);
                    //    /*$('#finalArtworkDownloadLink').attr('href', '/Attachment/Download/' + attachmentFAList[0].id); // Ganti dengan path sesuai controller-mu*/
                    //    const downloadUrlFA = '/ItemSpecPM/Download/' + attachmentFAList[0].Id;
                    //    $('#finalArtworkDownload').show();

                    //    $('#finalArtworkDownloadLink').off('click').on('click', function () {
                    //        window.open(downloadUrlFA, '_blank');
                    //    });
                    //}

                    //if (attachmentPSList.length > 0) {
                    //    const fileName = attachmentPSList[0].fileName || "File selected";
                    //    $('#packingStyleText').text(fileName);
                    //    $('#trItemSpecPMMaterialInformation_intPackingStyleID').val(attachmentPSList[0].Id);
                    //    //$('#packingStyleDownloadLink').attr('href', '/Attachment/Download/' + attachmentPSList[0].id); // Ganti dengan path sesuai controller-mu
                    //    const downloadUrlPS = '/ItemSpecPM/Download/' + attachmentPSList[0].Id;
                    //    $('#packingStyleDownload').show();

                    //    $('#packingStyleDownloadLink').off('click').on('click', function () {
                    //        window.open(downloadUrlPS, '_blank');
                    //    });
                    //}

                    // Proses attachment
                    attachmentList = JSON.parse(retDat.objData.attachment || "[]");

                    var dataTable = $('#dataTableAttachment').DataTable();
                    dataTable.clear();

                    const dataRows = attachmentList
                        .filter(item => item.isDeleted !== true)
                        .map((item, index) => [
                            index + 1,
                            item.documentType ?? '',
                            item.remarks ?? '',
                            item.fileName ?? '',
                            `<button id="editBtn" class="btn btn-sm btn-primary edit-btn-attach" type="button" data-bs-toggle="modal" data-bs-target="#addAttachmentModal" data-index="${index}">
                                <i class="fas fa-edit"></i>
                             </button>
                             <button id="btnDownloadAttachment" class="btn btn-sm btn-warning download-btn-attach" type="button" data-index="${index}">
                                <i class="fas fa-download"></i>
                             </button>
                             <button id="btnDeleteFlowProcess" class="btn btn-sm btn-danger delete-btn-attach" type="button" data-bs-toggle="modal" data-bs-target="#deleteSubmitRequestTrial" data-index="${index}">
                                <i class="fas fa-trash"></i>
                             </button>`
                        ]);

                    dataTable.rows.add(dataRows);
                    dataTable.draw();

                    if (attachmentList.length > 0) {
                        const data = attachmentList[0];
                        indexModal = 0;
                        modalStateAttach = "edit";

                        $('#documentTypeAttachModal').val(data.documentType).trigger('change');
                        $('#remarksAttachModal').val(data.remarks);
                        $('#fileNameAttachModal').val(data.fileName); // atau data.fileName

                        //$('#addAttachmentModal').modal('show'); // Jika pakai Bootstrap
                        // $('#oldFileAttachModal').show(); // Jika manual
                    }
                    let jsonString = JSON.stringify(attachmentList);
                    $('#Attachments').val(jsonString);

                    tableVisual.clear().draw(false);

                    for (var i = 0; i < retDat.objData.listVmTrItemSpecPMVisual.length; i++) {

                        tableVisual.row.add([
                            retDat.objData.listVmTrItemSpecPMVisual[i].txtItemSpecPmvisualId,
                            retDat.objData.listVmTrItemSpecPMVisual[i].intLineNo,
                            retDat.objData.listVmTrItemSpecPMVisual[i].intTestId,
                            retDat.objData.listVmTrItemSpecPMVisual[i].txtTestCode,
                            retDat.objData.listVmTrItemSpecPMVisual[i].txtTestClass,
                            retDat.objData.listVmTrItemSpecPMVisual[i].txtTestUnit,
                            retDat.objData.listVmTrItemSpecPMVisual[i].txtTestMethodCode,
                            retDat.objData.listVmTrItemSpecPMVisual[i].txtTestType,
                            retDat.objData.listVmTrItemSpecPMVisual[i].txtTarget,
                            retDat.objData.listVmTrItemSpecPMVisual[i].txtMin,
                            retDat.objData.listVmTrItemSpecPMVisual[i].txtMax,
                            retDat.objData.listVmTrItemSpecPMVisual[i].txtParameterType,
                            retDat.objData.listVmTrItemSpecPMVisual[i].txtAnalyzedBy,
                            retDat.objData.listVmTrItemSpecPMVisual[i].txtRepeat,
                            retDat.objData.listVmTrItemSpecPMVisual[i].txtDetail
                        ]).draw(false);
                    }

                    tableDimension.clear().draw(false);

                    for (var i = 0; i < retDat.objData.listVmTrItemSpecPMDimension.length; i++) {

                        tableDimension.row.add([
                            retDat.objData.listVmTrItemSpecPMDimension[i].txtItemSpecPmdimensionId,
                            retDat.objData.listVmTrItemSpecPMDimension[i].intLineNo,
                            retDat.objData.listVmTrItemSpecPMDimension[i].intTestId,
                            retDat.objData.listVmTrItemSpecPMDimension[i].txtTestCode,
                            retDat.objData.listVmTrItemSpecPMDimension[i].txtTestClass,
                            retDat.objData.listVmTrItemSpecPMDimension[i].txtTestUnit,
                            retDat.objData.listVmTrItemSpecPMDimension[i].txtTestMethodCode,
                            retDat.objData.listVmTrItemSpecPMDimension[i].txtTestType,
                            retDat.objData.listVmTrItemSpecPMDimension[i].txtTarget,
                            retDat.objData.listVmTrItemSpecPMDimension[i].txtMin,
                            retDat.objData.listVmTrItemSpecPMDimension[i].txtMax,
                            retDat.objData.listVmTrItemSpecPMDimension[i].txtParameterType,
                            retDat.objData.listVmTrItemSpecPMDimension[i].txtAnalyzedBy,
                            retDat.objData.listVmTrItemSpecPMDimension[i].txtRepeat,
                            retDat.objData.listVmTrItemSpecPMDimension[i].txtDetail
                        ]).draw(false);
                    }

                    tableMaterial.clear().draw(false);

                    for (var i = 0; i < retDat.objData.listVmTrItemSpecPMMaterial.length; i++) {

                        tableMaterial.row.add([
                            retDat.objData.listVmTrItemSpecPMMaterial[i].txtItemSpecPmmaterialId,
                            retDat.objData.listVmTrItemSpecPMMaterial[i].intLineNo,
                            retDat.objData.listVmTrItemSpecPMMaterial[i].intTestId,
                            retDat.objData.listVmTrItemSpecPMMaterial[i].txtTestCode,
                            retDat.objData.listVmTrItemSpecPMMaterial[i].txtTestClass,
                            retDat.objData.listVmTrItemSpecPMMaterial[i].txtTestUnit,
                            retDat.objData.listVmTrItemSpecPMMaterial[i].txtTestMethodCode,
                            retDat.objData.listVmTrItemSpecPMMaterial[i].txtTestType,
                            retDat.objData.listVmTrItemSpecPMMaterial[i].txtTarget,
                            retDat.objData.listVmTrItemSpecPMMaterial[i].txtMin,
                            retDat.objData.listVmTrItemSpecPMMaterial[i].txtMax,
                            retDat.objData.listVmTrItemSpecPMMaterial[i].txtParameterType,
                            retDat.objData.listVmTrItemSpecPMMaterial[i].txtAnalyzedBy,
                            retDat.objData.listVmTrItemSpecPMMaterial[i].txtRepeat,
                            retDat.objData.listVmTrItemSpecPMMaterial[i].txtDetail
                        ]).draw(false);
                    }

                    tablePackaging.clear().draw(false);

                    for (var i = 0; i < retDat.objData.listVmTrItemSpecPMPackagingIntegrity.length; i++) {

                        tablePackaging.row.add([
                            retDat.objData.listVmTrItemSpecPMPackagingIntegrity[i].txtItemSpecPmpackagingIntegrityId,
                            retDat.objData.listVmTrItemSpecPMPackagingIntegrity[i].intLineNo,
                            retDat.objData.listVmTrItemSpecPMPackagingIntegrity[i].intTestId,
                            retDat.objData.listVmTrItemSpecPMPackagingIntegrity[i].txtTestCode,
                            retDat.objData.listVmTrItemSpecPMPackagingIntegrity[i].txtTestClass,
                            retDat.objData.listVmTrItemSpecPMPackagingIntegrity[i].txtTestUnit,
                            retDat.objData.listVmTrItemSpecPMPackagingIntegrity[i].txtTestMethodCode,
                            retDat.objData.listVmTrItemSpecPMPackagingIntegrity[i].txtTestType,
                            retDat.objData.listVmTrItemSpecPMPackagingIntegrity[i].txtTarget,
                            retDat.objData.listVmTrItemSpecPMPackagingIntegrity[i].txtMin,
                            retDat.objData.listVmTrItemSpecPMPackagingIntegrity[i].txtMax,
                            retDat.objData.listVmTrItemSpecPMPackagingIntegrity[i].txtParameterType,
                            retDat.objData.listVmTrItemSpecPMPackagingIntegrity[i].txtAnalyzedBy,
                            retDat.objData.listVmTrItemSpecPMPackagingIntegrity[i].txtRepeat,
                            retDat.objData.listVmTrItemSpecPMPackagingIntegrity[i].txtDetail
                        ]).draw(false);
                    }
                    tableContaminant.clear().draw(false);

                    for (var i = 0; i < retDat.objData.listVmTrItemSpecPMContaminant.length; i++) {

                        tableContaminant.row.add([
                            retDat.objData.listVmTrItemSpecPMContaminant[i].txtItemSpecPmcontaminantId,
                            retDat.objData.listVmTrItemSpecPMContaminant[i].intLineNo,
                            retDat.objData.listVmTrItemSpecPMContaminant[i].intTestId,
                            retDat.objData.listVmTrItemSpecPMContaminant[i].txtTestCode,
                            retDat.objData.listVmTrItemSpecPMContaminant[i].txtTestClass,
                            retDat.objData.listVmTrItemSpecPMContaminant[i].txtTestUnit,
                            retDat.objData.listVmTrItemSpecPMContaminant[i].txtTestMethodCode,
                            retDat.objData.listVmTrItemSpecPMContaminant[i].txtTestType,
                            retDat.objData.listVmTrItemSpecPMContaminant[i].txtTarget,
                            retDat.objData.listVmTrItemSpecPMContaminant[i].txtMin,
                            retDat.objData.listVmTrItemSpecPMContaminant[i].txtMax,
                            retDat.objData.listVmTrItemSpecPMContaminant[i].txtParameterType,
                            retDat.objData.listVmTrItemSpecPMContaminant[i].txtAnalyzedBy,
                            retDat.objData.listVmTrItemSpecPMContaminant[i].txtRepeat,
                            retDat.objData.listVmTrItemSpecPMContaminant[i].txtDetail
                        ]).draw(false);
                    }
                    
                   
                    if (retDat.objData.txtDocStatus == "WAITING FOR APPROVAL") {
                        disableAllForApproval();
                    }
                    if (retDat.objData.txtItemSpecPmid != "" && retDat.objData.txtItemSpecPmid != null) {
                        disableHeader();
                    }

                } else {
                   
                    p_showBlank();
                }
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }
           
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
   
    modelData = objData;
    $("#id").val(clsGlobal.parseToInteger(objData.id));
    $("#TxtItemSpecPMId").val(clsGlobal.parseToString(objData.txtItemSpecPmid));
    $("#TxtDocItemSpecPMNumber").val(clsGlobal.parseToString(objData.txtDocItemSpecPmnumber));
    $("#TxtDocStatus").val(clsGlobal.parseToString(objData.txtDocStatus));
    $("#IntParentSpecificationId").val(clsGlobal.parseToInteger(objData.intParentSpecificationId));
    $("#TxtParentSpecificationCode").val(clsGlobal.parseToString(objData.txtParentSpecificationCode));
    //$("#TxtParentSpecificationDesc").val(clsGlobal.parseToString(objData.txtParentSpecificationDesc));
    $("#IntParentSpecificationVersion").val(clsGlobal.parseToInteger(objData.intParentSpecificationVersion));
    $("#TxtItemCode").val(clsGlobal.parseToString(objData.txtItemCode));
    $("#TxtItemDesc").val(clsGlobal.parseToString(objData.txtItemDesc));
    $("#TxtSpecPMNo").val(clsGlobal.parseToString(objData.txtSpecPmno));
    $("#TxtSpecPMDesc").val(clsGlobal.parseToString(objData.txtSpecPmdesc));
    $('#bitAssignToPOTS').prop('checked', objData.bitAssignToPots);
    $("#TxtNameOfPOTS").val(clsGlobal.parseToString(objData.txtNameOfPots));
    $("#TxtRemark").val(clsGlobal.parseToString(objData.txtRemark));
    $("#IntItemSpecPMVersion").val(clsGlobal.parseToInteger(objData.intItemSpecPmversion));
    /*$("#dtmCreatedDate").val(clsGlobal.parseToString(objData.dtmCreatedDate));*/
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
    //p_DataToUITrItemSpecPMMaterialInformation(objData.trItemSpecPMMaterialInformations);

    $("#trItemSpecPMMaterialInformation_txtItemSpecPmmaterialInformationId").val(clsGlobal.parseToString(objData.trItemSpecPMMaterialInformations.txtItemSpecPmmaterialInformationId));
    $("#trItemSpecPMMaterialInformation_intItemSpecPmheaderId").val(clsGlobal.parseToString(objData.trItemSpecPMMaterialInformations.intItemSpecPmheaderId));
    $("#trItemSpecPMMaterialInformation_decPackingSize").val(clsGlobal.parseToDecimal(objData.trItemSpecPMMaterialInformations.intPackingSize));
    $("#trItemSpecPMMaterialInformation_intStorageCondition").val(clsGlobal.parseToInteger(objData.trItemSpecPMMaterialInformations.intStorageCondition));
    $("#trItemSpecPMMaterialInformation_txtStorageCondition").val(clsGlobal.parseToString(objData.trItemSpecPMMaterialInformations.txtStorageCondition));
    $("#trItemSpecPMMaterialInformation_decShelfLife").val(clsGlobal.parseToDecimal(objData.trItemSpecPMMaterialInformations.decShelfLife));
    $("#trItemSpecPMMaterialInformation_intFinalArtworkID").val(clsGlobal.parseToInteger(objData.trItemSpecPMMaterialInformations.intFinalArtworkID));
    $("#trItemSpecPMMaterialInformation_intPackingStyleID").val(clsGlobal.parseToInteger(objData.trItemSpecPMMaterialInformations.intPackingStyleID));

    $("#txtHiddenObject").val(JSON.stringify(objData));


}

function p_UIToData() {
   

    var jsonObj = [];
    var htmlJSON = $("#txtHiddenObject").val();
    jsonData = JSON.parse(htmlJSON);
    //jsonData.intReport_HeaderID = clsGlobal.parseToInteger($("#txtReportID").val());
    jsonData.txtItemSpecPmid = $("#TxtItemSpecPMId").val();
    jsonData.txtDocItemSpecPmnumber = $("#TxtDocItemSpecPMNumber").val();
    jsonData.intParentSpecificationId = clsGlobal.parseToInteger($("#IntParentSpecificationId").val());
    jsonData.txtParentSpecificationCode = $("#TxtParentSpecificationCode").val();
    //jsonData.txtParentSpecificationDesc = $("#TxtParentSpecificationDesc").val();
    jsonData.intParentSpecificationVersion = clsGlobal.parseToInteger($("#IntParentSpecificationVersion").val());
    jsonData.txtItemCode = $("#TxtItemCode").val();
    jsonData.txtItemDesc = $("#TxtItemDesc").val();
    jsonData.txtSpecPmno = $("#TxtSpecPMNo").val();
    jsonData.txtSpecPmdesc = $("#TxtSpecPMDesc").val();
    jsonData.intItemSpecPmversion = clsGlobal.parseToInteger($("#IntItemSpecPMVersion").val());
    jsonData.bitAssignToPOTS = clsGlobal.parseToBoolean($("#bitAssignToPOTS").prop("checked"));
    jsonData.txtNameOfPOTS = $("#TxtNameOfPOTS").val();
    jsonData.txtRemark = $("#TxtRemark").val();
    jsonData.txtDocStatus = $("#TxtDocStatus").val();

    jsonData.txtCreatedBy = $("#txtCreatedBy").val();
    jsonData.dtmCreatedDate = $("#dtmCreatedDate").val();
    jsonData.txtUpdatedBy = $("#txtUpdatedBy").val();
    jsonData.dtmUpdatedDate = $("#dtmUpdatedDate").val();

    jsonData.trItemSpecPMVisuals = $("#txtHiddenDetailVisualObject").val();
    jsonData.trItemSpecPMDimensions = $("#txtHiddenDetailDimensionObject").val();
    jsonData.trItemSpecPMMaterials = $("#txtHiddenDetailMaterialObject").val();
    jsonData.trItemSpecPMPackagingIntegrities = $("#txtHiddenDetailPackagingObject").val();
    jsonData.trItemSpecPMContaminants = $("#txtHiddenDetailContaminantObject").val();
    //jsonData.trItemSpecPMMaterialInformations = $("#txtHiddenDetailMaterialInformationObject").val();


    jsonData.trItemSpecPMMaterialInformation_txtItemSpecPmmaterialInformationId = $("#trItemSpecPMMaterialInformation_txtItemSpecPmmaterialInformationId").val();
    jsonData.trItemSpecPMMaterialInformation_intItemSpecPmheaderId = $("#trItemSpecPMMaterialInformation_intItemSpecPmheaderId").val();
    jsonData.trItemSpecPMMaterialInformation_decPackingSize = clsGlobal.parseToDecimal($("#trItemSpecPMMaterialInformation_decPackingSize").val());
    jsonData.trItemSpecPMMaterialInformation_intStorageCondition = clsGlobal.parseToInteger($("#trItemSpecPMMaterialInformation_intStorageCondition").val());
    jsonData.trItemSpecPMMaterialInformation_txtStorageCondition = $("#trItemSpecPMMaterialInformation_txtStorageCondition").val();
    jsonData.trItemSpecPMMaterialInformation_decShelfLife = clsGlobal.parseToDecimal($("#trItemSpecPMMaterialInformation_decShelfLife").val());
    //jsonData.trItemSpecPMMaterialInformation_intFinalArtworkID = clsGlobal.parseToInteger($("#trItemSpecPMMaterialInformation_intFinalArtworkID").val());
    //jsonData.trItemSpecPMMaterialInformation_intPackingStyleID = clsGlobal.parseToInteger($("#trItemSpecPMMaterialInformation_intPackingStyleID").val());


    jsonData.Attachment = $("#Attachments").val();

    $("#txtHiddenObject").val(JSON.stringify(jsonData));
}

function p_UIToDataTrItemSpecPMMaterialInformation() {
   

    var jsonObj = [];
    var htmlJSON = $("#txtHiddenDetailMaterialInformationObject").val();
    jsonData = JSON.parse(htmlJSON);
    //jsonData.intReport_HeaderID = clsGlobal.parseToInteger($("#txtReportID").val());
    jsonData.trItemSpecPMMaterialInformation_txtItemSpecPmmaterialInformationId = $("#trItemSpecPMMaterialInformation_txtItemSpecPmmaterialInformationId").val();
    jsonData.trItemSpecPMMaterialInformation_decPackingSize = clsGlobal.parseToDecimal($("#trItemSpecPMMaterialInformation_decPackingSize").val());
    jsonData.trItemSpecPMMaterialInformation_intStorageCondition = clsGlobal.parseToInteger($("#trItemSpecPMMaterialInformation_intStorageCondition").val());
    jsonData.trItemSpecPMMaterialInformation_txtStorageCondition = $("#trItemSpecPMMaterialInformation_txtStorageCondition").val();
    jsonData.trItemSpecPMMaterialInformation_decShelfLife = clsGlobal.parseToDecimal($("#trItemSpecPMMaterialInformation_decShelfLife").val());
    jsonData.trItemSpecPMMaterialInformation_intFinalArtworkID = clsGlobal.parseToInteger($("#trItemSpecPMMaterialInformation_intFinalArtworkID").val());
    jsonData.trItemSpecPMMaterialInformation_intPackingStyleID = clsGlobal.parseToInteger($("#trItemSpecPMMaterialInformation_intPackingStyleID").val());

    $("#txtHiddenDetailMaterialInformationObject").val(JSON.stringify(jsonData));
}

function p_DataToUITrItemSpecPMMaterialInformation(objData) {
   
    $("#trItemSpecPMMaterialInformation_txtItemSpecPmmaterialInformationId").val(clsGlobal.parseToString(objData.trItemSpecPMMaterialInformation_txtItemSpecPmmaterialInformationId));
    $("#trItemSpecPMMaterialInformation_decPackingSize").val(clsGlobal.parseToDecimal(objData.trItemSpecPMMaterialInformation_decPackingSize));
    $("#trItemSpecPMMaterialInformation_intStorageCondition").val(clsGlobal.parseToInteger(objData.trItemSpecPMMaterialInformation_intStorageCondition));
    $("#trItemSpecPMMaterialInformation_txtStorageCondition").val(clsGlobal.parseToString(objData.trItemSpecPMMaterialInformation_txtStorageCondition));
    $("#trItemSpecPMMaterialInformation_decShelfLife").val(clsGlobal.parseToDecimal(objData.trItemSpecPMMaterialInformation_decShelfLife));
    $("#trItemSpecPMMaterialInformation_intFinalArtworkID").val(clsGlobal.parseToInteger(objData.trItemSpecPMMaterialInformation_intFinalArtworkID));
    $("#trItemSpecPMMaterialInformation_intPackingStyleID").val(clsGlobal.parseToInteger(objData.trItemSpecPMMaterialInformation_intPackingStyleID));

    $("#txtHiddenDetailMaterialInformationObject").val(JSON.stringify(objData));


}

function p_showBlank() {
    p_initiateData();
}

function showSaveConfirmation(actionText, isEdit) {
   
    Swal.fire({
        title: `Are you sure you want to ${actionText} the data?`,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: actionText.charAt(0).toUpperCase() + actionText.slice(1),
        denyButtonText: `Don't ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}`
    }).then((result) => {
       
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
        'TxtParentSpecificationCode': 'Parent Specification Code',
        'TxtItemCode': 'Item Code',
        'TxtSpecPMDesc': 'Spec Description',
        'TxtRemark': 'Remark'
    };


    const requiredFields = [
        'TxtParentSpecificationCode', 'TxtItemCode', 'TxtSpecPMDesc', 'TxtRemark'
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
   
    if (!validateForm()) {
        return;
    }

    p_UItrItemSpecPMVisualToData();
    p_UItrItemSpecPMDimensionToData();
    p_UItrItemSpecPMMaterialToData();
    p_UItrItemSpecPMPackagingToData();
    p_UItrItemSpecPMContaminantToData();
    //p_UIToDataTrItemSpecPMMaterialInformation();
    p_UIToData();

    const url = isEdit ? window.updateUrl : window.saveUrl;
   

    // Buat FormData untuk kirim file + data JSON
    const formData = new FormData();
    formData.append("data", $("#txtHiddenObject").val());
    formData.append("__RequestVerificationToken", $('#frmItemSpecPMDetail input[name=__RequestVerificationToken]').val());

    //// Tambahkan file FinalArtwork (jika ada)
    //const finalArtwork = $('#TxtFinalArtwork')[0].files[0];
    //if (finalArtwork) {
    //    formData.append("FinalArtwork", finalArtwork);
    //}

    //// Tambahkan file PackingStyle (jika ada)
    //const packingStyle = $('#TxtPackingStyle')[0].files[0];
    //if (packingStyle) {
    //    formData.append("PackingStyle", packingStyle);
    //}

    // Tambahkan file-file yang diupload ke formData
    attachmentList.forEach((att, index) => {
        if (att.isUploadFile && att.attachment) {
            formData.append(`files`, att.attachment); // kamu bisa pakai `files[]` jika ingin array
        }
    });

    $.ajax({
        url: url,
        type: 'POST',
        //data: {
        //    data: $("#txtHiddenObject").val(),
        //    __RequestVerificationToken: $('#frmTrItemSpecPMDetail input[name=__RequestVerificationToken]').val()
        //},
        data: formData,
        contentType: false, // WAJIB: biar tidak default ke application/x-www-form-urlencoded
        processData: false, // WAJIB: jangan proses FormData jadi string
        datatype: "json",
        success: function (retDat) {
           
            if (retDat.bitSuccess == true) {
               
                clsGlobal.swalSuccessSaveOrSubmit(retDat.txtMessage, window.detailUrl + '?id=' + retDat.objData.intParentSpecificationId);
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
   
    if (!validateForm()) {
        return;
    }

    p_UItrItemSpecPMVisualToData()
    p_UItrItemSpecPMDimensionToData()
    p_UItrItemSpecPMMaterialToData()
    p_UItrItemSpecPMPackagingToData()
    p_UItrItemSpecPMContaminantToData()
    p_UIToData();

    const url = window.submitUrl;
   

    // Buat FormData untuk kirim file + data JSON
    const formData = new FormData();
    formData.append("data", $("#txtHiddenObject").val());
    formData.append("__RequestVerificationToken", $('#frmTrItemSpecPMDetail input[name=__RequestVerificationToken]').val());

    //// Tambahkan file FinalArtwork (jika ada)
    //const finalArtwork = $('#TxtFinalArtwork')[0].files[0];
    //if (finalArtwork) {
    //   
    //    formData.append("FinalArtwork", finalArtwork);
    //}

    //// Tambahkan file PackingStyle (jika ada)
    //const packingStyle = $('#TxtPackingStyle')[0].files[0];
    //if (packingStyle) {
    //   
    //    formData.append("PackingStyle", packingStyle);
    //}

    // Tambahkan file-file yang diupload ke formData
    attachmentList.forEach((att, index) => {
        if (att.isUploadFile && att.attachment) {
            formData.append(`files`, att.attachment); // kamu bisa pakai `files[]` jika ingin array
        }
    });

    $.ajax({
        url: url,
        type: 'POST',
        //data: {
        //    data: $("#txtHiddenObject").val(),
        //    __RequestVerificationToken: $('#frmTrItemSpecPMDetail input[name=__RequestVerificationToken]').val()
        //},
        data: formData,
        contentType: false, // WAJIB: biar tidak default ke application/x-www-form-urlencoded
        processData: false, // WAJIB: jangan proses FormData jadi string
        datatype: "json",
        success: function (retDat) {
           
            if (retDat.bitSuccess == true) {
               
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
//   
//    p_UIToData();
//   
//    $.ajax({
//        type: "POST",
//        url: "/TrItemSpecPM/Save",
//        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmTrItemSpecPMDetail input[name=__RequestVerificationToken]').val() },
//        datatype: "json",
//        success: function (retDat) {
//           
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
//           
//            clsGlobal.hideLoading();
//        }
//    });
//}

function p_ParentSpec_TextChanged(intParentSpecificationId) {
    clsGlobal.showLoading();
   
    $.ajax({
        type: "POST",
        url: "/ItemSpecPM/GetDataParentSpec",
        data: { IntParentSpecificationId: intParentSpecificationId, __RequestVerificationToken: $('#frmItemSpecPMDetail input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    //p_DataToUI(retDat.objData);
                    //$("#txtHiddenObject").val(JSON.stringify(retDat.objData));

                    //p_DataToUI(retDat.objData);
                    // Proses attachment

                   
                    tableVisual.clear().draw(false);

                    for (var i = 0; i < retDat.objData.listVmTrItemSpecPMVisual.length; i++) {

                        var newItem = retDat.objData.listVmTrItemSpecPMVisual[i];
                        if (newItem.txtTestType.toLowerCase() == "v") {
                           

                            // Perbaikan: Ubah null menjadi 0 untuk existingItem sebelum perbandingan
                            newItem.txtMin = "";
                            newItem.txtMax = "";
                        } 

                        tableVisual.row.add([
                            newItem.txtItemSpecPmvisualId,
                            newItem.intLineNo,
                            newItem.intTestId,
                            newItem.txtTestCode,
                            newItem.txtTestClass,
                            newItem.txtTestUnit,
                            newItem.txtTestMethodCode,
                            newItem.txtTestType,
                            newItem.txtTarget,
                            newItem.txtMin,
                            newItem.txtMax,
                            newItem.txtParameterType,
                            newItem.txtAnalyzedBy,
                            newItem.txtRepeat,
                            newItem.txtDetail
                        ]).draw(false);
                    }

                    tableDimension.clear().draw(false);

                    for (var i = 0; i < retDat.objData.listVmTrItemSpecPMDimension.length; i++) {
                        var newItem = retDat.objData.listVmTrItemSpecPMDimension[i];
                        if (newItem.txtTestType.toLowerCase() == "v") {
                           

                            // Perbaikan: Ubah null menjadi 0 untuk existingItem sebelum perbandingan
                            newItem.txtMin = "";
                            newItem.txtMax = "";
                        } 



                        tableDimension.row.add([
                            newItem.txtItemSpecPmdimensionId,
                            newItem.intLineNo,
                            newItem.intTestId,
                            newItem.txtTestCode,
                            newItem.txtTestClass,
                            newItem.txtTestUnit,
                            newItem.txtTestMethodCode,
                            newItem.txtTestType,
                            newItem.txtTarget,
                            newItem.txtMin,
                            newItem.txtMax,
                            newItem.txtParameterType,
                            newItem.txtAnalyzedBy,
                            newItem.txtRepeat,
                            newItem.txtDetail
                        ]).draw(false);
                    }

                    tableMaterial.clear().draw(false);

                    for (var i = 0; i < retDat.objData.listVmTrItemSpecPMMaterial.length; i++) {
                        var newItem = retDat.objData.listVmTrItemSpecPMMaterial[i];
                        if (newItem.txtTestType.toLowerCase() == "v") {
                           

                            // Perbaikan: Ubah null menjadi 0 untuk existingItem sebelum perbandingan
                            newItem.txtMin = "";
                            newItem.txtMax = "";
                        } 
                        tableMaterial.row.add([
                            newItem.txtItemSpecPmmaterialId,
                            newItem.intLineNo,
                            newItem.intTestId,
                            newItem.txtTestCode,
                            newItem.txtTestClass,
                            newItem.txtTestUnit,
                            newItem.txtTestMethodCode,
                            newItem.txtTestType,
                            newItem.txtTarget,
                            newItem.txtMin,
                            newItem.txtMax,
                            newItem.txtParameterType,
                            newItem.txtAnalyzedBy,
                            newItem.txtRepeat,
                            newItem.txtDetail
                        ]).draw(false);
                    }

                    tablePackaging.clear().draw(false);
                    debugger;
                    for (var i = 0; i < retDat.objData.listVmTrItemSpecPMPackagingIntegrity.length; i++) {
                        var newItem = retDat.objData.listVmTrItemSpecPMPackagingIntegrity[i];
                        
                        if (newItem.txtTestType.toLowerCase() == "v") {
                           

                            // Perbaikan: Ubah null menjadi 0 untuk existingItem sebelum perbandingan
                            newItem.txtMin = "";
                            newItem.txtMax = "";
                        } 
                        tablePackaging.row.add([
                            newItem.txtItemSpecPmpackagingIntegrityId,
                            newItem.intLineNo,
                            newItem.intTestId,
                            newItem.txtTestCode,
                            newItem.txtTestClass,
                            newItem.txtTestUnit,
                            newItem.txtTestMethodCode,
                            newItem.txtTestType,
                            newItem.txtTarget,
                            newItem.txtMin,
                            newItem.txtMax,
                            newItem.txtParameterType,
                            newItem.txtAnalyzedBy,
                            newItem.txtRepeat,
                            newItem.txtDetail
                        ]).draw(false);
                    }
                    tableContaminant.clear().draw(false);

                    for (var i = 0; i < retDat.objData.listVmTrItemSpecPMContaminant.length; i++) {
                        var newItem = retDat.objData.listVmTrItemSpecPMContaminant[i];
                        if (newItem.txtTestType.toLowerCase() == "v") {
                           

                            // Perbaikan: Ubah null menjadi 0 untuk existingItem sebelum perbandingan
                            newItem.txtMin = "";
                            newItem.txtMax = "";
                        } 
                        tableContaminant.row.add([
                            newItem.txtItemSpecPmcontaminantId,
                            newItem.intLineNo,
                            newItem.intTestId,
                            newItem.txtTestCode,
                            newItem.txtTestClass,
                            newItem.txtTestUnit,
                            newItem.txtTestMethodCode,
                            newItem.txtTestType,
                            newItem.txtTarget,
                            newItem.txtMin,
                            newItem.txtMax,
                            newItem.txtParameterType,
                            newItem.txtAnalyzedBy,
                            newItem.txtRepeat,
                            newItem.txtDetail
                        ]).draw(false);
                    }

                } else {
                    p_showBlank();
                }
                $("#txtGUID").val(retDat.txtGUID);
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
function p_txtTestCode_TextChanged(arr) {
   
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
    $("#trItemSpecPMVisual_intTestID").val(arr[1]);
    $("#trItemSpecPMVisual_txtTestCode").val(arr[2]);
    $("#trItemSpecPMVisual_txtTestClass").val(arr[3]);
    $("#trItemSpecPMVisual_txtTestMethodCode").val(arr[4]);
    $("#trItemSpecPMVisual_txtTestType").val(arr[5]);
    $("#trItemSpecPMVisual_txtTestUnit").val(arr[6]);

}

function p_txtTestCodeDimension_TextChanged(arr) {
   
    var table_Length = $('#tableDimension tbody tr').length;
    var index = $('#tableDimension tbody tr').length - 1;

    $("#trItemSpecPMDimension_intTestID").val(arr[1]);
    $("#trItemSpecPMDimension_txtTestCode").val(arr[2]);
    $("#trItemSpecPMDimension_txtTestClass").val(arr[3]);
    $("#trItemSpecPMDimension_txtTestMethodCode").val(arr[4]);
    $("#trItemSpecPMDimension_txtTestType").val(arr[5]);
    $("#trItemSpecPMDimension_txtTestUnit").val(arr[6]);

}

function p_txtTestCodeMaterial_TextChanged(arr) {
   
    var table_Length = $('#tableMaterial tbody tr').length;
    var index = $('#tableMaterial tbody tr').length - 1;

    $("#trItemSpecPMMaterial_intTestID").val(arr[1]);
    $("#trItemSpecPMMaterial_txtTestCode").val(arr[2]);
    $("#trItemSpecPMMaterial_txtTestClass").val(arr[3]);
    $("#trItemSpecPMMaterial_txtTestMethodCode").val(arr[4]);
    $("#trItemSpecPMMaterial_txtTestType").val(arr[5]);
    $("#trItemSpecPMMaterial_txtTestUnit").val(arr[6]);

}

function p_txtTestCodePackaging_TextChanged(arr) {
   
    var table_Length = $('#tablePackaging tbody tr').length;
    var index = $('#tablePackaging tbody tr').length - 1;

    $("#trItemSpecPMPackaging_intTestID").val(arr[1]);
    $("#trItemSpecPMPackaging_txtTestCode").val(arr[2]);
    $("#trItemSpecPMPackaging_txtTestClass").val(arr[3]);
    $("#trItemSpecPMPackaging_txtTestMethodCode").val(arr[4]);
    $("#trItemSpecPMPackaging_txtTestType").val(arr[5]);
    $("#trItemSpecPMPackaging_txtTestUnit").val(arr[6]);

}

function p_txtTestCodeContaminant_TextChanged(arr) {
   
    var table_Length = $('#tableContaminant tbody tr').length;
    var index = $('#tableContaminant tbody tr').length - 1;

    $("#trItemSpecPMContaminant_intTestID").val(arr[1]);
    $("#trItemSpecPMContaminant_txtTestCode").val(arr[2]);
    $("#trItemSpecPMContaminant_txtTestClass").val(arr[3]);
    $("#trItemSpecPMContaminant_txtTestMethodCode").val(arr[4]);
    $("#trItemSpecPMContaminant_txtTestType").val(arr[5]);
    $("#trItemSpecPMContaminant_txtTestUnit").val(arr[6]);

}

function p_ShowBlankVisualDetail() {
   

    $("#trItemSpecPMVisual_txtTrItemSpecPMVisualID").val("");
    $("#trItemSpecPMVisual_intLineID").val("");
    $("#trItemSpecPMVisual_intTestID").val("");
    $("#trItemSpecPMVisual_txtTestCode").val("");
    $("#trItemSpecPMVisual_txtTestClass").val("");
    $("#trItemSpecPMVisual_txtTestUnit").val("");
    $("#trItemSpecPMVisual_txtTestMethodCode").val("");
    $("#trItemSpecPMVisual_txtTestType").val("");
    $("#trItemSpecPMVisual_txtTarget").val("");
    $("#trItemSpecPMVisual_txtMin").val("");
    $("#trItemSpecPMVisual_txtMax").val("");
    $("#trItemSpecPMVisual_txtResult").val("");
    $("#trItemSpecPMVisual_txtStatus").val("");
    $("#trItemSpecPMVisual_txtDetail").val("");
    $("#trItemSpecPMVisual_bitNotAnalyzed").prop("checked", false);

}

function p_ShowBlankDimensionDetail() {
   

    $("#trItemSpecPMDimension_txtTrItemSpecPMDimensionID").val("");
    $("#trItemSpecPMDimension_intLineID").val("");
    $("#trItemSpecPMDimension_intTestID").val("");
    $("#trItemSpecPMDimension_txtTestCode").val("");
    $("#trItemSpecPMDimension_txtTestClass").val("");
    $("#trItemSpecPMDimension_txtTestUnit").val("");
    $("#trItemSpecPMDimension_txtTestMethodCode").val("");
    $("#trItemSpecPMDimension_txtTestType").val("");
    $("#trItemSpecPMDimension_txtTarget").val("");
    $("#trItemSpecPMDimension_txtMin").val("");
    $("#trItemSpecPMDimension_txtMax").val("");
    $("#trItemSpecPMDimension_txtResult").val("");
    $("#trItemSpecPMDimension_txtStatus").val("");
    $("#trItemSpecPMDimension_txtDetail").val("");
    $("#trItemSpecPMDimension_bitNotAnalyzed").prop("checked", false);

}

function p_ShowBlankMaterialDetail() {
   

    $("#trItemSpecPMMaterial_txtTrItemSpecPMMaterialID").val("");
    $("#trItemSpecPMMaterial_intLineID").val("");
    $("#trItemSpecPMMaterial_intTestID").val("");
    $("#trItemSpecPMMaterial_txtTestCode").val("");
    $("#trItemSpecPMMaterial_txtTestClass").val("");
    $("#trItemSpecPMMaterial_txtTestUnit").val("");
    $("#trItemSpecPMMaterial_txtTestMethodCode").val("");
    $("#trItemSpecPMMaterial_txtTestType").val("");
    $("#trItemSpecPMMaterial_txtTarget").val("");
    $("#trItemSpecPMMaterial_txtMin").val("");
    $("#trItemSpecPMMaterial_txtMax").val("");
    $("#trItemSpecPMMaterial_txtResult").val("");
    $("#trItemSpecPMMaterial_txtStatus").val("");
    $("#trItemSpecPMMaterial_txtDetail").val("");
    $("#trItemSpecPMMaterial_bitNotAnalyzed").prop("checked", false);

}

function p_ShowBlankPackagingDetail() {
   

    $("#trItemSpecPMPackaging_txtTrItemSpecPMPackagingID").val("");
    $("#trItemSpecPMPackaging_intLineID").val("");
    $("#trItemSpecPMPackaging_intTestID").val("");
    $("#trItemSpecPMPackaging_txtTestCode").val("");
    $("#trItemSpecPMPackaging_txtTestClass").val("");
    $("#trItemSpecPMPackaging_txtTestUnit").val("");
    $("#trItemSpecPMPackaging_txtTestMethodCode").val("");
    $("#trItemSpecPMPackaging_txtTestType").val("");
    $("#trItemSpecPMPackaging_txtTarget").val("");
    $("#trItemSpecPMPackaging_txtMin").val("");
    $("#trItemSpecPMPackaging_txtMax").val("");
    $("#trItemSpecPMPackaging_txtResult").val("");
    $("#trItemSpecPMPackaging_txtStatus").val("");
    $("#trItemSpecPMPackaging_txtDetail").val("");
    $("#trItemSpecPMPackaging_bitNotAnalyzed").prop("checked", false);

}

function p_ShowBlankContaminantDetail() {
   

    $("#trItemSpecPMContaminant_txtTrItemSpecPMContaminantID").val("");
    $("#trItemSpecPMContaminant_intLineID").val("");
    $("#trItemSpecPMContaminant_intTestID").val("");
    $("#trItemSpecPMContaminant_txtTestCode").val("");
    $("#trItemSpecPMContaminant_txtTestClass").val("");
    $("#trItemSpecPMContaminant_txtTestUnit").val("");
    $("#trItemSpecPMContaminant_txtTestMethodCode").val("");
    $("#trItemSpecPMContaminant_txtTestType").val("");
    $("#trItemSpecPMContaminant_txtTarget").val("");
    $("#trItemSpecPMContaminant_txtMin").val("");
    $("#trItemSpecPMContaminant_txtMax").val("");
    $("#trItemSpecPMContaminant_txtResult").val("");
    $("#trItemSpecPMContaminant_txtStatus").val("");
    $("#trItemSpecPMContaminant_txtDetail").val("");
    $("#trItemSpecPMContaminant_bitNotAnalyzed").prop("checked", false);

}

//=======================
// HANDLER
//=======================

//$('#btnSave').bind('click', function () {
//    try {
//        clsGlobal.getConfirmation("Save this data?", function (result) {
//            if (result == true) {
//               
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
       
        LOV = clsGlobal.generateLOV("SAMPLE_NUMBER", "txtSampleNumber");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

//$('#btnSave').click(function () {
//   
//    const isEdit = (parseInt($("#id").val()) > 0).toString().toLowerCase();
//    const actionText = isEdit ? "update" : "save";
//    showSaveConfirmation(actionText, isEdit);
//});

$('#btnSave').click(function () {
   
    const isEdit = parseInt($("#id").val()) > 0; // boolean: true or false
    const actionText = isEdit ? "update" : "save";
    showSaveConfirmation(actionText, isEdit);
});

$('#btnSubmit').click(function () {
   
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
    // Complete Navigation Logic (mimics _layout.cshtml)
    
    // Step 1: Get Destination URL (The "New Active" URL)
    let targetUrl = localStorage.getItem('prevurlMenu');
    // Implement fallback if null, undefined, or empty
    if (!targetUrl || targetUrl.trim() === '') {
        targetUrl = window.indexUrl;
    }
    
    // Step 2: Get Current URL (The "New Previous" URL)
    const currentPageUrl = window.location.href;
    
    // Step 3: Define the navigation function
    const performNavigation = function() {
        // Set Local Storage (Critical Step - mimics _layout.cshtml)
        // a. Set urlMenu: the "new active" URL
        localStorage.setItem('urlMenu', targetUrl);
        // b. Set prevurlMenu: the "new previous" URL (the "jejak")
        localStorage.setItem('prevurlMenu', currentPageUrl);
        
        // Step 4: Redirect
        window.location.href = targetUrl;
    };
    
    Swal.fire({
        title: "The Data have not been saved, are you sure to go back to home page?",
        confirmButtonText: "Back",
    }).then((result) => {
        if (result.isConfirmed) {
            performNavigation();
        }
    });
});

$('#btnAddDetailVisual').bind('click',
    function () {
        try {
           
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


function p_UItrItemSpecPMVisualToData() {
   

    var jsonArray = "[";
    var jsonObj;

    var trItemSpecPMVisual_txtTrItemSpecPMVisualID;
    var trItemSpecPMVisual_intLineID;
    var trItemSpecPMVisual_intTestID;
    var trItemSpecPMVisual_txtTestCode;
    var trItemSpecPMVisual_txtTestClass;
    var trItemSpecPMVisual_txtTestUnit;
    var trItemSpecPMVisual_txtTestMethodCode;
    var trItemSpecPMVisual_txtTestType;
    var trItemSpecPMVisual_txtTarget;
    var trItemSpecPMVisual_txtMin;
    var trItemSpecPMVisual_txtMax;
    var trItemSpecPMVisual_txtParameterType;
    var trItemSpecPMVisual_txtAnalyzedBy;
    var trItemSpecPMVisual_txtRepeat;
    var trItemSpecPMVisual_txtDetail;


    if ($('#tableVisual tbody td').length > 1) {
        for (var i = 1; i <= $('#tableVisual tbody tr').length; i++) {
           
            var index = i - 1;

            var a = document.getElementById("tableVisual").rows[i].cells[2].innerHTML;

            trItemSpecPMVisual_txtTrItemSpecPMVisualID = '"trItemSpecPMVisual_txtTrItemSpecPMVisualID" : "' +
                tableVisual.cell(index, 0).data() +
                '"';
            trItemSpecPMVisual_intLineID = '"trItemSpecPMVisual_intLineID" : "' +
                tableVisual.cell(index, 1).data() +
                '"';
            trItemSpecPMVisual_intTestID =
                '"trItemSpecPMVisual_intTestID" : "' + tableVisual.cell(index, 2).data() + '"';
            trItemSpecPMVisual_txtTestCode =
                '"trItemSpecPMVisual_txtTestCode" : "' + tableVisual.cell(index, 3).data() + '"';
            trItemSpecPMVisual_txtTestClass =
                '"trItemSpecPMVisual_txtTestClass" : "' + tableVisual.cell(index, 4).data() + '"';
            trItemSpecPMVisual_txtTestUnit =
                '"trItemSpecPMVisual_txtTestUnit" : "' + tableVisual.cell(index, 5).data() + '"';
            trItemSpecPMVisual_txtTestMethodCode =
                '"trItemSpecPMVisual_txtTestMethodCode" : "' + tableVisual.cell(index, 6).data() + '"';
            trItemSpecPMVisual_txtTestType =
                '"trItemSpecPMVisual_txtTestType" : "' + tableVisual.cell(index, 7).data() + '"';
            trItemSpecPMVisual_txtTarget =
                '"trItemSpecPMVisual_txtTarget" : "' + tableVisual.cell(index, 8).data() + '"';
            trItemSpecPMVisual_txtMin =
                '"trItemSpecPMVisual_txtMin" : "' + tableVisual.cell(index, 9).data() + '"';
            trItemSpecPMVisual_txtMax =
                '"trItemSpecPMVisual_txtMax" : "' + tableVisual.cell(index, 10).data() + '"';
            trItemSpecPMVisual_txtParameterType =
                '"trItemSpecPMVisual_txtParameterType" : "' + tableVisual.cell(index, 11).data() + '"';
            trItemSpecPMVisual_txtAnalyzedBy =
                '"trItemSpecPMVisual_txtAnalyzedBy" : "' + tableVisual.cell(index, 12).data() + '"';
            trItemSpecPMVisual_txtRepeat =
                '"trItemSpecPMVisual_txtRepeat" : "' + tableVisual.cell(index, 13).data() + '"';
            trItemSpecPMVisual_txtDetail =
                '"trItemSpecPMVisual_txtDetail" : "' + tableVisual.cell(index, 14).data() + '"';


            //var UsrCrt = '"trFSV_ProductDesc2ViewModels_UsrCrt" : "0"';
            //var DtmCrt = '"trFSV_ProductDesc2ViewModels_DtmCrt" : "/Date(946659600000)/"';
            //var UsrUpd = '"trFSV_ProductDesc2ViewModels_UsrUpd" : "0"';
            //var DtmUpd = '"trFSV_ProductDesc2ViewModels_DtmUpd" : "/Date(946659600000)/"';

            jsonObj = "{" +
                trItemSpecPMVisual_txtTrItemSpecPMVisualID +
                "," +
                trItemSpecPMVisual_intLineID +
                "," +
                trItemSpecPMVisual_intTestID +
                "," +
                trItemSpecPMVisual_txtTestCode +
                "," +
                trItemSpecPMVisual_txtTestClass +
                "," +
                trItemSpecPMVisual_txtTestUnit +
                "," +
                trItemSpecPMVisual_txtTestMethodCode +
                "," +
                trItemSpecPMVisual_txtTestType +
                "," +
                trItemSpecPMVisual_txtTarget +
                "," +
                trItemSpecPMVisual_txtMin +
                "," +
                trItemSpecPMVisual_txtMax +
                "," +
                trItemSpecPMVisual_txtParameterType +
                "," +
                trItemSpecPMVisual_txtAnalyzedBy +
                "," +
                trItemSpecPMVisual_txtRepeat +
                "," +
                trItemSpecPMVisual_txtDetail +
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

function p_UItrItemSpecPMDimensionToData() {
   

    var jsonArray = "[";
    var jsonObj;

    var trItemSpecPMDimension_txtTrItemSpecPMDimensionID;
    var trItemSpecPMDimension_intLineID;
    var trItemSpecPMDimension_intTestID;
    var trItemSpecPMDimension_txtTestCode;
    var trItemSpecPMDimension_txtTestClass;
    var trItemSpecPMDimension_txtTestUnit;
    var trItemSpecPMDimension_txtTestMethodCode;
    var trItemSpecPMDimension_txtTestType;
    var trItemSpecPMDimension_txtTarget;
    var trItemSpecPMDimension_txtMin;
    var trItemSpecPMDimension_txtMax;
    var trItemSpecPMDimension_txtParameterType;
    var trItemSpecPMDimension_txtAnalyzedBy;
    var trItemSpecPMDimension_txtRepeat;
    var trItemSpecPMDimension_txtDetail;


    if ($('#tableDimension tbody td').length > 1) {
        for (var i = 1; i <= $('#tableDimension tbody tr').length; i++) {
           
            var index = i - 1;

            var a = document.getElementById("tableDimension").rows[i].cells[2].innerHTML;

            trItemSpecPMDimension_txtTrItemSpecPMDimensionID = '"trItemSpecPMDimension_txtTrItemSpecPMDimensionID" : "' +
                tableDimension.cell(index, 0).data() +
                '"';
            trItemSpecPMDimension_intLineID = '"trItemSpecPMDimension_intLineID" : "' +
                tableDimension.cell(index, 1).data() +
                '"';
            trItemSpecPMDimension_intTestID =
                '"trItemSpecPMDimension_intTestID" : "' + tableVisual.cell(index, 2).data() + '"';
            trItemSpecPMDimension_txtTestCode =
                '"trItemSpecPMDimension_txtTestCode" : "' + tableVisual.cell(index, 3).data() + '"';
            trItemSpecPMDimension_txtTestClass =
                '"trItemSpecPMDimension_txtTestClass" : "' + tableVisual.cell(index, 4).data() + '"';
            trItemSpecPMDimension_txtTestUnit =
                '"trItemSpecPMDimension_txtTestUnit" : "' + tableVisual.cell(index, 5).data() + '"';
            trItemSpecPMDimension_txtTestMethodCode =
                '"trItemSpecPMDimension_txtTestMethodCode" : "' + tableVisual.cell(index, 6).data() + '"';
            trItemSpecPMDimension_txtTestType =
                '"trItemSpecPMDimension_txtTestType" : "' + tableVisual.cell(index, 7).data() + '"';
            trItemSpecPMDimension_txtTarget =
                '"trItemSpecPMDimension_txtTarget" : "' + tableVisual.cell(index, 8).data() + '"';
            trItemSpecPMDimension_txtMin =
                '"trItemSpecPMDimension_txtMin" : "' + tableVisual.cell(index, 9).data() + '"';
            trItemSpecPMDimension_txtMax =
                '"trItemSpecPMDimension_txtMax" : "' + tableVisual.cell(index, 10).data() + '"';
            trItemSpecPMDimension_txtParameterType =
                '"trItemSpecPMDimension_txtParameterType" : "' + tableVisual.cell(index, 11).data() + '"';
            trItemSpecPMDimension_txtAnalyzedBy =
                '"trItemSpecPMDimension_txtAnalyzedBy" : "' + tableVisual.cell(index, 12).data() + '"';
            trItemSpecPMDimension_txtRepeat =
                '"trItemSpecPMDimension_txtRepeat" : "' + tableVisual.cell(index, 13).data() + '"';
            trItemSpecPMDimension_txtDetail =
                '"trItemSpecPMDimension_txtDetail" : "' + tableVisual.cell(index, 14).data() + '"';

            //var UsrCrt = '"trFSV_ProductDesc2ViewModels_UsrCrt" : "0"';
            //var DtmCrt = '"trFSV_ProductDesc2ViewModels_DtmCrt" : "/Date(946659600000)/"';
            //var UsrUpd = '"trFSV_ProductDesc2ViewModels_UsrUpd" : "0"';
            //var DtmUpd = '"trFSV_ProductDesc2ViewModels_DtmUpd" : "/Date(946659600000)/"';

            jsonObj = "{" +
                trItemSpecPMDimension_txtTrItemSpecPMDimensionID +
                "," +
                trItemSpecPMDimension_intLineID +
                "," +
                trItemSpecPMDimension_intTestID +
                "," +
                trItemSpecPMDimension_txtTestCode +
                "," +
                trItemSpecPMDimension_txtTestClass +
                "," +
                trItemSpecPMDimension_txtTestUnit +
                "," +
                trItemSpecPMDimension_txtTestMethodCode +
                "," +
                trItemSpecPMDimension_txtTestType +
                "," +
                trItemSpecPMDimension_txtTarget +
                "," +
                trItemSpecPMDimension_txtMin +
                "," +
                trItemSpecPMDimension_txtMax +
                "," +
                trItemSpecPMDimension_txtParameterType +
                "," +
                trItemSpecPMDimension_txtAnalyzedBy +
                "," +
                trItemSpecPMDimension_txtRepeat +
                "," +
                trItemSpecPMDimension_txtDetail +
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

function p_UItrItemSpecPMMaterialToData() {
   

    var jsonArray = "[";
    var jsonObj;

    var trItemSpecPMMaterial_txtTrItemSpecPMMaterialID;
    var trItemSpecPMMaterial_intLineID;
    var trItemSpecPMMaterial_intTestID;
    var trItemSpecPMMaterial_txtTestCode;
    var trItemSpecPMMaterial_txtTestClass;
    var trItemSpecPMMaterial_txtTestUnit;
    var trItemSpecPMMaterial_txtTestMethodCode;
    var trItemSpecPMMaterial_txtTestType;
    var trItemSpecPMMaterial_txtTarget;
    var trItemSpecPMMaterial_txtMin;
    var trItemSpecPMMaterial_txtMax;
    var trItemSpecPMMaterial_txtParameterType;
    var trItemSpecPMMaterial_txtAnalyzedBy;
    var trItemSpecPMMaterial_txtRepeat;
    var trItemSpecPMMaterial_txtDetail;


    if ($('#tableMaterial tbody td').length > 1) {
        for (var i = 1; i <= $('#tableMaterial tbody tr').length; i++) {
           
            var index = i - 1;

            var a = document.getElementById("tableMaterial").rows[i].cells[2].innerHTML;

            trItemSpecPMMaterial_txtTrItemSpecPMMaterialID = '"trItemSpecPMMaterial_txtTrItemSpecPMMaterialID" : "' +
                tableMaterial.cell(index, 0).data() +
                '"';
            trItemSpecPMMaterial_intLineID = '"trItemSpecPMMaterial_intLineID" : "' +
                tableMaterial.cell(index, 1).data() +
                '"';
            trItemSpecPMMaterial_intTestID =
                '"trItemSpecPMMaterial_intTestID" : "' + tableVisual.cell(index, 2).data() + '"';
            trItemSpecPMMaterial_txtTestCode =
                '"trItemSpecPMMaterial_txtTestCode" : "' + tableVisual.cell(index, 3).data() + '"';
            trItemSpecPMMaterial_txtTestClass =
                '"trItemSpecPMMaterial_txtTestClass" : "' + tableVisual.cell(index, 4).data() + '"';
            trItemSpecPMMaterial_txtTestUnit =
                '"trItemSpecPMMaterial_txtTestUnit" : "' + tableVisual.cell(index, 5).data() + '"';
            trItemSpecPMMaterial_txtTestMethodCode =
                '"trItemSpecPMMaterial_txtTestMethodCode" : "' + tableVisual.cell(index, 6).data() + '"';
            trItemSpecPMMaterial_txtTestType =
                '"trItemSpecPMMaterial_txtTestType" : "' + tableVisual.cell(index, 7).data() + '"';
            trItemSpecPMMaterial_txtTarget =
                '"trItemSpecPMMaterial_txtTarget" : "' + tableVisual.cell(index, 8).data() + '"';
            trItemSpecPMMaterial_txtMin =
                '"trItemSpecPMMaterial_txtMin" : "' + tableVisual.cell(index, 9).data() + '"';
            trItemSpecPMMaterial_txtMax =
                '"trItemSpecPMMaterial_txtMax" : "' + tableVisual.cell(index, 10).data() + '"';
            trItemSpecPMMaterial_txtParameterType =
                '"trItemSpecPMMaterial_txtParameterType" : "' + tableVisual.cell(index, 11).data() + '"';
            trItemSpecPMMaterial_txtAnalyzedBy =
                '"trItemSpecPMMaterial_txtAnalyzedBy" : "' + tableVisual.cell(index, 12).data() + '"';
            trItemSpecPMMaterial_txtRepeat =
                '"trItemSpecPMMaterial_txtRepeat" : "' + tableVisual.cell(index, 13).data() + '"';
            trItemSpecPMMaterial_txtDetail =
                '"trItemSpecPMMaterial_txtDetail" : "' + tableVisual.cell(index, 14).data() + '"';

            //var UsrCrt = '"trFSV_ProductDesc2ViewModels_UsrCrt" : "0"';
            //var DtmCrt = '"trFSV_ProductDesc2ViewModels_DtmCrt" : "/Date(946659600000)/"';
            //var UsrUpd = '"trFSV_ProductDesc2ViewModels_UsrUpd" : "0"';
            //var DtmUpd = '"trFSV_ProductDesc2ViewModels_DtmUpd" : "/Date(946659600000)/"';

            jsonObj = "{" +
                trItemSpecPMMaterial_txtTrItemSpecPMMaterialID +
                "," +
                trItemSpecPMMaterial_intLineID +
                "," +
                trItemSpecPMMaterial_intTestID +
                "," +
                trItemSpecPMMaterial_txtTestCode +
                "," +
                trItemSpecPMMaterial_txtTestClass +
                "," +
                trItemSpecPMMaterial_txtTestUnit +
                "," +
                trItemSpecPMMaterial_txtTestMethodCode +
                "," +
                trItemSpecPMMaterial_txtTestType +
                "," +
                trItemSpecPMMaterial_txtTarget +
                "," +
                trItemSpecPMMaterial_txtMin +
                "," +
                trItemSpecPMMaterial_txtMax +
                "," +
                trItemSpecPMMaterial_txtParameterType +
                "," +
                trItemSpecPMMaterial_txtAnalyzedBy +
                "," +
                trItemSpecPMMaterial_txtRepeat +
                "," +
                trItemSpecPMMaterial_txtDetail +
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

function p_UItrItemSpecPMPackagingToData() {
   

    var jsonArray = "[";
    var jsonObj;

    var trItemSpecPMPackaging_txtTrItemSpecPMPackagingID;
    var trItemSpecPMPackaging_intLineID;
    var trItemSpecPMPackaging_intTestID;
    var trItemSpecPMPackaging_txtTestCode;
    var trItemSpecPMPackaging_txtTestClass;
    var trItemSpecPMPackaging_txtTestUnit;
    var trItemSpecPMPackaging_txtTestMethodCode;
    var trItemSpecPMPackaging_txtTestType;
    var trItemSpecPMPackaging_txtTarget;
    var trItemSpecPMPackaging_txtMin;
    var trItemSpecPMPackaging_txtMax;
    var trItemSpecPMPackaging_txtParameterType;
    var trItemSpecPMPackaging_txtAnalyzedBy;
    var trItemSpecPMPackaging_txtRepeat;
    var trItemSpecPMPackaging_txtDetail;


    if ($('#tablePackaging tbody td').length > 1) {
        for (var i = 1; i <= $('#tablePackaging tbody tr').length; i++) {
           
            var index = i - 1;

            var a = document.getElementById("tablePackaging").rows[i].cells[2].innerHTML;

            trItemSpecPMPackaging_txtTrItemSpecPMPackagingID = '"trItemSpecPMPackaging_txtTrItemSpecPMPackagingID" : "' +
                tablePackaging.cell(index, 0).data() +
                '"';
            trItemSpecPMPackaging_intLineID = '"trItemSpecPMPackaging_intLineID" : "' +
                tablePackaging.cell(index, 1).data() +
                '"';
            trItemSpecPMPackaging_intTestID =
                '"trItemSpecPMPackaging_intTestID" : "' + tableVisual.cell(index, 2).data() + '"';
            trItemSpecPMPackaging_txtTestCode =
                '"trItemSpecPMPackaging_txtTestCode" : "' + tableVisual.cell(index, 3).data() + '"';
            trItemSpecPMPackaging_txtTestClass =
                '"trItemSpecPMPackaging_txtTestClass" : "' + tableVisual.cell(index, 4).data() + '"';
            trItemSpecPMPackaging_txtTestUnit =
                '"trItemSpecPMPackaging_txtTestUnit" : "' + tableVisual.cell(index, 5).data() + '"';
            trItemSpecPMPackaging_txtTestMethodCode =
                '"trItemSpecPMPackaging_txtTestMethodCode" : "' + tableVisual.cell(index, 6).data() + '"';
            trItemSpecPMPackaging_txtTestType =
                '"trItemSpecPMPackaging_txtTestType" : "' + tableVisual.cell(index, 7).data() + '"';
            trItemSpecPMPackaging_txtTarget =
                '"trItemSpecPMPackaging_txtTarget" : "' + tableVisual.cell(index, 8).data() + '"';
            trItemSpecPMPackaging_txtMin =
                '"trItemSpecPMPackaging_txtMin" : "' + tableVisual.cell(index, 9).data() + '"';
            trItemSpecPMPackaging_txtMax =
                '"trItemSpecPMPackaging_txtMax" : "' + tableVisual.cell(index, 10).data() + '"';
            trItemSpecPMPackaging_txtParameterType =
                '"trItemSpecPMPackaging_txtParameterType" : "' + tableVisual.cell(index, 11).data() + '"';
            trItemSpecPMPackaging_txtAnalyzedBy =
                '"trItemSpecPMPackaging_txtAnalyzedBy" : "' + tableVisual.cell(index, 12).data() + '"';
            trItemSpecPMPackaging_txtRepeat =
                '"trItemSpecPMPackaging_txtRepeat" : "' + tableVisual.cell(index, 13).data() + '"';
            trItemSpecPMPackaging_txtDetail =
                '"trItemSpecPMPackaging_txtDetail" : "' + tableVisual.cell(index, 14).data() + '"';

            //var UsrCrt = '"trFSV_ProductDesc2ViewModels_UsrCrt" : "0"';
            //var DtmCrt = '"trFSV_ProductDesc2ViewModels_DtmCrt" : "/Date(946659600000)/"';
            //var UsrUpd = '"trFSV_ProductDesc2ViewModels_UsrUpd" : "0"';
            //var DtmUpd = '"trFSV_ProductDesc2ViewModels_DtmUpd" : "/Date(946659600000)/"';

            jsonObj = "{" +
                trItemSpecPMPackaging_txtTrItemSpecPMPackagingID +
                "," +
                trItemSpecPMPackaging_intLineID +
                "," +
                trItemSpecPMPackaging_intTestID +
                "," +
                trItemSpecPMPackaging_txtTestCode +
                "," +
                trItemSpecPMPackaging_txtTestClass +
                "," +
                trItemSpecPMPackaging_txtTestUnit +
                "," +
                trItemSpecPMPackaging_txtTestMethodCode +
                "," +
                trItemSpecPMPackaging_txtTestType +
                "," +
                trItemSpecPMPackaging_txtTarget +
                "," +
                trItemSpecPMPackaging_txtMin +
                "," +
                trItemSpecPMPackaging_txtMax +
                "," +
                trItemSpecPMPackaging_txtParameterType +
                "," +
                trItemSpecPMPackaging_txtAnalyzedBy +
                "," +
                trItemSpecPMPackaging_txtRepeat +
                "," +
                trItemSpecPMPackaging_txtDetail +
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

function p_UItrItemSpecPMContaminantToData() {
   

    var jsonArray = "[";
    var jsonObj;

    var trItemSpecPMContaminant_txtTrItemSpecPMContaminantID;
    var trItemSpecPMContaminant_intLineID;
    var trItemSpecPMContaminant_intTestID;
    var trItemSpecPMContaminant_txtTestCode;
    var trItemSpecPMContaminant_txtTestClass;
    var trItemSpecPMContaminant_txtTestUnit;
    var trItemSpecPMContaminant_txtTestMethodCode;
    var trItemSpecPMContaminant_txtTestType;
    var trItemSpecPMContaminant_txtTarget;
    var trItemSpecPMContaminant_txtMin;
    var trItemSpecPMContaminant_txtMax;
    var trItemSpecPMContaminant_txtParameterType;
    var trItemSpecPMContaminant_txtAnalyzedBy;
    var trItemSpecPMContaminant_txtRepeat;
    var trItemSpecPMContaminant_txtDetail;


    if ($('#tableContaminant tbody td').length > 1) {
        for (var i = 1; i <= $('#tableContaminant tbody tr').length; i++) {
           
            var index = i - 1;

            var a = document.getElementById("tableContaminant").rows[i].cells[2].innerHTML;

            trItemSpecPMContaminant_txtTrItemSpecPMContaminantID = '"trItemSpecPMContaminant_txtTrItemSpecPMContaminantID" : "' +
                tableContaminant.cell(index, 0).data() +
                '"';
            trItemSpecPMContaminant_intLineID = '"trItemSpecPMContaminant_intLineID" : "' +
                tableContaminant.cell(index, 1).data() +
                '"';
            trItemSpecPMContaminant_intTestID =
                '"trItemSpecPMContaminant_intTestID" : "' + tableVisual.cell(index, 2).data() + '"';
            trItemSpecPMContaminant_txtTestCode =
                '"trItemSpecPMContaminant_txtTestCode" : "' + tableVisual.cell(index, 3).data() + '"';
            trItemSpecPMContaminant_txtTestClass =
                '"trItemSpecPMContaminant_txtTestClass" : "' + tableVisual.cell(index, 4).data() + '"';
            trItemSpecPMContaminant_txtTestUnit =
                '"trItemSpecPMContaminant_txtTestUnit" : "' + tableVisual.cell(index, 5).data() + '"';
            trItemSpecPMContaminant_txtTestMethodCode =
                '"trItemSpecPMContaminant_txtTestMethodCode" : "' + tableVisual.cell(index, 6).data() + '"';
            trItemSpecPMContaminant_txtTestType =
                '"trItemSpecPMContaminant_txtTestType" : "' + tableVisual.cell(index, 7).data() + '"';
            trItemSpecPMContaminant_txtTarget =
                '"trItemSpecPMContaminant_txtTarget" : "' + tableVisual.cell(index, 8).data() + '"';
            trItemSpecPMContaminant_txtMin =
                '"trItemSpecPMContaminant_txtMin" : "' + tableVisual.cell(index, 9).data() + '"';
            trItemSpecPMContaminant_txtMax =
                '"trItemSpecPMContaminant_txtMax" : "' + tableVisual.cell(index, 10).data() + '"';
            trItemSpecPMContaminant_txtParameterType =
                '"trItemSpecPMContaminant_txtParameterType" : "' + tableVisual.cell(index, 11).data() + '"';
            trItemSpecPMContaminant_txtAnalyzedBy =
                '"trItemSpecPMContaminant_txtAnalyzedBy" : "' + tableVisual.cell(index, 12).data() + '"';
            trItemSpecPMContaminant_txtRepeat =
                '"trItemSpecPMContaminant_txtRepeat" : "' + tableVisual.cell(index, 13).data() + '"';
            trItemSpecPMContaminant_txtDetail =
                '"trItemSpecPMContaminant_txtDetail" : "' + tableVisual.cell(index, 14).data() + '"';

            //var UsrCrt = '"trFSV_ProductDesc2ViewModels_UsrCrt" : "0"';
            //var DtmCrt = '"trFSV_ProductDesc2ViewModels_DtmCrt" : "/Date(946659600000)/"';
            //var UsrUpd = '"trFSV_ProductDesc2ViewModels_UsrUpd" : "0"';
            //var DtmUpd = '"trFSV_ProductDesc2ViewModels_DtmUpd" : "/Date(946659600000)/"';

            jsonObj = "{" +
                trItemSpecPMContaminant_txtTrItemSpecPMContaminantID +
                "," +
                trItemSpecPMContaminant_intLineID +
                "," +
                trItemSpecPMContaminant_intTestID +
                "," +
                trItemSpecPMContaminant_txtTestCode +
                "," +
                trItemSpecPMContaminant_txtTestClass +
                "," +
                trItemSpecPMContaminant_txtTestUnit +
                "," +
                trItemSpecPMContaminant_txtTestMethodCode +
                "," +
                trItemSpecPMContaminant_txtTestType +
                "," +
                trItemSpecPMContaminant_txtTarget +
                "," +
                trItemSpecPMContaminant_txtMin +
                "," +
                trItemSpecPMContaminant_txtMax +
                "," +
                trItemSpecPMContaminant_txtParameterType +
                "," +
                trItemSpecPMContaminant_txtAnalyzedBy +
                "," +
                trItemSpecPMContaminant_txtRepeat +
                "," +
                trItemSpecPMContaminant_txtDetail +
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

//function p_UItrItemSpecPMVisualToData() {
//    var jsonArray = [];
//   
//    $('#tableVisual tbody tr').each(function () {
//        var cells = this.cells;

//        function getCellValue(cell, isCheckbox = false) {
//            const input = $(cell).find('input, select, textarea');
//            if (input.length > 0) {
//                if (input.is(':checkbox')) {
//                    return input.is(':checked') ? 'true' : 'false';
//                }
//                return input.val().trim();
//            }

//            const text = $(cell).text().trim();
//            if (isCheckbox) {
//                return text.toUpperCase() === 'YES' ? 'true' : 'false';
//            }
//            return text;
//        }

//        var jsonObj = {
//            trItemSpecPMVisual_txtTrItemSpecPMVisualID: getCellValue(cells[2]),
//            trItemSpecPMVisual_intLineID: getCellValue(cells[3]),
//            trItemSpecPMVisual_intTestID: getCellValue(cells[4]),
//            trItemSpecPMVisual_txtTestCode: getCellValue(cells[5]),
//            trItemSpecPMVisual_txtTestClass: getCellValue(cells[6]),
//            trItemSpecPMVisual_txtTestUnit: getCellValue(cells[7]),
//            trItemSpecPMVisual_txtTestMethodCode: getCellValue(cells[8]),
//            trItemSpecPMVisual_txtTestType: getCellValue(cells[9]),
//            trItemSpecPMVisual_txtTarget: getCellValue(cells[10]),
//            trItemSpecPMVisual_txtMin: getCellValue(cells[11]),
//            trItemSpecPMVisual_txtMax: getCellValue(cells[12]),
//            trItemSpecPMVisual_txtResult: getCellValue(cells[13]),
//            trItemSpecPMVisual_txtStatus: getCellValue(cells[14]),
//            trItemSpecPMVisual_txtDetail: getCellValue(cells[15]),
//            trItemSpecPMVisual_bitNotAnalyzed: getCellValue(cells[16], true)
//        };

//        jsonArray.push(jsonObj);
//    });

//    $('#txtHiddenDetailVisualObject').val(
//        jsonArray.length > 0 ? JSON.stringify(jsonArray) : ''
//    );
//}


function editRowVisual(data) {
   

    $('#trItemSpecPMVisual_txtTrItemSpecPMVisualID').val(tableVisual.rows($(data).parent().parent()).data()[0][2]);
    $('#trItemSpecPMVisual_intLineID').val(tableVisual.rows($(data).parent().parent()).data()[0][3]);
    $('#trItemSpecPMVisual_intTestID').val(tableVisual.rows($(data).parent().parent()).data()[0][4]);
    $('#trItemSpecPMVisual_txtTestCode').val(tableVisual.rows($(data).parent().parent()).data()[0][5]);
    $('#trItemSpecPMVisual_txtTestClass').val(tableVisual.rows($(data).parent().parent()).data()[0][6]);
    $('#trItemSpecPMVisual_txtTestUnit').val(tableVisual.rows($(data).parent().parent()).data()[0][7]);

    $('#trItemSpecPMVisual_txtTestMethodCode').val(tableVisual.rows($(data).parent().parent()).data()[0][8]);
    $('#trItemSpecPMVisual_txtTestType').val(tableVisual.rows($(data).parent().parent()).data()[0][9]);
    $('#trItemSpecPMVisual_txtTarget').val(tableVisual.rows($(data).parent().parent()).data()[0][10]);
    $('#trItemSpecPMVisual_txtMin').val(tableVisual.rows($(data).parent().parent()).data()[0][11]);
    $('#trItemSpecPMVisual_txtMax').val(tableVisual.rows($(data).parent().parent()).data()[0][12]);
    $('#trItemSpecPMVisual_txtResult').val(tableVisual.rows($(data).parent().parent()).data()[0][13]);
    $('#trItemSpecPMVisual_txtStatus').val(tableVisual.rows($(data).parent().parent()).data()[0][14]);
    $('#trItemSpecPMVisual_txtDetail').val(tableVisual.rows($(data).parent().parent()).data()[0][15]);
    //$('#trItemSpecPMVisual_bitNotAnalyzed').val(tableVisual.rows($(data).parent().parent()).data()[0][16]);
    var isNotAnalyzed = tableVisual.rows($(data).parent().parent()).data()[0][16];
    $('#trItemSpecPMVisual_bitNotAnalyzed').prop("checked", isNotAnalyzed === true || isNotAnalyzed === "true");

    $('#SaveEditDetailVisual').val("EDIT");
    p_UItrItemSpecPMVisualToData();

    $('#modalVisual').modal('show');
};

function editRowDimension(data) {
   

    $('#trItemSpecPMDimension_txtTrItemSpecPMDimensionID').val(tableDimension.rows($(data).parent().parent()).data()[0][2]);
    $('#trItemSpecPMDimension_intLineID').val(tableDimension.rows($(data).parent().parent()).data()[0][3]);
    $('#trItemSpecPMDimension_intTestID').val(tableDimension.rows($(data).parent().parent()).data()[0][4]);
    $('#trItemSpecPMDimension_txtTestCode').val(tableDimension.rows($(data).parent().parent()).data()[0][5]);
    $('#trItemSpecPMDimension_txtTestClass').val(tableDimension.rows($(data).parent().parent()).data()[0][6]);
    $('#trItemSpecPMDimension_txtTestUnit').val(tableDimension.rows($(data).parent().parent()).data()[0][7]);

    $('#trItemSpecPMDimension_txtTestMethodCode').val(tableDimension.rows($(data).parent().parent()).data()[0][8]);
    $('#trItemSpecPMDimension_txtTestType').val(tableDimension.rows($(data).parent().parent()).data()[0][9]);
    $('#trItemSpecPMDimension_txtTarget').val(tableDimension.rows($(data).parent().parent()).data()[0][10]);
    $('#trItemSpecPMDimension_txtMin').val(tableDimension.rows($(data).parent().parent()).data()[0][11]);
    $('#trItemSpecPMDimension_txtMax').val(tableDimension.rows($(data).parent().parent()).data()[0][12]);
    $('#trItemSpecPMDimension_txtResult').val(tableDimension.rows($(data).parent().parent()).data()[0][13]);
    $('#trItemSpecPMDimension_txtStatus').val(tableDimension.rows($(data).parent().parent()).data()[0][14]);
    $('#trItemSpecPMDimension_txtDetail').val(tableDimension.rows($(data).parent().parent()).data()[0][15]);
    //$('#trItemSpecPMDimension_bitNotAnalyzed').val(tableDimension.rows($(data).parent().parent()).data()[0][16]);
    var isNotAnalyzed = tableDimension.rows($(data).parent().parent()).data()[0][16];
    $('#trItemSpecPMDimension_bitNotAnalyzed').prop("checked", isNotAnalyzed === true || isNotAnalyzed === "true");

    $('#SaveEditDetailDimension').val("EDIT");
    p_UItrItemSpecPMDimensionToData();

    $('#modalDimension').modal('show');
};

function editRowMaterial(data) {
   

    $('#trItemSpecPMMaterial_txtTrItemSpecPMMaterialID').val(tableMaterial.rows($(data).parent().parent()).data()[0][2]);
    $('#trItemSpecPMMaterial_intLineID').val(tableMaterial.rows($(data).parent().parent()).data()[0][3]);
    $('#trItemSpecPMMaterial_intTestID').val(tableMaterial.rows($(data).parent().parent()).data()[0][4]);
    $('#trItemSpecPMMaterial_txtTestCode').val(tableMaterial.rows($(data).parent().parent()).data()[0][5]);
    $('#trItemSpecPMMaterial_txtTestClass').val(tableMaterial.rows($(data).parent().parent()).data()[0][6]);
    $('#trItemSpecPMMaterial_txtTestUnit').val(tableMaterial.rows($(data).parent().parent()).data()[0][7]);

    $('#trItemSpecPMMaterial_txtTestMethodCode').val(tableMaterial.rows($(data).parent().parent()).data()[0][8]);
    $('#trItemSpecPMMaterial_txtTestType').val(tableMaterial.rows($(data).parent().parent()).data()[0][9]);
    $('#trItemSpecPMMaterial_txtTarget').val(tableMaterial.rows($(data).parent().parent()).data()[0][10]);
    $('#trItemSpecPMMaterial_txtMin').val(tableMaterial.rows($(data).parent().parent()).data()[0][11]);
    $('#trItemSpecPMMaterial_txtMax').val(tableMaterial.rows($(data).parent().parent()).data()[0][12]);
    $('#trItemSpecPMMaterial_txtResult').val(tableMaterial.rows($(data).parent().parent()).data()[0][13]);
    $('#trItemSpecPMMaterial_txtStatus').val(tableMaterial.rows($(data).parent().parent()).data()[0][14]);
    $('#trItemSpecPMMaterial_txtDetail').val(tableMaterial.rows($(data).parent().parent()).data()[0][15]);
    //$('#trItemSpecPMMaterial_bitNotAnalyzed').val(tableMaterial.rows($(data).parent().parent()).data()[0][16]);
    var isNotAnalyzed = tableMaterial.rows($(data).parent().parent()).data()[0][16];
    $('#trItemSpecPMMaterial_bitNotAnalyzed').prop("checked", isNotAnalyzed === true || isNotAnalyzed === "true");

    $('#SaveEditDetailMaterial').val("EDIT");
    p_UItrItemSpecPMMaterialToData();

    $('#modalMaterial').modal('show');
};

function editRowPackaging(data) {
   

    $('#trItemSpecPMPackaging_txtTrItemSpecPMPackagingID').val(tablePackaging.rows($(data).parent().parent()).data()[0][2]);
    $('#trItemSpecPMPackaging_intLineID').val(tablePackaging.rows($(data).parent().parent()).data()[0][3]);
    $('#trItemSpecPMPackaging_intTestID').val(tablePackaging.rows($(data).parent().parent()).data()[0][4]);
    $('#trItemSpecPMPackaging_txtTestCode').val(tablePackaging.rows($(data).parent().parent()).data()[0][5]);
    $('#trItemSpecPMPackaging_txtTestClass').val(tablePackaging.rows($(data).parent().parent()).data()[0][6]);
    $('#trItemSpecPMPackaging_txtTestUnit').val(tablePackaging.rows($(data).parent().parent()).data()[0][7]);

    $('#trItemSpecPMPackaging_txtTestMethodCode').val(tablePackaging.rows($(data).parent().parent()).data()[0][8]);
    $('#trItemSpecPMPackaging_txtTestType').val(tablePackaging.rows($(data).parent().parent()).data()[0][9]);
    $('#trItemSpecPMPackaging_txtTarget').val(tablePackaging.rows($(data).parent().parent()).data()[0][10]);
    $('#trItemSpecPMPackaging_txtMin').val(tablePackaging.rows($(data).parent().parent()).data()[0][11]);
    $('#trItemSpecPMPackaging_txtMax').val(tablePackaging.rows($(data).parent().parent()).data()[0][12]);
    $('#trItemSpecPMPackaging_txtResult').val(tablePackaging.rows($(data).parent().parent()).data()[0][13]);
    $('#trItemSpecPMPackaging_txtStatus').val(tablePackaging.rows($(data).parent().parent()).data()[0][14]);
    $('#trItemSpecPMPackaging_txtDetail').val(tablePackaging.rows($(data).parent().parent()).data()[0][15]);
    //$('#trItemSpecPMPackaging_bitNotAnalyzed').val(tablePackaging.rows($(data).parent().parent()).data()[0][16]);
    var isNotAnalyzed = tablePackaging.rows($(data).parent().parent()).data()[0][16];
    $('#trItemSpecPMPackaging_bitNotAnalyzed').prop("checked", isNotAnalyzed === true || isNotAnalyzed === "true");

    $('#SaveEditDetailPackaging').val("EDIT");
    p_UItrItemSpecPMPackagingToData();

    $('#modalPackaging').modal('show');
};

function editRowContaminant(data) {
   

    $('#trItemSpecPMContaminant_txtTrItemSpecPMContaminantID').val(tableContaminant.rows($(data).parent().parent()).data()[0][2]);
    $('#trItemSpecPMContaminant_intLineID').val(tableContaminant.rows($(data).parent().parent()).data()[0][3]);
    $('#trItemSpecPMContaminant_intTestID').val(tableContaminant.rows($(data).parent().parent()).data()[0][4]);
    $('#trItemSpecPMContaminant_txtTestCode').val(tableContaminant.rows($(data).parent().parent()).data()[0][5]);
    $('#trItemSpecPMContaminant_txtTestClass').val(tableContaminant.rows($(data).parent().parent()).data()[0][6]);
    $('#trItemSpecPMContaminant_txtTestUnit').val(tableContaminant.rows($(data).parent().parent()).data()[0][7]);

    $('#trItemSpecPMContaminant_txtTestMethodCode').val(tableContaminant.rows($(data).parent().parent()).data()[0][8]);
    $('#trItemSpecPMContaminant_txtTestType').val(tableContaminant.rows($(data).parent().parent()).data()[0][9]);
    $('#trItemSpecPMContaminant_txtTarget').val(tableContaminant.rows($(data).parent().parent()).data()[0][10]);
    $('#trItemSpecPMContaminant_txtMin').val(tableContaminant.rows($(data).parent().parent()).data()[0][11]);
    $('#trItemSpecPMContaminant_txtMax').val(tableContaminant.rows($(data).parent().parent()).data()[0][12]);
    $('#trItemSpecPMContaminant_txtResult').val(tableContaminant.rows($(data).parent().parent()).data()[0][13]);
    $('#trItemSpecPMContaminant_txtStatus').val(tableContaminant.rows($(data).parent().parent()).data()[0][14]);
    $('#trItemSpecPMContaminant_txtDetail').val(tableContaminant.rows($(data).parent().parent()).data()[0][15]);
    //$('#trItemSpecPMContaminant_bitNotAnalyzed').val(tableContaminant.rows($(data).parent().parent()).data()[0][16]);
    var isNotAnalyzed = tableContaminant.rows($(data).parent().parent()).data()[0][16];
    $('#trItemSpecPMContaminant_bitNotAnalyzed').prop("checked", isNotAnalyzed === true || isNotAnalyzed === "true");

    $('#SaveEditDetailContaminant').val("EDIT");
    p_UItrItemSpecPMContaminantToData();

    $('#modalContaminant').modal('show');
};

//function editRowVisual(data) {
//   

//    var row = tableVisual.row($(data).closest('tr')).data();

//    if (!row) return;

//    $('#trItemSpecPMVisual_txtTrItemSpecPMVisualID').val(row[2]);
//    $('#trItemSpecPMVisual_intLineID').val(row[3]);
//    $('#trItemSpecPMVisual_intTestID').val(row[4]);
//    $('#trItemSpecPMVisual_txtTestCode').val(row[5]);
//    $('#trItemSpecPMVisual_txtTestClass').val(row[6]);
//    $('#trItemSpecPMVisual_txtTestUnit').val(row[7]);
//    $('#trItemSpecPMVisual_txtTestMethodCode').val(row[8]);
//    $('#trItemSpecPMVisual_txtTestType').val(row[9]);
//    $('#trItemSpecPMVisual_txtTarget').val(row[10]);
//    $('#trItemSpecPMVisual_txtMin').val(row[11]);
//    $('#trItemSpecPMVisual_txtMax').val(row[12]);
//    $('#trItemSpecPMVisual_txtResult').val(row[13]);
//    $('#trItemSpecPMVisual_txtStatus').val(row[14]);
//    $('#trItemSpecPMVisual_txtDetail').val(row[15]);
//    $('#trItemSpecPMVisual_bitNotAnalyzed').val(row[16]);

//    $('#SaveEditDetailVisual').val("EDIT");

//    p_UItrItemSpecPMVisualToData();
//    $('#modalVisual').modal('show');
//}
function deleteRowVisualdata(data) {
   
    clsGlobal.getConfirmation("Delete this data?",
        function (result) {
            if (result == true) {
               
                tableVisual.rows($(data).parent().parent().parent()).remove().draw();
                // Refresh urutan
                refreshVisualLineIDs();
            } else {
                return false;
            }
        });
};

function deleteRowDimensiondata(data) {
   
    clsGlobal.getConfirmation("Delete this data?",
        function (result) {
            if (result == true) {
               
                tableDimension.rows($(data).parent().parent().parent()).remove().draw();
                // Refresh urutan
                refreshDimensionLineIDs();
            } else {
                return false;
            }
        });
};

function deleteRowMaterialdata(data) {
   
    clsGlobal.getConfirmation("Delete this data?",
        function (result) {
            if (result == true) {
               
                tableMaterial.rows($(data).parent().parent().parent()).remove().draw();
                // Refresh urutan
                refreshMaterialLineIDs();
            } else {
                return false;
            }
        });
};

function deleteRowPackagingdata(data) {
   
    clsGlobal.getConfirmation("Delete this data?",
        function (result) {
            if (result == true) {
               
                tablePackaging.rows($(data).parent().parent().parent()).remove().draw();
                // Refresh urutan
                refreshPackagingLineIDs();
            } else {
                return false;
            }
        });
};

function deleteRowContaminantdata(data) {
   
    clsGlobal.getConfirmation("Delete this data?",
        function (result) {
            if (result == true) {
               
                tableContaminant.rows($(data).parent().parent().parent()).remove().draw();
                // Refresh urutan
                refreshContaminantLineIDs();
            } else {
                return false;
            }
        });
};

$('#btnSubmitVisualDetail').bind('click',
    function () {
        try {
           
            p_UItrItemSpecPMVisualToData();
           

            if ($('#tableVisual tbody td').length > 1) {
                if ($('#trItemSpecPMVisual_txtTestCode').val() == "") {
                    //$('#modalRisk').modal('hide');
                    clsGlobal.getAlert("Pastikan bahwa semua kolom sudah Anda isi!!!!!!");
                }
                else {
                   
                    var b = $('#SaveEditDetailVisual').val();
                    if ($('#SaveEditDetailVisual').val() == "SUBMIT") {
                        var txtTrItemSpecPMVisualID = generateUUID();
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
                            txtTrItemSpecPMVisualID,
                            visualLineCounter++,
                            $('#trItemSpecPMVisual_intTestID').val(),
                            $('#trItemSpecPMVisual_txtTestCode').val(),
                            $('#trItemSpecPMVisual_txtTestClass').val(),
                            $('#trItemSpecPMVisual_txtTestUnit').val(),
                            $('#trItemSpecPMVisual_txtTestMethodCode').val(),
                            $('#trItemSpecPMVisual_txtTestType').val(),
                            $('#trItemSpecPMVisual_txtTarget').val(),
                            $('#trItemSpecPMVisual_txtMin').val(),
                            $('#trItemSpecPMVisual_txtMax').val(),
                            $('#trItemSpecPMVisual_txtResult').val(),
                            $('#trItemSpecPMVisual_txtStatus').val(),
                            $('#trItemSpecPMVisual_txtDetail').val(),
                            /*$('#trItemSpecPMVisual_bitNotAnalyzed').is(':checked')*/
                            $('#trItemSpecPMVisual_bitNotAnalyzed').prop('checked') ? true : false
                        ]).draw(false);

                        p_UItrItemSpecPMVisualToData();
                        $('#modalVisual').modal('hide');
                    } else {
                        //$.blockUI();
                       
                        tableVisual.clear().draw(false);

                        var jsonData = JSON.parse($("#txtHiddenDetailVisualObject").val());
                        for (var i = 0; i < jsonData.length; i++) {
                            if ((jsonData[i].trItemSpecPMVisual_txtTrItemSpecPMVisualID == $('#trItemSpecPMVisual_txtTrItemSpecPMVisualID').val())) {

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
                                    $('#trItemSpecPMVisual_txtTrItemSpecPMVisualID').val(),
                                    $('#trItemSpecPMVisual_intLineID').val(),
                                    $('#trItemSpecPMVisual_intTestID').val(),
                                    $('#trItemSpecPMVisual_txtTestCode').val(),
                                    $('#trItemSpecPMVisual_txtTestClass').val(),
                                    $('#trItemSpecPMVisual_txtTestUnit').val(),
                                    $('#trItemSpecPMVisual_txtTestMethodCode').val(),
                                    $('#trItemSpecPMVisual_txtTestType').val(),
                                    $('#trItemSpecPMVisual_txtTarget').val(),
                                    $('#trItemSpecPMVisual_txtMin').val(),
                                    $('#trItemSpecPMVisual_txtMax').val(),
                                    $('#trItemSpecPMVisual_txtResult').val(),
                                    $('#trItemSpecPMVisual_txtStatus').val(),
                                    $('#trItemSpecPMVisual_txtDetail').val(),
                                    //    $('#trItemSpecPMVisual_bitNotAnalyzed').is(':checked')
                                    $('#trItemSpecPMVisual_bitNotAnalyzed').prop('checked') ? true : false
                                ]).draw(false);
                            } else {
                               

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
                                    jsonData[i].trItemSpecPMVisual_txtTrItemSpecPMVisualID,
                                    jsonData[i].trItemSpecPMVisual_intLineID,
                                    jsonData[i].trItemSpecPMVisual_intTestID,
                                    jsonData[i].trItemSpecPMVisual_txtTestCode,
                                    jsonData[i].trItemSpecPMVisual_txtTestClass,
                                    jsonData[i].trItemSpecPMVisual_txtTestUnit,
                                    jsonData[i].trItemSpecPMVisual_txtTestMethodCode,
                                    jsonData[i].trItemSpecPMVisual_txtTestType,
                                    jsonData[i].trItemSpecPMVisual_txtTarget,
                                    jsonData[i].trItemSpecPMVisual_txtMin,
                                    jsonData[i].trItemSpecPMVisual_txtMax,
                                    jsonData[i].trItemSpecPMVisual_txtResult,
                                    jsonData[i].trItemSpecPMVisual_txtStatus,
                                    jsonData[i].trItemSpecPMVisual_txtDetail,
                                    //    jsonData[i].trItemSpecPMVisual_bitNotAnalyzed
                                    /*jsonData[i].trItemSpecPMVisual_bitNotAnalyzed === true ? true : false*/
                                    (jsonData[i].trItemSpecPMVisual_bitNotAnalyzed === true || jsonData[i].trItemSpecPMVisual_bitNotAnalyzed === "true")
                                ]).draw(false);
                            }
                        }
                        p_UItrItemSpecPMVisualToData();
                        $('#modalVisual').modal('hide');
                        //    $.UnblockUI();
                    }
                };
            } else {
                if ($('#trItemSpecPMVisual_txtTestCode').val() == "") {
                    //$('#modalVisual').modal('hide');
                    clsGlobal.getAlert("Pastikan bahwa semua kolom sudah Anda isi!!!!!!");
                }
                else {
                   
                    var b = $('#SaveEditDetailVisual').val();
                    if ($('#SaveEditDetailVisual').val() == "SUBMIT") {
                        var txtTrItemSpecPMVisualID = generateUUID();
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
                            txtTrItemSpecPMVisualID,
                            visualLineCounter++,
                            $('#trItemSpecPMVisual_intTestID').val(),
                            $('#trItemSpecPMVisual_txtTestCode').val(),
                            $('#trItemSpecPMVisual_txtTestClass').val(),
                            $('#trItemSpecPMVisual_txtTestUnit').val(),
                            $('#trItemSpecPMVisual_txtTestMethodCode').val(),
                            $('#trItemSpecPMVisual_txtTestType').val(),
                            $('#trItemSpecPMVisual_txtTarget').val(),
                            $('#trItemSpecPMVisual_txtMin').val(),
                            $('#trItemSpecPMVisual_txtMax').val(),
                            $('#trItemSpecPMVisual_txtResult').val(),
                            $('#trItemSpecPMVisual_txtStatus').val(),
                            $('#trItemSpecPMVisual_txtDetail').val(),
                            //    $('#trItemSpecPMVisual_bitNotAnalyzed').is(':checked')
                            $('#trItemSpecPMVisual_bitNotAnalyzed').prop('checked') ? true : false
                        ]).draw(false);
                        p_UItrItemSpecPMVisualToData();
                        $('#modalVisual').modal('hide');
                    } else {
                        //$.blockUI();
                       
                        tableVisual.clear().draw(false);

                        var jsonData = JSON.parse($("#txtHiddenDetailVisualObject").val());
                        for (var i = 0; i < jsonData.length; i++) {
                            if ((jsonData[i].trItemSpecPMVisual_txtTrItemSpecPMVisualID == $('#trItemSpecPMVisual_txtTrItemSpecPMVisualID').val())) {

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
                                    $('#trItemSpecPMVisual_txtTrItemSpecPMVisualID').val(),
                                    $('#trItemSpecPMVisual_intLineID').val(),
                                    $('#trItemSpecPMVisual_intTestID').val(),
                                    $('#trItemSpecPMVisual_txtTestCode').val(),
                                    $('#trItemSpecPMVisual_txtTestClass').val(),
                                    $('#trItemSpecPMVisual_txtTestUnit').val(),
                                    $('#trItemSpecPMVisual_txtTestMethodCode').val(),
                                    $('#trItemSpecPMVisual_txtTestType').val(),
                                    $('#trItemSpecPMVisual_txtTarget').val(),
                                    $('#trItemSpecPMVisual_txtMin').val(),
                                    $('#trItemSpecPMVisual_txtMax').val(),
                                    $('#trItemSpecPMVisual_txtResult').val(),
                                    $('#trItemSpecPMVisual_txtStatus').val(),
                                    $('#trItemSpecPMVisual_txtDetail').val(),
                                    //    $('#trItemSpecPMVisual_bitNotAnalyzed').is(':checked')
                                    $('#trItemSpecPMVisual_bitNotAnalyzed').prop('checked') ? true : false
                                ]).draw(false);
                            } else {
                               

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
                                    jsonData[i].trItemSpecPMVisual_txtTrItemSpecPMVisualID,
                                    jsonData[i].trItemSpecPMVisual_intLineID,
                                    jsonData[i].trItemSpecPMVisual_intTestID,
                                    jsonData[i].trItemSpecPMVisual_txtTestCode,
                                    jsonData[i].trItemSpecPMVisual_txtTestClass,
                                    jsonData[i].trItemSpecPMVisual_txtTestUnit,
                                    jsonData[i].trItemSpecPMVisual_txtTestMethodCode,
                                    jsonData[i].trItemSpecPMVisual_txtTestType,
                                    jsonData[i].trItemSpecPMVisual_txtTarget,
                                    jsonData[i].trItemSpecPMVisual_txtMin,
                                    jsonData[i].trItemSpecPMVisual_txtMax,
                                    jsonData[i].trItemSpecPMVisual_txtResult,
                                    jsonData[i].trItemSpecPMVisual_txtStatus,
                                    jsonData[i].trItemSpecPMVisual_txtDetail,
                                    //    jsonData[i].trItemSpecPMVisual_bitNotAnalyzed
                                    //    jsonData[i].trItemSpecPMVisual_bitNotAnalyzed === true ? true : false
                                    (jsonData[i].trItemSpecPMVisual_bitNotAnalyzed === true || jsonData[i].trItemSpecPMVisual_bitNotAnalyzed === "true")
                                ]).draw(false);
                            }
                        }
                        p_UItrItemSpecPMVisualToData();
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
           
            p_UItrItemSpecPMDimensionToData();
           

            if ($('#tableDimension tbody td').length > 1) {
                if ($('#trItemSpecPMDimension_txtTestCode').val() == "") {
                    //$('#modalRisk').modal('hide');
                    clsGlobal.getAlert("Pastikan bahwa semua kolom sudah Anda isi!!!!!!");
                }
                else {
                   
                    var b = $('#SaveEditDetailDimension').val();
                    if ($('#SaveEditDetailDimension').val() == "SUBMIT") {
                        var txtTrItemSpecPMDimensionID = generateUUID();
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
                            txtTrItemSpecPMDimensionID,
                            DimensionLineCounter++,
                            $('#trItemSpecPMDimension_intTestID').val(),
                            $('#trItemSpecPMDimension_txtTestCode').val(),
                            $('#trItemSpecPMDimension_txtTestClass').val(),
                            $('#trItemSpecPMDimension_txtTestUnit').val(),
                            $('#trItemSpecPMDimension_txtTestMethodCode').val(),
                            $('#trItemSpecPMDimension_txtTestType').val(),
                            $('#trItemSpecPMDimension_txtTarget').val(),
                            $('#trItemSpecPMDimension_txtMin').val(),
                            $('#trItemSpecPMDimension_txtMax').val(),
                            $('#trItemSpecPMDimension_txtResult').val(),
                            $('#trItemSpecPMDimension_txtStatus').val(),
                            $('#trItemSpecPMDimension_txtDetail').val(),
                            //    $('#trItemSpecPMDimension_bitNotAnalyzed').is(':checked')
                            $('#trItemSpecPMDimension_bitNotAnalyzed').prop('checked') ? true : false
                        ]).draw(false);

                        p_UItrItemSpecPMDimensionToData();
                        $('#modalDimension').modal('hide');
                    } else {
                        //$.blockUI();
                       
                        tableDimension.clear().draw(false);

                        var jsonData = JSON.parse($("#txtHiddenDetailDimensionObject").val());
                        for (var i = 0; i < jsonData.length; i++) {
                            if ((jsonData[i].trItemSpecPMDimension_txtTrItemSpecPMDimensionID == $('#trItemSpecPMDimension_txtTrItemSpecPMDimensionID').val())) {

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
                                    $('#trItemSpecPMDimension_txtTrItemSpecPMDimensionID').val(),
                                    $('#trItemSpecPMDimension_intLineID').val(),
                                    $('#trItemSpecPMDimension_intTestID').val(),
                                    $('#trItemSpecPMDimension_txtTestCode').val(),
                                    $('#trItemSpecPMDimension_txtTestClass').val(),
                                    $('#trItemSpecPMDimension_txtTestUnit').val(),
                                    $('#trItemSpecPMDimension_txtTestMethodCode').val(),
                                    $('#trItemSpecPMDimension_txtTestType').val(),
                                    $('#trItemSpecPMDimension_txtTarget').val(),
                                    $('#trItemSpecPMDimension_txtMin').val(),
                                    $('#trItemSpecPMDimension_txtMax').val(),
                                    $('#trItemSpecPMDimension_txtResult').val(),
                                    $('#trItemSpecPMDimension_txtStatus').val(),
                                    $('#trItemSpecPMDimension_txtDetail').val(),
                                    $('#trItemSpecPMDimension_bitNotAnalyzed').prop('checked') ? true : false
                                ]).draw(false);
                            } else {
                               

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
                                    jsonData[i].trItemSpecPMDimension_txtTrItemSpecPMDimensionID,
                                    jsonData[i].trItemSpecPMDimension_intLineID,
                                    jsonData[i].trItemSpecPMDimension_intTestID,
                                    jsonData[i].trItemSpecPMDimension_txtTestCode,
                                    jsonData[i].trItemSpecPMDimension_txtTestClass,
                                    jsonData[i].trItemSpecPMDimension_txtTestUnit,
                                    jsonData[i].trItemSpecPMDimension_txtTestMethodCode,
                                    jsonData[i].trItemSpecPMDimension_txtTestType,
                                    jsonData[i].trItemSpecPMDimension_txtTarget,
                                    jsonData[i].trItemSpecPMDimension_txtMin,
                                    jsonData[i].trItemSpecPMDimension_txtMax,
                                    jsonData[i].trItemSpecPMDimension_txtResult,
                                    jsonData[i].trItemSpecPMDimension_txtStatus,
                                    jsonData[i].trItemSpecPMDimension_txtDetail,
                                    /*jsonData[i].trItemSpecPMDimension_bitNotAnalyzed*/
                                    (jsonData[i].trItemSpecPMDimension_bitNotAnalyzed === true || jsonData[i].trItemSpecPMDimension_bitNotAnalyzed === "true")
                                ]).draw(false);
                            }
                        }
                        p_UItrItemSpecPMDimensionToData();
                        $('#modalDimension').modal('hide');
                        //    $.UnblockUI();
                    }
                };
            } else {
                if ($('#trItemSpecPMDimension_txtTestCode').val() == "") {
                    //$('#modalDimension').modal('hide');
                    clsGlobal.getAlert("Pastikan bahwa semua kolom sudah Anda isi!!!!!!");
                }
                else {
                   
                    var b = $('#SaveEditDetailDimension').val();
                    if ($('#SaveEditDetailDimension').val() == "SUBMIT") {
                        var txtTrItemSpecPMDimensionID = generateUUID();
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
                            txtTrItemSpecPMDimensionID,
                            DimensionLineCounter++,
                            $('#trItemSpecPMDimension_intTestID').val(),
                            $('#trItemSpecPMDimension_txtTestCode').val(),
                            $('#trItemSpecPMDimension_txtTestClass').val(),
                            $('#trItemSpecPMDimension_txtTestUnit').val(),
                            $('#trItemSpecPMDimension_txtTestMethodCode').val(),
                            $('#trItemSpecPMDimension_txtTestType').val(),
                            $('#trItemSpecPMDimension_txtTarget').val(),
                            $('#trItemSpecPMDimension_txtMin').val(),
                            $('#trItemSpecPMDimension_txtMax').val(),
                            $('#trItemSpecPMDimension_txtResult').val(),
                            $('#trItemSpecPMDimension_txtStatus').val(),
                            $('#trItemSpecPMDimension_txtDetail').val(),
                            $('#trItemSpecPMDimension_bitNotAnalyzed').prop('checked') ? true : false
                        ]).draw(false);
                        p_UItrItemSpecPMDimensionToData();
                        $('#modalDimension').modal('hide');
                    } else {
                        //$.blockUI();
                       
                        tableDimension.clear().draw(false);

                        var jsonData = JSON.parse($("#txtHiddenDetailDimensionObject").val());
                        for (var i = 0; i < jsonData.length; i++) {
                            if ((jsonData[i].trItemSpecPMDimension_txtTrItemSpecPMDimensionID == $('#trItemSpecPMDimension_txtTrItemSpecPMDimensionID').val())) {

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
                                    $('#trItemSpecPMDimension_txtTrItemSpecPMDimensionID').val(),
                                    $('#trItemSpecPMDimension_intLineID').val(),
                                    $('#trItemSpecPMDimension_intTestID').val(),
                                    $('#trItemSpecPMDimension_txtTestCode').val(),
                                    $('#trItemSpecPMDimension_txtTestClass').val(),
                                    $('#trItemSpecPMDimension_txtTestUnit').val(),
                                    $('#trItemSpecPMDimension_txtTestMethodCode').val(),
                                    $('#trItemSpecPMDimension_txtTestType').val(),
                                    $('#trItemSpecPMDimension_txtTarget').val(),
                                    $('#trItemSpecPMDimension_txtMin').val(),
                                    $('#trItemSpecPMDimension_txtMax').val(),
                                    $('#trItemSpecPMDimension_txtResult').val(),
                                    $('#trItemSpecPMDimension_txtStatus').val(),
                                    $('#trItemSpecPMDimension_txtDetail').val(),
                                    $('#trItemSpecPMDimension_bitNotAnalyzed').prop('checked') ? true : false
                                ]).draw(false);
                            } else {
                               

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
                                    jsonData[i].trItemSpecPMDimension_txtTrItemSpecPMDimensionID,
                                    jsonData[i].trItemSpecPMDimension_intLineID,
                                    jsonData[i].trItemSpecPMDimension_intTestID,
                                    jsonData[i].trItemSpecPMDimension_txtTestCode,
                                    jsonData[i].trItemSpecPMDimension_txtTestClass,
                                    jsonData[i].trItemSpecPMDimension_txtTestUnit,
                                    jsonData[i].trItemSpecPMDimension_txtTestMethodCode,
                                    jsonData[i].trItemSpecPMDimension_txtTestType,
                                    jsonData[i].trItemSpecPMDimension_txtTarget,
                                    jsonData[i].trItemSpecPMDimension_txtMin,
                                    jsonData[i].trItemSpecPMDimension_txtMax,
                                    jsonData[i].trItemSpecPMDimension_txtResult,
                                    jsonData[i].trItemSpecPMDimension_txtStatus,
                                    jsonData[i].trItemSpecPMDimension_txtDetail,
                                    (jsonData[i].trItemSpecPMDimension_bitNotAnalyzed === true || jsonData[i].trItemSpecPMDimension_bitNotAnalyzed === "true")
                                ]).draw(false);
                            }
                        }
                        p_UItrItemSpecPMDimensionToData();
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
           
            p_UItrItemSpecPMMaterialToData();
           

            if ($('#tableMaterial tbody td').length > 1) {
                if ($('#trItemSpecPMMaterial_txtTestCode').val() == "") {
                    //$('#modalRisk').modal('hide');
                    clsGlobal.getAlert("Pastikan bahwa semua kolom sudah Anda isi!!!!!!");
                }
                else {
                   
                    var b = $('#SaveEditDetailMaterial').val();
                    if ($('#SaveEditDetailMaterial').val() == "SUBMIT") {
                        var txtTrItemSpecPMMaterialID = generateUUID();
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
                            txtTrItemSpecPMMaterialID,
                            MaterialLineCounter++,
                            $('#trItemSpecPMMaterial_intTestID').val(),
                            $('#trItemSpecPMMaterial_txtTestCode').val(),
                            $('#trItemSpecPMMaterial_txtTestClass').val(),
                            $('#trItemSpecPMMaterial_txtTestUnit').val(),
                            $('#trItemSpecPMMaterial_txtTestMethodCode').val(),
                            $('#trItemSpecPMMaterial_txtTestType').val(),
                            $('#trItemSpecPMMaterial_txtTarget').val(),
                            $('#trItemSpecPMMaterial_txtMin').val(),
                            $('#trItemSpecPMMaterial_txtMax').val(),
                            $('#trItemSpecPMMaterial_txtResult').val(),
                            $('#trItemSpecPMMaterial_txtStatus').val(),
                            $('#trItemSpecPMMaterial_txtDetail').val(),
                            /*$('#trItemSpecPMMaterial_bitNotAnalyzed').is(':checked')*/
                            $('#trItemSpecPMMaterial_bitNotAnalyzed').prop('checked') ? true : false
                        ]).draw(false);

                        p_UItrItemSpecPMMaterialToData();
                        $('#modalMaterial').modal('hide');
                    } else {
                        //$.blockUI();
                       
                        tableMaterial.clear().draw(false);

                        var jsonData = JSON.parse($("#txtHiddenDetailMaterialObject").val());
                        for (var i = 0; i < jsonData.length; i++) {
                            if ((jsonData[i].trItemSpecPMMaterial_txtTrItemSpecPMMaterialID == $('#trItemSpecPMMaterial_txtTrItemSpecPMMaterialID').val())) {

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
                                    $('#trItemSpecPMMaterial_txtTrItemSpecPMMaterialID').val(),
                                    $('#trItemSpecPMMaterial_intLineID').val(),
                                    $('#trItemSpecPMMaterial_intTestID').val(),
                                    $('#trItemSpecPMMaterial_txtTestCode').val(),
                                    $('#trItemSpecPMMaterial_txtTestClass').val(),
                                    $('#trItemSpecPMMaterial_txtTestUnit').val(),
                                    $('#trItemSpecPMMaterial_txtTestMethodCode').val(),
                                    $('#trItemSpecPMMaterial_txtTestType').val(),
                                    $('#trItemSpecPMMaterial_txtTarget').val(),
                                    $('#trItemSpecPMMaterial_txtMin').val(),
                                    $('#trItemSpecPMMaterial_txtMax').val(),
                                    $('#trItemSpecPMMaterial_txtResult').val(),
                                    $('#trItemSpecPMMaterial_txtStatus').val(),
                                    $('#trItemSpecPMMaterial_txtDetail').val(),
                                    $('#trItemSpecPMMaterial_bitNotAnalyzed').prop('checked') ? true : false
                                ]).draw(false);
                            } else {
                               

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
                                    jsonData[i].trItemSpecPMMaterial_txtTrItemSpecPMMaterialID,
                                    jsonData[i].trItemSpecPMMaterial_intLineID,
                                    jsonData[i].trItemSpecPMMaterial_intTestID,
                                    jsonData[i].trItemSpecPMMaterial_txtTestCode,
                                    jsonData[i].trItemSpecPMMaterial_txtTestClass,
                                    jsonData[i].trItemSpecPMMaterial_txtTestUnit,
                                    jsonData[i].trItemSpecPMMaterial_txtTestMethodCode,
                                    jsonData[i].trItemSpecPMMaterial_txtTestType,
                                    jsonData[i].trItemSpecPMMaterial_txtTarget,
                                    jsonData[i].trItemSpecPMMaterial_txtMin,
                                    jsonData[i].trItemSpecPMMaterial_txtMax,
                                    jsonData[i].trItemSpecPMMaterial_txtResult,
                                    jsonData[i].trItemSpecPMMaterial_txtStatus,
                                    jsonData[i].trItemSpecPMMaterial_txtDetail,
                                    /*jsonData[i].trItemSpecPMMaterial_bitNotAnalyzed*/
                                    (jsonData[i].trItemSpecPMMaterial_bitNotAnalyzed === true || jsonData[i].trItemSpecPMMaterial_bitNotAnalyzed === "true")
                                ]).draw(false);
                            }
                        }
                        p_UItrItemSpecPMMaterialToData();
                        $('#modalMaterial').modal('hide');
                        //    $.UnblockUI();
                    }
                };
            } else {
                if ($('#trItemSpecPMMaterial_txtTestCode').val() == "") {
                    //$('#modalMaterial').modal('hide');
                    clsGlobal.getAlert("Pastikan bahwa semua kolom sudah Anda isi!!!!!!");
                }
                else {
                   
                    var b = $('#SaveEditDetailMaterial').val();
                    if ($('#SaveEditDetailMaterial').val() == "SUBMIT") {
                        var txtTrItemSpecPMMaterialID = generateUUID();
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
                            txtTrItemSpecPMMaterialID,
                            MaterialLineCounter++,
                            $('#trItemSpecPMMaterial_intTestID').val(),
                            $('#trItemSpecPMMaterial_txtTestCode').val(),
                            $('#trItemSpecPMMaterial_txtTestClass').val(),
                            $('#trItemSpecPMMaterial_txtTestUnit').val(),
                            $('#trItemSpecPMMaterial_txtTestMethodCode').val(),
                            $('#trItemSpecPMMaterial_txtTestType').val(),
                            $('#trItemSpecPMMaterial_txtTarget').val(),
                            $('#trItemSpecPMMaterial_txtMin').val(),
                            $('#trItemSpecPMMaterial_txtMax').val(),
                            $('#trItemSpecPMMaterial_txtResult').val(),
                            $('#trItemSpecPMMaterial_txtStatus').val(),
                            $('#trItemSpecPMMaterial_txtDetail').val(),
                            $('#trItemSpecPMMaterial_bitNotAnalyzed').prop('checked') ? true : false
                        ]).draw(false);
                        p_UItrItemSpecPMMaterialToData();
                        $('#modalMaterial').modal('hide');
                    } else {
                        //$.blockUI();
                       
                        tableMaterial.clear().draw(false);

                        var jsonData = JSON.parse($("#txtHiddenDetailMaterialObject").val());
                        for (var i = 0; i < jsonData.length; i++) {
                            if ((jsonData[i].trItemSpecPMMaterial_txtTrItemSpecPMMaterialID == $('#trItemSpecPMMaterial_txtTrItemSpecPMMaterialID').val())) {

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
                                    $('#trItemSpecPMMaterial_txtTrItemSpecPMMaterialID').val(),
                                    $('#trItemSpecPMMaterial_intLineID').val(),
                                    $('#trItemSpecPMMaterial_intTestID').val(),
                                    $('#trItemSpecPMMaterial_txtTestCode').val(),
                                    $('#trItemSpecPMMaterial_txtTestClass').val(),
                                    $('#trItemSpecPMMaterial_txtTestUnit').val(),
                                    $('#trItemSpecPMMaterial_txtTestMethodCode').val(),
                                    $('#trItemSpecPMMaterial_txtTestType').val(),
                                    $('#trItemSpecPMMaterial_txtTarget').val(),
                                    $('#trItemSpecPMMaterial_txtMin').val(),
                                    $('#trItemSpecPMMaterial_txtMax').val(),
                                    $('#trItemSpecPMMaterial_txtResult').val(),
                                    $('#trItemSpecPMMaterial_txtStatus').val(),
                                    $('#trItemSpecPMMaterial_txtDetail').val(),
                                    $('#trItemSpecPMMaterial_bitNotAnalyzed').prop('checked') ? true : false
                                ]).draw(false);
                            } else {
                               

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
                                    jsonData[i].trItemSpecPMMaterial_txtTrItemSpecPMMaterialID,
                                    jsonData[i].trItemSpecPMMaterial_intLineID,
                                    jsonData[i].trItemSpecPMMaterial_intTestID,
                                    jsonData[i].trItemSpecPMMaterial_txtTestCode,
                                    jsonData[i].trItemSpecPMMaterial_txtTestClass,
                                    jsonData[i].trItemSpecPMMaterial_txtTestUnit,
                                    jsonData[i].trItemSpecPMMaterial_txtTestMethodCode,
                                    jsonData[i].trItemSpecPMMaterial_txtTestType,
                                    jsonData[i].trItemSpecPMMaterial_txtTarget,
                                    jsonData[i].trItemSpecPMMaterial_txtMin,
                                    jsonData[i].trItemSpecPMMaterial_txtMax,
                                    jsonData[i].trItemSpecPMMaterial_txtResult,
                                    jsonData[i].trItemSpecPMMaterial_txtStatus,
                                    jsonData[i].trItemSpecPMMaterial_txtDetail,
                                    //    jsonData[i].trItemSpecPMMaterial_bitNotAnalyzed
                                    (jsonData[i].trItemSpecPMMaterial_bitNotAnalyzed === true || jsonData[i].trItemSpecPMMaterial_bitNotAnalyzed === "true")
                                ]).draw(false);
                            }
                        }
                        p_UItrItemSpecPMMaterialToData();
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
           
            p_UItrItemSpecPMPackagingToData();
           

            if ($('#tablePackaging tbody td').length > 1) {
                if ($('#trItemSpecPMPackaging_txtTestCode').val() == "") {
                    //$('#modalRisk').modal('hide');
                    clsGlobal.getAlert("Pastikan bahwa semua kolom sudah Anda isi!!!!!!");
                }
                else {
                   
                    var b = $('#SaveEditDetailPackaging').val();
                    if ($('#SaveEditDetailPackaging').val() == "SUBMIT") {
                        var txtTrItemSpecPMPackagingID = generateUUID();
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
                            txtTrItemSpecPMPackagingID,
                            PackagingLineCounter++,
                            $('#trItemSpecPMPackaging_intTestID').val(),
                            $('#trItemSpecPMPackaging_txtTestCode').val(),
                            $('#trItemSpecPMPackaging_txtTestClass').val(),
                            $('#trItemSpecPMPackaging_txtTestUnit').val(),
                            $('#trItemSpecPMPackaging_txtTestMethodCode').val(),
                            $('#trItemSpecPMPackaging_txtTestType').val(),
                            $('#trItemSpecPMPackaging_txtTarget').val(),
                            $('#trItemSpecPMPackaging_txtMin').val(),
                            $('#trItemSpecPMPackaging_txtMax').val(),
                            $('#trItemSpecPMPackaging_txtResult').val(),
                            $('#trItemSpecPMPackaging_txtStatus').val(),
                            $('#trItemSpecPMPackaging_txtDetail').val(),
                            //    $('#trItemSpecPMPackaging_bitNotAnalyzed').is(':checked')
                            $('#trItemSpecPMPackaging_bitNotAnalyzed').prop('checked') ? true : false
                        ]).draw(false);

                        p_UItrItemSpecPMPackagingToData();
                        $('#modalPackaging').modal('hide');
                    } else {
                        //$.blockUI();
                       
                        tablePackaging.clear().draw(false);

                        var jsonData = JSON.parse($("#txtHiddenDetailPackagingObject").val());
                        for (var i = 0; i < jsonData.length; i++) {
                            if ((jsonData[i].trItemSpecPMPackaging_txtTrItemSpecPMPackagingID == $('#trItemSpecPMPackaging_txtTrItemSpecPMPackagingID').val())) {

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
                                    $('#trItemSpecPMPackaging_txtTrItemSpecPMPackagingID').val(),
                                    $('#trItemSpecPMPackaging_intLineID').val(),
                                    $('#trItemSpecPMPackaging_intTestID').val(),
                                    $('#trItemSpecPMPackaging_txtTestCode').val(),
                                    $('#trItemSpecPMPackaging_txtTestClass').val(),
                                    $('#trItemSpecPMPackaging_txtTestUnit').val(),
                                    $('#trItemSpecPMPackaging_txtTestMethodCode').val(),
                                    $('#trItemSpecPMPackaging_txtTestType').val(),
                                    $('#trItemSpecPMPackaging_txtTarget').val(),
                                    $('#trItemSpecPMPackaging_txtMin').val(),
                                    $('#trItemSpecPMPackaging_txtMax').val(),
                                    $('#trItemSpecPMPackaging_txtResult').val(),
                                    $('#trItemSpecPMPackaging_txtStatus').val(),
                                    $('#trItemSpecPMPackaging_txtDetail').val(),
                                    $('#trItemSpecPMPackaging_bitNotAnalyzed').prop('checked') ? true : false
                                ]).draw(false);
                            } else {
                               

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
                                    jsonData[i].trItemSpecPMPackaging_txtTrItemSpecPMPackagingID,
                                    jsonData[i].trItemSpecPMPackaging_intLineID,
                                    jsonData[i].trItemSpecPMPackaging_intTestID,
                                    jsonData[i].trItemSpecPMPackaging_txtTestCode,
                                    jsonData[i].trItemSpecPMPackaging_txtTestClass,
                                    jsonData[i].trItemSpecPMPackaging_txtTestUnit,
                                    jsonData[i].trItemSpecPMPackaging_txtTestMethodCode,
                                    jsonData[i].trItemSpecPMPackaging_txtTestType,
                                    jsonData[i].trItemSpecPMPackaging_txtTarget,
                                    jsonData[i].trItemSpecPMPackaging_txtMin,
                                    jsonData[i].trItemSpecPMPackaging_txtMax,
                                    jsonData[i].trItemSpecPMPackaging_txtResult,
                                    jsonData[i].trItemSpecPMPackaging_txtStatus,
                                    jsonData[i].trItemSpecPMPackaging_txtDetail,
                                    //    jsonData[i].trItemSpecPMPackaging_bitNotAnalyzed
                                    (jsonData[i].trItemSpecPMPackaging_bitNotAnalyzed === true || jsonData[i].trItemSpecPMPackaging_bitNotAnalyzed === "true")
                                ]).draw(false);
                            }
                        }
                        p_UItrItemSpecPMPackagingToData();
                        $('#modalPackaging').modal('hide');
                        //    $.UnblockUI();
                    }
                };
            } else {
                if ($('#trItemSpecPMPackaging_txtTestCode').val() == "") {
                    //$('#modalPackaging').modal('hide');
                    clsGlobal.getAlert("Pastikan bahwa semua kolom sudah Anda isi!!!!!!");
                }
                else {
                   
                    var b = $('#SaveEditDetailPackaging').val();
                    if ($('#SaveEditDetailPackaging').val() == "SUBMIT") {
                        var txtTrItemSpecPMPackagingID = generateUUID();
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
                            txtTrItemSpecPMPackagingID,
                            PackagingLineCounter++,
                            $('#trItemSpecPMPackaging_intTestID').val(),
                            $('#trItemSpecPMPackaging_txtTestCode').val(),
                            $('#trItemSpecPMPackaging_txtTestClass').val(),
                            $('#trItemSpecPMPackaging_txtTestUnit').val(),
                            $('#trItemSpecPMPackaging_txtTestMethodCode').val(),
                            $('#trItemSpecPMPackaging_txtTestType').val(),
                            $('#trItemSpecPMPackaging_txtTarget').val(),
                            $('#trItemSpecPMPackaging_txtMin').val(),
                            $('#trItemSpecPMPackaging_txtMax').val(),
                            $('#trItemSpecPMPackaging_txtResult').val(),
                            $('#trItemSpecPMPackaging_txtStatus').val(),
                            $('#trItemSpecPMPackaging_txtDetail').val(),
                            $('#trItemSpecPMPackaging_bitNotAnalyzed').prop('checked') ? true : false
                        ]).draw(false);
                        p_UItrItemSpecPMPackagingToData();
                        $('#modalPackaging').modal('hide');
                    } else {
                        //$.blockUI();
                       
                        tablePackaging.clear().draw(false);

                        var jsonData = JSON.parse($("#txtHiddenDetailPackagingObject").val());
                        for (var i = 0; i < jsonData.length; i++) {
                            if ((jsonData[i].trItemSpecPMPackaging_txtTrItemSpecPMPackagingID == $('#trItemSpecPMPackaging_txtTrItemSpecPMPackagingID').val())) {

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
                                    $('#trItemSpecPMPackaging_txtTrItemSpecPMPackagingID').val(),
                                    $('#trItemSpecPMPackaging_intLineID').val(),
                                    $('#trItemSpecPMPackaging_intTestID').val(),
                                    $('#trItemSpecPMPackaging_txtTestCode').val(),
                                    $('#trItemSpecPMPackaging_txtTestClass').val(),
                                    $('#trItemSpecPMPackaging_txtTestUnit').val(),
                                    $('#trItemSpecPMPackaging_txtTestMethodCode').val(),
                                    $('#trItemSpecPMPackaging_txtTestType').val(),
                                    $('#trItemSpecPMPackaging_txtTarget').val(),
                                    $('#trItemSpecPMPackaging_txtMin').val(),
                                    $('#trItemSpecPMPackaging_txtMax').val(),
                                    $('#trItemSpecPMPackaging_txtResult').val(),
                                    $('#trItemSpecPMPackaging_txtStatus').val(),
                                    $('#trItemSpecPMPackaging_txtDetail').val(),
                                    $('#trItemSpecPMPackaging_bitNotAnalyzed').prop('checked') ? true : false
                                ]).draw(false);
                            } else {
                               

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
                                    jsonData[i].trItemSpecPMPackaging_txtTrItemSpecPMPackagingID,
                                    jsonData[i].trItemSpecPMPackaging_intLineID,
                                    jsonData[i].trItemSpecPMPackaging_intTestID,
                                    jsonData[i].trItemSpecPMPackaging_txtTestCode,
                                    jsonData[i].trItemSpecPMPackaging_txtTestClass,
                                    jsonData[i].trItemSpecPMPackaging_txtTestUnit,
                                    jsonData[i].trItemSpecPMPackaging_txtTestMethodCode,
                                    jsonData[i].trItemSpecPMPackaging_txtTestType,
                                    jsonData[i].trItemSpecPMPackaging_txtTarget,
                                    jsonData[i].trItemSpecPMPackaging_txtMin,
                                    jsonData[i].trItemSpecPMPackaging_txtMax,
                                    jsonData[i].trItemSpecPMPackaging_txtResult,
                                    jsonData[i].trItemSpecPMPackaging_txtStatus,
                                    jsonData[i].trItemSpecPMPackaging_txtDetail,
                                    (jsonData[i].trItemSpecPMPackaging_bitNotAnalyzed === true || jsonData[i].trItemSpecPMPackaging_bitNotAnalyzed === "true")
                                ]).draw(false);
                            }
                        }
                        p_UItrItemSpecPMPackagingToData();
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
           
            p_UItrItemSpecPMContaminantToData();
           

            if ($('#tableContaminant tbody td').length > 1) {
                if ($('#trItemSpecPMContaminant_txtTestCode').val() == "") {
                    //$('#modalRisk').modal('hide');
                    clsGlobal.getAlert("Pastikan bahwa semua kolom sudah Anda isi!!!!!!");
                }
                else {
                   
                    var b = $('#SaveEditDetailContaminant').val();
                    if ($('#SaveEditDetailContaminant').val() == "SUBMIT") {
                        var txtTrItemSpecPMContaminantID = generateUUID();
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
                            txtTrItemSpecPMContaminantID,
                            ContaminantLineCounter++,
                            $('#trItemSpecPMContaminant_intTestID').val(),
                            $('#trItemSpecPMContaminant_txtTestCode').val(),
                            $('#trItemSpecPMContaminant_txtTestClass').val(),
                            $('#trItemSpecPMContaminant_txtTestUnit').val(),
                            $('#trItemSpecPMContaminant_txtTestMethodCode').val(),
                            $('#trItemSpecPMContaminant_txtTestType').val(),
                            $('#trItemSpecPMContaminant_txtTarget').val(),
                            $('#trItemSpecPMContaminant_txtMin').val(),
                            $('#trItemSpecPMContaminant_txtMax').val(),
                            $('#trItemSpecPMContaminant_txtResult').val(),
                            $('#trItemSpecPMContaminant_txtStatus').val(),
                            $('#trItemSpecPMContaminant_txtDetail').val(),
                            /*$('#trItemSpecPMContaminant_bitNotAnalyzed').is(':checked')*/
                            $('#trItemSpecPMContaminant_bitNotAnalyzed').prop('checked') ? true : false
                        ]).draw(false);

                        p_UItrItemSpecPMContaminantToData();
                        $('#modalContaminant').modal('hide');
                    } else {
                        //$.blockUI();
                       
                        tableContaminant.clear().draw(false);

                        var jsonData = JSON.parse($("#txtHiddenDetailContaminantObject").val());
                        for (var i = 0; i < jsonData.length; i++) {
                            if ((jsonData[i].trItemSpecPMContaminant_txtTrItemSpecPMContaminantID == $('#trItemSpecPMContaminant_txtTrItemSpecPMContaminantID').val())) {

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
                                    $('#trItemSpecPMContaminant_txtTrItemSpecPMContaminantID').val(),
                                    $('#trItemSpecPMContaminant_intLineID').val(),
                                    $('#trItemSpecPMContaminant_intTestID').val(),
                                    $('#trItemSpecPMContaminant_txtTestCode').val(),
                                    $('#trItemSpecPMContaminant_txtTestClass').val(),
                                    $('#trItemSpecPMContaminant_txtTestUnit').val(),
                                    $('#trItemSpecPMContaminant_txtTestMethodCode').val(),
                                    $('#trItemSpecPMContaminant_txtTestType').val(),
                                    $('#trItemSpecPMContaminant_txtTarget').val(),
                                    $('#trItemSpecPMContaminant_txtMin').val(),
                                    $('#trItemSpecPMContaminant_txtMax').val(),
                                    $('#trItemSpecPMContaminant_txtResult').val(),
                                    $('#trItemSpecPMContaminant_txtStatus').val(),
                                    $('#trItemSpecPMContaminant_txtDetail').val(),
                                    $('#trItemSpecPMContaminant_bitNotAnalyzed').prop('checked') ? true : false
                                ]).draw(false);
                            } else {
                               

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
                                    jsonData[i].trItemSpecPMContaminant_txtTrItemSpecPMContaminantID,
                                    jsonData[i].trItemSpecPMContaminant_intLineID,
                                    jsonData[i].trItemSpecPMContaminant_intTestID,
                                    jsonData[i].trItemSpecPMContaminant_txtTestCode,
                                    jsonData[i].trItemSpecPMContaminant_txtTestClass,
                                    jsonData[i].trItemSpecPMContaminant_txtTestUnit,
                                    jsonData[i].trItemSpecPMContaminant_txtTestMethodCode,
                                    jsonData[i].trItemSpecPMContaminant_txtTestType,
                                    jsonData[i].trItemSpecPMContaminant_txtTarget,
                                    jsonData[i].trItemSpecPMContaminant_txtMin,
                                    jsonData[i].trItemSpecPMContaminant_txtMax,
                                    jsonData[i].trItemSpecPMContaminant_txtResult,
                                    jsonData[i].trItemSpecPMContaminant_txtStatus,
                                    jsonData[i].trItemSpecPMContaminant_txtDetail,
                                    //    jsonData[i].trItemSpecPMContaminant_bitNotAnalyzed
                                    (jsonData[i].trItemSpecPMContaminant_bitNotAnalyzed === true || jsonData[i].trItemSpecPMContaminant_bitNotAnalyzed === "true")
                                ]).draw(false);
                            }
                        }
                        p_UItrItemSpecPMContaminantToData();
                        $('#modalContaminant').modal('hide');
                        //    $.UnblockUI();
                    }
                };
            } else {
                if ($('#trItemSpecPMContaminant_txtTestCode').val() == "") {
                    //$('#modalContaminant').modal('hide');
                    clsGlobal.getAlert("Pastikan bahwa semua kolom sudah Anda isi!!!!!!");
                }
                else {
                   
                    var b = $('#SaveEditDetailContaminant').val();
                    if ($('#SaveEditDetailContaminant').val() == "SUBMIT") {
                        var txtTrItemSpecPMContaminantID = generateUUID();
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
                            txtTrItemSpecPMContaminantID,
                            ContaminantLineCounter++,
                            $('#trItemSpecPMContaminant_intTestID').val(),
                            $('#trItemSpecPMContaminant_txtTestCode').val(),
                            $('#trItemSpecPMContaminant_txtTestClass').val(),
                            $('#trItemSpecPMContaminant_txtTestUnit').val(),
                            $('#trItemSpecPMContaminant_txtTestMethodCode').val(),
                            $('#trItemSpecPMContaminant_txtTestType').val(),
                            $('#trItemSpecPMContaminant_txtTarget').val(),
                            $('#trItemSpecPMContaminant_txtMin').val(),
                            $('#trItemSpecPMContaminant_txtMax').val(),
                            $('#trItemSpecPMContaminant_txtResult').val(),
                            $('#trItemSpecPMContaminant_txtStatus').val(),
                            $('#trItemSpecPMContaminant_txtDetail').val(),
                            $('#trItemSpecPMContaminant_bitNotAnalyzed').prop('checked') ? true : false
                        ]).draw(false);
                        p_UItrItemSpecPMContaminantToData();
                        $('#modalContaminant').modal('hide');
                    } else {
                        //$.blockUI();
                       
                        tableContaminant.clear().draw(false);

                        var jsonData = JSON.parse($("#txtHiddenDetailContaminantObject").val());
                        for (var i = 0; i < jsonData.length; i++) {
                            if ((jsonData[i].trItemSpecPMContaminant_txtTrItemSpecPMContaminantID == $('#trItemSpecPMContaminant_txtTrItemSpecPMContaminantID').val())) {

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
                                    $('#trItemSpecPMContaminant_txtTrItemSpecPMContaminantID').val(),
                                    $('#trItemSpecPMContaminant_intLineID').val(),
                                    $('#trItemSpecPMContaminant_intTestID').val(),
                                    $('#trItemSpecPMContaminant_txtTestCode').val(),
                                    $('#trItemSpecPMContaminant_txtTestClass').val(),
                                    $('#trItemSpecPMContaminant_txtTestUnit').val(),
                                    $('#trItemSpecPMContaminant_txtTestMethodCode').val(),
                                    $('#trItemSpecPMContaminant_txtTestType').val(),
                                    $('#trItemSpecPMContaminant_txtTarget').val(),
                                    $('#trItemSpecPMContaminant_txtMin').val(),
                                    $('#trItemSpecPMContaminant_txtMax').val(),
                                    $('#trItemSpecPMContaminant_txtResult').val(),
                                    $('#trItemSpecPMContaminant_txtStatus').val(),
                                    $('#trItemSpecPMContaminant_txtDetail').val(),
                                    $('#trItemSpecPMContaminant_bitNotAnalyzed').prop('checked') ? true : false
                                ]).draw(false);
                            } else {
                               

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
                                    jsonData[i].trItemSpecPMContaminant_txtTrItemSpecPMContaminantID,
                                    jsonData[i].trItemSpecPMContaminant_intLineID,
                                    jsonData[i].trItemSpecPMContaminant_intTestID,
                                    jsonData[i].trItemSpecPMContaminant_txtTestCode,
                                    jsonData[i].trItemSpecPMContaminant_txtTestClass,
                                    jsonData[i].trItemSpecPMContaminant_txtTestUnit,
                                    jsonData[i].trItemSpecPMContaminant_txtTestMethodCode,
                                    jsonData[i].trItemSpecPMContaminant_txtTestType,
                                    jsonData[i].trItemSpecPMContaminant_txtTarget,
                                    jsonData[i].trItemSpecPMContaminant_txtMin,
                                    jsonData[i].trItemSpecPMContaminant_txtMax,
                                    jsonData[i].trItemSpecPMContaminant_txtResult,
                                    jsonData[i].trItemSpecPMContaminant_txtStatus,
                                    jsonData[i].trItemSpecPMContaminant_txtDetail,
                                    (jsonData[i].trItemSpecPMContaminant_bitNotAnalyzed === true || jsonData[i].trItemSpecPMContaminant_bitNotAnalyzed === "true")
                                ]).draw(false);
                            }
                        }
                        p_UItrItemSpecPMContaminantToData();
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
        rowData[3] = visualLineCounter++; // index ke-3 sesuai posisi trItemSpecPMVisual_intLineID
        this.data(rowData);
    });
    tableVisual.draw(false);
}

function refreshDimensionLineIDs() {
    DimensionLineCounter = 1;
    tableDimension.rows().every(function (rowIdx, tableLoop, rowLoop) {
        let rowData = this.data();
        rowData[3] = DimensionLineCounter++; // index ke-3 sesuai posisi trItemSpecPMDimension_intLineID
        this.data(rowData);
    });
    tableDimension.draw(false);
}

function refreshMaterialLineIDs() {
    MaterialLineCounter = 1;
    tableMaterial.rows().every(function (rowIdx, tableLoop, rowLoop) {
        let rowData = this.data();
        rowData[3] = MaterialLineCounter++; // index ke-3 sesuai posisi trItemSpecPMMaterial_intLineID
        this.data(rowData);
    });
    tableMaterial.draw(false);
}

function refreshPackagingLineIDs() {
    PackagingLineCounter = 1;
    tablePackaging.rows().every(function (rowIdx, tableLoop, rowLoop) {
        let rowData = this.data();
        rowData[3] = PackagingLineCounter++; // index ke-3 sesuai posisi trItemSpecPMPackaging_intLineID
        this.data(rowData);
    });
    tablePackaging.draw(false);
}

function refreshContaminantLineIDs() {
    ContaminantLineCounter = 1;
    tableContaminant.rows().every(function (rowIdx, tableLoop, rowLoop) {
        let rowData = this.data();
        rowData[3] = ContaminantLineCounter++; // index ke-3 sesuai posisi trItemSpecPMContaminant_intLineID
        this.data(rowData);
    });
    tableContaminant.draw(false);
}

function p_btnLOVTestCodeClick() {
    try {
        LOV = clsGlobal.generateLOV("TEST_CODE_VISUAL", "trItemSpecPMVisual_txtTestCode");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVTestCodeDimensionClick() {
    try {
        LOV = clsGlobal.generateLOV("TEST_CODE_DIMENSION", "trItemSpecPMDimension_txtTestCode");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVTestCodeMaterialClick() {
    try {
        LOV = clsGlobal.generateLOV("TEST_CODE_MATERIAL", "trItemSpecPMMaterial_txtTestCode");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVTestCodePackagingClick() {
    try {
        LOV = clsGlobal.generateLOV("TEST_CODE_PACKAGING", "trItemSpecPMPackaging_txtTestCode");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVTestCodeContaminantClick() {
    try {
        LOV = clsGlobal.generateLOV("TEST_CODE_CONTAMINANT", "trItemSpecPMContaminant_txtTestCode");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVtxtTargetClick() {
    try {
        LOV = clsGlobal.generateLOV("PME_TARGET", "trItemSpecPMVisual_txtTarget", $("#trItemSpecPMVisual_intTestID").val());
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVtxtTargetDimensionClick() {
    try {
        LOV = clsGlobal.generateLOV("PME_TARGET", "trItemSpecPMDimension_txtTarget", $("#trItemSpecPMDimension_intTestID").val());
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVtxtTargetMaterialClick() {
    try {
        LOV = clsGlobal.generateLOV("PME_TARGET", "trItemSpecPMMaterial_txtTarget", $("#trItemSpecPMMaterial_intTestID").val());
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVtxtTargetPackagingClick() {
    try {
        LOV = clsGlobal.generateLOV("PME_TARGET", "trItemSpecPMPackaging_txtTarget", $("#trItemSpecPMPackaging_intTestID").val());
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVtxtTargetContaminantClick() {
    try {
        LOV = clsGlobal.generateLOV("PME_TARGET", "trItemSpecPMContaminant_txtTarget", $("#trItemSpecPMContaminant_intTestID").val());
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
        LOV = clsGlobal.generateLOV("ISP_STORAGE", "trItemSpecPMMaterialInformation_txtStorageCondition");
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
        $('#trItemSpecPMMaterialInformation_intFinalArtworkID').val('');
    } else if (inputId === "TxtPackingStyle") {
        $('#packingStyleDownload').hide();
        $('#trItemSpecPMMaterialInformation_intPackingStyleID').val('');
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
   
    //$('input, select, textarea').not('#btnBack, input[type=hidden], .dataTables_filter input').prop('disabled', true);
    // SESUDAH
    $('input, select, textarea').not('#btnBack, input[type=hidden], .dataTables_filter input').prop('disabled', true);
    $('#btnSubmit').addClass('d-none');
    $('#btnSave').addClass('d-none');
    $('#btnParentSpecificationCode').prop('disabled', true);  // disable
    $('#btnTxtItemCode').prop('disabled', true);
    $('#btnTxtNameOfPOTS').prop('disabled', true);
    $('#btnTxtNameOfPOTS').prop('disabled', true);
    $('#btnTxtStorageCondition').prop('disabled', true);
    $('#btnTxtStorageCondition').prop('disabled', true);
    //$('button').not('#btnBack').prop('disabled', true);
    //$('.select2').select2({ disabled: true });
    //$('.tab-pane').addClass('form-disabled');
   
//    disableTableOperations();
}

function disableHeader() {
    $('#btnParentSpecificationCode').prop('disabled', true);
    $('#btnTxtItemCode').prop('disabled', true);
    $('#btnTxtNameOfPOTS').prop('disabled', true);
    $('#bitAssignToPOTS').attr('disabled', 'disabled');
    $('#TxtSpecPMDesc').attr('disabled', true);
    $('#TxtRemark').attr('disabled', true);
}

//function disableTableOperations() {
//    const tables = Object.keys(config.tabs).map(key => `#${config.tabs[key].tableId}`);
//   
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

/*HANDLER ATTACHMENT*/

$('#saveAttach').click(function () {
   
    var documentType = $('#documentTypeAttachModal').val();
    var remarks = $('#remarksAttachModal').val();

    const filedata = $('#fileAttachModal')
    const fileInput = $('#fileAttachModal')[0];
    const attachment = fileInput.files[0];

    $('.text-danger-validation').hide();

    let isValid = true;

    if (!documentType) {
        $('#documentTypeAttachModalError').show();
        isValid = false;
    }

    if (!remarks) {
        $('#remarksAttachModalError').show();
        isValid = false;
    }

    if (modalStateAttach === "add") {
        if (!attachment) {
            $('#fileAttachModalError').show();
            isValid = false;
        }
    }

    if (isValid) {
        if (modalStateAttach === "add") {
            attachmentList.push({
                attachmentGuid: "",
                documentType: documentType,
                remarks: remarks,
                fileName: !attachment ? attachmentList[indexModal].fileName : attachment.name,
                file: !attachment ? attachmentList[indexModal].file : attachment.name,
                attachment: attachment,
                isUploadFile: true,
            });
        } else {
            attachmentList[indexModal] = {
                attachmentGuid: attachmentList[indexModal].attachmentGuid,
                documentType: documentType,
                remarks: remarks,
                fileName: !attachment ? attachmentList[indexModal].fileName : attachment.name,
                file: !attachment ? attachmentList[indexModal].file : attachment.name,
                attachment: attachment,
                isUploadFile: !attachment ? false : true,
            }
        }

        UpdateTableAttach();
        $('#addAttachmentModal').modal('hide');

        ClearAttach();
    }
})

function UpdateTableAttach() {
   
    var dataTable = $('#dataTableAttachment').DataTable();
    dataTable.clear();

    const dataRows = attachmentList
        .filter(item => item.isDeleted !== true)
        .map((item, displayIndex) => {
            const actualIndex = attachmentList.indexOf(item); // ambil index asli dari attachmentList
            return [
                displayIndex + 1, // NO berurutan dari 1
                item.documentType ?? '',
                item.remarks ?? '',
                item.fileName ?? '',
                `<button id="editBtn" class="btn btn-sm btn-primary edit-btn-attach" type="button" data-bs-toggle="modal" data-bs-target="#addAttachmentModal" data-index="${actualIndex}">
                    <i class="fas fa-edit"></i>
                 </button>
                 <button id="btnDownloadAttachment" class="btn btn-sm btn-warning download-btn-attach" type="button" data-index="${actualIndex}">
                    <i class="fas fa-download"></i>
                 </button>
                 <button id="btnDeleteFlowProcess" class="btn btn-sm btn-danger delete-btn-attach" type="button" data-bs-toggle="modal" data-bs-target="#deleteSubmitRequestTrial" data-index="${actualIndex}">
                    <i class="fas fa-trash"></i>
                 </button>`
            ];
        });

    dataTable.rows.add(dataRows);
    dataTable.draw();

    let jsonString = JSON.stringify(attachmentList);
    $('#Attachments').val(jsonString);

    // Optional fix: handle pagination if row deleted on last page
    let pageInfo = dataTable.page.info();
    if (pageInfo.page > 0 && pageInfo.end === 0) {
        dataTable.page(pageInfo.page - 1).draw('page');
    }
}


function ClearAttach() {
    //$('#documentTypeAttachModal').val('').trigger('change');
    $('#remarksAttachModal').val('');
    $('#fileAttachModal').val('');

    modalStateAttach = "add";
    indexModal = 99;
}

$(document).on('click', '.edit-btn-attach', function () {
   
    $('#oldFileAttachModal').show();
    modalStateAttach = "edit";
    indexModal = $(this).data('index');

    const data = attachmentList[indexModal];

    //$('#documentTypeAttachModal').val(data.documentType).trigger('change');
    //$('#remarksAttachModal').val(data.remarks);

    //$('#fileNameAttachModal').val(data.fileName);

    // Reset modal field
    $('#documentTypeAttachModal').val(data.documentType).trigger('change');
    $('#remarksAttachModal').val(data.remarks);
    $('#fileAttachModal').val(''); // clear input file baru

    // Update file lama
    if (data.fileName) {
        $('#oldFileAttachModal').show();
        $('#fileNameAttachModal').val(data.fileName); // isi sesuai index yg dipilih
    } else {
        $('#oldFileAttachModal').hide();
        $('#fileNameAttachModal').val('');
    }
})

function showMessageError(msgError) {
    clsGlobal.swalError(msgError);
}

$(document).on('click', '#btnDownloadAttachment', function () {
   
    const index = $(this).data('index');
    const fileData = attachmentList[index]?.file;
    const fileName = attachmentList[index]?.fileName;

    const sanitizedFileData = fileData.startsWith("/") ? fileData.substring(1) : fileData;

    if (fileData) {
        $.ajax({
            //url: `/PMEvaluation/DownloadFile?fileName=${encodeURIComponent(fileData)}`,
            url: `/PMEvaluation/DownloadFile?fileName=${sanitizedFileData}`,
            type: 'GET',
            xhrFields: {
                responseType: 'blob'
            },
            success: function (blob) {
               
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            },
            error: function () {
                showMessageError('Download is failed');
            }
        });
    } else {
        showMessageError('File is not found');
    }
});

$('#confirmRequestTrialDelete').click(function () {
   

    if (deleteState === "Attachment") {
        attachmentList[indexDelete].isDeleted = true;

        UpdateTableAttach();
    }

    indexDelete = 99;
    $('#deleteSubmitRequestTrial').modal('hide');
})

$(document).on('click', '.delete-btn-attach', function () {
    deleteState = "Attachment";
    indexDelete = $(this).data('index');
})

$('#btnAddDocument').on('click', function () {
   
    modalStateAttach = "add";
    ClearAttach();
    $('#oldFileAttachModal').hide();
});

$('#addAttachmentModal').on('hidden.bs.modal', function () {
   
    modalStateAttach = "add";
    ClearAttach();
    $('#oldFileAttachModal').hide();
})

    

// Fungsi untuk mengisi tabel di modal print dengan data terbaru
function populatePrintModal(data) {
    // DEBUGGING: Cek apakah data ada dan berisi data
    console.log('Data passed to populatePrintModal:', data);
    if (!data) {
        console.error('Data is undefined or null.');
        return;
    }

    // Kosongkan semua tabel sebelum mengisi yang baru
    $('#visualPrintTableBody').empty();
    $('#dimensionPrintTableBody').empty();
    $('#materialPrintTableBody').empty();
    $('#packagingPrintTableBody').empty();
    $('#contaminantPrintTableBody').empty();

    // Fungsi helper untuk membuat baris tabel
    function createTableRow(tabName, testCode, isChecked = true) {
        const checkboxValue = `${tabName}_${testCode}`;
        const checkedAttribute = isChecked ? 'checked' : '';
        return `
            <tr>
                <td>${testCode}</td>
                <td>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="${checkboxValue}" ${checkedAttribute}>
                    </div>
                </td>
            </tr>
        `;
    }

    // Isi tabel Visual and Appearance
    if (data && data.listVmTrItemSpecPMVisual) {
        data.listVmTrItemSpecPMVisual.forEach(item => {
            if (item.txtTestCode) {
                $('#visualPrintTableBody').append(createTableRow('Visual', item.txtTestCode));
            }
        });
    }

    // Isi tabel Dimension
    if (data && data.listVmTrItemSpecPMDimension) {
        data.listVmTrItemSpecPMDimension.forEach(item => {
            if (item.txtTestCode) {
                $('#dimensionPrintTableBody').append(createTableRow('Dimension', item.txtTestCode));
            }
        });
    }

    // Isi tabel Material
    if (data && data.listVmTrItemSpecPMMaterial) {
        data.listVmTrItemSpecPMMaterial.forEach(item => {
            if (item.txtTestCode) {
                $('#materialPrintTableBody').append(createTableRow('Material', item.txtTestCode));
            }
        });
    }

    // Isi tabel Packaging Integrity
    if (data && data.listVmTrItemSpecPMPackagingIntegrity) {
        data.listVmTrItemSpecPMPackagingIntegrity.forEach(item => {
            if (item.txtTestCode) {
                $('#packagingPrintTableBody').append(createTableRow('Packaging', item.txtTestCode));
            }
        });
    }

    // Isi tabel Contaminant
    if (data && data.listVmTrItemSpecPMContaminant) {
        data.listVmTrItemSpecPMContaminant.forEach(item => {
            if (item.txtTestCode) {
                $('#contaminantPrintTableBody').append(createTableRow('Contaminant', item.txtTestCode));
            }
        });
    }
}

// --- HANDLER YANG DIUBAH: Langsung menggunakan modelData ---
$('#btnPrint').click(function () {
    // Pastikan modelData sudah tersedia. Jika belum, tampilkan pesan error.
    if (modelData) {
        populatePrintModal(modelData);
        $('#columnSelectionModal').modal('show');
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Data dokumen belum dimuat. Silakan muat ulang halaman.'
        });
    }
});
function callPrintPDF() {
    // 1. Kumpulkan nilai dari checkbox yang tercentang.
    //    Outputnya: ["Visual_TxtTestCode", "Dimension_TxtTestCode", ...]
    const selectedColumns = $('#columnSelectionModal input[type="checkbox"]:checked').map(function () {
        return this.value;
    }).get();

    // 2. Buat objek baru untuk menampung data yang sudah terstruktur
    const selectedData = {};
    selectedColumns.forEach(item => {
        // Pecah string "Visual_TxtTestCode" menjadi ["Visual", "TxtTestCode"]
        const parts = item.split('_');
        if (parts.length === 2) {
            const tabName = parts[0];
            const testCode = parts[1];

            // Jika tabName belum ada di objek, inisialisasi sebagai array kosong
            if (!selectedData[tabName]) {
                selectedData[tabName] = [];
            }
            // Tambahkan testCode ke dalam array yang sesuai
            selectedData[tabName].push(testCode);
        }
    });

    const documentId = $('#id').val();

    if (!documentId) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'ID dokumen tidak ditemukan. Silakan muat ulang halaman.'
        });
        return;
    }

    // 3. Serialisasi objek ke string JSON untuk dikirim
    const jsonData = JSON.stringify(selectedData);

    // 4. Buat form POST untuk mengirim data ke backend
    //    Nama parameter di sini harus sesuai dengan yang ada di controller C#
    const form = $('<form>', {
        method: 'post',
        action: window.printPdfUrl,
        target: '_blank',
        style: 'display:none;'
    }).appendTo('body');

    $('<input>', {
        type: 'hidden',
        name: 'id',
        value: documentId
    }).appendTo(form);

    // Kirim objek JSON sebagai string
    $('<input>', {
        type: 'hidden',
        name: 'selectedDataJson', // Nama parameter di C#
        value: jsonData
    }).appendTo(form);

    // 5. Kirim form dan bersihkan
    form.submit();
    form.remove();

    // 6. Tutup modal
    $('#columnSelectionModal').modal('hide');
    clsGlobal.hideLoading();
}



$('#confirmPrintColumns').off('click').on('click', function () {
    // 1. Kumpulkan nilai dari checkbox yang tercentang.
    //    Nilai ini masih dalam format "NamaTab_NamaKolom", contoh: ["Visual_TxtTestCode", "Dimension_TxtTestCode"]
    const selectedColumns = $('#columnSelectionModal input[type="checkbox"]:checked').map(function () {
        return this.value;
    }).get();

    // 2. Buat objek terstruktur dari data yang dikumpulkan.
    const selectedData = selectedColumns.reduce((acc, item) => {
        const parts = item.split('_');
        if (parts.length === 2) {
            const tabName = parts[0];
            const testCode = parts[1];

            // Jika tab belum ada di objek, inisialisasi sebagai array kosong
            if (!acc[tabName]) {
                acc[tabName] = [];
            }
            // Masukkan test code ke dalam array tab yang sesuai
            acc[tabName].push(testCode);
        }
        return acc;
    }, {});

    const documentId = $('#id').val();

    if (!documentId) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'ID dokumen tidak ditemukan. Silakan muat ulang halaman.'
        });
        return;
    }

    // 3. Serialisasi objek ke string JSON untuk dikirim melalui form
    const jsonData = JSON.stringify(selectedData);

    // 4. Buat form POST untuk mengirim data ke backend
    const form = $('<form>', {
        method: 'post',
        action: window.printPdfUrl,
        target: '_blank', // Membuka di tab baru
        style: 'display:none;'
    }).appendTo('body');

    // Tambahkan input tersembunyi untuk ID dokumen
    $('<input>', {
        type: 'hidden',
        name: 'id',
        value: documentId
    }).appendTo(form);

    // Tambahkan input tersembunyi untuk data JSON
    $('<input>', {
        type: 'hidden',
        name: 'selectedDataJson', // Nama parameter di C# controller
        value: jsonData
    }).appendTo(form);

    // 5. Kirim form dan bersihkan
    form.submit();
    form.remove();

    // 6. Tutup modal
    $('#columnSelectionModal').modal('hide');
});
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false;
let modalStateAttach = "add";
let attachmentList = [];
let deleteState = "";
let indexDelete = 99;
//var isEvaluationInitialized = false;


//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    //clsGlobal.showLoading();

    p_InitForm();
    //p_validatePage();

});

function p_InitForm() {
    $(".select2").select2();

    $('#oldFileAttachModal').hide();

    $('#addAttachmentModal').on('shown.bs.modal', function () {

        $(this).find('select.select2').each(function () {
            $(this).select2({
                dropdownParent: $('#addAttachmentModal')
            });
        });
    });
    $('#dataTableAttachment').DataTable({
        columnDefs: [
            {
                targets: 0,
                orderable: false,
            }
        ]
    });


    p_initiateData();
    //if (!isEvaluationInitialized) {
    //    p_initiateData();
    //}
}

const isEdit = document.getElementById("hdnIsEdit").value === "true";
document.getElementById("btnSaveText").textContent = isEdit ? "Update" : "Save";

function inisiasiEvaluation() {
    // Set tab header
    document.getElementById('Document').classList.remove('active-tab');
    document.getElementById('Evaluation').classList.add('active-tab');

    // Hide other tab content
    const docTab = document.getElementById('form-tabs-Document');
    docTab.classList.remove('show', 'active');

    // Show Evaluation tab content
    const evalTab = document.getElementById('form-tabs-Evaluation');
    evalTab.classList.add('show', 'active');
}

function inisiasiDocument() {
    // Set tab header
    document.getElementById('Evaluation').classList.remove('active-tab');
    document.getElementById('Document').classList.add('active-tab');

    // Hide other tab content
    const evalTab = document.getElementById('form-tabs-Evaluation');
    evalTab.classList.remove('show', 'active');

    // Show Document tab content
    const docTab = document.getElementById('form-tabs-Document');
    docTab.classList.add('show', 'active');
}

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
    }, 200);
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

    setTimeout(() => {
        tableDimension.columns.adjust().draw();
    }, 200);
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
    }, 200);
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
    }, 200);
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
    }, 200);
}

//=======================
// FUNCTION
//=======================

function setChooseLOV(txtValue) {
    var arr = txtValue.split('|');



    switch (arr[0]) {
        case "txtSampleNumber":
            $("#txtSampleNumber").val(arr[1]);
            $("#txtItemSampleCode").val(arr[2]);
            $("#txtSampleDesc").val(arr[3]);
            break;
        case "trPMEvaluationVisual_txtTestCode":
            //p_ItemValidation(arr[1]);
            p_txtTestCode_TextChanged(arr);
            break;
        case "trPMEvaluationDimension_txtTestCode":
            //p_ItemValidation(arr[1]);
            p_txtTestCodeDimension_TextChanged(arr);
            break;
        case "trPMEvaluationMaterial_txtTestCode":
            //p_ItemValidation(arr[1]);
            p_txtTestCodeMaterial_TextChanged(arr);
            break;
        case "trPMEvaluationPackaging_txtTestCode":
            //p_ItemValidation(arr[1]);
            p_txtTestCodePackaging_TextChanged(arr);
            break;
        case "trPMEvaluationContaminant_txtTestCode":
            //p_ItemValidation(arr[1]);
            p_txtTestCodeContaminant_TextChanged(arr);
            break;
        case "trPMEvaluationVisual_txtTarget":
            $("#trPMEvaluationVisual_txtTarget").val(arr[1]);
            $("#trPMEvaluationVisual_decTarget").val(arr[2]);

            evaluateStatus(arr[1], arr[2]);

            break;
        case "trPMEvaluationDimension_txtTarget":
            $("#trPMEvaluationDimension_txtTarget").val(arr[1]);
            $("#trPMEvaluationDimension_decTarget").val(arr[2]);
            evaluateStatusDimension(arr[1], arr[2]);
            break;
        case "trPMEvaluationMaterial_txtTarget":
            $("#trPMEvaluationMaterial_txtTarget").val(arr[1]);
            $("#trPMEvaluationMaterial_decTarget").val(arr[2]);
            evaluateStatusMaterial(arr[1], arr[2]);
            break;
        case "trPMEvaluationPackaging_txtTarget":
            $("#trPMEvaluationPackaging_txtTarget").val(arr[1]);
            $("#trPMEvaluationPackaging_decTarget").val(arr[2]);
            evaluateStatusPackaging(arr[1], arr[2]);
            break;
        case "trPMEvaluationContaminant_txtTarget":
            $("#trPMEvaluationContaminant_txtTarget").val(arr[1]);
            $("#trPMEvaluationContaminant_decTarget").val(arr[1]);
            evaluateStatusContaminant(arr[1], arr[2]);
            break;
        case "trPMEvaluationVisual_txtResult":
            $("#trPMEvaluationVisual_txtResult").val(arr[1]);
            $("#trPMEvaluationVisual_decResult").val(arr[2]);

            evaluateStatus(arr[1], arr[2]);

            break;
        case "trPMEvaluationDimension_txtResult":
            $("#trPMEvaluationDimension_txtResult").val(arr[1]);
            $("#trPMEvaluationDimension_decResult").val(arr[2]);
            evaluateStatusDimension(arr[1], arr[2]);
            break;
        case "trPMEvaluationMaterial_txtResult":
            $("#trPMEvaluationMaterial_txtResult").val(arr[1]);
            $("#trPMEvaluationMaterial_decResult").val(arr[2]);
            evaluateStatusMaterial(arr[1], arr[2]);
            break;
        case "trPMEvaluationPackaging_txtResult":
            $("#trPMEvaluationPackaging_txtResult").val(arr[1]);
            $("#trPMEvaluationPackaging_decResult").val(arr[2]);
            evaluateStatusPackaging(arr[1], arr[2]);
            break;
        case "trPMEvaluationContaminant_txtResult":
            $("#trPMEvaluationContaminant_txtResult").val(arr[1]);
            $("#trPMEvaluationContaminant_decResult").val(arr[1]);
            evaluateStatusContaminant(arr[1], arr[2]);
            break;

        case "trPMEvaluationVisual_txtMin":
            $("#trPMEvaluationVisual_txtMin").val(arr[1]);
            $("#trPMEvaluationVisual_decMin").val(arr[2]);

            evaluateStatus(arr[1], arr[2]);

            break;
        case "trPMEvaluationDimension_txtMin":
            $("#trPMEvaluationDimension_txtMin").val(arr[1]);
            $("#trPMEvaluationDimension_decMin").val(arr[2]);
            evaluateStatusDimension(arr[1], arr[2]);
            break;
        case "trPMEvaluationMaterial_txtMin":
            $("#trPMEvaluationMaterial_txtMin").val(arr[1]);
            $("#trPMEvaluationMaterial_decMin").val(arr[2]);
            evaluateStatusMaterial(arr[1], arr[2]);
            break;
        case "trPMEvaluationPackaging_txtMin":
            $("#trPMEvaluationPackaging_txtMin").val(arr[1]);
            $("#trPMEvaluationPackaging_decMin").val(arr[2]);
            evaluateStatusPackaging(arr[1], arr[2]);
            break;
        case "trPMEvaluationContaminant_txtMin":
            $("#trPMEvaluationContaminant_txtMin").val(arr[1]);
            $("#trPMEvaluationContaminant_decMin").val(arr[2]);
            evaluateStatusContaminant(arr[1], arr[2]);
            break;

        case "trPMEvaluationVisual_txtMax":
            $("#trPMEvaluationVisual_txtMax").val(arr[1]);
            $("#trPMEvaluationVisual_decMax").val(arr[2]);

            evaluateStatus(arr[1], arr[2]);

            break;
        case "trPMEvaluationDimension_txtMax":
            $("#trPMEvaluationDimension_txtMax").val(arr[1]);
            $("#trPMEvaluationDimension_decMax").val(arr[2]);
            evaluateStatusDimension(arr[1], arr[2]);
            break;
        case "trPMEvaluationMaterial_txtMax":
            $("#trPMEvaluationMaterial_txtMax").val(arr[1]);
            $("#trPMEvaluationMaterial_decMax").val(arr[2]);
            evaluateStatusMaterial(arr[1], arr[2]);
            break;
        case "trPMEvaluationPackaging_txtMax":
            $("#trPMEvaluationPackaging_txtMax").val(arr[1]);
            $("#trPMEvaluationPackaging_decMax").val(arr[2]);
            evaluateStatusPackaging(arr[1], arr[2]);
            break;
        case "trPMEvaluationContaminant_txtMax":
            $("#trPMEvaluationContaminant_txtMax").val(arr[1]);
            $("#trPMEvaluationContaminant_decMax").val(arr[2]);
            evaluateStatusContaminant(arr[1], arr[2]);
            break;
        case "COPYFROM_PME":
            p_COPYFROMPME_TextChanged(arr[2]);
            $("#intPMEvaluationReferenceID").val(arr[1]);
            $("#txtPMEvaluationReference").val(arr[2]);
            break;
        case "COPYFROM_TEMPLATESPEC":
            p_COPYFROMTEMPLATESPEC_TextChanged(arr[1]);
            $("#intPMEvaluationReferenceID").val(arr[1]);
            $("#txtPMEvaluationReference").val(arr[2]);
            break;
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
    "fixedColumns": { "left": [4] },
    "columnDefs": [
        //{ className: "text-center", "targets": [2] },
        { "visible": false, "targets": [1, 3] },
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
    "fixedColumns": { "left": [4] },
    "columnDefs": [
        //{ className: "text-center", "targets": [2] },
        //    { className: "hidden", "targets": [0, 3, 7, 12] },
        { "visible": false, "targets": [1, 3] },
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
    "fixedColumns": { "left": [4] },
    "columnDefs": [
        //{ className: "text-center", "targets": [2] },
        //    { className: "hidden", "targets": [0, 3, 7, 12] },
        { "visible": false, "targets": [1, 3] },
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
    "fixedColumns": { "left": [4] },
    "columnDefs": [
        //{ className: "text-center", "targets": [2] },
        //    { className: "hidden", "targets": [0, 3, 7, 12] },
        { "visible": false, "targets": [1, 3] },
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
    "fixedColumns": { "left": [4] },
    "columnDefs": [
        //{ className: "text-center", "targets": [2] },
        //    { className: "hidden", "targets": [0, 3, 7, 12] },
        { "visible": false, "targets": [1, 3] },
    ]
})

function p_initiateData() {

    clsGlobal.showLoading();
    //$.blockUI();
    //$('#btnAddItem').hide();
    $.ajax({
        type: "POST",
        url: "/PMEvaluation/InitiateData",
        data: { id: $('#txtPMEvaluationId').val(), __RequestVerificationToken: $('#frmPMEvaluationDetail input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            //isEvaluationInitialized = true;
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {

                    $("#txtHiddenObject").val(JSON.stringify(retDat.objData));
                    debugger;
                    p_DataToUI(retDat.objData);
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

                    for (var i = 0; i < retDat.objData.listVmTrPMEvaluationVisual.length; i++) {

                        tableVisual.row.add([
                            '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowVisual(this)" class="btn btn-primary btn-sm me-1 btnEditVisual" title="Edit">' +
                            '<i class="ti ti-pencil"></i>' +
                            '</button>' +
                            '<button type="button" onclick="deleteRowVisualdata(this)" class="btn btn-danger btn-sm btnDeleteVisual" title="Delete">' +
                            '<i class="ti ti-trash"></i>' +
                            '</button>' +
                            '</div>',
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtPmevaluationVisualId,
                            retDat.objData.listVmTrPMEvaluationVisual[i].intLineNo,
                            retDat.objData.listVmTrPMEvaluationVisual[i].intTestId,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtTestCode,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtTestClass,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtTestUnit,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtTestMethodCode,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtTestType,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtTarget,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtMin,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtMax,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtResult,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtStatus,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtDetail,
                            //    jsonData[i].trPMEvaluationVisual_bitNotAnalyzed
                            /*jsonData[i].trPMEvaluationVisual_bitNotAnalyzed === true ? true : false*/
                            (retDat.objData.listVmTrPMEvaluationVisual[i].bitNotAnalyzed === true || retDat.objData.listVmTrPMEvaluationVisual[i].bitNotAnalyzed === "true")
                        ]).draw(false);
                    }

                    tableDimension.clear().draw(false);

                    for (var i = 0; i < retDat.objData.listVmTrPMEvaluationDimension.length; i++) {

                        tableDimension.row.add([
                            '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowDimension(this)" class="btn btn-primary btn-sm me-1 btnEditDimension" title="Edit">' +
                            '<i class="ti ti-pencil"></i>' +
                            '</button>' +
                            '<button type="button" onclick="deleteRowDimensiondata(this)" class="btn btn-danger btn-sm btnDeleteDimension" title="Delete">' +
                            '<i class="ti ti-trash"></i>' +
                            '</button>' +
                            '</div>',
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtPmevaluationDimensionId,
                            retDat.objData.listVmTrPMEvaluationDimension[i].intLineNo,
                            retDat.objData.listVmTrPMEvaluationDimension[i].intTestId,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtTestCode,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtTestClass,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtTestUnit,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtTestMethodCode,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtTestType,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtTarget,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtMin,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtMax,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtResult,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtStatus,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtDetail,
                            //    jsonData[i].trPMEvaluationDimension_bitNotAnalyzed
                            /*jsonData[i].trPMEvaluationDimension_bitNotAnalyzed === true ? true : false*/
                            (retDat.objData.listVmTrPMEvaluationDimension[i].bitNotAnalyzed === true || retDat.objData.listVmTrPMEvaluationDimension[i].bitNotAnalyzed === "true")
                        ]).draw(false);
                    }

                    tableMaterial.clear().draw(false);

                    for (var i = 0; i < retDat.objData.listVmTrPMEvaluationMaterial.length; i++) {

                        tableMaterial.row.add([
                            '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowMaterial(this)" class="btn btn-primary btn-sm me-1 btnEditMaterial" title="Edit">' +
                            '<i class="ti ti-pencil"></i>' +
                            '</button>' +
                            '<button type="button" onclick="deleteRowMaterialdata(this)" class="btn btn-danger btn-sm btnDeleteMaterial" title="Delete">' +
                            '<i class="ti ti-trash"></i>' +
                            '</button>' +
                            '</div>',
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtPmevaluationMaterialId,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].intLineNo,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].intTestId,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtTestCode,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtTestClass,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtTestUnit,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtTestMethodCode,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtTestType,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtTarget,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtMin,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtMax,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtResult,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtStatus,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtDetail,
                            //    jsonData[i].trPMEvaluationMaterial_bitNotAnalyzed
                            /*jsonData[i].trPMEvaluationMaterial_bitNotAnalyzed === true ? true : false*/
                            (retDat.objData.listVmTrPMEvaluationMaterial[i].bitNotAnalyzed === true || retDat.objData.listVmTrPMEvaluationMaterial[i].bitNotAnalyzed === "true")
                        ]).draw(false);
                    }

                    tablePackaging.clear().draw(false);

                    for (var i = 0; i < retDat.objData.listVmTrPMEvaluationPackagingIntegrity.length; i++) {

                        tablePackaging.row.add([
                            '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowPackaging(this)" class="btn btn-primary btn-sm me-1 btnEditPackaging" title="Edit">' +
                            '<i class="ti ti-pencil"></i>' +
                            '</button>' +
                            '<button type="button" onclick="deleteRowPackagingdata(this)" class="btn btn-danger btn-sm btnDeletePackaging" title="Delete">' +
                            '<i class="ti ti-trash"></i>' +
                            '</button>' +
                            '</div>',
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtPmevaluationPackagingIntegrityId,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].intLineNo,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].intTestId,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtTestCode,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtTestClass,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtTestUnit,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtTestMethodCode,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtTestType,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtTarget,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtMin,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtMax,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtResult,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtStatus,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtDetail,
                            //    jsonData[i].trPMEvaluationMaterial_bitNotAnalyzed
                            /*jsonData[i].trPMEvaluationMaterial_bitNotAnalyzed === true ? true : false*/
                            (retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].bitNotAnalyzed === true || retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].bitNotAnalyzed === "true")
                        ]).draw(false);
                    }
                    tableContaminant.clear().draw(false);

                    for (var i = 0; i < retDat.objData.listVmTrPMEvaluationContaminant.length; i++) {

                        tableContaminant.row.add([
                            '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowContaminant(this)" class="btn btn-primary btn-sm me-1 btnEditContaminant" title="Edit">' +
                            '<i class="ti ti-pencil"></i>' +
                            '</button>' +
                            '<button type="button" onclick="deleteRowContaminantdata(this)" class="btn btn-danger btn-sm btnDeleteContaminant" title="Delete">' +
                            '<i class="ti ti-trash"></i>' +
                            '</button>' +
                            '</div>',
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtPmevaluationContaminantId,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].intLineNo,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].intTestId,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtTestCode,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtTestClass,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtTestUnit,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtTestMethodCode,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtTestType,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtTarget,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtMin,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtMax,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtResult,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtStatus,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtDetail,
                            //    jsonData[i].trPMEvaluationContaminant_bitNotAnalyzed
                            /*jsonData[i].trPMEvaluationContaminant_bitNotAnalyzed === true ? true : false*/
                            (retDat.objData.listVmTrPMEvaluationContaminant[i].bitNotAnalyzed === true || retDat.objData.listVmTrPMEvaluationContaminant[i].bitNotAnalyzed === "true")
                        ]).draw(false);
                    }


                    if (retDat.objData.txtDocStatus == "WAITING FOR APPROVAL") {
                        disableAllForApproval();
                    }
                    //if (retDat.objData.txtPmevaluationId != "" && retDat.objData.txtPmevaluationId != null) {
                    //    disableHeader();
                    //}

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

    $("#id").val(clsGlobal.parseToInteger(objData.id));
    $("#txtPmevaluationId").val(clsGlobal.parseToString(objData.txtPmevaluationId));
    $("#txtPmevaluationNumber").val(clsGlobal.parseToString(objData.txtPmevaluationNumber));
    $("#txtDocStatus").val(clsGlobal.parseToString(objData.txtDocStatus));
    $("#txtSampleNumber").val(clsGlobal.parseToString(objData.txtSampleNumber));
    $("#txtItemSampleCode").val(clsGlobal.parseToString(objData.txtItemSampleCode));
    $("#txtSampleDesc").val(clsGlobal.parseToString(objData.txtSampleDesc));
    $("#txtRemark").val(clsGlobal.parseToString(objData.txtRemark));
    $("#txtDocStatus").val(clsGlobal.parseToString(objData.txtDocStatus));

    $("#intPMEvaluationReferenceID").val(clsGlobal.parseToInteger(objData.intPmevaluationReferenceId));
    $("#txtPMEvaluationReference").val(clsGlobal.parseToString(objData.txtPmevaluationReference));
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


    $("#txtHiddenObject").val(JSON.stringify(objData));


}

function p_UIToData() {


    var jsonObj = [];
    var htmlJSON = $("#txtHiddenObject").val();
    jsonData = JSON.parse(htmlJSON);
    //jsonData.intReport_HeaderID = clsGlobal.parseToInteger($("#txtReportID").val());
    jsonData.txtPmevaluationId = $("#txtPMEvaluationId").val();
    jsonData.txtPmevaluationNumber = $("#txtPmevaluationNumber").val();
    jsonData.txtSampleNumber = $("#txtSampleNumber").val();
    jsonData.txtItemSampleCode = $("#txtItemSampleCode").val();
    jsonData.txtSampleDesc = $("#txtSampleDesc").val();
    jsonData.txtRemark = $("#txtRemark").val();
    jsonData.txtDocStatus = $("#txtDocStatus").val();

    jsonData.intPmevaluationReferenceId = clsGlobal.parseToInteger($("#intPMEvaluationReferenceID").val());
    jsonData.txtPmevaluationReference = $("#txtPMEvaluationReference").val();

    jsonData.txtCreatedBy = $("#txtCreatedBy").val();
    jsonData.dtmCreatedDate = $("#dtmCreatedDate").val();
    jsonData.txtUpdatedBy = $("#txtUpdatedBy").val();
    jsonData.dtmUpdatedDate = $("#dtmUpdatedDate").val();
    //jsonData.TrConcessionRequest_Detail_Items = $("#txtHiddenDetailItemObject").val();

    jsonData.trPMEvaluationVisuals = $("#txtHiddenDetailVisualObject").val();
    jsonData.trPMEvaluationDimensions = $("#txtHiddenDetailDimensionObject").val();
    jsonData.trPMEvaluationMaterials = $("#txtHiddenDetailMaterialObject").val();
    jsonData.trPMEvaluationPackagingIntegrities = $("#txtHiddenDetailPackagingObject").val();
    jsonData.trPMEvaluationContaminants = $("#txtHiddenDetailContaminantObject").val();

    jsonData.Attachment = $("#Attachments").val();

    $("#txtHiddenObject").val(JSON.stringify(jsonData));
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



    debugger;
    let isValid = true;
    const errorMessages = [];

    const fieldDisplayNames = {
        'txtSampleNumber': 'Sample Number',
        'txtRemark': 'Remark'
    };


    const requiredFields = [
        'txtSampleNumber', 'txtRemark'
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

    p_UItrPMEvaluationVisualToData()
    p_UItrPMEvaluationDimensionToData()
    p_UItrPMEvaluationMaterialToData()
    p_UItrPMEvaluationPackagingToData()
    p_UItrPMEvaluationContaminantToData()
    p_UIToData();

    const url = isEdit ? window.updateUrl : window.saveUrl;


    // Buat FormData untuk kirim file + data JSON
    const formData = new FormData();
    formData.append("data", $("#txtHiddenObject").val());
    formData.append("__RequestVerificationToken", $('#frmPMEvaluationDetail input[name=__RequestVerificationToken]').val());

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
        //    __RequestVerificationToken: $('#frmPMEvaluationDetail input[name=__RequestVerificationToken]').val()
        //},
        data: formData,
        contentType: false, // WAJIB: biar tidak default ke application/x-www-form-urlencoded
        processData: false, // WAJIB: jangan proses FormData jadi string
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {

                clsGlobal.swalSuccessSaveOrSubmit(retDat.txtMessage, window.detailUrl + '?id=' + retDat.objData.txtPmevaluationId);
                //clsGlobal.swalSuccessSaveOrSubmit(retDat.txtMessage, window.indexUrl);
                //window.location.href = window.indexUrl;

            } else {
                /*toastr.error(retDat.txtMessage);*/
                clsGlobal.getAlert(retDat.message);
                console.log("Jika error : " + retDat.message);
            }
        },
        error: function (xhr) {
            console.log("Status: ", xhr.status);
            console.log("Response: ", xhr.responseText);
            toastr.error("Error saving data: " + xhr.status + " - " + xhr.responseText);
        }
    });
}

function submitData(isEdit) {

    if (!validateForm()) {
        return;
    }

    p_UItrPMEvaluationVisualToData()
    p_UItrPMEvaluationDimensionToData()
    p_UItrPMEvaluationMaterialToData()
    p_UItrPMEvaluationPackagingToData()
    p_UItrPMEvaluationContaminantToData()
    p_UIToData();

    const url = window.submitUrl;


    // Buat FormData untuk kirim file + data JSON
    const formData = new FormData();
    formData.append("data", $("#txtHiddenObject").val());
    formData.append("__RequestVerificationToken", $('#frmPMEvaluationDetail input[name=__RequestVerificationToken]').val());

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
        //    __RequestVerificationToken: $('#frmPMEvaluationDetail input[name=__RequestVerificationToken]').val()
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
//        url: "/PMEvaluation/Save",
//        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmPMEvaluationDetail input[name=__RequestVerificationToken]').val() },
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

function p_COPYFROMPME_TextChanged(TxtPMEvaluationNumber) {
    clsGlobal.showLoading();

    $.ajax({
        type: "POST",
        url: "/PMEvaluation/GetData",
        data: { TxtPMEvaluationNumber: TxtPMEvaluationNumber, __RequestVerificationToken: $('#frmPMEvaluationDetail input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    //p_DataToUI(retDat.objData);
                    //$("#txtHiddenObject").val(JSON.stringify(retDat.objData));

                    //p_DataToUI(retDat.objData);
                    // Proses attachment

                    tableVisual.clear().draw(false);

                    for (var i = 0; i < retDat.objData.listVmTrPMEvaluationVisual.length; i++) {

                        tableVisual.row.add([
                            '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowVisual(this)" class="btn btn-primary btn-sm me-1 btnEditVisual" title="Edit">' +
                            '<i class="ti ti-pencil"></i>' +
                            '</button>' +
                            '<button type="button" onclick="deleteRowVisualdata(this)" class="btn btn-danger btn-sm btnDeleteVisual" title="Delete">' +
                            '<i class="ti ti-trash"></i>' +
                            '</button>' +
                            '</div>',
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtPmevaluationVisualId,
                            retDat.objData.listVmTrPMEvaluationVisual[i].intLineNo,
                            retDat.objData.listVmTrPMEvaluationVisual[i].intTestId,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtTestCode,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtTestClass,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtTestUnit,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtTestMethodCode,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtTestType,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtTarget,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtMin,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtMax,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtResult,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtStatus,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtDetail,
                            //    jsonData[i].trPMEvaluationVisual_bitNotAnalyzed
                            /*jsonData[i].trPMEvaluationVisual_bitNotAnalyzed === true ? true : false*/
                            (retDat.objData.listVmTrPMEvaluationVisual[i].bitNotAnalyzed === true || retDat.objData.listVmTrPMEvaluationVisual[i].bitNotAnalyzed === "true")
                        ]).draw(false);
                    }

                    tableDimension.clear().draw(false);

                    for (var i = 0; i < retDat.objData.listVmTrPMEvaluationDimension.length; i++) {

                        tableDimension.row.add([
                            '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowDimension(this)" class="btn btn-primary btn-sm me-1 btnEditDimension" title="Edit">' +
                            '<i class="ti ti-pencil"></i>' +
                            '</button>' +
                            '<button type="button" onclick="deleteRowDimensiondata(this)" class="btn btn-danger btn-sm btnDeleteDimension" title="Delete">' +
                            '<i class="ti ti-trash"></i>' +
                            '</button>' +
                            '</div>',
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtPmevaluationDimensionId,
                            retDat.objData.listVmTrPMEvaluationDimension[i].intLineNo,
                            retDat.objData.listVmTrPMEvaluationDimension[i].intTestId,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtTestCode,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtTestClass,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtTestUnit,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtTestMethodCode,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtTestType,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtTarget,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtMin,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtMax,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtResult,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtStatus,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtDetail,
                            //    jsonData[i].trPMEvaluationDimension_bitNotAnalyzed
                            /*jsonData[i].trPMEvaluationDimension_bitNotAnalyzed === true ? true : false*/
                            (retDat.objData.listVmTrPMEvaluationDimension[i].bitNotAnalyzed === true || retDat.objData.listVmTrPMEvaluationDimension[i].bitNotAnalyzed === "true")
                        ]).draw(false);
                    }

                    tableMaterial.clear().draw(false);

                    for (var i = 0; i < retDat.objData.listVmTrPMEvaluationMaterial.length; i++) {

                        tableMaterial.row.add([
                            '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowMaterial(this)" class="btn btn-primary btn-sm me-1 btnEditMaterial" title="Edit">' +
                            '<i class="ti ti-pencil"></i>' +
                            '</button>' +
                            '<button type="button" onclick="deleteRowMaterialdata(this)" class="btn btn-danger btn-sm btnDeleteMaterial" title="Delete">' +
                            '<i class="ti ti-trash"></i>' +
                            '</button>' +
                            '</div>',
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtPmevaluationMaterialId,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].intLineNo,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].intTestId,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtTestCode,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtTestClass,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtTestUnit,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtTestMethodCode,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtTestType,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtTarget,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtMin,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtMax,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtResult,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtStatus,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtDetail,
                            //    jsonData[i].trPMEvaluationMaterial_bitNotAnalyzed
                            /*jsonData[i].trPMEvaluationMaterial_bitNotAnalyzed === true ? true : false*/
                            (retDat.objData.listVmTrPMEvaluationMaterial[i].bitNotAnalyzed === true || retDat.objData.listVmTrPMEvaluationMaterial[i].bitNotAnalyzed === "true")
                        ]).draw(false);
                    }

                    tablePackaging.clear().draw(false);

                    for (var i = 0; i < retDat.objData.listVmTrPMEvaluationPackagingIntegrity.length; i++) {

                        tablePackaging.row.add([
                            '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowPackaging(this)" class="btn btn-primary btn-sm me-1 btnEditPackaging" title="Edit">' +
                            '<i class="ti ti-pencil"></i>' +
                            '</button>' +
                            '<button type="button" onclick="deleteRowPackagingdata(this)" class="btn btn-danger btn-sm btnDeletePackaging" title="Delete">' +
                            '<i class="ti ti-trash"></i>' +
                            '</button>' +
                            '</div>',
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtPmevaluationPackagingIntegrityId,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].intLineNo,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].intTestId,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtTestCode,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtTestClass,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtTestUnit,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtTestMethodCode,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtTestType,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtTarget,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtMin,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtMax,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtResult,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtStatus,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtDetail,
                            //    jsonData[i].trPMEvaluationMaterial_bitNotAnalyzed
                            /*jsonData[i].trPMEvaluationMaterial_bitNotAnalyzed === true ? true : false*/
                            (retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].bitNotAnalyzed === true || retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].bitNotAnalyzed === "true")
                        ]).draw(false);
                    }
                    tableContaminant.clear().draw(false);

                    for (var i = 0; i < retDat.objData.listVmTrPMEvaluationContaminant.length; i++) {

                        tableContaminant.row.add([
                            '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowContaminant(this)" class="btn btn-primary btn-sm me-1 btnEditContaminant" title="Edit">' +
                            '<i class="ti ti-pencil"></i>' +
                            '</button>' +
                            '<button type="button" onclick="deleteRowContaminantdata(this)" class="btn btn-danger btn-sm btnDeleteContaminant" title="Delete">' +
                            '<i class="ti ti-trash"></i>' +
                            '</button>' +
                            '</div>',
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtPmevaluationContaminantId,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].intLineNo,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].intTestId,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtTestCode,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtTestClass,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtTestUnit,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtTestMethodCode,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtTestType,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtTarget,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtMin,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtMax,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtResult,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtStatus,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtDetail,
                            //    jsonData[i].trPMEvaluationContaminant_bitNotAnalyzed
                            /*jsonData[i].trPMEvaluationContaminant_bitNotAnalyzed === true ? true : false*/
                            (retDat.objData.listVmTrPMEvaluationContaminant[i].bitNotAnalyzed === true || retDat.objData.listVmTrPMEvaluationContaminant[i].bitNotAnalyzed === "true")
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
function p_COPYFROMTEMPLATESPEC_TextChanged(Id) {
    clsGlobal.showLoading();

    $.ajax({
        type: "POST",
        url: "/PMEvaluation/GetDataTemplateSpec",
        data: { Id: Id, __RequestVerificationToken: $('#frmPMEvaluationDetail input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    //p_DataToUI(retDat.objData);
                    //$("#txtHiddenObject").val(JSON.stringify(retDat.objData));

                    //p_DataToUI(retDat.objData);
                    // Proses attachment

                    tableVisual.clear().draw(false);

                    for (var i = 0; i < retDat.objData.listVmTrPMEvaluationVisual.length; i++) {

                        tableVisual.row.add([
                            '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowVisual(this)" class="btn btn-primary btn-sm me-1 btnEditVisual" title="Edit">' +
                            '<i class="ti ti-pencil"></i>' +
                            '</button>' +
                            '<button type="button" onclick="deleteRowVisualdata(this)" class="btn btn-danger btn-sm btnDeleteVisual" title="Delete">' +
                            '<i class="ti ti-trash"></i>' +
                            '</button>' +
                            '</div>',
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtPmevaluationVisualId,
                            retDat.objData.listVmTrPMEvaluationVisual[i].intLineNo,
                            retDat.objData.listVmTrPMEvaluationVisual[i].intTestId,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtTestCode,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtTestClass,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtTestUnit,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtTestMethodCode,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtTestType,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtTarget,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtMin,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtMax,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtResult,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtStatus,
                            retDat.objData.listVmTrPMEvaluationVisual[i].txtDetail,
                            //    jsonData[i].trPMEvaluationVisual_bitNotAnalyzed
                            /*jsonData[i].trPMEvaluationVisual_bitNotAnalyzed === true ? true : false*/
                            (retDat.objData.listVmTrPMEvaluationVisual[i].bitNotAnalyzed === true || retDat.objData.listVmTrPMEvaluationVisual[i].bitNotAnalyzed === "true")
                        ]).draw(false);
                    }

                    tableDimension.clear().draw(false);

                    for (var i = 0; i < retDat.objData.listVmTrPMEvaluationDimension.length; i++) {

                        tableDimension.row.add([
                            '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowDimension(this)" class="btn btn-primary btn-sm me-1 btnEditDimension" title="Edit">' +
                            '<i class="ti ti-pencil"></i>' +
                            '</button>' +
                            '<button type="button" onclick="deleteRowDimensiondata(this)" class="btn btn-danger btn-sm btnDeleteDimension" title="Delete">' +
                            '<i class="ti ti-trash"></i>' +
                            '</button>' +
                            '</div>',
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtPmevaluationDimensionId,
                            retDat.objData.listVmTrPMEvaluationDimension[i].intLineNo,
                            retDat.objData.listVmTrPMEvaluationDimension[i].intTestId,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtTestCode,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtTestClass,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtTestUnit,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtTestMethodCode,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtTestType,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtTarget,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtMin,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtMax,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtResult,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtStatus,
                            retDat.objData.listVmTrPMEvaluationDimension[i].txtDetail,
                            //    jsonData[i].trPMEvaluationDimension_bitNotAnalyzed
                            /*jsonData[i].trPMEvaluationDimension_bitNotAnalyzed === true ? true : false*/
                            (retDat.objData.listVmTrPMEvaluationDimension[i].bitNotAnalyzed === true || retDat.objData.listVmTrPMEvaluationDimension[i].bitNotAnalyzed === "true")
                        ]).draw(false);
                    }

                    tableMaterial.clear().draw(false);

                    for (var i = 0; i < retDat.objData.listVmTrPMEvaluationMaterial.length; i++) {

                        tableMaterial.row.add([
                            '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowMaterial(this)" class="btn btn-primary btn-sm me-1 btnEditMaterial" title="Edit">' +
                            '<i class="ti ti-pencil"></i>' +
                            '</button>' +
                            '<button type="button" onclick="deleteRowMaterialdata(this)" class="btn btn-danger btn-sm btnDeleteMaterial" title="Delete">' +
                            '<i class="ti ti-trash"></i>' +
                            '</button>' +
                            '</div>',
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtPmevaluationMaterialId,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].intLineNo,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].intTestId,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtTestCode,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtTestClass,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtTestUnit,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtTestMethodCode,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtTestType,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtTarget,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtMin,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtMax,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtResult,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtStatus,
                            retDat.objData.listVmTrPMEvaluationMaterial[i].txtDetail,
                            //    jsonData[i].trPMEvaluationMaterial_bitNotAnalyzed
                            /*jsonData[i].trPMEvaluationMaterial_bitNotAnalyzed === true ? true : false*/
                            (retDat.objData.listVmTrPMEvaluationMaterial[i].bitNotAnalyzed === true || retDat.objData.listVmTrPMEvaluationMaterial[i].bitNotAnalyzed === "true")
                        ]).draw(false);
                    }

                    tablePackaging.clear().draw(false);

                    for (var i = 0; i < retDat.objData.listVmTrPMEvaluationPackagingIntegrity.length; i++) {

                        tablePackaging.row.add([
                            '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowPackaging(this)" class="btn btn-primary btn-sm me-1 btnEditPackaging" title="Edit">' +
                            '<i class="ti ti-pencil"></i>' +
                            '</button>' +
                            '<button type="button" onclick="deleteRowPackagingdata(this)" class="btn btn-danger btn-sm btnDeletePackaging" title="Delete">' +
                            '<i class="ti ti-trash"></i>' +
                            '</button>' +
                            '</div>',
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtPmevaluationPackagingIntegrityId,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].intLineNo,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].intTestId,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtTestCode,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtTestClass,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtTestUnit,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtTestMethodCode,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtTestType,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtTarget,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtMin,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtMax,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtResult,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtStatus,
                            retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].txtDetail,
                            //    jsonData[i].trPMEvaluationMaterial_bitNotAnalyzed
                            /*jsonData[i].trPMEvaluationMaterial_bitNotAnalyzed === true ? true : false*/
                            (retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].bitNotAnalyzed === true || retDat.objData.listVmTrPMEvaluationPackagingIntegrity[i].bitNotAnalyzed === "true")
                        ]).draw(false);
                    }
                    tableContaminant.clear().draw(false);

                    for (var i = 0; i < retDat.objData.listVmTrPMEvaluationContaminant.length; i++) {

                        tableContaminant.row.add([
                            '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowContaminant(this)" class="btn btn-primary btn-sm me-1 btnEditContaminant" title="Edit">' +
                            '<i class="ti ti-pencil"></i>' +
                            '</button>' +
                            '<button type="button" onclick="deleteRowContaminantdata(this)" class="btn btn-danger btn-sm btnDeleteContaminant" title="Delete">' +
                            '<i class="ti ti-trash"></i>' +
                            '</button>' +
                            '</div>',
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtPmevaluationContaminantId,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].intLineNo,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].intTestId,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtTestCode,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtTestClass,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtTestUnit,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtTestMethodCode,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtTestType,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtTarget,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtMin,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtMax,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtResult,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtStatus,
                            retDat.objData.listVmTrPMEvaluationContaminant[i].txtDetail,
                            //    jsonData[i].trPMEvaluationContaminant_bitNotAnalyzed
                            /*jsonData[i].trPMEvaluationContaminant_bitNotAnalyzed === true ? true : false*/
                            (retDat.objData.listVmTrPMEvaluationContaminant[i].bitNotAnalyzed === true || retDat.objData.listVmTrPMEvaluationContaminant[i].bitNotAnalyzed === "true")
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
    p_ShowBlankVisualDetailChange();

    $("#trPMEvaluationVisual_intTestID").val(arr[1]);
    $("#trPMEvaluationVisual_txtTestCode").val(arr[2]);
    $("#trPMEvaluationVisual_txtTestClass").val(arr[3]);
    $("#trPMEvaluationVisual_txtTestMethodCode").val(arr[4]);
    $("#trPMEvaluationVisual_txtTestType").val(arr[5]);
    $("#trPMEvaluationVisual_txtTestUnit").val(arr[6]);

    if ($('#trPMEvaluationVisual_txtTestType').val() == "N") {

        $('#btnLOVtxtTarget').prop('disabled', true);
        $('#trPMEvaluationVisual_txtTarget').removeAttr('readonly');

        $('#btnLOVtxtResult').prop('disabled', true);
        $('#trPMEvaluationVisual_txtResult').removeAttr('readonly');

        $('#btnLOVtxtMin').prop('disabled', true);
        $('#btnLOVtxtMax').prop('disabled', true);

        $('#trPMEvaluationVisual_txtMin').removeAttr('readonly');
        $('#trPMEvaluationVisual_txtMax').removeAttr('readonly');

        // Tambah event untuk formatDecimal
        $('#trPMEvaluationVisual_txtTarget').off('input').on('input', function () {
            formatDecimal(this);
        });
        $('#trPMEvaluationVisual_txtResult').off('input').on('input', function () {
            formatDecimal(this);
        });
        $('#trPMEvaluationVisual_txtMin').off('input').on('input', function () {
            formatDecimal(this);
        });
        $('#trPMEvaluationVisual_txtMax').off('input').on('input', function () {
            formatDecimal(this);
        });

        // Pasang blur event
        $('#trPMEvaluationVisual_txtTarget').off('blur').on('blur', function () {
            //let value = this.value.replace(/,/g, '');
            //if (value.includes('.')) return;

            //let number = parseFloat(value);
            //if (!isNaN(number)) {
            //    let intPart = Math.floor(number).toString();
            //    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            //    this.value = `${intPart}.000000000`;
            //}
            formatDecimal(this);
        });
        $('#trPMEvaluationVisual_txtResult').off('blur').on('blur', function () {
            //let value = this.value.replace(/,/g, '');
            //if (value.includes('.')) return;

            //let number = parseFloat(value);
            //if (!isNaN(number)) {
            //    let intPart = Math.floor(number).toString();
            //    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            //    this.value = `${intPart}.000000000`;
            //}
            formatDecimal(this);
        });
        $('#trPMEvaluationVisual_txtMin').off('blur').on('blur', function () {
            //let value = this.value.replace(/,/g, '');
            //if (value.includes('.')) return;

            //let number = parseFloat(value);
            //if (!isNaN(number)) {
            //    let intPart = Math.floor(number).toString();
            //    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            //    this.value = `${intPart}.000000000`;
            //}
            formatDecimal(this);
        });
        $('#trPMEvaluationVisual_txtMax').off('blur').on('blur', function () {
            //let value = this.value.replace(/,/g, '');
            //if (value.includes('.')) return;

            //let number = parseFloat(value);
            //if (!isNaN(number)) {
            //    let intPart = Math.floor(number).toString();
            //    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            //    this.value = `${intPart}.000000000`;
            //}
            formatDecimal(this);
        });
    } else if ($('#trPMEvaluationVisual_txtTestType').val() == "T") {
        $('#btnLOVtxtTarget').prop('disabled', false);
        $('#trPMEvaluationVisual_txtTarget').attr('readonly', true);

        $('#btnLOVtxtResult').prop('disabled', false);
        $('#trPMEvaluationVisual_txtResult').attr('readonly', true);

        $('#btnLOVtxtMin').prop('disabled', false);
        $('#trPMEvaluationVisual_txtMin').attr('readonly', true);
        $('#btnLOVtxtMax').prop('disabled', false);
        $('#trPMEvaluationVisual_txtMax').attr('readonly', true);

        //$('#trPMEvaluationVisual_txtMin').removeAttr('readonly');
        //$('#trPMEvaluationVisual_txtMax').removeAttr('readonly');

        $('#trPMEvaluationVisual_txtTarget').off('input blur');
        $('#trPMEvaluationVisual_txtResult').off('input blur');
        $('#trPMEvaluationVisual_txtMin').off('input blur');
        $('#trPMEvaluationVisual_txtMax').off('input blur');
    } else {
        $('#btnLOVtxtTarget').prop('disabled', false);
        $('#trPMEvaluationVisual_txtTarget').attr('readonly', true);

        $('#btnLOVtxtResult').prop('disabled', false);
        $('#trPMEvaluationVisual_txtResult').attr('readonly', true);

        $('#btnLOVtxtMin').prop('disabled', true);
        $('#btnLOVtxtMax').prop('disabled', true);
        $('#trPMEvaluationVisual_txtMin').attr('readonly', true);
        $('#trPMEvaluationVisual_txtMax').attr('readonly', true);

        // Hapus input dan blur event agar tidak format otomatis
        $('#trPMEvaluationVisual_txtTarget').off('input blur');
        $('#trPMEvaluationVisual_txtResult').off('input blur');
        $('#trPMEvaluationVisual_txtMin').off('input blur');
        $('#trPMEvaluationVisual_txtMax').off('input blur');
    }

}

function p_txtTestCodeDimension_TextChanged(arr) {

    var table_Length = $('#tableDimension tbody tr').length;
    var index = $('#tableDimension tbody tr').length - 1;

    p_ShowBlankDimensionDetailChange();

    $("#trPMEvaluationDimension_intTestID").val(arr[1]);
    $("#trPMEvaluationDimension_txtTestCode").val(arr[2]);
    $("#trPMEvaluationDimension_txtTestClass").val(arr[3]);
    $("#trPMEvaluationDimension_txtTestMethodCode").val(arr[4]);
    $("#trPMEvaluationDimension_txtTestType").val(arr[5]);
    $("#trPMEvaluationDimension_txtTestUnit").val(arr[6]);


    if ($('#trPMEvaluationDimension_txtTestType').val() == "N") {

        $('#btnLOVtxtTargetDimension').prop('disabled', true);
        $('#trPMEvaluationDimension_txtTarget').removeAttr('readonly');

        $('#btnLOVtxtResultDimension').prop('disabled', true);
        $('#trPMEvaluationDimension_txtResult').removeAttr('readonly');

        $('#btnLOVtxtMinDimension').prop('disabled', true);
        $('#btnLOVtxtMaxDimension').prop('disabled', true);

        $('#trPMEvaluationDimension_txtMin').removeAttr('readonly');
        $('#trPMEvaluationDimension_txtMax').removeAttr('readonly');

        // Tambah event untuk formatDecimal
        $('#trPMEvaluationDimension_txtTarget').off('input').on('input', function () {
            formatDecimal(this);
        });
        $('#trPMEvaluationDimension_txtResult').off('input').on('input', function () {
            formatDecimal(this);
        });
        $('#trPMEvaluationDimension_txtMin').off('input').on('input', function () {
            formatDecimal(this);
        });
        $('#trPMEvaluationDimension_txtMax').off('input').on('input', function () {
            formatDecimal(this);
        });

        // Pasang blur event
        $('#trPMEvaluationDimension_txtTarget').off('blur').on('blur', function () {
            //let value = this.value.replace(/,/g, '');
            //if (value.includes('.')) return;

            //let number = parseFloat(value);
            //if (!isNaN(number)) {
            //    let intPart = Math.floor(number).toString();
            //    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            //    this.value = `${intPart}.000000000`;
            //}
            formatDecimal(this);
        });
        $('#trPMEvaluationDimension_txtResult').off('blur').on('blur', function () {
            //let value = this.value.replace(/,/g, '');
            //if (value.includes('.')) return;

            //let number = parseFloat(value);
            //if (!isNaN(number)) {
            //    let intPart = Math.floor(number).toString();
            //    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            //    this.value = `${intPart}.000000000`;
            //}
            formatDecimal(this);
        });
        $('#trPMEvaluationDimension_txtMin').off('blur').on('blur', function () {
            //let value = this.value.replace(/,/g, '');
            //if (value.includes('.')) return;

            //let number = parseFloat(value);
            //if (!isNaN(number)) {
            //    let intPart = Math.floor(number).toString();
            //    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            //    this.value = `${intPart}.000000000`;
            //}
            formatDecimal(this);
        });
        $('#trPMEvaluationDimension_txtMax').off('blur').on('blur', function () {
            //let value = this.value.replace(/,/g, '');
            //if (value.includes('.')) return;

            //let number = parseFloat(value);
            //if (!isNaN(number)) {
            //    let intPart = Math.floor(number).toString();
            //    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            //    this.value = `${intPart}.000000000`;
            //}
            formatDecimal(this);
        });
    } else if ($('#trPMEvaluationDimension_txtTestType').val() == "T") {
        $('#btnLOVtxtTargetDimension').prop('disabled', false);
        $('#trPMEvaluationDimension_txtTarget').attr('readonly', true);

        $('#btnLOVtxtResultDimension').prop('disabled', false);
        $('#trPMEvaluationDimension_txtResult').attr('readonly', true);

        $('#btnLOVtxtMinDimension').prop('disabled', false);
        $('#trPMEvaluationDimension_txtMin').attr('readonly', true);
        $('#btnLOVtxtMaxDimension').prop('disabled', false);
        $('#trPMEvaluationDimension_txtMax').attr('readonly', true);

        //$('#trPMEvaluationDimension_txtMin').removeAttr('readonly');
        //$('#trPMEvaluationDimension_txtMax').removeAttr('readonly');

        $('#trPMEvaluationDimension_txtTarget').off('input blur');
        $('#trPMEvaluationDimension_txtResult').off('input blur');
        $('#trPMEvaluationDimension_txtMin').off('input blur');
        $('#trPMEvaluationDimension_txtMax').off('input blur');
    } else {
        $('#btnLOVtxtTargetDimension').prop('disabled', false);
        $('#trPMEvaluationDimension_txtTarget').attr('readonly', true);

        $('#btnLOVtxtResultDimension').prop('disabled', false);
        $('#trPMEvaluationDimension_txtResult').attr('readonly', true);

        $('#btnLOVtxtMinDimension').prop('disabled', true);
        $('#btnLOVtxtMaxDimension').prop('disabled', true);
        $('#trPMEvaluationDimension_txtMin').attr('readonly', true);
        $('#trPMEvaluationDimension_txtMax').attr('readonly', true);

        // Hapus input dan blur event agar tidak format otomatis
        $('#trPMEvaluationDimension_txtTarget').off('input blur');
        $('#trPMEvaluationDimension_txtResult').off('input blur');
        $('#trPMEvaluationDimension_txtMin').off('input blur');
        $('#trPMEvaluationDimension_txtMax').off('input blur');
    }
}

function p_txtTestCodeMaterial_TextChanged(arr) {

    var table_Length = $('#tableMaterial tbody tr').length;
    var index = $('#tableMaterial tbody tr').length - 1;

    p_ShowBlankMaterialDetailChange();

    $("#trPMEvaluationMaterial_intTestID").val(arr[1]);
    $("#trPMEvaluationMaterial_txtTestCode").val(arr[2]);
    $("#trPMEvaluationMaterial_txtTestClass").val(arr[3]);
    $("#trPMEvaluationMaterial_txtTestMethodCode").val(arr[4]);
    $("#trPMEvaluationMaterial_txtTestType").val(arr[5]);
    $("#trPMEvaluationMaterial_txtTestUnit").val(arr[6]);


    if ($('#trPMEvaluationMaterial_txtTestType').val() == "N") {

        $('#btnLOVtxtTargetMaterial').prop('disabled', true);
        $('#trPMEvaluationMaterial_txtTarget').removeAttr('readonly');

        $('#btnLOVtxtResultMaterial').prop('disabled', true);
        $('#trPMEvaluationMaterial_txtResult').removeAttr('readonly');

        $('#btnLOVtxtMinMaterial').prop('disabled', true);
        $('#btnLOVtxtMaxMaterial').prop('disabled', true);
        $('#trPMEvaluationMaterial_txtMin').removeAttr('readonly');
        $('#trPMEvaluationMaterial_txtMax').removeAttr('readonly');

        // Tambah event untuk formatDecimal
        $('#trPMEvaluationMaterial_txtTarget').off('input').on('input', function () {
            formatDecimal(this);
        });
        $('#trPMEvaluationMaterial_txtResult').off('input').on('input', function () {
            formatDecimal(this);
        });
        $('#trPMEvaluationMaterial_txtMin').off('input').on('input', function () {
            formatDecimal(this);
        });
        $('#trPMEvaluationMaterial_txtMax').off('input').on('input', function () {
            formatDecimal(this);
        });

        // Pasang blur event
        $('#trPMEvaluationMaterial_txtTarget').off('blur').on('blur', function () {
            //let value = this.value.replace(/,/g, '');
            //if (value.includes('.')) return;

            //let number = parseFloat(value);
            //if (!isNaN(number)) {
            //    let intPart = Math.floor(number).toString();
            //    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            //    this.value = `${intPart}.000000000`;
            //}
            formatDecimal(this);
        });
        $('#trPMEvaluationMaterial_txtResult').off('blur').on('blur', function () {
            //let value = this.value.replace(/,/g, '');
            //if (value.includes('.')) return;

            //let number = parseFloat(value);
            //if (!isNaN(number)) {
            //    let intPart = Math.floor(number).toString();
            //    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            //    this.value = `${intPart}.000000000`;
            //}
            formatDecimal(this);
        });
        $('#trPMEvaluationMaterial_txtMin').off('blur').on('blur', function () {
            //let value = this.value.replace(/,/g, '');
            //if (value.includes('.')) return;

            //let number = parseFloat(value);
            //if (!isNaN(number)) {
            //    let intPart = Math.floor(number).toString();
            //    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            //    this.value = `${intPart}.000000000`;
            //}
            formatDecimal(this);
        });
        $('#trPMEvaluationMaterial_txtMax').off('blur').on('blur', function () {
            //let value = this.value.replace(/,/g, '');
            //if (value.includes('.')) return;

            //let number = parseFloat(value);
            //if (!isNaN(number)) {
            //    let intPart = Math.floor(number).toString();
            //    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            //    this.value = `${intPart}.000000000`;
            //}
            formatDecimal(this);
        });
    } else if ($('#trPMEvaluationMaterial_txtTestType').val() == "T") {
        $('#btnLOVtxtTargetMaterial').prop('disabled', false);
        $('#trPMEvaluationMaterial_txtTarget').attr('readonly', true);

        $('#btnLOVtxtResultMaterial').prop('disabled', false);
        $('#trPMEvaluationMaterial_txtResult').attr('readonly', true);

        $('#btnLOVtxtMinMaterial').prop('disabled', false);
        $('#trPMEvaluationMaterial_txtMin').attr('readonly', true);
        $('#btnLOVtxtMaxMaterial').prop('disabled', false);
        $('#trPMEvaluationMaterial_txtMax').attr('readonly', true);
        //$('#trPMEvaluationMaterial_txtMin').removeAttr('readonly');
        //$('#trPMEvaluationMaterial_txtMax').removeAttr('readonly');

        $('#trPMEvaluationMaterial_txtTarget').off('input blur');
        $('#trPMEvaluationMaterial_txtResult').off('input blur');
        $('#trPMEvaluationMaterial_txtMin').off('input blur');
        $('#trPMEvaluationMaterial_txtMax').off('input blur');
    } else {
        $('#btnLOVtxtTargetMaterial').prop('disabled', false);
        $('#trPMEvaluationMaterial_txtTarget').attr('readonly', true);

        $('#btnLOVtxtResultMaterial').prop('disabled', false);
        $('#trPMEvaluationMaterial_txtResult').attr('readonly', true);

        $('#btnLOVtxtMinMaterial').prop('disabled', true);
        $('#btnLOVtxtMaxMaterial').prop('disabled', true);
        $('#trPMEvaluationMaterial_txtMin').attr('readonly', true);
        $('#trPMEvaluationMaterial_txtMax').attr('readonly', true);

        // Hapus input dan blur event agar tidak format otomatis
        $('#trPMEvaluationMaterial_txtTarget').off('input blur');
        $('#trPMEvaluationMaterial_txtResult').off('input blur');
        $('#trPMEvaluationMaterial_txtMin').off('input blur');
        $('#trPMEvaluationMaterial_txtMax').off('input blur');
    }
}

function p_txtTestCodePackaging_TextChanged(arr) {

    var table_Length = $('#tablePackaging tbody tr').length;
    var index = $('#tablePackaging tbody tr').length - 1;

    p_ShowBlankPackagingDetailChange();

    $("#trPMEvaluationPackaging_intTestID").val(arr[1]);
    $("#trPMEvaluationPackaging_txtTestCode").val(arr[2]);
    $("#trPMEvaluationPackaging_txtTestClass").val(arr[3]);
    $("#trPMEvaluationPackaging_txtTestMethodCode").val(arr[4]);
    $("#trPMEvaluationPackaging_txtTestType").val(arr[5]);
    $("#trPMEvaluationPackaging_txtTestUnit").val(arr[6]);


    if ($('#trPMEvaluationPackaging_txtTestType').val() == "N") {

        $('#btnLOVtxtTargetPackaging').prop('disabled', true);
        $('#trPMEvaluationPackaging_txtTarget').removeAttr('readonly');

        $('#btnLOVtxtResultPackaging').prop('disabled', true);
        $('#trPMEvaluationPackaging_txtResult').removeAttr('readonly');

        $('#btnLOVtxtMinPackaging').prop('disabled', true);
        $('#btnLOVtxtMaxPackaging').prop('disabled', true);
        $('#trPMEvaluationPackaging_txtMin').removeAttr('readonly');
        $('#trPMEvaluationPackaging_txtMax').removeAttr('readonly');

        // Tambah event untuk formatDecimal
        $('#trPMEvaluationPackaging_txtTarget').off('input').on('input', function () {
            formatDecimal(this);
        });
        $('#trPMEvaluationPackaging_txtResult').off('input').on('input', function () {
            formatDecimal(this);
        });
        $('#trPMEvaluationPackaging_txtMin').off('input').on('input', function () {
            formatDecimal(this);
        });
        $('#trPMEvaluationPackaging_txtMax').off('input').on('input', function () {
            formatDecimal(this);
        });

        // Pasang blur event
        $('#trPMEvaluationPackaging_txtTarget').off('blur').on('blur', function () {
            //let value = this.value.replace(/,/g, '');
            //if (value.includes('.')) return;

            //let number = parseFloat(value);
            //if (!isNaN(number)) {
            //    let intPart = Math.floor(number).toString();
            //    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            //    this.value = `${intPart}.000000000`;
            //}
            formatDecimal(this);
        });
        $('#trPMEvaluationPackaging_txtResult').off('blur').on('blur', function () {
            //let value = this.value.replace(/,/g, '');
            //if (value.includes('.')) return;

            //let number = parseFloat(value);
            //if (!isNaN(number)) {
            //    let intPart = Math.floor(number).toString();
            //    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            //    this.value = `${intPart}.000000000`;
            //}
            formatDecimal(this);
        });
        $('#trPMEvaluationPackaging_txtMin').off('blur').on('blur', function () {
            //let value = this.value.replace(/,/g, '');
            //if (value.includes('.')) return;

            //let number = parseFloat(value);
            //if (!isNaN(number)) {
            //    let intPart = Math.floor(number).toString();
            //    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            //    this.value = `${intPart}.000000000`;
            //}
            formatDecimal(this);
        });
        $('#trPMEvaluationPackaging_txtMax').off('blur').on('blur', function () {
            //let value = this.value.replace(/,/g, '');
            //if (value.includes('.')) return;

            //let number = parseFloat(value);
            //if (!isNaN(number)) {
            //    let intPart = Math.floor(number).toString();
            //    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            //    this.value = `${intPart}.000000000`;
            //}
            formatDecimal(this);
        });
    } else if ($('#trPMEvaluationPackaging_txtTestType').val() == "T") {
        $('#btnLOVtxtTargetPackaging').prop('disabled', false);
        $('#trPMEvaluationPackaging_txtTarget').attr('readonly', true);

        $('#btnLOVtxtResultPackaging').prop('disabled', false);
        $('#trPMEvaluationPackaging_txtResult').attr('readonly', true);

        $('#btnLOVtxtMinPackaging').prop('disabled', false);
        $('#trPMEvaluationPackaging_txtMin').attr('readonly', true);
        $('#btnLOVtxtMaxPackaging').prop('disabled', false);
        $('#trPMEvaluationPackaging_txtMax').attr('readonly', true);
        //$('#trPMEvaluationPackaging_txtMin').removeAttr('readonly');
        //$('#trPMEvaluationPackaging_txtMax').removeAttr('readonly');

        $('#trPMEvaluationPackaging_txtTarget').off('input blur');
        $('#trPMEvaluationPackaging_txtResult').off('input blur');
        $('#trPMEvaluationPackaging_txtMin').off('input blur');
        $('#trPMEvaluationPackaging_txtMax').off('input blur');
    } else {
        $('#btnLOVtxtTargetPackaging').prop('disabled', false);
        $('#trPMEvaluationPackaging_txtTarget').attr('readonly', true);

        $('#btnLOVtxtResultPackaging').prop('disabled', false);
        $('#trPMEvaluationPackaging_txtResult').attr('readonly', true);

        $('#btnLOVtxtMinPackaging').prop('disabled', true);
        $('#btnLOVtxtMaxPackaging').prop('disabled', true);
        $('#trPMEvaluationPackaging_txtMin').attr('readonly', true);
        $('#trPMEvaluationPackaging_txtMax').attr('readonly', true);

        // Hapus input dan blur event agar tidak format otomatis
        $('#trPMEvaluationPackaging_txtTarget').off('input blur');
        $('#trPMEvaluationPackaging_txtResult').off('input blur');
        $('#trPMEvaluationPackaging_txtMin').off('input blur');
        $('#trPMEvaluationPackaging_txtMax').off('input blur');
    }
}

function p_txtTestCodeContaminant_TextChanged(arr) {

    var table_Length = $('#tableContaminant tbody tr').length;
    var index = $('#tableContaminant tbody tr').length - 1;

    p_ShowBlankContaminantDetailChange();

    $("#trPMEvaluationContaminant_intTestID").val(arr[1]);
    $("#trPMEvaluationContaminant_txtTestCode").val(arr[2]);
    $("#trPMEvaluationContaminant_txtTestClass").val(arr[3]);
    $("#trPMEvaluationContaminant_txtTestMethodCode").val(arr[4]);
    $("#trPMEvaluationContaminant_txtTestType").val(arr[5]);
    $("#trPMEvaluationContaminant_txtTestUnit").val(arr[6]);


    if ($('#trPMEvaluationContaminant_txtTestType').val() == "N") {

        $('#btnLOVtxtTargetContaminant').prop('disabled', true);
        $('#trPMEvaluationContaminant_txtTarget').removeAttr('readonly');

        $('#btnLOVtxtResultContaminant').prop('disabled', true);
        $('#trPMEvaluationContaminant_txtResult').removeAttr('readonly');

        $('#btnLOVtxtMinContaminant').prop('disabled', true);
        $('#btnLOVtxtMaxContaminant').prop('disabled', true);
        $('#trPMEvaluationContaminant_txtMin').removeAttr('readonly');
        $('#trPMEvaluationContaminant_txtMax').removeAttr('readonly');

        // Tambah event untuk formatDecimal
        $('#trPMEvaluationContaminant_txtTarget').off('input').on('input', function () {
            formatDecimal(this);
        });
        $('#trPMEvaluationContaminant_txtResult').off('input').on('input', function () {
            formatDecimal(this);
        });
        $('#trPMEvaluationContaminant_txtMin').off('input').on('input', function () {
            formatDecimal(this);
        });
        $('#trPMEvaluationContaminant_txtMax').off('input').on('input', function () {
            formatDecimal(this);
        });

        // Pasang blur event
        $('#trPMEvaluationContaminant_txtTarget').off('blur').on('blur', function () {
            //let value = this.value.replace(/,/g, '');
            //if (value.includes('.')) return;

            //let number = parseFloat(value);
            //if (!isNaN(number)) {
            //    let intPart = Math.floor(number).toString();
            //    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            //    this.value = `${intPart}.000000000`;
            //}
            formatDecimal(this);
        });
        $('#trPMEvaluationContaminant_txtResult').off('blur').on('blur', function () {
            //let value = this.value.replace(/,/g, '');
            //if (value.includes('.')) return;

            //let number = parseFloat(value);
            //if (!isNaN(number)) {
            //    let intPart = Math.floor(number).toString();
            //    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            //    this.value = `${intPart}.000000000`;
            //}
            formatDecimal(this);
        });
        $('#trPMEvaluationContaminant_txtMin').off('blur').on('blur', function () {
            //let value = this.value.replace(/,/g, '');
            //if (value.includes('.')) return;

            //let number = parseFloat(value);
            //if (!isNaN(number)) {
            //    let intPart = Math.floor(number).toString();
            //    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            //    this.value = `${intPart}.000000000`;
            //}
            formatDecimal(this);
        });
        $('#trPMEvaluationContaminant_txtMax').off('blur').on('blur', function () {
            //let value = this.value.replace(/,/g, '');
            //if (value.includes('.')) return;

            //let number = parseFloat(value);
            //if (!isNaN(number)) {
            //    let intPart = Math.floor(number).toString();
            //    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            //    this.value = `${intPart}.000000000`;
            //}
            formatDecimal(this);
        });
    } else if ($('#trPMEvaluationContaminant_txtTestType').val() == "T") {
        $('#btnLOVtxtTargetContaminant').prop('disabled', false);
        $('#trPMEvaluationContaminant_txtTarget').attr('readonly', true);

        $('#btnLOVtxtResultContaminant').prop('disabled', false);
        $('#trPMEvaluationContaminant_txtResult').attr('readonly', true);

        $('#btnLOVtxtMinContaminant').prop('disabled', false);
        $('#trPMEvaluationContaminant_txtMin').attr('readonly', true);
        $('#btnLOVtxtMaxContaminant').prop('disabled', false);
        $('#trPMEvaluationContaminant_txtMax').attr('readonly', true);
        //$('#trPMEvaluationContaminant_txtMin').removeAttr('readonly');
        //$('#trPMEvaluationContaminant_txtMax').removeAttr('readonly');

        $('#trPMEvaluationContaminant_txtTarget').off('input blur');
        $('#trPMEvaluationContaminant_txtResult').off('input blur');
        $('#trPMEvaluationContaminant_txtMin').off('input blur');
        $('#trPMEvaluationContaminant_txtMax').off('input blur');
    } else {
        $('#btnLOVtxtTargetContaminant').prop('disabled', false);
        $('#trPMEvaluationContaminant_txtTarget').attr('readonly', true);

        $('#btnLOVtxtResultContaminant').prop('disabled', false);
        $('#trPMEvaluationContaminant_txtResult').attr('readonly', true);

        $('#btnLOVtxtMinContaminant').prop('disabled', true);
        $('#btnLOVtxtMinContaminant').prop('disabled', true);
        $('#trPMEvaluationContaminant_txtMin').attr('readonly', true);
        $('#trPMEvaluationContaminant_txtMax').attr('readonly', true);

        // Hapus input dan blur event agar tidak format otomatis
        $('#trPMEvaluationContaminant_txtTarget').off('input blur');
        $('#trPMEvaluationContaminant_txtResult').off('input blur');
        $('#trPMEvaluationContaminant_txtMin').off('input blur');
        $('#trPMEvaluationContaminant_txtMax').off('input blur');
    }
}

function p_ShowBlankVisualDetailChange() {

    $("#trPMEvaluationVisual_txtTestClass").val("");
    $("#trPMEvaluationVisual_txtTestUnit").val("");
    $("#trPMEvaluationVisual_txtTestMethodCode").val("");
    $("#trPMEvaluationVisual_txtTestType").val("");
    $("#trPMEvaluationVisual_txtTarget").val("");
    $("#trPMEvaluationVisual_txtMin").val("");
    $("#trPMEvaluationVisual_txtMax").val("");
    $("#trPMEvaluationVisual_txtResult").val("");
    $("#trPMEvaluationVisual_txtStatus").val("NOT OK");
    $("#trPMEvaluationVisual_txtDetail").val("");
    $("#trPMEvaluationVisual_bitNotAnalyzed").prop("checked", false);

}

function p_ShowBlankDimensionDetailChange() {

    $("#trPMEvaluationDimension_txtTestClass").val("");
    $("#trPMEvaluationDimension_txtTestUnit").val("");
    $("#trPMEvaluationDimension_txtTestMethodCode").val("");
    $("#trPMEvaluationDimension_txtTestType").val("");
    $("#trPMEvaluationDimension_txtTarget").val("");
    $("#trPMEvaluationDimension_txtMin").val("");
    $("#trPMEvaluationDimension_txtMax").val("");
    $("#trPMEvaluationDimension_txtResult").val("");
    $("#trPMEvaluationDimension_txtStatus").val("NOT OK");
    $("#trPMEvaluationDimension_txtDetail").val("");
    $("#trPMEvaluationDimension_bitNotAnalyzed").prop("checked", false);

}

function p_ShowBlankMaterialDetailChange() {

    $("#trPMEvaluationMaterial_txtTestClass").val("");
    $("#trPMEvaluationMaterial_txtTestUnit").val("");
    $("#trPMEvaluationMaterial_txtTestMethodCode").val("");
    $("#trPMEvaluationMaterial_txtTestType").val("");
    $("#trPMEvaluationMaterial_txtTarget").val("");
    $("#trPMEvaluationMaterial_txtMin").val("");
    $("#trPMEvaluationMaterial_txtMax").val("");
    $("#trPMEvaluationMaterial_txtResult").val("");
    $("#trPMEvaluationMaterial_txtStatus").val("NOT OK");
    $("#trPMEvaluationMaterial_txtDetail").val("");
    $("#trPMEvaluationMaterial_bitNotAnalyzed").prop("checked", false);

}

function p_ShowBlankPackagingDetailChange() {

    $("#trPMEvaluationPackaging_txtTestClass").val("");
    $("#trPMEvaluationPackaging_txtTestUnit").val("");
    $("#trPMEvaluationPackaging_txtTestMethodCode").val("");
    $("#trPMEvaluationPackaging_txtTestType").val("");
    $("#trPMEvaluationPackaging_txtTarget").val("");
    $("#trPMEvaluationPackaging_txtMin").val("");
    $("#trPMEvaluationPackaging_txtMax").val("");
    $("#trPMEvaluationPackaging_txtResult").val("");
    $("#trPMEvaluationPackaging_txtStatus").val("NOT OK");
    $("#trPMEvaluationPackaging_txtDetail").val("");
    $("#trPMEvaluationPackaging_bitNotAnalyzed").prop("checked", false);

}

function p_ShowBlankContaminantDetailChange() {

    $("#trPMEvaluationContaminant_txtTestClass").val("");
    $("#trPMEvaluationContaminant_txtTestUnit").val("");
    $("#trPMEvaluationContaminant_txtTestMethodCode").val("");
    $("#trPMEvaluationContaminant_txtTestType").val("");
    $("#trPMEvaluationContaminant_txtTarget").val("");
    $("#trPMEvaluationContaminant_txtMin").val("");
    $("#trPMEvaluationContaminant_txtMax").val("");
    $("#trPMEvaluationContaminant_txtResult").val("");
    $("#trPMEvaluationContaminant_txtStatus").val("NOT OK");
    $("#trPMEvaluationContaminant_txtDetail").val("");
    $("#trPMEvaluationContaminant_bitNotAnalyzed").prop("checked", false);

}

function p_ShowBlankVisualDetail() {


    $("#trPMEvaluationVisual_txtPMEvaluationVisualID").val("");
    $("#trPMEvaluationVisual_intLineID").val("");
    $("#trPMEvaluationVisual_intTestID").val("");
    $("#trPMEvaluationVisual_txtTestCode").val("");
    $("#trPMEvaluationVisual_txtTestClass").val("");
    $("#trPMEvaluationVisual_txtTestUnit").val("");
    $("#trPMEvaluationVisual_txtTestMethodCode").val("");
    $("#trPMEvaluationVisual_txtTestType").val("");
    $("#trPMEvaluationVisual_txtTarget").val("");
    $("#trPMEvaluationVisual_txtMin").val("");
    $("#trPMEvaluationVisual_txtMax").val("");
    $("#trPMEvaluationVisual_txtResult").val("");
    $("#trPMEvaluationVisual_txtStatus").val("NOT OK");
    $("#trPMEvaluationVisual_txtDetail").val("");
    $("#trPMEvaluationVisual_bitNotAnalyzed").prop("checked", false);

}

function p_ShowBlankDimensionDetail() {


    $("#trPMEvaluationDimension_txtPMEvaluationDimensionID").val("");
    $("#trPMEvaluationDimension_intLineID").val("");
    $("#trPMEvaluationDimension_intTestID").val("");
    $("#trPMEvaluationDimension_txtTestCode").val("");
    $("#trPMEvaluationDimension_txtTestClass").val("");
    $("#trPMEvaluationDimension_txtTestUnit").val("");
    $("#trPMEvaluationDimension_txtTestMethodCode").val("");
    $("#trPMEvaluationDimension_txtTestType").val("");
    $("#trPMEvaluationDimension_txtTarget").val("");
    $("#trPMEvaluationDimension_txtMin").val("");
    $("#trPMEvaluationDimension_txtMax").val("");
    $("#trPMEvaluationDimension_txtResult").val("");
    $("#trPMEvaluationDimension_txtStatus").val("NOT OK");
    $("#trPMEvaluationDimension_txtDetail").val("");
    $("#trPMEvaluationDimension_bitNotAnalyzed").prop("checked", false);

}

function p_ShowBlankMaterialDetail() {


    $("#trPMEvaluationMaterial_txtPMEvaluationMaterialID").val("");
    $("#trPMEvaluationMaterial_intLineID").val("");
    $("#trPMEvaluationMaterial_intTestID").val("");
    $("#trPMEvaluationMaterial_txtTestCode").val("");
    $("#trPMEvaluationMaterial_txtTestClass").val("");
    $("#trPMEvaluationMaterial_txtTestUnit").val("");
    $("#trPMEvaluationMaterial_txtTestMethodCode").val("");
    $("#trPMEvaluationMaterial_txtTestType").val("");
    $("#trPMEvaluationMaterial_txtTarget").val("");
    $("#trPMEvaluationMaterial_txtMin").val("");
    $("#trPMEvaluationMaterial_txtMax").val("");
    $("#trPMEvaluationMaterial_txtResult").val("");
    $("#trPMEvaluationMaterial_txtStatus").val("NOT OK");
    $("#trPMEvaluationMaterial_txtDetail").val("");
    $("#trPMEvaluationMaterial_bitNotAnalyzed").prop("checked", false);

}

function p_ShowBlankPackagingDetail() {


    $("#trPMEvaluationPackaging_txtPMEvaluationPackagingID").val("");
    $("#trPMEvaluationPackaging_intLineID").val("");
    $("#trPMEvaluationPackaging_intTestID").val("");
    $("#trPMEvaluationPackaging_txtTestCode").val("");
    $("#trPMEvaluationPackaging_txtTestClass").val("");
    $("#trPMEvaluationPackaging_txtTestUnit").val("");
    $("#trPMEvaluationPackaging_txtTestMethodCode").val("");
    $("#trPMEvaluationPackaging_txtTestType").val("");
    $("#trPMEvaluationPackaging_txtTarget").val("");
    $("#trPMEvaluationPackaging_txtMin").val("");
    $("#trPMEvaluationPackaging_txtMax").val("");
    $("#trPMEvaluationPackaging_txtResult").val("");
    $("#trPMEvaluationPackaging_txtStatus").val("NOT OK");
    $("#trPMEvaluationPackaging_txtDetail").val("");
    $("#trPMEvaluationPackaging_bitNotAnalyzed").prop("checked", false);

}

function p_ShowBlankContaminantDetail() {


    $("#trPMEvaluationContaminant_txtPMEvaluationContaminantID").val("");
    $("#trPMEvaluationContaminant_intLineID").val("");
    $("#trPMEvaluationContaminant_intTestID").val("");
    $("#trPMEvaluationContaminant_txtTestCode").val("");
    $("#trPMEvaluationContaminant_txtTestClass").val("");
    $("#trPMEvaluationContaminant_txtTestUnit").val("");
    $("#trPMEvaluationContaminant_txtTestMethodCode").val("");
    $("#trPMEvaluationContaminant_txtTestType").val("");
    $("#trPMEvaluationContaminant_txtTarget").val("");
    $("#trPMEvaluationContaminant_txtMin").val("");
    $("#trPMEvaluationContaminant_txtMax").val("");
    $("#trPMEvaluationContaminant_txtResult").val("");
    $("#trPMEvaluationContaminant_txtStatus").val("NOT OK");
    $("#trPMEvaluationContaminant_txtDetail").val("");
    $("#trPMEvaluationContaminant_bitNotAnalyzed").prop("checked", false);

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


function p_UItrPMEvaluationVisualToData() {
    var dataArray = []; // Gunakan array JavaScript

    // Gunakan API DataTables untuk iterasi yang lebih aman
    tableVisual.rows().every(function () {
        var rowData = this.data(); // Dapatkan array data untuk baris ini

        // Pastikan rowData valid dan punya cukup elemen
        if (rowData && rowData.length > 15) {
            // Buat objek JavaScript dengan nama properti yang benar
            var rowObject = {
                // Gunakan INDEKS ASLI dari data
                trPMEvaluationVisual_txtPMEvaluationVisualID: rowData[1] || "", // Indeks 1: GUID
                trPMEvaluationVisual_intLineID: rowData[2] || 0,         // Indeks 2: LineNo
                trPMEvaluationVisual_intTestID: rowData[3] || 0,         // Indeks 3: TestID
                trPMEvaluationVisual_txtTestCode: rowData[4] || "",       // Indeks 4: TestCode
                trPMEvaluationVisual_txtTestClass: rowData[5] || "",      // Indeks 5: TestClass
                trPMEvaluationVisual_txtTestUnit: rowData[6] || "",       // Indeks 6: TestUnit
                trPMEvaluationVisual_txtTestMethodCode: rowData[7] || "", // Indeks 7: TestMethod
                trPMEvaluationVisual_txtTestType: rowData[8] || "",       // Indeks 8: TestType
                trPMEvaluationVisual_txtTarget: rowData[9] || "",         // Indeks 9: Target
                trPMEvaluationVisual_txtMin: rowData[10] || "",           // Indeks 10: Min
                trPMEvaluationVisual_txtMax: rowData[11] || "",           // Indeks 11: Max
                trPMEvaluationVisual_txtResult: rowData[12] || "",        // Indeks 12: Result
                trPMEvaluationVisual_txtStatus: rowData[13] || "NOT OK",  // Indeks 13: Status
                trPMEvaluationVisual_txtDetail: rowData[14] || "",        // Indeks 14: Detail
                // Ambil boolean dari indeks 15
                trPMEvaluationVisual_bitNotAnalyzed: (rowData[15] === true || String(rowData[15]).toLowerCase() === "true")
            };
            dataArray.push(rowObject); // Tambahkan objek ke array
        } else {
            console.warn("Skipping row due to insufficient data:", rowData);
        }
    });

    // Konversi array objek JavaScript menjadi string JSON
    if (dataArray.length > 0) {
        $("#txtHiddenDetailVisualObject").val(JSON.stringify(dataArray));
    } else {
        $("#txtHiddenDetailVisualObject").val("[]"); // Gunakan "[]" untuk array kosong
    }
}

function p_UItrPMEvaluationDimensionToData() {
    var dataArray = []; // Gunakan array JavaScript

    // Gunakan API DataTables untuk iterasi yang lebih aman
    tableDimension.rows().every(function () {
        var rowData = this.data(); // Dapatkan array data untuk baris ini

        // Pastikan rowData valid dan punya cukup elemen
        if (rowData && rowData.length > 15) {
            // Buat objek JavaScript dengan nama properti yang benar
            var rowObject = {
                // Gunakan INDEKS ASLI dari data
                trPMEvaluationDimension_txtPMEvaluationDimensionID: rowData[1] || "", // Indeks 1: GUID
                trPMEvaluationDimension_intLineID: rowData[2] || 0,         // Indeks 2: LineNo
                trPMEvaluationDimension_intTestID: rowData[3] || 0,         // Indeks 3: TestID
                trPMEvaluationDimension_txtTestCode: rowData[4] || "",       // Indeks 4: TestCode
                trPMEvaluationDimension_txtTestClass: rowData[5] || "",      // Indeks 5: TestClass
                trPMEvaluationDimension_txtTestUnit: rowData[6] || "",       // Indeks 6: TestUnit
                trPMEvaluationDimension_txtTestMethodCode: rowData[7] || "", // Indeks 7: TestMethod
                trPMEvaluationDimension_txtTestType: rowData[8] || "",       // Indeks 8: TestType
                trPMEvaluationDimension_txtTarget: rowData[9] || "",         // Indeks 9: Target
                trPMEvaluationDimension_txtMin: rowData[10] || "",           // Indeks 10: Min
                trPMEvaluationDimension_txtMax: rowData[11] || "",           // Indeks 11: Max
                trPMEvaluationDimension_txtResult: rowData[12] || "",        // Indeks 12: Result
                trPMEvaluationDimension_txtStatus: rowData[13] || "NOT OK",  // Indeks 13: Status
                trPMEvaluationDimension_txtDetail: rowData[14] || "",        // Indeks 14: Detail
                // Ambil boolean dari indeks 15
                trPMEvaluationDimension_bitNotAnalyzed: (rowData[15] === true || String(rowData[15]).toLowerCase() === "true")
            };
            dataArray.push(rowObject); // Tambahkan objek ke array
        } else {
            console.warn("Skipping row due to insufficient data:", rowData);
        }
    });

    // Konversi array objek JavaScript menjadi string JSON
    if (dataArray.length > 0) {
        $("#txtHiddenDetailDimensionObject").val(JSON.stringify(dataArray));
    } else {
        $("#txtHiddenDetailDimensionObject").val("[]"); // Gunakan "[]" untuk array kosong
    }
}

function p_UItrPMEvaluationMaterialToData() {
    var dataArray = []; // Gunakan array JavaScript

    // Gunakan API DataTables untuk iterasi yang lebih aman
    tableMaterial.rows().every(function () {
        var rowData = this.data(); // Dapatkan array data untuk baris ini

        // Pastikan rowData valid dan punya cukup elemen
        if (rowData && rowData.length > 15) {
            // Buat objek JavaScript dengan nama properti yang benar
            var rowObject = {
                // Gunakan INDEKS ASLI dari data
                trPMEvaluationMaterial_txtPMEvaluationMaterialID: rowData[1] || "", // Indeks 1: GUID
                trPMEvaluationMaterial_intLineID: rowData[2] || 0,         // Indeks 2: LineNo
                trPMEvaluationMaterial_intTestID: rowData[3] || 0,         // Indeks 3: TestID
                trPMEvaluationMaterial_txtTestCode: rowData[4] || "",       // Indeks 4: TestCode
                trPMEvaluationMaterial_txtTestClass: rowData[5] || "",      // Indeks 5: TestClass
                trPMEvaluationMaterial_txtTestUnit: rowData[6] || "",       // Indeks 6: TestUnit
                trPMEvaluationMaterial_txtTestMethodCode: rowData[7] || "", // Indeks 7: TestMethod
                trPMEvaluationMaterial_txtTestType: rowData[8] || "",       // Indeks 8: TestType
                trPMEvaluationMaterial_txtTarget: rowData[9] || "",         // Indeks 9: Target
                trPMEvaluationMaterial_txtMin: rowData[10] || "",           // Indeks 10: Min
                trPMEvaluationMaterial_txtMax: rowData[11] || "",           // Indeks 11: Max
                trPMEvaluationMaterial_txtResult: rowData[12] || "",        // Indeks 12: Result
                trPMEvaluationMaterial_txtStatus: rowData[13] || "NOT OK",  // Indeks 13: Status
                trPMEvaluationMaterial_txtDetail: rowData[14] || "",        // Indeks 14: Detail
                // Ambil boolean dari indeks 15
                trPMEvaluationMaterial_bitNotAnalyzed: (rowData[15] === true || String(rowData[15]).toLowerCase() === "true")
            };
            dataArray.push(rowObject); // Tambahkan objek ke array
        } else {
            console.warn("Skipping row due to insufficient data:", rowData);
        }
    });

    // Konversi array objek JavaScript menjadi string JSON
    if (dataArray.length > 0) {
        $("#txtHiddenDetailMaterialObject").val(JSON.stringify(dataArray));
    } else {
        $("#txtHiddenDetailMaterialObject").val("[]"); // Gunakan "[]" untuk array kosong
    }
}

function p_UItrPMEvaluationPackagingToData() {
    var dataArray = []; // Gunakan array JavaScript

    // Gunakan API DataTables untuk iterasi yang lebih aman
    tablePackaging.rows().every(function () {
        var rowData = this.data(); // Dapatkan array data untuk baris ini

        // Pastikan rowData valid dan punya cukup elemen
        if (rowData && rowData.length > 15) {
            // Buat objek JavaScript dengan nama properti yang benar
            var rowObject = {
                // Gunakan INDEKS ASLI dari data
                trPMEvaluationPackaging_txtPMEvaluationPackagingID: rowData[1] || "", // Indeks 1: GUID
                trPMEvaluationPackaging_intLineID: rowData[2] || 0,         // Indeks 2: LineNo
                trPMEvaluationPackaging_intTestID: rowData[3] || 0,         // Indeks 3: TestID
                trPMEvaluationPackaging_txtTestCode: rowData[4] || "",       // Indeks 4: TestCode
                trPMEvaluationPackaging_txtTestClass: rowData[5] || "",      // Indeks 5: TestClass
                trPMEvaluationPackaging_txtTestUnit: rowData[6] || "",       // Indeks 6: TestUnit
                trPMEvaluationPackaging_txtTestMethodCode: rowData[7] || "", // Indeks 7: TestMethod
                trPMEvaluationPackaging_txtTestType: rowData[8] || "",       // Indeks 8: TestType
                trPMEvaluationPackaging_txtTarget: rowData[9] || "",         // Indeks 9: Target
                trPMEvaluationPackaging_txtMin: rowData[10] || "",           // Indeks 10: Min
                trPMEvaluationPackaging_txtMax: rowData[11] || "",           // Indeks 11: Max
                trPMEvaluationPackaging_txtResult: rowData[12] || "",        // Indeks 12: Result
                trPMEvaluationPackaging_txtStatus: rowData[13] || "NOT OK",  // Indeks 13: Status
                trPMEvaluationPackaging_txtDetail: rowData[14] || "",        // Indeks 14: Detail
                // Ambil boolean dari indeks 15
                trPMEvaluationPackaging_bitNotAnalyzed: (rowData[15] === true || String(rowData[15]).toLowerCase() === "true")
            };
            dataArray.push(rowObject); // Tambahkan objek ke array
        } else {
            console.warn("Skipping row due to insufficient data:", rowData);
        }
    });

    // Konversi array objek JavaScript menjadi string JSON
    if (dataArray.length > 0) {
        $("#txtHiddenDetailPackagingObject").val(JSON.stringify(dataArray));
    } else {
        $("#txtHiddenDetailPackagingObject").val("[]"); // Gunakan "[]" untuk array kosong
    }
}

function p_UItrPMEvaluationContaminantToData() {
    var dataArray = []; // Gunakan array JavaScript

    // Gunakan API DataTables untuk iterasi yang lebih aman
    tableContaminant.rows().every(function () {
        var rowData = this.data(); // Dapatkan array data untuk baris ini

        // Pastikan rowData valid dan punya cukup elemen
        if (rowData && rowData.length > 15) {
            // Buat objek JavaScript dengan nama properti yang benar
            var rowObject = {
                // Gunakan INDEKS ASLI dari data
                trPMEvaluationContaminant_txtPMEvaluationContaminantID: rowData[1] || "", // Indeks 1: GUID
                trPMEvaluationContaminant_intLineID: rowData[2] || 0,         // Indeks 2: LineNo
                trPMEvaluationContaminant_intTestID: rowData[3] || 0,         // Indeks 3: TestID
                trPMEvaluationContaminant_txtTestCode: rowData[4] || "",       // Indeks 4: TestCode
                trPMEvaluationContaminant_txtTestClass: rowData[5] || "",      // Indeks 5: TestClass
                trPMEvaluationContaminant_txtTestUnit: rowData[6] || "",       // Indeks 6: TestUnit
                trPMEvaluationContaminant_txtTestMethodCode: rowData[7] || "", // Indeks 7: TestMethod
                trPMEvaluationContaminant_txtTestType: rowData[8] || "",       // Indeks 8: TestType
                trPMEvaluationContaminant_txtTarget: rowData[9] || "",         // Indeks 9: Target
                trPMEvaluationContaminant_txtMin: rowData[10] || "",           // Indeks 10: Min
                trPMEvaluationContaminant_txtMax: rowData[11] || "",           // Indeks 11: Max
                trPMEvaluationContaminant_txtResult: rowData[12] || "",        // Indeks 12: Result
                trPMEvaluationContaminant_txtStatus: rowData[13] || "NOT OK",  // Indeks 13: Status
                trPMEvaluationContaminant_txtDetail: rowData[14] || "",        // Indeks 14: Detail
                // Ambil boolean dari indeks 15
                trPMEvaluationContaminant_bitNotAnalyzed: (rowData[15] === true || String(rowData[15]).toLowerCase() === "true")
            };
            dataArray.push(rowObject); // Tambahkan objek ke array
        } else {
            console.warn("Skipping row due to insufficient data:", rowData);
        }
    });

    // Konversi array objek JavaScript menjadi string JSON
    if (dataArray.length > 0) {
        $("#txtHiddenDetailContaminantObject").val(JSON.stringify(dataArray));
    } else {
        $("#txtHiddenDetailContaminantObject").val("[]"); // Gunakan "[]" untuk array kosong
    }
}

//function p_UItrPMEvaluationVisualToData() {
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
//            trPMEvaluationVisual_txtPMEvaluationVisualID: getCellValue(cells[2]),
//            trPMEvaluationVisual_intLineID: getCellValue(cells[3]),
//            trPMEvaluationVisual_intTestID: getCellValue(cells[4]),
//            trPMEvaluationVisual_txtTestCode: getCellValue(cells[5]),
//            trPMEvaluationVisual_txtTestClass: getCellValue(cells[6]),
//            trPMEvaluationVisual_txtTestUnit: getCellValue(cells[7]),
//            trPMEvaluationVisual_txtTestMethodCode: getCellValue(cells[8]),
//            trPMEvaluationVisual_txtTestType: getCellValue(cells[9]),
//            trPMEvaluationVisual_txtTarget: getCellValue(cells[10]),
//            trPMEvaluationVisual_txtMin: getCellValue(cells[11]),
//            trPMEvaluationVisual_txtMax: getCellValue(cells[12]),
//            trPMEvaluationVisual_txtResult: getCellValue(cells[13]),
//            trPMEvaluationVisual_txtStatus: getCellValue(cells[14]),
//            trPMEvaluationVisual_txtDetail: getCellValue(cells[15]),
//            trPMEvaluationVisual_bitNotAnalyzed: getCellValue(cells[16], true)
//        };

//        jsonArray.push(jsonObj);
//    });

//    $('#txtHiddenDetailVisualObject').val(
//        jsonArray.length > 0 ? JSON.stringify(jsonArray) : ''
//    );
//}


function editRowVisual(data) {
    try {
        // Ambil data baris sekali saja menggunakan closest('tr') dan row().data()
        var row = tableVisual.row($(data).closest('tr'));
        var rowData = row.data();

        // Pastikan rowData ada sebelum melanjutkan
        if (!rowData) {
            console.error("Could not retrieve row data for editing.");
            clsGlobal.getAlert("Error retrieving data for edit.");
            return;
        }

        // --- Mengisi field modal dengan data dari rowData menggunakan indeks yang BENAR ---
        $('#trPMEvaluationVisual_txtPMEvaluationVisualID').val(rowData[1]); // <-- Index 1 (GUID)
        $('#trPMEvaluationVisual_intLineID').val(rowData[2]);            // <-- Index 2 (LineNo)
        $('#trPMEvaluationVisual_intTestID').val(rowData[3]);            // <-- Index 3 (TestID)
        $('#trPMEvaluationVisual_txtTestCode').val(rowData[4]);          // <-- Index 4 (TestCode)
        $('#trPMEvaluationVisual_txtTestClass').val(rowData[5]);         // <-- Index 5 (TestClass)
        $('#trPMEvaluationVisual_txtTestUnit').val(rowData[6]);          // <-- Index 6 (TestUnit)
        $('#trPMEvaluationVisual_txtTestMethodCode').val(rowData[7]);    // <-- Index 7 (TestMethod)
        $('#trPMEvaluationVisual_txtTestType').val(rowData[8]);          // <-- Index 8 (TestType)
        $('#trPMEvaluationVisual_txtTarget').val(rowData[9]);           // <-- Index 9 (Target) - Pastikan format desimal jika perlu
        $('#trPMEvaluationVisual_txtMin').val(rowData[10]);             // <-- Index 10 (Min) - Pastikan format desimal jika perlu
        $('#trPMEvaluationVisual_txtMax').val(rowData[11]);             // <-- Index 11 (Max) - Pastikan format desimal jika perlu
        $('#trPMEvaluationVisual_txtResult').val(rowData[12]);          // <-- Index 12 (Result) - Pastikan format desimal jika perlu
        $('#trPMEvaluationVisual_txtStatus').val(rowData[13]);          // <-- Index 13 (Status)
        $('#trPMEvaluationVisual_txtDetail').val(rowData[14]);          // <-- Index 14 (Detail)

        var isNotAnalyzed = rowData[15];                                 // <-- Index 15 (bitNotAnalyzed)
        // Pastikan konversi ke boolean benar
        $('#trPMEvaluationVisual_bitNotAnalyzed').prop("checked", isNotAnalyzed === true || String(isNotAnalyzed).toLowerCase() === "true");

        // Set state modal ke 'EDIT'
        $('#SaveEditDetailVisual').val("EDIT");
        // p_UItrPMEvaluationVisualToData(); // Seharusnya tidak perlu di sini, dipanggil saat save

        // Tampilkan modal
        $('#modalVisual').modal('show');

        // --- Bagian logic untuk enable/disable field berdasarkan TestType ---
        // Panggil fungsi formatDecimal jika perlu untuk memastikan tampilan awal benar
        formatDecimalIfNeeded($('#trPMEvaluationVisual_txtTarget')[0]);
        formatDecimalIfNeeded($('#trPMEvaluationVisual_txtMin')[0]);
        formatDecimalIfNeeded($('#trPMEvaluationVisual_txtMax')[0]);
        formatDecimalIfNeeded($('#trPMEvaluationVisual_txtResult')[0]);

        var testType = $('#trPMEvaluationVisual_txtTestType').val();

        if (testType == "N") {
            $('#btnLOVtxtTarget').prop('disabled', true);
            $('#trPMEvaluationVisual_txtTarget').removeAttr('readonly');
            $('#btnLOVtxtResult').prop('disabled', true);
            $('#trPMEvaluationVisual_txtResult').removeAttr('readonly');
            $('#btnLOVtxtMin').prop('disabled', true);
            $('#trPMEvaluationVisual_txtMin').removeAttr('readonly');
            $('#btnLOVtxtMax').prop('disabled', true);
            $('#trPMEvaluationVisual_txtMax').removeAttr('readonly');

            // Tambah event (pastikan tidak duplikat jika modal dibuka berkali-kali)
            $('#trPMEvaluationVisual_txtTarget').off('input blur').on('input', function () { formatDecimal(this); }).on('blur', onBlurFormatDecimal);
            $('#trPMEvaluationVisual_txtResult').off('input blur').on('input', function () { formatDecimal(this); }).on('blur', onBlurFormatDecimal);
            $('#trPMEvaluationVisual_txtMin').off('input blur').on('input', function () { formatDecimal(this); }).on('blur', onBlurFormatDecimal);
            $('#trPMEvaluationVisual_txtMax').off('input blur').on('input', function () { formatDecimal(this); }).on('blur', onBlurFormatDecimal);

        } else if (testType == "T") {
            $('#btnLOVtxtTarget').prop('disabled', false);
            $('#trPMEvaluationVisual_txtTarget').attr('readonly', true);
            $('#btnLOVtxtResult').prop('disabled', false);
            $('#trPMEvaluationVisual_txtResult').attr('readonly', true);
            $('#btnLOVtxtMin').prop('disabled', false);
            $('#trPMEvaluationVisual_txtMin').attr('readonly', true);
            $('#btnLOVtxtMax').prop('disabled', false);
            $('#trPMEvaluationVisual_txtMax').attr('readonly', true);

            // Hapus event format
            $('#trPMEvaluationVisual_txtTarget, #trPMEvaluationVisual_txtResult, #trPMEvaluationVisual_txtMin, #trPMEvaluationVisual_txtMax').off('input blur');

        } else { // Asumsi default atau tipe V
            $('#btnLOVtxtTarget').prop('disabled', false);
            $('#trPMEvaluationVisual_txtTarget').attr('readonly', true);
            $('#btnLOVtxtResult').prop('disabled', false);
            $('#trPMEvaluationVisual_txtResult').attr('readonly', true);
            $('#btnLOVtxtMin').prop('disabled', true);
            $('#trPMEvaluationVisual_txtMin').attr('readonly', true);
            $('#btnLOVtxtMax').prop('disabled', true);
            $('#trPMEvaluationVisual_txtMax').attr('readonly', true);

            // Hapus event format
            $('#trPMEvaluationVisual_txtTarget, #trPMEvaluationVisual_txtResult, #trPMEvaluationVisual_txtMin, #trPMEvaluationVisual_txtMax').off('input blur');
        }

    } catch (ex) {
        console.error("Error in editRowVisual:", ex);
        clsGlobal.showAlert("An error occurred while preparing the edit form.");
    }
};

// --- Helper Functions (Tambahkan ini jika belum ada) ---

 //Fungsi untuk memformat angka saat blur (tambahkan .000... jika integer)
//function onBlurFormatDecimal() {
//    let input = this;
//    let value = input.value.replace(/,/g, '');
//    if (value === '' || isNaN(parseFloat(value))) return; // Jangan format jika kosong atau bukan angka

//    if (value.includes('.')) {
//        // Jika sudah ada desimal, pastikan formatnya benar (misal, padding zero)
//        let [intPart, decPart = ''] = value.split('.');
//        decPart = decPart.padEnd(9, '0').substring(0, 9); // Sesuaikan jumlah desimal
//        intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
//        input.value = `${intPart}.${decPart}`;
//    } else {
//        // Jika integer, tambahkan .000...
//        let number = parseFloat(value);
//        if (!isNaN(number)) {
//            let intPart = Math.floor(number).toString();
//            intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
//            input.value = `${intPart}.000000000`; // Sesuaikan jumlah desimal
//        }
//    }
//}
function onBlurFormatDecimal() {
    let input = this;
    let value = input.value.replace(/,/g, '');

    if (value === '' || isNaN(parseFloat(value))) return;

    // Jika ada titik desimal
    if (value.includes('.')) {
        let [intPart, decPart = ''] = value.split('.');

        // Batasi maksimal 2 digit
        decPart = decPart.substring(0, 2);

        // Jika cuma 1 digit, tambahkan 0 (opsional)
        decPart = decPart.padEnd(2, '0');

        // Format integer
        intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        input.value = `${intPart}.${decPart}`;
    }
    else {
        // Jika integer → tambahkan .00
        let number = parseFloat(value);
        if (!isNaN(number)) {
            let intPart = Math.floor(number).toString();
            intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            input.value = `${intPart}.00`;
        }
    }
}


// Fungsi untuk memastikan format desimal saat mengisi field dari data tabel
function formatDecimalIfNeeded(input) {
    if ($(input).attr('readonly')) return; // Jangan format jika readonly

    let value = input.value;
    if (value === '' || isNaN(parseFloat(value.replace(/,/g, '')))) return; // Jangan format jika kosong atau bukan angka

    // Cek apakah ini tipe Numerik (N)
    var testTypeInputId = input.id.replace('_txtTarget', '_txtTestType')
        .replace('_txtMin', '_txtTestType')
        .replace('_txtMax', '_txtTestType')
        .replace('_txtResult', '_txtTestType');
    var testType = $('#' + testTypeInputId).val();

    if (testType === 'N') {
        let cleanValue = value.replace(/,/g, '');
        let number = parseFloat(cleanValue);
        if (!isNaN(number)) {
            let parts = cleanValue.split('.');
            let intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            let decPart = (parts[1] || '').padEnd(9, '0').substring(0, 9); // Sesuaikan jumlah desimal
            input.value = `${intPart}.${decPart}`;
        }
    }
    // Untuk tipe T atau V, biarkan apa adanya (tidak diformat numerik)
}

// --- FUNGSI EDIT UNTUK TAB DIMENSION ---
function editRowDimension(data) {
    try {
        var row = tableDimension.row($(data).closest('tr'));
        var rowData = row.data();

        if (!rowData) {
            console.error("Could not retrieve row data for editing (Dimension).");
            clsGlobal.getAlert("Error retrieving data for edit.");
            return;
        }

        $('#trPMEvaluationDimension_txtPMEvaluationDimensionID').val(rowData[1]); // <-- Index 1
        $('#trPMEvaluationDimension_intLineID').val(rowData[2]);            // <-- Index 2
        $('#trPMEvaluationDimension_intTestID').val(rowData[3]);            // <-- Index 3
        $('#trPMEvaluationDimension_txtTestCode').val(rowData[4]);          // <-- Index 4
        $('#trPMEvaluationDimension_txtTestClass').val(rowData[5]);         // <-- Index 5
        $('#trPMEvaluationDimension_txtTestUnit').val(rowData[6]);          // <-- Index 6
        $('#trPMEvaluationDimension_txtTestMethodCode').val(rowData[7]);    // <-- Index 7
        $('#trPMEvaluationDimension_txtTestType').val(rowData[8]);          // <-- Index 8
        $('#trPMEvaluationDimension_txtTarget').val(rowData[9]);           // <-- Index 9
        $('#trPMEvaluationDimension_txtMin').val(rowData[10]);             // <-- Index 10
        $('#trPMEvaluationDimension_txtMax').val(rowData[11]);             // <-- Index 11
        $('#trPMEvaluationDimension_txtResult').val(rowData[12]);          // <-- Index 12
        $('#trPMEvaluationDimension_txtStatus').val(rowData[13]);          // <-- Index 13
        $('#trPMEvaluationDimension_txtDetail').val(rowData[14]);          // <-- Index 14

        var isNotAnalyzed = rowData[15];                                    // <-- Index 15
        $('#trPMEvaluationDimension_bitNotAnalyzed').prop("checked", isNotAnalyzed === true || String(isNotAnalyzed).toLowerCase() === "true");

        $('#SaveEditDetailDimension').val("EDIT");
        $('#modalDimension').modal('show');

        // Format desimal awal
        formatDecimalIfNeeded($('#trPMEvaluationDimension_txtTarget')[0]);
        formatDecimalIfNeeded($('#trPMEvaluationDimension_txtMin')[0]);
        formatDecimalIfNeeded($('#trPMEvaluationDimension_txtMax')[0]);
        formatDecimalIfNeeded($('#trPMEvaluationDimension_txtResult')[0]);

        var testType = $('#trPMEvaluationDimension_txtTestType').val();

        if (testType == "N") {
            $('#btnLOVtxtTargetDimension').prop('disabled', true);
            $('#trPMEvaluationDimension_txtTarget').removeAttr('readonly');
            $('#btnLOVtxtResultDimension').prop('disabled', true);
            $('#trPMEvaluationDimension_txtResult').removeAttr('readonly');
            $('#btnLOVtxtMinDimension').prop('disabled', true);
            $('#trPMEvaluationDimension_txtMin').removeAttr('readonly');
            $('#btnLOVtxtMaxDimension').prop('disabled', true);
            $('#trPMEvaluationDimension_txtMax').removeAttr('readonly');

            $('#trPMEvaluationDimension_txtTarget').off('input blur').on('input', function () { formatDecimal(this); }).on('blur', onBlurFormatDecimal);
            $('#trPMEvaluationDimension_txtResult').off('input blur').on('input', function () { formatDecimal(this); }).on('blur', onBlurFormatDecimal);
            $('#trPMEvaluationDimension_txtMin').off('input blur').on('input', function () { formatDecimal(this); }).on('blur', onBlurFormatDecimal);
            $('#trPMEvaluationDimension_txtMax').off('input blur').on('input', function () { formatDecimal(this); }).on('blur', onBlurFormatDecimal);

        } else if (testType == "T") {
            $('#btnLOVtxtTargetDimension').prop('disabled', false);
            $('#trPMEvaluationDimension_txtTarget').attr('readonly', true);
            $('#btnLOVtxtResultDimension').prop('disabled', false);
            $('#trPMEvaluationDimension_txtResult').attr('readonly', true);
            $('#btnLOVtxtMinDimension').prop('disabled', false);
            $('#trPMEvaluationDimension_txtMin').attr('readonly', true);
            $('#btnLOVtxtMaxDimension').prop('disabled', false);
            $('#trPMEvaluationDimension_txtMax').attr('readonly', true);

            $('#trPMEvaluationDimension_txtTarget, #trPMEvaluationDimension_txtResult, #trPMEvaluationDimension_txtMin, #trPMEvaluationDimension_txtMax').off('input blur');

        } else {
            $('#btnLOVtxtTargetDimension').prop('disabled', false);
            $('#trPMEvaluationDimension_txtTarget').attr('readonly', true);
            $('#btnLOVtxtResultDimension').prop('disabled', false);
            $('#trPMEvaluationDimension_txtResult').attr('readonly', true);
            $('#btnLOVtxtMinDimension').prop('disabled', true);
            $('#trPMEvaluationDimension_txtMin').attr('readonly', true);
            $('#btnLOVtxtMaxDimension').prop('disabled', true);
            $('#trPMEvaluationDimension_txtMax').attr('readonly', true);

            $('#trPMEvaluationDimension_txtTarget, #trPMEvaluationDimension_txtResult, #trPMEvaluationDimension_txtMin, #trPMEvaluationDimension_txtMax').off('input blur');
        }

    } catch (ex) {
        console.error("Error in editRowDimension:", ex);
        clsGlobal.showAlert("An error occurred while preparing the edit form.");
    }
};

// --- FUNGSI EDIT UNTUK TAB MATERIAL ---
function editRowMaterial(data) {
    try {
        var row = tableMaterial.row($(data).closest('tr'));
        var rowData = row.data();

        if (!rowData) {
            console.error("Could not retrieve row data for editing (Material).");
            clsGlobal.getAlert("Error retrieving data for edit.");
            return;
        }

        $('#trPMEvaluationMaterial_txtPMEvaluationMaterialID').val(rowData[1]); // <-- Index 1
        $('#trPMEvaluationMaterial_intLineID').val(rowData[2]);            // <-- Index 2
        $('#trPMEvaluationMaterial_intTestID').val(rowData[3]);            // <-- Index 3
        $('#trPMEvaluationMaterial_txtTestCode').val(rowData[4]);          // <-- Index 4
        $('#trPMEvaluationMaterial_txtTestClass').val(rowData[5]);         // <-- Index 5
        $('#trPMEvaluationMaterial_txtTestUnit').val(rowData[6]);          // <-- Index 6
        $('#trPMEvaluationMaterial_txtTestMethodCode').val(rowData[7]);    // <-- Index 7
        $('#trPMEvaluationMaterial_txtTestType').val(rowData[8]);          // <-- Index 8
        $('#trPMEvaluationMaterial_txtTarget').val(rowData[9]);           // <-- Index 9
        $('#trPMEvaluationMaterial_txtMin').val(rowData[10]);             // <-- Index 10
        $('#trPMEvaluationMaterial_txtMax').val(rowData[11]);             // <-- Index 11
        $('#trPMEvaluationMaterial_txtResult').val(rowData[12]);          // <-- Index 12
        $('#trPMEvaluationMaterial_txtStatus').val(rowData[13]);          // <-- Index 13
        $('#trPMEvaluationMaterial_txtDetail').val(rowData[14]);          // <-- Index 14

        var isNotAnalyzed = rowData[15];                                    // <-- Index 15
        $('#trPMEvaluationMaterial_bitNotAnalyzed').prop("checked", isNotAnalyzed === true || String(isNotAnalyzed).toLowerCase() === "true");

        $('#SaveEditDetailMaterial').val("EDIT");
        $('#modalMaterial').modal('show');

        // Format desimal awal
        formatDecimalIfNeeded($('#trPMEvaluationMaterial_txtTarget')[0]);
        formatDecimalIfNeeded($('#trPMEvaluationMaterial_txtMin')[0]);
        formatDecimalIfNeeded($('#trPMEvaluationMaterial_txtMax')[0]);
        formatDecimalIfNeeded($('#trPMEvaluationMaterial_txtResult')[0]);

        var testType = $('#trPMEvaluationMaterial_txtTestType').val();

        if (testType == "N") {
            $('#btnLOVtxtTargetMaterial').prop('disabled', true);
            $('#trPMEvaluationMaterial_txtTarget').removeAttr('readonly');
            $('#btnLOVtxtResultMaterial').prop('disabled', true);
            $('#trPMEvaluationMaterial_txtResult').removeAttr('readonly');
            $('#btnLOVtxtMinMaterial').prop('disabled', true);
            $('#trPMEvaluationMaterial_txtMin').removeAttr('readonly');
            $('#btnLOVtxtMaxMaterial').prop('disabled', true);
            $('#trPMEvaluationMaterial_txtMax').removeAttr('readonly');

            $('#trPMEvaluationMaterial_txtTarget').off('input blur').on('input', function () { formatDecimal(this); }).on('blur', onBlurFormatDecimal);
            $('#trPMEvaluationMaterial_txtResult').off('input blur').on('input', function () { formatDecimal(this); }).on('blur', onBlurFormatDecimal);
            $('#trPMEvaluationMaterial_txtMin').off('input blur').on('input', function () { formatDecimal(this); }).on('blur', onBlurFormatDecimal);
            $('#trPMEvaluationMaterial_txtMax').off('input blur').on('input', function () { formatDecimal(this); }).on('blur', onBlurFormatDecimal);

        } else if (testType == "T") {
            $('#btnLOVtxtTargetMaterial').prop('disabled', false);
            $('#trPMEvaluationMaterial_txtTarget').attr('readonly', true);
            $('#btnLOVtxtResultMaterial').prop('disabled', false);
            $('#trPMEvaluationMaterial_txtResult').attr('readonly', true);
            $('#btnLOVtxtMinMaterial').prop('disabled', false);
            $('#trPMEvaluationMaterial_txtMin').attr('readonly', true);
            $('#btnLOVtxtMaxMaterial').prop('disabled', false);
            $('#trPMEvaluationMaterial_txtMax').attr('readonly', true);

            $('#trPMEvaluationMaterial_txtTarget, #trPMEvaluationMaterial_txtResult, #trPMEvaluationMaterial_txtMin, #trPMEvaluationMaterial_txtMax').off('input blur');

        } else {
            $('#btnLOVtxtTargetMaterial').prop('disabled', false);
            $('#trPMEvaluationMaterial_txtTarget').attr('readonly', true);
            $('#btnLOVtxtResultMaterial').prop('disabled', false);
            $('#trPMEvaluationMaterial_txtResult').attr('readonly', true);
            $('#btnLOVtxtMinMaterial').prop('disabled', true);
            $('#trPMEvaluationMaterial_txtMin').attr('readonly', true);
            $('#btnLOVtxtMaxMaterial').prop('disabled', true);
            $('#trPMEvaluationMaterial_txtMax').attr('readonly', true);

            $('#trPMEvaluationMaterial_txtTarget, #trPMEvaluationMaterial_txtResult, #trPMEvaluationMaterial_txtMin, #trPMEvaluationMaterial_txtMax').off('input blur');
        }

    } catch (ex) {
        console.error("Error in editRowMaterial:", ex);
        clsGlobal.showAlert("An error occurred while preparing the edit form.");
    }
};

// --- FUNGSI EDIT UNTUK TAB PACKAGING ---
function editRowPackaging(data) {
    try {
        var row = tablePackaging.row($(data).closest('tr'));
        var rowData = row.data();

        if (!rowData) {
            console.error("Could not retrieve row data for editing (Packaging).");
            clsGlobal.getAlert("Error retrieving data for edit.");
            return;
        }

        $('#trPMEvaluationPackaging_txtPMEvaluationPackagingID').val(rowData[1]); // <-- Index 1
        $('#trPMEvaluationPackaging_intLineID').val(rowData[2]);            // <-- Index 2
        $('#trPMEvaluationPackaging_intTestID').val(rowData[3]);            // <-- Index 3
        $('#trPMEvaluationPackaging_txtTestCode').val(rowData[4]);          // <-- Index 4
        $('#trPMEvaluationPackaging_txtTestClass').val(rowData[5]);         // <-- Index 5
        $('#trPMEvaluationPackaging_txtTestUnit').val(rowData[6]);          // <-- Index 6
        $('#trPMEvaluationPackaging_txtTestMethodCode').val(rowData[7]);    // <-- Index 7
        $('#trPMEvaluationPackaging_txtTestType').val(rowData[8]);          // <-- Index 8
        $('#trPMEvaluationPackaging_txtTarget').val(rowData[9]);           // <-- Index 9
        $('#trPMEvaluationPackaging_txtMin').val(rowData[10]);             // <-- Index 10
        $('#trPMEvaluationPackaging_txtMax').val(rowData[11]);             // <-- Index 11
        $('#trPMEvaluationPackaging_txtResult').val(rowData[12]);          // <-- Index 12
        $('#trPMEvaluationPackaging_txtStatus').val(rowData[13]);          // <-- Index 13
        $('#trPMEvaluationPackaging_txtDetail').val(rowData[14]);          // <-- Index 14

        var isNotAnalyzed = rowData[15];                                    // <-- Index 15
        $('#trPMEvaluationPackaging_bitNotAnalyzed').prop("checked", isNotAnalyzed === true || String(isNotAnalyzed).toLowerCase() === "true");

        $('#SaveEditDetailPackaging').val("EDIT");
        $('#modalPackaging').modal('show');

        // Format desimal awal
        formatDecimalIfNeeded($('#trPMEvaluationPackaging_txtTarget')[0]);
        formatDecimalIfNeeded($('#trPMEvaluationPackaging_txtMin')[0]);
        formatDecimalIfNeeded($('#trPMEvaluationPackaging_txtMax')[0]);
        formatDecimalIfNeeded($('#trPMEvaluationPackaging_txtResult')[0]);

        var testType = $('#trPMEvaluationPackaging_txtTestType').val();

        if (testType == "N") {
            $('#btnLOVtxtTargetPackaging').prop('disabled', true);
            $('#trPMEvaluationPackaging_txtTarget').removeAttr('readonly');
            $('#btnLOVtxtResultPackaging').prop('disabled', true);
            $('#trPMEvaluationPackaging_txtResult').removeAttr('readonly');
            $('#btnLOVtxtMinPackaging').prop('disabled', true);
            $('#trPMEvaluationPackaging_txtMin').removeAttr('readonly');
            $('#btnLOVtxtMaxPackaging').prop('disabled', true);
            $('#trPMEvaluationPackaging_txtMax').removeAttr('readonly');

            $('#trPMEvaluationPackaging_txtTarget').off('input blur').on('input', function () { formatDecimal(this); }).on('blur', onBlurFormatDecimal);
            $('#trPMEvaluationPackaging_txtResult').off('input blur').on('input', function () { formatDecimal(this); }).on('blur', onBlurFormatDecimal);
            $('#trPMEvaluationPackaging_txtMin').off('input blur').on('input', function () { formatDecimal(this); }).on('blur', onBlurFormatDecimal);
            $('#trPMEvaluationPackaging_txtMax').off('input blur').on('input', function () { formatDecimal(this); }).on('blur', onBlurFormatDecimal);

        } else if (testType == "T") {
            $('#btnLOVtxtTargetPackaging').prop('disabled', false);
            $('#trPMEvaluationPackaging_txtTarget').attr('readonly', true);
            $('#btnLOVtxtResultPackaging').prop('disabled', false);
            $('#trPMEvaluationPackaging_txtResult').attr('readonly', true);
            $('#btnLOVtxtMinPackaging').prop('disabled', false);
            $('#trPMEvaluationPackaging_txtMin').attr('readonly', true);
            $('#btnLOVtxtMaxPackaging').prop('disabled', false);
            $('#trPMEvaluationPackaging_txtMax').attr('readonly', true);

            $('#trPMEvaluationPackaging_txtTarget, #trPMEvaluationPackaging_txtResult, #trPMEvaluationPackaging_txtMin, #trPMEvaluationPackaging_txtMax').off('input blur');

        } else {
            $('#btnLOVtxtTargetPackaging').prop('disabled', false);
            $('#trPMEvaluationPackaging_txtTarget').attr('readonly', true);
            $('#btnLOVtxtResultPackaging').prop('disabled', false);
            $('#trPMEvaluationPackaging_txtResult').attr('readonly', true);
            $('#btnLOVtxtMinPackaging').prop('disabled', true);
            $('#trPMEvaluationPackaging_txtMin').attr('readonly', true);
            $('#btnLOVtxtMaxPackaging').prop('disabled', true);
            $('#trPMEvaluationPackaging_txtMax').attr('readonly', true);

            $('#trPMEvaluationPackaging_txtTarget, #trPMEvaluationPackaging_txtResult, #trPMEvaluationPackaging_txtMin, #trPMEvaluationPackaging_txtMax').off('input blur');
        }

    } catch (ex) {
        console.error("Error in editRowPackaging:", ex);
        clsGlobal.showAlert("An error occurred while preparing the edit form.");
    }
};

// --- FUNGSI EDIT UNTUK TAB CONTAMINANT ---
function editRowContaminant(data) {
    try {
        var row = tableContaminant.row($(data).closest('tr'));
        var rowData = row.data();

        if (!rowData) {
            console.error("Could not retrieve row data for editing (Contaminant).");
            clsGlobal.getAlert("Error retrieving data for edit.");
            return;
        }

        $('#trPMEvaluationContaminant_txtPMEvaluationContaminantID').val(rowData[1]); // <-- Index 1
        $('#trPMEvaluationContaminant_intLineID').val(rowData[2]);            // <-- Index 2
        $('#trPMEvaluationContaminant_intTestID').val(rowData[3]);            // <-- Index 3
        $('#trPMEvaluationContaminant_txtTestCode').val(rowData[4]);          // <-- Index 4
        $('#trPMEvaluationContaminant_txtTestClass').val(rowData[5]);         // <-- Index 5
        $('#trPMEvaluationContaminant_txtTestUnit').val(rowData[6]);          // <-- Index 6
        $('#trPMEvaluationContaminant_txtTestMethodCode').val(rowData[7]);    // <-- Index 7
        $('#trPMEvaluationContaminant_txtTestType').val(rowData[8]);          // <-- Index 8
        $('#trPMEvaluationContaminant_txtTarget').val(rowData[9]);           // <-- Index 9
        $('#trPMEvaluationContaminant_txtMin').val(rowData[10]);             // <-- Index 10
        $('#trPMEvaluationContaminant_txtMax').val(rowData[11]);             // <-- Index 11
        $('#trPMEvaluationContaminant_txtResult').val(rowData[12]);          // <-- Index 12
        $('#trPMEvaluationContaminant_txtStatus').val(rowData[13]);          // <-- Index 13
        $('#trPMEvaluationContaminant_txtDetail').val(rowData[14]);          // <-- Index 14

        var isNotAnalyzed = rowData[15];                                    // <-- Index 15
        $('#trPMEvaluationContaminant_bitNotAnalyzed').prop("checked", isNotAnalyzed === true || String(isNotAnalyzed).toLowerCase() === "true");

        $('#SaveEditDetailContaminant').val("EDIT");
        $('#modalContaminant').modal('show');

        // Format desimal awal
        formatDecimalIfNeeded($('#trPMEvaluationContaminant_txtTarget')[0]);
        formatDecimalIfNeeded($('#trPMEvaluationContaminant_txtMin')[0]);
        formatDecimalIfNeeded($('#trPMEvaluationContaminant_txtMax')[0]);
        formatDecimalIfNeeded($('#trPMEvaluationContaminant_txtResult')[0]);

        var testType = $('#trPMEvaluationContaminant_txtTestType').val();

        if (testType == "N") {
            $('#btnLOVtxtTargetContaminant').prop('disabled', true);
            $('#trPMEvaluationContaminant_txtTarget').removeAttr('readonly');
            $('#btnLOVtxtResultContaminant').prop('disabled', true);
            $('#trPMEvaluationContaminant_txtResult').removeAttr('readonly');
            $('#btnLOVtxtMinContaminant').prop('disabled', true);
            $('#trPMEvaluationContaminant_txtMin').removeAttr('readonly');
            $('#btnLOVtxtMaxContaminant').prop('disabled', true);
            $('#trPMEvaluationContaminant_txtMax').removeAttr('readonly');

            $('#trPMEvaluationContaminant_txtTarget').off('input blur').on('input', function () { formatDecimal(this); }).on('blur', onBlurFormatDecimal);
            $('#trPMEvaluationContaminant_txtResult').off('input blur').on('input', function () { formatDecimal(this); }).on('blur', onBlurFormatDecimal);
            $('#trPMEvaluationContaminant_txtMin').off('input blur').on('input', function () { formatDecimal(this); }).on('blur', onBlurFormatDecimal);
            $('#trPMEvaluationContaminant_txtMax').off('input blur').on('input', function () { formatDecimal(this); }).on('blur', onBlurFormatDecimal);

        } else if (testType == "T") {
            $('#btnLOVtxtTargetContaminant').prop('disabled', false);
            $('#trPMEvaluationContaminant_txtTarget').attr('readonly', true);
            $('#btnLOVtxtResultContaminant').prop('disabled', false);
            $('#trPMEvaluationContaminant_txtResult').attr('readonly', true);
            $('#btnLOVtxtMinContaminant').prop('disabled', false);
            $('#trPMEvaluationContaminant_txtMin').attr('readonly', true);
            $('#btnLOVtxtMaxContaminant').prop('disabled', false);
            $('#trPMEvaluationContaminant_txtMax').attr('readonly', true);

            $('#trPMEvaluationContaminant_txtTarget, #trPMEvaluationContaminant_txtResult, #trPMEvaluationContaminant_txtMin, #trPMEvaluationContaminant_txtMax').off('input blur');

        } else {
            $('#btnLOVtxtTargetContaminant').prop('disabled', false);
            $('#trPMEvaluationContaminant_txtTarget').attr('readonly', true);
            $('#btnLOVtxtResultContaminant').prop('disabled', false);
            $('#trPMEvaluationContaminant_txtResult').attr('readonly', true);
            $('#btnLOVtxtMinContaminant').prop('disabled', true);
            $('#trPMEvaluationContaminant_txtMin').attr('readonly', true);
            $('#btnLOVtxtMaxContaminant').prop('disabled', true);
            $('#trPMEvaluationContaminant_txtMax').attr('readonly', true);

            $('#trPMEvaluationContaminant_txtTarget, #trPMEvaluationContaminant_txtResult, #trPMEvaluationContaminant_txtMin, #trPMEvaluationContaminant_txtMax').off('input blur');
        }

    } catch (ex) {
        console.error("Error in editRowContaminant:", ex);
        clsGlobal.showAlert("An error occurred while preparing the edit form.");
    }
};


// --- Helper Functions (Pastikan ini ada di kode Anda) ---

// Fungsi ini MUNGKIN SUDAH ADA di kode Anda, pastikan hanya ada satu.
function formatDecimal(input) {
    let value = input.value;

    // Simpan posisi kursor
    let selectionStart = input.selectionStart;
    let originalLength = value.length;

    // Bersihkan nilai: hapus koma dan karakter non-numerik (kecuali titik)
    let clean = value.replace(/,/g, '').replace(/[^0-9.]/g, '');

    // Cek jika ada titik di akhir dan itu satu-satunya titik
    const hasTrailingDot = clean.endsWith('.') && (clean.match(/\./g) || []).length === 1;

    // Pisahkan bagian integer dan desimal
    const parts = clean.split('.');
    let intPart = parts[0];
    let decPart = parts[1] || '';

    // Handle jika ada lebih dari satu titik
    if (parts.length > 2) {
        decPart = parts.slice(1).join(''); // Gabungkan semua setelah titik pertama
    }

    // Batasi panjang desimal (misalnya 9 digit)
    decPart = decPart.substring(0, 2);

    // Format bagian integer dengan koma ribuan
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Gabungkan kembali
    let formatted = decPart.length > 0
        ? `${intPart}.${decPart}`
        : (hasTrailingDot ? `${intPart}.` : (intPart === '' && value.includes('.') ? '0.' : intPart)); // Handle kasus ".123" -> "0.123"

    // Set nilai baru ke input
    input.value = formatted;

    // Setel ulang posisi kursor
    let newLength = input.value.length;
    let newCursorPos = selectionStart + (newLength - originalLength);
    // Pastikan posisi kursor valid
    newCursorPos = Math.max(0, Math.min(newCursorPos, newLength));
    input.setSelectionRange(newCursorPos, newCursorPos);
}

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

//function validateFormTabVisual() {
//    let isValid = true;
//    const errorMessages = [];

//    const fieldDisplayNames = {
//        'trPMEvaluationVisual_txtTestCode': 'Test Code',
//        'trPMEvaluationVisual_txtTestClass': 'Test Class',
//        'trPMEvaluationVisual_txtTestMethodCode': 'Test Method',
//        'trPMEvaluationVisual_txtTestType': 'Test Type',
//    };


//    const requiredFields = [
//        'trPMEvaluationVisual_txtTestCode', 'trPMEvaluationVisual_txtTestClass', 'trPMEvaluationVisual_txtTestMethodCode', 'trPMEvaluationVisual_txtTestType'
//    ];

//    requiredFields.forEach(fieldId => {
//        const value = $('#' + fieldId).val();
//        if (!value) {
//            isValid = false;
//            const displayName = fieldDisplayNames[fieldId] || fieldId;
//            errorMessages.push(`${displayName} is required`);
//            $('#' + fieldId).addClass('is-invalid');
//        } else {
//            $('#' + fieldId).removeClass('is-invalid');
//        }
//    });

//    if (!isValid) {
//        toastr.error(errorMessages.join('<br>'), 'Validation Error', { timeOut: 5000 });
//    }

//    return isValid;
//}

function validateFormTabVisual() {
    let isValid = true;
    let errorMessages = [];

    const testCode = $('#trPMEvaluationVisual_txtTestCode').val().trim();
    const testClass = $('#trPMEvaluationVisual_txtTestClass').val().trim();
    const testMethod = $('#trPMEvaluationVisual_txtTestMethodCode').val().trim();
    const testType = $('#trPMEvaluationVisual_txtTestType').val().trim();

    const min = $('#trPMEvaluationVisual_txtMin').val().trim();
    const max = $('#trPMEvaluationVisual_txtMax').val().trim();
    const target = $('#trPMEvaluationVisual_txtTarget').val().trim();
    const detail = $('#trPMEvaluationVisual_txtDetail').val().trim();
    const result = $('#trPMEvaluationVisual_txtResult').val().trim();
    const notAnalyzedChecked = $('#trPMEvaluationVisual_bitNotAnalyzed').is(':checked');

    const allEmpty = !testCode && !testClass && !testMethod && !testType;

    const requiredFields = [];
    const fieldDisplayNames = {
        'trPMEvaluationVisual_txtTestCode': 'Test Code',
        'trPMEvaluationVisual_txtTestClass': 'Test Class',
        'trPMEvaluationVisual_txtTestMethodCode': 'Test Method',
        'trPMEvaluationVisual_txtTestType': 'Test Type',
        'trPMEvaluationVisual_txtMin': 'Min',
        'trPMEvaluationVisual_txtMax': 'Max',
        'trPMEvaluationVisual_txtTarget': 'Target',
        //'trPMEvaluationVisual_txtResult': 'Result',
        'trPMEvaluationVisual_txtDetail': 'Detail'
    };

    if (allEmpty) {
        // Semua field utama wajib
        requiredFields.push(
            'trPMEvaluationVisual_txtTestCode',
            'trPMEvaluationVisual_txtTestClass',
            'trPMEvaluationVisual_txtTestMethodCode',
            'trPMEvaluationVisual_txtTestType',
            'trPMEvaluationVisual_txtMin',
            'trPMEvaluationVisual_txtMax',
            'trPMEvaluationVisual_txtTarget'

            /*'trPMEvaluationVisual_txtResult',*/
        );
    } else {
        // Validasi masing-masing field jika tidak semuanya kosong
        if (!testCode) requiredFields.push('trPMEvaluationVisual_txtTestCode');
        if (!testClass) requiredFields.push('trPMEvaluationVisual_txtTestClass');
        if (!testMethod) requiredFields.push('trPMEvaluationVisual_txtTestMethodCode');
        if (!testType) requiredFields.push('trPMEvaluationVisual_txtTestType');
    }

    // Validasi tambahan berdasarkan Test Type

    if (testType === 'N') {

        requiredFields.push('trPMEvaluationVisual_txtMin', 'trPMEvaluationVisual_txtMax');

        $('#trPMEvaluationVisual_txtTarget').removeClass('is-invalid');
        $('#trPMEvaluationVisual_txtResult').removeClass('is-invalid');

        $('#trPMEvaluationVisual_txtTestCode').removeClass('is-invalid');
        $('#trPMEvaluationVisual_txtTestClass').removeClass('is-invalid');
        $('#trPMEvaluationVisual_txtTestMethodCode').removeClass('is-invalid');
        $('#trPMEvaluationVisual_txtTestType').removeClass('is-invalid');
        //$('#trPMEvaluationVisual_txtDetail').removeClass('is-invalid');

        //// 🔎 Validasi jika Min > Max
        //if (min && max && parseFloat(min) > parseFloat(max)) {
        //    isValid = false;
        //    errorMessages.push("Min cannot be greater than Max.");
        //    $('#trPMEvaluationVisual_txtMin').addClass('is-invalid');
        //    $('#trPMEvaluationVisual_txtMax').addClass('is-invalid');
        //}
    } else if (testType === 'T') {
        requiredFields.push('trPMEvaluationVisual_txtMin', 'trPMEvaluationVisual_txtMax', 'trPMEvaluationVisual_txtTarget');

        $('#trPMEvaluationVisual_txtTestCode').removeClass('is-invalid');
        $('#trPMEvaluationVisual_txtTestClass').removeClass('is-invalid');
        $('#trPMEvaluationVisual_txtTestMethodCode').removeClass('is-invalid');
        $('#trPMEvaluationVisual_txtTestType').removeClass('is-invalid');
        //$('#trPMEvaluationVisual_txtDetail').removeClass('is-invalid');

    }
    //else if (testType === 'V') {
    //    requiredFields.push('trPMEvaluationVisual_txtTarget', 'trPMEvaluationVisual_txtDetail');

    //    $('#trPMEvaluationVisual_txtMin').removeClass('is-invalid');
    //    $('#trPMEvaluationVisual_txtMax').removeClass('is-invalid');

    //    $('#trPMEvaluationVisual_txtTestCode').removeClass('is-invalid');
    //    $('#trPMEvaluationVisual_txtTestClass').removeClass('is-invalid');
    //    $('#trPMEvaluationVisual_txtTestMethodCode').removeClass('is-invalid');
    //    $('#trPMEvaluationVisual_txtTestType').removeClass('is-invalid');
    //    //
    //    if (target.toUpperCase() == "CONFORM" || target.toUpperCase() == "NOT CONFORM") {
    //        requiredFields.push('trPMEvaluationVisual_txtDetail');
    //    }
    //}
    else if (testType === 'V') {
        requiredFields.push('trPMEvaluationVisual_txtTarget'/*, 'trPMEvaluationVisual_txtDetail'*/);

        $('#trPMEvaluationVisual_txtMin').removeClass('is-invalid');
        $('#trPMEvaluationVisual_txtMax').removeClass('is-invalid');

        $('#trPMEvaluationVisual_txtTestCode').removeClass('is-invalid');
        $('#trPMEvaluationVisual_txtTestClass').removeClass('is-invalid');
        $('#trPMEvaluationVisual_txtTestMethodCode').removeClass('is-invalid');
        $('#trPMEvaluationVisual_txtTestType').removeClass('is-invalid');

        // Normalize ke uppercase biar aman
        const t = (target || "").toUpperCase();
        const r = (result || "").toUpperCase();

        // Required jika target ATAU result mengandung "CONFORM"
        if (t.includes("CONFORM") || r.includes("CONFORM")) {
            requiredFields.push('trPMEvaluationVisual_txtDetail');
        }
    }

    // Jalankan validasi untuk semua field yang diperlukan
    requiredFields.forEach(fieldId => {
        const value = $('#' + fieldId).val().trim();
        if (!value) {
            isValid = false;
            const displayName = fieldDisplayNames[fieldId] || fieldId;

            errorMessages.push(`${displayName} is required.`);
            $('#' + fieldId).addClass('is-invalid');
        } else {
            $('#' + fieldId).removeClass('is-invalid');
        }
    });

    let minClean = min.replace(/,/g, '');
    let maxClean = max.replace(/,/g, '');
    // 🔎 Validasi jika Min > Max, setelah required field divalidasi
    if (testType === 'N' && min && max && parseFloat(minClean) > parseFloat(maxClean)) {
        isValid = false;
        errorMessages.push("Min cannot be greater than Max.");
        $('#trPMEvaluationVisual_txtMin').addClass('is-invalid');
        $('#trPMEvaluationVisual_txtMax').addClass('is-invalid');
    }


    //// Validasi jika Target = Conform / Not Conform → Detail wajib diisi
    //const targetUpper = target.toUpperCase();
    //if (['CONFORM', 'NOT CONFORM'].includes(targetUpper)) {
    //    if (!detail) {
    //        isValid = false;
    //        errorMessages.push("Detail is required when Target is 'Conform' or 'Not Conform'.");
    //        $('#trPMEvaluationVisual_txtDetail').addClass('is-invalid');
    //    } else {
    //        $('#trPMEvaluationVisual_txtDetail').removeClass('is-invalid');
    //    }
    //} else {
    //    $('#trPMEvaluationVisual_txtDetail').removeClass('is-invalid');
    //}

    //// ✅ Validasi jika checkbox NOT checked → Result wajib diisi
    //if (!notAnalyzedChecked && !result) {
    //    isValid = false;
    //    errorMessages.push("Result is required if 'Not Analyzed' is not checked.");
    //    $('#trPMEvaluationVisual_txtResult').addClass('is-invalid');
    //}

    if (!isValid) {
        clsGlobal.getAlert(errorMessages.join("<br/>"));
    }

    return isValid;
}

function validateFormTabDimension() {
    let isValid = true;
    let errorMessages = [];

    const testCode = $('#trPMEvaluationDimension_txtTestCode').val().trim();
    const testClass = $('#trPMEvaluationDimension_txtTestClass').val().trim();
    const testMethod = $('#trPMEvaluationDimension_txtTestMethodCode').val().trim();
    const testType = $('#trPMEvaluationDimension_txtTestType').val().trim();

    const min = $('#trPMEvaluationDimension_txtMin').val().trim();
    const max = $('#trPMEvaluationDimension_txtMax').val().trim();
    const target = $('#trPMEvaluationDimension_txtTarget').val().trim();
    const detail = $('#trPMEvaluationDimension_txtDetail').val().trim();
    const result = $('#trPMEvaluationDimension_txtResult').val().trim();
    const notAnalyzedChecked = $('#trPMEvaluationDimension_bitNotAnalyzed').is(':checked');

    const allEmpty = !testCode && !testClass && !testMethod && !testType;

    const requiredFields = [];
    const fieldDisplayNames = {
        'trPMEvaluationDimension_txtTestCode': 'Test Code',
        'trPMEvaluationDimension_txtTestClass': 'Test Class',
        'trPMEvaluationDimension_txtTestMethodCode': 'Test Method',
        'trPMEvaluationDimension_txtTestType': 'Test Type',
        'trPMEvaluationDimension_txtMin': 'Min',
        'trPMEvaluationDimension_txtMax': 'Max',
        'trPMEvaluationDimension_txtTarget': 'Target',
        //'trPMEvaluationDimension_txtResult': 'Result',
        'trPMEvaluationDimension_txtDetail': 'Detail'
    };

    if (allEmpty) {
        // Semua field utama wajib
        requiredFields.push(
            'trPMEvaluationDimension_txtTestCode',
            'trPMEvaluationDimension_txtTestClass',
            'trPMEvaluationDimension_txtTestMethodCode',
            'trPMEvaluationDimension_txtTestType',
            'trPMEvaluationDimension_txtMin',
            'trPMEvaluationDimension_txtMax',
            'trPMEvaluationDimension_txtTarget'
            //    'trPMEvaluationDimension_txtResult',
        );
    } else {
        // Validasi masing-masing field jika tidak semuanya kosong
        if (!testCode) requiredFields.push('trPMEvaluationDimension_txtTestCode');
        if (!testClass) requiredFields.push('trPMEvaluationDimension_txtTestClass');
        if (!testMethod) requiredFields.push('trPMEvaluationDimension_txtTestMethodCode');
        if (!testType) requiredFields.push('trPMEvaluationDimension_txtTestType');
    }

    // Validasi tambahan berdasarkan Test Type

    if (testType === 'N') {
        requiredFields.push('trPMEvaluationDimension_txtMin', 'trPMEvaluationDimension_txtMax');

        $('#trPMEvaluationDimension_txtTarget').removeClass('is-invalid');
        $('#trPMEvaluationDimension_txtResult').removeClass('is-invalid');

        $('#trPMEvaluationDimension_txtTestCode').removeClass('is-invalid');
        $('#trPMEvaluationDimension_txtTestClass').removeClass('is-invalid');
        $('#trPMEvaluationDimension_txtTestMethodCode').removeClass('is-invalid');
        $('#trPMEvaluationDimension_txtTestType').removeClass('is-invalid');

    } else if (testType === 'T') {
        requiredFields.push('trPMEvaluationDimension_txtMin', 'trPMEvaluationDimension_txtMax', 'trPMEvaluationDimension_txtTarget');

        $('#trPMEvaluationDimension_txtTestCode').removeClass('is-invalid');
        $('#trPMEvaluationDimension_txtTestClass').removeClass('is-invalid');
        $('#trPMEvaluationDimension_txtTestMethodCode').removeClass('is-invalid');
        $('#trPMEvaluationDimension_txtTestType').removeClass('is-invalid');
    } else if (testType === 'V') {
        requiredFields.push('trPMEvaluationDimension_txtTarget');

        $('#trPMEvaluationDimension_txtMin').removeClass('is-invalid');
        $('#trPMEvaluationDimension_txtMax').removeClass('is-invalid');

        $('#trPMEvaluationDimension_txtTestCode').removeClass('is-invalid');
        $('#trPMEvaluationDimension_txtTestClass').removeClass('is-invalid');
        $('#trPMEvaluationDimension_txtTestMethodCode').removeClass('is-invalid');
        $('#trPMEvaluationDimension_txtTestType').removeClass('is-invalid');
        if (target.toUpperCase() == "CONFORM" || target.toUpperCase() == "NOT CONFORM") {
            requiredFields.push('trPMEvaluationDimension_txtDetail');
        }
    }

    // Jalankan validasi untuk semua field yang diperlukan
    requiredFields.forEach(fieldId => {
        const value = $('#' + fieldId).val().trim();
        if (!value) {
            isValid = false;
            const displayName = fieldDisplayNames[fieldId] || fieldId;

            errorMessages.push(`${displayName} is required.`);
            $('#' + fieldId).addClass('is-invalid');
        } else {
            $('#' + fieldId).removeClass('is-invalid');
        }
    });

    let minClean = min.replace(/,/g, '');
    let maxClean = max.replace(/,/g, '');

    // 🔎 Validasi jika Min > Max, setelah required field divalidasi
    if (testType === 'N' && min && max && parseFloat(minClean) > parseFloat(maxClean)) {
        isValid = false;
        errorMessages.push("Min cannot be greater than Max.");
        $('#trPMEvaluationDimension_txtMin').addClass('is-invalid');
        $('#trPMEvaluationDimension_txtMax').addClass('is-invalid');
    }

    //// Validasi jika Target = Conform / Not Conform → Detail wajib diisi
    //const targetUpper = target.toUpperCase();
    //if (['CONFORM', 'NOT CONFORM'].includes(targetUpper)) {
    //    if (!detail) {
    //        isValid = false;
    //        errorMessages.push("Detail is required when Target is 'Conform' or 'Not Conform'.");
    //        $('#trPMEvaluationDimension_txtDetail').addClass('is-invalid');
    //    } else {
    //        $('#trPMEvaluationDimension_txtDetail').removeClass('is-invalid');
    //    }
    //} else {
    //    $('#trPMEvaluationDimension_txtDetail').removeClass('is-invalid');
    //}

    //// ✅ Validasi jika checkbox NOT checked → Result wajib diisi
    //if (!notAnalyzedChecked && !result) {
    //    isValid = false;
    //    errorMessages.push("Result is required if 'Not Analyzed' is not checked.");
    //    $('#trPMEvaluationDimension_txtResult').addClass('is-invalid');
    //}

    if (!isValid) {
        clsGlobal.getAlert(errorMessages.join("<br/>"));
    }

    return isValid;
}

function validateFormTabMaterial() {
    let isValid = true;
    let errorMessages = [];

    const testCode = $('#trPMEvaluationMaterial_txtTestCode').val().trim();
    const testClass = $('#trPMEvaluationMaterial_txtTestClass').val().trim();
    const testMethod = $('#trPMEvaluationMaterial_txtTestMethodCode').val().trim();
    const testType = $('#trPMEvaluationMaterial_txtTestType').val().trim();

    const min = $('#trPMEvaluationMaterial_txtMin').val().trim();
    const max = $('#trPMEvaluationMaterial_txtMax').val().trim();
    const target = $('#trPMEvaluationMaterial_txtTarget').val().trim();
    const detail = $('#trPMEvaluationMaterial_txtDetail').val().trim();
    const result = $('#trPMEvaluationMaterial_txtResult').val().trim();
    const notAnalyzedChecked = $('#trPMEvaluationMaterial_bitNotAnalyzed').is(':checked');

    const allEmpty = !testCode && !testClass && !testMethod && !testType;

    const requiredFields = [];
    const fieldDisplayNames = {
        'trPMEvaluationMaterial_txtTestCode': 'Test Code',
        'trPMEvaluationMaterial_txtTestClass': 'Test Class',
        'trPMEvaluationMaterial_txtTestMethodCode': 'Test Method',
        'trPMEvaluationMaterial_txtTestType': 'Test Type',
        'trPMEvaluationMaterial_txtMin': 'Min',
        'trPMEvaluationMaterial_txtMax': 'Max',
        'trPMEvaluationMaterial_txtTarget': 'Target',
        //'trPMEvaluationMaterial_txtResult': 'Result',
        'trPMEvaluationMaterial_txtDetail': 'Detail'
    };

    if (allEmpty) {
        // Semua field utama wajib
        requiredFields.push(
            'trPMEvaluationMaterial_txtTestCode',
            'trPMEvaluationMaterial_txtTestClass',
            'trPMEvaluationMaterial_txtTestMethodCode',
            'trPMEvaluationMaterial_txtTestType',
            'trPMEvaluationMaterial_txtMin',
            'trPMEvaluationMaterial_txtMax',
            'trPMEvaluationMaterial_txtTarget'
        );
    } else {
        // Validasi masing-masing field jika tidak semuanya kosong
        if (!testCode) requiredFields.push('trPMEvaluationMaterial_txtTestCode');
        if (!testClass) requiredFields.push('trPMEvaluationMaterial_txtTestClass');
        if (!testMethod) requiredFields.push('trPMEvaluationMaterial_txtTestMethodCode');
        if (!testType) requiredFields.push('trPMEvaluationMaterial_txtTestType');
    }

    // Validasi tambahan berdasarkan Test Type

    if (testType === 'N') {
        requiredFields.push('trPMEvaluationMaterial_txtMin', 'trPMEvaluationMaterial_txtMax');

        $('#trPMEvaluationMaterial_txtTarget').removeClass('is-invalid');
        $('#trPMEvaluationMaterial_txtResult').removeClass('is-invalid');

        $('#trPMEvaluationMaterial_txtTestCode').removeClass('is-invalid');
        $('#trPMEvaluationMaterial_txtTestClass').removeClass('is-invalid');
        $('#trPMEvaluationMaterial_txtTestMethodCode').removeClass('is-invalid');
        $('#trPMEvaluationMaterial_txtTestType').removeClass('is-invalid');

    } else if (testType === 'T') {
        requiredFields.push('trPMEvaluationMaterial_txtMin', 'trPMEvaluationMaterial_txtMax', 'trPMEvaluationMaterial_txtTarget');

        $('#trPMEvaluationMaterial_txtTestCode').removeClass('is-invalid');
        $('#trPMEvaluationMaterial_txtTestClass').removeClass('is-invalid');
        $('#trPMEvaluationMaterial_txtTestMethodCode').removeClass('is-invalid');
        $('#trPMEvaluationMaterial_txtTestType').removeClass('is-invalid');
    } else if (testType === 'V') {
        requiredFields.push('trPMEvaluationMaterial_txtTarget');

        $('#trPMEvaluationMaterial_txtMin').removeClass('is-invalid');
        $('#trPMEvaluationMaterial_txtMax').removeClass('is-invalid');

        $('#trPMEvaluationMaterial_txtTestCode').removeClass('is-invalid');
        $('#trPMEvaluationMaterial_txtTestClass').removeClass('is-invalid');
        $('#trPMEvaluationMaterial_txtTestMethodCode').removeClass('is-invalid');
        $('#trPMEvaluationMaterial_txtTestType').removeClass('is-invalid');
        if (target.toUpperCase() == "CONFORM" || target.toUpperCase() == "NOT CONFORM") {
            requiredFields.push('trPMEvaluationMaterial_txtDetail');
        }
    }

    // Jalankan validasi untuk semua field yang diperlukan
    requiredFields.forEach(fieldId => {
        const value = $('#' + fieldId).val().trim();
        if (!value) {
            isValid = false;
            const displayName = fieldDisplayNames[fieldId] || fieldId;

            errorMessages.push(`${displayName} is required.`);
            $('#' + fieldId).addClass('is-invalid');
        } else {
            $('#' + fieldId).removeClass('is-invalid');
        }
    });
    let minClean = min.replace(/,/g, '');
    let maxClean = max.replace(/,/g, '');
    // 🔎 Validasi jika Min > Max, setelah required field divalidasi
    if (testType === 'N' && min && max && parseFloat(minClean) > parseFloat(maxClean)) {
        isValid = false;
        errorMessages.push("Min cannot be greater than Max.");
        $('#trPMEvaluationMaterial_txtMin').addClass('is-invalid');
        $('#trPMEvaluationMaterial_txtMax').addClass('is-invalid');
    }

    //// Validasi jika Target = Conform / Not Conform → Detail wajib diisi
    //const targetUpper = target.toUpperCase();
    //if (['CONFORM', 'NOT CONFORM'].includes(targetUpper)) {
    //    if (!detail) {
    //        isValid = false;
    //        errorMessages.push("Detail is required when Target is 'Conform' or 'Not Conform'.");
    //        $('#trPMEvaluationMaterial_txtDetail').addClass('is-invalid');
    //    } else {
    //        $('#trPMEvaluationMaterial_txtDetail').removeClass('is-invalid');
    //    }
    //} else {
    //    $('#trPMEvaluationMaterial_txtDetail').removeClass('is-invalid');
    //}

    //// ✅ Validasi jika checkbox NOT checked → Result wajib diisi
    //if (!notAnalyzedChecked && !result) {
    //    isValid = false;
    //    errorMessages.push("Result is required if 'Not Analyzed' is not checked.");
    //    $('#trPMEvaluationMaterial_txtResult').addClass('is-invalid');
    //}

    if (!isValid) {
        clsGlobal.getAlert(errorMessages.join("<br/>"));
    }

    return isValid;
}

function validateFormTabPackaging() {
    let isValid = true;
    let errorMessages = [];

    const testCode = $('#trPMEvaluationPackaging_txtTestCode').val().trim();
    const testClass = $('#trPMEvaluationPackaging_txtTestClass').val().trim();
    const testMethod = $('#trPMEvaluationPackaging_txtTestMethodCode').val().trim();
    const testType = $('#trPMEvaluationPackaging_txtTestType').val().trim();

    const min = $('#trPMEvaluationPackaging_txtMin').val().trim();
    const max = $('#trPMEvaluationPackaging_txtMax').val().trim();
    const target = $('#trPMEvaluationPackaging_txtTarget').val().trim();
    //const detail = $('#trPMEvaluationPackaging_txtDetail').val().trim();
    //const result = $('#trPMEvaluationPackaging_txtResult').val().trim();
    const notAnalyzedChecked = $('#trPMEvaluationPackaging_bitNotAnalyzed').is(':checked');

    const allEmpty = !testCode && !testClass && !testMethod && !testType;

    const requiredFields = [];
    const fieldDisplayNames = {
        'trPMEvaluationPackaging_txtTestCode': 'Test Code',
        'trPMEvaluationPackaging_txtTestClass': 'Test Class',
        'trPMEvaluationPackaging_txtTestMethodCode': 'Test Method',
        'trPMEvaluationPackaging_txtTestType': 'Test Type',
        'trPMEvaluationPackaging_txtMin': 'Min',
        'trPMEvaluationPackaging_txtMax': 'Max',
        'trPMEvaluationPackaging_txtTarget': 'Target',
        //'trPMEvaluationPackaging_txtResult': 'Result',
        'trPMEvaluationPackaging_txtDetail': 'Detail'
    };

    if (allEmpty) {
        // Semua field utama wajib
        requiredFields.push(
            'trPMEvaluationPackaging_txtTestCode',
            'trPMEvaluationPackaging_txtTestClass',
            'trPMEvaluationPackaging_txtTestMethodCode',
            'trPMEvaluationPackaging_txtTestType',
            'trPMEvaluationPackaging_txtMin',
            'trPMEvaluationPackaging_txtMax',
            'trPMEvaluationPackaging_txtTarget'
            /*'trPMEvaluationPackaging_txtResult',*/
        );
    } else {
        // Validasi masing-masing field jika tidak semuanya kosong
        if (!testCode) requiredFields.push('trPMEvaluationPackaging_txtTestCode');
        if (!testClass) requiredFields.push('trPMEvaluationPackaging_txtTestClass');
        if (!testMethod) requiredFields.push('trPMEvaluationPackaging_txtTestMethodCode');
        if (!testType) requiredFields.push('trPMEvaluationPackaging_txtTestType');
    }

    // Validasi tambahan berdasarkan Test Type

    if (testType === 'N') {
        requiredFields.push('trPMEvaluationPackaging_txtMin', 'trPMEvaluationPackaging_txtMax');

        $('#trPMEvaluationPackaging_txtTarget').removeClass('is-invalid');
        $('#trPMEvaluationPackaging_txtResult').removeClass('is-invalid');

        $('#trPMEvaluationPackaging_txtTestCode').removeClass('is-invalid');
        $('#trPMEvaluationPackaging_txtTestClass').removeClass('is-invalid');
        $('#trPMEvaluationPackaging_txtTestMethodCode').removeClass('is-invalid');
        $('#trPMEvaluationPackaging_txtTestType').removeClass('is-invalid');

    } else if (testType === 'T') {
        requiredFields.push('trPMEvaluationPackaging_txtMin', 'trPMEvaluationPackaging_txtMax', 'trPMEvaluationPackaging_txtTarget');

        $('#trPMEvaluationPackaging_txtTestCode').removeClass('is-invalid');
        $('#trPMEvaluationPackaging_txtTestClass').removeClass('is-invalid');
        $('#trPMEvaluationPackaging_txtTestMethodCode').removeClass('is-invalid');
        $('#trPMEvaluationPackaging_txtTestType').removeClass('is-invalid');
    } else if (testType === 'V') {
        requiredFields.push('trPMEvaluationPackaging_txtTarget');

        $('#trPMEvaluationPackaging_txtMin').removeClass('is-invalid');
        $('#trPMEvaluationPackaging_txtMax').removeClass('is-invalid');

        $('#trPMEvaluationPackaging_txtTestCode').removeClass('is-invalid');
        $('#trPMEvaluationPackaging_txtTestClass').removeClass('is-invalid');
        $('#trPMEvaluationPackaging_txtTestMethodCode').removeClass('is-invalid');
        $('#trPMEvaluationPackaging_txtTestType').removeClass('is-invalid');

        if (target.toUpperCase() == "CONFORM" || target.toUpperCase() == "NOT CONFORM") {
            requiredFields.push('trPMEvaluationPackaging_txtDetail');
        }
    }

    // Jalankan validasi untuk semua field yang diperlukan
    requiredFields.forEach(fieldId => {
        const value = $('#' + fieldId).val().trim();
        if (!value) {
            isValid = false;
            const displayName = fieldDisplayNames[fieldId] || fieldId;


            errorMessages.push(`${displayName} is required.`);
            $('#' + fieldId).addClass('is-invalid');
        } else {
            $('#' + fieldId).removeClass('is-invalid');
        }
    });
    let minClean = min.replace(/,/g, '');
    let maxClean = max.replace(/,/g, '');
    // 🔎 Validasi jika Min > Max, setelah required field divalidasi
    if (testType === 'N' && min && max && parseFloat(minClean) > parseFloat(maxClean)) {
        isValid = false;
        errorMessages.push("Min cannot be greater than Max.");
        $('#trPMEvaluationPackaging_txtMin').addClass('is-invalid');
        $('#trPMEvaluationPackaging_txtMax').addClass('is-invalid');
    }

    //// Validasi jika Target = Conform / Not Conform → Detail wajib diisi
    //const targetUpper = target.toUpperCase();
    //if (['CONFORM', 'NOT CONFORM'].includes(targetUpper)) {
    //    if (!detail) {
    //        isValid = false;
    //        errorMessages.push("Detail is required when Target is 'Conform' or 'Not Conform'.");
    //        $('#trPMEvaluationPackaging_txtDetail').addClass('is-invalid');
    //    } else {
    //        $('#trPMEvaluationPackaging_txtDetail').removeClass('is-invalid');
    //    }
    //} else {
    //    $('#trPMEvaluationPackaging_txtDetail').removeClass('is-invalid');
    //}

    //// ✅ Validasi jika checkbox NOT checked → Result wajib diisi
    //if (!notAnalyzedChecked && !result) {
    //    isValid = false;
    //    errorMessages.push("Result is required if 'Not Analyzed' is not checked.");
    //    $('#trPMEvaluationPackaging_txtResult').addClass('is-invalid');
    //}

    if (!isValid) {
        clsGlobal.getAlert(errorMessages.join("<br/>"));
    }

    return isValid;
}

function validateFormTabContaminant() {
    let isValid = true;
    let errorMessages = [];

    const testCode = $('#trPMEvaluationContaminant_txtTestCode').val().trim();
    const testClass = $('#trPMEvaluationContaminant_txtTestClass').val().trim();
    const testMethod = $('#trPMEvaluationContaminant_txtTestMethodCode').val().trim();
    const testType = $('#trPMEvaluationContaminant_txtTestType').val().trim();

    const min = $('#trPMEvaluationContaminant_txtMin').val().trim();
    const max = $('#trPMEvaluationContaminant_txtMax').val().trim();
    const target = $('#trPMEvaluationContaminant_txtTarget').val().trim();
    const detail = $('#trPMEvaluationContaminant_txtDetail').val().trim();
    const result = $('#trPMEvaluationContaminant_txtResult').val().trim();
    const notAnalyzedChecked = $('#trPMEvaluationContaminant_bitNotAnalyzed').is(':checked');

    const allEmpty = !testCode && !testClass && !testMethod && !testType;

    const requiredFields = [];
    const fieldDisplayNames = {
        'trPMEvaluationContaminant_txtTestCode': 'Test Code',
        'trPMEvaluationContaminant_txtTestClass': 'Test Class',
        'trPMEvaluationContaminant_txtTestMethodCode': 'Test Method',
        'trPMEvaluationContaminant_txtTestType': 'Test Type',
        'trPMEvaluationContaminant_txtMin': 'Min',
        'trPMEvaluationContaminant_txtMax': 'Max',
        'trPMEvaluationContaminant_txtTarget': 'Target',
        //'trPMEvaluationContaminant_txtResult': 'Result',
        'trPMEvaluationContaminant_txtDetail': 'Detail'
    };

    if (allEmpty) {
        // Semua field utama wajib
        requiredFields.push(
            'trPMEvaluationContaminant_txtTestCode',
            'trPMEvaluationContaminant_txtTestClass',
            'trPMEvaluationContaminant_txtTestMethodCode',
            'trPMEvaluationContaminant_txtTestType',
            'trPMEvaluationContaminant_txtMin',
            'trPMEvaluationContaminant_txtMax',
            'trPMEvaluationContaminant_txtTarget',
            'trPMEvaluationContaminant_txtDetail'
            //    'trPMEvaluationContaminant_txtResult',
        );
    } else {
        // Validasi masing-masing field jika tidak semuanya kosong
        if (!testCode) requiredFields.push('trPMEvaluationContaminant_txtTestCode');
        if (!testClass) requiredFields.push('trPMEvaluationContaminant_txtTestClass');
        if (!testMethod) requiredFields.push('trPMEvaluationContaminant_txtTestMethodCode');
        if (!testType) requiredFields.push('trPMEvaluationContaminant_txtTestType');
    }

    // Validasi tambahan berdasarkan Test Type

    if (testType === 'N') {
        requiredFields.push('trPMEvaluationContaminant_txtMin', 'trPMEvaluationContaminant_txtMax');

        $('#trPMEvaluationContaminant_txtTarget').removeClass('is-invalid');
        $('#trPMEvaluationContaminant_txtResult').removeClass('is-invalid');

        $('#trPMEvaluationContaminant_txtTestCode').removeClass('is-invalid');
        $('#trPMEvaluationContaminant_txtTestClass').removeClass('is-invalid');
        $('#trPMEvaluationContaminant_txtTestMethodCode').removeClass('is-invalid');
        $('#trPMEvaluationContaminant_txtTestType').removeClass('is-invalid');

    } else if (testType === 'T') {
        requiredFields.push('trPMEvaluationContaminant_txtMin', 'trPMEvaluationContaminant_txtMax', 'trPMEvaluationContaminant_txtTarget');

        $('#trPMEvaluationContaminant_txtTestCode').removeClass('is-invalid');
        $('#trPMEvaluationContaminant_txtTestClass').removeClass('is-invalid');
        $('#trPMEvaluationContaminant_txtTestMethodCode').removeClass('is-invalid');
        $('#trPMEvaluationContaminant_txtTestType').removeClass('is-invalid');
    } else if (testType === 'V') {
        requiredFields.push('trPMEvaluationContaminant_txtTarget');

        $('#trPMEvaluationContaminant_txtMin').removeClass('is-invalid');
        $('#trPMEvaluationContaminant_txtMax').removeClass('is-invalid');

        $('#trPMEvaluationContaminant_txtTestCode').removeClass('is-invalid');
        $('#trPMEvaluationContaminant_txtTestClass').removeClass('is-invalid');
        $('#trPMEvaluationContaminant_txtTestMethodCode').removeClass('is-invalid');
        $('#trPMEvaluationContaminant_txtTestType').removeClass('is-invalid');


        if (target.toUpperCase() != "CONFORM" && target.toUpperCase() != "NOT CONFORM") {

            $('#trPMEvaluationVisual_txtDetail').removeClass('is-invalid');
        }
    }

    // Jalankan validasi untuk semua field yang diperlukan
    requiredFields.forEach(fieldId => {
        const value = $('#' + fieldId).val().trim();
        if (!value) {
            isValid = false;
            const displayName = fieldDisplayNames[fieldId] || fieldId;


            errorMessages.push(`${displayName} is required.`);
            $('#' + fieldId).addClass('is-invalid');
        } else {
            $('#' + fieldId).removeClass('is-invalid');
        }
    });
    let minClean = min.replace(/,/g, '');
    let maxClean = max.replace(/,/g, '');
    // 🔎 Validasi jika Min > Max, setelah required field divalidasi
    if (testType === 'N' && min && max && parseFloat(minClean) > parseFloat(maxClean)) {
        isValid = false;
        errorMessages.push("Min cannot be greater than Max.");
        $('#trPMEvaluationContaminant_txtMin').addClass('is-invalid');
        $('#trPMEvaluationContaminant_txtMax').addClass('is-invalid');
    }

    //// Validasi jika Target = Conform / Not Conform → Detail wajib diisi
    //const targetUpper = target.toUpperCase();
    //if (['CONFORM', 'NOT CONFORM'].includes(targetUpper)) {
    //    if (!detail) {
    //        isValid = false;
    //        errorMessages.push("Detail is required when Target is 'Conform' or 'Not Conform'.");
    //        $('#trPMEvaluationContaminant_txtDetail').addClass('is-invalid');
    //    } else {
    //        $('#trPMEvaluationContaminant_txtDetail').removeClass('is-invalid');
    //    }
    //} else {
    //    $('#trPMEvaluationContaminant_txtDetail').removeClass('is-invalid');
    //}

    //// ✅ Validasi jika checkbox NOT checked → Result wajib diisi
    //if (!notAnalyzedChecked && !result) {
    //    isValid = false;
    //    errorMessages.push("Result is required if 'Not Analyzed' is not checked.");
    //    $('#trPMEvaluationContaminant_txtResult').addClass('is-invalid');
    //}

    if (!isValid) {
        clsGlobal.getAlert(errorMessages.join("<br/>"));
    }

    return isValid;
}

function p_OnNotAnalyzedChange() {
    const isChecked = document.getElementById('trPMEvaluationVisual_bitNotAnalyzed').checked;
    const statusSelect = document.getElementById('trPMEvaluationVisual_txtStatus');

    const result = document.getElementById('trPMEvaluationVisual_txtResult');

    if (isChecked) {
        statusSelect.value = 'NOT ANALYZED';
        result.value = "";
    } else {
        statusSelect.value = 'NOT OK';
        result.value = "";
    }
}

function p_OnNotAnalyzedDimensionChange() {
    const isChecked = document.getElementById('trPMEvaluationDimension_bitNotAnalyzed').checked;
    const statusSelect = document.getElementById('trPMEvaluationDimension_txtStatus');

    const result = document.getElementById('trPMEvaluationDimension_txtResult');

    if (isChecked) {
        statusSelect.value = 'NOT ANALYZED';
        result.value = "";
    } else {
        statusSelect.value = 'NOT OK';
        result.value = "";
    }
}

function p_OnNotAnalyzedMaterialChange() {

    const isChecked = document.getElementById('trPMEvaluationMaterial_bitNotAnalyzed').checked;
    const statusSelect = document.getElementById('trPMEvaluationMaterial_txtStatus');

    const result = document.getElementById('trPMEvaluationMaterial_txtResult');

    if (isChecked) {
        statusSelect.value = 'NOT ANALYZED';
        result.value = "";
    } else {
        statusSelect.value = 'NOT OK';
        result.value = "";
    }
}

function p_OnNotAnalyzedPackagingChange() {
    const isChecked = document.getElementById('trPMEvaluationPackaging_bitNotAnalyzed').checked;
    const statusSelect = document.getElementById('trPMEvaluationPackaging_txtStatus');

    const result = document.getElementById('trPMEvaluationPackaging_txtResult');

    if (isChecked) {
        statusSelect.value = 'NOT ANALYZED';
        result.value = "";
    } else {
        statusSelect.value = 'NOT OK';
        result.value = "";
    }
}

function p_OnNotAnalyzedContaminantChange() {
    const isChecked = document.getElementById('trPMEvaluationContaminant_bitNotAnalyzed').checked;
    const statusSelect = document.getElementById('trPMEvaluationContaminant_txtStatus');

    const result = document.getElementById('trPMEvaluationContaminant_txtResult');

    if (isChecked) {
        statusSelect.value = 'NOT ANALYZED';
        result.value = "";
    } else {
        statusSelect.value = 'NOT OK';
        result.value = "";
    }
}

function GetValidateDetail(txtTestCode, tab, currentID = null) {
    var context = "true";

    if (tab === 'visual') {
        var objData = JSON.parse($("#txtHiddenDetailVisualObject").val());

        for (var i = 0; i < objData.length; i++) {
            const codeMatch = objData[i].trPMEvaluationVisual_txtTestCode.toUpperCase() === txtTestCode.toUpperCase();
            const isDifferentID = currentID == null || objData[i].trPMEvaluationVisual_txtPMEvaluationVisualID !== currentID;

            if (codeMatch && isDifferentID) {
                context = "false";
                break;
            }
        }
    }
    if (tab === 'dimension') {
        var objData = JSON.parse($("#txtHiddenDetailDimensionObject").val());

        for (var i = 0; i < objData.length; i++) {
            const codeMatch = objData[i].trPMEvaluationDimension_txtTestCode.toUpperCase() === txtTestCode.toUpperCase();
            const isDifferentID = currentID == null || objData[i].trPMEvaluationDimension_txtPMEvaluationDimensionID !== currentID;

            if (codeMatch && isDifferentID) {
                context = "false";
                break;
            }
        }
    }
    if (tab === 'material') {
        var objData = JSON.parse($("#txtHiddenDetailMaterialObject").val());

        for (var i = 0; i < objData.length; i++) {
            const codeMatch = objData[i].trPMEvaluationMaterial_txtTestCode.toUpperCase() === txtTestCode.toUpperCase();
            const isDifferentID = currentID == null || objData[i].trPMEvaluationMaterial_txtPMEvaluationMaterialID !== currentID;

            if (codeMatch && isDifferentID) {
                context = "false";
                break;
            }
        }
    }
    if (tab === 'packaging') {
        var objData = JSON.parse($("#txtHiddenDetailPackagingObject").val());

        for (var i = 0; i < objData.length; i++) {
            const codeMatch = objData[i].trPMEvaluationPackaging_txtTestCode.toUpperCase() === txtTestCode.toUpperCase();
            const isDifferentID = currentID == null || objData[i].trPMEvaluationPackaging_txtPMEvaluationPackagingID !== currentID;

            if (codeMatch && isDifferentID) {
                context = "false";
                break;
            }
        }
    }
    if (tab === 'contaminant') {
        var objData = JSON.parse($("#txtHiddenDetailContaminantObject").val());

        for (var i = 0; i < objData.length; i++) {
            const codeMatch = objData[i].trPMEvaluationContaminant_txtTestCode.toUpperCase() === txtTestCode.toUpperCase();
            const isDifferentID = currentID == null || objData[i].trPMEvaluationContaminant_txtPMEvaluationContaminantID !== currentID;

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
            p_UItrPMEvaluationVisualToData();

            var tab = 'visual';
            if ($('#tableVisual tbody td').length > 1) {
                //if ($('#trPMEvaluationVisual_txtTestCode').val() == "") {
                //    //$('#modalRisk').modal('hide');
                //    clsGlobal.getAlert("Pastikan bahwa semua kolom sudah Anda isi!!!!!!");
                //}
                if (!validateFormTabVisual()) {
                    return;
                }
                else if (GetValidateDetail($('#trPMEvaluationVisual_txtTestCode').val(), tab, $('#trPMEvaluationVisual_txtPMEvaluationVisualID').val()) == "false") {
                    //$('#modalVisual').modal('hide');
                    clsGlobal.getAlert("Test Code " + $('#trPMEvaluationVisual_txtTestCode').val() + " already exist!!!");
                }
                else {

                    var b = $('#SaveEditDetailVisual').val();
                    if ($('#SaveEditDetailVisual').val() == "SUBMIT") {
                        var txtPMEvaluationVisualID = generateUUID();
                        let visualLineCounter = tableVisual.rows().count() + 1;
                        tableVisual.row.add([
                            '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowVisual(this)" class="btn btn-primary btn-sm me-1 btnEditVisual" title="Edit">' +
                            '<i class="ti ti-pencil"></i>' +
                            '</button>' +
                            '<button type="button" onclick="deleteRowVisualdata(this)" class="btn btn-danger btn-sm btnDeleteVisual" title="Delete">' +
                            '<i class="ti ti-trash"></i>' +
                            '</button>' +
                            '</div>',
                            txtPMEvaluationVisualID,
                            visualLineCounter++,
                            $('#trPMEvaluationVisual_intTestID').val(),
                            $('#trPMEvaluationVisual_txtTestCode').val(),
                            $('#trPMEvaluationVisual_txtTestClass').val(),
                            $('#trPMEvaluationVisual_txtTestUnit').val(),
                            $('#trPMEvaluationVisual_txtTestMethodCode').val(),
                            $('#trPMEvaluationVisual_txtTestType').val(),
                            $('#trPMEvaluationVisual_txtTarget').val(),
                            $('#trPMEvaluationVisual_txtMin').val(),
                            $('#trPMEvaluationVisual_txtMax').val(),
                            $('#trPMEvaluationVisual_txtResult').val(),
                            $('#trPMEvaluationVisual_txtStatus').val(),
                            $('#trPMEvaluationVisual_txtDetail').val(),
                            /*$('#trPMEvaluationVisual_bitNotAnalyzed').is(':checked')*/
                            $('#trPMEvaluationVisual_bitNotAnalyzed').prop('checked') ? true : false
                        ]).draw(false);

                        p_UItrPMEvaluationVisualToData();
                        $('#modalVisual').modal('hide');
                    } else {
                        //$.blockUI();

                        tableVisual.clear().draw(false);

                        var jsonData = JSON.parse($("#txtHiddenDetailVisualObject").val());
                        for (var i = 0; i < jsonData.length; i++) {
                            if ((jsonData[i].trPMEvaluationVisual_txtPMEvaluationVisualID == $('#trPMEvaluationVisual_txtPMEvaluationVisualID').val())) {

                                tableVisual.row.add([
                                    '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowVisual(this)" class="btn btn-primary btn-sm me-1 btnEditVisual" title="Edit">' +
                                    '<i class="ti ti-pencil"></i>' +
                                    '</button>' +
                                    '<button type="button" onclick="deleteRowVisualdata(this)" class="btn btn-danger btn-sm btnDeleteVisual" title="Delete">' +
                                    '<i class="ti ti-trash"></i>' +
                                    '</button>' +
                                    '</div>',
                                    $('#trPMEvaluationVisual_txtPMEvaluationVisualID').val(),
                                    $('#trPMEvaluationVisual_intLineID').val(),
                                    $('#trPMEvaluationVisual_intTestID').val(),
                                    $('#trPMEvaluationVisual_txtTestCode').val(),
                                    $('#trPMEvaluationVisual_txtTestClass').val(),
                                    $('#trPMEvaluationVisual_txtTestUnit').val(),
                                    $('#trPMEvaluationVisual_txtTestMethodCode').val(),
                                    $('#trPMEvaluationVisual_txtTestType').val(),
                                    $('#trPMEvaluationVisual_txtTarget').val(),
                                    $('#trPMEvaluationVisual_txtMin').val(),
                                    $('#trPMEvaluationVisual_txtMax').val(),
                                    $('#trPMEvaluationVisual_txtResult').val(),
                                    $('#trPMEvaluationVisual_txtStatus').val(),
                                    $('#trPMEvaluationVisual_txtDetail').val(),
                                    //    $('#trPMEvaluationVisual_bitNotAnalyzed').is(':checked')
                                    $('#trPMEvaluationVisual_bitNotAnalyzed').prop('checked') ? true : false
                                ]).draw(false);
                            } else {


                                tableVisual.row.add([
                                    '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowVisual(this)" class="btn btn-primary btn-sm me-1 btnEditVisual" title="Edit">' +
                                    '<i class="ti ti-pencil"></i>' +
                                    '</button>' +
                                    '<button type="button" onclick="deleteRowVisualdata(this)" class="btn btn-danger btn-sm btnDeleteVisual" title="Delete">' +
                                    '<i class="ti ti-trash"></i>' +
                                    '</button>' +
                                    '</div>',
                                    jsonData[i].trPMEvaluationVisual_txtPMEvaluationVisualID,
                                    jsonData[i].trPMEvaluationVisual_intLineID,
                                    jsonData[i].trPMEvaluationVisual_intTestID,
                                    jsonData[i].trPMEvaluationVisual_txtTestCode,
                                    jsonData[i].trPMEvaluationVisual_txtTestClass,
                                    jsonData[i].trPMEvaluationVisual_txtTestUnit,
                                    jsonData[i].trPMEvaluationVisual_txtTestMethodCode,
                                    jsonData[i].trPMEvaluationVisual_txtTestType,
                                    jsonData[i].trPMEvaluationVisual_txtTarget,
                                    jsonData[i].trPMEvaluationVisual_txtMin,
                                    jsonData[i].trPMEvaluationVisual_txtMax,
                                    jsonData[i].trPMEvaluationVisual_txtResult,
                                    jsonData[i].trPMEvaluationVisual_txtStatus,
                                    jsonData[i].trPMEvaluationVisual_txtDetail,
                                    //    jsonData[i].trPMEvaluationVisual_bitNotAnalyzed
                                    /*jsonData[i].trPMEvaluationVisual_bitNotAnalyzed === true ? true : false*/
                                    (jsonData[i].trPMEvaluationVisual_bitNotAnalyzed === true || jsonData[i].trPMEvaluationVisual_bitNotAnalyzed === "true")
                                ]).draw(false);
                            }
                        }
                        p_UItrPMEvaluationVisualToData();
                        $('#modalVisual').modal('hide');
                        //    $.UnblockUI();
                    }
                };
            } else {
                //if ($('#trPMEvaluationVisual_txtTestCode').val() == "") {
                //    //$('#modalVisual').modal('hide');
                //    clsGlobal.getAlert("Pastikan bahwa semua kolom sudah Anda isi!!!!!!");
                //}
                if (!validateFormTabVisual()) {
                    return;
                }
                else {

                    var b = $('#SaveEditDetailVisual').val();
                    if ($('#SaveEditDetailVisual').val() == "SUBMIT") {
                        var txtPMEvaluationVisualID = generateUUID();
                        let visualLineCounter = tableVisual.rows().count() + 1;
                        tableVisual.row.add([
                            '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowVisual(this)" class="btn btn-primary btn-sm me-1 btnEditVisual" title="Edit">' +
                            '<i class="ti ti-pencil"></i>' +
                            '</button>' +
                            '<button type="button" onclick="deleteRowVisualdata(this)" class="btn btn-danger btn-sm btnDeleteVisual" title="Delete">' +
                            '<i class="ti ti-trash"></i>' +
                            '</button>' +
                            '</div>',
                            txtPMEvaluationVisualID,
                            visualLineCounter++,
                            $('#trPMEvaluationVisual_intTestID').val(),
                            $('#trPMEvaluationVisual_txtTestCode').val(),
                            $('#trPMEvaluationVisual_txtTestClass').val(),
                            $('#trPMEvaluationVisual_txtTestUnit').val(),
                            $('#trPMEvaluationVisual_txtTestMethodCode').val(),
                            $('#trPMEvaluationVisual_txtTestType').val(),
                            $('#trPMEvaluationVisual_txtTarget').val(),
                            $('#trPMEvaluationVisual_txtMin').val(),
                            $('#trPMEvaluationVisual_txtMax').val(),
                            $('#trPMEvaluationVisual_txtResult').val(),
                            $('#trPMEvaluationVisual_txtStatus').val(),
                            $('#trPMEvaluationVisual_txtDetail').val(),
                            //    $('#trPMEvaluationVisual_bitNotAnalyzed').is(':checked')
                            $('#trPMEvaluationVisual_bitNotAnalyzed').prop('checked') ? true : false
                        ]).draw(false);
                        p_UItrPMEvaluationVisualToData();
                        $('#modalVisual').modal('hide');
                    } else {
                        //$.blockUI();

                        tableVisual.clear().draw(false);

                        var jsonData = JSON.parse($("#txtHiddenDetailVisualObject").val());
                        for (var i = 0; i < jsonData.length; i++) {
                            if ((jsonData[i].trPMEvaluationVisual_txtPMEvaluationVisualID == $('#trPMEvaluationVisual_txtPMEvaluationVisualID').val())) {

                                tableVisual.row.add([
                                    '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowVisual(this)" class="btn btn-primary btn-sm me-1 btnEditVisual" title="Edit">' +
                                    '<i class="ti ti-pencil"></i>' +
                                    '</button>' +
                                    '<button type="button" onclick="deleteRowVisualdata(this)" class="btn btn-danger btn-sm btnDeleteVisual" title="Delete">' +
                                    '<i class="ti ti-trash"></i>' +
                                    '</button>' +
                                    '</div>',
                                    $('#trPMEvaluationVisual_txtPMEvaluationVisualID').val(),
                                    $('#trPMEvaluationVisual_intLineID').val(),
                                    $('#trPMEvaluationVisual_intTestID').val(),
                                    $('#trPMEvaluationVisual_txtTestCode').val(),
                                    $('#trPMEvaluationVisual_txtTestClass').val(),
                                    $('#trPMEvaluationVisual_txtTestUnit').val(),
                                    $('#trPMEvaluationVisual_txtTestMethodCode').val(),
                                    $('#trPMEvaluationVisual_txtTestType').val(),
                                    $('#trPMEvaluationVisual_txtTarget').val(),
                                    $('#trPMEvaluationVisual_txtMin').val(),
                                    $('#trPMEvaluationVisual_txtMax').val(),
                                    $('#trPMEvaluationVisual_txtResult').val(),
                                    $('#trPMEvaluationVisual_txtStatus').val(),
                                    $('#trPMEvaluationVisual_txtDetail').val(),
                                    //    $('#trPMEvaluationVisual_bitNotAnalyzed').is(':checked')
                                    $('#trPMEvaluationVisual_bitNotAnalyzed').prop('checked') ? true : false
                                ]).draw(false);
                            } else {


                                tableVisual.row.add([
                                    '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowVisual(this)" class="btn btn-primary btn-sm me-1 btnEditVisual" title="Edit">' +
                                    '<i class="ti ti-pencil"></i>' +
                                    '</button>' +
                                    '<button type="button" onclick="deleteRowVisualdata(this)" class="btn btn-danger btn-sm btnDeleteVisual" title="Delete">' +
                                    '<i class="ti ti-trash"></i>' +
                                    '</button>' +
                                    '</div>',
                                    jsonData[i].trPMEvaluationVisual_txtPMEvaluationVisualID,
                                    jsonData[i].trPMEvaluationVisual_intLineID,
                                    jsonData[i].trPMEvaluationVisual_intTestID,
                                    jsonData[i].trPMEvaluationVisual_txtTestCode,
                                    jsonData[i].trPMEvaluationVisual_txtTestClass,
                                    jsonData[i].trPMEvaluationVisual_txtTestUnit,
                                    jsonData[i].trPMEvaluationVisual_txtTestMethodCode,
                                    jsonData[i].trPMEvaluationVisual_txtTestType,
                                    jsonData[i].trPMEvaluationVisual_txtTarget,
                                    jsonData[i].trPMEvaluationVisual_txtMin,
                                    jsonData[i].trPMEvaluationVisual_txtMax,
                                    jsonData[i].trPMEvaluationVisual_txtResult,
                                    jsonData[i].trPMEvaluationVisual_txtStatus,
                                    jsonData[i].trPMEvaluationVisual_txtDetail,
                                    //    jsonData[i].trPMEvaluationVisual_bitNotAnalyzed
                                    //    jsonData[i].trPMEvaluationVisual_bitNotAnalyzed === true ? true : false
                                    (jsonData[i].trPMEvaluationVisual_bitNotAnalyzed === true || jsonData[i].trPMEvaluationVisual_bitNotAnalyzed === "true")
                                ]).draw(false);
                            }
                        }
                        p_UItrPMEvaluationVisualToData();
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

            p_UItrPMEvaluationDimensionToData();

            var tab = 'dimension';
            if ($('#tableDimension tbody td').length > 1) {
                //if ($('#trPMEvaluationDimension_txtTestCode').val() == "") {
                //    //$('#modalRisk').modal('hide');
                //    clsGlobal.getAlert("Pastikan bahwa semua kolom sudah Anda isi!!!!!!");
                //}
                if (!validateFormTabDimension()) {
                    return;
                }
                else if (GetValidateDetail($('#trPMEvaluationDimension_txtTestCode').val(), tab, $('#trPMEvaluationDimension_txtPMEvaluationDimensionID').val()) == "false") {
                    //$('#modalVisual').modal('hide');
                    clsGlobal.getAlert("Test Code " + $('#trPMEvaluationDimension_txtTestCode').val() + " already exist!!!");
                }
                else {

                    var b = $('#SaveEditDetailDimension').val();
                    if ($('#SaveEditDetailDimension').val() == "SUBMIT") {
                        var txtPMEvaluationDimensionID = generateUUID();
                        let DimensionLineCounter = tableDimension.rows().count() + 1;
                        tableDimension.row.add([
                            '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowDimension(this)" class="btn btn-primary btn-sm me-1 btnEditDimension" title="Edit">' +
                            '<i class="ti ti-pencil"></i>' +
                            '</button>' +
                            '<button type="button" onclick="deleteRowDimensiondata(this)" class="btn btn-danger btn-sm btnDeleteDimension" title="Delete">' +
                            '<i class="ti ti-trash"></i>' +
                            '</button>' +
                            '</div>',
                            txtPMEvaluationDimensionID,
                            DimensionLineCounter++,
                            $('#trPMEvaluationDimension_intTestID').val(),
                            $('#trPMEvaluationDimension_txtTestCode').val(),
                            $('#trPMEvaluationDimension_txtTestClass').val(),
                            $('#trPMEvaluationDimension_txtTestUnit').val(),
                            $('#trPMEvaluationDimension_txtTestMethodCode').val(),
                            $('#trPMEvaluationDimension_txtTestType').val(),
                            $('#trPMEvaluationDimension_txtTarget').val(),
                            $('#trPMEvaluationDimension_txtMin').val(),
                            $('#trPMEvaluationDimension_txtMax').val(),
                            $('#trPMEvaluationDimension_txtResult').val(),
                            $('#trPMEvaluationDimension_txtStatus').val(),
                            $('#trPMEvaluationDimension_txtDetail').val(),
                            //    $('#trPMEvaluationDimension_bitNotAnalyzed').is(':checked')
                            $('#trPMEvaluationDimension_bitNotAnalyzed').prop('checked') ? true : false
                        ]).draw(false);

                        p_UItrPMEvaluationDimensionToData();
                        $('#modalDimension').modal('hide');
                    } else {
                        //$.blockUI();

                        tableDimension.clear().draw(false);

                        var jsonData = JSON.parse($("#txtHiddenDetailDimensionObject").val());
                        for (var i = 0; i < jsonData.length; i++) {
                            if ((jsonData[i].trPMEvaluationDimension_txtPMEvaluationDimensionID == $('#trPMEvaluationDimension_txtPMEvaluationDimensionID').val())) {

                                tableDimension.row.add([
                                    '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowDimension(this)" class="btn btn-primary btn-sm me-1 btnEditDimension" title="Edit">' +
                                    '<i class="ti ti-pencil"></i>' +
                                    '</button>' +
                                    '<button type="button" onclick="deleteRowDimensiondata(this)" class="btn btn-danger btn-sm btnDeleteDimension" title="Delete">' +
                                    '<i class="ti ti-trash"></i>' +
                                    '</button>' +
                                    '</div>',
                                    $('#trPMEvaluationDimension_txtPMEvaluationDimensionID').val(),
                                    $('#trPMEvaluationDimension_intLineID').val(),
                                    $('#trPMEvaluationDimension_intTestID').val(),
                                    $('#trPMEvaluationDimension_txtTestCode').val(),
                                    $('#trPMEvaluationDimension_txtTestClass').val(),
                                    $('#trPMEvaluationDimension_txtTestUnit').val(),
                                    $('#trPMEvaluationDimension_txtTestMethodCode').val(),
                                    $('#trPMEvaluationDimension_txtTestType').val(),
                                    $('#trPMEvaluationDimension_txtTarget').val(),
                                    $('#trPMEvaluationDimension_txtMin').val(),
                                    $('#trPMEvaluationDimension_txtMax').val(),
                                    $('#trPMEvaluationDimension_txtResult').val(),
                                    $('#trPMEvaluationDimension_txtStatus').val(),
                                    $('#trPMEvaluationDimension_txtDetail').val(),
                                    $('#trPMEvaluationDimension_bitNotAnalyzed').prop('checked') ? true : false
                                ]).draw(false);
                            } else {


                                tableDimension.row.add([
                                    '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowDimension(this)" class="btn btn-primary btn-sm me-1 btnEditDimension" title="Edit">' +
                                    '<i class="ti ti-pencil"></i>' +
                                    '</button>' +
                                    '<button type="button" onclick="deleteRowDimensiondata(this)" class="btn btn-danger btn-sm btnDeleteDimension" title="Delete">' +
                                    '<i class="ti ti-trash"></i>' +
                                    '</button>' +
                                    '</div>',
                                    jsonData[i].trPMEvaluationDimension_txtPMEvaluationDimensionID,
                                    jsonData[i].trPMEvaluationDimension_intLineID,
                                    jsonData[i].trPMEvaluationDimension_intTestID,
                                    jsonData[i].trPMEvaluationDimension_txtTestCode,
                                    jsonData[i].trPMEvaluationDimension_txtTestClass,
                                    jsonData[i].trPMEvaluationDimension_txtTestUnit,
                                    jsonData[i].trPMEvaluationDimension_txtTestMethodCode,
                                    jsonData[i].trPMEvaluationDimension_txtTestType,
                                    jsonData[i].trPMEvaluationDimension_txtTarget,
                                    jsonData[i].trPMEvaluationDimension_txtMin,
                                    jsonData[i].trPMEvaluationDimension_txtMax,
                                    jsonData[i].trPMEvaluationDimension_txtResult,
                                    jsonData[i].trPMEvaluationDimension_txtStatus,
                                    jsonData[i].trPMEvaluationDimension_txtDetail,
                                    /*jsonData[i].trPMEvaluationDimension_bitNotAnalyzed*/
                                    (jsonData[i].trPMEvaluationDimension_bitNotAnalyzed === true || jsonData[i].trPMEvaluationDimension_bitNotAnalyzed === "true")
                                ]).draw(false);
                            }
                        }
                        p_UItrPMEvaluationDimensionToData();
                        $('#modalDimension').modal('hide');
                        //    $.UnblockUI();
                    }
                };
            } else {
                //if ($('#trPMEvaluationDimension_txtTestCode').val() == "") {
                //    //$('#modalDimension').modal('hide');
                //    clsGlobal.getAlert("Pastikan bahwa semua kolom sudah Anda isi!!!!!!");
                //}
                if (!validateFormTabDimension()) {
                    return;
                }
                else {

                    var b = $('#SaveEditDetailDimension').val();
                    if ($('#SaveEditDetailDimension').val() == "SUBMIT") {
                        var txtPMEvaluationDimensionID = generateUUID();
                        let DimensionLineCounter = tableDimension.rows().count() + 1;
                        tableDimension.row.add([
                            '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowDimension(this)" class="btn btn-primary btn-sm me-1 btnEditDimension" title="Edit">' +
                            '<i class="ti ti-pencil"></i>' +
                            '</button>' +
                            '<button type="button" onclick="deleteRowDimensiondata(this)" class="btn btn-danger btn-sm btnDeleteDimension" title="Delete">' +
                            '<i class="ti ti-trash"></i>' +
                            '</button>' +
                            '</div>',
                            txtPMEvaluationDimensionID,
                            DimensionLineCounter++,
                            $('#trPMEvaluationDimension_intTestID').val(),
                            $('#trPMEvaluationDimension_txtTestCode').val(),
                            $('#trPMEvaluationDimension_txtTestClass').val(),
                            $('#trPMEvaluationDimension_txtTestUnit').val(),
                            $('#trPMEvaluationDimension_txtTestMethodCode').val(),
                            $('#trPMEvaluationDimension_txtTestType').val(),
                            $('#trPMEvaluationDimension_txtTarget').val(),
                            $('#trPMEvaluationDimension_txtMin').val(),
                            $('#trPMEvaluationDimension_txtMax').val(),
                            $('#trPMEvaluationDimension_txtResult').val(),
                            $('#trPMEvaluationDimension_txtStatus').val(),
                            $('#trPMEvaluationDimension_txtDetail').val(),
                            $('#trPMEvaluationDimension_bitNotAnalyzed').prop('checked') ? true : false
                        ]).draw(false);
                        p_UItrPMEvaluationDimensionToData();
                        $('#modalDimension').modal('hide');
                    } else {
                        //$.blockUI();

                        tableDimension.clear().draw(false);

                        var jsonData = JSON.parse($("#txtHiddenDetailDimensionObject").val());
                        for (var i = 0; i < jsonData.length; i++) {
                            if ((jsonData[i].trPMEvaluationDimension_txtPMEvaluationDimensionID == $('#trPMEvaluationDimension_txtPMEvaluationDimensionID').val())) {

                                tableDimension.row.add([
                                    '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowDimension(this)" class="btn btn-primary btn-sm me-1 btnEditDimension" title="Edit">' +
                                    '<i class="ti ti-pencil"></i>' +
                                    '</button>' +
                                    '<button type="button" onclick="deleteRowDimensiondata(this)" class="btn btn-danger btn-sm btnDeleteDimension" title="Delete">' +
                                    '<i class="ti ti-trash"></i>' +
                                    '</button>' +
                                    '</div>',
                                    $('#trPMEvaluationDimension_txtPMEvaluationDimensionID').val(),
                                    $('#trPMEvaluationDimension_intLineID').val(),
                                    $('#trPMEvaluationDimension_intTestID').val(),
                                    $('#trPMEvaluationDimension_txtTestCode').val(),
                                    $('#trPMEvaluationDimension_txtTestClass').val(),
                                    $('#trPMEvaluationDimension_txtTestUnit').val(),
                                    $('#trPMEvaluationDimension_txtTestMethodCode').val(),
                                    $('#trPMEvaluationDimension_txtTestType').val(),
                                    $('#trPMEvaluationDimension_txtTarget').val(),
                                    $('#trPMEvaluationDimension_txtMin').val(),
                                    $('#trPMEvaluationDimension_txtMax').val(),
                                    $('#trPMEvaluationDimension_txtResult').val(),
                                    $('#trPMEvaluationDimension_txtStatus').val(),
                                    $('#trPMEvaluationDimension_txtDetail').val(),
                                    $('#trPMEvaluationDimension_bitNotAnalyzed').prop('checked') ? true : false
                                ]).draw(false);
                            } else {


                                tableDimension.row.add([
                                    '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowDimension(this)" class="btn btn-primary btn-sm me-1 btnEditDimension" title="Edit">' +
                                    '<i class="ti ti-pencil"></i>' +
                                    '</button>' +
                                    '<button type="button" onclick="deleteRowDimensiondata(this)" class="btn btn-danger btn-sm btnDeleteDimension" title="Delete">' +
                                    '<i class="ti ti-trash"></i>' +
                                    '</button>' +
                                    '</div>',
                                    jsonData[i].trPMEvaluationDimension_txtPMEvaluationDimensionID,
                                    jsonData[i].trPMEvaluationDimension_intLineID,
                                    jsonData[i].trPMEvaluationDimension_intTestID,
                                    jsonData[i].trPMEvaluationDimension_txtTestCode,
                                    jsonData[i].trPMEvaluationDimension_txtTestClass,
                                    jsonData[i].trPMEvaluationDimension_txtTestUnit,
                                    jsonData[i].trPMEvaluationDimension_txtTestMethodCode,
                                    jsonData[i].trPMEvaluationDimension_txtTestType,
                                    jsonData[i].trPMEvaluationDimension_txtTarget,
                                    jsonData[i].trPMEvaluationDimension_txtMin,
                                    jsonData[i].trPMEvaluationDimension_txtMax,
                                    jsonData[i].trPMEvaluationDimension_txtResult,
                                    jsonData[i].trPMEvaluationDimension_txtStatus,
                                    jsonData[i].trPMEvaluationDimension_txtDetail,
                                    (jsonData[i].trPMEvaluationDimension_bitNotAnalyzed === true || jsonData[i].trPMEvaluationDimension_bitNotAnalyzed === "true")
                                ]).draw(false);
                            }
                        }
                        p_UItrPMEvaluationDimensionToData();
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

            p_UItrPMEvaluationMaterialToData();

            var tab = 'material';
            if ($('#tableMaterial tbody td').length > 1) {
                //if ($('#trPMEvaluationMaterial_txtTestCode').val() == "") {
                //    //$('#modalRisk').modal('hide');
                //    clsGlobal.getAlert("Pastikan bahwa semua kolom sudah Anda isi!!!!!!");
                //}
                if (!validateFormTabMaterial()) {
                    return;
                }
                else if (GetValidateDetail($('#trPMEvaluationMaterial_txtTestCode').val(), tab, $('#trPMEvaluationMaterial_txtPMEvaluationMaterialID').val()) == "false") {
                    //$('#modalVisual').modal('hide');
                    clsGlobal.getAlert("Test Code " + $('#trPMEvaluationMaterial_txtTestCode').val() + " already exist!!!");
                }
                else {

                    var b = $('#SaveEditDetailMaterial').val();
                    if ($('#SaveEditDetailMaterial').val() == "SUBMIT") {
                        var txtPMEvaluationMaterialID = generateUUID();
                        let MaterialLineCounter = tableMaterial.rows().count() + 1;
                        tableMaterial.row.add([
                            '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowMaterial(this)" class="btn btn-primary btn-sm me-1 btnEditMaterial" title="Edit">' +
                            '<i class="ti ti-pencil"></i>' +
                            '</button>' +
                            '<button type="button" onclick="deleteRowMaterialdata(this)" class="btn btn-danger btn-sm btnDeleteMaterial" title="Delete">' +
                            '<i class="ti ti-trash"></i>' +
                            '</button>' +
                            '</div>',
                            txtPMEvaluationMaterialID,
                            MaterialLineCounter++,
                            $('#trPMEvaluationMaterial_intTestID').val(),
                            $('#trPMEvaluationMaterial_txtTestCode').val(),
                            $('#trPMEvaluationMaterial_txtTestClass').val(),
                            $('#trPMEvaluationMaterial_txtTestUnit').val(),
                            $('#trPMEvaluationMaterial_txtTestMethodCode').val(),
                            $('#trPMEvaluationMaterial_txtTestType').val(),
                            $('#trPMEvaluationMaterial_txtTarget').val(),
                            $('#trPMEvaluationMaterial_txtMin').val(),
                            $('#trPMEvaluationMaterial_txtMax').val(),
                            $('#trPMEvaluationMaterial_txtResult').val(),
                            $('#trPMEvaluationMaterial_txtStatus').val(),
                            $('#trPMEvaluationMaterial_txtDetail').val(),
                            /*$('#trPMEvaluationMaterial_bitNotAnalyzed').is(':checked')*/
                            $('#trPMEvaluationMaterial_bitNotAnalyzed').prop('checked') ? true : false
                        ]).draw(false);

                        p_UItrPMEvaluationMaterialToData();
                        $('#modalMaterial').modal('hide');
                    } else {
                        //$.blockUI();

                        tableMaterial.clear().draw(false);

                        var jsonData = JSON.parse($("#txtHiddenDetailMaterialObject").val());
                        for (var i = 0; i < jsonData.length; i++) {
                            if ((jsonData[i].trPMEvaluationMaterial_txtPMEvaluationMaterialID == $('#trPMEvaluationMaterial_txtPMEvaluationMaterialID').val())) {

                                tableMaterial.row.add([
                                    '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowMaterial(this)" class="btn btn-primary btn-sm me-1 btnEditMaterial" title="Edit">' +
                                    '<i class="ti ti-pencil"></i>' +
                                    '</button>' +
                                    '<button type="button" onclick="deleteRowMaterialdata(this)" class="btn btn-danger btn-sm btnDeleteMaterial" title="Delete">' +
                                    '<i class="ti ti-trash"></i>' +
                                    '</button>' +
                                    '</div>',
                                    $('#trPMEvaluationMaterial_txtPMEvaluationMaterialID').val(),
                                    $('#trPMEvaluationMaterial_intLineID').val(),
                                    $('#trPMEvaluationMaterial_intTestID').val(),
                                    $('#trPMEvaluationMaterial_txtTestCode').val(),
                                    $('#trPMEvaluationMaterial_txtTestClass').val(),
                                    $('#trPMEvaluationMaterial_txtTestUnit').val(),
                                    $('#trPMEvaluationMaterial_txtTestMethodCode').val(),
                                    $('#trPMEvaluationMaterial_txtTestType').val(),
                                    $('#trPMEvaluationMaterial_txtTarget').val(),
                                    $('#trPMEvaluationMaterial_txtMin').val(),
                                    $('#trPMEvaluationMaterial_txtMax').val(),
                                    $('#trPMEvaluationMaterial_txtResult').val(),
                                    $('#trPMEvaluationMaterial_txtStatus').val(),
                                    $('#trPMEvaluationMaterial_txtDetail').val(),
                                    $('#trPMEvaluationMaterial_bitNotAnalyzed').prop('checked') ? true : false
                                ]).draw(false);
                            } else {


                                tableMaterial.row.add([
                                    '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowMaterial(this)" class="btn btn-primary btn-sm me-1 btnEditMaterial" title="Edit">' +
                                    '<i class="ti ti-pencil"></i>' +
                                    '</button>' +
                                    '<button type="button" onclick="deleteRowMaterialdata(this)" class="btn btn-danger btn-sm btnDeleteMaterial" title="Delete">' +
                                    '<i class="ti ti-trash"></i>' +
                                    '</button>' +
                                    '</div>',
                                    jsonData[i].trPMEvaluationMaterial_txtPMEvaluationMaterialID,
                                    jsonData[i].trPMEvaluationMaterial_intLineID,
                                    jsonData[i].trPMEvaluationMaterial_intTestID,
                                    jsonData[i].trPMEvaluationMaterial_txtTestCode,
                                    jsonData[i].trPMEvaluationMaterial_txtTestClass,
                                    jsonData[i].trPMEvaluationMaterial_txtTestUnit,
                                    jsonData[i].trPMEvaluationMaterial_txtTestMethodCode,
                                    jsonData[i].trPMEvaluationMaterial_txtTestType,
                                    jsonData[i].trPMEvaluationMaterial_txtTarget,
                                    jsonData[i].trPMEvaluationMaterial_txtMin,
                                    jsonData[i].trPMEvaluationMaterial_txtMax,
                                    jsonData[i].trPMEvaluationMaterial_txtResult,
                                    jsonData[i].trPMEvaluationMaterial_txtStatus,
                                    jsonData[i].trPMEvaluationMaterial_txtDetail,
                                    /*jsonData[i].trPMEvaluationMaterial_bitNotAnalyzed*/
                                    (jsonData[i].trPMEvaluationMaterial_bitNotAnalyzed === true || jsonData[i].trPMEvaluationMaterial_bitNotAnalyzed === "true")
                                ]).draw(false);
                            }
                        }
                        p_UItrPMEvaluationMaterialToData();
                        $('#modalMaterial').modal('hide');
                        //    $.UnblockUI();
                    }
                };
            } else {
                //if ($('#trPMEvaluationMaterial_txtTestCode').val() == "") {
                //    //$('#modalMaterial').modal('hide');
                //    clsGlobal.getAlert("Pastikan bahwa semua kolom sudah Anda isi!!!!!!");
                //}
                if (!validateFormTabMaterial()) {
                    return;
                }
                else {

                    var b = $('#SaveEditDetailMaterial').val();
                    if ($('#SaveEditDetailMaterial').val() == "SUBMIT") {
                        var txtPMEvaluationMaterialID = generateUUID();
                        let MaterialLineCounter = tableMaterial.rows().count() + 1;
                        tableMaterial.row.add([
                            '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowMaterial(this)" class="btn btn-primary btn-sm me-1 btnEditMaterial" title="Edit">' +
                            '<i class="ti ti-pencil"></i>' +
                            '</button>' +
                            '<button type="button" onclick="deleteRowMaterialdata(this)" class="btn btn-danger btn-sm btnDeleteMaterial" title="Delete">' +
                            '<i class="ti ti-trash"></i>' +
                            '</button>' +
                            '</div>',
                            txtPMEvaluationMaterialID,
                            MaterialLineCounter++,
                            $('#trPMEvaluationMaterial_intTestID').val(),
                            $('#trPMEvaluationMaterial_txtTestCode').val(),
                            $('#trPMEvaluationMaterial_txtTestClass').val(),
                            $('#trPMEvaluationMaterial_txtTestUnit').val(),
                            $('#trPMEvaluationMaterial_txtTestMethodCode').val(),
                            $('#trPMEvaluationMaterial_txtTestType').val(),
                            $('#trPMEvaluationMaterial_txtTarget').val(),
                            $('#trPMEvaluationMaterial_txtMin').val(),
                            $('#trPMEvaluationMaterial_txtMax').val(),
                            $('#trPMEvaluationMaterial_txtResult').val(),
                            $('#trPMEvaluationMaterial_txtStatus').val(),
                            $('#trPMEvaluationMaterial_txtDetail').val(),
                            $('#trPMEvaluationMaterial_bitNotAnalyzed').prop('checked') ? true : false
                        ]).draw(false);
                        p_UItrPMEvaluationMaterialToData();
                        $('#modalMaterial').modal('hide');
                    } else {
                        //$.blockUI();

                        tableMaterial.clear().draw(false);

                        var jsonData = JSON.parse($("#txtHiddenDetailMaterialObject").val());
                        for (var i = 0; i < jsonData.length; i++) {
                            if ((jsonData[i].trPMEvaluationMaterial_txtPMEvaluationMaterialID == $('#trPMEvaluationMaterial_txtPMEvaluationMaterialID').val())) {

                                tableMaterial.row.add([
                                    '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowMaterial(this)" class="btn btn-primary btn-sm me-1 btnEditMaterial" title="Edit">' +
                                    '<i class="ti ti-pencil"></i>' +
                                    '</button>' +
                                    '<button type="button" onclick="deleteRowMaterialdata(this)" class="btn btn-danger btn-sm btnDeleteMaterial" title="Delete">' +
                                    '<i class="ti ti-trash"></i>' +
                                    '</button>' +
                                    '</div>',
                                    $('#trPMEvaluationMaterial_txtPMEvaluationMaterialID').val(),
                                    $('#trPMEvaluationMaterial_intLineID').val(),
                                    $('#trPMEvaluationMaterial_intTestID').val(),
                                    $('#trPMEvaluationMaterial_txtTestCode').val(),
                                    $('#trPMEvaluationMaterial_txtTestClass').val(),
                                    $('#trPMEvaluationMaterial_txtTestUnit').val(),
                                    $('#trPMEvaluationMaterial_txtTestMethodCode').val(),
                                    $('#trPMEvaluationMaterial_txtTestType').val(),
                                    $('#trPMEvaluationMaterial_txtTarget').val(),
                                    $('#trPMEvaluationMaterial_txtMin').val(),
                                    $('#trPMEvaluationMaterial_txtMax').val(),
                                    $('#trPMEvaluationMaterial_txtResult').val(),
                                    $('#trPMEvaluationMaterial_txtStatus').val(),
                                    $('#trPMEvaluationMaterial_txtDetail').val(),
                                    $('#trPMEvaluationMaterial_bitNotAnalyzed').prop('checked') ? true : false
                                ]).draw(false);
                            } else {


                                tableMaterial.row.add([
                                    '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowMaterial(this)" class="btn btn-primary btn-sm me-1 btnEditMaterial" title="Edit">' +
                                    '<i class="ti ti-pencil"></i>' +
                                    '</button>' +
                                    '<button type="button" onclick="deleteRowMaterialdata(this)" class="btn btn-danger btn-sm btnDeleteMaterial" title="Delete">' +
                                    '<i class="ti ti-trash"></i>' +
                                    '</button>' +
                                    '</div>',
                                    jsonData[i].trPMEvaluationMaterial_txtPMEvaluationMaterialID,
                                    jsonData[i].trPMEvaluationMaterial_intLineID,
                                    jsonData[i].trPMEvaluationMaterial_intTestID,
                                    jsonData[i].trPMEvaluationMaterial_txtTestCode,
                                    jsonData[i].trPMEvaluationMaterial_txtTestClass,
                                    jsonData[i].trPMEvaluationMaterial_txtTestUnit,
                                    jsonData[i].trPMEvaluationMaterial_txtTestMethodCode,
                                    jsonData[i].trPMEvaluationMaterial_txtTestType,
                                    jsonData[i].trPMEvaluationMaterial_txtTarget,
                                    jsonData[i].trPMEvaluationMaterial_txtMin,
                                    jsonData[i].trPMEvaluationMaterial_txtMax,
                                    jsonData[i].trPMEvaluationMaterial_txtResult,
                                    jsonData[i].trPMEvaluationMaterial_txtStatus,
                                    jsonData[i].trPMEvaluationMaterial_txtDetail,
                                    //    jsonData[i].trPMEvaluationMaterial_bitNotAnalyzed
                                    (jsonData[i].trPMEvaluationMaterial_bitNotAnalyzed === true || jsonData[i].trPMEvaluationMaterial_bitNotAnalyzed === "true")
                                ]).draw(false);
                            }
                        }
                        p_UItrPMEvaluationMaterialToData();
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

            p_UItrPMEvaluationPackagingToData();

            var tab = 'packaging';
            if ($('#tablePackaging tbody td').length > 1) {
                //if ($('#trPMEvaluationPackaging_txtTestCode').val() == "") {
                //    //$('#modalRisk').modal('hide');
                //    clsGlobal.getAlert("Pastikan bahwa semua kolom sudah Anda isi!!!!!!");
                //}
                if (!validateFormTabPackaging()) {
                    return;
                }
                else if (GetValidateDetail($('#trPMEvaluationPackaging_txtTestCode').val(), tab, $('#trPMEvaluationPackaging_txtPMEvaluationPackagingID').val()) == "false") {
                    //$('#modalVisual').modal('hide');
                    clsGlobal.getAlert("Test Code " + $('#trPMEvaluationPackaging_txtTestCode').val() + " already exist!!!");
                }
                else {

                    var b = $('#SaveEditDetailPackaging').val();
                    if ($('#SaveEditDetailPackaging').val() == "SUBMIT") {
                        var txtPMEvaluationPackagingID = generateUUID();
                        let PackagingLineCounter = tablePackaging.rows().count() + 1;
                        tablePackaging.row.add([
                            '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowPackaging(this)" class="btn btn-primary btn-sm me-1 btnEditPackaging" title="Edit">' +
                            '<i class="ti ti-pencil"></i>' +
                            '</button>' +
                            '<button type="button" onclick="deleteRowPackagingdata(this)" class="btn btn-danger btn-sm btnDeletePackaging" title="Delete">' +
                            '<i class="ti ti-trash"></i>' +
                            '</button>' +
                            '</div>',
                            txtPMEvaluationPackagingID,
                            PackagingLineCounter++,
                            $('#trPMEvaluationPackaging_intTestID').val(),
                            $('#trPMEvaluationPackaging_txtTestCode').val(),
                            $('#trPMEvaluationPackaging_txtTestClass').val(),
                            $('#trPMEvaluationPackaging_txtTestUnit').val(),
                            $('#trPMEvaluationPackaging_txtTestMethodCode').val(),
                            $('#trPMEvaluationPackaging_txtTestType').val(),
                            $('#trPMEvaluationPackaging_txtTarget').val(),
                            $('#trPMEvaluationPackaging_txtMin').val(),
                            $('#trPMEvaluationPackaging_txtMax').val(),
                            $('#trPMEvaluationPackaging_txtResult').val(),
                            $('#trPMEvaluationPackaging_txtStatus').val(),
                            $('#trPMEvaluationPackaging_txtDetail').val(),
                            //    $('#trPMEvaluationPackaging_bitNotAnalyzed').is(':checked')
                            $('#trPMEvaluationPackaging_bitNotAnalyzed').prop('checked') ? true : false
                        ]).draw(false);

                        p_UItrPMEvaluationPackagingToData();
                        $('#modalPackaging').modal('hide');
                    } else {
                        //$.blockUI();

                        tablePackaging.clear().draw(false);

                        var jsonData = JSON.parse($("#txtHiddenDetailPackagingObject").val());
                        for (var i = 0; i < jsonData.length; i++) {
                            if ((jsonData[i].trPMEvaluationPackaging_txtPMEvaluationPackagingID == $('#trPMEvaluationPackaging_txtPMEvaluationPackagingID').val())) {

                                tablePackaging.row.add([
                                    '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowPackaging(this)" class="btn btn-primary btn-sm me-1 btnEditPackaging" title="Edit">' +
                                    '<i class="ti ti-pencil"></i>' +
                                    '</button>' +
                                    '<button type="button" onclick="deleteRowPackagingdata(this)" class="btn btn-danger btn-sm btnDeletePackaging" title="Delete">' +
                                    '<i class="ti ti-trash"></i>' +
                                    '</button>' +
                                    '</div>',
                                    $('#trPMEvaluationPackaging_txtPMEvaluationPackagingID').val(),
                                    $('#trPMEvaluationPackaging_intLineID').val(),
                                    $('#trPMEvaluationPackaging_intTestID').val(),
                                    $('#trPMEvaluationPackaging_txtTestCode').val(),
                                    $('#trPMEvaluationPackaging_txtTestClass').val(),
                                    $('#trPMEvaluationPackaging_txtTestUnit').val(),
                                    $('#trPMEvaluationPackaging_txtTestMethodCode').val(),
                                    $('#trPMEvaluationPackaging_txtTestType').val(),
                                    $('#trPMEvaluationPackaging_txtTarget').val(),
                                    $('#trPMEvaluationPackaging_txtMin').val(),
                                    $('#trPMEvaluationPackaging_txtMax').val(),
                                    $('#trPMEvaluationPackaging_txtResult').val(),
                                    $('#trPMEvaluationPackaging_txtStatus').val(),
                                    $('#trPMEvaluationPackaging_txtDetail').val(),
                                    $('#trPMEvaluationPackaging_bitNotAnalyzed').prop('checked') ? true : false
                                ]).draw(false);
                            } else {


                                tablePackaging.row.add([
                                    '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowPackaging(this)" class="btn btn-primary btn-sm me-1 btnEditPackaging" title="Edit">' +
                                    '<i class="ti ti-pencil"></i>' +
                                    '</button>' +
                                    '<button type="button" onclick="deleteRowPackagingdata(this)" class="btn btn-danger btn-sm btnDeletePackaging" title="Delete">' +
                                    '<i class="ti ti-trash"></i>' +
                                    '</button>' +
                                    '</div>',
                                    jsonData[i].trPMEvaluationPackaging_txtPMEvaluationPackagingID,
                                    jsonData[i].trPMEvaluationPackaging_intLineID,
                                    jsonData[i].trPMEvaluationPackaging_intTestID,
                                    jsonData[i].trPMEvaluationPackaging_txtTestCode,
                                    jsonData[i].trPMEvaluationPackaging_txtTestClass,
                                    jsonData[i].trPMEvaluationPackaging_txtTestUnit,
                                    jsonData[i].trPMEvaluationPackaging_txtTestMethodCode,
                                    jsonData[i].trPMEvaluationPackaging_txtTestType,
                                    jsonData[i].trPMEvaluationPackaging_txtTarget,
                                    jsonData[i].trPMEvaluationPackaging_txtMin,
                                    jsonData[i].trPMEvaluationPackaging_txtMax,
                                    jsonData[i].trPMEvaluationPackaging_txtResult,
                                    jsonData[i].trPMEvaluationPackaging_txtStatus,
                                    jsonData[i].trPMEvaluationPackaging_txtDetail,
                                    //    jsonData[i].trPMEvaluationPackaging_bitNotAnalyzed
                                    (jsonData[i].trPMEvaluationPackaging_bitNotAnalyzed === true || jsonData[i].trPMEvaluationPackaging_bitNotAnalyzed === "true")
                                ]).draw(false);
                            }
                        }
                        p_UItrPMEvaluationPackagingToData();
                        $('#modalPackaging').modal('hide');
                        //    $.UnblockUI();
                    }
                };
            } else {
                //if ($('#trPMEvaluationPackaging_txtTestCode').val() == "") {
                //    //$('#modalPackaging').modal('hide');
                //    clsGlobal.getAlert("Pastikan bahwa semua kolom sudah Anda isi!!!!!!");
                //}
                if (!validateFormTabPackaging()) {
                    return;
                }
                else {

                    var b = $('#SaveEditDetailPackaging').val();
                    if ($('#SaveEditDetailPackaging').val() == "SUBMIT") {
                        var txtPMEvaluationPackagingID = generateUUID();
                        let PackagingLineCounter = tablePackaging.rows().count() + 1;
                        tablePackaging.row.add([
                            '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowPackaging(this)" class="btn btn-primary btn-sm me-1 btnEditPackaging" title="Edit">' +
                            '<i class="ti ti-pencil"></i>' +
                            '</button>' +
                            '<button type="button" onclick="deleteRowPackagingdata(this)" class="btn btn-danger btn-sm btnDeletePackaging" title="Delete">' +
                            '<i class="ti ti-trash"></i>' +
                            '</button>' +
                            '</div>',
                            txtPMEvaluationPackagingID,
                            PackagingLineCounter++,
                            $('#trPMEvaluationPackaging_intTestID').val(),
                            $('#trPMEvaluationPackaging_txtTestCode').val(),
                            $('#trPMEvaluationPackaging_txtTestClass').val(),
                            $('#trPMEvaluationPackaging_txtTestUnit').val(),
                            $('#trPMEvaluationPackaging_txtTestMethodCode').val(),
                            $('#trPMEvaluationPackaging_txtTestType').val(),
                            $('#trPMEvaluationPackaging_txtTarget').val(),
                            $('#trPMEvaluationPackaging_txtMin').val(),
                            $('#trPMEvaluationPackaging_txtMax').val(),
                            $('#trPMEvaluationPackaging_txtResult').val(),
                            $('#trPMEvaluationPackaging_txtStatus').val(),
                            $('#trPMEvaluationPackaging_txtDetail').val(),
                            $('#trPMEvaluationPackaging_bitNotAnalyzed').prop('checked') ? true : false
                        ]).draw(false);
                        p_UItrPMEvaluationPackagingToData();
                        $('#modalPackaging').modal('hide');
                    } else {
                        //$.blockUI();

                        tablePackaging.clear().draw(false);

                        var jsonData = JSON.parse($("#txtHiddenDetailPackagingObject").val());
                        for (var i = 0; i < jsonData.length; i++) {
                            if ((jsonData[i].trPMEvaluationPackaging_txtPMEvaluationPackagingID == $('#trPMEvaluationPackaging_txtPMEvaluationPackagingID').val())) {

                                tablePackaging.row.add([
                                    '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowPackaging(this)" class="btn btn-primary btn-sm me-1 btnEditPackaging" title="Edit">' +
                                    '<i class="ti ti-pencil"></i>' +
                                    '</button>' +
                                    '<button type="button" onclick="deleteRowPackagingdata(this)" class="btn btn-danger btn-sm btnDeletePackaging" title="Delete">' +
                                    '<i class="ti ti-trash"></i>' +
                                    '</button>' +
                                    '</div>',
                                    $('#trPMEvaluationPackaging_txtPMEvaluationPackagingID').val(),
                                    $('#trPMEvaluationPackaging_intLineID').val(),
                                    $('#trPMEvaluationPackaging_intTestID').val(),
                                    $('#trPMEvaluationPackaging_txtTestCode').val(),
                                    $('#trPMEvaluationPackaging_txtTestClass').val(),
                                    $('#trPMEvaluationPackaging_txtTestUnit').val(),
                                    $('#trPMEvaluationPackaging_txtTestMethodCode').val(),
                                    $('#trPMEvaluationPackaging_txtTestType').val(),
                                    $('#trPMEvaluationPackaging_txtTarget').val(),
                                    $('#trPMEvaluationPackaging_txtMin').val(),
                                    $('#trPMEvaluationPackaging_txtMax').val(),
                                    $('#trPMEvaluationPackaging_txtResult').val(),
                                    $('#trPMEvaluationPackaging_txtStatus').val(),
                                    $('#trPMEvaluationPackaging_txtDetail').val(),
                                    $('#trPMEvaluationPackaging_bitNotAnalyzed').prop('checked') ? true : false
                                ]).draw(false);
                            } else {


                                tablePackaging.row.add([
                                    '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowPackaging(this)" class="btn btn-primary btn-sm me-1 btnEditPackaging" title="Edit">' +
                                    '<i class="ti ti-pencil"></i>' +
                                    '</button>' +
                                    '<button type="button" onclick="deleteRowPackagingdata(this)" class="btn btn-danger btn-sm btnDeletePackaging" title="Delete">' +
                                    '<i class="ti ti-trash"></i>' +
                                    '</button>' +
                                    '</div>',
                                    jsonData[i].trPMEvaluationPackaging_txtPMEvaluationPackagingID,
                                    jsonData[i].trPMEvaluationPackaging_intLineID,
                                    jsonData[i].trPMEvaluationPackaging_intTestID,
                                    jsonData[i].trPMEvaluationPackaging_txtTestCode,
                                    jsonData[i].trPMEvaluationPackaging_txtTestClass,
                                    jsonData[i].trPMEvaluationPackaging_txtTestUnit,
                                    jsonData[i].trPMEvaluationPackaging_txtTestMethodCode,
                                    jsonData[i].trPMEvaluationPackaging_txtTestType,
                                    jsonData[i].trPMEvaluationPackaging_txtTarget,
                                    jsonData[i].trPMEvaluationPackaging_txtMin,
                                    jsonData[i].trPMEvaluationPackaging_txtMax,
                                    jsonData[i].trPMEvaluationPackaging_txtResult,
                                    jsonData[i].trPMEvaluationPackaging_txtStatus,
                                    jsonData[i].trPMEvaluationPackaging_txtDetail,
                                    (jsonData[i].trPMEvaluationPackaging_bitNotAnalyzed === true || jsonData[i].trPMEvaluationPackaging_bitNotAnalyzed === "true")
                                ]).draw(false);
                            }
                        }
                        p_UItrPMEvaluationPackagingToData();
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

            p_UItrPMEvaluationContaminantToData();

            var tab = 'contaminant';
            if ($('#tableContaminant tbody td').length > 1) {
                //if ($('#trPMEvaluationContaminant_txtTestCode').val() == "") {
                //    //$('#modalRisk').modal('hide');
                //    clsGlobal.getAlert("Pastikan bahwa semua kolom sudah Anda isi!!!!!!");
                //}
                if (!validateFormTabContaminant()) {
                    return;
                }
                else if (GetValidateDetail($('#trPMEvaluationContaminant_txtTestCode').val(), tab, $('#trPMEvaluationContaminant_txtPMEvaluationContaminantID').val()) == "false") {
                    //$('#modalVisual').modal('hide');
                    clsGlobal.getAlert("Test Code " + $('#trPMEvaluationContaminant_txtTestCode').val() + " already exist!!!");
                }
                else {

                    var b = $('#SaveEditDetailContaminant').val();
                    if ($('#SaveEditDetailContaminant').val() == "SUBMIT") {
                        var txtPMEvaluationContaminantID = generateUUID();
                        let ContaminantLineCounter = tableContaminant.rows().count() + 1;
                        tableContaminant.row.add([
                            '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowContaminant(this)" class="btn btn-primary btn-sm me-1 btnEditContaminant" title="Edit">' +
                            '<i class="ti ti-pencil"></i>' +
                            '</button>' +
                            '<button type="button" onclick="deleteRowContaminantdata(this)" class="btn btn-danger btn-sm btnDeleteContaminant" title="Delete">' +
                            '<i class="ti ti-trash"></i>' +
                            '</button>' +
                            '</div>',
                            txtPMEvaluationContaminantID,
                            ContaminantLineCounter++,
                            $('#trPMEvaluationContaminant_intTestID').val(),
                            $('#trPMEvaluationContaminant_txtTestCode').val(),
                            $('#trPMEvaluationContaminant_txtTestClass').val(),
                            $('#trPMEvaluationContaminant_txtTestUnit').val(),
                            $('#trPMEvaluationContaminant_txtTestMethodCode').val(),
                            $('#trPMEvaluationContaminant_txtTestType').val(),
                            $('#trPMEvaluationContaminant_txtTarget').val(),
                            $('#trPMEvaluationContaminant_txtMin').val(),
                            $('#trPMEvaluationContaminant_txtMax').val(),
                            $('#trPMEvaluationContaminant_txtResult').val(),
                            $('#trPMEvaluationContaminant_txtStatus').val(),
                            $('#trPMEvaluationContaminant_txtDetail').val(),
                            /*$('#trPMEvaluationContaminant_bitNotAnalyzed').is(':checked')*/
                            $('#trPMEvaluationContaminant_bitNotAnalyzed').prop('checked') ? true : false
                        ]).draw(false);

                        p_UItrPMEvaluationContaminantToData();
                        $('#modalContaminant').modal('hide');
                    } else {
                        //$.blockUI();

                        tableContaminant.clear().draw(false);

                        var jsonData = JSON.parse($("#txtHiddenDetailContaminantObject").val());
                        for (var i = 0; i < jsonData.length; i++) {
                            if ((jsonData[i].trPMEvaluationContaminant_txtPMEvaluationContaminantID == $('#trPMEvaluationContaminant_txtPMEvaluationContaminantID').val())) {

                                tableContaminant.row.add([
                                    '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowContaminant(this)" class="btn btn-primary btn-sm me-1 btnEditContaminant" title="Edit">' +
                                    '<i class="ti ti-pencil"></i>' +
                                    '</button>' +
                                    '<button type="button" onclick="deleteRowContaminantdata(this)" class="btn btn-danger btn-sm btnDeleteContaminant" title="Delete">' +
                                    '<i class="ti ti-trash"></i>' +
                                    '</button>' +
                                    '</div>',
                                    $('#trPMEvaluationContaminant_txtPMEvaluationContaminantID').val(),
                                    $('#trPMEvaluationContaminant_intLineID').val(),
                                    $('#trPMEvaluationContaminant_intTestID').val(),
                                    $('#trPMEvaluationContaminant_txtTestCode').val(),
                                    $('#trPMEvaluationContaminant_txtTestClass').val(),
                                    $('#trPMEvaluationContaminant_txtTestUnit').val(),
                                    $('#trPMEvaluationContaminant_txtTestMethodCode').val(),
                                    $('#trPMEvaluationContaminant_txtTestType').val(),
                                    $('#trPMEvaluationContaminant_txtTarget').val(),
                                    $('#trPMEvaluationContaminant_txtMin').val(),
                                    $('#trPMEvaluationContaminant_txtMax').val(),
                                    $('#trPMEvaluationContaminant_txtResult').val(),
                                    $('#trPMEvaluationContaminant_txtStatus').val(),
                                    $('#trPMEvaluationContaminant_txtDetail').val(),
                                    $('#trPMEvaluationContaminant_bitNotAnalyzed').prop('checked') ? true : false
                                ]).draw(false);
                            } else {


                                tableContaminant.row.add([
                                    '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowContaminant(this)" class="btn btn-primary btn-sm me-1 btnEditContaminant" title="Edit">' +
                                    '<i class="ti ti-pencil"></i>' +
                                    '</button>' +
                                    '<button type="button" onclick="deleteRowContaminantdata(this)" class="btn btn-danger btn-sm btnDeleteContaminant" title="Delete">' +
                                    '<i class="ti ti-trash"></i>' +
                                    '</button>' +
                                    '</div>',
                                    jsonData[i].trPMEvaluationContaminant_txtPMEvaluationContaminantID,
                                    jsonData[i].trPMEvaluationContaminant_intLineID,
                                    jsonData[i].trPMEvaluationContaminant_intTestID,
                                    jsonData[i].trPMEvaluationContaminant_txtTestCode,
                                    jsonData[i].trPMEvaluationContaminant_txtTestClass,
                                    jsonData[i].trPMEvaluationContaminant_txtTestUnit,
                                    jsonData[i].trPMEvaluationContaminant_txtTestMethodCode,
                                    jsonData[i].trPMEvaluationContaminant_txtTestType,
                                    jsonData[i].trPMEvaluationContaminant_txtTarget,
                                    jsonData[i].trPMEvaluationContaminant_txtMin,
                                    jsonData[i].trPMEvaluationContaminant_txtMax,
                                    jsonData[i].trPMEvaluationContaminant_txtResult,
                                    jsonData[i].trPMEvaluationContaminant_txtStatus,
                                    jsonData[i].trPMEvaluationContaminant_txtDetail,
                                    //    jsonData[i].trPMEvaluationContaminant_bitNotAnalyzed
                                    (jsonData[i].trPMEvaluationContaminant_bitNotAnalyzed === true || jsonData[i].trPMEvaluationContaminant_bitNotAnalyzed === "true")
                                ]).draw(false);
                            }
                        }
                        p_UItrPMEvaluationContaminantToData();
                        $('#modalContaminant').modal('hide');
                        //    $.UnblockUI();
                    }
                };
            } else {
                //if ($('#trPMEvaluationContaminant_txtTestCode').val() == "") {
                //    //$('#modalContaminant').modal('hide');
                //    clsGlobal.getAlert("Pastikan bahwa semua kolom sudah Anda isi!!!!!!");
                //}
                if (!validateFormTabContaminant()) {
                    return;
                }
                else {

                    var b = $('#SaveEditDetailContaminant').val();
                    if ($('#SaveEditDetailContaminant').val() == "SUBMIT") {
                        var txtPMEvaluationContaminantID = generateUUID();
                        let ContaminantLineCounter = tableContaminant.rows().count() + 1;
                        tableContaminant.row.add([
                            '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                            '<button type="button" onclick="editRowContaminant(this)" class="btn btn-primary btn-sm me-1 btnEditContaminant" title="Edit">' +
                            '<i class="ti ti-pencil"></i>' +
                            '</button>' +
                            '<button type="button" onclick="deleteRowContaminantdata(this)" class="btn btn-danger btn-sm btnDeleteContaminant" title="Delete">' +
                            '<i class="ti ti-trash"></i>' +
                            '</button>' +
                            '</div>',
                            txtPMEvaluationContaminantID,
                            ContaminantLineCounter++,
                            $('#trPMEvaluationContaminant_intTestID').val(),
                            $('#trPMEvaluationContaminant_txtTestCode').val(),
                            $('#trPMEvaluationContaminant_txtTestClass').val(),
                            $('#trPMEvaluationContaminant_txtTestUnit').val(),
                            $('#trPMEvaluationContaminant_txtTestMethodCode').val(),
                            $('#trPMEvaluationContaminant_txtTestType').val(),
                            $('#trPMEvaluationContaminant_txtTarget').val(),
                            $('#trPMEvaluationContaminant_txtMin').val(),
                            $('#trPMEvaluationContaminant_txtMax').val(),
                            $('#trPMEvaluationContaminant_txtResult').val(),
                            $('#trPMEvaluationContaminant_txtStatus').val(),
                            $('#trPMEvaluationContaminant_txtDetail').val(),
                            $('#trPMEvaluationContaminant_bitNotAnalyzed').prop('checked') ? true : false
                        ]).draw(false);
                        p_UItrPMEvaluationContaminantToData();
                        $('#modalContaminant').modal('hide');
                    } else {
                        //$.blockUI();

                        tableContaminant.clear().draw(false);

                        var jsonData = JSON.parse($("#txtHiddenDetailContaminantObject").val());
                        for (var i = 0; i < jsonData.length; i++) {
                            if ((jsonData[i].trPMEvaluationContaminant_txtPMEvaluationContaminantID == $('#trPMEvaluationContaminant_txtPMEvaluationContaminantID').val())) {

                                tableContaminant.row.add([
                                    '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowContaminant(this)" class="btn btn-primary btn-sm me-1 btnEditContaminant" title="Edit">' +
                                    '<i class="ti ti-pencil"></i>' +
                                    '</button>' +
                                    '<button type="button" onclick="deleteRowContaminantdata(this)" class="btn btn-danger btn-sm btnDeleteContaminant" title="Delete">' +
                                    '<i class="ti ti-trash"></i>' +
                                    '</button>' +
                                    '</div>',
                                    $('#trPMEvaluationContaminant_txtPMEvaluationContaminantID').val(),
                                    $('#trPMEvaluationContaminant_intLineID').val(),
                                    $('#trPMEvaluationContaminant_intTestID').val(),
                                    $('#trPMEvaluationContaminant_txtTestCode').val(),
                                    $('#trPMEvaluationContaminant_txtTestClass').val(),
                                    $('#trPMEvaluationContaminant_txtTestUnit').val(),
                                    $('#trPMEvaluationContaminant_txtTestMethodCode').val(),
                                    $('#trPMEvaluationContaminant_txtTestType').val(),
                                    $('#trPMEvaluationContaminant_txtTarget').val(),
                                    $('#trPMEvaluationContaminant_txtMin').val(),
                                    $('#trPMEvaluationContaminant_txtMax').val(),
                                    $('#trPMEvaluationContaminant_txtResult').val(),
                                    $('#trPMEvaluationContaminant_txtStatus').val(),
                                    $('#trPMEvaluationContaminant_txtDetail').val(),
                                    $('#trPMEvaluationContaminant_bitNotAnalyzed').prop('checked') ? true : false
                                ]).draw(false);
                            } else {


                                tableContaminant.row.add([
                                    '<div class="text-nowrap" style="text-align:center; min-width:70px">' +
                                    '<button type="button" onclick="editRowContaminant(this)" class="btn btn-primary btn-sm me-1 btnEditContaminant" title="Edit">' +
                                    '<i class="ti ti-pencil"></i>' +
                                    '</button>' +
                                    '<button type="button" onclick="deleteRowContaminantdata(this)" class="btn btn-danger btn-sm btnDeleteContaminant" title="Delete">' +
                                    '<i class="ti ti-trash"></i>' +
                                    '</button>' +
                                    '</div>',
                                    jsonData[i].trPMEvaluationContaminant_txtPMEvaluationContaminantID,
                                    jsonData[i].trPMEvaluationContaminant_intLineID,
                                    jsonData[i].trPMEvaluationContaminant_intTestID,
                                    jsonData[i].trPMEvaluationContaminant_txtTestCode,
                                    jsonData[i].trPMEvaluationContaminant_txtTestClass,
                                    jsonData[i].trPMEvaluationContaminant_txtTestUnit,
                                    jsonData[i].trPMEvaluationContaminant_txtTestMethodCode,
                                    jsonData[i].trPMEvaluationContaminant_txtTestType,
                                    jsonData[i].trPMEvaluationContaminant_txtTarget,
                                    jsonData[i].trPMEvaluationContaminant_txtMin,
                                    jsonData[i].trPMEvaluationContaminant_txtMax,
                                    jsonData[i].trPMEvaluationContaminant_txtResult,
                                    jsonData[i].trPMEvaluationContaminant_txtStatus,
                                    jsonData[i].trPMEvaluationContaminant_txtDetail,
                                    (jsonData[i].trPMEvaluationContaminant_bitNotAnalyzed === true || jsonData[i].trPMEvaluationContaminant_bitNotAnalyzed === "true")
                                ]).draw(false);
                            }
                        }
                        p_UItrPMEvaluationContaminantToData();
                        $('#modalContaminant').modal('hide');
                        //    $.UnblockUI();
                    }
                };
            }

        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    });
//function formatDecimal(input) {
//    let value = input.value;

//    let selectionStart = input.selectionStart;
//    let afterCursor = value.length - selectionStart;

//    let clean = value.replace(/,/g, '').replace(/[^0-9.]/g, '');

//    const hasTrailingDot = clean.endsWith('.') && clean.indexOf('.') === clean.lastIndexOf('.');

//    const parts = clean.split('.');
//    let intPart = parts[0];
//    let decPart = parts[1] || '';

//    if (parts.length > 2) {
//        decPart = parts.slice(1).join('');
//    }

//    decPart = decPart.substring(0, 9);
//    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

//    let formatted = decPart.length > 0
//        ? `${intPart}.${decPart}`
//        : (hasTrailingDot ? `${intPart}.` : intPart);

//    input.value = formatted;

//    const newCursor = input.value.length - afterCursor;
//    input.setSelectionRange(newCursor, newCursor);
//}

// Pasang event blur ke semua input yang punya oninput="formatDecimal(this)"
window.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input[oninput="formatDecimal(this)"]');

    //inputs.forEach(input => {
    //    input.addEventListener('blur', function () {
    //        let value = input.value.replace(/,/g, '');
    //        if (value.includes('.')) return;

    //        let number = parseFloat(value);
    //        if (!isNaN(number)) {
    //            let intPart = Math.floor(number).toString();
    //            intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    //            input.value = `${intPart}.000000000`;
    //        }
    //    });
    //});

    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            //let value = input.value.replace(/,/g, '');
            //if (value.includes('.')) {
            //    // Pastikan maksimal 9 angka setelah titik saat blur
            //    let [intPart, decPart = ''] = value.split('.');
            //    decPart = decPart.padEnd(9, '0').substring(0, 9); // ⬅️ pad to 9 digits
            //    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            //    input.value = `${intPart}.${decPart}`;
            //} else {
            //    let number = parseFloat(value);
            //    if (!isNaN(number)) {
            //        let intPart = Math.floor(number).toString();
            //        intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            //        input.value = `${intPart}.000000000`; // ⬅️ 9 zeros
            //    }
            //}
            formatDecimal(input);
        });
    });
});
function refreshVisualLineIDs() {
    visualLineCounter = 1;
    tableVisual.rows().every(function (rowIdx, tableLoop, rowLoop) {
        let rowData = this.data();
        rowData[3] = visualLineCounter++; // index ke-3 sesuai posisi trPMEvaluationVisual_intLineID
        this.data(rowData);
    });
    tableVisual.draw(false);
}

function refreshDimensionLineIDs() {
    DimensionLineCounter = 1;
    tableDimension.rows().every(function (rowIdx, tableLoop, rowLoop) {
        let rowData = this.data();
        rowData[3] = DimensionLineCounter++; // index ke-3 sesuai posisi trPMEvaluationDimension_intLineID
        this.data(rowData);
    });
    tableDimension.draw(false);
}

function refreshMaterialLineIDs() {
    MaterialLineCounter = 1;
    tableMaterial.rows().every(function (rowIdx, tableLoop, rowLoop) {
        let rowData = this.data();
        rowData[3] = MaterialLineCounter++; // index ke-3 sesuai posisi trPMEvaluationMaterial_intLineID
        this.data(rowData);
    });
    tableMaterial.draw(false);
}

function refreshPackagingLineIDs() {
    PackagingLineCounter = 1;
    tablePackaging.rows().every(function (rowIdx, tableLoop, rowLoop) {
        let rowData = this.data();
        rowData[3] = PackagingLineCounter++; // index ke-3 sesuai posisi trPMEvaluationPackaging_intLineID
        this.data(rowData);
    });
    tablePackaging.draw(false);
}

function refreshContaminantLineIDs() {
    ContaminantLineCounter = 1;
    tableContaminant.rows().every(function (rowIdx, tableLoop, rowLoop) {
        let rowData = this.data();
        rowData[3] = ContaminantLineCounter++; // index ke-3 sesuai posisi trPMEvaluationContaminant_intLineID
        this.data(rowData);
    });
    tableContaminant.draw(false);
}

function evaluateStatus(resultVal, range) {

    const testType = $("#trPMEvaluationVisual_txtTestType").val().trim().toUpperCase();
    const target = $("#trPMEvaluationVisual_txtTarget").val().trim().toUpperCase();
    const result = $("#trPMEvaluationVisual_txtResult").val().trim().toUpperCase();
    const dectarget = $("#trPMEvaluationVisual_decTarget").val();
    const decresult = $("#trPMEvaluationVisual_decResult").val();
    const min = parseFloat($("#trPMEvaluationVisual_txtMin").val());
    const max = parseFloat($("#trPMEvaluationVisual_txtMax").val());
    const decmin = parseFloat($("#trPMEvaluationVisual_decMin").val());
    const decmax = parseFloat($("#trPMEvaluationVisual_decMax").val());
    const bit = $("#trPMEvaluationVisual_bitNotAnalyzed").prop("checked");

    resultVal = resultVal.trim().toUpperCase();
    const numericResult = parseFloat(range.replace(/,/g, ""));
    let status = "NOT OK";

    if (bit) {
        status = "NOT ANALYZED";
    } else {
        if (testType === "V") {
            status = (target === result) ? "OK" : "NOT OK";
        } else if (testType === "T") {
            //    status = (dectarget === decresult) ? "OK" : "NOT OK";
            if (!isNaN(numericResult) && !isNaN(decmin) && !isNaN(decmax)) {
                status = (numericResult >= decmin && numericResult <= decmax) ? "OK" : "NOT OK";
            }
        } else if (testType === "N") {
            const numericResult = parseFloat(resultVal);
            if (!isNaN(numericResult) && !isNaN(min) && !isNaN(max)) {
                status = (numericResult >= min && numericResult <= max) ? "OK" : "NOT OK";
            }
        }
    }


    $("#trPMEvaluationVisual_txtStatus").val(status);
}

function evaluateStatusDimension(resultVal, range) {

    const testType = $("#trPMEvaluationDimension_txtTestType").val().trim().toUpperCase();
    const target = $("#trPMEvaluationDimension_txtTarget").val().trim().toUpperCase();
    const result = $("#trPMEvaluationDimension_txtResult").val().trim().toUpperCase();
    const dectarget = $("#trPMEvaluationDimension_decTarget").val();
    const decresult = $("#trPMEvaluationDimension_decResult").val();
    const min = parseFloat($("#trPMEvaluationDimension_txtMin").val());
    const max = parseFloat($("#trPMEvaluationDimension_txtMax").val());
    const decmin = parseFloat($("#trPMEvaluationDimension_decMin").val());
    const decmax = parseFloat($("#trPMEvaluationDimension_decMax").val());
    const bit = $("#trPMEvaluationDimension_bitNotAnalyzed").prop("checked");

    resultVal = resultVal.trim().toUpperCase();
    const numericResult = parseFloat(range.replace(/,/g, ""));
    let status = "NOT OK";

    if (bit) {
        status = "NOT ANALYZED";
    } else {
        if (testType === "V") {
            status = (target === result) ? "OK" : "NOT OK";
        } else if (testType === "T") {
            /*status = (dectarget === decresult) ? "OK" : "NOT OK";*/
            if (!isNaN(numericResult) && !isNaN(decmin) && !isNaN(decmax)) {
                status = (numericResult >= decmin && numericResult <= decmax) ? "OK" : "NOT OK";
            }
        } else if (testType === "N") {
            const numericResult = parseFloat(resultVal);
            if (!isNaN(numericResult) && !isNaN(min) && !isNaN(max)) {
                status = (numericResult >= min && numericResult <= max) ? "OK" : "NOT OK";
            }
        }
    }

    $("#trPMEvaluationDimension_txtStatus").val(status);
}

function evaluateStatusMaterial(resultVal, range) {

    const testType = $("#trPMEvaluationMaterial_txtTestType").val().trim().toUpperCase();
    const target = $("#trPMEvaluationMaterial_txtTarget").val().trim().toUpperCase();
    const result = $("#trPMEvaluationMaterial_txtResult").val().trim().toUpperCase();
    const dectarget = $("#trPMEvaluationMaterial_decTarget").val();
    const decresult = $("#trPMEvaluationMaterial_decResult").val();
    const min = parseFloat($("#trPMEvaluationMaterial_txtMin").val());
    const max = parseFloat($("#trPMEvaluationMaterial_txtMax").val());
    const decmin = parseFloat($("#trPMEvaluationMaterial_decMin").val());
    const decmax = parseFloat($("#trPMEvaluationMaterial_decMax").val());
    const bit = $("#trPMEvaluationMaterial_bitNotAnalyzed").prop("checked");

    resultVal = resultVal.trim().toUpperCase();
    const numericResult = parseFloat(range.replace(/,/g, ""));
    let status = "NOT OK";

    if (bit) {
        status = "NOT ANALYZED";
    } else {
        if (testType === "V") {
            status = (target === result) ? "OK" : "NOT OK";
        } else if (testType === "T") {
            //    status = (dectarget === decresult) ? "OK" : "NOT OK";
            if (!isNaN(numericResult) && !isNaN(decmin) && !isNaN(decmax)) {
                status = (numericResult >= decmin && numericResult <= decmax) ? "OK" : "NOT OK";
            }
        } else if (testType === "N") {
            const numericResult = parseFloat(resultVal);
            if (!isNaN(numericResult) && !isNaN(min) && !isNaN(max)) {
                status = (numericResult >= min && numericResult <= max) ? "OK" : "NOT OK";
            }
        }
    }

    $("#trPMEvaluationMaterial_txtStatus").val(status);
}

function evaluateStatusPackaging(resultVal, range) {

    const testType = $("#trPMEvaluationPackaging_txtTestType").val().trim().toUpperCase();
    const target = $("#trPMEvaluationPackaging_txtTarget").val().trim().toUpperCase();
    const result = $("#trPMEvaluationPackaging_txtResult").val().trim().toUpperCase();
    const dectarget = $("#trPMEvaluationPackaging_decTarget").val();
    const decresult = $("#trPMEvaluationPackaging_decResult").val();
    const min = parseFloat($("#trPMEvaluationPackaging_txtMin").val());
    const max = parseFloat($("#trPMEvaluationPackaging_txtMax").val());
    const decmin = parseFloat($("#trPMEvaluationPackaging_decMin").val());
    const decmax = parseFloat($("#trPMEvaluationPackaging_decMax").val());
    const bit = $("#trPMEvaluationPackaging_bitNotAnalyzed").prop("checked");

    resultVal = resultVal.trim().toUpperCase();
    const numericResult = parseFloat(range.replace(/,/g, ""));
    let status = "NOT OK";

    if (bit) {
        status = "NOT ANALYZED";
    } else {
        if (testType === "V") {
            status = (target === result) ? "OK" : "NOT OK";
        } else if (testType === "T") {
            //    status = (dectarget === decresult) ? "OK" : "NOT OK";
            if (!isNaN(numericResult) && !isNaN(decmin) && !isNaN(decmax)) {
                status = (numericResult >= decmin && numericResult <= decmax) ? "OK" : "NOT OK";
            }
        } else if (testType === "N") {
            const numericResult = parseFloat(resultVal);
            if (!isNaN(numericResult) && !isNaN(min) && !isNaN(max)) {
                status = (numericResult >= min && numericResult <= max) ? "OK" : "NOT OK";
            }
        }
    }

    $("#trPMEvaluationPackaging_txtStatus").val(status);
}

function evaluateStatusContaminant(resultVal, range) {

    const testType = $("#trPMEvaluationContaminant_txtTestType").val().trim().toUpperCase();
    const target = $("#trPMEvaluationContaminant_txtTarget").val().trim().toUpperCase();
    const result = $("#trPMEvaluationContaminant_txtResult").val().trim().toUpperCase();
    const dectarget = $("#trPMEvaluationContaminant_decTarget").val();
    const decresult = $("#trPMEvaluationContaminant_decResult").val();
    const min = parseFloat($("#trPMEvaluationContaminant_txtMin").val());
    const max = parseFloat($("#trPMEvaluationContaminant_txtMax").val());
    const decmin = parseFloat($("#trPMEvaluationContaminant_decMin").val());
    const decmax = parseFloat($("#trPMEvaluationContaminant_decMax").val());
    const bit = $("#trPMEvaluationContaminant_bitNotAnalyzed").prop("checked");

    resultVal = resultVal.trim().toUpperCase();
    const numericResult = parseFloat(range.replace(/,/g, ""));
    let status = "NOT OK";

    if (bit) {
        status = "NOT ANALYZED";
    } else {
        if (testType === "V") {
            status = (target === result) ? "OK" : "NOT OK";
        } else if (testType === "T") {
            //    status = (dectarget === decresult) ? "OK" : "NOT OK";
            if (!isNaN(numericResult) && !isNaN(decmin) && !isNaN(decmax)) {
                status = (numericResult >= decmin && numericResult <= decmax) ? "OK" : "NOT OK";
            }
        } else if (testType === "N") {
            const numericResult = parseFloat(resultVal);
            if (!isNaN(numericResult) && !isNaN(min) && !isNaN(max)) {
                status = (numericResult >= min && numericResult <= max) ? "OK" : "NOT OK";
            }
        }
    }

    $("#trPMEvaluationContaminant_txtStatus").val(status);
}

//$("#trPMEvaluationVisual_txtTarget").on("change", function () {
//   
//    const testType = $("#trPMEvaluationVisual_txtTestType").val().trim().toUpperCase();

//    if (testType === "N") {
//        const min = parseFloat($("#trPMEvaluationVisual_txtMin").val());
//        const max = parseFloat($("#trPMEvaluationVisual_txtMax").val());
//        const targetValue = parseFloat($(this).val());

//        let status = "NOT OK";

//        if (!isNaN(targetValue) && !isNaN(min) && !isNaN(max)) {
//            status = (targetValue >= min && targetValue <= max) ? "OK" : "NOT OK";
//        }

//        $("#trPMEvaluationVisual_txtStatus").val(status);
//    }
//});

//$("#trPMEvaluationVisual_txtMin").on("change", function () {
//   
//    const testType = $("#trPMEvaluationVisual_txtTestType").val().trim().toUpperCase();

//    if (testType === "N") {
//        const min = parseFloat($("#trPMEvaluationVisual_txtMin").val());
//        const max = parseFloat($("#trPMEvaluationVisual_txtMax").val());
//        const target = parseFloat($("#trPMEvaluationVisual_txtTarget").val());
//        //const targetValue = parseFloat($(this).val());

//        let status = "NOT OK";

//        if (!isNaN(target) && !isNaN(min) && !isNaN(max)) {
//            status = (target >= min && target <= max) ? "OK" : "NOT OK";
//        }

//        $("#trPMEvaluationVisual_txtStatus").val(status);
//    }
//});

//$("#trPMEvaluationVisual_txtMax").on("change", function () {
//   
//    const testType = $("#trPMEvaluationVisual_txtTestType").val().trim().toUpperCase();

//    if (testType === "N") {
//        const min = parseFloat($("#trPMEvaluationVisual_txtMin").val());
//        const max = parseFloat($("#trPMEvaluationVisual_txtMax").val());
//        const targetValue = parseFloat($(this).val());

//        let status = "NOT OK";

//        if (!isNaN(targetValue) && !isNaN(min) && !isNaN(max)) {
//            status = (targetValue >= min && targetValue <= max) ? "OK" : "NOT OK";
//        }

//        $("#trPMEvaluationVisual_txtStatus").val(status);
//    }
//});
function p_StatusVisual(resultVal) {

    const testType = $("#trPMEvaluationVisual_txtTestType").val().trim().toUpperCase();

    if (testType === "N") {
        const min = parseFloat($("#trPMEvaluationVisual_txtMin").val().replace(/,/g, ""));
        const max = parseFloat($("#trPMEvaluationVisual_txtMax").val().replace(/,/g, ""));
        const numericResult = parseFloat(resultVal.replace(/,/g, ""));
        const target = parseFloat($("#trPMEvaluationVisual_txtResult").val());
        const bit = $("#trPMEvaluationVisual_bitNotAnalyzed").prop("checked");
        //const targetValue = parseFloat($(this).val());

        let status = "NOT OK";

        //if (!isNaN(target) && !isNaN(min) && !isNaN(max)) {
        //    status = (target >= min && target <= max) ? "OK" : "NOT OK";
        //}
        if (bit) {
            status = "NOT ANALYZED";
        } else {
            if (testType === "V") {
                status = (target === result) ? "OK" : "NOT OK";
            } else if (testType === "T") {
                status = (target === result) ? "OK" : "NOT OK";
            } else if (testType === "N") {
                //const numericResult = parseFloat(resultVal);
                if (!isNaN(numericResult) && !isNaN(min) && !isNaN(max)) {
                    status = (numericResult >= min && numericResult <= max) ? "OK" : "NOT OK";
                }
            }
        }

        $("#trPMEvaluationVisual_txtStatus").val(status);
    }
}

function p_StatusDimension(resultVal) {

    const testType = $("#trPMEvaluationDimension_txtTestType").val().trim().toUpperCase();

    if (testType === "N") {
        const min = parseFloat($("#trPMEvaluationDimension_txtMin").val().replace(/,/g, ""));
        const max = parseFloat($("#trPMEvaluationDimension_txtMax").val().replace(/,/g, ""));
        const numericResult = parseFloat(resultVal.replace(/,/g, ""));
        const target = parseFloat($("#trPMEvaluationDimension_txtResult").val());
        const bit = $("#trPMEvaluationDimension_bitNotAnalyzed").prop("checked");
        //const targetValue = parseFloat($(this).val());

        let status = "NOT OK";

        //if (!isNaN(target) && !isNaN(min) && !isNaN(max)) {
        //    status = (target >= min && target <= max) ? "OK" : "NOT OK";
        //}
        if (bit) {
            status = "NOT ANALYZED";
        } else {
            if (testType === "V") {
                status = (target === result) ? "OK" : "NOT OK";
            } else if (testType === "T") {
                status = (target === result) ? "OK" : "NOT OK";
            } else if (testType === "N") {
                //const numericResult = parseFloat(resultVal);
                if (!isNaN(numericResult) && !isNaN(min) && !isNaN(max)) {
                    status = (numericResult >= min && numericResult <= max) ? "OK" : "NOT OK";
                }
            }
        }

        $("#trPMEvaluationDimension_txtStatus").val(status);
    }
}

function p_StatusMaterial(resultVal) {

    const testType = $("#trPMEvaluationMaterial_txtTestType").val().trim().toUpperCase();

    if (testType === "N") {
        const min = parseFloat($("#trPMEvaluationMaterial_txtMin").val().replace(/,/g, ""));
        const max = parseFloat($("#trPMEvaluationMaterial_txtMax").val().replace(/,/g, ""));
        const numericResult = parseFloat(resultVal.replace(/,/g, ""));
        const target = parseFloat($("#trPMEvaluationMaterial_txtResult").val());
        const bit = $("#trPMEvaluationMaterial_bitNotAnalyzed").prop("checked");
        //const targetValue = parseFloat($(this).val());

        let status = "NOT OK";

        //if (!isNaN(target) && !isNaN(min) && !isNaN(max)) {
        //    status = (target >= min && target <= max) ? "OK" : "NOT OK";
        //}
        if (bit) {
            status = "NOT ANALYZED";
        } else {
            if (testType === "V") {
                status = (target === result) ? "OK" : "NOT OK";
            } else if (testType === "T") {
                status = (target === result) ? "OK" : "NOT OK";
            } else if (testType === "N") {
                //const numericResult = parseFloat(resultVal);
                if (!isNaN(numericResult) && !isNaN(min) && !isNaN(max)) {
                    status = (numericResult >= min && numericResult <= max) ? "OK" : "NOT OK";
                }
            }
        }

        $("#trPMEvaluationMaterial_txtStatus").val(status);
    }
}

function p_StatusPackaging(resultVal) {

    const testType = $("#trPMEvaluationPackaging_txtTestType").val().trim().toUpperCase();

    if (testType === "N") {
        const min = parseFloat($("#trPMEvaluationPackaging_txtMin").val().replace(/,/g, ""));
        const max = parseFloat($("#trPMEvaluationPackaging_txtMax").val().replace(/,/g, ""));
        const numericResult = parseFloat(resultVal.replace(/,/g, ""));
        const target = parseFloat($("#trPMEvaluationPackaging_txtResult").val());
        const bit = $("#trPMEvaluationPackaging_bitNotAnalyzed").prop("checked");
        //const targetValue = parseFloat($(this).val());

        let status = "NOT OK";

        //if (!isNaN(target) && !isNaN(min) && !isNaN(max)) {
        //    status = (target >= min && target <= max) ? "OK" : "NOT OK";
        //}
        if (bit) {
            status = "NOT ANALYZED";
        } else {
            if (testType === "V") {
                status = (target === result) ? "OK" : "NOT OK";
            } else if (testType === "T") {
                status = (target === result) ? "OK" : "NOT OK";
            } else if (testType === "N") {
                //const numericResult = parseFloat(resultVal);
                if (!isNaN(numericResult) && !isNaN(min) && !isNaN(max)) {
                    status = (numericResult >= min && numericResult <= max) ? "OK" : "NOT OK";
                }
            }
        }

        $("#trPMEvaluationPackaging_txtStatus").val(status);
    }
}

function p_StatusContaminant(resultVal) {

    const testType = $("#trPMEvaluationContaminant_txtTestType").val().trim().toUpperCase();

    if (testType === "N") {
        const min = parseFloat($("#trPMEvaluationContaminant_txtMin").val().replace(/,/g, ""));
        const max = parseFloat($("#trPMEvaluationContaminant_txtMax").val().replace(/,/g, ""));
        const numericResult = parseFloat(resultVal.replace(/,/g, ""));
        const target = parseFloat($("#trPMEvaluationContaminant_txtResult").val());
        const bit = $("#trPMEvaluationContaminant_bitNotAnalyzed").prop("checked");
        //const targetValue = parseFloat($(this).val());

        let status = "NOT OK";

        //if (!isNaN(target) && !isNaN(min) && !isNaN(max)) {
        //    status = (target >= min && target <= max) ? "OK" : "NOT OK";
        //}
        if (bit) {
            status = "NOT ANALYZED";
        } else {
            if (testType === "V") {
                status = (target === result) ? "OK" : "NOT OK";
            } else if (testType === "T") {
                status = (target === result) ? "OK" : "NOT OK";
            } else if (testType === "N") {
                //const numericResult = parseFloat(resultVal);
                if (!isNaN(numericResult) && !isNaN(min) && !isNaN(max)) {
                    status = (numericResult >= min && numericResult <= max) ? "OK" : "NOT OK";
                }
            }
        }

        $("#trPMEvaluationContaminant_txtStatus").val(status);
    }
}

function p_btnLOVTestCodeClick() {
    try {
        LOV = clsGlobal.generateLOV("TEST_CODE_VISUAL", "trPMEvaluationVisual_txtTestCode");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVTestCodeDimensionClick() {
    try {
        LOV = clsGlobal.generateLOV("TEST_CODE_DIMENSION", "trPMEvaluationDimension_txtTestCode");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVTestCodeMaterialClick() {
    try {
        LOV = clsGlobal.generateLOV("TEST_CODE_MATERIAL", "trPMEvaluationMaterial_txtTestCode");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVTestCodePackagingClick() {
    try {
        LOV = clsGlobal.generateLOV("TEST_CODE_PACKAGING", "trPMEvaluationPackaging_txtTestCode");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVTestCodeContaminantClick() {
    try {
        LOV = clsGlobal.generateLOV("TEST_CODE_CONTAMINANT", "trPMEvaluationContaminant_txtTestCode");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVtxtTargetClick() {
    try {
        LOV = clsGlobal.generateLOV("PME_TARGET", "trPMEvaluationVisual_txtTarget", $("#trPMEvaluationVisual_intTestID").val());
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVtxtTargetDimensionClick() {
    try {
        LOV = clsGlobal.generateLOV("PME_TARGET", "trPMEvaluationDimension_txtTarget", $("#trPMEvaluationDimension_intTestID").val());
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVtxtTargetMaterialClick() {
    try {
        LOV = clsGlobal.generateLOV("PME_TARGET", "trPMEvaluationMaterial_txtTarget", $("#trPMEvaluationMaterial_intTestID").val());
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVtxtTargetPackagingClick() {
    try {
        LOV = clsGlobal.generateLOV("PME_TARGET", "trPMEvaluationPackaging_txtTarget", $("#trPMEvaluationPackaging_intTestID").val());
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVtxtTargetContaminantClick() {
    try {
        LOV = clsGlobal.generateLOV("PME_TARGET", "trPMEvaluationContaminant_txtTarget", $("#trPMEvaluationContaminant_intTestID").val());
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

/*Min*/

function p_btnLOVtxtMinClick() {
    try {
        LOV = clsGlobal.generateLOV("PME_TARGET", "trPMEvaluationVisual_txtMin", $("#trPMEvaluationVisual_intTestID").val());
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVtxtMinDimensionClick() {
    try {
        LOV = clsGlobal.generateLOV("PME_TARGET", "trPMEvaluationDimension_txtMin", $("#trPMEvaluationDimension_intTestID").val());
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVtxtMinMaterialClick() {
    try {
        LOV = clsGlobal.generateLOV("PME_TARGET", "trPMEvaluationMaterial_txtMin", $("#trPMEvaluationMaterial_intTestID").val());
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVtxtMinPackagingClick() {
    try {
        LOV = clsGlobal.generateLOV("PME_TARGET", "trPMEvaluationPackaging_txtMin", $("#trPMEvaluationPackaging_intTestID").val());
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVtxtMinContaminantClick() {
    try {
        LOV = clsGlobal.generateLOV("PME_TARGET", "trPMEvaluationContaminant_txtMin", $("#trPMEvaluationContaminant_intTestID").val());
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

//End Min

//Max

function p_btnLOVtxtMaxClick() {
    try {
        LOV = clsGlobal.generateLOV("PME_TARGET", "trPMEvaluationVisual_txtMax", $("#trPMEvaluationVisual_intTestID").val());
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVtxtMaxDimensionClick() {
    try {
        LOV = clsGlobal.generateLOV("PME_TARGET", "trPMEvaluationDimension_txtMax", $("#trPMEvaluationDimension_intTestID").val());
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVtxtMaxMaterialClick() {
    try {
        LOV = clsGlobal.generateLOV("PME_TARGET", "trPMEvaluationMaterial_txtMax", $("#trPMEvaluationMaterial_intTestID").val());
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVtxtMaxPackagingClick() {
    try {
        LOV = clsGlobal.generateLOV("PME_TARGET", "trPMEvaluationPackaging_txtMax", $("#trPMEvaluationPackaging_intTestID").val());
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVtxtMaxContaminantClick() {
    try {
        LOV = clsGlobal.generateLOV("PME_TARGET", "trPMEvaluationContaminant_txtMax", $("#trPMEvaluationContaMaxant_intTestID").val());
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

//EndMax

function p_btnLOVtxtResultClick() {
    try {
        LOV = clsGlobal.generateLOV("PME_TARGET", "trPMEvaluationVisual_txtResult", $("#trPMEvaluationVisual_intTestID").val());
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVtxtResultDimensionClick() {
    try {
        LOV = clsGlobal.generateLOV("PME_TARGET", "trPMEvaluationDimension_txtResult", $("#trPMEvaluationDimension_intTestID").val());
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVtxtResultMaterialClick() {
    try {
        LOV = clsGlobal.generateLOV("PME_TARGET", "trPMEvaluationMaterial_txtResult", $("#trPMEvaluationMaterial_intTestID").val());
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVtxtResultPackagingClick() {
    try {
        LOV = clsGlobal.generateLOV("PME_TARGET", "trPMEvaluationPackaging_txtResult", $("#trPMEvaluationPackaging_intTestID").val());
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVtxtResultContaminantClick() {
    try {
        LOV = clsGlobal.generateLOV("PME_TARGET", "trPMEvaluationContaminant_txtResult", $("#trPMEvaluationContaminant_intTestID").val());
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVCopyFromPMEClick() {
    try {
        LOV = clsGlobal.generateLOV("COPYFROM_PME", "COPYFROM_PME");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

function p_btnLOVCopyFromTemplateSpecClick() {
    try {
        LOV = clsGlobal.generateLOV("COPYFROM_TEMPLATESPEC", "COPYFROM_TEMPLATESPEC");
        //    LOV = clsGlobal.generateLOV(MODULE_LOV_PRINCIPAL_NAME, "txtPrincipalName", $("#txtSupplierName").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
};

/*HANDLER ATTACHMENT*/

//$('#saveAttach').click(function () {

//    var documentType = $('#documentTypeAttachModal').val();
//    var remarks = $('#remarksAttachModal').val();

//    const filedata = $('#fileAttachModal')
//    const fileInput = $('#fileAttachModal')[0];
//    const attachment = fileInput.files[0];

//    $('.text-danger-validation').hide();

//    let isValid = true;

//    if (!documentType) {
//        $('#documentTypeAttachModalError').show();
//        isValid = false;
//    }

//    if (!remarks) {
//        $('#remarksAttachModalError').show();
//        isValid = false;
//    }

//    if (modalStateAttach === "add") {
//        if (!attachment) {
//            $('#fileAttachModalError').show();
//            isValid = false;
//        }
//    }

//    if (isValid) {
//        if (modalStateAttach === "add") {
//            attachmentList.push({
//                attachmentGuid: "",
//                documentType: documentType,
//                remarks: remarks,
//                fileName: !attachment ? attachmentList[indexModal].fileName : attachment.name,
//                file: !attachment ? attachmentList[indexModal].file : attachment.name,
//                attachment: attachment,
//                isUploadFile: true,
//            });
//        } else {
//            attachmentList[indexModal] = {
//                attachmentGuid: attachmentList[indexModal].attachmentGuid,
//                documentType: documentType,
//                remarks: remarks,
//                fileName: !attachment ? attachmentList[indexModal].fileName : attachment.name,
//                file: !attachment ? attachmentList[indexModal].file : attachment.name,
//                attachment: attachment,
//                isUploadFile: !attachment ? false : true,
//            }
//        }

//        UpdateTableAttach();
//        $('#addAttachmentModal').modal('hide');

//        ClearAttach();
//    }
//})
$('#saveAttach').click(function () {

    var documentType = $('#documentTypeAttachModal').val();
    var remarks = $('#remarksAttachModal').val();

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

    // === VALIDASI FILE MAX 5 MB ===
    if (modalStateAttach === "add") {
        if (!attachment) {
            $('#fileAttachModalError').text("File wajib diupload.").show();
            isValid = false;
        } else if (attachment.size > 5 * 1024 * 1024) { // 5MB
            $('#fileAttachModalError').text("Ukuran file maksimal 5MB.").show();
            isValid = false;
        }
    } else {
        // mode EDIT: jika user upload file baru, cek size
        if (attachment && attachment.size > 5 * 1024 * 1024) {
            $('#fileAttachModalError').text("Ukuran file maksimal 5MB.").show();
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
});


//function UpdateTableAttach() {
//   
//    var dataTable = $('#dataTableAttachment').DataTable();
//    dataTable.clear();

//    const dataRows = attachmentList
//        .map((item, originalIndex) => {
//            if (item.isDeleted) return null;
//            return [
//                originalIndex + 1,
//                item.documentType ?? '',
//                item.remarks ?? '',
//                item.fileName ?? '',
//                `<button id="editBtn" class="btn btn-sm btn-primary edit-btn-attach" type="button" data-bs-toggle="modal" data-bs-target="#addAttachmentModal" data-index="${originalIndex}">
//                    <i class="fas fa-edit"></i>
//                 </button>
//                 <button id="btnDownloadAttachment" class="btn btn-sm btn-warning download-btn-attach" type="button" data-index="${originalIndex}">
//                    <i class="fas fa-download"></i>
//                 </button>
//                 <button id="btnDeleteFlowProcess" class="btn btn-sm btn-danger delete-btn-attach" type="button" data-bs-toggle="modal" data-bs-target="#deleteSubmitRequestTrial" data-index="${originalIndex}">
//                    <i class="fas fa-trash"></i>
//                 </button>`
//            ];
//        })
//        .filter(x => x !== null); // Hapus null entries dari yang di-delete

//    dataTable.rows.add(dataRows);
//    dataTable.draw();

//    let jsonString = JSON.stringify(attachmentList);
//    $('#Attachments').val(jsonString);

//    // Optional fix: handle pagination if row deleted on last page
//    let pageInfo = dataTable.page.info();
//    if (pageInfo.page > 0 && pageInfo.end === 0) {
//        dataTable.page(pageInfo.page - 1).draw('page');
//    }

//    //const dataRows = attachmentList
//    //    .filter(item => item.isDeleted !== true)
//    //    .map((item, index) => [
//    //        index + 1,
//    //        item.documentType ?? '',
//    //        item.remarks ?? '',
//    //        item.fileName ?? '',
//    //        `<button id="editBtn" class="btn btn-sm btn-primary edit-btn-attach" type="button" data-bs-toggle="modal" data-bs-target="#addAttachmentModal" data-index="${index}">
//    //            <i class="fas fa-edit"></i>
//    //         </button>
//    //         <button id="btnDownloadAttachment" class="btn btn-sm btn-warning download-btn-attach" type="button" data-index="${index}">
//    //            <i class="fas fa-download"></i>
//    //         </button>
//    //         <button id="btnDeleteFlowProcess" class="btn btn-sm btn-danger delete-btn-attach" type="button" data-bs-toggle="modal" data-bs-target="#deleteSubmitRequestTrial" data-index="${index}">
//    //            <i class="fas fa-trash"></i>
//    //         </button>`
//    //    ]);

//    //dataTable.rows.add(dataRows);
//    //dataTable.draw();

//    //let jsonString = JSON.stringify(dataRows);
//    //$('#Attachments').val(jsonString);
//}

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
    $('#documentTypeAttachModal').val('').trigger('change');
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

//$(document).on('click', '#btnDownloadAttachment', function () {
//   
//    const index = $(this).data('index');
//    const fileData = attachmentList[index]?.file;
//    const fileName = attachmentList[index]?.fileName;

//    if (fileData) {
//        const form = document.getElementById('frmPMEvaluationDetail');
//        const formData = new FormData(form);
//        formData.append('fileName', fileData);

//        $.ajax({
//            url: '/PMEvaluation/DownloadFile',
//            type: 'POST',
//            data: { id: $('#id').val(), __RequestVerificationToken: $('#frmPMEvaluationDetail input[name=__RequestVerificationToken]').val() },
//            contentType: false,
//            processData: false,
//            xhrFields: {
//                responseType: 'blob'
//            },
//            success: function (blob) {
//               
//                const url = window.URL.createObjectURL(blob);
//                const a = document.createElement('a');
//                a.href = url;
//                a.download = fileName;
//                document.body.appendChild(a);
//                a.click();
//                a.remove();
//                window.URL.revokeObjectURL(url);
//            },
//            error: function () {
//                showMessageError('Download is failed');
//            }
//        });
//    } else {
//        showMessageError('File is not found');
//    }
//})

function showMessageError(msgError) {
    clsGlobal.swalError(msgError);
}

$(document).on('click', '#btnDownloadAttachment', function () {

    const index = $(this).data('index');
    const fileData = attachmentList[index]?.file;
    const fileName = attachmentList[index]?.fileName;

    if (fileData) {
        $.ajax({
            url: `/PMEvaluation/DownloadFile?fileName=${encodeURIComponent(fileData)}`,
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

//$(document).on('click', '.delete-btn-attach', function () {
//    const index = $(this).data('index');
//    attachmentList[index].isDeleted = true;

//    UpdateTableAttach();
//});

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

function disableAllForApproval() {
    if (!$('#approval-notice').length) {
        $('<div id="approval-notice" class="approval-notice">' +
            '<i class="fas fa-exclamation-circle me-2"></i>' +
            'This document is in "Waiting for Approval" status and cannot be edited.' +
            '</div>').insertAfter('.card-body h4');
    }

    $('input, select, textarea').not('#btnBack, input[type=hidden], .dataTables_filter input').prop('disabled', true);
    $('#btnSubmit').addClass('d-none');
    $('#btnSave').addClass('d-none');

    $('#btnAddDetailVisual').addClass('d-none');
    $('#btnAddDetailDimension').addClass('d-none');
    $('#btnAddDetailMaterial').addClass('d-none');
    $('#btnAddDetailPackaging').addClass('d-none');
    $('#btnAddDetailContaminant').addClass('d-none');

    $('#btnCopyFromPME').prop('disabled', true);  // disable
    $('#btnCopyFromTemplateSpec').prop('disabled', true);  // disable

    $('#btnSampleNumber').prop('disabled', true);  // disable
    $('.btnEditVisual').prop('disabled', true);  // disable
    $('.btnDeleteVisual').prop('disabled', true);  // disable

    $('.btnEditDimension').prop('disabled', true);  // disable
    $('.btnDeleteDimension').prop('disabled', true);  // disable

    $('.btnEditMaterial').prop('disabled', true);  // disable
    $('.btnDeleteMaterial').prop('disabled', true);  // disable

    $('.btnEditPackaging').prop('disabled', true);  // disable
    $('.btnDeletePackaging').prop('disabled', true);  // disable

    $('.btnEditContaminant').prop('disabled', true);  // disable
    $('.btnDeleteContaminant').prop('disabled', true);  // disable
    //$('#btnTxtItemCode').prop('disabled', true);
    //$('#btnTxtNameOfPOTS').prop('disabled', true);
    //$('#btnTxtNameOfPOTS').prop('disabled', true);
    //$('#btnTxtStorageCondition').prop('disabled', true);
    //$('#btnTxtStorageCondition').prop('disabled', true);
    //$('button').not('#btnBack').prop('disabled', true);
    //$('.select2').select2({ disabled: true });
    //$('.tab-pane').addClass('form-disabled');

    //    disableTableOperations();
}

function disableHeader() {

    $('#btnSampleNumber').prop('disabled', true);
    $('#txtRemark').attr('disabled', true);
}

//================================================================
// KODE UNTUK MEMBUAT INPUT FILTER DINAMIS (SESUAI LEBAR TEKS)
//================================================================
document.querySelectorAll('.input-group.dynamic-input input').forEach(input => {

    input.addEventListener('input', function () {
        // Ambil instance DataTable dari tabel yang sedang aktif
        // Cari DataTable yang terkait dengan input ini
        let table = null;
        let dtTable = null;

        // Cek apakah input berada dalam konteks DataTable tertentu
        const closestTable = this.closest('.tab-pane');
        if (closestTable) {
            // Cari DataTable berdasarkan tab yang aktif
            const tabId = closestTable.id;
            switch (tabId) {
                case 'form-tabs-Document':
                    table = document.querySelector('#dataTableAttachment');
                    if (table) dtTable = $('#dataTableAttachment').DataTable();
                    break;
                case 'form-tabs-Visual':
                    table = document.querySelector('#tableVisual');
                    if (table) dtTable = $('#tableVisual').DataTable();
                    break;
                case 'form-tabs-Dimension':
                    table = document.querySelector('#tableDimension');
                    if (table) dtTable = $('#tableDimension').DataTable();
                    break;
                case 'form-tabs-Material':
                    table = document.querySelector('#tableMaterial');
                    if (table) dtTable = $('#tableMaterial').DataTable();
                    break;
                case 'form-tabs-Packaging':
                    table = document.querySelector('#tablePackaging');
                    if (table) dtTable = $('#tablePackaging').DataTable();
                    break;
                case 'form-tabs-Contaminant':
                    table = document.querySelector('#tableContaminant');
                    if (table) dtTable = $('#tableContaminant').DataTable();
                    break;
            }
        }

        // Fallback ke dataTableAttachment jika tidak ditemukan
        if (!table) {
            table = document.querySelector('#dataTableAttachment');
            if (table) dtTable = $('#dataTableAttachment').DataTable();
        }

        // 1. Buat <span> sementara untuk mengukur lebar teks
        const tempSpan = document.createElement('span');
        tempSpan.style.visibility = 'hidden';   // Sembunyikan
        tempSpan.style.position = 'absolute';   // Jangan ganggu layout
        tempSpan.style.whiteSpace = 'pre';      // Jaga spasi
        tempSpan.style.font = window.getComputedStyle(this).font; // Pakai font yg sama

        // 2. Isi span dengan teks dari input (atau placeholder jika kosong)
        tempSpan.textContent = this.value || this.placeholder;
        document.body.appendChild(tempSpan);

        // 3. Ukur lebar span + tambahkan sedikit padding (misal 40px)
        // Angka 100 adalah lebar minimal input
        const newWidth = Math.max(100, tempSpan.offsetWidth + 40);

        // 4. Terapkan lebar baru ke input filter
        this.style.width = newWidth + 'px';

        // 5. Hapus span sementara
        document.body.removeChild(tempSpan);

        // 6. Perintahkan DataTables untuk menyesuaikan ulang lebar kolom (jika ada)
        if (table && dtTable) {
            table.style.tableLayout = 'auto'; // Izinkan tabel mengubah lebar kolom
            dtTable.columns.adjust();         // Gambar ulang kolom

            // 7. (Opsional) Kembalikan ke lebar & layout awal jika input kosong
            if (this.value.trim() === '') {
                this.style.width = '100px';       // Kembalikan ke lebar minimal
                table.style.tableLayout = 'fixed'; // Kunci lagi layoutnya (jika perlu)
                dtTable.columns.adjust();
            }
        }
    });
});
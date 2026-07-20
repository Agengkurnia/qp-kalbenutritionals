"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
let requestTrialDetail = [];
let protocolTrialDetail = [];
let dispositionTrialDetail = [];
let modalState = "add";
let indexModal = 99;
let indexToDelete = 99;

let statusDisposition = "";
let action = "";
//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    console.log(department);
    if (department === "PPIC") {
        $('#tab2-tab').parent().hide();
        $('#tab3-tab').parent().hide();
    }
    //RequestTrialInitialize.js
    initialize();

    //RequestTrialProtocol.js
    onInitProtocol();
});

$("#btnConceptNo").on("click", () => {
    clsGlobal.generateLOV(MODULE_CONCEPT_NO, "CONCEPT_NO", "CONCEPT_NO");
});

function setChooseLOV(txtValue) {

    var arr = txtValue.split('|');
    switch (arr[0]) {
        case MODULE_CONCEPT_NO:
            //TODO
            setConceptNo(arr);
            break;
    }
    clsGlobal.closeLOV();
}


function setConceptNo(arr) {
    $("#conceptNo").val(arr[1]);
    $("#ProjectType").val(arr[2]);
    $("#LobId").val(arr[3]);
    $("#LobName").val(arr[4]);
    $("#Brand").val(arr[5]);
    $("#SubBrand").val(arr[6]);
}

$('#saveRequest').click(function () {
    const itemCode = $('#itemCode').val();
    const formulaNo = $('#formulaNo').val();
    const allMaterialPrepared = $('#allMaterialPrepared').val();
    const trialType = $('#trialType').val();
    const processTrial = $('#processTrial').val();
    const machineLine = $('#machineLine').val();
    const trialQty = $('#trialQty').val();
    const moRmFlushing = $('#moRmFlushing').val();
    const trialEstimation = $('#trialEstimation').val();
    const trialDateProposalFrom = $('#trialDateProposalFrom').val();
    const trialDateProposalTo = $('#trialDateProposalTo').val();
    const boNumber = $('#boNumber').val();
    const confirmPlanTrialDate = $('#confirmPlanTrialDate').val();

    if (validateForm()) {
        if (modalState === 'edit') {
            requestTrialDetail[indexModal] = {
                itemCode: itemCode,
                formulaNo: formulaNo,
                allMaterialPrepared: allMaterialPrepared,
                trialType: trialType,
                processTrial: processTrial,
                machineLine: machineLine,
                trialQty: trialQty,
                moRmFlushing: moRmFlushing,
                trialEstimation: trialEstimation,
                trialDateProposalFrom: trialDateProposalFrom,
                trialDateProposalTo: trialDateProposalTo,
                boNumber: boNumber,
                confirmPlanTrialDate: confirmPlanTrialDate
            };
        } else {
            requestTrialDetail.push({
                itemCode: itemCode,
                formulaNo: formulaNo,
                allMaterialPrepared: allMaterialPrepared,
                trialType: trialType,
                processTrial: processTrial,
                machineLine: machineLine,
                trialQty: trialQty,
                moRmFlushing: moRmFlushing,
                trialEstimation: trialEstimation,
                trialDateProposalFrom: trialDateProposalFrom,
                trialDateProposalTo: trialDateProposalTo,
                boNumber: boNumber,
                confirmPlanTrialDate: confirmPlanTrialDate
            });
        }
        let jsonString = JSON.stringify(requestTrialDetail);
        $('#requestTrialDetail').val(jsonString);

        updateTable();

        $('#requestForm')[0].reset();
        $('#requestModal').modal('hide');
    }
});


$('#saveRequestEdit').click(function () {
    const itemCode = $('#itemCodeEdit').val();
    const formulaNo = $('#formulaNoEdit').val();
    const allMaterialPrepared = $('#allMaterialPreparedEdit').val();
    const trialType = $('#trialTypeEdit').val();
    const processTrial = $('#processTrialEdit').val();
    const machineLine = $('#machineLineEdit').val();
    const trialQty = $('#trialQtyEdit').val();
    const moRmFlushing = $('#moRmFlushingEdit').val();
    const trialEstimation = $('#trialEstimationEdit').val();
    const trialDateProposalFrom = $('#trialDateProposalFromEdit').val();
    const trialDateProposalTo = $('#trialDateProposalToEdit').val();
    const boNumber = $('#boNumberEdit').val();
    const confirmPlanTrialDate = $('#confirmPlanTrialDateEdit').val();

    //if (validateForm()) {
    if (modalState === 'edit') {
        requestTrialDetail[indexModal] = {
            itemCode: itemCode,
            formulaNo: formulaNo,
            allMaterialPrepared: allMaterialPrepared,
            trialType: trialType,
            processTrial: processTrial,
            machineLine: machineLine,
            trialQty: trialQty,
            moRmFlushing: moRmFlushing,
            trialEstimation: trialEstimation,
            trialDateProposalFrom: trialDateProposalFrom,
            trialDateProposalTo: trialDateProposalTo,
            boNumber: boNumber,
            confirmPlanTrialDate: confirmPlanTrialDate
        };
    } else {
        requestTrialDetail.push({
            itemCode: itemCode,
            formulaNo: formulaNo,
            allMaterialPrepared: allMaterialPrepared,
            trialType: trialType,
            processTrial: processTrial,
            machineLine: machineLine,
            trialQty: trialQty,
            moRmFlushing: moRmFlushing,
            trialEstimation: trialEstimation,
            trialDateProposalFrom: trialDateProposalFrom,
            trialDateProposalTo: trialDateProposalTo,
            boNumber: boNumber,
            confirmPlanTrialDate: confirmPlanTrialDate
        });
    }
    let jsonString = JSON.stringify(requestTrialDetail);
    $('#requestTrialDetail').val(jsonString);

    updateTable();

    $('#requestForm')[0].reset();
    $('#requestModalEdit').modal('hide');
    //}
});

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
}

function updateTable() {
    // Pastikan DataTable sudah diinisialisasi dan kosongkan datanya
    var dataTable = $('#dataTableRequestTrialDetail').DataTable();
    dataTable.clear();

    var status = $('#StatusRequestTrial').val();
    let canEdit = (isSuperUser || (isReadOnly !== "true" && (status === "" || status === "SUBMITTED TO PPIC" || status === "REVISED" || status === "DRAFT" || status === "WAITING FOR TRIAL DATE")));

    // Menambahkan data baru ke DataTable
    dataTable.rows.add(requestTrialDetail.map((data, index) => {
        let actionButtons = '';

        if (canEdit) {
            actionButtons = `
                <div class="btn-group" role="group">
                    <button id="editBtn" class="btn btn-sm btn-primary edit-btn" type="button" data-bs-toggle="modal" data-index="${index}">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>`;
        }

        return [
            index + 1,
            data.itemCode,
            data.formulaNo ?? "",
            data.allMaterialPrepared ? (data.allMaterialPrepared == "true" ? "Yes" : "No") : "",
            data.trialType,
            data.processTrial ?? "",
            data.machineLine,
            data.trialQty,
            data.moRmFlushing,
            data.trialEstimation,
            `${formatDate(data.trialDateProposalFrom)} - ${formatDate(data.trialDateProposalTo)}`,
            data.boNumber ?? "-",
            data.confirmPlanTrialDate ? formatDate(data.confirmPlanTrialDate) : '-',
            canEdit ? actionButtons : ''
        ];
    }));

    dataTable.draw();
}


$('#btnSubmitRequestTrialDetail').click(function () {
    if (requestTrialDetail.length > 0) {
        $.ajax({
            url: '/RequestTrial/SaveRequests',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestTrialDetail),
            success: function (response) {
                showMessageSucces('Requests saved successfully!');
                requestTrialDetail = [];
                updateTable();
            },
            error: function (xhr, status, error) {
                showMessageError('Error:', error);
            }
        });
    } else {
        showMessageError('No data to submit.');
    }
});

$('#btnSave').on('click', function (e) {
    e.preventDefault();

    if (validateFormHeader()) {
        var dataSummary = $('#summaryRequestTrial').val();
        var dataRecommendation = $('#recommendationRequestTrial').val();
        var jsonDataSummary = JSON.stringify({
            summary: dataSummary,
            recommendation: dataRecommendation
        });

        $('#summaryRecommendationTrial').val(jsonDataSummary);

        if (requestProtocolDetail.length !== 0) {
            var jsonDataProt = JSON.stringify(requestProtocolDetail);
            $('#requestProtocolDetail').val(jsonDataProt);
        }

        if (requestTrialDetail.length !== 0) {
            var jsonData = JSON.stringify(requestTrialDetail);
            $('#requestTrialDetail').val(jsonData);
        }

        $('#formCreateRequestTrial').submit();
    }
});

$(document).on('click', '.edit-btn', function () {
    modalState = "edit";
    indexModal = $(this).data('index');
    const data = requestTrialDetail[indexModal];

    $.ajax({
        url: '/RequestTrial/GetBoLOV',
        type: 'GET',
        data: { formulaNo: data.formulaNo },
        success: function (data) {
            $('#boNumber').empty();
            $('#boNumber').append('<option value="" disabled selected>Select BO Number</option>');

            $('#boNumberEdit').empty();
            $('#boNumberEdit').append('<option value="" disabled selected>Select BO Number</option>');

            $.each(data, function (index, item) {
                $('#boNumber').append('<option value="' + item.batchNo + '">' + item.batchNo + '</option>');
                $('#boNumberEdit').append('<option value="' + item.batchNo + '">' + item.batchNo + '</option>');
            });

            if (department === 'PPIC') {
                $('#boNumber').prop('disabled', false).trigger('change');
                $('#boNumberEdit').prop('disabled', false).trigger('change');
            } else {
                $('#boNumber').prop('disabled', true);
                $('#boNumberEdit').prop('disabled', true);
            }
        },
        error: function (xhr, status, error) {
            showMessageError('Error fetching data:', error);
        }
    });


    var status = $('#StatusRequestTrial').val();
    console.log(status);
    if (status === "" || status === "DRAFT" || status === "REVISED") {

        $('#itemCode').val(data.itemCode).trigger('change');
        $('#allMaterialPrepared').val(data.allMaterialPrepared).trigger('change');
        $('#trialType').val(data.trialType).trigger('change');
        $('#processTrial').val(data.processTrial).trigger('change');
        $('#machineLine').val(data.machineLine);
        $('#trialQty').val(data.trialQty);
        $('#moRmFlushing').val(data.moRmFlushing);
        $('#trialEstimation').val(data.trialEstimation);
        $('#trialDateProposalFrom').val(data.trialDateProposalFrom.split("T")[0]);
        $('#trialDateProposalTo').val(data.trialDateProposalTo.split("T")[0]);
        $('#boNumber').val(data.boNumber).trigger('change');

        $('#requestModalEditLabel').text('Edit Request');
        if (data.confirmPlanTrialDate) {
            $('#confirmPlanTrialDate').val(data.confirmPlanTrialDate.split("T")[0]);
        } else {
            $('#confirmPlanTrialDate').val('');
        }

        setTimeout(() => {
            $('#formulaNo').val(data.formulaNo).trigger('change');
        }, 1000);

        $('#requestModal').modal('show');
    } else {
        $('#itemCodeEdit').val(data.itemCode);
        $('#formulaNoEdit').val(data.formulaNo);
        $('#allMaterialPreparedEdit').val(data.allMaterialPrepared).trigger('change');
        $('#trialTypeEdit').val(data.trialType).trigger('change');
        $('#processTrialEdit').val(data.processTrial).trigger('change');
        $('#machineLineEdit').val(data.machineLine);
        $('#trialQtyEdit').val(data.trialQty);
        $('#moRmFlushingEdit').val(data.moRmFlushing);
        $('#trialEstimationEdit').val(data.trialEstimation);
        $('#trialDateProposalFromEdit').val(data.trialDateProposalFrom.split("T")[0]);
        $('#trialDateProposalToEdit').val(data.trialDateProposalTo.split("T")[0]);
        $('#boNumberEdit').val(data.boNumber).trigger('change');

        if (data.confirmPlanTrialDate) {
            $('#confirmPlanTrialDateEdit').val(data.confirmPlanTrialDate.split("T")[0]);
        } else {
            $('#confirmPlanTrialDateEdit').val('');
        }


        $('#requestModalEdit').modal('show');
    }
});

$('#requestModal').on('hidden.bs.modal', function () {
    indexModal = 99;
    if (modalState === "edit") {
        modalState = "add";
        $('#requestForm')[0].reset();

        // Reset select2
        $('#itemCode').val('').trigger('change');
        $('#formulaNo').val('').trigger('change');
        $('#allMaterialPrepared').val('').trigger('change');
        $('#trialType').val('').trigger('change');
        $('#processTrial').val([]).trigger('change');
        $('#boNumber').val('').trigger('change');

        $('#requestModalLabel').text('Add Request');

    }
});


$('#requestModalEdit').on('hidden.bs.modal', function () {
    indexModal = 99;
    if (modalState === "edit") {
        modalState = "add";
        $('#requestFormEdit')[0].reset();

        // Reset select2
        $('#itemCodeEdit').val('').trigger('change');
        $('#formulaNoEdit').val('').trigger('change');
        $('#allMaterialPreparedEdit').val('').trigger('change');
        $('#trialTypeEdit').val('').trigger('change');
        $('#processTrialEdit').val([]).trigger('change');
        $('#boNumberEdit').val('').trigger('change');
        $('#confirmPlanTrialDateEdit').val('');

        $('#requestModalLabel').text('Add Request');

    }
});

function showMessageSucces(msgSuccess) {
    var guid = $('#RequestTrialGuid').val();
    var txtUrl = `${base_path}/RequestTrial/Edit?param=${guid}`;
    clsGlobal.swalSuccessSaveOrSubmit(msgSuccess, txtUrl);
}

$('#deleteRequestTrialDetailBtn').click(function () {
})

$('#submitRequestTrialBtn').click(function () {
    var status = $('#StatusRequestTrial').val();
    let isRejected = status === "REJECTED";
    const requestNo = $('#RequestNo').val();
    $('#requestModalLabel').text(isRejected ? 'Confirm Revise' : 'Confirm Submit');

    $('#confirmText').text(isRejected ? 'Are you sure you want to revise this request?' : 'Are you sure you want to submit this request?');

    $('#confirmRequestTrialSubmit').text(isRejected ? 'Yes, Revise' : 'Yes, Submit');

    $(this).attr('data-requestNo', requestNo);
    $('#requestTrialNoSubmit').text(requestNo);

    $('#confirmSubmitRequestTrial').modal('show');
});


$('#approveRequestTrialBtn').click(function () {
    let hasNullTrialDate = false;
    var status = $('#StatusRequestTrial').val()

    if (status == "SUBMITTED TO PPIC") {
        $('#aproveSubmmitLabel').html(`
             <p style="color: grey;">Is BO Number or Confirm Plan Trial Date ready?</p>
            <ul>
                <li>If Yes, Please input the data in the respective field.</li>
                <li>If No, You may input the data later</li>
            </ul>
        `);

        $('#approveSubmitLabel2').text("Are you sure you want to submit this item?");
        $('#confirmRequestTrialApprove').text("Yes, Submit");
        $('#approveSubmitRequestTrialLabel').text("Confirm Submit");
    }

    $('#approveSubmitRequestTrial').modal('show');
});

$('#confirmRequestTrialDelete').on('click', function () {
    deleteRow(indexToDelete);
    $('#deleteSubmitRequestTrial').modal('hide');
});

function deleteRow(index) {
    requestTrialDetail.splice(index, 1);
    updateTable();
}

$('#confirmRequestTrialApprove').click(function () {
    const index = $('#deleteSubmitRequestTrial').attr('data-index');
    $('#approveSubmitRequestTrial').modal('hide');
})

$('#confirmRequestTrialApprove').on('click', function (e) {
    debugger;
    e.preventDefault();
    let hasNullTrialDate = false;
    var data = $('#remarkHistory').val();
    var status = $('#StatusRequestTrial').val()
    $('#isForm').val('Request Trial');
    $('#isRemark').val(data);
    $('#isAction').val("Approved");

    if (status == "WAITING FOR TRIAL DATE") {
        debugger;
        requestTrialDetail.forEach((data, index) => {
            if (data.confirmPlanTrialDate === null || data.confirmPlanTrialDate === "-" || data.confirmPlanTrialDate === "") {
                hasNullTrialDate = true;
            }
        });

        if (!hasNullTrialDate) {
            $('#StatusRequestTrial').val("APPROVED");
        }
    }

    if (hasNullTrialDate) {
        clsGlobal.swalError(`Confirm Plan Trial Date tidak boleh kosong di List Request Trial`);
    } else {
        debugger;
        if (status == "DRAFT" || status == "REVISED") {
            //$('#StatusRequestTrial').val("SUBMITTED TO PPIC");
            status = "SUBMITTED TO PPIC";
        } else if (status == "SUBMITTED TO PPIC") {
            status = "WAITING FOR APPROVAL";
        } else if (status == "WAITING FOR APPROVAL") {
            var isApproveFor = $('#isApproveFor').val();
            if (isApproveFor == "IsApproveForPPIC") {
                $('#IsApprovedPPIC').val("True");
            } else if (isApproveFor == "IsApproveForProdev") {
                $('#IsApprovedProdev').val("True");
            } else if (isApproveFor == "IsApproveForProsdev") {
                $('#IsApprovedProsdev').val("True");
            } else if (isApproveFor == "IsApproveForPackdev") {
                $('#IsApprovedPackdev').val("True");
            }
        } else if (status == "WAITING FOR TRIAL DATE") {
            status = "APPROVED";
        }

        if (validateFormHeader()) {
            var dataSummary = $('#summaryRequestTrial').val();
            var dataRecommendation = $('#recommendationRequestTrial').val();
            var jsonDataSummary = JSON.stringify({
                summary: dataSummary,
                recommendation: dataRecommendation
            });

            $('#summaryRecommendationTrial').val(jsonDataSummary);

            if (requestProtocolDetail.length !== 0) {
                var jsonDataProt = JSON.stringify(requestProtocolDetail);
                $('#requestProtocolDetail').val(jsonDataProt);
            }

            $('#StatusRequestTrial').val(status);

            if (requestTrialDetail.length !== 0) {
                var jsonData = JSON.stringify(requestTrialDetail);
                $('#requestTrialDetail').val(jsonData);
            }
            $('#formCreateRequestTrial').submit();
        }
    }
});

$('#confirmRequestTrialSubmit').on('click', function (e) {
    var data = $('#remarkHistory').val();
    $('#isForm').val('Request Trial');
    $('#isRemark').val(data);

    var status = $('#StatusRequestTrial').val()
    let isRejected = status === "REJECTED";
    if (isRejected) {
        $('#isAction').val("Revised");
        ProcessSubmitRequestTrial("REVISED");
    } else {
        $('#isAction').val("Submitted");
        ProcessSubmitRequestTrial("SUBMITTED TO PPIC");
    }
    $('#confirmSubmitRequestTrial').modal('hide');
});


$('#btnRejectRequestTrial').click(function () {
    const requestNo = $('#RequestNo').val();

    $(this).attr('data-requestNo', requestNo);
    $('#requestTrialNoSubmit').text(requestNo);

    $('#rejectSubmitRequestTrial').modal('show');
});

$('#confirmRequestTrialReject').click(function () {
    const remark = $('#remarkHistoryReject').val();
    $('.text-danger-validation').hide();

    let isValid = true;

    if (!remark) {
        $('#remarkHistoryRejectError').show();
        isValid = false;
    }
    if (isValid) {
        $('#isForm').val('Request Trial');
        $('#isRemark').val(remark);
        $('#isAction').val("Rejected");

        ProcessSubmitRequestTrial("REJECTED");
        $('#rejectSubmitRequestTrial').modal('hide');
    }
});

function ProcessSubmitRequestTrial(status) {
    debugger;
    if (validateFormHeader()) {
        var dataSummary = $('#summaryRequestTrial').val();
        var dataRecommendation = $('#recommendationRequestTrial').val();
        var jsonDataSummary = JSON.stringify({
            summary: dataSummary,
            recommendation: dataRecommendation
        });

        $('#summaryRecommendationTrial').val(jsonDataSummary);

        if (requestProtocolDetail.length !== 0) {
            var jsonDataProt = JSON.stringify(requestProtocolDetail);
            $('#requestProtocolDetail').val(jsonDataProt);
        }

        $('#StatusRequestTrial').val(status);

        if (requestTrialDetail.length !== 0) {
            var jsonData = JSON.stringify(requestTrialDetail);
            $('#requestTrialDetail').val(jsonData);
        }
        $('#formCreateRequestTrial').submit();
    }
}

$('#btnSubmitProtocol').on('click', function (e) {
    $('#btnConfirmSubmitProtocol').removeClass('btn-danger').addClass('btn-primary');
    $('#btnConfirmSubmitProtocol').text('Yes, Submit');
    $('#confirmSubmitProtocolLabel').text('Confirm Submit');
    $('#confirmSubmitProtocolText').text('Are you sure want to submit this Protocol ?');
    action = "Submit Protocol";
    statusDisposition = "PROTOCOL ON GOING APPROVAL";
});


$('#btnStartEvaluation').on('click', function (e) {
    $('#btnConfirmSubmitProtocol').removeClass('btn-danger').addClass('btn-primary');
    $('#btnConfirmSubmitProtocol').text('Yes, Start');
    $('#confirmSubmitProtocolLabel').text('Confirm Start');
    $('#confirmSubmitProtocolText').text('Are you sure want to start this Evaluation ?');
    action = "Start Evaluation";
    statusDisposition = "EVALUATION ON GOING";
});


$('#btnSubmitEvaluation').on('click', function (e) {
    $('#btnConfirmSubmitProtocol').removeClass('btn-danger').addClass('btn-primary');
    $('#btnConfirmSubmitProtocol').text('Yes, Submit');
    $('#confirmSubmitProtocolLabel').text('Confirm Submit');
    $('#confirmSubmitProtocolText').text('Are you sure want to submit this Evaluation ?');
    action = "Submit Evaluation";
    statusDisposition = "EVALUATION ON GOING APPROVAL";
});

$('#btnApproveEvaluation').on('click', function (e) {
    $('#btnConfirmSubmitProtocol').removeClass('btn-danger').addClass('btn-primary');
    $('#btnConfirmSubmitProtocol').text('Yes, Approve');
    $('#confirmSubmitProtocolLabel').text('Confirm Approve');
    $('#confirmSubmitProtocolText').text('Are you sure want to approve this Evaluation ?');
    action = "Approve Evaluation";
    statusDisposition = "EVALUATION APPROVED";
});

$('#btnApproveProtocol').on('click', function (e) {
    $('#btnConfirmSubmitProtocol').removeClass('btn-danger').addClass('btn-primary');
    $('#btnConfirmSubmitProtocol').text('Yes, Approve');
    $('#confirmSubmitProtocolLabel').text('Confirm Approve');
    $('#confirmSubmitProtocolText').text('Are you sure want to approve this Protocol ?');
    action = "Approve Protocol";
    statusDisposition = "PROTOCOL APPROVED";
});

$('#btnRejectProtocol').on('click', function (e) {
    $('#btnConfirmSubmitProtocol').removeClass('btn-primary').addClass('btn-danger');
    $('#confirmSubmitProtocolLabel').text('Confirm Reject');
    $('#confirmSubmitProtocolText').text('Are you sure want to reject this Protocol ?');
    $('#btnConfirmSubmitProtocol').text('Yes, Reject');
    action = "Reject Protocol";
    statusDisposition = "PROTOCOL REJECTED";
});

$('#btnConfirmSubmitProtocol').click(function () {
    const remark = $('#remarkConfirmSubmitProtocol').val();

    var status = $('#StatusRequestTrial').val();

    let isValid = true;

    //status disposition salah naming karena waktu itu ada perubahan
    //jadinya untuk status evaluation trial
    if (statusDisposition.includes("REJECTED")) {
        if (!remark) {
            $('#remarkConfirmSubmitProtocolError').show();
            isValid = false;
        }
    }

    if (isValid) {
        //status disposition salah naming karena waktu itu ada perubahan
        //jadinya untuk status evaluation trial
        if (statusDisposition === "PROTOCOL ON GOING APPROVAL") {
            if (status !== "APPROVED") {
                $('#confirmSubmitProtocol').modal('hide');
                showMessageError(`
                This Protocol cannot be submitted for Approval because Request Trial is still 
                <span style="color: red; font-weight: bold;">${status}</span>. 
                Protocol can only be submitted when Request Status is 
                <span style="color: green; font-weight: bold;">APPROVED</span>.
            `);
                return;
            }
        }
        $('#confirmSubmitProtocol').modal('hide');
        var guid = $('#RequestTrialGuid').val();
        $('#confirmSubmitModal').hide();

        var dataSummary = $('#summaryRequestTrial').val();
        var dataRecommendation = $('#recommendationRequestTrial').val();
        var jsonDataSummary = JSON.stringify({
            summary: dataSummary,
            recommendation: dataRecommendation
        });
        var isApproveFor = $('#isApproveFor').val();

        $.ajax({
            url: '/RequestTrial/UpdateStatus',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                id: guid,
                statusDisposition: statusDisposition,
                remarks: remark,
                action: action,
                isApproveFor: isApproveFor,
                summary: jsonDataSummary,
            }),
            success: function (response) {
                if (response.success) {
                    showMessageSucces("Data has been saved");
                } else {
                    showMessageError(response.message);
                }
            },
            error: function (xhr, status, error) {
                showMessageError(error);
            }
        });
    }
});


$('#confirmSubmitModalSubmit').on('click', function (e) {
    var guid = $('#RequestTrialGuid').val();
    $('#confirmSubmitModal').hide();
    $.ajax({
        url: '/RequestTrial/UpdateStatus',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            id: guid,
            statusDisposition: statusDisposition,
        }),
        success: function (response) {
            if (response.success) {
                showMessageSucces("Data has been saved");
            } else {
                showMessageError("Error while updating data " + response.message);
            }
        },
        error: function (xhr, status, error) {
            showMessageError(error);
        }
    });
});


$('#confirmSubmitModalSubmit').on('hidden.bs.modal', function () {
    statusDisposition = "";
})

function showMessageError(msgError) {
    clsGlobal.swalError(msgError);
}



$('#confirmProtocolSubmit').click(function () {
    $('#confirmSubmitProtocol2').modal('hide');
    const remark = $('#remarkConfirmSubmitProtocol').val();

    var status = $('#StatusRequestTrial').val();

    let isValid = true;

    if (statusDisposition.includes("REJECTED")) {
        if (!remark) {
            $('#remarkConfirmSubmitProtocolError').show();
            isValid = false;
        }
    }

    if (isValid) {
        if (statusDisposition === "PROTOCOL ON GOING APPROVAL" && status !== "APPROVED") {
            $('#confirmSubmitProtocol').modal('hide');
            showMessageError(`
                This Protocol cannot be submitted for Approval because Request Trial is still 
                <span style="color: red; font-weight: bold;">${status}</span>. 
                Protocol can only be submitted when Request Status is 
                <span style="color: green; font-weight: bold;">APPROVED</span>.
            `);
            return;
        }
        $('#confirmSubmitProtocol').modal('hide');
        var guid = $('#RequestTrialGuid').val();
        $('#confirmSubmitModal').hide();

        var dataSummary = $('#summaryRequestTrial').val();
        var dataRecommendation = $('#recommendationRequestTrial').val();
        var jsonDataSummary = JSON.stringify({
            summary: dataSummary,
            recommendation: dataRecommendation
        });

        $.ajax({
            url: '/RequestTrial/UpdateStatus',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                id: guid,
                statusDisposition: statusDisposition,
                remarks: remark,
                action: action,
                summary: jsonDataSummary,
            }),
            success: function (response) {
                if (response.success) {
                    showMessageSucces("Data has been saved");
                } else {
                    showMessageError("Error while updating data " + response.message);
                }
            },
            error: function (xhr, status, error) {
                showMessageError(error);
            }
        });
    }
});


$('#btnReviseProtocol').on('click', function (e) {
    const requestNo = $('#RequestNo').val();

    $(this).attr('data-requestNo', requestNo);
    $('#protocolNoSubmit').text(requestNo);

    $('#confirmProtocolSubmit').text('Yes, Revise');
    $('#confirmSubmitProtocolLabel2').text('Confirm Revise');
    $('#confirmTextProtocol').text('Are you sure want to revise this Protocol ?');
    action = "Revise Protocol";
    statusDisposition = "PROTOCOL REVISED";
});

$('#submitProtocolBtn').click(function () {
    const requestNo = $('#RequestNo').val();

    $(this).attr('data-requestNo', requestNo);
    $('#protocolNoSubmit').text(requestNo);

    action = "Submit Protocol";
    statusDisposition = "PROTOCOL ON GOING APPROVAL";
})


$('#btnReviseEvaluation').click(function () {
    const requestNo = $('#RequestNo').val();

    $('#confirmSubmitProtocolLabel2').text('Confirm Revise');
    $('#confirmTextProtocol').text('Are you sure want to revise this Evaluation ?');
    $('#confirmProtocolSubmit').text('Yes, Revise');

    $(this).attr('data-requestNo', requestNo);
    $('#protocolNoSubmit').text(requestNo);

    action = "Revise Protocol";
    statusDisposition = "EVALUATION REVISED";
})

$('#btnRejectEvaluation').on('click', function (e) {
    $('#btnConfirmSubmitProtocol').removeClass('btn-primary').addClass('btn-danger');
    $('#confirmSubmitProtocolLabel').text('Confirm Reject');
    $('#confirmSubmitProtocolText').text('Are you sure want to reject this Evaluation ?');
    $('#btnConfirmSubmitProtocol').text('Yes, Reject');
    action = "Reject Evaluation";
    statusDisposition = "EVALUATION REJECTED";
});


$('#btnSaveRecommendation').on('click', function (e) {
    var guid = $('#RequestTrialGuid').val();
    var dataSummary = $('#summaryRequestTrial').val();
    var dataRecommendation = $('#recommendationRequestTrial').val();
    var jsonDataSummary = JSON.stringify({
        summary: dataSummary,
        recommendation: dataRecommendation,
        summaryHeaderGuid: guid
    });
    var isApproveFor = $('#isApproveFor').val();

    $.ajax({
        url: '/RequestTrial/UpdateSummaryRecommendation',
        type: 'POST',
        contentType: 'application/json',
        data: jsonDataSummary,
        success: function (response) {
            if (response.success) {
                showMessageSucces("Data has been saved");
            } else {
                showMessageError(response.message);
            }
        },
        error: function (xhr, status, error) {
            showMessageError(error);
        }
    });
});


$('#btnGeneratePDF').click(function () {
    var guid = $('#RequestTrialGuid').val();

    if (guid) {
        var baseUrl = window.location.origin; // Otomatis ambil domain + port
        var url = baseUrl + '/RequestTrial/GeneratePdf?param=' + encodeURIComponent(guid);
        window.open(url, '_blank'); // Preview PDF di tab baru
    } else {
        alert("GUID tidak ditemukan.");
    }
});
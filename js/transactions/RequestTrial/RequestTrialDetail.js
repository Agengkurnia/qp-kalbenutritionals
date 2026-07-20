"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
let requestTrialDetail = [];
let protocolTrialDetail = [];
let dispositionTrialDetail = [];
let indexModal = 99;

var cachedFormulaData = [];
var cachedItemCode = [];
let modalState = "add";
//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {

    $(".select2").select2();

    $('#formulaNo').prop('disabled', true);

    $('#trialQty').on('input', function () {
        var trialQty = parseFloat($(this).val());

        if (isNaN(trialQty) || trialQty < 0 || trialQty > 1) {
            $('#trialQtyError').show();  
            $(this).addClass('is-invalid');
        } else {
            $('#trialQtyError').hide(); 
            $(this).removeClass('is-invalid');
        }
    });

    $('#itemCode').on('change', function () {
        var itemCodeValue = $(this).val();

        if (itemCodeValue) {
            $('#formulaNo').prop('disabled', false);

            $.ajax({
                url: '/RequestTrial/GetFormulaNo',
                type: 'GET',
                data: { itemCode: itemCodeValue },
                success: function (data) {
                    console.log(data);
                    $('#formulaNo').empty();    
                    $('#formulaNo').append('<option value="" selected>Select Formula No</option>');

                    $.each(data, function (index, item) {
                        $('#formulaNo').append('<option value="' + item.formulaNo + '">' + item.formulaNo + "  |  " + " Ver " + item.formulaVersion + "  |  " + item.formulaDesc1 + '</option>');
                    });

                    $('#formulaNo').prop('disabled', false).trigger('change');
                },
                error: function (xhr, status, error) {
                    showMessageError(error);
                }
            });
        } else {
            $('#formulaNo').prop('disabled', true);
        }
    });

    $('#trialEstimation').on('input', function () {
        var value = parseFloat($(this).val());
        if ($(this).val().includes('.')) {
            var decimalPlaces = $(this).val().split('.')[1].length;
            if (decimalPlaces > 1) {
                $(this).val(value.toFixed(1));
            }
        }
    });

    $('#requestModal').on('shown.bs.modal', function () {
        $(this).find('select.select2').each(function () {
            $(this).select2({
                dropdownParent: $('#requestModal')
            });
        });
    });

    let today = new Date().toISOString().split('T')[0];

    if (msgSuccess !== "") {
        showMessageSucces(msgSuccess);
    }

    if (department !== 'PPIC') {
        $('#boNumber').prop('disabled', true);
        $('#confirmPlanTrialDate').prop('disabled', true);
    }

    if (department === "PSD") {
        $("#selectProsdev option[value='']").prop("disabled", true);
    }

    if (department === "PCD") {
        $("#selectProsdev option[value='']").prop("disabled", true);
    }

    if (department === "PDV") {
        $("#selectProdev option[value='']").prop("disabled", true);
    }


    $('#dataTableRequestTrialDetail').DataTable({
        scrollX: true,
        //fixedHeader: true,
    });

    $('#trialDateProposalFrom').attr('min', today);
    $('#trialDateProposalTo').attr('min', today);
    $('#confirmPlanTrialDate').attr('min', today);
    $('#trialDateProposalFrom').on('change', function () {
        let fromDate = $(this).val();
        $('#trialDateProposalTo').attr('min', fromDate);
        if ($('#trialDateProposalTo').val() < fromDate) {
            $('#trialDateProposalTo').val('');
        }
    });

    $('#trialDateProposalTo').on('change', function () {
        let toDate = $(this).val();
        let fromDate = $('#trialDateProposalFrom').val();
        if (toDate < fromDate) {
            alert("Tanggal 'To' tidak boleh lebih kecil dari tanggal 'From'.");
            $(this).val('');
        }
    });

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

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
}

function updateTable() {
    const $tableBody = $('#dataTableRequestTrialDetail tbody');
    $tableBody.empty();

    requestTrialDetail.forEach((data, index) => {
        const row = `<tr>
        <td>${index + 1}</td>
        <td>${data.itemCode}</td>
        <td>${data.formulaNo ?? ""}</td>
        <td>${data.allMaterialPrepared ? "Yes" :"No"}</td>
        <td>${data.trialType}</td>
        <td>${data.processTrial}</td>
        <td>${data.machineLine}</td>
        <td>${data.trialQty}</td>
        <td>${data.moRmFlushing}</td>
        <td>${data.trialEstimation}</td>
        <td>${formatDate(data.trialDateProposalFrom)} - ${formatDate(data.trialDateProposalTo)}</td>
        <td>${data.boNumber ?? "-"}</td>
        <td>${data.confirmPlanTrialDate ? formatDate(data.confirmPlanTrialDate) : '-'}</td>
        <td>
            <div class="btn-group" role="group">
                <button id="editBtn" class="btn btn-sm btn-primary edit-btn" type="button" data-bs-toggle="modal" data-bs-target="#requestModal" data-index="${index}"${index}">
                    <i class="fas fa-edit"></i>
                </button>
                <button id="deleteRequestTrialDetailBtn" class="btn btn-sm btn-danger" type="button" data-bs-toggle="modal" data-bs-target="#deleteSubmitRequestTrial" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
      </tr>`;
        $tableBody.append(row);
    });
}

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

        $('#StatusRequestTrial').val("DRAFT");
        if (requestTrialDetail.length !== 0) {
            var jsonData = JSON.stringify(requestTrialDetail);
            $('#requestTrialDetail').val(jsonData);
        }

        $('#formCreateRequestTrial').submit();
    }
});

function showMessageSucces(msgSuccess) {
    var guid = $('#RequestTrialGuid').val();
    var txtUrl = `${base_path}/RequestTrial/Edit?param=${guid}`;
    clsGlobal.swalSuccessSaveOrSubmit(msgSuccess, txtUrl);
}

$('#requestModal').on('hidden.bs.modal', function () {
    indexModal = 99;
    $('.text-danger-validation').hide();
    if (modalState === "edit") {
        modalState = "add";
        $('#requestForm')[0].reset();

        $('#itemCode').val('').trigger('change');
        $('#formulaNo').val('').trigger('change');
        $('#allMaterialPrepared').val('').trigger('change');
        $('#trialType').val('').trigger('change');
        $('#processTrial').val([]).trigger('change');
        $('#boNumber').val('').trigger('change');

        $('#requestModalLabel').text('Add Request');

    }
});

$(document).on('click', '.edit-btn', function () {
    debugger;
    modalState = "edit";
    indexModal = $(this).data('index');
    const data = requestTrialDetail[indexModal];

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
    $('#confirmPlanTrialDate').val(data.confirmPlanTrialDate.split("T")[0]);

    setTimeout(() => {
        $('#formulaNo').val(data.formulaNo).trigger('change');
    }, 1000); 
    $('#requestModalLabel').text('Edit Request');
});

$('#submitRequestTrialBtn').click(function () {
    $('#labelNoSubmit').hide();
    const requestNo = $('#RequestNo').val();

    $(this).attr('data-requestNo', requestNo);
    $('#requestTrialNoSubmit').text(requestNo);

    var dataSummary = $('#summaryRequestTrial').val();
    var dataRecommendation = $('#recommendationRequestTrial').val();
    var jsonDataSummary = JSON.stringify({
        summary: dataSummary,
        recommendation: dataRecommendation
    });

    $('#summaryRecommendationTrial').val(jsonDataSummary);
    $('#confirmSubmitRequestTrial').modal('show');
});

$('#btnCloseSubmitRequest').click(function () {
    debugger;
    $('#confirmSubmitRequestTrial').modal('hide');
});

$('#btnCloseSubmitRequest').on('click', function () {
    $('#confirmSubmitRequestTrial').modal('hide');
});

$('#confirmSubmitRequestTrial').on('click', function (e) {
    e.preventDefault();

    $('#StatusRequestTrial').val("DRAFT");

    if (requestTrialDetail.length !== 0) {
        var jsonData = JSON.stringify(requestTrialDetail);
        $('#requestTrialDetail').val(jsonData);
    }

    $('#StatusRequestTrial').val("SUBMITTED TO PPIC");
    $('#confirmSubmitRequestTrial').modal('hide');
    $('#formCreateRequestTrial').submit();
});


function deleteRow(index) {
    requestTrialDetail.splice(index, 1);
    updateTable();
}

$('#confirmRequestTrialDelete').click(function () {
    const index = $('#deleteSubmitRequestTrial').attr('data-index');
    deleteRow(index);
    $('#deleteSubmitRequestTrial').modal('hide');
})


function showMessageError(msgError) {
    clsGlobal.swalError(msgError);
}
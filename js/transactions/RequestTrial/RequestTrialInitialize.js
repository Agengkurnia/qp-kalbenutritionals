function validateFormHeader() {
    let isValid = true;

    const prodev = $('#selectProdev').val();
    const prosdev = $('#selectProsdev').val();
    const packdev = $('#selectPackdev').val();
    const ppic = $('#selectPPIC').val();


    if (!prodev && !packdev && !prosdev) {
        showMessageError("One of Prodev, Packdev, or Pros must be filled in");
        isValid = false;
    } else {
        $('#Prodev').val(prodev);
        $('#Prosdev').val(prosdev);
        $('#Packdev').val(packdev);
        $('#Ppic').val(ppic);   
    }

    return isValid;
}
function validateForm() {
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

    $('.text-danger-validation').hide();

    let isValid = true;

    if (!itemCode) {
        $('#itemCodeError').show();
        isValid = false;
    }

    if (!allMaterialPrepared) {
        $('#allMaterialPreparedError').show();
        isValid = false;
    }

    if (!trialType) {
        $('#trialTypeError').show();
        isValid = false;
    }

    if (!machineLine) {
        $('#machineLineError').show();
        isValid = false;
    }

    if (!trialQty || (trialQty.replace(',', '.') < 0 || trialQty.replace(',', '.') > 1)) {
        $('#trialQtyError').show();
        isValid = false;
    }

    if (!trialEstimation) {
        $('#trialEstimationError').show();
        isValid = false;
    }

    if (!trialDateProposalFrom) {
        $('#trialDateProposalFromError').show();
        isValid = false;
    }

    if (!trialDateProposalTo) {
        $('#trialDateProposalToError').show();
        isValid = false;
    }

    if (trialDateProposalTo && trialDateProposalFrom && new Date(trialDateProposalTo) < new Date(trialDateProposalFrom)) {
        showMessageError("Trial Date Proposal To must not be earlier than Trial Date Proposal From!");
        isValid = false;
    }

    return isValid;
}


function initialize() {
    $(".select2").select2();
    if (msgSuccess !== "") {
        showMessageSucces(msgSuccess);
    }

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
                    $('#formulaNo').empty();
                    $('#formulaNo').append('<option value="" selected>Select Formula No</option>');

                    $.each(data, function (index, item) {
                        $('#formulaNo').append('<option value="' + item.formulaNo + '">' + item.formulaNo + "  |  " + " Ver "+ item.formulaVersion + "  |  " + item.formulaDesc1 +'</option>');
                    });

                    //if (data && data.length > 0) {
                    //    $('#formulaNo').val(requestTrialDetail[indexModal].formulaNo).trigger('change'); // Set default value
                    //}

                    $('#formulaNo').prop('disabled', false).trigger('change');
                },
                error: function (xhr, status, error) {
                    console.error('Error fetching data:', error);
                }
            });
        } else {
            $('#formulaNo').prop('disabled', true);
        }
    });

    $('#formulaNo').on('change', function () {
        var formulaNoValue = $(this).val();

        if (formulaNoValue) {

            $.ajax({
                url: '/RequestTrial/GetBoLOV',
                type: 'GET',
                data: { formulaNo: formulaNoValue },
                success: function (data) {
                    $('#boNumber').empty();
                    $('#boNumber').append('<option value="" disabled selected>Select BO Number</option>');

                    $.each(data, function (index, item) {
                        $('#boNumber').append('<option value="' + item.batchNo + '">' + item.batchNo + '</option>');
                    });

                    if (department === 'PPIC') {
                        $('#boNumber').prop('disabled', false).trigger('change');
                    } else {
                        $('#boNumber').prop('disabled', true);
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Error fetching data:', error);
                }
            });
        } else {
            $('#boNumber').prop('disabled', true);
        }
    });

    $('#requestModal').on('shown.bs.modal', function () {
        $(this).find('select.select2').each(function () {
            $(this).select2({
                dropdownParent: $('#requestModal')
            });
        });
    });


    $('#requestModalEdit').on('shown.bs.modal', function () {
        $(this).find('select.select2').each(function () {
            $(this).select2({
                dropdownParent: $('#requestModalEdit')
            });
        });
    });

    let today = new Date().toISOString().split('T')[0];
    $('#trialDateProposalFrom').attr('min', today);
    $('#trialDateProposalTo').attr('min', today);
    $('#confirmPlanTrialDate').attr('min', today);
    $('#confirmPlanTrialDateEdit').attr('min', today);
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

    $('input[required]').on('input', function () {
        $(this).next('.text-danger-validation').hide();
    });

    $('#requestForm').on('submit', function (e) {
        let isValid = true;

        $('.text-danger-validation').hide();

        $('input[required]').each(function () {
            if ($(this).val() === '') {
                isValid = false;
                $(this).next('.text-danger-validation').show();
            }
        });

        if (!isValid) {
            e.preventDefault();
        }
    });

    $('#dataTableRequestTrialDetail').DataTable({
        scrollX: true,
        //fixedHeader: true,
    });

    $('#deleteSubmitRequestTrial').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);

        var index = button.data('index');
        indexToDelete = index

        $('#deleteIndex').text(index);
    });


    $('#rejectSubmitRequestTrial').on('hidden.bs.modal', function () {
        indexToDelete = 99;
        $('.text-danger-validation').hide();
    });

    $('#historicalModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var index = button.data('index');

        var statusRequestTrial = $('#StatusRequestTrial').val()
        var statusEvaluationTrial = $('#StatusEvaluationTrial').val()
        var statusDisposition = $('#StatusDisposition').val()
        var requestTrialGuid = $('#RequestTrialGuid').val()

        $(this).find('.request-trial-status').text(statusRequestTrial);
        $(this).find('.protocol-eval-status').text(statusEvaluationTrial);
        $(this).find('.disposition-status').text(statusDisposition);

        $.ajax({
            url: '/RequestTrial/GetHistoricalStatus',
            type: 'GET',
            data: { id: requestTrialGuid },
            success: function (response) {
                $('#dataTableHistoricalStatus tbody').empty();
                $.each(response, function (index, item) {
                    var options = { day: '2-digit', month: 'short', year: 'numeric' };
                    var formattedDate = new Date(item.actionDate).toLocaleDateString('en-GB', options).replace(/ /g, '-');

                    // Cek jika item.isTempData == true dan ubah warna font
                    var rowColor = item.isTempData ? 'style="color: red;"' : '';

                    var row = `<tr ${rowColor}>
                          <td>${item.form}</td>
                          <td>${item.action}</td>
                          <td>${item.updatedBy}</td>
                          <td>${item.department}</td>
                          <td>${formattedDate}</td>
                          <td>${item.remark}</td>
                       </tr>`;
                    $('#dataTableHistoricalStatus tbody').append(row);
                });
            },
            error: function (xhr, status, error) {
                console.error('Error fetching data:', error);
            }
        });

    });

    var statusRequestTrial = $('#StatusRequestTrial').val();

    if (isSuperUser === "false") {
        if (statusRequestTrial !== "DRAFT" || isReadOnly === "true") {
            $('#TrialName').prop('readonly', true).css('background-color', '#f0f0f0');
            $('#TrialObjective').prop('readonly', true).css('background-color', '#f0f0f0');
            $('#selectProdev').prop('disabled', true).css('background-color', '#f0f0f0');
            $('#selectProsdev').prop('disabled', true).css('background-color', '#f0f0f0');
            $('#selectPackdev').prop('disabled', true).css('background-color', '#f0f0f0');
            $('#selectPPIC').prop('disabled', true).css('background-color', '#f0f0f0');
            $('#selectManufacturer').prop('disabled', true).css('background-color', '#f0f0f0');
        }
    }
    if (summaryRecommendation !== "") {
        //let dataJSON = summaryRecommendation.replace(/&quot;/g, '"');

        //let parsedData = JSON.parse(dataJSON);

        let dataJSON = summaryRecommendation.replace(/&quot;/g, '"');

        // Mengganti newline (\n) dengan \\n agar valid untuk JSON.parse
        dataJSON = dataJSON.replace(/\n/g, "\\n");

        try {
            // Parsing JSON
            let parsedData = JSON.parse(dataJSON);

            if (parsedData != null) {

                $('#summaryRequestTrial').val(parsedData.Summary);
                $('#recommendationRequestTrial').val(parsedData.Recommendation);
            }
        } catch (error) {
        }
    }

    if (requestDetail !== "") {
        let dataJSON = requestDetail.replace(/&quot;/g, '"');

        let parsedData = JSON.parse(dataJSON);

        parsedData.forEach(data => {
            requestTrialDetail.push({
                itemCode: data.ItemCode,
                formulaNo: data.FormulaNo,
                allMaterialPrepared: data.AllMaterialPrepared,
                trialType: data.TrialType,
                processTrial: data.ProcessTrialDB ? data.ProcessTrialDB.replace(/,\s+/g, ',').split(',') : null,
                machineLine: data.MachineLine,
                trialQty: data.TrialQty,
                moRmFlushing: data.MoRmFlushing,
                trialEstimation: data.TrialEstimation,
                trialDateProposalFrom: data.TrialDateProposalFrom,
                trialDateProposalTo: data.TrialDateProposalTo,
                boNumber: data.BoNumber,
                confirmPlanTrialDate: data.ConfirmPlanTrialDate
            });
        });

        let jsonString = JSON.stringify(requestTrialDetail);
        $('#requestTrialDetail').val(jsonString);
        updateTable();
    }


    var status = $('#StatusRequestTrial').val()
    let canEdit = ((status !== "" && status !== "DRAFT") && isReadOnly !== "true" && (status === "" || status === "REJECTED" || status === "DRAFT" || status == "WAITING FOR TRIAL DATE"));
    if (!canEdit) {

        $('#boNumber').prop('disabled', true);
        $("#confirmPlanTrialDate").prop("disabled", true);
    }

    $('#requestModal').on('shown.bs.modal', function () {
        $(this).find('select.select2').each(function () {
            $(this).select2({
                dropdownParent: $('#requestModal')
            });
        });
    });
}

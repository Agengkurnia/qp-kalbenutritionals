"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();

let ingridientList = [];

let parameterList = [];
let parameterCheckList = [];

let parameterCheckFGList = [];

let templateList = [];

let attachmentList = [];

let sampleOracleList = [];
let sampleSatrioList = [];

let uomList = [];

let fgList = [];

let flowProcessList = [];

let flowProcessAllList = [];

let fgAllList = [];

let srList = [];

let indexModal = 99;
let indexDelete = 99;
let indexEdit = 99;

let modalStateFlowProcess = "add";
let indexModalFlowProcess = 99;

let deleteState = "";

let modalStateSR = "add";
let indexModalSR = 99

let modalStateFG = "add";
let indexModalFG = 99;

let selectedItemParamCheck = null;
let selectedItemParamCheckFG = null;

var activeRequests = 3;

let modalStateAttach = "add";

let statusDisposition = "";

let listSampleNo = [];

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    $(".select2").select2();

    $('#oldFileAttachModal').hide();

    $('#formulaTrialModal').on('shown.bs.modal', function () {
        $(this).find('select.select2').each(function () {
            $(this).select2({
                dropdownParent: $('#formulaTrialModal')
            });
        });
    });

    $('#addFGModal').on('shown.bs.modal', function () {
        $(this).find('select.select2').each(function () {
            $(this).select2({
                dropdownParent: $('#addFGModal')
            });
        });
    }); 

    $('#dataTableFinishedGood').DataTable({
        scrollX: true,
    });

    $('#addFlowProcessModal').on('shown.bs.modal', function () {
        $(this).find('select.select2').each(function () {
            $(this).select2({
                dropdownParent: $('#addFlowProcessModal')
            });
        });
    });
    
    $('#addAttachmentModal').on('shown.bs.modal', function () {
        $(this).find('select.select2').each(function () {
            $(this).select2({
                dropdownParent: $('#addAttachmentModal')
            });
        });
    }); 

    $('#addSampleRequirementModal').on('shown.bs.modal', function () {
        $(this).find('select.select2').each(function () {
            $(this).select2({
                dropdownParent: $('#addSampleRequirementModal')
            });
        });
    });

    var selectedFormula = $('#selectFormula').val();

    if (selectedFormula) {
        $('#selectFormula').prop('disabled', true).css('background-color', '#f0f0f0');
        GenerateIngridient();
    } else {
        $('#selectURT').prop('disabled', true);
    }


    $('#dataTableFormulaTrial').DataTable({
        scrollX: true,
        columnDefs: [
            {
                targets: 0, 
                orderable: false,
            }
        ]
    });


    $('#dataTableAttachment').DataTable({
        columnDefs: [
            {
                targets: 0,
                orderable: false,
            }
        ]
    });

    $('#dataTableFlowProcess').DataTable({
        scrollX: true,
    });

    $('#dataTableSampleRequirement').DataTable({
    });

    $('#dataTableCopyFlowProcess').DataTable({
    });

    $('#dataTableCopyFG').DataTable({
    });

    $('a[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
        selectedItemParamCheck = null;
        var activeTab = $(e.target).attr("href");

        if (activeTab === '#tab1') {
            GenerateIngridient();
        } else if (activeTab === '#tab2') {
            OnInitFlowProcess();
        } else if (activeTab === '#tab3') {
            OnInitFinishedGood();
        } else if (activeTab === '#tab4') {
            OnInitSampleRequirement();
        } else if (activeTab === '#tab6') {
            $('#IsEditingSummary').val('true');
        }
    });

    var processDetails = $('#ProcessDetails').val();

    if (processDetails !== "") {
        let dataJSON = processDetails.replace(/&quot;/g, '"');

        let parsedData = JSON.parse(dataJSON);

        parsedData.forEach(data => {
            var flowProcessData = {
                seq: data.Seq,
                flowProcess: data.FlowProcess,
                description: data.Description,
                parameterCheck: data.ParameterCheck,
                uom: data.Uom,
                testType: data.TestType,
                frequency: data.Frequency,
                standardMin: data.StandardMin,
                standardTarget: data.StandardTarget,
                standardMax: data.StandardMax,
                result: data.Result,
                remarks: data.Remarks,
                rowVersion: data.RowVersion
            };
            flowProcessList.push(flowProcessData);
        });

        UpdateTableFlowProcess();
    }


    var sampleRequirements = $('#SampleRequirements').val();

    if (sampleRequirements !== "") {
        let dataJSON = sampleRequirements.replace(/&quot;/g, '"');

        let parsedData = JSON.parse(dataJSON);
        parsedData.forEach(data => {
            srList.push({
                uom: data.Uom,
                remarks: data.Remarks,
                sampleQty: data.SampleQty,
            });
        });
        UpdateTableSR();
    }

    var attachments = $('#Attachments').val();

    if (attachments !== "") {
        let dataJSON = attachments.replace(/&quot;/g, '"');

        let parsedData = JSON.parse(dataJSON);
        parsedData.forEach(data => {
            attachmentList.push({
                attachmentGuid: data.AttachmentGuid,
                attachmentHeaderGuid: data.AttachmentHeaderGuid,
                documentType: data.DocumentType,
                remarks: data.Remarks,
                file: data.File.replace("/attachment/", ""),
                fileName: data.FileName,
                isUploadFile: false,
            });
        });
        UpdateTableAttach();
    }

    $("#standardTargetSelectFlowModal").prop('disabled', true).css('background-color', '#f0f0f0');
    $("#standardTargetSelectFGModal").prop('disabled', true).css('background-color', '#f0f0f0');

    var manuf = $('#selectManufacturer').val();
    if (manuf !== "SHP") {
        $('#spanUrt').text('');
        $('#spanUrtDesc').text('');
    }

    var statusEvaluationTrial = $('#StatusEvaluationTrial').val()
    if (isReadOnlyProtocol === "true" &&
        (statusEvaluationTrial !== "" || statusEvaluationTrial !== "DRAFT" ||
            statusEvaluationTrial !== "PROTOCOL REVISED" || statusEvaluationTrial !== "EVALUATION REVISED")) {
        $('#selectURT').prop('disabled', true);
        $('#Note').prop('readonly', true).css('background-color', '#f0f0f0');
        $('#FlowProcessNote').prop('readonly', true).css('background-color', '#f0f0f0');
        $('#Summary').prop('readonly', true).css('background-color', '#f0f0f0');
        $('#SummaryRecommendation').prop('readonly', true).css('background-color', '#f0f0f0');
        $('#selectItemCodeFG').prop('disabled', true);
        $('#selectFormula').prop('disabled', true); 
    }

    if (isReadOnlyProtocol === "true" || statusEvaluationTrial !== "EVALUATION ON GOING") {
        $('#actualTrialDateFormula').prop('readonly', true).css('background-color', '#f0f0f0');
    }

});
///BATAS DOCUMENT READY

$('#toTab2').on('click', function () { $('#tab2-tab').tab('show'); });


function OnInitSampleRequirement() {
    $('#IsEditingSampleRequirement').val('true');
    if (uomList.length === 0) {
        $.ajax({
            url: '/RequestTrial/GetAllUOM',
            type: 'GET',
            success: function (data) {
                $('#selectUomSRModal').empty();
                $('#selectUomSRModal').append('<option value="" disabled selected>Select UOM</option>');

                $.each(data, function (index, item) {
                    $('#selectUomSRModal').append('<option value="' + item.uomCode + '">' + item.uom + '</option>');

                    uomList.push({
                        uomCode: item.uomCode,
                        uom: item.uom,
                    });
                });


                $('#selectUomSRModal').prop('disabled', false).trigger('change');

            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
            }
        });
    }
}

function GetStandardLOV(code) {
    $.ajax({
        url: '/RequestTrial/GetStandardOracles',
        type: 'GET',
        data: {
            code: code,
        },
        success: function (data) {
            $('#resultSelectFlowModal').empty();
            $('#standardTargetSelectFlowModal').empty();
            $('#standardMaxSelectFlowModal').empty();
            $('#standardMinSelectFlowModal').empty();
            $('#resultSelectFlowModal').append('<option value="" disabled selected>Select Result</option>');
            $('#standardTargetSelectFlowModal').append('<option value="" disabled selected>Select Target</option>');
            $('#standardMinSelectFlowModal').append('<option value="" disabled selected>Select Standard Min</option>');
            $('#standardMaxSelectFlowModal').append('<option value="" disabled selected>Select Standard Max</option>');

            $.each(data, function (index, item) {
                if ($('#resultSelectFlowModal option[value="' + item.valueChar + '"]').length === 0) {
                    $('#resultSelectFlowModal').append('<option value="' + item.valueChar + '">' + item.valueChar + '</option>');
                }

                if ($('#standardTargetSelectFlowModal option[value="' + item.valueChar + '"]').length === 0) {
                    $('#standardTargetSelectFlowModal').append('<option value="' + item.valueChar + '">' + item.valueChar + '</option>');
                }

                if ($('#standardMinSelectFlowModal option[value="' + item.minValueNum + '"]').length === 0) {
                    $('#standardMinSelectFlowModal').append('<option value="' + item.minValueNum + '">' + item.minValueNum + '</option>');
                }

                if ($('#standardMaxSelectFlowModal option[value="' + item.maxValueNum + '"]').length === 0) {
                    $('#standardMaxSelectFlowModal').append('<option value="' + item.maxValueNum + '">' + item.maxValueNum + '</option>');
                }
            });

            $('#standardTargetSelectFlowModal').prop('disabled', false).trigger('change');
        },
        error: function (xhr, status, error) {
        }
    });
}

function updateStandardFields(testType) {
    if (testType === "V") {

        $('#stdMaxSelect').hide();
        $('#stdMinSelect').hide();
        $('#stdTargetSelect').show();

        $('#standardMinFlowModal').show();
        $('#standardMaxFlowModal').show();
        $('#standardTargetFlowModal').val('');
        $('#standardTargetFlowModal').hide();

        $("#standardMinFlowModal, #standardMaxFlowModal, #standardTargetFlowModal").attr("readonly", true).css('background-color', '#f0f0f0');

        $("#standardTargetSelectFlowModal").prop('disabled', false).css('background-color', '#FFFFFF');

        GetStandardLOV(selectedItemParamCheck.testCode);
    } else if (testType === "N") {
        $('#stdMaxSelect').hide();
        $('#stdMinSelect').hide();
        $('#stdTargetSelect').hide();

        $('#standardMinFlowModal').show();
        $('#standardMaxFlowModal').show();
        $('#standardTargetFlowModal').show();

        $('#standardMinFlowModal').val('');
        $('#standardMaxFlowModal').val('');
        $('#standardTargetFlowModal').val('');
        $("#standardMinFlowModal").on("input", function () {
            let value = $(this).val();
            const errorMessageElement = $("#standardMinFlowModalError");

            errorMessageElement.hide();

            if (!/^-?\d*\.?\d*$/.test(value)) {
                $(this).val(value.slice(0, -1));
            } else if (parseFloat(value) < selectedItemParamCheck.minValueNum) {
                errorMessageElement.text(`Value cannot be less than ${selectedItemParamCheck.minValueNum}`).show();
            }
        });


        $("#standardMaxFlowModal").on("input", function () {
            let value = $(this).val();
            const errorMessageElement = $("#standardMaxFlowModalError");

            errorMessageElement.hide();

            if (!/^-?\d*\.?\d*$/.test(value)) {
                $(this).val(value.slice(0, -1));
            } else if (parseFloat(value) > selectedItemParamCheck.maxValueNum) {
                errorMessageElement.text(`Value cannot be greater than ${selectedItemParamCheck.maxValueNum}`).show();
            }
        });

        $("#standardTargetFlowModal").on("input", function () {
            let value = $(this).val();
            const errorMessageElement = $("#standardTargetFlowModalError");

            errorMessageElement.hide();

            if (!/^-?\d*\.?\d*$/.test(value)) {
                $(this).val(value.slice(0, -1));
            }
            //else if (parseFloat(value) < selectedItemParamCheck.minValueNum || parseFloat(value) > selectedItemParamCheck.maxValueNum) {
            //    errorMessageElement
            //        .text(`Value must be between ${selectedItemParamCheck.minValueNum} and ${selectedItemParamCheck.maxValueNum}`)
            //        .show();
            //}
        });

        $("#standardMinFlowModal, #standardMaxFlowModal, #standardTargetFlowModal").attr("readonly", false).css('background-color', '#ffffff');
        $("#standardTargetSelectFlowModal").prop("disabled", true).css('background-color', '#ffffff');

    } else if (testType === "T") {
        $("#standardTargetSelectFlowModal").prop('disabled', false).css('background-color', '#FFFFFF');

        GetStandardLOV(selectedItemParamCheck.testCode);
        $('#standardMinFlowModal').hide();
        $('#standardMaxFlowModal').hide();
        $('#standardTargetFlowModal').hide();

        $('#stdMaxSelect').show();
        $('#stdMinSelect').show();
        $('#stdTargetSelect').show(); 
    }
}

function resetStandardFields() {
    $("#standardMinFlowModal").replaceWith(`<input type="text" class="form-control" id="standardMinFlowModal" readonly style="background-color: #f0f0f0;">`);
    $("#standardMaxFlowModal").replaceWith(`<input type="text" class="form-control" id="standardMaxFlowModal" readonly style="background-color: #f0f0f0;">`);
    $("#standardTargetSelectFlowModal").replaceWith(`<input type="text" class="form-control" id="standardTargetSelectFlowModal" readonly style="background-color: #f0f0f0;">`);
}

$('#historicalModal').on('show.bs.modal', function (event) {
    debugger;
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


function OnInitFlowProcess() {
    $('#IsEditingFlowProcess').val('true');
    $('#stdMaxSelect').hide();
    $('#stdMinSelect').hide();
    $('#stdTargetSelect').hide();

    if (parameterList.length === 0) {
        $.ajax({
            url: '/RequestTrial/GetParameter',
            type: 'GET',
            data: {
                param: 'P3_FLOWPROCESS'
            },
            success: function (data) {
                $('#selectFlowFlowModal').empty();
                $('#selectFlowFlowModal').append('<option value="" disabled selected>Select Flow Process</option>');

                $.each(data, function (index, item) {
                    $('#selectFlowFlowModal').append('<option value="' + item.txtCode + '">' + item.txtDescription + '</option>');

                    parameterList.push({
                        intIdParameter: item.intIdParameter,
                        txtIdParameter: item.txtIdParameter,
                        txtCode: item.txtCode,
                        txtDescription: item.txtDescription,
                        txtVariable: item.txtVariable,
                        bitActive: item.bitActive,
                        dtmCreatedDate: item.dtmCreatedDate,
                        txtCreatedBy: item.txtCreatedBy,
                        dtmUpdatedDate: item.dtmUpdatedDate,
                        txtUpdatedBy: item.txtUpdatedBy
                    });
                });


                $('#selectFlowFlowModal').prop('disabled', false).trigger('change');
            },
            error: function (xhr, status, error) {
            }
        });
    }

    if (parameterCheckList.length === 0) {
        $.ajax({
            url: '/RequestTrial/GetParameterCheck',
            type: 'GET',
            success: function (data) {
                $('#parameterFlowModal').empty();
                $('#parameterFlowModal').append('<option value="" disabled selected>Select Flow Process</option>');

                $.each(data, function (index, item) {
                    var unit = item.testUnit == null ? "" : " || " + item.testUnit;
                    $('#parameterFlowModal').append('<option value="' + item.testCode + '">' + item.testCode + unit + '</option>');

                    parameterCheckList.push({
                        testCode: item.testCode,
                        testDesc: item.testDesc,
                        testClass: item.testClass,
                        testType: item.testType,
                        testMethodId: item.testMethodId,
                        testMethodDesc: item.testMethodDesc,
                        testUnit: item.testUnit,
                        maxValueNum: item.maxValueNum,
                        minValueNum: item.minValueNum,
                    });
                });
                $('#parameterFlowModal').prop('disabled', false).trigger('change');
            },
            error: function (xhr, status, error) {
            }
        });
    }
}

$('#selectFormula').on('change', function () {
    var selectedFormula = $(this).val();
    $('#formulaTrialFormulaNo').val(selectedFormula);

    $.ajax({
        url: '/RequestTrial/GetFormulaNoByFormulaNo',
        type: 'GET',
        data: { formulaNo: selectedFormula },
        success: function (response) {
            $('#FormulaVers').val(response.formulaVersion);
            $('#FormulaDescription').val(response.formulaDesc1);
            GenerateIngridient();
            GetURT();
        },
        error: function (error) {
        }
    });
});

$('#selectURT').on('change', function () {
    var selectedURT = $(this).val();
    $('#formulaTrialUrt').val(selectedURT);

    $.ajax({
        url: '/RequestTrial/GetUrtByUrtNo',
        type: 'GET',
        data: { urtNo: selectedURT },
        success: function (response) {
            if (response) {
                $('#UrtDescription').val(response.urtDescription);
            }
        },
        error: function (error) {
        }
    });
});

$('#addFGModal').on('hidden.bs.modal', function () {
    clearFGInputs();
})

$('#addFlowProcessModal').on('hidden.bs.modal', function () {
    clearFlowProcessInputs();
})

$('#addAttachmentModal').on('hidden.bs.modal', function () {
    modalStateAttach = "add";
    ClearAttach();
    $('#oldFileAttachModal').hide();
})

$('#addSampleRequirementModal').on('hidden.bs.modal', function () {
    ClearSR();
})

$('#formulaTrialModal').on('hidden.bs.modal', function () {
    $('#halalCertificateModal').attr("readonly", false).css('background-color', '#ffffff');
    $('#needHalalModal').prop("disabled", false);
    $('#halalEDModal').attr("readonly", false).css('background-color', '#ffffff');
})

$(document).on('click', '.edit-btn-flow-process', function () {
    var statusEval = $('#StatusEvaluationTrial').val();
    indexEdit = $(this).data('index');
    const data = flowProcessList[indexEdit];
    modalStateFlowProcess = "edit";


    $('#seqFlowModal').val(data.seq);
    $('#selectFlowFlowModal').val(data.flowProcess).trigger('change');
    $('#descriptionFlowModal').val(data.description);
    $('#parameterFlowModal').val(data.parameterCheck).trigger('change');
    $('#uomFlowModal').val(data.uom);
    $('#testTypeFlowModal').val(data.testType);
    $('#frequencyFlowModal').val(data.frequency);
    $('#remarksFlowModal').val(data.remarks);

    setTimeout(() => {
        if (data.testType === 'N') {
            $('#standardMinFlowModal').val(data.standardMin);
            $('#standardTargetFlowModal').val(data.standardTarget);
            $('#standardMaxFlowModal').val(data.standardMax);

            $('#resultFlowModal').val(data.result);

            $("#resultFlowModal").on("input", function () {
                let value = $(this).val();
                const errorMessageElement = $("#resultFlowModalError");

                errorMessageElement.hide();

                if (!/^-?\d*\.?\d*$/.test(value)) {
                    $(this).val(value.slice(0, -1));
                }
                //else if (parseFloat(value) < parseFloat(data.standardMin) || parseFloat(value) > parseFloat(data.standardMax)) {
                //    errorMessageElement
                //        .text(`Value must be between ${data.standardMin} and ${data.standardMax}`)
                //        .show();
                //}
            });
        } else if (data.testType === 'V') {
            $('#standardTargetSelectFlowModal').val(data.standardTarget).trigger('change');
            $('#resultSelectFlowModal').val(data.result).trigger('change');
        } else {

            $('#stdResultSelect').hide();
            $('#resultFlowModal').show();

            $('#standardMinSelectFlowModal').val(data.standardMin).trigger('change');
            $('#standardTargetSelectFlowModal').val(data.standardTarget).trigger('change');
            $('#standardMaxSelectFlowModal').val(data.standardMax).trigger('change');
            $('#resultSelectFlowModal').val(data.result).trigger('change');
        }

        if (statusEval === "EVALUATION ON GOING") {
            $('#seqFlowModal').prop('readonly', true).css('background-color', '#f0f0f0');
            $('#descriptionFlowModal').prop('readonly', true).css('background-color', '#f0f0f0');
            $('#uomFlowModal').prop('readonly', true).css('background-color', '#f0f0f0');
            $('#testTypeFlowModal').prop('readonly', true).css('background-color', '#f0f0f0');
            $('#frequencyFlowModal').prop('readonly', true).css('background-color', '#f0f0f0');

            $('#standardMinFlowModal').prop('readonly', true).css('background-color', '#f0f0f0');
            $('#standardTargetFlowModal').prop('readonly', true).css('background-color', '#f0f0f0');
            $('#standardMaxFlowModal').prop('readonly', true).css('background-color', '#f0f0f0');

            $('#parameterFlowModal').prop('disabled', true);
            $('#selectFlowFlowModal').prop('disabled', true);
            $('#standardTargetSelectFlowModal').prop('disabled', true);
            $('#standardMinSelectFlowModal').prop('disabled', true);
            $('#standardMaxSelectFlowModal').prop('disabled', true);
            $('#resultFlowModal').prop('readonly', false).css('background-color', '#ffffff');
            $('#remarksFlowModal').prop('readonly', false).css('background-color', '#fffff');
            if (data.testType === 'N') {
                $('#stdResultSelect').hide();
                $('#resultFlowModal').show(); 
            } else if (data.testType === 'T') {
                $('#stdResultSelect').show();
                $('#resultFlowModal').hide(); 
            } else if (data.testType === 'V') {
                $('#stdResultSelect').show();
                $('#resultFlowModal').hide(); 
            }
        } else {
            $('#stdResultSelect').hide();
            $('#resultFlowModal').show();
            $('#resultFlowModal').prop('readonly', true).css('background-color', '#f0f0f0');
            $('#remarksFlowModal').prop('readonly', true).css('background-color', '#f0f0f0');
        }
    }, 500);


    $('#addFlowProcessModalLabel').text('Edit Item');
})


$(document).on('click', '.edit-btn-fg', function () {
    debugger;
    var statusEval = $('#StatusEvaluationTrial').val();
    indexEdit = $(this).data('index');
    const data = fgList[indexEdit];
    modalStateFG = "edit";

    $('#stdTargetSelectFG').hide();
    $('#standardTargetFGModal').show();

    $('#seqFGModal').val(data.seq);
    $('#parameterFGModal').val(data.parameterCheck).trigger('change');
    $('#uomFGModal').val(data.uom);
    $('#testTypeFGModal').val(data.testType);
    $('#frequencyFGModal').val(data.frequency);
    $('#sampleNoFGModal').val(data.sampleNo);
    $('#remarksFGModal').val(data.remarks);


    setTimeout(() => {
        $('#standardMinFGModal').val(data.standardMin);
        $('#standardMinSelectFGModal').val(data.standardMin).trigger('change');
        $('#standardTargetSelectFGModal').val(data.standardTarget).trigger('change');
        $('#standardMaxFGModal').val(data.standardMax);
        $('#standardTargetFGModal').val(data.standardTarget);
        $('#standardMaxSelectFGModal').val(data.standardMax).trigger('change');

        if (data.testType === 'N') {
            $('#standardMinFGModal').val(data.standardMin);
            $('#standardTargetFGModal').val(data.standardTarget);
            $('#standardMaxFGModal').val(data.standardMax);

            $('#resultFGModal').val(data.result);

            debugger;
            $("#resultFGModal").on("input", function () {
                let value = $(this).val();
                const errorMessageElement = $("#resultFGModalError");

                errorMessageElement.hide();

                if (!/^-?\d*\.?\d*$/.test(value)) {
                    console.log(value);
                    $(this).val(value.slice(0, -1));
                }
                //else if (parseFloat(value) < parseFloat(data.standardMin) || parseFloat(value) > parseFloat(data.standardMax)) {
                //    errorMessageElement
                //        .text(`Value must be between ${data.standardMin} and ${data.standardMax}`)
                //        .show();
                //}
            });
        } else if (data.testType === 'V') {
            $('#standardTargetSelectFGModal').val(data.standardTarget).trigger('change');
            $('#resultSelectFGModal').val(data.result).trigger('change');
        } else {
            debugger;
            //$('#stdResultSelectFG').hide();
            //$('#resultFlowModal').show();

            $('#standardMinSelectFGModal').val(data.standardMin).trigger('change');
            $('#standardTargetSelectFGModal').val(data.standardTarget).trigger('change');
            $('#standardMaxSelectFGModal').val(data.standardMax).trigger('change');
            $('#resultSelectFGModal').val(data.result).trigger('change');
        }

        if (statusEval === "EVALUATION ON GOING") {
            $('#seqFGModal').prop('readonly', true).css('background-color', '#f0f0f0');
            $('#parameterFGModal').prop('disabled', true);
            $('#uomFGModal').prop('readonly', true).css('background-color', '#f0f0f0');
            $('#testTypeFGModal').prop('readonly', true).css('background-color', '#f0f0f0');

            $('#standardMinFGModal').prop('readonly', true).css('background-color', '#f0f0f0');
            $('#standardMaxFGModal').prop('readonly', true).css('background-color', '#f0f0f0');
            $('#standardTargetFGModal').prop('readonly', true).css('background-color', '#f0f0f0');

            $('#sampleNoFGModal').prop('readonly', false).css('background-color', '#fffff');

            $('#standardMinSelectFGModal').prop('disabled', true);
            $('#standardMaxSelectFGModal').prop('disabled', true);
            $('#standardTargetSelectFGModal').prop('disabled', true);

            $('#remarksFGModal').attr("readonly", false).css('background-color', '#ffffff');

            if (fgList[indexEdit].isResultOracle === true) {
                $('#resultFGModal').attr('readonly', true).css('background-color', '#f0f0f0');
            } else {
                $('#resultFGModal').attr('readonly', false).css('background-color', '#ffffff');
            }
            if (data.testType === 'N') {
                $('#stdResultFGSelect').hide();
                $('#resultFGModal').show();
            } else if (data.testType === 'T') {
                $('#stdResultFGSelect').show();
                $('#resultFGModal').hide();
            } else if (data.testType === 'V') {
                $('#stdResultFGSelect').show();
                $('#resultFGModal').hide();
            }
        } else {
            $('#stdResultFGSelect').hide();
            $('#resultFGModal').show();
            $('#resultFGModal').prop('readonly', true).css('background-color', '#f0f0f0');
            $('#remarksFGModal').prop('readonly', true).css('background-color', '#f0f0f0');
            $('#sampleNoFGModal').prop('readonly', true).css('background-color', '#f0f0f0');
        }
    }, 500);

    if (data.isResultOracle == true) {
        $('#resultFGModal').prop('readonly', true).css('background-color', '#f0f0f0');
    } else {
        $('#resultFGModal').prop('readonly', false).css('background-color', '#ffffff');
    }

    $('#addFGModalLabel').text('Edit Test');
})

$(document).on('click', '.edit-btn', function () {
    indexModal = $(this).data('index');
    const data = ingridientList[indexModal];
    let formattedDate = "";
    if (data.halalED) {
        var dateObj = new Date(data.halalED);

        var year = dateObj.getFullYear();
        var month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
        var day = ('0' + dateObj.getDate()).slice(-2);

        formattedDate = year + '-' + month + '-' + day;
    }

    $('#itemCodeModal').val(data.itemCode);
    $('#descriptionModal').val(data.description);
    $('#needHalalModal').val(data.needHalal ?? "Yes").trigger('change');
    $('#halalCertificateModal').val(data.halalCertificate);
    $('#halalEDModal').val(formattedDate);
    $('#remarksModal').val(data.remarks);

    if (data.isReadOnly) {
        $('#halalCertificateModal').attr("readonly", true).css('background-color', '#f0f0f0');
        $('#needHalalModal').prop("disabled", true).css('background-color', '#ffffff');
        $('#halalEDModal').attr("readonly", true).css('background-color', '#f0f0f0');
    }
});

function GetURT() {
    var selectedFormula = $('#selectFormula').val();
    $.ajax({
        url: '/RequestTrial/GetUrt',
        type: 'GET',
        data: { formulaNo: selectedFormula },
        success: function (data) {
            $('#selectURT').empty();
            $('#selectURT').append('<option value="" disabled selected>Select URT</option>');

            $.each(data, function (index, item) {
                $('#selectURT').append('<option value="' + item.urtNo + '">' + item.urtNo + item.formulaVers + '</option>');
            });

            $('#selectURT').prop('disabled', false).trigger('change');
        },
        error: function (xhr, status, error) {
        }
    });
}

//function UpdateTableFinishedGood() {
//    var dataTable = $('#dataTableFormulaTrial').DataTable();
//    dataTable.clear();

//    dataTable.rows.add(ingridientList.map((item, index) => {
//        let actionButtons = '';
//        let canEdit = true;

//        if (canEdit) {
//            actionButtons = `
//                <div class="btn-group" role="group">
//                    <button id="editBtn" class="btn btn-sm btn-primary edit-btn" type="button" data-bs-toggle="modal" data-bs-target="#formulaTrialModal" data-index="${index}">
//                        <i class="fas fa-edit"></i>
//                    </button>
//                </div>`;
//        }

//        return [
//            index + 1,
//            item.itemCode,
//            item.description,
//            item.qty,
//            item.uom,
//            item.needHalal != null ? item.needHalal : "Yes",
//            item.halalCertificate ?? "",
//            item.halalED != null ? item.halalED : "",
//            item.remarks ?? "",
//            canEdit ? actionButtons : ''
//        ];
//    }));

//    dataTable.draw();

//    let jsonString = JSON.stringify(ingridientList);
//    $('#Ingridients').val(jsonString);
//}


function UpdateTableFormulaTrial() {
    var dataTable = $('#dataTableFormulaTrial').DataTable();
    dataTable.clear();

    dataTable.rows.add(ingridientList.map((item, index) => {
        let actionButtons = '';
        let canEdit = true;

        if (canEdit) {
            actionButtons = `
                <div class="btn-group" role="group">
                    <button id="editBtn" class="btn btn-sm btn-primary edit-btn" type="button" data-bs-toggle="modal" data-bs-target="#formulaTrialModal" data-index="${index}">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>`;
        }

        return [
            index + 1,
            item.itemCode,
            item.description,
            item.qty,
            item.uom,
            item.needHalal != null ? item.needHalal : "Yes",
            item.halalCertificate ?? "",
            item.halalED != null ? item.halalED : "",
            item.remarks ?? "",
            canEdit ? actionButtons : ''
        ];
    }));

    dataTable.draw();

    let jsonString = JSON.stringify(ingridientList);
    $('#Ingridients').val(jsonString);
}


function UpdateTableFlowProcess() {
    var statusEvaluationTrial = $('#StatusEvaluationTrial').val()
    var dataTable = $('#dataTableFlowProcess').DataTable();
    dataTable.clear();

    dataTable.rows.add(flowProcessList.map(item => [
        item.seq,
        item.flowProcess,
        item.description,
        item.parameterCheck || '',
        item.testType || '',
        item.uom || '',
        item.frequency || '',
        item.standardMin || '',
        item.standardTarget || '',
        item.standardMax || '',
        item.result || '',
        item.rowVersion || '',
        `<button id="editBtn" class="btn btn-sm btn-primary edit-btn-flow-process" type="button" data-bs-toggle="modal" data-bs-target="#addFlowProcessModal" data-index="${flowProcessList.indexOf(item)}">
            <i class="fas fa-edit"></i>
         </button>

         ${statusEvaluationTrial === "" || statusEvaluationTrial === "DRAFT" ?
                `<button id="btnDeleteFlowProcess" class="btn btn-sm btn-danger delete-btn" type="button" data-bs-toggle="modal" data-bs-target="#deleteSubmitRequestTrial" data-index="${flowProcessList.indexOf(item)}">
                <i class="fas fa-trash"></i>
             </button>`
                : ''}`
         
    ]));

    dataTable.draw();

    let jsonString = JSON.stringify(flowProcessList);
    $('#ProcessDetails').val(jsonString);
}

function UpdateTableAllFlowProcess() {
    var dataTable = $('#dataTableCopyFlowProcess').DataTable();
    dataTable.clear();

    dataTable.rows.add(flowProcessAllList.map((item, index) => [
        item.protocolNoHeader,
        item.protocolHeader,
        item.trialName,
        item.itemCode,
        item.formulaNo,
        item.formulaVers,
        `<button class="btn btn-outline-dark select-btn-flow-process-copy" type="button" data-index="${index}">
            SELECT
         </button>`
    ]));

    dataTable.draw();
}


function UpdateTableAllFG() {
    var dataTable = $('#dataTableCopyFG').DataTable();
    dataTable.clear();

    dataTable.rows.add(fgAllList.map((item, index) => [
        item.protocolNoHeader,
        item.protocolHeader,
        item.trialName,
        item.itemCode,
        item.formulaNo,
        item.formulaVers,
        `<button class="btn btn-outline-dark select-btn-fg-copy" type="button" data-index="${index}">
            SELECT
         </button>`
    ]));

    dataTable.draw();
}

function UpdateTableAttach() {
    debugger;
    var dataTable = $('#dataTableAttachment').DataTable();
    dataTable.clear();

    dataTable.rows.add(
        attachmentList
            .filter(item => item.isDeleted !== true) 
            .map((item, index) => [
                index + 1,
                item.documentType,
                item.remarks,
                item.fileName,
                `<button id="editBtn" class="btn btn-sm btn-primary edit-btn-attach" type="button" data-bs-toggle="modal" data-bs-target="#addAttachmentModal" data-index="${index}">
                <i class="fas fa-edit"></i>
                 </button>
                 <button id="btnDownloadAttachment" class="btn btn-sm btn-warning download-btn-attach" type="button" data-index="${index}">
                    <i class="fas fa-download"></i>
                 </button>
                 <button id="btnDeleteFlowProcess" class="btn btn-sm btn-danger delete-btn-attach" type="button" data-bs-toggle="modal" data-bs-target="#deleteSubmitRequestTrial" data-index="${index}">
                    <i class="fas fa-trash"></i>
                 </button>`
            ])
    );


    dataTable.draw();

    let jsonString = JSON.stringify(attachmentList);
    $('#Attachments').val(jsonString);
}

function UpdateTableSR() {
    var dataTable = $('#dataTableSampleRequirement').DataTable();
    dataTable.clear();

    dataTable.rows.add(srList.map((item, index) => [
        index + 1,
        item.sampleQty,
        item.uom,
        item.remarks,
        `<button id="editBtn" class="btn btn-sm btn-primary edit-btn-sr" type="button" data-bs-toggle="modal" data-bs-target="#addSampleRequirementModal" data-index="${index}">
            <i class="fas fa-edit"></i>
         </button>
         <button id="btnDeleteFlowProcess" class="btn btn-sm btn-danger delete-btn-sr" type="button" data-bs-toggle="modal" data-bs-target="#deleteSubmitRequestTrial" data-index="${index}">
            <i class="fas fa-trash"></i>
         </button>`
    ]));

    dataTable.draw();

    let jsonString = JSON.stringify(srList);
    $('#SampleRequirements').val(jsonString);
}

function GenerateIngridient() {
    var selectedFormula = $('#selectFormula').val();
    var protocolGuid = $('#ProtocolGuid').val();
    $.ajax({
        url: '/RequestTrial/GetIngridients',
        type: 'GET',
        data: {
            id: protocolGuid,
            formulaNo: selectedFormula
        },
        success: function (response) {
            ingridientList = [];
            $('#dataTableFormulaTrial tbody').empty();
            $.each(response, function (index, item) {
                ingridientList.push({
                    itemCode: item.itemCode,
                    description: item.description,
                    halalCertificate: item.halalCertificate,
                    halalED: item.halalED,
                    needHalal: item.needHalal,
                    remarks: item.remarks,
                    uom: item.uom,
                    qty: item.qty,
                    isReadOnly: item.halalCertificate && item.halalCertificate != "" ? true : false,
                });
            });
            UpdateTableFormulaTrial();
        },
        error: function (xhr, status, error) {
        }
    });
}

$('#btnRefreshHalal').on('click', function (e) {
    GenerateIngridient();
})

$(document).on('click', '#btnDownloadAttachment', function () {
    const index = $(this).data('index'); 
    const fileData = attachmentList[index]?.file;
    const fileName = attachmentList[index]?.fileName; 

    if (fileData) {
        $.ajax({
            url: `/RequestTrial/DownloadFile?fileName=${encodeURIComponent(fileData)}`,
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

$('#btnDownloadAll').on('click', function (e) {
    const fileUrls = attachmentList
        .filter(item => item.attachmentGuid && item.attachmentGuid !== "")
        .map(item => item.file);

    fileUrls.forEach(fileUrl => {
        e.preventDefault();

        $.ajax({
            url: `/RequestTrial/DownloadFile?fileName=${encodeURIComponent(fileUrl)}`,
            type: 'GET',
            xhrFields: {
                responseType: 'blob' 
            },
            success: function (blob) {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileUrl;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            },
            error: function () {
                showMessageError('Download is failed');
            }
        });
    });
})
function getActiveTab() {
    var activeTab = $('.nav-tabs .active').attr('href'); 
    return activeTab;
}

function scrollToElement(elementId) {
    document.getElementById(elementId).scrollIntoView({
        behavior: "smooth",  
        block: "center"      
    });
}

$('#confirmSubmitModalSubmit').on('click', function (e) {
    var guid = $('#ProtocolGuid').val();
    $.ajax({
        url: '/RequestTrial/UpdateStatusProtocol',
        type: 'POST',
        data: JSON.stringify({
            id: guid,
            status: statusDisposition,
        }),
        success: function (response) {
            showMessageSucces("Data has been saved");
        },
        error: function (error) {
            showMessageError(error);
        }
    });
});

$('#btnBack').on('click', function (e) {
    window.history.back();
});

$('#btnSaveProtocol').on('click', function (e) {
    let isValid = true;
    let isScrolled = false;
    var manuf = $('#selectManufacturer').val();
    var urt = $('#selectURT').val();
    var urtDesc = $('#UrtDescription').val();
    var statusEvaluationTrial = $('#StatusEvaluationTrial').val()
    //if (manuf === "SHP") {
    //    var activeTab = getActiveTab();

    //    if (!urt) {
    //        if (activeTab !== "#tab1") {
    //            $('#tab1-tab').tab('show');
    //        }
    //        $('#selectURTError').show();
    //        scrollToElement("selectURT");
    //        isValid = false;
    //    }

    //    if (!urtDesc) {
    //        if (!isScrolled) {
    //            if (activeTab !== "#tab1") {
    //                $('#tab1-tab').tab('show');
    //            }
    //            scrollToElement("UrtDescription");
    //        }
    //        $('#UrtDescriptionError').show();
    //        isValid = false;
    //    }
    //}

    //if (statusEvaluationTrial === "EVALUATION ON GOING") {
    //    var actualDate = $('#actualTrialDateFormula').val();
    //    if (!actualDate) {
    //        if (!isScrolled) {
    //            if (activeTab !== "#tab1") {
    //                $('#tab1-tab').tab('show');
    //            }
    //            scrollToElement("actualTrialDateFormula");
    //        }
    //        $('#actualTrialDateFormulaError').show();
    //        isValid = false;
    //    }
    //}

    if (isValid) {
        const formData = new FormData();

        let vmRequestProtocolDetailObj = { ...vmRequestProtocolDetail };

        if (vmRequestProtocolDetailObj.header.statusEvaluationTrial === "") {
            vmRequestProtocolDetailObj.header.statusEvaluationTrial = "DRAFT";
        }
        //tab formula trial
        var formulaTrial = {
            itemCode: $('#ProtocolItemCode').val(),
            formulaNo: $('#selectFormula').val(),
            formulaVers: $('#FormulaVers').val(),
            formulaDescription: $('#FormulaDescription').val(),
            urt: $('#selectURT').val(),
            urtDescription: $('#UrtDescription').val(),
            ingridients: $('#Ingridients').val(),
            note: $('#Note').val(),
            isEditing: $('#IsEditingFormulaTrial').val(),
            actualTrialDate: $('#actualTrialDateFormula').val(),
        };

        //tab flow process
        var flowProcess = {
            note: $('#FlowProcessNote').val(),
            process: $('#ProcessDetails').val(),
            isEditing: $('#IsEditingFlowProcess').val(),
            rowVersion: $('#RowVersionFlowProcess').val(),
        };

        //tab finished good
        var finishedGood = {
            itemCode: $('#selectItemCodeFG').val(),
            sampleNoOracles: $('#selectSampleOracleFG').val(),
            sampleNoSatrios: $('#selectSampleSatrioFG').val(),
            items: $('#FinishedGoods').val(),
            isEditing: $('#IsEditingFinishedGood').val(),
            note: $('#NoteFG').val(),
            rowVersion: $('#RowVersionFG').val(),
        };

        //tab sample requirement
        //var sampleRequirement = {
        //    items: $('#SampleRequirements').val(),
        //};

        ////tab attachment
        //var attachments = {
        //    items: $('#Attachments').val(),
        //};

        //tab summary
        var summary = {
            summary: $('#Summary').val(),
            recommendationNextStep: $('#SummaryRecommendation').val(),
            isEditing: $('#IsEditingSummary').val(),
        };

        formData.append('formulaTrial', JSON.stringify(formulaTrial));
        formData.append('flowProcess', JSON.stringify(flowProcess));
        formData.append('finishedGood', JSON.stringify(finishedGood));
        formData.append('sampleRequirement', $('#SampleRequirements').val());
        formData.append('attachments', $('#Attachments').val());
        formData.append('summary', JSON.stringify(summary));

        formData.append('vmRequestProtocolDetail', JSON.stringify(vmRequestProtocolDetailObj));

        attachmentList.filter(item => item.isUploadFile === true).forEach((item, index) => {
            formData.append('files', item.attachment);
            formData.append(`documentType_${index}`, item.documentType);
            formData.append(`remarks_${index}`, item.remarks);
            formData.append(`path_${index}`, item.file);
            formData.append(`guid_${index}`, item.attachmentGuid);
        });

        var isSampleNoEmpty = fgList.some(fgItem => !fgItem.sampleNo || fgItem.sampleNo.trim() === "");

        if (isSampleNoEmpty && sampleOracleList.length > 0) {
            GetResultFinishedGood();
        } 

        $.ajax({
            url: '/RequestTrial/CustomSave',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.success) {
                    showMessageSucces("Data has been saved");
                } else {
                    showMessageError(response.message);
                }
            },
            error: function (error) {
                showMessageError(error);
            }
        });
    }
});

$('#btnSaveProtocol2').on('click', function (e) {
    e.preventDefault();
    
    let isValid = true;
    let validationErrors = [];
    let errorMessage = "";

    $('#StatusEvaluationTrial').val("DRAFT");

    ingridientList.forEach(function (item, index) {
        let errors = validateIngridient(item);
        if (errors.length > 0) {
            isValid = false;
            errorMessage = errors.join(", ");
            validationErrors.push("Ingridient " + (index + 1) + " errors: " + errors.join(", "));
        }
    });

    if (ingridientList.length !== 0) {
        var jsonData = JSON.stringify(ingridientList);
        $('#Ingridients').val(jsonData);
    }

    $('#formProtocolEvaluation').submit();
});

function validateIngridient(item) {
    let errors = [];

    if (!item.itemCode) {
        errors.push("Item Code is required.");
    }
    if (!item.description) {
        errors.push("Description is required.");
    }
    if (item.needHalal === undefined || item.needHalal === null) {
        errors.push("Need Halal status is required.");
    }
    if (item.needHalal === true) {
        if (!item.halalCertificate) {
            errors.push("Halal Certificate is required when Need Halal is 'Yes'.");
        }
        if (!item.halalED) {
            errors.push("Halal Expiry Date (halalED) is required when Need Halal is 'Yes'.");
        }
    }
    if (!item.remarks) {
        errors.push("Remark is required.");
    }
    if (!item.uom) {
        errors.push("Unit of Measurement (UOM) is required.");
    }
    if (item.qty === undefined || item.qty === null) {
        errors.push("Quantity (qty) is required.");
    }

    return errors;
}

$('#saveIngridient').click(function () {
    const itemCode = $('#itemCodeModal').val();
    const description = $('#descriptionModal').val();
    const needHalal = $('#needHalalModal').val();
    const halalCertificate = $('#halalCertificateModal').val();
    const halalED = $('#halalEDModal').val();
    const remarks = $('#remarksModal').val();

    $('.text-danger-validation').hide();

    let isValid = true;

    if (!itemCode) {
        $('#itemCodeModalError').show();
        isValid = false;
    }

    if (!description) {
        $('#descriptionModalError').show();
        isValid = false;
    }

    if (!needHalal) {
        $('#needHalalModalError').show();
        isValid = false;
    }

    if (needHalal == "Yes") {
        if (!halalCertificate) {
            $('#halalCertificateModalError').show();
            isValid = false;
        }

        if (!halalED) {
            $('#halalEDModalError').show();
            isValid = false;
        }
    }



    if (!remarks) {
        $('#remarksModalError').show();
        isValid = false;
    }

    if (isValid) {
        let formattedDate = "";
        if (halalED) {
            var dateObj = new Date(halalED);

            var day = dateObj.getDate();
            var month = dateObj.toLocaleString('default', { month: 'short' });
            var year = dateObj.getFullYear();

            formattedDate = day + ' ' + month + ' ' + year;
        }

        $('#dataTableFormulaTrial tbody').empty();
        ingridientList[indexModal] = {
            itemCode: itemCode,
            description: description,
            halalCertificate: halalCertificate,
            halalED: formattedDate,
            needHalal: needHalal,
            remarks: remarks,
            uom: ingridientList[indexModal].uom,
            qty: ingridientList[indexModal].qty
        };

        UpdateTableFormulaTrial();

        $('#formulaTrialModal').modal('hide');
    }
});


$('#btnCopyFlowProcess').click(function () {
    $.ajax({
        url: '/RequestTrial/GetAllFlowProcessDetail',
        type: 'GET',
        success: function (response) {
            flowProcessAllList = [];
            $('#dataTableCopyFlowProcess tbody').empty();

            $.each(response, function (index, item) {
                var flowProcessData = {
                    protocolNoHeader: item.protocolNoHeader,
                    protocolHeader: item.protocolHeader,
                    trialName: item.trialName,
                    itemCode: item.itemCode,
                    formulaNo: item.formulaNo,
                    formulaVers: item.formulaVers,
                    processDetails: []
                };

                $.each(item.processDetails, function (detailIndex, detail) {
                    flowProcessData.processDetails.push({
                        seq: detail.seq,
                        flowProcess: detail.flowProcess,
                        description: detail.description,
                        parameterCheck: detail.parameterCheck,
                        uom: detail.uom,
                        testType: detail.testType,
                        frequency: detail.frequency,
                        standardMin: detail.standardMin,
                        standardTarget: detail.standardTarget,
                        standardMax: detail.standardMax,
                        result: detail.result,
                        remarks: detail.remarks
                    });
                });

                flowProcessAllList.push(flowProcessData);
            });

            UpdateTableAllFlowProcess();
        },
        error: function (xhr, status, error) {
        }
    });
})


$('#btnCopyFG').click(function () {
    $.ajax({
        url: '/RequestTrial/GetAllFinishedGoodDetail',
        type: 'GET',
        success: function (response) {
            fgAllList = [];
            $('#dataTableCopyFG tbody').empty();

            $.each(response, function (index, item) {
                var fgData = {
                    protocolNoHeader: item.protocolNoHeader,
                    protocolHeader: item.protocolHeader,
                    trialName: item.trialName,
                    itemCode: item.itemCode,
                    formulaNo: item.formulaNo,
                    formulaVers: item.formulaVers,
                    finishedGoodDetails: []
                };

                $.each(item.finishedGoodDetails, function (detailIndex, data) {
                    fgData.finishedGoodDetails.push({
                        seq: data.seq,
                        flowProcess: data.flowProcess,
                        description: data.description,
                        parameterCheck: data.parameterCheck,
                        uom: data.uom,
                        testType: data.testType,
                        standardMin: data.standardMin,
                        standardTarget: data.standardTarget,
                        standardMax: data.standardMax,
                        sampleNo: data.sampleNo,
                        result: data.result,
                        remarks: data.remarks,
                        isVoid: data.isVoid,
                        isResultOracle: data.isResultOracle,
                        rowVersion: data.rowVersion,
                    });
                });

                fgAllList.push(fgData);
            });

            UpdateTableAllFG();
        },
        error: function (xhr, status, error) {
        }
    });
})

$('#btnAddFlowProcess').click(function () {
    modalStateFlowProcess = "add";
    indexModalFlowProcess = 99;
    let defaultValue = (flowProcessList.length + 1) * 10;
    $('#stdResultSelect').hide();
    $('#resultFlowModal').show();
    $('#resultFlowModal').prop("readonly", true).css('background-color', '#f0f0f0');
    $('#remarksFlowModal').prop("readonly", true).css('background-color', '#f0f0f0');
    $('#seqFlowModal').val(defaultValue);
    $('#seqFlowModal').on('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
})

$('#saveFlowProcess').click(function () {
    var seq = $('#seqFlowModal').val();
    var flowProcess = $('#selectFlowFlowModal').val();
    var description = $('#descriptionFlowModal').val();
    var parameterCheck = $('#parameterFlowModal').val();
    var uom = $('#uomFlowModal').val();
    var testType = $('#testTypeFlowModal').val();
    var frequency = $('#frequencyFlowModal').val();
    var standardMin = null;
    var standardTarget = null;
    var standardMax = null;
    var result = null;
    var rowVersion = $('#RowVersionFlowProcess').val();;
    var remarks = $('#remarksFlowModal').val();

    $('.text-danger-validation').hide();

    let isValid = true;

    if (!seq) {
        $('#seqFlowModalError').show();
        isValid = false;
    }

    //if (seq) {
    //    const value = parseInt(seq);
    //    if (value % 10 === 0 || isNaN(value)) {
    //        $("#seqFlowModalError").hide();
    //    } else {
    //        $("#seqFlowModalError").show().text("Input must be a multiple of 10");
    //    }
    //}


    if (!flowProcess) {
        $('#selectFlowFlowModalError').show();
        isValid = false;
    }

    if (!description) {
        $('#descriptionFlowModalError').show();
        isValid = false;
    }
    debugger;
    if (isValid) {
        if (testType === 'N') {
            standardMin = $('#standardMinFlowModal').val();
            standardMax = $('#standardMaxFlowModal').val();
            standardTarget = $('#standardTargetFlowModal').val();
            result = $('#resultFlowModal').val(); 
        } else if (testType === 'V') {
            standardMin = null;
            standardMax = null;
            standardTarget = $('#standardTargetSelectFlowModal').val();
            result = $('#resultSelectFlowModal').val();
        } else {
            standardMin = $('#standardMinSelectFlowModal').val();
            standardMax = $('#standardMaxSelectFlowModal').val();
            standardTarget = $('#standardTargetSelectFlowModal').val();
            result = $('#resultSelectFlowModal').val();
        }

        var flowProcessData = {
            seq: seq,
            flowProcess: flowProcess,
            description: description,
            parameterCheck: parameterCheck,
            uom: uom,
            testType: testType,
            frequency: frequency,
            standardMin: standardMin,
            standardTarget: standardTarget,
            standardMax: standardMax,
            result: result,
            remarks: remarks,
            rowVersion: rowVersion
        };

        if (modalStateFlowProcess === 'edit') {
            flowProcessList[indexEdit] = {
                seq: seq,
                flowProcess: flowProcess,
                description: description,
                parameterCheck: parameterCheck,
                uom: uom,
                testType: testType,
                frequency: frequency,
                standardMin: standardMin,
                standardTarget: standardTarget,
                standardMax: standardMax,
                result: result,
                remarks: remarks,
                rowVersion: rowVersion,
            };
        } else {
            flowProcessList.push(flowProcessData);
        }
        UpdateTableFlowProcess();
        clearFlowProcessInputs();
        $('#addFlowProcessModal').modal('hide');
    }
});

function clearFlowProcessInputs() {
    $('#stdMaxSelect').hide();
    $('#stdMinSelect').hide();
    $('#standardMinFlowModal').show();
    $('#standardMaxFlowModal').show();

    $('#standardMinFlowModal').val('');
    $('#standardMaxFlowModal').val('');

    $("#standardMinFlowModal, #standardMaxFlowModal").attr("readonly", true).css('background-color', '#f0f0f0');
    $("#standardTargetSelectFlowModal").prop("disabled", true).css('background-color', '#ffffff');

    //$('#seqFlowModal').val('');
    $('#selectFlowFlowModal').val('').trigger('change');
    $('#descriptionFlowModal').val('');
    $('#parameterFlowModal').val('').trigger('change');
    $('#uomFlowModal').val('');
    $('#testTypeFlowModal').val('');
    $('#frequencyFlowModal').val('');
    $('#standardMinFlowModal').val('');
    $('#standardTargetSelectFlowModal').val('');
    $('#standardMaxFlowModal').val('');
    $('#resultFlowModal').val('');
    $('#remarksFlowModal').val('');

    $('#seqFlowModalError').hide();
    $('#selectFlowFlowModalError').hide();
    $('#descriptionFlowModalError').hide();

    indexEdit = 99;
}

$(document).on('click', '.delete-btn-attach', function () {
    deleteState = "Attachment";
    indexDelete = $(this).data('index');
})

$(document).on('click', '.delete-btn', function () {
    deleteState = "FlowProcess";
    indexDelete = $(this).data('index');
})


$(document).on('click', '.delete-btn-sr', function () {
    deleteState = "SR";
    indexDelete = $(this).data('index');
})



$('#confirmRequestTrialDelete').click(function () {
    debugger;
    if (deleteState === "FlowProcess") {
        flowProcessList.splice(indexDelete, 1);
        UpdateTableFlowProcess();
    }
    if (deleteState === "SR") {
        srList.splice(indexDelete, 1);
        UpdateTableSR();
    }

    if (deleteState === "FG") {
        fgList.splice(indexDelete, 1);
        UpdateTableFG();
    }

    if (deleteState === "Attachment") {
        attachmentList[indexDelete].isDeleted = true;

        UpdateTableAttach();
    }

    indexDelete = 99;
    $('#deleteSubmitRequestTrial').modal('hide');
})

$(document).on('click', '.select-btn-flow-process-copy', function () {
    var index = $(this).data('index');
    if (flowProcessAllList[index]) {
        flowProcessList = flowProcessAllList[index].processDetails; 

        UpdateTableFlowProcess();
        $('#copyFlowProcessModal').modal('hide');
    }
});


$(document).on('click', '.select-btn-fg-copy', function () {
    var index = $(this).data('index');
    if (fgAllList[index]) {
        fgList = fgAllList[index].finishedGoodDetails;

        UpdateTableFG();
        $('#copyFGModal').modal('hide');
    }
});


$('#btnAddSampleRequirement').click(function () {
    modalStateSR = "add";
})

$('#saveAttach').click(function () {
    debugger;
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
                fileName: !attachment ? attachmentList[indexModal].file : attachment.name,
                file: !attachment ? attachmentList[indexModal].file : attachment.name,
                attachment: attachment,
                isUploadFile: true,
            });
        } else {
            attachmentList[indexModal] = {
                attachmentGuid: attachmentList[indexModal].attachmentGuid,
                documentType: documentType,
                remarks: remarks,
                fileName: !attachment ? attachmentList[indexModal].file : attachment.name,
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

$('#saveSR').click(function () {
    var uom = $('#selectUomSRModal').val();
    var remarks = $('#remarksSRModal').val();
    var qty = $('#sampleQtySRModal').val();
    var parameterCheck = $('#parameterFlowModal').val();
    $('.text-danger-validation').hide();

    let isValid = true;

    if (!uom) {
        $('#selectUomSRModalError').show();
        isValid = false;
    }

    if (!remarks) {
        $('#remarksSRModalError').show();
        isValid = false;
    }

    if (!qty) {
        $('#sampleQtySRModalError').show();
        isValid = false;
    }

    if (isValid) {
        if (modalStateSR === "add") {
            srList.push({
                uom: uom,
                remarks: remarks,
                sampleQty: qty,
            });
        } else {
            srList[indexModalSR] = {
                uom: uom,
                remarks: remarks,
                sampleQty: qty,
            }
        }

        UpdateTableSR();
        $('#addSampleRequirementModal').modal('hide');

        ClearSR();
    }
})

function ClearAttach() {
    $('#documentTypeAttachModal').val('').trigger('change');
    $('#remarksAttachModal').val('');
    $('#fileAttachModal').val('');

    modalStateAttach = "add";
    indexModal = 99;
}

function ClearSR() {
    $('#sampleQtySRModal').val('');
    $('#remarksSRModal').val('');
    $('#uomSRModal').val('').trigger('change');

    modalStateSR = "add";
    indexModalSR = 99;
}

$(document).on('click', '.edit-btn-attach', function () {
    $('#oldFileAttachModal').show();
    modalStateAttach = "edit";
    indexModal = $(this).data('index');

    const data = attachmentList[indexModal];

    $('#documentTypeAttachModal').val(data.documentType).trigger('change');
    $('#remarksAttachModal').val(data.remarks);

    $('#fileNameAttachModal').val(data.file);
})


$(document).on('click', '.edit-btn-sr', function () {
    modalStateSR = "edit";
    indexModalSR = $(this).data('index');

    const data = srList[indexModalSR];

    $('#sampleQtySRModal').val(data.sampleQty);
    $('#remarksSRModal').val(data.remarks);
    $('#uomSRModal').val(data.uom).trigger('change');
})


$('#parameterFlowModal').on('change', function () {
    var selectedTestCode = $(this).val();
    selectedItemParamCheck = parameterCheckList.find(function (item) {
        return item.testCode === selectedTestCode;
    });

    if (selectedItemParamCheck) {
        $('#uomFlowModal').val(selectedItemParamCheck.testUnit);
        $('#testTypeFlowModal').val(selectedItemParamCheck.testType);

        updateStandardFields(selectedItemParamCheck.testType);
    }
});

function showMessageSucces(msgSuccess) {
    //var guid = $('#ProtocolGuid').val();
    //var txtUrl = `${base_path}/RequestTrial/Protocol?param=${guid}`;
    clsGlobal.swalSuccessWithoutAction(msgSuccess);
}

function showMessageError(msgError) {
    clsGlobal.swalError(msgError);
}


//BATAS FG

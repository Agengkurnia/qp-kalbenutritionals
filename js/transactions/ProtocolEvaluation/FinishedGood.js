

$(document).on('click', '.delete-btn-fg', function () {
    deleteState = "FG";
    indexDelete = $(this).data('index');
})

$('#selectItemCodeFG').on('change', function () {
    var selectedValue = $(this).val();
    if (selectedValue) {
        var splitValues = selectedValue.split('||');

        var part1 = splitValues[0];
        var part2 = splitValues[1];
        var selectedText = $(this).find('option:selected').text();
        if (fgList.length === 0) {

            UpdateDataDetailFG(part1, part2);
        }
    }
});

function UpdateDataDetailFG(itemNumber, specVers) {

    if (fgList.length === 0) {
        $.ajax({
            url: '/RequestTrial/GetAllTemplateDetail',
            type: 'GET',
            data: {
                itemNumber: itemNumber,
                specVers: specVers,
            },
            success: function (response) {
                fgList = fgList.filter(item => item.isNew === true);


                $.each(response, function (index, data) {
                    fgList.push({
                        specId: data.specId,
                        seq: data.seq,
                        parameterCheck: data.testCode,
                        uom: data.testUnit,
                        testType: data.testType,
                        standardMin: data.minValueNum,
                        standardTarget: data.targetValueNum ? data.targetValueNum : data.targetValueChar,
                        standardMax: data.maxValueNum,
                        sampleNo: data.sampleNo,
                        result: data.result,
                        remarks: data.remarks,
                        isVoid: data.isVoid ?? false,
                        isResultOracle: data.isResultOracle,
                    });
                });
                UpdateTableFG();
            },
            error: function (xhr, status, error) {
                showMessageError(error);
            },
            complete: function () {
                //GetResultFinishedGood();
            }
        });
    }
}


$('#btnAddFG').click(function () {
    modalStateFG = "add";
    indexModalFG = 99;
    let defaultValue = (fgList.length + 1) * 10;
    $('#seqFGModal').val(defaultValue);
    $('#seqFGModal').on('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
});

$('#btnUpdateFG').click(function () {
    debugger;
    var templateCode = $('#selectItemCodeFG').val();
    if (templateCode) {

        var splitValues = templateCode.split('||');

        var part1 = splitValues[0];
        var part2 = splitValues[1];
        //fgList = [];
        UpdateDataDetailFG(part1, part2);
        GetResultFinishedGood();
    } else {
        clsGlobal.swalError("Please select template code first");
    }
});


$('#parameterFGModal').on('change', function () {
    var selectedTestCode = $(this).val();
    selectedItemParamCheckFG = parameterCheckFGList.find(function (item) {
        return item.testCode === selectedTestCode;
    });

    if (selectedItemParamCheckFG) {
        $('#uomFGModal').val(selectedItemParamCheckFG.testUnit);
        $('#testTypeFGModal').val(selectedItemParamCheckFG.testType);

        updateStandardFieldsFG(selectedItemParamCheckFG.testType);
    }
});


$('#saveFG').click(function () {
    debugger;
    var seq = $('#seqFGModal').val();
    var parameterCheck = $('#parameterFGModal').val();
    var uom = $('#uomFGModal').val();
    var testType = $('#testTypeFGModal').val();
    var standardMin = null;
    var standardTarget = null;
    var standardMax = null;
    var sampleNo = $('#sampleNoFGModal').val();
    var result = $('#resultFGModal').val();
    var remarks = $('#remarksFGModal').val();

    $('.text-danger-validation').hide();

    let isValid = true;

    if (!seq) {
        $('#seqFGModalError').show();
        isValid = false;
    }

    if (seq) {
        const value = parseInt(seq);
        if (value % 10 === 0 || isNaN(value)) {
            $("#seqFGModalError").hide();
        } else {
            $("#seqFGModalError").show().text("Input must be a multiple of 10");
        }
    }

    if (isValid) {
        if (testType === 'N') {
            standardMin = $('#standardMinFGModal').val();
            standardMax = $('#standardMaxFGModal').val();
            standardTarget = $('#standardTargetFGModal').val();
        } else if (testType === 'V') {
            standardMin = null;
            standardMax = null;
            standardTarget = $('#standardTargetSelectFGModal').val();
        } else {
            standardMin = $('#standardMinSelectFGModal').val();
            standardMax = $('#standardMaxSelectFGModal').val();
            standardTarget = $('#standardTargetSelectFGModal').val();
        }

        var fgData = {
            seq: seq,
            parameterCheck: parameterCheck,
            uom: uom,
            testType: testType,
            standardMin: standardMin,
            standardTarget: standardTarget,
            standardMax: standardMax,
            sampleNo: sampleNo,
            result: result,
            remarks: remarks,
            isNew: true,
        };

        if (modalStateFG === 'edit') {
            fgList[indexEdit] = fgData;
        } else {
            fgList.push(fgData);
        }

        UpdateTableFG();
        clearFGInputs();
        $('#addFGModal').modal('hide');
    }
});


function OnInitFinishedGood() {
    $('#IsEditingFinishedGood').val('true');
    $('#stdMaxSelectFG').hide();
    $('#stdMinSelectFG').hide();
    $('#stdResultFGSelect').hide();
    $('#stdTargetSelectFG').hide();


    if (sampleOracleList.length === 0) {
        $.ajax({
            url: '/RequestTrial/GetAllSampleNoOracle',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                $('#selectSampleOracleFG').empty();

                for (let i = 0; i < data.length; i++) {
                    const item = data[i];
                    $('#selectSampleOracleFG').append('<option value="' + item.sampleNo + '">' + item.sampleNo + '</option>');

                    sampleOracleList.push({
                        sampleNo: item.sampleNo,
                        sampleDesc: item.sampleDesc,
                    });
                }
            },
            error: function (xhr, status, error) {
                console.error('Error fetching data:', error);
            },
            complete: function () {
                var defaultValue = $('#SampleNoOracle').val();
                var listValue = defaultValue.split(',').map(function (item) {
                    return item.trim();
                });
                $('#selectSampleOracleFG').val(listValue).trigger('change');

                var statusEvaluationTrial = $('#StatusEvaluationTrial').val()
                if (isReadOnlyProtocol === "true" || statusEvaluationTrial !== "EVALUATION ON GOING") {
                    $('#selectSampleOracleFG').prop('disabled', true);
                } else {
                    $('#selectSampleOracleFG').prop('disabled', false);
                }
            }
        });
    }


    if (sampleSatrioList.length === 0) {

        $.ajax({
            url: '/RequestTrial/GetAllSampleNoSatrio',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                $('#selectSampleSatrioFG').empty();

                let index = 0;
                const batchSize = 100;
                const delay = 500;

                function insertBatch() {
                    for (let i = 0; i < batchSize && index < data.length; i++, index++) {
                        const item = data[index];
                        $('#selectSampleSatrioFG').append('<option value="' + item.requestNo + '">' + item.requestNo + '</option>');

                        sampleSatrioList.push({
                            requestNo: item.requestNo,
                            sampleName: item.sampleName,
                        });
                    }

                    if (index < data.length) {
                        setTimeout(insertBatch, delay);
                    } else {
                    }
                }

                insertBatch();
            },
            error: function (xhr, status, error) {
                console.error('Error fetching data:', error);
            },
            complete: function () {
                var defaultValue = $('#SampleNoSatrio').val();
                var listValue = defaultValue.split(',').map(function (item) {
                    return item.trim();
                });
                $('#selectSampleSatrioFG').val(listValue).trigger('change');

                var statusEvaluationTrial = $('#StatusEvaluationTrial').val()
                if (isReadOnlyProtocol === "true" || statusEvaluationTrial !== "EVALUATION ON GOING") {
                    $('#selectSampleSatrioFG').prop('disabled', true);
                } else {
                    $('#selectSampleSatrioFG').prop('disabled', false);
                }
            }
        });
    }

    if (templateList.length === 0) {
        $.ajax({
            url: '/RequestTrial/GetAllTemplate',
            type: 'GET',
            success: function (data) {
                $('#selectItemCodeFG').empty();
                $('#selectItemCodeFG').append('<option value="" disabled selected>Select Template</option>');
                $.each(data, function (index, item) {
                    $('#selectItemCodeFG').append('<option value="' + item.itemNumber + '||' + item.specVers + '">' + item.itemNumber + ' || Vers ' + item.specVers + '</option>');

                    templateList.push({
                        specName: item.specName,
                        specDesc: item.specDesc,
                        itemNumber: item.itemNumber,
                        specVers: item.specVers,
                    });
                });

            },
            error: function (xhr, status, error) {
            },
            complete: function () {
                var defaultValue = $('#ItemCodeFG').val();
                var statusEvaluationTrial = $('#StatusEvaluationTrial').val()
                $('#selectItemCodeFG').val(defaultValue).trigger('change');
                if (isReadOnlyProtocol === "true" || statusEvaluationTrial == "PROTOCOL ON GOING APPROVAL" || statusEvaluationTrial == "EVALUATION ON GOING APPROVAL") {
                    $('#selectItemCodeFG').prop('disabled', true);
                } else {
                    $('#selectItemCodeFG').prop('disabled', false);
                }
            }
        });
    }

    if (parameterCheckFGList.length === 0) {
        $.ajax({
            url: '/RequestTrial/GetParameterCheck',
            type: 'GET',
            success: function (data) {
                $('#parameterFGModal').empty();
                $('#parameterFGModal').append('<option value="" disabled selected>Select Parameter</option>');

                $.each(data, function (index, item) {
                    var unit = item.testUnit == null ? "" : " || " + item.testUnit;
                    $('#parameterFGModal').append('<option value="' + item.testCode + '">' + item.testCode + unit + '</option>');

                    parameterCheckFGList.push({
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
                $('#parameterFGModal').prop('disabled', false).trigger('change');
            },
            complete: function () {
            },
            error: function (xhr, status, error) {
            }
        });
    }


    if (fgList.length === 0) {
        var protocolGuid = $('#ProtocolGuid').val();
        $.ajax({
            url: '/RequestTrial/GetFinishedGoodDetails',
            type: 'GET',
            data: {
                id: protocolGuid,
            },
            success: function (response) {
                fgList = fgList.filter(item => item.isNew === true);
                $('#dataTableFinishedGood tbody').empty();
                $.each(response, function (index, data) {
                    fgList.push({
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
                UpdateTableFG();
            },
            complete: function () {
            },
            error: function (xhr, status, error) {
            }
        });
    }
}


function UpdateTableFG() {
    var statusEvaluationTrial = $('#StatusEvaluationTrial').val()
    var dataTable = $('#dataTableFinishedGood').DataTable();
    dataTable.clear();

    var status = $('#StatusEvaluationTrial').val();
    var isActive = status === "" || status === "DRAFT" || status === "PROTOCOL REVISED" ||
        status === "EVALUATION REVISED" || status === "EVALUATION ON GOING";
    dataTable.rows.add(fgList.map(item => [
        item.seq,
        item.parameterCheck || '',
        item.testType || '',
        item.uom || '',
        item.standardMin || '',
        item.standardTarget || '',
        item.standardMax || '',
        item.sampleNo || '',
        item.result || '',
        item.remarks || '',
        `<label class="switch">
                <input type="checkbox" 
                       ${item.isVoid ? "checked" : ""}
                       ${isActive ? "" : "disabled"}
                       onchange="handleSwitchChange('${item.parameterCheck}||${item.uom}||${item.standardMin}||${item.standardTarget}||${item.standardMax}||${item.sampleNo}||${item.result}', this)">
                <span class="slider round"></span>
            </label>`,
        `<button id="editBtn" class="btn btn-sm btn-primary edit-btn-fg" type="button" data-bs-toggle="modal" data-bs-target="#addFGModal" data-index="${fgList.indexOf(item)}">
        <i class="fas fa-edit"></i>
         </button>
         ${statusEvaluationTrial === "" || statusEvaluationTrial === "DRAFT" ?
            `<button id="btnDeleteFG" class="btn btn-sm btn-danger delete-btn-fg" type="button" data-bs-toggle="modal" data-bs-target="#deleteSubmitRequestTrial" data-index="${fgList.indexOf(item)}">
            <i class="fas fa-trash"></i>
         </button>`
            : ''}`
    ]));

    dataTable.draw();

    let jsonString = JSON.stringify(fgList);
    $('#FinishedGoods').val(jsonString);
}


function handleSwitchChange(data, checkbox) {
    var parts = data.split("||");

    var matchedItems = fgList.filter(fgItem =>
        fgItem.parameterCheck == parts[0] &&
        fgItem.uom == parts[1] &&
        (fgItem.standardMin == null || fgItem.standardMin == parts[2]) &&
        (fgItem.standardTarget == null || fgItem.standardTarget == parts[3]) &&
        (fgItem.standardMax == null || fgItem.standardMax == parts[4]) &&
        fgItem.sampleNo == parts[5] &&
        fgItem.result == parts[6]
    );


    const index = fgList.findIndex(fgItem =>
        fgItem.parameterCheck == parts[0] &&
        fgItem.uom == parts[1] &&
        (fgItem.standardMin == null || fgItem.standardMin == parts[2]) &&
        (fgItem.standardTarget == null || fgItem.standardTarget == parts[3]) &&
        (fgItem.standardMax == null || fgItem.standardMax == parts[4]) &&
        fgItem.sampleNo == parts[5] &&
        fgItem.result == parts[6]
    );

    if (index !== -1) {
        const data = fgList[index];

        if (data.isVoid && !checkbox.checked) {
            Swal.fire({
                title: 'Are you sure?',
                text: "Changing this will disable this item ?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, disable it!',
                cancelButtonText: 'No, keep it enabled',
            }).then((result) => {
                if (result.isConfirmed) {
                    fgList[index].isVoid = checkbox.checked;
                } else {
                    fgList[index].included = true;
                    checkbox.checked = true;
                }

                let jsonString = JSON.stringify(fgList);
                $('#FinishedGoods').val(jsonString);
            });
        } else {
            fgList[index].isVoid = checkbox.checked;
            let jsonString = JSON.stringify(fgList);
            $('#FinishedGoods').val(jsonString);
        }
    }
}


function clearFGInputs() {
    $('#stdMaxSelectFG').hide();
    $('#stdMinSelectFG').hide();
    $('#stdTargetSelectFG').hide();

    $('#standardMinFGModal').show();
    $('#standardMaxFGwModal').show();
    $('#standardTargetFGModal').show();

    $('#standardMinFGModal').val('');
    $('#standardMaxFGModal').val('');
    $('#standardTargetFGModal').val('');

    $("#standardMinFGModal, #standardMaxFGModal, #standardTargetFGModal").attr("readonly", true).css('background-color', '#f0f0f0');
    //$("#standardTargetSelectFGModal").prop("disabled", true).css('background-color', '#ffffff');

    $('#descriptionFGModal').val('');
    $('#parameterFGModal').val('').trigger('change');
    $('#uomFGModal').val('');
    $('#testTypeFGModal').val('');
    $('#frequencyFGModal').val('');
    $('#standardMinFGModal').val('');
    $('#standardTargetSelectFGModal').val('');
    $('#standardMaxFGModal').val('');
    $('#resultFGModal').val('');
    $('#remarksFGModal').val('');
    $('#sampleNoFGModal').val('');

    $('#seqFGModalError').hide();
    $('#selectFGFlowModalError').hide();
    $('#descriptionFGModalError').hide();

    $("#descriptionFGModal").prop('readonly', false).css('background-color', '#FFFFFF');
    $("#uomFGModal").prop('readonly', false).css('background-color', '#FFFFFF');
    $("#testTypeFGModal").prop('readonly', false).css('background-color', '#FFFFFF');
    $("#frequencyFGModal").prop('readonly', false).css('background-color', '#FFFFFF');
    $("#standardMinFGModal").prop('readonly', false).css('background-color', '#FFFFFF');
    $("#standardMaxFGModal").prop('readonly', false).css('background-color', '#FFFFFF');
    $("#remarksFGModal").prop('readonly', false).css('background-color', '#FFFFFF');

    $("#standardMinFGModal").prop('disabled', false).css('background-color', '#FFFFFF');
    $("#standardMaxFGwModal").prop('disabled', false).css('background-color', '#FFFFFF');
    $("#standardTargetFGModal").prop('disabled', false).css('background-color', '#FFFFFF');
    $("#parameterFGModal").prop('disabled', false).css('background-color', '#FFFFFF');
    $("#standardTargetSelectFGModal").prop('disabled', false).css('background-color', '#FFFFFF');

    indexEdit = 99;
}

function GetStandardLOVFG(code) {
    $.ajax({
        url: '/RequestTrial/GetStandardOracles',
        type: 'GET',
        data: {
            code: code,
        },
        success: function (data) {
            $('#standardTargetSelectFGModal').empty();
            $('#standardMaxSelectFGModal').empty();
            $('#standardMinSelectFGModal').empty();
            $('#standardTargetSelectFGModal').append('<option value="" disabled selected>Select Target</option>');
            $('#standardMinSelectFGModal').append('<option value="" disabled selected>Select Standard Min</option>');
            $('#standardMaxSelectFGModal').append('<option value="" disabled selected>Select Standard Max</option>');

            //$.each(data, function (index, item) {
            //    $('#standardTargetSelectFGModal').append('<option value="' + item.valueChar + '">' + item.valueChar + '</option>');

            //    $('#standardMinSelectFGModal').append('<option value="' + item.minValueNum + '">' + item.valueChar + " || " + item.minValueNum + '</option>');
            //    $('#standardMaxSelectFGModal').append('<option value="' + item.maxValueNum + '">' + item.valueChar + " || " + item.maxValueNum + '</option>');
            //});

            $.each(data, function (index, item) {
                if ($('#resultSelectFGModal option[value="' + item.valueChar + '"]').length === 0) {
                    $('#resultSelectFGModal').append('<option value="' + item.valueChar + '">' + item.valueChar + '</option>');
                }

                if ($('#standardTargetSelectFGModal option[value="' + item.valueChar + '"]').length === 0) {
                    $('#standardTargetSelectFGModal').append('<option value="' + item.valueChar + '">' + item.valueChar + '</option>');
                }

                if ($('#standardMinSelectFGModal option[value="' + item.minValueNum + '"]').length === 0) {
                    $('#standardMinSelectFGModal').append('<option value="' + item.minValueNum + '">' + item.minValueNum + '</option>');
                }

                if ($('#standardMaxSelectFGModal option[value="' + item.maxValueNum + '"]').length === 0) {
                    $('#standardMaxSelectFGModal').append('<option value="' + item.maxValueNum + '">' + item.maxValueNum + '</option>');
                }
            });


            $('#standardTargetSelectFGModal').prop('disabled', false).trigger('change');
        },
        error: function (xhr, status, error) {
        }
    });
}


function updateStandardFieldsFG(testType) {
    if (testType === "V") {

        $('#stdMaxSelectFG').hide();
        $('#stdMinSelectFG').hide();
        $('#stdTargetSelectFG').show();

        $('#standardMinFGModal').show();
        $('#standardMaxFGModal').show();
        $('#standardTargetFGModal').hide();

        $("#standardMinFGModal, #standardMaxFGModal, #standardTargetFGModal").attr("readonly", true).css('background-color', '#f0f0f0');

        $("#standardTargetSelectFGModal").prop('disabled', false).css('background-color', '#FFFFFF');

        GetStandardLOVFG(selectedItemParamCheckFG.testCode);
    } else if (testType === "N") {
        $('#stdMaxSelectFG').hide();
        $('#stdMinSelectFG').hide();
        $('#stdTargetSelectFG').hide();

        $('#standardMinFGModal').show();
        $('#standardMaxFGModal').show();
        $('#standardTargetFGModal').show();

        $('#standardMinFGModal').val('');
        $('#standardMaxFGModal').val('');
        $('#standardTargetFGModal').val('');

        $("#standardMinFGModal").on("input", function () {
            let value = $(this).val();
            const errorMessageElement = $("#standardMinFGModalError");

            errorMessageElement.hide();

            if (!/^-?\d*\.?\d*$/.test(value)) {
                $(this).val(value.slice(0, -1));
            } else if (parseFloat(value) < selectedItemParamCheckFG.minValueNum) {
                errorMessageElement.text(`Value cannot be less than ${selectedItemParamCheckFG.minValueNum}`).show();
            }
        });


        $("#standardMaxFGModal").on("input", function () {
            let value = $(this).val();
            const errorMessageElement = $("#standardMaxFGModalError");

            errorMessageElement.hide();

            if (!/^-?\d*\.?\d*$/.test(value)) {
                $(this).val(value.slice(0, -1));
            } else if (parseFloat(value) > selectedItemParamCheckFG.maxValueNum) {
                errorMessageElement.text(`Value cannot be greater than ${selectedItemParamCheckFG.maxValueNum}`).show();
            }
        });

        $("#standardTargetFGModal").on("input", function () {
            let value = $(this).val();
            const errorMessageElement = $("#standardTargetFGModalError");

            errorMessageElement.hide();

            if (!/^-?\d*\.?\d*$/.test(value)) {
                $(this).val(value.slice(0, -1));
            } else if (parseFloat(value) < selectedItemParamCheckFG.minValueNum || parseFloat(value) > selectedItemParamCheckFG.maxValueNum) {
                errorMessageElement
                    .text(`Value must be between ${selectedItemParamCheckFG.minValueNum} and ${selectedItemParamCheckFG.maxValueNum}`)
                    .show();
            }
        });

        $("#standardMinFGModal, #standardMaxFGModal, #standardTargetFGModal").attr("readonly", false).css('background-color', '#ffffff');
        $("#standardTargetSelectFGModal").prop("disabled", true).css('background-color', '#ffffff');

    } else if (testType === "T") {
        $("#standardTargetSelectFGModal").prop('disabled', false).css('background-color', '#FFFFFF');

        GetStandardLOVFG(selectedItemParamCheckFG.testCode);

        $('#stdMaxSelectFG').hide();
        $('#stdMinSelectFG').hide();
        $('#stdTargetSelectFG').hide();

        $('#standardMinFGModal').show();
        $('#standardMaxFGModal').show();
        $('#standardTargetFGModal').show();
    }
}

$('#selectSampleOracleFG').on('change', function () {
    var selectedValues = $(this).val();
    listSampleNo = selectedValues;

    //if (fgList.length === 0) {
    //    GetResultFinishedGood();
    //}
});

function GetResultFinishedGood() {
    $.ajax({
        url: '/RequestTrial/GetResultFinishedGood',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            finishedGoods: JSON.stringify(fgList),
            samples: JSON.stringify(listSampleNo),
        }),
        success: function (response) {
            fgList = fgList.filter(item => item.isNew === true);
            $.each(response, function (index, data) {
                fgList.push({
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
                    isVoid: data.isVoid ?? false,
                    isResultOracle: data.isResultOracle ?? false,
                    rowVersion: data.rowVersion,
                });
            });
        },
        error: function (xhr, status, error) {
        },
        complete: function () {
            fgList = fgList.filter((item, index, self) => {
                const duplicates = self.filter(other =>
                    other.parameterCheck === item.parameterCheck &&
                    other.uom === item.uom &&
                    other.standardMin === item.standardMin &&
                    other.standardTarget === item.standardTarget &&
                    other.standardMax === item.standardMax
                );

                if (duplicates.length > 1) {
                    return item.sampleNo && item.result;
                }

                return true;
            });
            UpdateTableFG();
        }
    });
}
"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false;
var stabilityDataItemCode = [];
var stabilityDataFormula = [];
var stabilityDataPIC = [];
var stabilityDataProjectNo = [];
var ApiUrl = clsGlobal.getBackEndApi();
var baseUrl = $("#txtBaseUrl").val();

//=======================
// Confirmation
//=======================

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    BlockUI();
    setTimeout(function () {
        p_InitForm();
        p_showPrevData();
        $(".select2").select2();
        disableButton();
        disableForm();
        UnBlockUI();
    }, 300);
    
});

//=======================
// FUNCTION
//=======================
function p_InitForm() {
    p_tooltip();
    p_getDataSampleType();
    p_getSubBrand();
    p_getVarian();
    p_getProductType();
    p_initiateData();
    p_getProjectType();
    p_getMajorCriticalIngerdient();
    p_getPrimaryPackagingType();
    p_getProcessClassification();
    p_getManufacturingSite();
    p_getMethodology();
    p_getTemperature();
    p_getHumidity();
    p_getIncubatorChamber();
    p_getControlRoom();
    p_getWarehouse();
    p_getParamPhy();
    p_getParamMicro();
    p_initiateDataProductInformation();
    p_initiateDataMethodology();
    p_initiateDataSensoryEvaluationHeader();
    p_initiateDataSensoryEvaluationDetail();
    p_initiateDataPhysicalChemical();
    p_initiateDataMicrobiologyHeader();
    p_initiateDataMicrobiologyDetail();
    p_initiateDataPhysicalChemicalDetail();
    p_initiateDataTestReport();
    checkingAdminRole();
}
function p_showPrevData() {
    
    var reqNo = $("#txtRequestNo").val();

    if (!(reqNo === "" || reqNo === "/")) {
        var jsonData = [];
        let htmlJSON = $("#txtSamplePayload").val();
        jsonData = JSON.parse(htmlJSON);
        jsonData.objRequestData = {
            "Txtrequestnumber": clsGlobal.parseToString(reqNo),
        };
        jsonData.txtProgramCode = "SLS";

        $.ajax({
            type: "POST",
            url: ApiUrl + "api/1/FormRequestStabilita/getDataFormRequestHeaderByRequestNumber",
            contentType: "application/json",
            data: JSON.stringify(jsonData),
            headers: {
                Authorization: "Bearer " + $("#txtWSOToken").val(),
                BEAuthorization: $("#txtBEAuthorization").val()
            },
            datatype: "json",
            async: false,
            success: function (retDat) {
                if (retDat.bitSuccess == true) {
                    p_dataToUIStabilityForm(retDat.objData.FormRequestHeader);
                    p_dataToUIProductInformation(retDat.objData.FormProductInformation)
                    p_dataToUIMethodology(retDat.objData.FormMethodology)
                    p_dataToUISensoryEvaluationHeader(retDat.objData.Formsensoryevaluationheaders);
                    p_dataToUIPyhsicalChemical(retDat.objData.Formphysicalchemicalheaders);
                    p_dataToUIMicrobiologyHeader(retDat.objData.Formmicrobiologyheaders);
                    p_dataToUISensoryEvaluationDetail(retDat.objData.Formsensoryevaluationdetails);
                    p_dataToUIMicrobiologyDetail(retDat.objData.Formmicrobiologydetails);
                    p_dataToUIPhysicalChemicalDetail(retDat.objData.Formphysicalchemicaldetails);
                    p_dataToUITestReport(retDat.objData.Formtestreports);
                } else {
                    clsGlobal.swalError(retDat.txtErrorMessage);
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.swalError(xhr.responseText);
            }
        });
    }
}
function p_showBlank() {
    p_initiateData();
    p_initiateDataProductInformation();
    p_initiateDataSensoryEvaluationHeader();
    p_initiateDataSensoryEvaluationDetail();
    p_initiateDataMethodology();
}
function p_tooltip() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}
function sortListSensoryDetail() {
    
    var list, i, switching, b, shouldSwitch, c;
    list = document.getElementById("tableSensoryEvalDetail");
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // start by saying: no switching is done:
        switching = false;
        b = list.getElementsByTagName("TR");
        // Loop through all list-items:
        for (i = 0; i < (b.length - 1); i++) {
            // start by saying there should be no switching:
            shouldSwitch = false;
            /* check if the next item should
            switch place with the current item: */

            if (Number(b[i].cells[0].innerText) > Number(b[i + 1].cells[0].innerText)) {
                /* if next item is numerically
                lower than current item, mark as a switch
                and break the loop: */
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark the switch as done: */
            b[i].parentNode.insertBefore(b[i + 1], b[i]);
            switching = true;
        }
    }
}
function sortListMicrobiology() {
    
    var list, i, switching, b, shouldSwitch, c;
    list = document.getElementById("table-microBiologyBody");
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // start by saying: no switching is done:
        switching = false;
        b = list.getElementsByTagName("TR");
        // Loop through all list-items:
        for (i = 0; i < (b.length - 1); i++) {
            // start by saying there should be no switching:
            shouldSwitch = false;
            /* check if the next item should
            switch place with the current item: */

            if (Number(b[i].cells[0].innerText) > Number(b[i + 1].cells[0].innerText)) {
                /* if next item is numerically
                lower than current item, mark as a switch
                and break the loop: */
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark the switch as done: */
            b[i].parentNode.insertBefore(b[i + 1], b[i]);
            switching = true;
        }
    }
}
function sortListPhysicalChemical() {
    
    var list, i, switching, b, shouldSwitch, c;
    list = document.getElementById("table-phyCheEvalBody");
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // start by saying: no switching is done:
        switching = false;
        b = list.getElementsByTagName("TR");
        // Loop through all list-items:
        for (i = 0; i < (b.length - 1); i++) {
            // start by saying there should be no switching:
            shouldSwitch = false;
            /* check if the next item should
            switch place with the current item: */

            if (Number(b[i].cells[0].innerText) > Number(b[i + 1].cells[0].innerText)) {
                /* if next item is numerically
                lower than current item, mark as a switch
                and break the loop: */
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark the switch as done: */
            b[i].parentNode.insertBefore(b[i + 1], b[i]);
            switching = true;
        }
    }
}
function checkingAdminRole() {
    if (clsGlobal.parseToString($('#txtRoleName').val()) != ADMINISTRATOR && clsGlobal.parseToString($('#txtRoleName').val()) != SUPERIORSLS && clsGlobal.parseToString($('#txtRoleName').val()) != ADMINSLS) {
        $('#admin-table *').attr('disabled', true);
    }

    if (clsGlobal.parseToString($('#txtRoleName').val()) != ADMINISTRATOR && clsGlobal.parseToString($('#txtRoleName').val()) != SUPERIORSLS && clsGlobal.parseToString($('#txtRoleName').val()) != ADMINSLS && clsGlobal.parseToString($('#txtRoleName').val()) != SUPERIORREQUESTORSLS) {
        $('#txtSummaryTestResult').prop('disabled', true);
        $('#txtShelflifeRecommen').prop('disabled', true);
        $('#txtFinalShelflife').prop('disabled', true);
    }
}
function disableHeaderEvalution() {
    if (clsGlobal.parseToString($("#txtDocumentStatus").val()) != DRAFT && clsGlobal.parseToString($("#txtDocumentStatus").val()) != ADMINREVIEW) {
        $('#headerSensory *').attr('disabled', true);
        $('.microHeader *').attr('disabled', true);
        $('.phyCheHeader *').attr('disabled', true);
    } else {
        $('#headerSensory *').attr('disabled', false);
        $('.microHeader *').attr('disabled', false);
        $('.phyCheHeader *').attr('disabled', false);
    }

    if (clsGlobal.parseToString($("#txtDocumentStatus").val()) != DRAFT && clsGlobal.parseToString($("#txtDocumentStatus").val()) != ADMINREVIEW) {
        $('#admin-table *').attr('disabled', true);
    }
}
function disableButton() {
    var txtItemCode = clsGlobal.parseToString($('#txtItemCode').val());
    var roleName = clsGlobal.parseToString($('#txtRoleName').val());
    var docStatus = clsGlobal.parseToString($('#txtDocumentStatus').val());
    var requestNumber = clsGlobal.parseToString($('#intFormRequestHeaderId').val());
    var bitIsSpec = clsGlobal.parseToString($('#bitIsSpec').val());
    var txtPIC = clsGlobal.parseToString($("#txtPIC").val());
    var txtFullname = clsGlobal.parseToString($("#txtFullName").val());
    var txtUsername = clsGlobal.parseToString($("#txtUserLogin").val());

    
    if (roleName == REQUESTORSLS) {
        if (docStatus == DRAFT && requestNumber == "0") {
            $("#btnNew").removeClass("d-none");
            $("#btnSave").removeClass("d-none");
            $("#btnSubmit").removeClass("d-none");
            $("#btnBack").removeClass("d-none");
        }
        if (docStatus == DRAFT && requestNumber != "0") {
            $("#btnNew").removeClass("d-none");
            $("#historicalStatus").removeClass("d-none");
            $("#historyMasterSpec").removeClass("d-none");
            $("#btnSave").removeClass("d-none");
            $("#btnSubmit").removeClass("d-none");
            $("#btnBack").removeClass("d-none");
            $("#btnCopyFrom").removeClass("d-none");
            $("#btnTerminate").removeClass("d-none");
        }
        if (docStatus == ADMINREVIEW) {
            $("#btnNew").removeClass("d-none");
            $("#historicalStatus").removeClass("d-none");
            $("#historyMasterSpec").removeClass("d-none");
            $("#btnSave").addClass("d-none");
            $("#btnSubmit").addClass("d-none");
            $("#btnBack").removeClass("d-none");
            $("#btnCopyFrom").removeClass("d-none");
            $("#btnTerminate").removeClass("d-none");
        }
        if (docStatus == ONGOINGEVALUATION) {
            $("#btnNew").removeClass("d-none");
            $("#historicalStatus").removeClass("d-none");
            $("#historyMasterSpec").removeClass("d-none");
            $("#btnSave").removeClass("d-none");
            $("#btnSubmit").removeClass("d-none");
            $("#btnBack").removeClass("d-none");
            $("#btnCopyFrom").removeClass("d-none");
            $("#btnPrint").removeClass("d-none");
        }
        if (docStatus == REQUESTREPORT) {
            $("#btnNew").removeClass("d-none");
            $("#historicalStatus").removeClass("d-none");
            $("#historyMasterSpec").removeClass("d-none");
            $("#btnBack").removeClass("d-none");
            $("#btnSave").addClass("d-none");
            $("#btnSubmit").addClass("d-none");
            $("#btnCopyFrom").removeClass("d-none");
            $("#btnPrint").removeClass("d-none");
        }
        if (docStatus == WAITINGFORSUPPERIORAPPROVAL) {
            $("#btnNew").removeClass("d-none");
            $("#historicalStatus").removeClass("d-none");
            $("#historyMasterSpec").removeClass("d-none");
            $("#btnBack").removeClass("d-none");
            $("#btnCopyFrom").removeClass("d-none");
            $("#btnPrint").removeClass("d-none");
        }
        if (docStatus == WAITINGFORSUPPERIORREQUESTOPRAPPROVAL) {
            $("#btnNew").removeClass("d-none");
            $("#historicalStatus").removeClass("d-none");
            $("#historyMasterSpec").removeClass("d-none");
            $("#btnBack").removeClass("d-none");
            $("#btnCopyFrom").removeClass("d-none");
            $("#btnPrint").removeClass("d-none");
        }
        if (docStatus == APPROVED) {
            if ((bitIsSpec == "" || bitIsSpec == null || bitIsSpec == "false")) {
                if ((txtItemCode == "" || txtItemCode == null)) {
                    $("#btnNew").removeClass("d-none");
                    $("#historicalStatus").removeClass("d-none");
                    $("#historyMasterSpec").removeClass("d-none");
                    $("#btnBack").removeClass("d-none");
                    $("#btnCopyFrom").removeClass("d-none");
                    $("#btnPrint").removeClass("d-none");
                }
                else
                {
                    $("#btnNew").removeClass("d-none");
                    $("#historicalStatus").removeClass("d-none");
                    $("#historyMasterSpec").removeClass("d-none");
                    $("#btnBack").removeClass("d-none");
                    $("#btnCopyFrom").removeClass("d-none");
                    $("#btnSetSpec").removeClass("d-none");
                    $("#btnPrint").removeClass("d-none");
                }
                
            }
            else
            {
                $("#btnNew").removeClass("d-none");
                $("#historicalStatus").removeClass("d-none");
                $("#historyMasterSpec").removeClass("d-none");
                $("#btnBack").removeClass("d-none");
                $("#btnCopyFrom").removeClass("d-none");
                $("#btnPrint").removeClass("d-none");
            }
        }
    }
    if (roleName == ADMINSLS) {
        if (docStatus == DRAFT && requestNumber == "0") {
            $("#btnNew").removeClass("d-none");
            $("#btnSave").removeClass("d-none");
            $("#btnSubmit").removeClass("d-none");
            $("#btnBack").removeClass("d-none");
            $("#btnReturn").addClass("d-none");
        }
        if (docStatus == DRAFT && requestNumber != "0") {
            $("#historicalStatus").removeClass("d-none");
            $("#historyMasterSpec").removeClass("d-none");
            $("#btnSave").removeClass("d-none");
            $("#btnSubmit").removeClass("d-none");
            $("#btnBack").removeClass("d-none");
            $("#btnTerminate").removeClass("d-none");
            $("#btnReturn").addClass("d-none");
        }
        if (docStatus == ADMINREVIEW) {
            $("#historicalStatus").removeClass("d-none");
            $("#historyMasterSpec").removeClass("d-none");
            $("#btnSave").removeClass("d-none");
            $("#btnSubmit").removeClass("d-none");
            $("#btnBack").removeClass("d-none");
            $("#btnTerminate").removeClass("d-none");
            $("#btnReturn").removeClass("d-none");
        }
        if (docStatus == ONGOINGEVALUATION) {
            $("#historicalStatus").removeClass("d-none");
            $("#historyMasterSpec").removeClass("d-none");
            $("#btnSave").removeClass("d-none");
            $("#btnSubmit").removeClass("d-none");
            $("#btnBack").removeClass("d-none");
            $("#btnFinish").removeClass("d-none");
            $("#btnTerminate").addClass("d-none");
            $("#btnReturn").addClass("d-none");
            $("#btnPrint").removeClass("d-none");
        }
        if (docStatus == REQUESTREPORT) {
            $("#btnSave").removeClass("d-none");
            $("#btnSubmit").removeClass("d-none");
            $("#historicalStatus").removeClass("d-none");
            $("#historyMasterSpec").removeClass("d-none");
            $("#btnFinish").addClass("d-none");
            $("#btnBack").removeClass("d-none");
            $("#btnReturn").removeClass("d-none");
            $("#btnPrint").removeClass("d-none");
        }
        if (docStatus == WAITINGFORSUPPERIORAPPROVAL) {
            $("#historicalStatus").removeClass("d-none");
            $("#historyMasterSpec").removeClass("d-none");
            $("#btnBack").removeClass("d-none");
            $("#btnSave").addClass("d-none");
            $("#btnReturn").addClass("d-none");
            $("#btnSubmit").addClass("d-none");
            $("#btnPrint").removeClass("d-none");
        }
        if (docStatus == WAITINGFORSUPPERIORREQUESTOPRAPPROVAL) {
            $("#historicalStatus").removeClass("d-none");
            $("#historyMasterSpec").removeClass("d-none");
            $("#btnBack").removeClass("d-none");
            $("#btnSave").addClass("d-none");
            $("#btnReturn").addClass("d-none");
            $("#btnSubmit").addClass("d-none");
            $("#btnPrint").removeClass("d-none");
        }
        if (docStatus == APPROVED) {
            $("#historicalStatus").removeClass("d-none");
            $("#historyMasterSpec").removeClass("d-none");
            $("#btnReturn").addClass("d-none");
            $("#btnBack").removeClass("d-none");
            $("#btnPrint").removeClass("d-none");
        }
    }
    if (roleName == SUPERIORSLS) {
        if (docStatus == DRAFT && requestNumber == "0") {
            $("#btnNew").removeClass("d-none");
            $("#btnSave").removeClass("d-none");
            $("#btnSubmit").removeClass("d-none");
            $("#btnBack").removeClass("d-none");
        }
        if (docStatus == DRAFT && requestNumber != "0") {
            $("#historicalStatus").removeClass("d-none");
            $("#historyMasterSpec").removeClass("d-none");
            $("#btnBack").removeClass("d-none");
        }
        if (docStatus == ADMINREVIEW) {
            $("#historicalStatus").removeClass("d-none");
            $("#historyMasterSpec").removeClass("d-none");
            $("#btnBack").removeClass("d-none");
        }
        if (docStatus == ONGOINGEVALUATION) {
            $("#btnBack").removeClass("d-none");
            $("#historicalStatus").removeClass("d-none");
            $("#historyMasterSpec").removeClass("d-none");
            $("#btnPrint").removeClass("d-none");
        }
        if (docStatus == REQUESTREPORT) {
            $("#historicalStatus").removeClass("d-none");
            $("#historyMasterSpec").removeClass("d-none");
            $("#btnBack").removeClass("d-none");
            $("#btnPrint").removeClass("d-none");
        }
        if (docStatus == WAITINGFORSUPPERIORAPPROVAL) {
            $("#historicalStatus").removeClass("d-none");
            $("#historyMasterSpec").removeClass("d-none");
            $("#btnBack").removeClass("d-none");
            $("#btnPrint").removeClass("d-none");
        }
        if (docStatus == WAITINGFORSUPPERIORREQUESTOPRAPPROVAL) {
            $("#historicalStatus").removeClass("d-none");
            $("#historyMasterSpec").removeClass("d-none");
            $("#btnBack").removeClass("d-none");
            $("#btnPrint").removeClass("d-none");
        }
        if (docStatus == APPROVED) {
            $("#historicalStatus").removeClass("d-none");
            $("#historyMasterSpec").removeClass("d-none");
            $("#btnBack").removeClass("d-none");
            $("#btnPrint").removeClass("d-none");
        }
    }
    if (roleName == SUPERIORREQUESTORSLS) {
        if (docStatus == DRAFT && requestNumber == "0") {
            $("#btnNew").removeClass("d-none");
            $("#btnSubmit").removeClass("d-none");
            $("#btnBack").removeClass("d-none");
        }
        if (docStatus == DRAFT && requestNumber != "0") {
            if (txtPIC.toUpperCase() != txtUsername.toUpperCase()) {
                $("#btnNew").removeClass("d-none");
                $("#historicalStatus").removeClass("d-none");
                $("#historyMasterSpec").removeClass("d-none");
                $("#btnBack").removeClass("d-none");
                $("#btnCopyFrom").removeClass("d-none");
            } else {
                $("#btnNew").removeClass("d-none");
                $("#historicalStatus").removeClass("d-none");
                $("#historyMasterSpec").removeClass("d-none");
                $("#btnSubmit").removeClass("d-none");
                $("#btnBack").removeClass("d-none");
                $("#btnCopyFrom").removeClass("d-none");
                $("#btnTerminate").removeClass("d-none");
            }
        }
        if (docStatus == ADMINREVIEW) {
            if (txtPIC.toUpperCase() != txtUsername.toUpperCase()) {
                $("#btnNew").removeClass("d-none");
                $("#historicalStatus").removeClass("d-none");
                $("#historyMasterSpec").removeClass("d-none");
                $("#btnBack").removeClass("d-none");
                $("#btnCopyFrom").removeClass("d-none");
                $("#btnSubmit").addClass("d-none");
            } else {
                $("#btnNew").removeClass("d-none");
                $("#historicalStatus").removeClass("d-none");
                $("#historyMasterSpec").removeClass("d-none");
                $("#btnSave").removeClass("d-none");
                $("#btnSubmit").removeClass("d-none");
                $("#btnBack").removeClass("d-none");
                $("#btnCopyFrom").removeClass("d-none");
                $("#btnTerminate").removeClass("d-none");
            }
        }
        if (docStatus == ONGOINGEVALUATION) {
            if (txtPIC.toUpperCase() != txtUsername.toUpperCase()) {
                $("#btnNew").removeClass("d-none");
                $("#historicalStatus").removeClass("d-none");
                $("#historyMasterSpec").removeClass("d-none");
                $("#btnBack").removeClass("d-none");
                $("#btnCopyFrom").removeClass("d-none");
                $("#btnPrint").removeClass("d-none");
            } else {
                $("#btnNew").removeClass("d-none");
                $("#historicalStatus").removeClass("d-none");
                $("#historyMasterSpec").removeClass("d-none");
                $("#btnSave").removeClass("d-none");
                $("#btnSubmit").removeClass("d-none");
                $("#btnBack").removeClass("d-none");
                $("#btnCopyFrom").removeClass("d-none");
                $("#btnPrint").removeClass("d-none");
            }
        }
        if (docStatus == REQUESTREPORT) {
            $("#btnNew").removeClass("d-none");
            $("#historicalStatus").removeClass("d-none");
            $("#historyMasterSpec").removeClass("d-none");
            $("#btnBack").removeClass("d-none");
            $("#btnCopyFrom").removeClass("d-none");
            $("#btnSave").addClass("d-none");
            $("#btnSubmit").addClass("d-none");
            $("#btnPrint").removeClass("d-none");
        }
        if (docStatus == WAITINGFORSUPPERIORAPPROVAL) {
            $("#btnNew").removeClass("d-none");
            $("#historicalStatus").removeClass("d-none");
            $("#historyMasterSpec").removeClass("d-none");
            $("#btnBack").removeClass("d-none");
            $("#btnCopyFrom").removeClass("d-none");
            $("#btnPrint").removeClass("d-none");
        }
        if (docStatus == WAITINGFORSUPPERIORREQUESTOPRAPPROVAL) {
            $("#btnNew").removeClass("d-none");
            $("#historicalStatus").removeClass("d-none");
            $("#historyMasterSpec").removeClass("d-none");
            $("#btnBack").removeClass("d-none");
            $("#btnCopyFrom").removeClass("d-none");
            $("#btnPrint").removeClass("d-none");
        }
        if (docStatus == APPROVED) {
            if (txtPIC.toUpperCase() != txtUsername.toUpperCase()) {
                $("#btnNew").removeClass("d-none");
                $("#historicalStatus").removeClass("d-none");
                $("#historyMasterSpec").removeClass("d-none");
                $("#btnBack").removeClass("d-none");
                $("#btnCopyFrom").removeClass("d-none");
                $("#btnPrint").removeClass("d-none");
            }
            else {
                if ((bitIsSpec == "" || bitIsSpec == null)) {
                    if ((txtItemCode == "" || txtItemCode == null)) {
                        $("#btnNew").removeClass("d-none");
                        $("#historicalStatus").removeClass("d-none");
                        $("#historyMasterSpec").removeClass("d-none");
                        $("#btnBack").removeClass("d-none");
                        $("#btnCopyFrom").removeClass("d-none");
                        $("#btnPrint").removeClass("d-none");
                    }
                    else
                    {
                        $("#btnNew").removeClass("d-none");
                        $("#historicalStatus").removeClass("d-none");
                        $("#historyMasterSpec").removeClass("d-none");
                        $("#btnBack").removeClass("d-none");
                        $("#btnCopyFrom").removeClass("d-none");
                        $("#btnSetSpec").removeClass("d-none");
                        $("#btnPrint").removeClass("d-none");
                    }
                }
                else
                {
                    $("#btnNew").removeClass("d-none");
                    $("#historicalStatus").removeClass("d-none");
                    $("#historyMasterSpec").removeClass("d-none");
                    $("#btnBack").removeClass("d-none");
                    $("#btnCopyFrom").removeClass("d-none");
                    $("#btnPrint").removeClass("d-none");
                }
            }
        }
    }
    if (roleName == ADMINISTRATOR) {
        if (docStatus == DRAFT && requestNumber == "0") {
            $("#btnNew").removeClass("d-none");
            $("#btnSave").removeClass("d-none");
            $("#btnSubmit").removeClass("d-none");
            $("#btnBack").removeClass("d-none");
        }
        if (docStatus == DRAFT && requestNumber != "0") {
            $("#historicalStatus").removeClass("d-none");
            $("#historyMasterSpec").removeClass("d-none");
            $("#btnSave").removeClass("d-none");
            $("#btnSubmit").removeClass("d-none");
            $("#btnBack").removeClass("d-none");
            $("#btnTerminate").removeClass("d-none");
            
        }
        if (docStatus == ADMINREVIEW) {
            $("#historicalStatus").removeClass("d-none");
            $("#historyMasterSpec").removeClass("d-none");
            $("#btnSave").removeClass("d-none");
            $("#btnSubmit").removeClass("d-none");
            $("#btnBack").removeClass("d-none");
            $("#btnTerminate").removeClass("d-none");
        }
        if (docStatus == ONGOINGEVALUATION) {
            $("#historicalStatus").removeClass("d-none");
            $("#historyMasterSpec").removeClass("d-none");
            $("#btnSave").removeClass("d-none");
            $("#btnSubmit").removeClass("d-none");
            $("#btnBack").removeClass("d-none");
            $("#btnFinish").removeClass("d-none");
            $("#btnTerminate").addClass("d-none");
            $("#btnPrint").removeClass("d-none");
        }
        if (docStatus == REQUESTREPORT) {
            $("#btnSave").removeClass("d-none");
            $("#btnSubmit").removeClass("d-none");
            $("#historicalStatus").removeClass("d-none");
            $("#historyMasterSpec").removeClass("d-none");
            $("#btnFinish").addClass("d-none");
            $("#btnBack").removeClass("d-none");
            $("#btnPrint").removeClass("d-none");
        }
        if (docStatus == WAITINGFORSUPPERIORAPPROVAL) {
            $("#historicalStatus").removeClass("d-none");
            $("#historyMasterSpec").removeClass("d-none");
            $("#btnBack").removeClass("d-none");
            $("#btnSave").addClass("d-none");
            $("#btnSubmit").addClass("d-none");
            $("#btnPrint").removeClass("d-none");
        }
        if (docStatus == WAITINGFORSUPPERIORREQUESTOPRAPPROVAL) {
            $("#historicalStatus").removeClass("d-none");
            $("#historyMasterSpec").removeClass("d-none");
            $("#btnBack").removeClass("d-none");
            $("#btnSave").addClass("d-none");
            $("#btnSubmit").addClass("d-none");
            $("#btnPrint").removeClass("d-none");
        }
        if (docStatus == APPROVED) {
            $("#historicalStatus").removeClass("d-none");
            $("#historyMasterSpec").removeClass("d-none");
            $("#btnNew").removeClass("d-none");
            $("#btnSave").removeClass("d-none");
            $("#btnBack").removeClass("d-none");
            $("#btnSubmit").removeClass("d-none");
            $("#btnPrint").removeClass("d-none");
        }
    }
}
function disableForm() {
    var roleName = clsGlobal.parseToString($('#txtRoleName').val());
    var docStatus = clsGlobal.parseToString($('#txtDocumentStatus').val());
    var requestNumber = clsGlobal.parseToString($('#intFormRequestHeaderId').val());
    var bitIsSpec = clsGlobal.parseToString($('#bitIsSpec').val());
    var txtPIC = clsGlobal.parseToString($("#txtPIC").val());
    var txtFullname = clsGlobal.parseToString($("#txtFullName").val());
    var txtUsername = clsGlobal.parseToString($("#txtUserLogin").val());

    
    if (roleName == REQUESTORSLS) {
        if (txtPIC !== '') {
            if (txtPIC.toUpperCase() != txtUsername.toUpperCase()) {
                $('#stabilityHeaderForm *').attr('disabled', true);
                $('#formProductInformation *').attr('disabled', true);
                $('#formMethodology *').attr('disabled', true);
                $('#formSensoryEvaluation *').attr('disabled', true);
                $('#formPhysicalChemical *').attr('disabled', true);
                $('#formMicrobiology *').attr('disabled', true);
                $('#formTestReport *').attr('disabled', true);
            }
            else {
                if (docStatus == DRAFT && requestNumber == "0") {
                    $('#formTestReport *').attr('disabled', true);
                }
                if (docStatus == DRAFT && requestNumber != "0") {
                    $('#formTestReport *').attr('disabled', true);
                }
                if (docStatus == ADMINREVIEW) {
                    $('#stabilityHeaderForm *').attr('disabled', true);
                    $('#formProductInformation *').attr('disabled', true);
                    $('#formMethodology *').attr('disabled', true);
                    $('#formSensoryEvaluation *').attr('disabled', true);
                    $('#formPhysicalChemical *').attr('disabled', true);
                    $('#formMicrobiology *').attr('disabled', true);
                    $('#formTestReport *').attr('disabled', true);
                }
                if (docStatus == ONGOINGEVALUATION) {
                    $('#stabilityHeaderForm *').attr('disabled', true);
                    $('#formProductInformation *').attr('disabled', true);
                    $('#formMethodology *').attr('disabled', true);
                    $('#formTestReport *').attr('disabled', true);
                    $('#headerSensory *').attr('disabled', true);
                    $('.microHeader *').attr('disabled', true);
                    $('.phyCheHeader *').attr('disabled', true);
                }
                if (docStatus == REQUESTREPORT) {
                    $('#stabilityHeaderForm *').attr('disabled', true);
                    $('#formProductInformation *').attr('disabled', true);
                    $('#formMethodology *').attr('disabled', true);
                    $('#formSensoryEvaluation *').attr('disabled', true);
                    $('#formPhysicalChemical *').attr('disabled', true);
                    $('#formMicrobiology *').attr('disabled', true);
                    $('#formTestReport *').attr('disabled', true);
                }
                if (docStatus == WAITINGFORSUPPERIORAPPROVAL) {
                    $('#stabilityHeaderForm *').attr('disabled', true);
                    $('#formProductInformation *').attr('disabled', true);
                    $('#formMethodology *').attr('disabled', true);
                    $('#formSensoryEvaluation *').attr('disabled', true);
                    $('#formPhysicalChemical *').attr('disabled', true);
                    $('#formMicrobiology *').attr('disabled', true);
                    $('#formTestReport *').attr('disabled', true);
                }
                if (docStatus == WAITINGFORSUPPERIORREQUESTOPRAPPROVAL) {
                    $('#stabilityHeaderForm *').attr('disabled', true);
                    $('#formProductInformation *').attr('disabled', true);
                    $('#formMethodology *').attr('disabled', true);
                    $('#formSensoryEvaluation *').attr('disabled', true);
                    $('#formPhysicalChemical *').attr('disabled', true);
                    $('#formMicrobiology *').attr('disabled', true);
                    $('#formTestReport *').attr('disabled', true);
                }
                if (docStatus == APPROVED) {
                    if ((bitIsSpec == "" || bitIsSpec == null)) {
                        $('#stabilityHeaderForm *').attr('disabled', true);
                        $('#formProductInformation *').attr('disabled', true);
                        $('#formMethodology *').attr('disabled', true);
                        $('#formSensoryEvaluation *').attr('disabled', true);
                        $('#formPhysicalChemical *').attr('disabled', true);
                        $('#formMicrobiology *').attr('disabled', true);
                        $('#formTestReport *').attr('disabled', true);
                    }
                    else {
                        $('#stabilityHeaderForm *').attr('disabled', true);
                        $('#formProductInformation *').attr('disabled', true);
                        $('#formMethodology *').attr('disabled', true);
                        $('#formSensoryEvaluation *').attr('disabled', true);
                        $('#formPhysicalChemical *').attr('disabled', true);
                        $('#formMicrobiology *').attr('disabled', true);
                        $('#formTestReport *').attr('disabled', true);
                    }
                }
            }
        }
        else {
            if (docStatus == DRAFT && requestNumber == "0") {
                $('#formTestReport *').attr('disabled', true);
            }
            if (docStatus == DRAFT && requestNumber != "0") {
                $('#formTestReport *').attr('disabled', true);
            }
            if (docStatus == ADMINREVIEW) {
                $('#stabilityHeaderForm *').attr('disabled', true);
                $('#formProductInformation *').attr('disabled', true);
                $('#formMethodology *').attr('disabled', true);
                $('#formSensoryEvaluation *').attr('disabled', true);
                $('#formPhysicalChemical *').attr('disabled', true);
                $('#formMicrobiology *').attr('disabled', true);
                $('#formTestReport *').attr('disabled', true);
            }
            if (docStatus == ONGOINGEVALUATION) {
                $('#stabilityHeaderForm *').attr('disabled', true);
                $('#formProductInformation *').attr('disabled', true);
                $('#formMethodology *').attr('disabled', true);
                $('#formTestReport *').attr('disabled', true);
            }
            if (docStatus == REQUESTREPORT) {
                $('#stabilityHeaderForm *').attr('disabled', true);
                $('#formProductInformation *').attr('disabled', true);
                $('#formMethodology *').attr('disabled', true);
                $('#formSensoryEvaluation *').attr('disabled', true);
                $('#formPhysicalChemical *').attr('disabled', true);
                $('#formMicrobiology *').attr('disabled', true);
                $('#formTestReport *').attr('disabled', true);
            }
            if (docStatus == WAITINGFORSUPPERIORAPPROVAL) {
                $('#stabilityHeaderForm *').attr('disabled', true);
                $('#formProductInformation *').attr('disabled', true);
                $('#formMethodology *').attr('disabled', true);
                $('#formSensoryEvaluation *').attr('disabled', true);
                $('#formPhysicalChemical *').attr('disabled', true);
                $('#formMicrobiology *').attr('disabled', true);
                $('#formTestReport *').attr('disabled', true);
            }
            if (docStatus == WAITINGFORSUPPERIORREQUESTOPRAPPROVAL) {
                $('#stabilityHeaderForm *').attr('disabled', true);
                $('#formProductInformation *').attr('disabled', true);
                $('#formMethodology *').attr('disabled', true);
                $('#formSensoryEvaluation *').attr('disabled', true);
                $('#formPhysicalChemical *').attr('disabled', true);
                $('#formMicrobiology *').attr('disabled', true);
                $('#formTestReport *').attr('disabled', true);
            }
            if (docStatus == APPROVED) {
                if ((bitIsSpec == "" || bitIsSpec == null)) {
                    $('#stabilityHeaderForm *').attr('disabled', true);
                    $('#formProductInformation *').attr('disabled', true);
                    $('#formMethodology *').attr('disabled', true);
                    $('#formSensoryEvaluation *').attr('disabled', true);
                    $('#formPhysicalChemical *').attr('disabled', true);
                    $('#formMicrobiology *').attr('disabled', true);
                    $('#formTestReport *').attr('disabled', true);
                }
                else {
                    $('#stabilityHeaderForm *').attr('disabled', true);
                    $('#formProductInformation *').attr('disabled', true);
                    $('#formMethodology *').attr('disabled', true);
                    $('#formSensoryEvaluation *').attr('disabled', true);
                    $('#formPhysicalChemical *').attr('disabled', true);
                    $('#formMicrobiology *').attr('disabled', true);
                    $('#formTestReport *').attr('disabled', true);
                }
            }
        }
    }

    if (roleName == ADMINSLS) {
        if (docStatus == DRAFT && requestNumber == "0") {
            $('#formTestReport *').attr('disabled', true);
        }
        if (docStatus == DRAFT && requestNumber != "0") {
            $('#formTestReport *').attr('disabled', true);
        }
        if (docStatus == ADMINREVIEW) {
            $('#formTestReport *').attr('disabled', true);
        }
        if (docStatus == ONGOINGEVALUATION) {
            $('#stabilityHeaderForm *').attr('disabled', true);
            $('#formProductInformation *').attr('disabled', true);
            $('#formMethodology *').attr('disabled', true);
            $('#formTestReport *').attr('disabled', true);
            $('#headerSensory *').attr('disabled', true);
            $('.microHeader *').attr('disabled', true);
            $('.phyCheHeader *').attr('disabled', true);
        }
        if (docStatus == REQUESTREPORT) {
            $('#stabilityHeaderForm *').attr('disabled', true);
            $('#formProductInformation *').attr('disabled', true);
            $('#formMethodology *').attr('disabled', true);
            $('#formSensoryEvaluation *').attr('disabled', true);
            $('#formPhysicalChemical *').attr('disabled', true);
            $('#formMicrobiology *').attr('disabled', true);
            $('#formTestReport *').attr('disabled', false);
        }
        if (docStatus == WAITINGFORSUPPERIORAPPROVAL) {
            $('#stabilityHeaderForm *').attr('disabled', true);
            $('#formProductInformation *').attr('disabled', true);
            $('#formMethodology *').attr('disabled', true);
            $('#formSensoryEvaluation *').attr('disabled', true);
            $('#formPhysicalChemical *').attr('disabled', true);
            $('#formMicrobiology *').attr('disabled', true);
            $('#formTestReport *').attr('disabled', true);
        }
        if (docStatus == WAITINGFORSUPPERIORREQUESTOPRAPPROVAL) {
            $('#stabilityHeaderForm *').attr('disabled', true);
            $('#formProductInformation *').attr('disabled', true);
            $('#formMethodology *').attr('disabled', true);
            $('#formSensoryEvaluation *').attr('disabled', true);
            $('#formPhysicalChemical *').attr('disabled', true);
            $('#formMicrobiology *').attr('disabled', true);
            $('#formTestReport *').attr('disabled', true);
        }
        if (docStatus == APPROVED) {
            $('#stabilityHeaderForm *').attr('disabled', true);
            $('#formProductInformation *').attr('disabled', true);
            $('#formMethodology *').attr('disabled', true);
            $('#formSensoryEvaluation *').attr('disabled', true);
            $('#formPhysicalChemical *').attr('disabled', true);
            $('#formMicrobiology *').attr('disabled', true);
            $('#formTestReport *').attr('disabled', true);
        }
    }

    if (roleName == SUPERIORSLS) {
        if (txtPIC !== '') {
            if (txtPIC.toUpperCase() != txtUsername.toUpperCase()) {
                $('#stabilityHeaderForm *').attr('disabled', true);
                $('#formProductInformation *').attr('disabled', true);
                $('#formMethodology *').attr('disabled', true);
                $('#formSensoryEvaluation *').attr('disabled', true);
                $('#formPhysicalChemical *').attr('disabled', true);
                $('#formMicrobiology *').attr('disabled', true);
                $('#formTestReport *').attr('disabled', true);
            }
            else {
                if (docStatus == DRAFT && requestNumber == "0") {
                    $('#formTestReport *').attr('disabled', true);
                }
                if (docStatus == DRAFT && requestNumber != "0") {
                    $('#formTestReport *').attr('disabled', true);
                }
                if (docStatus == ADMINREVIEW) {
                    $('#stabilityHeaderForm *').attr('disabled', true);
                    $('#formProductInformation *').attr('disabled', true);
                    $('#formMethodology *').attr('disabled', true);
                    $('#formSensoryEvaluation *').attr('disabled', true);
                    $('#formPhysicalChemical *').attr('disabled', true);
                    $('#formMicrobiology *').attr('disabled', true);
                    $('#formTestReport *').attr('disabled', true);
                }
                if (docStatus == ONGOINGEVALUATION) {
                    $('#stabilityHeaderForm *').attr('disabled', true);
                    $('#formProductInformation *').attr('disabled', true);
                    $('#formMethodology *').attr('disabled', true);
                    $('#formSensoryEvaluation *').attr('disabled', true);
                    $('#formPhysicalChemical *').attr('disabled', true);
                    $('#formMicrobiology *').attr('disabled', true);
                    $('#formTestReport *').attr('disabled', true);
                }
                if (docStatus == REQUESTREPORT) {
                    $('#stabilityHeaderForm *').attr('disabled', true);
                    $('#formProductInformation *').attr('disabled', true);
                    $('#formMethodology *').attr('disabled', true);
                    $('#formSensoryEvaluation *').attr('disabled', true);
                    $('#formPhysicalChemical *').attr('disabled', true);
                    $('#formMicrobiology *').attr('disabled', true);
                    $('#formTestReport *').attr('disabled', true);
                }
                if (docStatus == WAITINGFORSUPPERIORAPPROVAL) {
                    $('#stabilityHeaderForm *').attr('disabled', true);
                    $('#formProductInformation *').attr('disabled', true);
                    $('#formMethodology *').attr('disabled', true);
                    $('#formSensoryEvaluation *').attr('disabled', true);
                    $('#formPhysicalChemical *').attr('disabled', true);
                    $('#formMicrobiology *').attr('disabled', true);
                    $('#formTestReport *').attr('disabled', true);
                }
                if (docStatus == WAITINGFORSUPPERIORREQUESTOPRAPPROVAL) {
                    $('#stabilityHeaderForm *').attr('disabled', true);
                    $('#formProductInformation *').attr('disabled', true);
                    $('#formMethodology *').attr('disabled', true);
                    $('#formSensoryEvaluation *').attr('disabled', true);
                    $('#formPhysicalChemical *').attr('disabled', true);
                    $('#formMicrobiology *').attr('disabled', true);
                    $('#formTestReport *').attr('disabled', true);
                }
                if (docStatus == APPROVED) {
                    $('#stabilityHeaderForm *').attr('disabled', true);
                    $('#formProductInformation *').attr('disabled', true);
                    $('#formMethodology *').attr('disabled', true);
                    $('#formSensoryEvaluation *').attr('disabled', true);
                    $('#formPhysicalChemical *').attr('disabled', true);
                    $('#formMicrobiology *').attr('disabled', true);
                    $('#formTestReport *').attr('disabled', true);
                }
            }
        }
        else
        {
            if (docStatus == DRAFT && requestNumber == "0") {
                $('#formTestReport *').attr('disabled', true);
            }
            if (docStatus == DRAFT && requestNumber != "0") {
                $('#formTestReport *').attr('disabled', true);
            }
            if (docStatus == ADMINREVIEW) {
                $('#stabilityHeaderForm *').attr('disabled', true);
                $('#formProductInformation *').attr('disabled', true);
                $('#formMethodology *').attr('disabled', true);
                $('#formSensoryEvaluation *').attr('disabled', true);
                $('#formPhysicalChemical *').attr('disabled', true);
                $('#formMicrobiology *').attr('disabled', true);
                $('#formTestReport *').attr('disabled', true);
            }
            if (docStatus == ONGOINGEVALUATION) {
                $('#stabilityHeaderForm *').attr('disabled', true);
                $('#formProductInformation *').attr('disabled', true);
                $('#formMethodology *').attr('disabled', true);
                $('#formSensoryEvaluation *').attr('disabled', true);
                $('#formPhysicalChemical *').attr('disabled', true);
                $('#formMicrobiology *').attr('disabled', true);
                $('#formTestReport *').attr('disabled', true);
            }
            if (docStatus == REQUESTREPORT) {
                $('#stabilityHeaderForm *').attr('disabled', true);
                $('#formProductInformation *').attr('disabled', true);
                $('#formMethodology *').attr('disabled', true);
                $('#formSensoryEvaluation *').attr('disabled', true);
                $('#formPhysicalChemical *').attr('disabled', true);
                $('#formMicrobiology *').attr('disabled', true);
                $('#formTestReport *').attr('disabled', true);
            }
            if (docStatus == WAITINGFORSUPPERIORAPPROVAL) {
                $('#stabilityHeaderForm *').attr('disabled', true);
                $('#formProductInformation *').attr('disabled', true);
                $('#formMethodology *').attr('disabled', true);
                $('#formSensoryEvaluation *').attr('disabled', true);
                $('#formPhysicalChemical *').attr('disabled', true);
                $('#formMicrobiology *').attr('disabled', true);
                $('#formTestReport *').attr('disabled', true);
            }
            if (docStatus == WAITINGFORSUPPERIORREQUESTOPRAPPROVAL) {
                $('#stabilityHeaderForm *').attr('disabled', true);
                $('#formProductInformation *').attr('disabled', true);
                $('#formMethodology *').attr('disabled', true);
                $('#formSensoryEvaluation *').attr('disabled', true);
                $('#formPhysicalChemical *').attr('disabled', true);
                $('#formMicrobiology *').attr('disabled', true);
                $('#formTestReport *').attr('disabled', true);
            }
            if (docStatus == APPROVED) {
                $('#stabilityHeaderForm *').attr('disabled', true);
                $('#formProductInformation *').attr('disabled', true);
                $('#formMethodology *').attr('disabled', true);
                $('#formSensoryEvaluation *').attr('disabled', true);
                $('#formPhysicalChemical *').attr('disabled', true);
                $('#formMicrobiology *').attr('disabled', true);
                $('#formTestReport *').attr('disabled', true);
            }
        } 
    }

    if (roleName == SUPERIORREQUESTORSLS) {
        if (txtPIC !== '') {
            if (txtPIC.toUpperCase() != txtUsername.toUpperCase()) {
                $('#stabilityHeaderForm *').attr('disabled', true);
                $('#formProductInformation *').attr('disabled', true);
                $('#formMethodology *').attr('disabled', true);
                $('#formSensoryEvaluation *').attr('disabled', true);
                $('#formPhysicalChemical *').attr('disabled', true);
                $('#formMicrobiology *').attr('disabled', true);
                $('#formTestReport *').attr('disabled', true);
            }
            else {
                if (docStatus == DRAFT && requestNumber == "0") {
                    $('#formTestReport *').attr('disabled', true);
                }
                if (docStatus == DRAFT && requestNumber != "0") {
                    $('#formTestReport *').attr('disabled', true);
                }
                if (docStatus == ADMINREVIEW) {
                    $('#stabilityHeaderForm *').attr('disabled', true);
                    $('#formProductInformation *').attr('disabled', true);
                    $('#formMethodology *').attr('disabled', true);
                    $('#formSensoryEvaluation *').attr('disabled', true);
                    $('#formPhysicalChemical *').attr('disabled', true);
                    $('#formMicrobiology *').attr('disabled', true);
                    $('#formTestReport *').attr('disabled', true);
                }
                if (docStatus == ONGOINGEVALUATION) {
                    $('#stabilityHeaderForm *').attr('disabled', true);
                    $('#formProductInformation *').attr('disabled', true);
                    $('#formMethodology *').attr('disabled', true);
                    $('#formTestReport *').attr('disabled', true);
                    $('#headerSensory *').attr('disabled', true);
                    $('.microHeader *').attr('disabled', true);
                    $('.phyCheHeader *').attr('disabled', true);
                }
                if (docStatus == REQUESTREPORT) {
                    $('#stabilityHeaderForm *').attr('disabled', true);
                    $('#formProductInformation *').attr('disabled', true);
                    $('#formMethodology *').attr('disabled', true);
                    $('#formSensoryEvaluation *').attr('disabled', true);
                    $('#formPhysicalChemical *').attr('disabled', true);
                    $('#formMicrobiology *').attr('disabled', true);
                    $('#formTestReport *').attr('disabled', true);
                }
                if (docStatus == WAITINGFORSUPPERIORAPPROVAL) {
                    $('#stabilityHeaderForm *').attr('disabled', true);
                    $('#formProductInformation *').attr('disabled', true);
                    $('#formMethodology *').attr('disabled', true);
                    $('#formSensoryEvaluation *').attr('disabled', true);
                    $('#formPhysicalChemical *').attr('disabled', true);
                    $('#formMicrobiology *').attr('disabled', true);
                    $('#formTestReport *').attr('disabled', true);
                }
                if (docStatus == WAITINGFORSUPPERIORREQUESTOPRAPPROVAL) {
                    $('#stabilityHeaderForm *').attr('disabled', true);
                    $('#formProductInformation *').attr('disabled', true);
                    $('#formMethodology *').attr('disabled', true);
                    $('#formSensoryEvaluation *').attr('disabled', true);
                    $('#formPhysicalChemical *').attr('disabled', true);
                    $('#formMicrobiology *').attr('disabled', true);
                    $('#formTestReport *').attr('disabled', true);
                }
                if (docStatus == APPROVED) {
                    if ((bitIsSpec == "" || bitIsSpec == null)) {
                        $('#stabilityHeaderForm *').attr('disabled', true);
                        $('#formProductInformation *').attr('disabled', true);
                        $('#formMethodology *').attr('disabled', true);
                        $('#formSensoryEvaluation *').attr('disabled', true);
                        $('#formPhysicalChemical *').attr('disabled', true);
                        $('#formMicrobiology *').attr('disabled', true);
                        $('#formTestReport *').attr('disabled', true);
                    }
                    else {
                        $('#stabilityHeaderForm *').attr('disabled', true);
                        $('#formProductInformation *').attr('disabled', true);
                        $('#formMethodology *').attr('disabled', true);
                        $('#formSensoryEvaluation *').attr('disabled', true);
                        $('#formPhysicalChemical *').attr('disabled', true);
                        $('#formMicrobiology *').attr('disabled', true);
                        $('#formTestReport *').attr('disabled', true);
                    }
                }
            }
        }
        else
        {
            if (docStatus == DRAFT && requestNumber == "0") {
                $('#formTestReport *').attr('disabled', true);
            }
            if (docStatus == DRAFT && requestNumber != "0") {
                $('#formTestReport *').attr('disabled', true);
            }
            if (docStatus == ADMINREVIEW) {
                $('#stabilityHeaderForm *').attr('disabled', true);
                $('#formProductInformation *').attr('disabled', true);
                $('#formMethodology *').attr('disabled', true);
                $('#formSensoryEvaluation *').attr('disabled', true);
                $('#formPhysicalChemical *').attr('disabled', true);
                $('#formMicrobiology *').attr('disabled', true);
                $('#formTestReport *').attr('disabled', true);
            }
            if (docStatus == ONGOINGEVALUATION) {
                $('#stabilityHeaderForm *').attr('disabled', true);
                $('#formProductInformation *').attr('disabled', true);
                $('#formMethodology *').attr('disabled', true);
                $('#formTestReport *').attr('disabled', true);
            }
            if (docStatus == REQUESTREPORT) {
                $('#stabilityHeaderForm *').attr('disabled', true);
                $('#formProductInformation *').attr('disabled', true);
                $('#formMethodology *').attr('disabled', true);
                $('#formSensoryEvaluation *').attr('disabled', true);
                $('#formPhysicalChemical *').attr('disabled', true);
                $('#formMicrobiology *').attr('disabled', true);
                $('#formTestReport *').attr('disabled', true);
            }
            if (docStatus == WAITINGFORSUPPERIORAPPROVAL) {
                $('#stabilityHeaderForm *').attr('disabled', true);
                $('#formProductInformation *').attr('disabled', true);
                $('#formMethodology *').attr('disabled', true);
                $('#formSensoryEvaluation *').attr('disabled', true);
                $('#formPhysicalChemical *').attr('disabled', true);
                $('#formMicrobiology *').attr('disabled', true);
                $('#formTestReport *').attr('disabled', true);
            }
            if (docStatus == WAITINGFORSUPPERIORREQUESTOPRAPPROVAL) {
                $('#stabilityHeaderForm *').attr('disabled', true);
                $('#formProductInformation *').attr('disabled', true);
                $('#formMethodology *').attr('disabled', true);
                $('#formSensoryEvaluation *').attr('disabled', true);
                $('#formPhysicalChemical *').attr('disabled', true);
                $('#formMicrobiology *').attr('disabled', true);
                $('#formTestReport *').attr('disabled', true);
            }
            if (docStatus == APPROVED) {
                if ((bitIsSpec == "" || bitIsSpec == null)) {
                    $('#stabilityHeaderForm *').attr('disabled', true);
                    $('#formProductInformation *').attr('disabled', true);
                    $('#formMethodology *').attr('disabled', true);
                    $('#formSensoryEvaluation *').attr('disabled', true);
                    $('#formPhysicalChemical *').attr('disabled', true);
                    $('#formMicrobiology *').attr('disabled', true);
                    $('#formTestReport *').attr('disabled', true);
                }
                else {
                    $('#stabilityHeaderForm *').attr('disabled', true);
                    $('#formProductInformation *').attr('disabled', true);
                    $('#formMethodology *').attr('disabled', true);
                    $('#formSensoryEvaluation *').attr('disabled', true);
                    $('#formPhysicalChemical *').attr('disabled', true);
                    $('#formMicrobiology *').attr('disabled', true);
                    $('#formTestReport *').attr('disabled', true);
                }
            }
        }

    }
}
function enableForm() {
    var bitCopyFrom = clsGlobal.parseToString($("#bitCopyFrom").val());
    var txtItemCode = clsGlobal.parseToString($("#txtItemCode").val());
    var txtSampleType = clsGlobal.parseToString($("#txtSampleType").find(":selected").val());

    
    if (bitCopyFrom == "true") {
        $('#stabilityHeaderForm *').attr('disabled', false);
        $('#formProductInformation *').attr('disabled', false);
        $('#formMethodology *').attr('disabled', false);
        $('#formSensoryEvaluation *').attr('disabled', false);
        $('#formPhysicalChemical *').attr('disabled', false);
        $('#formMicrobiology *').attr('disabled', false);
        $('#txtRequestNumber').attr('readonly', true);
        $('#txtDocumentStatus').attr('disabled', true);
        $('#txtConceptNumber').attr('disabled', true);

        // FORM REQUEST HEADER
        if (txtItemCode == "" || txtItemCode == null) {
            $('#txtItemDescription').attr('disabled', false);
        } else {
            $('#txtItemDescription').attr('disabled', true);
        }

        if (txtSampleType == SAMPLETYPEFINISHGOOD) {
            $("#txtSubBrand").attr('disabled', true);
            $("#txtBrand").attr('disabled', true);
            $("#txtLOB").attr('disabled', true);
            $("#txtVarian").attr('disabled', true);
            $("#txtProductType").attr('disabled', true);
            $("#txtSKU").attr('disabled', true);
        }

        if (txtSampleType == SAMPLETYPENONFINISHGOOD || txtSampleType == SAMPLETYPEOTHERS) {
            $("#txtSubBrand").attr('disabled', false);
            $("#txtBrand").attr('disabled', false);
            $("#txtLOB").attr('disabled', false);
            $("#txtVarian").attr('disabled', false);
            $("#txtProductType").attr('disabled', false);
            $("#txtSKU").attr('disabled', false);
        }

        // FORM PRODUCT INFORMATION
        $("#txtFormulaVersion").attr('disabled', true);
        $("#txtFormulaName").attr('disabled', true);

        // FORM Methodology
        $('#admin-table *').attr('disabled', true);
    }
}
function calculateWeekOrMonth(startDate, target, t) {
    
    if (t === WEEK) {
        return clsGlobal.parseShortDate(clsGlobal.addDays(startDate, (7 * target)));
    }

    if (t === MONTH) {
        return clsGlobal.parseShortDate(clsGlobal.addMonths(startDate, target));
    }
}

//=======================
// FORM REQUEST HEADER
//=======================
function p_saveDataMasterSpec(reqNumber, itemCode) {
    let htmlJson = $('#txtSamplePayload').val();
    let payload = JSON.parse(htmlJson);
    let userName = $('#txtUserLogin').val();

    payload.objRequestData = {
        FormRequestHeader: {
            Txtrequestnumber: reqNumber,
            Txtitemcode: itemCode
        },
        Username: userName,
    };

    $.ajax({
        type: "POST",
        url: ApiUrl + "api/1/FormDashboard/saveDataMasterSpec",
        contentType: "application/json",
        data: JSON.stringify(payload),
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                clsGlobal.swalSuccessSetSpec(retDat.txtMessage);
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function convertDateString(dtmRequestDate) {
    
    const mS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    const arrDate = dtmRequestDate.split("-");

    for (var i = 0; i <= mS.length; i++) {
        if (i === clsGlobal.parseToInteger(arrDate[1])) {
            return `${arrDate[2]} ${mS[i - 1]} ${arrDate[0]}`
        }
    }
}
function p_dataToUIStabilityForm(objData) {
    var txtUserLogin = $("#txtUserLogin").val();
    var stringDate = convertDateString(objData.Dtmrequestdate);

    $("#bitIsSpec").val(clsGlobal.parseToString(objData.Bitisspec));
    $("#txtRequestDate").val(clsGlobal.parseToString(stringDate));
    $("#intFormRequestHeaderId").val(clsGlobal.parseToString(objData.Intformrequestheaderid));
    if (clsGlobal.parseToString(objData.Intformrequestheaderid) !== "0") {
        $("#txtRequestNumber").val(clsGlobal.parseToString(objData.Txtrequestnumber));
    } else {
        $("#txtRequestNumber").attr('placeholder', 'Autogenerated by system after save or submitted');
    }
    
    $("#txtItemCode").val(clsGlobal.parseToString(objData.Txtitemcode));
    $("#txtItemCodeOrigin").val(clsGlobal.parseToString(objData.Txtitemcodeorigin));
    if (clsGlobal.parseToString(objData.Txtitemdescription) !== "") {
        $("#txtItemDescription").val(clsGlobal.parseToString(objData.Txtitemdescription));
        $('#txtItemDescription').attr("disabled", true);
    } else {
        $("#txtItemDescription").val(clsGlobal.parseToString(objData.Txtitemdescription));
        $('#txtItemDescription').attr("disabled", false);

    }

    $("#txtDocumentStatus").val(clsGlobal.parseToString(objData.Txtdocumentstatus));
    $("#txtPIC").val(clsGlobal.parseToString(objData.Txtpic));

    if (clsGlobal.parseToString(objData.Txtsampletype) !== "") {
        $("#txtSampleType").val(clsGlobal.parseToString(objData.Txtsampletype));
        $('#txtSampleType').trigger('change');
    } else {
        $('#txtSampleType').val(null).trigger('change');

    }

    // FINISH GOOD
    if (clsGlobal.parseToString(objData.Txtsampletype) == SAMPLETYPEFINISHGOOD) {
        $("#txtProjectNumber").val(clsGlobal.parseToString(objData.Txtprojectnumber)).attr('required', true);
        $("#labelProjectNumber").addClass("required-field");
        $("#txtConceptNumber").val(clsGlobal.parseToString(objData.Txtconceptnumber)).attr('required', true);
        if (clsGlobal.parseToString(objData.Txtsampletype) !== "") {
            $("#labelSubBrand").addClass("required-field");
            $("#txtSubBrand").val(clsGlobal.parseToString(objData.Txtsubbrand)).attr('required', true);
            $('#txtSubBrand').trigger('change');
            $('#txtSubBrand').attr("disabled", true);
        } else {
            $("#labelSubBrand").addClass("required-field");
            $('#txtSubBrand').val(null).trigger('change').attr('required', true);
            $('#txtSubBrand').attr("disabled", false);
        }

        if (clsGlobal.parseToString(objData.Txtsampletype) !== "") {
            $("#labelBrand").addClass("required-field");
            $("#txtBrand").val(clsGlobal.parseToString(objData.Txtbrand)).attr('required', true);
            $('#txtBrand').trigger('change');
            $('#txtBrand').attr("disabled", true);
        }

        $("#labelLOB").addClass("required-field");
        $("#txtLOB").val(clsGlobal.parseToString(objData.Txtlob)).attr('required', true);
        if (clsGlobal.parseToString(objData.Txtsampletype) !== "") {
            $("#labelVarian").addClass("required-field");
            $("#txtVarian").val(clsGlobal.parseToString(objData.Txtvarian)).attr('required', true);
            $('#txtVarian').trigger('change');
            $('#txtVarian').attr("disabled", true);
        } else {
            $("#labelVarian").addClass("required-field");
            $('#txtVarian').val(null).trigger('change').addClass("required-field").attr('required', true);
            $('#txtVarian').attr("disabled", false);

        }
        if (clsGlobal.parseToString(objData.Txtsampletype) !== "") {
            $("#labelProductType").addClass("required-field");
            $("#txtProductType").val(clsGlobal.parseToString(objData.Txtproducttype)).attr('required', true);
            $('#txtProductType').trigger('change');
            $('#txtProductType').attr("disabled", true);
        } else {
            $("#labelProductType").addClass("required-field");
            $('#txtProductType').val(null).trigger('change').addClass("required-field").attr('required', true);
            $('#txtProductType').attr("disabled", false);

        }
        $("#labelSKU").addClass("required-field");
        if (clsGlobal.parseToString(objData.Txtsku) !== "") {
            $("#txtSKU").val(clsGlobal.parseToString(objData.Txtsku)).attr('required', true);
            $('#txtSKU').attr("disabled", true);
        } else {
            $("#txtSKU").val(clsGlobal.parseToString(objData.Txtsku)).attr('required', true);
            $('#txtSKU').attr("disabled", false);
        }
    }

    // NON FINISH GOOD
    if (clsGlobal.parseToString(objData.Txtsampletype) == SAMPLETYPENONFINISHGOOD || clsGlobal.parseToString(objData.Txtsampletype) == SAMPLETYPEOTHERS) {
        $("#txtProjectNumber").val(clsGlobal.parseToString(objData.Txtprojectnumber)).attr('required', false);
        $("#labelProjectNumber").removeClass("required-field");
        $("#txtConceptNumber").val(clsGlobal.parseToString(objData.Txtconceptnumber)).attr('required', false);
        if (clsGlobal.parseToString(objData.Txtsampletype) !== "") {
            $("#labelSubBrand").removeClass("required-field");
            $("#txtSubBrand").val(clsGlobal.parseToString(objData.Txtsubbrand)).attr('required', false);
            $('#txtSubBrand').trigger('change');
            $('#txtSubBrand').attr("disabled", false);
        } else {
            $("#labelSubBrand").removeClass("required-field");
            $('#txtSubBrand').val(null).trigger('change').attr('required', false);
            $('#txtSubBrand').attr("disabled", false);
        }

        if (clsGlobal.parseToString(objData.Txtsampletype) !== "") {
            $("#labelBrand").removeClass("required-field");
            $("#txtBrand").val(clsGlobal.parseToString(objData.Txtbrand)).attr('required', false);
            $('#txtBrand').trigger('change');
            $('#txtBrand').attr("disabled", true);
        }

        $("#labelLOB").removeClass("required-field");
        $("#txtLOB").val(clsGlobal.parseToString(objData.Txtlob)).attr('required', false);
        if (clsGlobal.parseToString(objData.Txtsampletype) !== "") {
            $("#labelVarian").removeClass("required-field");
            $("#txtVarian").val(clsGlobal.parseToString(objData.Txtvarian)).attr('required', false);
            $('#txtVarian').trigger('change');
            $('#txtVarian').attr("disabled", false);
        } else {
            $("#labelVarian").removeClass("required-field");
            $('#txtVarian').val(null).trigger('change').removeClass("required-field").attr('required', false);
            $('#txtVarian').attr("disabled", false);

        }
        if (clsGlobal.parseToString(objData.Txtsampletype) !== "") {
            $("#labelProductType").removeClass("required-field");
            $("#txtProductType").val(clsGlobal.parseToString(objData.Txtproducttype)).attr('required', false);
            $('#txtProductType').trigger('change');
            $('#txtProductType').attr("disabled", false);
        } else {
            $("#labelProductType").removeClass("required-field");
            $('#txtProductType').val(null).trigger('change').removeClass("required-field").attr('required', false);
            $('#txtProductType').attr("disabled", false);

        }
        $("#labelSKU").removeClass("required-field");
        if (clsGlobal.parseToString(objData.Txtsku) !== "") {
            $("#txtSKU").val(clsGlobal.parseToString(objData.Txtsku)).attr('required', false);
            $('#txtSKU').attr("disabled", false);
        } else {
            $("#txtSKU").val(clsGlobal.parseToString(objData.Txtsku)).attr('required', false);
            $('#txtSKU').attr("disabled", false);
        }
    }

    $("#txtsupperiorapproval").val(clsGlobal.parseToString(objData.Txtsupperiorapproval));
    $("#txtsupperiorrequestorapproval").val(clsGlobal.parseToString(objData.Txtsupperiorrequestorapproval))
    $("#txtCreatedBy").val(clsGlobal.parseToString(objData.Txtcreatedby));
    $("#txtUpdatedBy").val(clsGlobal.parseToString(objData.Txtupdatedby));

    $("#txtHiddenObject").val(JSON.stringify(objData));
}
function p_initiateData() {
    $.ajax({
        type: "GET",
        url: ApiUrl + "api/1/FormRequestStabilita/initiateDataFormRequestHeader",
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        async: false,
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                p_dataToUIStabilityForm(retDat.objData);
                $("#txtHiddenObject").val(JSON.stringify(retDat));
                setItemSessionStorage("hiddenObjectHeader", JSON.stringify(retDat));
                //disableButton(retDat.objData);
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_getDataHistoricalStatus() {
    let jsonDat = $("#txtSamplePayload").val();

    let payload = JSON.parse(jsonDat);

    payload.objRequestData = {
        Txtrequestnumber: clsGlobal.parseToString($("#txtRequestNumber").val()),
    };

    $.ajax({
        type: "POST",
        url: ApiUrl + "api/1/FormRequestStabilita/getDataHistoricalStatusByRequestHeaderId",
        contentType: "application/json",
        data: JSON.stringify(payload),
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                p_popUpDataTableHistoryStatus(retDat.objData);
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_getDataHistoricalMasterSpec() {
    let jsonDat = $("#txtSamplePayload").val();

    let payload = JSON.parse(jsonDat);

    payload.objRequestData = {
        Txtitemcode: clsGlobal.parseToString($("#txtItemCode").val()),
    };

    $.ajax({
        type: "POST",
        url: ApiUrl + "api/1/FormRequestStabilita/getDataHistoricalMasterSpec",
        contentType: "application/json",
        data: JSON.stringify(payload),
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                p_popUpDataTableHistoryMasterSpec(retDat.objData);
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_UIToDataRequestHeader() {
    let jsonData = [];

    let htmlJSON = $("#txtHiddenObject").val();
    jsonData = JSON.parse(htmlJSON);

    if (clsGlobal.parseToString($("#Bitisspec").val()) === "") {
        jsonData.Bitisspec = null;
    } else {
        jsonData.Bitisspec = clsGlobal.parseToBoolean($("#Bitisspec").val());
    }
    jsonData.Intformrequestheaderid = clsGlobal.parseToInteger($("#intFormRequestHeaderId").val());
    jsonData.Dtmrequestdate = clsGlobal.parseToDateTimeFromJSONV2($("#txtRequestDate").val(), clsDateFormatV2);
    jsonData.Txtrequestnumber = clsGlobal.parseToString($("#txtRequestNumber").val());
    jsonData.Txtitemcode = clsGlobal.parseToString($("#txtItemCode").val());
    jsonData.Txtitemdescription = clsGlobal.parseToString($("#txtItemDescription").val());
    jsonData.Txtdocumentstatus = clsGlobal.parseToString($("#txtDocumentStatus").val());
    jsonData.Txtpic = clsGlobal.parseToString($("#txtPIC").val());
    jsonData.Txtitemcodeorigin = clsGlobal.parseToString($("#txtItemCodeOrigin").val());
    jsonData.Txtsampletype = clsGlobal.parseToString($("#txtSampleType").find(":selected").val());
    jsonData.Txtprojectnumber = clsGlobal.parseToString($("#txtProjectNumber").val());
    jsonData.Txtconceptnumber = clsGlobal.parseToString($("#txtConceptNumber").val());
    jsonData.Txtsubbrand = clsGlobal.parseToString($("#txtSubBrand").find(":selected").val());
    jsonData.Txtbrand = clsGlobal.parseToString($("#txtBrand").val());
    jsonData.Txtlob = clsGlobal.parseToString($("#txtLOB").val());
    jsonData.Txtvarian = clsGlobal.parseToString($("#txtVarian").find(":selected").val());
    jsonData.Txtproducttype = clsGlobal.parseToString($("#txtProductType").find(":selected").val());
    jsonData.Txtsku = clsGlobal.parseToString($("#txtSKU").val());
    jsonData.Txtcreatedby = clsGlobal.parseToString($("#txtCreatedBy").val());
    jsonData.Txtsupperiorapproval = clsGlobal.parseToString($("#txtsupperiorapproval").val());
    jsonData.Txtsupperiorrequestorapproval = clsGlobal.parseToString($("#xtsupperiorrequestorapproval").val());

    if (jsonData.Txtcreatedby === "") {
        jsonData.Txtcreatedby = clsGlobal.parseToString($("#txtUserLogin").val());
    } else if (jsonData.Txtcreatedby === clsGlobal.parseToString($("#txtUserLogin").val()) || jsonData.Txtcreatedby != null) {
        jsonData.Txtupdatedby = clsGlobal.parseToString($("#txtUserLogin").val());
    }

    return JSON.stringify(jsonData);
}
function p_saveData(buttonName, userName = "", txtRemarks = "") {
    debugger;
    let jsonDat = $("#txtSamplePayload").val();

    let payload = JSON.parse(jsonDat);

    var dataFormHeader = JSON.parse(p_UIToDataRequestHeader());
    var dataFormProductInformation = JSON.parse(p_UIToDataProductInformation());
    var dataMethodology = JSON.parse(p_UIToDataMethodology());
    var dataSensoryEvalHeader = JSON.parse(p_UIToDataSensoryEvaluationHeader());
    var dataPhysicalChemicalHeader = JSON.parse(p_UIToDataPhysicalChemical());
    var dataMicrobiologyHeader = JSON.parse(p_UIToDataMicrobiologyHeader());
    var dataSensoryDetail = JSON.parse(p_UIToDataSensoryEvaluationDetail());
    var dataMicrobiologyDetail = JSON.parse(p_UIToDataMicrobiologyDetail());
    var dataPhysicalChemicalDetail = JSON.parse(p_UIToDataPhysicalChemicalDetail());
    var dataTestReport = JSON.parse(p_UIToDataTestReport());
    var userName = clsGlobal.parseToString($('#txtFullName').val());
    var roleName = clsGlobal.parseToString($('#txtRoleName').val());
    var baseUrl = clsGlobal.parseToString($('#txtBaseUrl').val());

    payload.txtUsername = userName, 
    payload.objRequestData = {
        RoleName: roleName,
        Username: userName,
        BaseUrl: baseUrl,
        FormButtonName: buttonName,
        FormRequestHeader: {},
        FormProductInformation: {},
        FormMethodology: {},
        Formmicrobiologyheaders: {},
        Formphysicalchemicalheaders: {},
        Formsensoryevaluationheaders: {},
        Formtestreports: {},
        Formsensoryevaluationdetails: [],
        Formmicrobiologydetails: [],
        Formphysicalchemicaldetails: [],
        Formtestreports: {},
    };

    Object.assign(payload.objRequestData.FormRequestHeader, dataFormHeader);
    Object.assign(payload.objRequestData.FormProductInformation, dataFormProductInformation.objRequestData);
    Object.assign(payload.objRequestData.Formsensoryevaluationheaders, dataSensoryEvalHeader.objRequestData);
    Object.assign(payload.objRequestData.FormMethodology, dataMethodology.objRequestData);
    Object.assign(payload.objRequestData.Formphysicalchemicalheaders, dataPhysicalChemicalHeader.objRequestData);
    Object.assign(payload.objRequestData.Formmicrobiologyheaders, dataMicrobiologyHeader.objRequestData);
    Object.assign(payload.objRequestData.Formsensoryevaluationdetails, dataSensoryDetail);
    Object.assign(payload.objRequestData.Formmicrobiologydetails, dataMicrobiologyDetail);
    Object.assign(payload.objRequestData.Formphysicalchemicaldetails, dataPhysicalChemicalDetail);
    Object.assign(payload.objRequestData.Formtestreports, dataTestReport.objRequestData);
    
    IndexDBconnect(function onConnected(db) {
        const tx = db.transaction('SLS', 'readwrite');
        const store = tx.objectStore('SLS');
        const item = {
            Id: "StabilityForm",
            Data: JSON.stringify(payload),
            created: new Date().getTime(),
        };
        store.add(item);
        return tx.complete;
    });

    $.ajax({
        type: "POST",
        url: ApiUrl + "api/1/FormRequestStabilita/saveDataFormRequestHeader",
        contentType: "application/json",
        data: JSON.stringify(payload),
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != null) {
                    p_dataToUIStabilityForm(retDat.objData.FormRequestHeader);
                    p_dataToUIProductInformation(retDat.objData.FormProductInformation);
                    p_dataToUISensoryEvaluationHeader(retDat.objData.Formsensoryevaluationheaders);
                    p_dataToUIMethodology(retDat.objData.FormMethodology);
                    p_dataToUIPyhsicalChemical(retDat.objData.Formphysicalchemicalheaders);
                    p_dataToUIMicrobiologyHeader(retDat.objData.Formmicrobiologyheaders);
                    p_dataToUISensoryEvaluationDetail(retDat.objData.Formsensoryevaluationdetails);
                    p_dataToUIMicrobiologyDetail(retDat.objData.Formmicrobiologydetails);
                    p_dataToUIPhysicalChemicalDetail(retDat.objData.Formphysicalchemicaldetails);
                    p_dataToUITestReport(retDat.objData.Formtestreports);
                    disableButton();
                    disableForm();

                    clsGlobal.swalSuccess(retDat.txtMessage);
                }

                if (retDat.objData == null) {
                    if (retDat.txtMessage == 'succes termintate data') {
                        var html = $("#RedirectTo").val();
                        clsGlobal.swalSuccessTermintate(ConvertFirstLetterCapitalize(retDat.txtMessage), html);
                    }
                }

                if ($("#bitCopyFrom").val() === "true") {
                    p_dataToUIStabilityForm(retDat.objData.FormRequestHeader);
                    p_dataToUIProductInformation(retDat.objData.FormProductInformation);
                    p_dataToUISensoryEvaluationHeader(retDat.objData.Formsensoryevaluationheaders);
                    p_dataToUIMethodology(retDat.objData.FormMethodology);
                    p_dataToUIPyhsicalChemical(retDat.objData.Formphysicalchemicalheaders);
                    p_dataToUIMicrobiologyHeader(retDat.objData.Formmicrobiologyheaders);
                    p_dataToUISensoryEvaluationDetail(retDat.objData.Formsensoryevaluationdetails);
                    p_dataToUIMicrobiologyDetail(retDat.objData.Formmicrobiologydetails);
                    p_dataToUIPhysicalChemicalDetail(retDat.objData.Formphysicalchemicaldetails);
                    p_dataToUITestReport(retDat.objData.Formtestreports);
                    disableButton();
                    disableForm();

                    var html = $("#RedirectTo").val() + `/Index?RequestNo=${retDat.objData.FormRequestHeader.Txtrequestnumber}`;
                    clsGlobal.swalSuccessCopy(retDat.txtMessage, html);
                }

            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    })
}

//==========================
// FORM PRODUCT INFORMATION
//==========================
function p_initiateDataProductInformation() {
    $.ajax({
        type: "GET",
        url: ApiUrl + "api/1/FormProductInformation/initiateDataFormProductInformation",
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        async: false,
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                p_dataToUIProductInformation(retDat.objData);
                $("#txtHiddenObjectProductInformation").val(JSON.stringify(retDat));
                setItemSessionStorage("hiddenObjectProdInfo", JSON.stringify(retDat));
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_dataToUIProductInformation(objData) {
    
    $("#intProductInformationid").val(clsGlobal.parseToString(objData.Intproductinformationid));
    if (clsGlobal.parseToString(objData.Txtprojecttype) !== "") {
        $("#txtProjectType").val(clsGlobal.parseToString(objData.Txtprojecttype));
        $('#txtProjectType').trigger('change');
    } else {
        $("#txtProjectType").val(clsGlobal.parseToString(""));
        $('#txtProjectType').trigger('change');
    }

    $("#txtProjectBackground").val(clsGlobal.parseToString(objData.Txtprojectbackground));

    if (clsGlobal.parseToString(objData.Txtmajorcriticalingridient) !== "") {
        $("#selectMajorCriticalIngridients").val(clsGlobal.parseToString(objData.Txtmajorcriticalingridient).split(","));
        $('#selectMajorCriticalIngridients').trigger('change');
    } else {
        $("#selectMajorCriticalIngridients").val(clsGlobal.parseToString(""));
        $('#selectMajorCriticalIngridients').trigger('change');
    }

    $("#intShelfLifeTarget").val(clsGlobal.parseToString(objData.Txtshelflifetarget));

    if (clsGlobal.parseToString(objData.Txtpackagingtype) !== "") {
        $("#txtPackagingType").val(clsGlobal.parseToString(objData.Txtpackagingtype));
        $('#txtPackagingType').trigger('change');
    } else {
        $("#txtPackagingType").val(clsGlobal.parseToString(""));
        $('#txtPackagingType').trigger('change');
    }

    $("#txtPackagingSpecs").val(clsGlobal.parseToString(objData.Txtpackagingspecification));

    if (clsGlobal.parseToInteger(objData.Intproductinformationid) !== 0 && objData.Bitnitrogencontent !== null) {
        $("input[name='bitNitrogenRadio']").filter(`[value=${objData.Bitnitrogencontent}]`).prop('checked', true);
    }

    $("#txtFormulaNumber").val(clsGlobal.parseToString(objData.Txtformulanumber));
    $("#txtFormulaOrigin").val(clsGlobal.parseToString(objData.Txtformulaorigin));
    $("#txtFormulaVersion").val(clsGlobal.parseToString(objData.Txtformulaversion));
    $("#txtFormulaName").val(clsGlobal.parseToString(objData.Txtformulaname));

    if (clsGlobal.parseToInteger(objData.Intproductinformationid) !== 0) {
        $("#dtmManufacturingDate").val(clsGlobal.parseToString(objData.Dtmamnufacturingdate));
    }
    
    $("#txtBatchCode").val(clsGlobal.parseToString(objData.Txtbatchproductioncode));

    if (clsGlobal.parseToString(objData.Txtprocessclasification) !== "") {
        $("#txtProcessClassification").val(clsGlobal.parseToString(objData.Txtprocessclasification));
        $('#txtProcessClassification').trigger('change');
    } else {
        $("#txtProcessClassification").val(clsGlobal.parseToString(""));
        $('#txtProcessClassification').trigger('change');
    }

    if (clsGlobal.parseToString(objData.Txtmanufacturersite) !== "") {
        $("#txtManufacturingSite").val(clsGlobal.parseToString(objData.Txtmanufacturersite));
        $('#txtManufacturingSite').trigger('change');
    } else {
        $("#txtManufacturingSite").val(clsGlobal.parseToString(""));
        $('#txtManufacturingSite').trigger('change');
    }

    $("#txtCreatedByProductInformation").val(clsGlobal.parseToString(objData.Txtcreatedby));
    $("#txtUpdatedByProductInformation").val(clsGlobal.parseToString(objData.Txtupdatedby));
}
function p_UIToDataProductInformation() {
    let jsonData = [];
    let txtMajorCritical = [];

    // Looping Param Micro
    $.each($("#selectMajorCriticalIngridients").find(":selected"), function (index, item) {
        txtMajorCritical.push(item.value);
    });

    let htmlJSON = $("#txtHiddenObjectProductInformation").val();
    jsonData = JSON.parse(htmlJSON);
    jsonData.objRequestData = jsonData.objData;

    jsonData.objRequestData.Intformrequestheaderid = clsGlobal.parseToInteger($("#intFormRequestHeaderId").val());
    jsonData.objRequestData.Intproductinformationid = clsGlobal.parseToInteger($("#intProductInformationid").val());
    jsonData.objRequestData.Txtprojecttype = clsGlobal.parseToString($("#txtProjectType").find(":selected").val());
    jsonData.objRequestData.Txtprojectbackground = clsGlobal.parseToString($("#txtProjectBackground").val());
    jsonData.objRequestData.Txtmajorcriticalingridient = clsGlobal.parseToString(txtMajorCritical);
    jsonData.objRequestData.Txtshelflifetarget = clsGlobal.parseToString($("#intShelfLifeTarget").val());
    jsonData.objRequestData.Txtpackagingtype = clsGlobal.parseToString($("#txtPackagingType").find(":selected").val());
    jsonData.objRequestData.Txtpackagingspecification = clsGlobal.parseToString($("#txtPackagingSpecs").val());
    jsonData.objRequestData.Bitnitrogencontent = $("input[name='bitNitrogenRadio']:checked").val();
    jsonData.objRequestData.Txtformulanumber = clsGlobal.parseToString($("#txtFormulaNumber").val());
    jsonData.objRequestData.Txtformulaversion = clsGlobal.parseToString($("#txtFormulaVersion").val());
    jsonData.objRequestData.Txtformulaname = clsGlobal.parseToString($("#txtFormulaName").val());
    jsonData.objRequestData.Txtformulaorigin = clsGlobal.parseToString($("#txtFormulaOrigin").val());
    jsonData.objRequestData.Dtmamnufacturingdate = clsGlobal.parseToString($("#dtmManufacturingDate").val());
    jsonData.objRequestData.Txtbatchproductioncode = clsGlobal.parseToString($("#txtBatchCode").val());
    jsonData.objRequestData.Txtprocessclasification = clsGlobal.parseToString($("#txtProcessClassification").find(":selected").val());
    jsonData.objRequestData.Txtmanufacturersite = clsGlobal.parseToString($("#txtManufacturingSite").find(":selected").val());
    jsonData.objRequestData.Txtcreatedby = clsGlobal.parseToString($("#txtCreatedBy").val());

    if (jsonData.objRequestData.Txtcreatedby === "") {
        jsonData.objRequestData.Txtcreatedby = clsGlobal.parseToString($("#txtUserLogin").val());
    } else if (jsonData.objRequestData.Txtcreatedby === clsGlobal.parseToString($("#txtUserLogin").val()) || jsonData.objRequestData.Txtcreatedby != null) {
        jsonData.objRequestData.Txtupdatedby = clsGlobal.parseToString($("#txtUserLogin").val());
    }

    return JSON.stringify(jsonData);
}

//=================================
// Master FORM PRODUCT INFORMATION
//=================================
function p_getProjectType() {
    $.ajax({
        type: "GET",
        url: ApiUrl + "api/1/Master/getMasterProjectType",
        contentType: "application/json",
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        async: false,
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                p_mappingDataProjectTypeToSelect(retDat.objData);
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_mappingDataProjectTypeToSelect(objData) {
    var datProjectType = objData;
    for (var i = 0; i < datProjectType.length; i++) {
        $('#txtProjectType').append(`<option value="${datProjectType[i].TxtProjectTypeCode}">${datProjectType[i].TxtProjectTypeDescription}</option>`);
    }
}
function p_getMajorCriticalIngerdient() {
    $.ajax({
        type: "GET",
        url: ApiUrl + "api/1/Master/getMasterMajorCriticalIngridient",
        contentType: "application/json",
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        async: false,
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                p_mappingDataMajorCriticalIngerdientToSelect(retDat.objData);
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_mappingDataMajorCriticalIngerdientToSelect(objData) {
    var datMCI = objData;
    for (var i = 0; i < datMCI.length; i++) {
        $('#selectMajorCriticalIngridients').append(`<option value="${datMCI[i].TxtCode}">${datMCI[i].TxtCode} | ${datMCI[i].TxtDescription}</option>`);
    }
}
function p_getPrimaryPackagingType() {
    $.ajax({
        type: "GET",
        url: ApiUrl + "api/1/Master/getMasterPMType",
        contentType: "application/json",
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        async: false,
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                p_mappingDataPrimaryPackagingTypeToSelect(retDat.objData);
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_mappingDataPrimaryPackagingTypeToSelect(objData) {
    var datPMType = objData;
    for (var i = 0; i < datPMType.length; i++) {
        $('#txtPackagingType').append(`<option value="${datPMType[i].TxtPMTypeCode}">${datPMType[i].TxtPMTypeDescription}</option>`);
    }
}
function p_getProcessClassification() {
    $.ajax({
        type: "GET",
        url: ApiUrl + "api/1/Master/getMasterProcessClassification",
        contentType: "application/json",
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        async: false,
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                p_mappingDataProcessClassificationToSelect(retDat.objData);
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_mappingDataProcessClassificationToSelect(objData) {
    var datProcessClass = objData;
    for (var i = 0; i < datProcessClass.length; i++) {
        $('#txtProcessClassification').append(`<option value="${datProcessClass[i].TxtCode}">${datProcessClass[i].TxtDescription}</option>`);
    }
}
function p_getManufacturingSite() {
    $.ajax({
        type: "GET",
        url: ApiUrl + "api/1/Master/getManufacturingSites",
        contentType: "application/json",
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        async: false,
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                p_mappingDatap_getManufacturingSiteToSelect(retDat.objData);
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_mappingDatap_getManufacturingSiteToSelect(objData) {
    var datManufSite = objData;
    for (var i = 0; i < datManufSite.length; i++) {
        $('#txtManufacturingSite').append(`<option value="${datManufSite[i].TxtCode}">${datManufSite[i].TxtCode} | ${datManufSite[i].TxtDescription}</option>`);
    }
}
function p_getFormula() {
    if (stabilityDataFormula.length < 1) {
        $.ajax({
            type: "GET",
            url: ApiUrl + "api/1/Master/getFormula",
            contentType: "application/json",
            headers: {
                Authorization: "Bearer " + $("#txtWSOToken").val(),
                BEAuthorization: $("#txtBEAuthorization").val()
            },
            datatype: "json",
            success: function (retDat) {
                if (retDat.bitSuccess == true) {
                    if (stabilityDataFormula.length < 1) {
                        stabilityDataFormula = retDat.objData;
                        p_popUpLOVSwalFormula(retDat.objData);
                    } else {
                        p_popUpLOVSwalFormula(stabilityDataFormula);
                    }

                } else {
                    clsGlobal.swalError(retDat.txtErrorMessage);
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.swalError(xhr.responseText);
            }
        });
    } else {
        p_popUpLOVSwalFormula(stabilityDataFormula);
    }
}
function p_RequestDataProjectBackground(objRequestData) {
    var jsonData = [];
    let htmlJSON = $("#txtSamplePayload").val();
    jsonData = JSON.parse(htmlJSON);
    jsonData.objRequestData = {
        "TxtConceptNo": clsGlobal.parseToString(objRequestData)
    };
    jsonData.txtProgramCode = "SLS";
    return JSON.stringify(jsonData);
}
function p_getDataProjectBackground(objRequestData) {
    var payload = p_RequestDataProjectBackground(objRequestData);
    $.ajax({
        type: "POST",
        url: ApiUrl + "api/1/Master/getMasterProjectBackground",
        contentType: "application/json",
        data: payload,
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                p_MappingDataProjectNumberBackground(retDat.objData);
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_MappingDataProjectNumberBackground(objData) {
    $("#txtProjectBackground").val(clsGlobal.parseToString(objData.TxtProjectBackground));
    if (objData.IntShelfLifeTarget > 0) {
        $("#intShelfLifeTarget").val(clsGlobal.parseToString(objData.IntShelfLifeTarget));
    }
}

//=================================
// FORM Sensory Evaluation
//=================================
function p_initiateDataSensoryEvaluationHeader() {
    $.ajax({
        type: "GET",
        url: ApiUrl + "api/1/FormSensoryEvaluation/initiateDataFormSensoryEvaluationHeader",
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        async: false,
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                p_dataToUISensoryEvaluationHeader(retDat.objData);
                $("#txtHiddenObjectSensoryEvaluation").val(JSON.stringify(retDat));
                setItemSessionStorage("hiddenObjectSensoryHeader", JSON.stringify(retDat));
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_dataToUISensoryEvaluationHeader(objData) {
    

    $("#Intsensoryevaluationheaderid").val(clsGlobal.parseToString(objData.Intsensoryevaluationheaderid));

    if (clsGlobal.parseToInteger(objData.Intnumberevaluation) !== 0) {
        $("#txtIntervalEvaluation").val(clsGlobal.parseToString(objData.Intnumberevaluation));
    }

    if (clsGlobal.parseToInteger(objData.Intsensoryevaluationheaderid) !== 0 && objData.Txtintervalevaluation !== "") {
        $("input[name='intervalEvalRadioButton']").filter(`[value=${objData.Txtintervalevaluation}]`).prop('checked', true);
    }

    $("#txtCreatedBySensoryEvaluation").val(clsGlobal.parseToString(objData.Txtcreatedby));
    $("#txtUpdatedBySensoryEvaluation").val(clsGlobal.parseToString(objData.Txtupdatedby));
}
function p_initiateDataSensoryEvaluationDetail() {
    $.ajax({
        type: "GET",
        url: ApiUrl + "api/1/FormSensoryEvaluation/initiateDataFormSensoryEvaluationDetail",
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        async: false,
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                p_dataToUISensoryEvaluationDetail(retDat.objData);
                $("#txtHiddenObjectSensoryEvaluationDetail").val(JSON.stringify(retDat));
                setItemSessionStorage("hiddenObjectSensoryDetail", JSON.stringify(retDat));
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_bindingDataTxtSummary(objData) {
    var list, i, b;
    list = document.getElementById("tableSensoryEvalDetail");
    b = list.getElementsByTagName("TR");

    for (i = 0; i < b.length; i++) {
        if (objData[i].Txtsummary !== null) {
            $('#selectSummarySensoryEval' + i).val(clsGlobal.parseToString(objData[i].Txtsummary)).trigger("change");
        } else {
            $('#selectSummarySensoryEval' + i).val("-").trigger("change");
        }
    }
}
function p_dataToUISensoryEvaluationDetail(objData) {
    
    var Table = document.getElementById("tableSensoryEvalDetail");
    if (objData.length > 0) {
        Table.innerHTML = "";
    }

    let dtmDateEval = "";
    let num = 0;
    let Intappearanceapplication = "";
    let Intaromaapplication = "";
    let Intcolorapplication = "";
    let Inttasteapplication = "";
    let Inttextureapplication = "";
    let Intappearanceproduct = "";
    let Intaromaproduct = "";
    let Intcolorproduct = "";
    let Inttasteproduct = "";
    let Inttextureproduct = "";
    let Intaw = "";
    let Intbrix = "";
    let Intmoisture = "";
    let Intph = "";
    let Intresidueoxygen = "";
    let Txtremaks = "";
    let Txtcreatedby = "";
    let Dtmcreateddate = "";


    document.getElementById("tableSensoryEvalDetail").style.textAlign = "center";

    for (let i = 0; i < objData.length; i++) {

        dtmDateEval = JSON.stringify(objData[i].Dtmdateofevaluation);
        num = [i + 1, objData[i].Intsensoryevaluationdetailid];
        Intappearanceapplication = objData[i].Intappearanceapplication;
        Intaromaapplication = objData[i].Intaromaapplication;
        Intcolorapplication = objData[i].Intcolorapplication;
        Inttasteapplication = objData[i].Inttasteapplication;
        Inttextureapplication = objData[i].Inttextureapplication;
        Intappearanceproduct = objData[i].Intpppearanceproduct;
        Intaromaproduct = objData[i].Intaromaproduct;
        Intcolorproduct = objData[i].Intcolorproduct;
        Inttasteproduct = objData[i].Inttasteproduct;
        Inttextureproduct = objData[i].Inttextureproduct;
        Intaw = objData[i].Txtaw;
        Intbrix = objData[i].Txtbrix;
        Intmoisture = objData[i].Txtmoisture;
        Intph = objData[i].Txtph;
        Intresidueoxygen = objData[i].Txtresidueoxygen;
        Txtremaks = objData[i].Txtremaks;
        Txtcreatedby = objData[i].Txtcreatedby;
        Dtmcreateddate = objData[i].Dtmcreateddate;

        //draw Select
        var c = ["OK", "NOT OK"];
        var summarySelect = `<select class="select2 form-select" style="width:150px;" id="selectSummarySensoryEval` + i + `" required>`;
        summarySelect += `<option value="">-</option>`;
        $.each(c, function (index, value) {
            summarySelect += `<option value="` + value + `">` + value + `</option>`;
        });
        summarySelect += `</select>`;

        //code insert ketable dengan 3 variable diatas
        var table = document.getElementById("tableSensoryEvalDetail");
        var row = table.insertRow(0);

        var numX = row.insertCell(0);
        var dtmDateEvalx = row.insertCell(1);
        var IntresidueoxygenX = row.insertCell(2);
        var IntbrixX = row.insertCell(3);
        var IntphX = row.insertCell(4);
        var IntawX = row.insertCell(5);
        var IntmoistureX = row.insertCell(6);
        var IntappearanceproductX = row.insertCell(7);
        var IntcolorproductX = row.insertCell(8);
        var IntaromaproductX = row.insertCell(9);
        var InttasteproductX = row.insertCell(10);
        var InttextureproductX = row.insertCell(11);
        var IntappearanceapplicationX = row.insertCell(12);
        var IntcolorapplicationX = row.insertCell(13);
        var IntaromaapplicationX = row.insertCell(14);
        var InttasteapplicationX = row.insertCell(15);
        var InttextureapplicationX = row.insertCell(16);
        var TxtsummaryX = row.insertCell(17);
        var TxtremaksX = row.insertCell(18);

        
        dtmDateEvalx.classList.add('col-date-evaluation');
        numX.classList.add('col-id-no');
        dtmDateEvalx.innerHTML = `<input id="Dtmdateofevaluation` + i + `" type="hidden" value="${clsGlobal.filteringText(dtmDateEval)}">` + clsGlobal.parseToDateTimeFromJSONV2(clsGlobal.filteringText(dtmDateEval), clsDateFormatV3);
        numX.innerHTML = `<input id="Intsensoryevaluationdetailid` + i + `" type="hidden" value="${num[1]}">` + `<input id="Txtcreatedby` + i + `" type="hidden" value="${Txtcreatedby}">` + `<input id="Dtmcreateddate` + i + `" type="hidden" value="${Dtmcreateddate}">` + num[0];
        IntappearanceapplicationX.innerHTML = `<input id="Intappearanceapplication` + i + `" class="form-control text-wrap" style="width:150px" type="text" value="${!clsGlobal.parseToInteger(Intappearanceapplication) ? clsGlobal.parseToString('') : clsGlobal.parseToInteger(Intappearanceapplication)}">`;
        IntaromaapplicationX.innerHTML = `<input id="Intaromaapplication` + i + `" class="form-control text-wrap" style="width:150px" type="text" value="${!clsGlobal.parseToInteger(Intaromaapplication) ? clsGlobal.parseToString('') : clsGlobal.parseToInteger(Intaromaapplication) }">`;
        IntcolorapplicationX.innerHTML = `<input id="Intcolorapplication` + i + `" class="form-control text-wrap" style="width:150px" type="text" value="${!clsGlobal.parseToInteger(Intcolorapplication) ? clsGlobal.parseToString('') : clsGlobal.parseToInteger(Intcolorapplication) }">` ;
        InttasteapplicationX.innerHTML = `<input id="Inttasteapplication` + i + `" class="form-control text-wrap" style="width:150px" type="text" value="${!clsGlobal.parseToInteger(Inttasteapplication) ? clsGlobal.parseToString('') : clsGlobal.parseToInteger(Inttasteapplication) }">`;
        InttextureapplicationX.innerHTML = `<input id="Inttextureapplication` + i + `" class="form-control text-wrap" style="width:150px" type="text" value="${!clsGlobal.parseToInteger(Inttextureapplication) ? clsGlobal.parseToString('') : clsGlobal.parseToInteger(Inttextureapplication) }">`;
        IntappearanceproductX.innerHTML = `<input id="Intappearanceproduct` + i + `" class="form-control text-wrap" style="width:150px" type="text" value="${!clsGlobal.parseToInteger(Intappearanceproduct) ? clsGlobal.parseToString('') : clsGlobal.parseToInteger(Intappearanceproduct) }">`;
        IntaromaproductX.innerHTML = `<input id="Intaromaproduct` + i + `" class="form-control text-wrap" style="width:150px" type="text" value="${!clsGlobal.parseToInteger(Intaromaproduct) ? clsGlobal.parseToString('') : clsGlobal.parseToInteger(Intaromaproduct) }">`;
        IntcolorproductX.innerHTML = `<input id="Intcolorproduct` + i + `" class="form-control text-wrap" style="width:150px" type="text" value="${!clsGlobal.parseToInteger(Intcolorproduct) ? clsGlobal.parseToString('') : clsGlobal.parseToInteger(Intcolorproduct) }">`;
        InttasteproductX.innerHTML = `<input id="Inttasteproduct` + i + `" class="form-control text-wrap" style="width:150px" type="text" value="${!clsGlobal.parseToInteger(Inttasteproduct) ? clsGlobal.parseToString('') : clsGlobal.parseToInteger(Inttasteproduct) }">`;
        InttextureproductX.innerHTML = `<input id="Inttextureproduct` + i + `" class="form-control text-wrap" style="width:150px" type="text" value="${!clsGlobal.parseToInteger(Inttextureproduct) ? clsGlobal.parseToString('') : clsGlobal.parseToInteger(Inttextureproduct)}">`;
        IntawX.innerHTML = `<input id="Intaw` + i + `" class="form-control text-wrap" style="width:150px" type="text" value="${!clsGlobal.parseToString(Intaw) ? clsGlobal.parseToString('') : clsGlobal.parseToString(Intaw)}">`;
        IntbrixX.innerHTML = `<input id="Intbrix` + i + `" class="form-control text-wrap" style="width:150px" type="text" value="${!clsGlobal.parseToString(Intbrix) ? clsGlobal.parseToString('') : clsGlobal.parseToString(Intbrix)}">`;
        IntmoistureX.innerHTML = `<input id="Intmoisture` + i + `" class="form-control text-wrap" style="width:150px" type="text" value="${!clsGlobal.parseToString(Intmoisture) ? clsGlobal.parseToString('') : clsGlobal.parseToString(Intmoisture)}">`;
        IntphX.innerHTML = `<input id="Intph` + i + `" class="form-control text-wrap" style="width:150px" type="text" value="${!clsGlobal.parseToString(Intph) ? clsGlobal.parseToString('') : clsGlobal.parseToString(Intph)}">`;
        IntresidueoxygenX.innerHTML = `<input id="Intresidueoxygen` + i + `" class="form-control text-wrap" style="width:150px" type="text" value="${!clsGlobal.parseToString(Intresidueoxygen) ? clsGlobal.parseToString('') : clsGlobal.parseToString(Intresidueoxygen)}">`;
        TxtremaksX.innerHTML = `<textarea id="Txtremaks` + i + `" class="form-control" rows="3" style="width:150px">${clsGlobal.parseToString(Txtremaks)}</textarea>`;
        TxtsummaryX.innerHTML = summarySelect;
        
        //Active Select2
        $(".select2").select2();
    }
    // Binding Data TxtSummary
    p_bindingDataTxtSummary(objData);
    // Sort List Table By Number
    sortListSensoryDetail();
}
function p_UIToDataSensoryEvaluationHeader() {
    let jsonData = [];

    let htmlJSON = $("#txtHiddenObjectSensoryEvaluation").val();
    jsonData = JSON.parse(htmlJSON);
    jsonData.objRequestData = jsonData.objData;

    jsonData.objRequestData.Intformrequestheaderid = clsGlobal.parseToInteger($("#intFormRequestHeaderId").val());
    jsonData.objRequestData.Intsensoryevaluationheaderid = clsGlobal.parseToInteger($("#Intsensoryevaluationheaderid").val());
    jsonData.objRequestData.Txtintervalevaluation = $("input[name='intervalEvalRadioButton']:checked").val();
    jsonData.objRequestData.Intnumberevaluation = clsGlobal.parseToInteger($("#txtIntervalEvaluation").val());
    jsonData.objRequestData.Txtcreatedby = clsGlobal.parseToString($("#txtCreatedBy").val());

    if (jsonData.objRequestData.Txtcreatedby === "") {
        jsonData.objRequestData.Txtcreatedby = clsGlobal.parseToString($("#txtUserLogin").val());
    } else if (jsonData.objRequestData.Txtcreatedby === clsGlobal.parseToString($("#txtUserLogin").val()) || jsonData.objRequestData.Txtcreatedby != null) {
        jsonData.objRequestData.Txtupdatedby = clsGlobal.parseToString($("#txtUserLogin").val());
    }

    return JSON.stringify(jsonData);
}
function p_UIToDataSensoryEvaluationDetail() {
    // Getting Object SensoryEvalDetail
    let sensoryEvalDat = {};
    let jsonData = [];
    let htmlJSON = $("#txtHiddenObjectSensoryEvaluationDetail").val();
    jsonData = JSON.parse(htmlJSON);
    sensoryEvalDat = jsonData.objData;

    // Looping Data in Table
    var list, b, i;
    list = document.getElementById("tableSensoryEvalDetail");
    b = list.getElementsByTagName("TR");
    
    // Sample Payload
    let JsonPayload = [];
    
    for (i = 0; i < b.length; i++) {
        sensoryEvalDat = jsonData.objData;
        sensoryEvalDat.Dtmdateofevaluation = $("#Dtmdateofevaluation" + i).val();
        sensoryEvalDat.Intappearanceapplication = clsGlobal.parseToInteger($("#Intappearanceapplication" + i).val());
        sensoryEvalDat.Intaromaapplication = clsGlobal.parseToInteger($("#Intaromaapplication" + i).val());
        sensoryEvalDat.Intaromaproduct = clsGlobal.parseToInteger($("#Intaromaproduct" + i).val());
        sensoryEvalDat.Txtaw = clsGlobal.parseToString($("#Intaw" + i).val());
        sensoryEvalDat.Txtbrix = clsGlobal.parseToString($("#Intbrix" + i).val());
        sensoryEvalDat.Intcolorapplication = clsGlobal.parseToInteger($("#Intcolorapplication" + i).val());
        sensoryEvalDat.Intcolorproduct = clsGlobal.parseToInteger($("#Intcolorproduct" + i).val());
        sensoryEvalDat.Txtmoisture = clsGlobal.parseToString($("#Intmoisture" + i).val());
        sensoryEvalDat.Txtph = clsGlobal.parseToString($("#Intph" + i).val());
        sensoryEvalDat.Intpppearanceproduct = clsGlobal.parseToInteger($("#Intappearanceproduct" + i).val());
        sensoryEvalDat.Txtresidueoxygen = clsGlobal.parseToString($("#Intresidueoxygen" + i).val());
        sensoryEvalDat.Intsensoryevaluationdetailid = clsGlobal.parseToInteger($("#Intsensoryevaluationdetailid" + i).val());
        sensoryEvalDat.Intsensoryevaluationheaderid = clsGlobal.parseToInteger($("#Intsensoryevaluationheaderid").val());
        sensoryEvalDat.Inttasteapplication = clsGlobal.parseToInteger($("#Inttasteapplication" + i).val());
        sensoryEvalDat.Inttasteproduct = clsGlobal.parseToInteger($("#Inttasteproduct" + i).val());
        sensoryEvalDat.Inttextureapplication = clsGlobal.parseToInteger($("#Inttextureapplication" + i).val());
        sensoryEvalDat.Inttextureproduct = clsGlobal.parseToInteger($("#Inttextureproduct" + i).val());
        sensoryEvalDat.Txtremaks = clsGlobal.parseToString($("#Txtremaks" + i).val());
        sensoryEvalDat.Txtsummary = clsGlobal.parseToString($("#selectSummarySensoryEval" + i).find(":selected").val());
        sensoryEvalDat.Dtmcreateddate = clsGlobal.parseToString($("#Dtmcreateddate" + i).val());

        if (sensoryEvalDat.Txtcreatedby === "") {
            sensoryEvalDat.Txtcreatedby = clsGlobal.parseToString($("#Txtcreatedby" + i).val());
            sensoryEvalDat.Txtupdatedby = clsGlobal.parseToString($("#txtUserLogin").val());
        }
        JsonPayload.push(Object.assign({}, sensoryEvalDat));
    }
    return JSON.stringify(JsonPayload);
}

//=================================
// FORM PHYSICAL & CHEMICAL
//=================================
function p_initiateDataPhysicalChemical() {
    $.ajax({
        type: "GET",
        url: ApiUrl + "api/1/FormPhysicalChemical/initiateDataFormPhysicalChemicalHeader",
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        async: false,
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                p_dataToUIPyhsicalChemical(retDat.objData);
                $("#txtHiddenObjectPhysicalChemicalHeader").val(JSON.stringify(retDat));
                setItemSessionStorage("hiddenObjectPhyCheHeader", JSON.stringify(retDat));
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_initiateDataPhysicalChemicalDetail() {
    $.ajax({
        type: "GET",
        url: ApiUrl + "api/1/FormPhysicalChemical/initiateDataFormPhysicalChemicalDetail",
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        async: false,
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                $("#txtHiddenObjectPhysicalChemicalDetail").val(JSON.stringify(retDat));
                setItemSessionStorage("hiddenObjectPhyCheDet", JSON.stringify(retDat));
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_dataToUIPyhsicalChemical(objData) {
    

    $("#IntPhysicalChemicalHeaderid").val(clsGlobal.parseToString(objData.Intphysicalchemicalheaderid));

    if (objData.Txtintervalevaluationvalue != null || clsGlobal.parseToString(objData.Txtintervalevaluationvalue) != "") {
        $("#txtIntervalEvaluationPhy").val(clsGlobal.parseToString(objData.Txtintervalevaluationvalue));
    }

    if (objData.Intnumberevaluation > 0) {
        $("#txtNumberOfEvaluationPhy").val(clsGlobal.parseToString(objData.Intnumberevaluation));
    }

    if (clsGlobal.parseToInteger(objData.Intphysicalchemicalheaderid) !== 0 && objData.Txtintervalevaluation !== null) {
        $("input[name='IntervalPhyEvalRadioButton']").filter(`[value=${objData.Txtintervalevaluation}]`).prop('checked', true);
    }

    if (clsGlobal.parseToString(objData.Txtparameter) !== "") {
        $("#selectParameterFormPhysicalChemical").val(clsGlobal.parseToString(objData.Txtparameter).split(","));
        $('#selectParameterFormPhysicalChemical').trigger('change');
    } else {
        $("#selectParameterFormPhysicalChemical").val(clsGlobal.parseToString(""));
        $('#selectParameterFormPhysicalChemical').trigger('change');
    }

    $("#txtCreatedByPhysicalChemicalHeader").val(clsGlobal.parseToString(objData.Txtcreatedby));
    $("#txtUpdatedByPhysicalChemicalHeader").val(clsGlobal.parseToString(objData.Txtupdatedby));
}
function p_UIToDataPhysicalChemical() {
    let jsonData = [];
    let txtParam = [];

    // Looping Array Parameter
    $.each($("#selectParameterFormPhysicalChemical").find(":selected"), function (index, item) {
        txtParam.push(item.value);
    });

    let htmlJSON = $("#txtHiddenObjectPhysicalChemicalHeader").val();
    jsonData = JSON.parse(htmlJSON);
    jsonData.objRequestData = jsonData.objData;

    jsonData.objRequestData.Intformrequestheaderid = clsGlobal.parseToInteger($("#intFormRequestHeaderId").val());
    jsonData.objRequestData.Intphysicalchemicalheaderid = clsGlobal.parseToInteger($("#IntPhysicalChemicalHeaderid").val());
    jsonData.objRequestData.Txtintervalevaluationvalue = clsGlobal.parseToString($("#txtIntervalEvaluationPhy").val());
    jsonData.objRequestData.Txtintervalevaluation = $("input[name='IntervalPhyEvalRadioButton']:checked").val();
    jsonData.objRequestData.Intnumberevaluation = clsGlobal.parseToInteger($("#txtNumberOfEvaluationPhy").val());
    jsonData.objRequestData.Txtparameter = clsGlobal.parseToString(txtParam);
    jsonData.objRequestData.Txtcreatedby = clsGlobal.parseToString($("#txtCreatedBy").val());

    if (jsonData.objRequestData.Txtcreatedby === "") {
        jsonData.objRequestData.Txtcreatedby = clsGlobal.parseToString($("#txtUserLogin").val());
    } else if (jsonData.objRequestData.Txtcreatedby === clsGlobal.parseToString($("#txtUserLogin").val()) || jsonData.objRequestData.Txtcreatedby != null) {
        jsonData.objRequestData.Txtupdatedby = clsGlobal.parseToString($("#txtUserLogin").val());
    }

    return JSON.stringify(jsonData);
}
function p_renderHeadertablePhy(objData) {
    const htmlHeadertable = document.getElementById('table-phyCheEvalHeader');
    htmlHeadertable.classList.add('align-middle');
    var row = htmlHeadertable.insertRow();
    var NoX = row.insertCell();
    var ParamX = row.insertCell();
    var MethodX = row.insertCell();
    var UomX = row.insertCell();
    var MinX = row.insertCell();
    var MaxX = row.insertCell();
    var TargetX = row.insertCell();
    var DtmEvalX = row.insertCell();
    var SummaryX = row.insertCell();
    var RemarksX = row.insertCell();

    // Render Header
    NoX.innerText = "NO";
    ParamX.innerText = "PARAMETER";
    MethodX.innerText = "METHOD";
    UomX.innerText = "UOM";
    MinX.innerText = "MIN";
    MaxX.innerText = "MAX";
    TargetX.innerText = "TARGET";
    DtmEvalX.innerText = "DATE OF EVALUATION";
    DtmEvalX.id = "dtmEvalPhyChe";
    SummaryX.innerText = "SUMMARY";
    RemarksX.innerText = "REMARKS";

    // Set Attribute Scope
    NoX.setAttribute('scope', 'col');
    ParamX.setAttribute('scope', 'col');
    MethodX.setAttribute('scope', 'col');
    UomX.setAttribute('scope', 'col');
    MinX.setAttribute('scope', 'col');
    MaxX.setAttribute('scope', 'col');
    TargetX.setAttribute('scope', 'col');
    DtmEvalX.setAttribute('scope', 'rowgroup');
    SummaryX.setAttribute('scope', 'col');
    RemarksX.setAttribute('scope', 'col');

    // Set Attribute RowSpan
    NoX.setAttribute('rowspan', '2');
    ParamX.setAttribute('rowspan', '2');
    MethodX.setAttribute('rowspan', '2');
    UomX.setAttribute('rowspan', '2');
    MinX.setAttribute('rowspan', '2');
    MaxX.setAttribute('rowspan', '2');
    TargetX.setAttribute('rowspan', '2');
    DtmEvalX.setAttribute('colspan', '0');
    SummaryX.setAttribute('rowspan', '2');
    RemarksX.setAttribute('rowspan', '2');

    // Set Attribute Style
    NoX.setAttribute('style', 'min-width: 75px; width: 75px');
    ParamX.setAttribute('style', 'min-width: 90px; width: 90px');
    MethodX.setAttribute('style', 'min-width: 120px; width: 120px');

    // Set Attribute RowSpan
    NoX.classList.add('text-nowrap', 'text-center', 'table-primary', 'fixed-header', 'col-id-no');
    ParamX.classList.add('text-nowrap', 'text-center', 'table-primary', 'fixed-header', 'col-parameter-name');
    MethodX.classList.add('text-nowrap', 'text-center', 'table-primary', 'fixed-header', 'col-parameter-method');
    UomX.classList.add('text-nowrap', 'text-center', 'table-primary');
    MinX.classList.add('text-nowrap', 'text-center', 'table-primary');
    MaxX.classList.add('text-nowrap', 'text-center', 'table-primary');
    TargetX.classList.add('text-nowrap', 'text-center', 'table-primary');
    DtmEvalX.classList.add('text-nowrap', 'text-center', 'table-primary');
    SummaryX.classList.add('text-nowrap', 'text-center', 'table-primary');
    RemarksX.classList.add('text-nowrap', 'text-center', 'table-primary');

    //Inisiasi Data Date of Evaluation
    let dtmEval = [];
    for (let x in objData) {
        dtmEval.push(objData[x].Dtmdateofevaluation);
    }
    dtmEval = [...new Set(dtmEval)];

    var numberEval = clsGlobal.parseToInteger($("#txtNumberOfEvaluationPhy").val());

    //Render Tanggal Eval
    const dtmEvalHeader = document.getElementById('dtmEvalPhyChe');
    dtmEvalHeader.setAttribute('colspan', dtmEval.length);
    const newTr = document.createElement('tr');
    htmlHeadertable.appendChild(newTr);
    for (let [i, x] of dtmEval.entries()) {
        if (numberEval === 2) {
            if (i === 0 || i === dtmEval.length - 1) {
                let newTh = document.createElement('th');
                newTh.innerText = clsGlobal.parseToDateTimeFromJSONV2(x, clsDateFormatV3);
                newTh.classList.add('text-nowrap', 'bg-danger', 'text-white');
                newTh.setAttribute('style', 'text-align:center; vertical-align:middle')
                newTr.appendChild(newTh);
            }
            else {
                let newTh = document.createElement('th');
                newTh.innerText = clsGlobal.parseToDateTimeFromJSONV2(x, clsDateFormatV3);
                newTh.classList.add('text-nowrap');
                newTh.setAttribute('style', 'text-align:center; vertical-align:middle')
                newTr.appendChild(newTh);
            }
        }
        else {
            if (i === 0 || i === dtmEval.length - 1 || i === Math.round(dtmEval.length / 2) - 1) {
                let newTh = document.createElement('th');
                newTh.innerText = clsGlobal.parseToDateTimeFromJSONV2(x, clsDateFormatV3);
                newTh.classList.add('text-nowrap', 'bg-danger', 'text-white');
                newTh.setAttribute('style', 'text-align:center; vertical-align:middle')
                newTr.appendChild(newTh);
            }
            else {
                let newTh = document.createElement('th');
                newTh.innerText = clsGlobal.parseToDateTimeFromJSONV2(x, clsDateFormatV3);
                newTh.classList.add('text-nowrap');
                newTh.setAttribute('style', 'text-align:center; vertical-align:middle')
                newTr.appendChild(newTh);
            }
        }
    }
}
function p_renderDetailTablePhy(objData) {
    //Inisiasi Data Parameter
    let paramName = [];
    for (let x in objData) {
        paramName.push(objData[x].Txtparametername);
    }
    paramName = [...new Set(paramName)];

    //Render All Table
    var Table = document.getElementById('table-phyCheEvalBody');
    if (objData.length > 0) {
        Table.innerHTML = "";
    }

    document.getElementById("table-phyCheEvalBody").style.textAlign = "center";

    let Dtmdateofevaluation = "";
    let num = 0;
    let intIntmicrobiologydetailid = "";
    let Intmicrobiologyheaderid = "";
    let Intparameterid = "";
    let Txtmax = "";
    let Txtmethod = "";
    let Txtmin = "";
    let Txtparametername = "";
    let Txtremarks = "";
    let Txtsummary = "";
    let Txttarget = "";
    let Txtuom = "";
    let Txtcreatedby = "";
    let Dtmcreateddate = "";
    let TempParamId = "";
    let TempDtmeval = "";
    let TxtValue = "";

    for (let i = 0; i < objData.length; i++) {
        Dtmdateofevaluation = clsGlobal.parseToString(objData[i].Dtmdateofevaluation);
        intIntmicrobiologydetailid = clsGlobal.parseToString(objData[i].Intmicrobiologydetailid);
        Intmicrobiologyheaderid = clsGlobal.parseToString(objData[i].Intmicrobiologyheaderid);
        Intparameterid = clsGlobal.parseToString(objData[i].Intparameterid);
        Txtmax = clsGlobal.parseToString(objData[i].Txtmax);
        Txtmethod = clsGlobal.parseToString(objData[i].Txtmethod);
        Txtmin = clsGlobal.parseToString(objData[i].Txtmin);
        Txtparametername = clsGlobal.parseToString(objData[i].Txtparametername);
        Txtremarks = clsGlobal.parseToString(objData[i].Txtremarks);
        Txtsummary = clsGlobal.parseToString(objData[i].Txtsummary);
        Txttarget = clsGlobal.parseToString(objData[i].Txttarget);
        Txtuom = clsGlobal.parseToString(objData[i].Txtuom);
        Txtcreatedby = clsGlobal.parseToString(objData[i].Txtcreatedby);
        Dtmcreateddate = clsGlobal.parseToString(objData[i].Dtmcreateddate);
        TxtValue = clsGlobal.parseToString(objData[i].Txtvalue);

        if (Intparameterid !== TempParamId) {

            var table = document.getElementById("table-phyCheEvalBody");
            var row = table.insertRow();
            row.setAttribute('id', `phyCheDetail${i}`)
            row.className = 'phyCheDetail';
            var numX = row.insertCell(0);
            var ParameterX = row.insertCell(1);
            var MethodX = row.insertCell(2);
            var UomX = row.insertCell(3);
            var MinX = row.insertCell(4);
            var MaxX = row.insertCell(5);
            var TargetX = row.insertCell(6);

            numX.innerText = num + 1;
            numX.classList.add('col-id-no');

            ParameterX.innerHTML = `<input type="hidden" id="txtParamIdPhyChe${num}" value="${Intparameterid}">${Txtparametername}`;;
            ParameterX.classList.add('text-nowrap', 'text-start', 'col-parameter-name');

            MethodX.innerText = Txtmethod;
            MethodX.classList.add('text-nowrap', 'col-parameter-method');

            UomX.innerText = Txtuom;
            UomX.classList.add('text-nowrap');

            MinX.innerHTML = `<input id="TxtMinPhyChe` + num + `" class="form-control text-wrap" style="width:100px" type="text" value="${!clsGlobal.parseToString(Txtmin) ? clsGlobal.parseToString('') : clsGlobal.parseToString(Txtmin)}">`
            MaxX.innerHTML = `<input id="TxtMaxPhyChe` + num + `" class="form-control text-wrap" style="width:100px" type="text" value="${!clsGlobal.parseToString(Txtmax) ? clsGlobal.parseToString('') : clsGlobal.parseToString(Txtmax)}">`
            TargetX.innerHTML = `<input id="TxtTagetPhyChe` + num + `" class="form-control text-wrap" style="width:100px" type="text" value="${!clsGlobal.parseToString(Txttarget) ? clsGlobal.parseToString('') : clsGlobal.parseToString(Txttarget)}">`

            //Change Value ParamId
            TempParamId = Intparameterid;
            num += 1;
        }
    }

    //Render Value
    var rowZ = document.getElementsByClassName("phyCheDetail");
    for (let z = 0; z < rowZ.length; z++) {
        for (let y = 0; y < objData.length; y++) {
            Dtmdateofevaluation = clsGlobal.parseToString(objData[y].Dtmdateofevaluation);
            intIntmicrobiologydetailid = clsGlobal.parseToString(objData[y].Intmicrobiologydetailid);
            Intmicrobiologyheaderid = clsGlobal.parseToString(objData[y].Intmicrobiologyheaderid);
            Intparameterid = clsGlobal.parseToString(objData[y].Intparameterid);
            Txtmax = clsGlobal.parseToString(objData[y].Txtmax);
            Txtmethod = clsGlobal.parseToString(objData[y].Txtmethod);
            Txtmin = clsGlobal.parseToString(objData[y].Txtmin);
            Txtparametername = clsGlobal.parseToString(objData[y].Txtparametername);
            Txtremarks = clsGlobal.parseToString(objData[y].Txtremarks);
            Txtsummary = clsGlobal.parseToString(objData[y].Txtsummary);
            Txttarget = clsGlobal.parseToString(objData[y].Txttarget);
            Txtuom = clsGlobal.parseToString(objData[y].Txtuom);
            Txtcreatedby = clsGlobal.parseToString(objData[y].Txtcreatedby);
            Dtmcreateddate = clsGlobal.parseToString(objData[y].Dtmcreateddate);
            TxtValue = clsGlobal.parseToString(objData[y].Txtvalue);

            if (rowZ[z].cells[1].innerText === Txtparametername) {
                var rowY = document.getElementById(`${rowZ[z].id}`);
                var TxtValueX = rowY.insertCell();
                TxtValueX.id = `${Dtmdateofevaluation}`
                TxtValueX.innerHTML = `<input id="TxtValuePhyCheParam` + y + `" class="form-control text-wrap" style="width:100px" type="text" value="${!clsGlobal.parseToString(TxtValue) ? clsGlobal.parseToString('') : clsGlobal.parseToString(TxtValue)}">` + `<input type="hidden" id="txtParamIdPhyChe${y}" value="${Intparameterid}">` + `<input type="hidden" id="txtParamIdPhyChe${y}" value="${Dtmdateofevaluation}">`;
                TxtValueX.classList.add('dtmEvalPhysicalChemical');
            }
        }
    }


    let TempParamIdParam = "";
    let numLoop3 = 0;

    for (let c = 0; c < objData.length; c++) {
        Intparameterid = clsGlobal.parseToString(objData[c].Intparameterid);
        Txtparametername = clsGlobal.parseToString(objData[c].Txtparametername);
        Txtremarks = clsGlobal.parseToString(objData[c].Txtremarks);
        Txtsummary = clsGlobal.parseToString(objData[c].Txtsummary);

        
        if (Intparameterid !== TempParamIdParam) {
            for (let a = 0; a < rowZ.length; a++) {
                //draw Select
                var n = ["OK", "NOT OK"];
                var summarySelect = `<select class="select2 form-select" style="width:150px;" id="selectSummaryPhysicalChemical` + numLoop3 + `" style="width:150px;" required>`;
                summarySelect += `<option value="">-</option>`;
                $.each(n, function (index, value) {
                    summarySelect += `<option value="` + value + `">` + value + `</option>`;
                });
                summarySelect += `</select>`;

                if (rowZ[a].cells[1].innerText === Txtparametername) {
                    var rowY = document.getElementById(`${rowZ[a].id}`);
                    var TxtSummaryX = rowY.insertCell();
                    var TxtRemarksX = rowY.insertCell();
                    TxtRemarksX.innerHTML = `<textarea id="TxtremarksPhyChe` + numLoop3 + `" class="form-control" rows="3" style="width:150px">${clsGlobal.parseToString(Txtremarks)}</textarea>`;
                    TxtSummaryX.innerHTML = summarySelect;

                    //Active Select2
                    $(".select2").select2();
                    numLoop3 += 1;
                }
            }
            //Change Value ParamId
            TempParamIdParam = Intparameterid;
        }
    }
    //sorting List Table
    sortListPhysicalChemical();
}
function p_bindingDataTxtSummaryPhysicalChemical(objData) {
    var list, i, x;
    list = document.getElementsByClassName("phyCheDetail");

    for (i = 0; i < list.length; i++) {
        for (x = 0; x < objData.length; x++) {
            if (list[i].cells[1].innerText === clsGlobal.parseToString(objData[x].Txtparametername)) {
                if (objData[x].Txtsummary !== null) {
                    $('#selectSummaryPhysicalChemical' + i).val(clsGlobal.parseToString(objData[x].Txtsummary)).trigger("change");
                } else {
                    $('#selectSummaryPhysicalChemical' + i).val("-").trigger("change");
                }
            }
        }
    }
}
function p_dataToUIPhysicalChemicalDetail(objData) {
    const htmlHeadertable = document.getElementById('table-phyCheEvalHeader');
    htmlHeadertable.innerHTML = "";

    p_renderHeadertablePhy(objData);
    p_renderDetailTablePhy(objData);
    p_bindingDataTxtSummaryPhysicalChemical(objData);

    $("#txtHiddenObjectPhysicalChemicalDetail").val(JSON.stringify(objData));

}
function p_UIToDataPhysicalChemicalDetail() {
    // Getting Object Physical Chemical
    var listDtmEvalMicro, b, i, j, x;
    let jsonData = [];
    let htmlJSON = $("#txtHiddenObjectPhysicalChemicalDetail").val();
    jsonData = JSON.parse(htmlJSON);
    var table = document.getElementsByClassName("phyCheDetail");

    listDtmEvalMicro = document.getElementsByClassName("dtmEvalPhysicalChemical");

    //AddedData Min, Max, Target, Summary, Remarks
    for (i = 0; i < jsonData.length; i++) {
        for (j = 0; j < table.length; j++) {
            if (table[j].cells[1].innerText === jsonData[i].Txtparametername) {
                jsonData[i].Txtmin = clsGlobal.parseToString($(`#TxtMinPhyChe${j}`).val());
                jsonData[i].Txtmax = clsGlobal.parseToString($(`#TxtMaxPhyChe${j}`).val());
                jsonData[i].Txttarget = clsGlobal.parseToString($(`#TxtTagetPhyChe${j}`).val());
                jsonData[i].Txtsummary = clsGlobal.parseToString($("#selectSummaryPhysicalChemical" + j).find(":selected").val());
                jsonData[i].Txtremarks = clsGlobal.parseToString($(`#TxtremarksPhyChe${j}`).val());
                jsonData[i].Txtupdatedby = clsGlobal.parseToString($("#txtUserLogin").val());
            }
        }
    }

    //AddedData Value
    for (b = 0; b < listDtmEvalMicro.length; b++) {
        for (x = 0; x < jsonData.length; x++) {
            if ($(`#txtParamIdPhyChe${b}`).val() === clsGlobal.parseToString(jsonData[x].Intparameterid)) {
                if (listDtmEvalMicro[b].id === jsonData[x].Dtmdateofevaluation) {
                    jsonData[x].Txtvalue = clsGlobal.parseToString($(`#TxtValuePhyCheParam${b}`).val());
                }
            }
        }
    }
    return JSON.stringify(jsonData);
}

//=================================
// FORM MICROBIOLOGY
//=================================
function p_initiateDataMicrobiologyHeader() {
    $.ajax({
        type: "GET",
        url: ApiUrl + "api/1/FormMicrobiology/initiateDataFormMicrobiologyHeader",
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        async: false,
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                p_dataToUIMicrobiologyHeader(retDat.objData);
                $("#txtHiddenObjectMicrobiologyHeader").val(JSON.stringify(retDat));
                setItemSessionStorage("hiddenObjectMicroHeader", JSON.stringify(retDat));
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_initiateDataMicrobiologyDetail() {
    $.ajax({
        type: "GET",
        url: ApiUrl + "api/1/FormMicrobiology/initiateDataFormMicrobiologyDetail",
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        async: false,
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                $("#txtHiddenObjectMicrobiologyDetail").val(JSON.stringify(retDat));
                setItemSessionStorage("hiddenObjectMicroDet", JSON.stringify(retDat));
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_dataToUIMicrobiologyHeader(objData) {
    

    $("#IntMicrobiologyHeaderid").val(clsGlobal.parseToString(objData.Intmicrobiologyheaderid));

    if (objData.Txtintervalevaluationvalue != null || clsGlobal.parseToString(objData.Txtintervalevaluationvalue) != "") {
        $("#txtIntervalEvaluationMicro").val(clsGlobal.parseToString(objData.Txtintervalevaluationvalue));
    }

    if (objData.Intnumberevaluation > 0) {
        $("#txtNumberOfEvaluationMicro").val(clsGlobal.parseToString(objData.Intnumberevaluation));
    }

    if (clsGlobal.parseToInteger(objData.Intmicrobiologyheaderid) !== 0 && objData.Txtintervalevaluation !== null) {
        $("input[name='IntervalMicroRadioButton']").filter(`[value=${objData.Txtintervalevaluation}]`).prop('checked', true);
    }

    if (clsGlobal.parseToString(objData.Txtparameter) !== "") {
        $("#selectParameterFormMicrobiology").val(clsGlobal.parseToString(objData.Txtparameter).split(","));
        $('#selectParameterFormMicrobiology').trigger('change');
    } else {
        $("#selectParameterFormMicrobiology").val(clsGlobal.parseToString(""));
        $('#selectParameterFormMicrobiology').trigger('change');
    }

    $("#txtCreatedByMicrobiologyHeader").val(clsGlobal.parseToString(objData.Txtcreatedby));
    $("#txtUpdatedByMicrobiologyHeader").val(clsGlobal.parseToString(objData.Txtupdatedby));
}
function p_UIToDataMicrobiologyHeader() {
    let jsonData = [];
    let txtParam = [];

    // Looping Param Micro
    $.each($("#selectParameterFormMicrobiology").find(":selected"), function (index, item) {
        txtParam.push(item.value);
    });


    let htmlJSON = $("#txtHiddenObjectMicrobiologyHeader").val();
    jsonData = JSON.parse(htmlJSON);
    jsonData.objRequestData = jsonData.objData;

    jsonData.objRequestData.Intformrequestheaderid = clsGlobal.parseToInteger($("#intFormRequestHeaderId").val());
    jsonData.objRequestData.Intmicrobiologyheaderid = clsGlobal.parseToInteger($("#IntMicrobiologyHeaderid").val());
    jsonData.objRequestData.Txtintervalevaluationvalue = clsGlobal.parseToString($("#txtIntervalEvaluationMicro").val());
    jsonData.objRequestData.Txtintervalevaluation = $("input[name='IntervalMicroRadioButton']:checked").val();
    jsonData.objRequestData.Intnumberevaluation = clsGlobal.parseToInteger($("#txtNumberOfEvaluationMicro").val());
    jsonData.objRequestData.Txtparameter = clsGlobal.parseToString(txtParam);
    jsonData.objRequestData.Txtcreatedby = clsGlobal.parseToString($("#txtCreatedBy").val());

    if (jsonData.objRequestData.Txtcreatedby === "") {
        jsonData.objRequestData.Txtcreatedby = clsGlobal.parseToString($("#txtUserLogin").val());
    } else if (jsonData.objRequestData.Txtcreatedby === clsGlobal.parseToString($("#txtUserLogin").val()) || jsonData.objRequestData.Txtcreatedby != null) {
        jsonData.objRequestData.Txtupdatedby = clsGlobal.parseToString($("#txtUserLogin").val());
    }

    return JSON.stringify(jsonData);
}
function p_renderHeadertableMicro(objData) {
    const htmlHeadertable = document.getElementById('table-microBiologyHeader');
    htmlHeadertable.classList.add('align-middle');
    var row = htmlHeadertable.insertRow();
    var NoX = row.insertCell();
    var ParamX = row.insertCell();
    var MethodX = row.insertCell();
    var UomX = row.insertCell();
    var MinX = row.insertCell();
    var MaxX = row.insertCell();
    var TargetX = row.insertCell();
    var DtmEvalX = row.insertCell();
    var SummaryX = row.insertCell();
    var RemarksX = row.insertCell();

    // Render Header
    NoX.innerText = "NO";
    ParamX.innerText = "PARAMETER";
    MethodX.innerText = "METHOD";
    UomX.innerText = "UOM";
    MinX.innerText = "MIN";
    MaxX.innerText = "MAX";
    TargetX.innerText = "TARGET";
    DtmEvalX.innerText = "DATE OF EVALUATION";
    DtmEvalX.id = "dtmEvalMicro";
    SummaryX.innerText = "SUMMARY";
    RemarksX.innerText = "REMARKS";

    // Set Attribute Scope
    NoX.setAttribute('scope', 'col');
    ParamX.setAttribute('scope', 'col');
    MethodX.setAttribute('scope', 'col');
    UomX.setAttribute('scope', 'col');
    MinX.setAttribute('scope', 'col');
    MaxX.setAttribute('scope', 'col');
    TargetX.setAttribute('scope', 'col');
    DtmEvalX.setAttribute('scope', 'rowgroup');
    SummaryX.setAttribute('scope', 'col');
    RemarksX.setAttribute('scope', 'col');

    // Set Attribute Style
    NoX.setAttribute('style', 'min-width: 75px; width: 75px');
    ParamX.setAttribute('style', 'min-width: 90px; width: 90px');
    MethodX.setAttribute('style', 'min-width: 120px; width: 120px');

    // Set Attribute RowSpan
    NoX.setAttribute('rowspan', '2');
    ParamX.setAttribute('rowspan', '2');
    MethodX.setAttribute('rowspan', '2');
    UomX.setAttribute('rowspan', '2');
    MinX.setAttribute('rowspan', '2');
    MaxX.setAttribute('rowspan', '2');
    TargetX.setAttribute('rowspan', '2');
    DtmEvalX.setAttribute('colspan', '0');
    SummaryX.setAttribute('rowspan', '2');
    RemarksX.setAttribute('rowspan', '2');

    // Set Attribute RowSpan
    NoX.classList.add('text-nowrap', 'text-center', 'table-primary', 'fixed-header', 'col-id-no');
    ParamX.classList.add('text-nowrap', 'text-center', 'table-primary', 'fixed-header', 'col-parameter-name');
    MethodX.classList.add('text-nowrap', 'text-center', 'table-primary', 'fixed-header', 'col-parameter-method');
    UomX.classList.add('text-nowrap', 'text-center', 'table-primary');
    MinX.classList.add('text-nowrap', 'text-center', 'table-primary');
    MaxX.classList.add('text-nowrap', 'text-center', 'table-primary');
    TargetX.classList.add('text-nowrap', 'text-center', 'table-primary');
    DtmEvalX.classList.add('text-nowrap', 'text-center', 'table-primary');
    SummaryX.classList.add('text-nowrap', 'text-center', 'table-primary');
    RemarksX.classList.add('text-nowrap', 'text-center', 'table-primary');

    //Inisiasi Data Date of Evaluation
    let dtmEval = [];
    for (let x in objData) {
        dtmEval.push(objData[x].Dtmdateofevaluation);
    }
    dtmEval = [...new Set(dtmEval)];

    var numberEval = clsGlobal.parseToInteger($("#txtNumberOfEvaluationMicro").val());

    //Render Tanggal Eval
    const dtmEvalHeader = document.getElementById('dtmEvalMicro');
    dtmEvalHeader.setAttribute('colspan', dtmEval.length);
    const newTr = document.createElement('tr');
    htmlHeadertable.appendChild(newTr);
    for (let [i, x] of dtmEval.entries()) {
        if (numberEval === 2) {
            if (i === 0 || i === dtmEval.length - 1) {
                let newTh = document.createElement('th');
                newTh.innerText = clsGlobal.parseToDateTimeFromJSONV2(x, clsDateFormatV3);
                newTh.classList.add('text-nowrap', 'bg-danger', 'text-white');
                newTh.setAttribute('style', 'text-align:center; vertical-align:middle')
                newTr.appendChild(newTh);
            }
            else {
                let newTh = document.createElement('th');
                newTh.innerText = clsGlobal.parseToDateTimeFromJSONV2(x, clsDateFormatV3);
                newTh.classList.add('text-nowrap');
                newTh.setAttribute('style', 'text-align:center; vertical-align:middle')
                newTr.appendChild(newTh);
            }
        }
        else {
            if (i === 0 || i === dtmEval.length - 1 || i === Math.round(dtmEval.length / 2) - 1) {
                let newTh = document.createElement('th');
                newTh.innerText = clsGlobal.parseToDateTimeFromJSONV2(x, clsDateFormatV3);
                newTh.classList.add('text-nowrap', 'bg-danger', 'text-white');
                newTh.setAttribute('style', 'text-align:center; vertical-align:middle')
                newTr.appendChild(newTh);
            }
            else {
                let newTh = document.createElement('th');
                newTh.innerText = clsGlobal.parseToDateTimeFromJSONV2(x, clsDateFormatV3);
                newTh.classList.add('text-nowrap');
                newTh.setAttribute('style', 'text-align:center; vertical-align:middle')
                newTr.appendChild(newTh);
            }
        }
    }
}
function p_renderDetailTableMicro(objData) {
    //Inisiasi Data Parameter
    let paramName = [];
    for (let x in objData) {
        paramName.push(objData[x].Txtparametername);
    }
    paramName = [...new Set(paramName)];

    //Render All Table
    var Table = document.getElementById('table-microBiologyBody');
    if (objData.length > 0) {
        Table.innerHTML = "";
    }

    document.getElementById("table-microBiologyBody").style.textAlign = "center";

    let Dtmdateofevaluation = "";
    let num = 0;
    let intIntmicrobiologydetailid = "";
    let Intmicrobiologyheaderid = "";
    let Intparameterid = "";
    let Txtmax = "";
    let Txtmethod = "";
    let Txtmin = "";
    let Txtparametername = "";
    let Txtremarks = "";
    let Txtsummary = "";
    let Txttarget = "";
    let Txtuom = "";
    let Txtcreatedby = "";
    let Dtmcreateddate = "";
    let TempParamId = "";
    let TempDtmeval = "";
    let TxtValue = "";

    for (let i = 0; i < objData.length; i++) {
        Dtmdateofevaluation = clsGlobal.parseToString(objData[i].Dtmdateofevaluation);
        intIntmicrobiologydetailid = clsGlobal.parseToString(objData[i].Intmicrobiologydetailid);
        Intmicrobiologyheaderid = clsGlobal.parseToString(objData[i].Intmicrobiologyheaderid);
        Intparameterid = clsGlobal.parseToString(objData[i].Intparameterid);
        Txtmax = clsGlobal.parseToString(objData[i].Txtmax);
        Txtmethod = clsGlobal.parseToString(objData[i].Txtmethod);
        Txtmin = clsGlobal.parseToString(objData[i].Txtmin);
        Txtparametername = clsGlobal.parseToString(objData[i].Txtparametername);
        Txtremarks = clsGlobal.parseToString(objData[i].Txtremarks);
        Txtsummary = clsGlobal.parseToString(objData[i].Txtsummary);
        Txttarget = clsGlobal.parseToString(objData[i].Txttarget);
        Txtuom = clsGlobal.parseToString(objData[i].Txtuom);
        Txtcreatedby = clsGlobal.parseToString(objData[i].Txtcreatedby);
        Dtmcreateddate = clsGlobal.parseToString(objData[i].Dtmcreateddate);
        TxtValue = clsGlobal.parseToString(objData[i].Txtvalue);

        if (Intparameterid !== TempParamId) {

            var table = document.getElementById("table-microBiologyBody");
            var row = table.insertRow();
            row.setAttribute('id', `microDetail${i}`)
            row.className = 'microDetail';
            var numX = row.insertCell(0);
            var ParameterX = row.insertCell(1);
            var MethodX = row.insertCell(2);
            var UomX = row.insertCell(3);
            var MinX = row.insertCell(4);
            var MaxX = row.insertCell(5);
            var TargetX = row.insertCell(6);

            numX.innerText = num + 1;
            numX.classList.add('col-id-no');

            ParameterX.innerHTML = `<input type="hidden" id="txtParamIdMicro${num}" value="${Intparameterid}">${Txtparametername}`;
            ParameterX.classList.add('text-nowrap', 'text-start', 'col-parameter-name');

            MethodX.innerText = Txtmethod;
            MethodX.classList.add('text-nowrap', 'col-parameter-method');

            UomX.innerText = Txtuom;
            UomX.classList.add('text-nowrap');

            MinX.innerHTML = `<input id="TxtMinMicro` + num + `" class="form-control text-wrap" style="width:100px" type="text" value="${!clsGlobal.parseToString(Txtmin) ? clsGlobal.parseToString('') : clsGlobal.parseToString(Txtmin)}">`
            MaxX.innerHTML = `<input id="TxtMaxMicro` + num + `" class="form-control text-wrap" style="width:100px" type="text" value="${!clsGlobal.parseToString(Txtmax) ? clsGlobal.parseToString('') : clsGlobal.parseToString(Txtmax)}">`
            TargetX.innerHTML = `<input id="TxtTagetMicro` + num + `" class="form-control text-wrap" style="width:100px" type="text" value="${!clsGlobal.parseToString(Txttarget) ? clsGlobal.parseToString('') : clsGlobal.parseToString(Txttarget)}">`

            //Change Value ParamId
            TempParamId = Intparameterid;
            num += 1;
        }
    }

    //Render Value
    var rowZ = document.getElementsByClassName("microDetail");
    for (let z = 0; z < rowZ.length; z++) {
        for (let y = 0; y < objData.length; y++) {
            Dtmdateofevaluation = clsGlobal.parseToString(objData[y].Dtmdateofevaluation);
            intIntmicrobiologydetailid = clsGlobal.parseToString(objData[y].Intmicrobiologydetailid);
            Intmicrobiologyheaderid = clsGlobal.parseToString(objData[y].Intmicrobiologyheaderid);
            Intparameterid = clsGlobal.parseToString(objData[y].Intparameterid);
            Txtmax = clsGlobal.parseToString(objData[y].Txtmax);
            Txtmethod = clsGlobal.parseToString(objData[y].Txtmethod);
            Txtmin = clsGlobal.parseToString(objData[y].Txtmin);
            Txtparametername = clsGlobal.parseToString(objData[y].Txtparametername);
            Txtremarks = clsGlobal.parseToString(objData[y].Txtremarks);
            Txtsummary = clsGlobal.parseToString(objData[y].Txtsummary);
            Txttarget = clsGlobal.parseToString(objData[y].Txttarget);
            Txtuom = clsGlobal.parseToString(objData[y].Txtuom);
            Txtcreatedby = clsGlobal.parseToString(objData[y].Txtcreatedby);
            Dtmcreateddate = clsGlobal.parseToString(objData[y].Dtmcreateddate);
            TxtValue = clsGlobal.parseToString(objData[y].Txtvalue);

            if (rowZ[z].cells[1].innerText === Txtparametername) {
                var rowY = document.getElementById(`${rowZ[z].id}`);
                var TxtValueX = rowY.insertCell();
                TxtValueX.id = `${Dtmdateofevaluation}`
                TxtValueX.innerHTML = `<input id="TxtValueMicroParam` + y + `" class="form-control text-wrap" style="width:100px" type="text" value="${!clsGlobal.parseToString(TxtValue) ? clsGlobal.parseToString('') : clsGlobal.parseToString(TxtValue)}">` + `<input type="hidden" id="txtParamIdMicro${y}" value="${Intparameterid}">` + `<input type="hidden" id="txtParamIdMicro${y}" value="${Dtmdateofevaluation}">`;
                TxtValueX.classList.add('dtmEvalMicrobiology');
            }
        }
    }

    
    let TempParamIdParam = "";
    let numLoop3 = 0;

    for (let c = 0; c < objData.length; c++) {
        
        Intparameterid = clsGlobal.parseToString(objData[c].Intparameterid);
        Txtparametername = clsGlobal.parseToString(objData[c].Txtparametername);
        Txtremarks = clsGlobal.parseToString(objData[c].Txtremarks);
        Txtsummary = clsGlobal.parseToString(objData[c].Txtsummary);

        
        if (Intparameterid !== TempParamIdParam) {
            for (let a = 0; a < rowZ.length; a++) {
                //draw Select
                var n = ["OK", "NOT OK"];
                var summarySelect = `<select class="select2 form-select" style="width:150px;" id="selectSummaryMicrobiology` + numLoop3 + `" style="width:150px;" required>`;
                summarySelect += `<option value="">-</option>`;
                $.each(n, function (index, value) {
                    summarySelect += `<option value="` + value + `">` + value + `</option>`;
                });
                summarySelect += `</select>`;

                if (rowZ[a].cells[1].innerText === Txtparametername) {
                    var rowY = document.getElementById(`${rowZ[a].id}`);
                    var TxtSummaryX = rowY.insertCell();
                    var TxtRemarksX = rowY.insertCell();
                    TxtRemarksX.innerHTML = `<textarea id="TxtremarksMicro` + numLoop3 + `" class="form-control" rows="3" style="width:150px">${clsGlobal.parseToString(Txtremarks)}</textarea>`;
                    TxtSummaryX.innerHTML = summarySelect;

                    //Active Select2
                    $(".select2").select2();
                    numLoop3 += 1;
                }
            }
            //Change Value ParamId
            TempParamIdParam = Intparameterid;
        }
    }
    //sorting List Table
    sortListMicrobiology();
}
function p_bindingDataTxtSummaryMicrobiology(objData) {
    var list, i, x;
    list = document.getElementsByClassName("microDetail");
   
    for (i = 0; i < list.length; i++) {
        for (x = 0; x < objData.length; x++) {
            if (list[i].cells[1].innerText === clsGlobal.parseToString(objData[x].Txtparametername)) {
                if (objData[x].Txtsummary !== null) {
                    $('#selectSummaryMicrobiology' + i).val(clsGlobal.parseToString(objData[x].Txtsummary)).trigger("change");
                } else {
                    $('#selectSummaryMicrobiology' + i).val("-").trigger("change");
                }
            }
        }
    }
}
function p_dataToUIMicrobiologyDetail(objData) {
    const htmlHeadertable = document.getElementById('table-microBiologyHeader');
    htmlHeadertable.innerHTML = "";

    p_renderHeadertableMicro(objData);
    p_renderDetailTableMicro(objData);
    p_bindingDataTxtSummaryMicrobiology(objData);

    $("#txtHiddenObjectMicrobiologyDetail").val(JSON.stringify(objData));

}
function p_UIToDataMicrobiologyDetail() {
    // Getting Object SensoryEvalDetail
    var listDtmEvalMicro, b, i, j, x;
    let jsonData = [];
    let htmlJSON = $("#txtHiddenObjectMicrobiologyDetail").val();
    jsonData = JSON.parse(htmlJSON);
    var table = document.getElementsByClassName("microDetail");
    
    listDtmEvalMicro = document.getElementsByClassName("dtmEvalMicrobiology");

    //AddedData Min, Max, Target, Summary, Remarks
    for (i = 0; i < jsonData.length; i++) {
        for (j = 0; j < table.length; j++) {
            if (table[j].cells[1].innerText === jsonData[i].Txtparametername) {
                jsonData[i].Txtmin = clsGlobal.parseToString($(`#TxtMinMicro${j}`).val());
                jsonData[i].Txtmax = clsGlobal.parseToString($(`#TxtMaxMicro${j}`).val());
                jsonData[i].Txttarget = clsGlobal.parseToString($(`#TxtTagetMicro${j}`).val());
                jsonData[i].Txtsummary = clsGlobal.parseToString($("#selectSummaryMicrobiology" + j).find(":selected").val());
                jsonData[i].Txtremarks = clsGlobal.parseToString($(`#TxtremarksMicro${j}`).val());
                jsonData[i].Txtupdatedby = clsGlobal.parseToString($("#txtUserLogin").val());
            }
        }
    }

    //AddedData Value
    for (b = 0; b < listDtmEvalMicro.length; b++) {
        for (x = 0; x < jsonData.length; x++) {
            if ($(`#txtParamIdMicro${b}`).val() === clsGlobal.parseToString(jsonData[x].Intparameterid)) {
                if (listDtmEvalMicro[b].id === jsonData[x].Dtmdateofevaluation) {
                    jsonData[x].Txtvalue = clsGlobal.parseToString($(`#TxtValueMicroParam${b}`).val());
                }
            }
        }
    }

    return JSON.stringify(jsonData);
}

//=================================
// FORM Methodology
//=================================
function p_initiateDataMethodology() {
    $.ajax({
        type: "GET",
        url: ApiUrl + "api/1/FormMethodology/initiateDataFormMethodology",
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        async: false,
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                p_dataToUIMethodology(retDat.objData);
                $("#txtHiddenObjectMethodology").val(JSON.stringify(retDat));
                setItemSessionStorage("hiddenObjectMethodology", JSON.stringify(retDat));
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_dataToUIMethodology(objData) {
    
    $("#intMethodologyid").val(clsGlobal.parseToString(objData.Intmethodologyid));
    if (clsGlobal.parseToString(objData.Txtmethodology) !== "") {
        $("#txtMethodology").val(clsGlobal.parseToString(objData.Txtmethodology));
        $('#txtMethodology').trigger('change');
    } else {
        $("#txtMethodology").val(clsGlobal.parseToString(""));
        $('#txtMethodology').trigger('change');
    }

    if (clsGlobal.parseToInteger(objData.Intmethodologyid) !== 0 && objData.Bitopenpack !== null) {
        $("input[name='bitOpenPackRadio']").filter(`[value=${objData.Bitopenpack}]`).prop('checked', true);
    }

    if (clsGlobal.parseToInteger(objData.Intmethodologyid) !== 0 && objData.Bitrotest !== null) {
        $("input[name='bitROTestRadio']").filter(`[value=${objData.Bitrotest}]`).prop('checked', true);
    }

    $("#txtServingSuggestions").val(clsGlobal.parseToString(objData.Txtservingsuggestion));

    
    if ((clsGlobal.parseToString(objData.Txtmethodology) == ASLTARRHENIUS) || (clsGlobal.parseToString(objData.Txtmethodology) == ASLT)) {
        if (clsGlobal.parseToString(objData.Txttemperaturerequirement) == TEMPERATURE35 || clsGlobal.parseToString(objData.Txttemperaturerequirement) == TEMPERATURE45 || clsGlobal.parseToString(objData.Txttemperaturerequirement) == TEMPERATURE50) {
            $("#txtTemperatureRequirment").val(clsGlobal.parseToString(objData.Txttemperaturerequirement));
            $('#txtTemperatureRequirment').trigger('change');
            $('#txtHummidity').attr('disabled', true)
        } else {
            $("#txtTemperatureRequirment").val(clsGlobal.parseToString(objData.Txttemperaturerequirement));
            $('#txtTemperatureRequirment').trigger('change');
        }
    } else {
        $("#txtTemperatureRequirment").val(clsGlobal.parseToString(""));
        $('#txtTemperatureRequirment').trigger('change');
    }

    if (clsGlobal.parseToString(objData.Txttemperaturerequirement) !== "") {
        $("#txtTemperatureRequirment").val(clsGlobal.parseToString(objData.Txttemperaturerequirement));
        $('#txtTemperatureRequirment').trigger('change');
    } else {
        $("#txtTemperatureRequirment").val(clsGlobal.parseToString(""));
        $('#txtTemperatureRequirment').trigger('change');
    }

    if (clsGlobal.parseToString(objData.Txthumidity) !== "") {
        $("#txtHummidity").val(clsGlobal.parseToString(objData.Txthumidity));
        $('#txtHummidity').trigger('change');
    } else {
        $("#txtHummidity").val(clsGlobal.parseToString(""));
        $('#txtHummidity').trigger('change');
    }

    if (clsGlobal.parseToInteger(objData.Intmethodologyid) !== 0) {
        $("#dtmStartEvaluation").val(clsGlobal.parseToString(objData.Dtmstartevaluation));
    }

    if (clsGlobal.parseToInteger(objData.Intmethodologyid) !== 0) {
        $("#dtmEndEvaluation").val(clsGlobal.parseToString(objData.Dtmendevaluation));
    }

    if (clsGlobal.parseToString(objData.Txtincubatorchamber) !== "") {
        $("#txtIncubatorChamber").val(clsGlobal.parseToString(objData.Txtincubatorchamber));
        $('#txtIncubatorChamber').trigger('change');
        $('#txtControlRoom,#txtWarehouse').attr('disabled', true);
    } else {
        $("#txtIncubatorChamber").val(clsGlobal.parseToString(""));
        $('#txtIncubatorChamber').trigger('change');
    }

    if (clsGlobal.parseToString(objData.Txtcontrolroom) !== "") {
        $("#txtControlRoom").val(clsGlobal.parseToString(objData.Txtcontrolroom));
        $('#txtControlRoom').trigger('change');
        $('#txtIncubatorChamber,#txtWarehouse').attr('disabled', true);
    } else {
        $("#txtControlRoom").val(clsGlobal.parseToString(""));
        $('#txtControlRoom').trigger('change');
    }

    if (clsGlobal.parseToString(objData.Txtwarehouse) !== "") {
        $("#txtWarehouse").val(clsGlobal.parseToString(objData.Txtwarehouse));
        $('#txtWarehouse').trigger('change');
        $('#txtIncubatorChamber,#txtControlRoom').attr('disabled', true);
    } else {
        $("#txtWarehouse").val(clsGlobal.parseToString(""));
        $('#txtWarehouse').trigger('change');
    }

    $("#txtCreatedByMethodology").val(clsGlobal.parseToString(objData.Txtcreatedby));
    $("#txtUpdatedByMethodology").val(clsGlobal.parseToString(objData.Txtupdatedby));
}
function p_UIToDataMethodology() {
    let jsonData = [];

    let htmlJSON = $("#txtHiddenObjectMethodology").val();
    jsonData = JSON.parse(htmlJSON);
    jsonData.objRequestData = jsonData.objData;

    jsonData.objRequestData.Intformrequestheaderid = clsGlobal.parseToInteger($("#intFormRequestHeaderId").val());
    jsonData.objRequestData.Intmethodologyid = clsGlobal.parseToInteger($("#intMethodologyid").val());
    jsonData.objRequestData.Txtmethodology = clsGlobal.parseToString($("#txtMethodology").find(":selected").val());
    jsonData.objRequestData.Bitopenpack = $("input[name='bitOpenPackRadio']:checked").val();
    jsonData.objRequestData.Bitrotest = $("input[name='bitROTestRadio']:checked").val();
    jsonData.objRequestData.Txtservingsuggestion = clsGlobal.parseToString($("#txtServingSuggestions").val());
    jsonData.objRequestData.Txttemperaturerequirement = clsGlobal.parseToString($("#txtTemperatureRequirment").find(":selected").val());
    jsonData.objRequestData.Txthumidity = clsGlobal.parseToString($("#txtHummidity").find(":selected").val());
    jsonData.objRequestData.Dtmstartevaluation = clsGlobal.parseToString($("#dtmStartEvaluation").val());
    jsonData.objRequestData.Dtmendevaluation = clsGlobal.parseToString($("#dtmEndEvaluation").val());
    jsonData.objRequestData.Txtincubatorchamber = clsGlobal.parseToString($("#txtIncubatorChamber").find(":selected").val());
    jsonData.objRequestData.Txtcontrolroom = clsGlobal.parseToString($("#txtControlRoom").find(":selected").val());
    jsonData.objRequestData.Txtwarehouse = clsGlobal.parseToString($("#txtWarehouse").find(":selected").val());
    jsonData.objRequestData.Txtcreatedby = clsGlobal.parseToString($("#txtCreatedBy").val());

    if (jsonData.objRequestData.Txtcreatedby === "") {
        jsonData.objRequestData.Txtcreatedby = clsGlobal.parseToString($("#txtUserLogin").val());
    } else if (jsonData.objRequestData.Txtcreatedby === clsGlobal.parseToString($("#txtUserLogin").val()) || jsonData.objRequestData.Txtcreatedby != null) {
        jsonData.objRequestData.Txtupdatedby = clsGlobal.parseToString($("#txtUserLogin").val());
    }

    return JSON.stringify(jsonData);
}

//=================================
// FORM Test Report
//=================================
function p_initiateDataTestReport() {
    $.ajax({
        type: "GET",
        url: ApiUrl + "api/1/FormTestReport/initiateDataFormTestReport",
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        async: false,
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                p_dataToUITestReport(retDat.objData);
                $("#txtHiddenObjectTestReport").val(JSON.stringify(retDat));
                setItemSessionStorage("hiddenObjectTestReport", JSON.stringify(retDat));
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_dataToUITestReport(objData) {
    $("#inttestreportid").val(clsGlobal.parseToString(objData.Inttestreportid));

    $("#txtSummaryTestResult").text(clsGlobal.parseToString(objData.Txtsummarytextresult));
    $("#txtShelflifeRecommen").text(clsGlobal.parseToString(objData.Txtconclusion));

    if (clsGlobal.parseToString(objData.Txtrecommendedshelflife) !== "") {
        $("#txtFinalShelflife").val(clsGlobal.parseToInteger(objData.Txtrecommendedshelflife));
    }
    
    $("#txtCreatedByTestReport").val(clsGlobal.parseToString(objData.Txtcreatedby));
    $("#txtUpdatedByTestReport").val(clsGlobal.parseToString(objData.Txtupdatedby));
}
function p_UIToDataTestReport() {
    let jsonData = [];

    let htmlJSON = $("#txtHiddenObjectTestReport").val();
    jsonData = JSON.parse(htmlJSON);
    jsonData.objRequestData = jsonData.objData;

    jsonData.objRequestData.Intformrequestheaderid = clsGlobal.parseToInteger($("#intFormRequestHeaderId").val());
    jsonData.objRequestData.Inttestreportid = clsGlobal.parseToInteger($("#inttestreportid").val());
    jsonData.objRequestData.Txtrecommendedshelflife = clsGlobal.parseToString($("#txtFinalShelflife").val());
    jsonData.objRequestData.Txtsummarytextresult = clsGlobal.parseToString($("#txtSummaryTestResult").val());
    jsonData.objRequestData.Txtconclusion = clsGlobal.parseToString($("#txtShelflifeRecommen").val());
    jsonData.objRequestData.Txtcreatedby = clsGlobal.parseToString($("#txtCreatedByTestReport").val());
    

    if (jsonData.objRequestData.Txtcreatedby === "") {
        jsonData.objRequestData.Txtcreatedby = clsGlobal.parseToString($("#txtUserLogin").val());
    } else if (jsonData.objRequestData.Txtcreatedby === clsGlobal.parseToString($("#txtUserLogin").val()) || jsonData.objRequestData.Txtcreatedby != null) {
        jsonData.objRequestData.Txtupdatedby = clsGlobal.parseToString($("#txtUserLogin").val());
    }
    return JSON.stringify(jsonData);
}

//=================================
// Master FORM Methodology
//=================================
function p_getMethodology() {
    $.ajax({
        type: "GET",
        url: ApiUrl + "api/1/Master/getMasterMethodologyStabilita",
        contentType: "application/json",
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        async: false,
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                p_mappingDataMethodologyToSelect(retDat.objData);
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_mappingDataMethodologyToSelect(objData) {
    var datMethodology = objData;
    for (var i = 0; i < datMethodology.length; i++) {
        $('#txtMethodology').append(`<option value="${datMethodology[i].TxtCode}">${datMethodology[i].TxtCode}</option>`);
    }
}
function p_getTemperature() {
    $.ajax({
        type: "GET",
        url: ApiUrl + "api/1/Master/getMasterTemperatureRequirement",
        contentType: "application/json",
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        async: false,
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                p_mappingDataTemperatureToSelect(retDat.objData);
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_mappingDataTemperatureToSelect(objData) {
    var datTemperature = objData;
    for (var i = 0; i < datTemperature.length; i++) {
        $('#txtTemperatureRequirment').append(`<option value="${datTemperature[i].TxtCode}">${datTemperature[i].TxtCode}</option>`);
    }
}
function p_getHumidity() {
    $.ajax({
        type: "GET",
        url: ApiUrl + "api/1/Master/getMasterHumidity",
        contentType: "application/json",
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        async: false,
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                p_mappingDataHumidityToSelect(retDat.objData);
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_mappingDataHumidityToSelect(objData) {
    var datHumidity = objData;
    for (var i = 0; i < datHumidity.length; i++) {
        $('#txtHummidity').append(`<option value="${datHumidity[i].TxtCode}">${datHumidity[i].TxtCode}</option>`);
    }
}
function p_getIncubatorChamber() {
    $.ajax({
        type: "GET",
        url: ApiUrl + "api/1/Master/getMasterIncubatorChamber",
        contentType: "application/json",
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        async: false,
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                p_mappingIncubatorChamberToSelect(retDat.objData);
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_mappingIncubatorChamberToSelect(objData) {
    var datIncubator = objData;
    for (var i = 0; i < datIncubator.length; i++) {
        $('#txtIncubatorChamber').append(`<option value="${datIncubator[i].TxtCode}">${datIncubator[i].TxtCode}</option>`);
    }
}
function p_getControlRoom() {
    $.ajax({
        type: "GET",
        url: ApiUrl + "api/1/Master/getMasterControlRoom",
        contentType: "application/json",
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        async: false,
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                p_mappingDataControlRoomToSelect(retDat.objData);
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_mappingDataControlRoomToSelect(objData) {
    var datControlRoom = objData;
    for (var i = 0; i < datControlRoom.length; i++) {
        $('#txtControlRoom').append(`<option value="${datControlRoom[i].TxtCode}">${datControlRoom[i].TxtCode}</option>`);
    }
}
function p_getWarehouse() {
    $.ajax({
        type: "GET",
        url: ApiUrl + "api/1/Master/getMasterWarehouse",
        contentType: "application/json",
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        async: false,
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                p_mappingDataWarehouseToSelect(retDat.objData);
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_mappingDataWarehouseToSelect(objData) {
    var datWarehouse = objData;
    for (var i = 0; i < datWarehouse.length; i++) {
        $('#txtWarehouse').append(`<option value="${datWarehouse[i].TxtCode}">${datWarehouse[i].TxtCode}</option>`);
    }
}
//=======================
// LOV
//=======================
function p_popUpLOVSwalProjectNumber(objData) {
    const dataTable = `<table id="lovTable" bordered=1 class="table table-bordered" >
        <thead>
            <tr>
                <th>Project Number</th>
                <th>Concept Name</th>
                <th>Subbrand Description</th>
                <th>Action</th>
            </tr>
        </thead>
</table>`;

    Swal.fire({
        title: 'LOV Project Number',
        html: dataTable,
        showCloseButton: true,
        showConfirmButton: false,
        position: "center",
        width: "90%",
        heightAuto: true,
    });

    var table = $("#lovTable").DataTable({
        data: objData,
        deferRender: true,
        columnDefs: [
            {
            defaultContent: "",
            targets: "_all"
            },
            {
                targets: [0, 1, 2],
                className: "dt-left",
            },
        ],
        dataSrc: '',
        info: false,
        lengthChange: false,
        columns: [
            { data: 'TxtProjectNumber' },
            { data: 'TxtConceptName' },
            { data: 'TxtSubbrandDesc' },
            { data: null, "defaultContent": `<button class='btn btn-success'>Select</button>` }
        ],
    });

    table.on('click', 'button', function (e) {
        let data = table.row(e.target.closest('tr')).data();
        $("#txtProjectNumber").val(clsGlobal.parseToString(data.TxtProjectNumber));
        Swal.close();
        p_getDataProjectNumberDetail(clsGlobal.parseToString(data.TxtProjectNumber));
    });
    
}
function p_popUpLOVSwalItemCode(objData) {
    const dataTable = `<table id="lovTable" bordered=1 class="table table-bordered" >
        <thead>
            <tr>
                <th>Item Code</th>
                <th>Item Code Description</th>
                <th>Action</th>
            </tr>
        </thead>
</table>`;

    Swal.fire({
        title: 'LOV Item Code',
        html: dataTable,
        showCloseButton: true,
        showConfirmButton: false,
        position: "center",
        width: "90%",
        heightAuto: true,
    });

    var table = $("#lovTable").DataTable({
        data: objData,
        deferRender: true,
        columnDefs: [
            {
            defaultContent: "",
            targets: "_all",
            
            },
            {
                targets: [0, 1, 2],
                className: "dt-left",
            },
            {
                "width": "50%",
                "targets": 1
            },
            {
                "width": "20%",
                "targets": [0]
            },
            {
                "width": "10%",
                "targets": [2]
            }
        ],
        dataSrc: '',
        info: false,
        lengthChange: false,
        columns: [
            { data: 'TxtItemCodeValue' },
            { data: 'TxtItemCodeDescription' },
            { data: null, "defaultContent": `<button class='btn btn-success me-2'>Select</button>` }
        ],
    });

    table.on('click', 'button', function (e) {
        let data = table.row(e.target.closest('tr')).data();
        $("#txtItemCode").val(clsGlobal.parseToString(data.TxtItemCodeValue));
        $("#txtItemDescription").val(clsGlobal.parseToString(data.TxtItemCodeDescription));
        $('#txtItemDescription').attr("disabled", true);
        $('#txtItemCodeOrigin').val(clsGlobal.parseToString(data.TxtOriginForm))
        Swal.close();
    });

}
function p_popUpLOVSwalPIC(objData) {
    const dataTable = `<table id="lovTable" bordered=1 class="table table-bordered" >
        <thead>
            <tr>
                <th>Username</th>
                <th>Fullname</th>
                <th>Email</th>
                <th>Action</th>
            </tr>
        </thead>
</table>`;

    Swal.fire({
        title: 'LOV PIC',
        html: dataTable,
        showCloseButton: true,
        showConfirmButton: false,
        position: "center",
        width: "90%",
        heightAuto: true,
    });

    var table = $("#lovTable").DataTable({
        data: objData,
        deferRender: true,
        columnDefs: [
            {
                defaultContent: "",
                targets: "_all",

            },
            {
                targets: [0, 1, 2],
                className: "dt-left",
            },
            {
                "width": 10,
                "targets": [0, 1, 2]
            },
        ],
        dataSrc: '',
        info: false,
        lengthChange: false,
        columns: [
            {
                data: 'txtUserName',
                render: function (data) {
                    return `<div class="text-left text-nowrap" style="width:100px">${data.toUpperCase()}</div>`
                }
            },
            {
                data: 'txtFullName',
                render: function (data) {
                    return `<div class="text-left text-nowrap" style="width:100px">${data.toUpperCase()}</div>`
                }
            },
            {
                data: 'txtEmail',
                render: function (data) {
                    return `<div class="text-left text-nowrap" style="width:250px">${data.toLowerCase()}</div>`
                }
            },
            {
                data: null, "defaultContent": `<button class='btn btn-success me-2'>Select</button>`,
                width: 10
            }
        ],
    });

    table.on('click', 'button', function (e) {
        let data = table.row(e.target.closest('tr')).data();
        $("#txtPIC").val(clsGlobal.parseToString(data.txtUserName.toUpperCase()));
        Swal.close();
    });

}
function p_popUpLOVSwalFormula(objData) {
    const dataTable = `<table id="lovTable" bordered=1 class="table table-bordered" >
        <thead>
            <tr>
                <th>Formula Code</th>
                <th>Formula Description</th>
                <th>Formula Version</th>
                <th>Action</th>
            </tr>
        </thead>
</table>`;

    Swal.fire({
        title: 'LOV Formula',
        html: dataTable,
        showCloseButton: true,
        showConfirmButton: false,
        position: "center",
        width: "90%",
        heightAuto: true,
    });

    var table = $("#lovTable").DataTable({
        data: objData,
        deferRender: true,
        columnDefs: [
            {
                defaultContent: "",
                targets: "_all",

            },
            {
                targets: [0, 1],
                className: "dt-left",
            },
            {
                "width": "50%",
                "targets": 1
            },
            {
                "width": "20%",
                "targets": [0, 2]
            },
            {
                "width": "10%",
                "targets": 3
            }
        ],
        dataSrc: '',
        info: false,
        lengthChange: false,
        columns: [
            { data: 'TxtFormulaValue' },
            { data: 'TxtFormulaDescription' },
            { data: 'IntFormulaVersion' },
            { data: null, "defaultContent": `<button class='btn btn-success me-2'>Select</button>` }
        ],
    });

    table.on('click', 'button', function (e) {
        let data = table.row(e.target.closest('tr')).data();
        $("#txtFormulaNumber").val(clsGlobal.parseToString(data.TxtFormulaValue));
        $("#txtFormulaName").val(clsGlobal.parseToString(data.TxtFormulaDescription));
        $('#txtFormulaVersion').val(clsGlobal.parseToString(data.IntFormulaVersion));
        $('#txtFormulaOrigin').val(clsGlobal.parseToString(data.TxtOriginForm));
        Swal.close();
    });

}
function p_popUpDataTableHistoryStatus(objData) {
    const dataTable = `<table id="hitoricalTable" bordered=1 class="table table-bordered" >
        <thead>
            <tr>
                <th>Approval Process</th>
                <th>Username</th>
                <th>Report Status</th>
                <th>Date</th>
                <th>Remakrs</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
</table>`;

    Swal.fire({
        title: 'Approval Report',
        html: dataTable,
        showCloseButton: true,
        showConfirmButton: false,
        position: "center",
        width: "90%",
        heightAuto: true,
    });

    $("#hitoricalTable").DataTable({
        data: objData,
        deferRender: true,
        dataSrc: '',
        info: false,
        lengthChange: false,
        ordering: false,
        paging: false,
        columns: [
            {
                data: 'Txtaction',
                render: function (data) {
                    return data ? data.bold() : null;
                }
            },
            {
                data: 'Txtusername',
                render: function (data) {
                    return data ? data : null;
                }
            },
            { data: 'Txtreportstatus' },
            {
                data: 'Dtmaction',
                render: function (data) {
                    return clsGlobal.parseToDateTimeFromJSONV2(data, clsDateFormatV3);
                }
            },
            { data: 'Txtremaks' }
        ],
    });
}
function p_popUpDataTableHistoryMasterSpec(objData) {
    const dataTable = `<table id="hitoricalMasterSpecTable" bordered=1 class="table table-bordered" >
        <thead>
            <tr>
                <th>Request Number</th>
                <th>Username</th>
                <th>Report Status</th>
                <th>Date</th>
                <th>Remakrs</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
</table>`;

    Swal.fire({
        title: 'Master Spec History',
        html: dataTable,
        showCloseButton: true,
        showConfirmButton: false,
        position: "center",
        width: "90%",
        heightAuto: true,
    });

    var table = $("#hitoricalMasterSpecTable").DataTable({
        data: objData,
        deferRender: true,
        dataSrc: '',
        info: false,
        lengthChange: false,
        ordering: false,
        paging: false,
        columns: [
            {
                data: 'Txtrequestnumber',
                render: function (data) {
                    return `<a href="${baseUrl}/StabilityRequestForm/Index?RequestNo=${data}">${data}</a>`
                }
            },
            {
                data: 'Txtusername',
                render: function (data) {
                    return data ? data : null;
                }
            },
            { data: 'Txtreportstatus' },
            {
                data: 'Dtmaction',
                render: function (data) {
                    return clsGlobal.parseToDateTimeFromJSONV2(data, clsDateFormatV3);
                }
            },
            { data: 'Txtremaks' }
        ],
    });
}

//============================
// Master FORM REQUEST HEADER
//============================
function p_RequestDataSampleType() {
    var jsonData = [];
    let htmlJSON = $("#txtSamplePayload").val();
    jsonData = JSON.parse(htmlJSON);
    jsonData.objRequestData = {
        "intParameter_HeaderID": 0,
        "intProgramID": 0,
        "txtCode": "SAMPLE_TYPE"
    };
    jsonData.txtProgramCode = "SLS";
    return JSON.stringify(jsonData);
}
function p_getDataSampleType() {
    $.ajax({
        type: "GET",
        url: ApiUrl + "api/1/Master/getMasterSampleType",
        contentType: "application/json",
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        async: false,
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                p_mappingDataSampleTypeToSelect(retDat.objData);
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_mappingDataSampleTypeToSelect(objData) {
    
    var datParamDetail = objData.sort(function (a, b) {
        if (a.TxtCode < b.TxtCode) {
            return -1;
        }
        else
        {
            return 0;
        }
    });

    var indexSampleType = datParamDetail.findIndex(function (a) {
        if (a.TxtCode == SAMPLETYPEOTHERS) {
            return a
        }
    });

    datParamDetail.push(datParamDetail.splice(indexSampleType, 1)[0]);

    for (var i = 0; i < datParamDetail.length; i++) {
        $('#txtSampleType').append(`<option value="${datParamDetail[i].TxtCode}"> ${datParamDetail[i].TxtDescription} </option>`);
    }
}
function p_getSubBrand() {
    clsGlobal.showLoading();
    $.ajax({
        type: "GET",
        url: ApiUrl + "api/1/Master/getMasterSubBrand",
        contentType: "application/json",
        async: false,
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                p_mappingDataSubBrandToSelect(retDat.objData);
                clsGlobal.hideLoading();
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
                clsGlobal.hideLoading();
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
            clsGlobal.hideLoading();
        }
    });
}
function p_mappingDataSubBrandToSelect(objData) {
    var datSubBrand = objData;
    for (var i = 0; i < datSubBrand.length; i++) {
        $('#txtSubBrand').append(`<option value="${datSubBrand[i].TxtSubBrandName}">${datSubBrand[i].TxtSubBrandName}</option>`);
    }
}
function p_RequestDataBrandDetail(objData) {
    var jsonData = [];
    let htmlJSON = $("#txtSamplePayload").val();
    jsonData = JSON.parse(htmlJSON);
    jsonData.objRequestData = {
        "TxtSubBrandName": clsGlobal.parseToString(objData),
    };
    jsonData.txtProgramCode = "SLS";
    return JSON.stringify(jsonData);
}
function p_GetDataBrandDetail(objRequestData) {
    var payload = p_RequestDataBrandDetail(objRequestData);
    $.ajax({
        type: "POST",
        url: ApiUrl + "api/1/Master/getMasterBrandDetail",
        contentType: "application/json",
        data: payload,
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                p_MappingDataBrandDetail(retDat.objData);
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_MappingDataBrandDetail(objData) {
    $("#txtBrand").val(clsGlobal.parseToString(objData.TxtBrandName));
    $("#txtLOB").val(clsGlobal.parseToString(objData.TxtLOB));
}
function p_getVarian() {
    $.ajax({
        type: "GET",
        url: ApiUrl + "api/1/Master/getMasterVarian",
        contentType: "application/json",
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        async: false,
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                p_mappingDataVarianToSelect(retDat.objData);
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_mappingDataVarianToSelect(objData) {
    var datVarian = objData;
    for (var i = 0; i < datVarian.length; i++) {
        $('#txtVarian').append(`<option value="${datVarian[i].TxtVariantName}">${datVarian[i].TxtVariantDesciption}</option>`);
    }
}
function p_getProductType() {
    $.ajax({
        type: "GET",
        url: ApiUrl + "api/1/Master/getMasterProductType",
        contentType: "application/json",
        async: false,
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                p_mappingDataProductTypeToSelect(retDat.objData);
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_mappingDataProductTypeToSelect(objData) {
    var datProductType = objData;
    for (var i = 0; i < datProductType.length; i++) {
        $('#txtProductType').append(`<option value="${datProductType[i].TxtProductTypeDescription}">${datProductType[i].TxtProductTypeDescription}</option>`);
    }
}
function p_getProjectNumber() {
    $.ajax({
        type: "GET",
        url: ApiUrl + "api/1/Master/getMasterProjectNumber",
        contentType: "application/json",
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                if (stabilityDataProjectNo.length < 1) {
                    stabilityDataProjectNo = retDat.objData;
                    p_popUpLOVSwalProjectNumber(retDat.objData);
                } else {
                    p_popUpLOVSwalProjectNumber(stabilityDataProjectNo);
                }
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_RequestDataProjectNumber(objRequestData) {
    var jsonData = [];
    let htmlJSON = $("#txtSamplePayload").val();
    jsonData = JSON.parse(htmlJSON);
    jsonData.objRequestData = {
        "TxtProjectNumber": clsGlobal.parseToString(objRequestData)
    };
    jsonData.txtProgramCode = "SLS";
    return JSON.stringify(jsonData);
}
function p_getDataProjectNumberDetail(objRequestData) {
    var payload = p_RequestDataProjectNumber(objRequestData);
    $.ajax({
        type: "POST",
        url: ApiUrl + "api/1/Master/getMasterProjectDetail",
        contentType: "application/json",
        data: payload,
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                p_MappingDataProjectNumberDetail(retDat.objData);
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_MappingDataProjectNumberDetail(objData) {
    
    $("#txtConceptNumber").val(clsGlobal.parseToString(objData.TxtConceptNo));
    $("#txtBrand").val(clsGlobal.parseToString(objData.TxtBrand.toUpperCase())).attr("disabled", true);
    $("#txtLOB").val(clsGlobal.parseToString(objData.TxtLOB.toUpperCase())).attr("disabled", true);
    $("#txtSubBrand").val(clsGlobal.parseToString(objData.TxtSubbrand.toUpperCase())).trigger('change').attr("disabled", true);
    $("#txtVarian").val(clsGlobal.parseToString(objData.TxtVariant.toUpperCase())).trigger('change').attr("disabled", true);
    $("#txtProductType").val(clsGlobal.parseToString(objData.TxtProductType.toUpperCase())).trigger('change').attr("disabled", true);
    $("#txtSKU").val(clsGlobal.parseToString(objData.TxtSKU)).attr("disabled", true);

    if (objData.TxtConceptNo != null) {
        p_getDataProjectBackground(objData.TxtConceptNo);
    }
}
function p_getItemCode() {
    if (stabilityDataItemCode.length < 1) {
        $.ajax({
            type: "GET",
            url: ApiUrl + "api/1/Master/getmasteritemcode",
            contentType: "application/json",
            headers: {
                Authorization: "Bearer " + $("#txtWSOToken").val(),
                BEAuthorization: $("#txtBEAuthorization").val()
            },
            datatype: "json",
            success: function (retDat) {
                if (retDat.bitSuccess == true) {
                    if (stabilityDataItemCode.length < 1) {
                        stabilityDataItemCode = retDat.objData;
                        p_popUpLOVSwalItemCode(retDat.objData);
                    } else {
                        p_popUpLOVSwalItemCode(stabilityDataItemCode);
                    }

                } else {
                    clsGlobal.swalError(retDat.txtErrorMessage);
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.swalError(xhr.responseText);
            }
        });
    } else {
        p_popUpLOVSwalItemCode(stabilityDataItemCode);
    }
}
function p_getPIC() {
    $.ajax({
        type: "GET",
        url: ApiUrl + "api/1/Master/getMasterPICFromEmployee",
        contentType: "application/json",
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                if (stabilityDataPIC.length < 1) {
                    stabilityDataPIC = retDat.objData;
                    p_popUpLOVSwalPIC(retDat.objData);
                } else {
                    p_popUpLOVSwalPIC(stabilityDataPIC);
                }
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}

//============================
// Master GLOBAL
//============================
function p_RequestDataParameter(objRequestData) {
    var jsonData = [];
    let htmlJSON = $("#txtSamplePayload").val();
    jsonData = JSON.parse(htmlJSON);
    jsonData.objRequestData = {
        "TxtParam": clsGlobal.parseToString(objRequestData)
    };
    jsonData.txtProgramCode = "SLS";
    return JSON.stringify(jsonData);
}
function p_getParamPhy() {
    var payload = p_RequestDataParameter("PHYSICALCHEMICAL");
    $.ajax({
        type: "POST",
        url: ApiUrl + "api/1/Master/getMethodParameter",
        async: false,
        contentType: "application/json",
        data: payload,
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                p_mappingParamPhysicalToSelect(retDat.objData);
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_mappingParamPhysicalToSelect(objData) {
    var datParam = objData;
    for (var i = 0; i < datParam.length; i++) {
        $('#selectParameterFormPhysicalChemical').append(`<option value="${datParam[i].TEST_ID}|${datParam[i].TEST_CODE}|${datParam[i].TEST_METHOD_CODE}|${datParam[i].TEST_UNIT}">${datParam[i].TEST_CODE} | ${datParam[i].TEST_METHOD_CODE} | ${datParam[i].TEST_UNIT}</option>`);
    }
}
function p_getParamMicro() {
    var payload = p_RequestDataParameter("MICROBIOLOGY");
    $.ajax({
        type: "POST",
        url: ApiUrl + "api/1/Master/getMethodParameter",
        async: false,
        contentType: "application/json",
        data: payload,
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                p_mappingParamMicroToSelect(retDat.objData);
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_mappingParamMicroToSelect(objData) {
    var datParam = objData;
    for (var i = 0; i < datParam.length; i++) {
        $('#selectParameterFormMicrobiology').append(`<option value="${datParam[i].TEST_ID}|${datParam[i].TEST_CODE}|${datParam[i].TEST_METHOD_CODE}|${datParam[i].TEST_UNIT}">${datParam[i].TEST_CODE} | ${datParam[i].TEST_METHOD_CODE} | ${datParam[i].TEST_UNIT}</option>`);
    }
}

//=======================
// Copy Form
//=======================
function p_setFormHeaderCopy() {
    $("#intFormRequestHeaderId").val("0");

    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + (month) + "-" + (day);

    $("#txtRequestNumber").val("");
    $("#txtRequestDate").val(convertDateString(today));
    $("#txtDocumentStatus").val("DRAFT");
}
function p_setFormProductInformation() {
    $("#intProductInformationid").val("0");
}
function p_setFormMethodologyCopy() {
    $("#intMethodologyid").val("0");
    $("#txtMethodology").val("").trigger('change');
    $("input[name='bitOpenPackRadio']").filter(`[value=true]`).prop('checked', false);
    $("input[name='bitOpenPackRadio']").filter(`[value=false]`).prop('checked', false);
    $("input[name='bitROTestRadio']").filter(`[value=true]`).prop('checked', false);
    $("input[name='bitROTestRadio']").filter(`[value=false]`).prop('checked', false);
    $("#txtTemperatureRequirment").val("").trigger('change');
    $("#txtHummidity").val("").trigger('change');
    $("#txtIncubatorChamber").val("").trigger('change');
    $("#txtControlRoom").val("").trigger('change');
    $("#txtWarehouse").val("").trigger('change');
    $("#dtmStartEvaluation").val("");
    $("#dtmEndEvaluation").val("");
    $("#txtServingSuggestions").val("");
}
function p_setFormSensoryCopy() {
    var Table = document.getElementById("tableSensoryEvalDetail");
    Table.innerHTML = "";

    $("#IntsensoryevaluationDetailid").val("0");
    $("#Intsensoryevaluationheaderid").val("0");
}
function p_setFormPhyCheCopy() {
    $("#IntPhysicalChemicalHeaderid").val("0");
    $("#IntPhysicalChemicalDetailid").val("0");
    $("#txtHiddenObjectPhysicalChemicalDetail").val("{}");

    const htmlHeadertable = document.getElementById('table-phyCheEvalHeader');
    htmlHeadertable.innerHTML = "";

    const htmlBodyTable = document.getElementById('table-phyCheEvalBody');
    htmlBodyTable.innerHTML = "";

    htmlHeadertable.classList.add('align-middle');
    var row = htmlHeadertable.insertRow();
    var NoX = row.insertCell();
    var ParamX = row.insertCell();
    var MethodX = row.insertCell();
    var UomX = row.insertCell();
    var MinX = row.insertCell();
    var MaxX = row.insertCell();
    var TargetX = row.insertCell();
    var DtmEvalX = row.insertCell();
    var SummaryX = row.insertCell();
    var RemarksX = row.insertCell();

    // Render Header
    NoX.innerText = "NO";
    ParamX.innerText = "PARAMETER";
    MethodX.innerText = "METHOD";
    UomX.innerText = "UOM";
    MinX.innerText = "MIN";
    MaxX.innerText = "MAX";
    TargetX.innerText = "TARGET";
    DtmEvalX.innerText = "DATE OF EVALUATION";
    DtmEvalX.id = "dtmEvalPhyChe";
    SummaryX.innerText = "SUMMARY";
    RemarksX.innerText = "REMARKS";

    // Set Attribute Scope
    NoX.setAttribute('scope', 'col');
    ParamX.setAttribute('scope', 'col');
    MethodX.setAttribute('scope', 'col');
    UomX.setAttribute('scope', 'col');
    MinX.setAttribute('scope', 'col');
    MaxX.setAttribute('scope', 'col');
    TargetX.setAttribute('scope', 'col');
    DtmEvalX.setAttribute('scope', 'rowgroup');
    SummaryX.setAttribute('scope', 'col');
    RemarksX.setAttribute('scope', 'col');

    // Set Attribute RowSpan
    NoX.setAttribute('rowspan', '2');
    ParamX.setAttribute('rowspan', '2');
    MethodX.setAttribute('rowspan', '2');
    UomX.setAttribute('rowspan', '2');
    MinX.setAttribute('rowspan', '2');
    MaxX.setAttribute('rowspan', '2');
    TargetX.setAttribute('rowspan', '2');
    DtmEvalX.setAttribute('colspan', '0');
    SummaryX.setAttribute('rowspan', '2');
    RemarksX.setAttribute('rowspan', '2');

    // Set Attribute RowSpan
    NoX.classList.add('text-nowrap', 'text-center', 'table-primary');
    ParamX.classList.add('text-nowrap', 'text-center', 'table-primary');
    MethodX.classList.add('text-nowrap', 'text-center', 'table-primary');
    UomX.classList.add('text-nowrap', 'text-center', 'table-primary');
    MinX.classList.add('text-nowrap', 'text-center', 'table-primary');
    MaxX.classList.add('text-nowrap', 'text-center', 'table-primary');
    TargetX.classList.add('text-nowrap', 'text-center', 'table-primary');
    DtmEvalX.classList.add('text-nowrap', 'text-center', 'table-primary');
    SummaryX.classList.add('text-nowrap', 'text-center', 'table-primary');
    RemarksX.classList.add('text-nowrap', 'text-center', 'table-primary');
}
function p_setFormMicroCopy() {
    $("#IntMicrobiologyHeaderid").val("0");
    $("#IntMicrobiologyDetailid").val("0");
    $("#txtHiddenObjectMicrobiologyDetail").val("{}");

    const htmlHeadertable = document.getElementById('table-microBiologyHeader');
    htmlHeadertable.innerHTML = "";

    const htmlBodyTable = document.getElementById('table-microBiologyBody');
    htmlBodyTable.innerHTML = "";

    htmlHeadertable.classList.add('align-middle');
    var row = htmlHeadertable.insertRow();
    var NoX = row.insertCell();
    var ParamX = row.insertCell();
    var MethodX = row.insertCell();
    var UomX = row.insertCell();
    var MinX = row.insertCell();
    var MaxX = row.insertCell();
    var TargetX = row.insertCell();
    var DtmEvalX = row.insertCell();
    var SummaryX = row.insertCell();
    var RemarksX = row.insertCell();

    // Render Header
    NoX.innerText = "NO";
    ParamX.innerText = "PARAMETER";
    MethodX.innerText = "METHOD";
    UomX.innerText = "UOM";
    MinX.innerText = "MIN";
    MaxX.innerText = "MAX";
    TargetX.innerText = "TARGET";
    DtmEvalX.innerText = "DATE OF EVALUATION";
    DtmEvalX.id = "dtmEvalPhyChe";
    SummaryX.innerText = "SUMMARY";
    RemarksX.innerText = "REMARKS";

    // Set Attribute Scope
    NoX.setAttribute('scope', 'col');
    ParamX.setAttribute('scope', 'col');
    MethodX.setAttribute('scope', 'col');
    UomX.setAttribute('scope', 'col');
    MinX.setAttribute('scope', 'col');
    MaxX.setAttribute('scope', 'col');
    TargetX.setAttribute('scope', 'col');
    DtmEvalX.setAttribute('scope', 'rowgroup');
    SummaryX.setAttribute('scope', 'col');
    RemarksX.setAttribute('scope', 'col');

    // Set Attribute RowSpan
    NoX.setAttribute('rowspan', '2');
    ParamX.setAttribute('rowspan', '2');
    MethodX.setAttribute('rowspan', '2');
    UomX.setAttribute('rowspan', '2');
    MinX.setAttribute('rowspan', '2');
    MaxX.setAttribute('rowspan', '2');
    TargetX.setAttribute('rowspan', '2');
    DtmEvalX.setAttribute('colspan', '0');
    SummaryX.setAttribute('rowspan', '2');
    RemarksX.setAttribute('rowspan', '2');

    // Set Attribute RowSpan
    NoX.classList.add('text-nowrap', 'text-center', 'table-primary');
    ParamX.classList.add('text-nowrap', 'text-center', 'table-primary');
    MethodX.classList.add('text-nowrap', 'text-center', 'table-primary');
    UomX.classList.add('text-nowrap', 'text-center', 'table-primary');
    MinX.classList.add('text-nowrap', 'text-center', 'table-primary');
    MaxX.classList.add('text-nowrap', 'text-center', 'table-primary');
    TargetX.classList.add('text-nowrap', 'text-center', 'table-primary');
    DtmEvalX.classList.add('text-nowrap', 'text-center', 'table-primary');
    SummaryX.classList.add('text-nowrap', 'text-center', 'table-primary');
    RemarksX.classList.add('text-nowrap', 'text-center', 'table-primary');
}
function p_setFormTestReportCopy() {
    $("#inttestreportid").val("0");
    $("#txtSummaryTestResult").val("");
    $("#txtShelflifeRecommen").val("");
    $("#txtFinalShelflife").val("");
}

//=======================
// PRINT REPORT
//=======================
function p_printReport(txtRequestNo) {
    $.ajax({
        type: "POST",
        url: baseUrl + "/Report/Download",
        data: {
            TxtRequestNo: txtRequestNo,
            __RequestVerificationToken: $('#stabilityHeaderForm input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess) {
                console.log(retDat);
                if (retDat.txtMessage == "Validation") {
                    clsGlobal.swalWarning(retDat.objData);
                }
                else
                {
                    clsGlobal.swalSuccess(retDat.objData);
                }
            }
            else
            {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    })
}

//=======================
// HANDLER
//=======================
$("#btnPrint").on("click", () => {
    debugger;
    let requestNo = $("#txtRequestNo").val();

    p_printReport(requestNo);
});
$('#btnCopyFrom').bind('click', function () {
    try {
        clsGlobal.getConfirmation("copy this form", function (result) {
            if (result == true) {
                $("#bitCopyFrom").val("true");
                p_setFormHeaderCopy();
                p_setFormProductInformation();
                p_setFormMethodologyCopy();
                p_setFormSensoryCopy();
                p_setFormPhyCheCopy();
                p_setFormMicroCopy();
                p_setFormTestReportCopy();

                enableForm();
                disableButton();

                $("#txtPIC").val("");
                $("#txtCreatedBy").val($("#txtUserLogin").val());
                $("#txtUpdatedBy").val("");

                document.getElementById('btnCopyFrom').style.visibility = 'hidden';
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});
$('#txtSampleType').on("select2:select", function () {
    if ($("#txtSampleType").val() == SAMPLETYPEFINISHGOOD) {
        $('#labelProjectNumber').addClass("required-field");
        $('#labelSubBrand').addClass("required-field");
        $('#labelBrand').addClass("required-field");
        $('#labelLOB').addClass("required-field");
        $('#labelVarian').addClass("required-field");
        $('#labelProductType').addClass("required-field");
        $('#labelSKU').addClass("required-field");
        $('#txtSubBrand').attr("disabled", true);
        $('#txtBrand').attr("disabled", true);
        $('#txtLOB').attr("disabled", true);
        $('#txtVarian').attr("disabled", true);
        $('#txtProductType').attr("disabled", true);
        $('#txtSKU').attr("disabled", true);
    } else {
        $('#labelProjectNumber').removeClass("required-field");
        $('#labelSubBrand').removeClass("required-field");
        $('#labelBrand').removeClass("required-field");
        $('#labelLOB').removeClass("required-field");
        $('#labelVarian').removeClass("required-field");
        $('#labelProductType').removeClass("required-field");
        $('#labelSKU').removeClass("required-field");
        $('#txtSubBrand').attr("disabled", false);
        $('#txtVarian').attr("disabled", false);
        $('#txtProductType').attr("disabled", false);
        $('#txtSKU').attr("disabled", false);
        $('#txtSKU').attr("required", false);
    }
});
$('#txtSampleType').on("select2:unselect", function () {
    $('#labelSubBrand').addClass("required-field");
    $('#labelBrand').addClass("required-field");
    $('#labelLOB').addClass("required-field");
    $('#labelVarian').addClass("required-field");
    $('#labelProductType').addClass("required-field");
    $('#labelSKU').addClass("required-field");
    $('#txtSubBrand').attr("disabled", false).val("").trigger('change');
    $('#txtBrand').attr("disabled", true).val("").trigger('change');
    $('#txtLOB').attr("disabled", true).val("").trigger('change');
    $('#txtVarian').attr("disabled", false).val("").trigger('change');
    $('#txtProductType').attr("disabled", false).val("").trigger('change');
    $('#txtSKU').attr("disabled", false).val("").trigger('change');
    $('#txtProjectNumber').val("");
    $('#txtConceptNumber').val("");
}); 
$('#txtIncubatorChamber,#txtControlRoom,#txtWarehouse').each(function () {
    $(this).on("select2:select", function () {
        var arrVal = $(this).val().split('-');
        if (arrVal[0] === 'CH' || arrVal[0] === 'IC') {
            $('#txtControlRoom,#txtWarehouse').attr('disabled', true);
        }
        if (arrVal[0] === 'C') {
            $('#txtIncubatorChamber,#txtWarehouse').attr('disabled', true);
        }
        if (arrVal[0] === 'W') {
            $('#txtIncubatorChamber,#txtControlRoom').attr('disabled', true);
        }
    });
});
$('#txtIncubatorChamber,#txtControlRoom,#txtWarehouse').each(function () {
    $(this).on("select2:clear", function () {
        $('#txtIncubatorChamber,#txtControlRoom,#txtWarehouse').attr('disabled', false);
    });
});
$('#txtMethodology').on('change', function () {
    if ($('#txtMethodology').val() == METHODLONGTERMAC || $('#txtMethodology').val() == METHODLONGTERMWAREHOUSE) {
        $('#txtTemperatureRequirment').attr('disabled', true);
        $('#txtTemperatureRequirment').attr('data-placeholder', "");
        $('#txtHummidity').attr('disabled', true);
        $('#txtHummidity').attr('data-placeholder', "");
        $('#txtShelflifeTarget').text('Month');
    } else {
        if ($('#txtMethodology').val() == ASLT || $('#txtMethodology').val() == ASLTARRHENIUS) {
            $('#txtShelflifeTarget').text('Month');
        }
        else {
            $('#txtShelflifeTarget').text('Month');
        }
        $('#txtTemperatureRequirment').attr('disabled', false);
        $('#txtHummidity').attr('disabled', false);

        
        
    }
});
$('#txtTemperatureRequirment').on("select2:select", function () {
    var valSelect = $('#txtTemperatureRequirment').select2().val();
    if (valSelect == "30" || valSelect == "40" || valSelect == "") {
        $('#txtHummidity').attr('disabled', false);
    } else {
        $('#txtHummidity').attr('disabled', true);
    }
});
$('#txtTemperatureRequirment').on("select2:unselect", function () {
    $('#txtHummidity').attr('disabled', false);
});
$('#txtSubBrand').on("select2:select", function () {
    var valSubBrand = $('#txtSubBrand').select2().val();
    var valProjectNumber = $("#txtProjectNumber").val();
    if ((valSubBrand != "") && (valProjectNumber == "")) {
        p_GetDataBrandDetail(valSubBrand);
    }
});
$('#txtSubBrand').on("select2:unselect", function () {
    $('#txtBrand').val("");
    $('#txtLOB').val("");
});
$('#btnFinish').bind('click', function () {
    try {
        var userName = clsGlobal.parseToString($('#txtFullName').val());
        clsGlobal.getConfirmation("Finish this evaluation progress", function (result) {
            if (result == true) {
                p_saveData(FINISH, userName);
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});
$('#btnSetSpec').bind('click', function () {
    try {
        var reqNumber = clsGlobal.parseToString($("#txtRequestNumber").val());
        var itemCode = clsGlobal.parseToString($("#txtItemCode").val());
        clsGlobal.getConfirmation(`Are you sure to make this ${reqNumber} into a master spec?`, function (result) {
            if (result == true) {
                p_saveDataMasterSpec(reqNumber, itemCode);
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});
$('#btnTerminate').bind('click', function () {
    try {
        var userName = clsGlobal.parseToString($('#txtFullName').val());
        clsGlobal.getConfirmation("Terminate this document", function (result) {
            if (result == true) {
                p_saveData(TERMINATE, userName);
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});
$('#btnSave').bind('click', function () {
    try {
        var userName = clsGlobal.parseToString($('#txtFullName').val());
        clsGlobal.getConfirmation("Save this data", function (result) {
            if (result == true) {
                p_saveData(SAVE, userName);
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});
$('#btnReturn').bind('click', function () {
    try {
        var userName = clsGlobal.parseToString($('#txtFullName').val());
        clsGlobal.getConfirmation("Return this data", function (result) {
            if (result == true) {
                p_saveData(RETURN, userName);
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});
$('#btnNew').bind('click', function () {
    try {
        var html = $("#RedirectTo").val();
        return location.href = html;
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});
$('#historicalStatus').bind('click', function () {
    p_getDataHistoricalStatus();
});
$('#historyMasterSpec').bind('click', function () {
    p_getDataHistoricalMasterSpec();
});
$('#btnSubmit').bind('click', function (e) {
    e.preventDefault();     // <- block the '<a>' default behavior, history, page jump on click, etc.
    var FormValidationHeader = $('#stabilityHeaderForm').valid(); // <- triggers validation test of whole form, similar to the test on a submit button click.
    var FormValidationProduct = $('#stabilityProductInformationForm').valid();
    var FormValidationMethodology = $('#stabilityMethodologyForm').valid();
    var FormValidationSensoryEvaluation = $('#stabilitySensoryForm').valid();
    var FormValidationPhysicalChemical = $('#stabilityPhysicalChemicalForm').valid();
    var FormValidationMicrobiology = $('#stabilityMicrobiologyForm').valid();

    var userName = clsGlobal.parseToString($('#txtFullName').val());

    if (FormValidationHeader == true &&
        FormValidationProduct == true &&
        FormValidationMethodology == true &&
        FormValidationSensoryEvaluation == true && 
        FormValidationPhysicalChemical == true &&
        FormValidationMicrobiology == true) {
        try {
            clsGlobal.getConfirmation("Submit this data?", function (result) {
                if (result == true) {
                    p_saveData(SUBMIT, userName);
                }
                else {
                    return false;
                }
            });
        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    }
});
$('#btnBack').bind('click', function (e) {
    try {
        var html = baseUrl + "/StabilityDashboard/Index";
        return location.href = html;
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});
$('#dtmStartEvaluation').on('change', function () {
    
    var startDate = new Date(clsGlobal.parseToString($("#dtmStartEvaluation").val()));
    var valueMethod = $("#txtMethodology").val();
    var intShelfLifeTarget = clsGlobal.parseToInteger($("#intShelfLifeTarget").val());

    if (valueMethod != "" && (valueMethod === ASLT || valueMethod === ASLTARRHENIUS)) {
        var endDate = calculateWeekOrMonth(startDate, intShelfLifeTarget, WEEK);
        $("#dtmEndEvaluation").val(clsGlobal.parseShortDate(endDate));
    } else {
        var endDate = calculateWeekOrMonth(startDate, intShelfLifeTarget, MONTH);
        $("#dtmEndEvaluation").val(clsGlobal.parseShortDate(endDate));
    }

    if ($("#dtmStartEvaluation").val() == "") {
        $("#dtmEndEvaluation").val("");
    }
});
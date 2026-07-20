"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = true;
var baseUrl = $("#txtBaseUrl").val();
var ApiUrl = clsGlobal.getBackEndApi();

//=======================
// Confirmation
//=======================

//=======================
// ON PAGE LOAD
//=======================

$(document).ready(function () {
    p_InitForm();
    p_validatePage();
    $(".select2").select2();
});

//=======================
// FUNCTION
//=======================
function p_InitForm() {
    p_getDataPersonalDashboard();
    /*p_DisableAllBtnLOV();*/
}
function p_validatePage() {

}
function p_showPrevData() {

}
function p_showBlank() {
    p_initiateData();
}
function p_tooltip() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}
function p_getDataPersonalDashboard() {

    var jsonData = [];
    let htmlJSON = $("#txtSamplePayload").val();
    jsonData = JSON.parse(htmlJSON);
    jsonData.objRequestData = {
        "Txtpic": clsGlobal.parseToString($("#txtUserLogin").val()).toUpperCase(),
    };
    jsonData.txtProgramCode = "SLS";

    $.ajax({
        type: "POST",
        url: ApiUrl + "api/1/FormDashboard/getDataPersonalDashboard",
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
                p_bindingDataPersonalDashboard(retDat.objData);
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}
function p_bindingDataPersonalDashboard(objData) {
    var roleName = clsGlobal.parseToString($('#txtRoleName').val());
    if (roleName == ADMINSLS || roleName == SUPERIORSLS || roleName == SUPERIORREQUESTORSLS) {
        $("#YourProgresEval").remove();
        $("#YourUpcomingEval").remove();

        var row = "<tr><td>" + objData.TotalRequestSubmited + "</td><td>" + objData.TotalTestReportAvailable + "</td></tr>";
        $("#tablePersonalDashboard tbody").append(row);
    }
    else {
        var row = "<tr><td>" + objData.TotalRequestSubmited + "</td><td>" + objData.TotalTestReportAvailable + "</td><td>" + objData.TotalProgresEvaluation + "</td><td>" + objData.TotalUpcomingEvaluation + "</td></tr>";
        $("#tablePersonalDashboard tbody").append(row);
    }
}
function p_exportDataExcel() {

    var txtCategory = clsGlobal.parseToString($('#txtFilter').val());
    var txtValue = clsGlobal.parseToString($('#txtSearchValue').val());
    var dtmStartDate = clsGlobal.parseToString($('#dtmStartDateSearch').val());
    var dtmEndDate = clsGlobal.parseToString($('#dtmEndDateSearch').val());


    clsGlobal.getConfirmation("Download Data Dashboard?", function (result) {
        if (result == true) {
            console.log(baseUrl);
            window.location = baseUrl + `/StabilityDashboard/Download?TxtValue=${txtValue}&TxtCategory=${txtCategory}&DtmStartDate=${dtmStartDate}&DtmEndDate=${dtmEndDate}`;
        }
        else {
            return false;
        }
    });
}
function p_redirectToStabilityRequest() {
    var html = $("#RedirectTo").val();

    return location.href = html;
}

//=======================
// HANDLER
//=======================

$('#buttonDelete').click(function () {
    $("#txtFilter").val(clsGlobal.parseToString(""));
    $('#txtFilter').trigger('change');
    $("#txtSearchValue").val("");
    $("#dtmStartDateSearch").val("");
    $("#dtmEndDateSearch").val("");
    $('#dataTableDashboard').DataTable().draw();
});

$('#buttonSearch').click(function () {
    $('#dataTableDashboard').DataTable().draw();
});

$('#dataTableDashboard').DataTable({
    serverSide: true,
    fixedColumns: {
        left: 3,
    },
    destroy: true,
    retrieve: true,
    order: [[1, 'desc']],
    scrollCollapse: true,
    iDisplayLength: 10,
    scrollX: true,
    scrollY: "400px",
    ajax: {
        type: "POST",
        url: ApiUrl + 'api/1/FormDashboard/getDataDashboardStabilityRequest',
        dataSrc: 'data',
        contentType: 'application/json',
        data: function (d) {
            var dat = clsGlobal.parseToString($("#txtFilter").val());
            d.Txtpic = $("#txtUserLogin").val().toUpperCase();
            d.DtmStartDate = clsGlobal.parseToString($("#dtmStartDateSearch").val());
            d.DtmEndDate = clsGlobal.parseToString($("#dtmEndDateSearch").val());
            d.TxtCategory = dat;
            d.TxtFilter = $("#txtSearchValue").val().toUpperCase();

            return JSON.stringify(d);
        },
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        async: true
    },
    searching: true,
    columnDefs: [
        {
            defaultContent: "",
            className: 'dt-body-nowrap',
            targets: "_all",
        },
        {
            className: 'dt-body-center',
            targets: [0, 2, 4, 6, 7, 8, 10]
        },
    ],
    columns: [
        {
            data: 'Bitisspec',
            render: function (data) {
                switch (data) {
                    case null:
                        return null;
                    case false:
                        return null;
                    case true: 
                        return `<i class="ti ti-star ti-sm"></i>`;
                }
            }
        },
        {
            data: 'Txtrequestnumber',
            render: function (data) {
                return `<a href="${baseUrl}/StabilityRequestForm/Index?RequestNo=${data}">${data}</a>`;
            },
        },
        { data: 'Txtpic' },
        { data: 'Txtconceptnumber' },
        { data: 'Txtprojectnumber' },
        {
            data: 'Formproductinformations[0].Txtprojectbackground',
            orderable: false
        },
        { data: 'Txtitemcode' },
        { data: 'Txtitemdescription' },
        { data: 'Txtproducttype' },
        {
            data: 'Formproductinformations[0].Txtprojecttype',
            orderable: false
        },
        {
            data: 'Formproductinformations[0].Txtpackagingspecification',
            orderable: false
        },
        {
            data: 'Formmethodologies[0].Txtmethodology',
            orderable: false
        },
        {
            data: function (data) {
                if (data.Formmethodologies[0].Txtincubatorchamber !== "") {
                    return data.Formmethodologies[0].Txtincubatorchamber;
                }
                if (data.Formmethodologies[0].Txtcontrolroom !== "") {
                    return data.Formmethodologies[0].Txtcontrolroom;
                }
                if (data.Formmethodologies[0].Txtwarehouse !== "") {
                    return data.Formmethodologies[0].Txtwarehouse;
                }
            },
            orderable: false
        },
        {
            data: 'Txtdocumentstatus',
            render: function (data) {
                switch (data) {
                    case DRAFT:
                        return `<button type="button" class="btn btn-secondary button-sm btnRediect">${data}</button>`;
                        break;
                    case APPROVED:
                        return `<button type="button" class="btn btn-success button-sm btnRediect">${data}</button>`;
                        break;
                    case ADMINREVIEW:
                        return `<button type="button" class="btn btn-warning button-sm btnRediect">${data}</button>`;
                        break;
                    case ONGOINGEVALUATION:
                        return `<button type="button" class="btn button-sm btn-danger btnRediect">${data}</button>`;
                        break;
                    case WAITINGFORSUPPERIORAPPROVAL:
                        return `<button type="button" class="btn btn-info button-sm btnRediect">${data}</button>`;
                        break;
                    case WAITINGFORSUPPERIORREQUESTOPRAPPROVAL:
                        return `<button type="button" class="btn button-sm btnRediect" style="background-color: #7367f0; color: white" onmouseover="this.style.background='#6610f2';" onmouseout="this.style.background='#7367f0';">${data}</button>`;
                        break;
                    case REQUESTREPORT:
                        return `<button type="button" class="btn button-sm btnRediect" style="background-color: #ffff00;" onmouseover="this.style.background='#e6e600';" onmouseout="this.style.background='#ffff00';">${data}</button>`;
                        break;
                    default:
                        return data;
                        break;
                };
            },
            orderable: false
        },
        {
            data: 'Ongoingreportstatuses[0].Dtmsensoryevaluationdate',
            render: function (data) {
                return data ? clsGlobal.parseToDateTimeFromJSONV2(data, clsDateFormatV3) : null;
            },
            orderable: false
        },
        {
            data: 'Ongoingreportstatuses[0].Txtsensoryevaluationremarks',
            render: function (data) {
                switch (data) {
                    case INCOMPLETE:
                        return `<button type="button" class="btn btn-light button-sm btnRediect">${data}</button>`;
                        break;
                    case DONE:
                        return `<button type="button" class="btn btn-success button-sm btnRediect">${data}</button>`;
                        break;
                    default:
                        return data;
                        break;
                };
            },
            orderable: false
        },
        {
            data: 'Ongoingreportstatuses[0].Dtmphysicalchemicaldate',
            render: function (data) {
                return data ? clsGlobal.parseToDateTimeFromJSONV2(data, clsDateFormatV3) : null;
            },
            orderable: false
        },
        {
            data: 'Ongoingreportstatuses[0].Txtphysicalchemicalremarks',
            render: function (data) {
                switch (data) {
                    case INCOMPLETE:
                        return `<button type="button" class="btn btn-light button-sm btnRediect">${data}</button>`;
                        break;
                    case DONE:
                        return `<button type="button" class="btn btn-success button-sm btnRediect">${data}</button>`;
                        break;
                    default:
                        return data;
                        break;
                };
            },
            orderable: false
        },
        {
            data: 'Ongoingreportstatuses[0].Dtmmicrobiologydate',
            render: function (data) {
                return data ? clsGlobal.parseToDateTimeFromJSONV2(data, clsDateFormatV3) : null;
            },
            orderable: false
        },
        {
            data: 'Ongoingreportstatuses[0].Txtmicrobiologyremarks',
            render: function (data) {
                switch (data) {
                    case INCOMPLETE:
                        return `<button type="button" class="btn btn-light button-sm btnRediect">${data}</button>`;
                        break;
                    case DONE:
                        return `<button type="button" class="btn btn-success button-sm btnRediect">${data}</button>`;
                        break;
                    default:
                        return data;
                        break;
                };
            },
            orderable: false
        },
        {
            data: 'Txtdocumentstatus',
            render: function (data) {
                switch (data) {
                    case REQUESTREPORT:
                        return `<button type="button" class="btn btn-warning button-sm">ON PROGRESS</button>`;
                        break;
                    case WAITINGFORSUPPERIORAPPROVAL:
                        return `<button type="button" class="btn btn-warning button-sm">ON PROGRESS</button>`;
                        break;
                    case WAITINGFORSUPPERIORREQUESTOPRAPPROVAL:
                        return `<button type="button" class="btn btn-warning button-sm">ON PROGRESS</button>`;
                        break;
                    case APPROVED:
                        return `<button type="button" class="btn btn-success button-sm">DONE</button>`;
                        break;
                    default:
                        return `<button type="button" class="btn btn-light button-sm">INCOMPLETE</button>`;
                        break;
                };
            },
            orderable: false
        },
    ],
});

$('#dataTableDashboard').DataTable().on('click', '.btnRediect', function (e) {
    e.preventDefault();
    var table = $('#dataTableDashboard').DataTable();
    let data = table.row(e.target.closest('tr')).data();

    location.href = baseUrl + `/StabilityRequestForm/Index?RequestNo=${data.Txtrequestnumber}`;
});
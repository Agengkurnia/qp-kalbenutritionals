"use strict";

//=======================
// 1. GLOBAL VARIABLES
//=======================
var clsGlobal = new clsGlobalClass();

//=======================
// 2. ON PAGE LOAD
//=======================
$(document).ready(function () {
    p_InitForm();
    $(".select2").select2({ width: '100%' });

    // Listener Enter Key di Input Global Search
    $('#txtSearchValue').on('keypress', function (e) {
        if (e.which === 13) {
            $('#buttonSearch').click();
        }
    });
});

//=======================
// 3. FUNCTIONS
//=======================
function p_InitForm() {
    p_getDataPersonalDashboard();
}

// Get Data Card Stats
function p_getDataPersonalDashboard() {
    $.ajax({
        type: "POST",
        url: "/SLS/Dashboard/GetPersonalDashboard",
        // --- ADDED: REQUEST VERIFICATION TOKEN ---
        beforeSend: function (request) {
            if ($('input[name=__RequestVerificationToken]').length > 0) {
                request.setRequestHeader("RequestVerificationToken", $('input[name=__RequestVerificationToken]').val());
            }
        },
        contentType: "application/json",
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                var objData = JSON.parse(retDat.objData);
                p_bindingDataPersonalDashboard(objData);
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr) {
            console.log("Failed to load dashboard stats.");
        }
    });
}

// Bind Data ke Card HTML
function p_bindingDataPersonalDashboard(objData) {
    $("#lbl_TotalSubmited").text(objData.TotalRequestSubmited);
    $("#lbl_Draft").text(objData.TotalRequestDraft);
    $("#lbl_AdminReview").text(objData.TotalRequestAdminReview);
    $("#lbl_OnGoingEval").text(objData.TotalRequestOnGoingEvaluation);
    $("#lbl_ReqReport").text(objData.TotalRequestReport);
    $("#lbl_WaitingSuperior").text(objData.TotalWaitingForSuperiorApproval);
    $("#lbl_WaitingRequestor").text(objData.TotalWaitingForSuperiorRequestorApproval);
    $("#lbl_Approved").text(objData.TotalApproved);
}

// Export Excel
function p_exportDataExcel() {
    var txtCategory = clsGlobal.parseToString($('#txtFilter').val());
    var txtValue = clsGlobal.parseToString($('#txtSearchValue').val());
    var dtmStartDate = clsGlobal.parseToString($('#dtmStartDateSearch').val());
    var dtmEndDate = clsGlobal.parseToString($('#dtmEndDateSearch').val());

    // Validasi Tanggal untuk Export
    var dateCats = ["SENSORYEVALUATIONDATE", "CHEMICALPHYSICALEVALUATIONDATE", "MICROBIOLOGYEVALUATIONDATE"];
    if (dateCats.includes(txtCategory)) {
        if (!dtmStartDate || !dtmEndDate) {
            if (typeof clsGlobal.setMessageWarning === 'function') {
                clsGlobal.setMessageWarning("Start Date and End Date Must be Filled for Export!");
            } else {
                alert("Start Date and End Date Must be Filled!");
            }
            return;
        }
    }

    clsGlobal.getConfirmation("Download Data Dashboard?", function (result) {
        if (result == true) {

            var searchParam = {
                txtpic: "",
                startDate: dtmStartDate,
                endDate: dtmEndDate,
                txtCategory: txtCategory,
                txtFilter: txtValue
            };

            $.ajax({
                type: "POST",
                url: "/SLS/Dashboard/ExportSLSList",
                data: {
                    __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val(),
                    Param: JSON.stringify(searchParam),
                },
                datatype: "json",
                success: function (retDat, status, xhr) {
                    clsGlobal.hideLoading();
                    if (xhr.responseText.includes("!DOCTYPE html")) {
                        clsGlobal.swalWarningRedirect("You're Session has been Ended, Please Re-Login !", window.location.href);
                    }
                    else {
                        if (retDat.bitSuccess == true) {
                            window.open(`/SLS/Dashboard/DownloadSLSList?file=${encodeURIComponent(retDat.objData)}`);
                        }
                        else {
                            if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                                clsGlobal.swalWarning(retDat.txtMessage);
                            }
                            else {
                                clsGlobal.swalError(retDat.txtMessage);
                            }
                        }
                    }
                },
                error: function (xhr, status, error) {
                    clsGlobal.hideLoading();
                    clsGlobal.swalError(xhr.responseText);
                }
            });
        }
    });
}

function p_redirectToStabilityRequest() {
    window.location.href = baseUrl + "/StabilityRequestForm/Index";
}

//=======================
// 4. HANDLERS
//=======================
$('#buttonDelete').click(function () {
    // Reset form filter
    $("#txtFilter").val("").trigger('change');
    $("#txtSearchValue").val("");
    $("#dtmStartDateSearch").val("");
    $("#dtmEndDateSearch").val("");

    // Refresh Table
    $('#dataTableDashboard').DataTable().draw();
});

$('#buttonSearch').click(function () {
    var cat = $("#txtFilter").val();
    var start = $("#dtmStartDateSearch").val();
    var end = $("#dtmEndDateSearch").val();

    // Validasi Wajib Isi Tanggal
    var dateCategories = [
        "SENSORYEVALUATIONDATE",
        "CHEMICALPHYSICALEVALUATIONDATE",
        "MICROBIOLOGYEVALUATIONDATE"
    ];

    if (dateCategories.includes(cat)) {
        if (!start || !end) {
            if (typeof clsGlobal.setMessageWarning === 'function') {
                clsGlobal.setMessageWarning("Start Date and End Date Must be Filled!");
            } else {
                alert("Start Date and End Date Must be Filled!");
            }
            return;
        }
    }

    $('#dataTableDashboard').DataTable().draw();
});

//=======================
// 5. DATATABLE CONFIG
//=======================
$('#dataTableDashboard').DataTable({
    serverSide: true,
    fixedColumns: { left: 2 },
    destroy: true,
    ordering: true,
    scrollCollapse: true,
    pageLength: 10,
    scrollX: true,
    autoWidth: false,
    search: {
        return: true
    },
    scrollY: '400px',
    scrollX: true,
    ajax: {
        type: "POST",
        url: '/SLS/Dashboard/DTSLSList',
        beforeSend: function (request) {
            if ($('input[name=__RequestVerificationToken]').length > 0) {
                request.setRequestHeader("RequestVerificationToken", $('input[name=__RequestVerificationToken]').val());
            }
        },
        contentType: 'application/json',
        data: function (d) {
            var searchParam = {
                txtpic: "",
                startDate: clsGlobal.parseToString($("#dtmStartDateSearch").val()),
                endDate: clsGlobal.parseToString($("#dtmEndDateSearch").val()),
                txtCategory: $("#txtFilter").val(),
                txtFilter: $("#txtSearchValue").val().toUpperCase()
            };
            d.CustomSearch = searchParam;
            return JSON.stringify(d);
        },
        dataSrc: function (retDat, status, xhr) {
            if (xhr.responseText.includes("!DOCTYPE html")) {
                clsGlobal.swalWarningRedirect("You're Session has been Ended, Please Re-Login !", window.location.href);
            }
            else {
                if (retDat.bitSuccess === false) { return []; }
                return retDat.data;
            }
        }
    },
    order: [[1, 'desc']],
    columns: [
        {
            data: 'bitisspec',
            orderable: false,
            className: 'text-center',
            width: '50px',
            render: function (data) {
                if (data === true || data === 'true' || data === 1) {
                    return `<i class="ti ti-star-filled text-warning" style="font-size: 1.2rem;"></i>`;
                }
                return '';
            }
        },
        {
            data: 'txtrequestnumber',
            name: 'Txtrequestnumber',
            width: '140px',
            render: function (data) {
                return `<a href="${baseUrl}/StabilityRequestForm/Index?RequestNo=${data}" class="fw-bold text-primary text-decoration-none">${data}</a>`;
            },
        },
        {
            data: 'txtpic',
            name: 'Txtpic',
            width: '120px'
        },
        {
            data: 'txtconceptnumber',
            name: 'Txtconceptnumber',
            width: '120px'
        },
        {
            data: 'txtprojectnumber',
            name: 'Txtprojectnumber',
            width: '120px'
        },
        {
            data: 'formproductinformations[0].txtprojectbackground',
            orderable: false,
            render: function (data) {
                if (!data) return '';
                return data.length > 20 ? `<span title="${data}" style="cursor:help;">${data.substr(0, 20)}...</span>` : data;
            }
        },
        {
            data: 'txtitemcode',
            name: 'Txtitemcode',
            width: '100px'
        },
        {
            data: 'txtitemdescription',
            name: 'Txtitemdescription',
            width: '200px',
            render: function (data) {
                if (!data) return '';
                return data.length > 30 ? `<span title="${data}" style="cursor:help;">${data.substr(0, 30)}...</span>` : data;
            }
        },
        {
            data: 'txtproducttype',
            name: 'Txtproducttype',
            width: '100px'
        },
        {
            data: 'formproductinformations[0].txtprojecttype',
            orderable: false,
            width: '100px'
        },
        {
            data: 'formproductinformations[0].txtpackagingspecification',
            orderable: false,
            width: '100px'
        },
        {
            data: 'formmethodologies[0].txtmethodology',
            orderable: false,
            width: '100px'
        },
        {
            data: null,
            orderable: false,
            width: '100px',
            render: function (d) {
                var m = d.formmethodologies[0];
                return m.txtincubatorchamber || m.txtcontrolroom || m.txtwarehouse || '';
            }
        },
        {
            data: 'txtdocumentstatus',
            orderable: false,
            className: 'text-center',
            width: '130px',
            render: function (data) {
                return renderBadgeStatus(data);
            }
        },
        {
            data: 'ongoingreportstatuses[0].dtmsensoryevaluationdate',
            orderable: false,
            className: 'text-center',
            render: function (d) { return formatDate(d); }
        },
        {
            data: 'ongoingreportstatuses[0].txtsensoryevaluationremarks',
            orderable: false,
            className: 'text-center',
            render: function (d) { return renderStatusEval(d); }
        },
        {
            data: 'ongoingreportstatuses[0].dtmphysicalchemicaldate',
            orderable: false,
            className: 'text-center',
            render: function (d) { return formatDate(d); }
        },
        {
            data: 'ongoingreportstatuses[0].txtphysicalchemicalremarks',
            orderable: false,
            className: 'text-center',
            render: function (d) { return renderStatusEval(d); }
        },
        {
            data: 'ongoingreportstatuses[0].dtmmicrobiologydate',
            orderable: false,
            className: 'text-center',
            render: function (d) { return formatDate(d); }
        },
        {
            data: 'ongoingreportstatuses[0].txtmicrobiologyremarks',
            orderable: false,
            className: 'text-center',
            render: function (d) { return renderStatusEval(d); }
        },
        {
            data: 'txtdocumentstatus',
            name: 'Txtdocumentstatus',
            orderable: false,
            className: 'text-center',
            render: function (d) {
                return (d.toUpperCase() === 'APPROVED') ? renderStatusReport('DONE') : renderStatusReport(d);
            }
        },
    ],
    language: {
        search: "Quick Search:",
        lengthMenu: "Show _MENU_"
    }
});


//=======================
// 6. HELPER RENDERERS
//=======================

function renderBadgeStatus(data) {
    let badgeClass = 'bg-secondary';
    let customStyle = 'min-width: 120px; cursor: pointer;';
    let textColor = 'text-white';

    switch (data) {
        case DRAFT:
            badgeClass = 'bg-secondary';
            break;
        case APPROVED:
            badgeClass = 'bg-success';
            break;
        case ADMINREVIEW:
            badgeClass = 'bg-warning';
            break;
        case ONGOINGEVALUATION:
            badgeClass = 'bg-danger';
            break;
        case WAITINGFORSUPPERIORAPPROVAL:
            badgeClass = 'bg-info';
            break;
        case WAITINGFORSUPPERIORREQUESTOPRAPPROVAL:
            badgeClass = '';
            customStyle += 'background-color: #7367f0;';
            break;
        case REQUESTREPORT:
            badgeClass = '';
            customStyle += 'background-color: #ffff00;';
            textColor = 'text-dark';
            break;
        case CANCELLED:
        case TERMINATE:
            badgeClass = '';
            customStyle += 'background-color: #0d0d0c;';
            break;
        default:
            return data;
    }

    return `<h6 class="mb-0">
                <span class="badge ${badgeClass} ${textColor} px-3 py-2 mx-auto rounded-2 text-uppercase btnRediect" 
                      style="${customStyle}">
                    ${data}
                </span>
            </h6>`;
}

function renderStatusReport(status) {
    if (!status) return '';

    var badgeClass = 'bg-secondary bg-opacity-10 text-white';

    if (status === 'DONE') {
        badgeClass = 'bg-success bg-opacity-10 text-white';
    }
    else if (status === REQUESTREPORT) {
        badgeClass = 'bg-warning bg-opacity-10 text-white';
        status = 'ON PROGRESS';
    }
    else if (status === WAITINGFORSUPPERIORAPPROVAL || status === WAITINGFORSUPPERIORAPPROVAL) {
        badgeClass = 'bg-warning bg-opacity-10 text-white';
        status = 'ON PROGRESS';
    }
    else if (status === CANCELLED) {
        badgeClass = 'bg-dark bg-opacity-10 text-white';
        status = 'CANCELLED';
    }
    else {
        badgeClass = 'bg-secondary bg-opacity-10 text-white';
        status = 'INCOMPLETE';
    }

    return `<h6>
                <span class="badge ${badgeClass} px-3 py-2 mx-auto rounded-2 text-uppercase" style="min-width: 100px;">
                    ${status}
                </span>
            </h6>`;
}

function renderStatusEval(status) {
    if (!status) return '';

    var badgeClass = 'bg-secondary bg-opacity-10 text-white';

    if (status === 'DONE') {
        badgeClass = 'bg-success bg-opacity-10 text-white';
    }
    else if (status === 'ON PROGRESS') {
        badgeClass = 'bg-warning bg-opacity-10 text-white';
    }

    return `<h6>
                <span class="badge ${badgeClass} px-3 py-2 mx-auto rounded-2 text-uppercase" style="min-width: 100px;">
                    ${status}
                </span>
            </h6>`;
}

function formatDate(dateString) {
    if (!dateString) return '';
    var d = new Date(dateString);
    return moment(d).format("DD-MM-YYYY");
}
"use strict";

// =========================================================================
// GLOBAL VARIABLES
// =========================================================================
var clsGlobal = new clsGlobalClass();
var oTable;
var DataInTable = [];
var oTableListProjectI2ms;
var currentViewMode = 'general';

// =========================================================================
// 1. ON PAGE LOAD & EVENT LISTENERS
// =========================================================================
$(document).ready(function () {

    f_UpdateDashboardCounters();
    p_InitForm();
    fetchPendingTaskCount();

    $('.search-input-clean').on('keyup change', function (e) {
        if (e.type === 'change' || e.keyCode === 13) {
            f_BindingGrid();
        }
    });

    $('#btnRefresh').on('click', function (e) {
        e.preventDefault();

        // 1. Reset Filter Status (Penting biar active card balik ke Total)
        $('#StatusSearch').val('');

        // 2. Reset Text Search lain (Opsional, biar bersih)
        $('.search-input-clean').val('');

        // 3. Reload Grid & Dashboard
        // Dashboard akan otomatis detect filter kosong -> Highlight Card TOTAL
        f_BindingGrid();
        f_UpdateDashboardCounters(currentViewMode);
    });

    $('#btnExport').on('click', function (e) {
        e.preventDefault();
        ExportExcel();
    });

    oTable.on('processing.dt', function (e, settings, processing) {
        if (processing) {
            // Pas lagi loading, disable klik DAN sembunyiin isinya
            $('#dataTableVerFor').addClass('table-disabled');
            $('#dataTableVerFor tbody').css('opacity', '0'); // ILANGIN DULU
        } else {
            $('#dataTableVerFor').removeClass('table-disabled');
            // Pas kelar, munculin pelan-pelan biar smooth
            $('#dataTableVerFor tbody').animate({ opacity: 1 }, 300);
        }
    });

    $('#viewModeToggle input[name="viewMode"]').on('change', function () {
        currentViewMode = $(this).val();

        // Reload Table (Filter Status tetap dipertahankan valuenya di #StatusSearch)
        if (typeof oTable !== 'undefined' && oTable) {
            oTable.draw();
        }

        // Reload Dashboard (Angka update sesuai mode, Card Active disesuaikan)
        f_UpdateDashboardCounters(currentViewMode);
    });
});

// =========================================================================
// 2. DASHBOARD & COUNTER FUNCTIONS
// =========================================================================

function fetchPendingTaskCount() {
    dontBlock = true;
    $.ajax({
        url: '/VerFor/GetPendingTaskCount',
        type: 'POST',
        beforeSend: function (request) {
            if ($('input[name=__RequestVerificationToken]').length > 0) {
                request.setRequestHeader("RequestVerificationToken", $('input[name=__RequestVerificationToken]').val());
            }
        },
        success: function (retDat) {
            dontBlock = false;
            if (retDat.bitSuccess) {
                let data = retDat.objData;
                if (typeof data === 'string') {
                    try { data = JSON.parse(data); } catch (e) { }
                }

                let countVal = data.count !== undefined ? data.count : data;
                $('#pendingCount').text(countVal);
            }
        },
        error: function (xhr, status, error) {
            dontBlock = false;
            console.error('Error fetching pending count:', error);
            $('#pendingCount').text('0');
        }
    });
}

function f_UpdateDashboardCounters(viewMode = currentViewMode) {
    const cards = [
        { id: '#cardBodyTotal', label: 'TOTAL', icon: 'ti-files', color: 'dark', filterVal: '' },
        { id: '#cardBodyReq', label: 'REQUESTED', icon: 'ti-file-plus', color: 'secondary', filterVal: 'REQUESTED' },
        { id: '#cardBodyVerForProg', label: 'VERVOR - PROGRESS', icon: 'ti-loader', color: 'info', filterVal: 'VERFOR-PROCESS' },
        { id: '#cardBodyIngProg', label: 'ING - PROGRESS', icon: 'ti-loader', color: 'info', filterVal: 'ING-PROCESS' },
        { id: '#cardBodyRev', label: 'REVISION', icon: 'ti-alert-triangle', color: 'warning', filterVal: 'REVISION' },
        { id: '#cardBodyCancel', label: 'CANCELLED', icon: 'ti-x', color: 'danger', filterVal: 'CANCELLED' },
        { id: '#cardBodyVerForAppr', label: 'VERFOR - APPROVED', icon: 'ti-check', color: 'success', filterVal: 'VERFOR-APPROVED' },
        { id: '#cardBodyIngAppr', label: 'ING - APPROVED', icon: 'ti-check', color: 'success', filterVal: 'ING-APPROVED' },
    ];

    cards.forEach(card => {
        const skeletonHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div class="w-100">
                    <div class="skeleton-box sk-text" style="width: 60%;"></div>
                    <div class="skeleton-box sk-number mt-1" style="width: 40%;"></div>
                </div>
                <div class="skeleton-box sk-circle flex-shrink-0 ms-3"></div>
            </div>
        `;
        $(card.id).html(skeletonHTML);
    });

    dontBlock = true;
    $.ajax({
        type: "POST",
        url: base_path + '/VerFor/GetOutStandingReqVerFor',
        data: {
            viewMode: viewMode
        },
        beforeSend: function (request) {
            if ($('input[name=__RequestVerificationToken]').length > 0) {
                request.setRequestHeader("RequestVerificationToken", $('input[name=__RequestVerificationToken]').val());
            }
        },
        success: function (retDat) {
            dontBlock = false;
            if (retDat.bitSuccess == true) {

                let data = {};
                try {
                    data = JSON.parse(retDat.objData);
                } catch (e) {
                    console.error("Gagal parse JSON dashboard:", e);
                    data = { TotalDocs: 0, TotalRequested: 0, TotalInProgress: 0, TotalInProgressING: 0, TotalRev: 0, TotalCancel: 0, TotalAppr: 0, TotalApprING: 0 };
                }

                console.log(data);
                const values = [
                    data.TotalDocs,
                    data.TotalRequested,
                    data.TotalInProgress,
                    data.TotalInProgressING,
                    data.TotalRev,
                    data.TotalCancel,
                    data.TotalAppr,
                    data.TotalApprING
                ];

                let currentFilter = $('#StatusSearch').val() || "";

                cards.forEach((card, index) => {
                    const realValue = formatNumber(values[index]);

                    const realHTML = `
                                        <div class="d-flex justify-content-between align-items-center animate__animated animate__fadeIn">
                                            <div class="w-100 overflow-hidden"> <span class="text-muted small text-uppercase fw-bold text-nowrap d-block text-truncate" 
                                                      style="font-size: 10px; letter-spacing: 0.5px;" 
                                                      title="${card.label}"> ${card.label}
                                                </span>
                                                <h2 class="mb-0 fw-bold mt-1 text-${card.color}" style="font-size: 1.8rem;">${realValue}</h2>
                                            </div>
                                            <div class="bg-${card.color} bg-opacity-10 p-2 rounded-circle text-white d-flex align-items-center justify-content-center flex-shrink-0 ms-2" 
                                                 style="width: 42px; height: 42px;">
                                                <i class="ti ${card.icon} fs-5"></i>
                                            </div>
                                        </div>
                                    `;

                    let $cardEl = $(card.id);
                    $cardEl.html(realHTML);

                    let $parentCard = $cardEl.closest('.card');

                    $parentCard.removeClass('card-selected');

                    if (card.filterVal === currentFilter) {
                        $parentCard.addClass('card-selected');
                    }
                });

            } else {
                clsGlobal.swalError(retDat.txtMessage || "Gagal mengambil data dashboard.");
                f_ResetCounters();
            }
        },
        error: function (xhr, status, error) {
            dontBlock = false;
            if (xhr.responseText && xhr.responseText.includes("!DOCTYPE html")) {
                clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
            } else {
                console.error("Error Dashboard:", xhr.responseText);
                f_ResetCounters();
            }
        }
    });
}

function f_FilterByCard(element, statusKeyword) {
    $('.card-filter-status').removeClass('card-selected');
    $(element).find('.card').addClass('card-selected');

    $('#StatusSearch').val(statusKeyword);

    f_BindingGrid();

    $('html, body').animate({
        scrollTop: $("#VerForPanel").offset().top - 100
    }, 500);
}

function f_ResetCounters() {
    const selectors = ['#cardBodyTotal', '#cardBodyReq', '#cardBodyVerForProg', '#cardBodyIngProg', '#cardBodyRev', '#cardBodyCancel', '#cardBodyVerForAppr', '#cardBodyIngAppr'];
    selectors.forEach(sel => {
        $(sel).find('h2').text('0');
    });
}

// =========================================================================
// 3. DATATABLE CONFIGURATION
// =========================================================================
function f_BindingGrid() {
    dontBlock = true;

    if ($.fn.DataTable.isDataTable('#dataTableVerFor')) {
        $('#dataTableVerFor tbody').css('opacity', 0);

        $('#dataTableVerFor').DataTable().clear().destroy();

        $('#dataTableVerFor tbody').empty();
    }

    oTable = $("#dataTableVerFor").DataTable({
        "bPaginate": true,
        serverSide: true,
        processing: true,
        destroy: true,
        scrollX: true,
        scrollY: "400px",
        scrollCollapse: true,
        autoWidth: false,
        pageLength: 10,
        lengthMenu: [5, 10, 25, 50, 100],
        order: [[1, 'desc']],
        orderCellsTop: true,
        "drawCallback": function (settings) {
            $('#dataTableVerFor tbody').css('opacity', 1);
        },
        dom: 'rt<"d-flex justify-content-between align-items-center px-3 pb-3"ilp>',
        ajax: {
            type: "POST",
            url: base_path + '/VerFor/DTVerForList',
            contentType: 'application/json',
            error: function (xhr, error, code) {
                dontBlock = false;
                if (xhr.responseText && xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                } else {
                    if (error !== 'abort') clsGlobal.swalError("Gagal memuat data tabel.");
                }
            },
            dataSrc: function (retDat) {
                dontBlock = false;
                if (retDat.bitSuccess == false) {
                    if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                        clsGlobal.swalWarning(retDat.objData);
                    } else {
                        clsGlobal.swalError(retDat.txtMessage);
                    }
                    return [];
                } else {
                    DataInTable = retDat.dataSerialize;
                    return retDat.data;
                }
            },
            beforeSend: function (request) {
                dontBlock = true;
                // Pastikan opacity 0 pas request mulai
                $('#dataTableVerFor tbody').css('opacity', 0);

                if ($('input[name=__RequestVerificationToken]').length > 0) {
                    request.setRequestHeader("RequestVerificationToken", $('input[name=__RequestVerificationToken]').val());
                }
            },
            data: function (d) {
                dontBlock = true;
                var objsearch = {
                    Search1: $("#ProjectNoSearch").val() || "",
                    Search2: $("#VerForNoSearch").val() || "",
                    Search3: $("#RequestDateSearch").val() || "",
                    Search4: $("#StatusSearch").val() || "",
                    Search5: $("#ProjectTypeSearch").val() || "",
                    Search6: $("#BrandSearch").val() || "",
                    Search7: $("#SubBrandSearch").val() || "",
                    Search8: $("#VariantSearch").val() || "",
                    Search9: $("#FoodCategorySearch").val() || "",
                    Search10: $("#CreatedBySearch").val() || "",
                    Search11: $("#CreatedDateSearch").val() || "",
                    Search12: $("#UpdatedBySearch").val() || "",
                    Search13: $("#UpdatedDateSearch").val() || ""
                }
                d.searchField = objsearch;
                d.viewMode = currentViewMode;
                return JSON.stringify(d);
            }
        },
        columns: [
            {
                data: 'i2MSNumber',
                className: 'dt-left fw-bold text-black text-nowrap',
                name: 'I2MSNumber',
                width: '180px',
                orderable: true,
                render: function (data) {
                    return `<div style="min-width: 180px;">${data}</div>`;
                }
            },
            {
                data: 'verForNumber',
                className: 'dt-left fw-bold text-dark text-nowrap',
                name: 'RequestDate',
                width: '180px',
                orderable: true,
                render: function (data, type, row, meta) {
                    let SelectedId = row.verForId;
                    return `<div style="min-width: 180px;">
                                <a href="javascript:void(0);" onclick="FormulaHeaderHeader.ShowDetail('${SelectedId}')"> ${data}</a>
                            </div>`;
                }
            },
            {
                data: 'requestDate',
                className: 'dt-center text-nowrap',
                name: 'RequestDate',
                width: '120px',
                orderable: true,
                render: function (data) {
                    return `<div style="min-width: 120px;">${(data && moment(data).isValid()) ? moment(data).format("DD MMM YYYY HH:mm") : "-"}</div>`;
                }
            },
            {
                data: 'status',
                className: 'dt-center text-nowrap',
                name: 'Status',
                width: '180px',
                orderable: true,
                render: function (data) {
                    return `<div style="min-width: 120px;">${f_RenderStatusBadge(data)}</div>`;
                }
            },
            { data: 'projectType', className: 'dt-left text-nowrap', name: 'ProjectType', orderable: true, defaultContent: '' },
            { data: 'brand', className: 'dt-left text-nowrap', name: 'Brand', orderable: true, defaultContent: '' },
            {
                data: 'subBrand',
                className: 'dt-left',
                name: 'SubBrand',
                orderable: true,
                render: function (data) {
                    if (!data) return "";
                    return `<div class="text-truncate" style="max-width: 150px;" title="${data}">${data}</div>`;
                }
            },
            {
                data: 'variantCode',
                className: 'dt-left',
                name: 'VariantCode',
                orderable: true,
                render: function (data) {
                    if (!data) return "";
                    return `<div class="text-truncate" style="max-width: 150px;" title="${data}">${data}</div>`;
                }
            },
            {
                data: 'foodCategoryName',
                className: 'dt-left',
                name: 'FoodCategoryName',
                orderable: true,
                render: function (data) {
                    if (!data) return "";
                    return `<div class="text-truncate" style="max-width: 150px;" title="${data}">${data}</div>`;
                }
            }
        ]
    });
}

// =========================================================================
// 4. HELPER FUNCTIONS
// =========================================================================

function p_InitForm() {
    if (typeof Id === 'undefined' || Id == "" || Id == null) {
        f_ShowListVerFor();
        f_BindingGrid();
    } else {
        f_ShowDetailFormula();
        if (typeof FormulaHeaderHeader !== 'undefined') {
            FormulaHeaderHeader.Init();
            FormulaHeaderHeader.ShowDetail(Id);
        }
    }
}

function f_CallShowDetail(id) {
    if (typeof FormulaHeaderHeader !== 'undefined' && typeof FormulaHeaderHeader.ShowDetail === 'function') {
        FormulaHeaderHeader.ShowDetail(id);
    } else {
        console.warn("FormulaHeaderHeader library belum dimuat/diimport.");
        f_ShowDetailFormula();
    }
}

function f_ShowDetailFormula() {
    $('#VerForPanel').hide();
    $('#FormDetailVerFor').show();
}

function f_ShowListVerFor() {
    $('#FormDetailVerFor').hide();
    $('#VerForPanel').show();
}

function f_RenderStatusBadge(statusRaw) {
    if (!statusRaw || statusRaw === null) {
        return '<span class="badge bg-light text-muted border">-</span>';
    }

    const status = statusRaw.toString().trim().toUpperCase();
    const label = statusRaw;

    let badgeClass = 'bg-light text-secondary border';

    if (status === 'REQUESTED') {
        badgeClass = 'bg-secondary text-white';
    }
    else if (status.includes('IN-PROGRESS') || status === 'IN PROGRESS') {
        badgeClass = 'bg-info text-white';
    }
    else if (status === 'SUBMITTED') {
        badgeClass = 'bg-info text-white';
    }
    else if (status.includes('REVISION')) {
        badgeClass = 'bg-warning text-white';
    }
    else if (status.includes('APPROVED')) {
        badgeClass = 'bg-success text-white';
    }
    else if (status.includes('ING')) {
        if (status.includes('SUBMITTED')) {
            badgeClass = 'bg-info bg-opacity-75 text-white border border-info';
        } else {
            badgeClass = 'bg-info bg-opacity-75 text-white';
        }
    }
    else if (status === "CANCELLED") {
        badgeClass = 'bg-danger text-white';
    }

    return `<span class="badge rounded-pill ${badgeClass} status-badge shadow-sm">${label}</span>`;
}

function formatNumber(num) {
    if (!num) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function ExportExcel() {
    var objsearch = {
        Search1: $("#ProjectNoSearch").val() || "",
        Search2: $("#VerForNoSearch").val() || "",
        Search3: $("#RequestDateSearch").val() || "",
        Search4: $("#StatusSearch").val() || "",
        Search5: $("#ProjectTypeSearch").val() || "",
        Search6: $("#BrandSearch").val() || "",
        Search7: $("#SubBrandSearch").val() || "",
        Search8: $("#VariantSearch").val() || "",
        Search9: $("#FoodCategorySearch").val() || "",
        Search10: $("#CreatedBySearch").val() || "",
        Search11: $("#CreatedDateSearch").val() || "",
        Search12: $("#UpdatedBySearch").val() || "",
        Search13: $("#UpdatedDateSearch").val() || ""
    }

    $.ajax({
        type: "POST",
        url: "/VerFor/ExportProjectList",
        data: {
            __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val(),
            Param: JSON.stringify(objsearch),
            viewMode: currentViewMode
        },
        datatype: "json",
        success: function (retDat, status, xhr) {
            clsGlobal.hideLoading();
            if (xhr.responseText.includes("!DOCTYPE html")) {
                clsGlobal.swalWarningRedirect("You're Session has been Ended, Please Re-Login !", window.location.href);
            }
            else {
                if (retDat.bitSuccess == true) {
                    window.open(`/VerFor/DownloadProjectList?file=${encodeURIComponent(retDat.objData)}`);
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
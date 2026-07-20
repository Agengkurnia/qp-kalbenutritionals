"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var programCode = '';
//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    p_InitForm();
    initializeAturanKlaimMenuState();
});

//=======================
// FUNCTION
//=======================
function normalizeAturanKlaimUrl(path) {
    if (typeof base_path === 'undefined' || base_path === null) {
        return path;
    }

    var sanitizedBase = base_path.replace(/\/+$/, '');
    var sanitizedPath = path.startsWith('/') ? path : '/' + path;
    return sanitizedBase + sanitizedPath;
}

function initializeAturanKlaimMenuState() {
    if (typeof localStorage === 'undefined') {
        return;
    }

    var currentPath = window.location.pathname.toLowerCase();
    if (currentPath.includes('/master/aturanklaim') || currentPath.includes('/master/aturanklaim/')) {
        var indexUrl = normalizeAturanKlaimUrl('/Master/AturanKlaim/Index');
        localStorage.setItem('urlMenu', indexUrl);
        localStorage.setItem('prevurlMenu', indexUrl);
    }
}

function updateAturanKlaimMenuState(targetPath) {
    if (typeof localStorage === 'undefined') {
        return;
    }

    var indexUrl = normalizeAturanKlaimUrl('/Master/AturanKlaim/Index');
    var targetUrl = normalizeAturanKlaimUrl(targetPath);

    localStorage.setItem('prevurlMenu', indexUrl);
    localStorage.setItem('urlMenu', targetUrl);
}

function p_InitForm() {
    p_MasterAturanKlaim();
}

function p_MasterAturanKlaim() {
    var table = $("#dataTableAturanKlaim").DataTable({
        "bPaginate": true,
        scrollY: "400px",
        "type": "POST",
        scrollX: "100%",
        lengthMenu: [5, 10, 25, 50, 100],
        "iDisplayLength": 10,
        serverSide: true,
        destroy: true,
        retrieve: true,
        order: [[0, 'asc']],
        orderCellsTop: true,
        scrollCollapse: true,
        dom: '<"row mb-2"<"col-sm-6"l><"col-sm-6 d-flex justify-content-end align-items-center"f>>rt<"bottom"ip><"clear">',
        ajax: {
            type: "POST",
            url: base_path + '/Master/AturanKlaim/GetDataTable',
            contentType: 'application/json',
            dataSrc: function (retDat) {
                // Check if response has bitSuccess wrapper (error case)
                if (retDat.bitSuccess === false) {
                    if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                        clsGlobal.swalWarning(retDat.objData);
                    }
                    else {
                        clsGlobal.swalError(retDat.txtMessage);
                    }
                    return [];
                }
                // Check if response has bitSuccess wrapper (success case)
                if (retDat.bitSuccess === true && retDat.data) {
                    // Extract metadata from nested structure and set at top level for DataTables
                    // DataTables with serverSide: true expects recordsTotal and recordsFiltered at top level
                    retDat.recordsTotal = retDat.data.recordsTotal;
                    retDat.recordsFiltered = retDat.data.recordsFiltered;
                    retDat.draw = retDat.data.draw;
                    // Return the data array
                    return retDat.data.data;
                }
                // Direct DataTable format (no wrapper) - for compatibility
                if (retDat.draw !== undefined && retDat.data) {
                    return retDat.data;
                }
                return [];
            },
            beforeSend: function (request) {
                var token = $('input[name=__RequestVerificationToken]').val() || $('#FormDashboard input[name=__RequestVerificationToken]').val();
                if (token) {
                    request.setRequestHeader("RequestVerificationToken", token);
                }
            },
            data: function (d) {
                // Build searchField object from filter inputs
                var objsearch = {
                    Search1: $("#ParameterSearch").val() || "",
                    Search2: $("#TypeClaimENGSearch").val() || "",
                    Search3: $("#TypeClaimINASearch").val() || "",
                    Search4: $("#PersyaratanSearch").val() || "",
                    Search5: $("#StatusSearch").val() || "",
                    Search6: $("#CreatedBySearch").val() || "",
                    Search7: $("#UpdatedBySearch").val() || ""
                };

                d.searchField = objsearch;
                return JSON.stringify(d);
            },
            datatype: "json",
            error: function (xhr, status, error) {
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                }
                else {
                    clsGlobal.swalError(xhr.responseText);
                }
            }
        },
        searching: false,
        columns: [
            {
                data: 'parameter',
                name: 'Parameter',
                render: function (data, type, row, meta) {
                    var encyptedData = row.encryptedData;
                    return '<a href="#" onclick="redirectButton(\'' + encyptedData + '\'); return false;">' + (data || '-') + '</a>';
                }
            },
            {
                data: 'typeClaimENG',
                name: 'TypeClaimENG'
            },
            {
                data: 'typeClaimINA',
                name: 'TypeClaimINA'
            },
            {
                data: 'persyaratan',
                name: 'Persyaratan'
            },
            {
                data: 'active',
                name: 'Active',
                render: function (data, type, full, meta) {
                    // For filtering, return the raw value
                    if (type === 'filter' || type === 'type') {
                        return (data == 'Active' || data === true) ? 'Active' : 'Inactive';
                    }
                    // For display, return the badge
                    if (data == 'Active' || data === true) {
                        return '<span class="badge bg-primary">Active</span>';
                    } else {
                        return '<span class="badge bg-danger">Inactive</span>';
                    }
                },
            },
            {
                data: 'createdBy',
                name: 'CreatedBy'
            },
            {
                data: 'updatedBy',
                name: 'UpdatedBy'
            },
        ],
        initComplete: function () {
            // Bind search button click event after DataTable is initialized
            $('#dataTableAturanKlaim').closest('.table-responsive').find('.btn-search').off('click').on('click', function (e) {
                e.preventDefault();
                table.draw();
            });

            // Dynamic width input filter + grow kolom (same as Regal)
            $('#dataTableAturanKlaim').closest('.table-responsive').find('.input-group.dynamic-input input').each(function() {
                var input = this;
                
                // Remove existing listeners to avoid duplicates
                $(input).off('input keyup');
                
                // Dynamic width on input
                $(input).on('input', function () {
                    const tableEl = document.querySelector('#dataTableAturanKlaim');
                    const dtTable = $('#dataTableAturanKlaim').DataTable();

                    const tempSpan = document.createElement('span');
                    tempSpan.style.visibility = 'hidden';
                    tempSpan.style.position = 'absolute';
                    tempSpan.style.whiteSpace = 'pre';
                    tempSpan.style.font = window.getComputedStyle(this).font;
                    tempSpan.textContent = this.value || this.placeholder;
                    document.body.appendChild(tempSpan);

                    const newWidth = Math.max(100, tempSpan.offsetWidth + 40);
                    this.style.width = newWidth + 'px';
                    document.body.removeChild(tempSpan);

                    tableEl.style.tableLayout = 'auto';
                    dtTable.columns.adjust();

                    if (this.value.trim() === '') {
                        this.style.width = '100px';
                        tableEl.style.tableLayout = 'fixed';
                        dtTable.columns.adjust();
                    }
                });

                // Allow Enter key to trigger search
                $(input).on('keyup', function (e) {
                    if (e.keyCode === 13 || e.which === 13) {
                        e.preventDefault();
                        table.draw();
                    }
                });
            });
        }
    });
}

function redirectButton(param) {
    var targetPath = `/Master/AturanKlaim/Detail?param=${encodeURIComponent(param)}`;
    updateAturanKlaimMenuState(targetPath);
    window.location.href = normalizeAturanKlaimUrl(targetPath);
}

$("#btnNew").on('click', function (e) {
    e.preventDefault();
    var targetPath = '/Master/AturanKlaim/Detail';
    updateAturanKlaimMenuState(targetPath);
    window.location.href = normalizeAturanKlaimUrl(targetPath);
});


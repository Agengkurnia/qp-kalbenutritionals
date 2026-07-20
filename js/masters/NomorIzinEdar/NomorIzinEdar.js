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
    initializeNomorIzinEdarMenuState();
});

//=======================
// FUNCTION
//=======================
function normalizeNomorIzinEdarUrl(path) {
    if (typeof base_path === 'undefined' || base_path === null) {
        return path;
    }

    var sanitizedBase = base_path.replace(/\/+$/, '');
    var sanitizedPath = path.startsWith('/') ? path : '/' + path;
    return sanitizedBase + sanitizedPath;
}

function initializeNomorIzinEdarMenuState() {
    if (typeof localStorage === 'undefined') {
        return;
    }

    var currentPath = window.location.pathname.toLowerCase();
    if (currentPath === '/master/nomorizinedar' || currentPath === '/master/nomorizinedar/' || currentPath === '/master/nomorizinedar/index') {
        var indexUrl = normalizeNomorIzinEdarUrl('/Master/NomorIzinEdar/Index');
        localStorage.setItem('urlMenu', indexUrl);
        localStorage.setItem('prevurlMenu', indexUrl);
    }
}

function updateNomorIzinEdarMenuState(targetPath) {
    if (typeof localStorage === 'undefined') {
        return;
    }

    var indexUrl = normalizeNomorIzinEdarUrl('/Master/NomorIzinEdar/Index');
    var targetUrl = normalizeNomorIzinEdarUrl(targetPath);

    localStorage.setItem('prevurlMenu', indexUrl);
    localStorage.setItem('urlMenu', targetUrl);
}

function p_InitForm() {
    p_MasterNomorIzinEdar();
}


function p_MasterNomorIzinEdar() {
    var table = $("#dataTableNomorIzinEdar").DataTable({
        "bPaginate": true,
        scrollY: "400px",
        "type": "POST",
        scrollX: "100%",
        lengthMenu: [5, 10, 25, 50, 100],
        "iDisplayLength": 10,
        serverSide: true,
        destroy: true,
        retrieve: true,
        order: [[0, 'asc']], // Order by Nomor Izin Edar (first column)
        orderCellsTop: true,
        scrollCollapse: true,
        dom: '<"row mb-2"<"col-sm-6"l><"col-sm-6 d-flex justify-content-end align-items-center"f>>rt<"bottom"ip><"clear">',
        ajax: {
            type: "POST",
            url: base_path + '/Master/NomorIzinEdar/GetDataTable',
            contentType: 'application/json',
            dataSrc: function (retDat) {
                debugger
                // Check if response has error structure
                if (retDat.bitSuccess === false) {
                    if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                        clsGlobal.swalWarning(retDat.objData);
                    }
                    else {
                        clsGlobal.swalError(retDat.txtMessage);
                    }
                    return [];
                }
                // Check if response is DataTable format (draw, recordsTotal, recordsFiltered, data)
                if (retDat.draw !== undefined && retDat.data !== undefined) {
                    return retDat.data;
                }
                // Fallback: assume data is in retDat.data
                return retDat.data || [];
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
                    Search1: $("#NomorIzinEdarSearch").val() || "",
                    Search2: $("#BrandSearch").val() || "",
                    Search3: $("#SubBrandSearch").val() || "",
                    Search4: $("#NamaJenisSearch").val() || "",
                    Search5: $("#ManufacturerSearch").val() || "",
                    Search6: $("#AlamatPabrikSearch").val() || "",
                    Search7: $("#CreatedBySearch").val() || "",
                    Search8: $("#UpdatedBySearch").val() || "",
                    Search9: $("#StatusSearch").val() || ""
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
                // Column 0: Nomor Izin Edar (first column, clickable)
                data: 'nomorIzinEdar',
                name: 'NomorIzinEdar',
                render: function (data, type, row, meta) {
                    debugger;
                    var txtId = row.txtId || '';
                    var nomorIzinEdar = data || '';
                    return '<a href="#" onclick="redirectButton(\'' + txtId + '\'); return false;" style="text-decoration: underline; color: #007bff; cursor: pointer;">' + nomorIzinEdar + '</a>';
                }
            },
            {
                // Column 1: Brand
                data: 'brand',
                name: 'Brand'
            },
            {
                // Column 2: Sub Brand
                data: 'subBrand',
                name: 'SubBrand'
            },
            {
                // Column 3: Nama Jenis
                data: 'namaJenis',
                name: 'NamaJenis'
            },
            {
                // Column 4: Manufacturer
                data: 'manufacturer',
                name: 'Manufacturer'
            },
            {
                // Column 5: Alamat Pabrik
                data: 'alamatPabrik',
                name: 'AlamatPabrik'
            },
            {
                // Column 6: Created By
                data: 'createdBy',
                name: 'CreatedBy'
            },
            {
                // Column 7: Updated By
                data: 'updatedBy',
                name: 'UpdatedBy'
            },
            {
                // Column 8: Active Status
                data: 'active',
                name: 'Active',
                render: function (data, type, full, meta) {
                    // For filtering, return the raw value
                    if (type === 'filter' || type === 'type') {
                        return (data == true || data === true) ? 'Active' : 'Inactive';
                    }
                    // For display, return the badge
                    if (data == true || data === true) {
                        return '<span class="badge bg-primary">Active</span>';
                    } else {
                        return '<span class="badge bg-danger">Inactive</span>';
                    }
                },
            },
        ],
        initComplete: function () {
            // Bind search button click event after DataTable is initialized
            $('#dataTableNomorIzinEdar').closest('.table-responsive').find('.btn-search').off('click').on('click', function (e) {
                e.preventDefault();
                table.draw();
            });

            // Dynamic width input filter + grow kolom (same as Regal)
            $('#dataTableNomorIzinEdar').closest('.table-responsive').find('.input-group.dynamic-input input').each(function () {
                var input = this;

                // Remove existing listeners to avoid duplicates
                $(input).off('input keyup');

                // Dynamic width on input
                $(input).on('input', function () {
                    const tableEl = document.querySelector('#dataTableNomorIzinEdar');
                    const dtTable = $('#dataTableNomorIzinEdar').DataTable();

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
    var targetPath = `/Master/NomorIzinEdar/Detail?param=${encodeURIComponent(param)}`;
    updateNomorIzinEdarMenuState(targetPath);
    window.location.href = normalizeNomorIzinEdarUrl(targetPath);
}


$("#btnNew").on('click', function (e) {
    e.preventDefault();
    var targetPath = '/Master/NomorIzinEdar/Detail';
    updateNomorIzinEdarMenuState(targetPath);
    window.location.href = normalizeNomorIzinEdarUrl(targetPath);
});


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
    initializeManufacturerMenuState();
});

//=======================
// FUNCTION
//=======================
function normalizeManufacturerUrl(path) {
    if (typeof base_path === 'undefined' || base_path === null) {
        return path;
    }

    var sanitizedBase = base_path.replace(/\/+$/, '');
    var sanitizedPath = path.startsWith('/') ? path : '/' + path;
    return sanitizedBase + sanitizedPath;
}

function initializeManufacturerMenuState() {
    if (typeof localStorage === 'undefined') {
        return;
    }

    var currentPath = window.location.pathname.toLowerCase();
    if (currentPath === '/manufacturer' || currentPath === '/manufacturer/' || currentPath === '/manufacturer/index') {
        var indexUrl = normalizeManufacturerUrl('/Manufacturer/Index');
        localStorage.setItem('urlMenu', indexUrl);
        localStorage.setItem('prevurlMenu', indexUrl);
    }
}

function updateManufacturerMenuState(targetPath) {
    if (typeof localStorage === 'undefined') {
        return;
    }

    var indexUrl = normalizeManufacturerUrl('/Manufacturer/Index');
    var targetUrl = normalizeManufacturerUrl(targetPath);

    localStorage.setItem('prevurlMenu', indexUrl);
    localStorage.setItem('urlMenu', targetUrl);
}

function p_InitForm() {
    p_MasterUser();
}


function p_MasterUser() {
    $("#dataTableManufacturer").DataTable({
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
        scrollCollapse: true,
        ajax: {
            type: "POST",
            url: base_path + '/Manufacturer/GetDataTable',
            contentType: 'application/json',
            dataSrc: function (retDat) {
                debugger
                if (retDat.bitSuccess == false) {
                    if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                        clsGlobal.swalWarning(retDat.objData);
                    }
                    else {
                        clsGlobal.swalError(retDat.txtMessage);
                    }
                }
                else {
                    return retDat.data;
                }
            },
            data: function (d) {
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
        searching: true,
        columns: [
            {
                data: 'manufacturer',
                render: function (data, type, row, meta) {
                    debugger;
                    var encyptedData = row.encryptedData;
                    return '<a href="#" onclick="redirectButton(\'' + encyptedData + '\'); return false;">' + data + '</a>';
                }
            },
            {
                data: 'description'
            },
            {
                data: 'address'
            },
            {
                data: 'ioCode',
            },
            {
                data: 'insertedBy',
            },
            {
                data: 'isActive',
                render: function (data, type, full, meta) {
                    if (data == true) {
                        return '<span class="badge bg-primary">Active</span>';
                    } else {
                        return '<span class="badge bg-danger">Inactive</span>';
                    }
                },
            },
        ],
    });
}


function redirectButton(param) {
    var targetPath = `/Manufacturer/Edit?param=${encodeURIComponent(param)}`;
    updateManufacturerMenuState(targetPath);
    window.open(normalizeManufacturerUrl(targetPath), '_blank');
}


$("#btnNew").on('click', function (e) {
    e.preventDefault();
    var targetPath = '/Manufacturer/Create';
    updateManufacturerMenuState(targetPath);
    window.location.href = normalizeManufacturerUrl(targetPath);
});
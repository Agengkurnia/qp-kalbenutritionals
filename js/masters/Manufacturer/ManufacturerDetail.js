"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    $(".select2").select2();

    $('.select2').css('width', "100%");

    synchronizeManufacturerDetailMenuState();

    if (msgSuccess !== "") {
        showMessageSucces(msgSuccess);
    }
});

function normalizeManufacturerDetailUrl(path) {
    if (typeof base_path === 'undefined' || base_path === null) {
        return path;
    }

    var sanitizedBase = base_path.replace(/\/+$/, '');
    var sanitizedPath = path.startsWith('/') ? path : '/' + path;
    return sanitizedBase + sanitizedPath;
}

function synchronizeManufacturerDetailMenuState() {
    if (typeof localStorage === 'undefined') {
        return;
    }

    var pathWithQuery = window.location.pathname + window.location.search;
    var currentUrl = normalizeManufacturerDetailUrl(pathWithQuery);
    var indexUrl = normalizeManufacturerDetailUrl('/Manufacturer/Index');

    localStorage.setItem('urlMenu', currentUrl);
    localStorage.setItem('prevurlMenu', indexUrl);
}

function showMessageSucces(msgSuccess) {
    debugger;
    var txtUrl = `${base_path}/Manufacturer`;
    clsGlobal.swalSuccessSaveOrSubmit(msgSuccess, txtUrl);
}
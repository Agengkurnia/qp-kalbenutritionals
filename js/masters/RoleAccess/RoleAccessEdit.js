"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    if (msgSuccess !== "") {
        showMessageSucces(msgSuccess);
    }
});

function showMessageSucces(msgSuccess) {
    debugger;
    var txtUrl = `${base_path}/RoleAccess`;
    clsGlobal.swalSuccessSaveOrSubmit(msgSuccess, txtUrl);
}
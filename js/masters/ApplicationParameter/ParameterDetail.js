"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    debugger;
    if (viewBagMsg !== "") {
        showSwalAlert(viewBagMsg);
    }
});

//=======================
// FUNCTION
//=======================
function showSwalAlert(txtMsg) {
    debugger;
    var txtUrl = `${base_path}/Master/Parameter/Index`;
    clsGlobal.swalSuccessSaveOrSubmit(txtMsg, txtUrl);
}

function validateInput(event) {
    const allowedValues = /^[a-zA-Z_0-9]$/; // Regular expression to match letters (a-z, A-Z) and numbers 0-1

    const inputValue = event.key;

    if (!allowedValues.test(inputValue)) {
        event.preventDefault(); // Prevent the input if it doesn't match the pattern
    }
}

//=======================
// HANDLER
//=======================
$("#TxtCode").keypress((e) => {
    validateInput(e);
});

$("#TxtVariable").keypress((e) => {
    validateInput(e);
});
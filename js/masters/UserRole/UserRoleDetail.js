"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    $(".select2").select2();
});

//=======================
// FUNCTION
//=======================

function setChooseLOV(txtValue) {

    var arr = txtValue.split('|');
    switch (arr[0]) {
        case MODULE_USER:
            //TODO
            setUser(arr);
            break;
    }
    clsGlobal.closeLOV();
}

function setUser(arr) {
    $("#intUserId").val(arr[1]);
    $("#username").val(arr[2]);
}

//=======================
// HANDLER
//=======================

$("#btnTxtUsername").on("click", () => {
    clsGlobal.generateLOV(MODULE_USER, "USER", "USER");
});

$("#roleCode").on("change", () => {
    let roleCode = $("#txtroleCode").val();
    var conceptName = $('#roleCode').find(":selected").text();
    var roleValue = $('#roleCode').find(":selected").val();

    if (roleCode != roleValue) {
        $("#isChangeFlag").val(true);
    }
    else {
        $("#isChangeFlag").val(false);
    }
});

$("#txtActiveStatus").on("change", () => {
    var selVal = $("#txtActiveStatus").is(":checked");

    if (selVal) {
        $("#bitActive").val("True");
    }
    else {
        $("#bitActive").val("False");
    }
});

$("#ProgramCode").on("select2:select", () => {
    console.log("tersecelt");
    var valSelect = $("#ProgramCode").find(":selected").val();
    $("#txtProgramCode").val(valSelect);
});
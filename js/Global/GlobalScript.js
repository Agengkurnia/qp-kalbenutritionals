"use strict";
//=======================
// CONSTANT
//=======================
var MODULE_MAIN = "MAIN";
var MODULE_MENU = "MENU";
var MODULE_MODULE = "MODULE";
var MODULE_USER = "USER";
var MODULE_PROGRAM = "PROGRAM";
var MODULE_USER_ROLE = "USER_ROLE";
var MODULE_SYSTEMCONFIGURATION = "SYSTEMCONFIGURATION";
var MODULE_SYSTEMLANGUAGE = "SYSTEMLANGUAGE";
var MODULE_ROLE = "ROLE";
var MODULE_USERROLE = "USERROLE";
var MODULE_ROLEACCESS = "ROLEACCESS";
var MODULE_PARAMETER = "PARAMETER";
var BASE_URL = "";
var SUBMIT = "SUBMIT";
var SAVE = "SAVE";
var RETURN = "RETURN";
var FINISH = "FINISH";
var TERMINATE = "TERMINATE";
var ASLTARRHENIUS = "ACCELERATED SHELF LIFE TESTING (ARRHENIUS)";
var ASLT = "ACCELERATED SHELF LIFE TESTING";
var WEEK = "WEEK";
var MONTH = "MONTH";
var APPROVE = "APPROVE";
var REJECT = "REJECT";
var DRAFT = "DRAFT";
var TEMPERATURE30 = "30";
var TEMPERATURE40 = "40";
var TEMPERATURE35 = "35";
var TEMPERATURE45 = "45";
var TEMPERATURE50 = "50";
var ADMINISTRATOR = "Administrator";
var ADMINSLS = "Admin Sls";
var SUPERIORSLS = "Superior Sls";
var REQUESTORSLS = "Requestor Sls";
var SUPERIORREQUESTORSLS = "Superior Requestor Sls";
var ONGOINGEVALUATION = "ON GOING EVALUATION";
var ADMINREVIEW = "ADMIN REVIEW";
var REQUESTREPORT = "REQUEST REPORT";
var WAITINGFORSUPPERIORAPPROVAL = "WAITING FOR SUPERIOR APPROVAL";
var WAITINGFORSUPPERIORREQUESTOPRAPPROVAL = "WAITING FOR SUPERIOR REQUESTOR APPROVAL";
var APPROVED = "APPROVED";
var CANCELLED = "CANCELLED";
var DONE = "DONE";
var INCOMPLETE = "INCOMPLETE";
var METHODLONGTERMAC = "LONG TERM SHELF LIFE TESTING (AC)";
var METHODLONGTERMWAREHOUSE = "LONG TERM SHELF LIFE TESTING (WAREHOUSE)";
var SAMPLETYPENONFINISHGOOD = "RAW MATERIALS";
var SAMPLETYPEFINISHGOOD = "FINISHED GOOD";
var SAMPLETYPEOTHERS = "OTHERS";
var SENSORYEVALUATIONDATE = "SENSORYEVALUATIONDATE";
var CHEMICALPHYSICALEVALUATIONDATE = "CHEMICALPHYSICALEVALUATIONDATE";
var MICROBIOLOGYEVALUATIONDATE = "MICROBIOLOGYEVALUATIONDATE";

var MODULE_CONCEPT_NO = "CONCEPT_NO";


// -----
//MASTER
// -----

var MODULE_LOV_PM_CATEGORY_NEW = "LOV_PM_CATEGORY_NEW";
var MODULE_LOV_UOM = "LOV_UOM";
var MODULE_LOV_PM_CATEGORY = "LOV_PM_CATEGORY";
var MODULE_LOV_SAMPLE_REFERENCE = "LOV_SAMPLE_REFERENCE";
var MODULE_LOV_SUPPLIER_NAME_BUY = "LOV_SUPPLIER_NAME_BUY";
var MODULE_LOV_COUNTRY_OF_ORIGIN = "LOV_COUNTRY_OF_ORIGIN";
var MODULE_LOV_SUPPLIER_NAME_MAKE = "LOV_SUPPLIER_NAME_MAKE";
var MODULE_LOV_MANUFACTURING_SITE = "LOV_MANUFACTURING_SITE";
var MODULE_LOV_LOB_ITEM_TRIAL = "LOV_LOB_ITEM_TRIAL";
var MODULE_LOV_PRINCIPAL_NAME = "LOV_PRINCIPAL_NAME";

var MODULE_UMBRAND = "UMBRAND";
var MODULE_LOV_UMBRAND = "LOV_UMBRAND";
var MODULE_LOV_LOB = "LOV_LOB";

var MODULE_BRAND = "BRAND";
var MODULE_LOV_BRAND = "LOV_BRAND";

var MODULE_LOV_CUSTOMER_ITEM = "LOV_CUSTOMER_ITEM";

var MODULE_ITEMMASTER = "ITEMMASTER";
var MODULE_LOVITEMMASTER_ACTIVE = "LOVITEMMASTER_ACTIVE";

var MODULE_EMPLOYEE = "EMPLOYEE";
var MODULE_LOVEMPLOYEE_ACTIVE = "LOVEMPLOYEE_ACTIVE";

var MODULE_LOVJABATAN_ACTIVE = "LOVJABATAN_ACTIVE"

var MODULE_SUBBRAND = "SUBBRAND";
var MODULE_LOV_SUBBRAND = "LOV_SUBBRAND";
var MODULE_LOV_APPROVAL_MENU = "LOV_APPROVAL_MENU";
var MODULE_LOV_APPROVAL_USERROLE = "LOV_APPROVAL_USERROLE";
var MODULE_LOV_APPROVAL_USER = "LOV_APPROVAL_USER";
// ------
// SETUP 
// ------
var MODULE_PRICELIST = "PRICELIST";
var MODULE_LOVPRICELIST_ACTIVE = "LOVPRICELIST_ACTIVE";

var MODULE_REGION = "REGION";
var MODULE_LOVREGION_ACTIVE = "LOVREGION_ACTIVE";
var MODULE_LOVBRANCH_ACTIVE = "LOVBRANCH_ACTIVE";
var MODULE_LOVBRANCHASSIGNMENT_ACTIVE = "MODULE_LOVBRANCHASSIGNMENT_ACTIVE";

var MODULE_ASSIGNMENT = "ASSIGNMENT";
var MODULE_LOVOUTLET_ACTIVE = "LOVOUTLET_ACTIVE ";
var MODULE_LOVJOBTITLE_ACTIVE = "LOVJOBTITLE_ACTIVE";
var MODULE_LOVASSIGN_BRANCH_ACTIVE = "LOVASSIGN_BRANCH_ACTIVE";
var MODULE_LOVASSIGN_LOB_ACTIVE = "LOVASSIGN_LOB_ACTIVE";
var MODULE_LOVASSIGN_OUTLET_ACTIVE = "LOVASSIGN_OUTLET_ACTIVE";
var MODULE_LOV_MANUFACTURING_SITE_BY_VEND = "MODULE_LOV_MANUFACTURING_SITE_BY_VEND";

// ---------
// TRANSAKSI
// ---------


var MODULE_LOV_BARCODE = "LOV_BARCODE";
var MODULE_LOV_PM_EVALUATION = "LOV_PM_EVALUATION";
var MODULE_LOV_VISUAL_APPEARANCE_TEST_CODE = "LOV_VISUAL_APPEARANCE_TEST_CODE";
var MODULE_LOV_VISUAL_APPEARANCE_TEST_CODE_DIMENSION = "LOV_VISUAL_APPEARANCE_TEST_CODE_DIMENSION";
var MODULE_LOV_VISUAL_APPEARANCE_TEST_CODE_MATERIAL = "LOV_VISUAL_APPEARANCE_TEST_CODE_MATERIAL";
var MODULE_LOV_PACKAGING_INTEGRITY_TEST_CODE = "LOV_PACKAGING_INTEGRITY_TEST_CODE";
var MODULE_LOV_CONTAMINANT_TEST_CODE = "LOV_CONTAMINANT_TEST_CODE"




var iDB;
var Indexdb;
var IndexdbName = 'StabilityLabSystem'; // Database name  
var IndexdbVersion = 1; // Database version
var MODULE_SIMULATION = "SIMULATION"
var MODULE_LOV_ITEM_PM_SAMPLE_NUMBER = "LOV_ITEM_PM_SAMPLE_NUMBER";
// ------
// REPORT
// ------

// -----------------
// MODUL : ORACLE FA
// -----------------


// -----------------
// MODUL : API
// -----------------
var LOV_EMPLOYEE = "LOV_EMPLOYEE";


//=======================
// VARIABLE
//=======================
let swalInstanceLOV;
var stringempty = "";
var clsDateFormat = "MM/dd/yyyy";
var clsDateFormatV3 = "DD-MM-yyyy";
var clsDateFormatV2 = "YYYY-MM-DD";

var base_path = $('#base_path').val();
var BACKEND_URL = $('#base_apiUrl').val();
var base_KnGlobalUrl = $("#base_KnGlobalUrl").val();

let dontBlock = false;

$(document).ajaxStart(function () {
    if (!dontBlock) {
        BlockUI();
    }
}).ajaxStop(function () {
    UnBlockUI();
}).submit(function () {
    if (!dontBlock) {
        BlockUI();
    }
});

jQuery.ajaxSetup({
    beforeSend: function () {
        if (!dontBlock) {
            BlockUI();
        }
    },
    complete: function () {
        UnBlockUI();
    }
});


$(function () {
    ConvertUpperCase();
});

//=======================
// FUNCTION
//=======================
function ConvertUpperCase() {
    // semua input text jadi uppercase
    $('input[type=text]').bind('change', function () {
        var toupper = $(this).data('toupper');
        if (toupper != false) {
            $(this).val($.trim($(this).val().toUpperCase()));
        }
    });

    //$('textarea').bind('change', function () {
    //    var toupper = $(this).data('toupper');
    //    if (toupper != false) {
    //        $(this).val($.trim($(this).val().toUpperCase()));
    //    }
    //});
}

function BlockUI() {
    $.blockUI({
        message: `<div class="d-flex justify-content-center">
    <!-- Circle Fade -->
    <div class="sk-circle-fade sk-primary">
      <div class="sk-circle-fade-dot"></div>
      <div class="sk-circle-fade-dot"></div>
      <div class="sk-circle-fade-dot"></div>
      <div class="sk-circle-fade-dot"></div>
      <div class="sk-circle-fade-dot"></div>
      <div class="sk-circle-fade-dot"></div>
      <div class="sk-circle-fade-dot"></div>
      <div class="sk-circle-fade-dot"></div>
      <div class="sk-circle-fade-dot"></div>
      <div class="sk-circle-fade-dot"></div>
      <div class="sk-circle-fade-dot"></div>
      <div class="sk-circle-fade-dot"></div>
    </div>
  </div>
</div>`,
        css: {
            backgroundColor: 'transparent',
            border: '0'
        },
        overlayCSS: {
            opacity: 0.8
        }
    });
}

function UnBlockUI() {
    $.unblockUI();
}

$.getParameter = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == undefined) {
        return undefined;
    } else {
        return results[1] || 0;
    }
}

var clsGlobalClass = function () {
    // Properties Global.
    var URL_LOV = "/System/LOV/Index/";

    if (g_intLoading == undefined) {
        g_intLoading = 0;
    }
    if (g_intFinishloading == undefined) {
        g_intFinishloading = 0;
    }
}


// ================================
// FUNCTION GLOBAL
// ================================
clsGlobalClass.prototype.LogOut = function () {
    Swal.fire({
        title: 'Are you sure?',
        text: "",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-outline-danger ms-1'
        },
        buttonsStyling: false
    }).then(function (result) {
        if (result.value) {
            $.ajax({
                type: "GET",
                url: base_path + "/Account/logOut",
                success: function (result) {
                    window.location = base_path;
                },
                error: function (xhr, status, error) {
                    new clsGlobalClass().swalError(error);
                }
            });
        }
    });
}

// FORCE UPPERCASE ( Smoothing out the UX)
clsGlobalClass.prototype.forceKeyPressUppercase = function (e) {
    var charInput = e.keyCode;
    if ((charInput >= 97) && (charInput <= 122)) { // lowercase
        if (!e.ctrlKey && !e.metaKey && !e.altKey) { // no modifier key
            var newChar = charInput - 32;
            var start = e.target.selectionStart;
            var end = e.target.selectionEnd;
            e.target.value = e.target.value.substring(0, start) + String.fromCharCode(newChar) + e.target.value.substring(end);
            e.target.setSelectionRange(start + 1, start + 1);
            e.preventDefault();
        }
    }
}

clsGlobalClass.prototype.swalSuccess = function (txtValue) {
    Swal.fire({
        title: 'Good job!',
        text: txtValue,
        icon: 'success',
        customClass: {
            confirmButton: 'btn btn-success'
        },
        buttonsStyling: false,
    });
}
clsGlobalClass.prototype.swalSuccessRedirect = function (txtValue, callback) {
    debugger;
    bootbox.alert({
        //size: 'small',
        //title: 'Your Title',
        message: txtValue,
        callback: function (result) {
            debugger;
            callback(result);
            // ...
        }
    });
}
clsGlobalClass.prototype.swalInfoDownload = function (txtValue, url) {
    Swal.fire({
        title: 'Info!',
        text: txtValue,
        icon: 'info',
        customClass: {
            confirmButton: 'btn btn-success'
        },
        buttonsStyling: false,
    }).then(function () {
        window.open(url);
    });
}

clsGlobalClass.prototype.swalSuccessSetSpec = function (txtValue) {
    Swal.fire({
        title: 'Good job!',
        text: txtValue,
        icon: 'success',
        customClass: {
            confirmButton: 'btn btn-success'
        },
        buttonsStyling: false,
    }).then(function () {
        window.location.reload();
    });
}

clsGlobalClass.prototype.swalSuccessSaveOrSubmit = function (txtValue, page) {
    Swal.fire({
        title: 'Good job!',
        text: txtValue,
        icon: 'success',
        customClass: {
            confirmButton: 'btn btn-success'
        },
        buttonsStyling: false,
    }).then(function () {
        return location.href = page;
    });
}


clsGlobalClass.prototype.swalSuccessWithoutAction = function (txtValue) {
    Swal.fire({
        title: 'Success!',
        text: txtValue,
        icon: 'success',
        customClass: {
            confirmButton: 'btn btn-success'
        },
        buttonsStyling: false,
    });
}

clsGlobalClass.prototype.swalSuccessTermintate = function (txtValue, page) {
    Swal.fire({
        title: 'Success',
        text: txtValue,
        icon: 'success',
        customClass: {
            confirmButton: 'btn btn-success'
        },
        buttonsStyling: false,
    }).then(function () {
        return location.href = page;
    });
}

clsGlobalClass.prototype.swalSuccessCopy = function (txtValue, page) {
    Swal.fire({
        title: 'Success',
        text: txtValue,
        icon: 'success',
        customClass: {
            confirmButton: 'btn btn-success'
        },
        buttonsStyling: false,
    }).then(function () {
        return location.href = page;
    });
}

clsGlobalClass.prototype.swalError = function (txtValue) {
    Swal.fire({
        title: 'Error!',
        html: txtValue,
        icon: 'error',
        customClass: {
            confirmButton: 'btn btn-success'
        },
        buttonsStyling: false
    });
}


clsGlobalClass.prototype.swalErrorHtml = function (txtValue) {
    Swal.fire({
        title: 'Error!',
        html: txtValue,
        icon: 'error',
        customClass: {
            confirmButton: 'btn btn-success'
        },
        buttonsStyling: false
    });
}

clsGlobalClass.prototype.swalWarning = function (txtValue) {
    Swal.fire({
        title: 'Warning!',
        text: txtValue,
        icon: 'warning',
        customClass: {
            confirmButton: 'btn btn-success'
        },
        buttonsStyling: false
    });
}

clsGlobalClass.prototype.swalWarningRedirect = function (txtValue, page) {
    Swal.fire({
        title: 'Warning',
        text: txtValue,
        icon: 'warning',
        customClass: {
            confirmButton: 'btn btn-success'
        },
        buttonsStyling: false,
        timer: 2000,
    }).then(function () {
        return location.href = page;
    });
}

clsGlobalClass.prototype.swalWarningHtml = function (txtValue) {
    Swal.fire({
        title: 'Warning!',
        html: txtValue,
        icon: 'warning',
        customClass: {
            confirmButton: 'btn btn-success'
        },
        buttonsStyling: false
    });
}

clsGlobalClass.prototype.swalInfo = function (txtValue) {
    Swal.fire({
        title: 'Info!',
        text: txtValue,
        icon: 'info',
        customClass: {
            confirmButton: 'btn btn-success'
        },
        buttonsStyling: false
    });
}

clsGlobalClass.prototype.showAlert = function (txtValue) {
    if (txtValue == "") {
        txtValue = "!";
    }
    toastr.error(txtValue, "Alert", { closeButton: !0, tapToDismiss: !1 });
}

clsGlobalClass.prototype.getAlert = function (txtValue) {
    if (txtValue == "") {
        txtValue = "!";
    }
    clsGlobal.setMessageWarning(txtValue);
}
clsGlobalClass.prototype.getInformationMessage = function (txtValue) {
    clsGlobal.setMessageInformation(txtValue);
}
clsGlobalClass.prototype.getConfirmation = function (txtValue, callback) {
    debugger;
    Swal.fire({
        title: "Are you sure?",
        text: txtValue,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, do it!",
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-outline-danger ms-1'
        },
        buttonsStyling: false
    }).then((function (t) {
        t.value ? callback(true) : t.dismiss === Swal.DismissReason.cancel && Swal.fire({
            title: "Cancelled",
            text: "Your data is not save :)",
            icon: "error",
            customClass: {
                confirmButton: "btn btn-success"
            }
        }).then((result) => { callback(false); })
    }))
}
clsGlobalClass.prototype.getConfirmationHTMLCustom = function (confirmText, txtValue, callback) {
    debugger;
    Swal.fire({
        title: "Are you sure?",
        html: txtValue,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: confirmText,
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-outline-danger ms-1'
        },
        buttonsStyling: false
    }).then((function (t) {
        t.value ? callback(true) : t.dismiss === Swal.DismissReason.cancel && Swal.fire({
            title: "Cancelled",
            text: "Your data is not save :)",
            icon: "error",
            customClass: {
                confirmButton: "btn btn-success"
            }
        }).then((result) => { callback(false); })
    }))
}

clsGlobalClass.prototype.setMessageWarning = function (txtValue) {
    p_setMessageWarning(txtValue);
}
function p_setMessageWarning(txtValue) {
    toastr.warning(txtValue, "Warning", { closeButton: !0, tapToDismiss: !1 });
}

clsGlobalClass.prototype.setMessageInformation = function (txtValue) {
    p_setMessageInformation(txtValue);
}
function p_setMessageInformation(txtValue) {
    toastr.info(txtValue, "Information", { closeButton: !0, tapToDismiss: !1 });
}

clsGlobalClass.prototype.clearMessageWarning = function () {
    p_clearMessageWarning();
}
function p_clearMessageWarning() {
    $("#lblMessageWarning").text("");
    $("#divWarningSystem").hide();
}
clsGlobalClass.prototype.clearMessageInformation = function () {
    p_clearMessageInformation();
}
function p_clearMessageInformation() {
    $("#lblMessageWarning").text("");
    $("#divInformationSystem").hide();
}
clsGlobalClass.prototype.generateLOV = function (txtModule, txtFunction, txtQuery, isMultiSelect) {
    debugger;
    var txtUrl = base_path + "/Systems/LOV/Index?Mdl=" + encodeURIComponent(txtModule) + "&Fnc=" + encodeURIComponent(txtFunction) + "&Query=" + encodeURIComponent(txtQuery) + "&IsMultiSelect=" + (isMultiSelect ? 'true' : 'false');
    LOV = $.fancybox({ modal: false, padding: 0, width: '90%', height: '100%', scrolling: 'false', href: txtUrl, type: 'iframe', autoSize: false });
    return LOV;
}

clsGlobalClass.prototype.generateLOVSwal = function (txtModule, txtFunction, txtQuery, Title = 'List Of Value(s)') {
    var txtUrl = $(location).attr('protocol') + "//" + $(location).attr('host') + "/Systems/LOV/Index?Mdl=" + encodeURIComponent(txtModule) + "&Fnc=" + encodeURIComponent(txtFunction) + "&Query=" + encodeURIComponent(txtQuery) + "&Title=" + encodeURIComponent(Title);

    let htmlStr = `<div class="col-12"><iframe src="${txtUrl}" title="LOV" style="overflow:hidden;height:90vh;width:90vw"></iframe></div>`;

    swalInstanceLOV = Swal.fire({
        html: htmlStr,
        showCloseButton: true,
        showConfirmButton: false,
        position: "top",
        width: "90%",
        height: '100%',
        customClass: {
            popup: 'swal-wide'
        }
    });

    // Style adjustments for SweetAlert popup
    document.querySelector('.swal2-popup').style.width = '100vw';
    document.querySelector('.swal2-popup').style.height = '100vh';
    document.querySelector('.swal2-popup').style.maxWidth = '100%';
    document.querySelector('.swal2-popup').style.maxHeight = '100%';
}

clsGlobalClass.prototype.generateLOVKNGlobal = function (txtModule, txtFunction, txtQuery) {
    var txtUrl = base_path + "/Systems/LOV/Index?Mdl=" + encodeURIComponent(txtModule) + "&Fnc=" + encodeURIComponent(txtFunction) + "&Query=" + encodeURIComponent(txtQuery) + "&Url=" + encodeURIComponent(base_KnGlobalUrl);
    LOV = $.fancybox({ modal: false, padding: 0, width: '90%', height: '100%', scrolling: 'false', href: txtUrl, type: 'iframe', autoSize: false });
    return LOV;
}

clsGlobalClass.prototype.generateLOVHistory = function (txtModule, txtFunction, txtQuery) {
    var txtUrl = base_path + "/Systems/LOV/Index?Mdl=" + encodeURIComponent(txtModule) + "&Fnc=" + encodeURIComponent(txtFunction) + "&Query=" + encodeURIComponent(txtQuery);
    LOV = $.fancybox({ modal: false, padding: 0, width: '90%', height: '100%', scrolling: 'false', href: txtUrl, type: 'iframe', autoSize: false });
    return LOV;
}


clsGlobalClass.prototype.closeLOV = function () {
    $.fancybox.close();
}


clsGlobalClass.prototype.generatePopUpIframe = function (txtUrl, txtFunction, fancyboxdata) {
    ////
    if (txtUrl.indexOf('?') == -1) {
        txtUrl = txtUrl + "?a=1";
    }
    LOV = $.fancybox({ modal: false, padding: 0, width: '90%', height: '100%', scrolling: 'true', href: txtUrl + "&Fnc=" + txtFunction, type: 'iframe', autoSize: false, ajax: { type: "POST", data: fancyboxdata } });
    return LOV;
}

clsGlobalClass.prototype.generatePopUpIframeMedium = function (txtUrl, txtFunction, fancyboxdata) {
    ////
    if (txtUrl.indexOf('?') == -1) {
        txtUrl = txtUrl + "?a=1";
    }
    LOV = $.fancybox({ modal: false, padding: 0, width: '75%', height: 'auto', scrolling: 'true', href: txtUrl + "&Fnc=" + txtFunction, type: 'iframe', autoSize: false, ajax: { type: "POST", data: fancyboxdata } });
    return LOV;
}


clsGlobalClass.prototype.generatePopUpIframeSmall = function (txtUrl, txtFunction, fancyboxdata) {
    ////
    if (txtUrl.indexOf('?') == -1) {
        txtUrl = txtUrl + "?a=1";
    }
    LOV = $.fancybox({ modal: false, padding: 0, width: '60%', height: 'auto', scrolling: 'true', href: txtUrl + "&Fnc=" + txtFunction, type: 'iframe', autoSize: false, ajax: { type: "POST", data: fancyboxdata } });
    return LOV;
}

clsGlobalClass.prototype.closePopUpIframe = function () {
    $.fancybox.close();
}


var g_intLoading;
var g_intFinishloading;

clsGlobalClass.prototype.showLoading = function () {
    p_clearMessageWarning();
    p_clearMessageInformation();
    if (g_intLoading == undefined) {
        g_intLoading = 0;
    } else {
        g_intLoading += 1;
    }
    if (g_intFinishloading == undefined) {
        g_intFinishloading = 0;
    }

    $.blockUI({
        message: `<div class="d-flex justify-content-center">
    <!-- Circle Fade -->
    <div class="sk-circle-fade sk-primary">
      <div class="sk-circle-fade-dot"></div>
      <div class="sk-circle-fade-dot"></div>
      <div class="sk-circle-fade-dot"></div>
      <div class="sk-circle-fade-dot"></div>
      <div class="sk-circle-fade-dot"></div>
      <div class="sk-circle-fade-dot"></div>
      <div class="sk-circle-fade-dot"></div>
      <div class="sk-circle-fade-dot"></div>
      <div class="sk-circle-fade-dot"></div>
      <div class="sk-circle-fade-dot"></div>
      <div class="sk-circle-fade-dot"></div>
      <div class="sk-circle-fade-dot"></div>
    </div>
  </div>
</div>`,
        css: {
            backgroundColor: 'transparent',
            border: '0'
        },
        overlayCSS: {
            opacity: 0.8
        }
    });

    //jQuery.ajaxSetup({ async: false });

}

clsGlobalClass.prototype.hideLoading = function () {
    //debugger;
    g_intFinishloading += 1;
    if (g_intLoading == g_intFinishloading) {
        $.unblockUI();
    }
}


clsGlobalClass.prototype.GenerateAutoNumeric = function () {
    $('.autonumeric').autoNumeric('init', { vMax: '9999999999999', vMin: '-9999999999999', aSep: ',', dGroup: '3', aDec: '.' });
}
clsGlobalClass.prototype.GenerateDateTimePicker = function () {
    $('.datetimepicker').datepicker({ autoclose: true });
}

// FILTERING TEXT

clsGlobalClass.prototype.filteringText = function (txtValue) {
    try {
        if (txtValue == undefined) {
            return "";
        }
        else {
            return txtValue.replace(/[@!^&\/\\#,+()$~%.'":*?<>{}]/g, '');
        }
    } catch (ex) {
        return "";
    }
}

// PARSING
clsGlobalClass.prototype.parseToGuid = function (txtValue) {
    try {
        if (txtValue == undefined) {
            return "";
        }
        else {
            return Guid.Parse(txtValue);
        }
    } catch (ex) {
        return "";
    }
}
clsGlobalClass.prototype.parseToString = function (txtValue) {
    try {
        if (txtValue == undefined) {
            return "";
        }
        else {
            return txtValue.toString();
        }
    } catch (ex) {
        return "";
    }
}

clsGlobalClass.prototype.parseToInteger = function (txtValue) {
    try {
        if (txtValue == undefined) {
            return 0;
        }
        else {
            if (txtValue == "") {
                return 0;
            } else {
                return parseInt(txtValue) || 0;
            }
        }
    } catch (ex) {
        return 0;
    }
}

clsGlobalClass.prototype.parseToDecimal = function (txtValue) {
    try {
        //
        if (txtValue == undefined) {
            return 0;
        }
        else {
            if (txtValue == "") {
                return 0;
            } else {
                if (!isNaN(txtValue)) {
                    return parseFloat(txtValue);
                } else {
                    return parseFloat(txtValue.replace(/,/g, '')) || 0;
                }
            }
        }
    } catch (ex) {
        return 0;
    }
}

clsGlobalClass.prototype.parseToBoolean = function (txtValue) {
    try {
        if (txtValue == undefined) {
            return false;
        }
        else {
            if (txtValue == "") {
                return false;
            } else {
                if (txtValue == "on") {
                    return true;
                } else {
                    if (txtValue == "1") {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        }
    } catch (ex) {
        return false;
    }
}

clsGlobalClass.prototype.parseToRupiah = function (txtValue) {
    try {
        if (txtValue == undefined) {
            return 0;
        }
        else {
            if (txtValue == "") {
                return 0;
            } else {
                var rupiah = '';
                var angkarev = txtValue.toString().split('').reverse().join('');
                for (var i = 0; i < angkarev.length; i++) if (i % 3 == 0) rupiah += angkarev.substr(i, 3) + ',';
                return rupiah.split('', rupiah.length - 1).reverse().join('');
            }
        }
    } catch (ex) {
        return 0;
    }
};

clsGlobalClass.prototype.parseToAngka = function (txtValue) {
    try {
        if (txtValue == undefined) {
            return 0;
        }
        else {
            if (txtValue == "") {
                return 0;
            } else {
                return parseInt(txtValue.replace(/[^0-9]/g, ''), 10);
            }
        }
    } catch (ex) {
        return 0;
    }
};

clsGlobalClass.prototype.parseJSONdate = function ConvertJsonDateString(jsonDate) {
    debugger;
    var shortDate = null;
    if (jsonDate) {
        var regex = /-?\d+/;
        var matches = regex.exec(jsonDate);
        var dt = new Date(parseInt(matches[0]));
        var month = dt.getMonth() + 1;
        var monthString = month > 9 ? month : '0' + month;
        var day = dt.getDate();
        var dayString = day > 9 ? day : '0' + day;
        var year = dt.getFullYear();
        shortDate = monthString + '/' + dayString + '/' + year;
    }
    return shortDate;
};
clsGlobalClass.prototype.parseJSONdateNew = function (jsonDate) {
    if (jsonDate) {
        var dt = new Date(jsonDate); // Bisa handle ISO langsung
        var month = dt.getMonth() + 1;
        var day = dt.getDate();
        var year = dt.getFullYear();
        return (month > 9 ? month : '0' + month) + '/' +
            (day > 9 ? day : '0' + day) + '/' +
            year;
    }
    return null;
};

clsGlobalClass.prototype.encrypt = function rijndaelEncrypt(id) {
    var response;
    $.ajax({
        url: '/Home/Encrypt/',
        type: 'POST',
        async: false,
        context: this,
        data: {
            id: id
        },
        success: function (data) {
            response = data;
        }
    });
    return response;
};

clsGlobalClass.prototype.decrypt = function rijndaelDecrypt(text) {
    var response;
    $.ajax({
        url: '/Home/Decrypt/',
        type: 'POST',
        async: false,
        context: this,
        data: {
            text: text
        },
        success: function (data) {
            response = data;
        }
    });
    return response;
};

clsGlobalClass.prototype.convertDate = function (x) {
    try {
        let dtmValue = new Date(parseInt(x.replace("/Date(", "").replace(")/", ""), 10));
        let strDateValue = pad(dtmValue.getDate(), 2) + "-" + pad((dtmValue.getMonth() + 1), 2) + "-" + dtmValue.getFullYear();
        return strDateValue;
    } catch (e) {
        return "-";
    }
}

var convertMSDate = (function () {
    ////
    var pattern = /Date/,
        replacer = /\D+/g;
    return function (date) {
        if (typeof date === "string" && pattern.test(date)) {
            date = +date.replace(replacer, "");
            date = new Date(date);
            if (!date.valueOf()) {
                throw new Error("Invalid Date: " + date);
            }
        }
        return date;
    }
}());



clsGlobalClass.prototype.parseToDateTimeFromJSON = function (txtValue, txtFormat) {
    try {
        ////
        //var retDat = convertMSDate(txtValue);
        //return $.format.date(retDat.toString(), txtFormat);
        //
        var retDat = convertMSDate(txtValue);
        var txtValue = retDat.toString();
        var intIndex = txtValue.indexOf('(');
        var txtResult = txtValue;
        if (intIndex > 0) {
            txtResult = txtResult.substr(0, intIndex);
        }
        return $.format.date(txtResult, txtFormat);
    } catch (ex) {
        return "-";
    }
}

clsGlobalClass.prototype.parseToDateTimeFromJSONV2 = function (txtValue, txtFormat) {
    try {
        var date = moment(txtValue);
        return date.format(txtFormat);
    } catch (ex) {
        return "-";
    }
}

clsGlobalClass.prototype.parseToJSONDateFromDate = function (txtValue, txtFormat) {
    try {
        var dt = $.format.date(txtValue, txtFormat);  //new Date(txtValue);
        return '/Date(' + new Date(dt).getTime() + ')/';
    } catch (ex) {
        return "-";
    }
}

clsGlobalClass.prototype.addDays = function (date, days) {
    try {
        var dd = Number(days)
        var copy = new Date(date);
        copy.setDate(copy.getDate() + dd);
        return copy;
    } catch (ex) {
        return "-";
    }
}

clsGlobalClass.prototype.addMonths = function (date, months) {
    try {
        var mm = Number(months)
        var copy = new Date(date);
        copy.setMonth(copy.getMonth() + mm);
        return copy;
    } catch (ex) {
        return "-";
    }
}

clsGlobalClass.prototype.parseShortDate = function (date) {
    try {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    } catch (ex) {
        return "-";
    }
}

clsGlobalClass.prototype.ParseBooleanNETToOracle = function (txtValue) {
    try {
        if (txtValue == undefined) {
            return "N";
        }
        else {
            if (txtValue == true) {
                return "Y";
            } else {
                return "N";
            }
        }
    } catch (ex) {
        return "N";
    }
}

clsGlobalClass.prototype.ParseBooleanOracleToNET = function (txtValue) {
    try {
        if (txtValue == undefined) {
            return false;
        }
        else {
            if (txtValue == "Y") {
                return true;
            } else {
                return false;
            }
        }
    } catch (ex) {
        return false;
    }
}

clsGlobalClass.prototype.FormatMoney = function (txtValue, intDec) {
    try {
        ////
        var intDec = isNaN(intDec = Math.abs(intDec)) ? 2 : intDec,
            d = d == undefined ? "." : d,
            t = t == undefined ? "," : t,
            s = txtValue < 0 ? "-" : "",
            i = String(parseInt(txtValue = Math.abs(Number(txtValue) || 0).toFixed(intDec))),
            j = (j = i.length) > 3 ? j % 3 : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (intDec ? d + Math.abs(txtValue - i).toFixed(intDec).slice(2) : "");

    } catch (ex) {
        return "0";
    }
}

// validation number only*@
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

// validation number & alphabet only*@
function IsAlphaNumeric(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode > 31 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122))) {
        return false;
    }
    return true;
}

// validation alphabet only*@
function isAlfa(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
        return false;
    }
    return true;
}

function IndexDBconnect(callbackFunction) {
    var openRequest = window.indexedDB.open(IndexdbName, IndexdbVersion);
    openRequest.onupgradeneeded = event => {
        Indexdb = event.target.result;

        if (!Indexdb.objectStoreNames.contains('SLS')) {
            var objectStore = Indexdb.createObjectStore("SLS", { keyPath: "Id" });
        }
    };
    openRequest.onsuccess = function (event) {
        Indexdb = event.target.result;
        callbackFunction(Indexdb);
    };
}


clsGlobalClass.prototype.setBackEndApi = function (url) {
    p_setMessageInformation(url);
}

clsGlobalClass.prototype.getBackEndApi = function () {
    return BACKEND_URL;
}

function p_setMessageInformation(pUrl) {
    BACKEND_URL = pUrl;
}

function ConvertFirstLetterCapitalize(data) {
    const mySentence = data.toLowerCase();
    const words = mySentence.split(" ");

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }

    return words.join(" ");
}

function setItemSessionStorage(key, value) {
    var sessionStorage = window.sessionStorage;
    if (typeof (sessionStorage) != 'undefined') {
        sessionStorage.setItem(key, value);
    }
}

function getItemSessionStorage(key) {
    var sessionStorage = window.sessionStorage;
    if (typeof (sessionStorage) != 'undefined') {
        sessionStorage.getItem(key);
    }
}

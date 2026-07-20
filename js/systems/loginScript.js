"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
 

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    p_InitForm();
    p_validatePage();
    p_showPrevData();
});

//=======================
// FUNCTION
//=======================
function p_InitForm() { 
    if (document.getElementsByName("returnUrl").value !== null && document.getElementsByName("returnUrl").value !== undefined
        && document.getElementsByName("returnUrl").value !== "") {
        console.log("Welcome Back");
    }
    else {
        localStorage.clear(); 
    }
}

function p_validatePage() {
    
}

function p_showPrevData() {

}
  
 
//=======================
// HANDLER
//=======================
$("#btn-captcha").click(function () {
    var d = new Date();
    var w = 250;
    var h = 50;
    $("#img-captcha").attr("src", "/Account/GetCaptchaImageV2?d=" + d.getTime());
});

//$("#basic-default-password").click(function () {
//    console.log($("#basic-default-password").val());
//    /*if (x.type === "password") {
//        x.type = "text";
//    } else {
//        x.type = "password";
//    }*/
//});

$('.form-password-toggle .input-group-text').on('click', function (e) {
    debugger;
    console.log("true");
    e.preventDefault();
    var $this = $(this),
        inputGroupText = $this.closest('.form-password-toggle'),
        formPasswordToggleIcon = $this,
        formPasswordToggleInput = inputGroupText.find('input');

    if (formPasswordToggleInput.attr('type') === 'text') {
        formPasswordToggleInput.attr('type', 'password');
        $("#basic-default-password").empty().append(`<i class="ti ti-eye"></i>`);
        //if (feather) {
            
        //    formPasswordToggleIcon.find('svg').replaceWith(feather.icons['eye'].toSvg({ class: 'font-small-4' }));
        //}
    } else if (formPasswordToggleInput.attr('type') === 'password') {
        formPasswordToggleInput.attr('type', 'text');
        $("#basic-default-password").empty().append(`<i class="ti ti-eye-off"></i>`);
        //if (feather) {

        //    formPasswordToggleIcon.find('svg').replaceWith(feather.icons['eye-off'].toSvg({ class: 'font-small-4' }));
        //}
    }
});
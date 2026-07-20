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

    if (msgSuccess !== "") {
        showMessageSucces(msgSuccess);
    }

    $('#bitIsSuperior').change(function () {
        var isChecked = $('#bitIsSuperior').is(':checked');
        toggleSuperiorSelect();
    });


    //var username = $('#usernameSelect').val();
    //var superior = $('#superiorSelect').val();

    //// Cek apakah username dan superior sama
    //if (username === superior) {
    //    $('#bitIsSuperior').prop('checked', true);
    //    // Jika sama, ceklis checkbox
    //    toggleSuperiorSelect();
    //}
    //if ($('#usernameSelect').val()) {
    //    // Jika ada value, disable tanpa mengubah valuenya
    //    $('#usernameSelect').prop('disabled', true);
    //}
});

function showMessageSucces(msgSuccess) {
    var txtUrl = `${base_path}/User`;
    clsGlobal.swalSuccessSaveOrSubmit(msgSuccess, txtUrl);
}

// Fungsi untuk mengatur visibility berdasarkan checkbox
function toggleSuperiorSelect() {
    var isChecked = $('#bitIsSuperior').is(':checked');
    var usernameSelectValue = $('#usernameSelect').val();
    var superiorSelect = $('#superiorSelect');

    if (isChecked && !usernameSelectValue) {
        $('#bitIsSuperior').prop('checked', false);
        showMessageError("Silahkan pilih username dahulu");
    } else {
        if (isChecked && usernameSelectValue) {
            $('#bitIsSuperior').prop('checked', true);
            // Ensure superiorSelect is enabled, set its value same as usernameSelect and update select2 display
            superiorSelect.prop('disabled', false);
            superiorSelect.val(usernameSelectValue).trigger('change');

            // Make superiorSelect readonly
            superiorSelect.prop('disabled', true);
        } else {
            // Clear the superiorSelect and enable it again
            superiorSelect.val('').trigger('change'); // Reset and update select2
            superiorSelect.prop('disabled', false);
        }
    }
    
}   

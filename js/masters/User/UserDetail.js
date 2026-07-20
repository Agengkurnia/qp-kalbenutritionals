"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    $('#hiddenIsNewUser').val('false');
    $('#isAD').hide();
    $(".select2").select2();
    $('.select2').css('width', "100%");

    $('#usernameSelect').on('select2:open', function () {
        setTimeout(function () {
            var noResults = $('.select2-results__message');
            if (noResults.length > 0) {
                noResults.html('<button id="noResultsButton" class="btn btn-primary w-100">Create New User</button>');

                $('#noResultsButton').on('click', function () {
                    handleNoResultsButtonClick();
                });
            }
        }, 2500); // Anda bisa mengatur timeout lebih rendah

    });
    if (msgSuccess !== "") {
        showMessageSucces(msgSuccess);
    }
    toggleSuperiorSelect();

    $('#cancelButtonWrapper').hide();

    $('#bitIsSuperior').change(function () {

        var isChecked = $('#bitIsSuperior').is(':checked');
        var usernameSelectValue = $('#usernameSelect').val();
        toggleSuperiorSelect();
    });


    $('#usernameSelect').change(function () {
        toggleSuperiorSelect();
    });
});

function changerUsernamer() {
   
}

// Fungsi untuk mengatur visibility berdasarkan checkbox
function toggleSuperiorSelect() {
    var isChecked = $('#bitIsSuperior').is(':checked');
    var usernameSelectValue = $('#usernameSelect').val();
    var superiorSelect = $('#superiorSelect');

    if (isChecked && !usernameSelectValue) {
        $('#bitIsSuperior').prop('checked', false);
        if (msgSuccess === "") {
            showMessageError("Silahkan pilih username dahulu");
        }
    } else {
        if (isChecked && usernameSelectValue) {
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

function showMessageError(errorMessage) {
    clsGlobal.swalError(errorMessage);
}


function showMessageSucces(msgSuccess) {
    debugger;
    var txtUrl = `${base_path}/User`;
    clsGlobal.swalSuccessSaveOrSubmit(msgSuccess, txtUrl);
}

function handleNoResultsButtonClick() {
    $('#bitIsSuperior').prop('checked', false);
    var superiorSelect = $('#superiorSelect');
    superiorSelect.val('').trigger('change'); 
    superiorSelect.prop('disabled', false);
    $('#isAD').show();
    $('#hiddenIsNewUser').val('true');
    $('#cancelButtonWrapper').show();
    $('#fullName').show(); 
    $('#usernameSelectContainer').hide();
    $('#newUsername').show();
    $('#employeeId').show();
    $('#nick').show();
    $('#email').show();
    $('#domainUser').show();
    $('#usernameSelect').select2('close');
}


$('#cancelButton').on('click', function (e) {
    debugger;
    e.preventDefault();  // Mencegah aksi default (misalnya, navigasi)
    $('#isAD').hide();
    $('#hiddenIsNewUser').val('false');
    $('#cancelButtonWrapper').hide();
    $('#fullName').hide();
    $('#usernameSelectContainer').show();
    $('#newUsername').hide();
    $('#employeeId').hide();
    $('#nick').hide();
    $('#email').hide();
    $('#domainUser').hide();
});

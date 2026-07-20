"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var programCode = '';
//=======================
// ON PAGE LOAD
//=======================
var style = document.createElement('style');
style.textContent = `
.custom-checkbox input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
}

.custom-checkbox .checkbox-custom {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: lightgray;
    border: 1px solid gray;
    border-radius: 4px;
    vertical-align: middle;
}

.custom-checkbox input:checked + .checkbox-custom {
    background-color: darkgray;
}

.custom-checkbox input:disabled + .checkbox-custom {
    background-color: lightgray;
    border-color: gray;
    cursor: not-allowed;
}

`;
document.head.append(style);

$(document).ready(function () {

    if (msgSuccess !== "") {
        showMessageSucces(msgSuccess);
    }

    $('#programSelect').on('change', function () {
        debugger;
        var selectedValue = $(this).val();
        $('#TxtProgramName').val(selectedValue);
        onChangeProgram(selectedValue);
    });


    $('#moduleSelect').on('change', function () {
        debugger;
        // Ambil nilai yang dipilih
        var selectedValue = $(this).val();
        var selectedText = $(this).find('option:selected').text();

        // Set nilai ke input hidden IntModuleId dan TxtModuleName
        $('#IntModuleId').val(selectedValue);
        $('#TxtModuleName').val(selectedText);
    });


    $('#roleSelect').on('change', function () {
        debugger;
        var selectedValue = $(this).val();

        $('#TxtRoleName').val(selectedValue);
    }); 
});


function onChangeProgram(selectedValue) {
    if (selectedValue) {
        $.ajax({
            url: '/RoleAccess/GetRolesByProgram',
            type: 'GET',
            data: { code: selectedValue },
            success: function (data) {
                debugger;
                var $usernameSelect = $('#roleSelect');
                $usernameSelect.empty();
                $usernameSelect.append('<option value="" disabled selected>Select Role</option>');

                $.each(data, function (index, role) {
                    $usernameSelect.append(
                        $('<option>').val(role.txtRoleCode).text(role.txtRoleName)
                    );
                });
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
            }
        });
    } else {
        $('#roleSelect').empty().append('<option value="" disabled selected>Select User</option>');
    }

    if (selectedValue) {
        $.ajax({
            url: '/RoleAccess/GetModulesByProgram',
            type: 'GET',
            data: { code: selectedValue },
            success: function (data) {
                var $usernameSelect = $('#moduleSelect');
                $usernameSelect.empty();
                $usernameSelect.append('<option value="" disabled selected>Select Module</option>');

                $.each(data, function (index, module) {
                    debugger;
                    $usernameSelect.append(
                        $('<option>').val(module.intModuleID).text(module.txtModuleName)
                    );
                });
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
            }
        });
    } else {
        $('#moduleSelect').empty().append('<option value="" disabled selected>Select Module</option>');
    }
}

function showMessageSucces(msgSuccess) {
    debugger;
    var txtUrl = `${base_path}/RoleAccess`;
    clsGlobal.swalSuccessSaveOrSubmit(msgSuccess, txtUrl);
}
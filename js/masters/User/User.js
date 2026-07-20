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

    $(".select2").select2();

    $('.select2').css('width', "100%");

    p_InitForm();
    toggleSuperiorSelect();

    $('#programSelect').on('change', function () {
        var selectedValue = $(this).val();
        updateDataTable(selectedValue);
    });

    // Panggil fungsi saat checkbox berubah
    $('#bitIsSuperior').change(function () {
        toggleSuperiorSelect();
    });

    var myModal = new bootstrap.Modal(document.getElementById('unregisteredModal'));

    $(document).on('click', '.click-unregistered', function () {
        // Ambil objek dari atribut `data-object`
        var jsonString = $(this).data('object');
        var objectData = JSON.parse(decodeURIComponent(jsonString)); // Decode dan parse JSON

        // Tampilkan data yang diinginkan di modal
        $('#modalUsername').val(objectData.username);
        $('#modalProjectCode').val(objectData.projectCode);

        // Tampilkan modal
        myModal.show();
    });

    $('#unregisteredModal').on('show.bs.modal', function (event) {
        // Ambil nilai dari input projectCode
        var projectCode = $('#modalProjectCode').val();

        // Update modal title dengan teks yang diinginkan
        var modalTitle = 'Register User To ' + projectCode + '?';
        $('#unregisteredModalLabel').text(modalTitle);
    });
});



// Fungsi untuk mengatur visibility berdasarkan checkbox
function toggleSuperiorSelect() {
    debugger
    if ($('#bitIsSuperior').is(':checked')) {
        $('#superiorSelect').hide(); // Menyembunyikan superiorSelect
    } else {
        $('#superiorSelect').show(); // Menampilkan superiorSelect
    }
}
//=======================
// FUNCTION
//=======================
function p_InitForm() {
    p_MasterUser();
}

function updateDataTable(selectedValue) {
    programCode = selectedValue;
    $('#dataTableUser').DataTable().ajax.url(base_path + '/User/GetDataTable?code=' + encodeURIComponent(selectedValue)).load();
}

function p_MasterUser() {
    $("#dataTableUser").DataTable({
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
        search: {
            return: true
        },
        ajax: {
            type: "POST",
            url: base_path + '/User/GetDataTable',
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
                else
                {
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
                data: 'isRegisteredKNGlobal',
                render: function (data, type, full, meta) {
                    var jsonString = encodeURIComponent(JSON.stringify(full)); // Encode JSON string
                    if (data == true) {
                        return '<span class="badge bg-primary">Registered</span>';
                    } else {
                        return '<span style="cursor: pointer;" class="badge bg-danger click-unregistered" data-object="' + jsonString + '">Unregistered</span>';
                    }
                },
            },
            {
                data: 'username',
                render: function (data, type, row, meta) {
                    var encyptedData = row.encyptedData;
                    return '<a href="#" onclick="redirectButton(\'' + encyptedData + '\'); return false;">' + data + '</a>';
                }
            },
            {
                data: 'projectCode'
            },
            {
                data: 'department'
            },
            {
                data: 'superior'
            },

            {
                data: 'lobs',
                render: function (data, type, row) {
                    if (type === 'display') {
                        if (!data || data.length === 0) {
                            // Return a placeholder or empty string if data is null or empty
                            return '-';
                        }
                        // Assuming 'data' is an array of objects, extract relevant information
                        return data.map(lob => lob.txtLOBName).join(', ');
                    }
                    return data;
                }
            },
            //{
            //    data: 'isAD',
            //    render: function (data, type, full, meta) {
            //        if (data == true) {
            //            return 'Yes'
            //        }
            //        else {
            //            return 'No'
            //        }

            //    },
            //},
            {
                data: 'isActive',
                render: function (data, type, full, meta) {
                    if (data == true) {
                        return 'Yes'
                    }
                    else {
                        return 'No'
                    }

                },
            },
        ],
    });
}

function redirectButton(param) {
    window.open(base_path + `/user/edit?param=${encodeURIComponent(param)}`, '_blank');
}

//=======================
// HANDLER
//=======================


function setChooseLOV(txtValue) {

    var arr = txtValue.split('|');
    switch (arr[0]) {
        case MODULE_PROGRAM:
            setUser(arr);
            break;
    }
    clsGlobal.closeLOV();
}

function setUser(arr) {
    $("#programName").val(arr[1]);
    updateDataTable(arr[2]);
}

function setSwallinstance() {
    return swalInstanceLOV;
}

$("#btnNew").on('click', function () {
    window.location.href = base_path + `/user/create`;
});

$("#btnProgram").on("click", () => {
    clsGlobal.generateLOV(MODULE_PROGRAM, "PROGRAM", "PROGRAM");
});


$("#submitModalButton").on("click", () => {
    debugger;
    var username = $('#modalUsername').val();
    var projectCode = $('#modalProjectCode').val();
    var selectedRole = $('#selectRole').val(); 

    $.ajax({
        url: '/User/SubmitRegisterUser',
        type: 'POST',
        data: {
            username: username,
            projectCode: projectCode,
            selectedRole: selectedRole
        },
        success: function (response) {
            if (response.success) {
                alert(response.message); // Display success message
                $('#unregisteredModal').modal('hide'); // Hide modal
                updateDataTable(projectCode);
                $('#dataTableUser').DataTable().ajax.reload(); 
            } else {
                alert('Error: ' + response.message); // Display error message
            }
        }
    });
});

"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var bitLoading = false;
let oTableVariant; // Correctly named
var Data = {};
var SelectRow = {};

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function() {
    Data.ModelVariant = {};
    Data.ModelVariant = JSON.parse($('#hdDataModel').val());

    Form.ShowList();
    TableVariant.Init();
    Button.Init();

});

let Button = {
    Init: function () {
        $("#btnNew").on('click', (e) => {
            e.preventDefault();
            Form.Create();
        });

        $("#btnSave").on('click', (e) => {
            e.preventDefault();
            Form.SaveData();
        });

        $("#btnBack").on('click', (e) => {
            e.preventDefault();
            Form.ShowList();
            if (oTableVariant) { // Pastikan tabel sudah pernah diinisialisasi
                // Panggil fungsi reload, bukan render ulang
                oTableVariant.ajax.reload(null, true);
            } else {
                // Jika belum ada, lakukan inisialisasi awal
                TableVariant.Render();
            }
        });

        $(".btn-search").on('click', (e) => {
            e.preventDefault();
            if (oTableVariant) { // Pastikan tabel sudah pernah diinisialisasi
                // Panggil fungsi reload, bukan render ulang
                oTableVariant.ajax.reload(null, true);
            } else {
                // Jika belum ada, lakukan inisialisasi awal
                TableVariant.Render();
            }
        });
    }
}

let TableVariant = {
    Init: function() {
        // Form.ShowList(); // This is already called in document.ready
        TableVariant.Render();
    },
    Render: function() {
        var objsearch = {
            Search1: $("#VariantCodeSearch").val(),
            Search2: $("#VariantNameSearch").val(),
            Search3: $("#ChangedBySearch").val(),
            Search4: "",
            Search5: "",
            Search6: "",
            Search7: "",
            Search8: "",
            Search9: "",
            Search10: ""
        }

        // FIX 3: Assign to the correctly declared 'oTableVariant'
        oTableVariant = $("#dataTableVariant").DataTable({
            "bPaginate": true,
            search: {
                return: true
            },
            scrollY: "700px",
            scrollX: "350%",
            autoWidth: true,
            lengthMenu: [5, 10, 25, 50, 100],
            "iDisplayLength": 10,
            serverSide: true,
            destroy: true,
            retrieve: true,
            order: [[5, 'desc']], 
            orderCellsTop: true,
            scrollCollapse: true,
            dom: '<"row mb-2"<"col-sm-6"l><"col-sm-6 d-flex justify-content-end align-items-center"f>>rt<"bottom"ip><"clear">',
            ajax: {
                type: "POST",
                url: base_path + '/Master/Variant/DTVariantList',
                contentType: 'application/json',
                dataSrc: function(retDat) {
                    if (retDat.bitSuccess == false) {
                        if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                            clsGlobal.swalWarning(retDat.objData);
                        }
                        else {
                            clsGlobal.swalError(retDat.txtMessage);
                        }
                        return []; // Return empty array on failure
                    }
                    else {
                        return retDat.data;
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("RequestVerificationToken", $('#MasterVariantPanel input[name=__RequestVerificationToken]').val());
                },
                data: function(d) {
                    // Update objsearch with the LATEST values every time the call is made
                    objsearch.Search1 = $("#VariantCodeSearch").val();
                    objsearch.Search2 = $("#VariantNameSearch").val();
                    objsearch.Search3 = $("#ChangedBySearch").val();
                    
                    d.searchField = objsearch;
                    let param = JSON.stringify(d);

                    return param;
                },
                datatype: "json",
                error: function(xhr, status, error) {
                    if (xhr.responseText.includes("!DOCTYPE html")) {
                        clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                    }
                    else {
                        clsGlobal.swalError(xhr.responseText);
                    }
                }
            },
            searching: false,
            columns: [
                {
                    data: 'variantCode',
                    className: 'dt-left text-nowrap',
                    name: 'variantCode',
                    render: function(data, type, row, meta) {
                        let SelectedId = row.variantId;
                        return `<a href="javascript:void(0);" onclick="Form.ShowDetail('${SelectedId}')"> ${data}</a>`;
                    }
                },
                {
                    data: 'variantName',
                    className: 'dt-left text-nowrap',
                    name: 'variantName',
                },
                {
                    data: 'bitActive',
                    className: 'dt-left',
                    name: 'bitActive',
                    render: function(data, type, row, meta) {
                        if (data == true) {
                            return 'Active';
                        } else {
                            return 'Inactive';
                        }
                    }
                },
                {
                    data: 'bitIsReadyToProduction',
                    className: 'dt-left',
                    name: 'bitIsReadyToProduction',
                    render: function(data, type, row, meta) {
                        if (data == true) {
                            return 'Yes';
                        } else {
                            return 'No';
                        }
                    }
                },
                {
                    data: 'changedBy',
                    className: 'dt-left text-nowrap',
                    name: 'changedBy',
                },
                {
                    data: 'changedDate',
                    className: 'dt-center text-nowrap',
                    name: 'changedDate',
                    render: function(data, type, row, meta) {
                        const formatted = moment(data).isValid() ? moment(data).format("YYYY-MM-DD HH:mm") : "";
                        return formatted;
                    }
                },
            ],
            "drawCallback": function(settings) {
                var api = this.api();
                api.columns.adjust();
            }
        });
    },
}

let Form = {
    ShowDetail: function (id) {
        $('#FormState').val('EDIT');
        // FIX 4: Use the corrected data model
        Data.ModelVariant.VariantId = id;

        clsGlobal.showLoading();
        Action.GetData(id); // Pass the ID to the function
        clsGlobal.hideLoading();

        $('#MasterVariantPanel').hide();
        $('#FormDetailVariant').show();

        $('#VariantCode').attr("disabled", "disabled");

        $('#VariantName').attr("disabled", "disabled");
    },
    ShowList: function() {
        $('#FormState').val('');
        $('#FormDetailVariant').hide();
        $('#MasterVariantPanel').show();
        
        // Reset the ID when going back to the list
        Data.ModelVariant.VariantId = null;
    },
    Create: function () {
        $('#FormState').val('CREATE');
        Form.ResetInput();
        $('#MasterVariantPanel').hide();
        $('#FormDetailVariant').show();
        $('#VariantCode').removeAttr("disabled");

        $('#VariantName').removeAttr("disabled");
    },
    ResetInput: function () {
        $('#VariantId').val(""); // A hidden field for the ID
        $('#VariantCode').val("");
        $('#VariantName').val("");
        $('#ChangedBy').val("");
        $('#ChangedDate').val("");
        const BitActive = document.getElementById('chkActive');
        BitActive.checked = false;

        const BitProd = document.getElementById('chkProd');
        BitProd.checked = false;

        $('#BitIsReadyToProduction').prop('checked', false);
    },
    SaveData: function () {
        Data.ModelVariant = {};
        Data.ModelVariant.VariantId = ($('#FormState').val().toUpperCase() == "CREATE") ? crypto.randomUUID() : $('#VariantId').val(); // A hidden field for the ID
        Data.ModelVariant.VariantCode = $('#VariantCode').val();
        Data.ModelVariant.VariantName = $('#VariantName').val();
        Data.ModelVariant.BitActive = $('#chkActive').prop('checked') ?? false;
        Data.ModelVariant.BitIsReadyToProduction = $('#chkProd').prop('checked') ?? false;

        Data.ModelVariant.ChangedBy = "-";
        Data.ModelVariant.ChangedDate = new Date();

        if ($('#FormState').val().toUpperCase() == "CREATE") {
            $.ajax({
                type: "POST",
                url: base_path + '/Master/Variant/CreateVariant', // You'll need to create this server-side endpoint
                data: { req: Data.ModelVariant },
                dataType: 'json',
                beforeSend: function (request) {
                    request.setRequestHeader("RequestVerificationToken", $('#MasterVariantPanel input[name=__RequestVerificationToken]').val());
                },
                success: function (retDat) {
                    if (retDat.bitSuccess) {
                        $('#FormState').val('EDIT');

                        $('#VariantCode').attr("disabled", "disabled");
                        // We have the data, now populate the form
                        Action.PopulateForm(JSON.parse(retDat.objData));
                        clsGlobal.swalSuccess("Success to Save !");
                    } else {
                        clsGlobal.swalError(retDat.txtMessage);
                    }
                },
                error: function (xhr, status, error) {
                    if (xhr.responseText.includes("!DOCTYPE html")) {
                        clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                    }
                    else {
                        clsGlobal.swalError(xhr.responseText);
                    }
                }
            });
        } else {
            $.ajax({
                type: "POST",
                url: base_path + '/Master/Variant/UpdateVariant', // You'll need to create this server-side endpoint
                data: { req: Data.ModelVariant },
                dataType: 'json',
                beforeSend: function (request) {
                    request.setRequestHeader("RequestVerificationToken", $('#MasterVariantPanel input[name=__RequestVerificationToken]').val());
                },
                success: function (retDat) {
                    if (retDat.bitSuccess) {
                        // We have the data, now populate the form
                        Action.PopulateForm(JSON.parse(retDat.objData));
                        clsGlobal.swalSuccess("Success to Save !");
                    } else {
                        clsGlobal.swalError(retDat.txtMessage);
                    }
                },
                error: function (xhr, status, error) {
                    if (xhr.responseText.includes("!DOCTYPE html")) {
                        clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                    }
                    else {
                        clsGlobal.swalError(xhr.responseText);
                    }
                }
            });
        }
    }
}

// FIX 1: Add the missing Action.GetData function
let Action = {
    GetData: function(id) {
        // This is an AJAX call to get the data for *one* variant
        $.ajax({
            type: "POST",
            url: base_path + '/Master/Variant/GetVariantById', // You'll need to create this server-side endpoint
            data: { id: id },
            dataType: 'json',
            beforeSend: function(request) {
                request.setRequestHeader("RequestVerificationToken", $('input[name=__RequestVerificationToken]').val());
            },
            success: function(retDat) {
                if (retDat.bitSuccess) {
                    // We have the data, now populate the form
                    Action.PopulateForm(JSON.parse(retDat.objData));
                } else {
                    clsGlobal.swalError(retDat.txtMessage);
                }
            },
            error: function(xhr, status, error) {
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                }
                else {
                    clsGlobal.swalError(xhr.responseText);
                }
            }
        });
    },

    // This is a new helper function to fill your form fields
    PopulateForm: function(data) {
        // This assumes your form fields have these IDs

        $('#VariantId').val(data.VariantId); // A hidden field for the ID
        $('#VariantCode').val(data.VariantCode);
        $('#VariantName').val(data.VariantName);
        $('#chkActive').prop('checked', data.BitActive);
        $('#chkProd').prop('checked', data.BitIsReadyToProduction); // A hidden field for the ID
        $('#ChangedBy').val(data.ChangedBy);
        const formatted = moment(data.ChangedDate).isValid() ? moment(data.ChangedDate).format("YYYY-MM-DD HH:mm") : "";
        $('#ChangedDate').val(formatted);
    }
}

document.querySelectorAll('.input-group.dynamic-input input').forEach(input => {
    // debugger;
    input.addEventListener('input', function () {
        debugger;
        const table = document.querySelector('#dataTableVariant');
        const dtTable = $('#dataTableVariant').DataTable();

        const tempSpan = document.createElement('span');
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.position = 'absolute';
        tempSpan.style.whiteSpace = 'pre';
        tempSpan.style.font = window.getComputedStyle(this).font;
        tempSpan.textContent = this.value || this.placeholder;
        document.body.appendChild(tempSpan);

        const newWidth = Math.max(100, tempSpan.offsetWidth + 40);
        this.style.width = newWidth + 'px';
        document.body.removeChild(tempSpan);

        table.style.tableLayout = 'auto';
        dtTable.columns.adjust();

        if (this.value.trim() === '') {
            this.style.width = '100px';
            table.style.tableLayout = 'fixed';
            dtTable.columns.adjust();
        }
    });
}); 
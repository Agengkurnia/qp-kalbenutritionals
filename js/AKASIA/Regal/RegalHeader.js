"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var programCode = '';
var oTable;
let isEdit = false;
let DataInTable = '';
var currentViewMode = 'general'; // 'general' or 'pending'

//=======================
// REGAL HEADER OBJECT
//=======================
var RegalHeader = {
    ShowDetail: function (id) {
        console.log("RegalHeader.ShowDetail called with id:", id);

        if (!id || id === 'undefined' || id === 'null') {
            clsGlobal.swalWarning("ID Registrasi Lokal tidak valid");
            return;
        }

        $.ajax({
            type: "POST",
            url: base_path + "/Regal/GetRegalById",
            data: {
                __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val(),
                id: id
            },
            datatype: "json",
            beforeSend: function () {
                clsGlobal.showLoading();
            },
            success: function (retDat, status, xhr) {
                clsGlobal.hideLoading();
                console.log("GetRegalById response:", retDat);

                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        try {
                            var data = JSON.parse(retDat.objData);
                            console.log("Parsed data:", data);

                            if (typeof RegalDetail === 'undefined') {
                                console.error("RegalDetail object not found!");
                                clsGlobal.swalError("Registrasi Lokal Detail tidak ter-load. Silahkan refresh halaman.");
                                return;
                            }

                            RegalDetail.BindData(data);
                            f_ShowDetailRegal();
                        } catch (e) {
                            console.error("Error parsing or binding data:", e);
                            clsGlobal.swalError("Error: " + e.message);
                        }
                    }
                    else {
                        if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                            clsGlobal.swalWarning(retDat.objData);
                        }
                        else {
                            clsGlobal.swalError(retDat.txtMessage);
                        }
                    }
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.hideLoading();
                console.error("GetRegalById error:", xhr.status, xhr.responseText);

                if (xhr.status === 404) {
                    clsGlobal.swalError("Action GetRegalById tidak ditemukan di controller");
                } else if (xhr.responseText) {
                    clsGlobal.swalError(xhr.responseText);
                } else {
                    clsGlobal.swalError("Error: " + error);
                }
            }
        });
    }
};

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {

    $('.btn-search').on('click', function (e) {
        e.preventDefault();

        f_BindingGrid();
    });

    p_InitForm();

    $("#btnNew").on("click", function (e) {
        e.preventDefault();
        $('#CreateRegalModal').modal('show');
    });

    $("#btnSaveNewRegal").on("click", function (e) {
        e.preventDefault();
        p_CreateRegalHeader();
    });

    $('#btnExport').on('click', function (e) {
        e.preventDefault();
        ExportExcel();
    });

    // View Mode Toggle Handler
    $('#viewModeToggle input[name="viewMode"]').on('change', function () {
        currentViewMode = $(this).val();
        console.log('View mode changed to:', currentViewMode);

        // Reload DataTable with new filter
        if (typeof oTable !== 'undefined' && oTable) {
            oTable.draw();
        }

        // Refresh dashboard with current view mode
        if (typeof f_LoadDashboardStats === 'function') {
            f_LoadDashboardStats(currentViewMode);
        }
    });

    // Fetch pending task count on page load
    fetchPendingTaskCount();
});

// Fetch pending task count
function fetchPendingTaskCount() {
    $.ajax({
        url: base_path + '/Regal/GetPendingTaskCount',
        type: 'GET',
        success: function (response) {
            if (response && response.success) {
                $('#pendingCount').text(response.count);
                console.log('Pending task count:', response.count);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error fetching pending count:', error);
            $('#pendingCount').text('0');
        }
    });
}

function p_InitForm() {
    f_ShowListRegal();
    f_BindingGrid();
}

function f_BindingGrid() {
    oTable = $("#dataTableRegal").DataTable({
        "bPaginate": true,
        search: {
            return: true
        },
        scrollY: "400px",
        scrollX: true,
        lengthMenu: [5, 10, 25, 50, 100],
        "iDisplayLength": 10,
        serverSide: true,
        destroy: true,
        retrive: true,
        order: [[1, 'desc']],
        orderCellsTop: true,
        scrollCollapse: true,
        dom: '<"row mb-2"<"col-sm-6"l><"col-sm-6 d-flex justify-content-end align-items-center"f>>rt<"bottom"ip><"clear">',
        ajax: {
            type: "POST",
            url: base_path + '/Regal/DTRegalList',
            contentType: 'application/json',
            dataSrc: function (retDat) {
                if (retDat.bitSuccess == false) {
                    if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                        clsGlobal.swalWarning(retDat.objData);
                    }
                    else {
                        clsGlobal.swalError(retDat.txtMessage);
                    }
                }
                else {
                    //Adding to Variable
                    DataInTable = retDat.dataSerialize;
                    return retDat.data;
                }
            },
            beforeSend: function (request) {
                request.setRequestHeader("RequestVerificationToken", $('input[name=__RequestVerificationToken]').val());
            },
            data: function (d) {
                var objsearch = {
                    Search1: $("#ProjectNoSearch").val(),
                    Search2: $("#RegistrasiNoSearch").val(),
                    Search3: $("#PermintaanDateSearch").val(),
                    Search4: $("#StatusSearch").val(),
                    Search5: $("#StatusFinalLabelSearch").val(),
                    Search6: $("#ProjectTypeSearch").val(),
                    Search7: $("#BrandSearch").val(),
                    Search8: $("#SubBrandSearch").val(),
                    Search9: $("#VarianSearch").val(),
                    Search10: $("#KategoriPanganSearch").val(),
                    Search11: $("#CreatedBySearch").val(),
                    Search12: $("#CreatedDateSearch").val(),
                    Search13: $("#UpdatedBySearch").val(),
                    Search14: $("#UpdatedDateSearch").val(),
                }

                d.searchField = objsearch;
                d.viewMode = currentViewMode; // Add viewMode flag
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
        searching: false,
        columns: [

            {
                data: 'projectNo',
                className: 'dt-left text-nowrap',
                name: 'ProjectNo',
                render: function (data, type, row, meta) {
                    return data;
                }
            },
            {
                data: 'registrasiNo',
                className: 'dt-left text-nowrap',
                name: 'RegistrasiNo',
                render: function (data, type, row, meta) {
                    let SelectedId = row.regalId;
                    return `<a href="javascript:void(0);" onclick="RegalHeader.ShowDetail('${SelectedId}')"> ${data}</a>`;
                }
            },
            {
                data: 'permintaanDate',
                className: 'dt-left text-nowrap',
                name: 'PermintaanDate',
                render: function (data, type, row, meta) {
                    let formatedDate = moment(data).isValid() ? moment(data).format("DD MMM YYYY hh:mm") : "";
                    return formatedDate;
                }
            },
            {
                data: 'statusDescription',
                className: 'dt-left text-nowrap',
                name: 'StatusDescription',
            },
            {
                data: 'statusFinalLabelDescription',
                className: 'dt-left text-nowrap',
                name: 'StatusFinalLabelDescription',
                render: function (data, type, row, meta) {
                    // Display friendly status name or '-' if empty
                    return data || '-';
                }
            },
            {
                data: 'projectType',
                className: 'dt-left text-nowrap',
                name: 'ProjectType',
            },
            {
                data: 'brand',
                className: 'dt-left text-nowrap',
                name: 'Brand',
            },
            {
                data: 'subBrand',
                className: 'dt-left text-nowrap',
                name: 'SubBrand',
            },
            {
                data: 'varian',
                className: 'dt-left text-nowrap',
                name: 'Varian',
            },
            {
                data: 'kategoriPangan',
                className: 'dt-left text-nowrap',
                name: 'KategoriPangan',
            },
            {
                data: 'createdBy',
                className: 'dt-left text-nowrap',
                name: 'CreatedBy',
            },
            {
                data: 'createdDate',
                className: 'dt-left text-nowrap',
                name: 'CreatedDate',
                render: function (data, type, row, meta) {
                    let formatedDate = moment(data).isValid() ? moment(data).format("DD MMM YYYY hh:mm") : "";
                    return formatedDate;
                }
            },
            {
                data: 'updatedBy',
                className: 'dt-left text-nowrap',
                name: 'UpdatedBy',
            },
            {
                data: 'updatedDate',
                className: 'dt-left text-nowrap',
                name: 'UpdatedDate',
                render: function (data, type, row, meta) {
                    let formatedDate = moment(data).isValid() ? moment(data).format("DD MMM YYYY hh:mm") : "";
                    return formatedDate;
                }
            },
        ],
    });
}

// Dynamic width input filter + grow kolom
document.querySelectorAll('.input-group.dynamic-input input').forEach(input => {
    input.addEventListener('input', function () {
        const table = document.querySelector('#dataTableRegal');
        const dtTable = $('#dataTableRegal').DataTable();

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

function f_ShowDetailRegal() {
    $('#RegalPanel').hide();
    $('#FormDetailRegal').show();
}

function f_ShowListRegal() {
    $('#FormDetailRegal').hide();
    $('#RegalPanel').show();
}

function p_CreateRegalHeader() {
    var formData = $('#formCreateRegal').serializeArray();

    $.ajax({
        type: "POST",
        url: base_path + "/Regal/CreateRegalHeader",
        data: formData,
        datatype: "json",
        success: function (retDat, status, xhr) {
            clsGlobal.hideLoading();
            if (xhr.responseText.includes("!DOCTYPE html")) {
                clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
            }
            else {
                if (retDat.bitSuccess == true) {
                    clsGlobal.swalSuccess("Success Create Registrasi Lokal");
                    $('#CreateRegalModal').modal('hide');
                    $('#formCreateRegal')[0].reset();

                    // Refresh Grid
                    oTable.draw();
                }
                else {
                    if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                        clsGlobal.swalWarning(retDat.objData);
                    }
                    else {
                        clsGlobal.swalError(retDat.txtMessage);
                    }
                }
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.hideLoading();
            clsGlobal.swalError(xhr.responseText);
        }
    });
}

function ExportExcel() {
    var objsearch = {
        Search1: $("#ProjectNoSearch").val() || "",
        Search2: $("#RegistrasiNoSearch").val() || "",
        Search3: $("#PermintaanDateSearch").val() || "",
        Search4: $("#StatusSearch").val() || "",
        Search5: $("#StatusFinalLabelSearch").val() || "",
        Search6: $("#ProjectTypeSearch").val() || "",
        Search7: $("#BrandSearch").val() || "",
        Search8: $("#SubBrandSearch").val() || "",
        Search9: $("#VarianSearch").val() || "",
        Search10: $("#KategoriPanganSearch").val() || "",
        Search11: $("#CreatedBySearch").val() || "",
        Search12: $("#CreatedDateSearch").val() || "",
        Search13: $("#UpdatedBySearch").val() || "",
        Search14: $("#UpdatedDateSearch").val() || ""
    }

    $.ajax({
        type: "POST",
        url: base_path + "/Regal/ExportProjectList",
        data: {
            __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val(),
            Param: JSON.stringify(objsearch),
            viewMode: currentViewMode  // Add viewMode to respect tab selection
        },
        datatype: "json",
        success: function (retDat, status, xhr) {
            clsGlobal.hideLoading();
            if (xhr.responseText.includes("!DOCTYPE html")) {
                clsGlobal.swalWarningRedirect("You're Session has been Ended, Please Re-Login !", window.location.href);
            }
            else {
                if (retDat.bitSuccess == true) {
                    window.open(`${base_path}/Regal/DownloadProjectList?file=${encodeURIComponent(retDat.objData)}`);
                }
                else {
                    if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                        clsGlobal.swalWarning(retDat.txtMessage);
                    }
                    else {
                        clsGlobal.swalError(retDat.txtMessage);
                    }
                }
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.hideLoading();
            clsGlobal.swalError(xhr.responseText);
        }
    });
}

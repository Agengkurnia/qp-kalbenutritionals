"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var programCode = '';
var oTable;
let isEdit = false;
let DataInTable = '';

//=======================
// REGLOKAL HEADER OBJECT
//=======================
var RegLokalHeader = {
    ShowDetail: function (id) {
        console.log("RegLokalHeader.ShowDetail called with id:", id);
        
        if (!id || id === 'undefined' || id === 'null') {
            clsGlobal.swalWarning("ID RegLokal tidak valid");
            return;
        }

        $.ajax({
            type: "POST",
            url: base_path + "/RegLokal/GetRegLokalById",
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
                console.log("GetRegLokalById response:", retDat);
                
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        try {
                            var data = JSON.parse(retDat.objData);
                            console.log("Parsed data:", data);
                            
                            if (typeof RegLokalDetail === 'undefined') {
                                console.error("RegLokalDetail object not found!");
                                clsGlobal.swalError("RegLokalDetail.js tidak ter-load. Silahkan refresh halaman.");
                                return;
                            }
                            
                            RegLokalDetail.BindData(data);
                            f_ShowDetailRegLokal();
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
                console.error("GetRegLokalById error:", xhr.status, xhr.responseText);
                
                if (xhr.status === 404) {
                    clsGlobal.swalError("Action GetRegLokalById tidak ditemukan di controller");
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
        f_ShowDetailRegLokal();
    });
});

function p_InitForm() {
    f_ShowListRegLokal();
    f_BindingGrid();
}

function f_BindingGrid() {
    oTable = $("#dataTableRegLokal").DataTable({
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
            url: base_path + '/RegLokal/DTRegLokalList',
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
                    Search1: $("#RegLokalNoSearch").val(),
                    Search2: $("#RegLokalStatusSearch").val(),
                    Search3: $("#RegLokalNameSearch").val(),
                    Search4: $("#RegLokalStageSearch").val(),
                    Search5: $("#RegLokalTypeSearch").val(),
                    Search6: $("#RegLokalSubBrandSearch").val(),
                    Search7: $("#UpdatedSearch").val(),
                }

                d.searchField = objsearch;
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
                data: 'regLokalNo',
                className: 'dt-left text-nowrap',
                name: 'RegLokalNo',
                render: function (data, type, row, meta) {
                    let SelectedId = row.regLokalId;
                    return `<a href="javascript:void(0);" onclick="RegLokalHeader.ShowDetail('${SelectedId}')"> ${data}</a>`;
                }
            },
            {
                data: 'status',
                className: 'dt-left text-nowrap',
                name: 'Status',
            },
            {
                data: 'name',
                className: 'dt-left text-nowrap',
                name: 'Name',
            },
            {
                data: 'stage',
                className: 'dt-left text-nowrap',
                name: 'Stage',
            },
            {
                data: 'type',
                className: 'dt-left text-nowrap',
                name: 'Type',
            },
            {
                data: 'subBrand',
                className: 'dt-left text-nowrap',
                name: 'SubBrand',
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
                    let formatedDate = moment(data).isValid() ? moment(data).format("DD MMM YYYY HH:mm") : "";
                    return formatedDate;
                }
            },
        ],
    });
}

// Dynamic width input filter + grow kolom
document.querySelectorAll('.input-group.dynamic-input input').forEach(input => {
    input.addEventListener('input', function () {
        const table = document.querySelector('#dataTableRegLokal');
        const dtTable = $('#dataTableRegLokal').DataTable();

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

function f_ShowDetailRegLokal() {
    $('#RegLokalPanel').hide();
    $('#FormDetailRegLokal').show();
}

function f_ShowListRegLokal() {
    $('#FormDetailRegLokal').hide();
    $('#RegLokalPanel').show();
}


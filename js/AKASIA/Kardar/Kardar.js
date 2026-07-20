"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var programCode = '';
let selectedValue = "";
var oTable;
let DataInTable = '';
let isEdit = false;
let datDetail = {};
//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    p_InitForm();
});

//=======================
// FUNCTION
//=======================
const p_GetHiddenObjectDataInTable = () => {
    return JSON.parse(DataInTable);
}
function p_InitForm() {
    p_MasterParameter();
}
function p_MasterParameter() {
    oTable = $("#dataTableApproval").DataTable({
        "bPaginate": true,
        layout: {
            topStart: 'pageLength',
            topEnd: 'search',
            bottomStart: 'info',
            bottomEnd: 'paging'
        },
        search: {
            return: true
        },
        scrollY: "400px",
        scrollX: "100%",
        lengthMenu: [5, 10, 25, 50, 100],
        "iDisplayLength": 10,
        serverSide: true,
        destroy: true,
        retrive: true,
        order: [[0, 'asc']],
        scrollCollapse: true,
        ajax: {
            type: "POST",
            url: base_path + '/Master/Kardar/GetDataTable',
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
                    return retDat.data;
                }
            },
            beforeSend: function (request) {
                request.setRequestHeader("RequestVerificationToken", $('#FormKardar input[name=__RequestVerificationToken]').val());
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
                data: 'docMasterNo',
                className: 'dt-left text-nowrap',
                name: "DocMasterNo",
                render: function (data, type, row, meta) {
                    return data;
                    //return `<a href="javascript:void(0)" onclick="redirectButton('${encodeURIComponent(userGuid)}')"> ${data}</a>`;
                }
            },
            {
                data: 'algGroupDesc',
                className: 'dt-left',
                name: "AlgGroupDesc",
                width: '100px',
                render: function (data, type, row, meta) {
                    return `<div style="width: 100px;">
                                <span>${data}</span>
                            </div>`;
                    //return `<a href="javascript:void(0)" onclick="redirectButton('${encodeURIComponent(userGuid)}')"> ${data}</a>`;
                }
            },
            {
                data: 'kategoriPanganDesc',
                className: 'dt-left',
                name: "KategoriPanganDesc",
                width: '200px',
                render: function (data, type, row, meta) {
                    return `<div style="width: 200px;">
                                <span>${data}</span>
                            </div>`;
                    //return `<a href="javascript:void(0)" onclick="redirectButton('${encodeURIComponent(userGuid)}')"> ${data}</a>`;
                }
            },
            {
                data: 'bitActive',
                className: 'dt-center text-nowrap',
                name: "BitActive",
                render: function (data, type, row, meta) {
                    let strhtml = "<td> ";
                    strhtml += `<a href="javascript:void(0);" asp-action="View" asp-route-id="${data}" class="p-2 btn btn-sm btn-${(data == true) ? "success" : "secondary"} noborder-radius"> ${(data == true) ? "Active" : "Inactive"}</a>`;

                    strhtml += "</td>";
                    return strhtml;
                }
            },
            {
                data: 'karDarId',
                className: 'dt-center text-nowrap',
                name: "KarDarId",
                orderable: false,
                render: function (data, type, row, meta) {
                    let userGuid = row.karDarId;
                    let strhtml = "<td> ";
                    strhtml += `<a href="javascript:void(0);" onclick="p_ShowTask('${userGuid}')" class="p-2 btn btn-sm btn-info noborder-radius"> Show KarDar</a>`;

                    strhtml += "</td>";

                    return strhtml;
                }
            },
            {
                data: 'karDarId',
                className: 'dt-center text-nowrap',
                name: "KarDarId",
                orderable: false,
                render: function (data, type, row, meta) {
                    let userGuid = row.karDarId;
                    let strhtml = "<td> ";
                    strhtml += `<a href="javascript:void(0);" onclick="p_openModalEdit('${userGuid}', 'edited')" class="p-2 btn btn-sm btn-warning noborder-radius"> Edit</a>`;

                    strhtml += "</td>";

                    return strhtml;
                }
            },
            {
                data: 'createdBy',
                className: 'dt-left text-nowrap',
                name: "CreatedBy",
                render: function (data, type, row, meta) {
                    return data;
                }
            },
            {
                data: 'createdDate',
                className: 'dt-left text-nowrap',
                name: "CreatedDate",
                render: function (data, type, row, meta) {
                    const formatted = moment(data).isValid() ? moment(data).format("YYYY-MM-DD") : "";
                    return formatted;
                }
            },
            {
                data: 'updatedBy',
                className: 'dt-left text-nowrap',
                name: "UpdatedBy",
                render: function (data, type, row, meta) {
                    return data;
                }
            },
            {
                data: 'updatedDate',
                className: 'dt-left text-nowrap',
                name: "UpdatedDate",
                render: function (data, type, row, meta) {
                    const formatted = moment(data).isValid() ? moment(data).format("YYYY-MM-DD") : "";
                    return formatted;
                }
            },
        ],
    });
}

const p_ShowTask = (HeaderId) => {
    $.ajax({
        type: "POST",
        url: "/Master/Kardar/GetDataBisProById",
        async: false,
        data: {
            Id: HeaderId,
            __RequestVerificationToken: $('#FormKardar input[name=__RequestVerificationToken]').val()
        },
        beforeSend: function (request) {
            return request;
        },
        datatype: "json",
        success: function (retDat, status, xhr) {
            clsGlobal.hideLoading();
            if (xhr.responseText.includes("!DOCTYPE html")) {
                clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
            }
            else {
                if (retDat.bitSuccess == true) {
                    const capitalizedObject = capitalizeKeysDeep(retDat.objData);
                    datDetail = capitalizedObject;
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
    p_genereateDetailModal(JSON.parse(datDetail.KarDarDetail));
    p_ShowModalViewAllTask();
}

const p_genereateDetailModal = (lstData) => {
    const modalBody = document.getElementById('modalShowTaskBisProBody');

    if ($.fn.DataTable.isDataTable('#tableNutriFact')) {
        $('#tableNutriFact').DataTable().destroy();
    }

    modalBody.innerHTML = '';

    const table = document.createElement('table');
    table.id = 'tableNutriFact';
    table.className = 'table table-hover display nowrap';
    table.style.width = '100%';

    modalBody.appendChild(table);

    const dataTable = $(table).DataTable({
        data: lstData,

        columns: [
            {
                data: 'Parameter', title: 'Parameter Name', render: function (data) {
                    return `<div style="width: 200px;">
                                <span class="text-wrap">${data == null ? '' : data}</span>
                            </div>`
                }
            },
            { data: 'SatuanBPOM', title: 'Satuan BPOM', orderable: false },
            { data: 'SatuanSystem', title: 'Satuan System', orderable: false },
            { data: 'BitActive', title: 'Is Active', orderable: false, render: function (data) { return data ? "True" : "False"} }
        ],

        scrollX: true, 
        scrollY: '40vh',
        scrollCollapse: true,

        paging: false,    
        info: false,     
        searching: false, 

        createdRow: function (row, data, dataIndex) {
            if (data.BitActive === false) {
                $(row).css('color', 'red');
                $(row).css('font-weight', 'bold');
            }
        }
    });

    setTimeout(function () {
        dataTable.columns.adjust();
    }, 200);
};

const p_ShowModalViewAllTask = () => {
    let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('ShowTaskNutriFactModal'));
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };


    modal.show();
}

const pCloseModalViewAllTask = () => {
    let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('ShowTaskNutriFactModal'));
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };

    modal.hide();
}

const p_generateModalStageDetailEdit = (lstData) => {
    //Binding Value Header
    $("#AlgKelUsia").val(lstData.AlgGroup).trigger("change");
    $("#CatPangan").val(lstData.KategoriPangan).trigger("change");
    $("#DocMasterNo").val(lstData.DocMasterNo);
    $("#BitActive").prop("checked", lstData.BitActive ? true : false);
    $("#AlgKelUsia").attr("disabled", true);
    $("#CatPangan").attr("disabled", true);

    // Set Button
    $("#btnCopy").addClass("d-none");

    //Set To Hidden Object
    p_SetHiddenObjectHeader(lstData);
    nutriFact = JSON.parse(lstData.KarDarDetail);

    debugger;

    pToDataTable(nutriFact, "DETAIL");
}

const p_openModalEdit = (headerId) => {
    isEdit = true;

    $.ajax({
        type: "POST",
        url: "/Master/Kardar/GetDataBisProById",
        async: false,
        data: {
            Id: headerId,
            __RequestVerificationToken: $('#FormKardar input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat, status, xhr) {
            clsGlobal.hideLoading();
            if (xhr.responseText.includes("!DOCTYPE html")) {
                clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
            }
            else {
                if (retDat.bitSuccess == true) {
                    const capitalizedObject = capitalizeKeysDeep(retDat.objData);
                    datDetail = capitalizedObject;
                    console.log(datDetail);
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

    //GenerateFormEdit
    p_generateModalStageDetailEdit(datDetail);

    //Showing Modal
    showKardarForm();
}

function capitalizeKeysDeep(data) {
    // Jika data adalah array, proses setiap elemen di dalamnya secara rekursif
    if (Array.isArray(data)) {
        return data.map(item => capitalizeKeysDeep(item));
    }

    // Jika data adalah objek (dan bukan null)
    if (typeof data === 'object' && data !== null) {
        // Gunakan reduce untuk membangun objek baru
        return Object.keys(data).reduce((acc, key) => {
            // Buat kunci baru dengan huruf pertama kapital
            const newKey = key.charAt(0).toUpperCase() + key.slice(1);

            // Tetapkan nilai ke kunci baru, proses nilainya secara rekursif juga
            acc[newKey] = capitalizeKeysDeep(data[key]);

            return acc;
        }, {});
    }

    // Jika data bukan objek atau array (misal: string, number), kembalikan apa adanya
    return data;
}

function showKardarForm() {
    $("#formDatatable").hide();
    $("#formInputKarDar").show();

    debugger;
    setTimeout(function () {
        if ($.fn.DataTable.isDataTable('#tableDetailBisPro')) {
            $('#tableDetailBisPro').DataTable().columns.adjust();
        }
    }, 80);
}
//=======================
// HANDLER
//=======================
$("#btnCloseShowTaskBisProModal").click(function (e) {
    e.preventDefault();

    pCloseModalViewAllTask();
});
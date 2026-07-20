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
            url: base_path + '/I2MS/Master/Stage/GetDataTable',
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
                request.setRequestHeader("RequestVerificationToken", $('#FormStage input[name=__RequestVerificationToken]').val());
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
                data: 'txtStageName',
                className: 'dt-left text-nowrap',
                name: "TxtStageName",
                render: function (data, type, row, meta) {
                    let userGuid = row.uuid;
                    return data;
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
                data: 'txtHeaderId',
                className: 'dt-center text-nowrap',
                name: "TxtHeaderId",
                orderable: false,
                render: function (data, type, row, meta) {
                    let userGuid = row.txtHeaderId;
                    let strhtml = "<td> ";
                    strhtml += `<a href="javascript:void(0);" onclick="p_ShowTask('${userGuid}')" class="p-2 btn btn-sm btn-info noborder-radius"> Show Task</a>`;

                    strhtml += "</td>";

                    return strhtml;
                }
            },
            {
                data: 'txtHeaderId',
                className: 'dt-center text-nowrap',
                name: "TxtHeaderId",
                orderable: false,
                render: function (data, type, row, meta) {
                    let userGuid = row.txtHeaderId;
                    let strhtml = "<td> ";
                    strhtml += `<a href="javascript:void(0);" onclick="p_openModalEdit('${userGuid}', 'edited')" class="p-2 btn btn-sm btn-warning noborder-radius"> Edit</a>`;

                    strhtml += "</td>";

                    return strhtml;
                }
            },
            {
                data: 'txtCreatedBy',
                className: 'dt-left text-nowrap',
                name: "TxtCreatedBy",
                render: function (data, type, row, meta) {
                    return data;
                }
            },
            {
                data: 'dtmCreatedDate',
                className: 'dt-left text-nowrap',
                name: "DtmCreatedDate",
                render: function (data, type, row, meta) {
                    const formatted = moment(data).isValid() ? moment(data).format("YYYY-MM-DD") : "";
                    return formatted;
                }
            },
            {
                data: 'txtUpdatedBy',
                className: 'dt-left text-nowrap',
                name: "TxtUpdatedBy",
                render: function (data, type, row, meta) {
                    return data;
                }
            },
            {
                data: 'dtmUpdatedDate',
                className: 'dt-left text-nowrap',
                name: "DtmUpdatedDate",
                render: function (data, type, row, meta) {
                    const formattedCreated = moment(row.dtmCreatedDate).isValid() ? moment(row.dtmCreatedDate).format("YYYY-MM-DD HH:mm:ss") : "";
                    const formattedUpdated = moment(row.dtmUpdatedDate).isValid() ? moment(row.dtmUpdatedDate).format("YYYY-MM-DD HH:mm:ss") : "";

                    if (formattedCreated == formattedUpdated) {
                        return "";
                    }
                    else {
                        const formatted = moment(data).isValid() ? moment(data).format("YYYY-MM-DD") : "";
                        return formatted;
                    }
                }
            },
        ],
    });
}

const p_ShowTask = (HeaderId) => {
    //Getting Object
    let datItem = p_GetHiddenObjectDataInTable();
    //Finding item
    let datSel = datItem.find((item) => item.TxtHeaderId === HeaderId);

    //Generate and Show Modal
    p_genereateDetailModal(datSel.MasterStageDetails);
    p_ShowModalViewAllTask();
}

const p_genereateDetailModal = (lstData) => {
    // Menemukan elemen dengan id modalShowTaskBody
    const modalBody = document.getElementById('modalShowTaskBody');

    // Menghapus semua elemen span yang ada di dalam modalShowTaskBody
    modalBody.innerHTML = '';

    // Loop melalui newData dan buat elemen span baru untuk setiap data
    lstData.forEach(item => {
        // Membuat elemen span baru
        const newSpan = document.createElement('span');
        // Menambahkan teks ke dalam span
        newSpan.textContent = item.MasterTask.TaskName;
        // Menambahkan span ke dalam modalShowTaskBody
        modalBody.appendChild(newSpan);
    });
}

const p_ShowModalViewAllTask = () => {
    let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('ShowTaskModal'));
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };


    modal.show();
}

const pCloseModalViewAllTask = () => {
    let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('ShowTaskModal'));
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };

    modal.hide();
}

const p_generateModalStageDetailEdit = (datHeader, datDetail) => {
    //Binding Value Header
    $("#StageName").val(datHeader.TxtStageName);
    $("#BitActive").prop("checked", datHeader.BitActive ? true : false);

    //Set TaskName
    // Loop melalui newData dan buat elemen span baru untuk setiap data
    datDetail.forEach(item => {
        item.TaskName = item.MasterTask.TaskName;
    });

    //Set To Hidden Object
    p_SetHiddenObjectHeader(datHeader);
    p_SetLstHiddenObjectDetail(datDetail);
    pToDataTable(datDetail);
}

const p_openModalEdit = (headerId) => {
    isEdit = true;

    //Getting Object
    let datItem = p_GetHiddenObjectDataInTable();

    //Finding item
    let datDetail = datItem.find((item) => item.TxtHeaderId === headerId);

    //GenerateFormEdit
    p_generateModalStageDetailEdit(datDetail, datDetail.MasterStageDetails);

    //Showing Modal
    $("#formDataTable").hide();
    $("#formInputStage").show();
}

//=======================
// HANDLER
//=======================

$("#btnCloseShowTaskModal").click(function (e) {
    e.preventDefault();

    pCloseModalViewAllTask();
});
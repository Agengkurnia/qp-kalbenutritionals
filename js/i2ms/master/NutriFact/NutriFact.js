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
            url: base_path + '/Master/NutriFact/GetDataTable',
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
                request.setRequestHeader("RequestVerificationToken", $('#FormNutriFact input[name=__RequestVerificationToken]').val());
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
                data: 'templateName',
                className: 'dt-left text-nowrap',
                name: "TemplateName",
                render: function (data, type, row, meta) {
                    return data;
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
                data: 'nutriFactId',
                className: 'dt-center text-nowrap',
                name: "nutriFactId",
                orderable: false,
                render: function (data, type, row, meta) {
                    let userGuid = row.nutriFactId;
                    let strhtml = "<td> ";
                    strhtml += `<a href="javascript:void(0);" onclick="p_ShowTask('${userGuid}')" class="p-2 btn btn-sm btn-info noborder-radius"> Show NutriFact</a>`;

                    strhtml += "</td>";

                    return strhtml;
                }
            },
            {
                data: 'nutriFactId',
                className: 'dt-center text-nowrap',
                name: "NutriFactId",
                orderable: false,
                render: function (data, type, row, meta) {
                    let userGuid = row.nutriFactId;
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
        url: "/Master/NutriFact/GetDataBisProById",
        async: false,
        data: {
            Id: HeaderId,
            __RequestVerificationToken: $('#FormNutriFact input[name=__RequestVerificationToken]').val()
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
    //Generate and Show Modal
    p_genereateDetailModal(JSON.parse(datDetail.NutriFact));
    p_ShowModalViewAllTask();
}

const p_createRecursiveList = (items) => {
    const ul = document.createElement('ul');

    items.forEach(item => {
        const li = document.createElement('li');

        li.textContent = item.NutriFactName;

        if (item.IsMandatory) {
            li.style.color = 'red';
            li.style.fontWeight = 'bold';
        }
        else {
            li.style.color = 'black';
            li.style.fontWeight = 'normal';
        }

        if (item.SubNutriFact && item.SubNutriFact.length > 0) {
            const subListUl = p_createRecursiveList(item.SubNutriFact);

            li.appendChild(subListUl);
        }

        ul.appendChild(li);
    });

    return ul;
};

const p_genereateDetailModal = (lstData) => {
    const modalBody = document.getElementById('modalShowTaskBisProBody');
    modalBody.innerHTML = ''; // Kosongkan modal
    console.log(lstData);

    // Panggil fungsi rekursif pertama kali dengan data top-level
    const generatedList = p_createRecursiveList(lstData);

    // Lampirkan hasil akhirnya ke modal body
    modalBody.appendChild(generatedList);
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
    $("#TemplateCode").val(lstData.TemplateCode);
    $("#TemplateName").val(lstData.TemplateName);
    $("#BitActive").prop("checked", lstData.BitActive ? true : false);
    $("#TemplateCode").attr("disabled",true);

    //Set To Hidden Object
    p_SetHiddenObjectHeader(lstData);
    nutriFact = JSON.parse(lstData.NutriFact);

    debugger;

    pToDataTable(nutriFact, "DETAIL");
}

const p_openModalEdit = (headerId) => {
    isEdit = true;

    $.ajax({
        type: "POST",
        url: "/Master/NutriFact/GetDataBisProById",
        async: false,
        data: {
            Id: headerId,
            __RequestVerificationToken: $('#FormNutriFact input[name=__RequestVerificationToken]').val()
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
    $("#formDatatable").hide();
    $("#formInputNutriFact").show();
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
//=======================
// HANDLER
//=======================
$("#btnCloseShowTaskBisProModal").click(function (e) {
    e.preventDefault();

    pCloseModalViewAllTask();
});
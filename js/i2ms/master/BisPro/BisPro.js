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
            url: base_path + '/Master/BisPro/GetDataTable',
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
                request.setRequestHeader("RequestVerificationToken", $('#FormBisPro input[name=__RequestVerificationToken]').val());
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
                data: 'txtBisProName',
                className: 'dt-left text-nowrap',
                name: "TxtBisProName",
                render: function (data, type, row, meta) {
                    return data;
                    //return `<a href="javascript:void(0)" onclick="redirectButton('${encodeURIComponent(userGuid)}')"> ${data}</a>`;
                }
            },
            {
                data: 'txtProjectTypeDesc',
                className: 'dt-left text-nowrap',
                name: "TxtProjectType",
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
                data: 'txtHeaderId',
                className: 'dt-center text-nowrap',
                name: "txtHeaderId",
                orderable: false,
                render: function (data, type, row, meta) {
                    let userGuid = row.txtHeaderId;
                    let strhtml = "<td> ";
                    strhtml += `<a href="javascript:void(0);" onclick="p_ShowTask('${userGuid}')" class="p-2 btn btn-sm btn-info noborder-radius"> Show Stage</a>`;

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
        url: "/Master/BisPro/GetDataBisProById",
        async: false,
        data: {
            Id: HeaderId,
            __RequestVerificationToken: $('#FormBisPro input[name=__RequestVerificationToken]').val()
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
    p_genereateDetailModal(datDetail.MasterBisProDetails);
    p_ShowModalViewAllTask();
}

const p_genereateDetailModal = (lstData) => {
    const modalBody = document.getElementById('modalShowTaskBisProBody');
    modalBody.innerHTML = '';

    const ul = document.createElement('ul');

    lstData.forEach((item, index) => {
        const stageNumber = `${index + 1}`;
        const li = document.createElement('li');

        // Stage utama (misal: 1)
        const stageSpan = document.createElement('span');
        stageSpan.textContent = `${stageNumber}. ${item.MasterStageHeader.TxtStageName}`;
        stageSpan.style.fontWeight = 'bold';
        li.appendChild(stageSpan);

        let subItemCounter = 1;
        let subStageCounter = 1;

        // Task langsung di bawah Stage utama (misal: 1.1, 1.2)
        if (item.MasterStageHeader.MasterStageDetails && item.MasterStageHeader.MasterStageDetails.length > 0) {
            const taskUl = document.createElement('ul');
            item.MasterStageHeader.MasterStageDetails.forEach((task) => {
                const taskLi = document.createElement('li');
                taskLi.textContent = `${stageNumber}.0.${subItemCounter++} ${task.MasterTask.TaskName}`;
                taskUl.appendChild(taskLi);
            });
            li.appendChild(taskUl);
        }

        // SubStage (misal: 1.3, 1.4)
        if (item.MasterBisProSubDetails && item.MasterBisProSubDetails.length > 0) {
            const subUl = document.createElement('ul');

            item.MasterBisProSubDetails.forEach((sub) => {
                const currentSubStageNumber = `${stageNumber}.${subStageCounter++}`;
                const subLi = document.createElement('li');

                const subStageSpan = document.createElement('span');
                subStageSpan.textContent = `${currentSubStageNumber} ${sub.MasterStageHeader.TxtStageName}`;
                subStageSpan.style.fontWeight = 'bold';
                subLi.appendChild(subStageSpan);

                // Task dalam sub-stage (misal: 1.3.1, 1.3.2)
                if (sub.MasterStageHeader.MasterStageDetails && sub.MasterStageHeader.MasterStageDetails.length > 0) {
                    const taskUl = document.createElement('ul');
                    sub.MasterStageHeader.MasterStageDetails.forEach((task, subTaskIndex) => {
                        const taskLi = document.createElement('li');
                        taskLi.textContent = `${currentSubStageNumber}.${subTaskIndex + 1} ${task.MasterTask.TaskName}`;
                        taskUl.appendChild(taskLi);
                    });
                    subLi.appendChild(taskUl);
                }

                subUl.appendChild(subLi);
            });

            li.appendChild(subUl);
        }

        ul.appendChild(li);
    });

    modalBody.appendChild(ul);
};

const p_ShowModalViewAllTask = () => {
    let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('ShowTaskBisProModal'));
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };


    modal.show();
}

const pCloseModalViewAllTask = () => {
    let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('ShowTaskBisProModal'));
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };

    modal.hide();
}

const p_generateModalStageDetailEdit = (lstData) => {
    //Binding Value Header
    $("#BisProName").val(lstData.TxtBisProName);
    $("#ProjectType").val(lstData.TxtProjectType).trigger("change");
    $("#BitActive").prop("checked", lstData.BitActive ? true : false);
    $("#ProjectType").attr("disabled",true);

    //Set Stage
    // Loop melalui newData dan buat elemen span baru untuk setiap data
    lstData.MasterBisProDetails.forEach((item, index) => {

        item.StageName = item.MasterStageHeader.TxtStageName;
        item.DetailIndex = index;

        if (item.MasterBisProSubDetails && item.MasterBisProSubDetails.length > 0) {

            item.MasterBisProSubDetails.forEach((itemS) => {
                debugger;
                itemS.StageName = itemS.MasterStageHeader.TxtStageName;
                itemS.DetailIndex = index;

                // Cari group berdasarkan HeaderIndex / DetailIndex
                let group = temSubDetail.find(x => x.HeaderIndex === index);
                let groupIndex = temSubDetail.findIndex(x => x.HeaderIndex === index);

                if (!group) {
                    // Buat grup baru jika belum ada
                    group = {
                        HeaderIndex: index,
                        ListItem: [itemS]
                    };
                    temSubDetail.push(group);
                } else {
                    //Update ke Variable
                    temSubDetail[groupIndex].ListItem.push(itemS);
                }
            });
        }
    });

    //Delete Data Master StageHeader
    lstData.MasterBisProDetails.forEach((item, index) => {
        item.MasterStageHeader = {};
    });

    //Set To Hidden Object
    p_SetHiddenObjectHeader(lstData);
    p_SetLstHiddenObjectDetail(lstData.MasterBisProDetails);
    console.log(lstData.MasterBisProDetails);

    debugger;

    pToDataTable(lstData.MasterBisProDetails, "DETAIL");
}

const p_openModalEdit = (headerId) => {
    isEdit = true;

    $.ajax({
        type: "POST",
        url: "/Master/BisPro/GetDataBisProById",
        async: false,
        data: {
            Id: headerId,
            __RequestVerificationToken: $('#FormBisPro input[name=__RequestVerificationToken]').val()
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

    //GenerateFormEdit
    p_generateModalStageDetailEdit(datDetail);

    //Showing Modal
    $("#formDatatable").hide();
    $("#formInputBisPro").show();
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
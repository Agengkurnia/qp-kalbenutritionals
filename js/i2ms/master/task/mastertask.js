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
// ON PAGE LOAD
//=======================
$(document).ready(function () {
   
    $('.btn-search').on('click', function (e) {
        e.preventDefault();

        f_BindingGrid();
    });

    
    p_InitForm();
});

//=======================
// FUNCTION
//=======================
function p_InitForm() {
    f_BindingGrid();
}

const p_GetHiddenObjectDataInTable = () => {
    return JSON.parse(DataInTable);
}
function f_BindingGrid() {
    oTable = $("#dataTableMasterTask").DataTable({
        "bPaginate": true,
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
        orderCellsTop: true,
        scrollCollapse: true,
        ajax: {
            type: "POST",
            url: base_path + '/I2MS/MasterTask/GetDataTable',
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
                request.setRequestHeader("RequestVerificationToken", $('#FormParameter input[name=__RequestVerificationToken]').val());
            },
            data: function (d) {
                var objsearch = {
                    Search1: $("#TaskSearch").val(),
                    Search2: $("#CollabSearch").val(),
                    Search3: $("#BreakdownSearch").val(),
                    Search4: $("#CreatedSearch").val(),
                    Search5: $("#UpdatedSearch").val(),
                    Search6: "",
                    Search7: "",
                    Search8: "",
                    Search9: "",
                    Search10: ""
                }

                //console.log("Masuk Sini");
                //var datasearch = JSON.stringify(objsearch);
                d.searchField = objsearch;
                //console.log("Ini Data nya");
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
                data: 'taskName',
                className: 'dt-left text-nowrap',
                name: 'Task',
                width: '200px',
                render: function (data, type, row, meta) {
                    let userGuid = row.taskId;
                    return `<a href="javascript:void(0);" onclick="p_openModalEdit('${userGuid}')"> ${data}</a>`;
                }
            },
            {
                data: 'taskCollaboratorDesc',
                className: 'dt-left text-nowrap',
                width: '150px',
                name: 'Collaborator',
            },
            {
                data: 'taskBreakdownDesc',
                className: 'dt-left text-nowrap',
                width: '250px',
                name: 'Breakdown',
            },
            {
                data: 'isActive',
                className: 'dt-center text-nowrap',
                name: 'BitActive',
                render: function (data, type, row, meta) {
                    return (data == true) ? "True" : "False";
                }
            },
            {
                data: 'createdBy',
                width: '150px',
                className: 'dt-left text-nowrap',
                name: 'CreatedBy',
            },
            {
                data: 'createdDate',
                className: 'dt-left text-nowrap',
                name: 'CreatedBy',
                render: function (data, type, row, meta) {
                    const formatted = moment(data).isValid() ? moment(data).format("YYYY-MM-DD") : "";
                    return formatted;
                }
            },
            {
                data: 'createdBy',
                width: '150px',
                className: 'dt-left text-nowrap',
                name: 'CreatedBy',
            },
            {
                data: 'updatedDate',
                className: 'dt-left text-nowrap',
                name: 'CreatedBy',
                render: function (data, type, row, meta) {
                    const formatted = moment(data).isValid() ? moment(data).format("YYYY-MM-DD") : "";
                    return formatted;
                }
            },
        ],
    });
}

const p_generateModalStageEdit = (datHeader) => {
    debugger;
    //Binding Value Header
    $("#TaskName").val(datHeader.TaskName);
    $("#Collaborator").val(datHeader.TaskCollaborator).trigger("change");
    $("#TasklistBreakdown").val(datHeader.TaskBreakdown).trigger("change");
    $("#BitActive").prop("checked", datHeader.IsActive ? true : false);

    //Set To Hidden Object
    p_SetHiddenObjectHeader(datHeader);
}

const p_openModalEdit = (headerId) => {
    debugger;
    isEdit = true;

    //Getting Object
    let datItem = p_GetHiddenObjectDataInTable();

    //Finding item
    let datHeader = datItem.find((item) => item.TaskId === headerId);

    //Binding Item
    p_generateModalStageEdit(datHeader);

    //Showing Modal
    $("#formTaskList").hide();
    $("#formInputTask").show();
}

//=======================
// HANDLER
//=======================
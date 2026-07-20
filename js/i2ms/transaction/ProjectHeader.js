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

        GridProjectHeader.Render();
    });

    $('#btnNew').on('click', function (e) {
        e.preventDefault();
        $('#FormState').val('Create');
        ProjectHeader.Init();
        ProjectHeader.Create();
        GridProjectHeader.ShowDetail();

    });

    $('#btnExport').on('click', function (e) {
        e.preventDefault();

        let TYPE_FORM = $("#StatusProject").val();

        GridProjectHeader.ExportExcel(TYPE_FORM);
    });

    GridProjectHeader.Init();
});

//function p_InitForm() {
//    f_ShowListProject();
//    f_BindingGrid();
//}

let GridProjectHeader = {
    Init: function () {
        GridProjectHeader.ShowList();
        GridProjectHeader.Render();
    },
    Render: function () {
        var objsearch = {
            Search1: $("#ProjectNoSearch").val(),
            Search2: $("#ProjectNameSearch").val(),
            Search3: $("#ProjectStatusSearch").val(),
            Search4: $("#ProjectTypeSearch").val(),
            Search5: $("#ProjectSubBrandSearch").val(),
            Search6: "",
            Search7: "",
            Search8: "",
            Search9: "",
            Search10: $("#StatusProject").val()
        }

        oTable = $("#dataTableProject").DataTable({
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
            retrive: true,
            order: [[7, 'desc']],
            orderCellsTop: true,
            scrollCollapse: true,
            dom: '<"row mb-2"<"col-sm-6"l><"col-sm-6 d-flex justify-content-end align-items-center"f>>rt<"bottom"ip><"clear">',
            ajax: {
                type: "POST",
                url: base_path + '/I2MS/DTProjectList',
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
                    d.searchField = objsearch;
                    let param = JSON.stringify(d);
                    //console.log(param)
                    return param;
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
                    data: 'projectNumber',
                    className: 'dt-left text-nowrap',
                    name: 'ProjectNumber',
                    render: function (data, type, row, meta) {
                        let SelectedId = row.projectId;
                        return `<a href="javascript:void(0);" onclick="ProjectHeader.ShowDetail('${SelectedId}')"> ${data}</a>`;
                    }
                },
                {
                    data: 'projectStatus',
                    width: '50px',
                    name: 'ProjectStatus',
                },
                {
                    data: 'projectName',
                    className: 'dt-left text-nowrap',
                    name: 'ProjectName',
                },
                {
                    data: 'projectStage',
                    className: 'dt-left text-nowrap',
                    name: 'ProjectStage',
                },
                {
                    data: 'projectType',
                    className: 'dt-left',
                    name: 'ProjectType',
                },
                {
                    data: 'subBrand',
                    className: 'dt-left ',
                    name: 'SubBrand',
                },
                {
                    data: 'updatedBy',
                    className: 'dt-left text-nowrap',
                    name: 'UpdatedBy',
                },
                {
                    data: 'updatedDate',
                    className: 'dt-center text-nowrap',
                    name: 'UpdatedDate',
                    render: function (data, type, row, meta) {
                        const formatted = moment(data).isValid() ? moment(data).format("YYYY-MM-DD HH:mm") : "";
                        return formatted;
                    }
                },
            ],
            "drawCallback": function (settings) {
                // 1. Get the DataTables API instance for the table
                var api = this.api();

                // 2. Call the columns.adjust() method to recalculate widths
                api.columns.adjust();

                // Optional: Call draw(false) if you need the table to fully re-render 
                // with the new widths, though adjust() often handles this.
                // api.draw(false); 
            }
        });
    },
    ShowDetail: function () {
        $('#ProjectPanel').hide();
        $('#FormDetailProject').show();
    },
    ShowList: function () {
        $('#FormState').val('');
        $('#FormDetailProject').hide();
        $('#ProjectPanel').show();
    },
    ExportExcel: function (typeForm) {
        var objsearch = {
            Search1: $("#ProjectNoSearch").val(),
            Search2: $("#ProjectNameSearch").val(),
            Search3: $("#ProjectStatusSearch").val(),
            Search4: $("#ProjectTypeSearch").val(),
            Search5: $("#ProjectSubBrandSearch").val(),
            Search6: "",
            Search7: "",
            Search8: "",
            Search9: "",
            Search10: $("#StatusProject").val()
        }

        $.ajax({
            type: "POST",
            url: "/I2MS/ExportProjectList",
            data: {
                __RequestVerificationToken: $('#productSpect input[name=__RequestVerificationToken]').val(),
                TypeForm: typeForm,
                Param: JSON.stringify(objsearch),
            },
            datatype: "json",
            success: function (retDat, status, xhr) {
                clsGlobal.hideLoading();
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("You're Session has been Ended, Please Re-Login !", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        window.open(`/I2MS/DownloadProjectList?file=${encodeURIComponent(retDat.objData)}`);
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
}
//function f_BindingGrid() {
//    var objsearch = {
//        Search1: $("#ProjectNoSearch").val(),
//        Search2: $("#ProjectNameSearch").val(),
//        Search3: $("#ProjectStatusSearch").val(),
//        Search4: $("#ProjectTypeSearch").val(),
//        Search5: $("#ProjectSubBrandSearch").val(),
//        Search6: "",
//        Search7: "",
//        Search8: "",
//        Search9: "",
//        Search10: $("#StatusProject").val()
//    }

//    oTable = $("#dataTableProject").DataTable({
//        "bPaginate": true,
//        search: {
//            return: true
//        },
//        scrollY: "500px",
//        scrollX: "150%",
//        lengthMenu: [5, 10, 25, 50, 100],
//        "iDisplayLength": 10,
//        serverSide: true,
//        destroy: true,
//        retrive: true,
//        order: [[7, 'desc']],
//        orderCellsTop: true,
//        scrollCollapse: true,
//        dom: '<"row mb-2"<"col-sm-6"l><"col-sm-6 d-flex justify-content-end align-items-center"f>>rt<"bottom"ip><"clear">',
//        ajax: {
//            type: "POST",
//            url: base_path + '/I2MS/DTProjectList',
//            contentType: 'application/json',
//            dataSrc: function (retDat) {
//                if (retDat.bitSuccess == false) {
//                    if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
//                        clsGlobal.swalWarning(retDat.objData);
//                    }
//                    else {
//                        clsGlobal.swalError(retDat.txtMessage);
//                    }
//                }
//                else {
//                    //Adding to Variable
//                    DataInTable = retDat.dataSerialize;
//                    return retDat.data;
//                }
//            },
//            beforeSend: function (request) {
//                request.setRequestHeader("RequestVerificationToken", $('input[name=__RequestVerificationToken]').val());
//            },
//            data: function (d) {
//                d.searchField = objsearch;
//                let param = JSON.stringify(d);
//                console.log(param)
//                return param;
//            },
//            datatype: "json",
//            error: function (xhr, status, error) {
//                if (xhr.responseText.includes("!DOCTYPE html")) {
//                    clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
//                }
//                else {
//                    clsGlobal.swalError(xhr.responseText);
//                }
//            }
//        },
//        searching: false,
//        columns: [
//            {
//                data: 'projectNumber',
//                className: 'dt-left text-nowrap', 
//                name: 'ProjectNumber',
//                render: function (data, type, row, meta) {
//                    let SelectedId = row.projectId;
//                    return `<a href="javascript:void(0);" onclick="ProjectHeader.ShowDetail('${SelectedId}')"> ${data}</a>`;
//                }
//            },
//            {
//                data: 'projectStatus',
//                width: '50px',
//                name: 'ProjectStatus',
//            },
//            {
//                data: 'projectName',
//                className: 'dt-left text-nowrap',
//                name: 'ProjectName',
//            },
//            {
//                data: 'projectStage',
//                className: 'dt-left text-nowrap',
//                name: 'ProjectStage',
//            },
//            {
//                data: 'projectType',
//                className: 'dt-left text-nowrap',
//                name: 'ProjectType',
//            },
//            {
//                data: 'subBrand',
//                className: 'dt-left text-nowrap',
//                name: 'SubBrand',
//            },
//            {
//                data: 'updatedBy',
//                className: 'dt-left text-nowrap',
//                name: 'UpdatedBy',
//            },
//            {
//                data: 'updatedDate',
//                className: 'dt-center text-nowrap',
//                name: 'UpdatedDate',
//                render: function (data, type, row, meta) {
//                    const formatted = moment(data).isValid() ? moment(data).format("YYYY-MM-DD hh:mm") : "";
//                    return formatted;
//                }
//            },
//        ],
//    });
//}

// Dynamic width input filter + grow kolom
document.querySelectorAll('.input-group.dynamic-input input').forEach(input => {
   // debugger;
    input.addEventListener('input', function () {
        debugger;
        const table = document.querySelector('#dataTableProject');
        const dtTable = $('#dataTableProject').DataTable();

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

//function f_ShowDetailProject() {

//    $('#ProjectPanel').hide();
//    $('#FormDetailProject').show();
//}

//function f_ShowListProject() {
//    $('#FormState').val('');
//    $('#FormDetailProject').hide();
//    $('#ProjectPanel').show();
//}

//function ExportProject(typeForm) {
//    var objsearch = {
//        Search1: $("#ProjectNoSearch").val(),
//        Search2: $("#ProjectNameSearch").val(),
//        Search3: $("#ProjectStatusSearch").val(),
//        Search4: $("#ProjectTypeSearch").val(),
//        Search5: $("#ProjectSubBrandSearch").val(),
//        Search6: "",
//        Search7: "",
//        Search8: "",
//        Search9: "",
//        Search10: $("#StatusProject").val()
//    }

//    $.ajax({
//        type: "POST",
//        url: "/I2MS/ExportProjectList",
//        data: {
//            __RequestVerificationToken: $('#productSpect input[name=__RequestVerificationToken]').val(),
//            TypeForm: typeForm,
//            Param: JSON.stringify(objsearch),
//        },
//        datatype: "json",
//        success: function (retDat, status, xhr) {
//            clsGlobal.hideLoading();
//            if (xhr.responseText.includes("!DOCTYPE html")) {
//                clsGlobal.swalWarningRedirect("You're Session has been Ended, Please Re-Login !", window.location.href);
//            }
//            else {
//                if (retDat.bitSuccess == true) {
//                    window.open(`/I2MS/DownloadProjectList?file=${encodeURIComponent(retDat.objData)}`);
//                }
//                else {
//                    if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
//                        clsGlobal.swalWarning(retDat.txtMessage);
//                    }
//                    else {
//                        clsGlobal.swalError(retDat.txtMessage);
//                    }
//                }
//            }
//        },
//        error: function (xhr, status, error) {
//            clsGlobal.hideLoading();
//            clsGlobal.swalError(xhr.responseText);
//        }
//    });
//}
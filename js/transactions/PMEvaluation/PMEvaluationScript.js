"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var programCode = '';
var oTable;
//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {

    $('.btn-search').on('click', function (e) {
        e.preventDefault();

        p_PMEvaluation();
    });


    p_InitForm();
});

//=======================
// FUNCTION
//=======================
function p_InitForm() {
    p_PMEvaluation();
}

function p_PMEvaluation() {
    debugger;
    oTable = $("#dataTablePMEvaluation").DataTable({
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
        order: [[1, 'desc']],
        orderCellsTop: true,
        scrollCollapse: true,
        /*dom: '<"top"l>rt<"bottom"ip><"clear">',*/
        dom: '<"row mb-2"<"col-sm-6"l><"col-sm-6 d-flex justify-content-end align-items-center"f>>rt<"bottom"ip><"clear">',
        ajax: {
            type: "POST",
            url: base_path + '/PMEvaluation/GetDataTable',
            contentType: 'application/json',
            dataSrc: function (retDat) {
                debugger;
                if (retDat.bitSuccess == false) {
                    debugger;
                    if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                        clsGlobal.swalWarning(retDat.objData);
                    }
                    else {
                        clsGlobal.swalError(retDat.txtMessage);
                    }
                }
                else {
                    debugger;
                    return retDat.data;
                }
            },
            beforeSend: function (request) {
                request.setRequestHeader("RequestVerificationToken", $('#FormPMEvaluation input[name=__RequestVerificationToken]').val());
            },
            data: function (d) {
                var objsearch = {
                    Search1: $("#DocNoSearch").val(),
                    Search2: $("#CreatedDateSearch").val(),
                    Search3: $("#StatusSearch").val(),
                    Search4: $("#ItemSampleSearch").val(),
                    Search5: $("#SampleDescSearch").val(),
                    Search6: $("#SupplierSearch").val(),
                    Search7: $("#CreatorSearch").val(),
                    Search8: $("#ApprovalProgressSearch").val(),
                    Search9: "",
                    Search10: ""
                }

                //console.log("Masuk Sini");
                //var datasearch = JSON.stringify(objsearch);
                d.searchField = objsearch;
                console.log(d);
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
        searching: true,
        columns: [
            {
                data: 'txtPmevaluationNumber',
                render: function (data, type, row, meta) {
                    let userGuid = row.txtIdParameter;

                    return `<a href="javascript:void(0)" onclick="redirectButton('${encodeURIComponent(row.txtPmevaluationId)}')"> ${data}</a>`;
                }
            },
            {
                data: 'dtmCreatedDate',
                render: function (data) {
                    if (!data) return '';

                    let dateObj = new Date(data);
                    let year = dateObj.getFullYear();
                    let month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
                    let day = dateObj.getDate().toString().padStart(2, '0');

                    return `${month}-${day}-${year}`;
                }
            },
            {
                data: 'txtDocStatus'
            },
            {
                data: 'txtSampleDesc'
            },
            {
                data: 'txtItemSampleCode'
            },
            {
                data: 'txtSupplier'
            },
            {
                data: 'txtCreatedBy'
            },
            //{
            //    data: 'txtApprovalProcess'
            //},
            //{
            //    data: null,
            //    render: function (data, type, row) {
            //        return `<a href="/PMEvaluation/Detail?id=${row.txtIdParameter}" class="btn btn-sm btn-warning"> <i class="fas fa-edit me-1"></i> Edit </a>`;
            //    },
            //    orderable: false,
            //    searchable: false
            //},
        ],
    });

    // Auto-search saat user mengetik (tanpa perlu Enter)
    $('.dataTables_filter input').on('keyup', function () {
        oTable.search(this.value).draw();
    });
    //$('#dataTablePMEvaluation').on('draw.dt', function () {
    //    $('#dataTablePMEvaluation').DataTable().columns.adjust();
    //});
    //$('#btnGlobalSearch').on('click', function () {
    //    const keyword = $('#globalSearchPM').val();
    //    oTable.search(keyword).draw();
    //});

    //$('#globalSearchPM').on('keyup', function (e) {
    //    if (e.key === 'Enter') {
    //        oTable.search(this.value).draw();
    //    }
    //});

    //// Enable enter key for search
    //$('.dataTables_filter input').on('keyup', function (e) {
    //    if (e.key === 'Enter') {
    //        oTable.search(this.value).draw();
    //    }
    //});
}

function redirectButton(param) {
    // Get the current page URL (where we're clicking FROM)
    const currentPageUrl = window.location.href;
    
    // Get the destination URL (where we're going TO)
    const destinationUrl = base_path + `/PMEvaluation/Detail?id=${encodeURIComponent(param)}`;
    
    // Set localStorage state before navigation
    localStorage.setItem('prevurlMenu', currentPageUrl);
    localStorage.setItem('urlMenu', destinationUrl);
    
    // Navigate to the detail page
    return window.location.href = destinationUrl;
}

//=======================
// HANDLER
//=======================

$("#btnNew").on('click', function () {
    window.location.href = base_path + `/PMEvaluation/Detail`;
});

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

        p_MatrixStructure();
    });


    p_InitForm();
});

//=======================
// FUNCTION
//=======================
function p_InitForm() {
    p_MatrixStructure();
}

function p_MatrixStructure() {
    debugger;
    oTable = $("#dataTableMatrixStructure").DataTable({
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
        order: [[4, 'desc']],
        orderCellsTop: true,
        scrollCollapse: true,
        /*dom: '<"top"l>rt<"bottom"ip><"clear">',*/
        dom: '<"row mb-2"<"col-sm-6"l><"col-sm-6 d-flex justify-content-end align-items-center"f>>rt<"bottom"ip><"clear">',
        ajax: {
            type: "POST",
            url: base_path + '/MatrixStructure/GetDataTable',
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
                    return retDat.data || []; // fallback ke array kosong
                }
            },
            beforeSend: function (request) {
                request.setRequestHeader("RequestVerificationToken", $('#FormMatrixStructure input[name=__RequestVerificationToken]').val());
            },
            data: function (d) {
                var objsearch = {
                    Search1: $("#DocNoSearch").val(),
                    Search2: $("#DocStatusSearch").val(),
                    Search3: $("#BrandSearch").val(),
                    Search4: $("#VarianRasaSearch").val(),
                    Search5: $("#DocDateSearch").val(),
                    Search6: $("#CreatorSearch").val(),
                    Search7: "",
                    Search8: "",
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
                data: 'txtMatrixStructureNo',
                render: function (data, type, row) {
                    return `<a href="/MatrixStructure/Detail?id=${row.txtMatrixStructureId}" >${data} </a>`;
                },
                orderable: false,
                searchable: false
            },
            {
                data: 'txtStatus'
            },
            {
                data: 'txtBrand'
            },
            {
                data: 'txtVarianRasa'
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
                data: 'txtCreatedBy'
            },
        ],
    });

    //// Auto-search saat user mengetik (tanpa perlu Enter)
    //$('.dataTables_filter input').on('keyup', function () {
    //    oTable.search(this.value).draw();
    //});

    // Global search hanya jalan ketika tekan Enter
    $('.dataTables_filter input').off('keyup').on('keypress', function (e) {
        if (e.which === 13) { // 13 = Enter
            oTable.search(this.value).draw();
        }
    });
}

var projectHeader={
    DownloadTemplate: function () {
        $.ajax({
            type: "POST",
            url: "/MatrixStructure/NPOIDowloadTemplate",
            data: {
                data: $("#txtHiddenObject").val(),
                __RequestVerificationToken: $('#FormMatrixStructure input[name=__RequestVerificationToken]').val()

            },
            datatype: "json",
            success: function (url) {
                // Redirect to download URL
                window.location = url;
            },
            error: function (xhr, status, error) {
                console.error("Export failed: ", error);
                alert("Export failed. Please try again.");
            }
        });
    }
        
};
function redirectButton(param) {
    return window.location.href = base_path + `/Master/MatrixStructure/Edit?id=${encodeURIComponent(param)}`;
}

//=======================
// HANDLER
//=======================

$("#btnNewUpload").on('click', function () {
    window.location.href = base_path + `/MatrixStructure/Detail`;
});

$('#btnDownload').on('click', function (e) {
    e.preventDefault();
    debugger;
    projectHeader.DownloadTemplate();
});
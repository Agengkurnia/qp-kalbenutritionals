"use strict";

//=======================
// VARIABLE GLOBAL
//=======================

var clsGlobal = new clsGlobalClass();
var programCode = '';
var oTable;
var LOV;


//=======================
// ON PAGE LOAD
//=======================

$(document).ready(function () {


    p_TransactionItemProductionRegistration();

});

$('.btn-search').on('click', function (e) {
    e.preventDefault();
    oTable.ajax.reload();

    //document.querySelectorAll('.input-group.dynamic-input input').forEach(input => {
    //    input.addEventListener('input', function () {
    //        autoResizeDynamicInput(this);

    //        if (this.value.trim() === '') {
    //            this.style.width = '100px';
    //        }
    //    });
    //});
});

//=======================
// FUNCTION
//=======================

function p_InitForm() {
    p_TransactionItemProductionRegistration();
}

function p_TransactionItemProductionRegistration() {
    oTable = $("#dataTableItemProductionRegistration").DataTable({
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
        dom: '<"row mb-2"<"col-sm-6"l><"col-sm-6 d-flex justify-content-end align-items-center"f>>rt<"bottom"ip><"clear">',
        ajax: {
            type: "POST",
            url: base_path + '/ItemProductionRegistration/GetDataTable',
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
                request.setRequestHeader("RequestVerificationToken", $('#FormParameter input[name=__RequestVerificationToken]').val());
            },
            data: function (d) {
                var objsearch = {
                    Search1: $("#SampleNumberSearch").val(),
                    Search2: $("#CreatedDateSearch").val(),
                    Search3: $("#StatusSearch").val(),
                    Search4: $("#ItemCodeSearch").val(),
                    Search5: $("#ItemDescriptionSearch").val(),
                    Search6: $("#UomSearch").val(),
                    Search7: $("#SupplierSearch").val(),
                    Search8: $("#CreatorSearch").val(),
                    Search9: $("#ApprovalProcessSearch").val()
                    //Search10: ""
                }

                //var datasearch = JSON.stringify(objsearch);
                d.searchField = objsearch;
                console.log(d);
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
                //data: 'txtItemSampleNumber',
                width: '20%',
                data: 'txtItemSampleNumber',
                render: function (data, type, row, meta) {
                    return '<a href="#" onclick="redirectButton(\'' + row.txtId + '\'); return false;">' + data + '</a>';
                }
            },
            {
                data: 'dtmCreatedDate',
            },
            {
                data: 'txtStatus'
            },
            {
                data: 'txtItemPmProductionCode'
            },
            {
                data: 'txtItemPmProductionDescription'
            },
            {
                data: 'txtUom',
            },
            {
                data: 'txtSupplierName'
            },
            {
                data: 'txtCreatedBy'
            },
            {
                data: 'txtApprovalProcess'
            },
        ],
    });
    // Auto-search saat user mengetik (tanpa perlu Enter)
    $('.dataTables_filter input').on('keyup', function () {
        oTable.search(this.value).draw();
    });

    //$('#dataTableItemProductionRegistration').on('draw.dt', function () {
    //    document.querySelectorAll('.input-group.dynamic-input input').forEach(input => {
    //        autoResizeDynamicInput(input);
    //    });
    //});

//    initDynamicInputAutoGrow('#dataTableItemProductionRegistration');
}

// Dynamic width input filter + grow kolom
document.querySelectorAll('.input-group.dynamic-input input').forEach(input => {
    debugger;
    input.addEventListener('input', function () {
        debugger;
        const table = document.querySelector('#dataTableItemProductionRegistration');
        const dtTable = $('#dataTableItemProductionRegistration').DataTable();

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

//function autoResizeDynamicInput(inputElement) {
//    const tempSpan = document.createElement('span');
//    tempSpan.style.visibility = 'hidden';
//    tempSpan.style.position = 'absolute';
//    tempSpan.style.whiteSpace = 'pre';
//    tempSpan.style.font = window.getComputedStyle(inputElement).font;
//    tempSpan.textContent = inputElement.value || inputElement.placeholder;
//    document.body.appendChild(tempSpan);

//    const newWidth = Math.max(100, tempSpan.offsetWidth + 40);
//    inputElement.style.width = newWidth + 'px';
//    document.body.removeChild(tempSpan);
//}

//function initDynamicInputAutoGrow(tableSelector) {
//    function resizeInput(input) {
//        const tempSpan = document.createElement('span');
//        tempSpan.style.visibility = 'hidden';
//        tempSpan.style.position = 'absolute';
//        tempSpan.style.whiteSpace = 'pre';
//        tempSpan.style.font = window.getComputedStyle(input).font;
//        tempSpan.textContent = input.value || input.placeholder;
//        document.body.appendChild(tempSpan);
//        const newWidth = Math.max(100, tempSpan.offsetWidth + 40);
//        input.style.width = newWidth + 'px';
//        document.body.removeChild(tempSpan);
//    }

//    // Inisialisasi awal
//    document.querySelectorAll(`${tableSelector} .input-group.dynamic-input input`).forEach(input => {
//        resizeInput(input);
//        input.addEventListener('input', function () {
//            resizeInput(this);
//            if (this.value.trim() === '') {
//                this.style.width = '100px';
//            }
//        });
//    });

//    // Daftarkan ulang setelah DataTable redraw
//    $(tableSelector).on('draw.dt', function () {
//        document.querySelectorAll(`${tableSelector} .input-group.dynamic-input input`).forEach(input => {
//            resizeInput(input);
//            input.addEventListener('input', function () {
//                resizeInput(this);
//                if (this.value.trim() === '') {
//                    this.style.width = '100px';
//                }
//            });
//        });
//    });
//}

function redirectButton(param) {
    // Get the current page URL (where we're clicking FROM)
    const currentPageUrl = window.location.href;
    
    // Get the destination URL (where we're going TO)
    const destinationUrl = base_path + `/ItemProductionRegistration/Detail?id=${encodeURIComponent(param)}`;
    
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
    window.location.href = base_path + `/ItemProductionRegistration/Detail`;
});



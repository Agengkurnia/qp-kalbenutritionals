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
    initializeDataTableItemSpecPMIndex();
});


//=======================
// HANDLER
//=======================

$("#btnNew").on('click', function () {
    window.location.href = base_path + `/ItemSpecPM/Detail`;
});

function redirectButton(param) {
    // Get the current page URL (where we're clicking FROM)
    const currentPageUrl = window.location.href;
    
    // Get the destination URL (where we're going TO)
    const destinationUrl = base_path + `/ItemSpecPM/Detail?id=${encodeURIComponent(param)}`;
    
    // Set localStorage state before navigation
    localStorage.setItem('prevurlMenu', currentPageUrl);
    localStorage.setItem('urlMenu', destinationUrl);
    
    // Navigate to the detail page
    return window.location.href = destinationUrl;
}
//=======================
// FUNCTION
//=======================

function initializeDataTableItemSpecPMIndex() {
    $('#itemSpecPMTable').DataTable({
        processing: true,
        serverSide: true,
        order: [[1, 'desc']],
        scrollX: true,
        scrollCollapse: true,
        search: {
            "caseInsensitive": true // Default-nya true
        },
        ajax: {
            url: "ItemSpecPM/GetData",
            type: 'POST',
            dataType: 'json'
        },
        columns: [
            {
                data: 'txtDocItemSpecPmnumber', name: 'TxtDocItemSpecPmnumber',
                render: function (data, type, row, meta) {
                    return '<a href="#" onclick="redirectButton(\'' + row.txtItemSpecPmId + '\'); return false;">' + data + '</a>';
                }
},
            { data: 'dtmCreatedDate', name: 'DtmCreatedDate' },
            { data: 'txtDocStatus', name: 'TxtDocStatus' },
            { data: 'txtItemCode', name: 'TxtItemCode' },
            { data: 'txtSpecPmno', name: 'TxtSpecPmno' },
            { data: 'intItemSpecPmversion', name: 'IntItemSpecPmversion' },
            { data: 'txtSpecPmdesc', name: 'TxtSpecPmdesc' },
            { data: 'txtCreatedBy', name: 'TxtCreatedBy' },
            {
                data: null,
                name: 'NextApprover',
                defaultContent: ''
            },

            //{
            //    data: null,
            //    render: function (data, type, row) {
            //        return `<a href="/ItemSpecPM/Detail?id=${row.txtIdParameter}" class="btn btn-sm btn-warning"> <i class="fas fa-edit me-1"></i> Edit </a>`;
            //    },
            //    orderable: false,
            //    searchable: false
            //}
        ],
        columnDefs: [
            { targets: '_all', className: 'text-center' }
        ]
    });
}
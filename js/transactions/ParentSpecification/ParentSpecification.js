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
    initializeDataTableParentSpecificationIndex();
});


//=======================
// HANDLER
//=======================

$("#btnNew").on('click', function () {
    window.location.href = base_path + `/ParentSpecification/Detail`;
});
function redirectButton(param) {
    // Get the current page URL (where we're clicking FROM)
    const currentPageUrl = window.location.href;
    
    // Get the destination URL (where we're going TO)
    const destinationUrl = base_path + `/ParentSpecification/Detail?id=${encodeURIComponent(param)}`;
    
    // Set localStorage state before navigation
    localStorage.setItem('prevurlMenu', currentPageUrl);
    localStorage.setItem('urlMenu', destinationUrl);
    
    // Navigate to the detail page
    return window.location.href = destinationUrl;
}

//=======================
// FUNCTION
//=======================

function initializeDataTableParentSpecificationIndex() {
    $('#parentSpecificationIndexTable').DataTable({
        processing: true,
        serverSide: true,
        order: [[1, 'desc']],
        scrollX: true,
        scrollCollapse: true,
        ajax: {
            url: "ParentSpecification/GetDataIndex",
            type: 'POST',
            dataType: 'json'
        },
        columns: [
            {
                data: 'txtDocumentNumber', name: 'TxtDocumentNumber',
                render: function (data, type, row, meta) {
                    return '<a href="#" onclick="redirectButton(\'' + row.txtParentSpecificationId + '\'); return false;">' + data + '</a>';
                }
            },
            { data: 'dtmInsertedDate', name: 'DtmInsertedDate' },
            { data: 'txtDocumentStatus', name: 'TxtDocumentStatus' },
            { data: 'txtParentSpecificationCode', name: 'TxtParentSpecificationCode' },
            { data: 'intVersion', name: 'IntVersion' },
            { data: 'txtDescription', name: 'TxtDescription' },
            { data: 'txtPmEvaluationNumber', name: 'TxtPmEvaluationNumber' },
            { data: 'txtInsertedBy', name: 'TxtInsertedBy' },
            {
                data: null,
                name: 'NextApprover',
                defaultContent: ''
            },

            //{
            //    data: null,
            //    render: function (data, type, row) {
            //        return `<a href="/ParentSpecification/Detail?id=${row.txtIdParameter}" class="btn btn-sm btn-warning"> <i class="fas fa-edit me-1"></i> Edit </a>`;
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
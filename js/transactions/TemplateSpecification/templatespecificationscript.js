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
    window.location.href = base_path + `/ParentSpecification/Detail`;
});

//=======================
// FUNCTION
//=======================

function initializeDataTableItemSpecPMIndex() {
    $('#templateSpecTable').DataTable({
        processing: true,
        serverSide: true,
        order: [[1, 'desc']],
        scrollX: true,
        scrollCollapse: true,
        search: {
            "caseInsensitive": true // Default-nya true
        },
        ajax: {
            url: "TemplateSpecification/GetData",
            type: 'POST',
            dataType: 'json'
        },
        columns: [
            { data: 'txtDocTemplateSpecificationCode', name: 'TxtDocTemplateSpecificationCode' },
            { data: 'dtmCreatedDate', name: 'DtmCreatedDate' },
            { data: 'bitActive', name: 'bitActive' },
            { data: 'txtPmsubCategoryDesc', name: 'TxtPMSubCategoryDesc' },
            { data: 'txtCreatedBy', name: 'TxtCreatedBy' },

            {
                data: null,
                render: function (data, type, row) {
                    return `<a href="/TemplateSpecification/Detail?id=${row.id}" class="btn btn-sm btn-warning"> <i class="fas fa-edit me-1"></i> Edit </a>`;
                },
                orderable: false,
                searchable: false
            }
        ],
        columnDefs: [
            { targets: '_all', className: 'text-center' }
        ]
    });
}
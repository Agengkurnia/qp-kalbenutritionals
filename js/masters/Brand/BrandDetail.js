"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    debugger;
    if (viewBagMsg !== "") {
        showSwalAlert(viewBagMsg);
    }
    initDataTableDetail();
});

//=======================
// FUNCTION
//=======================
function showSwalAlert(txtMsg) {
    debugger;
    var txtUrl = `${base_path}/Master/Brand/Index`;
    clsGlobal.swalSuccessSaveOrSubmit(txtMsg, txtUrl);
}

function validateInput(event) {
    const allowedValues = /^[a-zA-Z_0-9]$/; // Regular expression to match letters (a-z, A-Z) and numbers 0-1

    const inputValue = event.key;

    if (!allowedValues.test(inputValue)) {
        event.preventDefault(); // Prevent the input if it doesn't match the pattern
    }
}

//=======================
// HANDLER
//=======================
$("#TxtCode").keypress((e) => {
    validateInput(e);
});

$("#TxtVariable").keypress((e) => {
    validateInput(e);
});

function initDataTableDetail() {
    $('#subBrandTable').DataTable({
        processing: true,
        serverSide: false,
        ajax: {
            url: "/Master/SubBrand/GetSubBrandListByBrand?Brand=" + $('#OldBrandName').val(),
            type: "GET",
            datatype: "json"
        },
        columns: [
            { data: "txtSubBrandCode", title: "SUB BRAND CODE" },
            { data: "txtSubBrandName", title: "SUB BRAND NAME" },
            { data: "txtSubBrandDesc", title: "BRAND NAME" },
            { data: "txtProductCategory", title: "PRODUCT CATEGORY" },
            {
                data: "bitActive",
                title: "ACTIVE",
                render: function (data) {
                    return data ? '<span class="badge bg-success">Active</span>' :
                        '<span class="badge bg-danger">Inactive</span>';
                }
            }
        ],
        language: { emptyTable: "No data available in table" }
    });
}
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
   
    //document.querySelector(".btn-search").addEventListener("click", (e) => {

    //    e.preventDefault();

    //    p_MasterParameter();
    //});

    //$('.btn-search').unbind('click', (e) => {
    //    e.preventDefault();

    //    p_MasterParameter();
    //});

    $('.btn-search').on('click', function (e) {
        e.preventDefault();

        p_MasterParameter();
    });


    p_InitForm();
});

//=======================
// FUNCTION
//=======================
function p_InitForm() {
    p_MasterParameter();
}

function p_MasterParameter() {
    oTable = $("#dataTableParameter").DataTable({
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
            url: base_path + '/Master/Parameter/GetDataTable',
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
                    Search1: $("#CodeSearch").val(),
                    Search2: $("#DescSearch").val(),
                    Search3: $("#VarSearch").val(),
                    Search4: $("#CreatedSearch").val(),
                    Search5: "",
                    Search6: "",
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
        searching: false,
        columns: [
            {
                data: 'txtCode',
                name: 'TxtCode',
                render: function (data, type, row, meta) {
                    let userGuid = row.txtIdParameter;
                    return `<a href="javascript:void(0)" onclick="redirectButton('${encodeURIComponent(userGuid)}')"> ${data}</a>`;
                }
            },
            {
                data: 'txtDescription',
                name: 'TxtDescription',
            },
            {
                data: 'txtVariable',
                name: 'TxtVariable',
            },
            {
                data: 'txtCreatedBy',
                name: 'TxtCreatedBy',
            },
            {
                data: 'bitActive',
                name: 'BitActive',
                render: function (data, type, row, meta) {
                    return (data == true) ? "True" : "False";
                }
            },
        ],
    });
}

function redirectButton(param) {
    return window.location.href = base_path + `/Master/Parameter/Edit?id=${encodeURIComponent(param)}`;
}

//=======================
// HANDLER
//=======================

$("#btnNew").on('click', function () {
    window.location.href = base_path + `/Master/Parameter/Create`;
});

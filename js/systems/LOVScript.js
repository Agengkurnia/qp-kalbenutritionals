"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var Mdl = stringempty;
var Fnc = stringempty;
var Query = stringempty;
var Url = stringempty;
var isMultiSelect;

var clsGlobal = new clsGlobalClass();

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    p_initForm();
    p_validatePage();
    p_showPrevData();
    p_ReinitialComponent();
    
});

//=======================
// FUNCTION
//=======================
function p_initForm() {
    Mdl = $.getParameter("Mdl");
    Fnc = $.getParameter("Fnc");
    debugger;
    Query = $.getParameter("Query");
    Url = decodeURIComponent($.getParameter("Url"));
    isMultiSelect = $.getParameter("IsMultiSelect") === 'true'; 
    $("#txtFunction").val(Fnc);
    $("#IsMultiSelect").val(isMultiSelect);
}

function p_validatePage() {
    debugger;
    if (Url == base_KnGlobalUrl) {
        p_showPrevDataKnGlobal();
    }
    else {
        p_showPrevData();
    }
}

function p_showPrevData() {

    $.fn.dataTable.ext.errMode = 'none';
    debugger;

    if (Mdl != undefined && Fnc != undefined) {
        
        if (isMultiSelect) {
            $('#sectionMultiSelect').show(); 
        } else {
            $('#sectionMultiSelect').hide(); 
        }

        // Format datatable
        var oTable = $('#tbLOV').on('error.dt', function (e, settings, techNote, message) {
            //clsGlobal.swalError(message);
        }).DataTable({
            "bPaginate": true,
            "bSort": false,
            scrollX: "100%",
            scrollY: "400px",
            "iDisplayLength": 10,
            "serverSide": true,
            "type": "POST",
            "search": {
                "caseInsensitive": true // Default-nya true
            },
            "ajax": {
                "url": parent.base_path + "/Systems/LOV/GetDataSourceJSONPaging",
                "method": "POST",
                "datatype": "json",
                dataSrc: function (retDat) {
                    debugger;
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
                error: function (xhr, status, error) {
                    if (xhr.responseText.includes("!DOCTYPE html")) {
                        clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                    }
                    else {
                        clsGlobal.swalError(xhr.responseText);
                    }
                },
                "data": {
                    data: GetLOVParameter(),
                    __RequestVerificationToken: $('#frmLOV input[name=__RequestVerificationToken]').val()
                }
            },
            aoColumnDefs: [
                {
                    aTargets: [0],
                    className: 'checkbox-column',
                    orderable: false,
                    mRender: function (data, type, full, meta) {
                        if (isMultiSelect) {
                            return `<input type="checkbox" class="row-checkbox" data-row-id="row-${meta.row}">`;
                        } else {
                            return '<input type="button" class="btn btn-primary btnSelect" value="Select" onclick="btnSelect_Click(\'' +
                                clsGlobal.parseToString(full.txtColumn1).replace('\'', '') + '|' + clsGlobal.parseToString(full.txtColumn2).replace('\'', '') + '|' + clsGlobal.parseToString(full.txtColumn3).replace('\'', '') + '|' + clsGlobal.parseToString(full.txtColumn4).replace('\'', '') + '|' + clsGlobal.parseToString(full.txtColumn5).replace('\'', '') + '|' + clsGlobal.parseToString(full.txtColumn6).replace('\'', '') + '|' + clsGlobal.parseToString(full.txtColumn7).replace('\'', '') + '|' + clsGlobal.parseToString(full.txtColumn8).replace('\'', '') + '|' + clsGlobal.parseToString(full.txtColumn9).replace('\'', '') + '|' + clsGlobal.parseToString(full.txtColumn10).replace('\'', '') + '|' + clsGlobal.parseToString(full.txtColumn11).replace('\'', '') + '|' + clsGlobal.parseToString(full.txtColumn12).replace('\'', '') + '|' + clsGlobal.parseToString(full.txtColumn13).replace('\'', '') + '|' + clsGlobal.parseToString(full.txtColumn14).replace('\'', '') + '|' + clsGlobal.parseToString(full.txtColumn15).replace('\'', '') + '|' + clsGlobal.parseToString(full.txtColumn16).replace('\'', '') + '|' + clsGlobal.parseToString(full.txtColumn17).replace('\'', '') + '\')">';
                        }
                    },
                    visible: true 
                },
                {
                    aTargets: [1],
                    mRender: function (data, type, full, meta) {
                        $("#lblColumnName1").html(full.txtColumnName1);
                        return '<div id="' + full.txtColumnName1 + '-' + meta.row + '"> ' + full.txtColumn1 + ' </div>';
                    }
                },
                {
                    aTargets: [2],
                    mRender: function (data, type, full, meta) {
                        $("#lblColumnName2").html(full.txtColumnName2);
                        return '<div id="' + full.txtColumnName2 + '-' + meta.row + '">  ' + full.txtColumn2 + '  </div>';
                    }
                },
                {
                    aTargets: [3],
                    mRender: function (data, type, full, meta) {
                        $("#lblColumnName3").html(full.txtColumnName3);
                        return '<div id="' + full.txtColumnName3 + '-' + meta.row + '">  ' + full.txtColumn3 + '  </div>';
                    }
                },
                {
                    aTargets: [4],
                    mRender: function (data, type, full, meta) {
                        $("#lblColumnName4").html(full.txtColumnName4);
                        return '<div id="' + full.txtColumnName4 + '-' + meta.row + '">  ' + full.txtColumn4 + '  </div>';
                    }
                },
                {
                    aTargets: [5],
                    mRender: function (data, type, full, meta) {
                        $("#lblColumnName5").html(full.txtColumnName5);
                        return '<div id="' + full.txtColumnName5 + '-' + meta.row + '">  ' + full.txtColumn5 + '  </div>';
                    }
                },
                {
                    aTargets: [6],
                    mRender: function (data, type, full, meta) {
                        $("#lblColumnName6").html(full.txtColumnName6);
                        return '<div id="' + full.txtColumnName6 + '-' + meta.row + '">  ' + full.txtColumn6 + '  </div>';
                    }
                },
                {
                    aTargets: [7],
                    mRender: function (data, type, full, meta) {
                        $("#lblColumnName7").html(full.txtColumnName7);
                        return '<div id="' + full.txtColumnName7 + '-' + meta.row + '">  ' + full.txtColumn7 + '  </div>';
                    }
                },
                {
                    aTargets: [8],
                    mRender: function (data, type, full, meta) {
                        $("#lblColumnName8").html(full.txtColumnName8);
                        return '<div id="' + full.txtColumnName8 + '-' + meta.row + '">  ' + full.txtColumn8 + '  </div>';
                    }
                },
                {
                    aTargets: [9],
                    mRender: function (data, type, full, meta) {
                        $("#lblColumnName9").html(full.txtColumnName9);
                        return '<div id="' + full.txtColumnName9 + '-' + meta.row + '">  ' + full.txtColumn9 + '  </div>';
                    }
                },
                {
                    aTargets: [10],
                    mRender: function (data, type, full, meta) {
                        $("#lblColumnName10").html(full.txtColumnName10);
                        return '<div id="' + full.txtColumnName10 + '-' + meta.row + '">  ' + full.txtColumn10 + '  </div>';
                    }
                },
                {
                    aTargets: [11],
                    mRender: function (data, type, full, meta) {
                        $("#lblColumnName11").html(full.txtColumnName11);
                        return '<div id="' + full.txtColumnName11 + '-' + meta.row + '">  ' + full.txtColumn11 + '  </div>';
                    }
                },
                {
                    aTargets: [12],
                    mRender: function (data, type, full, meta) {
                        $("#lblColumnName12").html(full.txtColumnName11);
                        return '<div id="' + full.txtColumnName12 + '-' + meta.row + '">  ' + full.txtColumn12 + '  </div>';
                    }
                },
                {
                    aTargets: [13],
                    mRender: function (data, type, full, meta) {
                        $("#lblColumnName13").html(full.txtColumnName13);
                        return '<div id="' + full.txtColumnName13 + '-' + meta.row + '">  ' + full.txtColumn13 + '  </div>';
                    }
                },
                {
                    aTargets: [14],
                    mRender: function (data, type, full, meta) {
                        $("#lblColumnName14").html(full.txtColumnName14);
                        return '<div id="' + full.txtColumnName14 + '-' + meta.row + '">  ' + full.txtColumn14 + '  </div>';
                    }
                },
                {
                    aTargets: [15],
                    mRender: function (data, type, full, meta) {
                        $("#lblColumnName15").html(full.txtColumnName15);
                        return '<div id="' + full.txtColumnName15 + '-' + meta.row + '">  ' + full.txtColumn15 + '  </div>';
                    }
                },
                {
                    aTargets: [16],
                    mRender: function (data, type, full, meta) {
                        $("#lblColumnName16").html(full.txtColumnName16);
                        return '<div id="' + full.txtColumnName16 + '-' + meta.row + '">  ' + full.txtColumn16 + '  </div>';
                    }
                }
            ],
            "initComplete": function (settings, json) {
                if (json.data.length > 0) {
                    for (let i = 1; i <= 16; i++) {
                        const txtCol = 'txtColumn' + i;
                        const bolCol = 'bolColumn' + i;

                        let showColumn = false;

                        for (let row of json.data) {
                            if (row[txtCol] !== "" && row[bolCol] !== false) {
                                showColumn = true;
                                break;
                            }
                        }

                        oTable.column(i).visible(showColumn);
                    }


                    //if (json.data[0].txtColumn1 === "") {
                    //    oTable.column(1).visible(false);
                    //}
                    //else {
                    //    if (json.data[0].bolColumn1 === false) {
                    //        oTable.column(1).visible(false);
                    //    }
                    //}
                    //if (json.data[0].txtColumn2 === "") {
                    //    oTable.column(2).visible(false);
                    //}
                    //else {
                    //    if (json.data[0].bolColumn2 === false) {
                    //        oTable.column(2).visible(false);
                    //    }
                    //}
                    //if (json.data[0].txtColumn3 === "") {
                    //    oTable.column(3).visible(false);
                    //}
                    //else {
                    //    if (json.data[0].bolColumn3 === false) {
                    //        oTable.column(3).visible(false);
                    //    }
                    //}
                    //if (json.data[0].txtColumn4 === "") {
                    //    oTable.column(4).visible(false);
                    //}
                    //else {
                    //    if (json.data[0].bolColumn4 === false) {
                    //        oTable.column(4).visible(false);
                    //    }
                    //}
                    //if (json.data[0].txtColumn5 === "") {
                    //    oTable.column(5).visible(false);
                    //}
                    //else {
                    //    if (json.data[0].bolColumn5 === false) {
                    //        oTable.column(5).visible(false);
                    //    }
                    //}
                    //if (json.data[0].txtColumn6 === "") {
                    //    oTable.column(6).visible(false);
                    //}
                    //else {
                    //    if (json.data[0].bolColumn6 === false) {
                    //        oTable.column(6).visible(false);
                    //    }
                    //}
                    //if (json.data[0].txtColumn7 === "") {
                    //    oTable.column(7).visible(false);
                    //}
                    //else {
                    //    if (json.data[0].bolColumn7 === false) {
                    //        oTable.column(7).visible(false);
                    //    }
                    //}
                    //if (json.data[0].txtColumn8 === "") {
                    //    oTable.column(8).visible(false);
                    //}
                    //else {
                    //    if (json.data[0].bolColumn8 === false) {
                    //        oTable.column(8).visible(false);
                    //    }
                    //}
                    //if (json.data[0].txtColumn9 === "") {
                    //    oTable.column(9).visible(false);
                    //}
                    //else {
                    //    if (json.data[0].bolColumn9 === false) {
                    //        oTable.column(9).visible(false);
                    //    }
                    //}
                    //if (json.data[0].txtColumn10 === "") {
                    //    oTable.column(10).visible(false);
                    //}
                    //else {
                    //    if (json.data[0].bolColumn10 === false) {
                    //        oTable.column(10).visible(false);
                    //    }
                    //}
                    //if (json.data[0].txtColumn11 === "") {
                    //    oTable.column(11).visible(false);
                    //}
                    //else {
                    //    if (json.data[0].bolColumn11 === false) {
                    //        oTable.column(11).visible(false);
                    //    }
                    //}
                    //if (json.data[0].txtColumn12 === "") {
                    //    oTable.column(12).visible(false);
                    //}
                    //else {
                    //    if (json.data[0].bolColumn12 === false) {
                    //        oTable.column(12).visible(false);
                    //    }
                    //}
                    //if (json.data[0].txtColumn13 === "") {
                    //    oTable.column(13).visible(false);
                    //}
                    //else {
                    //    if (json.data[0].bolColumn13 === false) {
                    //        oTable.column(13).visible(false);
                    //    }
                    //}
                    //if (json.data[0].txtColumn14 === "") {
                    //    oTable.column(14).visible(false);
                    //}
                    //else {
                    //    if (json.data[0].bolColumn14 === false) {
                    //        oTable.column(14).visible(false);
                    //    }
                    //}
                    //if (json.data[0].txtColumn15 === "") {
                    //    oTable.column(15).visible(false);
                    //}
                    //else {
                    //    if (json.data[0].bolColumn15 === false) {
                    //        oTable.column(15).visible(false);
                    //    }
                    //}
                    //if (json.data[0].txtColumn16 === "") {
                    //    oTable.column(16).visible(false);
                    //}
                    //else {
                    //    if (json.data[0].bolColumn16 === false) {
                    //        oTable.column(16).visible(false);
                    //    }
                    //}

                }
            }
        });

        $("#tbLOV").css("width", "100%");

        $('#tbLOV_filter input').unbind();
        $('#tbLOV_filter input').bind('keyup', function (e) {
            if (e.keyCode == 13) {
                oTable.search(this.value).draw();
            }
        });

        $('#tbLOV_filter input').attr('id', 'searchLov');
        $('#tbLOV_length select').attr('id', 'selectLov');

        //$('#tbLOV_filter input').attr('id', 'searchLov');
        //$('#tbLOV_length select').attr('id', 'selectLov');
        //$('#tbLOV_filter input').bind('blur', function (e) {                   
        //    oTable.search(this.value).draw();
        // }); 
    }
}

function toggleSelectAll(source) {
    debugger;
    if(!isMultiSelect) {
        return;
    }

    var checkboxes = document.querySelectorAll('.row-checkbox');
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = source.checked;
    }
}
function btnSelectAll_Click() {
    debugger;
    if (!isMultiSelect) { return; }
    $('#selectAll').click();
}

function btnApply_Click() {
    debugger;
    if (!isMultiSelect) { return; }

    var selectedValues = [];
    var table = $('#tbLOV').DataTable();

    $('.row-checkbox:checked').each(function () {
        var row = $(this).closest('tr');
        var rowData = table.row(row).data();

        if (rowData) {
            var value = clsGlobal.parseToString(rowData.txtColumn1).replace('\'', '') + '|' +
                clsGlobal.parseToString(rowData.txtColumn2).replace('\'', '') + '|' +
                clsGlobal.parseToString(rowData.txtColumn3).replace('\'', '') + '|' +
                clsGlobal.parseToString(rowData.txtColumn4).replace('\'', '') + '|' +
                clsGlobal.parseToString(rowData.txtColumn5).replace('\'', '') + '|' +
                clsGlobal.parseToString(rowData.txtColumn6).replace('\'', '') + '|' +
                clsGlobal.parseToString(rowData.txtColumn7).replace('\'', '') + '|' +
                clsGlobal.parseToString(rowData.txtColumn8).replace('\'', '') + '|' +
                clsGlobal.parseToString(rowData.txtColumn9).replace('\'', '') + '|' +
                clsGlobal.parseToString(rowData.txtColumn10).replace('\'', '') + '|' +
                clsGlobal.parseToString(rowData.txtColumn11).replace('\'', '') + '|' +
                clsGlobal.parseToString(rowData.txtColumn12).replace('\'', '') + '|' +
                clsGlobal.parseToString(rowData.txtColumn13).replace('\'', '') + '|' +
                clsGlobal.parseToString(rowData.txtColumn14).replace('\'', '') + '|' +
                clsGlobal.parseToString(rowData.txtColumn15).replace('\'', '') + '|' +
                clsGlobal.parseToString(rowData.txtColumn16).replace('\'', '');
            selectedValues.push(value);
        }
    });

    if (selectedValues.length > 0) {
        // Panggil fungsi untuk olah data PME
        const txtPMEs = selectedValues.map(val => val.split('|')[0]); // ambil txtPME dari setiap string
        //getDataMultiPME(txtPMEs);

        window.parent.setChooseLOV($("#txtFunction").val() + "|" + selectedValues.join('|||'), txtPMEs);
        //window.parent.setChooseLOV("txtBarcodeNumber|" + selectedValues.join('|||'));
        
        clsGlobal.closeLOV();
    } else {
        clsGlobal.swalWarning("Please select at least one row.");
    }
}
function p_showPrevDataKnGlobal() {
    $.fn.dataTable.ext.errMode = 'none';

    if (Mdl != undefined && Fnc != undefined) {
        // Format datatable
        var oTable = $('#tbLOV').on('error.dt', function (e, settings, techNote, message) {
            //clsGlobal.swalError(message);
        }).DataTable({
            "bPaginate": true,
            "bSort": false,
            "iDisplayLength": 10,
            "processing": true,
            "serverSide": true,
            "type": "POST",
            "ajax": {
                "url": parent.base_KnGlobalUrl + "/Systems/LOV/GetDataSourceJSONPaging",
                "method": "POST",
                "datatype": "json",
                "data": {
                    data: GetLOVParameter(),
                    __RequestVerificationToken: $('#frmLOV input[name=__RequestVerificationToken]').val()
                }
                //"error": function (xhr, status, error) {
                //    console.log(xhr);
                //    console.log(status);
                //    console.log(error);
                //    clsGlobal.swalError(xhr.responseText);
                //}
            },
            aoColumnDefs: [
                {
                    aTargets: [0],
                    mRender: function (data, type, full) {
                        $("#lblPilih").html("Pilih");
                        //return '<input type="button" class="btnSelect" value="Pilih" onclick="btnSelect_Click(\'' + full.txtColumn1 + '\')" >';
                        //return '<input type="button" class="btnSelect" value="Pilih" onclick="btnSelect_Click(\'' + clsGlobal.parseToString(full.txtColumn1).replace('\'', '') + '|' + clsGlobal.parseToString(full.txtColumn2).replace('\'', '') + '|' + clsGlobal.parseToString(full.txtColumn3).replace('\'', '') + '|' + clsGlobal.parseToString(full.txtColumn4).replace('\'', '') + '|' + clsGlobal.parseToString(full.txtColumn5).replace('\'', '') + '|' + clsGlobal.parseToString(full.txtColumn6).replace('\'', '') + '|' + clsGlobal.parseToString(full.txtColumn7).replace('\'', '') + '|' + clsGlobal.parseToString(full.txtColumn8).replace('\'', '') + '\')" >';
                        return '<input type="button" class="btn btn-primary waves-effect waves-float waves-light btnSelect" value="Pilih" onclick="btnSelect_Click(\'' + clsGlobal.parseToString(full.txtColumn1).replace('\'', '') + '|' + clsGlobal.parseToString(full.txtColumn2).replace('\'', '') + '|' + clsGlobal.parseToString(full.txtColumn3).replace('\'', '') + '|' + clsGlobal.parseToString(full.txtColumn4).replace('\'', '') + '|' + clsGlobal.parseToString(full.txtColumn5).replace('\'', '') + '|' + clsGlobal.parseToString(full.txtColumn6).replace('\'', '') + '|' + clsGlobal.parseToString(full.txtColumn7).replace('\'', '') + '|' + clsGlobal.parseToString(full.txtColumn8).replace('\'', '') + '\')" >';
                    }
                },
                {
                    aTargets: [1],
                    mRender: function (data, type, full) {
                        $("#lblColumnName1").html(full.txtColumnName1);
                        return '<div > ' + full.txtColumn1 + ' </div>';
                    }
                },
                {
                    aTargets: [2],
                    mRender: function (data, type, full) {
                        $("#lblColumnName2").html(full.txtColumnName2);
                        return '<div >  ' + full.txtColumn2 + '  </div>';
                    }
                },
                {
                    aTargets: [3],
                    mRender: function (data, type, full) {
                        $("#lblColumnName3").html(full.txtColumnName3);
                        return '<div >  ' + full.txtColumn3 + '  </div>';
                    }
                },
                {
                    aTargets: [4],
                    mRender: function (data, type, full) {
                        $("#lblColumnName4").html(full.txtColumnName4);
                        return '<div >  ' + full.txtColumn4 + '  </div>';
                    }
                },
                {
                    aTargets: [5],
                    mRender: function (data, type, full) {
                        $("#lblColumnName5").html(full.txtColumnName5);
                        return '<div >  ' + full.txtColumn5 + '  </div>';
                    }
                },
                {
                    aTargets: [6],
                    mRender: function (data, type, full) {
                        $("#lblColumnName6").html(full.txtColumnName6);
                        return '<div >  ' + full.txtColumn6 + '  </div>';
                    }
                },
                {
                    aTargets: [7],
                    mRender: function (data, type, full) {
                        $("#lblColumnName7").html(full.txtColumnName7);
                        return '<div >  ' + full.txtColumn7 + '  </div>';
                    }
                },
                {
                    aTargets: [8],
                    mRender: function (data, type, full) {
                        $("#lblColumnName8").html(full.txtColumnName8);
                        return '<div >  ' + full.txtColumn8 + '  </div>';
                    }
                },
                {
                    aTargets: [9],
                    mRender: function (data, type, full) {
                        $("#lblColumnName9").html(full.txtColumnName9);
                        return '<div >  ' + full.txtColumn9 + '  </div>';
                    }
                },
                {
                    aTargets: [10],
                    mRender: function (data, type, full) {
                        $("#lblColumnName10").html(full.txtColumnName10);
                        return '<div >  ' + full.txtColumn10 + '  </div>';
                    }
                },
                {
                    aTargets: [11],
                    mRender: function (data, type, full) {
                        $("#lblColumnName11").html(full.txtColumnName11);
                        return '<div >  ' + full.txtColumn11 + '  </div>';
                    }
                }
            ],
            "initComplete": function (settings, json) {
                debugger;
                if (json.data.length > 0) {
                    if (json.data[0].txtColumn1 === "") {
                        oTable.column(1).visible(false);
                    }
                    else {
                        if (json.data[0].bolColumn1 === false) {
                            oTable.column(1).visible(false);
                        }
                    }
                    if (json.data[0].txtColumn2 === "") {
                        oTable.column(2).visible(false);
                    }
                    else {
                        if (json.data[0].bolColumn2 === false) {
                            oTable.column(2).visible(false);
                        }
                    }
                    if (json.data[0].txtColumn3 === "") {
                        oTable.column(3).visible(false);
                    }
                    else {
                        if (json.data[0].bolColumn3 === false) {
                            oTable.column(3).visible(false);
                        }
                    }
                    if (json.data[0].txtColumn4 === "") {
                        oTable.column(4).visible(false);
                    }
                    else {
                        if (json.data[0].bolColumn4 === false) {
                            oTable.column(4).visible(false);
                        }
                    }
                    if (json.data[0].txtColumn5 === "") {
                        oTable.column(5).visible(false);
                    }
                    else {
                        if (json.data[0].bolColumn5 === false) {
                            oTable.column(5).visible(false);
                        }
                    }
                    if (json.data[0].txtColumn6 === "") {
                        oTable.column(6).visible(false);
                    }
                    else {
                        if (json.data[0].bolColumn6 === false) {
                            oTable.column(6).visible(false);
                        }
                    }
                    if (json.data[0].txtColumn7 === "") {
                        oTable.column(7).visible(false);
                    }
                    else {
                        if (json.data[0].bolColumn7 === false) {
                            oTable.column(7).visible(false);
                        }
                    }
                    if (json.data[0].txtColumn8 === "") {
                        oTable.column(8).visible(false);
                    }
                    else {
                        if (json.data[0].bolColumn8 === false) {
                            oTable.column(8).visible(false);
                        }
                    }
                    if (json.data[0].txtColumn9 === "") {
                        oTable.column(9).visible(false);
                    }
                    else {
                        if (json.data[0].bolColumn9 === false) {
                            oTable.column(9).visible(false);
                        }
                    }
                    if (json.data[0].txtColumn10 === "") {
                        oTable.column(10).visible(false);
                    }
                    else {
                        if (json.data[0].bolColumn10 === false) {
                            oTable.column(10).visible(false);
                        }
                    }
                    if (json.data[0].txtColumn11 === "") {
                        oTable.column(11).visible(false);
                    }
                    else {
                        if (json.data[0].bolColumn11 === false) {
                            oTable.column(11).visible(false);
                        }
                    }
                }
            }
        });

        $("#tbLOV").css("width", "100%");

        $('#tbLOV_filter input').unbind();
        $('#tbLOV_filter input').bind('keyup', function (e) {
            if (e.keyCode == 13) {
                oTable.search(this.value).draw();
            }
        });

        //$('#tbLOV_filter input').bind('blur', function (e) {                   
        //    oTable.search(this.value).draw();
        // }); 
    }
}

function ChooseLOV(intCounter, txtValue, txtDescription) {
    //alert("choose " + intCounter + " " + txtValue + " " + txtDescription);
}

function GetLOVParameter() {
    var htmlJSON = $("#txtHiddenObject").val();
    var jsonObj = [];
    if (htmlJSON == '') { htmlJSON = "[{}]"; }
    jsonObj = JSON.parse(htmlJSON);
    jsonObj[0].Mdl = Mdl;
    jsonObj[0].Fnc = Fnc;
    jsonObj[0].Query = Query;

    return JSON.stringify(jsonObj);
}

//=======================
// HANDLER
//=======================
function p_ReinitialComponent() {
}

function btnSelect_Click(val) {
    //var Swal = window.parent.setSwallinstance();
    //Swal.close();
    debugger;
    window.parent.setChooseLOV($("#txtFunction").val() + "|" + val);
}

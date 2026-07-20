"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false;
var oTable;


//=======================
// Confirmation
//======================= 

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    p_InitForm();
    p_validatePage();
    //p_showPrevData(); 
    p_GenerateDateTimePicker();
});


function p_GenerateDateTimePicker() {
    
    $('.datetimepicker').datepicker({
        autoclose: true,
    });

}

//=======================
// FUNCTION
//=======================
function p_InitForm() {
    p_initiateData();
    //p_showPrevData();
    p_InitiateDetail();
}

function p_validatePage() {

}

function p_showPrevData() {

}

function p_showBlank() {
    p_initiateData();
}

function setChooseLOV(txtValue) {
    var arr = txtValue.split('|');
    switch (arr[0]) {
        case "txtID": $("#txtID").val(arr[1]);
            p_txtID_TextChanged();
            break;

    }
    clsGlobal.closeLOV();
}

function p_DataToUI(objData) {
    $("#txtID").val(clsGlobal.parseToInteger(objData.intParameter_HeaderID));
    $("#txtCode").val(clsGlobal.parseToString(objData.txtCode));
    $("#txtDesc").val(clsGlobal.parseToString(objData.txtDesc));
    $("#bitActive").prop('checked', clsGlobal.parseToBoolean(objData.bitActive));

    p_DataToUIDetail(objData.mParameter_Detail);
    p_SetHiddenObject(objData);

    //if ($("#txtID").val() == "" || $("#txtID").val() == "0") {
    //    $("#btnDelete").hide();
    //} else {
    //    $("#btnDelete").show();
    //}
}

function p_SetHiddenObject(objDat) {
    $("#txtHiddenObject").val(JSON.stringify(objDat));
}

function p_GetHiddenObject() {
    return JSON.parse($("#txtHiddenObject").val());
}

function p_DataToUIDetail(mParameter_Detail) {
    
    oTable.clear();
    for (var i = 0; i < mParameter_Detail.length; i++) {
        mParameter_Detail[i].intIndex = i;
        oTable.row.add(mParameter_Detail[i]);
    }
    oTable.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.mParameter_Detail = mParameter_Detail;
    p_SetHiddenObject(objDat);

    ConvertUpperCase();
}

function p_initiateData() {
    $.ajax({
        type: "POST",
        url: base_path + "/System/Parameter/InitiateData",
        data: {
            txtGUID: $("#txtGUID").val(),
            __RequestVerificationToken: $('#frmParameter input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUI(retDat.objData);
                } else {
                    p_showBlank();
                }
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
            $("#txtGUID").val(retDat.txtGUID);
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });

}

function p_UIToData() {
    var jsonData;
    jsonData = p_GetHiddenObject();
    jsonData.intParameter_HeaderID = clsGlobal.parseToInteger($("#txtID").val());
    jsonData.txtCode = $("#txtCode").val().toString();
    jsonData.txtDesc = $("#txtDesc").val().toString();
    jsonData.bitActive = $("#bitActive").is(":checked");

    p_SetHiddenObject(jsonData);
    return $("#txtHiddenObject").val();

}


function p_InitiateDetail() {
    // Format datatable  
    oTable = $('#dtDetail').DataTable({
        "bPaginate": true,
        "bSort": false,
        searching: false,
        "type": "POST",
        lengthMenu: [5, 10, 25, 50, 100],
        "iDisplayLength": 5,
        columns: [
            { title: 'NO', width: 5, className: "center", "targets": [0] },
            { title: 'CODE', width: 120, className: "text-left", "targets": [1] },
            { title: 'DESCRIPTION', width: 250, className: "text-left", "targets": [2] },
            { title: 'STATUS', width: 50, className: "text-center", "targets": [3] },
            { title: 'ACTION', width: 50, className: "text-center", "targets": [4] }
        ],
        aoColumnDefs: [
            {
                aTargets: [0],
                mRender: function (data, type, full) {
                    return '<div> ' + (full.intIndex + 1) + ' </div>';
                }
            },
            {
                aTargets: [1],
                mRender: function (data, type, full) {
                    return '<div > <input type="text" class="form-control text-uppercase" id="txtDetailCode" class="txtDetailCode" onchange="p_txtDetailCode_Changed(this,' + full.intIndex + ')"  value="' + full.txtCode + '" >  </div>';
                }
            },
            {
                aTargets: [2],
                mRender: function (data, type, full) {
                    return '<div > <input type="text" class="form-control text-uppercase" id="txtDetailDesc" class="txtDetailDesc" onchange="p_txtDetailDesc_Changed(this,' + full.intIndex + ')"  value="' + full.txtDesc + '" >  </div>';

                }
            },
            {
                aTargets: [3],
                mRender: function (data, type, full) {
                    if (full.bitActive) {
                        return '<div > <input type="checkbox" id="chkDetailActive" class="chkDetailActive" onchange="p_chkDetailActive_Changed(this,' + full.intIndex + ')"  checked="' + full.bitActive + '" >  </div>';
                    } else {
                        return '<div > <input type="checkbox" id="chkDetailActive" class="chkDetailActive" onchange="p_chkDetailActive_Changed(this,' + full.intIndex + ')" >  </div>';
                    }

                }
            },
            {
                aTargets: [4],
                mRender: function (data, type, full) {
                    if (full.intParameter_DetailID == 0) {
                        return '<div style="padding:0;margin:0">' +
                            '     <a class="btn btn-danger btn-icon waves-effect waves-float waves-light button-group btnDetailDelete" id="btnDetailDelete-' + full.intIndex + '" onclick="p_btnDetailDelete_Click(this,' + full.intIndex + ')" value="Delete">' +
                            '         <i class="fa fa-trash"></i>' +
                            '     </a>' +
                            '</div>';
                    }
                    else {
                        return '';
                    }
                }
            }
        ]
    });

    $("#dtDetail").css("width", "100%");

}

function p_txtID_TextChanged() {
    $.ajax({
        type: "POST",
        url: "/System/Parameter/GetData",
        data: { txtID: $("#txtID").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmParameter input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_DataToUI(retDat.objData);
                } else {
                    p_showBlank();
                }
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
            $("#txtGUID").val(retDat.txtGUID);
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}


function p_saveData() {
    p_UIToData();
    $.ajax({
        type: "POST",
        url: base_path + "/System/Parameter/SaveData",
        data: {
            data: $("#txtHiddenObject").val(),
            txtGUID: $("#txtGUID").val(),
            __RequestVerificationToken: $('#frmParameter input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                p_DataToUI(retDat.objData);
                clsGlobal.swalSuccess(retDat.txtMessage);
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
            $("#txtGUID").val(retDat.txtGUID);
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}

function p_deleteData() {
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/System/Parameter/DeleteData",
        data: {
            data: $("#txtHiddenObject").val(),
            txtGUID: $("#txtGUID").val(),
            __RequestVerificationToken: $('#frmParameter input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                p_DataToUI(retDat.objData);
                clsGlobal.swalSuccess(retDat.txtMessage);
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
            $("#txtGUID").val(retDat.txtGUID);
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}


function p_AddRow() {
    
    $.ajax({
        type: "POST",
        url: base_path + "/System/Parameter/AddRow",
        data: {
            data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(),
            __RequestVerificationToken: $('#frmParameter input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIDetail(retDat.objData.mParameter_Detail);
                    oTable.page('last').draw(false);
                }
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
            $("#txtGUID").val(retDat.txtGUID);
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}

function p_txtDetailCode_Changed(objCaller, intIndex) {
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (var i = 0; i < objData.mParameter_Detail.length; i++) {
        // Cari Index-nya.
        if (objData.mParameter_Detail[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.mParameter_Detail[i].txtCode = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtDetailDesc_Changed(objCaller, intIndex) {
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (var i = 0; i < objData.mParameter_Detail.length; i++) {
        // Cari Index-nya.
        if (objData.mParameter_Detail[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.mParameter_Detail[i].txtDesc = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_chkDetailActive_Changed(objCaller, intIndex) {
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (var i = 0; i < objData.mParameter_Detail.length; i++) {
        // Cari Index-nya.
        if (objData.mParameter_Detail[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.mParameter_Detail[i].bitActive = objCaller.checked;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_btnDetailDelete_Click(objCaller, intIndex) {
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (var i = 0; i < objData.mParameter_Detail.length; i++) {
        // Cari Index-nya.
        if (objData.mParameter_Detail[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.mParameter_Detail.splice(i, 1);

            //var row = oTable.row($(this).parents('tr'));
            //var rowNode = row.node();
            //row.remove().draw();
            oTable.row(i).remove().draw(false);
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberDetail();
}

function p_RefreshNumberDetail() {
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTable.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.mParameter_Detail[intRowIndex].intIndex = d.intIndex;

        d.txtCode = objDat.mParameter_Detail[intRowIndex].txtCode;
        d.txtDesc = objDat.mParameter_Detail[intRowIndex].txtDesc;
        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTable.draw(false);
    p_SetHiddenObject(objDat);
}


//=======================
// HANDLER
//=======================

$('#btnSave').bind('click', function () {
    try {
        clsGlobal.getConfirmation("Save this data?", function (result) {
            if (result == true) {
                p_saveData();
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.swalError(ex);
    }
});

$('#btnNew').bind('click', function () {
    try {
        p_showBlank();
    } catch (ex) {
        clsGlobal.swalError(ex);
    }
});


$('#btnFind').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_PARAMETER, "txtID");
    } catch (ex) {
        clsGlobal.swalError(ex);
    }
});


$('#btnDelete').bind('click', function () {
    try {
        clsGlobal.getConfirmation("Delete this data?", function (result) {
            if (result == true) {
                p_deleteData();
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.swalError(ex);
    }
});

$('#btnAddDetail').on('click', function () {
    p_AddRow();
});

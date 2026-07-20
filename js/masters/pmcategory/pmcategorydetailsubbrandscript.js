//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false;

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    //clsGlobal.showLoading();
    p_InitForm();
    p_validatePage();

});

//=======================
// FUNCTION
//=======================
function p_InitForm() {
    //$("#btnSave").hide();
    //$("#btnSubmit").hide();

    //p_initiateData();
    //new $.fn.dataTable.FixedColumns(tabel_Detail, { leftColumns: 4 });
    //new $.fn.dataTable.FixedHeader(tabel_Detail);
}

function p_validatePage() {

}

function p_showPrevData() {

}

function p_showBlank() {
    p_initiateData();
    //tabel_Detail.clear().draw(false);
}

//function setChooseLOV(txtValue) {
//    debugger;
//    var arr = txtValue.split('|');
//    switch (arr[0]) {

//        case "SUBBRAND":
//            var subbrand = p_getSubBrand(arr[1]);
//            debugger;
//            var BIT_ACTIVE = p_getCB(true);
//            PMCategorySubbrandTable.row.add([
//                arr[1],
//                subbrand[0],
//                subbrand[1],
//                '<input type="checkbox" ' + BIT_ACTIVE + '>',
//                '<a onclick="deleteRow(this)" class="btn btn-danger btn-icon waves-effect waves-float waves-light button-group"><i class="fa fa-trash"> </i></a>'
//            ]).draw(false);
//            break;

//    }
//    clsGlobal.closeLOV();
//}

function setChooseLOV(txtValue) {
    debugger;
    var arr = txtValue.split('|');
    switch (arr[0]) {

        case "SUBBRAND":
            var subbrand = p_getSubBrand(arr[1]);
            var BIT_ACTIVE = p_getCB(true);
            debugger;
            // 🔹 Validasi: Cek apakah subbrand[0] sudah ada di tabel
            var isDuplicate = false;
            PMCategorySubbrandTable.rows().every(function () {
                var rowData = this.data();
                debugger;
                if (rowData[1] === subbrand[0]) { // Cek kolom yang menyimpan subbrand[0]
                    isDuplicate = true;
                    return false; // Stop loop jika duplikat ditemukan
                }
            });

            if (isDuplicate) {
                alert("Subbrand sudah ada di dalam tabel!");
                return; // ❌ Stop, tidak menambahkan data baru
            }

            // ✅ Jika tidak duplikat, tambahkan data ke tabel
            PMCategorySubbrandTable.row.add([
                arr[1],
                subbrand[0],
                subbrand[1],
                '<input type="checkbox" ' + BIT_ACTIVE + '>',
                '<a onclick="deleteRow(this)" class="btn btn-danger btn-icon waves-effect waves-float waves-light button-group"><i class="fa fa-trash"> </i></a>'
            ]).draw(false);
            break;
    }

    clsGlobal.closeLOV();
}


function p_getCB(value) {
    var bitPIC = "";
    debugger;
    if (value == true) {
        bitPIC = "checked";
    }

    return bitPIC;
}

//function p_initiateData() {
//    debugger;
//    clsGlobal.showLoading();

//    $.ajax({
//        type: "POST",
//        url: "/PMCategory/InitiateDataDetailSubBrand",
//        data: { id: $('#IntPmcategoryId').val(), __RequestVerificationToken: $('#frmPMCategoryDetailSubBrand input[name=__RequestVerificationToken]').val() },
//        datatype: "json",
//        success: function (retDat) {
//            if (retDat.bitSuccess == true) {
//                if (retDat.objData != undefined) {
//                    debugger;
//                    $("#txtHiddenObject").val(JSON.stringify(retDat.objData));
//                    p_DataToUI(retDat.objData);
//                } else {
//                    p_showBlank();
//                }
//            } else {
//                clsGlobal.getAlert(retDat.txtMessage);
//            }
//            debugger;
//            clsGlobal.hideLoading();
//            //$.unblockUI();
//        },
//        error: function (retDat) {
//            clsGlobal.hideLoading();
//            //$.blockUI();
//        }
//    });

//}

var PMCategorySubbrandTable = $("#PMCategorySubbrandTable").DataTable({
    "scrollX": true,
    renderer: "bootstrap",
    "processing": true,
    "bAutoWidth": false,
    "paging": true,
    "fixedColumns": { "left": [1] },
    //"bJQueryUI": true,
    //"aLengthMenu": [[5, 10, 100, -1], [5, 10, 100, "All"]],
    "aLengthMenu": [[-1, 5, 10, 100], ["ALL", 5, 10, 100]],
    "columnDefs": [
        { "visible": false, "targets": [0] },
        { className: "text-center", "targets": [3] },
        { className: "text-center", "targets": [4] }
    ]
})

function p_DataToUI(objData) {
    debugger;
    $("#IntPmcategoryId").val(clsGlobal.parseToInteger(objData.intPmcategoryId));
    $("#TxtPmcategoryGuid").val(clsGlobal.parseToString(objData.txtPmcategoryGuid));
    $("#TxtPmcategoryCode").val(clsGlobal.parseToString(objData.txtPmcategoryCode));
    $("#TxtPmcategoryName").val(clsGlobal.parseToString(objData.txtPmcategoryName));

    $('#BitCritical').prop('checked', objData.bitCritical);
    $('#BitPrimary').prop('checked', objData.bitPrimary);
    $('#BitSecondary').prop('checked', objData.bitSecondary);
    $('#BitTertiary').prop('checked', objData.bitTertiary);
    $('#BitAttribute').prop('checked', objData.bitAttribute);
    $('#BitOthers').prop('checked', objData.bitOthers);
    $('#BitApplyProduct').prop('checked', objData.bitApplyProduct);
    $('#BitActive').prop('checked', objData.bitActive);

    PMCategorySubbrandTable.clear().draw(false);
    if (objData.listVmMPmcategorySubBrand.length > 0) {
        for (var i = 0; i < objData.listVmMPmcategorySubBrand.length; i++) {
            var BIT_ACTIVE = p_getCB(objData.listVmMPmcategorySubBrand[i].bitActive,);
            PMCategorySubbrandTable.row.add([

                objData.listVmMPmcategorySubBrand[i].intSubBrandId,
                objData.listVmMPmcategorySubBrand[i].txtSubBrandCode,
                objData.listVmMPmcategorySubBrand[i].txtSubBrandName,
                '<input type="checkbox" ' + BIT_ACTIVE + '>',
                '<a onclick="deleteRow(this)" class="btn btn-danger btn-icon waves-effect waves-float waves-light button-group"><i class="fa fa-trash"> </i></a>'
            ]).draw(false);
        };
    }


    $("#txtHiddenObject").val(JSON.stringify(objData));

    //if ($("#txtID").val() == "" || $("#txtID").val() == "0") {
    //    $("#btnDelete").hide();
    //} else {
    //    $("#btnDelete").show();
    //}
}

function p_UIToData() {
    var jsonObj = [];
    debugger;
    var htmlJSON = $("#txtHiddenObject").val();
    jsonData = JSON.parse(htmlJSON);
    jsonData.intPmcategoryId = clsGlobal.parseToInteger($("#IntPmcategoryId").val());
    jsonData.txtPmcategoryGuid = $("#TxtPmcategoryGuid").val();
    jsonData.txtPmcategoryCode = $("#TxtPmcategoryCode").val().toString();
    jsonData.txtPmcategoryName = $("#TxtPmcategoryName").val().toString();


    jsonData.bitCritical = clsGlobal.parseToBoolean($("#BitCritical").prop("checked"));
    jsonData.bitPrimary = clsGlobal.parseToBoolean($("#BitPrimary").prop("checked"));
    jsonData.bitSecondary = clsGlobal.parseToBoolean($("#BitSecondary").prop("checked"));
    jsonData.bitTertiary = clsGlobal.parseToBoolean($("#BitTertiary").prop("checked"));
    jsonData.bitAttribute = clsGlobal.parseToBoolean($("#BitAttribute").prop("checked"));
    jsonData.bitOthers = clsGlobal.parseToBoolean($("#BitOthers").prop("checked"));
    jsonData.bitApplyProduct = clsGlobal.parseToBoolean($("#BitApplyProduct").prop("checked"));
    jsonData.bitActive = clsGlobal.parseToBoolean($("#BitActive").prop("checked"));

    jsonData.listVmMPmcategorySubBrand = $("#txtHiddenDetailObject").val();

    $("#txtHiddenObject").val(JSON.stringify(jsonData));

}
function p_UIDetailToData() {
    var jsonArray = "["; var jsonObj;

    var IntPmcategorySubBrandId; var TxtPmcategorySubBrandGuid; var IntPmcategoryHeaderId;
    var IntSubBrandId; var BitActive; var DtNonActive;
    var TxtInsertedBy; var DtInserted;
    var TxtUpdatedBy; var DtUpdated;

    if ($('#PMCategorySubbrandTable tbody td').length > 1) {
        for (var i = 1; i <= $('#PMCategorySubbrandTable tbody tr').length; i++) {
            var index = i - 1;
            debugger;
            IntPmcategorySubBrandId = '"IntPmcategorySubBrandId" : "0"';
            TxtPmcategorySubBrandGuid = '"TxtPmcategorySubBrandGuid" : ""';
            IntPmcategoryHeaderId = '"IntPmcategoryHeaderId" : "0"';
            /*IntSubBrandId = '"IntSubBrandId" : "' + document.getElementById("PMCategorySubbrandTable").rows[i].cells[0].innerHTML + '"';*/
            IntSubBrandId = '"IntSubBrandId" : "' + PMCategorySubbrandTable.cell(index, 0).data() + '"';
            BitActive = '"BitActive" : "' + $('#PMCategorySubbrandTable').DataTable().cell(index, 3).nodes().to$().find('input').prop("checked") + '"';

            DtNonActive = '"DtNonActive" : "/Date(946659600000)/"';

            TxtInsertedBy = '"TxtInsertedBy" : "0"';
            DtInserted = '"DtInserted" : "/Date(946659600000)/"';
            TxtUpdatedBy = '"TxtUpdatedBy" : "0"';
            DtUpdated = '"DtUpdated" : "/Date(946659600000)/"';

            jsonObj = "{" + IntPmcategorySubBrandId + "," + TxtPmcategorySubBrandGuid + "," + IntPmcategoryHeaderId + "," + IntSubBrandId + "," + BitActive + "," + DtNonActive + "," + TxtInsertedBy + "," + DtInserted + "," + TxtUpdatedBy + "," + DtUpdated + "}";

            if (i != $('#PMCategorySubbrandTable tbody tr').length) {
                jsonArray = jsonArray + jsonObj + ",";
            }

            if (i == $('#PMCategorySubbrandTable tbody tr').length) {
                jsonArray = jsonArray + jsonObj + "]";
            }
        }

        $("#txtHiddenDetailObject").val(jsonArray);
    }
    else {
        $("#txtHiddenDetailObject").val("");
    }

}
function p_saveData() {

    clsGlobal.showLoading();
    p_UIDetailToData();
    p_UIToData();
    debugger;
    $.ajax({
        type: "POST",
        url: "/PMCategory/SaveDataSubBrand",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmPMCategoryDetailSubBrand input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            debugger;
            if (retDat.bitSuccess == true) {
                p_DataToUI(retDat.objData);
                clsGlobal.swalSuccess(retDat.txtMessage);
                /*clsGlobal.getInformationMessage(retDat.txtMessage);*/
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }
            clsGlobal.hideLoading();
        },
        error: function (retDat) {
            debugger;
            clsGlobal.hideLoading();
        }
    });
}

function p_getSubBrand(intSubBrandId) {
    var description;

    $.ajax({
        type: "POST",
        url: "/PMCategory/GetDataSubBrand",
        async: false,
        context: this,
        data: { id: intSubBrandId, __RequestVerificationToken: $('#frmPMCategoryDetailSubBrand input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    description = [retDat.objData.txtSubBrandCode, retDat.objData.txtSubBrandName];
                } else {
                    description = ["", ""];
                }
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }
        },
        error: function (retDat) {

        }
    });

    return description;
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
        clsGlobal.showAlert(ex);
    }
});

$('#btnAddRow').bind('click', function () {
    debugger;
    try {
        LOV = clsGlobal.generateLOV(MODULE_LOV_SUBBRAND, "SUBBRAND");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

function deleteRow(btn) {
    clsGlobal.getConfirmation("Delete this data?", function (result) {
        if (result == true) {
            PMCategorySubbrandTable.rows($(btn).parent().parent()).remove().draw()
        }
        else {
            return false;
        }
    });

};
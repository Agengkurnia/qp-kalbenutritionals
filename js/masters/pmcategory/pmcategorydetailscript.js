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

//function p_initiateData() {
//    debugger;
//    clsGlobal.showLoading();
//    var a = @ViewBag.ID;
//    var b = a;
//    $.ajax({
//        type: "POST",
//        url: "/PMCategory/InitiateDataDetail",
//        data: { id: $('#IntPmcategoryId').val(), __RequestVerificationToken: $('#frmPMCategoryDetail input[name=__RequestVerificationToken]').val() },
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

    $("#txtHiddenObject").val(JSON.stringify(jsonData));

}

function p_saveData() {

    clsGlobal.showLoading();
    p_UIToData();
    debugger;
    $.ajax({
        type: "POST",
        url: "/PMCategory/SaveData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmPMCategoryDetail input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            debugger;
            if (retDat.bitSuccess == true) {
                p_DataToUI(retDat.objData);
                var txtUrl = `${base_path}/PMCategory/Detail?Id=${encodeURIComponent(retDat.objData.txtPmcategoryGuid)}`;
                debugger;
                clsGlobal.swalSuccessSaveOrSubmit(retDat.txtMessage, txtUrl);
                //clsGlobal.swalSuccessRedirect(retDat.txtMessage,
                //    function (result) {
                //        debugger;
                //        var id = retDat.objData.trFSV_HeaderViewModels.intFSV_HeaderID
                //        window.location.href = "/PMCategory/Detail/" + id;

                //    });
                //clsGlobal.swalSuccess(retDat.txtMessage);
                /*clsGlobal.getInformationMessage(retDat.txtMessage);*/
                //Swal.fire({
                //    title: "Success!",
                //    text: retDat.txtMessage,
                //    icon: "success",
                //    timer: 2000,
                //    showConfirmButton: false
                //});
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

//$('body').on('click', '.btnAdd', function () {

//    try {
//        table.row.add([
//            '<div class="col-sm-12" style="padding-left:0; padding-right:0"><div class="input-group"><div class="input-group-btn"><button type="button" id="btnLOVID" class="btn btn-danger" onclick="p_btnLOVIDClick()"> <i class="fa fa-search"></i></button></div><input type="text" id="txtID" class="form-control" disabled></div></div>',
//            '<div class="col-sm-12" style="padding-left:0; padding-right:0"><div class="input-group"><div class="input-group-btn"><button type="button" id="btnLOVID" class="btn btn-danger" onclick="p_btnLOVIDClick()"> <i class="fa fa-search"></i></button></div><input type="text" id="txtID" class="form-control" disabled></div></div>',
//            '<a onclick="deleteRow(this)" class="btn btn-sm btn-danger button-group"><i class="glyphicon glyphicon-trash"> </i></a>'
//        ]).draw();

//    } catch (ex) {
//        clsGlobal.showAlert(ex);
//    }

//});
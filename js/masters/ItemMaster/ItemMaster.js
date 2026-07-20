"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false;
var img = "images.jpg";
let labelTxtNik;

//let qrcode = new QRCode(document.getElementById("qr"), {
//    text: 1
//});


//=======================
// Confirmation
//======================= 

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    p_InitForm();
    p_validatePage();
    //p_InitiateDataList();
    //GetCountMachine();
    p_InitiateModalImage();

    resize();
    $(window).on("resize", function () {
        resize();
    });
});

//=======================
// FUNCTION
//=======================
function p_InitForm() {
    //p_initiateData();
    p_DisableAllBtnLOV();
    
}

function p_validatePage() {

}

function p_showPrevData() {

}

function p_showBlank() {
    p_initiateData();
}

function p_InitiateModalImage() {
    $("#txtItemImageLink").fancybox();

    //var imageModal = document.getElementById("imageModal");
    //// Get the image and insert it inside the modal - use its "alt" text as a caption
    //var img = document.getElementById("txtItemImage");
    //var modalImg = document.getElementById("img01");
    //var captionText = document.getElementById("caption");
    //img.onclick = function () {
    //    imageModal.style.display = "block";
    //    modalImg.src = this.src;
    //    captionText.innerHTML = this.alt;
    //}
    //// Get the <span> element that closes the modal
    ////var span = document.getElementsByClassName("close")[0];
    //// When the user clicks on <span> (x), close the modal
    ////span.onclick = function () {
    ////    modal.style.display = "none";
    ////}
    //imageModal.onclick = function (event) {
    //    if (event.target == imageModal) {
    //        imageModal.style.display = "none";
    //    }
    //}
}

function generateQrCodeFromTxtGUID(x) {
    let guid = x;
    labelTxtNik = $("#IntItemId").val();

    qrcode.clear();
    qrcode.makeCode(guid);
    //let qrElement = document.getElementById("#qr");
    //$("#qr").empty();

    //$("#qr").qrcode({
    //    fill: '#333',
    //    text: guid,
    //    mode: 1,
    //    label: labelTxtNik,
    //    fontcolor: '#008d4c',
    //    id: 'dr'
    //});
    //let cnv = $('#qr').children(":first");
    //cnv.attr("id", labelTxtNik);


}
function resize() {
    //$("#qr").outerHeight($(window).height() - $("#qr").offset().top - Math.abs($("#qr").outerHeight(true) - $("#qr").outerHeight()));
}

function simpanQr() {
    var canvas = document.querySelector('canvas');
    canvas.toBlob(function (blob) {
        saveAs(blob, labelTxtNik + "-" + ".png");
    });
};

function setChooseLOV(txtValue) {
    var arr = txtValue.split('|');
    switch (arr[0]) {
        case "TxtItemId":
            $("#TxtItemId").val(arr[1]);
            p_intItemID_TextChanged();
            $('#btnLOVBrand').show();
            $('#btnLOVUmBrand').show();
            $('#btnLOVItemCode').show();

            break;

        case "TxtUmBrandName":
            $('#IntLobId').val(arr[1])
            $("#TxtLobName").val(arr[2]);
            $("#IntUmBrandId").val(arr[3]);
            $("#TxtUmBrandName").val(arr[4]);

            $("#IntBrandId").val("0");
            $("#TxtBrandName").val("");
            break;

        case "TxtBrandName":
            $("#IntBrandId").val(arr[1]);
            $("#TxtBrandName").val(arr[2]);
            break;

        case "TxtItemCode":
            $("#TxtItemCode").val(arr[1]);
            $("#TxtItemName").val(arr[2]);
            break;

    }
    clsGlobal.closeLOV();
}

function p_GenerateAutoNumeric() {
    //$('.autonumeric').autoNumeric('init', { vMax: '9999999999999', vMin: '-9999999999999', aSep: ',', dGroup: '0', aDec: '.' });
}

function p_GetHiddenObject() {
    return JSON.parse($("#txtHiddenObject").val());
}
function p_SetHiddenObject(objDat) {
    $("#txtHiddenObject").val(JSON.stringify(objDat));
    // AutoNumeric.
    p_GenerateAutoNumeric();
}
//untuk menampilkan data ke UI
function p_DataToUI(objData) {
    $("#TxtItemId").val(clsGlobal.parseToString(objData.TxtItemId));

    $("#IntLobId").val(clsGlobal.parseToInteger(objData.IntLobId));
    $("#TxtLobName").val(clsGlobal.parseToString(objData.TxtLobName));
    $("#IntUmBrandId").val(clsGlobal.parseToInteger(objData.IntUmBrandId));
    $("#TxtUmBrandName").val(clsGlobal.parseToString(objData.TxtUmBrandName));

    $("#IntBrandId").val(clsGlobal.parseToInteger(objData.IntBrandId));
    $("#TxtBrandName").val(clsGlobal.parseToString(objData.TxtBrandName));

    $("#TxtItemCode").val(clsGlobal.parseToString(objData.TxtItemCode));
    $("#TxtItemName").val(clsGlobal.parseToString(objData.TxtItemName));
    $("#TxtUom").val(clsGlobal.parseToString(objData.TxtUom));
    $("#TxtItemDescription").val(clsGlobal.parseToString(objData.TxtItemDescription));


    $('#BitKanvas').prop('checked', clsGlobal.parseToBoolean(objData.BitKanvas));
    $('#BitCekOnHand').prop('checked', clsGlobal.parseToBoolean(objData.BitCekOnHand));

    $('#BitActive').prop('checked', clsGlobal.parseToBoolean(objData.BitActive));

    if (objData.txtItemImage != "") {
        img = clsGlobal.parseToString(objData.txtItemImage);
        $("#txtItemImage").attr("src", "/Data/UserData/Upload/" + img);
    } else {
        $("#txtItemImage").attr("src", "/Data/UserData/Upload/" + "images.jpg");
    }

    $("#txtHiddenObject").val(JSON.stringify(objData));
    //alert($("#txtItemCode").val());

    if ($("#TxtItemId").val() == "") {
        $("#btnDelete").hide();
        $('#TxtUom').prop("disabled", false);
        $('#BitCekOnHand').prop("disabled", false);
        $('#BitKanvas').prop("disabled", false);
    } else {
        $("#btnDelete").show();
        $("#btnSave").show();
        $('#TxtUom').prop("disabled", true);
        $('#BitCekOnHand').prop("disabled", true);
        $('#BitKanvas').prop("disabled", false);
        $('#BitActive').prop("disabled", false);
    }
    p_SetHiddenObject(objData);

}

//function p_initiateData() {
//    $.ajax({
//        type: "POST",
//        url: base_path + "/Master/ItemMaster/InitiateData",
//        data: {
//            txtGUID: $("#txtGUID").val(),
//            __RequestVerificationToken: $('#frmItemMaster input[name=__RequestVerificationToken]').val()
//        },
//        datatype: "json",
//        success: function (retDat) {
//            if (retDat.bitSuccess == true) {
//                if (retDat.objData != undefined) {
//                    $("#txtHiddenObject").val(JSON.stringify(retDat.objData));
//                    p_DataToUI(retDat.objData);

//                } else {
//                    p_showBlank();
//                }
//            } else {
//                clsGlobal.swalError(retDat.txtMessage);
//            }
//            $("#txtGUID").val(retDat.txtGUID);
//        },
//        error: function (xhr, status, error) {
//            clsGlobal.swalError(xhr.responseText);
//        }
//    });
//}

function p_UIToData() {
    var jsonData = [];
    //jsonData = p_GetHiddenObject();

    var htmlJSON = $("#txtHiddenObject").val();
    jsonData = JSON.parse(htmlJSON);

    jsonData.TxtItemId = clsGlobal.parseToString($("#TxtItemId").val());

    jsonData.IntLobId = clsGlobal.parseToInteger($("#IntLobId").val());
    jsonData.TxtLobName = $("#TxtLobName").val().toString();
    jsonData.IntUmBrandId = clsGlobal.parseToInteger($("#IntUmBrandId").val());
    jsonData.TxtUmBrandName = $("#TxtUmBrandName").val().toString();

    jsonData.IntBrandId = clsGlobal.parseToInteger($("#IntBrandId").val());
    jsonData.TxtBrandName = $("#TxtBrandName").val().toString();

    jsonData.TxtItemCode = $("#TxtItemCode").val().toString();
    jsonData.TxtItemName = $("#TxtItemName").val().toString();
    jsonData.TxtUom = $("#TxtUom").val().toString();
    jsonData.TxtItemDescription = $("#TxtItemDescription").val().toString();

    jsonData.BitKanvas = clsGlobal.parseToBoolean($("#BitKanvas").prop("checked"));
    jsonData.BitCekOnHand = clsGlobal.parseToBoolean($("#BitCekOnHand").prop("checked"));
    jsonData.BitActive = clsGlobal.parseToBoolean($("#BitActive").prop("checked"));

    jsonData.txtItemImage = img;

    p_SetHiddenObject(jsonData);

    //

    return $("#txtHiddenObject").val();
}

function p_DisableAllBtnLOV() {
    $("#btnSave").hide();
    $('#btnLOVItem').hide();
    $('#btnLOVBrand').hide();
    $('#btnLOVUmBrand').hide();
    $('#btnLOVItemCode').hide();
}

function p_DisableBtnLOV() {
    //$('#btnLOVItem').show();
    $('#btnLOVItem').hide();
    $("#btnSave").hide();
    $('#btnLOVBrand').hide();
    $('#btnLOVUmBrand').hide();
    $('#btnLOVItemCode').hide()
}

function p_EnableBtnLOV() {
    $('#btnSave').show();
    $('#btnLOVItem').hide();
    $('#btnLOVBrand').show();
    $('#btnLOVUmBrand').show();
    $('#btnLOVItemCode').show();
}

function p_intItemID_TextChanged() {
    $.ajax({
        type: "POST",
        url: base_path + "/Master/ItemMaster/GetData",
        data: {
            TxtItemId: $("#TxtItemId").val(),
            txtGUID: $("#txtGUID").val(),
            __RequestVerificationToken: $('#frmItemMaster input[name=__RequestVerificationToken]').val()
        },
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

//Machine Type ID
function p_saveData() {
    p_UIToData();
    $.ajax({
        type: "POST",
        url: base_path + "/Master/ItemMaster/SaveData",
        data: {
            data: $("#txtHiddenObject").val(),
            txtGUID: $("#txtGUID").val(),
            __RequestVerificationToken: $('#frmItemMaster input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                p_DataToUI(retDat.objData);
                p_DisableBtnLOV();
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
    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Master/ItemMaster/DeleteData",
        data: {
            data: $("#txtHiddenObject").val(),
            txtGUID: $("#txtGUID").val(),
            __RequestVerificationToken: $('#frm1 input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                p_DataToUI(retDat.objData);
                clsGlobal.getInformationMessage(retDat.txtMessage);
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }
            $("#txtGUID").val(retDat.txtGUID);
            clsGlobal.hideLoading();
        },
        error: function (retDat) {
            clsGlobal.hideLoading();
        }
    });
    location.reload();
}


//=======================
// HANDLER
//=======================
$("#fileImage").dropzone({
    url: "/ItemMaster/FileUpload",
    paramName: "FileModel",
    maxFilesize: 2, //mb,
    acceptedFiles: "image/*",
    success: function (a, b) {
        $("#txtItemImage").attr("src", "/Data/UserData/Upload/" + b);
        img = b;

    },
    sending: function (file, xhr, formData) {
        formData.append('__RequestVerificationToken',
            $('#frm1 input[name=__RequestVerificationToken]').val());
    }
});

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

$('#btnNew').bind('click', function () {
    try {
        p_showBlank();
        p_EnableBtnLOV();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnFind').bind('click', function () {
    try {
        p_showBlank();
        p_DisableBtnLOV();
        LOV = clsGlobal.generateLOV(MODULE_ITEMMASTER, "TxtItemId");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


//$('#btnLOVItem').bind('click', function () {
//    try {
//        LOV = clsGlobal.generateLOV(MODULE_ITEMMASTER, "IntItemId");
//        //manggil popup dan parameter
//    } catch (ex) {
//        clsGlobal.swalError(ex);
//    }
//});

$('#btnLOVBrand').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_LOV_BRAND, "TxtBrandName", $("#IntUmBrandId").val());
    } catch (ex) {
        clsGlobal.swalError(ex);
    }
});

$('#btnLOVUmBrand').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_LOV_UMBRAND, "TxtUmBrandName");
    } catch (ex) {
        clsGlobal.swalError(ex);
    }
});

$("#btnLOVItemCode").bind("click", function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_LOV_CUSTOMER_ITEM, "TxtItemCode");
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
        clsGlobal.showAlert(ex);
    }
});

$('#qr').bind('click', function () {
    try {
        simpanQr();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});
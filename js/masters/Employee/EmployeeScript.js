'use strict'

//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false;
var img = "images.jpg";

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
});

//=======================
// FUNCTION
//=======================
function p_InitForm() {
    p_initiateData();
    p_DisableAllBtnLOV();
}

function p_validatePage() {

}

function p_showPrevData() {

}

function p_showBlank() {
    p_initiateData();
}

let labelTxtNik;

function generateQrCodeFromTxtGUID(x) {
    let guid = x;
    labelTxtNik = $("#IntEmployeeId").val();

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

$(document).ready(function () {
    resize();
    $(window).on("resize", function () {
        resize();
    });
});


function simpanQr() {
    var canvas = document.querySelector('canvas');
    canvas.toBlob(function (blob) {
        saveAs(blob, labelTxtNik + "-" + ".png");
    });
};

function setChooseLOV(txtValue) {
    var arr = txtValue.split('|');
    switch (arr[0]) {
        case "TxtEmployeeId":
            $("#TxtEmployeeId").val(arr[1]);
            p_intEmployeeID_TextChanged();
            break;
    }
    clsGlobal.closeLOV();
}

function p_GenerateAutoNumeric() {
    $('.autonumeric').autoNumeric('init', { vMax: '9999999999999', vMin: '-9999999999999', aSep: ',', dGroup: '0', aDec: '.' });

}

function p_GetHiddenObject() {
    return JSON.parse($("#TxtHiddenObject").val());
}
function p_SetHiddenObject(objDat) {
    $("#TxtHiddenObject").val(JSON.stringify(objDat));
    // AutoNumeric.
    p_GenerateAutoNumeric();
}
//untuk menampilkan data ke UI
function p_DataToUI(objData) {
    $("#TxtEmployeeId").val(clsGlobal.parseToString(objData.TxtEmployeeId));

    p_PopulateAllEmployeeStatusAndSet(clsGlobal.parseToString(objData.TxtEmployeeStatus));

    $("#TxtEmployeeNik").val(clsGlobal.parseToString(objData.TxtEmployeeNik));
    $("#TxtEmployeeName").val(clsGlobal.parseToString(objData.TxtEmployeeName));
    $("#TxtAddress").val(clsGlobal.parseToString(objData.TxtAddress));
    $('#BitActive').prop('checked', clsGlobal.parseToBoolean(objData.BitActive));

    if (objData.TxtEmployeeImage != "") {
        img = clsGlobal.parseToString(objData.TxtEmployeeImage);
        $("#TxtEmployeeImage").attr("src", "/Data/UserData/Upload/" + img);
    } else {
        $("#TxtEmployeeImage").attr("src", "/Data/UserData/Upload/" + "images.jpg");
    }

    if (objData.TxtEmployeeId != "") {
        $('#BitActive').prop('disabled', false);
    }
    else {
        $('#BitActive').prop('disabled', true);
    }

    $("#TxtHiddenObject").val(JSON.stringify(objData));
    //alert($("#txtEmployeeNIK").val());

    if ($("#TxtEmployeeNik").val() == "") {
        $("#btnDelete").hide();
        $('#TxtEmployeeNik').prop("disabled", false);
    } else {
        $("#btnDelete").show();
        $("#btnSave").show();
        $('#TxtEmployeeNik').prop("disabled", true);
    }
    p_SetHiddenObject(objData);

}

function p_PopulateAllEmployeeStatusAndSet(txtValue) {
    $.ajax({
        type: "POST",
        url: base_path + "/Master/Employee/PopulateAllEmployeeStatus",
        data: {
            TxtGuid: $("#TxtGuid").val(),
            __RequestVerificationToken: $('#frmEmployee input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    $('#TxtEmployeeStatus').empty();
                    $('#TxtEmployeeStatus').append($('<option>').text("-").prop('value', ""));
                    for (var i = 0; i < retDat.objData.length; i++) {
                        $('#TxtEmployeeStatus').append($('<option>').text(retDat.objData[i].txtDesc).prop('value', retDat.objData[i].txtDesc));
                    }

                    if (txtValue != "") {
                        $("#TxtEmployeeStatus").val(txtValue);
                    }
                }
            } else {
                clsGlobal.swalError(retDat.txtMessage);
            }

            $("#TxtGuid").val(retDat.txtGUID);
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}

function p_initiateData() {
    $.ajax({
        type: "POST",
        url: base_path + "/Master/Employee/InitiateData",
        data: {
            TxtGuid: $("#TxtGuid").val(),
            __RequestVerificationToken: $('#frmEmployee input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    $("#TxtHiddenObject").val(JSON.stringify(retDat.objData));
                    p_DataToUI(retDat.objData);
                } else {
                    p_showBlank();
                }
            } else {
                clsGlobal.swalError(retDat.txtMessage);
            }
            $("#TxtGuid").val(retDat.txtGUID);
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}

function p_UIToData() {
    var jsonData;

    var htmlJSON = $("#TxtHiddenObject").val();
    jsonData = JSON.parse(htmlJSON);

    jsonData.TxtEmployeeId = clsGlobal.parseToString($("#TxtEmployeeId").val());

    jsonData.TxtEmployeeStatus = $("#TxtEmployeeStatus").val().toString();

    jsonData.TxtEmployeeNik = $("#TxtEmployeeNik").val().toString();
    jsonData.TxtEmployeeName = $("#TxtEmployeeName").val().toString();
    jsonData.TxtAddress = $("#TxtAddress").val().toString();

    jsonData.BitActive = clsGlobal.parseToBoolean($("#BitActive").prop("checked"));

    jsonData.TxtEmployeeImage = img;

    p_SetHiddenObject(jsonData);


    //

    return $("#TxtHiddenObject").val();
}

function p_DisableAllBtnLOV() {
    $("#btnSave").hide();
    $('#btnLOVEmployee').hide();
}

function p_DisableBtnLOV() {
    //$('#btnLOVEmployee').show();
    $('#btnLOVEmployee').hide();
    $("#btnSave").hide();
}

function p_EnableBtnLOV() {
    $('#btnSave').show();
    $('#btnLOVEmployee').hide();
}

function p_intEmployeeID_TextChanged() {
    $.ajax({
        type: "POST",
        url: base_path + "/Master/Employee/GetData",
        data: {
            txtID: $("#TxtEmployeeId").val(),
            txtGUID: $("#TxtGuid").val(),
            __RequestVerificationToken: $('#frmEmployee input[name=__RequestVerificationToken]').val()
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
                clsGlobal.swalError(retDat.txtMessage);
            }
            $("#TxtGuid").val(retDat.txtGUID);
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
        url: base_path + "/Master/Employee/SaveData",
        data: {
            data: $("#TxtHiddenObject").val(),
            txtGUID: $("#TxtGuid").val(),
            __RequestVerificationToken: $('#frmEmployee input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                p_DataToUI(retDat.objData);
                clsGlobal.swalSuccess(retDat.txtMessage);
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
            $("#TxtGuid").val(retDat.txtGUID);
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
        url: "/Master/Employee/DeleteData",
        data: {
            data: $("#TxtHiddenObject").val(),
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
$('#TxtEmployeeStatus').change(function () {
    try {
        $('#btnSave').show();
    } catch (ex) {
        clsGlobal.swalError(ex);
    }
});

$('#TxtEmployeeNik').change(function () {
    try {
        $.ajax({
            type: "POST",
            url: base_path + "/Master/Employee/GetEmployeeByNik",
            data: {
                TxtNik: $(this).val(),
                __RequestVerificationToken: $('#frmEmployee input[name=__RequestVerificationToken]').val()
            },
            datatype: "json",
            success: function (retDat) {
                if (retDat.bitSuccess == true) {
                    if (retDat.objData != undefined) {
                        $('#TxtEmployeeName').val(retDat.objData.EmpName);
                        $('#TxtAddress').val(retDat.objData.EmpOriAddr);
                    }
                } else {
                    clsGlobal.swalError(retDat.txtMessage);
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.swalError(xhr.responseText);
            }
        });
    } catch (ex) {
        clsGlobal.swalError(ex);
    }
});

$('#btnSave').bind('click', function () {
    try {
        clsGlobal.getConfirmation("Save this data?", function (result) {
            if (result == true) {
                p_saveData();
                p_DisableBtnLOV();
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
        p_EnableBtnLOV();
    } catch (ex) {
        clsGlobal.swalError(ex);
    }
});

$('#btnFind').bind('click', function () {
    try {
        p_showBlank();
        p_DisableBtnLOV();
        LOV = clsGlobal.generateLOV(MODULE_EMPLOYEE, "TxtEmployeeId");
    } catch (ex) {
        clsGlobal.showAlert(ex);
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

$(document).ready(function () {
    //$("#fileImage").dropzone(
    //    {
    //        url: "/Employee/FileUpload",
    //        paramName: "FileModel",
    //        maxFilesize: 2, //mb,
    //        acceptedFiles: "image/*",
    //        success: function (a, b) {
    //            $("#txtEmployeeImage").attr("src", "/Data/UserData/Upload/" + b);
    //            img = b;

    //        },
    //        sending: function (file, xhr, formData) {
    //            formData.append('__RequestVerificationToken',
    //                $('#frm1 input[name=__RequestVerificationToken]').val());
    //        }
    //    });
});


$(document).ready(function () {
    //var imageModal = document.getElementById("imageModal");
    //// Get the image and insert it inside the modal - use its "alt" text as a caption
    //var img = document.getElementById("txtEmployeeImage");
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
});

$('#qr').bind('click', function () {
    try {
        simpanQr();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});
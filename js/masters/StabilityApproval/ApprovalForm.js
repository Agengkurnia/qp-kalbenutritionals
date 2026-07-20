"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = true;
var baseUrl = $("#txtBaseUrl").val();
var ApiUrl = clsGlobal.getBackEndApi();
var tempArrApproval = [];


//=======================
// VALIDATION
//=======================

function p_validateFormHeader() {
    
}

//=======================
// Confirmation
//=======================



//=======================
// ON PAGE LOAD
//=======================

$(document).ready(function () {
    p_InitForm();
    p_validatePage();
    $(".select2").select2();
}).ajaxStart(function () {
    BlockUI();
}).ajaxStop(function () {
    UnBlockUI();
});

//=======================
// FUNCTION
//=======================
function p_InitForm() {
    /*p_DisableAllBtnLOV();*/
}
function p_validatePage() {

}
function p_showPrevData() {

}
function p_showBlank() {

}
function p_tooltip() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}
function p_saveDataApproval(buttonName = "") {
    let jsonDat = $("#txtSamplePayload").val();
    let payload = JSON.parse(jsonDat);

    var userName = clsGlobal.parseToString($('#txtUserLogin').val());
    var roleName = clsGlobal.parseToString($('#txtRoleName').val());

    payload.objRequestData = {
        FormButtonName: buttonName,
        Username: userName,
        RoleName: roleName,
        dataApprovals: tempArrApproval,
        BaseUrl: baseUrl
    };

    $.ajax({
        type: "POST",
        url: ApiUrl + "api/1/FormApproval/saveDataApprovalRequest",
        contentType: "application/json",
        data: JSON.stringify(payload),
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
        success: function (retDat) {
            debugger;
            if (retDat.bitSuccess == true) {
                clsGlobal.swalSuccess(ConvertFirstLetterCapitalize(retDat.txtMessage));
                $('#dataTableApproval').DataTable().draw();
                tempArrApproval = [];
            } else {
                clsGlobal.swalError(retDat.txtErrorMessage);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    })
}
function p_dataApproval(id, remarks) {
    let payload = {
        Formrequestheaderid: id,
        TxtRemark: remarks,
    };

    return payload;
}
function p_updateDataToArrApproval(id, txtRemak = "") {
    if (tempArrApproval.length > 0) {
        for (var i = 0; i < tempArrApproval.length; i++) {
            if (tempArrApproval[i].Formrequestheaderid == id) {
                tempArrApproval[i].TxtRemark = txtRemak;
                return true;
            }
        }
        return false;
    }
    
}
function addDataToArrApproval(id, txtremak = "") {
    debugger;
    var retDat = p_dataApproval(id, txtremak);
    tempArrApproval.push(retDat);
}
function p_deleteDataToArrApproval(id) {
    if (tempArrApproval.length > 0) {
        for (let i = 0; i < tempArrApproval.length; i++) {
            if (tempArrApproval[i].Formrequestheaderid == id) {
                tempArrApproval.splice(i, 1);
                break;
            }
        }
    }
}
function delay(callback, ms) {
    var timer = 0;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            callback.apply(context, args);
        }, ms || 0);
    };
}

//=======================
// HANDLER
//=======================
$('#dataTableApproval').DataTable({
    serverSide: true,
    fixedColumns: {
        left: 3,
    },
    autoWidth: false,
    searching: false,
    lengthMenu: [5, 10, 20],
    order: [[1, 'desc']],
    scrollX: true,
    scrollY: "400px",
    info: false,
    ajax: {
        type: "POST",
        url: ApiUrl + 'api/1/FormApproval/getDataApprovalRequest',
        dataSrc: 'data',
        contentType: 'application/json',
        data: function (d) {
            d.TxtFilter = $("#txtSearchValue").val().toUpperCase();
            d.TxtUsername = $("#txtUserLogin").val().toUpperCase();
            d.TxtUserRole = $("#txtRoleName").val().toUpperCase();
            return JSON.stringify(d);
        },
        headers: {
            Authorization: "Bearer " + $("#txtWSOToken").val(),
            BEAuthorization: $("#txtBEAuthorization").val()
        },
        datatype: "json",
    },
    columnDefs: [
        {
            defaultContent: "",
            className: 'dt-body-nowrap',
            targets: "_all",
        },
        {
            // For Checkboxes
            targets: 0,
            orderable: false,
            searchable: false,
            responsivePriority: 3,
            className: 'dt-center',
            selectRow: true
        },
    ],
    columns: [
        {
            render: function (data, type, full, meta) {
                var dat = "";
                if (tempArrApproval.length > 0) {
                    for (let item of tempArrApproval) {
                        if (item.Formrequestheaderid == full.Intformrequestheaderid) {
                            return `<input type="checkbox" class="dt-checkboxes form-check-input checkApprove" id="${item.Formrequestheaderid}" checked>`;
                        }
                        else {
                            dat = `<input type="checkbox" class="dt-checkboxes form-check-input checkApprove" id="${full.Intformrequestheaderid}">`;
                        }
                    }
                } else {
                    dat = `<input type="checkbox" class="dt-checkboxes form-check-input checkApprove" id="${full.Intformrequestheaderid}">`;
                }
                return dat;
            },
        },
        {
            data: 'Txtrequestnumber',
            render: function (data, type, full, meta) {
                return `<a href="${baseUrl}/StabilityRequestForm/Index?RequestNo=${data}">${data}</a>`;
            },
            width: 200,
        },
        {
            data: 'Txtpic',
            width: 100,
            render: function (data, type, full, meta) {
                return `<div class="text-left" style="width:250px">${data}</div>`
            }
        },
        {
            data: 'Txtconceptnumber',
            width: 100

        },
        {
            data: 'Txtprojectnumber',
            width: 100
        },
        {
            data: 'Txtitemcode',
            width: 80
        },
        {
            data: 'Txtitemdescription',
            width: 300
        },
        {
            data: 'Txtproducttype',
            width: 100
        },
        {
            data: 'Formproductinformations[0].Txtprojecttype',
            width: 200,
            orderable: false
        },
        {
            data: 'Formproductinformations[0].Txtpackagingtype',
            width: 250,
            orderable: false
        },
        {
            data: 'Formproductinformations[0].Txtpackagingspecification',
            width: 250,
            orderable: false
        },
        {
            data: 'Formproductinformations[0].Txtshelflifetarget',
            width: 100,
            orderable: false,
            mender: function (data, type, full, meta) {
                return `<div class="text-left" style="width:50px">${data}</div>`
            }
        },
        {
            data: 'Formtestreports[0].Txtrecommendedshelflife',
            width: 100,
            orderable: false
        },
        {
            render: function (data, type, full, meta) {
                var dat = "";
                if (tempArrApproval.length > 0) {
                    for (let item of tempArrApproval) {
                        if (item.Formrequestheaderid == full.Intformrequestheaderid) {
                            return `<textarea class="form-control" rows="4" id="txtRemaks-${item.Formrequestheaderid}" maxlength="150" style="width: 200px;">${item.TxtRemark}</textarea>`
                        }
                        else {
                            dat = `<textarea class="form-control" rows="4" id="txtRemaks-${full.Intformrequestheaderid}" maxlength="150" style="width: 200px;"></textarea>`;
                        }
                    }
                } else {
                    dat = `<textarea class="form-control" rows="4" id="txtRemaks-${full.Intformrequestheaderid}" maxlength="150" style="width: 200px;"></textarea>`;
                }
                return dat;
                
            },
            width: 200,
            orderable: false
        }
    ],
});

$('#btnApprove').on('click', function () {
    if (tempArrApproval.length === 0) {
        Swal.fire({
            title: 'Info!',
            icon: "info",
            text: 'Select Request First',
            type: 'info',
            customClass: {
                confirmButton: 'btn btn-success'
            },
            buttonsStyling: false
        });
    }
    else {
        try {
            clsGlobal.getConfirmation("Approve this request", function (result) {
                if (result == true) {
                    p_saveDataApproval(APPROVE);
                }
                else {
                    return false;
                }
            });
        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    }
});

$('#btnReject').on('click', function () {
    if (tempArrApproval.length === 0) {
        Swal.fire({
            title: 'Info!',
            icon: "info",
            text: 'Select Request First',
            type: 'info',
            customClass: {
                confirmButton: 'btn btn-success'
            },
            buttonsStyling: false
        });
    }
    else {
        try {
            clsGlobal.getConfirmation("Reject this request", function (result) {
                if (result == true) {
                    p_saveDataApproval(REJECT);
                }
                else {
                    return false;
                }
            });
        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    }
});

$('#dataTableApproval').DataTable().on('click', '.checkApprove', function (e) {
    debugger;
    if (e.currentTarget.checked) {
        var id = e.currentTarget.id
        var txtRemaks = $(`#txtRemaks-${id}`).val();
        if (txtRemaks === "" || txtRemaks === null) {
            clsGlobal.swalWarning("Input Remarks First");
            e.currentTarget.checked = false;
        } else {
            var retMessage = p_updateDataToArrApproval(id, txtRemaks);
            if (!retMessage) {
                addDataToArrApproval(id, txtRemaks);
            }
        }
    }
    else {
        debugger;
        var id = e.currentTarget.id
        p_deleteDataToArrApproval(id);
        $(`#txtRemaks-${id}`).val("");
    }
});

$('#txtSearchValue').keyup(delay(function () {
    $('#dataTableApproval').DataTable().draw();
}, 300));
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
    clsGlobal.showLoading();
    p_InitForm();
    //p_validatePage();

});

var PMCategoryTable = $("#PMCategoryTable").DataTable({
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

//=======================
// FUNCTION
//=======================
function p_InitForm() {
        p_initiateData();
    //    new $.fn.dataTable.FixedColumns(tabel_Simulation, { leftColumns: 1 });
}

function p_showBlank() {
    p_initiateData();
    PMCategoryTable.clear().draw(false);
}

function p_initiateData() {
    debugger;
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/PMCategory/InitiateData",
        data: {
            //id: $('#Intsimulationid').val(),
            __RequestVerificationToken: $('#frmPMCategory input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    debugger;
                    //$("#txtHiddenObject").val(JSON.stringify(retDat.objData));
                    PMCategoryTable.clear().draw(false);

                    for (var i = 0; i < retDat.objData.length; i++) {
                        var BIT_ACTIVE = p_getCB(retDat.objData[i].bitActive);
                        PMCategoryTable.row.add([
                            retDat.objData[i].intPmcategoryId,
                            retDat.objData[i].txtPmcategoryCode,
                            retDat.objData[i].txtPmcategoryName,
                            '<input type="checkbox" ' + BIT_ACTIVE + '>',
                            //'<button onclick="p_Edit(\'' + retDat.objData[i].txtPmcategoryGuid + '\')" class="btn btn-success btn-sm me-2 button-group">' +
                            //'<i class="fa fa-edit me-1"></i> Edit</button> ' +
                            `<a href="/PMCategory/Detail?id=${retDat.objData[i].txtPmcategoryGuid}" class="btn btn-success btn-sm me-2 button-group"> <i class="fas fa-edit me-1"></i> Edit </a>` +
                            //'<button onclick="p_SubBrand(\'' + retDat.objData[i].txtPmcategoryGuid + '\')" class="btn btn-success btn-sm me-2 button-group">' +
                            //'<i class="fa fa-edit me-1"></i> Sub Brand</button>'
                            `<a href="/PMCategory/DetailSubBrand?id=${retDat.objData[i].txtPmcategoryGuid}" class="btn btn-success btn-sm me-2 button-group"> <i class="fas fa-edit me-1"></i> Sub Brand </a>`
                        ]).draw(false);
                    }
                } else {
                    p_showBlank();
                }
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }
            debugger;
            clsGlobal.hideLoading();
            //$.unblockUI();
        },
        error: function (retDat) {
            clsGlobal.hideLoading();
            //$.blockUI();
        }
    });

}

function p_getCB(value) {
    var bitPIC = "";
    debugger;
    if (value == true) {
        bitPIC = "checked";
    }

    return bitPIC;
}

////HANDLER////

$('#btnCreate').bind('click', function () {
    debugger;
    window.location.href = "/PMCategory/Detail";
});

function p_Edit(id) {
    debugger;
    var uri = `${base_path}/PMCategory/Detail?Id=${encodeURIComponent(id)}`;
    window.open(uri, '_blank');
}

function p_SubBrand(id) {
    debugger;
    var uri = `${base_path}/PMCategory/DetailSubBrand?Id=${encodeURIComponent(id)}`;
    window.open(uri, '_blank');
//    window.open('/Simulation/DataCollection?id=' + id, '_blank');
}
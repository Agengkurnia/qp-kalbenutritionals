"use strict";

var currentDocData = null;

//=======================
// REGLOKAL DETAIL OBJECT
//=======================
var RegLokalDetail = {
    BindData: function (data) {
        console.log("RegLokalDetail.BindData called with:", data);
        
        try {
            if (!data) {
                console.error("Data is null or undefined");
                clsGlobal.swalError("Data tidak ditemukan");
                return;
            }

            if (data && data.Header) {
                var header = data.Header;
                console.log("Binding header data:", header);
                
                // Bind Header Data
                $('#RegLokalId').val(header.TxtId || header.txtId || '');
                $('#dtmCreatedDate').val(header.CreatedDate ? moment(header.CreatedDate).format('YYYY-MM-DD') : '');
                $('#RegLokalNumber').val(header.RegLokalNo || '');
                $('#RegLokalName').val(header.Name || '');
                $('#RegLokalStatus').val(header.Status || '');
                $('#RegLokalType').val(header.Type || '');
                $('#RegLokalDescription').val(header.Description || '');
                $('#RegLokalSubBrand').val(header.SubBrand || '');
                $('#RegLokalBrand').val(header.Brand || '');
                $('#Remarks').val(header.Remarks || '');
                $('#SubBrandCode').val(header.SubBrandCode || '');
                $('#txtCreatedBy').val(header.CreatedBy || '');
                $('#txtUpdatedBy').val(header.UpdatedBy || '');
                $('#dtmUpdatedDate').val(header.UpdatedDate || '');
                
                // Set Concept Type radio button
                if (header.ConceptType) {
                    $('input[name="ConceptType"][value="' + header.ConceptType + '"]').prop('checked', true);
                }
                
                // Set Concept Category radio button
                if (header.ConceptCategory) {
                    $('input[name="ConceptCategory"][value="' + header.ConceptCategory + '"]').prop('checked', true);
                }
                
                console.log("Header data bound successfully");
            } else {
                console.warn("No Header data in response");
            }

            if (data && data.Variants) {
                console.log("Binding variants:", data.Variants.length, "items");
                RegLokalDetail.BindVariants(data.Variants);
            } else {
                console.warn("No Variants data in response");
                // Clear table if no variants
                $('#tblSKUVariant tbody').empty();
            }
        } catch (e) {
            console.error("Error in BindData:", e);
            clsGlobal.swalError("Error binding data: " + e.message);
        }
    },

    BindVariants: function (variants) {
        console.log("BindVariants called with:", variants);
        
        var tbody = $('#tblSKUVariant tbody');
        tbody.empty();

        if (variants && variants.length > 0) {
            console.log("Binding", variants.length, "variants");
            
            for (var i = 0; i < variants.length; i++) {
                var variant = variants[i];
                
                var row = `
                    <tr data-variant-id="${variant.TxtId}">
                        <td style="display:none;">${variant.TxtId}</td>
                        <td style="display:none;">${variant.VarianCode || ''}</td>
                        <td>${variant.VarianName || ''}</td>
                        <td>${variant.SKU || ''}</td>
                        <td>${variant.UOM || ''}</td>
                        <td>
                            <button type="button" class="btn btn-sm btn-danger" onclick="RegLokalDetail.DeleteVariant('${variant.TxtId}')">
                                <i class="ti ti-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
                
                tbody.append(row);
            }
            console.log("Variants bound successfully");
        } else {
            console.warn("No variants to bind");
            tbody.append('<tr><td colspan="6" class="text-center">Tidak ada data varian</td></tr>');
        }
    },

    DeleteVariant: function (variantId) {
        console.log("DeleteVariant called for variantId:", variantId);
        
        clsGlobal.swalConfirm("Apakah Anda yakin ingin menghapus varian ini?", function () {
            var data = {
                __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val(),
                TxtId: variantId,
                RegLokalId: $('#RegLokalId').val()
            };

            $.ajax({
                type: "POST",
                url: base_path + "/RegLokal/DeleteRegLokalVariant",
                data: data,
                datatype: "json",
                success: function (retDat, status, xhr) {
                    if (xhr.responseText.includes("!DOCTYPE html")) {
                        clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                    }
                    else {
                        if (retDat.bitSuccess == true) {
                            console.log("Variant deleted successfully");
                            clsGlobal.swalSuccess("Variant berhasil dihapus");
                            // Remove row from table
                            $('tr[data-variant-id="' + variantId + '"]').remove();
                        }
                        else {
                            console.error("Delete failed:", retDat);
                            if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                                clsGlobal.swalWarning(retDat.objData);
                            }
                            else {
                                clsGlobal.swalError(retDat.txtMessage);
                            }
                        }
                    }
                },
                error: function (xhr, status, error) {
                    console.error("DeleteRegLokalVariant error:", xhr.status, xhr.responseText);
                    clsGlobal.swalError(xhr.responseText || error);
                }
            });
        });
    }
};

$(document).ready(function () {
    
    $('#btnBack').on('click', function (e) {
        e.preventDefault();
        f_ShowListRegLokal();
    });
    
    $('#btnSave').on('click', function (e) {
        e.preventDefault();
        
        console.log("Saving RegLokal Header...");
        
        var formData = $('#FormDetailRegLokal form').serialize();
        
        $.ajax({
            type: "POST",
            url: base_path + "/RegLokal/UpdateRegLokalHeader",
            data: formData,
            datatype: "json",
            beforeSend: function () {
                clsGlobal.showLoading();
            },
            success: function (retDat, status, xhr) {
                clsGlobal.hideLoading();
                console.log("UpdateRegLokalHeader response:", retDat);
                
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        clsGlobal.swalSuccess("Success Update Data");
                    }
                    else {
                        if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                            clsGlobal.swalWarning(retDat.objData);
                        }
                        else {
                            clsGlobal.swalError(retDat.txtMessage);
                        }
                    }
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.hideLoading();
                console.error("UpdateRegLokalHeader error:", xhr.status, xhr.responseText);
                clsGlobal.swalError(xhr.responseText || error);
            }
        });
    });

    $('#btnSubmit').on('click', function (e) {
        e.preventDefault();
        clsGlobal.swalInfo("Submit feature will be implemented");
    });

    $('#btnHold').on('click', function (e) {
        e.preventDefault();
        clsGlobal.swalInfo("Hold feature will be implemented");
    });

    $('#btnAddVarianSKU').on('click', function (e) {
        e.preventDefault();
        $('#ModalSKUVariant').modal('show');
    });
});


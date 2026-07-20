"use strict";

//=======================
// VARIABLE GLOBAL
//=======================

var clsGlobal = new clsGlobalClass();
var LOV;

//=======================
// ON PAGE LOAD
//=======================

$(document).ready(function () {
    ItemProductionApp.init();
    
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        ItemProductionApp.loadItemData(id);
    } else {
        Swal.fire({
            title: 'Getting Started',
            html: 'To begin creating a new Item Production, first select an <b>Item Sample Number</b> by clicking the search button next to the field.',
            icon: 'info',
            confirmButtonText: 'Got it!',
            customClass: {
                confirmButton: 'btn btn-primary'
            }
        }).then(() => {
            $('#btnItemSampleNumber').addClass('btn-highlight-pulse');
            setTimeout(() => {
                $('#btnItemSampleNumber').removeClass('btn-highlight-pulse');
            }, 3000);
        });
    }
});

//=======================
// MODULE
//=======================

const ItemProductionApp = (function () {
    // Configuration object
    const config = {
        tabs: {
            itemProduction: {
                id: 'form-tabs-ItemProduction',
                name: 'Item Production'
            },
            inventorySetup: {
                id: 'form-tabs-InventorySetup',
                name: 'Category'
            },
            measurement: {
                id: 'form-tabs-measurement',
                name: 'Measurement'
            }
        },

        lovCodes: {
            itemSampleNumber: 'LOV_ITEM_PM_SAMPLE_NUMBER',
            itemLOB: 'LOV_LOB_ITEM_TRIAL',
            barcode: 'LOV_BARCODE',
            uom: 'LOV_UOM'
        },

        requiredFields: [
            { id: 'txtItemSampleNumber', name: 'Item Sample Number' },
            { id: 'txtPrimaryUom', name: 'Primary UoM' },
            { id: 'txtShelfLife', name: 'Shelf Life' },
            { id: 'txtStorageCondition', name: 'Storage Condition' },
            { id: 'txtSupplierItem', name: 'Supplier Item' },
            { id: 'txtItemProductionDesc', name: 'Item Production Description' },
            { id: 'txtItemLOB', name: 'Item LOB' },
            //{ id: 'txtBarcodeNumber', name: 'Barcode Number' },
            //{ id: 'txtIoCode', name: 'IO Code' },
            { id: 'txtPackagingSize', name: 'Packaging Size' },
            { id: 'txtPalletSize', name: 'Pallet Size' },
            { id: 'txtUnitConversion', name: 'Inter-Class (Kg to Pcs)' },
            { id: 'decUnitOfMeasureWeight', name: 'Unit Of Measure (Weight)' },
            { id: 'decUnitOfMeasureVolume', name: 'Unit Of Measure (Volume)' },
            { id: 'intSupplierSiteId', name: 'Supplier Site ID' },
            { id: 'txtSupplierSite', name: 'Supplier Site' }
        ]
    };

    // Private functions
    function initializeForm() {
        // Add instructional message at the top of the form
        $('#itemProductionForm').prepend(
            `<div class="alert alert-info mb-3">
                <i class="fas fa-info-circle me-2"></i>
                <strong>Important:</strong> Start by selecting an Item Sample Number using the <button class="btn btn-primary btn-sm" disabled><i class="fas fa-search"></i></button> button. 
                Other fields will become available after selection.
            </div>`
        );

        // Initialize select2 dropdowns
        $(".select2").select2();

        // Load organization codes
        loadOrganizationCodes();

        
        // Disable form fields initially if no item sample number is selected
        if ($('#txtItemSampleNumber').val()) {
            enableFields();
        } else {
            disableFields();

            // Add tooltip to Item Sample Number button to make it more noticeable
            $('#btnItemSampleNumber').attr('data-bs-toggle', 'tooltip');
            $('#btnItemSampleNumber').attr('data-bs-placement', 'right');
            $('#btnItemSampleNumber').attr('title', 'Click here to select an Item Sample Number');

            // Initialize Bootstrap tooltips
            var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }

        // Set button text based on edit mode
        const isEdit = $('#btnSaveText').text() === "Update";
        if (!isEdit) {
            $('#btnSaveText').text("Save");
        }

        // Add focus event to show warning if item sample not selected
        $('input, select').on('focus', function () {
            if ($('#txtItemSampleNumber').val() === '') {
                const $field = $(this);
                if ($field.attr('id') !== 'txtItemSampleNumber') {
                    toastr.warning("Please select an Item Sample Number first");
                    // Pulse effect on the Item Sample Number button to draw attention
                    $('#btnItemSampleNumber').addClass('btn-pulse');
                    setTimeout(() => {
                        $('#btnItemSampleNumber').removeClass('btn-pulse');
                    }, 1500);
                    $field.blur();
                }
            }
        });

        // Initialize decimal inputs
        //initDecimalInputs();

        // Add CSS for button highlight and pulse effects
        $('<style>')
            .prop('type', 'text/css')
            .html(`
                .btn-highlight-pulse {
                    animation: pulse 1.5s infinite;
                    box-shadow: 0 0 0 rgba(220, 53, 69, 0.8);
                }
                .btn-pulse {
                    animation: pulse 0.5s 3;
                }
                @keyframes pulse {
                    0% {
                        box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7);
                    }
                    70% {
                        box-shadow: 0 0 0 10px rgba(220, 53, 69, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(220, 53, 69, 0);
                    }
                }
            `)
            .appendTo('head');
    }

    function initDecimalInputs() {
        // Set up validation for decimal input fields
        $('#txtShelfLife').on('input', function () {
            validateDecimal(this, 2);
        });

        $('#txtPackagingSize').on('input', function () {
            validateDecimal(this, 3);
        });

        $('#txtPalletSize').on('input', function () {
            validateDecimal(this, 3);
        });

        $('#txtUnitConversion').on('input', function () {
            validateDecimal(this, 8);
        });

        $('#decUnitOfMeasureWeight').on('input', function () {
            validateDecimal(this, 8);
        });

        $('#decUnitOfMeasureVolume').on('input', function () {
            validateDecimal(this, 8);
        });


        $("#txtBarcodeNumber").select2({
            disabled: false,
            placeholder: " Select Barcode (Use LOV button)",
            allowClear: true,
            dropdownCssClass: "d-none",
            minimumInputLength: 999,
            width: '100%'
        });

        $('#txtBarcodeNumber').on('select2:opening', function (e) {
            e.preventDefault();
            $('#btnBarcodeNumber').focus();
            return false;
        });

        $('<small class="text-muted ml-2">Please use LOV button to select values</small>')
            .insertAfter('#txtBarcodeNumber');


        $('#btnBarcodeNumber').addClass('btn-primary').removeClass('btn-secondary');
    }

    function validateDecimal(input, maxDecimals) {
        let value = input.value;

        // Remove any non-numeric and non-decimal characters
        value = value.replace(/[^0-9.]/g, '');

        // Ensure only one decimal point exists
        let parts = value.split('.');
        if (parts.length > 2) {
            parts = [parts[0], parts.slice(1).join('')];
        }

        // Limit decimal places
        if (parts.length === 2) {
            parts[1] = parts[1].substring(0, maxDecimals);
            value = parts[0] + '.' + parts[1];
        }

        input.value = value;
    }

    function loadOrganizationCodes() {
        $.ajax({
            url: '/ItemProductionRegistration/GetOrganizationCodes',
            type: 'GET',
            success: function (response) {
                $('#txtIoCode').empty();
                $.each(response, function (i, code) {
                    $('#txtIoCode').append($('<option>', {
                        value: code,
                        text: code
                    }));
                });
            },
            error: function (xhr) {
                toastr.error('Failed to load organization codes');
                console.error(xhr.responseText);
            }
        });
    }

    function loadItemData(id) {
        $.ajax({
            url: `/ItemProductionRegistration/GetItemById?id=${id}`,
            type: 'GET',
            success: function (data) {
                if (data) {
                    debugger;
                    // Update form title and button text
                    $('#formTitle').text('Edit Item Production');
                    $('#btnSaveText').text('Update');

                    // Set form data
                    $('#txtItemProductionCode').data('id', data.id);
                    $('#txtDocStatus').val(data.txtStatus);
                    $('#txtItemSampleNumber').val(data.txtItemSampleNumber);
                    $('#txtItemPmProductionId').val(data.txtItemPmProductionId);
                    $('#txtItemProductionCode').val(data.txtItemPmProductionCode);
                    $('#txtPrimaryUom').val(data.txtUom);
                    $('#txtShelfLife').val(data.decShelfLife);
                    $('#txtStorageCondition').val(data.txtStorageCondition).trigger('change');
                    $('#txtPotsType').val(data.txtPotsType);
                    $('#txtSupplierName').val(data.txtSupplierName);
                    $('#txtPrincipalName').val(data.txtPrincipalName);
                    $('#txtManufacturingSite').val(data.txtManufacturingSite);
                    $('#txtSupplierItem').val(data.txtSupplierItem);
                    $('#txtItemProductionDesc').val(data.txtItemProductionDescription);
                    $('#txtCreatedBy').val(data.txtCreatedBy);

                    // Inventory setup tab
                    $('#txtItemType').val(data.txtItemType || 'PM');
                    $('#txtItemSubType').val(data.txtItemSubType || 'ALL');
                    $('#txtItemLOB').val(data.txtItemLob);
                    $('#txtCorporateLOB').val(data.txtCorporateLob || 'SHP_NA');
                    $('#txtProductCategory').val(data.txtProductCategory || 'NA');
                    $('#txtProductionSite').val(data.txtProductionSite || 'NA');
                    $('#txtCategoryCode').val(data.txtCategoryCode);
                    $('#txtSubBrandCode').val(data.txtSubBrandCode);

                    // Handle barcode multiselect
                    if (data.txtBarcodeNumber) {
                        const barcodes = data.txtBarcodeNumber.split(',');
                        const $select = $('#txtBarcodeNumber');

                        $select.empty();
                        barcodes.forEach(function (barcode) {
                            if (barcode && barcode.trim() !== '') {
                                $select.append(new Option(barcode, barcode, true, true));
                            }
                        });
                        $select.trigger('change');
                    }

                    // Handle IO Code multiselect
                    if (data.txtIoCode) {
                        const codes = data.txtIoCode.split(',');
                        /* $('#txtIoCode').val(codes).trigger('change');*/
                        setTimeout(function () {
                            $('#txtIoCode').val(codes).trigger('change');
                        }, 100); // delay 100ms untuk memastikan select2 siap
                    }

                    // Measurement tab
                    $('#txtPackagingSize').val(data.decPackagingSize);
                    $('#txtPalletSize').val(data.decPalletSize);
                    $('#txtUnitConversion').val(data.decInterClass);
                    $('#decUnitOfMeasureWeight').val(data.decUnitOfMeasureWeight);
                    $('#decUnitOfMeasureVolume').val(data.decUnitOfMeasureVolume);


                    // --- TAMBAHAN UNTUK KOLOM BARU ---
                    $('#intSupplierId').val(data.intSupplierId); // Mengisi hidden field
                    $('#intManufacturingSiteId').val(data.intManufacturingSiteId);
                    $('#intSupplierSiteId').val(data.intSupplierSiteId);
                    $('#txtSupplierSite').val(data.txtSupplierSite);
                    // --- AKHIR TAMBAHAN ---

                    // Enable fields if values exist
                    if (data.txtItemSampleNumber) {
                        enableFields();
                    }

                    // Update button states based on status
                    if (data.txtStatus !== 'DRAFT') {
                        $('#btnSubmit').prop('disabled', true);
                        $('#btnSave').prop('disabled', true);
                    }

                    // Set up form state based on model
                    //debugger;
                    const currentStatus = $('#txtDocStatus').val();
                    if (currentStatus !== "DRAFT") {
                        $('#btnItemSampleNumber').prop('disabled', true);
                        $('#btnPrimaryUom').prop('disabled', true);
                        $('#txtShelfLife').prop('disabled', true);
                        $('#txtStorageCondition').prop('disabled', true);
                        $('#txtSupplierItem').prop('disabled', true);
                        $('#txtItemProductionDesc').prop('disabled', true);
                        $('#btnItemLOB').prop('disabled', true);
                        $('#btnBarcodeNumber').prop('disabled', true);
                        $('#txtBarcodeNumber').prop('disabled', true);
                        $('#txtIoCode').prop('disabled', true);
                        $('#txtPackagingSize').prop('disabled', true);
                        $('#txtPalletSize').prop('disabled', true);
                        $('#txtUnitConversion').prop('disabled', true);
                        $('#decUnitOfMeasureWeight').prop('disabled', true);
                        $('#decUnitOfMeasureVolume').prop('disabled', true);
                    }
                }
            },
            error: function (xhr) {
                toastr.error(`Error loading item: ${xhr.responseText}`);
            }
        });
    }

    function enableFields() {
        $('#btnBarcodeNumber').prop('disabled', false);
        $('#btnItemLOB').prop('disabled', false);
        $('#btnPrimaryUom').prop('disabled', false);
        $('#txtShelfLife').prop('disabled', false);
        $('#txtStorageCondition').prop('disabled', false);
        $('#txtSupplierItem').prop('disabled', false);
        $('#txtItemProductionDesc').prop('disabled', false);
        $('#txtPackagingSize').prop('disabled', false);
        $('#txtPalletSize').prop('disabled', false);
        $('#txtUnitConversion').prop('disabled', false);
        $('#decUnitOfMeasureWeight').prop('disabled', false);
        $('#decUnitOfMeasureVolume').prop('disabled', false);
        $('#txtIoCode').prop('disabled', false);
        $('#txtBarcodeNumber').prop('disabled', false);

        // --- TAMBAHAN ---
        $('#intManufacturingSiteId').prop('disabled', false);
        $('#intSupplierSiteId').prop('disabled', false);
        $('#txtSupplierSite').prop('disabled', false);
        // --- AKHIR TAMBAHAN ---
        // Hide the "start here" guidance when fields are enabled
        $('.alert-info').fadeOut();

        // Destroy the tooltip on Item Sample Number button if it exists
        if ($('#btnItemSampleNumber').data('bs-tooltip')) {
            $('#btnItemSampleNumber').tooltip('dispose');
        }
    }

    function disableFields() {
        $('#btnBarcodeNumber').prop('disabled', true);
        $('#btnItemLOB').prop('disabled', true);
        $('#btnPrimaryUom').prop('disabled', true);
        $('#txtShelfLife').prop('disabled', true);
        $('#txtStorageCondition').prop('disabled', true);
        $('#txtSupplierItem').prop('disabled', true);
        $('#txtItemProductionDesc').prop('disabled', true);
        $('#txtPackagingSize').prop('disabled', true);
        $('#txtPalletSize').prop('disabled', true);
        $('#txtUnitConversion').prop('disabled', true);
        $('#decUnitOfMeasureWeight').prop('disabled', true);
        $('#decUnitOfMeasureVolume').prop('disabled', true);
        $('#txtIoCode').prop('disabled', true);
        $('#txtBarcodeNumber').prop('disabled', true);

        // --- TAMBAHAN ---
        $('#intManufacturingSiteId').prop('disabled', true);
        $('#intSupplierSiteId').prop('disabled', true);
        $('#txtSupplierSite').prop('disabled', true);
        // --- AKHIR TAMBAHAN ---
    }

    function generateItemSampleCode() {
        const categoryCode = $('#txtCategoryCode').val();
        const subBrandCode = $('#txtSubBrandCode').val();
        const id = $('#txtItemProductionCode').data('id') || null;

        if (!categoryCode || !subBrandCode) {
            $('#txtItemProductionCode').val('');
            return Promise.resolve(false);
        }

        $('#txtItemProductionCode').val('Generating...').prop('disabled', true);

        return $.ajax({
            url: '/ItemProductionRegistration/GetItemProductionCode',
            type: 'GET',
            data: {
                categoryCode: categoryCode,
                subBrandCode: subBrandCode,
                id: id
            },
            timeout: 10000
        })
            .then(function (response) {
                if (response && response.success) {
                    $('#txtItemProductionCode').val(response.code);
                    return true;
                } else {
                    console.error('Failed:', response?.message);
                    toastr.warning(response?.message || 'Failed to generate code');
                    return false;
                }
            })
            .catch(function (error) {
                console.error('AJAX Error:', error);
                toastr.error('Error generating code');
                return false;
            })
            .finally(function () {
                $('#txtItemProductionCode').prop('disabled', false);
            });
    }

    function validateForm() {
        let isValid = true;
        let errorMessage = '';

        // Check required fields
        config.requiredFields.forEach(field => {
            const $field = $(`#${field.id}`);
            if (!$field.val() || $field.val().length === 0) {
                isValid = false;
                errorMessage += `- ${field.name} is required<br>`;
                $field.addClass('is-invalid');
            } else {
                $field.removeClass('is-invalid');
            }
        });
        debugger;
        // Additional validation for POTS Type
        const potsType = $('#txtPotsType').val();
        if (potsType === 'Buy') {
            if (!$('#txtSupplierName').val()) {
                isValid = false;
                errorMessage += `- Supplier Name (Buy) is required<br>`;
                $('#txtSupplierName').addClass('is-invalid');
            }
        } else if (potsType === 'Make') {
            if (!$('#txtSupplierName').val()) {
                isValid = false;
                errorMessage += `- Supplier Name (Make) is required<br>`;
                $('#txtSupplierName').addClass('is-invalid');
            }

            if (!$('#txtPrincipalName').val()) {
                isValid = false;
                errorMessage += `- Principal Name is required<br>`;
                $('#txtPrincipalName').addClass('is-invalid');
            }

            if (!$('#txtManufacturingSite').val()) {
                isValid = false;
                errorMessage += `- Manufacturing Site is required<br>`;
                $('#txtManufacturingSite').addClass('is-invalid');
            }
            debugger
            var IO = $('#txtIoCode').val();
            if (!$('#txtIoCode').val() || IO.length === 0) {
                debugger;
                isValid = false;
                errorMessage += `- IO is required<br>`;
                $('#txtIoCode').addClass('is-invalid');
            }
        }

        if (!isValid) {
            Swal.fire({
                title: 'Required Fields Missing',
                html: 'Please complete the following required fields:<br>' + errorMessage,
                icon: 'warning',
                confirmButtonText: 'Ok',
                customClass: {
                    confirmButton: 'btn btn-primary',
                    cancelButton: 'd-none',
                    denyButton: 'd-none'
                }
            });
        }

        return isValid;
    }

    function collectFormData() {
        const formData = {
            Id: $('#txtItemProductionCode').data('id') || 0,
            txtItemSampleNumber: $('#txtItemSampleNumber').val(),
            TxtItemPmProductionId: $('#txtItemPmProductionId').val() || '',
            TxtStatus: $('#txtDocStatus').val(),
            TxtItemPmProductionCode: $('#txtItemProductionCode').val(),
            TxtUom: $('#txtPrimaryUom').val(),
            TxtStorageCondition: $('#txtStorageCondition').val(),
            TxtPotsType: $('#txtPotsType').val(),
            TxtPrincipalName: $('#txtPrincipalName').val() || "-",
            TxtSupplierName: $('#txtSupplierName').val() || "-",
            TxtManufacturingSite: $('#txtManufacturingSite').val(),

            TxtSupplierItem: $('#txtSupplierItem').val(),
            TxtItemProductionDescription: $('#txtItemProductionDesc').val(),
            DecShelflife: parseFloat($('#txtShelfLife').val()) || 0,
            TxtItemType: $('#txtItemType').val() || "PM",
            TxtItemSubType: $('#txtItemSubType').val() || "ALL",
            TxtItemLob: $('#txtItemLOB').val(),
            TxtCorporateLob: $('#txtCorporateLOB').val() || "SHP_NA",
            TxtProductCategory: $('#txtProductCategory').val() || "NA",
            TxtProductionSite: $('#txtProductionSite').val() || "NA",
            TxtBarcodeNumber: $('#txtBarcodeNumber').val()?.join(',') || "",
            TxtIoCode: $('#txtIoCode').val()?.join(',') || "",
            DecPackagingSize: parseFloat($('#txtPackagingSize').val().replace(/,/g, '')) || 0,
            DecPalletSize: parseFloat($('#txtPalletSize').val().replace(/,/g, '')) || 0,
            DecInterClass: parseFloat($('#txtUnitConversion').val().replace(/,/g, '')) || 0,
            TxtUnitWeight: "Kg",
            TxtUnitWeiVolume: "M3",
            DecUnitOfMeasureWeight: parseFloat($('#decUnitOfMeasureWeight').val().replace(/,/g, '')) || 0,
            DecUnitOfMeasureVolume: parseFloat($('#decUnitOfMeasureVolume').val().replace(/,/g, '')) || 0,
            TxtCreatedBy: $('#txtCreatedBy').val(),

            IntSupplierId: parseInt($('#intSupplierId').val()) || 0, // Ini untuk hidden field yang sudah ada
            IntManufacturingSiteId: parseInt($('#intManufacturingSiteId').val()) || 0,
            IntSupplierSiteId: parseInt($('#intSupplierSiteId').val()) || 0,
            TxtSupplierSite: $('#txtSupplierSite').val(),
        };

        return formData;
    }

    function saveData(isEdit) {
        debugger;
        if (!validateForm()) {
            return;
        }
        debugger;
        const formData = collectFormData();
        const url = isEdit
            ? '/ItemProductionRegistration/Update'
            : '/ItemProductionRegistration/Save';

        $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (retDat) {
                if (retDat.bitSuccess == true) {
                    debugger;

                    clsGlobal.swalSuccessSaveOrSubmit(retDat.txtMessage, window.detailUrl + '?id=' + retDat.objData.txtItemPmProductionId);
                } else {
                    toastr.error(response.message);
                }
            },
            error: function (xhr) {
                toastr.error("Error saving data: " + xhr.responseText);
            }

            //success: function (response) {
            //    if (response.success) {
            //        debugger;
            //        if (isEdit) {
            //            clsGlobal.swalSuccessWithoutAction(response.message);
            //        } else {
            //            clsGlobal.swalSuccessSaveOrSubmit(response.message, response.redirectUrl || '/ItemProductionRegistration');
            //        }

            //    } else {
            //        toastr.error(response.message);
            //    }
            //},
            //error: function (xhr) {
            //    toastr.error("Error saving data: " + xhr.responseText);
            //}
        });
    }

    function submitData() {
        const id = $('#txtItemProductionCode').data('id');
        if (!id) {
            toastr.error("Please save the data first before submitting");
            return;
        }
        if (!validateForm()) {
            return;
        }
        const formData = collectFormData();

        $.ajax({
            url: '/ItemProductionRegistration/Submit',
            type: 'POST',
            contentType: 'application/json',
            /*data: JSON.stringify(id),*/
            data: JSON.stringify(formData),
            //success: function (response) {
            //    if (response.success) {
            //        //toastr.success(response.message);
            //        //$('#txtDocStatus').val("WAITING FOR APPROVAL");
            //        //$('#btnSubmit').prop('disabled', true);
            //        //window.location.href = '/ItemProductionRegistration/Index';

            //        debugger;
            //        clsGlobal.swalSuccessSaveOrSubmit(response.message, window.indexUrl);
            //    } else {
            //        toastr.error(response.message);
            //    }
            //},
            success: function (retDat) {
                if (retDat.bitSuccess == true) {
                    debugger;
                    //toastr.success(response.message);
                    //$('#txtDocStatus').val("WAITING FOR APPROVAL");
                    //$('#btnSubmit').prop('disabled', true);
                    //window.location.href = '/ItemProductionRegistration/Index';

                    debugger;
                    clsGlobal.swalSuccessSaveOrSubmit(retDat.txtMessage, window.indexUrl);
                } else {
                    toastr.error(response.message);
                }
            },
            error: function (xhr) {
                toastr.error("Error submitting data: " + xhr.responseText);
            }
        });
    }

    function bindEvents() {
        // Back button
        $('#btnBack').click(function (e) {
            e.preventDefault();
            
            // Complete Navigation Logic (mimics _layout.cshtml)
            
            // Step 1: Get Destination URL (The "New Active" URL)
            let targetUrl = localStorage.getItem('prevurlMenu');
            // Implement fallback if null, undefined, or empty
            if (!targetUrl || targetUrl.trim() === '') {
                targetUrl = '/ItemProductionRegistration';
            }
            
            // Step 2: Get Current URL (The "New Previous" URL)
            const currentPageUrl = window.location.href;
            
            // Step 3: Define the navigation function
            const performNavigation = function() {
                // Set Local Storage (Critical Step - mimics _layout.cshtml)
                // a. Set urlMenu: the "new active" URL
                localStorage.setItem('urlMenu', targetUrl);
                // b. Set prevurlMenu: the "new previous" URL (the "jejak")
                localStorage.setItem('prevurlMenu', currentPageUrl);
                
                // Step 4: Redirect
                window.location.href = targetUrl;
            };
            
            const currentStatusBack = $('#txtDocStatus').val();

            if (currentStatusBack === 'DRAFT') {
                clsGlobal.getConfirmation(
                    "The Data have not been saved, are you sure to go back to home page?",
                    function (isConfirmed) {
                        if (isConfirmed) {
                            performNavigation();
                        }
                    }
                );
            } else {
                performNavigation();
            }
            
        });

        // Save button
        $('#btnSave').click(function () {
            const isEdit = $('#btnSaveText').text() === "Update";
            const actionText = isEdit ? "update" : "save";

            clsGlobal.getConfirmation(`Are you sure you want to ${actionText} this data?`, function (confirmed) {
                if (confirmed) {
                    saveData(isEdit);
                }
            });
        });

        // Submit button
        $('#btnSubmit').click(function () {
            const isEdit = $('#btnSaveText').text() === "Update";

            if (!isEdit) {
                toastr.error("Please save the data first before submitting");
                return;
            }

            Swal.fire({
                title: "Are you sure you want to submit this request?",
                text: "The status will be changed to 'Waiting for approval'",
                icon: "warning",
                howCancelButton: true,
                showDenyButton: false,
                showConfirmButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                buttonsStyling: true,
                customClass: {
                    confirmButton: 'btn btn-primary',
                    cancelButton: 'btn btn-secondary'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    submitData();
                }
            });
        });

        // LOV buttons
        $('#btnItemSampleNumber').click(function () {
            try {
                LOV = clsGlobal.generateLOV(config.lovCodes.itemSampleNumber, config.lovCodes.itemSampleNumber);
            } catch (ex) {
                clsGlobal.showAlert(ex);
            }
        });

        $('#btnItemLOB').click(function () {
            try {
                LOV = clsGlobal.generateLOV(config.lovCodes.itemLOB, config.lovCodes.itemLOB);
            } catch (ex) {
                clsGlobal.showAlert(ex);
            }
        });

        $('#btnBarcodeNumber').click(function () {
            try {
                LOV = clsGlobal.generateLOV(config.lovCodes.barcode, config.lovCodes.barcode, null, true);
            } catch (ex) {
                clsGlobal.showAlert(ex);
            }
        });

        $('#btnPrimaryUom').click(function () {
            try {
                LOV = clsGlobal.generateLOV(config.lovCodes.uom, config.lovCodes.uom);
            } catch (ex) {
                clsGlobal.showAlert(ex);
            }
        });
    }

    // Public methods
    return {
        init: function () {
            initializeForm();
            bindEvents();
        },

        loadItemData: loadItemData,

        setChooseLOV: function (txtValue) {
            const arr = txtValue.split('|');
            const selectedEvaluations = $('#txtBarcodeNumber').val() || [];
            debugger;
            switch (arr[0]) {
                case config.lovCodes.uom:
                    $("#txtPrimaryUom").val(arr[1]);
                    break;
                case config.lovCodes.categoryCode:
                    $("#txtCategoryCode").val(arr[1]);
                    $("#txtCategoryName").val(arr[2]);
                    $('#txtSubBrandCode').val(arr[3]);
                    $('#txtSubBrandName').val(arr[4]);
                    clsGlobal.closeLOV();
                    generateItemSampleCode();
                    break;
                case config.lovCodes.itemSampleNumber:
                    $("#txtItemSampleNumber").val(arr[1]);
                    $("#txtPrimaryUom").val(arr[2]);
                    $("#txtItemProductionDesc").val(arr[3]);
                    $("#txtPotsType").val(arr[4]);
                    $("#txtPrincipalName").val(arr[5]);
                    $("#txtSupplierName").val(arr[6]);
                    $("#txtManufacturingSite").val(arr[7]);
                    $("#txtItemLOB").val(arr[8]);
                    $("#txtCategoryCode").val(arr[9]);
                    $("#txtSubBrandCode").val(arr[10]);

                    // --- PENYESUAIAN URUTAN ---
                    $("#intSupplierId").val(arr[11]);
                    $("#intManufacturingSiteId").val(arr[12]);
                    $("#intSupplierSiteId").val(arr[13]);
                    $("#txtSupplierSite").val(arr[14]);
                    // --- AKHIR PENYESUAIAN ---
                    clsGlobal.closeLOV();
                    enableFields();

                    // Show a success message after selecting an item sample number
                    toastr.success("Item Sample Number selected. You can now complete the other fields.");

                    generateItemSampleCode();
                    break;
                case config.lovCodes.itemLOB:
                    $("#txtItemLOB").val(arr[1]);
                    break;

                case config.lovCodes.barcode:
                    var evaluationData = txtValue.substring(`${config.lovCodes.barcode}|`.length);
                    var evaluationEntries = evaluationData.split('|||');
                    var $select = $('#txtBarcodeNumber');
                    $select.val(null);

                    evaluationEntries.forEach(function (entry) {
                        if (!entry) return;

                        var parts = entry.split('|');
                        if (parts.length >= 1) {
                            var displayText = '';

                            if (parts[0]) {
                                displayText = parts[0];
                            }

                            if (parts[2]) {
                                displayText += ' | ' + parts[2];
                            }
                            if (parts[2]) {
                                displayText += ' | ' + parts[3];
                            }

                            if (!$select.find('option[value="' + displayText + '"]').length) {
                                $select.append(new Option(displayText, displayText));
                            }

                            selectedEvaluations.push(displayText);
                        }
                    });

                    $select.val(selectedEvaluations).trigger('change');
                    break;
            }
            clsGlobal.closeLOV();
        }
    };
})();

// Global function to handle LOV selection
function setChooseLOV(txtValue) {
    ItemProductionApp.setChooseLOV(txtValue);
}

function formatDecimal(input) {
    debugger;
    let value = input.value;

    let selectionStart = input.selectionStart;
    let afterCursor = value.length - selectionStart;

    let clean = value.replace(/,/g, '').replace(/[^0-9.]/g, '');

    const hasTrailingDot = clean.endsWith('.') && clean.indexOf('.') === clean.lastIndexOf('.');

    const parts = clean.split('.');
    let intPart = parts[0];
    let decPart = parts[1] || '';

    if (parts.length > 3) {
        decPart = parts.slice(1).join('');
    }

    decPart = decPart.substring(0, 3);
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    let formatted = decPart.length > 0
        ? `${intPart}.${decPart}`
        : (hasTrailingDot ? `${intPart}.` : intPart);

    input.value = formatted;

    const newCursor = input.value.length - afterCursor;
    input.setSelectionRange(newCursor, newCursor);
}

// Pasang event blur ke semua input yang punya oninput="formatDecimal(this)"
window.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input[oninput="formatDecimal(this)"]');

    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            let value = input.value.replace(/,/g, '');
            if (value.includes('.')) return;

            let number = parseFloat(value);
            if (!isNaN(number)) {
                let intPart = Math.floor(number).toString();
                intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                input.value = `${intPart}.000`;
            }
        });
    });
});

function formatDecimalDelapan(input) {
    debugger;
    let value = input.value;

    let selectionStart = input.selectionStart;
    let afterCursor = value.length - selectionStart;

    let clean = value.replace(/,/g, '').replace(/[^0-9.]/g, '');

    const hasTrailingDot = clean.endsWith('.') && clean.indexOf('.') === clean.lastIndexOf('.');

    const parts = clean.split('.');
    let intPart = parts[0];
    let decPart = parts[1] || '';

    if (parts.length > 8) {
        decPart = parts.slice(1).join('');
    }

    decPart = decPart.substring(0, 8);
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    let formatted = decPart.length > 0
        ? `${intPart}.${decPart}`
        : (hasTrailingDot ? `${intPart}.` : intPart);

    input.value = formatted;

    const newCursor = input.value.length - afterCursor;
    input.setSelectionRange(newCursor, newCursor);
}

// Pasang event blur ke semua input yang punya oninput="formatDecimal(this)"
window.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input[oninput="formatDecimalDelapan(this)"]');

    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            let value = input.value.replace(/,/g, '');
            if (value.includes('.')) return;

            let number = parseFloat(value);
            if (!isNaN(number)) {
                let intPart = Math.floor(number).toString();
                intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                input.value = `${intPart}.00000000`;
            }
        });
    });
});
"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var programCode = '';
var oTable;
let isEdit = false;
let DataInTable = '';
let Data = {};
var menuSelected;
var parentMenu;
var moduleMenu;
var menuCode;

// SessionStorage key for checkbox states
const STORAGE_KEY = 'checkedApprovalIds';

//=======================
// SESSION STORAGE HELPERS
//=======================
var CheckboxStorage = {
    // Initialize storage if it doesn't exist
    init: function() {
        if (!sessionStorage.getItem(STORAGE_KEY)) {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        }
    },
    
    // Get all checked IDs from storage
    getCheckedIds: function() {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    },
    
    // Add an ID to storage
    addId: function(id) {
        const ids = this.getCheckedIds();
        if (!ids.includes(id)) {
            ids.push(id);
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
        }
    },
    
    // Remove an ID from storage
    removeId: function(id) {
        let ids = this.getCheckedIds();
        ids = ids.filter(storedId => storedId !== id);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    },
    
    // Add multiple IDs
    addIds: function(idsArray) {
        const existingIds = this.getCheckedIds();
        const merged = [...new Set([...existingIds, ...idsArray])];
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    },
    
    // Remove multiple IDs
    removeIds: function(idsArray) {
        let ids = this.getCheckedIds();
        ids = ids.filter(id => !idsArray.includes(id));
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    },
    
    // Clear all stored IDs
    clear: function() {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    },
    
    // Check if an ID is in storage
    hasId: function(id) {
        return this.getCheckedIds().includes(id);
    }
};

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    Data = {};
    Data.ApprovalAction = {};
    
    // Initialize sessionStorage
    CheckboxStorage.init();

    p_InitForm();
});

function p_InitForm() {
    $("#btnMenu").on("click", (e) => {
        
        e.preventDefault();

        let valSistem = $("#programSelect").find(':selected').val();
        if (valSistem === "") {
            clsGlobal.swalWarning("Please Select Program Name!");
        }
        else {
            clsGlobal.generateLOV(MODULE_LOV_APPROVAL_MENU, MODULE_LOV_APPROVAL_MENU, valSistem);
        }
    });


    $('#buttonSearch').on('click', function (e) {
        e.preventDefault();

        Table.Binding();
    });

    // Batch action buttons
    $('#btnBatchApprove').on('click', function (e) {
        e.preventDefault();
        BatchAction.ProcessBatch('APPROVE');
    });

    $('#btnBatchReject').on('click', function (e) {
        e.preventDefault();
        BatchAction.ProcessBatch('REJECT');
    });

    // Select all checkbox
    $('#selectAllApprovals').on('change', function () {
        const isChecked = $(this).prop('checked');
        const visibleIds = [];
        
        $('.approval-checkbox').each(function() {
            $(this).prop('checked', isChecked);
            const approvalId = $(this).data('approval-id');
            if (approvalId) {
                visibleIds.push(approvalId);
            }
        });
        
        // Update sessionStorage
        if (isChecked) {
            CheckboxStorage.addIds(visibleIds);
        } else {
            CheckboxStorage.removeIds(visibleIds);
        }
        
        BatchAction.UpdateButtonStates();
    });

    // Individual checkbox change
    $(document).on('change', '.approval-checkbox', function () {
        const approvalId = $(this).data('approval-id');
        const isChecked = $(this).prop('checked');
        
        // Update sessionStorage
        if (isChecked) {
            CheckboxStorage.addId(approvalId);
        } else {
            CheckboxStorage.removeId(approvalId);
        }
        
        BatchAction.UpdateButtonStates();
        
        // Update select-all checkbox state
        const totalCheckboxes = $('.approval-checkbox').length;
        const checkedCheckboxes = $('.approval-checkbox:checked').length;
        $('#selectAllApprovals').prop('checked', totalCheckboxes === checkedCheckboxes && totalCheckboxes > 0);
    });

    Table.Binding();
}

var Table = {
    Binding: function () {
        let ProgramCodeSelect = "-";

        if ($("#programSelect").val()) {
            ProgramCodeSelect = $("#programSelect").val();
        }

        // Always use server-side DataTable to load data (even when no Program is selected)
        // The backend will handle "-" as "fetch all programs"
        oTable = $("#dataTableApproval").DataTable({
            "bPaginate": true,
            search: {
                return: true
            },
            scrollY: "400px",
            scrollX: "100%",
            lengthMenu: [5, 10, 25, 50, 100],
            "iDisplayLength": 10,
            serverSide: true,
            destroy: true,
            retrive: true,
            order: [[2, 'asc']],
            orderCellsTop: true,
            scrollCollapse: true,
            ajax: {
                type: "POST",
                url: base_path + '/Approval/DTApprovalTask',
                contentType: 'application/json',
                dataSrc: function (retDat) {
                    if (retDat.bitSuccess == false) {
                        if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                            clsGlobal.swalWarning(retDat.objData);
                        }
                        else {
                            clsGlobal.swalError(retDat.txtMessage);
                        }
                    }
                    else {
                        //Adding to Variable
                        DataInTable = retDat.dataSerialize;
                        return retDat.data;
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("RequestVerificationToken", $('input[name=__RequestVerificationToken]').val());
                },
                data: function (d) {
                    var objsearch = {
                        Search1: "",
                        Search2: ProgramCodeSelect,
                        Search3: $("#MenuCode").val(),
                        Search4: "",
                        Search5: "",
                        Search6: "",
                        Search7: "",
                        Search8: "",
                        Search9: "",
                        Search10: $("#StatusApproval").val()
                    }

                    //console.log("Masuk Sini");
                    //var datasearch = JSON.stringify(objsearch);
                    d.searchField = objsearch;
                    //console.log("Ini Data nya");
                    return JSON.stringify(d);
                },
                datatype: "json",
                error: function (xhr, status, error) {
                    if (xhr.responseText.includes("!DOCTYPE html")) {
                        clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                    }
                    else {
                        clsGlobal.swalError(xhr.responseText);
                    }
                }
            },
            searching: false,
            drawCallback: function(settings) {
                // Re-apply checkbox states from sessionStorage after table is redrawn
                Table.RestoreCheckboxStates();
            },
            columns: [
                {
                    data: null,
                    orderable: false,
                    className: 'select-checkbox text-center',
                    render: function (data, type, row, meta) {
                        return `<input type="checkbox" class="approval-checkbox" 
                                data-approval-id="${row.trApprovalId}" 
                                data-transaction-id="${row.transactionId}" 
                                data-menu-code="${row.rawMenuCode || ''}" 
                                data-program-code="${row.rawProgramCode || ''}" />`;
                    },
                    width: '30px'
                },
                {
                    data: 'trApprovalId',
                    orderable: false,
                    render: function (data, type, row, meta) {
                        let userGuid = row.trApprovalId;
                        let strhtml = "<td> ";
                        strhtml += `<button id="btnNew" type="button" class="btn btn-warning btn-xs me-2" onclick="Action.Approve(this);">
                    <span class="tf-icons ti ti-md ti-hand-click me-1"></span>
                </button> `;

                        strhtml += "</td>";
                        return strhtml;
                    },
                    width: '20px'
                },
                {
                    data: 'transactionNumber',
                    name: 'transactionNumber',
                    className: 'dt-body-nowrap',
                    width: '200px',
                    render: function (data, type, row, meta) {
                        let userGuid = row.transactionId;
                        let rowMenuCode = row.rawMenuCode || '';
                        let rowProgramCode = row.rawProgramCode || '';
                        //return `<a href="javascript:void(0);" onclick="p_openModalEdit('${userGuid}')"> ${data}</a>`;
                        return `<a href="javascript:void(0);" onclick="p_detectionMenuModal('${userGuid}', '${rowMenuCode}', '${rowProgramCode}')"> ${data}</a>`;
                    }
                },
                {
                    data: 'stepName',
                    className: 'dt-body-nowrap',
                    width: '250px',
                    name: 'stepName',
                },
                {
                    data: 'approvalUsername',
                    className: 'dt-body-nowrap',
                    width: '250px',
                    name: 'approvalUsername',
                },
                {
                    data: 'approvalUserRole',
                    className: 'dt-body-nowrap',
                    width: '250px',
                    name: 'approvalUserRole',
                },
                {
                    data: 'menuCode',
                    className: 'dt-body-nowrap',
                    width: '250px',
                    name: 'menuCode',
                },
                {
                    data: 'programCode',
                    className: 'dt-body-nowrap',
                    width: '150px',
                    name: 'programCode',
                },
            ],
        });
    },
    
    RestoreCheckboxStates: function() {
        // Get checked IDs from sessionStorage
        const checkedIds = CheckboxStorage.getCheckedIds();
        
        if (checkedIds.length === 0) {
            // Ensure select-all is unchecked
            $('#selectAllApprovals').prop('checked', false);
            return;
        }
        
        // Restore checkbox states for visible rows
        $('.approval-checkbox').each(function() {
            const approvalId = $(this).data('approval-id');
            if (checkedIds.includes(approvalId)) {
                $(this).prop('checked', true);
            } else {
                $(this).prop('checked', false);
            }
        });
        
        // Update select-all checkbox state
        const totalCheckboxes = $('.approval-checkbox').length;
        const checkedCheckboxes = $('.approval-checkbox:checked').length;
        $('#selectAllApprovals').prop('checked', totalCheckboxes > 0 && totalCheckboxes === checkedCheckboxes);
        
        // Update button states
        BatchAction.UpdateButtonStates();
    }
}

function p_detectionMenu(userGuid, rowMenuCode, rowProgramCode) {
    debugger;
    
    // Use row data if provided, otherwise fall back to global menuCode (from filter dropdown)
    let effectiveMenuCode = rowMenuCode || menuCode || '';
    let effectiveProgramCode = rowProgramCode || $("#programSelect").val() || '';
    
    // Build the menu parameter code (add MENU_MAPPING_ prefix)
    let menuAppParamCode = effectiveMenuCode ? "MENU_MAPPING_" + effectiveMenuCode : '';

    // Make sure we have both required parameters
    if (!userGuid || !menuAppParamCode) {
        clsGlobal.swalWarning("Missing required parameters for navigation");
        return;
    }

    // Make the AJAX call to RedirectToTaskDetail to get the URL
    $.ajax({
        type: "GET",
        url: "/Approval/RedirectToTaskDetail",
        data: {
            txtId: userGuid,
            Menulink: menuAppParamCode
        },
        beforeSend: function() {
            clsGlobal.showLoading();
        },
        success: async function(response) {
            clsGlobal.hideLoading();
            
            // Handle the JSON response from the controller
            if (response && response.success) {
                // If we're using row data (not from filter dropdown), we need to set the menu state
                if (rowMenuCode && !menuCode) {
                    // Fetch menu data to populate global variables for saveMenuStateAndNavigate
                    var menuData = await getDataMenuByCode(effectiveMenuCode);
                    if (menuData) {
                        menuSelected = menuData.intMenuID;
                        parentMenu = menuData.intParentID;
                        moduleMenu = menuData.intModuleID;
                    }
                }
                
                // Navigate to the URL returned by the controller
                saveMenuStateAndNavigate(response.url);
                //window.location.href = response.url;
            } else {
                // Handle error response
                const errorMessage = response && response.message ? response.message : "Error getting redirect URL";
                clsGlobal.swalWarning(errorMessage);
            }
        },
        error: function(xhr, status, error) {
            clsGlobal.hideLoading();
            
            // Handle different types of errors
            if (xhr.responseText && xhr.responseText.includes("!DOCTYPE html")) {
                clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
            } else if (xhr.status === 404) {
                clsGlobal.swalError("Redirect endpoint not found. Please check if the action method exists.");
            } else if (xhr.status === 500) {
                clsGlobal.swalError("Server error occurred while processing redirect request.");
            } else {
                clsGlobal.swalError("Error calling redirect service: " + error);
            }
        }
    });
}

//=======================
// MODAL VERSION - For Approval Task Page
//=======================
function p_detectionMenuModal(userGuid, rowMenuCode, rowProgramCode) {
    debugger;
    
    // Use row data if provided, otherwise fall back to global menuCode (from filter dropdown)
    let effectiveMenuCode = rowMenuCode || menuCode || '';
    let effectiveProgramCode = rowProgramCode || $("#programSelect").val() || '';
    
    // Build the menu parameter code (add MENU_MAPPING_ prefix)
    let menuAppParamCode = effectiveMenuCode ? "MENU_MAPPING_" + effectiveMenuCode : '';

    // Make sure we have both required parameters
    if (!userGuid || !menuAppParamCode) {
        clsGlobal.swalWarning("Missing required parameters for navigation");
        return;
    }

    // Make the AJAX call to RedirectToTaskDetail to get the URL
    $.ajax({
        type: "GET",
        url: "/Approval/RedirectToTaskDetail",
        data: {
            txtId: userGuid,
            Menulink: menuAppParamCode
        },
        beforeSend: function() {
            // Show the modal with loading spinner
            $('#globalDetailModal').modal('show');
            $('#globalDetailModalBody').html(`
                <div class="text-center p-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-3">Loading content...</p>
                </div>
            `);
        },
        success: function(response) {
            // Handle the JSON response from the controller
            if (response && response.success) {
                // Load the detail page content into the modal
                loadDetailIntoModal(response.url);
            } else {
                // Handle error response
                const errorMessage = response && response.message ? response.message : "Error getting redirect URL";
                $('#globalDetailModalBody').html(`
                    <div class="alert alert-danger" role="alert">
                        <i class="ti ti-alert-circle me-2"></i>${errorMessage}
                    </div>
                `);
            }
        },
        error: function(xhr, status, error) {
            // Handle different types of errors
            let errorMessage = "Error loading detail page";
            
            if (xhr.responseText && xhr.responseText.includes("!DOCTYPE html")) {
                errorMessage = "Session expired. Please login again.";
                setTimeout(() => {
                    window.location.href = window.location.href;
                }, 2000);
            } else if (xhr.status === 404) {
                errorMessage = "Detail page not found.";
            } else if (xhr.status === 500) {
                errorMessage = "Server error occurred.";
            } else {
                errorMessage = `Error: ${error}`;
            }
            
            $('#globalDetailModalBody').html(`
                <div class="alert alert-danger" role="alert">
                    <i class="ti ti-alert-circle me-2"></i>${errorMessage}
                </div>
            `);
        }
    });
}

function loadDetailIntoModal(url) {
    // Convert the Detail URL to GetDetailModal URL
    // e.g., /RequestItemTrial/Detail?id=xxx -> /RequestItemTrial/GetDetailModal?id=xxx
    const modalUrl = url.replace('/Detail', '/GetDetailModal');
    
    $.ajax({
        type: "GET",
        url: modalUrl,
        beforeSend: function() {
            $('#globalDetailModalBody').html(`
                <div class="text-center p-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-3">Loading detail content...</p>
                </div>
            `);
        },
        success: function(html) {
            // Inject the HTML into the modal
            $('#globalDetailModalBody').html(html);
            
            // Execute any scripts that were in the loaded content
            $('#globalDetailModalBody').find('script').each(function() {
                if (this.src) {
                    // External script - load it
                    $.getScript(this.src);
                } else {
                    // Inline script - execute it
                    eval($(this).text());
                }
            });

            // Re-initialize select2 elements within the modal content
            $('#globalDetailModalBody .select2').select2();

            // Initialize Bootstrap tabs within the modal
            // This ensures tab navigation works after AJAX loading
            $('#globalDetailModalBody .nav-tabs button[data-bs-toggle="tab"]').each(function() {
                var tabTrigger = new bootstrap.Tab(this);
                
                // Add click event listener for tab switching
                $(this).on('click', function (e) {
                    e.preventDefault();
                    tabTrigger.show();
                });
            });

            // Make sure the first tab is active by default
            var firstTab = $('#globalDetailModalBody .nav-tabs button[data-bs-toggle="tab"]:first');
            if (firstTab.length > 0) {
                var firstTabInstance = new bootstrap.Tab(firstTab[0]);
                firstTabInstance.show();
            }
        },
        error: function(xhr, status, error) {
            let errorMessage = "Error loading detail content";
            
            if (xhr.status === 404) {
                errorMessage = "Detail page not found.";
            } else if (xhr.status === 500) {
                errorMessage = "Server error occurred while loading detail.";
            } else {
                errorMessage = `Error: ${error}`;
            }
            
            $('#globalDetailModalBody').html(`
                <div class="alert alert-danger" role="alert">
                    <i class="ti ti-alert-circle me-2"></i>${errorMessage}
                </div>
            `);
        }
    });
}

var Action = {
    Approve: function (button) {
        Data.ApprovalAction = {};
        var row = $(button).closest('tr');
        var data = oTable.row(row).data();

        if (data) {
            Data.ApprovalAction = data;
            $('#ApprovalAction').select2({
                dropdownParent: $("#approvalTaskModal")
            });

            $("#ApprovalRemarks").val("");

            $('#ApprovalId').val(data.trApprovalId);
            $('#TransactionId').val(data.transactionId);
            $('#ApprovalAction').val("").trigger("change");
            $('#DocumentNumberApproval').val(data.transactionNumber);

            $('#approvalTaskModal').modal('toggle');
        } else {
            clsGlobal.swalWarning("Data tidak ditemukan!");
        }
    },
    Reject: function (button) {
        var row = $(button).closest('tr');
        var data = oTable.row(row).data();

        if (data) {

            $('#ApprovalId').val(data.trApprovalId);
            $('#TransactionId').val(data.transactionId);
            $('#ApprovalAction').val("REJECT");
            $('#DocumentNumberApproval').val(data.transactionNumber);

            $('#approvalTaskModal').modal('toggle');
        } else {
            clsGlobal.swalWarning("Data tidak ditemukan!");
        }
    },
    Submit: function () {
        //button.preventDefault();

        let isValid = true;
        const errorMessages = [];

        const fieldDisplayNames = {
            // 'txtSampleNumber': 'Sample Number',
            'ApprovalAction': 'Approval Action',
            'DocumentNumberApproval': 'Document Number Approval',
            'ApprovalRemarks': 'Approval Remarks',
        };

        const requiredFields = [
            // 'txtSampleNumber',
            'ApprovalAction', 'DocumentNumberApproval', 'ApprovalRemarks'
        ];

        requiredFields.forEach(fieldId => {
            const element = $('#' + fieldId);
            let value = element.val();

            if (element.prop('multiple')) {
                if (!value || value.length === 0) {
                    isValid = false;
                    const displayName = fieldDisplayNames[fieldId] || fieldId;
                    errorMessages.push(`${displayName} is required`);
                    element.addClass('is-invalid');
                } else {
                    element.removeClass('is-invalid');
                }
            }
            else {
                if (!value) {
                    isValid = false;
                    const displayName = fieldDisplayNames[fieldId] || fieldId;
                    errorMessages.push(`${displayName} is required`);
                    element.addClass('is-invalid');
                } else {
                    element.removeClass('is-invalid');
                }
            }
        });

        if (!isValid) {
            toastr.error(errorMessages.join('<br>'), 'Validation Error', { timeOut: 5000 });
        } else {
            Swal.fire({
                title: "Are you sure to process this data?",
                icon: "warning",
                showCancelButton: true,
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
                    Action.ApprovalAction();
                }
            });
        }
    },
    ApprovalAction: function () {

        let payload = {
            "programCode": "IDC_System",
            "trApprovalId": Data.ApprovalAction.trApprovalId,
            "transactionId": Data.ApprovalAction.transactionId,
            "statusCode": $('#ApprovalAction').val(),
            "userName": "",
            "deviceName": "",
            "deviceBrand": "",
            "deviceType": "",
            "latitude": 0,
            "longitude": 0,
            "reason": "",
            "remark": $("#ApprovalRemarks").val()
        }

        $.ajax({
            type: "POST",
            url: "/Approval/TakeAction",
            data: {
                data: payload,
                __RequestVerificationToken: $('#FormDashboard input[name=__RequestVerificationToken]').val()
            },
            datatype: "json",
            success: function (retDat, status, xhr) {
                clsGlobal.hideLoading();
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        if (retDat.objData) {
                            // Remove the processed item from sessionStorage
                            const processedId = Data.ApprovalAction.trApprovalId;
                            if (processedId) {
                                CheckboxStorage.removeId(processedId);
                            }
                            
                            Table.Binding();
                            clsGlobal.swalSuccess("Success Proceed the Data !\n Transaction Number :" + Data.ApprovalAction.transactionNumber);
                            $('#approvalTaskModal').modal('toggle');
                        } else {
                            clsGlobal.swalWarning(retDat.txtMessage);
                        }

                    }
                    else {
                        if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                            clsGlobal.swalWarning(retDat.txtMessage);
                        }
                        else {
                            clsGlobal.swalError(retDat.txtMessage);
                        }
                    }
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.hideLoading();
                clsGlobal.swalError(xhr.responseText);
            }
        });
    }
}

//=======================
// SET VALUE LOV
//=======================
function setChooseLOV(txtValue) {
    var arr = txtValue.split('|');
    switch (arr[0]) {
        case MODULE_LOV_APPROVAL_MENU:
            setMenu(arr);
            break;
    }
    clsGlobal.closeLOV();
}

function setMenu(arr) {
    
    debugger;
    $("#MenuCode").val(arr[1]);
    $("#MenuName").val(arr[2]);

    let menuAppParamCode = "MENU_MAPPING_" + arr[1];    
    menuCode = menuAppParamCode;
    var menuData = getDataMenuByCode(arr[1]);

    menuSelected = menuData.intMenuID;
    parentMenu = menuData.intParentID;
    moduleMenu =  menuData.intModuleID;
}


/**
 * Mengambil data menu dari server berdasarkan kode.
 * @param {string} txtCode - Kode menu yang akan dicari.
 * @returns {Promise<object|null>} Data menu sebagai objek, atau null jika terjadi error.
 */
async function getDataMenuByCode(txtCode) {
    // Pastikan URL-nya sesuai dengan routing .NET Anda
    // Biasanya: /NamaController/NamaAction
    const url = `/Approval/GetDataMenuByCode?txtCode=${encodeURIComponent(txtCode)}`;

    try {
        const response = await fetch(url);
        

        // Cek jika request gagal (misal: 404 Not Found, 500 Internal Server Error)
        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
            return null;
        }

        // Mengubah respons menjadi JSON
        const data = await response.json();

        return data;

    } catch (error) {
        // Menangani error jaringan atau parsing JSON
        console.error("Error fetching menu data:", error);
        return null;
    }
}

// --- Contoh Penggunaan ---
async function handleMenuSearch() {
    const codeToSearch = "MENU-001"; // Ambil ini dari input field
    console.log(`Mencari menu dengan kode: ${codeToSearch}...`);

    const menuData = await getDataMenuByCode(codeToSearch);

    if (menuData) {
        console.log("Data diterima:", menuData);
        // Lakukan sesuatu dengan data (misal: tampilkan di form)
        // document.getElementById('menuName').value = menuData.name;
    } else {
        console.log("Gagal mengambil data atau data tidak ditemukan.");
    }
}




function saveMenuStateAndNavigate(urlSelected) {
    debugger;
    // 1. Set value input (jika masih diperlukan)
    $('#activeMenu').val(menuSelected);

    // 2. Logging
    console.log("Menu yang dipilih:", menuSelected);
    console.log("URL Tujuan:", urlSelected);

    // 3. Get the current page URL (where we're clicking FROM)
    const currentPageUrl = window.location.href;

    // 4. Simpan state baru ke localStorage
    localStorage.setItem('selectedMenu', menuSelected);
    localStorage.setItem('parentMenu', parentMenu);
    localStorage.setItem('moduleMenu', moduleMenu);
    localStorage.setItem('urlMenu', urlSelected);
    
    // 5. Set prevurlMenu to the CURRENT page (the "jejak" - where we're coming FROM)
    localStorage.setItem('prevurlMenu', currentPageUrl);

    // 6. Redirect halaman
    window.location.replace(urlSelected);
}

//=======================
// BATCH ACTION HANDLER
//=======================
var BatchAction = {
    UpdateButtonStates: function () {
        const checkedCount = $('.approval-checkbox:checked').length;
        
        if (checkedCount > 0) {
            $('#btnBatchApprove').prop('disabled', false);
            $('#btnBatchReject').prop('disabled', false);
            $('#batchActionCount').text(`(${checkedCount} selected)`);
        } else {
            $('#btnBatchApprove').prop('disabled', true);
            $('#btnBatchReject').prop('disabled', true);
            $('#batchActionCount').text('');
        }
    },

    GetSelectedItems: function () {
        const selectedItems = [];
        $('.approval-checkbox:checked').each(function () {
            selectedItems.push({
                trApprovalId: $(this).data('approval-id'),
                transactionId: $(this).data('transaction-id'),
                menuCode: $(this).data('menu-code'),
                programCode: $(this).data('program-code')
            });
        });
        return selectedItems;
    },

    ProcessBatch: function (actionType) {
        const selectedItems = this.GetSelectedItems();

        if (selectedItems.length === 0) {
            clsGlobal.swalWarning("Please select at least one item!");
            return;
        }

        // For REJECT, we need to get a reason from the user
        if (actionType === 'REJECT') {
            this.ShowRejectDialog(selectedItems);
        } else {
            this.ShowApproveConfirmation(selectedItems);
        }
    },

    ShowApproveConfirmation: function (selectedItems) {
        Swal.fire({
            title: 'Batch Approval',
            text: `Are you sure you want to approve ${selectedItems.length} item(s)?`,
            icon: 'question',
            showCancelButton: true,
            showDenyButton: false,
            showConfirmButton: true,
            confirmButtonText: 'Yes, Approve All',
            cancelButtonText: 'Cancel',
            buttonsStyling: true,
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-secondary'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.ExecuteBatchAction(selectedItems, 'APPROVE', '');
            }
        });
    },

    ShowRejectDialog: function (selectedItems) {
        Swal.fire({
            title: 'Batch Rejection',
            html: `
                <p>You are about to reject ${selectedItems.length} item(s).</p>
                <p>Please provide a rejection reason:</p>
                <textarea id="batchRejectReason" class="swal2-textarea" placeholder="Enter rejection reason..." rows="4" style="width: 100%;"></textarea>
            `,
            icon: 'warning',
            showCancelButton: true,
            showDenyButton: false,
            showConfirmButton: true,
            confirmButtonText: 'Reject All',
            cancelButtonText: 'Cancel',
            buttonsStyling: true,
            customClass: {
                confirmButton: 'btn btn-danger',
                cancelButton: 'btn btn-secondary'
            },
            preConfirm: () => {
                const reason = document.getElementById('batchRejectReason').value;
                if (!reason || reason.trim() === '') {
                    Swal.showValidationMessage('Rejection reason is required');
                    return false;
                }
                return reason;
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                this.ExecuteBatchAction(selectedItems, 'REJECT', result.value);
            }
        });
    },

    ExecuteBatchAction: function (selectedItems, statusCode, remark) {
        // Build the batch request payload
        const payload = {
            programCode: $("#programSelect").val() || '',
            items: selectedItems.map(item => ({
                trApprovalId: item.trApprovalId,
                transactionId: item.transactionId,
                menuCode: item.menuCode,
                programCode: item.programCode
            })),
            statusCode: statusCode,
            remark: remark,
            latitude: 0,
            longitude: 0,
            reason: ''
        };

        // Show loading
        clsGlobal.showLoading();

        // Call batch API
        $.ajax({
            type: "POST",
            url: base_path + "/Approval/TakeBatchAction",
            data: payload,
            datatype: "json",
            success: function (retDat, status, xhr) {
                clsGlobal.hideLoading();
                
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                } else {
                    if (retDat.bitSuccess == true) {
                        const batchResult = retDat.objData;
                        
                        // Clear sessionStorage after successful batch action
                        CheckboxStorage.clear();
                        
                        // Show results
                        BatchAction.ShowBatchResults(batchResult, statusCode);
                        
                        // Reload table
                        Table.Binding();
                        
                        // Uncheck all checkboxes
                        $('.approval-checkbox').prop('checked', false);
                        $('#selectAllApprovals').prop('checked', false);
                        BatchAction.UpdateButtonStates();
                    } else {
                        if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                            clsGlobal.swalWarning(retDat.txtMessage);
                        } else {
                            clsGlobal.swalError(retDat.txtMessage);
                        }
                    }
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.hideLoading();
                clsGlobal.swalError(xhr.responseText);
            }
        });
    },

    ShowBatchResults: function (batchResult, actionType) {
        const actionWord = actionType === 'APPROVE' ? 'approved' : 'rejected';
        
        let icon = 'success';
        let title = 'Batch Processing Complete';
        
        if (batchResult.failedCount > 0 && batchResult.successCount === 0) {
            icon = 'error';
            title = 'Batch Processing Failed';
        } else if (batchResult.failedCount > 0) {
            icon = 'warning';
            title = 'Batch Processing Partially Complete';
        }

        let html = `
            <div class="text-start">
                <p><strong>Summary:</strong></p>
                <ul>
                    <li>Total processed: ${batchResult.totalProcessed}</li>
                    <li class="text-success">Successfully ${actionWord}: ${batchResult.successCount}</li>
                    <li class="text-danger">Failed: ${batchResult.failedCount}</li>
                </ul>
        `;

        // Show failed items if any
        if (batchResult.failedCount > 0) {
            html += `
                <p><strong>Failed Items:</strong></p>
                <ul class="text-danger">
            `;
            batchResult.results.forEach(result => {
                if (!result.success) {
                    html += `<li>${result.transactionNumber || result.transactionId}: ${result.errorMessage}</li>`;
                }
            });
            html += `</ul>`;
        }

        html += `</div>`;

        Swal.fire({
            title: title,
            html: html,
            icon: icon,
            confirmButtonText: 'OK'
        });
    }
};

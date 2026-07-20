"use strict";
//=======================
// MODULE: AturanKlaimDetail
//=======================
var AturanKlaimDetail = (function () {
    //=======================
    // VARIABLE GLOBAL
    //=======================
    var clsGlobal = new clsGlobalClass();
    var validationTimeout = null;

    //=======================
    // INITIALIZATION
    //=======================
    function init() {
        synchronizeAturanKlaimDetailMenuState();

        if (typeof msgSuccess !== 'undefined' && msgSuccess !== "") {
            showMessageSucces(msgSuccess);
        }

        // Setup validation
        setupRealTimeValidation();
        
        // Setup button events
        setupButtonEvents();
    }

    //=======================
    // BUTTON EVENT HANDLERS
    //=======================
    function setupButtonEvents() {
        // Save button
        $("#btnSave").on("click", function (e) {
            e.preventDefault();
            Save();
        });

        // Back button
        $("#btnBack").on("click", function (e) {
            e.preventDefault();
            GoBack();
        });
    }

    //=======================
    // SAVE FUNCTION (AJAX)
    //=======================
    async function Save() {
        try {
            // Validate form
            if (!$("#formDetailAturanKlaim").valid()) {
                clsGlobal.swalWarning("Mohon lengkapi semua field yang wajib diisi.");
                return;
            }

            var parameter = $("#Parameter").val()?.trim() || "";
            var typeClaimENG = $("#TypeClaimENG").val()?.trim() || "";
            var txtId = $("#TxtId").val()?.trim() || "";

            // Validate required fields
            if (!parameter || !typeClaimENG) {
                clsGlobal.swalWarning("Parameter dan Type Claim (ENG) wajib diisi.");
                return;
            }

            // Check for duplicate combination
            var isDuplicate = await checkDuplicateCombination(parameter, typeClaimENG, txtId);
            
            if (isDuplicate) {
                return; // Stop if duplicate
            }

            // Prepare form data
            var formData = {
                TxtId: txtId || null,
                Parameter: parameter,
                TypeClaimENG: typeClaimENG,
                TypeClaimINA: $("#TypeClaimINA").val()?.trim() || null,
                Persyaratan: $("#Persyaratan").val()?.trim() || null,
                Active: $("#Active").is(":checked")
            };

            // Get anti-forgery token
            var token = $('input[name="__RequestVerificationToken"]').val();

            // Disable save button to prevent double submission
            $("#btnSave").prop("disabled", true).html('<i class="fas fa-spinner fa-spin me-1"></i> Menyimpan...');

            // AJAX POST with JSON
            $.ajax({
                url: "/Master/AturanKlaim/Save",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(formData),
                beforeSend: function(xhr) {
                    if (token) {
                        xhr.setRequestHeader("RequestVerificationToken", token);
                    }
                },
                dataType: "json",
                success: function (response) {
                    if (response.success) {
                        // Success - redirect to index
                        clsGlobal.swalSuccessSaveOrSubmit(response.message, normalizeAturanKlaimDetailUrl('/Master/AturanKlaim/Index'));
                    } else {
                        // Error
                        clsGlobal.swalWarning(response.message || "Terjadi kesalahan saat menyimpan data.");
                        $("#btnSave").prop("disabled", false).html('<i class="fas fa-save me-1"></i> Simpan');
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error saving data:", error);
                    var errorMessage = "Terjadi kesalahan saat menyimpan data.";
                    if (xhr.responseJSON && xhr.responseJSON.message) {
                        errorMessage = xhr.responseJSON.message;
                    }
                    clsGlobal.swalError(errorMessage);
                    $("#btnSave").prop("disabled", false).html('<i class="fas fa-save me-1"></i> Simpan');
                }
            });
        } catch (ex) {
            console.error("Error in Save function:", ex);
            clsGlobal.swalError("Terjadi kesalahan: " + ex.message);
            $("#btnSave").prop("disabled", false).html('<i class="fas fa-save me-1"></i> Simpan');
        }
    }

    //=======================
    // GO BACK FUNCTION (CONFIRMATION)
    //=======================
    function GoBack() {
        // Get destination URL
        let targetUrl = localStorage.getItem('prevurlMenu');
        if (!targetUrl || targetUrl.trim() === '') {
            targetUrl = normalizeAturanKlaimDetailUrl('/Master/AturanKlaim/Index');
        }

        // Get current URL
        const currentPageUrl = window.location.href;

        // Define navigation function
        const performNavigation = function () {
            // Set Local Storage
            localStorage.setItem('urlMenu', targetUrl);
            localStorage.setItem('prevurlMenu', currentPageUrl);
            
            // Redirect
            window.location.href = targetUrl;
        };

        // Show confirmation dialog
        Swal.fire({
            title: "Konfirmasi",
            text: "Data belum disimpan. Yakin ingin kembali?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya",
            cancelButtonText: "Batal",
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-outline-danger ms-1'
            },
            buttonsStyling: false
        }).then((result) => {
            if (result.isConfirmed) {
                performNavigation();
            }
        });
    }

    //=======================
    // HELPER FUNCTIONS
    //=======================
    function normalizeAturanKlaimDetailUrl(path) {
        if (typeof base_path === 'undefined' || base_path === null) {
            return path;
        }
        var sanitizedBase = base_path.replace(/\/+$/, '');
        var sanitizedPath = path.startsWith('/') ? path : '/' + path;
        return sanitizedBase + sanitizedPath;
    }

    function synchronizeAturanKlaimDetailMenuState() {
        if (typeof localStorage === 'undefined') {
            return;
        }
        var pathWithQuery = window.location.pathname + window.location.search;
        var currentUrl = normalizeAturanKlaimDetailUrl(pathWithQuery);
        var indexUrl = normalizeAturanKlaimDetailUrl('/Master/AturanKlaim/Index');
        localStorage.setItem('urlMenu', currentUrl);
        localStorage.setItem('prevurlMenu', indexUrl);
    }

    function showMessageSucces(msgSuccess) {
        var txtUrl = normalizeAturanKlaimDetailUrl('/Master/AturanKlaim/Index');
        clsGlobal.swalSuccessSaveOrSubmit(msgSuccess, txtUrl);
    }

    //=======================
    // LOV FUNCTIONS
    //=======================
    function openLOVModal(moduleLOV, fieldName) {
        try {
            var LOV = clsGlobal.generateLOV(moduleLOV, fieldName);
        } catch (ex) {
            console.error("Error opening LOV modal:", ex);
        }
    }

    // Handle LOV callback
    window.setChooseLOV = function (txtValue) {
        try {
            if (typeof txtValue !== 'string' || txtValue.indexOf('|') === -1) {
                if (txtValue === "LOV_ATURAN_PARAMETER" || txtValue === "LOV_TYPE_CLAIM") {
                    console.warn("LOV callback called incorrectly. Expected format: fieldName|col1|col2|...");
                    return;
                }
            }
            
            var arr = txtValue.split('|');
            
            if (arr.length < 2) {
                console.error("Invalid LOV format:", txtValue);
                clsGlobal.closeLOV();
                return;
            }
            
            var fieldName = arr[0];
            var col1 = arr[1] || '';
            var col2 = arr[2] || '';
            
            switch (fieldName) {
                case "Parameter":
                    $("#Parameter").val(col2 || col1);
                    setTimeout(function() {
                        $("#Parameter").trigger("change");
                    }, 100);
                    break;
                case "TypeClaimENG":
                    $("#TypeClaimENG").val(col2 || col1);
                    setTimeout(function() {
                        $("#TypeClaimENG").trigger("change");
                    }, 100);
                    break;
                default:
                    console.warn("Unknown LOV field name:", fieldName, "Full value:", txtValue);
                    break;
            }
            
            clsGlobal.closeLOV();
        } catch (ex) {
            console.error("Error in setChooseLOV:", ex);
            clsGlobal.closeLOV();
        }
    };

    //=======================
    // VALIDATION FUNCTIONS
    //=======================
    function setupRealTimeValidation() {
        $("#Parameter, #TypeClaimENG").on("change blur", function () {
            clearTimeout(validationTimeout);
            validationTimeout = setTimeout(function () {
                validateCombination();
            }, 500);
        });

        $(document).on("change", "#Parameter, #TypeClaimENG", function () {
            clearTimeout(validationTimeout);
            validationTimeout = setTimeout(function () {
                validateCombination();
            }, 500);
        });
    }

    async function validateCombination() {
        var parameter = $("#Parameter").val()?.trim() || "";
        var typeClaimENG = $("#TypeClaimENG").val()?.trim() || "";
        var txtId = $("#TxtId").val()?.trim() || "";

        if (!parameter || !typeClaimENG) {
            clearCombinationError();
            return;
        }

        var isDuplicate = await checkDuplicateCombination(parameter, typeClaimENG, txtId, true);
        return isDuplicate;
    }

    async function checkDuplicateCombination(parameter, typeClaimENG, excludeTxtId, showFeedback = false) {
        try {
            var requestData = {
                Parameter: parameter,
                TypeClaimENG: typeClaimENG,
                ExcludeTxtId: excludeTxtId || null
            };

            var response = await $.ajax({
                url: "/Master/AturanKlaim/CheckDuplicateCombination",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(requestData),
                dataType: "json"
            });

            if (response.isDuplicate) {
                if (showFeedback) {
                    showCombinationError(response.message);
                } else {
                    clsGlobal.swalWarning(response.message);
                }
                return true;
            } else {
                clearCombinationError();
                return false;
            }
        } catch (error) {
            console.error("Error checking duplicate combination:", error);
            if (!showFeedback) {
                clsGlobal.swalError("Terjadi kesalahan saat memvalidasi kombinasi. Silakan coba lagi.");
            }
            return false;
        }
    }

    function showCombinationError(message) {
        clearCombinationError();
        var errorHtml = '<div class="alert alert-danger mt-2 mb-0" id="combinationErrorMsg" role="alert">' +
            '<i class="fas fa-exclamation-triangle me-2"></i>' +
            message +
            '</div>';
        $("#TypeClaimENG").closest(".col-md-6").append(errorHtml);
        $("#Parameter").addClass("is-invalid");
        $("#TypeClaimENG").addClass("is-invalid");
    }

    function clearCombinationError() {
        $("#combinationErrorMsg").remove();
        $("#Parameter").removeClass("is-invalid");
        $("#TypeClaimENG").removeClass("is-invalid");
    }

    //=======================
    // PUBLIC API
    //=======================
    return {
        init: init,
        Save: Save,
        GoBack: GoBack,
        openLOVModal: openLOVModal
    };
})();

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    AturanKlaimDetail.init();
});

// Global function for LOV buttons (called from HTML onclick)
function openLOVModal(moduleLOV, fieldName) {
    AturanKlaimDetail.openLOVModal(moduleLOV, fieldName);
}

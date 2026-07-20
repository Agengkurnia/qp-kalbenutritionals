"use strict";

var currentDocData = null;
let currentPreviewBlobUrls = [];
var currentRegalStatus = ''; // Store current regal header status
var isUserRA = false; // Store user role (RA or Non-RA). Set this based on your authentication system
var currentUserRoleCode = ''; // Store current user role code for RBAC
var isGuest = false; // Task 1: Global flag untuk Guest role (non-allowed roles)

// Ensure LOV global variable exists (fallback if GlobalScript.js not loaded yet)
if (typeof LOV === 'undefined') {
    var LOV;
}

// Helper function to check if user is RA (fallback if not available from controller)
// Primary source: UserInfo from GetRegalById response (set in BindData)
function checkUserRole() {
    // Option 1: Check from global variable (if set from server)
    if (typeof currentUserRole !== 'undefined') {
        isUserRA = currentUserRole === 'RA' || currentUserRole === 'REGULATORY_AFFAIR';
    }
    // Option 2: Check from ClsGlobalClass (if available)
    else if (typeof ClsGlobalClass !== 'undefined' && typeof ClsGlobalClass.dLogin === 'function') {
        try {
            var loginData = ClsGlobalClass.dLogin();
            if (loginData && loginData.userDat) {
                var userDept = (loginData.userDat.Department || '').toUpperCase();
                var userName = (loginData.userDat.txtUserName || '').toUpperCase();
                // Check if user is RA based on department or username
                isUserRA = userDept.includes('RA') || userDept.includes('REGULATORY') || 
                          userName.includes('RA') || userName.includes('REGULATORY');
                console.log("User role determined from ClsGlobalClass - IsRA:", isUserRA);
            }
        } catch (e) {
            console.warn("Could not determine user role:", e);
        }
    }
    
    return isUserRA;
}

//=======================
// REGAL DETAIL OBJECT
//=======================
var RegalDetail = {
    BindData: function (data) {
        console.log("RegalDetail.BindData called with:", data);
        
        try {
            if (!data) {
                console.error("Data is null or undefined");
                clsGlobal.swalError("Data tidak ditemukan");
                return;
            }

            // Task 1: Get user info from response data (set by controller)
            if (data && data.UserInfo) {
                var userInfo = data.UserInfo;
                isUserRA = userInfo.IsRA || false;
                console.log("User info from server:", userInfo);
                console.log("Is user RA:", isUserRA);
            } else {
                // Fallback: Try to check user role from global variable or ClsGlobalClass
                checkUserRole();
            }

            if (data && data.Header) {
                var header = data.Header;
                console.log("Binding header data:", header);
                console.log("ProjectNo from header:", header.ProjectNo);
                console.log("Brand from header:", header.Brand);
                
                // Bind Header Data with detailed logging for debugging
                $('#hdRegalId').val(header.TxtId || header.txtId || '');
                $('#tglPermintaan').val(header.PermintaanDate ? moment(header.PermintaanDate).format('YYYY-MM-DD') : '');
                $('#noPermintaan').val(header.RegistrasiNo || '');
        
                // Project Info
                $('#projectNo').val(header.ProjectNo || '');

                console.log("After binding ProjectNo, input value:", $('#projectNo').val());
                
                $('#verforNo').val(header.VerforNo || '');
                $('#projectType').val(header.ProjectType || '');
                
                // Production & Packaging
                $('#pabrikProduksi').val(header.PabrikProduksi || '');
                $('#alamatPabrik').val(header.AlamatPabrik || '');
                $('#kemasanPrimer').val(header.KemasanPrimer || '');
                
                // Product Info
                $('#brand').val(header.Brand || '');
                console.log("After binding Brand, input value:", $('#brand').val());
                
                $('#subBrand').val(header.SubBrand || '');
                $('#kategoriPangan').val(header.KategoriPangan || '');
                $('#varian').val(header.Varian || '');
                $('#namaJenis').val(header.NamaJenis || '');
                $('#takaranSaji').val(header.TakaranSaji || '');
                $('#checkTakaran').prop('checked', header.IsTakaranKurang || false);
                $('#klaim').val(header.Klaim || '');
                $('#beratBersih').val(header.BeratBersih || '');
                $('#status').val(header.Status || '');
                
                // Task 1: Store current regal status for role-based logic
                currentRegalStatus = (header.Status || '').toUpperCase();
                
                // PIC Info
                $('#picProdev').val(header.PicProdev || '');
                $('#picRA').val(header.PicRa || '');
                $('#picBD').val(header.PicBd || '');
                $('#picPackDev').val(header.PicPackDev || '');
                $('#picRAOSS').val(header.PicRaOss || '');
                $('#oss_PicRA').val(header.PicRaOss || '');
                
                // BPOM & FPA Dates
                $('#targetSubmitBPOM').val(header.TargetSubmitBpom ? moment(header.TargetSubmitBpom).format('YYYY-MM-DD') : '');
                $('#targetPersetujuanBPOM').val(header.TargetPersetujuanBpom ? moment(header.TargetPersetujuanBpom).format('YYYY-MM-DD') : '');
                $('#beSubmitBPOM').val(header.BeSubmitBpom ? moment(header.BeSubmitBpom).format('YYYY-MM-DD') : '');
                $('#bePersetujuanBPOM').val(header.BePersetujuanBpom ? moment(header.BePersetujuanBpom).format('YYYY-MM-DD') : '');
                $('#targetFPA').val(header.TargetFpa ? moment(header.TargetFpa).format('YYYY-MM-DD') : '');
                
                // Registration Info
                $('#kbli').val(header.Kbli || '');
                $('#jenisRegistrasi').val(header.JenisRegistrasi || '');
                $('#projectRegistrasi').val(header.ProjectRegistrasi || '');
                
                // Other Info
                $('#nomorIzinEdar').val(header.NomorIzinEdarExisting || '');
                $('#masaBerlakuStart').val(header.MasaBerlakuStart ? moment(header.MasaBerlakuStart).format('YYYY-MM-DD') : '');
                $('#masaBerlakuEnd').val(header.MasaBerlakuEnd ? moment(header.MasaBerlakuEnd).format('YYYY-MM-DD') : '');
                
                console.log("Header data bound successfully");
                console.log("Verification - ProjectNo input value:", $('#projectNo').val());
                console.log("Verification - Brand input value:", $('#brand').val());
            } else {
                console.warn("No Header data in response");
            }

            if (data && data.Documents) {
                console.log("Binding documents:", data.Documents.length, "items");
                RegalDetail.BindDocuments(data.Documents);
            } else {
                console.warn("No Documents data in response");
                // Clear table if no documents
                $('#tblDokumenRegistrasi tbody').empty();
            }

            let finalLabelPath = '';
            let finalLabelAlias = '';

            if (data && data.FinalLabel) {
                const finalLabel = data.FinalLabel;
                $('#approval_ra').val(finalLabel.ApprovalRaStatus || finalLabel.ApprovalRa || '');
                $('#approval_ra_date').val(formatDateForInput(finalLabel.ApprovalRaDate));
                $('#notes_ra').val(finalLabel.NotesRa || '');

                $('#approval_pd').val(finalLabel.ApprovalPdStatus || finalLabel.ApprovalPd || '');
                $('#approval_pd_date').val(formatDateForInput(finalLabel.ApprovalPdDate));
                $('#notes_pd').val(finalLabel.NotesPd || '');

                $('#approval_pkg').val(finalLabel.ApprovalPkgStatus || finalLabel.ApprovalPkg || '');
                $('#approval_pkg_date').val(formatDateForInput(finalLabel.ApprovalPkgDate));
                $('#notes_pkg').val(finalLabel.NotesPkg || '');

                finalLabelPath = finalLabel.FinalLabelFilePath || finalLabel.FilePathFinalLabel || finalLabel.FilePath || '';
                finalLabelAlias = finalLabel.FileNameAlias || '';
            } else {
                $('#approval_ra').val('');
                $('#approval_ra_date').val('');
                $('#notes_ra').val('');
                $('#approval_pd').val('');
                $('#approval_pd_date').val('');
                $('#notes_pd').val('');
                $('#approval_pkg').val('');
                $('#approval_pkg_date').val('');
                $('#notes_pkg').val('');
            }

            if (!finalLabelPath && data && data.Header && data.Header.FilePathFinalLabel) {
                finalLabelPath = data.Header.FilePathFinalLabel;
            }

            RegalDetail.f_UpdateFinalLabelUI(finalLabelPath, finalLabelAlias);

            if (data && data.StatusHistories) {
                RegalDetail.BindStatusHistory(data.StatusHistories);
            } else {
                RegalDetail.ClearStatusHistory();
            }

            // Bind OSS Data
            if (data && data.Oss) {
                const oss = data.Oss;
                $('#oss_IdOSS').val(oss.IdOss || '');
                $('#oss_TglPermintaan').val(formatDateForInput(oss.TglPermintaanOss));
                $('#oss_PicRA').val(oss.PicRaOss || '');
                $('#oss_NoAju').val(oss.NoAjuRegistrasi || '');
                $('#oss_KegiatanUsaha').val(oss.KegiatanUsaha || '');
                $('#oss_JenisPbum').val(oss.JenisPbumKu || '');
                $('#oss_NoIdOSS').val(oss.NoIdOss || '');
                $('#oss_Comment').val(oss.Comment || '');
            } else {
                // Clear OSS fields if no data
                $('#oss_IdOSS').val('');
                $('#oss_TglPermintaan').val('');
                $('#oss_PicRA').val('');
                $('#oss_NoAju').val('');
                $('#oss_KegiatanUsaha').val('');
                $('#oss_JenisPbum').val('');
                $('#oss_NoIdOSS').val('');
                $('#oss_Comment').val('');
            }

            // Bind Final Label Status - Menggunakan helper function untuk mengatur UI
            RegalDetail.f_UpdateFinalLabelStatusUI(data);

            // Task 1 & Task 3: Apply Role-Based Access Control after all data is loaded
            var userDept = '';
            if (data && data.UserInfo) {
                userDept = data.UserInfo.Department || data.UserInfo.department || '';
                // Store role code globally for use in other functions
                currentUserRoleCode = userDept;
                // Task 1: Set isGuest flag - if not in allowed roles, then Guest
                isGuest = !RegalDetail.f_IsAllowedRole(userDept);
                console.log("BindData: Applying role access control for department:", userDept);
                console.log("BindData: isGuest flag set to:", isGuest);
            } else {
                // Fallback: Try to get role from global variable or other sources
                console.warn("BindData: UserInfo not found in response, attempting fallback role detection");
                // Try to get role from ClsGlobalClass if available
                if (typeof ClsGlobalClass !== 'undefined' && typeof ClsGlobalClass.dLogin === 'function') {
                    try {
                        var loginData = ClsGlobalClass.dLogin();
                        if (loginData && loginData.roleDat) {
                            userDept = loginData.roleDat.txtRoleCode || '';
                            currentUserRoleCode = userDept;
                            // Task 1: Set isGuest flag
                            isGuest = !RegalDetail.f_IsAllowedRole(userDept);
                        }
                    } catch (e) {
                        console.warn("BindData: Could not get role from ClsGlobalClass:", e);
                    }
                }
            }
            
            // Task 4: Panggil f_ApplyRoleAccess di akhir (setelah semua fungsi UI selesai)
            // Ini menjadi "The Hammer" - penentu keputusan terakhir
            if (userDept) {
                // Panggil langsung
                RegalDetail.f_ApplyRoleAccess(userDept);
                
                // Panggil lagi dengan setTimeout untuk memastikan dia menjadi penentu terakhir
                // Setelah semua fungsi UI (termasuk yang async) selesai
                setTimeout(function() {
                    console.log("BindData: Final call to f_ApplyRoleAccess (The Hammer)");
                    RegalDetail.f_ApplyRoleAccess(userDept);
                }, 200);
            }
        } catch (e) {
            console.error("Error in BindData:", e);
            clsGlobal.swalError("Error binding data: " + e.message);
        }
    },

    BindDocuments: function (documents) {
        console.log("BindDocuments called with:", documents);

        // Ensure user role is checked
        checkUserRole();
        
        // Task 2: Use global isGuest flag (set in BindData) instead of creating local variable
        // Ensure isGuest is set if not already set
        if (typeof isGuest === 'undefined') {
            isGuest = !RegalDetail.f_IsAllowedRole(currentUserRoleCode);
        }
        
        var tbody = $('#tblDokumenRegistrasi tbody');
        tbody.empty();

        if (documents && documents.length > 0) {
            console.log("BindDocuments: Binding", documents.length, "documents");
            console.log("BindDocuments: Current user is RA:", isUserRA);
            console.log("BindDocuments: Current user is Guest:", isGuest);
            console.log("Current regal status:", currentRegalStatus);
            
            for (var i = 0; i < documents.length; i++) {
                var doc = documents[i];
                var configName = doc.ConfigUpload ? doc.ConfigUpload.UploadName : 'N/A';
                // Task 2: Get PIC with fallback - prefer PICUsername from transaction, fallback to TransactionPIC from config
                var configPIC = '';
                if (doc.ConfigUpload) {
                    // Priority 1: PICUsername from TrRegalDoc (transaction table)
                    // Priority 2: TransactionPIC from MConfigUploadFile (config table)
                    configPIC = doc.PICUsername || doc.ConfigUpload.TransactionPIC || '';
                }
                
                // Task 1: Check if document is voided
                var isVoided = doc.IsVoid === true || doc.IsVoid === 'true' || doc.IsVoid === 1;
                
                // Task 1: Role-based upload button logic
                var uploadBtn = '';
                
                // Task 2: Jika Guest, kosongkan kolom File (tidak render tombol apapun)
                if (isGuest) {
                    uploadBtn = '<span class="text-muted">-</span>';
                }
                // Task 1: Check if user is RA - hide upload/preview buttons for RA
                else if (isUserRA) {
                    // Khusus RA: Kosongkan tombol (RA hanya bertugas review dan mencentang Void, bukan mengelola file fisik)
                    uploadBtn = '<span class="text-muted">-</span>';
                } else {
                    // Non-RA: Gunakan logic yang SUDAH ADA (Cek FilePath, Cek Void, dll)
                    var isUploadDisabled = false;
                    var uploadDisabledReason = '';
                    
                    if (doc.FilePath) {
                        // File already uploaded - show preview button
                        var encodedPaths = encodeURIComponent(doc.FilePath || '');
                        var encodedNames = encodeURIComponent(doc.FileNameAlias || '');
                        var encodedConfigName = encodeURIComponent(configName || '');
                        
                        // Task 2: Always show button, only disable if voided
                        var previewDisabled = isVoided ? 'disabled' : '';
                        var previewOnClick = isVoided ? '' : `onclick="RegalDetail.ShowPreviewModal('${encodedPaths}', '${encodedConfigName}', '${doc.TxtId}', '${encodedNames}')"`;
                        
                        // Task 2: Keep original button class, just add disabled attribute
                        uploadBtn = `<button type="button" 
                                            class="btn btn-icon btn-success btn-sm" 
                                            ${previewDisabled}
                                            ${previewOnClick}
                                            data-bs-toggle="tooltip"
                                            data-bs-placement="top"
                                            title="${isVoided ? 'Dokumen telah di-void' : 'Pratinjau Dokumen'}">
                                        <i class="ti ti-eye"></i>
                                    </button>`;
                    } else {
                        // No file uploaded - show upload button
                        // Task 1: Check if upload should be disabled based on status (if not voided)
                        if (!isVoided) {
                            // Non-RA: Enable upload especially when status is DOC_IN_PROCESS
                            // Upload is enabled for Non-RA users
                            isUploadDisabled = false;
                        } else {
                            // If voided, disable upload button
                            isUploadDisabled = true;
                            uploadDisabledReason = 'Dokumen telah di-void';
                        }
                        
                        // Task 2: Always show button, only disable if needed
                        var uploadDisabledAttr = (isUploadDisabled || isVoided) ? 'disabled' : '';
                        uploadBtn = `<button type="button" 
                                            class="btn btn-icon btn-outline-primary btn-sm" 
                                            ${uploadDisabledAttr}
                                            ${!isUploadDisabled && !isVoided ? `onclick="RegalDetail.ShowUploadModal('${doc.TxtId}', ${i})"` : ''}
                                            data-bs-toggle="tooltip"
                                            data-bs-placement="top"
                                            title="${isVoided ? 'Dokumen telah di-void' : (isUploadDisabled ? uploadDisabledReason : 'Upload Dokumen')}">
                                        <i class="ti ti-upload"></i>
                                    </button>`;
                    }
                }
                
                // ==================================================
                // VOID CHECKBOX - Logic untuk RA
                // ==================================================
                // RA bisa mencentang void (enabled untuk RA, disabled untuk yang lain)
                // Exception: Guest selalu disabled
                var voidCheckboxDisabled = (isUserRA && !isGuest) ? '' : 'disabled';
                var voidCheckboxAttr = (isUserRA && !isGuest) ? 'onchange="RegalDetail.UpdateVoid(this)"' : '';
                
                // ==================================================
                // REVIEW RA DROPDOWN - Logic untuk RA
                // ==================================================
                // Untuk RA: Review RA Regis harus DISABLED (sesuai requirement)
                // Disabled jika: voided, Guest, atau user adalah RA
                var reviewSelectDisabled = '';
                if (isVoided || isGuest || isUserRA) {
                    reviewSelectDisabled = 'disabled';
                }
                var reviewSelectValue = isVoided ? '' : (doc.ReviewRa || '');
                
                // ==================================================
                // CATATAN INPUT - Logic untuk RA
                // ==================================================
                // Untuk RA: Catatan harus DISABLED (sesuai requirement)
                // Disabled jika: voided, Guest, atau user adalah RA
                var catatanInputDisabled = '';
                if (isVoided || isGuest || isUserRA) {
                    catatanInputDisabled = 'disabled';
                }

                // Task 1: Store file info in row data attributes for later use
                var hasFile = doc.FilePath ? 'true' : 'false';
                var filePath = doc.FilePath || '';
                var fileNameAlias = doc.FileNameAlias || '';
                
                var row = `
                    <tr data-doc-id="${doc.TxtId}" 
                        data-has-file="${hasFile}" 
                        data-file-path="${encodeURIComponent(filePath)}" 
                        data-file-name-alias="${encodeURIComponent(fileNameAlias)}"
                        data-config-name="${encodeURIComponent(configName)}">
                        <td>${i + 1}</td>
                        <td>${configName}</td>
                        <td>${configPIC}</td>
                        <td>${uploadBtn}</td>
                        <td>
                            <select class="form-select review-ra-select" name="review_${i}" data-doc-id="${doc.TxtId}" ${reviewSelectDisabled} onchange="RegalDetail.HandleDocumentChange(this)">
                                <option value="">-</option>
                                <option value="OK" ${reviewSelectValue === 'OK' ? 'selected' : ''}>OK</option>
                                <option value="Need Revise" ${reviewSelectValue === 'Need Revise' ? 'selected' : ''}>Need Revise</option>
                            </select>
                        </td>
                        <td>
                            <input type="text" class="form-control catatan-input" placeholder="Freetext" value="${doc.Catatan || ''}" 
                                   data-doc-id="${doc.TxtId}" ${catatanInputDisabled} onchange="RegalDetail.HandleDocumentChange(this)">
                        </td>
                        <td class="text-center">
                            <input class="form-check-input void-checkbox" type="checkbox" data-doc-id="${doc.TxtId}" 
                                   style="width: 1.25em; height: 1.25em;" ${isVoided ? 'checked' : ''} 
                                   ${voidCheckboxDisabled} ${voidCheckboxAttr}>
                        </td>
                    </tr>
                `;
                
                tbody.append(row);
            }
            console.log("Documents bound successfully");
            
            // Initialize tooltips after rendering
            $('#tblDokumenRegistrasi [data-bs-toggle="tooltip"]').tooltip();
            
            // Re-apply role restrictions to dynamically generated elements for Guest
            // This ensures buttons/inputs in document table respect role access
            if (isGuest) {
                console.log("BindDocuments: Applying strict Guest restrictions to document table elements");
                // Disable inputs and selects in the document table for Guest
                $('#tblDokumenRegistrasi input, #tblDokumenRegistrasi select').prop('disabled', true);
                // Hide any buttons that might have been rendered (shouldn't happen for Guest, but just in case)
                $('#tblDokumenRegistrasi button').hide();
            }
        } else {
            console.warn("No documents to bind");
            tbody.append('<tr><td colspan="7" class="text-center">Tidak ada dokumen</td></tr>');
        }
    },

    f_UpdateFinalLabelUI: function (filePath, fileNameAlias) {
        var safePath = (filePath || '').trim();
        var aliasName = (fileNameAlias || '').trim();
        var downloadName = aliasName || 'FinalLabel';

        if (safePath !== '') {
            $('#finalLabelUploadGroup').hide();
            $('#finalLabelPreviewGroup').show();
            $('#btnPreviewFinalLabel').attr('href', safePath);
            $('#btnPreviewFinalLabel').attr('download', downloadName);
        } else {
            $('#finalLabelUploadGroup').show();
            $('#finalLabelPreviewGroup').hide();
            $('#btnPreviewFinalLabel').attr('href', '#');
            $('#btnPreviewFinalLabel').removeAttr('download');
            $('#finalLabelFile').val(null);
        }
    },

    f_UpdateFinalLabelStatusUI: function (data) {
        console.log("f_UpdateFinalLabelStatusUI called with:", data);
        console.log("f_UpdateFinalLabelStatusUI data type:", typeof data);
        console.log("f_UpdateFinalLabelStatusUI data keys:", data ? Object.keys(data) : "null");

        try {
            if (!data) {
                console.warn("Data is null or undefined in f_UpdateFinalLabelStatusUI");
                return;
            }

            // Extract header data FIRST - handle multiple possible structures
            // Kita perlu statusFinalLabel untuk menentukan logika RA
            let header = null;

            // Case 1: data has Header property (from BindData or structured response)
            if (data.Header && typeof data.Header === 'object') {
                console.log("f_UpdateFinalLabelStatusUI: Using data.Header");
                header = data.Header;
            }
            // Case 2: data has updatedHeader property (from AJAX response)
            else if (data.updatedHeader && typeof data.updatedHeader === 'object') {
                console.log("f_UpdateFinalLabelStatusUI: Using data.updatedHeader");
                header = data.updatedHeader;
            }
            // Case 3: data itself is the header object
            else if (data.statusFinalLabel !== undefined || data.StatusFinalLabel !== undefined || data.TxtId !== undefined) {
                console.log("f_UpdateFinalLabelStatusUI: Using data itself as header");
                header = data;
            }

            if (!header) {
                console.error("No header data found in f_UpdateFinalLabelStatusUI. Data structure:", JSON.stringify(data, null, 2));
                return;
            }

            // Handle both camelCase (from JSON) and PascalCase (from C# Model)
            const statusFinalLabel = header.statusFinalLabel || header.StatusFinalLabel || 'DRAFT';
            console.log("f_UpdateFinalLabelStatusUI: Final statusFinalLabel value:", statusFinalLabel);

            // Update Status Display
            const statusDisplayMap = {
                'DRAFT': 'Draft',
                'WAITING_APPROVAL': 'Waiting Approval',
                'NEED_REVISION': 'Revise', // Status backend: NEED_REVISION, Display: Revise
                'FINAL_APPROVED': 'Final Approved'
            };
            const statusDisplay = statusDisplayMap[statusFinalLabel.toUpperCase()] || statusFinalLabel;
            $('#statusFinalLabelDisplay').val(statusDisplay);

            // ==================================================
            // CEK ROLE DAN STATUS UNTUK LOGIKA SPESIFIK
            // ==================================================
            const statusUpper = statusFinalLabel ? statusFinalLabel.toUpperCase() : '';
            const normalizedRole = RegalDetail.f_NormalizeRole(currentUserRoleCode);
            const isRA = (normalizedRole === 'RA' || isUserRA) && !isGuest;
            const isRADraftRevise = isRA && (statusUpper === 'DRAFT' || statusUpper === 'NEED_REVISION');
            
            // ==================================================
            // LOGIKA UNTUK RA DENGAN STATUS DRAFT/NEED_REVISION
            // ==================================================
            // RA dengan status DRAFT/NEED_REVISION: hide semua button dan disable semua input di Final Label tab
            // Note: Status backend menggunakan "NEED_REVISION", bukan "REVISE"
            if (isRADraftRevise) {
                console.log("f_UpdateFinalLabelStatusUI: User is RA with DRAFT/NEED_REVISION status, applying RA-specific rules for Final Label tab");
                // Hide semua button di tab Final Label
                $('#btnRequestReviewLabel, #btnOpenManageFinalLabelModal').hide().addClass('d-none');
                $('#btnSubmitLabel_RA, #btnSubmitLabel_PD, #btnSubmitLabel_PKG').hide().addClass('d-none');
                // Disable semua input di tab Final Label
                $('#approval_ra, #approval_pd, #approval_pkg').prop('disabled', true);
                $('#notes_ra, #notes_pd, #notes_pkg').prop('disabled', true);
                $('#approval_ra_date, #approval_pd_date, #approval_pkg_date').prop('disabled', true);
            }
            
            // ==================================================
            // KONTROL VISIBILITAS: Tombol "Request review Label"
            // ==================================================
            // Tombol hanya muncul jika:
            // 1. Status adalah DRAFT atau NEED_REVISION
            // 2. User bukan Guest
            // 3. User bukan RA dengan status DRAFT/NEED_REVISION
            // Note: Status backend menggunakan "NEED_REVISION", bukan "REVISE"
            const showRequestButton = (statusUpper === 'DRAFT' || statusUpper === 'NEED_REVISION') && !isGuest && !isRADraftRevise;

            const $btnRequestReviewLabel = $('#btnRequestReviewLabel');
            if ($btnRequestReviewLabel.length === 0) {
                console.warn("f_UpdateFinalLabelStatusUI: #btnRequestReviewLabel element not found!");
            } else {
                // ===================================================
                // --- Task 2: CRITICAL FIX - Triple Check Strategy ---
                // Tombol hanya muncul jika Status valid DAN !isGuest
                // ===================================================
                if (showRequestButton && !isGuest) {
                    console.log("f_UpdateFinalLabelStatusUI: Showing #btnRequestReviewLabel (status OK and not Guest)");
                    $btnRequestReviewLabel.removeClass('d-none').show();
                } else {
                    console.log("f_UpdateFinalLabelStatusUI: Hiding #btnRequestReviewLabel (isGuest or status not valid)");
                    $btnRequestReviewLabel.addClass('d-none').hide();
                }
                // ===================================================
            }

            // ==================================================
            // KONTROL ENABLE/DISABLE APPROVAL CARDS
            // ==================================================
            const isWaitingApproval = statusFinalLabel && statusFinalLabel.toUpperCase() === 'WAITING_APPROVAL';
            
            // Untuk RA dengan status DRAFT/NEED_REVISION: semua approval cards harus disabled
            // Untuk yang lain: enable hanya jika status WAITING_APPROVAL
            // Note: Status backend menggunakan "NEED_REVISION", bukan "REVISE"
            const shouldEnableApprovalCards = isWaitingApproval && !isRADraftRevise;

            // RA Card
            $('#approval_ra').prop('disabled', !shouldEnableApprovalCards);
            $('#notes_ra').prop('disabled', !shouldEnableApprovalCards);
            $('#btnSubmitLabel_RA').prop('disabled', !shouldEnableApprovalCards);

            // PD Card
            $('#approval_pd').prop('disabled', !shouldEnableApprovalCards);
            $('#notes_pd').prop('disabled', !shouldEnableApprovalCards);
            $('#btnSubmitLabel_PD').prop('disabled', !shouldEnableApprovalCards);

            // PKG Card
            $('#approval_pkg').prop('disabled', !shouldEnableApprovalCards);
            $('#notes_pkg').prop('disabled', !shouldEnableApprovalCards);
            $('#btnSubmitLabel_PKG').prop('disabled', !shouldEnableApprovalCards);

            // Update nilai cards jika finalLabelData ada
            const finalLabelData = data?.FinalLabel || data?.updatedFinalLabel || data?.finalLabelData;
            if (finalLabelData) {
                $('#approval_ra').val(finalLabelData.ApprovalRaStatus || finalLabelData.ApprovalRa || '');
                $('#approval_ra_date').val(formatDateForInput(finalLabelData.ApprovalRaDate));
                $('#notes_ra').val(finalLabelData.NotesRa || '');

                $('#approval_pd').val(finalLabelData.ApprovalPdStatus || finalLabelData.ApprovalPd || '');
                $('#approval_pd_date').val(formatDateForInput(finalLabelData.ApprovalPdDate));
                $('#notes_pd').val(finalLabelData.NotesPd || '');

                $('#approval_pkg').val(finalLabelData.ApprovalPkgStatus || finalLabelData.ApprovalPkg || '');
                $('#approval_pkg_date').val(formatDateForInput(finalLabelData.ApprovalPkgDate));
                $('#notes_pkg').val(finalLabelData.NotesPkg || '');
            }
        } catch (e) {
            console.error("Error in f_UpdateFinalLabelStatusUI:", e);
        }
    },

    BindStatusHistory: function (histories) {
        var table = $('#tblStatusHistory');
        if (!table.length) {
            return;
        }

        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().destroy();
        }

        var tbody = table.find('tbody');
        tbody.empty();

        if (histories && histories.length > 0) {
            histories.forEach(function (item) {
                var createdDateText = item.CreatedDate ? moment(item.CreatedDate).format('DD MMM YYYY HH:mm') : '';
                var statusDescription = RegalDetail.HtmlEncode(item.StatusDescription || '');
                var notesDescription = RegalDetail.HtmlEncode(item.Notes || '');
                var creationDisplay = RegalDetail.HtmlEncode(item.CreationDisplay || '');

                var creationColumn = creationDisplay;
                if (createdDateText) {
                    creationColumn += `<div class="text-muted small">${createdDateText}</div>`;
                }

                var row = `
                    <tr>
                        <td>${item.No}</td>
                        <td>${statusDescription}</td>
                        <td>${notesDescription}</td>
                        <td>${creationColumn}</td>
                    </tr>`;

                tbody.append(row);
            });
        } else {
            tbody.append('<tr><td colspan="4" class="text-center text-muted">Belum ada history status</td></tr>');
        }

        table.DataTable({
            pageLength: 5,
            lengthMenu: [5, 10, 25, 50],
            destroy: true,
            ordering: false, 
            language: {
                paginate: {
                    previous: 'Sebelumnya',
                    next: 'Berikutnya'
                },
                lengthMenu: 'Tampilkan _MENU_ data',
                info: 'Menampilkan _START_ s/d _END_ dari _TOTAL_ data',
                infoEmpty: 'Menampilkan 0 dari 0 data',
                zeroRecords: 'Tidak ada data yang cocok'
            }
        });
    },

    ClearStatusHistory: function () {
        var table = $('#tblStatusHistory');
        if (!table.length) {
            return;
        }

        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().destroy();
        }

        var tbody = table.find('tbody');
        tbody.empty();
        tbody.append('<tr><td colspan="4" class="text-center text-muted">Belum ada history status</td></tr>');

        table.DataTable({
            pageLength: 5,
            lengthMenu: [5, 10, 25, 50],
            destroy: true,
            language: {
                paginate: {
                    previous: 'Sebelumnya',
                    next: 'Berikutnya'
                },
                lengthMenu: 'Tampilkan _MENU_ data',
                info: 'Menampilkan _START_ s/d _END_ dari _TOTAL_ data',
                infoEmpty: 'Menampilkan 0 dari 0 data',
                zeroRecords: 'Tidak ada data yang cocok'
            }
        });
    },

    ShowUploadModal: function (docId, index) {
        currentDocData = {
            TxtId: docId,
            Index: index
        };
        
        $('#hdDocData').val(JSON.stringify({TxtId: docId}));
        $('#UploadDocModal').modal('show');
    },

    // Task 1: Centralized handler for document changes (Review and Catatan)
    // REMOVED: Auto-save functionality - data will only be saved when main "Simpan" button is clicked
    // This function now only performs validation, no AJAX call
    HandleDocumentChange: function (element) {
        // Get parent row (tr) from the triggered element
        var $row = $(element).closest('tr');
        
        // Get BOTH values from the row (always get current values from DOM, not from element)
        var $reviewSelect = $row.find('select.review-ra-select');
        var $catatanInput = $row.find('input.catatan-input');
        
        var reviewValue = $reviewSelect.val() || '';
        var catatanValue = ($catatanInput.val() || '').trim();
        
        // Task 1: Validation - Check if "Need Revise" is selected but Catatan is empty
        if (reviewValue === 'Need Revise' && (!catatanValue || catatanValue === '')) {
            // Show warning and stop the process
            clsGlobal.swalWarning("Catatan wajib diisi jika status Need Revise.");
            
            // Focus to catatan input
            setTimeout(function() {
                $catatanInput.focus();
            }, 100);
            
            // Reset dropdown to "-" if it was just changed from select
            if ($(element).is('select') || $(element).hasClass('review-ra-select')) {
                $reviewSelect.val('');
            }
            
            // JANGAN panggil fungsi Save/AJAX - Berhenti di sini
            return;
        }
        
        // Task 1: REMOVED - No auto-save anymore
        // Data will be collected and saved when main "Simpan" button (#btnSaveRegalHeader) is clicked
        console.log(`HandleDocumentChange - Validation passed. Review: [${reviewValue}], Catatan: [${catatanValue}]. Data will be saved when main Save button is clicked.`);
    },

    // Keep UpdateReview for backward compatibility, but delegate to HandleDocumentChange
    UpdateReview: function (element) {
        RegalDetail.HandleDocumentChange(element);
    },

    // Keep UpdateCatatan for backward compatibility, but delegate to HandleDocumentChange
    UpdateCatatan: function (element) {
        RegalDetail.HandleDocumentChange(element);
    },

    UpdateVoid: function (element) {
        var docId = $(element).data('doc-id');
        var isVoid = $(element).is(':checked');
        
        // Task 2: Find all elements in the same row
        var $row = $(element).closest('tr');
        
        // Task 2: Find all elements that should be disabled/enabled
        var $uploadBtn = $row.find('td:eq(3) button'); // Upload/Preview button (column 3, 0-indexed)
        var $reviewSelect = $row.find('.review-ra-select'); // Review RA dropdown
        var $catatanInput = $row.find('.catatan-input'); // Catatan text input
        
        if (isVoid) {
            // Task 1: Void is checked - disable all elements in the row (but keep them visible)
            $uploadBtn.prop('disabled', true);
            $reviewSelect.prop('disabled', true);
            $reviewSelect.val(''); // Clear Review RA value
            $catatanInput.prop('disabled', true);
            
            // Task 1: Keep button visible - just disable it, don't change class or hide
            // Remove onclick handler from upload/preview button (but keep button visible)
            $uploadBtn.attr('onclick', '');
            $uploadBtn.attr('title', 'Dokumen telah di-void');
            
            // Task 1: Optional - add visual indicator that it's disabled but keep original class
            // Don't change button class, just ensure it's disabled
        } else {
            // Task 2: Void is unchecked - enable all elements in the row
            
            // Get file info from row data attributes
            var hasFile = $row.data('has-file') === true || $row.data('has-file') === 'true';
            var filePath = decodeURIComponent($row.data('file-path') || '');
            var fileNameAlias = decodeURIComponent($row.data('file-name-alias') || '');
            var configName = decodeURIComponent($row.data('config-name') || '');
            
            // Check if upload button should be enabled based on role and status
            var shouldEnableUpload = true;
            var uploadDisabledReason = '';
            
            if (isUserRA) {
                // User is RA: Disable upload if status is DRAFT or NEED_REVISION
                // Note: Status backend menggunakan "NEED_REVISION", bukan "REVISE"
                if (currentRegalStatus === 'DRAFT' || currentRegalStatus === 'NEED_REVISION') {
                    shouldEnableUpload = false;
                    uploadDisabledReason = 'Upload tidak dapat dilakukan pada status DRAFT/NEED_REVISION oleh user RA';
                }
            }
            
            // Task 1: Restore button state (keep visible, just enable/disable based on conditions)
            if (hasFile) {
                // File exists - restore preview button
                var encodedPaths = encodeURIComponent(filePath);
                var encodedNames = encodeURIComponent(fileNameAlias);
                var encodedConfigName = encodeURIComponent(configName);
                
                // Task 1: Restore button appearance but keep it visible
                $uploadBtn.removeClass('btn-secondary btn-outline-secondary').addClass('btn-success');
                $uploadBtn.html('<i class="ti ti-eye"></i>');
                $uploadBtn.attr('onclick', `RegalDetail.ShowPreviewModal('${encodedPaths}', '${encodedConfigName}', '${docId}', '${encodedNames}')`);
                
                if (shouldEnableUpload) {
                    $uploadBtn.prop('disabled', false);
                    $uploadBtn.attr('title', 'Pratinjau Dokumen');
                } else {
                    // Task 1: Disable but keep visible
                    $uploadBtn.prop('disabled', true);
                    $uploadBtn.attr('title', uploadDisabledReason);
                }
            } else {
                // No file - restore upload button
                // Find row index in table (not global index)
                var rowIndex = $row.closest('tbody').find('tr').index($row);
                
                // Task 1: Restore button appearance but keep it visible
                $uploadBtn.removeClass('btn-secondary btn-success').addClass('btn-outline-primary');
                $uploadBtn.html('<i class="ti ti-upload"></i>');
                $uploadBtn.attr('onclick', `RegalDetail.ShowUploadModal('${docId}', ${rowIndex})`);
                
                if (shouldEnableUpload) {
                    $uploadBtn.prop('disabled', false);
                    $uploadBtn.attr('title', 'Upload Dokumen');
                } else {
                    // Task 1: Disable but keep visible
                    $uploadBtn.prop('disabled', true);
                    $uploadBtn.attr('title', uploadDisabledReason);
                }
            }
            
            // Enable Review RA dropdown and Catatan input
            $reviewSelect.prop('disabled', false);
            $catatanInput.prop('disabled', false);
        }
        
        // Task 5: Save update to database - ONLY update IsVoid
        // DO NOT update ReviewRa or Catatan - they will be saved when main "Simpan" button is clicked
        var updateData = { IsVoid: isVoid };
        
        RegalDetail.SaveDocUpdate(docId, updateData);
    },

    SaveDocUpdate: function (docId, updateData) {
        console.log("SaveDocUpdate called for docId:", docId, "with data:", updateData);
        debugger;
        var data = {
            __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val(),
            TxtId: docId,
            RegistrasiHdrTxtId: $('#hdRegalId').val(),
            ...updateData
        };

        $.ajax({
            type: "POST",
            url: base_path + "/Regal/UpdateRegalDoc",
            data: data,
            datatype: "json",
            success: function (retDat, status, xhr) {
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        console.log("Document updated successfully");
                        // Success - silently update
                    }
                    else {
                        console.error("Update failed:", retDat);
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
                console.error("UpdateRegalDoc error:", xhr.status, xhr.responseText);
                clsGlobal.swalError(xhr.responseText || error);
            }
        });
    },

    GeneratePreviewUpload: function () {
        const $previewContainer = $('#modalShowFilePreview');
        $previewContainer.empty().hide();

        // Revoke old blob URLs
        if (currentPreviewBlobUrls.length > 0) {
            currentPreviewBlobUrls.forEach(url => URL.revokeObjectURL(url));
            currentPreviewBlobUrls = [];
        }

        // Get all selected files
        const fileInput = document.getElementById('fileDoc');
        const files = fileInput.files;
        
        if (!files || files.length === 0) {
            return; // No files selected
        }

        // Show container
        $previewContainer.show();
        $previewContainer.append(`<h5>Pratinjau (${files.length} file):</h5>`);

        // Loop through each file
        Array.from(files).forEach(file => {
            const fileName = file.name;
            const fileExtension = fileName.split('.').pop().toLowerCase();
            let $previewElement;

            // Create wrapper for each preview item
            const $fileWrapper = $(`
                <div class="file-preview-item mb-4 pb-3 border-bottom">
                    <strong>${fileName}</strong>
                </div>
            `);

            switch (fileExtension) {
                case "pdf":
                    const pdfBlobUrl = URL.createObjectURL(file);
                    currentPreviewBlobUrls.push(pdfBlobUrl);

                    $previewElement = $(`
                        <iframe 
                            src="${pdfBlobUrl}" 
                            style="width:100%; height:400px; border:1px solid #ddd; margin-top: 5px;" 
                            frameborder="0">
                        </iframe>
                    `);
                    $fileWrapper.append($previewElement);
                    break;

                case "png":
                case "jpg":
                case "jpeg":
                case "gif":
                case "svg":
                    const imgBlobUrl = URL.createObjectURL(file);
                    currentPreviewBlobUrls.push(imgBlobUrl);
                    $previewElement = $(`
                        <div class="preview-content" style="max-height: 400px; overflow: auto; margin-top: 5px;">
                            <img src="${imgBlobUrl}" style="max-width: 100%;" />
                        </div>
                    `);
                    $fileWrapper.append($previewElement);
                    break;

                case "docx":
                case "xlsx":
                    const reader = new FileReader();
                    $previewElement = $('<div class="preview-content preview-box" style="height: 400px; overflow-y: auto; margin-top: 5px; border: 1px solid #ddd; padding: 10px;">Memproses pratinjau...</div>');
                    $fileWrapper.append($previewElement);

                    reader.onload = function (e) {
                        const fileData = e.target.result;
                        $previewElement.empty();

                        if (fileExtension === "docx") {
                            RegalDetail.RenderDocx(fileData, $previewElement.get(0));
                        } else if (fileExtension === "xlsx") {
                            RegalDetail.RenderXlsx(fileData, $previewElement.get(0));
                        }
                    };

                    reader.onerror = function () {
                        $previewElement.html('<p class="text-danger">Gagal membaca file.</p>');
                    };

                    reader.readAsArrayBuffer(file);
                    break;

                default:
                    $previewElement = $(`<p class="text-muted mt-2">Pratinjau untuk '.${fileExtension}' tidak didukung.</p>`);
                    $fileWrapper.append($previewElement);
            }

            // Append file wrapper to container
            $previewContainer.append($fileWrapper);
        });
    },

    EmptyPreview: function () {
        $("#modalShowFilePreview").empty().hide();
        
        // Revoke all blob URLs
        if (currentPreviewBlobUrls.length > 0) {
            currentPreviewBlobUrls.forEach(url => URL.revokeObjectURL(url));
            currentPreviewBlobUrls = [];
        }
    },

    RenderDocx: function (source, containerElement) {
        // Display loading message
        $(containerElement).html('<p class="text-center p-5">Memuat pratinjau...</p>');

        const render = (data) => {
            $(containerElement).empty();

            // Check if docx library is available
            if (typeof docx === 'undefined') {
                $(containerElement).html('<p class="text-danger">Library DOCX tidak tersedia. Silahkan tambahkan library docx.js</p>');
                return;
            }

            docx.renderAsync(data, containerElement)
                .catch(err => {
                    console.error('Error during docx.renderAsync:', err);
                    $(containerElement).html(`<p class="text-danger">Gagal merender file DOCX.</p>`);
                });
        };

        if (typeof source === 'string') {
            // Source is URL
            fetch(source)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.blob();
                })
                .then(blob => {
                    render(blob);
                })
                .catch(err => {
                    console.error('Error fetching/rendering DOCX:', err);
                    $(containerElement).html(`<p class="text-danger">Gagal memuat pratinjau.</p>`);
                });
        } else if (source instanceof Blob || source instanceof ArrayBuffer) {
            // Source is already data
            try {
                render(source);
            } catch (err) {
                console.error('Error rendering local DOCX:', err);
                $(containerElement).html(`<p class="text-danger">Gagal merender file DOCX lokal.</p>`);
            }
        } else {
            console.error('Invalid source type for RenderDocx:', source);
            $(containerElement).html(`<p class="text-danger">Sumber data pratinjau tidak dikenali.</p>`);
        }
    },

    RenderXlsx: function (source, containerElement) {
        // Display loading message
        $(containerElement).html('<p class="text-center p-5">Memuat pratinjau Excel...</p>');

        const render = (arrayBufferData) => {
            try {
                // Check if XLSX library is available
                if (typeof XLSX === 'undefined') {
                    $(containerElement).html('<p class="text-danger">Library XLSX tidak tersedia. Silahkan tambahkan library xlsx.js</p>');
                    return;
                }

                const workbook = XLSX.read(arrayBufferData, { type: 'array' });
                let finalHtml = '';

                workbook.SheetNames.forEach(sheetName => {
                    const worksheet = workbook.Sheets[sheetName];
                    const htmlTable = XLSX.utils.sheet_to_html(worksheet);

                    finalHtml += `<h4>Sheet: ${sheetName}</h4>`;
                    finalHtml += htmlTable;
                    finalHtml += '<hr>';
                });

                $(containerElement).html(finalHtml);
                $(containerElement).find('table').addClass('table table-bordered table-sm');

            } catch (err) {
                console.error('Error during XLSX.read/render:', err);
                $(containerElement).html(`<p class="text-danger">Gagal merender file Excel.</p>`);
            }
        };

        if (typeof source === 'string') {
            // Source is URL
            fetch(source)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.arrayBuffer();
                })
                .then(data => {
                    render(data);
                })
                .catch(err => {
                    console.error('Error fetching XLSX:', err);
                    $(containerElement).html(`<p class="text-danger">Gagal memuat pratinjau Excel.</p>`);
                });
        } else if (source instanceof ArrayBuffer) {
            // Source is already ArrayBuffer
            try {
                render(source);
            } catch (err) {
                console.error('Error rendering local XLSX (ArrayBuffer):', err);
                $(containerElement).html(`<p class="text-danger">Gagal merender file Excel lokal.</p>`);
            }
        } else if (source instanceof Blob) {
            // Source is Blob, convert to ArrayBuffer
            source.arrayBuffer()
                .then(arrayBuffer => {
                    render(arrayBuffer);
                })
                .catch(err => {
                    console.error('Error converting Blob to ArrayBuffer:', err);
                    $(containerElement).html(`<p class="text-danger">Gagal membaca data file Blob.</p>`);
                });
        } else {
            console.error('Invalid source type for RenderXlsx:', source);
            $(containerElement).html(`<p class="text-danger">Sumber data pratinjau tidak dikenali.</p>`);
        }
    },

    ShowPreviewModal: function (encodedFilePaths, encodedDocumentName, documentId, encodedFileNames, hideActions) {
        const filePaths = decodeURIComponentSafe(encodedFilePaths || '');
        const documentName = decodeURIComponentSafe(encodedDocumentName || '');
        const fileNamesRaw = decodeURIComponentSafe(encodedFileNames || '');
        const shouldHideActions = hideActions === true; // Default false jika tidak diisi

        console.log("ShowPreviewModal called with:", filePaths);
        
        // Parse multiple file paths (separated by |)
        const filePathArray = filePaths.split('|').map(path => path.trim()).filter(path => path);
        const fileNameArray = fileNamesRaw
            ? fileNamesRaw.split('|').map(name => name.trim())
            : [];
        
        if (filePathArray.length === 0) {
            clsGlobal.swalWarning("Tidak ada file untuk ditampilkan");
            return;
        }

        // Clear preview container
        const $previewContainer = $('#modalShowFilePreviewUploaded');
        $previewContainer.empty();

        // Update modal title if document name provided
        if (documentName) {
            $('#ShowPreviewFileModalLabel').text(`Pratinjau File - ${documentName}`);
        } else {
            $('#ShowPreviewFileModalLabel').text('Pratinjau File');
        }

        // Show file count
        $previewContainer.append(`<h5>Total ${filePathArray.length} file:</h5>`);

        // Loop through each file path
        filePathArray.forEach((filePath, index) => {
            const fileName = filePath.split('/').pop(); // Get filename from URL
            const aliasName = fileNameArray[index] || fileName;
            const displayName = aliasName || fileName;
            const encodedDisplayName = RegalDetail.HtmlEncode(displayName);
            const fileExtension = fileName.split('.').pop().toLowerCase();
            let $previewElement;

            // Create wrapper for each file preview
            const $fileWrapper = $(`
                <div class="file-preview-item mb-4 pb-4 border-bottom">
                    <strong>File ${index + 1}: ${encodedDisplayName}</strong>
                </div>
            `);

            switch (fileExtension) {
                case "pdf":
                    $previewElement = $(`
                        <iframe 
                            src="${filePath}" 
                            style="width:100%; height:500px; border:1px solid #ddd; margin-top: 10px;" 
                            frameborder="0">
                        </iframe>
                    `);
                    $fileWrapper.append($previewElement);
                    break;

                case "png":
                case "jpg":
                case "jpeg":
                case "gif":
                case "svg":
                    $previewElement = $(`
                        <div class="preview-content" style="max-height: 500px; overflow: auto; margin-top: 10px; text-align: center;">
                            <img src="${filePath}" style="max-width: 100%; border: 1px solid #ddd;" />
                        </div>
                    `);
                    $fileWrapper.append($previewElement);
                    break;

                case "docx":
                    $previewElement = $('<div class="preview-content preview-box" style="height: 500px; overflow-y: auto; margin-top: 10px; border: 1px solid #ddd; padding: 10px;">Memuat pratinjau DOCX...</div>');
                    $fileWrapper.append($previewElement);
                    RegalDetail.RenderDocx(filePath, $previewElement.get(0));
                    break;

                case "xlsx":
                    $previewElement = $('<div class="preview-content preview-box" style="height: 500px; overflow-y: auto; margin-top: 10px; border: 1px solid #ddd; padding: 10px;">Memuat pratinjau Excel...</div>');
                    $fileWrapper.append($previewElement);
                    RegalDetail.RenderXlsx(filePath, $previewElement.get(0));
                    break;

                default:
                    let defaultContent = `<p class="text-muted mt-2">Pratinjau untuk '.${fileExtension}' tidak didukung.</p>`;
                    if (!shouldHideActions) {
                        defaultContent += `<a href="${filePath}" target="_blank" class="btn btn-info btn-sm mt-2" download="${encodedDisplayName}">
                            <i class="ti ti-download me-1"></i>Download
                        </a>`;
                    }
                    $previewElement = $(defaultContent);
                    $fileWrapper.append($previewElement);
            }

            // Hanya tampilkan tombol Download dan Delete jika hideActions = false
            if (!shouldHideActions) {
                const actionWrapper = $(`
                    <div class="mt-3 d-flex gap-2">
                        <a href="${filePath}" class="btn btn-info btn-sm" download="${encodedDisplayName}">
                            <i class="ti ti-download me-1"></i>Download
                        </a>
                        <button type="button"
                                class="btn btn-danger btn-sm btn-delete-preview-doc"
                                data-doc-id="${documentId || ''}"
                                data-file-path="${RegalDetail.HtmlEncode(filePath)}">
                            <i class="ti ti-trash me-1"></i>Delete
                        </button>
                    </div>
                `);

                $fileWrapper.append(actionWrapper);
            }

            // Append to container
            $previewContainer.append($fileWrapper);
        });

        // Show modal
        $('#ShowPreviewFileModal').modal('show');
    },

    RefreshDocumentListOnly: function (regalHdrTxtId, showWarning) {
        console.log("Refreshing document list only for:", regalHdrTxtId);

        if (!regalHdrTxtId) {
            return;
        }

        // Task 5: Show warning if there are unsaved changes (Review/Catatan)
        // showWarning is optional parameter - if true, show warning about unsaved data
        if (showWarning !== false) {
            // Check if there are any unsaved changes in Review or Catatan fields
            var hasUnsavedChanges = false;
            $('#tblDokumenRegistrasi tbody tr').each(function() {
                var $row = $(this);
                var $reviewSelect = $row.find('.review-ra-select');
                var $catatanInput = $row.find('.catatan-input');
                
                // Skip if row is empty or voided
                if ($row.find('td').length === 0 || $row.text().trim() === 'Tidak ada dokumen' || $reviewSelect.prop('disabled')) {
                    return;
                }
                
                // Check if Review or Catatan has been modified (has value)
                var reviewValue = $reviewSelect.val() || '';
                var catatanValue = ($catatanInput.val() || '').trim();
                
                if (reviewValue || catatanValue) {
                    hasUnsavedChanges = true;
                    return false; // Break loop
                }
            });
            
            if (hasUnsavedChanges) {
                // Show warning but continue with refresh
                console.warn("RefreshDocumentListOnly - Warning: There are unsaved Review/Catatan changes that will be lost after refresh");
                // Note: We don't block the refresh, just log a warning
                // The data will be refreshed from backend, so unsaved changes will be lost
            }
        }

        // Tampilkan loading sederhana di tabel (opsional)
        $('#tblDokumenRegistrasi tbody').html('<tr><td colspan="7" class="text-center"><i class="ti ti-loader-2 ti-spin"></i> Memuat ulang data...</td></tr>');

        $.ajax({
            type: "GET",
            url: base_path + "/Regal/GetRegalDocuments", // Endpoint ini sudah benar
            data: { regalHdrTxtId: regalHdrTxtId },
            success: function (response) {
                // Task 1: Update user info if available in response
                if (response && response.userInfo) {
                    var userInfo = response.userInfo;
                    isUserRA = userInfo.IsRA || false;
                    // Update role code if available
                    if (userInfo.Department || userInfo.department) {
                        currentUserRoleCode = userInfo.Department || userInfo.department;
                    }
                    console.log("User info updated from GetRegalDocuments:", userInfo);
                    console.log("Is user RA:", isUserRA);
                }

                if (response && response.success && response.data && Array.isArray(response.data)) {
                    // Jika sukses DAN ada .data DAN .data adalah array
                    RegalDetail.BindDocuments(response.data);
                } else {
                    // Jika backend merespons { success: false } atau data-nya kosong
                    console.warn("GetRegalDocuments returned success=false or no data:", response.message);
                    RegalDetail.BindDocuments([]); // Kosongkan tabel
                }

            },
            error: function (xhr) {
                console.error("Failed to refresh document list:", xhr.responseText);
                clsGlobal.swalError("Gagal me-refresh daftar dokumen.");
            }
        });
    },

    RefreshFinalLabelTabOnly: function (regalHdrTxtId) {
        console.log("Refreshing Final Label tab only for:", regalHdrTxtId);

        if (!regalHdrTxtId) {
            console.warn("RefreshFinalLabelTabOnly: regalHdrTxtId is empty");
            return;
        }

        $.ajax({
            type: "POST",
            url: base_path + "/Regal/GetRegalById",
            data: {
                __RequestVerificationToken: getAntiForgeryToken(),
                id: regalHdrTxtId
            },
            success: function (response, status, xhr) {
                console.log("RefreshFinalLabelTabOnly success response:", response);

                if (xhr.responseText && xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("Sesi Anda telah berakhir, silakan login kembali", window.location.href);
                    return;
                }

                if (response && response.bitSuccess && response.objData) {
                    try {
                        // Parse JSON string (backend mengembalikan objData sebagai JSON string)
                        let data = response.objData;
                        if (typeof data === 'string') {
                            data = JSON.parse(data);
                        }

                        // Task 1: Update user info if available
                        if (data && data.UserInfo) {
                            var userInfo = data.UserInfo;
                            isUserRA = userInfo.IsRA || false;
                            console.log("User info updated from refresh:", userInfo);
                            console.log("Is user RA:", isUserRA);
                        }

                        if (data && data.Header && data.FinalLabel) {
                            // Update tab Final Label dengan data terbaru
                            RegalDetail.BindFinalLabelTabOnly(data.Header, data.FinalLabel);
                            RegalDetail.f_UpdateFinalLabelStatusUI({
                                Header: data.Header,
                                FinalLabel: data.FinalLabel
                            });
                            console.log("Final Label tab refreshed successfully");
                        } else {
                            console.warn("RefreshFinalLabelTabOnly: Missing Header or FinalLabel in response", data);
                        }
                    } catch (parseError) {
                        console.error("Error parsing response in RefreshFinalLabelTabOnly:", parseError);
                        console.error("Response objData:", response.objData);
                    }
                } else {
                    console.warn("RefreshFinalLabelTabOnly: Response not successful or no data", response);
                }
            },
            error: function (xhr) {
                console.error("Failed to refresh Final Label tab:", xhr.responseText);
                // Don't show error to user, just log it
            }
        });
    },

    BindFinalLabelTabOnly: function (headerData, finalLabelData) {
        console.log("BindFinalLabelTabOnly called with:", headerData, finalLabelData);

        if (!headerData) {
            console.warn("HeaderData is null or undefined in BindFinalLabelTabOnly");
            return;
        }

        try {
            // Update Status Display
            // Handle both camelCase (from JSON) and PascalCase (from C# Model)
            const statusFinalLabel = headerData.statusFinalLabel || headerData.StatusFinalLabel || 'DRAFT';
            const statusDisplayMap = {
                'DRAFT': 'Draft',
                'WAITING_APPROVAL': 'Waiting Approval',
                'NEED_REVISION': 'Revise',
                'FINAL_APPROVED': 'Final Approved'
            };
            const statusDisplay = statusDisplayMap[statusFinalLabel.toUpperCase()] || statusFinalLabel;
            $('#statusFinalLabelDisplay').val(statusDisplay);

            // Kontrol Visibilitas: Tombol "Request review Label" hanya muncul jika status = "DRAFT" atau "NEED_REVISION"
            const showRequestButton = statusFinalLabel && 
                (statusFinalLabel.toUpperCase() === 'DRAFT' || statusFinalLabel.toUpperCase() === 'NEED_REVISION');
            
            if (showRequestButton) {
                $('#btnRequestReviewLabel').show();
            } else {
                $('#btnRequestReviewLabel').hide();
            }

            // Kontrol Enable/Disable Card berdasarkan status
            const isWaitingApproval = statusFinalLabel && statusFinalLabel.toUpperCase() === 'WAITING_APPROVAL';
            
            // RA Card
            $('#approval_ra').prop('disabled', !isWaitingApproval);
            $('#notes_ra').prop('disabled', !isWaitingApproval);
            $('#btnSubmitLabel_RA').prop('disabled', !isWaitingApproval);
            
            // PD Card
            $('#approval_pd').prop('disabled', !isWaitingApproval);
            $('#notes_pd').prop('disabled', !isWaitingApproval);
            $('#btnSubmitLabel_PD').prop('disabled', !isWaitingApproval);
            
            // PKG Card
            $('#approval_pkg').prop('disabled', !isWaitingApproval);
            $('#notes_pkg').prop('disabled', !isWaitingApproval);
            $('#btnSubmitLabel_PKG').prop('disabled', !isWaitingApproval);

            // Isi Ulang Nilai Card jika finalLabelData ada
            if (finalLabelData) {
                $('#approval_ra').val(finalLabelData.ApprovalRaStatus || finalLabelData.ApprovalRa || '');
                $('#approval_ra_date').val(formatDateForInput(finalLabelData.ApprovalRaDate));
                $('#notes_ra').val(finalLabelData.NotesRa || '');
                
                $('#approval_pd').val(finalLabelData.ApprovalPdStatus || finalLabelData.ApprovalPd || '');
                $('#approval_pd_date').val(formatDateForInput(finalLabelData.ApprovalPdDate));
                $('#notes_pd').val(finalLabelData.NotesPd || '');
                
                $('#approval_pkg').val(finalLabelData.ApprovalPkgStatus || finalLabelData.ApprovalPkg || '');
                $('#approval_pkg_date').val(formatDateForInput(finalLabelData.ApprovalPkgDate));
                $('#notes_pkg').val(finalLabelData.NotesPkg || '');
            }
        } catch (e) {
            console.error("Error in BindFinalLabelTabOnly:", e);
        }
    },

    // Helper function to check if a role is in the allowed list
    f_IsAllowedRole: function (userDept) {
        const role = (userDept || '').toUpperCase().trim();
        const allowedRoles = ['RA', 'BD', 'PCD', 'PDV', 'RAOSS'];
        
        // Normalize role - handle variations like "PIC_RA_OSS" -> "RAOSS"
        let normalizedRole = role;
        if (role.includes('RA') && role.includes('OSS')) {
            normalizedRole = 'RAOSS';
        } else if (role.includes('REGULATORY') || role === 'RA') {
            normalizedRole = 'RA';
        } else if (role.includes('PACKAGING') || role === 'PCD') {
            normalizedRole = 'PCD';
        } else if (role.includes('PRODUCT') || role === 'PDV') {
            normalizedRole = 'PDV';
        } else if (role === 'BD') {
            normalizedRole = 'BD';
        }
        
        return allowedRoles.includes(normalizedRole);
    },

    // Helper function to normalize role code to standard role name
    // Contoh: "PIC_RA_OSS" -> "RAOSS", "REGULATORY" -> "RA"
    f_NormalizeRole: function (userDept) {
        const role = (userDept || '').toUpperCase().trim();
        
        if (role.includes('RA') && role.includes('OSS')) {
            return 'RAOSS';
        } else if (role.includes('REGULATORY') || role === 'RA') {
            return 'RA';
        } else if (role.includes('PACKAGING') || role === 'PCD') {
            return 'PCD';
        } else if (role.includes('PRODUCT') || role === 'PDV') {
            return 'PDV';
        } else if (role === 'BD') {
            return 'BD';
        }
        
        return role; // Return as-is if not recognized
    },

    // Helper function to check if current status is DRAFT or NEED_REVISION
    // Return: true jika status adalah DRAFT atau NEED_REVISION, false jika tidak
    // Note: Status backend menggunakan "NEED_REVISION", bukan "REVISE"
    f_IsDraftOrReviseStatus: function () {
        const status = (currentRegalStatus || '').toUpperCase();
        return status === 'DRAFT' || status === 'NEED_REVISION';
    },

    // ==================================================
    // FUNGSI UNTUK ROLE RA (Regulatory Affair)
    // ==================================================
    // Fungsi ini mengatur akses untuk user dengan role RA
    // ketika status registrasi adalah DRAFT atau NEED_REVISION
    // Note: Status backend menggunakan "NEED_REVISION", bukan "REVISE"
    // ==================================================
    f_ApplyRARoleAccess: function () {
        console.log("f_ApplyRARoleAccess: Applying RA role access rules");
        
        // Cek apakah status adalah DRAFT atau NEED_REVISION
        // Jika bukan DRAFT/NEED_REVISION, gunakan default access (tidak ada perubahan khusus)
        if (!RegalDetail.f_IsDraftOrReviseStatus()) {
            console.log("f_ApplyRARoleAccess: Status is not DRAFT/NEED_REVISION, skipping RA-specific rules");
            return; // Keluar dari fungsi, biarkan default access berlaku
        }
        
        console.log("f_ApplyRARoleAccess: Status is DRAFT or NEED_REVISION, applying RA-specific rules");
        
        // ==================================================
        // ATURAN KETAT: TOMBOL VISIBILITY UNTUK RA
        // ==================================================
        // Kondisi: User = RA DAN Status = DRAFT atau NEED_REVISION
        // Aturan ini MENIMPA (override) aturan default lainnya
        // Note: Status backend menggunakan "NEED_REVISION", bukan "REVISE"
        // ==================================================
        
        // LANGKAH 1: HIDE semua tombol yang TIDAK diizinkan TERLEBIH DAHULU
        // Ini memastikan logika ini menimpa aturan default lainnya
        // Tombol yang WAJIB HILANG:
        $('#btnOSSRequestVerfor').hide().addClass('d-none'); // Request Verfor - WAJIB HILANG
        $('#btnOSSApprove').hide().addClass('d-none'); // Approve - WAJIB HILANG
        $('#btnOSSReturn').hide().addClass('d-none'); // Return for Revision - WAJIB HILANG
        $('#btnRequestIDOSS').hide().addClass('d-none'); // Request ID OSS - WAJIB HILANG
        $('#btnSimpanIDOSS').hide().addClass('d-none'); // Simpan OSS - WAJIB HILANG
        
        // LANGKAH 2: SHOW hanya tombol yang diizinkan
        // Tombol yang WAJIB MUNCUL (hanya 2 tombol):
        $('#btnSaveRegalHeader').show().removeClass('d-none'); // Simpan - WAJIB MUNCUL
        $('#btnOSSSubmit').show().removeClass('d-none'); // Submit - WAJIB MUNCUL
        
        // ==================================================
        // TAB 1: 'Permintaan Doc Registrasi'
        // ==================================================
        
        // --- BAGIAN 1: Identitas Produk ---
        // Enable input fields yang diizinkan untuk RA
        $('#verforNo').prop('disabled', false); // Verfor No - ENABLED
        $('#kbli').prop('disabled', false); // KBLI - ENABLED
        $('#nomorIzinEdar').prop('disabled', false); // Nomor izin edar existing - ENABLED
        
        // Show tombol search untuk input yang enabled (jika ada)
        $('#btnSearchVerforNo, #btnSearchKbli, #btnSearchNomorIzinEdar').prop('disabled', false).show();
        
        // Catatan: Aturan ketat untuk tombol visibility sudah diterapkan di awal fungsi
        // untuk memastikan logika ini menimpa aturan default
        
        // --- BAGIAN 2: PIC ---
        // Enable PIC RA OSS input
        $('#picRAOSS').prop('disabled', false); // PIC RA OSS - ENABLED
        $('#btnSearchPicRaOss').prop('disabled', false).show(); // Show tombol search PIC RA OSS
        
        // Catatan: Input lainnya yang tidak disebutkan di requirement tetap disabled (default behavior)
        // Contoh: projectNo, projectType, jenisRegistrasi, dll tetap disabled
        
        // --- BAGIAN 3: DOKUMEN REGISTRASI ---
        // Enable Void checkbox (RA bisa mencentang void)
        // Note: Void checkbox akan di-enable di BindDocuments berdasarkan isUserRA
        
        // Hide button upload di tabel dokumen
        // Note: Upload button akan di-hide di BindDocuments untuk RA
        
        // Disable Review RA Regis dan Catatan di tabel dokumen
        // Note: Ini akan di-disable di BindDocuments untuk RA (kecuali void checkbox)
        
        // ==================================================
        // TAB 2: 'Final Label'
        // ==================================================
        // Hidden semua button di tab Final Label
        $('#btnRequestReviewLabel, #btnOpenManageFinalLabelModal').hide();
        $('#btnSubmitLabel_RA, #btnSubmitLabel_PD, #btnSubmitLabel_PKG').hide();
        
        // Disable semua text input di tab Final Label
        $('#approval_ra, #approval_pd, #approval_pkg').prop('disabled', true);
        $('#notes_ra, #notes_pd, #notes_pkg').prop('disabled', true);
        $('#approval_ra_date, #approval_pd_date, #approval_pkg_date').prop('disabled', true);
        
        // Exception: Accordion tetap enabled (bisa dibuka/ditutup untuk melihat data)
        // Tidak perlu diubah karena accordion button sudah aktif secara default
        
        // ==================================================
        // TAB 3: 'OSS'
        // ==================================================
        // ATURAN KETAT: Semua tombol di Tab OSS WAJIB HILANG untuk RA dengan status DRAFT/NEED_REVISION
        // Catatan: Tombol sudah di-hide di awal fungsi, ini hanya untuk memastikan
        // Note: Status backend menggunakan "NEED_REVISION", bukan "REVISE"
        $('#btnRequestIDOSS, #btnSimpanIDOSS').hide().addClass('d-none');
        
        // Disable semua input fields di tab OSS (karena tombol sudah di-hide)
        $('#oss_TglPermintaan, #oss_NoAju, #oss_KegiatanUsaha, #oss_JenisPbum, #oss_NoIdOSS, #oss_Comment').prop('disabled', true);
        
        // ==================================================
        // FINAL CHECK: Memastikan logika menimpa aturan default
        // ==================================================
        // SetTimeout untuk memastikan tombol yang tidak diizinkan tetap hidden
        // bahkan jika ada fungsi lain yang mencoba menampilkannya setelah ini
        setTimeout(function() {
            console.log("f_ApplyRARoleAccess: Final check - enforcing strict button visibility rules for RA");
            
            // Pastikan hanya 2 tombol yang diizinkan yang muncul
            $('#btnSaveRegalHeader').show().removeClass('d-none'); // Simpan - WAJIB MUNCUL
            $('#btnOSSSubmit').show().removeClass('d-none'); // Submit - WAJIB MUNCUL
            
            // Pastikan semua tombol yang tidak diizinkan tetap hidden (menimpa aturan default)
            $('#btnOSSRequestVerfor').hide().addClass('d-none'); // Request Verfor - WAJIB HILANG
            $('#btnOSSApprove').hide().addClass('d-none'); // Approve - WAJIB HILANG
            $('#btnOSSReturn').hide().addClass('d-none'); // Return for Revision - WAJIB HILANG
            $('#btnRequestIDOSS').hide().addClass('d-none'); // Request ID OSS - WAJIB HILANG
            $('#btnSimpanIDOSS').hide().addClass('d-none'); // Simpan OSS - WAJIB HILANG
        }, 100);
        
        console.log("f_ApplyRARoleAccess: RA role access rules applied successfully");
        console.log("f_ApplyRARoleAccess: Strict button visibility - Only 'Simpan' and 'Submit' buttons are visible for RA with DRAFT/NEED_REVISION status");
    },

    // Task 2: Role-Based Access Control Manager Function
    // This function applies role-based restrictions to the form
    // Structure designed for future role-specific logic (Phase 2+)
    f_ApplyRoleAccess: function (userDept) {
        const role = (userDept || '').toUpperCase().trim();
        console.log("f_ApplyRoleAccess: Applying role access for:", role);

        // Check if role is in allowed list
        const isAllowed = RegalDetail.f_IsAllowedRole(userDept);

        if (isAllowed) {
            // --- AREA UNTUK LOGIC SPESIFIK 5 ROLE ---
            // Normalize role untuk menentukan role spesifik
            const normalizedRole = RegalDetail.f_NormalizeRole(userDept);
            
            // Switch case untuk setiap role spesifik
            switch(normalizedRole) { 
                case 'RA': 
                    // ==================================================
                    // ROLE: RA (Regulatory Affair)
                    // ==================================================
                    // Aplikasikan logika khusus untuk RA
                    // Logika ini hanya aktif jika status DRAFT atau NEED_REVISION
                    // Note: Status backend menggunakan "NEED_REVISION", bukan "REVISE"
                    // ==================================================
                    RegalDetail.f_ApplyRARoleAccess();
                    break; 
                    
                case 'BD': 
                    // TODO: Implementasi logika untuk BD (Business Development)
                    console.log("f_ApplyRoleAccess: BD role detected - using default access for now");
                    break;
                    
                case 'PCD': 
                    // TODO: Implementasi logika untuk PCD (Packaging Development)
                    console.log("f_ApplyRoleAccess: PCD role detected - using default access for now");
                    break;
                    
                case 'PDV': 
                    // TODO: Implementasi logika untuk PDV (Product Development)
                    console.log("f_ApplyRoleAccess: PDV role detected - using default access for now");
                    break;
                    
                case 'RAOSS': 
                    // TODO: Implementasi logika untuk RAOSS
                    console.log("f_ApplyRoleAccess: RAOSS role detected - using default access for now");
                    break;
                    
                default:
                    console.log("f_ApplyRoleAccess: Allowed role but no specific logic - using default access");
            }
        }
        else {
            // --- LOGIC UNTUK "GUEST" / ROLE LAINNYA (Strict View-Only Mode) ---
            console.log("f_ApplyRoleAccess: User is GUEST (View Only). Locking UI...");

            // Task 3: THE HAMMER - HIDE ACTION BUTTONS (Header & Tabs)
            // Daftar lengkap tombol aksi yang harus hilang - paksa hide dengan .hide() dan .addClass('d-none')
            var allActionButtons = [
                '#btnSaveRegalHeader',
                '#btnOSSSubmit', 
                '#btnOSSRequestVerfor', 
                '#btnOSSApprove', 
                '#btnOSSReturn',
                '#btnRequestIDOSS',
                '#btnSimpanIDOSS',
                '#btnRequestReviewLabel',
                '#btnOpenManageFinalLabelModal'
            ];
            // Paksa hide dengan double protection: .hide() + .addClass('d-none')
            $(allActionButtons.join(', ')).hide().addClass('d-none');
            
            // Hide juga tombol approval di Final Label tab
            $('#btnSubmitLabel_RA, #btnSubmitLabel_PD, #btnSubmitLabel_PKG').hide().addClass('d-none');
            
            // Hide tambahan: Semua tombol aksi dengan class tertentu (kecuali navigasi dan tombol Kembali)
            $('#RegalDetailSection button.btn-primary, #RegalDetailSection button.btn-success, #RegalDetailSection button.btn-warning, #RegalDetailSection button.btn-info, #RegalDetailSection button.btn-danger, #RegalDetailSection button.btn-outline-primary').not('.accordion-button, .nav-link, .btn-secondary, #btnBackRegal').hide();
            
            // Hide tombol di form detail
            $('#formDetailRegal button').not('.accordion-button, .nav-link, .btn-secondary, #btnBackRegal').hide();

            // Task 3: THE HAMMER - DISABLE INPUTS & SELECTS
            // Matikan form editing (semua input form)
            // Gunakan selector :input yang lebih komprehensif, tapi kecualikan navigasi/kembali
            $('#FormDetailRegal :input').not('.accordion-button, .nav-link, #btnBackRegal').prop('disabled', true);
            
            // Juga disable input di RegalDetailSection untuk memastikan semua form inputs ter-disable
            $('#RegalDetailSection input.form-control, #RegalDetailSection select.form-select, #RegalDetailSection textarea.form-control').not('.accordion-button, .nav-link').prop('disabled', true);

            // 3. DISABLE & HIDE LOV SEARCH BUTTONS
            // Cari tombol search spesifik atau tombol di dalam input-group
            var lovButtons = [
                '#btnSearchNomorIzinEdar',
                '#btnSearchVerforNo',
                '#btnSearchKbli',
                '#btnSearchPicRaOss'
            ];
            // Disable DAN hide tombol LOV untuk Guest (strict mode)
            $(lovButtons.join(', ')).prop('disabled', true).hide();

            // Opsi tambahan: Disable dan hide semua tombol di dalam input-group untuk keamanan ekstra
            // Pastikan tidak men-disable navigasi (accordion-button dan nav-link tidak ada di input-group)
            $('#RegalDetailSection .input-group .btn, #FormDetailRegal .input-group .btn').prop('disabled', true).hide();

            // 4. Disable inputs di document table (akan di-render ulang dengan disabled di BindDocuments)
            $('#tblDokumenRegistrasi input, #tblDokumenRegistrasi select').prop('disabled', true);
            
            // 5. Hide tombol di document table (akan di-render ulang tanpa tombol di BindDocuments)
            $('#tblDokumenRegistrasi button').hide();
            
            // 6. Pastikan readonly inputs tetap readonly
            $('#RegalDetailSection .regal-readonly').prop('readonly', true);
            
            // 7. Modal buttons - akan di-handle saat modal dibuka, tapi kita disable dulu
            $('#UploadDocModal button:not(.btn-secondary), #ShowPreviewFileModal button:not(.btn-secondary), #ManageFinalLabelModal button:not(.btn-secondary)').prop('disabled', true).hide();
            
            // 8. Pastikan tombol "Kembali" TETAP MUNCUL dan AKTIF
            // Enable kembali accordion buttons dan nav links (navigasi harus tetap hidup)
            $('#RegalDetailSection .accordion-button').prop('disabled', false).show();
            $('#RegalDetailSection .nav-link').prop('disabled', false).show();
            $('#btnBackRegal').prop('disabled', false).show();
            
            // Pastikan tab navigation tetap aktif
            $('#regalTabs .nav-link').prop('disabled', false).show();
            
            // Pastikan accordion di status history tetap aktif
            $('#accordionStatusHistory .accordion-button').prop('disabled', false).show();
            
            // Task 3: THE HAMMER - Final check to ensure all action buttons are hidden
            // Double-check dan paksa hide semua tombol aksi untuk Guest
            setTimeout(function() {
                $(allActionButtons.join(', ')).hide().addClass('d-none');
                $('#btnRequestReviewLabel, #btnOpenManageFinalLabelModal, #btnSubmitLabel_RA, #btnSubmitLabel_PD, #btnSubmitLabel_PKG').hide().addClass('d-none');
                console.log("f_ApplyRoleAccess: Final check completed - all action buttons forced to hide");
            }, 100);
            
            console.log("f_ApplyRoleAccess: Strict restrictions applied for GUEST role (View Only Mode)");
            console.log("f_ApplyRoleAccess: Navigation elements (Tabs, Accordions, Back button) remain active");
        }
    }
};

RegalDetail.HtmlEncode = function (value) {
    return $('<div/>').text(value || '').html();
};

const decodeURIComponentSafe = (value) => {
    if (value === undefined || value === null) {
        return '';
    }

    try {
        return decodeURIComponent(value);
    } catch (err) {
        console.warn('Failed to decode component:', err);
        return value;
    }
};

const getAntiForgeryToken = () => {
    return $('input[name=__RequestVerificationToken]').first().val();
};

const sanitizeDateValue = (value) => {
    if (!value || value === "") {
        return null;
    }

    return value;
};

const formatDateForInput = (value) => {
    if (!value) {
        return '';
    }

    const momentValue = moment(value);
    return momentValue.isValid() ? momentValue.format('YYYY-MM-DD') : '';
};

// Task 1: Helper function to save all visible Review and Catatan inputs before upload
const saveVisibleDocumentInputs = () => {
    const promises = [];
    const errors = [];
    
    // Loop through all rows in #tblDokumenRegistrasi
    $('#tblDokumenRegistrasi tbody tr').each(function() {
        const $row = $(this);
        
        // Skip empty rows (no data rows)
        if ($row.find('td').length === 0 || $row.text().trim() === 'Tidak ada dokumen') {
            return;
        }
        
        // Get DocId from data-doc-id attribute
        const docId = $row.find('select.review-ra-select').data('doc-id') || 
                     $row.find('input.catatan-input').data('doc-id') ||
                     $row.data('doc-id');
        
        if (!docId) {
            console.warn("saveVisibleDocumentInputs - DocId not found in row, skipping");
            return;
        }
        
        // Get ReviewRa value from select
        const reviewValue = $row.find('select.review-ra-select').val() || '';
        
        // Get Catatan value from input
        const catatanValue = ($row.find('input.catatan-input').val() || '').trim();
        
        // Task 1: Validation - If reviewValue == 'Need Revise' and catatanValue is empty, reject
        if (reviewValue === 'Need Revise' && (!catatanValue || catatanValue === '')) {
            const docName = $row.find('td:eq(1)').text().trim() || 'Dokumen tanpa nama';
            errors.push(`Dokumen "${docName}" memiliki status "Need Revise" tetapi Catatan belum diisi.`);
            return; // Skip this row, but continue checking others
        }
        
        // Skip if both are empty (no changes to save)
        if (!reviewValue && !catatanValue) {
            return;
        }
        
        // Prepare update data
        const updateData = {
            ReviewRa: reviewValue && reviewValue.trim() !== '' ? reviewValue : null,
            Catatan: catatanValue && catatanValue.trim() !== '' ? catatanValue : null
        };
        
        // Create promise for each document update
        const updatePromise = new Promise((resolve, reject) => {
            // Use existing SaveDocUpdate but wrap it in Promise
            var data = {
                __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val(),
                TxtId: docId,
                RegistrasiHdrTxtId: $('#hdRegalId').val(),
                ...updateData
            };

            $.ajax({
                type: "POST",
                url: base_path + "/Regal/UpdateRegalDoc",
                data: data,
                datatype: "json",
                success: function (retDat, status, xhr) {
                    if (xhr.responseText.includes("!DOCTYPE html")) {
                        clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                        reject("Session expired");
                    }
                    else {
                        if (retDat.bitSuccess == true) {
                            console.log(`saveVisibleDocumentInputs - Saved Doc [${docId}]: Review=[${updateData.ReviewRa}], Catatan=[${updateData.Catatan}]`);
                            resolve();
                        }
                        else {
                            console.error("Update failed:", retDat);
                            var errorMsg = retDat.txtMessage || "Gagal menyimpan data dokumen";
                            if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                                reject(retDat.objData || errorMsg);
                            }
                            else {
                                reject(errorMsg);
                            }
                        }
                    }
                },
                error: function (xhr, status, error) {
                    console.error("UpdateRegalDoc error:", xhr.status, xhr.responseText);
                    var errorMsg = xhr.responseText || error || "Terjadi kesalahan saat menyimpan data dokumen";
                    reject(errorMsg);
                }
            });
        });
        
        promises.push(updatePromise);
    });
    
    // Task 1: If there are validation errors, reject immediately
    if (errors.length > 0) {
        return Promise.reject(errors.join('<br>'));
    }
    
    // Task 1: Return Promise.all to wait for all updates to complete
    if (promises.length === 0) {
        console.log("saveVisibleDocumentInputs - No documents to save");
        return Promise.resolve();
    }
    
    console.log(`saveVisibleDocumentInputs - Saving ${promises.length} documents...`);
    return Promise.all(promises);
};

const buildRegalSavePayload = () => {
    const approvalRaValue = $('#approval_ra').val();
    const approvalPdValue = $('#approval_pd').val();
    const approvalPkgValue = $('#approval_pkg').val();

    const finalLabelSection = {
        ApprovalRa: approvalRaValue,
        ApprovalRaStatus: approvalRaValue,
        ApprovalRaDate: sanitizeDateValue($('#approval_ra_date').val()),
        NotesRa: $('#notes_ra').val(),
        ApprovalPd: approvalPdValue,
        ApprovalPdStatus: approvalPdValue,
        ApprovalPdDate: sanitizeDateValue($('#approval_pd_date').val()),
        NotesPd: $('#notes_pd').val(),
        ApprovalPkg: approvalPkgValue,
        ApprovalPkgStatus: approvalPkgValue,
        ApprovalPkgDate: sanitizeDateValue($('#approval_pkg_date').val()),
        NotesPkg: $('#notes_pkg').val()
    };

    // Get KBLI value as-is (full string: "Code - Description")
    const kbliValue = $('#kbli').val() || '';

    // Task 2: Collect Review and Catatan data from all rows in #tblDokumenRegistrasi
    const documents = [];
    $('#tblDokumenRegistrasi tbody tr').each(function() {
        const $row = $(this);
        
        // Skip empty rows (no data rows)
        if ($row.find('td').length === 0 || $row.text().trim() === 'Tidak ada dokumen') {
            return;
        }
        
        // Get DocId from data-doc-id attribute (try from select or input)
        const docId = $row.find('select.review-ra-select').data('doc-id') || 
                     $row.find('input.catatan-input').data('doc-id') ||
                     $row.data('doc-id');
        
        if (!docId) {
            console.warn("buildRegalSavePayload - DocId not found in row, skipping");
            return;
        }
        
        // Get ReviewRa value from select
        const reviewRa = $row.find('select.review-ra-select').val() || '';
        
        // Get Catatan value from input
        const catatan = ($row.find('input.catatan-input').val() || '').trim();
        
        // Add to documents array
        documents.push({
            TxtId: docId,
            ReviewRa: reviewRa && reviewRa.trim() !== '' ? reviewRa : null,
            Catatan: catatan && catatan.trim() !== '' ? catatan : null
        });
    });
    
    console.log("buildRegalSavePayload - Collected documents:", documents);

    return {
        Header: {
            RegalId: $('#hdRegalId').val(),
            NomorIzinEdarExisting: $('#nomorIzinEdar').val(),
            MasaBerlakuStart: sanitizeDateValue($('#masaBerlakuStart').val()),
            MasaBerlakuEnd: sanitizeDateValue($('#masaBerlakuEnd').val()),
            PicRaOss: $('#picRAOSS').val(),
            NamaJenis: $('#namaJenis').val(),
            VerforNo: $('#verforNo').val(),
            Kbli: kbliValue
        },
        FinalLabel: finalLabelSection,
        Documents: documents  // Task 2: Add documents array to payload
    };
};

// Task 3: Validation function to check if all "Need Revise" rows have Catatan filled
const validateReviewAndCatatan = () => {
    var hasError = false;
    var errorMessages = [];
    
    $('#tblDokumenRegistrasi tbody tr').each(function() {
        var $row = $(this);
        var $reviewSelect = $row.find('.review-ra-select');
        var $catatanInput = $row.find('.catatan-input');
        
        // Skip if row is voided (disabled)
        if ($reviewSelect.prop('disabled')) {
            return true; // Continue to next row
        }
        
        var reviewValue = $reviewSelect.val();
        var catatanValue = ($catatanInput.val() || '').trim();
        
        if (reviewValue === 'Need Revise' && !catatanValue) {
            hasError = true;
            var docName = $row.find('td:eq(1)').text().trim(); // Get document name from column 1
            errorMessages.push(`Dokumen "${docName}" memiliki status "Need Revise" tetapi Catatan belum diisi.`);
        }
    });
    
    if (hasError) {
        clsGlobal.swalWarning(errorMessages.join('<br>'));
        return false;
    }
    
    return true;
};

const f_SaveRegalData = () => {
    const regalId = $('#hdRegalId').val();
    if (!regalId) {
        const message = "Data Registrasi Lokal belum siap. Silakan pilih data terlebih dahulu.";
        clsGlobal.swalWarning(message);
        return Promise.reject(message);
    }

    // Task 3: Validate all rows before saving
    if (!validateReviewAndCatatan()) {
        return Promise.reject("Validasi gagal: Catatan wajib diisi untuk dokumen dengan status Need Revise.");
    }

    const token = getAntiForgeryToken();
    const payload = buildRegalSavePayload();

    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: base_path + "/Regal/SaveRegalDetail",
            data: JSON.stringify(payload),
            contentType: "application/json; charset=utf-8",
            headers: {
                'RequestVerificationToken': token
            },
            beforeSend: function () {
                clsGlobal.showLoading();
            },
            success: function (retDat, status, xhr) {
                clsGlobal.hideLoading();

                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("Sesi Anda telah berakhir, silakan login kembali", window.location.href);
                    reject("Session expired");
                    return;
                }

                if (retDat.bitSuccess === true) {
                    resolve(retDat);
                } else if (retDat.txtMessage === 'Validation' || retDat.txtMessage === 'gagal') {
                    const warningMessage = retDat.objData || "Validasi gagal. Silakan periksa kembali data Anda.";
                    clsGlobal.swalWarning(warningMessage);
                    reject(warningMessage);
                } else {
                    const errorMessage = retDat.txtMessage || "Gagal menyimpan data Registrasi Lokal.";
                    clsGlobal.swalError(errorMessage);
                    reject(errorMessage);
                }
            },
            error: function (xhr) {
                clsGlobal.hideLoading();
                const errorMessage = xhr.responseJSON?.txtMessage || xhr.responseText || "Terjadi kesalahan saat menyimpan data Registrasi Lokal.";
                clsGlobal.swalError(errorMessage);
                reject(errorMessage);
            }
        });
    });
};

const sendRegalCommand = (endpoint, payload, successMessage) => {
    const token = getAntiForgeryToken();

    $.ajax({
        type: "POST",
        url: base_path + endpoint,
        data: JSON.stringify(payload),
        contentType: "application/json; charset=utf-8",
        headers: {
            'RequestVerificationToken': token
        },
        beforeSend: function () {
            clsGlobal.showLoading();
        },
        success: function (retDat, status, xhr) {
            clsGlobal.hideLoading();

            if (xhr.responseText.includes("!DOCTYPE html")) {
                clsGlobal.swalWarningRedirect("Sesi Anda telah berakhir, silakan login kembali", window.location.href);
                return;
            }

            if (retDat.bitSuccess === true) {
                clsGlobal.swalSuccess(successMessage || "Berhasil memperbarui status Registrasi Lokal");
                if (payload && payload.RegalId) {
                    RegalHeader.ShowDetail(payload.RegalId);
                } else {
                    RegalHeader.ShowDetail($('#hdRegalId').val());
                }
            } else if (retDat.txtMessage === 'Validation' || retDat.txtMessage === 'gagal') {
                clsGlobal.swalWarning(retDat.objData || "Validasi gagal. Silakan periksa kembali data Anda.");
            } else {
                clsGlobal.swalError(retDat.txtMessage || "Gagal memperbarui status Registrasi Lokal.");
            }
        },
        error: function (xhr) {
            clsGlobal.hideLoading();
            const errorMessage = xhr.responseJSON?.txtMessage || xhr.responseText || "Terjadi kesalahan saat memproses permintaan.";
            clsGlobal.swalError(errorMessage);
        }
    });
};

const ensureRegalSelection = () => {
    const regalId = $('#hdRegalId').val();
    if (!regalId) {
        clsGlobal.swalWarning("Data Registrasi Lokal belum siap. Silakan pilih data terlebih dahulu.");
        return null;
    }
    return regalId;
};

const finalLabelApprovalConfig = {
    RA: {
        successMessage: 'Data review Regulatory Affair telah disimpan.'
    },
    PD: {
        successMessage: 'Data review Product Development telah disimpan.'
    },
    PKG: {
        successMessage: 'Data review Packaging Development telah disimpan.'
    }
};

const submitFinalLabelApproval = (approvalType, statusValue, dateValue, notesValue) => {
    const config = finalLabelApprovalConfig[approvalType];
    if (!config) {
        console.error(`Unknown approval type: ${approvalType}`);
        return;
    }

    const regalId = ensureRegalSelection();
    if (!regalId) {
        return;
    }

    const token = getAntiForgeryToken();
    const payload = {
        RegalHdrTxtId: regalId,
        ApprovalType: approvalType,
        Status: statusValue,
        Date: dateValue,
        Notes: notesValue
    };

    $.ajax({
        type: "POST",
        url: base_path + "/Regal/SaveFinalLabelApproval",
        data: JSON.stringify(payload),
        contentType: "application/json; charset=utf-8",
        headers: {
            'RequestVerificationToken': token
        },
        beforeSend: function () {
            clsGlobal.showLoading();
        },
        success: function (retDat, status, xhr) {
            clsGlobal.hideLoading();
            
            if (xhr.responseText.includes("!DOCTYPE html")) {
                clsGlobal.swalWarningRedirect("Sesi Anda telah berakhir, silakan login kembali", window.location.href);
                return;
            }

            if (retDat.bitSuccess === true) {
                clsGlobal.swalSuccessWithoutAction(config.successMessage);

                // Refresh tab Final Label dengan data terbaru dari backend
                const regalHdrTxtId = $('#hdRegalId').val();
                if (regalHdrTxtId) {
                    RegalDetail.RefreshFinalLabelTabOnly(regalHdrTxtId);
                }
            } else if (retDat.txtMessage === 'Validation' || retDat.txtMessage === 'gagal') {
                clsGlobal.swalWarning(retDat.objData || "Validasi gagal. Silakan periksa kembali data Anda.");
            } else {
                clsGlobal.swalError(retDat.txtMessage || "Gagal menyimpan data approval final label.");
            }
        },
        error: function (xhr) {
            clsGlobal.hideLoading();
            const errorMessage = xhr.responseJSON?.txtMessage || xhr.responseText || "Terjadi kesalahan saat menyimpan data approval final label.";
            clsGlobal.swalError(errorMessage);
        }
    });
};

const openNomorIzinEdarLov = () => {
    const brand = ($('#brand').val() || '').trim();
    const subBrand = ($('#subBrand').val() || '').trim();

    if (!brand || !subBrand) {
        //Swal.fire('Informasi', 'Lengkapi Brand dan Sub Brand terlebih dahulu sebelum mencari Nomor Izin Edar.', 'info');
        clsGlobal.swalWarning('Lengkapi Brand dan Sub Brand terlebih dahulu sebelum mencari Nomor Izin Edar.');
        return;
    }

    const lovParams = JSON.stringify({
        Brand: brand,
        SubBrand: subBrand
    });

    clsGlobal.generateLOV('NOMOR_IZIN_EDAR', 'NomorIzinEdar', lovParams);
};

const f_SubmitRegal = () => {
    const regalId = ensureRegalSelection();
    if (!regalId) {
        return;
    }

    f_SaveRegalData()
        .then(() => {
            Swal.fire({
                title: "Submit Registrasi Lokal ini ke Proses BPOM?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Ya",
                cancelButtonText: "Tidak",
                customClass: {
                    confirmButton: 'btn btn-primary',
                    cancelButton: 'btn btn-secondary'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    sendRegalCommand("/Regal/SubmitRegal", { RegalId: regalId }, "Registrasi Lokal berhasil disubmit");
                }
            });
        })
        .catch(() => {
            // Error handling sudah ditangani di f_SaveRegalData
        });
};

const f_ApproveRegal = () => {
    const regalId = ensureRegalSelection();
    if (!regalId) {
        return;
    }

    f_SaveRegalData()
        .then(() => {
            Swal.fire({
                title: "Apakah Anda yakin ingin menyetujui registrasi lokal ini?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Ya",
                cancelButtonText: "Tidak",
                customClass: {
                    confirmButton: 'btn btn-primary',
                    cancelButton: 'btn btn-secondary'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    sendRegalCommand("/Regal/ApproveRegal", { RegalId: regalId }, "Registrasi Lokal berhasil disetujui");
                }
            });
        })
        .catch(() => {
            // Error handling sudah ditangani di f_SaveRegalData
        });
};

const f_ReturnRegal = () => {
    const regalId = ensureRegalSelection();
    if (!regalId) {
        return;
    }

    f_SaveRegalData()
        .then(() => {
            Swal.fire({
                title: "Kembalikan registrasi lokal untuk revisi?",
                icon: "warning",
                input: "textarea",
                inputPlaceholder: "Masukkan catatan revisi",
                inputValidator: (value) => {
                    if (!value) {
                        return "Catatan revisi harus diisi";
                    }
                },
                showCancelButton: true,
                confirmButtonText: "Kembalikan",
                cancelButtonText: "Batal",
                customClass: {
                    confirmButton: 'btn btn-danger',
                    cancelButton: 'btn btn-secondary'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    sendRegalCommand("/Regal/ReturnRegal", { RegalId: regalId, Notes: result.value }, "Registrasi Lokal dikembalikan untuk revisi");
                }
            });
        })
        .catch(() => {
            // Error handling sudah ditangani di f_SaveRegalData
        });
};

const f_RequestVerfor = () => {
    const regalId = ensureRegalSelection();
    if (!regalId) {
        return;
    }

    f_SaveRegalData()
        .then(() => {
            Swal.fire({
                title: "Ajukan permintaan Verifikasi Formula?",
                icon: "question",
                input: "textarea",
                inputPlaceholder: "Tambahkan catatan (opsional)",
                showCancelButton: true,
                confirmButtonText: "Ajukan",
                cancelButtonText: "Batal",
                customClass: {
                    confirmButton: 'btn btn-primary',
                    cancelButton: 'btn btn-secondary'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    sendRegalCommand("/Regal/RequestVerfor", { RegalId: regalId, Notes: result.value || "" }, "Permintaan verifikasi formula untuk Registrasi Lokal telah dicatat");
                }
            });
        })
        .catch(() => {
            // Error handling sudah ditangani di f_SaveRegalData
        });
};

window.f_SaveRegalData = f_SaveRegalData;
window.f_SubmitRegal = f_SubmitRegal;
window.f_RequestVerfor = f_RequestVerfor;
window.f_ApproveRegal = f_ApproveRegal;
window.f_ReturnRegal = f_ReturnRegal;

$(document).ready(function () {
    
    // Task 1: Event handler for back button with confirmation
    $('#btnBackRegal').on('click', function (e) {
        e.preventDefault();
        Swal.fire({
            title: "Confirmation",
            text: "The data have not been saved. Are you sure you want to go back to the home page?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-secondary'
            },
        }).then((result) => {
            if (result.isConfirmed) {
                // User clicked "Yes", proceed with navigation
                if (typeof f_ShowListRegal === 'function') {
                    f_ShowListRegal();
                }
            }
            // If user clicked "No" or closed the dialog, do nothing
        });
    });
    
    // Event handler for file input change - Generate Preview
    $("#fileDoc").on("change", function (e) {
        e.preventDefault();
        RegalDetail.GeneratePreviewUpload();
    });
    
    $('#btnSearchPicRaOss').on('click', function (e) {
        e.preventDefault();
        clsGlobal.generateLOV("PIC_RA_OSS", "picRAOSS");

    });

    $('#btnSearchNomorIzinEdar').on('click', function (e) {
        e.preventDefault();
        openNomorIzinEdarLov();
    });

    $('#btnSearchVerforNo').on('click', function (e) {
        e.preventDefault();
        clsGlobal.generateLOV('VERFOR_HEADER', 'verforNo');
    });

    $('#btnSearchKbli').on('click', function (e) {
        e.preventDefault();
        clsGlobal.generateLOV('KBLI', 'KBLI', '');
    });

    $('#btnSaveRegalHeader').on('click', function (e) {
        e.preventDefault();
        const regalId = $('#hdRegalId').val();
        f_SaveRegalData()
            .then(() => {
                clsGlobal.swalSuccess("Berhasil menyimpan data Registrasi Lokal");
                if (regalId) {
                    //RegalHeader.ShowDetail(regalId);
                    RegalDetail.RefreshDocumentListOnly(regalId);
                }
            })
            .catch(() => {
                // Error message already handled in save function
            });
    });

    $('#btnSubmitLabel_RA').on('click', function (e) {
        e.preventDefault();
        const statusValue = $('#approval_ra').val();
        const today = moment().format('YYYY-MM-DD');
        $('#approval_ra_date').val(today);
        const dateValue = sanitizeDateValue($('#approval_ra_date').val());
        const notesValue = ($('#notes_ra').val() || '').trim();

        if (statusValue === 'Need Revise' && !notesValue) {
            //Swal.fire('Validasi Gagal!', 'Catatan (Notes) wajib diisi jika status "Need Revise".', 'error');
            clsGlobal.swalWarning('Catatan (Notes) wajib diisi jika status "Need Revise".');
            return false;
        }

        submitFinalLabelApproval('RA', statusValue, dateValue, notesValue);
    });

    $('#btnSubmitLabel_PD').on('click', function (e) {
        e.preventDefault();
        const statusValue = $('#approval_pd').val();
        const today = moment().format('YYYY-MM-DD');
        $('#approval_pd_date').val(today);
        const dateValue = sanitizeDateValue($('#approval_pd_date').val());
        const notesValue = ($('#notes_pd').val() || '').trim();

        if (statusValue === 'Need Revise' && !notesValue) {
            //Swal.fire('Validasi Gagal!', 'Catatan (Notes) wajib diisi jika status "Need Revise".', 'error');
            clsGlobal.swalWarning('Catatan (Notes) wajib diisi jika status "Need Revise".');

            return false;
        }

        submitFinalLabelApproval('PD', statusValue, dateValue, notesValue);
    });

    $('#btnSubmitLabel_PKG').on('click', function (e) {
        e.preventDefault();
        const statusValue = $('#approval_pkg').val();
        const today = moment().format('YYYY-MM-DD');
        $('#approval_pkg_date').val(today);
        const dateValue = sanitizeDateValue($('#approval_pkg_date').val());
        const notesValue = ($('#notes_pkg').val() || '').trim();

        if (statusValue === 'Need Revise' && !notesValue) {
            //Swal.fire('Validasi Gagal!', 'Catatan (Notes) wajib diisi jika status "Need Revise".', 'error');
            clsGlobal.swalWarning('Catatan (Notes) wajib diisi jika status "Need Revise".');

            return false;
        }

        submitFinalLabelApproval('PKG', statusValue, dateValue, notesValue);
    });

    $('#btnOSSSubmit').on('click', function (e) {
        e.preventDefault();
        f_SubmitRegal();
    });

    $('#btnOSSRequestVerfor').on('click', function (e) {
        e.preventDefault();
        f_RequestVerfor();
    });

    $('#btnOSSApprove').on('click', function (e) {
        e.preventDefault();
        f_ApproveRegal();
    });

    $('#btnOSSReturn').on('click', function (e) {
        e.preventDefault();
        f_ReturnRegal();
    });

    $('#finalLabelButtonContainer').on('click', '#btnTriggerFinalLabelUpload', function () {
        $('#finalLabel').trigger('click');
    });

    $('#btnUploadFinalLabel').on('click', function () {
        const fileInput = $('#finalLabelFile')[0];
        const regalId = $('#hdRegalId').val();

        if (!regalId) {
            clsGlobal.swalWarning('Data Registrasi Lokal tidak ditemukan.');
            return;
        }

        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            clsGlobal.swalWarning('Silakan pilih file terlebih dahulu.');
            return;
        }

        const file = fileInput.files[0];
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            clsGlobal.swalWarning('Ukuran file maksimal 5MB.');
            return;
        }

        const formData = new FormData();
        formData.append('__RequestVerificationToken', getAntiForgeryToken());
        formData.append('regalHdrTxtId', regalId);
        formData.append('finalLabelFile', file);
        formData.append('originalFileName', file.name);

        clsGlobal.showLoading();

        $.ajax({
            type: 'POST',
            url: base_path + '/Regal/UploadFinalLabelFile',
            data: formData,
            processData: false,
            contentType: false
        }).done(function (response) {
            clsGlobal.hideLoading();

            if (response && response.success) {
                const filePath = response.filePath || '';
                const fileName = response.fileNameAlias || response.fileName || file.name;
                clsGlobal.swalSuccess('File Final Label berhasil diupload.');
                RegalDetail.f_UpdateFinalLabelUI(filePath, fileName);
                $('#finalLabelFile').val(null);
            } else {
                clsGlobal.swalError(response && response.message ? response.message : 'Gagal mengunggah file final label.');
            }
        }).fail(function () {
            clsGlobal.hideLoading();
            clsGlobal.swalError('Terjadi kesalahan saat mengunggah file final label.');
        });
    });

    $('#btnDeleteFinalLabel').on('click', function () {
        const regalId = $('#hdRegalId').val();
        if (!regalId) {
            clsGlobal.swalWarning('Data Registrasi Lokal tidak ditemukan.');
            return;
        }

        Swal.fire({
            title: 'Anda yakin?',
            text: 'File final label akan dihapus permanen.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (!result.isConfirmed) {
                return;
            }

            $.ajax({
                type: 'POST',
                url: base_path + '/Regal/DeleteFinalLabelFile',
                data: {
                    __RequestVerificationToken: getAntiForgeryToken(),
                    regalHdrTxtId: regalId
                }
            }).done(function (response) {
                if (response && response.success) {
                    clsGlobal.swalSuccessWithoutAction('File final label berhasil dihapus.');
                    RegalDetail.f_UpdateFinalLabelUI('', '');
                } else {
                    clsGlobal.swalError(response && response.message ? response.message : 'Gagal menghapus file final label.');
                }
            }).fail(function () {
                clsGlobal.swalError('Terjadi kesalahan saat menghapus file final label.');
            });
        });
    });

    $('#modalShowFilePreviewUploaded').on('click', '.btn-delete-preview-doc', function () {
        const docId = $(this).data('doc-id');
        const filePath = $(this).data('file-path');
        if (!docId) {
            //Swal.fire('Error!', 'ID dokumen tidak ditemukan.', 'error');
            clsGlobal.swalWarning('ID dokumen tidak ditemukan.');
            return;
        }

        if (!filePath) {
            clsGlobal.swalWarning('Path file tidak ditemukan.');
            return;
        }

        // Task 4: Fix z-index and buttons for delete popup
        Swal.fire({
            title: 'Anda yakin?',
            text: 'File ini akan dihapus permanen.',
            icon: 'warning',
            showCancelButton: true,
            showDenyButton: false, // Task 4: Ensure deny button is not shown
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-secondary'
            },
            // Task 4: Set target to modal to ensure proper z-index
            target: document.getElementById('modalShowFilePreviewUploaded') || document.body,
            allowOutsideClick: false,
            allowEscapeKey: true
        }).then((result) => {
            if (!result.isConfirmed) {
                return;
            }

            $.ajax({
                type: 'POST',
                url: base_path + '/Regal/DeleteRegalDocument',
                data: {
                    __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val(),
                    docId: docId,
                    filePath: filePath
                }
            }).done(function (response) {
                if (response && response.success) {
                    clsGlobal.swalSuccessWithoutAction('File berhasil dihapus.');
                    $('#ShowPreviewFileModal').modal('hide');
                    const regalId = $('#hdRegalId').val();
                    if (regalId) {
                        RegalHeader.ShowDetail(regalId);
                    } else {
                        location.reload();
                    }
                } else {
                    clsGlobal.swalError(response && response.message ? response.message : 'Gagal menghapus file.');
                }
            }).fail(function () {
                clsGlobal.swalError('Terjadi kesalahan saat menghapus file.');
            });
        });
    });

    $('#btnSaveUploadDoc').on('click', function (e) {
        e.preventDefault();
        
        var fileInput = $('#fileDoc')[0];
        
        // Task 2: Validate file input first
        if (fileInput.files.length === 0) {
            clsGlobal.swalWarning("Silahkan pilih file untuk diupload");
            return;
        }
        
        // Task 2: Validate file extension and size BEFORE saving documents
        const allowedExts = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'png', 'jpg', 'jpeg'];
        var hasInvalidExtension = false;
        var invalidFileName = '';
        var maxSize = 5 * 1024 * 1024; // 5MB in bytes
        var hasOversizedFile = false;
        
        $.each(fileInput.files, function (index, file) {
            // Validate file extension
            var fileExt = file.name.split('.').pop().toLowerCase();
            var isValidExtension = allowedExts.indexOf(fileExt) !== -1;
            
            if (!isValidExtension) {
                hasInvalidExtension = true;
                invalidFileName = file.name;
                return false; // Break loop
            }
            
            // Validate file size
            if (file.size > maxSize) {
                hasOversizedFile = true;
                clsGlobal.swalWarning('Ukuran file maksimal 5MB. File "' + file.name + '" berukuran ' + (file.size / 1024 / 1024).toFixed(2) + 'MB.');
                return false; // Break loop
            }
        });
        
        // Task 2: If file validation fails, stop here
        if (hasInvalidExtension) {
            clsGlobal.swalWarning("Format file " + invalidFileName + " tidak diizinkan");
            return;
        }
        
        if (hasOversizedFile) {
            return; // Stop upload process
        }
        
        // Task 2: Show loading indicator
        clsGlobal.showLoading();
        
        // Task 2: Save all visible Review and Catatan inputs FIRST
        saveVisibleDocumentInputs()
            .then(() => {
                // Task 2: If save successful, proceed with file upload
                console.log("saveVisibleDocumentInputs - All documents saved successfully, proceeding with upload");
                
                // Prepare FormData for file upload
                var formData = new FormData();
                
                $.each(fileInput.files, function (index, file) {
                    formData.append('FileDoc', file);
                    formData.append('originalFileNames', file.name);
                });
                
                formData.append('DocData', $('#hdDocData').val());
                formData.append('__RequestVerificationToken', $('input[name=__RequestVerificationToken]').val());
                
                // Task 2: Upload file after documents are saved
                $.ajax({
                    type: "POST",
                    url: base_path + "/Regal/SaveUploadRegalDoc",
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (retDat, status, xhr) {
                        clsGlobal.hideLoading();
                        if (xhr.responseText.includes("!DOCTYPE html")) {
                            clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                        }
                        else {
                            if (retDat.bitSuccess == true) {
                                clsGlobal.swalSuccess("File berhasil diupload");
                                $('#UploadDocModal').modal('hide');
                                $('#formUploadDoc')[0].reset();
                                RegalDetail.EmptyPreview();
                                
                                var regalId = $('#hdRegalId').val();
                                // Refresh document list - data is already saved, so no warning needed
                                RegalDetail.RefreshDocumentListOnly(regalId, false);
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
                        clsGlobal.swalError(xhr.responseText || "Terjadi kesalahan saat mengupload file.");
                    }
                });
            })
            .catch((error) => {
                // Task 2: If save fails (validation error or other error), stop upload process
                clsGlobal.hideLoading();
                console.error("saveVisibleDocumentInputs - Failed to save document data:", error);
                
                // Show error message (error can be string or array of strings)
                if (typeof error === 'string') {
                    clsGlobal.swalWarning(error);
                } else {
                    clsGlobal.swalWarning("Gagal menyimpan data Review/Catatan. Upload dibatalkan.");
                }
            });
    });

    $('#btnRequestReviewLabel').on('click', function (e) {
        e.preventDefault();

        const regalHdrTxtId = $('#hdRegalId').val();
        if (!regalHdrTxtId) {
            clsGlobal.swalWarning("Regal ID tidak ditemukan");
            return;
        }

        clsGlobal.showLoading();

        $.ajax({
            url: '/Regal/RequestLabelReview',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ RegalId: regalHdrTxtId }),
            headers: {
                'RequestVerificationToken': getAntiForgeryToken()
            },
            success: function (response) {
                clsGlobal.hideLoading();

                if (response && response.bitSuccess) {
                    clsGlobal.swalSuccessWithoutAction("Request review label berhasil dikirim");
                    
                    // Refresh tab Final Label dengan data terbaru dari backend
                    const regalHdrTxtId = $('#hdRegalId').val();
                    if (regalHdrTxtId) {
                        RegalDetail.RefreshFinalLabelTabOnly(regalHdrTxtId);
                    }
                } else {
                    const errorMsg = response?.txtMessage || "Gagal mengirim request review label";
                    clsGlobal.swalError(errorMsg);
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.hideLoading();
                clsGlobal.swalError(xhr.responseText || "Terjadi kesalahan saat mengirim request review label");
            }
        });
    });

    // Event listener for "Simpan ID OSS" button
    $('#btnSimpanIDOSS').on('click', function (e) {
        e.preventDefault();

        const regalHdrTxtId = $('#hdRegalId').val();
        if (!regalHdrTxtId) {
            clsGlobal.swalWarning("Regal ID tidak ditemukan");
            return;
        }

        // Build OSS data payload
        const ossPayload = {
            RegalHdrTxtId: regalHdrTxtId,
            IdOss: $('#oss_IdOSS').val() || null,
            TglPermintaanOss: sanitizeDateValue($('#oss_TglPermintaan').val()),
            PicRaOss: $('#oss_PicRA').val() || null,
            NoAjuRegistrasi: $('#oss_NoAju').val() || null,
            KegiatanUsaha: $('#oss_KegiatanUsaha').val() || null,
            JenisPbumKu: $('#oss_JenisPbum').val() || null,
            NoIdOss: $('#oss_NoIdOSS').val() || null,
            Comment: $('#oss_Comment').val() || null
        };

        clsGlobal.showLoading();

        $.ajax({
            url: '/Regal/SaveOssData',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(ossPayload),
            headers: {
                'RequestVerificationToken': getAntiForgeryToken()
            },
            success: function (response) {
                clsGlobal.hideLoading();

                if (response && response.bitSuccess) {
                    clsGlobal.swalSuccessWithoutAction("Data OSS berhasil disimpan");
                    
                    // Optional: Update status to DOC_READY_SUBMIT if needed
                    // RegalDetail.UpdateStatus(regalHdrTxtId, 'DOC_READY_SUBMIT');
                } else {
                    const errorMsg = response?.txtMessage || "Gagal menyimpan data OSS";
                    clsGlobal.swalError(errorMsg);
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.hideLoading();
                clsGlobal.swalError(xhr.responseText || "Terjadi kesalahan saat menyimpan data OSS");
            }
        });
    });

    // Event listener for "Request ID OSS" button
    $('#btnRequestIDOSS').on('click', function (e) {
        e.preventDefault();

        const regalHdrTxtId = $('#hdRegalId').val();
        if (!regalHdrTxtId) {
            clsGlobal.swalWarning("Regal ID tidak ditemukan");
            return;
        }

        // Check if PIC RA OSS is filled
        const picRaOss = $('#oss_PicRA').val();
        if (!picRaOss) {
            clsGlobal.swalWarning("PIC RA OSS harus diisi terlebih dahulu");
            return;
        }

        clsGlobal.showLoading();

        $.ajax({
            url: '/Regal/RequestOssIdEmail',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ RegalId: regalHdrTxtId }),
            headers: {
                'RequestVerificationToken': getAntiForgeryToken()
            },
            success: function (response) {
                clsGlobal.hideLoading();

                if (response && response.bitSuccess) {
                    clsGlobal.swalSuccessWithoutAction("Email request ID OSS berhasil dikirim");
                    
                    // Optional: Update status to OSS_IN_PROCESS if needed
                    // RegalDetail.UpdateStatus(regalHdrTxtId, 'OSS_IN_PROCESS');
                } else {
                    const errorMsg = response?.txtMessage || "Gagal mengirim email request ID OSS";
                    clsGlobal.swalError(errorMsg);
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.hideLoading();
                clsGlobal.swalError(xhr.responseText || "Terjadi kesalahan saat mengirim email request ID OSS");
            }
        });
    });

    // ==================== Final Label Files Management ====================
    
    // Aksi 1: Buka Modal dan Load Data
    $('#btnOpenManageFinalLabelModal').on('click', function (e) {
        e.preventDefault();
        
        const regalHdrTxtId = $('#hdRegalId').val();
        if (!regalHdrTxtId) {
            clsGlobal.swalWarning('Data Registrasi Lokal tidak ditemukan.');
            return;
        }

        // Buka modal
        $('#ManageFinalLabelModal').modal('show');
        
        // Load list file
        loadFinalLabelFiles(regalHdrTxtId);
    });

    // Aksi 2: Upload File di Modal
    $('#btnSaveFinalLabelFile').on('click', function (e) {
        e.preventDefault();
        
        const fileInput = $('#finalLabelInputFile')[0];
        const regalHdrTxtId = $('#hdRegalId').val();

        if (!regalHdrTxtId) {
            clsGlobal.swalWarning('Data Registrasi Lokal tidak ditemukan.');
            return;
        }

        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            clsGlobal.swalWarning('Silakan pilih file terlebih dahulu.');
            return;
        }

        const file = fileInput.files[0];
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            clsGlobal.swalWarning('Ukuran file maksimal 5MB.');
            return;
        }

        const formData = new FormData();
        formData.append('__RequestVerificationToken', getAntiForgeryToken());
        formData.append('regalHdrTxtId', regalHdrTxtId);
        formData.append('file', file);
        formData.append('originalFileName', file.name);

        clsGlobal.showLoading();

        $.ajax({
            type: 'POST',
            url: base_path + '/Regal/UploadFinalLabelFileNew',
            data: formData,
            processData: false,
            contentType: false
        }).done(function (response) {
            clsGlobal.hideLoading();

            if (response && response.bitSuccess) {
                clsGlobal.swalSuccess('File Final Label berhasil diupload.');
                // Kosongkan input file
                $('#finalLabelInputFile').val(null);
                // Refresh tabel (panggil ulang load dari Aksi 1)
                loadFinalLabelFiles(regalHdrTxtId);
            } else {
                const errorMsg = response?.txtMessage || response?.objData || 'Gagal mengunggah file final label.';
                clsGlobal.swalError(errorMsg);
            }
        }).fail(function (xhr) {
            clsGlobal.hideLoading();
            const errorMsg = xhr.responseJSON?.txtMessage || xhr.responseText || 'Terjadi kesalahan saat mengunggah file final label.';
            clsGlobal.swalError(errorMsg);
        });
    });

    // Aksi 3: Delete File (Delegated Event)
    $('#tblFinalLabelFiles').on('click', '.btn-delete-final-label-file', function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        const $button = $(this);
        const fileTxtId = $button.data('file-txt-id');
        if (!fileTxtId) {
            clsGlobal.swalWarning('File ID tidak ditemukan.');
            return;
        }

        Swal.fire({
            title: 'Anda yakin?',
            text: 'File akan dihapus permanen.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: "Ya,Hapus",
            cancelButtonText: "Batal",
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-secondary'
            }
        }).then((result) => {
            if (!result.isConfirmed) {
                return;
            }

            clsGlobal.showLoading();

            $.ajax({
                type: 'POST',
                url: base_path + '/Regal/DeleteFinalLabelFileNew',
                data: {
                    __RequestVerificationToken: getAntiForgeryToken(),
                    fileTxtId: fileTxtId
                }
            }).done(function (response) {
                clsGlobal.hideLoading();

                if (response && response.bitSuccess) {
                    clsGlobal.swalSuccessWithoutAction('File berhasil dihapus.');
                    // Hapus <tr> dari tabel
                    const $row = $button.closest('tr');
                    $row.fadeOut(300, function() {
                        $(this).remove();
                        
                        // Jika tabel kosong, tampilkan pesan
                        const tbody = $('#tblFinalLabelFiles tbody');
                        if (tbody.find('tr').length === 0) {
                            tbody.append('<tr><td colspan="5" class="text-center text-muted">Tidak ada file</td></tr>');
                        }
                    });
                } else {
                    const errorMsg = response?.txtMessage || 'Gagal menghapus file.';
                    clsGlobal.swalError(errorMsg);
                }
            }).fail(function (xhr) {
                clsGlobal.hideLoading();
                const errorMsg = xhr.responseJSON?.txtMessage || xhr.responseText || 'Terjadi kesalahan saat menghapus file.';
                clsGlobal.swalError(errorMsg);
            });
        });
    });

    // Aksi 4: Preview File (Delegated Event)
    $('#tblFinalLabelFiles').on('click', '.btn-preview-final-label-file', function (e) {
        e.preventDefault();
        
        const filePath = $(this).data('file-path');
        const fileName = $(this).data('file-name') || 'Final Label File';
        
        if (!filePath) {
            clsGlobal.swalWarning('File path tidak ditemukan.');
            return;
        }

        // Gunakan fungsi ShowPreviewModal yang sudah ada
        // Parameter terakhir (true) untuk menyembunyikan tombol Download dan Delete
        RegalDetail.ShowPreviewModal(
            encodeURIComponent(filePath),
            encodeURIComponent('Final Label'),
            '',
            encodeURIComponent(fileName),
            true  // hideActions = true untuk Final Label
        );
    });

});

// Helper function untuk load list file Final Label
const loadFinalLabelFiles = function (regalHdrTxtId) {
    const tbody = $('#tblFinalLabelFiles tbody');
    tbody.html('<tr><td colspan="5" class="text-center"><i class="ti ti-loader-2 ti-spin"></i> Memuat data...</td></tr>');

    $.ajax({
        type: 'GET',
        url: base_path + '/Regal/GetFinalLabelFiles',
        data: { regalHdrTxtId: regalHdrTxtId }
    }).done(function (response) {
        console.log('GetFinalLabelFiles response:', response);
        tbody.empty();

        if (response && response.bitSuccess && response.objData) {
            // Handle both array and single object
            const files = Array.isArray(response.objData) ? response.objData : [response.objData];
            
            if (files.length > 0) {
                files.forEach(function (file, index) {
                    // Handle both camelCase and PascalCase
                    const filePath = file.FilePath || file.filePath || '';
                    const fileName = file.FileNameAlias || file.fileNameAlias || file.FilePath?.split('/').pop() || file.filePath?.split('/').pop() || 'Unknown';
                    const createdDate = file.CreatedDate || file.createdDate;
                    const createdBy = file.CreatedBy || file.createdBy || '-';
                    const fileTxtId = file.TxtId || file.txtId || '';

                    const formattedDate = createdDate ? moment(createdDate).format('DD MMM YYYY HH:mm') : '-';

                    const row = `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${RegalDetail.HtmlEncode(fileName)}</td>
                            <td>${formattedDate}</td>
                            <td>${RegalDetail.HtmlEncode(createdBy)}</td>
                            <td class="text-center">
                                <a href="${RegalDetail.HtmlEncode(filePath)}" 
                                   target="_blank" 
                                   class="btn btn-icon btn-info btn-sm me-1" 
                                   download="${RegalDetail.HtmlEncode(fileName)}"
                                   data-bs-toggle="tooltip"
                                   data-bs-placement="top"
                                   title="Download File">
                                    <i class="ti ti-download"></i>
                                </a>
                                <button type="button" 
                                        class="btn btn-icon btn-success btn-sm btn-preview-final-label-file me-1" 
                                        data-file-path="${RegalDetail.HtmlEncode(filePath)}" 
                                        data-file-name="${RegalDetail.HtmlEncode(fileName)}"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        title="Pratinjau File">
                                    <i class="ti ti-eye"></i>
                                </button>
                                <button type="button" 
                                        class="btn btn-icon btn-danger btn-sm btn-delete-final-label-file" 
                                        data-file-txt-id="${RegalDetail.HtmlEncode(fileTxtId)}"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        title="Hapus File">
                                    <i class="ti ti-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                    tbody.append(row);
                });
            } else {
                tbody.append('<tr><td colspan="5" class="text-center text-muted">Tidak ada file</td></tr>');
            }
            
            // Initialize tooltips after rendering
            $('#ManageFinalLabelModal [data-bs-toggle="tooltip"]').tooltip();
        } else {
            console.warn('GetFinalLabelFiles: Invalid response structure', response);
            tbody.append('<tr><td colspan="5" class="text-center text-muted">Tidak ada file</td></tr>');
        }
    }).fail(function (xhr) {
        tbody.empty();
        tbody.append('<tr><td colspan="5" class="text-center text-danger">Gagal memuat data file</td></tr>');
        console.error('Failed to load final label files:', xhr.responseText);
        clsGlobal.swalError('Gagal memuat data file: ' + (xhr.responseJSON?.txtMessage || xhr.responseText || 'Unknown error'));
    });
};

const previousSetChooseLOV = window.setChooseLOV;
window.setChooseLOV = function (txtValue) {
    const parts = (txtValue || '').split('|');

    if (parts[0] === "picRAOSS") {
        const selectedUsername = parts[1] || "";
        $('#picRAOSS').val(selectedUsername);
        $('#oss_PicRA').val(selectedUsername);

        if (typeof clsGlobal !== 'undefined' && typeof clsGlobal.closeLOV === 'function') {
            clsGlobal.closeLOV();
        } else if (typeof $.fancybox !== 'undefined' && typeof $.fancybox.close === 'function') {
            $.fancybox.close();
        }
        return;
    }

    if (parts[0] === "NomorIzinEdar") {
        const nomorIzinEdar = parts[1] || "";
        const tanggalTerbit = parts[8] || "";
        const tanggalBerakhir = parts[9] || "";

        $('#nomorIzinEdar').val(nomorIzinEdar);
        $('#masaBerlakuStart').val(formatDateForInput(tanggalTerbit));
        $('#masaBerlakuEnd').val(formatDateForInput(tanggalBerakhir));

        if (typeof clsGlobal !== 'undefined' && typeof clsGlobal.closeLOV === 'function') {
            clsGlobal.closeLOV();
        } else if (typeof $.fancybox !== 'undefined' && typeof $.fancybox.close === 'function') {
            $.fancybox.close();
        }

        return;
    }

    if (parts[0] === "verforNo") {
        const selectedVerforNo = parts[1] || "";

        $('#verforNo').val(selectedVerforNo);

        if (typeof clsGlobal !== 'undefined' && typeof clsGlobal.closeLOV === 'function') {
            clsGlobal.closeLOV();
        } else if (typeof $.fancybox !== 'undefined' && typeof $.fancybox.close === 'function') {
            $.fancybox.close();
        }

        return;
    }

    if (parts[0] === "KBLI") {
        const code = parts[1] || "";
        const description = parts[2] || "";
        
        // Format output: "Code - Description"
        const formattedValue = code && description ? `${code} - ${description}` : (code || description);
        $('#kbli').val(formattedValue);

        if (typeof clsGlobal !== 'undefined' && typeof clsGlobal.closeLOV === 'function') {
            clsGlobal.closeLOV();
        } else if (typeof $.fancybox !== 'undefined' && typeof $.fancybox.close === 'function') {
            $.fancybox.close();
        }

        return;
    }

    if (typeof previousSetChooseLOV === 'function') {
        previousSetChooseLOV(txtValue);
    }
};


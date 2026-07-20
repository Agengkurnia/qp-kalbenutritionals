"use strict";

/**
 * ============================================================================
 * REGAL DETAIL - REFACTORED MODULAR STRUCTURE
 * ============================================================================
 * 
 * This file has been refactored to follow Clean Code principles:
 * - Constants: All magic strings centralized
 * - State: All global variables in one place
 * - Utils: Reusable helper functions
 * - Templates: HTML string generation separated from logic
 * - Actions: Business logic functions
 * - Events: Event handlers organized
 * 
 * ============================================================================
 */

// Ensure LOV global variable exists (required for clsGlobal.generateLOV)
if (typeof LOV === 'undefined') {
    var LOV;
}

// ============================================================================
// SECTION 1: CONSTANTS
// ============================================================================
var RegalDetail = RegalDetail || {};

RegalDetail.Constants = {
    // Status Constants
    STATUS: {
        DRAFT: 'DRAFT',
        NEED_REVISION: 'NEED_REVISION',
        DOC_IN_PROCESS: 'DOC_IN_PROCESS',
        DOC_REVIEW: 'DOC_REVIEW',
        DOC_APPROVED: 'DOC_APPROVED',
        SUBMIT_OSS: 'SUBMIT_OSS',
        WAITING_APPROVAL: 'WAITING_APPROVAL',
        FINAL_APPROVED: 'FINAL_APPROVED', // OBSOLETE: Use DOC_APPROVED instead
        DEFAULT: 'DRAFT'
    },

    // Role Constants
    ROLES: {
        RA: 'RA',
        BD: 'BD',
        PCD: 'PCD',
        PDV: 'PDV',
        RAOSS: 'RAOSS',
        ALLOWED: ['RA', 'BD', 'PCD', 'PDV', 'RAOSS'],
        REGULATORY: 'REGULATORY',
        REGULATORY_AFFAIR: 'REGULATORY_AFFAIR'
    },

    // Review Status Constants
    REVIEW_STATUS: {
        OK: 'OK',
        NEED_REVISE: 'Need Revise',
        EMPTY: ''
    },

    // LOV Types
    LOV_TYPES: {
        PIC_RA_OSS: 'PIC_RA_OSS',
        NOMOR_IZIN_EDAR: 'NOMOR_IZIN_EDAR',
        VERFOR_HEADER: 'VERFOR_HEADER',
        KBLI: 'KBLI',
        JENIS_PBUM_KU: 'JENIS_PBUM_KU'
    },

    // Button IDs
    BUTTON_IDS: {
        SAVE_HEADER: '#btnSaveRegalHeader',
        REGAL_PROCESS_DOC: '#btnRegalProcessDoc',
        OSS_REQUEST_VERFOR: '#btnOSSRequestVerfor',
        OSS_APPROVE: '#btnOSSApprove',
        OSS_RETURN: '#btnOSSReturn',
        REQUEST_ID_OSS: '#btnRequestIDOSS',
        SIMPAN_ID_OSS: '#btnSubmitOSS',
        REQUEST_REVIEW_LABEL: '#btnRequestReviewLabel',
        OPEN_MANAGE_FINAL_LABEL: '#btnOpenManageFinalLabelModal',
        BACK: '#btnBackRegal'
    },

    // Selectors
    SELECTORS: {
        FORM: '#FormDetailRegal',
        DETAIL_SECTION: '#RegalDetailSection',
        DOC_TABLE: '#tblDokumenRegistrasi',
        STATUS_HISTORY: '#tblStatusHistory',
        FINAL_LABEL_FILES: '#tblFinalLabelFiles',
        FINAL_LABEL_HISTORY: '#tblFinalLabelHistory'
    },

    // File Constants
    FILE: {
        MAX_SIZE: 5 * 1024 * 1024, // 5MB
        ALLOWED_EXTENSIONS: ['pdf', 'docx', 'xlsx', 'png', 'jpg', 'jpeg'], // Only PDF, DOCX, XLSX, PNG, JPG, JPEG
        DATE_FORMAT: 'YYYY-MM-DD', // For HTML5 input type="date"
        DATE_DISPLAY_FORMAT: 'DD/MM/YYYY', // For user-friendly display
        DATETIME_FORMAT: 'DD MMM YYYY HH:mm'
    },

    // Messages
    MESSAGES: {
        CATATAN_REQUIRED: 'Catatan wajib diisi jika status Need Revise.',
        DATA_NOT_FOUND: 'Data tidak ditemukan',
        REGAL_NOT_READY: 'Data Registrasi Lokal belum siap. Silakan pilih data terlebih dahulu.',
        VALIDATION_FAILED: 'Validasi gagal: Catatan wajib diisi untuk dokumen dengan status Need Revise.',
        SESSION_EXPIRED: 'Session anda Habis, silahkan Login'
    },

    // Status Display Mapping
    STATUS_DISPLAY_MAP: {
        'DRAFT': 'Draft',
        'NEED_REVISION': 'Revise',
        'DOC_IN_PROCESS': 'Doc In Process',
        'DOC_REVIEW': 'Doc Review',
        'DOC_APPROVED': 'Doc Approved',
        'SUBMIT_OSS': 'Submit OSS',
        'WAITING_APPROVAL': 'Waiting Approval',
        'FINAL_APPROVED': 'Doc Approved' // Legacy mapping for backward compatibility
    },

    // Approval Types
    APPROVAL_TYPES: {
        RA: 'RA',
        PD: 'PD',
        PKG: 'PKG'
    }
};

// ============================================================================
// SECTION 2: STATE MANAGEMENT
// ============================================================================
RegalDetail.State = {
    // Document State
    currentDocData: null,
    currentPreviewBlobUrls: [],

    // Regal Status
    currentRegalStatus: '',
    currentStatusFinalLabel: '',

    // User Role State
    isUserRA: false,
    currentUserRoleCode: '',
    isGuest: false,

    // Initialize state
    init: function () {
        this.currentDocData = null;
        this.currentPreviewBlobUrls = [];
        this.currentRegalStatus = '';
        this.currentStatusFinalLabel = '';
        this.isUserRA = false;
        this.currentUserRoleCode = '';
        this.isGuest = false;
    },

    // Reset state
    reset: function () {
        this.init();
    }
};

// Initialize state
RegalDetail.State.init();

// ============================================================================
// SECTION 3: UTILITIES
// ============================================================================
RegalDetail.Utils = {
    /**
     * Decode URI component safely
     */
    decodeURIComponentSafe: function (value) {
        if (value === undefined || value === null) {
            return '';
        }
        try {
            return decodeURIComponent(value);
        } catch (err) {
            console.warn('Failed to decode component:', err);
            return value;
        }
    },

    /**
     * Get Anti-Forgery Token
     */
    getAntiForgeryToken: function () {
        return $('input[name=__RequestVerificationToken]').first().val();
    },

    /**
     * Sanitize date value
     */
    sanitizeDateValue: function (value) {
        if (!value || value === "") {
            return null;
        }
        return value;
    },

    /**
     * Convert date from display format (DD/MM/YYYY) to ISO format (YYYY-MM-DD) for backend
     * This is needed because we changed readonly date inputs to text with DD/MM/YYYY format
     */
    convertDateToISO: function (value) {
        if (!value || value === "") {
            return null;
        }

        // Try to parse DD/MM/YYYY format
        const momentValue = moment(value, 'DD/MM/YYYY', true);
        if (momentValue.isValid()) {
            return momentValue.format('YYYY-MM-DD');
        }

        // Fallback: try to parse as-is (in case it's already in YYYY-MM-DD format)
        const fallbackMoment = moment(value);
        if (fallbackMoment.isValid()) {
            return fallbackMoment.format('YYYY-MM-DD');
        }

        // If all parsing fails, return null
        console.warn('convertDateToISO: Unable to parse date:', value);
        return null;
    },

    /**
     * Format date for input field (HTML5 input type="date" requires YYYY-MM-DD)
     */
    formatDateForInput: function (value) {
        if (!value) {
            return '';
        }
        const momentValue = moment(value);
        return momentValue.isValid() ? momentValue.format(RegalDetail.Constants.FILE.DATE_FORMAT) : '';
    },

    /**
     * Format date for display (user-friendly DD/MM/YYYY format)
     */
    formatDateForDisplay: function (value) {
        if (!value) {
            return '';
        }
        const momentValue = moment(value);
        return momentValue.isValid() ? momentValue.format(RegalDetail.Constants.FILE.DATE_DISPLAY_FORMAT) : '';
    },

    /**
     * HTML Encode
     */
    htmlEncode: function (value) {
        return $('<div/>').text(value || '').html();
    },

    /**
     * Check if user is RA (fallback if not available from controller)
     */
    checkUserRole: function () {
        const State = RegalDetail.State;

        // Option 1: Check from global variable (if set from server)
        if (typeof currentUserRole !== 'undefined') {
            State.isUserRA = currentUserRole === RegalDetail.Constants.ROLES.RA ||
                currentUserRole === RegalDetail.Constants.ROLES.REGULATORY_AFFAIR;
        }
        // Option 2: Check from ClsGlobalClass (if available)
        else if (typeof ClsGlobalClass !== 'undefined' && typeof ClsGlobalClass.dLogin === 'function') {
            try {
                var loginData = ClsGlobalClass.dLogin();
                if (loginData && loginData.userDat) {
                    var userDept = (loginData.userDat.Department || '').toUpperCase();
                    var userName = (loginData.userDat.txtUserName || '').toUpperCase();
                    // Check if user is RA based on department or username
                    State.isUserRA = userDept.includes(RegalDetail.Constants.ROLES.RA) ||
                        userDept.includes(RegalDetail.Constants.ROLES.REGULATORY) ||
                        userName.includes(RegalDetail.Constants.ROLES.RA) ||
                        userName.includes(RegalDetail.Constants.ROLES.REGULATORY);
                    console.log("User role determined from ClsGlobalClass - IsRA:", State.isUserRA);
                }
            } catch (e) {
                console.warn("Could not determine user role:", e);
            }
        }

        return State.isUserRA;
    }
};

// ============================================================================
// SECTION 4: TEMPLATES (HTML String Generation)
// ============================================================================
RegalDetail.Templates = {
    /**
     * Generate document table row HTML
     */
    getDocumentRow: function (doc, index, state) {
        const C = RegalDetail.Constants;
        const Utils = RegalDetail.Utils;
        const State = RegalDetail.State;

        var configName = doc.ConfigUpload ? doc.ConfigUpload.UploadName : 'N/A';
        // Task 4B: Format PIC menjadi "NamaUser as Role" (Task 1: Role dalam italic)
        var configPIC = '';
        if (doc.ConfigUpload) {
            const namaUser = doc.PICUsername || '';
            const role = doc.ConfigUpload.TransactionPIC || '';

            // HTML encode untuk prevent XSS, tapi tetap gunakan tag <i> untuk italic
            const encodedNamaUser = Utils.htmlEncode(namaUser);
            const encodedRole = Utils.htmlEncode(role);

            if (namaUser && role) {
                configPIC = `${encodedNamaUser} <i>as ${encodedRole}</i>`;
            } else if (namaUser) {
                configPIC = encodedNamaUser;
            } else if (role) {
                configPIC = encodedRole;
            } else {
                configPIC = '';
            }
        }

        var isVoided = doc.IsVoid === true || doc.IsVoid === 'true' || doc.IsVoid === 1;

        // Generate upload button HTML
        var uploadBtn = this.getDocumentUploadButton(doc, index, isVoided, state);

        // Void checkbox
        // RBAC: RA hanya boleh void dokumen saat status DRAFT atau NEED_REVISION
        // Status lain (DOC_IN_PROCESS, DOC_REVIEW, DOC_APPROVED) tidak boleh void
        const currentStatusForVoid = (State.currentRegalStatus || '').toUpperCase();
        const isDraftOrRevise = (currentStatusForVoid === C.STATUS.DRAFT || currentStatusForVoid === C.STATUS.NEED_REVISION);
        const canVoid = (State.isUserRA && !State.isGuest && isDraftOrRevise);
        var voidCheckboxDisabled = canVoid ? '' : 'disabled';
        var voidCheckboxAttr = canVoid ? 'onchange="RegalDetail.UpdateVoid(this)"' : '';

        // Review select
        // BUG FIX: Review RA HANYA boleh aktif jika: User adalah RA DAN Dokumen TIDAK Void DAN bukan Guest
        // RBAC: RA hanya boleh edit Review di status DOC_REVIEW
        // Status lain (DRAFT, NEED_REVISION, DOC_IN_PROCESS, DOC_APPROVED) tidak boleh edit Review
        const isRa = State.isUserRA && !State.isGuest;
        const isDocReviewStatus = (currentStatusForVoid === C.STATUS.DOC_REVIEW);
        const isDocInProcessStatus = (currentStatusForVoid === C.STATUS.DOC_IN_PROCESS);
        const isRADraftReviseStatus = isRa && (currentStatusForVoid === C.STATUS.DRAFT || currentStatusForVoid === C.STATUS.NEED_REVISION);

        // Review disabled jika: bukan RA, atau void, atau RA di status selain DOC_REVIEW
        // RA hanya boleh edit Review di DOC_REVIEW
        const reviewSelectDisabled = (!isRa || isVoided || !isDocReviewStatus) ? 'disabled' : '';
        var reviewSelectValue = isVoided ? '' : (doc.ReviewRa || '');

        // Catatan input
        // BUG FIX: Catatan HANYA boleh aktif jika: User adalah RA DAN Dokumen TIDAK Void DAN bukan Guest
        // RBAC: RA hanya boleh edit Catatan di status DOC_REVIEW
        // Status lain (DRAFT, NEED_REVISION, DOC_IN_PROCESS, DOC_APPROVED) tidak boleh edit Catatan
        // NEED_REVISION: Non-RA boleh edit Catatan HANYA pada dokumen yang diminta revisi (ReviewRa = 'Need Revise')
        let catatanInputDisabled = 'disabled'; // Default to disabled
        const currentStatus = currentStatusForVoid; // Reuse variable
        const docReviewRa = (doc.ReviewRa || '').toUpperCase();

        if (isRa) {
            // RA logic: enabled ONLY at DOC_REVIEW status (not voided)
            // DOC_IN_PROCESS, DRAFT, NEED_REVISION, DOC_APPROVED -> disabled
            if (!isVoided && isDocReviewStatus) {
                catatanInputDisabled = '';
            }
        } else if (!State.isGuest) {
            // Non-RA logic
            const normalizedUserRole = RegalDetail.f_NormalizeRole(State.currentUserRoleCode);
            const docPicRoleRaw = (doc.ConfigUpload && doc.ConfigUpload.TransactionPIC) ? doc.ConfigUpload.TransactionPIC.toString().trim() : '';
            const normalizedDocPicRole = RegalDetail.f_NormalizeRole(docPicRoleRaw);
            const isMyDoc = (normalizedUserRole === normalizedDocPicRole);

            if (currentStatus === C.STATUS.NEED_REVISION) {
                // NEED_REVISION: User hanya boleh edit catatan pada dokumen yang diminta revisi
                // Compare case-insensitively since docReviewRa is already uppercase
                const isReversed = (docReviewRa === (C.REVIEW_STATUS.NEED_REVISE || '').toUpperCase());
                if (isMyDoc && isReversed && !isVoided) {
                    catatanInputDisabled = '';
                    console.log(`getDocumentRow: NEED_REVISION - Catatan enabled for Non-RA user. Doc ReviewRa: "${docReviewRa}", isMyDoc: true`);
                } else {
                    catatanInputDisabled = 'disabled';
                    console.log(`getDocumentRow: NEED_REVISION - Catatan disabled. Doc ReviewRa: "${docReviewRa}", isMyDoc: ${isMyDoc}, isReversed: ${isReversed}`);
                }
            }
            // For other statuses (e.g., DOC_IN_PROCESS), catatan is always disabled for Non-RA
        }

        var hasFile = doc.FilePath ? 'true' : 'false';
        var filePath = doc.FilePath || '';
        var fileNameAlias = doc.FileNameAlias || '';

        return `
            <tr data-doc-id="${doc.TxtId}" 
                data-has-file="${hasFile}" 
                data-file-path="${encodeURIComponent(filePath)}" 
                data-file-name-alias="${encodeURIComponent(fileNameAlias)}"
                data-config-name="${encodeURIComponent(configName)}">
                <td>${index + 1}</td>
                <td>${configName}</td>
                <td>${configPIC}</td>
                <td>
                    <div class="d-flex gap-1 align-items-center">
                        ${uploadBtn}
                        <button class="btn btn-icon btn-info btn-sm btn-view-history" type="button" data-doc-id="${doc.TxtId}" 
                                title="Lihat Riwayat">
                            <i class="ti ti-history"></i>
                        </button>
                    </div>
                </td>
                <td>
                    <select class="form-select review-ra-select" name="review_${index}" data-doc-id="${doc.TxtId}" data-previous-value="${reviewSelectValue}" ${reviewSelectDisabled} onchange="RegalDetail.UpdateReview(this)">
                        <option value="">-</option>
                        <option value="${C.REVIEW_STATUS.OK}" ${reviewSelectValue === C.REVIEW_STATUS.OK ? 'selected' : ''}>${C.REVIEW_STATUS.OK}</option>
                        <option value="${C.REVIEW_STATUS.NEED_REVISE}" ${reviewSelectValue === C.REVIEW_STATUS.NEED_REVISE ? 'selected' : ''}>${C.REVIEW_STATUS.NEED_REVISE}</option>
                    </select>
                </td>
                <td>
                    <textarea class="form-control catatan-input" placeholder="Tulis catatan baru di sini..." rows="2" 
                              data-doc-id="${doc.TxtId}" ${catatanInputDisabled} onchange="RegalDetail.HandleDocumentChange(this)"></textarea>
                </td>
                <td class="text-center">
                    <input class="form-check-input void-checkbox" type="checkbox" data-doc-id="${doc.TxtId}" 
                           style="width: 1.25em; height: 1.25em;" ${isVoided ? 'checked' : ''} 
                           ${voidCheckboxDisabled} ${voidCheckboxAttr}>
                </td>
            </tr>
        `;
    },

    /**
     * Generate document upload button HTML
     */
    getDocumentUploadButton: function (doc, index, isVoided, state) {
        const State = RegalDetail.State;
        const C = RegalDetail.Constants;
        const self = RegalDetail.Templates;

        // DOC_APPROVED: Read-Only with Preview for all roles (RA and Non-RA)
        const currentStatus = (State.currentRegalStatus || '').toUpperCase();
        const isDocApproved = currentStatus === C.STATUS.DOC_APPROVED;

        if (isDocApproved) {
            // DOC_APPROVED: All roles can see Preview button if file exists
            // Upload and Delete buttons are hidden/disabled
            if (doc.FilePath) {
                // File exists - show preview button only (no delete, no upload)
                var encodedPaths = encodeURIComponent(doc.FilePath || '');
                var encodedNames = encodeURIComponent(doc.FileNameAlias || '');
                var configName = doc.ConfigUpload ? doc.ConfigUpload.UploadName : 'N/A';
                var encodedConfigName = encodeURIComponent(configName || '');

                var previewDisabled = isVoided ? 'disabled' : '';
                var previewOnClick = isVoided ? '' : `onclick="RegalDetail.ShowPreviewModal('${encodedPaths}', '${encodedConfigName}', '${doc.TxtId}', '${encodedNames}', true)"`;

                return `<button type="button" 
                            class="btn btn-icon btn-success btn-sm" 
                            ${previewDisabled}
                            ${previewOnClick}
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="${isVoided ? 'Dokumen telah di-void' : 'Pratinjau Dokumen'}">
                        <i class="ti ti-eye"></i>
                    </button>`;
            } else {
                // No file - show placeholder
                return '<span class="text-muted">-</span>';
            }
        }

        // Guest: no button
        if (State.isGuest) {
            return '<span class="text-muted">-</span>';
        }

        // RA: no button (RA tidak boleh upload/delete di semua status termasuk DOC_REVIEW)
        // DOC_REVIEW: RA hanya boleh edit Review/Catatan, tidak boleh upload/delete
        if (State.isUserRA) {
            const isDocReview = (State.currentRegalStatus || '').toUpperCase() === C.STATUS.DOC_REVIEW;
            const isSubmitOss = (State.currentRegalStatus || '').toUpperCase() === C.STATUS.SUBMIT_OSS;

            if (isDocReview || isSubmitOss) {
                // DOC_REVIEW or SUBMIT_OSS: RA tidak boleh upload/delete, tapi boleh preview jika ada file
                if (doc.FilePath) {
                    // File exists - show preview button only (no delete)
                    var encodedPaths = encodeURIComponent(doc.FilePath || '');
                    var encodedNames = encodeURIComponent(doc.FileNameAlias || '');
                    var configName = doc.ConfigUpload ? doc.ConfigUpload.UploadName : 'N/A';

                    var encodedConfigName = encodeURIComponent(configName || '');

                    var previewDisabled = isVoided ? 'disabled' : '';
                    var previewOnClick = isVoided ? '' : `onclick="RegalDetail.ShowPreviewModal('${encodedPaths}', '${encodedConfigName}', '${doc.TxtId}', '${encodedNames}', true)"`;

                    return `<button type="button" 
                                class="btn btn-icon btn-success btn-sm" 
                                ${previewDisabled}
                                ${previewOnClick}
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="${isVoided ? 'Dokumen telah di-void' : 'Pratinjau Dokumen'}">
                            <i class="ti ti-eye"></i>
                        </button>`;
                } else {
                    // No file - show placeholder
                    return '<span class="text-muted">-</span>';
                }
            }
            return '<span class="text-muted">-</span>';
        }

        // ROLE MATCHING: Non-RA (BD, PCD, PDV) - Cek role matching sebelum render tombol
        // TASK 2: Perbaiki logika isMyDoc - lebih fleksibel dan robust
        if (!State.isUserRA && !State.isGuest) {
            // TASK 2: Ambil user role dengan case-insensitive dan trim
            const rawUserRole = (State.currentUserRoleCode || '').toString().trim();
            const userRole = rawUserRole.toUpperCase();

            // TASK 2: Ambil doc PIC role dengan case-insensitive dan trim
            const docPicRoleRaw = (doc.ConfigUpload && doc.ConfigUpload.TransactionPIC) ? doc.ConfigUpload.TransactionPIC.toString().trim() : '';
            const picRole = docPicRoleRaw.toUpperCase();

            // TASK 2: Normalize kedua role untuk konsistensi
            const normalizedUserRole = RegalDetail.f_NormalizeRole(userRole);
            const normalizedDocPicRole = RegalDetail.f_NormalizeRole(picRole);

            // TASK 2: Logging detail untuk debugging
            console.log(`getDocumentUploadButton: TASK 2 DEBUG - Raw User Role: "${rawUserRole}", Normalized: "${normalizedUserRole}"`);
            console.log(`getDocumentUploadButton: TASK 2 DEBUG - Raw Doc PIC: "${docPicRoleRaw}", Normalized: "${normalizedDocPicRole}"`);
            console.log(`getDocumentUploadButton: TASK 2 DEBUG - ConfigUpload exists: ${!!doc.ConfigUpload}, Status: "${State.currentRegalStatus}"`);

            // TASK 2: Jika userRole kosong (gagal ambil dari backend), log error tapi jangan langsung disable
            if (!userRole || userRole === '') {
                console.error(`getDocumentUploadButton: TASK 2 ERROR - currentUserRoleCode is EMPTY! User may not be able to upload. Please check UserInfo in response.`);
                // TASK 2: Untuk sementara, jika role kosong, jangan render button (lebih aman)
                // Tapi log error agar developer tahu ada masalah
                return '<span class="text-muted" title="Role code tidak ditemukan">-</span>';
            }

            // TASK 2: Logika isMyDoc - lebih fleksibel dengan normalize
            // User Role harus sama dengan Transaction PIC pada baris tersebut setelah normalize
            const isMyDoc = (normalizedUserRole === normalizedDocPicRole);

            // TASK 3: Pastikan status DOC_IN_PROCESS dicek
            const isDocInProcess = (State.currentRegalStatus || '').toUpperCase() === C.STATUS.DOC_IN_PROCESS;

            if (!isMyDoc) {
                console.warn(`getDocumentUploadButton: TASK 2 - Role mismatch - User: "${normalizedUserRole}" (from "${rawUserRole}"), Doc PIC: "${normalizedDocPicRole}" (from "${docPicRoleRaw}") - Hiding button`);
                return '<span class="text-muted">-</span>';
            }

            // TASK 3: Log untuk debugging dengan info status
            console.log(`getDocumentUploadButton: TASK 2/3 SUCCESS - Role match: "${normalizedUserRole}" === "${normalizedDocPicRole}", Status: "${State.currentRegalStatus}", isDocInProcess: ${isDocInProcess} - Showing button`);
        }

        // Non-RA dengan role matching: generate button based on file existence
        // Get current status and review status for NEED_REVISION logic
        // Note: currentStatus already declared at line 493 for DOC_APPROVED check, reuse it here
        const isDocInProcess = currentStatus === C.STATUS.DOC_IN_PROCESS;
        const isNeedRevision = currentStatus === C.STATUS.NEED_REVISION;
        const docReviewRa = (doc.ReviewRa || '').trim();
        const isReversed = (docReviewRa === C.REVIEW_STATUS.NEED_REVISE);

        if (doc.FilePath) {
            // File exists - preview/delete button
            var encodedPaths = encodeURIComponent(doc.FilePath || '');
            var encodedNames = encodeURIComponent(doc.FileNameAlias || '');
            var configName = doc.ConfigUpload ? doc.ConfigUpload.UploadName : 'N/A';

            var encodedConfigName = encodeURIComponent(configName || '');

            // RBAC: Determine if preview/delete should be enabled
            var previewDisabled = isVoided;
            var canDelete = false;

            if (!isVoided) {
                if (isDocInProcess) {
                    // DOC_IN_PROCESS: Allow preview and delete
                    canDelete = true;
                    previewDisabled = false;
                } else if (isNeedRevision && isReversed) {
                    // NEED_REVISION: Allow preview and delete ONLY if ReviewRa = 'Need Revise'
                    canDelete = true;
                    previewDisabled = false;
                    console.log(`getDocumentUploadButton: NEED_REVISION - Preview/Delete enabled. Doc ReviewRa: "${docReviewRa}" (Need Revise)`);
                } else {
                    // Other statuses or NEED_REVISION but not reversed: Disable
                    previewDisabled = true;
                    canDelete = false;
                    if (isNeedRevision) {
                        console.log(`getDocumentUploadButton: NEED_REVISION - Preview/Delete disabled. Doc ReviewRa: "${docReviewRa}" (not "Need Revise")`);
                    }
                }
            }

            var previewOnClick = !previewDisabled ? `onclick="RegalDetail.ShowPreviewModal('${encodedPaths}', '${encodedConfigName}', '${doc.TxtId}', '${encodedNames}')"` : '';
            var previewTitle = isVoided ? 'Dokumen telah di-void' : (previewDisabled ? 'Akses tidak tersedia' : 'Pratinjau Dokumen');

            // HANYA tampilkan button preview (button delete dihilangkan karena delete sudah ada di preview modal)
            if (!previewDisabled) {
                return `<button type="button" 
                            class="btn btn-icon btn-success btn-sm" 
                            ${previewOnClick}
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="${previewTitle}">
                        <i class="ti ti-eye"></i>
                    </button>`;
            }

            return '<span class="text-muted">-</span>';
        } else {
            // No file - upload button
            // RBAC: Non-RA users can upload when status is DOC_IN_PROCESS or NEED_REVISION (with restrictions)
            var isUploadDisabled = isVoided;
            var uploadDisabledReason = '';

            // Check status restriction for Non-RA users
            if (!isVoided) {
                if (isDocInProcess) {
                    // DOC_IN_PROCESS: Allow upload
                    isUploadDisabled = false;
                    console.log(`getDocumentUploadButton: RBAC - Upload enabled for Non-RA user. Status: "${State.currentRegalStatus}" is DOC_IN_PROCESS`);
                } else if (isNeedRevision) {
                    // NEED_REVISION: User hanya boleh upload pada dokumen yang diminta revisi (ReviewRa = 'Need Revise')
                    if (isReversed) {
                        isUploadDisabled = false;
                        console.log(`getDocumentUploadButton: NEED_REVISION - Upload enabled for Non-RA user. Doc ReviewRa: "${docReviewRa}", isReversed: true`);
                    } else {
                        isUploadDisabled = true;
                        uploadDisabledReason = 'Hanya dokumen yang diminta revisi yang dapat diubah';
                        console.log(`getDocumentUploadButton: NEED_REVISION - Upload disabled. Doc ReviewRa: "${docReviewRa}" (not "Need Revise")`);
                    }
                } else {
                    // Disable upload if status is not DOC_IN_PROCESS or NEED_REVISION
                    isUploadDisabled = true;
                    uploadDisabledReason = 'Upload hanya dapat dilakukan saat status Document In Process atau Need Revision (untuk dokumen yang diminta revisi)';
                    console.log(`getDocumentUploadButton: RBAC - Upload disabled for Non-RA user. Status: "${State.currentRegalStatus}", Required: "${C.STATUS.DOC_IN_PROCESS}" or "${C.STATUS.NEED_REVISION}"`);
                }
            } else {
                // Voided - keep disabled
                uploadDisabledReason = 'Dokumen telah di-void';
            }

            var uploadDisabledAttr = isUploadDisabled ? 'disabled' : '';
            var uploadOnClick = !isUploadDisabled ? `onclick="RegalDetail.ShowUploadModal('${doc.TxtId}', ${index})"` : '';
            var buttonTitle = isUploadDisabled ? (uploadDisabledReason || 'Upload tidak tersedia') : 'Upload Dokumen';

            return `<button type="button" 
                        class="btn btn-icon btn-success btn-sm" 
                        ${uploadDisabledAttr}
                        ${uploadOnClick}
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="${buttonTitle}">
                    <i class="ti ti-upload"></i>
                </button>`;
        }
    },

    /**
     * Generate status history timeline item HTML
     */
    getStatusHistoryRow: function (item) {
        const Utils = RegalDetail.Utils;

        var createdDateText = item.CreatedDate ? moment(item.CreatedDate).format('DD MMM YYYY, HH:mm') : '';
        var statusDescription = Utils.htmlEncode(item.StatusDescription || '');
        var notesDescription = Utils.htmlEncode(item.Notes || 'No notes');
        var creationDisplay = Utils.htmlEncode(item.CreationDisplay || 'System');

        // Extract username and role from CreationDisplay (format: "Username (Role)")
        var username = creationDisplay;
        var role = '';
        var match = creationDisplay.match(/^(.+?)\s*\((.+?)\)$/);
        if (match) {
            username = match[1].trim();
            role = match[2].trim();
        }

        // Determine status class for color coding
        var statusClass = 'status-draft';
        var statusLower = statusDescription.toLowerCase();
        if (statusLower.includes('review')) statusClass = 'status-review';
        else if (statusLower.includes('approved') || statusLower.includes('ok')) statusClass = 'status-approved';
        else if (statusLower.includes('revision') || statusLower.includes('revise')) statusClass = 'status-revision';
        else if (statusLower.includes('oss') || statusLower.includes('submit')) statusClass = 'status-oss';

        return `
            <div class="timeline-item ${statusClass}">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <div class="timeline-header">
                        <span class="timeline-status">${statusDescription}</span>
                        ${createdDateText ? `<span class="timeline-date">${createdDateText}</span>` : ''}
                    </div>
                    
                    <div class="timeline-user-info">
                        <span class="text-muted me-1">by</span>
                        <span class="timeline-username">${username}</span>
                        ${role ? `<span class="timeline-role">${role}</span>` : ''}
                    </div>

                    ${notesDescription !== 'No notes' ? `<div class="timeline-notes">${notesDescription}</div>` : ''}
                </div>
            </div>
        `;
    },

    /**
     * Generate final label file row HTML
     */
    getFinalLabelFileRow: function (file, index) {
        const Utils = RegalDetail.Utils;
        const C = RegalDetail.Constants;
        const State = RegalDetail.State;

        const filePath = file.FilePath || file.filePath || '';
        const fileName = file.FileNameAlias || file.fileNameAlias || file.FilePath?.split('/').pop() || file.filePath?.split('/').pop() || 'Unknown';
        const createdDate = file.CreatedDate || file.createdDate;
        const createdBy = file.CreatedBy || file.createdBy || '-';
        const fileTxtId = file.TxtId || file.txtId || '';

        const formattedDate = createdDate ? moment(createdDate).format(C.FILE.DATETIME_FORMAT) : '-';
        const encodedPath = Utils.htmlEncode(filePath);
        const encodedName = Utils.htmlEncode(fileName);
        const encodedId = Utils.htmlEncode(fileTxtId);
        const encodedBy = Utils.htmlEncode(createdBy);

        // Check if user is BD (can delete files only on DRAFT/NEED_REVISION)
        const currentUserRole = (State.currentUserRoleCode || '').toString().trim().toUpperCase();
        const isUserBDRole = State.isUserBD || currentUserRole === 'BD' || currentUserRole.includes('BUSINESS') || currentUserRole.includes('BD');

        // Check Final Label status - delete only allowed on DRAFT/NEED_REVISION
        const statusFinalLabel = (State.currentStatusFinalLabel || '').toUpperCase();
        const isFinalLabelDraftOrRevise = (!statusFinalLabel || statusFinalLabel === '' ||
            statusFinalLabel === C.STATUS.DRAFT ||
            statusFinalLabel === C.STATUS.NEED_REVISION ||
            statusFinalLabel === 'REVISE');

        // Delete button only visible for BD role AND when status is DRAFT or NEED_REVISION
        const canDelete = isUserBDRole && isFinalLabelDraftOrRevise;
        const deleteButtonHtml = canDelete ? `
                    <button type="button" 
                            class="btn btn-icon btn-danger btn-sm btn-delete-final-label-file" 
                            data-file-txt-id="${encodedId}"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Hapus File">
                        <i class="ti ti-trash"></i>
                    </button>` : '';

        return `
            <tr>
                <td>${index + 1}</td>
                <td>${encodedName}</td>
                <td>${formattedDate}</td>
                <td>${encodedBy}</td>
                <td class="text-center">
                    <a href="${encodedPath}" 
                       target="_blank" 
                       class="btn btn-icon btn-info btn-sm me-1" 
                       download="${encodedName}"
                       data-bs-toggle="tooltip"
                       data-bs-placement="top"
                       title="Download File">
                        <i class="ti ti-download"></i>
                    </a>
                    <button type="button" 
                            class="btn btn-icon btn-success btn-sm btn-preview-final-label-file me-1" 
                            data-file-path="${encodedPath}" 
                            data-file-name="${encodedName}"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Pratinjau File">
                        <i class="ti ti-eye"></i>
                    </button>
                    ${deleteButtonHtml}
                </td>
            </tr>
        `;
    },

    /**
     * Get empty table row message
     */
    getEmptyTableRow: function (message, colspan) {
        return `<tr><td colspan="${colspan}" class="text-center text-muted">${message}</td></tr>`;
    },

    /**
     * Get loading row
     */
    getLoadingRow: function (colspan) {
        return `<tr><td colspan="${colspan}" class="text-center"><i class="ti ti-loader-2 ti-spin"></i> Memuat data...</td></tr>`;
    },

    /**
     * Get Final Label history row
     * CASE-INSENSITIVE: Supports both PascalCase (C# style) and camelCase (JS style) property names
     */
    getFinalLabelHistoryRow: function (history, index) {
        const Utils = RegalDetail.Utils;
        const C = RegalDetail.Constants;

        // CASE-INSENSITIVE: Support both Action (PascalCase) and action (camelCase)
        const actionRaw = history.Action || history.action || '-';
        const action = Utils.htmlEncode(actionRaw).toUpperCase(); // Normalize to uppercase for comparison

        // CASE-INSENSITIVE: Support both formats for all properties
        const sourceType = history.SourceType || history.sourceType || '';
        const note = Utils.htmlEncode(history.Note || history.note || '-');
        const createdBy = Utils.htmlEncode(history.CreatedBy || history.createdBy || '-');
        const createdRole = Utils.htmlEncode(history.CreatedRole || history.createdRole || '-');
        const createdDateRaw = history.CreatedDate || history.createdDate;
        const createdDate = createdDateRaw ? moment(createdDateRaw).format(C.FILE.DATETIME_FORMAT) : '-';

        // Map SourceType to friendly name
        const actionTypeMap = {
            'FINAL_LABEL_REVIEW_REQUEST': 'Review Request',
            'FINAL_LABEL_RA_APPROVAL': 'RA Approval',
            'FINAL_LABEL_PDV_APPROVAL': 'PDV Approval',
            'FINAL_LABEL_PCD_APPROVAL': 'PCD Approval',
            'FINAL_LABEL_FILE_UPLOAD': 'File Management',
            'FINAL_LABEL_FILE_DELETE': 'File Management',
            'FINAL_LABEL_STATUS_REVISE': 'Status Change',
            'FINAL_LABEL_STATUS_APPROVED': 'Status Change'
        };

        const typeFriendly = actionTypeMap[sourceType] || sourceType;

        // Color coding for Action badge (case-insensitive comparison)
        let actionBadgeClass = 'bg-secondary'; // Default
        if (action === 'APPROVE') {
            actionBadgeClass = 'bg-success';
        } else if (action === 'REJECT' || action === 'DELETE') {
            actionBadgeClass = 'bg-danger';
        } else if (action === 'REQUEST') {
            actionBadgeClass = 'bg-primary';
        } else if (action === 'UPLOAD') {
            actionBadgeClass = 'bg-info';
        } else if (action === 'STATUS_CHANGE') {
            actionBadgeClass = 'bg-warning text-dark';
        }

        return `
            <tr>
                <td class="text-center">${index + 1}</td>
                <td class="text-center"><span class="badge ${actionBadgeClass}">${action}</span></td>
                <td>${typeFriendly}</td>
                <td>${note}</td>
                <td>${createdBy}</td>
                <td class="text-center">${createdRole}</td>
                <td>${createdDate}</td>
            </tr>
        `;
    }
};

// ============================================================================
// SECTION 5: API WRAPPER (Optional - for async/await support)
// ============================================================================
RegalDetail.API = {
    /**
     * Make AJAX request with promise support
     */
    request: function (options) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: options.type || 'POST',
                url: options.url,
                data: options.data,
                contentType: options.contentType || 'application/json; charset=utf-8',
                processData: options.processData !== false,
                headers: options.headers || {},
                beforeSend: options.beforeSend || function () { },
                success: function (response, status, xhr) {
                    if (xhr.responseText && xhr.responseText.includes("!DOCTYPE html")) {
                        if (options.onSessionExpired) {
                            options.onSessionExpired();
                        } else {
                            clsGlobal.swalWarningRedirect(RegalDetail.Constants.MESSAGES.SESSION_EXPIRED, window.location.href);
                        }
                        reject("Session expired");
                        return;
                    }
                    resolve(response);
                },
                error: function (xhr, status, error) {
                    reject({ xhr, status, error });
                }
            });
        });
    }
};

// ============================================================================
// SECTION 6: ACTIONS (Business Logic Functions)
// ============================================================================
RegalDetail.Actions = {
    /**
     * Ensure regal is selected
     */
    ensureRegalSelection: function () {
        const regalId = $('#hdRegalId').val();
        if (!regalId) {
            clsGlobal.swalWarning(RegalDetail.Constants.MESSAGES.REGAL_NOT_READY);
            return null;
        }
        return regalId;
    },

    /**
     * Validate review and catatan
     */
    validateReviewAndCatatan: function () {
        const C = RegalDetail.Constants;
        var hasError = false;
        var errorMessages = [];

        $(C.SELECTORS.DOC_TABLE + ' tbody tr').each(function () {
            var $row = $(this);
            var $reviewSelect = $row.find('.review-ra-select');
            var $catatanInput = $row.find('.catatan-input');

            // Skip if row is voided (disabled)
            if ($reviewSelect.prop('disabled')) {
                return true; // Continue to next row
            }

            var reviewValue = $reviewSelect.val();
            var catatanValue = ($catatanInput.val() || '').trim();

            if (reviewValue === C.REVIEW_STATUS.NEED_REVISE && !catatanValue) {
                hasError = true;
                var docName = $row.find('td:eq(1)').text().trim();
                errorMessages.push(`Dokumen "${docName}" memiliki status "${C.REVIEW_STATUS.NEED_REVISE}" tetapi Catatan belum diisi.`);
            }
        });

        if (hasError) {
            clsGlobal.swalWarning(errorMessages.join('<br>'));
            return false;
        }

        return true;
    },

    /**
     * Build regal save payload
     */
    buildRegalSavePayload: function () {
        const Utils = RegalDetail.Utils;

        const approvalRaValue = $('#approval_ra').val();
        const approvalPdValue = $('#approval_pd').val();
        const approvalPkgValue = $('#approval_pkg').val();

        const finalLabelSection = {
            ApprovalRa: approvalRaValue,
            ApprovalRaStatus: approvalRaValue,
            ApprovalRaDate: Utils.convertDateToISO($('#approval_ra_date').val()),
            NotesRa: $('#notes_ra').val(),
            ApprovalPd: approvalPdValue,
            ApprovalPdStatus: approvalPdValue,
            ApprovalPdDate: Utils.convertDateToISO($('#approval_pd_date').val()),
            NotesPd: $('#notes_pd').val(),
            ApprovalPkg: approvalPkgValue,
            ApprovalPkgStatus: approvalPkgValue,
            ApprovalPkgDate: Utils.convertDateToISO($('#approval_pkg_date').val()),
            NotesPkg: $('#notes_pkg').val()
        };

        const kbliValue = $('#kbli').val() || '';
        const C = RegalDetail.Constants;

        // Collect Review and Catatan data from all rows
        const documents = [];
        $(C.SELECTORS.DOC_TABLE + ' tbody tr').each(function () {
            const $row = $(this);

            if ($row.find('td').length === 0 || $row.text().trim() === 'Tidak ada dokumen') {
                return;
            }

            const docId = $row.find('select.review-ra-select').data('doc-id') ||
                $row.find('.catatan-input').data('doc-id') ||
                $row.data('doc-id');

            if (!docId) {
                console.warn("buildRegalSavePayload - DocId not found in row, skipping");
                return;
            }

            const reviewRa = $row.find('select.review-ra-select').val() || '';
            const catatan = ($row.find('.catatan-input').val() || '').trim();

            documents.push({
                TxtId: docId,
                ReviewRa: reviewRa && reviewRa.trim() !== '' ? reviewRa : null,
                Catatan: catatan && catatan.trim() !== '' ? catatan : null
            });
        });

        console.log("buildRegalSavePayload - Collected documents:", documents);

        // Task 1: OSS Section - Ambil PicRaOss dari Header (#picRAOSS) agar sinkron dengan TrRegalOss
        // Prioritas: Ambil dari Header, bukan dari Tab OSS (#oss_PicRA) yang mungkin kosong/hidden
        const picRaOssFromHeader = ($('#picRAOSS').val() || '').trim();
        const ossSection = {
            PicRaOss: picRaOssFromHeader || null // Ambil dari Header agar sinkron
        };

        return {
            Header: {
                RegalId: $('#hdRegalId').val(),
                NomorIzinEdarExisting: $('#nomorIzinEdar').val(),
                NomorIzinEdarId: $('#nomorIzinEdarId').val() || null, // Task 5: Include NomorIzinEdarId in save payload
                MasaBerlakuStart: Utils.convertDateToISO($('#masaBerlakuStart').val()),
                MasaBerlakuEnd: Utils.convertDateToISO($('#masaBerlakuEnd').val()),
                PicRaOss: picRaOssFromHeader || null,
                NamaJenis: $('#namaJenis').val(),
                VerforNo: $('#verforNo').val(),
                Kbli: kbliValue,
                TxtTakaranKurang: $('#txtTakaranKurang').val() || null
            },
            FinalLabel: finalLabelSection,
            Oss: ossSection, // Task 1: Include OSS section to sync PicRaOss to TrRegalOss table
            Documents: documents
        };
    },

    /**
     * Save single document input (for upload modal)
     * Only validates and saves the document that is being uploaded
     */
    saveSingleDocumentInput: function (docId) {
        const Utils = RegalDetail.Utils;
        const C = RegalDetail.Constants;

        return new Promise((resolve, reject) => {
            if (!docId) {
                console.warn("saveSingleDocumentInput - docId is empty");
                resolve(); // Skip if no docId
                return;
            }

            // Find the row for this specific document
            const $row = $(C.SELECTORS.DOC_TABLE + ' tbody tr').filter(function () {
                return $(this).data('doc-id') === docId;
            });

            if ($row.length === 0) {
                console.warn("saveSingleDocumentInput - Row not found for docId:", docId);
                resolve(); // Skip if row not found
                return;
            }

            const reviewValue = $row.find('select.review-ra-select').val() || '';
            const catatanValue = ($row.find('.catatan-input').val() || '').trim();

            // Validation - ONLY for the document being uploaded
            if (reviewValue === C.REVIEW_STATUS.NEED_REVISE && (!catatanValue || catatanValue === '')) {
                const docName = $row.find('td:eq(1)').text().trim() || 'Dokumen tanpa nama';
                reject(`Dokumen "${docName}" memiliki status "${C.REVIEW_STATUS.NEED_REVISE}" tetapi Catatan belum diisi.`);
                return;
            }

            // If no changes, skip save
            if (!reviewValue && !catatanValue) {
                console.log("saveSingleDocumentInput - No changes for docId:", docId);
                resolve();
                return;
            }

            const updateData = {
                ReviewRa: reviewValue && reviewValue.trim() !== '' ? reviewValue : null,
                Catatan: catatanValue && catatanValue.trim() !== '' ? catatanValue : null
            };

            var data = {
                __RequestVerificationToken: Utils.getAntiForgeryToken(),
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
                        clsGlobal.swalWarningRedirect(C.MESSAGES.SESSION_EXPIRED, window.location.href);
                        reject("Session expired");
                    }
                    else {
                        if (retDat.bitSuccess == true) {
                            console.log(`saveSingleDocumentInput - Saved Doc [${docId}]: Review=[${updateData.ReviewRa}], Catatan=[${updateData.Catatan}]`);
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
    },

    /**
     * Save visible document inputs (for all documents)
     */
    saveVisibleDocumentInputs: function () {
        const Utils = RegalDetail.Utils;
        const C = RegalDetail.Constants;
        const promises = [];
        const errors = [];

        $(C.SELECTORS.DOC_TABLE + ' tbody tr').each(function () {
            const $row = $(this);

            if ($row.find('td').length === 0 || $row.text().trim() === 'Tidak ada dokumen') {
                return;
            }

            const docId = $row.find('select.review-ra-select').data('doc-id') ||
                $row.find('.catatan-input').data('doc-id') ||
                $row.data('doc-id');

            if (!docId) {
                console.warn("saveVisibleDocumentInputs - DocId not found in row, skipping");
                return;
            }

            const reviewValue = $row.find('select.review-ra-select').val() || '';
            const catatanValue = ($row.find('.catatan-input').val() || '').trim();

            // Validation
            if (reviewValue === C.REVIEW_STATUS.NEED_REVISE && (!catatanValue || catatanValue === '')) {
                const docName = $row.find('td:eq(1)').text().trim() || 'Dokumen tanpa nama';
                errors.push(`Dokumen "${docName}" memiliki status "${C.REVIEW_STATUS.NEED_REVISE}" tetapi Catatan belum diisi.`);
                return;
            }

            if (!reviewValue && !catatanValue) {
                return;
            }

            const updateData = {
                ReviewRa: reviewValue && reviewValue.trim() !== '' ? reviewValue : null,
                Catatan: catatanValue && catatanValue.trim() !== '' ? catatanValue : null
            };

            const updatePromise = new Promise((resolve, reject) => {
                var data = {
                    __RequestVerificationToken: Utils.getAntiForgeryToken(),
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
                            clsGlobal.swalWarningRedirect(C.MESSAGES.SESSION_EXPIRED, window.location.href);
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

        if (errors.length > 0) {
            return Promise.reject(errors.join('<br>'));
        }

        if (promises.length === 0) {
            console.log("saveVisibleDocumentInputs - No documents to save");
            return Promise.resolve();
        }

        console.log(`saveVisibleDocumentInputs - Saving ${promises.length} documents...`);
        return Promise.all(promises);
    },

    /**
     * Save regal data
     */
    saveRegalData: function () {
        const C = RegalDetail.Constants;
        const Utils = RegalDetail.Utils;
        const Actions = RegalDetail.Actions;

        const regalId = $('#hdRegalId').val();
        if (!regalId) {
            const message = C.MESSAGES.REGAL_NOT_READY;
            clsGlobal.swalWarning(message);
            return Promise.reject(message);
        }

        if (!Actions.validateReviewAndCatatan()) {
            return Promise.reject(C.MESSAGES.VALIDATION_FAILED);
        }

        const token = Utils.getAntiForgeryToken();
        const payload = Actions.buildRegalSavePayload();

        return RegalDetail.API.request({
            type: "POST",
            url: base_path + "/Regal/SaveRegalDetail",
            data: JSON.stringify(payload),
            headers: {
                'RequestVerificationToken': token
            },
            beforeSend: function () {
                clsGlobal.showLoading();
            },
            onSessionExpired: function () {
                clsGlobal.swalWarningRedirect("Sesi Anda telah berakhir, silakan login kembali", window.location.href);
            }
        }).then(function (retDat) {
            clsGlobal.hideLoading();
            if (retDat.bitSuccess === true) {
                return retDat;
            } else if (retDat.txtMessage === 'Validation' || retDat.txtMessage === 'gagal') {
                const warningMessage = retDat.objData || "Validasi gagal. Silakan periksa kembali data Anda.";
                clsGlobal.swalWarning(warningMessage);
                return Promise.reject(warningMessage);
            } else {
                const errorMessage = retDat.txtMessage || "Gagal menyimpan data Registrasi Lokal.";
                clsGlobal.swalError(errorMessage);
                return Promise.reject(errorMessage);
            }
        }).catch(function (error) {
            clsGlobal.hideLoading();
            if (error && error.xhr) {
                const errorMessage = error.xhr.responseJSON?.txtMessage || error.xhr.responseText || "Terjadi kesalahan saat menyimpan data Registrasi Lokal.";
                clsGlobal.swalError(errorMessage);
                return Promise.reject(errorMessage);
            }
            return Promise.reject(error);
        });
    },

    /**
     * Send regal command
     */
    sendRegalCommand: function (endpoint, payload, successMessage) {
        const Utils = RegalDetail.Utils;
        const token = Utils.getAntiForgeryToken();

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
    },

    /**
     * Submit regal
     */
    submitRegal: function () {
        const Actions = RegalDetail.Actions;
        const C = RegalDetail.Constants;
        const regalId = Actions.ensureRegalSelection();
        if (!regalId) {
            return;
        }

        // Task 1: Validasi field wajib sebelum submit
        const missingFields = [];

        // Cek Nama Jenis (wajib diisiswal
        const namaJenis = ($('#namaJenis').val() || '').trim();
        if (!namaJenis) {
            missingFields.push('Nama Jenis');
        }

        // Cek Verfor No.
        const verforNo = ($('#verforNo').val() || '').trim();
        if (!verforNo) {
            missingFields.push('Verfor No.');
        }

        // Cek KBLI
        const kbli = ($('#kbli').val() || '').trim();
        if (!kbli) {
            missingFields.push('KBLI');
        }

        // Cek Nomor Izin Edar Existing
        const nomorIzinEdar = ($('#nomorIzinEdar').val() || '').trim();
        if (!nomorIzinEdar) {
            missingFields.push('Nomor Izin Edar Existing');
        }

        // Cek PIC RA OSS
        const picRAOSS = ($('#picRAOSS').val() || '').trim();
        if (!picRAOSS) {
            missingFields.push('PIC RA OSS');
        }

        // Jika ada field yang kosong, tampilkan warning dan hentikan proses
        if (missingFields.length > 0) {
            const missingFieldsList = missingFields.join(', ');
            clsGlobal.swalWarning(`Data berikut wajib diisi: ${missingFieldsList}`);
            return;
        }

        // NEW VALIDATION: Check if all documents are void
        let totalDocuments = 0;
        let voidDocuments = 0;

        $(C.SELECTORS.DOC_TABLE + ' tbody tr').each(function () {
            const $row = $(this);

            // Skip empty rows
            if ($row.find('td').length === 0 || $row.text().trim() === 'Tidak ada dokumen') {
                return true; // continue
            }

            totalDocuments++;

            const $voidCheckbox = $row.find('.void-checkbox');
            if ($voidCheckbox.is(':checked')) {
                voidDocuments++;
            }
        });

        // If all documents are void, show warning and stop
        if (totalDocuments > 0 && totalDocuments === voidDocuments) {
            clsGlobal.swalWarning('Tidak dapat memproses dokumen. Tidak boleh semua dokumen di-void. Minimal harus ada satu dokumen yang tidak void.');
            return;
        }

        Actions.saveRegalData()
            .then(() => {
                Swal.fire({
                    title: "Process Document Registrasi Lokal ini ke Masing-masing PIC?",
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
                        Actions.sendRegalCommand("/Regal/ProcessRegalDocument", { RegalId: regalId }, "Registrasi Lokal berhasil di-process");
                    }
                });
            })
            .catch(() => {
                // Error handling sudah ditangani di saveRegalData
            });
    },

    /**
     * Validate all non-void documents have Review = "OK" for Approve action
     * Returns: { isValid: boolean, errorMessage: string }
     */
    validateAllDocumentsApproved: function () {
        const C = RegalDetail.Constants;
        const unreviewedDocs = []; // Kita tampung nama dokumennya saja di sini

        $(C.SELECTORS.DOC_TABLE + ' tbody tr').each(function () {
            const $row = $(this);
            const $reviewSelect = $row.find('.review-ra-select');
            const $voidCheckbox = $row.find('.void-checkbox');

            // Skip if row is voided or empty
            if ($row.find('td').length === 0 || $row.text().trim() === 'Tidak ada dokumen') {
                return true;
            }

            const isVoided = $voidCheckbox.is(':checked');

            // Skip voided documents
            if (isVoided) {
                return true;
            }

            // Check review status for non-void documents
            const reviewValue = ($reviewSelect.val() || '').trim();
            const docName = $row.find('td:eq(1)').text().trim();

            if (reviewValue !== C.REVIEW_STATUS.OK) {
                // Masukkan ke array dengan format list item dan BOLD pada nama dokumen
                unreviewedDocs.push(`<li><b>${docName}</b></li>`);
            }
        });

        if (unreviewedDocs.length > 0) {
            // Gabungkan menjadi string HTML yang rapi
            // style="text-align: left" ditambahkan agar listnya rata kiri (jika pakai SweetAlert biasanya defaultnya center)
            const headerMessage = 'Ada Dokumen yang belum di review :<br>';
            const listMessage = '<ul style="text-align: left; margin-top:5px;">' + unreviewedDocs.join('') + '</ul>';
            const footerMessage = '<br>Mohon review dokumen tersebut agar status menjadi "OK".';

            return {
                isValid: false,
                // Hasil gabungan HTML
                errorMessage: headerMessage + listMessage + footerMessage
            };
        }

        return { isValid: true, errorMessage: '' };
    },

    /**
     * Validate at least one non-void document has Review = "Need Revise" for Return action
     * Returns: { isValid: boolean, errorMessage: string }
     */
    validateAtLeastOneNeedRevise: function () {
        const C = RegalDetail.Constants;
        let hasNeedRevise = false;
        const needReviseDocs = [];

        $(C.SELECTORS.DOC_TABLE + ' tbody tr').each(function () {
            const $row = $(this);
            const $reviewSelect = $row.find('.review-ra-select');
            const $voidCheckbox = $row.find('.void-checkbox');

            // Skip if row is voided or empty
            if ($row.find('td').length === 0 || $row.text().trim() === 'Tidak ada dokumen') {
                return true; // Continue to next row
            }

            const isVoided = $voidCheckbox.is(':checked');

            // Skip voided documents
            if (isVoided) {
                return true; // Continue to next row
            }

            // Check review status for non-void documents
            const reviewValue = ($reviewSelect.val() || '').trim();
            const docName = $row.find('td:eq(1)').text().trim();

            if (reviewValue === C.REVIEW_STATUS.NEED_REVISE) {
                hasNeedRevise = true;
                needReviseDocs.push(docName);
            }
        });

        if (!hasNeedRevise) {
            return {
                isValid: false,
                errorMessage: 'Tidak dapat  revisi. Minimal harus ada satu dokumen (yang tidak void) dengan status review "Need Revise".'
            };
        }

        return { isValid: true, errorMessage: '', needReviseDocs: needReviseDocs };
    },

    /**
     * Approve regal
     */
    approveRegal: function () {
        const Actions = RegalDetail.Actions;
        const State = RegalDetail.State;
        const C = RegalDetail.Constants;
        const regalId = Actions.ensureRegalSelection();
        if (!regalId) {
            return;
        }

        // CRITICAL VALIDATION: Check if status is DOC_REVIEW and user is RA
        const isDocReview = (State.currentRegalStatus || '').toUpperCase() === C.STATUS.DOC_REVIEW;
        const isRA = State.isUserRA && !State.isGuest;

        if (isDocReview && isRA) {
            // Validate all non-void documents have Review = "OK"
            const validation = Actions.validateAllDocumentsApproved();
            if (!validation.isValid) {

                Swal.fire({
                    icon: 'warning',
                    title: 'Perhatian',
                    html: validation.errorMessage,
                    confirmButtonText: "OK",
                    customClass: {
                        confirmButton: 'btn btn-primary',
                    }
                });
                return;
            }
        }

        Actions.saveRegalData()
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
                        Actions.sendRegalCommand("/Regal/ApproveRegal", { RegalId: regalId }, "Registrasi Lokal berhasil disetujui");

                        /*Actions.createBpomFromRegal(regalId);*/
                    }
                });
            })
            .catch(() => {
                // Error handling sudah ditangani di saveRegalData
            });
    },

    /**
     * Return regal for revision
     */
    returnRegal: function () {
        const Actions = RegalDetail.Actions;
        const State = RegalDetail.State;
        const C = RegalDetail.Constants;
        const regalId = Actions.ensureRegalSelection();
        if (!regalId) {
            return;
        }

        // CRITICAL VALIDATION: Check if status is DOC_REVIEW and user is RA
        const isDocReview = (State.currentRegalStatus || '').toUpperCase() === C.STATUS.DOC_REVIEW;
        const isRA = State.isUserRA && !State.isGuest;

        if (isDocReview && isRA) {
            // Validate at least one non-void document has Review = "Need Revise"
            const validation = Actions.validateAtLeastOneNeedRevise();
            if (!validation.isValid) {
                clsGlobal.swalWarning(validation.errorMessage);
                return;
            }
        }

        Actions.saveRegalData()
            .then(() => {
                Swal.fire({
                    title: "Konfirmasi Return",
                    text: "Apakah Anda yakin ingin mengembalikan dokumen ini untuk direvisi?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Ya",
                    cancelButtonText: "Batal",
                    customClass: {
                        confirmButton: 'btn btn-danger',
                        cancelButton: 'btn btn-secondary'
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        Actions.sendRegalCommand("/Regal/ReturnRegal", { RegalId: regalId, Notes: "Returned for Revision" }, "Registrasi Lokal dikembalikan untuk revisi");
                    }
                });
            })
            .catch(() => {
                // Error handling sudah ditangani di saveRegalData
            });
    },

    /**
     * Request verfor
     */
    requestVerfor: function () {
        const Actions = RegalDetail.Actions;
        const regalId = Actions.ensureRegalSelection();
        if (!regalId) {
            return;
        }

        Actions.saveRegalData()
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
                        Actions.sendRegalCommand("/Regal/RequestVerfor", { RegalId: regalId, Notes: result.value || "" }, "Permintaan verifikasi formula untuk Registrasi Lokal telah dicatat");
                    }
                });
            })
            .catch(() => {
                // Error handling sudah ditangani di saveRegalData
            });
    },

    /**
     * Submit final label approval
     */
    submitFinalLabelApproval: function (approvalType, statusValue, dateValue, notesValue) {
        const C = RegalDetail.Constants;
        const Utils = RegalDetail.Utils;
        const Actions = RegalDetail.Actions;

        const approvalConfig = {
            RA: { successMessage: 'Data review Regulatory Affair telah disimpan.' },
            PD: { successMessage: 'Data review Product Development telah disimpan.' },
            PKG: { successMessage: 'Data review Packaging Development telah disimpan.' }
        };

        const config = approvalConfig[approvalType];
        if (!config) {
            console.error(`Unknown approval type: ${approvalType}`);
            return;
        }

        const regalId = Actions.ensureRegalSelection();
        if (!regalId) {
            return;
        }

        const token = Utils.getAntiForgeryToken();
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

                    const regalHdrTxtId = $('#hdRegalId').val();
                    if (regalHdrTxtId) {
                        RegalDetail.RefreshFinalLabelTabOnly(regalHdrTxtId);
                        // Refresh history after approval
                        RegalDetail.Actions.loadFinalLabelHistory(regalHdrTxtId);
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
    },

    /**
     * Open nomor izin edar LOV
     */
    openNomorIzinEdarLov: function () {
        const C = RegalDetail.Constants;

        const brand = ($('#brand').val() || '').trim();
        const subBrand = ($('#subBrand').val() || '').trim();

        if (!brand || !subBrand) {
            clsGlobal.swalWarning('Lengkapi Brand dan Sub Brand terlebih dahulu sebelum mencari Nomor Izin Edar.');
            return;
        }

        const lovParams = JSON.stringify({
            Brand: brand,
            SubBrand: subBrand
        });

        clsGlobal.generateLOV(C.LOV_TYPES.NOMOR_IZIN_EDAR, 'NomorIzinEdar', lovParams);
    },

    /**
     * Load final label files
     */
    loadFinalLabelFiles: function (regalHdrTxtId) {
        const C = RegalDetail.Constants;
        const Templates = RegalDetail.Templates;
        const Utils = RegalDetail.Utils;

        // BUG C FIX: Validate parameter
        if (!regalHdrTxtId) {
            console.error('loadFinalLabelFiles: regalHdrTxtId is required but was empty/null');
            // Try to get it from DOM as fallback
            regalHdrTxtId = $('#hdRegalId').val();
            if (!regalHdrTxtId) {
                console.error('loadFinalLabelFiles: Cannot get regalHdrTxtId from DOM either');
                clsGlobal.swalError('ID Registrasi tidak ditemukan. Silakan refresh halaman.');
                return;
            }
            console.log('loadFinalLabelFiles: Got regalHdrTxtId from DOM fallback:', regalHdrTxtId);
        }

        console.log('loadFinalLabelFiles: Loading files for regalHdrTxtId:', regalHdrTxtId);

        const tbody = $(C.SELECTORS.FINAL_LABEL_FILES + ' tbody');

        // BUG C FIX: Ensure tbody exists before manipulating
        if (tbody.length === 0) {
            console.error('loadFinalLabelFiles: Table tbody not found. Selector:', C.SELECTORS.FINAL_LABEL_FILES + ' tbody');
            clsGlobal.swalError('Tabel file tidak ditemukan. Silakan refresh halaman.');
            return;
        }

        tbody.html(Templates.getLoadingRow(5));

        $.ajax({
            type: 'GET',
            url: base_path + '/Regal/GetFinalLabelFiles',
            data: { regalHdrTxtId: regalHdrTxtId }
        }).done(function (response) {
            console.log('GetFinalLabelFiles response (full):', JSON.stringify(response, null, 2));
            console.log('GetFinalLabelFiles response type:', typeof response);
            console.log('GetFinalLabelFiles response.bitSuccess:', response?.bitSuccess);
            console.log('GetFinalLabelFiles response.objData:', response?.objData);
            console.log('GetFinalLabelFiles response.objData type:', typeof response?.objData);
            console.log('GetFinalLabelFiles response.objData isArray:', Array.isArray(response?.objData));

            tbody.empty();

            // BUG FIX: More robust parsing to handle various response formats
            // GetFinalLabelFiles returns: { bitSuccess: true, objData: [...], txtMessage: "success", ... }
            let files = [];

            if (response) {
                // Case 1: Response is already an array (direct array response)
                if (Array.isArray(response)) {
                    files = response;
                    console.log('GetFinalLabelFiles: Case 1 - Response is array, found', files.length, 'files');
                }
                // Case 2: Response has objData property (standard clsAPI.CreateResult format)
                else if (response.objData !== undefined && response.objData !== null) {
                    if (Array.isArray(response.objData)) {
                        files = response.objData;
                        console.log('GetFinalLabelFiles: Case 2a - objData is array, found', files.length, 'files');
                    } else if (typeof response.objData === 'object') {
                        // Single object wrapped in objData
                        files = [response.objData];
                        console.log('GetFinalLabelFiles: Case 2b - objData is single object, wrapped to array');
                    } else {
                        console.warn('GetFinalLabelFiles: Case 2c - objData is not array or object:', typeof response.objData);
                    }
                }
                // Case 3: Response has data property (alternative format)
                else if (response.data !== undefined && response.data !== null) {
                    if (Array.isArray(response.data)) {
                        files = response.data;
                        console.log('GetFinalLabelFiles: Case 3a - data is array, found', files.length, 'files');
                    } else if (typeof response.data === 'object') {
                        // Single object wrapped in data
                        files = [response.data];
                        console.log('GetFinalLabelFiles: Case 3b - data is single object, wrapped to array');
                    }
                }
                // Case 4: Response is a single object (direct format, but not clsAPI format)
                else if (typeof response === 'object' && response !== null && response.bitSuccess === undefined) {
                    files = [response];
                    console.log('GetFinalLabelFiles: Case 4 - Response is single object, wrapped to array');
                }
                else {
                    console.warn('GetFinalLabelFiles: Unknown response format:', response);
                }
            } else {
                console.warn('GetFinalLabelFiles: Response is null or undefined');
            }

            console.log('GetFinalLabelFiles: Final parsed files count:', files.length);
            console.log('GetFinalLabelFiles: Files data:', files);

            if (files.length > 0) {
                files.forEach(function (file, index) {
                    console.log('GetFinalLabelFiles: Rendering file', index + 1, ':', file);
                    const row = Templates.getFinalLabelFileRow(file, index);
                    tbody.append(row);
                });
                console.log('GetFinalLabelFiles: Successfully rendered', files.length, 'file(s) in table');
            } else {
                console.log('GetFinalLabelFiles: No files found, showing empty message');
                tbody.append(Templates.getEmptyTableRow('Tidak ada file', 5));
            }

            // Initialize tooltips after rendering
            $('#ManageFinalLabelModal [data-bs-toggle="tooltip"]').tooltip();
        }).fail(function (xhr) {
            tbody.empty();
            tbody.append('<tr><td colspan="5" class="text-center text-danger">Gagal memuat data file</td></tr>');
            console.error('Failed to load final label files:', xhr.responseText);
            clsGlobal.swalError('Gagal memuat data file: ' + (xhr.responseJSON?.txtMessage || xhr.responseText || 'Unknown error'));
        });
    },

    /**
     * Load Final Label history (with DataTable support)
     */
    loadFinalLabelHistory: function (regalHdrTxtId) {
        const C = RegalDetail.Constants;
        const Templates = RegalDetail.Templates;
        const Utils = RegalDetail.Utils;

        console.log("=== LOADING FINAL LABEL HISTORY ===");
        console.log("regalHdrTxtId:", regalHdrTxtId);
        console.log("base_path:", base_path);

        if (!regalHdrTxtId) {
            console.error("❌ loadFinalLabelHistory: regalHdrTxtId is EMPTY!");
            return;
        }

        const table = $(C.SELECTORS.FINAL_LABEL_HISTORY);
        if (!table.length) {
            console.error("❌ Final Label History table not found!");
            return;
        }

        // Destroy existing DataTable if exists
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().destroy();
        }

        const tbody = table.find('tbody');
        console.log("History table tbody found:", tbody.length);

        tbody.html(Templates.getLoadingRow(7));

        const ajaxData = {
            __RequestVerificationToken: Utils.getAntiForgeryToken(),
            regalHdrTxtId: regalHdrTxtId
        };

        console.log("AJAX data:", ajaxData);
        console.log("AJAX URL:", base_path + '/Regal/GetFinalLabelHistory');

        $.ajax({
            type: "POST",
            url: base_path + '/Regal/GetFinalLabelHistory',
            data: ajaxData,
            dataType: 'json'
        }).done(function (response) {
            console.log('✅ GetFinalLabelHistory SUCCESS');
            console.log('Response (full):', response);
            console.log('Response.bitSuccess:', response?.bitSuccess);
            console.log('Response.objData:', response?.objData);
            console.log('Response.objData type:', typeof response?.objData);
            console.log('Response.objData isArray:', Array.isArray(response?.objData));

            tbody.empty();

            let history = [];

            if (response && response.bitSuccess && response.objData) {
                if (Array.isArray(response.objData)) {
                    history = response.objData;
                    console.log('✅ objData is array, count:', history.length);
                } else if (typeof response.objData === 'string') {
                    try {
                        history = JSON.parse(response.objData);
                        console.log('✅ objData parsed from string, count:', history.length);
                    } catch (e) {
                        console.error('❌ Failed to parse history data:', e);
                    }
                } else {
                    console.warn('⚠️ objData is not array or string, type:', typeof response.objData);
                }
            } else {
                console.warn('⚠️ Response invalid or empty');
                console.log('  - response exists:', !!response);
                console.log('  - bitSuccess:', response?.bitSuccess);
                console.log('  - objData exists:', !!response?.objData);
            }

            console.log('Final history array count:', history.length);
            console.log('History data:', history);

            // Clear tbody before adding rows (remove any loading/empty rows)
            tbody.empty();

            if (history.length > 0) {
                history.forEach(function (item, index) {
                    console.log(`Rendering history row ${index}:`, item);
                    const row = Templates.getFinalLabelHistoryRow(item, index);
                    tbody.append(row);
                });
                console.log('✅ Final Label history rendered successfully -', history.length, 'rows');

                // Auto-expand accordion if there's history data
                // Uncomment next line if you want auto-expand
                // $('#collapseFinalLabelHistory').addClass('show');
            }
            // Note: Don't add empty row here - let DataTable handle empty state

            // Initialize DataTable
            table.DataTable({
                pageLength: 5,
                lengthMenu: [5, 10, 25, 50, 100],
                destroy: true,
                ordering: true,
                order: [[6, 'desc']], // Sort by Date column (descending)
                searching: true,
                paging: true,
                info: true,
                language: {
                    paginate: {
                        previous: 'Sebelumnya',
                        next: 'Berikutnya'
                    },
                    lengthMenu: 'Tampilkan _MENU_ data',
                    info: 'Menampilkan _START_ s/d _END_ dari _TOTAL_ data',
                    infoEmpty: 'Menampilkan 0 dari 0 data',
                    zeroRecords: 'Tidak ada data yang cocok',
                    search: 'Cari:',
                    emptyTable: 'Belum ada history'
                }
                // All columns are sortable (no columnDefs to disable sorting)
            });

            // Ensure DataTable elements remain enabled (filter, pagination, length select)
            table.closest('.dataTables_wrapper').find('input, select, button').prop('disabled', false);

            console.log("=== END LOADING HISTORY ===");
        }).fail(function (xhr, status, error) {
            console.error('❌ GetFinalLabelHistory FAILED');
            console.error('Status:', status);
            console.error('Error:', error);
            console.error('Response Text:', xhr.responseText);
            console.error('Status Code:', xhr.status);

            // Clear tbody - don't add error row with colspan, let DataTable handle it
            tbody.empty();

            // Initialize DataTable even on error to show empty state properly
            table.DataTable({
                pageLength: 5,
                lengthMenu: [5, 10, 25, 50, 100],
                destroy: true,
                ordering: true,
                searching: true,
                paging: true,
                info: true,
                language: {
                    paginate: {
                        previous: 'Sebelumnya',
                        next: 'Berikutnya'
                    },
                    lengthMenu: 'Tampilkan _MENU_ data',
                    info: 'Menampilkan _START_ s/d _END_ dari _TOTAL_ data',
                    infoEmpty: 'Menampilkan 0 dari 0 data',
                    zeroRecords: 'Gagal memuat data history: ' + (error || 'Unknown error'),
                    search: 'Cari:',
                    emptyTable: 'Gagal memuat data history'
                }
            });

            // Ensure DataTable elements remain enabled even on error (filter, pagination, length select)
            table.closest('.dataTables_wrapper').find('input, select, button').prop('disabled', false);
        });
    },

    /**
     * Create BPOM Header from Regal data
     */
    createBpomFromRegal: function (regalId) {
        const Utils = RegalDetail.Utils;

        if (!regalId) {
            clsGlobal.swalWarning("Regal ID tidak ditemukan");
            return $.Deferred().reject().promise();
        }

        const antiForgeryToken = Utils.getAntiForgeryToken();

        // ✅ MAPPING TETAP ADA
        const regalData = {
            IdRegal: regalId,
            NoRegisRegal: $("#noPermintaan").val() || "",
            ProjectNo: $("#projectNo").val() || "",
            ProjectType: $("#projectType").val() || "",
            NoIjinEdar: $("#nomorIzinEdar").val() || "",
            NomorIzinEdarId: $("#nomorIzinEdarId").val() || "",
            StartIjinEdar: $("#masaBerlakuStart").val() || "",
            EndIjinEdar: $("#masaBerlakuEnd").val() || "",
            TargetSubmit: $("#targetSubmitBPOM").val() || "",
            TargetApproval: $("#targetPersetujuanBPOM").val() || "",
            BeSubmit: $("#beSubmitBPOM").val() || "",
            BeApproval: $("#bePersetujuanBPOM").val() || "",
            JenisRegist: $("#jenisRegistrasi").val() || "",
            Brand: $("#brand").val() || "",
            SubBrand: $("#subBrand").val() || "",
            KategoriPangan: $("#kategoriPangan").val() || "",
            Varian: $("#varian").val() || "",
            NamaJenis: $("#namaJenis").val() || "",
            BeratBersih: $("#beratBersih").val() || "",
            PabrikProduksi: $("#pabrikProduksi").val() || "",
            KemasanPrimer: $("#kemasanPrimer").val() || "",
            AlamatPabrik: $("#alamatPabrik").val() || ""
        };

        const formData = new FormData();
        formData.append("__RequestVerificationToken", antiForgeryToken);

        Object.keys(regalData).forEach(key => {
            formData.append(`DataReq[0].${key}`, regalData[key]);
        });

        // ✅ RETURN AJAX (INI KUNCI FIX DEBUGGER ISSUE)
        return $.ajax({
            type: "POST",
            url: base_path + "/BPOMProcess/CreateBpomHeader",
            data: formData,
            processData: false,
            contentType: false,
            beforeSend: function () {
                clsGlobal.showLoading();
            }
        }).always(function () {
            clsGlobal.hideLoading();
        });
    },

    //createBpomFromRegal: function (regalId) {
    //    const Utils = RegalDetail.Utils;
    //    const C = RegalDetail.Constants;

    //    if (!regalId) {
    //        clsGlobal.swalWarning("Regal ID tidak ditemukan");
    //        return;
    //    }

    //    const antiForgeryToken = Utils.getAntiForgeryToken();

    //    // Ambil data dari form Regal
    //    const regalData = {
    //        IdRegal: regalId,
    //        NoRegisRegal: $("#noPermintaan").val() || "",
    //        ProjectNo: $("#projectNo").val() || "",
    //        ProjectType: $("#projectType").val() || "",
    //        NoIjinEdar: $("#nomorIzinEdar").val() || "",
    //        NomorIzinEdarId: $("#nomorIzinEdarId").val() || "",
    //        StartIjinEdar: $("#masaBerlakuStart").val() || "",
    //        EndIjinEdar: $("#masaBerlakuEnd").val() || "",
    //        TargetSubmit: $("#targetSubmitBPOM").val() || "",
    //        TargetApproval: $("#targetPersetujuanBPOM").val() || "",
    //        BeSubmit: $("#beSubmitBPOM").val() || "",
    //        BeApproval: $("#bePersetujuanBPOM").val() || "",
    //        JenisRegist: $("#jenisRegistrasi").val() || "",
    //        Brand: $("#brand").val() || "",
    //        SubBrand: $("#subBrand").val() || "",
    //        KategoriPangan: $("#kategoriPangan").val() || "",
    //        Varian: $("#varian").val() || "",
    //        NamaJenis: $("#namaJenis").val() || "",
    //        BeratBersih: $("#beratBersih").val() || "",
    //        PabrikProduksi: $("#pabrikProduksi").val() || "",
    //        KemasanPrimer: $("#kemasanPrimer").val() || "",
    //        AlamatPabrik: $("#alamatPabrik").val() || "",

    //    };

    //    const formData = new FormData();
    //    formData.append("__RequestVerificationToken", antiForgeryToken);

    //    Object.keys(regalData).forEach(key => {
    //        formData.append(`DataReq[0].${key}`, regalData[key] ?? "");
    //    });

    //    $.ajax({
    //        type: "POST",
    //        url: base_path + "/BPOMProcess/CreateBpomHeader",
    //        data: formData,
    //        processData: false,
    //        contentType: false,
    //        beforeSend: function () {
    //            clsGlobal.showLoading();
    //        },
    //        success: function (retDat, status, xhr) {
    //            clsGlobal.hideLoading();
    //            console.log("Create BPOM Response:", retDat);
    //            debugger;
    //            if (xhr.responseText.includes("!DOCTYPE html")) {
    //                clsGlobal.swalWarningRedirect("Sesi kamu sudah habis, silakan login ulang.", window.location.href);
    //                return;
    //            }

    //            if (retDat.bitSuccess) {
    //                //clsGlobal.swalSuccess("Registrasi Lokal berhasil disetujui, task BPOM Process berhasil tergenerate.");
    //            } else if (retDat.txtMessage === "Validation" || retDat.txtMessage === "gagal") {
    //                clsGlobal.swalWarning(retDat.objData || retDat.txtMessage);
    //            } else {
    //                clsGlobal.swalError(retDat.txtMessage);
    //            }
    //        },
    //        error: function (xhr, status, error) {
    //            clsGlobal.hideLoading();
    //            debugger;
    //            console.error("Create BPOM Error:", xhr.status, xhr.statusText, xhr.responseText);
    //            clsGlobal.swalError(xhr.responseText || error || "Gagal membuat BPOM Header.");
    //        }
    //    });
    //},

    /**
     * Task 6: Load Document History
     * Loads history of changes for a specific document and displays in modal
     */
    LoadDocHistory: function (docId) {
        const Utils = RegalDetail.Utils;
        const C = RegalDetail.Constants;

        if (!docId || docId.trim() === '') {
            clsGlobal.swalWarning('ID dokumen tidak valid.');
            return;
        }

        // Show loading in modal
        const $tbody = $('#tblHistoryNotes tbody');
        $tbody.html('<tr><td colspan="5" class="text-center text-muted"><p>Memuat data riwayat...</p></td></tr>');

        // Open modal first
        const historyModal = new bootstrap.Modal(document.getElementById('HistoryNoteModal'));
        historyModal.show();

        // Fetch history data
        clsGlobal.showLoading();

        $.ajax({
            type: 'GET',
            url: base_path + '/Regal/GetDocHistory',
            data: { docId: docId },
            dataType: 'json'
        }).done(function (response) {
            clsGlobal.hideLoading();

            console.log('LoadDocHistory: Response received:', response);
            console.log('LoadDocHistory: objData:', response?.objData);

            if (response && response.bitSuccess && response.objData) {
                const histories = Array.isArray(response.objData) ? response.objData : [];

                console.log('LoadDocHistory: Histories count:', histories.length);
                if (histories.length > 0) {
                    console.log('LoadDocHistory: First history item:', histories[0]);
                }

                if (histories.length === 0) {
                    $tbody.html(
                        '<tr><td colspan="4" class="text-center text-muted"><p>Tidak ada riwayat catatan untuk dokumen ini.</p></td></tr>'
                    );
                    return;
                }

                // Build table rows HTML
                let tableRowsHtml = '';
                histories.forEach(function (item, index) {
                    const catatan = item.Catatan || '-';
                    const createdBy = item.CreatedBy || 'System';
                    const createdRole = item.CreatedRole || '-';
                    const action = item.Action || '-';
                    const documentName = item.DocumentName || '-';

                    // Format date: dd MMM yyyy HH:mm (using moment.js)
                    let formattedDate = '-';
                    if (item.CreatedDate) {
                        formattedDate = moment(item.CreatedDate).format('DD MMM YYYY HH:mm');
                    } else if (item.FormattedDate) {
                        formattedDate = item.FormattedDate;
                    }

                    // Kolom 2: Dokumen - Format: [Action] + " Dokumen " + [DocumentName]
                    const dokumenDisplay = `${Utils.htmlEncode(action)} Dokumen ${Utils.htmlEncode(documentName)}`;

                    // Kolom 3: Kreator - Format: 
                    // Baris 1: [CreatedBy] as [CreatedRole]
                    // Baris 2: [CreatedDate] (text kecil/muted)
                    const kreatorDisplay = `
                        <div>${Utils.htmlEncode(createdBy)} <i>as ${Utils.htmlEncode(createdRole)}</i></div>
                        <div class="text-muted small">${Utils.htmlEncode(formattedDate)}</div>
                    `;

                    tableRowsHtml += `
                        <tr>
                            <td class="text-center">${index + 1}</td>
                            <td>${dokumenDisplay}</td>
                            <td>${kreatorDisplay}</td>
                            <td class="text-break">${Utils.htmlEncode(catatan)}</td>
                        </tr>
                    `;
                });

                $tbody.html(tableRowsHtml);
            } else {
                const errorMsg = response && response.txtMessage ? response.txtMessage : 'Gagal memuat data riwayat.';
                $tbody.html(
                    `<tr><td colspan="4" class="text-center text-danger"><p>${Utils.htmlEncode(errorMsg)}</p></td></tr>`
                );
            }
        }).fail(function (xhr, status, error) {
            clsGlobal.hideLoading();
            const errorMsg = 'Terjadi kesalahan saat memuat data riwayat.';
            $tbody.html(
                `<tr><td colspan="4" class="text-center text-danger"><p>${errorMsg}</p></td></tr>`
            );
            console.error('LoadDocHistory error:', error);
        });
    }
};

// ============================================================================
// SECTION 7: MAIN REGAL DETAIL OBJECT METHODS
// ============================================================================
// Note: All methods here use RegalDetail.State, RegalDetail.Constants, 
// RegalDetail.Utils, RegalDetail.Templates, and RegalDetail.Actions
// ============================================================================

RegalDetail = {
    ...RegalDetail,

    /**
     * Main data binding function
     * Binds all data from server response to UI elements
     */
    BindData: function (data) {
        const State = RegalDetail.State;
        const C = RegalDetail.Constants;
        const Utils = RegalDetail.Utils;

        console.log("RegalDetail.BindData called with:", data);

        try {
            if (!data) {
                console.error("Data is null or undefined");
                clsGlobal.swalError(C.MESSAGES.DATA_NOT_FOUND);
                return;
            }

            // TASK 1: Get user info from response data FIRST, BEFORE binding documents
            // This is critical because BindDocuments needs currentUserRoleCode to be set
            var userDept = '';
            if (data && data.UserInfo) {
                var userInfo = data.UserInfo;
                State.isUserRA = userInfo.IsRA || false;
                State.isUserBD = userInfo.IsBD || false;
                State.isUserPDV = userInfo.IsPDV || false;
                State.isUserPCD = userInfo.IsPCD || false;

                // TASK 1: Ambil Department dari UserInfo dan normalize dengan .toUpperCase()
                userDept = (userInfo.RoleCode || userInfo.Department || userInfo.department || '').toString().toUpperCase().trim();

                // TASK 1: Store role code in state (pastikan konsisten dengan database format: "BD", "PCD", "PDV", "RA")
                State.currentUserRoleCode = userDept;

                // TASK 1: Set isGuest flag - if not in allowed roles, then Guest
                State.isGuest = !RegalDetail.f_IsAllowedRole(userDept);

                console.log("BindData: TASK 1 - UserInfo found EARLY. RoleCode:", userInfo.RoleCode);
                console.log("BindData: TASK 1 - UserInfo found EARLY. Department (raw):", userInfo.Department || userInfo.department);
                console.log("BindData: TASK 1 - UserInfo found EARLY. Department (normalized):", userDept);
                console.log("BindData: TASK 1 - currentUserRoleCode set EARLY to:", State.currentUserRoleCode);
                console.log("BindData: TASK 1 - isUserRA set to:", State.isUserRA);
                console.log("BindData: TASK 1 - isUserBD set to:", State.isUserBD);
                console.log("BindData: TASK 1 - isUserPDV set to:", State.isUserPDV);
                console.log("BindData: TASK 1 - isUserPCD set to:", State.isUserPCD);
                console.log("BindData: TASK 1 - isGuest set to:", State.isGuest);
            } else {
                // Fallback: Try to get role from global variable or other sources
                console.warn("BindData: UserInfo not found in response, attempting fallback role detection");
                Utils.checkUserRole();

                // TASK 1: Fallback: Try to get role from ClsGlobalClass
                if (typeof ClsGlobalClass !== 'undefined' && typeof ClsGlobalClass.dLogin === 'function') {
                    try {
                        var loginData = ClsGlobalClass.dLogin();
                        if (loginData && loginData.roleDat) {
                            userDept = (loginData.roleDat.txtRoleCode || '').toString().toUpperCase().trim();
                            State.currentUserRoleCode = userDept;
                            State.isGuest = !RegalDetail.f_IsAllowedRole(userDept);
                            console.log("BindData: TASK 1 - Fallback EARLY: Got role from ClsGlobalClass:", userDept);
                        }
                    } catch (e) {
                        console.warn("BindData: Could not get role from ClsGlobalClass:", e);
                    }
                }
            }

            if (data && data.Header) {
                var header = data.Header;
                console.log("Binding header data:", header);

                // Bind Header Data
                $('#hdRegalId').val(header.TxtId || header.txtId || '');
                $('#tglPermintaan').val(header.PermintaanDate ? moment(header.PermintaanDate).format(C.FILE.DATE_DISPLAY_FORMAT) : '');
                $('#noPermintaan').val(header.RegistrasiNo || '');

                // Project Info
                $('#projectNo').val(header.ProjectNo || '');
                $('#verforNo').val(header.VerforNo || '');
                $('#projectType').val(header.ProjectType || '');

                // Production & Packaging
                $('#pabrikProduksi').val(header.PabrikProduksi || '');
                $('#alamatPabrik').val(header.AlamatPabrik || '');
                $('#kemasanPrimer').val(header.KemasanPrimer || '');

                // Product Info
                $('#brand').val(header.Brand || '');
                $('#subBrand').val(header.SubBrand || '');
                $('#kategoriPangan').val(header.KategoriPangan || '');
                $('#varian').val(header.Varian || '');
                $('#namaJenis').val(header.NamaJenis || '');
                $('#takaranSaji').val(header.TakaranSaji || '');
                $('#txtTakaranKurang').val(header.TxtTakaranKurang || '');
                $('#klaim').val(header.Klaim || '');
                $('#beratBersih').val(header.BeratBersih || '');
                // Display StatusDescription if available, fallback to Status (code)
                // Note: data.HeaderStatusDescription comes from backend (Service lookup MStatus)
                var statusDisplay = (data && data.HeaderStatusDescription) ? data.HeaderStatusDescription : (header.Status || '');
                $('#status').val(statusDisplay);

                // Store status code in hidden field for reference
                $('#statusCode').val(header.Status || '');

                // Store current regal status CODE for role-based logic (MUST use code, not description)
                // This is used in if conditions like: if (currentRegalStatus === 'DRAFT')
                State.currentRegalStatus = (header.Status || '').toUpperCase();

                // Store current Final Label status CODE for OSS access control
                State.currentStatusFinalLabel = (header.StatusFinalLabel || header.statusFinalLabel || '').toUpperCase();

                // PIC Info
                $('#picProdev').val(header.PicProdev || '');
                $('#picRA').val(header.PicRa || '');
                $('#picBD').val(header.PicBd || '');
                $('#picPackDev').val(header.PicPackDev || '');
                $('#picRAOSS').val(header.PicRaOss || '');
                $('#oss_PicRA').val(header.PicRaOss || '');

                // BPOM & FPA Dates
                $('#targetSubmitBPOM').val(header.TargetSubmitBpom ? moment(header.TargetSubmitBpom).format(C.FILE.DATE_DISPLAY_FORMAT) : '');
                $('#targetPersetujuanBPOM').val(header.TargetPersetujuanBpom ? moment(header.TargetPersetujuanBpom).format(C.FILE.DATE_DISPLAY_FORMAT) : '');
                $('#beSubmitBPOM').val(header.BeSubmitBpom ? moment(header.BeSubmitBpom).format(C.FILE.DATE_DISPLAY_FORMAT) : '');
                $('#bePersetujuanBPOM').val(header.BePersetujuanBpom ? moment(header.BePersetujuanBpom).format(C.FILE.DATE_DISPLAY_FORMAT) : '');
                $('#targetFPA').val(header.TargetFpa ? moment(header.TargetFpa).format(C.FILE.DATE_DISPLAY_FORMAT) : '');

                // Registration Info
                $('#kbli').val(header.Kbli || '');
                $('#jenisRegistrasi').val(header.JenisRegistrasi || '');
                $('#projectRegistrasi').val(header.ProjectRegistrasi || '');

                // Other Info
                $('#nomorIzinEdar').val(header.NomorIzinEdarExisting || '');
                $('#nomorIzinEdarId').val(header.NomorIzinEdarId || ''); // Task 4: Bind NomorIzinEdarId from backend
                $('#masaBerlakuStart').val(header.MasaBerlakuStart ? moment(header.MasaBerlakuStart).format(C.FILE.DATE_DISPLAY_FORMAT) : '');
                $('#masaBerlakuEnd').val(header.MasaBerlakuEnd ? moment(header.MasaBerlakuEnd).format(C.FILE.DATE_DISPLAY_FORMAT) : '');

                console.log("Header data bound successfully");
            } else {
                console.warn("No Header data in response");
            }

            if (data && data.Documents) {
                console.log("Binding documents:", data.Documents.length, "items");
                RegalDetail.BindDocuments(data.Documents);
            } else {
                console.warn("No Documents data in response");
                $(C.SELECTORS.DOC_TABLE + ' tbody').empty();
            }

            let finalLabelPath = '';
            let finalLabelAlias = '';

            if (data && data.FinalLabel) {
                const finalLabel = data.FinalLabel;
                $('#approval_ra').val(finalLabel.ApprovalRaStatus || finalLabel.ApprovalRa || '');
                $('#approval_ra_date').val(Utils.formatDateForDisplay(finalLabel.ApprovalRaDate));
                $('#notes_ra').val(finalLabel.NotesRa || '');

                $('#approval_pd').val(finalLabel.ApprovalPdStatus || finalLabel.ApprovalPd || '');
                $('#approval_pd_date').val(Utils.formatDateForDisplay(finalLabel.ApprovalPdDate));
                $('#notes_pd').val(finalLabel.NotesPd || '');

                $('#approval_pkg').val(finalLabel.ApprovalPkgStatus || finalLabel.ApprovalPkg || '');
                $('#approval_pkg_date').val(Utils.formatDateForDisplay(finalLabel.ApprovalPkgDate));
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
            // IMPORTANT: OSS tab is disabled by default, will be enabled by ApplyOSSTabAccessControl if conditions met
            if (data && data.Oss) {
                const oss = data.Oss;
                $('#oss_IdOSS').val(oss.IdOss || '');
                $('#oss_TglPermintaan').val(Utils.formatDateForDisplay(oss.TglPermintaanOss));
                $('#oss_PicRA').val(oss.PicRaOss || '');
                $('#oss_NoAju').val(oss.NoAjuRegistrasi || '');
                $('#oss_KegiatanUsaha').val(oss.KegiatanUsaha || '');
                $('#oss_JenisPbum').val(oss.JenisPbumKu || '');
                $('#oss_NoIdOSS').val(oss.NoIdOss || '');
                $('#oss_Comment').val(oss.Comment || '');
                console.log("OSS data bound successfully");
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
                console.log("No OSS data - fields cleared");
            }

            // Disable OSS tab by default - will be enabled by ApplyOSSTabAccessControl if conditions met
            $('#tabOSS input.form-control, #tabOSS select.form-select, #tabOSS textarea.form-control').prop('disabled', true);
            $('#tabOSS .input-group .btn').prop('disabled', true);
            $('#btnSearchJenisPbum').prop('disabled', true);
            $(C.BUTTON_IDS.REQUEST_ID_OSS + ', ' + C.BUTTON_IDS.SIMPAN_ID_OSS).hide().addClass('d-none');
            console.log("OSS tab disabled by default - will be enabled if: RA + Document DOC_APPROVED + Final Label DOC_APPROVED");

            // Load Final Label History
            const regalHdrTxtId = $('#hdRegalId').val();
            if (regalHdrTxtId) {
                RegalDetail.Actions.loadFinalLabelHistory(regalHdrTxtId);
                console.log("Final Label history loading initiated");
            }

            // Render Workflow State Banner
            RegalDetail.RenderWorkflowBanner(data);

            // TASK 1: currentUserRoleCode sudah di-set di awal fungsi (sebelum BindDocuments)
            // Apply role access control (called twice: immediately and with delay as "The Hammer")
            // Use State.currentUserRoleCode yang sudah di-set di awal
            var userDeptForAccessControl = State.currentUserRoleCode || '';

            // Update Action Buttons Visibility based on business rules (called immediately)
            RegalDetail.UpdateActionButtonsVisibility();

            // Logic Tombol OSS (Task 2: Visibility Control) - called immediately
            RegalDetail.UpdateOssButtonsVisibility();

            // Apply OSS Tab Access Control (checks both Document and Final Label status)
            RegalDetail.ApplyOSSTabAccessControl();

            // BUG VISIBILITAS FIX: Bind Final Label Status
            // This ensures f_UpdateFinalLabelStatusUI becomes the final determiner for #btnRequestReviewLabel
            RegalDetail.f_UpdateFinalLabelStatusUI(data);

            // CRITICAL: Apply role access control LAST (includes "Final Lock" for RA + NEED_REVISION)
            // This ensures any inputs enabled by functions above are locked if needed
            if (userDeptForAccessControl) {
                // Call immediately (but after other functions)
                RegalDetail.f_ApplyRoleAccess(userDeptForAccessControl);
            }

            if (userDeptForAccessControl) {
                // Call again with setTimeout for final enforcement after async operations
                // CRITICAL: f_ApplyRoleAccess must be called LAST to ensure "Final Lock" (RA + NEED_REVISION) is applied
                // This prevents other functions (f_UpdateFinalLabelStatusUI, etc.) from re-enabling inputs
                setTimeout(function () {
                    console.log("BindData: Final call to f_ApplyRoleAccess (The Hammer)");

                    // Update Action Buttons Visibility first
                    RegalDetail.UpdateActionButtonsVisibility();

                    // Update OSS Buttons Visibility
                    RegalDetail.UpdateOssButtonsVisibility();

                    // Apply OSS Tab Access Control (checks both statuses)
                    RegalDetail.ApplyOSSTabAccessControl();

                    // CRITICAL: Apply role access (includes "Final Lock" for RA + NEED_REVISION)
                    RegalDetail.f_ApplyRoleAccess(userDeptForAccessControl);

                    // BUG FIX: Re-apply Final Label Status UI AFTER f_ApplyRoleAccess
                    // This ensures #btnRequestReviewLabel and #btnOpenManageFinalLabelModal visibility is correctly set for BD role
                    // This must be called AFTER f_ApplyRoleAccess to override any hiding logic
                    RegalDetail.f_UpdateFinalLabelStatusUI(data);

                    console.log("BindData: Final enforcement completed - f_UpdateFinalLabelStatusUI called LAST to ensure BD button visibility");

                    // FINAL HAMMER: One more call with longer delay to absolutely ensure BD buttons are visible and OSS access correct
                    setTimeout(function () {
                        console.log("BindData: FINAL HAMMER - Ensuring BD button visibility and OSS access one last time");
                        RegalDetail.f_UpdateFinalLabelStatusUI(data);
                        RegalDetail.ApplyOSSTabAccessControl();

                        // ULTIMATE ENFORCEMENT: Tab OSS ONLY for RA + Both DOC_APPROVED
                        setTimeout(function () {
                            const State = RegalDetail.State;
                            const C = RegalDetail.Constants;

                            // Check all 3 conditions
                            const isRA = State.isUserRA && !State.isGuest;
                            const currentRegalStatus = (State.currentRegalStatus || '').toUpperCase();
                            const statusFinalLabel = (State.currentStatusFinalLabel || '').toUpperCase();
                            const isFinalLabelApproved = statusFinalLabel === C.STATUS.DOC_APPROVED || statusFinalLabel === 'DOC_APPROVED';
                            const isSubmitOss = currentRegalStatus === C.STATUS.SUBMIT_OSS;
                            const isDocApproved = currentRegalStatus === C.STATUS.DOC_APPROVED;
                            // SUBMIT_OSS: Always disable OSS tab for all roles
                            const shouldEnableOSS = !isSubmitOss && isRA && isDocApproved && isFinalLabelApproved;

                            console.log("🔒 ULTIMATE ENFORCEMENT: Checking OSS Tab Restrictions");
                            console.log("  → Role RA:", isRA ? "✅" : "❌");
                            console.log("  → Doc Status DOC_APPROVED:", isDocApproved ? "✅" : "❌", "(Current:", currentRegalStatus + ")");
                            console.log("  → Doc Status SUBMIT_OSS:", isSubmitOss ? "✅" : "❌", "(Will disable OSS tab)");
                            console.log("  → Label Status DOC_APPROVED:", isFinalLabelApproved ? "✅" : "❌", "(Current:", statusFinalLabel + ")");
                            console.log("  → RESULT:", shouldEnableOSS ? "✅ ENABLE OSS TAB" : "❌ DISABLE OSS TAB");

                            if (shouldEnableOSS) {
                                // ENABLE OSS Tab
                                console.log("✅ ENABLING Tab OSS - All conditions met");
                                $('#tabOSS input.form-control').prop('disabled', false);
                                $('#tabOSS select.form-select').prop('disabled', false);
                                $('#tabOSS textarea.form-control').prop('disabled', false);
                                $('#tabOSS .input-group .btn').prop('disabled', false);
                                $('#btnSearchJenisPbum').prop('disabled', false);
                                $(C.BUTTON_IDS.REQUEST_ID_OSS + ', ' + C.BUTTON_IDS.SIMPAN_ID_OSS).show().removeClass('d-none');
                            } else {
                                // DISABLE OSS Tab
                                console.log("❌ DISABLING Tab OSS - Conditions not met");
                                $('#tabOSS input.form-control').prop('disabled', true);
                                $('#tabOSS select.form-select').prop('disabled', true);
                                $('#tabOSS textarea.form-control').prop('disabled', true);
                                $('#tabOSS .input-group .btn').prop('disabled', true);
                                $('#btnSearchJenisPbum').prop('disabled', true);
                                $(C.BUTTON_IDS.REQUEST_ID_OSS + ', ' + C.BUTTON_IDS.SIMPAN_ID_OSS).hide().addClass('d-none');
                            }
                        }, 100);
                    }, 100);
                }, 200);
            }
        } catch (e) {
            console.error("Error in BindData:", e);
            clsGlobal.swalError("Error binding data: " + e.message);
        }
    },

    /**
     * Render Workflow State Banner based on WorkflowMessage from backend
     */
    RenderWorkflowBanner: function (data) {

        console.log("RenderWorkflowBanner: Called with data:", data);

        const $container = $('#workflowAlertContainer');
        const $icon = $('#workflowAlertIcon');
        const $text = $('#workflowAlertText');

        console.log("RenderWorkflowBanner: Container element found:", $container.length > 0);
        console.log("RenderWorkflowBanner: Icon element found:", $icon.length > 0);
        console.log("RenderWorkflowBanner: Text element found:", $text.length > 0);

        // Check if WorkflowMessage exists in data
        if (data && data.WorkflowMessage) {
            const wf = data.WorkflowMessage;

            console.log("RenderWorkflowBanner: WorkflowMessage found:", wf);
            console.log("RenderWorkflowBanner: AlertClass:", wf.AlertClass);
            console.log("RenderWorkflowBanner: IconClass:", wf.IconClass);
            console.log("RenderWorkflowBanner: MessageText:", wf.MessageText);

            // Remove all previous alert classes
            $container.removeClass('alert-success alert-warning alert-info alert-danger alert-primary alert-secondary');

            // Add new alert class from config
            if (wf.AlertClass) {
                $container.addClass(wf.AlertClass);
                console.log("RenderWorkflowBanner: Added alert class:", wf.AlertClass);

                // Update history button color to match alert style
                // Extract color part (e.g. 'warning' from 'alert-warning')
                const colorSuffix = wf.AlertClass.replace('alert-', '');
                const $btnHistory = $('#btnViewStatusHistory');

                // Remove standard button color classes
                $btnHistory.removeClass('btn-success btn-warning btn-info btn-danger btn-primary btn-secondary btn-light btn-dark');

                // Add matching button class
                $btnHistory.addClass('btn-' + colorSuffix);
            }

            // Set icon class
            if (wf.IconClass) {
                $icon.attr('class', wf.IconClass + ' me-2');
                console.log("RenderWorkflowBanner: Set icon class:", wf.IconClass);
            }

            // Set message text
            if (wf.MessageText) {
                $text.text(wf.MessageText);
                console.log("RenderWorkflowBanner: Set message text:", wf.MessageText);
            }

            // Show the banner
            $container.removeClass('d-none');
            console.log("RenderWorkflowBanner: Banner displayed successfully");
        } else {
            console.log("RenderWorkflowBanner: No workflow message found in data");
            console.log("RenderWorkflowBanner: data exists:", !!data);
            console.log("RenderWorkflowBanner: data.WorkflowMessage exists:", !!(data && data.WorkflowMessage));

            // Hide banner if no message
            $container.addClass('d-none');
        }
    },

    /**
     * Check if role is in allowed list
     */
    f_IsAllowedRole: function (userDept) {
        const C = RegalDetail.Constants;
        const role = (userDept || '').toUpperCase().trim();

        // Normalize role - handle variations like "PIC_RA_OSS" -> "RAOSS"
        let normalizedRole = this.f_NormalizeRole(userDept);

        return C.ROLES.ALLOWED.includes(normalizedRole);
    },

    /**
     * Normalize role code to standard role name
     * Contoh: "PIC_RA_OSS" -> "RAOSS", "REGULATORY" -> "RA"
     */
    f_NormalizeRole: function (userDept) {
        const C = RegalDetail.Constants;
        const role = (userDept || '').toUpperCase().trim();

        if (role.includes('RA') && role.includes('OSS')) {
            return C.ROLES.RAOSS;
        } else if (role.includes(C.ROLES.REGULATORY) || role === C.ROLES.RA) {
            return C.ROLES.RA;
        } else if (role.includes('PACKAGING') || role === C.ROLES.PCD) {
            return C.ROLES.PCD;
        } else if (role.includes('PRODUCT') || role === C.ROLES.PDV) {
            return C.ROLES.PDV;
        } else if (role.includes('BUSINESS') || role === C.ROLES.BD) {
            // BUG FIX: Tambahkan fallback untuk BD seperti PCD/PDV
            // Support berbagai format: "BD", "BUSINESS_DEVELOPMENT", "BUSINESS DEVELOPMENT", dll
            return C.ROLES.BD;
        }

        return role; // Return as-is if not recognized
    },

    /**
     * Check if current status is DRAFT or NEED_REVISION
     * Note: Status backend menggunakan "NEED_REVISION", bukan "REVISE"
     */
    f_IsDraftOrReviseStatus: function () {
        const State = RegalDetail.State;
        const C = RegalDetail.Constants;
        const status = (State.currentRegalStatus || '').toUpperCase();
        return status === C.STATUS.DRAFT || status === C.STATUS.NEED_REVISION;
    },

    /**
     * Check if current status is "Locked" - user cannot edit form header
     * Locked statuses: DOC_IN_PROCESS, DOC_REVIEW, DOC_APPROVED, FINAL_APPROVED (legacy)
     * Only DRAFT and NEED_REVISION are editable
     */
    f_IsLockedStatus: function () {
        const State = RegalDetail.State;
        const C = RegalDetail.Constants;
        const status = (State.currentRegalStatus || '').toUpperCase();
        return status === C.STATUS.DOC_IN_PROCESS ||
            status === C.STATUS.DOC_REVIEW ||
            status === C.STATUS.DOC_APPROVED ||
            status === C.STATUS.FINAL_APPROVED || // Legacy support
            status === C.STATUS.WAITING_APPROVAL;
    },

    /**
     * Apply RA role access rules
     * Fungsi ini mengatur akses untuk user dengan role RA ketika status registrasi adalah DRAFT atau NEED_REVISION
     */
    f_ApplyRARoleAccess: function () {
        const State = RegalDetail.State;
        const C = RegalDetail.Constants;

        console.log("f_ApplyRARoleAccess: Applying RA role access rules");

        // Check if status is DRAFT or NEED_REVISION
        if (!this.f_IsDraftOrReviseStatus()) {
            console.log("f_ApplyRARoleAccess: Status is not DRAFT/NEED_REVISION, skipping RA-specific rules");
            return;
        }

        console.log("f_ApplyRARoleAccess: Status is DRAFT or NEED_REVISION, applying RA-specific rules");

        // Hide all buttons that are NOT allowed for RA with DRAFT/NEED_REVISION status
        // NOTE: OPEN_MANAGE_FINAL_LABEL is handled conditionally below based on Final Label status
        var allActionButtonsToHide = [
            C.BUTTON_IDS.OSS_REQUEST_VERFOR, C.BUTTON_IDS.OSS_APPROVE, C.BUTTON_IDS.OSS_RETURN,
            C.BUTTON_IDS.REQUEST_ID_OSS, C.BUTTON_IDS.SIMPAN_ID_OSS,
            C.BUTTON_IDS.REQUEST_REVIEW_LABEL,
            '#btnSubmitLabel_RA', '#btnSubmitLabel_PD', '#btnSubmitLabel_PKG'
        ];
        $(allActionButtonsToHide.join(', ')).hide().addClass('d-none');

        // Show only allowed buttons
        $(C.BUTTON_IDS.SAVE_HEADER).show().removeClass('d-none');
        $(C.BUTTON_IDS.REGAL_PROCESS_DOC).show().removeClass('d-none');

        // Enable allowed input fields
        $('#verforNo, #kbli, #nomorIzinEdar, #picRAOSS').prop('disabled', false);
        $('#btnSearchVerforNo, #btnSearchKbli, #btnSearchNomorIzinEdar, #btnSearchPicRaOss').prop('disabled', false).show().removeClass('d-none');

        // Enable namaJenis when status is DRAFT and role is RA
        const currentStatus = State.currentRegalStatus || '';
        if (currentStatus === C.STATUS.DRAFT && State.isUserRA && !State.isGuest) {
            $('#namaJenis').prop('disabled', false);
            console.log("f_ApplyRARoleAccess: namaJenis enabled for RA with DRAFT status");
        } else {
            $('#namaJenis').prop('disabled', true);
        }

        // Disable other inputs in Permintaan Doc Registrasi tab (excluding namaJenis which is handled above)
        $('#projectNo, #projectType, #jenisRegistrasi, #noPermintaan, #projectRegistrasi, #status, #tglPermintaan, #targetSubmitBPOM, #targetPersetujuanBPOM, #beSubmitBPOM, #bePersetujuanBPOM, #targetFPA, #masaBerlakuStart, #masaBerlakuEnd, #brand, #subBrand, #kategoriPangan, #varian, #takaranSaji, #txtTakaranKurang, #klaim, #beratBersih, #pabrikProduksi, #alamatPabrik, #kemasanPrimer, #picProdev, #picRA, #picBD, #picPackDev').prop('disabled', true);

        // TAB 2: 'Final Label' - Hide buttons, disable inputs
        // EXCEPTION: Keep btnOpenManageFinalLabelModal ALWAYS visible for RA to review and download (any status)
        $('#btnRequestReviewLabel').hide().addClass('d-none');
        // Always show btnOpenManageFinalLabelModal for RA - they can review and download at any status
        $('#btnOpenManageFinalLabelModal').removeClass('d-none').show().prop('disabled', false);
        console.log("f_ApplyRARoleAccess: btnOpenManageFinalLabelModal kept visible for RA (review and download access)");
        $('#btnSubmitLabel_RA, #btnSubmitLabel_PD, #btnSubmitLabel_PKG').hide().addClass('d-none');
        $('#approval_ra, #approval_pd, #approval_pkg, #notes_ra, #notes_pd, #notes_pkg, #approval_ra_date, #approval_pd_date, #approval_pkg_date').prop('disabled', true);

        // TAB 3: 'OSS' - Hide all buttons, disable all inputs
        $('#btnRequestIDOSS, #btnSubmitOSS').hide().addClass('d-none');
        $('#oss_IdOSS, #oss_TglPermintaan, #oss_PicRA, #oss_NoAju, #oss_KegiatanUsaha, #oss_JenisPbum, #oss_NoIdOSS, #oss_Comment').prop('disabled', true);
        $('#btnSearchJenisPbum').prop('disabled', true);

        // Final check with setTimeout to ensure logic overrides default rules
        setTimeout(function () {
            console.log("f_ApplyRARoleAccess: Final enforcement for RA DRAFT/NEED_REVISION status");
            $(allActionButtonsToHide.join(', ')).hide().addClass('d-none');
            $(C.BUTTON_IDS.SAVE_HEADER + ', ' + C.BUTTON_IDS.REGAL_PROCESS_DOC).show().removeClass('d-none');

            // Final enforcement: Enable namaJenis when status is DRAFT and role is RA
            const finalStatus = State.currentRegalStatus || '';
            if (finalStatus === C.STATUS.DRAFT && State.isUserRA && !State.isGuest) {
                $('#namaJenis').prop('disabled', false);
                console.log("f_ApplyRARoleAccess: Final enforcement - namaJenis enabled for RA with DRAFT status");
            } else {
                $('#namaJenis').prop('disabled', true);
            }

            // ALWAYS keep btnOpenManageFinalLabelModal visible for RA (any status) - they can review and download
            $(C.BUTTON_IDS.OPEN_MANAGE_FINAL_LABEL).removeClass('d-none').show().prop('disabled', false);
            console.log("f_ApplyRARoleAccess: Final enforcement - btnOpenManageFinalLabelModal kept visible for RA (review and download)");
        }, 100);

        console.log("f_ApplyRARoleAccess: RA role access rules applied successfully");
    },

    /**
     * Apply role access for DOC_REVIEW status
     * Default: All roles view-only (all buttons hidden except Back, all inputs disabled)
     * Override for RA: Can see Approve/Return buttons, can edit Review/Catatan in document table
     */
    f_ApplyDocReviewRoleAccess: function () {
        const State = RegalDetail.State;
        const C = RegalDetail.Constants;

        console.log("f_ApplyDocReviewRoleAccess: Applying DOC_REVIEW status access rules");

        // DEFAULT VIEW: Hide all action buttons except Back button
        var allActionButtonsToHide = [
            C.BUTTON_IDS.SAVE_HEADER,
            C.BUTTON_IDS.REGAL_PROCESS_DOC,
            C.BUTTON_IDS.OSS_REQUEST_VERFOR,
            C.BUTTON_IDS.OSS_APPROVE,
            C.BUTTON_IDS.OSS_RETURN,
            C.BUTTON_IDS.REQUEST_ID_OSS,
            C.BUTTON_IDS.SIMPAN_ID_OSS,
            C.BUTTON_IDS.REQUEST_REVIEW_LABEL,
            C.BUTTON_IDS.OPEN_MANAGE_FINAL_LABEL,
            '#btnSubmitLabel_RA',
            '#btnSubmitLabel_PD',
            '#btnSubmitLabel_PKG'
        ];
        $(allActionButtonsToHide.join(', ')).hide().addClass('d-none');

        // Keep Back button visible
        $(C.BUTTON_IDS.BACK).show().removeClass('d-none');

        // DEFAULT VIEW: Disable all form inputs (Permintaan Doc Registrasi tab)
        // BUG FIX: Exclude Status History accordion - History harus selalu bisa diakses
        $(C.SELECTORS.FORM + ' input.form-control, ' + C.SELECTORS.FORM + ' select.form-select, ' + C.SELECTORS.FORM + ' textarea.form-control')
            .not(C.SELECTORS.DOC_TABLE + ' :input') // Exclude document table inputs (will be handled separately)
            .not('#accordionStatusHistory :input') // BUG FIX: Exclude Status History accordion inputs
            .prop('disabled', true);

        // Disable LOV search buttons in header
        // BUG FIX: Exclude Status History accordion buttons
        $(C.SELECTORS.FORM + ' .input-group .btn')
            .not(C.SELECTORS.DOC_TABLE + ' .input-group .btn') // Exclude document table buttons
            .not('#accordionStatusHistory .input-group .btn') // BUG FIX: Exclude Status History accordion buttons
            .prop('disabled', true);

        // BUG FIX: Ensure Status History accordion buttons are always enabled
        $('#accordionStatusHistory .accordion-button').prop('disabled', false).show();

        // Disable all inputs in Final Label tab (exclude tblFinalLabelHistory table and DataTable elements)
        $('#tabFinalLabel input.form-control, #tabFinalLabel select.form-select, #tabFinalLabel textarea.form-control')
            .not(C.SELECTORS.FINAL_LABEL_HISTORY + ' :input') // Exclude Final Label History table inputs
            .not('.dataTables_filter input') // Exclude DataTable filter input
            .not('.dataTables_length select') // Exclude DataTable length select
            .prop('disabled', true);
        $('#tabFinalLabel .input-group .btn')
            .not(C.SELECTORS.FINAL_LABEL_HISTORY + ' .input-group .btn') // Exclude Final Label History table buttons
            .not('.dataTables_wrapper .btn') // Exclude DataTable buttons
            .prop('disabled', true);

        // Ensure DataTable elements remain enabled
        $(C.SELECTORS.FINAL_LABEL_HISTORY).closest('.dataTables_wrapper').find('input, select, button').prop('disabled', false);

        // Disable all inputs in OSS tab
        $('#tabOSS input.form-control, #tabOSS select.form-select, #tabOSS textarea.form-control').prop('disabled', true);
        $('#tabOSS .input-group .btn').prop('disabled', true);

        // OVERRIDE FOR RA: Show Approve and Return buttons
        const isRA = State.isUserRA && !State.isGuest;
        if (isRA) {
            console.log("f_ApplyDocReviewRoleAccess: RA user detected - showing Approve and Return buttons");

            // Show Approve and Return buttons for RA
            $(C.BUTTON_IDS.OSS_APPROVE).show().removeClass('d-none');
            $(C.BUTTON_IDS.OSS_RETURN).show().removeClass('d-none');

            // RA can edit Review and Catatan in document table (non-void rows only)
            // This will be handled in BindDocuments/getDocumentRow template
            // But we need to ensure document table inputs are enabled for RA
            console.log("f_ApplyDocReviewRoleAccess: RA can edit Review/Catatan in document table (non-void rows)");
        } else {
            // Non-RA: Disable all document table inputs as well
            console.log("f_ApplyDocReviewRoleAccess: Non-RA user - disabling all document table inputs");
            $(C.SELECTORS.DOC_TABLE + ' input, ' + C.SELECTORS.DOC_TABLE + ' select').prop('disabled', true);
            $(C.SELECTORS.DOC_TABLE + ' button').hide();
        }

        // Final enforcement
        setTimeout(function () {
            if (isRA) {
                $(C.BUTTON_IDS.OSS_APPROVE + ', ' + C.BUTTON_IDS.OSS_RETURN).show().removeClass('d-none');
                $(allActionButtonsToHide.filter(b => b !== C.BUTTON_IDS.OSS_APPROVE && b !== C.BUTTON_IDS.OSS_RETURN).join(', ')).hide().addClass('d-none');
            } else {
                $(allActionButtonsToHide.join(', ')).hide().addClass('d-none');
            }
            $(C.BUTTON_IDS.BACK).show().removeClass('d-none');
            // BUG FIX: Ensure Status History accordion is always enabled (final enforcement)
            $('#accordionStatusHistory .accordion-button').prop('disabled', false).show();
        }, 100);

        console.log("f_ApplyDocReviewRoleAccess: DOC_REVIEW access rules applied successfully");
    },

    /**
     * Apply DOC_APPROVED status access rules
     * OSS phase begins - Tab Permintaan Doc locked, Tab OSS enabled for RA (if Final Label also approved)
     */
    f_ApplyDocApprovedRoleAccess: function () {
        const State = RegalDetail.State;
        const C = RegalDetail.Constants;

        console.log("f_ApplyDocApprovedRoleAccess: Applying DOC_APPROVED status access rules");

        // 1. Hide ALL action buttons in header (for all roles)
        var allActionButtonsToHide = [
            C.BUTTON_IDS.SAVE_HEADER,
            C.BUTTON_IDS.REGAL_PROCESS_DOC,
            C.BUTTON_IDS.OSS_REQUEST_VERFOR,
            C.BUTTON_IDS.OSS_APPROVE,
            C.BUTTON_IDS.OSS_RETURN,
            C.BUTTON_IDS.REQUEST_REVIEW_LABEL,
            C.BUTTON_IDS.OPEN_MANAGE_FINAL_LABEL,
            '#btnSubmitLabel_RA',
            '#btnSubmitLabel_PD',
            '#btnSubmitLabel_PKG'
        ];
        $(allActionButtonsToHide.join(', ')).hide().addClass('d-none');

        // Keep Back button visible
        $(C.BUTTON_IDS.BACK).show().removeClass('d-none');

        // 2. Disable Tab "Permintaan Doc Registrasi" (Tab 1)
        // Lock all inputs EXCEPT history button
        $('#tabPermintaanDoc input.form-control, #tabPermintaanDoc select.form-select, #tabPermintaanDoc textarea.form-control')
            .prop('disabled', true);
        $('#tabPermintaanDoc .input-group .btn')
            .not('.btn-view-history') // Keep history button enabled
            .prop('disabled', true);

        // Disable document table inputs
        $(C.SELECTORS.DOC_TABLE + ' input, ' + C.SELECTORS.DOC_TABLE + ' select, ' + C.SELECTORS.DOC_TABLE + ' textarea')
            .prop('disabled', true);
        $(C.SELECTORS.DOC_TABLE + ' button')
            .not('.btn-view-history') // Keep history button enabled
            .hide();

        // Keep history buttons visible and enabled
        $(C.SELECTORS.DOC_TABLE + ' .btn-view-history').prop('disabled', false).show();

        // 3. Disable Final Label tab (exclude tblFinalLabelHistory table and DataTable elements)
        $('#tabFinalLabel input.form-control, #tabFinalLabel select.form-select, #tabFinalLabel textarea.form-control')
            .not(C.SELECTORS.FINAL_LABEL_HISTORY + ' :input') // Exclude Final Label History table inputs
            .not('.dataTables_filter input') // Exclude DataTable filter input
            .not('.dataTables_length select') // Exclude DataTable length select
            .prop('disabled', true);
        $('#tabFinalLabel .input-group .btn')
            .not(C.SELECTORS.FINAL_LABEL_HISTORY + ' .input-group .btn') // Exclude Final Label History table buttons
            .not('.dataTables_wrapper .btn') // Exclude DataTable buttons
            .prop('disabled', true);

        // Ensure DataTable elements remain enabled
        $(C.SELECTORS.FINAL_LABEL_HISTORY).closest('.dataTables_wrapper').find('input, select, button').prop('disabled', false);

        // 4. Enable Tab OSS for RA (ONLY if both Document Status AND Final Label Status are DOC_APPROVED)
        const isRA = State.isUserRA && !State.isGuest;

        // Get StatusFinalLabel from State (set from Header data)
        const statusFinalLabel = (State.currentStatusFinalLabel || '').toUpperCase();
        const isFinalLabelApproved = statusFinalLabel === C.STATUS.DOC_APPROVED || statusFinalLabel === 'DOC_APPROVED';

        console.log("f_ApplyDocApprovedRoleAccess: Checking OSS access conditions");
        console.log("  - isRA:", isRA);
        console.log("  - StatusFinalLabel:", statusFinalLabel);
        console.log("  - isFinalLabelApproved:", isFinalLabelApproved);

        // OSS tab ONLY enabled when: RA role + Status Document = DOC_APPROVED (NOT SUBMIT_OSS) + Status Final Label = DOC_APPROVED
        const currentRegalStatus = (State.currentRegalStatus || '').toUpperCase();
        const isDocApproved = currentRegalStatus === C.STATUS.DOC_APPROVED;
        if (isRA && isDocApproved && isFinalLabelApproved) {
            console.log("✅ f_ApplyDocApprovedRoleAccess: RA user + Document status DOC_APPROVED + Final Label DOC_APPROVED - ENABLING OSS tab");

            // Enable all inputs in OSS tab
            $('#tabOSS input.form-control, #tabOSS select.form-select, #tabOSS textarea.form-control')
                .prop('disabled', false);
            $('#tabOSS .input-group .btn').prop('disabled', false);
            $('#btnSearchJenisPbum').prop('disabled', false);

            // Show OSS specific buttons
            $(C.BUTTON_IDS.REQUEST_ID_OSS + ', ' + C.BUTTON_IDS.SIMPAN_ID_OSS).show().removeClass('d-none');
        } else {
            console.log("❌ f_ApplyDocApprovedRoleAccess: OSS tab DISABLED");
            if (!isRA) {
                console.log("   Reason: User is not RA");
            }
            if (!isFinalLabelApproved) {
                console.log("   Reason: Final Label status is not DOC_APPROVED (current:", statusFinalLabel, ")");
            }

            // Disable OSS tab
            $('#tabOSS input.form-control, #tabOSS select.form-select, #tabOSS textarea.form-control')
                .prop('disabled', true);
            $('#tabOSS .input-group .btn').prop('disabled', true);
            $('#btnSearchJenisPbum').prop('disabled', true);
            $(C.BUTTON_IDS.REQUEST_ID_OSS + ', ' + C.BUTTON_IDS.SIMPAN_ID_OSS).hide().addClass('d-none');
        }

        // 5. Ensure Status History accordion is always accessible
        $('#accordionStatusHistory .accordion-button').prop('disabled', false).show();
        $('#accordionStatusHistory :input').prop('disabled', false);

        // 6. Ensure navigation remains active (tabs, accordions)
        $('.nav-link, .accordion-button').prop('disabled', false);

        // Final enforcement
        setTimeout(function () {
            $(allActionButtonsToHide.join(', ')).hide().addClass('d-none');
            $(C.BUTTON_IDS.BACK).show().removeClass('d-none');

            // Re-check final label status for OSS access from State
            const statusFinalLabel = (State.currentStatusFinalLabel || '').toUpperCase();
            const isFinalLabelApproved = statusFinalLabel === C.STATUS.DOC_APPROVED || statusFinalLabel === 'DOC_APPROVED';
            const currentRegalStatusForEnforcement = (State.currentRegalStatus || '').toUpperCase();
            const isDocApprovedForEnforcement = currentRegalStatusForEnforcement === C.STATUS.DOC_APPROVED;

            if (isRA && isDocApprovedForEnforcement && isFinalLabelApproved) {
                console.log("✅ f_ApplyDocApprovedRoleAccess: Final enforcement - ENABLING OSS tab for RA (DOC_APPROVED only)");

                // Enable all inputs in OSS tab with explicit selectors
                $('#tabOSS input.form-control').prop('disabled', false);
                $('#tabOSS select.form-select').prop('disabled', false);
                $('#tabOSS textarea.form-control').prop('disabled', false);
                $('#tabOSS .input-group .btn').prop('disabled', false);
                $('#btnSearchJenisPbum').prop('disabled', false);

                // Show OSS buttons
                $(C.BUTTON_IDS.REQUEST_ID_OSS + ', ' + C.BUTTON_IDS.SIMPAN_ID_OSS).show().removeClass('d-none');
            } else {
                console.log("❌ f_ApplyDocApprovedRoleAccess: Final enforcement - DISABLING OSS tab");
                if (!isRA) {
                    console.log("   Reason: User is not RA");
                }
                if (!isFinalLabelApproved) {
                    console.log("   Reason: Final Label not DOC_APPROVED (current:", statusFinalLabel, ")");
                }

                $(C.BUTTON_IDS.REQUEST_ID_OSS + ', ' + C.BUTTON_IDS.SIMPAN_ID_OSS).hide().addClass('d-none');
                $('#tabOSS input.form-control').prop('disabled', true);
                $('#tabOSS select.form-select').prop('disabled', true);
                $('#tabOSS textarea.form-control').prop('disabled', true);
                $('#tabOSS .input-group .btn').prop('disabled', true);
                $('#btnSearchJenisPbum').prop('disabled', true);
            }

            // Keep history buttons enabled
            $('.btn-view-history').prop('disabled', false).show();
            $('#accordionStatusHistory .accordion-button').prop('disabled', false).show();

            console.log("f_ApplyDocApprovedRoleAccess: Final enforcement completed");
        }, 100);

        console.log("f_ApplyDocApprovedRoleAccess: DOC_APPROVED access rules applied successfully");
    },

    /**
     * Apply SUBMIT_OSS status access rules
     * OSS phase completed - Tab OSS disabled and buttons hidden for ALL roles
     */
    f_ApplySubmitOssRoleAccess: function () {
        const State = RegalDetail.State;
        const C = RegalDetail.Constants;

        console.log("f_ApplySubmitOssRoleAccess: Applying SUBMIT_OSS status access rules");

        // 1. Hide ALL action buttons in header (for all roles)
        var allActionButtonsToHide = [
            C.BUTTON_IDS.SAVE_HEADER,
            C.BUTTON_IDS.REGAL_PROCESS_DOC,
            C.BUTTON_IDS.OSS_REQUEST_VERFOR,
            C.BUTTON_IDS.OSS_APPROVE,
            C.BUTTON_IDS.OSS_RETURN,
            C.BUTTON_IDS.REQUEST_REVIEW_LABEL,
            C.BUTTON_IDS.OPEN_MANAGE_FINAL_LABEL,
            '#btnSubmitLabel_RA',
            '#btnSubmitLabel_PD',
            '#btnSubmitLabel_PKG'
        ];
        $(allActionButtonsToHide.join(', ')).hide().addClass('d-none');

        // Keep Back button visible
        $(C.BUTTON_IDS.BACK).show().removeClass('d-none');

        // 2. Disable Tab "Permintaan Doc Registrasi" (Tab 1)
        // Lock all inputs EXCEPT history button
        $('#tabPermintaanDoc input.form-control, #tabPermintaanDoc select.form-select, #tabPermintaanDoc textarea.form-control')
            .prop('disabled', true);
        $('#tabPermintaanDoc .input-group .btn')
            .not('.btn-view-history') // Keep history button enabled
            .prop('disabled', true);

        // Disable document table inputs
        $(C.SELECTORS.DOC_TABLE + ' input, ' + C.SELECTORS.DOC_TABLE + ' select, ' + C.SELECTORS.DOC_TABLE + ' textarea')
            .prop('disabled', true);
        $(C.SELECTORS.DOC_TABLE + ' button')
            .not('.btn-view-history') // Keep history button enabled
            .hide();

        // Keep history buttons visible and enabled
        $(C.SELECTORS.DOC_TABLE + ' .btn-view-history').prop('disabled', false).show();

        // 3. Disable Final Label tab (exclude tblFinalLabelHistory table and DataTable elements)
        $('#tabFinalLabel input.form-control, #tabFinalLabel select.form-select, #tabFinalLabel textarea.form-control')
            .not(C.SELECTORS.FINAL_LABEL_HISTORY + ' :input') // Exclude Final Label History table inputs
            .not('.dataTables_filter input') // Exclude DataTable filter input
            .not('.dataTables_length select') // Exclude DataTable length select
            .prop('disabled', true);
        $('#tabFinalLabel .input-group .btn')
            .not(C.SELECTORS.FINAL_LABEL_HISTORY + ' .input-group .btn') // Exclude Final Label History table buttons
            .not('.dataTables_wrapper .btn') // Exclude DataTable buttons
            .prop('disabled', true);

        // Ensure DataTable elements remain enabled
        $(C.SELECTORS.FINAL_LABEL_HISTORY).closest('.dataTables_wrapper').find('input, select, button').prop('disabled', false);

        // 4. Disable Tab OSS and hide all buttons for ALL roles when status is SUBMIT_OSS
        console.log("❌ f_ApplySubmitOssRoleAccess: DISABLING OSS tab and hiding buttons for ALL roles (Status: SUBMIT_OSS)");

        // Disable all inputs in OSS tab
        $('#tabOSS input.form-control, #tabOSS select.form-select, #tabOSS textarea.form-control')
            .prop('disabled', true);
        $('#tabOSS .input-group .btn').prop('disabled', true);
        $('#btnSearchJenisPbum').prop('disabled', true);

        // Hide OSS specific buttons
        $(C.BUTTON_IDS.REQUEST_ID_OSS + ', ' + C.BUTTON_IDS.SIMPAN_ID_OSS).hide().addClass('d-none');

        // 5. Ensure Status History accordion is always accessible
        $('#accordionStatusHistory .accordion-button').prop('disabled', false).show();
        $('#accordionStatusHistory :input').prop('disabled', false);

        // 6. Ensure navigation remains active (tabs, accordions)
        $('.nav-link, .accordion-button').prop('disabled', false);

        // Final enforcement
        setTimeout(function () {
            $(allActionButtonsToHide.join(', ')).hide().addClass('d-none');
            $(C.BUTTON_IDS.BACK).show().removeClass('d-none');

            // Final enforcement: Ensure OSS tab is disabled and buttons are hidden
            console.log("❌ f_ApplySubmitOssRoleAccess: Final enforcement - DISABLING OSS tab and hiding buttons");

            $(C.BUTTON_IDS.REQUEST_ID_OSS + ', ' + C.BUTTON_IDS.SIMPAN_ID_OSS).hide().addClass('d-none');
            $('#tabOSS input.form-control').prop('disabled', true);
            $('#tabOSS select.form-select').prop('disabled', true);
            $('#tabOSS textarea.form-control').prop('disabled', true);
            $('#tabOSS .input-group .btn').prop('disabled', true);
            $('#btnSearchJenisPbum').prop('disabled', true);

            // Keep history buttons enabled
            $('.btn-view-history').prop('disabled', false).show();
            $('#accordionStatusHistory .accordion-button').prop('disabled', false).show();

            console.log("f_ApplySubmitOssRoleAccess: Final enforcement completed");
        }, 100);

        console.log("f_ApplySubmitOssRoleAccess: SUBMIT_OSS access rules applied successfully");
    },

    /**
     * Handle NEED_REVISION status - Isolated function for clean code structure
     * This function handles global UI settings (hide buttons, disable inputs) for NEED_REVISION status
     * Row-level permissions are handled separately in Templates and applyNonRARowLevelAccess
     */
    f_HandleNeedRevisionStatus: function () {
        const State = RegalDetail.State;
        const C = RegalDetail.Constants;

        console.log("f_HandleNeedRevisionStatus: Applying NEED_REVISION status UI restrictions");

        // 1. Hide ALL action buttons in header (for all roles)
        var allActionButtonsToHide = [
            C.BUTTON_IDS.SAVE_HEADER,
            C.BUTTON_IDS.REGAL_PROCESS_DOC,
            C.BUTTON_IDS.OSS_REQUEST_VERFOR,
            C.BUTTON_IDS.OSS_APPROVE,
            C.BUTTON_IDS.OSS_RETURN,
            C.BUTTON_IDS.REQUEST_ID_OSS,
            C.BUTTON_IDS.SIMPAN_ID_OSS,
            C.BUTTON_IDS.REQUEST_REVIEW_LABEL,
            C.BUTTON_IDS.OPEN_MANAGE_FINAL_LABEL,
            '#btnSubmitLabel_RA',
            '#btnSubmitLabel_PD',
            '#btnSubmitLabel_PKG'
        ];
        $(allActionButtonsToHide.join(', ')).hide().addClass('d-none');

        // Keep Back button visible
        $(C.BUTTON_IDS.BACK).show().removeClass('d-none');

        // 2. Disable all form inputs in "Permintaan Doc Registrasi" tab
        // Exclude document table inputs (row-level permissions handled separately)
        // Exclude Status History accordion (always accessible)
        $(C.SELECTORS.FORM + ' input.form-control, ' + C.SELECTORS.FORM + ' select.form-select, ' + C.SELECTORS.FORM + ' textarea.form-control')
            .not(C.SELECTORS.DOC_TABLE + ' :input') // Exclude document table inputs
            .not('#accordionStatusHistory :input') // Exclude Status History accordion inputs
            .prop('disabled', true);

        // Disable LOV search buttons in header
        $(C.SELECTORS.FORM + ' .input-group .btn')
            .not(C.SELECTORS.DOC_TABLE + ' .input-group .btn') // Exclude document table buttons
            .not('#accordionStatusHistory .input-group .btn') // Exclude Status History accordion buttons
            .prop('disabled', true);

        // Ensure Status History accordion buttons are always enabled
        $('#accordionStatusHistory .accordion-button').prop('disabled', false).show();

        // 3. Disable all inputs in Final Label tab (exclude tblFinalLabelHistory table and DataTable elements)
        $('#tabFinalLabel input.form-control, #tabFinalLabel select.form-select, #tabFinalLabel textarea.form-control')
            .not(C.SELECTORS.FINAL_LABEL_HISTORY + ' :input') // Exclude Final Label History table inputs
            .not('.dataTables_filter input') // Exclude DataTable filter input
            .not('.dataTables_length select') // Exclude DataTable length select
            .prop('disabled', true);
        $('#tabFinalLabel .input-group .btn')
            .not(C.SELECTORS.FINAL_LABEL_HISTORY + ' .input-group .btn') // Exclude Final Label History table buttons
            .not('.dataTables_wrapper .btn') // Exclude DataTable buttons
            .prop('disabled', true);

        // Ensure DataTable elements remain enabled
        $(C.SELECTORS.FINAL_LABEL_HISTORY).closest('.dataTables_wrapper').find('input, select, button').prop('disabled', false);

        // 4. Disable all inputs in OSS tab
        $('#tabOSS input.form-control, #tabOSS select.form-select, #tabOSS textarea.form-control').prop('disabled', true);
        $('#tabOSS .input-group .btn').prop('disabled', true);

        // 5. Final enforcement with setTimeout
        setTimeout(function () {
            $(allActionButtonsToHide.join(', ')).hide().addClass('d-none');
            $(C.BUTTON_IDS.BACK).show().removeClass('d-none');
            $('#accordionStatusHistory .accordion-button').prop('disabled', false).show();
            console.log("f_HandleNeedRevisionStatus: Final enforcement - All action buttons hidden, Back button visible, Status History enabled");
        }, 100);

        console.log("f_HandleNeedRevisionStatus: NEED_REVISION UI restrictions applied successfully");
    },

    /**
     * Task 3: Apply role access for Non-RA users (BD, PCD, PDV) at DOC_IN_PROCESS status
     * Aturan: Hanya boleh edit di Tab "DOKUMEN REGISTRASI", tab lain harus Read-Only
     */
    f_ApplyNonRARoleAccess: function (normalizedRole) {
        const State = RegalDetail.State;
        const C = RegalDetail.Constants;

        console.log("f_ApplyNonRARoleAccess: Applying Non-RA role access for:", normalizedRole);

        // Cek apakah status adalah DOC_IN_PROCESS
        const isDocInProcess = State.currentRegalStatus === C.STATUS.DOC_IN_PROCESS;

        if (!isDocInProcess) {
            console.log("f_ApplyNonRARoleAccess: Status is not DOC_IN_PROCESS, using default access");
            // Jika bukan DOC_IN_PROCESS, gunakan default access
            return;
        }

        console.log("f_ApplyNonRARoleAccess: Status is DOC_IN_PROCESS, applying restricted access for Non-RA");

        // Task 3: Pastikan tombol "Simpan" tetap MUNCUL untuk bisa simpan Catatan
        $(C.BUTTON_IDS.SAVE_HEADER).show().removeClass('d-none');

        // Hide semua tombol aksi lain (Process Document, Request Verfor, Approve, Return, dll)
        // BUG VISIBILITAS FIX: #btnRequestReviewLabel visibility is controlled by f_UpdateFinalLabelStatusUI
        // Do NOT hide it here, let f_UpdateFinalLabelStatusUI determine its visibility
        var actionButtonsToHide = [
            C.BUTTON_IDS.REGAL_PROCESS_DOC,
            C.BUTTON_IDS.OSS_REQUEST_VERFOR,
            C.BUTTON_IDS.OSS_APPROVE,
            C.BUTTON_IDS.OSS_RETURN,
            C.BUTTON_IDS.REQUEST_ID_OSS,
            C.BUTTON_IDS.SIMPAN_ID_OSS,
            // C.BUTTON_IDS.REQUEST_REVIEW_LABEL, // REMOVED: Visibility controlled by f_UpdateFinalLabelStatusUI
            // Note: OPEN_MANAGE_FINAL_LABEL tidak di-hide untuk BD (akan di-handle setelah ini)
            '#btnSubmitLabel_RA',
            '#btnSubmitLabel_PD',
            '#btnSubmitLabel_PKG'
        ];
        $(actionButtonsToHide.join(', ')).hide().addClass('d-none');

        // Task 2: BD role exception - Allow BD to access Final Label file management
        const isBD = normalizedRole === C.ROLES.BD;
        if (isBD) {
            // BD should have access to Final Label file management button
            $(C.BUTTON_IDS.OPEN_MANAGE_FINAL_LABEL).show().removeClass('d-none');
            console.log("f_ApplyNonRARoleAccess: BD role detected - showing Final Label manage button");
        } else {
            // Hide for other Non-RA roles (PCD, PDV)
            $(C.BUTTON_IDS.OPEN_MANAGE_FINAL_LABEL).hide().addClass('d-none');
        }

        // TASK 3: Disable input di Header Form (Permintaan Doc Registrasi - bagian atas)
        // GUNAKAN SELEKTOR SPESIFIK: Matikan form header, tapi biarkan tabel dokumen hidup
        $(C.SELECTORS.FORM + ' input.form-control, ' + C.SELECTORS.FORM + ' select.form-select, ' + C.SELECTORS.FORM + ' textarea.form-control')
            .not('#btnSaveRegalHeader') // Exclude save button
            .not(C.SELECTORS.DOC_TABLE + ' :input') // TASK 3: Exclude semua input di tabel dokumen
            .prop('disabled', true);

        // TASK 3: Disable LOV search buttons di Header (tapi bukan di tabel dokumen)
        $(C.SELECTORS.FORM + ' .input-group .btn')
            .not(C.SELECTORS.DOC_TABLE + ' .input-group .btn') // TASK 3: Exclude buttons di tabel dokumen
            .prop('disabled', true);

        // Disable semua input di Tab Final Label (exclude tblFinalLabelHistory table and DataTable elements)
        $('#tabFinalLabel input.form-control, #tabFinalLabel select.form-select, #tabFinalLabel textarea.form-control')
            .not(C.SELECTORS.FINAL_LABEL_HISTORY + ' :input') // Exclude Final Label History table inputs
            .not('.dataTables_filter input') // Exclude DataTable filter input
            .not('.dataTables_length select') // Exclude DataTable length select
            .prop('disabled', true);
        $('#tabFinalLabel .input-group .btn')
            .not(C.SELECTORS.FINAL_LABEL_HISTORY + ' .input-group .btn') // Exclude Final Label History table buttons
            .not('.dataTables_wrapper .btn') // Exclude DataTable buttons
            .prop('disabled', true);

        // Ensure DataTable elements remain enabled
        $(C.SELECTORS.FINAL_LABEL_HISTORY).closest('.dataTables_wrapper').find('input, select, button').prop('disabled', false);

        // Disable semua input di Tab OSS
        $('#tabOSS input.form-control, #tabOSS select.form-select, #tabOSS textarea.form-control').prop('disabled', true);
        $('#tabOSS .input-group .btn').prop('disabled', true);

        // TASK 3: Tab "DOKUMEN REGISTRASI" (tabel dokumen) tetap enabled
        // Row-level access control sudah di-handle di applyNonRARowLevelAccess
        // Jadi kita TIDAK disable input di tabel dokumen di sini
        console.log("f_ApplyNonRARoleAccess: TASK 3 - Header form inputs disabled, but document table inputs remain enabled for row-level control");

        console.log("f_ApplyNonRARoleAccess: Applied restricted access - only Dokumen Registrasi tab is editable");
    },

    /**
     * Role-Based Access Control Manager Function
     * This function applies role-based restrictions to the form
     */
    f_ApplyRoleAccess: function (userDept) {
        const State = RegalDetail.State;
        const C = RegalDetail.Constants;
        const role = (userDept || '').toUpperCase().trim();

        console.log("f_ApplyRoleAccess: Applying role access for:", role);

        // Check if role is in allowed list
        const isAllowed = this.f_IsAllowedRole(userDept);

        // CRITICAL: Check DOC_REVIEW status FIRST (before other status checks)
        const isDocReview = (State.currentRegalStatus || '').toUpperCase() === C.STATUS.DOC_REVIEW;
        if (isDocReview) {
            console.log("f_ApplyRoleAccess: Status is DOC_REVIEW - applying DOC_REVIEW specific rules");
            this.f_ApplyDocReviewRoleAccess();
            return; // Early return - DOC_REVIEW has its own complete logic
        }

        // CRITICAL: Check DOC_APPROVED status (OSS phase begins)
        const isDocApproved = (State.currentRegalStatus || '').toUpperCase() === C.STATUS.DOC_APPROVED;
        if (isDocApproved) {
            console.log("f_ApplyRoleAccess: Status is DOC_APPROVED - applying DOC_APPROVED specific rules");
            this.f_ApplyDocApprovedRoleAccess();
            return; // Early return - DOC_APPROVED has its own complete logic
        }

        // CRITICAL: Check SUBMIT_OSS status - OSS tab disabled and buttons hidden for all roles
        const isSubmitOss = (State.currentRegalStatus || '').toUpperCase() === C.STATUS.SUBMIT_OSS;
        if (isSubmitOss) {
            console.log("f_ApplyRoleAccess: Status is SUBMIT_OSS - applying SUBMIT_OSS specific rules (OSS tab disabled for all roles)");
            this.f_ApplySubmitOssRoleAccess();
            return; // Early return - SUBMIT_OSS has its own complete logic
        }

        // CRITICAL: Check NEED_REVISION status (before other status checks)
        const isNeedRevision = (State.currentRegalStatus || '').toUpperCase() === C.STATUS.NEED_REVISION;
        if (isNeedRevision) {
            console.log("f_ApplyRoleAccess: Status is NEED_REVISION - applying NEED_REVISION specific rules");
            // Call isolated function to handle NEED_REVISION UI restrictions
            this.f_HandleNeedRevisionStatus();
            // Row-level permissions are handled in Templates.getDocumentRow and applyNonRARowLevelAccess
            // Continue to role-specific logic below if needed
        }

        // CRITICAL: Check DRAFT status - Only RA can edit, Non-RA should be view-only
        const isDraft = (State.currentRegalStatus || '').toUpperCase() === C.STATUS.DRAFT;
        if (isDraft && !State.isUserRA) {
            console.log("f_ApplyRoleAccess: Status is DRAFT - only RA can edit, disabling all inputs for Non-RA");
            // Hide all action buttons for Non-RA
            var allActionButtonsToHide = [
                C.BUTTON_IDS.SAVE_HEADER,
                C.BUTTON_IDS.REGAL_PROCESS_DOC,
                C.BUTTON_IDS.OSS_REQUEST_VERFOR,
                C.BUTTON_IDS.OSS_APPROVE,
                C.BUTTON_IDS.OSS_RETURN,
                C.BUTTON_IDS.REQUEST_ID_OSS,
                C.BUTTON_IDS.SIMPAN_ID_OSS,
                C.BUTTON_IDS.REQUEST_REVIEW_LABEL,
                C.BUTTON_IDS.OPEN_MANAGE_FINAL_LABEL,
                '#btnSubmitLabel_RA',
                '#btnSubmitLabel_PD',
                '#btnSubmitLabel_PKG'
            ];
            $(allActionButtonsToHide.join(', ')).hide().addClass('d-none');

            // Disable all form inputs in Permintaan Doc Registrasi tab
            $(C.SELECTORS.FORM + ' input.form-control, ' + C.SELECTORS.FORM + ' select.form-select, ' + C.SELECTORS.FORM + ' textarea.form-control')
                .not(C.SELECTORS.DOC_TABLE + ' :input') // Exclude document table inputs (handled separately)
                .not('#accordionStatusHistory :input') // Exclude Status History accordion inputs
                .prop('disabled', true);

            // Disable LOV search buttons in header
            $(C.SELECTORS.FORM + ' .input-group .btn')
                .not(C.SELECTORS.DOC_TABLE + ' .input-group .btn') // Exclude document table buttons
                .not('#accordionStatusHistory .input-group .btn') // Exclude Status History accordion buttons
                .prop('disabled', true);

            // Disable all inputs in Final Label tab (exclude tblFinalLabelHistory table and DataTable elements)
            $('#tabFinalLabel input.form-control, #tabFinalLabel select.form-select, #tabFinalLabel textarea.form-control')
                .not(C.SELECTORS.FINAL_LABEL_HISTORY + ' :input') // Exclude Final Label History table inputs
                .not('.dataTables_filter input') // Exclude DataTable filter input
                .not('.dataTables_length select') // Exclude DataTable length select
                .prop('disabled', true);
            $('#tabFinalLabel .input-group .btn')
                .not(C.SELECTORS.FINAL_LABEL_HISTORY + ' .input-group .btn') // Exclude Final Label History table buttons
                .not('.dataTables_wrapper .btn') // Exclude DataTable buttons
                .prop('disabled', true);

            // Ensure DataTable elements remain enabled
            $(C.SELECTORS.FINAL_LABEL_HISTORY).closest('.dataTables_wrapper').find('input, select, button').prop('disabled', false);

            // Disable all inputs in OSS tab
            $('#tabOSS input.form-control, #tabOSS select.form-select, #tabOSS textarea.form-control').prop('disabled', true);
            $('#tabOSS .input-group .btn').prop('disabled', true);

            // Disable inputs in document table (view-only for Non-RA at DRAFT status)
            $(C.SELECTORS.DOC_TABLE + ' input, ' + C.SELECTORS.DOC_TABLE + ' select').prop('disabled', true);
            $(C.SELECTORS.DOC_TABLE + ' button').hide();

            // Keep Back button visible
            $(C.BUTTON_IDS.BACK).show().removeClass('d-none');

            // Ensure Status History accordion is always accessible
            $('#accordionStatusHistory .accordion-button').prop('disabled', false).show();

            // Final enforcement with setTimeout
            setTimeout(function () {
                $(allActionButtonsToHide.join(', ')).hide().addClass('d-none');
                $(C.BUTTON_IDS.BACK).show().removeClass('d-none');
                $('#accordionStatusHistory .accordion-button').prop('disabled', false).show();
                console.log("f_ApplyRoleAccess: Final enforcement - DRAFT status view-only mode for Non-RA applied");
            }, 100);

            return; // Early return - Non-RA should be view-only at DRAFT status
        }

        // Check if status is locked (non-editable statuses)
        // If status is DOC_IN_PROCESS or DOC_REVIEW, lock form inputs
        // TASK 3: Pastikan disable input tidak mematikan tabel dokumen
        const isLockedStatus = this.f_IsLockedStatus();
        if (isLockedStatus && !State.isGuest) {
            console.log("f_ApplyRoleAccess: Status is locked (DOC_IN_PROCESS/DOC_REVIEW/DOC_APPROVED). Locking form header inputs...");
            // TASK 3: Disable form header inputs (GUNAKAN SELEKTOR SPESIFIK: exclude tabel dokumen)
            $(C.SELECTORS.FORM + ' input.form-control, ' + C.SELECTORS.FORM + ' select.form-select, ' + C.SELECTORS.FORM + ' textarea.form-control')
                .not('#btnSaveRegalHeader, #btnRegalProcessDoc, #btnOSSRequestVerfor, #btnOSSApprove, #btnOSSReturn') // Exclude action buttons
                .not(C.SELECTORS.DOC_TABLE + ' :input') // TASK 3: Exclude semua input di tabel dokumen
                .prop('disabled', true);
            // TASK 3: Disable LOV search buttons in form header (tapi bukan di tabel dokumen)
            $(C.SELECTORS.FORM + ' .input-group .btn')
                .not(C.SELECTORS.DOC_TABLE + ' .input-group .btn') // TASK 3: Exclude buttons di tabel dokumen
                .prop('disabled', true);
            console.log("f_ApplyRoleAccess: TASK 3 - Form header inputs disabled, but document table inputs preserved for row-level control");
        }

        if (isAllowed) {
            // Normalize role to determine specific role
            const normalizedRole = this.f_NormalizeRole(userDept);

            // Switch case for each specific role
            switch (normalizedRole) {
                case C.ROLES.RA:
                    // Apply specific logic for RA
                    this.f_ApplyRARoleAccess();
                    break;

                case C.ROLES.BD:
                    console.log("f_ApplyRoleAccess: Non-RA role detected:", normalizedRole);
                    this.f_ApplyNonRARoleAccess(normalizedRole);
                    break;
                case C.ROLES.PCD:
                    console.log("f_ApplyRoleAccess: Non-RA role detected:", normalizedRole);
                    this.f_ApplyNonRARoleAccess(normalizedRole);
                    break;
                case C.ROLES.PDV:
                    // BUG 2 FIX: Apply logic for Non-RA roles (BD, PCD, PDV)
                    // Untuk status DOC_IN_PROCESS, apply restricted access (hanya boleh edit Dokumen Registrasi)
                    // Tombol aksi di Header akan di-hide oleh UpdateActionButtonsVisibility
                    console.log("f_ApplyRoleAccess: Non-RA role detected:", normalizedRole);
                    this.f_ApplyNonRARoleAccess(normalizedRole);
                    break;

                case C.ROLES.RAOSS:
                    // TODO: Implement logic for RAOSS
                    console.log("f_ApplyRoleAccess: RAOSS role detected - using default access for now");
                    break;

                default:
                    console.log("f_ApplyRoleAccess: Allowed role but no specific logic - using default access");
                    // Ensure all action buttons are visible by default for allowed roles
                    $(C.BUTTON_IDS.SAVE_HEADER + ', ' + C.BUTTON_IDS.REGAL_PROCESS_DOC + ', ' + C.BUTTON_IDS.OSS_REQUEST_VERFOR + ', ' + C.BUTTON_IDS.OSS_APPROVE + ', ' + C.BUTTON_IDS.OSS_RETURN + ', ' + C.BUTTON_IDS.REQUEST_ID_OSS + ', ' + C.BUTTON_IDS.SIMPAN_ID_OSS + ', ' + C.BUTTON_IDS.REQUEST_REVIEW_LABEL + ', ' + C.BUTTON_IDS.OPEN_MANAGE_FINAL_LABEL + ', #btnSubmitLabel_RA, #btnSubmitLabel_PD, #btnSubmitLabel_PKG').show().removeClass('d-none');
                    // Ensure all inputs are enabled by default for allowed roles
                    $(C.SELECTORS.FORM + ' :input, ' + C.SELECTORS.DETAIL_SECTION + ' input.form-control, ' + C.SELECTORS.DETAIL_SECTION + ' select.form-select, ' + C.SELECTORS.DETAIL_SECTION + ' textarea.form-control').prop('disabled', false);
                    $('.input-group .btn').prop('disabled', false).show().removeClass('d-none');
                    $(C.SELECTORS.DOC_TABLE + ' input, ' + C.SELECTORS.DOC_TABLE + ' select').prop('disabled', false);
                    $(C.SELECTORS.DOC_TABLE + ' button').show().removeClass('d-none');
                    break;
            }
        }
        else {
            // --- LOGIC FOR "GUEST" / OTHER ROLES (Strict View-Only Mode) ---
            console.log("f_ApplyRoleAccess: User is GUEST (View Only). Locking UI...");

            // Hide all action buttons
            var allActionButtons = [
                C.BUTTON_IDS.SAVE_HEADER,
                C.BUTTON_IDS.REGAL_PROCESS_DOC,
                C.BUTTON_IDS.OSS_REQUEST_VERFOR,
                C.BUTTON_IDS.OSS_APPROVE,
                C.BUTTON_IDS.OSS_RETURN,
                C.BUTTON_IDS.REQUEST_ID_OSS,
                C.BUTTON_IDS.SIMPAN_ID_OSS,
                C.BUTTON_IDS.REQUEST_REVIEW_LABEL,
                C.BUTTON_IDS.OPEN_MANAGE_FINAL_LABEL
            ];
            $(allActionButtons.join(', ')).hide().addClass('d-none');

            // Hide approval buttons in Final Label tab
            $('#btnSubmitLabel_RA, #btnSubmitLabel_PD, #btnSubmitLabel_PKG').hide().addClass('d-none');

            // Hide additional action buttons
            $(C.SELECTORS.DETAIL_SECTION + ' button.btn-primary, ' + C.SELECTORS.DETAIL_SECTION + ' button.btn-success, ' + C.SELECTORS.DETAIL_SECTION + ' button.btn-warning, ' + C.SELECTORS.DETAIL_SECTION + ' button.btn-info, ' + C.SELECTORS.DETAIL_SECTION + ' button.btn-danger, ' + C.SELECTORS.DETAIL_SECTION + ' button.btn-outline-primary').not('.accordion-button, .nav-link, .btn-secondary, ' + C.BUTTON_IDS.BACK).hide();

            // Disable all form inputs
            $(C.SELECTORS.FORM + ' :input').not('.accordion-button, .nav-link, ' + C.BUTTON_IDS.BACK).prop('disabled', true);
            $(C.SELECTORS.DETAIL_SECTION + ' input.form-control, ' + C.SELECTORS.DETAIL_SECTION + ' select.form-select, ' + C.SELECTORS.DETAIL_SECTION + ' textarea.form-control').not('.accordion-button, .nav-link').prop('disabled', true);

            // Disable and hide LOV search buttons
            var lovButtons = [
                '#btnSearchNomorIzinEdar',
                '#btnSearchVerforNo',
                '#btnSearchKbli',
                '#btnSearchPicRaOss'
            ];
            $(lovButtons.join(', ')).prop('disabled', true).hide();
            $(C.SELECTORS.DETAIL_SECTION + ' .input-group .btn, ' + C.SELECTORS.FORM + ' .input-group .btn').prop('disabled', true).hide();

            // Disable inputs in document table
            $(C.SELECTORS.DOC_TABLE + ' input, ' + C.SELECTORS.DOC_TABLE + ' select').prop('disabled', true);
            $(C.SELECTORS.DOC_TABLE + ' button').hide();

            // Ensure navigation remains active
            $(C.SELECTORS.DETAIL_SECTION + ' .accordion-button').prop('disabled', false).show();
            $(C.SELECTORS.DETAIL_SECTION + ' .nav-link').prop('disabled', false).show();
            $(C.BUTTON_IDS.BACK).prop('disabled', false).show();
            $('#regalTabs .nav-link').prop('disabled', false).show();
            $('#accordionStatusHistory .accordion-button').prop('disabled', false).show();

            // Final check
            setTimeout(function () {
                $(allActionButtons.join(', ')).hide().addClass('d-none');
                $('#btnRequestReviewLabel, #btnOpenManageFinalLabelModal, #btnSubmitLabel_RA, #btnSubmitLabel_PD, #btnSubmitLabel_PKG').hide().addClass('d-none');
                console.log("f_ApplyRoleAccess: Final check completed - all action buttons forced to hide");
            }, 100);

            console.log("f_ApplyRoleAccess: Strict restrictions applied for GUEST role (View Only Mode)");
            console.log("f_ApplyRoleAccess: Navigation elements (Tabs, Accordions, Back button) remain active");
        }

        // ========================================================================
        // SECURITY FORCE LOCK: RA User + NEED_REVISION Status
        // ========================================================================
        // CRITICAL: This must be executed LAST to override any other logic that might enable inputs
        // On NEED_REVISION status, the ball is with Non-RA users (BD/PDV/PCD), so RA must be Read-Only total
        // This prevents RA from editing form inputs that might have been enabled by other functions
        // (e.g., BindData, f_UpdateFinalLabelStatusUI, or other initialization logic)
        // ========================================================================
        if (State.isUserRA && (State.currentRegalStatus || '').toUpperCase() === C.STATUS.NEED_REVISION) {
            console.log("SECURITY FORCE LOCK: RA User + NEED_REVISION -> Disabling ALL Inputs (Final Lock)");

            // 1. Matikan semua input form (Header, Tabs) - termasuk document table untuk RA
            $(C.SELECTORS.FORM + ' input, ' + C.SELECTORS.FORM + ' select, ' + C.SELECTORS.FORM + ' textarea').prop('disabled', true);

            // 2. Matikan tombol Search LOV (icon kaca pembesar)
            $(C.SELECTORS.FORM + ' .input-group button').prop('disabled', true);

            // 3. Matikan input di document table untuk RA (RA tidak boleh edit dokumen di NEED_REVISION)
            $(C.SELECTORS.DOC_TABLE + ' input, ' + C.SELECTORS.DOC_TABLE + ' select, ' + C.SELECTORS.DOC_TABLE + ' textarea').prop('disabled', true);
            $(C.SELECTORS.DOC_TABLE + ' .input-group button').prop('disabled', true);

            // 4. Matikan/Sembunyikan semua tombol aksi utama
            // EXCEPTION: ALWAYS keep btnOpenManageFinalLabelModal visible for RA to review and download documents (any status)
            var actionButtons = [
                C.BUTTON_IDS.SAVE_HEADER,
                C.BUTTON_IDS.REGAL_PROCESS_DOC,
                C.BUTTON_IDS.OSS_REQUEST_VERFOR,
                C.BUTTON_IDS.OSS_APPROVE,
                C.BUTTON_IDS.OSS_RETURN,
                C.BUTTON_IDS.REQUEST_ID_OSS,
                C.BUTTON_IDS.SIMPAN_ID_OSS,
                C.BUTTON_IDS.REQUEST_REVIEW_LABEL,
                '#btnSubmitLabel_RA',
                '#btnSubmitLabel_PD',
                '#btnSubmitLabel_PKG'
            ];
            // NOTE: OPEN_MANAGE_FINAL_LABEL is NOT added to hide list - RA can always review and download

            // Always keep btnOpenManageFinalLabelModal visible for RA - they can review and download at any status
            $(C.BUTTON_IDS.OPEN_MANAGE_FINAL_LABEL).removeClass('d-none').show().prop('disabled', false);
            console.log("SECURITY FORCE LOCK: btnOpenManageFinalLabelModal kept visible for RA (review and download access)");

            $(actionButtons.join(', ')).hide().addClass('d-none');

            // 5. Matikan input di Final Label tab (exclude tblFinalLabelHistory table and DataTable elements)
            $('#tabFinalLabel input.form-control, #tabFinalLabel select.form-select, #tabFinalLabel textarea.form-control')
                .not(C.SELECTORS.FINAL_LABEL_HISTORY + ' :input') // Exclude Final Label History table inputs
                .not('.dataTables_filter input') // Exclude DataTable filter input
                .not('.dataTables_length select') // Exclude DataTable length select
                .prop('disabled', true);
            $('#tabFinalLabel .input-group .btn')
                .not(C.SELECTORS.FINAL_LABEL_HISTORY + ' .input-group .btn') // Exclude Final Label History table buttons
                .not('.dataTables_wrapper .btn') // Exclude DataTable buttons
                .prop('disabled', true);

            // Ensure DataTable elements remain enabled
            $(C.SELECTORS.FINAL_LABEL_HISTORY).closest('.dataTables_wrapper').find('input, select, button').prop('disabled', false);

            // 6. Matikan input di OSS tab
            $('#tabOSS input.form-control, #tabOSS select.form-select, #tabOSS textarea.form-control').prop('disabled', true);
            $('#tabOSS .input-group .btn').prop('disabled', true);

            // 7. PENGECUALIAN PENTING: Pastikan tombol "Kembali" dan Navigasi Tab tetap hidup
            $(C.BUTTON_IDS.BACK).prop('disabled', false).show().removeClass('d-none');
            $('.nav-link, .accordion-button').prop('disabled', false);

            // 8. PENGECUALIAN: Status History accordion harus tetap bisa diakses
            $('#accordionStatusHistory .accordion-button').prop('disabled', false).show();
            $('#accordionStatusHistory :input').prop('disabled', false);

            // 9. Final enforcement dengan setTimeout untuk memastikan lock benar-benar diterapkan
            setTimeout(function () {
                $(C.SELECTORS.FORM + ' input, ' + C.SELECTORS.FORM + ' select, ' + C.SELECTORS.FORM + ' textarea').prop('disabled', true);
                $(C.SELECTORS.FORM + ' .input-group button').prop('disabled', true);
                $(C.SELECTORS.DOC_TABLE + ' input, ' + C.SELECTORS.DOC_TABLE + ' select, ' + C.SELECTORS.DOC_TABLE + ' textarea').prop('disabled', true);
                $(C.SELECTORS.DOC_TABLE + ' .input-group button').prop('disabled', true);
                $(actionButtons.join(', ')).hide().addClass('d-none');
                $(C.BUTTON_IDS.BACK).prop('disabled', false).show().removeClass('d-none');
                $('#accordionStatusHistory .accordion-button').prop('disabled', false).show();
                $('#accordionStatusHistory :input').prop('disabled', false);

                // ALWAYS keep btnOpenManageFinalLabelModal visible for RA (any status) - they can review and download
                $(C.BUTTON_IDS.OPEN_MANAGE_FINAL_LABEL).removeClass('d-none').show().prop('disabled', false);
                console.log("SECURITY FORCE LOCK: Final enforcement - btnOpenManageFinalLabelModal kept visible for RA (review and download)");

                console.log("SECURITY FORCE LOCK: Final enforcement completed - RA locked on NEED_REVISION status");
            }, 100);

            console.log("SECURITY FORCE LOCK: RA User locked on NEED_REVISION status - All inputs disabled, only navigation remains active");
        }

        // Final enforcement: Enable namaJenis when status is DRAFT and role is RA
        // This must be after all other logic to ensure it's not overridden
        const finalStatus = State.currentRegalStatus || '';
        if (finalStatus === C.STATUS.DRAFT && State.isUserRA && !State.isGuest) {
            $('#namaJenis').prop('disabled', false);
            console.log("f_ApplyRoleAccess: Final enforcement - namaJenis enabled for RA with DRAFT status");
        }
    },

    /**
     * Bind documents to table
     * Uses Templates.getDocumentRow() for HTML generation
     */
    BindDocuments: function (documents) {
        const State = RegalDetail.State;
        const C = RegalDetail.Constants;
        const Utils = RegalDetail.Utils;
        const Templates = RegalDetail.Templates;

        console.log("BindDocuments called with:", documents);

        // TASK 1: Verifikasi currentUserRoleCode sudah terisi sebelum loop
        console.log("BindDocuments: TASK 1 VERIFY - currentUserRoleCode:", State.currentUserRoleCode);
        console.log("BindDocuments: TASK 1 VERIFY - isUserRA:", State.isUserRA);
        console.log("BindDocuments: TASK 1 VERIFY - isGuest:", State.isGuest);
        console.log("BindDocuments: TASK 1 VERIFY - currentRegalStatus:", State.currentRegalStatus);

        // Ensure user role is checked (fallback jika belum terisi)
        if (!State.currentUserRoleCode || State.currentUserRoleCode.trim() === '') {
            console.warn("BindDocuments: TASK 1 WARNING - currentUserRoleCode is empty, attempting fallback");
            Utils.checkUserRole();
        }

        // Use State.isGuest flag (set in BindData)
        if (typeof State.isGuest === 'undefined') {
            State.isGuest = !this.f_IsAllowedRole(State.currentUserRoleCode);
        }

        var tbody = $(C.SELECTORS.DOC_TABLE + ' tbody');
        tbody.empty();

        if (documents && documents.length > 0) {
            console.log("BindDocuments: Binding", documents.length, "documents");
            console.log("BindDocuments: Current user is RA:", State.isUserRA);
            console.log("BindDocuments: Current user is Guest:", State.isGuest);
            console.log("BindDocuments: Current regal status:", State.currentRegalStatus);

            for (var i = 0; i < documents.length; i++) {
                var doc = documents[i];

                // TASK 1: Log role matching untuk setiap dokumen di loop
                var rowPicCode = (doc.ConfigUpload && doc.ConfigUpload.TransactionPIC) ? doc.ConfigUpload.TransactionPIC : '';
                console.log(`BindDocuments: TASK 1 - Row ${i}: currentUserRoleCode="${State.currentUserRoleCode}", rowPicCode="${rowPicCode}"`);

                // Use Templates.getDocumentRow() to generate HTML
                // Note: We pass State as the state parameter for the template
                var row = Templates.getDocumentRow(doc, i, State);
                tbody.append(row);
            }

            console.log("Documents bound successfully");

            // Initialize tooltips after rendering
            $(C.SELECTORS.DOC_TABLE + ' [data-bs-toggle="tooltip"]').tooltip();

            // BUG A FIX: Apply row-level access control for Non-RA users (BD, PCD, PDV)
            // Must be called AFTER rendering to ensure buttons are correctly enabled/disabled
            this.applyNonRARowLevelAccess(documents);

            // Re-apply role restrictions to dynamically generated elements for Guest
            if (State.isGuest) {
                console.log("BindDocuments: Applying strict Guest restrictions to document table elements");
                $(C.SELECTORS.DOC_TABLE + ' input, ' + C.SELECTORS.DOC_TABLE + ' select').prop('disabled', true);
                $(C.SELECTORS.DOC_TABLE + ' button').hide();
            }
        } else {
            console.warn("No documents to bind");
            tbody.append(Templates.getEmptyTableRow('Tidak ada dokumen', 7));
        }
    },

    /**
     * BUG A FIX: Apply row-level access control for Non-RA users (BD, PCD, PDV)
     * Aturan: User hanya boleh edit baris yang tidak void dan PIC sesuai role-nya
     * Updated: Apply untuk semua status, bukan hanya DOC_IN_PROCESS
     */
    applyNonRARowLevelAccess: function (documents) {
        const State = RegalDetail.State;
        const C = RegalDetail.Constants;
        const self = this; // Bind this untuk digunakan dalam callback

        // BUG FIX: Pastikan currentUserRoleCode sudah terisi, jika belum coba ambil dari fallback
        if (!State.currentUserRoleCode || State.currentUserRoleCode.trim() === '') {
            console.warn("applyNonRARowLevelAccess: currentUserRoleCode is empty, attempting fallback");
            // Fallback: Try to get role from ClsGlobalClass
            if (typeof ClsGlobalClass !== 'undefined' && typeof ClsGlobalClass.dLogin === 'function') {
                try {
                    var loginData = ClsGlobalClass.dLogin();
                    if (loginData && loginData.roleDat) {
                        State.currentUserRoleCode = loginData.roleDat.txtRoleCode || '';
                        console.log("applyNonRARowLevelAccess: Got role from fallback:", State.currentUserRoleCode);
                    }
                } catch (e) {
                    console.warn("applyNonRARowLevelAccess: Could not get role from fallback:", e);
                }
            }
        }

        // Cek apakah user adalah Non-RA (BD, PCD, PDV)
        const normalizedRole = self.f_NormalizeRole(State.currentUserRoleCode);
        const isNonRA = !State.isUserRA && !State.isGuest &&
            (normalizedRole === C.ROLES.BD || normalizedRole === C.ROLES.PCD || normalizedRole === C.ROLES.PDV);

        if (!isNonRA) {
            console.log("applyNonRARowLevelAccess: Skipping - not Non-RA user. isNonRA:", isNonRA, "normalizedRole:", normalizedRole, "isUserRA:", State.isUserRA, "isGuest:", State.isGuest, "rawRoleCode:", State.currentUserRoleCode);
            return;
        }

        console.log("applyNonRARowLevelAccess: Applying Non-RA row-level restrictions for role:", normalizedRole, "Status:", State.currentRegalStatus);

        // Loop melalui semua baris dokumen
        $(C.SELECTORS.DOC_TABLE + ' tbody tr').each(function (index) {
            var $row = $(this);
            var docId = $row.data('doc-id');

            if (!docId) {
                return; // Skip jika tidak ada doc-id
            }

            // Cari dokumen yang sesuai dari array documents
            var doc = documents.find(function (d) { return d.TxtId === docId; });
            if (!doc) {
                console.warn("applyNonRARowLevelAccess: Document not found for docId:", docId);
                return;
            }

            // Ambil informasi baris
            var isVoided = doc.IsVoid === true || doc.IsVoid === 'true' || doc.IsVoid === 1;

            // BUG FIX: Pastikan ConfigUpload dan TransactionPIC ada
            var rowPICRoleRaw = (doc.ConfigUpload && doc.ConfigUpload.TransactionPIC) ? doc.ConfigUpload.TransactionPIC : '';
            var rowPICRoleNormalized = self.f_NormalizeRole(rowPICRoleRaw);

            // BUG FIX: Tambahkan logging detail untuk debugging
            console.log("applyNonRARowLevelAccess: Row", index, "docId:", docId);
            console.log("applyNonRARowLevelAccess: DEBUG - Raw User Role:", State.currentUserRoleCode, "Normalized:", normalizedRole);
            console.log("applyNonRARowLevelAccess: DEBUG - Raw Doc PIC:", rowPICRoleRaw, "Normalized:", rowPICRoleNormalized);
            console.log("applyNonRARowLevelAccess: DEBUG - ConfigUpload exists:", !!doc.ConfigUpload);
            console.log("applyNonRARowLevelAccess: DEBUG - isVoided:", isVoided);

            // RBAC TIGHTENING: Kondisi Enable untuk Non-RA:
            // DOC_IN_PROCESS: 
            //   1. !isVoided (dokumen tidak void)
            //   2. CurrentRole == RowPICRole (role user sesuai dengan PIC dokumen)
            //   3. Status adalah DOC_IN_PROCESS
            // NEED_REVISION:
            //   1. !isVoided (dokumen tidak void)
            //   2. CurrentRole == RowPICRole (role user sesuai dengan PIC dokumen)
            //   3. Status adalah NEED_REVISION
            //   4. ReviewRa = 'Need Revise' (hanya dokumen yang diminta revisi)
            const currentStatus = (State.currentRegalStatus || '').toUpperCase();
            const isDocInProcess = currentStatus === C.STATUS.DOC_IN_PROCESS;
            const isNeedRevision = currentStatus === C.STATUS.NEED_REVISION;

            var shouldEnableRow = false;
            var enableReason = '';
            var docReviewRa = '';
            var isReversed = false;

            if (isDocInProcess) {
                // DOC_IN_PROCESS: Normal logic
                shouldEnableRow = !isVoided && normalizedRole === rowPICRoleNormalized;
                enableReason = 'DOC_IN_PROCESS';
            } else if (isNeedRevision) {
                // NEED_REVISION: Hanya dokumen yang diminta revisi yang boleh diedit
                docReviewRa = (doc.ReviewRa || '').trim();
                isReversed = (docReviewRa === C.REVIEW_STATUS.NEED_REVISE);

                shouldEnableRow = !isVoided && normalizedRole === rowPICRoleNormalized && isReversed;
                enableReason = 'NEED_REVISION (isReversed: ' + isReversed + ')';
            }

            console.log("applyNonRARowLevelAccess: Row", index, "shouldEnableRow:", shouldEnableRow,
                "(normalizedRole:", normalizedRole, "=== rowPICRoleNormalized:", rowPICRoleNormalized,
                "&& !isVoided:", !isVoided, ", Status:", currentStatus, ", Reason:", enableReason, ")");

            // Ambil semua elemen di baris
            // Note: td:eq(3) bisa berisi upload button (jika belum ada file) atau preview/delete buttons (jika sudah ada file)
            var $uploadBtn = $row.find('td:eq(3) button');
            var $previewBtn = $row.find('td:eq(3) button.btn-success'); // Preview button (eye icon)
            var $deleteBtn = $row.find('td:eq(3) button.btn-danger'); // Delete button (trash icon)
            var $reviewSelect = $row.find('.review-ra-select');
            var $catatanInput = $row.find('.catatan-input');
            var $voidCheckbox = $row.find('.void-checkbox');
            var $historyBtn = $row.find('.btn-view-history');

            // Apply restrictions
            if (shouldEnableRow) {
                // RBAC TIGHTENING: Baris boleh diedit - Pastikan Upload/Preview/Delete button ENABLED
                // Template sudah render button dengan benar, tapi pastikan tidak di-disable
                if ($uploadBtn.length > 0) {
                    // Enable all buttons in the upload column
                    $uploadBtn.prop('disabled', false).show();

                    // Update titles for better UX
                    if ($previewBtn.length > 0) {
                        $previewBtn.attr('title', 'Pratinjau Dokumen');
                    }
                    if ($deleteBtn.length > 0) {
                        $deleteBtn.attr('title', 'Hapus Dokumen');
                    }
                    if ($uploadBtn.hasClass('btn-success') && $uploadBtn.find('.ti-upload').length > 0) {
                        // This is upload button
                        const buttonTitle = isNeedRevision ? 'Upload Dokumen (Revisi)' : 'Upload Dokumen';
                        $uploadBtn.attr('title', buttonTitle);
                    }
                    console.log("applyNonRARowLevelAccess: Row", index, "Upload/Preview/Delete buttons ENABLED (role match + status:", currentStatus, ")");
                }

                // NEED_REVISION: Non-RA boleh edit Catatan pada dokumen yang diminta revisi
                // DOC_IN_PROCESS: Catatan SELALU disabled untuk Non-RA (hanya RA yang boleh edit)
                if (isNeedRevision) {
                    // NEED_REVISION: Allow edit catatan (template sudah set enabled, pastikan tidak di-disable)
                    $catatanInput.prop('disabled', false);
                    console.log("applyNonRARowLevelAccess: Row", index, "Catatan ENABLED for NEED_REVISION (document requested for revision)");
                } else {
                    // DOC_IN_PROCESS: Catatan disabled untuk Non-RA
                    $catatanInput.prop('disabled', true);
                }

                // Review dropdown: SELALU disabled untuk Non-RA (hanya RA yang boleh edit)
                $reviewSelect.prop('disabled', true);

                // Void checkbox: SELALU disabled untuk Non-RA
                $voidCheckbox.prop('disabled', true);

                // History button: SELALU enabled (pengecualian) - harus selalu bisa diakses
                $historyBtn.prop('disabled', false);

                console.log("applyNonRARowLevelAccess: Row", index, "ENABLED (matching role + status:", currentStatus, "and not voided) - Upload enabled");
            } else {
                // RBAC TIGHTENING: Baris harus disabled jika:
                // - void, atau
                // - role mismatch, atau
                // - status bukan DOC_IN_PROCESS/NEED_REVISION, atau
                // - NEED_REVISION tapi dokumen tidak diminta revisi
                if ($uploadBtn.length > 0) {
                    // Disable all buttons in the upload column
                    $uploadBtn.prop('disabled', true);

                    // Set appropriate tooltip message based on reason
                    var disableReason = '';
                    if (isVoided) {
                        disableReason = 'Dokumen telah di-void';
                    } else if (normalizedRole !== rowPICRoleNormalized) {
                        disableReason = 'Role tidak sesuai dengan PIC dokumen';
                    } else if (isNeedRevision) {
                        // NEED_REVISION: Cek apakah dokumen diminta revisi
                        if (!docReviewRa) {
                            docReviewRa = (doc.ReviewRa || '').trim();
                        }
                        if (!isReversed) {
                            isReversed = (docReviewRa === C.REVIEW_STATUS.NEED_REVISE);
                        }
                        if (!isReversed) {
                            disableReason = 'Hanya dokumen yang diminta revisi yang dapat diubah';
                        } else {
                            disableReason = 'Akses tidak tersedia';
                        }
                    } else if (!isDocInProcess && !isNeedRevision) {
                        disableReason = 'Upload hanya dapat dilakukan saat status Document In Process atau Need Revision (untuk dokumen yang diminta revisi)';
                    } else {
                        disableReason = 'Akses tidak tersedia';
                    }

                    // Apply disable reason to all buttons
                    $uploadBtn.attr('title', disableReason);
                    console.log("applyNonRARowLevelAccess: Row", index, "Upload/Preview/Delete buttons DISABLED - Reason:", disableReason,
                        "(isVoided:", isVoided, ", roleMatch:", normalizedRole === rowPICRoleNormalized,
                        ", Status:", currentStatus, ")");
                }

                // Review dropdown: SELALU disabled untuk Non-RA (hanya RA yang boleh edit)
                $reviewSelect.prop('disabled', true);

                // NEED_REVISION: Catatan disabled untuk dokumen yang tidak diminta revisi
                // DOC_IN_PROCESS: Catatan SELALU disabled untuk Non-RA
                if (isNeedRevision) {
                    if (!docReviewRa) {
                        docReviewRa = (doc.ReviewRa || '').trim();
                    }
                    if (!isReversed) {
                        isReversed = (docReviewRa === C.REVIEW_STATUS.NEED_REVISE);
                    }
                    if (!isReversed) {
                        $catatanInput.prop('disabled', true);
                        console.log("applyNonRARowLevelAccess: Row", index, "Catatan DISABLED - Doc not requested for revision (ReviewRa:", docReviewRa, ")");
                    }
                } else {
                    // DOC_IN_PROCESS atau status lain: Catatan disabled
                    $catatanInput.prop('disabled', true);
                }

                // Void checkbox: SELALU disabled untuk Non-RA
                $voidCheckbox.prop('disabled', true);

                // History button: SELALU enabled (pengecualian) - harus selalu bisa diakses
                $historyBtn.prop('disabled', false);

                console.log("applyNonRARowLevelAccess: Row", index, "DISABLED (voided, role mismatch, or not eligible for edit)");
            }
        });
    },

    /**
     * Bind status history to modal timeline
     */
    BindStatusHistory: function (histories) {
        const Templates = RegalDetail.Templates;

        var timelineContainer = $('#statusHistoryTimeline');
        if (!timelineContainer.length) {
            return;
        }

        timelineContainer.empty();

        if (histories && histories.length > 0) {
            histories.forEach(function (item) {
                var timelineItem = Templates.getStatusHistoryRow(item);
                timelineContainer.append(timelineItem);
            });
        } else {
            timelineContainer.html(`
                <div class="text-center text-muted py-5">
                    <i class="ti ti-info-circle fs-1"></i>
                    <p class="mt-2">Belum ada history status</p>
                </div>
            `);
        }
    },

    /**
     * Clear status history timeline
     */
    ClearStatusHistory: function () {
        var timelineContainer = $('#statusHistoryTimeline');
        if (!timelineContainer.length) {
            return;
        }

        timelineContainer.html(`
            <div class="text-center text-muted py-5">
                <i class="ti ti-info-circle fs-1"></i>
                <p class="mt-2">Belum ada history status</p>
            </div>
        `);
    },

    /**
     * Update Final Label UI based on file path
     */
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

    /**
     * Update Final Label Status UI based on data
     */
    f_UpdateFinalLabelStatusUI: function (data) {
        const State = RegalDetail.State;
        const C = RegalDetail.Constants;
        const Utils = RegalDetail.Utils;

        console.log("f_UpdateFinalLabelStatusUI called with:", data);

        try {
            if (!data) {
                console.warn("Data is null or undefined in f_UpdateFinalLabelStatusUI");
                return;
            }

            // Extract header data - handle multiple possible structures
            let header = null;
            if (data.Header && typeof data.Header === 'object') {
                header = data.Header;
            } else if (data.updatedHeader && typeof data.updatedHeader === 'object') {
                header = data.updatedHeader;
            } else if (data.statusFinalLabel !== undefined || data.StatusFinalLabel !== undefined || data.TxtId !== undefined) {
                header = data;
            }

            if (!header) {
                console.error("No header data found in f_UpdateFinalLabelStatusUI");
                return;
            }

            // Handle both camelCase and PascalCase
            const statusFinalLabel = header.statusFinalLabel || header.StatusFinalLabel || C.STATUS.DEFAULT;
            console.log("f_UpdateFinalLabelStatusUI: Final statusFinalLabel value:", statusFinalLabel);

            // Update Status Display
            const statusDisplay = C.STATUS_DISPLAY_MAP[statusFinalLabel.toUpperCase()] || statusFinalLabel;
            $('#statusFinalLabelDisplay').val(statusDisplay);

            // Check role and status for specific logic
            const statusUpper = statusFinalLabel ? statusFinalLabel.toUpperCase() : '';
            const normalizedRole = this.f_NormalizeRole(State.currentUserRoleCode);
            const isRA = (normalizedRole === C.ROLES.RA || State.isUserRA) && !State.isGuest;
            const isRADraftRevise = isRA && (statusUpper === C.STATUS.DRAFT || statusUpper === C.STATUS.NEED_REVISION);

            // Logic for RA with DRAFT/NEED_REVISION status
            if (isRADraftRevise) {
                console.log("f_UpdateFinalLabelStatusUI: User is RA with DRAFT/NEED_REVISION status, applying RA-specific rules");
                $('#btnRequestReviewLabel, #btnOpenManageFinalLabelModal').hide().addClass('d-none');
                $('#btnSubmitLabel_RA, #btnSubmitLabel_PD, #btnSubmitLabel_PKG').hide().addClass('d-none');
                $('#approval_ra, #approval_pd, #approval_pkg, #notes_ra, #notes_pd, #notes_pkg, #approval_ra_date, #approval_pd_date, #approval_pkg_date').prop('disabled', true);
            }

            // Control visibility: "Request review Label" button and "Manage Final Label" button
            // IMPORTANT: These buttons are for FINAL LABEL tab, so we check statusFinalLabel (NOT status permintaan dokumen)
            const isDocApproved = statusUpper === C.STATUS.DOC_APPROVED || statusUpper === C.STATUS.FINAL_APPROVED;

            // Ambil kode role user saat ini
            const currentUserRole = (State.currentUserRoleCode || '').toString().trim().toUpperCase();

            // Detect BD role with flexible pattern matching
            // Check State.isUserBD first (most reliable), then check role code patterns
            const isUserBDRole = State.isUserBD || currentUserRole === 'BD' || currentUserRole.includes('BUSINESS') || currentUserRole.includes('BD');

            // Detect RA, PDV, PCD roles (for read-only modal access)
            const isUserRARole = State.isUserRA || currentUserRole === 'RA' || currentUserRole.includes('REGULATORY');
            const isUserPDVRole = State.isUserPDV || currentUserRole === 'PDV' || (currentUserRole.includes('PRODUCT') && currentUserRole.includes('DEVELOPMENT'));
            const isUserPCDRole = State.isUserPCD || currentUserRole === 'PCD' || (currentUserRole.includes('PACKAGING') && currentUserRole.includes('DEVELOPMENT'));
            const isUserApproverRole = isUserRARole || isUserPDVRole || isUserPCDRole;

            // DEBUG LOGGING for role detection
            console.log("=== FINAL LABEL BUTTON VISIBILITY DEBUG ===");
            console.log("State.isUserBD:", State.isUserBD);
            console.log("State.isUserRA:", State.isUserRA);
            console.log("State.isUserPDV:", State.isUserPDV);
            console.log("State.isUserPCD:", State.isUserPCD);
            console.log("currentUserRole:", currentUserRole);
            console.log("isUserBDRole:", isUserBDRole);
            console.log("isUserApproverRole (RA/PDV/PCD):", isUserApproverRole);
            console.log("statusFinalLabel (statusUpper):", statusUpper);
            console.log("isDocApproved:", isDocApproved);

            // Button visibility rules for FINAL LABEL tab:
            // 1. btnRequestReviewLabel: BD only, DRAFT/NEED_REVISION/REVISE status
            // 2. btnOpenManageFinalLabelModal: BD (full access) OR RA/PDV/PCD (read-only)
            const isFinalLabelDraftOrRevise = (!statusUpper || statusUpper === '' ||
                statusUpper === C.STATUS.DRAFT ||
                statusUpper === C.STATUS.NEED_REVISION ||
                statusUpper === 'REVISE');

            console.log("isFinalLabelDraftOrRevise:", isFinalLabelDraftOrRevise);

            // Request Review Button: BD only, on DRAFT/NEED_REVISION/REVISE
            const showRequestButtonForBD = (isUserBDRole && isFinalLabelDraftOrRevise && !isDocApproved);

            // Manage Final Label Modal: 
            // - BD: Always visible (can view/download anytime, but upload only on DRAFT/NEED_REVISION - controlled inside modal)
            // - RA/PDV/PCD: Visible anytime (read-only access for review and download)
            const showManageModalButton = isUserBDRole || isUserApproverRole;

            console.log("showRequestButtonForBD:", showRequestButtonForBD);
            console.log("showManageModalButton:", showManageModalButton);
            console.log("=== END DEBUG ===");

            // Show/Hide Request Review Label button (BD only)
            const $btnRequestReviewLabel = $('#btnRequestReviewLabel');
            if ($btnRequestReviewLabel.length > 0) {
                if (showRequestButtonForBD) {
                    $btnRequestReviewLabel.removeClass('d-none').show().prop('disabled', false);
                    console.log("✅ f_UpdateFinalLabelStatusUI: SHOWING Request Review Label button for BD user");
                } else {
                    $btnRequestReviewLabel.addClass('d-none').hide();
                    console.log("❌ f_UpdateFinalLabelStatusUI: HIDING Request Review Label button");
                }
            }

            // Show/Hide Manage Final Label Modal button (BD + RA/PDV/PCD)
            const $btnOpenManageFinalLabelModal = $('#btnOpenManageFinalLabelModal');
            if ($btnOpenManageFinalLabelModal.length > 0) {
                if (showManageModalButton) {
                    $btnOpenManageFinalLabelModal.removeClass('d-none').show().prop('disabled', false);
                    if (isUserBDRole) {
                        console.log("✅ f_UpdateFinalLabelStatusUI: SHOWING Manage Final Label Modal button for BD user (full access)");
                    } else {
                        console.log("✅ f_UpdateFinalLabelStatusUI: SHOWING Manage Final Label Modal button for Approver (read-only access)");
                    }
                } else {
                    $btnOpenManageFinalLabelModal.addClass('d-none').hide();
                    console.log("❌ f_UpdateFinalLabelStatusUI: HIDING Manage Final Label Modal button");
                }
            }

            // Control enable/disable approval cards based on role and status
            // Disable cards if status is DOC_APPROVED or FINAL_APPROVED (legacy)
            const isWaitingApproval = statusFinalLabel && statusFinalLabel.toUpperCase() === C.STATUS.WAITING_APPROVAL;

            // ROLE-BASED CARD ACCESS: Only enable cards for specific roles when status is WAITING_APPROVAL
            if (isWaitingApproval && !State.isGuest && !isDocApproved) {
                // Get user role information
                const currentUserRole = (State.currentUserRoleCode || '').toString().trim().toUpperCase();
                const isUserRARole = currentUserRole === 'RA' || currentUserRole.includes('REGULATORY');
                const isUserPDVRole = currentUserRole === 'PDV' || (currentUserRole.includes('PRODUCT') && currentUserRole.includes('DEVELOPMENT'));
                const isUserPCDRole = currentUserRole === 'PCD' || (currentUserRole.includes('PACKAGING') && currentUserRole.includes('DEVELOPMENT'));

                // Get current approval status from cards (to check if already approved)
                const approvalRAStatus = ($('#approval_ra').val() || '').trim();
                const approvalPDStatus = ($('#approval_pd').val() || '').trim();
                const approvalPKGStatus = ($('#approval_pkg').val() || '').trim();

                console.log('f_UpdateFinalLabelStatusUI: WAITING_APPROVAL - Applying role-based card access');
                console.log('f_UpdateFinalLabelStatusUI: Current user role:', currentUserRole);
                console.log('f_UpdateFinalLabelStatusUI: isUserRARole:', isUserRARole, 'isUserPDVRole:', isUserPDVRole, 'isUserPCDRole:', isUserPCDRole);
                console.log('f_UpdateFinalLabelStatusUI: Card statuses - RA:', approvalRAStatus, 'PD:', approvalPDStatus, 'PKG:', approvalPKGStatus);

                // RA Card - Only enable for RA role AND status NOT "OK" (if already OK, disable)
                const isRACardApproved = approvalRAStatus === 'OK';
                const enableRACard = isUserRARole && !isRADraftRevise && !isRACardApproved;
                $('#approval_ra').prop('disabled', !enableRACard);
                $('#notes_ra').prop('disabled', !enableRACard);
                $('#btnSubmitLabel_RA').prop('disabled', !enableRACard);
                if (enableRACard) {
                    $('#btnSubmitLabel_RA').show().removeClass('d-none');
                    console.log('f_UpdateFinalLabelStatusUI: RA card ENABLED for RA role (not yet approved)');
                } else {
                    $('#btnSubmitLabel_RA').hide().addClass('d-none');
                    if (isRACardApproved) {
                        console.log('f_UpdateFinalLabelStatusUI: RA card DISABLED (already approved with OK)');
                    } else {
                        console.log('f_UpdateFinalLabelStatusUI: RA card DISABLED (not RA role)');
                    }
                }

                // PD Card - Only enable for PDV role AND status NOT "OK"
                const isPDCardApproved = approvalPDStatus === 'OK';
                const enablePDCard = isUserPDVRole && !isPDCardApproved;
                $('#approval_pd').prop('disabled', !enablePDCard);
                $('#notes_pd').prop('disabled', !enablePDCard);
                $('#btnSubmitLabel_PD').prop('disabled', !enablePDCard);
                if (enablePDCard) {
                    $('#btnSubmitLabel_PD').show().removeClass('d-none');
                    console.log('f_UpdateFinalLabelStatusUI: PD card ENABLED for PDV role (not yet approved)');
                } else {
                    $('#btnSubmitLabel_PD').hide().addClass('d-none');
                    if (isPDCardApproved) {
                        console.log('f_UpdateFinalLabelStatusUI: PD card DISABLED (already approved with OK)');
                    } else {
                        console.log('f_UpdateFinalLabelStatusUI: PD card DISABLED (not PDV role)');
                    }
                }

                // PKG Card - Only enable for PCD role AND status NOT "OK"
                const isPKGCardApproved = approvalPKGStatus === 'OK';
                const enablePKGCard = isUserPCDRole && !isPKGCardApproved;
                $('#approval_pkg').prop('disabled', !enablePKGCard);
                $('#notes_pkg').prop('disabled', !enablePKGCard);
                $('#btnSubmitLabel_PKG').prop('disabled', !enablePKGCard);
                if (enablePKGCard) {
                    $('#btnSubmitLabel_PKG').show().removeClass('d-none');
                    console.log('f_UpdateFinalLabelStatusUI: PKG card ENABLED for PCD role (not yet approved)');
                } else {
                    $('#btnSubmitLabel_PKG').hide().addClass('d-none');
                    if (isPKGCardApproved) {
                        console.log('f_UpdateFinalLabelStatusUI: PKG card DISABLED (already approved with OK)');
                    } else {
                        console.log('f_UpdateFinalLabelStatusUI: PKG card DISABLED (not PCD role)');
                    }
                }
            } else {
                // Not WAITING_APPROVAL status or guest user - disable all cards
                console.log('f_UpdateFinalLabelStatusUI: Not WAITING_APPROVAL or guest user - disabling all cards');
                $('#approval_ra, #approval_pd, #approval_pkg').prop('disabled', true);
                $('#notes_ra, #notes_pd, #notes_pkg').prop('disabled', true);
                $('#btnSubmitLabel_RA, #btnSubmitLabel_PD, #btnSubmitLabel_PKG').prop('disabled', true).hide().addClass('d-none');
            }

            // Update card values if finalLabelData exists
            const finalLabelData = data?.FinalLabel || data?.updatedFinalLabel || data?.finalLabelData;
            if (finalLabelData) {
                $('#approval_ra').val(finalLabelData.ApprovalRaStatus || finalLabelData.ApprovalRa || '');
                $('#approval_ra_date').val(Utils.formatDateForDisplay(finalLabelData.ApprovalRaDate));
                $('#notes_ra').val(finalLabelData.NotesRa || '');

                $('#approval_pd').val(finalLabelData.ApprovalPdStatus || finalLabelData.ApprovalPd || '');
                $('#approval_pd_date').val(Utils.formatDateForDisplay(finalLabelData.ApprovalPdDate));
                $('#notes_pd').val(finalLabelData.NotesPd || '');

                $('#approval_pkg').val(finalLabelData.ApprovalPkgStatus || finalLabelData.ApprovalPkg || '');
                $('#approval_pkg_date').val(Utils.formatDateForDisplay(finalLabelData.ApprovalPkgDate));
                $('#notes_pkg').val(finalLabelData.NotesPkg || '');
            }
        } catch (e) {
            console.error("Error in f_UpdateFinalLabelStatusUI:", e);
        }
    },

    /**
     * Show upload modal for document
     */
    ShowUploadModal: function (docId, index) {
        const State = RegalDetail.State;

        State.currentDocData = {
            TxtId: docId,
            Index: index
        };

        $('#hdDocData').val(JSON.stringify({ TxtId: docId }));
        $('#UploadDocModal').modal('show');
    },

    /**
     * Handle document change (Review or Catatan)
     * Performs validation only, no auto-save
     */
    HandleDocumentChange: function (element) {
        const C = RegalDetail.Constants;

        // Get parent row (tr) from the triggered element
        var $row = $(element).closest('tr');

        // Get BOTH values from the row
        var $reviewSelect = $row.find('select.review-ra-select');
        var $catatanInput = $row.find('.catatan-input');

        var reviewValue = $reviewSelect.val() || '';
        var catatanValue = ($catatanInput.val() || '').trim();

        // No validation needed anymore - just log
        console.log(`HandleDocumentChange - Review: [${reviewValue}], Catatan: [${catatanValue}]. Data will be saved when main Save button is clicked.`);
    },

    /**
     * Update review (silent save, no confirmation)
     */
    UpdateReview: function (element) {
        const $select = $(element);
        const newValue = $select.val();
        const docId = $select.data('doc-id');

        // Save directly without confirmation
        $select.data('previous-value', newValue);
        RegalDetail.SaveDocUpdate(docId, { ReviewRa: newValue });
    },

    /**
     * Update catatan (delegates to HandleDocumentChange)
     */
    UpdateCatatan: function (element) {
        this.HandleDocumentChange(element);
    },

    /**
     * Update Action Buttons Visibility
     * Mengatur visibility tombol aksi berdasarkan kondisi bisnis
     * CLEAN CODE: Fungsi ini dipisahkan agar mudah dibaca dan dimodifikasi developer lain
     */
    UpdateActionButtonsVisibility: function () {
        const State = RegalDetail.State;
        const C = RegalDetail.Constants;

        // 1. Definisi Tombol Aksi (Action Buttons)
        const actionButtons = [
            C.BUTTON_IDS.SAVE_HEADER,           // #btnSaveRegalHeader
            C.BUTTON_IDS.REGAL_PROCESS_DOC,     // #btnRegalProcessDoc (dulu #btnOSSSubmit)
            C.BUTTON_IDS.OSS_REQUEST_VERFOR,    // #btnOSSRequestVerfor
            C.BUTTON_IDS.OSS_APPROVE,           // #btnOSSApprove
            C.BUTTON_IDS.OSS_RETURN             // #btnOSSReturn
        ];

        // 2. Ambil State
        const isRa = State.isUserRA;
        const status = (State.currentRegalStatus || '').toUpperCase();

        // Ambil normalized role untuk pengecekan Non-RA
        const normalizedRole = RegalDetail.f_NormalizeRole(State.currentUserRoleCode);
        const isNonRA = !isRa && !State.isGuest &&
            (normalizedRole === C.ROLES.BD || normalizedRole === C.ROLES.PCD || normalizedRole === C.ROLES.PDV);

        // 3. Logika Bisnis: RA & DOC_IN_PROCESS -> Hide Buttons
        if (isRa && status === C.STATUS.DOC_IN_PROCESS) {
            console.log('UpdateActionButtonsVisibility: Rule Applied - RA User + DOC_IN_PROCESS -> Hiding Action Buttons');

            // Hide semua tombol aksi
            $(actionButtons.join(', ')).hide().addClass('d-none');

            // Pastikan tombol "Kembali" tetap visible (tidak di-hide)
            $(C.BUTTON_IDS.BACK).show().removeClass('d-none');

            // Final check dengan setTimeout untuk memastikan tombol benar-benar di-hide
            setTimeout(function () {
                $(actionButtons.join(', ')).hide().addClass('d-none');
                $(C.BUTTON_IDS.BACK).show().removeClass('d-none');
                console.log('UpdateActionButtonsVisibility: Final enforcement - Action buttons hidden, Back button visible');
            }, 100);
        }
        // BUG B FIX: Non-RA users (PCD, PDV, BD) - Hide semua tombol aksi di Header untuk SEMUA STATUS
        // BUG VISIBILITAS FIX: #btnRequestReviewLabel is NOT in actionButtons list, so it won't be affected here
        // The visibility of #btnRequestReviewLabel is controlled by f_UpdateFinalLabelStatusUI
        else if (isNonRA) {
            console.log('UpdateActionButtonsVisibility: Rule Applied - Non-RA User (PCD/PDV/BD) -> Hiding ALL Header Action Buttons for all statuses');

            // Hide semua tombol aksi di Header (untuk semua status)
            // Note: #btnRequestReviewLabel is controlled separately by f_UpdateFinalLabelStatusUI
            $(actionButtons.join(', ')).hide().addClass('d-none');

            // Pastikan tombol "Kembali" tetap visible
            $(C.BUTTON_IDS.BACK).show().removeClass('d-none');

            // Final check dengan setTimeout untuk memastikan tombol benar-benar di-hide
            setTimeout(function () {
                $(actionButtons.join(', ')).hide().addClass('d-none');
                $(C.BUTTON_IDS.BACK).show().removeClass('d-none');
                console.log('UpdateActionButtonsVisibility: Final enforcement - Non-RA action buttons hidden, Back button visible');
                console.log('UpdateActionButtonsVisibility: Note - #btnRequestReviewLabel visibility is controlled by f_UpdateFinalLabelStatusUI');
            }, 100);
        }
        // (Developer lain bisa nambahin rule lain di bawah sini dengan mudah)
        // Contoh:
        // else if (isRa && status === C.STATUS.DOC_REVIEW) {
        //     // Rule lainnya...
        // }
    },

    /**
     * Update OSS Buttons Visibility
     * Mengatur visibility tombol OSS (#btnRequestIDOSS dan #btnSubmitOSS) berdasarkan kondisi bisnis
     * CLEAN CODE: Fungsi ini dipisahkan agar mudah dibaca dan dimodifikasi developer lain
     * 
     * IMPORTANT: OSS tab hanya accessible ketika:
     * - Role RA
     * - Status Document (Header) = DOC_APPROVED
     * - Status Final Label = DOC_APPROVED
     */
    UpdateOssButtonsVisibility: function () {
        const State = RegalDetail.State;
        const C = RegalDetail.Constants;

        // 1. Definisi Tombol OSS
        const ossButtons = [
            C.BUTTON_IDS.REQUEST_ID_OSS,   // #btnRequestIDOSS
            C.BUTTON_IDS.SIMPAN_ID_OSS     // #btnSubmitOSS
        ];

        // 2. Ambil State
        const isUserRA = State.isUserRA;
        const currentRegalStatus = State.currentRegalStatus;

        // 3. Get StatusFinalLabel from State
        const statusFinalLabel = (State.currentStatusFinalLabel || '').toUpperCase();
        const isFinalLabelApproved = statusFinalLabel === C.STATUS.DOC_APPROVED || statusFinalLabel === 'DOC_APPROVED';

        // 4. Default Hide
        $(ossButtons.join(', ')).hide().addClass('d-none');

        console.log('=== OSS TAB ACCESS DEBUG ===');
        console.log('  - isUserRA:', isUserRA);
        console.log('  - currentRegalStatus (Document):', currentRegalStatus);
        console.log('  - statusFinalLabel:', statusFinalLabel);
        console.log('  - isFinalLabelApproved:', isFinalLabelApproved);

        // 5. Logika Bisnis: Show hanya jika RA + Status Document DOC_APPROVED + Status Final Label DOC_APPROVED
        const allConditionsMet = isUserRA && currentRegalStatus === C.STATUS.DOC_APPROVED && isFinalLabelApproved;

        if (allConditionsMet) {
            console.log('✅ UpdateOssButtonsVisibility: All conditions MET - ENABLING OSS Tab');
            console.log('   ✓ Role: RA');
            console.log('   ✓ Document Status: DOC_APPROVED');
            console.log('   ✓ Final Label Status: DOC_APPROVED');

            $(ossButtons.join(', ')).show().removeClass('d-none');

            // Enable OSS tab inputs
            $('#tabOSS input.form-control, #tabOSS select.form-select, #tabOSS textarea.form-control')
                .prop('disabled', false);
            $('#tabOSS .input-group .btn').prop('disabled', false);
            $('#btnSearchJenisPbum').prop('disabled', false);

            // Final check dengan setTimeout untuk memastikan tombol benar-benar di-show
            setTimeout(function () {
                $(ossButtons.join(', ')).show().removeClass('d-none');
                $('#tabOSS :input').prop('disabled', false);
                $('#btnSearchJenisPbum').prop('disabled', false);
                console.log('UpdateOssButtonsVisibility: Final enforcement - OSS tab enabled');
            }, 100);
        } else {
            console.log('❌ UpdateOssButtonsVisibility: OSS tab DISABLED - Conditions NOT met');
            if (!isUserRA) {
                console.log('   ✗ User is not RA');
            } else {
                console.log('   ✓ User is RA');
            }
            if (currentRegalStatus !== C.STATUS.DOC_APPROVED) {
                console.log('   ✗ Document status is NOT DOC_APPROVED (current:', currentRegalStatus, ')');
            } else {
                console.log('   ✓ Document status is DOC_APPROVED');
            }
            if (!isFinalLabelApproved) {
                console.log('   ✗ Final Label status is NOT DOC_APPROVED (current:', statusFinalLabel, ')');
            } else {
                console.log('   ✓ Final Label status is DOC_APPROVED');
            }

            // Disable OSS tab
            $('#tabOSS input.form-control, #tabOSS select.form-select, #tabOSS textarea.form-control')
                .prop('disabled', true);
            $('#tabOSS .input-group .btn').prop('disabled', true);
        }
        console.log('=== END OSS DEBUG ===');
        // (Developer lain bisa nambahin rule lain di bawah sini dengan mudah)
    },

    /**
     * Apply OSS Tab Access Control
     * Mengatur enable/disable tab OSS berdasarkan role dan status
     * IMPORTANT: Tab OSS hanya enabled untuk RA ketika kedua status DOC_APPROVED
     */
    ApplyOSSTabAccessControl: function () {
        const State = RegalDetail.State;
        const C = RegalDetail.Constants;

        const isUserRA = State.isUserRA && !State.isGuest;
        const currentRegalStatus = (State.currentRegalStatus || '').toUpperCase();

        // Get StatusFinalLabel from State
        const statusFinalLabel = (State.currentStatusFinalLabel || '').toUpperCase();
        const isFinalLabelApproved = statusFinalLabel === C.STATUS.DOC_APPROVED || statusFinalLabel === 'DOC_APPROVED';

        console.log('ApplyOSSTabAccessControl: Checking OSS tab access');
        console.log('  - isUserRA:', isUserRA);
        console.log('  - Document Status:', currentRegalStatus);
        console.log('  - Final Label Status:', statusFinalLabel);

        // Tab OSS enabled ONLY when: RA + Document DOC_APPROVED (NOT SUBMIT_OSS) + Final Label DOC_APPROVED
        // SUBMIT_OSS: OSS tab always disabled and buttons hidden for all roles
        const isSubmitOss = currentRegalStatus === C.STATUS.SUBMIT_OSS;
        const isDocApproved = currentRegalStatus === C.STATUS.DOC_APPROVED;
        const enableOSSTab = !isSubmitOss && isUserRA && isDocApproved && isFinalLabelApproved;

        if (enableOSSTab) {
            console.log('✅ ApplyOSSTabAccessControl: ENABLING OSS Tab');

            // Enable all OSS inputs
            $('#tabOSS input.form-control, #tabOSS select.form-select, #tabOSS textarea.form-control')
                .prop('disabled', false);
            $('#tabOSS .input-group .btn').prop('disabled', false);
            $('#btnSearchJenisPbum').prop('disabled', false);

            // Show OSS buttons
            $(C.BUTTON_IDS.REQUEST_ID_OSS + ', ' + C.BUTTON_IDS.SIMPAN_ID_OSS).show().removeClass('d-none');
        } else {
            console.log('❌ ApplyOSSTabAccessControl: DISABLING OSS Tab');

            // Disable all OSS inputs
            $('#tabOSS input.form-control, #tabOSS select.form-select, #tabOSS textarea.form-control')
                .prop('disabled', true);
            $('#tabOSS .input-group .btn').prop('disabled', true);
            $('#btnSearchJenisPbum').prop('disabled', true);

            // Hide OSS buttons
            $(C.BUTTON_IDS.REQUEST_ID_OSS + ', ' + C.BUTTON_IDS.SIMPAN_ID_OSS).hide().addClass('d-none');
        }
    },

    /**
     * Update void status
     */
    UpdateVoid: function (element) {
        const State = RegalDetail.State;
        const C = RegalDetail.Constants;
        const Utils = RegalDetail.Utils;

        var docId = $(element).data('doc-id');
        var isVoid = $(element).is(':checked');

        // Find all elements in the same row
        var $row = $(element).closest('tr');

        // Find all elements that should be disabled/enabled
        var $uploadBtn = $row.find('td:eq(3) button');
        var $reviewSelect = $row.find('.review-ra-select');
        var $catatanInput = $row.find('.catatan-input');

        if (isVoid) {
            // Void is checked - disable all elements in the row
            $uploadBtn.prop('disabled', true);
            $reviewSelect.prop('disabled', true);
            $reviewSelect.val('');
            $catatanInput.prop('disabled', true);

            // Remove onclick handler
            $uploadBtn.attr('onclick', '');
            $uploadBtn.attr('title', 'Dokumen telah di-void');
        } else {
            // Void is unchecked - enable all elements in the row
            var hasFile = $row.data('has-file') === true || $row.data('has-file') === 'true';
            var filePath = Utils.decodeURIComponentSafe($row.data('file-path') || '');
            var fileNameAlias = Utils.decodeURIComponentSafe($row.data('file-name-alias') || '');
            var configName = Utils.decodeURIComponentSafe($row.data('config-name') || '');

            // Check if upload button should be enabled
            var shouldEnableUpload = true;
            var uploadDisabledReason = '';

            if (State.isUserRA) {
                // User is RA: Disable upload if status is DRAFT or NEED_REVISION
                if (this.f_IsDraftOrReviseStatus()) {
                    shouldEnableUpload = false;
                    uploadDisabledReason = 'Upload tidak dapat dilakukan pada status DRAFT/NEED_REVISION oleh user RA';
                }
            } else if (!State.isGuest) {
                // RBAC TIGHTENING: Non-RA users (BD, PCD, PDV) can only upload when status is DOC_IN_PROCESS
                const isDocInProcess = (State.currentRegalStatus || '').toUpperCase() === C.STATUS.DOC_IN_PROCESS;
                if (!isDocInProcess) {
                    shouldEnableUpload = false;
                    uploadDisabledReason = 'Upload hanya dapat dilakukan saat status Document In Process';
                    console.log("UpdateVoid: RBAC - Upload disabled for Non-RA user. Status:", State.currentRegalStatus, "Required:", C.STATUS.DOC_IN_PROCESS);
                }
            }

            // Restore button state
            if (hasFile) {
                // File exists - restore preview button
                var encodedPaths = encodeURIComponent(filePath);
                var encodedNames = encodeURIComponent(fileNameAlias);
                var encodedConfigName = encodeURIComponent(configName);

                $uploadBtn.removeClass('btn-secondary btn-outline-secondary').addClass('btn-success');
                $uploadBtn.html('<i class="ti ti-eye"></i>');
                $uploadBtn.attr('onclick', `RegalDetail.ShowPreviewModal('${encodedPaths}', '${encodedConfigName}', '${docId}', '${encodedNames}')`);

                if (shouldEnableUpload) {
                    $uploadBtn.prop('disabled', false);
                    $uploadBtn.attr('title', 'Pratinjau Dokumen');
                } else {
                    $uploadBtn.prop('disabled', true);
                    $uploadBtn.attr('title', uploadDisabledReason);
                }
            } else {
                // No file - restore upload button
                var rowIndex = $row.closest('tbody').find('tr').index($row);

                $uploadBtn.removeClass('btn-secondary btn-outline-primary').addClass('btn-success');
                $uploadBtn.html('<i class="ti ti-upload"></i>');
                $uploadBtn.attr('onclick', `RegalDetail.ShowUploadModal('${docId}', ${rowIndex})`);

                if (shouldEnableUpload) {
                    $uploadBtn.prop('disabled', false);
                    $uploadBtn.attr('title', 'Upload Dokumen');
                } else {
                    $uploadBtn.prop('disabled', true);
                    $uploadBtn.attr('title', uploadDisabledReason);
                }
            }

            // --- PERBAIKAN BUG ---
            // Cek apakah inputan Review dan Catatan boleh di-enable?
            var shouldEnableInputs = true;

            // Jika User adalah RA DAN Status adalah DRAFT atau NEED_REVISION
            // Maka Review dan Catatan tetap DISABLED (RA belum boleh review di status DRAFT/REVISE)
            if (State.isUserRA && this.f_IsDraftOrReviseStatus()) {
                // Pada status DRAFT/NEED_REVISION, RA tetap TIDAK BOLEH edit review/catatan
                shouldEnableInputs = false;
            }

            // Terapkan status disabled/enabled
            $reviewSelect.prop('disabled', !shouldEnableInputs);
            $catatanInput.prop('disabled', !shouldEnableInputs);
            // ---------------------
        }

        // Save update to database - ONLY update IsVoid
        var updateData = { IsVoid: isVoid };
        this.SaveDocUpdate(docId, updateData);
    },

    /**
     * Save document update
     */
    SaveDocUpdate: function (docId, updateData) {
        const Utils = RegalDetail.Utils;
        const C = RegalDetail.Constants;

        console.log("SaveDocUpdate called for docId:", docId, "with data:", updateData);

        var data = {
            __RequestVerificationToken: Utils.getAntiForgeryToken(),
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
                    clsGlobal.swalWarningRedirect(C.MESSAGES.SESSION_EXPIRED, window.location.href);
                    return;
                }

                if (retDat.bitSuccess == true) {
                    console.log("SaveDocUpdate - Success:", updateData);
                } else {
                    console.error("SaveDocUpdate - Failed:", retDat);
                    clsGlobal.swalError(retDat.txtMessage || "Gagal menyimpan update dokumen");
                }
            },
            error: function (xhr, status, error) {
                console.error("SaveDocUpdate - Error:", xhr, status, error);
                clsGlobal.swalError("Terjadi kesalahan saat menyimpan update dokumen");
            }
        });
    },

    /**
     * Generate preview for upload files
     */
    GeneratePreviewUpload: function () {
        const State = RegalDetail.State;
        const Utils = RegalDetail.Utils;

        const $previewContainer = $('#modalShowFilePreview');
        $previewContainer.empty().hide();

        // Revoke old blob URLs
        if (State.currentPreviewBlobUrls.length > 0) {
            State.currentPreviewBlobUrls.forEach(url => URL.revokeObjectURL(url));
            State.currentPreviewBlobUrls = [];
        }

        // Get all selected files
        const fileInput = document.getElementById('fileDoc');
        const files = fileInput.files;

        if (!files || files.length === 0) {
            return;
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
                    <strong>${Utils.htmlEncode(fileName)}</strong>
                </div>
            `);

            switch (fileExtension) {
                case "pdf":
                    const pdfBlobUrl = URL.createObjectURL(file);
                    State.currentPreviewBlobUrls.push(pdfBlobUrl);

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
                    State.currentPreviewBlobUrls.push(imgBlobUrl);
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

    /**
     * Empty preview container
     */
    EmptyPreview: function () {
        const State = RegalDetail.State;

        $("#modalShowFilePreview").empty().hide();

        // Revoke all blob URLs
        if (State.currentPreviewBlobUrls.length > 0) {
            State.currentPreviewBlobUrls.forEach(url => URL.revokeObjectURL(url));
            State.currentPreviewBlobUrls = [];
        }
    },

    /**
     * Render DOCX file
     */
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

    /**
     * Render XLSX file
     */
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

    /**
     * Show preview modal for uploaded files
     */
    ShowPreviewModal: function (encodedFilePaths, encodedDocumentName, documentId, encodedFileNames, hideActions) {
        const Utils = RegalDetail.Utils;

        const filePaths = Utils.decodeURIComponentSafe(encodedFilePaths || '');
        const documentName = Utils.decodeURIComponentSafe(encodedDocumentName || '');
        const fileNamesRaw = Utils.decodeURIComponentSafe(encodedFileNames || '');
        const shouldHideActions = hideActions === true;

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

        // Update modal title
        if (documentName) {
            $('#ShowPreviewFileModalLabel').text(`Pratinjau File - ${documentName}`);
        } else {
            $('#ShowPreviewFileModalLabel').text('Pratinjau File');
        }

        // Show file count
        $previewContainer.append(`<h5>Total ${filePathArray.length} file:</h5>`);

        // Loop through each file path
        filePathArray.forEach((filePath, index) => {
            const fileName = filePath.split('/').pop();
            const aliasName = fileNameArray[index] || fileName;
            const displayName = aliasName || fileName;
            const encodedDisplayName = Utils.htmlEncode(displayName);
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
                    this.RenderDocx(filePath, $previewElement.get(0));
                    break;

                case "xlsx":
                    $previewElement = $('<div class="preview-content preview-box" style="height: 500px; overflow-y: auto; margin-top: 10px; border: 1px solid #ddd; padding: 10px;">Memuat pratinjau Excel...</div>');
                    $fileWrapper.append($previewElement);
                    this.RenderXlsx(filePath, $previewElement.get(0));
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

            // Show action buttons if not hidden
            if (!shouldHideActions) {
                const actionWrapper = $(`
                    <div class="mt-3 d-flex gap-2">
                        <a href="${filePath}" class="btn btn-info btn-sm" download="${encodedDisplayName}">
                            <i class="ti ti-download me-1"></i>Download
                        </a>
                        <button type="button"
                                class="btn btn-danger btn-sm btn-delete-preview-doc"
                                data-doc-id="${documentId || ''}"
                                data-file-path="${Utils.htmlEncode(filePath)}">
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

    /**
     * Refresh document list only
     */
    RefreshDocumentListOnly: function (regalHdrTxtId, showWarning) {
        const State = RegalDetail.State;
        const C = RegalDetail.Constants;
        const Templates = RegalDetail.Templates;

        console.log("Refreshing document list only for:", regalHdrTxtId);

        if (!regalHdrTxtId) {
            return;
        }

        // Show warning if there are unsaved changes
        if (showWarning !== false) {
            var hasUnsavedChanges = false;
            $(C.SELECTORS.DOC_TABLE + ' tbody tr').each(function () {
                var $row = $(this);
                var $reviewSelect = $row.find('.review-ra-select');
                var $catatanInput = $row.find('.catatan-input');

                if ($row.find('td').length === 0 || $row.text().trim() === 'Tidak ada dokumen' || $reviewSelect.prop('disabled')) {
                    return;
                }

                var reviewValue = $reviewSelect.val() || '';
                var catatanValue = ($catatanInput.val() || '').trim();

                if (reviewValue || catatanValue) {
                    hasUnsavedChanges = true;
                    return false; // Break loop
                }
            });

            if (hasUnsavedChanges) {
                console.warn("RefreshDocumentListOnly - Warning: There are unsaved Review/Catatan changes that will be lost after refresh");
            }
        }

        // Show loading
        $(C.SELECTORS.DOC_TABLE + ' tbody').html(Templates.getLoadingRow(7));

        $.ajax({
            type: "GET",
            url: base_path + "/Regal/GetRegalDocuments",
            data: { regalHdrTxtId: regalHdrTxtId },
            success: function (response) {
                // Update user info if available
                if (response && response.userInfo) {
                    var userInfo = response.userInfo;
                    State.isUserRA = userInfo.IsRA || false;
                    if (userInfo.Department || userInfo.department) {
                        State.currentUserRoleCode = userInfo.Department || userInfo.department;
                    }
                    console.log("User info updated from GetRegalDocuments:", userInfo);
                }

                if (response && response.success && response.data && Array.isArray(response.data)) {
                    RegalDetail.BindDocuments(response.data);
                } else {
                    console.warn("GetRegalDocuments returned success=false or no data:", response.message);
                    RegalDetail.BindDocuments([]);
                }
            },
            error: function (xhr) {
                console.error("Failed to refresh document list:", xhr.responseText);
                clsGlobal.swalError("Gagal me-refresh daftar dokumen.");
            }
        });
    },

    /**
     * Refresh Final Label tab only
     */
    RefreshFinalLabelTabOnly: function (regalHdrTxtId) {
        const State = RegalDetail.State;
        const Utils = RegalDetail.Utils;
        const C = RegalDetail.Constants;

        console.log("Refreshing Final Label tab only for:", regalHdrTxtId);

        if (!regalHdrTxtId) {
            console.warn("RefreshFinalLabelTabOnly: regalHdrTxtId is empty");
            return;
        }

        $.ajax({
            type: "POST",
            url: base_path + "/Regal/GetRegalById",
            data: {
                __RequestVerificationToken: Utils.getAntiForgeryToken(),
                id: regalHdrTxtId
            },
            success: function (response, status, xhr) {
                console.log("RefreshFinalLabelTabOnly success response:", response);

                if (xhr.responseText && xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect(C.MESSAGES.SESSION_EXPIRED, window.location.href);
                    return;
                }

                if (response && response.bitSuccess && response.objData) {
                    try {
                        let data = response.objData;
                        if (typeof data === 'string') {
                            data = JSON.parse(data);
                        }

                        // Update user info if available
                        if (data && data.UserInfo) {
                            var userInfo = data.UserInfo;
                            State.isUserRA = userInfo.IsRA || false;
                            State.isUserBD = userInfo.IsBD || false;
                            State.isUserPDV = userInfo.IsPDV || false;
                            State.isUserPCD = userInfo.IsPCD || false;
                            State.currentUserRoleCode = (userInfo.RoleCode || userInfo.Department || '').toString().toUpperCase().trim();
                            console.log("User info updated from refresh:", userInfo);
                            console.log("State roles updated - BD:", State.isUserBD, "RA:", State.isUserRA, "PDV:", State.isUserPDV, "PCD:", State.isUserPCD);
                        }

                        if (data && data.Header && data.FinalLabel) {
                            RegalDetail.BindFinalLabelTabOnly(data.Header, data.FinalLabel);
                            RegalDetail.f_UpdateFinalLabelStatusUI({
                                Header: data.Header,
                                FinalLabel: data.FinalLabel
                            });

                            // IMPORTANT: Re-apply OSS Tab Access Control after Final Label status updated
                            // OSS tab depends on both Document Status and Final Label Status
                            RegalDetail.ApplyOSSTabAccessControl();

                            // Refresh history table
                            RegalDetail.Actions.loadFinalLabelHistory(regalHdrTxtId);

                            console.log("Final Label tab refreshed successfully");
                        } else {
                            console.warn("RefreshFinalLabelTabOnly: Missing Header or FinalLabel in response", data);
                        }
                    } catch (parseError) {
                        console.error("Error parsing response in RefreshFinalLabelTabOnly:", parseError);
                    }
                } else {
                    console.warn("RefreshFinalLabelTabOnly: Response not successful or no data", response);
                }
            },
            error: function (xhr) {
                console.error("Failed to refresh Final Label tab:", xhr.responseText);
            }
        });
    },

    /**
     * Bind Final Label tab only
     */
    BindFinalLabelTabOnly: function (headerData, finalLabelData) {
        const C = RegalDetail.Constants;
        const Utils = RegalDetail.Utils;

        console.log("BindFinalLabelTabOnly called with:", headerData, finalLabelData);

        if (!headerData) {
            console.warn("HeaderData is null or undefined in BindFinalLabelTabOnly");
            return;
        }

        try {
            // Update Status Display
            const statusFinalLabel = headerData.statusFinalLabel || headerData.StatusFinalLabel || C.STATUS.DEFAULT;
            const statusDisplay = C.STATUS_DISPLAY_MAP[statusFinalLabel.toUpperCase()] || statusFinalLabel;
            $('#statusFinalLabelDisplay').val(statusDisplay);

            // Control visibility: "Request review Label" button and "Manage Final Label" button
            // IMPORTANT: Check statusFinalLabel (not status permintaan dokumen)
            const State = RegalDetail.State;
            const statusUpper = statusFinalLabel ? statusFinalLabel.toUpperCase() : '';

            // Ambil kode role user saat ini
            const currentUserRole = (State.currentUserRoleCode || '').toString().trim().toUpperCase();

            // Detect BD role with flexible pattern matching (same as f_UpdateFinalLabelStatusUI)
            const isUserBDRole = State.isUserBD || currentUserRole === 'BD' || currentUserRole.includes('BUSINESS') || currentUserRole.includes('BD');

            // Detect RA, PDV, PCD roles (for read-only modal access)
            const isUserRARole = State.isUserRA || currentUserRole === 'RA' || currentUserRole.includes('REGULATORY');
            const isUserPDVRole = State.isUserPDV || currentUserRole === 'PDV' || (currentUserRole.includes('PRODUCT') && currentUserRole.includes('DEVELOPMENT'));
            const isUserPCDRole = State.isUserPCD || currentUserRole === 'PCD' || (currentUserRole.includes('PACKAGING') && currentUserRole.includes('DEVELOPMENT'));
            const isUserApproverRole = isUserRARole || isUserPDVRole || isUserPCDRole;

            // Button visibility rules: BD (full access) or RA/PDV/PCD (read-only)
            const isFinalLabelDraftOrRevise = (!statusUpper || statusUpper === '' ||
                statusUpper === C.STATUS.DRAFT ||
                statusUpper === C.STATUS.NEED_REVISION ||
                statusUpper === 'REVISE');

            // Request Review Button: BD only, on DRAFT/NEED_REVISION/REVISE
            const showRequestButtonForBD = isUserBDRole && isFinalLabelDraftOrRevise;

            // Manage Final Label Modal: 
            // - BD: Always visible (can view/download anytime, but upload only on DRAFT/NEED_REVISION - controlled inside modal)
            // - RA/PDV/PCD: Visible anytime (read-only access for review and download)
            const showManageModalButton = isUserBDRole || isUserApproverRole;

            console.log("BindFinalLabelTabOnly: isUserBDRole:", isUserBDRole, "isUserApproverRole:", isUserApproverRole);
            console.log("BindFinalLabelTabOnly: statusFinalLabel:", statusUpper, "showRequestButton:", showRequestButtonForBD, "showManageModal:", showManageModalButton);

            // Show/Hide Request Review Label button (BD only)
            if (showRequestButtonForBD) {
                $('#btnRequestReviewLabel').removeClass('d-none').show().prop('disabled', false);
                console.log("✅ BindFinalLabelTabOnly: SHOWING Request Review Label button for BD");
            } else {
                $('#btnRequestReviewLabel').addClass('d-none').hide();
                console.log("❌ BindFinalLabelTabOnly: HIDING Request Review Label button");
            }

            // Show/Hide Manage Final Label Modal button (BD + RA/PDV/PCD)
            if (showManageModalButton) {
                $('#btnOpenManageFinalLabelModal').removeClass('d-none').show().prop('disabled', false);
                if (isUserBDRole) {
                    console.log("✅ BindFinalLabelTabOnly: SHOWING Manage Final Label Modal button for BD (full access)");
                } else {
                    console.log("✅ BindFinalLabelTabOnly: SHOWING Manage Final Label Modal button for Approver (read-only)");
                }
            } else {
                $('#btnOpenManageFinalLabelModal').addClass('d-none').hide();
                console.log("❌ BindFinalLabelTabOnly: HIDING Manage Final Label Modal button");
            }

            // Control Enable/Disable Card based on status and role
            const isWaitingApproval = statusFinalLabel && statusUpper === C.STATUS.WAITING_APPROVAL;

            // ROLE-BASED CARD ACCESS: Only enable cards for specific roles when status is WAITING_APPROVAL
            if (isWaitingApproval && !State.isGuest) {
                // Get user role information
                const currentUserRole = (State.currentUserRoleCode || '').toString().trim().toUpperCase();
                const isUserRARole = currentUserRole === 'RA' || currentUserRole.includes('REGULATORY');
                const isUserPDVRole = currentUserRole === 'PDV' || (currentUserRole.includes('PRODUCT') && currentUserRole.includes('DEVELOPMENT'));
                const isUserPCDRole = currentUserRole === 'PCD' || (currentUserRole.includes('PACKAGING') && currentUserRole.includes('DEVELOPMENT'));

                // Get current approval status from cards (to check if already approved)
                const approvalRAStatus = ($('#approval_ra').val() || '').trim();
                const approvalPDStatus = ($('#approval_pd').val() || '').trim();
                const approvalPKGStatus = ($('#approval_pkg').val() || '').trim();

                console.log('BindFinalLabelTabOnly: WAITING_APPROVAL - Applying role-based card access');
                console.log('BindFinalLabelTabOnly: Current user role:', currentUserRole);
                console.log('BindFinalLabelTabOnly: Card statuses - RA:', approvalRAStatus, 'PD:', approvalPDStatus, 'PKG:', approvalPKGStatus);

                // RA Card - Only enable for RA role AND status NOT "OK"
                const isRACardApproved = approvalRAStatus === 'OK';
                const enableRACard = isUserRARole && !isRACardApproved;
                $('#approval_ra').prop('disabled', !enableRACard);
                $('#notes_ra').prop('disabled', !enableRACard);
                $('#btnSubmitLabel_RA').prop('disabled', !enableRACard);
                if (enableRACard) {
                    $('#btnSubmitLabel_RA').show().removeClass('d-none');
                    console.log('BindFinalLabelTabOnly: RA card ENABLED (not yet approved)');
                } else {
                    $('#btnSubmitLabel_RA').hide().addClass('d-none');
                    console.log('BindFinalLabelTabOnly: RA card DISABLED', isRACardApproved ? '(already approved)' : '(not RA role)');
                }

                // PD Card - Only enable for PDV role AND status NOT "OK"
                const isPDCardApproved = approvalPDStatus === 'OK';
                const enablePDCard = isUserPDVRole && !isPDCardApproved;
                $('#approval_pd').prop('disabled', !enablePDCard);
                $('#notes_pd').prop('disabled', !enablePDCard);
                $('#btnSubmitLabel_PD').prop('disabled', !enablePDCard);
                if (enablePDCard) {
                    $('#btnSubmitLabel_PD').show().removeClass('d-none');
                    console.log('BindFinalLabelTabOnly: PD card ENABLED (not yet approved)');
                } else {
                    $('#btnSubmitLabel_PD').hide().addClass('d-none');
                    console.log('BindFinalLabelTabOnly: PD card DISABLED', isPDCardApproved ? '(already approved)' : '(not PDV role)');
                }

                // PKG Card - Only enable for PCD role AND status NOT "OK"
                const isPKGCardApproved = approvalPKGStatus === 'OK';
                const enablePKGCard = isUserPCDRole && !isPKGCardApproved;
                $('#approval_pkg').prop('disabled', !enablePKGCard);
                $('#notes_pkg').prop('disabled', !enablePKGCard);
                $('#btnSubmitLabel_PKG').prop('disabled', !enablePKGCard);
                if (enablePKGCard) {
                    $('#btnSubmitLabel_PKG').show().removeClass('d-none');
                    console.log('BindFinalLabelTabOnly: PKG card ENABLED (not yet approved)');
                } else {
                    $('#btnSubmitLabel_PKG').hide().addClass('d-none');
                    console.log('BindFinalLabelTabOnly: PKG card DISABLED', isPKGCardApproved ? '(already approved)' : '(not PCD role)');
                }
            } else {
                // Not WAITING_APPROVAL status or guest user - disable all cards
                $('#approval_ra, #approval_pd, #approval_pkg').prop('disabled', true);
                $('#notes_ra, #notes_pd, #notes_pkg').prop('disabled', true);
                $('#btnSubmitLabel_RA, #btnSubmitLabel_PD, #btnSubmitLabel_PKG').prop('disabled', true).hide().addClass('d-none');
            }

            // Update card values if finalLabelData exists
            if (finalLabelData) {
                $('#approval_ra').val(finalLabelData.ApprovalRaStatus || finalLabelData.ApprovalRa || '');
                $('#approval_ra_date').val(Utils.formatDateForDisplay(finalLabelData.ApprovalRaDate));
                $('#notes_ra').val(finalLabelData.NotesRa || '');

                $('#approval_pd').val(finalLabelData.ApprovalPdStatus || finalLabelData.ApprovalPd || '');
                $('#approval_pd_date').val(Utils.formatDateForDisplay(finalLabelData.ApprovalPdDate));
                $('#notes_pd').val(finalLabelData.NotesPd || '');

                $('#approval_pkg').val(finalLabelData.ApprovalPkgStatus || finalLabelData.ApprovalPkg || '');
                $('#approval_pkg_date').val(Utils.formatDateForDisplay(finalLabelData.ApprovalPkgDate));
                $('#notes_pkg').val(finalLabelData.NotesPkg || '');
            }
        } catch (e) {
            console.error("Error in BindFinalLabelTabOnly:", e);
        }
    },

    /**
     * HTML Encode helper (backward compatibility)
     */
    HtmlEncode: function (value) {
        return RegalDetail.Utils.htmlEncode(value);
    }
};

// ============================================================================
// SECTION 8: BACKWARD COMPATIBILITY
// ============================================================================
// Map global functions to RegalDetail.Actions for backward compatibility
// ============================================================================

// Map window functions to Actions module
if (typeof window !== 'undefined') {
    window.f_SaveRegalData = function () {
        return RegalDetail.Actions.saveRegalData();
    };

    window.f_SubmitRegal = function () {
        return RegalDetail.Actions.submitRegal();
    };

    window.f_RequestVerfor = function () {
        return RegalDetail.Actions.requestVerfor();
    };

    window.f_ApproveRegal = function () {
        return RegalDetail.Actions.approveRegal();
    };

    window.f_ReturnRegal = function () {
        return RegalDetail.Actions.returnRegal();
    };

    window.f_CreateBpomFromRegal = function (regalId) {
        return RegalDetail.Actions.createBpomFromRegal(regalId);
    };
}

// Map global helper functions to Utils (if needed)
if (typeof window !== 'undefined') {
    // These functions are referenced in HTML and other files
    window.formatDateForInput = function (value) {
        return RegalDetail.Utils.formatDateForInput(value);
    };

    window.sanitizeDateValue = function (value) {
        return RegalDetail.Utils.sanitizeDateValue(value);
    };

    window.decodeURIComponentSafe = function (value) {
        return RegalDetail.Utils.decodeURIComponentSafe(value);
    };

    window.getAntiForgeryToken = function () {
        return RegalDetail.Utils.getAntiForgeryToken();
    };
}

// Map global helper functions to Actions (if needed)
if (typeof window !== 'undefined') {
    window.openNomorIzinEdarLov = function () {
        return RegalDetail.Actions.openNomorIzinEdarLov();
    };

    window.submitFinalLabelApproval = function (approvalType, statusValue, dateValue, notesValue) {
        return RegalDetail.Actions.submitFinalLabelApproval(approvalType, statusValue, dateValue, notesValue);
    };
}

// LOV Callback Handler - Defined at global level to ensure it's available when LOV iframe calls window.parent.setChooseLOV
// This must be defined OUTSIDE of any conditional block to ensure it's always available
const previousSetChooseLOV = (typeof window !== 'undefined') ? window.setChooseLOV : null;
if (typeof window !== 'undefined') {
    window.setChooseLOV = function (txtValue) {
        console.log("RegalDetail: setChooseLOV called with:", txtValue);

        if (!txtValue) {
            console.warn("RegalDetail: setChooseLOV called with empty value");
            // Call previous handler if exists
            if (previousSetChooseLOV && typeof previousSetChooseLOV === 'function') {
                previousSetChooseLOV(txtValue);
            }
            return;
        }

        const parts = (txtValue || '').split('|');
        const Utils = RegalDetail.Utils;

        console.log("RegalDetail: Parsed parts:", parts, "LOV Type:", parts[0]);

        // Handle NomorIzinEdar LOV callback
        if (parts[0] === "NomorIzinEdar") {
            console.log("RegalDetail: Handling NomorIzinEdar callback");
            // Format callback: NomorIzinEdar|txtColumn1|txtColumn2|...|txtColumn10|...
            // parts[1] = txtColumn1 = NomorIzinEdar (nomor)
            // parts[8] = txtColumn8 = TanggalTerbit
            // parts[9] = txtColumn9 = TanggalBerakhir
            // parts[10] = txtColumn10 = TxtId (ID yang diperlukan untuk NomorIzinEdarId)
            const nomorIzinEdar = parts[1] || "";
            const tanggalTerbit = parts[8] || "";
            const tanggalBerakhir = parts[9] || "";
            const nomorIzinEdarId = parts[10] || ""; // TxtId dari backend

            console.log("RegalDetail: Setting NomorIzinEdar to:", nomorIzinEdar, "ID:", nomorIzinEdarId);
            $('#nomorIzinEdar').val(nomorIzinEdar);
            $('#nomorIzinEdarId').val(nomorIzinEdarId); // Task 4: Set NomorIzinEdarId
            $('#masaBerlakuStart').val(Utils.formatDateForDisplay(tanggalTerbit));
            $('#masaBerlakuEnd').val(Utils.formatDateForDisplay(tanggalBerakhir));

            if (typeof clsGlobal !== 'undefined' && typeof clsGlobal.closeLOV === 'function') {
                clsGlobal.closeLOV();
            } else if (typeof $.fancybox !== 'undefined' && typeof $.fancybox.close === 'function') {
                $.fancybox.close();
            }
            return;
        }

        // Task 2: Handle PIC RA OSS LOV callback - Auto-fill kedua input
        if (parts[0] === "picRAOSS") {
            console.log("RegalDetail: Handling picRAOSS callback");
            // Format callback: picRAOSS|txtColumn1|...
            // parts[1] = txtColumn1 = Username
            const selectedUsername = parts[1] || "";

            console.log("RegalDetail: Setting PIC RA OSS to:", selectedUsername);
            // Auto-fill kedua input: Header dan Tab OSS
            $('#picRAOSS').val(selectedUsername);
            $('#oss_PicRA').val(selectedUsername);

            if (typeof clsGlobal !== 'undefined' && typeof clsGlobal.closeLOV === 'function') {
                clsGlobal.closeLOV();
            } else if (typeof $.fancybox !== 'undefined' && typeof $.fancybox.close === 'function') {
                $.fancybox.close();
            }
            return;
        }

        // Handle Verfor No LOV callback
        if (parts[0] === "verforNo") {
            console.log("RegalDetail: Handling verforNo callback");
            // Format callback: verforNo|txtColumn1|txtColumn2|...|txtColumn9|...
            // parts[1] = txtColumn1 = VerforNo
            // parts[9] = txtColumn9 = JumlahKemasan (Kurang dari 1 takaran saji)
            const selectedVerforNo = parts[1] || "";
            const jumlahKemasan = parts[9] || ""; // JumlahKemasan dari TrVerForIng

            console.log("RegalDetail: Setting verforNo to:", selectedVerforNo);
            console.log("RegalDetail: Setting txtTakaranKurang to:", jumlahKemasan);
            $('#verforNo').val(selectedVerforNo);

            // Fill txtTakaranKurang with JumlahKemasan value (always replace, even if empty)
            $('#txtTakaranKurang').val(jumlahKemasan);

            if (typeof clsGlobal !== 'undefined' && typeof clsGlobal.closeLOV === 'function') {
                clsGlobal.closeLOV();
            } else if (typeof $.fancybox !== 'undefined' && typeof $.fancybox.close === 'function') {
                $.fancybox.close();
            }
            return;
        }

        // Handle KBLI LOV callback
        if (parts[0] === "KBLI") {
            console.log("RegalDetail: Handling KBLI callback");
            // Format callback: KBLI|txtColumn1|txtColumn2|...
            // parts[1] = txtColumn1 = Code
            // parts[2] = txtColumn2 = Description
            const code = parts[1] || "";
            const description = parts[2] || "";

            // Format output: "Code - Description"
            const formattedValue = code && description ? `${code} - ${description}` : (code || description);
            console.log("RegalDetail: Setting KBLI to:", formattedValue);
            $('#kbli').val(formattedValue);

            if (typeof clsGlobal !== 'undefined' && typeof clsGlobal.closeLOV === 'function') {
                clsGlobal.closeLOV();
            } else if (typeof $.fancybox !== 'undefined' && typeof $.fancybox.close === 'function') {
                $.fancybox.close();
            }
            return;
        }

        // Handle Jenis PBUM KU LOV callback
        if (parts[0] === "JENIS_PBUM_KU") {
            console.log("RegalDetail: Handling JENIS_PBUM_KU callback");
            // Format callback: JENIS_PBUM_KU|txtColumn1|txtColumn2|...
            // parts[1] = txtColumn1 = Code
            // parts[2] = txtColumn2 = Description
            const code = parts[1] || "";
            const description = parts[2] || "";

            // Use description if available, otherwise use code
            const formattedValue = description || code;
            console.log("RegalDetail: Setting Jenis PBUM KU to:", formattedValue);
            $('#oss_JenisPbum').val(formattedValue);

            if (typeof clsGlobal !== 'undefined' && typeof clsGlobal.closeLOV === 'function') {
                clsGlobal.closeLOV();
            } else if (typeof $.fancybox !== 'undefined' && typeof $.fancybox.close === 'function') {
                $.fancybox.close();
            }
            return;
        }

        // Call previous handler if exists (for other LOV types)
        console.log("RegalDetail: No handler found for LOV type:", parts[0], "- calling previous handler");
        if (previousSetChooseLOV && typeof previousSetChooseLOV === 'function') {
            previousSetChooseLOV(txtValue);
        } else {
            console.warn("RegalDetail: No previous handler found for LOV type:", parts[0]);
        }
    };
}

// ============================================================================
// SECTION 9: EVENTS MODULE
// ============================================================================
// All event listeners organized in one place
// ============================================================================

RegalDetail.Events = {
    /**
     * Initialize all event listeners
     */
    Init: function () {
        const Actions = RegalDetail.Actions;
        const Utils = RegalDetail.Utils;
        const C = RegalDetail.Constants;

        // Back button with confirmation
        $(C.BUTTON_IDS.BACK).on('click', function (e) {
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
                    if (typeof f_ShowListRegal === 'function') {
                        f_ShowListRegal();
                    }
                }
            });
        });

        // File input change - Generate Preview
        $("#fileDoc").on("change", function (e) {
            e.preventDefault();

            const C = RegalDetail.Constants;
            const fileInput = this;
            const allowedExts = C.FILE.ALLOWED_EXTENSIONS;
            let hasInvalidFile = false;
            let invalidFileNames = [];

            // Validate each selected file
            if (fileInput.files && fileInput.files.length > 0) {
                Array.from(fileInput.files).forEach(function (file) {
                    const fileExt = file.name.split('.').pop().toLowerCase();
                    const isValidExtension = allowedExts.indexOf(fileExt) !== -1;

                    if (!isValidExtension) {
                        hasInvalidFile = true;
                        invalidFileNames.push(file.name);
                    }
                });
            }

            // If invalid files found, show warning and clear file input
            if (hasInvalidFile) {
                const fileList = invalidFileNames.join(', ');
                clsGlobal.swalWarning("Format file tidak diizinkan. Hanya format PDF, DOCX, XLSX, PNG, JPG, JPEG yang diperbolehkan.<br><br>File yang tidak valid: " + fileList);
                $(fileInput).val(''); // Clear file input
                $('#modalShowFilePreview').empty(); // Clear preview
                return;
            }

            // If all files are valid, proceed with preview generation
            RegalDetail.GeneratePreviewUpload();
        });

        // LOV Search Buttons
        // Task 3: Sinkronisasi Visual - Sync #picRAOSS dengan #oss_PicRA secara realtime
        $('#picRAOSS').on('change', function () {
            const picRaOssValue = $(this).val() || '';
            $('#oss_PicRA').val(picRaOssValue);
            console.log('RegalDetail: Synced #picRAOSS to #oss_PicRA:', picRaOssValue);
        });

        $('#btnSearchPicRaOss').on('click', function (e) {
            e.preventDefault();
            clsGlobal.generateLOV(C.LOV_TYPES.PIC_RA_OSS, "picRAOSS");
        });

        $('#btnSearchNomorIzinEdar').on('click', function (e) {
            e.preventDefault();
            Actions.openNomorIzinEdarLov();
        });

        $('#btnSearchVerforNo').on('click', function (e) {
            e.preventDefault();
            clsGlobal.generateLOV(C.LOV_TYPES.VERFOR_HEADER, 'verforNo');
        });

        $('#btnSearchKbli').on('click', function (e) {
            e.preventDefault();
            clsGlobal.generateLOV(C.LOV_TYPES.KBLI, 'KBLI', '');
        });

        $('#btnSearchJenisPbum').on('click', function (e) {
            e.preventDefault();
            clsGlobal.generateLOV(C.LOV_TYPES.JENIS_PBUM_KU, 'JENIS_PBUM_KU', '');
        });

        // Save Regal Header
        $(C.BUTTON_IDS.SAVE_HEADER).on('click', function (e) {
            e.preventDefault();
            const regalId = $('#hdRegalId').val();
            Actions.saveRegalData()
                .then(() => {
                    clsGlobal.swalSuccess("Berhasil menyimpan data Registrasi Lokal");
                    if (regalId) {
                        RegalDetail.RefreshDocumentListOnly(regalId);
                    }
                })
                .catch(() => {
                    // Error message already handled in save function
                });
        });

        // Final Label Approval Buttons
        $('#btnSubmitLabel_RA').on('click', function (e) {
            e.preventDefault();
            const statusValue = $('#approval_ra').val();
            const today = moment().format(C.FILE.DATE_FORMAT);
            $('#approval_ra_date').val(today);
            const dateValue = Utils.sanitizeDateValue($('#approval_ra_date').val());
            const notesValue = ($('#notes_ra').val() || '').trim();

            if (statusValue === C.REVIEW_STATUS.NEED_REVISE && !notesValue) {
                clsGlobal.swalWarning('Catatan (Notes) wajib diisi jika status "Need Revise".');
                return false;
            }

            Actions.submitFinalLabelApproval(C.APPROVAL_TYPES.RA, statusValue, dateValue, notesValue);
        });

        $('#btnSubmitLabel_PD').on('click', function (e) {
            e.preventDefault();
            const statusValue = $('#approval_pd').val();
            const today = moment().format(C.FILE.DATE_FORMAT);
            $('#approval_pd_date').val(today);
            const dateValue = Utils.sanitizeDateValue($('#approval_pd_date').val());
            const notesValue = ($('#notes_pd').val() || '').trim();

            if (statusValue === C.REVIEW_STATUS.NEED_REVISE && !notesValue) {
                clsGlobal.swalWarning('Catatan (Notes) wajib diisi jika status "Need Revise".');
                return false;
            }

            Actions.submitFinalLabelApproval(C.APPROVAL_TYPES.PD, statusValue, dateValue, notesValue);
        });

        $('#btnSubmitLabel_PKG').on('click', function (e) {
            e.preventDefault();
            const statusValue = $('#approval_pkg').val();
            const today = moment().format(C.FILE.DATE_FORMAT);
            $('#approval_pkg_date').val(today);
            const dateValue = Utils.sanitizeDateValue($('#approval_pkg_date').val());
            const notesValue = ($('#notes_pkg').val() || '').trim();

            if (statusValue === C.REVIEW_STATUS.NEED_REVISE && !notesValue) {
                clsGlobal.swalWarning('Catatan (Notes) wajib diisi jika status "Need Revise".');
                return false;
            }

            Actions.submitFinalLabelApproval(C.APPROVAL_TYPES.PKG, statusValue, dateValue, notesValue);
        });

        // OSS Action Buttons
        $(C.BUTTON_IDS.REGAL_PROCESS_DOC).on('click', function (e) {
            e.preventDefault();
            Actions.submitRegal();
        });

        $(C.BUTTON_IDS.OSS_REQUEST_VERFOR).on('click', function (e) {
            e.preventDefault();
            Actions.requestVerfor();
        });

        $(C.BUTTON_IDS.OSS_APPROVE).on('click', function (e) {
            e.preventDefault();
            Actions.approveRegal();
        });

        $(C.BUTTON_IDS.OSS_RETURN).on('click', function (e) {
            e.preventDefault();
            Actions.returnRegal();
        });

        // Final Label File Management
        $('#finalLabelButtonContainer').on('click', '#btnTriggerFinalLabelUpload', function () {
            $('#finalLabel').trigger('click');
        });

        $('#btnUploadFinalLabel').on('click', function () {
            const fileInput = $('#finalLabelFile')[0];
            const regalId = $('#hdRegalId').val();

            if (!regalId) {
                clsGlobal.swalWarning(C.MESSAGES.REGAL_NOT_READY);
                return;
            }

            if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
                clsGlobal.swalWarning('Silakan pilih file terlebih dahulu.');
                return;
            }

            const file = fileInput.files[0];
            if (file.size > C.FILE.MAX_SIZE) {
                clsGlobal.swalWarning('Ukuran file maksimal 5MB.');
                return;
            }

            const formData = new FormData();
            formData.append('__RequestVerificationToken', Utils.getAntiForgeryToken());
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
                clsGlobal.swalWarning(C.MESSAGES.REGAL_NOT_READY);
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
                        __RequestVerificationToken: Utils.getAntiForgeryToken(),
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

        // Delete document from preview modal
        $('#modalShowFilePreviewUploaded').on('click', '.btn-delete-preview-doc', function () {
            const docId = $(this).data('doc-id');
            const filePath = $(this).data('file-path');

            if (!docId) {
                clsGlobal.swalWarning('ID dokumen tidak ditemukan.');
                return;
            }

            if (!filePath) {
                clsGlobal.swalWarning('Path file tidak ditemukan.');
                return;
            }

            Swal.fire({
                title: 'Anda yakin?',
                text: 'File ini akan dihapus permanen.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Batal',
                customClass: {
                    confirmButton: 'btn btn-primary',
                    cancelButton: 'btn btn-secondary'
                },
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
                        __RequestVerificationToken: Utils.getAntiForgeryToken(),
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

        // Save Upload Document
        $('#btnSaveUploadDoc').on('click', function (e) {
            e.preventDefault();

            // Access State from RegalDetail namespace
            const State = RegalDetail.State;

            var fileInput = $('#fileDoc')[0];

            // Validate file input
            if (fileInput.files.length === 0) {
                clsGlobal.swalWarning("Silahkan pilih file untuk diupload");
                return;
            }

            // Validate file extension and size
            const allowedExts = C.FILE.ALLOWED_EXTENSIONS;
            var hasInvalidExtension = false;
            var invalidFileName = '';
            var maxSize = C.FILE.MAX_SIZE;
            var hasOversizedFile = false;

            $.each(fileInput.files, function (index, file) {
                var fileExt = file.name.split('.').pop().toLowerCase();
                var isValidExtension = allowedExts.indexOf(fileExt) !== -1;

                if (!isValidExtension) {
                    hasInvalidExtension = true;
                    invalidFileName = file.name;
                    return false;
                }

                if (file.size > maxSize) {
                    hasOversizedFile = true;
                    clsGlobal.swalWarning('Ukuran file maksimal 5MB. File "' + file.name + '" berukuran ' + (file.size / 1024 / 1024).toFixed(2) + 'MB.');
                    return false;
                }
            });

            if (hasInvalidExtension) {
                clsGlobal.swalWarning("Format file " + invalidFileName + " tidak diizinkan");
                return;
            }

            if (hasOversizedFile) {
                return;
            }

            // Get docId and headerId from modal
            const docData = JSON.parse($('#hdDocData').val() || '{}');
            const docId = docData.TxtId;
            const headerId = $('#hdRegalId').val();

            // Determine which endpoint to call based on current status
            const currentStatus = (State.currentRegalStatus || '').toUpperCase();
            const isNeedRevision = currentStatus === C.STATUS.NEED_REVISION;
            const isDocInProcess = currentStatus === C.STATUS.DOC_IN_PROCESS;

            // Choose appropriate endpoint
            let checkEndpoint = '';
            let confirmationTitle = '';
            let confirmationText = '';
            let resultKey = '';

            if (isNeedRevision) {
                checkEndpoint = base_path + "/Regal/CheckIsLastRevision";
                resultKey = 'isLastRevision';
                confirmationTitle = 'Dokumen Revisi Terakhir';
                confirmationText = 'Ini adalah dokumen revisi terakhir. Setelah upload, status akan berubah otomatis menjadi Document Review. Lanjutkan?';
            } else if (isDocInProcess) {
                checkEndpoint = base_path + "/Regal/CheckIsLastDocumentForDocInProcess";
                resultKey = 'isLastDocument';
                confirmationTitle = 'Dokumen Terakhir';
                confirmationText = 'Ini adalah dokumen terakhir yang perlu diupload. Setelah upload, status akan berubah otomatis menjadi Document Review. Lanjutkan?';
            }

            // If status is not NEED_REVISION or DOC_IN_PROCESS, proceed directly without confirmation
            if (!checkEndpoint) {
                console.log("Status is not NEED_REVISION or DOC_IN_PROCESS, proceeding directly");
                proceedWithUpload(fileInput, docId);
                return;
            }

            // Check if this is the last document before proceeding
            $.ajax({
                type: "GET",
                url: checkEndpoint,
                data: {
                    docId: docId,
                    headerId: headerId
                },
                datatype: "json",
                success: function (retDat, status, xhr) {
                    if (xhr.responseText.includes("!DOCTYPE html")) {
                        clsGlobal.swalWarningRedirect("Sesi Anda telah berakhir, silakan login kembali", window.location.href);
                        return;
                    }

                    if (retDat.bitSuccess === true) {
                        const isLastDocument = retDat.objData?.[resultKey] === true;

                        if (isLastDocument) {
                            // Show confirmation for last document
                            Swal.fire({
                                title: confirmationTitle,
                                text: confirmationText,
                                icon: 'question',
                                showCancelButton: true,
                                confirmButtonText: 'Ya, Lanjutkan',
                                cancelButtonText: 'Batal',
                                customClass: {
                                    confirmButton: 'btn btn-primary',
                                    cancelButton: 'btn btn-secondary'
                                }
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    proceedWithUpload(fileInput, docId);
                                }
                            });
                        } else {
                            // Not last document, proceed directly
                            proceedWithUpload(fileInput, docId);
                        }
                    } else {
                        clsGlobal.swalError(retDat.txtMessage || "Gagal memeriksa status dokumen");
                    }
                },
                error: function (xhr) {
                    const errorMessage = xhr.responseJSON?.txtMessage || xhr.responseText || "Terjadi kesalahan saat memeriksa status dokumen.";
                    clsGlobal.swalError(errorMessage);
                }
            });
        });

        // Helper function to proceed with upload
        function proceedWithUpload(fileInput, docId) {
            clsGlobal.showLoading();

            // Save ONLY the document being uploaded (not all documents)
            Actions.saveSingleDocumentInput(docId)
                .then(() => {
                    console.log("saveSingleDocumentInput - Document saved successfully, proceeding with upload");

                    // Prepare FormData for file upload
                    var formData = new FormData();

                    $.each(fileInput.files, function (index, file) {
                        formData.append('FileDoc', file);
                        formData.append('originalFileNames', file.name);
                    });

                    formData.append('DocData', $('#hdDocData').val());
                    formData.append('__RequestVerificationToken', Utils.getAntiForgeryToken());

                    // Upload file
                    $.ajax({
                        type: "POST",
                        url: base_path + "/Regal/SaveUploadRegalDoc",
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function (retDat, status, xhr) {
                            clsGlobal.hideLoading();
                            if (xhr.responseText.includes("!DOCTYPE html")) {
                                clsGlobal.swalWarningRedirect(C.MESSAGES.SESSION_EXPIRED, window.location.href);
                            }
                            else {
                                if (retDat.bitSuccess == true) {
                                    // Check if status changed to DOC_REVIEW after upload completion
                                    const statusChanged = retDat.statusChanged === true || retDat.statusChanged === 'true';
                                    const newStatus = (retDat.newStatus || '').toUpperCase();
                                    const isDocReview = newStatus === C.STATUS.DOC_REVIEW;

                                    if (statusChanged && isDocReview) {
                                        // Status changed to DOC_REVIEW - Show notification and refresh detail
                                        console.log("SaveUploadRegalDoc: Status changed to DOC_REVIEW after upload completion");

                                        // Close modal
                                        $('#UploadDocModal').modal('hide');

                                        // Clear file input
                                        $('#fileDoc').val('');
                                        RegalDetail.EmptyPreview();

                                        // Determine message based on previous status
                                        const currentRegalStatus = State.currentRegalStatus || '';
                                        let notificationMessage = 'Seluruh dokumen telah lengkap. Status dokumen berubah menjadi DOC REVIEW.';

                                        if (currentRegalStatus.toUpperCase() === C.STATUS.NEED_REVISION) {
                                            notificationMessage = 'Semua revisi dokumen telah selesai. Status dokumen berubah menjadi DOC REVIEW.';
                                        }

                                        Swal.fire({
                                            title: 'Upload Selesai',
                                            text: notificationMessage,
                                            icon: 'success',
                                            confirmButtonText: 'OK',
                                            allowOutsideClick: false,
                                            allowEscapeKey: false,
                                            customClass: {
                                                confirmButton: 'btn btn-primary'
                                            }
                                        }).then((result) => {
                                            // Refresh detail page (stay on detail, don't go to index)
                                            const regalId = $('#hdRegalId').val();
                                            if (regalId && typeof RegalHeader !== 'undefined' && typeof RegalHeader.ShowDetail === 'function') {
                                                RegalHeader.ShowDetail(regalId);
                                            } else {
                                                // Fallback: reload page if RegalHeader.ShowDetail not available
                                                window.location.reload();
                                            }
                                        });
                                    } else {
                                        // Normal upload success
                                        // UX FIX: Stay on detail page, just refresh document table
                                        console.log("SaveUploadRegalDoc: Upload success, refreshing document table only");

                                        // Close modal
                                        $('#UploadDocModal').modal('hide');

                                        // Clear file input
                                        $('#fileDoc').val('');
                                        RegalDetail.EmptyPreview();

                                        // Show success message
                                        clsGlobal.swalSuccessWithoutAction("File berhasil diupload");

                                        // Refresh document table only (stay on detail page)
                                        const regalId = $('#hdRegalId').val();
                                        if (regalId) {
                                            // Use RefreshDocumentListOnly with showWarning=false to avoid warning about unsaved changes
                                            RegalDetail.RefreshDocumentListOnly(regalId, false);
                                        }
                                    }
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
                    clsGlobal.hideLoading();
                    console.error("saveSingleDocumentInput - Failed to save document data:", error);

                    if (typeof error === 'string') {
                        clsGlobal.swalWarning(error);
                    } else {
                        clsGlobal.swalWarning("Gagal menyimpan data Review/Catatan. Upload dibatalkan.");
                    }
                });
        }

        // Request Review Label
        $(C.BUTTON_IDS.REQUEST_REVIEW_LABEL).on('click', function (e) {
            e.preventDefault();

            const regalHdrTxtId = $('#hdRegalId').val();
            if (!regalHdrTxtId) {
                clsGlobal.swalWarning("Regal ID tidak ditemukan");
                return;
            }

            // Validasi: Minimal harus ada 1 file di List File Label
            // Load data dari server terlebih dahulu untuk memastikan data terbaru
            clsGlobal.showLoading();

            // Check files from server directly (don't rely on table data which might not be loaded)
            $.ajax({
                type: 'GET',
                url: base_path + '/Regal/GetFinalLabelFiles',
                data: { regalHdrTxtId: regalHdrTxtId }
            }).done(function (response) {
                clsGlobal.hideLoading();

                let files = [];
                if (response && response.bitSuccess && response.objData) {
                    if (Array.isArray(response.objData)) {
                        files = response.objData;
                    } else if (typeof response.objData === 'string') {
                        try {
                            files = JSON.parse(response.objData);
                        } catch (e) {
                            console.error('Failed to parse files data:', e);
                        }
                    }
                }

                // Filter hanya file yang aktif (tidak di-void)
                const activeFiles = files.filter(function (file) {
                    return file && (file.BitActive !== false && file.BitActive !== 'false');
                });

                if (activeFiles.length === 0) {
                    clsGlobal.swalWarning("Minimal harus ada 1 file Final Label yang sudah diupload sebelum melakukan Request Review Label.");
                    // Refresh table data untuk konsistensi UI
                    RegalDetail.Actions.loadFinalLabelFiles(regalHdrTxtId);
                    return;
                }

                console.log("Validasi Request Review Label: " + activeFiles.length + " file ditemukan");

                // Proceed with request review
                $.ajax({
                    url: base_path + '/Regal/RequestLabelReview',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ RegalId: regalHdrTxtId }),
                    headers: {
                        'RequestVerificationToken': Utils.getAntiForgeryToken()
                    },
                    success: function (response) {
                        clsGlobal.hideLoading();

                        if (response && response.bitSuccess) {
                            clsGlobal.swalSuccessWithoutAction("Request review label berhasil dikirim");

                            const regalHdrTxtId = $('#hdRegalId').val();
                            if (regalHdrTxtId) {
                                RegalDetail.RefreshFinalLabelTabOnly(regalHdrTxtId);
                                // Refresh history after request review
                                RegalDetail.Actions.loadFinalLabelHistory(regalHdrTxtId);
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
            }).fail(function (xhr, status, error) {
                clsGlobal.hideLoading();
                clsGlobal.swalError("Gagal memuat data file Final Label. Silakan coba lagi.");
                console.error('GetFinalLabelFiles error:', error);
            });
        });

        // OSS Data Management
        $(C.BUTTON_IDS.SIMPAN_ID_OSS).on('click', function (e) {
            e.preventDefault();

            const regalHdrTxtId = $('#hdRegalId').val();
            if (!regalHdrTxtId) {
                clsGlobal.swalWarning("Regal ID tidak ditemukan");
                return;
            }

            // --- VALIDATION START ---
            const missingFields = [];
            const noIdOss = ($('#oss_NoIdOSS').val() || '').trim();
            const noAju = ($('#oss_NoAju').val() || '').trim();
            const kegiatanUsaha = ($('#oss_KegiatanUsaha').val() || '').trim();
            const jenisPbum = ($('#oss_JenisPbum').val() || '').trim();

            if (!noIdOss) missingFields.push('No ID OSS');
            if (!noAju) missingFields.push('No. AJU Registrasi');
            if (!kegiatanUsaha) missingFields.push('Kegiatan Usaha');
            if (!jenisPbum) missingFields.push('Jenis PBUM KU');

            if (missingFields.length > 0) {
                clsGlobal.swalWarning(`Data berikut wajib diisi: ${missingFields.join(', ')}`);
                return;
            }
            // --- VALIDATION END ---

            // Auto-fill Tgl. Permintaan OSS dengan tanggal hari ini jika masih kosong
            const currentTglPermintaan = $('#oss_TglPermintaan').val();
            if (!currentTglPermintaan) {
                const today = moment().format('DD/MM/YYYY'); // Use display format DD/MM/YYYY
                $('#oss_TglPermintaan').val(today);
                console.log('RegalDetail: Auto-filled oss_TglPermintaan with today:', today);
            }

            const ossPayload = {
                RegalHdrTxtId: regalHdrTxtId,
                IdOss: $('#oss_IdOSS').val() || null,
                TglPermintaanOss: Utils.convertDateToISO($('#oss_TglPermintaan').val()), // Convert DD/MM/YYYY to YYYY-MM-DD
                PicRaOss: $('#oss_PicRA').val() || null,
                NoAjuRegistrasi: noAju || null,
                KegiatanUsaha: kegiatanUsaha || null,
                JenisPbumKu: jenisPbum || null,
                NoIdOss: noIdOss || null,
                Comment: $('#oss_Comment').val() || null
            };

            clsGlobal.showLoading();

            $.ajax({
                url: base_path + '/Regal/SaveOssData',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(ossPayload),
                headers: {
                    'RequestVerificationToken': Utils.getAntiForgeryToken()
                },
                success: function (response) {
                    clsGlobal.hideLoading();

                    if (response && response.bitSuccess) {
                        // Success - Create BPOM (background process)
                        RegalDetail.Actions.createBpomFromRegal(regalHdrTxtId)
                            .done(function (retDat) {
                                if (retDat.bitSuccess) {
                                    // Show "Good Job" Swal
                                    Swal.fire({
                                        title: "Good job!",
                                        text: "Data OSS berhasil disimpan",
                                        icon: "success",
                                        confirmButtonText: "OK",
                                        customClass: {
                                            confirmButton: 'btn btn-primary'
                                        }
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            const directDetailUrl = base_path + '/Regal/DirectDetail?id=' + encodeURIComponent(regalHdrTxtId);
                                            window.location.href = directDetailUrl;
                                        }
                                    });
                                } else {
                                    clsGlobal.swalError(retDat.txtMessage);
                                }
                            })
                            .fail(function () {
                                clsGlobal.swalError("Gagal membuat BPOM Header");
                            });
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

        $(C.BUTTON_IDS.REQUEST_ID_OSS).on('click', function (e) {
            e.preventDefault();

            const regalHdrTxtId = $('#hdRegalId').val();
            if (!regalHdrTxtId) {
                clsGlobal.swalWarning("Regal ID tidak ditemukan");
                return;
            }

            const picRaOss = $('#oss_PicRA').val();
            if (!picRaOss) {
                clsGlobal.swalWarning("PIC RA OSS harus diisi terlebih dahulu");
                return;
            }

            clsGlobal.showLoading();

            $.ajax({
                url: base_path + '/Regal/RequestOssIdEmail',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ RegalId: regalHdrTxtId }),
                headers: {
                    'RequestVerificationToken': Utils.getAntiForgeryToken()
                },
                success: function (response) {
                    clsGlobal.hideLoading();

                    if (response && response.bitSuccess) {
                        clsGlobal.swalSuccessWithoutAction("Email request ID OSS berhasil dikirim");
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

        // Final Label Files Management
        $(C.BUTTON_IDS.OPEN_MANAGE_FINAL_LABEL).on('click', function (e) {
            e.preventDefault();

            const regalHdrTxtId = $('#hdRegalId').val();
            if (!regalHdrTxtId) {
                clsGlobal.swalWarning(C.MESSAGES.REGAL_NOT_READY);
                return;
            }

            // ROLE-BASED MODAL ACCESS: BD (full access) vs RA/PDV/PCD (read-only)
            const State = RegalDetail.State;
            const role = (State.currentUserRoleCode || '').toString().trim().toUpperCase();
            const isBD = State.isUserBD || role === 'BD' || role.includes('BUSINESS') || role.includes('BD');

            // Check Final Label status for upload access
            const statusFinalLabel = (State.currentStatusFinalLabel || '').toUpperCase();
            const isFinalLabelDraftOrRevise = (!statusFinalLabel || statusFinalLabel === '' ||
                statusFinalLabel === C.STATUS.DRAFT ||
                statusFinalLabel === C.STATUS.NEED_REVISION ||
                statusFinalLabel === 'REVISE');

            console.log('OpenManageFinalLabelModal: Current user role:', role);
            console.log('OpenManageFinalLabelModal: State.isUserBD:', State.isUserBD);
            console.log('OpenManageFinalLabelModal: isBD (final):', isBD);
            console.log('OpenManageFinalLabelModal: Final Label Status:', statusFinalLabel);
            console.log('OpenManageFinalLabelModal: isFinalLabelDraftOrRevise:', isFinalLabelDraftOrRevise);

            // Target form upload card container (card containing formUploadFinalLabelFile)
            // More specific selector: card that contains the upload form
            const $uploadFormCard = $('#ManageFinalLabelModal #formUploadFinalLabelFile').closest('.card');

            // BD can ALWAYS view/download files, but upload is only allowed on DRAFT/NEED_REVISION
            const canUpload = isBD && isFinalLabelDraftOrRevise;

            if (isBD) {
                // BD has access to the modal
                if (canUpload) {
                    // BD with DRAFT/NEED_REVISION status: Show upload form (full access)
                    $uploadFormCard.show().removeClass('d-none');
                    $('#btnSaveFinalLabelFile').prop('disabled', false).show().removeClass('d-none');
                    $('#finalLabelInputFile').prop('disabled', false);
                    $('#ManageFinalLabelModalLabel').text('Kelola File Final Label');
                    console.log('✅ OpenManageFinalLabelModal: Upload form SHOWN for BD role (status: ' + statusFinalLabel + ')');
                } else {
                    // BD with other status: Hide upload form, but can still view/download
                    $uploadFormCard.hide().addClass('d-none');
                    $('#btnSaveFinalLabelFile').prop('disabled', true).hide().addClass('d-none');
                    $('#finalLabelInputFile').prop('disabled', true);
                    $('#ManageFinalLabelModalLabel').text('Lihat File Final Label');
                    console.log('📋 OpenManageFinalLabelModal: Upload form HIDDEN for BD (status: ' + statusFinalLabel + ' - view/download only)');
                }
            } else {
                // Non-BD roles (RA/PDV/PCD): Hide upload form (read-only access for review and download)
                $uploadFormCard.hide().addClass('d-none');
                $('#btnSaveFinalLabelFile').prop('disabled', true).hide().addClass('d-none');
                $('#finalLabelInputFile').prop('disabled', true);
                $('#ManageFinalLabelModalLabel').text('Lihat File Final Label (Read-Only)');
                console.log('🔒 OpenManageFinalLabelModal: Upload form HIDDEN for role:', role, '(read-only mode - can only preview & download)');
            }

            $('#ManageFinalLabelModal').modal('show');
            RegalDetail.Actions.loadFinalLabelFiles(regalHdrTxtId);
        });

        // Event listener untuk final label files actions (preview, delete) - menggunakan event delegation
        // karena elemen ini dibuat secara dinamis
        $(C.SELECTORS.FINAL_LABEL_FILES).on('click', '.btn-preview-final-label-file', function () {
            const filePath = $(this).data('file-path');
            const fileName = $(this).data('file-name');

            if (filePath) {
                const State = RegalDetail.State;

                // Determine if action buttons should be hidden in preview modal
                // Hide actions when:
                // 1. Status Final Label = 'APPROVED' (DOC_APPROVED)
                // 2. OR Role is RA/PDV/PCD (not BD) - regardless of status
                const statusFinalLabel = (State.currentStatusFinalLabel || '').toUpperCase();
                const isFinalLabelApproved = statusFinalLabel === 'DOC_APPROVED' || statusFinalLabel === 'APPROVED';

                const currentUserRole = (State.currentUserRoleCode || '').toString().trim().toUpperCase();
                const isUserBDRole = State.isUserBD || currentUserRole === 'BD' || currentUserRole.includes('BUSINESS') || currentUserRole.includes('BD');

                // Hide actions if: Status APPROVED OR not BD role
                const shouldHideActions = isFinalLabelApproved || !isUserBDRole;

                console.log('Preview Final Label File - Hide Actions?', shouldHideActions);
                console.log('  - Final Label Status:', statusFinalLabel, '→ isApproved:', isFinalLabelApproved);
                console.log('  - User Role:', currentUserRole, '→ isBD:', isUserBDRole);

                RegalDetail.ShowPreviewModal(
                    encodeURIComponent(filePath),
                    '',
                    '',
                    encodeURIComponent(fileName),
                    shouldHideActions
                );
            }
        });

        $(C.SELECTORS.FINAL_LABEL_FILES).on('click', '.btn-delete-final-label-file', function () {
            const fileTxtId = $(this).data('file-txt-id');
            const regalHdrTxtId = $('#hdRegalId').val();

            if (!fileTxtId) {
                clsGlobal.swalWarning('ID file tidak ditemukan.');
                return;
            }

            Swal.fire({
                title: 'Anda yakin?',
                text: 'File ini akan dihapus permanen.',
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
                    url: base_path + '/Regal/DeleteFinalLabelFileNew',
                    data: {
                        __RequestVerificationToken: Utils.getAntiForgeryToken(),
                        fileTxtId: fileTxtId
                    }
                }).done(function (response) {
                    console.log('DeleteFinalLabelFile response:', response);
                    if (response && response.bitSuccess) {
                        clsGlobal.swalSuccessWithoutAction('File berhasil dihapus.');
                        RegalDetail.Actions.loadFinalLabelFiles(regalHdrTxtId);
                        // Refresh history after file delete
                        RegalDetail.Actions.loadFinalLabelHistory(regalHdrTxtId);
                    } else {
                        clsGlobal.swalError(response && response.txtMessage ? response.txtMessage : 'Gagal menghapus file.');
                    }
                }).fail(function (xhr) {
                    console.error('DeleteFinalLabelFile failed:', xhr.responseText);
                    clsGlobal.swalError('Terjadi kesalahan saat menghapus file.');
                });
            });
        });

        // Task 6: Document History Button (delegated event for dynamically added buttons)
        $(document).on('click', '.btn-view-history', function (e) {
            e.preventDefault();
            const docId = $(this).data('doc-id');
            if (docId) {
                Actions.LoadDocHistory(docId);
            } else {
                clsGlobal.swalWarning('ID dokumen tidak ditemukan.');
            }
        });

        // Validate Final Label file on change
        $('#finalLabelInputFile').on('change', function (e) {
            e.preventDefault();

            const C = RegalDetail.Constants;
            const fileInput = this;
            const allowedExts = C.FILE.ALLOWED_EXTENSIONS;

            // Validate selected file
            if (fileInput.files && fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const fileExt = file.name.split('.').pop().toLowerCase();
                const isValidExtension = allowedExts.indexOf(fileExt) !== -1;

                // If invalid file found, show warning and clear file input
                if (!isValidExtension) {
                    clsGlobal.swalWarning("Format file tidak diizinkan. Hanya format PDF, DOCX, XLSX, PNG, JPG, JPEG yang diperbolehkan.<br><br>File yang tidak valid: " + file.name);
                    $(fileInput).val(''); // Clear file input
                    return;
                }
            }
        });

        // Save Final Label File in Modal
        $('#btnSaveFinalLabelFile').on('click', function (e) {
            e.preventDefault();

            // BUG C FIX: Security check - Only BD role can upload
            const State = RegalDetail.State;
            const role = (State.currentUserRoleCode || '').toString().trim().toUpperCase();
            const isBD = role === 'BD';

            if (!isBD) {
                clsGlobal.swalWarning('Hanya BD (Business Development) yang dapat melakukan upload file Final Label.');
                console.warn('Upload blocked: User role is', role, 'not BD');
                return;
            }

            const fileInput = $('#finalLabelInputFile')[0];
            const regalHdrTxtId = $('#hdRegalId').val();

            if (!regalHdrTxtId) {
                clsGlobal.swalWarning(C.MESSAGES.REGAL_NOT_READY);
                return;
            }

            if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
                clsGlobal.swalWarning('Silakan pilih file terlebih dahulu.');
                return;
            }

            // Validate file extension
            const allowedExts = C.FILE.ALLOWED_EXTENSIONS;
            const file = fileInput.files[0];
            const fileExt = file.name.split('.').pop().toLowerCase();
            const isValidExtension = allowedExts.indexOf(fileExt) !== -1;

            if (!isValidExtension) {
                clsGlobal.swalWarning("Format file tidak diizinkan. Hanya format PDF, DOCX, XLSX, PNG, JPG, JPEG yang diperbolehkan.<br><br>File yang tidak valid: " + file.name);
                $('#finalLabelInputFile').val(''); // Clear file input
                return;
            }

            if (file.size > C.FILE.MAX_SIZE) {
                clsGlobal.swalWarning('Ukuran file maksimal 5MB.');
                return;
            }

            const formData = new FormData();
            formData.append('__RequestVerificationToken', Utils.getAntiForgeryToken());
            formData.append('regalHdrTxtId', regalHdrTxtId);
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

                // BUG C FIX: Handle multiple response formats and ensure table refresh
                const isSuccess = (response && response.success) || (response && response.bitSuccess);

                if (isSuccess) {
                    clsGlobal.swalSuccessWithoutAction('File berhasil diupload.');
                    $('#finalLabelInputFile').val(null);

                    // BUG FIX: Always refresh the table after successful upload
                    // Get regalHdrTxtId safely within callback scope (use the one from outer scope to ensure consistency)
                    const id = regalHdrTxtId || $('#hdRegalId').val();
                    console.log('Upload Final Label: Upload successful. Refreshing table for RegalHdrTxtId:', id);
                    console.log('Upload Final Label: Response:', response);

                    if (!id) {
                        console.error('Upload Final Label: RegalHdrTxtId is empty, cannot refresh table');
                        clsGlobal.swalWarning('File berhasil diupload, namun tidak dapat memuat ulang tabel. Silakan refresh halaman.');
                        return;
                    }

                    // BUG FIX: Increase delay to ensure database transaction is committed
                    // Also ensure modal is still open when refreshing
                    setTimeout(function () {
                        console.log('Upload Final Label: Calling loadFinalLabelFiles for ID:', id);
                        // Use full namespace to ensure function is accessible
                        if (RegalDetail && RegalDetail.Actions && typeof RegalDetail.Actions.loadFinalLabelFiles === 'function') {
                            // Force refresh by calling the function directly
                            RegalDetail.Actions.loadFinalLabelFiles(id);
                            // Refresh history after file upload
                            RegalDetail.Actions.loadFinalLabelHistory(id);
                            console.log('Upload Final Label: loadFinalLabelFiles and loadFinalLabelHistory called successfully');
                        } else {
                            console.error('Upload Final Label: loadFinalLabelFiles function not found in RegalDetail.Actions');
                            console.error('Upload Final Label: RegalDetail:', typeof RegalDetail);
                            console.error('Upload Final Label: RegalDetail.Actions:', typeof RegalDetail?.Actions);
                            clsGlobal.swalWarning('File berhasil diupload, namun fungsi refresh tabel tidak ditemukan. Silakan refresh halaman.');
                        }
                    }, 500); // Increased delay to 500ms to ensure DB commit is complete
                } else {
                    const errorMsg = (response && response.message) || (response && response.txtMessage) || 'Gagal mengunggah file.';
                    clsGlobal.swalError(errorMsg);
                }
            }).fail(function (xhr) {
                clsGlobal.hideLoading();
                console.error('BUG C FIX: Upload Final Label file failed:', xhr);
                const errorMsg = (xhr.responseJSON && xhr.responseJSON.message) || 'Terjadi kesalahan saat mengunggah file.';
                clsGlobal.swalError(errorMsg);
            });
        });
    }
};

// ============================================================================
// SECTION 10: INITIALIZATION
// ============================================================================
// Initialize all event listeners when document is ready
// ============================================================================

$(document).ready(function () {
    RegalDetail.Events.Init();
});

// ============================================================================
// REFACTORING COMPLETE - SUMMARY
// ============================================================================
// File telah direfactor menjadi struktur modular:
// - RegalDetail.Constants: Semua magic strings
// - RegalDetail.State: Semua variabel global
// - RegalDetail.Utils: Helper functions
// - RegalDetail.Templates: HTML string generation
// - RegalDetail.API: AJAX wrapper
// - RegalDetail.Actions: Business logic functions
// - RegalDetail: Main object dengan semua methods
// - RegalDetail.Events: Event listeners
// - Backward Compatibility: Window function mappings
// ============================================================================


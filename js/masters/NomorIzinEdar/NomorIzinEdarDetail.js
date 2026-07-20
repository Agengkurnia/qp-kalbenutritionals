"use strict";

// Ensure LOV global variable exists (fallback if GlobalScript.js not loaded yet)
if (typeof LOV === 'undefined') {
    var LOV;
}

// Ensure clsGlobal exists
var clsGlobal = new clsGlobalClass();

// Helper function to get Anti-Forgery Token
const getAntiForgeryToken = () => {
    return $('input[name=__RequestVerificationToken]').first().val();
};

//=======================
// NOMOR IZIN EDAR DETAIL OBJECT (Object Literal Pattern)
//=======================
var NomorIzinEdarDetail = {
    // Initialize the page
    Init: function() {
        console.log("NomorIzinEdarDetail.Init called");
        
        // Bind event listeners
        this.BindEvents();
        
        // Initialize LOV dependencies
        this.InitializeLOVDependencies();
        
        // Show success message if any
        if (typeof msgSuccess !== 'undefined' && msgSuccess && msgSuccess.trim() !== '') {
            clsGlobal.swalSuccess(msgSuccess);
        }
    },

    // Bind all event listeners
    BindEvents: function() {
        // Save button
        $('#btnSave').on('click', function(e) {
            e.preventDefault();
            NomorIzinEdarDetail.Save();
        });

        // LOV Event Listeners
        $('#btnSearchPackagingType').on('click', function(e) {
            e.preventDefault();
            // Packaging Type tidak tergantung apapun (independent) - menggunakan LOV PMCategory
            clsGlobal.generateLOV('LOV_PM_CATEGORY_NEW', 'PACKAGING_TYPE', '');
        });

        // Brand dan SubBrand tidak bisa di-search manual karena readonly dan auto-fill dari PMCategory
        // Button search tetap disabled
        $('#btnSearchBrand').on('click', function(e) {
            e.preventDefault();
            clsGlobal.swalWarning('Brand akan terisi otomatis setelah memilih Packaging Type.');
        });

        $('#btnSearchSubBrand').on('click', function(e) {
            e.preventDefault();
            clsGlobal.swalWarning('Sub Brand akan terisi otomatis setelah memilih Packaging Type.');
        });

        $('#btnSearchManufacturer').on('click', function(e) {
            e.preventDefault();
            clsGlobal.generateLOV('LOV_MANUFACTURER', 'Manufacturer', '');
        });

        // Task 5: LOV Reference Nomor Izin Edar
        $('#btnSearchReference').on('click', function(e) {
            e.preventDefault();
            clsGlobal.generateLOV('NOMOR_IZIN_EDAR', 'Reference', '');
        });

        // Task 1 & 3: File Management Events (Accordion-based, no modal)
        // Load files when accordion is opened
        $('#collapseNieFiles').on('show.bs.collapse', function() {
            const nieId = $('#TxtId').val();
            if (nieId && nieId.trim() !== '') {
                NomorIzinEdarDetail.LoadNieFiles(nieId);
            }
        });

        $('#btnSaveNieFile').on('click', function(e) {
            e.preventDefault();
            NomorIzinEdarDetail.UploadNieFile();
        });

        // Event delegation for delete and preview buttons in table
        $(document).on('click', '#tblNieFiles .btn-delete-nie-file', function() {
            const fileTxtId = $(this).data('file-txt-id');
            if (fileTxtId) {
                NomorIzinEdarDetail.DeleteNieFile(fileTxtId);
            }
        });

        $(document).on('click', '#tblNieFiles .btn-preview-nie-file', function() {
            const filePath = $(this).data('file-path');
            const fileName = $(this).data('file-name') || '';
            if (filePath) {
                NomorIzinEdarDetail.ShowPreviewNieFileModal(filePath, fileName);
            }
        });
    },

    // Initialize LOV dependencies (disable/enable based on parent selection)
    InitializeLOVDependencies: function() {
        // Packaging Type tidak tergantung apapun (always enabled)
        $('#btnSearchPackagingType').prop('disabled', false);

        // Brand tergantung pada Packaging Type - disable Brand if Packaging Type is empty
        const packagingTypeValue = $('#PackagingType').val() || '';
        if (packagingTypeValue.trim() === '') {
            $('#btnSearchBrand').prop('disabled', true);
            $('#Brand').val('');
            $('#SubBrand').val('');
        } else {
            $('#btnSearchBrand').prop('disabled', false);
        }

        // Brand and SubBrand are readonly, buttons remain disabled
        $('#btnSearchBrand').prop('disabled', true);
        $('#btnSearchSubBrand').prop('disabled', true);
    },

    // Enable Brand search after Packaging Type is selected (not used anymore, kept for compatibility)
    EnableBrandSearch: function() {
        // Brand is readonly, so this is not used
        $('#btnSearchBrand').prop('disabled', true);
    },

    // Enable SubBrand search after Brand is selected (not used anymore, kept for compatibility)
    EnableSubBrandSearch: function() {
        // SubBrand is readonly, so this is not used
        $('#btnSearchSubBrand').prop('disabled', true);
    },

    // Load Brand and SubBrand from PMCategory
    LoadBrandSubBrandFromPMCategory: function(pmCategoryCode, subBrandCode = null) {
        if (!pmCategoryCode || pmCategoryCode.trim() === '') {
            return;
        }

        clsGlobal.showLoading();

        // Build request data with optional subBrandCode
        const requestData = {
            __RequestVerificationToken: getAntiForgeryToken(),
            pmCategoryCode: pmCategoryCode
        };

        // Add subBrandCode if provided for more accurate result
        if (subBrandCode && subBrandCode.trim() !== '') {
            requestData.subBrandCode = subBrandCode;
        }

        $.ajax({
            type: 'POST',
            url: base_path + '/Master/NomorIzinEdar/GetBrandSubBrandByPMCategory',
            data: requestData,
            success: (response) => {
                clsGlobal.hideLoading();
                
                if (response && response.bitSuccess && response.objData) {
                    const data = response.objData;
                    
                    // Auto-fill Brand (readonly field)
                    if (data.brand && data.brand.trim() !== '') {
                        $('#Brand').val(data.brand);
                    } else {
                        $('#Brand').val('');
                    }
                    
                    // Auto-fill SubBrand (readonly field)
                    if (data.subBrand && data.subBrand.trim() !== '') {
                        $('#SubBrand').val(data.subBrand);
                    } else {
                        $('#SubBrand').val('');
                    }
                    
                    // Ensure buttons remain disabled (readonly fields)
                    NomorIzinEdarDetail.EnableBrandSearch();
                    NomorIzinEdarDetail.EnableSubBrandSearch();
                } else {
                    const errorMsg = response?.txtMessage || 'Gagal memuat Brand dan SubBrand dari PM Category';
                    console.warn(errorMsg);
                    // Don't show error, just clear fields
                    $('#Brand').val('');
                    $('#SubBrand').val('');
                    // Ensure buttons remain disabled
                    NomorIzinEdarDetail.EnableBrandSearch();
                    NomorIzinEdarDetail.EnableSubBrandSearch();
                }
            },
            error: (xhr, status, error) => {
                clsGlobal.hideLoading();
                console.error('Error loading Brand and SubBrand:', error);
                // Don't show error, just clear fields
                $('#Brand').val('');
                $('#SubBrand').val('');
                // Ensure buttons remain disabled
                NomorIzinEdarDetail.EnableBrandSearch();
                NomorIzinEdarDetail.EnableSubBrandSearch();
            }
        });
    },

    // Validate all required fields
    Validate: function() {
        const requiredFields = [
            { id: '#PackagingType', name: 'Packaging Type' },
            { id: '#Brand', name: 'Brand' },
            { id: '#SubBrand', name: 'Sub Brand' },
            { id: '#NamaJenis', name: 'Nama Jenis' },
            { id: '#Varian', name: 'Varian' },
            { id: '#Manufacturer', name: 'Manufacturer' },
            { id: '#NomorIzinEdar', name: 'Nomor Izin Edar' },
            { id: '#TanggalTerbit', name: 'Tanggal Terbit' },
            { id: '#TanggalBerakhir', name: 'Tanggal Berakhir' }
        ];

        const emptyFields = [];
        requiredFields.forEach(function(field) {
            const value = $(field.id).val();
            if (!value || value.trim() === '') {
                emptyFields.push(field.name);
            }
        });

        if (emptyFields.length > 0) {
            clsGlobal.swalWarning("Mohon lengkapi semua data wajib: " + emptyFields.join(', '));
            return false;
        }

        // Task 5: Validate dates
        const tanggalTerbitStr = $('#TanggalTerbit').val();
        const tanggalBerakhirStr = $('#TanggalBerakhir').val();

        if (tanggalTerbitStr && tanggalBerakhirStr) {
            const tanggalTerbit = new Date(tanggalTerbitStr);
            const tanggalBerakhir = new Date(tanggalBerakhirStr);

            if (tanggalBerakhir <= tanggalTerbit) {
                clsGlobal.swalWarning("Tanggal Berakhir harus lebih besar dari Tanggal Terbit.");
                return false;
            }
        }

        return true;
    },

    // Build save payload
    BuildSavePayload: function() {
        const txtId = $('#TxtId').val() || '';
        const isEditMode = txtId && txtId.trim() !== '';

        return {
            Id: isEditMode ? $('#Id').val() : 0,
            TxtId: txtId,
            Brand: $('#Brand').val() || '',
            SubBrand: $('#SubBrand').val() || '',
            NamaJenis: $('#NamaJenis').val() || '',
            Varian: $('#Varian').val() || '',
            PackagingType: $('#PackagingType').val() || '',
            Manufacturer: $('#Manufacturer').val() || '',
            NomorIzinEdar: $('#NomorIzinEdar').val() || '',
            AlamatPabrik: $('#AlamatPabrik').val() || '',
            TanggalTerbit: $('#TanggalTerbit').val() || null,
            TanggalBerakhir: $('#TanggalBerakhir').val() || null,
            Active: $('#Active').is(':checked'),
            ReferenceId: $('#ReferenceId').val() || '',
            ReferenceNumber: $('#ReferenceNumber').val() || ''
        };
    },

    // Save data
    Save: function() {
        console.log("NomorIzinEdarDetail.Save called");

        // Task 5: Validate before save
        if (!this.Validate()) {
            return;
        }

        const payload = this.BuildSavePayload();
        console.log("Save payload:", payload);

        clsGlobal.showLoading();

        $.ajax({
            url: base_path + '/Master/NomorIzinEdar/Save',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(payload),
            headers: {
                'RequestVerificationToken': getAntiForgeryToken()
            },
            success: function(response) {
                clsGlobal.hideLoading();

                if (response && response.bitSuccess) {
                    clsGlobal.swalSuccess("Data berhasil disimpan")
                        .then(() => {
                            // Task 2: Always redirect to Index after save (both Create and Edit)
                            // Optional: Clear localStorage if needed
                            if (typeof localStorage !== 'undefined') {
                                localStorage.removeItem('TempNieData');
                            }
                            
                            // Redirect to Index page
                            window.location.href = base_path + '/Master/NomorIzinEdar/Index';
                        });
                } else {
                    const errorMsg = response?.txtMessage || "Gagal menyimpan data";
                    clsGlobal.swalError(errorMsg);
                }
            },
            error: function(xhr, status, error) {
                clsGlobal.hideLoading();

                if (xhr.responseText && xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                } else {
                    let errorMsg = "Terjadi kesalahan saat menyimpan data";
                    try {
                        const errorResponse = JSON.parse(xhr.responseText);
                        if (errorResponse && errorResponse.txtMessage) {
                            errorMsg = errorResponse.txtMessage;
                        }
                    } catch (e) {
                        // Use default error message
                    }
                    clsGlobal.swalError(errorMsg);
                }
            }
        });
    },

    // Go back to index
    GoBack: function() {
        window.location.href = base_path + '/Master/NomorIzinEdar/Index';
    },

    // Task 2 & 3: Load NIE Files (Fixed JSON parsing and rendering)
    LoadNieFiles: function(nieId) {
        const tbody = $('#tblNieFiles tbody');
        tbody.html('<tr><td colspan="5" class="text-center text-muted">Memuat data...</td></tr>');

        if (!nieId || nieId.trim() === '') {
            tbody.html('<tr><td colspan="5" class="text-center text-muted">Data belum disimpan. Silakan simpan data terlebih dahulu.</td></tr>');
            return;
        }

        $.ajax({
            type: 'POST',
            url: base_path + '/Master/NomorIzinEdar/GetFiles',
            data: {
                __RequestVerificationToken: getAntiForgeryToken(),
                nieId: nieId
            }
        }).done(function(response) {
            tbody.empty();
            console.log('GetFiles response:', response);

            // Task 2: Fix JSON parsing - Backend returns { bitSuccess, objData, ... }
            if (response && response.bitSuccess) {
                let files = [];
                
                // Handle different response formats
                if (response.objData) {
                    files = Array.isArray(response.objData) ? response.objData : [response.objData];
                } else if (Array.isArray(response)) {
                    files = response;
                } else if (response.data) {
                    files = Array.isArray(response.data) ? response.data : [response.data];
                }
                
                console.log('Parsed files:', files);
                
                if (files.length > 0) {
                    files.forEach(function(file, index) {
                        const row = NomorIzinEdarDetail.GetNieFileRow(file, index + 1);
                        tbody.append(row);
                    });
                    
                    // Initialize tooltips after rendering
                    setTimeout(function() {
                        $('#tblNieFiles [data-bs-toggle="tooltip"]').tooltip();
                    }, 100);
                } else {
                    tbody.append('<tr><td colspan="5" class="text-center text-muted">Tidak ada file</td></tr>');
                }
            } else {
                const errorMsg = response?.txtMessage || 'Gagal memuat data file';
                tbody.append('<tr><td colspan="5" class="text-center text-danger">' + errorMsg + '</td></tr>');
                console.error('GetFiles error response:', response);
            }
        }).fail(function(xhr) {
            tbody.empty();
            let errorMsg = 'Gagal memuat data file';
            try {
                const errorResponse = JSON.parse(xhr.responseText);
                errorMsg = errorResponse?.txtMessage || errorResponse?.message || errorMsg;
            } catch (e) {
                errorMsg = xhr.responseText || errorMsg;
            }
            tbody.append('<tr><td colspan="5" class="text-center text-danger">' + errorMsg + '</td></tr>');
            console.error('Failed to load NIE files:', xhr.responseText);
        });
    },

    // Task 2: Generate File Row HTML (Fixed data mapping and buttons)
    GetNieFileRow: function(file, index) {
        // Task 2: Fix data mapping - ensure we get correct properties
        const fileName = file.FileNameAlias || file.fileNameAlias || (file.FilePath ? file.FilePath.split('/').pop() : '') || 'Unknown';
        const uploadDate = file.CreatedDate ? this.FormatDate(new Date(file.CreatedDate)) : (file.createdDate ? this.FormatDate(new Date(file.createdDate)) : '-');
        const uploadBy = file.CreatedBy || file.createdBy || '-';
        const filePath = file.FilePath || file.filePath || '';
        const fileTxtId = file.TxtId || file.txtId || file.Id || file.id || '';

        // Task 2: Ensure filePath is absolute URL for download
        const downloadUrl = filePath ? (filePath.startsWith('http') ? filePath : (filePath.startsWith('/') ? filePath : '/' + filePath)) : '';

        return `
            <tr data-file-id="${this.HtmlEncode(fileTxtId)}">
                <td>${index}</td>
                <td>${this.HtmlEncode(fileName)}</td>
                <td>${uploadDate}</td>
                <td>${this.HtmlEncode(uploadBy)}</td>
                <td class="text-center">
                    <button type="button" 
                            class="btn btn-icon btn-success btn-sm btn-preview-nie-file" 
                            data-file-path="${this.HtmlEncode(filePath)}"
                            data-file-name="${this.HtmlEncode(fileName)}"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Pratinjau File">
                        <i class="ti ti-eye"></i>
                    </button>
                    <a href="${this.HtmlEncode(downloadUrl)}" 
                       class="btn btn-icon btn-primary btn-sm" 
                       target="_blank"
                       download="${this.HtmlEncode(fileName)}"
                       data-bs-toggle="tooltip"
                       data-bs-placement="top"
                       title="Download File">
                        <i class="ti ti-download"></i>
                    </a>
                    <button type="button" 
                            class="btn btn-icon btn-danger btn-sm btn-delete-nie-file" 
                            data-file-txt-id="${this.HtmlEncode(fileTxtId)}"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Hapus File">
                        <i class="ti ti-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    },

    // Task 2: Format date helper
    FormatDate: function(date) {
        if (!date || isNaN(date.getTime())) return '-';
        try {
            return date.toLocaleDateString('id-ID', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch (e) {
            return date.toISOString().split('T')[0];
        }
    },

    // Task 5: HtmlEncode helper
    HtmlEncode: function(value) {
        if (!value) return '';
        const div = document.createElement('div');
        div.textContent = value;
        return div.innerHTML;
    },

    // Task 3: Upload NIE File (Fixed - no modal, direct refresh)
    UploadNieFile: function() {
        const fileInput = $('#nieInputFile')[0];
        const nieId = $('#TxtId').val();

        if (!nieId || nieId.trim() === '') {
            clsGlobal.swalWarning('Data Nomor Izin Edar belum disimpan. Silakan simpan data terlebih dahulu.');
            return;
        }

        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            clsGlobal.swalWarning('Silakan pilih file terlebih dahulu.');
            return;
        }

        const file = fileInput.files[0];
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            clsGlobal.swalWarning('Ukuran file maksimal 5MB.');
            return;
        }

        // Task 2: Validate file extension
        const allowedExtensions = ['pdf', 'xlsx', 'xls', 'doc', 'docx', 'jpg', 'jpeg', 'png'];
        const fileName = file.name.toLowerCase();
        const fileExtension = fileName.split('.').pop();
        
        if (!allowedExtensions.includes(fileExtension)) {
            clsGlobal.swalWarning('Format file tidak didukung. Format yang diizinkan: PDF, XLSX, XLS, DOC, DOCX, JPG, JPEG, PNG.');
            return;
        }

        const formData = new FormData();
        formData.append('__RequestVerificationToken', getAntiForgeryToken());
        formData.append('nieId', nieId);
        formData.append('file', file);
        formData.append('originalFileName', file.name);

        clsGlobal.showLoading();

        $.ajax({
            type: 'POST',
            url: base_path + '/Master/NomorIzinEdar/UploadFile',
            data: formData,
            processData: false,
            contentType: false
        }).done(function(response) {
            clsGlobal.hideLoading();
            console.log('UploadFile response:', response);

            // Task 2: Fix response parsing
            if (response && response.bitSuccess) {
                clsGlobal.swalSuccess('File berhasil diupload.');
                $('#nieInputFile').val('');
                // Task 3: Direct refresh table (no modal)
                NomorIzinEdarDetail.LoadNieFiles(nieId);
            } else {
                const errorMsg = response?.txtMessage || response?.message || 'Gagal mengunggah file.';
                clsGlobal.swalError(errorMsg);
            }
        }).fail(function(xhr) {
            clsGlobal.hideLoading();
            let errorMsg = 'Terjadi kesalahan saat mengunggah file.';
            try {
                const errorResponse = JSON.parse(xhr.responseText);
                errorMsg = errorResponse?.txtMessage || errorResponse?.message || errorMsg;
            } catch (e) {
                console.error('Error parsing response:', e);
            }
            clsGlobal.swalError(errorMsg);
        });
    },

    // Task 4: Delete NIE File (Fixed - only Yes/No buttons, no Deny)
    DeleteNieFile: function(fileTxtId) {
        if (!fileTxtId) {
            clsGlobal.swalWarning('ID file tidak ditemukan.');
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
        }).then((result) => {
            if (!result.isConfirmed) {
                return;
            }

            clsGlobal.showLoading();

            $.ajax({
                type: 'POST',
                url: base_path + '/Master/NomorIzinEdar/DeleteFile',
                data: {
                    __RequestVerificationToken: getAntiForgeryToken(),
                    fileTxtId: fileTxtId
                }
            }).done(function(response) {
                clsGlobal.hideLoading();
                console.log('DeleteFile response:', response);

                // Task 2: Fix response parsing
                if (response && response.bitSuccess) {
                    clsGlobal.swalSuccess('File berhasil dihapus.');
                    // Task 3: Direct refresh table (no modal)
                    const nieId = $('#TxtId').val();
                    if (nieId) {
                        NomorIzinEdarDetail.LoadNieFiles(nieId);
                    }
                } else {
                    const errorMsg = response?.txtMessage || response?.message || 'Gagal menghapus file.';
                    clsGlobal.swalError(errorMsg);
                }
            }).fail(function(xhr) {
                clsGlobal.hideLoading();
                let errorMsg = 'Terjadi kesalahan saat menghapus file.';
                try {
                    const errorResponse = JSON.parse(xhr.responseText);
                    errorMsg = errorResponse?.txtMessage || errorResponse?.message || errorMsg;
                } catch (e) {
                    console.error('Error parsing response:', e);
                }
                clsGlobal.swalError(errorMsg);
            });
        });
    },

    // Task 3: Show Preview NIE File Modal (Fixed preview logic)
    ShowPreviewNieFileModal: function(filePath, fileName) {
        if (!filePath) {
            clsGlobal.swalWarning('Path file tidak ditemukan.');
            return;
        }

        const $previewContainer = $('#modalShowNieFilePreview');
        $previewContainer.empty();

        // Update modal title
        if (fileName) {
            $('#ShowPreviewNieFileModalLabel').text(`Pratinjau File - ${this.HtmlEncode(fileName)}`);
        } else {
            $('#ShowPreviewNieFileModalLabel').text('Pratinjau File');
        }

        // Ensure filePath is absolute URL
        let absoluteFilePath = filePath;
        if (!filePath.startsWith('http://') && !filePath.startsWith('https://')) {
            // If it's a relative path, make it absolute
            if (filePath.startsWith('/')) {
                // Already starts with /, just prepend base URL if available
                if (typeof base_path !== 'undefined' && base_path) {
                    const baseUrl = base_path.replace(/\/+$/, '');
                    absoluteFilePath = baseUrl + filePath;
                } else {
                    absoluteFilePath = filePath;
                }
            } else {
                // Relative path without leading /
                if (typeof base_path !== 'undefined' && base_path) {
                    const baseUrl = base_path.replace(/\/+$/, '');
                    absoluteFilePath = baseUrl + '/' + filePath;
                } else {
                    absoluteFilePath = '/' + filePath;
                }
            }
        }

        const fileExtension = filePath.split('.').pop().toLowerCase();
        let $previewElement;

        switch (fileExtension) {
            case 'jpg':
            case 'jpeg':
            case 'png':
                // Task 3: Render gambar menggunakan tag <img> dengan error handling
                $previewElement = $(`
                    <div class="text-center">
                        <img src="${this.HtmlEncode(absoluteFilePath)}" 
                             style="max-width:100%; height:auto; border:1px solid #ddd; border-radius:4px;" 
                             alt="Preview"
                             class="img-fluid"
                             onerror="this.onerror=null; this.src=''; this.parentElement.innerHTML='<div class=\\'alert alert-warning\\'>Gagal memuat gambar. Silakan coba download file.</div>'">
                    </div>
                `);
                break;
            case 'pdf':
                // Task 3: Render PDF menggunakan <iframe> dengan absolute URL
                $previewElement = $(`
                    <iframe 
                        src="${this.HtmlEncode(absoluteFilePath)}" 
                        style="width:100%; height:600px; border:1px solid #ddd; border-radius:4px;" 
                        frameborder="0">
                    </iframe>
                `);
                break;
            case 'doc':
            case 'docx':
                // Task 3: Render Word document menggunakan Google Docs Viewer
                const encodedWordUrl = encodeURIComponent(absoluteFilePath);
                $previewElement = $(`
                    <div>
                        <div class="alert alert-info mb-2">
                            <small><i class="ti ti-info-circle me-1"></i>Preview dokumen Word menggunakan Google Docs Viewer. Jika preview tidak muncul, silakan download file.</small>
                        </div>
                        <iframe 
                            src="https://docs.google.com/viewer?url=${encodedWordUrl}&embedded=true" 
                            style="width:100%; height:600px; border:1px solid #ddd; border-radius:4px;" 
                            frameborder="0">
                        </iframe>
                        <div class="text-center mt-2">
                            <a href="${this.HtmlEncode(absoluteFilePath)}" class="btn btn-primary btn-sm" target="_blank" download="${this.HtmlEncode(fileName || 'file.' + fileExtension)}">
                                <i class="ti ti-download me-1"></i>Download File
                            </a>
                        </div>
                    </div>
                `);
                break;
            case 'xls':
            case 'xlsx':
                // Task 3: Render Excel document menggunakan Google Docs Viewer
                const encodedExcelUrl = encodeURIComponent(absoluteFilePath);
                $previewElement = $(`
                    <div>
                        <div class="alert alert-info mb-2">
                            <small><i class="ti ti-info-circle me-1"></i>Preview dokumen Excel menggunakan Google Docs Viewer. Jika preview tidak muncul, silakan download file.</small>
                        </div>
                        <iframe 
                            src="https://docs.google.com/viewer?url=${encodedExcelUrl}&embedded=true" 
                            style="width:100%; height:600px; border:1px solid #ddd; border-radius:4px;" 
                            frameborder="0">
                        </iframe>
                        <div class="text-center mt-2">
                            <a href="${this.HtmlEncode(absoluteFilePath)}" class="btn btn-primary btn-sm" target="_blank" download="${this.HtmlEncode(fileName || 'file.' + fileExtension)}">
                                <i class="ti ti-download me-1"></i>Download File
                            </a>
                        </div>
                    </div>
                `);
                break;
            default:
                // Task 3: Format tidak didukung
                $previewElement = $(`
                    <div class="alert alert-warning text-center">
                        <h5 class="alert-heading">Format Tidak Didukung</h5>
                        <p>Format file tidak didukung untuk preview.</p>
                        <p class="mb-3">Silakan klik tombol Download untuk melihat file.</p>
                        <a href="${this.HtmlEncode(absoluteFilePath)}" class="btn btn-primary" target="_blank" download="${this.HtmlEncode(fileName || 'file')}">
                            <i class="ti ti-download me-1"></i>Download File
                        </a>
                    </div>
                `);
        }

        $previewContainer.append($previewElement);
        $('#ShowPreviewNieFileModal').modal('show');
    }
};

//=======================
// LOV CALLBACK HANDLER
//=======================
const previousSetChooseLOV = window.setChooseLOV;
window.setChooseLOV = function(txtValue) {
    const parts = (txtValue || '').split('|');

    // Handle PackagingType LOV (PM Category) - Independent, tidak tergantung apapun
    // Format dari LOV_PM_CATEGORY_NEW: txtColumn1 = PM Category Code, txtColumn2 = PM Category Name, txtColumn3 = SubBrand Code, txtColumn4 = SubBrand Name
    if (parts[0] === "PACKAGING_TYPE" || parts[0] === "LOV_PM_CATEGORY_NEW" || parts[0] === "PM_CATEGORY") {
        // txtColumn2 = PM Category Name (untuk display)
        const packagingTypeName = parts[2] || parts[1] || "";
        // txtColumn1 = PM Category Code (untuk filter Brand)
        const packagingTypeCode = parts[1] || "";
        // txtColumn3 = SubBrand Code (untuk filtering yang lebih akurat)
        const subBrandCode = parts[3] || "";
        
        $('#PackagingType').val(packagingTypeName);
        // Store PM Category Code in hidden field if needed for Brand filtering
        $('#PackagingTypeCode').val(packagingTypeCode);
        
        // Auto-fill Brand and SubBrand from PMCategory
        if (packagingTypeCode && packagingTypeCode.trim() !== '') {
            NomorIzinEdarDetail.LoadBrandSubBrandFromPMCategory(packagingTypeCode, subBrandCode);
        } else {
            // Clear Brand and SubBrand when Packaging Type changes
            $('#Brand').val('');
            $('#SubBrand').val('');
        }
        
        // Brand and SubBrand are readonly, buttons remain disabled
        NomorIzinEdarDetail.EnableBrandSearch();
        NomorIzinEdarDetail.EnableSubBrandSearch();

        if (typeof clsGlobal !== 'undefined' && typeof clsGlobal.closeLOV === 'function') {
            clsGlobal.closeLOV();
        } else if (typeof $.fancybox !== 'undefined' && typeof $.fancybox.close === 'function') {
            $.fancybox.close();
        }
        return;
    }

    // Handle Brand LOV - Dependent on Packaging Type
    if (parts[0] === "Brand" || parts[0] === "LOV_BRAND") {
        const brandName = parts[2] || parts[1] || ""; // txtColumn2 = Brand Name
        $('#Brand').val(brandName);
        
        // Clear SubBrand when Brand changes
        $('#SubBrand').val('');
        
        // Enable SubBrand search after Brand is selected
        NomorIzinEdarDetail.EnableSubBrandSearch();

        if (typeof clsGlobal !== 'undefined' && typeof clsGlobal.closeLOV === 'function') {
            clsGlobal.closeLOV();
        } else if (typeof $.fancybox !== 'undefined' && typeof $.fancybox.close === 'function') {
            $.fancybox.close();
        }
        return;
    }

    // Handle SubBrand LOV - Dependent on Brand
    if (parts[0] === "SubBrand" || parts[0] === "LOV_SUBBRAND") {
        const subBrandName = parts[3] || parts[2] || ""; // txtColumn3 = SubBrand Name
        $('#SubBrand').val(subBrandName);

        if (typeof clsGlobal !== 'undefined' && typeof clsGlobal.closeLOV === 'function') {
            clsGlobal.closeLOV();
        } else if (typeof $.fancybox !== 'undefined' && typeof $.fancybox.close === 'function') {
            $.fancybox.close();
        }
        return;
    }

    // Task 5: Handle Manufacturer LOV (Fixed - force reset AlamatPabrik)
    if (parts[0] === "Manufacturer" || parts[0] === "LOV_MANUFACTURER") {
        // Format callback: Manufacturer|txtColumn1|txtColumn2|txtColumn3|txtColumn4|txtColumn5|...
        // parts[0] = txtFunction (Manufacturer)
        // parts[1] = txtColumn1 (Id)
        // parts[2] = txtColumn2 (Manufacturer name)
        // parts[3] = txtColumn3 (Description)
        // parts[4] = txtColumn4 (IoCode)
        // parts[5] = txtColumn5 (Address - for auto-fill AlamatPabrik)
        const manufacturerName = parts[2] || ""; // txtColumn2 = Manufacturer
        const address = parts[5] || ""; // txtColumn5 = Address
        
        $('#Manufacturer').val(manufacturerName);
        
        // Task 5: Force reset AlamatPabrik - always set to new value (even if empty/null)
        // This ensures old address is cleared when switching to manufacturer without address
        $('#AlamatPabrik').val(address || '');

        if (typeof clsGlobal !== 'undefined' && typeof clsGlobal.closeLOV === 'function') {
            clsGlobal.closeLOV();
        } else if (typeof $.fancybox !== 'undefined' && typeof $.fancybox.close === 'function') {
            $.fancybox.close();
        }
        return;
    }

    // Task 5: Handle Reference Nomor Izin Edar LOV
    if (parts[0] === "Reference" || parts[0] === "NOMOR_IZIN_EDAR") {
        // Format callback dari LOVScript.js: txtFunction|txtColumn1|txtColumn2|...|txtColumn10|...
        // txtColumn1 = NomorIzinEdar (ReferenceNumber)
        // txtColumn10 = TxtId (ReferenceId)
        const referenceNumber = parts[1] || ""; // txtColumn1 = NomorIzinEdar
        const referenceId = parts[10] || ""; // txtColumn10 = TxtId
        
        $('#ReferenceId').val(referenceId);
        $('#ReferenceNumber').val(referenceNumber);

        if (typeof clsGlobal !== 'undefined' && typeof clsGlobal.closeLOV === 'function') {
            clsGlobal.closeLOV();
        } else if (typeof $.fancybox !== 'undefined' && typeof $.fancybox.close === 'function') {
            $.fancybox.close();
        }
        return;
    }

    // Call previous handler if exists
    if (previousSetChooseLOV && typeof previousSetChooseLOV === 'function') {
        previousSetChooseLOV(txtValue);
    }
};

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function() {
    NomorIzinEdarDetail.Init();
});

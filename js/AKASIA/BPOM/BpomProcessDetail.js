"use strict";
//var clsGlobal = new clsGlobalClass();
var currentDocData = null;
let currentPreviewBlobUrls = [];
let bpomFiles = []; 
let existingFiles = [];
//let configUploadNameCache = null;
//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    //$("#fileDocBpom").on("change", function (e) {
    //    e.preventDefault();

    //    const MAX_SIZE = 5 * 1024 * 1024;
    //    const selectedFiles = Array.from(e.target.files);
    //    const validFiles = [];

    //    selectedFiles.forEach(file => {
    //        if (file.size <= MAX_SIZE) {
    //            validFiles.push(file);
    //        } else {
    //            clsGlobal.swalWarning(`File "${file.name}" melebihi 5MB dan tidak dapat ditambahkan.`);
    //        }
    //    });

    //    if (validFiles.length > 0) {
    //        bpomFiles = bpomFiles.concat(validFiles);
    //    }

    //    const dt = new DataTransfer();
    //    validFiles.forEach(f => dt.items.add(f));
    //    document.getElementById("fileDocBpom").files = dt.files;

    //    BpomProcessDetail.GeneratePreviewUpload();

    //    $(this).val("");
    //});

    //$('#btnSaveUploadDocBpom').on('click', function (e) {
    //    e.preventDefault();

    //    if (bpomFiles.length === 0) {
    //        clsGlobal.swalWarning("Silahkan pilih file untuk diupload");
    //        return;
    //    }

    //    const formData = new FormData();
    //    bpomFiles.forEach(f => formData.append("fileDocBpom", f));
    //    existingFiles.forEach(x => {
    //        formData.append("existingFiles", JSON.stringify(x));
    //    });

    //    formData.append('DocDataBpom', $('#hdDocDataBpom').val());
    //    formData.append('__RequestVerificationToken', $('input[name=__RequestVerificationToken]').val());

    //    $.ajax({
    //        type: "POST",
    //        url: base_path + "/BPOMProcess/SaveUploadBpomDoc",
    //        data: formData,
    //        processData: false,
    //        contentType: false,
    //        beforeSend: function () {
    //            clsGlobal.showLoading();
    //        },
    //        //success: function (retDat, status, xhr) {
    //        //    clsGlobal.hideLoading();
    //        //    if (xhr.responseText.includes("!DOCTYPE html")) {
    //        //        clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
    //        //    }
    //        //    else {
    //        //        if (retDat.bitSuccess == true) {
    //        //            if (retDat.objData && retDat.objData.fileUploadId) {
    //        //                $('#hdDocDataBpom').val(JSON.stringify({
    //        //                    fileUploadId: retDat.objData.fileUploadId
    //        //                }));
    //        //            }
    //        //            clsGlobal.swalSuccess("File berhasil diupload");
    //        //            $('#UploadDocBpomModal').modal('hide');
    //        //            $('#formUploadDocBpom')[0].reset();
    //        //            BpomProcessDetail.EmptyPreview();

    //        //            // Refresh detail
    //        //            //var bpomId = $('#hdBpomHdrId').val();
    //        //            //
    //        //            const docs = [retDat.objData];
    //        //            BpomProcessDetail.BindDocuments(docs);
    //        //        }
    //        //        else {
    //        //            if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
    //        //                clsGlobal.swalWarning(retDat.objData);
    //        //            }
    //        //            else {
    //        //                clsGlobal.swalError(retDat.txtMessage);
    //        //            }
    //        //        }
    //        //    }
    //        //},
    //        success: function (retDat, status, xhr) {
    //            clsGlobal.hideLoading();
    //            if (xhr.responseText.includes("!DOCTYPE html")) {
    //                clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
    //                return;
    //            }

    //            if (retDat.bitSuccess == true) {
    //                // Update hdDocDataBpom hanya dengan fileUploadId
    //                if (retDat.objData && retDat.objData.fileUploadId) {
    //                    $('#hdDocDataBpom').val(JSON.stringify({
    //                        fileUploadId: retDat.objData.fileUploadId
    //                    }));
    //                }

    //                // ---- UPDATE existingFiles dari response (PENTING) ----
    //                existingFiles = [];
    //                if (retDat.objData && retDat.objData.filePath && retDat.objData.originalFileName) {
    //                    const arrPath = retDat.objData.filePath.split('|');
    //                    const arrName = retDat.objData.originalFileName.split('|');
    //                    for (let i = 0; i < arrPath.length; i++) {
    //                        existingFiles.push({
    //                            filePath: arrPath[i],
    //                            originalFileName: arrName[i] || ""
    //                        });
    //                    }
    //                }

    //                // Reset bpomFiles (file baru sudah di-save)
    //                bpomFiles = [];

    //                // Bind documents menggunakan return dari server (retDat.objData)
    //                const docs = [retDat.objData];
    //                BpomProcessDetail.BindDocuments(docs);

    //                // beri notifikasi lalu close modal & clear form preview
    //                clsGlobal.swalSuccess("File berhasil diupload");
    //                $('#UploadDocBpomModal').modal('hide');
    //                $('#formUploadDocBpom')[0].reset();
    //                //BpomProcessDetail.EmptyPreview();

    //                return;
    //            }
    //            else {
    //                if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
    //                    clsGlobal.swalWarning(retDat.objData);
    //                }
    //                else {
    //                    clsGlobal.swalError(retDat.txtMessage);
    //                }
    //            }
    //        },


    //        error: function (xhr, status, error) {
    //            clsGlobal.hideLoading();
    //            clsGlobal.swalError(xhr.responseText);
    //        }
    //    });
    //});
    //$(document).on('click', '.btn-delete-preview-doc', function ()  {
    //    const docId = $(this).data('doc-id');
    //    const filePath = $(this).data('file-path');
    //    if (!docId) {
    //        Swal.fire('Error!', 'ID dokumen tidak ditemukan.', 'error');
    //        return;
    //    }

    //    Swal.fire({
    //        title: 'Anda yakin?',
    //        text: 'File ini akan dihapus permanen.',
    //        icon: 'warning',
    //        showCancelButton: true,
    //        showDenyButton: false,
    //        showConfirmButton: true,
    //        confirmButtonText: 'Ya',
    //        cancelButtonText: 'Tidak',
    //        buttonsStyling: true,
    //        customClass: {
    //            confirmButton: 'btn btn-primary',
    //            cancelButton: 'btn btn-secondary'
    //        }
    //    }).then((result) => {
    //        if (!result.isConfirmed) {
    //            return;
    //        }

    //        $.ajax({
    //            type: 'POST',
    //            url: base_path + '/BPOMProcess/DeleteBpomDocument',
    //            data: {
    //                __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val(),
    //                docId: docId,
    //                filePath: filePath
    //            }
    //        })
    //            .done(function (response) {

    //                if (response && response.success) {
    //                    clsGlobal.swalSuccess('File berhasil dihapus.');

    //                    if (!response.filePath || response.filePath.trim() === "") {
    //                        existingFiles = [];
    //                    }
    //                    else {
    //                        existingFiles = [];
    //                        const newPaths = response.filePath.split('|').filter(p => p);
    //                        const newNames = (response.originalFileName || "").split('|').filter(p => p);

    //                        for (let i = 0; i < newPaths.length; i++) {
    //                            existingFiles.push({
    //                                filePath: newPaths[i],
    //                                originalFileName: newNames[i] || ""
    //                            });
    //                        }
    //                    }

    //                    console.log("Updated existingFiles:", existingFiles);
    //                    $('#modalShowFilePreviewBpom').empty();
    //                    $('#UploadDocBpomModal').modal('hide');

    //                    const bpomId = $('#hdBpomHdrId').val();
    //                    if (bpomId) {
    //                        BPOMProcessHeader.ShowDetail(bpomId);
    //                    }
    //                }

    //            })
    //            .fail(function () {
    //            Swal.fire('Error!', 'Terjadi kesalahan saat menghapus file.', 'error');
    //        });

    //    });
    //});

    //$(document).on('click', '.btn-download-preview-doc', function (e) {
    //    e.preventDefault();

    //    let filePath = $(this).data("file-path");

    //    if (!filePath || filePath === "") {
    //        toastr.error("File tidak ditemukan.");
    //        return;
    //    }

    //    const link = document.createElement("a");
    //    link.href = filePath;

    //    link.download = filePath.split('/').pop();

    //    document.body.appendChild(link);
    //    link.click();
    //    document.body.removeChild(link);
    //});

    $('#btnSave').on('click', function (e) {
        e.preventDefault();
        const BpomId = $('#hdBpomHdrId').val();
        BpomProcessDetail.SaveBpomData()
            .then(() => {
                clsGlobal.swalSuccess("Berhasil menyimpan data BPOM Process");
                if (BpomId) {
                    BPOMProcessHeader.ShowDetail(BpomId);
                }
            })
            .catch(() => {
                // Error message already handled in save function
            });
    });

    $('#btnSendEmail').on('click', function (e) {
        e.preventDefault();
        const statusBpom = $('#hdStatusBpom').val();
        const bpomId = $('#hdBpomHdrId').val();
        if (!bpomId) {
            clsGlobal.swalWarning("BPOM ID tidak ditemukan");
            return;
        }
        if (!statusBpom || statusBpom.toUpperCase() !== "BPOM-APPROVED") {
            clsGlobal.swalWarning("Email hanya dapat dikirim jika status adalah BPOM-Approved");
            return;
        }
        clsGlobal.showLoading();

        $.ajax({
            url: '/BPOMProcess/SendNotifEmail',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ bpomId: bpomId }),
            headers: {
                'RequestVerificationToken': getAntiForgeryToken()
            },
            success: function (response) {
                clsGlobal.hideLoading();

                if (response && response.bitSuccess) {
                    clsGlobal.swalSuccessWithoutAction("Email Notifikasi berhasil dikirim");

                } else {
                    const errorMsg = response?.txtMessage || "Gagal mengirim email notifikasi";
                    clsGlobal.swalError(errorMsg);
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.hideLoading();
                clsGlobal.swalError(xhr.responseText || "Terjadi kesalahan saat mengirim email notifikasi");
            }
        });
    });

    $('#btnApprove').on('click', function (e) {
        e.preventDefault();
        const BpomId = $('#hdBpomHdrId').val();
        BpomProcessDetail.ApproveBpomData()
            .then(() => {
                clsGlobal.swalSuccess("BPOM Process berhasil di approve");
                if (BpomId) {
                    BPOMProcessHeader.ShowDetail(BpomId);
                }
            })
            .catch(() => {
                // Error message already handled in save function
            });
    });
    $('#btnBack').on('click', function (e) {
        e.preventDefault();

        Swal.fire({
            title: "Yakin akan kembali?",
            icon: "warning",
            showCancelButton: true,
            showDenyButton: false,
            showConfirmButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak',
            buttonsStyling: true,
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-secondary'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                //window.location.reload();
                //BPOMProcessHeader.Init();
                window.location.href = '/AKASIA/BPOM';
            }
        });


    });
    $('#btnSearchNomorIzinEdar').on('click', function (e) {
        e.preventDefault();
        
        BpomProcessDetail.openNomorIzinEdarLov();
    });

    $('#ActualSubmit').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
        todayHighlight: true,
        daysOfWeekDisabled: [0, 6]
    });
    $('#ActualApproval').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
        todayHighlight: true,
        daysOfWeekDisabled: [0, 6]
    });


});
//=======================
// BPOM DETAIL OBJECT
//=======================
var BpomProcessDetail = {
    BindData: function (data, userRole) {
        try {
            if (!data) {
                console.error("Data is null or undefined");
                clsGlobal.swalError("Data tidak ditemukan");
                return;
            }
            debugger;
            if (data && data.Header) {
                var header = data.Header;
                const submitVal = header.ActualSubmit
                    ? moment(header.ActualSubmit).format('DD/MM/YYYY')
                    : '';

                const approveVal = header.ActualApproval
                    ? moment(header.ActualApproval).format('DD/MM/YYYY')
                    : '';

                $('#hdBpomHdrId').val(header.IdHeaderBpom || header.IdHeaderBpom || '');
                $('#idRegal').val(header.IdRegal || '');
                $('#currentRole').val(userRole || '');
                $('#NoRegist').val(header.NoRegist || '');
                $('#ProjectType').val(header.ProjectType || '');
                $('#ProjectNo').val(header.ProjectNo || '');
                $('#NoRegisRegal').val(header.NoRegisRegal || '');
                $('#Status').val(header.Status || ''); 
                $('#JenisRegist').val(header.JenisRegist || '');
                $('#TargetSubmit').val(header.TargetSubmit ? moment(header.TargetSubmit).format('DD/MM/YYYY') : '');
                $('#TargetApprove').val(header.TargetApproval ? moment(header.TargetApproval).format('DD/MM/YYYY') : '');
                //$('#ActualSubmit').val(header.ActualSubmit ? moment(header.ActualSubmit).format('DD/MM/YYYY') : '');
                //$('#ActualApproval').val(header.ActualApproval ? moment(header.ActualApproval).format('DD/MM/YYYY') : ''); 
                $('#ActualSubmit')
                    .val(submitVal)
                    .datepicker('update', submitVal);

                $('#ActualApproval')
                    .val(approveVal)
                    .datepicker('update', approveVal);
                $('#BESubmit').val(header.BeSubmit ? moment(header.BeSubmit).format('DD/MM/YYYY') : '');
                $('#BEApproval').val(header.BeApproval ? moment(header.BeApproval).format('DD/MM/YYYY') : '');
                $('#StatusSubmit').val(header.StatusSubmit || '');
                $('#FTRR').val(header.StatusFtrr || '');
                $('#dataBpomToggle').val(header.DataTambahan ? "true" : "false");
                $('#DurationWeek').val(header.DurasiBpomProses || 0.0);
                $('#NoIzinEdar').val(header.NoIjinEdar || '');
                $('#nomorIzinEdarId').val(header.NomorIzinEdarId || '');
                $('#ValidFrom').val(header.StartIjinEdar ? moment(header.StartIjinEdar).format('DD/MM/YYYY') : '');
                $('#ValidTo').val(header.EndIjinEdar ? moment(header.EndIjinEdar).format('DD/MM/YYYY') : '');
                $('#hdStatusBpom').val(header.Status || '');
                $('#Brand').val(header.Brand || '');
                $('#SubBrand').val(header.SubBrand || '');
                $('#KategoriPangan').val(header.KategoriPangan || '');
                $('#Varian').val(header.Varian || '');
                $('#NamaJenis').val(header.NamaJenis || '');
                $('#BeratBersih').val(header.BeratBersih || '');
                $('#PabrikProduksi').val(header.PabrikProduksi || '');
                $('#KemasanPrimer').val(header.KemasanPrimer || '');
                $('#AlamatPabrik').val(header.AlamatPabrik || '');
                // === DISABLE FORM SAAT STATUS BPOM-Approved ===
                if (header.Status === "BPOM-Approved") {
                    $('#FormBpomProcess input, #FormBpomProcess select, #FormBpomProcess textarea').prop('disabled', true);
                    $('#dataList input, #dataList select, #dataList textarea').prop('disabled', true);
                    $('#btnSave, #btnApprove, #addDataButton, #btnSearchNomorIzinEdar').prop('disabled', true);
                    //$('#fileDocBpom, #btnSaveUploadDocBpom').prop('disabled', true);
                }
            } else {
                console.warn("No Header data in response");
            }
            //if (data && data.Documents) {
            //    console.log("Binding documents:", data.Documents.length, "items");
            //    BpomProcessDetail.BindDocuments(data.Documents);
            //} else {
            //    console.warn("No Documents data in response");
            //}
            debugger;
            if (data && data.Details && data.Details.length > 0) {
                $('#dataBpomToggle').val("true");
                $('#dataBpomToggle').prop('disabled', true);
                $('#additionalDataContainer').show();

                const container = $('#dataList');
                container.empty();
                data.Details.forEach(function (item) {
                    const cardHtml = `
                        <div class="card mb-4" id="data-block-${item.NoTambahan}" data-id="${item.IdDetailBpom || ''}" data-existing="true">
                            <div class="card-body p-3">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h5 class="card-title mb-0">Tambahan Data ke-${item.NoTambahan}</h5>
                                </div>
                                <div id="collapse-${item.NoTambahan}" class="collapse show">
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <label class="form-label">Tanggal Terima Tambahan Data ke-${item.NoTambahan}</label>
                                            <input type="text" class="form-control tanggal-terima"
                                                   placeholder="dd/mm/yyyy"
                                                   value="${item.TglTerima ? moment(item.TglTerima).format('DD/MM/YYYY') : ''}">
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">Tanggal Respon Tambahan Data ke-${item.NoTambahan}</label>
                                            <input type="text" class="form-control tanggal-respon"
                                                   placeholder="dd/mm/yyyy"
                                                   value="${item.TglRespon ? moment(item.TglRespon).format('DD/MM/YYYY') : ''}">
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">Durasi Respon Tambahan Data ke-${item.NoTambahan} (Hari)</label>
                                            <input type="text" class="form-control durasi-respon" 
                                                   value="${item.DurasiRespon || 0}" disabled>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">Jenis Tambahan Data ke-${item.NoTambahan}</label>
                                            <select class="form-select jenis-tambahan-data" multiple data-loaded="true">
                                                <option value="Input" ${item.JenisTambahanData?.includes('Input') ? 'selected' : ''}>Input</option>
                                                <option value="Upload" ${item.JenisTambahanData?.includes('Upload') ? 'selected' : ''}>Upload</option>
                                                <option value="Label" ${item.JenisTambahanData?.includes('Label') ? 'selected' : ''}>Label</option>
                                                <option value="Lainnya" ${item.JenisTambahanData?.includes('Lainnya') ? 'selected' : ''}>Lainnya</option>
                                            </select>
                                        </div>
                                        <div class="col-12 mt-3 dynamic-fields"></div>
                                    </div>
                                </div>
                            </div>
                        </div>`;

                    const $card = $(cardHtml);
                    $card.data('itemData', {
                        Input: item.Input,
                        Upload: item.Upload,
                        Label: item.Label,
                        Lainnya: item.Lainnya
                    });
                    $('#dataList').append($card);
                    //let tanggalResponInput = $card.find(".tanggal-respon");

                    //if (item.TglTerima) {
                    //    tanggalResponInput.prop("disabled", false);
                    //    tanggalResponInput.attr(
                    //        "min",
                    //        moment(item.TglTerima).format('YYYY-MM-DD')
                    //    );
                    //} else {
                    //    tanggalResponInput.prop("disabled", true);
                    //    tanggalResponInput.val("");
                    //    tanggalResponInput.removeAttr("min");
                    //}
                    // init datepicker
                    $card.find('.tanggal-terima, .tanggal-respon').datepicker({
                        format: 'dd/mm/yyyy',
                        autoclose: true,
                        todayHighlight: true,
                        daysOfWeekDisabled: [0, 6]
                    });

                    // handle lock/unlock respon
                    const $tglTerima = $card.find('.tanggal-terima');
                    const $tglRespon = $card.find('.tanggal-respon');

                    if ($tglTerima.val()) {
                        // UNLOCK
                        $tglRespon.removeClass('is-locked');

                        $tglRespon.datepicker(
                            'setStartDate',
                            $tglTerima.val()
                        );
                    } else {
                        // LOCK
                        $tglRespon
                            .addClass('is-locked')
                            .val('');

                        $tglRespon.datepicker('setStartDate', null);
                    }
                    $(dataList).on('changeDate', '.tanggal-respon', function () {
                        let block = this.closest('.card');
                        let tTerima = block.querySelector('.tanggal-terima').value;
                        let tRespon = this.value;

                        if (tTerima && tRespon) {
                            const d1 = BpomProcessDetail.parseDMY(tTerima);
                            const d2 = BpomProcessDetail.parseDMY(tRespon);

                            if (d2 < d1) {
                                this.value = "";
                                clsGlobal.swalError("Tanggal Respon tidak boleh lebih kecil dari Tanggal Terima");
                                return;
                            }
                        }
                    });


                    BpomProcessDetail.generateDynamicFieldsExist($card.find('.jenis-tambahan-data')[0], $card.data('itemData'));
                });

                if (data.Header.Status === "BPOM-Approved") {
                    $('#dataList').find('input, select, textarea').prop('disabled', true);
                }
                BPOMAdditionalData.setCounter(data.Details.length);
                BpomProcessDetail.initSelect2?.();
            } else {
                $('#dataBpomToggle').val("false");
                $('#additionalDataContainer').hide();
            }
            if (data && data.StatusHistories) {
                BpomProcessDetail.BindStatusHistory(data.StatusHistories);
            } else {
                BpomProcessDetail.ClearStatusHistory();
            }

            // === ROLE-BASED ACCESS ===
            if (userRole !== "Administrator" && userRole !== "Regulatory Affairs") {
                $('#FormBpomProcess input, #FormBpomProcess select, #FormBpomProcess textarea').prop('disabled', true);
                $('#dataList input, #dataList select, #dataList textarea').prop('disabled', true);
                $('#btnSave, #btnApprove, #addDataButton, #btnSendEmail, #btnSearchNomorIzinEdar').prop('disabled', true);
                //$('#fileDocBpom, #btnSaveUploadDocBpom').prop('disabled', true);
            }
            // Render Workflow State Banner
            BpomProcessDetail.RenderWorkflowBanner(data);

        } catch (e) {
            console.error("Error in BindData:", e);
            clsGlobal.swalError("Error binding data: " + e.message);
        }
    },
    
    //BindDocuments: function (documents) {
    //    console.log("BindDocuments called with:", documents);
    //    existingFiles = documents ? [...documents] : [];
    //    const normalizeGuid = (value) => {
    //        if (!value) {
    //            return "00000000-0000-0000-0000-000000000000";
    //        }
    //        return value;
    //    };
    //    //
    //    var btn = $("#btnUploadDocBpom");
    //    // === CASE 1: BELUM ADA FILE SAMA SEKALI ===
    //    const doc = documents[0];
    //    if (doc.configUpload && doc.configUpload.UploadName) {
    //        configUploadNameCache = doc.configUpload.UploadName;
    //    }
    //    if (!documents || doc.filePath === null) {
    //        btn.removeClass("btn-outline-primary").addClass("btn-outline-success");
    //        btn.text("Upload");

    //        btn.off("click").on("click", function () {
    //            // docId = null karena belum ada data
    //            BpomProcessDetail.ShowUploadModal(normalizeGuid(doc.fileUploadId));
    //        });
            

    //        return;
    //    }

    //    // === CASE 2: SUDAH ADA FILE ===
    //    btn.removeClass("btn-outline-success").addClass("btn-outline-primary");
    //    btn.text("Preview");
       

    //    btn.off("click").on("click", function () {
    //        //var configName = doc.configUpload ? doc.configUpload.UploadName : 'N/A';
    //        var configName = configUploadNameCache || 'N/A';


    //        //BpomProcessDetail.ShowPreviewModal(doc.filePath, configName, doc.fileUploadId, doc.originalFileName);
    //        BpomProcessDetail.ShowPreviewModal(doc, configName);
    //    });
    //},
    //ShowUploadModal: function (docId, index) {
    //    currentDocData = {
    //        fileUploadId: docId,
    //        Index: index
    //    };

    //    $('#hdDocDataBpom').val(JSON.stringify({ fileUploadId: docId }));
    //    $('#UploadDocBpomModal').modal('show');
    //},
    //GeneratePreviewUpload: function () {
    //    const $previewContainer = $('#modalShowFilePreviewBpom');
    //    $previewContainer.show();

    //    if (currentPreviewBlobUrls.length > 0) {
    //        currentPreviewBlobUrls.forEach(url => URL.revokeObjectURL(url));
    //        currentPreviewBlobUrls = [];
    //    }

    //    const fileInput = document.getElementById('fileDocBpom');
    //    const files = fileInput.files;

    //    if (!files || files.length === 0) {
    //        return; 
    //    }

    //    $previewContainer.show();
    //    $previewContainer.append(`<h5>Pratinjau (${files.length} file):</h5>`);

    //    Array.from(files).forEach(file => {
    //        const fileName = file.name;
    //        const fileExtension = fileName.split('.').pop().toLowerCase();
    //        let $previewElement;

    //        const $fileWrapper = $(`
    //            <div class="file-preview-item mb-4 pb-3 border-bottom">
    //                <strong>${fileName}</strong>
    //            </div>
    //        `);

    //        switch (fileExtension) {
    //            case "pdf":
    //                const pdfBlobUrl = URL.createObjectURL(file);
    //                currentPreviewBlobUrls.push(pdfBlobUrl);

    //                $previewElement = $(`
    //                    <iframe 
    //                        src="${pdfBlobUrl}" 
    //                        style="width:100%; height:400px; border:1px solid #ddd; margin-top: 5px;" 
    //                        frameborder="0">
    //                    </iframe>
    //                `);
    //                $fileWrapper.append($previewElement);
    //                break;

    //            case "png":
    //            case "jpg":
    //            case "jpeg":
    //            case "gif":
    //            case "svg":
    //                const imgBlobUrl = URL.createObjectURL(file);
    //                currentPreviewBlobUrls.push(imgBlobUrl);
    //                $previewElement = $(`
    //                    <div class="preview-content" style="max-height: 400px; overflow: auto; margin-top: 5px;">
    //                        <img src="${imgBlobUrl}" style="max-width: 100%;" />
    //                    </div>
    //                `);
    //                $fileWrapper.append($previewElement);
    //                break;

    //            case "docx":
    //            case "xlsx":
    //                const reader = new FileReader();
    //                $previewElement = $('<div class="preview-content preview-box" style="height: 400px; overflow-y: auto; margin-top: 5px; border: 1px solid #ddd; padding: 10px;">Memproses pratinjau...</div>');
    //                $fileWrapper.append($previewElement);

    //                reader.onload = function (e) {
    //                    const fileData = e.target.result;
    //                    $previewElement.empty();

    //                    if (fileExtension === "docx") {
    //                        BpomProcessDetail.RenderDocx(fileData, $previewElement.get(0));
    //                    } else if (fileExtension === "xlsx") {
    //                        BpomProcessDetail.RenderXlsx(fileData, $previewElement.get(0));
    //                    }
    //                };

    //                reader.onerror = function () {
    //                    $previewElement.html('<p class="text-danger">Gagal membaca file.</p>');
    //                };

    //                reader.readAsArrayBuffer(file);
    //                break;

    //            default:
    //                $previewElement = $(`<p class="text-muted mt-2">Pratinjau untuk '.${fileExtension}' tidak didukung.</p>`);
    //                $fileWrapper.append($previewElement);
    //        }
    //        $previewContainer.append($fileWrapper);
    //    });
    //},
    //ShowPreviewModal: function (doc, documentName) {
    //    console.log("ShowPreviewModal called with:", doc.filePath);
    //    $('#modalShowFilePreviewBpom').empty();
    //    existingFiles = [];
    //    if (doc.filePath && doc.originalFileName) {
    //        const paths = doc.filePath.split('|');
    //        const names = doc.originalFileName.split('|');

    //        for (let i = 0; i < paths.length; i++) {
    //            existingFiles.push({
    //                filePath: paths[i],
    //                originalFileName: names[i] || ""
    //            });
    //        }
    //    }
    //    const userRole = $('#currentRole').val(); 
    //    const allowedRoles = ["Regulatory Affairs", "Administrator"];
    //    $('#hdDocDataBpom').val(JSON.stringify({ fileUploadId: doc.fileUploadId }));
    //    const filePathArray = doc.filePath.split('|').map(path => path.trim()).filter(path => path);
    //    const oriFilenameArray = doc.originalFileName.split('|').map(path => path.trim()).filter(path => path);

    //    if (filePathArray.length === 0) {
    //        clsGlobal.swalWarning("Tidak ada file untuk ditampilkan");
    //        return;
    //    }

    //    const $previewContainer = $('#modalShowFilePreviewBpom');
    //    $previewContainer.empty();

    //    if (documentName) {
    //        $('#UploadDocBpomModalLabel').text(`Pratinjau File - ${documentName}`);
    //    } else {
    //        $('#UploadDocBpomModalLabel').text('Pratinjau File');
    //    }

    //    $previewContainer.append(`<h5>Total ${filePathArray.length} file tersimpan:</h5>`);

    //    filePathArray.forEach((filePath, index) => {
    //        const fileName = oriFilenameArray[index] || filePath.split('/').pop();
    //        const fileExtension = fileName.split('.').pop().toLowerCase();

    //        let $previewElement;

    //        const $fileWrapper = $(`
    //        <div class="file-preview-item mb-4 pb-4 border-bottom">
    //            <strong>File ${index + 1}: ${fileName}</strong>
    //        </div>
    //        `);

    //        switch (fileExtension) {
    //            case "pdf":
    //                $previewElement = $(`
    //                <iframe
    //                    src="${filePath}"
    //                    style="width:100%; height:500px; border:1px solid #ddd; margin-top: 10px;"
    //                    frameborder="0">
    //                </iframe>
    //            `);
    //                break;

    //            case "png":
    //            case "jpg":
    //            case "jpeg":
    //            case "gif":
    //            case "svg":
    //                $previewElement = $(`
    //                <div class="preview-content" style="max-height: 500px; overflow: auto; margin-top: 10px; text-align: center;">
    //                    <img src="${filePath}" style="max-width: 100%; border: 1px solid #ddd;" />
    //                </div>
    //            `);
    //                break;

    //            case "docx":
    //                $previewElement = $('<div class="preview-content preview-box" style="height: 500px; overflow-y: auto; margin-top: 10px; border: 1px solid #ddd; padding: 10px;">Memuat pratinjau DOCX...</div>');
    //                BpomProcessDetail.RenderDocx(filePath, $previewElement.get(0));
    //                break;

    //            case "xlsx":
    //                $previewElement = $('<div class="preview-content preview-box" style="height: 500px; overflow-y: auto; margin-top: 10px; border: 1px solid #ddd; padding: 10px;">Memuat pratinjau Excel...</div>');
    //                BpomProcessDetail.RenderXlsx(filePath, $previewElement.get(0));
    //                break;

    //            default:
    //                $previewElement = $(`<p class="text-muted mt-2">Pratinjau untuk '.${fileExtension}' tidak didukung.</p>`);
    //        }

    //        $fileWrapper.append($previewElement);

    //        const actionWrapper = $(`
    //        <div class="mt-3 d-flex gap-2">
    //            <button type="button" class="btn btn-info btn-sm btn-download-preview-doc" data-file-path="${filePath}">
    //                <i class="ti ti-download me-1"></i>Download
    //            </button>

    //            <button type="button" class="btn btn-danger btn-sm btn-delete-preview-doc"
    //                    data-doc-id="${doc.fileUploadId || ''}" data-file-path="${filePath}">
    //                <i class="ti ti-trash me-1"></i>Delete
    //            </button>
    //        </div>
    //    `);
            
    //        if ($('#hdStatusBpom').val() === "BPOM-Approved") {
    //            actionWrapper.find('.btn-delete-preview-doc').prop('disabled', true);
    //        }
    //        if (!allowedRoles.includes(userRole)) {
    //            actionWrapper.find('.btn-delete-preview-doc').prop('disabled', true);
    //        }

    //        $fileWrapper.append(actionWrapper);
    //        $previewContainer.append($fileWrapper);
    //    });

    //    $('#UploadDocBpomModal').modal('show');
    //},
    initSelect2: function () {
        $('.jenis-tambahan-data').select2({
            placeholder: "Pilih jenis data...",
            closeOnSelect: true,
            allowClear: false, 
            width: '100%'
        });

        $('.jenis-tambahan-data').on('select2:select', function () {
            $(this).select2('close');
        });

        $('.jenis-tambahan-data').on('change', function () {
            BpomProcessDetail.generateDynamicFieldsExist(this);
        });
    },
    //generateDynamicFieldsExist: function (selectElement, itemData = {}) {

    //    const selectedValues = $(selectElement).val() || [];
    //    const dynamicContainer = $(selectElement).closest('.row').find('.dynamic-fields');
    //    let previousValues = {};
    //    dynamicContainer.find('.dynamic-field').each(function () {
    //        let type = $(this).data('type');  // "Input", "Upload", "Label", "Lainnya"
    //        previousValues[type] = $(this).val();
    //    });


    //    dynamicContainer.html('');

    //    if (selectedValues.length === 0) return;

    //    let rowHtml = '<div class="row">';

    //    selectedValues.forEach((val, idx) => {

    //        let fieldValue =
    //            previousValues[val] ??
    //            itemData[val] ??
    //            "";

    //        rowHtml += `
    //            <div class="col-md-6 mb-3">
    //                <label>${val} :</label>
    //                <input type="text"
    //                    class="form-control dynamic-field ${val.toLowerCase()}-field"
    //                    data-type="${val}"
    //                    value="${fieldValue}">

    //            </div>
    //        `;

    //        if ((idx + 1) % 2 === 0 && idx !== selectedValues.length - 1) {
    //            rowHtml += '</div><div class="row">';
    //        }
    //    });

    //    rowHtml += '</div>';
    //    dynamicContainer.html(rowHtml);
    //},
    generateDynamicFieldsExist: function (selectElement, itemData = {}) {

        const selectedValues = $(selectElement).val() || [];

        const dynamicContainer = $(selectElement)
            .closest('.row')
            .find('.dynamic-fields')
            .first();

        const fieldTemplates = {
            'Input': (val = '') => `
            <div class="col-md-6 mb-3 dynamic-item" data-type="Input">
                <label>Input :</label>
                <input type="text" class="form-control dynamic-field input-field" value="${val}">
            </div>`,

            'Upload': (val = '') => `
            <div class="col-md-6 mb-3 dynamic-item" data-type="Upload">
                <label>Upload :</label>
                <input type="text" class="form-control dynamic-field upload-field" value="${val}">
            </div>`,

            'Label': (val = '') => `
            <div class="col-md-6 mb-3 dynamic-item" data-type="Label">
                <label>Label :</label>
                <input type="text" class="form-control dynamic-field label-field" value="${val}">
            </div>`,

            'Lainnya': (val = '') => `
            <div class="col-md-6 mb-3 dynamic-item" data-type="Lainnya">
                <label>Lainnya :</label>
                <input type="text" class="form-control dynamic-field lainnya-field" value="${val}">
            </div>`
        };

        /* ============================
           REMOVE FIELD YANG UNSELECT
        ============================ */
        dynamicContainer.find('.dynamic-item').each(function () {
            const type = $(this).data('type');
            if (!selectedValues.includes(type)) {
                $(this).remove();
            }
        });

        /* ============================
           ADD FIELD BARU (TANPA RESET)
        ============================ */
        selectedValues.forEach(type => {
            if (dynamicContainer.find(`.dynamic-item[data-type="${type}"]`).length === 0) {

                const valueFromDb = itemData[type] ?? '';

                dynamicContainer.append(
                    $(fieldTemplates[type](valueFromDb))
                );
            }
        });

        /* ============================
           RE-LAYOUT (2 COLUMN)
        ============================ */
        const items = dynamicContainer.find('.dynamic-item').detach();
        dynamicContainer.html('');

        let row;
        items.each(function (index) {
            if (index % 2 === 0) {
                row = $('<div class="row"></div>');
                dynamicContainer.append(row);
            }
            row.append(this);
        });
    },
    ApproveBpomData: function () {
        return new Promise((resolve, reject) => {
            try {
                const bpomId = $('#hdBpomHdrId').val();
                const submit = $('#ActualSubmit').val();
                const approval = $('#ActualApproval').val();
                const nie = $('#nomorIzinEdarId').val();
                const status = $('#hdStatusBpom').val();
                
                if (!bpomId) {
                    clsGlobal.swalWarning("BPOM ID tidak ditemukan");
                    return;
                }
                if (!submit) {
                    clsGlobal.swalWarning("Actual Submit tidak boleh kosong");
                    return;
                }
                if (!approval) {
                    clsGlobal.swalWarning("Actual Approve tidak boleh kosong");
                    return;
                }
                if (!nie) {
                    clsGlobal.swalWarning("No Izin Edar tidak boleh kosong");
                    return;
                }
                if (status !== "BPOM-Inprocess") {
                    clsGlobal.swalWarning("Pastikan status BPOM adalah BPOM-Inprocess");
                    return;
                }

                if (!BpomProcessDetail.validationForm()) {
                    return;
                }


                Swal.fire({
                    title: 'Anda yakin?',
                    text: 'Setelah Approve, data tidak bisa di edit.',
                    icon: 'warning',
                    showCancelButton: true,
                    showDenyButton: false,
                    showConfirmButton: true,
                    confirmButtonText: 'Ya',
                    cancelButtonText: 'Tidak',
                    buttonsStyling: true,
                    customClass: {
                        confirmButton: 'btn btn-primary',
                        cancelButton: 'btn btn-secondary'
                    }
                }).then((result) => {
                    if (!result.isConfirmed) {
                        return;
                    }
                    const payload = BpomProcessDetail.buildBpomPayload();
                    $.ajax({
                        url: '/BPOMProcess/ApproveBpomData',
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(payload),
                        headers: {
                            'RequestVerificationToken': getAntiForgeryToken()
                        },
                        beforeSend: function () {
                            clsGlobal.showLoading("Approve data BPOM...");
                        },
                        success: function (res) {
                            if (res && res.bitSuccess) {
                                resolve(res.objData || res);
                            } else {
                                clsGlobal.swalError(res?.txtMessage || "Gagal Approve data.");
                                reject(res);
                            }
                        },
                        error: function (xhr, status, err) {
                            console.error("Error save BPOM:", err);
                            clsGlobal.swalError("Terjadi kesalahan saat approve data.");
                            reject(err);
                        },
                        complete: function () {
                            clsGlobal.hideLoading();
                        }
                    });
                });
            }
            catch (err) {
                clsGlobal.swalError("Catch : Terjadi kesalahan saat menyimpan data.");
                reject(err);
            }
        });
    },
    SaveBpomData: function () {
        return new Promise((resolve, reject) => {
            try {
               //validation field
                if (!BpomProcessDetail.validationForm()) {
                    return;
                }

                var payload = BpomProcessDetail.buildBpomPayload();
;

                var token = getAntiForgeryToken();

                $.ajax({
                    url: base_path + "/BPOMProcess/SaveBpomData",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(payload),
                    headers: { 'RequestVerificationToken': token },
                    beforeSend: function () {
                        clsGlobal.showLoading("Menyimpan data BPOM...");
                    },
                    success: function (res) {
                        if (res && res.bitSuccess) {
                            resolve(res.objData || res);
                        } else {
                            clsGlobal.swalError(res?.txtMessage || "Gagal menyimpan data.");
                            reject(res);
                        }
                    },
                    error: function (xhr, status, err) {
                        console.error("Error save BPOM:", err);
                        clsGlobal.swalError("Terjadi kesalahan saat menyimpan data.");
                        reject(err);
                    },
                    complete: function () {
                        clsGlobal.hideLoading();
                    }
                });

            } catch (err) {
                clsGlobal.swalError("Terjadi kesalahan saat menyimpan data.");
                reject(err);
            }
        });
    },
    buildBpomPayload: function () {
        debugger;
        const normalizeGuid = (value) =>
            value ? value : "00000000-0000-0000-0000-000000000000";

        /* HEADER */
        var hdr = {
            IdHeaderBpom: normalizeGuid($("#hdBpomHdrId").val()),
            NoRegist: $("#NoRegist").val(),
            IdRegal: $("#idRegal").val(),
            ProjectType: $("#ProjectType").val(),
            ProjectNo: $("#ProjectNo").val(),
            NoRegisRegal: $("#NoRegisRegal").val(),
            JenisRegist: $("#JenisRegist").val(),
            Status: $("#Status").val(),
            TargetSubmit: BpomProcessDetail.toIsoDate($("#TargetSubmit").val()) || null,
            TargetApproval: BpomProcessDetail.toIsoDate($("#TargetApprove").val()) || null,
            BESubmit: BpomProcessDetail.toIsoDate($("#BESubmit").val()) || null,
            BEApproval: BpomProcessDetail.toIsoDate($("#BEApproval").val()) || null,           
            ActualSubmit: BpomProcessDetail.toIsoDate($("#ActualSubmit").val()),
            ActualApproval: BpomProcessDetail.toIsoDate($("#ActualApproval").val()),
            StatusSubmit: $("#StatusSubmit").val(),
            DurasiBpomProses: $("#DurationWeek").val() || null,
            StatusFtrr: $("#FTRR").val() || "YES",
            NoIjinEdar: $("#NoIzinEdar").val(),
            NomorIzinEdarId: $("#nomorIzinEdarId").val(),
            StartIjinEdar: BpomProcessDetail.toIsoDate($("#ValidFrom").val()) || null,
            EndIjinEdar: BpomProcessDetail.toIsoDate($("#ValidTo").val()) || null,
            DataTambahan: $("#dataBpomToggle").val() || "false",
            Brand: $("#Brand").val() || null,
            SubBrand: $("#SubBrand").val() || null,
            KategoriPangan: $("#KategoriPangan").val() || null,
            Varian: $("#Varian").val() || null,
            NamaJenis: $("#NamaJenis").val() || null,
            BeratBersih: $("#BeratBersih").val() || null,
            PabrikProduksi: $("#PabrikProduksi").val() || null,
            KemasanPrimer: $("#KemasanPrimer").val() || null,
            AlamatPabrik: $("#AlamatPabrik").val() || null,
            Active: true
        };

        /* DETAILS */
        var details = [];
        $("#dataList").find(".card").each(function (index, card) {
            var $c = $(card);

            var jenisList = $c.find(".jenis-tambahan-data").val() || [];

            const safe = (v) => (v === "" || v === undefined ? null : v);
            const getDynamicValue = (container, type) => {
                const el = container.find(`.dynamic-item[data-type="${type}"] input`);
                return el.length ? safe(el.val()) : null;
            };

            const dynamicContainer = $c.find('.dynamic-fields');
            details.push({
                IdDetailBpom: normalizeGuid($c.data("id")),
                IdHeaderBpom: hdr.IdHeaderBpom,
                NoTambahan: index + 1,
                //TglTerima: safe($c.find('input[type="date"]').eq(0).val()),
                //TglRespon: safe($c.find('input[type="date"]').eq(1).val()),
                TglTerima: BpomProcessDetail.toIsoDate($c.find('.tanggal-terima').val()),
                TglRespon: BpomProcessDetail.toIsoDate($c.find('.tanggal-respon').val()),
                DurasiRespon: safe($c.find('.durasi-respon').val()),
                JenisTambahanData: jenisList.join(", "),
                Input: getDynamicValue(dynamicContainer, 'Input'),
                Upload: getDynamicValue(dynamicContainer, 'Upload'),
                Label: getDynamicValue(dynamicContainer, 'Label'),
                Lainnya: getDynamicValue(dynamicContainer, 'Lainnya'),
                Active: true
            });
        });

        return { Header: hdr, Details: details };
    },
    openNomorIzinEdarLov: function () {
        
        const brand = ($('#Brand').val() || '').trim();
        const subBrand = ($('#SubBrand').val() || '').trim();

        if (!brand || !subBrand) {
            clsGlobal.swalWarning('Lengkapi Brand dan Sub Brand terlebih dahulu sebelum mencari Nomor Izin Edar.');
            return;
        }

        const lovParams = JSON.stringify({
            Brand: brand,
            SubBrand: subBrand
        });

        clsGlobal.generateLOV('NOMOR_IZIN_EDAR', 'NoIzinEdar', lovParams);
    },
    BindStatusHistory: function (histories) {
        var table = $('#tblStatusHistory');
        if (!table.length) {
            return;
        }

        // Destroy existing DataTable if exists
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().destroy();
        }

        var tbody = table.find('tbody');
        tbody.empty();

        if (histories && histories.length > 0) {
            histories.forEach(function (item) {
                var row = BpomProcessDetail.getStatusHistoryRow(item);
                tbody.append(row);
            });
        } else {
            tbody.append(BpomProcessDetail.getEmptyTableRow('Belum ada history status', 4));
        }

        // Initialize DataTable
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

        // Destroy existing DataTable if exists
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().destroy();
        }

        var tbody = table.find('tbody');
        tbody.empty();
        tbody.append(BpomProcessDetail.getEmptyTableRow('Belum ada history status', 4));

        // Reinitialize DataTable
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
    getStatusHistoryRow: function (item) {

        var createdDateText = item.CreatedDate ? moment(item.CreatedDate).format('DD MMM YYYY, HH:mm') : '';
        var statusDescription = BpomProcessDetail.htmlEncode(item.StatusDescription || '');
        //var notesDescription = BpomProcessDetail.htmlEncode(item.Notes || '-');
        var creationDisplay = BpomProcessDetail.htmlEncode(item.CreationDisplay || '');
        // Extract username and role from CreationDisplay (format: "Username (Role)")
        var username = creationDisplay;
        var role = '';
        var match = creationDisplay.match(/^(.+?)\s*\((.+?)\)$/);
        if (match) {
            username = match[1].trim();
            role = match[2].trim();
        }
        // Determine status class for color coding
        var statusClass = 'status-revision';
        var statusLower = statusDescription.toLowerCase();
        if (statusLower.includes('inprocess')) statusClass = 'status-review';
        else if (statusLower.includes('approved')) statusClass = 'status-approved';

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

                    
                </div>
            </div>
        `;
        //var creationColumn = creationDisplay;
        //if (createdDateText) {
        //    creationColumn += `<div class="text-muted small">${createdDateText}</div>`;
        //}

        //return `
        //    <tr>
        //        <td>${item.No}</td>
        //        <td>${statusDescription}</td>
        //        <td>${notesDescription}</td>
        //        <td>${creationColumn}</td>
        //    </tr>
        //`;
    },
    htmlEncode: function (value) {
        return $('<div/>').text(value || '').html();
    },
    getEmptyTableRow: function (message, colspan) {
        return `<tr><td colspan="${colspan}" class="text-center text-muted">${message}</td></tr>`;
    },
    validationForm: function () {

        let isValid = true;
        let errorMessage = "";

        // =====================
        // VALIDASI TAMBAHAN DATA
        // =====================
        if ($('#dataBpomToggle').val() === "true") {

            $('#dataList .card').each(function () {

                const card = $(this);
                const blockName = card.find('.card-title').text().trim();

                const tglTerima = card.find('.tanggal-terima').val();
                const tglRespon = card.find('.tanggal-respon').val();
                const jenis = (card.find('.jenis-tambahan-data').select2('data') || [])
                    .map(x => x.id || x.text);

                if (!tglTerima) {
                    errorMessage = `${blockName} - Tanggal Terima wajib diisi`;
                    isValid = false;
                    return false; // break each
                }

                if (!tglRespon) {
                    errorMessage = `${blockName} - Tanggal Respon wajib diisi`;
                    isValid = false;
                    return false;
                }

                if (jenis.length === 0) {
                    errorMessage = `${blockName} - Jenis Tambahan Data wajib dipilih`;
                    isValid = false;
                    return false;
                }

                for (const j of jenis) {

                    if (j === "Input") {
                        let field = card.find('.dynamic-item[data-type="Input"] input');
                        let value = (field.val() || '').trim();

                        if (value === '') {
                            isValid = false;
                            errorMessage = `${blockName} - Input wajib diisi`;
                        //    isValid = false;
                            return false;
                        }
                    }

                    if (j === "Upload") {
                        //if (!card.find('.upload-field').val()?.trim()) {
                        //    errorMessage = `${blockName} - Upload wajib diisi`;
                        //    isValid = false;
                        //    return false;
                        //}
                        let field = card.find('.dynamic-item[data-type="Upload"] input');
                        let value = (field.val() || '').trim();

                        if (value === '') {
                            isValid = false;
                            errorMessage = `${blockName} - Upload wajib diisi`;
                            return false;
                        }
                    }

                    if (j === "Label") {
                        //if (!card.find('.label-field').val()?.trim()) {
                        //    errorMessage = `${blockName} - Label wajib diisi`;
                        //    isValid = false;
                        //    return false;
                        //}
                        let field = card.find('.dynamic-item[data-type="Label"] input');
                        let value = (field.val() || '').trim();

                        if (value === '') {
                            isValid = false;
                            errorMessage = `${blockName} - Label wajib diisi`;
                            return false;
                        }
                    }

                    if (j === "Lainnya") { 
                        //if (!card.find('.lainnya-field').val()?.trim()) {
                        //    errorMessage = `${blockName} - Lainnya wajib diisi`; 
                        //    isValid = false;
                        //    return false;
                        //}
                        let field = card.find('.dynamic-item[data-type="Lainnya"] input');
                        let value = (field.val() || '').trim();

                        if (value === '') {
                            isValid = false;
                            errorMessage = `${blockName} - Lainnya wajib diisi`;
                            return false;
                        }
                    }
                }

            });

            if (!isValid) {
                clsGlobal.swalWarning(errorMessage);
                return false;
            }
        }

        return true;
    }, 
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
    BindStatusHistory: function (histories) {
        //const Templates = RegalDetail.Templates;

        var timelineContainer = $('#statusHistoryTimeline');
        if (!timelineContainer.length) {
            return;
        }

        timelineContainer.empty();

        if (histories && histories.length > 0) {
            histories.forEach(function (item) {
                var timelineItem = BpomProcessDetail.getStatusHistoryRow(item);
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
    toIsoDate: function (dateStr) {
        if (!dateStr) return null;

        const parts = dateStr.split('/');
        if (parts.length !== 3) return null;

        const day = parts[0];
        const month = parts[1];
        const year = parts[2];

        return `${year}-${month}-${day}`; // yyyy-MM-dd
    },
    parseDMY: function (str) {
        const [d, m, y] = str.split('/');
        return new Date(y, m - 1, d);
    },
};
var getAntiForgeryToken = () => {
    return $('input[name=__RequestVerificationToken]').val(); 
};
if (typeof window !== 'undefined') {
    window.openNomorIzinEdarLov = function () {
        return BpomProcessDetail.openNomorIzinEdarLov();
    };
}

const previousSetChooseLOV = (typeof window !== 'undefined') ? window.setChooseLOV : null;
if (typeof window !== 'undefined') {
    window.setChooseLOV = function (txtValue) {
        console.log("BpomProcess: setChooseLOV called with:", txtValue);

        if (!txtValue) {
            console.warn("BpomProcess: setChooseLOV called with empty value");
            if (previousSetChooseLOV && typeof previousSetChooseLOV === 'function') {
                previousSetChooseLOV(txtValue);
            }
            return;
        }
        
        const parts = (txtValue || '').split('|');

        console.log("BpomProcess: Parsed parts:", parts, "LOV Type:", parts[0]);

        if (parts[0] === "NoIzinEdar") {
            console.log("BpomProcess: Handling NomorIzinEdar callback");
            const nomorIzinEdar = parts[1] || "";
            const tanggalTerbit = parts[8] || "";
            const tanggalBerakhir = parts[9] || "";
            const nomorIzinEdarId = parts[10] || "";

            console.log("BpomProcess: Setting NomorIzinEdar to:", nomorIzinEdar, "ID:", nomorIzinEdarId);
            $('#NoIzinEdar').val(nomorIzinEdar);
            $('#nomorIzinEdarId').val(nomorIzinEdarId);
            //$('#ValidFrom').val(tanggalTerbit);
            //$('#ValidTo').val(tanggalBerakhir);
            $('#ValidFrom').val(moment(tanggalTerbit, 'YYYY/MM/DD').format('DD/MM/YYYY'));
            $('#ValidTo').val(moment(tanggalBerakhir, 'YYYY/MM/DD').format('DD/MM/YYYY'));

            if (typeof clsGlobal !== 'undefined' && typeof clsGlobal.closeLOV === 'function') {
                clsGlobal.closeLOV();
            } else if (typeof $.fancybox !== 'undefined' && typeof $.fancybox.close === 'function') {
                $.fancybox.close();
            }
            return;
        }
        console.log("BpomProcess: No handler found for LOV type:", parts[0], "- calling previous handler");
        if (previousSetChooseLOV && typeof previousSetChooseLOV === 'function') {
            previousSetChooseLOV(txtValue);
        } else {
            console.warn("BpomProcess: No previous handler found for LOV type:", parts[0]);
        }
    };
}
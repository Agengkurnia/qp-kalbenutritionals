"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var bitLoading = false;
let oTableUploadFile;
let oTableUploadIngFile;
let oTableBtpHeader;
let oTableBtpDetail;
let oTableKlaimTambahan;
let oTableIngDetail;
let oTableHistoricalForm;
let lovId;
var Data = {};
var SelectRow = {};
let currentPreviewBlobUrls = [];
let isGenerated = false;
let isSubmitedVerfor = false;
let isSubmitedING = false;
//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    $(".select2").select2({
        width: "100%"
    });

    $(".select2-modal").select2({
        width: "100%",
        dropdownParent: $(".modal-content")
    });

    $(".select2-modal-ItemCodeBedaBahan").select2({
        width: "100%",
        dropdownParent: $("#FormulaBTPHeaderModal"),
        placeholder: "Pilih Item",
        allowClear: true
    });

    $('.select2-inputGroup').select2({
        placeholder: "Pilih Zat Gizi",
        width: '100%',
        dropdownParent: $("#PerhitunganINGDetailModal")
    });

    FormulaHeaderHeader.Init();

    // Btn Upload
    $('#btnSaveUploadKompilasi').on('click', function (e) {
        e.preventDefault();

        TableUploadFile.SaveUpload()
        TableUploadFile.AddUpload();
    });
    $('#btnCancelUploadKompilasi').on('click', function (e) {
        e.preventDefault();

        TableUploadFile.AddUpload();
    });
    $('#btnCloseUploadKompilasi').on('click', function (e) {
        e.preventDefault();

        TableUploadFile.AddUpload();
    });

    // Btn Priview
    $('#btnCloseShowPriviewFileModal').on('click', function (e) {
        e.preventDefault();

        TableUploadFile.CloseModalPriviewFile();
    });

    // Btn Detail
    $('#btnSaveUploadKompilasiDetail').on('click', function (e) {
        e.preventDefault();

        if (TableUploadFile.SaveDetail()) {
            TableUploadFile.AddDetail();
        }
    });
    $('#btnCancelUploadKompilasiDetail').on('click', function (e) {
        e.preventDefault();

        TableUploadFile.AddDetail();
    });
    $('#btnCloseUploadKompilasiDetail').on('click', function (e) {
        e.preventDefault();

        TableUploadFile.AddDetail();
    });

    // Btn Back
    $("#btnBack").on("click", function (e) {
        e.preventDefault();

        Swal.fire({
            title: 'Kembali ke List?',
            text: "Perubahan yang belum disimpan akan hilang. Apakah Anda yakin?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: "Ya, Kembali",
            cancelButtonText: "Batal",
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-outline-danger ms-1'
            },
            buttonsStyling: false
        }).then((result) => {
            if (result.isConfirmed) {
                if (Id == null || Id == "") {
                    f_BindingGrid();
                    f_UpdateDashboardCounters();
                    f_ShowListVerFor();
                }
                else {
                    window.location.replace("/AKASIA/VerFor");
                }

                isGenerated = false;

                // Close BTP Detail
                if (!$('#myElement').hasClass('d-none')) {
                    TableBTPDetail.HideTable();
                }

                // Close History

                if ($("#collapseHistorical").hasClass('show')) {
                    $("#collapseHistorical").removeClass('show');
                }
            }
        });
    });

    $("#UploadFileKompilasi").on("change", function (e) {
        e.preventDefault();
        TableUploadFile.GeneratePriviewUpload(e);
    });

    // Close Detail BTP
    $("#btnCloseDetailINSBTPInfo").on("click", function (e) {
        e.preventDefault();

        TableBTPDetail.HideTable();
    });

    $("#btnAddBtpHeader").on("click", function (e) {
        e.preventDefault();

        TableBTPHeader.Add();
    });

    // Select Item Code BTP
    $("#ItemCodeBtpHeader").on("select2:select", function (e) {
        e.preventDefault();
        let curvalItemBthpHeader = this.value;

        TableBTPHeader.BindingDataChangeItem(curvalItemBthpHeader);
    });

    $("#ItemCodeBtpHeaderReview").on("change", function (e) {
        e.preventDefault();
        let curvalItemBthpHeader = this.value;
        console.log(curvalItemBthpHeader);

        TableBTPHeader.BindingDataChangeItemReview(curvalItemBthpHeader);
    });

    // Form Detail BTP Header
    $("#btnSaveBtpHeaderDetail").on("click", function (e) {
        e.preventDefault();

        TableBTPHeader.Save();
    });

    document.getElementById('accordionPanelsFormula-collapseTwo').addEventListener('shown.bs.collapse', function () {
        $('#dataTableBtpHeader').DataTable().columns.adjust().draw();
        //$('#dataTableBtpDetail').DataTable().columns.adjust().draw();
    });

    document.getElementById('accordionPanelsPerhitunganING-collapseTwo').addEventListener('shown.bs.collapse', function () {
        // //debugger; 
        $('#perhitunganIng-tableIngDetail').DataTable().columns.adjust().draw();
        $("#perhitunganING-isLowerKemasan").trigger("change");
    });

    document.getElementById('accordionPanelsVerFor-collapseTwo').addEventListener('shown.bs.collapse', function () {
        $('#dataTableUploadFile').DataTable().columns.adjust().draw();
        // Helper.RenderTooltip();
    });

    document.getElementById('accordionPanelsPerhitunganING-collapseThree').addEventListener('shown.bs.collapse', function () {
        $('#dataTableUploadIngFile').DataTable().columns.adjust().draw();
        // Helper.RenderTooltip();
    });

    document.querySelector('button[data-bs-target="#form-tabs-Formula"]').addEventListener('shown.bs.tab', function () {
        $('#dataTableBtpHeader').DataTable().columns.adjust().draw();
        //$('#dataTableBtpDetail').DataTable().columns.adjust().draw();
    });

    document.querySelector('button[data-bs-target="#form-tabs-PerhitunganING"]').addEventListener('shown.bs.tab', function () {
        $('#perhitunganIng-tableIngDetail').DataTable().columns.adjust().draw();
        $('#dataTableUploadIngFile').DataTable().columns.adjust().draw();
        $("#perhitunganING-isLowerKemasan").trigger("change");

    });

    document.querySelector('button[data-bs-target="#form-tabs-SummaryVerFor"]').addEventListener('shown.bs.tab', function () {
        $('#dataTableUploadFile').DataTable().columns.adjust().draw();
        // Helper.RenderTooltip();
    });

    // Form Upload BTP Header
    $("#UploadFileBahanOrganikBtpHeader").on("change", function (e) {
        e.preventDefault();
        TableBTPHeader.GeneratePriviewUpload(e, "modalShowFileBahanOrganikBtpHeaderUploaded");
    });

    $("#UploadFileEGDEGBtpHeader").on("change", function (e) {
        e.preventDefault();
        TableBTPHeader.GeneratePriviewUpload(e, "modalShowFileEGDEGBtpHeaderUploaded");
    });

    $("#UploadFileSpekBtpHeader").on("change", function (e) {
        e.preventDefault();
        TableBTPHeader.GeneratePriviewUpload(e, "modalShowFileSpekBtpHeaderUploaded");
    });

    $("#btnUploadFileBtpHeaderDetail").on("click", function (e) {
        e.preventDefault();

        TableBTPHeader.SaveUpload();
    });

    $("#btnSaveBtpModalHeaderReviewDetail").on("click", function (e) {
        e.preventDefault();

        TableBTPHeader.SaveReview();
    });

    $("#btnSaveFormulaForm").on("click", function (e) {
        e.preventDefault();

        FormulaHeaderHeader.SaveData();
    });

    $("#btnSaveFormulaBTPDetail").on("click", function (e) {
        e.preventDefault();

        TableBTPDetail.Save();
    })

    $('#perhitunganING-isLowerKemasan').on('change', function () {
        // Cek status centang
        //debugger;
        const isChecked = $(this).is(':checked');

        const $inpJumlah = $('#perhitunganING-jumlahKemasan');

        if (isGenerated) {
            $inpJumlah.prop('disabled', true);
        }
        else {
            $inpJumlah.prop('disabled', !isChecked);
        }

        if (!isChecked) {
            $inpJumlah.val('');
        }

    }).trigger('change');

    $("#btnSavePerhitunganIngForm").on("click", function (e) {
        e.preventDefault();

        FormulaHeaderHeader.SaveData();
    });

    $("#btnAddKlaimTambahan").on("click", function (e) {
        e.preventDefault();

        TableIngKlaimTambahan.Add();

        $("#perhitunganING-klaimTambahanModal").modal("toggle");
    });

    $("#btnSaveperhitunganING-klaimTambahanModal").on("click", function (e) {
        e.preventDefault();

        TableIngKlaimTambahan.Save();
    });

    $("#popUpKlaimTambahan").on("click", function (e) {
        e.preventDefault();

        TableIngKlaimTambahan.Render();
    });

    $("#UploadFileIng").on("change", function (e) {
        e.preventDefault();

        TableUploadIngFile.GeneratePriviewUpload(e);
    });

    // Btn Detail Ing
    $("#btnSaveUploadIng").on("click", function (e) {
        e.preventDefault();

        TableUploadIngFile.SaveUpload();
        TableUploadIngFile.AddUpload();
    });
    $('#btnCancelUploadIng').on('click', function (e) {
        e.preventDefault();

        TableUploadIngFile.AddUpload();
    });
    $('#btnCloseIngUpload').on('click', function (e) {
        e.preventDefault();

        TableUploadIngFile.AddUpload();
    });

    // Btn Detail Ing
    $('#btnSaveVerForIngUploadDetail').on('click', function (e) {
        e.preventDefault();

        TableUploadIngFile.SaveDetail();
        TableUploadIngFile.AddDetail();
    });
    $('#btnCancelVerForIngUploadDetail').on('click', function (e) {
        e.preventDefault();

        TableUploadIngFile.AddDetail();
    });

    $('#btnCloseVerForIngUploadDetail').on('click', function (e) {
        e.preventDefault();

        TableUploadIngFile.AddDetail();
    });

    $("#btnAturanPembulatan").click(function () {
        window.open('/static/Lampiran_Pembulatan_AKASIA.pdf', '_blank');
    });

    $("#btnAturanKlaim").click(function () {
        window.open('/VerFor/DownloadAturanKlaim', '_blank');
    });

    $("#btnGenerate").click(function (e) {
        e.preventDefault();

        TableIngDetail.Generate();
    });

    $('#btnClear').on('click', function () {
        if ($.fn.DataTable.isDataTable('#perhitunganIng-tableIngDetail')) {
            var table = $('#perhitunganIng-tableIngDetail').DataTable();

            table.clear().draw();
        }

        if (typeof Data !== 'undefined' && Data.ListDetailIng) {
            Data.ListDetailIng = [];
        }

        $("#perhitunganING-acuanLabel").removeAttr("disabled");
        $("#btnGenerate").removeClass("d-none");
        $("#btnClear").addClass("d-none");

        $("#perhitunganING-isLowerKemasan").removeAttr("disabled");
        $("#perhitunganING-beratJenis").removeAttr("disabled");

        var alertBox = $('#alertUnsaved');
        alertBox.removeClass('show');

        setTimeout(function () {
            alertBox.addClass('d-none');
        }, 150);
    });

    $("#perhitunganING-btnSaveGenerate").on('click', function (e) {
        e.preventDefault();

        TableIngDetail.Save();
    })

    document.addEventListener('change', function (e) {
        // Cek apakah element yang berubah adalah #cbHeaderVoid
        if (e.target && e.target.id === 'cbHeaderVoid') {
            var isChecked = e.target.checked;
            TableIngDetail.UpdateAllVoid(isChecked);
        }
    });

    $("#PerhitunganIng-btnAdd").on("click", function (e) {
        e.preventDefault();

        TableIngDetail.Add();
    })

    $("#PerhitunganING-ZatGizi-InfoNilaiGizi").on("select2:select", function (e) {
        e.preventDefault();

        $("#PerhitunganING-SatuanZatGizi-InfoNilaiGizi").text(this.value);
    });

    $("#btnSavePerhitunganINGDetail").on("click", function (e) {
        e.preventDefault();

        TableIngDetail.SaveIngDetail();
    });

    Helper.RenderTooltip();

    $("#popUpHistorical").on("click", function (e) {
        e.preventDefault();

        TableHistoricalForm.Save();
    })

    $("#btnSave").on("click", function (e) {
        e.preventDefault();

        FormulaHeaderHeader.SaveData();
    })

    $("#btnSubmit").on("click", function (e) {
        e.preventDefault();
        Helper.ShowSwalConfirm(this.value, "Apakah Anda yakin ingin melakukan Submit?");
    });

    $("#btnApprove").on("click", function (e) {
        e.preventDefault();
        Helper.ShowSwalConfirm(this.value, "Apakah Anda yakin ingin melakukan Approve?");
    });

    $("#btnReqRequest").on("click", function (e) {
        e.preventDefault();
        Helper.ShowSwalConfirm(this.value, "Pastikan Anda telah memverifikasi semua kebutuhan request. Apakah Anda yakin data sudah valid dan ingin melanjutkan?");
    });

    $("#btnSubmitPerhitunganIngForm").on("click", function (e) {
        e.preventDefault();
        Helper.ShowSwalConfirm(this.value, "Submit data Perhitungan ING?");
    });

    $("#btnApprovePerhitunganIngForm").on("click", function (e) {
        e.preventDefault();
        Helper.ShowSwalConfirm(this.value, "Approve data Perhitungan ING?");
    });

    $("#btnCancel").on("click", function (e) {
        e.preventDefault();

        Helper.ShowSwalConfirm(
            this.value,
            "Apakah Anda yakin ingin membatalkan proses Verifikasi Formula ini? Status akan berubah menjadi Cancelled.",
            "warning"
        );
    });

    $("#btnReturnRevision").on("click", function (e) {
        e.preventDefault();
        let btnValue = this.value;

        if (FormulaHeaderHeader.ValidationReviewCompletion()) {
            Swal.fire({
                title: 'Kembalikan Revisi?',
                text: "Pastikan catatan revisi sudah lengkap.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: "Yes, do it!",
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-outline-danger ms-1'
                },
                buttonsStyling: false
            }).then((result) => {
                if (result.isConfirmed) {
                    FormulaHeaderHeader.SubmitData(btnValue);
                }
            });
        }
    });

    $("#btnSubmitPerhitunganIngForm").on("click", function (e) {
        e.preventDefault();

        FormulaHeaderHeader.SubmitData(this.value);
    });

    $("#btnReturnRevisionPerhitunganIngForm").on("click", function (e) {
        e.preventDefault();

        FormulaHeaderHeader.SubmitData(this.value);
    });

    $("#AltfBahanBedaItemCodeBtpHeader").on("select2:select", function (e) {
        e.preventDefault();

        let selectItemCode = $("#ItemCodeBtpHeader").find(":selected").val();
        let selectItemAlt = $("#AltfBahanBedaItemCodeBtpHeader").find(":selected").val();

        if (selectItemCode == selectItemAlt) {
            clsGlobal.swalWarning("Tidak Bisa Memilih Item Code yang sama pada Alternatif Bahan beda Item Kode");

            $("#AltfBahanBedaItemCodeBtpHeader").val(null).trigger("change");
            return false;
        }
    });

    $("#btnSinkronisasiFormulaForm").on("click", function (e) {
        e.preventDefault();

        FormulaDetail.SinkorinasiKomposisi();
    });

    $('#ddlSourceVerFor').select2({
        dropdownParent: $('#modalCopyProject')
    });

    $('#ddlSourceVerFor').on('select2:select', function (e) {
        CopyProjectModule.OnSourceChange(e.params.data.id);
    });

    $('#ddlSourceVerFor').on('select2:clear', function (e) {
        CopyProjectModule.OnSourceChange(null);
    });

    $("#btnCopy").on("click", function (e) {
        e.preventDefault();
        CopyProjectModule.Init();
    });

    $("#btnConfirmCopyProject").on("click", function (e) {
        e.preventDefault();
        CopyProjectModule.ExecuteCopy();
    });

    $("#btnExportKomposisi").on("click", function (e) {
        e.preventDefault();

        TableBTPHeader.ExportExcel();
    });

    $("#btnExportIng").on("click", function (e) {
        e.preventDefault();

        TableIngDetail.ExportExcel();
    });

    $("#txtComment").on("input keyup", function () {
        if ($(this).val().trim() !== "") {
            $(this).removeClass("is-invalid");
            $(this).css("border", "");
        }
    });

    $('#FormulaBTPModalHeaderReviewModal').on('hidden.bs.modal', function () {

        $('#modalShowFileReviewBahanOrganikBtpHeaderReviewUploaded').empty();
        $('#modalShowFileReviewEGDEGBtpHeaderReviewUploaded').empty();
        $('#modalShowFileReviewSpekBtpHeaderReviewUploaded').empty();

        $('#collapseUploadFileBahanOrganikBtpHeaderReview').collapse('hide');
        $('#collapseUploadFileEGDEGBtpHeaderReview').collapse('hide');
        $('#collapseUploadFileSpekBtpHeaderReview').collapse('hide');
    });
});

var FormulaHeaderHeader = {
    Init: function () {
        Data = JSON.parse($("#hdDataHeader").val());
    },
    GetData: function () {
        clsGlobal.showLoading();

        $.ajax({
            type: "POST",
            url: "/VerFor/GetProjectById",
            data: {
                id: Data.FormulaHeader.VerForHeaderId,
                __RequestVerificationToken: $('#VerForPanel input[name=__RequestVerificationToken]').val()
            },
            datatype: "json",
            success: function (retDat, status, xhr) {
                clsGlobal.hideLoading();
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        const DataFormulaDetailAll = JSON.parse(retDat.objData);
                        console.log(DataFormulaDetailAll);
                        //Mapping Data
                        Data.ListFile = DataFormulaDetailAll.ListFile;
                        Data.ListIngFile = DataFormulaDetailAll.ListIngFile;
                        Data.ListDetailIng = DataFormulaDetailAll.ListDetailIng;

                        FormulaHeaderHeader.MappingData(DataFormulaDetailAll);
                        FormulaDetail.MappingData(DataFormulaDetailAll);
                        FormulaHeaderHeader.SetForm();
                        IngDetail.MappingData(DataFormulaDetailAll);
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
    },
    ShowDetail: function (id) {
        //debugger;
        Data.FormulaHeader.VerForHeaderId = id;
        FormulaHeaderHeader.GetData();
    },
    MappingData: function (data) {
        //debugger;
        Data.FormulaHeader = data.FormulaHeader;

        const isSubmittedVerfor = [
            "SUBMITTED",
            "VERFOR-APPROVED",
            "UPDATE-ING", "SUBMITTED-ING", "NEED REVISION-ING", "ING-APPROVED"
        ];

        if (isSubmittedVerfor.includes(Data.FormulaHeader.Status)) {
            isSubmitedVerfor = true;
        }
        else {
            isSubmitedVerfor = false;
        }

        $('#dtmRequestDate').val(moment(Data.FormulaHeader.RequestDate).isValid() ? moment(Data.FormulaHeader.RequestDate).format("DD MMM YYYY") : "");
        $('#StatusFormula').val(Data.FormulaHeader.Status);
        $('#ProjectNumber').val(Data.FormulaHeader.I2msnumber);
        $('#VerifFormulaNum').val(Data.FormulaHeader.VerForNumber);
        $('#ProjectType').val(Data.FormulaHeader.ProjectType);
        $('#PicProdev').val(Data.FormulaHeader.PicProdev);
        $('#PicRA').val(Data.FormulaHeader.PicRa);

        // Mapping PIC QA
        if (Data.FormulaHeader.PicQa == null || Data.FormulaHeader.PicQa == "" || Data.FormulaHeader.PicQa == undefined) {
            FormulaHeaderHeader.GenerateOptionSelectPicQA(lstUsrQfs);
            $("#PicQA").attr("disabled", false);
        }
        else {
            FormulaHeaderHeader.GenerateOptionSelectPicQA(lstUsrQfs, Data.FormulaHeader.PicQa);
            $("#PicQA").attr("disabled", true);
        }

        $('#Brand').val(Data.FormulaHeader.Brand);
        $('#SubBrand').val(Data.FormulaHeader.SubBrand);
        $('#Varian').val(Data.FormulaHeader.VariantCode);
        $('#Klaim').val(Data.FormulaHeader.Klaim.replace(/\|/g, " "));
        $('#FoodCategory').val(Data.FormulaHeader.FoodCategoryName);
        $('#ServingSize').val(Data.FormulaHeader.ServingSize);
        $('#servingSizeSatuan').text(Data.FormulaHeader.SatuanServingSize);
        $('#AddedWater').val(Data.FormulaHeader.AddedWater);
        $("#txtComment").val(Data.FormulaHeader.Comment);

        // For ID
        $("#VerForId").val(Data.FormulaHeader.VerForHeaderId);
        $("#I2MSId").val(Data.FormulaHeader.I2msheaderId);
        $("#TaskID").val(Data.FormulaHeader.I2mstaskId);

        //TableUploadFile.Render();
        Helper.RenderTooltip();
        TableHistoricalForm.Save();

        f_ShowDetailFormula();
    },
    ValidationSubmitVerFor: function () {

        if ($("#PicQA").find(":selected").val() == "" || $("#PicQA").find(":selected").val() == null) {
            clsGlobal.swalWarning("PIC QA kosong. Mohon isi data terlebih dahulu.");
            return false;
        }

        if (Data.ListFile && Array.isArray(Data.ListFile)) {
            for (let k = 0; k < Data.ListFile.length; k++) {
                const fileRow = Data.ListFile[k];

                const namaDokumen = fileRow.MConfigUploadFile ? fileRow.MConfigUploadFile.UploadName : `Dokumen Baris ke-${k + 1}`;

                if (!fileRow.Void) {
                    if (!fileRow.FileUploadId || fileRow.FileUploadId === "00000000-0000-0000-0000-000000000000") {
                        clsGlobal.swalWarning(`Dokumen "${namaDokumen}" wajib di-upload (karena status tidak Void).`);
                        return false;
                    }
                }
            }
        }

        if (!Data.ListBtp || !Array.isArray(Data.ListBtp) || Data.ListBtp.length === 0) {
            clsGlobal.swalWarning("Data Komposisi kosong. Mohon isi data terlebih dahulu.");
            return false;
        }

        let totalJumlahBahan = 0;

        for (let i = 0; i < Data.ListBtp.length; i++) {
            const item = Data.ListBtp[i];
            const namaBahan = `${item.ItemCode || ''} (${item.ItemDesc || ''}) - Baris ke-${i + 1}`;

            if (!item.SupplierName || item.SupplierName.trim() === "") {
                clsGlobal.swalWarning(`Data Supplier untuk bahan "${namaBahan}" tidak ditemukan. Silakan klik tombol "Sinkronisasi Komposisi" terlebih dahulu.`);
                return false;
            }

            if (!item.JenisBahan || item.JenisBahan.trim() === "") {
                clsGlobal.swalWarning(`Data Jenis Bahan untuk bahan "${namaBahan}" belum lengkap. Mohon lakukan "Sinkronisasi Komposisi".`);
                return false;
            }

            if (!item.NegaraAsal || item.NegaraAsal.trim() === "") {
                clsGlobal.swalWarning(`Data Negara Asal untuk bahan "${namaBahan}" kosong. Pastikan Anda sudah melakukan "Sinkronisasi Komposisi".`);
                return false;
            }

            if (!item.Gmo || item.Gmo.trim() === "") {
                clsGlobal.swalWarning(`Data status GMO untuk bahan "${namaBahan}" belum tertarik. Silakan perbarui data melalui "Sinkronisasi Komposisi".`);
                return false;
            }

            let jml = parseFloat(item.JumlahBahan);
            if (isNaN(jml)) jml = 0;
            totalJumlahBahan += jml;

            if (!item.FileSpekId || item.FileSpekId === "00000000-0000-0000-0000-000000000000") {
                clsGlobal.swalWarning(`File Spesifikasi untuk bahan "${namaBahan}" belum di-upload.`);
                return false;
            }

            let wajibEgdeg = false;
            if (item.IsEgdeg) {
                const arrEgdeg = item.IsEgdeg.toLowerCase().split(",");
                if (arrEgdeg.length === 1 && (arrEgdeg[0] === "n_a" || arrEgdeg[0] === "")) {
                    wajibEgdeg = false;
                } else {
                    wajibEgdeg = true;
                }
            }

            if (wajibEgdeg) {
                if (!item.KeteranganEgdegid || item.KeteranganEgdegid === "00000000-0000-0000-0000-000000000000") {
                    clsGlobal.swalWarning(`File Keterangan EG/DEG untuk bahan "${namaBahan}" wajib di-upload karena mengandung EG/DEG.`);
                    return false;
                }
            }

            let wajibOrganik = false;
            if (item.StatusOrganik && item.StatusOrganik.toLowerCase() === "organik") {
                wajibOrganik = true;
            }

            if (wajibOrganik) {
                if (!item.BahanOrganikId || item.BahanOrganikId === "00000000-0000-0000-0000-000000000000") {
                    clsGlobal.swalWarning(`File Sertifikat Organik untuk bahan "${namaBahan}" wajib di-upload.`);
                    return false;
                }
            }

            if (item.BtpDetail && item.BtpDetail !== "[]") {
                try {
                    const btpDetails = JSON.parse(item.BtpDetail);

                    for (let j = 0; j < btpDetails.length; j++) {
                        const det = btpDetails[j];
                        const labelBtp = `BTP ${det.JenisBTP || det.GolonganBTP || ''}`;

                        if (!det.RumusHitungBTP || det.RumusHitungBTP.trim() === "") {
                            clsGlobal.swalWarning(`Rumus Hitung untuk ${labelBtp} pada bahan "${namaBahan}" belum diisi.`);
                            return false;
                        }

                        if (det.HasilJumlahBTP === null || det.HasilJumlahBTP === undefined || det.HasilJumlahBTP === "") {
                            clsGlobal.swalWarning(`Hasil Jumlah untuk ${labelBtp} pada bahan "${namaBahan}" belum dihitung.`);
                            return false;
                        }
                    }
                } catch (e) {
                    console.error("Gagal parse JSON BtpDetail pada baris " + (i + 1), e);
                }
            }
        }

        totalJumlahBahan = parseFloat(totalJumlahBahan.toFixed(4));

        if (totalJumlahBahan < 99.95 || totalJumlahBahan > 100.05) {
            clsGlobal.swalWarning(`Total Jumlah Bahan Komposisi tidak valid. Total saat ini: ${totalJumlahBahan}%.`);
            return false;
        }

        return true;
    },
    ValidationReviewCompletion: function () {
        const role = usrRole ? usrRole.toUpperCase() : "";

        if (!Data.ListBtp || !Array.isArray(Data.ListBtp) || Data.ListBtp.length === 0) {
            clsGlobal.swalWarning("Data Komposisi kosong. Tidak ada item untuk direview.");
            return false;
        }

        for (let i = 0; i < Data.ListBtp.length; i++) {
            const item = Data.ListBtp[i];
            const namaBahan = `${item.ItemCode || ''} (${item.ItemDesc || ''}) - Baris ke-${i + 1}`;

            if (role === "RA") {
                if (!item.StatusReviewRa || item.StatusReviewRa.trim() === "") {
                    clsGlobal.swalWarning(`Review Komposisi belum lengkap! Anda belum memberikan status review pada bahan: "${namaBahan}".`);
                    return false;
                }
            }
            else if (role === "QFS") {
                if (!item.StatusReviewQa || item.StatusReviewQa.trim() === "") {
                    clsGlobal.swalWarning(`Review Komposisi belum lengkap! Anda belum memberikan status review pada bahan: "${namaBahan}".`);
                    return false;
                }
            }
        }

        if (role === "RA") {

            if (Data.ListFile && Array.isArray(Data.ListFile) && Data.ListFile.length > 0) {
                for (let j = 0; j < Data.ListFile.length; j++) {
                    const file = Data.ListFile[j];
                    const namaFile = file.MConfigUploadFile ? file.MConfigUploadFile.UploadName : `File baris ke-${j + 1}`;

                    if (!file.Void) {
                        if (!file.ReviewRa || file.ReviewRa.trim() === "") {
                            clsGlobal.swalWarning(`Review Dokumen belum lengkap! Mohon berikan review pada dokumen: "${namaFile}".`);
                            return false;
                        }
                    }
                }
            }

            const $txtComment = $("#txtComment");
            const commentVal = $txtComment.val();

            $txtComment.removeClass('is-invalid');
            $txtComment.css('border', '');

            if (!commentVal || commentVal.trim() === "") {
                $txtComment.addClass('is-invalid');

                clsGlobal.swalWarning("Anda memilih status REVISION. Mohon isi kolom 'Comment' sebagai alasan revisi.");

                $txtComment.focus();

                return false;
            }
            else {
                $txtComment.removeClass('is-invalid');
                $txtComment.css('border', '');

                Data.FormulaHeader.Comment = commentVal;
            }
        }

        return true;
    },
    ValidationApproveVerFor: function () {
        if (!Data.ListBtp || !Array.isArray(Data.ListBtp) || Data.ListBtp.length === 0) {
            return true;
        }

        const role = usrRole ? usrRole.toUpperCase() : "";

        for (let i = 0; i < Data.ListBtp.length; i++) {
            const item = Data.ListBtp[i];
            const namaBahan = `${item.ItemCode} (${item.ItemDesc}) Item ke-${i + 1}`;

            const statusQA = item.StatusReviewQa ? item.StatusReviewQa.toUpperCase() : "";
            const statusRA = item.StatusReviewRa ? item.StatusReviewRa.toUpperCase() : "";

            if (statusQA.includes("REVISION") || statusRA.includes("REVISION")) {
                clsGlobal.swalWarning(`Tidak dapat Approve Header. Item Komposisi "${namaBahan}" statusnya masih 'Need Revision'. Silakan Return Revision.`);
                return false;
            }


            if (role === "RA") {
                if (!statusRA.includes("OK")) {
                    clsGlobal.swalWarning(`Anda (RA) belum menyetujui Item Komposisi "${namaBahan}". Mohon ubah status Item Komposisi menjadi OK terlebih dahulu.`);
                    return false;
                }

            }

            if (role === "QFS") {
                if (!statusQA.includes("OK")) {
                    clsGlobal.swalWarning(`Anda (QFS) belum menyetujui Item Komposisi "${namaBahan}". Mohon ubah status Item Komposisi menjadi OK terlebih dahulu.`);
                    return false;
                }

            }
        }

        return true;
    },
    ValidationSubmitING: function () {
        // //debugger;

        // 1. Validasi Dokumen (ListIngFile)
        if (Data.ListIngFile && Array.isArray(Data.ListIngFile) && Data.ListIngFile.length > 0) {
            for (let i = 0; i < Data.ListIngFile.length; i++) {
                const file = Data.ListIngFile[i];

                if (!file.Void) {
                    let namaDokumen = "Dokumen";
                    if (file.MConfigUploadFile && file.MConfigUploadFile.UploadName) {
                        namaDokumen = file.MConfigUploadFile.UploadName;
                    }

                    if (!file.FileUploadId || file.FileUploadId === "00000000-0000-0000-0000-000000000000") {
                        clsGlobal.swalWarning(`Dokumen "${namaDokumen}" wajib di-upload sebelum Submit.`);
                        return false;
                    }
                }
            }
        }

        // 2. Cek apakah Detail sudah di-generate
        if (!Data.ListDetailIng || !Array.isArray(Data.ListDetailIng) || Data.ListDetailIng.length === 0) {
            clsGlobal.swalWarning("Data Perhitungan Ingredient belum ada. Mohon klik tombol 'Generate' terlebih dahulu.");
            return false;
        }

        // 3. Cek Flag IsLowerKemasan
        let isLowerKemasan = false;
        if (Data.FormulaIns && Data.FormulaIns.IsLowerKemasan) {
            const val = Data.FormulaIns.IsLowerKemasan;
            isLowerKemasan = (val === true || val === "true");
        }

        // 4. Loop Validasi Detail Item
        for (let i = 0; i < Data.ListDetailIng.length; i++) {
            const item = Data.ListDetailIng[i];
            const namaZat = item.ZatGizi || `Baris ke-${i + 1}`;

            // Skip jika item di-Void
            if (item.IsVoid === true) continue;

            // Helper function: cek null/empty
            const isInvalid = (val) => (val === null || val === "" || val === undefined);

            // Helper function: cek apakah ValueAlg ada isinya (True jika ValueAlg TIDAK NULL)
            const hasValueAlg = (item.ValueAlg !== null && item.ValueAlg !== undefined);

            // --- Validasi Wajib (Analisa & Label Dasar) ---
            if (isInvalid(item.HasilAnalisaPer100g)) {
                clsGlobal.swalWarning(`'Hasil Analisa Per 100g' pada Zat Gizi "${namaZat}" belum diisi.`);
                return false;
            }
            if (isInvalid(item.HasilAnalisaPer100ml)) {
                clsGlobal.swalWarning(`'Hasil Analisa Per 100ml' pada Zat Gizi "${namaZat}" belum diisi.`);
                return false;
            }
            if (isInvalid(item.LabelPerSaji)) {
                clsGlobal.swalWarning(`'Pencantuman Label Per Saji' pada Zat Gizi "${namaZat}" belum diisi.`);
                return false;
            }
            if (isInvalid(item.LabelPer100kkal)) {
                clsGlobal.swalWarning(`'Pencantuman Label Per 100kkal' pada Zat Gizi "${namaZat}" belum diisi.`);
                return false;
            }
            if (isInvalid(item.LabelPer100g)) {
                clsGlobal.swalWarning(`'Pencantuman Label Per 100g' pada Zat Gizi "${namaZat}" belum diisi.`);
                return false;
            }
            if (isInvalid(item.LabelPer100ml)) {
                clsGlobal.swalWarning(`'Pencantuman Label Per 100ml' pada Zat Gizi "${namaZat}" belum diisi.`);
                return false;
            }

            // --- Validasi AKG (Hanya jika ValueAlg ADA) ---
            // Jika ValueAlg null, kolom PersenAkg... biasanya otomatis null/disabled, jadi tidak perlu divalidasi.
            if (hasValueAlg) {
                if (isInvalid(item.PersenAkglabelPerSaji)) {
                    clsGlobal.swalWarning(`'% AKG Label Per Saji' pada Zat Gizi "${namaZat}" belum diisi.`);
                    return false;
                }
            }

            // --- Validasi Lower Kemasan (Hanya jika Opsi Aktif) ---
            if (isLowerKemasan) {
                // Label Satu Takaran Saji (Wajib isi jika flag aktif)
                if (isInvalid(item.LabelSatuTakaranSaji)) {
                    clsGlobal.swalWarning(`Karena opsi 'Kurang dari 1 Takaran Saji' aktif, maka 'Label Satu Takaran Saji' pada Zat Gizi "${namaZat}" WAJIB diisi.`);
                    return false;
                }

                // % AKG Satu Takaran Saji (Wajib isi HANYA JIKA flag aktif DAN ValueAlg ada)
                if (hasValueAlg) {
                    if (isInvalid(item.PersenAkglabelSatuTakaranSaji)) {
                        clsGlobal.swalWarning(`Karena opsi 'Kurang dari 1 Takaran Saji' aktif, maka '% AKG Label Satu Takaran Saji' pada Zat Gizi "${namaZat}" WAJIB diisi.`);
                        return false;
                    }
                }
            }
        }

        return true;
    },
    CollectData: function () {
        Data.FormulaHeader.PicQa = $("#PicQA").find(":selected").val();
        Data.FormulaHeader.Comment = $("#txtComment").val();

        return Data;
    },
    SaveData: function () {

        FormulaHeaderHeader.CollectData();
        FormulaDetail.CollectData();
        IngDetail.CollectData();

        $.ajax({
            type: "POST",
            url: "/VerFor/SaveVerFor",
            datatype: "json",
            async: true,
            data: {
                __RequestVerificationToken: $('#FormulaBTPHeaderForm input[name=__RequestVerificationToken]').val(),
                DataReq: Data,
            },
            success: function (retDat, status, xhr) {
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        clsGlobal.swalSuccess("Sukses simpan data");

                        Data = JSON.parse(retDat.objData);

                        FormulaHeaderHeader.MappingData(Data);
                        FormulaDetail.MappingData(Data);
                        FormulaHeaderHeader.SetForm();
                        IngDetail.MappingData(Data);
                        TableHistoricalForm.Save();

                        closeAlert();
                    }
                    else {
                        if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                            clsGlobal.swalWarning(retDat.objData);
                        }
                        else {
                            clsGlobal.swalError(retDat.txtMessage);
                        }
                    }
                    $("#txtGUID").val(retDat.txtGUID);
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.swalError(xhr.responseText);
            }
        });
    },
    SubmitData: function (typeButton = "") {
        let isValid = false;
        if (typeButton == "SUBMITVERVOR") {
            isValid = FormulaHeaderHeader.ValidationSubmitVerFor();
        }
        else if (typeButton == "APPROVEVERVOR") {
            isValid = FormulaHeaderHeader.ValidationApproveVerFor();
        }
        else if (typeButton == "SUBMITING") {
            isValid = FormulaHeaderHeader.ValidationSubmitING();
        }
        else {
            if (typeButton == "") {
                isValid = false;
                clsGlobal.swalError("Button Tidak Ditemukan");
                return isValid
            }
            else {
                isValid = true;
            }
        }

        if (isValid) {
            $.ajax({
                type: "POST",
                url: "/VerFor/SubmitVerFor",
                datatype: "json",
                async: true,
                data: {
                    __RequestVerificationToken: $('#FormulaBTPHeaderForm input[name=__RequestVerificationToken]').val(),
                    DataReq: Data,
                    TypeButton: typeButton
                },
                success: function (retDat, status, xhr) {
                    if (xhr.responseText.includes("!DOCTYPE html")) {
                        clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                    }
                    else {
                        if (retDat.bitSuccess == true) {
                            clsGlobal.swalSuccess("Sukses submit data");

                            Data = JSON.parse(retDat.objData);

                            FormulaHeaderHeader.MappingData(Data);
                            FormulaDetail.MappingData(Data);
                            IngDetail.MappingData(Data);
                            TableHistoricalForm.Save();
                            FormulaHeaderHeader.SetForm();
                        }
                        else {
                            if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                                clsGlobal.swalWarning(retDat.objData);
                            }
                            else {
                                clsGlobal.swalError(retDat.txtMessage);
                            }
                        }
                        $("#txtGUID").val(retDat.txtGUID);
                    }
                },
                error: function (xhr, status, error) {
                    clsGlobal.swalError(xhr.responseText);
                }
            });
        }
    },
    SetForm: function () {
        const allButtons = [
            "#btnCopy", "#btnApprove", "#btnReturnRevision", "#btnCancel", "#btnSubmit",
            "#btnSave", "#btnSubmitPerhitunganIngForm", "#btnSaveFormulaForm",
            "#btnSinkronisasiFormulaForm", "#btnApprovePerhitunganIngForm", "#btnAddBtpHeader",
            "#btnClear", "#btnGenerate", "#btnAddKlaimTambahan",
            "#btnSavePerhitunganIngForm", "#btnReturnRevisionPerhitunganIngForm",
            "#btnExportKomposisi", "#btnExportIng"
        ];

        const inputComment = "#txtComment";
        const inputRatio1 = "#txtPerBTPRatio1";
        const inputCheckisLowerKemasan = "#perhitunganING-isLowerKemasan";
        const acuanLabel = "#perhitunganING-acuanLabel";
        const beratJenis = "#perhitunganING-beratJenis";
        const PicQA = "#PicQA";


        allButtons.forEach(btn => $(btn).addClass("d-none"));
        $(inputComment).prop("disabled", true);
        $(inputRatio1).prop("disabled", true);
        $(inputCheckisLowerKemasan).prop("disabled", true);
        $(acuanLabel).prop("disabled", true);
        $(beratJenis).prop("disabled", true);
        $(PicQA).prop("disabled", true);

        if (!Data || !Data.FormulaHeader || !Data.FormulaHeader.Status) return;

        const status = Data.FormulaHeader.Status.toUpperCase();
        const role = usrRole ? usrRole.toUpperCase() : "";
        const IsApproveinitRA = Data.FormulaHeader.Status === "REQUESTED" ? false : true;

        const valRa = (Data.FormulaDetail) ? Data.FormulaDetail.ApprovalRa : null;
        const valQa = (Data.FormulaDetail) ? Data.FormulaDetail.ApprovalQa : null;

        const isRaPending = (valRa === null || valRa === "");
        const isQaPending = (valQa === null || valQa === "");

        FormulaHeaderHeader.SetMsgWarning(role, IsApproveinitRA);

        if (role === "ADMINISTRATOR") {
            allButtons.forEach(btn => $(btn).removeClass("d-none"));
            $(inputComment).prop("disabled", false);
            $(inputRatio1).prop("disabled", false);
            $(inputCheckisLowerKemasan).prop("disabled", false);
            $(acuanLabel).prop("disabled", false);
            $(beratJenis).prop("disabled", false);
            $(PicQA).prop("disabled", false);
            return;
        }

        if (role === "PDV") {
            const allowCancel = [
                "REQUESTED", "IN-PROGRESS", "SUBMITTED",
                "NEED REVISION-VERFOR", "VERFOR-APPROVED",
                "UPDATE-ING", "SUBMITTED-ING", "NEED REVISION-ING"
            ];

            if (allowCancel.includes(status) && IsApproveinitRA) {
                $("#btnCancel").removeClass("d-none");
            }

            if (status === "REQUESTED" && IsApproveinitRA) {
                $("#btnSave").removeClass("d-none");
                $("#btnSaveFormulaForm").removeClass("d-none");
                $("#btnAddBtpHeader").removeClass("d-none");
                $("#btnSavePerhitunganIngForm").removeClass("d-none");
                $("#btnGenerate").removeClass("d-none");
                $("#btnClear").removeClass("d-none");
                $("#btnAddKlaimTambahan").removeClass("d-none");
                $(inputRatio1).prop("disabled", false);
                $(inputCheckisLowerKemasan).prop("disabled", false);
                $(acuanLabel).prop("disabled", false);
                $(beratJenis).prop("disabled", false);
                $(PicQA).prop("disabled", false);
            }

            if (status === "IN-PROGRESS" || status === "NEED REVISION-VERFOR") {
                $("#btnSubmit").removeClass("d-none");
                $("#btnSave").removeClass("d-none");
                $("#btnSaveFormulaForm").removeClass("d-none");
                $("#btnSinkronisasiFormulaForm").removeClass("d-none");
                $("#btnAddBtpHeader").removeClass("d-none");
                $("#btnSavePerhitunganIngForm").removeClass("d-none");
                $("#btnGenerate").removeClass("d-none");
                $("#btnClear").removeClass("d-none");
                $("#btnAddKlaimTambahan").removeClass("d-none");

                $(inputRatio1).prop("disabled", false);
                $(inputCheckisLowerKemasan).prop("disabled", false);
                $(acuanLabel).prop("disabled", false);
                $(beratJenis).prop("disabled", false);
                $(PicQA).prop("disabled", false);
            }

            //if (status === "SUBMITTED") {
            //    $("#btnSavePerhitunganIngForm").removeClass("d-none");
            //    $("#btnAddKlaimTambahan").removeClass("d-none");
            //}

            if (status === "UPDATE-ING" || status === "NEED REVISION-ING" || status === "VERFOR-APPROVED") {
                $("#btnSavePerhitunganIngForm").removeClass("d-none");
                $("#btnSubmitPerhitunganIngForm").removeClass("d-none");
                $("#btnGenerate").removeClass("d-none");
                $("#btnClear").removeClass("d-none");
                $("#btnAddKlaimTambahan").removeClass("d-none");
            }
        }
        else if (role === "RA") {
            if (status === "SUBMITTED") {
                if (isRaPending) {
                    $("#btnApprove").removeClass("d-none");
                    $("#btnReturnRevision").removeClass("d-none");
                    $(inputComment).prop("disabled", false);
                }
            }

            if (status === "SUBMITTED-ING") {
                $("#btnSavePerhitunganIngForm").removeClass("d-none");
                $("#btnApprovePerhitunganIngForm").removeClass("d-none");
                $("#btnReturnRevisionPerhitunganIngForm").removeClass("d-none");
                $(inputComment).prop("disabled", false);
            }
        }
        else if (role === "QFS") {
            if (status === "SUBMITTED") {
                if (isQaPending) {
                    $("#btnApprove").removeClass("d-none");
                    $("#btnReturnRevision").removeClass("d-none");
                }
            }
        }

        if (role === "PDV" && status === "IN-PROGRESS" && !Data.FormulaHeader.IsCopyFrom) {
            $("#btnCopy").removeClass("d-none");
        }

        if (status === "ING-APPROVED") {
            $("#btnExportKomposisi").removeClass("d-none");
            $("#btnExportIng").removeClass("d-none");
        }
    },
    SetMsgWarning: function (role, isInitApprove = false) {
        $("#alertInitApproveRA").addClass("d-none");
        $("#divButtonApproveInit").addClass("d-none");

        if (role === "PDV" && !isInitApprove) {
            $("#MsgWarnInitApprove").html(`Request Anda saat ini sedang dalam proses <strong>review oleh RA</strong>. Mohon kesediaannya untuk menunggu.`);
            $("#alertInitApproveRA").removeClass("d-none");
        }
        else if (role === "RA" && !isInitApprove) {
            $("#MsgWarnInitApprove").html(`Request ini menunggu persetujuan Anda. Harap segera lakukan <strong>review</strong>.`);
            $("#alertInitApproveRA").removeClass("d-none");
            $("#divButtonApproveInit").removeClass("d-none");
        }
    },
    GenerateOptionSelectPicQA: function (lstDataUsr, datSelected = "") {
        //debugger;
        $('#PicQA').empty();

        var datOptSel = [];
        datOptSel.push(new Option("", "", true, true));

        var lstOption = lstDataUsr.map(x => (new Option(x.TxtCode, x.TxtCode, false, false)));

        if (lstOption.includes(x => x.value.toLowerCase() == datSelected.toLowerCase())) {
            var datSelIdx = datOptSel.findIndex(x => x.value.toLowerCase() == datSelected.toLowerCase());

            lstOption[datSelIdx].selected = true;
        }
        else {
            lstOption.push(new Option(datSelected.toLowerCase(), datSelected.toLowerCase(), false, true));
        }

        datOptSel.push(...lstOption);

        $('#PicQA').append(datOptSel);
    }
}

var FormulaDetail = {
    CollectData: function () {
        Data.FormulaDetail.PerhitunganBtpRatio = $("#txtPerBTPRatio1").val();

        return Data;
    },
    MappingData: function (data) {
        //debugger;
        Data.FormulaDetail = data.FormulaDetail;
        Data.ListBtp = data.ListBtp;

        $('#dtmReqDateDetailFormula').val(moment(Data.FormulaHeader.RequestDate).isValid() ? moment(Data.FormulaHeader.RequestDate).format("DD MMM YYYY") : "");
        $('#statusDetailFormula').val(Data.FormulaHeader.Status);
        $('#projectNoDetailFormula').val(Data.FormulaHeader.I2msnumber);
        $('#VerForNoDetailFormula').val(Data.FormulaHeader.VerForNumber);
        $('#formulaApprovalRA').val(Data.FormulaDetail.ApprovalRa);
        $('#formulaApprovalQA').val(Data.FormulaDetail.ApprovalQa);
        $("#txtPerBTPRatio1").val(Data.FormulaDetail.PerhitunganBtpRatio);

        this.TotalJumlahBahan();
        TableBTPHeader.Render();
        TableUploadFile.Render();
    },
    SaveData: function () {
        let datReq = FormulaDetail.CollectData();

        $.ajax({
            type: "POST",
            url: "/VerFor/SaveFormulaDetail",
            datatype: "json",
            async: true,
            data: {
                __RequestVerificationToken: $('#FormulaBTPHeaderForm input[name=__RequestVerificationToken]').val(),
                DataReq: datReq
            },
            success: function (retDat, status, xhr) {
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {

                        clsGlobal.swalSuccess("Sukses save data formula");

                        Data.FormulaDetail = JSON.parse(retDat.objData);
                        FormulaDetail.MappingData(Data);
                    }
                    else {
                        if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                            clsGlobal.swalWarning(retDat.objData);
                        }
                        else {
                            clsGlobal.swalError(retDat.txtMessage);
                        }
                    }
                    $("#txtGUID").val(retDat.txtGUID);
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.swalError(xhr.responseText);
            }
        });
    },
    SinkorinasiKomposisi: function () {
        //debugger;
        let LstData = Data.ListBtp;

        if (LstData.length == 0) {
            clsGlobal.swalWarning("Harap Tambahkan Komposisi");
            return false;
        }

        $.ajax({
            type: "POST",
            url: "/VerFor/SinkronisasiKomposisi",
            datatype: "json",
            async: true,
            data: {
                __RequestVerificationToken: $('#FormulaBTPHeaderForm input[name=__RequestVerificationToken]').val(),
                DataReq: LstData
            },
            success: function (retDat, status, xhr) {
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {

                        clsGlobal.swalSuccess(retDat.txtMessage);

                        Data.ListBtp = JSON.parse(retDat.objData);

                        TableBTPHeader.Render();

                    }
                    else {
                        if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                            clsGlobal.swalWarning(retDat.objData);
                        }
                        else {
                            clsGlobal.swalError(retDat.txtMessage);
                        }
                    }
                    $("#txtGUID").val(retDat.txtGUID);
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.swalError(xhr.responseText);
            }
        });
    },
    TotalJumlahBahan: function () {
        let summedData = 0.0;

        if (Data.ListBtp && Data.ListBtp.length > 0) {
            $.each(Data.ListBtp, function (idx, elm) {
                let val = elm.JumlahBahan ? parseFloat(elm.JumlahBahan) : 0;
                summedData += val;
            });
        }

        let formattedText = `${numeral(summedData).format('0.[0000]')}%`;

        $("#txtJumlahBahanLabel").text(formattedText);
        $("#txtJumlahBahanInside").text(formattedText);

        let $progressBar = $("#progressBarBahan");

        let visualWidth = summedData > 100 ? 100 : summedData;
        $progressBar.css("width", visualWidth + "%");
        $progressBar.attr("aria-valuenow", summedData);

        $progressBar.removeClass("bg-info bg-success bg-warning bg-danger");

        if (summedData > 100.05) {
            $progressBar.addClass("bg-danger");
        }
        else if (summedData >= 99.95 && summedData <= 100.05) {
            $progressBar.addClass("bg-success");
        }
        else if (summedData >= 90) {
            $progressBar.addClass("bg-warning");
        }
        else {
            $progressBar.addClass("bg-info");
        }
    }
}

var IngDetail = {
    CollectData: function () {
        //debugger;

        // collect data UI
        let isLowerKemasanTakaranSaji = $('#perhitunganING-isLowerKemasan').is(":checked");
        let perhitunganJumlahKemasan = $("#perhitunganING-jumlahKemasan").val();
        let perhitunganSatuanJumlahKemasan = $("#perhitunganING-satuanJumlahKemasan").val();

        let acuanLabelGizi = $("#perhitunganING-acuanLabel").find(":selected").val();

        let beratJenis = $("#perhitunganING-beratJenis").val();
        let satuanBeratJenis = $("#perhitunganING-takaranBeratJenisSatuan").text();

        // Binding
        Data.FormulaIns.IsLowerKemasan = `${isLowerKemasanTakaranSaji}`;
        Data.FormulaIns.JumlahKemasan = perhitunganJumlahKemasan;
        Data.FormulaIns.SatuanKemasan = perhitunganSatuanJumlahKemasan;
        Data.FormulaIns.AcuanLabelGizi = acuanLabelGizi;
        Data.FormulaIns.BeratJenis = beratJenis;
        Data.FormulaIns.SatuanBeratJenis = satuanBeratJenis;

        return Data;
    },
    MappingData: function (data) {
        Data.FormulaIns = data.FormulaIns;

        if (Data.FormulaHeader.Status == "SUBMITTED-ING" || Data.FormulaHeader.Status == "ING-APPROVED") {
            isSubmitedING = true;
        }

        $('#perhitunganING-tanggalPermintaan').val(moment(Data.FormulaHeader.RequestDate).isValid() ? moment(Data.FormulaHeader.RequestDate).format("DD MMM YYYY") : "");
        $('#perhitunganING-status').val(Data.FormulaHeader.Status);
        $('#perhitunganING-noProyek').val(Data.FormulaHeader.I2msnumber);
        $('#perhitunganING-noVerifikasi').val(Data.FormulaHeader.VerForNumber);
        $('#perhitunganING-brand').val(Data.FormulaHeader.Brand);
        $('#perhitunganING-subBrand').val(Data.FormulaHeader.SubBrand);
        $('#perhitunganING-varianRasa').val(Data.FormulaHeader.VariantCode);
        $('#perhitunganING-klaim').val(Data.FormulaHeader.Klaim.replace(/\|/g, " "));
        $('#perhitunganING-kategoriPangan').val(Data.FormulaHeader.FoodCategoryName);
        $('#perhitunganING-takaranSaji').val(Data.FormulaHeader.ServingSize);
        $('#perhitunganING-takaranSajiSatuan').text(Data.FormulaHeader.SatuanServingSize);
        $('#perhitunganING-airDitambahkan').val(Data.FormulaHeader.AddedWater);
        $("#perhitunganING-isLowerKemasan").prop("checked", Data.FormulaIns.IsLowerKemasan === 'true' ? true : false).trigger("change");
        $("#perhitunganING-jumlahKemasan").val(Data.FormulaIns.JumlahKemasan);
        $("#perhitunganING-satuanJumlahKemasan").val(Data.FormulaHeader.SatuanServingSize);
        $("#perhitunganING-acuanLabel").val(Data.FormulaIns.AcuanLabelGizi).trigger("change");
        $("#perhitunganING-beratJenis").val(Data.FormulaIns.BeratJenis);
        $("#perhitunganING-satuanBeratJenis").val(Data.FormulaIns.SatuanBeratJenis).trigger("change");

        if (Data.ListDetailIng.length > 0) {
            isGenerated = true;
        }

        TableUploadIngFile.Render();
        TableIngDetail.Render();
        TableIngKlaimTambahan.Render();
        Helper.RenderTooltip();
    },
    SaveData: function () {
        let datReq = IngDetail.CollectData();

        if (datReq) {
            $.ajax({
                type: "POST",
                url: "/VerFor/SaveIngHeader",
                datatype: "json",
                async: true,
                data: {
                    __RequestVerificationToken: $('#FormulaBTPHeaderForm input[name=__RequestVerificationToken]').val(),
                    DataReq: datReq
                },
                success: function (retDat, status, xhr) {
                    if (xhr.responseText.includes("!DOCTYPE html")) {
                        clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                    }
                    else {
                        if (retDat.bitSuccess == true) {

                            clsGlobal.swalSuccess("Sukses save data Perhitungan ING");

                            let datFormulaDet = JSON.parse(retDat.objData);


                            Data.FormulaIns = datFormulaDet.FormulaIns;
                            Data.ListDetailIng = datFormulaDet.ListDetailIng;
                            IngDetail.MappingData(Data);
                        }
                        else {
                            if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                                clsGlobal.swalWarning(retDat.objData);
                            }
                            else {
                                clsGlobal.swalError(retDat.txtMessage);
                            }
                        }
                        $("#txtGUID").val(retDat.txtGUID);
                    }
                },
                error: function (xhr, status, error) {
                    clsGlobal.swalError(xhr.responseText);
                }
            });
        }
    },
}

var TableIngDetail = {
    Add: function () {
        $("#PerhitunganING-ZatGizi-InfoNilaiGizi").val(null).trigger("change");
        $("#PerhitunganING-SatuanZatGizi-InfoNilaiGizi").text("Satuan");

        $('#PerhitunganINGDetailModal').modal('toggle');
    },
    SaveIngDetail: function () {
        var zatGiziVal = $('#PerhitunganING-ZatGizi-InfoNilaiGizi option:selected').val();
        var zatGiziText = $('#PerhitunganING-ZatGizi-InfoNilaiGizi option:selected').text();
        var satuanVal = $('#PerhitunganING-SatuanZatGizi-InfoNilaiGizi').text();

        if (!zatGiziVal) {
            clsGlobal.setMessageWarning("Zat Gizi harus dipilih!");
            return false;
        }

        if (Data.ListDetailIng && Data.ListDetailIng.length > 0) {
            var isDuplicate = Data.ListDetailIng.some(function (row) {
                return row.ZatGizi && row.ZatGizi.trim().toLowerCase() === zatGiziText.trim().toLowerCase();
            });

            if (isDuplicate) {
                clsGlobal.setMessageWarning(`Zat Gizi "<b>${zatGiziText}</b>" sudah ada dalam daftar!`);
                return false;
            }
        }

        var newData = {
            IngDetailId: crypto.randomUUID(),
            IngHeaderId: Data.FormulaIns.IngId,
            VerForHeaderId: Data.FormulaHeader.VerForHeaderId,
            

            ZatGizi: zatGiziText,
            SatuanZatGizi: zatGiziVal,

            ValueAlg: null,

            HasilAnalisaPer100g: null,
            HasilAnalisaPer100ml: null,
            HasilAnalisaPer100kkal: null,
            HasilAnalisaPerSaji: null,
            HasilAnalisaSatuTakaranSaji: null,

            LabelSatuTakaranSaji: null,
            LabelPerSaji: null,
            LabelPer100g: null,
            LabelPer100kkal: null,
            LabelPer100ml: null,

            LabelToleransiTakaranSajiPersen: null,
            LabelToleransiPerSajiPersen: null,
            LabelToleransiPer100gPersen: null,
            LabelToleransiPer100kkalPersen: null,
            LabelToleransiPer100mlPersen: null,

            PersenAkglabelSatuTakaranSaji: null,
            PersenAkglabelPerSaji: null,
            PersenAkglabelToleransiSatuTakaranSaji: null,
            PersenAkglabelToleransiPerSaji: null,

            IsSesuaiKarDar: null,
            IsVoid: false,
            BitActive: true
        };

        $.ajax({
            type: "POST",
            url: "/VerFor/SaveAIngDetail",
            datatype: "json",
            async: true,
            data: {
                __RequestVerificationToken: $('#perhitunganINGForm input[name=__RequestVerificationToken]').val(),
                DataING: newData
            },
            success: function (retDat, status, xhr) {
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        //debugger;
                        clsGlobal.swalSuccess("Sukses tambah Informasi Nilai Gizi");
                        Data.ListDetailIng.push(retDat.objData);
                        TableIngDetail.Render();
                    }
                    else {
                        if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                            clsGlobal.swalWarning(retDat.objData);
                        }
                        else {
                            clsGlobal.swalError(retDat.txtMessage);
                        }
                    }
                    $("#txtGUID").val(retDat.txtGUID);
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.swalError(xhr.responseText);
            }
        });

        $('#PerhitunganINGDetailModal').modal('hide');

        return true;
    },
    Edit: function (button) {
        var row = $(button).closest('tr');
        var data = oTableIngDetail.row(row).data();

        if (data) {
            console.log(data);

            // Informasi Nilai Gizi
            $("#PerhitunganING-ZatGizi-InfoNilaiGizi").val(data.ZatGizi);
            $("#PerhitunganING-SatuanZatGizi-InfoNilaiGizi").val(data.SatuanZatGizi);

            // Acuan Label Gizi Dan Karakteristik Dasar
            $("#PerhitunganING-ValueALG-AcuanLabel").val(data.ValueAlg);
            $("#PerhitunganING-SatuanALG-AcuanLabel").val(data.SatuanZatGizi);
            $("#PerhitunganING-MinKardar-AcuanLabel").val(data.MinKardar);
            $("#PerhitunganING-MaxKardar-AcuanLabel").val(data.MaxKardar);
            $("#PerhitunganING-SatuanKardar-AcuanLabel").val(data.UomSystemKardar);

            // Hasil Analisa
            $("#PerhitunganING-Per100gr-HasilAnalisa").val(data.ValueAlg);
            $("#PerhitunganING-Per100ml-HasilAnalisa").val(data.SatuanZatGizi);
            $("#PerhitunganING-Per100Kkal-HasilAnalisa").val(data.MinKardar);
            $("#PerhitunganING-PerSaji-HasilAnalisa").val(data.MaxKardar);
            $("#PerhitunganING-Kurang1TakaranSaji-HasilAnalisa").val(data.UomSystemKardar);

            // Kesesuaian
            $('#PerhitunganING-KesesuaianKardar-Kesesuaian').val(data.IsSesuaiKarDar);

            //% AKG Berdasarkan Analisa
            $("#PerhitunganING-PerSaji-PersenAKGAnalisa").val(data.AkganalisaPerSaji);
            $("#PerhitunganING-Kurang1TakaranSaji-PersenAKGAnalisa").val(data.AkganalisaSatuTakaranSaji);

            // Pencantuman di Label
            $("#PerhitunganING-Kurang1TakaranSaji-PencantumanLabel").val(data.LabelSatuTakaranSaji);
            $("#PerhitunganING-ToleransiKurang1TakaranSaji-PencantumanLabel").val(data.LabelToleransiTakaranSajiPersen);
            $("#PerhitunganING-PerSaji-PencantumanLabel").val(data.LabelPerSaji);
            $("#PerhitunganING-ToleransiPerSaji-PencantumanLabel").val(data.LabelToleransiPerSajiPersen);
            $("#PerhitunganING-Per100g-PencantumanLabel").val(data.LabelPer100g);
            $("#PerhitunganING-ToleransiPer100g-PencantumanLabel").val(data.LabelToleransiPer100gPersen);
            $("#PerhitunganING-Per100Kkal-PencantumanLabel").val(data.LabelPer100kkal);
            $("#PerhitunganING-ToleransiPer100Kkal-PencantumanLabel").val(data.LabelPer100kkalPersen);
            $("#PerhitunganING-Per100ml-PencantumanLabel").val(data.LabelPer100ml);
            $("#PerhitunganING-ToleransiPer100ml-PencantumanLabel").val(data.LabelToleransiPer100mlPersen);

            // Pencantuman % AKG di Label
            $("#PerhitunganING-Kurang1TakaranSaji-PencantumanPersenAKG").val(data.PersenAkglabelSatuTakaranSaji);
            $("#PerhitunganING-ToleransiKurang1TakaranSaji-PencantumanPersenAKG").val(data.PersenAkglabelToleransiSatuTakaranSaji);
            $("#PerhitunganING-PerSaji-PencantumanPersenAKG").val(data.PersenAkglabelPerSaji);
            $("#PerhitunganING-PersenToleransiPerSaji-PencantumanPersenAKG").val(data.PersenAkglabelToleransiPerSaji);

            // Other Input
            $("#PerhitunganING-KlaimPadaLabel-OtherInput").val(data.KlaimLabel);
            $("#PerhitunganING-SyaratKlaim-OtherInput").val(data.SyaratKlaim);
            $("#PerhitunganING-PersenAKGPer100g-OtherInput").val(data.KlaimAkgpersen);
            $("#PerhitunganING-HitungKlaimKandungan-OtherInput").val(data.PerhitunganKlaimKandunganFungsi);
            $("#PerhitunganING-Catatan-OtherInput").val(data.Reason);

            $('#PerhitunganINGDetailModal').modal('toggle');
        } else {
            clsGlobal.swalWarning("Data Tidak Ditemukan!");
        }

    },
    Render: function () {
        //debugger;

        const status = Data && Data.FormulaHeader ? Data.FormulaHeader.Status.toUpperCase() : "";
        const role = usrRole ? usrRole.toUpperCase() : "";
        const IsApproveinitRA = Data.FormulaHeader.Status === "REQUESTED" ? false : true;

        const editableStatuses = [
            "REQUESTED",
            "IN-PROGRESS",
            "NEED REVISION-VERFOR",
            "UPDATE-ING",
            "NEED REVISION-ING",
            "VERFOR-APPROVED"
        ];

        const canManageIng = (role === "ADMINISTRATOR") ||
            (role === "PDV" && editableStatuses.includes(status) && IsApproveinitRA);

        if (oTableIngDetail) {
            oTableIngDetail.destroy();
        }

        if (Data.ListDetailIng && Data.ListDetailIng.length > 0) {
            $("#perhitunganING-acuanLabel").attr("disabled", "disabled");
            $("#perhitunganING-jumlahKemasan").attr("disabled", "disabled");
            $("#perhitunganING-isLowerKemasan").attr("disabled", "disabled");
            $("#perhitunganING-beratJenis").attr("disabled", "disabled");

            $("#btnGenerate").addClass("d-none");

            $("#PerhitunganIng-btnAdd").addClass("d-none");
        }
        else {
            if (canManageIng) {
                $("#perhitunganING-acuanLabel").removeAttr("disabled");
                $("#perhitunganING-jumlahKemasan").removeAttr("disabled");
                $("#perhitunganING-isLowerKemasan").removeAttr("disabled");
                $("#perhitunganING-beratJenis").removeAttr("disabled");

                $("#btnGenerate").removeClass("d-none");
                $("#PerhitunganIng-btnAdd").removeClass("d-none");
            } else {
                $("#perhitunganING-acuanLabel").attr("disabled", "disabled");
                $("#btnGenerate").addClass("d-none");
                $("#PerhitunganIng-btnAdd").addClass("d-none");
            }
        }

        if (canManageIng) {
            if (isGenerated) {
                $("#btnClear").addClass("d-none");
                $("#PerhitunganIng-btnAdd").removeClass("d-none");
            }
            else {
                if (Data.ListDetailIng && Data.ListDetailIng.length > 0) {
                    $("#btnClear").removeClass("d-none");
                } else {
                    $("#btnClear").addClass("d-none");
                }

                $("#PerhitunganIng-btnAdd").addClass("d-none");
            }
        } else {
            $("#btnClear").addClass("d-none");
            $("#PerhitunganIng-btnAdd").addClass("d-none");
        }

        oTableIngDetail = $('#perhitunganIng-tableIngDetail').DataTable({
            "data": Data.ListDetailIng.sort((a, b) => a.SeqNo - b.SeqNo),
            "dom": 'flrtip',
            fixedColumns: {
                left: 2,
                right: 1
            },
            "columns": [
                {
                    "data": null,
                    "defaultContent": "",
                    "width": "50px",
                    render: function (data, type, row, meta) {
                        if (Array.isArray(meta.row)) {
                            return meta.row[0] + 1;
                        }

                        return meta.row + 1;
                        
                    }
                },
                {
                    "data": "ZatGizi",
                    "defaultContent": "null",
                    "width": "150px",
                    render: function (data, type, row) {
                        return data;
                    }
                },
                {
                    "data": "SatuanZatGizi",
                    "defaultContent": "null",
                    "width": "50px",
                },
                {
                    "data": "ValueAlg",
                    "defaultContent": "null",
                    render: function (data, type, row) {
                        if (data == null) {
                            return "null"
                        }

                        return numeral(data).format(',.[0000]');
                    }
                },
                {
                    "data": "UomAlg",
                    "defaultContent": "null",
                },
                {
                    "data": "MinKardar",
                    defaultContent: "null",
                    render: function (data, type, row) {
                        if (data == null) {
                            return "null"
                        }

                        return numeral(data).format(',.[0000]');
                    }
                },
                {
                    "data": "MaxKardar",
                    defaultContent: "null",
                    render: function (data, type, row) {
                        if (data == null) {
                            return "null"
                        }

                        return numeral(data).format(',.[0000]');
                    }
                },
                {
                    "data": "UomSystemKardar",
                    defaultContent: "null",
                    render: function (data, type, row) {
                        if (data == null) {
                            return "null"
                        }

                        return data;
                    }
                },
                {
                    "data": "HasilAnalisaPer100g",
                    "defaultContent": "null",
                    render: function (data, type, row, meta) {
                        if (canManageIng) {
                            var formattedVal = (data === null || data === undefined || data === "")
                                ? ""
                                : numeral(data).format(',.[0000]');

                            var disabledAttr = (row.IsVoid === true) ? 'disabled' : '';

                            return `<input type="text" 
                                   class="form-control form-control-sm text-end"
                                   style="min-width: 80px;"
                                   value="${formattedVal}"
                                   ${disabledAttr}
                                   onchange="TableIngDetail.UpdateHasilAnalisa(${meta.row}, 'HasilAnalisaPer100g', this.value)">`;
                        }
                        else {
                            return formattedVal = (data === null || data === undefined || data === "")
                                ? "null"
                                : numeral(data).format(',.[0000]');
                        }
                        
                    }
                },
                {
                    "data": "HasilAnalisaPer100ml",
                    "defaultContent": "null",
                    render: function (data, type, row, meta) {
                        if (canManageIng) {
                            var formattedVal = (data === null || data === undefined || data === "")
                                ? ""
                                : numeral(data).format(',.[0000]');

                            var disabledAttr = (row.IsVoid === true) ? 'disabled' : '';

                            return `<input type="text" 
                                   class="form-control form-control-sm text-end"
                                   style="min-width: 80px;"
                                   value="${formattedVal}"
                                   ${disabledAttr}
                                   onchange="TableIngDetail.UpdateHasilAnalisa(${meta.row}, 'HasilAnalisaPer100ml', this.value)">`;
                        }
                        else {
                            return formattedVal = (data === null || data === undefined || data === "")
                                ? "null"
                                : numeral(data).format(',.[0000]');
                        }
                        
                    }
                },
                {
                    "data": "HasilAnalisaPer100kkal",
                    "defaultContent": "null",
                    render: function (data, type, row) {

                        if (data == null) {
                            return "null";
                        }
                        else {
                            return numeral(data).format(',.[0000]');
                        }
                    }
                },
                {
                    "data": "HasilAnalisaPerSaji",
                    "defaultContent": "null",
                    render: function (data, type, row) {
                        if (data == null) {
                            return "null";
                        }
                        else {
                            return numeral(data).format(',.[0000]');
                        }
                    }
                },
                {
                    "data": "HasilAnalisaSatuTakaranSaji",
                    "defaultContent": "null",
                    render: function (data, type, row) {

                        var is1TakSaji = Data.FormulaIns.IsLowerKemasan === "true" ? true : false;

                        if (is1TakSaji) {

                            if (data == null) {
                                return "null";
                            }

                            return numeral(data).format(',.[0000]');
                        }
                        else {
                            return "null"
                        }
                    }
                },
                {
                    "data": "IsSesuaiKarDar",
                    "defaultContent": "null",
                    render: function (data, type, row) {
                        return data == null ? "" : data;
                    }
                },
                {
                    "data": "AkganalisaSatuTakaranSaji",
                    "defaultContent": "null",
                    render: function (data, type, row) {
                        if (data == null) {
                            return "null";
                        }
                        else {
                            return numeral(data).format(',.[0000]');
                        }
                    }
                },
                {
                    "data": "AkganalisaPerSaji",
                    "defaultContent": "null",
                    render: function (data, type, row) {
                        if (data == null) {
                            return "null";
                        }
                        else {
                            return numeral(data).format(',.[0000]');
                        }
                    }
                },
                {
                    "data": "LabelSatuTakaranSaji",
                    "defaultContent": "null",
                    render: function (data, type, row, meta) {
                        if (canManageIng) {
                            var is1TakSaji = Data.FormulaIns.IsLowerKemasan === "true" ? true : false;
                            if (is1TakSaji) {
                                var formattedVal = (data === null || data === undefined || data === "")
                                    ? ""
                                    : numeral(data).format(',.[0000]');

                                var disabledAttr = (row.IsVoid === true) ? 'disabled' : '';

                                return `<input type="text" 
                                   class="form-control form-control-sm text-end"
                                   style="min-width: 80px;"
                                   value="${formattedVal}"
                                   ${disabledAttr}
                                   onchange="TableIngDetail.UpdateHasilPencantumanLabel(${meta.row}, 'LabelSatuTakaranSaji', this.value)">`;
                            }
                            else {
                                return "null";
                            }
                        }
                        else {
                            return formattedVal = (data === null || data === undefined || data === "")
                                ? "null"
                                : numeral(data).format(',.[0000]');
                        }
                    }
                },
                {
                    "data": "LabelToleransiTakaranSajiPersen",
                    "defaultContent": "null",
                    render: function (data, type, row) {
                        var is1TakSaji = Data.FormulaIns.IsLowerKemasan === "true" ? true : false;

                        if (is1TakSaji) {
                            if (data == null) {
                                return "null";
                            }

                            return numeral(data).format(',.[0000]');
                        }
                        else {
                            return "null";
                        }
                        
                    }
                },
                {
                    "data": "LabelPerSaji",
                    "defaultContent": "null",
                    render: function (data, type, row, meta) {
                        if (canManageIng) {
                            var formattedVal = (data === null || data === undefined || data === "")
                                ? ""
                                : numeral(data).format(',.[0000]');

                            var disabledAttr = (row.IsVoid === true) ? 'disabled' : '';

                            return `<input type="text" 
                                   class="form-control form-control-sm text-end"
                                   style="min-width: 80px;"
                                   value="${formattedVal}"
                                   ${disabledAttr}
                                   onchange="TableIngDetail.UpdateHasilPencantumanLabel(${meta.row}, 'LabelPerSaji', this.value)">`;
                        }
                        else {
                            return formattedVal = (data === null || data === undefined || data === "")
                                ? "null"
                                : numeral(data).format(',.[0000]');
                        }
                    }
                },
                {
                    "data": "LabelToleransiPerSajiPersen",
                    "defaultContent": "null",
                    render: function (data, type, row) {
                        if (data == null) {
                            return "null";
                        }
                        else {
                            return numeral(data).format(',.[0000]');
                        }
                    }
                },
                {
                    "data": "LabelPer100g",
                    "defaultContent": "null",
                    render: function (data, type, row, meta) {
                        if (canManageIng) {
                            var formattedVal = (data === null || data === undefined || data === "")
                                ? ""
                                : numeral(data).format(',.[0000]');

                            var disabledAttr = (row.IsVoid === true) ? 'disabled' : '';

                            return `<input type="text" 
                                   class="form-control form-control-sm text-end"
                                   style="min-width: 80px;"
                                   value="${formattedVal}"
                                   ${disabledAttr}
                                   onchange="TableIngDetail.UpdateHasilPencantumanLabel(${meta.row}, 'LabelPer100g', this.value)">`;
                        }
                        else {
                            return formattedVal = (data === null || data === undefined || data === "")
                                ? "null"
                                : numeral(data).format(',.[0000]');
                        }
                    }
                },
                {
                    "data": "LabelToleransiPer100gPersen",
                    "defaultContent": "null",
                    render: function (data, type, row) {
                        if (data == null) {
                            return "null";
                        }
                        else {
                            return numeral(data).format(',.[0000]');
                        }
                    }
                },
                {
                    "data": "LabelPer100kkal",
                    "defaultContent": "null",
                    render: function (data, type, row, meta) {
                        if (canManageIng) {
                            var formattedVal = (data === null || data === undefined || data === "")
                                ? ""
                                : numeral(data).format(',.[0000]');

                            var disabledAttr = (row.IsVoid === true) ? 'disabled' : '';

                            return `<input type="text" 
                                   class="form-control form-control-sm text-end"
                                   style="min-width: 80px;"
                                   value="${formattedVal}"
                                   ${disabledAttr}
                                   onchange="TableIngDetail.UpdateHasilPencantumanLabel(${meta.row}, 'LabelPer100kkal', this.value)">`;
                        }
                        else {
                            return formattedVal = (data === null || data === undefined || data === "")
                                ? "null"
                                : numeral(data).format(',.[0000]');
                        }
                    }
                },
                {
                    "data": "LabelPer100kkalPersen",
                    "defaultContent": "null",
                    render: function (data, type, row) {
                        if (data == null) {
                            return "null";
                        }
                        else {
                            return numeral(data).format(',.[0000]');
                        }
                    }
                },
                {
                    "data": "LabelPer100ml",
                    "defaultContent": "null",
                    render: function (data, type, row, meta) {
                        if (canManageIng) {
                            var formattedVal = (data === null || data === undefined || data === "")
                                ? ""
                                : numeral(data).format(',.[0000]');

                            var disabledAttr = (row.IsVoid === true) ? 'disabled' : '';

                            return `<input type="text" 
                                   class="form-control form-control-sm text-end"
                                   style="min-width: 80px;"
                                   value="${formattedVal}"
                                   ${disabledAttr}
                                   onchange="TableIngDetail.UpdateHasilPencantumanLabel(${meta.row}, 'LabelPer100ml', this.value)">`;
                        }
                        else {
                            return formattedVal = (data === null || data === undefined || data === "")
                                ? "null"
                                : numeral(data).format(',.[0000]');
                        }
                    }
                },
                {
                    "data": "LabelToleransiPer100mlPersen",
                    "defaultContent": "null",
                    render: function (data, type, row) {
                        if (data == null) {
                            return "null";
                        }
                        else {
                            return numeral(data).format(',.[0000]');
                        }
                    }
                },
                {
                    "data": "PersenAkglabelSatuTakaranSaji",
                    "defaultContent": "null",
                    render: function (data, type, row, meta) {
                        if (canManageIng) {

                            var valAlg = (row.ValueAlg == null) ? true : false;

                            if (valAlg) {
                                return "null";
                            }

                            var is1TakSaji = Data.FormulaIns.IsLowerKemasan === "true" ? true : false;

                            if (is1TakSaji) {
                                var formattedVal = (data === null || data === undefined || data === "")
                                    ? ""
                                    : numeral(data).format(',.[0000]');

                                var disabledAttr = (row.IsVoid === true) ? 'disabled' : '';

                                return `<input type="text" 
                                   class="form-control form-control-sm text-end"
                                   style="min-width: 80px;"
                                   value="${formattedVal}"
                                   ${disabledAttr}
                                   onchange="TableIngDetail.UpdateHasilPersenAKG(${meta.row}, 'PersenAkglabelSatuTakaranSaji', this.value)">`;
                            }
                            else {
                                return "null"
                            }
                        }
                        else {
                            return formattedVal = (data === null || data === undefined || data === "")
                                ? "null"
                                : numeral(data).format(',.[0000]');
                        }
                    }
                },
                {
                    "data": "PersenAkglabelToleransiSatuTakaranSaji",
                    "defaultContent": "null",
                    render: function (data, type, row) {
                        if (data == null) {
                            return "null";
                        }
                        else {
                            return numeral(data).format(',.[0000]');
                        }
                    }
                },
                {
                    "data": "PersenAkglabelPerSaji",
                    "defaultContent": "null",
                    render: function (data, type, row, meta) {
                        if (canManageIng) {

                            var valAlg = (row.ValueAlg == null) ? true : false;

                            if (valAlg) {
                                return "null";
                            }


                            var formattedVal = (data === null || data === undefined || data === "")
                                ? ""
                                : numeral(data).format(',.[0000]');

                            var disabledAttr = (row.IsVoid === true) ? 'disabled' : '';

                            return `<input type="text" 
                                   class="form-control form-control-sm text-end"
                                   style="min-width: 80px;"
                                   value="${formattedVal}"
                                   ${disabledAttr}
                                   onchange="TableIngDetail.UpdateHasilPersenAKG(${meta.row}, 'PersenAkglabelPerSaji', this.value)">`;
                        }
                        else {
                            return formattedVal = (data === null || data === undefined || data === "")
                                ? "null"
                                : numeral(data).format(',.[0000]');
                        }
                    }
                },
                {
                    "data": "PersenAkglabelToleransiPerSaji",
                    "defaultContent": "null",
                    render: function (data, type, row) {
                        if (data == null) {
                            return "null";
                        }
                        else {
                            return numeral(data).format(',.[0000]');
                        }
                    }
                },
                {
                    "data": "KlaimLabel",
                    defaultContent: "null",
                    render: function (data, type, row) {
                        return data;
                    }
                },
                {
                    "data": "SyaratKlaim",
                    defaultContent: "null",
                    render: function (data, type, row) {
                        return data;
                    }
                },
                {
                    "data": "KlaimAkgpersen",
                    "defaultContent": "null",
                    render: function (data, type, row) {
                        if (data == null) {
                            return "null";
                        }

                        return numeral(data).format(',.[0000]');
                    }
                },
                {
                    "data": "PerhitunganKlaimKandunganFungsi",
                    "defaultContent": "null",
                    "width": "250px",
                    render: function (data, type, row, meta) {
                        if (canManageIng) {
                            var val = (data === null || data === undefined) ? "" : data;

                            var disabledAttr = (row.IsVoid === true) ? 'disabled' : '';

                            return `<textarea class="form-control form-control-sm"
                                      rows="2"
                                      maxlength="1000"
                                      style="min-width: 200px; resize: vertical;"
                                      ${disabledAttr}
                                      onchange="TableIngDetail.UpdateStringValue(${meta.row}, 'PerhitunganKlaimKandunganFungsi', this.value)">${val}</textarea>`;
                        }
                        else {
                            return val = (data === null || data === undefined) ? "null" : data;
                        }
                    }
                },
                {
                    "data": "Reason",
                    "defaultContent": "null",
                    "width": "250px",
                    render: function (data, type, row, meta) {
                        var val = (data === null || data === undefined) ? "" : data;

                        if (role == "PDV") {
                            return val;
                        }
                        else if ((role == "RA" || role == "ADMINISTRATOR") && status === "SUBMITTED-ING") {
                            if (row.IsVoid) {
                                return "";
                            }

                            return `<textarea class="form-control form-control-sm"
                                      rows="2"
                                      maxlength="1000"
                                      style="min-width: 200px; resize: vertical;"
                                      onchange="TableIngDetail.UpdateStringValue(${meta.row}, 'Reason', this.value)">${val}</textarea>`;
                        }
                        else {
                            return val;
                        }
                    }
                },
                {
                    "data": "IsVoid",
                    "width": "50px",
                    "className": "text-center align-middle",
                    title: canManageIng ? `Void
                                                    <input type="checkbox"
                                                           class="form-check-input"
                                                           id="cbHeaderVoid"
                                                           style="cursor: pointer; width: 20px; height: 20px;">` : "Void",
                    "orderable": false,
                    render: function (data, type, row, meta) {
                        if (canManageIng) {
                            var isChecked = data === true ? 'checked' : '';

                            return `<input type="checkbox" 
                                   class="form-check-input cb-void-item" 
                                   style="cursor: pointer; width: 20px; height: 20px;"
                                   ${isChecked}
                                   onchange="TableIngDetail.UpdateBooleanValue(${meta.row}, 'IsVoid', this.checked)">`;
                        }
                        else {
                            if (data) {
                                // Gunakan fa-check
                                return `<i class="fas fa-check" style="color: green;"></i>`;
                            }
                            else {
                                return ``;
                            }
                        }
                    }
                },
                {
                    "data": null,
                    "defaultContent": "null",
                    render: function (data, type, row) {
                        if (canManageIng) {
                            var strHtml = '<div class="btn-group" role="group" aria-label="Action Buttons">';
                            //strHtml += `<button title="Edit Data" data-bs-toggle="tooltip" data-bs-placement="top" type="button" class='btn btn-warning btn-sm' onclick='TableIngDetail.Edit(this)'><i class="fas fa-pencil-alt me-1"></i></button> &nbsp;`;

                            if (!row.IsGenerated) {
                                strHtml += `<button title="Delete Data" data-bs-toggle="tooltip" data-bs-placement="top" type="button" class='btn btn-danger btn-sm' onclick='TableIngDetail.Delete(this)'><i class="fas fa-trash me-1"></i></button>`;
                            }

                            strHtml += `</div>`;
                            return strHtml;
                        }
                        else {
                            return "";
                        }
                    }
                },
            ],
            "pageLength": 100,
            "paging": true,
            "searching": true,
            "ordering": false,
            "autoWidth": false,
            scrollX: true,
            scrollY: "450px",
            "drawCallback": function (settings) {
                var api = this.api();
                api.rows().every(function () {
                    var data = this.data();
                    var node = this.node();
                    if (data.IsVoid) {
                        $(node).find('td').not(':has(input[type="checkbox"])').css({
                            'background-color': '#eeeeee',
                            'color': '#a1a1a1'
                        });
                    }
                });
            }
        });

        $('#perhitunganIng-tableIngDetail').DataTable().columns.adjust().draw();
        Helper.RenderTooltip();
    },
    Delete: function (button) {
        var row = $(button).closest('tr');
        var data = oTableIngDetail.row(row).data();

        if (data) {
            //debugger;
            let lstData = Data.ListDetailIng;
            let datDet = lstData.find(item => item.IngDetailId == data.IngDetailId);

            if (datDet) {
                $.ajax({
                    type: "POST",
                    url: "/VerFor/DeleteIngDetail",
                    datatype: "json",
                    async: true,
                    data: {
                        __RequestVerificationToken: $('#perhitunganINGForm input[name=__RequestVerificationToken]').val(),
                        DataING: datDet.IngDetailId
                    },
                    success: function (retDat, status, xhr) {
                        if (xhr.responseText.includes("!DOCTYPE html")) {
                            clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                        }
                        else {
                            if (retDat.bitSuccess == true) {
                                //debugger;
                                clsGlobal.swalSuccess("Sukses delete Informasi Nilai Gizi");

                                Data.ListDetailIng = Data.ListDetailIng.filter(x => x.IngDetailId != data.IngDetailId);
                                TableIngDetail.Render();
                            }
                            else {
                                if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                                    clsGlobal.swalWarning(retDat.objData);
                                }
                                else {
                                    clsGlobal.swalError(retDat.txtMessage);
                                }
                            }
                            $("#txtGUID").val(retDat.txtGUID);
                        }
                    },
                    error: function (xhr, status, error) {
                        clsGlobal.swalError(xhr.responseText);
                    }
                });
            }
            else {
                clsGlobal.swalWarning("Data Tidak Ditemukan!");
            }
        }
        else {
            clsGlobal.swalWarning("Data Tidak Ditemukan!");
        }
    },
    Generate: function () {

        // Validation
        let acuanLabelGizi = $("#perhitunganING-acuanLabel").find(":selected").val();
        let beratJenis = $("#perhitunganING-beratJenis").val();

        if (acuanLabelGizi == null || acuanLabelGizi == "") {
            clsGlobal.swalWarning("Pilih Acuan Gizi Terlebih Dahulu!");
            return false;
        }
        else if (beratJenis == null || beratJenis == "") {
            clsGlobal.swalWarning("Isi Berat Jenis Terlebih Dahulu!");
            return false;
        }


        $.ajax({
            type: "POST",
            url: "/VerFor/GenerateINGDetail",
            datatype: "json",
            async: true,
            data: {
                __RequestVerificationToken: $('#FormulaBTPHeaderForm input[name=__RequestVerificationToken]').val(),
                AlgGroup: $("#perhitunganING-acuanLabel").find(":selected").val(),
                CatPangan: Data.FormulaHeader.FoodCategoryId,
                HeaderId: Data.FormulaHeader.VerForHeaderId
            },
            success: function (retDat, status, xhr) {
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {

                        Data.ListDetailIng = JSON.parse(retDat.objData);
                        TableIngDetail.Render();

                        if (Data.ListDetailIng.length > 0) {
                            var alertBox = $('#alertUnsaved');

                            alertBox.removeClass('show').addClass('d-none');

                            alertBox.removeClass('d-none');

                            setTimeout(function () {
                                alertBox.addClass('show');
                            }, 50);

                            clsGlobal.swalSuccess("Sukses generate data Informasi Nilai Gizi");
                        }
                        else
                        {
                            clsGlobal.swalWarning("Generate berhasil namun data tidak ditemukan. Mohon pastikan mapping Acuan Label Gizi dan Kategori Pangan sudah terdaftar di Master KarDar.");
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
                    $("#txtGUID").val(retDat.txtGUID);
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.swalError(xhr.responseText);
            }
        });

        return true;
    },
    Save: function () {
        //let datReq = Data.ListDetailIng;

        //let datReqMap = datReq.map(x => ({
        //    ...x,
        //    VerForHeaderId: Data.FormulaHeader.VerForHeaderId,
        //    IngHeaderId: Data.FormulaIns.IngId
        //}));

        //// Binding Data to Model
        //Data.ListDetailIng = datReqMap;

        FormulaHeaderHeader.CollectData();
        FormulaDetail.CollectData();
        IngDetail.CollectData();

        $.ajax({
            type: "POST",
            url: "/VerFor/SaveVerFor",
            datatype: "json",
            async: true,
            data: {
                __RequestVerificationToken: $('#perhitunganINGForm input[name=__RequestVerificationToken]').val(),
                DataReq: Data
            },
            success: function (retDat, status, xhr) {
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        //debugger;

                        clsGlobal.swalSuccess("Sukses save data Informasi Nilai Gizi");
                        isGenerated = true;
                        Data = JSON.parse(retDat.objData);
                        IngDetail.MappingData(Data);
                        TableIngDetail.Render();

                        closeAlert();
                    }
                    else {
                        if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                            clsGlobal.swalWarning(retDat.objData);
                        }
                        else {
                            clsGlobal.swalError(retDat.txtMessage);
                        }
                    }
                    $("#txtGUID").val(retDat.txtGUID);
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.swalError(xhr.responseText);
            }
        });
    },
    RecalculateAnalisaRow: function (rowIndex, type) {
        var rowData = Data.ListDetailIng[rowIndex];

        var datDetEnergi = Data.ListDetailIng.find(x => x.ZatGizi.toLowerCase() === "energy");

        if (type == "HasilAnalisaPer100g") {
            var per100g = rowData.HasilAnalisaPer100g || 0;

            // per 100kkal
            if (datDetEnergi != undefined) {
                var EnergiVal = datDetEnergi.HasilAnalisaPer100g;

                if (EnergiVal == null) {
                    clsGlobal.setMessageWarning(`Isi Dahulu Hasil Analisa untuk Zat Gizi ${datDetEnergi.ZatGizi}`);

                    rowData.HasilAnalisaPer100kkal = null;
                    rowData.HasilAnalisaPer100g = null;
                    rowData.HasilAnalisaPer100ml = null;
                    return false;
                }
                else {
                    rowData.HasilAnalisaPer100kkal = (100 / EnergiVal) * per100g;
                }
            }
            else {
                rowData.HasilAnalisaPer100kkal = null;
                rowData.HasilAnalisaPer100g = null;
                rowData.HasilAnalisaPer100ml = null;
                return false;
            }

            // Takaran Saji
            var beratSaji = parseFloat(Data.FormulaHeader.ServingSize);
            rowData.HasilAnalisaPerSaji = (per100g * beratSaji) / 100;

            // < 1 Takaran Saji
            var is1TakSaji = Data.FormulaIns.IsLowerKemasan === "true" ? true : false;

            if (is1TakSaji) {
                var algTakSaji = parseFloat(Data.FormulaIns.JumlahKemasan);
                rowData.HasilAnalisaSatuTakaranSaji = (per100g * algTakSaji) / 100;
            }
            else {
                rowData.HasilAnalisaSatuTakaranSaji = null;
            }

            // Sesuai dengan Kardar
            if (rowData.MaxKardar != null && rowData.MinKardar != null) {
                var datMinKardar = parseFloat(rowData.MinKardar);
                var dataMaxKardar = parseFloat(rowData.MaxKardar);

                //debugger;
                if (datMinKardar <= parseFloat(per100g) && dataMaxKardar >= parseFloat(per100g)) {
                    rowData.IsSesuaiKarDar = "MS";
                }
                else {
                    rowData.IsSesuaiKarDar = "TMS";
                }
            }
            else {
                rowData.IsSesuaiKarDar = "null";
            }

            // % AKG Per 100g (Pemeriksaan Klaim)

            if (rowData.ValueAlg == null) {
                rowData.KlaimAkgpersen = null;
            }
            else {
                rowData.KlaimAkgpersen = (per100g / rowData.ValueAlg) * 100;
            }

            return true;
        }
        else if (type == "HasilAnalisaPer100ml") {
            var per100ml = rowData.HasilAnalisaPer100ml || 0;

            // per 100kkal
            if (datDetEnergi != undefined) {
                var EnergiVal = datDetEnergi.HasilAnalisaPer100ml;

                if (EnergiVal == null) {
                    clsGlobal.setMessageWarning(`Isi Dahulu Hasil Analisa untuk Zat Gizi ${datDetEnergi.ZatGizi}`);

                    rowData.HasilAnalisaPer100kkal = null;
                    rowData.HasilAnalisaPer100g = null;
                    rowData.HasilAnalisaPer100ml = null;
                    return false;
                }
                else {
                    rowData.HasilAnalisaPer100kkal = (100 / EnergiVal) * per100ml;
                }
            }
            else {
                rowData.HasilAnalisaPer100kkal = null;
                rowData.HasilAnalisaPer100g = null;
                rowData.HasilAnalisaPer100ml = null;
                return false;
            }

            // Takaran Saji
            var beratSaji = parseFloat(Data.FormulaHeader.ServingSize);
            rowData.HasilAnalisaPerSaji = (per100ml * beratSaji) / 100;

            // < 1 Takaran Saji
            var is1TakSaji = Data.FormulaIns.IsLowerKemasan === "true" ? true : false;

            if (is1TakSaji) {
                var algTakSaji = parseFloat(Data.FormulaIns.JumlahKemasan);
                rowData.HasilAnalisaSatuTakaranSaji = (per100ml * algTakSaji) / 100;
            }
            else {
                rowData.HasilAnalisaSatuTakaranSaji = null;
            }

            // Sesuai dengan Kardar
            if (rowData.MaxKardar != null && rowData.MinKardar != null) {
                var datMinKardar = parseFloat(rowData.MinKardar);
                var dataMaxKardar = parseFloat(rowData.MaxKardar);

                if (datMinKardar <= parseFloat(per100ml) && dataMaxKardar >= parseFloat(per100ml)) {
                    rowData.IsSesuaiKarDar = "MS";
                }
                else {
                    rowData.IsSesuaiKarDar = "TMS";
                }
            }
            else {
                rowData.IsSesuaiKarDar = "null";
            }

            // % AKG Per 100g (Pemeriksaan Klaim)
            if (rowData.ValueAlg == null) {
                rowData.KlaimAkgpersen = null;
            }
            else {
                rowData.KlaimAkgpersen = (rowData.HasilAnalisaPer100g / rowData.ValueAlg) * 100;
            }

            return true;
        }

        Data.ListDetailIng[rowIndex] = rowData;
    },
    RecalculatePercentAKGRow: function (rowIndex) {
        var rowData = Data.ListDetailIng[rowIndex];
        // Acuan Gizi Val
        var algVal = rowData.ValueAlg;

        if (algVal == null) {
            return;
        }

        // Takaran Saji
        rowData.AkganalisaPerSaji = (rowData.HasilAnalisaPerSaji / algVal) * 100;

        // < 1 Takaran Saji
        var is1TakSaji = Data.FormulaIns.IsLowerKemasan === "true" ? true : false;

        if (is1TakSaji) {
            rowData.AkganalisaSatuTakaranSaji = (rowData.HasilAnalisaSatuTakaranSaji / algVal) * 100;
        }
        else {
            rowData.AkganalisaSatuTakaranSaji = null;
        }

        Data.ListDetailIng[rowIndex] = rowData;
    },
    RecalculatePercentLabelToleranRow: function (rowIndex) {
        var rowData = Data.ListDetailIng[rowIndex];

        // LabelSatuTakaranSaji
        var is1TakSaji = Data.FormulaIns.IsLowerKemasan === "true" ? true : false;

        if (is1TakSaji) {
            rowData.LabelToleransiTakaranSajiPersen = (rowData.HasilAnalisaSatuTakaranSaji / rowData.LabelSatuTakaranSaji) * 100;
        }

        // LabelPerSaji
        rowData.LabelToleransiPerSajiPersen = (rowData.HasilAnalisaSatuTakaranSaji / rowData.LabelSatuTakaranSaji) * 100;


        // LabelPer100g
        rowData.LabelToleransiPer100gPersen = (rowData.HasilAnalisaPerSaji / rowData.LabelPer100g) * 100;


        // LabelPer100kkal
        rowData.LabelPer100kkalPersen = (rowData.HasilAnalisaPer100kkal / rowData.LabelPer100kkal) * 100;


        // LabelPer100ml
        rowData.LabelToleransiPer100mlPersen = (rowData.HasilAnalisaPer100ml / rowData.LabelPer100ml) * 100;

        Data.ListDetailIng[rowIndex] = rowData;
    },
    UpdateHasilAnalisa: function (rowIndex, fieldName, rawValue) {
        var beratJenis = (Data.FormulaIns.BeratJenis && Data.FormulaIns.BeratJenis > 0) ? Data.FormulaIns.BeratJenis : 1;

        var numericValue = numeral(rawValue).value();

        if (numericValue === null) {
            numericValue = null

            if (fieldName === 'HasilAnalisaPer100g') {
                Data.ListDetailIng[rowIndex].HasilAnalisaPer100g = numericValue;
            }
            else if (fieldName === 'HasilAnalisaPer100ml') {
                Data.ListDetailIng[rowIndex].HasilAnalisaPer100ml = numericValue;
            }

            this.ResetAllValue(rowIndex);
        }
        else {
            if (Data.ListDetailIng && Data.ListDetailIng[rowIndex]) {

                if (fieldName === 'HasilAnalisaPer100g') {
                    Data.ListDetailIng[rowIndex].HasilAnalisaPer100g = numericValue;
                    Data.ListDetailIng[rowIndex].HasilAnalisaPer100ml = numericValue / beratJenis;
                }
                else if (fieldName === 'HasilAnalisaPer100ml') {
                    Data.ListDetailIng[rowIndex].HasilAnalisaPer100ml = numericValue;
                    Data.ListDetailIng[rowIndex].HasilAnalisaPer100g = numericValue * beratJenis;
                }
                if (TableIngDetail.RecalculateAnalisaRow(rowIndex, fieldName)) {
                    TableIngDetail.RecalculatePercentAKGRow(rowIndex);
                };
            }
        }

        oTableIngDetail.row(rowIndex).data(Data.ListDetailIng[rowIndex]);

        var currentRow = Data.ListDetailIng[rowIndex];

        if (currentRow && currentRow.ZatGizi.toLowerCase() === "energy") {

            $.each(Data.ListDetailIng, function (idx, item) {

                if (idx !== rowIndex) {

                    var valToCheck = (fieldName === 'HasilAnalisaPer100g') ? item.HasilAnalisaPer100g : item.HasilAnalisaPer100ml;

                    if (valToCheck != null && valToCheck !== 0) {

                        TableIngDetail.RecalculateAnalisaRow(idx, fieldName);

                        TableIngDetail.RecalculatePercentLabelToleranRow(idx);

                        oTableIngDetail.row(idx).data(Data.ListDetailIng[idx]);
                    }
                }
            });
        }
        oTableIngDetail.draw(false);
    },
    UpdateHasilPencantumanLabel: function (rowIndex, fieldName, rawValue) {
        if (!Data.ListDetailIng || !Data.ListDetailIng[rowIndex]) return;
        var rowData = Data.ListDetailIng[rowIndex];

        var nilaiAnalisaCek = null;
        var namaAnalisaCek = "";
        var isChecking = false;

        if (fieldName === 'LabelSatuTakaranSaji') {
            nilaiAnalisaCek = rowData.HasilAnalisaSatuTakaranSaji;
            namaAnalisaCek = "Hasil Analisa Satu Takaran Saji";
            isChecking = true;
        } else if (fieldName === 'LabelPerSaji') {
            nilaiAnalisaCek = rowData.HasilAnalisaPerSaji;
            namaAnalisaCek = "Hasil Analisa Takaran Saji";
            isChecking = true;
        } else if (fieldName === 'LabelPer100g') {
            nilaiAnalisaCek = rowData.HasilAnalisaPer100g;
            namaAnalisaCek = "Hasil Analisa Per Saji";
            isChecking = true;
        } else if (fieldName === 'LabelPer100kkal') {
            nilaiAnalisaCek = rowData.HasilAnalisaPer100kkal;
            namaAnalisaCek = "Hasil Analisa Per 100 kkal";
            isChecking = true;
        } else if (fieldName === 'LabelPer100ml') {
            nilaiAnalisaCek = rowData.HasilAnalisaPer100ml;
            namaAnalisaCek = "Hasil Analisa Per 100 ml";
            isChecking = true;
        }

        if (isChecking && (nilaiAnalisaCek == null || nilaiAnalisaCek == 0)) {
            clsGlobal.setMessageWarning(`Isi dahulu nilai <b>${namaAnalisaCek}</b> sebelum mengisi Label.`);
            rowData[fieldName] = null;

            if (fieldName === 'LabelSatuTakaranSaji') rowData.LabelToleransiTakaranSajiPersen = null;
            if (fieldName === 'LabelPerSaji') rowData.LabelToleransiPerSajiPersen = null;
            if (fieldName === 'LabelPer100g') rowData.LabelToleransiPer100gPersen = null;
            if (fieldName === 'LabelPer100kkal') rowData.LabelPer100kkalPersen = null;
            if (fieldName === 'LabelPer100ml') rowData.LabelToleransiPer100mlPersen = null;

            Data.ListDetailIng[rowIndex] = rowData;
            oTableIngDetail.row(rowIndex).data(rowData);
            oTableIngDetail.draw(false);
            return;
        }

        var numericValue = numeral(rawValue).value();

        if (numericValue !== null) {
            if (fieldName === 'LabelSatuTakaranSaji') {
                rowData.LabelSatuTakaranSaji = numericValue;
                rowData.LabelToleransiTakaranSajiPersen = numericValue !== 0 ? (rowData.HasilAnalisaSatuTakaranSaji / numericValue) * 100 : 0;
            }
            else if (fieldName === 'LabelPerSaji') {
                rowData.LabelPerSaji = numericValue;
                rowData.LabelToleransiPerSajiPersen = numericValue !== 0 ? (rowData.HasilAnalisaPerSaji / numericValue) * 100 : 0;
            }
            else if (fieldName === 'LabelPer100g') {
                rowData.LabelPer100g = numericValue;
                rowData.LabelToleransiPer100gPersen = numericValue !== 0 ? (rowData.HasilAnalisaPer100g / numericValue) * 100 : 0;
            }
            else if (fieldName === 'LabelPer100kkal') {
                rowData.LabelPer100kkal = numericValue;
                rowData.LabelPer100kkalPersen = numericValue !== 0 ? (rowData.HasilAnalisaPer100kkal / numericValue) * 100 : 0;
            }
            else if (fieldName === 'LabelPer100ml') {
                rowData.LabelPer100ml = numericValue;
                rowData.LabelToleransiPer100mlPersen = numericValue !== 0 ? (rowData.HasilAnalisaPer100ml / numericValue) * 100 : 0;
            }
        } else {
            rowData[fieldName] = null;

            if (fieldName === 'LabelSatuTakaranSaji') rowData.LabelToleransiTakaranSajiPersen = null;
            else if (fieldName === 'LabelPerSaji') rowData.LabelToleransiPerSajiPersen = null;
            else if (fieldName === 'LabelPer100g') rowData.LabelToleransiPer100gPersen = null;
            else if (fieldName === 'LabelPer100kkal') rowData.LabelPer100kkalPersen = null;
            else if (fieldName === 'LabelPer100ml') rowData.LabelToleransiPer100mlPersen = null;
        }

        Data.ListDetailIng[rowIndex] = rowData;
        oTableIngDetail.row(rowIndex).data(rowData);
        oTableIngDetail.draw(false);
    },
    UpdateHasilPersenAKG: function (rowIndex, fieldName, rawValue) {
        if (!Data.ListDetailIng || !Data.ListDetailIng[rowIndex]) return;
        var rowData = Data.ListDetailIng[rowIndex];

        var nilaiAnalisaCek = null;
        var namaAnalisaCek = "";
        var isChecking = false;

        if (fieldName === 'PersenAkglabelSatuTakaranSaji') {
            nilaiAnalisaCek = rowData.AkganalisaSatuTakaranSaji;
            namaAnalisaCek = "Hasil Analisa Satu Takaran Saji";
            isChecking = true;
        }
        else if (fieldName === 'PersenAkglabelPerSaji') {
            nilaiAnalisaCek = rowData.AkganalisaPerSaji;
            namaAnalisaCek = "Hasil Analisa Per Saji";
            isChecking = true;
        }

        if (isChecking && (nilaiAnalisaCek == null || nilaiAnalisaCek == 0)) {
            clsGlobal.setMessageWarning(`Isi dahulu nilai <b>${namaAnalisaCek}</b> sebelum mengisi Persen AKG Label.`);
            rowData[fieldName] = null;

            if (fieldName === 'PersenAkglabelSatuTakaranSaji') rowData.PersenAkglabelToleransiSatuTakaranSaji = null;
            if (fieldName === 'PersenAkglabelPerSaji') rowData.PersenAkglabelToleransiPerSaji = null;

            Data.ListDetailIng[rowIndex] = rowData;
            oTableIngDetail.row(rowIndex).data(rowData);
            oTableIngDetail.draw(false);
            return;
        }

        var numericValue = numeral(rawValue).value();


        //debugger;
        if (numericValue !== null) {
            if (fieldName === 'PersenAkglabelSatuTakaranSaji') {
                rowData.PersenAkglabelSatuTakaranSaji = numericValue;
                rowData.PersenAkglabelToleransiSatuTakaranSaji = numericValue !== 0 ? (rowData.AkganalisaSatuTakaranSaji / numericValue) * 100 : 0;
            }
            else if (fieldName === 'PersenAkglabelPerSaji') {
                rowData.PersenAkglabelPerSaji = numericValue;
                rowData.PersenAkglabelToleransiPerSaji = numericValue !== 0 ? (rowData.AkganalisaPerSaji / numericValue) * 100 : 0;
            }
        } else {
            rowData[fieldName] = null;

            if (fieldName === 'PersenAkglabelSatuTakaranSaji') rowData.PersenAkglabelToleransiSatuTakaranSaji = null;
            else if (fieldName === 'PersenAkglabelPerSaji') rowData.PersenAkglabelToleransiPerSaji = null;
        }

        Data.ListDetailIng[rowIndex] = rowData;
        oTableIngDetail.row(rowIndex).data(rowData);
        oTableIngDetail.draw(false);
    },
    UpdateStringValue: function (rowIndex, fieldName, value) {
        if (Data.ListDetailIng && Data.ListDetailIng[rowIndex]) {
            Data.ListDetailIng[rowIndex][fieldName] = value;

        }

        oTableIngDetail.row(rowIndex).data(Data.ListDetailIng[rowIndex]);
        oTableIngDetail.draw(false);
    },
    UpdateBooleanValue: function (rowIndex, fieldName, isChecked) {
        //debugger;
        if (Data.ListDetailIng && Data.ListDetailIng[rowIndex]) {
            Data.ListDetailIng[rowIndex][fieldName] = isChecked;
        }

        var rowNode = oTableIngDetail.row(rowIndex).node();

        oTableIngDetail.row(rowIndex).data(Data.ListDetailIng[rowIndex]);

        var targetCells = $(rowNode).find('td').not(':has(input[type="checkbox"])');

        if (isChecked) {
            targetCells.css({
                'background-color': '#eeeeee',
                'color': '#a1a1a1',
                'opacity': '0.8'
            });
        } else {
            targetCells.css({
                'background-color': '',
                'color': '',
                'opacity': ''
            });
        }

        oTableIngDetail.draw(false);

        var isAllChecked = Data.ListDetailIng.every(function (row) {
            return row.IsVoid === true;
        });

        $('#cbHeaderVoid').prop('checked', isAllChecked);
    },
    UpdateAllVoid: function (isChecked) {
        if (Data.ListDetailIng && Data.ListDetailIng.length > 0) {
            Data.ListDetailIng.forEach(function (row) {
                row.IsVoid = isChecked;
            });
        }

        oTableIngDetail.rows().every(function (rowIdx, tableLoop, rowLoop) {
            var d = this.data();
            d.IsVoid = isChecked;
            this.data(d);

            var rowNode = this.node();

            // Targetkan TD yang tidak punya checkbox (asumsi checkbox ada di dalam cell)
            // Kita gunakan selector :not(:has(input[type="checkbox"]))
            var targetCells = $(rowNode).find('td').not(':has(input[type="checkbox"])');

            if (isChecked) {
                targetCells.css({
                    'background-color': '#eeeeee',
                    'color': '#a1a1a1'
                });
            } else {
                targetCells.css({
                    'background-color': '',
                    'color': ''
                });
            }
        });

        oTableIngDetail.draw(false);
    },
    ResetAllValue: function (rowIndex) {

        if (!Data.ListDetailIng || !Data.ListDetailIng[rowIndex]) {
            return;
        }

        let datDet = Data.ListDetailIng[rowIndex];

        datDet.HasilAnalisaPer100g = null;
        datDet.HasilAnalisaPer100ml = null;
        datDet.HasilAnalisaPer100kkal = null;
        datDet.HasilAnalisaPerSaji = null;
        datDet.HasilAnalisaSatuTakaranSaji = null;
        datDet.IsSesuaiKarDar = null;
        datDet.KlaimAkgpersen = null;

        datDet.AkganalisaPerSaji = null;
        datDet.AkganalisaSatuTakaranSaji = null;

        datDet.LabelSatuTakaranSaji = null;
        datDet.LabelToleransiTakaranSajiPersen = null;

        datDet.LabelPerSaji = null;
        datDet.LabelToleransiPerSajiPersen = null;

        datDet.LabelPer100g = null;
        datDet.LabelToleransiPer100gPersen = null;

        datDet.LabelPer100kkal = null;
        datDet.LabelPer100kkalPersen = null;

        datDet.LabelPer100ml = null;
        datDet.LabelToleransiPer100mlPersen = null;

        datDet.PersenAkglabelSatuTakaranSaji = null;
        datDet.PersenAkglabelToleransiSatuTakaranSaji = null;

        datDet.PersenAkglabelPerSaji = null;
        datDet.PersenAkglabelToleransiPerSaji = null;

        Data.ListDetailIng[rowIndex] = datDet;

        if (typeof oTableIngDetail !== 'undefined') {
            oTableIngDetail.row(rowIndex).data(datDet);
            oTableIngDetail.draw(false);
        }
    },
    ExportExcel: function () {
            $.ajax({
            type: "POST",
            url: "/VerFor/ExportListING",
            data: {
                __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val(),
                verForId: Data.FormulaHeader.VerForHeaderId
            },
            datatype: "json",
            success: function (retDat, status, xhr) {
                clsGlobal.hideLoading();
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("You're Session has been Ended, Please Re-Login !", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        window.open(`/VerFor/DownloadListING?file=${encodeURIComponent(retDat.objData)}`);
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

var TableIngKlaimTambahan = {
    Add: function () {
        $('#perhitunganING-klaimTambahanDtId').val('');
        $('#itemKlaimTambahan').val('');
        $('#jumlahKlaimTambahan').val('');
        $('#satuanKlaimTambahan').val(null).trigger("change");
    },
    Save: function () {
        if (!$('#itemKlaimTambahan').val()) {
            clsGlobal.setMessageWarning("Item harus diisi!");
            return false;
        }
        else if (!$('#jumlahKlaimTambahan').val()) {
            clsGlobal.setMessageWarning("Jumlah Klaim harus diisi!");
            return false;
        }
        else if (!$('#satuanKlaimTambahan').find(":selected").val()) {
            clsGlobal.setMessageWarning("UOM harus diisi!");
            return false;
        }

        let existingList = JSON.parse(Data.FormulaIns.KlaimTambahan || "[]");
        let inputItemName = $('#itemKlaimTambahan').val().trim();
        let currentId = $('#perhitunganING-klaimTambahanDtId').val();

        let isDuplicate = existingList.some(function (entry) {
            let nameMatches = entry.Item.toLowerCase() === inputItemName.toLowerCase();

            if (currentId) {
                return nameMatches && entry.KlaimTambahanId !== currentId;
            }

            return nameMatches;
        });

        if (isDuplicate) {
            clsGlobal.setMessageWarning("Item sudah ada dalam list sebelumnya!");
            return false;
        }


        var DataKlaim = {};
        if (!$('#perhitunganING-klaimTambahanDtId').val()) {

            DataKlaim.KlaimTambahanId = crypto.randomUUID();
            DataKlaim.Item = $('#itemKlaimTambahan').val();
            DataKlaim.JumlahKlaim = numeral($('#jumlahKlaimTambahan').val()).value();
            DataKlaim.SatuanJumlahKlaim = $("#satuanKlaimTambahan option:selected").val();

            let lstData = JSON.parse(Data.FormulaIns.KlaimTambahan);
            lstData.push(DataKlaim);

            Data.FormulaIns.KlaimTambahan = JSON.stringify(lstData);

        } else {
            DataKlaim.KlaimTambahanId = $('#perhitunganING-klaimTambahanDtId').val();
            DataKlaim.Item = $('#itemKlaimTambahan').val();
            DataKlaim.JumlahKlaim = numeral($('#jumlahKlaimTambahan').val()).value();
            DataKlaim.SatuanJumlahKlaim = $("#satuanKlaimTambahan option:selected").val();

            let lstData = JSON.parse(Data.FormulaIns.KlaimTambahan);
            lstData = lstData.filter(item => item.KlaimTambahanId !== DataKlaim.KlaimTambahanId);
            lstData.push(DataKlaim);

            Data.FormulaIns.KlaimTambahan = JSON.stringify(lstData);
        }


        $('#perhitunganING-klaimTambahanModal').modal('toggle');
        TableIngKlaimTambahan.Render();

        return true;
    },
    Edit: function (button) {
        var row = $(button).closest('tr');
        var data = oTableKlaimTambahan.row(row).data();

        if (data) {

            $('#perhitunganING-klaimTambahanDtId').val(data.KlaimTambahanId);
            $('#itemKlaimTambahan').val(data.Item);
            $('#jumlahKlaimTambahan').val(data.JumlahKlaim).trigger("blur");
            $('#satuanKlaimTambahan').val(data.SatuanJumlahKlaim).trigger("change");

            $('#perhitunganING-klaimTambahanModal').modal('toggle');
        } else {
            clsGlobal.swalWarning("Data Tidak Ditemukan!");
        }

    },
    Render: function () {
        if (oTableKlaimTambahan) {
            oTableKlaimTambahan.clear();
            oTableKlaimTambahan.destroy();
        }

        const editableStatuses = [
            "REQUESTED",
            "IN-PROGRESS",
            "NEED REVISION-VERFOR",
            "UPDATE-ING",
            "NEED REVISION-ING",
            "VERFOR-APPROVED"
        ];

        const status = (Data && Data.FormulaHeader && Data.FormulaHeader.Status)
            ? Data.FormulaHeader.Status.toUpperCase()
            : "";

        const IsApproveinitRA = Data.FormulaHeader.Status === "REQUESTED" ? false : true;
        const role = usrRole ? usrRole.toUpperCase() : "";
        const canManageIng = (role === "ADMINISTRATOR") ||
            (role === "PDV" && editableStatuses.includes(status) && IsApproveinitRA);



        oTableKlaimTambahan = $('#perhitunganING-tableKlaimTambahan').DataTable({
            "data": JSON.parse(Data.FormulaIns.KlaimTambahan),
            "dom": 'rtip',
            "columns": [
                { "data": "Item" },
                {
                    "data": "JumlahKlaim",
                    render: function (data, type, row) {
                        if (data === null || data === undefined || data === '') {
                            return '';
                        }

                        return numeral(data).format('0,0.[0000]');
                    }
                },
                { "data": "SatuanJumlahKlaim" },
                {
                    "data": null,
                    defaultContent: "",
                    render: function (data, type, row) {
                        if (status === "CANCELLED") {
                            return "";
                        }

                        if (canManageIng) {
                            return `<button type="button" class='btn btn-warning btn-sm' onclick='TableIngKlaimTambahan.Edit(this)'><i class="fas fa-pencil-alt me-1"></i></button> <button type="button" class='btn btn-danger btn-sm' onclick='TableIngKlaimTambahan.Delete(this)'><i class="fas fa-trash me-1"></i></button>`;
                            
                        }

                        return "";
                        
                    }
                }
            ],
            "pageLength": 3,
            "paging": true,
            "searching": false,
            "ordering": false,
            "info": false,
            "autoWidth": false
        });

        Helper.RenderTooltip();
    },
    Delete: function (button) {
        var row = $(button).closest('tr');
        var data = oTableKlaimTambahan.row(row).data();
        if (data) {
            let lstData = JSON.parse(Data.FormulaIns.KlaimTambahan);
            lstData = lstData.filter(item => item.KlaimTambahanId !== data.KlaimTambahanId);

            Data.FormulaIns.KlaimTambahan = JSON.stringify(lstData);

            oTableKlaimTambahan.row(row).remove().draw();
        }
    },
}

var TableHistoricalForm = {
    Save: function () {
        dontBlock = true;
        $.ajax({
            type: "POST",
            url: "/VerFor/GetListHistories",
            datatype: "json",
            async: true,
            data: {
                __RequestVerificationToken: $('#perhitunganINGForm input[name=__RequestVerificationToken]').val(),
                VerForId: Data.FormulaHeader.VerForHeaderId
            },
            success: function (retDat, status, xhr) {
                dontBlock = false;
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        var data = JSON.parse(retDat.objData);
                        TableHistoricalForm.Render(data);
                    }
                    else {
                        if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                            clsGlobal.swalWarning(retDat.objData);
                        }
                        else {
                            clsGlobal.swalError(retDat.txtMessage);
                        }
                    }
                    $("#txtGUID").val(retDat.txtGUID);
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.swalError(xhr.responseText);
                dontBlock = false;
            }
        });
    },
    Render: function (Data) {
        if (oTableHistoricalForm) {
            oTableHistoricalForm.destroy();
        }
        oTableHistoricalForm = $('#tableHistorical').DataTable({
            "data": Data,
            "dom": 'lfrtip',
            processing: true,
            "pageLength": 10,
            "columns": [
                {
                    "data": "Notes",
                    className: "text-nowrap",
                    render: function (data, type, row) {
                        return data;
                    }
                },
                {
                    "data": "StatusDescription",
                    className: "text-nowrap",
                },
                {
                    "data": "CreatedBy",
                    className: "text-nowrap",
                },
                {
                    "data": "CreatedDate",
                    className: "text-nowrap",
                    render: function (data, type, row, meta) {
                        return moment(data).format("DD MMMM yyyy HH:mm");
                    }
                },
                {
                    "data": "CreatedRole",
                    className: "text-nowrap",
                },
                
            ],
            "paging": true,
            "searching": true,
            "ordering": false,
            "info": false,
            "autoWidth": false,
            "scrollX": true,
            "scrollY": "350px"
        });

        Helper.RenderTooltip();
    },
}

var TableUploadIngFile = {
    AddUpload: function () {
        $('#ConfigId').val('');
        $('#UploadFileIng').val(null);
        $('#VerForIngUploadModal').modal('toggle');

        setTimeout(() => {
            TableUploadIngFile.EmptyPriviewUpload();
        }, 100);
    },
    AddDetail: function () {

        $('#ConfigId').val('');
        $('#checkVoid').prop('checked', false);
        $('#UploadFileKompilasi').val(null);
        $('#VerForIngUploadDetailModal').modal('toggle');
    },
    SaveUpload: function () {
        var FileVisualTemuan = undefined;
        var datHeader = JSON.parse($("#IngFile").val());
        let datKompilasi = datHeader;

        var formData = new FormData($('#VerForIngUploadForm')[0]);
        let totalLengthFile = 0;

        $.each($('input[type=file]'), (index, value) => {
            if (value.id == 'UploadFileIng') {
                $.each($('input[type=file]')[index].files, (index, value) => {
                    FileVisualTemuan = value;
                    formData.append("FileIng", FileVisualTemuan);

                    totalLengthFile += value.size;
                });
            }
        })

        if (totalLengthFile > 5242880) {
            clsGlobal.swalWarning("Total File yang Diupload Lebih dari 5MB.");
            return false;
        }

        //Binding Data Obj
        datKompilasi.FileUploadId = ($("#FileUploadId").val() == "" || $("#FileUploadId").val() == undefined) ? null : $("#FileUploadId").val();
        datKompilasi.ConfigUploadId = $("#ConfigId").val();
        datKompilasi.VerForHeaderId = $("#VerForId").val();
        datKompilasi.MConfigUploadFile = JSON.parse($("#MConfigUpload").val());

        formData.append("DataIng", JSON.stringify(datKompilasi));

        $.ajax({
            type: "POST",
            url: "/VerFor/SaveUploadIngFile",
            data: formData,
            processData: false,
            contentType: false,
            success: function (retDat, status, xhr) {
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        clsGlobal.swalSuccess("Success Save Data");
                        TableUploadIngFile.RefreshData(retDat.objData);
                    }
                    else {
                        if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                            clsGlobal.swalWarning(retDat.objData);
                        }
                        else {
                            clsGlobal.swalError(retDat.txtMessage);
                        }
                    }
                    $("#txtGUID").val(retDat.txtGUID);
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.swalError(xhr.responseText);
                console.error(xhr.txtErrorMessage);
            }
        });


        $('#VerForIngUploadModal').modal('toggle');
        TableUploadIngFile.Render();
    },
    SaveDetail: function () {
        //debugger;
        var datHeader = JSON.parse($("#IngFile").val());
        let datKompilasi = datHeader;

        //Binding Data Obj
        datKompilasi.FileUploadId = ($("#FileUploadId").val() == "" || $("#FileUploadId").val() == undefined) ? null : $("#FileUploadId").val();
        datKompilasi.Void = $('#checkVoidIng').is(":checked") ? true : false;
        datKompilasi.VerForHeaderId = $("#VerForId").val();
        datKompilasi.MConfigUploadFile = JSON.parse($("#MConfigUpload").val());
        datKompilasi.ConfigUploadId = datKompilasi.MConfigUploadFile.MUploadFileId;

        console.log(datKompilasi);

        $.ajax({
            type: "POST",
            url: "/VerFor/SaveIngFile",
            data: {
                DatKompilasi: datKompilasi,
                __RequestVerificationToken: $('#VerForPanel input[name=__RequestVerificationToken]').val()
            },
            datatype: "json",
            success: function (retDat, status, xhr) {
                clsGlobal.hideLoading();
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        clsGlobal.swalSuccess("Success Save Data");
                        TableUploadIngFile.RefreshData(retDat.objData);
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


        $('#VerForIngUploadDetailModal').modal('toggle');
        TableUploadIngFile.Render();
    },
    Edit: function (button) {
        var row = $(button).closest('tr');
        var data = oTableUploadIngFile.row(row).data();
        if (data) {
            //$(".select2-modal").select2({
            //    width: "100%",
            //    dropdownParent: $("#VerForKompilasiUploadDetailModal")
            //});

            //if (data.FileUploadId == "" || data.FileUploadId == null) {
            //    $(".select2-modal").attr("disabled", true);
            //}
            //else {
            //    $(".select2-modal").removeAttr("disabled");
            //}

            // Binding Data
            $("#IngFileId").val(data.IngFileId);
            $("#FileUploadId").val(data.FileUploadId);
            $("#dokumenIngDetail").text(data.MConfigUploadFile.UploadName);
            $("#checkVoidIng").prop("checked", data.Void ? true : false);
            $("#MConfigUpload").val(JSON.stringify(data.MConfigUploadFile));
            $("#IngFile").val(JSON.stringify(data));

            // Setting Config Upload
            //$("#UploadFileKompilasi").attr(data.MConfigUploadFile.UploadType.toLowerCase(), data.MConfigUploadFile.UploadType.toLowerCase());
            //$("#UploadFileKompilasi").attr("accept", data.MConfigUploadFile.UploadTypeContent);

            $('#VerForIngUploadDetailModal').modal('toggle');
        } else {
            clsGlobal.swalWarning("Data tidak ditemukan!");
        }

    },
    Upload: function (button) {
        var row = $(button).closest('tr');
        var data = oTableUploadIngFile.row(row).data();
        if (data) {
            // Binding Data
            $("#IngFileId").val(data.IngFileId);
            $("#FileUploadId").val(data.FileUploadId);
            $("#MConfigUpload").val(JSON.stringify(data.MConfigUploadFile));
            $("#dokumenPersyaratanUploadIng").text(data.MConfigUploadFile.UploadName);
            $("#IngFile").val(JSON.stringify(data));
            $("#ConfigId").val(data.ConfigUploadId);

            // Setting Config Upload
            $("#UploadFileIng").attr(data.MConfigUploadFile.UploadType.toLowerCase(), data.MConfigUploadFile.UploadType.toLowerCase());
            $("#UploadFileIng").attr("accept", data.MConfigUploadFile.UploadTypeContent);

            $('#VerForIngUploadModal').modal('toggle');
        } else {
            clsGlobal.swalWarning("Data tidak ditemukan!");
        }
    },
    Render: function () {
        // 1. Safe Destroy
        if ($.fn.DataTable.isDataTable('#dataTableUploadIngFile')) {
            $('#dataTableUploadIngFile').DataTable().destroy();
        }

        // 2. Setup Context & Helper
        const role = usrRole ? usrRole.toUpperCase() : "";
        const status = (Data && Data.FormulaHeader && Data.FormulaHeader.Status)
            ? Data.FormulaHeader.Status.toUpperCase()
            : "";

        const IsApproveinitRA = Data.FormulaHeader.Status === "REQUESTED" ? false : true;

        // Template Button (Sesuai snippet asli: Detail pakai icon pencil, Upload pakai icon file)
        const btnUploadHtml = `<button data-bs-toggle="tooltip" title="Upload Data" type="button" class='btn btn-info btn-sm me-1' onclick='TableUploadIngFile.Upload(this)'><i class="fas fa-file-alt me-1"></i></button> &nbsp;`;
        const btnDetailHtml = `<button data-bs-toggle="tooltip" title="Edit Data" type="button" class='btn btn-warning btn-sm' onclick='TableUploadIngFile.Edit(this)'><i class="fas fa-pencil-alt me-1"></i> </button> &nbsp;`;

        oTableUploadIngFile = $('#dataTableUploadIngFile').DataTable({
            "data": Data.ListIngFile,
            "dom": 'rtip',
            "pageLength": 10,
            "paging": false,
            "searching": false,
            "ordering": false,
            "info": false,
            "autoWidth": false,
            "columns": [
                {
                    "data": null,
                    render: (data, type, row, meta) => meta.row + 1
                },
                {
                    "data": null,
                    render: function (data, type, row) {
                        const uploadName = row.MConfigUploadFile?.UploadName || "";
                        const uploadTooltip = row.MConfigUploadFile?.UploadTooltip || "";

                        return `
                        <div class="d-flex justify-content-between align-items-center">
                            <p class="mb-0">${uploadName} 
                                <span>
                                    <i class="fas fa-info-circle text-primary ms-1" 
                                       style="cursor: pointer;"
                                       data-bs-toggle="tooltip" 
                                       title="${uploadTooltip}"
                                       tabindex="0">
                                    </i>
                                </span>
                            </p>
                        </div>`;
                    }
                },
                {
                    "data": "PlanName",
                    render: (data) => data || ""
                },
                {
                    "data": "FileUploadId",
                    render: function (data, type, row) {
                        if (!data) return "Belum Upload File";
                        return `<a href="javascript:void(0);" data-bs-toggle="tooltip" onclick="TableUploadIngFile.ShowListFile('${row.IngFileId}')" class="p-2 btn btn-sm btn-info noborder-radius">Pratinjau</a>`;
                    }
                },
                {
                    "data": "Void",
                    className: "text-center",
                    render: function (data) {
                        return data ? `<i class="fas fa-check text-success"></i>` : ``;
                    }
                },
                {
                    "data": null,
                    defaultContent: "",
                    className: "text-nowrap text-center",
                    render: function (data, type, row) {
                        let buttons = "";

                        if (status === "CANCELLED") {
                            return "";
                        }

                        if (role === "ADMINISTRATOR") {
                            buttons = btnUploadHtml + btnDetailHtml;
                        }

                        else if (role === "PDV") {
                            const allowIngWork = [
                                "REQUESTED",
                                "IN-PROGRESS",
                                "NEED REVISION-VERFOR",
                                "VERFOR-APPROVED",
                                "UPDATE-ING",
                                "NEED REVISION-ING"
                            ];

                            if (allowIngWork.includes(status) && !isSubmitedING && IsApproveinitRA) {
                                buttons = btnDetailHtml + btnUploadHtml;
                            }
                        }

                        else if (role === "RA" && !IsApproveinitRA && status == "REQUESTED") {
                            buttons = btnDetailHtml;
                        }

                        return buttons ? `<div class="btn-group" role="group">${buttons}</div>` : "";
                    }
                }
            ]
        });

        Helper.RenderTooltip();
    },
    Delete: function (button) {
        var row = $(button).closest('tr');
        var data = oTableContentClaim.row(row).data();
        if (data) {
            Data.ModelProject.ProjectDesc.ContentClaimList = Data.ModelProject.ProjectDesc.ContentClaimList.filter(item => item.ContentClaimId !== data.ContentClaimId);
            oTableContentClaim.row(row).remove().draw();
        }
    },
    ShowListFile: function (HeaderId) {
        //Getting Object
        let datItem = Data.ListIngFile;
        //Finding item
        let datSel = datItem.find((item) => item.IngFileId === HeaderId);

        //Generate and Show Modal
        TableUploadIngFile.GeneratePriviewFile(datSel);
        TableUploadIngFile.ShowModalPriviewFile();
    },
    GeneratePriviewFile: function (lstData) {
        const $contentContainer = $('#modalShowFilePriview');
        $contentContainer.empty();
        
        const role = usrRole ? usrRole.toUpperCase() : "";
        const status = (Data && Data.FormulaHeader && Data.FormulaHeader.Status) ? Data.FormulaHeader.Status.toUpperCase() : "";

        let canDelete = false;

        if (role === "ADMINISTRATOR") {
            canDelete = true;
        }
        else if (role === "PDV") {
            const editableStatuses = [
                "REQUESTED",
                "IN-PROGRESS",
                "NEED REVISION-VERFOR",
                "UPDATE-ING",
                "NEED REVISION-ING",
                "VERFOR-APPROVED"
            ];

            if (editableStatuses.includes(status)) {
                canDelete = true;
            }
        }

        if (lstData.ListUploadFile && lstData.ListUploadFile.length > 0) {
            $.each(lstData.ListUploadFile, function (index, item) {
                const previewContainerId = `preview-content-${index}`;

                // Logic Render Tombol Delete
                let deleteButtonHtml = '';
                if (canDelete) {
                    deleteButtonHtml = `
                    <button type="button" class="btn btn-danger btn-sm btn-delete-db" data-trans="${lstData.IngFileId}" data-type="INGFILE" data-id="${item.TxtUploadId}" data-name="${item.OriginalFileName}">
                        <i class="fas fa-trash me-1"></i> Hapus
                    </button>
                `;
                }

                const $filePreviewWrapper = $(`
        <div class="file-preview-item mb-4 pb-4 border-bottom" id="item-file-${item.Id}">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h5 class="mb-0 text-truncate" style="max-width: 60%;" title="${item.OriginalFileName}">${item.OriginalFileName}</h5>
                
                <div class="btn-group">
                    <a href="${item.PublicLink}" download="${item.OriginalFileName}" class="btn btn-success btn-sm">
                        <i class="fas fa-download me-1"></i> Unduh
                    </a> &nbsp;
                    ${deleteButtonHtml} 
                </div>
            </div>

            <div id="${previewContainerId}" class="preview-area bg-light rounded p-3 text-center" style="min-height: 200px;">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="text-muted mt-2 small">Memuat pratinjau...</p>
            </div>
        </div>
        `);

                $contentContainer.append($filePreviewWrapper);

                // Render Preview Content (PDF/Image/Text)
                setTimeout(function () {
                    const $targetContainer = $(`#${previewContainerId}`);
                    const fileExtension = item.FileExtenstion ? item.FileExtenstion.replace('.', '').toLowerCase() : '';

                    TableUploadFile.RenderContentItem(fileExtension, item.PublicLink, $targetContainer);

                }, 100 + (index * 50));

                // Event Listener Delete (Hanya akan aktif jika tombolnya ada)
                if (canDelete) {
                    $filePreviewWrapper.find('.btn-delete-db').on('click', function () {
                        const fileId = $(this).data('id');
                        const transId = $(this).data('trans');
                        const fileType = $(this).data('type');
                        const fileName = $(this).data('name');
                        const $wrapper = $(this).closest('.file-preview-item');

                        Swal.fire({
                            title: 'Hapus File?',
                            text: `Anda yakin ingin menghapus file "${fileName}" secara permanen?`,
                            icon: 'warning',
                            customClass: {
                                confirmButton: 'btn btn-success',
                                cancelButton: 'btn btn-outline-danger ms-1'
                            },
                            confirmButtonText: 'Ya, Hapus!',
                            cancelButtonText: 'Batal'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                const $btn = $(this);
                                const originalBtnHtml = $btn.html();
                                $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i>');

                                $.ajax({
                                    url: '/VerFor/DeleteFileUpload',
                                    type: 'POST',
                                    data: {
                                        __RequestVerificationToken: $('#VerForPanel input[name=__RequestVerificationToken]').val(),
                                        Id: fileId,
                                        TransId: transId,
                                        Type: fileType
                                    },
                                    success: function (retDat, status, xhr) {
                                        if (xhr.responseText.includes("!DOCTYPE html")) {
                                            clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                                        }
                                        else {
                                            if (retDat.bitSuccess == true) {
                                                Swal.fire({ icon: 'success', title: 'Terhapus', timer: 1500, showConfirmButton: false });
                                                $wrapper.fadeOut(300, function () {
                                                    $(this).remove();
                                                    if ($contentContainer.children().length === 0) {
                                                        $contentContainer.html('<p class="text-center text-muted">Tidak ada file yang tersedia.</p>');
                                                    }
                                                });

                                                // Update List Data
                                                TableUploadIngFile.UpdatedListFile(retDat.objData);
                                            }
                                            else {
                                                if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                                                    clsGlobal.swalWarning(retDat.txtMessage);
                                                    $btn.prop('disabled', false).html(originalBtnHtml);
                                                }
                                                else {
                                                    clsGlobal.swalError(retDat.txtMessage);
                                                    $btn.prop('disabled', false).html(originalBtnHtml);
                                                }
                                            }
                                        }
                                    },
                                    error: function (err) {
                                        Swal.fire('Error!', 'Gagal menghubungi server.', 'error');
                                        $btn.prop('disabled', false).html(originalBtnHtml);
                                    }
                                });
                            }
                        });
                    });
                }
            });

        } else {
            $contentContainer.append('<p class="text-center text-muted">Tidak ada file yang tersedia.</p>');
        }
    },
    UpdatedListFile: function (data) {
        //debugger;
        let dataParsed = JSON.parse(data);
        //Getting Object
        let datItem = Data.ListIngFile;
        let datIdxSel = datItem.findIndex((item) => item.IngFileId === dataParsed.IngFileId);

        // Update ListUploadFile
        Data.ListIngFile[datIdxSel] = dataParsed;

        TableUploadIngFile.Render();
    },
    RenderContentItem(ext, link, $container) {
        $container.empty().css('text-align', 'left').removeClass('p-3 bg-light text-center');

        switch (ext) {
            case "pdf":
                $container.html(`<iframe src="${link}" style="width:100%; height:500px; border:none;" frameborder="0"></iframe>`);
                break;
            case "png":
            case "jpg":
            case "jpeg":
            case "gif":
            case "jfif":
            case "svg":
                const $imgBox = $('<div class="preview-content text-center"></div>');
                Helper.RenderImage(link, $imgBox.get(0));
                $container.append($imgBox);
                break;
            case "docx":
                const $docxBox = $('<div class="preview-content preview-box" style="height: 500px; overflow-y: auto; border: 1px solid #ddd;"></div>');
                $container.append($docxBox);
                // Helper ini biasanya berat, makanya ditaruh di timeout
                Helper.RenderDocx(link, $docxBox.get(0));
                break;
            case "xlsx":
                const $xlsxBox = $('<div class="preview-content preview-box" style="height: 500px; overflow-y: auto; border: 1px solid #ddd;"></div>');
                $container.append($xlsxBox);
                Helper.RenderXlsx(link, $xlsxBox.get(0));
                break;
            default:
                // Tampilan Not Supported (menggunakan style Opsi 3 sebelumnya)
                $container.html(`
                            <div class="d-flex align-items-center justify-content-center text-muted bg-light border rounded" style="height: 150px;">
                                <div class="text-center">
                                    <i class="fas fa-eye-slash fa-2x mb-2 text-secondary"></i>
                                    <p class="mb-0 small">Pratinjau belum tersedia untuk format <strong>.${ext}</strong></p>
                                </div>
                            </div>
                        `
                )
                    ;
        }
    },
    GeneratePriviewUpload: function (event) {
        const $previewContainer = $('#modalShowFileIngUploaded');
        const inputElement = event.target;

        $previewContainer.empty().hide();
        currentPreviewBlobUrls = [];

        // Hapus blob URL lama dari memori
        if (currentPreviewBlobUrls.length > 0) {
            currentPreviewBlobUrls.forEach(url => URL.revokeObjectURL(url));
            currentPreviewBlobUrls = [];
        }

        const files = inputElement.files;
        if (!files || files.length === 0) {
            return;
        }

        $previewContainer.show();
        $previewContainer.append(`<h5>Pratinjau (${files.length} file):</h5>`);

        Array.from(files).forEach((file, index) => {
            const fileName = file.name;
            const fileExtension = fileName.split('.').pop().toLowerCase();
            let $previewElement;

            const $fileWrapper = $(`
            <div class="file-preview-item mb-4 pb-3 border-bottom position-relative" id="preview-item-${index}">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <strong>${fileName}</strong>
                    
                    <button type="button" class="btn btn-sm btn-danger btn-remove-file">
                        <i class="fa fa-trash me-1"></i> Hapus
                    </button>
                </div>
            </div>
        `);

            // Logic Delete File
            $fileWrapper.find('.btn-remove-file').on('click', function () {
                const dt = new DataTransfer();
                const currentFiles = inputElement.files;

                // Loop file yang ada di input SEKARANG
                for (let i = 0; i < currentFiles.length; i++) {
                    const f = currentFiles[i];
                    if (f.name !== file.name || f.lastModified !== file.lastModified) {
                        dt.items.add(f);
                    }
                }

                inputElement.files = dt.files;

                $fileWrapper.remove();

                if (inputElement.files.length === 0) {
                    $previewContainer.hide();
                } else {
                    $previewContainer.find('h5').first().text(`Pratinjau (${inputElement.files.length} file):`);
                }
            });

            switch (fileExtension) {
                case "pdf":
                    const pdfBlobUrl = URL.createObjectURL(file);
                    currentPreviewBlobUrls.push(pdfBlobUrl);
                    $previewElement = $(`
                    <iframe src="${pdfBlobUrl}" style="width:100%; height:400px; border:1px solid #ddd;" frameborder="0"></iframe>
                `);
                    $fileWrapper.append($previewElement);
                    break;

                case "png":
                case "jpg":
                case "jpeg":
                case "gif":
                case "jfif":
                case "svg":
                    const imgBlobUrl = URL.createObjectURL(file);
                    currentPreviewBlobUrls.push(imgBlobUrl);
                    $previewElement = $('<div class="preview-content" style="max-height: 400px; overflow: auto;"></div>');
                    Helper.RenderImage(imgBlobUrl, $previewElement.get(0));
                    $fileWrapper.append($previewElement);
                    break;

                case "docx":
                case "xlsx":
                    const reader = new FileReader();
                    $previewElement = $('<div class="preview-content preview-box" style="height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 10px;">Memproses pratinjau...</div>');
                    $fileWrapper.append($previewElement);

                    reader.onload = function (e) {
                        const fileData = e.target.result;
                        $previewElement.empty();
                        if (fileExtension === "docx") {
                            Helper.RenderDocx(fileData, $previewElement.get(0));
                        } else if (fileExtension === "xlsx") {
                            Helper.RenderXlsx(fileData, $previewElement.get(0));
                        }
                    };
                    reader.onerror = function () {
                        $previewElement.html('<p class="text-danger">Gagal membaca file.</p>');
                    };
                    reader.readAsArrayBuffer(file);
                    break;

                default:
                    $previewElement = $(`<p class="text-muted mt-2 fst-italic">Format <strong>.${fileExtension}</strong> belum mendukung tampilan pratinjau.</p>`);
                    $fileWrapper.append($previewElement);
            }

            $previewContainer.append($fileWrapper);
        });
    },
    EmptyPriviewUpload: function () {
        $("#modalShowFileIngUploaded").empty();
    },
    ShowModalPriviewFile: function () {
        $('#ShowPriviewFileModal').modal('toggle');
    },
    CloseModalPriviewFile: function () {
        $('#ShowPriviewFileModal').modal('toggle');
    },
    RefreshData: function (data) {

        const index = Data.ListIngFile.findIndex(x => x.IngFileId == data.IngFileId);

        if (index !== -1) {
            // 3. Jika ketemu, ganti item di index tersebut dengan data yang baru
            Data.ListIngFile[index] = data;
        }

        TableUploadIngFile.Render();
    }
}

var TableUploadFile = {
    AddUpload: function () {
        $('#ConfigId').val('');
        $('#UploadFileKompilasi').val(null);
        $('#VerForKompilasiUploadModal').modal('toggle');

        setTimeout(() => {
            TableUploadFile.EmptyPriviewUpload();
        }, 100);
    },
    AddDetail: function () {
        $(".select2-modal").select2({
            width: "100%",
            dropdownParent: $("#VerForKompilasiUploadDetailModal")
        });

        $('#ConfigId').val('');
        $('#ReviewRA').val('').trigger("change");
        $('#NotesRA').val('');
        $('#checkVoid').prop('checked', false);
        $('#UploadFileKompilasi').val(null);
        $('#VerForKompilasiUploadDetailModal').modal('toggle');
    },
    SaveUpload: function () {
        var FileVisualTemuan = undefined;
        var datHeader = JSON.parse($("#KompilasiFile").val());
        let datKompilasi = datHeader;

        var formData = new FormData($('#VerForKompilasiUploadForm')[0]);
        let totalLengthFile = 0;

        $.each($('input[type=file]'), (index, value) => {
            if (value.id == 'UploadFileKompilasi') {
                $.each($('input[type=file]')[index].files, (index, value) => {
                    FileVisualTemuan = value;
                    formData.append("FileKompilasi", FileVisualTemuan);
                });
            }
        })

        if (totalLengthFile > 5242880) {
            clsGlobal.swalWarning("Total File yang Diupload Lebih dari 5MB.");
            return false;
        }

        //Binding Data Obj
        datKompilasi.FileUploadId = ($("#FileUploadId").val() == "" || $("#FileUploadId").val() == undefined) ? null : $("#FileUploadId").val();
        datKompilasi.ConfigUploadId = $("#ConfigId").val();
        datKompilasi.VerForHeaderId = $("#VerForId").val();
        datKompilasi.MConfigUploadFile = JSON.parse($("#MConfigUpload").val());

        formData.append("DataKompilasi", JSON.stringify(datKompilasi));

        $.ajax({
            type: "POST",
            url: "/VerFor/SaveUploadKompilasiFile",
            data: formData,
            processData: false,
            contentType: false,
            success: function (retDat, status, xhr) {
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        clsGlobal.swalSuccess("Success Save Data");
                        TableUploadFile.RefreshData(retDat.objData);
                    }
                    else {
                        if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                            clsGlobal.swalWarning(retDat.objData);
                        }
                        else {
                            clsGlobal.swalError(retDat.txtMessage);
                        }
                    }
                    $("#txtGUID").val(retDat.txtGUID);
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.swalError(xhr.responseText);
                console.error(xhr.txtErrorMessage);
            }
        });


        $('#VerForKompilasiUploadModal').modal('toggle');
        TableUploadFile.Render();
    },
    SaveDetail: function () {
        var datHeader = JSON.parse($("#KompilasiFile").val());
        let datKompilasi = datHeader;

        //Binding Data Obj
        datKompilasi.FileUploadId = ($("#FileUploadId").val() == "" || $("#FileUploadId").val() == undefined) ? null : $("#FileUploadId").val();
        datKompilasi.ConfigUploadId = $("#ConfigId").val();
        datKompilasi.Void = $('#checkVoid').is(":checked") ? true : false;
        datKompilasi.NotesRa = $("#NotesRA").val();
        datKompilasi.ReviewRa = $("#ReviewRA").find(":selected").val();
        datKompilasi.VerForHeaderId = $("#VerForId").val();
        datKompilasi.MConfigUploadFile = JSON.parse($("#MConfigUpload").val());


        if (datKompilasi.FileUploadId == "" || datKompilasi.FileUploadId == null) {

        }
        else {
            if (!datKompilasi.Void) {
                if (datKompilasi.ReviewRa == null || datKompilasi.ReviewRa == "" || datKompilasi.ReviewRa == undefined) {
                    clsGlobal.setMessageWarning(`<p>Mohon pilih <strong>Review RA</strong>.</p>`);
                    return false;
                }
                else if (datKompilasi.ReviewRa == "Need Revise" && (datKompilasi.NotesRa == "" || datKompilasi.NotesRa == null)) {
                    clsGlobal.setMessageWarning(`<p>Mohon isi <strong>Catatan</strong> sebagai alasan revisi dokumen ini.</p>`);
                    return false;
                }   
            }
        }

        $.ajax({
            type: "POST",
            url: "/VerFor/SaveKompilasiFile",
            data: {
                DatKompilasi: datKompilasi,
                __RequestVerificationToken: $('#VerForPanel input[name=__RequestVerificationToken]').val()
            },
            datatype: "json",
            success: function (retDat, status, xhr) {
                clsGlobal.hideLoading();
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        console.log(retDat);
                        clsGlobal.swalSuccess("Success Save Data");
                        TableUploadFile.RefreshData(retDat.objData);
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


        $('#VerForKompilasiUploadDetailModal').modal('toggle');
        TableUploadFile.Render();

        return true;
    },
    Edit: function (button) {
        var row = $(button).closest('tr');
        var data = oTableUploadFile.row(row).data();
        if (data) {
            $(".select2-modal").select2({
                width: "100%",
                dropdownParent: $("#VerForKompilasiUploadDetailModal")
            });

            if (data.FileUploadId == "" || data.FileUploadId == null) {
                $(".select2-modal").attr("disabled", true);
                $("#NotesRA").attr("disabled", true);
            }
            else {
                $(".select2-modal").removeAttr("disabled");
                $("#NotesRA").removeAttr("disabled");
            }

            // Binding Data
            $("#KompilasiFileId").val(data.KompilasiFileId);
            $("#FileUploadId").val(data.FileUploadId);
            $("#dokumenPersyaratanDetail").text(data.MConfigUploadFile.UploadName);
            $("#checkVoid").prop("checked", data.Void ? true : false);
            $("#MConfigUpload").val(JSON.stringify(data.MConfigUploadFile));
            $("#KompilasiFile").val(JSON.stringify(data));

            // Setting Config Upload
            $("#UploadFileKompilasi").attr(data.MConfigUploadFile.UploadType.toLowerCase(), data.MConfigUploadFile.UploadType.toLowerCase());
            $("#UploadFileKompilasi").attr("accept", data.MConfigUploadFile.UploadTypeContent);

            $('#VerForKompilasiUploadDetailModal').modal('toggle');
        } else {
            clsGlobal.swalWarning("Data tidak ditemukan!");
        }

    },
    Upload: function (button) {
        var row = $(button).closest('tr');
        var data = oTableUploadFile.row(row).data();
        if (data) {
            // Binding Data
            $("#KompilasiFileId").val(data.KompilasiFileId);
            $("#FileUploadId").val(data.FileUploadId);
            $("#MConfigUpload").val(JSON.stringify(data.MConfigUploadFile));
            $("#dokumenPersyaratanUpload").text(data.MConfigUploadFile.UploadName);
            $("#KompilasiFile").val(JSON.stringify(data));

            // Setting Config Upload
            $("#UploadFileKompilasi").attr(data.MConfigUploadFile.UploadType.toLowerCase(), data.MConfigUploadFile.UploadType.toLowerCase());
            $("#UploadFileKompilasi").attr("accept", data.MConfigUploadFile.UploadTypeContent);

            $('#VerForKompilasiUploadModal').modal('toggle');
        } else {
            clsGlobal.swalWarning("Data tidak ditemukan!");
        }

    },
    Render: function () {
        //debugger;
        if ($.fn.DataTable.isDataTable('#dataTableUploadFile')) {
            $('#dataTableUploadFile').DataTable().destroy();
        }

        const role = usrRole ? usrRole.toUpperCase() : "";

        // Safety check data objects
        const status = (Data && Data.FormulaHeader && Data.FormulaHeader.Status)
            ? Data.FormulaHeader.Status.toUpperCase()
            : "";

        const IsApproveinitRA = Data.FormulaHeader.Status === "REQUESTED" ? false : true;

        const valRa = (Data && Data.FormulaDetail) ? Data.FormulaDetail.ApprovalRa : null;

        const isRaPending = (valRa === null || valRa === "");

        const btnUploadHtml = `<button data-bs-toggle="tooltip" title="Upload Data" type="button" class='btn btn-info btn-sm me-1' onclick='TableUploadFile.Upload(this)'><i class="fas fa-file-alt"></i></button>`;
        const btnEditHtml = `<button data-bs-toggle="tooltip" title="Edit Data" type="button" class='btn btn-warning btn-sm' onclick='TableUploadFile.Edit(this)'><i class="fas fa-pencil-alt"></i></button>`;

        oTableUploadFile = $('#dataTableUploadFile').DataTable({
            "data": Data.ListFile,
            "dom": 'rtip',
            "pageLength": 10,
            "paging": false,
            "searching": false,
            "ordering": false,
            "info": false,
            "autoWidth": false,
            "columns": [
                {
                    "data": null,
                    render: (data, type, row, meta) => meta.row + 1
                },
                {
                    "data": null,
                    className: "text-nowrap",
                    render: function (data, type, row) {
                        const uploadName = row.MConfigUploadFile?.UploadName || "";
                        const uploadTooltip = row.MConfigUploadFile?.UploadTooltip || "";

                        return `
                    <div class="d-flex justify-content-between align-items-center">
                        <p class="mb-0">${uploadName} 
                            <span>
                                <i class="fas fa-info-circle text-primary ms-1" 
                                   style="cursor: pointer;"
                                   data-bs-toggle="tooltip" 
                                   data-html="true"
                                   title="${uploadTooltip.replace(/;/g, '<br> <br>')}"
                                   tabindex="0">
                                </i>
                            </span>
                        </p>
                    </div>`;
                    }
                },
                {
                    "data": "FileUploadId",
                    className: "text-nowrap",
                    render: function (data, type, row) {
                        if (!data) {
                            return "Belum Upload File";
                        }

                        return `<a href="javascript:void(0);" data-bs-toggle="tooltip" onclick="TableUploadFile.ShowListFile('${row.KompilasiFileId}')" class="p-2 btn btn-sm btn-info noborder-radius">Pratinjau</a>`;
                    }
                },
                {
                    "data": "ReviewRa",
                    defaultContent: "",
                    className: "text-nowrap",
                    render: function (data) {
                        return data || "";
                    }
                },
                {
                    "data": "NotesRa",
                    defaultContent: "",
                    render: function (data) {
                        if (!data) {
                            return "";
                        }
                        return `<div style="width: 200px;"><span class="text-wrap">${data}</span></div>`;
                    }
                },
                {
                    "data": "Void",
                    className: "text-center",
                    render: function (data) {
                        return data ? `<i class="fas fa-check text-success"></i>` : ``;
                    }
                },
                {
                    "data": null,
                    defaultContent: "",
                    className: "text-nowrap text-center",
                    render: function (data, type, row) {
                        let buttons = "";

                        if (status === "CANCELLED") {
                            return "";
                        }

                        if (role === "ADMINISTRATOR") {
                            buttons = btnUploadHtml + btnEditHtml;
                        }

                        else if (role === "PDV") {
                            const allowUpload = [
                                "REQUESTED",
                                "IN-PROGRESS",
                                "NEED REVISION-VERFOR",
                            ];

                            if (allowUpload.includes(status) && IsApproveinitRA) {
                                buttons = btnUploadHtml;
                            }
                        }

                        else if (role === "RA") {
                            const allowEdit = ["SUBMITTED"];

                            if (allowEdit.includes(status) && isRaPending) {
                                buttons = btnEditHtml;
                            }
                            else if (status == "REQUESTED" && !IsApproveinitRA) {
                                buttons = btnEditHtml;
                            }
                        }

                        else if (role === "QFS") {
                            // Kosong
                        }

                        return buttons ? `<div class="btn-group" role="group">${buttons}</div>` : "";
                    }
                }
            ]
        });

        Helper.RenderTooltip();
    },
    Delete: function (button) {
        var row = $(button).closest('tr');
        var data = oTableContentClaim.row(row).data();
        if (data) {
            Data.ModelProject.ProjectDesc.ContentClaimList = Data.ModelProject.ProjectDesc.ContentClaimList.filter(item => item.ContentClaimId !== data.ContentClaimId);
            oTableContentClaim.row(row).remove().draw();
        }
    },
    ShowListFile: function (HeaderId) {
        //Getting Object
        let datItem = Data.ListFile;
        //Finding item
        let datSel = datItem.find((item) => item.KompilasiFileId === HeaderId);

        //Generate and Show Modal
        TableUploadFile.GeneratePriviewFile(datSel);
        TableUploadFile.ShowModalPriviewFile();
    },
    GeneratePriviewFile: function (lstData) {
        const $contentContainer = $('#modalShowFilePriview');
        $contentContainer.empty();

        const role = usrRole ? usrRole.toUpperCase() : "";
        const status = (Data && Data.FormulaHeader && Data.FormulaHeader.Status) ? Data.FormulaHeader.Status.toUpperCase() : "";

        let canDelete = false;

        if (role === "ADMINISTRATOR") {
            canDelete = true;
        }
        else if (role === "PDV") {
            const allowedStatuses = [
                "REQUESTED",
                "IN-PROGRESS",
                "NEED REVISION-VERFOR",
            ];

            if (allowedStatuses.includes(status)) {
                canDelete = true;
            }
        }

        if (lstData.ListUploadFile && lstData.ListUploadFile.length > 0) {
            $.each(lstData.ListUploadFile, function (index, item) {
                console.log(item);
                const previewContainerId = `preview-content-${index}`;

                // Siapkan HTML Tombol Delete (Hanya jika canDelete == true)
                let btnDeleteHtml = '';
                if (canDelete) {
                    btnDeleteHtml = `
                    <button type="button" class="btn btn-danger btn-sm btn-delete-db" data-trans="${lstData.KompilasiFileId}" data-type="KOMPILASIFILE" data-id="${item.TxtUploadId}" data-name="${item.OriginalFileName}">
                        <i class="fas fa-trash me-1"></i> Hapus
                    </button>
                `;
                }

                const $filePreviewWrapper = $(`
        <div class="file-preview-item mb-4 pb-4 border-bottom" id="item-file-${item.Id}">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h5 class="mb-0 text-truncate" style="max-width: 60%;" title="${item.OriginalFileName}">${item.OriginalFileName}</h5>
                
                <div class="btn-group">
                    <a href="${item.PublicLink}" download="${item.OriginalFileName}" class="btn btn-success btn-sm">
                        <i class="fas fa-download me-1"></i> Unduh
                    </a> &nbsp;
                    ${btnDeleteHtml}
                </div>
            </div>

            <div id="${previewContainerId}" class="preview-area bg-light rounded p-3 text-center" style="min-height: 200px;">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="text-muted mt-2 small">Memuat pratinjau...</p>
            </div>
        </div>
        `);

                $contentContainer.append($filePreviewWrapper);

                setTimeout(function () {
                    const $targetContainer = $(`#${previewContainerId}`);
                    const fileExtension = item.FileExtenstion ? item.FileExtenstion.replace('.', '').toLowerCase() : '';

                    TableUploadFile.RenderContentItem(fileExtension, item.PublicLink, $targetContainer);

                }, 100 + (index * 50));

                // Event Listener Delete (Hanya dipasang jika tombol dirender)
                if (canDelete) {
                    $filePreviewWrapper.find('.btn-delete-db').on('click', function () {
                        const fileId = $(this).data('id');
                        const transId = $(this).data('trans');
                        const fileType = $(this).data('type');
                        const fileName = $(this).data('name');
                        const $wrapper = $(this).closest('.file-preview-item');

                        Swal.fire({
                            title: 'Hapus File?',
                            text: `Anda yakin ingin menghapus file "${fileName}" secara permanen?`,
                            icon: 'warning',
                            customClass: {
                                confirmButton: 'btn btn-success',
                                cancelButton: 'btn btn-outline-danger ms-1'
                            },
                            confirmButtonText: 'Ya, Hapus!',
                            cancelButtonText: 'Batal'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                const $btn = $(this);
                                const originalBtnHtml = $btn.html();
                                $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i>');

                                $.ajax({
                                    url: '/VerFor/DeleteFileUpload',
                                    type: 'POST',
                                    data: {
                                        __RequestVerificationToken: $('#VerForPanel input[name=__RequestVerificationToken]').val(),
                                        Id: fileId,
                                        TransId: transId,
                                        Type: fileType
                                    },
                                    success: function (retDat, status, xhr) {
                                        if (xhr.responseText.includes("!DOCTYPE html")) {
                                            clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                                        }
                                        else {
                                            if (retDat.bitSuccess == true) {
                                                Swal.fire({ icon: 'success', title: 'Terhapus', timer: 1500, showConfirmButton: false });
                                                $wrapper.fadeOut(300, function () {
                                                    $(this).remove();
                                                    if ($contentContainer.children().length === 0) {
                                                        $contentContainer.html('<p class="text-center text-muted">Tidak ada file yang tersedia.</p>');
                                                    }
                                                });

                                                // Update List Data (Menggunakan TableUploadFile bukan TableUploadIngFile)
                                                TableUploadFile.UpdatedListFile(retDat.objData);
                                            }
                                            else {
                                                if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                                                    clsGlobal.swalWarning(retDat.txtMessage);
                                                    $btn.prop('disabled', false).html(originalBtnHtml);
                                                }
                                                else {
                                                    clsGlobal.swalError(retDat.txtMessage);
                                                    $btn.prop('disabled', false).html(originalBtnHtml);
                                                }
                                            }
                                        }
                                    },
                                    error: function (err) {
                                        Swal.fire('Error!', 'Gagal menghubungi server.', 'error');
                                        $btn.prop('disabled', false).html(originalBtnHtml);
                                    }
                                });
                            }
                        });
                    });
                }
            });

        } else {
            $contentContainer.append('<p class="text-center text-muted">Tidak ada file yang tersedia.</p>');
        }
    },
    UpdatedListFile: function (data) {
        //debugger;
        let dataParsed = JSON.parse(data);
        //Getting Object
        let datItem = Data.ListFile;
        let datIdxSel = datItem.findIndex((item) => item.KompilasiFileId === dataParsed.KompilasiFileId);

        // Update ListUploadFile
        Data.ListFile[datIdxSel] = dataParsed;

        TableUploadFile.Render();
    },
    RenderContentItem(ext, link, $container) {
        $container.empty().css('text-align', 'left').removeClass('p-3 bg-light text-center');

        switch (ext) {
            case "pdf":
                $container.html(`<iframe src="${link}" style="width:100%; height:500px; border:none;" frameborder="0"></iframe>`);
                break;
            case "png":
            case "jpg":
            case "jpeg":
            case "gif":
            case "jfif":
            case "svg":
                const $imgBox = $('<div class="preview-content text-center"></div>');
                Helper.RenderImage(link, $imgBox.get(0));
                $container.append($imgBox);
                break;
            case "docx":
                const $docxBox = $('<div class="preview-content preview-box" style="height: 500px; overflow-y: auto; border: 1px solid #ddd;"></div>');
                $container.append($docxBox);
                // Helper ini biasanya berat, makanya ditaruh di timeout
                Helper.RenderDocx(link, $docxBox.get(0));
                break;
            case "xlsx":
                const $xlsxBox = $('<div class="preview-content preview-box" style="height: 500px; overflow-y: auto; border: 1px solid #ddd;"></div>');
                $container.append($xlsxBox);
                Helper.RenderXlsx(link, $xlsxBox.get(0));
                break;
            default:
                // Tampilan Not Supported (menggunakan style Opsi 3 sebelumnya)
                $container.html(`
                            <div class="d-flex align-items-center justify-content-center text-muted bg-light border rounded" style="height: 150px;">
                                <div class="text-center">
                                    <i class="fas fa-eye-slash fa-2x mb-2 text-secondary"></i>
                                    <p class="mb-0 small">Pratinjau belum tersedia untuk format <strong>.${ext}</strong></p>
                                </div>
                            </div>
                        `
                )
            ;
        }
    },
    GeneratePriviewUpload: function (event) {
        const $previewContainer = $('#modalShowFileUploaded');
        const inputElement = event.target;

        $previewContainer.empty().hide();
        currentPreviewBlobUrls = [];

        // Hapus blob URL lama dari memori
        if (currentPreviewBlobUrls.length > 0) {
            currentPreviewBlobUrls.forEach(url => URL.revokeObjectURL(url));
            currentPreviewBlobUrls = [];
        }

        const files = inputElement.files;
        if (!files || files.length === 0) {
            return;
        }

        $previewContainer.show();
        $previewContainer.append(`<h5>Pratinjau (${files.length} file):</h5>`);

        Array.from(files).forEach((file, index) => {
            const fileName = file.name;
            const fileExtension = fileName.split('.').pop().toLowerCase();
            let $previewElement;

            const $fileWrapper = $(`
            <div class="file-preview-item mb-4 pb-3 border-bottom position-relative" id="preview-item-${index}">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <strong>${fileName}</strong>
                    
                    <button type="button" class="btn btn-sm btn-danger btn-remove-file">
                        <i class="fa fa-trash me-1"></i> Hapus
                    </button>
                </div>
            </div>
        `);

            // Logic Delete File
            $fileWrapper.find('.btn-remove-file').on('click', function () {
                const dt = new DataTransfer();
                const currentFiles = inputElement.files;

                // Loop file yang ada di input SEKARANG
                for (let i = 0; i < currentFiles.length; i++) {
                    const f = currentFiles[i];
                    if (f.name !== file.name || f.lastModified !== file.lastModified) {
                        dt.items.add(f);
                    }
                }

                inputElement.files = dt.files;

                $fileWrapper.remove();

                if (inputElement.files.length === 0) {
                    $previewContainer.hide();
                } else {
                    $previewContainer.find('h5').first().text(`Pratinjau (${inputElement.files.length} file):`);
                }
            });

            switch (fileExtension) {
                case "pdf":
                    const pdfBlobUrl = URL.createObjectURL(file);
                    currentPreviewBlobUrls.push(pdfBlobUrl);
                    $previewElement = $(`
                    <iframe src="${pdfBlobUrl}" style="width:100%; height:400px; border:1px solid #ddd;" frameborder="0"></iframe>
                `);
                    $fileWrapper.append($previewElement);
                    break;

                case "png":
                case "jpg":
                case "jpeg":
                case "gif":
                case "jfif":
                case "svg":
                    const imgBlobUrl = URL.createObjectURL(file);
                    currentPreviewBlobUrls.push(imgBlobUrl);
                    $previewElement = $('<div class="preview-content" style="max-height: 400px; overflow: auto;"></div>');
                    Helper.RenderImage(imgBlobUrl, $previewElement.get(0));
                    $fileWrapper.append($previewElement);
                    break;

                case "docx":
                case "xlsx":
                    const reader = new FileReader();
                    $previewElement = $('<div class="preview-content preview-box" style="height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 10px;">Memproses pratinjau...</div>');
                    $fileWrapper.append($previewElement);

                    reader.onload = function (e) {
                        const fileData = e.target.result;
                        $previewElement.empty();
                        if (fileExtension === "docx") {
                            Helper.RenderDocx(fileData, $previewElement.get(0));
                        } else if (fileExtension === "xlsx") {
                            Helper.RenderXlsx(fileData, $previewElement.get(0));
                        }
                    };
                    reader.onerror = function () {
                        $previewElement.html('<p class="text-danger">Gagal membaca file.</p>');
                    };
                    reader.readAsArrayBuffer(file);
                    break;

                default:
                    $previewElement = $(`<p class="text-muted mt-2 fst-italic">Format <strong>.${fileExtension}</strong> belum mendukung tampilan pratinjau.</p>`);
                    $fileWrapper.append($previewElement);
            }

            $previewContainer.append($fileWrapper);
        });
    },
    EmptyPriviewUpload: function () {
        $("#modalShowFileUploaded").empty();
    },
    ShowModalPriviewFile: function () {
        $('#ShowPriviewFileModal').modal('toggle');
    },
    CloseModalPriviewFile: function() {
        $('#ShowPriviewFileModal').modal('toggle');
    },
    RefreshData: function (data) {
        let datListFile = Data.ListFile;

        const index = Data.ListFile.findIndex(x => x.KompilasiFileId == data.KompilasiFileId);

        if (index !== -1) {
            // 3. Jika ketemu, ganti item di index tersebut dengan data yang baru
            Data.ListFile[index] = data;
        }

        TableUploadFile.Render();
    }
}

var TableBTPHeader = {
    Render: function () {
        // 1. Safe Destroy
        if ($.fn.DataTable.isDataTable('#dataTableBtpHeader')) {
            $('#dataTableBtpHeader').DataTable().destroy();
        }

        // Lookup dan Mapping Master Data
        const createLookup = (jsonString) => {
            if (!jsonString) return {};
            try {
                const data = JSON.parse(jsonString);
                return data.reduce((acc, curr) => {
                    acc[curr.TxtCode] = curr.TxtDescription;
                    return acc;
                }, {});
            } catch (e) { return {}; }
        };

        const mapStatusOrganik = createLookup($("#hdDataStatusOrganik").val());
        const mapJenisAlg = createLookup($("#hdDataJenisAlg").val());
        const mapLabelAlg = createLookup($("#hdDataLabelAlg").val());
        const mapACO = createLookup($("#hdDataACO").val());
        const mapEGDEG = createLookup($("#hdDataEGDEG").val());

        // Binding to Value
        const mapCodesToDesc = (codes, lookupMap) => {
            if (!codes) return "";
            return codes.split(',').map(code => lookupMap[code] || code).join(', ');
        };

        // Getting Role
        const role = usrRole ? usrRole.toUpperCase() : "";

        // Getting Status
        const status = (Data && Data.FormulaHeader && Data.FormulaHeader.Status)
            ? Data.FormulaHeader.Status.toUpperCase()
            : "";

        const valRa = (Data && Data.FormulaDetail) ? Data.FormulaDetail.ApprovalRa : null;
        const valQa = (Data && Data.FormulaDetail) ? Data.FormulaDetail.ApprovalQa : null;

        const isRaPending = (valRa === null || valRa === "");
        const isQaPending = (valQa === null || valQa === "");

        // Button Templates
        const btnReviewHtml = (id) => `<button data-bs-toggle="tooltip" title="Review Data" type="button" class='btn btn-info btn-sm me-1' onclick='TableBTPHeader.Review("${id}")'><i class="fas fa-file"></i></button>`;
        const btnEditHtml = (id) => `<button data-bs-toggle="tooltip" title="Edit Data" type="button" class='btn btn-warning btn-sm me-1' onclick='TableBTPHeader.Edit("${id}")'><i class="fas fa-pencil-alt"></i></button>`;
        const btnUploadHtml = (id) => `<button data-bs-toggle="tooltip" title="Upload Data" type="button" class='btn btn-secondary btn-sm me-1' onclick='TableBTPHeader.Upload(this, "${id}")'><i class="fas fa-upload"></i></button>`;
        const btnDeleteHtml = (id) => `<button data-bs-toggle="tooltip" title="Delete Data" type="button" class='btn btn-danger btn-sm' onclick='TableBTPHeader.Delete("${id}")'><i class="fas fa-trash"></i></button>`;
        const btnPreviewHtml = (formulaId, fileId) => `<a href="javascript:void(0);" data-bs-toggle="tooltip" onclick="TableBTPHeader.ShowListFile('${formulaId}', '${fileId}')" class="p-2 btn btn-sm btn-info noborder-radius"> Pratinjau</a>`;

        oTableBtpHeader = $('#dataTableBtpHeader').DataTable({
            "data": Data.ListBtp,
            "dom": 'rtip',
            "pageLength": 10,
            "paging": false,
            "searching": false,
            "ordering": false,
            "info": false,
            "autoWidth": false,
            "scrollCollapse": true,
            "fixedColumns": {
                left: 2,
                right: 1
            },
            "columns": [
                {
                    "data": null,
                    "width": "50px",
                    render: (data, type, row, meta) => meta.row + 1
                },
                {
                    "data": "ItemCode",
                    "width": "120px",
                    render: function (data, type, row) {
                        if (!data) return "";
                        console.log(row);

                        let datBtp = JSON.parse(row.BtpDetail);

                        if (datBtp.length == 0) {
                            return data;
                        }

                        return `<a href="javascript:void(0);" title="Open Detail Komposisi" onclick="TableBTPHeader.FilterData('${row.FormulaBtpid}')">${data}</a>`;
                    }
                },
                { "data": "ItemDesc", className: 'dt-left text-nowrap' },
                { "data": "SupplierName", className: 'dt-left text-nowrap' },
                { "data": "AlternatifBahan", className: 'dt-left text-nowrap' },
                { "data": "JenisBahan", className: 'dt-left text-nowrap' },
                {
                    "data": "JumlahBahan",
                    className: 'dt-left text-nowrap',
                    render: (data) => data ? numeral(data).format(',.[0000]') : ""
                },
                {
                    "data": "StatusOrganik",
                    className: 'dt-left text-nowrap',
                    render: (data) => (data && mapStatusOrganik[data]) ? mapStatusOrganik[data] : data
                },
                {
                    "data": "BahanOrganikId",
                    className: 'dt-center text-nowrap',
                    render: function (data, type, row) {
                        return data ? btnPreviewHtml(row.FormulaBtpid, row.BahanOrganikId) : "Belum Upload File";
                    }
                },
                { "data": "NegaraAsal", className: 'dt-left text-nowrap' },
                { "data": "Gmo", className: 'dt-left text-nowrap' },
                {
                    "data": "JenisAlergen",
                    className: 'dt-left text-nowrap',
                    render: (data) => mapCodesToDesc(data, mapJenisAlg)
                },
                {
                    "data": "LabelAlergen",
                    className: 'dt-left text-nowrap',
                    render: (data) => mapCodesToDesc(data, mapLabelAlg)
                },
                {
                    "data": "JenisBtpcarryOver",
                    className: 'dt-left text-nowrap',
                    render: (data) => mapCodesToDesc(data, mapACO)
                },
                {
                    "data": "IsEgdeg",
                    className: 'dt-left text-nowrap',
                    render: (data) => mapCodesToDesc(data, mapEGDEG)
                },
                {
                    "data": "KeteranganEgdegid",
                    className: 'dt-center text-nowrap',
                    render: function (data, type, row) {
                        return data ? btnPreviewHtml(row.FormulaBtpid, row.KeteranganEgdegid) : "Belum Upload File";
                    }
                },
                { "data": "PenyusunBahanBaku", className: 'dt-left text-nowrap' },
                { "data": "StatusBahan", className: 'dt-left text-nowrap' },
                {
                    "data": "FileSpekId",
                    className: 'dt-center text-nowrap',
                    render: function (data, type, row) {
                        return data ? btnPreviewHtml(row.FormulaBtpid, row.FileSpekId) : "Belum Upload File";
                    }
                },
                { "data": "Keterangan", className: 'dt-left text-nowrap' },
                { "data": "StatusReviewQa", className: 'dt-left text-nowrap' },
                { "data": "StatusReviewRa", className: 'dt-left text-nowrap' },
                {
                    "data": "KeteranganReview",
                    "defaultContent": "",
                    className: 'dt-left',
                    "width": "250px",
                    render: function (data, type, row) {
                        if (!data) return "";
                        return `<div style="white-space: pre-wrap; max-height: 100px; overflow-y: auto; font-size: 0.9em;">${data}</div>`;
                    }
                },
                {
                    "data": null,
                    defaultContent: "",
                    "width": "200px",
                    className: "text-nowrap text-center",
                    render: function (data, type, row) {
                        let buttons = "";
                        const id = row.FormulaBtpid;

                        if (status === "CANCELLED") {
                            return "";
                        }

                        if (role === "ADMINISTRATOR") {
                            buttons += btnReviewHtml(id);
                            buttons += btnEditHtml(id);
                            buttons += btnUploadHtml(id);
                            buttons += btnDeleteHtml(id);
                        }

                        else if (role === "PDV") {
                            const allowEdit = [
                                "REQUESTED",
                                "IN-PROGRESS",
                                "NEED REVISION-VERFOR"
                            ];

                            if (allowEdit.includes(status)) {
                                buttons += btnEditHtml(id);
                                buttons += btnUploadHtml(id);
                                buttons += btnDeleteHtml(id);
                            }
                        }

                        else if (role === "RA") {
                            if (status === "SUBMITTED" && isRaPending) {
                                buttons += btnReviewHtml(id);
                            }
                        }

                        else if (role === "QFS") {
                            if (status === "SUBMITTED" && isQaPending) {
                                buttons += btnReviewHtml(id);
                            }
                        }

                        return buttons ? `<div class="btn-group" role="group">${buttons}</div>` : "";
                    }
                }
            ]
        });

        Helper.RenderTooltip();
    },
    FilterData: function (id) {
        var lstData = Data.ListBtp;

        var datDet = lstData.find(x => x.FormulaBtpid == id);

        if (datDet == undefined) {
            clsGlobal.swalWarning("Data Detail BTP Kosong");

            return false;
        }
        else {
            var lstDatDet = JSON.parse(datDet.BtpDetail);
            console.log(lstDatDet);
            TableBTPDetail.ShowTable(lstDatDet, datDet.ItemCode);
        }
    },
    Edit: function (Id) {
        $(".select2-modal").select2({
            width: "100%",
            dropdownParent: $("#FormulaBTPHeaderModal")
        });

        TableBTPHeader.InitForm();
        // Getting Data BTP
        let datDet = Data.ListBtp.find(x => x.FormulaBtpid == Id);

        if (datDet == undefined) {
            clsGlobal.swalWarning("Data Kosong");
            return false;
        }



        // Binding Data From Table
        $("#ItemCodeBtpHeader").val(datDet.ItemCode).trigger("change").trigger("select2:select");

        if (datDet.JenisAlergen != null) {
            $("#JenisAlergenBtpHeader").val(datDet.JenisAlergen.split(",")).trigger("change");
        }

        if (datDet.JenisAlergen != null) {
            $("#JenisAlergenBtpHeader").val(datDet.JenisAlergen.split(",")).trigger("change");
        }
        else {
            $("#JenisAlergenBtpHeader").val(null).trigger("change");
        }

        if (datDet.LabelAlergen != null) {
            $("#AlergenLabelBtpHeader").val(datDet.LabelAlergen.split(",")).trigger("change");
        }
        else {
            $("#AlergenLabelBtpHeader").val(null).trigger("change");
        }

        if (datDet.IsEgdeg != null) {
            $("#BahanEGDEGBtpHeader").val(datDet.IsEgdeg.split(",")).trigger("change");
        }
        else {
            $("#BahanEGDEGBtpHeader").val(null).trigger("change");
        }

        if (datDet.JenisBtpcarryOver != null) {
            $("#AlkoholCarryOverBtpHeader").val(datDet.JenisBtpcarryOver.split(",")).trigger("change");
        }
        else {
            $("#AlergenLabelBtpHeader").val(null).trigger("change");
        }

        $("#StatusOrganikBtpHeader").val(datDet.StatusOrganik).trigger("change");
        $("#JumlahBahanBtpHeader").val(datDet.JumlahBahan).trigger("blur");
        $("#StatusBahanBtpHeader").val(datDet.StatusBahan).trigger("change");
        $("#PenyusunBahanBakuBtpHeader").val(datDet.PenyusunBahanBaku);
        $("#KeteranganBtpHeader").val(datDet.Keterangan);
        $("#NegaraAsalHeaderBtpHeader").val(datDet.NegaraAsal).trigger("change");
        $("#FormulaBTPId").val(datDet.FormulaBtpid);

        $("#FormulaBTPHeaderModal").modal('toggle');
    },
    Review: function (Id) {

        $(".select2-modal").select2({
            width: "100%",
            dropdownParent: $("#FormulaBTPModalHeaderReviewModal")
        });

        let datDet = Data.ListBtp.find(x => x.FormulaBtpid == Id);

        if (!datDet) {
            clsGlobal.swalWarning("Data Kosong");
            return false;
        }


        $("#ItemCodeBtpHeaderReview").val(datDet.ItemCode).trigger("change");

        const splitVal = (str) => str ? str.split(",") : null;

        $("#JenisAlergenBtpHeaderReview").val(splitVal(datDet.JenisAlergen)).trigger("change");
        $("#AlergenLabelBtpHeaderReview").val(splitVal(datDet.LabelAlergen)).trigger("change");
        $("#BahanEGDEGBtpHeaderReview").val(splitVal(datDet.IsEgdeg)).trigger("change");
        $("#AlkoholCarryOverBtpHeaderReview").val(splitVal(datDet.JenisBtpcarryOver)).trigger("change");

        $("#StatusOrganikBtpHeaderReview").val(datDet.StatusOrganik).trigger("change");
        $("#JumlahBahanBtpHeaderReview").val(datDet.JumlahBahan).trigger("blur");
        $("#StatusBahanBtpHeaderReview").val(datDet.StatusBahan).trigger("change");
        $("#PenyusunBahanBakuBtpHeaderReview").val(datDet.PenyusunBahanBaku);
        $("#KeteranganBtpHeaderReview").val(datDet.Keterangan);
        $("#NegaraAsalBtpHeaderReview").val(datDet.NegaraAsal).trigger("change");
        $("#FormulaBTPIdReview").val(datDet.FormulaBtpid);

        const formInputs = [
            "#ItemCodeBtpHeaderReview", "#JenisAlergenBtpHeaderReview",
            "#AlergenLabelBtpHeaderReview", "#BahanEGDEGBtpHeaderReview",
            "#AlkoholCarryOverBtpHeaderReview", "#StatusOrganikBtpHeaderReview",
            "#JumlahBahanBtpHeaderReview", "#StatusBahanBtpHeaderReview",
            "#PenyusunBahanBakuBtpHeaderReview", "#KeteranganBtpHeaderReview",
            "#NegaraAsalBtpHeaderReview"
        ];
        $(formInputs.join(", ")).prop("disabled", true);


        const showFile = (fileId, containerId) => {
            if (fileId) {
                TableBTPHeader.ShowListFileReview(datDet.FormulaBtpid, fileId, containerId);
                $("#" + containerId).show();
            } else {
                $("#" + containerId).hide();
            }
        };

        showFile(datDet.BahanOrganikId, "modalShowFileReviewBahanOrganikBtpHeaderReviewUploaded");
        showFile(datDet.KeteranganEgdegid, "modalShowFileReviewEGDEGBtpHeaderReviewUploaded");
        showFile(datDet.FileSpekId, "modalShowFileReviewSpekBtpHeaderReviewUploaded");


        $("#SelectStatusRA").val(datDet.StatusReviewRa).trigger("change");
        $("#SelectStatusQA").val(datDet.StatusReviewQa).trigger("change");
        $("#KeteranganReviewBtpHeaderReview").val(datDet.KeteranganReview);

        const role = usrRole ? usrRole.toUpperCase() : "";

        $("#SelectStatusRA").prop("disabled", true);
        $("#SelectStatusQA").prop("disabled", true);
        $("#KeteranganReviewBtpHeaderReview").prop("disabled", true);

        if (role === "RA") {
            $("#SelectStatusRA").prop("disabled", false);
            $("#KeteranganReviewBtpHeaderReview").prop("disabled", false);
        }
        else if (role === "QFS") {
            $("#SelectStatusQA").prop("disabled", false);
            $("#KeteranganReviewBtpHeaderReview").prop("disabled", false);
        }
        else if (role === "ADMINISTRATOR") {
            $("#SelectStatusRA").prop("disabled", false);
            $("#SelectStatusQA").prop("disabled", false);
            $("#KeteranganReviewBtpHeaderReview").prop("disabled", false);
        }

        $("#FormulaBTPModalHeaderReviewModal").modal('toggle');
    },
    Add: function () {
        $(".select2-modal").select2({
            width: "100%",
            dropdownParent: $("#FormulaBTPHeaderModal")
        });

        TableBTPHeader.InitForm();

        $("#FormulaBTPHeaderModal").modal('toggle');
    },
    InitForm: function () {
        // Clear All Form
        $("#FormulaBTPId").val("");
        $("#ItemCodeBtpHeader").val(null).trigger("change");
        $("#ItemDescriptionBtpHeader").val("");
        $("#ItemSupplierBtpHeader").empty().trigger("change");
        $("#JenisBahanBtpHeader").val("");
        $("#JumlahBahanBtpHeader").val("");
        $("#StatusOrganikBtpHeader").val(null).trigger("change");
        $("#NegaraAsalHeaderBtpHeader").empty().trigger("change");
        $("#JenisAlergenBtpHeader").val(null).trigger("change");
        $("#AlergenLabelBtpHeader").val(null).trigger("change");

        $("#GMOBtpHeader").val("");
        $("#AlkoholCarryOverBtpHeader").val(null).trigger("change");
        $("#BahanEGDEGBtpHeader").val(null).trigger("change");
        $("#StatusBahanBtpHeader").val(null).trigger("change");
        $("#PenyusunBahanBakuBtpHeader").val("");
        $("#KeteranganBtpHeader").val("");
    },
    InitSelectNegara: function (val) {
        //debugger;
        let lstOptNegara = [];
        let lstSelNegara = [];
        let lstBtpHeader = JSON.parse($("#hdDataBTPHeader").val());
        let lstNegara = lstBtpHeader.find(x => x.ItemCode.toLowerCase() == val.toLowerCase() && x.NegaraAsal != null);

        if (lstNegara != undefined) {
            lstSelNegara = lstNegara.NegaraAsal.split("|");
        }

        // Delete Option Fist
        $('#NegaraAsalHeaderBtpHeader').empty().trigger('change');

        // Default Select Null
        //lstOptNegara.push(new Option("", null, true, true));

        if (lstSelNegara.length == 1) {
            lstSelNegara.forEach((val, index) => {
                debugger;
                lstOptNegara.push(new Option(val, val, false, true));

                $('#NegaraAsalHeaderBtpHeader').append(lstOptNegara);
            });

            $("#NegaraAsalHeaderBtpHeader").trigger("change");
        }
        else {
            lstSelNegara.forEach((val, index) => {
                debugger;
                lstOptNegara.push(new Option(val, val, false, false));

                $('#NegaraAsalHeaderBtpHeader').append(lstOptNegara);
            });

            $("#NegaraAsalHeaderBtpHeader").val(null).trigger("change");
        }

    },
    InitSelectSupplier: function (val) {
        let lstBtpHeader = JSON.parse($("#hdDataBTPHeader").val());
        let lstItemSupp = lstBtpHeader.filter(x => x.ItemCode.toLowerCase() == val.toLowerCase() && x.ItemSupplier != null);

        // Delete Option Fist
        $('#ItemSupplierBtpHeader').empty().trigger('change');

        //debugger;
        if (lstItemSupp.length == 1) {
            lstItemSupp.forEach((val, index) => {
                var newOption = new Option(val.ItemSupplier, val.ItemSupplier, false, true);

                $('#ItemSupplierBtpHeader').append(newOption);
            });

            $("#ItemSupplierBtpHeader").trigger("change");
        }
        else {
            lstItemSupp.forEach((val, index) => {
                var newOption = new Option(val.ItemSupplier, val.ItemSupplier, false, false);

                $('#ItemSupplierBtpHeader').append(newOption);
            });

            $("#ItemSupplierBtpHeader").trigger("change");
        }
    },
    BindingDataChangeItem: function (val) {
        let lstBtpHeader = JSON.parse($("#hdDataBTPHeader").val());
        let detBtpHeader = lstBtpHeader.find(x => x.ItemCode.toLowerCase() == val.toLowerCase());
        // Binding Data
        $("#ItemDescriptionBtpHeader").val(detBtpHeader.ItemDescription);
        $("#JenisBahanBtpHeader").val(detBtpHeader.JenisBahan);
        $("#GMOBtpHeader").val(detBtpHeader.GMO);
        $("#JenisAlergenBtpHeader").val(detBtpHeader.ListAlergent.split(",")).trigger("change");

        // Init Select Negara dan Supplier
        TableBTPHeader.InitSelectNegara(val);
        TableBTPHeader.InitSelectSupplier(val);
    },
    Save: function () {
        var datReq = TableBTPHeader.MappingDataBtpHeader();

        if (datReq) {
            $.ajax({
                type: "POST",
                url: "/VerFor/SaveBTPHeader",
                datatype: "json",
                async: true,
                data: {
                    __RequestVerificationToken: $('#FormulaBTPHeaderForm input[name=__RequestVerificationToken]').val(),
                    DataReq: datReq
                },
                success: function (retDat, status, xhr) {
                    if (xhr.responseText.includes("!DOCTYPE html")) {
                        clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                    }
                    else {
                        if (retDat.bitSuccess == true) {
                            $("#FormulaBTPHeaderModal").modal('toggle');

                            let datDet = JSON.parse(retDat.objData);

                            if (Data.ListBtp.some(x => x.FormulaBtpid == datDet.FormulaBtpid)) {

                                const index = Data.ListBtp.findIndex(x => x.FormulaBtpid == datDet.FormulaBtpid);

                                if (index !== -1) {
                                    Data.ListBtp[index] = datDet;
                                }

                                clsGlobal.swalSuccess("Success Update Data Komposisi");
                            }
                            else {
                                // Adding to Model
                                Data.ListBtp.push(datDet);

                                clsGlobal.swalSuccess("Success Create Data Komposisi");
                            }

                            // Refresh Grid
                            TableBTPHeader.Render();
                            TableBTPDetail.HideTable();
                            FormulaDetail.TotalJumlahBahan();
                        }
                        else {
                            if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                                clsGlobal.swalWarning(retDat.objData);
                            }
                            else {
                                clsGlobal.swalError(retDat.txtMessage);
                            }
                        }
                        $("#txtGUID").val(retDat.txtGUID);
                    }
                },
                error: function (xhr, status, error) {
                    clsGlobal.swalError(xhr.responseText);
                }
            });
        }
    },
    _validateBtpData: function (formData, existingList, editId) {

        if (formData.ItemCode == null || formData.ItemCode == "") {
            return { isValid: false, message: "Mohon pilih Item Code terlebih dahulu." };
        }
        if (formData.ItemSupp == null || formData.ItemSupp == "") {
            return { isValid: false, message: "Mohon pilih Supplier untuk item ini." };
        }
        if (formData.JumlahBahan == null || formData.JumlahBahan === "") {
            return { isValid: false, message: "Mohon masukkan Jumlah Bahan." };
        }
        if (formData.StatusOrganik == null || formData.StatusOrganik == "") {
            return { isValid: false, message: "Mohon pilih Status Organik." };
        }
        //if (formData.txtParamJenisAlergen == null || formData.txtParamJenisAlergen == "") {
        //    return { isValid: false, message: "Mohon pilih Jenis Alergen." };
        //}
        //if (formData.txtParamLabelAlergen == null || formData.txtParamLabelAlergen == "") {
        //    return { isValid: false, message: "Mohon pilih Label Alergen." };
        //}
        if (formData.txtParamACO == null || formData.txtParamACO == "") {
            return { isValid: false, message: "Mohon pilih Jenis BTP & Alkohol Carry Over." };
        }
        if (formData.txtParamEGDEG == null || formData.txtParamEGDEG == "") {
            return { isValid: false, message: "Mohon pilih status Potensi Bahan EG/DEG." };
        }
        if (formData.PenyusunBahan == null || formData.PenyusunBahan == "") {
            return { isValid: false, message: "Mohon isi Komposisi Penyusun Bahan Baku." };
        }
        if (formData.StatusBahan == null || formData.StatusBahan == "") {
            return { isValid: false, message: "Mohon pilih Status Bahan." };
        }

        let totalKomposisi = formData.JumlahBahan;
        let isDuplicate = false;
        const newItemCodeLower = formData.ItemCode.toLowerCase();

        $.each(existingList, function (i, item) {
            if (!editId || (editId && item.FormulaBtpid != editId)) {
                totalKomposisi += item.JumlahBahan;
            }

            if (item.ItemCode.toLowerCase() == newItemCodeLower) {
                if (!editId || (editId && item.FormulaBtpid != editId)) {
                    isDuplicate = true;
                }
            }
        });

        if (totalKomposisi > 100.05) {
            let totalStr = totalKomposisi.toFixed(2);
            return {
                isValid: false,
                message: "Total Jumlah Bahan melebihi 100.05%. Total saat ini:" + totalStr + "%"
            };
        }

        if (isDuplicate) {
            return {
                isValid: false,
                message: "Item Code '" + formData.ItemCode + "'sudah ada. Harap gunakan Item Code lain."
            };
        }

        return { isValid: true };
    },
    _createNewBtpDetailList: function (itemCode, categoryId, headerId, allBtpDetailData) {
        //debugger;
        const searchCode = itemCode.substring(1).toLowerCase();

        let filteredData = allBtpDetailData.filter(x =>
            x.ItemCodeBahan.substring(1).toLowerCase() === searchCode &&
            x.CategoryPangan == categoryId
        );

        if (filteredData.length === 0) {
            let rawByItem = allBtpDetailData.filter(x =>
                x.ItemCodeBahan.substring(1).toLowerCase() === searchCode && x.BtpId != null
            );

            filteredData = rawByItem.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.BtpId === value.BtpId
                ))
            ).map(item => ({
                ...item,
                JumlahMax: null,
                UomSatuan: null,
                TxtFlag: null
            }));
        }

        let lstDatBtpDetail = filteredData.map(y => ({
            BtpDetailId: crypto.randomUUID(),
            BtpHeaderId: headerId,
            BtpId: y.BtpId,
            InsNo: y.Ins,
            JenisBTP: y.JenisBtp,
            GolonganBTP: y.GolonganBtp,
            KandunganBTPSpek: y.KandunganBtp,
            BatasMaxJumlahBTP: y.JumlahMax,
            BatasMaxSatuanBTP: y.UomSatuan,
            RumusHitungBTP: null,
            HasilJumlahBTP: null,
            HasilSatuanBTP: null,
            Flag: y.TxtFlag
        }));

        return JSON.stringify(lstDatBtpDetail);
    },
    _updateExistingBtpDetailList: function (itemCode, categoryId, headerId, existingDetailJson, allBtpDetailData) {
        //debugger;
        const searchCode = itemCode.substring(1).toLowerCase();
        let datBTP = JSON.parse(existingDetailJson);

        let lstBtpSource = allBtpDetailData.filter(x =>
            x.ItemCodeBahan.substring(1).toLowerCase() === searchCode &&
            x.CategoryPangan == categoryId
        );

        if (lstBtpSource.length === 0) {
            let rawByItem = allBtpDetailData.filter(x =>
                x.ItemCodeBahan.substring(1).toLowerCase() === searchCode && x.BtpId != null
            );

            lstBtpSource = rawByItem.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.BtpId === value.BtpId
                ))
            ).map(item => ({
                ...item,
                JumlahMax: null,
                UomSatuan: null,
                TxtFlag: null
            }));
        }

        datBTP.forEach(targetItem => {
            const sourceItem = lstBtpSource.find(source => source.Ins === targetItem.InsNo);
            if (sourceItem) {
                targetItem.GolonganBTP = sourceItem.GolonganBtp;
                targetItem.KandunganBTPSpek = sourceItem.KandunganBtp;
                targetItem.BatasMaxJumlahBTP = sourceItem.JumlahMax;
                targetItem.BatasMaxSatuanBTP = sourceItem.UomSatuan;
                targetItem.Flag = sourceItem.TxtFlag;
                targetItem.JenisBTP = sourceItem.JenisBtp;
                targetItem.BtpId = sourceItem.BtpId;
            }
        });

        lstBtpSource.forEach(sourceItem => {
            const isAdded = datBTP.some(target => target.InsNo === sourceItem.Ins);
            if (!isAdded) {
                datBTP.push({
                    BtpId: sourceItem.BtpId,
                    BtpDetailId: crypto.randomUUID(),
                    BtpHeaderId: headerId,
                    InsNo: sourceItem.Ins,
                    JenisBTP: sourceItem.JenisBtp,
                    GolonganBTP: sourceItem.GolonganBtp,
                    KandunganBTPSpek: sourceItem.KandunganBtp,
                    BatasMaxJumlahBTP: sourceItem.JumlahMax,
                    BatasMaxSatuanBTP: sourceItem.UomSatuan,
                    RumusHitungBTP: null,
                    HasilJumlahBTP: null,
                    HasilSatuanBTP: null,
                    Flag: sourceItem.TxtFlag
                });
            }
        });

        return JSON.stringify(datBTP);
    },
    MappingDataBtpHeader: function () {
        //debugger;
        let dataBtpDetail = JSON.parse($("#hdDataBTPDetail").val());
        let FormulaBtpId = $("#FormulaBTPId").val();

        let lstParamJenisAlergen = [];
        $.each($("#JenisAlergenBtpHeader").find(":selected"), function (index, item) { lstParamJenisAlergen.push(item.value); });
        let txtParamJenisAlergen = clsGlobal.parseToString(lstParamJenisAlergen);

        let lstParamLabelAlergen = [];
        $.each($("#AlergenLabelBtpHeader").find(":selected"), function (index, item) { lstParamLabelAlergen.push(item.value); });
        let txtParamLabelAlergen = clsGlobal.parseToString(lstParamLabelAlergen);

        let lstParamACO = [];
        $.each($("#AlkoholCarryOverBtpHeader").find(":selected"), function (index, item) { lstParamACO.push(item.value); });
        let txtParamACO = clsGlobal.parseToString(lstParamACO);

        let lstParamEGDEG = [];
        $.each($("#BahanEGDEGBtpHeader").find(":selected"), function (index, item) { lstParamEGDEG.push(item.value); });
        let txtParamEGDEG = clsGlobal.parseToString(lstParamEGDEG);

        let ItemCode = $("#ItemCodeBtpHeader").find(":selected").val();
        let ItemDesc = $("#ItemDescriptionBtpHeader").val();
        let ItemSupp = $("#ItemSupplierBtpHeader").find(":selected").val();
        let ItemCodeBdBhn = $("#AltfBahanBedaItemCodeBtpHeader").find(":selected").val();
        let JenisBahan = $("#JenisBahanBtpHeader").val();
        let JumlahBahan = numeral($("#JumlahBahanBtpHeader").val()).value();
        let StatusOrganik = $("#StatusOrganikBtpHeader").find(":selected").val();
        let NegaraAsal = $("#NegaraAsalHeaderBtpHeader").find(":selected").val();
        let GMO = $("#GMOBtpHeader").val();
        let StatusBahan = $("#StatusBahanBtpHeader").val();
        let PenyusunBahan = $("#PenyusunBahanBakuBtpHeader").val();
        let Keterangan = $("#KeteranganBtpHeader").val();


        let formData = {
            ItemCode: ItemCode,
            ItemSupp: ItemSupp,
            JumlahBahan: JumlahBahan,
            StatusOrganik: StatusOrganik,
            txtParamJenisAlergen: txtParamJenisAlergen,
            txtParamLabelAlergen: txtParamLabelAlergen,
            txtParamACO: txtParamACO,
            txtParamEGDEG: txtParamEGDEG,
            PenyusunBahan: PenyusunBahan,
            StatusBahan: StatusBahan
        };

        let validationResult = TableBTPHeader._validateBtpData(formData, Data.ListBtp, FormulaBtpId);

        if (!validationResult.isValid) {
            clsGlobal.swalWarning(validationResult.message);
            return false;
        }

        //debugger;

        let DataReq = Data.ListBtp.find(x => x.FormulaBtpid == FormulaBtpId);
        let isNewData = false;

        if (DataReq == undefined) {
            DataReq = { ...Data.FormulaBtp };
            isNewData = true;
        }

        let IdFormulaBtp = isNewData ? crypto.randomUUID() : FormulaBtpId;

        let itemCodeChanged = !isNewData && DataReq.ItemCode.toLowerCase() != ItemCode.toLowerCase();

        if (isNewData || itemCodeChanged) {
            DataReq.BtpDetail = TableBTPHeader._createNewBtpDetailList(
                ItemCode,
                Data.FormulaHeader.FoodCategoryId,
                IdFormulaBtp,
                dataBtpDetail
            );
        }
        else if (!isNewData && !itemCodeChanged) {
            DataReq.BtpDetail = TableBTPHeader._updateExistingBtpDetailList(
                ItemCode,
                Data.FormulaHeader.FoodCategoryId,
                IdFormulaBtp,
                DataReq.BtpDetail,
                dataBtpDetail
            );
        }
        DataReq.FormulaBtpid = IdFormulaBtp;
        DataReq.VerForHeaderId = Data.FormulaHeader.VerForHeaderId;
        DataReq.FormulaId = Data.FormulaDetail.FormulaId;
        DataReq.ItemCode = ItemCode;
        DataReq.ItemDesc = ItemDesc;
        DataReq.SupplierName = ItemSupp;
        DataReq.AlternatifBahan = ItemCodeBdBhn;
        DataReq.JenisBahan = JenisBahan;
        DataReq.JumlahBahan = JumlahBahan;
        DataReq.StatusOrganik = StatusOrganik;
        DataReq.NegaraAsal = NegaraAsal;
        DataReq.Gmo = GMO;
        DataReq.JenisAlergen = txtParamJenisAlergen;
        DataReq.LabelAlergen = txtParamLabelAlergen;
        DataReq.JenisBtpcarryOver = txtParamACO;
        DataReq.IsEgdeg = txtParamEGDEG;
        DataReq.PenyusunBahanBaku = PenyusunBahan;
        DataReq.StatusBahan = StatusBahan;
        DataReq.Keterangan = Keterangan;

        return DataReq;
    },
    RenderServerFiles: function (allFiles, targetContainerId, specificId, transId) {
        const $container = $(`#${targetContainerId}`);
        $container.empty();

        let targetIds = [];

        if (specificId && specificId !== "00000000-0000-0000-0000-000000000000") {
            targetIds = specificId.toString().split('|').map(x => x.toLowerCase().trim());
        }

        if (targetIds.length === 0) {
            $container.html('<div class="p-3 text-center text-muted small fst-italic bg-light border rounded">Belum ada file tersimpan.</div>');
            return;
        }

        const relevantFiles = allFiles.filter(f => {
            return f.BitActive === true && targetIds.includes(f.TxtUploadId.toString().toLowerCase());
        });

        if (relevantFiles.length === 0) {
            $container.html('<div class="p-3 text-center text-muted small fst-italic bg-light border rounded">Belum ada file tersimpan.</div>');
            return;
        }

        const role = usrRole ? usrRole.toUpperCase() : "";
        const status = (Data && Data.FormulaHeader && Data.FormulaHeader.Status) ? Data.FormulaHeader.Status.toUpperCase() : "";

        let hasDeletePermission = false;
        if (role === "ADMINISTRATOR") {
            hasDeletePermission = true;
        } else if (role === "PDV") {
            const allowedStatuses = ["REQUESTED", "IN-PROGRESS", "NEED REVISION-VERFOR"];
            if (allowedStatuses.includes(status)) hasDeletePermission = true;
        }

        $.each(relevantFiles, function (i, file) {
            const fileName = file.OriginalFileName || "Unknown File";
            const publicLink = file.PublicLink;
            const fileId = file.TxtUploadId;

            let ext = file.FileExtenstion ? file.FileExtenstion.toLowerCase().replace('.', '') : '';
            let iconClass = 'fas fa-file text-secondary';

            if (['pdf'].includes(ext)) iconClass = 'fas fa-file-pdf text-danger';
            else if (['doc', 'docx'].includes(ext)) iconClass = 'fas fa-file-word text-info';
            else if (['xls', 'xlsx'].includes(ext)) iconClass = 'fas fa-file-excel text-success';
            else if (['png', 'jpg', 'jpeg'].includes(ext)) iconClass = 'fas fa-file-image text-warning';

            let actionButtonsHtml = `
            <a href="${publicLink}" download="${fileName}" class="btn btn-sm btn-outline-success" title="Download">
                <i class="fas fa-download"></i>
            </a>
        `;

            if (hasDeletePermission) {
                actionButtonsHtml += `
            <button type="button" class="btn btn-sm btn-outline-danger btn-delete-db ms-1" 
                data-trans="${transId}" 
                data-type="BTP" 
                data-id="${fileId}" 
                data-name="${fileName}">
                <i class="fas fa-trash"></i>
            </button>`;
            }

            const itemHtml = `
        <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center p-3 border-0 border-bottom">
            <div class="d-flex align-items-center text-truncate" style="max-width: 80%;">
                <div class="me-3 text-center" style="width: 24px;">
                    <i class="${iconClass} fa-lg"></i>
                </div>
                <div class="text-truncate">
                    <a href="${publicLink}" target="_blank" class="text-dark fw-bold text-decoration-none d-block text-truncate" title="${fileName}">
                        ${fileName}
                    </a>
                    <div class="text-muted small d-flex align-items-center mt-1" style="font-size: 0.75rem;">
                        <i class="fas fa-clock me-1"></i> ${moment(file.CreatedDate).format('DD MMM YYYY HH:mm')} 
                        <span class="mx-2">•</span> 
                        <i class="fas fa-user me-1"></i> ${file.CreatedBy}
                    </div>
                </div>
            </div>
            <div class="btn-group">
                ${actionButtonsHtml}
            </div>
        </div>`;

            $container.append(itemHtml);
        });

        $container.find('.list-group-item:last').removeClass('border-bottom');

        if (hasDeletePermission) {
            $container.find('.btn-delete-db').on('click', function () {
                TableBTPHeader.HandleDeleteFile($(this), $container);
            });
        }
    },
    Upload: function (e, Id) {
        $("#UploadFileBahanOrganikBtpHeader").val(null);
        $("#UploadFileEGDEGBtpHeader").val(null);
        $("#UploadFileSpekBtpHeader").val(null);

        $("#modalShowFileBahanOrganikBtpHeaderUploaded").empty();
        $("#modalShowFileEGDEGBtpHeaderUploaded").empty();
        $("#modalShowFileSpekBtpHeaderUploaded").empty();

        $("#listServerFileBahanOrganik").empty();
        $("#listServerFileEGDEG").empty();
        $("#listServerFileSpek").empty();

        $('.collapse').collapse('show');

        var datDet = Data.ListBtp.find(x => x.FormulaBtpid == Id);

        if (datDet == undefined) {
            clsGlobal.swalWarning("Data Kosong");
            return;
        }

        $("#UploadFileTitleBtpHeader").text(`${datDet.ItemCode} (${datDet.ItemDesc})`);
        $("#BtpHeaderId").val(datDet.FormulaBtpid);

        const headerId = datDet.FormulaBtpid;

        let showEgDeg = false;
        if (datDet.IsEgdeg != null) {
            var datEGDEG = datDet.IsEgdeg.toLowerCase().split(",");
            if (!(datEGDEG.length == 1 && (datEGDEG[0] == "n_a" || datEGDEG[0] == ""))) {
                showEgDeg = true;
            }
        }

        if (showEgDeg) {
            $("#contentUploadFileEGDEGBtpHeader").removeClass("d-none");
            TableBTPHeader.RenderServerFiles(datDet.ListUploadFile, "listServerFileEGDEG", datDet.KeteranganEgdegid, headerId);
        } else {
            $("#contentUploadFileEGDEGBtpHeader").addClass("d-none");
        }

        let showOrganik = false;
        if (datDet.StatusOrganik != null) {
            if (datDet.StatusOrganik.toLowerCase() == "organik") {
                showOrganik = true;
            }
        }

        if (showOrganik) {
            $("#contentUploadFileBahanOrganikBtpHeader").removeClass("d-none");
            TableBTPHeader.RenderServerFiles(datDet.ListUploadFile, "listServerFileBahanOrganik", datDet.BahanOrganikId, headerId);
        } else {
            $("#contentUploadFileBahanOrganikBtpHeader").addClass("d-none");
        }

        $("#contentUploadFileSpekBtpHeader").removeClass("d-none");
        TableBTPHeader.RenderServerFiles(datDet.ListUploadFile, "listServerFileSpek", datDet.FileSpekId, headerId);

        $("#FormulaBTPHeaderUploadModal").modal("toggle");
    },
    SaveUpload: async function () {
        // debugger;

        let Id = $("#BtpHeaderId").val();
        var datDet = Data.ListBtp.find(x => x.FormulaBtpid == Id);

        if (datDet == undefined) {
            clsGlobal.swalWarning("Data Kosong");
            return false;
        }

        var countOrg = $('#UploadFileBahanOrganikBtpHeader')[0].files.length;
        var countEgde = $('#UploadFileEGDEGBtpHeader')[0].files.length;
        var countSpek = $('#UploadFileSpekBtpHeader')[0].files.length;

        if (countOrg === 0 && countEgde === 0 && countSpek === 0) {
            clsGlobal.swalWarning("Mohon Upload File");
            return false;
        }

        try {
            let listOrg = await this.GetFilesSequentially('#UploadFileBahanOrganikBtpHeader');

            let listEgde = await this.GetFilesSequentially('#UploadFileEGDEGBtpHeader');

            let listSpek = await this.GetFilesSequentially('#UploadFileSpekBtpHeader');

            let concatedArr = listOrg.concat(listEgde, listSpek);

            let totalLengthFile = concatedArr.reduce((total, currentValue) => total + (currentValue.Length), 0);

            if (totalLengthFile > 5242880) {
                clsGlobal.swalWarning("Total File yang Diupload Lebih dari 5MB.");
                return false;
            }

            var payload = {
                DataFormula: JSON.stringify(datDet),
                ListFileBahanOrganik: listOrg,
                ListFileEGDEG: listEgde,
                ListFileSpek: listSpek
            };

            $.ajax({
                type: "POST",
                url: "/VerFor/SaveUploadIngridientFile",
                data: JSON.stringify(payload),
                contentType: "application/json; charset=utf-8",
                headers: {
                    "RequestVerificationToken": $('input[name="__RequestVerificationToken"]').val()
                },
                success: function (retDat, status, xhr) {

                    if (xhr.responseText.includes("!DOCTYPE html")) {
                        clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                    }
                    else {
                        if (retDat.bitSuccess == true) {
                            clsGlobal.swalSuccess("Success Save Data");
                            TableBTPHeader.RefreshData(retDat.objData);

                            $('#FormulaBTPHeaderUploadModal').modal('hide');
                            TableBTPHeader.Render();
                        }
                        else {
                            if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                                clsGlobal.swalWarning(retDat.objData);
                            }
                            else {
                                clsGlobal.swalError(retDat.txtMessage);
                            }
                        }
                        $("#txtGUID").val(retDat.txtGUID);
                    }
                },
                error: function (xhr, status, error) {
                    console.log(xhr);
                    console.log(status);
                    console.log(error);
                    clsGlobal.swalError("Terjadi kesalahan saat upload.");
                }
            });

        } catch (err) {
            console.error("Gagal convert file:", err);
            clsGlobal.swalError("Gagal memproses file visual. Pastikan file tidak corrupt.");
            return false;
        }

        return true;
    },
    RefreshData: function (data) {
        //debugger;
        const index = Data.ListBtp.findIndex(x => x.FormulaBtpid == data.FormulaBtpid);

        if (index !== -1) {
            Data.ListBtp[index] = data;
        }

        TableBTPHeader.Render();
    },
    ShowListFile: function (HeaderId, FileId) {
        //debugger;
        let datItem = Data.ListBtp;
        let arrFileId = FileId.split("|");
        //Finding item
        let datSel = datItem.find((item) => item.FormulaBtpid === HeaderId);

        let datFile = datSel.ListUploadFile.filter(x => arrFileId.includes(x.TxtUploadId));

        //Generate and Show Modal
        TableBTPHeader.GeneratePriviewFile(datFile, "modalShowFilePriview", HeaderId);
        TableUploadFile.ShowModalPriviewFile();
    },
    Delete: function (Id) {
        let dat = Data.ListBtp.find(x => x.FormulaBtpid == Id);

        if (dat == undefined) {
            clsGlobal.swalWarning("Data Kosong");

            return false;
        }

        clsGlobal.getConfirmation("Delete This Ingridient Formula", function (rst) {
            if (rst) {
                $.ajax({
                    type: "POST",
                    url: "/VerFor/DeleteBTPHeader",
                    datatype: "json",
                    async: true,
                    data: {
                        __RequestVerificationToken: $('#FormulaBTPHeaderForm input[name=__RequestVerificationToken]').val(),
                        DataReq: dat
                    },
                    success: function (retDat, status, xhr) {
                        if (xhr.responseText.includes("!DOCTYPE html")) {
                            clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                        }
                        else {
                            if (retDat.bitSuccess == true) {
                                clsGlobal.swalSuccess("Success Delete Data Komposisi");

                                Data.ListBtp = Data.ListBtp.filter(x => x.FormulaBtpid != Id);

                                // Refresh Grid
                                TableBTPHeader.Render();
                            }
                            else {
                                if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                                    clsGlobal.swalWarning(retDat.objData);
                                }
                                else {
                                    clsGlobal.swalError(retDat.txtMessage);
                                }
                            }
                            $("#txtGUID").val(retDat.txtGUID);
                        }
                    },
                    error: function (xhr, status, error) {
                        clsGlobal.swalError(xhr.responseText);
                    }
                });
            }
            else {
                return false;
            }
        });
    },
    InitSelectNegaraReview: function (val) {
        let lstSelNegara = [];
        let lstBtpHeader = JSON.parse($("#hdDataBTPHeader").val());
        let lstNegara = lstBtpHeader.find(x => x.ItemCode.toLowerCase() == val.toLowerCase() && x.NegaraAsal != null);

        if (lstNegara != undefined) {
            lstSelNegara = lstNegara.NegaraAsal.split("|");
        }

        // Delete Option Fist
        $('#NegaraAsalBtpHeaderReview').empty().trigger('change');

        if (lstSelNegara.length == 1) {
            lstSelNegara.forEach((val, index) => {
                var newOption = new Option(val, val, false, true);

                $('#NegaraAsalBtpHeaderReview').append(newOption);
            });

            $("#NegaraAsalBtpHeaderReview").trigger("change");
        }
        else {
            lstSelNegara.forEach((val, index) => {
                var newOption = new Option(val, val, false, false);

                $('#NegaraAsalBtpHeaderReview').append(newOption);
            });

            $("#NegaraAsalBtpHeaderReview").trigger("change");
        }
    },
    InitSelectSupplierReview: function (val) {
        let lstBtpHeader = JSON.parse($("#hdDataBTPHeader").val());
        let lstItemSupp = lstBtpHeader.filter(x => x.ItemCode.toLowerCase() == val.toLowerCase() && x.ItemSupplier != null);

        // Delete Option Fist
        $('#ItemSupplierBtpHeaderReview').empty().trigger('change');

        if (lstItemSupp.length == 1) {
            lstItemSupp.forEach((val, index) => {
                var newOption = new Option(val.ItemSupplier, val.ItemSupplier, false, true);

                $('#ItemSupplierBtpHeaderReview').append(newOption);
            });

            $("#ItemSupplierBtpHeaderReview").trigger("change")
        }
        else {
            lstItemSupp.forEach((val, index) => {
                var newOption = new Option(val.ItemSupplier, val.ItemSupplier, false, false);

                $('#ItemSupplierBtpHeaderReview').append(newOption);
            });

            $("#ItemSupplierBtpHeaderReview").trigger("change")
        }
    },
    BindingDataChangeItemReview: function (val, id) {
        let lstBtpHeader = JSON.parse($("#hdDataBTPHeader").val());
        let detBtpHeader = lstBtpHeader.find(x => x.ItemCode.toLowerCase() == val.toLowerCase());
        // Binding Data
        $("#ItemDescriptionBtpHeaderReview").val(detBtpHeader.ItemDescription);
        $("#JenisBahanBtpHeaderReview").val(detBtpHeader.JenisBahan);
        $("#GMOBtpHeaderReview").val(detBtpHeader.GMO);
        $("#JenisAlergenBtpHeaderReview").val(detBtpHeader.ListAlergent.split(",")).trigger("change");

        // Init Select Negara dan Supplier
        TableBTPHeader.InitSelectNegaraReview(val);
        TableBTPHeader.InitSelectSupplierReview(val);
    },
    ShowListFileReview: function (HeaderId, FileId, ContainerId) {
        const $container = $(`#${ContainerId}`);

        $container.empty().html(`
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2 text-muted">Menyiapkan daftar file...</p>
            </div>
        `);

        try {
            if (!Data || !Data.ListBtp) throw new Error("Data ListBtp tidak ditemukan.");

            let datSel = Data.ListBtp.find((item) => item.FormulaBtpid === HeaderId);
            if (!datSel) throw new Error("Data Header tidak ditemukan.");
            let arrFileId = FileId.split("|");
            let datFile = [];

            if (datSel.ListUploadFile && Array.isArray(datSel.ListUploadFile)) {
                datFile = datSel.ListUploadFile.filter(x => arrFileId.includes(x.TxtUploadId));
            }

            if (datFile.length === 0) {
                $container.html('<div class="alert alert-warning text-center">Tidak ada file yang cocok untuk ditampilkan.</div>');
                return;
            }

            debugger;
            TableBTPHeader.GeneratePriviewFile(datFile, ContainerId, HeaderId);

        } catch (err) {
            console.error("Error ShowListFileReview:", err);
            $container.html(`<div class="alert alert-danger">Gagal memuat data: ${err.message}</div>`);
        }
    },
    GeneratePriviewFile: function (lstData, containerId, transId) {
        const $contentContainer = $(`#${containerId}`);
        $contentContainer.empty();

        const role = usrRole ? usrRole.toUpperCase() : "";
        const status = (Data && Data.FormulaHeader && Data.FormulaHeader.Status) ? Data.FormulaHeader.Status.toUpperCase() : "";

        const isMainPreviewModal = (containerId === "modalShowFilePriview");

        let hasDeletePermission = false;
        if (role === "ADMINISTRATOR") {
            hasDeletePermission = true;
        } else if (role === "PDV") {
            const allowedStatuses = ["REQUESTED", "IN-PROGRESS", "NEED REVISION-VERFOR"];
            if (allowedStatuses.includes(status)) hasDeletePermission = true;
        }

        $.each(lstData, function (index, item) {
            try {
                const fileId = item.TxtUploadId;
                const fileName = item.OriginalFileName || "Unknown File";
                const publicLink = item.PublicLink;
                const fileExt = item.FileExtenstion ? item.FileExtenstion.replace('.', '').toLowerCase() : 'unknown';
                const previewContainerId = `preview-content-${containerId}-${index}`;

                let actionButtonsHtml = '';

                if (isMainPreviewModal) {
                    actionButtonsHtml += `
                    <a href="${publicLink}" download="${fileName}" class="btn btn-success btn-sm" title="Download">
                        <i class="fas fa-download me-1"></i>
                    </a>
                `;

                    if (hasDeletePermission) {
                        actionButtonsHtml += `
                    &nbsp;
                    <button type="button" class="btn btn-danger btn-sm btn-delete-db" 
                        data-trans="${transId}" 
                        data-type="BTP" 
                        data-id="${fileId}" 
                        data-name="${fileName}">
                        <i class="fas fa-trash me-1"></i>
                    </button>`;
                    }
                }

                const $filePreviewWrapper = $(`
                <div class="file-preview-item mb-4 pb-4 border-bottom" id="item-file-${fileId}">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="mb-0 text-truncate text-primary" style="max-width: 65%;" title="${fileName}">
                           <i class="fas fa-file me-2"></i>${fileName}
                        </h6>
                        <div class="btn-group">
                            ${actionButtonsHtml}
                        </div>
                    </div>
                    
                    <div id="${previewContainerId}" class="preview-area bg-light rounded border d-flex align-items-center justify-content-center" style="min-height: 250px; position:relative;">
                        <div class="text-center text-muted">
                            <div class="spinner-border spinner-border-sm text-secondary mb-1" role="status"></div>
                            <div class="small">Memuat konten...</div>
                        </div>
                    </div>
                </div>
            `);

                $contentContainer.append($filePreviewWrapper);

                if (isMainPreviewModal && hasDeletePermission) {
                    $filePreviewWrapper.find('.btn-delete-db').on('click', function () {
                        TableBTPHeader.HandleDeleteFile($(this), $contentContainer);
                    });
                }

                setTimeout(function () {
                    const $targetBox = $(`#${previewContainerId}`);
                    if ($targetBox.length) {
                        try {
                            TableBTPHeader.RenderContentItem(fileExt, publicLink, $targetBox);
                        } catch (renderErr) {
                            console.error("Render Content Error:", renderErr);
                            $targetBox.html(`
                            <div class="text-center text-danger p-3">
                                <i class="fas fa-exclamation-triangle fa-2x mb-2"></i>
                                <p class="small mb-0">Gagal merender tampilan.</p>
                            </div>
                        `);
                        }
                    }
                }, 50 + (index * 100));

            } catch (loopErr) {
                console.error(`Error processing file index ${index}:`, loopErr);
                $contentContainer.append(`<div class="alert alert-warning py-1 my-2 small">Gagal memuat item ke-${index + 1}</div>`);
            }
        });
    },
    HandleDeleteFile: function ($btn, $mainContainer) {
        const idToDelete = $btn.data('id');
        const transIdRef = $btn.data('trans');
        const fileType = $btn.data('type');
        const nameToDelete = $btn.data('name');

        const $wrapper = $btn.closest('.file-preview-item, .list-group-item');

        Swal.fire({
            title: 'Hapus File?',
            text: `Anda yakin ingin menghapus "${nameToDelete}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
            customClass: {
                confirmButton: 'btn btn-danger',
                cancelButton: 'btn btn-outline-secondary ms-1'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const originalBtnHtml = $btn.html();
                $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i>');

                $.ajax({
                    url: '/VerFor/DeleteFileUpload',
                    type: 'POST',
                    data: {
                        __RequestVerificationToken: $('#VerForPanel input[name=__RequestVerificationToken]').val(),
                        Id: idToDelete,
                        TransId: transIdRef,
                        Type: fileType
                    },
                    success: function (retDat, status, xhr) {
                        if (xhr.responseText.includes("!DOCTYPE html")) {
                            clsGlobal.swalWarningRedirect("Session Habis", window.location.href);
                        } else {
                            if (retDat.bitSuccess || retDat.data === "Berhasil menghapus file.") {
                                clsGlobal.swalSuccess(retDat.data);

                                $wrapper.fadeOut(300, function () {
                                    $(this).remove();

                                    // Cek kalau container jadi kosong
                                    if ($mainContainer.children(':visible').length === 0) {
                                        if ($mainContainer.hasClass('list-group')) {
                                            // Style List Server
                                            $mainContainer.html('<div class="p-3 text-center text-muted small fst-italic bg-light border rounded">Belum ada file tersimpan.</div>');
                                        } else {
                                            // Style Preview Modal
                                            $mainContainer.html('<p class="text-center text-muted py-3">Tidak ada file yang tersedia.</p>');
                                        }
                                    }
                                });

                                try {
                                    let datDet = JSON.parse(retDat.objData);
                                    if (Data.ListBtp) {
                                        const index = Data.ListBtp.findIndex(x => x.FormulaBtpid == datDet.FormulaBtpid);
                                        if (index !== -1) {
                                            Data.ListBtp[index] = datDet;
                                        }

                                        if (typeof TableBTPHeader !== 'undefined' && TableBTPHeader.Render) {
                                            TableBTPHeader.Render();
                                        }
                                    }
                                } catch (e) {
                                    console.error("Gagal update local data setelah delete:", e);
                                }

                            } else {
                                clsGlobal.swalError(retDat.ErrorMessages || "Gagal menghapus file.");
                                $btn.prop('disabled', false).html(originalBtnHtml);
                            }
                        }
                    },
                    error: function (err) {
                        Swal.fire('Error!', 'Gagal menghubungi server.', 'error');
                        $btn.prop('disabled', false).html(originalBtnHtml);
                    }
                });
            }
        });
    },
    RenderContentItem: function (ext, link, $container) {
        $container.empty().css({ 'text-align': 'left', 'display': 'block' }).removeClass('d-flex align-items-center justify-content-center');

        try {
            switch (ext) {
                case "pdf":
                    $container.html(`<iframe src="${link}" style="width:100%; height:500px; border:none;" frameborder="0"></iframe>`);
                    break;
                case "png": case "jpg": case "jpeg": case "gif": case "jfif": case "svg":
                    const $img = $(`<img src="${link}" class="img-fluid rounded mx-auto d-block" style="max-height: 500px;" alt="Preview" />`);
                    $img.on('error', function () { $container.html('<div class="text-danger text-center p-3">Gagal memuat gambar.</div>'); });
                    $container.css('text-align', 'center').append($img);
                    break;
                case "docx":
                    const $docxBox = $('<div class="preview-content preview-box bg-white p-2" style="height: 500px; overflow-y: auto;"></div>');
                    $container.append($docxBox);
                    if (typeof Helper !== 'undefined' && Helper.RenderDocx) Helper.RenderDocx(link, $docxBox.get(0));
                    else $docxBox.html('<p class="text-danger">Helper Docx missing.</p>');
                    break;
                case "xlsx":
                    const $xlsxBox = $('<div class="preview-content preview-box bg-white p-2" style="height: 500px; overflow-y: auto;"></div>');
                    $container.append($xlsxBox);
                    if (typeof Helper !== 'undefined' && Helper.RenderXlsx) Helper.RenderXlsx(link, $xlsxBox.get(0));
                    else $xlsxBox.html('<p class="text-danger">Helper Xlsx missing.</p>');
                    break;
                default:
                    $container.addClass('bg-light d-flex align-items-center justify-content-center').html(`
                    <div class="text-center py-5">
                        <i class="fas fa-file-alt fa-3x text-secondary mb-3"></i>
                        <p class="text-muted small mb-2">Pratinjau tidak tersedia untuk format <strong>.${ext}</strong></p>
                        <a href="${link}" class="btn btn-primary btn-sm">Download File</a>
                    </div>
                `);
            }
        } catch (e) {
            $container.html(`<div class="text-danger text-center">Error Render: ${e.message}</div>`);
        }
    },
    SaveReview: function () {
        let frmId = $("#FormulaBTPIdReview").val();
        let datItem = Data.ListBtp;
        let datSel = datItem.find((item) => item.FormulaBtpid === frmId);

        if (datSel == undefined) {

            clsGlobal.swalWarning("Data Kosong");
            return false;
        }

        // Binding Data
        datSel.StatusReviewQa = $("#SelectStatusQA").find(":selected").val();
        datSel.StatusReviewRa = $("#SelectStatusRA").find(":selected").val();
        datSel.KeteranganReview = $("#KeteranganReviewBtpHeaderReview").val();

        $.ajax({
            type: "POST",
            url: "/VerFor/SaveBTPHeader",
            datatype: "json",
            async: true,
            data: {
                __RequestVerificationToken: $('#FormulaBTPHeaderForm input[name=__RequestVerificationToken]').val(),
                DataReq: datSel
            },
            success: function (retDat, status, xhr) {
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        $("#FormulaBTPModalHeaderReviewModal").modal('toggle');

                        let datDet = JSON.parse(retDat.objData);


                        if (Data.ListBtp.some(x => x.FormulaBtpid == datDet.FormulaBtpid)) {

                            const index = Data.ListBtp.findIndex(x => x.FormulaBtpid == datDet.FormulaBtpid);

                            if (index !== -1) {
                                Data.ListBtp[index] = datDet;
                            }

                            clsGlobal.swalSuccess("Success Update Data Komposisi");
                        }
                        else {
                            // Adding to Model
                            Data.ListBtp.push(datDet);

                            clsGlobal.swalSuccess("Success Save Data Komposisi");
                        }

                        // Refresh Grid
                        TableBTPHeader.Render();
                    }
                    else {
                        if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                            clsGlobal.swalWarning(retDat.objData);
                        }
                        else {
                            clsGlobal.swalError(retDat.txtMessage);
                        }
                    }
                    $("#txtGUID").val(retDat.txtGUID);
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.swalError(xhr.responseText);
            }
        });
    },
    ExportExcel: function () {
        $.ajax({
            type: "POST",
            url: "/VerFor/ExportListFormula",
            data: {
                __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val(),
                verForId: Data.FormulaHeader.VerForHeaderId
            },
            datatype: "json",
            success: function (retDat, status, xhr) {
                clsGlobal.hideLoading();
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("You're Session has been Ended, Please Re-Login !", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        window.open(`/VerFor/DownloadListFormula?file=${encodeURIComponent(retDat.objData)}`);
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
    },
    GeneratePriviewUpload: function (event, containerId) {
        const $previewContainer = $(`#${containerId}`);
        const inputElement = event.target;

        $previewContainer.empty().hide();

        if (currentPreviewBlobUrls && currentPreviewBlobUrls.length > 0) {
            currentPreviewBlobUrls.forEach(url => URL.revokeObjectURL(url));
            currentPreviewBlobUrls = [];
        }

        const files = inputElement.files;
        if (!files || files.length === 0) {
            return;
        }

        $previewContainer.show();

        Array.from(files).forEach((file, index) => {
            const fileName = file.name;
            const fileExtension = fileName.split('.').pop().toLowerCase();
            let $previewElement;

            const $fileWrapper = $(`
            <div class="file-preview-item mb-3 pb-2 border-bottom position-relative" id="preview-upload-btp-${index}">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <strong class="text-truncate" style="max-width: 80%;">${fileName}</strong>
                    <button type="button" class="btn btn-sm btn-outline-danger btn-remove-file" title="Batalkan Upload">
                        <i class="fa fa-times"></i>
                    </button>
                </div>
            </div>
            `);

            $fileWrapper.find('.btn-remove-file').on('click', function () {
                const dt = new DataTransfer();
                const currentFiles = inputElement.files;
                for (let i = 0; i < currentFiles.length; i++) {
                    const f = currentFiles[i];
                    if (f !== file) dt.items.add(f);
                }
                inputElement.files = dt.files;
                $fileWrapper.remove();
                if (inputElement.files.length === 0) $previewContainer.hide();
            });

            switch (fileExtension) {
                case "pdf":
                    const pdfBlobUrl = URL.createObjectURL(file);
                    currentPreviewBlobUrls.push(pdfBlobUrl);
                    $previewElement = $(`<iframe src="${pdfBlobUrl}" style="width:100%; height:300px; border:1px solid #ddd;" frameborder="0"></iframe>`);
                    $fileWrapper.append($previewElement);
                    break;
                case "png": case "jpg": case "jpeg": case "gif": case "jfif": case "svg":
                    const imgBlobUrl = URL.createObjectURL(file);
                    currentPreviewBlobUrls.push(imgBlobUrl);
                    $previewElement = $('<div class="preview-content text-center" style="max-height: 300px; overflow: auto;"></div>');
                    if (typeof Helper !== 'undefined' && Helper.RenderImage) Helper.RenderImage(imgBlobUrl, $previewElement.get(0));
                    else $previewElement.append(`<img src="${imgBlobUrl}" class="img-fluid" />`);
                    $fileWrapper.append($previewElement);
                    break;
                case "docx":
                    const readerDoc = new FileReader();
                    $previewElement = $('<div class="preview-content preview-box bg-white p-2 border" style="height: 300px; overflow-y: auto;">Memproses pratinjau...</div>');
                    $fileWrapper.append($previewElement);
                    readerDoc.onload = function (e) {
                        if (typeof Helper !== 'undefined' && Helper.RenderDocx) Helper.RenderDocx(e.target.result, $previewElement.get(0));
                    };
                    readerDoc.readAsArrayBuffer(file);
                    break;
                case "xlsx":
                    const readerXls = new FileReader();
                    $previewElement = $('<div class="preview-content preview-box bg-white p-2 border" style="height: 300px; overflow-y: auto;">Memproses pratinjau...</div>');
                    $fileWrapper.append($previewElement);
                    readerXls.onload = function (e) {
                        if (typeof Helper !== 'undefined' && Helper.RenderXlsx) Helper.RenderXlsx(e.target.result, $previewElement.get(0));
                    };
                    readerXls.readAsArrayBuffer(file);
                    break;
                default:
                    $previewElement = $(`<p class="text-muted mt-2 fst-italic small"><i class="fas fa-exclamation-circle"></i> Pratinjau tidak tersedia untuk format <strong>.${fileExtension}</strong></p>`);
                    $fileWrapper.append($previewElement);
            }
            $previewContainer.append($fileWrapper);
        });
    },
    ConvertToBase64: function (file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve({
                FileName: file.name,
                Length: file.size,
                Base64Content: reader.result
            });
            reader.onerror = error => reject(error);
        });
    },
    GetFilesSequentially: async function (inputId) {
        const fileInput = $(inputId)[0];
        const results = [];

        if (fileInput.files && fileInput.files.length > 0) {
            for (let i = 0; i < fileInput.files.length; i++) {
                const file = fileInput.files[i];

                const result = await this.ConvertToBase64(file);

                results.push(result);
            }
        }
        return results;
    }
}

var TableBTPDetail = {
    Render: function (detailData) {
        if ($.fn.DataTable.isDataTable('#dataTableBtpDetail')) {
            $('#dataTableBtpDetail').DataTable().destroy();
        }

        const role = usrRole ? usrRole.toUpperCase() : "";

        const headerStatus = (Data && Data.FormulaHeader && Data.FormulaHeader.Status)
            ? Data.FormulaHeader.Status.toUpperCase()
            : "";

        const btnEditHtml = (headerId, detailId) => `<button title="Edit Data" type="button" class='btn btn-warning btn-sm' onclick='TableBTPDetail.Edit("${headerId}", "${detailId}")'><i class="fas fa-pencil-alt"></i></button>`;

        oTableBtpDetail = $('#dataTableBtpDetail').DataTable({
            "data": detailData,
            "dom": 'rtip',
            "fixedColumns": {
                left: 2,
                right: 1
            },
            "order": [],
            "bSort": false,
            "processing": true,
            "pageLength": 10,
            "paging": false,
            "searching": false,
            "ordering": false,
            "info": false,
            "scrollCollapse": true,
            "scrollX": true,
            "scrollY": "350px",
            "columns": [
                {
                    "data": "InsNo",
                    className: "dt-left text-nowrap",
                    orderable: false,
                    render: function (data, type, row) {
                        return `${data} - ${row.JenisBTP || ''}`;
                    }
                },
                {
                    "data": "GolonganBTP",
                    className: "dt-left text-nowrap",
                    orderable: false,
                    render: (data) => data || ""
                },
                {
                    "data": "KandunganBTPSpek",
                    className: "dt-left text-nowrap",
                    orderable: false,
                    render: (data) => data || ""
                },
                {
                    "data": "BatasMaxJumlahBTP",
                    className: "dt-right text-nowrap",
                    orderable: false,
                    render: (data) => data || ""
                },
                {
                    "data": "BatasMaxSatuanBTP",
                    className: "dt-left text-nowrap",
                    orderable: false,
                    render: (data) => data || ""
                },
                {
                    "data": "Flag",
                    className: "dt-center text-nowrap",
                    orderable: false,
                    render: (data) => data || ""
                },
                {
                    "data": "RumusHitungBTP",
                    className: "dt-left text-nowrap",
                    orderable: false,
                    render: (data) => data || ""
                },
                {
                    "data": "HasilJumlahBTP",
                    className: "dt-right text-nowrap",
                    orderable: false,
                    render: (data) => data || ""
                },
                {
                    "data": "HasilSatuanBTP",
                    className: "dt-left text-nowrap",
                    orderable: false,
                    render: (data) => data || ""
                },
                {
                    "data": null,
                    defaultContent: "",
                    className: "text-nowrap text-center",
                    orderable: false,
                    render: function (data, type, row) {
                        if (isSubmitedVerfor) return "";

                        let buttons = "";
                        const bHeaderId = row.BtpHeaderId;
                        const bDetailId = row.BtpDetailId;

                        if (headerStatus === "CANCELLED") {
                            return "";
                        }

                        if (role === "ADMINISTRATOR") {
                            buttons = btnEditHtml(bHeaderId, bDetailId);
                        }

                        else if (role === "PDV") {
                            const allowEdit = [
                                "REQUESTED",
                                "IN-PROGRESS",
                                "NEED REVISION-VERFOR"
                            ];

                            if (allowEdit.includes(headerStatus)) {
                                buttons = btnEditHtml(bHeaderId, bDetailId);
                            }
                        }
                        return buttons ? `<div class="btn-group" role="group">${buttons}</div>` : "";
                    },
                }
            ]
        });

        $('#dataTableBtpDetail').DataTable().columns.adjust().draw();
        Helper.RenderTooltip();
    },
    Edit: function (IdHeader, IdDetail) {
        // Getting Data 
        let datDetBtp = Data.ListBtp.find(x => x.FormulaBtpid == IdHeader);

        if (datDetBtp == undefined) {
            clsGlobal.swalWarning("Data Kosong");

            return false;
        }

        let lstBtp = JSON.parse(datDetBtp.BtpDetail);

        let datDetBtpEdit = lstBtp.find(x => x.BtpDetailId == IdDetail);

        if (datDetBtpEdit == undefined) {
            clsGlobal.swalWarning("Data Kosong");

            return false;
        }

        $("#FormulaDetailId").val(IdHeader);
        $("#BtpId").val(IdDetail);
        $("#InsNo").val(datDetBtpEdit.InsNo);
        $("#JenisBTP").val(datDetBtpEdit.JenisBTP);
        $("#GolBTP").val(datDetBtpEdit.GolonganBTP);
        $("#KandunganBTP").val(datDetBtpEdit.KandunganBTPSpek);
        $("#BatasMaxBTP").val(datDetBtpEdit.BatasMaxJumlahBTP);
        $("#BatasMaxBTPSatuan").text(datDetBtpEdit.BatasMaxSatuanBTP);
        $("#HasilPerhitunganBTP").val(datDetBtpEdit.HasilJumlahBTP).trigger("blur");
        $("#HasilPerhitunganBTPSatuan").text(datDetBtpEdit.BatasMaxSatuanBTP);
        $("#RumusPerhitunganBTP").val(datDetBtpEdit.RumusHitungBTP);

        $("#FormulaBTPDetailModal").modal('toggle');
    },
    ShowTable: function (LstData, DatItemCode) {
        TableBTPDetail.Render(LstData);

        $("#subHeader").text(`${DatItemCode}`);
        $("#sectionBTPINSInfo").removeClass("d-none");
        $('#dataTableBtpDetail').DataTable().columns.adjust().draw();
    },
    HideTable: function () {
        $("#sectionBTPINSInfo").addClass("d-none");
    },
    MappingData: function (IdHeader, IdDetail) {
        //debugger;
        // Getting Data 
        let datDetBtp = Data.ListBtp.find(x => x.FormulaBtpid == IdHeader);

        if (datDetBtp == undefined) {
            clsGlobal.swalWarning("Data Kosong");

            return false;
        }

        let lstBtp = JSON.parse(datDetBtp.BtpDetail);

        let datDetBtpEdit = lstBtp.find(x => x.BtpDetailId == IdDetail);
        let datDetIndxBtp = lstBtp.findIndex(x => x.BtpDetailId == IdDetail);

        if (datDetBtpEdit == undefined) {
            clsGlobal.swalWarning("Data Kosong");

            return false;
        }

        datDetBtpEdit.HasilJumlahBTP = numeral($("#HasilPerhitunganBTP").val()).value();
        datDetBtpEdit.HasilSatuanBTP = $("#HasilPerhitunganBTPSatuan").text();
        datDetBtpEdit.RumusHitungBTP = $("#RumusPerhitunganBTP").val();

        lstBtp[datDetIndxBtp] = datDetBtpEdit;
        datDetBtp.BtpDetail = JSON.stringify(lstBtp);

        return datDetBtp;
    },
    Save: function () {
        let headerId = $("#FormulaDetailId").val();
        let detId = $("#BtpId").val();

        let datDet = TableBTPDetail.MappingData(headerId, detId);

        if (datDet) {
            $.ajax({
                type: "POST",
                url: "/VerFor/SaveBTPHeader",
                datatype: "json",
                async: true,
                data: {
                    __RequestVerificationToken: $('#FormulaBTPHeaderForm input[name=__RequestVerificationToken]').val(),
                    DataReq: datDet
                },
                success: function (retDat, status, xhr) {
                    if (xhr.responseText.includes("!DOCTYPE html")) {
                        clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                    }
                    else {
                        if (retDat.bitSuccess == true) {
                            $("#FormulaBTPDetailModal").modal('toggle');

                            let datDet = JSON.parse(retDat.objData);

                            if (Data.ListBtp.some(x => x.FormulaBtpid == datDet.FormulaBtpid)) {

                                const index = Data.ListBtp.findIndex(x => x.FormulaBtpid == datDet.FormulaBtpid);

                                if (index !== -1) {
                                    Data.ListBtp[index] = datDet;
                                }

                                clsGlobal.swalSuccess("Success Update Data INS BTP");
                            }
                            else {
                                // Adding to Model
                                Data.ListBtp.push(datDet);

                                clsGlobal.swalSuccess("Success Create Data INS BTP");
                            }

                            // Refresh Grid
                            TableBTPHeader.Render();
                            TableBTPDetail.HideTable();
                            TableBTPHeader.FilterData(datDet.FormulaBtpid);
                        }
                        else {
                            if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                                clsGlobal.swalWarning(retDat.objData);
                            }
                            else {
                                clsGlobal.swalError(retDat.txtMessage);
                            }
                        }
                        $("#txtGUID").val(retDat.txtGUID);
                    }
                },
                error: function (xhr, status, error) {
                    clsGlobal.swalError(xhr.responseText);
                }
            });
        }
    }
}

var CopyProjectModule = {
    SelectedSourceData: null,
    Init: function () {
        // Reset UI Modal
        $('#ddlSourceVerFor').empty().append('<option value="">Pilih Source VerFor...</option>');
        $('#accordionCopyProject').addClass('d-none');
        $('#alertReviewInfo').addClass('d-none');
        $('#btnConfirmCopyProject').prop('disabled', true);

        // BERSIHKAN DOM SEBELUM MULAI (PENTING BIAR RINGAN)
        this.ClearContent();

        this.LoadSourceList();

        // Event Listener: Saat modal ditutup paksa, bersihkan memori
        $('#modalCopyProject').one('hidden.bs.modal', function () {
            CopyProjectModule.ClearContent();
        });

        $('#modalCopyProject').modal('show');
    },
    ClearContent: function () {
        // Hapus isi container biar browser ga berat nampung DOM yang gak kepake
        $('#cp_containerFileSummary').empty();
        $('#cp_containerFileFormula').empty();
        $('#cp_containerFileIng').empty();

        // Reset Text Info
        $('#cp_ProjectNumber, #cp_BrandSubBrand, #cp_Varian, #cp_Klaim').text('-');
        $('#cp_tableKomposisi, #cp_tableIngDetail').empty();

        this.SelectedSourceData = null;
    },
    LoadSourceList: function () {
        $.ajax({
            type: "POST",
            url: "/VerFor/GetListVerForForCopy",
            data: { __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val() },
            success: function (retDat) {
                if (retDat.bitSuccess) {
                    let listData = JSON.parse(retDat.objData);
                    let options = listData.map(x => new Option(`${x.VerForNumber} - ${x.Brand} ${x.SubBrand} (${x.VariantCode})`, x.VerForHeaderId, false, false));
                    $('#ddlSourceVerFor').append(options);
                }
            }
        });
    },
    OnSourceChange: function (sourceId) {
        this.ClearContent();

        if (!sourceId) {
            $('#accordionCopyProject').addClass('d-none');
            $('#alertReviewInfo').addClass('d-none');
            $('#btnConfirmCopyProject').prop('disabled', true);
            return;
        }

        clsGlobal.showLoading();
        $.ajax({
            type: "POST",
            url: "/VerFor/GetProjectById",
            data: { id: sourceId, __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val() },
            success: function (retDat) {
                clsGlobal.hideLoading();
                if (retDat.bitSuccess) {
                    const dataDetail = JSON.parse(retDat.objData);
                    CopyProjectModule.RenderReview(dataDetail);
                } else {
                    clsGlobal.swalError(retDat.txtMessage);
                }
            },
            error: function () {
                clsGlobal.hideLoading();
                clsGlobal.swalError("Gagal mengambil detail data.");
            }
        });
    },
    RenderReview: function (data) {
        this.SelectedSourceData = data;

        // 1. SUMMARY
        $('#cp_ProjectNumber').text(data.FormulaHeader.I2msnumber || '-');
        $('#cp_BrandSubBrand').text(`${data.FormulaHeader.Brand || ''} / ${data.FormulaHeader.SubBrand || ''}`);
        $('#cp_Varian').text(data.FormulaHeader.VariantCode || '-');
        $('#cp_Klaim').text((data.FormulaHeader.Klaim || '').replace(/\|/g, " ").replace(/,/g, "\n"));

        // Render Accordion Summary (Tanpa langsung render preview)
        this.GenerateFileAccordion(data.ListFile, 'cp_containerFileSummary', 'sumFile', 'MConfigUploadFile');

        // 2. FORMULA
        let htmlBtp = '';
        let totalPct = 0;
        let formulaDocList = [];

        if (data.ListBtp && data.ListBtp.length > 0) {
            data.ListBtp.forEach(btp => {
                let jumlah = parseFloat(btp.JumlahBahan) || 0;
                totalPct += jumlah;
                htmlBtp += `
                    <tr>
                        <td>${btp.ItemCode || '-'}</td>
                        <td>${btp.ItemDesc || '-'}</td>
                        <td>${btp.SupplierName || '-'}</td>
                        <td class="text-end">${numeral(jumlah).format('0,0.0000')}</td>
                        <td>${btp.NegaraAsal || '-'}</td>
                    </tr>`;

                // Collect files (Sama logicnya kyk sblmnya)
                if (btp.ListUploadFile && btp.ListUploadFile.length > 0) {
                    if (btp.FileSpekId) {
                        let files = btp.ListUploadFile.filter(x => x.TxtUploadId == btp.FileSpekId);
                        if (files.length > 0) formulaDocList.push({ CustomName: `${btp.ItemCode} - Spesifikasi`, ListUploadFile: files });
                    }
                    if (btp.BahanOrganikId) {
                        let files = btp.ListUploadFile.filter(x => x.TxtUploadId == btp.BahanOrganikId);
                        if (files.length > 0) formulaDocList.push({ CustomName: `${btp.ItemCode} - Sertifikat Organik`, ListUploadFile: files });
                    }
                    if (btp.KeteranganEgdegid) {
                        let files = btp.ListUploadFile.filter(x => x.TxtUploadId == btp.KeteranganEgdegid);
                        if (files.length > 0) formulaDocList.push({ CustomName: `${btp.ItemCode} - Pernyataan EG/DEG`, ListUploadFile: files });
                    }
                }
            });
        } else {
            htmlBtp = '<tr><td colspan="5" class="text-center text-muted">Belum ada komposisi.</td></tr>';
        }
        $('#cp_tableKomposisi').html(htmlBtp);
        $('#cp_totalKomposisi').text(numeral(totalPct).format('0,0.0000'));

        this.GenerateFileAccordion(formulaDocList, 'cp_containerFileFormula', 'formFile', 'CustomName');

        // 3. ING
        $('#cp_TakaranSaji').text(`${data.FormulaHeader.ServingSize || 0} ${data.FormulaHeader.SatuanServingSize || ''}`);
        let acuanText = data.FormulaIns ? data.FormulaIns.AcuanLabelGizi : '-';
        $('#cp_AcuanLabel').text(acuanText || '-');
        let bj = (data.FormulaIns) ? data.FormulaIns.BeratJenis : 0;
        $('#cp_BeratJenis').text(`${bj} ${(data.FormulaIns ? data.FormulaIns.SatuanBeratJenis : '')}`);

        let htmlIng = '';
        if (data.ListDetailIng && data.ListDetailIng.length > 0) {
            data.ListDetailIng.forEach(ing => {
                let rowClass = ing.IsVoid ? 'table-secondary text-muted' : '';
                htmlIng += `
                    <tr class="${rowClass}">
                        <td>${ing.ZatGizi || '-'}</td>
                        <td>${ing.SatuanZatGizi || '-'}</td>
                        <td class="text-end">${ing.HasilAnalisaPer100g ? numeral(ing.HasilAnalisaPer100g).format('0,0.0000') : '-'}</td>
                        <td class="text-end">${ing.LabelPerSaji ? numeral(ing.LabelPerSaji).format('0,0.0000') : '-'}</td>
                        <td class="text-end">${ing.PersenAkglabelPerSaji ? numeral(ing.PersenAkglabelPerSaji).format('0,0.0000') + '%' : '-'}</td>
                    </tr>`;
            });
        } else {
            htmlIng = '<tr><td colspan="5" class="text-center text-muted">Data ING belum digenerate.</td></tr>';
        }
        $('#cp_tableIngDetail').html(htmlIng);

        this.GenerateFileAccordion(data.ListIngFile, 'cp_containerFileIng', 'ingFile', 'MConfigUploadFile');

        // UI Ready
        $('#accordionCopyProject').removeClass('d-none');
        $('#alertReviewInfo').removeClass('d-none');
        $('#btnConfirmCopyProject').prop('disabled', false);
    },
    GenerateFileAccordion: function (docList, containerId, uniquePrefix, nameSourceProp) {
        const $container = $(`#${containerId}`);

        if (!docList || docList.length === 0) {
            $container.html(`
                <div class="text-muted small fst-italic py-2 border-bottom">
                    Tidak ada dokumen persyaratan.
                </div>
            `);
            return;
        }

        docList.forEach((docItem, index) => {
            let docName = "Dokumen";
            if (nameSourceProp === 'MConfigUploadFile' && docItem.MConfigUploadFile) {
                docName = docItem.MConfigUploadFile.UploadName;
            } else if (nameSourceProp === 'CustomName') {
                docName = docItem.CustomName;
            } else if (docItem.PlanName) {
                docName = docItem.PlanName;
            }

            let factoryBadge = "";
            if (docItem.PlanName && nameSourceProp !== 'CustomName') {
                factoryBadge = `<span class="badge bg-light text-secondary border fw-normal ms-2"><i class="fas fa-industry me-1"></i> ${docItem.PlanName}</span>`;
            }

            // Logic File
            let fileCount = (docItem.ListUploadFile && docItem.ListUploadFile.length > 0) ? docItem.ListUploadFile.length : 0;
            const accordionItemId = `${uniquePrefix}-${index}`;
            const headerId = `heading-${accordionItemId}`;
            const collapseId = `collapse-${accordionItemId}`;

            // Logic UI State
            const countText = fileCount > 0
                ? `<span class="text-success fw-bold ms-auto small text-nowrap">${fileCount} File</span>`
                : `<span class="text-muted ms-auto small text-nowrap">Kosong</span>`;

            const btnState = fileCount > 0 ? '' : 'disabled';
            const titleClass = fileCount > 0 ? 'text-dark fw-bold' : 'text-muted';
            const iconClass = fileCount > 0 ? 'text-success' : 'text-muted opacity-50';

            let filesHtml = '';
            if (fileCount > 0) {
                docItem.ListUploadFile.forEach((file, fIdx) => {
                    filesHtml += this.RenderSingleFileCard_Skeleton(file, accordionItemId, fIdx);
                });
            }

            const htmlItem = `
                <div class="accordion-item border-0">
                    <h2 class="accordion-header" id="${headerId}">
                        <button class="accordion-button collapsed bg-white shadow-none px-0 py-3 border-bottom ${titleClass}" type="button" 
                                data-bs-toggle="collapse" data-bs-target="#${collapseId}" 
                                aria-expanded="false" aria-controls="${collapseId}" ${btnState}>
                            
                            <div class="d-flex align-items-center w-100 me-2 overflow-hidden">
                                <i class="fas fa-folder ${iconClass} me-3 flex-shrink-0"></i>
                                <span class="text-truncate">${docName}</span>
                                ${factoryBadge}
                            </div>
                            ${countText}
                        </button>
                    </h2>
                    <div id="${collapseId}" class="accordion-collapse collapse" aria-labelledby="${headerId}" data-bs-parent="#${containerId}">
                        <div class="accordion-body px-0 pt-3 pb-2">
                            <div class="d-flex flex-column gap-3">
                                ${filesHtml}
                            </div>
                        </div>
                    </div>
                </div>`;

            $container.append(htmlItem);

            if (fileCount > 0) {
                $(`#${collapseId}`).one('shown.bs.collapse', function () {
                    docItem.ListUploadFile.forEach((file, fIdx) => {
                        const targetId = `preview-${accordionItemId}-${fIdx}`;
                        const $target = $(`#${targetId}`);

                        if ($target.data('rendered') === true) return;

                        const link = file.PublicLink;
                        const ext = file.FileExtenstion ? file.FileExtenstion.replace('.', '').toLowerCase() : '';

                        if (!link || link === "undefined") {
                            $target.html('<div class="text-danger small p-2 border border-danger bg-white">Link file rusak.</div>');
                        } else {
                            try {
                                TableUploadFile.RenderContentItem(ext, link, $target);
                                $target.data('rendered', true);
                            } catch (e) {
                                $target.html('<div class="text-muted small">Gagal merender.</div>');
                            }
                        }
                    });
                });
            }
        });
    },
    RenderSingleFileCard_Skeleton: function (fileObj, accordionItemId, fIdx) {
        if (!fileObj) return '';

        const fileName = fileObj.OriginalFileName || "File Tanpa Nama";
        const downloadLink = fileObj.PublicLink && fileObj.PublicLink !== "undefined" ? fileObj.PublicLink : "#";
        const disabledAttr = downloadLink === "#" ? "disabled" : "";
        const fileDivId = `preview-${accordionItemId}-${fIdx}`;

        // Icon Logic
        const ext = (fileObj.FileExtenstion || "").replace('.', '').toLowerCase();
        let iconClass = 'fa-file';
        let colorClass = 'text-secondary';
        if (['xlsx', 'xls', 'csv'].includes(ext)) { iconClass = 'fa-file-excel'; colorClass = 'text-success'; }
        else if (['docx', 'doc'].includes(ext)) { iconClass = 'fa-file-word'; colorClass = 'text-primary'; }
        else if (ext === 'pdf') { iconClass = 'fa-file-pdf'; colorClass = 'text-danger'; }
        else if (['jpg', 'jpeg', 'png'].includes(ext)) { iconClass = 'fa-file-image'; colorClass = 'text-warning'; }

        return `
            <div class="border rounded-1 p-0 mb-2">
                <div class="d-flex justify-content-between align-items-center p-3 border-bottom bg-white">
                    <div class="d-flex align-items-center overflow-hidden">
                        <i class="fas ${iconClass} ${colorClass} fa-lg me-3"></i>
                        <div class="d-flex flex-column text-truncate">
                            <span class="fw-bold text-dark text-truncate" title="${fileName}" style="font-size:0.9rem;">${fileName}</span>
                            <small class="text-muted text-uppercase" style="font-size: 0.65rem;">${ext}</small>
                        </div>
                    </div>
                    <a href="${downloadLink}" target="_blank" class="btn btn-sm btn-outline-dark rounded-0 px-3 ${disabledAttr}" download>
                        <i class="fas fa-download"></i>
                    </a>
                </div>
                
                <div class="bg-white p-0 position-relative" style="min-height: 150px;">
                    <div id="${fileDivId}" class="w-100 h-100 p-3 overflow-auto" style="max-height: 500px;">
                        <div class="text-center text-muted h-100 d-flex align-items-center justify-content-center">
                            <div>
                                <div class="spinner-border spinner-border-sm text-secondary mb-2" role="status"></div>
                                <div class="small">Klik folder untuk memuat pratinjau...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    ExecuteCopy: function () {
        if (!this.SelectedSourceData) return;
        const sourceId = this.SelectedSourceData.FormulaHeader.VerForHeaderId;

        clsGlobal.getConfirmation("Yakin copy project ini?", function (confirm) {
            if (confirm) {
                clsGlobal.showLoading();
                $.ajax({
                    type: "POST",
                    url: "/VerFor/CopyProject",
                    data: {
                        SourceHeaderId: sourceId,
                        TargetHeaderId: $("#VerForId").val(),
                        __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val()
                    },
                    success: function (retDat) {
                        clsGlobal.hideLoading();
                        if (retDat.bitSuccess) {

                            CopyProjectModule.ClearContent();

                            $('#modalCopyProject').modal('hide');
                            clsGlobal.swalSuccess("Berhasil Copy Project!");

                            const DataFormulaDetailAll = JSON.parse(retDat.objData);
                            Data.ListFile = DataFormulaDetailAll.ListFile;
                            Data.ListIngFile = DataFormulaDetailAll.ListIngFile;
                            Data.ListDetailIng = DataFormulaDetailAll.ListDetailIng;
                            FormulaHeaderHeader.MappingData(DataFormulaDetailAll);
                            FormulaDetail.MappingData(DataFormulaDetailAll);
                            FormulaHeaderHeader.SetForm();
                            IngDetail.MappingData(DataFormulaDetailAll);
                        } else {
                            clsGlobal.swalError(retDat.txtMessage);
                        }
                    },
                    error: function () {
                        clsGlobal.hideLoading();
                        clsGlobal.swalError("Error copy project.");
                    }
                });
            }
        });
    }
};

var Helper = {
    RemoveElementFromArray: function (value, arr) {
        arr = arr.filter(item => item !== value);
    },
    IsElementExistsInArray: function (value, arr) {
        var isExist = false;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == value) {
                isExist = true;
                break;
            }
        }
        return isExist;
    },
    setRadioValue: function (name, value) {
        document.querySelectorAll(`input[type="radio"][name="${name}"]`).forEach(rb => {
            rb.checked = (rb.value === value);
        })
    },
    OnlyNumberRegex: function (event, id = "") {
        const numericRegex = /^[0-9.]$/;
        const inputValue = event.key;

        if (!numericRegex.test(inputValue)) {
            event.preventDefault();
        }

        //if (id != "") {
        //    let val = $(`#${id}`).val();
        //    console.log($(`#${id}`));
        //    let text = $(`#${id}`).text();
        //    let lstVal = val.split("");
        //    lstVal.push(inputValue);

        //    ////debugger;
        //    let cntTtk = lstVal.filter(x => x === '.');
        //    let indxTtk = lstVal.indexOf('.');

        //    if ((lstVal.length > 2 && cntTtk.length == 0)) {
        //        event.preventDefault();
        //    }
        //    else if (lstVal.length > 2 && indxTtk > 2) {
        //        event.preventDefault();
        //    }
        //    else if (lstVal.length == 1 && cntTtk.length == 1) {
        //        lstVal.unshift("0");
        //        $(`#${id}`).val(lstVal.join(""));
        //        event.preventDefault();
        //    }
        //    else if (cntTtk.length > 1) {
        //        event.preventDefault();
        //    }
        //}
    },
    AllNumericFormat: function (event, id, type = "") {
        let val = $(`#${id}`).val();
        //////debugger;
        if (val != "") {
            //////debugger;
            let fltrTtk = val.split("").filter(x => x === ".");

            if (fltrTtk.length > 1) {
                $(`#${id}`).val(null);
                return clsGlobal.setMessageWarning("Please Input Valid Format, only input one dot (.)");
            }

            if (type == 'Currency') {
                let formatedVal = numeral(val).format(',.00');
                $(`#${id}`).val(formatedVal);
            }
            else if (type == 'Percent') {
                if (parseFloat(val) > 100) {
                    $(`#${id}`).val(null);
                    return clsGlobal.setMessageWarning("Value COGS must be in range of 1 - 100");
                }

                let formatedVal = numeral(val).format(',.00');
                $(`#${id}`).val(formatedVal);
            }
            else if (type == 'Percent4Decimal') {
                if (parseFloat(val) > 100) {
                    $(`#${id}`).val(null);
                    return clsGlobal.setMessageWarning("Value COGS must be in range of 1 - 100");
                }

                let formatedVal = numeral(val).format(',.0000');
                $(`#${id}`).val(formatedVal);
            }
            else if (type == 'CustomFiveDigit') {
                if (parseFloat(val) >= 1000000) {
                    $(`#${id}`).val(null);

                    return clsGlobal.setMessageWarning(`Value ${$(`#${id}`).attr('name')} must be in range of 1 - 999999.99`);
                }
                let formatedVal = numeral(val).format(',.00');
                $(`#${id}`).val(formatedVal);
            }
            else if (type == 'CustomTwoDigit') {
                if (parseFloat(val) >= 100) {
                    $(`#${id}`).val(null);
                    return clsGlobal.setMessageWarning(`Value ${$(`#${id}`).attr('name')} must be in range of 1 - 99.99`);
                }
                let formatedVal = numeral(val).format(',.00');
                $(`#${id}`).val(formatedVal);
            }
            else {
                $(`#${id}`).val(val);
            }
        }
        else {
            $(`#${id}`).val(val);
        }
    },
    RenderImage: function (url, containerElement) {
        const img = $('<img>').attr('src', url).css('max-width', '100%');
        $(containerElement).append(img);
    },
    RenderDocx: function (source, containerElement) {
        // Tampilkan pesan loading
        $(containerElement).html('<p class="text-center p-5">Memuat pratinjau...</p>');

        /**
         * Helper function internal untuk menjalankan render
         * Menerima data sebagai Blob atau ArrayBuffer
         */
        const render = (data) => {
            $(containerElement).empty(); // Kosongkan pesan loading

            // docx.renderAsync mengembalikan promise, jadi kita tangkap errornya
            docx.renderAsync(data, containerElement)
                .catch(err => {
                    console.error('Error during docx.renderAsync:', err);
                    $(containerElement).html(`<p class="text-danger">Gagal merender file Docx.</p>`);
                });
        };

        // --- LOGIKA UTAMA ---
        if (typeof source === 'string') {
            // KASUS 1: 'source' adalah URL, kita perlu fetch
            fetch(source)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.blob(); // Dapatkan sebagai blob
                })
                .then(blob => {
                    render(blob); // Kirim blob ke helper render
                })
                .catch(err => {
                    console.error('Error fetching/rendering DOCX:', err);
                    $(containerElement).html(`<p class="text-danger">Gagal memuat pratinjau. Pastikan file valid dan URL bisa diakses.</p>`);
                });

        } else if (source instanceof Blob || source instanceof ArrayBuffer) {
            // KASUS 2: 'source' sudah berupa data (dari file input)
            try {
                render(source); // Langsung render
            } catch (err) {
                console.error('Error rendering local DOCX:', err);
                $(containerElement).html(`<p class="text-danger">Gagal merender file Docx lokal.</p>`);
            }

        } else {
            // KASUS 3: Tipe data tidak dikenal
            console.error('Invalid source type for RenderDocx:', source);
            $(containerElement).html(`<p class="text-danger">Sumber data pratinjau tidak dikenali.</p>`);
        }
    },
    RenderXlsx: function (source, containerElement) {
        // Tampilkan pesan loading
        $(containerElement).html('<p class="text-center p-5">Memuat pratinjau Excel...</p>');

        /**
         * Helper function internal untuk menjalankan render
         * Menerima data HANYA sebagai ArrayBuffer
         */
        const render = (arrayBufferData) => {
            try {
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

        // --- LOGIKA UTAMA ---
        if (typeof source === 'string') {
            // KASUS 1: 'source' adalah URL, kita perlu fetch
            fetch(source)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.arrayBuffer(); // Dapatkan sebagai arrayBuffer
                })
                .then(data => {
                    render(data); // Kirim arrayBuffer ke helper render
                })
                .catch(err => {
                    console.error('Error fetching XLSX:', err);
                    $(containerElement).html(`<p class="text-danger">Gagal memuat pratinjau Excel.</p>`);
                });

        } else if (source instanceof ArrayBuffer) {
            // KASUS 2: 'source' sudah berupa ArrayBuffer
            try {
                render(source); // Langsung render
            } catch (err) {
                console.error('Error rendering local XLSX (ArrayBuffer):', err);
                $(containerElement).html(`<p class="text-danger">Gagal merender file Excel lokal.</p>`);
            }

        } else if (source instanceof Blob) {
            // KASUS 3: 'source' adalah Blob, perlu dikonversi ke ArrayBuffer
            source.arrayBuffer()
                .then(arrayBuffer => {
                    render(arrayBuffer);
                })
                .catch(err => {
                    console.error('Error converting Blob to ArrayBuffer:', err);
                    $(containerElement).html(`<p class="text-danger">Gagal membaca data file Blob.</p>`);
                });

        } else {
            // KASUS 4: Tipe data tidak dikenal
            console.error('Invalid source type for RenderXlsx:', source);
            $(containerElement).html(`<p class="text-danger">Sumber data pratinjau tidak dikenali.</p>`);
        }
    },
    RenderTooltip: function () {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl, {
                html: true
            })
        })
    },
    ShowSwalConfirm: function (btnValue, message, iconType = 'question') {
        Swal.fire({
            title: 'Konfirmasi',
            text: message,
            icon: iconType,
            showCancelButton: true,
            confirmButtonText: "Ya, Lanjutkan!",
            cancelButtonText: "Batal",
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-outline-danger ms-1'
            },
            buttonsStyling: false
        }).then((result) => {
            if (result.isConfirmed) {
                FormulaHeaderHeader.SubmitData(btnValue);
            }
        });
}
}

function closeAlert() {
    var alertBox = $('#alertUnsaved');
    alertBox.removeClass('show');


    setTimeout(function () {
        alertBox.addClass('d-none');
    }, 150);
}

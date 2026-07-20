"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var programCode = '';
var oTable;
let isEdit = false;
let DataInTable = [];
var oTableListProjectI2ms;
var currentViewMode = 'general'; // 'general' or 'pending'
//=======================
// BPOM HEADER OBJECT
//=======================
var BPOMProcessHeader = {
    ShowDetail: function (id) {
        console.log("BpomProcessHeader.ShowDetail called with id:", id);

        if (!id || id === 'undefined' || id === 'null') {
            clsGlobal.swalWarning("ID bpom tidak valid");
            return;
        }

        $.ajax({
            type: "POST",
            url: base_path + "/BPOMProcess/GetBpomById",
            data: {
                __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val(),
                id: id
            },
            datatype: "json",
            beforeSend: function () {
                clsGlobal.showLoading();
            },
            success: function (retDat, status, xhr) {
                clsGlobal.hideLoading();
                console.log("GetBpomProcessById response:", retDat);

                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        try {
                            //var data = JSON.parse(retDat.objData);
                            var res = JSON.parse(retDat.objData);
                            var data = res.data;
                            var userRole = res.role;

                            console.log("Parsed data:", data);

                            if (typeof BpomProcessDetail === 'undefined') {
                                console.error("BpomProcessDetail object not found!");
                                clsGlobal.swalError("Data BPOM Detail tidak ter-load. Silahkan refresh halaman.");
                                return;
                            }

                            BpomProcessDetail.BindData(data, userRole);
                            BPOMProcessHeader.ToggleApprovalDate();
                            f_ShowDetailBpom();
                        } catch (e) {
                            console.error("Error parsing or binding data:", e);
                            clsGlobal.swalError("Error: " + e.message);
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
                console.error("getBpomById error:", xhr.status, xhr.responseText);

                if (xhr.status === 404) {
                    clsGlobal.swalError("Action GetBpomById tidak ditemukan di controller");
                } else if (xhr.responseText) {
                    clsGlobal.swalError(xhr.responseText);
                } else {
                    clsGlobal.swalError("Error: " + error);
                }
            }
        });
    },
    Init: function () {
        f_ShowListBpom();
        oTable = $("#dataTableBpomProcess").DataTable({
            "bPaginate": true,
            search: {
                return: true
            },
            scrollY: "400px",
            scrollX: true,
            lengthMenu: [5, 10, 25, 50, 100],
            "iDisplayLength": 10,
            serverSide: true,
            destroy: true,
            retrive: true,
            order: [[1, 'desc']],
            orderCellsTop: true,
            scrollCollapse: true,
            dom: '<"row mb-2"<"col-sm-6"l><"col-sm-6 d-flex justify-content-end align-items-center"f>>rt<"bottom"ip><"clear">',
            ajax: {
                type: "POST",
                url: base_path + '/BPOMProcess/DTBpomList',
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
                        Search1: $("#ProjectNoSearch").val(),
                        Search2: $("#NoBPOMSearch").val(),
                        Search3: $("#StatusSearch").val(),
                        Search4: $("#JenisRegistrasiSearch").val(),
                        Search5: $("#NoRegisLokalSearch").val(),
                        Search6: $("#NoIzinEdarSearch").val(),
                        Search7: $("#StartDateSearch").val(),
                        Search8: $("#EndDateSearch").val(),
                        Search9: $("#CreatedBySearch").val(),
                        Search10: $("#CreatedDateSearch").val(),
                        Search11: $("#UpdatedSearch").val(),
                        Search12: $("#UpdatedDateSearch").val()
                    };

                    d.searchField = objsearch;
                    d.viewMode = currentViewMode;
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
            columns: [
                {
                    data: 'projectNo',
                    className: 'dt-left text-nowrap',
                    name: 'ProjectNo'
                },
                {
                    data: 'noRegist',
                    className: 'dt-left text-nowrap',
                    name: 'NoRegist',
                    render: function (data, type, row) {
                        let SelectedId = row.idHeaderBpom;
                        return `<a href="javascript:void(0);" onclick="BPOMProcessHeader.ShowDetail('${SelectedId}')">${data}</a>`;
                    }
                },
                {
                    data: 'status',
                    className: 'dt-left text-nowrap',
                    name: 'Status',
                    //data: 'statusDescription',
                    //className: 'dt-left text-nowrap',
                    //name: 'StatusDescription',
                    render: function (data, type, row) {
                        if (!data) return '';

                        let badgeClass = 'bg-secondary'; // default

                        switch (data) {
                            case 'BPOM-Draft':
                                badgeClass = 'bg-secondary';
                                break;
                            case 'BPOM-Inprocess':
                                badgeClass = 'bg-warning text-white';
                                break;
                            case 'BPOM-Approved':
                                badgeClass = 'bg-success';
                                break;
                            default:
                                badgeClass = 'bg-secondary';
                                break;
                        }

                        return `
                                <span class="badge rounded-pill ${badgeClass}">
                                    ${data}
                                </span>
                            `;
                    }
                },

                {
                    data: 'jenisRegist',
                    className: 'dt-left text-nowrap',
                    name: 'JenisRegist'
                },
                {
                    data: 'noRegisRegal',
                    className: 'dt-left text-nowrap',
                    name: 'NoRegisRegal'
                },
                {
                    data: 'noIjinEdar',
                    className: 'dt-left text-nowrap',
                    name: 'NoIjinEdar'
                },
                {
                    data: 'startIjinEdar',
                    className: 'dt-left text-nowrap',
                    name: 'StartIjinEdar',
                    render: function (data) {
                        return moment(data).isValid()
                            ? moment(data).format("DD MMM YYYY")
                            : "";
                    }
                },
                {
                    data: 'endIjinEdar',
                    className: 'dt-left text-nowrap',
                    name: 'EndIjinEdar',
                    render: function (data) {
                        return moment(data).isValid()
                            ? moment(data).format("DD MMM YYYY")
                            : "";
                    }
                },
                {
                    data: 'createdBy',
                    className: 'dt-left text-nowrap',
                    name: 'CreatedBy'
                },
                {
                    data: 'createdDate',
                    className: 'dt-left text-nowrap',
                    name: 'CreatedDate',
                    render: function (data) {
                        return moment(data).isValid()
                            ? moment(data).format("DD MMM YYYY hh:mm")
                            : "";
                    }
                },
                {
                    data: 'updatedBy',
                    className: 'dt-left text-nowrap',
                    name: 'UpdatedBy'
                },
                {
                    data: 'updatedDate',
                    className: 'dt-left text-nowrap',
                    name: 'UpdatedDate',
                    render: function (data) {
                        return moment(data).isValid()
                            ? moment(data).format("DD MMM YYYY  hh:mm")
                            : "";
                    }
                }
            ],
        });
    },
    ToggleApprovalDate: function () {
        var submit = $("#ActualSubmit");
        var approve = $("#ActualApproval");
        var status = $("#hdStatusBpom").val();
        var userRole = $("#currentRole").val();
        var submitDate = submit.val();

        // default lock
        approve.prop("disabled", true);

        if (userRole !== "Administrator" && userRole !== "Regulatory Affairs")
            return;

        if (status === 'BPOM-Approved') {
            approve.prop("disabled", true);
            return;
        }

        if (!submitDate) {
            approve.prop("disabled", true);
            approve.datepicker('setStartDate', null);
            return;
        }

        // === SUBMIT ADA ===
        approve.prop("disabled", false);

        // set minimal date
        approve.datepicker('setStartDate', submitDate);

        // 🔥 VALIDASI TANPA MENGOSONGKAN SEMBARANGAN
        if (approve.val()) {
            const s = moment(submitDate, 'DD/MM/YYYY');
            const a = moment(approve.val(), 'DD/MM/YYYY');

            if (a.isBefore(s)) {
                approve.val('');
            }
        }
    },
};

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    $('.btn-search').on('click', function (e) {
        e.preventDefault();

        BPOMProcessHeader.Init();
    });
    if (hashId) {
        BPOMProcessHeader.ShowDetail(hashId);
    }
    p_InitForm();
    BPOMAdditionalData.init();
    initSelect2();
    BPOMProcessHeader.ToggleApprovalDate();
    

    $("#ActualSubmit").on("change input", function () {
        BPOMProcessHeader.ToggleApprovalDate();
    });
    //$('#ActualSubmit, #TargetSubmit').on('change', function () {
    //    const actual = new Date($('#ActualSubmit').val());
    //    const target = new Date($('#TargetSubmit').val());
    //    if (!isNaN(actual) && !isNaN(target)) {
    //        $('#StatusSubmit').val(actual <= target ? 'OT' : 'NOT OT');
    //    }
    //});
    $('#ActualSubmit, #TargetSubmit').on('change', function () {
        
        const actual = BpomProcessDetail.parseDMY($('#ActualSubmit').val());
        const target = BpomProcessDetail.parseDMY($('#TargetSubmit').val());

        if (actual && target) {
            $('#StatusSubmit').val(actual <= target ? 'OT' : 'NOT OT');
        } else {
            $('#StatusSubmit').val('');
        }
    });

    $('#dataBpomToggle').on('change', function () {
        //debugger;
        $('#FTRR').val($(this).val() === 'false' ? 'YES' : 'NO');
    });

    $('#ActualApproval, #ActualSubmit').on('change', function () {
        const submit = BpomProcessDetail.parseDMY($('#ActualSubmit').val());
        const approval = BpomProcessDetail.parseDMY($('#ActualApproval').val());

        if (!isNaN(submit) && !isNaN(approval)) {

            submit.setHours(0, 0, 0, 0);
            approval.setHours(0, 0, 0, 0);

            const diffDays = (approval - submit) / (1000 * 60 * 60 * 24);

            // 1 minggu = 7 hari → 1.0
            // sisa hari → tiap 1 hari = tambah 0.1
            const fullWeeks = Math.floor(diffDays / 7);
            const extraDays = diffDays % 7;
            const duration = fullWeeks + Math.floor(extraDays) * 0.1;

            $('#DurationWeek').val(duration.toFixed(1));
        }
    });

    $('#btnExport').on('click', function (e) {
        e.preventDefault();
        ExportExcelBpom();
    });
    $('#viewModeToggle input[name="viewMode"]').on('change', function () {
        currentViewMode = $(this).val();
        console.log('View mode changed to:', currentViewMode);

        // Reload DataTable with new filter
        if (typeof oTable !== 'undefined' && oTable) {
            oTable.draw();
        }

        // Refresh dashboard with current view mode
        if (typeof f_LoadDashboardStats === 'function') {
            f_LoadDashboardStats(currentViewMode);
        }
    });

    // Fetch pending task count on page load
    fetchPendingTaskBpomCount();
});

//=======================
// INIT FORM
//=======================
function p_InitForm() {
    f_ShowListBpom();
    BPOMProcessHeader.Init();
}

document.querySelectorAll('.input-group.dynamic-input input').forEach(input => {
    input.addEventListener('input', function () {
        const table = document.querySelector('#dataTableBpomProcess');
        const dtTable = $('#dataTableBpomProcess').DataTable();

        const tempSpan = document.createElement('span');
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.position = 'absolute';
        tempSpan.style.whiteSpace = 'pre';
        tempSpan.style.font = window.getComputedStyle(this).font;
        tempSpan.textContent = this.value || this.placeholder;
        document.body.appendChild(tempSpan);

        const newWidth = Math.max(100, tempSpan.offsetWidth + 40);
        this.style.width = newWidth + 'px';
        document.body.removeChild(tempSpan);

        table.style.tableLayout = 'auto';
        dtTable.columns.adjust();

        if (this.value.trim() === '') {
            this.style.width = '100px';
            table.style.tableLayout = 'fixed';
            dtTable.columns.adjust();
        }
    });
});


//=======================
// SHOW / HIDE PANEL
//=======================
function f_ShowListBpom() {
    $('#FormDetailBpomProcess').hide();
    $('#BpomProcessPanel').show();
    
}
function f_ShowDetailBpom() {
    $('#FormDetailBpomProcess').show();
    $('#BpomProcessPanel').hide();
   
}

//=======================
// HELPER SET FORM DETAIL
//=======================
function f_SetFormDetail(data) {
    $('#id').val(data.txtIDHeaderBPOM || '');
    $('#txtNoRegist').val(data.txtNoRegist || '');
    $('#txtStatus').val(data.txtStatus || '');
    $('#txtJenisRegist').val(data.txtJenisRegist || '');
    $('#BpomProcessPanel').hide();
    $('#FormDetailBpomProcess').show();
}

//=======================
// FORM: TAMBAHAN DATA BPOM
//=======================
var BPOMAdditionalData = (function () {
    let dataCounter = 0;
    var toggleSelect = document.getElementById('dataBpomToggle');
    var container = document.getElementById('additionalDataContainer');
    var dataList = document.getElementById('dataList');
    var addButton = document.getElementById('addDataButton');
    ;
    if (!toggleSelect || !container || !dataList || !addButton) return {};

    var dataTemplate = () => {
        dataCounter++;
        return `
    <div class="card mb-4" id="data-block-${dataCounter}" data-id="">
        <div class="card-body p-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h5 class="card-title mb-0">Tambahan Data ke-${dataCounter}</h5>
                <button type="button" class="btn-close remove-data-btn" data-id="${dataCounter}"></button>
            </div>

            <div id="collapse-${dataCounter}" class="collapse show">
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label">Tanggal Terima Tambahan Data ke-${dataCounter}</label>
                        <input type="text" class="form-control tanggal-terima" placeholder="dd/mm/yyyy">
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Tanggal Respon Tambahan Data ke-${dataCounter}</label>
                        <input type="text" class="form-control tanggal-respon is-locked" placeholder="dd/mm/yyyy">

                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Durasi Respon Tambahan Data ke-${dataCounter} (Hari)</label>
                        <input type="text" class="form-control durasi-respon" data-id="${dataCounter}" disabled>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Jenis Tambahan Data ke-${dataCounter}</label>
                        <select class="form-select jenis-tambahan-data" multiple>
                            <option value="Input">Input</option>
                            <option value="Upload">Upload</option>
                            <option value="Label">Label</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>

                    <div class="col-12 mt-3 dynamic-fields"></div>
                </div>
            </div>
        </div>
    </div>`;
    };
    const parseDMY = (str) => {
        const [d, m, y] = str.split('/');
        return new Date(y, m - 1, d);
    };

    var hitungDurasi = (block) => {
        const tTerima = block.querySelector('.tanggal-terima')?.value;
        const tRespon = block.querySelector('.tanggal-respon')?.value;
        const durasiInput = block.querySelector('.durasi-respon');

        if (tTerima && tRespon) {
            const date1 = parseDMY(tTerima);
            const date2 = parseDMY(tRespon);
            const diff = Math.ceil((date2 - date1) / (1000 * 60 * 60 * 24));
            durasiInput.value = diff >= 0 ? diff : 0;
        } else {
            durasiInput.value = "";
        }
    };

    //var hitungDurasi = (block) => {
    //    const tTerima = block.querySelector('.tanggal-terima')?.value;
    //    const tRespon = block.querySelector('.tanggal-respon')?.value;
    //    const durasiInput = block.querySelector('.durasi-respon');

    //    if (tTerima && tRespon) {
    //        const [y1, m1, d1] = tTerima.split('-').map(Number);
    //        const [y2, m2, d2] = tRespon.split('-').map(Number);
    //        const date1 = new Date(y1, m1 - 1, d1);
    //        const date2 = new Date(y2, m2 - 1, d2);
    //        const diff = Math.ceil((date2 - date1) / (1000 * 60 * 60 * 24));
    //        durasiInput.value = diff >= 0 ? diff : 0;
    //    } else {
    //        durasiInput.value = "";
    //    }
    //};

    var addDataBlock = () => {
        if (dataCounter >= 10) {
            clsGlobal.swalError('Anda telah mencapai batas maksimum (10) data tambahan.');
            return;
        }

        dataList.insertAdjacentHTML('beforeend', dataTemplate());

        const lastBlock = dataList.lastElementChild;
        initDetailDatepicker(lastBlock);   // 🔥 penting
        initSelect2();
    };


    var removeDataBlock = (id) => {
        var block = document.getElementById(`data-block-${id}`);
        if (block) {
            block.remove();
            updateDataTitles();
        }
    };
    var updateDataTitles = () => {
        let blocks = dataList.querySelectorAll('.card');
        let index = 1;

        blocks.forEach(block => {

            block.id = `data-block-${index}`;
            let title = block.querySelector('.card-title');
            if (title) title.textContent = `Tambahan Data ${index}`;
            let removeBtn = block.querySelector('.remove-data-btn');
            if (removeBtn) removeBtn.setAttribute('data-id', index);
            let collapseDiv = block.querySelector('[id^="collapse-"]');
            if (collapseDiv) collapseDiv.id = `collapse-${index}`;
            block.querySelectorAll('label').forEach(label => {
                label.textContent = label.textContent.replace(/ke-\d+/g, `ke-${index}`);
            });
            let durasiInput = block.querySelector('.durasi-respon');
            if (durasiInput) durasiInput.setAttribute('data-id', index);

            index++;
        });

        dataCounter = blocks.length;
    };

    var toggleContainer = (value) => {
        if (value === 'true') {
            container.style.display = 'block';
            if (dataList.children.length === 0) addDataBlock();
        } else {
            container.style.display = 'none';
            dataList.innerHTML = '';
            dataCounter = 0;
        }
    };

    var init = () => {
        toggleSelect.addEventListener('change', function () {
            toggleContainer(this.value);
        });

        addButton.addEventListener('click', function () {
            addDataBlock();
        });
        dataList.addEventListener('change', function (e) {
            if (e.target.classList.contains('tanggal-terima') || e.target.classList.contains('tanggal-respon')) {
                const block = e.target.closest('.card');
                hitungDurasi(block);
            }
        });

        dataList.addEventListener('click', function (e) {
            if (e.target.matches('.btn-close')) {
                var id = e.target.getAttribute('data-id');
                removeDataBlock(id);
            }
        });
        //$(dataList).on('changeDate', '.tanggal-terima', function () {
        //    let block = this.closest('.card');
        //    let tanggalTerima = this.value;
        //    let tanggalRespon = block.querySelector('.tanggal-respon');

        //    $(tanggalRespon)
        //        .datepicker('setStartDate', tanggalTerima)
        //        .datepicker('update', '')
        //        .datepicker('show'); // optional
        //});
        //$(dataList).on('clearDate', '.tanggal-terima', function () {
        //    let block = this.closest('.card');
        //    let tanggalRespon = block.querySelector('.tanggal-respon');

        //    $(tanggalRespon)
        //        .val('')
        //        .datepicker('setStartDate', '31/12/2999')
        //        .datepicker('update', '');
        //});
        $(dataList).on('changeDate', '.tanggal-terima', function () {
            let block = this.closest('.card');
            let tanggalRespon = block.querySelector('.tanggal-respon');

            tanggalRespon.classList.remove('is-locked');

            $(tanggalRespon)
                .datepicker('setStartDate', this.value)
                .datepicker('update', '');
        });
        $(dataList).on('clearDate', '.tanggal-terima', function () {
            let block = this.closest('.card');
            let tanggalRespon = block.querySelector('.tanggal-respon');

            tanggalRespon.value = "";
            tanggalRespon.classList.add('is-locked');

            $(tanggalRespon)
                .datepicker('setStartDate', null)
                .datepicker('update', '');
        });

        $(dataList).on('changeDate', '.tanggal-respon', function () {
            let block = this.closest('.card');
            let tTerima = block.querySelector('.tanggal-terima').value;
            let tRespon = this.value;

            const d1 = parseDMY(tTerima);
            const d2 = parseDMY(tRespon);

            let durasi = Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));

            if (durasi < 0) {
                this.value = "";
                clsGlobal.swalError("Tanggal Respon harus >= Tanggal Terima");
                return;
            }

            block.querySelector('.durasi-respon').value = durasi;
        });


    };

    return {
        init,
        getCounter: () => dataCounter,
        setCounter: (v) => dataCounter = v
    };
})();

//=======================
// SELECT2 INIT
//=======================
var initSelect2 = () => {
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
        generateDynamicFields(this);
    });
};

//=======================
// DYNAMIC FIELD BUILDER
//=======================
function generateDynamicFields(selectElement) {

    if ($(selectElement).data("loaded") === true) {
        $(selectElement).data("loaded", false);
        return;
    }

    var selectedValues = $(selectElement).val() || [];

    var dynamicContainer = $(selectElement)
        .closest('.card')
        .find('.dynamic-fields')
        .first();

    const fieldTemplates = {
        'Input': `
            <div class="col-md-6 mb-3 dynamic-item" data-type="Input">
                <label class="form-label">Input :</label>
                <input type="text" class="form-control input-field" placeholder="Masukkan data input">
            </div>`,

        'Upload': `
            <div class="col-md-6 mb-3 dynamic-item" data-type="Upload">
                <label class="form-label">Upload :</label>
                <input type="text" class="form-control upload-field" placeholder="Masukkan data upload">
            </div>`,

        'Label': `
            <div class="col-md-6 mb-3 dynamic-item" data-type="Label">
                <label class="form-label">Label :</label>
                <input type="text" class="form-control upload-field" placeholder="Masukkan label">
            </div>`,

        'Lainnya': `
            <div class="col-md-6 mb-3 dynamic-item" data-type="Lainnya">
                <label class="form-label">Lainnya :</label>
                <input type="text" class="form-control lainnya-field" placeholder="Masukkan keterangan lainnya">
            </div>`
    };

    dynamicContainer.find('.dynamic-item').each(function () {
        let type = $(this).data('type');
        if (!selectedValues.includes(type)) {
            $(this).remove();
        }
    });

    selectedValues.forEach(val => {
        if (dynamicContainer.find(`.dynamic-item[data-type="${val}"]`).length === 0) {
            dynamicContainer.append($(fieldTemplates[val]));
        }
    });

    // Re-layout
    let items = dynamicContainer.find('.dynamic-item').detach();
    dynamicContainer.html('');

    let row;
    items.each(function (index) {
        if (index % 2 === 0) {
            row = $('<div class="row"></div>');
            dynamicContainer.append(row);
        }
        row.append(this);
    });
}

function ExportExcelBpom() {
    var objsearch = {
        Search1: $("#ProjectNoSearch").val(),
        Search2: $("#NoBPOMSearch").val(),
        Search3: $("#StatusSearch").val(),
        Search4: $("#JenisRegistrasiSearch").val(),
        Search5: $("#NoRegisLokalSearch").val(),
        Search6: $("#NoIzinEdarSearch").val(),
        Search7: $("#StartDateSearch").val(),
        Search8: $("#EndDateSearch").val(),
        Search9: $("#CreatedBySearch").val(),
        Search10: $("#CreatedDateSearch").val(),
        Search11: $("#UpdatedSearch").val(),
        Search12: $("#UpdatedDateSearch").val()
    }

    $.ajax({
        type: "POST",
        url: base_path + "/BPOMProcess/ExportProjectList",
        data: {
            __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val(),
            Param: JSON.stringify(objsearch),
            viewMode: window.currentViewMode
        },
        datatype: "json",
        success: function (retDat, status, xhr) {
            clsGlobal.hideLoading();
            if (xhr.responseText.includes("!DOCTYPE html")) {
                clsGlobal.swalWarningRedirect("You're Session has been Ended, Please Re-Login !", window.location.href);
            }
            else {
                if (retDat.bitSuccess == true) {
                    window.open(`${base_path}/BPOMProcess/DownloadProjectList?file=${encodeURIComponent(retDat.objData)}`);
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

function fetchPendingTaskBpomCount() {
    $.ajax({
        url: base_path + '/BPOMProcess/GetPendingTaskCount',
        type: 'GET',
        success: function (response) {
            if (response && response.success) {
                $('#pendingCount').text(response.count);
                console.log('Pending task count:', response.count);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error fetching pending count:', error);
            $('#pendingCount').text('0');
        }
    });
}

//function initDetailDatepicker(block) {
//    $(block).find('.tanggal-terima, .tanggal-respon').datepicker({
//        format: 'dd/mm/yyyy',
//        autoclose: true,
//        todayHighlight: true,
//        daysOfWeekDisabled: [0, 6]
//    });
//}

function initDetailDatepicker(block) {
    $(block).find('.tanggal-terima, .tanggal-respon').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
        todayHighlight: true,
        daysOfWeekDisabled: [0, 6]
    });
}


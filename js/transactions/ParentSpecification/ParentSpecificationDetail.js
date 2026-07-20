"use strict";

//=======================
// GLOBAL VARIABLES
//=======================
var clsGlobal = new clsGlobalClass();
var programCode = '';
var oTable;
var LOV;


var visualAndAppearanceList = [];
var dimensionList = [];
var materialList = [];
var packagingIntegrityList = [];
var contaminantList = [];
// Deklarasi variabel
let isPMEDataLoaded = false;
let newPmEvaluations = [];




//=======================
// DOCUMENT READY
//=======================
$(document).ready(function () {
    ParentSpecApp.init();

    const style = document.createElement('style');
    style.innerHTML = `
        .unsaved-row {
            background-color: #fff8e6 !important;
        }
        
        .unsaved-indicator {
            display: inline-block;
            width: 10px;
            height: 10px;
            background-color: #ffcc00;
            border-radius: 50%;
            margin-right: 5px;
        }
        
        .unsaved-badge {
            background-color: #ffcc00;
            color: #000;
            font-size: 0.7em;
            padding: 2px 5px;
            border-radius: 3px;
            margin-left: 5px;
        }
        
        .save-reminder {
            background-color: #fff8e6;
            border: 1px solid #ffcc00;
            padding: 10px;
            margin-bottom: 15px;
            border-radius: 4px;
            display: none;
        }
        
        @keyframes btnPulse {
            0% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(40, 167, 69, 0); }
            100% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0); }
        }
        
        .btn-pulse {
            animation: btnPulse 1.5s infinite;
        }
        
        .form-disabled {
            opacity: 0.85;
        }
        
        .approval-notice {
            border-left: 4px solid #f0ad4e;
            background-color: #fcf8e3;
            color: #8a6d3b;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 3px;
        }
    `;
    document.head.appendChild(style);



});

//=======================



// MAIN APPLICATION MODULE
//=======================
const ParentSpecApp = (function () {
    //=======================
    // CONFIGURATION
    //=======================
    const config = {
        tabs: {
            visualAppearance: {
                name: 'visualAppearance',
                tableId: 'visualAndAppearancePerformanceTable',
                modalId: 'visualAndAppearancePerformanceModal',
                formId: 'visualAndAppearancePerformanceForm',
                btnAddId: 'btnAddVisualAndAppearancePerformance',
                btnSaveId: 'btnSaveVisualAndAppearancePerformanceModal',
                editModeId: 'visualAppearanceEditMode',
                editIndexId: 'visualAppearanceEditIndex',
                editRowIndexId: 'visualAppearanceRowIndex',
                dataListName: 'visualAndAppearanceList',
                fieldPrefix: '',
                ajaxUrl: '/ParentSpecification/GetDataVisualAndAppearancePerformance', // URL lama
                ajaxUrlPME: '/ParentSpecification/GetDataPMVisualAndAppearancePerformance', // URL baru
                btnTargetId: 'btntxtTarget',

            },
            dimension: {
                name: 'dimension',
                tableId: 'dimensionTable',
                modalId: 'dimensionModal',
                formId: 'dimensionForm',
                btnAddId: 'btnAddDimension',
                btnSaveId: 'btnSaveDimensionModal',
                editModeId: 'dimensionEditMode',
                editIndexId: 'dimensionEditIndex',
                editRowIndexId: 'dimensionRowIndex',
                dataListName: 'dimensionList',
                fieldPrefix: 'Dimension',
                ajaxUrl: '/ParentSpecification/GetDataDimension', // URL lama
                ajaxUrlPME: '/ParentSpecification/GetDataPMDimension' // URL baru
            },
            material: {
                name: 'material',
                tableId: 'materialTable',
                modalId: 'materialModal',
                formId: 'materialForm',
                btnAddId: 'btnAddMaterial',
                btnSaveId: 'btnSaveMaterialModal',
                editModeId: 'materialEditMode',
                editIndexId: 'materialEditIndex',
                editRowIndexId: 'materialRowIndex',
                dataListName: 'materialList',
                fieldPrefix: 'Material',
                ajaxUrl: '/ParentSpecification/GetDataMaterial', // URL lama
                ajaxUrlPME: '/ParentSpecification/GetDataPMMaterial' // URL baru
            },
            packagingIntegrity: {
                name: 'packagingIntegrity',
                tableId: 'packagingIntegrityTable',
                modalId: 'packagingIntegrityModal',
                formId: 'packagingIntegrityForm',
                btnAddId: 'btnAddPackagingIntegrity',
                btnSaveId: 'btnSavePackagingIntegrityModal',
                editModeId: 'packagingIntegrityEditMode',
                editIndexId: 'packagingIntegrityEditIndex',
                editRowIndexId: 'packagingIntegrityRowIndex',
                dataListName: 'packagingIntegrityList',
                fieldPrefix: 'PackagingIntegrity',
                ajaxUrl: '/ParentSpecification/GetDataPackagingIntegrity', // URL lama
                ajaxUrlPME: '/ParentSpecification/GetDataPMPackagingIntegrity' // URL baru
            },
            contaminant: {
                name: 'contaminant',
                tableId: 'contaminantTable',
                modalId: 'contaminantModal',
                formId: 'contaminantForm',
                btnAddId: 'btnAddContaminant',
                btnSaveId: 'btnSaveContaminantModal',
                editModeId: 'contaminantEditMode',
                editIndexId: 'contaminantEditIndex',
                editRowIndexId: 'contaminantRowIndex',
                dataListName: 'contaminantList',
                fieldPrefix: 'Contaminant',
                ajaxUrl: '/ParentSpecification/GetDataContaminant', // URL lama
                ajaxUrlPME: '/ParentSpecification/GetDataPMContaminant' // URL baru
            }
        },

        headerFields: [
            '#txtDocumentStatus', '#txtCategoryName', '#intCategoryId',
            '#txtCategoryCode', '#txtDocumentNumber', '#DtmCreatedDate',
            '#txtSubBrand', '#txtSubBrandCode', '#txtParentSpecificationCode',
            '#txtVersion', '#intPmEvaluationNumberId', '#txtDescription'
        ],

        headerButtons: [
            '#btnCategory'
        ],

        commonFields: ['intTestId', 'txtLine', 'txtTestCode', 'txtClass', 'txtUnit', 'txtMethod',
            'txtType', 'txtTarget', 'decMin', 'decMax', 'ddlParameterType',
            'ddlAnalyzedBy', 'ddlRepeat', 'txtDetail'],

        lovCodes: {
            category: 'LOV_PM_CATEGORY_NEW',
            pmEvaluation: 'LOV_PM_EVALUATION',
            visualAppearance: 'LOV_VISUAL_APPEARANCE_TEST_CODE',
            dimension: 'LOV_VISUAL_APPEARANCE_TEST_CODE_DIMENSION',
            material: 'LOV_VISUAL_APPEARANCE_TEST_CODE_MATERIAL',
            packagingIntegrity: 'LOV_PACKAGING_INTEGRITY_TEST_CODE',
            contaminant: 'LOV_CONTAMINANT_TEST_CODE',
            pmTarget:'PME_TARGET', 
            pmMin:'LOV_PME_MIN', 
            pmMax: 'LOV_PME_MAX', 

        }
      
    };

    let data = {
        visualAndAppearanceList: [],
        dimensionList: [],
        materialList: [],
        packagingIntegrityList: [],
        contaminantList: []
    };

    let checkTimer;
    let savedTxtSizeWidthOptions = '';
    let savedDecStockKeepingUnitOptions = '';

    //=======================
    // DATATABLE FUNCTIONS
    //=======================
    function initializeDataTable(tabConfig) {
        const tableId = `#${tabConfig.tableId}`;
        const dataListName = tabConfig.dataListName;

        if ($.fn.DataTable.isDataTable(tableId)) {
            $(tableId).DataTable().destroy();
        }

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
     

        if (!$(`#${tabConfig.name}SaveReminder`).length) {
            $(`<div id="${tabConfig.name}SaveReminder" class="save-reminder">
                <i class="fas fa-exclamation-circle text-warning me-2"></i>
                There are unsaved changes. Click the <strong><i class="fas fa-save me-1"></i>Save</strong> button to save to the server.
            </div>`).insertBefore(tableId);
        }

        const table = $(tableId).DataTable({
            processing: true,
            serverSide: false,
            scrollX: true,
            scrollCollapse: true,
            ajax: {
                url: tabConfig.ajaxUrl,
                type: 'POST',
                dataType: 'json',
                data: function (d) {
                    d.id = id;
                    return d;
                },
                dataSrc: function (json) {
                    data[dataListName] = json.data || [];
                    return json.data;
                }
            },
            columns: [
                {
                    data: 'txtLine',
                    render: function (data, type, row) {
                        if (type === 'display' && row.unsaved) {
                            return '<span class="unsaved-indicator" title="Not saved to server"></span>' + data;
                        }
                        return data;
                    }
                },
                { data: 'txtTestCode' },
                { data: 'txtClass' },
                { data: 'txtUnit' },
                { data: 'txtMethod' },
                { data: 'txtType' },
                { data: 'txtTarget' },
                { data: 'decMin' },
                { data: 'decMax' },
                { data: 'txtParameterType' },
                { data: 'txtAnalyzedBy' },
                { data: 'txtRepeat' },
                { data: 'txtDetail' },
                //{ data: 'txtPME' },
                {
                    data: null,
                    defaultContent: '<button type="button" class="btn btn-sm btn-primary edit-btn me-1"><i class="fas fa-edit me-1"></i> Edit</button>',
                    orderable: false
                },
                {
                    data: null,
                    defaultContent: '<button type="button" class="btn btn-sm btn-danger remove-btn"><i class="fas fa-trash me-1"></i> Delete</button>',
                    orderable: false
                }
            ],
            rowId: function (data) {
                return data.id ? 'row-' + data.id : 'new-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
            },
            columnDefs: [
                { targets: '_all', className: 'text-center' }
            ],
            language: { emptyTable: "No data available in table" },
            createdRow: function (row, data, dataIndex) {
                if (data.unsaved) {
                    $(row).addClass('unsaved-row');
                }
            }
        });

        return table;
    }

    function initAllTables() {
        Object.keys(config.tabs).forEach(tabKey => {
            initializeDataTable(config.tabs[tabKey]);
        });
    }

    //=======================
    // FORM FUNCTIONS
    //=======================
    function resetForm(tabConfig) {

        const prefix = tabConfig.fieldPrefix;
        $(`#${tabConfig.formId}`)[0].reset();

        config.commonFields.forEach(field => {
            const fieldId = prefix ? `#${field}${prefix}` : `#${field}`;
            $(fieldId).val('');
        });

        const intTestIdField = prefix ? `#intTestId${prefix}` : '#intTestId';
        $(intTestIdField).val('');

        $(`#${tabConfig.editModeId}`).val('add');
        $(`#${tabConfig.editIndexId}`).val('');
        $(`#${tabConfig.editRowIndexId}`).val('');
    }

    function validateForm(formId, fields) {
        
        let isValid = true;
        let errorMessage = '';

        fields.forEach(field => {
            const selector = '#' + field.id;
            if (!$(selector).val() || $(selector).val().trim() === '') {
                isValid = false;
                errorMessage += `- ${field.label} is required<br>`;
                $(selector).addClass('is-invalid');
            } else {
                $(selector).removeClass('is-invalid');
            }
        });

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

    function getFormData(tabConfig) {
        const prefix = tabConfig.fieldPrefix;
        const formData = {};

        config.commonFields.forEach(field => {
            const originalField = field.replace('ddl', 'txt');
            const fieldId = prefix ? `#${field}${prefix}` : `#${field}`;
            if (field === 'intTestId') {
                formData[field] = $(fieldId).val() ? parseInt($(fieldId).val()) : null;
            }
            else if (field.startsWith('ddl')) {
                formData[originalField] = $(fieldId).val() || '';
            } else {
                formData[originalField] = $(fieldId).val() || '';
            }
        });

        return formData;
    }

    function calculateNextLineNumber(dataList) {
        if (!dataList || dataList.length === 0) {
            return 10;
        }

        let maxLine = 0;
        dataList.forEach(item => {
            if (item.txtLine && parseInt(item.txtLine) > maxLine && !item.isDeleted) {
                maxLine = parseInt(item.txtLine);
            }
        });

        return maxLine + 10;
    }
    //=======================
    // FIELD LOGIC
    //=======================
    function checkAndEnableLovButtons(prefix) {
        const typeValue = prefix ? $(`#txtType${prefix}`).val() : $('#txtType').val();

        let targetBtnId = prefix ? `#btnLOV${prefix}txtTarget` : '#btntxtTarget';
        let minBtnId = prefix ? `#btnLOV${prefix}decMin` : '#btnLOVtxtMin';
        let maxBtnId = prefix ? `#btnLOV${prefix}decMax` : '#btnLOVtxtMax';

        if (typeValue === 'T') {
            $(targetBtnId).prop('disabled', false);
            $(minBtnId).prop('disabled', false);
            $(maxBtnId).prop('disabled', false);
        } else {
            $(targetBtnId).prop('disabled', true);
            $(minBtnId).prop('disabled', true);
            $(maxBtnId).prop('disabled', true);
        }
    }
    function showModal(tabConfig) {
        //
        resetForm(tabConfig);

        const nextLine = calculateNextLineNumber(data[tabConfig.dataListName]);
        const lineFieldId = tabConfig.fieldPrefix ? `#txtLine${tabConfig.fieldPrefix}` : '#txtLine';
        $(lineFieldId).val(nextLine);

        $(`#${tabConfig.editModeId}`).val('add');
        $(`#${tabConfig.editIndexId}`).val('');
        $(`#${tabConfig.editRowIndexId}`).val('');

        const pmEvaluationString = $('#txtPmEvaluationNumber').val();
        if (pmEvaluationString && pmEvaluationString.length > 0) {
            loadPmEvaluationValues(tabConfig, pmEvaluationString);
        }

        $(`#${tabConfig.modalId}`).modal('show');
    }

    //=======================
    // DATA LOADING FUNCTIONS
    //=======================
    function loadPmEvaluationValues(tabConfig, pmEvaluationString) {
        const prefix = tabConfig.fieldPrefix;

        $.ajax({
            url: `/ParentSpecification/GetPMEvaluationMinValues${prefix || ''}`,
            type: 'GET',
            data: { pmEvaluationString: pmEvaluationString.toString() },
            success: function (response) {
                if (response.success && response.data !== null) {
                    const fieldId = prefix ? `#decMin${prefix}` : '#decMin';
                    $(fieldId).val(response.data);
                }
            },
            error: function (xhr, status, error) { }
        });

        $.ajax({
            url: `/ParentSpecification/GetPMEvaluationTargetValues${prefix || ''}`,
            type: 'GET',
            data: { pmEvaluationString: pmEvaluationString.toString() },
            success: function (response) {
                if (response.success && response.data !== null) {
                    const fieldId = prefix ? `#txtTarget${prefix}` : '#txtTarget';
                    $(fieldId).val(response.data);
                }
            },
            error: function (xhr, status, error) { }
        });

        $.ajax({
            url: `/ParentSpecification/GetPMEvaluationMaxValues${prefix || ''}`,
            type: 'GET',
            data: { pmEvaluationString: pmEvaluationString.toString() },
            success: function (response) {
                if (response.success && response.data !== null) {
                    const fieldId = prefix ? `#decMax${prefix}` : '#decMax';
                    $(fieldId).val(response.data);
                }
            },
            error: function (xhr, status, error) { }
        });
    }

    //=======================
    // SAVE STATUS FUNCTIONS
    //=======================
    function updateSaveStatus() {
        let hasUnsavedData = false;

        for (const tabKey in config.tabs) {
            const tabConfig = config.tabs[tabKey];
            if (data[tabConfig.dataListName].some(item => item.unsaved)) {
                hasUnsavedData = true;
                $(`#${tabConfig.name}SaveReminder`).show();
            } else {
                $(`#${tabConfig.name}SaveReminder`).hide();
            }
        }

        if (hasUnsavedData) {
            $('#btnSave').addClass('btn-pulse');

            for (const tabKey in config.tabs) {
                const tabConfig = config.tabs[tabKey];
                const unsavedCount = data[tabConfig.dataListName].filter(item => item.unsaved).length;

                if (unsavedCount > 0) {
                    const tabSelector = `button[data-bs-target="#form-tabs-${tabConfig.name.charAt(0).toUpperCase() + tabConfig.name.slice(1)}"]`;
                    const $tab = $(tabSelector);

                    $tab.find('.unsaved-badge').remove();
                    $tab.append(`<span class="unsaved-badge">${unsavedCount}</span>`);
                }
            }
        } else {
            $('#btnSave').removeClass('btn-pulse');
            $('.unsaved-badge').remove();
        }

        updateSubmitButtonState();
    }

    function clearUnsavedFlags() {
        for (const tabKey in config.tabs) {
            const tabConfig = config.tabs[tabKey];
            const dataList = data[tabConfig.dataListName];

            dataList.forEach(item => {
                delete item.unsaved;
            });

            $(`#${tabConfig.tableId}`).DataTable().rows().nodes().each(function (node) {
                $(node).removeClass('unsaved-row');
            });

            $(`#${tabConfig.name}SaveReminder`).hide();
        }

        updateSaveStatus();
        updateSubmitButtonState();
    }

    //=======================
    // DATA OPERATIONS
    //=======================
    function saveData(tabConfig) {
        
        const formId = tabConfig.formId;
        const prefix = tabConfig.fieldPrefix;

        if (!$(`#${formId}`)[0].checkValidity()) {
            $(`#${formId}`)[0].reportValidity();
            return;
        }
        

        const fieldsToValidate = [
            { id: prefix ? `txtTestCode${prefix}` : 'txtTestCode', label: 'Test Code' },
            { id: prefix ? `ddlParameterType${prefix}` : 'ddlParameterType', label: 'Parameter Type' },
            { id: prefix ? `ddlAnalyzedBy${prefix}` : 'ddlAnalyzedBy', label: 'Analyzed By' },
            { id: prefix ? `ddlRepeat${prefix}` : 'ddlRepeat', label: 'Repeat' },
            { id: prefix ? `txtDetail${prefix}` : 'txtDetail', label: 'Detail' },
            //{ id: prefix ? `txtPME${prefix}` : 'txtPME', label: 'PME' }
        ];

      

        if (!validateForm(formId, fieldsToValidate)) {
            return;
        }

        const formData = getFormData(tabConfig);
        const mode = $(`#${tabConfig.editModeId}`).val();
        const table = $(`#${tabConfig.tableId}`).DataTable();
        const dataList = data[tabConfig.dataListName];

        if (mode === 'add') {
            formData.isNew = true;
            formData.unsaved = true;
            dataList.push(formData);

            const newRow = table.row.add(formData).draw().node();
            $(newRow).addClass('unsaved-row');

            $(`#${tabConfig.name}SaveReminder`).show();

            clsGlobal.swalSuccessWithoutAction('Data added successfully! (Not yet saved to server)');
        } else {
            const index = parseInt($(`#${tabConfig.editIndexId}`).val());

            if (index >= 0 && index < dataList.length) {
                if (dataList[index].id) {
                    formData.id = dataList[index].id;
                }

                formData.isNew = dataList[index].isNew || false;
                formData.unsaved = true;

                dataList[index] = formData;

                const rowIndex = parseInt($(`#${tabConfig.editRowIndexId}`).val());

                if (!isNaN(rowIndex) && rowIndex >= 0) {
                    const rowNode = table.row(rowIndex).data(formData).draw(false).node();
                    $(rowNode).addClass('unsaved-row');
                    clsGlobal.swalSuccessWithoutAction('Data updated successfully! (Not yet saved to server)');
                } else {
                    let foundRowIndex = null;
                    table.rows().every(function (idx) {
                        const data = this.data();
                        if (data.txtTestCode === formData.txtTestCode &&
                            data.txtClass === formData.txtClass &&
                            data.txtMethod === formData.txtMethod) {
                            foundRowIndex = idx;
                            return false;
                        }
                        return true;
                    });

                    if (foundRowIndex !== null) {
                        const rowNode = table.row(foundRowIndex).data(formData).draw(false).node();
                        $(rowNode).addClass('unsaved-row');
                        clsGlobal.swalSuccessWithoutAction('Data updated successfully! (Not yet saved to server)');
                    } else {
                        const newRow = table.row.add(formData).draw().node();
                        $(newRow).addClass('unsaved-row');
                        clsGlobal.swalSuccessWithoutAction('New data added successfully! (Not yet saved to server)');
                    }
                }

                $(`#${tabConfig.name}SaveReminder`).show();
            }
        }

        updateSaveStatus();
        updateSubmitButtonState();
        $(`#${tabConfig.modalId}`).modal('hide');
    }

    //=======================
    // EVENT HANDLERS
    //=======================
    //=======================
    // EVENT HANDLERS
    //=======================
    function bindTableEvents() {
        Object.keys(config.tabs).forEach(tabKey => {
            const tabConfig = config.tabs[tabKey];

            $(`#${tabConfig.btnAddId}`).click(function () {
                if (isWaitingForApproval()) {
                    return;
                }
                showModal(tabConfig);
            });

            $(`#${tabConfig.btnSaveId}`).click(function () {
                if (isWaitingForApproval()) {
                    return;
                }
                saveData(tabConfig);
            });

            $(`#${tabConfig.tableId} tbody`).on('click', '.edit-btn', function (e) {
                e.preventDefault();
                e.stopPropagation();
             
                if (isWaitingForApproval()) {
                    return false;
                }


                const tableRow = $(this).closest('tr');
                const rowData = $(`#${tabConfig.tableId}`).DataTable().row(tableRow).data();

                const rowIndex = $(`#${tabConfig.tableId}`).DataTable().row(tableRow).index();
                $(`#${tabConfig.editRowIndexId}`).val(rowIndex);

                const index = data[tabConfig.dataListName].findIndex(item =>
                    item.txtTestCode === rowData.txtTestCode &&
                    item.txtClass === rowData.txtClass &&
                    item.txtMethod === rowData.txtMethod);

                if (index !== -1) {
                    $(`#${tabConfig.editModeId}`).val('edit');
                    $(`#${tabConfig.editIndexId}`).val(index);

                    const prefix = tabConfig.fieldPrefix;
                    config.commonFields.forEach(field => {
                        const fieldName = field.replace('ddl', 'txt');
                        const fieldId = prefix ? `#${field}${prefix}` : `#${field}`;
                    
                        if (field === 'intTestId' && rowData[field] !== undefined) {
                            $(fieldId).val(rowData[field]);
                        } else if (rowData[fieldName] !== undefined) {
                            if (fieldName == 'txtTarget') {
                     

                            }
                            $(fieldId).val(rowData[fieldName]);
                        }
                    });

                    // --- Kode yang sudah diperbaiki
                    checkAndEnableLovButtons(prefix);
                    // --- Akhir kode yang sudah diperbaiki

                    $(`#${tabConfig.modalId}`).modal('show');
                } else {
                    Swal.fire('Error', 'Could not find data to edit', 'error');
                }

                return false;
            });

            $(`#${tabConfig.tableId} tbody`).on('click', '.remove-btn', function (e) {
                e.preventDefault();
                e.stopPropagation();

                if (isWaitingForApproval()) {
                    return false;
                }

                const tableRow = $(this).closest('tr');
                const table = $(`#${tabConfig.tableId}`).DataTable();
                const rowData = table.row(tableRow).data();
                const dataList = data[tabConfig.dataListName];

                if (!rowData) {
                    console.error('Failed to get row data');
                    return;
                }

                Swal.fire({
                    title: 'Delete Confirmation',
                    text: 'Are you sure you want to delete this data?',
                    icon: 'warning',
                    showCancelButton: true,
                    showDenyButton: false,
                    showConfirmButton: true,
                    confirmButtonText: 'Yes, Delete',
                    cancelButtonText: 'No',
                    buttonsStyling: true,
                    customClass: {
                        confirmButton: 'btn btn-danger',
                        cancelButton: 'btn btn-secondary'
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        try {
                            const index = dataList.findIndex(item =>
                                item.txtTestCode === rowData.txtTestCode &&
                                item.txtClass === rowData.txtClass &&
                                item.txtMethod === rowData.txtMethod);

                            if (index !== -1) {
                                if (rowData.id) {
                                    rowData.isDeleted = true;
                                    dataList[index] = rowData;
                                    rowData.unsaved = true;
                                } else {
                                    dataList.splice(index, 1);
                                }

                                table.row(tableRow).remove().draw(false);
                                updateSaveStatus();

                                clsGlobal.swalSuccessWithoutAction('Data deleted successfully! (Not yet saved to server)');
                            }
                        } catch (err) {
                            console.error('Error in delete operation:', err);
                            Swal.fire('Error', 'An error occurred while deleting the data', 'error');
                        }
                    }
                });

                return false;
            });
        });
    }

    function bindTabEvents() {
        $('button[data-bs-toggle="tab"]').on('show.bs.tab', function (e) {
            let currentTabId = $('.tab-pane.active').attr('id');

            let currentTabConfig = null;
            for (const tabKey in config.tabs) {
                const tabConfig = config.tabs[tabKey];
                if (currentTabId === `form-tabs-${tabConfig.name.charAt(0).toUpperCase() + tabConfig.name.slice(1)}`) {
                    currentTabConfig = tabConfig;
                    break;
                }
            }

            setTimeout(function () {
                updateSaveStatus();
            }, 100);
        });
    }


    //=======================
    // LOV BUTTON HANDLERS
    //=======================

    // Visual And Appearance Performance

    function p_btnLOVtxtMinVisualClick() {
        try {
            clsGlobal.generateLOV("PME_MIN_VISUAL", "trPMEvaluationVisual_txtMin", $("#trPMEvaluationVisual_intTestID").val());
        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    }
    function p_btnLOVtxtMaxVisualClick() {
        try {
            clsGlobal.generateLOV("PME_MAX_VISUAL", "trPMEvaluationVisual_txtMax", $("#trPMEvaluationVisual_intTestID").val());
        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    }

    // Dimension
    function p_btnLOVtxtTargetDimensionClick() {
        try {
            clsGlobal.generateLOV("PME_TARGET_DIMENSION", "trPMEvaluationDimension_txtTarget", $("#trPMEvaluationDimension_intTestID").val());
        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    }
    function p_btnLOVtxtMinDimensionClick() {
        try {
            clsGlobal.generateLOV("PME_MIN_DIMENSION", "trPMEvaluationDimension_txtMin", $("#trPMEvaluationDimension_intTestID").val());
        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    }
    function p_btnLOVtxtMaxDimensionClick() {
        try {
            clsGlobal.generateLOV("PME_MAX_DIMENSION", "trPMEvaluationDimension_txtMax", $("#trPMEvaluationDimension_intTestID").val());
        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    }

    // Material
    function p_btnLOVtxtTargetMaterialClick() {
        try {
            clsGlobal.generateLOV("PME_TARGET_MATERIAL", "trPMEvaluationMaterial_txtTarget", $("#trPMEvaluationMaterial_intTestID").val());
        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    }
    function p_btnLOVtxtMinMaterialClick() {
        try {
            clsGlobal.generateLOV("PME_MIN_MATERIAL", "trPMEvaluationMaterial_txtMin", $("#trPMEvaluationMaterial_intTestID").val());
        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    }
    function p_btnLOVtxtMaxMaterialClick() {
        try {
            clsGlobal.generateLOV("PME_MAX_MATERIAL", "trPMEvaluationMaterial_txtMax", $("#trPMEvaluationMaterial_intTestID").val());
        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    }

    // Packaging Integrity
    function p_btnLOVtxtTargetPackagingClick() {
        try {
            clsGlobal.generateLOV("PME_TARGET_PACKAGING", "trPMEvaluationPackaging_txtTarget", $("#trPMEvaluationPackaging_intTestID").val());
        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    }
    function p_btnLOVtxtMinPackagingClick() {
        try {
            clsGlobal.generateLOV("PME_MIN_PACKAGING", "trPMEvaluationPackaging_txtMin", $("#trPMEvaluationPackaging_intTestID").val());
        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    }
    function p_btnLOVtxtMaxPackagingClick() {
        try {
            clsGlobal.generateLOV("PME_MAX_PACKAGING", "trPMEvaluationPackaging_txtMax", $("#trPMEvaluationPackaging_intTestID").val());
        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    }

    // Contaminant
    function p_btnLOVtxtTargetContaminantClick() {
        try {
            clsGlobal.generateLOV("PME_TARGET_CONTAMINANT", "trPMEvaluationContaminant_txtTarget", $("#trPMEvaluationContaminant_intTestID").val());
        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    }
    function p_btnLOVtxtMinContaminantClick() {
        try {
            clsGlobal.generateLOV("PME_MIN_CONTAMINANT", "trPMEvaluationContaminant_txtMin", $("#trPMEvaluationContaminant_intTestID").val());
        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    }
    function p_btnLOVtxtMaxContaminantClick() {
        try {
            clsGlobal.generateLOV("PME_MAX_CONTAMINANT", "trPMEvaluationContaminant_txtMax", $("#trPMEvaluationContaminant_intTestID").val());
        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    }
    //=======================
    // BUTTON STATE FUNCTIONS
    //=======================
    function updateSaveButtonState() {
        const documentStatus = $('#txtDocumentStatus').val();
        const shouldDisable = documentStatus.toUpperCase() !== 'DRAFT';
        $('#btnSave').prop('disabled', shouldDisable);
    }

    function updateSubmitButtonState() {
        const headerId = $('#headerId').val();
        const documentStatus = ($('#txtDocumentStatus').val() || '').toUpperCase();
        const roleName = ($('#txtRoleName').val() || '').toUpperCase();

        let hasUnsavedChanges = false;
        for (const tabKey in config.tabs) {
            const tabConfig = config.tabs[tabKey];
            if (data[tabConfig.dataListName].some(item => item.unsaved)) {
                hasUnsavedChanges = true;
                break;
            }
        }

        // Visibility rules
        // - btnSubmit visible only when status is SUBMIT TO QA
        // - btnSubmitQA visible only when status is DRAFT

        if (documentStatus == 'SUBMIT TO QA') {
            $('#btnSubmit').show();
            $('#btnSubmit').css('display', 'block'); 

        } else {
            $('#btnSubmit').hide();
            $('#btnSubmit').css('display', 'none');

        }

        if (documentStatus == 'DRAFT') {
            $('#btnSubmitQA').css('display', 'block'); 
            $('#btnSubmitQA').show();
        } else {
            $('#btnSubmitQA').css('display', 'none');
               $('#btnSubmitQA').hide();
        }

        // Disablement rules for Submit button
        let shouldDisable = !headerId || headerId <= 0 || hasUnsavedChanges;
        // Do not allow submit while waiting for approval regardless
        shouldDisable = shouldDisable || documentStatus === 'WAITING FOR APPROVAL';
     
        $('#btnSubmitQA').prop('disabled', true);
        
        // Role-based rule: only QUALITY SUPPLY CHAIN can click Submit when status is SUBMIT TO QA
        if (documentStatus === 'DRAFT') {
            if (roleName !== 'QUALITY SUPPLY CHAIN') {
                shouldDisable = true;
                document.getElementById('btnSubmitQA').removeAttribute('disabled');

            }
        }
        else if (documentStatus === 'SUBMIT TO QA') {
            if (roleName == 'QUALITY SUPPLY CHAIN') {
                shouldDisable = false;

            }
        } else {
            shouldDisable = true;

        }
        debugger;
        $('#btnSubmit').prop('disabled', shouldDisable);

        if (shouldDisable) {
            if (documentStatus === 'WAITING FOR APPROVAL') {
                $('#btnSubmit').attr('title', 'Document has already been submitted for approval');
                $('#btnSubmit').tooltip({
                    placement: 'top',
                    trigger: 'hover'
                });
            } else if (documentStatus === 'SUBMIT TO QA' && roleName !== 'QUALITY SUPPLY CHAIN') {
          
                $('#btnSubmit').attr('title', 'Only QUALITY SUPPLY CHAIN can submit at this stage');
                $('#btnSubmit').tooltip({
                    placement: 'top',
                    trigger: 'hover'
                });
            } else if (!headerId || headerId <= 0) {
                $('#btnSubmit').attr('title', 'Please save the document first before submitting');
                $('#btnSubmit').tooltip({
                    placement: 'top',
                    trigger: 'hover'
                });
            } else if (hasUnsavedChanges) {
                $('#btnSubmit').attr('title', 'Please save changes before submitting');
                $('#btnSubmit').tooltip({
                    placement: 'top',
                    trigger: 'hover'
                });
            }
        } else {
            $('#btnSubmit').attr('title', 'Submit document for approval');
            if ($('#btnSubmit').data('bs.tooltip')) {
                $('#btnSubmit').tooltip('dispose');
            }
        }
    }

    //=======================
    // DROPDOWN & OPTIONS LOADING
    //=======================
    function loadOptions() {
        $.ajax({
            url: '/ParentSpecification/GetAnalyzedByOptions',
            type: 'GET',
            success: function (response) {
                if (response.success) {
                    let options = '<option value=""> Select </option>';
                    $.each(response.data, function (index, item) {
                        options += `<option value="${item.value}">${item.text}</option>`;
                    });

                    $('#ddlAnalyzedBy').html(options);
                    $('#ddlAnalyzedByDimension').html(options);
                    $('#ddlAnalyzedByMaterial').html(options);
                    $('#ddlAnalyzedByPackagingIntegrity').html(options);
                    $('#ddlAnalyzedByContaminant').html(options);
                }
            },
            error: function (xhr, status, error) { }
        });

        $.ajax({
            url: '/ParentSpecification/GetParameterTypeOptions',
            type: 'GET',
            success: function (response) {
                if (response.success) {
                    let options = '<option value=""> Select </option>';
                    $.each(response.data, function (index, item) {
                        options += `<option value="${item.value}">${item.text}</option>`;
                    });

                    $('#ddlParameterType').html(options);
                    $('#ddlParameterTypeDimension').html(options);
                    $('#ddlParameterTypeMaterial').html(options);
                    $('#ddlParameterTypePackagingIntegrity').html(options);
                    $('#ddlParameterTypeContaminant').html(options);
                }
            },
            error: function (xhr, status, error) { }
        });
    }

    //=======================
    // HEADER FUNCTIONS
    //=======================
    function loadHeaderData(id) {
        
        $.ajax({
            url: `/ParentSpecification/GetHeaderData?id=${id}`,
            type: 'GET',
            success: function (data) {
                
                $('#txtDocumentStatus').val(data.txtDocumentStatus);
                $('#txtCategoryName').val(data.txtCategoryName);
                $('#txtCategoryCode').val(data.txtCategoryCode);
                $('#txtDocumentNumber').val(data.txtDocumentNumber);
                $('#DtmCreatedDate').val(formatDate(data.dtmInsertedDate));
                $('#txtSubBrand').val(data.txtSubBrand);
                $('#txtSubBrandCode').val(data.txtSubBrandCode);
                $('#decShelfLife').val(data.decShelfLife);
                $('#txtCategoryCode').val(data.txtCategoryCode);
                $('#headerId').val(data.id);

                
                if (data.txtSizeWidth) {
                    const parts = data.txtSizeWidth.toString().split(' ');
                    $('#txtSizeWidth').val(parts[0] || '');
                    $('#txtSizeWidthOptions').val(parts[1] || 'N/A');
                }

                if (data.decStockKeepingUnit) {
                    const parts = data.decStockKeepingUnit.toString().split(' ');
                    $('#decStockKeepingUnit').val(parts[0] || '');
                    $('#decStockKeepingUnitOptions').val(parts[1] || 'G');
                }

                $('#txtParentSpecificationCode').val(data.txtParentSpecificationCode);
                $('#txtVersion').val(data.intVersion);
                $('#txtDescription').val(data.txtDescription);
                $('#txtRemark').val(data.txtRemark);

                if (data.txtPmEvaluationNumber) {
                    const values = data.txtPmEvaluationNumber.split(',');
                    const $select = $('#txtPmEvaluationNumber');

                    values.forEach(function (value) {
                        if (value && value.trim() !== '') {
                            if (!$select.find(`option[value="${value.trim()}"]`).length) {
                                $select.append(new Option(value.trim(), value.trim(), true, true));
                            }
                        }
                    });

                    $select.trigger('change');
                }

                checkSubBrandCode();
                updateSaveButtonState();
                updateSubmitButtonState();

                if (isWaitingForApproval()) {
                    disableAllForApproval();
                } else if (id > 0) {
                    disableHeaderFields();
                }
            },
            error: function (xhr) {
                Swal.fire('Error', 'Failed to load specification data', 'error');
            }
        });
    }

    function initializeNewForm() {
        $('#txtDocumentStatus').val('DRAFT');
        const today = new Date();
        $('#DtmCreatedDate').val(formatDate(today));

        $('#txtCategoryName, #txtCategoryCode, #txtSubBrand, #txtSubBrandCode, #txtSizeWidth, #decStockKeepingUnit, ' +
            '#txtParentSpecificationCode, #txtDescription, #txtRemark').val('');

        $('#txtSizeWidthOptions').val('N/A');
        $('#decStockKeepingUnitOptions').val('G');

        $('#txtPmEvaluationNumber').val(null).trigger('change');
        updateSaveButtonState();
        updateSubmitButtonState();

        $.ajax({
            url: '/ParentSpecification/GetNewDocumentNumber',
            type: 'GET',
            success: function (docNumber) {
                $('#txtDocumentNumber').val(docNumber);
            }
        });
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    }

    //=======================
    // FIELD MANAGEMENT
    //=======================
    function disableFields() {
        savedTxtSizeWidthOptions = $('#txtSizeWidthOptions').val();
        savedDecStockKeepingUnitOptions = $('#decStockKeepingUnitOptions').val();

        $('#txtSizeWidth').prop('disabled', true);
        $('#txtSizeWidthOptions').prop('disabled', true);
        $('#txtSizeWidthOptions').val('');
        $('#spanSizeWidth').hide();

        $('#decStockKeepingUnit').prop('disabled', true);
        $('#decStockKeepingUnitOptions').prop('disabled', true);
        $('#decStockKeepingUnitOptions').val('');
        $('#spanStockKeepingUnit').hide();
    }

    function disableHeaderFields() {
        
        $(config.headerFields.join(', ')).prop('disabled', true);
        $(config.headerButtons.join(', ')).prop('disabled', true);
        //$('#txtPmEvaluationNumber').prop('disabled', true);
        $('.select2-container--default').addClass('select2-container--disabled');
        $('#txtSizeWidth, #txtSizeWidthOptions').prop('disabled', true);
        $('#decStockKeepingUnit, #decStockKeepingUnitOptions').prop('disabled', true);
        //    $('#btnPmEvaluationNumber').prop('disabled', true);
        if ($('#txtDocumentStatus').val() != "DRAFT" && $('#txtDocumentStatus').val() != "") {
             $('#btnPmEvaluationNumber').prop('disabled', true);
            $('#txtPmEvaluationNumber').prop('disabled', true);
        }
    }

    function isWaitingForApproval() {
        const documentStatus = $('#txtDocumentStatus').val().toUpperCase();
        return documentStatus === 'WAITING FOR APPROVAL';
    }

    function disableAllForApproval() {
        if (!$('#approval-notice').length) {
            $('<div id="approval-notice" class="approval-notice">' +
                '<i class="fas fa-exclamation-circle me-2"></i>' +
                'This document is in "Waiting for Approval" status and cannot be edited.' +
                '</div>').insertAfter('.card-body h4');
        }

        $('input, select, textarea').not('#btnBack, input[type=hidden], .dataTables_filter input').prop('disabled', true);
        $('button').not('#btnBack,.nav-link').prop('disabled', true);
        $('.select2').select2({ disabled: true });
        $('.tab-pane').addClass('form-disabled');
        disableTableOperations();
    }

    function disableAllForRole() {
        if (!$('#role-notice').length) {
            $('<div id="role-notice" class="approval-notice">' +
                '<i class="fas fa-exclamation-circle me-2"></i>' +
                'Your role is not permitted to edit this document in the current status.' +
                '</div>').insertAfter('.card-body h4');
        }

        $('input, select, textarea').not('#btnBack, input[type=hidden], .dataTables_filter input').prop('disabled', true);
        $('button').not('#btnBack,.nav-link').prop('disabled', true);
        $('.select2').select2({ disabled: true });
        $('.tab-pane').addClass('form-disabled');
        disableTableOperations();
    }

    function enforceRoleAccess() {
        const roleName = ($('#txtRoleName').val() || '').toUpperCase();
        const documentStatus = ($('#txtDocumentStatus').val() || '').toUpperCase();

        if (roleName === 'QUALITY SUPPLY CHAIN') {
            if (documentStatus === 'SUBMIT TO QA') {
                // Enable form interactions for this specific stage
                $('input, select, textarea, button').prop('disabled', false);
                // Re-apply existing general disable rules for header fields if editing existing record
                const headerId = parseInt($('#headerId').val() || '0');
                if (headerId > 0) {
                    disableHeaderFields();
                }
            } else {
                // For any other status, disable form for this role
                disableAllForRole();
            }
        }
    }

    function disableTableOperations() {
        const tables = Object.keys(config.tabs).map(key => `#${config.tabs[key].tableId}`);

        tables.forEach(tableId => {
            $(`${tableId} .edit-btn, ${tableId} .remove-btn`).prop('disabled', true)
                .addClass('btn-disabled')
                .css({
                    'opacity': '0.5',
                    'pointer-events': 'none',
                    'cursor': 'not-allowed'
                })
                .attr('title', 'Editing is disabled while document is waiting for approval');
        });
    }

    function generateDescription() {
        const categoryDesc = $('#txtCategoryName').val();
        if (categoryDesc === '') {
            $('#txtDescription').prop('disabled', true);
            $('#spanDescription').hide();
        } else {
            $('#spanDescription').show();
            $('#txtDescription').prop('disabled', false);
        }
    }

    function checkSubBrandCode() {
        const subBrandCode = $('#txtSubBrandCode').val();
        if (subBrandCode === 'GEN') {
            $('#txtSizeWidth').prop('disabled', false);
            $('#txtSizeWidthOptions').prop('disabled', false).val(savedTxtSizeWidthOptions);
            $('#spanSizeWidth').show();
            $('#spanStockKeepingUnit').hide();

            $('#decStockKeepingUnit').prop('disabled', true);
            $('#decStockKeepingUnitOptions').prop('disabled', true).val(savedDecStockKeepingUnitOptions);

            const input = $('#decStockKeepingUnit')[0];
            formatDecimalSKU(input);
        } else {
            $('#txtSizeWidth').prop('disabled', true);
            $('#txtSizeWidthOptions').prop('disabled', true).val(savedTxtSizeWidthOptions);

            $('#decStockKeepingUnit').prop('disabled', false);
            $('#decStockKeepingUnitOptions').prop('disabled', false).val(savedDecStockKeepingUnitOptions);
            $('#spanStockKeepingUnit').show();
            $('#spanSizeWidth').hide();

            const input = $('#decStockKeepingUnit')[0];
            formatDecimalSKU(input);
        }

        if (isWaitingForApproval()) {
            $('#txtSizeWidth, #txtSizeWidthOptions, #decStockKeepingUnit, #decStockKeepingUnitOptions').prop('disabled', true);
        } else if ($('#headerId').val() > 0) {
            $('#txtSizeWidth, #txtSizeWidthOptions, #decStockKeepingUnit, #decStockKeepingUnitOptions').prop('disabled', true);
        }
    }

    //=======================
    // CODE GENERATION
    //=======================
    function updateGenerateParentSpecificationCode() {
        const categoryCode = $('#txtCategoryCode').val();
        const subBrand = $('#txtSubBrandCode').val();
        const sizeWidth = $('#txtSizeWidth').val();
        const stockKeepingUnit = $('#decStockKeepingUnit').val();
        const sizeWidthOptions = $('#txtSizeWidthOptions').val();
        const stockKeepingUnitOptions = $('#decStockKeepingUnitOptions').val();

        if (categoryCode && subBrand) {
            const sizeOrStock = sizeWidth || stockKeepingUnit;
            const options = (sizeWidthOptions === 'N/A' || sizeWidthOptions === '')
                ? stockKeepingUnitOptions
                : sizeWidthOptions

            const generateParentSpecificationCode = `S-${categoryCode}-${subBrand}-${sizeOrStock}-${options}`;
            $('#txtParentSpecificationCode').val(generateParentSpecificationCode);

            clearTimeout(checkTimer);
            checkTimer = setTimeout(function () {
                checkCodeExist(generateParentSpecificationCode);
            }, 500);
        } else {
            $('#txtParentSpecificationCode').val('');
        }
    }

    function updateGenerateDescription() {
   
        const categoryDesc = $('#txtCategoryName').val();
        const subBrand = $('#txtSubBrand').val();
        const sizeWidth = $('#txtSizeWidth').val();
        const stockKeepingUnit = $('#decStockKeepingUnit').val();
        const stockKeepingUnitOptions = $('#decStockKeepingUnitOptions').val();
        const sizeWidthOptions = $('#txtSizeWidthOptions').val();

        const sizeOrStock = sizeWidth || stockKeepingUnit;
        const options = (sizeWidthOptions === 'N/A' || sizeWidthOptions === '')
            ? stockKeepingUnitOptions
            : sizeWidthOptions

        if (categoryDesc && subBrand) {
            const generateDescription = `SPEC ${categoryDesc} ${subBrand} ${sizeOrStock} ${options}`;
            $('#txtDescription').val(generateDescription);
        } else {
            $('#txtDescription').val('');
        }
    }

    function checkCodeExist(code) {
        const token = $('input[name="__RequestVerificationToken"]').val();

        $.ajax({
            url: '/ParentSpecification/CheckCodeExists',
            type: 'POST',
            data: JSON.stringify({ code: code }),
            contentType: 'application/json',
            headers: {
                'RequestVerificationToken': token
            },
            success: function (response) {
                $('#txtVersion').val(response.version);
            },
            error: function (xhr, status, error) { }
        });
    }

    //=======================
    // VALIDATION
    //=======================
    function validateHeaderForm() {
        let isValid = true;
        let errorMessage = '';

        if (!$('#txtCategoryName').val().trim()) {
            isValid = false;
            errorMessage += '- Category is required<br>';
        }

        if (!$('#txtSizeWidth').val().trim() && !$('#decStockKeepingUnit').val().trim()) {
            isValid = false;
            errorMessage += '- Size Width or Stock Keeping Unit is required<br>';
        }

        if (!$('#txtDescription').val().trim()) {
            isValid = false;
            errorMessage += '- Description is required<br>';
        }

        const pmEvaluationNumber = $('#txtPmEvaluationNumber').val();
        if (!pmEvaluationNumber || pmEvaluationNumber.length === 0) {
            isValid = false;
            errorMessage += '- At least one PM Evaluation Number is required<br>';
        }

        if (!$('#txtRemark').val().trim()) {
            isValid = false;
            errorMessage += '- Remarks is required<br>';
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

    function validateDecimalInput(input) {
        let value = input.value.replace(/[^0-9.]/g, '');

        let parts = value.split('.');
        if (parts.length > 2) {
            parts[1] = parts.slice(1).join('');
            value = parts[0] + '.' + parts[1];
        }

        if (parts.length === 2) {
            parts[1] = parts[1].substring(0, 3);
            value = parts[0] + '.' + parts[1];
        }

        input.value = value;
    }

    //=======================
    // DATA COLLECTION
    //=======================
    function collectAllDataForSubmission() {
        const parseDecimal = (value) => {
            if (value === null || value === undefined || value === '') return null;
            const num = parseFloat(value);
            return isNaN(num) ? null : num;
        };

        const parseIntSafe = (value) => {
            if (value === null || value === undefined || value === '') return null;
            const num = parseInt(value);
            return isNaN(num) ? null : num;
        };

        function mapListItems(list) {
            
            return list.map(item => {
                const mappedItem = {
                    id: item.id || 0,
                    intTestId: item.intTestId ? parseInt(item.intTestId) : null,
                    txtLine: item.txtLine || '10',
                    txtTestCode: item.txtTestCode || '',
                    txtClass: item.txtClass || '',
                    txtUnit: item.txtUnit || '',
                    txtMethod: item.txtMethod || '',
                    txtType: item.txtType || '',
                    txtTarget: item.txtTarget || '',
                    decMin: parseDecimal(item.decMin),
                    decMax: parseDecimal(item.decMax),
                    txtParameterType: item.txtParameterType || '',
                    txtAnalyzedBy: item.txtAnalyzedBy || '',
                    txtRepeat: item.txtRepeat || '',
                    txtDetail: item.txtDetail || '',
                    txtPME: item.txtPME || '',
                    isNew: item.isNew || false,
                    isDeleted: item.isDeleted || false
                };
                return mappedItem;
            });
        }
    
        return {
            parentSpecification: {
                id: parseIntSafe($('#headerId').val()) || 0,
                txtCategoryCode: $('#txtCategoryCode').val() || '',
                txtCategoryName: $('#txtCategoryName').val() || '',
                txtSubBrand: $('#txtSubBrand').val() || '',
                txtSizeWidth: $('#txtSizeWidth').val() || '',
                /*decStockKeepingUnit: parseDecimal($('#decStockKeepingUnit').val()),*/
                decStockKeepingUnit: $('#decStockKeepingUnit').val(),
                txtParentSpecificationCode: $('#txtParentSpecificationCode').val() || '',
                intVersion: parseIntSafe($('#txtVersion').val()),
                txtPmEvaluationNumber: $('#txtPmEvaluationNumber').val() || '',
                txtDescription: $('#txtDescription').val() || '',
                txtRemark: $('#txtRemark').val() || '',
                txtDocumentStatus: $('#txtDocumentStatus').val() || '',
                decShelfLife: parseDecimal($('#decShelfLife').val()),
                txtCategoryCode: $('#txtCategoryCode').val() || ''
            },

            visualAndAppearanceItem: mapListItems(data.visualAndAppearanceList),
            dimensionItem: mapListItems(data.dimensionList),
            materialItem: mapListItems(data.materialList),
            packagingIntegrityItem: mapListItems(data.packagingIntegrityList),
            contaminantItem: mapListItems(data.contaminantList),
            action: 'Save'
        };
    }

    //=======================
    // INITIALIZATION
    //=======================
    function initFormFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        
        if (id!='' ) {
            $('#headerId').val(id);
            $('#formTitle').text('Edit Parent Specification');
            $('#btnSaveText').text('Update');

            loadHeaderData(id);
        } else {
            $('#formTitle').text('Create Parent Specification');
            $('#btnSaveText').text('Save');

            initializeNewForm();
        }
    }

    function initializeForm() {
        $('#btnSubmit').hide();

        $(".select2").select2();

        generateDescription();
        //$('#decStockKeepingUnit').on('input', function () {
        //    validateDecimalInput(this);
        //});

        $("#txtPmEvaluationNumber").select2({
            disabled: false,
            placeholder: " Select PM Evaluation",
            allowClear: true,
            dropdownCssClass: "d-none",
            minimumInputLength: 999,
            width: '100%'
        });

        $('#txtPmEvaluationNumber').on('select2:opening', function (e) {
            e.preventDefault();
            $('#btnPmEvaluationNumber').focus();
            return false;
        });

        $('<small class="text-muted ml-2">Please use Search button to select values</small>')
            .insertAfter('#txtPmEvaluationNumber');

        $('#btnPmEvaluationNumber').addClass('btn-primary').removeClass('btn-secondary');

        $('#txtDocumentStatus').on('change', function () {
            updateSubmitButtonState();
            updateSaveButtonState();

            if (isWaitingForApproval()) {
                disableAllForApproval();
            }
            enforceRoleAccess();
        });

        disableFields();

        $('#txtCategoryCode, #txtSubBrand, #txtSizeWidth, #decStockKeepingUnit').on('input', updateGenerateParentSpecificationCode);
        $('#txtCategoryName, #txtSubBrand, #txtSizeWidth, #decStockKeepingUnit, #decStockKeepingUnitOptions').on('input', updateGenerateDescription);

        $('#txtSizeWidthOptions').on('change', updateGenerateParentSpecificationCode);
        $('#decStockKeepingUnitOptions').on('change', updateGenerateParentSpecificationCode);

        $('#txtCategoryName').on('change', updateGenerateParentSpecificationCode);

        //=======================
        // MAIN BUTTON HANDLERS
        //=======================

        // Save button handler
        $('#btnSave').on('click', function (e) {
            e.preventDefault();

            if (isWaitingForApproval()) {
                return;
            }

            if (!validateHeaderForm()) {
                return;
            }
            const allData = collectAllDataForSubmission();

            const isEditMode = $('#headerId').val() > 0;
            const url = isEditMode ? '/ParentSpecification/Update' : '/ParentSpecification/SaveAll';
            const saveOrUpdateText = isEditMode ? 'Update' : 'Save';

            Swal.fire({
                title: 'Confirmation',
                text: `Are you sure you want to ${saveOrUpdateText} this data?`,
                icon: 'warning',
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
                    $.ajax({
                        url: url,
                        type: 'POST',
                        data: JSON.stringify(allData),
                        contentType: 'application/json',
                        headers: {
                            'Accept': 'application/json',
                            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
                        },
                        success: function (response) {
                            if (response.success) {
                                
                                clearUnsavedFlags();

                                
                                /* const id = parseInt($('#headerId').val());*/
                                const id = isEditMode
                                    ? parseInt($('#headerId').val())
                                    : parseInt(response.id); // ✅ Tambahan ini untuk kasus SaveAll

                                Swal.fire({
                                    title: 'Success',
                                    text: response.message,
                                    icon: 'success',
                                    showCancelButton: false,
                                    confirmButtonText: 'OK',
                                    customClass: {
                                        confirmButton: 'btn btn-primary',
                                    }
                                })

                                    .then(() => {
                                        // Get the current GUID from the URL instead of using integer ID
                                     
                                        const urlParams = new URLSearchParams(window.location.search);
                                        const currentGuid = urlParams.get('txtParentSpecificationId');
                                        window.location.href = `/ParentSpecification/Detail?id=${currentGuid}`;
                                });
                            } else {
                                Swal.fire('Error', response.message, 'error');
                            }
                        },
                        error: function (xhr, status, error) {
                            Swal.fire('Error', `Failed to ${saveOrUpdateText} data: ` + error, 'error');
                        }
                    });
                }
            });
        });

        // Submit button handler - similar fix
        $('#btnSubmit').on('click', function (e) {
            e.preventDefault();

            const documentStatus = ($('#txtDocumentStatus').val() || '').toUpperCase();
            const roleName = ($('#txtRoleName').val() || '').toUpperCase();

            if (isWaitingForApproval()) {
                return;
            }

            // Only QUALITY SUPPLY CHAIN role can submit when status is SUBMIT TO QA
            if (documentStatus === 'SUBMIT TO QA' && roleName !== 'QUALITY SUPPLY CHAIN') {
                toastr.error('Only QUALITY SUPPLY CHAIN is permitted to submit at this stage');
                return;
            }

            const headerId = parseInt($('#headerId').val());
            if (!headerId || headerId <= 0) {
                toastr.error("Please save the document first before submitting");
                return;
            }

            Swal.fire({
                title: 'Confirmation',
                text: "Are you sure you want to submit this specification for approval?",
                icon: 'warning',
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
                    const allData = collectAllDataForSubmission();
                    allData.parentSpecification.TxtDocumentStatus = "WAITING FOR APPROVAL";

                    $.ajax({
                        url: '/ParentSpecification/SubmitForApproval',
                        type: 'POST',
                        data: JSON.stringify(allData),
                        contentType: 'application/json',
                        headers: {
                            'Accept': 'application/json',
                            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
                        },
                        success: function (response) {
                            handleSubmitResponse(response, headerId);
                        },
                        error: function (xhr, status, error) {
                            Swal.fire('Error', 'Failed to submit for approval: ' + error, 'error');
                        }
                    });
                }
            });
        });

        $('#btnSubmitQA').on('click', function (e) {
            e.preventDefault();

            if (isWaitingForApproval()) {
                return;
            }

            const headerId = parseInt($('#headerId').val());
            if (!headerId || headerId <= 0) {
                toastr.error("Please save the document first before submitting");
                return;
            }

            Swal.fire({
                title: 'Confirmation',
                text: "Are you sure you want to submit this specification for approval?",
                icon: 'warning',
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
                    const allData = collectAllDataForSubmission();
                    allData.parentSpecification.TxtDocumentStatus = "SUBMIT TO QA";

                    $.ajax({
                        url: '/ParentSpecification/SubmitForQA',
                        type: 'POST',
                        data: JSON.stringify(allData),
                        contentType: 'application/json',
                        headers: {
                            'Accept': 'application/json',
                            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
                        },
                        success: function (response) {
                            handleSubmitResponse(response, headerId);
                        },
                        error: function (xhr, status, error) {
                            Swal.fire('Error', 'Failed to submit for approval: ' + error, 'error');
                        }
                    });
                }
            });
        });

        function handleSubmitResponse(response, id) {
            if (response.success) {
                $('#txtDocumentStatus').val('WAITING FOR APPROVAL');
                disableAllForApproval();
                updateSaveButtonState();
                updateSubmitButtonState();

                Swal.fire({
                    title: 'Success',
                    text: response.message,
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    // Get the current GUID from the URL instead of using integer ID
                    const urlParams = new URLSearchParams(window.location.search);
                    const currentGuid = urlParams.get('id');
                    window.location.href = `/ParentSpecification/Detail?id=${currentGuid}`;
                });
            } else {
                Swal.fire('Error', response.message, 'error');
            }
        }

        $('#btnBack').on('click', function (e) {
            e.preventDefault();
            
            // Complete Navigation Logic (mimics _layout.cshtml)
            debugger;
            // Step 1: Get Destination URL (The "New Active" URL)
            let targetUrl = localStorage.getItem('prevurlMenu');
            // Implement fallback if null, undefined, or empty
            if (!targetUrl || targetUrl.trim() === '') {
                targetUrl = '/ParentSpecification';
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

            let hasUnsavedData = false;
            for (const tabKey in config.tabs) {
                const tabConfig = config.tabs[tabKey];
                if (data[tabConfig.dataListName].some(item => item.unsaved)) {
                    hasUnsavedData = true;
                    break;
                }
            }

            let confirmMessage = "Are you sure you want to return to the main page?";
            if (hasUnsavedData) {
                confirmMessage = "There are unsaved changes. Are you sure you want to return to the main page without saving?";
            }

            Swal.fire({
                title: 'Confirmation',
                text: confirmMessage,
                icon: 'warning',
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
                    performNavigation();
                }
            });
        });

        updateSaveStatus();
        updateSaveButtonState();

        const headerId = $('#headerId').val();
        if (headerId > 0) {
            if (isWaitingForApproval()) {
                disableAllForApproval();
            } else {
                disableHeaderFields();
            }
        }
        // Apply role access on initial load
        enforceRoleAccess();
    }

    //=======================
    // LOV FUNCTIONS
    //=======================
    function bindLovButtons() {
        $('#btnCategory').click(function () {
            if (isWaitingForApproval()) {
                return;
            }

            if ($('#headerId').val() > 0) {
                return;
            }

            try {
                clsGlobal.generateLOV(config.lovCodes.category, config.lovCodes.category);
            } catch (ex) {
                clsGlobal.showAlert(ex);
            }
        });

        $('#btnPmEvaluationNumber').click(function () {

            
            //if (isWaitingForApproval()) {
            //    return;
            //}

            //if ($('#headerId').val() > 0) {
            //    return;
            //}

            try {
                clsGlobal.generateLOV(config.lovCodes.pmEvaluation, config.lovCodes.pmEvaluation, null, true);
            } catch (ex) {
                clsGlobal.showAlert(ex);
            }
        });

        $('#btnTestCode').click(function () {
            debugger
            if (isWaitingForApproval()) {
                return;
            }

            try {
                clsGlobal.generateLOV(config.lovCodes.visualAppearance, config.lovCodes.visualAppearance);
            } catch (ex) {
                clsGlobal.showAlert(ex);
            }
        });

        $('#btnTestCodeDimension').click(function () {
            if (isWaitingForApproval()) {
                return;
            }

            try {
                clsGlobal.generateLOV(config.lovCodes.dimension, config.lovCodes.dimension);
            } catch (ex) {
                clsGlobal.showAlert(ex);
            }
        });

        $('#btnTestCodeMaterial').click(function () {
            if (isWaitingForApproval()) {
                return;
            }

            try {
                clsGlobal.generateLOV(config.lovCodes.material, config.lovCodes.material);
            } catch (ex) {
                clsGlobal.showAlert(ex);
            }
        });

        $('#btnTestCodePackagingIntegrity').click(function () {
            if (isWaitingForApproval()) {
                return;
            }

            try {
                clsGlobal.generateLOV(config.lovCodes.packagingIntegrity, config.lovCodes.packagingIntegrity);
            } catch (ex) {
                clsGlobal.showAlert(ex);
            }
        });

        $('#btnTestCodeContaminant').click(function () {
            if (isWaitingForApproval()) {
                return;
            }

            try {
                clsGlobal.generateLOV(config.lovCodes.contaminant, config.lovCodes.contaminant);
            } catch (ex) {
                clsGlobal.showAlert(ex);
            }
        });




        $('#btntxtTarget').click(function () {
            
            if (isWaitingForApproval()) {
                return;
            }

            try {
                clsGlobal.generateLOV(config.lovCodes.pmTarget, config.lovCodes.pmTarget, $("#intTestId").val());
            } catch (ex) {
                clsGlobal.showAlert(ex);
            }
        });

        $('#btnLOVtxtMin').click(function () {
            
            if (isWaitingForApproval()) {
                return;
            }

            try {
                clsGlobal.generateLOV(config.lovCodes.pmTarget, config.lovCodes.pmMin, $("#intTestId").val());
            } catch (ex) {
                clsGlobal.showAlert(ex);
            }
        });

        $('#btnLOVtxtMax').click(function () {
            
            if (isWaitingForApproval()) {
                return;
            }

            try {
                clsGlobal.generateLOV(config.lovCodes.pmTarget, config.lovCodes.pmMax, $("#intTestId").val());
            } catch (ex) {
                clsGlobal.showAlert(ex);
            }
        });
    }

    function handleLovSelection(txtValue, txtPMEs) {

        if (isWaitingForApproval()) {
            return;
        }

        if ($('#headerId').val() > 0) {
            const lovCode = txtValue.split('|')[0];
            //if (lovCode === config.lovCodes.category || lovCode === config.lovCodes.pmEvaluation) {
            //    return;
            //}
            if (lovCode === config.lovCodes.category) {
                return;
            }
        }

        var arr = txtValue.split('|');
        const selectedEvaluations = $('#txtPmEvaluationNumber').val() || [];
     

        switch (arr[0]) {
            case config.lovCodes.category:
                $("#txtCategoryName").val(arr[2]);
                $("#txtSubBrand").val(arr[4]);
                $("#txtSubBrandCode").val(arr[3]);
                $("#txtCategoryCode").val(arr[1]);
                checkSubBrandCode();
                updateGenerateParentSpecificationCode();
                updateGenerateDescription();
                generateDescription();
                break;

            case config.lovCodes.pmEvaluation:
                var evaluationData = txtValue.substring(`${config.lovCodes.pmEvaluation}|`.length);
                var evaluationEntries = txtPMEs;// evaluationData.split('|||');
                var $select = $('#txtPmEvaluationNumber');
                $select.val(null);

                evaluationEntries.forEach(function (entry) {
                    
                    if (!entry) return;

                    var parts = entry.split('|');
                    if (parts.length >= 1) {
                        var displayText = '';

                        if (parts[0]) {
                            displayText = parts[0];
                        }

                        if (parts[1]) {
                            displayText += ' | ' + parts[1];
                        }

                        if (parts[2]) {
                            displayText += ' | ' + parts[2];
                        }

                        if (!$select.find('option[value="' + displayText + '"]').length) {
                            $select.append(new Option(displayText, displayText));
                        }

                        selectedEvaluations.push(displayText);
                    }
                });

                $select.val(selectedEvaluations).trigger('change');

                //// Tambahan: Kirim data txtPMEs ke server
                //if (txtPMEs && txtPMEs.length > 0) {
                //    const token = $('input[name="__RequestVerificationToken"]').val();

                //    $.ajax({
                //        url: '/ParentSpecification/GetDataMultiPME',
                //        type: 'POST',
                //        contentType: 'application/json',
                //        data: JSON.stringify({ txtPMEs: txtPMEs }),
                //        headers: {
                //            'RequestVerificationToken': token
                //        },
                //        success: function (response) {
                //            if (response && response.length > 0) {
                //                
                //                let minValues = response.map(x => x.Min);
                //                let maxValues = response.map(x => x.Max);
                //                let targetValues = response.map(x => x.Target);

                //                let min = Math.min(...minValues);
                //                let max = Math.max(...maxValues);
                //                let avgTarget = (targetValues.reduce((a, b) => a + b, 0) / targetValues.length).toFixed(2);

                //                $('#txtMin').val(min);
                //                $('#txtMax').val(max);
                //                $('#txtTarget').val(avgTarget);
                //            }
                //        },
                //        error: function (xhr, status, error) {
                //            console.error('Error GetDataMultiPME:', error);
                //        }
                //    });
                //}

                break;

            case config.lovCodes.visualAppearance:
            case config.lovCodes.dimension:
            case config.lovCodes.material:
            case config.lovCodes.packagingIntegrity:
            case config.lovCodes.contaminant:
                let prefix = '';
                if (arr[0] === config.lovCodes.dimension) prefix = 'Dimension';
                else if (arr[0] === config.lovCodes.material) prefix = 'Material';
                else if (arr[0] === config.lovCodes.packagingIntegrity) prefix = 'PackagingIntegrity';
                else if (arr[0] === config.lovCodes.contaminant) prefix = 'Contaminant';

                $(`#intTestId${prefix}`).val(arr[1]);
                $(`#txtTestCode${prefix}`).val(arr[2]);
                $(`#txtClass${prefix}`).val(arr[3]);
                $(`#txtUnit${prefix}`).val(arr[6]);
                $(`#txtMethod${prefix}`).val(arr[4]);
                $(`#txtType${prefix}`).val(arr[5]);

            
                break;
            case config.lovCodes.pmTarget:
                $('#txtTarget').val(arr[1]);

            case config.lovCodes.pmMin:
                $('#decMin').val(arr[2]);

            case config.lovCodes.pmMax:
                $('#decMax').val(arr[2]);
        }

        clsGlobal.closeLOV();
    }

    //=======================
    // PUBLIC INTERFACE
    //=======================
    return {
        init: function () {
            loadOptions();
            initFormFromUrl();
            initAllTables();
            initializeForm();
            bindTableEvents();
            bindTabEvents();
            bindLovButtons();
            updateSaveStatus();
        },
        data: data,
        config: config,
        checkSubBrandCode: checkSubBrandCode,
        setChooseLOV: function (txtValue, txtPMEs ) {
            handleLovSelection(txtValue, txtPMEs );
        },
        isWaitingForApproval: isWaitingForApproval
    };
})();

window.setChooseLOV = function (txtValue, txtPMEs) {
    debugger
    ParentSpecApp.setChooseLOV(txtValue, txtPMEs );
    ;
};


// Fungsi untuk format angka desimal dengan koma
function formatDecimal(input) {
    
    const unit = $('#txtSizeWidthOptions').val();
    if (unit  === 'N/A') return; // Tidak diformat jika N/A

    let value = input.value;

    let selectionStart = input.selectionStart;
    let afterCursor = value.length - selectionStart;

    // Bersihkan karakter selain angka dan titik
    let clean = value.replace(/,/g, '').replace(/[^0-9.]/g, '');

    const hasTrailingDot = clean.endsWith('.') && clean.indexOf('.') === clean.lastIndexOf('.');

    const parts = clean.split('.');
    let intPart = parts[0];
    let decPart = parts[1] || '';

    if (parts.length > 2) {
        decPart = parts.slice(1).join('');
    }

    // Maksimal 9 digit di belakang koma
    decPart = decPart.substring(0, 2);
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    let formatted = decPart.length > 0
        ? `${intPart}.${decPart}`
        : (hasTrailingDot ? `${intPart}.` : intPart);

    input.value = formatted;

    const newCursor = input.value.length - afterCursor;
    input.setSelectionRange(newCursor, newCursor);
}
function formatDecimalSKU(input) {
    

    let value = input.value;

    let selectionStart = input.selectionStart;
    let afterCursor = value.length - selectionStart;

    // Bersihkan karakter selain angka dan titik
    let clean = value.replace(/,/g, '').replace(/[^0-9.]/g, '');

    const hasTrailingDot = clean.endsWith('.') && clean.indexOf('.') === clean.lastIndexOf('.');

    const parts = clean.split('.');
    let intPart = parts[0];
    let decPart = parts[1] || '';

    if (parts.length > 2) {
        decPart = parts.slice(1).join('');
    }

    // Maksimal 9 digit di belakang koma
    decPart = decPart.substring(0, 2);
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    let formatted = decPart.length > 0
        ? `${intPart}.${decPart}`
        : (hasTrailingDot ? `${intPart}.` : intPart);

    input.value = formatted;

    const newCursor = input.value.length - afterCursor;
    input.setSelectionRange(newCursor, newCursor);
}

// Event input untuk formatting angka saat diketik
$('#txtSizeWidth').off('input').on('input', function () {
    formatDecimal(this);
});
$('#decStockKeepingUnit').off('input').on('input', function () {
    formatDecimalSKU(this);
});

// Event blur untuk tambahkan .00 jika tidak ada desimal
$('#txtSizeWidth').off('blur').on('blur', function () {
    const unit = $('#txtSizeWidthOptions').val();
    if (unit === 'N/A') return;

    let value = this.value.replace(/,/g, '');
    if (value.includes('.')) return;

    let number = parseFloat(value);
    if (!isNaN(number)) {
        let intPart = Math.floor(number).toString();
        intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        this.value = `${intPart}.00`;
    }
});
$('#decStockKeepingUnit').off('blur').on('blur', function () {
    const sku = $('#decStockKeepingUnitOptions').val();

    let value = this.value.replace(/,/g, '');
    if (value.includes('.')) return;

    let number = parseFloat(value);
    if (!isNaN(number)) {
        let intPart = Math.floor(number).toString();
        intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        this.value = `${intPart}.00`;
    }
});

// Reset input dan format ulang saat dropdown berubah
$('#txtSizeWidthOptions').off('change').on('change', function () {
    
    const unit = $(this).val();
    const input = $('#txtSizeWidth')[0];

    // 🔴 Clear isi input setiap ganti dropdown
    input.value = '';

        if (unit === 'N/A') {
            // Kembalikan ke string mentah tanpa format
            input.value = input.value.replace(/,/g, '');
        } else {
            formatDecimal(input);
        }
});
$('#decStockKeepingUnitOptions').off('change').on('change', function () {
    
    const sku = $(this).val();
    const input = $('#decStockKeepingUnit')[0];

    // 🔴 Clear isi input setiap ganti dropdown
    input.value = '';

    formatDecimalSKU(input);
});

//// Event dropdown unit: tentukan apakah perlu diformat atau tidak
//$('#txtSizeWidthOptions').on('change', function () {
//    const unit = $(this).val();
//    const input = $('#txtSizeWidth')[0];

//    if (unit === 'N/A') {
//        // Kembalikan ke string mentah tanpa format
//        input.value = input.value.replace(/,/g, '');
//    } else {
//        formatDecimal(input);
//    }
//});

function getDataMultiPME(txtPMEs) {
    
    // Simulasi data PME dari database / AJAX
    const allPMEData = [
        { txtPME: "007-PME-06-25", min: 1, max: 5, target: 3 },
        { txtPME: "007-PME-05-25", min: 2, max: 7, target: 5 },
        { txtPME: "007-PME-03-25", min: 4, max: 8, target: 6 }
        // Tambahkan data lain jika perlu
    ];

    let selectedPMEs = allPMEData.filter(pme => txtPMEs.includes(pme.txtPME));

    if (selectedPMEs.length === 0) {
        console.warn('No PME data matched.');
        return;
    }

    const minValue = Math.min(...selectedPMEs.map(p => p.min));
    const maxValue = Math.max(...selectedPMEs.map(p => p.max));
    const avgTarget = (
        selectedPMEs.reduce((sum, p) => sum + p.target, 0) / selectedPMEs.length
    ).toFixed(2); // 2 decimal places

    // ===> UPDATE KE INPUT FORM JIKA PERLU:
    // parent.$('#txtMin').val(minValue);
    // parent.$('#txtMax').val(maxValue);
    // parent.$('#txtTarget').val(avgTarget);

    console.log('Min:', minValue);
    console.log('Max:', maxValue);
    console.log('Target (Avg):', avgTarget);
}



$('#txtPmEvaluationNumber').on('change', function (e) {


    if (isPMEDataLoaded) {
        const selectedTexts = $(this).find('option:selected').map(function () {
            const fullText = $(this).text();
            const firstPart = fullText.split('|')[0].trim();
            return firstPart;
        }).get();
     
        // Dapatkan nilai yang baru ditambahkan
        const addedValues = selectedTexts.filter(value => !newPmEvaluations.includes(value));

        // Dapatkan nilai yang dihapus
        const removedValues = newPmEvaluations.filter(value => !selectedTexts.includes(value));

        // Perbarui array pelacakan global
        newPmEvaluations = selectedTexts;

        // Jika ada nilai yang dihapus, hapus data terkait dari tabel
        if (removedValues.length > 0) {
            removedValues.forEach(value => {
                handleRemovePME(value);
            });
        }

        // Jika ada nilai baru yang ditambahkan, jalankan fungsi untuk setiap nilai
        if (addedValues.length > 0) {
            // Asumsi data yang diambil dari server akan diinsert ke semua tab
            addedValues.forEach(value => {
                // Panggil fungsi utama untuk ambil data dan insert ke semua tabel
                if (value != "") {
                    fetchAndInsertPMEData(value);

                }
            });
        }

        // Perbarui status 'unsaved' jika ada perubahan
        //ParentSpecApp.updateSaveStatus();
    } else {
        // Isi newPmEvaluations dengan nilai yang sudah ada
        const initialValues = $('#txtPmEvaluationNumber').find('option:selected').map(function () {
            const fullText = $(this).text();
            const firstPart = fullText.split('|')[0].trim();
            return firstPart;
        }).get();
        
        newPmEvaluations = initialValues;
        isPMEDataLoaded = true;
    }
   
});

function calculateNextLineNumber(dataList) {
    if (!dataList || dataList.length === 0) {
        return 10;
    }

    let maxLine = 0;
    dataList.forEach(item => {
        if (item.txtLine && parseInt(item.txtLine) > maxLine && !item.isDeleted) {
            maxLine = parseInt(item.txtLine);
        }
    });

    return maxLine + 10;
}

//// Fungsi untuk mengambil data dari server dan memasukkannya ke semua tab

function calculateNextLineNumber(dataList) {
    if (!dataList || dataList.length === 0) {
        return 10;
    }
    let maxLine = 0;
    dataList.forEach(item => {
        if (item.txtLine && parseInt(item.txtLine) > maxLine && !item.isDeleted) {
            maxLine = parseInt(item.txtLine);
        }
    });
    return maxLine + 10;
}

function fetchAndInsertPMEData(pmeCode) {
    

    const token = $('input[name="__RequestVerificationToken"]').val();

    // Buat array untuk menampung deferred objects dari setiap AJAX call
    const deferreds = [];

    Object.keys(ParentSpecApp.config.tabs).forEach(tabKey => {
        const tabConfig = ParentSpecApp.config.tabs[tabKey];
        const url = tabConfig.ajaxUrlPME;
        const dataToSend = { txtPME: pmeCode };
        // Panggil $.ajax dan tambahkan promise-nya ke dalam array deferreds
        const jqXHR = $.ajax({
            url: url,
            type: 'GET',
            data: dataToSend,
            success: function (response) {
                if (response.success && response.data && response.data.length > 0) {
                    const table = $(`#${tabConfig.tableId}`).DataTable();
                    const dataList = ParentSpecApp.data[tabConfig.dataListName];

                    const newRowsToAdd = [];

                    response.data.forEach(newItem => {
                        // Perbaikan: Ubah null menjadi 0 untuk newItem sebelum diproses
                        

                        newItem.decMin = newItem.decMin === null ? 0 : newItem.decMin;
                        newItem.decMin = newItem.decMin === null ? 0 : newItem.decMin;

                        const existingItemIndex = dataList.findIndex(oldItem =>
                            oldItem.txtTestCode === newItem.txtTestCode && !oldItem.isDeleted
                        );

                        newItem.TxtPME = pmeCode;
                      
                  

                        if (existingItemIndex > -1) {
                            const existingItem = dataList[existingItemIndex];
                            let isUpdated = false;
                            if (newItem.txtType.toLowerCase()!="v") {
                                // Perbaikan: Ubah null menjadi 0 untuk existingItem sebelum perbandingan
                                existingItem.decMin = existingItem.decMin === null ? 0 : existingItem.decMin;
                                existingItem.decMax = existingItem.decMax === null ? 0 : existingItem.decMax;

                                if (newItem.decMin < existingItem.decMin) {
                                    existingItem.decMin = newItem.decMin;
                                    isUpdated = true;
                                }

                                if (newItem.decMax > existingItem.decMax) {
                                    existingItem.decMax = newItem.decMax;
                                    isUpdated = true;
                                }
                            } else {
                                existingItem.decMin = "";
                                existingItem.decMax = "";
                            }
                            
                            if (newItem.txtDetail) {
                                // 1. Ambil dan bersihkan detail baru (hilangkan spasi di awal/akhir)
                                const newDetail = newItem.txtDetail.trim();

                                // Jangan proses jika detail baru ternyata kosong setelah di-trim
                                if (newDetail === '') return;

                                // 2. Pecah detail yang sudah ada menjadi array, bersihkan setiap elemen, dan saring entri kosong
                                let detailsArray = (existingItem.txtDetail || '')
                                    .split(';')
                                    .map(d => d.trim()) // Hilangkan spasi dari setiap elemen
                                    .filter(d => d !== ''); // Hapus elemen yang kosong

                                // 3. Cek apakah detail baru sudah ada di dalam array (perbandingan tidak case-sensitive)
                                const alreadyExists = detailsArray.some(existingDetail =>
                                    existingDetail.toLowerCase() === newDetail.toLowerCase()
                                );

                                // 4. Jika belum ada, tambahkan ke array, gabungkan kembali, dan tandai sebagai update
                                if (!alreadyExists) {
                                    detailsArray.push(newDetail); // Tambahkan detail baru (dengan case asli)
                                    existingItem.txtDetail = detailsArray.join(';'); // Gabungkan kembali dengan ';'
                                    isUpdated = true;
                                }
                            }
                            if (isUpdated) {
                                existingItem.unsaved = true;

                                const rowIndex = table.rows().eq(0).filter(function (rowIdx) {
                                    return table.cell(rowIdx, 1).data() === existingItem.txtTestCode ? true : false;
                                });
                                table.row(rowIndex).data(existingItem).draw(false);
                                $(table.row(rowIndex).node()).addClass('unsaved-row');

                                $(`#${tabConfig.name}SaveReminder`).show();
                            }
                        } else {
                            const nextLine = calculateNextLineNumber(dataList);
                            newItem.txtLine = nextLine.toString();
                            newItem.unsaved = true;
                            newItem.isNew = true;
                            if (newItem.txtType.toLowerCase() == "v") {
                                newItem.decMin = "";
                                newItem.decMax = "";
                            }

                            dataList.push(newItem);
                            newRowsToAdd.push(newItem);
                        }
                    });

                    if (newRowsToAdd.length > 0) {
                        table.rows.add(newRowsToAdd).draw();
                        newRowsToAdd.forEach(item => {
                            const addedRow = table.rows().nodes().to$().filter(function () {
                                return table.row(this).data() === item;
                            });
                            addedRow.addClass('unsaved-row');
                        });
                    }
                }
            },
            error: function (xhr, status, error) {
                console.error(`Failed to load data for ${tabConfig.name}:`, error);
                // Biarkan deferred object gagal secara default
            }
        });
        deferreds.push(jqXHR);
    });

    // Panggil $.when untuk menunggu semua AJAX call selesai
    $.when.apply($, deferreds).then(function () {
        // Ini akan dijalankan setelah SEMUA AJAX call selesai (baik success maupun fail)
        ParentSpecApp.updateSaveStatus();
        toastr.success('All data loaded successfully!');
    }).fail(function () {
        // Ini akan dijalankan jika ada SATU SAJA AJAX yang gagal
        ParentSpecApp.updateSaveStatus();
        toastr.error('One or more data loads failed.');
    });
}
function fetchAndInsertPMEDataOld(pmeCode) {
    const token = $('input[name="__RequestVerificationToken"]').val();

    // Buat array URL untuk setiap tab
    const ajaxCalls = Object.keys(ParentSpecApp.config.tabs).map(tabKey => {
        const tabConfig = ParentSpecApp.config.tabs[tabKey];
        return {
            url: tabConfig.ajaxUrlPME,
            data: JSON.stringify({ pmeCode: pmeCode }), // Kirim pmeCode sebagai parameter
            tabConfig: tabConfig
        };
    });



    
    // Jalankan AJAX call untuk setiap tab
    ajaxCalls.forEach(call => {
        // URL yang digunakan adalah ajaxUrlPME dari config
        const url = call.tabConfig.ajaxUrlPME;

        // Data yang dikirim hanya pmeCode, sesuai dengan parameter controller
        const dataToSend = { txtPME: pmeCode };

        $.ajax({
            url: url,
            type: 'GET', // Ganti menjadi GET karena controller methodnya GET
            contentType: 'application/json',
            data: dataToSend, // Kirim data sebagai query string
            headers: {
                // Hapus 'RequestVerificationToken' karena tidak dibutuhkan untuk GET
            },
            success: function (response) {
                if (response.success && response.data && response.data.length > 0) {
                    const tabConfig = call.tabConfig;
                    const table = $(`#${tabConfig.tableId}`).DataTable();
                    const dataList = ParentSpecApp.data[tabConfig.dataListName];

                    response.data.forEach(item => {
                        // Hitung nomor baris baru sebelum menambahkannya
                        const nextLine = calculateNextLineNumber(dataList);
                        item.txtLine = nextLine.toString();

                        // Tambahkan properti 'unsaved' agar terlihat di tabel
                        item.unsaved = true;
                        item.isNew = true;

                        // Tambahkan ke data lokal
                        dataList.push(item);

                        // Tambahkan baris baru ke DataTable
                        const newRow = table.row.add(item).draw().node();
                        $(newRow).addClass('unsaved-row');
                    });

                    // Tampilkan pesan "unsaved changes"
                    $(`#${tabConfig.name}SaveReminder`).show();
                   // ParentSpecApp.updateSaveStatus();
                }
            },
            error: function (xhr, status, error) {
                console.error(`Failed to load data for ${call.tabConfig.name}:`, error);
            }
        });
    });
}

// Opsional: Fungsi untuk menghapus data dari tabel jika PME dihapus dari dropdown
function handleRemovePME(pmeCode) {
    Object.keys(ParentSpecApp.config.tabs).forEach(tabKey => {
        const tabConfig = ParentSpecApp.config.tabs[tabKey];
        const table = $(`#${tabConfig.tableId}`).DataTable();
        const dataList = ParentSpecApp.data[tabConfig.dataListName];
        // Tandai item di data lokal yang memiliki PME yang dihapus
        dataList.forEach(item => {
            if (item.txtPME === pmeCode) { // Menggunakan nama properti yang benar
                item.isDeleted = true;
                item.unsaved = true;
            }
        });

        // Hapus baris dari DataTables yang memiliki PME yang dihapus
        table
            .rows(function (idx, data, node) {
                // Gunakan fungsi filter untuk memilih baris yang sesuai
                return data.txtPME === pmeCode;
            })
            .remove()
            .draw();
    });

    ParentSpecApp.updateSaveStatus();
}
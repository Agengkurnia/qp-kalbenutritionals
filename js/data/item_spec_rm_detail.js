/**
 * Item Spec RM Detail Logic
 * Manages 9 Datatables layout and LocalStorage binding for prototyping.
 */

const SPEC_RM_STORAGE_KEY = 'SpecRMDetails_Prototype_Data';

// Mock database of existing Item Specs for auto-populate feature
const MOCK_SPECS = {
    'S-RMFLA256': {
        origin: 'Netherlands',
        shelfLife: '730',
        netWeight: '20 KG',
        storage: 'Ambient (25°-30°C), Humidity < 60%',
        composition: 'Premium Flavouring Agents, Maltodextrin, Gum Arabic',
        prepMethod: 'Mix directly into dry ingredients or dissolve in oil-base',
        allergens: ['chkAlgnMilk', 'chkSoybeans'],
        details: {
            Organoleptic: [
                { id: 'nz1', txtTestCode: 'APP', txtTestClass: 'Physical', txtTestUnit: '-', txtTestMethodCode: 'WI-QA-01', txtTestType: 'Visual', txtTarget: 'Fine Powder', txtMin: '-', txtMax: '-', txtParameterType: 'Critical', txtAnalyzeBy: 'Internal', txtRepeat: 'No', txtDetail: 'Light yellowish' },
                { id: 'nz2', txtTestCode: 'ODOR', txtTestClass: 'Sensory', txtTestUnit: '-', txtTestMethodCode: 'WI-QA-02', txtTestType: 'Sensory', txtTarget: 'Characteristic', txtMin: '-', txtMax: '-', txtParameterType: 'Critical', txtAnalyzeBy: 'Internal', txtRepeat: 'No', txtDetail: 'Vanilla sweet' }
            ],
            Nutrition: [
                { id: 'nut1', txtTestCode: 'FAT', txtTestClass: 'Chemical', txtTestUnit: '%', txtTestMethodCode: 'AOAC-01', txtTestType: 'Chemical', txtTarget: '2.5', txtMin: '2.0', txtMax: '3.0', txtParameterType: 'Monitoring', txtAnalyzeBy: 'Internal', txtRepeat: 'No', txtDetail: '' }
            ]
        }
    },
    'S-RMFLA256-V2': {
        origin: 'Netherlands (Plant B)',
        shelfLife: '730',
        netWeight: '20 KG',
        storage: 'Cool & Dry place',
        composition: 'Flavouring Base V2, Maltodextrin',
        prepMethod: 'Mix directly',
        allergens: ['chkAlgnMilk'],
        details: {
            Organoleptic: [
                { id: 'nz2-1', txtTestCode: 'APP', txtTestClass: 'Physical', txtTestUnit: '-', txtTestMethodCode: 'WI-QA-01', txtTestType: 'Visual', txtTarget: 'White Powder', txtMin: '-', txtMax: '-', txtParameterType: 'Critical', txtAnalyzeBy: 'Internal', txtRepeat: 'No', txtDetail: 'Drier than V1' }
            ]
        }
    },
    'S-RMFLA999': {
        origin: 'Australia',
        shelfLife: '365',
        netWeight: '25 KG',
        storage: 'Chilled (4°C - 10°C)',
        composition: 'Skimmed Milk, Permeate',
        prepMethod: 'Standard reconstitution 1:9',
        allergens: ['chkAlgnMilk'],
        details: {
            Organoleptic: [
                { id: 'au1', txtTestCode: 'COLOR', txtTestClass: 'Physical', txtTestUnit: '-', txtTestMethodCode: 'WI-QA-05', txtTestType: 'Visual', txtTarget: 'White', txtMin: '-', txtMax: '-', txtParameterType: 'Critical', txtAnalyzeBy: 'Internal', txtRepeat: 'No', txtDetail: '' }
            ],
            HeavyMetals: [
                { id: 'hm1', txtTestCode: 'PB', txtTestClass: 'Heavy Metal', txtTestUnit: 'mg/kg', txtTestMethodCode: 'ICP-MS', txtTestType: 'Chemical', txtTarget: '< 0.02', txtMin: '0', txtMax: '0.02', txtParameterType: 'Critical', txtAnalyzeBy: 'External', txtRepeat: 'No', txtDetail: 'Lead content' }
            ]
        }
    },
    'S-RMDAI101': {
        origin: 'New Zealand',
        shelfLife: '365',
        netWeight: '25 KG',
        storage: 'Chilled environment',
        composition: 'Whole Milk Powder, Vitamin A, Vitamin D3',
        prepMethod: 'Spray dried process',
        allergens: ['chkAlgnMilk'],
        details: {
            Organoleptic: [
                { id: 'nz101', txtTestCode: 'FAT', txtTestClass: 'Chemical', txtTestUnit: '%', txtTestMethodCode: 'AOAC 989.05', txtTestType: 'Chemical', txtTarget: '26', txtMin: '25', txtMax: '27', txtParameterType: 'Critical', txtAnalyzeBy: 'Internal', txtRepeat: 'No', txtDetail: '' }
            ]
        }
    },
    'S-RMSWE505': {
        origin: 'Brazil',
        shelfLife: '1080',
        netWeight: '50 KG',
        storage: 'Dry Ambient',
        composition: 'Cane Sugar (99.9%)',
        prepMethod: 'Refined process',
        allergens: [],
        details: {
            Organoleptic: [
                { id: 'br505', txtTestCode: 'PURITY', txtTestClass: 'Chemical', txtTestUnit: '%', txtTestMethodCode: 'ICUMSA', txtTestType: 'Chemical', txtTarget: '99.9', txtMin: '99.7', txtMax: '100', txtParameterType: 'Critical', txtAnalyzeBy: 'Internal', txtRepeat: 'No', txtDetail: '' }
            ]
        }
    },
    'S-EVAL-RMFLA256': {
        origin: 'USA',
        shelfLife: '365',
        netWeight: '10 KG',
        storage: 'Room Temp',
        composition: 'Synthetic Aroma, Ethyl Alcohol',
        prepMethod: 'Dilution required',
        allergens: [],
        details: {
            Microbiological: [
                { id: 'eval1', txtTestCode: 'SALM', txtTestClass: 'Pathogen', txtTestUnit: '/25g', txtTestMethodCode: 'ISO 6579', txtTestType: 'Micro', txtTarget: 'Negative', txtMin: '-', txtMax: '-', txtParameterType: 'Critical', txtAnalyzeBy: 'External', txtRepeat: 'No', txtDetail: '' }
            ]
        }
    }
};

// Tabs categories matching legacy mapping
const TABS = {
    // Note: MaterialDescription is handled as a form, not a datatable
    Organoleptic: "Organoleptic",
    Nutrition: "Nutrition And Physical",
    Microbiological: "Microbiological",
    HeavyMetals: "Heavy Metals",
    OtherContaminantPesticide: "Pesticide",
    OtherContaminantAntibiotics: "Antibiotics",
    OtherContaminantMycotoxin: "Mycotoxin Residue",
    OtherContaminantForeignMatters: "Foreign Matters",
    FoodCategory: "Food Category"
};

// Common columns for the first 8 tabs
const COMMON_COLUMNS = [
    { data: 'txtTestCode', title: 'Test Code' },
    { data: 'txtTestClass', title: 'Test Class' },
    { data: 'txtTestUnit', title: 'Test Unit' },
    { data: 'txtTestMethodCode', title: 'Method Code' },
    { data: 'txtTestType', title: 'Test Type' },
    { data: 'txtTarget', title: 'Target' },
    { data: 'txtMin', title: 'Min' },
    { data: 'txtMax', title: 'Max' },
    { data: 'txtParameterType', title: 'Parameter Type' },
    { data: 'txtAnalyzeBy', title: 'Analyze By' },
    { data: 'txtRepeat', title: 'Repeat' },
    { data: 'txtDetail', title: 'Detail' }
];

class ItemSpecRMDetail {

    constructor() {
        this.tables = {};
        this.currentEditRowId = null;
        this.currentActiveTab = 'MaterialDescription';
        this.db = this.loadData();
    }

    init() {
        console.log('ItemSpecRMDetail: Initializing...');
        this.bindEvents();
        this.initAllTables();
        this.updateRoleUI();
        console.log('ItemSpecRMDetail: Initialization complete.');
    }

    loadData() {
        let stored = localStorage.getItem(SPEC_RM_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        // Initialize empty sets
        let defaultDb = {};
        Object.keys(TABS).forEach(k => { defaultDb[k] = []; });
        
        // Add sample data to Organoleptic
        defaultDb['Organoleptic'] = [{
            id: this.generateId(), txtTestCode: 'ORG-001', txtTestClass: 'Taste', txtTestUnit: '-', 
            txtTestMethodCode: 'M-01', txtTestType: 'Sensory', txtTarget: 'Target A', txtMin: '0', 
            txtMax: '10', txtParameterType: 'Critical', txtAnalyzeBy: 'Internal', txtRepeat: 'No', txtDetail: 'Taste must match sample'
        }];

        return defaultDb;
    }

    saveData() {
        localStorage.setItem(SPEC_RM_STORAGE_KEY, JSON.stringify(this.db));
    }

    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    selectRefItem(code, desc) {
        console.log(`ItemSpecRMDetail: Selecting reference item ${code} (${desc})`);
        $('#refItemSpec').val(code);
        this.closeModal('lovOracleModal');
        this.closeModal('lovRMEvalModal');
        
        // Auto-populate Logic
        const specData = MOCK_SPECS[code];
        if (specData) {
            Swal.fire({
                title: 'Importing Spec Data...',
                text: `Applying data from ${code}`,
                icon: 'info',
                timer: 1500,
                showConfirmButton: false,
                didOpen: () => { Swal.showLoading(); }
            });

            // 1. Fill Material Description
            $('#txtOrigin').val(specData.origin);
            $('#decShelfLife').val(specData.shelfLife);
            $('#decNetWeight').val(specData.netWeight);
            $('#txtStorageCondition').val(specData.storage);
            $('#txtComposition').val(specData.composition);
            $('#txtPreparationMethod').val(specData.prepMethod);

            // 2. Fill Allergens
            $('.allergen-check').prop('checked', false); // reset
            if (specData.allergens) {
                specData.allergens.forEach(id => {
                    $(`#${id}`).prop('checked', true);
                });
            }

            // 3. Fill Tables (Detail Parameters)
            // Reset current DB
            Object.keys(TABS).forEach(k => { this.db[k] = []; });
            
            // Map mock details into DB
            if (specData.details) {
                Object.keys(specData.details).forEach(tabKey => {
                    if (this.db[tabKey]) {
                        this.db[tabKey] = [...specData.details[tabKey]];
                    }
                });
            }

            // 4. Update UI
            this.saveData();
            Object.keys(this.tables).forEach(k => {
                this.tables[k].clear().rows.add(this.db[k]).draw();
            });

            console.log(`Successfully populated spec from ${code}`);
        } else {
            console.warn(`No mock data found for spec: ${code}`);
        }
    }

    // Role simulation as per legacy Viewbag.Department = QA/QS
    updateRoleUI() {
        const isQA = document.getElementById('roleToggle') && document.getElementById('roleToggle').checked;
        
        if (isQA) {
            // QA specific disables
            $('#txtOrigin, #txtComposition, #decShelfLife, #decNetWeight').prop('readonly', true);
            $('#refType').prop('disabled', true);
            $('#btnSearchRef').prop('disabled', true);
            $('.allergen-check').prop('disabled', true);
            $('.btn-delete-row').hide(); // Hide delete buttons
        } else {
            // Pack Dev or others
            $('#txtOrigin, #txtComposition, #decShelfLife, #decNetWeight').prop('readonly', false);
            $('#refType').prop('disabled', false);
            $('#btnSearchRef').prop('disabled', false);
            $('.allergen-check').prop('disabled', false);
            $('.btn-delete-row').show(); // Show delete buttons
        }
        
        // Re-render tables to catch button state changes
        Object.keys(this.tables).forEach(k => this.tables[k].rows().invalidate().draw());
    }

    bindEvents() {
        console.log('ItemSpecRMDetail: Binding events...');
        $('#roleToggle').on('change', () => this.updateRoleUI());

        // Reference Search Logic
        $('#btnSearchRef').on('click', () => {
            console.log('ItemSpecRMDetail: Search button clicked');
            const type = $('#refType').val();
            if (!type) {
                alert('Please select Reference Type first (Oracle or RM Evaluation)');
                return;
            }

            if (type === 'ORACLE') {
                this.openModal('lovOracleModal');
            } else if (type === 'RMEVAL') {
                this.openModal('lovRMEvalModal');
            }
        });

        // Clear item code if type changes
        $('#refType').on('change', () => {
            $('#refItemSpec').val('');
        });

        $('button[data-bs-toggle="tab"]').on('shown.bs.tab', (e) => {
            this.currentActiveTab = $(e.target).data('tab-id');
            const tabTitle = TABS[this.currentActiveTab] || "Parameter Data";
            $('#modalTabTitle').text(tabTitle);
            
            // Adjust form for FoodCategory vs Common
            if (this.currentActiveTab === 'FoodCategory') {
                $('#commonFormFields').addClass('d-none');
                $('#foodCategoryFields').removeClass('d-none');
            } else {
                $('#commonFormFields').removeClass('d-none');
                $('#foodCategoryFields').addClass('d-none');
            }

            // Hide global Add button for tabs that have special handling (MaterialDescription and OtherContaminant)
            if (this.currentActiveTab === 'MaterialDescription' || this.currentActiveTab === 'OtherContaminant') {
                $('#btnAddNewRow').parent().addClass('d-none');
            } else {
                $('#btnAddNewRow').parent().removeClass('d-none');
            }
        });

        $('#btnAddNewRow').on('click', () => {
            this.currentEditRowId = null;
            $('#frmUniversalInput')[0].reset();
            this.openModal('universalInputModal');
        });

        $('#btnSaveModal').on('click', (e) => {
            e.preventDefault();
            this.saveModalData();
        });
    }

    initAllTables() {
        Object.keys(TABS).forEach(tabKey => {
            let cols = [{
                title: 'Action',
                className: 'text-center',
                orderable: false,
                render: (data, type, row) => {
                    const isQA = document.getElementById('roleToggle') && document.getElementById('roleToggle').checked;
                    let editBtn = `<button class="btn btn-sm btn-icon btn-outline-primary" title="Edit" onclick="detailManager.openEditModal('${tabKey}', '${row.id}')"><i class="fas fa-edit"></i></button>`;
                    let delBtn = isQA ? '' : `<button class="btn btn-sm btn-icon btn-outline-danger ms-1 btn-delete-row" title="Delete" onclick="detailManager.deleteRow('${tabKey}', '${row.id}')"><i class="fas fa-trash"></i></button>`;
                    return `<div class="text-nowrap">${editBtn}${delBtn}</div>`;
                }
            }];

            if (tabKey === 'FoodCategory') {
                cols.push({ data: 'txtFoodCategoryDesc', title: 'Food Category Description' });
            } else {
                cols = cols.concat(COMMON_COLUMNS);
            }

            this.tables[tabKey] = $(`#tbDT${tabKey}`).DataTable({
                data: this.db[tabKey],
                columns: cols,
                pageLength: 5,
                lengthMenu: [5, 10, 25, 50],
                responsive: false,
                scrollX: true,
                autoWidth: false,
                dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6 d-flex justify-content-end"f>>t<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
            });
        });
    }

    openEditModal(tabKey, rowId) {
        this.currentActiveTab = tabKey;
        this.currentEditRowId = rowId;
        
        let rowData = this.db[tabKey].find(r => r.id === rowId);
        if (!rowData) return;

        $('#frmUniversalInput')[0].reset();
        
        if (tabKey === 'FoodCategory') {
            $('#txtFoodCategoryDesc').val(rowData.txtFoodCategoryDesc);
            $('#commonFormFields').addClass('d-none');
            $('#foodCategoryFields').removeClass('d-none');
        } else {
            Object.keys(rowData).forEach(key => {
                let el = $(`#${key}`);
                if (el.length) el.val(rowData[key]);
            });
            $('#commonFormFields').removeClass('d-none');
            $('#foodCategoryFields').addClass('d-none');
        }

        $('#modalTabTitle').text(TABS[tabKey]);
        this.openModal('universalInputModal');
    }

    deleteRow(tabKey, rowId) {
        if (!confirm('Are you sure you want to delete this row?')) return;
        
        this.db[tabKey] = this.db[tabKey].filter(r => r.id !== rowId);
        this.saveData();
        
        this.tables[tabKey].clear().rows.add(this.db[tabKey]).draw();
    }

    saveModalData() {
        let newData = { id: this.currentEditRowId || this.generateId() };
        
        if (this.currentActiveTab === 'FoodCategory') {
            newData.txtFoodCategoryDesc = $('#txtFoodCategoryDesc').val();
        } else {
            COMMON_COLUMNS.forEach(col => {
                newData[col.data] = $(`#${col.data}`).val();
            });
        }

        if (this.currentEditRowId) {
            let idx = this.db[this.currentActiveTab].findIndex(r => r.id === this.currentEditRowId);
            if (idx !== -1) {
                this.db[this.currentActiveTab][idx] = newData;
            }
        } else {
            this.db[this.currentActiveTab].push(newData);
        }

        this.saveData();
        this.tables[this.currentActiveTab].clear().rows.add(this.db[this.currentActiveTab]).draw();
        
        this.closeModal('universalInputModal');
    }

    openModal(id) {
        const el = document.getElementById(id);
        if (el) {
            // Apply filtering if it's an LOV modal
            if (id === 'lovOracleModal' || id === 'lovRMEvalModal') {
                const currentItemCode = $('#txtItemCode').val();
                console.log(`ItemSpecRMDetail: Filtering LOV ${id} for Item Code: ${currentItemCode}`);
                
                // Prototype filtering logic: Hide rows that don't match item code
                // Real implementation would pass this as a param to the API
                $(`#${id} tbody tr`).each(function() {
                    const rowText = $(this).text();
                    // Simple check if current item code is present in the row text (spec no usually contains it)
                    if (rowText.includes(currentItemCode)) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            }

            if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                const m = bootstrap.Modal.getOrCreateInstance(el);
                m.show();
            } else {
                console.error('Bootstrap JS not loaded. Cannot open modal:', id);
                if (typeof $(el).modal === 'function') {
                    $(el).modal('show');
                }
            }
        }
    }

    closeModal(id) {
        const el = document.getElementById(id);
        if (el) {
            if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                const m = bootstrap.Modal.getInstance(el);
                if (m) m.hide();
            } else {
                if (typeof $(el).modal === 'function') {
                    $(el).modal('hide');
                }
            }
        }
    }
}


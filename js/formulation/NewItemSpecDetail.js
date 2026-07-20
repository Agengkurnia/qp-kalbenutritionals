/**
 * New Item Spec Detail Javascript
 * All-in-one: UI logic + data storage (localStorage sebagai pengganti database)
 */

const NewItemSpecDetail = (function() {
    
    // Private variables
    let stepper;
    let systemNo = 0;
    let isEditMode = false;
    
    // Tabs that support the "Detail" column
    const TABS_WITH_DETAIL = ['InProcess', 'Organoleptic', 'Physical', 'Chemical'];

    // Tab name -> DataTable ID mapping
    const TAB_DT_MAP = {
        'PD2':            '#dtPD2',
        'PD3':            '#dtPD3',
        'InProcess':      '#dtInProcess',
        'Organoleptic':   '#dtOrganoleptic',
        'Physical':       '#dtPhysical',
        'Chemical':       '#dtChemical',
        'Microbiological':'#dtMicro',
        'HeavyMetals':    '#dtHeavyMetals',
        'Mycotoxin':      '#dtMycotoxin',
        'Pesticide':      '#dtPesticide',
        'Antibiotics':    '#dtAntibiotics',
        'ForeignMatter':  '#dtForeignMatter'
    };

    // Cache DOM Elements
    const elements = {
        badgeStatus: null,
        btnSaveHeader: null,
        btnSubmitOracle: null,
        btnReturn: null,
        btnRePush: null,
        btnCancel: null,
        headerDocNo: null
    };

    // =========================================================
    //  DATA STORE (localStorage sebagai pengganti database)
    // =========================================================

    const _storeEmptyState = () => ({
        header: {
            intSystemNo: 0, txtDocNo: '', txtDocStatus: '00', dtDocDate: '',
            txtItemCode: '', txtItemDesc: '', txtItemType: '', txtItemSpec: '',
            txtSpecDescription: '', intVersion: 1, txtCountry: '',
            txtBussinessPartnerRep: '',
            intSystemNoBlending: 0, txtItemSpecBlending: '', intVersionBlending: 0,
            intSystemNoPacking: 0, txtItemSpecPacking: '', intVersionPacking: 0,
            txtProductionSite: '', dtEffectiveDate: '', bitInline: false,
            txtRemark: '', txtSpecType: 'I',
            txtCreateBy: 'MOCK_USER',
            dtCreateDate: new Date().toISOString().split('T')[0]
        },
        productDescription1: {
            txtComposition: '', txtProductionMethod: '', txtPreservationMethod: '',
            txtDistributionMethod: '', txtStorageCondition: '', decShelfLife: null,
            txtSpecificLabel: '', txtPreparationSuggestion: '', txtPacking: '',
            txtGMOStatusDesc: '', txtFoodCategoryDesc: '',
            chkAlgnCereal: false, chkAlgnCrustaceae: false, chkAlgnEgg: false,
            chkAlgnMilk: false, chkAlgnFish: false, chkAlgnTree: false,
            chkAlgnPeanuts: false, chkAlgnSulphite: false, chkAlgnSoybeans: false,
            chkAlgnGlutenRefiningProcess: false, chkAlgnFishRefiningProcess: false,
            chkAlgnSoybeansRefiningProcess: false, chkAlgnNotContainAllergen: false
        },
        productDescription2: [], productDescription3: [],
        inProcess: [], organoleptic: [], physical: [], chemical: [],
        microbiological: [], heavyMetals: [],
        mycotoxin: [], pesticide: [], antibiotics: [], foreignMatter: []
    });

    let _storeState = _storeEmptyState();

    const _storeNextLineNo = (arr) => (!arr || arr.length === 0) ? 1 : Math.max(...arr.map(r => r.intLineNo || 0)) + 1;

    const _storeTabKey = (tabName) => {
        const map = {
            'PD2':'productDescription2', 'PD3':'productDescription3',
            'InProcess':'inProcess', 'Organoleptic':'organoleptic',
            'Physical':'physical', 'Chemical':'chemical',
            'Microbiological':'microbiological', 'HeavyMetals':'heavyMetals',
            'Mycotoxin':'mycotoxin', 'Pesticide':'pesticide',
            'Antibiotics':'antibiotics', 'ForeignMatter':'foreignMatter'
        };
        return map[tabName] || null;
    };

    const _storeSave = () => {
        try { localStorage.setItem('NIS_MOCK_DATA', JSON.stringify(_storeState)); }
        catch (e) { console.warn('localStorage save failed:', e); }
    };

    const _storeLoad = () => {
        try {
            const saved = localStorage.getItem('NIS_MOCK_DATA');
            if (saved) { _storeState = JSON.parse(saved); return true; }
        } catch (e) { console.warn('localStorage load failed:', e); }
        return false;
    };

    const _storeReset = () => {
        _storeState = _storeEmptyState();
        localStorage.removeItem('NIS_MOCK_DATA');
    };

    const _storeGetHeader = () => _storeState.header;
    const _storeSetHeader = (obj) => Object.assign(_storeState.header, obj);
    const _storeGetPD1 = () => _storeState.productDescription1;
    const _storeSetPD1 = (obj) => Object.assign(_storeState.productDescription1, obj);

    const _storeGetRows = (tabName) => {
        const key = _storeTabKey(tabName);
        if (!key) { console.error('[Store] Unknown tab:', tabName); return []; }
        return _storeState[key];
    };

    const _storeGetRow = (tabName, lineNo) => {
        const key = _storeTabKey(tabName);
        if (!key) return null;
        return _storeState[key].find(r => r.intLineNo === lineNo) || null;
    };

    const _storeAddRow = (tabName, rowData) => {
        const key = _storeTabKey(tabName);
        if (!key) return null;
        const arr = _storeState[key];
        const newRow = Object.assign({}, rowData, { intLineNo: _storeNextLineNo(arr) });
        arr.push(newRow);
        _storeSave();
        return newRow;
    };

    const _storeUpdateRow = (tabName, lineNo, updatedData) => {
        const key = _storeTabKey(tabName);
        if (!key) return false;
        const arr = _storeState[key];
        const idx = arr.findIndex(r => r.intLineNo === lineNo);
        if (idx === -1) return false;
        arr[idx] = Object.assign({}, arr[idx], updatedData, { intLineNo: lineNo });
        _storeSave();
        return true;
    };

    const _storeDeleteRow = (tabName, lineNo) => {
        const key = _storeTabKey(tabName);
        if (!key) return false;
        const arr = _storeState[key];
        const idx = arr.findIndex(r => r.intLineNo === lineNo);
        if (idx === -1) return false;
        arr.splice(idx, 1);
        _storeSave();
        return true;
    };

    // =========================================================
    //  INIT
    // =========================================================

    const init = function(id = 0, isEdit = true) {
        systemNo = id;
        isEditMode = isEdit;
        
        // Setup Stepper
        const stepperEl = document.querySelector('#wizardNewItemSpec');
        if (stepperEl && typeof Stepper !== 'undefined') {
            stepper = new Stepper(stepperEl, { linear: true, animation: true });
        }
        
        // Cache Elements
        elements.badgeStatus   = document.getElementById('badgeStatus');
        elements.btnSaveHeader = document.getElementById('btnSaveHeader');
        elements.btnSubmitOracle = document.getElementById('btnSubmitOracle');
        elements.btnReturn     = document.getElementById('btnReturn');
        elements.btnRePush     = document.getElementById('btnRePush');
        elements.btnCancel     = document.getElementById('btnCancel');
        elements.headerDocNo   = document.getElementById('headerDocNo');
        
        // Reset store for new document
        _storeReset();
        
        // Check mode
        if (systemNo > 0) {
            loadHeaderData(systemNo);
        } else {
            setStatusUI('NEW', 'bg-secondary', '00');
        }
        
        // Initialize DataTables
        initAllDataTables();
        
        // Move all modals to body to prevent stacking context issues
        $('.modal').appendTo('body');
        
        // Handle multiple modals z-index accurately for Vuexy + Bootstrap 5.
        // IMPORTANT: Vuexy sets --bs-modal-zindex: 1090 and --bs-backdrop-zindex: 1089
        // (not Bootstrap's default 1055/1050). Child modals must be above 1090.
        $(document).on('show.bs.modal', '.modal', function () {
            const openCount = $('.modal.show').length;
            if (openCount > 0) {
                // Each nested modal gets +20 above Vuexy's base 1090
                const zIndex = 1090 + (openCount * 20);
                $(this).css('z-index', zIndex);
                requestAnimationFrame(() => {
                    $('.modal-backdrop').not('.modal-stack')
                        .css('z-index', zIndex - 5)
                        .addClass('modal-stack');
                });
            }
        });

        $(document).on('hidden.bs.modal', '.modal', function () {
            if ($('.modal:visible').length) {
                $('body').addClass('modal-open');
            }
        });
        
        console.log("New Item Spec Detail Initialized.");
    };

    // =========================================================
    //  DATA LOADING & API CALLS (Mock)
    // =========================================================
    
    const loadHeaderData = function(id) {
        console.log("Loading Header ID:", id);
        elements.headerDocNo.innerText = "NIS-2026-0001";
        setStatusUI('DRAFT', 'bg-info', '10');
        loadAllTabsData(id);
    };
    
    const loadAllTabsData = function(id) {
        console.log("Loading tabs data for ID:", id);
    };

    // =========================================================
    //  WIZARD NAVIGATION
    // =========================================================
    
    const nextStep1 = function() {
        const itemCode = document.getElementById('txtItemCode').value;
        const itemType = document.getElementById('txtItemType').value;
        const country  = document.getElementById('txtCountry').value;
        const blend    = document.getElementById('txtItemSpecBlending').value;
        const pack     = document.getElementById('txtItemSpecPacking').value;
        
        if (!itemCode || !country) {
            Swal.fire({
                title: 'Required Fields',
                text: 'Please select Item Code before continuing.',
                icon: 'warning',
                showCancelButton: false,
                showDenyButton: false,
                confirmButtonText: 'OK'
            });
            return;
        }

        const isFinishGood = itemType.toLowerCase().includes('finish') || itemType.toLowerCase().includes('intermediate');
        
        if (isFinishGood && (!blend || !pack)) {
            Swal.fire({
                title: 'Required Fields',
                text: 'For Finish Good/Intermediate items, please select Blending Spec and Packing Spec before continuing.',
                icon: 'warning',
                showCancelButton: false,
                showDenyButton: false,
                confirmButtonText: 'OK'
            });
            return;
        }
        
        if (isFinishGood) {
            // Auto-fill Step 2 Data for FG/Intermediate
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('dtDocDate').value = today;
            document.getElementById('txtSpecDescription').value = `Spec ${itemCode} - ${country} (${blend} / ${pack})`;
            document.getElementById('txtProductionSite').value = "Factory Alpha (Mock)";
            
            let nextMonth = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            document.getElementById('dtEffectiveDate').value = nextMonth.toISOString().split('T')[0];
            document.getElementById('bitInline').checked = true;
            document.getElementById('txtRemark').value = "Auto-fill remark for testing.";
            
            if(document.getElementById('txtComposition'))     document.getElementById('txtComposition').value = "Sugar, Water, Flavoring (Mock)";
            if(document.getElementById('txtProductionMethod')) document.getElementById('txtProductionMethod').value = "Mixing & Heating";
            if(document.getElementById('txtGMOStatusDesc'))    document.getElementById('txtGMOStatusDesc').value = "GMO Free";
            if(document.getElementById('txtFoodCategoryDesc')) document.getElementById('txtFoodCategoryDesc').value = "Beverage";
        }
        
        stepper.next();
        $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
    };
    
    const prevStep = function() {
        stepper.previous();
    };

    // =========================================================
    //  HEADER SAVE
    // =========================================================

    /**
     * Sync current document into NIS_DOC_LIST (for Index page).
     * This keeps a list of all saved documents in localStorage.
     */
    const _syncToDocList = function () {
        const LIST_KEY = 'NIS_DOC_LIST';
        const h = _storeGetHeader();
        if (!h.txtItemCode) return; // nothing to sync

        let docs = [];
        try { docs = JSON.parse(localStorage.getItem(LIST_KEY) || '[]'); } catch (e) { docs = []; }

        // Auto-generate DocNo if empty
        if (!h.txtDocNo) {
            h.txtDocNo = 'NIS-' + new Date().getFullYear() + '-' +
                String(docs.length + 1).padStart(4, '0');
            _storeSetHeader({ txtDocNo: h.txtDocNo });
            _storeSave();
        }
        // Auto-assign systemNo if 0
        if (!h.intSystemNo) {
            h.intSystemNo = docs.length > 0
                ? Math.max(...docs.map(d => d.intSystemNo || 0)) + 1
                : 1;
            systemNo = h.intSystemNo;
            _storeSetHeader({ intSystemNo: h.intSystemNo });
            _storeSave();
        }

        const statusMap = {
            '00': 'NEW', '10': 'DRAFT', '20': 'WAITING APPROVAL',
            '25': 'SUBMITTED TO ORACLE', '26': 'PUSH FAILED',
            '30': 'APPROVED', '40': 'CANCELLED'
        };

        const entry = {
            intSystemNo:       h.intSystemNo,
            txtDocNo:          h.txtDocNo,
            txtDocStatus:      h.txtDocStatus || '10',
            txtDocStatusDesc:  statusMap[h.txtDocStatus || '10'] || h.txtDocStatus,
            dtDocDate:         h.dtDocDate || h.dtCreateDate || '',
            txtItemCode:       h.txtItemCode,
            txtItemSpec:       h.txtItemSpec || '',
            intVersion:        h.intVersion || 1,
            txtSpecDescription: h.txtSpecDescription || '',
            txtCreateBy:       h.txtCreateBy || 'MOCK_USER',
            txtNextApproval:   '-',
            _fullDoc:          _storeState
        };

        // Update or insert
        const idx = docs.findIndex(d => d.intSystemNo === h.intSystemNo);
        if (idx >= 0) {
            docs[idx] = entry;
        } else {
            docs.push(entry);
        }

        localStorage.setItem(LIST_KEY, JSON.stringify(docs));
    };
    
    const saveHeader = function() {
        const payload = buildHeaderPayload();
        _storeSetHeader(payload);
        _storeSetPD1(buildPD1Payload());
        _storeSave();
        _syncToDocList();
        
        console.log("Saving Draft:", _storeGetHeader());
        Swal.fire({
            title: 'Success',
            text: 'Header & Product Description saved successfully.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });
        setStatusUI('DRAFT', 'bg-info', '10');
        if (_storeGetHeader().txtDocNo) {
            elements.headerDocNo.innerText = _storeGetHeader().txtDocNo;
        }
    };
    
    const submitStep = function() {
        Swal.fire({
            title: 'Submit Spec?',
            text: 'Are you sure you want to confirm and submit these details to Oracle?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Submit'
        }).then((result) => {
            if (result.isConfirmed) {
                submitOracle();
            }
        });
    };
    
    const submitOracle = function() {
        console.log("Submitting to Oracle");
        Swal.fire('Submitted', 'Document has been submitted to Oracle.', 'success');
        setStatusUI('SUBMITTED TO ORACLE', 'bg-primary', '25');
    };
    
    const returnDoc = function() {
        Swal.fire({
            title: 'Return Document?',
            input: 'textarea',
            inputLabel: 'Reason for return',
            inputPlaceholder: 'Type your reason here...',
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                console.log("Returned:", result.value);
                setStatusUI('DRAFT', 'bg-info', '10');
            }
        });
    };
    
    const cancelDoc = function() {
        Swal.fire({
            title: 'Cancel Document?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, cancel it!'
        }).then((result) => {
            if (result.isConfirmed) {
                setStatusUI('CANCELLED', 'bg-danger', '40');
            }
        });
    };

    // =========================================================
    //  UI HELPERS
    // =========================================================
    
    const setStatusUI = function(statusDesc, badgeClass, statusCode) {
        if (!elements.badgeStatus) return;
        
        elements.badgeStatus.className = 'badge d-flex align-items-center me-2 ' + badgeClass;
        elements.badgeStatus.innerText = statusDesc + (statusCode ? ' (' + statusCode + ')' : '');
        
        elements.btnSaveHeader.classList.add('d-none');
        elements.btnSubmitOracle.classList.add('d-none');
        elements.btnReturn.classList.add('d-none');
        elements.btnRePush.classList.add('d-none');
        elements.btnCancel.classList.add('d-none');
        
        if (statusCode === '00' || statusCode === '10') {
            elements.btnSaveHeader.classList.remove('d-none');
            if (statusCode === '10') {
                elements.btnCancel.classList.remove('d-none');
            }
        } else if (statusCode === '20') {
            elements.btnSubmitOracle.classList.remove('d-none');
            elements.btnReturn.classList.remove('d-none');
        } else if (statusCode === '26') {
            elements.btnRePush.classList.remove('d-none');
        }
    };
    
    const buildHeaderPayload = function() {
        return {
            intSystemNo:          systemNo,
            dtDocDate:            document.getElementById('dtDocDate')?.value || '',
            txtItemCode:          document.getElementById('txtItemCode')?.value || '',
            txtItemDesc:          document.getElementById('txtItemDesc')?.value || '',
            txtItemType:          document.getElementById('txtItemType')?.value || '',
            txtItemSpec:          document.getElementById('txtItemSpec')?.value || '',
            txtCountry:           document.getElementById('txtCountry')?.value || '',
            txtBussinessPartnerRep: document.getElementById('txtBusinessRep')?.value || '',
            txtItemSpecBlending:  document.getElementById('txtItemSpecBlending')?.value || '',
            intVersionBlending:   parseInt(document.getElementById('intVersionBlending')?.value) || 0,
            txtItemSpecPacking:   document.getElementById('txtItemSpecPacking')?.value || '',
            intVersionPacking:    parseInt(document.getElementById('intVersionPacking')?.value) || 0,
            txtSpecDescription:   document.getElementById('txtSpecDescription')?.value || '',
            intVersion:           parseInt(document.getElementById('intVersion')?.value) || 1,
            txtProductionSite:    document.getElementById('txtProductionSite')?.value || '',
            dtEffectiveDate:      document.getElementById('dtEffectiveDate')?.value || '',
            bitInline:            document.getElementById('bitInline')?.checked || false,
            txtRemark:            document.getElementById('txtRemark')?.value || ''
        };
    };

    const buildPD1Payload = function() {
        return {
            txtComposition:          document.getElementById('txtComposition')?.value || '',
            txtProductionMethod:     document.getElementById('txtProductionMethod')?.value || '',
            txtPreservationMethod:   document.getElementById('txtPreservationMethod')?.value || '',
            txtDistributionMethod:   document.getElementById('txtDistributionMethod')?.value || '',
            txtStorageCondition:     document.getElementById('txtStorageCondition')?.value || '',
            decShelfLife:            document.getElementById('decShelfLife')?.value || null,
            txtSpecificLabel:        document.getElementById('txtSpecificLabel')?.value || '',
            txtPreparationSuggestion:document.getElementById('txtPreparationSuggestion')?.value || '',
            txtPacking:              document.getElementById('txtPacking')?.value || '',
            txtGMOStatusDesc:        document.getElementById('txtGMOStatusDesc')?.value || '',
            txtFoodCategoryDesc:     document.getElementById('txtFoodCategoryDesc')?.value || '',
            chkAlgnCereal:                   document.getElementById('chkAlgnCereal')?.checked || false,
            chkAlgnCrustaceae:               document.getElementById('chkAlgnCrustaceae')?.checked || false,
            chkAlgnEgg:                      document.getElementById('chkAlgnEgg')?.checked || false,
            chkAlgnMilk:                     document.getElementById('chkAlgnMilk')?.checked || false,
            chkAlgnFish:                     document.getElementById('chkAlgnFish')?.checked || false,
            chkAlgnTree:                     document.getElementById('chkAlgnTree')?.checked || false,
            chkAlgnPeanuts:                  document.getElementById('chkAlgnPeanuts')?.checked || false,
            chkAlgnSulphite:                 document.getElementById('chkAlgnSulphite')?.checked || false,
            chkAlgnSoybeans:                 document.getElementById('chkAlgnSoybeans')?.checked || false,
            chkAlgnGlutenRefiningProcess:    document.getElementById('chkAlgnGlutenRefiningProcess')?.checked || false,
            chkAlgnFishRefiningProcess:      document.getElementById('chkAlgnFishRefiningProcess')?.checked || false,
            chkAlgnSoybeansRefiningProcess:  document.getElementById('chkAlgnSoybeansRefiningProcess')?.checked || false,
            chkAlgnNotContainAllergen:       document.getElementById('chkAlgnNotContainAllergen')?.checked || false
        };
    };

    // =========================================================
    //  DATATABLE INITIALIZATIONS
    // =========================================================
    
    const initAllDataTables = function() {
        const defaultDtOptions = {
            scrollX: true,
            searching: false,
            paging: false,
            info: false,
            ordering: false,
            language: { emptyTable: "No parameters defined." }
        };
        
        // PD2
        if ($.fn.DataTable.isDataTable('#dtPD2')) $('#dtPD2').DataTable().destroy();
        $('#dtPD2').DataTable({
            ...defaultDtOptions,
            columns: [
                { title: 'Line No' }, { title: 'Intended Use' },
                { title: 'Quantity' }, { title: 'UOM' },
                { title: 'Water (%)' }, { title: 'Serving Suggestion' },
                { title: 'Action', orderable: false }
            ]
        });

        // PD3
        if ($.fn.DataTable.isDataTable('#dtPD3')) $('#dtPD3').DataTable().destroy();
        $('#dtPD3').DataTable({
            ...defaultDtOptions,
            columns: [
                { title: 'Line No' }, { title: 'Test Code' }, { title: 'Test Class' },
                { title: 'Test Unit' }, { title: 'Test Method' }, { title: 'Test Type' },
                { title: 'Target' }, { title: 'Min' }, { title: 'Max' },
                { title: 'Param Type' }, { title: 'Analyze By' }, { title: 'Repeat' },
                { title: 'Action', orderable: false }
            ]
        });

        // Spec Detail tabs (with Detail column)
        const tabsWithDetail = ['dtInProcess', 'dtOrganoleptic', 'dtPhysical', 'dtChemical'];
        tabsWithDetail.forEach(id => {
            if ($('#' + id).length) {
                if ($.fn.DataTable.isDataTable('#' + id)) $('#' + id).DataTable().destroy();
                $('#' + id).DataTable({
                    ...defaultDtOptions,
                    columns: [
                        { title: 'Line No' }, { title: 'Test Code' }, { title: 'Test Class' },
                        { title: 'Test Unit' }, { title: 'Test Method' }, { title: 'Test Type' },
                        { title: 'Target' }, { title: 'Min' }, { title: 'Max' },
                        { title: 'Param Type' }, { title: 'Analyze By' }, { title: 'Repeat' },
                        { title: 'Detail' }, { title: 'Action', orderable: false }
                    ]
                });
            }
        });

        // Spec Detail tabs (without Detail column)
        const tabsWithoutDetail = ['dtMicro', 'dtHeavyMetals', 'dtMycotoxin', 'dtPesticide', 'dtAntibiotics', 'dtForeignMatter'];
        tabsWithoutDetail.forEach(id => {
            if ($('#' + id).length) {
                if ($.fn.DataTable.isDataTable('#' + id)) $('#' + id).DataTable().destroy();
                $('#' + id).DataTable({
                    ...defaultDtOptions,
                    columns: [
                        { title: 'Line No' }, { title: 'Test Code' }, { title: 'Test Class' },
                        { title: 'Test Unit' }, { title: 'Test Method' }, { title: 'Test Type' },
                        { title: 'Target' }, { title: 'Min' }, { title: 'Max' },
                        { title: 'Param Type' }, { title: 'Analyze By' }, { title: 'Repeat' },
                        { title: 'Action', orderable: false }
                    ]
                });
            }
        });
        
        // Handle Tab change
        $('button[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
            $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
        });
    };

    // =========================================================
    //  RENDER TABLE FROM STORE
    // =========================================================

    const _actionBtns = function(tabName, lineNo) {
        return `<button type="button" class="btn btn-xs btn-warning me-1 py-0 px-1" onclick="NewItemSpecDetail.editRow('${tabName}',${lineNo})"><i class="ti ti-pencil"></i></button>` +
               `<button type="button" class="btn btn-xs btn-danger py-0 px-1" onclick="NewItemSpecDetail.deleteRow('${tabName}',${lineNo})"><i class="ti ti-trash"></i></button>`;
    };

    const renderTable = function(tabName) {
        const dtId = TAB_DT_MAP[tabName];
        if (!dtId || !$(dtId).length) return;

        const dt   = $(dtId).DataTable();
        const rows = _storeGetRows(tabName);

        dt.clear();

        rows.forEach(r => {
            if (tabName === 'PD2') {
                dt.row.add([
                    r.intLineNo, r.txtIntendedUse, r.intQuantity,
                    r.txtUOM, r.intWater, r.txtServingSuggestion,
                    _actionBtns(tabName, r.intLineNo)
                ]);
            } else if (tabName === 'PD3') {
                dt.row.add([
                    r.intLineNo, r.txtTestCode, r.txtTestClass,
                    r.txtTestUnit, r.txtTestMethodCode, r.txtTestType,
                    r.txtTarget, r.txtMin, r.txtMax,
                    r.txtParameterType, r.txtAnalyzeBy, r.txtRepeat,
                    _actionBtns(tabName, r.intLineNo)
                ]);
            } else if (TABS_WITH_DETAIL.includes(tabName)) {
                dt.row.add([
                    r.intLineNo, r.txtTestCode, r.txtTestClass,
                    r.txtTestUnit, r.txtTestMethodCode, r.txtTestType,
                    r.txtTarget, r.txtMin, r.txtMax,
                    r.txtParameterType, r.txtAnalyzeBy, r.txtRepeat,
                    r.txtDetail || '',
                    _actionBtns(tabName, r.intLineNo)
                ]);
            } else {
                dt.row.add([
                    r.intLineNo, r.txtTestCode, r.txtTestClass,
                    r.txtTestUnit, r.txtTestMethodCode, r.txtTestType,
                    r.txtTarget, r.txtMin, r.txtMax,
                    r.txtParameterType, r.txtAnalyzeBy, r.txtRepeat,
                    _actionBtns(tabName, r.intLineNo)
                ]);
            }
        });

        dt.draw();
    };

    // =========================================================
    //  CRUD - PD2 (Intended Use)
    // =========================================================

    const showAddModal = function(tabName) {
        if (tabName === 'PD2') {
            document.getElementById('pd2EditLineNo').value = '';
            document.getElementById('pd2IntendedUse').value = '';
            document.getElementById('pd2Quantity').value = '';
            document.getElementById('pd2UOM').value = '';
            document.getElementById('pd2Water').value = '';
            document.getElementById('pd2ServingSuggestion').value = '';
            document.getElementById('modalPD2Title').innerText = 'Add Intended Use';
            new bootstrap.Modal(document.getElementById('modalPD2')).show();
        } else if (tabName === 'PD3') {
            _clearModalPD3();
            document.getElementById('modalPD3Title').innerText = 'Add Net Weight / Volume';
            new bootstrap.Modal(document.getElementById('modalPD3')).show();
        } else {
            // Generic Spec Detail
            _clearModalSpec();
            document.getElementById('specDetailCurrentTab').value = tabName;
            document.getElementById('specDetailEditLineNo').value = '';
            document.getElementById('modalSpecDetailTitle').innerText = 'Add ' + tabName;
            // Show/hide Detail row
            const hasDetail = TABS_WITH_DETAIL.includes(tabName);
            document.getElementById('specDetailRow').style.display = hasDetail ? '' : 'none';
            new bootstrap.Modal(document.getElementById('modalSpecDetail')).show();
        }
    };

    const savePD2 = function() {
        const intendedUse = document.getElementById('pd2IntendedUse').value.trim();
        if (!intendedUse) {
            Swal.fire({ icon: 'warning', title: 'Required', text: 'Intended Use wajib diisi!', confirmButtonText: 'OK' });
            return;
        }

        const lineNo = parseInt(document.getElementById('pd2EditLineNo').value) || 0;
        const rowData = {
            txtIntendedUse:     intendedUse,
            intQuantity:        document.getElementById('pd2Quantity').value || '',
            txtUOM:             document.getElementById('pd2UOM').value || '',
            intWater:           document.getElementById('pd2Water').value || '',
            txtServingSuggestion: document.getElementById('pd2ServingSuggestion').value || ''
        };

        if (lineNo > 0) {
            _storeUpdateRow('PD2', lineNo, rowData);
        } else {
            _storeAddRow('PD2', rowData);
        }

        renderTable('PD2');
        bootstrap.Modal.getInstance(document.getElementById('modalPD2')).hide();
    };

    const editRow = function(tabName, lineNo) {
        const row = _storeGetRow(tabName, lineNo);
        if (!row) return;

        if (tabName === 'PD2') {
            document.getElementById('pd2EditLineNo').value       = row.intLineNo;
            document.getElementById('pd2IntendedUse').value      = row.txtIntendedUse;
            document.getElementById('pd2Quantity').value         = row.intQuantity;
            document.getElementById('pd2UOM').value              = row.txtUOM;
            document.getElementById('pd2Water').value            = row.intWater;
            document.getElementById('pd2ServingSuggestion').value= row.txtServingSuggestion;
            document.getElementById('modalPD2Title').innerText   = 'Edit Intended Use';
            new bootstrap.Modal(document.getElementById('modalPD2')).show();
        } else if (tabName === 'PD3') {
            document.getElementById('pd3EditLineNo').value       = row.intLineNo;
            document.getElementById('pd3TestCode').value         = row.txtTestCode;
            document.getElementById('pd3TestClass').value        = row.txtTestClass;
            document.getElementById('pd3TestUnit').value         = row.txtTestUnit;
            document.getElementById('pd3TestMethodCode').value   = row.txtTestMethodCode;
            document.getElementById('pd3TestType').value         = row.txtTestType;
            document.getElementById('pd3Target').value           = row.txtTarget;
            document.getElementById('pd3Min').value              = row.txtMin;
            document.getElementById('pd3Max').value              = row.txtMax;
            document.getElementById('pd3ParameterType').value    = row.txtParameterType;
            document.getElementById('pd3AnalyzeBy').value        = row.txtAnalyzeBy;
            document.getElementById('pd3Repeat').value           = row.txtRepeat;
            document.getElementById('modalPD3Title').innerText   = 'Edit Net Weight / Volume';
            new bootstrap.Modal(document.getElementById('modalPD3')).show();
        } else {
            // Generic Spec
            document.getElementById('specDetailCurrentTab').value  = tabName;
            document.getElementById('specDetailEditLineNo').value  = row.intLineNo;
            document.getElementById('specTestCode').value          = row.txtTestCode;
            document.getElementById('specTestClass').value         = row.txtTestClass;
            document.getElementById('specTestUnit').value          = row.txtTestUnit;
            document.getElementById('specTestMethodCode').value    = row.txtTestMethodCode;
            document.getElementById('specTestType').value          = row.txtTestType;
            document.getElementById('specTarget').value            = row.txtTarget;
            document.getElementById('specMin').value               = row.txtMin;
            document.getElementById('specMax').value               = row.txtMax;
            document.getElementById('specParameterType').value     = row.txtParameterType;
            document.getElementById('specAnalyzeBy').value         = row.txtAnalyzeBy;
            document.getElementById('specRepeat').value            = row.txtRepeat;
            document.getElementById('specDetail').value            = row.txtDetail || '';
            document.getElementById('modalSpecDetailTitle').innerText = 'Edit ' + tabName;
            const hasDetail = TABS_WITH_DETAIL.includes(tabName);
            document.getElementById('specDetailRow').style.display = hasDetail ? '' : 'none';
            new bootstrap.Modal(document.getElementById('modalSpecDetail')).show();
        }
    };

    const deleteRow = function(tabName, lineNo) {
        Swal.fire({
            title: 'Delete row?',
            text: 'Baris ini akan dihapus.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!'
        }).then(result => {
            if (result.isConfirmed) {
                _storeDeleteRow(tabName, lineNo);
                renderTable(tabName);
            }
        });
    };

    // =========================================================
    //  CRUD - PD3 (Net Weight/Volume)
    // =========================================================

    const _clearModalPD3 = function() {
        ['pd3EditLineNo','pd3TestID','pd3TestCode','pd3TestClass','pd3TestUnit',
         'pd3TestMethodCode','pd3TestType','pd3Target','pd3Min','pd3Max'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        ['pd3ParameterType','pd3AnalyzeBy','pd3Repeat'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
    };

    const savePD3 = function() {
        const testCode = document.getElementById('pd3TestCode').value.trim();
        if (!testCode) {
            Swal.fire({ icon: 'warning', title: 'Required', text: 'Test Code wajib diisi!', confirmButtonText: 'OK' });
            return;
        }

        const lineNo  = parseInt(document.getElementById('pd3EditLineNo').value) || 0;
        const rowData = {
            txtTestCode:       testCode,
            txtTestClass:      document.getElementById('pd3TestClass').value,
            txtTestUnit:       document.getElementById('pd3TestUnit').value,
            txtTestMethodCode: document.getElementById('pd3TestMethodCode').value,
            txtTestType:       document.getElementById('pd3TestType').value,
            txtTarget:         document.getElementById('pd3Target').value,
            txtMin:            document.getElementById('pd3Min').value,
            txtMax:            document.getElementById('pd3Max').value,
            txtParameterType:  document.getElementById('pd3ParameterType').value,
            txtAnalyzeBy:      document.getElementById('pd3AnalyzeBy').value,
            txtRepeat:         document.getElementById('pd3Repeat').value
        };

        if (lineNo > 0) {
            _storeUpdateRow('PD3', lineNo, rowData);
        } else {
            _storeAddRow('PD3', rowData);
        }

        renderTable('PD3');
        bootstrap.Modal.getInstance(document.getElementById('modalPD3')).hide();
    };

    // =========================================================
    //  CRUD - Generic Spec Detail
    // =========================================================

    const _clearModalSpec = function() {
        ['specTestID','specTestCode','specTestClass','specTestUnit',
         'specTestMethodCode','specTestType','specTarget','specMin','specMax','specDetail'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        ['specParameterType','specAnalyzeBy','specRepeat'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
    };

    const saveSpecDetail = function() {
        const tabName  = document.getElementById('specDetailCurrentTab').value;
        const testCode = document.getElementById('specTestCode').value.trim();

        if (!testCode) {
            Swal.fire({ icon: 'warning', title: 'Required', text: 'Test Code wajib diisi!', confirmButtonText: 'OK' });
            return;
        }

        const lineNo  = parseInt(document.getElementById('specDetailEditLineNo').value) || 0;
        const rowData = {
            txtTestCode:       testCode,
            txtTestClass:      document.getElementById('specTestClass').value,
            txtTestUnit:       document.getElementById('specTestUnit').value,
            txtTestMethodCode: document.getElementById('specTestMethodCode').value,
            txtTestType:       document.getElementById('specTestType').value,
            txtTarget:         document.getElementById('specTarget').value,
            txtMin:            document.getElementById('specMin').value,
            txtMax:            document.getElementById('specMax').value,
            txtParameterType:  document.getElementById('specParameterType').value,
            txtAnalyzeBy:      document.getElementById('specAnalyzeBy').value,
            txtRepeat:         document.getElementById('specRepeat').value,
            txtDetail:         document.getElementById('specDetail').value
        };

        if (lineNo > 0) {
            _storeUpdateRow(tabName, lineNo, rowData);
        } else {
            _storeAddRow(tabName, rowData);
        }

        renderTable(tabName);
        bootstrap.Modal.getInstance(document.getElementById('modalSpecDetail')).hide();
    };

    // =========================================================
    //  LOV HANDLERS
    // =========================================================

    const openGenericLOV = function(title, columns, dataUrl, onSelectCallback) {

        // Ensure the LOV modal is a direct child of <body> so that CSS stacking
        // contexts from Vuexy's nested layout wrappers never affect its z-index.
        const lovEl = document.getElementById('modalLovGeneral');
        if (lovEl && lovEl.parentElement !== document.body) {
            document.body.appendChild(lovEl);
        }

        document.getElementById('lovGeneralTitle').innerText = title;
        
        if ($.fn.DataTable.isDataTable('#dtLovGeneral')) {
            $('#dtLovGeneral').DataTable().destroy();
        }
        $('#dtLovGeneral').empty();
        $('#dtLovGeneral').html('<thead class="bg-light"><tr id="lovGeneralHeaders"></tr></thead><tbody></tbody>');
        
        const tr = document.getElementById('lovGeneralHeaders');
        
        const actTh = document.createElement('th');
        actTh.innerText = 'Action';
        actTh.style.width = '80px';
        tr.appendChild(actTh);

        columns.forEach(col => {
            const th = document.createElement('th');
            th.innerText = col.title;
            tr.appendChild(th);
        });
        
        const dtLov = $('#dtLovGeneral').DataTable({
            data: [],
            columns: [
                { 
                    data: null, 
                    orderable: false,
                    className: 'text-center',
                    render: function(data, type, row) {
                        return `<button class="btn btn-sm btn-primary btnSelectLOV">Select</button>`;
                    }
                },
                ...columns.map(c => ({ data: c.data }))
            ],
            scrollX: true,
            destroy: true
        });
        
        // Mock data
        if (title.includes('Blending')) {
            dtLov.row.add({ DocNo: 'BS-001', ItemSpec: 'SPEC-BLEND-01', Ver: 1, ProductCode: 'PRD-B-1', Country: 'Indonesia' }).draw();
        } else if (title.includes('Packing')) {
            dtLov.row.add({ DocNo: 'PS-102', ItemSpec: 'SPEC-PACK-02', Ver: 2, ProductCode: 'PRD-P-2', SKU: 'SKU-BOX', UOM: 'KG' }).draw();
        } else if (title.includes('Production Site')) {
            dtLov.row.add({ Code: 'SITE-A', Desc: 'Factory Alpha' }).draw();
            dtLov.row.add({ Code: 'SITE-B', Desc: 'Factory Beta' }).draw();
        } else if (title.includes('GMO')) {
            dtLov.row.add({ Code: 'GMO-Free', Desc: 'GMO Free' }).draw();
            dtLov.row.add({ Code: 'Contains-GMO', Desc: 'Contains GMO' }).draw();
        } else if (title.includes('Category')) {
            dtLov.row.add({ Code: 'CAT01', Desc: 'Food Category 1' }).draw();
        } else if (title.includes('Business Representative')) {
            dtLov.row.add({ Code: 'EMP-001', Name: 'Rep A (Mock)' }).draw();
            dtLov.row.add({ Code: 'EMP-002', Name: 'Rep B (Mock)' }).draw();
        } else if (title.includes('Test Code')) {
            dtLov.row.add({ TestID: 1, TestCode: 'TC-001', TestClass: 'Physical', TestUnit: 'mg/kg', TestMethod: 'M-01', TestType: 'N' }).draw();
            dtLov.row.add({ TestID: 2, TestCode: 'TC-002', TestClass: 'Chemical', TestUnit: '%', TestMethod: 'M-02', TestType: 'N' }).draw();
            dtLov.row.add({ TestID: 3, TestCode: 'TC-003', TestClass: 'Microbiological', TestUnit: 'CFU/g', TestMethod: 'M-03', TestType: 'N' }).draw();
        }
        
        $('#dtLovGeneral tbody').off('click', '.btnSelectLOV');
        $('#dtLovGeneral tbody').on('click', '.btnSelectLOV', function() {
            const rowData = dtLov.row($(this).parents('tr')).data();
            onSelectCallback(rowData);
            $('#modalLovGeneral').modal('hide');
        });
        
        $('#modalLovGeneral').off('shown.bs.modal').on('shown.bs.modal', function () {
            // Adjust DataTable columns
            if ($.fn.DataTable.isDataTable('#dtLovGeneral')) {
                $('#dtLovGeneral').DataTable().columns.adjust();
            }

            // ── Z-INDEX FIX ───────────────────────────────────────────────
            // Vuexy uses --bs-modal-zindex: 1090  (not Bootstrap's 1055).
            // Count ALL visible modals including this LOV (class 'show' already
            // applied at shown event). If > 1, this LOV must be above the parent.
            const visibleModals = document.querySelectorAll('.modal.show');
            if (visibleModals.length > 1) {
                const newZ = 1090 + (visibleModals.length - 1) * 20; // e.g. 1110 for 2nd modal
                this.style.zIndex = newZ;

                // Elevate only the LAST backdrop above the parent modal
                const backdrops = document.querySelectorAll('.modal-backdrop');
                if (backdrops.length > 0) {
                    backdrops[backdrops.length - 1].style.zIndex = newZ - 5;
                }
            }
            // ─────────────────────────────────────────────────────────────
        });
        
        $('#modalLovGeneral').modal('show');
    };

    /**
     * LOV Test Code - digunakan oleh modal PD3 dan SpecDetail
     * @param {string} context - 'PD3' atau 'Spec'
     */
    const showLovTestCode = function(context) {
        openGenericLOV('Select Test Code', [
            { data: 'TestID', title: 'ID' },
            { data: 'TestCode', title: 'Test Code' },
            { data: 'TestClass', title: 'Test Class' },
            { data: 'TestUnit', title: 'Test Unit' },
            { data: 'TestMethod', title: 'Test Method' },
            { data: 'TestType', title: 'Test Type' }
        ], '', function(row) {
            const prefix = context === 'PD3' ? 'pd3' : 'spec';
            document.getElementById(prefix + 'TestID').value         = row.TestID;
            document.getElementById(prefix + 'TestCode').value       = row.TestCode;
            document.getElementById(prefix + 'TestClass').value      = row.TestClass;
            document.getElementById(prefix + 'TestUnit').value       = row.TestUnit;
            document.getElementById(prefix + 'TestMethodCode').value = row.TestMethod;
            document.getElementById(prefix + 'TestType').value       = row.TestType;
        });
    };

    const showLovBlendingSpec = function() {
        openGenericLOV('Select Blending Item Spec (APPROVED ONLY)', [
            { data: 'DocNo', title: 'Doc No' },
            { data: 'ItemSpec', title: 'Item Spec' },
            { data: 'Ver', title: 'Ver' },
            { data: 'ProductCode', title: 'Product Code' },
            { data: 'Country', title: 'Country' }
        ], '/api/LOV/BlendingSpec', function(row) {
            document.getElementById('txtItemSpecBlending').value = row.ItemSpec;
            document.getElementById('intVersionBlending').value  = row.Ver;
            document.getElementById('previewBlendProductCode').innerText = row.ProductCode;
            document.getElementById('previewBlendCountry').innerText     = row.Country;
            document.getElementById('txtCountry').value = row.Country;
            
            Swal.fire({
                title: 'Data Loaded', text: 'Extracted variables from ' + row.ItemSpec,
                icon: 'info', toast: true, position: 'top-end',
                showConfirmButton: false, timer: 3000
            });
        });
    };

    const showLovPackingSpec = function() {
        openGenericLOV('Select Packing Item Spec (APPROVED ONLY)', [
            { data: 'DocNo', title: 'Doc No' },
            { data: 'ItemSpec', title: 'Item Spec' },
            { data: 'Ver', title: 'Ver' },
            { data: 'ProductCode', title: 'Product Code' },
            { data: 'SKU', title: 'SKU' },
            { data: 'UOM', title: 'Primary UOM' }
        ], '/api/LOV/PackingSpec', function(row) {
            document.getElementById('txtItemSpecPacking').value = row.ItemSpec;
            document.getElementById('intVersionPacking').value  = row.Ver;
            document.getElementById('previewPackProductCode').innerText = row.ProductCode;
            document.getElementById('previewPackSKU').innerText         = row.SKU;
            document.getElementById('previewPackUOM').innerText         = row.UOM;
        });
    };

    const showLovItemCode = function() {
        openGenericLOV('Select Item Code', [
            { data: 'ItemCode', title: 'Item Code' },
            { data: 'Desc', title: 'Description' },
            { data: 'ItemType', title: 'Item Type' },
            { data: 'Spec', title: 'Item Spec' },
            { data: 'Template', title: 'Template' }
        ], '/api/LOV/ItemCode', function(row) {
            document.getElementById('txtItemCode').value    = row.ItemCode;
            document.getElementById('txtItemDesc').value    = row.Desc;
            document.getElementById('txtItemType').value    = row.ItemType;
            document.getElementById('txtItemSpec').value    = row.Spec;
            document.getElementById('txtSpecDescription').value = row.SpecDesc;
            document.getElementById('intVersion').value = 1;
            
            if (document.getElementById('decShelfLife')) {
                document.getElementById('decShelfLife').value = row.ShelfLife;
            }

            // Auto-populate Country
            document.getElementById('txtCountry').value = "Indonesia";

            const isFinishGood = row.ItemType.toLowerCase().includes('finish') || row.ItemType.toLowerCase().includes('intermediate');
            
            if (isFinishGood) {
                document.getElementById('txtBusinessRep').value = "Rep A (Mock)";
            } else {
                document.getElementById('txtBusinessRep').value = "";
            }

            toggleItemTypeBehavior(row.ItemType);
        });

        // Add mock data
        setTimeout(() => {
            const dt = $('#dtLovGeneral').DataTable();
            dt.clear();
            dt.row.add({ ItemCode: 'ITM-991', Desc: 'Sample Item Base', ItemType: 'Base', Spec: 'SPC-ITM-991', Template: 'TPL-1', SpecDesc: 'Sample Spec Base', ShelfLife: 12 }).draw();
            dt.row.add({ ItemCode: 'ITM-992', Desc: 'Sample Item Premix', ItemType: 'Premix', Spec: 'SPC-ITM-992', Template: 'TPL-1', SpecDesc: 'Sample Spec Premix', ShelfLife: 12 }).draw();
            dt.row.add({ ItemCode: 'ITM-101', Desc: 'Sample Item Finish Good', ItemType: 'Finish Good FG', Spec: 'SPC-ITM-101', Template: 'TPL-2', SpecDesc: 'Sample Spec FG', ShelfLife: 24 }).draw();
            dt.row.add({ ItemCode: 'ITM-102', Desc: 'Sample Item Intermediate', ItemType: 'Intermediate', Spec: 'SPC-ITM-102', Template: 'TPL-2', SpecDesc: 'Sample Spec Intermediate', ShelfLife: 24 }).draw();
        }, 100);
    };

    const toggleItemTypeBehavior = function(itemType) {
        const isBase = itemType.toLowerCase().includes('base') || itemType.toLowerCase().includes('premix');
        const refContainer = document.getElementById('refSpecsContainer');
        const btnCopyFrom  = document.getElementById('btnCopyFrom');

        if (isBase) {
            refContainer.style.opacity      = '0.5';
            refContainer.style.pointerEvents = 'none';
            document.getElementById('txtItemSpecBlending').value = '';
            document.getElementById('txtItemSpecPacking').value  = '';
            btnCopyFrom.classList.remove('d-none');
            toggleStep2Readonly(false);
        } else {
            refContainer.style.opacity      = '1';
            refContainer.style.pointerEvents = 'auto';
            btnCopyFrom.classList.add('d-none');
            toggleStep2Readonly(true);
        }
    };

    const toggleStep2Readonly = function(isReadonly) {
        const step2 = document.getElementById('step-2-detail');
        if (!step2) return;
        const els = step2.querySelectorAll('.card-body input, .card-body textarea, .card-body select, .tab-content input, .tab-content textarea, .tab-content select, .card-body button, .tab-content button');
        els.forEach(el => { el.disabled = isReadonly; });
    };

    const showLovCopyFrom = function() {
        openGenericLOV('Copy From Spec (Base/Premix)', [
            { data: 'DocNo', title: 'Doc No' },
            { data: 'ItemSpec', title: 'Item Spec' },
            { data: 'Desc', title: 'Spec Description' }
        ], '', function(row) {
            Swal.fire({ title: 'Copied!', text: `Parameters copied from ${row.ItemSpec}`, icon: 'success', timer: 2000, showConfirmButton: false });
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('dtDocDate').value          = today;
            document.getElementById('txtSpecDescription').value = row.Desc;
            document.getElementById('txtProductionSite').value  = "Factory Alpha (Mock Copied)";
            let nextMonth = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            document.getElementById('dtEffectiveDate').value = nextMonth.toISOString().split('T')[0];
            document.getElementById('bitInline').checked = true;
            document.getElementById('txtRemark').value = "Copied remark";
            if(document.getElementById('txtComposition'))     document.getElementById('txtComposition').value = "Copied Composition Details";
            if(document.getElementById('txtProductionMethod')) document.getElementById('txtProductionMethod').value = "Copied Method";
            if(document.getElementById('txtGMOStatusDesc'))    document.getElementById('txtGMOStatusDesc').value = "Contains GMO";
            if(document.getElementById('txtFoodCategoryDesc')) document.getElementById('txtFoodCategoryDesc').value = "Snack";
        });
        
        setTimeout(() => {
            const dt = $('#dtLovGeneral').DataTable();
            dt.clear();
            dt.row.add({ DocNo: 'NIS-2025-0099', ItemSpec: 'SPC-BASE-001', Desc: 'Existing Base Specification 001' }).draw();
            dt.row.add({ DocNo: 'NIS-2025-0105', ItemSpec: 'SPC-PRE-002', Desc: 'Existing Premix Specification 002' }).draw();
        }, 100);
    };

    const showLovProductionSite = function() {
        openGenericLOV('Select Production Site', [
            { data: 'Code', title: 'Site Code' },
            { data: 'Desc', title: 'Description' }
        ], '', function(row) {
            document.getElementById('txtProductionSite').value = row.Desc;
        });
    };

    const showLovCountry = function() {
        openGenericLOV('Select Country', [
            { data: 'Code', title: 'Country Code' },
            { data: 'Desc', title: 'Country Name' }
        ], '', function(row) {
            document.getElementById('txtCountry').value = row.Desc;
        });
    };

    const showLovGmoStatus = function() {
        openGenericLOV('Select GMO Status', [
            { data: 'Code', title: 'Code' },
            { data: 'Desc', title: 'Description' }
        ], '', function(row) {
            document.getElementById('txtGMOStatusDesc').value = row.Desc;
        });
    };

    const showLovFoodCategory = function() {
        openGenericLOV('Select Food Category', [
            { data: 'Code', title: 'Category Code' },
            { data: 'Desc', title: 'Description' }
        ], '', function(row) {
            document.getElementById('txtFoodCategoryDesc').value = row.Desc;
        });
    };

    const showLovBusRep = function() {
        openGenericLOV('Select Business Representative', [
            { data: 'Code', title: 'Emp Code' },
            { data: 'Name', title: 'Name' }
        ], '', function(row) {
            document.getElementById('txtBusinessRep').value = row.Name;
        });
    };

    // =========================================================
    //  PUBLIC API
    // =========================================================

    return {
        init,
        nextStep1,
        prevStep,
        submitStep,
        
        saveHeader,
        submitOracle,
        returnDoc,
        cancelDoc,
        
        // CRUD actions
        showAddModal,
        savePD2,
        savePD3,
        saveSpecDetail,
        editRow,
        deleteRow,

        // LOVs
        showLovBlendingSpec,
        showLovPackingSpec,
        showLovItemCode,
        showLovProductionSite,
        showLovCountry,
        showLovGmoStatus,
        showLovFoodCategory,
        showLovCopyFrom,
        showLovBusRep,
        showLovTestCode,

        // Utilities
        renderTable
    };

})();

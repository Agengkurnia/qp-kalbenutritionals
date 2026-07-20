/**
 * NewItemSpecStore.js
 * In-memory data store (mock backend) untuk New Item Spec Detail
 * Struktur data mengacu pada KN2017_FORMULATION NewItemSpec
 */

const NewItemSpecStore = (function () {

    // =========================================================
    //  INITIAL EMPTY STATE
    // =========================================================

    const _emptyState = () => ({
        header: {
            intSystemNo: 0,
            txtDocNo: '',
            txtDocStatus: '00',
            dtDocDate: '',
            txtItemCode: '',
            txtItemDesc: '',
            txtItemType: '',
            txtItemSpec: '',
            txtSpecDescription: '',
            intVersion: 1,
            txtCountry: '',
            txtBussinessPartnerRep: '',
            intSystemNoBlending: 0,
            txtItemSpecBlending: '',
            intVersionBlending: 0,
            intSystemNoPacking: 0,
            txtItemSpecPacking: '',
            intVersionPacking: 0,
            txtProductionSite: '',
            dtEffectiveDate: '',
            bitInline: false,
            txtRemark: '',
            txtSpecType: 'I',
            txtCreateBy: 'MOCK_USER',
            dtCreateDate: new Date().toISOString().split('T')[0]
        },
        productDescription1: {
            txtComposition: '',
            txtProductionMethod: '',
            txtPreservationMethod: '',
            txtDistributionMethod: '',
            txtStorageCondition: '',
            decShelfLife: null,
            txtSpecificLabel: '',
            txtPreparationSuggestion: '',
            txtPacking: '',
            txtGMOStatusDesc: '',
            txtFoodCategoryDesc: '',
            // Allergens
            chkAlgnCereal: false,
            chkAlgnCrustaceae: false,
            chkAlgnEgg: false,
            chkAlgnMilk: false,
            chkAlgnFish: false,
            chkAlgnTree: false,
            chkAlgnPeanuts: false,
            chkAlgnSulphite: false,
            chkAlgnSoybeans: false,
            chkAlgnGlutenRefiningProcess: false,
            chkAlgnFishRefiningProcess: false,
            chkAlgnSoybeansRefiningProcess: false,
            chkAlgnNotContainAllergen: false
        },
        productDescription2: [],    // Intended Use (PD2)
        productDescription3: [],    // Net Weight/Volume (PD3)
        inProcess: [],
        organoleptic: [],
        physical: [],
        chemical: [],
        microbiological: [],
        heavyMetals: [],
        mycotoxin: [],
        pesticide: [],
        antibiotics: [],
        foreignMatter: []
    });

    // =========================================================
    //  CURRENT STATE (runtime)
    // =========================================================

    let _state = _emptyState();

    // =========================================================
    //  HELPER UTILITIES
    // =========================================================

    const _getNextLineNo = function (arr) {
        if (!arr || arr.length === 0) return 1;
        return Math.max(...arr.map(r => r.intLineNo || 0)) + 1;
    };

    const _getArrayByTab = function (tabName) {
        const map = {
            'PD2':           'productDescription2',
            'PD3':           'productDescription3',
            'InProcess':     'inProcess',
            'Organoleptic':  'organoleptic',
            'Physical':      'physical',
            'Chemical':      'chemical',
            'Microbiological':'microbiological',
            'HeavyMetals':   'heavyMetals',
            'Mycotoxin':     'mycotoxin',
            'Pesticide':     'pesticide',
            'Antibiotics':   'antibiotics',
            'ForeignMatter': 'foreignMatter'
        };
        return map[tabName] || null;
    };

    // =========================================================
    //  PERSISTENCE (localStorage)
    // =========================================================

    const saveToLocalStorage = function () {
        try {
            localStorage.setItem('NIS_MOCK_DATA', JSON.stringify(_state));
        } catch (e) {
            console.warn('LocalStorage save failed:', e);
        }
    };

    const loadFromLocalStorage = function () {
        try {
            const saved = localStorage.getItem('NIS_MOCK_DATA');
            if (saved) {
                _state = JSON.parse(saved);
                console.log('[Store] Loaded from localStorage.');
                return true;
            }
        } catch (e) {
            console.warn('LocalStorage load failed:', e);
        }
        return false;
    };

    const clearLocalStorage = function () {
        localStorage.removeItem('NIS_MOCK_DATA');
    };

    // =========================================================
    //  RESET
    // =========================================================

    const reset = function () {
        _state = _emptyState();
        clearLocalStorage();
        console.log('[Store] State reset.');
    };

    // =========================================================
    //  HEADER & PRODUCT DESCRIPTION 1
    // =========================================================

    const getHeader = function () { return _state.header; };

    const setHeader = function (headerObj) {
        Object.assign(_state.header, headerObj);
    };

    const getProductDescription1 = function () { return _state.productDescription1; };

    const setProductDescription1 = function (pd1Obj) {
        Object.assign(_state.productDescription1, pd1Obj);
    };

    // =========================================================
    //  GENERIC CRUD FOR ALL TAB ARRAYS
    // =========================================================

    /**
     * Ambil semua baris dari tab tertentu
     * @param {string} tabName - nama tab (e.g. 'PD2', 'InProcess', dll.)
     */
    const getRows = function (tabName) {
        const key = _getArrayByTab(tabName);
        if (!key) { console.error('[Store] Unknown tabName:', tabName); return []; }
        return _state[key];
    };

    /**
     * Tambah satu baris ke tab tertentu
     * @param {string} tabName
     * @param {object} rowData - objek data baris (tanpa intLineNo, akan di-generate)
     * @returns {object} baris yang ditambahkan (dengan lineNo-nya)
     */
    const addRow = function (tabName, rowData) {
        const key = _getArrayByTab(tabName);
        if (!key) { console.error('[Store] Unknown tabName:', tabName); return null; }

        const arr = _state[key];
        const newRow = Object.assign({}, rowData, { intLineNo: _getNextLineNo(arr) });
        arr.push(newRow);
        saveToLocalStorage();
        console.log(`[Store] Added to ${tabName}:`, newRow);
        return newRow;
    };

    /**
     * Update baris berdasarkan intLineNo
     * @param {string} tabName
     * @param {number} lineNo
     * @param {object} updatedData
     * @returns {boolean}
     */
    const updateRow = function (tabName, lineNo, updatedData) {
        const key = _getArrayByTab(tabName);
        if (!key) { console.error('[Store] Unknown tabName:', tabName); return false; }

        const arr = _state[key];
        const idx = arr.findIndex(r => r.intLineNo === lineNo);
        if (idx === -1) { console.error('[Store] Row not found:', lineNo); return false; }

        arr[idx] = Object.assign({}, arr[idx], updatedData, { intLineNo: lineNo });
        saveToLocalStorage();
        console.log(`[Store] Updated ${tabName} line ${lineNo}:`, arr[idx]);
        return true;
    };

    /**
     * Hapus baris berdasarkan intLineNo
     * @param {string} tabName
     * @param {number} lineNo
     * @returns {boolean}
     */
    const deleteRow = function (tabName, lineNo) {
        const key = _getArrayByTab(tabName);
        if (!key) { console.error('[Store] Unknown tabName:', tabName); return false; }

        const arr = _state[key];
        const idx = arr.findIndex(r => r.intLineNo === lineNo);
        if (idx === -1) { console.error('[Store] Row not found:', lineNo); return false; }

        arr.splice(idx, 1);
        saveToLocalStorage();
        console.log(`[Store] Deleted from ${tabName} line ${lineNo}`);
        return true;
    };

    /**
     * Ambil satu baris berdasarkan intLineNo
     * @param {string} tabName
     * @param {number} lineNo
     * @returns {object|null}
     */
    const getRow = function (tabName, lineNo) {
        const key = _getArrayByTab(tabName);
        if (!key) return null;
        return _state[key].find(r => r.intLineNo === lineNo) || null;
    };

    // =========================================================
    //  PUBLIC API
    // =========================================================

    return {
        reset,
        saveToLocalStorage,
        loadFromLocalStorage,

        getHeader,
        setHeader,
        getProductDescription1,
        setProductDescription1,

        getRows,
        getRow,
        addRow,
        updateRow,
        deleteRow
    };

})();

/**
 * MKPP localStorage store — schema HDR + ACT + SUP + BGT + SUB
 */
const MkppStore = {
    STORAGE_KEY: 'df_kicao_mkpp_v1',
    STATUS: {
        DRAFT: 'Draft',
        WAITING_APPROVAL: 'Waiting Approval',
        APPROVED: 'Approved',
        REJECTED: 'Rejected',
        WAITING_TO_CLOSE: 'Waiting To Close',
        CLOSED: 'Closed',
        CANCELLED: 'Cancelled'
    },

    uid: function (prefix) {
        return (prefix || 'id') + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
    },

    todayStr: function () {
        const d = new Date();
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        return dd + '/' + mm + '/' + d.getFullYear();
    },

    todayIso: function () {
        return new Date().toISOString().slice(0, 10);
    },

    blankSupplier: function () {
        return { id: this.uid('sup'), accountSite: '', accountName: '', kam: '', active: true };
    },

    blankSubbrand: function () {
        return { id: this.uid('sub'), subUmbrand: '', amount: 0, reserved: 0, available: 0 };
    },

    blankBudget: function () {
        return {
            id: this.uid('bgt'),
            department: '',
            coa: '',
            alokasi: 0,
            subtotal: 0,
            dolphineRef: '',
            subbrands: []
        };
    },

    blankActivity: function () {
        return {
            id: this.uid('act'),
            code: '',
            name: '',
            periodFrom: '',
            periodTo: '',
            amount: 0,
            target: 0,
            suppliers: [],
            budgets: [],
            attachments: []
        };
    },

    normalizeDoc: function (raw) {
        if (!raw || typeof raw !== 'object') return this.createNew();
        const doc = Object.assign({}, raw);
        doc.id = doc.id || this.uid('doc');
        doc.docNo = doc.docNo || '';
        doc.date = doc.date || this.todayStr();
        doc.refDocNo = doc.refDocNo || '';
        doc.status = doc.status || this.STATUS.DRAFT;
        if (doc.status === 'Submitted') doc.status = this.STATUS.WAITING_APPROVAL;
        doc.groupAccount = doc.groupAccount || '';
        doc.onoDocNo = doc.onoDocNo || '';
        doc.budgetType = doc.budgetType || 'DF — Development Fund';
        doc.postingDate = doc.postingDate || this.todayIso();
        doc.programDesc = doc.programDesc || '';
        doc.mekanisme = doc.mekanisme || '';
        doc.remark = doc.remark || '';
        doc.attachments = Array.isArray(doc.attachments) ? doc.attachments : [];
        doc.bosnet = !!doc.bosnet;
        doc.bosnetPush = !!doc.bosnetPush;
        doc.bosnetStatus = doc.bosnetStatus || '';
        doc.bosnetNote = doc.bosnetNote || '';
        doc.bosnetLog = Array.isArray(doc.bosnetLog) ? doc.bosnetLog : [];
        doc.activities = Array.isArray(doc.activities) ? doc.activities.map(a => this.normalizeActivity(a)) : [];
        doc.updatedAt = doc.updatedAt || new Date().toISOString();
        return doc;
    },

    normalizeActivity: function (a) {
        const act = Object.assign({}, this.blankActivity(), a || {});
        act.id = act.id || this.uid('act');
        act.suppliers = Array.isArray(act.suppliers) ? act.suppliers : [];
        act.budgets = Array.isArray(act.budgets)
            ? act.budgets.map(b => {
                const bg = Object.assign({}, this.blankBudget(), b || {});
                bg.id = bg.id || this.uid('bgt');
                bg.subbrands = Array.isArray(bg.subbrands) ? bg.subbrands : [];
                return bg;
            })
            : [];
        act.attachments = Array.isArray(act.attachments) ? act.attachments : [];
        act.amount = Number(act.amount) || 0;
        act.target = Number(act.target) || 0;
        return act;
    },

    buildSeed: function () {
        const act = this.blankActivity();
        act.code = 'DF-ACT-01';
        act.name = 'Listing Claim Support — Medan';
        act.periodFrom = '2026-07-01';
        act.periodTo = '2026-07-31';
        act.amount = 15000000;
        act.target = 100;
        const sup = this.blankSupplier();
        sup.accountSite = 'ADYAJATI-MEDAN';
        sup.accountName = 'PT. Adyajati Lestari';
        sup.kam = 'KAM-MDN-01';
        act.suppliers = [sup];
        const bgt = this.blankBudget();
        bgt.department = 'Trade Marketing';
        bgt.coa = '5101001';
        bgt.alokasi = 15000000;
        bgt.subtotal = 15000000;
        bgt.dolphineRef = '';
        const sub = this.blankSubbrand();
        sub.subUmbrand = 'MORINAGA';
        sub.amount = 15000000;
        sub.reserved = 0;
        sub.available = 15000000;
        bgt.subbrands = [sub];
        act.budgets = [bgt];

        return this.normalizeDoc({
            id: 'seed-1',
            docNo: 'MKPP-DF-202607-001',
            date: '01/07/2026',
            refDocNo: '',
            status: this.STATUS.DRAFT,
            groupAccount: 'PT. Adyajati Lestari Group',
            onoDocNo: '',
            budgetType: 'DF — Development Fund',
            postingDate: '2026-07-01',
            programDesc: 'Prototype memo activity Development Fund — Subdist Medan (Adyajati).',
            mekanisme: 'Potong saldo BI per mapping subdist aktif; klaim via Monitoring Claim EPM.',
            remark: 'Seed dokumen untuk demo prototype DF.',
            activities: [act],
            updatedAt: new Date().toISOString()
        });
    },

    loadAll: function () {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        if (raw) {
            try {
                const data = JSON.parse(raw);
                if (Array.isArray(data)) {
                    const list = data.map(d => this.normalizeDoc(d));
                    this.saveAll(list);
                    return list;
                }
            } catch (e) { /* reseed */ }
        }
        const seed = [this.buildSeed()];
        this.saveAll(seed);
        return seed;
    },

    saveAll: function (list) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    },

    list: function () {
        return this.loadAll().slice().sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
    },

    get: function (id) {
        return this.loadAll().find(d => d.id === id || d.docNo === id) || null;
    },

    nextDocNo: function () {
        const list = this.loadAll();
        const ym = this.todayIso().slice(0, 7).replace('-', '');
        const prefix = 'MKPP-DF-' + ym + '-';
        let max = 0;
        list.forEach(d => {
            if (d.docNo && d.docNo.indexOf(prefix) === 0) {
                const n = parseInt(d.docNo.slice(prefix.length), 10);
                if (!isNaN(n) && n > max) max = n;
            }
        });
        return prefix + String(max + 1).padStart(3, '0');
    },

    createNew: function () {
        return this.normalizeDoc({
            id: this.uid('doc'),
            docNo: this.nextDocNo(),
            date: this.todayStr(),
            status: this.STATUS.DRAFT,
            budgetType: 'DF — Development Fund',
            postingDate: this.todayIso(),
            activities: []
        });
    },

    totalAmount: function (doc) {
        if (!doc || !Array.isArray(doc.activities)) return 0;
        return doc.activities.reduce((s, a) => s + (Number(a.amount) || 0), 0);
    },

    validate: function (doc, opts) {
        opts = opts || {};
        const strict = opts.strict !== false;
        if (!doc.budgetType || !String(doc.budgetType).trim()) return 'Budget Type wajib diisi';
        if (!doc.groupAccount || !String(doc.groupAccount).trim()) return 'Group Account wajib diisi';
        if (!doc.programDesc || !String(doc.programDesc).trim()) return 'Program Description wajib diisi';
        if (!doc.mekanisme || !String(doc.mekanisme).trim()) return 'Mekanisme Program wajib diisi';
        if (!doc.remark || !String(doc.remark).trim()) return 'Remark wajib diisi';
        if (strict) {
            if (!doc.activities || !doc.activities.length) return 'Detail Aktifitas harus di isi';
            for (let i = 0; i < doc.activities.length; i++) {
                const a = doc.activities[i];
                if (!(Number(a.amount) > 0)) return 'Nilai Aktifitas tidak boleh kosong (baris ' + (i + 1) + ')';
                if (!a.suppliers || !a.suppliers.length) return 'Detail Supplier harus di isi (activity ' + (i + 1) + ')';
            }
        }
        return null;
    },

    save: function (doc, opts) {
        const normalized = this.normalizeDoc(doc);
        const err = this.validate(normalized, opts);
        if (err) return { ok: false, message: err };
        normalized.updatedAt = new Date().toISOString();
        if (!normalized.status) normalized.status = this.STATUS.DRAFT;
        const list = this.loadAll();
        const idx = list.findIndex(d => d.id === normalized.id);
        if (idx >= 0) list[idx] = normalized;
        else list.push(normalized);
        this.saveAll(list);
        return { ok: true, doc: normalized };
    },

    upsert: function (doc) {
        const normalized = this.normalizeDoc(doc);
        normalized.updatedAt = new Date().toISOString();
        const list = this.loadAll();
        const idx = list.findIndex(d => d.id === normalized.id || d.docNo === normalized.docNo);
        if (idx >= 0) {
            normalized.id = list[idx].id;
            list[idx] = normalized;
        } else {
            list.push(normalized);
        }
        this.saveAll(list);
        return normalized;
    },

    updateStatus: function (id, status, extra) {
        const list = this.loadAll();
        const idx = list.findIndex(d => d.id === id || d.docNo === id);
        if (idx < 0) return { ok: false, message: 'Dokumen tidak ditemukan' };
        list[idx].status = status;
        if (extra) Object.assign(list[idx], extra);
        list[idx].updatedAt = new Date().toISOString();
        this.saveAll(list);
        return { ok: true, doc: list[idx] };
    },

    listByStatus: function (status) {
        return this.loadAll().filter(d => d.status === status);
    }
};

window.MkppStore = MkppStore;

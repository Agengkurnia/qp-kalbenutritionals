/**
 * BOSNET mock simulator for MKPP prototype
 */
const MkppBosnet = {
    FAIL_RATE_KEY: 'df_kicao_bosnet_fail_rate',

    getFailRate: function () {
        const v = parseFloat(localStorage.getItem(this.FAIL_RATE_KEY));
        if (isNaN(v)) return 0.3;
        return Math.min(1, Math.max(0, v));
    },

    setFailRate: function (rate) {
        localStorage.setItem(this.FAIL_RATE_KEY, String(rate));
    },

    shouldFail: function () {
        return Math.random() < this.getFailRate();
    },

    pushLog: function (doc, action, ok, message) {
        doc.bosnetLog = Array.isArray(doc.bosnetLog) ? doc.bosnetLog : [];
        doc.bosnetLog.unshift({
            at: new Date().toISOString(),
            action: action,
            ok: !!ok,
            message: message || ''
        });
        if (doc.bosnetLog.length > 30) doc.bosnetLog = doc.bosnetLog.slice(0, 30);
    },

    pushOpen: function (doc) {
        const fail = this.shouldFail();
        if (fail) {
            doc.bosnet = false;
            doc.bosnetPush = false;
            doc.bosnetStatus = 'OPEN_FAILED';
            doc.bosnetNote = 'Mock BOSNET open gagal';
            this.pushLog(doc, 'OPEN', false, doc.bosnetNote);
            return { ok: false, doc: doc, message: doc.bosnetNote };
        }
        doc.bosnet = true;
        doc.bosnetPush = true;
        doc.bosnetStatus = 'OPEN_OK';
        doc.bosnetNote = 'Mock BOSNET open sukses';
        this.pushLog(doc, 'OPEN', true, doc.bosnetNote);
        return { ok: true, doc: doc, message: doc.bosnetNote };
    },

    pushClose: function (doc) {
        const fail = this.shouldFail();
        if (fail) {
            doc.bosnetStatus = 'CLOSE_FAILED';
            doc.bosnetNote = 'Mock BOSNET close gagal — dokumen Waiting To Close';
            this.pushLog(doc, 'CLOSE', false, doc.bosnetNote);
            return { ok: false, doc: doc, message: doc.bosnetNote };
        }
        doc.bosnetStatus = 'CLOSE_OK';
        doc.bosnetNote = 'Mock BOSNET close sukses';
        doc.bosnetPush = false;
        this.pushLog(doc, 'CLOSE', true, doc.bosnetNote);
        return { ok: true, doc: doc, message: doc.bosnetNote };
    },

    pushAddendum: function (doc) {
        const fail = this.shouldFail();
        if (fail) {
            doc.bosnetStatus = 'ADDENDUM_FAILED';
            doc.bosnetNote = 'Mock BOSNET addendum gagal';
            this.pushLog(doc, 'ADDENDUM', false, doc.bosnetNote);
            return { ok: false, doc: doc, message: doc.bosnetNote };
        }
        doc.bosnetStatus = 'ADDENDUM_OK';
        doc.bosnetNote = 'Mock BOSNET addendum sukses';
        this.pushLog(doc, 'ADDENDUM', true, doc.bosnetNote);
        return { ok: true, doc: doc, message: doc.bosnetNote };
    },

    /** Close document: success → Closed; fail → Waiting To Close */
    closeDocument: function (doc) {
        const res = this.pushClose(doc);
        if (res.ok) {
            doc.status = MkppStore.STATUS.CLOSED;
        } else {
            doc.status = MkppStore.STATUS.WAITING_TO_CLOSE;
        }
        return { ok: res.ok, doc: doc, message: res.message };
    },

    runCloseJob: function () {
        const waiting = MkppStore.listByStatus(MkppStore.STATUS.WAITING_TO_CLOSE);
        const results = [];
        waiting.forEach(doc => {
            const res = this.closeDocument(doc);
            MkppStore.upsert(res.doc);
            results.push({
                docNo: res.doc.docNo,
                ok: res.ok,
                status: res.doc.status,
                message: res.message
            });
        });
        return results;
    }
};

window.MkppBosnet = MkppBosnet;

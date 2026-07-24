/**
 * MKPP Close Uploader — batch close by Doc No CSV
 */
const MkppCloseUploader = {
    rows: [],

    parseCsv: function (text) {
        const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        if (!lines.length) return [];
        const first = lines[0].toUpperCase();
        const start = (first.indexOf('DOC') >= 0 || first.indexOf('MKPP') >= 0) ? 1 : 0;
        const docs = [];
        for (let i = start; i < lines.length; i++) {
            const col = lines[i].split(/[,;\t]/)[0].replace(/"/g, '').trim();
            if (col) docs.push(col);
        }
        return docs;
    },

    preview: function (docNos) {
        this.rows = docNos.map(docNo => {
            const doc = MkppStore.get(docNo);
            if (!doc) {
                return { docNo: docNo, status: 'ERROR', message: 'Tidak ditemukan', resultStatus: '' };
            }
            if (doc.status !== MkppStore.STATUS.APPROVED && doc.status !== MkppStore.STATUS.WAITING_TO_CLOSE) {
                return {
                    docNo: docNo,
                    status: 'SKIP',
                    message: 'Status harus Approved / Waiting To Close (sekarang: ' + doc.status + ')',
                    resultStatus: doc.status
                };
            }
            return { docNo: docNo, status: 'READY', message: 'Siap di-close', resultStatus: doc.status };
        });
        return this.rows;
    },

    process: function () {
        const results = [];
        this.rows.forEach(row => {
            if (row.status !== 'READY') {
                results.push(row);
                return;
            }
            const doc = MkppStore.get(row.docNo);
            if (!doc) {
                row.status = 'ERROR';
                row.message = 'Tidak ditemukan saat process';
                results.push(row);
                return;
            }
            const res = MkppBosnet.closeDocument(doc);
            MkppStore.upsert(res.doc);
            row.status = res.ok ? 'CLOSED' : 'WAITING';
            row.message = res.message;
            row.resultStatus = res.doc.status;
            results.push(row);
        });
        this.rows = results;
        return results;
    },

    downloadTemplate: function () {
        const sample = 'MKPP DOCNO\r\nMKPP-DF-202607-001\r\n';
        const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'CloseMKPP_template.csv';
        a.click();
    }
};

window.MkppCloseUploader = MkppCloseUploader;

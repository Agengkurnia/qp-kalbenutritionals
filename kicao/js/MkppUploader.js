/**
 * MKPP Excel/CSV uploader — client-side mock
 */
const MkppUploader = {
    TEMPLATE_HEADERS: [
        'MKPP PARENT DOCNO',
        'GROUP ACCOUNT',
        'BUDGET TYPE',
        'POSTING DATE',
        'PROGRAM DESCRIPTION',
        'MEKANISME PROGRAM',
        'REMARK',
        'ACTIVITY',
        'PERIOD FROM',
        'PERIOD TO',
        'BUDGET',
        'REFF DOCNO DOLPHINE',
        'SUBUMBRAND',
        'AMOUNT'
    ],

    rows: [],

    downloadTemplateCsv: function () {
        const sample = [
            this.TEMPLATE_HEADERS.join(','),
            [
                '',
                'PT. Adyajati Lestari Group',
                'DF — Development Fund',
                '2026-07-01',
                'Upload demo DF Medan',
                'Potong saldo BI mapping aktif',
                'Dari uploader prototype',
                'DF-ACT-UP-01',
                '2026-07-01',
                '2026-07-31',
                'Trade Marketing',
                '',
                'MORINAGA',
                '5000000'
            ].map(c => '"' + String(c).replace(/"/g, '""') + '"').join(',')
        ].join('\r\n');
        const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'UploadMKPP_template.csv';
        a.click();
    },

    downloadTemplateXlsx: function () {
        if (typeof XLSX === 'undefined') {
            this.downloadTemplateCsv();
            return;
        }
        const wb = XLSX.utils.book_new();
        const data = [
            this.TEMPLATE_HEADERS,
            [
                '', 'PT. Adyajati Lestari Group', 'DF — Development Fund', '2026-07-01',
                'Upload demo DF Medan', 'Potong saldo BI mapping aktif', 'Dari uploader prototype',
                'DF-ACT-UP-01', '2026-07-01', '2026-07-31', 'Trade Marketing', '', 'MORINAGA', 5000000
            ]
        ];
        const ws = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'UploadMKPP_template.xlsx');
    },

    parseCsvText: function (text) {
        const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter(l => l.trim());
        if (!lines.length) return [];
        const parseLine = (line) => {
            const out = [];
            let cur = '';
            let q = false;
            for (let i = 0; i < line.length; i++) {
                const ch = line[i];
                if (ch === '"') {
                    if (q && line[i + 1] === '"') { cur += '"'; i++; }
                    else q = !q;
                } else if (ch === ',' && !q) {
                    out.push(cur); cur = '';
                } else cur += ch;
            }
            out.push(cur);
            return out;
        };
        const headers = parseLine(lines[0]).map(h => h.trim().toUpperCase());
        const rows = [];
        for (let r = 1; r < lines.length; r++) {
            const cols = parseLine(lines[r]);
            const obj = {};
            headers.forEach((h, i) => { obj[h] = (cols[i] || '').trim(); });
            rows.push(obj);
        }
        return rows;
    },

    parseFile: function (file, cb) {
        const self = this;
        const name = (file.name || '').toLowerCase();
        if (name.endsWith('.csv') || name.endsWith('.txt')) {
            const reader = new FileReader();
            reader.onload = function () {
                cb(null, self.parseCsvText(String(reader.result || '')));
            };
            reader.onerror = function () { cb(new Error('Gagal baca file')); };
            reader.readAsText(file);
            return;
        }
        if (typeof XLSX === 'undefined') {
            cb(new Error('SheetJS tidak tersedia. Gunakan CSV atau pastikan CDN XLSX ter-load.'));
            return;
        }
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const wb = XLSX.read(e.target.result, { type: 'array' });
                const sheet = wb.Sheets[wb.SheetNames[0]];
                const json = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });
                const rows = json.map(row => {
                    const o = {};
                    Object.keys(row).forEach(k => {
                        o[String(k).trim().toUpperCase()] = String(row[k] == null ? '' : row[k]).trim();
                    });
                    return o;
                });
                cb(null, rows);
            } catch (err) {
                cb(err);
            }
        };
        reader.readAsArrayBuffer(file);
    },

    validateRow: function (row, idx) {
        const msg = [];
        if (!row['GROUP ACCOUNT']) msg.push('GROUP ACCOUNT kosong');
        if (!row['ACTIVITY']) msg.push('ACTIVITY kosong');
        if (!(Number(String(row['AMOUNT']).replace(/,/g, '')) > 0)) msg.push('AMOUNT invalid');
        return {
            rowIndex: idx + 1,
            raw: row,
            status: msg.length ? 'ERROR' : 'OK',
            message: msg.join('; ') || 'Valid'
        };
    },

    preview: function (rawRows) {
        this.rows = rawRows.map((r, i) => this.validateRow(r, i));
        return this.rows;
    },

    process: function () {
        const okRows = this.rows.filter(r => r.status === 'OK');
        if (!okRows.length) return { ok: false, message: 'Tidak ada baris valid', created: [] };

        // Group by header fields
        const groups = {};
        okRows.forEach(item => {
            const r = item.raw;
            const key = [
                r['MKPP PARENT DOCNO'] || '',
                r['GROUP ACCOUNT'] || '',
                r['BUDGET TYPE'] || 'DF — Development Fund',
                r['POSTING DATE'] || '',
                r['PROGRAM DESCRIPTION'] || '',
                r['MEKANISME PROGRAM'] || '',
                r['REMARK'] || ''
            ].join('||');
            if (!groups[key]) groups[key] = { header: r, lines: [] };
            groups[key].lines.push(r);
        });

        const created = [];
        Object.keys(groups).forEach(key => {
            const g = groups[key];
            const h = g.header;
            const doc = MkppStore.createNew();
            doc.refDocNo = h['MKPP PARENT DOCNO'] || '';
            doc.groupAccount = h['GROUP ACCOUNT'] || '';
            doc.budgetType = h['BUDGET TYPE'] || 'DF — Development Fund';
            doc.postingDate = this.normalizeDate(h['POSTING DATE']) || MkppStore.todayIso();
            doc.programDesc = h['PROGRAM DESCRIPTION'] || 'Uploaded via MKPP Uploader';
            doc.mekanisme = h['MEKANISME PROGRAM'] || '-';
            doc.remark = h['REMARK'] || 'Uploader';
            doc.status = MkppStore.STATUS.DRAFT;
            doc.activities = g.lines.map(line => {
                const act = MkppStore.blankActivity();
                act.code = line['ACTIVITY'] || '';
                act.name = line['ACTIVITY'] || '';
                act.periodFrom = this.normalizeDate(line['PERIOD FROM']);
                act.periodTo = this.normalizeDate(line['PERIOD TO']);
                act.amount = Number(String(line['AMOUNT']).replace(/,/g, '')) || 0;
                const sup = MkppStore.blankSupplier();
                sup.accountSite = doc.groupAccount;
                sup.accountName = doc.groupAccount;
                sup.kam = 'UPLOAD';
                act.suppliers = [sup];
                const bgt = MkppStore.blankBudget();
                bgt.department = line['BUDGET'] || 'Trade Marketing';
                bgt.alokasi = act.amount;
                bgt.subtotal = act.amount;
                bgt.dolphineRef = line['REFF DOCNO DOLPHINE'] || '';
                const sub = MkppStore.blankSubbrand();
                sub.subUmbrand = line['SUBUMBRAND'] || 'GENERAL';
                sub.amount = act.amount;
                sub.available = act.amount;
                bgt.subbrands = [sub];
                act.budgets = [bgt];
                return act;
            });
            MkppStore.upsert(doc);
            created.push(doc.docNo);
            okRows.forEach(item => {
                if (groups[key].lines.indexOf(item.raw) >= 0) {
                    item.status = 'PROCESSED';
                    item.message = 'Created ' + doc.docNo;
                }
            });
        });

        return { ok: true, message: 'Created ' + created.length + ' dokumen', created: created };
    },

    normalizeDate: function (v) {
        if (!v) return '';
        const s = String(v).trim();
        if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
        const m = s.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/);
        if (m) {
            let y = m[3];
            if (y.length === 2) y = '20' + y;
            return y + '-' + String(m[2]).padStart(2, '0') + '-' + String(m[1]).padStart(2, '0');
        }
        return s;
    }
};

window.MkppUploader = MkppUploader;

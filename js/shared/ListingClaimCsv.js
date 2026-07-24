/**
 * Client-side parser for LISTING_CLAIM CSV (delimiter ~).
 * Same shape as Monitoring Claim EPM extract.
 */
const ListingClaimCsv = {
    AMOUNT_FIELDS: ['RP_LUMPSUM', 'RP_EDPH_PRIN', 'RP_EDPF_PRIN', 'RP_PROMOSI', 'RP_EDHL', 'RP_BONUS'],

    /**
     * @param {string} text raw CSV
     * @returns {{ headers: string[], rows: object[], delimiter: string }}
     */
    parse: function (text) {
        const raw = String(text || '').replace(/^\uFEFF/, '');
        const lines = raw.split(/\r?\n/).filter(l => l.trim().length);
        if (!lines.length) {
            return { headers: [], rows: [], delimiter: '~' };
        }
        const delim = (lines[0].split('~').length > lines[0].split(',').length) ? '~' : ',';
        const headers = lines[0].split(delim).map(h => h.trim());
        const rows = [];
        for (let i = 1; i < lines.length; i++) {
            const parts = lines[i].split(delim);
            if (parts.length < 2) continue;
            const obj = {};
            headers.forEach((h, idx) => {
                obj[h] = (parts[idx] != null ? String(parts[idx]).trim() : '');
            });
            rows.push(obj);
        }
        return { headers: headers, rows: rows, delimiter: delim };
    },

    rowAmount: function (row) {
        let sum = 0;
        this.AMOUNT_FIELDS.forEach(f => {
            const v = row[f];
            if (v == null || v === '') return;
            const n = Number(String(v).replace(/,/g, ''));
            if (!isNaN(n)) sum += n;
        });
        return sum;
    },

    MON_MAP: {
        JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6,
        JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12
    },

    /**
     * Normalize TRX_DATE-like values to YYYY-MM-DD if possible.
     * Supports: yyyy-mm-dd, dd/mm/yyyy, yyyymmdd, Oracle DD-MON-YY / DD-MON-YYYY (e.g. 10-APR-26).
     */
    normalizeTrxDate: function (v) {
        if (!v) return '';
        const s = String(v).trim().toUpperCase();
        // yyyy-mm-dd
        if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
        // Oracle: 10-APR-26 or 10-APR-2026
        const ora = s.match(/^(\d{1,2})-([A-Z]{3})-(\d{2}|\d{4})$/);
        if (ora) {
            const day = ora[1].padStart(2, '0');
            const mon = this.MON_MAP[ora[2]];
            if (!mon) return '';
            let year = parseInt(ora[3], 10);
            if (ora[3].length === 2) {
                // 00–69 → 2000–2069, 70–99 → 1970–1999 (common Oracle window)
                year = year < 70 ? 2000 + year : 1900 + year;
            }
            return year + '-' + String(mon).padStart(2, '0') + '-' + day;
        }
        // dd/mm/yyyy or dd-mm-yyyy (numeric month)
        const m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
        if (m) {
            return m[3] + '-' + m[2].padStart(2, '0') + '-' + m[1].padStart(2, '0');
        }
        // yyyymmdd
        if (/^\d{8}$/.test(s)) {
            return s.slice(0, 4) + '-' + s.slice(4, 6) + '-' + s.slice(6, 8);
        }
        return '';
    },

    /**
     * Aggregate + validate against selected children and target month.
     * @param {string} text
     * @param {Array} children [{ kodeKmmd, kodeBranch, branchEpm, namaKmmd }]
     * @param {string} ym YYYY-MM
     */
    validateAndAggregate: function (text, children, ym) {
        const parsed = this.parse(text);
        if (!parsed.rows.length) {
            return { ok: false, message: 'CSV kosong atau tidak terbaca' };
        }

        const childList = Array.isArray(children) ? children : [];
        const byCode = new Map();
        const byName = new Map();
        childList.forEach(c => {
            if (c.kodeBranch) byCode.set(String(c.kodeBranch).trim(), c);
            if (c.branchEpm) byName.set(String(c.branchEpm).trim().toUpperCase(), c);
        });

        let matchedAmount = 0;
        let matchedRows = 0;
        let inMonth = 0;
        let outMonth = 0;
        const perChild = {};

        parsed.rows.forEach(row => {
            const code = String(row.BRANCH_SPC_CODE || row.branchCode || '').trim();
            const name = String(row.BRANCH || row.branchName || '').trim().toUpperCase();
            const child = byCode.get(code) || byName.get(name) || null;
            if (!child) return;

            const amt = this.rowAmount(row);
            const trx = this.normalizeTrxDate(row.TRX_DATE || row.TGL_TRX || row.trxDate || '');
            const rowYm = trx ? trx.slice(0, 7) : '';
            if (ym && rowYm && rowYm !== ym) {
                outMonth += 1;
            } else {
                inMonth += 1;
            }

            matchedRows += 1;
            matchedAmount += amt;
            const key = child.kodeKmmd || child.id;
            if (!perChild[key]) {
                perChild[key] = { child: child, amount: 0, rows: 0 };
            }
            perChild[key].amount += amt;
            perChild[key].rows += 1;
        });

        if (!matchedRows) {
            return {
                ok: false,
                message: 'Tidak ada baris CSV yang cocok dengan branch child yang dipilih (kode/nama Branch EPM).'
            };
        }

        const totalDated = inMonth + outMonth;
        if (ym && totalDated > 0 && outMonth > inMonth) {
            return {
                ok: false,
                message: 'Mayoritas TRX_DATE di luar bulan ' + ym +
                    ' (in=' + inMonth + ', out=' + outMonth + '). Upload file periode yang sesuai.'
            };
        }

        if (matchedAmount <= 0) {
            return { ok: false, message: 'Total amount CSV untuk child terpilih = 0' };
        }

        return {
            ok: true,
            totalAmount: matchedAmount,
            matchedRows: matchedRows,
            inMonth: inMonth,
            outMonth: outMonth,
            perChild: perChild,
            ym: ym
        };
    },

    readFileAsText: function (file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error('File tidak ada'));
                return;
            }
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.onerror = () => reject(new Error('Gagal membaca file'));
            reader.readAsText(file);
        });
    }
};

window.ListingClaimCsv = ListingClaimCsv;

/**
 * Mock BI ledger for Development Fund (prototype).
 * Snapshot / budget keyed per SubDist mapping (`kodeKmmd`) — Parent maupun Child
 * (bukan glondongan parent saja). Match Monitoring via ShipTo/OutletID.
 */
const MockBiLedger = {
    /** v3: budget keyed per kodeKmmd (Parent + Child) for Report Budget */
    STORAGE_KEY: 'df_mock_bi_ledger_v3',
    APPLY_DATE_KEY: 'df_bi_last_apply_date',

    /** @returns {{ snapshots: Object, ledger: Array, budgets: Object, audit: Array }} */
    load: function () {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        if (raw) {
            try {
                const data = JSON.parse(raw);
                if (data && typeof data === 'object') {
                    data.snapshots = data.snapshots || {};
                    data.ledger = Array.isArray(data.ledger) ? data.ledger : [];
                    data.budgets = data.budgets || {};
                    data.audit = Array.isArray(data.audit) ? data.audit : [];
                    return data;
                }
            } catch (e) {
                console.warn('MockBiLedger: invalid storage, reseeding', e);
            }
        }
        const seeded = this.buildSeed();
        this.save(seeded);
        return seeded;
    },

    save: function (data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    },

    /**
     * Seed for unmap demo + Report Budget (per-member budgets & history Mei–Jul 2026).
     * Joint group: Parent 010211 + Child 010209, 010212. Standalone: 010213, 010207.
     */
    buildSeed: function () {
        const ledger = [];
        const mk = (partial) => Object.assign({
            id: 'L' + Math.random().toString(36).slice(2, 10),
            type: 'INJECT_DELTA',
            businessKey: '',
            parentKode: '',
            childKode: null,
            memberKode: '',
            trxDate: '',
            delta: 0,
            amountBefore: 0,
            amountAfter: 0,
            note: 'seed',
            createdAt: new Date().toISOString()
        }, partial);

        const pushInject = (memberKode, groupParent, date, amount, note) => {
            const b = budgets[memberKode] || { parentKode: memberKode, injected: 0, used: 0 };
            const before = Number(b.injected) || 0;
            const after = before + amount;
            b.injected = after;
            budgets[memberKode] = b;
            ledger.push(mk({
                type: 'INJECT_DELTA',
                businessKey: memberKode,
                parentKode: groupParent || memberKode,
                childKode: groupParent && groupParent !== memberKode ? memberKode : null,
                memberKode: memberKode,
                trxDate: date,
                delta: amount,
                amountBefore: before,
                amountAfter: after,
                note: note || 'seed inject'
            }));
        };

        const pushUsed = (memberKode, groupParent, date, amount, note) => {
            const b = budgets[memberKode] || { parentKode: memberKode, injected: 0, used: 0 };
            const before = Number(b.used) || 0;
            const after = before + amount;
            b.used = after;
            budgets[memberKode] = b;
            ledger.push(mk({
                type: 'USE_CLAIM',
                businessKey: memberKode,
                parentKode: groupParent || memberKode,
                childKode: groupParent && groupParent !== memberKode ? memberKode : null,
                memberKode: memberKode,
                trxDate: date,
                delta: -amount,
                amountBefore: before,
                amountAfter: after,
                note: note || 'seed klaim (mock)'
            }));
        };

        const budgets = {};

        // Parent Adyajati 010211
        pushInject('010211', '010211', '2026-05-10', 4000000, 'seed inject Parent Mei');
        pushInject('010211', '010211', '2026-06-05', 3500000, 'seed inject Parent Jun');
        pushInject('010211', '010211', '2026-07-08', 2000000, 'seed inject Parent Jul');
        pushUsed('010211', '010211', '2026-06-18', 2500000, 'seed klaim Parent Jun');
        pushUsed('010211', '010211', '2026-07-12', 3000000, 'seed klaim Parent Jul');

        // Child 010209
        pushInject('010209', '010211', '2026-06-15', 3000000, 'seed inject child 010209');
        pushInject('010209', '010211', '2026-07-10', 2500000, 'seed inject child 010209');
        pushInject('010209', '010211', '2026-07-15', 2000000, 'seed inject child 010209');
        pushUsed('010209', '010211', '2026-06-28', 1500000, 'seed klaim child 010209');
        pushUsed('010209', '010211', '2026-07-20', 2000000, 'seed klaim child 010209');

        // Child 010212
        pushInject('010212', '010211', '2026-06-20', 1500000, 'seed inject child 010212');
        pushInject('010212', '010211', '2026-07-11', 1800000, 'seed inject child 010212');
        pushInject('010212', '010211', '2026-07-23', 1000000, 'seed inject child 010212');
        pushUsed('010212', '010211', '2026-07-05', 800000, 'seed klaim child 010212');
        pushUsed('010212', '010211', '2026-07-25', 1200000, 'seed klaim child 010212');

        // Standalone Medan parent 010213
        pushInject('010213', '010213', '2026-06-01', 3000000, 'seed inject standalone');
        pushInject('010213', '010213', '2026-07-20', 2000000, 'seed inject standalone');
        pushUsed('010213', '010213', '2026-07-22', 4800000, 'seed klaim standalone');

        // Standalone Sancho 010207 (kecil)
        pushInject('010207', '010207', '2026-07-01', 1500000, 'seed inject standalone');
        pushUsed('010207', '010207', '2026-07-15', 400000, 'seed klaim standalone');

        // Unmap impact (getImpactForChild) filters parentKode + childKode.
        // Mirror child injects as ledger-only rows under parent 010211 — do NOT change per-member budgets.
        const childDaysLegacy = [
            { child: '010209', date: '2026-06-15', amount: 3000000 },
            { child: '010209', date: '2026-07-10', amount: 2500000 },
            { child: '010209', date: '2026-07-15', amount: 2000000 },
            { child: '010212', date: '2026-06-20', amount: 1500000 },
            { child: '010212', date: '2026-07-11', amount: 1800000 },
            { child: '010212', date: '2026-07-23', amount: 1000000 }
        ];
        let runningUnmap = Number(budgets['010211'].injected) || 0;
        childDaysLegacy.forEach(row => {
            const before = runningUnmap;
            runningUnmap += row.amount;
            ledger.push(mk({
                type: 'INJECT_DELTA',
                businessKey: '010211',
                parentKode: '010211',
                childKode: row.child,
                memberKode: row.child,
                trxDate: row.date,
                delta: row.amount,
                amountBefore: before,
                amountAfter: runningUnmap,
                note: 'seed inject (unmap impact key)'
            }));
        });

        const snapshots = {};
        Object.keys(budgets).forEach(kode => {
            snapshots[kode] = {
                businessKey: kode,
                parentKode: kode,
                amount: Number(budgets[kode].injected) || 0,
                injectedAt: '2026-07-23T10:00:00+07:00',
                sourceFile: 'seed'
            };
        });

        return {
            snapshots: snapshots,
            ledger: ledger,
            budgets: budgets,
            audit: [{ at: new Date().toISOString(), action: 'SEED', note: 'MockBiLedger seed v3 — per-member budget' }]
        };
    },

    resetSeed: function () {
        const seeded = this.buildSeed();
        this.save(seeded);
        localStorage.removeItem(this.APPLY_DATE_KEY);
        return seeded;
    },

    todayWib: function () {
        const fmt = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Asia/Jakarta',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        return fmt.format(new Date()); // YYYY-MM-DD
    },

    getLastApplyDate: function () {
        return localStorage.getItem(this.APPLY_DATE_KEY) || null;
    },

    setLastApplyDate: function (ymd) {
        localStorage.setItem(this.APPLY_DATE_KEY, ymd || this.todayWib());
    },

    /** Apply already done today? */
    hasAppliedToday: function () {
        return this.getLastApplyDate() === this.todayWib();
    },

    canApplyToday: function (opts) {
        opts = opts || {};
        if (!this.hasAppliedToday()) return { ok: true };
        if (opts.bypass && opts.reason) return { ok: true, bypass: true };
        return {
            ok: false,
            message: 'Apply ke BI (mock) sudah dilakukan hari ini. Refresh apply hanya 1× per hari.'
        };
    },

    getSnapshot: function (businessKey) {
        const data = this.load();
        return data.snapshots[businessKey] || null;
    },

    getBudget: function (parentKode) {
        const data = this.load();
        const b = data.budgets[parentKode];
        if (!b) {
            return { parentKode: parentKode, injected: 0, used: 0, sisa: 0 };
        }
        const injected = Number(b.injected) || 0;
        const used = Number(b.used) || 0;
        return {
            parentKode: parentKode,
            injected: injected,
            used: used,
            sisa: injected - used
        };
    },

    /**
     * Budgets for a list of kodeKmmd (Parent and/or Child).
     * @param {string[]} kodes
     * @returns {Array<{parentKode:string,injected:number,used:number,sisa:number}>}
     */
    listBudgetsForKodes: function (kodes) {
        const list = Array.isArray(kodes) ? kodes : [];
        return list.map(k => this.getBudget(String(k || '').trim())).filter(b => b.parentKode);
    },

    /**
     * Ledger rows for report history.
     * opts: { parentKode?, memberKodes?: string[], fromYm?, toYm?, types?: string[] }
     * - If memberKodes set: match businessKey / memberKode / childKode / parentKode in set
     * - Else if parentKode set: match parentKode (group) or businessKey === parentKode
     */
    listLedgerFiltered: function (opts) {
        opts = opts || {};
        const data = this.load();
        const fromYm = opts.fromYm || '';
        const toYm = opts.toYm || '';
        const fromDate = fromYm ? this.monthStart(fromYm) : '';
        const toDate = toYm ? this.monthEnd(toYm) : '';
        const memberSet = Array.isArray(opts.memberKodes) && opts.memberKodes.length
            ? new Set(opts.memberKodes.map(k => String(k)))
            : null;
        const parentKode = opts.parentKode ? String(opts.parentKode) : '';
        const types = Array.isArray(opts.types) && opts.types.length
            ? new Set(opts.types)
            : null;

        return data.ledger
            .filter(l => {
                if (types && !types.has(l.type)) return false;
                if (opts.forReport && String(l.note || '').indexOf('unmap impact key') >= 0) return false;
                if (fromDate && l.trxDate < fromDate) return false;
                if (toDate && l.trxDate > toDate) return false;

                if (memberSet) {
                    const keys = [
                        l.memberKode,
                        l.businessKey,
                        l.childKode,
                        l.parentKode
                    ].filter(Boolean).map(String);
                    return keys.some(k => memberSet.has(k));
                }
                if (parentKode) {
                    return String(l.parentKode) === parentKode
                        || String(l.businessKey) === parentKode
                        || String(l.memberKode) === parentKode;
                }
                return true;
            })
            .slice()
            .sort((a, b) => {
                const d = String(a.trxDate).localeCompare(String(b.trxDate));
                if (d !== 0) return d;
                return String(a.createdAt || '').localeCompare(String(b.createdAt || ''));
            });
    },

    ensureBudget: function (data, parentKode) {
        if (!data.budgets[parentKode]) {
            data.budgets[parentKode] = { parentKode: parentKode, injected: 0, used: 0 };
        }
        return data.budgets[parentKode];
    },

    /** YYYY-MM from date string */
    toYm: function (dateStr) {
        if (!dateStr) return '';
        return String(dateStr).slice(0, 7);
    },

    monthStart: function (ym) {
        return ym + '-01';
    },

    monthEnd: function (ym) {
        const [y, m] = ym.split('-').map(Number);
        const last = new Date(y, m, 0).getDate();
        return ym + '-' + String(last).padStart(2, '0');
    },

    MONTH_NAMES_ID: [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ],

    formatYmLabel: function (ym) {
        if (!ym || ym.length < 7) return ym || '';
        const y = ym.slice(0, 4);
        const mi = parseInt(ym.slice(5, 7), 10) - 1;
        return (this.MONTH_NAMES_ID[mi] || ym) + ' ' + y;
    },

    currentYm: function () {
        return this.toYm(this.todayWib());
    },

    /**
     * List YYYY-MM from linkedYm through currentYm inclusive.
     */
    listMonthsBetween: function (fromYm, toYm) {
        const out = [];
        if (!fromYm || !toYm || fromYm > toYm) return out;
        let [y, m] = fromYm.split('-').map(Number);
        const [ey, em] = toYm.split('-').map(Number);
        while (y < ey || (y === ey && m <= em)) {
            out.push(y + '-' + String(m).padStart(2, '0'));
            m += 1;
            if (m > 12) { m = 1; y += 1; }
        }
        return out;
    },

    /**
     * Impact for child filtered by month range (inclusive YYYY-MM).
     */
    getImpactForChildByMonths: function (parentKode, childKode, fromYm, toYm) {
        const fromDate = this.monthStart(fromYm);
        const toDate = this.monthEnd(toYm);
        const impact = this.getImpactForChild(parentKode, childKode, fromDate, toDate);
        impact.fromYm = fromYm;
        impact.toYm = toYm;
        return impact;
    },

    /**
     * Ledger lines for child (or parent) in date range inclusive.
     */
    getImpactForChild: function (parentKode, childKode, fromDate, toDate) {
        const data = this.load();
        const lines = data.ledger.filter(l => {
            if (String(l.parentKode) !== String(parentKode)) return false;
            if (childKode && String(l.childKode || '') !== String(childKode)) return false;
            if (fromDate && l.trxDate < fromDate) return false;
            if (toDate && l.trxDate > toDate) return false;
            return true;
        });
        const correctionAmount = lines.reduce((s, l) => s + (Number(l.delta) || 0), 0);
        const budget = this.getBudget(parentKode);
        const projectedSisa = budget.sisa - correctionAmount;
        return {
            lines: lines,
            correctionAmount: correctionAmount,
            hasImpact: correctionAmount !== 0 || lines.length > 0,
            budget: budget,
            projectedSisa: projectedSisa,
            willGoNegative: projectedSisa < 0
        };
    },

    /**
     * Apply unmap correction by month range.
     * opts: parentKode, childKode, fromYm, toYm, acknowledgeMines
     * effectiveUnmapDate always todayWib().
     */
    applyUnmapCorrection: function (opts) {
        const parentKode = opts.parentKode;
        const childKode = opts.childKode;
        let fromYm = opts.fromYm;
        let toYm = opts.toYm;
        // Back-compat: derive from dates if months not passed
        if (!fromYm && opts.fromDate) fromYm = this.toYm(opts.fromDate);
        if (!toYm && opts.toDate) toYm = this.toYm(opts.toDate);
        const effectiveUnmapDate = this.todayWib();
        const acknowledgeMines = !!opts.acknowledgeMines;

        if (!parentKode || !childKode || !fromYm || !toYm) {
            return { ok: false, message: 'Parameter koreksi tidak lengkap' };
        }
        if (fromYm > toYm) {
            return { ok: false, message: 'Bulan dari tidak boleh setelah sampai' };
        }

        const impact = this.getImpactForChildByMonths(parentKode, childKode, fromYm, toYm);
        if (!impact.hasImpact || impact.correctionAmount === 0) {
            return { ok: true, impact: impact, skipped: true, message: 'Tidak ada nilai untuk dikoreksi' };
        }
        if (impact.willGoNegative && !acknowledgeMines) {
            return {
                ok: false,
                message: 'Budget akan mines. Centang acknowledge untuk lanjut.',
                impact: impact,
                needsAck: true
            };
        }

        const data = this.load();
        const cut = impact.correctionAmount;
        const snap = data.snapshots[parentKode] || {
            businessKey: parentKode,
            parentKode: parentKode,
            amount: 0
        };
        const before = Number(snap.amount) || 0;
        const after = before - cut;
        snap.amount = after;
        snap.injectedAt = new Date().toISOString();
        snap.sourceFile = 'unmap-correction';
        data.snapshots[parentKode] = snap;

        const budget = this.ensureBudget(data, parentKode);
        budget.injected = after;

        data.ledger.push({
            id: 'C' + Date.now().toString(36),
            type: 'UNMAP_CORRECTION',
            businessKey: parentKode,
            parentKode: parentKode,
            childKode: childKode,
            trxDate: effectiveUnmapDate,
            delta: -cut,
            amountBefore: before,
            amountAfter: after,
            note: 'Unmap ' + childKode + ' koreksi ' + fromYm + ' s/d ' + toYm,
            createdAt: new Date().toISOString(),
            fromYm: fromYm,
            toYm: toYm,
            effectiveUnmapDate: effectiveUnmapDate
        });

        data.audit.push({
            at: new Date().toISOString(),
            action: 'UNMAP_CORRECTION',
            parentKode: parentKode,
            childKode: childKode,
            fromYm: fromYm,
            toYm: toYm,
            delta: -cut,
            projectedSisa: after - (Number(budget.used) || 0)
        });

        this.save(data);
        return {
            ok: true,
            impact: this.getImpactForChildByMonths(parentKode, childKode, fromYm, toYm),
            cut: cut
        };
    },

    /**
     * Preview historical inject for add-child.
     */
    previewHistoricalInject: function (parentKode, amount) {
        const budget = this.getBudget(parentKode);
        const delta = Number(amount) || 0;
        const projectedSisa = budget.sisa + delta;
        return {
            budget: budget,
            delta: delta,
            projectedSisa: projectedSisa,
            willGoNegative: projectedSisa < 0
        };
    },

    /**
     * Inject historical amount from CSV when adding child.
     * opts: parentKode, childKode, ym (YYYY-MM), amount, acknowledgeMines, sourceFile
     */
    applyHistoricalInject: function (opts) {
        const parentKode = opts.parentKode;
        const childKode = opts.childKode;
        const ym = opts.ym;
        const amount = Number(opts.amount) || 0;
        const acknowledgeMines = !!opts.acknowledgeMines;

        if (!parentKode || !childKode || !ym || amount <= 0) {
            return { ok: false, message: 'Parameter inject historis tidak lengkap / amount 0' };
        }

        const preview = this.previewHistoricalInject(parentKode, amount);
        if (preview.willGoNegative && !acknowledgeMines) {
            return {
                ok: false,
                message: 'Budget akan mines. Acknowledge untuk lanjut.',
                preview: preview,
                needsAck: true
            };
        }

        const data = this.load();
        const snap = data.snapshots[parentKode] || {
            businessKey: parentKode,
            parentKode: parentKode,
            amount: 0
        };
        const before = Number(snap.amount) || 0;
        const after = before + amount;
        snap.amount = after;
        snap.injectedAt = new Date().toISOString();
        snap.sourceFile = opts.sourceFile || 'historical-csv';
        data.snapshots[parentKode] = snap;

        const budget = this.ensureBudget(data, parentKode);
        budget.injected = after;

        const trxDate = this.monthStart(ym);
        data.ledger.push({
            id: 'H' + Date.now().toString(36),
            type: 'HISTORICAL_INJECT',
            businessKey: parentKode,
            parentKode: parentKode,
            childKode: childKode,
            trxDate: trxDate,
            delta: amount,
            amountBefore: before,
            amountAfter: after,
            note: 'Add child historis ' + childKode + ' bulan ' + ym,
            createdAt: new Date().toISOString(),
            ym: ym
        });

        data.audit.push({
            at: new Date().toISOString(),
            action: 'HISTORICAL_INJECT',
            parentKode: parentKode,
            childKode: childKode,
            ym: ym,
            delta: amount
        });

        this.save(data);
        return { ok: true, amount: amount, preview: this.previewHistoricalInject(parentKode, 0) };
    },

    /**
     * Preview apply delta per SubDist mapping (Parent atau Child).
     * Grain = kodeKmmd / mapping id — bukan agregat branch ke parent.
     * @deprecated Monitoring apply wizard removed — kept for compatibility.
     */
    buildApplyPreview: function (mappedRows) {
        const rows = Array.isArray(mappedRows) ? mappedRows : [];
        const data = this.load();
        return rows.map(r => {
            const subdistKode = r.mappedKodeKmmd
                || (r.mapping && (r.mapping.kodeKmmd || r.mapping.id))
                || r.kodeKmmd
                || r.businessKey
                || '';
            const fileTotal = Number(r.totalRp) || 0;
            const snap = data.snapshots[subdistKode];
            const injected = snap ? (Number(snap.amount) || 0) : 0;
            const delta = fileTotal - injected;
            const budget = this.getBudget(subdistKode);
            const projectedSisa = budget.sisa + delta;
            return {
                parentKode: subdistKode,
                subdistKode: subdistKode,
                label: r.subdistLabel || r.branchName || subdistKode,
                status: r.status || '',
                shipToSiteUseId: r.shipToSiteUseId || '',
                branchName: r.branchName || '',
                branchCode: r.branchCode || '',
                fileTotal: fileTotal,
                injected: injected,
                delta: delta,
                budget: budget,
                projectedSisa: projectedSisa,
                willGoNegative: projectedSisa < 0,
                children: []
            };
        }).filter(x => x.subdistKode);
    },

    /** @deprecated Apply delta keyed per SubDist (kodeKmmd), Parent maupun Child. */
    applyDeltas: function (approved, meta) {
        meta = meta || {};
        const list = Array.isArray(approved) ? approved : [];
        const data = this.load();
        const applied = [];

        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const subdistKode = item.subdistKode || item.parentKode;
            const delta = Number(item.delta) || 0;
            if (!subdistKode || delta === 0) continue;

            const budget = this.getBudget(subdistKode);
            if (budget.sisa + delta < 0 && !item.acknowledgeMines) {
                return {
                    ok: false,
                    message: 'SubDist ' + subdistKode + ' akan mines — acknowledge dulu.',
                    parentKode: subdistKode,
                    subdistKode: subdistKode
                };
            }

            const snap = data.snapshots[subdistKode] || {
                businessKey: subdistKode,
                parentKode: subdistKode,
                amount: 0
            };
            const before = Number(snap.amount) || 0;
            const after = Number(item.fileTotal);
            snap.amount = after;
            snap.injectedAt = new Date().toISOString();
            snap.sourceFile = meta.sourceFile || 'legacy-apply';
            data.snapshots[subdistKode] = snap;

            const b = this.ensureBudget(data, subdistKode);
            b.injected = after;

            data.ledger.push({
                id: 'I' + Date.now().toString(36) + i,
                type: 'INJECT_DELTA',
                businessKey: subdistKode,
                parentKode: subdistKode,
                childKode: null,
                trxDate: this.todayWib(),
                delta: delta,
                amountBefore: before,
                amountAfter: after,
                note: meta.note || 'legacy apply per SubDist',
                createdAt: new Date().toISOString()
            });
            applied.push({ parentKode: subdistKode, subdistKode: subdistKode, delta: delta });
        }

        data.audit.push({
            at: new Date().toISOString(),
            action: 'APPLY_DELTAS',
            count: applied.length,
            items: applied
        });

        this.save(data);
        return { ok: true, applied: applied };
    },

    formatRp: function (n) {
        const v = Number(n) || 0;
        const sign = v < 0 ? '-' : '';
        return sign + 'Rp ' + Math.abs(v).toLocaleString('id-ID');
    }
};

window.MockBiLedger = MockBiLedger;

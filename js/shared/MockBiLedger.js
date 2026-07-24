/**
 * Mock BI ledger for Development Fund (prototype).
 * Persists snapshot injected, mutasi, saldo terpakai, daily apply lock.
 */
const MockBiLedger = {
    STORAGE_KEY: 'df_mock_bi_ledger_v1',
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

    /** Seed enough data to demo unmap 10–23 and mines on negative delta */
    buildSeed: function () {
        const ledger = [];
        const mk = (partial) => Object.assign({
            id: 'L' + Math.random().toString(36).slice(2, 10),
            type: 'INJECT_DELTA',
            businessKey: '',
            parentKode: '',
            childKode: null,
            trxDate: '',
            delta: 0,
            amountBefore: 0,
            amountAfter: 0,
            note: 'seed',
            createdAt: new Date().toISOString()
        }, partial);

        // Parent Adyajati 010211 — injects Jun + Jul (month-based unmap demo)
        const childDays = [
            { child: '010209', date: '2026-06-15', amount: 3000000 },
            { child: '010209', date: '2026-07-10', amount: 2500000 },
            { child: '010209', date: '2026-07-15', amount: 2000000 },
            { child: '010212', date: '2026-06-20', amount: 1500000 },
            { child: '010212', date: '2026-07-11', amount: 1800000 },
            { child: '010212', date: '2026-07-23', amount: 1000000 }
        ];
        let running = 0;
        childDays.forEach(row => {
            const before = running;
            running += row.amount;
            ledger.push(mk({
                type: 'INJECT_DELTA',
                businessKey: '010211',
                parentKode: '010211',
                childKode: row.child,
                trxDate: row.date,
                delta: row.amount,
                amountBefore: before,
                amountAfter: running,
                note: 'seed inject'
            }));
        });

        // Standalone Medan parent 010213
        ledger.push(mk({
            businessKey: '010213',
            parentKode: '010213',
            childKode: null,
            trxDate: '2026-07-20',
            delta: 5000000,
            amountBefore: 0,
            amountAfter: 5000000,
            note: 'seed inject standalone'
        }));

        const snapshots = {
            '010211': {
                businessKey: '010211',
                parentKode: '010211',
                amount: 11800000,
                injectedAt: '2026-07-23T10:00:00+07:00',
                sourceFile: 'seed'
            },
            '010213': {
                businessKey: '010213',
                parentKode: '010213',
                amount: 5000000,
                injectedAt: '2026-07-23T10:00:00+07:00',
                sourceFile: 'seed'
            }
        };

        const budgets = {
            '010211': { parentKode: '010211', injected: 11800000, used: 9500000 },
            '010213': { parentKode: '010213', injected: 5000000, used: 4800000 }
        };

        return {
            snapshots: snapshots,
            ledger: ledger,
            budgets: budgets,
            audit: [{ at: new Date().toISOString(), action: 'SEED', note: 'MockBiLedger seed v1' }]
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
     * @deprecated Monitoring apply wizard removed — kept for compatibility.
     */
    buildApplyPreview: function (mappedRows) {
        const rows = Array.isArray(mappedRows) ? mappedRows : [];
        const data = this.load();
        return rows.map(r => {
            const parentKode = (r.mappingParent && (r.mappingParent.kodeKmmd || r.mappingParent.id))
                || r.kodeKmmd
                || r.businessKey
                || '';
            const fileTotal = Number(r.totalRp) || 0;
            const snap = data.snapshots[parentKode];
            const injected = snap ? (Number(snap.amount) || 0) : 0;
            const delta = fileTotal - injected;
            const budget = this.getBudget(parentKode);
            const projectedSisa = budget.sisa + delta;
            return {
                parentKode: parentKode,
                label: r.subdistLabel || r.branchName || parentKode,
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
        }).filter(x => x.parentKode);
    },

    /** @deprecated */
    applyDeltas: function (approved, meta) {
        meta = meta || {};
        const list = Array.isArray(approved) ? approved : [];
        const data = this.load();
        const applied = [];

        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const parentKode = item.parentKode;
            const delta = Number(item.delta) || 0;
            if (!parentKode || delta === 0) continue;

            const budget = this.getBudget(parentKode);
            if (budget.sisa + delta < 0 && !item.acknowledgeMines) {
                return {
                    ok: false,
                    message: 'Group ' + parentKode + ' akan mines — acknowledge dulu.',
                    parentKode: parentKode
                };
            }

            const snap = data.snapshots[parentKode] || {
                businessKey: parentKode,
                parentKode: parentKode,
                amount: 0
            };
            const before = Number(snap.amount) || 0;
            const after = Number(item.fileTotal);
            snap.amount = after;
            snap.injectedAt = new Date().toISOString();
            snap.sourceFile = meta.sourceFile || 'legacy-apply';
            data.snapshots[parentKode] = snap;

            const b = this.ensureBudget(data, parentKode);
            b.injected = after;

            data.ledger.push({
                id: 'I' + Date.now().toString(36) + i,
                type: 'INJECT_DELTA',
                businessKey: parentKode,
                parentKode: parentKode,
                childKode: null,
                trxDate: this.todayWib(),
                delta: delta,
                amountBefore: before,
                amountAfter: after,
                note: meta.note || 'legacy apply',
                createdAt: new Date().toISOString()
            });
            applied.push({ parentKode: parentKode, delta: delta });
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

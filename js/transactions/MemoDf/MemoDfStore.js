/**
 * Memo DF (Setting QP) — localStorage store + nomor generator
 * Format: DF_CCD/01/{MM}/{YY}/{NNNN} — NNNN counter naik, reset tiap bulan
 */
"use strict";

var MemoDfStore = {
    STORAGE_KEY: "df_memo_qp_v1",
    COUNTER_KEY: "df_memo_qp_counter_v1",
    /** Seed Budget QP (mock BI) keyed by kodeKmmd — dipakai jika MockBiLedger belum punya */
    BUDGET_SEED_KEY: "df_memo_budget_qp_seed_v1",

    load: function () {
        var raw = localStorage.getItem(this.STORAGE_KEY);
        if (raw) {
            try {
                var data = JSON.parse(raw);
                return Array.isArray(data) ? data : [];
            } catch (e) {
                console.warn("MemoDfStore: invalid storage", e);
            }
        }
        return [];
    },

    save: function (list) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list || []));
    },

    /** Hapus semua memo + reset counter bulanan (prototype) */
    clearAll: function () {
        localStorage.removeItem(this.STORAGE_KEY);
        localStorage.removeItem(this.COUNTER_KEY);
    },

    getById: function (id) {
        return this.load().find(function (m) { return m.id === id; }) || null;
    },

    /** YYYYMM WIB */
    currentYm: function () {
        var fmt = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Jakarta",
            year: "numeric",
            month: "2-digit"
        });
        var parts = fmt.formatToParts(new Date());
        var y = parts.find(function (p) { return p.type === "year"; }).value;
        var m = parts.find(function (p) { return p.type === "month"; }).value;
        return y + m;
    },

    currentMmYy: function () {
        var ym = this.currentYm();
        return { mm: ym.slice(4, 6), yy: ym.slice(2, 4) };
    },

    loadCounters: function () {
        var raw = localStorage.getItem(this.COUNTER_KEY);
        if (raw) {
            try {
                var o = JSON.parse(raw);
                if (o && typeof o === "object") return o;
            } catch (e) { /* ignore */ }
        }
        return {};
    },

    saveCounters: function (map) {
        localStorage.setItem(this.COUNTER_KEY, JSON.stringify(map || {}));
    },

    /**
     * Ambil next NNNN untuk bulan berjalan (1-based), persist.
     * @returns {string} zero-padded 4 digit
     */
    nextCounter: function () {
        var ym = this.currentYm();
        var map = this.loadCounters();
        var n = (Number(map[ym]) || 0) + 1;
        map[ym] = n;
        this.saveCounters(map);
        return String(n).padStart(4, "0");
    },

    /**
     * Generate nomor: DF_CCD/01/{MM}/{YY}/{NNNN}
     */
    generateNomor: function () {
        var d = this.currentMmYy();
        var nnnn = this.nextCounter();
        return "DF_CCD/01/" + d.mm + "/" + d.yy + "/" + nnnn;
    },

    /**
     * Budget QP per kodeKmmd (mock). Prefer MockBiLedger.sisa, else seed map.
     */
    ensureBudgetSeed: function () {
        var raw = localStorage.getItem(this.BUDGET_SEED_KEY);
        if (raw) {
            try {
                var o = JSON.parse(raw);
                if (o && typeof o === "object") return o;
            } catch (e) { /* ignore */ }
        }
        var seed = this.buildBudgetSeed();
        localStorage.setItem(this.BUDGET_SEED_KEY, JSON.stringify(seed));
        return seed;
    },

    buildBudgetSeed: function () {
        var seed = {};
        var mapping = (typeof MappingSubdistStore !== "undefined")
            ? MappingSubdistStore.load()
            : (window.MappingSubdistSeed || []);
        var presets = {
            "010211": 2500000000,
            "010209": 1800000000,
            "010212": 2700000000,
            "010213": 1200000000,
            "010207": 900000000,
            "360302": 3200000000,
            "360301": 1500000000
        };
        (mapping || []).forEach(function (row, i) {
            var kode = String(row.kodeKmmd || row.id || "").trim();
            if (!kode) return;
            if (presets[kode] != null) {
                seed[kode] = presets[kode];
                return;
            }
            // Deterministik 0.4M–3.5M agar group totals bervariasi
            var h = 0;
            for (var c = 0; c < kode.length; c++) h = ((h << 5) - h) + kode.charCodeAt(c);
            h = Math.abs(h);
            seed[kode] = 400000000 + (h % 31) * 100000000 + (i % 7) * 50000000;
        });
        return seed;
    },

    getBudgetQp: function (kodeKmmd) {
        var kode = String(kodeKmmd || "").trim();
        if (!kode) return 0;
        if (typeof MockBiLedger !== "undefined") {
            var b = MockBiLedger.getBudget(kode);
            if (b && (Number(b.sisa) > 0 || Number(b.injected) > 0)) {
                return Number(b.sisa) > 0 ? Number(b.sisa) : Number(b.injected);
            }
        }
        var seed = this.ensureBudgetSeed();
        return Number(seed[kode]) || 0;
    },

    /**
     * Build groups dari Mapping: Parent + Child, Non Group = group sendiri.
     * @returns {Array<{key, namaGroup, groupType, totalBudgetQp, members:[]}>}
     */
    buildSelectionGroups: function () {
        var self = this;
        if (typeof MappingSubdistStore === "undefined") return [];
        var data = MappingSubdistStore.load().filter(function (d) {
            return d.active !== false;
        });
        var parents = data.filter(function (d) { return d.parent === "YA"; });
        var groups = [];

        parents.forEach(function (p) {
            var children = MappingSubdistStore.getChildren(p) || [];
            var members = [p].concat(children).map(function (m) {
                return {
                    id: m.id,
                    kodeKmmd: m.kodeKmmd,
                    namaKmmd: m.namaKmmd,
                    parent: m.parent,
                    namaGroup: m.namaGroup || p.namaGroup,
                    shipToSiteUseId: m.shipToSiteUseId || "",
                    region: m.region || "",
                    budgetQp: self.getBudgetQp(m.kodeKmmd || m.id)
                };
            });
            var total = members.reduce(function (s, m) { return s + (Number(m.budgetQp) || 0); }, 0);
            groups.push({
                key: p.id || p.kodeKmmd,
                namaGroup: (p.groupType === "Non Group" || p.namaGroup === "Non Group")
                    ? (p.namaKmmd || p.kodeKmmd)
                    : (p.namaGroup || p.namaKmmd),
                groupType: p.groupType || "Group",
                parentKode: p.kodeKmmd,
                totalBudgetQp: total,
                members: members
            });
        });

        groups.sort(function (a, b) {
            return String(a.namaGroup).localeCompare(String(b.namaGroup), "id");
        });
        return groups;
    },

    /**
     * Simpan N memo (satu per Subdist terpilih). Budget memo = Budget QP baris.
     * @returns {Array} created memos
     */
    createBatch: function (header, selectedMembers) {
        var list = this.load();
        var batchId = "B" + Date.now().toString(36);
        var now = new Date().toISOString();
        var created = [];
        var nama = (header && header.namaMemo) || "";
        var desc = (header && header.description) || "";
        var headerBudget = Number(header && header.budgetMemo) || 0;

        (selectedMembers || []).forEach(function (m) {
            var nomor = MemoDfStore.generateNomor();
            var row = {
                id: "M" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
                batchId: batchId,
                nomorMemo: nomor,
                namaMemo: nama,
                description: desc,
                headerBudget: headerBudget,
                budgetMemo: Number(m.budgetQp) || 0,
                subdistId: m.id,
                kodeKmmd: m.kodeKmmd,
                namaKmmd: m.namaKmmd,
                namaGroup: m.namaGroup,
                parent: m.parent,
                shipToSiteUseId: m.shipToSiteUseId || "",
                region: m.region || "",
                createdAt: now
            };
            list.unshift(row);
            created.push(row);
        });
        this.save(list);
        return created;
    },

    formatRp: function (n) {
        var v = Number(n) || 0;
        return "Rp " + v.toLocaleString("id-ID");
    },

    /** Digit-only → 5.000.000.000 (id-ID, tanpa Rp) */
    formatCurrencyInput: function (raw) {
        var digits = String(raw == null ? "" : raw).replace(/\D/g, "");
        if (!digits) return "";
        // hindari leading zeros berlebih, biarkan "0"
        digits = digits.replace(/^0+(?=\d)/, "");
        return Number(digits).toLocaleString("id-ID");
    },

    parseCurrency: function (raw) {
        if (raw == null || raw === "") return NaN;
        if (typeof raw === "number") return raw;
        var digits = String(raw).replace(/\D/g, "");
        if (!digits) return NaN;
        return Number(digits);
    }
};

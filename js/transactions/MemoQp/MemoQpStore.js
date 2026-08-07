/**
 * Memo QP (Setting QP) — store + nomor + mock Budget QP glondongan dari BI
 * Format nomor: DF_CCD/01/{MM}/{YY}/{NNNN}
 */
"use strict";

var MemoQpStore = {
    STORAGE_KEY: "df_memo_qp_v2",
    COUNTER_KEY: "df_memo_qp_counter_v2",
    /** Daftar Budget QP glondongan (mock BI) — belum dipecah per Subdist */
    BI_BUDGET_KEY: "df_memo_bi_budget_qp_year_v1",

    load: function () {
        var raw = localStorage.getItem(this.STORAGE_KEY);
        if (raw) {
            try {
                var data = JSON.parse(raw);
                return Array.isArray(data) ? data : [];
            } catch (e) {
                console.warn("MemoQpStore: invalid storage", e);
            }
        }
        return [];
    },

    save: function (list) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list || []));
    },

    clearAll: function () {
        localStorage.removeItem(this.STORAGE_KEY);
        localStorage.removeItem(this.COUNTER_KEY);
    },

    getById: function (id) {
        return this.load().find(function (m) { return m.id === id; }) || null;
    },

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

    nextCounter: function () {
        var ym = this.currentYm();
        var map = this.loadCounters();
        var n = (Number(map[ym]) || 0) + 1;
        map[ym] = n;
        this.saveCounters(map);
        return String(n).padStart(4, "0");
    },

    generateNomor: function () {
        var d = this.currentMmYy();
        return "DF_CCD/01/" + d.mm + "/" + d.yy + "/" + this.nextCounter();
    },

    /**
     * Mock BI: Budget QP glondongan compounding dalam 1 tahun berjalan (WIB).
     * Tidak dipilih per bulan — otomatis pakai tahun ini.
     */
    listBiYearBuckets: function () {
        var raw = localStorage.getItem(this.BI_BUDGET_KEY);
        if (raw) {
            try {
                var arr = JSON.parse(raw);
                if (Array.isArray(arr) && arr.length) return arr;
            } catch (e) { /* ignore */ }
        }
        var seed = this.buildBiYearSeed();
        localStorage.setItem(this.BI_BUDGET_KEY, JSON.stringify(seed));
        return seed;
    },

    buildBiYearSeed: function () {
        // Kontribusi bulanan YTD (mock) — dijumlahkan = compounding tahun berjalan
        return [
            {
                year: 2026,
                kode: "QP-GLD-2026",
                nama: "Budget QP Glondongan Tahun 2026",
                contributions: [
                    { periode: "2026-01", amount: 8000000000 },
                    { periode: "2026-02", amount: 7500000000 },
                    { periode: "2026-03", amount: 9000000000 },
                    { periode: "2026-04", amount: 8500000000 },
                    { periode: "2026-05", amount: 10000000000 },
                    { periode: "2026-06", amount: 9500000000 },
                    { periode: "2026-07", amount: 11000000000 },
                    { periode: "2026-08", amount: 12000000000 }
                ]
            }
        ];
    },

    currentYearWib: function () {
        var fmt = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Jakarta",
            year: "numeric"
        });
        return Number(fmt.format(new Date()));
    },

    /**
     * Budget QP aktif = compounding YTD tahun berjalan (otomatis, tanpa dropdown).
     * @returns {{id, kode, nama, year, amount, asOf, contributionCount}|null}
     */
    getActiveYearBudget: function () {
        var year = this.currentYearWib();
        var buckets = this.listBiYearBuckets();
        var bucket = buckets.find(function (b) { return Number(b.year) === year; }) || null;
        if (!bucket) {
            // fallback: buat bucket kosong tahun ini
            bucket = { year: year, kode: "QP-GLD-" + year, nama: "Budget QP Glondongan Tahun " + year, contributions: [] };
        }
        var ymNow = this.currentYm(); // YYYYMM
        var contrib = (bucket.contributions || []).filter(function (c) {
            var p = String(c.periode || "").replace("-", "");
            return p.length === 6 && p <= ymNow && p.indexOf(String(year)) === 0;
        });
        var amount = contrib.reduce(function (s, c) { return s + (Number(c.amount) || 0); }, 0);
        var asOf = contrib.length
            ? contrib.map(function (c) { return c.periode; }).sort().slice(-1)[0]
            : String(year);
        return {
            id: "BI-QP-" + year,
            kode: bucket.kode || ("QP-GLD-" + year),
            nama: bucket.nama || ("Budget QP Glondongan Tahun " + year),
            year: year,
            amount: amount,
            asOf: asOf,
            contributionCount: contrib.length
        };
    },

    getBiBudget: function (id) {
        var active = this.getActiveYearBudget();
        if (!id || id === active.id) return active;
        return null;
    },

    /** Total budgetMemo yang sudah dialokasikan untuk plafon BI tertentu. */
    sumAllocated: function (biBudgetId) {
        var id = biBudgetId || (this.getActiveYearBudget() || {}).id;
        if (!id) return 0;
        return this.load().reduce(function (s, m) {
            if (m.biBudgetId !== id) return s;
            return s + (Number(m.budgetMemo) || 0);
        }, 0);
    },

    /**
     * Plafon aktif + pemakaian. amount tetap = compounding bruto;
     * available = sisa yang boleh dialokasi.
     */
    getPlafonStatus: function () {
        var bi = this.getActiveYearBudget();
        if (!bi) return null;
        var used = this.sumAllocated(bi.id);
        var gross = Number(bi.amount) || 0;
        return Object.assign({}, bi, {
            grossAmount: gross,
            usedAmount: used,
            availableAmount: Math.max(0, gross - used)
        });
    },

    /**
     * Parent aktif saja (untuk alokasi memo).
     */
    listParents: function () {
        if (typeof MappingSubdistStore === "undefined") return [];
        return MappingSubdistStore.load()
            .filter(function (d) {
                return d.parent === "YA" && d.active !== false;
            })
            .map(function (p) {
                return {
                    id: p.id,
                    kodeKmmd: p.kodeKmmd,
                    namaKmmd: p.namaKmmd,
                    namaGroup: p.namaGroup || "",
                    groupType: p.groupType || "",
                    region: p.region || "",
                    shipToSiteUseId: p.shipToSiteUseId || ""
                };
            })
            .sort(function (a, b) {
                return String(a.namaKmmd).localeCompare(String(b.namaKmmd), "id");
            });
    },

    /**
     * Periode tanggal: wajib, awal ≤ akhir, tidak backdate, hanya tahun berjalan (WIB).
     * @returns {{ok:boolean, message?:string}}
     */
    validatePeriode: function (awal, akhir) {
        var a = String(awal || "").trim();
        var b = String(akhir || "").trim();
        if (!a || !b) return { ok: false, message: "Tanggal periode awal & akhir wajib diisi" };
        if (!/^\d{4}-\d{2}-\d{2}$/.test(a) || !/^\d{4}-\d{2}-\d{2}$/.test(b)) {
            return { ok: false, message: "Format tanggal periode tidak valid" };
        }
        var today = this.todayWib();
        var year = this.currentYearWib();
        var yearEnd = year + "-12-31";
        if (a < today || b < today) {
            return { ok: false, message: "Tanggal periode tidak boleh backdate (minimal hari ini)" };
        }
        if (a.slice(0, 4) !== String(year) || b.slice(0, 4) !== String(year)) {
            return { ok: false, message: "Tanggal periode hanya boleh di tahun berjalan (" + year + ")" };
        }
        if (a > yearEnd || b > yearEnd) {
            return { ok: false, message: "Tanggal periode melewati akhir tahun berjalan" };
        }
        if (b < a) {
            return { ok: false, message: "Tanggal akhir tidak boleh sebelum tanggal awal" };
        }
        return { ok: true };
    },

    todayWib: function () {
        var fmt = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Jakarta",
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        });
        return fmt.format(new Date()); // YYYY-MM-DD
    },

    yearBoundsWib: function () {
        var year = this.currentYearWib();
        var today = this.todayWib();
        return {
            year: year,
            min: today,
            max: year + "-12-31"
        };
    },

    formatPeriodeRange: function (awal, akhir) {
        var fmt = function (iso) {
            if (!iso) return "";
            var d = String(iso);
            if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
            var parts = d.split("-");
            return parts[2] + "/" + parts[1] + "/" + parts[0];
        };
        var a = fmt(awal);
        var b = fmt(akhir);
        if (a && b) return a + " – " + b;
        return a || b || "—";
    },

    /**
     * 1 Parent = 1 memo. Validasi budget ≤ sisa plafon.
     */
    createOne: function (header, parent) {
        if (!parent) throw new Error("Parent wajib dipilih");
        var bi = header && header.biBudget ? header.biBudget : this.getPlafonStatus();
        if (!bi) throw new Error("Plafon BI belum tersedia");
        var budget = Number(parent.budgetMemo) || 0;
        if (budget <= 0) throw new Error("Budget memo harus > 0");

        var periodCheck = this.validatePeriode(
            header && header.tanggalPeriodeAwal,
            header && header.tanggalPeriodeAkhir
        );
        if (!periodCheck.ok) throw new Error(periodCheck.message);

        var available = bi.availableAmount != null
            ? Number(bi.availableAmount)
            : Math.max(0, (Number(bi.grossAmount != null ? bi.grossAmount : bi.amount) || 0) - this.sumAllocated(bi.id));
        if (budget > available) {
            throw new Error("Budget melebihi sisa plafon (" + this.formatRp(available) + ")");
        }

        var list = this.load();
        var now = new Date().toISOString();
        var gross = Number(bi.grossAmount != null ? bi.grossAmount : bi.amount) || 0;
        var row = {
            id: "M" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
            batchId: "B" + Date.now().toString(36),
            nomorMemo: this.generateNomor(),
            namaMemo: (header && header.namaMemo) || "",
            description: (header && header.description) || "",
            biBudgetId: bi.id || "",
            biBudgetKode: bi.kode || "",
            biBudgetNama: bi.nama || "",
            biBudgetAmount: gross,
            budgetMemo: budget,
            tanggalPeriodeAwal: (header && header.tanggalPeriodeAwal) || "",
            tanggalPeriodeAkhir: (header && header.tanggalPeriodeAkhir) || "",
            subdistId: parent.id,
            kodeKmmd: parent.kodeKmmd,
            namaKmmd: parent.namaKmmd,
            namaGroup: parent.namaGroup,
            parent: "YA",
            shipToSiteUseId: parent.shipToSiteUseId || "",
            region: parent.region || "",
            createdAt: now
        };
        list.unshift(row);
        this.save(list);
        return row;
    },

    formatRp: function (n) {
        var v = Number(n) || 0;
        return "Rp " + v.toLocaleString("id-ID");
    },

    formatCurrencyInput: function (raw) {
        var digits = String(raw == null ? "" : raw).replace(/\D/g, "");
        if (!digits) return "";
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

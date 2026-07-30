/**
 * Monitoring Claim EPM — CSV LISTING_CLAIM
 * Local  → Claim API sidecar :5055
 * Vercel → /api/claims/* (WebDAV + Blob)
 */
const MonitoringSubdist = {
    summaryTable: null,
    detailTable: null,
    childTable: null,
    currentBranch: null,
    summaryKpis: null,
    mappedRows: [],
    detailRowsCache: [],
    trxFilterBound: false,
    trxDateFilterFn: null,

    /** Local sidecar vs Vercel serverless */
    getApiBase: function () {
        const h = window.location.hostname;
        const port = window.location.port;
        const proto = window.location.protocol;
        // file:// atau Live Server biasa → sidecar lokal
        if (proto === 'file:') return 'http://127.0.0.1:5055';
        if (h === 'localhost' || h === '127.0.0.1') {
            // vercel dev biasanya :3000
            if (port === '3000' || port === '3001') return '';
            return 'http://127.0.0.1:5055';
        }
        // production / preview Vercel (atau domain custom)
        return '';
    },

    init: async function () {
        await MappingSubdistStore.ensureSwal();
        await DfDataTable.ensureAssets();
        this.bindEvents();
        await this.loadSummary();
    },

    bindEvents: function () {
        document.getElementById('btnRefreshClaims').addEventListener('click', () => this.refresh());
        document.getElementById('btnBackSummary').addEventListener('click', () => this.showSummaryView());

        const search = document.getElementById('filterSummarySearch');
        if (search) {
            search.addEventListener('input', () => this.applySummaryFilter());
        }

        ['tab-detail-trx', 'tab-detail-jenis', 'tab-detail-child'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('shown.bs.tab', () => {
                    if (id === 'tab-detail-trx') this.scheduleAdjust(this.detailTable);
                    if (id === 'tab-detail-child') this.scheduleAdjust(this.childTable);
                });
            }
        });

        this.bindTrxToolbar();
    },

    bindTrxToolbar: function () {
        if (this.trxFilterBound) return;
        this.trxFilterBound = true;
        const self = this;

        const from = document.getElementById('filterTrxDateFrom');
        const to = document.getElementById('filterTrxDateTo');
        const q = document.getElementById('filterTrxSearch');
        const showCodes = document.getElementById('chkTrxShowCodes');
        const compact = document.getElementById('chkTrxCompact');
        const reset = document.getElementById('btnTrxResetFilter');
        const exportBtn = document.getElementById('btnTrxExport');

        const apply = () => self.applyTrxFilters();
        if (from) from.addEventListener('change', apply);
        if (to) to.addEventListener('change', apply);
        if (q) {
            let t = null;
            q.addEventListener('input', () => {
                clearTimeout(t);
                t = setTimeout(apply, 200);
            });
        }
        if (showCodes) {
            showCodes.addEventListener('change', () => {
                const tbl = document.getElementById('tblClaimDetail');
                if (!tbl) return;
                tbl.classList.toggle('show-codes', showCodes.checked);
            });
        }
        if (compact) {
            compact.addEventListener('change', () => {
                const tbl = document.getElementById('tblClaimDetail');
                if (!tbl) return;
                tbl.classList.toggle('compact', compact.checked);
                self.scheduleAdjust(self.detailTable);
            });
        }
        if (reset) {
            reset.addEventListener('click', () => {
                if (from) from.value = '';
                if (to) to.value = '';
                if (q) q.value = '';
                self.applyTrxFilters();
            });
        }
        if (exportBtn) {
            exportBtn.addEventListener('click', () => self.exportTrxCsv());
        }
    },

    /** yyyymmdd number from Date / claim date string */
    trxDateKey: function (v) {
        const d = this.parseClaimTrxDate(v);
        if (!d) return null;
        return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    },

    dateInputToKey: function (ymd) {
        if (!ymd) return null;
        const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(ymd).trim());
        if (!m) return null;
        return Number(m[1]) * 10000 + Number(m[2]) * 100 + Number(m[3]);
    },

    ensureTrxDateFilter: function () {
        const $ = window.jQuery;
        if (!$ || !$.fn || !$.fn.dataTable) return;
        const self = this;
        if (this.trxDateFilterFn) {
            const idx = $.fn.dataTable.ext.search.indexOf(this.trxDateFilterFn);
            if (idx >= 0) $.fn.dataTable.ext.search.splice(idx, 1);
        }
        this.trxDateFilterFn = function (settings, data, dataIndex) {
            if (!settings.nTable || settings.nTable.id !== 'tblClaimDetail') return true;
            const api = new $.fn.dataTable.Api(settings);
            const row = api.row(dataIndex).data();
            if (!row) return true;
            const fromKey = self.dateInputToKey((document.getElementById('filterTrxDateFrom') || {}).value);
            const toKey = self.dateInputToKey((document.getElementById('filterTrxDateTo') || {}).value);
            if (fromKey == null && toKey == null) return true;
            const key = self.trxDateKey(row.trxDate);
            if (key == null) return false;
            if (fromKey != null && key < fromKey) return false;
            if (toKey != null && key > toKey) return false;
            return true;
        };
        $.fn.dataTable.ext.search.push(this.trxDateFilterFn);
    },

    applyTrxFilters: function () {
        if (!this.detailTable) {
            this.updateTrxFilterHint(0, 0);
            return;
        }
        const q = ((document.getElementById('filterTrxSearch') || {}).value || '').trim();
        this.detailTable.search(q).draw();
        const info = this.detailTable.page.info();
        this.updateTrxFilterHint(info.recordsDisplay, info.recordsTotal);
        this.updateTrxFilterTotal(info.recordsDisplay);
    },

    updateTrxFilterHint: function (shown, total) {
        const el = document.getElementById('trxFilterHint');
        if (!el) return;
        const from = (document.getElementById('filterTrxDateFrom') || {}).value;
        const to = (document.getElementById('filterTrxDateTo') || {}).value;
        const q = ((document.getElementById('filterTrxSearch') || {}).value || '').trim();
        const filtered = !!(from || to || q);
        if (!total) {
            el.textContent = '';
            return;
        }
        if (!filtered) {
            el.textContent = `Menampilkan ${total.toLocaleString('id-ID')} transaksi · urut tanggal terbaru.`;
            return;
        }
        el.textContent = `Filter aktif: ${shown.toLocaleString('id-ID')} dari ${total.toLocaleString('id-ID')} transaksi.`;
    },

    updateTrxFilterTotal: function (shownCount) {
        // optional: no-op placeholder for future KPI sync with filtered set
        void shownCount;
    },

    resetTrxToolbar: function () {
        const from = document.getElementById('filterTrxDateFrom');
        const to = document.getElementById('filterTrxDateTo');
        const q = document.getElementById('filterTrxSearch');
        if (from) from.value = '';
        if (to) to.value = '';
        if (q) q.value = '';
        const hint = document.getElementById('trxFilterHint');
        if (hint) hint.textContent = '';
    },

    exportTrxCsv: function () {
        if (!this.detailTable) {
            MappingSubdistStore.toast('warning', 'Belum ada data transaksi');
            return;
        }
        const esc = MappingSubdistStore.esc;
        const self = this;
        const rows = [];
        this.detailTable.rows({ search: 'applied' }).every(function () {
            const r = this.data();
            if (!r) return;
            rows.push([
                self.formatDateOnly(r.trxDate, 'display'),
                r.trxNumber || '',
                r.custNumber || '',
                r.custName || '',
                r.itemCode || '',
                r.itemName || '',
                r.suratReferensi || '',
                String(Number(r.totalRp) || 0)
            ]);
        });
        if (!rows.length) {
            MappingSubdistStore.toast('warning', 'Tidak ada baris untuk di-export (cek filter)');
            return;
        }
        const header = ['Tanggal', 'No Transaksi', 'Kode Customer', 'Customer', 'Kode Item', 'Nama Item', 'Referensi', 'Total Rp'];
        const lines = [header].concat(rows).map(cols =>
            cols.map(c => {
                const s = String(c == null ? '' : c);
                return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
            }).join(',')
        );
        const blob = new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const a = document.createElement('a');
        const branch = (this.currentBranch && (this.currentBranch.code || this.currentBranch.branch)) || 'detail';
        a.href = URL.createObjectURL(blob);
        a.download = `monitoring-trx-${branch}-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            URL.revokeObjectURL(a.href);
            a.remove();
        }, 500);
        MappingSubdistStore.toast('success', `Export ${rows.length.toLocaleString('id-ID')} baris`);
        void esc;
    },

    api: async function (path, options) {
        const res = await fetch(this.getApiBase() + path, Object.assign({
            headers: { 'Content-Type': 'application/json' }
        }, options || {}));
        let data = null;
        try { data = await res.json(); } catch (e) { data = null; }
        if (!res.ok) {
            const msg = (data && data.message) || ('HTTP ' + res.status);
            throw new Error(msg);
        }
        return data;
    },

    setStatus: function (text, isError) {
        const el = document.getElementById('apiStatus');
        if (!el) return;
        // Header minimalis: status API hanya tampil saat error
        if (isError && text) {
            el.textContent = text;
            el.classList.remove('d-none');
        } else {
            el.textContent = '';
            el.classList.add('d-none');
        }
    },

    /** ISO / Date → "23 Juli 2026, 17:17 WIB" */
    formatWib: function (iso) {
        if (!iso) return '—';
        const d = new Date(iso);
        if (isNaN(d.getTime())) return String(iso);
        const datePart = d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            timeZone: 'Asia/Jakarta'
        });
        const timePart = d.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'Asia/Jakarta'
        });
        return `${datePart}, ${timePart} WIB`;
    },

    setLastUpdate: function (meta) {
        const el = document.getElementById('lastUpdateLabel');
        if (!el) return;
        if (!meta || !meta.lastUpdated) {
            el.textContent = 'Last update: —';
            return;
        }
        el.textContent = `Last update: ${this.formatWib(meta.lastUpdated)}`;
    },

    formatRp: function (n) {
        const v = Number(n) || 0;
        return v.toLocaleString('id-ID', { maximumFractionDigits: 0 });
    },

    /** Parse TRX_DATE Claim EPM (`01-JUL-26`) / ISO / Date → Date lokal. */
    parseClaimTrxDate: function (v) {
        if (!v) return null;
        if (v instanceof Date) return isNaN(v.getTime()) ? null : v;
        const s = String(v).trim();
        const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
        if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
        const mon = {
            JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
            JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11
        };
        const m = /^(\d{1,2})-([A-Za-z]{3})-(\d{2})$/.exec(s);
        if (m && mon[m[2].toUpperCase()] != null) {
            const yy = Number(m[3]);
            const year = yy >= 70 ? 1900 + yy : 2000 + yy;
            return new Date(year, mon[m[2].toUpperCase()], Number(m[1]));
        }
        const d = new Date(s);
        return isNaN(d.getTime()) ? null : d;
    },

    /** Tampil dd/MM/yyyy; sort key yyyymmdd. */
    formatDateOnly: function (v, type) {
        const d = this.parseClaimTrxDate(v);
        if (!d) {
            if (type === 'sort' || type === 'type') return 0;
            return v ? String(v) : '';
        }
        if (type === 'sort' || type === 'type') {
            return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
        }
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        return `${dd}/${mm}/${d.getFullYear()}`;
    },

    formatPreviousRp: function (n) {
        if (n == null || n === '') return '—';
        return this.formatRp(n);
    },

    formatSelisih: function (n) {
        if (n == null || n === '') return '—';
        const v = Number(n) || 0;
        const cls = v > 0 ? 'text-success' : (v < 0 ? 'text-danger' : 'text-muted');
        const sign = v > 0 ? '+' : '';
        return `<span class="${cls} fw-semibold">${sign}${this.formatRp(v)}</span>`;
    },

    /**
     * Samakan ejaan Branch EPM (mapping/Bosnet) dengan nama BRANCH di CSV Claim EPM.
     * Contoh kritis: seed "Yogya" vs CSV "YOGYAKARTA" (CV. Trio Hutama Magelang).
     */
    BRANCH_NAME_ALIASES: {
        YOGYA: 'YOGYAKARTA',
        JOGJA: 'YOGYAKARTA',
        JOGJAKARTA: 'YOGYAKARTA',
        MAKASAR: 'MAKASSAR',
        'JAKARTA 1': 'JAKARTA-1',
        'JAKARTA 2': 'JAKARTA-2',
        'JAKARTA 3': 'JAKARTA-3',
        'SURABAYA 1': 'SURABAYA',
        'SURABAYA 2': 'SURABAYA',
        PEKANBARU: 'PEKAN BARU'
    },

    normalizeBranchName: function (name) {
        let n = String(name || '').trim().toUpperCase().replace(/\s+/g, ' ');
        n = n.replace(/^JAKARTA\s+(\d)$/, 'JAKARTA-$1');
        return this.BRANCH_NAME_ALIASES[n] || n;
    },

    enrichWithSubdist: function (summaryRows) {
        const masters = MappingSubdistStore.load();
        const byShipTo = new Map();
        masters.forEach(m => {
            const ship = String(m.shipToSiteUseId || m.outletId || '').trim().toUpperCase();
            if (ship && !byShipTo.has(ship)) byShipTo.set(ship, m);
        });

        return summaryRows.map(s => {
            const shipRaw = String(s.shipToSiteUseId || s.key || '').trim();
            const shipKey = shipRaw.toUpperCase();
            const mapped = (shipRaw && shipRaw !== '_UNKNOWN_') ? (byShipTo.get(shipKey) || null) : null;
            return Object.assign({}, s, {
                shipToSiteUseId: shipRaw === '_UNKNOWN_' ? '' : shipRaw,
                subdistLabel: mapped
                    ? (mapped.namaKmmd || mapped.namaGroup || '—')
                    : '— (belum mapping)',
                mappedKodeKmmd: mapped ? mapped.kodeKmmd : '',
                mappedId: mapped ? mapped.id : '',
                status: mapped ? (mapped.parent === 'YA' ? 'Parent' : 'Child') : '',
                mapped: !!mapped,
                mapping: mapped
            });
        });
    },

    loadSummary: async function () {
        const btn = document.getElementById('btnRefreshClaims');
        try {
            this.setStatus('Menghubungkan Claim API...');
            const data = await this.api('/api/claims/summary');
            this.setLastUpdate(data.meta);

            const enriched = this.enrichWithSubdist(data.summary || []);
            // Ringkasan: Parent saja. Child match tetap "mapped" (bukan Unmapped), budget-nya di tab Child.
            const mappedAny = enriched.filter(r => r.mapped);
            const parentRows = mappedAny.filter(r => r.status === 'Parent');
            const unmappedCount = enriched.length - mappedAny.length;
            this.allSummaryRows = enriched;

            // Total / Sebelumnya / Selisih di ringkasan Parent = gabungan grup (Parent + Child)
            const parents = parentRows.map(p => {
                const g = this.getGroupClaimTotals(p.mapping);
                return Object.assign({}, p, {
                    ownTotalRp: Number(p.totalRp) || 0,
                    totalRp: g.totalRp,
                    previousTotalRp: g.previousTotalRp,
                    selisihRp: g.selisihRp
                });
            });
            this.mappedRows = parents;

            this.renderKpis({
                grandTotalRp: parents.reduce((s, r) => s + (Number(r.totalRp) || 0), 0),
                mappedCount: parents.length,
                unmappedCount
            });
            this.setStatus(
                `API OK · ${data.rowCount || 0} baris · ${parents.length} Parent ter-mapping (ShipTo)` +
                (unmappedCount > 0 ? ` · ${unmappedCount} ShipTo belum mapping` : '')
            );
            this.renderSummary(parents);
            this.applySummaryFilter();
            this.showSummaryView();
        } catch (e) {
            const isVercel = !this.getApiBase();
            this.setStatus(
                isVercel
                    ? (e.message || 'Claim API Vercel gagal. Cek env WebDAV + Blob.')
                    : 'Claim API tidak aktif. Jalankan tools/claim-api/start-claim-api.bat',
                true
            );
            this.setLastUpdate(null);
            MappingSubdistStore.toast('warning', e.message || 'Gagal load summary');
            this.mappedRows = [];
            this.renderKpis(null);
            this.renderSummary([]);
        } finally {
            if (btn) btn.disabled = false;
        }
    },

    refresh: async function () {
        const btn = document.getElementById('btnRefreshClaims');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Refreshing...';
        }
        try {
            this.setStatus('');
            const result = await this.api('/api/claims/refresh', {
                method: 'POST',
                body: JSON.stringify({})
            });
            MappingSubdistStore.toast(result.ok ? 'success' : 'warning', result.message || 'Refresh selesai');
            this.setLastUpdate(result.meta);
            await this.loadSummary();
        } catch (e) {
            const msg = e.message || 'Refresh gagal';
            // Data yang sudah tampil tetap dipakai; jangan biarkan banner merah nempel
            this.setStatus('');
            if (/BLOB_READ_WRITE_TOKEN/i.test(msg)) {
                await MappingSubdistStore.ensureSwal();
                if (typeof Swal !== 'undefined') {
                    await Swal.fire({
                        icon: 'info',
                        title: 'Refresh cloud belum siap',
                        html: 'Di Vercel, tombol Refresh butuh <b>Vercel Blob</b>.<br><br>' +
                            '1. Vercel → Project → <b>Storage</b> → buat/hubungkan <b>Blob</b><br>' +
                            '2. Pastikan env <code>BLOB_READ_WRITE_TOKEN</code> terisi<br>' +
                            '3. Isi juga <code>CLAIM_WEBDAV_URL/USER/PASS</code><br>' +
                            '4. Redeploy, lalu Refresh lagi<br><br>' +
                            '<small class="text-muted">Tanpa itu, halaman tetap bisa baca data dari file yang sudah di-commit — hanya Refresh live yang belum jalan.</small>',
                        confirmButtonText: 'Mengerti'
                    });
                } else {
                    MappingSubdistStore.toast('warning', msg);
                }
            } else if (/private store|public access/i.test(msg)) {
                await MappingSubdistStore.ensureSwal();
                if (typeof Swal !== 'undefined') {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Blob store private',
                        html: 'Store Blob kamu <b>private</b>, sedangkan kode lama memakai public access.<br><br>' +
                            'Sudah diperbaiki di kode (access private). <b>Push & redeploy</b>, lalu Refresh lagi.',
                        confirmButtonText: 'Mengerti'
                    });
                } else {
                    MappingSubdistStore.toast('error', msg);
                }
            } else {
                MappingSubdistStore.toast('error', msg);
            }
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-sync-alt me-1"></i> Refresh';
            }
        }
    },

    setKpi: function (id, value, label) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
        const lbl = document.getElementById(id + 'Label');
        if (lbl && label) lbl.textContent = label;
    },

    setKpiIcons: function (mode) {
        const total = document.getElementById('kpiIconTotal');
        const mapped = document.getElementById('kpiIconMapped');
        const unmapped = document.getElementById('kpiIconUnmapped');
        if (mode === 'detail') {
            if (total) total.className = 'fas fa-money-bill-wave';
            if (mapped) mapped.className = 'fas fa-history';
            if (unmapped) unmapped.className = 'fas fa-chart-line';
            return;
        }
        if (total) total.className = 'fas fa-money-bill-wave';
        if (mapped) mapped.className = 'fas fa-sitemap';
        if (unmapped) unmapped.className = 'fas fa-unlink';
    },

    renderKpis: function (data) {
        this.summaryKpis = data;
        const unmappedEl = document.getElementById('kpiUnmapped');
        if (unmappedEl) unmappedEl.className = 'fw-bold mb-0';
        this.setKpiIcons('summary');
        if (!data) {
            this.setKpi('kpiTotal', '—', 'Total (Rp)');
            this.setKpi('kpiMapped', '—', 'SubDist Ter-mapping');
            this.setKpi('kpiUnmapped', '—', 'Belum Mapping');
            return;
        }
        this.setKpi('kpiTotal', this.formatRp(data.grandTotalRp), 'Total (Rp)');
        this.setKpi('kpiMapped', (data.mappedCount || 0).toLocaleString('id-ID'), 'SubDist Ter-mapping');
        this.setKpi('kpiUnmapped', (data.unmappedCount || 0).toLocaleString('id-ID'), 'Belum Mapping');
    },

    /** KPI detail: Total / Sebelumnya / Selisih = gabungan Parent + Child di grup */
    renderDetailKpis: function (groupTotals, detailRows, totalMatched) {
        const totalRp = groupTotals ? (Number(groupTotals.totalRp) || 0) : 0;
        const prev = groupTotals ? groupTotals.previousTotalRp : null;
        const selisih = groupTotals ? groupTotals.selisihRp : null;

        this.setKpiIcons('detail');
        this.setKpi('kpiTotal', this.formatRp(totalRp), 'Total grup (Rp)');
        this.setKpi(
            'kpiMapped',
            prev == null ? '—' : this.formatRp(prev),
            'Sebelumnya grup (Rp)'
        );

        const unmappedEl = document.getElementById('kpiUnmapped');
        if (selisih == null || selisih === '') {
            this.setKpi('kpiUnmapped', '—', 'Selisih grup (Rp)');
            if (unmappedEl) unmappedEl.className = 'fw-bold mb-0';
        } else {
            const v = Number(selisih) || 0;
            const sign = v > 0 ? '+' : '';
            this.setKpi('kpiUnmapped', sign + this.formatRp(v), 'Selisih grup (Rp)');
            if (unmappedEl) {
                unmappedEl.className = 'fw-bold mb-0 ' +
                    (v > 0 ? 'text-success' : (v < 0 ? 'text-danger' : 'text-muted'));
            }
        }

        this.renderDetailStory(totalRp, prev, selisih, totalMatched, detailRows);
    },

    renderDetailStory: function (totalRp, prev, selisih, totalMatched, detailRows) {
        const el = document.getElementById('detailStory');
        if (!el) return;
        const trx = totalMatched || (detailRows || []).length || 0;
        const customers = new Set((detailRows || []).map(r => r.custNumber).filter(Boolean)).size;

        let change = '';
        if (prev == null || selisih == null) {
            change = 'Total grup = Parent + Child. Belum ada pembanding file sebelumnya (extract pertama / belum ada snapshot).';
        } else {
            const v = Number(selisih) || 0;
            if (v === 0) {
                change = `Total grup sama dengan file sebelumnya (${this.formatRp(prev)}).`;
            } else if (v < 0) {
                change = `Total grup <strong class="text-danger">turun ${this.formatRp(Math.abs(v))}</strong> dibanding file sebelumnya (${this.formatRp(prev)} → ${this.formatRp(totalRp)}).`;
            } else {
                change = `Total grup <strong class="text-success">naik ${this.formatRp(v)}</strong> dibanding file sebelumnya (${this.formatRp(prev)} → ${this.formatRp(totalRp)}).`;
            }
        }

        el.innerHTML = `${change} · Tab Transaksi = ShipTo SubDist yang dibuka · ${trx.toLocaleString('id-ID')} transaksi · ${customers.toLocaleString('id-ID')} customer.`;
    },

    findSummaryRow: function (shipTo) {
        const ship = String(shipTo || '').trim();
        const rows = this.mappedRows || [];
        return rows.find(r => String(r.shipToSiteUseId || '') === ship) || null;
    },

    findClaimByShipTo: function (shipTo) {
        const ship = String(shipTo || '').trim();
        if (!ship) return null;
        const rows = this.allSummaryRows || this.mappedRows || [];
        return rows.find(r => String(r.shipToSiteUseId || '') === ship) || null;
    },

    findBudgetByShipTo: function (shipTo) {
        const hit = this.findClaimByShipTo(shipTo);
        if (!hit) {
            const ship = String(shipTo || '').trim();
            return ship ? 0 : null;
        }
        return Number(hit.totalRp) || 0;
    },

    /**
     * Total grup = Parent + semua Child (masing-masing dari ShipTo sendiri).
     * Dipakai card Total / Sebelumnya / Selisih di detail & kolom Total ringkasan Parent.
     */
    getGroupClaimTotals: function (mapping) {
        const groupParent = this.findGroupParent(mapping);
        if (!groupParent) {
            return { totalRp: 0, previousTotalRp: null, selisihRp: null, memberCount: 0 };
        }
        const members = [groupParent].concat(MappingSubdistStore.getChildren(groupParent) || []);
        let total = 0;
        let prevSum = 0;
        let anyPrev = false;
        let withShip = 0;
        members.forEach(m => {
            const ship = String(m.shipToSiteUseId || m.outletId || '').trim();
            if (!ship) return;
            withShip++;
            const hit = this.findClaimByShipTo(ship);
            total += hit ? (Number(hit.totalRp) || 0) : 0;
            if (hit && hit.previousTotalRp != null && hit.previousTotalRp !== '') {
                anyPrev = true;
                prevSum += Number(hit.previousTotalRp) || 0;
            }
        });
        return {
            totalRp: total,
            previousTotalRp: anyPrev ? prevSum : null,
            selisihRp: anyPrev ? total - prevSum : null,
            memberCount: withShip
        };
    },

    /** Resolve group parent for child-mapping tab (Parent + siblings). */
    findGroupParent: function (mapping) {
        if (!mapping) return null;
        if (mapping.parent === 'YA') return mapping;
        const data = MappingSubdistStore.load();
        if (mapping.parentKode) {
            const byId = data.find(d => d.id === mapping.parentKode || d.kodeKmmd === mapping.parentKode);
            if (byId && byId.parent === 'YA') return byId;
        }
        const group = mapping.namaGroup;
        if (group && group !== 'Non Group') {
            return data.find(d => d.parent === 'YA' && d.namaGroup === group) || mapping;
        }
        return mapping;
    },

    findMappedByShipTo: function (shipTo) {
        const ship = String(shipTo || '').trim();
        if (!ship) return null;
        return MappingSubdistStore.load().find(m =>
            String(m.shipToSiteUseId || m.outletId || '').trim() === ship
        ) || null;
    },

    renderDetailJenis: function (summaryRow, detailRows) {
        const body = document.getElementById('tblDetailJenisBody');
        const bars = document.getElementById('detailJenisBars');
        if (!body) return;

        const keys = [
            { key: 'RP_LUMPSUM', label: 'Lumpsum' },
            { key: 'RP_EDPH_PRIN', label: 'EDPH' },
            { key: 'RP_PROMOSI', label: 'Promosi' },
            { key: 'RP_EDHL', label: 'EDHL' }
        ];

        let totals = { RP_LUMPSUM: 0, RP_EDPH_PRIN: 0, RP_PROMOSI: 0, RP_EDHL: 0 };
        if (summaryRow && summaryRow.totals) {
            keys.forEach(k => { totals[k.key] = Number(summaryRow.totals[k.key]) || 0; });
        } else {
            (detailRows || []).forEach(r => {
                const a = r.amounts || {};
                keys.forEach(k => { totals[k.key] += Number(a[k.key]) || 0; });
            });
        }

        const grand = keys.reduce((s, k) => s + totals[k.key], 0) || 1;
        body.innerHTML = keys.map(k => {
            const v = totals[k.key];
            const pct = ((v / grand) * 100).toFixed(1);
            return `<tr>
                <td>${k.label}</td>
                <td class="text-end">${this.formatRp(v)}</td>
                <td class="text-end">${pct}%</td>
            </tr>`;
        }).join('');

        if (bars) {
            bars.innerHTML = keys.map(k => {
                const v = totals[k.key];
                const pct = Math.max(0, Math.min(100, (v / grand) * 100));
                return `<div class="mb-2">
                    <div class="d-flex justify-content-between small mb-1">
                        <span>${k.label}</span><span>${this.formatRp(v)}</span>
                    </div>
                    <div class="progress" style="height:8px;">
                        <div class="progress-bar" role="progressbar" style="width:${pct}%;"></div>
                    </div>
                </div>`;
            }).join('');
        }
    },

    renderDetailChildren: function (mapping) {
        const note = document.getElementById('detailChildNote');
        const groupParent = this.findGroupParent(mapping);

        if (!groupParent) {
            this.childTable = DfDataTable.init('#tblDetailChild', {
                data: [],
                columns: [
                    { orderable: true },
                    { orderable: true },
                    { orderable: true, className: 'text-center' },
                    { orderable: true },
                    { orderable: true },
                    { orderable: true, className: 'text-end' }
                ],
                language: Object.assign({}, DfDataTable.language, {
                    emptyTable: 'Mapping tidak ditemukan untuk ShipTo ini'
                })
            });
            return;
        }

        const children = MappingSubdistStore.getChildren(groupParent) || [];
        if (note) {
            note.textContent = children.length
                ? `Grup "${groupParent.namaGroup || groupParent.namaKmmd}" · kolom Budget = ShipTo masing-masing · card Total di atas = jumlah Parent + Child.`
                : `SubDist "${groupParent.namaKmmd}" · budget dari ShipTo mapping ini.`;
        }

        const esc = MappingSubdistStore.esc;
        const self = this;
        const budgetOf = function (m) {
            const ship = String(m.shipToSiteUseId || m.outletId || '').trim();
            if (!ship) return null;
            return self.findBudgetByShipTo(ship);
        };
        const rows = [
            {
                kodeKmmd: groupParent.kodeKmmd,
                namaKmmd: groupParent.namaKmmd,
                status: 'Parent',
                branchEpm: groupParent.branchEpm,
                linkedAt: '',
                budget: budgetOf(groupParent)
            }
        ].concat(children.map(c => ({
            kodeKmmd: c.kodeKmmd,
            namaKmmd: c.namaKmmd,
            status: 'Child',
            branchEpm: c.branchEpm,
            linkedAt: c.linkedAt ? String(c.linkedAt).substring(0, 10) : '',
            budget: budgetOf(c)
        })));

        this.childTable = DfDataTable.init('#tblDetailChild', {
            data: rows,
            columns: [
                {
                    data: 'kodeKmmd',
                    render: function (d) { return `<code>${esc(d)}</code>`; }
                },
                { data: 'namaKmmd', defaultContent: '' },
                {
                    data: 'status',
                    className: 'text-center',
                    render: function (d, type) {
                        if (type === 'sort' || type === 'type') return d === 'Parent' ? 0 : 1;
                        return d === 'Parent'
                            ? '<span class="badge bg-success">Parent</span>'
                            : '<span class="badge bg-label-secondary">Child</span>';
                    }
                },
                { data: 'branchEpm', defaultContent: '' },
                {
                    data: 'linkedAt',
                    render: function (d, type) {
                        return d ? self.formatDateOnly(d, type) : (type === 'sort' || type === 'type' ? 0 : '');
                    }
                },
                {
                    data: 'budget',
                    className: 'text-end',
                    render: function (d) {
                        return d == null ? '—' : `<span class="fw-semibold">${self.formatRp(d)}</span>`;
                    }
                }
            ],
            order: [[2, 'asc'], [1, 'asc']],
            language: Object.assign({}, DfDataTable.language, {
                emptyTable: 'Belum ada struktur parent/child yang bisa ditampilkan untuk subdist ini'
            })
        });
        this.scheduleAdjust(this.childTable);
    },

    applySummaryFilter: function () {
        const q = (document.getElementById('filterSummarySearch') || {}).value || '';
        if (this.summaryTable && typeof this.summaryTable.search === 'function') {
            this.summaryTable.search(q).draw();
        }
    },

    renderSummary: function (rows) {
        const esc = MappingSubdistStore.esc;
        const self = this;
        const data = (rows || []).map(r => [
            `<div class="text-center">
                <button type="button" class="btn btn-sm btn-outline-primary btn-open-detail"
                    data-shipto="${esc(r.shipToSiteUseId)}"
                    data-branch="${esc(r.branchName)}"
                    data-code="${esc(r.branchCode)}"
                    data-subdist="${esc(r.subdistLabel)}">Detail</button>
             </div>`,
            esc(r.subdistLabel),
            esc(r.branchName),
            `<code>${esc(r.branchCode)}</code>`,
            self.formatRp(r.totals && r.totals.RP_LUMPSUM),
            self.formatRp(r.totals && r.totals.RP_EDPH_PRIN),
            self.formatRp(r.totals && r.totals.RP_PROMOSI),
            self.formatRp(r.totals && r.totals.RP_EDHL),
            self.formatRp(r.totalRp),
            self.formatPreviousRp(r.previousTotalRp),
            self.formatSelisih(r.selisihRp)
        ]);

        this.summaryTable = DfDataTable.init('#tblClaimSummary', {
            data,
            columns: [
                { orderable: false, searchable: false, className: 'text-center' },
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true, className: 'text-end' },
                { orderable: true, className: 'text-end' },
                { orderable: true, className: 'text-end' },
                { orderable: true, className: 'text-end' },
                { orderable: true, className: 'text-end' },
                { orderable: true, className: 'text-end' },
                { orderable: true, className: 'text-end' }
            ],
            order: [[8, 'desc']],
            language: Object.assign({}, DfDataTable.language, {
                emptyTable: 'Belum ada data. Jalankan Claim API (start-claim-api.bat) lalu klik Refresh.'
            })
        });

        const $ = window.jQuery;
        if ($ && this.summaryTable) {
            $('#tblClaimSummary').off('click', '.btn-open-detail').on('click', '.btn-open-detail', function () {
                self.openDetail(
                    this.getAttribute('data-shipto'),
                    this.getAttribute('data-branch'),
                    this.getAttribute('data-code'),
                    this.getAttribute('data-subdist')
                );
            });
        }
    },

    showSummaryView: function () {
        document.getElementById('viewSummary').style.display = '';
        document.getElementById('viewDetail').style.display = 'none';
        const story = document.getElementById('detailStory');
        if (story) story.innerHTML = '';
        const unmappedEl = document.getElementById('kpiUnmapped');
        if (unmappedEl) unmappedEl.className = 'fw-bold mb-0';
        this.renderKpis(this.summaryKpis || null);
        this.scheduleAdjust(this.summaryTable);
        // reset tab ke transaksi
        const tabTrx = document.getElementById('tab-detail-trx');
        if (tabTrx && window.bootstrap && bootstrap.Tab) {
            bootstrap.Tab.getOrCreateInstance(tabTrx).show();
        }
    },

    openDetail: async function (shipTo, branch, code, subdistLabel) {
        this.currentBranch = { shipTo, branch, code, subdistLabel };
        document.getElementById('viewSummary').style.display = 'none';
        document.getElementById('viewDetail').style.display = '';

        const titleName = (subdistLabel && subdistLabel !== '—')
            ? subdistLabel
            : (branch || code || shipTo || '—');
        document.getElementById('detailTitle').textContent = titleName;
        document.getElementById('detailHint').textContent = 'Memuat transaksi...';
        const story = document.getElementById('detailStory');
        if (story) story.textContent = '';

        const summaryRow = this.findSummaryRow(shipTo);
        const mapping = this.findMappedByShipTo(shipTo);

        try {
            const qs = new URLSearchParams();
            if (shipTo) qs.set('shipTo', shipTo);
            if (branch) qs.set('branch', branch);
            if (code) qs.set('code', code);
            qs.set('limit', '8000');
            const data = await this.api('/api/claims/detail?' + qs.toString());
            const n = data.totalMatched || 0;
            const groupParent = this.findGroupParent(mapping);
            const childCount = groupParent ? (MappingSubdistStore.getChildren(groupParent) || []).length : 0;
            const hintParts = [
                shipTo ? `ShipTo ${shipTo}` : null,
                mapping ? (mapping.parent === 'YA' ? 'Parent' : 'Child') : null,
                code || null,
                branch || null,
                childCount ? `${childCount} child di grup` : null,
                `${n.toLocaleString('id-ID')} transaksi`
            ].filter(Boolean);
            if (data.count < data.totalMatched) {
                hintParts.push(`tampil ${data.count}`);
            }
            document.getElementById('detailHint').textContent = hintParts.join(' · ');
            const groupTotals = this.getGroupClaimTotals(mapping);
            this.renderDetailKpis(groupTotals, data.detail || [], data.totalMatched);
            this.renderDetailJenis(summaryRow, data.detail || []);
            this.renderDetailChildren(mapping);
            this.resetTrxToolbar();
            this.renderDetail(data.detail || []);
        } catch (e) {
            document.getElementById('detailHint').textContent = e.message || 'Gagal load detail';
            this.renderDetailKpis(this.getGroupClaimTotals(mapping), [], 0);
            this.renderDetailJenis(summaryRow, []);
            this.renderDetailChildren(mapping);
            this.resetTrxToolbar();
            this.renderDetail([]);
        }
    },

    renderDetail: function (rows) {
        const esc = MappingSubdistStore.esc;
        const self = this;
        this.detailRowsCache = rows || [];
        this.ensureTrxDateFilter();

        const data = (rows || []).map(r => ({
            trxDate: r.trxDate,
            trxNumber: r.trxNumber,
            custNumber: r.custNumber,
            custName: r.custName,
            itemCode: r.itemCode,
            itemName: r.itemName,
            suratReferensi: r.suratReferensi,
            totalRp: r.totalRp
        }));

        const showCodes = !!(document.getElementById('chkTrxShowCodes') || {}).checked;
        const compact = !!(document.getElementById('chkTrxCompact') || {}).checked;
        const tbl = document.getElementById('tblClaimDetail');
        if (tbl) {
            tbl.classList.toggle('show-codes', showCodes);
            tbl.classList.toggle('compact', compact);
        }

        this.detailTable = DfDataTable.init('#tblClaimDetail', {
            data,
            columns: [
                {
                    data: 'trxDate',
                    className: 'df-trx-date',
                    render: function (d, type) {
                        const formatted = self.formatDateOnly(d, type);
                        if (type === 'display') return `<span class="df-trx-date">${formatted}</span>`;
                        return formatted;
                    }
                },
                {
                    data: 'trxNumber',
                    render: function (d) {
                        return d ? `<code class="small">${esc(d)}</code>` : '—';
                    }
                },
                {
                    data: 'custName',
                    render: function (d, type, row) {
                        if (type === 'filter' || type === 'sort') {
                            return `${row.custName || ''} ${row.custNumber || ''}`.trim();
                        }
                        const name = esc(row.custName || '—');
                        const code = row.custNumber
                            ? `<div class="df-trx-code">${esc(row.custNumber)}</div>`
                            : '';
                        return `<div class="df-trx-name">${name}</div>${code}`;
                    }
                },
                {
                    data: 'itemName',
                    render: function (d, type, row) {
                        if (type === 'filter' || type === 'sort') {
                            return `${row.itemName || ''} ${row.itemCode || ''}`.trim();
                        }
                        const name = esc(row.itemName || '—');
                        const code = row.itemCode
                            ? `<div class="df-trx-code">${esc(row.itemCode)}</div>`
                            : '';
                        return `<div class="df-trx-name">${name}</div>${code}`;
                    }
                },
                {
                    data: 'suratReferensi',
                    render: function (d) {
                        const v = String(d || '').trim();
                        return v ? esc(v) : '<span class="text-muted">—</span>';
                    }
                },
                {
                    data: 'totalRp',
                    className: 'text-end',
                    render: function (d, type) {
                        if (type === 'sort' || type === 'type') return Number(d) || 0;
                        return `<span class="df-trx-total">${self.formatRp(d)}</span>`;
                    }
                }
            ],
            order: [[0, 'desc']],
            pageLength: 25,
            dom: '<"row mx-0 mb-3 align-items-center"<"col-sm-6"l><"col-sm-6">>rt<"row mx-0 mt-3 align-items-center"<"col-sm-5"i><"col-sm-7"p>>',
            language: Object.assign({}, DfDataTable.language, {
                emptyTable: 'Tidak ada transaksi untuk filter / branch ini'
            })
        });
        this.applyTrxFilters();
        this.scheduleAdjust(this.detailTable);
    },

    scheduleAdjust: function (api) {
        if (!api) return;
        setTimeout(() => DfDataTable.adjust(api), 50);
        setTimeout(() => DfDataTable.adjust(api), 250);
    }
};

window.MonitoringSubdist = MonitoringSubdist;

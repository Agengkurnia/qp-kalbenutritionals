/**
 * Monitoring Claim EPM — dari CSV LISTING_CLAIM (Claim API sidecar)
 */
const MonitoringSubdist = {
    API_BASE: 'http://127.0.0.1:5055',
    summaryTable: null,
    detailTable: null,
    currentBranch: null,
    summaryKpis: null,
    mappedRows: [],

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
    },

    api: async function (path, options) {
        const res = await fetch(this.API_BASE + path, Object.assign({
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

    enrichWithSubdist: function (summaryRows) {
        const masters = MappingSubdistStore.load().filter(d => d.parent === 'YA');
        const byCode = new Map();
        const byBranchName = new Map();
        masters.forEach(m => {
            if (m.kodeBranch) byCode.set(String(m.kodeBranch).trim(), m);
            if (m.branchEpm) byBranchName.set(String(m.branchEpm).trim().toUpperCase(), m);
        });

        return summaryRows.map(s => {
            const code = String(s.branchCode || '').trim();
            const name = String(s.branchName || '').trim().toUpperCase();
            const mapped = byCode.get(code) || byBranchName.get(name) || null;
            return Object.assign({}, s, {
                subdistLabel: mapped
                    ? (mapped.namaKmmd || mapped.namaGroup || '—')
                    : '— (belum mapping)',
                mappedKodeKmmd: mapped ? mapped.kodeKmmd : '',
                mapped: !!mapped
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
            const mapped = enriched.filter(r => r.mapped);
            const unmappedCount = enriched.length - mapped.length;
            this.mappedRows = mapped;

            this.renderKpis({
                grandTotalRp: mapped.reduce((s, r) => s + (Number(r.totalRp) || 0), 0),
                mappedCount: mapped.length,
                unmappedCount
            });
            this.setStatus(
                `API OK · ${data.rowCount || 0} baris · ${mapped.length} ter-mapping` +
                (unmappedCount > 0 ? ` · ${unmappedCount} belum mapping (disembunyikan)` : '')
            );
            this.renderSummary(mapped);
            this.applySummaryFilter();
            this.showSummaryView();
        } catch (e) {
            this.setStatus('Claim API tidak aktif. Jalankan tools/claim-api/start-claim-api.bat', true);
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
            this.setStatus('Download + extract berjalan...');
            const result = await this.api('/api/claims/refresh', {
                method: 'POST',
                body: JSON.stringify({})
            });
            MappingSubdistStore.toast(result.ok ? 'success' : 'warning', result.message || 'Refresh selesai');
            this.setLastUpdate(result.meta);
            await this.loadSummary();
        } catch (e) {
            MappingSubdistStore.toast('error', e.message || 'Refresh gagal');
            this.setStatus(e.message || 'Refresh gagal', true);
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

    renderKpis: function (data) {
        this.summaryKpis = data;
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

    /** KPI dihitung ulang dari transaksi detail (per SubDist) */
    renderDetailKpis: function (rows, totalMatched) {
        const customers = new Set((rows || []).map(r => r.custNumber).filter(Boolean));
        const totalRp = (rows || []).reduce((s, r) => s + (Number(r.totalRp) || 0), 0);
        this.setKpi('kpiTotal', this.formatRp(totalRp), 'Total (Rp) SubDist Ini');
        this.setKpi('kpiMapped', (totalMatched || rows.length || 0).toLocaleString('id-ID'), 'Transaksi SubDist Ini');
        this.setKpi('kpiUnmapped', customers.size.toLocaleString('id-ID'), 'Customer');
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
            self.formatRp(r.totalRp)
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
        this.renderKpis(this.summaryKpis || null);
        this.scheduleAdjust(this.summaryTable);
    },

    openDetail: async function (branch, code, subdistLabel) {
        this.currentBranch = { branch, code, subdistLabel };
        document.getElementById('viewSummary').style.display = 'none';
        document.getElementById('viewDetail').style.display = '';

        const titleName = (subdistLabel && subdistLabel !== '—')
            ? subdistLabel
            : (branch || code || '—');
        document.getElementById('detailTitle').textContent = titleName;
        document.getElementById('detailHint').textContent = 'Memuat transaksi...';

        try {
            const qs = new URLSearchParams();
            if (branch) qs.set('branch', branch);
            if (code) qs.set('code', code);
            qs.set('limit', '8000');
            const data = await this.api('/api/claims/detail?' + qs.toString());
            const n = data.totalMatched || 0;
            const hintParts = [
                code || '—',
                branch || '—',
                `${n.toLocaleString('id-ID')} transaksi`
            ];
            if (data.count < data.totalMatched) {
                hintParts.push(`tampil ${data.count}`);
            }
            document.getElementById('detailHint').textContent = hintParts.join(' · ');
            this.renderDetailKpis(data.detail || [], data.totalMatched);
            this.renderDetail(data.detail || []);
        } catch (e) {
            document.getElementById('detailHint').textContent = e.message || 'Gagal load detail';
            this.renderDetailKpis([], 0);
            this.renderDetail([]);
        }
    },

    renderDetail: function (rows) {
        const esc = MappingSubdistStore.esc;
        const self = this;
        const data = (rows || []).map(r => [
            esc(r.trxDate),
            esc(r.trxNumber),
            esc(r.custNumber),
            esc(r.custName),
            esc(r.itemCode),
            esc(r.itemName),
            esc(r.suratReferensi),
            self.formatRp(r.totalRp)
        ]);

        this.detailTable = DfDataTable.init('#tblClaimDetail', {
            data,
            columns: [
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true, className: 'text-end' }
            ],
            order: [[0, 'desc']],
            pageLength: 25,
            language: Object.assign({}, DfDataTable.language, {
                emptyTable: 'Tidak ada transaksi'
            })
        });
        this.scheduleAdjust(this.detailTable);
    },

    scheduleAdjust: function (api) {
        if (!api) return;
        setTimeout(() => DfDataTable.adjust(api), 50);
        setTimeout(() => DfDataTable.adjust(api), 250);
    }
};

window.MonitoringSubdist = MonitoringSubdist;

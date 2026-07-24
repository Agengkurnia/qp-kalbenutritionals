/**
 * Monitoring Claim EPM — CSV LISTING_CLAIM
 * Local  → Claim API sidecar :5055
 * Vercel → /api/claims/* (WebDAV + Blob)
 */
const MonitoringSubdist = {
    summaryTable: null,
    detailTable: null,
    currentBranch: null,
    summaryKpis: null,
    mappedRows: [],

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
                });
            }
        });
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

    renderKpis: function (data) {
        this.summaryKpis = data;
        const unmappedEl = document.getElementById('kpiUnmapped');
        if (unmappedEl) unmappedEl.className = 'fw-bold mb-0';
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

    /** KPI dihitung ulang untuk konteks detail: Total / Sebelumnya / Selisih */
    renderDetailKpis: function (summaryRow, detailRows, totalMatched) {
        const totalRp = summaryRow
            ? Number(summaryRow.totalRp) || 0
            : (detailRows || []).reduce((s, r) => s + (Number(r.totalRp) || 0), 0);
        const prev = summaryRow ? summaryRow.previousTotalRp : null;
        const selisih = summaryRow ? summaryRow.selisihRp : null;

        this.setKpi('kpiTotal', this.formatRp(totalRp), 'Total hari ini (Rp)');
        this.setKpi(
            'kpiMapped',
            prev == null ? '—' : this.formatRp(prev),
            'Sebelumnya (Rp)'
        );

        const unmappedEl = document.getElementById('kpiUnmapped');
        if (selisih == null || selisih === '') {
            this.setKpi('kpiUnmapped', '—', 'Selisih (Rp)');
            if (unmappedEl) unmappedEl.className = 'fw-bold mb-0';
        } else {
            const v = Number(selisih) || 0;
            const sign = v > 0 ? '+' : '';
            this.setKpi('kpiUnmapped', sign + this.formatRp(v), 'Selisih (Rp)');
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
            change = 'Belum ada pembanding file sebelumnya (extract pertama / belum ada snapshot).';
        } else {
            const v = Number(selisih) || 0;
            if (v === 0) {
                change = `Nilai sama dengan file sebelumnya (${this.formatRp(prev)}).`;
            } else if (v < 0) {
                change = `Total <strong class="text-danger">turun ${this.formatRp(Math.abs(v))}</strong> dibanding file sebelumnya (${this.formatRp(prev)} → ${this.formatRp(totalRp)}).`;
            } else {
                change = `Total <strong class="text-success">naik ${this.formatRp(v)}</strong> dibanding file sebelumnya (${this.formatRp(prev)} → ${this.formatRp(totalRp)}).`;
            }
        }

        el.innerHTML = `${change} · ${trx.toLocaleString('id-ID')} transaksi · ${customers.toLocaleString('id-ID')} customer.`;
    },

    findSummaryRow: function (branch, code) {
        const rows = this.mappedRows || [];
        return rows.find(r =>
            String(r.branchCode || '') === String(code || '') &&
            String(r.branchName || '') === String(branch || '')
        ) || rows.find(r =>
            (code && String(r.branchCode || '') === String(code)) ||
            (branch && String(r.branchName || '').toUpperCase() === String(branch).toUpperCase())
        ) || null;
    },

    findMappedParent: function (branch, code) {
        const masters = MappingSubdistStore.load().filter(d => d.parent === 'YA');
        const codeHit = code
            ? masters.find(m => String(m.kodeBranch || '').trim() === String(code).trim())
            : null;
        if (codeHit) return codeHit;
        const name = String(branch || '').trim().toUpperCase();
        return masters.find(m => String(m.branchEpm || '').trim().toUpperCase() === name) || null;
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

    renderDetailChildren: function (parent) {
        const body = document.getElementById('tblDetailChildBody');
        const note = document.getElementById('detailChildNote');
        if (!body) return;

        if (!parent) {
            body.innerHTML = '<tr><td colspan="5" class="text-muted text-center">Parent mapping tidak ditemukan untuk branch ini.</td></tr>';
            return;
        }

        const children = MappingSubdistStore.getChildren(parent) || [];
        if (note) {
            note.textContent = children.length
                ? `Grup "${parent.namaGroup || parent.namaKmmd}" · ${children.length} child di Master Mapping. Nilai pecahan per child tidak selalu ada di CSV (sering agregat per branch).`
                : `Parent "${parent.namaKmmd}" belum punya child di mapping.`;
        }

        if (!children.length) {
            body.innerHTML = '<tr><td colspan="5" class="text-muted text-center">Belum ada child.</td></tr>';
            return;
        }

        const esc = MappingSubdistStore.esc;
        body.innerHTML = children.map(c => {
            const st = c.active === false
                ? '<span class="badge bg-label-danger">Non Active</span>'
                : '<span class="badge bg-label-success">Active</span>';
            return `<tr>
                <td><code>${esc(c.kodeKmmd)}</code></td>
                <td>${esc(c.namaKmmd)}</td>
                <td>${esc(c.titik)}</td>
                <td>${esc(c.branchEpm)}</td>
                <td>${st}</td>
            </tr>`;
        }).join('');
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

    openDetail: async function (branch, code, subdistLabel) {
        this.currentBranch = { branch, code, subdistLabel };
        document.getElementById('viewSummary').style.display = 'none';
        document.getElementById('viewDetail').style.display = '';

        const titleName = (subdistLabel && subdistLabel !== '—')
            ? subdistLabel
            : (branch || code || '—');
        document.getElementById('detailTitle').textContent = titleName;
        document.getElementById('detailHint').textContent = 'Memuat transaksi...';
        const story = document.getElementById('detailStory');
        if (story) story.textContent = '';

        const summaryRow = this.findSummaryRow(branch, code);
        const parent = this.findMappedParent(branch, code);

        try {
            const qs = new URLSearchParams();
            if (branch) qs.set('branch', branch);
            if (code) qs.set('code', code);
            qs.set('limit', '8000');
            const data = await this.api('/api/claims/detail?' + qs.toString());
            const n = data.totalMatched || 0;
            const childCount = parent ? (MappingSubdistStore.getChildren(parent) || []).length : 0;
            const hintParts = [
                code || '—',
                branch || '—',
                childCount ? `${childCount} child` : null,
                `${n.toLocaleString('id-ID')} transaksi`
            ].filter(Boolean);
            if (data.count < data.totalMatched) {
                hintParts.push(`tampil ${data.count}`);
            }
            document.getElementById('detailHint').textContent = hintParts.join(' · ');
            this.renderDetailKpis(summaryRow, data.detail || [], data.totalMatched);
            this.renderDetailJenis(summaryRow, data.detail || []);
            this.renderDetailChildren(parent);
            this.renderDetail(data.detail || []);
        } catch (e) {
            document.getElementById('detailHint').textContent = e.message || 'Gagal load detail';
            this.renderDetailKpis(summaryRow, [], 0);
            this.renderDetailJenis(summaryRow, []);
            this.renderDetailChildren(parent);
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

/**
 * Mapping Subdist — Index + SPA Detail (aligned MAVEN /DF/MappingSubdist)
 */
const MappingSubdistPage = {
    data: [],
    table: null,
    formReady: false,

    init: async function () {
        await MappingSubdistStore.ensureSwal();
        await DfDataTable.ensureAssets();
        this.data = MappingSubdistStore.load();
        this.bindFilters();
        this.applyRoleAccess();

        await MappingSubdistForm.init({
            skipUrlLoad: true,
            onBack: () => this.closeDetail()
        });
        this.formReady = true;

        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        const isNew = params.get('new') === '1';

        if (id) {
            this.openEdit(id);
        } else if (isNew) {
            this.openNew();
        } else {
            this.showIndex();
            this.render();
        }
    },

    stateUi: function (state) {
        const index = document.getElementById('PanelIndex');
        const detail = document.getElementById('PanelDetail');
        if (index) index.classList.toggle('d-none', state !== 'INDEX');
        if (detail) detail.classList.toggle('d-none', state !== 'DETAIL');
    },

    showIndex: function () {
        this.stateUi('INDEX');
        if (window.history && window.history.replaceState) {
            window.history.replaceState({}, '', 'mapping-subdist.html');
        }
    },

    openNew: function () {
        if (!MappingSubdistStore.canEdit()) {
            MappingSubdistStore.toast('warning', 'Role Anda tidak bisa menambah data');
            return;
        }
        this.stateUi('DETAIL');
        MappingSubdistForm.openNew();
        if (window.history && window.history.replaceState) {
            window.history.replaceState({}, '', 'mapping-subdist.html?new=1');
        }
    },

    openEdit: function (id) {
        this.stateUi('DETAIL');
        const ok = MappingSubdistForm.openEdit(id);
        if (!ok) {
            this.closeDetail();
            return;
        }
        if (window.history && window.history.replaceState) {
            window.history.replaceState({}, '', MappingSubdistStore.formUrl(id));
        }
    },

    closeDetail: function () {
        this.showIndex();
        this.render();
    },

    applyRoleAccess: function () {
        const btn = document.getElementById('btnAddSubdist');
        if (btn) btn.style.display = MappingSubdistStore.canEdit() ? '' : 'none';
    },

    bindFilters: function () {
        const regions = [...new Set(this.data.map(d => d.region).filter(Boolean))].sort();
        const regionSel = document.getElementById('filterRegion');
        if (regionSel && regionSel.options.length <= 1) {
            regions.forEach(r => {
                const opt = document.createElement('option');
                opt.value = r;
                opt.textContent = r;
                regionSel.appendChild(opt);
            });
        }

        const btnFilter = document.getElementById('btnFilter');
        if (btnFilter) {
            btnFilter.addEventListener('click', () => this.render());
        }
        const groupType = document.getElementById('filterGroupType');
        if (groupType) {
            groupType.addEventListener('change', () => this.render());
        }

        document.querySelectorAll('#PanelIndex .btn-search-occ').forEach(btn => {
            btn.addEventListener('click', () => this.render());
        });
        document.querySelectorAll('#PanelIndex .dynamic-input input').forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.which === 13 || e.key === 'Enter') {
                    e.preventDefault();
                    this.render();
                }
            });
        });

        const btnAdd = document.getElementById('btnAddSubdist');
        if (btnAdd) {
            btnAdd.addEventListener('click', () => this.openNew());
        }

        const tbl = document.getElementById('tblMappingSubdist');
        if (tbl) {
            tbl.addEventListener('click', (e) => {
                const btn = e.target.closest('.btn-detail-mapping');
                if (!btn) return;
                const id = btn.getAttribute('data-id');
                if (id) this.openEdit(id);
            });
        }
    },

    containsIgnoreCase: function (hay, needle) {
        if (!needle) return true;
        return String(hay == null ? '' : hay).toLowerCase().includes(String(needle).toLowerCase());
    },

    getFiltered: function () {
        const region = (document.getElementById('filterRegion') || {}).value || '';
        const groupType = (document.getElementById('filterGroupType') || {}).value || '';
        const kode = ((document.getElementById('SearchKMMDCode') || {}).value || '').trim();
        const nama = ((document.getElementById('SearchKMMDName') || {}).value || '').trim();
        const namaGroup = ((document.getElementById('SearchGroupName') || {}).value || '').trim();
        const searchRegion = ((document.getElementById('SearchRegion') || {}).value || '').trim();

        return this.data.filter(d => {
            if (d.parent !== 'YA') return false;
            if (region && d.region !== region) return false;
            if (groupType && d.groupType !== groupType) return false;
            if (!this.containsIgnoreCase(d.kodeKmmd, kode)) return false;
            if (!this.containsIgnoreCase(d.namaKmmd, nama)) return false;
            if (!this.containsIgnoreCase(d.namaGroup, namaGroup)) return false;
            if (!this.containsIgnoreCase(d.region, searchRegion)) return false;
            return true;
        });
    },

    childCount: function (parent) {
        return MappingSubdistStore.getChildren(parent).length;
    },

    activityCount: function (parent) {
        const acts = MappingSubdistStore.getMappedActivities
            ? MappingSubdistStore.getMappedActivities(parent)
            : (parent.activities || []);
        return Array.isArray(acts) ? acts.length : 0;
    },

    render: function () {
        this.data = MappingSubdistStore.load();
        const rowsData = this.getFiltered();
        const esc = MappingSubdistStore.esc;

        const countLabel = document.getElementById('subdistCountLabel');
        if (countLabel) countLabel.textContent = rowsData.length + ' data';

        const rows = rowsData.map(d => {
            const actionBtn =
                '<button type="button" class="btn btn-sm btn-outline-primary btn-detail-mapping" data-id="' +
                esc(d.id) + '" title="Edit">' +
                '<i class="fas fa-pencil-alt"></i><span class="visually-hidden">Edit</span></button>';
            return [
                actionBtn,
                esc(d.kodeKmmd),
                esc(d.namaKmmd),
                esc(d.groupType),
                esc(d.namaGroup),
                esc(d.region),
                String(this.childCount(d)),
                String(this.activityCount(d))
            ];
        });

        this.table = DfDataTable.init('#tblMappingSubdist', {
            data: rows,
            pageLength: 10,
            orderCellsTop: true,
            columns: [
                { orderable: false, searchable: false, className: 'text-center' },
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true, className: 'text-center' },
                { orderable: true, className: 'text-center' }
            ],
            order: [[2, 'asc']],
            language: Object.assign({}, DfDataTable.language, {
                emptyTable: 'Tidak ada data parent'
            })
        });
    }
};

window.MappingSubdistPage = MappingSubdistPage;

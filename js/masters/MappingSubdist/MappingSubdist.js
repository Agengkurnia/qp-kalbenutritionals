/**
 * List page — Master Mapping Subdist
 * Aligned with MAVEN /DF/MappingSubdist Index
 */
const MappingSubdistPage = {
    data: [],
    table: null,

    init: async function () {
        await MappingSubdistStore.ensureSwal();
        await DfDataTable.ensureAssets();
        this.data = MappingSubdistStore.load();
        this.bindFilters();
        this.applyRoleAccess();
        this.render();
    },

    applyRoleAccess: function () {
        const btn = document.getElementById('btnAddSubdist');
        if (btn) btn.style.display = MappingSubdistStore.canEdit() ? '' : 'none';
    },

    bindFilters: function () {
        const regions = [...new Set(this.data.map(d => d.region).filter(Boolean))].sort();
        const regionSel = document.getElementById('filterRegion');
        regions.forEach(r => {
            const opt = document.createElement('option');
            opt.value = r;
            opt.textContent = r;
            regionSel.appendChild(opt);
        });

        const btnFilter = document.getElementById('btnFilter');
        if (btnFilter) {
            btnFilter.addEventListener('click', () => this.render());
        }
        document.getElementById('filterGroupType').addEventListener('change', () => this.render());

        document.getElementById('btnAddSubdist').addEventListener('click', () => {
            window.location.href = MappingSubdistStore.formUrl();
        });
    },

    getFiltered: function () {
        const region = document.getElementById('filterRegion').value;
        const groupType = document.getElementById('filterGroupType').value;

        return this.data.filter(d => {
            if (d.parent !== 'YA') return false;
            if (region && d.region !== region) return false;
            if (groupType && d.groupType !== groupType) return false;
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

        document.getElementById('subdistCountLabel').textContent = rowsData.length + ' data';

        const rows = rowsData.map(d => {
            const kodeLink = `<a href="${MappingSubdistStore.formUrl(d.id)}">${esc(d.kodeKmmd)}</a>`;
            return [
                kodeLink,
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
            columns: [
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true }
            ],
            order: [[1, 'asc']],
            language: Object.assign({}, DfDataTable.language, {
                emptyTable: 'Tidak ada data parent'
            })
        });
    }
};

window.MappingSubdistPage = MappingSubdistPage;

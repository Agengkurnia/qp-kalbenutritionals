/**
 * List page — Master Mapping Subdist
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

        ['filterRegion', 'filterGroupType'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => this.render());
        });

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

    render: function () {
        this.data = MappingSubdistStore.load();
        const rowsData = this.getFiltered();
        const canEdit = MappingSubdistStore.canEdit();
        const esc = MappingSubdistStore.esc;

        document.getElementById('subdistCountLabel').textContent =
            `${rowsData.length} parent` + (rowsData.length !== this.data.filter(d => d.parent === 'YA').length
                ? ` (terfilter)`
                : '');

        const rows = rowsData.map(d => {
            const parentBadge = '<span class="badge bg-label-success ms-2">Parent</span>';
            const groupBadge = d.groupType === 'Group'
                ? '<span class="badge bg-label-primary">Group</span>'
                : '<span class="badge bg-label-warning">Non Group</span>';
            const inactive = d.active === false
                ? ' <span class="badge bg-label-danger">Nonaktif</span>'
                : '';

            const actions = canEdit
                ? `<a class="btn btn-sm btn-icon btn-outline-primary me-1" title="Detail" href="${MappingSubdistStore.formUrl(d.id)}">
                        <i class="fas fa-edit"></i>
                   </a>
                   <button type="button" class="btn btn-sm btn-icon btn-outline-danger btn-delete-subdist" title="Hapus" data-id="${esc(d.id)}">
                        <i class="fas fa-trash"></i>
                   </button>`
                : `<a class="btn btn-sm btn-icon btn-outline-secondary" title="Detail" href="${MappingSubdistStore.formUrl(d.id)}">
                        <i class="fas fa-eye"></i>
                   </a>`;

            return [
                `<code>${esc(d.kodeKmmd)}</code>`,
                `<span class="fw-semibold">${esc(d.namaKmmd)}</span>${parentBadge}${inactive}`,
                esc(d.titik),
                groupBadge,
                esc(d.namaGroup),
                `${esc(d.branchEpm)} <small class="text-muted">(${esc(d.kodeBranch)})</small>`,
                esc(d.region),
                esc(d.tipeKmmd),
                `<div class="text-center text-nowrap">${actions}</div>`
            ];
        });

        this.table = DfDataTable.init('#tblMappingSubdist', {
            data: rows,
            columns: [
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: false, searchable: false, className: 'text-center' }
            ],
            order: [[1, 'asc']],
            language: Object.assign({}, DfDataTable.language, {
                emptyTable: 'Tidak ada data parent'
            })
        });

        const self = this;
        const $ = window.jQuery;
        if ($ && this.table) {
            $('#tblMappingSubdist').off('click', '.btn-delete-subdist').on('click', '.btn-delete-subdist', function () {
                self.deleteItem(this.getAttribute('data-id'));
            });
        }
    },

    deleteItem: function (id) {
        const item = MappingSubdistStore.getById(id);
        if (!item) return;

        const doDelete = () => {
            MappingSubdistStore.remove(id);
            this.render();
            MappingSubdistStore.toast('success', 'Data dihapus');
        };

        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'warning',
                title: 'Hapus Subdist?',
                text: item.namaKmmd,
                showCancelButton: true,
                confirmButtonText: 'Hapus',
                cancelButtonText: 'Batal',
                customClass: {
                    confirmButton: 'btn btn-danger',
                    cancelButton: 'btn btn-outline-secondary ms-1'
                },
                buttonsStyling: false
            }).then(res => { if (res.isConfirmed) doDelete(); });
        } else if (confirm('Hapus ' + item.namaKmmd + '?')) {
            doDelete();
        }
    }
};

window.MappingSubdistPage = MappingSubdistPage;

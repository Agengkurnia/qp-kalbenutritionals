/**
 * List page — Master Mapping Subdist
 */
const MappingSubdistPage = {
    data: [],

    init: async function () {
        await MappingSubdistStore.ensureSwal();
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

        ['filterRegion', 'filterGroupType', 'filterSearch'].forEach(id => {
            const el = document.getElementById(id);
            el.addEventListener(id === 'filterSearch' ? 'input' : 'change', () => this.render());
        });

        document.getElementById('btnAddSubdist').addEventListener('click', () => {
            window.location.href = MappingSubdistStore.formUrl();
        });
    },

    getFiltered: function () {
        const region = document.getElementById('filterRegion').value;
        const groupType = document.getElementById('filterGroupType').value;
        const q = (document.getElementById('filterSearch').value || '').toLowerCase().trim();

        // Index hanya tampilkan Parent (YA)
        return this.data.filter(d => {
            if (d.parent !== 'YA') return false;
            if (region && d.region !== region) return false;
            if (groupType && d.groupType !== groupType) return false;
            if (q) {
                const hay = [d.kodeKmmd, d.namaKmmd, d.titik, d.namaGroup, d.branchEpm]
                    .join(' ').toLowerCase();
                if (!hay.includes(q)) return false;
            }
            return true;
        });
    },

    render: function () {
        this.data = MappingSubdistStore.load();
        const rows = this.getFiltered();
        const tbody = document.getElementById('tblMappingSubdistBody');
        const canEdit = MappingSubdistStore.canEdit();
        const esc = MappingSubdistStore.esc;

        document.getElementById('subdistCountLabel').textContent =
            `${rows.length} data` + (rows.length !== this.data.length ? ` (dari ${this.data.length})` : '');

        if (!rows.length) {
            tbody.innerHTML = `<tr><td colspan="9" class="text-center text-muted py-4">Tidak ada data</td></tr>`;
            return;
        }

        tbody.innerHTML = rows.map(d => {
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
                   <button type="button" class="btn btn-sm btn-icon btn-outline-danger" title="Hapus" data-action="delete" data-id="${d.id}">
                        <i class="fas fa-trash"></i>
                   </button>`
                : `<a class="btn btn-sm btn-icon btn-outline-secondary" title="Detail" href="${MappingSubdistStore.formUrl(d.id)}">
                        <i class="fas fa-eye"></i>
                   </a>`;

            return `<tr>
                <td><code>${esc(d.kodeKmmd)}</code></td>
                <td>
                    <span class="fw-semibold">${esc(d.namaKmmd)}</span>${parentBadge}${inactive}
                </td>
                <td>${esc(d.titik)}</td>
                <td>${groupBadge}</td>
                <td>${esc(d.namaGroup)}</td>
                <td>${esc(d.branchEpm)} <small class="text-muted">(${esc(d.kodeBranch)})</small></td>
                <td>${esc(d.region)}</td>
                <td>${esc(d.tipeKmmd)}</td>
                <td class="text-center text-nowrap">${actions}</td>
            </tr>`;
        }).join('');

        tbody.querySelectorAll('[data-action="delete"]').forEach(btn => {
            btn.addEventListener('click', () => this.deleteItem(btn.getAttribute('data-id')));
        });
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

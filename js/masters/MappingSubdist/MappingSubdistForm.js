/**
 * Form Detail Mapping Subdist — redesigned UX
 * Flow: Identitas → Parent/Child → Group → Cabang → Opsional → Child mapping
 */
const MappingSubdistForm = {
    itemId: null,
    readOnly: false,
    bosnetLocked: false,
    childTable: null,
    orphanTable: null,
    bosnetTable: null,
    activityTable: null,
    activityLovTable: null,

    init: async function () {
        await MappingSubdistStore.ensureSwal();
        await this.ensureDataTables();

        const params = new URLSearchParams(window.location.search);
        this.itemId = params.get('id');
        this.readOnly = !MappingSubdistStore.canEdit();

        this.fillDatalists();
        this.bindEvents();
        this.loadForm();
        this.applyReadOnly();
        this.syncRoleVisibility();
        this.applyBosnetLockUI();
    },

    ensureDataTables: async function () {
        await DfDataTable.ensureAssets();
    },

    fillDatalists: function () {
        const data = MappingSubdistStore.load();
        const groups = [...new Set(data.map(d => d.namaGroup).filter(g => g && g !== 'Non Group'))].sort();

        const listGroup = document.getElementById('listNamaGroup');
        if (!listGroup) return;
        groups.forEach(g => {
            const opt = document.createElement('option');
            opt.value = g;
            listGroup.appendChild(opt);
        });
    },

    bindEvents: function () {
        document.getElementById('formSubdist').addEventListener('submit', (e) => {
            e.preventDefault();
            this.save();
        });

        document.getElementById('fldParentToggle').addEventListener('change', (e) => {
            this.setParentChoice(e.target.checked ? 'YA' : 'TIDAK');
            this.syncParentUI();
            this.refreshMappingSections();
        });

        document.getElementById('fldGroupType').addEventListener('change', () => {
            this.syncGroupUI();
            this.refreshMappingSections();
        });

        document.getElementById('btnAddChild').addEventListener('click', () => this.openPickChildModal());

        const btnAddActivity = document.getElementById('btnAddActivity');
        if (btnAddActivity) {
            btnAddActivity.addEventListener('click', () => this.openPickActivityModal());
        }

        const btnLov = document.getElementById('btnLovKmmd');
        if (btnLov) {
            btnLov.addEventListener('click', () => this.openBosnetLov());
        }

        const btnConfirm = document.getElementById('btnConfirmPickChildren');
        if (btnConfirm) {
            btnConfirm.addEventListener('click', () => this.confirmPickChildren());
        }
        const chkAll = document.getElementById('chkOrphanAll');
        if (chkAll) {
            chkAll.addEventListener('change', (e) => this.toggleSelectAllOrphans(e.target.checked));
        }

        const btnConfirmAct = document.getElementById('btnConfirmPickActivities');
        if (btnConfirmAct) {
            btnConfirmAct.addEventListener('click', () => this.confirmPickActivities());
        }
        const chkActAll = document.getElementById('chkActivityAll');
        if (chkActAll) {
            chkActAll.addEventListener('change', (e) => this.toggleSelectAllActivities(e.target.checked));
        }
    },

    applyBosnetLockUI: function () {
        const toggle = document.getElementById('fldParentToggle');
        const btnLov = document.getElementById('btnLovKmmd');
        if (toggle) {
            toggle.disabled = this.readOnly || this.bosnetLocked;
        }
        if (btnLov) {
            // Edit: kode sudah fixed; add: boleh ganti selama belum simpan
            btnLov.disabled = this.readOnly || !!this.itemId;
            btnLov.style.display = this.readOnly || this.itemId ? 'none' : '';
        }
    },

    getBosnetMaster: function () {
        const seed = Array.isArray(window.MappingSubdistSeed) ? window.MappingSubdistSeed : [];
        const extra = Array.isArray(window.BosnetKmmdExtra) ? window.BosnetKmmdExtra : [];
        return seed.concat(extra);
    },

    openBosnetLov: function () {
        if (this.readOnly || this.itemId) return;
        this.renderBosnetLov();
        const modalEl = document.getElementById('modalLovBosnet');
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            bootstrap.Modal.getOrCreateInstance(modalEl).show();
        } else if (window.jQuery) {
            window.jQuery(modalEl).modal('show');
        }
    },

    destroyBosnetTable: function () {
        DfDataTable.destroy('#tblBosnetLov');
        this.bosnetTable = null;
    },

    renderBosnetLov: function () {
        const esc = MappingSubdistStore.esc;
        const existing = MappingSubdistStore.load();
        const used = new Set(existing.map(d => d.kodeKmmd));
        const list = this.getBosnetMaster().filter(d => !used.has(d.kodeKmmd));
        const $ = window.jQuery;

        const rows = list.map(c => [
            `<code>${esc(c.kodeKmmd)}</code>`,
            esc(c.namaKmmd),
            esc(c.titik),
            esc(c.region),
            esc(c.tipeKmmd),
            `<div class="text-center">
                <button type="button" class="btn btn-sm btn-primary btn-pick-bosnet" data-kode="${esc(c.kodeKmmd)}">Pilih</button>
             </div>`
        ]);

        this.bosnetTable = DfDataTable.init('#tblBosnetLov', {
            data: rows,
            columns: [
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: false, searchable: false, className: 'text-center' }
            ],
            language: Object.assign({}, DfDataTable.language, {
                emptyTable: 'Semua Kode KMMD Bosnet sudah terdaftar'
            })
        });

        if ($ && this.bosnetTable) {
            const self = this;
            $('#tblBosnetLov').off('click', '.btn-pick-bosnet').on('click', '.btn-pick-bosnet', function () {
                self.applyBosnetSelection(this.getAttribute('data-kode'));
            });
            const modalEl = document.getElementById('modalLovBosnet');
            modalEl.addEventListener('shown.bs.modal', () => {
                self.scheduleDtAdjust(self.bosnetTable);
            }, { once: true });
        }
    },

    applyBosnetSelection: function (kode) {
        const src = this.getBosnetMaster().find(d => d.kodeKmmd === kode);
        if (!src) {
            MappingSubdistStore.toast('error', 'Data Bosnet tidak ditemukan');
            return;
        }

        document.getElementById('fldKodeKmmd').value = src.kodeKmmd || '';
        document.getElementById('fldNamaKmmd').value = src.namaKmmd || '';
        document.getElementById('fldTitik').value = src.titik || '';
        document.getElementById('fldTipeKmmd').value = src.tipeKmmd || 'KMMD-B';
        document.getElementById('fldRegion').value = src.region || '';
        document.getElementById('fldKodeBranch').value = src.kodeBranch || '';
        document.getElementById('fldBranchEpm').value = src.branchEpm || '';

        // Peran dari master Bosnet, lalu dikunci
        this.setParentChoice(src.parent === 'TIDAK' ? 'TIDAK' : 'YA');
        if (src.groupType) {
            document.getElementById('fldGroupType').value = src.groupType;
        }
        if (src.namaGroup) {
            document.getElementById('fldNamaGroup').value = src.namaGroup;
        }

        this.bosnetLocked = true;
        this.applyBosnetLockUI();
        this.syncRoleVisibility();

        const modalEl = document.getElementById('modalLovBosnet');
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            const inst = bootstrap.Modal.getInstance(modalEl);
            if (inst) inst.hide();
        } else if (window.jQuery) {
            window.jQuery(modalEl).modal('hide');
        }

        MappingSubdistStore.toast('success', 'Data Bosnet terisi');
    },

    setParentChoice: function (value) {
        document.getElementById('fldParent').value = value;
        const toggle = document.getElementById('fldParentToggle');
        if (toggle) toggle.checked = value === 'YA';
        const title = document.getElementById('parentToggleLabel');
        if (title) title.textContent = value === 'YA' ? 'Parent' : 'Child';
    },

    /** Alur: pilih Group/Non Group → (kalau Group) toggle Parent → (kalau Parent) child table */
    syncRoleVisibility: function () {
        const type = document.getElementById('fldGroupType').value;
        const wrapToggle = document.getElementById('wrapParentToggle');
        const wrapGroup = document.getElementById('wrapNamaGroup');
        const fldGroup = document.getElementById('fldNamaGroup');
        const isGroup = type === 'Group';
        const isNonGroup = type === 'Non Group';

        if (wrapToggle) wrapToggle.style.display = isGroup ? '' : 'none';
        if (wrapGroup) wrapGroup.style.display = isGroup ? '' : 'none';

        if (isNonGroup) {
            // Non Group tetap Parent YA dan boleh mapping child
            this.setParentChoice('YA');
            fldGroup.value = 'Non Group';
            fldGroup.required = false;
        } else if (isGroup) {
            fldGroup.required = true;
            fldGroup.readOnly = this.readOnly;
            if (fldGroup.value === 'Non Group') fldGroup.value = '';
            this.syncParentUI();
        } else {
            // belum pilih tipe
            fldGroup.required = false;
        }

        this.applyBosnetLockUI();
        this.refreshMappingSections();
    },

    syncParentUI: function () {
        const isParent = document.getElementById('fldParent').value === 'YA';
        const hint = document.getElementById('hintNamaGroup');
        const toggleHint = document.getElementById('parentToggleHint');
        if (hint) {
            hint.textContent = isParent
                ? 'Parent menentukan nama group. Child di bawahnya harus pakai nama yang sama.'
                : 'Isi nama group milik parent yang akan diikuti.';
        }
        if (toggleHint) {
            toggleHint.textContent = isParent
                ? 'ON — Parent (maintain saldo DF, bisa mapping child).'
                : 'OFF — Child (ikut parent group).';
        }
    },

    syncGroupUI: function () {
        this.syncRoleVisibility();
    },

    loadForm: function () {
        const title = document.getElementById('pageTitle');
        const subtitle = document.getElementById('pageSubtitle');

        if (!this.itemId) {
            title.textContent = 'Tambah';
            subtitle.textContent = 'Pilih Kode KMMD dari Bosnet, lalu lengkapi Group.';
            document.getElementById('fldGroupType').value = '';
            document.getElementById('fldTipeKmmd').value = 'KMMD-B';
            this.setParentChoice('YA');
            this.bosnetLocked = false;
            return;
        }

        const item = MappingSubdistStore.getById(this.itemId);
        if (!item) {
            MappingSubdistStore.toast('error', 'Data tidak ditemukan');
            window.location.href = 'mapping-subdist.html';
            return;
        }

        title.textContent = 'Detail';
        subtitle.textContent = item.namaKmmd || '';

        document.getElementById('editId').value = item.id;
        document.getElementById('fldKodeKmmd').value = item.kodeKmmd || '';
        document.getElementById('fldNamaKmmd').value = item.namaKmmd || '';
        this.setParentChoice(item.parent || 'YA');
        document.getElementById('fldTitik').value = item.titik || '';
        document.getElementById('fldTipeKmmd').value = item.tipeKmmd || 'KMMD-B';
        document.getElementById('fldGroupType').value = item.groupType || 'Group';
        document.getElementById('fldRegion').value = item.region || '';
        document.getElementById('fldNamaGroup').value = item.namaGroup || '';
        document.getElementById('fldKodeBranch').value = item.kodeBranch || '';
        document.getElementById('fldBranchEpm').value = item.branchEpm || '';
        document.getElementById('fldAlamat').value = item.alamat || '';
        document.getElementById('fldActive').checked = item.active !== false;

        // Edit = identitas & peran sudah dari Bosnet → dikunci
        this.bosnetLocked = true;
    },

    applyReadOnly: function () {
        if (!this.readOnly) return;
        const form = document.getElementById('formSubdist');
        Array.from(form.elements).forEach(el => {
            if (el.tagName === 'BUTTON' || el.type === 'submit') {
                el.style.display = 'none';
                return;
            }
            el.disabled = true;
        });
        const btnSave = document.getElementById('btnSave');
        if (btnSave) btnSave.style.display = 'none';
        const btnAdd = document.getElementById('btnAddChild');
        if (btnAdd) btnAdd.style.display = 'none';
        const btnAddAct = document.getElementById('btnAddActivity');
        if (btnAddAct) btnAddAct.style.display = 'none';
    },

    /** Parent YA (Group atau Non Group) bisa mapping child & activity */
    isParentMode: function () {
        const type = document.getElementById('fldGroupType').value;
        if (!type) return false;
        if (type === 'Non Group') return true;
        return document.getElementById('fldParent').value === 'YA';
    },

    refreshMappingSections: function () {
        this.refreshChildSection();
        this.refreshActivitySection();
    },

    refreshChildSection: function () {
        const card = document.getElementById('accordionChildMapping');
        const show = this.isParentMode();
        card.style.display = show ? '' : 'none';
        if (!show) {
            this.destroyChildTable();
            return;
        }

        const parentSnapshot = this.getFormSnapshot();
        const btnAdd = document.getElementById('btnAddChild');
        if (btnAdd) btnAdd.disabled = this.readOnly;

        if (!this.itemId) {
            document.getElementById('childCountBadge').textContent = '0';
            document.getElementById('childHint').textContent =
                'Klik Add untuk memilih child dari Bosnet (parent disimpan otomatis bila perlu).';
            this.renderChildren([]);
            this.scheduleDtAdjust(this.childTable);
            return;
        }

        const label = parentSnapshot.groupType === 'Non Group'
            ? (parentSnapshot.namaKmmd || '—')
            : (parentSnapshot.namaGroup || '—');
        document.getElementById('childHint').textContent =
            `Child di bawah "${label}". Sumber data: Bosnet API.`;

        const children = MappingSubdistStore.getChildren(parentSnapshot);
        document.getElementById('childCountBadge').textContent = String(children.length);
        this.renderChildren(children);
        this.scheduleDtAdjust(this.childTable);
    },

    refreshActivitySection: function () {
        const card = document.getElementById('accordionActivityMapping');
        if (!card) return;
        const show = this.isParentMode();
        card.style.display = show ? '' : 'none';
        if (!show) {
            this.destroyActivityTable();
            return;
        }

        const parentSnapshot = this.getFormSnapshot();
        const btnAdd = document.getElementById('btnAddActivity');
        if (btnAdd) btnAdd.disabled = this.readOnly;

        if (!this.itemId) {
            document.getElementById('activityCountBadge').textContent = '0';
            document.getElementById('activityHint').textContent =
                'Klik Add untuk memilih activity dari Master Data (parent disimpan otomatis bila perlu).';
            this.renderActivities([]);
            this.scheduleDtAdjust(this.activityTable);
            return;
        }

        const label = parentSnapshot.groupType === 'Non Group'
            ? (parentSnapshot.namaKmmd || '—')
            : (parentSnapshot.namaGroup || '—');
        document.getElementById('activityHint').textContent =
            `Activity di bawah "${label}". Sumber data: Master Data API.`;

        const activities = MappingSubdistStore.getMappedActivities(parentSnapshot);
        document.getElementById('activityCountBadge').textContent = String(activities.length);
        this.renderActivities(activities);
        this.scheduleDtAdjust(this.activityTable);
    },

    scheduleDtAdjust: function (api) {
        if (!api) return;
        setTimeout(() => DfDataTable.adjust(api), 50);
        setTimeout(() => DfDataTable.adjust(api), 250);
    },

    getFormSnapshot: function () {
        const kode = document.getElementById('fldKodeKmmd').value.trim();
        const id = document.getElementById('editId').value || kode;
        const existing = id ? MappingSubdistStore.getById(id) : null;
        return {
            id,
            parent: document.getElementById('fldParent').value,
            kodeKmmd: kode,
            namaKmmd: document.getElementById('fldNamaKmmd').value.trim(),
            titik: document.getElementById('fldTitik').value.trim(),
            groupType: document.getElementById('fldGroupType').value,
            namaGroup: document.getElementById('fldNamaGroup').value.trim(),
            namaSubdistGroup: document.getElementById('fldGroupType').value === 'Non Group'
                ? document.getElementById('fldNamaKmmd').value.trim()
                : document.getElementById('fldNamaGroup').value.trim(),
            kodeBranch: document.getElementById('fldKodeBranch').value.trim(),
            branchEpm: document.getElementById('fldBranchEpm').value.trim(),
            region: document.getElementById('fldRegion').value.trim(),
            tipeKmmd: document.getElementById('fldTipeKmmd').value,
            alamat: document.getElementById('fldAlamat').value.trim(),
            active: document.getElementById('fldActive').checked,
            activities: existing && Array.isArray(existing.activities) ? existing.activities : []
        };
    },

    destroyChildTable: function () {
        DfDataTable.destroy('#tblChild');
        this.childTable = null;
    },

    renderChildren: function (children) {
        const esc = MappingSubdistStore.esc;
        const list = Array.isArray(children) ? children : [];
        const $ = window.jQuery;

        const rows = list.map(c => {
            const unlinkBtn = this.readOnly
                ? ''
                : `<button type="button" class="btn btn-sm btn-outline-danger btn-unlink-child" data-id="${esc(c.id)}">Lepas</button>`;
            const statusBadge = c.active === false
                ? '<span class="badge bg-label-danger">Non Active</span>'
                : '<span class="badge bg-label-success">Active</span>';
            return [
                `<code>${esc(c.kodeKmmd)}</code>`,
                `<code>${esc(c.kodeBranch)}</code>`,
                esc(c.namaKmmd),
                esc(c.titik),
                esc(c.tipeKmmd),
                esc(c.branchEpm),
                statusBadge,
                `<div class="text-center text-nowrap">${unlinkBtn}</div>`
            ];
        });

        this.childTable = DfDataTable.init('#tblChild', {
            data: rows,
            columns: [
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: false, searchable: false, className: 'text-center' }
            ],
            language: Object.assign({}, DfDataTable.language, {
                emptyTable: 'Belum ada child'
            })
        });

        if ($ && this.childTable) {
            const self = this;
            $('#tblChild').off('click', '.btn-unlink-child').on('click', '.btn-unlink-child', function () {
                MappingSubdistStore.unlinkChild(this.getAttribute('data-id'));
                MappingSubdistStore.toast('success', 'Child dilepas');
                self.refreshChildSection();
            });
        }
    },

    openPickChildModal: function () {
        if (!this.isParentMode()) {
            MappingSubdistStore.toast('warning', 'Mapping child hanya untuk Parent (Group / Non Group)');
            return;
        }

        if (!this.ensureParentSaved()) return;

        const groupType = document.getElementById('fldGroupType').value;
        if (groupType === 'Group') {
            const namaGroup = document.getElementById('fldNamaGroup').value.trim();
            if (!namaGroup || namaGroup === 'Non Group') {
                MappingSubdistStore.toast('warning', 'Isi Nama Group dulu');
                return;
            }
        }

        const parent = this.getFormSnapshot();
        this.renderOrphanTable(parent);

        const modalEl = document.getElementById('modalPickChild');
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            bootstrap.Modal.getOrCreateInstance(modalEl).show();
        } else if (window.jQuery) {
            window.jQuery(modalEl).modal('show');
        }
    },

    /** Pastikan parent tersimpan sebelum mapping child. Return false jika validasi gagal. */
    ensureParentSaved: function () {
        if (this.itemId && MappingSubdistStore.getById(this.itemId)) return true;
        return this.save({ silent: true });
    },

    destroyOrphanTable: function () {
        DfDataTable.destroy('#tblOrphan');
        this.orphanTable = null;
    },

    renderOrphanTable: function (parentItem) {
        const esc = MappingSubdistStore.esc;
        const orphans = MappingSubdistStore.getBosnetChildCandidates(parentItem);
        const $ = window.jQuery;

        const chkAll = document.getElementById('chkOrphanAll');
        if (chkAll) chkAll.checked = false;
        this.updateOrphanSelectedLabel(0);

        const rows = orphans.map(c => [
            `<div class="text-center">
                <input type="checkbox" class="form-check-input chk-orphan" value="${esc(c.kodeKmmd)}">
             </div>`,
            `<code>${esc(c.kodeKmmd)}</code>`,
            esc(c.namaKmmd),
            esc(c.titik),
            esc(c.region),
            esc(c.tipeKmmd)
        ]);

        this.orphanTable = DfDataTable.init('#tblOrphan', {
            data: rows,
            columns: [
                { orderable: false, searchable: false, className: 'text-center' },
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true }
            ],
            language: Object.assign({}, DfDataTable.language, {
                emptyTable: 'Tidak ada kandidat dari Bosnet API.'
            })
        });

        if ($ && this.orphanTable) {
            const self = this;
            $('#tblOrphan').off('change', '.chk-orphan').on('change', '.chk-orphan', function () {
                self.updateOrphanSelectedLabel();
            });
            const modalEl = document.getElementById('modalPickChild');
            modalEl.addEventListener('shown.bs.modal', () => {
                self.scheduleDtAdjust(self.orphanTable);
            }, { once: true });
        }
    },

    getSelectedOrphanIds: function () {
        const ids = [];
        const $ = window.jQuery;
        if ($ && this.orphanTable) {
            this.orphanTable.$('.chk-orphan:checked').each(function () {
                ids.push(this.value);
            });
            return [...new Set(ids)];
        }
        document.querySelectorAll('#tblOrphan .chk-orphan:checked').forEach(chk => {
            ids.push(chk.value);
        });
        return [...new Set(ids)];
    },

    updateOrphanSelectedLabel: function (count) {
        const label = document.getElementById('orphanSelectedLabel');
        if (!label) return;
        const n = typeof count === 'number' ? count : this.getSelectedOrphanIds().length;
        label.textContent = n + ' dipilih';
    },

    toggleSelectAllOrphans: function (checked) {
        const $ = window.jQuery;
        if ($ && this.orphanTable) {
            this.orphanTable.$('.chk-orphan').prop('checked', !!checked);
        } else {
            document.querySelectorAll('#tblOrphan .chk-orphan').forEach(chk => {
                chk.checked = !!checked;
            });
        }
        this.updateOrphanSelectedLabel();
    },

    confirmPickChildren: function () {
        const ids = this.getSelectedOrphanIds();
        if (!ids.length) {
            MappingSubdistStore.toast('warning', 'Centang minimal 1 subdist');
            return;
        }
        this.pickChildren(ids);
    },

    pickChildren: function (childIds) {
        const ids = Array.isArray(childIds) ? childIds : [childIds];
        if (!ids.length) return;

        if (!this.ensureParentSaved()) return;

        let parent = MappingSubdistStore.getById(this.itemId);
        if (!parent) {
            MappingSubdistStore.toast('warning', 'Parent belum tersimpan');
            return;
        }

        const snapshot = this.getFormSnapshot();
        const groupType = snapshot.groupType || parent.groupType || 'Group';
        let namaGroup = snapshot.namaGroup || parent.namaGroup || '';
        if (groupType === 'Non Group') {
            namaGroup = 'Non Group';
        } else if (!namaGroup || namaGroup === 'Non Group') {
            MappingSubdistStore.toast('warning', 'Isi Nama Group dulu');
            return;
        }

        parent = Object.assign({}, parent, {
            parent: 'YA',
            groupType,
            namaGroup,
            namaSubdistGroup: groupType === 'Non Group'
                ? (snapshot.namaKmmd || parent.namaKmmd)
                : namaGroup
        });
        MappingSubdistStore.upsert(parent);
        MappingSubdistStore.addChildrenFromBosnet(ids, parent);

        MappingSubdistStore.toast('success', ids.length + ' child ditambahkan');

        const modalEl = document.getElementById('modalPickChild');
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            const inst = bootstrap.Modal.getInstance(modalEl);
            if (inst) inst.hide();
        } else if (window.jQuery) {
            window.jQuery(modalEl).modal('hide');
        }

        this.refreshMappingSections();
    },

    pickChild: function (childId) {
        this.pickChildren([childId]);
    },

    destroyActivityTable: function () {
        DfDataTable.destroy('#tblActivity');
        this.activityTable = null;
    },

    renderActivities: function (activities) {
        const esc = MappingSubdistStore.esc;
        const list = Array.isArray(activities) ? activities : [];
        const $ = window.jQuery;

        const rows = list.map(a => {
            const unlinkBtn = this.readOnly
                ? ''
                : `<button type="button" class="btn btn-sm btn-outline-danger btn-unlink-activity" data-id="${esc(a.id || a.kode)}">Lepas</button>`;
            return [
                `<code>${esc(a.kode)}</code>`,
                esc(a.nama),
                esc(a.kategori),
                esc(a.deskripsi),
                `<div class="text-center text-nowrap">${unlinkBtn}</div>`
            ];
        });

        this.activityTable = DfDataTable.init('#tblActivity', {
            data: rows,
            columns: [
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: false, searchable: false, className: 'text-center' }
            ],
            language: Object.assign({}, DfDataTable.language, {
                emptyTable: 'Belum ada activity'
            })
        });

        if ($ && this.activityTable) {
            const self = this;
            $('#tblActivity').off('click', '.btn-unlink-activity').on('click', '.btn-unlink-activity', function () {
                MappingSubdistStore.unlinkActivity(self.itemId, this.getAttribute('data-id'));
                MappingSubdistStore.toast('success', 'Activity dilepas');
                self.refreshActivitySection();
            });
        }
    },

    openPickActivityModal: function () {
        if (!this.isParentMode()) {
            MappingSubdistStore.toast('warning', 'Mapping activity hanya untuk Parent (Group / Non Group)');
            return;
        }
        if (!this.ensureParentSaved()) return;

        const parent = this.getFormSnapshot();
        this.renderActivityLovTable(parent);

        const modalEl = document.getElementById('modalPickActivity');
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            bootstrap.Modal.getOrCreateInstance(modalEl).show();
        } else if (window.jQuery) {
            window.jQuery(modalEl).modal('show');
        }
    },

    destroyActivityLovTable: function () {
        DfDataTable.destroy('#tblActivityLov');
        this.activityLovTable = null;
    },

    renderActivityLovTable: function (parentItem) {
        const esc = MappingSubdistStore.esc;
        const list = MappingSubdistStore.getActivityCandidates(parentItem);
        const $ = window.jQuery;

        const chkAll = document.getElementById('chkActivityAll');
        if (chkAll) chkAll.checked = false;
        this.updateActivitySelectedLabel(0);

        const rows = list.map(a => [
            `<div class="text-center">
                <input type="checkbox" class="form-check-input chk-activity" value="${esc(a.id)}">
             </div>`,
            `<code>${esc(a.kode)}</code>`,
            esc(a.nama),
            esc(a.kategori),
            esc(a.deskripsi)
        ]);

        this.activityLovTable = DfDataTable.init('#tblActivityLov', {
            data: rows,
            columns: [
                { orderable: false, searchable: false, className: 'text-center' },
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true }
            ],
            language: Object.assign({}, DfDataTable.language, {
                emptyTable: 'Tidak ada kandidat dari Master Data API (semua sudah ter-mapping).'
            })
        });

        if ($ && this.activityLovTable) {
            const self = this;
            $('#tblActivityLov').off('change', '.chk-activity').on('change', '.chk-activity', function () {
                self.updateActivitySelectedLabel();
            });
            const modalEl = document.getElementById('modalPickActivity');
            modalEl.addEventListener('shown.bs.modal', () => {
                self.scheduleDtAdjust(self.activityLovTable);
            }, { once: true });
        }
    },

    getSelectedActivityIds: function () {
        const ids = [];
        const $ = window.jQuery;
        if ($ && this.activityLovTable) {
            this.activityLovTable.$('.chk-activity:checked').each(function () {
                ids.push(this.value);
            });
            return [...new Set(ids)];
        }
        document.querySelectorAll('#tblActivityLov .chk-activity:checked').forEach(chk => {
            ids.push(chk.value);
        });
        return [...new Set(ids)];
    },

    updateActivitySelectedLabel: function (count) {
        const label = document.getElementById('activitySelectedLabel');
        if (!label) return;
        const n = typeof count === 'number' ? count : this.getSelectedActivityIds().length;
        label.textContent = n + ' dipilih';
    },

    toggleSelectAllActivities: function (checked) {
        const $ = window.jQuery;
        if ($ && this.activityLovTable) {
            this.activityLovTable.$('.chk-activity').prop('checked', !!checked);
        } else {
            document.querySelectorAll('#tblActivityLov .chk-activity').forEach(chk => {
                chk.checked = !!checked;
            });
        }
        this.updateActivitySelectedLabel();
    },

    confirmPickActivities: function () {
        const ids = this.getSelectedActivityIds();
        if (!ids.length) {
            MappingSubdistStore.toast('warning', 'Centang minimal 1 activity');
            return;
        }
        this.pickActivities(ids);
    },

    pickActivities: function (activityIds) {
        const ids = Array.isArray(activityIds) ? activityIds : [activityIds];
        if (!ids.length) return;
        if (!this.ensureParentSaved()) return;

        const parent = MappingSubdistStore.getById(this.itemId);
        if (!parent) {
            MappingSubdistStore.toast('warning', 'Parent belum tersimpan');
            return;
        }

        MappingSubdistStore.addActivities(ids, parent);
        MappingSubdistStore.toast('success', ids.length + ' activity ditambahkan');

        const modalEl = document.getElementById('modalPickActivity');
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            const inst = bootstrap.Modal.getInstance(modalEl);
            if (inst) inst.hide();
        } else if (window.jQuery) {
            window.jQuery(modalEl).modal('hide');
        }

        this.refreshActivitySection();
    },

    save: function (opts) {
        const silent = opts && opts.silent;
        const payload = this.getFormSnapshot();

        if (!payload.kodeKmmd) {
            MappingSubdistStore.toast('warning', 'Pilih Kode KMMD dari Bosnet dulu');
            return false;
        }
        if (!payload.namaKmmd || !payload.titik || !payload.region) {
            MappingSubdistStore.toast('warning', 'Lengkapi identitas wajib');
            return false;
        }
        if (!payload.namaGroup && payload.groupType === 'Group') {
            MappingSubdistStore.toast('warning', 'Nama Group wajib diisi');
            return false;
        }
        if (!payload.groupType) {
            MappingSubdistStore.toast('warning', 'Pilih Group atau Non Group');
            return false;
        }

        if (payload.groupType === 'Non Group') {
            payload.parent = 'YA';
            payload.namaGroup = 'Non Group';
            payload.namaSubdistGroup = payload.namaSubdistGroup || payload.namaKmmd;
        }

        const data = MappingSubdistStore.load();
        const duplicate = data.find(d => d.kodeKmmd === payload.kodeKmmd && d.id !== payload.id);
        if (duplicate) {
            MappingSubdistStore.toast('warning', 'Kode KMMD sudah ada');
            return false;
        }

        if (payload.parent === 'YA' && payload.groupType === 'Group' && payload.namaGroup !== 'Non Group') {
            const otherParent = data.find(d =>
                d.namaGroup === payload.namaGroup && d.parent === 'YA' && d.id !== payload.id
            );
            if (otherParent) {
                MappingSubdistStore.toast('info', `Group ini sudah punya Parent: ${otherParent.namaKmmd}`);
            }
        }

        if (!payload.namaSubdistGroup) {
            payload.namaSubdistGroup = payload.groupType === 'Non Group'
                ? payload.namaKmmd
                : payload.namaGroup;
        }

        MappingSubdistStore.upsert(payload);
        this.itemId = payload.id;
        document.getElementById('editId').value = payload.id;
        this.bosnetLocked = true;
        this.applyBosnetLockUI();
        document.getElementById('pageTitle').textContent = 'Detail';
        document.getElementById('pageSubtitle').textContent = payload.namaKmmd;

        if (window.history && window.history.replaceState) {
            window.history.replaceState({}, '', MappingSubdistStore.formUrl(payload.id));
        }

        if (!silent) MappingSubdistStore.toast('success', 'Data tersimpan');
        this.refreshMappingSections();
        return true;
    }
};

window.MappingSubdistForm = MappingSubdistForm;

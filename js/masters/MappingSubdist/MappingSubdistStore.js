/**
 * Shared storage for Mapping Subdist
 */
const MappingSubdistStore = {
    STORAGE_KEY: 'df_mapping_subdist_v2',
    EDIT_ROLES: ['Administrator', 'CSD / RAS', 'CCD / FA'],
    /** Roles that may run BI unmap correction (mock) */
    CORRECTION_ROLES: ['Administrator', 'CCD / FA'],

    canEdit: function () {
        const role = localStorage.getItem('currentRole') || 'Administrator';
        return this.EDIT_ROLES.includes(role);
    },

    getRole: function () {
        return localStorage.getItem('currentRole') || 'Administrator';
    },

    canCorrectBi: function () {
        return this.CORRECTION_ROLES.includes(this.getRole());
    },

    todayWib: function () {
        if (typeof MockBiLedger !== 'undefined') return MockBiLedger.todayWib();
        const fmt = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Asia/Jakarta',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        return fmt.format(new Date());
    },

    load: function () {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        if (raw) {
            try {
                return JSON.parse(raw);
            } catch (e) {
                console.warn('Invalid mapping subdist storage, reseeding', e);
            }
        }
        const seed = Array.isArray(window.MappingSubdistSeed)
            ? JSON.parse(JSON.stringify(window.MappingSubdistSeed))
            : [];
        this.save(seed);
        return seed;
    },

    save: function (data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    },

    getById: function (id) {
        return this.load().find(d => d.id === id) || null;
    },

    upsert: function (item) {
        const data = this.load();
        const idx = data.findIndex(d => d.id === item.id);
        if (idx >= 0) data[idx] = item;
        else data.push(item);
        this.save(data);
        return item;
    },

    remove: function (id) {
        const data = this.load().filter(d => d.id !== id);
        this.save(data);
    },

    /** Children = linked by parentKode, fallback same namaGroup + PARENT=TIDAK */
    getChildren: function (parentItem) {
        if (!parentItem) return [];
        const data = this.load();
        const parentId = parentItem.id || parentItem.kodeKmmd;

        const byKode = data.filter(d =>
            d.parent === 'TIDAK' &&
            d.id !== parentId &&
            d.parentKode &&
            d.parentKode === parentId
        );
        if (byKode.length) return byKode;

        const group = parentItem.namaGroup;
        if (!group || group === 'Non Group') return [];
        return data.filter(d =>
            d.namaGroup === group &&
            d.parent === 'TIDAK' &&
            d.id !== parentId
        );
    },

    /**
     * Kandidat yang bisa ditambahkan sebagai child ke parent ini:
     * 1) Non Group (standalone) — termasuk yang sekarang Parent YA sendiri
     * 2) Child (PARENT=TIDAK) yang belum masuk group ini (bisa orphan / group lain)
     * Tidak termasuk: diri sendiri, child yang sudah di group ini, Parent YA dari Group lain
     */
    getOrphanCandidates: function (parentItem) {
        if (!parentItem) return [];
        const data = this.load();
        const currentChildren = new Set(this.getChildren(parentItem).map(c => c.id));
        const myGroup = parentItem.namaGroup;

        return data.filter(d => {
            if (d.id === parentItem.id) return false;
            if (currentChildren.has(d.id)) return false;

            // Parent YA yang sudah memegang Group lain → jangan digeser jadi child
            if (d.parent === 'YA' && d.groupType === 'Group' && d.namaGroup && d.namaGroup !== 'Non Group') {
                return false;
            }

            // Sudah child di group yang sama → skip
            if (d.parent === 'TIDAK' && myGroup && myGroup !== 'Non Group' && d.namaGroup === myGroup) {
                return false;
            }

            // Boleh: Non Group (standalone)
            if (d.groupType === 'Non Group' || !d.namaGroup || d.namaGroup === 'Non Group') {
                return true;
            }

            // Boleh: Child di group lain (bisa dipindah ke group ini)
            if (d.parent === 'TIDAK') {
                return true;
            }

            return false;
        });
    },

    /** @deprecated use getOrphanCandidates */
    getChildCandidates: function (parentItem) {
        return this.getOrphanCandidates(parentItem);
    },

    setAsChildOf: function (childId, parentItem) {
        const data = this.load();
        const idx = data.findIndex(d => d.id === childId);
        if (idx < 0) return;
        const groupType = parentItem.groupType || 'Group';
        const namaGroup = groupType === 'Non Group'
            ? 'Non Group'
            : (parentItem.namaGroup || '');
        data[idx].parent = 'TIDAK';
        data[idx].parentKode = parentItem.id || parentItem.kodeKmmd;
        data[idx].groupType = groupType;
        data[idx].namaGroup = namaGroup;
        data[idx].namaSubdistGroup = groupType === 'Non Group'
            ? (parentItem.namaKmmd || parentItem.namaSubdistGroup || namaGroup)
            : (parentItem.namaSubdistGroup || parentItem.namaGroup);
        if (!data[idx].linkedAt) data[idx].linkedAt = this.monthStartLinkedAt(
            typeof MockBiLedger !== 'undefined' ? MockBiLedger.currentYm() : this.todayWib().slice(0, 7)
        );
        this.save(data);
    },

    unlinkChild: function (childId) {
        const data = this.load();
        const idx = data.findIndex(d => d.id === childId);
        if (idx < 0) return;
        data[idx].parent = 'TIDAK';
        data[idx].parentKode = null;
        data[idx].groupType = 'Non Group';
        data[idx].namaGroup = 'Non Group';
        data[idx].namaSubdistGroup = data[idx].namaKmmd;
        data[idx].linkedAt = null;
        this.save(data);
    },

    /**
     * Impact check for unmap wizard (Mock BI) by month range.
     */
    getImpactForChild: function (parentItem, childItem, fromYm, toYm) {
        if (typeof MockBiLedger === 'undefined') {
            return { hasImpact: false, correctionAmount: 0, lines: [], willGoNegative: false };
        }
        const parentKode = parentItem.id || parentItem.kodeKmmd;
        const childKode = childItem.id || childItem.kodeKmmd;
        const today = this.todayWib();
        const linkedAt = childItem.linkedAt || (today.slice(0, 8) + '01');
        const linkedYm = MockBiLedger.toYm(linkedAt);
        const curYm = MockBiLedger.currentYm();
        const from = fromYm || linkedYm;
        const to = toYm || curYm;
        return MockBiLedger.getImpactForChildByMonths(parentKode, childKode, from, to);
    },

    /** Months available for unmap correction: linkedYm … currentYm */
    getUnmapMonthOptions: function (childItem) {
        if (typeof MockBiLedger === 'undefined') return [];
        const today = this.todayWib();
        const linkedAt = (childItem && childItem.linkedAt) || (today.slice(0, 8) + '01');
        const fromYm = MockBiLedger.toYm(linkedAt);
        const toYm = MockBiLedger.currentYm();
        return MockBiLedger.listMonthsBetween(fromYm, toYm).map(ym => ({
            value: ym,
            label: MockBiLedger.formatYmLabel(ym)
        }));
    },

    /** Prior months only (for historical add) — last 12 months before current */
    getHistoricalMonthOptions: function () {
        if (typeof MockBiLedger === 'undefined') return [];
        const cur = MockBiLedger.currentYm();
        let [y, m] = cur.split('-').map(Number);
        m -= 1;
        if (m < 1) { m = 12; y -= 1; }
        const endYm = y + '-' + String(m).padStart(2, '0');
        let sy = y;
        let sm = m - 11;
        while (sm < 1) { sm += 12; sy -= 1; }
        const startYm = sy + '-' + String(sm).padStart(2, '0');
        return MockBiLedger.listMonthsBetween(startYm, endYm).reverse().map(ym => ({
            value: ym,
            label: MockBiLedger.formatYmLabel(ym)
        }));
    },

    applyUnmapCorrection: function (opts) {
        if (typeof MockBiLedger === 'undefined') {
            return { ok: false, message: 'MockBiLedger belum dimuat' };
        }
        return MockBiLedger.applyUnmapCorrection(opts);
    },

    monthStartLinkedAt: function (ym) {
        if (typeof MockBiLedger !== 'undefined') return MockBiLedger.monthStart(ym);
        return (ym || this.todayWib().slice(0, 7)) + '-01';
    },

    getBosnetMaster: function () {
        const seed = Array.isArray(window.MappingSubdistSeed) ? window.MappingSubdistSeed : [];
        const extra = Array.isArray(window.BosnetKmmdExtra) ? window.BosnetKmmdExtra : [];
        return seed.concat(extra);
    },

    /**
     * Kandidat child dari Bosnet — hanya yang belum punya parent.
     * Tidak ditampilkan: diri sendiri, sudah child (punya parent), Non Group, Parent Group lain.
     */
    getBosnetChildCandidates: function (parentItem) {
        if (!parentItem) return [];
        const parentKode = parentItem.kodeKmmd || parentItem.id;
        const linked = new Set(this.getChildren(parentItem).map(c => c.kodeKmmd));
        const store = this.load();
        const byKode = new Map(
            store.filter(d => d.kodeKmmd).map(d => [String(d.kodeKmmd), d])
        );

        return this.getBosnetMaster().filter(d => {
            const kode = d.kodeKmmd ? String(d.kodeKmmd) : '';
            if (!kode || kode === String(parentKode)) return false;
            if (linked.has(d.kodeKmmd) || linked.has(kode)) return false;

            const existing = byKode.get(kode);
            // Belum ada di mapping sama sekali → boleh dipilih
            if (!existing) return true;

            // Sudah punya parent / sudah jadi child → skip
            if (existing.parentKode || existing.parent === 'TIDAK') return false;

            // Non Group (standalone) → skip
            if (
                existing.groupType === 'Non Group' ||
                !existing.namaGroup ||
                existing.namaGroup === 'Non Group'
            ) {
                return false;
            }

            // Parent Group (YA) → skip
            if (existing.parent === 'YA') return false;

            return false;
        });
    },

    addChildrenFromBosnet: function (kodes, parentItem, linkedAtYm) {
        const list = Array.isArray(kodes) ? kodes : [kodes];
        const master = this.getBosnetMaster();
        const linkedAt = this.monthStartLinkedAt(
            linkedAtYm || (typeof MockBiLedger !== 'undefined' ? MockBiLedger.currentYm() : this.todayWib().slice(0, 7))
        );
        list.forEach(kode => {
            const src = master.find(d => d.kodeKmmd === kode);
            if (!src) return;

            let existing = this.load().find(d => d.kodeKmmd === kode);
            if (!existing) {
                existing = {
                    id: src.kodeKmmd,
                    parent: 'TIDAK',
                    parentKode: parentItem.id || parentItem.kodeKmmd,
                    kodeKmmd: src.kodeKmmd,
                    namaKmmd: src.namaKmmd || '',
                    titik: src.titik || '',
                    groupType: parentItem.groupType || 'Group',
                    namaGroup: parentItem.groupType === 'Non Group' ? 'Non Group' : (parentItem.namaGroup || ''),
                    namaSubdistGroup: parentItem.groupType === 'Non Group'
                        ? (parentItem.namaKmmd || '')
                        : (parentItem.namaSubdistGroup || parentItem.namaGroup || ''),
                    kodeBranch: src.kodeBranch || '',
                    branchEpm: src.branchEpm || '',
                    region: src.region || '',
                    tipeKmmd: src.tipeKmmd || 'KMMD-B',
                    alamat: src.alamat || '',
                    active: src.active !== false,
                    linkedAt: linkedAt
                };
                this.upsert(existing);
            } else {
                this.setAsChildOf(existing.id, parentItem);
                const data = this.load();
                const idx = data.findIndex(d => d.id === existing.id);
                if (idx >= 0) {
                    data[idx].linkedAt = linkedAt;
                    this.save(data);
                }
            }
        });
    },

    getMasterActivities: function () {
        return Array.isArray(window.MasterActivitySeed)
            ? window.MasterActivitySeed.filter(a => a.active !== false)
            : [];
    },

    getMappedActivities: function (parentItem) {
        if (!parentItem) return [];
        const parent = this.getById(parentItem.id || parentItem.kodeKmmd);
        const list = parent && Array.isArray(parent.activities) ? parent.activities : [];
        return list.slice();
    },

    getActivityCandidates: function (parentItem) {
        const mapped = new Set(this.getMappedActivities(parentItem).map(a => a.id || a.kode));
        return this.getMasterActivities().filter(a => !mapped.has(a.id) && !mapped.has(a.kode));
    },

    addActivities: function (activityIds, parentItem) {
        const ids = Array.isArray(activityIds) ? activityIds : [activityIds];
        const parentId = parentItem.id || parentItem.kodeKmmd;
        const parent = this.getById(parentId);
        if (!parent) return;

        const master = this.getMasterActivities();
        const current = Array.isArray(parent.activities) ? parent.activities.slice() : [];
        const have = new Set(current.map(a => a.id || a.kode));

        ids.forEach(id => {
            if (have.has(id)) return;
            const src = master.find(a => a.id === id || a.kode === id);
            if (!src) return;
            current.push({
                id: src.id,
                kode: src.kode,
                nama: src.nama,
                kategori: src.kategori || '',
                deskripsi: src.deskripsi || ''
            });
            have.add(src.id);
        });

        parent.activities = current;
        this.upsert(parent);
    },

    unlinkActivity: function (parentId, activityId) {
        const parent = this.getById(parentId);
        if (!parent || !Array.isArray(parent.activities)) return;
        parent.activities = parent.activities.filter(a => a.id !== activityId && a.kode !== activityId);
        this.upsert(parent);
    },

    toast: function (icon, text) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({ icon, text, timer: 1800, showConfirmButton: false });
        } else {
            alert(text);
        }
    },

    /** @returns {Promise<boolean>} */
    confirm: async function (text, title) {
        await this.ensureSwal();
        if (typeof Swal === 'undefined') {
            return window.confirm(text);
        }
        const result = await Swal.fire({
            icon: 'warning',
            title: title || 'Konfirmasi',
            text,
            showCancelButton: true,
            confirmButtonText: 'Ya, Lepas',
            cancelButtonText: 'Batal',
            customClass: {
                confirmButton: 'btn btn-danger',
                cancelButton: 'btn btn-outline-secondary ms-1'
            },
            buttonsStyling: false
        });
        return !!(result.isConfirmed || result.value);
    },

    esc: function (v) {
        return String(v == null ? '' : v)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    },

    ensureSwal: async function () {
        if (typeof Swal !== 'undefined') return;
        const base = this.getBasePath();
        await this.loadScript(base + 'lib/vuexy/vendor/libs/sweetalert2/sweetalert2.js');
    },

    getBasePath: function () {
        const scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            if (scripts[i].src && scripts[i].src.includes('/js/layout.js')) {
                return scripts[i].src.substring(0, scripts[i].src.indexOf('/js/layout.js')) + '/';
            }
        }
        return '../';
    },

    loadScript: function (src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            const s = document.createElement('script');
            s.src = src;
            s.onload = resolve;
            s.onerror = reject;
            document.body.appendChild(s);
        });
    },

    formUrl: function (id) {
        const base = 'mapping-subdist-form.html';
        return id ? `${base}?id=${encodeURIComponent(id)}` : base;
    }
};

window.MappingSubdistStore = MappingSubdistStore;

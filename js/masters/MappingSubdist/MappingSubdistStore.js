/**
 * Shared storage for Mapping Subdist
 */
const MappingSubdistStore = {
    STORAGE_KEY: 'df_mapping_subdist_v2',
    EDIT_ROLES: ['Administrator', 'CSD / RAS'],

    canEdit: function () {
        const role = localStorage.getItem('currentRole') || 'Administrator';
        return this.EDIT_ROLES.includes(role);
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
        this.save(data);
    },

    toast: function (icon, text) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({ icon, text, timer: 1800, showConfirmButton: false });
        } else {
            alert(text);
        }
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

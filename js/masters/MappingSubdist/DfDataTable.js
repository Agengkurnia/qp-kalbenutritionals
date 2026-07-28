/**
 * Standard DataTables helper — Development Fund
 * Grid look: bordered + consistent layout (l/f top, i/p bottom)
 */
const DfDataTable = {
    language: {
        emptyTable: 'Tidak ada data',
        zeroRecords: 'Tidak ada data yang cocok',
        search: 'Cari:',
        lengthMenu: 'Tampil _MENU_',
        info: 'Menampilkan _START_–_END_ dari _TOTAL_',
        infoEmpty: 'Menampilkan 0 data',
        infoFiltered: '(filter dari _MAX_ total)',
        paginate: {
            first: 'Awal',
            last: 'Akhir',
            next: '›',
            previous: '‹'
        }
    },

    /** Bootstrap grid layout for controls — aligned MAVEN DataTables */
    dom: '<"row mx-0 mb-3 align-items-center"<"col-sm-6"l><"col-sm-6"f>>rt<"row mx-0 mt-3 align-items-center"<"col-sm-5"i><"col-sm-7"p>>',

    tableClass: 'table table-bordered table-sm w-100',

    defaults: function (extra) {
        const base = {
            pageLength: 10,
            lengthMenu: [5, 10, 25, 50, 100],
            autoWidth: false,
            destroy: true,
            responsive: false,
            language: this.language,
            dom: this.dom
        };
        const merged = Object.assign({}, base, extra || {});
        // language harus di-merge, jangan diganti partial
        if (extra && extra.language) {
            merged.language = Object.assign({}, this.language, extra.language);
        }
        return merged;
    },

    ensureAssets: async function () {
        const $ = window.jQuery;
        if ($ && $.fn && typeof $.fn.DataTable === 'function') return;

        const base = (window.MappingSubdistStore && MappingSubdistStore.getBasePath)
            ? MappingSubdistStore.getBasePath()
            : '../';

        const load = (src) => {
            if (window.MappingSubdistStore && MappingSubdistStore.loadScript) {
                return MappingSubdistStore.loadScript(src);
            }
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
        };

        await load(base + 'lib/datatables/jquery.dataTables.min.js');
        await load(base + 'lib/vuexy/vendor/js/tables/datatable/dataTables.bootstrap5.min.js');
    },

    prepareTable: function (selector) {
        const el = typeof selector === 'string'
            ? document.querySelector(selector)
            : selector;
        if (!el) return null;

        // Pastikan parent wrapper punya class grid
        const wrap = el.closest('.table-responsive') || el.parentElement;
        if (wrap) wrap.classList.add('df-dt-wrap');

        // Keep existing theme classes (e.g. datatables-basic) + ensure bordered width
        const keep = (el.className || '').split(/\s+/).filter(Boolean);
        const base = this.tableClass.split(/\s+/);
        el.className = [...new Set(keep.concat(base))].join(' ');
        el.style.width = '100%';
        return el;
    },

    destroy: function (selector) {
        const $ = window.jQuery;
        if (!$ || !$.fn || typeof $.fn.DataTable !== 'function') return;
        const sel = typeof selector === 'string' ? selector : '#' + selector.id;
        if ($.fn.DataTable.isDataTable(sel)) {
            try {
                $(sel).DataTable().clear().destroy();
            } catch (e) { /* ignore */ }
        }
        const tbody = document.querySelector(sel + ' tbody');
        if (tbody) tbody.innerHTML = '';
    },

    /**
     * @param {string} selector - e.g. '#tblChild'
     * @param {object} options - DataTables options (merged with defaults)
     * @returns {DataTable|null}
     */
    init: function (selector, options) {
        const $ = window.jQuery;
        if (!$ || !$.fn || typeof $.fn.DataTable !== 'function') {
            console.warn('DfDataTable: DataTables belum tersedia untuk', selector);
            return null;
        }

        const el = this.prepareTable(selector);
        if (!el) {
            console.warn('DfDataTable: elemen tidak ditemukan', selector);
            return null;
        }

        this.destroy(selector);

        const api = $(selector).DataTable(this.defaults(options));

        // Perbaiki lebar setelah render (penting bila sebelumnya di container hidden)
        try {
            api.columns.adjust();
            $(selector).css('width', '100%');
        } catch (e) { /* ignore */ }

        return api;
    },

    /** Panggil setelah container dari display:none → visible */
    adjust: function (apiOrSelector) {
        const $ = window.jQuery;
        if (!$ || !$.fn || typeof $.fn.DataTable !== 'function') return;

        let api = apiOrSelector;
        if (typeof apiOrSelector === 'string') {
            if (!$.fn.DataTable.isDataTable(apiOrSelector)) return;
            api = $(apiOrSelector).DataTable();
        }
        if (!api) return;
        try {
            api.columns.adjust();
        } catch (e) { /* ignore */ }
    }
};

window.DfDataTable = DfDataTable;

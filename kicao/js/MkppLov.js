/**
 * LOV modal — mirip KICAO KDS List Of Value (bukan window.prompt)
 */
const MkppLov = {
    _rows: [],
    _onSelect: null,
    _columns: [],

    ensureModal: function () {
        if (document.getElementById('modalMkppLov')) return;
        const html =
            '<div class="modal fade" id="modalMkppLov" tabindex="-1" role="dialog">' +
            '<div class="modal-dialog modal-lg" role="document">' +
            '<div class="modal-content">' +
            '<div class="modal-header mkpp-lov-header">' +
            '<button type="button" class="close" data-dismiss="modal" style="color:#fff;opacity:1;">&times;</button>' +
            '<h4 class="modal-title" style="color:#fff;"><span id="lblMkppLovTitle">List Of Value</span></h4>' +
            '</div>' +
            '<div class="modal-body">' +
            '<div class="form-group">' +
            '<label>Search</label>' +
            '<input type="text" class="form-control" id="txtMkppLovSearch" placeholder="Ketik untuk filter...">' +
            '</div>' +
            '<div class="table-responsive">' +
            '<table id="tbMkppLov" class="table table-condensed table-hover table-bordered">' +
            '<thead><tr id="tbMkppLovHead"></tr></thead>' +
            '<tbody id="tbMkppLovBody"></tbody>' +
            '</table>' +
            '</div>' +
            '<p class="text-muted" id="lblMkppLovEmpty" style="display:none;">Tidak ada data.</p>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-default" data-dismiss="modal">Tutup</button>' +
            '</div>' +
            '</div></div></div>';
        document.body.insertAdjacentHTML('beforeend', html);

        const self = this;
        document.getElementById('txtMkppLovSearch').addEventListener('input', function () {
            self.renderRows(this.value || '');
        });
        $(document).on('click', '#tbMkppLovBody .btn-mkpp-lov-pilih', function () {
            const idx = parseInt(this.getAttribute('data-idx'), 10);
            const row = self._rows[idx];
            if (!row) return;
            $('#modalMkppLov').modal('hide');
            if (typeof self._onSelect === 'function') self._onSelect(row);
        });
    },

    esc: function (s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/"/g, '&quot;');
    },

    /**
     * @param {object} opts
     * @param {string} opts.title
     * @param {string[]} opts.columns - header labels (without Pilih)
     * @param {Array<object>} opts.rows - each { values: string[], data: any }
     * @param {function} opts.onSelect - receives row object
     */
    open: function (opts) {
        opts = opts || {};
        this.ensureModal();
        this._onSelect = opts.onSelect || null;
        this._columns = opts.columns || ['Value'];
        this._rows = Array.isArray(opts.rows) ? opts.rows : [];

        document.getElementById('lblMkppLovTitle').textContent = opts.title || 'List Of Value';
        document.getElementById('txtMkppLovSearch').value = '';

        const head =
            '<th style="width:70px;"><div style="font-weight:bold">Pilih</div></th>' +
            this._columns.map(c => '<th><div style="font-weight:bold">' + this.esc(c) + '</div></th>').join('');
        document.getElementById('tbMkppLovHead').innerHTML = head;
        this.renderRows('');
        $('#modalMkppLov').modal('show');
        setTimeout(function () {
            const el = document.getElementById('txtMkppLovSearch');
            if (el) el.focus();
        }, 300);
    },

    renderRows: function (filter) {
        const q = String(filter || '').toLowerCase().trim();
        const body = document.getElementById('tbMkppLovBody');
        const empty = document.getElementById('lblMkppLovEmpty');
        let html = '';
        let shown = 0;
        this._rows.forEach((row, idx) => {
            const vals = row.values || [];
            const hay = vals.join(' ').toLowerCase();
            if (q && hay.indexOf(q) < 0) return;
            shown++;
            html +=
                '<tr>' +
                '<td><input type="button" class="btn btn-primary btn-xs btn-mkpp-lov-pilih" data-idx="' + idx + '" value="Pilih"></td>' +
                vals.map(v => '<td>' + this.esc(v) + '</td>').join('') +
                '</tr>';
        });
        body.innerHTML = html;
        empty.style.display = shown ? 'none' : '';
    },

    /** Helpers for MKPP fields */
    openGroupAccount: function (onSelect) {
        const items = [
            { code: 'ADYAJATI', name: 'PT. Adyajati Lestari Group' },
            { code: 'VICTOR', name: 'CV. Victor Wijaya (Binjai)' },
            { code: 'BINTANG', name: 'PD. Bintang Lima Group' }
        ];
        this.open({
            title: 'List Of Value — Group Account',
            columns: ['Code', 'Group Account'],
            rows: items.map(i => ({ values: [i.code, i.name], data: i })),
            onSelect: function (row) {
                if (onSelect) onSelect(row.data.name, row.data);
            }
        });
    },

    openBudgetType: function (onSelect) {
        const items = [
            { code: 'DF', name: 'DF — Development Fund' },
            { code: 'TM', name: 'Trade Marketing' },
            { code: 'AP', name: 'AP Promotion' }
        ];
        this.open({
            title: 'List Of Value — Budget Type',
            columns: ['Code', 'Budget Type'],
            rows: items.map(i => ({ values: [i.code, i.name], data: i })),
            onSelect: function (row) {
                if (onSelect) onSelect(row.data.name, row.data);
            }
        });
    },

    openParentMkpp: function (onSelect) {
        const list = MkppStore.list().filter(d =>
            d.status === MkppStore.STATUS.APPROVED || d.status === MkppStore.STATUS.CLOSED
        );
        this.open({
            title: 'List Of Value — MKPP Parent',
            columns: ['Doc No', 'Date', 'Status', 'Group Account'],
            rows: list.map(d => ({
                values: [d.docNo, d.date, d.status, d.groupAccount || ''],
                data: d
            })),
            onSelect: function (row) {
                if (onSelect) onSelect(row.data.docNo, row.data);
            }
        });
    },

    openFindMkpp: function (onSelect) {
        const list = MkppStore.list();
        this.open({
            title: 'List Of Value — Find MKPP',
            columns: ['Doc No', 'Date', 'Status', 'Budget Type', 'Group Account'],
            rows: list.map(d => ({
                values: [d.docNo, d.date, d.status, d.budgetType || '', d.groupAccount || ''],
                data: d
            })),
            onSelect: function (row) {
                if (onSelect) onSelect(row.data);
            }
        });
    }
};

window.MkppLov = MkppLov;

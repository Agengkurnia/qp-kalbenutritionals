/**
 * MKPP prototype — localStorage mock CRUD
 */
const MkppPrototype = {
    STORAGE_KEY: 'df_kicao_mkpp_v1',

    loadAll: function () {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        if (raw) {
            try {
                const data = JSON.parse(raw);
                if (Array.isArray(data)) return data;
            } catch (e) { /* reseed */ }
        }
        const seed = [this.buildSeed()];
        this.saveAll(seed);
        return seed;
    },

    saveAll: function (list) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    },

    todayStr: function () {
        const d = new Date();
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        return dd + '/' + mm + '/' + d.getFullYear();
    },

    todayIso: function () {
        const d = new Date();
        return d.toISOString().slice(0, 10);
    },

    nextDocNo: function () {
        const list = this.loadAll();
        const ym = this.todayIso().slice(0, 7).replace('-', '');
        const prefix = 'MKPP-DF-' + ym + '-';
        let max = 0;
        list.forEach(d => {
            if (d.docNo && d.docNo.indexOf(prefix) === 0) {
                const n = parseInt(d.docNo.slice(prefix.length), 10);
                if (!isNaN(n) && n > max) max = n;
            }
        });
        return prefix + String(max + 1).padStart(3, '0');
    },

    buildSeed: function () {
        return {
            id: 'seed-1',
            docNo: 'MKPP-DF-202607-001',
            date: '01/07/2026',
            refDocNo: '',
            status: 'Draft',
            groupAccount: 'PT. Adyajati Lestari Group',
            onoDocNo: '',
            budgetType: 'DF — Development Fund',
            postingDate: '2026-07-01',
            programDesc: 'Prototype memo activity Development Fund — Subdist Medan (Adyajati).',
            updatedAt: new Date().toISOString()
        };
    },

    list: function () {
        return this.loadAll().slice().sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
    },

    get: function (id) {
        return this.loadAll().find(d => d.id === id || d.docNo === id) || null;
    },

    createNew: function () {
        return {
            id: 'new-' + Date.now().toString(36),
            docNo: this.nextDocNo(),
            date: this.todayStr(),
            refDocNo: '',
            status: 'Draft',
            groupAccount: '',
            onoDocNo: '',
            budgetType: 'DF — Development Fund',
            postingDate: this.todayIso(),
            programDesc: '',
            updatedAt: new Date().toISOString()
        };
    },

    validate: function (doc) {
        if (!doc.budgetType || !String(doc.budgetType).trim()) return 'Budget Type wajib diisi';
        if (!doc.groupAccount || !String(doc.groupAccount).trim()) return 'Group Account wajib diisi';
        if (!doc.programDesc || !String(doc.programDesc).trim()) return 'Program Description wajib diisi';
        return null;
    },

    save: function (doc) {
        const err = this.validate(doc);
        if (err) return { ok: false, message: err };
        doc.updatedAt = new Date().toISOString();
        if (!doc.status) doc.status = 'Draft';
        const list = this.loadAll();
        const idx = list.findIndex(d => d.id === doc.id);
        if (idx >= 0) list[idx] = doc;
        else list.push(doc);
        this.saveAll(list);
        return { ok: true, doc: doc };
    },

    submit: function (doc) {
        const err = this.validate(doc);
        if (err) return { ok: false, message: err };
        doc.status = 'Submitted';
        return this.save(doc);
    },

    readForm: function () {
        return {
            id: document.getElementById('txtHiddenId').value || ('new-' + Date.now().toString(36)),
            docNo: document.getElementById('txtDocNo').value,
            date: document.getElementById('dtmDate').value,
            refDocNo: document.getElementById('txtRefDocNo').value,
            status: document.getElementById('lblStatusFlow').textContent || 'Draft',
            groupAccount: document.getElementById('txtGroupAccount').value,
            onoDocNo: document.getElementById('txtDocNoONO').value,
            budgetType: document.getElementById('txtBudgetType').value,
            postingDate: document.getElementById('txtdtPostingDate').value,
            programDesc: document.getElementById('txtProgramDesc').value
        };
    },

    fillForm: function (doc) {
        if (!doc) return;
        document.getElementById('txtHiddenId').value = doc.id || '';
        document.getElementById('txtDocNo').value = doc.docNo || '';
        document.getElementById('dtmDate').value = doc.date || '';
        document.getElementById('txtRefDocNo').value = doc.refDocNo || '';
        const st = document.getElementById('lblStatusFlow');
        st.textContent = doc.status || 'Draft';
        st.className = 'control-label' + (doc.status === 'Submitted' ? ' status-submitted' : '');
        document.getElementById('txtGroupAccount').value = doc.groupAccount || '';
        document.getElementById('txtDocNoONO').value = doc.onoDocNo || '';
        document.getElementById('txtBudgetType').value = doc.budgetType || 'DF — Development Fund';
        document.getElementById('txtdtPostingDate').value = doc.postingDate || '';
        document.getElementById('txtProgramDesc').value = doc.programDesc || '';
    },

    init: function () {
        const self = this;
        this.fillForm(this.get('seed-1') || this.createNew());

        document.getElementById('btnNew').addEventListener('click', function () {
            self.fillForm(self.createNew());
            KicaoLayout.toast('Form baru siap diisi.', 'New');
        });

        document.getElementById('btnSave').addEventListener('click', function () {
            const doc = self.readForm();
            const res = self.save(doc);
            if (!res.ok) {
                KicaoLayout.toast(res.message, 'Validasi');
                return;
            }
            self.fillForm(res.doc);
            KicaoLayout.toast('Dokumen disimpan (mock localStorage).', 'Save');
        });

        document.getElementById('btnSubmit').addEventListener('click', function () {
            const doc = self.readForm();
            const res = self.submit(doc);
            if (!res.ok) {
                KicaoLayout.toast(res.message, 'Validasi');
                return;
            }
            self.fillForm(res.doc);
            KicaoLayout.toast('Status diubah menjadi Submitted (prototype).', 'Submit');
        });

        document.getElementById('btnPrintout').addEventListener('click', function () {
            KicaoLayout.toast('Print belum tersedia di prototype fase 1.', 'Print');
        });

        document.getElementById('btnFind').addEventListener('click', function () {
            self.openFindModal();
        });

        document.getElementById('btnLOVGroupAccount').addEventListener('click', function () {
            const options = [
                'PT. Adyajati Lestari Group',
                'CV. Victor Wijaya (Binjai)',
                'PD. Bintang Lima Group'
            ];
            const msg = 'Pilih nomor Group Account:\n1. ' + options[0] + '\n2. ' + options[1] + '\n3. ' + options[2];
            const pick = window.prompt(msg, '1');
            if (pick == null) return;
            const idx = parseInt(pick, 10) - 1;
            document.getElementById('txtGroupAccount').value =
                (idx >= 0 && idx < options.length) ? options[idx] : pick.trim();
        });

        document.getElementById('btnLOVBudgetType').addEventListener('click', function () {
            document.getElementById('txtBudgetType').value = 'DF — Development Fund';
        });
    },

    openFindModal: function () {
        const list = this.list();
        const rows = list.map(d =>
            '<tr data-id="' + d.id + '">' +
            '<td>' + (d.docNo || '') + '</td>' +
            '<td>' + (d.date || '') + '</td>' +
            '<td>' + (d.status || '') + '</td>' +
            '<td>' + (d.budgetType || '') + '</td>' +
            '</tr>'
        ).join('');

        const html =
            '<div class="table-responsive"><table class="table table-bordered table-striped table-hover" id="tblFindMkpp">' +
            '<thead><tr><th>Doc No</th><th>Date</th><th>Status</th><th>Budget Type</th></tr></thead>' +
            '<tbody>' + (rows || '<tr><td colspan="4">Belum ada data</td></tr>') + '</tbody></table></div>' +
            '<p class="text-muted">Klik baris untuk membuka dokumen.</p>';

        const self = this;
        if (typeof bootbox !== 'undefined') {
            const dlg = bootbox.dialog({
                title: 'Find MKPP',
                message: html,
                size: 'large',
                buttons: {
                    cancel: { label: 'Tutup', className: 'btn-default' }
                }
            });
            dlg.on('shown.bs.modal', function () {
                dlg.find('#tblFindMkpp tbody tr[data-id]').on('click', function () {
                    const id = this.getAttribute('data-id');
                    const doc = self.get(id);
                    if (doc) {
                        self.fillForm(doc);
                        dlg.modal('hide');
                    }
                });
            });
        } else {
            const id = list[0] && list[0].id;
            if (id) this.fillForm(this.get(id));
        }
    }
};

window.MkppPrototype = MkppPrototype;

/**
 * MKPP Activity grid + Supplier / Budget / Subbrand / Attachment modals
 */
const MkppActivity = {
    doc: null,
    editActIdx: -1,
    editBgtIdx: -1,

    setDoc: function (doc) {
        this.doc = doc;
        if (!this.doc.activities) this.doc.activities = [];
        this.render();
    },

    getDoc: function () {
        return this.doc;
    },

    fmt: function (n) {
        return (Number(n) || 0).toLocaleString('id-ID');
    },

    render: function () {
        const tbody = document.querySelector('#dtActivity tbody');
        if (!tbody || !this.doc) return;
        const locked = this.isLocked();
        const rows = (this.doc.activities || []).map((a, i) => {
            return (
                '<tr data-idx="' + i + '">' +
                '<td>' + (i + 1) + '</td>' +
                '<td><input class="form-control input-sm act-code" data-idx="' + i + '" value="' + this.esc(a.code) + '" ' + (locked ? 'disabled' : '') + ' placeholder="Code">' +
                '<input class="form-control input-sm act-name" data-idx="' + i + '" value="' + this.esc(a.name) + '" ' + (locked ? 'disabled' : '') + ' placeholder="Name" style="margin-top:4px;"></td>' +
                '<td><input type="date" class="form-control input-sm act-from" data-idx="' + i + '" value="' + this.esc(a.periodFrom) + '" ' + (locked ? 'disabled' : '') + '></td>' +
                '<td><input type="date" class="form-control input-sm act-to" data-idx="' + i + '" value="' + this.esc(a.periodTo) + '" ' + (locked ? 'disabled' : '') + '></td>' +
                '<td><button type="button" class="btn btn-xs btn-info btn-budget" data-idx="' + i + '">Budget (' + (a.budgets || []).length + ')</button></td>' +
                '<td><input type="number" class="form-control input-sm act-amount" data-idx="' + i + '" value="' + (Number(a.amount) || 0) + '" ' + (locked ? 'disabled' : '') + '></td>' +
                '<td><input type="number" class="form-control input-sm act-target" data-idx="' + i + '" value="' + (Number(a.target) || 0) + '" ' + (locked ? 'disabled' : '') + '></td>' +
                '<td><button type="button" class="btn btn-xs btn-primary btn-supplier" data-idx="' + i + '">Supplier (' + (a.suppliers || []).length + ')</button></td>' +
                '<td><button type="button" class="btn btn-xs btn-default btn-act-att" data-idx="' + i + '">Att (' + (a.attachments || []).length + ')</button></td>' +
                '<td>' + (locked ? '' : '<button type="button" class="btn btn-xs btn-danger btn-act-del" data-idx="' + i + '"><i class="fa fa-trash"></i></button>') + '</td>' +
                '</tr>'
            );
        }).join('');
        tbody.innerHTML = rows || '<tr><td colspan="10" class="text-muted">Belum ada activity. Klik Add Row.</td></tr>';
        this.bindRowEvents();
        const totalEl = document.getElementById('lblTotalAmount');
        if (totalEl) totalEl.textContent = this.fmt(MkppStore.totalAmount(this.doc));
    },

    esc: function (s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;');
    },

    isLocked: function () {
        if (!this.doc) return false;
        const s = this.doc.status;
        return s !== MkppStore.STATUS.DRAFT && s !== MkppStore.STATUS.REJECTED;
    },

    syncFromDom: function () {
        if (!this.doc) return;
        (this.doc.activities || []).forEach((a, i) => {
            const code = document.querySelector('.act-code[data-idx="' + i + '"]');
            const name = document.querySelector('.act-name[data-idx="' + i + '"]');
            const from = document.querySelector('.act-from[data-idx="' + i + '"]');
            const to = document.querySelector('.act-to[data-idx="' + i + '"]');
            const amount = document.querySelector('.act-amount[data-idx="' + i + '"]');
            const target = document.querySelector('.act-target[data-idx="' + i + '"]');
            if (code) a.code = code.value;
            if (name) a.name = name.value;
            if (from) a.periodFrom = from.value;
            if (to) a.periodTo = to.value;
            if (amount) a.amount = Number(amount.value) || 0;
            if (target) a.target = Number(target.value) || 0;
        });
    },

    bindRowEvents: function () {
        const self = this;
        document.querySelectorAll('.btn-act-del').forEach(btn => {
            btn.onclick = function () {
                self.syncFromDom();
                const idx = parseInt(this.getAttribute('data-idx'), 10);
                self.doc.activities.splice(idx, 1);
                self.render();
            };
        });
        document.querySelectorAll('.btn-supplier').forEach(btn => {
            btn.onclick = function () {
                self.syncFromDom();
                self.openSupplierModal(parseInt(this.getAttribute('data-idx'), 10));
            };
        });
        document.querySelectorAll('.btn-budget').forEach(btn => {
            btn.onclick = function () {
                self.syncFromDom();
                self.openBudgetModal(parseInt(this.getAttribute('data-idx'), 10));
            };
        });
        document.querySelectorAll('.btn-act-att').forEach(btn => {
            btn.onclick = function () {
                self.syncFromDom();
                self.openAttachmentModal(parseInt(this.getAttribute('data-idx'), 10));
            };
        });
        ['.act-code', '.act-name', '.act-from', '.act-to', '.act-amount', '.act-target'].forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                el.onchange = el.onblur = function () { self.syncFromDom(); };
            });
        });
    },

    addRow: function () {
        if (this.isLocked()) return;
        this.syncFromDom();
        this.doc.activities.push(MkppStore.blankActivity());
        this.render();
    },

    openSupplierModal: function (actIdx) {
        this.editActIdx = actIdx;
        const act = this.doc.activities[actIdx];
        if (!act) return;
        const locked = this.isLocked();
        const rows = (act.suppliers || []).map((s, i) =>
            '<tr>' +
            '<td><input class="form-control input-sm sup-site" data-i="' + i + '" value="' + this.esc(s.accountSite) + '" ' + (locked ? 'disabled' : '') + '></td>' +
            '<td><input class="form-control input-sm sup-name" data-i="' + i + '" value="' + this.esc(s.accountName) + '" ' + (locked ? 'disabled' : '') + '></td>' +
            '<td><input class="form-control input-sm sup-kam" data-i="' + i + '" value="' + this.esc(s.kam) + '" ' + (locked ? 'disabled' : '') + '></td>' +
            '<td>' + (locked ? '' : '<button type="button" class="btn btn-xs btn-danger btn-sup-del" data-i="' + i + '">Del</button>') + '</td>' +
            '</tr>'
        ).join('');
        document.getElementById('tblSupplierBody').innerHTML = rows || '';
        document.getElementById('btnAddSupplier').style.display = locked ? 'none' : '';
        document.getElementById('btnOkSupplier').style.display = locked ? 'none' : '';
        $('#modalSupplier').modal('show');
    },

    bindSupplierModal: function () {
        const self = this;
        document.getElementById('btnAddSupplier').onclick = function () {
            const act = self.doc.activities[self.editActIdx];
            if (!act) return;
            act.suppliers = act.suppliers || [];
            act.suppliers.push(MkppStore.blankSupplier());
            self.openSupplierModal(self.editActIdx);
        };
        document.getElementById('btnOkSupplier').onclick = function () {
            const act = self.doc.activities[self.editActIdx];
            if (!act) return;
            const sites = document.querySelectorAll('#tblSupplierBody .sup-site');
            act.suppliers = [];
            sites.forEach((el, i) => {
                act.suppliers.push({
                    id: MkppStore.uid('sup'),
                    accountSite: el.value,
                    accountName: document.querySelectorAll('#tblSupplierBody .sup-name')[i].value,
                    kam: document.querySelectorAll('#tblSupplierBody .sup-kam')[i].value,
                    active: true
                });
            });
            $('#modalSupplier').modal('hide');
            self.render();
        };
        $(document).on('click', '.btn-sup-del', function () {
            const i = parseInt(this.getAttribute('data-i'), 10);
            const act = self.doc.activities[self.editActIdx];
            if (!act) return;
            // sync first
            const sites = document.querySelectorAll('#tblSupplierBody .sup-site');
            const tmp = [];
            sites.forEach((el, idx) => {
                tmp.push({
                    id: MkppStore.uid('sup'),
                    accountSite: el.value,
                    accountName: document.querySelectorAll('#tblSupplierBody .sup-name')[idx].value,
                    kam: document.querySelectorAll('#tblSupplierBody .sup-kam')[idx].value,
                    active: true
                });
            });
            act.suppliers = tmp;
            act.suppliers.splice(i, 1);
            self.openSupplierModal(self.editActIdx);
        });
    },

    openBudgetModal: function (actIdx) {
        this.editActIdx = actIdx;
        const act = this.doc.activities[actIdx];
        if (!act) return;
        const locked = this.isLocked();
        const rows = (act.budgets || []).map((b, i) =>
            '<tr>' +
            '<td><input class="form-control input-sm bgt-dept" data-i="' + i + '" value="' + this.esc(b.department) + '" ' + (locked ? 'disabled' : '') + '></td>' +
            '<td><input class="form-control input-sm bgt-coa" data-i="' + i + '" value="' + this.esc(b.coa) + '" ' + (locked ? 'disabled' : '') + '></td>' +
            '<td><input type="number" class="form-control input-sm bgt-alo" data-i="' + i + '" value="' + (Number(b.alokasi) || 0) + '" ' + (locked ? 'disabled' : '') + '></td>' +
            '<td><input class="form-control input-sm bgt-dol" data-i="' + i + '" value="' + this.esc(b.dolphineRef) + '" ' + (locked ? 'disabled' : '') + '></td>' +
            '<td><button type="button" class="btn btn-xs btn-warning btn-subbrand" data-i="' + i + '">Sub (' + (b.subbrands || []).length + ')</button></td>' +
            '<td>' + (locked ? '' : '<button type="button" class="btn btn-xs btn-danger btn-bgt-del" data-i="' + i + '">Del</button>') + '</td>' +
            '</tr>'
        ).join('');
        document.getElementById('tblBudgetBody').innerHTML = rows || '';
        document.getElementById('btnAddBudget').style.display = locked ? 'none' : '';
        document.getElementById('btnOkBudget').style.display = locked ? 'none' : '';
        $('#modalBudget').modal('show');
    },

    syncBudgetsFromDom: function () {
        const act = this.doc.activities[this.editActIdx];
        if (!act) return;
        const depts = document.querySelectorAll('#tblBudgetBody .bgt-dept');
        const existing = act.budgets || [];
        const next = [];
        depts.forEach((el, i) => {
            const prev = existing[i] || MkppStore.blankBudget();
            next.push({
                id: prev.id || MkppStore.uid('bgt'),
                department: el.value,
                coa: document.querySelectorAll('#tblBudgetBody .bgt-coa')[i].value,
                alokasi: Number(document.querySelectorAll('#tblBudgetBody .bgt-alo')[i].value) || 0,
                subtotal: Number(document.querySelectorAll('#tblBudgetBody .bgt-alo')[i].value) || 0,
                dolphineRef: document.querySelectorAll('#tblBudgetBody .bgt-dol')[i].value,
                subbrands: prev.subbrands || []
            });
        });
        act.budgets = next;
    },

    bindBudgetModal: function () {
        const self = this;
        document.getElementById('btnAddBudget').onclick = function () {
            self.syncBudgetsFromDom();
            const act = self.doc.activities[self.editActIdx];
            act.budgets.push(MkppStore.blankBudget());
            self.openBudgetModal(self.editActIdx);
        };
        document.getElementById('btnOkBudget').onclick = function () {
            self.syncBudgetsFromDom();
            $('#modalBudget').modal('hide');
            self.render();
        };
        $(document).on('click', '.btn-bgt-del', function () {
            self.syncBudgetsFromDom();
            const i = parseInt(this.getAttribute('data-i'), 10);
            self.doc.activities[self.editActIdx].budgets.splice(i, 1);
            self.openBudgetModal(self.editActIdx);
        });
        $(document).on('click', '.btn-subbrand', function () {
            self.syncBudgetsFromDom();
            self.openSubbrandModal(parseInt(this.getAttribute('data-i'), 10));
        });
    },

    openSubbrandModal: function (bgtIdx) {
        this.editBgtIdx = bgtIdx;
        const bgt = this.doc.activities[this.editActIdx].budgets[bgtIdx];
        if (!bgt) return;
        const locked = this.isLocked();
        const rows = (bgt.subbrands || []).map((s, i) =>
            '<tr>' +
            '<td><input class="form-control input-sm sub-name" data-i="' + i + '" value="' + this.esc(s.subUmbrand) + '" ' + (locked ? 'disabled' : '') + '></td>' +
            '<td><input type="number" class="form-control input-sm sub-amt" data-i="' + i + '" value="' + (Number(s.amount) || 0) + '" ' + (locked ? 'disabled' : '') + '></td>' +
            '<td><input type="number" class="form-control input-sm sub-res" data-i="' + i + '" value="' + (Number(s.reserved) || 0) + '" ' + (locked ? 'disabled' : '') + '></td>' +
            '<td><input type="number" class="form-control input-sm sub-avl" data-i="' + i + '" value="' + (Number(s.available) || 0) + '" ' + (locked ? 'disabled' : '') + '></td>' +
            '<td>' + (locked ? '' : '<button type="button" class="btn btn-xs btn-danger btn-sub-del" data-i="' + i + '">Del</button>') + '</td>' +
            '</tr>'
        ).join('');
        document.getElementById('tblSubbrandBody').innerHTML = rows || '';
        document.getElementById('btnAddSubbrand').style.display = locked ? 'none' : '';
        document.getElementById('btnOkSubbrand').style.display = locked ? 'none' : '';
        $('#modalSubbrand').modal('show');
    },

    bindSubbrandModal: function () {
        const self = this;
        document.getElementById('btnAddSubbrand').onclick = function () {
            const bgt = self.doc.activities[self.editActIdx].budgets[self.editBgtIdx];
            bgt.subbrands = bgt.subbrands || [];
            // sync
            const names = document.querySelectorAll('#tblSubbrandBody .sub-name');
            const tmp = [];
            names.forEach((el, i) => {
                tmp.push({
                    id: MkppStore.uid('sub'),
                    subUmbrand: el.value,
                    amount: Number(document.querySelectorAll('#tblSubbrandBody .sub-amt')[i].value) || 0,
                    reserved: Number(document.querySelectorAll('#tblSubbrandBody .sub-res')[i].value) || 0,
                    available: Number(document.querySelectorAll('#tblSubbrandBody .sub-avl')[i].value) || 0
                });
            });
            bgt.subbrands = tmp;
            bgt.subbrands.push(MkppStore.blankSubbrand());
            self.openSubbrandModal(self.editBgtIdx);
        };
        document.getElementById('btnOkSubbrand').onclick = function () {
            const bgt = self.doc.activities[self.editActIdx].budgets[self.editBgtIdx];
            const names = document.querySelectorAll('#tblSubbrandBody .sub-name');
            bgt.subbrands = [];
            names.forEach((el, i) => {
                bgt.subbrands.push({
                    id: MkppStore.uid('sub'),
                    subUmbrand: el.value,
                    amount: Number(document.querySelectorAll('#tblSubbrandBody .sub-amt')[i].value) || 0,
                    reserved: Number(document.querySelectorAll('#tblSubbrandBody .sub-res')[i].value) || 0,
                    available: Number(document.querySelectorAll('#tblSubbrandBody .sub-avl')[i].value) || 0
                });
            });
            $('#modalSubbrand').modal('hide');
            self.openBudgetModal(self.editActIdx);
        };
        $(document).on('click', '.btn-sub-del', function () {
            const i = parseInt(this.getAttribute('data-i'), 10);
            const bgt = self.doc.activities[self.editActIdx].budgets[self.editBgtIdx];
            const names = document.querySelectorAll('#tblSubbrandBody .sub-name');
            const tmp = [];
            names.forEach((el, idx) => {
                tmp.push({
                    id: MkppStore.uid('sub'),
                    subUmbrand: el.value,
                    amount: Number(document.querySelectorAll('#tblSubbrandBody .sub-amt')[idx].value) || 0,
                    reserved: Number(document.querySelectorAll('#tblSubbrandBody .sub-res')[idx].value) || 0,
                    available: Number(document.querySelectorAll('#tblSubbrandBody .sub-avl')[idx].value) || 0
                });
            });
            bgt.subbrands = tmp;
            bgt.subbrands.splice(i, 1);
            self.openSubbrandModal(self.editBgtIdx);
        });
    },

    openAttachmentModal: function (actIdx) {
        this.editActIdx = actIdx;
        const act = this.doc.activities[actIdx];
        const list = document.getElementById('lstActAttachments');
        list.innerHTML = (act.attachments || []).map((f, i) =>
            '<li>' + this.esc(f.name) + ' <button type="button" class="btn btn-xs btn-danger btn-att-del" data-i="' + i + '">x</button></li>'
        ).join('') || '<li class="text-muted">Belum ada attachment</li>';
        $('#modalActAttachment').modal('show');
    },

    bindAttachmentModal: function () {
        const self = this;
        document.getElementById('btnAddActAttachment').onclick = function () {
            const input = document.getElementById('fileActAttachment');
            const act = self.doc.activities[self.editActIdx];
            if (!act) return;
            act.attachments = act.attachments || [];
            if (input.files && input.files.length) {
                Array.from(input.files).forEach(f => {
                    act.attachments.push({ name: f.name, size: f.size, at: new Date().toISOString() });
                });
                input.value = '';
            } else {
                KicaoLayout.toast('Pilih file terlebih dahulu.', 'Attachment');
                return;
            }
            self.openAttachmentModal(self.editActIdx);
            self.render();
        };
        $(document).on('click', '.btn-att-del', function () {
            const i = parseInt(this.getAttribute('data-i'), 10);
            const act = self.doc.activities[self.editActIdx];
            act.attachments.splice(i, 1);
            self.openAttachmentModal(self.editActIdx);
            self.render();
        });
    },

    init: function () {
        const self = this;
        document.getElementById('btnAddActivity').onclick = function () { self.addRow(); };
        this.bindSupplierModal();
        this.bindBudgetModal();
        this.bindSubbrandModal();
        this.bindAttachmentModal();
    }
};

window.MkppActivity = MkppActivity;

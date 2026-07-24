/**
 * MKPP form orchestrator — toolbar, status, LOV, attachments
 */
const MkppPrototype = {
    current: null,

    readHeader: function () {
        const base = this.current || MkppStore.createNew();
        MkppActivity.syncFromDom();
        return MkppStore.normalizeDoc(Object.assign({}, base, {
            id: document.getElementById('txtHiddenId').value || base.id,
            docNo: document.getElementById('txtDocNo').value,
            date: document.getElementById('dtmDate').value,
            refDocNo: document.getElementById('txtRefDocNo').value,
            status: document.getElementById('lblStatusFlow').textContent || MkppStore.STATUS.DRAFT,
            groupAccount: document.getElementById('txtGroupAccount').value,
            onoDocNo: document.getElementById('txtDocNoONO').value,
            budgetType: document.getElementById('txtBudgetType').value,
            postingDate: document.getElementById('txtdtPostingDate').value,
            programDesc: document.getElementById('txtProgramDesc').value,
            mekanisme: document.getElementById('txtMekanisme').value,
            remark: document.getElementById('txtRemark').value,
            activities: (MkppActivity.getDoc() && MkppActivity.getDoc().activities) || base.activities || [],
            attachments: base.attachments || [],
            bosnet: base.bosnet,
            bosnetPush: base.bosnetPush,
            bosnetStatus: base.bosnetStatus,
            bosnetNote: base.bosnetNote,
            bosnetLog: base.bosnetLog || []
        }));
    },

    fillForm: function (doc) {
        this.current = MkppStore.normalizeDoc(doc);
        document.getElementById('txtHiddenId').value = this.current.id || '';
        document.getElementById('txtDocNo').value = this.current.docNo || '';
        document.getElementById('dtmDate').value = this.current.date || '';
        document.getElementById('txtRefDocNo').value = this.current.refDocNo || '';
        const st = document.getElementById('lblStatusFlow');
        st.textContent = this.current.status || MkppStore.STATUS.DRAFT;
        st.className = 'control-label status-' + String(this.current.status || '').toLowerCase().replace(/\s+/g, '-');
        document.getElementById('txtGroupAccount').value = this.current.groupAccount || '';
        document.getElementById('txtDocNoONO').value = this.current.onoDocNo || '';
        document.getElementById('txtBudgetType').value = this.current.budgetType || 'DF — Development Fund';
        document.getElementById('txtdtPostingDate').value = this.current.postingDate || '';
        document.getElementById('txtProgramDesc').value = this.current.programDesc || '';
        document.getElementById('txtMekanisme').value = this.current.mekanisme || '';
        document.getElementById('txtRemark').value = this.current.remark || '';
        document.getElementById('lblBosnetStatus').textContent = this.current.bosnetStatus || '—';
        document.getElementById('lblBosnetNote').textContent = this.current.bosnetNote || '';
        MkppActivity.setDoc(this.current);
        this.applyEnableState();
    },

    applyEnableState: function () {
        const s = (this.current && this.current.status) || MkppStore.STATUS.DRAFT;
        const draftLike = s === MkppStore.STATUS.DRAFT || s === MkppStore.STATUS.REJECTED;
        const waiting = s === MkppStore.STATUS.WAITING_APPROVAL;
        const approved = s === MkppStore.STATUS.APPROVED;
        const waitingClose = s === MkppStore.STATUS.WAITING_TO_CLOSE;
        const closed = s === MkppStore.STATUS.CLOSED || s === MkppStore.STATUS.CANCELLED;

        const setShow = (id, show) => {
            const el = document.getElementById(id);
            if (el) el.style.display = show ? '' : 'none';
        };
        setShow('btnSave', draftLike);
        setShow('btnSubmit', draftLike);
        setShow('btnUpdate', draftLike || approved);
        setShow('btnApprove', waiting);
        setShow('btnReject', waiting);
        setShow('btnClose', approved || waitingClose);
        setShow('btnCancel', draftLike || approved);
        setShow('btnAddActivity', draftLike);
        setShow('btnUpdateAttachment', !closed);
        setShow('btnBosnetRetry', waitingClose);

        const disableHdr = !draftLike;
        ['txtRefDocNo', 'txtGroupAccount', 'txtDocNoONO', 'txtBudgetType', 'txtdtPostingDate',
            'txtProgramDesc', 'txtMekanisme', 'txtRemark',
            'btnLOVGroupAccount', 'btnLOVBudgetType', 'btnLOVRefDocNo'].forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            if (el.tagName === 'BUTTON') el.disabled = disableHdr;
            else el.readOnly = disableHdr;
            if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') el.disabled = disableHdr;
        });
        if (approved) {
            const post = document.getElementById('txtdtPostingDate');
            if (post) { post.disabled = false; post.readOnly = false; }
            ['txtProgramDesc', 'txtMekanisme', 'txtRemark'].forEach(id => {
                const el = document.getElementById(id);
                if (el) { el.disabled = false; el.readOnly = false; }
            });
        }
    },

    persistCurrent: function (opts) {
        const doc = this.readHeader();
        const res = MkppStore.save(doc, opts);
        if (res.ok) this.fillForm(res.doc);
        return res;
    },

    init: function () {
        const self = this;
        MkppActivity.init();
        this.fillForm(MkppStore.get('seed-1') || MkppStore.createNew());

        document.getElementById('btnNew').onclick = function () {
            self.fillForm(MkppStore.createNew());
            KicaoLayout.toast('Form baru siap diisi.', 'New');
        };

        document.getElementById('btnSave').onclick = function () {
            const res = self.persistCurrent({ strict: true });
            if (!res.ok) { KicaoLayout.toast(res.message, 'Validasi'); return; }
            KicaoLayout.toast('Dokumen disimpan (localStorage).', 'Save');
        };

        document.getElementById('btnUpdate').onclick = function () {
            const doc = self.readHeader();
            if (doc.onoDocNo) {
                KicaoLayout.toast('MKPP dari ONO tidak dapat diperbarui periodnya (mock rule KDS).', 'Update Info');
                return;
            }
            const res = MkppStore.save(doc, { strict: false });
            if (!res.ok) { KicaoLayout.toast(res.message, 'Validasi'); return; }
            self.fillForm(res.doc);
            KicaoLayout.toast('Info diperbarui.', 'Update Info');
        };

        document.getElementById('btnSubmit').onclick = function () {
            const doc = self.readHeader();
            const err = MkppStore.validate(doc, { strict: true });
            if (err) { KicaoLayout.toast(err, 'Validasi'); return; }
            doc.status = MkppStore.STATUS.WAITING_APPROVAL;
            const open = MkppBosnet.pushOpen(doc);
            const res = MkppStore.upsert(doc);
            self.fillForm(res);
            KicaoLayout.toast(
                'Submitted → Waiting Approval. BOSNET Open: ' + (open.ok ? 'OK' : 'FAILED') + '.',
                'Submit'
            );
        };

        document.getElementById('btnApprove').onclick = function () {
            const doc = self.readHeader();
            doc.status = MkppStore.STATUS.APPROVED;
            self.fillForm(MkppStore.upsert(doc));
            KicaoLayout.toast('Dokumen Approved (mock tanpa K2).', 'Approve');
        };

        document.getElementById('btnReject').onclick = function () {
            const doc = self.readHeader();
            doc.status = MkppStore.STATUS.REJECTED;
            self.fillForm(MkppStore.upsert(doc));
            KicaoLayout.toast('Dokumen Rejected.', 'Reject');
        };

        document.getElementById('btnClose').onclick = function () {
            const doc = self.readHeader();
            const res = MkppBosnet.closeDocument(doc);
            self.fillForm(MkppStore.upsert(res.doc));
            KicaoLayout.toast(res.message + ' · Status: ' + res.doc.status, 'Close');
        };

        document.getElementById('btnCancel').onclick = function () {
            const doc = self.readHeader();
            doc.status = MkppStore.STATUS.CANCELLED;
            self.fillForm(MkppStore.upsert(doc));
            KicaoLayout.toast('Dokumen Cancelled.', 'Cancel');
        };

        document.getElementById('btnPrintout').onclick = function () {
            MkppPrint.open(self.readHeader());
        };

        document.getElementById('btnFind').onclick = function () {
            MkppLov.openFindMkpp(function (doc) {
                if (doc) self.fillForm(doc);
            });
        };

        document.getElementById('btnLOVGroupAccount').onclick = function () {
            MkppLov.openGroupAccount(function (name) {
                document.getElementById('txtGroupAccount').value = name || '';
            });
        };

        document.getElementById('btnLOVBudgetType').onclick = function () {
            MkppLov.openBudgetType(function (name) {
                document.getElementById('txtBudgetType').value = name || 'DF — Development Fund';
            });
        };

        document.getElementById('btnLOVRefDocNo').onclick = function () {
            MkppLov.openParentMkpp(function (docNo) {
                document.getElementById('txtRefDocNo').value = docNo || '';
            });
        };

        document.getElementById('btnBosnetOpen').onclick = function () {
            const doc = self.readHeader();
            const res = MkppBosnet.pushOpen(doc);
            self.fillForm(MkppStore.upsert(res.doc));
            KicaoLayout.toast(res.message, 'BOSNET Open');
        };

        document.getElementById('btnBosnetRetry').onclick = function () {
            const doc = self.readHeader();
            const res = MkppBosnet.closeDocument(doc);
            self.fillForm(MkppStore.upsert(res.doc));
            KicaoLayout.toast(res.message + ' · ' + res.doc.status, 'BOSNET Retry Close');
        };

        document.getElementById('btnUpdateAttachment').onclick = function () {
            self.openHdrAttachment();
        };

        document.getElementById('btnAddHdrAttachment').onclick = function () {
            const input = document.getElementById('fileHdrAttachment');
            const doc = self.readHeader();
            doc.attachments = doc.attachments || [];
            if (input.files && input.files.length) {
                Array.from(input.files).forEach(f => {
                    doc.attachments.push({ name: f.name, size: f.size, at: new Date().toISOString() });
                });
                input.value = '';
                self.current = MkppStore.upsert(doc);
                self.renderHdrAttachments();
                KicaoLayout.toast('Attachment header diperbarui (metadata).', 'Attachment');
            } else {
                KicaoLayout.toast('Pilih file terlebih dahulu.', 'Attachment');
            }
        };
    },

    openHdrAttachment: function () {
        this.renderHdrAttachments();
        $('#modalHdrAttachment').modal('show');
    },

    renderHdrAttachments: function () {
        const doc = this.current || this.readHeader();
        const list = document.getElementById('lstHdrAttachments');
        list.innerHTML = (doc.attachments || []).map(f =>
            '<li>' + String(f.name).replace(/</g, '&lt;') + '</li>'
        ).join('') || '<li class="text-muted">Kosong</li>';
    }
};

window.MkppPrototype = MkppPrototype;

/**
 * Memo QP — Index + Create (1 Parent = 1 memo) + View
 */
"use strict";

var MemoQpPage = {
    listTable: null,
    parents: [],
    selectedParent: null,
    /** pending pick inside modal (before confirm) */
    pendingParentId: null,
    parentModal: null,
    plafon: null,
    headerCompact: false,
    allMemoRows: [],

    init: async function () {
        if (typeof DfDataTable !== "undefined") {
            await DfDataTable.ensureAssets();
        }
        if (!sessionStorage.getItem("df_memo_cleansed_v2")) {
            MemoQpStore.clearAll();
            sessionStorage.setItem("df_memo_cleansed_v2", "1");
        }
        var modalEl = document.getElementById("modalPickParent");
        if (modalEl && typeof bootstrap !== "undefined" && bootstrap.Modal) {
            this.parentModal = bootstrap.Modal.getOrCreateInstance(modalEl);
        }
        this.bindEvents();
        this.showPanel("index");
        this.refreshList();
    },

    bindEvents: function () {
        var self = this;
        $("#btnAddMemo").on("click", function () { self.openCreate(); });
        $("#btnBackIndex, #btnBackFromView, #btnCancelCreate, #btnCancelCreateSticky").on("click", function () {
            self.showPanel("index");
            self.refreshList();
        });

        $("#fldNamaMemo, #fldDescMemo, #fldPeriodeAwal, #fldPeriodeAkhir").on("input change", function () {
            self.onPeriodeChange();
            self.updateSaveState();
        });
        $("#fldBudgetMemo").on("input", function () {
            var formatted = MemoQpStore.formatCurrencyInput(this.value);
            if (this.value !== formatted) this.value = formatted;
            self.updateSaveState();
        });

        $("#btnSaveMemo, #btnSaveMemoSticky").on("click", function () { self.saveCreate(); });

        $("#btnOpenParentModal").on("click", function () { self.openParentModal(); });
        $("#btnClearParent").on("click", function () { self.clearParent(); });
        $("#btnConfirmParent").on("click", function () { self.confirmParentPick(); });
        $("#filterParentSearch").on("input", function () { self.applyParentFilters(); });

        $("#btnToggleHeader").on("click", function () {
            self.headerCompact = !self.headerCompact;
            $("#memoHeaderCard").toggleClass("is-compact", self.headerCompact);
            self.syncHeaderToggleIcon();
        });

        $("#filterMemoSearch").on("input", function () { self.applyMemoListFilter(); });

        $(document).on("change", ".chk-memo-parent", function () {
            self.markPendingParent(this.getAttribute("data-id"));
        });

        $(document).on("click", "#tblMemoParentsBody tr[data-parent-id]", function (e) {
            if ($(e.target).is("input")) return;
            self.markPendingParent(this.getAttribute("data-parent-id"));
        });

        $(document).on("dblclick", "#tblMemoParentsBody tr[data-parent-id]", function () {
            self.markPendingParent(this.getAttribute("data-parent-id"));
            self.confirmParentPick();
        });

        $(document).on("click", ".btn-view-memo", function () {
            self.openView($(this).data("id"));
        });
    },

    showPanel: function (name) {
        $("#PanelIndex").toggleClass("d-none", name !== "index");
        $("#PanelCreate").toggleClass("d-none", name !== "create");
        $("#PanelView").toggleClass("d-none", name !== "view");
        $("#memoSelectedSticky").toggleClass("d-none", name !== "create");
    },

    syncHeaderToggleIcon: function () {
        var $btn = $("#btnToggleHeader");
        var $icon = $("#iconToggleHeader");
        if (this.headerCompact) {
            $icon.removeClass("fa-chevron-up").addClass("fa-chevron-down");
            $btn.attr({ title: "Perluas", "aria-label": "Perluas header" });
        } else {
            $icon.removeClass("fa-chevron-down").addClass("fa-chevron-up");
            $btn.attr({ title: "Ciutkan", "aria-label": "Ciutkan header" });
        }
    },

    applyPeriodeConstraints: function () {
        var bounds = MemoQpStore.yearBoundsWib();
        var $awal = $("#fldPeriodeAwal");
        var $akhir = $("#fldPeriodeAkhir");
        $awal.attr({ min: bounds.min, max: bounds.max });
        $akhir.attr({ min: bounds.min, max: bounds.max });

        var awal = ($awal.val() || "").trim();
        if (awal) {
            // akhir minimal = max(awal, today)
            var akhirMin = awal > bounds.min ? awal : bounds.min;
            $akhir.attr("min", akhirMin);
            var akhir = ($akhir.val() || "").trim();
            if (akhir && akhir < akhirMin) $akhir.val(akhirMin);
        }
    },

    onPeriodeChange: function () {
        this.applyPeriodeConstraints();
        var awal = ($("#fldPeriodeAwal").val() || "").trim();
        var akhir = ($("#fldPeriodeAkhir").val() || "").trim();
        var check = MemoQpStore.validatePeriode(awal, akhir);
        var $hint = $("#periodeHint");
        if (!awal && !akhir) {
            $hint.text("Periode: tidak boleh backdate, hanya tahun berjalan (" +
                MemoQpStore.currentYearWib() + ").")
                .removeClass("text-danger text-success");
            return;
        }
        if (!check.ok) {
            $hint.text(check.message).addClass("text-danger").removeClass("text-success");
        } else {
            $hint.text("Periode OK: " + MemoQpStore.formatPeriodeRange(awal, akhir) + ".")
                .addClass("text-success").removeClass("text-danger");
        }
    },

    refreshList: function () {
        this.allMemoRows = MemoQpStore.load();
        this.renderMemoTable(this.allMemoRows);
        $("#memoCountLabel").text(this.allMemoRows.length + " memo");
        $("#filterMemoSearch").val("");
    },

    renderMemoTable: function (rows) {
        var self = this;
        var data = (rows || []).map(function (m) {
            return [
                '<button type="button" class="btn btn-sm btn-outline-primary btn-view-memo" data-id="' +
                    self.esc(m.id) + '"><i class="fas fa-eye"></i></button>',
                '<code>' + self.esc(m.nomorMemo) + "</code>",
                self.esc(m.namaMemo),
                self.esc(MemoQpStore.formatPeriodeRange(m.tanggalPeriodeAwal, m.tanggalPeriodeAkhir)),
                MemoQpStore.formatRp(m.budgetMemo || 0),
                self.esc(m.kodeKmmd),
                self.esc(m.namaKmmd),
                self.esc(m.namaGroup || "—"),
                m.createdAt ? new Date(m.createdAt).toLocaleString("id-ID") : "—"
            ];
        });

        this.listTable = DfDataTable.init("#tblMemoQp", {
            data: data,
            columns: [
                { orderable: false, searchable: false, className: "text-center", width: "48px" },
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true, className: "text-end" },
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true }
            ],
            order: [[8, "desc"]],
            language: Object.assign({}, DfDataTable.language, {
                emptyTable: "Belum ada memo. Klik Add untuk alokasi budget ke 1 Parent."
            })
        });
    },

    applyMemoListFilter: function () {
        var q = (($("#filterMemoSearch").val() || "") + "").trim().toLowerCase();
        if (!q) {
            this.renderMemoTable(this.allMemoRows);
            $("#memoCountLabel").text(this.allMemoRows.length + " memo");
            return;
        }
        var self = this;
        var filtered = this.allMemoRows.filter(function (m) {
            var blob = [
                m.nomorMemo, m.namaMemo, m.kodeKmmd, m.namaKmmd, m.namaGroup,
                m.tanggalPeriodeAwal, m.tanggalPeriodeAkhir,
                MemoQpStore.formatPeriodeRange(m.tanggalPeriodeAwal, m.tanggalPeriodeAkhir)
            ].join(" ").toLowerCase();
            return blob.indexOf(q) >= 0;
        });
        this.renderMemoTable(filtered);
        $("#memoCountLabel").text(filtered.length + " / " + this.allMemoRows.length + " memo");
    },

    openCreate: function () {
        $("#fldNamaMemo").val("");
        $("#fldDescMemo").val("");
        var today = MemoQpStore.todayWib();
        $("#fldPeriodeAwal").val(today);
        $("#fldPeriodeAkhir").val(today);
        this.applyPeriodeConstraints();
        this.onPeriodeChange();
        $("#fldBudgetMemo").val("").prop("disabled", true);
        $("#filterParentSearch").val("");
        this.setSelectedParentUi(null);
        this.headerCompact = false;
        $("#memoHeaderCard").removeClass("is-compact");
        this.syncHeaderToggleIcon();
        this.selectedParent = null;
        this.pendingParentId = null;
        this.parents = MemoQpStore.listParents();
        this.refreshPlafonUi();
        this.showPanel("create");
        this.updateSaveState();
    },

    refreshPlafonUi: function () {
        var p = MemoQpStore.getPlafonStatus();
        this.plafon = p;
        if (!p) {
            $("#biBudgetAmount, #biBudgetUsed, #biBudgetAvailable, #biBudgetLabel, #pillBiKode").text("—");
            return;
        }
        $("#biBudgetAmount").text(MemoQpStore.formatRp(p.grossAmount));
        $("#biBudgetUsed").text(MemoQpStore.formatRp(p.usedAmount));
        $("#biBudgetAvailable").text(MemoQpStore.formatRp(p.availableAmount));
        $("#biBudgetAvailable").toggleClass("text-danger", p.availableAmount <= 0)
            .toggleClass("text-success", p.availableAmount > 0);
        $("#biBudgetLabel").text(p.kode + " · s.d. " + p.asOf);
        $("#pillBiKode").text(p.kode);
    },

    setSelectedParentUi: function (p) {
        if (!p) {
            $("#selectedParentLabel").text("— belum dipilih —");
            $("#btnClearParent").prop("disabled", true);
            return;
        }
        $("#selectedParentLabel").html(
            "<code>" + this.esc(p.kodeKmmd) + "</code> · " + this.esc(p.namaKmmd)
        );
        $("#btnClearParent").prop("disabled", false);
    },

    clearParent: function () {
        this.selectedParent = null;
        this.pendingParentId = null;
        this.setSelectedParentUi(null);
        $("#fldBudgetMemo").val("").prop("disabled", true);
        this.updateSaveState();
    },

    openParentModal: function () {
        this.parents = MemoQpStore.listParents();
        this.pendingParentId = this.selectedParent ? this.selectedParent.id : null;
        this.renderParentTable();
        $("#filterParentSearch").val("");
        this.applyParentFilters();
        $("#btnConfirmParent").prop("disabled", !this.pendingParentId);

        var el = document.getElementById("modalPickParent");
        if (!el) {
            MappingSubdistStore.toast("error", "Modal pilih Parent tidak ditemukan");
            return;
        }
        if (typeof bootstrap !== "undefined" && bootstrap.Modal) {
            this.parentModal = bootstrap.Modal.getOrCreateInstance(el);
            this.parentModal.show();
        } else if (window.jQuery && $(el).modal) {
            $(el).modal("show");
        } else {
            el.classList.add("show");
            el.style.display = "block";
            el.removeAttribute("aria-hidden");
        }
        setTimeout(function () { $("#filterParentSearch").trigger("focus"); }, 300);
    },

    markPendingParent: function (id) {
        this.pendingParentId = id;
        $(".chk-memo-parent").each(function () {
            this.checked = this.getAttribute("data-id") === id;
            $(this).closest("tr").toggleClass("is-selected", this.checked);
        });
        $("#btnConfirmParent").prop("disabled", !id);
    },

    confirmParentPick: function () {
        if (!this.pendingParentId) return;
        var p = this.parents.find(function (x) {
            return x.id === MemoQpPage.pendingParentId;
        });
        if (!p) return;
        this.selectedParent = p;
        this.setSelectedParentUi(p);
        $("#fldBudgetMemo").prop("disabled", false);
        if (this.parentModal) this.parentModal.hide();
        else $("#modalPickParent").modal("hide");
        this.updateSaveState();
        setTimeout(function () { $("#fldBudgetMemo").trigger("focus"); }, 200);
    },

    openView: function (id) {
        var m = MemoQpStore.getById(id);
        if (!m) {
            MappingSubdistStore.toast("warning", "Memo tidak ditemukan");
            return;
        }
        $("#viewNomor").text(m.nomorMemo);
        $("#viewNama").text(m.namaMemo || "—");
        $("#viewPeriode").text(
            MemoQpStore.formatPeriodeRange(m.tanggalPeriodeAwal, m.tanggalPeriodeAkhir)
        );
        $("#viewDesc").text(m.description || "—");
        var biTxt = (m.biBudgetKode || "—") +
            (m.biBudgetNama ? (" · " + m.biBudgetNama) : "");
        $("#viewBiBudget").text(biTxt);
        $("#viewBiAmount").text(
            m.biBudgetAmount ? MemoQpStore.formatRp(m.biBudgetAmount) : "—"
        );
        $("#viewBudgetMemo").text(MemoQpStore.formatRp(m.budgetMemo || 0));
        $("#viewKode").text(m.kodeKmmd || "—");
        $("#viewNamaKmmd").text(m.namaKmmd || "—");
        $("#viewGroup").text(m.namaGroup || "—");
        $("#viewShipTo").text(m.shipToSiteUseId || "—");
        $("#viewCreated").text(m.createdAt ? new Date(m.createdAt).toLocaleString("id-ID") : "—");
        this.showPanel("view");
    },

    renderParentTable: function () {
        var self = this;
        if (!this.parents.length) {
            $("#tblMemoParentsBody").html(
                '<tr><td colspan="5" class="text-center text-muted py-4">Belum ada Parent di Mapping Subdist.</td></tr>'
            );
            $("#parentVisibleLabel").text("0 parent");
            return;
        }
        var html = "";
        this.parents.forEach(function (p) {
            var checked = self.pendingParentId === p.id ? " checked" : "";
            var sel = self.pendingParentId === p.id ? " is-selected" : "";
            html +=
                '<tr class="' + sel.trim() + '" data-parent-id="' + self.esc(p.id) + '" ' +
                'data-search="' + self.esc(
                    [p.kodeKmmd, p.namaKmmd, p.namaGroup, p.region].join(" ").toLowerCase()
                ) + '">' +
                '<td class="text-center">' +
                '<input type="radio" name="memoParentPick" class="form-check-input chk-memo-parent" data-id="' +
                self.esc(p.id) + '"' + checked + ">" +
                "</td>" +
                "<td><code>" + self.esc(p.kodeKmmd) + "</code></td>" +
                "<td>" + self.esc(p.namaKmmd) + "</td>" +
                "<td>" + self.esc(p.namaGroup || "—") + "</td>" +
                "<td>" + self.esc(p.region || "—") + "</td>" +
                "</tr>";
        });
        $("#tblMemoParentsBody").html(html);
        this.applyParentFilters();
    },

    applyParentFilters: function () {
        var q = (($("#filterParentSearch").val() || "") + "").trim().toLowerCase();
        var visible = 0;
        $("#tblMemoParentsBody tr[data-parent-id]").each(function () {
            var ok = !q || (this.getAttribute("data-search") || "").indexOf(q) >= 0;
            $(this).toggle(ok);
            if (ok) visible++;
        });
        $("#parentVisibleLabel").text(visible + " tampil");
    },

    currentBudget: function () {
        return MemoQpStore.parseCurrency($("#fldBudgetMemo").val());
    },

    updateSaveState: function () {
        var nama = ($("#fldNamaMemo").val() || "").trim();
        var awal = ($("#fldPeriodeAwal").val() || "").trim();
        var akhir = ($("#fldPeriodeAkhir").val() || "").trim();
        var periodOk = MemoQpStore.validatePeriode(awal, akhir).ok;
        var parentOk = !!this.selectedParent;
        var avail = this.plafon ? Number(this.plafon.availableAmount) || 0 : 0;
        var budget = this.currentBudget();
        var budgetOk = !isNaN(budget) && budget > 0 && budget <= avail;

        if (!parentOk) {
            $("#budgetHint").text("Pilih Parent lewat tombol Pilih, lalu isi budget ≤ sisa plafon.");
            $("#budgetHint").removeClass("text-danger text-success");
        } else if (avail <= 0) {
            $("#budgetHint").text("Sisa plafon habis — tidak bisa menambah memo.").addClass("text-danger");
        } else if (isNaN(budget) || budget <= 0) {
            $("#budgetHint").text("Isi budget > 0, maksimal " + MemoQpStore.formatRp(avail) + ".")
                .removeClass("text-danger text-success");
        } else if (budget > avail) {
            $("#budgetHint").text("Melebihi sisa plafon " + MemoQpStore.formatRp(avail) + ".")
                .addClass("text-danger").removeClass("text-success");
        } else {
            $("#budgetHint").text("OK — sisa setelah simpan: " +
                MemoQpStore.formatRp(avail - budget) + ".")
                .addClass("text-success").removeClass("text-danger");
        }

        var ok = nama && periodOk && parentOk && budgetOk && avail > 0;
        $("#btnSaveMemoSticky, #btnSaveMemo").prop("disabled", !ok);

        var sticky = "Periode " +
            (awal || akhir ? MemoQpStore.formatPeriodeRange(awal, akhir) : "—") +
            " · sisa " + (this.plafon ? MemoQpStore.formatRp(this.plafon.availableAmount) : "—");
        if (this.selectedParent) sticky = this.selectedParent.kodeKmmd + " · " + sticky;
        $("#stickyHint").text(sticky);
    },

    saveCreate: async function () {
        var nama = ($("#fldNamaMemo").val() || "").trim();
        var desc = ($("#fldDescMemo").val() || "").trim();
        var awal = ($("#fldPeriodeAwal").val() || "").trim();
        var akhir = ($("#fldPeriodeAkhir").val() || "").trim();
        this.refreshPlafonUi();
        var plafon = this.plafon;

        if (!nama) {
            MappingSubdistStore.toast("warning", "Nama Memo wajib diisi");
            return;
        }
        var periodCheck = MemoQpStore.validatePeriode(awal, akhir);
        if (!periodCheck.ok) {
            MappingSubdistStore.toast("warning", periodCheck.message);
            return;
        }
        if (!this.selectedParent) {
            MappingSubdistStore.toast("warning", "Pilih 1 Parent");
            return;
        }
        if (!plafon || !(plafon.availableAmount > 0)) {
            MappingSubdistStore.toast("warning", "Sisa plafon habis / belum tersedia");
            return;
        }
        var budget = this.currentBudget();
        if (isNaN(budget) || budget <= 0) {
            MappingSubdistStore.toast("warning", "Budget harus > 0");
            return;
        }
        if (budget > plafon.availableAmount) {
            MappingSubdistStore.toast("warning", "Budget melebihi sisa plafon");
            return;
        }

        var self = this;
        await MappingSubdistStore.ensureSwal();
        var confirmed = false;
        if (typeof Swal !== "undefined") {
            var result = await Swal.fire({
                icon: "question",
                title: "Simpan Memo QP?",
                html:
                    "<div class=\"text-start small\">" +
                    "<p class=\"mb-1\">Nama: <strong>" + self.esc(nama) + "</strong></p>" +
                    "<p class=\"mb-1\">Periode: <strong>" +
                    self.esc(MemoQpStore.formatPeriodeRange(awal, akhir)) + "</strong></p>" +
                    "<p class=\"mb-1\">Parent: <strong>" + self.esc(self.selectedParent.kodeKmmd) +
                    " — " + self.esc(self.selectedParent.namaKmmd) + "</strong></p>" +
                    "<p class=\"mb-1\">Budget: <strong>" + MemoQpStore.formatRp(budget) + "</strong></p>" +
                    "<p class=\"mb-0\">Sisa plafon setelah simpan: <strong>" +
                    MemoQpStore.formatRp(plafon.availableAmount - budget) + "</strong></p>" +
                    "</div>",
                showCancelButton: true,
                confirmButtonText: "Ya, Simpan",
                cancelButtonText: "Batal",
                customClass: {
                    confirmButton: "btn btn-primary",
                    cancelButton: "btn btn-outline-secondary"
                },
                buttonsStyling: false
            });
            confirmed = !!(result && result.isConfirmed);
        } else {
            confirmed = window.confirm("Simpan memo untuk " + this.selectedParent.kodeKmmd + "?");
        }
        if (!confirmed) return;

        try {
            var created = MemoQpStore.createOne(
                {
                    namaMemo: nama,
                    description: desc,
                    tanggalPeriodeAwal: awal,
                    tanggalPeriodeAkhir: akhir,
                    biBudget: plafon
                },
                Object.assign({}, this.selectedParent, { budgetMemo: budget })
            );
            MappingSubdistStore.toast("success", "Memo " + created.nomorMemo + " dibuat");
            this.showPanel("index");
            this.refreshList();
        } catch (err) {
            MappingSubdistStore.toast("error", (err && err.message) || "Gagal simpan");
            this.refreshPlafonUi();
            this.updateSaveState();
        }
    },

    esc: function (s) {
        if (typeof MappingSubdistStore !== "undefined" && MappingSubdistStore.esc) {
            return MappingSubdistStore.esc(s);
        }
        return String(s == null ? "" : s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }
};

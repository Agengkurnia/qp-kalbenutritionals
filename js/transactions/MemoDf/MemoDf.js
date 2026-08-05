/**
 * Memo DF — Index + Create (split pane) + View
 */
"use strict";

var MemoDfPage = {
    listTable: null,
    groups: [],
    selected: {},
    expandedKey: null,
    headerCompact: false,
    _loadTimer: null,
    allMemoRows: [],

    init: async function () {
        if (typeof DfDataTable !== "undefined") {
            await DfDataTable.ensureAssets();
        }
        if (!sessionStorage.getItem("df_memo_cleansed_once")) {
            MemoDfStore.clearAll();
            sessionStorage.setItem("df_memo_cleansed_once", "1");
        }
        this.bindEvents();
        this.showPanel("index");
        this.refreshList();
    },

    bindEvents: function () {
        var self = this;
        $("#btnAddMemo").on("click", function () { self.openCreate(); });
        $("#btnBackIndex, #btnBackFromView, #btnCancelCreate").on("click", function () {
            self.showPanel("index");
            self.refreshList();
        });

        $("#fldNamaMemo, #fldBudgetMemo, #fldDescMemo").on("input", function () {
            if (this.id === "fldBudgetMemo") {
                self.formatBudgetInput(this);
                self.onHeaderBudgetChange();
            }
            self.updateSaveEnabled();
            self.updatePills();
        });
        $("#fldBudgetMemo").on("blur", function () {
            self.formatBudgetInput(this);
        });

        $("#btnSaveMemo, #btnSaveMemoSticky").on("click", function () { self.saveCreate(); });
        $("#filterGroupSearch").on("input", function () { self.applyGroupFilters(); });
        $("#chkShowIneligible").on("change", function () { self.applyGroupFilters(); });
        $("#btnClearSelected").on("click", function () {
            self.selected = {};
            self.applyBudgetRules();
        });
        $("#btnToggleHeader").on("click", function () {
            self.headerCompact = !self.headerCompact;
            $("#memoHeaderCard").toggleClass("is-compact", self.headerCompact);
            self.syncHeaderToggleIcon();
        });
        $("#btnCloseDetail").on("click", function () {
            self.expandedKey = null;
            self.renderDetailEmpty();
            self.applyBudgetRules();
        });
        $("#btnClearGroup").on("click", function () { self.clearExpandedGroup(); });
        $("#btnPickQuota").on("click", function () { self.pickQuotaInExpanded(); });

        $("#filterMemoSearch").on("input", function () { self.applyMemoListFilter(); });

        $(document).on("click", "#tblMemoGroupsBody tr.memo-group-row", function (e) {
            if ($(e.target).closest("button, a, input").length) return;
            self.toggleGroup(this.getAttribute("data-group-key"));
        });

        $(document).on("change", ".chk-memo-subdist", function () {
            self.onMemberToggle(this);
        });

        $(document).on("click", ".memo-chip", function (e) {
            if ($(e.target).closest(".btn-chip-remove").length) return;
            var id = this.getAttribute("data-id");
            var g = self.findGroupForMember(id);
            if (g) self.toggleGroup(g.key, true);
        });

        $(document).on("click", ".btn-chip-remove", function (e) {
            e.preventDefault();
            e.stopPropagation();
            delete self.selected[this.getAttribute("data-id")];
            self.applyBudgetRules();
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

    refreshList: function () {
        this.allMemoRows = MemoDfStore.load();
        this.renderMemoTable(this.allMemoRows);
        $("#memoCountLabel").text(this.allMemoRows.length + " memo");
        $("#filterMemoSearch").val("");
    },

    renderMemoTable: function (rows) {
        var data = (rows || []).map(function (m) {
            return [
                '<button type="button" class="btn btn-sm btn-outline-primary btn-view-memo" data-id="' +
                    MemoDfPage.esc(m.id) + '"><i class="fas fa-eye"></i></button>',
                '<code>' + MemoDfPage.esc(m.nomorMemo) + "</code>",
                MemoDfPage.esc(m.namaMemo),
                MemoDfPage.esc(m.kodeKmmd),
                MemoDfPage.esc(m.namaKmmd),
                MemoDfPage.esc(m.namaGroup || "—"),
                MemoDfStore.formatRp(m.budgetMemo),
                m.createdAt ? new Date(m.createdAt).toLocaleString("id-ID") : "—"
            ];
        });

        this.listTable = DfDataTable.init("#tblMemoDf", {
            data: data,
            columns: [
                { orderable: false, searchable: false, className: "text-center", width: "48px" },
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true },
                { orderable: true, className: "text-end" },
                { orderable: true }
            ],
            order: [[7, "desc"]],
            language: Object.assign({}, DfDataTable.language, {
                emptyTable: "Belum ada memo. Klik Add untuk membuat batch baru."
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
        var filtered = this.allMemoRows.filter(function (m) {
            var blob = [m.nomorMemo, m.namaMemo, m.kodeKmmd, m.namaKmmd, m.namaGroup]
                .join(" ").toLowerCase();
            return blob.indexOf(q) >= 0;
        });
        this.renderMemoTable(filtered);
        $("#memoCountLabel").text(filtered.length + " / " + this.allMemoRows.length + " memo");
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

    openCreate: function () {
        $("#fldNamaMemo").val("");
        $("#fldDescMemo").val("");
        $("#fldBudgetMemo").val("");
        $("#filterGroupSearch").val("");
        $("#chkShowIneligible").prop("checked", false);
        this.headerCompact = false;
        $("#memoHeaderCard").removeClass("is-compact");
        this.syncHeaderToggleIcon();
        this.selected = {};
        this.expandedKey = null;
        this.groups = MemoDfStore.buildSelectionGroups();
        this.renderGroupTable();
        this.renderDetailEmpty();
        this.applyBudgetRules();
        this.showPanel("create");
        this.updateSaveEnabled();
    },

    openView: function (id) {
        var m = MemoDfStore.getById(id);
        if (!m) {
            MappingSubdistStore.toast("warning", "Memo tidak ditemukan");
            return;
        }
        $("#viewNomor").text(m.nomorMemo);
        $("#viewNama").text(m.namaMemo || "—");
        $("#viewDesc").text(m.description || "—");
        $("#viewHeaderBudget").text(MemoDfStore.formatRp(m.headerBudget));
        $("#viewBudget").text(MemoDfStore.formatRp(m.budgetMemo));
        $("#viewKode").text(m.kodeKmmd || "—");
        $("#viewNamaKmmd").text(m.namaKmmd || "—");
        $("#viewGroup").text(m.namaGroup || "—");
        $("#viewParent").text(m.parent === "YA" ? "Parent" : "Child");
        $("#viewShipTo").text(m.shipToSiteUseId || "—");
        $("#viewCreated").text(m.createdAt ? new Date(m.createdAt).toLocaleString("id-ID") : "—");
        this.showPanel("view");
    },

    findGroup: function (key) {
        return this.groups.find(function (g) { return g.key === key; }) || null;
    },

    renderGroupTable: function () {
        var self = this;
        var $body = $("#tblMemoGroupsBody");
        if (!this.groups.length) {
            $body.html(
                '<tr><td colspan="4" class="text-center text-muted py-4">Belum ada Parent di Mapping Subdist.</td></tr>'
            );
            return;
        }
        var html = "";
        this.groups.forEach(function (g) {
            var region = (g.members[0] && g.members[0].region) || "";
            html +=
                '<tr class="memo-group-row" data-group-key="' + self.esc(g.key) + '" ' +
                'data-search="' + self.esc((g.namaGroup + " " + region).toLowerCase()) + '">' +
                '<td class="text-muted"><i class="fas fa-chevron-right memo-row-chevron small"></i></td>' +
                "<td><div class=\"fw-semibold\">" + self.esc(g.namaGroup) + "</div>" +
                '<div class="small text-muted">' + self.esc(region || g.groupType) +
                " · " + g.members.length + " Subdist</div></td>" +
                '<td class="text-end small">' + MemoDfStore.formatRp(g.totalBudgetQp) + "</td>" +
                '<td class="text-center"><span data-col-quota="' + self.esc(g.key) + '">—</span></td>' +
                "</tr>";
        });
        $body.html(html);
    },

    renderDetailEmpty: function (msg) {
        if (this._loadTimer) {
            clearTimeout(this._loadTimer);
            this._loadTimer = null;
        }
        $("#memoDetailActions").addClass("d-none");
        $("#memoGroupDetailHost")
            .addClass("is-empty")
            .html(msg || "Pilih grup di kiri untuk mencentang Subdist.");
        $("#tblMemoGroupsBody tr.memo-group-row").removeClass("is-open");
        $("#tblMemoGroupsBody .memo-row-chevron")
            .removeClass("fa-chevron-down").addClass("fa-chevron-right");
    },

    renderSkeleton: function () {
        $("#memoGroupDetailHost").removeClass("is-empty").html(
            '<div class="memo-skeleton py-2">' +
            '<div class="sk" style="width:55%"></div>' +
            '<div class="sk" style="width:80%"></div>' +
            '<div class="sk" style="width:70%"></div>' +
            '<div class="sk" style="width:90%"></div>' +
            '<div class="sk" style="width:65%"></div>' +
            "</div>"
        );
    },

    /**
     * @param {string} key
     * @param {boolean} [forceOpen] — jika true, jangan toggle close
     */
    toggleGroup: function (key, forceOpen) {
        if (!forceOpen && this.expandedKey === key) {
            this.expandedKey = null;
            this.renderDetailEmpty();
            return;
        }
        this.expandedKey = key;
        this.openGroupWithLoading(key);
    },

    openGroupWithLoading: function (key) {
        var self = this;
        if (this._loadTimer) clearTimeout(this._loadTimer);

        $("#tblMemoGroupsBody tr.memo-group-row").removeClass("is-open");
        $("#tblMemoGroupsBody .memo-row-chevron")
            .removeClass("fa-chevron-down").addClass("fa-chevron-right");
        var $row = $('#tblMemoGroupsBody tr[data-group-key="' + key + '"]');
        $row.addClass("is-open");
        $row.find(".memo-row-chevron").removeClass("fa-chevron-right").addClass("fa-chevron-down");

        this.renderSkeleton();
        $("#memoDetailActions").addClass("d-none");

        // Soft loading — terasa responsif, siap untuk API nanti
        this._loadTimer = setTimeout(function () {
            self._loadTimer = null;
            if (self.expandedKey !== key) return;
            self.renderGroupDetail(key);
            self.applyBudgetRules();
            self.scrollDetailIntoView();
        }, 280);
    },

    scrollDetailIntoView: function () {
        var el = document.getElementById("memoPaneDetail");
        if (!el) return;
        if (window.matchMedia("(max-width: 991.98px)").matches) {
            el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    },

    renderGroupDetail: function (key) {
        var g = this.findGroup(key);
        var self = this;
        if (!g) {
            this.renderDetailEmpty();
            return;
        }

        $("#memoDetailActions").removeClass("d-none");

        var html =
            '<div class="px-3 pt-3 pb-2 border-bottom">' +
            "<div class=\"fw-semibold\">" + this.esc(g.namaGroup) + "</div>" +
            '<div class="small text-muted" data-detail-quota="' + this.esc(g.key) + '">—</div>' +
            "</div>" +
            '<div class="table-responsive">' +
            '<table class="table table-sm table-hover mb-0 align-middle">' +
            "<thead class=\"table-light\"><tr>" +
            '<th class="text-center" style="width:40px;"></th>' +
            "<th>Peran</th><th>Kode</th><th>Nama</th>" +
            '<th class="text-end">Budget QP</th>' +
            "</tr></thead><tbody>";

        g.members.forEach(function (m) {
            html +=
                '<tr data-member-id="' + self.esc(m.id) + '">' +
                '<td class="text-center">' +
                '<input type="checkbox" class="form-check-input chk-memo-subdist" ' +
                'data-id="' + self.esc(m.id) + '" data-budget="' + (Number(m.budgetQp) || 0) + '">' +
                "</td>" +
                "<td>" + (m.parent === "YA"
                    ? '<span class="badge bg-label-success">Parent</span>'
                    : '<span class="badge bg-label-warning">Child</span>') + "</td>" +
                "<td><code>" + self.esc(m.kodeKmmd) + "</code></td>" +
                "<td>" + self.esc(m.namaKmmd) + "</td>" +
                '<td class="text-end small">' + MemoDfStore.formatRp(m.budgetQp) + "</td>" +
                "</tr>";
        });
        html += "</tbody></table></div>";

        $("#memoGroupDetailHost").removeClass("is-empty").html(html);
    },

    clearExpandedGroup: function () {
        var g = this.findGroup(this.expandedKey);
        if (!g) return;
        var self = this;
        g.members.forEach(function (m) { delete self.selected[m.id]; });
        this.applyBudgetRules();
    },

    pickQuotaInExpanded: function () {
        var g = this.findGroup(this.expandedKey);
        if (!g) return;
        var max = this.maxSlotsInGroup(g);
        if (max < 1) {
            MappingSubdistStore.toast("warning", "Grup belum eligible — cek Minimal Budget");
            return;
        }
        var self = this;
        // Parent dulu, lalu child; isi sampai kuota
        var ordered = g.members.slice().sort(function (a, b) {
            if (a.parent === "YA" && b.parent !== "YA") return -1;
            if (b.parent === "YA" && a.parent !== "YA") return 1;
            return 0;
        });
        g.members.forEach(function (m) { delete self.selected[m.id]; });
        var n = 0;
        ordered.forEach(function (m) {
            if (n >= max) return;
            self.selected[m.id] = m;
            n++;
        });
        this.applyBudgetRules();
        MappingSubdistStore.toast("success", n + " Subdist dipilih sesuai kuota");
    },

    applyGroupFilters: function () {
        var q = (($("#filterGroupSearch").val() || "") + "").trim().toLowerCase();
        var showInelig = $("#chkShowIneligible").prop("checked");
        var visible = 0;
        var self = this;
        var min = this.headerBudget();
        var hasMin = !isNaN(min) && min > 0;

        $("#tblMemoGroupsBody tr.memo-group-row").each(function () {
            var key = this.getAttribute("data-group-key");
            var g = self.findGroup(key);
            var eligible = g ? self.isGroupEligible(g) : false;
            var searchOk = !q || (this.getAttribute("data-search") || "").indexOf(q) >= 0;
            var statusOk = !hasMin || showInelig || eligible;
            var show = searchOk && statusOk;
            $(this).toggle(show);
            if (show) visible++;
        });

        $("#memoGroupVisibleLabel").text(visible + " tampil");

        if (this.expandedKey) {
            var $open = $('#tblMemoGroupsBody tr[data-group-key="' + this.expandedKey + '"]');
            if (!$open.is(":visible")) {
                this.expandedKey = null;
                this.renderDetailEmpty("Grup tersembunyi filter — pilih grup lain.");
            }
        }

        if (hasMin && visible === 0) {
            var emptyHint = showInelig
                ? "Tidak ada grup cocok pencarian."
                : "Tidak ada grup eligible untuk " + MemoDfStore.formatRp(min) +
                    ". Turunkan minimal atau centang “Semua”.";
            if (!this.expandedKey) {
                $("#memoGroupDetailHost").addClass("is-empty").html(emptyHint);
            }
        }
    },

    formatBudgetInput: function (el) {
        if (!el) return;
        var formatted = MemoDfStore.formatCurrencyInput(el.value);
        if (el.value !== formatted) el.value = formatted;
    },

    onHeaderBudgetChange: function () {
        this.clearIneligibleSelection();
        if (this.expandedKey) {
            this.renderGroupDetail(this.expandedKey);
        }
        this.applyBudgetRules();
    },

    onMemberToggle: function (el) {
        var id = el.getAttribute("data-id");
        var member = this.findMember(id);
        if (!member) return;
        if (el.checked) {
            var g = this.findGroupForMember(id);
            if (!g || !this.isGroupEligible(g)) {
                el.checked = false;
                MappingSubdistStore.toast("warning", "Grup belum memenuhi Minimal Budget");
                return;
            }
            if (!this.canSelectMoreInGroup(g)) {
                el.checked = false;
                MappingSubdistStore.toast("warning", "Kuota grup penuh");
                return;
            }
            this.selected[id] = member;
        } else {
            delete this.selected[id];
        }
        this.applyBudgetRules();
    },

    findMember: function (id) {
        for (var i = 0; i < this.groups.length; i++) {
            var m = this.groups[i].members.find(function (x) { return x.id === id; });
            if (m) return m;
        }
        return null;
    },

    findGroupForMember: function (id) {
        for (var i = 0; i < this.groups.length; i++) {
            if (this.groups[i].members.some(function (x) { return x.id === id; })) {
                return this.groups[i];
            }
        }
        return null;
    },

    headerBudget: function () {
        return MemoDfStore.parseCurrency($("#fldBudgetMemo").val());
    },

    maxSlotsInGroup: function (g) {
        var min = this.headerBudget();
        if (isNaN(min) || min <= 0) return 0;
        var byBudget = Math.floor((Number(g.totalBudgetQp) || 0) / min);
        var byMembers = (g.members && g.members.length) ? g.members.length : 0;
        return Math.max(0, Math.min(byBudget, byMembers));
    },

    selectedCountInGroup: function (g) {
        var self = this;
        var n = 0;
        (g.members || []).forEach(function (m) {
            if (self.selected[m.id]) n++;
        });
        return n;
    },

    remainingGroupCapacity: function (g) {
        var min = this.headerBudget();
        if (isNaN(min) || min <= 0) return 0;
        return (Number(g.totalBudgetQp) || 0) - this.selectedCountInGroup(g) * min;
    },

    canSelectMoreInGroup: function (g) {
        return this.selectedCountInGroup(g) < this.maxSlotsInGroup(g);
    },

    isGroupEligible: function (g) {
        return this.maxSlotsInGroup(g) >= 1;
    },

    clearIneligibleSelection: function () {
        var min = this.headerBudget();
        if (isNaN(min) || min <= 0) {
            this.selected = {};
            return;
        }
        var self = this;
        this.groups.forEach(function (g) {
            var max = self.maxSlotsInGroup(g);
            var ids = g.members
                .map(function (m) { return m.id; })
                .filter(function (id) { return !!self.selected[id]; });
            if (max < 1) {
                ids.forEach(function (id) { delete self.selected[id]; });
                return;
            }
            while (ids.length > max) {
                delete self.selected[ids.pop()];
            }
        });
    },

    updatePills: function () {
        var min = this.headerBudget();
        $("#pillMinimal").text(isNaN(min) || min <= 0 ? "—" : MemoDfStore.formatRp(min));
        $("#createSelectedCount").text(String(Object.keys(this.selected).length));
    },

    updateSaveEnabled: function () {
        var nama = ($("#fldNamaMemo").val() || "").trim();
        var budget = this.headerBudget();
        var ok = !!nama && !isNaN(budget) && budget > 0 && Object.keys(this.selected).length > 0;
        $("#btnSaveMemoSticky, #btnSaveMemo").prop("disabled", !ok);
    },

    renderSelectedChips: function () {
        var ids = Object.keys(this.selected);
        $("#stickySelectedCount").text(String(ids.length));
        $("#btnClearSelected").prop("disabled", ids.length === 0);
        this.updatePills();
        this.updateSaveEnabled();

        if (!ids.length) {
            $("#memoSelectedChips").html('<span class="text-muted small">Belum ada Subdist dipilih.</span>');
            return;
        }
        var html = "";
        var self = this;
        ids.forEach(function (id) {
            var m = self.selected[id];
            html +=
                '<button type="button" class="memo-chip" data-id="' + self.esc(id) + '" title="Buka grup">' +
                '<span class="lbl">' + self.esc(m.kodeKmmd) + " · " + self.esc(m.namaKmmd) + "</span>" +
                '<span class="btn-chip-remove" data-id="' + self.esc(id) + '" title="Hapus">&times;</span>' +
                "</button>";
        });
        $("#memoSelectedChips").html(html);
    },

    applyBudgetRules: function () {
        var min = this.headerBudget();
        var hasMin = !isNaN(min) && min > 0;
        var eligibleCount = 0;
        var self = this;

        this.groups.forEach(function (g) {
            var max = self.maxSlotsInGroup(g);
            var used = self.selectedCountInGroup(g);
            var rem = self.remainingGroupCapacity(g);
            var ok = max >= 1;
            if (ok) eligibleCount++;

            var $row = $('#tblMemoGroupsBody tr[data-group-key="' + g.key + '"]');
            $row.toggleClass("is-eligible", hasMin && ok);
            $row.toggleClass("is-ineligible", hasMin && !ok);

            var $q = $('[data-col-quota="' + g.key + '"]');
            if (!hasMin) $q.html('<span class="text-muted">—</span>');
            else if (ok) $q.html("<strong>" + used + "/" + max + "</strong>");
            else $q.html('<span class="text-muted">0</span>');

            var $dq = $('[data-detail-quota="' + g.key + '"]');
            if ($dq.length) {
                if (!hasMin) $dq.text("Isi Minimal Budget di header");
                else {
                    var note = used >= max ? " · kuota penuh" : (rem < min ? " · sisa < 1 slot" : "");
                    $dq.text(
                        "Kuota " + used + "/" + max +
                        " · sisa " + MemoDfStore.formatRp(rem) + note
                    );
                }
            }
        });

        if (!hasMin) {
            $("#createEligibleGroups").text("—");
            $("#createBudgetHint").text("Isi Minimal Budget untuk melihat grup eligible.");
        } else {
            $("#createEligibleGroups").text(eligibleCount + " / " + this.groups.length);
            $("#createBudgetHint").text("Default: hanya eligible. Centang “Semua” untuk lihat yang di bawah.");
        }

        $(".chk-memo-subdist").each(function () {
            var id = this.getAttribute("data-id");
            var g = self.findGroupForMember(id);
            var isSel = !!self.selected[id];
            var max = g ? self.maxSlotsInGroup(g) : 0;
            var canMore = g ? self.canSelectMoreInGroup(g) : false;

            if (!hasMin) {
                this.checked = false;
                this.disabled = true;
                this.title = "Isi Minimal Budget dulu";
                return;
            }
            if (!g || max < 1) {
                this.checked = false;
                this.disabled = true;
                delete self.selected[id];
                this.title = "Grup di bawah Minimal Budget";
                return;
            }
            if (isSel) {
                this.checked = true;
                this.disabled = false;
                this.title = "Lepas pilihan";
                return;
            }
            this.checked = false;
            this.disabled = !canMore;
            this.title = canMore ? "Dapat dipilih" : "Kuota grup penuh — sisa < Minimal Budget";
        });

        this.renderSelectedChips();
        this.applyGroupFilters();
    },

    saveCreate: async function () {
        var nama = ($("#fldNamaMemo").val() || "").trim();
        var desc = ($("#fldDescMemo").val() || "").trim();
        var budget = this.headerBudget();
        var ids = Object.keys(this.selected);

        if (!nama) {
            MappingSubdistStore.toast("warning", "Nama Memo wajib diisi");
            return;
        }
        if (isNaN(budget) || budget <= 0) {
            MappingSubdistStore.toast("warning", "Minimal Budget wajib");
            return;
        }
        if (!ids.length) {
            MappingSubdistStore.toast("warning", "Pilih minimal 1 Subdist");
            return;
        }

        var self = this;
        var byGroup = {};
        for (var i = 0; i < ids.length; i++) {
            var g = self.findGroupForMember(ids[i]);
            if (!g || self.maxSlotsInGroup(g) < 1) {
                MappingSubdistStore.toast("warning", "Ada Subdist dari grup tidak eligible");
                return;
            }
            byGroup[g.key] = (byGroup[g.key] || 0) + 1;
            if (byGroup[g.key] > self.maxSlotsInGroup(g)) {
                MappingSubdistStore.toast("warning", "Kuota terlampaui: " + g.namaGroup);
                return;
            }
        }

        var members = ids.map(function (id) { return MemoDfPage.selected[id]; });
        var sampleList = members.slice(0, 5).map(function (m) {
            return "• " + self.esc(m.kodeKmmd) + " — " + self.esc(m.namaKmmd);
        }).join("<br>");
        if (members.length > 5) {
            sampleList += "<br>• … +" + (members.length - 5) + " lainnya";
        }

        await MappingSubdistStore.ensureSwal();
        var confirmed = false;
        if (typeof Swal !== "undefined") {
            var result = await Swal.fire({
                icon: "question",
                title: "Simpan Memo DF?",
                html:
                    "<div class=\"text-start small\">" +
                    "<p class=\"mb-1\"><strong>" + members.length + " memo</strong> akan dibuat.</p>" +
                    "<p class=\"mb-1\">Nama: <strong>" + self.esc(nama) + "</strong></p>" +
                    "<p class=\"mb-2\">Minimal: <strong>" + MemoDfStore.formatRp(budget) + "</strong></p>" +
                    "<div class=\"mb-0\">" + sampleList + "</div>" +
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
            confirmed = window.confirm("Simpan " + members.length + " memo?");
        }
        if (!confirmed) return;

        var created = MemoDfStore.createBatch(
            { namaMemo: nama, description: desc, budgetMemo: budget },
            members
        );

        MappingSubdistStore.toast(
            "success",
            created.length + " memo dibuat (" + created[0].nomorMemo +
                (created.length > 1 ? " … " + created[created.length - 1].nomorMemo : "") + ")"
        );
        this.showPanel("index");
        this.refreshList();
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

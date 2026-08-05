/**
 * Memo DF (Setting QP) — Index list + Create SPA + View
 */
"use strict";

var MemoDfPage = {
    listTable: null,
    groups: [],
    selected: {}, // id -> member

    init: async function () {
        if (typeof DfDataTable !== "undefined") {
            await DfDataTable.ensureAssets();
        }
        this.bindEvents();
        this.showPanel("index");
        this.refreshList();
    },

    bindEvents: function () {
        var self = this;
        $("#btnAddMemo").on("click", function () { self.openCreate(); });
        $("#btnBackIndex, #btnBackFromView").on("click", function () {
            self.showPanel("index");
            self.refreshList();
        });
        $("#btnCancelCreate").on("click", function () {
            self.showPanel("index");
        });
        $("#fldBudgetMemo").on("input", function () {
            self.formatBudgetInput(this);
            self.onHeaderBudgetChange();
        });
        $("#fldBudgetMemo").on("blur", function () {
            self.formatBudgetInput(this);
        });
        $("#btnSaveMemo").on("click", function () { self.saveCreate(); });

        $(document).on("change", ".chk-memo-subdist", function () {
            self.onMemberToggle(this);
        });

        $(document).on("click", ".btn-view-memo", function () {
            var id = $(this).data("id");
            self.openView(id);
        });
    },

    showPanel: function (name) {
        $("#PanelIndex").toggleClass("d-none", name !== "index");
        $("#PanelCreate").toggleClass("d-none", name !== "create");
        $("#PanelView").toggleClass("d-none", name !== "view");
    },

    refreshList: function () {
        var rows = MemoDfStore.load();
        var data = rows.map(function (m) {
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
                emptyTable: "Belum ada memo. Klik Add untuk membuat."
            })
        });
        $("#memoCountLabel").text(rows.length + " memo");
    },

    openCreate: function () {
        $("#fldNamaMemo").val("");
        $("#fldDescMemo").val("");
        $("#fldBudgetMemo").val("");
        $("#createBudgetHint").text("Isi Minimal Budget untuk filter grup / Subdist yang memenuhi.");
        $("#createSelectedCount").text("0");
        $("#createEligibleGroups").text("—");
        this.selected = {};
        this.groups = MemoDfStore.buildSelectionGroups();
        this.renderGroups();
        this.applyBudgetRules();
        this.showPanel("create");
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
        $("#viewMinBudgetLabel").text("Minimal Budget (filter)");
        $("#viewBudget").text(MemoDfStore.formatRp(m.budgetMemo));
        $("#viewKode").text(m.kodeKmmd || "—");
        $("#viewNamaKmmd").text(m.namaKmmd || "—");
        $("#viewGroup").text(m.namaGroup || "—");
        $("#viewParent").text(m.parent === "YA" ? "Parent" : "Child");
        $("#viewShipTo").text(m.shipToSiteUseId || "—");
        $("#viewCreated").text(m.createdAt ? new Date(m.createdAt).toLocaleString("id-ID") : "—");
        this.showPanel("view");
    },

    renderGroups: function () {
        var html = "";
        var self = this;
        if (!this.groups.length) {
            $("#memoGroupList").html(
                '<div class="alert alert-warning mb-0">Belum ada Parent di Mapping Subdist.</div>'
            );
            return;
        }
        this.groups.forEach(function (g) {
            var fitsHeaderNote = "";
            html +=
                '<div class="card mb-3 memo-group-card" data-group-key="' + self.esc(g.key) + '">' +
                '<div class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2 py-2">' +
                "<div><strong>" + self.esc(g.namaGroup) + "</strong>" +
                ' <span class="badge bg-label-secondary ms-1">' + self.esc(g.groupType) + "</span>" +
                ' <span class="badge bg-label-info ms-1">' + g.members.length + " Subdist</span></div>" +
                '<div class="small text-muted text-end">' +
                'Total Budget QP grup: <strong class="text-body">' +
                MemoDfStore.formatRp(g.totalBudgetQp) + "</strong>" +
                '<div class="memo-group-quota text-muted" data-group-quota="' + self.esc(g.key) + '">—</div>' +
                "</div></div>" +
                '<div class="card-body p-0">' +
                '<div class="table-responsive">' +
                '<table class="table table-sm table-bordered mb-0 align-middle">' +
                "<thead><tr>" +
                '<th class="text-center" style="width:40px;"></th>' +
                "<th>Peran</th><th>Kode KMMD</th><th>Nama KMMD</th>" +
                '<th class="text-end">Budget QP</th>' +
                "</tr></thead><tbody>";

            g.members.forEach(function (m) {
                html +=
                    "<tr data-member-id=\"" + self.esc(m.id) + "\">" +
                    '<td class="text-center">' +
                    '<input type="checkbox" class="form-check-input chk-memo-subdist" ' +
                    'data-id="' + self.esc(m.id) + '" data-budget="' + (Number(m.budgetQp) || 0) + '" ' +
                    'disabled title="Isi Budget Memo dulu">' +
                    "</td>" +
                    "<td>" + (m.parent === "YA"
                        ? '<span class="badge bg-label-success">Parent</span>'
                        : '<span class="badge bg-label-warning">Child</span>') + "</td>" +
                    "<td><code>" + self.esc(m.kodeKmmd) + "</code></td>" +
                    "<td>" + self.esc(m.namaKmmd) + "</td>" +
                    '<td class="text-end">' + MemoDfStore.formatRp(m.budgetQp) + "</td>" +
                    "</tr>";
            });
            html += "</tbody></table></div></div></div>";
        });
        $("#memoGroupList").html(html);
    },

    formatBudgetInput: function (el) {
        if (!el) return;
        var formatted = MemoDfStore.formatCurrencyInput(el.value);
        if (el.value !== formatted) {
            el.value = formatted;
        }
    },

    onHeaderBudgetChange: function () {
        this.clearIneligibleSelection();
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
                MappingSubdistStore.toast(
                    "warning",
                    "Kuota grup penuh — sisa total Budget QP grup tidak cukup untuk 1× Minimal Budget lagi"
                );
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

    /** Max pilihan di grup = min(floor(total QP ÷ minimal), jumlah Subdist di grup) */
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

    /** Sisa kapasitas grup setelah slot terpakai (tiap pilihan = 1× Minimal Budget) */
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

    /**
     * Buang pilihan di grup tidak eligible;
     * jika minimal naik sehingga kuota turun, trim kelebihan (FIFO).
     */
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
                var drop = ids.pop();
                delete self.selected[drop];
            }
        });
    },

    /**
     * Minimal Budget = unit slot per Subdist di dalam grup.
     * Contoh: total grup 11,5M & minimal 5M → max 2 Subdist (5+5=10; sisa 1,5 tidak cukup).
     */
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

            var $card = $('.memo-group-card[data-group-key="' + g.key + '"]');
            $card.removeClass("border-warning border-success opacity-50");
            var $quota = $('[data-group-quota="' + g.key + '"]');
            if (!hasMin) {
                $quota.text("—");
                return;
            }
            if (ok) {
                $card.addClass("border-success");
                var note = "";
                if (used >= max) note = ' <span class="text-danger">· kuota penuh</span>';
                else if (rem < min) note = ' <span class="text-danger">· sisa &lt; 1× minimal</span>';
                $quota.html(
                    "Kuota pilihan: <strong>" + used + " / " + max + "</strong>" +
                    " (dari " + g.members.length + " Subdist) · sisa kapasitas " +
                    MemoDfStore.formatRp(rem) + note
                );
            } else {
                $card.addClass("border-warning opacity-50");
                $quota.html(
                    "Tidak memenuhi — total grup " + MemoDfStore.formatRp(g.totalBudgetQp) +
                    " &lt; Minimal " + MemoDfStore.formatRp(min)
                );
            }
        });

        $("#createSelectedCount").text(String(Object.keys(this.selected).length));
        if (!hasMin) {
            $("#createEligibleGroups").text("—");
            $("#createBudgetHint").text(
                "Isi Minimal Budget. Tiap Subdist terpilih memakai 1× nilai itu dari total Budget QP grup."
            );
        } else {
            $("#createEligibleGroups").text(eligibleCount + " / " + this.groups.length);
            $("#createBudgetHint").text(
                "Minimal " + MemoDfStore.formatRp(min) +
                " / pilihan. Kuota grup = min(floor(total QP ÷ minimal), jumlah Subdist). " +
                "Contoh total 11,5M ÷ 5M → max 2 (bukan ratusan)."
            );
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
                this.title = "Total Budget QP grup di bawah Minimal Budget";
                return;
            }
            if (isSel) {
                this.checked = true;
                this.disabled = false;
                this.title = "Lepas pilihan (bebaskan 1 slot)";
                return;
            }
            if (canMore) {
                this.checked = false;
                this.disabled = false;
                this.title = "Dapat dipilih (masih ada kuota di grup)";
            } else {
                this.checked = false;
                this.disabled = true;
                this.title = "Kuota grup penuh — sisa kapasitas < Minimal Budget";
            }
        });
    },

    saveCreate: function () {
        var nama = ($("#fldNamaMemo").val() || "").trim();
        var desc = ($("#fldDescMemo").val() || "").trim();
        var budget = this.headerBudget();
        var ids = Object.keys(this.selected);

        if (!nama) {
            MappingSubdistStore.toast("warning", "Nama Memo wajib diisi");
            return;
        }
        if (isNaN(budget) || budget <= 0) {
            MappingSubdistStore.toast("warning", "Minimal Budget wajib (currency > 0)");
            return;
        }
        if (!ids.length) {
            MappingSubdistStore.toast("warning", "Pilih minimal 1 Subdist dari grup yang memenuhi");
            return;
        }

        var self = this;
        var byGroup = {};
        for (var i = 0; i < ids.length; i++) {
            var g = self.findGroupForMember(ids[i]);
            if (!g || self.maxSlotsInGroup(g) < 1) {
                MappingSubdistStore.toast("warning", "Ada Subdist dari grup di bawah Minimal Budget");
                return;
            }
            byGroup[g.key] = (byGroup[g.key] || 0) + 1;
            if (byGroup[g.key] > self.maxSlotsInGroup(g)) {
                MappingSubdistStore.toast("warning", "Kuota grup terlampaui: " + g.namaGroup);
                return;
            }
        }

        var members = ids.map(function (id) { return MemoDfPage.selected[id]; });
        var created = MemoDfStore.createBatch(
            { namaMemo: nama, description: desc, budgetMemo: budget },
            members
        );

        MappingSubdistStore.toast(
            "success",
            created.length + " memo dibuat (nomor " + created[0].nomorMemo +
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

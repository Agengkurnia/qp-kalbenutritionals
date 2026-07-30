/**
 * Laporan Budget per Subdist — Ringkasan + Riwayat (prototype, UX rutin).
 */
"use strict";

var ReportBudgetSubdist = {
    _groups: [],
    _historyRows: [],
    _activeTab: "summary",
    summaryTable: null,
    historyTable: null,

    init: async function () {
        this._regionOptionsReady = false;
        if (typeof DfDataTable !== "undefined") {
            await DfDataTable.ensureAssets();
        }
        this.bindEvents();
        this.fillHistoryMonthsDefault();
        this.initSearchableSelects();
        this.refreshSummary();
        this.fillHistoryParentSelect();
        this.renderHistoryTable([]);
        this.showKpiForTab("summary");
    },

    bindEvents: function () {
        var self = this;

        $("#filterRegion").on("change", function () {
            self.refreshSummary();
        });

        $("#btnExportSummary").on("click", function () {
            self.exportSummaryCsv();
        });

        $("#btnExportHistory").on("click", function () {
            self.exportHistoryCsv();
        });

        // Auto-load history: Parent / bulan berubah
        $("#filterHistoryParent").on("change", function () {
            self.refreshHistory();
        });
        $("#filterFromYm, #filterToYm").on("change", function () {
            if ($("#filterHistoryParent").val()) {
                self.refreshHistory();
            }
        });

        $("#btnResetMockBi").on("click", function () {
            if (typeof MockBiLedger === "undefined") return;
            MockBiLedger.resetSeed();
            self._regionOptionsReady = false;
            self.refreshSummary();
            self.fillHistoryParentSelect();
            self.refreshHistory();
            self.notify("success", "Data mock BI di-reset");
        });

        $(document).on("click", "#tblBudgetSummary .btn-expand-group", function (e) {
            e.preventDefault();
            if (!self.summaryTable) return;
            var $btn = $(this);
            var tr = $btn.closest("tr");
            var row = self.summaryTable.row(tr);
            var data = row.data();
            if (!data || !data._hasChild) return;
            if (row.child.isShown()) {
                row.child.hide();
                tr.removeClass("shown");
                $btn.attr("aria-expanded", "false").find("i")
                    .removeClass("fa-chevron-down").addClass("fa-chevron-right");
            } else {
                row.child(self.buildChildHtml(data._group)).show();
                tr.addClass("shown");
                $btn.attr("aria-expanded", "true").find("i")
                    .removeClass("fa-chevron-right").addClass("fa-chevron-down");
            }
        });

        $('button[data-bs-toggle="tab"]').on("shown.bs.tab", function (e) {
            var target = $(e.target).attr("data-bs-target");
            if (target === "#pane-summary") {
                self._activeTab = "summary";
                self.showKpiForTab("summary");
                if (self.summaryTable) DfDataTable.adjust(self.summaryTable);
            }
            if (target === "#pane-history") {
                self._activeTab = "history";
                self.showKpiForTab("history");
                if (self.historyTable) DfDataTable.adjust(self.historyTable);
                // Jika Parent sudah terpilih, pastikan data ter-load
                if ($("#filterHistoryParent").val() && !(self._historyRows && self._historyRows.length)) {
                    self.refreshHistory();
                }
            }
        });
    },

    showKpiForTab: function (tab) {
        if (tab === "history") {
            $("#kpiSummaryRow").addClass("d-none");
            $("#kpiHistoryRow").removeClass("d-none");
            this.renderHistoryKpi(this._historyRows || []);
        } else {
            $("#kpiHistoryRow").addClass("d-none");
            $("#kpiSummaryRow").removeClass("d-none");
        }
    },

    notify: function (icon, text) {
        if (typeof MappingSubdistStore !== "undefined" && MappingSubdistStore.toast) {
            MappingSubdistStore.toast(icon, text);
        } else if (typeof Swal !== "undefined") {
            Swal.fire({ icon: icon, text: text, timer: 1800, showConfirmButton: false });
        } else {
            alert(text);
        }
    },

    initSearchableSelects: function () {
        if (typeof $.fn.select2 !== "function") return;
        this.applySelect2("#filterRegion", "Semua region…");
        this.applySelect2("#filterHistoryParent", "Cari Parent…");
    },

    applySelect2: function (selector, placeholder) {
        var $el = $(selector);
        if (!$el.length) return;
        if ($el.hasClass("select2-hidden-accessible")) {
            $el.select2("destroy");
        }
        $el.select2({
            placeholder: placeholder,
            allowClear: true,
            width: "100%",
            dropdownParent: $el.closest(".card-body, .tab-pane, body")
        });
    },

    refreshSelect2: function (selector) {
        if (typeof $.fn.select2 !== "function") return;
        var placeholder = selector === "#filterHistoryParent"
            ? "Cari Parent…"
            : "Semua region…";
        this.applySelect2(selector, placeholder);
    },

    fillHistoryMonthsDefault: function () {
        $("#filterFromYm").val("2026-05");
        $("#filterToYm").val("2026-07");
    },

    getParents: function () {
        if (typeof MappingSubdistStore === "undefined") return [];
        return MappingSubdistStore.load().filter(function (d) {
            return d.parent === "YA" && d.active !== false;
        });
    },

    buildGroups: function () {
        var parents = this.getParents();
        return parents.map(function (p) {
            var children = MappingSubdistStore.getChildren(p).filter(function (c) {
                return c.active !== false;
            });
            var members = [p].concat(children);
            var memberRows = members.map(function (m) {
                var kode = m.kodeKmmd || m.id;
                var budget = MockBiLedger.getBudget(kode);
                return {
                    kodeKmmd: kode,
                    namaKmmd: m.namaKmmd || "",
                    status: m.parent === "YA" ? "Parent" : "Child",
                    region: m.region || "",
                    shipTo: m.shipToSiteUseId || "",
                    groupType: m.groupType || "",
                    namaGroup: m.namaGroup || "",
                    injected: budget.injected,
                    used: budget.used,
                    sisa: budget.sisa
                };
            });
            return {
                parent: p,
                parentId: p.id || p.kodeKmmd,
                members: memberRows,
                groupInjected: memberRows.reduce(function (s, r) { return s + r.injected; }, 0),
                groupUsed: memberRows.reduce(function (s, r) { return s + r.used; }, 0),
                groupSisa: memberRows.reduce(function (s, r) { return s + r.sisa; }, 0)
            };
        });
    },

    filterGroups: function (groups) {
        var region = ($("#filterRegion").val() || "").trim();
        return groups.filter(function (g) {
            if (region && (g.parent.region || "") !== region) return false;
            return true;
        });
    },

    fillRegionOptions: function (groups) {
        var regions = {};
        groups.forEach(function (g) {
            if (g.parent.region) regions[g.parent.region] = true;
        });
        var current = $("#filterRegion").val();
        var $sel = $("#filterRegion");
        $sel.empty().append('<option value="">Semua region</option>');
        Object.keys(regions).sort().forEach(function (r) {
            $sel.append($("<option>").val(r).text(r));
        });
        if (current && regions[current]) $sel.val(current);
        else $sel.val("");
        this.refreshSelect2("#filterRegion");
    },

    fillHistoryParentSelect: function () {
        var parents = this.getParents().slice().sort(function (a, b) {
            return String(a.namaKmmd).localeCompare(String(b.namaKmmd));
        });
        var current = $("#filterHistoryParent").val();
        var $sel = $("#filterHistoryParent");
        $sel.empty().append('<option value="">— Pilih Parent —</option>');
        parents.forEach(function (p) {
            var id = p.id || p.kodeKmmd;
            $sel.append(
                $("<option>").val(id).text((p.kodeKmmd || id) + " — " + (p.namaKmmd || ""))
            );
        });
        if (current) $sel.val(current);
        else $sel.val("");
        this.refreshSelect2("#filterHistoryParent");
    },

    refreshSummary: function () {
        var all = this.buildGroups();
        if (!this._regionOptionsReady) {
            this.fillRegionOptions(all);
            this._regionOptionsReady = true;
        }
        this._groups = this.filterGroups(all);
        this.renderSummaryKpi(this._groups);
        this.renderSummaryTable(this._groups);
    },

    renderSummaryKpi: function (groups) {
        $("#kpiParentCount").text(groups.length.toLocaleString("id-ID"));
        var sisa = groups.reduce(function (s, g) { return s + g.groupSisa; }, 0);
        var inj = groups.reduce(function (s, g) { return s + g.groupInjected; }, 0);
        $("#kpiGroupSisa").text(MockBiLedger.formatRp(sisa));
        $("#kpiGroupInjected").text(MockBiLedger.formatRp(inj));
    },

    renderHistoryKpi: function (rows) {
        var list = rows || [];
        $("#kpiMutasiCount").text(list.length.toLocaleString("id-ID"));
        var add = 0;
        var cut = 0;
        list.forEach(function (l) {
            var d = Number(l.delta) || 0;
            if (d > 0) add += d;
            else cut += Math.abs(d);
        });
        $("#kpiNetInject").text(MockBiLedger.formatRp(add));
        $("#kpiNetUsed").text(MockBiLedger.formatRp(cut));
    },

    esc: function (s) {
        return String(s == null ? "" : s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    },

    typeLabel: function (type) {
        var map = {
            INJECT_DELTA: "Penambahan",
            HISTORICAL_INJECT: "Inject historis",
            USE_CLAIM: "Pengurangan",
            UNMAP_CORRECTION: "Koreksi unmap"
        };
        return map[type] || type || "—";
    },

    typeBadgeHtml: function (type) {
        var label = this.typeLabel(type);
        var cls = "df-type-other";
        if (type === "INJECT_DELTA" || type === "HISTORICAL_INJECT") cls = "df-type-inject";
        else if (type === "USE_CLAIM" || type === "UNMAP_CORRECTION") cls = "df-type-use";
        return '<span class="df-type-badge ' + cls + '">' + this.esc(label) + "</span>";
    },

    buildChildHtml: function (group) {
        var self = this;
        var rows = (group.members || []).map(function (m) {
            var cls = m.status === "Parent" ? "table-primary" : "";
            return "<tr class='" + cls + "'>" +
                "<td>" + self.esc(m.kodeKmmd) + "</td>" +
                "<td>" + self.esc(m.namaKmmd) + "</td>" +
                "<td>" + self.esc(m.status) + "</td>" +
                "<td>" + self.esc(m.shipTo || "—") + "</td>" +
                "<td class='text-end'>" + self.esc(MockBiLedger.formatRp(m.injected)) + "</td>" +
                "<td class='text-end'>" + self.esc(MockBiLedger.formatRp(m.used)) + "</td>" +
                "<td class='text-end'>" + self.esc(MockBiLedger.formatRp(m.sisa)) + "</td>" +
                "</tr>";
        }).join("");
        var foot =
            "<tr class='fw-semibold'>" +
            "<td colspan='4' class='text-end'>Total grup</td>" +
            "<td class='text-end'>" + this.esc(MockBiLedger.formatRp(group.groupInjected)) + "</td>" +
            "<td class='text-end'>" + this.esc(MockBiLedger.formatRp(group.groupUsed)) + "</td>" +
            "<td class='text-end col-group-sisa'>" + this.esc(MockBiLedger.formatRp(group.groupSisa)) + "</td>" +
            "</tr>";
        return (
            "<div class='p-2 bg-light'>" +
            "<table class='table table-sm table-bordered mb-0'>" +
            "<thead><tr>" +
            "<th>Kode</th><th>Nama</th><th>Status</th><th>ShipTo</th>" +
            "<th class='text-end'>Disuntikkan</th><th class='text-end'>Terpakai</th>" +
            "<th class='text-end'>Sisa</th></tr></thead>" +
            "<tbody>" + rows + foot + "</tbody></table></div>"
        );
    },

    renderSummaryTable: function (groups) {
        var self = this;
        var data = groups.map(function (g) {
            var p = g.members[0];
            return {
                kodeKmmd: p.kodeKmmd,
                namaKmmd: p.namaKmmd,
                namaGroup: g.parent.namaGroup || g.parent.groupType || "—",
                region: p.region || "—",
                shipTo: p.shipTo || "—",
                injected: p.injected,
                used: p.used,
                sisa: p.sisa,
                groupSisa: g.groupSisa,
                _hasChild: g.members.length > 1,
                _group: g
            };
        });

        this.summaryTable = DfDataTable.init("#tblBudgetSummary", {
            data: data,
            columns: [
                {
                    data: null,
                    orderable: false,
                    searchable: false,
                    className: "text-center",
                    render: function (_d, _t, row) {
                        if (!row._hasChild) {
                            return '<span class="text-muted" title="Tanpa Child"><i class="fas fa-minus"></i></span>';
                        }
                        return '<button type="button" class="btn btn-sm btn-icon btn-expand-group" ' +
                            'aria-expanded="false" aria-label="Tampilkan anggota grup" title="Tampilkan anggota grup">' +
                            '<i class="fas fa-chevron-right"></i></button>';
                    }
                },
                { data: "kodeKmmd" },
                { data: "namaKmmd" },
                { data: "namaGroup" },
                { data: "region" },
                { data: "shipTo" },
                {
                    data: "injected",
                    className: "text-end",
                    render: function (d) { return MockBiLedger.formatRp(d); }
                },
                {
                    data: "used",
                    className: "text-end",
                    render: function (d) { return MockBiLedger.formatRp(d); }
                },
                {
                    data: "sisa",
                    className: "text-end",
                    render: function (d) { return MockBiLedger.formatRp(d); }
                },
                {
                    data: "groupSisa",
                    className: "text-end col-group-sisa",
                    render: function (d) { return MockBiLedger.formatRp(d); }
                }
            ],
            order: [[2, "asc"]],
            language: Object.assign({}, DfDataTable.language, {
                emptyTable: "Belum ada Parent di Mapping Subdist, atau Region tidak cocok.",
                zeroRecords: "Tidak ada Parent yang cocok dengan pencarian."
            })
        });
        setTimeout(function () { DfDataTable.adjust(self.summaryTable); }, 50);
    },

    flattenSummaryRows: function (groups) {
        var rows = [];
        groups.forEach(function (g) {
            g.members.forEach(function (m) {
                rows.push({
                    parentKode: g.parent.kodeKmmd || g.parent.id,
                    parentNama: g.parent.namaKmmd || "",
                    namaGroup: g.parent.namaGroup || "",
                    kodeKmmd: m.kodeKmmd,
                    namaKmmd: m.namaKmmd,
                    status: m.status,
                    region: m.region,
                    shipTo: m.shipTo,
                    injected: m.injected,
                    used: m.used,
                    sisa: m.sisa,
                    groupSisa: g.groupSisa
                });
            });
        });
        return rows;
    },

    exportSummaryCsv: function () {
        var flat = this.flattenSummaryRows(this._groups);
        if (!flat.length) {
            this.notify("warning", "Tidak ada data untuk diunduh");
            return;
        }
        var headers = [
            "ParentKode", "ParentNama", "NamaGroup", "KodeKMMD", "Nama", "Status",
            "Region", "ShipTo", "Disuntikkan", "Terpakai", "SisaParent", "SisaGrup"
        ];
        var lines = [headers.join(",")];
        flat.forEach(function (r) {
            lines.push([
                r.parentKode, r.parentNama, r.namaGroup, r.kodeKmmd, r.namaKmmd, r.status,
                r.region, r.shipTo, r.injected, r.used, r.sisa, r.groupSisa
            ].map(ReportBudgetSubdist.csvEscape).join(","));
        });
        this.downloadCsv(lines.join("\n"), "laporan-budget-ringkasan-" + this.todayStamp() + ".csv");
        this.notify("success", "CSV ringkasan diunduh (" + flat.length + " baris)");
    },

    refreshHistory: function () {
        var parentId = $("#filterHistoryParent").val();
        var fromYm = $("#filterFromYm").val();
        var toYm = $("#filterToYm").val();
        if (!parentId) {
            this._historyRows = [];
            this.renderHistoryTable([]);
            this.renderHistoryKpi([]);
            $("#historyHint").text(
                "Pilih Parent — mutasi grup (Parent + Child) langsung tampil. Ubah bulan untuk mempersempit periode."
            );
            return;
        }
        var parent = MappingSubdistStore.getById(parentId);
        if (!parent) {
            this._historyRows = [];
            this.renderHistoryTable([]);
            this.renderHistoryKpi([]);
            $("#historyHint").text("Parent tidak ditemukan di mapping.");
            return;
        }
        var children = MappingSubdistStore.getChildren(parent);
        var memberKodes = [parent.kodeKmmd || parent.id]
            .concat(children.map(function (c) { return c.kodeKmmd || c.id; }));

        var rows = MockBiLedger.listLedgerFiltered({
            memberKodes: memberKodes,
            fromYm: fromYm,
            toYm: toYm,
            forReport: true
        });
        this._historyRows = rows;
        this.renderHistoryTable(rows);
        this.renderHistoryKpi(rows);
        $("#historyHint").html(
            "<strong>" + this.esc(parent.namaKmmd || parentId) + "</strong>" +
            " · " + memberKodes.length + " anggota · " +
            this.esc(fromYm || "?") + " s/d " + this.esc(toYm || "?") +
            " · " + rows.length + " mutasi"
        );
    },

    renderHistoryTable: function (rows) {
        var self = this;
        var data = (rows || []).map(function (l) {
            return {
                trxDate: l.trxDate || "—",
                type: l.type || "",
                memberKode: l.memberKode || l.childKode || l.businessKey || l.parentKode || "",
                delta: l.delta,
                amountAfter: l.amountAfter,
                note: l.note || ""
            };
        });

        this.historyTable = DfDataTable.init("#tblBudgetHistory", {
            data: data,
            columns: [
                { data: "trxDate" },
                {
                    data: "type",
                    render: function (d) { return self.typeBadgeHtml(d); }
                },
                { data: "memberKode" },
                {
                    data: "delta",
                    className: "text-end",
                    render: function (d) {
                        var n = Number(d) || 0;
                        var cls = n > 0 ? "text-success" : (n < 0 ? "text-danger" : "text-muted");
                        return '<span class="' + cls + '">' + MockBiLedger.formatRp(d) + "</span>";
                    }
                },
                {
                    data: "amountAfter",
                    className: "text-end",
                    render: function (d) { return MockBiLedger.formatRp(d); }
                },
                { data: "note" }
            ],
            order: [[0, "asc"]],
            language: Object.assign({}, DfDataTable.language, {
                emptyTable: "Belum ada mutasi. Pilih Parent di filter atas — data tampil otomatis.",
                zeroRecords: "Tidak ada mutasi yang cocok dengan pencarian."
            })
        });
        setTimeout(function () { DfDataTable.adjust(self.historyTable); }, 50);
    },

    exportHistoryCsv: function () {
        var rows = this._historyRows || [];
        if (!rows.length) {
            this.notify("warning", "Tidak ada mutasi untuk diunduh");
            return;
        }
        var self = this;
        var headers = ["Tanggal", "Jenis", "KodeKMMD", "Perubahan", "SaldoSetelah", "Keterangan", "ParentKode"];
        var lines = [headers.join(",")];
        rows.forEach(function (l) {
            var member = l.memberKode || l.childKode || l.businessKey || l.parentKode || "";
            lines.push([
                l.trxDate, self.typeLabel(l.type), member, l.delta, l.amountAfter, l.note || "", l.parentKode || ""
            ].map(ReportBudgetSubdist.csvEscape).join(","));
        });
        this.downloadCsv(lines.join("\n"), "laporan-budget-riwayat-" + this.todayStamp() + ".csv");
        this.notify("success", "CSV riwayat diunduh (" + rows.length + " baris)");
    },

    csvEscape: function (v) {
        var s = v == null ? "" : String(v);
        if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
        return s;
    },

    downloadCsv: function (content, filename) {
        var blob = new Blob(["\ufeff" + content], { type: "text/csv;charset=utf-8;" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    todayStamp: function () {
        return new Date().toISOString().slice(0, 10);
    }
};

window.ReportBudgetSubdist = ReportBudgetSubdist;

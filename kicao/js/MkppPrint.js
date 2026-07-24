/**
 * MKPP HTML print (mock RDLC)
 */
const MkppPrint = {
    fmtMoney: function (n) {
        const v = Number(n) || 0;
        return v.toLocaleString('id-ID');
    },

    escapeHtml: function (s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    },

    buildHtml: function (doc) {
        const e = this.escapeHtml.bind(this);
        const acts = (doc.activities || []).map((a, i) => {
            const sups = (a.suppliers || []).map(s =>
                '<li>' + e(s.accountSite) + ' — ' + e(s.accountName) + ' (' + e(s.kam) + ')</li>'
            ).join('') || '<li>—</li>';
            const bgts = (a.budgets || []).map(b => {
                const subs = (b.subbrands || []).map(sb =>
                    e(sb.subUmbrand) + ': ' + this.fmtMoney(sb.amount)
                ).join('; ') || '—';
                return '<li>' + e(b.department) + ' / COA ' + e(b.coa) +
                    ' · alokasi ' + this.fmtMoney(b.alokasi) +
                    ' · sub: ' + subs + '</li>';
            }).join('') || '<li>—</li>';
            return (
                '<tr><td>' + (i + 1) + '</td>' +
                '<td>' + e(a.code) + '<br><small>' + e(a.name) + '</small></td>' +
                '<td>' + e(a.periodFrom) + ' s/d ' + e(a.periodTo) + '</td>' +
                '<td class="num">' + this.fmtMoney(a.amount) + '</td>' +
                '<td class="num">' + this.fmtMoney(a.target) + '</td>' +
                '<td><ul class="tight">' + sups + '</ul></td>' +
                '<td><ul class="tight">' + bgts + '</ul></td></tr>'
            );
        }).join('');

        return (
            '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Print MKPP ' + e(doc.docNo) + '</title>' +
            '<style>' +
            'body{font-family:Arial,sans-serif;font-size:12px;color:#222;margin:24px;}' +
            'h1{font-size:18px;margin:0 0 4px;}h2{font-size:14px;margin:16px 0 8px;}' +
            '.meta{margin-bottom:16px;} .meta td{padding:2px 8px 2px 0;vertical-align:top;}' +
            'table.grid{border-collapse:collapse;width:100%;}' +
            'table.grid th,table.grid td{border:1px solid #999;padding:6px;vertical-align:top;}' +
            'table.grid th{background:#eee;text-align:left;}' +
            '.num{text-align:right;white-space:nowrap;}' +
            'ul.tight{margin:0;padding-left:16px;}' +
            '.footer{margin-top:24px;color:#666;font-size:11px;}' +
            '@media print{.no-print{display:none!important;}}' +
            '</style></head><body>' +
            '<div class="no-print" style="margin-bottom:12px;">' +
            '<button onclick="window.print()">Print / Save as PDF</button> ' +
            '<button onclick="window.close()">Close</button></div>' +
            '<h1>Master KPP (MKPP)</h1>' +
            '<div>Development Fund Prototype · KICAO KDS shell</div>' +
            '<table class="meta">' +
            '<tr><td><b>Doc No</b></td><td>' + e(doc.docNo) + '</td><td><b>Date</b></td><td>' + e(doc.date) + '</td></tr>' +
            '<tr><td><b>Status</b></td><td>' + e(doc.status) + '</td><td><b>Budget Type</b></td><td>' + e(doc.budgetType) + '</td></tr>' +
            '<tr><td><b>Group Account</b></td><td colspan="3">' + e(doc.groupAccount) + '</td></tr>' +
            '<tr><td><b>Parent</b></td><td>' + e(doc.refDocNo || '—') + '</td><td><b>ONO</b></td><td>' + e(doc.onoDocNo || '—') + '</td></tr>' +
            '<tr><td><b>Posting Date</b></td><td colspan="3">' + e(doc.postingDate) + '</td></tr>' +
            '<tr><td><b>Program Desc</b></td><td colspan="3">' + e(doc.programDesc) + '</td></tr>' +
            '<tr><td><b>Mekanisme</b></td><td colspan="3">' + e(doc.mekanisme) + '</td></tr>' +
            '<tr><td><b>Remark</b></td><td colspan="3">' + e(doc.remark) + '</td></tr>' +
            '<tr><td><b>Total Amount</b></td><td colspan="3" class="num">' + this.fmtMoney(MkppStore.totalAmount(doc)) + '</td></tr>' +
            '<tr><td><b>BOSNET</b></td><td colspan="3">' + e(doc.bosnetStatus || '—') + ' · ' + e(doc.bosnetNote || '') + '</td></tr>' +
            '</table>' +
            '<h2>Activities</h2>' +
            '<table class="grid"><thead><tr>' +
            '<th>No</th><th>Activity</th><th>Period</th><th>Amount</th><th>Target</th><th>Supplier</th><th>Budget / Subbrand</th>' +
            '</tr></thead><tbody>' + (acts || '<tr><td colspan="7">Tidak ada activity</td></tr>') + '</tbody></table>' +
            '<div class="footer">Generated ' + e(new Date().toISOString()) + ' · mock print (bukan RDLC)</div>' +
            '</body></html>'
        );
    },

    open: function (doc) {
        if (!doc) {
            KicaoLayout.toast('Tidak ada dokumen untuk di-print.', 'Print');
            return;
        }
        const w = window.open('', '_blank');
        if (!w) {
            KicaoLayout.toast('Popup diblokir browser. Izinkan popup untuk print.', 'Print');
            return;
        }
        w.document.open();
        w.document.write(this.buildHtml(doc));
        w.document.close();
    }
};

window.MkppPrint = MkppPrint;

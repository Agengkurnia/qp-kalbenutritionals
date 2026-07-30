const { sendJson, loadLatestPayload, cors } = require('./_lib/store');

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }
  if (req.method !== 'GET') {
    return sendJson(res, 405, { ok: false, message: 'Method not allowed' });
  }
  try {
    const q = req.query || {};
    const url = new URL(req.url || '/', 'http://localhost');
    const branch = String(q.branch || url.searchParams.get('branch') || '').trim();
    const code = String(q.code || url.searchParams.get('code') || '').trim();
    const shipTo = String(q.shipTo || url.searchParams.get('shipTo') || '').trim();
    const limit = Math.min(Number(q.limit || url.searchParams.get('limit') || 8000) || 8000, 20000);

    const data = await loadLatestPayload();
    if (!data) {
      return sendJson(res, 404, { ok: false, message: 'Belum ada data. Klik Refresh dulu.' });
    }

    let rows = data.detail || [];
    // Filter utama = ShipTo (sama MAVEN). Branch/code diabaikan bila shipTo ada.
    if (shipTo) {
      const shipKey = shipTo.toUpperCase();
      rows = rows.filter((r) => String(r.shipToSiteUseId || '').trim().toUpperCase() === shipKey);
    } else {
      if (code) rows = rows.filter((r) => String(r.branchCode || '') === code);
      if (branch) rows = rows.filter((r) => String(r.branchName || '').toUpperCase() === branch.toUpperCase());
    }

    const totalMatched = rows.length;
    const detail = rows.slice(0, limit);
    return sendJson(res, 200, {
      ok: true,
      shipTo,
      branch,
      code,
      totalMatched,
      count: detail.length,
      detail
    });
  } catch (e) {
    return sendJson(res, 500, { ok: false, message: e.message || String(e) });
  }
};

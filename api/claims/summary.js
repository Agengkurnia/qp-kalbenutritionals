const {
  sendJson,
  loadLatestPayload,
  loadMeta,
  loadPreviousSummary,
  enrichSummaryWithPrevious,
  cors
} = require('./_lib/store');

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
    const data = await loadLatestPayload();
    if (!data) {
      return sendJson(res, 404, {
        ok: false,
        message: 'Belum ada data. Set env WebDAV + Blob, lalu panggil Refresh / cron.'
      });
    }
    const meta = (await loadMeta()) || {
      lastUpdated: null,
      sourceFile: data.sourceFile,
      fileDate: data.fileDate,
      rowCount: data.rowCount,
      branchCount: data.branchCount,
      grandTotalRp: data.grandTotalRp
    };
    const previousMeta = await loadPreviousSummary();
    return sendJson(res, 200, {
      ok: true,
      meta,
      previousMeta,
      rowCount: data.rowCount,
      branchCount: data.branchCount,
      grandTotals: data.grandTotals,
      grandTotalRp: data.grandTotalRp,
      sourceFile: data.sourceFile,
      summary: enrichSummaryWithPrevious(data.summary || [], previousMeta)
    });
  } catch (e) {
    return sendJson(res, 500, { ok: false, message: e.message || String(e) });
  }
};

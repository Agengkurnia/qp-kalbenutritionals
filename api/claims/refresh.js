const {
  sendJson,
  cors,
  refreshFromWebdav,
  assertRefreshAuthorized
} = require('./_lib/store');

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
  } catch {
    return {};
  }
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }
  // Vercel Cron = GET; UI Refresh = POST
  if (req.method !== 'GET' && req.method !== 'POST') {
    return sendJson(res, 405, { ok: false, message: 'Method not allowed' });
  }

  try {
    assertRefreshAuthorized(req);
    const body = req.method === 'POST' ? await readBody(req) : {};
    const q = req.query || {};
    const url = new URL(req.url || '/', 'http://localhost');
    const targetDate = String(body.targetDate || q.date || url.searchParams.get('date') || '').trim() || null;

    const result = await refreshFromWebdav(targetDate);
    return sendJson(res, 200, {
      ok: true,
      message: `Refresh OK · ${result.match} · ${result.payload.rowCount} baris`,
      meta: result.meta,
      sourceFile: result.match,
      rowCount: result.payload.rowCount,
      branchCount: result.payload.branchCount,
      grandTotalRp: result.payload.grandTotalRp
    });
  } catch (e) {
    const status = e.statusCode || 500;
    return sendJson(res, status, { ok: false, message: e.message || String(e) });
  }
};

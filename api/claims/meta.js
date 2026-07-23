const { sendJson, loadMeta, cors } = require('./_lib/store');

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
    const meta = await loadMeta();
    if (!meta) {
      return sendJson(res, 404, { ok: false, message: 'Belum ada data. Klik Refresh.' });
    }
    return sendJson(res, 200, { ok: true, meta });
  } catch (e) {
    return sendJson(res, 500, { ok: false, message: e.message || String(e) });
  }
};

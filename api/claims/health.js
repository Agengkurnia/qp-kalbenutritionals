const { sendJson, cors, hasBlobToken } = require('./_lib/store');

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }
  return sendJson(res, 200, {
    ok: true,
    service: 'claim-api-vercel',
    mode: 'webdav+blob',
    blobConfigured: hasBlobToken(),
    webdavConfigured: Boolean(
      process.env.CLAIM_WEBDAV_URL &&
      process.env.CLAIM_WEBDAV_USER &&
      process.env.CLAIM_WEBDAV_PASS
    )
  });
};

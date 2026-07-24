/**
 * Shared helpers for Claim EPM API (Vercel)
 * Blob store project ini = private → put/get harus access: 'private'
 */
const { put, get } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');

const AMOUNT_FIELDS = ['RP_LUMPSUM', 'RP_EDPH_PRIN', 'RP_PROMOSI', 'RP_EDHL', 'RP_BONUS'];
const BLOB_LATEST = 'claims/latest.json';
const BLOB_META = 'claims/meta.json';
const BLOB_PREVIOUS = 'claims/previous-summary.json';
const BLOB_ACCESS = (process.env.CLAIM_BLOB_ACCESS || 'private').toLowerCase() === 'public'
  ? 'public'
  : 'private';

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function sendJson(res, status, body) {
  cors(res);
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function toFloat(v) {
  if (v == null) return 0;
  const s = String(v).trim().replace(/,/g, '');
  if (!s || s === '-') return 0;
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

function extractDateFromName(name) {
  const m = String(name || '').match(/(\d{6})/);
  return m ? m[1] : null;
}

function parseCsvText(text) {
  const firstLine = text.split(/\r?\n/, 1)[0] || '';
  const delimiter = (firstLine.match(/~/g) || []).length > (firstLine.match(/,/g) || []).length ? '~' : ',';
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length);
  if (lines.length < 2) return [];

  const headers = lines[0].split(delimiter).map((h) => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(delimiter);
    const row = {};
    headers.forEach((h, idx) => {
      if (!h) return;
      const raw = cols[idx];
      row[h] = typeof raw === 'string' ? raw.trim() : (raw || '');
    });
    if (!Object.keys(row).length) continue;
    const amounts = {};
    for (const k of AMOUNT_FIELDS) amounts[k] = toFloat(row[k]);
    row._amounts = amounts;
    row._totalRp = AMOUNT_FIELDS.reduce((s, k) => s + amounts[k], 0);
    rows.push(row);
  }
  return rows;
}

function parseTrxDate(raw) {
  const s = String(raw || '').trim();
  if (!s) return null;
  // 16-JUL-26
  const m = s.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{2,4})$/);
  if (m) {
    const months = { JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11 };
    const mon = months[m[2].toUpperCase()];
    if (mon == null) return null;
    let y = Number(m[3]);
    if (y < 100) y += 2000;
    const d = new Date(y, mon, Number(m[1]));
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatTrxDate(d) {
  if (!d) return '';
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const dd = String(d.getDate()).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}-${months[d.getMonth()]}-${yy}`;
}

function buildPayload(rows, sourceFile) {
  const byBranch = new Map();
  for (const r of rows) {
    const branch = String(r.BRANCH || '').trim() || 'UNKNOWN';
    const code = String(r.BRANCH_SPC_CODE || '').trim();
    const key = `${code}|${branch}`;
    if (!byBranch.has(key)) {
      byBranch.set(key, {
        key,
        branchCode: code,
        branchName: branch,
        trxCount: 0,
        totals: Object.fromEntries(AMOUNT_FIELDS.map((k) => [k, 0])),
        totalRp: 0,
        _minDate: null,
        _maxDate: null
      });
    }
    const b = byBranch.get(key);
    b.trxCount += 1;
    for (const k of AMOUNT_FIELDS) b.totals[k] += r._amounts[k];
    b.totalRp += r._totalRp;
    const d = parseTrxDate(r.TRX_DATE);
    if (d) {
      if (!b._minDate || d < b._minDate) b._minDate = d;
      if (!b._maxDate || d > b._maxDate) b._maxDate = d;
    }
  }

  const summary = [...byBranch.values()].sort((a, b) => b.totalRp - a.totalRp || a.branchName.localeCompare(b.branchName));
  for (const s of summary) {
    for (const k of AMOUNT_FIELDS) s.totals[k] = Math.round(s.totals[k] * 100) / 100;
    s.totalRp = Math.round(s.totalRp * 100) / 100;
    const minD = s._minDate;
    const maxD = s._maxDate;
    delete s._minDate;
    delete s._maxDate;
    s.trxDateMin = formatTrxDate(minD);
    s.trxDateMax = formatTrxDate(maxD);
    if (minD && maxD && minD.getTime() !== maxD.getTime()) {
      s.trxDateLabel = `${s.trxDateMin} s/d ${s.trxDateMax}`;
    } else {
      s.trxDateLabel = s.trxDateMax || s.trxDateMin || '—';
    }
  }

  const detail = rows.map((r) => ({
    branchCode: String(r.BRANCH_SPC_CODE || '').trim(),
    branchName: String(r.BRANCH || '').trim(),
    custNumber: r.CUST_NUMBER || '',
    custName: r.CUST_NAME || '',
    trxNumber: r.TRX_NUMBER || '',
    trxDate: r.TRX_DATE || '',
    itemCode: r.ITEM_CODE || '',
    itemName: r.ITEM_NAME || '',
    suratReferensi: r.SURAT_REFERENSI || '',
    amounts: Object.fromEntries(AMOUNT_FIELDS.map((k) => [k, Math.round(r._amounts[k] * 100) / 100])),
    totalRp: Math.round(r._totalRp * 100) / 100
  }));

  const grand = Object.fromEntries(
    AMOUNT_FIELDS.map((k) => [k, Math.round(summary.reduce((s, row) => s + row.totals[k], 0) * 100) / 100])
  );

  return {
    sourceFile,
    fileDate: extractDateFromName(sourceFile),
    rowCount: rows.length,
    branchCount: summary.length,
    grandTotals: grand,
    grandTotalRp: Math.round(Object.values(grand).reduce((a, b) => a + b, 0) * 100) / 100,
    summary,
    detail
  };
}

function localLatestPath() {
  return path.join(process.cwd(), 'Data', 'claims', 'latest.json');
}

function localMetaPath() {
  return path.join(process.cwd(), 'Data', 'claims', 'meta.json');
}

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function streamToString(stream) {
  if (!stream) return '';
  if (typeof stream.getReader === 'function') {
    const reader = stream.getReader();
    const chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(Buffer.from(value));
    }
    return Buffer.concat(chunks).toString('utf8');
  }
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function loadJsonFromBlob(pathname) {
  if (!hasBlobToken()) return null;
  try {
    const result = await get(pathname, { access: BLOB_ACCESS });
    if (!result || result.statusCode !== 200 || !result.stream) return null;
    const text = await streamToString(result.stream);
    if (!text) return null;
    return JSON.parse(text);
  } catch (e) {
    // Belum ada file / pathname not found → fallback lokal
    return null;
  }
}

async function putJsonBlob(pathname, data) {
  await put(pathname, JSON.stringify(data), {
    access: BLOB_ACCESS,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json'
  });
}

async function loadLatestPayload() {
  const fromBlob = await loadJsonFromBlob(BLOB_LATEST);
  if (fromBlob) return fromBlob;
  const p = localLatestPath();
  if (fs.existsSync(p)) {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  }
  return null;
}

async function loadMeta() {
  const fromBlob = await loadJsonFromBlob(BLOB_META);
  if (fromBlob) return fromBlob;
  const p = localMetaPath();
  if (fs.existsSync(p)) {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  }
  return null;
}

function localPreviousPath() {
  return path.join(process.cwd(), 'Data', 'claims', 'previous-summary.json');
}

function summaryBranchKey(s) {
  return `${String(s.branchCode || '').trim()}|${String(s.branchName || '').trim()}`;
}

function snapshotFromPayload(payload) {
  const byKey = {};
  for (const s of payload.summary || []) {
    byKey[summaryBranchKey(s)] = Number(s.totalRp) || 0;
  }
  return {
    sourceFile: payload.sourceFile,
    fileDate: payload.fileDate,
    lastUpdated: new Date().toISOString(),
    byKey
  };
}

function enrichSummaryWithPrevious(summary, previous) {
  const byKey = (previous && previous.byKey) || {};
  return (summary || []).map((s) => {
    const key = summaryBranchKey(s);
    const row = Object.assign({}, s);
    if (!(key in byKey)) {
      row.previousTotalRp = null;
      row.selisihRp = null;
      row.previousSourceFile = previous ? previous.sourceFile : null;
      return row;
    }
    const prevAmt = Number(byKey[key]) || 0;
    const cur = Number(s.totalRp) || 0;
    row.previousTotalRp = Math.round(prevAmt * 100) / 100;
    row.selisihRp = Math.round((cur - prevAmt) * 100) / 100;
    row.previousSourceFile = previous ? previous.sourceFile : null;
    return row;
  });
}

async function loadPreviousSummary() {
  const fromBlob = await loadJsonFromBlob(BLOB_PREVIOUS);
  if (fromBlob) return fromBlob;
  const p = localPreviousPath();
  if (fs.existsSync(p)) {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  }
  return null;
}

async function savePayload(payload) {
  const meta = {
    lastUpdated: new Date().toISOString(),
    sourceFile: payload.sourceFile,
    fileDate: payload.fileDate,
    rowCount: payload.rowCount,
    branchCount: payload.branchCount,
    grandTotalRp: payload.grandTotalRp
  };

  if (!hasBlobToken()) {
    throw new Error('BLOB_READ_WRITE_TOKEN belum di-set di Vercel. Refresh production butuh Vercel Blob.');
  }

  // Rotasi: latest lama → previous
  const existing = await loadLatestPayload();
  if (existing && existing.summary && existing.summary.length) {
    await putJsonBlob(BLOB_PREVIOUS, snapshotFromPayload(existing));
  }

  await putJsonBlob(BLOB_LATEST, payload);
  await putJsonBlob(BLOB_META, meta);
  return meta;
}

function getWebdavConfig() {
  const url = (process.env.CLAIM_WEBDAV_URL || '').trim();
  const user = (process.env.CLAIM_WEBDAV_USER || '').trim();
  const pass = (process.env.CLAIM_WEBDAV_PASS || '').trim();
  if (!url || !user || !pass) {
    throw new Error('Env CLAIM_WEBDAV_URL / CLAIM_WEBDAV_USER / CLAIM_WEBDAV_PASS belum lengkap.');
  }
  const base = url.startsWith('http') ? url : `https://${url}`;
  return { base: base.replace(/\/$/, ''), user, pass };
}

function basicAuthHeader(user, pass) {
  return 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64');
}

async function listWebdavFiles(folderUrl, user, pass) {
  // Internal Nextcloud may use self-signed / odd certs
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const res = await fetch(folderUrl, {
    method: 'PROPFIND',
    headers: {
      Authorization: basicAuthHeader(user, pass),
      Depth: '1'
    }
  });
  if (!res.ok) {
    throw new Error(`WebDAV PROPFIND gagal: HTTP ${res.status}`);
  }
  const xml = await res.text();
  const files = [];
  const re = /<d:href[^>]*>([^<]+)<\/d:href>/gi;
  let m;
  while ((m = re.exec(xml))) {
    const href = decodeURIComponent(m[1]);
    const name = href.split('/').filter(Boolean).pop();
    if (name) files.push(name);
  }
  return files;
}

function findBestMatch(files, targetDate) {
  const patterns = [
    `LISTING_CLAIM_ ${targetDate}.csv`,
    `LISTING_CLAIM_${targetDate}.csv`,
    `LISTING_CLAIM ${targetDate}.csv`
  ];
  for (const p of patterns) {
    if (files.includes(p)) return p;
  }
  for (const f of files) {
    if (f.includes(targetDate) && f.toLowerCase().endsWith('.csv')) return f;
  }
  // fallback: latest LISTING_CLAIM*.csv by name sort
  const claims = files.filter((f) => /LISTING_CLAIM/i.test(f) && f.toLowerCase().endsWith('.csv'));
  if (!claims.length) return null;
  claims.sort();
  return claims[claims.length - 1];
}

async function downloadWebdavFile(fileUrl, user, pass) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const res = await fetch(fileUrl, {
    method: 'GET',
    headers: { Authorization: basicAuthHeader(user, pass) }
  });
  if (!res.ok) throw new Error(`WebDAV download gagal: HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

function yymmddTodayJakarta() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());
  const y = parts.find((p) => p.type === 'year').value.slice(-2);
  const m = parts.find((p) => p.type === 'month').value;
  const d = parts.find((p) => p.type === 'day').value;
  return `${y}${m}${d}`;
}

async function refreshFromWebdav(targetDate) {
  const { base, user, pass } = getWebdavConfig();
  const date = targetDate || yymmddTodayJakarta();
  const folderUrl = `${base}/remote.php/dav/files/${encodeURIComponent(user)}/shp/`;
  const files = await listWebdavFiles(folderUrl, user, pass);
  const match = findBestMatch(files, date);
  if (!match) {
    throw new Error(`Tidak ada LISTING_CLAIM untuk ${date}. File remote: ${files.slice(-5).join(', ') || '(kosong)'}`);
  }
  const fileUrl = `${folderUrl}${encodeURIComponent(match)}`;
  const buf = await downloadWebdavFile(fileUrl, user, pass);
  const text = buf.toString('utf8');
  const rows = parseCsvText(text);
  if (!rows.length) throw new Error(`CSV kosong / gagal parse: ${match}`);
  const payload = buildPayload(rows, match);
  const meta = await savePayload(payload);
  return { payload, meta, match, date };
}

function assertRefreshAuthorized(req) {
  const secret = process.env.CRON_SECRET || process.env.CLAIM_REFRESH_SECRET;
  if (!secret) return; // open for prototype; set secret in production
  const auth = req.headers.authorization || '';
  if (auth === `Bearer ${secret}`) return;
  const err = new Error('Unauthorized refresh');
  err.statusCode = 401;
  throw err;
}

module.exports = {
  AMOUNT_FIELDS,
  cors,
  sendJson,
  loadLatestPayload,
  loadMeta,
  loadPreviousSummary,
  enrichSummaryWithPrevious,
  refreshFromWebdav,
  assertRefreshAuthorized,
  hasBlobToken
};

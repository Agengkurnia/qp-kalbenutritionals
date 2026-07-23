# Claim ingest (Automate EPM + Claim API)

## Folder
- `tools/automate-claim-epm/` — download dari aries (WebDAV) via `download_claim.py` / `.exe` (**local only**)
- `tools/claim-api/` — sidecar API lokal untuk Refresh + extract CSV → JSON
- `api/claims/` — Vercel serverless (WebDAV + Blob), pengganti exe di cloud
- `Data/claims/` — fallback `latest.json` + `meta.json` (baca jika Blob masih kosong)

---

## Local

```bat
tools\claim-api\start-claim-api.bat
```

Base URL: `http://127.0.0.1:5055`

UI Local / Live Server → otomatis pakai sidecar `:5055`.

---

## Vercel (tanpa .exe)

Logika yang sama dengan `download_claim.py`: list WebDAV → download CSV → parse → simpan ke **Vercel Blob**.

### 1. Env di Vercel Project Settings

| Env | Contoh / keterangan |
|-----|---------------------|
| `CLAIM_WEBDAV_URL` | `aries.enseval.com` atau full `https://aries.enseval.com` |
| `CLAIM_WEBDAV_USER` | user WebDAV |
| `CLAIM_WEBDAV_PASS` | password WebDAV |
| `BLOB_READ_WRITE_TOKEN` | dari Vercel Storage → Blob |
| `CRON_SECRET` | (opsional) proteksi Refresh/Cron |
| `CLAIM_REFRESH_SECRET` | (opsional) sama, alias |

Jangan commit `login.txt` / password ke repo.

### 2. Deploy

```bat
npm install
vercel
```

### 3. Endpoint (sama dengan local)

- `GET /api/claims/health`
- `GET /api/claims/meta`
- `GET /api/claims/summary`
- `GET /api/claims/detail?branch=...&code=...`
- `POST /api/claims/refresh` — download WebDAV + simpan Blob  
- `GET /api/claims/refresh` — dipakai **Vercel Cron** harian `01:00 UTC`

UI di domain Vercel → otomatis pakai `/api/claims/*`. Tombol **Refresh** tetap ada.

### Catatan
- Butuh **Vercel Pro** (atau plan dengan `maxDuration` ≥ 60s) agar download+parse CSV besar (~6MB / 28k baris) tidak timeout. Hobby (~10s) sering kurang.
- Cron di `vercel.json`: setiap hari ambil file claim terbaru.

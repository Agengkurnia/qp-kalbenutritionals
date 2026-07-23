# Claim ingest (Automate EPM + Claim API)

## Folder
- `tools/automate-claim-epm/` — download dari aries (WebDAV) via `download_claim.py` / `.exe`
- `tools/claim-api/` — sidecar API lokal untuk Refresh + extract CSV → JSON
- `data/claims/` — `latest.json` + `meta.json` (Last update)

## Jalankan API
```bat
tools\claim-api\start-claim-api.bat
```
atau:
```bat
cd tools\claim-api
python server.py
```

Base URL: `http://127.0.0.1:5055`

## Endpoint
- `GET /api/health`
- `GET /api/claims/meta`
- `GET /api/claims/summary`
- `GET /api/claims/detail?branch=...&code=...`
- `POST /api/claims/refresh` — download (opsional) + extract CSV terbaru
- `POST /api/claims/extract` — extract saja tanpa download

## UI
Transaction → **Monitoring SubDist**  
Butuh Claim API jalan agar tombol **Refresh** bekerja.

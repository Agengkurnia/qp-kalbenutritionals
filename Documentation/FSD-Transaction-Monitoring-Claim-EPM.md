# Functional Specification Document (FSD)
## Transaction — Monitoring Claim EPM (Monitoring SubDist)

| | |
|---|---|
| **Dokumen** | FSD Transaction — Monitoring Claim EPM |
| **Produk** | Development Fund Subdist — Kalbe Nutritionals (SHP) |
| **Modul UI** | Transaction → Monitoring SubDist / Monitoring Claim EPM |
| **Versi** | 0.3 (draft dari prototype) |
| **Tanggal** | 24 Juli 2026 |
| **Sumber** | Prototype `QP Kalbe Nutritionals` + `business-documentation.md` + `FSD-Inject-Delta-BI.md` |
| **Status** | Draft untuk kepentingan penyusunan FSD formal |

> Halaman ini **memantau realisasi LISTING_CLAIM dari EPM** per SubDist yang sudah ter-mapping.  
> **Refresh = fetch file saja** — tidak meng-apply / inject saldo DF ke BI dari layar ini.

---

## 1. Tujuan

1. Menampilkan agregat nilai claim/listing EPM per Branch / SubDist yang sudah di-mapping di Master Mapping Subdist.
2. Menyediakan drill-down ke detail transaksi CSV.
3. Menampilkan **perbandingan file harian** (Total vs file exec sebelumnya vs Selisih) sebagai dasar pantauan delta.
4. Menyediakan **Refresh** untuk mengambil file LISTING_CLAIM terbaru (local / cloud).

---

## 1.1 Narasi modul (bahasa awam)

Bayangkan EPM setiap hari mengeluarkan “laporan listing claim” (CSV). Modul Monitoring Claim EPM menampilkan ringkasan per SubDist setelah dicocokkan dengan Master Mapping Subdist.

Pertanyaan yang dijawab:

- SubDist mana yang cocok mapping di file hari ini, dan berapa totalnya?
- Dibanding file sebelumnya, naik/turun berapa?
- Detail transaksi / breakdown jenis / child mapping seperti apa?

### Apa yang dilakukan user di sini?

1. Membuka halaman → KPI + tabel ringkasan (mapped only).
2. Membandingkan Total / Sebelumnya / Selisih (file vs file).
3. Klik **Detail** untuk transaksi / breakdown jenis / daftar child mapping.
4. Klik **Refresh** → sistem fetch file terbaru dan memperbarui grid.

### Apa yang *bukan* dikerjakan di modul ini?

- **Bukan** tempat input klaim Subdist (KICAO KDS).
- **Bukan** tempat inject / potong saldo DF ke BI (itu lewat Master add/lepas + proses inject terpisah).
- Cron/harian = fetch only.

### Analogi singkat

Kalau saldo DF di BI seperti **buku rekening**, modul ini seperti **cek mutasi/rekap dari bank pihak EPM** — pantauan angka file, bukan otorisasi setor/tarik ke rekening DF.

---

## 2. Ruang Lingkup

### 2.1 In scope (prototype)

| Fitur | Keterangan |
|-------|------------|
| Ringkasan per SubDist (mapped only) | Agregat Lumpsum, EDPH, Promosi, EDHL, Total |
| KPI Total / Mapped / Belum mapping | Belum mapping dihitung, tidak ditampilkan di tabel |
| Filter cari | Nama Subdist / Branch EPM / Kode Branch |
| Detail transaksi | Drill-down + tab jenis + child mapping |
| Last update (WIB) | Timestamp extract terakhir |
| Refresh — Fetch | Download + extract CSV |
| Sebelumnya & Selisih (UI grid) | File vs file exec sebelumnya |
| Dual runtime | Local Claim API + Vercel API (WebDAV + Blob) |

### 2.2 Out of scope

| Item | Keterangan |
|------|------------|
| Apply / inject delta ke BI dari Monitoring | Dihapus dari UI; mutasi mock lewat Master |
| API BI / KICAO production | |
| Split uang DF per child dari CSV | Grain file branch-level |
| Report Saldo DF production | Sumber BI nyata |
| Memo QP | Modul transaction terpisah |
| Menampilkan branch **belum mapping** di tabel | Hanya di KPI count |

---

## 3. Aktor

| Aktor | Kebutuhan utama |
|-------|-----------------|
| **CCD / FA** | Pantau selisih file harian; trigger Refresh fetch |
| **CSD / RAS** | Lihat branch belum mapping (KPI); perbaiki master |
| **ABM / operasional** | Drill-down detail bila perlu klarifikasi |

*Prototype: semua role yang login bisa buka halaman & Refresh.*

---

## 4. Navigasi & halaman

| Item | Nilai |
|------|--------|
| Menu | Transaction → **Monitoring SubDist** |
| Judul halaman | **Monitoring Claim EPM** |
| Path | `transactions/monitoring-subdist.html` |

---

## 5. Use case

### UC-TRX-MON-01 — Lihat ringkasan Claim EPM

**Prekondisi:** Claim API (local) atau API Vercel tersedia; data `latest` sudah pernah di-extract (atau user Refresh).

**Alur:**
1. User membuka menu Monitoring SubDist.
2. Sistem memanggil `GET /api/claims/summary`.
3. Sistem meng-enrich baris summary dengan Master Mapping Subdist (Parent).
4. Baris **belum mapping** disembunyikan dari tabel; dihitung di KPI **Belum Mapping**.
5. Sistem menampilkan KPI, Last update, dan tabel ringkasan.

---

### UC-TRX-MON-02 — Refresh / ambil data hari ini

**Alur (local):**
1. User klik **Refresh**.
2. UI memanggil `POST /api/claims/refresh` ke sidecar `127.0.0.1:5055`.
3. Sidecar download + extract → `latest.json`; rotasi `previous-summary.json`.
4. UI reload summary + last update.

**Alur (Vercel):** sama via `/api/claims/refresh` + Blob. Cron = fetch only.

**Aturan Fetch:**
- Nama file `LISTING_CLAIM_ yyMMdd.csv` = tanggal file/generate.
- Modul ini **tidak** membuka wizard apply / tidak mengubah saldo BI.
- Mutasi DF mock (historis / koreksi) dikelola di **Master Mapping Subdist**.

---

### UC-TRX-MON-03 — Drill-down detail

**Alur:**
1. User klik **Detail** pada baris summary.
2. Sistem memanggil `GET /api/claims/detail?branch=...&code=...`.
3. Header: Nama Subdist, hint Kode Branch · Branch EPM · N transaksi.
4. KPI detail: Total / Sebelumnya / Selisih + kalimat ringkas.
5. Tab: Transaksi | Per jenis (Rp) | Child mapping.
6. **Kembali ke ringkasan** memulihkan KPI summary.

---

## 6. Antarmuka (spesifikasi layar)

### 6.1 Header

| Elemen | Spesifikasi |
|--------|-------------|
| Breadcrumb | Transaction / Monitoring Claim EPM |
| Last update | Format: `Last update: 23 Juli 2026, 17:17 WIB` |
| Status API | Hanya tampil jika **error** |
| Tombol Refresh | Memicu ingest/fetch file terbaru |

### 6.2 KPI (summary mode)

| KPI | Isi |
|-----|-----|
| **Total (Rp)** | Sum `totalRp` hanya baris **mapped** |
| **SubDist Ter-mapping** | Jumlah baris summary yang cocok master |
| **Belum Mapping** | Jumlah branch di file yang tidak cocok master |

### 6.3 KPI (detail mode)

| KPI | Isi |
|-----|-----|
| Total (Rp) | Total file SubDist ini |
| Sebelumnya (Rp) | File exec sebelumnya |
| Selisih (Rp) | Total − Sebelumnya |

### 6.4 Tabel ringkasan

| Kolom | Keterangan |
|-------|------------|
| Aksi | Tombol Detail |
| Nama Subdist | Dari Mapping Subdist (Parent) |
| Branch EPM / Kode Branch | Dari CSV |
| Lumpsum / EDPH / Promosi / EDHL | Agregat komponen |
| **Total (Rp)** | File terkini |
| **Sebelumnya (Rp)** | File exec sebelumnya |
| **Selisih (Rp)** | `Total − Sebelumnya` |

### 6.5 (dihapus) Wizard Apply

*Versi 0.2 memiliki wizard apply mock BI di Monitoring. Di v0.3 fitur ini dihapus; mutasi mock lewat Master.*

---

## 7. Aturan bisnis (BR)

| ID | Aturan |
|----|--------|
| BR-MON-01 | Tabel ringkasan **hanya** menampilkan branch yang ter-mapping ke Parent Mapping Subdist. |
| BR-MON-02 | Matching mapping: `kodeBranch` **atau** `branchEpm` (case-insensitive nama) ke Parent (`parent = YA`). |
| BR-MON-03 | Branch belum mapping dihitung di KPI, **tidak** ditampilkan di grid. |
| BR-MON-04 | File harian = **snapshot**; kolom Sebelumnya = rotasi extract sebelumnya. |
| BR-MON-05 | `Selisih UI = Total(file kini) − Total(file exec sebelumnya)` per kunci branch. |
| BR-MON-06 | Extract pertama: Sebelumnya & Selisih = `—`. |
| BR-MON-07 | Fetch menggeser `latest` → `previous`, lalu menulis `latest` baru. |
| BR-MON-08 | Modul ini **tidak** meng-inject BI; Selisih bersifat informasi pantauan. |
| BR-MON-09 | Last update ditampilkan dalam zona waktu **WIB**. |
| BR-MON-10 | Cron / GET refresh = **fetch only**. |

---

## 8. Sumber data & agregasi

### 8.1 File sumber

- Pola nama: `LISTING_CLAIM_ yyMMdd.csv`.
- Delimiter tipikal: `~`.
- Local: `tools/automate-claim-epm/file/`.
- Remote: WebDAV `/shp/` (aries).

### 8.2 Field amount

| Field CSV | Kolom UI |
|-----------|----------|
| `RP_LUMPSUM` | Lumpsum (Rp) |
| `RP_EDPH_PRIN` | EDPH (Rp) |
| `RP_PROMOSI` | Promosi (Rp) |
| `RP_EDHL` | EDHL (Rp) |

Kunci summary: `BRANCH_SPC_CODE` + `BRANCH`.

### 8.3 Artefak setelah extract

| Artefak | Local | Vercel |
|---------|-------|--------|
| Latest payload | `Data/claims/latest.json` | Blob `claims/latest.json` |
| Meta | `Data/claims/meta.json` | Blob `claims/meta.json` |
| Previous summary | `Data/claims/previous-summary.json` | Blob `claims/previous-summary.json` |

### 8.4 Catatan BI

Inject / koreksi saldo DF **tidak** dijalankan dari halaman Monitoring.  
Prototype mutasi mock: lihat Master Mapping + `Documentation/FSD-Inject-Delta-BI.md`.

---

## 9. API (kontrak prototype)

Base URL:

- Local: `http://127.0.0.1:5055`
- Vercel: same-origin `/api/...`

| Method | Path | Fungsi |
|--------|------|--------|
| GET | `/api/health` atau `/api/claims/health` | Health check |
| GET | `/api/claims/meta` | Meta last update |
| GET | `/api/claims/summary` | Summary + previous/selisih |
| GET | `/api/claims/detail?branch=&code=&limit=` | Detail transaksi |
| POST | `/api/claims/refresh` | Download + extract (+ rotasi previous) — **fetch only** |
| GET | `/api/claims/refresh` | Cron Vercel — **fetch only** |
| POST | `/api/claims/extract` | Extract tanpa download (local) |

---

## 10. Arsitektur runtime

```
┌─────────────────────┐
│  Monitoring UI      │
│  Fetch → Wizard     │
│  → MockBiLedger     │
└─────────┬───────────┘
          │
   ┌──────┴──────┐
Local         Vercel
:5055         /api/claims/*
   │             │
CSV / Blob   latest + previous-summary
```

---

## 11. Env & operasional (Vercel)

| Env | Wajib | Keterangan |
|-----|-------|------------|
| `CLAIM_WEBDAV_*` | Ya (Refresh) | WebDAV |
| `BLOB_READ_WRITE_TOKEN` | Ya (persist) | Vercel Blob |
| `CRON_SECRET` | Opsional | Proteksi Cron |

Cron: `GET /api/claims/refresh` = fetch only.  
Local: `tools/claim-api/start-claim-api.bat`.

---

## 12. Hubungan dengan Inject DF

| Monitoring | Master / Inject mock |
|------------|----------------------|
| File vs file (Sebelumnya / Selisih) | Add historis CSV + lepas koreksi per bulan |
| Informasi pantauan | Mutasi ke `MockBiLedger` |
| Tidak mengubah saldo | Mengubah saldo mock |

Detail: `Documentation/FSD-Inject-Delta-BI.md`.

---

## 13. Non-functional (prototype)

| Aspek | Catatan |
|-------|---------|
| Performa | `latest.json` ~10MB; detail di-limit |
| Keamanan | Credential WebDAV di env |
| Audit | Meta extract (`lastUpdated`, `sourceFile`) |
| UX grid | DataTables (`DfDataTable`) |

---

## 14. Open points FSD formal

| No | Pertanyaan |
|----|------------|
| 1 | Setelah BI live: apakah kolom Selisih UI diganti “vs injected”? |
| 2 | Grain matching SubDist: nama Branch vs kode EPM wajib? |
| 3 | Branch unmapped: tab/export tersendiri? |
| 4 | SLA job download jika `TRX_DATE` tertinggal dari nama file |

---

## 15. Lampiran — File prototype

| Area | Path |
|------|------|
| Halaman | `transactions/monitoring-subdist.html` |
| Logic UI | `js/transactions/MonitoringSubdist.js` |
| Claim API local | `tools/claim-api/server.py` |
| API Vercel | `api/claims/*.js` |
| Design delta | `Documentation/inject-delta-breakdown.md` |
| FSD Inject | `Documentation/FSD-Inject-Delta-BI.md` |

---

## 16. Riwayat dokumen

| Versi | Tanggal | Perubahan |
|-------|---------|-----------|
| 0.1 | 24 Jul 2026 | Draft awal FSD Monitoring Claim EPM dari prototype |
| 0.2 | 24 Jul 2026 | Fetch vs Apply; daily lock; wizard group/child; mines; mock BI |
| 0.3 | 24 Jul 2026 | Hapus apply wizard; Refresh fetch-only; inject lewat Master |

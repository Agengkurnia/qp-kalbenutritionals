# Functional Specification Document (FSD)
## Transaction — Monitoring Claim EPM (Monitoring SubDist)

| | |
|---|---|
| **Dokumen** | FSD Transaction — Monitoring Claim EPM |
| **Produk** | Development Fund Subdist — Kalbe Nutritionals (SHP) |
| **Modul UI** | Transaction → Monitoring SubDist / Monitoring Claim EPM |
| **Versi** | 0.1 (draft dari prototype) |
| **Tanggal** | 24 Juli 2026 |
| **Sumber** | Prototype `QP Kalbe Nutritionals` + `business-documentation.md` + `inject-delta-breakdown.md` |
| **Status** | Draft untuk kepentingan penyusunan FSD formal |

> Halaman ini **memantau realisasi LISTING_CLAIM dari EPM** per SubDist yang sudah ter-mapping.  
> Ini **bukan** dashboard saldo Development Fund di BI, dan **belum** melakukan inject ke BI.

---

## 1. Tujuan

1. Menampilkan agregat nilai claim/listing EPM per Branch / SubDist yang sudah di-mapping di Master Mapping Subdist.
2. Menyediakan drill-down ke detail transaksi CSV.
3. Menampilkan **perbandingan file harian** (Total vs file exec sebelumnya vs Selisih) sebagai dasar pantauan delta.
4. Menyediakan mekanisme **Refresh** untuk mengambil file LISTING_CLAIM terbaru (local / cloud).

---

## 1.1 Narasi modul (bahasa awam)

Bayangkan EPM setiap hari (atau berkala) mengeluarkan “laporan listing claim” dalam bentuk file Excel/CSV. Isinya banyak baris transaksi: cabang mana, customer mana, item apa, dan berapa rupiahnya.

**Modul Monitoring Claim EPM** adalah layar untuk **melihat ringkasan file itu per SubDist**, setelah dicocokkan dengan master Mapping Subdist di MAVEN.

Secara sederhana, modul ini menjawab pertanyaan sehari-hari seperti:

- “SubDist mana saja yang sudah ketemu datanya di file EPM hari ini?”
- “Total rupiah listing claim-nya berapa per SubDist?”
- “Dibanding file kemarin / eksekusi sebelumnya, naik atau turun berapa?”
- “Kalau perlu dicek, transaksi detailnya seperti apa?”

### Apa yang dilakukan user di sini?

1. Membuka halaman → melihat **angka ringkas** (total Rp, berapa SubDist yang cocok mapping, berapa yang belum).
2. Melihat **tabel per SubDist** (hanya yang sudah di-mapping).
3. Membandingkan **Total hari ini** dengan **nilai file sebelumnya**, plus **Selisih**-nya (hijau naik, merah turun).
4. Klik **Detail** bila ingin melihat transaksi satu per satu.
5. Klik **Refresh** bila ingin menarik file listing claim terbaru dari sumber EPM.

### Apa yang *bukan* dikerjakan di modul ini?

- **Bukan** tempat input klaim Subdist (itu di KICAO KDS).
- **Bukan** tempat melihat “rekening” saldo Development Fund yang sudah masuk/keluar di BI.
- **Bukan** proses yang otomatis mengisi / memotong budget di BI (inject DF adalah proses terpisah; layar ini baru **memantau** data EPM dan selisih antar file).

### Analogi singkat

Kalau saldo DF di BI seperti **buku rekening**, maka modul ini lebih seperti **cek mutasi/rekap dari bank pihak EPM (file listing claim)** — supaya CCD/FA/CSD bisa melihat angka dari EPM sudah selaras dengan SubDist mana saja, dan apakah angkanya berubah dibanding file sebelumnya.

---

## 2. Ruang Lingkup

### 2.1 In scope (prototype)

| Fitur | Keterangan |
|-------|------------|
| Ringkasan per SubDist (mapped only) | Agregat Lumpsum, EDPH, Promosi, EDHL, Total |
| KPI Total / Mapped / Belum mapping | Belum mapping dihitung, tidak ditampilkan di tabel |
| Filter cari | Nama Subdist / Branch EPM / Kode Branch |
| Detail transaksi | Drill-down per branch |
| Last update (WIB) | Timestamp extract terakhir |
| Refresh data | Download + extract CSV |
| Sebelumnya & Selisih | File vs file exec sebelumnya |
| Dual runtime | Local Claim API + Vercel API (WebDAV + Blob) |

### 2.2 Out of scope

| Item | Keterangan |
|------|------------|
| Inject / potong saldo DF di **BI** | Design terpisah (`inject-delta-breakdown.md`) |
| Report Saldo DF (awal/masuk/keluar/akhir) | Sumber BI |
| Klaim Activity KICAO KDS | Sistem lain |
| Memo QP | Modul transaction terpisah |
| Menampilkan branch **belum mapping** di tabel | Sengaja disembunyikan; hanya di KPI count |

---

## 3. Aktor

| Aktor | Kebutuhan utama |
|-------|-----------------|
| **CCD / FA** | Pantau realisasi listing claim EPM per SubDist & selisih harian |
| **CSD / RAS** | Lihat berapa branch belum mapping (KPI) untuk perbaiki master |
| **ABM / operasional** | Drill-down detail bila perlu klarifikasi |

*Prototype belum membatasi role khusus di halaman ini (semua role yang login bisa buka & Refresh).*

---

## 4. Navigasi & halaman

| Item | Nilai |
|------|--------|
| Menu | Transaction → **Monitoring SubDist** |
| Judul halaman | **Monitoring Claim EPM** |
| Path | `transactions/monitoring-subdist.html` |
| Pertanyaan yang dijawab | *Berapa realisasi LISTING_CLAIM EPM per SubDist ter-mapping, dan berapa selisih vs file exec sebelumnya?* |

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
6. User dapat mencari lewat filter teks.

**Postkondisi:** User melihat hanya SubDist yang cocok mapping.

---

### UC-TRX-MON-02 — Refresh / ambil data hari ini

**Alur (local):**
1. User klik **Refresh**.
2. UI memanggil `POST /api/claims/refresh` ke sidecar `127.0.0.1:5055`.
3. Sidecar menjalankan `download_claim.py` / `.exe` (WebDAV Nextcloud/aries).
4. Sidecar extract CSV terbaru → `latest.json`; merotasi summary lama ke `previous-summary.json`.
5. UI reload summary + last update.

**Alur (Vercel):**
1. User klik **Refresh** (atau Cron harian).
2. `POST/GET /api/claims/refresh` download WebDAV memakai env, parse CSV, simpan ke **Vercel Blob** (`claims/latest.json`, `claims/previous-summary.json`, `claims/meta.json`).
3. UI reload summary.

**Aturan:**
- Nama file `LISTING_CLAIM_ yyMMdd.csv` = tanggal **file/generate**, bukan otomatis rentang `TRX_DATE` di dalamnya.
- Jika API down → tampil error minimalis (bukan status OK panjang di header).

---

### UC-TRX-MON-03 — Drill-down detail

**Alur:**
1. User klik **Detail** pada baris summary.
2. Sistem memanggil `GET /api/claims/detail?branch=...&code=...`.
3. Header menampilkan **Nama Subdist** (mapping), hint: Kode Branch · Branch EPM · N transaksi.
4. KPI beralih konteks detail: Total (Rp) SubDist Ini, Transaksi, Customer.
5. User klik **Kembali ke ringkasan** → KPI & view summary dipulihkan.

**Kolom detail:** Tgl Trx, No Trx, Cust No, Cust Name, Item, Nama Item, Surat Referensi, Total (Rp).

---

## 6. Antarmuka (spesifikasi layar)

### 6.1 Header

| Elemen | Spesifikasi |
|--------|-------------|
| Breadcrumb | Transaction / Monitoring Claim EPM |
| Last update | Format: `Last update: 23 Juli 2026, 17:17 WIB` |
| Status API | Hanya tampil jika **error** |
| Tombol Refresh | Memicu ingest file terbaru |

### 6.2 KPI (summary mode)

| KPI | Isi |
|-----|-----|
| **Total (Rp)** | Sum `totalRp` hanya baris **mapped** |
| **SubDist Ter-mapping** | Jumlah baris summary yang cocok master |
| **Belum Mapping** | Jumlah branch di file yang tidak cocok master (tidak masuk tabel) |

### 6.3 KPI (detail mode)

| KPI | Isi |
|-----|-----|
| Total (Rp) SubDist Ini | Sum transaksi detail yang dimuat |
| Transaksi SubDist Ini | `totalMatched` |
| Customer | Jumlah `custNumber` unik pada detail yang tampil |

### 6.4 Tabel ringkasan

| Kolom | Keterangan |
|-------|------------|
| Aksi | Tombol Detail (paling kiri) |
| Nama Subdist | Dari Mapping Subdist (Parent) |
| Branch EPM | `BRANCH` CSV |
| Kode Branch | `BRANCH_SPC_CODE` CSV |
| Lumpsum (Rp) | Agregat `RP_LUMPSUM` |
| EDPH (Rp) | Agregat `RP_EDPH_PRIN` |
| Promosi (Rp) | Agregat `RP_PROMOSI` |
| EDHL (Rp) | Agregat `RP_EDHL` |
| **Total (Rp)** | Total file **hari ini / extract terkini** |
| **Sebelumnya (Rp)** | Total file **exec sebelumnya** (snapshot) |
| **Selisih (Rp)** | `Total − Sebelumnya`; hijau (+), merah (−), abu (0 / kosong) |

Default sort: Total (Rp) descending.  
Filter: search client-side (DataTables).

---

## 7. Aturan bisnis (BR)

| ID | Aturan |
|----|--------|
| BR-MON-01 | Tabel ringkasan **hanya** menampilkan branch yang ter-mapping ke Parent Mapping Subdist. |
| BR-MON-02 | Matching mapping: `kodeBranch` **atau** `branchEpm` (case-insensitive nama) ke Parent (`parent = YA`). |
| BR-MON-03 | Branch belum mapping dihitung di KPI, **tidak** ditampilkan di grid. |
| BR-MON-04 | File harian diperlakukan sebagai **snapshot**; kolom Sebelumnya = hasil rotasi extract sebelumnya. |
| BR-MON-05 | `Selisih = Total(file kini) − Total(file exec sebelumnya)` per kunci branch (`branchCode\|branchName`). |
| BR-MON-06 | Extract pertama (belum ada previous): Sebelumnya & Selisih = `—`. |
| BR-MON-07 | Refresh menggeser `latest` → `previous`, lalu menulis `latest` baru (meski file sama → Selisih 0). |
| BR-MON-08 | Modul ini **tidak** meng-inject BI; Selisih bersifat **informasi pantauan** (kandidat delta untuk proses inject terpisah). |
| BR-MON-09 | Last update ditampilkan dalam zona waktu **WIB**, tanpa menampilkan nama file / status API panjang di header. |

---

## 8. Sumber data & agregasi

### 8.1 File sumber

- Pola nama: `LISTING_CLAIM_ yyMMdd.csv` (sering ada spasi setelah underscore).
- Delimiter tipikal: `~`.
- Lokasi local: `tools/automate-claim-epm/file/`.
- Remote: WebDAV folder user `/shp/` di host EPM (aries).

### 8.2 Field amount yang diagregasi

| Field CSV | Kolom UI |
|-----------|----------|
| `RP_LUMPSUM` | Lumpsum (Rp) |
| `RP_EDPH_PRIN` | EDPH (Rp) |
| `RP_PROMOSI` | Promosi (Rp) |
| `RP_EDHL` | EDHL (Rp) |
| (+ `RP_BONUS` masuk total internal payload) | termasuk di Total agregat backend |

Kunci summary: `BRANCH_SPC_CODE` + `BRANCH`.

### 8.3 Artefak setelah extract

| Artefak | Local | Vercel |
|---------|-------|--------|
| Latest payload | `Data/claims/latest.json` | Blob `claims/latest.json` |
| Meta | `Data/claims/meta.json` | Blob `claims/meta.json` |
| Previous summary | `Data/claims/previous-summary.json` | Blob `claims/previous-summary.json` |

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
| POST | `/api/claims/refresh` | Download + extract (+ rotasi previous) |
| GET | `/api/claims/refresh` | Dipakai Cron Vercel |
| POST | `/api/claims/extract` | Extract tanpa download (local) |

### Response summary (konseptual per baris)

```json
{
  "branchCode": "01",
  "branchName": "MEDAN",
  "trxCount": 552,
  "totals": { "RP_LUMPSUM": 0, "RP_EDPH_PRIN": 0, "RP_PROMOSI": 0, "RP_EDHL": 0 },
  "totalRp": 123456789,
  "previousTotalRp": 120000000,
  "selisihRp": 3456789
}
```

UI menambah `subdistLabel` / `mapped` dari Master Mapping Subdist (client-side).

---

## 10. Arsitektur runtime

```
┌─────────────────────┐
│  Monitoring UI      │
│  (MAVEN prototype)  │
└─────────┬───────────┘
          │
   ┌──────┴──────┐
   │             │
Local         Vercel
:5055         /api/claims/*
   │             │
download_claim   WebDAV (env)
   │             │
CSV file/        Blob storage
   │             │
latest.json  + previous-summary.json
```

**Pemilihan API di browser:**
- `file://` atau localhost (bukan port 3000/3001) → sidecar `:5055`
- Host Vercel / domain deploy → relative `/api/claims`

---

## 11. Env & operasional (Vercel)

| Env | Wajib | Keterangan |
|-----|-------|------------|
| `CLAIM_WEBDAV_URL` | Ya (untuk Refresh) | Host WebDAV |
| `CLAIM_WEBDAV_USER` | Ya | User |
| `CLAIM_WEBDAV_PASS` | Ya | Password (jangan commit) |
| `BLOB_READ_WRITE_TOKEN` | Ya (untuk persist Refresh) | Vercel Blob |
| `CRON_SECRET` | Opsional | Proteksi Refresh/Cron |

Cron (prototype): harian via `vercel.json` → `GET /api/claims/refresh`.  
Catatan: file CSV besar butuh `maxDuration` memadai (ideal Pro).

Local: jalankan `tools/claim-api/start-claim-api.bat`.

---

## 12. Hubungan dengan proses Inject DF (ke depan)

| Monitoring (sekarang) | Inject BI (nanti) |
|-----------------------|-------------------|
| Banding **file vs file** (Sebelumnya / Selisih) | Banding ke **snapshot yang sudah di-inject BI** |
| Selisih = informasi UI | Selisih ≠ 0 = kandidat **mutasi** yang di-insert |
| Tidak mengubah saldo | Mengubah saldo DF di BI |

Detail design inject: lihat `Documentation/inject-delta-breakdown.md`.

---

## 13. Non-functional (prototype)

| Aspek | Catatan |
|-------|---------|
| Performa | `latest.json` ~10MB; detail di-limit (default hingga 8000 baris) |
| Keamanan | Credential WebDAV di env; CORS longgar di sidecar local |
| Audit | Meta `lastUpdated`, `sourceFile`, `fileDate` |
| UX grid | DataTables standar Development Fund (`DfDataTable`) |

---

## 14. Open points FSD formal

| No | Pertanyaan |
|----|------------|
| 1 | Apakah Selisih UI tetap file-vs-file, atau diganti “sudah inject BI” setelah inject live? |
| 2 | Grain matching SubDist: cukup nama Branch EPM, atau wajib kode EPM yang selaras CSV? |
| 3 | Apakah branch unmapped perlu tab/export tersendiri untuk CSD? |
| 4 | Owner & SLA job download EPM jika `TRX_DATE` di file tertinggal dari tanggal nama file |
| 5 | Batas hak Refresh (siapa boleh trigger ingest) |

---

## 15. Lampiran — File prototype

| Area | Path |
|------|------|
| Halaman | `transactions/monitoring-subdist.html` |
| Logic UI | `js/transactions/MonitoringSubdist.js` |
| Claim API local | `tools/claim-api/server.py` |
| Download EPM | `tools/automate-claim-epm/download_claim.py` |
| API Vercel | `api/claims/*.js`, `api/claims/_lib/store.js` |
| Data extract | `Data/claims/latest.json`, `meta.json`, `previous-summary.json` |
| Menu | `js/layout.js` |
| Design delta inject | `Documentation/inject-delta-breakdown.md` |

---

## 16. Riwayat dokumen

| Versi | Tanggal | Perubahan |
|-------|---------|-----------|
| 0.1 | 24 Jul 2026 | Draft awal FSD Monitoring Claim EPM dari prototype |

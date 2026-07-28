# Claim EPM Sync — MAVEN (Ingest LISTING_CLAIM)

| | |
|---|---|
| **Dokumen** | Claim EPM Sync di MAVEN (bisnis + teknis) |
| **Produk** | Development Fund Subdist — Kalbe Nutritionals (SHP) |
| **Sistem** | **MAVEN** (ASP.NET Core + Hangfire + PostgreSQL) |
| **Versi** | 0.1 |
| **Tanggal** | 27 Juli 2026 |
| **Status** | Implemented (ingest + rekap); UI Monitoring & inject BI out of scope dokumen ini |
| **Sumber terkait** | `FSD-Transaction-Monitoring-Claim-EPM.md`, `FSD-Inject-Delta-BI.md`, `business-documentation.md`, legacy `Automate_Claim_EPM` |
| **Script SQL** | [`Script SQL/trClaimEpmSync.sql`](./Script%20SQL/trClaimEpmSync.sql), [`Script SQL/trClaimEpmDailyBalance.sql`](./Script%20SQL/trClaimEpmDailyBalance.sql) |

> Dokumen ini mencampur konteks bisnis dan teknis sebagai bahan penyusunan **FSD formal**.  
> Fokus: bagaimana file LISTING_CLAIM dari EPM masuk ke database MAVEN dan direkap per branch per hari.

---

## 1. Ringkasan (bahasa awam)

Setiap hari kerja, **PT Enseval Putera Megatrading (EPM)** melalui sistem `www.aries.enseval.com` mengeluarkan file CSV **LISTING_CLAIM** yang berisi realisasi claim/listing per cabang (Branch).

Saat ini proses pantauan masih **manual**: user login ke website Aries, unduh file LISTING_CLAIM, lalu mencocokkan data branch/nilai satu per satu (sering lewat Excel).  
Modul Claim EPM Sync di **MAVEN** mengotomasi langkah tersebut:

1. Hangfire (jadwal harian / trigger manual) menghubungi Aries WebDAV.
2. Mencari file LISTING_CLAIM untuk tanggal target.
3. Download + parse CSV.
4. Simpan **setiap baris transaksi** ke DB.
5. Otomatis **rekap saldo harian per Branch** (Lumpsum, EDPH, Promosi, EDHL, Total).

Hasil rekap inilah yang nanti dipakai halaman **Monitoring Claim EPM** (Total / Sebelumnya / Selisih) tanpa user harus membuka dan mencocokkan file CSV secara manual.

**Bukan** tugas modul ini:

- Inject / potong saldo Development Fund ke BI
- Klaim Subdist di KICAO KDS
- UI Monitoring (ada FSD terpisah)

---

## 2. Posisi di arsitektur produk

```
EPM / Aries (Nextcloud /shp/)
        │  LISTING_CLAIM_ yyMMdd.csv
        ▼
   MAVEN Hangfire  ──►  PostgreSQL MavenDB
        │                 • trClaimEpmSync
        │                 • trClaimEpmDetail
        │                 • trClaimEpmDailyBalance
        ▼
   Monitoring Claim EPM (UI)     ── pantau angka
        │
        ✕ bukan inject
        ▼
   BI (Budget Integration)       ── inject/delta (modul lain)
   KICAO KDS                     ── klaim Subdist (modul lain)
```

| Sistem | Peran terkait LISTING_CLAIM |
|--------|------------------------------|
| **MAVEN** | Ingest file, simpan detail + rekap, setting master / QP, pantau (Monitoring) |
| **BI** | Terima/potong budget DF (snapshot + delta) |
| **KICAO KDS** | Klaim operasional Subdist |
| **Legacy / As-Is** | Proses manual di website Aries (login → unduh → cocokkan satu per satu); digantikan Hangfire MAVEN |

---

## 3. Aturan bisnis ingest

| ID | Aturan |
|----|--------|
| BR-ING-01 | File harian = **snapshot** (bukan append transaksi baru tanpa aturan replace). |
| BR-ING-02 | Satu sync sukses untuk tanggal file yang sama **mengganti** detail & rekap aktif tanggal tersebut (soft-deactivate lama). |
| BR-ING-03 | Hanya satu sync bertanda `bolIsLatest = true` (snapshot terkini untuk pantauan). |
| BR-ING-04 | Rekap grain: **`BRANCH_SPC_CODE` + `BRANCH` + `dtFileDate`**. |
| BR-ING-05 | Komponen amount: `RP_LUMPSUM`, `RP_EDPH_PRIN`, `RP_PROMOSI`, `RP_EDHL`. Total = jumlah keempatnya. |
| BR-ING-06 | Sync **tidak** meng-inject BI; hanya menyimpan data untuk pantauan / sumber delta nanti. |
| BR-ING-07 | Tanggal default = hari ini **WIB** (`yyMMdd`). Boleh override lewat parameter `date`. |
| BR-ING-08 | Jika file tanggal target tidak ada di WebDAV → sync gagal bisnis (pesan jelas); Hangfire boleh tetap “Succeeded” tanpa crash. |

Selisih UI Monitoring (`Total − Sebelumnya`) dihitung antar **file/sync**, bukan mutasi ledger BI — lihat `FSD-Transaction-Monitoring-Claim-EPM.md`.

---

## 4. Sumber file

| Item | Nilai |
|------|--------|
| Host | Aries Nextcloud (contoh: `aries.enseval.com`) |
| Protokol | WebDAV (`PROPFIND` list, `GET` download) |
| Folder | `/remote.php/dav/files/{user}/shp/` |
| Pola nama | `LISTING_CLAIM_ {yyMMdd}.csv` (juga varian underscore / spasi) |
| Delimiter | `~` |
| Volume tipikal | ~28 ribu baris / hari |
| Credential | Config MAVEN section `ClaimEpm` (bukan `login.txt` di samping exe) |

Match filename (port dari `download_claim.py`):

1. `LISTING_CLAIM_ {date}.csv`
2. `LISTING_CLAIM_{date}.csv`
3. `LISTING_CLAIM {date}.csv`
4. Fallback: CSV apa pun yang mengandung `date`

---

## 5. Model data (MavenDB)

Urutan apply script:

1. [`Script SQL/trClaimEpmSync.sql`](./Script%20SQL/trClaimEpmSync.sql) — header sync + detail transaksi  
2. [`Script SQL/trClaimEpmDailyBalance.sql`](./Script%20SQL/trClaimEpmDailyBalance.sql) — rekap harian (FK ke sync)

### 5.1 `trClaimEpmSync` — metadata setiap fetch

| Kolom | Keterangan |
|-------|------------|
| `claimEpmSyncId` | PK |
| `txtFileName` | Nama file remote |
| `dtFileDate` | Tanggal dari `yyMMdd` |
| `txtStatus` | `Running` / `Success` / `Failed` |
| `intRowCount` | Jumlah baris detail |
| `bolIsLatest` | Snapshot terkini |
| `txtErrorMessage` | Alasan gagal |
| `txtSource` | `Hangfire` / `Manual` / dll. |
| Audit | `bolActive`, `refInsertedBy`, `dtInserted`, … |

### 5.2 `trClaimEpmDetail` — baris CSV

Setiap baris LISTING_CLAIM (identity cabang/customer/trx/item + amount komponen + field pendukung).  
Foreign key: `claimEpmSyncId` (ke `trClaimEpmSync`).

### 5.3 `trClaimEpmDailyBalance` — rekap saldo harian

| Kolom | Keterangan |
|-------|------------|
| `claimEpmSyncId` | Sync sumber |
| `dtFileDate` | Tanggal file |
| `txtBranch` / `txtBranchSpcCode` | Kunci branch |
| `intRowCount` | Jumlah detail di branch |
| `decRpLumpsum` / `decRpEdphPrin` / `decRpPromosi` / `decRpEdhl` | Sum komponen |
| `decTotal` | Sum 4 komponen |
| `bolIsLatest` | Rekap snapshot terkini |

Unique per sync + branch (mencegah double rekap).

---

## 6. Alur teknis sync

```
[Hangfire] SchedullerSyncClaimEpm(date?)
    → ClaimEpmSyncService.SyncAsync
        1. Resolve tanggal (WIB / param yyMMdd)
        2. WebDAV PROPFIND → FindBestMatch
        3. Insert trClaimEpmSync (Running)
        4. GET file → ClaimEpmCsvParser (~)
        5. CompleteSuccess (transaction):
             - soft-deactivate detail & balance tanggal sama (sync lama)
             - COPY bulk insert trClaimEpmDetail
             - clear bolIsLatest sync/balance lama
             - INSERT rekap trClaimEpmDailyBalance GROUP BY branch
             - update sync → Success + bolIsLatest
        On error → MarkFailed
```

### 6.1 Kode utama (MAVEN)

| Area | Path |
|------|------|
| Options | `MAVEN.Common/ConfigurationModel/ClaimEpmOptions.cs` |
| Entity | `MAVEN.Common/Entity/ClaimEpm/` |
| ModelBuilder | `MAVEN.DAL/ModelBuilders/ClaimEpm/` |
| WebDAV / Parser / Repo / Sync | `MAVEN.Services/ClaimEpm/` |
| Hangfire method | `IJobService.SchedullerSyncClaimEpm` |
| API register/trigger | `JobApiController` |

### 6.2 Hangfire

| Item | Nilai |
|------|--------|
| Recurring job id | `claim_epm_sync_daily` |
| Method | `SchedullerSyncClaimEpm` |
| Queue | `maven` |
| Cron | Harian 07:00 (`Cron.Daily(7)`) |
| Concurrent | `[DisableConcurrentExecution(1800)]`, no auto-retry |

**Tidak auto-register** saat app start. Daftarkan sekali:

```http
GET /api/1.0/JobApi/SchedullerSyncClaimEpm?type=Trigger
```

Jalankan sekarang (opsional tanggal):

```http
GET /api/1.0/JobApi/SchedullerSyncClaimEpm?type=now&date=260721
POST /api/1.0/JobApi/SyncClaimEpmNow?date=260721
```

### 6.3 Config (`ClaimEpm`)

```json
"ClaimEpm": {
  "BaseUrl": "https://aries.enseval.com",
  "UserName": "...",
  "Password": "...",
  "RemoteFolder": "/remote.php/dav/files/{user}/shp/",
  "BypassSslValidation": true,
  "Cron": "0 7 * * *",
  "HangfireQueue": "maven"
}
```

Jangan commit password production ke git; Development boleh mengacu credential internal yang sama dengan legacy `login.txt`.

---

## 7. Use case (bahan FSD)

### UC-ING-01 — Sync harian otomatis

**Aktor:** Sistem (Hangfire)  
**Prekondisi:** Recurring `claim_epm_sync_daily` terdaftar; credential WebDAV valid; file tanggal hari ini sudah ada di Aries.  
**Alur:** Job 07:00 → download → parse → detail + rekap → `bolIsLatest`.  
**Hasil:** Monitoring bisa baca snapshot hari ini dari DB.

### UC-ING-02 — Sync manual tanggal tertentu

**Aktor:** Ops / CCD / FA (via API atau dashboard Hangfire)  
**Alur:** Panggil endpoint dengan `date=yyMMdd` → sama seperti sync, tanggal override.  
**Hasil:** Berguna bila file telat upload atau perlu ulang extract.

### UC-ING-03 — File tanggal tidak ditemukan

**Alur:** PROPFIND OK, match filename gagal.  
**Hasil:** Tidak insert detail/rekap baru; response `ErrorMessages` menjelaskan tanggal; status sync tidak `Success` (bila sudah Running sebelumnya di-mark Failed; bila gagal sebelum insert Running, hanya pesan error).

---

## 8. Query pantauan cepat

```sql
-- Sync terkini
SELECT "txtFileName", "dtFileDate", "txtStatus", "intRowCount", "bolIsLatest", "dtInserted"
FROM "trClaimEpmSync"
ORDER BY "dtInserted" DESC
LIMIT 5;

-- Rekap latest per branch
SELECT "txtBranchSpcCode", "txtBranch",
       "decRpLumpsum", "decRpEdphPrin", "decRpPromosi", "decRpEdhl", "decTotal", "intRowCount"
FROM "trClaimEpmDailyBalance"
WHERE "bolIsLatest" = true AND "bolActive" = true
ORDER BY "decTotal" DESC;
```

---

## 9. Keterkaitan FSD lain

| Dokumen | Hubungan |
|---------|----------|
| [FSD-Transaction-Monitoring-Claim-EPM.md](./FSD-Transaction-Monitoring-Claim-EPM.md) | UI pantau; **sumber production** diganti dari file/JSON lokal → table MAVEN ini |
| [FSD-Inject-Delta-BI.md](./FSD-Inject-Delta-BI.md) | Delta inject memakai prinsip snapshot; ingest MAVEN menyediakan angka file terkini |
| [FSD-Master-Data.md](./FSD-Master-Data.md) | Mapping Subdist untuk filter “mapped only” di Monitoring |
| [business-documentation.md](./business-documentation.md) | Konteks DF Subdist end-to-end |

### Gap untuk FSD formal berikutnya

1. Kontrak API Monitoring membaca `trClaimEpmDailyBalance` (+ detail) menggantikan `/api/claims/summary` prototype.
2. Definisi “Sebelumnya” di DB: sync `bolIsLatest` vs sync sukses sebelumnya (bukan file JSON `previous-summary`).
3. Join Master Mapping Subdist (parent) ke branch rekap.
4. Kebijakan retensi: berapa lama detail CSV disimpan vs cukup rekap.
5. Alert bila sync harian gagal / file belum tersedia setelah jam X.

---

## 10. Checklist deploy

- [ ] Jalankan `trClaimEpmSync.sql` lalu `trClaimEpmDailyBalance.sql` di MavenDB
- [ ] Isi section `ClaimEpm` (secret aman)
- [ ] Deploy/restart MAVEN dengan kode Claim EPM
- [ ] `GET .../SchedullerSyncClaimEpm?type=Trigger` → muncul di Hangfire Recurring Jobs
- [ ] Smoke: `type=now&date=` tanggal file yang sudah ada di Aries
- [ ] Cek `trClaimEpmSync` Success + `trClaimEpmDailyBalance` terisi

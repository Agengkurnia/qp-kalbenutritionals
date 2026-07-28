# FSD Documentation Index
## Development Fund Subdist — Kalbe Nutritionals

Indeks dokumen spesifikasi fungsional (draft dari prototype) dan dokumen pendukung implementasi.

### FSD Formal (DOCX)

| No | Dokumen | Isi | Status |
|----|---------|-----|--------|
| **1** | [FSD/FSD_MasterData_MAVEN_v1.0.docx](./FSD/FSD_MasterData_MAVEN_v1.0.docx) | **Master Data** — Mapping Subdist (Parent/Child/Activity) | Draft v1.0 |
| **2** | *(rencana)* Claim EPM Sync & integrasi Mapping Subdist | Ingest LISTING_CLAIM + keterkaitan monitoring | Belum digabung |

### Draft Markdown (bahan FSD)

| Dokumen | Isi | Status |
|---------|-----|--------|
| [FSD-Master-Data.md](./FSD-Master-Data.md) | Mapping Subdist — Index tanpa Aksi; Detail Bosnet LOV; aligned MAVEN | Draft v0.4 |
| [FSD-Transaction-Monitoring-Claim-EPM.md](./FSD-Transaction-Monitoring-Claim-EPM.md) | Monitoring Claim EPM — fetch & pantau (tanpa apply BI) | Draft v0.3 |
| [Claim-EPM-Sync-MAVEN.md](./Claim-EPM-Sync-MAVEN.md) | Ingest LISTING_CLAIM di MAVEN — bahan FSD doc #2 | Implemented v0.1 |
| [FSD/FSD_ClaimEpmSync_MAVEN_v1.0.docx](./FSD/FSD_ClaimEpmSync_MAVEN_v1.0.docx) | FSD Claim EPM Sync (akan digabung ke doc #2) | Draft v1.0 |
| [FSD-Inject-Delta-BI.md](./FSD-Inject-Delta-BI.md) | Inject/koreksi mock BI via Master | Draft v0.2 |
| [FSD-KICAO-MKPP.md](./FSD-KICAO-MKPP.md) | Prototype KICAO KDS — MKPP Type DF | Draft v0.2 |
| [business-documentation.md](./business-documentation.md) | Konteks bisnis end-to-end | Referensi |

### Script SQL

| Script | Keterangan |
|--------|------------|
| [`Script SQL/trClaimEpmSync.sql`](./Script%20SQL/trClaimEpmSync.sql) | Table sync header + detail transaksi LISTING_CLAIM |
| [`Script SQL/trClaimEpmDailyBalance.sql`](./Script%20SQL/trClaimEpmDailyBalance.sql) | Table rekap saldo harian per Branch EPM |
| [`Script SQL/mDfMappingSubdist.sql`](./Script%20SQL/mDfMappingSubdist.sql) | Master Mapping Subdist: `mDfActivity` + `mDfMappingSubdist` + `trDfMappingSubdistActivity` |

### Rencana dokumen berikutnya

1. **FSD #2** — Claim EPM Sync & integrasi Mapping Subdist (gabungan ingest + monitoring)
2. FSD Master Vendor (saat kembali ke scope)
3. Kontrak API BI production (mengganti MockBiLedger)

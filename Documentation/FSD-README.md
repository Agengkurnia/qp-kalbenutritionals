# FSD Documentation Index
## Development Fund Subdist — Kalbe Nutritionals

Indeks dokumen spesifikasi fungsional (draft dari prototype) dan dokumen pendukung implementasi.

### FSD Formal (DOCX)

| No | Dokumen | Isi | Status |
|----|---------|-----|--------|
| **1** | [FSD/FSD_MasterData_MAVEN_v1.0.docx](./FSD/FSD_MasterData_MAVEN_v1.0.docx) | **Master Data** — Mapping Subdist (Parent/Child/Activity) | Draft v1.0 |
| **2** | [FSD/FSD_ClaimEpmSync_MAVEN_v1.0.docx](./FSD/FSD_ClaimEpmSync_MAVEN_v1.0.docx) | **Claim EPM Sync** — Ingest LISTING_CLAIM | Draft v1.0 |
| **3** | [FSD/FSD_MonitoringClaimEPM_MAVEN_v1.0.docx](./FSD/FSD_MonitoringClaimEPM_MAVEN_v1.0.docx) | **Monitoring Claim EPM** — ShipTo, Parent-only, Total grup | Draft v1.0 |

### Draft Markdown (bahan FSD)

| Dokumen | Isi | Status |
|---------|-----|--------|
| [FSD-Master-Data.md](./FSD-Master-Data.md) | Mapping Subdist — Bosnet LOV + `txtShipToSiteUseId` (OutletID) | Draft v0.5 |
| [FSD-Transaction-Monitoring-Claim-EPM.md](./FSD-Transaction-Monitoring-Claim-EPM.md) | Monitoring Claim EPM — ShipTo match, Parent-only, Total grup; paritas prototype↔MAVEN | **v1.0** |
| [Claim-EPM-Sync-MAVEN.md](./Claim-EPM-Sync-MAVEN.md) | Ingest LISTING_CLAIM di MAVEN — grain ShipTo + migrate_shipTo_all | Implemented v0.1+ |
| [FSD/FSD_ClaimEpmSync_MAVEN_v1.0.docx](./FSD/FSD_ClaimEpmSync_MAVEN_v1.0.docx) | FSD Claim EPM Sync (akan digabung ke doc #2) | Draft v1.0 |
| [FSD-Inject-Delta-BI.md](./FSD-Inject-Delta-BI.md) | Inject/koreksi mock BI — grain per SubDist mapping | Draft v0.2+ |
| [FSD-KICAO-MKPP.md](./FSD-KICAO-MKPP.md) | Prototype KICAO KDS — MKPP Type DF | Draft v0.2 |
| [business-documentation.md](./business-documentation.md) | Konteks bisnis end-to-end (v1.2 — update deck 30 Jul) | Referensi |
| [Creating-Demand-MPP-Rules.md](./Creating-Demand-MPP-Rules.md) | Lampiran Creating Demand, MPP, Mekanisme, Rules | v1.0 |

### Script SQL

| Script | Keterangan |
|--------|------------|
| [`Script SQL/trClaimEpmSync.sql`](./Script%20SQL/trClaimEpmSync.sql) | Table sync header + detail transaksi LISTING_CLAIM |
| [`Script SQL/trClaimEpmDailyBalance.sql`](./Script%20SQL/trClaimEpmDailyBalance.sql) | Rekap saldo harian (grain ShipTo + branch) |
| [`Script SQL/mDfMappingSubdist.sql`](./Script%20SQL/mDfMappingSubdist.sql) | Master Mapping Subdist (+ `txtShipToSiteUseId`) |
| [`Script SQL/migrate_shipTo_all.sql`](./Script%20SQL/migrate_shipTo_all.sql) | Migrasi one-shot ShipTo untuk DB existing |

### Rencana dokumen berikutnya

1. **FSD #2** — Claim EPM Sync & integrasi Mapping Subdist (gabungan ingest + monitoring)
2. FSD Master Vendor (saat kembali ke scope)
3. Kontrak API BI production (mengganti MockBiLedger)

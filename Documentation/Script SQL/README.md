# Script SQL — Development Fund Subdist (MAVEN)

Script DDL untuk MavenDB (PostgreSQL).

## Claim EPM Sync

| Urutan | File | Isi |
|--------|------|-----|
| 1 | [trClaimEpmSync.sql](./trClaimEpmSync.sql) | `trClaimEpmSync` + `trClaimEpmDetail` |
| 2 | [trClaimEpmDailyBalance.sql](./trClaimEpmDailyBalance.sql) | `trClaimEpmDailyBalance` (butuh table sync dulu) |
| — | [migrate_claimEpm_rename_keys.sql](./migrate_claimEpm_rename_keys.sql) | Rename kolom `pk*`/`ref*` → `claimEpm*Id` (jika DB sudah ada) |

Dokumentasi: [`../Claim-EPM-Sync-MAVEN.md`](../Claim-EPM-Sync-MAVEN.md) · FSD [`../FSD/FSD_ClaimEpmSync_MAVEN_v1.0.docx`](../FSD/FSD_ClaimEpmSync_MAVEN_v1.0.docx)

## Master Data — Mapping Subdist

| Urutan | File | Isi |
|--------|------|-----|
| 1 | [mDfMappingSubdist.sql](./mDfMappingSubdist.sql) | `mDfActivity` + `mDfMappingSubdist` + `trDfMappingSubdistActivity` |

Dokumentasi FSD: [`../FSD/FSD_MasterData_MAVEN_v1.0.docx`](../FSD/FSD_MasterData_MAVEN_v1.0.docx)

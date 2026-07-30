# Functional Specification Document (FSD)
## Inject Development Fund — Snapshot + Delta (BI)

| | |
|---|---|
| **Dokumen** | FSD Inject Development Fund / Delta BI |
| **Produk** | Development Fund Subdist — Kalbe Nutritionals (SHP) |
| **Versi** | 0.3 (grain per SubDist mapping Parent/Child; selaras Monitoring ShipTo) |
| **Tanggal** | 29 Juli 2026 |
| **Sumber** | `inject-delta-breakdown.md`, Monitoring Claim EPM, Master Mapping Subdist |
| **Status** | Draft; production BI belum terhubung — prototype memakai **MockBiLedger** |

---

## 1. Tujuan

1. Memastikan file LISTING_CLAIM harian diperlakukan sebagai **snapshot**, bukan append transaksi baru.
2. Di production nanti: hanya mengirim **mutasi delta** ke ledger DF (BI).
3. Di prototype: mutasi mock lewat **Master** — Add child historis (CSV) + Lepas koreksi **per bulan**.
4. Mensimulasikan saldo, inject, koreksi, dan warning **budget mines**.

---

## 2. Prinsip delta (production / design)

1. Jangan insert ulang full amount setiap hari.
2. Simpan **snapshot injected**.
3. `delta = nilai_file_baru − nilai_terakhir_inject`.
4. Hanya `delta ≠ 0` yang masuk ledger.
5. Update snapshot hanya setelah sukses.

Monitoring UI **hanya fetch & pantau** (lihat `FSD-Transaction-Monitoring-Claim-EPM.md` v0.3).  
Tidak ada wizard apply di Monitoring.

---

## 3. Jalur prototype — mutasi mock BI

### 3.1 Add child historis (CSV)

```
[1] User pilih child + Periode sebelumnya + nama bulan
        ↓
[2] Upload CSV LISTING_CLAIM (format sama Monitoring)
        ↓
[3] Parse + validasi branch / TRX_DATE bulan
        ↓
[4] Preview impact (+ mines)
        ↓
[5] Commit link (linkedAt = YYYY-MM-01) + inject mock
```

### 3.2 Lepas child — koreksi per bulan

```
[1] Lepas → cek dampak injected
        ↓
[2] Efektif lepas = hari ini (fixed)
        ↓
[3] User pilih bulan dari → sampai + lihat impact
        ↓
[4] Post mutasi koreksi → sukses baru unmap
```

Detail UI: `FSD-Master-Data.md` UC-MD-04 / UC-MD-04b.

---

## 4. Grain (kunci bisnis)

| Level | Kunci | Prototype |
|-------|--------|-----------|
| **A** | **Per mapping SubDist** (`kodeKmmd` / mapping id) + bulan (`YYYY-MM`) — Parent **atau** Child | **Dipakai** |
| **B** | + jenis komponen | Belum |
| **C** | + surat referensi / QP | Belum |

Inject BI mengikuti grain per SubDist mapping (bukan agregat branch ke parent). Claim match ke mapping via `SHIP_TO_SITE_USE_ID` = `txtShipToSiteUseId` (OutletID).

---

## 5. Model data (mock)

### Snapshot / ledger / budget

Sama konsep v0.1 (`df_inject_snapshot`, ledger mutasi, saldo `injected − used`).

Tipe mutasi prototype:

| `type` | Sumber |
|--------|--------|
| `INJECT_DELTA` / `HISTORICAL_INJECT` | Add child historis CSV |
| `UNMAP_CORRECTION` | Lepas child (rentang bulan) |

Filter koreksi unmap: `trxDate` dengan prefix bulan dalam `fromYm`…`toYm`.

---

## 6. Aturan bisnis (BR-INJ)

| ID | Aturan |
|----|--------|
| BR-INJ-01 | Design production: inject memakai delta vs snapshot (bukan full file harian dari Monitoring UI). |
| BR-INJ-02 | Snapshot di-update hanya setelah sukses. |
| BR-INJ-03 | Monitoring Refresh **tidak** apply ke BI. |
| BR-INJ-04 | Warning mines wajib sebelum commit inject historis / koreksi unmap bila proyeksi sisa &lt; 0. |
| BR-INJ-05 | Unmap dengan dampak: koreksi dulu (per bulan), baru lepas. |
| BR-INJ-06 | Koreksi unmap memfilter ledger by **bulan** (`YYYY-MM`). |
| BR-INJ-07 | Add historis: CSV LISTING_CLAIM + validasi identity + preview. |
| BR-INJ-08 | Prototype persistensi = `localStorage` (`MockBiLedger`). |
| BR-INJ-09 | Grain inject = per `kodeKmmd` / mapping id (Parent maupun Child); bukan agregat branch ke parent. |

---

## 7. Edge cases

| Kasus | Default prototype |
|-------|-------------------|
| Add bulan ini tanpa CSV | Link saja; tidak inject historis |
| CSV tidak match ShipTo / OutletID child | Tolak |
| Mayoritas TRX_DATE di luar bulan dipilih | Tolak |
| Unmap tanpa injected di rentang bulan | Confirm lepas sederhana |
| Koreksi gagal | Abort unmap |

---

## 8. Integrasi sistem

| Layer | Tugas |
|-------|--------|
| Monitoring UI | Fetch + pantau file |
| Master Mapping | Add historis CSV + lepas koreksi bulan |
| MockBiLedger | Snapshot, ledger, saldo, mines, audit |
| ListingClaimCsv | Parse CSV client-side |
| BI production | (nanti) terima mutasi +/− |

---

## 9. File terkait

| Area | Path |
|------|------|
| Design note awal | `Documentation/inject-delta-breakdown.md` |
| FSD Monitoring | `Documentation/FSD-Transaction-Monitoring-Claim-EPM.md` |
| FSD Master | `Documentation/FSD-Master-Data.md` |
| Mock | `js/shared/MockBiLedger.js` |
| CSV parser | `js/shared/ListingClaimCsv.js` |

---

## 10. Riwayat dokumen

| Versi | Tanggal | Perubahan |
|-------|---------|-----------|
| 0.1 | 24 Jul 2026 | FSD Inject + koreksi unmap + daily apply wizard Monitoring |
| 0.2 | 24 Jul 2026 | Hapus apply Monitoring; jalur Master bulan + CSV historis |

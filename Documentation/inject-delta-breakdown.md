# Breakdown Teknis — Inject DF dengan Snapshot + Delta

| | |
|---|---|
| **Status** | Design proposal (belum diimplementasi inject ke BI) |
| **Konteks** | Feedback senior: saat file besok diproses, hanya insert **delta** |
| **Terkait** | Monitoring Claim EPM (file LISTING_CLAIM) → nanti Inject ke BI |

---

## 1. Masalah bisnis (contoh)

| Hari | Isi file (4 SubDist) | Salah (insert full tiap hari) | Benar (delta) |
|------|----------------------|-------------------------------|---------------|
| 23 | 10 jt total | +10 jt | +10 jt (baseline pertama) |
| 24 | 8 jt total (data sama, nilai berubah) | +8 jt → saldo jadi **18 jt** | **−2 jt** → saldo jadi **8 jt** |

File harian EPM = **snapshot posisi terkini**, bukan daftar “transaksi baru saja”.

---

## 2. Prinsip

1. **Jangan** insert ulang full amount setiap hari.
2. Simpan **nilai terakhir yang sudah berhasil di-inject** (snapshot injected).
3. Proses file berikutnya: `delta = nilai_baru − nilai_terakhir_inject`.
4. Hanya baris dengan `delta ≠ 0` yang masuk **mutasi / ledger** ke BI.
5. Setelah sukses inject, update snapshot injected = nilai file hari ini.

```
delta > 0  → penambahan saldo DF
delta < 0  → koreksi / pengurangan
delta = 0  → skip (tidak insert)
```

---

## 3. Alur proses harian

```
[1] Ambil file LISTING_CLAIM (download / upload)
        ↓
[2] Aggregate per KUNCI BISNIS → Snapshot Hari Ini
        ↓
[3] Load Snapshot Injected (posisi terakhir sukses ke BI)
        ↓
[4] Hitung Delta per kunci
        ↓
[5] Filter delta ≠ 0
        ↓
[6] Insert mutasi delta ke BI (ledger)
        ↓
[7] Update Snapshot Injected + catat Ingest Run Log
```

Monitoring UI yang ada sekarang = langkah **[1–2] baca/lihat**.  
Inject DF = langkah **[3–7]** (belum ada di prototype; biasanya di **BI**).

---

## 4. Kunci bisnis (grain) — perlu dikunci dengan FA/CCD

Usulan awal (bisa disesuaikan):

| Level | Kunci | Kapan dipakai |
|-------|--------|----------------|
| **A. Agregat SubDist** (sederhana) | `kode_branch` / mapping SubDist + `periode` (bulan) | Prototype / inject glondongan |
| **B. Per komponen** | Level A + jenis (`LUMPSUM` / `EDPH` / `PROMOSI` / `EDHL`) | Lebih akurat ke tipe dana |
| **C. Per referensi** | Level B + `SURAT_REFERENSI` / no QP | Paling detail; butuh kepastian field di file |

**Rekomendasi mulai:** Level **A atau B**, baru naik ke C jika rekonsiliasi butuh.

Contoh Level A untuk 4 subdist hari 23→24:

| SubDist | Injected (H23) | File (H24) | Delta insert |
|---------|----------------|------------|--------------|
| S1 | 2.500.000 | 2.000.000 | −500.000 |
| S2 | 2.500.000 | 2.000.000 | −500.000 |
| S3 | 2.500.000 | 2.000.000 | −500.000 |
| S4 | 2.500.000 | 2.000.000 | −500.000 |

---

## 5. Entitas data yang perlu ada

### 5.1 `df_inject_snapshot` (posisi terakhir ter-inject)

| Kolom | Ket |
|-------|-----|
| `business_key` | PK logis (mis. subdist + periode [+ komponen]) |
| `amount` | Nilai terakhir yang sudah di-inject |
| `source_file` | Nama file terakhir |
| `injected_at` | Waktu sukses inject |
| `run_id` | Relasi ke log run |

### 5.2 `df_inject_run` (log setiap proses file)

| Kolom | Ket |
|-------|-----|
| `run_id` | PK |
| `source_file` / `file_date` | Asal file |
| `file_hash` | Deteksi file identik (idempotent) |
| `status` | `SUCCESS` / `FAILED` / `PARTIAL` |
| `row_snapshot` / `row_delta` | Jumlah baris |
| `started_at` / `finished_at` | Audit |

### 5.3 `df_inject_ledger` (hanya delta yang dikirim ke BI)

| Kolom | Ket |
|-------|-----|
| `run_id` | |
| `business_key` | |
| `amount_before` | Snapshot lama |
| `amount_after` | Dari file hari ini |
| `delta` | yang di-insert |
| `bi_ref` | No dokumen / id mutasi di BI (jika ada) |

---

## 6. Aturan edge case (tanya / sepakati)

| Kasus | Usulan default |
|-------|----------------|
| SubDist **baru** di file | `delta = amount − 0` → inject full |
| SubDist **hilang** dari file | `delta = 0 − amount_lama` → koreksi tarik balik? **perlu putusan bisnis** |
| Upload **2×** file sama hari itu | Banding ke **snapshot injected**, bukan “file kemarin”; jika hash sama → skip |
| Funding turun tapi klaim sudah jalan | Delta minus tetap dicatat; flag / approval FA jika saldo jadi minus |
| Gagal di tengah insert BI | Jangan update snapshot; retry run; ledger harus idempotent per `run_id` + key |

---

## 7. Pemisahan tanggung jawab sistem

| Layer | Tugas |
|-------|--------|
| **MAVEN / Prototype Monitoring** | Ambil & tampilkan LISTING_CLAIM; mapping SubDist |
| **Job Ingest (baru / di BI)** | Snapshot → delta → panggil API inject BI |
| **BI** | Terima **mutasi** (+/−), maintain saldo DF per SubDist |

Jangan campur: “tampilkan claim EPM” ≠ “inject saldo DF”.

---

## 8. Checklist implementasi (urutan usulan)

1. [ ] Kunci grain disepakati (A / B / C)
2. [ ] Tabel snapshot + run log + ledger (atau store setara di BI)
3. [ ] Job: aggregate file → hitung delta → filter ≠ 0
4. [ ] API/call inject BI **per baris delta** (bukan full file)
5. [ ] Update snapshot hanya setelah BI confirm sukses
6. [ ] Uji: 10 jt → 8 jt menghasilkan tepat 4 baris −0,5 jt
7. [ ] Uji: file identik 2× → 0 insert
8. [ ] Report rekonsiliasi: `sum(ledger) == snapshot` per kunci

---

## 9. Ringkas untuk senior

> File harian = snapshot.  
> Simpan posisi file exec sebelumnya.  
> Di UI: **Total** | **Sebelumnya** | **Selisih** (`hari_ini − sebelumnya`).  
> Proses inject BI (nanti) idealnya memakai kolom **Selisih** (yang ≠ 0).

Prototype Monitoring: kolom Sebelumnya & Selisih sudah didukung (rotasi `previous-summary.json` tiap Refresh/extract).

# Lampiran Bisnis — Creating Demand, MPP & Rules
## Development Fund KN — Subdist

| | |
|---|---|
| **Dokumen** | Lampiran Creating Demand / MPP / Rules |
| **Produk** | Development Fund Subdist — Kalbe Nutritionals (SHP) |
| **Versi** | 1.0 |
| **Tanggal** | 30 Juli 2026 |
| **Sumber** | `Document/2026.07.30-Development Fund KN - Subdist.pdf` |
| **Induk** | [business-documentation.md](./business-documentation.md) (v1.2+) |
| **Tujuan** | Menyimpan isi deck update 30 Jul (Objectives, Mekanisme, Draft Creating Demand, Rules) agar tidak hilang di narasi bisnis utama |

---

## 1. Objectives

**Tujuan program:** mekanisme pembiayaan yang terkontrol dan kolaboratif untuk mendukung pengembangan pasar serta mempercepat pembayaran biaya-biaya dari Kalbe Nutritionals (**KN**) kepada Sub Distributor (**Subdist**).

| Istilah | Arti di deck |
|---------|----------------|
| **Development Fund (DF)** | Tambahan diskon dari KN atas pengambilan barang dari Subdist kepada EPM. Dana yang terkumpul disimpan di Subdist untuk kegiatan bisnis sesuai kebutuhan KN berdasarkan kesepakatan. |
| **Creating Demand** | Surat resmi dari KN kepada Subdist sebagai dukungan DF — berisi kesepakatan pembiayaan transaksi serta besaran tambahan diskon. |
| **Marketing Project Plan (MPP)** | Surat resmi dari KN kepada Subdist untuk melakukan pembayaran program tertentu sesuai kebutuhan dengan dana DF. |

> **Pemetaan ke istilah sistem yang sudah dipakai:** Creating Demand ≈ kesepakatan / dasar funding (dekat Memo QP + agreement Subdist). MPP ≈ memo program pemakaian (dekat **MKPP Type DF** di KICAO). Detail mapping operasional tetap di dokumen induk.

---

## 2. Mekanisme (alur pihak)

Pihak: **KN**, **EPM**, **Subdist**, **Vendor/Outlet**, plus pusat **Saldo DF** dan **Rekonsiliasi Saldo DF**.

### 2.1 Pendanaan (saldo masuk)

```
KN ──Request Disc. Subdist──► EPM
EPM ──Diskon 5%–30%─────────► Subdist ──► Saldo DF
Saldo DF ──► Rekonsiliasi Saldo DF ──► KN
```

### 2.2 Program & Payment Approval

```
KN ──Program / MPP──► Subdist
Subdist ──Request Payment Approval──► (gate PA)
Approval PA ──► boleh lanjut ke pengeluaran / potong Saldo DF
```

### 2.3 Pengeluaran (saldo keluar)

```
Subdist / Saldo DF ──bayar──► Vendor / Outlet
Vendor / Outlet ──feedback──► Subdist
Vendor / Outlet ──feedback──► KN
```

**Inti kontrol:** Saldo DF adalah hub; masuk dari diskon EPM, keluar hanya setelah **Payment Approval**, lalu direkonsiliasi ke KN.

---

## 3. Draft Creating Demand (kerangka surat)

Ringkasan kerangka surat dukungan Creating Demand (contoh periode program di deck).

| Item | Isi |
|------|-----|
| **Perihal** | Support Program Creating Demand Melalui Sub Distributor Kalbe Nutritionals |
| **Periode contoh** | 1 Agustus – 31 Desember 2026 |
| **Produk** | Semua produk KN |
| **Tujuan** | Membentuk Development Fund untuk kegiatan Creating Demand sesuai kebutuhan Principal (KN) melalui Subdist |

### 3.1 Mekanisme keuangan (DFKN)

| Aturan | Keterangan |
|--------|------------|
| Sumber dana | Diskon tambahan **5%–30% on faktur** berdasarkan penjualan HNA EPM ke Subdist |
| Kepemilikan | Diskon yang terbentuk dikelola sebagai dana Principal (**KN**) untuk kegiatan pengembangan pasar |
| Penitipan operasional | Dana terkumpul dikelola / “disimpan” di sisi Subdist sesuai kesepakatan |
| Fee Subdist | Setiap Payment Approval / pembayaran activity dikenakan fee tambahan **0,5%** dari nilai program **sebelum PPN**; fee memotong sebagian saldo DFKN per activity |
| Pajak | Faktur atas nama Subdist; administrasi PPN & PPh mengikuti ketentuan berlaku |
| Akhir tahun | Sisa saldo DFKN **carry over** ke tahun berikutnya, atau dibayarkan ke pihak yang ditunjuk KN |
| Terminasi | Jika kerja sama berakhir, sisa saldo DFKN dikembalikan ke KN |
| Kontrol sistem | Pengelolaan DFKN memakai alat kontrol / **sistem yang disediakan KN** (komunikasi dengan ekosistem KICAO KN — lihat Rules) |

### 3.2 Kategori program (detail di Memo / MPP terpisah)

1. SPG  
2. E-Commerce Fee  
3. Visibility / Display  
4. Event Organizer  
5. Other Creating Demand Activities  

### 3.3 Lead time Payment Approval (sumber kebenaran sejak 30 Jul 2026)

| Tahap | SLA |
|-------|-----|
| User / Business Owner KN — cek setelah terima invoice | **5 hari** |
| Klaim Distributor / Subdist — setelah terima invoice pihak ketiga atau setelah cek KN | **5 hari** |
| Approval ABM — setelah pengajuan Distributor | **10 hari** |
| Approval Head Office KN — setelah approval ABM | **10 hari** |

Alur ringkas: KN mengatur activity via memo/MPP → Subdist bayar lalu ajukan **Payment Approval** ke KN → approval berjenjang sesuai SLA di atas → potong saldo DF setelah PA approved.

---

## 4. Rules

| No | Rule |
|----|------|
| 1 | Saldo DF adalah dana **KN** untuk Creating Demand sesuai kebutuhan. |
| 2 | Pemakaian DF **harus** didasari surat **MPP Program**. |
| 3 | Pembayaran program dilakukan melalui mekanisme **Payment Approval**. |
| 4 | Pemotongan Saldo DF dilakukan **setelah** mendapat Approval dari request Payment Approval. |
| 5 | Saldo DF sisa akhir tahun di **Carry Over** ke tahun berikutnya. |
| 6 | Pengelolaan saldo menggunakan komunikasi sistem **KICAO KN**. |

---

## 5. Implikasi singkat ke sistem

| Sistem | Implikasi dari deck 30 Jul |
|--------|---------------------------|
| **MAVEN** | Master Subdist/Vendor tetap; dukungan data kesepakatan Creating Demand & mapping Subdist yang ikut DF; pantauan Claim EPM / inject sebagai sumber penambahan saldo |
| **BI (Budget Integration)** | Maintain Saldo DF; inject dari realisasi diskon; **potong saldo hanya setelah PA approved**; carry over akhir tahun; rekonsiliasi ke KN |
| **KICAO KDS / KICAO KN** | MPP / MKPP Type DF sebagai dasar pemakaian; alur klaim + Payment Approval; komunikasi pengelolaan saldo (Rule 6) |

Detail FSD teknis per modul tetap di dokumen FSD masing-masing; lampiran ini hanya mengunci aturan bisnis dari deck.

---

## 6. Referensi

- `Document/2026.07.30-Development Fund KN - Subdist.pdf` — Objectives, Mekanisme, Draft Creating Demand, Rules  
- [business-documentation.md](./business-documentation.md) — narasi end-to-end + peta sistem  
- [FSD-KICAO-MKPP.md](./FSD-KICAO-MKPP.md) — prototype MKPP Type DF  

---

*Lampiran ini melengkapi, bukan menggantikan, dokumen bisnis induk. Jika bertentangan dengan versi lebih lama, deck 30 Jul 2026 yang diikuti (kecuali keputusan bisnis baru menyusul).*

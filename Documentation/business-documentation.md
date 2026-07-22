# Business Documentation
## Project Development Fund Subdist — Kalbe Nutritionals (SHP)

| | |
|---|---|
| **Versi dokumen** | 1.1 |
| **Tanggal update** | 22 Juli 2026 |
| **Sumber utama** | `Document/2026.07.21-Project Development Fund Subdist.pdf` |
| **Sumber pendukung** | `Document/TimeLine_DevelopmentFund.xlsx` |
| **Tujuan dokumen** | Menjelaskan bisnis Development Fund Subdist dengan bahasa yang mudah dipahami, termasuk untuk pembaca non-teknis, plus peta sistem IT tempat fitur di-develop |

---

## 1. Ringkasan Singkat (Bisa Dibaca dalam 1 Menit)

Kalbe Nutritionals (**SHP / KN**) ingin mengelola dana yang disebut **Development Fund (DF)** untuk mendukung aktivitas penjualan di tingkat **Subdist** (sub-distributor).

Dana tersebut **berasal dari Enseval Putera Megatrading (EPM)** — perusahaan satu grup Kalbe — melalui mekanisme **QP** (pengaturan discount/promo di sisi EPM).

Alur besarnya:

1. EPM menyediakan dana (via QP / special discount).
2. Master & QP di-setting di **MAVEN**.
3. Dana masuk sebagai saldo DF di **BI (Budget Integration)**.
4. KN (CCD) membuat memo activity agar dana boleh dipakai.
5. Subdist mengajukan **klaim** di **KICAO KDS**.
6. KN memverifikasi & menyetujui secara berjenjang.
7. Saldo DF di **BI** berkurang (terpotong) setelah proses klaim/matching.
8. Tim FA / CCD / EPM melakukan **rekonsiliasi** agar angka tetap cocok.

**Tiga sistem utama (sisi IT):**

| Sistem | Peran singkat |
|--------|----------------|
| **MAVEN** | Setting master & QP |
| **BI (Budget Integration)** | Terima budget (saldo masuk) & potong budget (saldo keluar) |
| **KICAO KDS** | Proses klaim |

---

## 2. Konteks Perusahaan

| Perusahaan | Singkatan | Peran dalam project ini |
|------------|-----------|-------------------------|
| Sanghiang Perkasa / Kalbe Nutritionals | **SHP / KN** | Mengelola proses bisnis DF: memo, klaim, approval, saldo, rekonsiliasi |
| Enseval Putera Megatrading | **EPM** | Sumber dana DF melalui setting QP / special discount |
| — | **Kalbe Group** | Grup yang menaungi SHP/KN dan EPM |

**Intinya:** SHP mengelola saldo Development Fund yang sumbernya dari Enseval (EPM).

---

## 3. Siapa Saja yang Terlibat?

### 3.1 Pihak luar & mitra

| Pihak | Peran singkat |
|-------|----------------|
| **EPM** | Menyediakan funding lewat QP / special discount |
| **Subdist** | Mitra distribusi di daerah; menerima DF dan mengajukan klaim activity |
| **Vendor / pihak ketiga** | Penyedia jasa activity (SPG, event, listing, dll.) yang menagihkan biaya |

### 3.2 Tim internal KN

| Tim | Nama lengkap | Tugas utama di proses DF |
|-----|--------------|---------------------------|
| **CCD** | Channel & Customer Development | Memo QP, memo activity (MKPP), master terkait, rekonsiliasi |
| **FA** | Financial Accounting | Funding, upload/maintain saldo, rekonsiliasi keuangan |
| **Sales** | Tim Sales | Activity plan / perencanaan aktivitas |
| **ABM** | Area Business Manager | Validasi di cabang sebelum ke HO; rekonsiliasi dengan subdist |
| **CF** | Tim approve payment | Verifikasi akhir & approve payment |
| **KN User** | User operasional terkait tagihan tertentu | Verifikasi tagihan yang perlu dicek dulu (mis. SPG, e-commerce) sebelum ke subdist |
| **CSD / RAS** | Tim master data | Input/mapping master Subdist & Vendor |
| **Admin HO / Admin Subdist** | Admin operasional | Input klaim di sistem (KICAO-KDS / PRM) |

---

## 4. Glosarium

Istilah diurutkan agar mudah dicari.

| Istilah | Arti sederhana |
|---------|----------------|
| **SHP** | Sanghiang Perkasa — entitas Kalbe Nutritionals |
| **KN** | Kalbe Nutritionals (sering dipakai bergantian dengan SHP) |
| **EPM** | Enseval Putera Megatrading — perusahaan distribusi di Kalbe Group |
| **Kalbe Group** | Grup perusahaan yang menaungi SHP/KN dan EPM |
| **Subdist** | Sub-distributor; mitra yang mendistribusikan produk di area tertentu |
| **DF / Development Fund** | Dana pengembangan untuk activity subdist; dikelola per subdist |
| **QP** | Mekanisme/instruksi promo-discount di sisi EPM yang menghasilkan sumber dana DF (biasanya di-setting per subdist di Oracle/ETPM) |
| **ETPM** | Sistem Trade Promotion Management di EPM; tempat QP dijalankan/dilaporkan |
| **Special Discount** | Margin/dana di EPM yang terbentuk dari setup harga selling-in; sumber utama DF |
| **Trade Discount** | Potongan perdagangan; dipakai saat menghitung net saldo (special discount dikurangi trade discount) |
| **Net Saldo PL KND** | Hasil special discount dikurangi trade discount pada report PL KND EPM |
| **Selling-in** | Penjualan dari principal/distributor ke subdist (bukan ke konsumen akhir) |
| **Memo QP** | Memo dari CCD sebagai dasar EPM membuat/setting QP per subdist; ada proses create & close |
| **Memo Activity / MKPP** | Memo resmi untuk memakai saldo DF pada activity tertentu |
| **MKPP Type DF** | Jenis MKPP khusus pemakaian Development Fund |
| **Klaim** | Pengajuan penggantian biaya activity oleh subdist, lengkap dengan dokumen |
| **Klaim Matching** | Proses sistem yang mencocokkan klaim; untuk transaksi DF **tidak push ke Oracle**, hanya memotong saldo DF di BI |
| **Saldo Awal** | Saldo DF di awal periode (biasanya dari akhir bulan sebelumnya) |
| **Penambahan** | Mutasi plus ke saldo DF (mis. dari realisasi QP / inject DF) |
| **Pengurangan** | Mutasi minus karena klaim (DPP + komponen lain, mis. 0,5%) |
| **Net Mutasi** | Selisih penambahan dan pengurangan |
| **Saldo Akhir** | Saldo DF setelah mutasi periode |
| **Inject Development Fund** | Proses memasukkan hasil QP EPM ke Budget Integration sebagai saldo DF per subdist |
| **Budget Integration** | Tempat saldo anggaran (termasuk DF) dicatat dan dipantau |
| **Budget Type DF** | Kode/tipe anggaran khusus Development Fund per subdist di KICAO |
| **Retur** | Pengembalian barang subdist ke EPM; memotong saldo DF |
| **Rekonsiliasi** | Pencocokan angka antar pihak (KN FA, CCD, EPM, Subdist) agar saldo sama |
| **MAVEN** | Sistem untuk **setting master** (Subdist, Vendor, mapping, dll.) dan **QP** |
| **BI / Budget Integration** | Sistem untuk **menerima** saldo/budget DF dan **memotong** budget saat klaim |
| **KICAO** | Ekosistem aplikasi KN untuk proses operasional (memo, approval, dll.) |
| **KICAO KDS** | Modul KICAO untuk proses **klaim** Development Fund |
| **KICAO-KDS / PRM** | Kanal create klaim di ekosistem KICAO (KDS dan/atau PRM) |
| **Joint Group Subdist** | Relasi parent–child antar outlet/subdist (saldo DF bisa di-maintain di satu outlet grup) |
| **Mapping Subdist** | Master relasi Parent vs Child dan Parent vs Activity |
| **LOB / Z01** | Line of Business; untuk DF memakai All Brand / “glondongan” (kode Z01) |
| **SLA** | Batas waktu layanan (mis. klaim 14 hari, validasi 7 hari, approve 7 hari) |
| **NKA** | National Key Account (disebut dalam konteks margin penjualan) |
| **CCD** | Channel & Customer Development |
| **FA** | Financial Accounting |
| **ABM** | Area Business Manager |
| **CF** | Tim yang melakukan approve payment setelah validasi |
| **RAS / CSD** | Tim terkait input master Subdist & Vendor |
| **SPG** | Sales Promotion Girl — salah satu jenis activity |
| **Listing** | Biaya/aktivitas agar produk masuk daftar jual outlet |
| **Event / EO** | Aktivitas event / Event Organizer |
| **Strata Harga** | Skema harga berjenjang sebagai jenis activity |
| **Visibility** | Aktivitas tampilan produk di outlet |
| **DPP** | Dasar Pengenaan Pajak |
| **PPN** | Pajak Pertambahan Nilai |
| **PPh** | Pajak Penghasilan |
| **HO** | Head Office |
| **SIT / UAT** | System Integration Test / User Acceptance Test — tahap uji sebelum go live |
| **Subdist Resign** | Mekanisme saat subdist berhenti; termasuk reclass budget/saldo DF |

> **Catatan tentang QP:** Kepanjangan formal belum tertulis di dokumen sumber. Secara bisnis, QP adalah “keran funding” di EPM. Realisasi QP menjadi saldo DF yang dikelola SHP.

---

## 5. Masalah Bisnis yang Ingin Diselesaikan

Sebelumnya, dana promo/discount dari EPM dan pemakaiannya di subdist sulit dikontrol secara rapi:

- Sulit melihat **saldo DF per subdist** secara jelas
- Memo, klaim, dan approval belum seragam
- Rekonsiliasi antara EPM, KN, dan Subdist rawan selisih
- Perlu jejak dokumen (memo, tagihan, approval) yang bisa diaudit

Project ini membangun proses + sistem agar SHP bisa **mengelola saldo DF dari EPM** dengan kontrol, transparansi, dan alur approval yang jelas.

---

## 6. Peta Sistem IT (Di Mana Fitur Di-Develop?)

Dari sisi IT, Development Fund **tidak dibuat di satu aplikasi saja**. Fitur dipecah ke **tiga tempat**:

```
┌─────────────┐      saldo masuk       ┌──────────────────────┐
│   MAVEN     │ ─────────────────────► │  BI                  │
│             │                        │  (Budget Integration)│
│ • Master    │                        │                      │
│ • Setting QP│                        │ • Terima budget/saldo│
└─────────────┘                        │ • Potong budget      │
                                       └──────────▲───────────┘
                                                  │
                                       potong saldo setelah klaim
                                                  │
                                       ┌──────────┴───────────┐
                                       │  KICAO KDS           │
                                       │                      │
                                       │ • Klaim + dokumen    │
                                       │ • Info MKPP / saldo  │
                                       └──────────────────────┘
```

### 6.1 Ringkasan peran tiap sistem

| Sistem | Peran utama | Contoh yang dikerjakan di sini |
|--------|-------------|-------------------------------|
| **MAVEN** | Setting **master** dan **QP** | Master Subdist, mapping parent–child, master Vendor (+ flag jalur klaim), Memo QP (create/close), setup terkait QP |
| **BI (Budget Integration)** | **Terima** dan **potong** budget | Inject/terima saldo DF per subdist dari realisasi QP/EPM; maintain saldo; potong saldo saat klaim matching; monitoring mutasi; mekanisme resign/reclass |
| **KICAO KDS** | Proses **klaim** | Create klaim (lampir dokumen, referensi MKPP), notifikasi sisa DF / boleh minus, tambahan 0,5% dari DPP |

### 6.2 Alur antar sistem (cara awam)

1. Di **MAVEN**, data master disiapkan dan QP di-setting / di-memo-kan.
2. Hasil funding/QP masuk ke **BI** sebagai saldo Development Fund per subdist → ini “rekening”-nya.
3. Saat activity selesai, klaim dibuat di **KICAO KDS**.
4. Setelah klaim valid/matching, **BI** yang memotong saldo (bukan push transaksi DF ke Oracle).

> **Catatan:** Memo activity (MKPP Type DF) dan approval berjenjang tetap bagian dari ekosistem proses KN; yang dipertegas di sini adalah **tiga titik develop utama**: MAVEN (master + QP), BI (saldo masuk/keluar), KICAO KDS (klaim).

---

## 7. Dari Mana Uangnya Berasal? (Funding)

Cara sederhana memahami sumber dana:

1. KN FA–Sales mengatur funding di EPM (setup harga selling-in).
2. Setup tersebut menciptakan **special discount** (margin/dana) di EPM.
3. Di **MAVEN**, CCD/tim terkait menyiapkan master subdist yang ikut program DF dan membuat **Memo QP**.
4. EPM (ETPM/Oracle) membuat **QP per subdist** berdasarkan memo.
5. Realisasi QP di-**inject / terima** di **BI (Budget Integration)** sebagai **Development Fund** per subdist.
6. Saldo DF per subdist siap dipakai untuk activity (setelah aturan saldo “hijau” / bisa digunakan terpenuhi).
7. Saat klaim di **KICAO KDS** selesai matching, **BI** memotong saldo.

**Prinsip funding (SOP):** funding hanya lewat 2 cara:

- kenaikan garansi margin, atau
- price increase.

**Sifat saldo DF di sistem:**

- Budget type = Development Fund
- Spesifik per Subdist (mengikuti data EPM)
- LOB bersifat glondongan / All Brand (**Z01**)

---

## 8. Untuk Apa Dananya Dipakai? (Activity)

Jenis activity yang didanai DF antara lain:

1. **SPG**
2. **Listing**
3. **Event**
4. **Strata Harga**
5. **Visibility**

**Catatan praktis:**

- 1 subdist bisa cover beberapa area (contoh: Bekasi cover Jawa Barat).
- Transaksi besar jangka pendek (SPG, EO) sering kolaborasi dengan brand/event.
- Setiap subdist diberi **0,5%** atas nilai transaksi yang keluar dari subdist (bukan dana cadangan diam di subdist).
- Pada klaim, ada tambahan **0,5% (configurable)** dari angka DPP tagihan yang diinput.

---

## 9. Alur Bisnis End-to-End

### 9.1 Fase A — Siapkan dana (dari EPM ke saldo DF)

```
Activity Plan (Sales)
        ↓
Funding di EPM (FA–Sales) → Special Discount
        ↓
Master + Memo QP Create / Close          ⟶  [MAVEN]
        ↓
Setting QP per Subdist (EPM / ETPM)
        ↓
Inject / terima Development Fund         ⟶  [BI]
        (saldo DF per Subdist)
```

### 9.2 Fase B — Pakai dana (memo → klaim → bayar)

```
CCD buat Memo Activity (MKPP Type DF)
        ↓
Activity jalan (Subdist / Vendor / pihak terkait)
        ↓
Subdist / Admin input Klaim + lampiran  ⟶  [KICAO KDS]
        ↓
(Opsional) KN User verifikasi tagihan jenis tertentu
        ↓
ABM / Cabang: cek & approve
        ↓
CF: verifikasi & approve payment
        ↓
Klaim Matching → potong saldo DF         ⟶  [BI]
        ↓
(Catatan: transaksi DF tidak di-push ke Oracle)
```

**Dua jalur tagihan vendor:**

| Jalur | Contoh | Keterangan |
|-------|--------|------------|
| Vendor → KN dulu → Subdist | SPG, e-commerce | Perlu verifikasi KN User terlebih dahulu |
| Vendor langsung ke Subdist | EO, Strata Harga | Bisa langsung ke subdist |

Perbedaan ini diatur lewat **flag di Master Vendor** di **MAVEN** (klaim ke KN User atau ke Subdist). ABM dapat notifikasi terkait setup ini.

### 9.3 Fase C — Jaga agar angka tetap benar (rekonsiliasi)

```
ABM rekonsiliasi saldo DF dengan Subdist
        ↓
FA & CCD cocokkan saldo DF               ⟶  pantauan di [BI]
        ↓
Koordinasi EPM untuk balancing Special Discount
        ↓
Dashboard / report mutasi & saldo per Subdist
```

**Retur barang Subdist ke EPM turut memotong saldo DF di BI.**

---

## 10. Aturan / SOP Penting

| No | Proses | Aturan singkat |
|----|--------|----------------|
| 1 | Activity Plan | Dibuat Sales + CCD; tidak double spending dengan MKT & Sales Expenses; horizon 3 bulan s.d. 1 tahun |
| 2 | Funding EPM | Hanya via kenaikan garansi margin atau price increase |
| 3 | Memo QP | Harus ada sebelum activity; sesuai list activity; perhitungkan % discount aman pajak; saran minimal per quarter |
| 4 | Setting QP | Harus ada lead time realisasi dari tanggal memo (SLA) |
| 5 | Maintain Saldo Subdist | Ada masa mengendap sebelum boleh dipakai; saldo “hijau” = bisa digunakan |
| 6 | Memo Activity | Harus cek saldo tersedia; memakai Budget Type Development Fund |
| 7 | Klaim Subdist | SLA **14 hari** setelah activity selesai / ditagihkan eksternal |
| 8 | Validasi Dokumen | SLA **7 hari** |
| 9 | Approve Payment | SLA **7 hari** |
| 10 | Rekonsiliasi | Bulanan atau lebih sering |

**Aturan tambahan dari keputusan meeting:**

- Pemakaian DF (Memo) memakai **MKPP Type DF**.
- MKPP **tidak wajib** merefer Memo Create QP; yang penting masih ada sisa saldo DF yang free.
- MKPP/klaim **boleh minus**, tetapi sistem harus **memberi notifikasi** sisa dana DF, sisa memo, dan besaran minus.
- LOB memakai **All Brand (Z01)**.
- Perlu mekanisme **subdist resign** (reclass budget) dan perlakuan **saldo akhir tahun** (habiskan / carry over / opsi lain) — sebagian masih perlu diputuskan.
- Memo manual bertanda tangan basah bisa multi-subdist; lampirannya template uploader yang menjadi MKPP per subdist.

---

## 11. Data Master yang Dibutuhkan

> Master data di-setting di **MAVEN**.

### 11.1 Master / Mapping Subdist

- Nama subdist
- Alamat & NPWP
- Region KN
- Kode subdist mengikuti kode EPM
- Joint group / mapping **Parent vs Child**
- Mapping **Parent vs Activity**
- Informasi PPN & PPh

### 11.2 Master Vendor

- Nama vendor (atau “Others” untuk sebagian kasus)
- Alamat & NPWP
- Region KN
- **Flag jalur klaim:** langsung ke KN User atau ke Subdist

---

## 12. Laporan yang Diharapkan Bisnis

### 12.1 Report Saldo Development Fund (list per subdist)

*(sumber saldo utama: **BI**)*

- Nama subdist
- Saldo awal
- Penambahan
- Pengurangan (klaim DPP + 0,5% / kolom terpisah; bisa di-drill ke detail klaim)
- Net mutasi
- Saldo akhir

### 12.2 Report Klaim Activity (per subdist)

*(sumber klaim utama: **KICAO KDS**)*

- Nomor memo
- Nama vendor
- Nomor & tanggal tagihan vendor
- Nilai DPP, PPN, PPh
- Tanggal create claim
- Nama/kode activity

### 12.3 Report lain yang disebut di proses

- Mutasi & saldo di Budget Integration (**BI**)
- Outstanding klaim (berdasarkan nomor & tanggal) di **KICAO KDS**
- Monitoring saldo per Subdist
- Rekonsiliasi saldo subdist + dashboard mutasi

---

## 13. Modul Proses di Sistem (Pemetaan ke MAVEN / BI / KICAO KDS)

Urutan kerja yang akan didukung sistem (dari timeline development), dipetakan ke tempat develop:

| No | Proses | Sistem | PIC bisnis / sistem | Bobot (indikatif) |
|----|--------|--------|---------------------|-------------------|
| 1 | User Requirement | — | Bisnis + IT | 10 |
| 2 | Create FSD | — | IT / Analis | — |
| 3 | Enhancement budget detail (Budget Type QP/DF, SubDist ID, hierarchy) | **BI** (+ terkait master/QP di **MAVEN**) | IT | — |
| 4 | Master Mapping Subdist | **MAVEN** | CSD – RAS | 10 |
| 5 | Master Vendor (+ flag jalur klaim) | **MAVEN** | CSD – RAS; ABM dapat notif | — |
| 6 | Transaction Memo QP (Create & Close) | **MAVEN** | CCD | 10 |
| 7 | Inject Development Fund + monitoring + resign | **BI** | System | 10 |
| 8 | Transaction MKPP (Budget Type DF) | Ekosistem KN / terkait budget di **BI** | CCD | — |
| 9 | Transaction Klaim (+ 0,5%, info sisa DF/memo) | **KICAO KDS** | Admin HO / Admin Subdist | — |
| 10 | Klaim Matching (potong saldo DF, tidak ke Oracle) | **BI** (dipicu hasil klaim KICAO KDS) | System (auto) | 20 |
| 11 | SIT → UAT → Go Live | Semua sistem | Semua pihak terkait | 10+10 |

### 13.1 Cheat-sheet: “Mau kerja apa → buka sistem mana?”

| Mau melakukan… | Buka sistem… |
|----------------|--------------|
| Setup master Subdist / Vendor / mapping | **MAVEN** |
| Setting / memo QP | **MAVEN** |
| Cek saldo DF masuk, mutasi, sisa budget | **BI** |
| Potongan budget setelah klaim | **BI** (otomatis via matching) |
| Input & proses klaim | **KICAO KDS** |

---

## 14. Cakupan Awal Subdist

Ada **17 subdist** yang masuk rencana cover. Ringkasan dari dokumen project:

- Total sales 2025 dan 2026 YTD May tercatat di deck project
- Rata-rata sales 17 subdist (YTD May 2026) sekitar **100 juta** (agregat area)
- Go-live awal difokuskan ke subdist tertentu (mis. **CSA & DSA** untuk cover Sirclo/FAS e-commerce), lalu diperluas

Contoh nama area/subdist yang disebut: Batam, Medan, Bekasi, Tangerang, Surabaya, Banjarmasin, Samarinda, Makassar, Palopo, Gorontalo, Kudus, Solo, Lampung, Palembang, dan grup terkait.

---

## 15. Timeline Bisnis (Ringkas)

| Waktu | Target |
|-------|--------|
| Juli 2026 | Visit & dealing subdist; finalisasi flow & agreement |
| September 2026 | Go live sistem (fase awal) |
| s.d. Maret 2027 | Transisi; sebagian proses masih bisa manual |
| April 2027 | Target go live penuh bersama pengembangan aplikasi commercial |

---

## 16. Analogi Sederhana (untuk Orang Awam)

Bayangkan DF seperti **rekening bersama per subdist**:

1. Di **MAVEN**, data “pemilik rekening” (master) dan “izin isi dana” (QP) di-setting.
2. EPM “mengisi rekening”; saldo tercatat di **BI**.
3. CCD “membuka izin belanja” lewat memo activity (MKPP).
4. Subdist “belanja” untuk activity lalu mengajukan klaim di **KICAO KDS**.
5. ABM & CF “cek struk” sebelum diakui.
6. **BI** memotong saldo rekening (tanpa mengirim transaksi DF ke Oracle).
7. FA & CCD setiap bulan “cocokkan buku” dengan EPM dan subdist.

Tujuannya: dana terpakai untuk activity yang benar, terdokumentasi, dan saldonya selalu bisa dijelaskan.

---

## 17. Pertanyaan Terbuka / Keputusan yang Masih Perlu Diluruskan

Beberapa poin dari MOM masih perlu kepastian bisnis:

1. Apakah KN bisa mendapat update realtime Special Discount & Trade Discount dari EPM?
2. Perlakuan saldo akhir tahun (dihabiskan, carry over, atau opsi lain)?
3. Legalitas subdist untuk cover perpajakan lintas region?
4. Detail agreement KN–Subdist dan vendor (termasuk e-commerce seperti Sirclo)?
5. Finalisasi mekanisme subdist resign / reclass budget di operasional sehari-hari
6. Detail integrasi teknis antar **MAVEN ↔ BI ↔ KICAO KDS** (timing sync, API/file, ownership data)

---

## 18. Referensi

- `Document/2026.07.21-Project Development Fund Subdist.pdf` — flow, SOP, MOM, list subdist
- `Document/TimeLine_DevelopmentFund.xlsx` — breakdown task development DF
- Klarifikasi istilah bisnis & sistem:
  - **EPM** = Enseval Putera Megatrading (nama perusahaan, bukan sistem)
  - **CCD** = Channel & Customer Development
  - **FA** = Financial Accounting
  - **ABM** = Area Business Manager
  - **MAVEN** = setting master & QP
  - **BI** = Budget Integration — terima & potong budget
  - **KICAO KDS** = proses klaim

---

*Dokumen ini adalah dokumentasi bisnis + peta sistem tingkat tinggi. Detail layar, API, database, dan endpoint per sistem (MAVEN / BI / KICAO KDS) akan ditulis terpisah di dokumen FSD/teknis.*

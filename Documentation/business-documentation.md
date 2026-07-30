# Business Documentation
## Project Development Fund Subdist — Kalbe Nutritionals (SHP)

| | |
|---|---|
| **Versi dokumen** | 1.2 |
| **Tanggal update** | 30 Juli 2026 |
| **Sumber utama** | `Document/2026.07.30-Development Fund KN - Subdist.pdf` (Objectives, Mekanisme, Creating Demand, Rules) |
| **Sumber pendukung** | `Document/2026.07.21-Project Development Fund Subdist.pdf`, `Document/TimeLine_DevelopmentFund.xlsx` |
| **Lampiran terkait** | [Creating-Demand-MPP-Rules.md](./Creating-Demand-MPP-Rules.md) |
| **Tujuan dokumen** | Menjelaskan bisnis Development Fund Subdist dengan bahasa yang mudah dipahami, termasuk untuk pembaca non-teknis, plus peta sistem IT tempat fitur di-develop |

---

## 1. Ringkasan Singkat (Bisa Dibaca dalam 1 Menit)

Kalbe Nutritionals (**SHP / KN**) mengelola **Development Fund (DF)** — mekanisme pembiayaan yang **terkontrol dan kolaboratif** untuk mendukung pengembangan pasar (**Creating Demand**) serta **mempercepat pembayaran** biaya dari KN kepada **Subdist**.

Dana DF terbentuk dari **tambahan diskon 5%–30% on faktur** (berdasarkan HNA penjualan EPM ke Subdist). Diskon itu adalah dana **milik KN**, dikelola secara operasional di Subdist sesuai kesepakatan (**Creating Demand**), lalu dipakai untuk program tertentu lewat surat **MPP (Marketing Project Plan)**.

Alur besarnya:

1. KN meminta setting diskon Subdist ke **EPM**; EPM memberi diskon **5%–30%** → mengisi **Saldo DF**.
2. Master & QP / kesepakatan di-setting di **MAVEN**; saldo tercatat di **BI (Budget Integration)**.
3. KN menerbitkan dasar pemakaian program (**MPP** / MKPP Type DF).
4. Subdist membayar activity lalu mengajukan **Payment Approval (PA)** / klaim di **KICAO KDS**.
5. KN memverifikasi & menyetujui secara berjenjang (User KN → ABM → HO).
6. **Saldo DF dipotong hanya setelah PA approved** (di BI / komunikasi KICAO KN).
7. Tim FA / CCD / EPM melakukan **rekonsiliasi** Saldo DF agar angka tetap cocok.
8. Sisa saldo akhir tahun **carry over** ke tahun berikutnya.

**Tiga sistem utama (sisi IT):**

| Sistem | Peran singkat |
|--------|----------------|
| **MAVEN** | Setting master & QP / dukungan data DF |
| **BI (Budget Integration)** | Terima budget (saldo masuk) & potong budget (saldo keluar) |
| **KICAO KDS / KICAO KN** | Klaim, MPP/MKPP, Payment Approval, komunikasi saldo |

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
| **DF / Development Fund / DFKN** | Dana pengembangan Creating Demand per subdist; milik KN, dikelola operasional di Subdist sesuai kesepakatan |
| **Creating Demand** | Surat/kesepakatan resmi KN→Subdist: dukungan DF, pembiayaan, dan besaran tambahan diskon (lihat lampiran) |
| **MPP / Marketing Project Plan** | Surat resmi KN→Subdist untuk membayar program tertentu memakai dana DF; pemakaian DF wajib berdasar MPP |
| **Payment Approval (PA)** | Mekanisme approval pembayaran program; **pemotongan Saldo DF hanya setelah PA approved** |
| **QP** | Mekanisme/instruksi promo-discount di sisi EPM yang menghasilkan sumber dana DF (biasanya di-setting per subdist di Oracle/ETPM) |
| **ETPM** | Sistem Trade Promotion Management di EPM; tempat QP dijalankan/dilaporkan |
| **Special Discount / Diskon tambahan** | Margin/dana di EPM; pada deck 30 Jul dinyatakan sebagai **5%–30% on faktur** (HNA EPM ke Subdist) |
| **Trade Discount** | Potongan perdagangan; dipakai saat menghitung net saldo (special discount dikurangi trade discount) |
| **Net Saldo PL KND** | Hasil special discount dikurangi trade discount pada report PL KND EPM |
| **Selling-in** | Penjualan dari principal/distributor ke subdist (bukan ke konsumen akhir) |
| **Memo QP** | Memo dari CCD sebagai dasar EPM membuat/setting QP per subdist; ada proses create & close |
| **Memo Activity / MKPP** | Memo resmi untuk memakai saldo DF pada activity tertentu (di sistem KICAO; bisnis setara MPP) |
| **MKPP Type DF** | Jenis MKPP khusus pemakaian Development Fund |
| **Klaim** | Pengajuan penggantian biaya activity oleh subdist, lengkap dengan dokumen (masuk jalur PA) |
| **Klaim Matching** | Proses sistem yang mencocokkan klaim; untuk transaksi DF **tidak push ke Oracle**, hanya memotong saldo DF di BI setelah PA approved |
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
| **SLA** | Batas waktu layanan PA: User KN **5 hari**, klaim Subdist **5 hari**, ABM **10 hari**, HO **10 hari** (deck 30 Jul 2026) |
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

Project ini membangun proses + sistem agar SHP bisa **mengelola saldo DF dari EPM** dengan kontrol, transparansi, dan alur approval yang jelas — sekaligus **mempercepat pembayaran** biaya Creating Demand dari KN kepada Subdist.

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
| **KICAO KDS / KICAO KN** | Proses **klaim**, **MPP/MKPP**, **Payment Approval**, komunikasi saldo | Create klaim (lampir dokumen, referensi MPP/MKPP), PA berjenjang, notifikasi sisa DF / boleh minus, fee 0,5% dari DPP, komunikasi Saldo DF (Rule deck 30 Jul) |

### 6.2 Alur antar sistem (cara awam)

1. Di **MAVEN**, data master disiapkan dan QP di-setting / di-memo-kan.
2. Hasil funding/QP masuk ke **BI** sebagai saldo Development Fund per subdist → ini “rekening”-nya.
3. Saat activity selesai, klaim dibuat di **KICAO KDS**.
4. Setelah klaim valid/matching, **BI** yang memotong saldo (bukan push transaksi DF ke Oracle).

> **Catatan:** Memo activity (MKPP Type DF) dan approval berjenjang tetap bagian dari ekosistem proses KN; yang dipertegas di sini adalah **tiga titik develop utama**: MAVEN (master + QP), BI (saldo masuk/keluar), KICAO KDS (klaim).

---

## 7. Dari Mana Uangnya Berasal? (Funding)

Cara sederhana memahami sumber dana (diselaraskan deck 30 Jul + SOP sebelumnya):

1. KN mengajukan **Request Disc. Subdist** ke EPM (funding diatur FA–Sales / setup harga selling-in).
2. EPM memberi **diskon tambahan 5%–30% on faktur** (berdasarkan HNA penjualan EPM ke Subdist) — ini mengisi Saldo DF.
3. Di **MAVEN**, CCD/tim terkait menyiapkan master subdist yang ikut program DF dan membuat **Memo QP** / dukungan kesepakatan **Creating Demand**.
4. EPM (ETPM/Oracle) membuat **QP per subdist** berdasarkan memo.
5. Realisasi QP/diskon di-**inject / terima** di **BI (Budget Integration)** sebagai **Development Fund** per subdist.
6. Saldo DF per subdist siap dipakai untuk activity (setelah aturan saldo “hijau” / bisa digunakan terpenuhi) — secara operasional dana dikelola di Subdist, **kepemilikan tetap KN**.
7. Setelah **Payment Approval** di jalur **KICAO** approved + matching, **BI** memotong saldo.

**Prinsip funding (SOP):** funding hanya lewat 2 cara:

- kenaikan garansi margin, atau
- price increase.

**Sifat saldo DF di sistem:**

- Budget type = Development Fund
- Spesifik per Subdist (mengikuti data EPM)
- LOB bersifat glondongan / All Brand (**Z01**)
- Range diskon tambahan di kesepakatan Creating Demand: **5%–30%**

---

## 8. Untuk Apa Dananya Dipakai? (Activity)

Jenis activity Creating Demand yang didanai DF (deck 30 Jul + daftar sebelumnya):

1. **SPG**
2. **E-Commerce Fee**
3. **Visibility / Display**
4. **Event Organizer**
5. **Other Creating Demand Activities** (termasuk Listing, Strata Harga, dll. sesuai memo program)

**Catatan praktis:**

- Pemakaian DF **wajib** didasari surat **MPP Program** (dekat MKPP Type DF di KICAO).
- 1 subdist bisa cover beberapa area (contoh: Bekasi cover Jawa Barat).
- Transaksi besar jangka pendek (SPG, EO) sering kolaborasi dengan brand/event.
- Setiap Payment Approval / pembayaran activity dikenakan fee **0,5%** dari nilai program **sebelum PPN** (memotong sebagian saldo DF per activity).
- Pada klaim di sistem, fee **0,5% (configurable)** dari angka DPP tagihan yang diinput.

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

### 9.2 Fase B — Pakai dana (MPP → klaim / PA → potong saldo)

```
CCD / KN buat MPP / Memo Activity (MKPP Type DF)
        ↓
Activity jalan (Subdist / Vendor / pihak terkait)
        ↓
Subdist bayar lalu ajukan Klaim + Payment Approval  ⟶  [KICAO KDS]
        ↓
(Opsional) KN User / Business Owner verifikasi tagihan (SLA 5 hari)
        ↓
ABM / Cabang: cek & approve (SLA 10 hari)
        ↓
HO / CF: verifikasi & approve payment (SLA 10 hari)
        ↓
PA Approved → Klaim Matching → potong saldo DF         ⟶  [BI]
        ↓
(Catatan: transaksi DF tidak di-push ke Oracle)
```

**Dua jalur tagihan vendor:**

| Jalur | Contoh | Keterangan |
|-------|--------|------------|
| Vendor → KN dulu → Subdist | SPG, e-commerce | Perlu verifikasi KN User terlebih dahulu |
| Vendor langsung ke Subdist | EO, Visibility | Bisa langsung ke subdist |

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
| 2 | Funding EPM | Hanya via kenaikan garansi margin atau price increase; diskon tambahan Creating Demand **5%–30% on faktur** |
| 3 | Creating Demand / Memo QP | Harus ada kesepakatan & besaran diskon; sesuai list activity; perhitungkan % discount aman pajak |
| 4 | Setting QP | Harus ada lead time realisasi dari tanggal memo (SLA) |
| 5 | Maintain Saldo Subdist | Ada masa mengendap sebelum boleh dipakai; saldo “hijau” = bisa digunakan; pengelolaan via komunikasi **KICAO KN** |
| 6 | MPP / Memo Activity | Pemakaian DF **wajib** surat MPP Program; cek saldo tersedia; Budget Type Development Fund |
| 7 | Klaim / PA — User KN | SLA **5 hari** setelah terima invoice |
| 8 | Klaim Distributor / Subdist | SLA **5 hari** setelah terima invoice pihak ketiga atau setelah cek KN |
| 9 | Approval ABM | SLA **10 hari** setelah pengajuan Distributor |
| 10 | Approve HO KN (Payment) | SLA **10 hari** setelah approval ABM |
| 11 | Potong Saldo DF | Hanya **setelah** Payment Approval **approved** |
| 12 | Rekonsiliasi | Bulanan atau lebih sering; Saldo DF → Rekonsiliasi → KN |
| 13 | Akhir tahun | Sisa saldo **Carry Over** ke tahun berikutnya (atau dibayar ke pihak ditunjuk KN per surat Creating Demand) |

**Aturan tambahan (deck 30 Jul + keputusan meeting sebelumnya):**

- Saldo DF adalah **dana KN** untuk Creating Demand sesuai kebutuhan.
- Pemakaian memakai **MPP** / **MKPP Type DF**.
- MKPP **tidak wajib** merefer Memo Create QP; yang penting masih ada sisa saldo DF yang free — tetapi **wajib** ada surat MPP Program.
- MKPP/klaim **boleh minus**, tetapi sistem harus **memberi notifikasi** sisa dana DF, sisa memo, dan besaran minus.
- LOB memakai **All Brand (Z01)**.
- Fee **0,5%** sebelum PPN per PA/activity.
- Jika kerja sama berakhir: sisa saldo dikembalikan ke KN.
- Perlu mekanisme **subdist resign** (reclass budget).
- Memo manual bertanda tangan basah bisa multi-subdist; lampirannya template uploader yang menjadi MKPP/MPP per subdist.

> **Supersede:** SLA 14 / 7 / 7 hari pada dokumen v1.1 diganti oleh lead time PA deck **30 Jul 2026** (5 / 5 / 10 / 10) di atas.

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
| Input & proses klaim / Payment Approval | **KICAO KDS** |
| Cek dasar pemakaian (MPP / MKPP Type DF) | **KICAO KDS** / ekosistem KICAO KN |

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

Bayangkan DF seperti **rekening bersama per subdist** (milik KN, dikelola di Subdist):

1. Di **MAVEN**, data “pemilik rekening” (master) dan “izin isi dana” (QP / Creating Demand) di-setting.
2. EPM “mengisi rekening” lewat diskon 5%–30%; saldo tercatat di **BI**.
3. KN “membuka izin belanja” lewat **MPP** / memo activity (MKPP).
4. Subdist “belanja” untuk activity lalu mengajukan klaim + **Payment Approval** di **KICAO KDS**.
5. User KN, ABM & HO “cek struk” sebelum diakui (SLA 5 / 10 / 10).
6. **BI** memotong saldo rekening **setelah PA approved** (tanpa mengirim transaksi DF ke Oracle).
7. FA & CCD setiap bulan “cocokkan buku” dengan EPM dan subdist; sisa akhir tahun **carry over**.

Tujuannya: dana terpakai untuk Creating Demand yang benar, terdokumentasi, pembayarannya lebih cepat, dan saldonya selalu bisa dijelaskan.

---

## 17. Pertanyaan Terbuka / Keputusan yang Masih Perlu Diluruskan

Beberapa poin masih perlu kepastian bisnis:

1. Apakah KN bisa mendapat update realtime Special Discount & Trade Discount dari EPM?
2. ~~Perlakuan saldo akhir tahun~~ — **diputuskan (30 Jul 2026):** Carry Over ke tahun berikutnya (opsi bayar ke pihak ditunjuk KN tetap ada di surat Creating Demand).
3. Legalitas subdist untuk cover perpajakan lintas region?
4. Detail agreement KN–Subdist dan vendor (termasuk e-commerce seperti Sirclo)?
5. Finalisasi mekanisme subdist resign / reclass budget di operasional sehari-hari
6. Detail integrasi teknis antar **MAVEN ↔ BI ↔ KICAO KDS** (timing sync, API/file, ownership data) — Rule 6 mengunci bahwa pengelolaan saldo memakai komunikasi sistem KICAO KN, detail kontrak API masih perlu

---

## 18. Referensi

- `Document/2026.07.30-Development Fund KN - Subdist.pdf` — Objectives, Mekanisme, Draft Creating Demand, Rules (**sumber kebenaran update**)
- [Creating-Demand-MPP-Rules.md](./Creating-Demand-MPP-Rules.md) — lampiran ringkas deck 30 Jul
- `Document/2026.07.21-Project Development Fund Subdist.pdf` — flow, SOP, MOM, list subdist (sumber awal)
- `Document/TimeLine_DevelopmentFund.xlsx` — breakdown task development DF
- Klarifikasi istilah bisnis & sistem:
  - **EPM** = Enseval Putera Megatrading (nama perusahaan, bukan sistem)
  - **CCD** = Channel & Customer Development
  - **FA** = Financial Accounting
  - **ABM** = Area Business Manager
  - **Creating Demand** = surat kesepakatan DF + besaran diskon
  - **MPP** = Marketing Project Plan (dasar pemakaian / bayar program)
  - **PA** = Payment Approval (syarat potong saldo)
  - **MAVEN** = setting master & QP
  - **BI** = Budget Integration — terima & potong budget
  - **KICAO KDS / KICAO KN** = klaim, MPP/MKPP, PA, komunikasi saldo

---

*Dokumen ini adalah dokumentasi bisnis + peta sistem tingkat tinggi. Detail layar, API, database, dan endpoint per sistem (MAVEN / BI / KICAO KDS) akan ditulis terpisah di dokumen FSD/teknis. Isi Creating Demand / MPP / Rules yang rinci ada di lampiran.*

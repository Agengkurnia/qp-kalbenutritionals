# Functional Specification Document (FSD)
## Master Data — Development Fund Subdist (MAVEN)

| | |
|---|---|
| **Dokumen** | FSD Master Data (bagian 1) |
| **Produk** | Development Fund Subdist — Kalbe Nutritionals (SHP) |
| **Sistem** | **MAVEN** (setting master) |
| **Versi** | 0.6 (SPA Index↔Detail; column search; Action pencil) |
| **Tanggal** | 3 Agustus 2026 |
| **Sumber** | Prototype `QP Kalbe Nutritionals` + implementasi MAVEN + `Documentation/business-documentation.md` |
| **Status** | Draft untuk kepentingan penyusunan FSD formal |

> Dokumen ini mendeskripsikan **fungsi master data** yang sudah / sedang dilayani di prototype MAVEN. Bagian Transaction (Memo QP, Monitoring Claim EPM, Inject DF) akan dilanjutkan di dokumen FSD terpisah.

---

## 1. Tujuan

Menyediakan spesifikasi fungsional master data agar:

1. Tim bisnis (CSD / RAS, CCD) memahami cara kerja Mapping Subdist.
2. Tim IT dapat menyusun FSD formal / development MAVEN.
3. Scope prototype vs dokumen bisnis awal tercatat jelas (termasuk yang di-hold / dihapus dari UI).

---

## 2. Ruang Lingkup

### 2.1 In scope (Master)

| Modul | Menu | Status prototype |
|-------|------|------------------|
| **Mapping Subdist** | Master → Mapping Subdist | Implemented |
| **Master Activity (LOV)** | Tidak ada menu; dipakai di tab Mapping Activity | Mock seed (siap diganti Master Data API) |

### 2.2 Out of scope / di-hold di prototype Master

| Modul | Keterangan |
|-------|------------|
| **Master Vendor** | Disebut di dokumen bisnis; **menu dihapus** dari prototype. Flag jalur klaim belum di UI. |
| **Jenis Activity (CRUD)** | Menu dihapus; activity hanya dipilih via LOV di form Mapping Subdist. |
| Field **NPWP, PPN, PPh** pada Subdist | Ada di dokumen bisnis awal; **tidak ada di form** prototype (keputusan revisi UI). |

---

## 3. Aktor & Hak Akses

| Role (prototype) | Hak di Mapping Subdist |
|------------------|------------------------|
| **Administrator** | Full: list, tambah, ubah, mapping child/activity, lepas + koreksi BI (mock) |
| **CSD / RAS** | Full mapping; lepas child **tanpa** koreksi periode (atau view impact saja — production: PIC master) |
| **CCD / FA** | Lepas child **dengan** periode koreksi ke BI (mock) |
| Role lain | **View only**: lihat detail; tanpa Tambah / Simpan / Add / Lepas |

*Catatan:* Role diambil dari `localStorage.currentRole` (prototype). Di FSD formal MAVEN, sesuaikan dengan matrix otorisasi production.

---

## 4. Modul: Mapping Subdist

### 4.1 Ringkasan fungsi

Modul untuk:

1. Mendaftarkan / memelihara **Subdist parent** yang ikut program Development Fund.
2. Mengaitkan identitas Subdist ke data **Bosnet (KMMD)**.
3. Mengatur relasi **Parent–Child** (Joint Group).
4. Mengatur relasi **Parent–Activity** (jenis activity yang boleh dipakai Subdist tersebut).

**Sistem target production:** MAVEN.  
**PIC bisnis:** CSD – RAS.

### 4.2 Navigasi & halaman

| No | Halaman | Path prototype | Fungsi |
|----|---------|----------------|--------|
| 1 | Index + Detail (SPA) | `masters/mapping-subdist.html` | List parent + filter + column search; Detail di panel yang sama |
| 2 | Deep-link edit | `masters/mapping-subdist.html?id={id}` | Buka Panel Detail langsung |
| 3 | Deep-link tambah | `masters/mapping-subdist.html?new=1` | Buka Panel Detail mode Tambah |
| 4 | Form lama (redirect) | `masters/mapping-subdist-form.html` | Redirect ke SPA (`?id=` / `?new=1`) |

**Produksi MAVEN:** Index + Detail SPA di `/DF/MappingSubdist` (`PanelIndex` / `PanelDetail`).

---

### 4.3 Use case

#### UC-MD-01 — Lihat daftar Mapping Subdist (Index)

**Aktor:** semua role yang punya akses menu.  
**Prekondisi:** User login / pilih role (prototype).

**Alur utama:**
1. User membuka Master → Mapping Subdist.
2. Sistem menampilkan **hanya record Parent** (`Parent = YA`).
3. User dapat memfilter **Region** dan **Group / Non Group** (tombol Filter).
4. User dapat **search per kolom** (Kode KMMD, Nama KMMD, Nama Group, Region) via baris search di bawah header tabel (klik ikon search atau Enter).
5. User membuka detail via **tombol Action (pencil)** pada baris. Kode KMMD ditampilkan plain text (bukan hyperlink).

**Aturan:**
- Child **tidak** ditampilkan di index.
- Tombol **Delete tidak tersedia** di index (hapus fisik tidak didukung di UI).
- Kolom **Titik** tidak ditampilkan di index.
- Index ↔ Detail tanpa pindah halaman (SPA); Kembali mengembalikan ke list yang di-refresh.

**Kolom list (informasi):**

| Kolom | Keterangan |
|-------|------------|
| Action | Tombol Edit (pencil) |
| Kode KMMD | Kode Bosnet (`SubdistID`) |
| Nama KMMD | Nama Subdist / KMMD |
| Group | Badge Group / Non Group |
| Nama Group | Nama joint group |
| Region | Region |
| Child | Jumlah child ter-mapping |
| Activity | Jumlah activity ter-mapping |

---

#### UC-MD-02 — Tambah Subdist Parent

**Aktor:** Administrator, CSD / RAS.  
**Prekondisi:** Akses edit.  
**Route MAVEN:** `/DF/MappingSubdist/Detail`

**Alur utama:**
1. User klik **Tambah**.
2. User membuka LOV **Kode KMMD (Bosnet)** (`vw_Outlet_Bosnet` via ConsoDWH) dan memilih satu baris.
3. Sistem mengisi otomatis (**disabled** / tidak bisa diketik): Kode KMMD (`SubdistID`), Nama KMMD (`SubdistName`), Tipe KMMD (`TypeSubDistID`), Region, Kode Branch EPM (`BranchESI`), Branch EPM (`BranchNameESI`), **ShipTo / OutletID** (`OutletID` → `txtShipToSiteUseId`, hidden), Alamat (`Address` — masih editable).
4. User mengisi **Tipe Group** (Group / Non Group).
5. Jika Group: user mengisi **Nama Group**.
6. User dapat mengubah Alamat dan status Aktif.
7. User Simpan.

**Aturan bisnis:**
- Identitas KMMD **hanya dari Bosnet** (tidak diketik manual); field identitas memakai kontrol **disabled** (bukan readonly) agar visual jelas non-editable.
- Saat pilih LOV Bosnet, sistem menyimpan `OutletID` → `txtShipToSiteUseId` (kunci match Monitoring Claim EPM).
- Placeholder identitas: **Autopopulate** (tanpa menyebut nama kolom sumber).
- Field **Titik** dihapus dari UI (tidak ada di view Bosnet production).
- LOV Bosnet **tidak menampilkan** SubdistID yang sudah ada di mapping (`bolActive`).
- LOV Bosnet: DataTables + pagination; kolom Action di kiri; Active ditampilkan badge `true`/`false`.
- Setelah tersimpan / mode edit: identitas Bosnet terkunci; LOV disembunyikan/disabled.
- Field NPWP / PPN / PPh **tidak ada**.

**Validasi:**
- Kode KMMD + Nama wajib (via LOV).
- Tipe Group wajib.
- Jika Group: Nama Group wajib.

---

#### UC-MD-03 — Ubah Subdist Parent

**Aktor:** Administrator, CSD / RAS.

**Alur:**
1. User buka detail dari index (tombol Action pencil / deep-link `?id=`).
2. Field identitas Bosnet **disabled**; LOV Kode KMMD disabled.
3. User dapat mengubah Group, Nama Group, Alamat, Aktif, serta mapping child/activity.
4. User Simpan. Tombol **Kembali** / **Simpan** memakai ikon.

---

#### UC-MD-04 — Mapping Child (Parent–Child)

**Aktor:** Administrator, CSD / RAS.  
**Prekondisi:** Parent sudah tersimpan.  
**UI:** Tab Mapping Child memakai DataTables (pagination + empty state). Kolom: **Action** (kiri, tombol Lepas + ikon), Kode KMMD, Nama KMMD, Linked At.

**Alur tambah child (MAVEN production — tanpa CSV historis di fase ini):**
1. Pada tab **Mapping Child**, user klik **Add** (ikon plus).
2. Popup DataTables menampilkan kandidat dari **`vw_Outlet_Bosnet`** (Active = true; exclude yang sudah ter-mapping).
3. User multi-select child lalu **Tambahkan**.
4. Sistem menautkan child (`bolIsParent = false`, `refParent…` = parent) dengan `dtLinkedAt` = tanggal hari ini.

**Alur lepas child:**
1. User klik **Lepas** → konfirmasi **SweetAlert** (bukan `confirm` browser).
2. Soft unlink (`bolActive = false`).

**Filter kandidat popup:**

| Ditampilkan | Tidak ditampilkan |
|-------------|-------------------|
| Outlet Bosnet aktif yang **belum ada di mapping** | Diri sendiri (parent yang dibuka) |
| | Yang **sudah jadi parent/child** aktif |
| | Yang **Non Group** (standalone) |
| | Parent **Group** lain |
| | Child yang **sudah ter-link** ke parent ini |

**Alur lepas child (sederhana — tanpa dampak injected):**
1. User klik **Lepas** pada baris child.
2. Sistem cek dampak mutasi DF injected (mock BI) terkait mapping parent–child.
3. Jika **tidak ada** dampak: konfirmasi (Ya, lepas / Batal) → relasi dilepas; child menjadi standalone Non Group.

**Aturan tambahan:**
- Mode Parent untuk Group maupun Non Group **boleh punya child**.
- Jika tipe Group: Nama Group harus terisi sebelum Add child.
- `linkedAt` = tanggal awal bulan efektif link (batas koreksi unmap).

---

#### UC-MD-04b — Lepas Child dengan Koreksi Periode (ke BI mock)

**Aktor:** Administrator, CCD / FA (koreksi BI).  
**Prekondisi:** Ada mutasi DF injected yang terkait child / parent mapping.

**Alur:**
1. User klik **Lepas** pada baris child.
2. Sistem mendeteksi ada dampak → membuka **wizard**:
   - **Tanggal efektif lepas** = **hari ini (WIB), fixed** (tidak dipilih user) — cut-off mapping ke depan.
   - **Periode koreksi** = **bulan dari → bulan sampai** (nama bulan), dalam masa child ter-link s/d bulan berjalan.
3. Sistem menampilkan **impact**: nilai dikoreksi, sisa budget, flag **mines** bila proyeksi sisa &lt; 0.
4. User konfirmasi (acknowledge mines bila perlu) → post **mutasi koreksi** ke BI mock.
5. Jika koreksi **sukses** → relasi dilepas + audit. Jika **gagal** → mapping **tidak** dilepas.

**Catatan:**
- Efektif lepas (hari ini) dan scope koreksi (rentang bulan) terpisah.
- Koreksi = mutasi ledger, bukan hard-delete.
- Lepas activity (**UC-MD-05**) tetap konfirmasi sederhana.

---

#### UC-MD-05 — Mapping Activity (Parent–Activity)

**Aktor:** Administrator, CSD / RAS.  
**Prekondisi:** Mode Parent; parent tersimpan.

**Alur:**
1. Tab **Mapping Activity** → **Add**.
2. Popup LOV dari **Master Activity** (prototype: seed; production: Master Data API).
3. Hanya activity **aktif** yang belum ter-mapping ke parent ini.
4. User pilih → simpan di array `activities` pada parent.
5. **Lepas** memakai konfirmasi yang sama seperti child.

**Atribut activity yang ditampilkan:** Kode, Nama, Kategori, Deskripsi.

---

### 4.4 Aturan bisnis ringkas (BR)

| ID | Aturan |
|----|--------|
| BR-MD-01 | Index hanya menampilkan Parent (`Parent = YA`). |
| BR-MD-02 | Identitas Subdist bersumber dari Bosnet; tidak diinput bebas. |
| BR-MD-03 | Satu `kodeKmmd` hanya boleh sekali di mapping. |
| BR-MD-04 | Group Parent dan Non Group sama-sama dapat memetakan child & activity. |
| BR-MD-05 | Kandidat child popup = belum punya parent dan bukan Non Group / Parent Group lain. |
| BR-MD-06 | Lepas child/activity wajib konfirmasi **SweetAlert**. |
| BR-MD-07 | Tidak ada delete record dari index; tidak ada kolom Aksi Edit di index (navigasi via Kode KMMD). |
| BR-MD-08 | NPWP / PPN / PPh tidak dikelola di form Mapping Subdist. |
| BR-MD-19 | Field identitas Bosnet ditampilkan **disabled**; placeholder **Autopopulate**. |
| BR-MD-20 | Field Titik dihapus dari UI Index/Detail (tidak tersedia di `vw_Outlet_Bosnet`). |
| BR-MD-21 | LOV Bosnet / grid Child / Activity / popup pick memakai DataTables + pagination + empty state. |
| BR-MD-09 | Lepas child dengan dampak: wizard wajib; efektif lepas = hari ini (fixed); koreksi = bulan dari–sampai. |
| BR-MD-10 | Rentang bulan koreksi hanya dalam masa child ter-link s/d bulan berjalan; di luar → ditolak. |
| BR-MD-11 | Unmap dengan dampak hanya setelah mutasi koreksi BI (mock) sukses (atomic). |
| BR-MD-12 | Koreksi unmap = mutasi ledger (− / reclass), bukan hard-delete. |
| BR-MD-13 | Proyeksi sisa &lt; 0 → warning mines; lanjut hanya dengan acknowledge. |
| BR-MD-14 | Add child: wajib pilih Bulan saat ini atau Periode sebelumnya. |
| BR-MD-15 | Periode sebelumnya: wajib satu nama bulan + upload CSV LISTING_CLAIM; format sama Monitoring. |
| BR-MD-16 | CSV historis divalidasi cocok identity branch/child; `TRX_DATE` mayoritas harus di bulan dipilih. |
| BR-MD-17 | Add historis: preview impact wajib sebelum commit link + inject mock. |
| BR-MD-18 | `linkedAt` = `YYYY-MM-01` bulan efektif (bulan ini atau bulan historis). |

---

### 4.5 Model data (konseptual)

#### Entity: MappingSubdist

| Atribut | Tipe / contoh | Sumber | Keterangan |
|---------|---------------|--------|------------|
| `id` | string | Sistem / = kodeKmmd | Identifier |
| `kodeKmmd` | string | Bosnet `SubdistID` | PK bisnis |
| `namaKmmd` | string | Bosnet `SubdistName` | |
| `tipeKmmd` | string | Bosnet `TypeSubDistID` | |
| `region` | string | Bosnet `Region` | |
| `kodeBranch` | string | Bosnet `BranchESI` | Kode branch EPM |
| `branchEpm` | string | Bosnet `BranchNameESI` | Nama branch EPM |
| `shipToSiteUseId` / `txtShipToSiteUseId` | string | Bosnet `OutletID` | Kunci match CSV `SHIP_TO_SITE_USE_ID` (Monitoring) |
| `alamat` | string | Bosnet `Address` | Editable setelah autofill |
| `groupType` | Group \| Non Group | User | |
| `parent` | YA \| TIDAK | User / sistem | YA = tampil di index |
| `parentKode` | string \| null | Sistem | Diisi jika child |
| `namaGroup` | string | User | Joint group; `Non Group` jika standalone |
| `alamat` | text | User | |
| `active` | boolean | User | |
| `activities` | array | User + Master Activity | Mapping activity |
| `linkedAt` | date string (`YYYY-MM-01`) \| null | Sistem | Awal bulan efektif link (batas koreksi unmap) |

#### Relasi

```
MappingSubdist (Parent YA)
    │
    ├──< child MappingSubdist (parent=TIDAK, parentKode=parent.id)
    │
    └──< activities[]  (referensi Master Activity)
```

#### Entity: MasterActivity (referensi)

| Atribut | Keterangan |
|---------|------------|
| `id` / `kode` | Identifier |
| `nama` | Nama activity |
| `kategori` | Mis. Promotion, Trade, Digital |
| `deskripsi` | Opsional |
| `active` | Hanya yang aktif muncul di LOV |

*Production:* diganti endpoint Master Data API. Prototype: `MasterActivitySeed`.

---

### 4.6 Integrasi

| Integrasi | Arah | Keterangan |
|-----------|------|------------|
| **Bosnet (KMMD)** | Inbound LOV | Sumber identitas Subdist; prototype = seed + extra mock |
| **Master Data API (Activity)** | Inbound LOV | Jenis activity; prototype = seed |
| **EPM Branch** | Via field Bosnet | `kodeBranch` / `branchEpm` atribut tampilan; match Monitoring memakai `shipToSiteUseId` (= `OutletID`) |
| **BI / KICAO** | Outbound koreksi (mock) saat lepas child berdampak | Mutasi koreksi via `MockBiLedger`; production → API BI |

---

### 4.7 UI / UX (prototype)

- Template: Vuexy / layout MAVEN prototype.
- Grid: DataTables standar (`DfDataTable`) — bordered, bahasa ID.
- Form mapping: **tab** Child | Activity (bukan dua section terpisah).
- Dialog konfirmasi: SweetAlert2.
- Penyimpanan prototype: `localStorage` key `df_mapping_subdist_v3` (bukan DB).

---

## 5. Modul: Master Vendor (referensi bisnis — belum di UI)

Untuk kelengkapan FSD formal, kebutuhan bisnis (dari dokumen project):

| Kebutuhan | Keterangan |
|-----------|------------|
| Nama vendor (atau “Others”) | |
| Alamat & NPWP | |
| Region KN | |
| **Flag jalur klaim** | Ke KN User dulu **atau** langsung ke Subdist |
| Notifikasi | ABM dapat notifikasi terkait setup flag |

**Status prototype:** menu & halaman **belum ada** (dihapus dari sidebar). Harus dijadwalkan di FSD Master bagian berikutnya / backlog MAVEN.

---

## 6. Matriks kesesuaian vs dokumen bisnis

| Item dokumen bisnis §11 | Prototype Master |
|-------------------------|------------------|
| Nama subdist | Ya (dari Bosnet) |
| Alamat | Ya (editable) |
| NPWP | Tidak di UI |
| Region KN | Ya (dari Bosnet, read-only) |
| Kode mengikuti EPM | Ya (`kodeBranch` / Branch EPM) |
| Joint group Parent–Child | Ya |
| Mapping Parent–Activity | Ya |
| PPN & PPh | Tidak di UI |
| Master Vendor + flag klaim | Belum |

---

## 7. Asumsi & batasan prototype

1. Data persistensi = browser `localStorage` (reset browser / ganti device = data hilang kecuali di-seed ulang).
2. Bosnet & Master Activity = mock; kontrak API production perlu dilampirkan saat FSD final.
3. Matching Monitoring Claim EPM ke Subdist: `SHIP_TO_SITE_USE_ID` = `txtShipToSiteUseId` (OutletID). Mapping tanpa ShipTo tidak match sampai diisi ulang dari Bosnet.
4. Soft-delete fisik tidak ada; audit trail koreksi unmap ada di mock BI ledger.
5. Resign / reclass penuh Subdist parent tetap proses BI terpisah; lepas child dengan periode koreksi sudah masuk scope prototype (mock).

---

## 8. Open points (untuk keputusan FSD formal)

| No | Pertanyaan | Dampak |
|----|------------|--------|
| 1 | Apakah NPWP / PPN / PPh tetap wajib di MAVEN production? | Field master & integrasi pajak |
| 2 | Apakah child boleh dipindah antar parent, atau hanya orphan? | Filter LOV (prototype: hanya orphan / belum mapping) |
| 3 | Satu OutletID / ShipTo hanya boleh satu mapping aktif | Unique partial `txtShipToSiteUseId` |
| 4 | Jadwal & owner Master Vendor | Scope MAVEN sprint |
| 5 | Kontrak API Bosnet (field, auth, paging) | Integrasi production |

---

## 9. Lampiran — File prototype terkait

| Area | Path |
|------|------|
| Index + Detail (SPA) | `masters/mapping-subdist.html` |
| Form lama (redirect) | `masters/mapping-subdist-form.html` |
| Logic list + SPA orchestrator | `js/masters/MappingSubdist/MappingSubdist.js` |
| Logic form / detail | `js/masters/MappingSubdist/MappingSubdistForm.js` |
| Store / rules | `js/masters/MappingSubdist/MappingSubdistStore.js` |
| Seed Subdist / Bosnet | `js/masters/MappingSubdist/seed-data.js` |
| Seed Activity | `js/masters/MappingSubdist/activity-seed.js` |
| Mock BI ledger | `js/shared/MockBiLedger.js` |
| Parser LISTING_CLAIM (Add historis) | `js/shared/ListingClaimCsv.js` |
| Menu | `js/layout.js` |
| Konteks bisnis | `Documentation/business-documentation.md` |
| Inject / koreksi | `Documentation/FSD-Inject-Delta-BI.md` |

---

## 10. Riwayat dokumen

| Versi | Tanggal | Perubahan |
|-------|---------|-----------|
| 0.1 | 24 Jul 2026 | Draft awal FSD Master Data dari prototype (fokus Mapping Subdist) |
| 0.2 | 24 Jul 2026 | UC-MD-04b lepas child + periode koreksi; BR-MD-09..13; `linkedAt` |
| 0.3 | 24 Jul 2026 | Add child periode + CSV historis; lepas koreksi per bulan; BR-MD-14..18 |
| 0.4 | 28 Jul 2026 | Index tanpa kolom Aksi/Edit (navigasi via Kode KMMD); Titik dihapus dari UI; LOV Bosnet `vw_Outlet_Bosnet`; field identitas disabled + Autopopulate; Action kiri + DataTables/SweetAlert di Child/Activity; aligned MAVEN `/DF/MappingSubdist` |
| 0.4.1 | 28 Jul 2026 | Prototype UI diselaraskan ke MAVEN: Index Filter+Tambah, card title, Detail btn-sm, tanpa Parent toggle, LOV disabled (bukan hidden) saat edit, DataTables language/layout |
| 0.5 | 29 Jul 2026 | Field `txtShipToSiteUseId` (Bosnet OutletID); matching Monitoring Claim EPM via ShipTo; storage key `df_mapping_subdist_v3` |
| 0.6 | 3 Agu 2026 | SPA Index↔Detail di `mapping-subdist.html`; column search + Action pencil; `formUrl` → `?id=` / `?new=1`; form.html redirect; Monitoring polish layout/copy |

---

*Lanjutan yang disarankan:* `FSD-Transaction-Monitoring-Claim-EPM.md`, `FSD-Transaction-Memo-QP.md`, `FSD-Inject-Delta-BI.md`.

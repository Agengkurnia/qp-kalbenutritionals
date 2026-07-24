# Functional Specification Document (FSD)
## KICAO KDS — MKPP Prototype (shell)

| | |
|---|---|
| **Dokumen** | FSD Prototype KICAO KDS — MKPP |
| **Produk** | Development Fund Subdist — Kalbe Nutritionals (SHP) |
| **Sistem UI** | **KICAO KDS** (shell AdminLTE) di dalam repo prototype DF |
| **Versi** | 0.1 |
| **Tanggal** | 24 Juli 2026 |
| **Status** | Draft prototype fase 1 |

---

## 1. Tujuan

1. Menyediakan **shell visual KICAO KDS** (AdminLTE `skin-green`) terpisah dari shell MAVEN (Vuexy).
2. Memprototype layar **MKPP** (Master KPP / memo activity) untuk skenario **MKPP Type DF**.
3. Memungkinkan demo navigasi MAVEN ↔ KICAO tanpa menjalankan IIS/KDS production.

---

## 2. Ruang lingkup

### 2.1 In scope (fase 1)

| Item | Keterangan |
|------|------------|
| Shell AdminLTE | Header, sidebar, footer mirip `_Layout.cshtml` KDS |
| Menu sidebar | MKPP + Kembali ke MAVEN |
| Form header MKPP | Doc No, Date, Parent, Status, Group Account, ONO, Budget Type, Posting Date, Program Description |
| Toolbar | Find, Save, New, Submit, Print (Print = info saja) |
| Persistensi | `localStorage` key `df_kicao_mkpp_v1` |
| Bridge MAVEN | Menu sidebar **Prototype → KICAO KDS — MKPP** |

### 2.2 Out of scope

| Item | Keterangan |
|------|------------|
| API / DB KICAO production | |
| CKEditor, attachment, print PDF | |
| Tab Supplier / Budget / Subbrand penuh | Phase 2 |
| Approval workflow | |
| Potong saldo BI dari Submit | |
| Menu Klaim / CMA / ONO | |

---

## 3. Navigasi

```
MAVEN (Vuexy)  --sidebar-->  kicao/mkpp.html (AdminLTE)
kicao sidebar  --link----->  ../index.html (MAVEN)
```

---

## 4. Aturan mock

| ID | Aturan |
|----|--------|
| BR-KDS-01 | Halaman KICAO tidak memuat CSS Vuexy. |
| BR-KDS-02 | Doc No auto: `MKPP-DF-YYYYMM-###`. |
| BR-KDS-03 | Save/Submit wajib Budget Type, Group Account, Program Description. |
| BR-KDS-04 | Submit hanya mengubah status lokal menjadi `Submitted`. |
| BR-KDS-05 | Budget Type default prototype: `DF — Development Fund`. |

---

## 5. File prototype

| Area | Path |
|------|------|
| Halaman | `kicao/mkpp.html`, `kicao/index.html` |
| Layout | `kicao/js/KicaoLayout.js` |
| Logic | `kicao/js/MkppPrototype.js` |
| Aset skin | `assets/kicao/` (subset dari KN2022_KCO_KDS.MVC) |
| Bridge MAVEN | `js/layout.js` |
| Referensi production | `KICAO KDS/.../Views/MKPP/Index.cshtml`, `_Layout.cshtml` |

---

## 6. Riwayat

| Versi | Tanggal | Perubahan |
|-------|---------|-----------|
| 0.1 | 24 Jul 2026 | Draft shell KICAO + MKPP header mock |

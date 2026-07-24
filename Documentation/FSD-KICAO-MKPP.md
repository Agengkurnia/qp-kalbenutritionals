# Functional Specification Document (FSD)
## KICAO KDS — MKPP Prototype

| | |
|---|---|
| **Dokumen** | FSD Prototype KICAO KDS — MKPP |
| **Produk** | Development Fund Subdist — Kalbe Nutritionals (SHP) |
| **Sistem UI** | **KICAO KDS** (shell AdminLTE) di dalam repo prototype DF |
| **Versi** | 0.2 |
| **Tanggal** | 24 Juli 2026 |
| **Status** | Draft prototype — full mock |

---

## 1. Tujuan

1. Shell visual KICAO KDS (AdminLTE `skin-green`) terpisah dari MAVEN (Vuexy).
2. Prototype **MKPP Type DF** lengkap: header + Activity/Supplier/Budget/Subbrand.
3. Mock non-UI: Excel uploader, print HTML-PDF, simulasi BOSNET.
4. Navigasi MAVEN ↔ KICAO tanpa IIS/KDS production.

---

## 2. Ruang lingkup

### 2.1 In scope (v0.2)

| Item | Keterangan |
|------|------------|
| Shell AdminLTE | Header, sidebar, footer |
| MKPP form | Doc No, Parent, Status, Group Account, ONO, Budget Type, Posting Date, Program Desc, Mekanisme, Remark |
| Activity tab | Add/edit/delete + modal Supplier / Budget / Subbrand / Attachment (metadata) |
| Toolbar | Find, Save, Update Info, New, Submit, Approve/Reject (mock), Print, Close, Cancel, Update Attachment |
| Status flow | Draft → Waiting Approval → Approved/Rejected → Waiting To Close → Closed; Cancelled |
| Persistensi | `localStorage` key `df_kicao_mkpp_v1` |
| Print | HTML window + browser Print/Save as PDF (bukan RDLC) |
| MKPP Uploader | CSV/XLSX template + preview + Process → Draft MKPP |
| Close Uploader | CSV Doc No → Close via BOSNET mock |
| BOSNET Job | Proses semua Waiting To Close |
| Bridge MAVEN | Switch Prototype di sidebar |

### 2.2 Out of scope

| Item | Keterangan |
|------|------------|
| API / DB Oracle KICAO | |
| CKEditor, ReportViewer RDLC | |
| K2 workflow / email SMTP | |
| Dolphine SQL / BUI ticket production | |
| Potong saldo BI nyata | |

---

## 3. Navigasi

```
MAVEN  ↔  kicao/mkpp.html
       →  kicao/mkpp-uploader.html
       →  kicao/mkpp-close-uploader.html
       →  kicao/mkpp-bosnet-job.html
```

---

## 4. Aturan mock

| ID | Aturan |
|----|--------|
| BR-KDS-01 | Halaman KICAO tidak memuat CSS Vuexy. |
| BR-KDS-02 | Doc No auto: `MKPP-DF-YYYYMM-###`. |
| BR-KDS-03 | Save/Submit: Group Account, Budget Type, Program Desc, Mekanisme, Remark, min 1 activity, amount &gt; 0, min 1 supplier. |
| BR-KDS-04 | Submit → Waiting Approval + mock BOSNET Open. |
| BR-KDS-05 | Approve/Reject mock (tanpa K2). |
| BR-KDS-06 | Close: BOSNET Close success → Closed; fail → Waiting To Close. |
| BR-KDS-07 | Budget Type default: `DF — Development Fund`. |
| BR-KDS-08 | Attachment = metadata nama file saja. |
| BR-KDS-09 | Print = HTML mock, bukan RDLC. |

---

## 5. File prototype

| Area | Path |
|------|------|
| Halaman | `kicao/mkpp.html`, `mkpp-uploader.html`, `mkpp-close-uploader.html`, `mkpp-bosnet-job.html` |
| Store / form / activity | `kicao/js/MkppStore.js`, `MkppPrototype.js`, `MkppActivity.js` |
| Print / BOSNET / Upload | `MkppPrint.js`, `MkppBosnet.js`, `MkppUploader.js`, `MkppCloseUploader.js` |
| Layout | `kicao/js/KicaoLayout.js` |
| Referensi production | `KICAO KDS/.../Views/MKPP/`, `MKPPController.cs` |

---

## 6. Riwayat

| Versi | Tanggal | Perubahan |
|-------|---------|-----------|
| 0.1 | 24 Jul 2026 | Draft shell + header mock |
| 0.2 | 24 Jul 2026 | Full UI Activity/detail + uploader + print HTML + BOSNET mock |

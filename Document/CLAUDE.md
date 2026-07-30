# MAVEN

Internal ERP-style web app for **PT Kalbe Nutritionals**. ASP.NET Core MVC + PostgreSQL.

## Domain glossary

| Term | Meaning |
|---|---|
| Stokis | Regional distributor/stockist |
| Motoris | Field motorcycle salesman / canvasser |
| Penjualan | Sales |
| Faktur | Invoice |
| Pegawai | Employee |
| PowerGT | Current active module set (`Controllers/PowerGT`, `Views/PowerGT`) |
| Man Power GT / ManPowerGT | Field-force management system that Faktur/Stok Motoris (Penjualan module) belongs to — see FSD below |
| DOFS | Older loyalty/trade-promotion subsystem (prizes, vendors, unique-code redemption) — separate legacy area |

## Stack

- .NET 10, ASP.NET Core MVC (Razor Views + Controllers, no Blazor/Razor Pages)
- EF Core 9 on PostgreSQL (`Npgsql`) — primary DB; Oracle (`Oracle.EntityFrameworkCore`) — read-only external source
- Dapper — complex/reporting queries only, not general CRUD
- Hangfire — background jobs (`/hangfire` dashboard)
- Serilog + `ClsGlobalServices.logError` — logging (see legacy vs new convention below)
- KNGlobal (`KNGlobal.Client.AspNetCore`) — Kalbe's internal SSO/RBAC platform client; MAVEN is a consumer app of it
- jQuery + DataTables.net (server-side) + Bootstrap — no SPA framework, no npm build pipeline

## Project layering

```
MAVEN.Common   → Entities, ViewModels, Constants, ConfigurationModel (no project deps)
MAVEN.DAL      → EF Core DbContexts + ModelBuilders (refs Common)
MAVEN.Services → Business logic by domain (refs Common + DAL)
MAVEN          → Web: Controllers, Views, wwwroot (refs Common + Services, not DAL directly)
```

Rule that holds everywhere, legacy or new: **no EF `DbContext` directly in a Controller — always go through a Service.**

---

## Legacy / existing convention (what you'll see almost everywhere in MAVEN right now)

This is the pattern used by most of the codebase, including the PowerGT module built in
the last few commits (Employee, Stokis, SalesOrder, MotorisStock). Follow it when
touching that existing code — it is **not** what new ManPowerGT masters work should do
(see next section).

- Hungarian-prefixed PascalCase properties: `Txt` (string), `Int` (int), `Dec` (decimal), `Bit` (bool), `Dt` (DateTime) — e.g. `TxtKode`, `IntPegawaiID`, `BitActive`, `DtInserted`.
- Class prefixes: `M` = master entity, `T`/`Tr` = transaction entity, `Vw` = view-backed read model, `Vm` = ViewModel/DTO, `Cls` = utility/non-table wrapper class.
- `DbContext` manually `new`'d per call, never DI-injected: `using var context = new MavenContext(); ... finally { await context.DisposeAsync(); }`.
- No EF Migrations — schema changes are hand-numbered SQL files in `MAVEN.DAL/Scripts/NNN_description.sql`.
- Column/table mapping lives in `MAVEN.DAL/ModelBuilders/<Domain>/<Entity>ModelBuilder.cs`, not data annotations.
- Errors: `try/catch/finally` → `ClsGlobalServices.logError(json, "<Service>", "<Method>", user, "", (int)ClsConstant.ErrorType.Error)` → generic `throw new Exception(message)`. Controllers: `Json(clsAPI.CreateError(ex))`.
- Frontend JS: `$(document).ready` bootstrapping loose top-level helper functions (e.g. `p_LoadXxx()`), not an object-literal module.

---

## New convention — ManPowerGT masters/Penjualan module

**Scope: this section applies only to new work building the ManPowerGT masters and
Penjualan module (per FSD "Man Power GT — Modul Penjualan (Web Admin)" v1.2.0,
BRD 2026.SHP-FSD.0003 — Faktur + Stok Motoris, Web Admin counterpart to a Mobile SFA
app). It is deliberately different from the legacy convention above and is NOT the
app-wide standard.** The FSD itself is user-provided and not currently stored in this
repo. Actually implementing this module is a separate, future task — its technical plan
still needs review before code is written; the rules below just describe the target
shape for when that happens.

**Naming**
- No Hungarian prefixes on properties. C# stays idiomatic **PascalCase** (`NomorFaktur`, `PegawaiId`, `JumlahTagihan`, `IsActive`), mapped via `ModelBuilder.HasColumnName` to a **camelCase, prefix-free** DB column (`"nomorFaktur"`, `"pegawaiId"`, `"jumlahTagihan"`, `"isActive"`).
- Class-level prefixes carry over unchanged: `M`/`T`/`Vm`/`I`.

**Data access**
- `MavenContext` is **constructor-injected** (scoped lifetime), registered in `Middleware/MiddlewareServices.cs` — not manually `new`'d.
- EF Core for simple CRUD. Dapper only for complex/reporting queries (multi-join, aggregation, PostgreSQL-specific features) — same split as today, just explicit.
- LINQ: **method syntax** (`context.MPegawais.Where(x => x.IsActive).Select(x => ...)`) over query syntax (`from x in ... where ... select ...`), wherever both are equally expressive.
- Validation is **manual/imperative** — explicit `if` checks in the service or a plain validation helper method. Not Data Annotations, not FluentValidation (not currently a dependency anywhere in the solution).

**API shape**
- New masters controllers are API-based: `[ApiController]` at `api/{version:apiVersion}/[controller]/[action]`, decorated with `[GeneralResponseApiWrapperAttribute]` + `[GeneralResponseExceptionApiWrapperAttribute]` — the "AppSheet-style API Controller (Standard Baru)" boilerplate already documented in `.kiro/steering/maven-api-design.md`. Reuse that template.
- This is **not** the legacy `clsAPI.CreateResult/CreateError` pattern the rest of PowerGT uses.
- Consistent with the FSD's own "Integrasi API (Rencana Database)" section (planned `/api/v1/Invoice`).

**Frontend**
- `.cshtml` is a skeleton only (markup/layout). All page logic and data loading is driven by AJAX calls to the API controllers above, from a **separate** `.js` file — no inline `<script>` blocks with logic.
- Single-page-per-feature: no separate list/detail/print `.cshtml` pages like the FSD prototype had. Detail/print load via AJAX into a modal or inline panel on the same page — stay on jQuery/Vuexy/AJAX, no new JS framework, no npm build pipeline.
- UI theme: **Vuexy Admin Template** (Bootstrap 5.3 base), loaded from `~/lib/vuexy/` via `Views/Shared/_Layout.cshtml`. Confirmed current/active — not AdminLTE or the Mobirise-derived assets also present elsewhere in `wwwroot` (those are other/legacy-module theme leftovers).
- JS is organized as an **object-literal module**, not loose global functions:
  ```js
  "use strict";
  var StokMotorisPage = {
      init: function () {
          this.bindEvents();
          this.loadDashboard();
      },
      bindEvents: function () {
          $("#btnRefresh").on("click", this.loadDashboard.bind(this));
      },
      loadDashboard: function () {
          $.ajax({ /* ... */ });
      }
  };
  $(document).ready(function () { StokMotorisPage.init(); });
  ```
- **Reuse `GlobalScript.js` before writing new JS helpers.** `MAVEN/wwwroot/js/Global/GlobalScript.js` is already loaded on every page via `Views/Shared/_Layout.cshtml:217` — no extra include needed. It exports the `clsGlobalClass` prototype (`swalSuccess`, `swalError`, `swalErrorHtml`, `showLoading`/hide) plus top-level helpers `BlockUI()`/`UnBlockUI()`, `ConvertUpperCase()`, `ConvertFirstLetterCapitalize()`, `isNumberKey()`/`IsAlphaNumeric()`, `setItemSessionStorage()`/`getItemSessionStorage()`. Use these — don't hand-roll another SweetAlert2 wrapper or session-storage helper.

**Logging**
- Mandatory and liberal: every significant service method logs on execution via **DI-injected `ILogger<T>`**, including the key parameters it ran with — not just on error. Additive to the existing `ClsGlobalServices.logError` error path, which still applies for the error case.

**Tests**
- New `MAVEN.Services.Tests` project (xUnit), referenced from `MAVEN.sln`, one test class per new-module service.
- Fake `MavenContext` via EF Core's InMemory provider (`UseInMemoryDatabase`, fresh instance per test) — only possible because of the DI rule above. `ILogger<T>` satisfied via `NullLogger<T>.Instance`.
- Priority: one test per FSD business rule (`BR-PR-PJ*` / `BR-SM-F*` / `BR-SM-P*`) as each corresponding service method gets built — not blanket CRUD coverage.

**Explicitly deferred**
- Routes/URL-prefix convention for the new masters module: not decided yet, don't assume the FSD's prototype routes (`/Transaction/SalesOrder`, `/Dashboard/MotorisStock`) carry over.

### Known non-compliant code (existing — don't copy as a reference pattern)

All from the PowerGT module built in the last 3 commits (`22f26e2`, `1595ac9`, `5391c53`):

- **Property naming** (Hungarian-prefixed, not plain PascalCase): `MAVEN.Common/Entity/Master/Employee/MPegawai.cs`, `MAVEN.Common/Entity/Master/Stokis/MStokis.cs`, `MAVEN.Common/Entity/Penjualan/TPenjualanFaktur.cs`, `MAVEN.Common/ViewModel/**/Vm*.cs`.
- **Manual `DbContext` instantiation, not DI**: `MAVEN.Services/Master/MasterEmployeeService.cs`, `MAVEN.Services/Master/MasterStokisService.cs`, `MAVEN.Services/Penjualan/SalesOrderService.cs`, `MAVEN.Services/Penjualan/MotorisStockService.cs`.
- **JS module style** (loose global functions, not object-literal): `wwwroot/js/powergt/transaction/SalesOrder/SalesOrder.js`, `wwwroot/js/powergt/dashboard/MotorisStock/MotorisStock.js`.

### Already implemented under PowerGT today (baseline this new work sits alongside)

- Controllers: `Master/{Channel,Customer,Pegawai,Product,Reason,Stokis,Tax}Controller`, `Transaction/SalesOrderController`, `Dashboard/MotorisStockController`.
- Services: `MAVEN.Services/Master/Master{Channel,Customer,Employee,Product,Reason,Stokis,Tax}Service`, `MAVEN.Services/Penjualan/{SalesOrderService,MotorisStockService}`.
- Views: matching `Views/PowerGT/Master/*` (mostly Index+Detail), `Views/PowerGT/Transaction/SalesOrder` (Index+Detail+Print), `Views/PowerGT/Dashboard/MotorisStock` (Index only).
- Note: Faktur is not its own screen yet — sales-order data lives under `Transaction/SalesOrder`; Stok Motoris is a read-only dashboard, not a masters CRUD screen.

---

## Deeper docs

`.kiro/steering/*.md` (Kiro tool's steering docs, `inclusion: auto`) has more detailed per-domain rules: `maven-api-design.md` (routes, response envelopes, pagination), `maven-database.md` (table/column naming, EF patterns), `maven-build-deploy.md`, `maven-appsheet.md`, `flexform-datasource-flow.md`, `deployment-checklist.md`. Two known-stale points there — don't propagate them:
- States framework as ASP.NET Core 8; actual (per `.csproj`) is **.NET 10**.
- Documents a `Pk`-prefix primary-key convention; the newest PowerGT code (Employee/Stokis/SalesOrder) actually used `IntXxxID` instead.

## Heads-up

`MAVEN/Program.cs:60-61` loads `Cert/MAVEN.pfx` with a certificate password hardcoded in source (location only — not reproducing the value here). Worth knowing before touching that file; not a task to fix unprompted.

# Create CLAUDE.md for MAVEN

## Context

MAVEN is a large (14k+ file) ASP.NET Core ERP solution for Kalbe Nutritionals with no
project-root CLAUDE.md — Claude Code currently starts every session blind to the stack,
layering, and naming conventions. The user wants a CLAUDE.md that anchors future Claude
Code work to MAVEN's conventions.

Trigger for revision: the user shared the FSD (Functional Specification Document,
BRD 2026.SHP-FSD.0003, v1.2.0) for **Man Power GT — Modul Penjualan (Web Admin)** —
Faktur (invoice monitoring) and Stok Motoris (field-salesman stock dashboard), the
Web Admin counterpart to a Mobile SFA app. The FSD documents intended DB tables
(`tFaktur`/`tFakturItem`, `tKunjunganMotoris`, `tStokMotorisMutasi`, master tables) and
business rules for a **future** ManPowerGT masters/Penjualan implementation. **Building
that feature is a separate future task and out of scope here** — the actual technical
implementation plan needs the user's review before any code is written. What's in scope
right now is only: bake the user's 10 stated conventions for that future work into
CLAUDE.md, so when implementation starts later, Claude Code already knows the target
shape.

Critically, the user does not want these 10 rules presented as the app-wide standard —
most of the existing MAVEN codebase (Employee/Stokis/SalesOrder/MotorisStock, built in
the last 3 commits) does the opposite of several of these rules. CLAUDE.md must clearly
separate **legacy/observed convention** (what most of the app does today) from **new
convention mandated for the ManPowerGT masters/Penjualan module** going forward, and
explicitly list existing code that does not comply with the new rules so nobody copies
it as a reference pattern for new work.

There's no ManPowerGT masters folder yet (the module doesn't exist), so there's nowhere
to put a nested/scoped CLAUDE.md — everything lands in one root CLAUDE.md with clearly
separated sections. If/when the module gets its own folder tree, the "new convention"
section can be split out into a nested CLAUDE.md at that point (not now).

## The 10 rules (as clarified with the user)

1. Scope: this FSD/these rules describe a **future** ManPowerGT masters implementation.
   Technical design of that feature is a separate task requiring the user's review —
   not attempted here.
2. **No Hungarian prefixes on properties.** Resolved via user's answer: C# properties
   stay idiomatic **PascalCase** with no `Txt`/`Int`/`Dec`/`Bit`/`Dt` prefix (e.g.
   `NomorFaktur`, `PegawaiId`, `JumlahTagihan`, `IsActive`), mapped through the
   `ModelBuilder` to a **camelCase, prefix-free** DB column (`"nomorFaktur"`,
   `"pegawaiId"`, `"jumlahTagihan"`, `"isActive"`) — same idea as the rest of the DB's
   camelCase columns, just without the type-prefix letters.
3. **Keep class-level prefixes** — `M` (master entity), `T` (transaction entity), `Vm`
   (ViewModel/DTO), `I` (interface) stay as-is. Only the *property*-level Hungarian
   prefix goes away, not the class-naming convention.
4. This doc/ruleset is **project-specific to the ManPowerGT masters/Penjualan module**,
   not an app-wide rewrite of MAVEN's conventions — CLAUDE.md must say so explicitly and
   keep it visually/structurally separate from the legacy-convention section.
5. **Data access via DI** — new module's services get `MavenContext` constructor-injected
   (scoped lifetime), registered in `Middleware/MiddlewareServices.cs`. This is the
   opposite of the existing `using var context = new MavenContext();` pattern used
   everywhere else in the app today.
6. **Audit existing code against these rules and list what doesn't comply** — done below
   (see "Known non-compliant code").
7. **Frontend**: `.cshtml` is a skeleton only (markup/layout); all page logic/data
   loading is driven by AJAX from a companion `.js` file. No server-rendered dynamic
   content beyond the shell.
8. **AJAX/JS style**: functions organized as an **object-literal module** (e.g.
   `var StokMotorisPage = { init(){...}, loadDashboard(){...}, ... };`), not loose
   global functions. Existing MotorisStock/SalesOrder JS uses loose top-level
   `p_LoadXxx()`-style functions — that pattern does not carry forward.
9. **`.cshtml` and `.js` must be in separate files** — no inline `<script>` blocks with
   logic in the Razor view (enforces #7/#8 as a hard rule, not just a preference).
10. **DAL uses EF Core for simple CRUD.** Dapper stays reserved for complex/reporting
    queries (multi-join, aggregation, PostgreSQL-specific features) — unchanged from
    the app's existing split, just made explicit for the new module.
11. **SPA, resolved**: stay on jQuery/Vuexy/AJAX (no new framework, no npm build
    pipeline) — collapse the FSD prototype's separate list/detail/print pages into one
    `.cshtml` per feature, with detail/print swapped in via an AJAX-loaded modal or
    inline panel instead of navigating to a new URL. Consistent with rules #7-#9.
12. **UI theme, confirmed from code**: `MAVEN/Views/Shared/_Layout.cshtml` loads the
    **Vuexy Admin Template** (Bootstrap 5.3 base) from `~/lib/vuexy/` — matches what the
    FSD describes. Bundled: DataTables (bs5 + responsive/fixedcolumns/fixedheader/
    buttons/scroller/checkboxes), SweetAlert2, Toastr, Select2, Flatpickr,
    bootstrap-select, bs-stepper, FormValidation.js. New ManPowerGT views use this same
    theme/layout, not AdminLTE or the Mobirise-derived assets seen elsewhere in
    `wwwroot` (those are legacy/other-module theme leftovers, not current).
13. **Logging is mandatory and liberal** — every new-module service method logs on
    execution via **DI-injected `ILogger<T>`**, including the important parameters it
    ran with (not just errors). Additive to the existing `ClsGlobalServices.logError`
    error-path convention, which still applies for the error case.
14. **Tests, decided**: yes, add them. New `MAVEN.Services.Tests` project (xUnit),
    referenced from `MAVEN.sln`, one test class per new-module service. Fake
    `MavenContext` via EF Core's InMemory provider (`UseInMemoryDatabase`, fresh
    instance per test) — only possible because of rule #5's DI; `ILogger<T>` satisfied
    via `NullLogger<T>.Instance`. Priority: one test per FSD business rule
    (`BR-PR-PJ*` / `BR-SM-F*` / `BR-SM-P*`) as each corresponding service method gets
    built, not blanket CRUD coverage.
15. **Routes**: FSD's route suggestions (`/Transaction/SalesOrder`, `/Dashboard/
    MotorisStock`, etc.) are explicitly NOT carried into the new-convention section —
    user said disregard for now. Route/URL-prefix convention for the new masters module
    stays unspecified in CLAUDE.md.
16. **Validation, decided: manual/imperative.** Not Data Annotations, not
    FluentValidation (no new dependency) — explicit `if` checks in the service (or a
    plain validation helper method), chosen by the user for easier maintainability and
    cross-checking. Errors surfaced through the same error-response path as rule #17.
17. **Response envelope, decided: `[GeneralResponseApiWrapperAttribute]` style —
    because the new masters module is API-based**, not the legacy MVC `clsAPI.
    CreateResult/CreateError` pattern the rest of PowerGT uses. Concretely: new masters
    controllers are `[ApiController]`s at `api/{version:apiVersion}/[controller]/
    [action]`, decorated with `[GeneralResponseApiWrapperAttribute]` +
    `[GeneralResponseExceptionApiWrapperAttribute]`, matching the "AppSheet-style API
    Controller (Standard Baru)" boilerplate already documented in
    `.kiro/steering/maven-api-design.md` — reuse that template rather than reinventing
    it. This still pairs with rule #7/#11: the `.cshtml` stays a skeleton served by a
    normal MVC action (`Index` → `View()`), and its AJAX calls now target these
    versioned API endpoints instead of a same-controller `Json(...)` action. Consistent
    with the FSD's own "Integrasi API (Rencana Database)" section (`/api/v1/Invoice`
    planned endpoint).
18. **Reuse `GlobalScript.js` before writing new JS helpers.** Confirmed:
    `MAVEN/wwwroot/js/Global/GlobalScript.js` is already loaded on every page via
    `Views/Shared/_Layout.cshtml:217` (site-wide, no extra include needed). It exports
    the `clsGlobalClass` prototype — `swalSuccess`, `swalError`, `swalErrorHtml`,
    `showLoading`/hide, plus top-level helpers `BlockUI()`/`UnBlockUI()`,
    `ConvertUpperCase()`, `ConvertFirstLetterCapitalize()`, `isNumberKey()`/
    `IsAlphaNumeric()`, `setItemSessionStorage()`/`getItemSessionStorage()`. New
    ManPowerGT JS must use these instead of writing a per-page duplicate (e.g. don't
    hand-roll another SweetAlert2 wrapper or session-storage helper).

## Known non-compliant code (to list in CLAUDE.md as "don't copy these as reference")

All from the last 3 commits (`22f26e2`, `1595ac9`, `5391c53` — Employee/Stokis/
SalesOrder/MotorisStock, the PowerGT module):

- **Property naming** — uses Hungarian-prefixed PascalCase, not plain PascalCase:
  `MAVEN.Common/Entity/Master/Employee/MPegawai.cs` (`IntPegawaiID`, `TxtKode`,
  `BitActive`, `DtInserted`), `MAVEN.Common/Entity/Master/Stokis/MStokis.cs`,
  `MAVEN.Common/Entity/Penjualan/TPenjualanFaktur.cs`, `MAVEN.Common/ViewModel/**/Vm*.cs`.
- **Manual DbContext instantiation, not DI** — `MasterEmployeeService.cs`,
  `MasterStokisService.cs`, `MAVEN.Services/Penjualan/SalesOrderService.cs`,
  `MAVEN.Services/Penjualan/MotorisStockService.cs` all do
  `using var context = new MavenContext(); ... finally { await context.DisposeAsync(); }`
  instead of constructor injection.
- **JS module style** — `wwwroot/js/powergt/transaction/SalesOrder/SalesOrder.js` and
  `wwwroot/js/powergt/dashboard/MotorisStock/MotorisStock.js` use `$(document).ready`
  bootstrapping loose top-level helper functions, not an object-literal module.

## What goes in CLAUDE.md

Single file at `c:\Users\Farrel\Documents\MAVEN\CLAUDE.md`, structured as:

1. **Project summary** — MAVEN = Kalbe Nutritionals internal ERP-style app. One-line
   domain glossary: Stokis (distributor), Motoris (field motorcycle salesman/canvasser),
   Penjualan (sales), Faktur (invoice), Pegawai (employee), PowerGT (current active
   module set), Man Power GT / ManPowerGT (field-force management system Faktur/Stok
   Motoris belongs to), DOFS (older loyalty/trade-promo subsystem).

2. **Stack** — .NET 10, ASP.NET Core MVC (Razor Views + Controllers), EF Core 9 on
   PostgreSQL (`Npgsql`) as primary + Oracle read-only external source, Dapper for
   complex/reporting queries, Hangfire, Serilog + `ClsGlobalServices.logError`, KNGlobal
   (Kalbe's internal SSO/RBAC client), jQuery + DataTables.net + Bootstrap, no SPA
   framework, no npm build pipeline.

3. **Project layering** — `MAVEN.Common` → `MAVEN.DAL` → `MAVEN.Services` → `MAVEN`
   (web), same dependency direction as today. Rule carried over either way: no EF
   `DbContext` directly in Controllers, always through a Service.

4. **Legacy / existing convention (most of the app today)** — clearly headed as
   "what you'll see almost everywhere in MAVEN right now":
   - Hungarian-prefixed PascalCase properties (`Txt`, `Int`, `Dec`, `Bit`, `Dt`).
   - `DbContext` manually `new`'d per call, never DI-injected, disposed in `finally`.
   - No EF Migrations — schema changes are hand-numbered SQL files in
     `MAVEN.DAL/Scripts/NNN_description.sql`.
   - Column/table mapping lives in `MAVEN.DAL/ModelBuilders/<Domain>/<Entity>ModelBuilder.cs`.
   - Errors: `try/catch/finally` → `ClsGlobalServices.logError(...)` → generic
     `throw new Exception(message)`; controllers → `Json(clsAPI.CreateError(ex))`.
   - Class prefixes `M`/`T`/`Vm`/`I`/`Cls` — this part *does* carry forward unchanged.

5. **New convention — ManPowerGT masters/Penjualan module (per FSD BRD 2026.SHP-FSD.0003)**,
   headed explicitly as *not* app-wide, applies only to new work in this module:
   - No Hungarian property prefixes; PascalCase C# properties / camelCase prefix-free
     DB columns (rule #2, with the resolved example from above).
   - Keep class-level `M`/`T`/`Vm`/`I` prefixes (rule #3).
   - `MavenContext` constructor-injected (scoped), registered in
     `Middleware/MiddlewareServices.cs` — not manually `new`'d (rule #5).
   - EF Core for simple CRUD; Dapper only for complex/reporting queries (rule #10).
   - `.cshtml` = skeleton/layout only; all logic driven by AJAX from a **separate**
     `.js` file — no inline `<script>` with logic (rules #7, #9).
   - JS organized as an object-literal module (`init`/`bindEvents`/`loadX` methods on
     one object), not loose global functions (rule #8) — include the short canonical
     shape as a snippet.
   - Single-page-per-feature (rule #11): no separate list/detail/print `.cshtml`
     pages — detail/print load via AJAX into a modal or inline panel on the same page.
   - UI theme: Vuexy Admin Template via `~/lib/vuexy/` (rule #12) — same `_Layout.cshtml`
     as the rest of the app, not AdminLTE/Mobirise.
   - Logging: DI-injected `ILogger<T>`, log on every significant service method
     execution with its key parameters, in addition to the existing
     `ClsGlobalServices.logError` error path (rule #13).
   - Validation: manual/imperative checks (explicit `if`s in the service or a
     validation helper) — not Data Annotations, not FluentValidation (rule #16).
   - API shape: `[ApiController]` at `api/{version:apiVersion}/[controller]/[action]`
     with `[GeneralResponseApiWrapperAttribute]` +
     `[GeneralResponseExceptionApiWrapperAttribute]` (the `.kiro`-documented
     "AppSheet-style" boilerplate) — not the legacy `clsAPI.CreateResult/CreateError`
     pattern. `.cshtml` skeleton's AJAX calls hit these versioned endpoints (rule #17).
   - Tests: `MAVEN.Services.Tests` (xUnit + EF Core InMemory), one test per FSD
     business rule as each service method is built (rule #14).
   - JS reuse: `GlobalScript.js`'s `clsGlobalClass` (swalSuccess/swalError/
     showLoading) and helper functions (BlockUI/UnBlockUI, session storage, etc.) are
     already loaded site-wide — use them, don't duplicate (rule #18).
   - Note this module's spec source: FSD "Man Power GT — Modul Penjualan (Web Admin)"
     v1.2.0, BRD 2026.SHP-FSD.0003 (user-provided, not currently stored in the repo).

6. **Known non-compliant code** — the bullet list above, verbatim, so it's obvious
   these specific files are legacy pattern and shouldn't be copied for new ManPowerGT
   masters work.

7. **Pointer to deeper docs** — one line: `.kiro/steering/*.md` has more detailed
   per-domain rules (API design, DB, deployment, AppSheet) for the legacy/general app;
   note the two stale points found there (framework says .NET 8, actual is .NET 10;
   documented `Pk`-prefix PK convention doesn't match what the newest PowerGT code
   actually did).

8. **Heads-up note** — `MAVEN/Program.cs:60-61` loads `Cert/MAVEN.pfx` with a hardcoded
   certificate password in source (location only, not the value).

## Execution

- Write `c:\Users\Farrel\Documents\MAVEN\CLAUDE.md` directly (new file).
- Do not modify `.kiro/steering/` — different tool's docs, out of scope.
- No code changes, no commits, no actual ManPowerGT implementation — that's a future,
  separate task pending the user's review of its technical plan.

## Verification

- Re-read the written file once to confirm it renders cleanly as Markdown, the
  legacy-vs-new sections are unambiguous, and every claim traces back to a concrete
  file/finding from this session or the FSD (no invented specifics).

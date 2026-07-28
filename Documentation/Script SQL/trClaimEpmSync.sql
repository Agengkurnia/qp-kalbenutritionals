-- Claim EPM LISTING_CLAIM sync (snapshot harian)
-- Target: MavenDB (PostgreSQL)
-- Project: Development Fund Subdist — ingest LISTING_CLAIM dari Aries (Nextcloud WebDAV)
-- Related: Documentation/Claim-EPM-Sync-MAVEN.md
--
-- Key columns (tanpa prefix pk/ref):
--   claimEpmSyncId / claimEpmDetailId = primary key
--   claimEpmSyncId pada detail = foreign key ke trClaimEpmSync

CREATE TABLE IF NOT EXISTS "trClaimEpmSync" (
  "claimEpmSyncId"   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "txtFileName"      varchar(200) NOT NULL,
  "dtFileDate"       date NOT NULL,
  "txtStatus"        varchar(20) NOT NULL,
  "intRowCount"      integer NOT NULL DEFAULT 0,
  "bolIsLatest"      boolean NOT NULL DEFAULT false,
  "txtErrorMessage"  text NULL,
  "txtSource"        varchar(50) NOT NULL DEFAULT 'Hangfire',
  "bolActive"        boolean NOT NULL DEFAULT true,
  "refInsertedBy"    varchar(100) NULL,
  "dtInserted"       timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  "refUpdatedBy"     varchar(100) NULL,
  "dtUpdated"        timestamp without time zone NULL
);

CREATE INDEX IF NOT EXISTS "idx_trClaimEpmSync_fileDate"
  ON "trClaimEpmSync" ("dtFileDate" DESC);

CREATE INDEX IF NOT EXISTS "idx_trClaimEpmSync_isLatest"
  ON "trClaimEpmSync" ("bolIsLatest")
  WHERE "bolIsLatest" = true AND "bolActive" = true;

CREATE TABLE IF NOT EXISTS "trClaimEpmDetail" (
  "claimEpmDetailId"   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "claimEpmSyncId"     uuid NOT NULL REFERENCES "trClaimEpmSync" ("claimEpmSyncId"),
  "intRowNo"           integer NOT NULL,

  "txtProcessId"       varchar(50) NULL,
  "txtBranch"          varchar(100) NULL,
  "txtBranchSpcCode"   varchar(20) NULL,
  "txtPrincipalCode"   varchar(20) NULL,
  "txtPrincipalName"   varchar(200) NULL,
  "txtDeptCode"        varchar(20) NULL,
  "txtDeptName"        varchar(100) NULL,
  "txtProdClassCode"   varchar(30) NULL,
  "txtProdClassName"   varchar(100) NULL,
  "txtCustNumber"      varchar(50) NULL,
  "txtCustName"        varchar(200) NULL,
  "txtShipToSiteUseId" varchar(50) NULL,
  "txtTrxNumber"       varchar(50) NULL,
  "dtTrxDate"          date NULL,
  "txtKodeSalur"       varchar(20) NULL,
  "txtItemCode"        varchar(50) NULL,
  "txtItemName"        varchar(200) NULL,

  "decUnitJual"        numeric(18,4) NULL,
  "decUnitBonus"       numeric(18,4) NULL,
  "decRpLumpsum"       numeric(18,4) NULL,
  "decRpBonus"         numeric(18,4) NULL,
  "decPctEdpfPrin"     numeric(18,4) NULL,
  "decRpEdphPrin"      numeric(18,4) NULL,
  "decPctPromosi"      numeric(18,4) NULL,
  "decRpPromosi"       numeric(18,4) NULL,
  "decRpEdhl"          numeric(18,4) NULL,

  "txtSuratReferensi"  varchar(200) NULL,
  "txtSuratPrincipal"  varchar(200) NULL,
  "txtFakturReferensi" varchar(200) NULL,
  "decHna"             numeric(18,4) NULL,
  "txtFlagDap"         varchar(10) NULL,
  "txtItemCodeUtama"   varchar(50) NULL,
  "decUnitUtama"       numeric(18,4) NULL,
  "decHnaUtama"        numeric(18,4) NULL,

  "bolActive"          boolean NOT NULL DEFAULT true,
  "refInsertedBy"      varchar(100) NULL,
  "dtInserted"         timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  "refUpdatedBy"       varchar(100) NULL,
  "dtUpdated"          timestamp without time zone NULL
);

CREATE INDEX IF NOT EXISTS "idx_trClaimEpmDetail_sync"
  ON "trClaimEpmDetail" ("claimEpmSyncId");

CREATE INDEX IF NOT EXISTS "idx_trClaimEpmDetail_branch"
  ON "trClaimEpmDetail" ("txtBranchSpcCode", "txtBranch");

CREATE INDEX IF NOT EXISTS "idx_trClaimEpmDetail_trx"
  ON "trClaimEpmDetail" ("txtTrxNumber", "txtItemCode");

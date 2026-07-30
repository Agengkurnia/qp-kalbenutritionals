-- Claim EPM daily balance rekap (per Branch EPM + tanggal file)
-- Aggregate dari trClaimEpmDetail setelah sync sukses
-- Target: MavenDB (PostgreSQL)
-- Prerequisite: jalankan trClaimEpmSync.sql terlebih dahulu
-- Related: Documentation/Claim-EPM-Sync-MAVEN.md

CREATE TABLE IF NOT EXISTS "trClaimEpmDailyBalance" (
  "claimEpmDailyBalanceId" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "claimEpmSyncId"         uuid NOT NULL REFERENCES "trClaimEpmSync" ("claimEpmSyncId"),
  "dtFileDate"             date NOT NULL,
  "txtBranch"              varchar(100) NULL,
  "txtBranchSpcCode"       varchar(20) NULL,
  "txtShipToSiteUseId"     varchar(50) NULL,
  "intRowCount"            integer NOT NULL DEFAULT 0,
  "decRpLumpsum"           numeric(18,4) NOT NULL DEFAULT 0,
  "decRpEdphPrin"          numeric(18,4) NOT NULL DEFAULT 0,
  "decRpPromosi"           numeric(18,4) NOT NULL DEFAULT 0,
  "decRpEdhl"              numeric(18,4) NOT NULL DEFAULT 0,
  "decTotal"               numeric(18,4) NOT NULL DEFAULT 0,
  "bolIsLatest"            boolean NOT NULL DEFAULT false,
  "bolActive"              boolean NOT NULL DEFAULT true,
  "refInsertedBy"          varchar(100) NULL,
  "dtInserted"             timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  "refUpdatedBy"           varchar(100) NULL,
  "dtUpdated"              timestamp without time zone NULL
);

CREATE INDEX IF NOT EXISTS "idx_trClaimEpmDailyBalance_sync"
  ON "trClaimEpmDailyBalance" ("claimEpmSyncId");

CREATE INDEX IF NOT EXISTS "idx_trClaimEpmDailyBalance_fileDate"
  ON "trClaimEpmDailyBalance" ("dtFileDate" DESC);

CREATE INDEX IF NOT EXISTS "idx_trClaimEpmDailyBalance_branch"
  ON "trClaimEpmDailyBalance" ("txtBranchSpcCode", "txtBranch");

CREATE INDEX IF NOT EXISTS "idx_trClaimEpmDailyBalance_shipTo"
  ON "trClaimEpmDailyBalance" ("txtShipToSiteUseId");

CREATE INDEX IF NOT EXISTS "idx_trClaimEpmDailyBalance_isLatest"
  ON "trClaimEpmDailyBalance" ("bolIsLatest")
  WHERE "bolIsLatest" = true AND "bolActive" = true;

-- Satu ShipTo (+ branch) per sync
CREATE UNIQUE INDEX IF NOT EXISTS "uq_trClaimEpmDailyBalance_sync_shipTo"
  ON "trClaimEpmDailyBalance" (
    "claimEpmSyncId",
    COALESCE("txtShipToSiteUseId", ''),
    COALESCE("txtBranchSpcCode", ''),
    COALESCE("txtBranch", '')
  );

-- Migration: daily balance grain = ShipTo (+ branch attrs)
-- Target: MavenDB (PostgreSQL)
-- After this migration, re-run Claim EPM sync so balances rebuild.

ALTER TABLE "trClaimEpmDailyBalance"
  ADD COLUMN IF NOT EXISTS "txtShipToSiteUseId" varchar(50) NULL;

CREATE INDEX IF NOT EXISTS "idx_trClaimEpmDailyBalance_shipTo"
  ON "trClaimEpmDailyBalance" ("txtShipToSiteUseId");

DROP INDEX IF EXISTS "uq_trClaimEpmDailyBalance_sync_branch";

CREATE UNIQUE INDEX IF NOT EXISTS "uq_trClaimEpmDailyBalance_sync_shipTo"
  ON "trClaimEpmDailyBalance" (
    "claimEpmSyncId",
    COALESCE("txtShipToSiteUseId", ''),
    COALESCE("txtBranchSpcCode", ''),
    COALESCE("txtBranch", '')
  );

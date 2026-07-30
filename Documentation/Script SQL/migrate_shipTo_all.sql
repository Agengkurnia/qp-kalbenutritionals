-- =============================================================================
-- One-shot: add ShipTo (OutletID) columns for Monitoring Claim EPM
-- Target: MavenDB (PostgreSQL)
-- Run once, then Restart MAVEN + Refresh Claim EPM (rebuild daily balance).
-- =============================================================================

-- 1) Master mapping
ALTER TABLE "mDfMappingSubdist"
  ADD COLUMN IF NOT EXISTS "txtShipToSiteUseId" varchar(50) NULL;

CREATE INDEX IF NOT EXISTS "idx_mDfMappingSubdist_shipTo"
  ON "mDfMappingSubdist" ("txtShipToSiteUseId")
  WHERE "bolActive" = true
    AND "txtShipToSiteUseId" IS NOT NULL
    AND "txtShipToSiteUseId" <> '';

CREATE UNIQUE INDEX IF NOT EXISTS "mDfMappingSubdist_txtShipToSiteUseId_uq"
  ON "mDfMappingSubdist" ("txtShipToSiteUseId")
  WHERE "bolActive" = true
    AND "txtShipToSiteUseId" IS NOT NULL
    AND "txtShipToSiteUseId" <> '';

-- 2) Daily balance grain = ShipTo (+ branch attrs)
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

-- 3) Detail already has txtShipToSiteUseId from Claim EPM sync create script;
--    keep additive for older DBs that missed it.
ALTER TABLE "trClaimEpmDetail"
  ADD COLUMN IF NOT EXISTS "txtShipToSiteUseId" varchar(50) NULL;

-- Verify (optional):
-- SELECT column_name FROM information_schema.columns
-- WHERE table_name IN ('mDfMappingSubdist','trClaimEpmDailyBalance','trClaimEpmDetail')
--   AND column_name = 'txtShipToSiteUseId';

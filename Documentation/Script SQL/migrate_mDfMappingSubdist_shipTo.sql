-- Migration: add txtShipToSiteUseId to mDfMappingSubdist (Bosnet OutletID)
-- Target: MavenDB (PostgreSQL)

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

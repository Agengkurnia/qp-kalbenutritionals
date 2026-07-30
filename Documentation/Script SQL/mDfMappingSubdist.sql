-- Master Data — Mapping Subdist (Development Fund)
-- Target: MavenDB (PostgreSQL)
-- Project: Development Fund Subdist — Kalbe Nutritionals (SHP)
-- Related: Documentation/FSD/FSD_MasterData_MAVEN_v1.0.docx
--
-- Urutan eksekusi (satu file, dari atas ke bawah):
--   1. mDfActivity
--   2. mDfMappingSubdist
--   3. trDfMappingSubdistActivity

-- ---------------------------------------------------------------------------
-- 1. mDfActivity — master jenis activity (LOV Mapping Activity)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "mDfActivity" (
  "pkDfActivityId"   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "txtKode"          varchar(50) NOT NULL,
  "txtNama"          varchar(200) NOT NULL,
  "txtKategori"      varchar(100) NULL,
  "txtDeskripsi"     text NULL,
  "bolActive"        boolean NOT NULL DEFAULT true,
  "refInsertedBy"    varchar(100) NULL,
  "dtInserted"       timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  "refUpdatedBy"     varchar(100) NULL,
  "dtUpdated"        timestamp without time zone NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "mDfActivity_txtKode_uq"
  ON "mDfActivity" ("txtKode")
  WHERE "bolActive" = true;

CREATE INDEX IF NOT EXISTS "idx_mDfActivity_active"
  ON "mDfActivity" ("bolActive");

-- ---------------------------------------------------------------------------
-- 2. mDfMappingSubdist — Parent & Child Subdist (satu tabel)
--    Parent: bolIsParent = true  (tampil di Index)
--    Child : bolIsParent = false + refParentDfMappingSubdistId terisi
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "mDfMappingSubdist" (
  "pkDfMappingSubdistId"         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "txtKodeKmmd"                  varchar(50) NOT NULL,
  "txtNamaKmmd"                  varchar(255) NOT NULL,
  "txtTitik"                     varchar(100) NULL,
  "txtTipeKmmd"                  varchar(20) NULL,
  "txtRegion"                    varchar(100) NULL,
  "txtKodeBranchEpm"             varchar(50) NULL,
  "txtBranchEpm"                 varchar(200) NULL,
  "txtGroupType"                 varchar(20) NOT NULL,
  "bolIsParent"                  boolean NOT NULL DEFAULT true,
  "refParentDfMappingSubdistId"  uuid NULL
      REFERENCES "mDfMappingSubdist" ("pkDfMappingSubdistId"),
  "txtNamaGroup"                 varchar(200) NULL,
  "txtAlamat"                    text NULL,
  "txtShipToSiteUseId"           varchar(50) NULL,
  "bolActive"                    boolean NOT NULL DEFAULT true,
  "dtLinkedAt"                   date NULL,
  "refInsertedBy"                varchar(100) NULL,
  "dtInserted"                   timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  "refUpdatedBy"                 varchar(100) NULL,
  "dtUpdated"                    timestamp without time zone NULL,

  CONSTRAINT "mDfMappingSubdist_txtGroupType_chk"
    CHECK ("txtGroupType" IN ('Group', 'Non Group'))
);

CREATE UNIQUE INDEX IF NOT EXISTS "mDfMappingSubdist_txtKodeKmmd_uq"
  ON "mDfMappingSubdist" ("txtKodeKmmd")
  WHERE "bolActive" = true;

CREATE INDEX IF NOT EXISTS "idx_mDfMappingSubdist_parent"
  ON "mDfMappingSubdist" ("refParentDfMappingSubdistId")
  WHERE "bolActive" = true;

CREATE INDEX IF NOT EXISTS "idx_mDfMappingSubdist_isParent"
  ON "mDfMappingSubdist" ("bolIsParent")
  WHERE "bolIsParent" = true AND "bolActive" = true;

CREATE INDEX IF NOT EXISTS "idx_mDfMappingSubdist_branch"
  ON "mDfMappingSubdist" ("txtKodeBranchEpm", "txtBranchEpm");

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

CREATE INDEX IF NOT EXISTS "idx_mDfMappingSubdist_region"
  ON "mDfMappingSubdist" ("txtRegion");

-- ---------------------------------------------------------------------------
-- 3. trDfMappingSubdistActivity — relasi Parent ↔ Activity
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "trDfMappingSubdistActivity" (
  "pkDfMappingSubdistActivityId" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "refDfMappingSubdistId"        uuid NOT NULL
      REFERENCES "mDfMappingSubdist" ("pkDfMappingSubdistId"),
  "refDfActivityId"              uuid NOT NULL
      REFERENCES "mDfActivity" ("pkDfActivityId"),
  "bolActive"                    boolean NOT NULL DEFAULT true,
  "refInsertedBy"                varchar(100) NULL,
  "dtInserted"                   timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  "refUpdatedBy"                 varchar(100) NULL,
  "dtUpdated"                    timestamp without time zone NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "trDfMappingSubdistActivity_uq"
  ON "trDfMappingSubdistActivity" ("refDfMappingSubdistId", "refDfActivityId")
  WHERE "bolActive" = true;

CREATE INDEX IF NOT EXISTS "idx_trDfMappingSubdistActivity_subdist"
  ON "trDfMappingSubdistActivity" ("refDfMappingSubdistId");

CREATE INDEX IF NOT EXISTS "idx_trDfMappingSubdistActivity_activity"
  ON "trDfMappingSubdistActivity" ("refDfActivityId");

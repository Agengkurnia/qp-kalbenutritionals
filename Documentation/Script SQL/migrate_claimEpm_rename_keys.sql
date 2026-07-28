-- Migration: rename Claim EPM key columns (hapus prefix pk / ref pada ID)
-- Target: MavenDB — jalankan jika tabel sudah ada dengan nama lama
-- Safe to re-run (cek information_schema sebelum rename)

DO $$
BEGIN
  -- Drop FK constraints lama (nama constraint bisa beda; coba keduanya)
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'trClaimEpmDetail_refClaimEpmSyncId_fkey'
  ) THEN
    ALTER TABLE "trClaimEpmDetail" DROP CONSTRAINT "trClaimEpmDetail_refClaimEpmSyncId_fkey";
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'trClaimEpmDailyBalance_refClaimEpmSyncId_fkey'
  ) THEN
    ALTER TABLE "trClaimEpmDailyBalance" DROP CONSTRAINT "trClaimEpmDailyBalance_refClaimEpmSyncId_fkey";
  END IF;

  -- trClaimEpmSync
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trClaimEpmSync' AND column_name = 'pkClaimEpmSyncId'
  ) THEN
    ALTER TABLE "trClaimEpmSync" RENAME COLUMN "pkClaimEpmSyncId" TO "claimEpmSyncId";
  END IF;

  -- trClaimEpmDetail
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trClaimEpmDetail' AND column_name = 'pkClaimEpmDetailId'
  ) THEN
    ALTER TABLE "trClaimEpmDetail" RENAME COLUMN "pkClaimEpmDetailId" TO "claimEpmDetailId";
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trClaimEpmDetail' AND column_name = 'refClaimEpmSyncId'
  ) THEN
    ALTER TABLE "trClaimEpmDetail" RENAME COLUMN "refClaimEpmSyncId" TO "claimEpmSyncId";
  END IF;

  -- trClaimEpmDailyBalance
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trClaimEpmDailyBalance' AND column_name = 'pkClaimEpmDailyBalanceId'
  ) THEN
    ALTER TABLE "trClaimEpmDailyBalance" RENAME COLUMN "pkClaimEpmDailyBalanceId" TO "claimEpmDailyBalanceId";
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trClaimEpmDailyBalance' AND column_name = 'refClaimEpmSyncId'
  ) THEN
    ALTER TABLE "trClaimEpmDailyBalance" RENAME COLUMN "refClaimEpmSyncId" TO "claimEpmSyncId";
  END IF;

  -- Recreate FK
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'trClaimEpmDetail_claimEpmSyncId_fkey'
  ) THEN
    ALTER TABLE "trClaimEpmDetail"
      ADD CONSTRAINT "trClaimEpmDetail_claimEpmSyncId_fkey"
      FOREIGN KEY ("claimEpmSyncId") REFERENCES "trClaimEpmSync" ("claimEpmSyncId");
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'trClaimEpmDailyBalance_claimEpmSyncId_fkey'
  ) THEN
    ALTER TABLE "trClaimEpmDailyBalance"
      ADD CONSTRAINT "trClaimEpmDailyBalance_claimEpmSyncId_fkey"
      FOREIGN KEY ("claimEpmSyncId") REFERENCES "trClaimEpmSync" ("claimEpmSyncId");
  END IF;
END $$;

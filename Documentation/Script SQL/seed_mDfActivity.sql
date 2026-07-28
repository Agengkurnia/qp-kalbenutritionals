-- Seed mDfActivity (safe to re-run)
INSERT INTO "mDfActivity" ("pkDfActivityId", "txtKode", "txtNama", "txtKategori", "txtDeskripsi", "bolActive", "refInsertedBy")
SELECT gen_random_uuid(), v.kode, v.nama, v.kategori, v.deskripsi, true, 'system'
FROM (VALUES
  ('ACT-LISTING', 'Listing Fee', 'Trade', 'Aktivitas listing / listing fee'),
  ('ACT-DISPLAY', 'Display Fee', 'Trade', 'Aktivitas display / gondola'),
  ('ACT-PROMO', 'Promo Support', 'Promo', 'Dukungan promo subdist'),
  ('ACT-EVENT', 'Event / Gathering', 'Event', 'Event atau gathering outlet'),
  ('ACT-OTHER', 'Other DF Activity', 'Other', 'Aktivitas DF lainnya')
) AS v(kode, nama, kategori, deskripsi)
WHERE NOT EXISTS (
  SELECT 1 FROM "mDfActivity" a WHERE a."txtKode" = v.kode AND a."bolActive" = true
);

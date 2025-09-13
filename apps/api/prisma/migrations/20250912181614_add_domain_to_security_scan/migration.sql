/*
  Warnings:

  - Added the required column `domain` to the `security_scans` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Add column with a temporary default value
ALTER TABLE "security_scans" ADD COLUMN "domain" TEXT DEFAULT 'unknown.com';

-- Step 2: Update existing scans with actual domain from the first asset of each company
UPDATE "security_scans" 
SET "domain" = (
  SELECT a.domain 
  FROM "assets" a 
  WHERE a."companyId" = "security_scans"."companyId" 
    AND a."isActive" = true 
  LIMIT 1
)
WHERE "domain" = 'unknown.com';

-- Step 3: Make the column required (remove default)
ALTER TABLE "security_scans" ALTER COLUMN "domain" DROP DEFAULT;
ALTER TABLE "security_scans" ALTER COLUMN "domain" SET NOT NULL;

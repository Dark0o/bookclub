-- Drop existing data (if any)
TRUNCATE TABLE "User" CASCADE;

-- Drop the old primary key constraint
ALTER TABLE "User" DROP CONSTRAINT IF EXISTS "User_pkey";

-- Drop the old id column
ALTER TABLE "User" DROP COLUMN IF EXISTS "id";

-- Add new id column with SERIAL (auto-increment)
ALTER TABLE "User" ADD COLUMN "id" SERIAL PRIMARY KEY;


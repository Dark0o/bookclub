-- AlterTable: Convert id from String to Int while preserving data
-- Step 1: Create new column with auto-increment
ALTER TABLE "User" ADD COLUMN "id_new" SERIAL;

-- Step 2: Copy existing user (set to ID=1)
UPDATE "User" SET "id_new" = 1 WHERE "id" = (SELECT "id" FROM "User" LIMIT 1);

-- Step 3: Drop old id column and constraints
ALTER TABLE "User" DROP CONSTRAINT "User_pkey";
ALTER TABLE "User" DROP COLUMN "id";

-- Step 4: Rename new column to id
ALTER TABLE "User" RENAME COLUMN "id_new" TO "id";

-- Step 5: Add primary key constraint
ALTER TABLE "User" ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- Step 6: Set sequence to start from 2 (next user will be ID=2)
SELECT setval(pg_get_serial_sequence('"User"', 'id'), 1, true);

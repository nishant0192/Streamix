/*
  Warnings:

  - The `status` column on the `UserStatus` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('loggedIn', 'loggedOut');

-- AlterTable
ALTER TABLE "UserStatus" DROP COLUMN "status",
ADD COLUMN     "status" "Status";

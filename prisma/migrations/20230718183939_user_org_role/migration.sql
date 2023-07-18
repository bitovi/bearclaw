/*
  Warnings:

  - You are about to drop the column `experienceMax` on the `OrganizationUsers` table. All the data in the column will be lost.
  - You are about to drop the column `experienceMin` on the `OrganizationUsers` table. All the data in the column will be lost.
  - You are about to drop the column `teamSizeMax` on the `OrganizationUsers` table. All the data in the column will be lost.
  - You are about to drop the column `teamSizeMin` on the `OrganizationUsers` table. All the data in the column will be lost.
  - Made the column `role` on table `OrganizationUsers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `accountStatus` on table `OrganizationUsers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "OrganizationUsers" DROP COLUMN "experienceMax",
DROP COLUMN "experienceMin",
DROP COLUMN "teamSizeMax",
DROP COLUMN "teamSizeMin",
ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'member',
ALTER COLUMN "accountStatus" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "experienceMax" INTEGER,
ADD COLUMN     "experienceMin" INTEGER,
ADD COLUMN     "role" TEXT,
ADD COLUMN     "teamSizeMax" INTEGER,
ADD COLUMN     "teamSizeMin" INTEGER;

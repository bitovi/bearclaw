/*
  Warnings:

  - Made the column `role` on table `OrganizationUsers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `accountStatus` on table `OrganizationUsers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "OrganizationUsers" ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "accountStatus" SET NOT NULL;

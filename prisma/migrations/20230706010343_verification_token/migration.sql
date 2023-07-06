/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ResetPasswordToken` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `ResetPasswordToken` table. All the data in the column will be lost.
  - You are about to drop the column `emailTokenCreatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerificationToken` on the `User` table. All the data in the column will be lost.
  - Added the required column `numericCode` to the `ResetPasswordToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ResetPasswordToken" DROP COLUMN "createdAt",
DROP COLUMN "token",
ADD COLUMN     "numericCode" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailTokenCreatedAt",
DROP COLUMN "emailVerificationToken";

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" TEXT NOT NULL,
    "numericCode" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_userId_key" ON "VerificationToken"("userId");

-- AddForeignKey
ALTER TABLE "VerificationToken" ADD CONSTRAINT "VerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "BusinessAccount" (
    "accountId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "BusinessAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessAccount_userId_key" ON "BusinessAccount"("userId");

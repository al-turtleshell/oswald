/*
  Warnings:

  - Added the required column `state` to the `Inbox` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InboxState" AS ENUM ('Pending', 'Processed');

-- AlterTable
ALTER TABLE "Inbox" ADD COLUMN     "processedAt" TIMESTAMP(3),
ADD COLUMN     "state" "InboxState" NOT NULL;

-- CreateIndex
CREATE INDEX "inbox_state_processedAt_idx" ON "Inbox"("state", "processedAt");

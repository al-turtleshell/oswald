-- CreateEnum
CREATE TYPE "OutboxState" AS ENUM ('Pending', 'Published');

-- CreateTable
CREATE TABLE "EventStore" (
    "id" TEXT NOT NULL,
    "aggregateId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventStore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AggregateVersion" (
    "aggregateId" TEXT NOT NULL,
    "version" TEXT NOT NULL,

    CONSTRAINT "AggregateVersion_pkey" PRIMARY KEY ("aggregateId")
);

-- CreateTable
CREATE TABLE "Outbox" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "state" "OutboxState" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "Outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventStore_aggregateId_idx" ON "EventStore"("aggregateId");

-- CreateIndex
CREATE INDEX "AggregateVersion_aggregateId_idx" ON "AggregateVersion"("aggregateId");

-- CreateIndex
CREATE INDEX "outbox_state_publishedAt_idx" ON "Outbox"("state", "publishedAt");

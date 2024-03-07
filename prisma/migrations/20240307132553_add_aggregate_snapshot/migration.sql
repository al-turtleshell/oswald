-- CreateTable
CREATE TABLE "AggregateSnapshot" (
    "id" TEXT NOT NULL,
    "aggregateId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payload" JSONB NOT NULL,

    CONSTRAINT "AggregateSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AggregateSnapshot_aggregateId_idx" ON "AggregateSnapshot"("aggregateId");

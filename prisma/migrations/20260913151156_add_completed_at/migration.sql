-- AlterTable
ALTER TABLE "PracticeSession" ADD COLUMN     "completedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "PracticeSession_userId_completedAt_idx" ON "PracticeSession"("userId", "completedAt");

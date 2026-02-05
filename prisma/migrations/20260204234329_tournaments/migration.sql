-- CreateEnum
CREATE TYPE "TournamentType" AS ENUM ('DAILY_SPRINT');

-- CreateEnum
CREATE TYPE "TournamentStatus" AS ENUM ('ACTIVE', 'COMPLETED');

-- CreateTable
CREATE TABLE "Tournament" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" "TournamentType" NOT NULL,
  "status" "TournamentStatus" NOT NULL DEFAULT 'ACTIVE',
  "startsAt" TIMESTAMP(3) NOT NULL,
  "endsAt" TIMESTAMP(3) NOT NULL,
  "kFactor" INTEGER NOT NULL DEFAULT 10,
  "prizePoolCents" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TournamentEntry" (
  "id" TEXT NOT NULL,
  "tournamentId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "points" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "bestMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1,
  "roundsCount" INTEGER NOT NULL DEFAULT 0,
  "lastRoundAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "TournamentEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TournamentRound" (
  "id" TEXT NOT NULL,
  "tournamentId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "roundId" TEXT NOT NULL,
  "stakeCents" INTEGER NOT NULL,
  "multiplier" DOUBLE PRECISION NOT NULL,
  "points" DOUBLE PRECISION NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "TournamentRound_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_slug_key" ON "Tournament"("slug");

-- CreateIndex
CREATE INDEX "Tournament_status_endsAt_idx" ON "Tournament"("status", "endsAt");

-- CreateIndex
CREATE UNIQUE INDEX "TournamentEntry_tournamentId_userId_key" ON "TournamentEntry"("tournamentId", "userId");

-- CreateIndex
CREATE INDEX "TournamentEntry_tournamentId_points_idx" ON "TournamentEntry"("tournamentId", "points");

-- CreateIndex
CREATE INDEX "TournamentEntry_userId_updatedAt_idx" ON "TournamentEntry"("userId", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TournamentRound_tournamentId_roundId_key" ON "TournamentRound"("tournamentId", "roundId");

-- CreateIndex
CREATE INDEX "TournamentRound_tournamentId_createdAt_idx" ON "TournamentRound"("tournamentId", "createdAt");

-- CreateIndex
CREATE INDEX "TournamentRound_userId_createdAt_idx" ON "TournamentRound"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "TournamentEntry" ADD CONSTRAINT "TournamentEntry_tournamentId_fkey"
  FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentEntry" ADD CONSTRAINT "TournamentEntry_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentRound" ADD CONSTRAINT "TournamentRound_tournamentId_fkey"
  FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentRound" ADD CONSTRAINT "TournamentRound_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Tournaments (TEXT-based: no Postgres ENUMs to avoid conflicts)

CREATE TABLE IF NOT EXISTS "Tournament" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "startsAt" TIMESTAMP(3) NOT NULL,
  "endsAt" TIMESTAMP(3),
  "kFactor" DOUBLE PRECISION NOT NULL DEFAULT 10,
  "prizePoolCents" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "TournamentEntry" (
  "id" TEXT PRIMARY KEY,
  "tournamentId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "points" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "bestMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "roundsCount" INTEGER NOT NULL DEFAULT 0,
  "lastRoundAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TournamentEntry_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "TournamentEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "TournamentEntry_tournamentId_userId_key" ON "TournamentEntry"("tournamentId", "userId");
CREATE INDEX IF NOT EXISTS "TournamentEntry_tournamentId_points_idx" ON "TournamentEntry"("tournamentId", "points");

CREATE TABLE IF NOT EXISTS "TournamentRound" (
  "id" TEXT PRIMARY KEY,
  "tournamentId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "roundId" TEXT NOT NULL,
  "stakeCents" INTEGER NOT NULL,
  "multiplier" DOUBLE PRECISION NOT NULL,
  "points" DOUBLE PRECISION NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TournamentRound_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "TournamentRound_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "TournamentRound_tournamentId_userId_roundId_key" ON "TournamentRound"("tournamentId","userId","roundId");
CREATE INDEX IF NOT EXISTS "TournamentRound_tournamentId_createdAt_idx" ON "TournamentRound"("tournamentId","createdAt");

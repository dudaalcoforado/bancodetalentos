-- CreateTable
CREATE TABLE "WeeklyReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ReportVaga" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reportId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "prioridade" TEXT NOT NULL DEFAULT 'P1',
    "qtdVagas" INTEGER NOT NULL DEFAULT 1,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ReportVaga_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "WeeklyReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReportPhase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vagaId" TEXT NOT NULL,
    "fase" TEXT NOT NULL,
    "quantidade" TEXT NOT NULL,
    "observacoes" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ReportPhase_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "ReportVaga" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "WeeklyReport_criadoEm_idx" ON "WeeklyReport"("criadoEm");

-- CreateIndex
CREATE INDEX "ReportVaga_reportId_idx" ON "ReportVaga"("reportId");

-- CreateIndex
CREATE INDEX "ReportPhase_vagaId_idx" ON "ReportPhase"("vagaId");

-- CreateTable
CREATE TABLE "Vaga" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Aberta',
    "nivelRequisitado" TEXT,
    "nivelContratado" TEXT,
    "projeto" TEXT,
    "pessoaAlocada" TEXT,
    "recrutadores" TEXT,
    "prioridade" TEXT,
    "fonte" TEXT,
    "abertura" DATETIME,
    "fechamento" DATETIME,
    "dataEntrada" DATETIME,
    "prazoFechamento" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Vaga_status_idx" ON "Vaga"("status");

-- CreateIndex
CREATE INDEX "Vaga_createdAt_idx" ON "Vaga"("createdAt");

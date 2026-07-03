-- CreateTable
CREATE TABLE "TalentApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "preferredName" TEXT NOT NULL,
    "pronoun" TEXT,
    "city" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "linkedin" TEXT NOT NULL,
    "resumeFileName" TEXT NOT NULL,
    "resumeStoragePath" TEXT NOT NULL,
    "seniority" TEXT,
    "salaryExpectation" TEXT,
    "stacks" TEXT,
    "skills" TEXT,
    "education" TEXT,
    "experience" TEXT,
    "values" TEXT NOT NULL,
    "motivation" TEXT,
    "futureVision" TEXT,
    "aiLevel" TEXT,
    "aiPurpose" TEXT,
    "aiAutomation" TEXT,
    "howFound" TEXT,
    "referredBy" TEXT,
    "affirmativeGroups" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "TalentApplication_createdAt_idx" ON "TalentApplication"("createdAt");

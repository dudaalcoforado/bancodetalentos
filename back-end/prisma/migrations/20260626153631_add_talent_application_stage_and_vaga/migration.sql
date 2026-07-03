-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TalentApplication" (
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
    "vaga" TEXT,
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
    "stage" TEXT NOT NULL DEFAULT 'SEM_FASE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_TalentApplication" ("affirmativeGroups", "aiAutomation", "aiLevel", "aiPurpose", "city", "createdAt", "education", "email", "experience", "fullName", "futureVision", "howFound", "id", "linkedin", "motivation", "phone", "preferredName", "pronoun", "referredBy", "resumeFileName", "resumeStoragePath", "salaryExpectation", "seniority", "skills", "stacks", "values") SELECT "affirmativeGroups", "aiAutomation", "aiLevel", "aiPurpose", "city", "createdAt", "education", "email", "experience", "fullName", "futureVision", "howFound", "id", "linkedin", "motivation", "phone", "preferredName", "pronoun", "referredBy", "resumeFileName", "resumeStoragePath", "salaryExpectation", "seniority", "skills", "stacks", "values" FROM "TalentApplication";
DROP TABLE "TalentApplication";
ALTER TABLE "new_TalentApplication" RENAME TO "TalentApplication";
CREATE INDEX "TalentApplication_createdAt_idx" ON "TalentApplication"("createdAt");
CREATE INDEX "TalentApplication_stage_idx" ON "TalentApplication"("stage");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

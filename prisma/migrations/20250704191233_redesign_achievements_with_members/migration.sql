/*
  Warnings:

  - You are about to drop the column `instagramUrl` on the `Achievement` table. All the data in the column will be lost.
  - You are about to drop the column `linkedinUrl` on the `Achievement` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Achievement` table. All the data in the column will be lost.
  - Added the required column `type` to the `Achievement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Achievement` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AchievementType" AS ENUM ('SOLO', 'TEAM', 'GROUP');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AchievementCategory" ADD VALUE 'SPORTS';
ALTER TYPE "AchievementCategory" ADD VALUE 'CULTURAL';
ALTER TYPE "AchievementCategory" ADD VALUE 'TECHNICAL';
ALTER TYPE "AchievementCategory" ADD VALUE 'ACADEMIC';

-- AlterTable
ALTER TABLE "Achievement" DROP COLUMN "instagramUrl",
DROP COLUMN "linkedinUrl",
DROP COLUMN "name",
ADD COLUMN     "certificateUrl" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "event" TEXT,
ADD COLUMN     "organizer" TEXT,
ADD COLUMN     "projectUrl" TEXT,
ADD COLUMN     "type" "AchievementType" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "venue" TEXT;

-- CreateTable
CREATE TABLE "AchievementMember" (
    "id" SERIAL NOT NULL,
    "achievementId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "rollNumber" TEXT,
    "year" TEXT,
    "branch" TEXT,
    "linkedinUrl" TEXT,
    "githubUrl" TEXT,
    "instagramUrl" TEXT,
    "portfolioUrl" TEXT,
    "photoUrl" TEXT,

    CONSTRAINT "AchievementMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AchievementMember_achievementId_idx" ON "AchievementMember"("achievementId");

-- AddForeignKey
ALTER TABLE "AchievementMember" ADD CONSTRAINT "AchievementMember_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

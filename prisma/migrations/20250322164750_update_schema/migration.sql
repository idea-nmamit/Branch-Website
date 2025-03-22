/*
  Warnings:

  - Added the required column `index` to the `TeamPage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TeamPage" ADD COLUMN     "index" INTEGER NOT NULL;

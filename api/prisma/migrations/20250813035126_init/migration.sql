/*
  Warnings:

  - You are about to drop the column `ownerId` on the `projects` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."projects" DROP CONSTRAINT "projects_ownerId_fkey";

-- AlterTable
ALTER TABLE "public"."projects" DROP COLUMN "ownerId",
ADD COLUMN     "assignToId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."projects" ADD CONSTRAINT "projects_assignToId_fkey" FOREIGN KEY ("assignToId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the `_ProjectCategories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_ProjectCategories" DROP CONSTRAINT "_ProjectCategories_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ProjectCategories" DROP CONSTRAINT "_ProjectCategories_B_fkey";

-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "role" SET DEFAULT 'ADMIN';

-- DropTable
DROP TABLE "public"."_ProjectCategories";

-- DropTable
DROP TABLE "public"."category";

-- DropEnum
DROP TYPE "public"."CategoryType";

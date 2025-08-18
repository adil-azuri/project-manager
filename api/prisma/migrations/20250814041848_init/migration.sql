/*
  Warnings:

  - Changed the type of `name` on the `category` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."CategoryType" AS ENUM ('BAHASA', 'MIPA', 'IPS');

-- AlterTable
ALTER TABLE "public"."category" DROP COLUMN "name",
ADD COLUMN     "name" "public"."CategoryType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "public"."category"("name");

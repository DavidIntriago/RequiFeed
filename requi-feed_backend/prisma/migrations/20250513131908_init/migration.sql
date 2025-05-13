/*
  Warnings:

  - You are about to drop the column `external_token` on the `Cuenta` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[external_id]` on the table `Cuenta` will be added. If there are existing duplicate values, this will fail.
  - The required column `external_id` was added to the `Cuenta` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Cuenta" DROP COLUMN "external_token",
ADD COLUMN     "external_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Cuenta_external_id_key" ON "Cuenta"("external_id");

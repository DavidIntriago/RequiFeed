/*
  Warnings:

  - You are about to drop the column `idRol` on the `Usuario` table. All the data in the column will be lost.
  - Added the required column `rolId` to the `Cuenta` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_idRol_fkey";

-- AlterTable
ALTER TABLE "Cuenta" ADD COLUMN     "rolId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "idRol";

-- AddForeignKey
ALTER TABLE "Cuenta" ADD CONSTRAINT "Cuenta_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

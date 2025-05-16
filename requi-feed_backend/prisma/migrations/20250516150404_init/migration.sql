/*
  Warnings:

  - You are about to drop the column `descripcion` on the `PeriodoAcademico` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[external_id]` on the table `Calificacion` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[external_id]` on the table `Comentario` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[external_id]` on the table `Grupo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[external_id]` on the table `Proyecto` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[external_id]` on the table `Requisito` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[external_id]` on the table `Revision` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[external_id]` on the table `Rol` will be added. If there are existing duplicate values, this will fail.
  - The required column `external_id` was added to the `Calificacion` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `external_id` was added to the `Comentario` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `external_id` was added to the `Grupo` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `external_id` was added to the `Proyecto` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Made the column `descripcion` on table `Proyecto` required. This step will fail if there are existing NULL values in that column.
  - The required column `external_id` was added to the `Requisito` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `external_id` was added to the `Revision` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `external_id` was added to the `Rol` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Made the column `nombre` on table `Usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `apellido` on table `Usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `area` on table `Usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cargo` on table `Usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ocupacion` on table `Usuario` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Calificacion" ADD COLUMN     "external_id" TEXT NOT NULL,
ALTER COLUMN "comentario" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Comentario" ADD COLUMN     "external_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Cuenta" ALTER COLUMN "estado" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Grupo" ADD COLUMN     "external_id" TEXT NOT NULL,
ALTER COLUMN "nombre" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PeriodoAcademico" DROP COLUMN "descripcion",
ALTER COLUMN "modalidad" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Proyecto" ADD COLUMN     "external_id" TEXT NOT NULL,
ALTER COLUMN "descripcion" SET NOT NULL;

-- AlterTable
ALTER TABLE "Requisito" ADD COLUMN     "external_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Revision" ADD COLUMN     "external_id" TEXT NOT NULL,
ALTER COLUMN "fechaLimite" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Rol" ADD COLUMN     "external_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "nombre" SET NOT NULL,
ALTER COLUMN "apellido" SET NOT NULL,
ALTER COLUMN "area" SET NOT NULL,
ALTER COLUMN "cargo" SET NOT NULL,
ALTER COLUMN "ocupacion" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Calificacion_external_id_key" ON "Calificacion"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "Comentario_external_id_key" ON "Comentario"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "Grupo_external_id_key" ON "Grupo"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "Proyecto_external_id_key" ON "Proyecto"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "Requisito_external_id_key" ON "Requisito"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "Revision_external_id_key" ON "Revision"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "Rol_external_id_key" ON "Rol"("external_id");

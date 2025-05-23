/*
  Warnings:

  - A unique constraint covering the columns `[calificacionId]` on the table `Proyecto` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Calificacion" ALTER COLUMN "puntuacion" SET DATA TYPE DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "Proyecto_calificacionId_key" ON "Proyecto"("calificacionId");

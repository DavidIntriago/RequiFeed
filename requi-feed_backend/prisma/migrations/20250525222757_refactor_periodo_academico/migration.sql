/*
  Warnings:

  - You are about to drop the column `PeriodoAcademico` on the `PeriodoAcademico` table. All the data in the column will be lost.
  - Added the required column `fechaFin` to the `PeriodoAcademico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaInicio` to the `PeriodoAcademico` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PeriodoAcademico" DROP COLUMN "PeriodoAcademico",
ADD COLUMN     "fechaFin" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fechaInicio" TIMESTAMP(3) NOT NULL;

/*
  Warnings:

  - Added the required column `apellido` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `area` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cargo` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foto` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ocupacion` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "apellido" TEXT NOT NULL,
ADD COLUMN     "area" TEXT NOT NULL,
ADD COLUMN     "cargo" TEXT NOT NULL,
ADD COLUMN     "foto" TEXT NOT NULL,
ADD COLUMN     "ocupacion" TEXT NOT NULL;

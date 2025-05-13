/*
  Warnings:

  - Added the required column `external_token` to the `Cuenta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cuenta" ADD COLUMN     "external_token" TEXT NOT NULL;

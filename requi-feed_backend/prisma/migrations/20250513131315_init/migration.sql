-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_grupoId_fkey";

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "grupoId" DROP NOT NULL,
ALTER COLUMN "foto" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "Grupo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

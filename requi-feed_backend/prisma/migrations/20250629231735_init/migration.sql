/*
  Warnings:

  - You are about to drop the column `fechaLimite` on the `Revision` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `Revision` table. All the data in the column will be lost.
  - Added the required column `usuarioId` to the `Comentario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comentario" ADD COLUMN     "comentarioPadreId" INTEGER,
ADD COLUMN     "usuarioId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Revision" DROP COLUMN "fechaLimite",
DROP COLUMN "tipo",
ADD COLUMN     "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "fechaLimite" (
    "id" SERIAL NOT NULL,
    "external_id" TEXT NOT NULL,
    "fechaLimite" TIMESTAMP(3) NOT NULL,
    "tipo" "TipoRevision" NOT NULL,
    "proyectoId" INTEGER NOT NULL,

    CONSTRAINT "fechaLimite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fechaLimite_external_id_key" ON "fechaLimite"("external_id");

-- AddForeignKey
ALTER TABLE "fechaLimite" ADD CONSTRAINT "fechaLimite_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "Proyecto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_comentarioPadreId_fkey" FOREIGN KEY ("comentarioPadreId") REFERENCES "Comentario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

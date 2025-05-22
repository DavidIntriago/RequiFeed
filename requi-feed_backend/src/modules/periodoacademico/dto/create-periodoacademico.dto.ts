import { PeriodoAcademico } from "@prisma/client";

export type periodoAcademicoDto = Omit<PeriodoAcademico,"id" | "createdAt" | "updatedAt"> 
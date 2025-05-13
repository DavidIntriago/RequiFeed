import { Cuenta } from "@prisma/client";

export type Login = Omit<Cuenta,"fechaCreacion" | "id" | "createdAt" | "updatedAt"> 
import { Usuario } from "@prisma/client";

export type Registry = Omit<Usuario, "id" | "createdAt" | "updatedAt"> & {
  contrasenia: string;
  email: string;
  external_token: string;
};
import { Usuario } from "@prisma/client";

export type Registry = Omit<Usuario, "id" | "createdAt" | "updatedAt" | 'grupoId' | 'cuentaId' > & {
  contrasenia: string;
  email: string;
};
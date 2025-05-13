import { Usuario} from "@prisma/client";

export type CreateUsuarioDto = Omit<Usuario, 'id' | 'createdAt' | 'updatedAt'>





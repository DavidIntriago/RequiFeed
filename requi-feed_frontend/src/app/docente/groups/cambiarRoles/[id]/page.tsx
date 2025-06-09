'use client';

import {
  ActionIcon,
  Container,
  Group,
  Paper,
  PaperProps,
  Stack,
  Text,
} from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';
import { get_api } from '@/hooks/Conexion';
// import UsersTable from '@/components/UsersTable/UsersTable';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import mensajes from '@/components/Notification/Mensajes';
import { get } from '@/hooks/SessionUtil';

// Dinámico y solo en cliente
const UsersTable = dynamic(() => import('@/components/UsersTable/UserTableGroup/UsersTable'), {
  ssr: false,
});

type Rol = {
  id: number;
  external_id: string;
  tipo: string;
};

const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
};
type CuentaResponse = {
  id: number;
  external_id: string;
  fechaCreacion: string; // ISO date string
  email: string;
  contrasenia: string;
  estado: string;
  rolId: number;
  Rol: Rol
};
type GrupoResponse  = {
  id: number,
  external_id: string,
  nombre: string,
  descripcion: string,
  idPeriodoAcademico: number,
}

type UsuarioGrupoResponse = {
  id: number;
  nombre: string;
  apellido: string;
  ocupacion: string;
  area: string;
  foto: string | null;
  grupoId: number;
  cuentaId: number;
  cuenta: CuentaResponse;
  grupo: GrupoResponse;
};


function transformToGroup(data: any): UsuarioGrupoResponse {
  return {
    id: data.id,
    nombre: data.nombre,
    apellido: data.apellido,
    ocupacion: data.ocupacion,
    area: data.area,
    foto: data.foto,
    grupoId: data.grupoId,
    cuentaId: data.cuentaId,
    cuenta: data.cuenta,
    grupo: data.grupo
  }
}
function Page() {
  const [data, setData] = useState<UsuarioGrupoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const token = get('token');

  const getGroupInformation = async () => {
    try {
      if ( token != null && typeof id == 'string' ){
        const {data} = await get_api(`grupo/users/${id}`);
        const users: UsuarioGrupoResponse[] = data.map(transformToGroup);
        console.log('USERSSS');
        console.log(users);
        setData(users);
        setLoading(false);
      }            
      } catch (error:any) {
        console.log(error);
        mensajes("Error", error.response?.data?.customMessage || "No se ha podido obtener los usuarios", "error");
      }
    }

  useEffect(() => {
    getGroupInformation();
        // setResearchers(mockResearchers);
  }, [id]);

  return (
    <>
      <title>Grupos | Requifeed</title>
      <meta name="description" content="Lista de usuarios" />

      <Container fluid>
        <Stack gap="lg">
          <Paper {...PAPER_PROPS}>
            <Group justify="space-between" mb="md">
              <Text fz="lg" fw={600}>
                Usuarios
              </Text>
              <ActionIcon>
                <IconDotsVertical size={18} />
              </ActionIcon>
            </Group>
            <UsersTable
              data={data || []}
              error={error}
              loading={loading}
            />
          </Paper>
        </Stack>
      </Container>
    </>
  );
}

export default Page;

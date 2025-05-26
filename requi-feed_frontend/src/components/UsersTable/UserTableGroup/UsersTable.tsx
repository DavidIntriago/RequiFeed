'use client';

import {
  DataTable,
  DataTableProps,
} from 'mantine-datatable';
import { Badge, Button, MantineColor } from '@mantine/core';
// import { User } from '@/types';
import { ErrorAlert } from '@/components';
import { useEffect, useMemo, useState } from 'react';
import { patch_api } from '@/hooks/Conexion';


type Rol = {
  id: number;
  external_id: string;
  tipo: string;
};

type CuentaResponse = {
  id: number;
  external_id: string;
  fechaCreacion: string; // ISO date string
  email: string;
  contrasenia: string;
  estado: string;
  rolId: number;
  Rol: Rol;
};

type User = {
  id: number;
  nombre: string;
  apellido: string;
  ocupacion: string;
  area: string;
  foto: string | null;
  grupoId: number;
  cuentaId: number;
  cuenta: CuentaResponse;
};

type UsersTableProps = {
  data: User[];
  loading?: boolean;
  error?: React.ReactNode;
};

const COLORS: MantineColor[] = [
  'blue', 'cyan', 'teal', 'grape', 'indigo', 'orange', 'lime', 'red', 'violet',
];

const getGrupoColorMap = (data: User[]) => {
  const colorMap = new Map<number, MantineColor>();
  let colorIndex = 0;

  for (const user of data) {
    const grupoId = user.grupoId;
    if (grupoId && !colorMap.has(grupoId)) {
      colorMap.set(grupoId, COLORS[colorIndex % COLORS.length]);
      colorIndex++;
    }
  }

  return colorMap;
};


const UsersTable = ({ data, loading, error }: UsersTableProps) => {
  const [users, setUsers] = useState<User[]>(data); // estado local
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  useEffect(() => {
      setUsers(data);
      console.log('Informacion de userss');
      console.log(data);
    }, [data]);
  const handleToggle = async (userId: string, rol: string) => {
    setUpdatingUserId(userId);

    const newRol = rol === 'ANALISTA' ? 'LIDER' : 'ANALISTA';
    const json = { rolType: newRol };

    await patch_api(`cuenta/cambiarrol/${userId}`, json);
    
    
    // Actualiza localmente el rol del usuario
    setUsers((prev) =>
      prev.map((user) =>
        user.cuenta.external_id === userId
          ? {
              ...user,
              cuenta: {
                ...user.cuenta,
                Rol: { ...user.cuenta.Rol, tipo: newRol },
              },
            }
          : user
      )
    );

    setUpdatingUserId(null);
  };

  const grupoColorMap = useMemo(() => getGrupoColorMap(users), [users]);

  const GrupoBadge = ({ grupoId }: { grupoId?: number }) => {
    const color: MantineColor = grupoId
      ? grupoColorMap.get(grupoId) || 'blue'
      : 'gray';
    const label = grupoId ? `Grupo ${grupoId}` : 'Sin grupo';

    return (
      <Badge color={color} variant="light" radius="sm">
        {label}
      </Badge>
    );
  };

  const columns: DataTableProps<User>['columns'] = [
    
    { accessor: 'id', title: 'ID' },
    {
      accessor: 'nombreCompleto',
      title: 'Nombre',
      render: (user) => `${user.nombre} ${user.apellido}`,
    },
    { accessor: 'cuenta.email', title: 'Correo' },
    {
      accessor: 'grupoId',
      title: 'Grupo',
      render: (user) => <GrupoBadge grupoId={user.grupoId} />,
    },
    { accessor: 'cuenta.Rol.tipo',
      title: 'Rol',
      render: (user) => {
        const rol = user.cuenta.Rol.tipo;
        if (!data) return null;
        // Solo muestra el botón si el rol es ANALISTA u OBSERVADOR
        if (rol == 'DOCENTE' || rol == 'OBSERVADOR') {
          return null; // No se renderiza nada
        }

        return (
          <Button
            size="xs"
            color={rol === 'ANALISTA' ? 'green' : 'red'}
            loading={updatingUserId === user.cuenta.external_id}
            onClick={() => handleToggle(user.cuenta.external_id, rol)}
          >
            {rol === 'ANALISTA' ? 'ANALISTA' : 'LIDER'}
          </Button>
        );
      }
    },
    // {
    //   accessor: 'observador',
    //   title: 'Observador',
      
    // },
  ];

  if (error) {
    return <ErrorAlert title="Error al cargar usuarios" message={error.toString()} />;
  }



  return (
    <DataTable
      columns={columns}
      records={users} // usa el estado local
      fetching={loading}
      striped
      highlightOnHover
    />
  );
};

export default UsersTable;

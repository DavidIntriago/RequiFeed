'use client';

import {
  DataTable,
  DataTableProps,
} from 'mantine-datatable';
import { Badge, Button, MantineColor } from '@mantine/core';
import { User } from '@/types';
import { ErrorAlert } from '@/components';
import { useMemo, useState } from 'react';
import { patch_api } from '@/hooks/Conexion';

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
  
  const handleToggle = async (userId: string, rol: string) => {
    setUpdatingUserId(userId);

    const newRol = rol === 'ANALISTA' ? 'OBSERVADOR' : 'ANALISTA';
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

  const grupoColorMap = useMemo(() => getGrupoColorMap(data), [data]);

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
      title: 'Rol'
    },
    {
      accessor: 'observador',
      title: 'Observador',
      render: (user) => {
        const rol = user.cuenta.Rol.tipo;

        // Solo muestra el botón si el rol es ANALISTA u OBSERVADOR
        if (rol !== 'ANALISTA' && rol !== 'OBSERVADOR') {
          return null; // No se renderiza nada
        }

        return (
          <Button
            size="xs"
            color={rol === 'OBSERVADOR' ? 'gray' : 'green'}
            loading={updatingUserId === user.cuenta.external_id}
            onClick={() => handleToggle(user.cuenta.external_id, rol)}
          >
            {rol === 'OBSERVADOR' ? 'Sí' : 'No'}
          </Button>
        );
      }
    },
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

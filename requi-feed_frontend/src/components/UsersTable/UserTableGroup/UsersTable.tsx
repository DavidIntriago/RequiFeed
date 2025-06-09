'use client';

import {
  DataTable,
  DataTableProps,
} from 'mantine-datatable';
import { Badge, Button, MantineColor, showNotification } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { ErrorAlert } from '@/components';
import { useEffect, useMemo, useState } from 'react';
import { patch_api } from '@/hooks/Conexion';
import mensajes from '@/components/Notification/Mensajes';
import { get } from '@/hooks/SessionUtil';

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
  grupo: GrupoResponse;
};
type GrupoResponse  = {
  id: number,
  external_id: string,
  nombre: string,
  descripcion: string,
  idPeriodoAcademico: number,
}

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
  const [users, setUsers] = useState<User[]>(data);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    setUsers(data);
  }, [data]);

  const handleToggle = async (userId: string, rol: string) => {
    const user = users.find((u) => u.cuenta.external_id === userId);
    if (!user) return;

    const grupoId = user.grupoId;

    // Verifica si ya hay un LIDER en este grupo
    if (rol === 'ANALISTA') {
      const liderExistente = users.find(
        (u) =>
          u.grupoId === grupoId &&
          u.cuenta.Rol.tipo === 'LIDER' &&
          u.cuenta.external_id !== userId
      );

      if (liderExistente) {
        mensajes('Error al modificar', "Solo puede haber un líder", 'error');
        return;
      }
    }

    setUpdatingUserId(userId);

    const newRol = rol === 'ANALISTA' ? 'LIDER' : 'ANALISTA';
    const json = { rolType: newRol };

    await patch_api(`cuenta/cambiarrol/${userId}`, json);

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

  const GrupoBadge = ({ grupo }: { grupo?: GrupoResponse }) => {
    const color: MantineColor = grupo?.id
      ? grupoColorMap.get(grupo.id) || 'blue'
      : 'gray';
    // const label = grupoId ? `Grupo ${grupoId}` : 'Sin grupo';
    // alert(grupo);
    const label = grupo?.nombre ? `${grupo?.nombre}` : 'Sin grupo';

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
      accessor: 'grupo',
      title: 'Nombre del grupo',
      render: (user) => <GrupoBadge grupo={user.grupo} />,
    },
    {
      accessor: 'cuenta.Rol.tipo',
      title: 'Rol',
      render: (user) => {
        const rol = user.cuenta.Rol.tipo;
        if (!data) return null;
        if (rol === 'DOCENTE' || rol === 'OBSERVADOR') return null;

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
      },
    },
  ];

  if (error) {
    return <ErrorAlert title="Error al cargar usuarios" message={error.toString()} />;
  }

  return (
    <DataTable
      columns={columns}
      records={users}
      fetching={loading}
      striped
      highlightOnHover
    />
  );
};

export default UsersTable;

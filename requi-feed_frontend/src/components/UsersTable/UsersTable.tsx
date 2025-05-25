'use client';

import {
  DataTable,
  DataTableProps,
} from 'mantine-datatable';
import { Badge, MantineColor } from '@mantine/core';
import { User } from '@/types';
import { ErrorAlert } from '@/components';
import { useMemo } from 'react';

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
    { accessor: 'cuenta.Rol.tipo', title: 'Rol' },
  ];

  if (error) {
    return <ErrorAlert title="Error al cargar usuarios" message={error.toString()} />;
  }

  return (
    <DataTable
      columns={columns}
      records={data}
      fetching={loading}
      striped
      highlightOnHover
    />
  );
};

export default UsersTable;

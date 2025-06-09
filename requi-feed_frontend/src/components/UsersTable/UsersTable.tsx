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

type Cuenta = {
  Rol: Rol;
  contrasenia: string;
  email: string;
  estado: string;
  external_id: string;
  fechaCreacion: string; // ISO date string
  id: number;
  rolId: number;
};

type Grupo = {
  id: number;
  nombre: string;
  descripcion: string;
  external_id: string;
  idPeriodoAcademico: number;
};

type User = {
  id: number;
  nombre: string;
  apellido: string;
  ocupacion: string;
  area: string;
  cuentaId: number;
  grupoId?: number;
  grupo?: Grupo;
  cuenta: Cuenta;
  foto: string | null;
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
    }, [data]);
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

  type EstadoCuenta = 'ACTIVA' | 'BLOQUEADA' | 'INACTIVA';

  const estadoSiguiente: Record<EstadoCuenta, EstadoCuenta | null> = {
    ACTIVA: 'BLOQUEADA',
    BLOQUEADA: 'INACTIVA',
    INACTIVA: 'ACTIVA',
    // ELIMINADA: 'ELIMINADA',
  };
  const handleToggleState = async (userId: string, estadoActual: EstadoCuenta, email: string) => {
    setUpdatingUserId(userId);

    const newState:any = estadoSiguiente[estadoActual];
    if (!newState) {
      console.warn('No se puede cambiar el estado desde:', estadoActual);
      setUpdatingUserId(null);
      return;
    }

    const payload = { email, estado: newState };

    try {
      await patch_api(`cuenta/${userId}`, payload);
      // Actualiza el estado local del usuario
      setUsers((prev) =>
        prev.map((user) =>
          user.cuenta.external_id === userId
            ? {
                ...user,
                cuenta: {
                  ...user.cuenta,
                  estado: newState,
                },
              }
            : user
        )
      );
    } catch (error) {
      console.error('Error actualizando estado:', error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const grupoColorMap = useMemo(() => getGrupoColorMap(users), [users]);

  const GrupoBadge = ({ grupo }: { grupo?: Grupo }) => {
    const color: MantineColor = grupo
      ? grupoColorMap.get(grupo.id) || 'blue'
      : 'gray';
    // const label = grupoId ? `Grupo ${grupoId}` : 'Sin grupo';
    const label = grupo ? `${grupo.nombre}` : 'Sin grupo';

    return (
      <Badge color={color} variant="light" radius="sm">
        {label}
      </Badge>
    );
  };

  const estadoColores: Record<EstadoCuenta, string> = {
    ACTIVA: 'green',
    BLOQUEADA: 'yellow',
    INACTIVA: 'gray',
    // ELIMINADA: 'red',
  };
  const isEstadoCuenta = (val: string): val is EstadoCuenta => {
    return ['ACTIVA', 'BLOQUEADA', 'INACTIVA', 'ELIMINADA'].includes(val);
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
      title: 'Grupo',
      render: (user) => <GrupoBadge grupo={user.grupo} />,
    },
    {
      accessor: 'cuenta.estado',
      title: 'Estado',
      render: (user) => {
        if (!data) return null;

        const estadoRaw: string  =user.cuenta.estado;
        if (!isEstadoCuenta(estadoRaw)) {
          console.warn("Estado inválido recibido:", estadoRaw);
          return null; // o fallback a un estado por defecto
        }
        const estado: EstadoCuenta = estadoRaw; // Ahora TypeScript sabe que es válido
        const siguiente = estadoSiguiente[estado];
        const color = estadoColores[estado];

        return (
          <Button
            size="xs"
            color={color}
            disabled={!siguiente}
            loading={updatingUserId === user.cuenta.external_id}
            onClick={() =>
              handleToggleState(user.cuenta.external_id, estado, user.cuenta.email)
            }
          >
            {estado}
          </Button>
        );
      },
    },
    { accessor: 'cuenta.Rol.tipo',
      title: 'Rol',
      render: (user) => {
        const rol = user.cuenta.Rol.tipo;
        if (!data) return null;
        // Solo muestra el botón si el rol es ANALISTA u OBSERVADOR
        if (rol !== 'ANALISTA' && rol !== 'OBSERVADOR') {
          return rol; // No se renderiza nada
        }

        return (
          <Button
            size="xs"
            color={rol === 'OBSERVADOR' ? 'gray' : 'orange'}
            loading={updatingUserId === user.cuenta.external_id}
            onClick={() => handleToggle(user.cuenta.external_id, rol)}
          >
            {rol === 'OBSERVADOR' ? 'OBSERVADOR' : 'ANALISTA'}
          </Button>
        );
      }
    },
    // {
    //   accessor: 'observador',
    //   title: 'Observador',
    //   render: (user) => {
    //     const rol = user.cuenta.Rol.tipo;
    //     if (!data) return null;
    //     // Solo muestra el botón si el rol es ANALISTA u OBSERVADOR
    //     if (rol !== 'ANALISTA' && rol !== 'OBSERVADOR') {
    //       return null; // No se renderiza nada
    //     }

    //     return (
    //       <Button
    //         size="xs"
    //         color={rol === 'OBSERVADOR' ? 'gray' : 'green'}
    //         loading={updatingUserId === user.cuenta.external_id}
    //         onClick={() => handleToggle(user.cuenta.external_id, rol)}
    //       >
    //         {rol === 'OBSERVADOR' ? 'Sí' : 'No'}
    //       </Button>
    //     );
    //   }
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

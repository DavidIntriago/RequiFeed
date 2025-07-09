import { DataTable } from 'mantine-datatable';
import { Badge, MantineColor } from '@mantine/core';
import { ReactNode } from 'react';
import { ErrorAlert } from '@/components';

type Status = 'En Progreso' | 'Cancelled' | 'Completed' | 'Pending' | string;

const StatusBadge = ({ status }: { status: Status }) => {
  let color: MantineColor = '';

  switch (status) {
    case 'En Progreso':
      color = 'blue';
      break;
    case 'Cancelled':
      color = 'red';
      break;
    case 'Completed':
      color = 'green';
      break;
    case 'Pending':
      color = 'orange';
      break;
    default:
      color = 'gray';
  }

  return (
    <Badge color={color} variant="filled" radius="sm">
      {status}
    </Badge>
  );
};

type ProjectItem = {
  id: string;
  nombre: string;
  fechaCreacion: string;
  proximaRevision: string;
  estado: Status;
  integrantes: string;
};

type ProjectsTableProps = {
  data?: ProjectItem[];
  error: ReactNode;
  loading: boolean;
};
const ProjectsTable = ({ data, error, loading }: ProjectsTableProps) => {
  return error ? (
    <ErrorAlert title="Aun no hay ningun proyecto Activo" message={error.toString()} />
  ) : (
    <DataTable
      verticalSpacing="sm"
      highlightOnHover
      columns={[
        { accessor: 'nombre' },
        { accessor: 'fechaCreacion' },
        { accessor: 'proximaRevision' },
        {
          accessor: 'estado',
          render: ({ estado }) => <StatusBadge status={estado} />,
        },
        { accessor: 'integrantes' },
      ]}
      records={data}
      fetching={loading}
    />
  );
};

export default ProjectsTable;

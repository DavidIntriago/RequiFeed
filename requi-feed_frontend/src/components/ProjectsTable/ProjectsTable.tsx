import { DataTable } from 'mantine-datatable';
import { Badge, MantineColor } from '@mantine/core';
import { ReactNode } from 'react';
import { ErrorAlert } from '@/components';
import AvanceProyecto from '../AvanceProyecto/AvanceProyecto';

type Status = 'In Progress' | 'Cancelled' | 'Completed' | 'Pending' | string;

type ProjectItem = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  requisitos: { estado: string }[]; // agrega requisitos aquí
  assignee: string;
};

type ProjectsTableProps = {
  data?: ProjectItem[];
  error: ReactNode;
  loading: boolean;
};

const ProjectsTable = ({ data, error, loading }: ProjectsTableProps) => {
  return error ? (
    <ErrorAlert title="Error loading projects" message={error.toString()} />
  ) : (
    <DataTable
      verticalSpacing="sm"
      highlightOnHover
      columns={[
        { accessor: 'name' },
        { accessor: 'start_date' },
        { accessor: 'end_date' },
        {
          accessor: 'avance',
          title: 'Avance',
          render: ({ requisitos }) => (
            <AvanceProyecto requisitos={requisitos} />
          ),
        },
        { accessor: 'assignee' },
      ]}
      records={data}
      fetching={loading}
    />
  );
};

export default ProjectsTable;

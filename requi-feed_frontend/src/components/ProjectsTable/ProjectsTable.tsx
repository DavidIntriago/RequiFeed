import { DataTable } from 'mantine-datatable';
import { Badge, MantineColor } from '@mantine/core';
import { ReactNode } from 'react';
import { ErrorAlert } from '@/components';
import AvanceProyecto from '../AvanceProyecto/AvanceProyecto';


type ProjectItem = {
  id: string;
  nombre: string;
  fechaCreacion: string;
  ultimaRevision: string;
  requisitos: { estado: string }[]; 
  numeroRequisitos?: number;
  grupo: string;
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
        { accessor: 'nombre' },
        { accessor: 'fechaCreacion' },
        { accessor: 'ultimaRevision' },
        {
          accessor: 'avance',
          title: 'Avance',
          render: ({ requisitos }) => (
            <AvanceProyecto requisitos={requisitos} />
          ),
        },
        { accessor: 'grupo' },

      ]}
      records={data}
      fetching={loading}
    />
  );
};

export default ProjectsTable;

'use client'

import {
  Button,
  Container,
  Group,
  Paper,
  PaperProps,
  Stack,
  Text,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { get_api } from '@/hooks/Conexion';
import PageHeader from '@/components/PageHeader/PageHeader';
import StatsGrid from '@/components/StatsGrid/StatsGrid';
import ProjectsTable from '@/components/ProjectsTable/ProjectsTable';
import { PATH_DOCENTE } from '@/routes';
import { useRouter } from 'next/navigation';

const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
  style: { height: '100%' },
};

function DashboardPage() {
  const router = useRouter();

  const [grupos, setGrupos] = useState([]);
  const [loadingGrupos, setLoadingGrupos] = useState(true);
  const [errorGrupos, setErrorGrupos] = useState(null);

  const [projectsData, setProjectsData] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [errorProjects, setErrorProjects] = useState(null);

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const data = await get_api('grupo');
        console.log('Grupos obtenidos:', data);
        setGrupos(data.data || []);
      } catch (err) {
        setErrorGrupos(err);
      } finally {
        setLoadingGrupos(false);
      }
    };

    const fetchProjects = async () => {
      try {
        const res = await get_api('proyecto/status/active');
        console.log('Proyectos activos obtenidos:', res.data);
        const data = res.data;

        const formattedProjects = data.map((proyecto) => ({
          id: proyecto.external_id,
          name: proyecto.nombre,
          start_date: new Date(proyecto.fechaCreacion).toLocaleDateString('es-EC'),
          end_date: proyecto.fechaLimite?.[0]
            ? new Date(proyecto.fechaLimite[0].fechaLimite).toLocaleDateString('es-EC')
            : 'Sin fecha límite',
          requisitos: proyecto.requisitos || [], // <<-- importante para AvanceProyecto
          assignee: proyecto.grupo?.nombre || 'Sin grupo',
        }));

        console.log('Proyectos formateados:', formattedProjects);
        setProjectsData(formattedProjects);
      } catch (err) {
        setErrorProjects(err);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchGrupos();
    fetchProjects();
  }, []);

  return (
    <>
      <title>RequiFeed | Dashboard</title>
      <meta name="description" content="Panel principal de RequiFeed" />

      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="RequiFeed" withActions={true} />

          <StatsGrid
            data={grupos}
            loading={loadingGrupos}
            error={errorGrupos}
          />

          <Paper {...PAPER_PROPS}>
            <Group justify="space-between" mb="md">
              <Text size="lg" fw={600}>
                Proyectos
              </Text>
              <Button
                variant="subtle"
                rightSection={<IconChevronRight size={16} />}
                onClick={() => router.push(PATH_DOCENTE.proyectos)}
              >
                Ver todos
              </Button>
            </Group>

            <ProjectsTable
              data={projectsData}
              loading={loadingProjects}
              error={errorProjects}
            />
          </Paper>
        </Stack>
      </Container>
    </>
  );
}

export default DashboardPage;

'use client';

import {
  Anchor,
  Button,
  CardProps,
  Container,
  SimpleGrid,
  Skeleton,
  Stack,
} from '@mantine/core';
import { PATH_DASHBOARD, PATH_ESTUDIANTE } from '@/routes';
import { ErrorAlert, PageHeader } from '@/components';
import { useFetchData } from '@/hooks';
import { get_api } from '@/hooks/Conexion';
import { useEffect, useState } from 'react';
import mensajes from '@/components/Notification/Mensajes';
import { IconPlus } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { get } from '@/hooks/SessionUtil';
import ProjectsCard from '@/components/ProjectsCard/Estudiante/ProjectsCard';

const items = [
  { title: 'Dashboard', href: PATH_ESTUDIANTE.default },
  { title: 'Grupo', href: PATH_ESTUDIANTE.grupo},
  { title: 'Proyectos', href: '#'}
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

interface User {
  id: number;
  nombre: string;
  apellido: string;
  ocupacion: string;
  area: string;
  foto: string;
  grupoId: number;
  cuentaId: number;
 }

interface Project {
    id: number;
    external_id: string;
    nombre: string;
    descripcion: string;
    fechaCreacion: string;
    estado: string;
    grupoId: number;
    calificacionId: number;
  }

const CARD_PROPS: Omit<CardProps, 'children'> = {
  p: 'lg',
  shadow: 'ls',
  radius: 'ls',
};

function Projects() {

  const router = useRouter();
  
  const {
    loading: projectsLoading,
    error: projectsError,
  } = useFetchData('/mocks/Projects2.json');

  const [projects, setProjects] = useState<Project[] | null>(null);

  const { id } = useParams();
  const rol = get('rol');
  
  const getProjects = async () => {
    try {
      const {data} = await get_api(`proyecto/grupo/${id}`);
      setProjects(data);
    } catch (error:any) {
      mensajes("Error", error.response?.data?.customMessage || "No se ha podido obtener el usuario", "error");
    }
  }
  useEffect(() => {
    getProjects();
  }, []);
  
  const handleDeleteProject = () => {
    getProjects();
  };

  
  const projectItems = projects?.map((p: any) => (
    <ProjectsCard key={p.id} {...p} {...CARD_PROPS} onDelete={handleDeleteProject} />
  ));

  return (
    <>
      <>
        <title>Proyectos Requifeed</title>
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Projects" breadcrumbItems={items} />
          {rol == 'LIDER' ? (
            <Button
            mx="xs"
            radius="sm"
            variant="gradient"
            leftSection={<IconPlus size="18" />}
            onClick={() => {
              router.push(`/estudiante/grupo/proyectos/create/${id}`);
              // createTask(column.id);
            }}
          >
            Crear Proyecto
          </Button>
          ) : <></> }
          
          {projectsError ? (
            <ErrorAlert
              title="Error loading projects"
              message={projectsError.toString()}
            />
          ) : (
            <SimpleGrid
              cols={{ base: 1, sm: 2, lg: 3, xl: 2 }}
              spacing={{ base: 10, sm: 'xl' }}
              verticalSpacing={{ base: 'lg', sm: 'xl' }}
            >
              {projectsLoading
                ? Array.from({ length: 8 }).map((o, i) => (
                    <Skeleton
                      key={`project-loading-${i}`}
                      visible={true}
                      height={300}
                    />
                  ))
                : projectItems}
            </SimpleGrid>
          )}
        </Stack>
      </Container>
    </>
  );
}

export default Projects;

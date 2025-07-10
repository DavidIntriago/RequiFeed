'use client';

import {
  Anchor,
  Button,
  CardProps,
  Container,
  Group,
  Modal,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import { PATH_DASHBOARD, PATH_DOCENTE } from '@/routes';
import { ErrorAlert, PageHeader } from '@/components';
import { useFetchData } from '@/hooks';
import { get } from '@/hooks/SessionUtil';
import { get_api, post_api } from '@/hooks/Conexion';
import { useEffect, useState } from 'react';
import mensajes from '@/components/Notification/Mensajes';
import { IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import ProjectsCard from '@/components/ProjectsCard/Docente/ProjectsCard';
import { DatePickerInput } from '@mantine/dates';
import React from 'react';


const items = [
  { title: 'Dashboard', href: PATH_DOCENTE.default },
  { title: 'Proyectos', href: '#' },
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
  grupo: {
    id: number,
    external_id: string,
    nombre: string,
    descripcion: string,
    idPeriodoAcademico: number,
    usuarios: User[]
  }
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
  const activeProjectsCount = projects?.length || 0;
  const [openedFechas, setOpenedFechas] = useState(false);
  const [tipoFecha, setTipoFecha] = useState<string | null>('INTERNA');
  const [fecha, setFecha] = useState<Date | null>(null);
  const [periodoFiltro, setPeriodoFiltro] = useState<string | null>(null);
  const [modalidadFiltro, setModalidadFiltro] = useState<string | null>(null);
  const [estadoFiltro, setEstadoFiltro] = useState<string | null>(null);
  const [opcionesFiltradas, setOpcionesFiltradas] = useState<string[]>([]);
  const [periodos, setPeriodos] = useState([]); // Datos para el Select
  const [filtrosAplicados, setFiltrosAplicados] = useState(false);


  const handleGuardarFechaMasiva = async () => {
    if (!fecha || !tipoFecha || !projects) return;

    try {
      await Promise.all(projects.map(async (project) => {
        const payload = {
          proyectoId: project.id,
          tipoRevision: tipoFecha,
          fechaLimite: fecha.toISOString(),
        };

        try {
          await post_api(`proyecto/revision`, payload);
        } catch (err) {
          console.error(`Error en proyecto ${project.nombre}`, err);
        }
      }));

      mensajes('Éxito', 'Fechas registradas en todos los proyectos', 'success');
      setOpenedFechas(false);
      getProjects();
    } catch (error) {
      mensajes('Error', 'No se pudieron establecer las fechas', 'error');
    }
  };

  const getProjects = async () => {
    try {
      const { data } = await get_api(`proyecto`);
      console.log(data);
      // alert(data);
      setProjects(data);
    } catch (error: any) {
      mensajes("Error", error.response?.data?.customMessage || "No se ha podido obtener los proyectos", "error");
    }
  }

  useEffect(() => {
    getProjects();
    getPeriodos();
  }, []);


  const getPeriodos = async () => {
    try {
      const { data } = await get_api(`periodoacademico`);
      console.log(data);
      const opciones = data.map((periodo: any) => ({
          value: periodo.id.toString(), // o periodo.nombre si prefieres usarlo como value
          label: periodo.nombre,
        }));
      // alert(data);
      setPeriodos(opciones);
    } catch (error: any) {
      mensajes("Error", error.response?.data?.customMessage || "No se ha podido obtener los periodos", "error");
    }
  }

  const handleDeleteProject = () => {
    getProjects();
  };


  const projectItems = projects?.map((p: any) => (
    <ProjectsCard key={p.id} {...p} {...CARD_PROPS} onDelete={handleDeleteProject} periodoFiltro={periodoFiltro} modalidadFiltro={modalidadFiltro} filtrosAplicados={filtrosAplicados} />
  ));

// Limpiar filtro
  const limpiarFiltro = async () => {
    setPeriodoFiltro(null);
    setModalidadFiltro(null);
    setEstadoFiltro(null);
    setFiltrosAplicados(true);
    await getProjects(); // vuelve a cargar todos
    setFiltrosAplicados(false);
  };

  const handleFiltro = async () => {
      setFiltrosAplicados(true);
  
      const { data } = await get_api(`proyecto`);
    
      const filtrados = data.filter((proyecto: any) => {
        if (estadoFiltro) return proyecto.estado === estadoFiltro;
          return true;
        }
      );
  
      setProjects(filtrados);
      setFiltrosAplicados(false);

    };

  return (
    <>
      <>
        <title>Projects | DesignSparx</title>
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Proyectos" breadcrumbItems={items} />
          <Stack justify="space-between" align="center" px="md">
            <h2 style={{ margin: 0 }}>Cantidad de proyectos: {activeProjectsCount}</h2>
            <Button
              variant="outline"
              color="blue"
              onClick={() => setOpenedFechas(true)}
            >
              Establecer fechas de revisión
            </Button>
          </Stack>
          <Group mb={15}>
        <Text> Filtrar búsqueda </Text>
        <Select
          label="Periodo"
          data={periodos}
          placeholder="Selecciona el periodo"
          value={periodoFiltro}
          onChange={setPeriodoFiltro}
        />

        <Select
          label="Modalidad"
          data={['Presencial', 'Virtual', 'Híbrida']}
          placeholder={
            periodoFiltro ? `Selecciona una opción de ${periodoFiltro.toLowerCase()}` : 'Primero elige el periodo'
          }
          value={modalidadFiltro}
          onChange={setModalidadFiltro}
        />

        <Select
          label="Estado"
          data={['ACTIVO', 'FINALIZADO']}
          placeholder="Selecciona el estado de los proyecto"
          value={estadoFiltro}
          onChange={setEstadoFiltro}
        />
        <Button style={{ marginTop: "25px" }} onClick={handleFiltro} color="blue" variant="outline">
          Filtrar
        </Button>
        <Button style={{ marginTop: "25px" }} onClick={limpiarFiltro} color="red" variant="outline">
          Limpiar filtros
        </Button>
      </Group>
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
      <Modal
        opened={openedFechas}
        onClose={() => setOpenedFechas(false)}
        title="Establecer fechas para todos los proyectos"
      >
        <Stack>
          <Select
            label="Tipo de revisión"
            data={['INTERNA', 'EXTERNA']}
            value={tipoFecha}
            onChange={setTipoFecha}
          />
          <DatePickerInput
            label="Fecha límite"
            value={fecha}
            onChange={setFecha}
            locale="es"
            required
            clearable={false}
          />
          <Button fullWidth color="blue" onClick={handleGuardarFechaMasiva}>
            Guardar para todos
          </Button>
        </Stack>
      </Modal>

    </>
  );
}

export default Projects;

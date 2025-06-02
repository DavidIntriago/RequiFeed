'use client';

import {
  Badge,
  Button,
  Card,
  Collapse,
  Container,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDisclosure, useDebouncedValue } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { IconPlus, IconSearch, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { get_api, post_api } from '@/hooks/Conexion';
import ModalCrearGrupo from '@/components/ModalCrearGrupo/ModalCrearGrupo';
import { useRouter } from 'next/navigation';
import { get } from '@/hooks/SessionUtil';

type Grupo = {
  id: number;
  external_id: string;
  nombre: string;
  usuarios: any[];
  periodoAcademico: {
    id: number;
    nombre: string;
    fechaInicio: Date;
    fechaFin: Date;
    modalidad: string;
  }
};

const Page = () => {
  const external_id = get('external_id');
  
  const [grupo, setGrupo] = useState<Grupo>();
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [verAntiguos, { toggle: toggleAntiguos }] = useDisclosure(false);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<Grupo | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [debouncedBusqueda] = useDebouncedValue(busqueda, 300);
  const router = useRouter();
  const form = useForm({
    initialValues: { nombre: '' },
    validate: {
      nombre: (value) =>
        value.trim().length < 3 ? 'El nombre del grupo es muy corto' : null,
    },
  });

  const fetchGrupo = async () => {
    setLoading(true);
    try {
      const {data} = await get_api(`grupo/user/${external_id}`);
      console.log(data.grupo)
      setGrupo(data.grupo);
    } catch (error) {
      console.error('Error al obtener el grupo:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchGrupo();
  }, []);

  return (
    <Container size="md" mt="xl">
      <Group justify="space-between" mb="md">
        <Title order={2}>Grupos actual</Title>

      </Group>

      {/* Campo de búsqueda */}
      <TextInput
        placeholder="Buscar por nombre o periodo académico"
        icon={<IconSearch size={16} />}
        value={busqueda}
        onChange={(e) => setBusqueda(e.currentTarget.value)}
        mb="lg"
      />

      {/* Grupos actuales */}
      <Stack>
        {loading ? (
          <Text>Cargando grupos...</Text>
        ) : grupo == undefined ? (
          <Text color="dimmed">No hay grupos actuales asignados.</Text>
        ) : (
            <Card key={grupo.id} withBorder shadow="sm" padding="md">
              <Group justify="space-between">
                <Stack gap={2}>
                  <Text
                    fw={500}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => {
                      setGrupoSeleccionado(grupo);
                      setModalAbierto(true);
                    }}
                  >
                    {grupo.nombre}
                  </Text>

                  <Text size="sm" color="dimmed">
                    Periodo: {grupo.periodoAcademico.nombre}
                  </Text>
                  <Button fw={500} onClick={() => router.push(`/estudiante/grupo/proyectos/${grupo.external_id}`)}>
                    Ver Proyectos
                  </Button>

                </Stack>
                {/* <Badge color="green" variant="light">
                  {grupo.usuarios.length} usuarios
                </Badge> */}
              </Group>
            </Card>
        )}
      </Stack>

      {/* Grupos antiguos */}
      <Group mt="xl" mb="sm" justify="space-between">
        <Title order={3}>Grupos antiguos</Title>
        <Button
          variant="light"
          onClick={toggleAntiguos}
          leftSection={verAntiguos ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
        >
          {verAntiguos ? 'Ocultar' : 'Mostrar'}
        </Button>
      </Group>
{/* 
      <Collapse in={verAntiguos}>
        <Stack>
          {gruposAntiguos.length === 0 ? (
            <Text color="dimmed">No hay grupos antiguos.</Text>
          ) : (
            gruposAntiguos.map((grupo) => (
              <Card key={grupo.id} withBorder shadow="sm" padding="md">
                <Group justify="space-between">
                  <Stack gap={2}>
                    <Text
                      fw={500}
                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={() => {
                        setGrupoSeleccionado(grupo);
                        setModalAbierto(true);
                      }}
                    >
                      {grupo.nombre}
                    </Text>
                    <Text size="sm" color="dimmed">
                      Periodo: {grupo.periodoAcademico.nombre}
                    </Text>
                  </Stack>
                  <Badge color="gray" variant="light">
                    Sin usuarios
                  </Badge>
                </Group>
              </Card>
            ))
          )}
        </Stack>
      </Collapse> */}

      {/* <ModalCrearGrupo opened={modalAbierto} onClose={() => setModalAbierto(false)} grupo={grupoSeleccionado} /> */}


    </Container>
  );
};

export default Page;

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

type Grupo = {
  id: number;
  nombre: string;
  usuarios: any[];
  periodoAcademico: {
    id: number;
    nombre: string;
  }
};

const Page = () => {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [verAntiguos, { toggle: toggleAntiguos }] = useDisclosure(false);

  const [busqueda, setBusqueda] = useState('');
  const [debouncedBusqueda] = useDebouncedValue(busqueda, 300);

  const form = useForm({
    initialValues: { nombre: '' },
    validate: {
      nombre: (value) =>
        value.trim().length < 3 ? 'El nombre del grupo es muy corto' : null,
    },
  });

  const fetchGrupos = async () => {
    setLoading(true);
    try {
      const res: Grupo[] = await get_api('grupo/users');
      setGrupos(res.data);
      console.log('Response:', res);    
    } catch (error) {
      console.error('Error al obtener los grupos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await post_api('grupo', values);
      await fetchGrupos();
      form.reset();
    } catch (error) {
      console.error('Error al crear grupo:', error);
    }
  };

  useEffect(() => {
    fetchGrupos();
  }, []);

  // Filtro de grupos
  console.log('Grupos:', grupos);
  const gruposFiltrados = grupos.filter((grupo) => {
    const texto = debouncedBusqueda.toLowerCase();
    return (
      grupo.nombre?.toLowerCase().includes(texto) ||
      grupo.periodoAcademico.nombre.toLowerCase().includes(texto)
    );
  });

  const gruposActuales = gruposFiltrados.filter((g) => g.usuarios.length > 0);
  const gruposAntiguos = gruposFiltrados.filter((g) => g.usuarios.length === 0);

  return (
    <Container size="md" mt="xl">
      <Group justify="space-between" mb="md">
        <Title order={2}>Grupos actuales</Title>
        <Button
          leftSection={<IconPlus size={18} />}
          color="indigo"
          radius="md"
          onClick={() => setModalAbierto(true)}
        >
          Agregar grupo
        </Button>
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
        ) : gruposActuales.length === 0 ? (
          <Text color="dimmed">No hay grupos actuales asignados.</Text>
        ) : (
          gruposActuales.map((grupo) => (
            <Card key={grupo.id} withBorder shadow="sm" padding="md">
              <Group justify="space-between">
                <Stack gap={2}>
                  <Text fw={500}>{grupo.nombre}</Text>
                  <Text size="sm" color="dimmed">
                    Periodo: {grupo.periodoAcademico.nombre}
                  </Text>
                </Stack>
                <Badge color="green" variant="light">
                  {grupo.usuarios.length} usuarios
                </Badge>
              </Group>
            </Card>
          ))
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

      <Collapse in={verAntiguos}>
        <Stack>
          {gruposAntiguos.length === 0 ? (
            <Text color="dimmed">No hay grupos antiguos.</Text>
          ) : (
            gruposAntiguos.map((grupo) => (
              <Card key={grupo.id} withBorder shadow="sm" padding="md">
                <Group justify="space-between">
                  <Stack gap={2}>
                    <Text fw={500}>{grupo.nombre}</Text>
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
      </Collapse>

     <ModalCrearGrupo opened={modalAbierto} onClose={() => setModalAbierto(false)} />


    </Container>
  );
};

export default Page;

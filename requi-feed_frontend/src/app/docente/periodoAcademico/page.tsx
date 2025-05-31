'use client';

import { get_api, patch_api, post_api } from '@/hooks/Conexion';
import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  Modal,
  Select,
  Stack,
  Title,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import mensajes from '@/components/Notification/Mensajes';

const Page = () => {
  const [periodos, setPeriodos] = useState([]);
  const [periodoActual, setPeriodoActual] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [formData, setFormData] = useState(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => `${currentYear + i}`);

  const form = useForm({
    initialValues: {
      nombre: '',
      anio: '',
      semestre: '',
      modalidad: '',
    },
    validate: {
      nombre: (value) =>
        value.trim().length < 3
        ? 'El nombre debe tener al menos 3 caracteres'
        : /[^a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ-]/.test(value)
        ? 'El nombre contiene caracteres no permitidos'
        : null,
      
      anio: (value) =>
        /^\d{4}$/.test(value) ? null : 'Seleccione un año válido',
      semestre: (value) =>
        ['A', 'B'].includes(value) ? null : 'Seleccione un semestre',
      modalidad: (value) => value ? null : 'Seleccione una modalidad',
    },
  });

  useEffect(() => {
    fetchPeriodos();
  }, []);

  const fetchPeriodos = async () => {
    try {
      const res = await get_api('periodoacademico');
      setPeriodos(res.data);

      const hoy = new Date();
      const actual = res.data.find((p: any) =>
        new Date(p.fechaInicio) <= hoy && new Date(p.fechaFin) >= hoy
      );
      setPeriodoActual(actual || null);
    } catch (err) {
      console.error('Error al obtener periodos:', err);
    }
  };

  const abrirNuevo = () => {
    setFormData(null);
    form.reset();
    open();
  };
  
  function obtenerAnioYSemestre(fechaInicio: string, fechaFin: string) {
  const fi = new Date(fechaInicio);
  const ff = new Date(fechaFin);

  const anioInicio = fi.getFullYear();
  const mesInicio = fi.getMonth(); // 0 = Enero

  // Semestre A: Marzo (2) a Agosto (7)
  // Semestre B: Octubre (9) a Marzo (2) siguiente
  let semestre: 'A' | 'B';
  let anio: number;

  if (mesInicio >= 2 && mesInicio <= 7) {
    semestre = 'A';
    anio = anioInicio;
  } else {
    semestre = 'B';
    anio = anioInicio;
  }

  return { anio: anio.toString(), semestre };
}


  const abrirEdicion = (periodo: any) => {
  const { anio, semestre } = obtenerAnioYSemestre(periodo.fechaInicio, periodo.fechaFin);
    form.setValues({
      nombre: periodo.nombre,
      anio,
      semestre,
      modalidad: periodo.modalidad,
    });
    setFormData({ ...periodo });
    open();
  };

  const handleSubmit = async (values: typeof form.values) => {
    const nombreFinal = values.nombre || `${values.anio}-${values.semestre}`;
    const anio = parseInt(values.anio);

    let fechaInicio, fechaFin;

    if (values.semestre === 'A') {
      fechaInicio = new Date(anio, 2, 1); // Marzo
      fechaFin = new Date(anio, 7, 31);   // Agosto
    } else {
      fechaInicio = new Date(anio, 9, 1);     // Octubre
      fechaFin = new Date(anio + 1, 2, 15);   // Marzo siguiente
    }

    const payload = {
      nombre: nombreFinal,
      modalidad: values.modalidad,
      fechaInicio: fechaInicio.toISOString(),
      fechaFin: fechaFin.toISOString(),
    };

    console.log('Payload a enviar:', payload);

    try {
      console.log('Enviando payload:', payload);
      if (formData?.id) {

        const res = await patch_api(`periodoacademico/${formData.id}`, payload);
        if (res.message) {
          mensajes('Error al actualizar', res.message, 'error');
          return;
        }
        mensajes('Éxito', 'Periodo actualizado correctamente');
      } else {
        const res = await post_api('periodoacademico', payload);
        if (res.message) {
          mensajes('Error al guardar', res.message, 'error');
          return;
        }
        mensajes('Éxito', 'Periodo creado correctamente');
      }

      fetchPeriodos();
      close();
      form.reset();
      setFormData(null);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <Container size="md" mt="xl">
      {/* Periodo actual */}
      <Card shadow="md" padding="xl" radius="md" withBorder mb="xl">
        <Group justify="space-between" align="center">
          <Stack gap="xs">
            <Title order={2}>Periodo Académico Actual</Title>
            {periodoActual ? (
              <Badge color="green" size="lg" variant="light">
                {periodoActual.nombre} - {periodoActual.modalidad}
              </Badge>
            ) : (
              <Badge color="red" size="lg" variant="light">
                Sin periodo activo
              </Badge>
            )}
          </Stack>
          <Button
            leftSection={<IconPlus size={18} />}
            color="teal"
            onClick={abrirNuevo}
          >
            Agregar nuevo periodo
          </Button>
        </Group>
      </Card>

      <Title order={3} mb="sm">Todos los Periodos</Title>
      <Stack>
        {periodos.map((p: any) => (
          <Card
            key={p.id}
            withBorder
            shadow="xs"
            radius="md"
            padding="md"
            onClick={() => abrirEdicion(p)}
            style={{ cursor: 'pointer' }}
          >
            <Group position="apart">
              <Text fw={600}>{p.nombre}</Text>
              <Badge color="blue" variant="light">{p.modalidad}</Badge>
            </Group>
            <Text size="sm" c="dimmed">
              {new Date(p.fechaInicio).toLocaleDateString()} — {new Date(p.fechaFin).toLocaleDateString()}
            </Text>
          </Card>
        ))}
      </Stack>

      {/* Modal Crear/Editar */}
      <Modal
        opened={opened}
        onClose={() => {
          close();
          form.reset();
          setFormData(null);
        }}
        title={formData?.id ? 'Editar periodo académico' : 'Agregar nuevo periodo académico'}
        centered
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Nombre del periodo"
              placeholder="Ej: 2025-A o Primer Semestre 2025"
              required
              {...form.getInputProps('nombre')}
            />

            <Select
              label="Año"
              data={years}
              placeholder="Selecciona el año"
              {...form.getInputProps('anio')}
              required
            />

            <Select
              label="Semestre"
              data={[
                { label: 'A (Marzo - Agosto)', value: 'A' },
                { label: 'B (Octubre - Marzo)', value: 'B' },
              ]}
              placeholder="Selecciona el semestre"
              {...form.getInputProps('semestre')}
              required
            />

            <Select
              label="Modalidad"
              data={['Presencial', 'Virtual', 'Híbrida']}
              placeholder="Selecciona la modalidad"
              {...form.getInputProps('modalidad')}
              required
            />

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={() => {
                close();
                form.reset();
                setFormData(null);
              }}>
                Cancelar
              </Button>
              <Button type="submit" color="teal">
                {formData?.id ? 'Actualizar' : 'Guardar'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
};

export default Page;

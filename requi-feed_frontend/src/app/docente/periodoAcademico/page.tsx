'use client';

import { get_api, post_api } from '@/hooks/Conexion';
import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  Modal,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';

const Page = () => {
  const [periodoActual, setPeriodoActual] = useState('');
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      nombre: '',
      anio: '',
    },
    validate: {
      nombre: (value) =>
        value.length < 3 ? 'El nombre debe tener al menos 3 caracteres' : null,
      anio: (value) =>
        /^\d{4}$/.test(value) ? null : 'Ingrese un año válido de 4 dígitos',
    },
  });

  const fetchPeriodoActual = async () => {
    try {
      const res = await get_api('periodoacademico/actual');
      console.log('Response:', res);
      setPeriodoActual(res?.PeriodoAcademico ?? 'Sin periodo');
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchPeriodoActual();
  }, []);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const res = await post_api('periodoacademico', values);
      console.log('Nuevo periodo creado:', res);
      fetchPeriodoActual(); // refrescar el periodo actual
      close();
      form.reset();
    } catch (err) {
      console.error('Error al crear periodo:', err);
    }
  };

  return (
    <Container size="md" mt="xl">
      <Card shadow="md" padding="xl" radius="md" withBorder>
        <Group justify="space-between" align="center">
          <Stack gap="xs">
            <Title order={2} fw={700}>
              Periodo Académico Actual
            </Title>
            <Badge color="blue" size="lg" variant="light">
              {periodoActual}
            </Badge>
          </Stack>

          <Button
            leftSection={<IconPlus size={18} />}
            color="teal"
            radius="md"
            onClick={open}
          >
            Agregar nuevo periodo
          </Button>
        </Group>
      </Card>

      {/* Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title="Agregar nuevo periodo académico"
        centered
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Nombre del periodo"
              placeholder="Ej: 2025-A"
              {...form.getInputProps('nombre')}
              required
            />
            <TextInput
              label="Año"
              placeholder="Ej: 2025"
              {...form.getInputProps('anio')}
              required
            />
            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={close}>
                Cancelar
              </Button>
              <Button type="submit" color="teal">
                Guardar
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
};

export default Page;

'use client';

import { get_api } from '@/hooks/Conexion';
import { Card, Container, Group, Stack, Text, Title, Button, Badge } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

const Page = () => {
  const [periodoActual, setPeriodoActual] = useState("");

  const fetchPeriodoActual = async () => {
    try {
        const res = await get_api('periodoacademico/actual')
        console.log('Response:', res);    
        setPeriodoActual(res.data.PeriodoAcademico);
            console.log('Periodo Actual:', res.data.PeriodoAcademico);
        }

    
    catch (err) {
        console.error('Error fetching data:', err);
    }
    }
    useEffect(() => {
      fetchPeriodoActual();
    }, []);

  const handleAgregarNuevoPeriodo = () => {
    alert('Abrir formulario para agregar nuevo periodo');
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
            onClick={handleAgregarNuevoPeriodo}
          >
            Agregar nuevo periodo
          </Button>
        </Group>
      </Card>
    </Container>
  );
};

export default Page;

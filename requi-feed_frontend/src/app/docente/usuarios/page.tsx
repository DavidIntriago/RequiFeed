'use client';

import {
  ActionIcon,
  Container,
  Group,
  Paper,
  PaperProps,
  Stack,
  Text,
} from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';
import { get_api } from '@/hooks/Conexion';
import UsersTable from '@/components/UsersTable/UsersTable';
import { useEffect, useState } from 'react';

const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
};

function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await get_api('usuario');
        console.log('Response:', res);
        setData(res.data); 
      } catch (err:any) {
        console.error('Error fetching data:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <title>Usuarios | Dashboard</title>
      <meta name="description" content="Lista de usuarios" />

      <Container fluid>
        <Stack gap="lg">
          <Paper {...PAPER_PROPS}>
            <Group justify="space-between" mb="md">
              <Text fz="lg" fw={600}>
                Usuarios
              </Text>
              <ActionIcon>
                <IconDotsVertical size={18} />
              </ActionIcon>
            </Group>
            <UsersTable
              data={data}
              error={error}
              loading={loading}
            />
          </Paper>
        </Stack>
      </Container>
    </>
  );
}

export default Page;

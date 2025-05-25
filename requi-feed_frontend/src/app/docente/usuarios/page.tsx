'use client';

import {
  ActionIcon,
  Anchor,
  Container,
  Group,
  Paper,
  PaperProps,
  Stack,
  Text,
} from '@mantine/core';
import { PATH_ESTUDIANTE } from '@/routes';
import { OrdersTable, PageHeader } from '@/components';
import { IconDotsVertical } from '@tabler/icons-react';
import { useFetchData } from '@/hooks';
import { useEffect } from 'react';
import { get_api } from '@/hooks/Conexion';

const items = [
  { title: 'Dashboard', href: PATH_ESTUDIANTE.default },
  { title: 'Usuarios', href: '' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
};

function Page() {
  const {
    data: ordersData,
    loading: ordersLoading,
    error: ordersError,
  } = useFetchData('/mocks/Orders.json');

  const getUsuarios = async () => {
    try {
      const { data } = await get_api(`cuenta`);
      const userProfile = transformToUserProfile(data);

      setProfile(userProfile);
    }catch (error : any) {
      mensajes("Error", error.response?.data?.customMessage || "No se ha podido obtener la información del docente", "error");
      // alert("EROROROROORORORO");
    }
  }

  useEffect(() => {
    // if (token) {
      getUsuarios();
    // }
  // }, [token, skip, limit]);
  }, []);
  return (
    <>
      <>
        <title>Usuarios | DesignSparx</title>
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Usuarios" breadcrumbItems={items} />
          <Paper {...PAPER_PROPS}>
            <Group justify="space-between" mb="md">
              <Text fz="lg" fw={600}>
                Usuarios
              </Text>
              <ActionIcon>
                <IconDotsVertical size={18} />
              </ActionIcon>
            </Group>
            <OrdersTable
              data={ordersData}
              error={ordersError}
              loading={ordersLoading}
            />
          </Paper>
        </Stack>
      </Container>
    </>
  );
}

export default Page;

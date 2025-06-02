'use client';

import {
  ActionIcon,
  Anchor,
  Badge,
  Container,
  Flex,
  Grid,
  Group,
  Paper,
  PaperProps,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { PATH_DOCENTE, PATH_OBSERVADOR } from '@/routes';
import {
  PageHeader,
  Surface,
  UserProfileCard,
} from '@/components';
import {
  IconBriefcase2Filled,
  IconBuildingCommunity,
} from '@tabler/icons-react';
import classes from './page.module.css';
import { useFetchData } from '@/hooks';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { get } from '@/hooks/SessionUtil';
import { get_api } from '@/hooks/Conexion';
import mensajes from '@/components/Notification/Mensajes';

const items = [
  { title: 'Dashboard', href: PATH_OBSERVADOR.default },
  { title: 'Perfil', href: PATH_OBSERVADOR.perfil },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

const ICON_SIZE = 16;

const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
  style: { height: '100%' },
};

interface UserProfile {
  nombre: string;
  apellido: string;
  foto: string;
  email: string;
  estado: string;
  ocupacion: string;
  area: string;
}

function transformToUserProfile(data: any): UserProfile {
  return {
    nombre: data.usuario?.nombre || '',
    apellido: data.usuario?.apellido || '',
    foto: data.usuario?.foto || '',
    email: data.email || '',
    estado: data.estado || '',
    ocupacion: data.usuario?.ocupacion || '',
    area: data.usuario?.area || '',
  };
}

function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  // const { getToken } = useAuth();
  // const [token, setToken] = useState(getToken);
  const router = useRouter();
  const external_id = get('external_id');
  const getProfile = async () => {
    try {
      const { data } = await get_api(`cuenta/${external_id}`);
      const userProfile = transformToUserProfile(data);

      setProfile(userProfile);
    }catch (error : any) {
      mensajes("Error", error.response?.data?.customMessage || "No se ha podido obtener la información del docente", "error");
      // alert("EROROROROORORORO");
    }
  }

  useEffect(() => {
    // if (token) {
      getProfile();
    // }
  // }, [token, skip, limit]);
  }, []);

  return (
    <>
      <>
        <title>Perfil | RequiFeed</title>
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Perfil" breadcrumbItems={items} />
          <Grid>
            <Grid.Col span={{ base: 12, md: 5, lg: 12 }}>
              <Stack>
                {profile &&  <UserProfileCard data={profile} {...PAPER_PROPS} /> }
                <Surface component={Paper} {...PAPER_PROPS}>
                  <Stack>
                    <Text size="lg" fw={600}>
                      Sobre mi
                    </Text>
                    <Group>
                      <IconBriefcase2Filled size={ICON_SIZE} />
                      <Text>Ocupación: {profile?.ocupacion}  </Text>
                    </Group>
                    <Group>
                      <IconBuildingCommunity size={ICON_SIZE} />
                      <Text>Area: {profile?.area} </Text>
                    </Group>
                  </Stack>
                </Surface>
              </Stack>
            </Grid.Col>
            {/* <Grid.Col span={{ base: 12, md: 7, lg: 8 }}>
            </Grid.Col> */}
          </Grid>
        </Stack>
      </Container>
    </>
  );
}

export default Profile;

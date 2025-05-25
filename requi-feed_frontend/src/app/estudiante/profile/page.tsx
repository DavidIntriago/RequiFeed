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
import { PATH_DASHBOARD, PATH_ESTUDIANTE } from '@/routes';
import {
  PageHeader,
  ProfileStatsCard,
  ProjectsTable,
  Surface,
  UserProfileCard,
} from '@/components';
import {
  IconBriefcase2Filled,
  IconBuildingCommunity,
  IconCoins,
  IconDotsVertical,
  IconHome,
  IconListCheck,
  IconMapPinFilled,
} from '@tabler/icons-react';
import classes from './page.module.css';
import { useFetchData } from '@/hooks';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { get } from '@/hooks/SessionUtil';
import { get_api } from '@/hooks/Conexion';
import mensajes from '@/components/Notification/Mensajes';

const items = [
  { title: 'Dashboard', href: PATH_ESTUDIANTE.default },
  { title: 'Perfil', href: '' },
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
  const theme = useMantineTheme();
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
      mensajes("Error", error.response?.data?.customMessage || "No se ha podido obtener las suscripciones", "error");
      // alert("EROROROROORORORO");
    }
  }

  useEffect(() => {
    // if (token) {
      getProfile();
    // }
  // }, [token, skip, limit]);
  }, []);




  const {
    data: projectsData,
    loading: projectsLoading,
    error: projectsError,
  } = useFetchData('/mocks/Projects.json');
  const linkProps = {
    target: '_blank',
    className: classes.socialLink,
  };

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
            <Grid.Col span={{ base: 12, md: 7, lg: 12 }}>
              <SimpleGrid
                  cols={{ base: 1, md: 1, lg: 2 }}
                  spacing={{ base: 10, sm: 'xl' }}
                  verticalSpacing={{ base: 'md', sm: 'xl' }}
                >
                  <ProfileStatsCard
                    amount={1000000000}
                    title="Grupo asociado"
                    icon={IconCoins}
                    progressValue={45}
                    color="indigo.7"
                    asCurrency
                    {...PAPER_PROPS}
                  />
                  <ProfileStatsCard
                    amount={100000000000}
                    title="Proyectos"
                    icon={IconListCheck}
                    progressValue={72}
                    color="teal.7"
                    {...PAPER_PROPS}
                  />
                  {/* <ProfileStatsCard
                    amount={97219}
                    title="total revenue"
                    icon={IconBusinessplan}
                    progressValue={12}
                    color="lime.7"
                    asCurrency
                    {...PAPER_PROPS}
                  /> */}
                </SimpleGrid>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </>
  );
}

export default Profile;

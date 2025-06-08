'use client';

import { AppShell, Container, rem, useMantineTheme } from '@mantine/core';
import { ReactNode, useEffect, useState } from 'react';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import AppMain from '@/components/AppMain';
import Navigation from '@/components/Navigation/Docente/Navigation';
import HeaderNav from '@/components/HeaderNav';
import FooterNav from '@/components/FooterNav';
import { get } from '@/hooks/SessionUtil';
import { get_api } from '@/hooks/Conexion';
import MensajeConfirmacion from '@/components/Notification/MensajeConfirmacion';
import { useRouter } from 'next/navigation';
import { PATH_DOCENTE } from '@/routes';

type Props = {
  children: ReactNode;
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

function AppsLayout({ children }: Props) {
  const theme = useMantineTheme();
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const { push } = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const external_id = get('external_id');
        const { data } = await get_api(`cuenta/${external_id}`);
              const userProfile = transformToUserProfile(data);
          
              if (userProfile.nombre === '' || userProfile.apellido === '') {
                MensajeConfirmacion(
                  "Por favor, complete su perfil antes de continuar.",
                  "Perfil incompleto",
                  "warning",

                   
                ).then(() => {
                  push(PATH_DOCENTE.perfil); 
                });
              }
                  


              console.log('Profile data fetched:', userProfile);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchData();
  }, []);

    
  return (
    <AppShell
      layout="alt"
      header={{ height: 60 }}
      footer={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'md',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding={0}
    >
      <AppShell.Header
        style={{
          height: rem(60),
          border: 'none',
          boxShadow: tablet_match ? theme.shadows.md : theme.shadows.sm,
        }}
      >
        <Container fluid py="sm" px="lg">
          <HeaderNav
            desktopOpened={desktopOpened}
            mobileOpened={mobileOpened}
            toggleDesktop={toggleDesktop}
            toggleMobile={toggleMobile}
          />
        </Container>
      </AppShell.Header>
      <AppShell.Navbar>
        <Navigation onClose={toggleMobile} />
      </AppShell.Navbar>
      <AppShell.Main>
        <AppMain>{children}</AppMain>
      </AppShell.Main>
      <AppShell.Footer p="md">
        <Container fluid px="lg">
          <FooterNav />
        </Container>
      </AppShell.Footer>
    </AppShell>
  );
}

export default AppsLayout;

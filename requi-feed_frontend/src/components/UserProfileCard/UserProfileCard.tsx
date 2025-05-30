'use client';

import { Avatar, Button, Paper, PaperProps, Stack, Text } from '@mantine/core';
import { Surface } from '@/components';
import { IconEdit } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { get } from '@/hooks/SessionUtil';

type UserInfoActionProps = {
  data: {
    nombre: string;
    apellido: string;
    foto: string;
    email: string;
    estado: string;
    ocupacion: string,
    area: string,
  };
} & PaperProps;

const UserProfileCard = ({
  data: { nombre, apellido, foto, email, estado },
  ...others
}: UserInfoActionProps) => {
  const router = useRouter();
  const rol = get('rol');

  const external_id = get('external_id');

  const handleEditProfile = () => {
    if(rol == "DOCENTE"){
      router.push(`/docente/profile/edit/${external_id}`)
    }
    if(rol == "ANALISTA" || rol == "LIDER"){
      router.push(`/estudiante/profile/edit/${external_id}`)

    }
    if(rol == "OBSERVADOR"){
      router.push(`/observador/profile/edit/${external_id}`)
    }
  }

  return (
    <Surface component={Paper} {...others}>
      <Stack gap={4} align="center">
        <Text size="lg" fw={600} mb="md">
          Detalles del perfil
        </Text>
        <Avatar src={foto.trim() !== '' 
          ? `http://localhost:4000/subidas/${foto}`
          : 'http://localhost:4000/subidas/ProfileDefaultImage.jpg'
        } size={120} radius={120} mx="auto" mb="md" />
        <Text fz="md" fw={500} mt="md" mx="auto">
          {nombre} {apellido}
        </Text>
        <Text c="dimmed" fz="xs" component="a"  >
          {email}
        </Text>
        <Text c="dimmed" fz="xs" ta="center">
          {estado}
        </Text>

        <Button
          variant="outline"
          fullWidth
          mt="md"
          onClick={() => handleEditProfile()}
          rightSection={<IconEdit size={14} />}
        >
          Editar información
        </Button>
      </Stack>
    </Surface>
  );
};

export default UserProfileCard;

import { Avatar, Button, Paper, PaperProps, Stack, Text } from '@mantine/core';
import { Surface } from '@/components';
import { IconEdit } from '@tabler/icons-react';

type UserInfoActionProps = {
  data: {
    foto: string;
    name: string;
    lastname: string;
    email: string;
    estado: string;
    // job: string;
  };
} & PaperProps;

const UserProfileCard = ({
  data: { foto, name, lastname, email, estado },
  ...others
}: UserInfoActionProps) => {
  return (
    <Surface component={Paper} {...others}>
      <Stack gap={4} align="center">
        <Text size="lg" fw={600} mb="md">
          Detalles del perfil
        </Text>
        <Avatar src={foto} size={120} radius={120} mx="auto" mb="md" />
        <Text fz="md" fw={500} mt="md" mx="auto">
          {name} {lastname}
        </Text>
        <Text c="dimmed" fz="xs" component="a" href={`mailto:${email}`}>
          {email}
        </Text>
        <Text c="dimmed" fz="xs" ta="center">
          {estado}
        </Text>

        <Button
          variant="outline"
          fullWidth
          mt="md"
          rightSection={<IconEdit size={14} />}
        >
          Editar información
        </Button>
      </Stack>
    </Surface>
  );
};

export default UserProfileCard;

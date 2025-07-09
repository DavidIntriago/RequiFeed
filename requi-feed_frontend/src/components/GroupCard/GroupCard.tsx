'use client';

import { Card, Text, Badge, Group, Avatar, Tooltip, Stack } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';



export default function GroupCard({ grupo }) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="xs">
        <Group justify="space-between">
          <Text fw={700} fz="lg">{grupo.descripcion}</Text>
          <Badge>{grupo.nombre}</Badge>
        </Group>

        <Text size="sm" c="dimmed">{grupo.descripcion}</Text>

        <Group spacing="xs" mt="sm">
          {grupo.usuarios.map((user) => (
            <Tooltip
              key={user.id}
              label={`${user.nombre} ${user.apellido}`}
              withArrow
            >
              <Avatar color="blue" radius="xl" size="sm">
                {user.nombre[0]}
              </Avatar>
            </Tooltip>
          ))}
        </Group>
      </Stack>
    </Card>
  );
}

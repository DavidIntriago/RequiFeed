'use client';

import {
  Avatar,
  Badge,
  Button,
  Divider,
  Flex,
  Group,
  Image,
  MantineColor,
  Paper,
  PaperProps,
  Progress,
  Stack,
  Text,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import { Surface } from '@/components';
import { IconNotebook, IconShare } from '@tabler/icons-react';
import classes from '../ProjectsCard.module.css';
import { delete_api } from '@/hooks/Conexion';
import mensajes from '@/components/Notification/Mensajes';
import MensajeConfirmacion from '@/components/Notification/MensajeConfirmacion';
import { useRouter } from 'next/navigation';
const avatars = [
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
  'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVyc29ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
  'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGVyc29ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
];

type Status =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'completed'
  | 'cancelled'
  | 'on hold'
  | 'in progress'
  | 'archived'
  | 'suspended'
  | 'expired'
  | string;

type StatusProps = {
  status: Status;
};

const StatusBadge = ({ status }: StatusProps) => {
  let color: MantineColor;

  switch (status) {
    case 'expired':
      color = 'dark';
      break;
    case 'ACTIVO':
      color = 'red';
      break;
    case 'cancelled':
      color = 'gray';
      break;
    case 'archived':
      color = 'gray';
      break;
    case 'INACTIVO':
      color = 'green';
      break;
    case 'FINALIZADO':
      color = 'gray';
      break;
    case 'in progress':
      color = 'indigo';
      break;
    case 'pending':
      color = 'yellow.8';
      break;
    case 'suspended':
      color = 'red';
      break;
    case 'on hold':
      color = 'pink';
      break;
    default:
      color = 'gray';
  }

  return (
    <Badge color={color} variant="filled" radius="sm">
      {status}
    </Badge>
  );
};

interface User {
  id: number;
  nombre: string;
  apellido: string;
  ocupacion: string;
  area: string;
  foto: string;
  grupoId: number;
  cuentaId: number;
}
 
type ProjectsCardProps = {
  id: number;
  external_id: string;
  nombre: string;
  descripcion: string;
  fechaCreacion: string;
  estado: string;
  grupoId: number;
  calificacionId: number;
  grupo: {
    id: number,
    external_id: string,
    nombre: string,
    descripcion: string,
    idPeriodoAcademico: number,
    usuarios: User[]
  }
  onDelete?: () => void;
} & Omit<PaperProps, 'children'>;

const ProjectsCard = (props: ProjectsCardProps) => {
  const router = useRouter(); 

  const { external_id, estado, descripcion, nombre, fechaCreacion, grupo, ...others } =
    props;

  return (
    <Surface component={Paper} {...others}>
      <Stack gap="sm">
        <Flex justify="space-between" align="center">
          <Flex align="center" gap="xs">
            {/* {image && <Image src={image} width={20} height={20} radius="50%" />} */}
            <Text fz="md" fw={600}>
              {nombre}
            </Text>
          </Flex>
          <StatusBadge status={estado} />
        </Flex>
        <Text fz="sm" lineClamp={3}>
          {descripcion}
        </Text>

        <Text fz="sm">
          Tasks completed:{' '}
          <Text span fz="sm" fw={500} className={classes.tasksCompleted}>
            {/* {completion}/100 */}
          </Text>
        </Text>
        <Avatar.Group spacing="sm">
          {grupo.usuarios.map((user) => (
            <Tooltip key={user.id} label={`${user.nombre} ${user.apellido}`}>
              <Avatar
                src={user.foto}
                size="md"
                radius="xl"
                alt={`${user.nombre} ${user.apellido}`}
              />
            </Tooltip>
          ))}

        </Avatar.Group>
        <Divider />

        <Group gap="sm">
          <Button
            size="compact-md"
            variant="filled"
            leftSection={<IconShare size={14} />}
          >
            Revisar
          </Button>
          <Button
            size="compact-md"
            variant="filled"
            color='green'
            leftSection={<IconNotebook size={14} />}
            onClick={() => {
              router.push(`/docente/projects/edit/${external_id}`);
            }}
          >
            Calificar
          </Button>
        </Group>
      </Stack>
    </Surface>
  );
};

export default ProjectsCard;

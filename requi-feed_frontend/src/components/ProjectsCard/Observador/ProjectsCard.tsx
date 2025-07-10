'use client';

import {
  Avatar,
  Badge,
  Button,
  Divider,
  Flex,
  Group,
  Modal,
  Paper,
  PaperProps,
  Select,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { IconCalendarPlus, IconCalendarDot } from '@tabler/icons-react';

import { Surface } from '@/components';
import { IconNotebook, IconShare } from '@tabler/icons-react';
import classes from '../ProjectsCard.module.css';
import { useRouter } from 'next/navigation';
import { get_api, patch_api, post_api } from '@/hooks/Conexion';
import mensajes from '@/components/Notification/Mensajes';
import { useEffect, useState } from 'react';
import { DateInput, DatePickerInput } from '@mantine/dates';
import MensajeConfirmacion from '@/components/Notification/MensajeConfirmacion';

type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled' | 'on hold' | 'in progress' | 'archived' | 'suspended' | 'expired' | string;

type StatusProps = { status: Status };

const StatusBadge = ({ status }: StatusProps) => {
  let color;
  switch (status) {
    case 'expired': color = 'dark'; break;
    case 'ACTIVO': color = 'red'; break;
    case 'cancelled':
    case 'archived':
    case 'FINALIZADO': color = 'gray'; break;
    case 'INACTIVO': color = 'green'; break;
    case 'in progress': color = 'indigo'; break;
    case 'pending': color = 'yellow.8'; break;
    case 'suspended': color = 'red'; break;
    case 'on hold': color = 'pink'; break;
    default: color = 'gray';
  }
  return <Badge color={color} variant="filled" radius="sm">{status}</Badge>;
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

type FechaLimite = {
  tipo: string;
  fechaLimite: string;
};

type ProjectsCardProps = {
  id: number;
  external_id: string;
  nombre: string;
  descripcion: string;
  fechaCreacion: string;
  estado: string;
  grupoId: number;
  calificacionId: number;
  fechaLimite?: FechaLimite[];
  grupo: {
    id: number;
    external_id: string;
    nombre: string;
    descripcion: string;
    idPeriodoAcademico: number;
    usuarios: User[];
  };
  onDelete?: () => void;
  onUpdate?: () => void;
} & Omit<PaperProps, 'children'>;

const ProjectsCard = (props: ProjectsCardProps) => {
  const router = useRouter();
  const { external_id, estado, descripcion, nombre, grupo, fechaLimite, id, ...others } = props;

  const [opened, setOpened] = useState(false);
  const [tipoFecha, setTipoFecha] = useState<string | null>('INTERNA');
  const [fecha, setFecha] = useState<Date | null>(null);
  const [esEdicion, setEsEdicion] = useState(false);
  const [periodo, setPeriodo] = useState<any>(null);
  useEffect(() => {
    if (!tipoFecha) return;
    const encontrada = fechaLimite?.find(f => f.tipo === tipoFecha);
    setFecha(encontrada ? new Date(encontrada.fechaLimite) : null);
    setEsEdicion(!!encontrada);
  }, [tipoFecha, fechaLimite]);

  useEffect(() => {
    if (!grupo || !grupo.idPeriodoAcademico) return;

    const fetchPeriodo = async () => {
      const res = await get_api(`periodoacademico/${grupo.idPeriodoAcademico}`);
      setPeriodo(res.data.periodoAcademico);
    };

    fetchPeriodo();
  }, [grupo?.idPeriodoAcademico]);

  const handleGuardarFecha = async () => {
    if (fecha) {
      fecha.setHours(23, 59, 59, 999);
    }

    try {
      const payload = {
        proyectoId: id,
        tipoRevision: tipoFecha,
        fechaLimite: fecha?.toISOString(),
      };

      if (!payload.fechaLimite || !payload.tipoRevision) {
        mensajes('Error', 'Por favor, completa todos los campos', 'error');
        setOpened(false);
        return;
      }
      if (payload.fechaLimite <= new Date().toISOString()) {
        mensajes('Error', 'La fecha límite no puede ser anterior a la fecha actual', 'error');
        setOpened(false);

        return;
      }

      if (esEdicion) {
        MensajeConfirmacion("¿Estás seguro de actualizar la fecha de revisio?", "Confirmación", "info").then(async () => {
          try {
            await patch_api(`proyecto/${external_id}/revision/update`, payload);
            mensajes('Éxito', 'Fecha actualizada correctamente', 'success');
            router.refresh();

          }
          catch (error) {
            mensajes('Error', 'No se pudo actualizar la fecha', 'error');
          }
        });
      } else {
        MensajeConfirmacion("¿Estás seguro de crear la fecha de revision?", "Confirmación", "info").then(async () => {
          try {
            await post_api(`proyecto/${external_id}/revision`, payload);
            mensajes('Éxito', 'Fecha registrada correctamente', 'success');
            router.refresh();

          }
          catch (error) {
            mensajes('Error', 'No se pudo registrar la fecha', 'error');
          }
        });


      }

      setOpened(false);
      props.onUpdate?.();
    } catch (e) {
      mensajes('Error', 'No se pudo guardar la fecha', 'error');
    }
  };


  return (
    <Surface component={Paper} {...others}>
      <Stack gap="sm">
        <Flex justify="space-between" align="center">
          <Flex align="center" gap="xs">
            <Text fz="md" fw={600}>Periodo lectivo: </Text>
            <Badge color="cyan" variant="light">
              {periodo?.nombre ?? ""}
            </Badge>

          </Flex>
          <StatusBadge status={estado} />
        </Flex>

        <Flex align="center" gap="xs">
          <Text fz="md" fw={600}>Modalidad: </Text>
          <Badge
            color={
              periodo?.modalidad === 'Presencial'
                ? 'orange'
                : periodo?.modalidad === 'Virtual'
                  ? 'blue'
                  : 'gray'
            }
            variant="light"
          >
            {periodo?.modalidad ?? ''}
          </Badge>
        </Flex>

        <Flex align="center" gap="xs">
          <Text fz="md" fw={600}>Nombre del grupo: </Text>
          <Text fz="md" fw={400}> {grupo.nombre}</Text>
        </Flex>
        <Flex justify="space-between" align="center">
          <Flex align="center" gap="xs">
            <Text fz="md" fw={600}>{nombre}</Text>
          </Flex>
        </Flex>

        <Text fz="sm" lineClamp={3}>{descripcion}</Text>

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
            color="red"
            leftSection={<IconShare size={14} />}
            onClick={() => {
              router.push(`/observador/proyectos/reporte/${external_id}`);
            }}
          >

            Reporte
          </Button>
          
        </Group>
      </Stack>

      <Modal opened={opened} onClose={() => setOpened(false)} title="Editar fecha de revisión">
        <Stack>
          <Select
            label="Tipo de revisión"
            data={['INTERNA', 'EXTERNA']}
            value={tipoFecha}
            onChange={setTipoFecha}
          />
          <DatePickerInput
            label="Fecha límite"
            value={fecha}
            onChange={setFecha}
            locale="es"
            required
            clearable={false}
          />

          <Button fullWidth color="blue" onClick={handleGuardarFecha}>
            Guardar
          </Button>
        </Stack>
      </Modal>
    </Surface>
  );
};

export default ProjectsCard;

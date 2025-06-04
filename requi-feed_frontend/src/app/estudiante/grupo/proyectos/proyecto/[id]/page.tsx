'use client';

import { get_api, patch_api, post_api } from '@/hooks/Conexion';
import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  Modal,
  Select,
  Stack,
  Title,
  Text,
  TextInput,
  Flex,
  Menu,
  ActionIcon,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconDots, IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import mensajes from '@/components/Notification/Mensajes';
import React from 'react';
import { useParams } from 'next/navigation';

const Page = () => {
  const [requisitos, setRequisitos] = useState([]);
  const [periodoActual, setPeriodoActual] = useState<any>(null);
  const [proyecto, setProyecto] = useState<any>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [formData, setFormData] = useState(null);
  const { id } = useParams();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => `${currentYear + i}`);

  const form = useForm({
    initialValues: {
      numeroRequisito: "",
      tipo: '',
      estado: '',
      proyectoId: '',
      nombreRequisito: '',
      prioridad: '',
      descripcion: '',
      version: '1',
    },
    validate: {
      numeroRequisito: (value) => value ? null : 'Ingrese un numero',
      tipo: (value) => value ? null : 'Seleccione el tipo',
      estado: (value) => value ? null : 'Seleccione el estado',
      nombreRequisito: (value) => value ? null : 'Ingrese el nombre del requisito',
      prioridad: (value) => value ? null : 'Seleccione la prioridad del requisito',
      descripcion: (value) => value ? null : 'Ingrese la descripción del requisito',
      version: (value) => value ? null : 'Ingrese la versión del requisito',

    },
  });

  useEffect(() => {
    fetchRequisitos();
  }, []);

  const fetchRequisitos = async () => {
    try {
      const {data} = await get_api(`proyecto/${id}`);
      const res = await get_api(`requisito/proyecto/${data.id}`);
      setRequisitos(res.data.requisitos);
      setProyecto(res.data.proyecto);
      const hoy = new Date();
      const actual = res.data.find((p: any) =>
        new Date(p.fechaInicio) <= hoy && new Date(p.fechaFin) >= hoy
      );
      setPeriodoActual(actual || null);
    } catch (err) {
      console.error('Error al obtener periodos:', err);
    }
  };

  const abrirNuevo = () => {
    setFormData(null);
    form.reset();
    open();
  };
  


  // const abrirEdicion = (periodo: any) => {
  // const { anio, semestre } = obtenerAnioYSemestre(periodo.fechaInicio, periodo.fechaFin);
  //   form.setValues({
  //     nombre: periodo.nombre,
  //     anio,
  //     semestre,
  //     modalidad: periodo.modalidad,
  //   });
  //   setFormData({ ...periodo });
  //   open();
  // };

  const handleSubmit = async (values: typeof form.values) => {
    // const nombreFinal = values.nombre || `${values.anio}-${values.semestre}`;


    const payload = {
      numeroRequisito: values.numeroRequisito,
      tipo: values.tipo,
      estado: "NUEVO",
      proyectoId: proyecto.id,
      detalleRequisito: [{
        nombreRequisito: values.nombreRequisito,
        prioridad: values.prioridad,
        descripcion: values.descripcion,
        version: values.version
      }]
    };

    console.log('Payload a enviar:', payload);

    try {
      console.log('Enviando payload:', payload);
      // if (formData?.id) {

      //   const res = await patch_api(`periodoacademico/${formData.id}`, payload);
      //   if (res.message) {
      //     mensajes('Error al actualizar', res.message, 'error');
      //     return;
      //   }
      //   mensajes('Éxito', 'Periodo actualizado correctamente');
      // } else {
        const res = await post_api('requisito', payload);
        if (res.message) {
          mensajes('Error al guardar', res.message, 'error');
          return;
        }
        mensajes('Éxito', 'Requisito creado correctamente');
      // }

      fetchRequisitos();
      close();
      form.reset();
      setFormData(null);
    } catch (err) {
      console.error('Error:', err);
    }
  };
  const ICON_SIZE = 18;
  return (
    <Container size="md" mt="xl">
      {/* Periodo actual */}
      <Card shadow="md" padding="xl" radius="md" withBorder mb="xl">
        <Group justify="space-between" align="center">
          <Stack gap="xs">
            <Title order={2}>Proyecto</Title>
              <Group>
                <Text fw={600} fz={"h6"}>{"Nombre:"}</Text>
                <Badge color="green" size="lg" variant="light">
                  {proyecto?.nombre ?? "Sin nombre"}
                  {/* {periodoActual.nombre} - {periodoActual.modalidad} */}
                </Badge>
              </Group>
              {/* <Group>
                <Text fw={600} fz={"h6"}>{"Descripción:"}</Text>
                <Text fw={400} fz={"h6"}>{proyecto.descripcion}</Text>
              </Group> */}
              <Group>
                <Text fw={600} fz={"h6"}>{"Estado:"}</Text>
                <Badge color="grape" size="lg" variant="dot">
                  {proyecto?.estado ?? "Sin estado"}
                  {/* {periodoActual.nombre} - {periodoActual.modalidad} */}
                </Badge>
              </Group>
          </Stack>
          <Button
            leftSection={<IconPlus size={18} />}
            color="teal"
            onClick={abrirNuevo}
          >
            Agregar requisito
          </Button>
        </Group>
      </Card>

      <Title order={3} mb="sm">Todos los requisitos</Title>
      <Stack>
        {requisitos.map((requisito: any) => (
          <Card
            key={requisito.id}
            withBorder
            shadow="xs"
            radius="md"
            padding="md"
            // onClick={() => abrirEdicion(p)}
            style={{ cursor: 'pointer' }}
          >
            <Flex
              p="xs"
              align="center"
              justify="space-between"
              style={{
                cursor: 'grab',
                // borderBottom: `1px solid ${theme.colors.dark[1]}`,
              }}
              // {...attributes}
              // {...listeners}
            >
            <div style={{ position: 'absolute', top: 8, right: 8 }}>

              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon variant="subtle">
                    <IconDots size={ICON_SIZE} />
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<IconEdit size={ICON_SIZE} />}
                    // onClick={() => {
                    //   setEditMode(true);
                    // }}
                  >
                    Rename
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconTrash size={ICON_SIZE} />}
                    // onClick={() => {
                    //   confirmModal(column);
                    // }}
                  >
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
            </Flex>
            <Group>
              <Text fw={600} fz={"h5"}>{"Tipo:"}</Text>
              <Badge color="blue" variant="light">{requisito.tipo}</Badge>
            </Group>
            <Group>
              <Text fw={600} fz={"h6"}>{"Número de requisito:"}</Text>
              <Badge color="green" variant="light">{requisito.numeroRequisito}</Badge>
            </Group>
            <Text fw={600} fz={"h5"}>{"Detalles del requisito:"}</Text>
            <Group>
              <Text fw={600} fz={"h6"}>{"Nombre del requisito:"}</Text>
              <Text fw={400} fz={"h6"}>{requisito.detalleRequisito[0].nombreRequisito}</Text>
            </Group>
            <Group>
              <Text fw={600} fz={"h6"}>{"Prioridad:"}</Text>
              <Badge color="cyan" variant="light">{requisito.detalleRequisito[0].prioridad}</Badge>
            </Group>
            <Group >
              <Text fw={600} fz={"h6"}>{"Descripción:"}</Text>
              <Text fw={400} fz={"h6"}>{requisito.detalleRequisito[0].descripcion}</Text>
            </Group>
            <Group>
              <Text fw={600} fz={"h6"}>{"Version:"}</Text>
              <Text fw={400} fz={"h6"}>{requisito.detalleRequisito[0].version}</Text>
            </Group>
            
          </Card>
        ))}
      </Stack>

      {/* Modal Crear/Editar */}
      <Modal
        style={{ fontSize: "16px", }}
        opened={opened}
        onClose={() => {
          close();
          form.reset();
          setFormData(null);
        }}
        // title={formData?.id ? 'Editar requisito' : 'Crear requisito'}
        centered
      >
        <div style={{ fontSize: "30px", textAlign: "center", fontWeight:"600" }}>
          {/* Aquí va tu contenido */}
          <p>Crear requisito</p>
          {/* etc. */}
        </div>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Número de requisito"
              // value="1"
              // disabled
              required
              {...form.getInputProps('numeroRequisito')}
            />
            <Select
              label="Tipo"
              data={[
                { label: 'FUNCIONAL', value: 'FUNCIONAL' },
                { label: 'NO FUNCIONAL', value: 'NO_FUNCIONAL' },
              ]}
              placeholder="Seleccional tipo de requisito"
              {...form.getInputProps('tipo')}
              required
            />
            <Text size="lg" fw={600} mb="md">
              Detalle del requisito
            </Text>
            <TextInput
              label="Nombre"
              placeholder="Nombre del requisito"
              required
              {...form.getInputProps('nombreRequisito')}
            />
            <Select
              label="Prioridad"
              data={['ALTA', 'MEDIA', 'BAJA']}
              placeholder="Selecciona la prioridad"
              {...form.getInputProps('prioridad')}
              required
            />
            <TextInput
              label="Descripción"
              placeholder="Descripción del requisito"
              required
              {...form.getInputProps('descripcion')}
            />
            <TextInput
              label="Versión"
              placeholder="Vesion"
              // value="1.00"
              // disabled
              {...form.getInputProps('version')}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={() => {
                close();
                form.reset();
                setFormData(null);
              }}>
                Cancelar
              </Button>
              <Button type="button" color="teal" 
              onClick={() => handleSubmit(form.values)}
              >
                Crear
                {/* {formData?.id ? 'Actualizar' : 'Guardar'} */}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
};

export default Page;

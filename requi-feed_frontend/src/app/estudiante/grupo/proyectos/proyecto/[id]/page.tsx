'use client';

import { delete_api, get_api, patch_api, post_api } from '@/hooks/Conexion';
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
import MensajeConfirmacion from '@/components/Notification/MensajeConfirmacion';

const Page = () => {
  //Filtro de requsiitos
  const [requisitos, setRequisitos] = useState([]);
  const [tipoFiltro, setTipoFiltro] = useState<string | null>(null);
  const [valorFiltro, setValorFiltro] = useState<string | null>(null);

  const [opcionesFiltradas, setOpcionesFiltradas] = useState<string[]>([]);
  const [periodoActual, setPeriodoActual] = useState<any>(null);
  const [proyecto, setProyecto] = useState<any>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [formData, setFormData] = useState(null);
  const { id } = useParams();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => `${currentYear + i}`);

  const handleTipoFiltroChange = (value: string | null) => {
    setTipoFiltro(value);

    if (value === 'ESTADO') {
      setOpcionesFiltradas(['NUEVO', 'BORRADOR', 'EN_REVISION', 'OBSERVADO',
        'LISTO', 'ACEPTADO', 'APROBADO'
      ]);
    } else if (value === 'PRIORIDAD') {
      setOpcionesFiltradas(['ALTA', 'MEDIA', 'BAJA']);
    } else if (value == 'TIPO') {
      setOpcionesFiltradas(['FUNCIONAL', 'NO_FUNCIONAL']);
    }else{
      setOpcionesFiltradas([]);
    }
  };

  const form = useForm({
    initialValues: {
      numeroRequisito: '',
      tipo: '',
      estado: '',
      proyectoId: '',
      nombreRequisito: '',
      prioridad: '',
      descripcion: '',
      version: '1.0',
    },
    validate: {
      tipo: (value) => value != '' ? null : 'Seleccione el tipo',
      nombreRequisito: (value) => value != '' ? null : 'Ingrese el nombre del requisito',
      prioridad: (value) => value != '' ? null : 'Seleccione la prioridad del requisito',
      // descripcion: (value) => value != '' ? null : 'Ingrese la descripción del requisito',
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
  
  const limpiarFiltro = () => {
    setTipoFiltro(null);
    setValorFiltro(null);
    fetchRequisitos(); // vuelve a cargar todos
  };
  const handleFiltro = () => {
    if (!tipoFiltro || !valorFiltro) {
      mensajes('Advertencia', 'Selecciona un tipo de filtro y un valor', 'warning');
      return;
    }

    const filtrados = requisitos.filter((req: any) => {
      if (tipoFiltro === 'ESTADO') return req.estado === valorFiltro;
      if (tipoFiltro === 'PRIORIDAD') return req.detalleRequisito[0].prioridad === valorFiltro;
      if (tipoFiltro === 'TIPO') return req.tipo === valorFiltro;
      return true;
    });

    setRequisitos(filtrados);
  };

  const handleSubmit = async (values: typeof form.values) => {

    let nuevaVersion = values.version;
    let estadoDefecto = "NUEVO"
    if (formData?.id && values.version) {
      const versionActual = parseFloat(values.version);
      const versionIncrementada = (versionActual + 0.1).toFixed(1); // e.g., "1.1"
      nuevaVersion = versionIncrementada;
      estadoDefecto = values.estado;
    }

    const payload = {
      numeroRequisito: values.numeroRequisito,
      tipo: values.tipo,
      estado: estadoDefecto,
      proyectoId: proyecto.id,
      detalleRequisito: [{
        nombreRequisito: values.nombreRequisito,
        prioridad: values.prioridad,
        descripcion: values.descripcion,
        version: nuevaVersion
      }]
    };

    console.log('Payload a enviar:', payload);

    try {
      console.log('Enviando payload:', payload);
      console.log(formData);
      if (formData?.id) {
        const res = await patch_api(`requisito/${formData.external_id}`, payload);
        // console.log('UPDARED');
        console.log(formData);
        if (res.message) {
          mensajes('Error al actualizar', res.message, 'error');
          return;
        }
        mensajes('Éxito', 'Requisito actualizado correctamente');
      } else {
        const res = await post_api('requisito', payload);
        if (res.message) {
          mensajes('Error al guardar', res.message, 'error');
          return;
        }
        mensajes('Éxito', 'Requisito creado correctamente');
      }

      fetchRequisitos();
      close();
      form.reset();
      setFormData(null);
    } catch (err) {
      console.error('Error:', err);
    }
  };
  const ICON_SIZE = 18;

  const abrirEdicion = (requisito: any) => {
    form.setValues({
      tipo: requisito.tipo,
      estado: requisito.estado,
      proyectoId: requisito.proyectoId,
      nombreRequisito: requisito.detalleRequisito[0].nombreRequisito,
      prioridad: requisito.detalleRequisito[0].prioridad,
      descripcion: requisito.detalleRequisito[0].descripcion,
      version: requisito.detalleRequisito[0].version
    });
    setFormData({ ...requisito });
    open();
  };

  const eliminarRequisito = (external_id: string) => {
    MensajeConfirmacion("Esta acción es irreversible. ¿Desea continuar?", "Confirmación", "warning")
            .then(async () => {
              try {
                await delete_api(`requisito/${external_id}`);
                        // await getMonitoringStations();
                mensajes("Éxito", "Requisito eliminado exitosamente");
                fetchRequisitos();
                } catch (error:any) {
                  console.log(error);
                  console.log(error?.response?.data || error.message);
                  mensajes("Error al momento de eliminar", error.response?.data?.customMessage || "No se ha podido eliminar el requisito", "error");
                }
              })
              .catch((error:any) => {
                mensajes("Error al momento de eliminar", error.response?.data?.customMessage || "No se ha podido eliminar el requsito", "error");
                console.error(error);
              });   
    
  }
  

  return (
    <Container size="md" mt="xl">
      {/* Periodo actual */}
      <Card shadow="md" padding="xl" radius="md" withBorder mb="xl">
        <Group justify="space-between" align="center">
          <Stack gap="xs">
            <Title order={2}>Proyecto</Title>
              <Group>
                <Text fw={600} fz={"h6"}>{"Nombre:"}</Text>
                <Badge color="grape" size="lg" variant="filled">
                  {proyecto?.nombre ?? "Sin nombre"}
                  {/* {periodoActual.nombre} - {periodoActual.modalidad} */}
                </Badge>
              </Group>
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
      <Group mb={15}>
        <Text> Filtrar búsqueda </Text>
        <Select
          label="Tipo de filtro"
          data={['PRIORIDAD', 'ESTADO', 'TIPO']}
          placeholder="Selecciona el tipo de filtro"
          value={tipoFiltro}
          onChange={handleTipoFiltroChange}
        />

        <Select
          label="Valor del filtro"
          data={opcionesFiltradas}
          placeholder={
            tipoFiltro ? `Selecciona una opción de ${tipoFiltro.toLowerCase()}` : 'Primero elige un tipo'
          }
          value={valorFiltro}
          onChange={setValorFiltro}
          disabled={!tipoFiltro}
        />
        <Button onClick={handleFiltro} color="blue" variant="outline">
          Filtrar
        </Button>
        <Button onClick={limpiarFiltro} color="red" variant="outline">
          Limpiar filtros
        </Button>
      </Group>
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
                    onClick={() => {
                      abrirEdicion(requisito);
                    }}
                  >
                    Editar
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconTrash size={ICON_SIZE} />}
                    onClick={() => {
                      eliminarRequisito(requisito?.external_id);
                    }}
                  >
                    Eliminar
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
            </Flex>
            <Group>
              <Text fw={600} fz={"h5"}>{"Estado:"}</Text>
              <Badge fz={"h6"} color="red" variant="outline">{requisito.estado}</Badge>
            </Group>
            <Group>
              <Text fw={600} fz={"h5"}>{"Tipo:"}</Text>
              <Badge fz={"h6"} color="blue" variant="gradient">{requisito.tipo}</Badge>
            </Group>
            <Group>
              <Text fw={600} fz={"h6"}>{"Número de requisito:"}</Text>
              <Badge fz={"h6"} color="green" variant="default">{requisito.numeroRequisito}</Badge>
            </Group>
            <Text fw={600} fz={"h5"}>{"Detalles del requisito:"}</Text>
            <Group>
              <Text fw={600} fz={"h6"}>{"Nombre del requisito:"}</Text>
              <Text fw={400} fz={"h6"}>{requisito.detalleRequisito[0].nombreRequisito}</Text>
            </Group>
            <Group>
              <Text fw={600} fz={"h6"}>{"Prioridad:"}</Text>
              <Badge fz={"h6"} color="cyan" variant="gradient">{requisito.detalleRequisito[0].prioridad}</Badge>
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
        // title={formData?.numeroRequisito ? 'Editar requisito' : 'Crear requisito'}
        centered
      >
        <div style={{ fontSize: "30px", textAlign: "center", fontWeight:"600" }}>
          {/* Aquí va tu contenido */}
          {formData?.id ? 'Editar requisito' : 'Crear requisito'}
        </div>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            {formData?.id ? (
              <Select
              label="Estado del requisito"
              // data={[
              //   { label: 'FUNCIONAL', value: 'FUNCIONAL' },
              //   { label: 'NO FUNCIONAL', value: 'NO_FUNCIONAL' },
              // ]}
              data={[
                'BORRADOR',
                'EN_REVISION',
                "LISTO"
              ]}
              placeholder="Seleccional tipo de requisito"
              {...form.getInputProps('estado')}
              // required
            />
            ) : ''}
            

            <Select
              label="Tipo"
              // data={[
              //   { label: 'FUNCIONAL', value: 'FUNCIONAL' },
              //   { label: 'NO FUNCIONAL', value: 'NO_FUNCIONAL' },
              // ]}
              data={[
                'FUNCIONAL',
                'NO_FUNCIONAL',
              ]}
              placeholder="Seleccional tipo de requisito"
              {...form.getInputProps('tipo')}
              // required
            />
            <Text size="lg" fw={600} mb="md">
              Detalle del requisito
            </Text>
            <TextInput
              label="Nombre"
              placeholder="Nombre del requisito"
              // required
              {...form.getInputProps('nombreRequisito')}
            />
            <Select
              label="Prioridad"
              data={['ALTA', 'MEDIA', 'BAJA']}
              placeholder="Selecciona la prioridad"
              {...form.getInputProps('prioridad')}
              // required
            />
            <TextInput
              label="Descripción"
              placeholder="Descripción del requisito"
              // required
              {...form.getInputProps('descripcion')}
            />
            <TextInput
              label="Versión"
              placeholder="Version"
              disabled={true}
              // required
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
              <Button type="submit" color="teal">
                {formData?.id ? 'Actualizar' : 'Guardar'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
};

export default Page;

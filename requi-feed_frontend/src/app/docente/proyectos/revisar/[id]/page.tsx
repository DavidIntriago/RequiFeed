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
  Textarea,
  NumberInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import {  useEffect, useState } from 'react';
import mensajes from '@/components/Notification/Mensajes';
import React from 'react';
import { useParams } from 'next/navigation';
import { get } from '@/hooks/SessionUtil';
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
  const [formData, setFormData] = useState<any>(null);
  const { id } = useParams();
  const [esLider, setEsLider] = useState(false);
  const [estadoTemporal, setEstadoTemporal] = useState('');
  const [estadoEnEdicion, setEstadoEnEdicion] = useState<number | null>(null);
  const [comentarios, setComentarios] = useState<any>({});
  const [nuevoComentario, setNuevoComentario] = useState<Record<string, string>>({});
  const [comentarioEditando, setComentarioEditando] = useState<number | null>(null);
  const [textoEditado, setTextoEditado] = useState<string>('');
  const [respuestaEditando, setRespuestaEditando] = useState<number | null>(null);
  const [textoRespuestaEditada, setTextoRespuestaEditada] = useState<string>('');
  const [respuestaEditandoId, setRespuestaEditandoId] = useState<number | null>(null);
  const [calificacion, setCalificacion] = useState<string>('');
  const [contenidoRespuestaEditando, setContenidoRespuestaEditando] = useState('');

  const [comentarioRespondiendoId, setComentarioRespondiendoId] = useState<number | null>(null);
  const [respuestaTexto, setRespuestaTexto] = useState('');
  const [calificacionDada, setCalificacionDada] = useState(false);
  

  const [requisitoConComentariosAbiertos, setRequisitoConComentariosAbiertos] = useState<string | null>(null);
  const [requisitoConCalificacion, setRequisitoConCalificacion] = useState<string | null>(null);
  const [calificacionRequisito, setCalificacionRequisito] = useState('');
  const [fechaLimiteExterna, setFechaLimiteExterna] = useState<Date | null>(null);
  const fechaActual = new Date();

  const getColorByRol = (rol:any) => {
    switch (rol) {
      case 'LIDER':
        return 'blue';
      case 'ANALISTA':
        return 'green';
      case 'DOCENTE':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => `${currentYear + i}`);

  //Funcion para actualizar el estado del requisito
  const guardarEstado = async (nuevoEstado: string, requisito: any) => {
    try {
      if (!nuevoEstado) {
        mensajes('Advertencia', 'Seleccione un estado válido', 'warning');
        return;
      }
      if (nuevoEstado === requisito.estado) {
        mensajes('Informacion', `El requisito ya esta en el estado ${requisito.estado}`, 'info');
        setEstadoEnEdicion(null);

        return;
      }
      await MensajeConfirmacion(
        `¿Está seguro de que desea cambiar el estado a ${nuevoEstado}?`,
        'Confirmación',
        'warning'
      ).then(async () => {
        await patch_api(`requisito/estado/${requisito.external_id}`, { estado: nuevoEstado }).then((res) => {
          if (res.message) {
            mensajes('Error al actualizar estado', res.message, 'error');
            return;
          }
          mensajes('Éxito', 'Estado actualizado correctamente', 'success');
        });
        setEstadoEnEdicion(null);
        requisito.estado = nuevoEstado;

      }
      );

    } catch (err) {
      console.error('Error al actualizar estado:', err);
      setEstadoEnEdicion(null);
    }
  };

  // Manejo de cambios en el tipo de filtro
  const handleTipoFiltroChange = (value: string | null) => {
    setTipoFiltro(value);

    if (value === 'PRIORIDAD') {
        setOpcionesFiltradas(['ALTA', 'MEDIA', 'BAJA']);
    } else if (value == 'TIPO') {
      setOpcionesFiltradas(['FUNCIONAL', 'NO_FUNCIONAL']);
    } else {
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
    isLider();

  }, []);
  
  useEffect(() => {
    fetchRequisitos();
  }, [nuevoComentario, calificacionDada,
     requisitoConCalificacion]);
  const isLider = () => {
    const rol = get("rol")
    if (rol === "LIDER") {
      setEsLider(true);
      console.log("Es lider del proyecto");
    }
    return false;
  };

  //Actualiza los requisitos del proyecto
  const fetchRequisitos = async () => {
    try {
      const { data } = await get_api(`proyecto/${id}`);
      const res = await get_api(`requisito/proyecto/docente/${data.id}`);
      setRequisitos(res.data.requisitos || []);
      setProyecto(data);
      console.log("FECHAAAAAAA ")
      console.log(data);
      const fechaLimiteExternaStr = data.fechaLimite.find(
        (f:any) => f.tipo === 'EXTERNA'
      )?.fechaLimite;
      const fechaLimiteExternaTransform = new Date(fechaLimiteExternaStr);
      console.log("FECHA EXTERNAAAA")
      console.log(fechaLimiteExternaTransform)
      setFechaLimiteExterna(fechaLimiteExternaTransform);
      const hoy = new Date();
      const actual = res.data.find((p: any) =>
        new Date(p.fechaInicio) <= hoy && new Date(p.fechaFin) >= hoy
      );
      setPeriodoActual(actual || null);
      setComentarios(res.data.requisitos);

    } catch (err) {
      console.error('Error al obtener requisitos o periodos', err);
    }
  };

  // const abrirNuevo = () => {
  //   setFormData(null);
  //   form.reset();
  //   open();
  // };

  // Limpiar filtro
  const limpiarFiltro = () => {
    setTipoFiltro(null);
    setValorFiltro(null);
    fetchRequisitos(); // vuelve a cargar todos
  };

  // Manejo del filtro
  const handleFiltro = async () => {
    if (!tipoFiltro || !valorFiltro) {
      mensajes('Advertencia', 'Selecciona un tipo de filtro y un valor', 'warning');
      return;
    }

    const { data } = await get_api(`proyecto/${id}`);
    const res = await get_api(`requisito/proyecto/${data.id}`);

    const requisitosApi = res.data.requisitos;
    const filtrados = requisitosApi.filter((req: any) => {
      alert(req.calificacion)

      if (tipoFiltro === 'ESTADO') return req.estado === valorFiltro;
      if (tipoFiltro === 'PRIORIDAD') return req.detalleRequisito[0].prioridad === valorFiltro;
      if (tipoFiltro === 'TIPO') return req.tipo === valorFiltro;
      return true;
    });

    setRequisitos(filtrados);
  };

  //Boton para enviar el formulario
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

  // Actualiza el comentario
  const editarComentario = async (comentarioId: any, external_id: any, usuarioId: any) => {
    if (!textoEditado.trim()) {
      mensajes("Error", "El comentario editado no puede estar vacío", "error");
      return;
    }

    try {
      await patch_api(`comentario/${comentarioId}`, {
        descripcion: textoEditado,
        usuarioId,
      });
      mensajes("Éxito", "Comentario actualizado correctamente", "success");
      setComentarioEditando(null);
      setTextoEditado('');
      cargarComentarios(external_id);
    } catch (err) {
      mensajes("Error", "No se pudo actualizar el comentario", "error");
      console.error(err);
    }
  };

  // Elimina un comentario
  const eliminarComentario = async (comentarioId: any, external_id: any, usuarioId: any) => {
    try {
      await MensajeConfirmacion(
        "¿Estás seguro de que deseas eliminar este comentario?",
        "Confirmación",
        "warning"
      ).then(async () => {
        await delete_api(`comentario/${comentarioId}?userId=${usuarioId}`);
        mensajes("Éxito", "Comentario eliminado correctamente", "success");
        cargarComentarios(external_id);
      });
    } catch (error) {
      if (error === 'cancel') {
        mensajes("Cancelado", "El comentario no fue eliminado", "info");
      }
    }
  };

  // Edita una respuesta a un comentario
  const editarRespuesta = async (respuestaId: any, external_id: any, usuarioId: any) => {
    if (!textoRespuestaEditada.trim()) {
      mensajes("Error", "La respuesta editada no puede estar vacía", "error");
      return;
    }

    try {
      await patch_api(`comentario/${respuestaId}`, {
        descripcion: textoRespuestaEditada,
        usuarioId,
      });
      mensajes("Éxito", "Respuesta actualizada correctamente", "success");
      setRespuestaEditando(null);
      setTextoRespuestaEditada('');
      cargarComentarios(external_id);
    } catch (err) {
      mensajes("Error", "No se pudo actualizar la respuesta", "error");
      console.error(err);
    }
  };

  // Elimina una respuesta a un comentario
  const eliminarRespuesta = async (respuestaId: any, external_id: any, usuarioId: any) => {
    try {
      const confirmado = await MensajeConfirmacion(
        "¿Estás seguro de que deseas eliminar esta respuesta?",
        "Confirmación",
        "warning"
      );

      if (confirmado) {
        await delete_api(`comentario/${respuestaId}?userId=${usuarioId}`);
        mensajes("Éxito", "Respuesta eliminada correctamente", "success");
        cargarComentarios(external_id);
      } else {
        mensajes("Cancelado", "La respuesta no fue eliminada", "info");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Carga los comentarios de un requisito
  const cargarComentarios = async (external_id: string) => {
    try {
      const response = await get_api(`comentario/requisito/${external_id}`);
      console.log('Comentarios cargados:', response);

      const comentariosPrincipales = response.filter((c: { comentarioPadreId: null; }) => c.comentarioPadreId === null);

      setComentarios((prev: any) => ({
        ...prev,
        [external_id]: comentariosPrincipales,
      }));
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
    }
  };

   // Carga la nota del requisito de un requisito
  const cargarNotaRequisito = async (external_id:any) => {
    try {
      const response = await get_api(`comentario/requisito/${external_id}`);
      // const response = await get_api(`requisito/${external_id}`);
      console.log('Nota cargada:', response);

      console.log('Comentarios cargados:', response);

      const comentariosPrincipales = response.filter((c:any) => c.comentarioPadreId === null);
      setComentarios((prev:any) => ({
        ...prev,
        [external_id]: comentariosPrincipales,
      }));
      // setCalificacionRequisito((prev:any) => ({
      //   ...prev,
      //   [external_id]: comentariosPrincipales,
      // }));
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
    }
  };

  // Maneja el envío para crear un nuevo comentario
  const handleComentario = async (detalleRequisitoId:string, external_id:string, usuarioId:any) => {
    if (!nuevoComentario[external_id]?.trim()) {
      mensajes("Error", "El comentario no puede estar vacío", "error");
      return;
    }

    if (!usuarioId) {
      mensajes("Error", "No se encontró información del usuario", "error");
      return;
    }

    console.log({
      detalleRequisitoId,
      nuevoComentario: nuevoComentario[external_id],
      usuarioId
    })
    try {
      
      // setNuevoComentario(prev => ({ ...prev, [external_id]: '' }));
      if (fechaLimiteExterna !== null && fechaLimiteExterna < fechaActual){
        await post_api('comentario/docente', {
          detalleRequisitoId,
          // revisionId,
          descripcion: nuevoComentario[external_id],
          usuarioId,
          updateState: false
        });
        mensajes("Éxito", "Comentario creado correctamente", "success");

        cargarComentarios(external_id);
      }else{
        await post_api('comentario/docente', {
          detalleRequisitoId,
          // revisionId,
          descripcion: nuevoComentario[external_id],
          usuarioId,
          updateState: true
        });
        mensajes("Éxito", "Comentario creado correctamente", "success");
        setNuevoComentario(prev => ({ ...prev, [external_id]: '' }));
      }
    } catch (error) {
      mensajes("Error", "Hubo un problema al crear el comentario", "error");
      console.error("Error al crear comentario:", error);
    }

  };

  // Responde a un comentario
  const responderComentario = async (comentarioId: any, revisionId: any, external_id: any) => {

    alert('dentro de comentar')
    if (!respuestaTexto.trim()) return;

    const usuarioId = get('usuario_id');
    if (!usuarioId) {
      mensajes("Error", "Usuario no válido", "error");
      return;
    }

    try {
      const result = await post_api('comentario', {
        usuarioId,
        descripcion: respuestaTexto,
        revisionId,
        comentarioPadreId: comentarioId,
      });
      console.log('RESULTADO DE COMENTARIO')
      console.log(result);
      mensajes("Éxito", "Comentario respondido correctamente", "success");
      setComentarioRespondiendoId(null);
      setRespuestaTexto('');
      cargarComentarios(external_id);
    } catch (err) {
      mensajes("Error", "No se pudo responder el comentario", "error");
      console.error(err);
    }
  };



  // Actualiza una respuesta a un comentario
  const actualizarRespuesta = async (respuestaId: any, nuevaDescripcion: string, external_id: any) => {
    if (!nuevaDescripcion.trim()) {
      mensajes("Error", "La respuesta no puede estar vacía", "error");
      return;
    }

    try {
      await patch_api(`comentario/${respuestaId}`, {
        descripcion: nuevaDescripcion,
        usuarioId: parseInt(get('usuario_id')),
      });
      mensajes("Éxito", "Respuesta actualizada correctamente", "success");
      setRespuestaEditandoId(null);
      setContenidoRespuestaEditando('');
      cargarComentarios(external_id);
    } catch (err) {
      console.error(err);
    }
  };

  // Alterna la visibilidad de los comentarios de un requisito
  const toggleComentarios = async (external_id: string) => {
    if (requisitoConComentariosAbiertos === external_id) {
      setRequisitoConComentariosAbiertos(null);
      return;
    }
    setRequisitoConComentariosAbiertos(external_id);

    if (!comentarios[external_id]) {
      await cargarNotaRequisito(external_id);
    }
  };

  const toggleConCalificacion = async (external_id: string) => {
    if (requisitoConCalificacion === external_id) {
      setRequisitoConCalificacion(null);
      return;
    }
    setRequisitoConCalificacion(external_id);

    if (!requisitos[external_id]) {
      await cargarNotaRequisito(external_id);
    }
  };

  // const hayRevisionActivaHoy = proyecto?.fechaLimite?.some((flim: { fechaLimite: string | number | Date; }) => {
  //   const hoy = new Date().toDateString();
  //   return new Date(flim.fechaLimite).toDateString() === hoy;
  // });

  const guardarCalificacion = async (external_id: string) => {
    // alert(calificacion);
    // alert(external_id)
    // alert(calificacionRequisito)
    try {
      if(calificacionRequisito == null || calificacionRequisito == ''){
        return mensajes("Faltan datos", "Para cambiar de estado debe selecionar una calificación al requisito", "error");
      }else{
        await patch_api(`requisito/calificarRequisito/${external_id}`, {calificacion: Number(calificacionRequisito)});
        mensajes("Éxito", "Requisito calificado exitosamente", "success");
        setCalificacion('');
        setCalificacionDada((prev) => !prev);
        setRequisitoConCalificacion(null);
        setCalificacionRequisito('');
      }
      
      // cargarComentarios(external_id);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Container size="md" mt="xl">
      {/* Periodo actual */}
      <Card shadow="md" padding="xl" radius="md" withBorder mb="xl">
        <Group justify="space-between" align="center">
          <Stack gap="xs">
            <Title order={2}>Proyecto</Title>

            <Group>
              <Text fw={600} fz="h6">Nombre:</Text>
              <Badge color="grape" size="lg" variant="filled">
                {proyecto?.nombre ?? "Sin nombre"}
              </Badge>
            </Group>

            <Group>
              <Text fw={600} fz="h6">Estado:</Text>
              <Badge color="grape" size="lg" variant="dot">
                {proyecto?.estado ?? "Sin estado"}
              </Badge>
            </Group>

            {proyecto?.fechaLimite?.length > 0 && (
              <Group>
                <Text fw={600} fz="h6">Fechas de revisión:</Text>
                <Stack gap={4}>
                  {proyecto.fechaLimite.map((flim: { fechaLimite: string | number | Date; tipo: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, index: React.Key | null | undefined) => (
                    <Group key={index} gap="xs">
                      <Text>
                        {new Date(flim.fechaLimite).toLocaleDateString('es-EC', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                      <Badge color={flim.tipo === "INTERNA" ? "orange" : "blue"} variant="light">
                        {flim.tipo}
                      </Badge>
                    </Group>
                  ))}
                </Stack>
              </Group>
            )}

          </Stack>

          {/* <Button
            leftSection={<IconPlus size={18} />}
            color="teal"
            onClick={abrirNuevo}
          >
            Agregar requisito
          </Button> */}
        
        </Group>
      </Card>


      <Title order={3} mb="sm">Todos los requisitos</Title>
      <Group mb={15}>
        <Text> Filtrar búsqueda </Text>
        <Select
          label="Tipo de filtro"
          data={['PRIORIDAD', 'TIPO']}
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
        <Button style={{ marginTop: "25px" }} onClick={handleFiltro} color="blue" variant="outline">
          Filtrar
        </Button>
        <Button style={{ marginTop: "25px" }} onClick={limpiarFiltro} color="red" variant="outline">
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
          <Group align="flex-start" justify="space-between" wrap="nowrap"> 
            <Stack gap="xs">
            <Group>
              <Text fw={600} fz="h5">{"Estado:"}</Text>

              {estadoEnEdicion === requisito.id ? (
                <>
                  <Select
                    data={["NUEVO", "BORRADOR", "EN_REVISION", "OBSERVADO", "LISTO", "ACEPTADO", "APROBADO"]}
                    placeholder="Selecciona un estado"
                    value={estadoTemporal}
                    onChange={(value) => setEstadoTemporal(value!)}
                    size="xs"
                    w={160}
                  />
                  <ActionIcon
                    color="green"
                    variant="subtle"
                    onClick={() => {
                      guardarEstado(estadoTemporal, requisito);
                    }}

                  >
                    <IconCheck size={16} />
                  </ActionIcon>
                </>
              ) : (
                <>
                  <Badge fz="h6" color="red" variant="outline">{requisito.estado}</Badge>
                  {esLider && (
                    <ActionIcon
                      color="blue"
                      variant="subtle"
                      onClick={() => {
                        setEstadoEnEdicion(requisito.id);
                        setEstadoTemporal(requisito.estado);
                      }}
                    >
                      <IconPencil size={16} />
                    </ActionIcon>
                  )}
                </>
              )}
            </Group>

            <Group>
              <Text fw={600} fz="h5">{"Tipo:"}</Text>
              <Badge
                fz="h6"
                color={requisito.tipo == "FUNCIONAL" ? "cyan" : "gray"}
                variant="filled"
              >
                {requisito.tipo}
              </Badge>
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
              <Badge
                fz={"h6"}
                color={
                  requisito.detalleRequisito[0].prioridad === "ALTA"
                    ? "red"
                    : requisito.detalleRequisito[0].prioridad === "MEDIA"
                      ? "yellow"
                      : "green"
                }
                variant="filled">{requisito.detalleRequisito[0].prioridad}
              </Badge>
            </Group>
            <Group >
              <Text fw={600} fz={"h6"}>{"Descripción:"}</Text>
              <Text fw={400} fz={"h6"}>{requisito.detalleRequisito[0].descripcion}</Text>
            </Group>
            <Group>
              <Text fw={600} fz={"h6"}>{"Version:"}</Text>
              <Text fw={400} fz={"h6"}>{requisito.detalleRequisito[0].version}</Text>
            </Group>
            <Group>
                {/* <Text fw={600} fz="h5">{"Calificación:"}</Text> */}
                {/* <Text fw={600} fz="h6">Calificar requisito:</Text> */}
                {requisitoConCalificacion != requisito.external_id && fechaLimiteExterna !== null && fechaActual > fechaLimiteExterna && (
                <Button
                  size="xs"
                  variant="light"
                  color='pink'
                  onClick={() => toggleConCalificacion(requisito.external_id)}
                >
                  Calificar requisito
                  {/* {requisitoConComentariosAbiertos === requisito.external_id ? 'Ocultar comentarios' : 'Calificar requisito'} */}
                </Button>
                )}  
                {requisitoConCalificacion === requisito.external_id && (
                    <Select
                      id={`calificacion-select-${requisito.id}`}
                      label="Calificación"
                      data={[
                        { label: 'BIEN', value: '10' },
                        { label: 'MEDIO', value: '5' },
                        { label: 'MAL', value: '0' },
                      ]}
                      placeholder="Selecciona la calificación"
                      value={calificacionRequisito}
                      onChange={(value) => setCalificacionRequisito(value || '')}
                    />
                )}
              </Group>
            </Stack>
            {/* Columna derecha: Calificación */}
            <Stack gap="xs" align="flex-end">
              
              <Group>
                {calificacionRequisito != '' && requisitoConCalificacion === requisito.external_id && (
                  <Button
                    color="green"
                    size='xs'
                    variant="light"
                    onClick={() => {
                      guardarCalificacion(requisito.external_id);
                    }}
                    >
                      Guardar cambios
                    </Button>
                )}
              </Group>
            </Stack>
          </Group>


            <Card withBorder mt="md">
              <Group justify="space-between">
                <Text fw={600} fz="h6">Comentarios del Requisito:</Text>
                <Button
                  size="xs"
                  variant="light"
                  onClick={() => toggleComentarios(requisito.external_id)}
                >
                  {requisitoConComentariosAbiertos === requisito.external_id ? 'Ocultar comentarios' : 'Ver comentarios'}
                </Button>
              </Group>

              {requisitoConComentariosAbiertos === requisito.external_id && (
                <Stack mt="sm">
                  {comentarios[requisito.external_id]?.length > 0 ? (
                    comentarios[requisito.external_id].map((comentario: { id: string | number | bigint | ((prevState: number | null) => number | null) | null | undefined; usuario: { nombre: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; apellido: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; cuenta: { Rol: { tipo: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }; }; grupo: { nombre: any; }; }; fecha: string | number | Date; descripcion: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; usuarioId: number; respuestas: any[]; }) => (
                      <Card key={String(comentario.id)} withBorder padding="sm" mt="xs">
                        <Group align="flex-start">
                        
                          <Stack gap={0} ml={8}>
                            <Text size="sm" fw={600}>
                              {comentario.usuario.nombre} {comentario.usuario.apellido} {' '}
                              {comentario.usuario.cuenta.Rol?.tipo && (
                                <Text span c={getColorByRol(comentario.usuario.cuenta.Rol.tipo)}>
                                  · {comentario.usuario.cuenta.Rol.tipo}
                                </Text>
                              )}
                              {comentario.usuario.grupo?.nombre && ` · ${comentario.usuario.grupo.nombre}`}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {new Date(comentario.fecha).toLocaleString('es-EC')}
                            </Text>
                            {comentarioEditando === comentario.id ? (
                              <Stack>
                                <Textarea
                                  size="sm"
                                  autosize
                                  value={textoEditado}
                                  onChange={(e) => setTextoEditado(e.currentTarget.value)}
                                />
                                <Group gap="xs">
                                  <Button
                                    size="xs"
                                    variant="outline"
                                    color="green"
                                    onClick={() =>
                                      editarComentario(comentario.id, requisito.external_id, get('usuario_id'))
                                    }
                                  >
                                    Guardar cambios
                                  </Button>
                                  <Button
                                    size="xs"
                                    variant="outline"
                                    color="red"
                                    onClick={() => {
                                      setComentarioEditando(null);
                                      setTextoEditado('');
                                    }}
                                  >
                                    Cancelar
                                  </Button>
                                </Group>
                              </Stack>
                            ) : (
                              <Text size="sm">{comentario.descripcion}</Text>
                            )}
                            {comentario.usuarioId === parseInt(get('usuario_id')) && (
                              <Flex justify="space-between" mt="xs">
                                <Text size="sm" c="dimmed">
                                </Text>
                                <Group gap="xs" style={{ position: 'absolute', top: 10, right: 10 }}>
                                  <Button
                                    size="xs"
                                    variant="outline"
                                    color="yellow"
                                    onClick={() => {
                                      setComentarioEditando(Number(comentario.id));
                                      setTextoEditado(String(comentario.descripcion ?? ''));
                                    }}
                                  >
                                    Editar
                                  </Button>
                                  <Button
                                    size="xs"
                                    variant="outline"
                                    color="red"
                                    onClick={() => eliminarComentario(comentario.id, requisito.external_id, get('usuario_id'))}
                                  >
                                    Eliminar
                                  </Button>
                                </Group>
                              </Flex>
                            )}

                            {/* Respuestas */}
                            {comentario.respuestas?.map((respuesta: { id: string | number | bigint | ((prevState: number | null) => number | null) | null | undefined; usuario: { nombre: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; apellido: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; cuenta: { Rol: { tipo: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }; }; grupo: { nombre: any; }; }; fecha: string | number | Date; descripcion: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; usuarioId: number; }) => (
                              <Card key={String(respuesta.id)} withBorder padding="xs" mt="xs" ml="lg" bg="gray.0">
                                <Group align="center">
                                  <Text size="sm" fw={500}>
                                    {respuesta.usuario?.nombre} {respuesta.usuario?.apellido} {' '}
                                    {respuesta.usuario.cuenta.Rol?.tipo && (
                                      <Text span c={getColorByRol(respuesta.usuario.cuenta.Rol.tipo)}>
                                        · {respuesta.usuario.cuenta.Rol.tipo}
                                      </Text>
                                    )}
                                    {respuesta.usuario.grupo?.nombre && ` · ${respuesta.usuario.grupo.nombre}`}
                                  </Text>
                                  <Text size="xs" c="dimmed">
                                    {new Date(respuesta.fecha).toLocaleString('es-EC')}
                                  </Text>
                                </Group>
                                {respuestaEditandoId === respuesta.id ? (
                                  <Stack mt="xs">
                                    <Textarea
                                      size="sm"
                                      autosize
                                      value={contenidoRespuestaEditando}
                                      onChange={(e) => setContenidoRespuestaEditando(e.currentTarget.value)}
                                    />
                                    <Group gap="xs">
                                      <Button
                                        size="xs"
                                        variant="outline"
                                        color="green"
                                        onClick={() =>
                                          actualizarRespuesta(respuesta.id, contenidoRespuestaEditando, requisito.external_id)
                                        }
                                      >
                                        Guardar
                                      </Button>
                                      <Button
                                        size="xs"
                                        variant="light"
                                        onClick={() => {
                                          setRespuestaEditandoId(null);
                                          setContenidoRespuestaEditando('');
                                        }}
                                      >
                                        Cancelar
                                      </Button>
                                    </Group>
                                  </Stack>
                                ) : (
                                  <Text size="sm" mt="xs">{respuesta.descripcion}</Text>
                                )}

                                {respuesta.usuarioId === parseInt(get('usuario_id')) && (
                                  <Group gap="xs" mt="xs" justify="end">
                                    <Button
                                      size="xs"
                                      variant="outline"
                                      color="yellow"
                                      onClick={() => {
                                        setRespuestaEditandoId(Number(respuesta.id));
                                        setContenidoRespuestaEditando(String(respuesta.descripcion ?? ''));
                                      }}
                                    >
                                      Editar
                                    </Button>
                                    <Button
                                      size="xs"
                                      variant="outline"
                                      color="red"
                                      onClick={() => eliminarRespuesta(respuesta.id, requisito.external_id, get('usuario_id'))}
                                    >
                                      Eliminar
                                    </Button>
                                  </Group>
                                )}

                              </Card>
                            ))}
                            

                            {/* Formulario de respuesta -- LE QUITE -TODO: PREGUNTAR SI SE ENCESITA */}
                            {comentario.usuarioId !== parseInt(get('usuario_id')) && (
                              <>
                                {comentarioRespondiendoId === comentario.id ? (
                                  <Stack mt="xs">
                                    <Textarea
                                      placeholder="Escribe tu respuesta..."
                                      autosize
                                      size="sm"
                                      value={respuestaTexto}
                                      onChange={(e) => setRespuestaTexto(e.currentTarget.value)}
                                    />
                                    <Group gap="xs">
                                      <Button
                                        size="xs"
                                        variant="outline"
                                        color="green"
                                        onClick={() =>
                                          responderComentario(comentario.id, comentario.revisionId, requisito.external_id)
                                        }
                                        disabled={!respuestaTexto.trim()}
                                      >
                                        Comentar
                                      </Button>
                                      <Button
                                        size="xs"
                                        variant="outline"
                                        color="red"
                                        onClick={() => {
                                          setComentarioRespondiendoId(null);
                                          setRespuestaTexto('');
                                        }}
                                      >
                                        Cancelar
                                      </Button>
                                    </Group>
                                  </Stack>
                                ) : (
                                  <Button
                                    size="xs"
                                    variant="subtle"
                                    onClick={() => {
                                      setComentarioRespondiendoId(Number(comentario.id));
                                      setRespuestaTexto('');
                                    }}
                                  >
                                    Responder
                                  </Button>
                                )}
                              </>
                            )}

                          </Stack>
                        </Group>
                      </Card>

                    ))
                  ) : (
                    <Text size="sm" c="dimmed">No hay comentarios aún</Text>
                  )}

                </Stack>
              )}
            </Card>


            {requisito.estado === 'ACEPTADO' && requisito.external_id  && (
              <>
                <Textarea
                  mt={10}
                  placeholder="Hacer un comentario..."
                  value={nuevoComentario[requisito.external_id] || ''}
                  onChange={(e) => {
                    if (!requisito.external_id) return;
                    const val = e.currentTarget?.value || '';
                    setNuevoComentario((prev) => ({
                      ...prev,
                      [requisito.external_id]: val,
                    }));
                  }}
                />
                <Stack  align="center">
                  <Button
                    size="xs"
                    mt="xs"
                    w="900px"
                    onClick={() => {

                      const usuario = get('usuario_id');
                      console.log(usuario);
                      console.log(requisito.detalleRequisito)
                      const revision = requisito?.detalleRequisito?.[0]?.Revision?.[0];

                      if (!usuario) {
                        mensajes("Error", "Usuario no autenticado", "error");
                        return;
                      }
                      // if (revision && revision.fecha) {
                        // const revisionDate = new Date(revision.fecha);
                        // const revisionDay = revisionDate.toISOString().split('T')[0]; // formato YYYY-MM-DD

                        // const hayFechaCoincidente = proyecto?.fechaLimite?.some((flim) => {
                        //   const fechaProyecto = new Date(flim.fechaLimite).toISOString().split('T')[0];
                        //   return fechaProyecto === revisionDay;
                        // });

                        // if (!hayFechaCoincidente) {
                        //   mensajes("Error", "La revisión no coincide con una fecha de revisión activa del proyecto", "error");
                        //   return;
                        // }
                        // const requisitoss = requisito.external_id ? requisito.external : "";
                        handleComentario(requisito.detalleRequisito[0].id, requisito.external_id , usuario);
                      // } else {
                      //   mensajes("Error", "No se encontró una revisión válida", "error");
                      // }
                    }}
                    color="indigo"
                  >
                    Comentar
                  </Button>
                </Stack>
              </>
            )}

          </Card>
        ))
        }
      </Stack >

      {/* Modal Crear/Editar */}
      < Modal
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
        <div style={{ fontSize: "30px", textAlign: "center", fontWeight: "600" }}>
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

            <Textarea
              // label="Descripción"
              autosize
              minRows={6}
              maxRows={12}
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
      </Modal >
    </Container >
  );
};

export default Page;

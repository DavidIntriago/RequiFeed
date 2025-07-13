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
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck, IconDots, IconEdit, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { unstable_startGestureTransition, useEffect, useState } from 'react';
import mensajes from '@/components/Notification/Mensajes';
import React from 'react';
import { useParams } from 'next/navigation';
import MensajeConfirmacion from '@/components/Notification/MensajeConfirmacion';
import { TextEditor } from '@/components';
import { get } from '@/hooks/SessionUtil';
import { version } from 'os';

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
    const [contenidoRespuestaEditando, setContenidoRespuestaEditando] = useState('');

    const [comentarioRespondiendoId, setComentarioRespondiendoId] = useState<number | null>(null);
    const [respuestaTexto, setRespuestaTexto] = useState('');


    const [respuestasLocales, setRespuestasLocales] = useState({});
    const [requisitoConComentariosAbiertos, setRequisitoConComentariosAbiertos] = useState<string | null>(null);

 
    
    const getColorByRol = (rol: any) => {
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
                if (nuevoEstado === "EN_REVISION") {
                    console.log('Enviando a revision :', requisito);

                    const ultimoDetalle = requisito.detalleRequisito[requisito.detalleRequisito.length - 1];

                    console.log('Último detalle del requisito:', ultimoDetalle);

                    const nuevaVersion = (parseFloat(ultimoDetalle.version) + 0.1).toFixed(1);
                    const nuevoDetalle = {
                        ...ultimoDetalle,
                        version: nuevaVersion,
                        fechaCreacion: new Date().toISOString(),
                    };

                    delete nuevoDetalle.id;
                    delete nuevoDetalle.Revision;

                    const nuevoRequisito = {
                        numeroRequisito: requisito.numeroRequisito,
                        tipo: requisito.tipo,
                        proyectoId: requisito.proyectoId,
                        detalleRequisito: [nuevoDetalle],
                    };
                    console.log('Nuevo requisito a enviar:', nuevoRequisito);
                    await post_api(`requisito/detail/${requisito.external_id} `, nuevoDetalle);
                    fetchRequisitos();
                }


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

    const handleTipoFiltroChange = (value: string | null) => {
        setTipoFiltro(value);

        if (value === 'ESTADO') {
            //setOpcionesFiltradas(['NUEVO', 'BORRADOR', 'EN_REVISION', 'OBSERVADO','LISTO', 'ACEPTADO', 'APROBADO']);
            setOpcionesFiltradas(['BORRADOR', 'EN_REVISION', 'LISTO']);
        } else if (value === 'PRIORIDAD') {
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

    const isLider = () => {
        const rol = get("rol")
        if (rol === "LIDER") {
            setEsLider(true);
            console.log("Es lider del proyecto");
        }
        return false;
    };

    const fetchRequisitos = async () => {
        try {
            const { data } = await get_api(`proyecto/${id}`);
            const res = await get_api(`requisito/proyecto/${data.id}`);
            setRequisitos(res.data.requisitos || []);
            console.log('Requisitos obtenidos:', res.data.requisitos);
            setProyecto(data);

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
    const handleFiltro = async () => {
        if (!tipoFiltro || !valorFiltro) {
            mensajes('Advertencia', 'Selecciona un tipo de filtro y un valor', 'warning');
            return;
        }

        const { data } = await get_api(`proyecto/${id}`);
        const res = await get_api(`requisito/proyecto/${data.id}`);

        const requisitosApi = res.data.requisitos;

        const filtrados = requisitosApi.filter((req: any) => {
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
            //nuevaVersion = versionIncrementada;
            estadoDefecto = values.estado;
        }

        const payload = {
            numeroRequisito: values.numeroRequisito,
            tipo: values.tipo,
            estado: estadoDefecto,
            proyectoId: proyecto.id,
            detalleRequisito: [{
                requisitoId: formData?.id || 0,
                nombreRequisito: values.nombreRequisito,
                prioridad: values.prioridad,
                descripcion: values.descripcion,
                version: values.version
            }]
        };

        console.log('Payload a enviar:', payload);

        try {
            console.log('Enviando payload:', payload);
            console.log(formData);
            if (formData?.id) {
                console.log('Actualizando requisito existente:', formData.external_id);
                console.log(payload)
                const res = await patch_api(`requisito/createDetail/${formData.external_id}`, payload);
                await patch_api(`requisito/estado/${formData.external_id}`, { estado: "BORRADOR" });
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
        const ultimoDetalle = requisito.detalleRequisito[requisito.detalleRequisito.length - 1];
        console.log('Último detalle del requisito:', ultimoDetalle);
        form.setValues({
            tipo: requisito.tipo,
            estado: requisito.estado,
            proyectoId: requisito.proyectoId,
            nombreRequisito: ultimoDetalle.nombreRequisito,
            prioridad: ultimoDetalle.prioridad,
            descripcion: ultimoDetalle.descripcion,
            version: ultimoDetalle.version
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
                } catch (error: any) {
                    console.log(error);
                    console.log(error?.response?.data || error.message);
                    mensajes("Error al momento de eliminar", error.response?.data?.customMessage || "No se ha podido eliminar el requisito", "error");
                }
            })
            .catch((error: any) => {
                mensajes("Error al momento de eliminar", error.response?.data?.customMessage || "No se ha podido eliminar el requsito", "error");
                console.error(error);
            });

    }

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

    const handleComentario = async (revisionId: any, external_id: string | number, usuarioId: any) => {
        if (!nuevoComentario[external_id]?.trim()) {
            mensajes("Error", "El comentario no puede estar vacío", "error");
            return;
        }

        if (!usuarioId) {
            mensajes("Error", "No se encontró información del usuario", "error");
            return;
        }

        try {
            const res = await post_api('comentario', {
                usuarioId,
                revisionId,
                descripcion: nuevoComentario[external_id]
            });
            console.log('Usuario ID:', usuarioId, 'Revision ID:', revisionId, 'Comentario:', nuevoComentario[external_id], 'External ID:', external_id);
            console.log('Comentario creado:', res);

            mensajes("Éxito", "Comentario creado correctamente", "success");
            setNuevoComentario(prev => ({ ...prev, [external_id]: '' }));
            cargarComentarios(String(external_id));
            await patch_api(`requisito/estado/${external_id}`, {
                estado: 'OBSERVADO',
            });
            fetchRequisitos();

        } catch (error) {
            mensajes("Error", "Hubo un problema al crear el comentario", "error");
            console.error("Error al crear comentario:", error);
        }

    };

    const responderComentario = async (comentarioId: any, revisionId: any, external_id: any) => {
        if (!respuestaTexto.trim()) return;

        const usuarioId = get('usuario_id');
        if (!usuarioId) {
            mensajes("Error", "Usuario no válido", "error");
            return;
        }

        try {
            await post_api('comentario', {
                usuarioId,
                descripcion: respuestaTexto,
                revisionId,
                comentarioPadreId: comentarioId,
            });

            mensajes("Éxito", "Comentario realizado correctamente", "success");
            setComentarioRespondiendoId(null);
            setRespuestaTexto('');
            cargarComentarios(external_id);
        } catch (err) {
            mensajes("Error", "No se pudo responder el comentario", "error");
            console.error(err);
        }
    };




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


    const toggleComentarios = async (external_id: string) => {
        if (requisitoConComentariosAbiertos === external_id) {
            setRequisitoConComentariosAbiertos(null);
            return;
        }
        setRequisitoConComentariosAbiertos(external_id);

        if (!comentarios[external_id]) {
            await cargarComentarios(external_id);
        }
    };

    const hayRevisionActivaHoy = proyecto?.fechaLimite?.some((flim: { fechaLimite: string | number | Date; }) => {
        const hoy = new Date().toDateString();
        return new Date(flim.fechaLimite).toDateString() === hoy;
    });


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
                            
                        </Flex>
                        <Group>
                            <Text fw={600} fz="h5">{"Estado:"}</Text>

                            {estadoEnEdicion === requisito.id ? (
                                <>
                                    <Select
                                        data={["EN_REVISION", "LISTO", "ACEPTADO"]}
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
                                   
                                </>
                            )}
                        </Group>

                        {(() => {
                            const ultimoDetalle = requisito.detalleRequisito.length > 0
                                ? requisito.detalleRequisito[requisito.detalleRequisito.length - 1]
                                : null;

                            return (
                                <div key={requisito.id}>
                                    <Group>
                                        <Text fw={600} fz="h5">{"Tipo:"}</Text>
                                        <Badge
                                            fz="h6"
                                            color={requisito.tipo === "FUNCIONAL" ? "cyan" : "gray"}
                                            variant="filled"
                                        >
                                            {requisito.tipo}
                                        </Badge>
                                    </Group>

                                    <Group>
                                        <Text fw={600} fz="h6">{"Número de requisito:"}</Text>
                                        <Badge fz="h6" color="green" variant="default">
                                            {requisito.numeroRequisito}
                                        </Badge>
                                    </Group>

                                    <Text fw={600} fz="h5">{"Detalles del requisito:"}</Text>

                                    {ultimoDetalle ? (
                                        <>
                                            <Group>
                                                <Text fw={600} fz="h6">{"Nombre del requisito:"}</Text>
                                                <Text fw={400} fz="h6">{ultimoDetalle.nombreRequisito}</Text>
                                            </Group>
                                            <Group>
                                                <Text fw={600} fz="h6">{"Prioridad:"}</Text>
                                                <Badge
                                                    fz="h6"
                                                    color={
                                                        ultimoDetalle.prioridad === "ALTA"
                                                            ? "red"
                                                            : ultimoDetalle.prioridad === "MEDIA"
                                                                ? "yellow"
                                                                : "green"
                                                    }
                                                    variant="filled"
                                                >
                                                    {ultimoDetalle.prioridad}
                                                </Badge>
                                            </Group>
                                            <Group>
                                                <Text fw={600} fz="h6">{"Descripción:"}</Text>
                                                <Text fw={400} fz="h6">{ultimoDetalle.descripcion}</Text>
                                            </Group>
                                            <Group>
                                                <Text fw={600} fz="h6">{"Versión:"}</Text>
                                                <Text fw={400} fz="h6">{ultimoDetalle.version}</Text>
                                            </Group>
                                        </>
                                    ) : (
                                        <Text fw={400} fz="h6" color="gray">
                                            Sin detalles registrados.
                                        </Text>
                                    )}
                                </div>
                            );
                        })()}
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
                                        comentarios[requisito.external_id].map((comentario: { id: string | number | bigint | ((prevState: number | null) => number | null) | null | undefined; usuario: { nombre: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; apellido: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; cuenta: { Rol: { tipo: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }; }; grupo: { nombre: any; }; }; fecha: string | number | Date; descripcion: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; usuarioId: number; respuestas: any[]; revisionId: any; }) => (
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

                                                        {/* Formulario de respuesta */}
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


                        {requisito.estado === 'LISTO' && requisito.external_id && hayRevisionActivaHoy && (
                            <>
                                <Textarea
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
                                <Button
                                    size="xs"
                                    mt="xs"
                                    onClick={async () => {

                                        const usuario = get('usuario_id');
                                        console.log(usuario);
                                        console.log(requisito.detalleRequisito)
                                        const ultimoDetalle = requisito.detalleRequisito[requisito.detalleRequisito.length - 1];
                                        const revision = ultimoDetalle.Revision?.[0];

                                        if (!usuario) {
                                            mensajes("Error", "Usuario no autenticado", "error");
                                            return;
                                        }
                                        if (revision && revision.fecha) {
                                            const revisionDate = new Date(revision.fecha);
                                            const revisionDay = revisionDate.toISOString().split('T')[0]; // formato YYYY-MM-DD

                                            //const hayFechaCoincidente = proyecto?.fechaLimite?.some((flim) => {
                                            //  const fechaProyecto = new Date(flim.fechaLimite).toISOString().split('T')[0];
                                            //  return fechaProyecto === revisionDay;
                                            //});

                                            //if (!hayFechaCoincidente) {
                                            //  mensajes("Error", "La revisión no coincide con una fecha de revisión activa del proyecto", "error");
                                            //  return;
                                            //}

                                            handleComentario(revision.id, requisito.external_id, usuario);
                                        } else {

                                            console.log(ultimoDetalle);
                                            const resj = await post_api(`detallerequisito/revision/${ultimoDetalle.id}`)
                                            console.log(resj);
                                            handleComentario(resj.data.id, requisito.external_id, usuario);

                                        }
                                    }}
                                    color="indigo"
                                >
                                    Comentar
                                </Button>
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

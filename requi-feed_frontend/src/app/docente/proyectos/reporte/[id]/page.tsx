"use client";

import { useEffect, useState } from "react";
import {
  Container, Card, Title, Group, Stack, Badge, Text, Accordion, Table,
  Button,
  Select
} from "@mantine/core";
import { get_api } from "@/hooks/Conexion";
import { useParams } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import AvanceProyecto from "@/components/AvanceProyecto/AvanceProyecto";
import mensajes from "@/components/Notification/Mensajes";

interface Proyecto {
  id: string;
  nombre: string;
  estado: string;
  descripcion: string;
  grupoId: string;
  fechaLimite?: { tipo: string }[];
}

type Requisito ={
  id: string;
  detalleRequisito: DetalleRequisito[];
  numeroRequisito: number;
  tipo: string;
}

type DetalleRequisito ={
  id: string;
  version: string; 
  nombreRequisito: string;
  prioridad: string;
  descripcion: string;
  fechaCreacion: string;
}


const PantallaRevisarProyectoDocente = () => {
  const idProyecto = useParams().id;
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [requisitos, setRequisitos] = useState<Requisito[]>([]);
  const [requisitosLista, setRequisitosLista] = useState<Requisito[]>([]);
  const [detalleSeleccionado, setDetalleSeleccionado] = useState({});
  const [tipoFiltro, setTipoFiltro] = useState<string | null>(null);
  const [opcionesFiltradas, setOpcionesFiltradas] = useState<string[]>([]);
  const [valorFiltro, setValorFiltro] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequisitos = async () => {
      try {
        const dataProyecto = await get_api(`proyecto/${idProyecto}`);
        setProyecto(dataProyecto.data);
        console.log("Proyecto obtenido:", dataProyecto.data);


        const res = await get_api(`requisito/proyecto/${dataProyecto.data.id}`);
        setRequisitos(res.data.requisitos || []);
        setRequisitosLista(res.data.requisitos || []);
        console.log("Requisitos obtenidos:", res.data.requisitos);
      } catch (err) {
        console.error('Error al obtener requisitos o proyecto', err);
      }
    };

    fetchRequisitos();
  }, [idProyecto]);

  useEffect(() => {
    
  }, [requisitos]);

  const fetchRequisitosLista = async () => {
      try {
        const dataProyecto = await get_api(`proyecto/${idProyecto}`);
        setProyecto(dataProyecto.data);
        console.log("Proyecto obtenido:", dataProyecto.data);


        const res = await get_api(`requisito/proyecto/${dataProyecto.data.id}`);
        setRequisitosLista(res.data.requisitos || []);
        console.log("Requisitos obtenidos:", res.data.requisitos);
      } catch (err) {
        console.error('Error al obtener requisitos o proyecto', err);
      }
    };

  const exportarPDF = () => {
  const doc = new jsPDF();
  let currentY = 20;

  // Encabezado principal
  doc.setFontSize(18);
  doc.text(`Reporte de Requisitos - ${proyecto?.nombre}`, 14, currentY);

  // Encabezado detalle
  doc.setFontSize(12);
  currentY += 10;
  doc.text(`Fecha de creación: ${new Date().toLocaleDateString('es-EC')}`, 14, currentY);
  currentY += 10;
  doc.text(`Proyecto: ${proyecto?.nombre}`, 14, currentY);
  currentY += 10;
  doc.text(`Estado: ${proyecto?.estado}`, 14, currentY);
  currentY += 10;
  doc.text(`Descripción: ${proyecto?.descripcion}`, 14, currentY);
  currentY += 10;
  doc.text(`Grupo: ${proyecto?.grupoId}`, 14, currentY);

  // Espacio antes de la primera tabla
  currentY += 10;

  requisitos.forEach((requisito, index) => {
    const startY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : currentY;

    doc.setFontSize(14);
    doc.text(`Requisito #${requisito.numeroRequisito} - ${requisito.tipo}`, 14, startY);

    const rows = requisito.detalleRequisito.map((detalle) => [
      detalle.version,
      detalle.nombreRequisito,
      detalle.prioridad,
      detalle.descripcion,
      new Date(detalle.fechaCreacion).toLocaleDateString('es-EC'),
    ]);

    autoTable(doc, {
      startY: startY + 5,
      head: [['Versión', 'Nombre', 'Prioridad', 'Descripción', 'Fecha creación']],
      body: rows,
    });

    requisito.detalleRequisito.forEach((detalle) => {
      const revs = detalle.Revision || [];
      if (revs.length > 0) {
        const revRows = revs.map((rev) => [
          rev.tipoRevision,
          new Date(rev.fechaLimite).toLocaleDateString('es-EC'),
        ]);
        autoTable(doc, {
          startY: doc.lastAutoTable.finalY + 2,
          head: [['Tipo de Revisión', 'Fecha Límite']],
          body: revRows,
        });
      }

      // Comentarios con versión
      const comentarios = detalle.Revision?.[0]?.Comentario || [];
      if (comentarios.length > 0) {
        const comRows = comentarios.map((c) => [
          c.descripcion,
          new Date(c.fecha).toLocaleString('es-EC'),
          detalle.version, // 👉 añadimos versión correspondiente
        ]);
        autoTable(doc, {
          startY: doc.lastAutoTable.finalY + 2,
          head: [['Comentario', 'Fecha', 'Versión']],
          body: comRows,
        });
      }
    });
  });

  doc.save(`Reporte-${proyecto?.nombre}.pdf`);
};



  const handleFiltro = async () => {
      if (!tipoFiltro || !valorFiltro) {
        mensajes('Advertencia', 'Selecciona un tipo de filtro y un valor', 'warning');
        return;
      }
  
      const { data } = await get_api(`proyecto/${idProyecto}`);
      const res = await get_api(`requisito/proyecto/${data.id}`);
  
      const requisitosApi = res.data.requisitos;
      const filtrados = requisitosApi.filter((req: any) => {
  
        if (tipoFiltro === 'ESTADO') return req.estado === valorFiltro;
        if (tipoFiltro === 'PRIORIDAD') return req.detalleRequisito[0].prioridad === valorFiltro;
        if (tipoFiltro === 'TIPO') return req.tipo === valorFiltro;
        return true;
      });
  
      setRequisitosLista(filtrados);
    };

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
    const limpiarFiltro = () => {
      setTipoFiltro(null);
      setValorFiltro(null);
      fetchRequisitosLista(); // vuelve a cargar todos
    };

  return (
    <Container size="lg" mt="xl">
      <Card shadow="md" padding="xl" radius="md" withBorder mb="xl">
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
          <Group>
            <Text fw={600} fz="h6">Descipcion:</Text>
            <Badge color="grape" size="lg" variant="dot">
              {proyecto?.descripcion ?? `Proyecto del Grupo ${proyecto?.grupoId}`}
            </Badge>
          </Group>
        </Stack>

      </Card>
      <AvanceProyecto requisitos={requisitos} />


      <Title order={3} mb="md">Reporte de requisitos, versiones y revisiones</Title>
      <Button
        onClick={exportarPDF}
        color="indigo"
        mb="md"
      >
        Descargar reporte de todos los requisitos en PDF
      </Button>
      <Group mb={15}>
              <Text
                // bg="grape"
                // color="white"
                fw={600}
                p="xs"
                // style={{ borderRadius: 4 }}
              > Filtrar búsqueda </Text>
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
              <Button style={{ marginTop: "25px" }} onClick={handleFiltro} color="indigo">
                Filtrar
              </Button>
              <Button style={{ marginTop: "25px" }} onClick={limpiarFiltro} color="red">
                Limpiar filtros
              </Button>
            </Group>
      <Accordion variant="contained" multiple>
        {requisitosLista.map((requisito) => {
          const detalleSeleccionadoId = detalleSeleccionado[requisito.id];
          const detalleActivo = requisito.detalleRequisito.find(d => d.id === detalleSeleccionadoId);

          const ultimoDetalle = requisito.detalleRequisito.length > 0
            ? requisito.detalleRequisito[requisito.detalleRequisito.length - 1]
            : null;

          return (
            <Accordion.Item key={requisito.id} value={`req-${requisito.id}`}>
              <Accordion.Control>
                <Group>
                  <Badge color="cyan" variant="filled">{requisito.tipo}</Badge>
                  <Text fw={600}>{`#${requisito.numeroRequisito}`}</Text>
                  <Text>{ultimoDetalle?.nombreRequisito || "Sin nombre"}</Text>
                  <Badge color="green" variant="light">{`Versión Final: ${ultimoDetalle?.version || "-"}`}</Badge>
                </Group>
              </Accordion.Control>

              <Accordion.Panel>
                <Table withBorder striped highlightOnHover>
                  <thead>
                    <tr>
                      <th>Versión</th>
                      <th>Nombre</th>
                      <th>Prioridad</th>
                      <th>Descripción</th>
                      <th>Fecha creación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requisito.detalleRequisito
                      .sort((a, b) => new Date(a.fechaCreacion) - new Date(b.fechaCreacion))
                      .map((detalle) => (
                        <tr
                          key={detalle.id}
                          style={{
                            backgroundColor: detalle.id === detalleSeleccionadoId ? "#e6f7ff" : undefined,
                            cursor: "pointer"
                          }}
                          onClick={() => {
                            setDetalleSeleccionado((prev) => ({
                              ...prev,
                              [requisito.id]: detalle.id
                            }));
                          }}
                        >
                          <td>{detalle.version}</td>
                          <td>{detalle.nombreRequisito}</td>
                          <td>
                            <Badge
                              color={
                                detalle.prioridad === "ALTA" ? "red"
                                  : detalle.prioridad === "MEDIA" ? "yellow"
                                    : "green"
                              }
                              variant="filled"
                            >
                              {detalle.prioridad}
                            </Badge>
                          </td>
                          <td>{detalle.descripcion}</td>
                          <td>{new Date(detalle.fechaCreacion).toLocaleDateString('es-EC', {
                            year: 'numeric', month: 'short', day: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>

                {detalleActivo && (
                  <Stack mt="md">
                    <Title order={5}>Revisiones de versión {detalleActivo.version}</Title>
                    {detalleActivo.Revision?.length > 0 ? (
                      detalleActivo.Revision.map((rev) => (
                        <Card key={rev.id} withBorder padding="sm">
                          <Group>
                            <Text fw={600}>Tipo:</Text>
                            <Badge color="blue" variant="light">{proyecto?.fechaLimite[0]?.tipo ?? ""}</Badge>
                            <Text fw={600}>Fecha de Revision:</Text>
                            <Text>{new Date(rev.fecha).toLocaleDateString('es-EC')}</Text>
                          </Group>
                        </Card>
                      ))
                    ) : (
                      <Text color="dimmed">Sin revisiones registradas.</Text>
                    )}

                    <Title order={5}>Comentarios</Title>
                    {detalleActivo.Revision?.[0]?.Comentario?.length > 0 ? (
                      detalleActivo.Revision[0].Comentario.map((comentario) => (
                        <Card key={comentario.id} withBorder padding="sm">
                          <Text>{comentario.descripcion}</Text>
                          <Text size="xs" color="dimmed">
                            {new Date(comentario.fecha).toLocaleString('es-EC')}
                          </Text>
                        </Card>
                      ))
                    ) : (
                      <Text color="dimmed">Sin comentarios registrados.</Text>
                    )}
                  </Stack>
                )}
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </Container>
  );
};

export default PantallaRevisarProyectoDocente;

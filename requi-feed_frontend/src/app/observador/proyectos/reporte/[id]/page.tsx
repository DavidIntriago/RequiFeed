"use client";

import { useEffect, useState } from "react";
import {
  Container, Card, Title, Group, Stack, Badge, Text, Accordion, Table,
  Button
} from "@mantine/core";
import { get_api } from "@/hooks/Conexion";
import { useParams } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import AvanceProyecto from "@/components/AvanceProyecto/AvanceProyecto";


const PantallaRevisarProyectoDocente = () => {
  const idProyecto = useParams().id;
  const [proyecto, setProyecto] = useState(null);
  const [requisitos, setRequisitos] = useState([]);
  const [detalleSeleccionado, setDetalleSeleccionado] = useState({});

  useEffect(() => {
    const fetchRequisitos = async () => {
      try {
        const dataProyecto = await get_api(`proyecto/${idProyecto}`);
        setProyecto(dataProyecto.data);
        console.log("Proyecto obtenido:", dataProyecto.data);


        const res = await get_api(`requisito/proyecto/${dataProyecto.data.id}`);
        setRequisitos(res.data.requisitos || []);
        console.log("Requisitos obtenidos:", res.data.requisitos);
      } catch (err) {
        console.error('Error al obtener requisitos o proyecto', err);
      }
    };

    fetchRequisitos();
  }, [idProyecto]);

  const exportarPDF = () => {
  const doc = new jsPDF();
  let currentY = 20;

  // 💠 Encabezado principal estilizado
  doc.setFontSize(22);
  doc.setTextColor(0, 102, 204);
  doc.text(`Informe Final de Requisitos`, 14, currentY);

  currentY += 10;
  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.text(`${proyecto?.nombre}`, 14, currentY);

  // Línea separadora
  currentY += 5;
  doc.setDrawColor(0, 102, 204);
  doc.setLineWidth(0.8);
  doc.line(14, currentY, 196, currentY);

  // 🔸 Información de detalle
  currentY += 8;
  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  doc.text(`Fecha de creación: ${new Date().toLocaleDateString('es-EC')}`, 14, currentY);
  currentY += 7;
  doc.text(`Estado: ${proyecto?.estado}`, 14, currentY);
  currentY += 7;
  doc.text(`Descripción: ${proyecto?.descripcion}`, 14, currentY);

  // 👥 Mostrar integrantes
  currentY += 7;
  const integrantes = proyecto?.grupo?.usuarios
    .map((u) => `${u.nombre} ${u.apellido}`)
    .join(', ') || 'Sin integrantes';
  doc.text(`Integrantes:`, 14, currentY);
proyecto?.grupo?.usuarios.forEach((u, i) => {
  currentY += 6;
  doc.text(`- ${u.nombre} ${u.apellido}`, 20, currentY);
});

  // Espacio antes de la tabla
  currentY += 10;

  requisitos.forEach((requisito, index) => {
    const detalleFinal = requisito.detalleRequisito?.slice(-1)[0];

    if (detalleFinal) {
      const startY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 12 : currentY;

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`Requisito #${requisito.numeroRequisito} - ${requisito.tipo}`, 14, startY);

      const rows = [[
        detalleFinal.version,
        detalleFinal.nombreRequisito,
        detalleFinal.prioridad,
        detalleFinal.descripcion,
        new Date(detalleFinal.fechaCreacion).toLocaleDateString('es-EC'),
      ]];

      autoTable(doc, {
        startY: startY + 5,
        headStyles: { fillColor: [0, 102, 204] },
        styles: { fontSize: 10 },
        head: [['Versión', 'Nombre', 'Prioridad', 'Descripción', 'Fecha creación']],
        body: rows,
      });
    }
  });

  doc.save(`InformeFinal-${proyecto?.nombre}.pdf`);
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
        Descargar reporte en PDF
      </Button>
      <Accordion variant="contained" multiple>
        {requisitos.map((requisito) => {
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

"use client";

import { useEffect, useState } from "react";
import { Container, Card, Title, Group, Stack, Badge, Text } from "@mantine/core";
import { get_api } from "@/hooks/Conexion";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";

const PantallaRevisarProyectoDocente = () => {
const idProyecto = useParams().id;
    
  const [proyecto, setProyecto] = useState(null);
  const [requisitos, setRequisitos] = useState([]);

  useEffect(() => {
    const fetchRequisitos = async () => {
      try {
        // Obtiene el proyecto
        const dataProyecto = await get_api(`proyecto/${idProyecto}`);
        setProyecto(dataProyecto.data);

        // Obtiene los requisitos de ese proyecto
        const res = await get_api(`requisito/proyecto/${dataProyecto.data.id}`);
        setRequisitos(res.data.requisitos || []);
        console.log('Requisitos obtenidos (docente):', res.data.requisitos);

      } catch (err) {
        console.error('Error al obtener requisitos o proyecto', err);
      }
    };

    fetchRequisitos();
  }, [idProyecto]);

  return (
    <Container size="md" mt="xl">
      {/* Información general del proyecto */}
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
        </Stack>
      </Card>

      {/* Título */}
      <Title order={3} mb="sm">Todos los requisitos y sus versiones</Title>

      <Stack>
        {requisitos.map((requisito) => (
          <Card
            key={requisito.id}
            withBorder
            shadow="xs"
            radius="md"
            padding="md"
          >
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

            <Text fw={600} fz="h5" mt="md">{"Historial de detalles (versiones):"}</Text>

            {requisito.detalleRequisito.length > 0 ? (
              requisito.detalleRequisito
                .sort((a, b) => new Date(a.fechaCreacion) - new Date(b.fechaCreacion))
                .map((detalle) => (
                  <Card
                    key={detalle.id}
                    withBorder
                    shadow="xs"
                    radius="md"
                    padding="sm"
                    mb="sm"
                  >
                    <Group>
                      <Text fw={600} fz="h6">{"Versión:"}</Text>
                      <Badge fz="h6" color="blue" variant="light">{detalle.version}</Badge>
                    </Group>

                    <Group>
                      <Text fw={600} fz="h6">{"Nombre del requisito:"}</Text>
                      <Text fw={400} fz="h6">{detalle.nombreRequisito}</Text>
                    </Group>

                    <Group>
                      <Text fw={600} fz="h6">{"Prioridad:"}</Text>
                      <Badge
                        fz="h6"
                        color={
                          detalle.prioridad === "ALTA"
                            ? "red"
                            : detalle.prioridad === "MEDIA"
                              ? "yellow"
                              : "green"
                        }
                        variant="filled"
                      >
                        {detalle.prioridad}
                      </Badge>
                    </Group>

                    <Group>
                      <Text fw={600} fz="h6">{"Descripción:"}</Text>
                      <Text fw={400} fz="h6">{detalle.descripcion}</Text>
                    </Group>

                    <Group>
                      <Text fw={600} fz="h6">{"Fecha de creación:"}</Text>
                      <Text fw={400} fz="h6">
                        {new Date(detalle.fechaCreacion).toLocaleDateString('es-EC', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </Group>
                  </Card>
                ))
            ) : (
              <Text fw={400} fz="h6" color="gray">
                Sin detalles registrados.
              </Text>
            )}
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default PantallaRevisarProyectoDocente;

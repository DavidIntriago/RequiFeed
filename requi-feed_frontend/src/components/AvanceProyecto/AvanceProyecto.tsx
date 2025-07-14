"use client";

import { Progress, Text, Stack } from "@mantine/core";

interface Requisito {
  estado: string;
}

interface AvanceProyectoProps {
  requisitos: Requisito[];
}

const AvanceProyecto = ({ requisitos }: AvanceProyectoProps) => {
  const calcularProgreso = () => {
    const puntajePorEstado: { [key: string]: number } = {
      NUEVO: 1,
      BORRADOR: 1,
      EN_REVISION: 2,
      OBSERVADO: 3,
      LISTO: 4,
      ACEPTADO: 5,
      APROBADO: 5,
    };

    const puntajeMaximo = requisitos.length * 5;
    const puntajeActual = requisitos.reduce((total, req) => {
      return total + (puntajePorEstado[req.estado] || 1);
    }, 0);

    const porcentaje = puntajeMaximo === 0 ? 0 : (puntajeActual / puntajeMaximo) * 100;
    return porcentaje.toFixed(2);
  };

  const porcentaje = calcularProgreso();

  return (
    <Stack mb="md">
      <Text fw={600} fz="h6">Total de requisitos: {requisitos.length} </Text>
      <Progress
        value={parseFloat(porcentaje)}
        size="lg"
        color={
          parseFloat(porcentaje) < 30 ? "red" :
          parseFloat(porcentaje) < 70 ? "yellow" : "teal"
        }
      />
      <Text ta="center" fw={600}>
        {`${porcentaje}%`}
      </Text>
    </Stack>
  );
};

export default AvanceProyecto;

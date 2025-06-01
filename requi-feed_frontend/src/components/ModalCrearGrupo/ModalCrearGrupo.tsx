'use client';

import { useEffect, useState } from 'react';
import {
  Modal,
  Button,
  Stack,
  Text,
  Group,
  Avatar,
  ScrollArea,
  Divider,
  NumberInput,
  Checkbox,
} from '@mantine/core';
import { get_api, patch_api, post_api } from '@/hooks/Conexion';
import mensajes from '../Notification/Mensajes';
import MensajeConfirmacion from '../Notification/MensajeConfirmacion';

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  cuenta?: {
    email: string;
  };
}

type ModalCrearGrupoProps = {
  opened: boolean;
  onClose: () => void;
  grupo?: {
    external_id: string;
    nombre: string;
    usuarios: Usuario[];
  };
};

const ModalCrearGrupo = ({ opened, onClose, grupo }: ModalCrearGrupoProps) => {
  // --- Estados principales ---
  const [usuariosGrupo, setUsuariosGrupo] = useState<Usuario[]>([]);
  const [usuariosDisponibles, setUsuariosDisponibles] = useState<Usuario[]>([]);
  const [periodoActual, setPeriodoActual] = useState<number | null>(null);
  const [modalAleatorioAbierto, setModalAleatorioAbierto] = useState(false);
  const [numeroGrupos, setNumeroGrupos] = useState(2);

  const [nombre, setNombre] = useState<string>('');
  const [usuariosSeleccionados, setUsuariosSeleccionados] = useState<number[]>([]);

  const esEdicion = Boolean(grupo);

  // --------------------------------------------------------------------
  // 1) useEffect de inicialización: cuando se abra el modal O cambie el prop grupo
  // --------------------------------------------------------------------
  useEffect(() => {
    if (!opened) return;

    const fetchData = async () => {
      try {
        const resPeriodo = await get_api('periodoacademico/actual');
        if (resPeriodo.data?.id) {
          setPeriodoActual(resPeriodo.data.id);
        }

        const resSinGrupo = await get_api('usuario/igrupo');
        const todosDisponibles: Usuario[] = resSinGrupo.data || [];

        if (esEdicion && grupo) {
          const usuariosEnGrupo: Usuario[] = grupo.usuarios || [];
          const idsEnGrupo = new Set(usuariosEnGrupo.map((u) => u.id));
          const disponiblesFiltrados = todosDisponibles.filter(
            (u) => !idsEnGrupo.has(u.id)
          );

          setNombre(grupo.nombre);
          setUsuariosGrupo(usuariosEnGrupo);
          setUsuariosDisponibles(disponiblesFiltrados);
        } else {
          setNombre('');
          setUsuariosGrupo([]);
          setUsuariosDisponibles(todosDisponibles);
          setUsuariosSeleccionados([]);
        }
      } catch (err) {
        console.error('Error cargando datos en ModalCrearGrupo:', err);
      }
    };

    fetchData();
  }, [opened, grupo]);

  // --------------------------------------------------------------------
  // 2) Función para CAMBIAR el “checked” en modo CREACIÓN
  // --------------------------------------------------------------------
  const toggleSeleccion = (id: number) => {
    setUsuariosSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  // --------------------------------------------------------------------
  // 3) Función PARA AÑADIR un usuario al grupo (modo EDICIÓN)
  // --------------------------------------------------------------------
  const añadirAlGrupo = async (usuario: Usuario) => {
    try {
      MensajeConfirmacion(
        `¿Estás seguro de añadir a ${usuario.nombre} ${usuario.apellido} al grupo?`,
        'Añadir usuario',
        'success'
      );

      await patch_api(`grupo/addUser/${grupo!.external_id}`, {
        idUsuario: usuario.id,
      });
      mensajes('Usuario añadido al grupo');

      setUsuariosDisponibles((prev) =>
        prev.filter((u) => u.id !== usuario.id)
      );
      setUsuariosGrupo((prev) => [...prev, usuario]);
    } catch {
      mensajes('Operación cancelada');
    }
  };

  // --------------------------------------------------------------------
  // 4) Función PARA ELIMINAR un usuario del grupo (modo EDICIÓN)
  // --------------------------------------------------------------------
  const eliminarDelGrupo = async (usuario: Usuario) => {
    try {
      MensajeConfirmacion(
        `¿Estás seguro de eliminar a ${usuario.nombre} ${usuario.apellido} del grupo?`,
        'Eliminar usuario',
        'warning'
      );

      await patch_api(`grupo/deleteUser/${grupo!.external_id}`, {
        idUsuario: usuario.id,
      });
      setUsuariosDisponibles((prev) => [...prev, usuario]);
      setUsuariosGrupo((prev) => prev.filter((u) => u.id !== usuario.id));
      await mensajes('Usuario eliminado del grupo');
      mensajes('Usuario eliminado del grupo');


    } catch {
      mensajes('Operación cancelada');
    }
  };

  // --------------------------------------------------------------------
  // 5) Función para CREAR un grupo NUEVO (modo CREACIÓN)
  // --------------------------------------------------------------------
  const handleCrearGrupo = async () => {
    if (!nombre.trim() || usuariosSeleccionados.length === 0) {
      alert('Debes ingresar un nombre y seleccionar al menos un usuario.');
      return;
    }

    try {
      await MensajeConfirmacion(
        '¿Estás seguro de crear el grupo con los usuarios seleccionados?',
        'Crear grupo',
        'success'
      );

      // Petición POST para crear el grupo
      await post_api('grupo', {
        nombre: nombre.trim(),
        idPeriodoAcademico: periodoActual,
        usuarios: usuariosSeleccionados,
      });
      mensajes('Grupo creado correctamente');
      onClose();
    } catch {
      mensajes('Operación cancelada');
    }
  };

  // --------------------------------------------------------------------
  // 6) Función para CREAR GRUPOS ALEATORIOS (tanto en edición como en creación)
  // --------------------------------------------------------------------
  const handleCrearAleatorio = async () => {
    if (numeroGrupos < 1) {
      alert('Debe ingresar un número válido de grupos');
      return;
    }

    try {
      await post_api('grupo/random', {
        nombre: nombre.trim(),
        cantidadGrupos: numeroGrupos,
        idPeriodoAcademico: periodoActual,
      });
      mensajes('Grupos aleatorios creados exitosamente');
      setModalAleatorioAbierto(false);
      onClose();
    } catch (err) {
      console.error('Error al crear grupos aleatorios:', err);
      alert('Error al crear grupos aleatorios');
    }
  };

  const handleUpdateNameGrupo = async () => {
    if (!grupo || !nombre.trim()) return;
      MensajeConfirmacion(
        `¿Estás seguro de actualizar el nombre del grupo a "${nombre.trim()}"?`,
        'Actualizar nombre',
        'success'
      ).then(async () => {
 const res= await patch_api(`grupo/${grupo.external_id}`, { nombre: nombre.trim() });
     console.log('Grupo actualizado:', res);
      mensajes("Actualizado", "Nombre del grupo actualizado correctamente", "success");
      onClose();      });
     
    
  }

  // --------------------------------------------------------------------
  // 7) Renderizado
  // --------------------------------------------------------------------
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={esEdicion ? 'Editar grupo' : 'Crear nuevo grupo'}
      size="lg"
      centered
    >
      <ScrollArea h={400}>
        <Stack>
          {esEdicion ? (
            <>
              {/* ======== MODO EDICIÓN ======== */}
              <Text fw={600}>Usuarios en el grupo:</Text>
              {usuariosGrupo.length > 0 ? (
                usuariosGrupo.map((usuario) => (
                  <Group key={usuario.id} justify="space-between">
                    <Group>
                      <Avatar color="cyan" radius="xl">
                        {usuario.nombre[0]}
                      </Avatar>
                      <div>
                        <Text fw={500}>
                          {usuario.nombre} {usuario.apellido}
                        </Text>
                        <Text c="dimmed" size="xs">
                          {usuario.cuenta?.email}
                        </Text>
                      </div>
                    </Group>
                    <Button
                      color="red"
                      size="xs"
                      onClick={() => eliminarDelGrupo(usuario)}
                    >
                      Eliminar
                    </Button>
                  </Group>
                ))
              ) : (
                <Text c="dimmed">No hay usuarios en el grupo</Text>
              )}

              <Divider my="sm" />

              <Text fw={600}>Usuarios disponibles:</Text>
              {usuariosDisponibles.length > 0 ? (
                usuariosDisponibles.map((usuario) => (
                  <Group key={usuario.id} justify="space-between">
                    <Group>
                      <Avatar color="gray" radius="xl">
                        {usuario.nombre[0]}
                      </Avatar>
                      <div>
                        <Text fw={500}>
                          {usuario.nombre} {usuario.apellido}
                        </Text>
                        <Text c="dimmed" size="xs">
                          {usuario.cuenta?.email}
                        </Text>
                      </div>
                    </Group>
                    <Button
                      color="blue"
                      size="xs"
                      onClick={() => añadirAlGrupo(usuario)}
                    >
                      Añadir
                    </Button>
                  </Group>
                ))
              ) : (
                <Text c="dimmed">No hay usuarios disponibles</Text>
              )}
            </>
          ) : (
            <>
              {/* ======== MODO CREACIÓN ======== */}
              <Text fw={600}>Selecciona los usuarios para el nuevo grupo:</Text>
              {usuariosDisponibles.length > 0 ? (
                usuariosDisponibles.map((usuario) => (
                  <Checkbox
                    key={usuario.id}
                    label={`${usuario.nombre} ${usuario.apellido} (${usuario.cuenta?.email})`}
                    checked={usuariosSeleccionados.includes(usuario.id)}
                    onChange={() => toggleSeleccion(usuario.id)}
                  />
                ))
              ) : (
                <Text c="dimmed">No hay usuarios disponibles</Text>
              )}
            </>
          )}
        </Stack>
      </ScrollArea>

      <Text mt="sm" mb="xs">
        Nombre del grupo:
      </Text>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Ingrese un nombre para el grupo"
        style={{
          padding: '8px',
          width: '100%',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />

      <Divider my="md" />

      <Group justify="flex-end">
        {/* Botón de “Crear Aleatorio” siempre visible */}
        {esEdicion ? (
          <Button
            variant="light"
            color="gray"
            onClick={handleUpdateNameGrupo}
            disabled={!nombre.trim()}
          >
            Actualizar
          </Button>
        ) : (
          <Button
            variant="light"
            color="gray"
            onClick={() => setModalAleatorioAbierto(true)}
          >
            Crear aleatorio
          </Button>
        )}
        

        {esEdicion ? (
          // En edición no cambiamos “Guardar grupo” porque el backend ya modificó
          <Button onClick={onClose}>Cerrar</Button>
        ) : (
          // En creación se activa sólo si hay al menos un usuario y nombre no vacío
          <Button
            onClick={handleCrearGrupo}
            disabled={!nombre.trim() || usuariosSeleccionados.length === 0}
          >
            Crear grupo
          </Button>
        )}
      </Group>

      {/* Modal interno para “Crear Aleatorio” */}
      <Modal
        opened={modalAleatorioAbierto}
        onClose={() => setModalAleatorioAbierto(false)}
        title="Crear grupos aleatorios"
        centered
      >
        <Text mb="sm">Número total de grupos:</Text>
        <NumberInput
          min={1}
          value={numeroGrupos}
          onChange={(value) => setNumeroGrupos(Number(value))}
        />
        <Group justify="flex-end" mt="md">
          <Button onClick={handleCrearAleatorio}>Crear</Button>
        </Group>
      </Modal>
    </Modal>
  );
};

export default ModalCrearGrupo;

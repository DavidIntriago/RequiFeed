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
  Select,
  TextInput,
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

interface Periodo {
  id: number;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  modalidad: string;
}


type ModalCrearGrupoProps = {
  opened: boolean;
  onClose: () => void;
  grupo?: {
    external_id: string;
    nombre: string;
    usuarios: Usuario[];
  };
  onSuccess: () => void;
};

const ModalCrearGrupo = ({ opened, onClose, grupo, onSuccess }: ModalCrearGrupoProps) => {
  const [usuariosGrupo, setUsuariosGrupo] = useState<Usuario[]>([]);
  const [usuariosDisponibles, setUsuariosDisponibles] = useState<Usuario[]>([]);
  const [periodoActual, setPeriodoActual] = useState<number | null>(null);
  const [periodosActuales, setPeriodosActuales] = useState<Periodo[]>([]);
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
        console.log('Periodo actual:', resPeriodo.data);
        if (!resPeriodo.data || resPeriodo.data.length === 0) {
          mensajes('Sin Periodos Activos', 'Debe Ingresar primero un periodo academico actual', 'error');
          onClose();
          return;
        }
        setPeriodosActuales(resPeriodo.data);


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
          console.log('Usuarios sin grupo:', resSinGrupo.data);
          if (resSinGrupo.data === null || resSinGrupo.data.length === 0) {
            mensajes('Sin Usuarios Disponibles', 'No existen usuarios disponibles, o ya estand entro de un grupo', 'error');
            return;
          }
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
        'warning'
      ).then(async () => {

        await patch_api(`grupo/addUser/${grupo!.external_id}`, {
          idUsuario: usuario.id,
        }).then((res) => {
          setUsuariosDisponibles((prev) =>
            prev.filter((u) => u.id !== usuario.id)
          );
          setUsuariosGrupo((prev) => [...prev, usuario]);
          mensajes("Añadido", "Usuario añadido correctamente", "success");
          onSuccess();
        }
        );

      }
      );

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
      ).then(async () => {

        await patch_api(`grupo/deleteUser/${grupo!.external_id}`, {
          idUsuario: usuario.id,
        });
        setUsuariosDisponibles((prev) => [...prev, usuario]);
        setUsuariosGrupo((prev) => prev.filter((u) => u.id !== usuario.id));
        mensajes("Eliminado", "Usuario eliminado del grupo", "success");
        onSuccess();

      }
      );

    } catch {
      mensajes('Operación cancelada');
    }
  };

  // --------------------------------------------------------------------
  // 5) Función para CREAR un grupo NUEVO (modo CREACIÓN)
  // --------------------------------------------------------------------
  const handleCrearGrupo = async () => {
    if (!nombre.trim() || usuariosSeleccionados.length === 0 || !periodoActual) {
      alert('Debes ingresar un nombre, seleccionar al menos un usuario y un periodo académico.');
      return;
    }

    try {
      await MensajeConfirmacion(
        '¿Estás seguro de crear el grupo con los usuarios seleccionados?',
        'Crear grupo',
        'warning'
      );

      console.log('Creando grupo con:', {
        nombre: nombre.trim(),
        idPeriodoAcademico: periodoActual,
        usuarios: usuariosSeleccionados,
      });

      await post_api('grupo', {
        nombre: nombre.trim(),
        idPeriodoAcademico: periodoActual,
        usuarios: usuariosSeleccionados,
      });

      mensajes('Grupo creado correctamente', 'El grupo se ha creado exitosamente', 'success');
      onClose();
      onSuccess();

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
      //mensajes('Grupos aleatorios creados exitosamente');
      mensajes('Grupos creado correctamente', 'Los grupos se han creado exitosamente', 'success');
      onClose();
      onSuccess();

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
      'warning'
    ).then(async () => {
      const res = await patch_api(`grupo/${grupo.external_id}`, { nombre: nombre.trim() });
      console.log('Grupo actualizado:', res);
      mensajes("Actualizado", "Nombre del grupo actualizado correctamente", "success");
      onClose();
      onSuccess();

    });


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
              <Text fw={600}>Usuarios en el grupo:</Text>
              {usuariosGrupo.length > 0 ? (
                usuariosGrupo.map((usuario) => (
                  <Group key={usuario.id} justify="space-between">
                    <Group>
                      <Avatar color="cyan" radius="xl">{usuario.nombre[0]}</Avatar>
                      <div>
                        <Text fw={500}>{usuario.nombre} {usuario.apellido}</Text>
                        <Text c="dimmed" size="xs">{usuario.cuenta?.email}</Text>
                      </div>
                    </Group>
                    <Button color="red" size="xs" onClick={() => eliminarDelGrupo(usuario)}>
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
                      <Avatar color="gray" radius="xl">{usuario.nombre[0]}</Avatar>
                      <div>
                        <Text fw={500}>{usuario.nombre} {usuario.apellido}</Text>
                        <Text c="dimmed" size="xs">{usuario.cuenta?.email}</Text>
                      </div>
                    </Group>
                    <Button color="blue" size="xs" onClick={async () => añadirAlGrupo(usuario)}>
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

      <Divider my="md" />

      <Stack>
        <Text>Nombre del grupo:</Text>
        <TextInput
          value={nombre}
          onChange={(e) => setNombre(e.currentTarget.value)}
          placeholder="Ingrese un nombre para el grupo"
          required
        />

        <Text mt="sm">Periodo académico actual:</Text>
        <Select
          placeholder="Selecciona un periodo académico"
          value={periodoActual?.toString() ?? ''}
          onChange={(value) => setPeriodoActual(Number(value))}
          data={periodosActuales.map((p) => ({
            label: `${p.nombre} (${p.modalidad})`,
            value: p.id.toString(),
          }))}
          required
        />
      </Stack>

      <Divider my="md" />

      <Group justify="flex-end">
        {esEdicion ? (
          <>
            <Button
              variant="light"
              color="gray"
              onClick={handleUpdateNameGrupo}
              disabled={!nombre.trim()}
            >
              Actualizar
            </Button>
            <Button onClick={onClose}>Cerrar</Button>
          </>
        ) : (
          <>
            <Button
              variant="light"
              color="gray"
              onClick={() => setModalAleatorioAbierto(true)}
              disabled={!nombre.trim() || !periodoActual}
            >
              Crear aleatorio
            </Button>
            <Button
              onClick={() => {
                handleCrearGrupo();
              }}
              disabled={!nombre.trim() || usuariosSeleccionados.length === 0}
            >
              Crear grupo
            </Button>
          </>
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
          max={usuariosDisponibles.length}
          value={numeroGrupos}
          onChange={(value) => setNumeroGrupos(Number(value))}
        />
        <Group justify="flex-end" mt="md">
          <Button onClick={
            () => {
              handleCrearAleatorio();
            }
          }  >Crear</Button>
        </Group>
      </Modal>
    </Modal>

  );
};

export default ModalCrearGrupo;

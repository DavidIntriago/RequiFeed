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
  Checkbox,
  NumberInput,
} from '@mantine/core';
import { get_api, post_api } from '@/hooks/Conexion';
import mensajes from '../Notification/Mensajes';
import MensajeConfirmacion from '../Notification/MensajeConfirmacion';

type ModalCrearGrupoProps = {
  opened: boolean;
  onClose: () => void;
  grupo?: any;
};

const ModalCrearGrupo = ({ opened, onClose, grupo }: ModalCrearGrupoProps) => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [periodoActual, setPeriodoActual] = useState(null);
  const [modalAleatorioAbierto, setModalAleatorioAbierto] = useState(false);
  const [numeroGrupos, setNumeroGrupos] = useState(2);

  useEffect(() => {
    if (grupo) {
      setSelectedUsers(grupo.usuarios.map((u: any) => u.id));
    } else {
      setSelectedUsers([]);
    }
  }, [grupo]);



  useEffect(() => {
    const fetchPeriodoActual = async () => {
      try {
        const res = await get_api('periodoacademico/actual');
        console.log('Periodo actual:', res);
        if (res.data) {
          setPeriodoActual(res.data.id);
        } else {
          console.error('No se encontró el periodo actual');
        }
        
      } catch (err) {
        console.error('Error fetching periodo:', err);
      }
    };

    const fetchUsuarios = async () => {
      try {
        const res = await get_api('usuario/rol');
        const data = res.data || res;
        setUsuarios(data);
      } catch (err) {
        console.error('Error fetching usuarios:', err);
      }
    };

    fetchUsuarios();
    fetchPeriodoActual();
  }, []);

  const toggleUser = (id: number) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleCrearGrupo = () => {
   
    if (selectedUsers.length === 0) {
      alert('Debes seleccionar al menos un usuario.');
      return;
    }

    const usuariosSeleccionados = usuarios.filter((u) =>
      selectedUsers.includes(u.id)
    );

    console.log('Usuarios seleccionados:', usuariosSeleccionados);
    console.log('Periodo actual:', periodoActual);
    MensajeConfirmacion("¿Estás seguro de crear el grupo con los usuarios seleccionados?", "Crear grupo", "success").then(async () => {
      post_api('grupo', {
        idPeriodoAcademico: periodoActual,
        usuarios: usuariosSeleccionados.map((u) => u.id),

     }
    )
      .then((res) => {
        console.log("peridoActual:", periodoActual);
        console.log('Grupo creado:', res);
        
        onClose();
      })
      .catch((err) => {
        console.error('Error al crear grupo:', err);
        alert('Error al crear grupo');
      });

    }
    ).catch((err) => {
      console.error('Error al confirmar creación de grupo:', err);
      alert('Creación de grupo cancelada');
    }
    );

  };


  const handleCrearAleatorio = () => {
    if (numeroGrupos < 1) {
      alert('Debe ingresar un número válido de grupos');
      return;
    }

    post_api('grupo/random', {
      cantidadGrupos: numeroGrupos,
      idPeriodoAcademico: periodoActual,
    }).then((res) => {
        console.log('Grupos aleatorios creados:', res);
        alert('Grupos aleatorios creados exitosamente');
        setModalAleatorioAbierto(false);
        onClose();
      })
      .catch((err) => {
        console.error('Error al crear grupos aleatorios:', err);
        alert('Error al crear grupos aleatorios');
      });
  };


  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Crear nuevo grupo"
      size="lg"
      centered
    >
      <ScrollArea h={400}>
        <Stack>
          {usuarios.length > 0 ? (
            usuarios.map((usuario: any) => (
              <Group key={usuario.id} justify="space-between">
                <Checkbox
                  checked={selectedUsers.includes(usuario.id)}
                  onChange={() => toggleUser(usuario.id)}
                />
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
                <Text size="sm" fw={600}>
                  {usuario.cuenta?.Rol?.tipo}
                </Text>
              </Group>
            ))
          ) : (
            <Text c="dimmed">No hay usuarios disponibles</Text>
          )}
        </Stack>
      </ScrollArea>

      <Divider my="md" />

      <Group justify="flex-end">
        <Button variant="light" color="gray" onClick={() => setModalAleatorioAbierto(true)}>
          Crear aleatorio
        </Button>
        <Button onClick={handleCrearGrupo} disabled={selectedUsers.length === 0}>
          Crear grupo
        </Button>
      </Group>
       <Modal
        opened={modalAleatorioAbierto}
        onClose={() => setModalAleatorioAbierto(false)}
        title="Crear grupos aleatorios"
        centered
      >
        <Text mb="sm">Ingrese el número total de grupos:</Text>
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


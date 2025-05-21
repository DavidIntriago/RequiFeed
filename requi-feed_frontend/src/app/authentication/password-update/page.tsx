'use client';

import React, { useState, useEffect } from 'react';
import {
  Button,
  Group,
  Paper,
  rem,
  Text,
  PasswordInput,
  Title,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import classes from './page.module.css';
import { Surface } from '@/components';
import { post_api } from '@/hooks/Conexion';
import mensajes from '@/components/Notification/Mensajes';
import { PATH_AUTH } from '@/routes';

function Page() {
  const mobile_match = useMediaQuery('(max-width: 425px)');
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();
  

  useEffect(() => {
    if (!token) {
      setMessage({ text: 'Token no válido o faltante en la URL.', error: true });
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage({ text: 'Las contraseñas no coinciden.', error: true });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const data = await post_api('auth/reset-password', {
        token,
        newPassword: password,
      });
      console.log('res', data);


      if (data) {
        setPassword('');
        setConfirmPassword('');
        mensajes('Éxito', data.message || 'Contraseña actualizada correctamente.', 'success');
        push(PATH_AUTH.signin);
      } else {
        mensajes('Error', data.message || 'Error al actualizar la contraseña.', 'error');
      }
    } catch (error) {
      setMessage({ text: 'Error en la conexión con el servidor.', error: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Title ta="center" mb="md">
        Actualiza tu contraseña
      </Title>

      <Surface component={Paper} className={classes.card} withBorder>
        <form onSubmit={handleSubmit}>
          <PasswordInput
            label="Nueva contraseña"
            placeholder="Ingresa tu nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            required
            disabled={!token || loading}
            mb="sm"
          />
          <PasswordInput
            label="Confirma la nueva contraseña"
            placeholder="Confirma tu nueva contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.currentTarget.value)}
            required
            disabled={!token || loading}
            mb="md"
          />

          {message && (
            <Text color={message.error ? 'red' : 'green'} size="sm" mb="md">
              {message.text}
            </Text>
          )}

          <Group mt="md">
            <Button type="submit" loading={loading} disabled={!token}>
              Actualizar contraseña
            </Button>
          </Group>
        </form>
      </Surface>
    </>
  );
}

export default Page;

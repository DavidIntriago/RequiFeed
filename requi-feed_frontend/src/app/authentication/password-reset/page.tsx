'use client';

import {
  Button,
  Group,
  Paper,
  rem,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import React from 'react';
import Link from 'next/link';
import { PATH_AUTH } from '@/routes';
import classes from './page.module.css';
import { Surface } from '@/components';
import { Metadata } from 'next';
import { post_api } from '@/hooks/Conexion';
import mensajes from '@/components/Notification/Mensajes';
import { useRouter } from 'next/navigation';
import { useForm } from '@mantine/form';


function Page() {
  const { push } = useRouter();

  const form = useForm({
    initialValues: { email: '' },
    validate: {
      email: (value) =>
        /^\S+@\S+\.\S+$/.test(value) ? null : 'Correo electrónico inválido',
    },
  });

  const handleResetPassword = async () => {
    const isValid = form.validate();
    if (!isValid.hasErrors) {
      const res = await post_api('auth/recover-password', { email: form.values.email });
      console.log(res);
      if (res.status === 200) {
        mensajes('Valido', res.message, 'success');
        form.reset();
        push(PATH_AUTH.signin);
      } else {
        mensajes('Error', 'Error al enviar el email, verifique el email ingresado', 'error');
      }
    }
  };

  return (
    <>
      <title>Restablecer Contraseña | RequiFeed</title>

      <Title ta="center">¿Olvidó su contraseña?</Title>
      <Text ta="center">Ingrese su email para recuperar su contraseña</Text>

      <Surface component={Paper} className={classes.card}>
        <TextInput
          label="Su email"
          placeholder="me@gmail.com"
          required
          classNames={{ label: classes.label }}
          {...form.getInputProps('email')}
        />

        <Group justify="space-between" mt="lg" className={classes.controls}>
          <UnstyledButton
            component={Link}
            href={PATH_AUTH.signin}
            color="dimmed"
            className={classes.control}
          >
            <Group gap={2} align="center">
              <IconChevronLeft
                stroke={1.5}
                style={{ width: rem(14), height: rem(14) }}
              />
              <Text size="sm" ml={5}>
                Regresar a inicio de sesión
              </Text>
            </Group>
          </UnstyledButton>
          <Button onClick={handleResetPassword}>Restablecer contraseña</Button>
        </Group>
      </Surface>
    </>
  );
}

export default Page;

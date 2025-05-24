'use client';

import {
  Button,
  Center,
  Checkbox,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  TextProps,
  Title,
} from '@mantine/core';
import Link from 'next/link';
import { PATH_AUTH, PATH_DASHBOARD, PATH_DOCENTE, PATH_ESTUDIANTE, PATH_OBSERVADOR } from '@/routes';
import { Surface } from '@/components';
import classes from './page.module.css';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { post_api } from '@/hooks/Conexion';
import { save } from '@/hooks/SessionUtil';
import mensajes from '@/components/Notification/Mensajes';
import { useAuth } from '@/context/AuthContext';

const LINK_PROPS: TextProps = {
  className: classes.link,
};

function Page() {
  const { loginUser } = useAuth();
  const { push } = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Correo inválido'),
      password: (value) =>
        value.length < 5 ? 'La contraseña debe tener al menos 6 caracteres' : null,
    },
  });

  const handleLogin = async () => {
    setErrorMessage('');

    const { email, password } = form.values;
    try {
      const response = await post_api('cuenta/login', {
        email,
        contrasenia: password,
      });

      if (response.data) {
        console.log(response.data)
        loginUser(response.data.usuario, response.data.token, response.data.rol)
        save('token', response.data.token);
        save('external_id', response.data.external_id);
        save('rol', response.data.rol);
        mensajes('Bienvenido', response.data.usuario || 'Inicio de Sesion Exitoso', 'success');
        if(response.data.rol == 'DOCENTE'){
          push(PATH_DOCENTE.default); 
        }
        if(response.data.rol == 'ANALISTA' || response.data.rol == 'LIDER'){
          push(PATH_ESTUDIANTE.default); 

        }
        if(response.data.rol == 'OBSERVADOR'){
          push(PATH_OBSERVADOR.default); 
        }
      } else {
        setErrorMessage(
          response?.error || 'Credenciales incorrectas. Verifica los datos.'
        );
      }
    } catch (error: any) {
      setErrorMessage('Error de conexión o servidor. Intenta más tarde.');
    }
  };

 return (
  <>
    <>
      <title>Sign in | RequiFeed</title>
      <meta
        name="description"
        content="Login page for RequiFeed platform"
      />
    </>
    <Title ta="center">Bienvenido!</Title>
    <Text ta="center">Ingrese con su cuenta para continuar</Text>

    <Surface component={Paper} className={classes.card}>
      <form
        onSubmit={form.onSubmit(() => {
          handleLogin(); 
        })}
      >
        <TextInput
          label="Email"
          placeholder="admin@gmail.com"
          required
          classNames={{ label: classes.label }}
          {...form.getInputProps('email')}
        />
        <PasswordInput
          label="Contraseña"
          placeholder="Contrasenia"
          required
          mt="md"
          classNames={{ label: classes.label }}
          {...form.getInputProps('password')}
        />

        <Group justify="space-between" mt="lg">
          
          <Text
            component={Link}
            href={PATH_AUTH.passwordReset}
            size="sm"
            {...LINK_PROPS}
          >
            Olvidó su contraseña?
          </Text>
        </Group>

        {errorMessage && (
          <Text color="red" mt="sm" size="sm">
            {errorMessage}
          </Text>
        )}

        <Button fullWidth mt="xl" type="submit">
          Ingresar
        </Button>
      </form>

      <Center mt="md">
        <Text
          fz="sm"
          ta="center"
          component={Link}
          href={PATH_AUTH.signup}
          {...LINK_PROPS}
        >
          No tienes una cuenta? Regístrate
        </Text>
      </Center>
    </Surface>
  </>
);
}

export default Page;

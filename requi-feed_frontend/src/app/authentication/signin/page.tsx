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
import { PATH_AUTH, PATH_DASHBOARD } from '@/routes';
import { Surface } from '@/components';
import classes from './page.module.css';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { post_api } from '@/hooks/Conexion';
import { save } from '@/hooks/SessionUtil';


const LINK_PROPS: TextProps = {
  className: classes.link,
};

function Page() {
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
        save('token', response.data.token);
        save('external_id', response.data.external_id);

        push(PATH_DASHBOARD.default); 
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
    <Title ta="center">Welcome back!</Title>
    <Text ta="center">Sign in to your account to continue</Text>

    <Surface component={Paper} className={classes.card}>
      <form
        onSubmit={form.onSubmit(() => {
          handleLogin(); // ✅ Aquí llamas la función que se conecta con el backend
        })}
      >
        <TextInput
          label="Email"
          placeholder="you@mantine.dev"
          required
          classNames={{ label: classes.label }}
          {...form.getInputProps('email')}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          mt="md"
          classNames={{ label: classes.label }}
          {...form.getInputProps('password')}
        />

        <Group justify="space-between" mt="lg">
          <Checkbox
            label="Remember me"
            classNames={{ label: classes.label }}
          />
          <Text
            component={Link}
            href={PATH_AUTH.passwordReset}
            size="sm"
            {...LINK_PROPS}
          >
            Forgot password?
          </Text>
        </Group>

        {/* ✅ Mensaje de error */}
        {errorMessage && (
          <Text color="red" mt="sm" size="sm">
            {errorMessage}
          </Text>
        )}

        <Button fullWidth mt="xl" type="submit">
          Sign in
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
          Do not have an account yet? Create account
        </Text>
      </Center>
    </Surface>
  </>
);
}

export default Page;

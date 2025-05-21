'use client';

import {
  Button,
  Center,
  Flex,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  TextProps,
  Title,
  useMantineTheme,
} from '@mantine/core';
import Link from 'next/link';
import { PATH_AUTH, PATH_DASHBOARD } from '@/routes';
import { useColorScheme, useMediaQuery } from '@mantine/hooks';
import { Metadata } from 'next';
import { Surface } from '@/components';
import classes from './page.module.css';
import { Select } from '@mantine/core';
import { useState } from 'react';
import { post_api } from '@/hooks/Conexion';
import { useRouter } from 'next/navigation';
import mensajes from '@/components/Notification/Mensajes';

function Page() {
 
  const LINK_PROPS: TextProps = {
    className: classes.link,
  };
  const { push } = useRouter();
  const [email, setEmail] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [ocupacion, setOcupacion] = useState("");
  const [area, setArea] = useState("");
  const [foto, setFoto] = useState(null);
  const [confirmContrasenia, setConfirmContrasenia] = useState("");
  
const [errors, setErrors] = useState<Record<string, string>>({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
     const newErrors: Record<string, string> = {};

    if (!nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!apellido.trim()) newErrors.apellido = "El apellido es obligatorio.";
    if (!email.trim() || !emailRegex.test(email))
      newErrors.email = "Correo electrónico no válido.";
    if (!contrasenia.trim() || contrasenia.length < 6)
      newErrors.contrasenia = "La contraseña debe tener al menos 6 caracteres.";
    if (!ocupacion.trim()) newErrors.ocupacion = "La ocupación es obligatoria.";
    if (!area.trim()) newErrors.area = "El área es obligatoria.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    console.log("handleRegister");
    e.preventDefault();
    if (!validateForm())return;
    
    if (contrasenia !== confirmContrasenia) {
      setErrors({ ...errors, contrasenia: "Las contraseñas no coinciden." });
      return;
    }
    console.log("handleRegister2");
    const body = {
      nombre,
      apellido,
      email,
      contrasenia,
      ocupacion,
      area,
    };
    try {
      const response = await post_api('cuenta/registry', body);
      if (response?.error) {
        setErrors({ ...errors, email: response.message });
        mensajes("Error", response.message, "error");
        return;
      }
      mensajes("Registro exitoso", "Usuario registrado correctamente", "success");
      push(PATH_AUTH.signin);
      

    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      setErrors({ ...errors, email: "Error de conexión o servidor. Intenta más tarde." });
      mensajes("Error", "Error de conexión o servidor. Intenta más tarde.", "error");
    }
  }
    



  return (
    <>
      <>
        <title>Registro | RequiFeef</title>
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />
      </>
      <Title ta="center">Bienvenido!</Title>
      <Text ta="center">Cree su cuenta para continuar</Text>

      <Surface component={Paper} className={classes.card}>
        <Flex direction={{ base: 'column', sm: 'row' }} gap={{ base: 'md' }}>
          <TextInput
            label="Nombres"
            placeholder="Ana Maria"
            required
            classNames={{ label: classes.label }}
            onChange={(e) => setNombre(e.target.value)}
            error={errors.nombre}
            
          />
          <TextInput
            label="Apellidos"
            placeholder="Gonzalez Lopez"
            required
            classNames={{ label: classes.label }}
            onChange={(e) => setApellido(e.target.value)}
            error={errors.apellido}
          />
        </Flex>
        <Select
          w="100%"
          mt="md"

          label="Ocupación"
          placeholder="Selecciona una ocupación"
          required
          data={[
            { value: 'estudiante', label: 'Estudiante' },
            { value: 'docente', label: 'Docente' },
            { value: 'otro', label: 'Otro' },
          ]}
          value={ocupacion}
          classNames={{ label: classes.label }}
          onChange={(value) => setOcupacion(value)}
          error={errors.ocupacion}
        />
        <Select
          w="100%"
          mt="md"
          label="Area de trabajo"
          placeholder="Seleccione una area de trabajo"
          required
          data={[
            { value: 'computacion', label: 'Computación' },
            { value: 'administrativa', label: 'Administrativa' },
            { value: 'investigativa', label: 'Investigativa' },
            { value: 'otro', label: 'Otro' },

          ]}
          value={area}
          classNames={{ label: classes.label }}
          onChange={(value) => setArea(value)}
          error={errors.area}
/>


        <TextInput
          label="Email"
          placeholder="you@mantine.dev"
          required
          mt="md"
          classNames={{ label: classes.label }}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <PasswordInput
          label="Contraseña"
          placeholder="Contraseña"
          required
          mt="md"
          classNames={{ label: classes.label }}
          onChange={(e) => setContrasenia(e.target.value)}
          error={errors.contrasenia}
        />
        <PasswordInput
          label="Confirmar contraseña"
          placeholder="Contraseña"
          required
          mt="md"
          classNames={{ label: classes.label }}
          onChange={(e) => setConfirmContrasenia(e.target.value)}
          error={contrasenia !== confirmContrasenia ? "Las contraseñas no coinciden." : ""}
        />
        <Button
          onClick={handleRegister}
          fullWidth
          mt="xl"        >
          Crear Cuenta
        </Button>
        <Center mt="md">
          <Text
            size="sm"
            component={Link}
            href={PATH_AUTH.signin}
            {...LINK_PROPS}
          >
            Ya tienes una cuenta? Inicia sesión
          </Text>
        </Center>
      </Surface>
    </>
  );
}

export default Page;

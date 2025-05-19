'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Anchor,
  Box,
  Button,
  Container,
  FileButton,
  Flex,
  Grid,
  Group,
  Image,
  Paper,
  PaperProps,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { PATH_DASHBOARD } from '@/routes';
import { useForm } from '@mantine/form';
import { IconCloudUpload, IconDeviceFloppy } from '@tabler/icons-react';
import { PageHeader, Surface, TextEditor } from '@/components';
import { useParams, useRouter } from 'next/navigation';
import { get_api } from '@/hooks/Conexion';
import { get } from '@/hooks/SessionUtil';
import mensajes from '@/components/Notification/Mensajes';

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Apps', href: '#' },
  { title: 'Settings', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

const ICON_SIZE = 16;

const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
  style: { height: '100%' },
};

const BIO =
  'A dynamic software engineering graduate from Nairobi, Kenya with 5+ years of experience. Passionate about turning creative sparks into seamless applications through technological experimentation. Experienced in crafting intuitive solutions and translating innovative concepts into user-friendly applications. Thrives on transforming the way we experience technology, one line of code at a time.\n' +
  '\n' +
  'Enthusiastic pioneer, constantly seeking the next big thing in tech. Eager to apply my passion and skills at Alternate Limited to bring ideas to life.';

  interface UserProfile {
    nombre: string;
    apellido: string;
    foto: string;
    email: string;
    estado: string;
    cargo: string;
    area: string;
  }

  interface ChangePassword {
    contrasenia: string;
    contrasenia2: string;
  }
function transformToUserProfile(data: any): UserProfile {
  return {
    nombre: data.usuario?.nombre || '',
    apellido: data.usuario?.apellido || '',
    foto: data.usuario?.foto || '',
    email: data.email || '',
    estado: data.estado || '',
    cargo: data.usuario?.cargo || '',
    area: data.usuario?.area || '',
  };
}

function Settings() {
  const [file, setFile] = useState<File | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [changePassword, setChangePassword] = useState<ChangePassword | null>(null);
  const { id } = useParams();
  const token = get('token');
  const router = useRouter();
  const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        foto: "",
        email: "",
        cargo: "",
        area: "",
  });
  const [formDataChangePassword, setFormDataChangePassword] = useState({
        contrasenia: "",
        contrasenia2: "",
  });
  const [errors, setErrors] = useState({
        nombre: "",
        apellido: "",
        foto: "",
        email: "",
        cargo: "",
        area: "",
    });
  const [errorChangePassword, setErrorChangePassword] = useState({
        contrasenia: "",
        contrasenia2: "",
  });

  const handleBlur = (event:any) => {
        const { name, value } = event.target;

        // Validación básica de campos requeridos
        switch (name) {
            case "nombre":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    nombre: value ? "" : "El nombre es requerido",
                }));
                break;
            case "apellido":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    apellido: value ? "" : "El apellido es requerido",
                }));
                break;

            case "foto":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    foto: value ? "" : "La foto es requerida",
                }));
                break;

            case "email":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    email: value ? "" : "El email es requerido",
                }));
                break;

            case "cargo":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    cargo: value ? "" : "El cargo es requerido",
                }));
                break;

            case "area":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    area: value ? "" : "La area es requerida",
                }));
                break;

            default:
                break;
        }
    };
    const handleBlurChangePassword = (event:any) => {
        const { name, value } = event.target;
        // Validación básica de campos requeridos
        switch (name) {
            case "contrasenia":
                setErrorChangePassword((prevErrors) => ({
                    ...prevErrors,
                    contrasenia: value ? "" : "La contraseña es requerida",
                }));
                break;
            case "contrasenia2":
                setErrorChangePassword((prevErrors) => ({
                    ...prevErrors,
                    contrasenia2: value ? "" : "La contraseña es requerida",
                }));
                break;

            default:
                break;
        }
    }
    const handleSubmit = async (event:any) => {
        try {
            event.preventDefault();
            console.log(token);
            // Validar todos los campos antes de enviar
            handleBlur({ target: { name: "nombre", value: formData.nombre } });
            handleBlur({ target: { name: "apellido", value: formData.apellido } });
            handleBlur({ target: { name: "foto", value: formData.foto } });
            handleBlur({ target: { name: "email", value: formData.email } });
            handleBlur({ target: { name: "cargo", value: formData.cargo } });
            handleBlur({ target: { name: "area", value: formData.area } });
            console.log('FormData');
            console.log(formData);

            const errorMessages = Object.entries(errors)
                .filter(([field, error]) => error)
                .map(([field, error]) => `${error}`)
                .join("\n");


            console.log({ errors })

            // Si hay errores, no enviar el formulario
            if (Object.values(errors).some((error) => error !== "" && error !== undefined)) {
                
                mensajes("Error al actualizar la estación de monitoreo", errorMessages || "No se ha podido actualizar la estación de monitoreo", "error");
                return;
            }
            // console.log('Dentro de formData');
            // console.log(formData.nomenclature);
            // console.log(token);
            // await updateMonitoringStation(id, formData, token);

            mensajes("Estación de monitoreo actualizada exitosamente.", "Éxito");
            router.push("/apps/profile");
        } catch (error:any) {
            console.log(error);

            mensajes("Error al actualizar la estación de monitoreo", error.response?.data?.customMessage || "No se ha podido actualizar la estación de monitoreo", "error");
        }
    };
  // const markerRef = useRef();

  const getUserInformation = async () => {
    try {
      if ( token != null && typeof id == 'string' ){
        const {data} = await get_api(`cuenta/${id}`);
        const userProfile = transformToUserProfile(data);
        console.log(data);
        setProfile(userProfile);

        setFormData({
          nombre: userProfile.nombre,
          apellido: userProfile.apellido,
          foto: userProfile.foto,
          email: userProfile.email,
          cargo: userProfile.cargo,
          area: userProfile.area,
        });
      }            
      } catch (error:any) {
        mensajes("Error", error.response?.data?.customMessage || "No se ha podido obtener el usuario", "error");
      }
    }
  useEffect(() => {
    getUserInformation();
        // setResearchers(mockResearchers);
  }, []);
      
  const handleChange = (event : any) => {
    const { name, value } = event.target;
  
    if (name == "nombre") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        nombre: value,
      }));
    } else {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
        // alert(formData)
    }
  };
  const hadleChangePassword = (event : any) => {
    const { name, value } = event.target;
    setFormDataChangePassword((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  
  return (
    <>
      <>
        <title>Settings | DesignSparx</title>
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Settings" breadcrumbItems={items} />
          <Grid>
            <Grid.Col span={{ base: 12, md: 12 }}>
              <Surface component={Paper} {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Información del perfil
                </Text>
                <Grid gutter={{ base: 5, xs: 'md', md: 'md', lg: 'lg' }}>
                  <Grid.Col span={{ base: 12, md: 6, lg: 9, xl: 9 }}>
                    <Stack>
                      <Group grow>
                        <TextInput
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={!!errors.nombre}
                          required
                          id="nombre"
                          label="Nombre"
                          placeholder="Nombre"
                          name="nombre"
                          value={formData.nombre}
                          autoFocus
                          autoComplete="family-name"
                          // {...accountInfoForm.getInputProps('firstname')}
                        />
                        <TextInput
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={!!errors.apellido}
                          label="Apellido"
                          placeholder="apellido"
                          name="apellido"
                          value={formData.apellido}
                          autoFocus
                          autoComplete="family-name"
                        />
                      </Group>
                      <Group grow>
                        <TextInput
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={!!errors.email}
                          required
                          id="email"
                          label="Email"
                          placeholder="Email"
                          name="email"
                          value={formData.email}
                          autoFocus
                          autoComplete="family-name"
                        />
                        <TextInput
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={!!errors.cargo}
                          label="Cargo"
                          placeholder="Cargo"
                          name="cargo"
                          value={formData.cargo}
                          autoFocus
                          autoComplete="family-name"
                        />
                      </Group>
                      <Group grow>
                        <TextInput
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={!!errors.area}
                          required
                          id="area"
                          label="Area"
                          placeholder="Area"
                          name="area"
                          value={formData.area}
                          autoFocus
                          autoComplete="family-name"
                        />
                      </Group>
                      <Button
                        style={{ width: 'fit-content' }}
                        leftSection={<IconDeviceFloppy size={ICON_SIZE} />}
                      >
                        Save Changes
                      </Button>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6, lg: 3, xl: 3 }}>
                    <Stack align="center">
                      <Image
                        src="https://res.cloudinary.com/ddh7hfzso/image/upload/v1700303804/me/ovqjhhs79u3g2fwbl2dd.jpg"
                        h={128}
                        w={128}
                        radius="50%"
                      />
                      <FileButton
                        onChange={setFile}
                        accept="image/png,image/jpeg"
                      >
                        {(props) => (
                          <Button
                            {...props}
                            variant="subtle"
                            leftSection={<IconCloudUpload size={ICON_SIZE} />}
                          >
                            Upload image
                          </Button>
                        )}
                      </FileButton>
                      <Text ta="center" size="xs" c="dimmed">
                        For best results, use an image at least 128px by 128px
                        in .jpg format
                      </Text>
                    </Stack>
                  </Grid.Col>
                </Grid>
              </Surface>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12 }}>
              <Surface component={Paper} {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Cambiar contraseña
                </Text>
                <Grid gutter={{ base: 5, xs: 'md', md: 'md', lg: 'lg' }}>
                  <Grid.Col span={{ base: 12, md: 6, lg: 9, xl: 9 }}>
                    <Stack>
                      {/* <Group grow> */}
                        <TextInput
                          onBlur={handleBlurChangePassword}
                          onChange={hadleChangePassword}
                          error={!!errorChangePassword.contrasenia}
                          required
                          id="contrasenia"
                          label="Nueva contraseña"
                          placeholder="Nueva contraseña"
                          name="contrasenia"
                          value={formDataChangePassword.contrasenia}
                          autoFocus
                          autoComplete="family-name"
                          // {...accountInfoForm.getInputProps('firstname')}
                        />
                        <TextInput
                          onBlur={handleBlurChangePassword}
                          onChange={hadleChangePassword}
                          error={!!errorChangePassword.contrasenia2}
                          label="Escriba nuevamente la contraseña"
                          placeholder="Escriba nuevamente la contraseña"
                          name="contrasenia2"
                          value={formDataChangePassword.contrasenia2}
                          autoFocus
                          autoComplete="family-name"
                        />
                      {/* </Group> */}
                      
                      <Button
                        style={{ width: 'fit-content' }}
                        leftSection={<IconDeviceFloppy size={ICON_SIZE} />}
                      >
                        Save Changes
                      </Button>
                    </Stack>
                  </Grid.Col>
                </Grid>
              </Surface>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </>
  );
}

export default Settings;

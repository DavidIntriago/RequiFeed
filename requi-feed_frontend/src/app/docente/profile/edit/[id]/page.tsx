'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Anchor,
  Avatar,
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
  PasswordInput,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { PATH_DASHBOARD, PATH_DOCENTE } from '@/routes';
import { IconCloudUpload, IconDeviceFloppy } from '@tabler/icons-react';
import { PageHeader, Surface } from '@/components';
import { useParams, useRouter } from 'next/navigation';
import { get_api, patch_api, post_api, post_api_image } from '@/hooks/Conexion';
import { get } from '@/hooks/SessionUtil';
import mensajes from '@/components/Notification/Mensajes';

const items = [
  { title: 'Dashboard', href: PATH_DOCENTE.default },
  { title: 'Perfil', href: PATH_DOCENTE.perfil },
  { title: 'Editar', href: '' },
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
    foto?: string;
    email: string;
    estado: string;
    ocupacion: string;
    area: string;
  }

  interface ChangePassword {
    contrasenia: string;
    contraseniaConfirm: string;
  }
function transformToUserProfile(data: any): UserProfile {
  return {
    nombre: data.usuario?.nombre || '',
    apellido: data.usuario?.apellido || '',
    foto: data.usuario?.foto || '',
    email: data.email || '',
    estado: data.estado || '',
    ocupacion: data.usuario?.ocupacion || '',
    area: data.usuario?.area || '',
  };
}

function Settings() {
  const [file, setFile] = useState<File | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { id } = useParams();
  const token = get('token');
  const router = useRouter();

  // Generar preview cuando se selecciona archivo
  useEffect(() => {
    if (!file) return setPreview(null);
    if (file) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

      if (!allowedTypes.includes(file.type)) {
        mensajes("No se ha podido cargar la imagen", "Formatos aceptados: png, jpeg, jpg", "error");
        setFile(null); // limpiar si no es válido
        return;
      }
              // Si el archivo es válido
    }
    const objectUrl = URL.createObjectURL(file);
    // console.log('ARCHIVO INFO');
    // console.log(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl); // Limpieza
  }, [file]);

  const handleGuardar = async () => {
    const formDataToSend = new FormData();
    if (file) {
      formDataToSend.append('file', file);
    }

    // Agrega otros datos si es necesario
    // formDataToSend.append('nombre', formData.nombre);

    const response = await fetch('http://localhost:4000/api/usuario/upload', {
      method: 'POST',
      body: formDataToSend,
    });

    const result = await response.json();
    if (result.filename) {
      setFormData((prev) => ({
        ...prev,
        foto: `http://localhost:4000/subidas/${result.filename}`,
      }));
    }
  };

  const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        foto: "",
        email: "",
        ocupacion: "",
        area: "",
  });
  const [formDataChangePassword, setFormDataChangePassword] = useState({
        contraseniaActual: "",    
        contrasenia: "",
        contraseniaConfirm: "",
  });
  const [errors, setErrors] = useState({
        nombre: "",
        apellido: "",
        foto: "",
        email: "",
        ocupacion: "",
        area: "",
    });
  const [errorChangePassword, setErrorChangePassword] = useState({
        contraseniaActual: "",
        contrasenia: "",
        contraseniaConfirm: "",
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

            case "email":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    email: value ? "" : "El email es requerido",
                }));
                break;

            case "ocupacion":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    ocupacion: value ? "" : "La ocupacion es requerida",
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
            case "contraseniaActual":
                setErrorChangePassword((prevErrors) => ({
                    ...prevErrors,
                    contraseniaActual: value ? "" : "La contraseña actual es requerida",
                }));
                break;
            case "contrasenia":
                setErrorChangePassword((prevErrors) => ({
                    ...prevErrors,
                    contrasenia: value ? "" : "La contraseña es requerida",
                }));
                break;
            case "contraseniaConfirm":
                setErrorChangePassword((prevErrors) => ({
                    ...prevErrors,
                    contraseniaConfirm: value ? "" : "La contraseña es requerida",
                }));
                break;

            default:
                break;
        }
    }
    const handleSubmitChangePassword = async (event:any) => {
        try {
            event.preventDefault();
            console.log(token);
            // Validar todos los campos antes de enviar
            handleBlurChangePassword({ target: { name: "contraseniaActual", value: formDataChangePassword.contraseniaActual } });
            handleBlurChangePassword({ target: { name: "contrasenia", value: formDataChangePassword.contrasenia } });
            handleBlurChangePassword({ target: { name: "contraseniaConfirm", value: formDataChangePassword.contraseniaConfirm } });

            const errorMessages = Object.entries(errorChangePassword)
                .filter(([field, error]) => error)
                .map(([field, error]) => `${error}`)
                .join("\n");
            console.log({ errorChangePassword })
            // Si las contraseñas no coinciden
            

            if (formDataChangePassword.contrasenia !== formDataChangePassword.contraseniaConfirm) { 
                mensajes("Las contraseñas no coinciden", errorMessages || "No se ha podido actualizar la contraseña", "error");
                return;
            }



            if (formDataChangePassword.contrasenia.length < 8) {
                mensajes("La contraseña debe tener al menos 8 caracteres", errorMessages || "No se ha podido actualizar la contraseña", "error"); 
                return;
            }

            // Si hay errores, no enviar el formulario   
            if (Object.values(errorChangePassword).some((error) => error !== "" && error !== undefined)) {
                mensajes("Error al actualizar la contraseña", errorMessages || "No se ha podido actualizar la contraseña", "error");
                return;
            }

            // console.log(formData.nomenclature);
            console.log({ email: formData.email, ...formDataChangePassword})
            const res : any = await patch_api(`cuenta/password/${id}`, { email: formData.email, ...formDataChangePassword});
            console.log(res);
            if (res.statusCode === 400) {
              mensajes( res?.message || "No se ha podido actualizar la contraseña", "Error al actualizar la contraseña", "error");
              return;
            }
            mensajes("Contraseña actualizada exitosamente.", "Éxito");
            return;
            

            // await upd  ateMonitoringStation(id, formData, token);
            // router.push("/apps/profile");
        }
        catch (error:any) {
            console.log(error);
            mensajes("Error al actualizar la contraseña", error.response?.data?.customMessage || "No se ha podido actualizar la contraseña", "error");
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
            handleBlur({ target: { name: "ocupacion", value: formData.ocupacion } });
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
                mensajes("Error al actualizar el perfil del usuario", errorMessages || "No se ha podido actualizar el perfil del usuario", "error");
                return;
            }
            
            console.log('file');
            console.log(file);
            // console.log(token);
            if (file != null){
              const formDataToSend = new FormData();
              if (file) {
                formDataToSend.append('file', file);
                const res = await post_api_image(`usuario/upload`, formDataToSend )
                await patch_api(`cuenta/${id}`, {
                  ...formData,
                  foto: res.data.filename,
                });
              }
            }else{
              console.log('FORM DATA');
              console.log(formData);
              await patch_api(`cuenta/${id}`, formData);
            }
            

            mensajes("Perfil actualizado exitosamente.", "Éxito");
            router.push("/docente/profile");
        } catch (error:any) {
            console.log(error);
            mensajes("Error al actualizar el perfil", error.response?.data?.customMessage || "No se ha podido actualizar el perfil", "error");
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
          foto: userProfile.foto? userProfile.foto : "",
          email: userProfile.email,
          ocupacion: userProfile.ocupacion,
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
  }, [id]);

  useEffect(() => {
    if (profile) {
      setErrors({
        nombre: formData.nombre ? "" : "El nombre es requerido",
        apellido: formData.apellido ? "" : "El apellido es requerido",
        foto: "", // no estás validando la foto realmente
        email: formData.email ? "" : "El email es requerido",
        ocupacion: formData.ocupacion ? "" : "La ocupación es requerida",
        area: formData.area ? "" : "El área es requerida",
      });
    }
  }, [profile, formData]);
      

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
        <title>Perfil | RequiFeed</title>
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Editar perfil" breadcrumbItems={items} />
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
                          autoComplete="family-name"
                          // {...accountInfoForm.getInputProps('firstname')}
                        />
                        <TextInput
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={!!errors.apellido}
                          required
                          label="Apellido"
                          placeholder="apellido"
                          name="apellido"
                          value={formData.apellido}
                          // autoFocus
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
                          // autoFocus
                          autoComplete="family-name"
                        />
                        <Select
                          w="100%"
                          mt="md"
                          onDropdownClose={() => {
                            handleBlur({ target: { name: "ocupacion", value: formData.ocupacion } });
                          }}
                          // onBlur={handleBlur}
                          label="Ocupación"
                          name='ocupacion'
                          placeholder="Selecciona una ocupación"
                          required
                          data={[
                            { value: 'estudiante', label: 'Estudiante' },
                            { value: 'docente', label: 'Docente' },
                            { value: 'otro', label: 'Otro' },
                          ]}
                          value={formData.ocupacion}
                          // classNames={{ label: classes.label }}
                          onChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              ocupacion: value ?? "",
                            }))
                          }
                          error={errors.ocupacion}
                        />
                      </Group>
                      <Group grow>
                        
                       <Select
                          w="100%"
                          mt="md"
                          onDropdownClose={() => {
                            handleBlur({ target: { name: "area", value: formData.area } });
                          }}
                          
                          label="Área de trabajo"
                          placeholder="Seleccione un área de trabajo"
                          required
                          name="area"
                          value={formData.area}
                          data={[
                            { value: 'computacion', label: 'Computación' },
                            { value: 'administrativa', label: 'Administrativa' },
                            { value: 'investigativa', label: 'Investigativa' },
                            { value: 'otro', label: 'Otro' },
                          ]}
                          onChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              area: value ?? "",
                            }))
                          }
                          error={errors.area}
                        />
                      </Group>
                      <Button
                        style={{ width: 'fit-content' }}
                        leftSection={<IconDeviceFloppy size={ICON_SIZE} />}
                        onClick={handleSubmit}
                      >
                        Actualizar perfil
                      </Button>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6, lg: 3, xl: 3 }}>
                    <Stack align="center">
                      {/* <Image
                        src={
                          preview
                            ? preview
                            : formData?.foto && formData.foto.trim() !== ''
                            ? `http://localhost:4000/subidas/${formData.foto}`
                            : 'http://localhost:4000/subidas/ProfileDefaultImage.jpg'
                        }
                        h={128}
                        w={128}
                        radius="50%"
                      /> */}
                      <Avatar
                        src={
                          preview
                            ? preview
                            : formData?.foto && formData.foto.trim() !== ''
                            ? `http://localhost:4000/subidas/${formData.foto}`
                            : 'http://localhost:4000/subidas/ProfileDefaultImage.jpg'
                        }
                        size={120} radius={120} mx="auto" mb="md"
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
                            Cambiar imagen
                          </Button>
                        )}
                      </FileButton>
                      <Text ta="center" size="xs" c="dimmed">
                        Para mejores resultados, utiliza una imagen de al menos 128px por
                        128px en formato .png .jpg .jpeg
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
                        <PasswordInput
                          onBlur={handleBlurChangePassword}
                          onChange={hadleChangePassword}
                          error={!!errorChangePassword.contraseniaActual}
                          // required
                          id="contraseniaActual"
                          type='password'
                          label="Contraseña actual"
                          placeholder="Contraseña actual"
                          name="contraseniaActual"
                          value={formDataChangePassword.contraseniaActual}
                          autoComplete="family-name"
                          // {...accountInfoForm.getInputProps('firstname')}
                        />
                        <PasswordInput
                          onBlur={handleBlurChangePassword}
                          onChange={hadleChangePassword}
                          error={!!errorChangePassword.contrasenia}
                          // required
                          id="contrasenia"
                          type='password'
                          label="Nueva contraseña"
                          placeholder="Nueva contraseña"
                          name="contrasenia"
                          value={formDataChangePassword.contrasenia}
                          autoComplete="family-name"
                          // {...accountInfoForm.getInputProps('firstname')}
                        />
                        <PasswordInput
                          onBlur={handleBlurChangePassword}
                          onChange={hadleChangePassword}
                          // required
                          type='password'
                          error={!!errorChangePassword.contraseniaConfirm}
                          label="Escriba nuevamente la contraseña"
                          placeholder="Escriba nuevamente la contraseña"
                          name="contraseniaConfirm"
                          value={formDataChangePassword.contraseniaConfirm}
                          autoComplete="family-name"
                        />
                      {/* </Group> */}
                      
                      <Button
                        style={{ width: 'fit-content' }}
                        leftSection={<IconDeviceFloppy size={ICON_SIZE} />}
                        onClick={handleSubmitChangePassword}
                      >
                        Cambiar contraseña
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

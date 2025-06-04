'use client';

import React, { useEffect, useState } from 'react';
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
  Textarea,
  TextInput,
} from '@mantine/core';
import { PATH_ESTUDIANTE } from '@/routes';
import { useForm } from '@mantine/form';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { PageHeader, Surface, TextEditor } from '@/components';
import mensajes from '@/components/Notification/Mensajes';
import { get_api, post_api } from '@/hooks/Conexion';
import { useRouter, useParams } from 'next/navigation';
import { RichTextEditor } from '@mantine/tiptap';

const items = [
  { title: 'Dashboard', href: PATH_ESTUDIANTE.default },
  { title: 'Grupo', href: PATH_ESTUDIANTE.grupo },
  // { title: 'Settings', href: '#' },
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

function CreateProject() {
  const router = useRouter();
  const { id } = useParams();
  const [file, setFile] = useState<File | null>(null);
  const [grupo, setGrupo] = useState<any>(null);
  const getProject = async () => {
      try {
        const {data} = await get_api(`grupo/${id}`);
        console.log(data.grupo);
        setGrupo(data.grupo);
      } catch (error:any) {
        mensajes("Error", error.response?.data?.customMessage || "No se ha podido obtener el usuario", "error");
      }
    }

  useEffect(() => {
    getProject();
  }, []);
  const [errors, setErrors] = useState({
    nombre: "",
    descripcion: "",
  });

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });

  const handleBlur = (event:any) => {
        const { name, value } = event.target;

        // Validación básica de campos requeridos
        switch (name) {
            case "nombre":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    nombre: value ? "" : "El nombre del proyecto es requerido",
                }));
                break;
            case "descripcion":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    apellido: value ? "" : "La descripcion del proyecto es requerida",
                }));
                break;

            default:
                break;
        }
    };
    const handleChange = (event : any) => {
      const { name, value } = event.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    };

    const handleSubmit = async (event:any) => {
      try {
        event.preventDefault();
                // Validar todos los campos antes de enviar
        handleBlur({ target: { name: "nombre", value: formData.nombre } });
        handleBlur({ target: { name: "descripcion", value: formData.descripcion } });
        console.log('FormData');
        console.log(formData);
    
        const errorMessages = Object.entries(errors)
          .filter(([field, error]) => error)
          .map(([field, error]) => `${error}`)
          .join("\n");
    
    
        console.log({ errors })
    
                // Si hay errores, no enviar el formulario
        if (Object.values(errors).some((error) => error !== "" && error !== undefined)) {   
          mensajes("Error al crear el proyecto", errorMessages || "No se ha podido crear el proyecto", "error");
          return;
        }
        //TODO: REVIEW
        post_api(`proyecto`, {estado: "ACTIVO", grupoId : grupo.id, ...formData});
        // await updateMonitoringStation(id, formData, token);
    
        mensajes("Proyecto creado exitosamente.", "Éxito");
        router.back();
      } catch (error:any) {
        console.log(error);
        mensajes("Error al crear el proyecto", error.response?.data?.customMessage || "No se ha podido crear el proyecto", "error");
      }
    };


  return (
    <>
      <>
        <title>Proyectos | Requifeed</title>
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Crear proyecto" breadcrumbItems={items} />
          <Grid>
            <Grid.Col span={{ base: 12, md: 12 }}>
              <Surface component={Paper} {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Crear Proyecto
                </Text>
                <Grid gutter={{ base: 5, xs: 'md', md: 'md', lg: 'lg' }}>
                  <Grid.Col span={{ base: 12, md: 6, lg: 9, xl: 12 }}>
                    <Stack>
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
                          // autoFocus
                          autoComplete="family-name"
                          // {...accountInfoForm.getInputProps('firstname')}
                        />
                        {/* <RichTextEditor editor={editor} style={{ width:"60" }}>
                          <RichTextEditor.Content />
                        </RichTextEditor> */}
                        <Textarea
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={!!errors.descripcion}
                          // required
                          label="Descripcion del proyecto"
                          placeholder="descripcion"
                          name="descripcion"
                          value={formData.descripcion}
                          autoComplete="family-name"
                         />
                      {/* <TextEditor content={BIO} label="Biography" /> */}
                      <Button
                        style={{ width: 'fit-content' }}
                        leftSection={<IconDeviceFloppy size={ICON_SIZE} />}
                        onClick={handleSubmit}
                      >
                        Crear proyecto
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

export default CreateProject;

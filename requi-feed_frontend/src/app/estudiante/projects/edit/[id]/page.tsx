'use client';

import React, { useEffect, useState } from 'react';
import {
  Anchor,
  Button,
  Container,
  Grid,
  Paper,
  PaperProps,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { PATH_ESTUDIANTE } from '@/routes';
import {  IconDeviceFloppy } from '@tabler/icons-react';
import { PageHeader, Surface, TextEditor } from '@/components';
import mensajes from '@/components/Notification/Mensajes';
import { get_api, patch_api } from '@/hooks/Conexion';
import { useParams, useRouter } from 'next/navigation';
import { get } from '@/hooks/SessionUtil';

const items = [
  { title: 'Dashboard', href: PATH_ESTUDIANTE.default },
  { title: 'Proyectos', href: PATH_ESTUDIANTE.proyectos },
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
  
interface Project {
    nombre: string;
    descripcion: string;
    estado: string;
    calificacionId: number;
  }

function transformToProject(data: any): Project {
  return {
    nombre: data.nombre || '',
    descripcion: data.descripcion|| '',
    estado: data.estado || '',
    calificacionId: data.calificacionId || null,
  };
}

function CreateProject() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const { id } = useParams();
  const token = get('token');
  const [errors, setErrors] = useState({
    nombre: "",
    descripcion: "",
    estado: "",
  });

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    estado: "",
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
            case "estado":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    estado: value ? "" : "El estado del proyecto es requerido",
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
        handleBlur({ target: { name: "estado", value: formData.estado } });
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

        patch_api(`proyecto/${id}`, formData);
        // await updateMonitoringStation(id, formData, token);
    
        mensajes("Proyecto actualizado exitosamente.", "Éxito");
        router.push("/apps/projects");
      } catch (error:any) {
        console.log(error);
        mensajes("Error al actualizar el proyecto", error.response?.data?.customMessage || "No se ha podido actualizar el proyecto", "error");
      }
    };


  const getProjectInformation = async () => {
      try {
        if ( token != null && typeof id == 'string' ){
          const {data} = await get_api(`proyecto/${id}`);
          const project = transformToProject(data);
          console.log(data);
          setProject(project);
  
          setFormData({
            nombre: project.nombre,
            descripcion: project.descripcion,
            estado: project.estado
          });
        }            
        } catch (error:any) {
          mensajes("Error", error.response?.data?.customMessage || "No se ha podido obtener el usuario", "error");
        }
      }
    useEffect(() => {
      getProjectInformation();
          // setResearchers(mockResearchers);
    }, [id]);
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
                  Editar Proyecto
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

                         <Select
                          w="100%"
                          mt="md"

                          label="Estado"
                          placeholder="Selecciona el estado del proyecto"
                          required
                          data={[
                            { value: 'ACTIVO', label: 'Activo' },
                            { value: 'INACTIVO', label: 'Inactivo' },
                            { value: 'FINALIZADO', label: 'Finalizado' },
                          ]}
                          value={formData.estado}
                          // classNames={{ label: classes.label }}
                          onChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              estado: value ?? "",
                            }))
                          }
                          error={errors.estado}
                        />

                      {/* <TextEditor content={BIO} label="Biography" /> */}
                      <Button
                        style={{ width: 'fit-content' }}
                        leftSection={<IconDeviceFloppy size={ICON_SIZE} />}
                        onClick={handleSubmit}
                      >
                        Guardar cambios
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

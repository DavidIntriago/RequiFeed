'use client';

import React, { useEffect, useState } from 'react';
import {
  Anchor,
  Button,
  Container,
  Grid,
  NumberInput,
  Paper,
  PaperProps,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { PATH_DASHBOARD, PATH_DOCENTE } from '@/routes';
import {  IconDeviceFloppy } from '@tabler/icons-react';
import { PageHeader, Surface, TextEditor } from '@/components';
import mensajes from '@/components/Notification/Mensajes';
import { get_api, get_api_id, patch_api, post_api } from '@/hooks/Conexion';
import { useParams, useRouter } from 'next/navigation';
import { get } from '@/hooks/SessionUtil';

const items = [
  { title: 'Dashboard', href: PATH_DOCENTE.default },
  { title: 'Proyectos', href: PATH_DOCENTE.proyectos },
  { title: 'Revisar', href: '' },
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
    calificacion: number;
    calificacionExternalId?: string | null;
  }

function transformToProject(data: any): Project {
  return {
    nombre: data.nombre || '',
    descripcion: data.descripcion|| '',
    estado: data.estado || '',
    calificacionId: data.calificacionId || null,
    calificacion: data.calificacion.puntuacion || null
  };
}

function CreateProject() {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const { id } = useParams();
  const token = get('token');
  const [errors, setErrors] = useState({
    // estado: "",
    calificacion: "",
    // comentario: ""
  });

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    estado: "",
    comentario: "",
    calificacion: 0
  });

  const handleBlur = (event:any) => {
        const { name, value } = event.target;

        // Validación básica de campos requeridos
        switch (name) {
            // case "estado":
            //     setErrors((prevErrors) => ({
            //         ...prevErrors,
            //         estado: value ? "" : "El estado del proyecto es requerido",
            //     }));
            //     break;

            case "calificacion":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    calificacion: value !== null ? "" : "La calificacion del proyecto es requerida",
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

    const handleNumberChange = (value: number | string | undefined, name: string) => {
      const numericValue = typeof value === 'number' ? value : 0;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: numericValue,
      }));
    };
    const handleSubmit = async (event:any) => {
      try {
        event.preventDefault();
                // Validar todos los campos antes de enviar
        handleBlur({ target: { name: "calificacion", value: formData.calificacion } });
        handleBlur({ target: { name: "comentario", value: formData.comentario } });
        console.log(formData);
    
        const errorMessages = Object.entries(errors)
          .filter(([field, error]) => error)
          .map(([field, error]) => `${error}`)
          .join("\n");
    
    
        console.log({ errors })
    
                // Si hay errores, no enviar el formulario
        if (Object.values(errors).some((error) => error !== "" && error !== undefined)) {   
          mensajes("Error al actualizar el proyecto", errorMessages || "No se ha podido actualizar el proyecto", "error");
          return;
        }
        console.log(project?.calificacionId)
        if (project?.calificacionId == null ) {

          const calificacionData = {
            puntuacion: formData.calificacion,
            comentario: formData.comentario,
            proyectoId: id
          };

          const res = await post_api(`calificacion`, calificacionData);
          console.log(res);
          await patch_api(`proyecto/${id}`, {estado: "FINALIZADO",});
          mensajes("Proyecto calificado.", "Éxito");

        }else{
          const calificacionData = {
            puntuacion: formData.calificacion,
            comentario: formData.comentario,
            // proyectoId: id
          };
          const res = await patch_api(`calificacion/${project?.calificacionExternalId}`, calificacionData);
          // console.log(res);
          // await patch_api(`proyecto/${id}`, {estado: "FINALIZADO", calificacionId: res.id});
          console.log(res);
          mensajes("Nota actualizada.", "Éxito");

        }
            
        router.push("/docente/proyectos");
      } catch (error:any) {
        console.log(error);
        mensajes("Error al actualizar el proyecto", error.response?.data?.customMessage || "No se ha podido actualizar el proyecto", "error");
      }
    };


  const getProjectInformation = async () => {
      try {
        if ( token != null && typeof id == 'string' ){
          const {data} = await get_api(`proyecto/${id}`);
          console.log(data);
          setProject({
            nombre: data.nombre,
            descripcion: data.descripcion,
            estado: data.estado,
            calificacionId: data.calificacionId ?? null,
            calificacion: data.calificacion?.puntuacion || 0,
            calificacionExternalId: data.calificacion?.external_id || null
          });
          setFormData({
            nombre: data.nombre,
            descripcion: data.descripcion,
            estado: data.estado,
            calificacion: data.calificacion?.puntuacion || 0,
            comentario: data.calificacion?.comentario || ""
          });
        }            
        } catch (error:any) {
          console.log(error)
          mensajes("Error", error.response?.data?.customMessage || "No se ha podido obtener el proyecto exitosamente", "error");
        }
      }
    useEffect(() => {
      getProjectInformation();
          // setResearchers(mockResearchers);
    }, []);
  return (
    <>
      <>
        <title>Calificar proyecto | DesignSparx</title>
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Calificar proyecto" breadcrumbItems={items} />
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
                          required
                          id="nombre"
                          label="Nombre"
                          placeholder="Nombre"
                          name="nombre"
                          value={formData.nombre}
                          // autoFocus
                          autoComplete="family-name"
                          readOnly
                          style={{
                            backgroundColor: "#f5f5f5",
                            color: "#888",
                            opacity: 0.7,
                            cursor: "not-allowed"
                          }}
                          // {...accountInfoForm.getInputProps('firstname')}
                        />
                        {/* <RichTextEditor editor={editor} style={{ width:"60" }}>
                          <RichTextEditor.Content />
                        </RichTextEditor> */}
                        <Textarea
                          onBlur={handleBlur}
                          onChange={handleChange}
                          // required
                          label="Descripcion del proyecto"
                          placeholder="descripcion"
                          name="descripcion"
                          value={formData.descripcion}
                          autoComplete="family-name"
                          readOnly
                          style={{
                            backgroundColor: "#f5f5f5",
                            color: "#888",
                            opacity: 0.7,
                            cursor: "not-allowed"
                          }}
                         />

                         {/* <Select
                          w="100%"
                          mt="md"

                          label="Estado"
                          placeholder="Selecciona el estado del proyecto"
                          required
                          data={[
                            { value: 'ACTIVO', label: 'Activo' },
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
                        /> */}

                        <Textarea
                          onBlur={handleBlur}
                          onChange={handleChange}
                          label="Comentario al proyecto"
                          placeholder="comentario"
                          name="comentario"
                          value={formData.comentario}
                          autoComplete="family-name"
                         /> 
                         
                        <NumberInput
                          onBlur={handleBlur}
                          onChange={(value) => handleNumberChange(value, "calificacion")}
                          error={!!errors.calificacion}
                          label="Calificación del proyecto"
                          placeholder="calificacion"
                          name="calificacion"
                          value={formData.calificacion}
                          autoComplete="off"
                          min={0}
                          max={2.5}
                          step={0.01}
                         />

                      {/* <TextEditor content={BIO} label="Biography" /> */}
                        <Button
                          style={{ width: 'fit-content' }}
                          leftSection={<IconDeviceFloppy size={ICON_SIZE} />}
                          onClick={handleSubmit}
                        >
                          {project?.calificacionId  ? "Actualizar nota" : "Crear calificación"}
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

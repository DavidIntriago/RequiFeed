import { useContext, useState } from "react";
// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/FondoRegistro.jpg";

import AuthService from "services/auth-service";
import { AuthContext } from "context";
import { InputLabel } from "@mui/material";

function Register() {
  const authContext = useContext(AuthContext);

  const [inputs, setInputs] = useState({
    nombre: "",
    apellido: "",
    password: "",
    email: "",
    ocupacion: "",
    cargo: "",
    area: "",
    foto: "",
    agree: false,
  });

  const [errors, setErrors] = useState({
    nombreError: false,
    apellidoError: false,
    emailError: false,
    passwordError: false,
    ocupacionError: false,
    cargoError: false,
    areaError: false,
    fotoError: false,
    agreeError: false,
    error: false,
    errorText: "",
  });

  const changeHandler = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (inputs.nombre.trim().length === 0) {
      setErrors({ ...errors, nombreError: true });
      return;
    }

    if (inputs.apellido.trim().length === 0) {
      setErrors({ ...errors, apellidoError: true });
      return;
    }

    if (inputs.email.trim().length === 0 || !inputs.email.trim().match(mailFormat)) {
      setErrors({ ...errors, emailError: true });
      return;
    }

    if (inputs.password.trim().length < 8) {
      setErrors({ ...errors, passwordError: true });
      return;
    }

    if (inputs.cargo.trim().length === 0) {
      setErrors({ ...errors, cargoError: true });
      return;
    }
    
    if (inputs.area.trim().length === 0) {-
      setErrors({ ...errors, areaError: true });
      return;
    }

    if (inputs.ocupacion.trim().length === 0) {
      setErrors({ ...errors, ocupacionError: true });
      return;
    }

    if (inputs.foto.trim().length === 0) {
      setErrors({ ...errors, fotoError: true });
      return;
    }

    if (inputs.agree === false) {
      setErrors({ ...errors, agreeError: true });
      return;
    }

    // here will be the post action to add a user to the db
    const newUser = { nombre: inputs.nombre, apellido: inputs.apellido, email: inputs.email, password: inputs.password, ocupacion: inputs.ocupacion, cargo: inputs.cargo, area: inputs.area, foto: inputs.foto, };

    const myData = {
      data: {
        type: "users",
        attributes: { ...newUser, password_confirmation: newUser.password },
        relationships: {
          roles: {
            data: [
              {
                type: "roles",
                id: "1",
              },
            ],
          },
        },
      },
    };

    try {
      const response = await AuthService.register(myData);
      authContext.login(response.access_token, response.refresh_token);

      setInputs({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        ocupacion: "",
        cargo: "",
        area: "",
        foto: "",
        agree: false,
      });

      setErrors({
        nombreError: false,
        apellidoError: false,
        emailError: false,
        passwordError: false,
        ocupacionError: false,
        cargoError: false,
        areaError: false,
        fotoError: false,
        agreeError: false,
        error: false,
        errorText: "",
      });
    } catch (err) {
      setErrors({ ...errors, error: true, errorText: err.message });
      console.error(err);
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Únete hoy mismo
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Ingresa tus datos e información personal
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" method="POST" onSubmit={submitHandler}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Ingrese su nombre"
                variant="standard"
                fullWidth
                name="nombre"
                value={inputs.nombre}
                onChange={changeHandler}
                error={errors.nombreError}
                inputProps={{
                  autoComplete: "nombre",
                  form: {
                    autoComplete: "off",
                  },
                }}
              />
              {errors.nombreError && (
                <MDTypography variant="caption" color="error" fontWeight="light">
                  No puede dejar el campo nombre sin completar
                </MDTypography>
              )}
            </MDBox>
             <MDBox mb={2}>
              <MDInput
                type="text"
                label="Ingrese su apellido"
                variant="standard"
                fullWidth
                name="apellido"
                value={inputs.apellido}
                onChange={changeHandler}
                error={errors.apellidoError}
                inputProps={{
                  autoComplete: "apellido",
                  form: {
                    autoComplete: "off",
                  },
                }}
              />
              {errors.apellidoError && (
                <MDTypography variant="caption" color="error" fontWeight="light">
                  No puede dejar el campo apellido sin completar
                </MDTypography>
              )}
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Ingrese su correo electrónico"
                variant="standard"
                fullWidth
                value={inputs.email}
                name="email"
                onChange={changeHandler}
                error={errors.emailError}
                inputProps={{
                  autoComplete: "email",
                  form: {
                    autoComplete: "off",
                  },
                }}
              />
              {errors.emailError && (
                <MDTypography variant="caption" color="error" fontWeight="light">
                  El correo electrónico debe ser válido
                </MDTypography>
              )}
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Ingrese su contraseña"
                variant="standard"
                fullWidth
                name="password"
                value={inputs.password}
                onChange={changeHandler}
                error={errors.passwordError}
              />
              {errors.passwordError && (
                <MDTypography variant="caption" color="error" fontWeight="light">
                  La contraseña debe ser superior a 8 caracteres
                </MDTypography>
              )}
            </MDBox>
             <MDBox mb={2}>
              <MDInput
                type="text"
                label="Ingrese su ocupación"
                variant="standard"
                fullWidth
                name="ocupacion"
                value={inputs.ocupacion}
                onChange={changeHandler}
                error={errors.ocupacionError}
                inputProps={{
                  autoComplete: "ocupacion",
                  form: {
                    autoComplete: "off",
                  },
                }}
              />
              {errors.ocupacionError && (
                <MDTypography variant="caption" color="error" fontWeight="light">
                  No puede dejar el campo ocupación sin completar
                </MDTypography>
              )}
            </MDBox>
             <MDBox mb={2}>
              <MDInput
                type="text"
                label="Ingrese su cargo"
                variant="standard"
                fullWidth
                name="cargo"
                value={inputs.cargo}
                onChange={changeHandler}
                error={errors.cargoError}
                inputProps={{
                  autoComplete: "cargo",
                  form: {
                    autoComplete: "off",
                  },
                }}
              />
              {errors.cargoError && (
                <MDTypography variant="caption" color="error" fontWeight="light">
                  No puede dejar el campo cargo sin completar
                </MDTypography>
              )}
            </MDBox>
             <MDBox mb={2}>
              <MDInput
                type="text"
                label="Ingrese su área"
                variant="standard"
                fullWidth
                name="area"
                value={inputs.area}
                onChange={changeHandler}
                error={errors.areaError}
                inputProps={{
                  autoComplete: "area",
                  form: {
                    autoComplete: "off",
                  },
                }}
              />
              {errors.areaError && (
                <MDTypography variant="caption" color="error" fontWeight="light">
                  No puede dejar el campo área sin completar
                </MDTypography>
              )}
            </MDBox>
             <MDBox mb={2}>
              <InputLabel style={{ marginBottom: 4 }}>Ingrese su Foto de perfil</InputLabel>
              <input
                type="file"
                name="foto"
                onChange={(e) =>
                setInputs({ ...inputs, foto: e.target.files[0]?.name || "" })
                }
                style={{ marginBottom: 8 }}
              />
              {errors.fotoError && (
            <MDTypography variant="caption" color="error" fontWeight="light">
               No puede dejar el campo foto sin completar
            </MDTypography>
            )}
            </MDBox>
            {errors.error && (
              <MDTypography variant="caption" color="error" fontWeight="light">
                {errors.errorText}
              </MDTypography>
            )}
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                Registrar
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                ¿Ya tienes una cuenta?{" "}
                <MDTypography
                  component={Link}
                  to="/auth/login"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Ingresa aqui
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Register;

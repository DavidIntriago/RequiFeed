import React, { useState } from "react";
import "./Estilo/StyleRegistrar.css";
import { useNavigate } from "react-router-dom";
import { post_api } from "../../hooks/Conexion";

const Registro = () => {
  const [email, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [ocupacion, setOcupacion] = useState("");
  const [cargo, setCargo] = useState("");
  const [area, setArea] = useState("");
  const [foto, setFoto] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    const newErrors = {};

    if (!nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!apellido.trim()) newErrors.apellido = "El apellido es obligatorio.";
    if (!email.trim() || !emailRegex.test(email))
      newErrors.email = "Correo electrónico no válido.";
    if (!contrasenia.trim() || contrasenia.length < 6)
      newErrors.contrasenia = "La contraseña debe tener al menos 6 caracteres.";
    if (!ocupacion.trim()) newErrors.ocupacion = "La ocupación es obligatoria.";
    if (!cargo.trim()) newErrors.cargo = "El cargo es obligatorio.";
    if (!area.trim()) newErrors.area = "El área es obligatoria.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const body = {
      email,
      contrasenia,
      nombre,
      apellido,
      ocupacion,
      cargo,
      area,
      foto, // puede ser una URL o base64 si deseas enviar imagen
    };

    try {
      const response = await post_api("cuenta/registry", body);
      if (response?.error) {
        alert(response.error);
        return;
      }

      alert("Bienvenid@ " + response.nombre);
      navigate("/Login");
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error inesperado.");
    }
  };

  return (
    <div className="signup-container">
      <nav className="navbar">
        <div className="nav-left">RequiFeed</div>
        <div className="nav-center">
          <a href="/Registrar_Usuario">🧑 Registrarse</a>
          <a href="/Login">🔑 Iniciar Sesión</a>
        </div>
        <div className="nav-right">ℹ️ Acerca De</div>
      </nav>

      <div className="signup-content">
        <div className="signup-callout">
          <h3>Únete hoy mismo</h3>
          <p>Ingrese su información y datos personales</p>
        </div>

        <div className="divider"></div>

        <form className="signup-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label>Ingrese su nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            {errors.nombre && <span className="error-message">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label>Ingrese su apellido</label>
            <input
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
            {errors.apellido && <span className="error-message">{errors.apellido}</span>}
          </div>

          <div className="form-group">
            <label>Ingrese su correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setCorreo(e.target.value)}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Ingrese su contraseña</label>
            <input
              type="password"
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}
            />
            {errors.contrasenia && (
              <span className="error-message">{errors.contrasenia}</span>
            )}
          </div>

          <div className="form-group">
            <label>Ingrese su ocupación</label>
            <input
              type="text"
              value={ocupacion}
              onChange={(e) => setOcupacion(e.target.value)}
            />
            {errors.ocupacion && <span className="error-message">{errors.ocupacion}</span>}
          </div>

          <div className="form-group">
            <label>Ingrese su cargo</label>
            <input
              type="text"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
            />
            {errors.cargo && <span className="error-message">{errors.cargo}</span>}
          </div>

          <div className="form-group">
            <label>Ingrese su área</label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
            {errors.area && <span className="error-message">{errors.area}</span>}
          </div>

          <div className="form-group full-width">
            <label>Foto de perfil (opcional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFoto(e.target.files[0])}
            />
          </div>

          <div className="divider"></div>

          <button className="submit-button" type="submit">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registro;

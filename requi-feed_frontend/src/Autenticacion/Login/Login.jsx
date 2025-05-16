import React, { useState } from "react";
import './Estilo/Stylelogin.css';
import { useNavigate, Link } from "react-router-dom";
import { post_api } from "../../hooks/Conexion";
import { save } from "../../hooks/SessionUtil";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
const [errorMessage, setErrorMessage] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateInputs = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "El correo es obligatorio.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Correo electrónico no válido.";
    }

    if (!password.trim()) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (password.length < 5) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    post_api("cuenta/login", { email, contrasenia: password }).then((response) => {
      if (response.data) {
        
        save("token", response.data.token);
        save("external_id", response.data.external_id);
      alert("Bienvenid@ " + response.nombre);
      navigate("/Principal"); 
}
      else {
    setErrorMessage(response?.error || "Credenciales incorrectas. Por favor, verifica tu correo y contraseña.");
        return;
      }

      
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <nav className="navbar">
        <div className="nav-left">RequiFeed</div>
        <div className="nav-center">
          <Link to="/Registrar_Usuario">🧑 Registrarse</Link>
          <Link to="/Login">🔑 Iniciar Sesión</Link>
        </div>
        <div className="nav-right">ℹ️ Acerca De</div>
      </nav>

      <div className="login-container">
        <h1 className="title">RequiFeed</h1>
        <p className="subtitle">Sistema Educativo para la documentación de requisitos</p>

        <form className="login-form" onSubmit={handleLogin}>
          <h2>Iniciar Sesión</h2>

          <div className="input-group-column">
            <label>
              Correo Electrónico{" "}
              <span className="info-tooltip" title="Introduce un correo válido, como ejemplo@dominio.com">ℹ️</span>
            </label>
            <input
              type="email"
              placeholder="usuario@unl.edu.ec"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="input-group-column">
            <label>
              Contraseña{" "}
              <span className="info-tooltip" title="Debe tener al menos 6 caracteres. Se recomienda incluir letras y números.">ℹ️</span>
            </label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="*********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "Ocultar" : "Ver"}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          {errorMessage && (
  <div className="error-box">
    {errorMessage}
  </div>
)}


          <button className="login-button" type="submit">
            INGRESAR
          </button>

          <div className="links">
            <p>
              ¿Olvidaste tu contraseña? <Link to="/Recuperar_Clave">Click aquí</Link>
            </p>
            <p>
              ¿No tienes una cuenta? <Link to="/Registrar_Usuario">Ingresa aquí</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

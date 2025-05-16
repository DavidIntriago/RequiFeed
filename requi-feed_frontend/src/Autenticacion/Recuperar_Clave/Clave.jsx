import React from "react";
import "./Estilo/StyleClave.css";
import { useNavigate, Link } from "react-router-dom";

const Clave = () => {
  return (
    <div className="clave-container">
      <nav className="navbar">
        <div className="nav-left">RequiFeed</div>
        <div className="nav-center">
          <Link to="/Registrar_Usuario">🧑 Registrarse</Link>
          <Link to="/Login">🔑 Iniciar Sesión</Link>
        </div>
        <div className="nav-right">
          <Link to="/Acercade">ℹ️ Acerca De</Link>
        </div>
      </nav>

      <div className="clave-form">
        <h3>Recuperar Contraseña</h3>
        
        <div className="recover-password">
          <p>Recibirá un correo electrónico en un máximo de 60 segundos</p>
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input type="email" id="email" name="email" />
        </div>

        <button className="clave-button">Enviar</button>
      </div>

    </div>
  );
};

export default Clave;
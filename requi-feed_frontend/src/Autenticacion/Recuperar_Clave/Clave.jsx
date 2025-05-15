import React from "react";
import "./Estilo/StyleClave.css";

const Clave = () => {
  return (
    <div className="clave-container">
       <nav className="navbar">
        <div className="nav-left">RequiFeed</div>
        <div className="nav-center">
          <a href="/Registrar_Usuario">🧑 Registrarse</a>
          <a href="/Login">🔑 Iniciar Sesión</a>
        </div>
        <div className="nav-right">ℹ️ Acerca De</div>
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
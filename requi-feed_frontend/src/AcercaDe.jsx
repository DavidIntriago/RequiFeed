import React, { useState } from "react";
import './StyleAcerca.css';
import { useNavigate, Link } from "react-router-dom";

const AcercaDe = () => {
  return (
    <div className="Acerca-container">
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

      <div className="acerca-form">
        <h3>RequiFeed</h3>
       <img src="./LogoRF.png" alt="Logo RequiFeed" className="logo-img" />
        <div className="subtitle">
          <p> RequiFeed tiene como propósito dar seguimiento a la construcción correcta de requisitos generados por grupos de estudiantes en un entorno académico, permitiendo su redacción, revisión entre pares y calificación final de los requisitos por parte del docente.</p>
        </div>

      </div>

    </div>
  );
};

export default AcercaDe;
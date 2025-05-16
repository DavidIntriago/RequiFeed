import React from 'react';
import './Estilo/StylePrincipal.css';

const AerialDashboard = () => {
    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="sidebar-header">
                    <img src="./LogoRF.png" alt="Logo RequiFeed" className="logo-img" />
                    <h1>RequiFeed</h1>
                    <h2>Documentación de Requisitos</h2>
                </div>
                
                <div className="user-info">
                    <h3>JOHN DOE</h3>
                    <p className="version">Analista</p>
                    <a href="/Login">Cerrar Sesión</a>
                </div>

                <ul className="menu">
                    <li>Proyecto</li>
                    <li>Calificaciones</li>
                    <li>Grupos</li>
                    <li>Requisitos</li>
                    <li></li>
                    <li>Perfil de usuario</li>
                    <li>Notificaciones</li>
                    <li>Reporte</li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="content-header">
                    <h2>Perfil de Usuario</h2>
                </div>

                {/* Profile Card Section */}
                <div className="profile-section">
                    <div className="profile-card">
                        <div className="profile-header">
                            <div className="profile-avatar">
                                <img src="./user.JPG" alt="Profile" />
                            </div>
                            <div className="profile-info">
                                <h3>Jhon Smith Doe Titor</h3>
                                <p className="profile-title">Analista</p>
                                <p className="profile-location">Estudiante</p>
                                <p className="profile-location">Documentador de requisitos</p>
                                <p className="profile-location">Computación</p>
                            </div>
                        </div>
                    </div>

                    {/* Existing Form */}
                    <form className="signup-form">
                        {/* Primera columna */}
                        <div className="form-group">
                            <label>Ingrese su nombre</label>
                            <input type="text" />
                        </div>

                        <div className="form-group">
                            <label>Ingrese su apellido</label>
                            <input type="text" />
                        </div>

                        <div className="form-group">
                            <label>Ingrese su centro electrónico</label>
                            <input type="email" />
                        </div>

                        <div className="form-group">
                            <label>Ingrese su contraseña</label>
                            <input type="password" />
                        </div>

                        {/* Segunda columna */}
                        <div className="form-group">
                            <label>Ingrese su ocupación</label>
                            <input type="text" />
                        </div>

                        <div className="form-group">
                            <label>Ingrese su cargo</label>
                            <input type="text" />
                        </div>

                        <div className="form-group">
                            <label>Ingrese su área</label>
                            <input type="text" />
                        </div>

                        {/* Campo que ocupa ambas columnas */}
                        <div className="form-group full-width">
                            <label>Ingrese su Foto de perfil</label>
                            <div className="file-upload">
                                <input type="file" />
                            </div>
                        </div>
                    </form>

                    <button className="submit-Guardar">Guardar</button>
                </div>
            </div>
        </div>
    );
};

export default AerialDashboard;
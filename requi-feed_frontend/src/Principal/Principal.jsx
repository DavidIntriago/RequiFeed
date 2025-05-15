import React from 'react';
import './Estilo/StylePrincipal.css';


    const AerialDashboard = () => {
        
        return (
            <div className="dashboard-container">
                {/* Sidebar */}
                <div className="sidebar">
                    <div className="sidebar-header">
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
                        <li className="active">Calificaciones</li>
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
                        <h2>Name / Charts</h2>
                    </div>

                    {/* Line Chart Section */}
                    <div className="chart-section">
                        <div className="chart-header">
                            <h3>Line Chart</h3>
                            <span>My Free dataset</span>
                        </div>

                        <div className="months-row">
                            <span>January</span>
                            <span>February</span>
                            <span>March</span>
                            <span>April</span>
                            <span>May</span>
                            <span>June</span>
                            <span>July</span>
                        </div>

                        <div className="chart-actions">
                            <button>See Chart</button>
                            <div className="spacer"></div>
                        </div>

                        <div className="dataset-info">
                            <span>My Free dataset</span>
                        </div>

                        <div className="months-row">
                            <span>January</span>
                            <span>February</span>
                            <span>March</span>
                            <span>April</span>
                            <span>May</span>
                            <span>June</span>
                            <span>July</span>
                        </div>

                        <div className="chart-footer">
                            <strong>Footer Chart</strong>
                        </div>
                    </div>

                    {/* Folder Chart Section */}
                    <div className="folder-section">
                        <h3>Folder Chart</h3>
                        <ul className="folder-list">
                            <li>My Free dataset</li>
                            <li>By Record dataset</li>
                            <li>Running</li>
                            <li>Giving</li>
                            <li>Quite</li>
                            <li>Drawing</li>
                        </ul>
                    </div>

                    {/* File Chart Section */}
                    <div className="file-section">
                        <h3>File Chart</h3>
                        <ul className="file-list">
                            <li><strong>Fold</strong></li>
                            <li><strong>Error</strong></li>
                            <li><strong>Value</strong></li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    };

export default AerialDashboard;
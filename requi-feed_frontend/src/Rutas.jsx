import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Autenticacion/Login/Login';
import Clave from './Autenticacion/Recuperar_Clave/Clave';
import Registrar from './Autenticacion/Registrar_Usuario/Registrar';
import Principal from './Principal/Principal';
import AcercaDe from './AcercaDe';
import RutaProtegida from './RutaProtegida';

const Rutas = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/Recuperar_Clave" element={<Clave />} />
        <Route path="/Registrar_Usuario" element={<Registrar />} />
        <Route path="/AcercaDe" element={<AcercaDe />} />

        {/* Ruta protegida */}
        <Route
          path="/Principal"
          element={
            <RutaProtegida>
              <Principal />
            </RutaProtegida>
          }
        />

        {/* Ruta por defecto: redirige al login */}
        <Route path="/*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Rutas;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importaciones de los componentes existentes (rutas corregidas):
// Si App.jsx está en src/ y los componentes están en src/pages,
// la ruta relativa debe ser "./pages/..."
import Login from "./pages/Login.jsx";
import Materia from "./pages/Materia.jsx";
import Register from "./pages/Register.jsx";

// Importamos el nuevo componente consolidado:
import AlumnosNotas from "./pages/AlumnosNotas.jsx"; 


export default function App() {
    return (
        <Router>
            <Routes>
                {/* Las rutas URL siguen siendo en minúscula, lo cual es la convención estándar */}
                <Route path="/" element={<Login />} />
                
                {/* CONSOLIDADO: Usamos AlumnosNotas para las rutas de /alumnos y /notas */}
                <Route path="/alumnos" element={<AlumnosNotas />} />
                <Route path="/notas" element={<AlumnosNotas />} />
                
                <Route path="/materia" element={<Materia />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
}
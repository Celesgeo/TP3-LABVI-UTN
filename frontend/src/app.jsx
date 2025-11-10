import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout.jsx";
import Ingresar from "./ingresar.jsx";
import Usuarios from "./usuarios.jsx";
import Alumnos from "./alumnos.jsx";
import Materias from "./materias.jsx";
import Notas from "./notas.jsx";

export default function App() {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/ingresar" />} />
            <Route path="/ingresar" element={<Ingresar />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/alumnos" element={<Alumnos />} />
            <Route path="/materias" element={<Materias />} />
            <Route path="/notas" element={<Notas />} />
            </Route>
        </Routes>
        </BrowserRouter>
    );
}

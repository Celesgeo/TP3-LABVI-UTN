import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  return (
    <div className="container">
      <header>
        <h1>Sistema de Gestion de Alumnos</h1>
        <nav>
          <Link to="/usuarios">Usuarios</Link> |
          <Link to="/alumnos">Alumnos</Link> |
          <Link to="/materias">Materias</Link> |
          <Link to="/notas">Notas</Link> |
          <Link to="/ingresar">Salir</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

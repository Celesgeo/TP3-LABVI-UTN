import React, { useState, useEffect } from "react";
import { fetchConToken } from "./auth.jsx";

export default function Alumnos() {
    const [alumnos, setAlumnos] = useState([]);
    const [form, setForm] = useState({ nombre: "", apellido: "", dni: "" });

    useEffect(() => {
        fetchConToken("http://localhost:3000/alumnos").then(setAlumnos);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nuevo = await fetchConToken("http://localhost:3000/alumnos", "POST", form);
        alert(nuevo.message);
        const data = await fetchConToken("http://localhost:3000/alumnos");
        setAlumnos(data);
    };

    return (
        <div>
        <h2>Mi Alumno</h2>
        <form onSubmit={handleSubmit}>
            <input
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
            />
            <input
            placeholder="Apellido"
            value={form.apellido}
            onChange={(e) => setForm({ ...form, apellido: e.target.value })}
            required
            />
            <input
            placeholder="DNI"
            value={form.dni}
            onChange={(e) => setForm({ ...form, dni: e.target.value })}
            required
            />
            <button>Guardar Alumno</button>
        </form>

        <ul>
            {alumnos.map((a) => (
            <li key={a.id}>
                {a.nombre} {a.apellido} - DNI: {a.dni}
            </li>
            ))}
        </ul>
        </div>
    );
    }

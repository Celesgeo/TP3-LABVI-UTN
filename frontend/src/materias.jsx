    import React, { useState, useEffect } from "react";
    import { fetchConToken } from "./auth.jsx";

    export default function Materias() {
    const [materias, setMaterias] = useState([]);
    const [form, setForm] = useState({ nombre: "", codigo: "", año: "" });

    useEffect(() => {
        fetchConToken("http://localhost:3000/materias").then(setMaterias);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nueva = await fetchConToken("http://localhost:3000/materias", "POST", form);
        alert(nueva.message);
        const data = await fetchConToken("http://localhost:3000/materias");
        setMaterias(data);
        setForm({ nombre: "", codigo: "", año: "" });
    };

    return (
        <div>
        <h2>Materias</h2>
        <form onSubmit={handleSubmit}>
            <input
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
            />
            <input
            placeholder="Código"
            value={form.codigo}
            onChange={(e) => setForm({ ...form, codigo: e.target.value })}
            required
            />
            <input
            placeholder="Año"
            value={form.año}
            onChange={(e) => setForm({ ...form, año: e.target.value })}
            required
            />
            <button>Guardar Materia</button>
        </form>

        <ul>
            {materias.map((m) => (
            <li key={m.id}>
                {m.nombre} ({m.codigo}) - Año {m.año}
            </li>
            ))}
        </ul>
        </div>
    );
    }

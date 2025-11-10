    import React, { useState, useEffect } from "react";
    import { fetchConToken } from "./auth.jsx";

    export default function Notas() {
    const [notas, setNotas] = useState([]);
    const [form, setForm] = useState({
        materia_id: "",
        nota1: "",
        nota2: "",
        nota3: "",
    });
    const [materias, setMaterias] = useState([]);

    // Cargar materias y notas al iniciar
    useEffect(() => {
        fetchConToken("http://localhost:3000/materias").then(setMaterias);
        fetchConToken("http://localhost:3000/notas").then(setNotas);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nueva = await fetchConToken("http://localhost:3000/notas", "POST", form);
        alert(nueva.message);

        // Refrescar listado
        const data = await fetchConToken("http://localhost:3000/notas");
        setNotas(data);

        // Limpiar formulario
        setForm({ materia_id: "", nota1: "", nota2: "", nota3: "" });
    };

    return (
        <div>
        <h2>Registrar Notas</h2>

        <form onSubmit={handleSubmit}>
            <select
            value={form.materia_id}
            onChange={(e) => setForm({ ...form, materia_id: e.target.value })}
            required
            >
            <option value="">Seleccionar materia</option>
            {materias.map((m) => (
                <option key={m.id} value={m.id}>
                {m.nombre} ({m.codigo})
                </option>
            ))}
            </select>

            <input
            type="number"
            placeholder="Nota 1"
            value={form.nota1}
            onChange={(e) => setForm({ ...form, nota1: e.target.value })}
            required
            />
            <input
            type="number"
            placeholder="Nota 2"
            value={form.nota2}
            onChange={(e) => setForm({ ...form, nota2: e.target.value })}
            required
            />
            <input
            type="number"
            placeholder="Nota 3"
            value={form.nota3}
            onChange={(e) => setForm({ ...form, nota3: e.target.value })}
            required
            />

            <button>Guardar Nota</button>
        </form>

        <h3>Notas registradas</h3>
        <table border="1" cellPadding="5">
            <thead>
            <tr>
                <th>Materia</th>
                <th>Nota 1</th>
                <th>Nota 2</th>
                <th>Nota 3</th>
            </tr>
            </thead>
            <tbody>
            {notas.map((n) => (
                <tr key={n.id}>
                <td>{n.materia}</td>
                <td>{n.nota1}</td>
                <td>{n.nota2}</td>
                <td>{n.nota3}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
    }

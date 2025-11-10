    import express from "express";
    import { db } from "./db.js";
    import passport from "passport";

    const app = express.Router();

    // Middleware de autenticación JWT (mismo que en auth.js)
    const verificarAutenticacion = passport.authenticate("jwt", { session: false });

    // -----------------------------------------------------------
    // 🔹 Listar alumnos del usuario logueado
    app.get("/", verificarAutenticacion, async (req, res) => {
    const usuario_id = req.user.id;
    const [rows] = await db.execute("SELECT * FROM alumno WHERE usuario_id = ?", [usuario_id]);
    res.json(rows);
    });

    // 🔹 Crear alumno vinculado al usuario logueado
    app.post("/", verificarAutenticacion, async (req, res) => {
    const { nombre, apellido, dni } = req.body;
    const usuario_id = req.user.id;

    await db.execute(
        "INSERT INTO alumno (nombre, apellido, dni, usuario_id) VALUES (?, ?, ?, ?)",
        [nombre, apellido, dni, usuario_id]
    );

    res.json({ message: "Alumno creado correctamente", usuario_id });
    });

    // 🔹 Modificar datos del alumno vinculado al usuario
    app.put("/:id", verificarAutenticacion, async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, dni } = req.body;
    const usuario_id = req.user.id;

    await db.execute(
        "UPDATE alumno SET nombre=?, apellido=?, dni=? WHERE id=? AND usuario_id=?",
        [nombre, apellido, dni, id, usuario_id]
    );

    res.json({ message: "Alumno actualizado correctamente" });
    });

    // 🔹 Eliminar alumno (solo si pertenece al usuario logueado)
    app.delete("/:id", verificarAutenticacion, async (req, res) => {
    const { id } = req.params;
    const usuario_id = req.user.id;

    await db.execute("DELETE FROM alumno WHERE id=? AND usuario_id=?", [id, usuario_id]);
    res.json({ message: "Alumno eliminado correctamente" });
    });

    export default app;

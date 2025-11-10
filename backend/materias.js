    import express from "express";
    import { db } from "./db.js";
    import passport from "passport";

    const app = express.Router();

    // Middleware JWT
    const verificarAutenticacion = passport.authenticate("jwt", { session: false });

    //  Listar todas las materias
    app.get("/", verificarAutenticacion, async (req, res) => {
    const [rows] = await db.execute("SELECT * FROM materia");
    res.json(rows);
    });

    // Crear materia
    app.post("/", verificarAutenticacion, async (req, res) => {
    const { nombre, codigo, año } = req.body;

    await db.execute(
        "INSERT INTO materia (nombre, codigo, año) VALUES (?, ?, ?)",
        [nombre, codigo, año]
    );

    res.json({ message: "Materia creada correctamente" });
    });

    //  Modificar materia
    app.put("/:id", verificarAutenticacion, async (req, res) => {
    const { id } = req.params;
    const { nombre, codigo, año } = req.body;

    await db.execute(
        "UPDATE materia SET nombre=?, codigo=?, año=? WHERE id=?",
        [nombre, codigo, año, id]
    );

    res.json({ message: "Materia actualizada correctamente" });
    });

    // Eliminar materia
    app.delete("/:id", verificarAutenticacion, async (req, res) => {
    const { id } = req.params;
    await db.execute("DELETE FROM materia WHERE id=?", [id]);
    res.json({ message: "Materia eliminada correctamente" });
    });

    export default app;

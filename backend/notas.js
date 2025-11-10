    import express from "express";
    import { db } from "./db.js";
    import passport from "passport";

    const app = express.Router();

    // Middleware JWT
    const verificarAutenticacion = passport.authenticate("jwt", { session: false });

    
    // Listar todas las notas
    app.get("/", verificarAutenticacion, async (req, res) => {
    const [rows] = await db.execute(
        `SELECT n.id, a.nombre AS alumno, m.nombre AS materia, 
                n.nota1, n.nota2, n.nota3
        FROM nota n
        JOIN alumno a ON n.alumno_id = a.id
        JOIN materia m ON n.materia_id = m.id`
    );
    res.json(rows);
    });

    // Crear nota
    app.post("/", verificarAutenticacion, async (req, res) => {
    const { alumno_id, materia_id, nota1, nota2, nota3 } = req.body;

    await db.execute(
        "INSERT INTO nota (alumno_id, materia_id, nota1, nota2, nota3) VALUES (?, ?, ?, ?, ?)",
        [alumno_id, materia_id, nota1, nota2, nota3]
    );

    res.json({ message: "Nota registrada correctamente" });
    });

    //  Modificar nota
    app.put("/:id", verificarAutenticacion, async (req, res) => {
    const { id } = req.params;
    const { nota1, nota2, nota3 } = req.body;

    await db.execute(
        "UPDATE nota SET nota1=?, nota2=?, nota3=? WHERE id=?",
        [nota1, nota2, nota3, id]
    );

    res.json({ message: "Nota actualizada correctamente" });
    });

    // Eliminar nota
    app.delete("/:id", verificarAutenticacion, async (req, res) => {
    const { id } = req.params;

    await db.execute("DELETE FROM nota WHERE id=?", [id]);
    res.json({ message: "Nota eliminada correctamente" });
    });

    export default app;

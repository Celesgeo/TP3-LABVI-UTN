    import express from "express";
    import { db } from "./db.js";
    import { verificarToken } from "./middlewares/auth.middleware.js";

    const router = express.Router();

    // ------------------------------------------------------
    // Obtener todos los usuarios (protegido)
    router.get("/", verificarToken, async (req, res) => {
    const [rows] = await db.query("SELECT id, nombre, email FROM usuario");
    res.json(rows);
    });

    // Obtener un usuario por ID (protegido)
    router.get("/:id", verificarToken, async (req, res) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ message: "ID requerido" });
        return;
    }

    const [rows] = await db.query("SELECT id, nombre, email FROM usuario WHERE id = ?", [id]);

    if (rows.length === 0) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
    }

    res.json(rows[0]);
    });

    export default router;

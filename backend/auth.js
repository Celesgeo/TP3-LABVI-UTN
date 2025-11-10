    import express from "express";
    import bcrypt from "bcrypt";
    import jwt from "jsonwebtoken";
    import dotenv from "dotenv";
    import { db } from "./db.js";

    import { validarRegistro, validarLogin } from "./validaciones.js";
    import { validationResult } from "express-validator";

    dotenv.config();
    const app = express.Router();


    export function authConfig() {
    console.log("🛠️ Configuración de autenticación JWT activada");
    }


    app.post("/register", validarRegistro, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const { nombre, email, password } = req.body;

    // Verificar si ya existe el usuario
    const [existe] = await db.query("SELECT * FROM usuario WHERE email = ?", [email]);
    if (existe.length > 0) {
        res.status(400).json({ message: "El email ya está registrado" });
        return;
    }

    // Encriptar contraseña y guardar
    const hashed = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO usuario (nombre, email, password) VALUES (?, ?, ?)", [
        nombre,
        email,
        hashed,
    ]);

    res.status(201).json({ message: "Usuario registrado correctamente" });
    });

    // LOGIN
    app.post("/login", validarLogin, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const { email, password } = req.body;

    const [usuarios] = await db.query("SELECT * FROM usuario WHERE email = ?", [email]);

    if (usuarios.length === 0) {
        res.status(400).json({ message: "Usuario no encontrado" });
        return;
    }

    const user = usuarios[0];
    const passwordValida = await bcrypt.compare(password, user.password);

    if (!passwordValida) {
        res.status(400).json({ message: "Contraseña incorrecta" });
        return;
    }

    const payload = { id: user.id, nombre: user.nombre, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "4h" });

    res.json({
        message: "Login exitoso",
        token,
        usuario: { id: user.id, nombre: user.nombre, email: user.email },
    });
    });

    export default app;

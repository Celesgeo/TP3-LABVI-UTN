import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Registro de usuario
router.post('/register',
    body('username').notEmpty(),
    body('password').isLength({ min: 6 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { username, password } = req.body;
        try {
            const [existing] = await db.query("SELECT * FROM usuarios WHERE username = ?", [username]);
            if (existing.length) return res.status(400).json({ message: 'Usuario ya existe' });

            const hash = await bcrypt.hash(password, 10);
            const [result] = await db.query("INSERT INTO usuarios (username, password) VALUES (?, ?)", [username, hash]);
            res.json({ id: result.insertId, username });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
});

// Login de usuario
router.post('/',  // ⚠️ Cambio aquí para que la ruta completa sea /login
    body('username').notEmpty(),
    body('password').notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { username, password } = req.body;
        try {
            const [users] = await db.query("SELECT * FROM usuarios WHERE username = ?", [username]);
            if (!users.length) return res.status(401).json({ message: 'Usuario no encontrado' });

            const user = users[0];
            const match = await bcrypt.compare(password, user.password);
            if (!match) return res.status(401).json({ message: 'Contraseña incorrecta' });

            const token = jwt.sign(
                { id: user.id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '4h' }
            );
            res.json({ token });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
});

export default router;

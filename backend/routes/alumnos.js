import express from 'express';
import { db } from '../db.js';
import { verifyToken } from '../middlewares/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

router.use(verifyToken);

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM alumnos");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/',
    body('nombre').notEmpty(),
    body('email').isEmail(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { nombre, email } = req.body;
        try {
            const [result] = await db.query("INSERT INTO alumnos (nombre, email) VALUES (?, ?)", [nombre, email]);
            res.json({ id: result.insertId, nombre, email });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, email } = req.body;
    try {
        await db.query("UPDATE alumnos SET nombre=?, email=? WHERE id=?", [nombre, email, id]);
        res.json({ message: 'Alumno actualizado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM alumnos WHERE id=?", [id]);
        res.json({ message: 'Alumno eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

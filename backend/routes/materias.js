import express from 'express';
import { db } from '../db.js';
import { verifyToken } from '../middlewares/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();
router.use(verifyToken);

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM materias");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/',
    body('nombre').notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { nombre } = req.body;
        try {
            const [result] = await db.query("INSERT INTO materias (nombre) VALUES (?)", [nombre]);
            res.json({ id: result.insertId, nombre });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    try {
        await db.query("UPDATE materias SET nombre=? WHERE id=?", [nombre, id]);
        res.json({ message: 'Materia actualizada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM materias WHERE id=?", [id]);
        res.json({ message: 'Materia eliminada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

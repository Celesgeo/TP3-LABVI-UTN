import express from 'express';
import { db } from '../db.js';
import { verifyToken } from '../middlewares/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();
router.use(verifyToken);

// Listar todas las notas
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT n.id, a.nombre AS alumno, m.nombre AS materia, n.nota
            FROM notas n
            JOIN alumnos a ON n.alumno_id = a.id
            JOIN materias m ON n.materia_id = m.id
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Asignar nota
router.post('/',
    body('alumno_id').isInt(),
    body('materia_id').isInt(),
    body('nota').isFloat({ min: 0, max: 10 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { alumno_id, materia_id, nota } = req.body;
        try {
            const [result] = await db.query(
                "INSERT INTO notas (alumno_id, materia_id, nota) VALUES (?, ?, ?)",
                [alumno_id, materia_id, nota]
            );
            res.json({ id: result.insertId, alumno_id, materia_id, nota });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
});

// Modificar nota
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nota } = req.body;
    try {
        await db.query("UPDATE notas SET nota=? WHERE id=?", [nota, id]);
        res.json({ message: 'Nota actualizada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar nota
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM notas WHERE id=?", [id]);
        res.json({ message: 'Nota eliminada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Listar notas por alumno
router.get('/alumno/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT n.id, m.nombre AS materia, n.nota
            FROM notas n
            JOIN materias m ON n.materia_id = m.id
            WHERE n.alumno_id = ?
        `, [id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Listar promedio por alumno
router.get('/alumno/:id/promedio', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT AVG(n.nota) AS promedio
            FROM notas n
            WHERE n.alumno_id = ?
        `, [id]);
        res.json({ alumno_id: id, promedio: rows[0].promedio });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default router;

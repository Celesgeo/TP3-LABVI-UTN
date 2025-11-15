    // backend/routes/register.js
    const express = require('express');
    const router = express.Router();
    const bcrypt = require('bcrypt');
    const pool = require('../db');

    router.post('/', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ msg: 'Faltan datos' });

    try {
        const hash = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO usuarios (username, password) VALUES (?, ?)', [username, hash]);
        res.json({ msg: 'Usuario creado' });
    } catch (err) {
        res.status(500).json({ msg: 'Error del servidor', err });
    }
    });

    module.exports = router;

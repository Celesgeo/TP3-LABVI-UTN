import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // <-- ¡NUEVA IMPORTACIÓN!
import { conectarDB } from './db.js';
import loginRoutes from './routes/login.js';
import alumnosRoutes from './routes/alumnos.js';
import materiasRoutes from './routes/materias.js';
import notasRoutes from './routes/notas.js';

dotenv.config();
const app = express();

// Middleware CORS: Permite que el frontend (ej. localhost:5173) acceda al backend (localhost:3000)
// Esto soluciona el error "Failed to fetch"
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Conexión a la base de datos
await conectarDB();
console.log("Base de datos conectada");

// Rutas
app.use('/login', loginRoutes);      // Login y registro
app.use('/alumnos', alumnosRoutes);
app.use('/materias', materiasRoutes);
app.use('/notas', notasRoutes);

// Manejo de errores para rutas no encontradas
app.use((req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));

// Servidor
app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));
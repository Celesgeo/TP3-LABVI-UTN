import express from "express";
import cors from "cors";
import { db } from "./db.js";
import usuariosRouter from "./usuarios.js";
import authRouter, { authConfig } from "./auth.js";
import materiasRouter from "./materias.js";
import alumnosRouter from "./alumnos.js";
import notasRouter from "./notas.js";

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Configuración de autenticación
authConfig();

// Rutas
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente ");
});

app.use("/usuarios", usuariosRouter);
app.use("/auth", authRouter);
app.use("/materias", materiasRouter);
app.use("/alumnos", alumnosRouter);
app.use("/notas", notasRouter);

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});

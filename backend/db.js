import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Conexión a la base de datos
export const db = await mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "tp3_lab4",
});

console.log("Conectado correctamente a la base de datos:", process.env.DB_NAME);

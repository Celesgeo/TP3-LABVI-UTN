    import jwt from "jsonwebtoken";
    import dotenv from "dotenv";

    dotenv.config();

    export function verificarToken(req, res, next) {
    const header = req.headers.authorization;

    if (!header) {
        res.status(401).json({ message: "Token no proporcionado" });
        return;
    }

    const token = header.split(" ")[1];
    const clave = process.env.JWT_SECRET || "clave_secreta_tp3";

    jwt.verify(token, clave, (error, decoded) => {
        if (error) {
        res.status(403).json({ message: "Token inválido o expirado" });
        return;
        }

        req.user = decoded;
        next();
    });
    }

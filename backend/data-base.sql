    CREATE TABLE `alumnos` (
    `id` int NOT NULL AUTO_INCREMENT,
    `nombre` varchar(100) NOT NULL,
    `apellido` varchar(100) NOT NULL,
    `dni` varchar(20) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `dni` (`dni`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

        CREATE TABLE `materias` (
    `id` int NOT NULL AUTO_INCREMENT,
    `nombre` varchar(100) NOT NULL,
    `codigo` varchar(10) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `codigo` (`codigo`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

        CREATE TABLE `notas` (
    `id` int NOT NULL AUTO_INCREMENT,
    `alumno_id` int DEFAULT NULL,
    `materia_id` int DEFAULT NULL,
    `nota1` decimal(4,2) DEFAULT NULL,
    `nota2` decimal(4,2) DEFAULT NULL,
    `nota3` decimal(4,2) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `alumno_id` (`alumno_id`),
    KEY `materia_id` (`materia_id`),
    CONSTRAINT `notas_ibfk_1` FOREIGN KEY (`alumno_id`) REFERENCES `alumnos` (`id`) ON DELETE CASCADE,
    CONSTRAINT `notas_ibfk_2` FOREIGN KEY (`materia_id`) REFERENCES `materias` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

        CREATE TABLE `usuarios` (
    `id` int NOT NULL AUTO_INCREMENT,
    `username` varchar(50) NOT NULL,
    `password` varchar(255) NOT NULL,
    `rol` enum('admin','profesor','alumno') DEFAULT 'alumno',
    PRIMARY KEY (`id`),
    UNIQUE KEY `username` (`username`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
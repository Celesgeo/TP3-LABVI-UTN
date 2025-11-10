    import { body } from "express-validator";


    // VALIDACIONES DE USUARIOS (Registro y Login)
    export const validarRegistro = [
    body("nombre")
        .notEmpty().withMessage("El nombre es obligatorio")
        .isLength({ min: 2, max: 50 }).withMessage("El nombre debe tener entre 2 y 50 caracteres"),

    body("email")
        .notEmpty().withMessage("El email es obligatorio")
        .isEmail().withMessage("El formato del email no es válido"),

    body("password")
        .notEmpty().withMessage("La contraseña es obligatoria")
        .isLength({ min: 4 }).withMessage("La contraseña debe tener al menos 4 caracteres"),
    ];

    export const validarLogin = [
    body("email")
        .notEmpty().withMessage("El email es obligatorio")
        .isEmail().withMessage("El formato del email no es válido"),

    body("password")
        .notEmpty().withMessage("La contraseña es obligatoria"),
    ];

    // VALIDACIONES DE ALUMNOS
    export const validarAlumno = [
    body("nombre")
        .notEmpty().withMessage("El nombre es obligatorio")
        .isLength({ min: 2, max: 50 }).withMessage("El nombre debe tener entre 2 y 50 caracteres"),

    body("apellido")
        .notEmpty().withMessage("El apellido es obligatorio")
        .isLength({ min: 2, max: 50 }).withMessage("El apellido debe tener entre 2 y 50 caracteres"),

    body("dni")
        .notEmpty().withMessage("El DNI es obligatorio")
        .isLength({ min: 7, max: 11 }).withMessage("El DNI debe tener entre 7 y 11 números")
        .isNumeric().withMessage("El DNI debe contener solo números"),
    ];

    //  VALIDACIONES DE MATERIAS

    export const validarMateria = [
    body("nombre")
        .notEmpty().withMessage("El nombre de la materia es obligatorio")
        .isLength({ min: 2, max: 50 }).withMessage("El nombre debe tener entre 2 y 50 caracteres"),

    body("codigo")
        .notEmpty().withMessage("El código es obligatorio")
        .isLength({ min: 2, max: 20 }).withMessage("El código debe tener entre 2 y 20 caracteres"),

    body("año")
        .notEmpty().withMessage("El año es obligatorio")
        .isInt({ min: 1, max: 6 }).withMessage("El año debe ser un número entre 1 y 6"),
    ];

    // VALIDACIONES DE NOTAS

    export const validarNota = [
    body("alumno_id")
        .notEmpty().withMessage("El ID del alumno es obligatorio")
        .isInt().withMessage("El ID del alumno debe ser numérico"),

    body("materia_id")
        .notEmpty().withMessage("El ID de la materia es obligatorio")
        .isInt().withMessage("El ID de la materia debe ser numérico"),

    body("nota1")
        .optional()
        .isFloat({ min: 0, max: 10 })
        .withMessage("Nota 1 debe ser un número entre 0 y 10"),

    body("nota2")
        .optional()
        .isFloat({ min: 0, max: 10 })
        .withMessage("Nota 2 debe ser un número entre 0 y 10"),

    body("nota3")
        .optional()
        .isFloat({ min: 0, max: 10 })
        .withMessage("Nota 3 debe ser un número entre 0 y 10"),
    ];

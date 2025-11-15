const BASE_URL = 'http://localhost:3000';

// ===================================================
// 1. AUTENTICACIÓN
// ===================================================

export async function login(username, password) {
    const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
        const errorDetail = await res.text();
        throw new Error(`Usuario o contraseña incorrecta: ${errorDetail}`);
    }
    return res.json();
}

export async function register(username, password) {
    const res = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    
    if (!res.ok) {
        const errorText = await res.text(); 
        throw new Error(errorText || 'Error en el proceso de registro');
    }
    
    return res.json();
}

// ===================================================
// 2. OBTENER DATOS (GET)
// ===================================================

export async function obtenerAlumnos(token) {
    const res = await fetch(`${BASE_URL}/alumnos`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('No se pudieron cargar los alumnos');
    return res.json();
}

export async function obtenerMaterias(token) {
    const res = await fetch(`${BASE_URL}/materias`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('No se pudieron cargar las materias');
    return res.json();
}

export async function obtenerNotas(token) {
    const res = await fetch(`${BASE_URL}/notas`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('No se pudieron cargar las notas');
    return res.json();
}

// ===================================================
// 3. CRUD ALUMNOS
// ===================================================

// POST: Crear Alumno
export async function crearAlumno(token, alumnoData) {
    const res = await fetch(`${BASE_URL}/alumnos`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(alumnoData)
    });
    if (!res.ok) throw new Error('Error al crear el alumno');
    return res.json();
}

// PUT: Modificar Alumno
export async function modificarAlumno(token, id, alumnoData) {
    const res = await fetch(`${BASE_URL}/alumnos/${id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(alumnoData)
    });
    if (!res.ok) throw new Error('Error al modificar el alumno');
    return res.json();
}

// DELETE: Eliminar Alumno
export async function eliminarAlumno(token, id) {
    const res = await fetch(`${BASE_URL}/alumnos/${id}`, {
        method: 'DELETE',
        headers: { 
            'Authorization': `Bearer ${token}` 
        }
    });
    if (!res.ok) throw new Error('Error al eliminar el alumno. Asegúrate de que no tenga notas asociadas.');
    return; // Retorna vacío si es exitoso (status 204)
}

// ===================================================
// 4. CRUD MATERIAS (FALTANTE)
// ===================================================

// POST: Crear Materia
export async function crearMateria(token, materiaData) {
    const res = await fetch(`${BASE_URL}/materias`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(materiaData)
    });
    if (!res.ok) throw new Error('Error al crear la materia');
    return res.json();
}

// PUT: Modificar Materia
export async function modificarMateria(token, id, materiaData) {
    const res = await fetch(`${BASE_URL}/materias/${id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(materiaData)
    });
    if (!res.ok) throw new Error('Error al modificar la materia');
    return res.json();
}

// DELETE: Eliminar Materia
export async function eliminarMateria(token, id) {
    const res = await fetch(`${BASE_URL}/materias/${id}`, {
        method: 'DELETE',
        headers: { 
            'Authorization': `Bearer ${token}` 
        }
    });
    if (!res.ok) throw new Error('Error al eliminar la materia. Asegúrate de que no tenga notas asociadas.');
    return;
}

// ===================================================
// 5. CRUD NOTAS (FALTANTE)
// ===================================================

// POST: Crear Nota
export async function crearNota(token, notaData) {
    const res = await fetch(`${BASE_URL}/notas`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(notaData)
    });
    if (!res.ok) throw new Error('Error al crear la nota');
    return res.json();
}

// PUT: Modificar Nota
export async function modificarNota(token, id, notaData) {
    const res = await fetch(`${BASE_URL}/notas/${id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(notaData)
    });
    if (!res.ok) throw new Error('Error al modificar la nota');
    return res.json();
}

// DELETE: Eliminar Nota
export async function eliminarNota(token, id) {
    const res = await fetch(`${BASE_URL}/notas/${id}`, {
        method: 'DELETE',
        headers: { 
            'Authorization': `Bearer ${token}` 
        }
    });
    if (!res.ok) throw new Error('Error al eliminar la nota.');
    return;
}
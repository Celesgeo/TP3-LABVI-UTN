import { useEffect, useState } from 'react';
// RUTA CORREGIDA: Se cambió de '@/api/api.js' a una ruta relativa para resolver el error de compilación.
import { 
    obtenerAlumnos, 
    obtenerMaterias, 
    obtenerNotas,
    crearNota, 
    modificarNota 
} from '../api/api.js'; 

// Este componente consolida el listado de alumnos, la gestión de notas y la consulta de calificaciones.
export default function AlumnosNotas() {
    // Estados para la data
    const [alumnos, setAlumnos] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [notas, setNotas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados para la gestión de notas
    const [selectedAlumno, setSelectedAlumno] = useState('');
    const [selectedMateria, setSelectedMateria] = useState('');
    const [notasForm, setNotasForm] = useState(Array(3).fill('')); // Estado para 3 notas

    const token = localStorage.getItem('token');

    // --- FUNCIONES DE CARGA DE DATOS ---
    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                setError('Sesión expirada o no iniciada.');
                setLoading(false);
                return;
            }
            try {
                // Carga todos los datos necesarios en paralelo
                const [alumnosData, materiasData, notasData] = await Promise.all([
                    obtenerAlumnos(token),
                    obtenerMaterias(token),
                    obtenerNotas(token)
                ]);
                setAlumnos(alumnosData);
                setMaterias(materiasData);
                setNotas(notasData);
            } catch (err) {
                setError(err.message || 'Error al cargar datos necesarios.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    // --- EFECTO DE PRECARGA DE NOTAS ---
    useEffect(() => {
        if (selectedAlumno && selectedMateria) {
            // Busca notas existentes para el alumno y materia seleccionados
            const notasExistentes = notas.find(
                n => n.alumnoId == selectedAlumno && n.materiaId == selectedMateria
            );

            if (notasExistentes) {
                const loadedNotas = [
                    notasExistentes.nota1 || '', 
                    notasExistentes.nota2 || '', 
                    notasExistentes.nota3 || ''
                ];
                setNotasForm(loadedNotas);
            } else {
                setNotasForm(Array(3).fill(''));
            }
        }
    }, [selectedAlumno, selectedMateria, notas]);

    // --- MANEJO DE CAMBIOS Y GUARDADO ---
    const handleNotaChange = (index, value) => {
        // Validación básica: 0 a 10
        const numValue = value === '' ? '' : Math.max(0, Math.min(10, parseInt(value, 10)));
        
        const newNotasForm = [...notasForm];
        newNotasForm[index] = numValue;
        setNotasForm(newNotasForm);
    };

    const handleSaveNotas = async (e) => {
        e.preventDefault();
        if (!selectedAlumno || !selectedMateria) {
            setError("Debe seleccionar un alumno y una materia.");
            return;
        }

        const notaData = {
            alumnoId: parseInt(selectedAlumno),
            materiaId: parseInt(selectedMateria),
            nota1: notasForm[0] !== '' ? notasForm[0] : null,
            nota2: notasForm[1] !== '' ? notasForm[1] : null,
            nota3: notasForm[2] !== '' ? notasForm[2] : null,
        };

        try {
            setLoading(true);
            setError(null);
            
            const notasExistentes = notas.find(
                n => n.alumnoId == selectedAlumno && n.materiaId == selectedMateria
            );

            if (notasExistentes) {
                // Modificar nota existente
                await modificarNota(token, notasExistentes.id, notaData);
            } else {
                // Crear nueva nota
                await crearNota(token, notaData);
            }
            
            // Usar un mensaje personalizado en lugar de alert()
            console.log('Notas guardadas con éxito!'); 
            
            // Recargar todas las notas para actualizar la tabla de consulta
            const updatedNotas = await obtenerNotas(token);
            setNotas(updatedNotas);

        } catch (err) {
            setError(err.message || 'Error al guardar las notas.');
        } finally {
            setLoading(false);
        }
    };
    
    // --- FUNCIÓN UTILITARIA ---
    const calculateAverage = (n1, n2, n3) => {
        const validNotas = [n1, n2, n3].filter(n => n !== null && n !== '');
        if (validNotas.length === 0) return 'N/A';
        const sum = validNotas.reduce((acc, n) => acc + n, 0);
        return (sum / validNotas.length).toFixed(2);
    };

    if (loading && !alumnos.length) {
        return <div className="text-center p-8 text-indigo-600 font-medium">Cargando datos...</div>;
    }

    // --- RENDERIZADO DEL COMPONENTE ---
    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl space-y-10 max-w-7xl mx-auto mt-10">
            <h1 className="text-4xl font-extrabold text-indigo-800 border-b-4 border-indigo-200 pb-4 mb-6">
                📚 Gestión y Consulta de Alumnos y Notas
            </h1>
            
            {error && (
                <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-800 rounded-lg font-medium">{error}</div>
            )}
            
            {/* --- SECCIÓN 1: LISTADO SIMPLE DE ALUMNOS --- */}
            <div className="pt-4 border-t border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">📋 Listado de Alumnos Registrados</h2>
                <div className="overflow-x-auto border rounded-xl shadow-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre Completo</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">DNI</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {alumnos.map(a => (
                                <tr key={a.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{a.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{a.nombre} {a.apellido}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{a.dni}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600">{a.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        {/* Acciones Placeholder */}
                                        <button className="text-indigo-600 hover:text-indigo-900">Editar</button>
                                        <button className="text-red-600 hover:text-red-900">Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <hr className="my-8 border-t-4 border-indigo-100" /> 
            
            {/* --- SECCIÓN 2: FORMULARIO DE GESTIÓN DE NOTAS --- */}
            <h2 className="text-3xl font-bold text-indigo-700 mb-6">📝 Asignación de Calificaciones</h2>
            <form onSubmit={handleSaveNotas} className="p-6 border-4 border-dashed border-indigo-100 rounded-2xl space-y-6 shadow-lg bg-indigo-50/50">
                {/* Selectores */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Selector de Alumno */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Seleccionar Alumno</label>
                        <select 
                            value={selectedAlumno} 
                            onChange={e => { setSelectedAlumno(e.target.value); setError(null); }}
                            className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring-indigo-600 focus:border-indigo-600 transition duration-150"
                        >
                            <option value="">-- Elija un Alumno --</option>
                            {alumnos.map(a => (
                                <option key={a.id} value={a.id}>{a.nombre} {a.apellido} ({a.dni})</option>
                            ))}
                        </select>
                    </div>

                    {/* Selector de Materia */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Seleccionar Materia</label>
                        <select 
                            value={selectedMateria} 
                            onChange={e => { setSelectedMateria(e.target.value); setError(null); }}
                            className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring-indigo-600 focus:border-indigo-600 transition duration-150"
                        >
                            <option value="">-- Elija una Materia --</option>
                            {materias.map(m => (
                                <option key={m.id} value={m.id}>{m.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Campos de Notas */}
                {(selectedAlumno && selectedMateria) && (
                    <div className="pt-6 border-t-2 border-indigo-200 mt-6 space-y-4">
                        <h3 className="text-xl font-bold text-indigo-700">Cargar Notas (1 a 10)</h3>
                        <div className="grid grid-cols-3 gap-6">
                            {[1, 2, 3].map(index => (
                                <div key={index}>
                                    <label className="block text-sm font-medium text-gray-700">Nota {index}</label>
                                    <input 
                                        type="number" 
                                        min="0"
                                        max="10"
                                        value={notasForm[index - 1]}
                                        onChange={e => handleNotaChange(index - 1, e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-xl p-3 text-center text-xl font-bold focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="0-10"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="text-right pt-4">
                            <button 
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
                                disabled={loading}
                            >
                                {loading ? 'Guardando...' : 'Guardar Notas'}
                            </button>
                        </div>
                    </div>
                )}
            </form>

            <hr className="my-8 border-t-4 border-indigo-100" /> 

            {/* --- SECCIÓN 3: TABLA DE CONSULTA DE NOTAS --- */}
            <div className="pt-10">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">📊 Registro de Calificaciones por Materia</h2>
                {notas.length > 0 ? (
                    <div className="overflow-x-auto border-4 border-indigo-50 rounded-2xl shadow-2xl">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-indigo-600 text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-extrabold uppercase tracking-wider">Alumno</th>
                                    <th className="px-6 py-3 text-left text-sm font-extrabold uppercase tracking-wider">Materia</th>
                                    <th className="px-6 py-3 text-center text-sm font-extrabold uppercase tracking-wider">Nota 1</th>
                                    <th className="px-6 py-3 text-center text-sm font-extrabold uppercase tracking-wider">Nota 2</th>
                                    <th className="px-6 py-3 text-center text-sm font-extrabold uppercase tracking-wider">Nota 3</th>
                                    <th className="px-6 py-3 text-center text-sm font-extrabold uppercase tracking-wider bg-indigo-700">Promedio</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {notas.map(n => {
                                    const alumno = alumnos.find(a => a.id === n.alumnoId) || { nombre: 'N/A', apellido: '' };
                                    const materia = materias.find(m => m.id === n.materiaId) || { nombre: 'N/A' };
                                    const promedio = calculateAverage(n.nota1, n.nota2, n.nota3);

                                    return (
                                        <tr key={n.id} className="hover:bg-indigo-50 transition duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{alumno.nombre} {alumno.apellido}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{materia.nombre}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-center font-semibold ${n.nota1 >= 6 ? 'text-green-600' : (n.nota1 !== null ? 'text-red-600' : 'text-gray-400')}`}>{n.nota1 !== null ? n.nota1 : '-'}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-center font-semibold ${n.nota2 >= 6 ? 'text-green-600' : (n.nota2 !== null ? 'text-red-600' : 'text-gray-400')}`}>{n.nota2 !== null ? n.nota2 : '-'}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-center font-semibold ${n.nota3 >= 6 ? 'text-green-600' : (n.nota3 !== null ? 'text-red-600' : 'text-gray-400')}`}>{n.nota3 !== null ? n.nota3 : '-'}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-extrabold text-center bg-indigo-100 ${promedio >= 6 ? 'text-blue-700' : (promedio !== 'N/A' ? 'text-red-700' : 'text-gray-500')}`}>
                                                {promedio}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 p-6 border border-gray-200 rounded-lg">No hay calificaciones registradas aún.</p>
                )}
            </div>
        </div>
    );
}
import { useEffect, useState } from 'react';
import { 
    obtenerAlumnos, 
    obtenerMaterias, 
    obtenerNotas,
    crearNota, 
    modificarNota 
} from '@/api/api.js'; 

export default function Notas() {
    const [alumnos, setAlumnos] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [notas, setNotas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAlumno, setSelectedAlumno] = useState('');
    const [selectedMateria, setSelectedMateria] = useState('');
    const [notasForm, setNotasForm] = useState(Array(3).fill('')); // Estado para 3 notas
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');

    // Carga inicial de alumnos, materias y todas las notas
    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                setError('Sesión expirada o no iniciada.');
                setLoading(false);
                return;
            }
            try {
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

    // Efecto para precargar las notas si se selecciona un alumno y materia
    useEffect(() => {
        if (selectedAlumno && selectedMateria) {
            const notasExistentes = notas.find(
                n => n.alumnoId == selectedAlumno && n.materiaId == selectedMateria
            );

            if (notasExistentes) {
                // Si ya existen notas, cargar los valores en el formulario
                const loadedNotas = [
                    notasExistentes.nota1 || '', 
                    notasExistentes.nota2 || '', 
                    notasExistentes.nota3 || ''
                ];
                setNotasForm(loadedNotas);
            } else {
                // Si no existen, resetear el formulario
                setNotasForm(Array(3).fill(''));
            }
        }
    }, [selectedAlumno, selectedMateria, notas]);

    // Manejo de cambio de notas en el formulario
    const handleNotaChange = (index, value) => {
        // Asegura que el valor sea un número o vacío y dentro del rango (0-10, asumiendo una escala común)
        const numValue = value === '' ? '' : Math.max(0, Math.min(10, parseInt(value, 10)));
        
        const newNotasForm = [...notasForm];
        newNotasForm[index] = numValue;
        setNotasForm(newNotasForm);
    };

    // Manejo del guardado de notas
    const handleSaveNotas = async (e) => {
        e.preventDefault();
        if (!selectedAlumno || !selectedMateria) {
            setError("Debe seleccionar un alumno y una materia.");
            return;
        }

        // Estructura de los datos a enviar
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
                // Modificar (PUT)
                await modificarNota(token, notasExistentes.id, notaData);
            } else {
                // Crear (POST)
                await crearNota(token, notaData);
            }
            
            alert('Notas guardadas con éxito!');
            
            // Recargar todas las notas para actualizar el estado
            const updatedNotas = await obtenerNotas(token);
            setNotas(updatedNotas);

        } catch (err) {
            setError(err.message || 'Error al guardar las notas.');
        } finally {
            setLoading(false);
        }
    };
    
    // Función para calcular el promedio (visualización)
    const calculateAverage = (n1, n2, n3) => {
        const validNotas = [n1, n2, n3].filter(n => n !== null && n !== '');
        if (validNotas.length === 0) return 'N/A';
        const sum = validNotas.reduce((acc, n) => acc + n, 0);
        return (sum / validNotas.length).toFixed(2);
    };

    if (loading && !alumnos.length) {
        return <div className="text-center p-8 text-indigo-600">Cargando datos...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-2xl space-y-8">
            <h1 className="text-3xl font-bold text-indigo-700 border-b pb-4">📝 Asignación y Consulta de Notas</h1>
            
            {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>
            )}

            {/* --- Formulario de Selección y Carga --- */}
            <form onSubmit={handleSaveNotas} className="p-5 border border-gray-200 rounded-xl space-y-4 shadow-md bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Selector de Alumno */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Alumno</label>
                        <select 
                            value={selectedAlumno} 
                            onChange={e => { setSelectedAlumno(e.target.value); setError(null); }}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">-- Elija un Alumno --</option>
                            {alumnos.map(a => (
                                <option key={a.id} value={a.id}>{a.nombre} {a.apellido} ({a.dni})</option>
                            ))}
                        </select>
                    </div>

                    {/* Selector de Materia */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Materia</label>
                        <select 
                            value={selectedMateria} 
                            onChange={e => { setSelectedMateria(e.target.value); setError(null); }}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                    <div className="pt-6 border-t mt-6 space-y-4">
                        <h3 className="text-lg font-semibold text-indigo-600">Cargar Notas (1 a 10)</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {[1, 2, 3].map(index => (
                                <div key={index}>
                                    <label className="block text-sm font-medium text-gray-700">Nota {index}</label>
                                    <input 
                                        type="number" 
                                        min="0"
                                        max="10"
                                        value={notasForm[index - 1]}
                                        onChange={e => handleNotaChange(index - 1, e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2 text-center"
                                        placeholder="0-10"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="text-right pt-4">
                            <button 
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition"
                                disabled={loading}
                            >
                                {loading ? 'Guardando...' : 'Guardar Notas'}
                            </button>
                        </div>
                    </div>
                )}
            </form>

            {/* --- Tabla de Listado de Notas (Visualización) --- */}
            <div className="pt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Registro de Calificaciones</h2>
                {notas.length > 0 ? (
                    <div className="overflow-x-auto border rounded-xl shadow-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-indigo-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Alumno</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Materia</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Nota 1</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Nota 2</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Nota 3</th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-800 uppercase tracking-wider bg-indigo-200">Promedio</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {notas.map(n => {
                                    const alumno = alumnos.find(a => a.id === n.alumnoId) || { nombre: 'N/A', apellido: '' };
                                    const materia = materias.find(m => m.id === n.materiaId) || { nombre: 'N/A' };
                                    const promedio = calculateAverage(n.nota1, n.nota2, n.nota3);

                                    return (
                                        <tr key={n.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{alumno.nombre} {alumno.apellido}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{materia.nombre}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-center font-semibold ${n.nota1 >= 6 ? 'text-green-600' : (n.nota1 !== null ? 'text-red-600' : 'text-gray-400')}`}>{n.nota1 !== null ? n.nota1 : '-'}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-center font-semibold ${n.nota2 >= 6 ? 'text-green-600' : (n.nota2 !== null ? 'text-red-600' : 'text-gray-400')}`}>{n.nota2 !== null ? n.nota2 : '-'}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-center font-semibold ${n.nota3 >= 6 ? 'text-green-600' : (n.nota3 !== null ? 'text-red-600' : 'text-gray-400')}`}>{n.nota3 !== null ? n.nota3 : '-'}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-extrabold text-center bg-indigo-50 ${promedio >= 6 ? 'text-blue-700' : (promedio !== 'N/A' ? 'text-red-700' : 'text-gray-500')}`}>
                                                {promedio}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 p-4 border rounded-lg">No hay calificaciones registradas aún.</p>
                )}
            </div>
        </div>
    );
}
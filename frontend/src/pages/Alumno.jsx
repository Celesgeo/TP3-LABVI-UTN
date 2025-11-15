import { useEffect, useState } from 'react';
import { obtenerAlumnos, crearAlumno, modificarAlumno, eliminarAlumno } from '@/api/api.js';
import Modal from '@/components/Modal.jsx'; // Importamos el Modal

export default function Alumno() {
    const [alumnos, setAlumnos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentAlumno, setCurrentAlumno] = useState(null); // Alumno para edición o null para alta
    
    const token = localStorage.getItem('token'); 

    // Función de carga principal
    const fetchAlumnos = async () => {
        if (!token) {
            setError('Error: Sesión expirada o no iniciada.');
            setLoading(false);
            return;
        }
        setError(null);
        try {
            const data = await obtenerAlumnos(token);
            setAlumnos(data);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Error al cargar los alumnos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlumnos();
    }, [token]);


    // --- Manejo del Modal ---
    const handleOpenModal = (alumno = null) => {
        setCurrentAlumno(alumno);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setCurrentAlumno(null);
    };

    // --- Lógica CRUD ---

    const handleSaveAlumno = async (formData) => {
        try {
            setLoading(true);
            if (currentAlumno) {
                // Modificación (PUT)
                await modificarAlumno(token, currentAlumno.id, formData);
            } else {
                // Alta (POST)
                await crearAlumno(token, formData);
            }
            // Recargar la lista después del éxito
            await fetchAlumnos();
            handleCloseModal();
        } catch (err) {
            console.error('Error al guardar:', err);
            setError(err.message || 'Error al guardar los datos del alumno.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAlumno = async (id) => {
        // Ejecuta la eliminación directamente para evitar el bloqueo de window.confirm()
        
        try {
            setLoading(true);
            await eliminarAlumno(token, id);
            // Actualizar el estado localmente
            setAlumnos(alumnos.filter(a => a.id !== id));
        } catch (err) {
            console.error('Error al eliminar:', err);
            setError(err.message || 'Error al eliminar el alumno.');
        } finally {
            setLoading(false);
        }
    };

    // --- Componente de Formulario (Inline para simplicidad) ---
    const AlumnoForm = ({ alumno, onSave, onClose }) => {
        const [formData, setFormData] = useState({
            nombre: alumno?.nombre || '',
            apellido: alumno?.apellido || '',
            dni: alumno?.dni || '',
            email: alumno?.email || ''
        });
        const [formError, setFormError] = useState(null);

        const handleChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            if (!formData.nombre || !formData.dni || !formData.email) {
                setFormError('Todos los campos son obligatorios.');
                return;
            }
            onSave(formData);
        };

        return (
            <form onSubmit={handleSubmit} className="space-y-4">
                {formError && <div className="p-2 bg-red-100 text-red-700 rounded-lg">{formError}</div>}
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Apellido</label>
                    <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">DNI</label>
                    <input type="text" name="dni" value={formData.dni} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button type="button" onClick={onClose} className="py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                        Cancelar
                    </button>
                    <button type="submit" className="py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </form>
        );
    };
    
    if (loading && !alumnos.length) {
        return <div className="text-center text-indigo-600">Cargando alumnos...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
                <h1 className="text-3xl font-bold text-indigo-600">Listado de Alumnos</h1>
                <button 
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition duration-150"
                    onClick={() => handleOpenModal(null)} // Abrir para nuevo alumno
                >
                    + Nuevo Alumno
                </button>
            </div>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}

            <div className="overflow-x-auto">
                {alumnos.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-indigo-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {alumnos.map((alumno) => (
                                <tr key={alumno.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{alumno.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{alumno.nombre} {alumno.apellido}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{alumno.dni}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{alumno.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button 
                                            className="text-indigo-600 hover:text-indigo-900" 
                                            onClick={() => handleOpenModal(alumno)} // Abrir para edición
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            className="text-red-600 hover:text-red-900" 
                                            onClick={() => handleDeleteAlumno(alumno.id)}
                                            disabled={loading}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center text-gray-500 py-4">No se encontraron alumnos registrados.</p>
                )}
            </div>

            {/* Modal de Alta/Edición de Alumno */}
            <Modal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                title={currentAlumno ? `Editar Alumno: ${currentAlumno.nombre}` : 'Alta de Nuevo Alumno'}
            >
                <AlumnoForm 
                    alumno={currentAlumno} 
                    onSave={handleSaveAlumno} 
                    onClose={handleCloseModal} 
                />
            </Modal>
        </div>
    );
}
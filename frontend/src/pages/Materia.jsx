import { useEffect, useState } from 'react';
import { obtenerMaterias, crearMateria, modificarMateria, eliminarMateria } from '@/api/api.js'; 
import Modal from '@/components/Modal.jsx';

export default function Materia() {
    const [materias, setMaterias] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentMateria, setCurrentMateria] = useState(null); // Materia para edición o null para alta

    const token = localStorage.getItem('token');

    // Función de carga principal
    const fetchMaterias = async () => {
        if (!token) {
            setError('Error: Sesión expirada o no iniciada.');
            setLoading(false);
            return;
        }
        setError(null);
        try {
            const data = await obtenerMaterias(token);
            setMaterias(data);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Error al cargar las materias.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaterias();
    }, [token]);

    // --- Manejo del Modal ---
    const handleOpenModal = (materia = null) => {
        setCurrentMateria(materia);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setCurrentMateria(null);
    };
    
    // --- Lógica CRUD ---

    const handleSaveMateria = async (formData) => {
        try {
            setLoading(true);
            if (currentMateria) {
                // Modificación (PUT)
                await modificarMateria(token, currentMateria.id, formData);
            } else {
                // Alta (POST)
                await crearMateria(token, formData);
            }
            // Recargar la lista después del éxito
            await fetchMaterias();
            handleCloseModal();
        } catch (err) {
            console.error('Error al guardar:', err);
            setError(err.message || 'Error al guardar los datos de la materia.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMateria = async (id) => {
        // En este entorno, la eliminación es directa.
        
        try {
            setLoading(true);
            await eliminarMateria(token, id);
            // Actualizar el estado localmente
            setMaterias(materias.filter(m => m.id !== id));
        } catch (err) {
            console.error('Error al eliminar:', err);
            setError(err.message || 'Error al eliminar la materia. Asegúrate de que no tenga notas asociadas.');
        } finally {
            setLoading(false);
        }
    };

    // --- Componente de Formulario (Inline para simplicidad) ---
    const MateriaForm = ({ materia, onSave, onClose }) => {
        const [formData, setFormData] = useState({
            nombre: materia?.nombre || '',
            descripcion: materia?.descripcion || '',
        });
        const [formError, setFormError] = useState(null);

        const handleChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            if (!formData.nombre || !formData.descripcion) {
                setFormError('El nombre y la descripción son obligatorios.');
                return;
            }
            onSave(formData);
        };

        return (
            <form onSubmit={handleSubmit} className="space-y-4">
                {formError && <div className="p-2 bg-red-100 text-red-700 rounded-lg">{formError}</div>}
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre de la Materia</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} required rows="3" className="mt-1 block w-full border border-gray-300 rounded-md p-2"></textarea>
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

    if (loading && !materias.length) {
        return <div className="text-center text-indigo-600">Cargando materias...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
                <h1 className="text-3xl font-bold text-indigo-600">Catálogo de Materias</h1>
                <button 
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition duration-150"
                    onClick={() => handleOpenModal(null)} // Abrir para nueva materia
                >
                    + Nueva Materia
                </button>
            </div>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}

            <div className="overflow-x-auto">
                {materias.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-indigo-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {materias.map((materia) => (
                                <tr key={materia.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{materia.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{materia.nombre}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{materia.descripcion}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button 
                                            className="text-indigo-600 hover:text-indigo-900" 
                                            onClick={() => handleOpenModal(materia)} // Abrir para edición
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            className="text-red-600 hover:text-red-900" 
                                            onClick={() => handleDeleteMateria(materia.id)}
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
                    <p className="text-center text-gray-500 py-4">No se encontraron materias registradas.</p>
                )}
            </div>

            {/* Modal de Alta/Edición de Materia */}
            <Modal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                title={currentMateria ? `Editar Materia: ${currentMateria.nombre}` : 'Alta de Nueva Materia'}
            >
                <MateriaForm 
                    materia={currentMateria} 
                    onSave={handleSaveMateria} 
                    onClose={handleCloseModal} 
                />
            </Modal>
        </div>
    );
}
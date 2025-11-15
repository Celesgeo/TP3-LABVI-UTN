import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Eliminar el token y redirigir al login
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <nav className="bg-indigo-700 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/alumnos" className="text-white text-xl font-bold tracking-wider">
                            UTN - Gestión Académica
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to="/alumnos" className="text-indigo-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150">
                            Alumnos
                        </Link>
                        <Link to="/materias" className="text-indigo-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150">
                            Materias
                        </Link>
                        <Link to="/notas" className="text-indigo-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150">
                            Notas
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium shadow-md transition duration-150"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
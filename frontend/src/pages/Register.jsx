import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/api.js'; 

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!username || !password) {
            setError('Por favor, ingresa un nombre de usuario y una contraseña.');
            return;
        }

        try {
            await register(username, password);
            setSuccess(true);
            
            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (err) {
            console.error('Error de registro:', err);
            setError(err.message || 'Fallo en el registro. Inténtalo de nuevo.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
                <h2 className="text-3xl font-extrabold text-center text-indigo-600">
                    Registrar Nuevo Usuario
                </h2>
                
                {error && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                        ¡Registro exitoso! Redirigiendo al inicio de sesión...
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Usuario
                        </label>
                        <input
                            id="username"
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    >
                        Registrarse
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600">
                    ¿Ya tienes una cuenta? <button onClick={() => navigate('/')} className="font-medium text-indigo-600 hover:text-indigo-500">Inicia Sesión</button>
                </p>
            </div>
        </div>
    );
}
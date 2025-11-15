import Navbar from './Navbar.jsx';
import { Outlet } from 'react-router-dom'; // Importante: Usar Outlet para rutas anidadas

export default function Layout() {
    // Ya no se necesita 'children' como prop en este contexto de rutas anidadas
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Outlet renderiza el componente de la ruta anidada actual */}
                <Outlet /> 
            </main>
        </div>
    );
}
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');

    // Si no hay token, redirige al login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Si hay token, muestra los componentes hijos
    return children;
}

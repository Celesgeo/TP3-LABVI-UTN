import { useState } from 'react';
import { login } from '../api/api.js';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(username, password);
            localStorage.setItem('token', data.token);
            navigate('/alumnos');
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={username} onChange={e => setUsername(e.target.value)} required />
                <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit">Ingresar</button>
            </form>
        </div>
    );
}

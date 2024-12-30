// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {  // Prinde onLogin ca prop
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:4000/auth/login', {
                username,
                password,
            });
            console.log('Login successful:', response.data);
            onLogin(username);  // Apelează funcția onLogin din props
            navigate('/home');
        } catch (error) {
            console.error('Error logging in:', error);
            setError('A apărut o eroare la autentificare. Te rugăm să încerci din nou.');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <input 
                    type="text" 
                    placeholder="Nume de utilizator" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Parola" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit">Login</button>
            </form>
            <div>
                <h3>Sau logare cu Google</h3>
                <a href="http://localhost:4000/auth/google">
                    <button>Logare cu Google</button>
                </a>
            </div>
            <div>
                <p>
                    Nu ai un cont? <Link to="/signup">Creează-ți cont aici</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;

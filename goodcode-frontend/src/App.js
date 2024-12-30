import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Problems from './components/Problems';
import Rankings from './components/Rankings';
import Profile from './components/Profile';
import ProblemDetail from './components/ProblemDetail'; 
import ProblemDetail1 from './components/ProblemDetail1';
import ProblemDetail2 from './components/ProblemDetail2';
import ProblemDetail3 from './components/ProblemDetail3';
import ProblemDetail4 from './components/ProblemDetail4';
import ProblemDetail5 from './components/ProblemDetail5';
import ProblemDetail6 from './components/ProblemDetail6';
import ProblemDetail7 from './components/ProblemDetail7';
import ProblemDetail8 from './components/ProblemDetail8';
import ProblemDetail9 from './components/ProblemDetail9';
import Navbar from './components/Navbar';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');

    // Check local storage for authentication status and username on mount
    useEffect(() => {
        const storedAuth = localStorage.getItem('isAuthenticated');
        const storedUsername = localStorage.getItem('username');

        console.log("Stored Auth:", storedAuth);
        console.log("Stored Username:", storedUsername);

        if (storedAuth === 'true' && storedUsername) {
            setIsAuthenticated(true);
            setUsername(storedUsername);
            console.log("User is authenticated:", storedUsername);
        } else {
            console.log("User is not authenticated.");
        }
    }, []);

    const handleLogin = (user) => {
        setIsAuthenticated(true);
        setUsername(user);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', user);
        console.log("User logged in:", user);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUsername('');
        localStorage.setItem('isAuthenticated', 'false');
        localStorage.removeItem('username');
        console.log("User logged out.");
    };

    const ProblemDetailWrapper = () => {
        const { id } = useParams();
        if (id === '1') {
            return <ProblemDetail />;
        } else if (id === '2') {
            return <ProblemDetail1 />;
        } 
        else if (id === '3') {
            return <ProblemDetail2 />;
        } 
        else if (id === '4') {
            return <ProblemDetail3 />;
        }
        else if (id === '5') {
            return <ProblemDetail4 />;
        } 
        else if (id === '6') {
            return <ProblemDetail5 />;
        } 
        else if (id === '7') {
            return <ProblemDetail6 />;
        } 
        else if (id === '8') {
            return <ProblemDetail7 />;
        } 
        else if (id === '9') {
            return <ProblemDetail8 />;
        } 
        else if (id === '10') {
            return <ProblemDetail9 />;
        } 
        else {
            return <div>Problema cu ID-ul {id} nu este disponibilă.</div>;
        }
    };

    return (
        <Router>
            <div>
                {isAuthenticated && <Navbar username={username} onLogout={handleLogout} />}
                <Routes>
                    <Route 
                        path="/" 
                        element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/home" />} 
                    />
                    <Route 
                        path="/home" 
                        element={isAuthenticated ? <Home username={username} /> : <Navigate to="/" />} 
                    />
                    <Route path="/signup" element={<Signup />} />
                    <Route 
                        path="/problems" 
                        element={isAuthenticated ? <Problems username={username} /> : <Navigate to="/" />} 
                    />
                    <Route 
                        path="/problem/:id" 
                        element={isAuthenticated ? <ProblemDetailWrapper /> : <Navigate to="/" />} // Adaugă ruta pentru detaliile problemei
                    />
                    <Route 
                        path="/rankings" 
                        element={isAuthenticated ? <Rankings username={username} /> : <Navigate to="/" />} 
                    />
                    <Route 
                        path="/profile/:username" 
                        element={isAuthenticated ? <Profile username={username} /> : <Navigate to="/" />} 
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
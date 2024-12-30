// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ username, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/'); // Redirecționează utilizatorul la pagina de login
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <div className="navbar-logo">
                    <Link to="/">GoodCode</Link>
                </div>
                <ul className="navbar-links">
                    <li>
                        <Link to="/rankings">Clasament</Link>
                    </li>
                    <li>
                        <Link to="/problems">Probleme</Link>
                    </li>
                </ul>
            </div>
            <div className="navbar-right">
                <div className="navbar-user">
                    <Link to={`/profile/${username}`} className="username-link">
                        {username}
                    </Link>
                    <button onClick={handleLogout} className="logout-button">
                        Deconectare
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

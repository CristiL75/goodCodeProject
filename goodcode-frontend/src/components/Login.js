// src/components/Login.js
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./styles/login.css";
import { useEffect } from "react";

const Login = ({ onLogin }) => {
  useEffect(() => {
    // Adaugă o clasă pe body la montare
    document.body.classList.add("login-page");

    // Elimină clasa la demontare
    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);
  // Prinde onLogin ca prop
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:4000/auth/login", {
        username,
        password,
      });
      console.log("Login successful:", response.data);
      onLogin(username); // Apelează funcția onLogin din props
      navigate(`/home?user=${username}`);
    } catch (error) {
      console.error("Error logging in:", error);
      setError(
        "A apărut o eroare la autentificare. Te rugăm să încerci din nou."
      );
    }
  };

  return (
    <div className="login--container">
      <h2 className="h2--lgn">Login</h2>
      {error && <p className="err-lgn">{error}</p>}
      <form className="form--lgn" onSubmit={handleLogin}>
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
      <div className="login--google">
        <h3>Sau logare cu Google</h3>
        <a href="http://localhost:4000/auth/google">
          <button>Logare cu Google</button>
        </a>
      </div>
      <div className="login--signup">
        <p className="noAcc--lgn">
          Nu ai un cont? <Link to="/signup">Creează-ți cont aici</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

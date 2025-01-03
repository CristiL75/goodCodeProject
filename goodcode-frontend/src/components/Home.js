// src/components/Home.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./styles/home.css";

const Home = () => {
  const [username, setUsername] = useState("");
  const location = useLocation(); // Get the current URL location

  useEffect(() => {
    // Try to load the username from localStorage on component mount
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    // Parse the query parameters to get the 'user' parameter
    const queryParams = new URLSearchParams(location.search);
    const user = queryParams.get("user"); // Get the value of 'user'
    if (user) {
      setUsername(user); // Store the username in state
      localStorage.setItem("username", user); // Save the username to localStorage
    }
  }, [location.search]);

  useEffect(() => {
    // Adaugă o clasă pe body la montare
    document.body.classList.add("home-page");

    // Elimină clasa la demontare
    return () => {
      document.body.classList.remove("home-page");
    };
  }, []);

  return (
    <div className="home--container">
      <h1>Bun venit pe pagina principală, {username}!</h1>
      <p>
        De aici poti accesa probleme de coding, clasamentul cu punctele din urma
        obtinerii punctelor pentru aceste probleme si chiar pagina propriului
        profil
      </p>
    </div>
  );
};

export default Home;

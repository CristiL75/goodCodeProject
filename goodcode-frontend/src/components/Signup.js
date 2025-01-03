import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // for React Router v6
import "./styles/singup.css";
import { useEffect } from "react";

const Signup = () => {
  useEffect(() => {
    // Adaugă o clasă pe body la montare
    document.body.classList.add("singup-page");

    // Elimină clasa la demontare
    return () => {
      document.body.classList.remove("singup-page");
    };
  }, []);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:4000/signup", {
        username,
        email,
        password,
        confirmPassword,
      });

      if (response.status === 201) {
        alert(response.data?.message || "Signed up successfully!");
        navigate("/home");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      setErrorMessage(error.response?.data?.error || "Unknown error occurred");
    } finally {
      setLoading(false); // Asigură-te că se întâmplă și în caz de eroare
    }
  };

  return (
    <div className="singup--container">
      <h2 className="h2--sgn">Sing up</h2>
      <form className="form--singup" onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {errorMessage && errorMessage.includes("Username already exists") && (
            <div style={{ color: "red" }}>{errorMessage}</div>
          )}
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && !errorMessage.includes("Username already exists") && (
          <div style={{ color: "red" }}>{errorMessage}</div>
        )}
        <button className="singup--btn" type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Signup;

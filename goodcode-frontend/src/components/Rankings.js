import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./styles/ranking.css";

const Rankings = ({ username }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/users");
        // Sortăm utilizatorii în funcție de totalSolved în ordine descrescătoare
        const sortedUsers = response.data.sort(
          (a, b) => b.totalSolved - a.totalSolved
        );
        setUsers(sortedUsers);
      } catch (error) {
        console.error("Eroare la obținerea utilizatorilor:", error);
        setError(error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Adaugă o clasă pe body la montare
    document.body.classList.add("rankings-page");

    // Elimină clasa la demontare
    return () => {
      document.body.classList.remove("rankings-page");
    };
  }, []);

  if (error) {
    return (
      <div className="err-rankings">
        Eroare la obținerea utilizatorilor: {error.message}
      </div>
    );
  }

  return (
    <div className="rankings--container">
      <h1>Rankings</h1>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Total Solved</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                <Link to={`/profile/${user.username}`}>{user.username}</Link>
              </td>
              <td>{user.email}</td>
              <td>{user.totalSolved}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Rankings;

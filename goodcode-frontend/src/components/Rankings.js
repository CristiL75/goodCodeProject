import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Rankings = ({ username }) => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Eroare la obținerea utilizatorilor:', error);
                setError(error);
            }
        };

        fetchUsers();
    }, []);

    if (error) {
        return <div>Eroare la obținerea utilizatorilor: {error.message}</div>;
    }

    return (
        <div>
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
                    {users.map(user => (
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
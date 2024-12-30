import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const { username } = useParams(); // Obține username-ul din URL
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/users/${username}`);
                setUser(response.data);
            } catch (err) {
                console.error(err);
                setError('User not found');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [username]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Profil utilizator: {user.username}</h2>
            <p>Email: {user.email}</p>
            <p>Total probleme rezolvate: {user.totalSolved}</p>
            <h3>Probleme rezolvate:</h3>
            <ul>
                {user.solvedProblems.map(problem => (
                    <li key={problem._id}>
                        <p>ID Problemă: {problem.problemId}</p>
                        <p>Limbaj: {problem.language}</p>
                        <p>Data rezolvării: {new Date(problem.solvedAt).toLocaleString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Profile;
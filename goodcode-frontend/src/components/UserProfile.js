import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/users/profile/${username}`);
                setProfile(response.data);
            } catch (error) {
                setError('Eroare la obținerea profilului utilizatorului.');
            }
        };
        fetchProfile();
    }, [username]);

    if (error) return <p>{error}</p>;
    if (!profile) return <p>Se încarcă profilul...</p>;

    return (
        <div>
            <h2>Profilul lui {profile.username}</h2>
            <p>Nume: {profile.firstName} {profile.lastName}</p>
            <p>Scor: {profile.score}</p>
            {/* Adaugă alte detalii necesare despre utilizator */}
        </div>
    );
};

export default UserProfile;

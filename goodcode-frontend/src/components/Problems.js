import React from 'react';
import { useNavigate } from 'react-router-dom';

const Problems = ({ username }) => {
    const navigate = useNavigate();

    const problems = {
        1: {
            id: 1,
            title: 'Suma a două numere',
            difficulty: 'Ușor',
        },
        2: {
            id: 2,
            title: 'Adună două numere',
            difficulty: 'Mediu',
        },
        3: {
            id: 3,
            title: 'Cel mai lung subșir fără caractere repetate',
            difficulty: 'Mediu',
        },
        4: {
            id: 4,
            title: 'Mediana a două array-uri sortate',
            difficulty: 'Grea',
        },
        5: {
            id: 5,
            title: 'Cel mai lung subsir palindromic',
            difficulty: 'Mediu',
        },
        6: {
            id: 6,
            title: 'Conversie în zigzag',
            difficulty: 'Mediu',
        },
        7: {
            id: 7,
            title: 'Inversarea unui număr întreg',
            difficulty: 'Mediu',
        },
        8: {
            id: 8,
            title: 'Conversie de șir de caractere la număr întreg (atoi)',
            difficulty: 'Mediu',
        },
        9: {
            id: 9,
            title: 'Număr palindrom',
            difficulty: 'Ușor',
        },
        10: {
            id: 10,
            title: 'Potrivire cu expresie regulată',
            difficulty: 'Grea',
        },
    };

    const handleClick = (id) => {
        navigate(`/problem/${id}`); // Navighează către pagina problemei
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Problems Page</h1>
            <p>Bine ai venit, {username}!</p>
            {Object.values(problems).map((problem) => (
                <div
                    key={problem.id}
                    onClick={() => handleClick(problem.id)}
                    style={{
                        padding: '15px',
                        margin: '10px 0',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        backgroundColor: '#f9f9f9',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f1f1'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                >
                    <h2 style={{ color: '#007BFF', margin: 0 }}>{problem.title}</h2>
                    <p style={{ margin: '5px 0', color: '#555' }}>
                        Dificultate: <span style={{ color: problem.difficulty === 'Ușor' ? 'green' : problem.difficulty === 'Mediu' ? 'orange' : 'red' }}>{problem.difficulty}</span>
                    </p>
                </div>
            ))}
        </div>
    );
};

export default Problems;
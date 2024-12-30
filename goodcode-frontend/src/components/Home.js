// src/components/Home.js
import React from 'react';

const Home = ({ username }) => {
    return (
        <div>
            <h1>Bun venit pe pagina principală, {username}!</h1>
            <p>Aici este conținutul paginii tale de home.</p>
        </div>
    );
};

export default Home;

// Importă pachetele necesare
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const User = require('./models/User'); // Importă modelul User
require('dotenv').config();
require('./passport'); // Configurare Passport

const app = express();


// Middleware CORS
app.use(cors({
    origin: ['http://localhost:3001', 'http://localhost:3000'], // Adaugă originile necesare
    credentials: true
}));

// Middleware pentru procesarea cererilor JSON și URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurarea sesiunii
app.use(session({
    secret: process.env.JWT_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Conectare la MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/appDB')
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// Middleware pentru logarea cererilor
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
});

// Ruta principală
app.get('/', (req, res) => {
    res.send('Welcome! Please <a href="/auth/google">login with Google</a>.');
});

// Ruta pentru autentificarea cu Google
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback după autentificare cu Google
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        console.log('Authenticated user:', req.user);
        res.redirect(`http://localhost:3001/home?user=${req.user.username}`);
    }
);

// Ruta pentru deconectare
app.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) { console.error(err); }
        res.redirect('/');
    });
});

// Ruta pentru înregistrare (signup)
app.post('/signup', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    try {
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match." });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // Redirecționare către pagina de acasă
        res.redirect(`http://localhost:3001/home?user=${newUser.username}`);
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});


// Ruta pentru login
app.post('/auth/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return res.status(500).json({ error: "Internal server error." });
        if (!user) return res.status(400).json({ error: info.message });

        req.logIn(user, (err) => {
            if (err) return res.status(500).json({ error: "Internal server error." });
            res.status(200).json({ message: "Login successful.", user });
        });
    })(req, res, next);
});

// Ruta pentru obținerea informațiilor despre un utilizator
app.get('/api/users/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({}, 'username email totalSolved'); // Selectează doar câmpurile necesare
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Endpoint pentru a adăuga o problemă rezolvată pentru utilizator
app.post('/api/solved-problems', async (req, res) => {
    const { userId, problemId } = req.body;  // Obținem datele din corpul cererii

    try {
        // Căutăm utilizatorul în baza de date după username
        const user = await User.findOne({ username: userId });

        if (!user) {
            return res.status(404).json({ message: 'Utilizatorul nu a fost găsit.' });
        }

        // Verificăm dacă utilizatorul a rezolvat deja această problemă
        const existingSolvedProblem = user.solvedProblems.find(problem => 
            problem._id && problem._id.toString() === problemId.toString()
        );
        if (existingSolvedProblem) {
            return res.status(400).json({ message: 'Problema a fost deja rezolvată.' });
        }
        // Creăm obiectul cu detalii despre problema rezolvată
        const newSolvedProblem = {
            problemId,
            solvedAt: new Date(),  // Data rezolvării
 
        };

        // Adăugăm problema rezolvată la lista de probleme ale utilizatorului
        user.solvedProblems.push(newSolvedProblem);

        // Actualizăm numărul total de probleme rezolvate
        user.totalSolved += 1;

        // Salvăm utilizatorul cu problema adăugată
        await user.save();

        // Răspundem cu succes
        res.status(201).json({ message: 'Problema a fost adăugată la lista de probleme rezolvate.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Eroare la adăugarea problemei rezolvate.' });
    }
});



// Endpoint pentru a înregistra o problemă rezolvată
// Endpoint pentru a înregistra o problemă rezolvată


// Adaugă o problemă rezolvată pentru utilizator

// Pornirea serverului
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

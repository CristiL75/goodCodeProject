const mongoose = require('mongoose');

// Schema pentru probleme rezolvate
const solvedProblemSchema = new mongoose.Schema({
    problemId: { type: String}, // ID-ul problemei (referință la schema Problem)
    language: { type: String, required: false },  // Limbajul utilizat                  
    solvedAt: { type: Date, default: Date.now }  // Data și ora rezolvării
});

// Schema pentru utilizator
const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: function() { return !this.googleId; }, // Dacă există googleId, nu mai este necesar username
        unique: true // Asigurăm unicitatea username-ului
    },
    email: { 
        type: String, 
        required: true, 
        unique: true // Asigurăm unicitatea email-ului
    },
    password: { 
        type: String, 
        required: function() { return !this.googleId; }, // Parola necesară doar pentru utilizatorii care nu folosesc Google
    },
    googleId: { 
        type: String, 
        unique: true, // Asigurăm unicitatea googleId-ului
    },
    solvedProblems: [solvedProblemSchema],  // Problemele rezolvate de utilizator
    totalSolved: { 
        type: Number, 
        default: 0, // Numărul total de probleme rezolvate
        min: 0 
    }
});

// Actualizare totalSolved la fiecare adăugare a unei noi probleme rezolvate
userSchema.pre('save', function(next) {
    if (this.isModified('solvedProblems') || this.isNew) {
        this.totalSolved = this.solvedProblems.length; // Calculăm totalSolved pe baza numărului de probleme rezolvate
    }
    next();
});

// Crearea modelului User
const User = mongoose.model('User', userSchema);

module.exports = User;

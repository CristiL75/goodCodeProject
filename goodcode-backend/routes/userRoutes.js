
router.get('/profile/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Utilizatorul nu a fost găsit' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Eroare la obținerea profilului utilizatorului' });
    }
});

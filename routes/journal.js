const express = require('express');
const router = express.Router();
const Journal = require('../models/journal');

// Middleware: Only allow logged-in users
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    req.flash('error_msg', 'Please log in to access that page');
    res.redirect('/login');
}

// GET: All journals - /journals
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const journals = await Journal.find();
        res.render('journals/index', { journals });
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong fetching journals');
    }
});

// GET: Form to create new journal - /journals/new
router.get('/new', ensureAuthenticated, (req, res) => {
    res.render('journals/new');
});

// POST: Create a new journal - /journals
router.post('/', ensureAuthenticated, async (req, res) => {
    const { destination, arrivalDate, departureDate, experience, rating } = req.body;
    const journal = new Journal({
        destination,
        arrivalDate,
        departureDate,
        experience,
        rating
    });

    try {
        await journal.save();
        res.redirect('/journals');
    } catch (err) {
        console.error(err);
        res.status(400).send('Failed to create journal');
    }
});

// GET: View single journal - /journals/:id
router.get('/:id', ensureAuthenticated, async (req, res) => {
    try {
        const journal = await Journal.findById(req.params.id);
        if (!journal) return res.status(404).send('Journal not found');
        res.render('journals/show', { journal });
    } catch (err) {
        console.error(err);
        res.status(404).send('Error fetching journal');
    }
});

// GET: Edit form - /journals/:id/edit
router.get('/:id/edit', ensureAuthenticated, async (req, res) => {
    try {
        const journal = await Journal.findById(req.params.id);
        if (!journal) return res.status(404).send('Journal not found');
        res.render('journals/edit', { journal });
    } catch (err) {
        console.error(err);
        res.status(404).send('Error loading edit form');
    }
});

// PUT: Update journal - /journals/:id
router.put('/:id', ensureAuthenticated, async (req, res) => {
    const { arrivalDate, departureDate, experience, rating } = req.body;
    try {
        await Journal.findByIdAndUpdate(req.params.id, {
            arrivalDate,
            departureDate,
            experience,
            rating
        });
        res.redirect(`/journals/${req.params.id}`);
    } catch (err) {
        console.error(err);
        res.status(400).send('Error updating journal');
    }
});

// DELETE: Remove journal - /journals/:id
router.delete('/:id', ensureAuthenticated, async (req, res) => {
    try {
        await Journal.findByIdAndDelete(req.params.id);
        res.redirect('/journals');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting journal');
    }
});

module.exports = router;

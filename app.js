const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const authRoutes = require('./routes/auth');
const journalRoutes = require('./routes/journal');

require('./passportConfig')(passport);

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/travelJournalApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error(err));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(session({
    secret: 'secret123',
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Global variables for views
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// ROUTES
app.get('/', (req, res) => {
    console.log('🏠 Home route hit');
    res.render('home'); // 🛠️ Make sure views/home.ejs exists
});
app.use('/', authRoutes);             // /login, /register
app.use('/journals', journalRoutes); // /journals routes

// 404 route
app.use((req, res) => {
    res.status(404).render('404'); // 🛠️ Make sure views/404.ejs exists
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server @ http://localhost:${PORT}`));

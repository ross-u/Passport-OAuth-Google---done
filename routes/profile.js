const router = require('express').Router();

const checkIfAuthenticated = (req, res, next) => {
    if (!req.user) res.redirect('/login');
    else next();
};

// GET	'/profile'
router.get('/', checkIfAuthenticated, (req, res) => {
    res.render('profile', { user: req.user });
});


module.exports = router;
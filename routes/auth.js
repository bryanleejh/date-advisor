const express = require('express');

const router = express.Router();
const passport = require('passport');
const passportConfig = require('../config/passport');

/**
 * OAuth authentication routes. (Sign in)
 */
router.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/'); // req.session.returnTo || 
});

module.exports = router;

const express = require('express');
const router = express.Router();

const passport = require('passport');

//login

router.post('/login', (req, res) =>{
    passport.authenticate('local.login',{
    successRedirect: '/links/listrest',
    failureRedirect: '/login',
    failureFlash: true
    });
});


router.get('/profile', (req, res) =>{
    res.send('este es tu perfil');
});

module.exports = router;
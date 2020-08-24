const express = require('express');
const router = express.Router();
const passport = require('passport');
const {isLoggeedIn, isNologgedIn}  = require('../lib/auth');


//cuando no tenga nada en el dominio de la url  redirecciona a login  
router.get('/',(req,res)=>{
    res.redirect('/login')
});

//login
router.get('/login', isNologgedIn,(req,res)=>{
    res.render('auth/login');
});
router.post('/login', isNologgedIn, (req, res, next)=>{
    passport.authenticate('local.login',{
        successRedirect: '/perfiluser',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

//crear user
router.get('/creuser', isNologgedIn, (req, res) =>{
    res.render('auth/creuser');
});

router.post('/creuser', isNologgedIn, passport.authenticate('local.signup',{
        successRedirect: '/inicio',
        failureRedirect: '/creuser',
        failureFlash: true
    }));

router.get('/perfiluser', isLoggeedIn, (req, res)=>{
    res.render('perfiluser');
})

router.get('/logout', isLoggeedIn,(req, res) =>{
    req.logOut();
    res.redirect('/login')
});
module.exports = router;
const passport =  require('passport');
const straty = require('passport-local').Strategy;
const help = require('../lib/helpers');

passport.use('local.login', new straty({

    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) =>{
    console.log(req.body);
    console.log(email);
    console.log(password);
}));
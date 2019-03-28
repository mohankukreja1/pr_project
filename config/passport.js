const passport=require('passport');
var LocalStratergy=require('passport-local');

var User = require('../db/user').user;

passport.serializeUser(function(user, done) {

	
	done(null, user.id)
})

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use('user.login',new LocalStratergy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true
},function (req,email,password, done) {

    User.findOne({'email':email},function (err,user) {
        if(err){
            return done(err);
        }
        if(!user){
            return done(null,false);
        }
        if(!user.validPassword(req.body.password)){
            //req.flash('passworderror', 'incorrect password')
            return done(null,false);
        }
        return done(null,user);
    })

}));
'use strict';

var app = require('express')();
var path = require('path');
var passport = require('passport');

var session = require('express-session');

var User = require('../api/users/user.model');

app.use(session({
    // this mandatory configuration ensures that session IDs are not predictable
    secret: 'jasoniscool'
}));

app.use(function (req, res, next) {
  if (!req.session.counter) req.session.counter = 0;
  console.log('counter', ++req.session.counter);
  next();
});

// place right after the session setup middleware
app.use(function (req, res, next) {
    console.log('session', req.session);
    next();
});

app.use(require('./logging.middleware'));

app.use(require('./requestState.middleware'));

app.use(require('./statics.middleware'));

app.use('/api', require('../api/api.router'));


var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];
var indexPath = path.join(__dirname, '..', '..', 'public', 'index.html');
validFrontendRoutes.forEach(function (stateRoute) {
	app.get(stateRoute, function (req, res) {
		res.sendFile(indexPath);
	});
});

/// SETUP PASSPORT ///
app.use(passport.initialize());
app.use(passport.session());

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(
  new GoogleStrategy({
    clientID: '1037902771437-pnqqpeaantrdve77ssbh1nvshm39icb1.apps.googleusercontent.com',
    clientSecret: 'K_LOe99-VYGmEMHGWqlBxOze',
    callbackURL: 'http://127.0.0.1:8080/auth/google/callback'
  },
  // Google will send back the token and profile
  function (token, refreshToken, profile, done) {
    // the callback will pass back user profile information and each service (Facebook, Twitter, and Google) will pass it back a different way. Passport standardizes the information that comes back in its profile object.
    User.findOne({ 'google.id' : profile.id }, function (err, user) {
        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err) return done(err);
        // if the user is found, then log them in
        if (user) {
          return done(null, user); // user found, pass along that user
        } else {
          // if there is no user found with that google id, create them
          var newUser = new User();
          // set all of the Google information in our user model
          newUser.google.id = profile.id; // set the users google id
          newUser.google.token = token; // we will save the token that google provides to the user
          newUser.google.name = profile.displayName; // look at the passport user profile to see how names are returned
          newUser.google.email = profile.emails[0].value; // Google can return multiple emails so we'll take the first
          // don't forget to include the user's email, name, and photo
          newUser.email = newUser.google.email; // required field
          newUser.name = newUser.google.name; // nice to have
          newUser.photo = profile.photos[0].value; // nice to have
          // save our user to the database
          newUser.save(function (err) {
            if (err) done(err);
            // if successful, pass along the new user
            else done(null, newUser);
          });
        }
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, done);
});

// Google authentication and login
app.get('/auth/google', passport.authenticate('google', { scope : 'email' }));

// handle the callback after Google has authenticated the user
app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect : '/', // or wherever
    failureRedirect : '/' // or wherever
  })
);

/// USER LOGIN ROUTE ///
app.put('/auth/me', function( req, res, next ){

  if(!req.session.userId && !req.session.passport.user)
    res.json({});
  else{

    var id = req.session.userId || req.session.passport.user;

    User.findOne({_id: id})
    .then(function(user){

      res.json(user);
    });
  }
});

app.post('/login', function( req, res, next ){


  // find User
  User.findOne({email: req.body.email,
                password: req.body.password})
  .then(function(user){

    if(!user){
      res.sendStatus(401);
    } else {
      req.session.userId = user._id;
      res.json(user);
    }
  });
});

app.post('/signup', function( req, res, next ){

  var newUser = new User({
      email: req.body.email,
      password: req.body.password
  });

  newUser.save()
  .then(function(user){
      req.session.userId = user._id;
      res.json(user);
  })
  .catch(function(err){
    res.sendStatus(401);
  });

});
app.post('/logout', function( req, res, next ){

  req.session.destroy(function(err){

    //cookie has been eaten
    res.sendStatus(200);

  });

});

app.use(require('./error.middleware'));




module.exports = app;

'use strict';

var app = require('express')();
var path = require('path');

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

/// USER LOGIN ROUTE ///
app.post('/login', function( req, res, next ){


  // find User
  User.findOne({email: req.body.email,
                password: req.body.password})
  .then(function(user){

    if(!user){
      res.sendStatus(401);
    } else {
      req.session.userId = user._id;
      console.log('USER', user);
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
    console.log('cookie has been eaten');

  });

});

app.use(require('./error.middleware'));




module.exports = app;

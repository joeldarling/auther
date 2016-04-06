app.factory('SignupFactory', function($http, $log, AuthFactory){

  return {

    submitSignup: function(email, password){
      return $http.post('/signup', {email: email, password: password})
      .then(function(res){

        AuthFactory.setUser(res.data);
        return(res.data);
      })
      .catch($log.error);
    }

  };

});

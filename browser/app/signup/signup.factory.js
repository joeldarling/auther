app.factory('SignupFactory', function($http, $log){

  return {

    submitSignup: function(email, password){
      return $http.post('/signup', {email: email, password: password})
      .then(function(res){
        return(res.data);
      })
      .catch($log.error);
    }

  };

});

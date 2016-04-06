app.factory('LoginFactory', function($http){
  return {
    submitLogin: function(email, password){
      return $http.post('/login', {email: email, password: password})
      .then(function(res){
        return res.data;
      });
    }

  };
});

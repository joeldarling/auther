app.factory('LoginFactory', function($http, $log, AuthFactory){
  return {
    submitLogin: function(email, password){
      return $http.post('/login', {email: email, password: password})
      .then(function(res){
        AuthFactory.setUser(res.data);
        return res.data;
      })
      .catch($log.error);
    },
    logout: function(){
      return $http.post('/logout')
      .then(function(res){
        AuthFactory.reset();
        return res.data;
      })
      .catch($log.error);
    }

  };
});

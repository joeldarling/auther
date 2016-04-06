app.factory('LoginFactory', function($http, $log){
  return {
    submitLogin: function(email, password){
      return $http.post('/login', {email: email, password: password})
      .then(function(res){
        return res.data;
      })
      .catch($log.error);
    },
    logout: function(){
      return $http.post('/logout')
      .then(function(res){
        return res.data;
      })
      .catch($log.error);
    }

  };
});

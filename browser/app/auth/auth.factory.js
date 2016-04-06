app.factory('AuthFactory', function($http){

  var currentUser = {};

  return {
    queryLogin:function(){
      return $http.put('/auth/me')
      .then(function(res){
          currentUser = res.data;
          return currentUser;
      });

    },
    setUser: function(user){
      currentUser = user;
    },
    getUserId: function(){
      return currentUser._id;
    },
    getUser: function(){
      return currentUser;
    },
    isAdmin: function(){
      return currentUser.isAdmin;
    },
    reset: function(){
      currentUser = {};
    }
  };

});

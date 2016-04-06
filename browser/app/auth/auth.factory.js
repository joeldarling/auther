app.factory('AuthFactory', function(){

  var currentUser = {};

  return {
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

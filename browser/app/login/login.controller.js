app.controller('LoginCtrl', function($scope, $state, LoginFactory){

  $scope.submitLogin = function(){

    LoginFactory.submitLogin($scope.userEmail, $scope.userPassword).
    then(function(res){
      //are we logged in?
      if(res==='OK')
        $state.go('stories');
    })
    .catch(function(){
      $scope.loginError = 401;
    });

  };

  $scope.logout = function(){
    LoginFactory.logout()
    .then(function(res){
      console.log('logged out');

    });
  };

});

app.controller('LoginCtrl', function($scope, LoginFactory){

  $scope.submitLogin = function(){

    LoginFactory.submitLogin($scope.userEmail, $scope.userPassword).
    then(function(res){
      //are we logged in?
      console.log('LOGGED IN' + res);
    });

  };

});

app.controller('SignupCtrl', function($scope, $state, SignupFactory){

  $scope.submitSignup = function(){
    SignupFactory.submitSignup($scope.userEmail, $scope.userPassword)
    .then(function(res){
      if(!res)
        $scope.signupError = "error";
      else
        $state.go('stories');
    })
    .catch(function(err){
      //error
    });

  };
});

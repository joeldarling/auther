'use strict';

var app = angular.module('auther', ['ui.router']);

app.config(function ($urlRouterProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise('/');

})
.run(function(AuthFactory){
	AuthFactory.queryLogin().
	then(function(res){
		//logged in?
	});

});

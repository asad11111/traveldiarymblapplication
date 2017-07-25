(function(window, angular, undefined){
	angular.module('app')
	.controller('viewCtrl', ['$scope','$state', '$http', function($scope,$state,$http){
		//variables
		$scope.pics=[];

		//function

		//init
		$http.get('http://localhost:8080/getPics').then(function(response){
			$scope.pics=response.data;
		}, function(error)
		{
			console.error("Error Occured", error)
		});
	}])
})(window, window.angular);
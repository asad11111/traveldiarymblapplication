(function(window, angular, undefined)
{
	angular.module('travel')
	.controller('viewCtrl',['$scope','$state','$http',function($scope,$state,$http)
	{	
		$scope.pics=[];
		$http.get('http://192.168.10.12:8080/getNewPhoto').then(function(response){
			$scope.pics=response.data;
			console.log('Hello photos are here');
		},function(err)
		{
			console.error("There's an error"+err);
		})
		$scope.noMoreItemsAvailable = false;
		$scope.loadMore = function() {
			$scope.pics.push({ pics: $scope.pics.length}); 
			if ($scope.pics.length == 10) {
				$scope.noMoreItemsAvailable = true;
			}

      $scope.$broadcast('scroll.infiniteScrollComplete');
   };
		
	}])
})(window,window.angular)
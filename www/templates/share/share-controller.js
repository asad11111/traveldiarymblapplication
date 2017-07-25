(function(window,angular ,undefined){
	angular.module('app')
	.controller('shareCtrl',['$scope', '$http','$state',function($scope,$http)
	{
		//var
		
		//fn
		$scope.takePhoto=function(){
			 navigator.camera.getPicture(camSucccess,camError)
		}
		function camSuccess(imageData)
		{
			var request= {
				imageData:imageData,
				name=$scope.name,
				description:$scope.description
			}
			$http.post('http://localhost:8080/mobileshare').then(function(response){
				$state.go('view');
			}, function(error)
			{
				console.error(error);
			})
		}
		function camError(error)
		{
			console.error('Error', error);
		}

	}]);
})(window, window.angular);
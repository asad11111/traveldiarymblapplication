(function(window, angular, undefined)
{
	angular.module('travel')
	.controller('shareCtrl',['$scope','$state','$http',function($scope,$state,$http)
	{	
		$scope.takePhoto=function()
		{
			navigator.camera.getPicture(camSuccess,camError)
		}
		function camSuccess(imageData)
		{
			var request= {
				imageData:imageData,
				name:$scope.name,
				description: $scope.description
			}
			console.log('request Object is   ', request);
			
			$http.post('http://192.168.10.6:8080/mobileShare',request).then(function(response)
			{
				$state.go('share');
			},function(error){
				console.log('There is an error'+error);
			})
		}	
		function camError(error)
		{
			console.log('there is an error', error);
		}
		
	}])
})(window,window.angular)/*
	var app = angular.module("travel",['ngFileUpload']);
	app.controller('MyCtrl', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {
    $scope.uploadFiles = function(files, errFiles) {
        $scope.files = files;
        $scope.errFiles = errFiles;
        angular.forEach(files, function(file) {
            file.upload = Upload.upload({
                url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                data: {file: file}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * 
                                         evt.loaded / evt.total));
            });
        });
    }
}]);*/
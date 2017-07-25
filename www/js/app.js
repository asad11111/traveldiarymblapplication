var app=angular.module("travel");
app.controller('LoginCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.user = {
    name: '',
    password: ''
  };
 
  $scope.login = function() {
    AuthService.login($scope.user).then(function(msg) {
      $state.go('inside');
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: errMsg
      });
    });
  };
});
app.run([function() { }]);

app.controller('GeoCtrl', ['$scope', function($scope){

}])

.constant('ratingConfig', {
  max: 5
})

.controller('RatingController', ['$scope', '$attrs', 'ratingConfig',
  function ($scope, $attrs, ratingConfig) {
    
    var ngModelCtrl = { $setViewValue: angular.noop };
    
    this.init = function(ngModelCtrl_) {
      ngModelCtrl = ngModelCtrl_;
      ngModelCtrl.$render = this.render;
      $scope.range = _.range(angular.isDefined($attrs.max) ? 
                           $scope.$parent.$eval($attrs.max) : ratingConfig.max);
    };

    $scope.rate = function(value) {
      if ( value >= 0 && value <= $scope.range.length ) {
        ngModelCtrl.$setViewValue(value);
        ngModelCtrl.$render();
      }
    };
    
    this.render = function() {
      $scope.value = ngModelCtrl.$viewValue;
    };
    
    $scope.enter = function(value) {
      $scope.value = value;
      $scope.onHover({value: value});
    };
    
    $scope.reset = function() {
      $scope.value = ngModelCtrl.$viewValue;
      $scope.onLeave();
    };
    
    $scope.onKeydown = function(evt) {
      console.log('Keydown!');
      if (/(37|38|39|40)/.test(evt.which)) {
        evt.preventDefault();
        evt.stopPropagation();
        $scope.rate( $scope.value + (evt.which === 38 || evt.which === 39 ? 1 : -1) );
      }
    };
    
}])

.directive('rating',function () {
  return {
    restrict: 'EA',
    scope: {
      onHover: '&',
      onLeave: '&'
    },
    require: ['rating', 'ngModel'],
    replace: true,
    template: '<span ng-mouseleave="reset()"' +
                    'ng-keydown="onKeydown($event)"' +
                    'tabindex="0" role="slider"' +
                    'aria-valuemin="0" aria-valuemax="{{ range.length }}"' +
                    'aria-valuenow="{{value}}">' +
                '<i ng-repeat="r in range track by $index"' +
                    'ng-mouseenter="enter($index + 1)"' +
                    'ng-click="rate($index + 1)"' +
                    'ng-class="$index < value ? \'fa fa-star fa-2x active\' : \'fa fa-star fa-2x\'">'+ 
                '</i>' +
              '</span>',
    controller: 'RatingController',
    link: function(scope, element, attrs, ctrls) {
      var ratingCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      if ( ngModelCtrl ) {
        ratingCtrl.init( ngModelCtrl );
      }
    }
  };
});
app.controller('RegisterCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.user = {
    name: '',
    password: ''
  };
  $scope.signup = function() {
    AuthService.register($scope.user).then(function(msg) {
      $state.go('outside.login');
      var alertPopup = $ionicPopup.alert({
        title: 'Register success!',
        template: msg
      });
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Register failed!',
        template: errMsg
      });
    });
  };
});

app.controller('FriendsCtrl',function($scope,AuthService,$ionicPopup,API_ENDPOINT,$http,$state){
  $scope.users=[];
  $scope.usersList = function() {
    AuthService.user_list($scope.user).then(function(msg) 
    {
      users.find({filter: ''}).then(function(result) {
        $scope.users = result;
      console.log('this is it '+$scope.users);
      $state.go('friend');
    });
    }, function(errMsg) {
      console.log('this is it '+$scope.users);
      console.log('The error is '+errMsg);
      var alertPopup = $ionicPopup.alert({
        title: 'Not found any one!',
        template: errMsg
      });
    });
  }
});
app.controller('InsideCtrl', function($scope, AuthService, $ionicPopup,API_ENDPOINT, $http, $state, $cordovaCamera, $cordovaFile) {
  
  $scope.destroySession = function() {
    AuthService.logout();
  };
 
  $scope.getInfo = function($cordovaCamera) {
    $http.get(API_ENDPOINT.url + '/memberinfo').then(function(result) {
      $scope.memberinfo = result.data.msg;
    });
  };
 
  $scope.logout = function() {
    AuthService.logout();
    $state.go('outside.login');
  };
});
app.controller('ReviewCtrl',function($scope,$ionicPopup,$state,$http,AuthService){
    $scope.Reviews = 
    {
      description: '',
      rate: ''
  };
  $scope.addingReview = function() {
    AuthService.reviewAdd($scope.Reviews).then(function(msg) {
      $state.go('share');
      var alertPopup = $ionicPopup.alert({
        title: 'Review added success!',
        template: msg
      });
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Review failed!',
        template: errMsg
      });
    });
  }
});
app.controller('ImageCtrl',function($scope,$cordovaDevice,$cordovaFile,$ionicPlatform,$ionicActionSheet,ImageService,FileService){
  $ionicPlatform.ready(function(){
    $scope.images=FileService.images;
    if(!$scope.$$phase) {
      $scope.$apply();
    }

  });  
  $scope.urlForImage=function(iamgeName){
    return cordova.file.dataDirectory=imageName;
  };
  $scope.saveData= function(){
       $state.go('inside.images');
  }
  $scope.addMedia=function(){
    $scope.hideSheet=$ionicActionSheet.show({
      buttons:[
        {text: 'Take Photo'},
        {text: 'Chose Photo From Gallery'}
      ],
      titleText:'Add Images',
      cancelText:'Cancel',
      buttonClicked:function(index){
        $scope.addImage(index);
      }
    })
  };
  $scope.addImage=function(type){
    $scope.hideSheet();
    ImageService.handleMediaDialog(type).then(function(){
     if(!$scope.$$phase) {
      $scope.$apply();
    }
    });
  };
});

app.controller('MapCtrl', ['$scope','$ionicPopup', function($scope,$ionicPopup) {

  $scope.user = {};

  $scope.showAlert = function() {
      $ionicPopup.alert({
          title: 'Location',
          template: 'Your location has been saved!!'
      });
  };/*
  $scope.saveDetails = function(){
    
      var lat = $scope.user.latitude;
      var lgt = $scope.user.longitude;
      var des = $scope.user.desc;

      var firebaseObj = new Firebase("https://maps-983f1.firebaseio.com/MapDetails");
      var fb = $firebase(firebaseObj);

      fb.$push({
        latitude: lat,
        longitude: lgt,
        description: des
    }).then(function(ref) {
        $scope.user = {};
        $scope.showAlert();
    }, function(error) {
        console.log("Error:", error);
    });

    // Code to write to Firebase will be here
    }*/
}])

.directive('map', function() {
    return {
        restrict: 'A',
        link:function(scope, element, attrs){
       var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
    
    

          var zValue = scope.$eval(attrs.zoom);
          var lat = scope.$eval(attrs.lat);
          var lng = scope.$eval(attrs.lng);


          var myLatlng = new google.maps.LatLng(lat,lng),
          mapOptions = {
              zoom: zValue,
              center: myLatlng
          },
          map = new google.maps.Map(element[0],mapOptions),

          marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          draggable:true
      });
        var drawingManager = new google.maps.drawing.DrawingManager({
          drawingMode: google.maps.drawing.OverlayType.MARKER,
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['marker']
          },
          markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
      draggable:true,
      editable:true,
      clickable:true
      }
        });
    drawingManager.setMap(map);
    directionsDisplay.setMap(map);
     var onChangeHandler = function() {
          calculateAndDisplayRoute(directionsService, directionsDisplay);
        };
        document.getElementById('start').addEventListener('change', onChangeHandler);
        document.getElementById('end').addEventListener('change', onChangeHandler);
    function calculateAndDisplayRoute(directionsService, directionsDisplay) {
        directionsService.route({
          origin: document.getElementById('start').value,
          destination: document.getElementById('end').value,
          travelMode: 'DRIVING'
        }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
      var start=document.getElementById('start').value;
        var dest=document.getElementById('end').value;
      console.log(start,'+',dest);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }

      google.maps.event.addListener(marker, 'dragend', function(evt){
        scope.$parent.user.latitude = evt.latLng.lat();
        scope.$parent.user.longitude = evt.latLng.lng();
        scope.$apply();
      });


        }
    };
});
app.controller('photoCtrl',function($scope,$cordovaCamera,$ionicPopup,$state,$http,AuthService){
  /*  
    $scope.Pic = 
    {
      description:'',
      url:''
  };
  $scope.takePhoto=function()
  {
    navigator.camera.getPicture(camSuccess,camError)
  }
  function camSuccess(imageData)
    {
      var request= {
        imageData:imageData,
        description: $scope.description
      }
      console.log('Request object'+ request);
      AuthService.addPhoto(request).then(function(msg) {
      $state.go('view');
      var alertPopup = $ionicPopup.alert({
        title: 'Photo added success!',
        template: msg
      });
      });
    } 
    function camError(error)
    {
      var alertPopup = $ionicPopup.alert({
        title: 'Review failed!',
        template: errMsg
      });
  }*/


$scope.openFilePicker= function(selection) 
 {
  function setOptions(srcType) {
    var options = {
        // Some common settings are 20, 50, and 100
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: srcType,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: true,
        correctOrientation: true  //Corrects Android orientation quirks
    }
    return options;
  }
    var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
    var options = setOptions(srcType);
    if (selection == "picker-thmb") {
        // To downscale a selected image,
        // Camera.EncodingType (e.g., JPEG) must match the selected image type.
        options.targetHeight = 100;
        options.targetWidth = 100;
    }

    navigator.camera.getPicture(function cameraSuccess(imageUri) {
      var request= {
        imageUri:$scope.imageUri,
        description: $scope.description

      }
      $http.post('http://192.168.10.12:8080/mobileShare',request).then(function(response)
      {
      $state.go('view');
      var alertPopup = $ionicPopup.alert({
        title: 'Photo added success!',
        template: msg
      });
      });

    }, function cameraError(error) {
        console.debug("Unable to obtain picture: " + error, "app");

    }, options);
}
});
app.controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('outside.login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
});



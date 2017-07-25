angular.module('app', ['ionic', 'ui.router'])

.config(('$urlRouterProvider', '$stateProvider', function($urlRouterProvider,$stateProvider){
    $urlRouterProvider.otherwise('/');
    $stateProvider
    .state('view',{
      url:'/',
      templateUrl:'js/components/view/view32.html',
      controller:'viewCtrl'
    })
    .state('share',{
      url:'/',
      templateUrl:'js/components/share/share.html',
      controller:'shareCtrl'
    })
}))

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

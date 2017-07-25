var app=angular.module("travel" ,['ionic','ngCordova']);
app.config(function($stateProvider, $urlRouterProvider) {
 
  $stateProvider
  .state('outside', {
    url: '/outside',
    abstract: true,
    templateUrl: 'templates/outside.html'
  })
  .state('outside.login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
  .state('outside.register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'RegisterCtrl'
  })
  .state('inside', {
    url: '/nav',
    templateUrl: 'templates/nav.html',
    controller: ''
  })
  .state('map', {
            url: '/map',
            templateUrl: 'templates/map.html',
            controller: 'MapCtrl'
        })
   .state('live', {
            url: '/live',
            templateUrl: 'js/js/components/live/live.html',
            controller: ''
        })
  .state('view',{
      url:'/view',
      templateUrl:'js/js/components/view/view32.html',
      controller:'viewCtrl'
    })
    .state('share',{
      url:'/share',
      templateUrl:'templates/share.html',
      controller:'photoCtrl'
      
    })
  .state('image',{
      url:'/image',
      templateUrl:'templates/image.html',
      controller:''
  })
  .state('review',{
    url:'/review',
    templateUrl:'templates/review.html',
    controller:'ReviewCtrl'
  })
  .state('friend',
  {
    url:'/friend',
    templateUrl:'templates/friendlist.html',
    controller:'FriendsCtrl'
  })
  $urlRouterProvider.otherwise('/outside/login');
});
 
app.run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
    if (!AuthService.isAuthenticated()) {
      console.log(next.name);
      if (next.name !== 'outside.login' && next.name !== 'outside.register') {
        event.preventDefault();
        $state.go('outside.login');
      }
    }
  });
});
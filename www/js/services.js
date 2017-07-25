angular.module("travel")
.service('AuthService', function($q, $http, API_ENDPOINT) {
  var LOCAL_TOKEN_KEY = 'JWTeyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1ODkzMzVlYjdhMmY0ZDM3ODA4YTFlOTMiLCJlbWFpbCI6ImFzYWRhcnNoYWQuYXJAb3V0bG9vay5jb20iLCJwYXNzd29yZCI6IiQyYSQxMCRBdHRlTWtPaWNoLm9UanlCdWFuT3F1YThRNkpFNkR0UjBtTDlaRzNpeHIydVgybHZnM0lqQyIsIl9fdiI6MH0.G_oIaMjzSC1N8NaQPFP69m1hE6SdGb493Fef4v2973U';
  var isAuthenticated = false;
  var authToken;
 
  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }
 
  function storeUserCredentials(token) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(token);
  }
 
  function useCredentials(token) {
    isAuthenticated = true;
    authToken = token;
 
    // Set the token as header for your requests!
    $http.defaults.headers.common.Authorization = authToken;
  }
 
  function destroyUserCredentials() {
    authToken = undefined;
    isAuthenticated = false;
    $http.defaults.headers.common.Authorization = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }
 
  var register = function(user) {
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + '/signup', user).then(function(result) {
        if (result.data.success) {
          resolve(result.data.msg);
        } else {
          reject(result.data.msg);
        }
      });
    });
  }
  var user_list=function(user)
  {
    return $q(function(resolve, reject) {
      $http.get(API_ENDPOINT.url + '/usersList', user).then(function(result) {
        if (result.data.success) {

          resolve(result.data.msg);
        } else {
          reject(result.data.result);
        }
      });
    });
  }
  var reviewAdd = function(Reviews) {
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + '/addingReview', Reviews).then(function(result) {
        if (result.data.success) {
          resolve(result.data.msg);
        } else {
          reject(result.data.msg);
        }
      });
    });
  }
  var addPhoto=function(Pic)
  {
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + '/openFilePicker', Pic).then(function(result) {
        if (result.data.success) {
          resolve(result.data.msg);
          res.end().toString();
          resolve(result.data.msg);
        } else {
          reject(result.data.msg);
        }
      });
    });
  }
  var login = function(user) {
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + '/authenticate', user).then(function(result) {
        if (result.data.success) {
          storeUserCredentials(result.data.token);
          resolve(result.data.msg);
        } else {
          reject(result.data.msg);
        }
      });
    });
  };
  var logout = function() {
    destroyUserCredentials();
  };
 
  loadUserCredentials();
 
  return {
    user_list:user_list,
    addPhoto:  addPhoto,
    reviewAdd: reviewAdd,
    login: login,
    register: register,
    logout: logout,
    isAuthenticated: function() {return isAuthenticated;},
  
  };
  
})
.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
      }[response.status], response);
      return $q.reject(response);
    }
  };
})

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});
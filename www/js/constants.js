var app=angular.module("travel");
app.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated'
});
 
app.constant('API_ENDPOINT', {
 // url: 'http://127.0.0.1:8080/api'
 url: 'http://192.168.10.12:8080/api'
});
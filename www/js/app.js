// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngMessages', 'ngCordova'])

//on device ready function
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

// Congiguration of App
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: '/',
      abstract: false,
      templateUrl: 'templates/signin.html',
      controller: 'AppCtrl'
    })

    .state('profile', {
      url: '/profile',
      abstract: false,
      templateUrl: 'templates/profile.html',
      controller: 'profileCtrl'
    })

    .state('invitecontacts', {
      url: '/invitecontacts',
      abstract: false,
      templateUrl: 'templates/invitecontacts.html',
      controller: 'invitecontactsCtrl'
    })

    .state('Successfulregistration', {
      url: '/Successfulregistration',
      abstract: false,
      templateUrl: 'templates/Successfulregistration.html',
      controller: 'SuccessfulregistrationCtrl'
    })

    .state('displaycontacts', {
      url: '/displaycontacts',
      abstract: false,
      templateUrl: 'templates/displaycontacts.html',
      controller: 'searchcontactsCtrl'
  })

    .state('camerapick', {
      url: '/camerapick',
      abstract: false,
      templateUrl: 'templates/camerapick.html',
      controller: 'camerapickCtrl'
  })
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
});

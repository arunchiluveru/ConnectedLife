angular.module('starter.controllers', [])

//Signin page directive 
.directive('groupedRadio', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        model: '=ngModel',
        value: '=groupedRadio'
      },
      link: function(scope, element, attrs, ngModelCtrl) {
        element.addClass('button');
        element.on('click', function(e) {
          scope.$apply(function() {
            ngModelCtrl.$setViewValue(scope.value);
          });
        });

        scope.$watch('model', function(newVal) {
          element.removeClass('button-assertive');
          element.addClass('button-stable');
          if (newVal === scope.value) {
            element.addClass('button-assertive');
          }
        });
      }
    };
  })


// factory for contacts retreival
.factory('Contacts',  function(){
      var contacts=[];
    return {
             all: function(){
                var options = new ContactFindOptions();
                options.filter = "";
                options.multiple = true;
                var fields = ["displayName", "name"];
                navigator.contacts.find(fields,
                                        getContacts,
                                        errorHandler,options);
                function errorHandler(e) {
                     console.log("errorHandler: "+e);
                }
                function getContacts(c) {
                     console.log("getContacts, number of results "+c.length);
                     for(var i=0, len=c.length; i<len; i++) {

                            contacts.push(c[i]);
//                            console.dir(c[i]);
//                            console.log('contacts '+ contacts);
         
                     }
         
                 }
                return contacts;
            },
            remove: function(contact) {
            contacts.splice(contacts.indexOf(contact), 1);
            },
            get: function(contactId) {
            for (var i = 0; i < contacts.length; i++) {
            if (contacts[i].id === parseInt(contactId)) {
            return contacts[i];
            }
            }
            return null;
         }
         };
    })

// Main Controller 
.controller('AppCtrl', function($scope, $http) {

  console.log("Hello World from controller");


 $scope.data = {
      gender: 'Login'
    };
    $scope.isTabLoginClicked = true;

    $scope.tabLoginClicked = function(){
      $scope.isTabLoginClicked = true;
      $scope.isTabRegisterClicked = false;
    }
    $scope.tabRegisterClicked = function(){
      $scope.isTabLoginClicked = false;
      $scope.isTabRegisterClicked = true;
    }
    
})

// Login Controller
.controller('loginformCtrl', function($scope, $state, $http) {
 
 // Login authorization with email and password background checks
  $scope.doLogin = function() {
    var uauth = "";
    $http.post('http://localhost:3000/login', $scope.loginData,{})
       .then(function(resp){
      console.log(angular.toJson(resp));
      angular.forEach(resp.data, function(value, key) {
      angular.forEach(value, function(v, k) {
       console.log(k + ': ' + v); 
       if(k=="otp"){
        uauth = v;
       }
    });
    });
      sessionStorage.setItem("USERAUTH",uauth);
      $state.go('profile');  
      console.log(resp);
    }) 
  };

  //Email validation through database
  $scope.checkemail=function(){
      // console.log($scope.loginData.email);
    $http.post('/checkemail',$scope.loginData).success(function(resp){
      // console.log(angular.toJson(resp));
      if(resp==0){
        $scope.email_err="";
        $scope.email_err="Account not found"
        return false;
      }else{
        $scope.email_err="";
        return true;
      }
    });
  }
  //Password validation through database
   $scope.checkpwd=function(){
    // console.log($scope.loginData.email);
    $http.post('/checkpwd',$scope.loginData).success(function(resp){
      // console.log(angular.toJson(resp));
      if(resp==0){
        $scope.pwd_err="";
        $scope.pwd_err="Incorrect password"
        return false;
      }else{
        $scope.pwd_err="";
        return true;
      }
    });
  }
})

//Profile page controller 

.controller('profileCtrl', function($scope, $state, $ionicPopover) {
  sessionStorage.getItem("USERAUTH");
   $scope.updatephotoclick = function($event){
    console.log("photo update clicked");
    $ionicPopover.fromTemplateUrl('templates/camerapick.html', {
    scope: $scope
    }).then(function(popover) {
    $scope.popover = popover;
    $scope.popover.show($event);
    });
  }
   $scope.onnext= function(){
      
      $state.go('invitecontacts');
    }

   
})

// Camera Controller with photo uploading

.controller('camerapickCtrl', function($scope, $state, $ionicPopover, $cordovaCamera, $cordovaFile, $http) {
   
   console.log("camerapickCtrl");
     sessionStorage.getItem("USERAUTH");       
    $scope.takepic= function(){
      console.log("takepic");
      function clearcache(){
        navigator.camera.cleanup();
      }
      var cameraOptions = {
            quality: 75,
            destinationType : Camera.DestinationType.FILE_URI,
            sourceType : Camera.PictureSourceType.CAMERA,
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 150,
            targetHeight: 150,
            popoverOptions: CameraPopoverOptions,
      };
            $cordovaCamera.getPicture(cameraOptions).then(
            function(imageData){
          
              var image = document.getElementById('imgcapture');
              image.src = '';
            console.log("picture taken");
           
            clearcache();
            $scope.popover.hide();
            
            image.src = imageData;
            var parms={id:sessionStorage.getItem('USERAUTH'),uimg:imageData}
            $http.post('/updateprofile',parms).success(function(resp){
              alert("profile photo updated");
            });
            }, function(err){
             console.log('Failed because: ' + err);
            });
           
    }
            
   $scope.getpic= function(){
     function clearcache(){
          navigator.camera.cleanup();
        }
     var cameraOptions = {
              quality: 75,
              destinationType : Camera.DestinationType.FILE_URI,
              sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
              allowEdit : true,
              encodingType: Camera.EncodingType.JPEG,
              targetWidth: 150,
              targetHeight: 150,
              popoverOptions: CameraPopoverOptions,
        };
     $cordovaCamera.getPicture(cameraOptions).then(
              function(imageData){
            
                var image = document.getElementById('imgcapture');
                image.src = '';
                console.log("getpic");
             
              clearcache();
              $scope.popover.hide();
              
              image.src = imageData;

              }, function(err){
               console.log('Failed because: ' + err);
              });
     
    }
   
   
})

// Controller for Inviting contacts through sms
.controller('invitecontactsCtrl', function($scope, $state) {

    $scope.goBack = function(){
       $state.go('profile');
      
    }

    
    $scope.searchContacts = function(){
      $state.go('displaycontacts');

    }

    $scope.sendSMS = function(){
      sms.send($scope.InviteData.mobile, 'Hi '+$scope.InviteData.username+' I would like you to join me on connected life', {}, function(response){
        console.log(response);
      }, function(error) {
        console.log(error);
      });

    }
})

//Controller for registration data uploading
.controller('registration', function($scope, $state, $http) {
   $scope.regcheckemail= function(){
        $http.post('/regcheckemail',$scope.registerData).success(function(resp){
      // console.log(angular.toJson(resp));
      if(resp==1){
        $scope.regemail_err="";
        $scope.regemail_err="EmailID already available"
        return false;
      }else{
        $scope.regemail_err="";
        return true;
      }
    });
      }
    $scope.regmobchk= function(){
        $http.post('/regmobcheck',$scope.registerData).success(function(resp){
      // console.log(angular.toJson(resp));
      if(resp==1){
        $scope.regmnumber_err="";
        $scope.regmnumber_err="Mobile number already exists"
        return false;
      }else{
        $scope.regmnumber_err="";
        return true;
      }
    });
      }
   $scope.doRegister = function() {
    // alert(return $scope.regmobchk);
     $state.go('Successfulregistration');
    $http.post('http://localhost:3000/registration', $scope.registerData,{})
    .success(function(resp){
    //console.log(angular.toJson(resp));
    console.log(resp);
  })

      // console.log('Doing Registration'+ $scope.registerData.username);
    };
})

// Controller for sending otp code
.controller('SuccessfulregistrationCtrl', function($scope, $state, $http) {
  $scope.checkotp = function(){
   var ottp=$scope.Code.otpcode;
    // console.log($scope.Code.otpcode);
    if(ottp.length==4){
    $http.post('/checkotpnum',$scope.Code.otpcode).success(function(resp){
      console.log(resp)
      if(resp==0){
        $scope.nerr="";
        $scope.nerr="Incorrect code";
        return false;
      }else{
        $scope.nerr="";
        sessionStorage.setItem("USERAUTH","");
        sessionStorage.setItem("USERAUTH",$scope.Code.otpcode);
       
        $state.go('profile');
      }
    });
    }else{

    }

  }
  $scope.goBack = function(){
    $state.go('app');
    }

})

//Controller for Searching contacts
.controller('searchcontactsCtrl',function($scope, $state, Contacts) {
    $scope.goBack = function(){
            $state.go('invitecontacts');
    }
    $scope.contacts = Contacts.all();
    console.log("acheived contacts"+ $scope.contacts);
            
 });

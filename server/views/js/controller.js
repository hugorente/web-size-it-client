var appControllers = angular.module('appControllers', ['ngRoute', 'ui.bootstrap']);

appControllers.controller('displayCtrl', ['$scope', 'socket', function ($scope, socket) { 
    //Capture sizes sent by the server
    socket.on('resultSize', function (data) {
      $scope.totalEstimate = data.size;
    });
    
    //Capture userName sent by the server
    socket.on('userName', function (data) {
      $scope.userName = data.userName;
    });
    
}]);


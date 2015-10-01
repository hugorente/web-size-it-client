var appControllers = angular.module('appControllers', ['ngRoute', 'ui.bootstrap']);

appControllers.controller('displayCtrl', ['$scope', 'socket', function ($scope, socket) { 
    socket.on('resultSize', function (data) {
      $scope.totalEstimate = data.size;
    });
    
    socket.on('userName', function (data) {
      $scope.userName = data.userName;
    });
    
}]);


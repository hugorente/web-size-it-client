var mainApp = angular.module('mainApp', [
    'ngRoute', 'appControllers'
]);

mainApp.service('appVars', function () {
    var socket;
    var totalEstimate;
    return {
        /*
        getSocket: function () {
            return socket;
        },
        setSocket: function(value) {
            socket = value;
        },
        */
        getTotalEstimate: function () {
            return totalEstimate;
        },
        setTotalEstimate: function(value) {
            totalEstimate = value;
        }
    };
});

mainApp.factory('socket', ['$rootScope', function ($rootScope) {
  //var socket = io('https://secret-lake-6472.herokuapp.com/');
  var socket = io('http://localhost:3000');
  return {
    on: function (eventName, callback) {
        function wrapper() {
            var args = arguments;
            $rootScope.$apply(function () {
                callback.apply(socket, args);
            });
        }
        
        socket.on(eventName, wrapper);
        
        return function () {
            socket.removeListener(eventName, wrapper);
        };
    },

    emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
            var args = arguments;
            $rootScope.$apply(function () {
                if(callback) {
                    callback.apply(socket, args);
                }
            });
        });
    }
  };
}]);
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

//Change socket configuration to link to server on local or remote.
//To use server on local use 'node server.js' command in the local server project folder
mainApp.factory('socket', ['$rootScope', function ($rootScope) {
    //The following namespace is used on server side.
    //TO DO
    //Let's the user create a namespace, register it on server, and connet to it
    var projectSpace = 'projectSpace';
    var socket = io('https://secret-lake-6472.herokuapp.com/' + projectSpace);
    var socket = io('http://localhost:3000/' + projectSpace);
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
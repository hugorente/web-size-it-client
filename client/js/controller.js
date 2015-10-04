var appControllers = angular.module('appControllers', ['ngRoute', 'ui.bootstrap']);

appControllers.controller('displayCtrl', ['$scope', 'socket', function ($scope, socket) { 
    var team = [];
    $scope.team = team;
    
    //Communicate to the server that this app is the client running on desktop
    socket.emit('client-connection');
    //Capture sizes sent by the server
    
    socket.on('resultSize', function (data) {
        $scope.totalEstimate = data.size;
        team[data.userId] = data;
        console.log('Memebers number is: ' + team.length);  
    });
    
    socket.on('newData', function (data) {
        console.log(data.userName + ' updated size: ' + data.size);
        if($scope.team[data.userId] === undefined) {
            team.push(data.userId);
        };
        team[data.userId] = data;
        $scope.team = team;
        console.log('Memebers number is: ' + team.length);  
    });
    
    //Capture or update userName sent by the server
    socket.on('userName', function (data) {
        if(team.length === 0) { 
            team.push(data);
        } else{
            jQuery.each( team, function( index, value ) {
            //check if the team member exists in team. If not add stay true and the member is added to the list
                var add= true
                if(value.userId === data.userId) {
                    value.userName = data.userName
                    add = false;
                }
                if(add) {
                    team.push(data);
                }
              });
        }   
        /*
        //Update the name
        jQuery.each( team, function( index, value ) {
            var add= true
          if(value.id === data.id) {
            value.userName = data.userName
            add = false;
          }
        });
       */
        //$scope.member = data.userId;  
        //$scope.member.userName = data.userName;
      //$scope.team.push[data];    
    })                                          ;
    
}]);


var appControllers = angular.module('appControllers', ['ngRoute', 'ui.bootstrap']);

appControllers.controller('displayCtrl', ['$scope', 'socket', function ($scope, socket) {
    var team = [];
    $scope.team = team;
    $scope.higherRiskIndex = 0;
    $scope.lowerRiskIndex = 0;
    $scope.higherEffortIndex = 0;
    $scope.lowerEffortIndex = 0;
    $scope.higherComplexityIndex = 0;
    $scope.lowerComplexityIndex = 0;
    $scope.higherSizeIndex = 0;
    $scope.lowerSizeIndex = 0;
    
    
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
        if ($scope.team[data.userId] === undefined ) {
            team.push(data.userId);
        }
        team[data.userId] = data;
        $scope.team = team;
        console.log('Team memebers number is: ' + team.length);
        $scope.setFlags();
    });
    
    //Capture when a mobile app disconnected
    socket.on('userDisconnection', function (data) {
        // NOt sure why but this if prevents error on refresh mobile application running on desktop
        if(team[data.userId]>-1){
            console.log('******Team member disconnection******');
            console.log('Team member disconnection: ' + team[data.userId].userName);
            team.splice(data.userId, 1);
            console.log('Connected team members are now: ' + team.length);
            $scope.team = team;
            console.log('*************');
        }
    });
    
    //Trigger functions on team model changes
    //DOESN"T WORK. For now moving the call to setFlag method in newData handler
    $scope.$watch($scope.team, function () {
        $scope.setFlags();
    });
    
    //Apply color on relative values of risk complexity and effort for each user
    //Triggers only if there are more than one team to iterate through
    $scope.setFlags = function () {
        if (team.length > 1) {
            $.each($scope.team, function (index, value) {
                //Set the higher values index
                if (value.risk >= team[$scope.higherRiskIndex].risk) {
                    $scope.higherRiskIndex = index;
                }
                if (value.effort >= team[$scope.higherEffortIndex].effort) {
                    $scope.higherEffortIndex = index;
                }
                if (value.complexity >= team[$scope.higherComplexityIndex].complexity) {
                    $scope.higherComplexityIndex = index;
                }
                if (value.size >= team[$scope.higherSizeIndex].size) {
                    $scope.higherSizeIndex = index;
                }
                //Set the lower values index
                if (value.risk <= team[$scope.lowerRiskIndex].risk) {
                    $scope.lowerRiskIndex = index;
                }
                if (value.effort <= team[$scope.lowerEffortIndex].effort) {
                    $scope.lowerEffortIndex = index;
                }
                if (value.complexity <= team[$scope.lowerComplexityIndex].complexity) {
                    $scope.lowerComplexityIndex = index;
                }
                if (value.size <= team[$scope.lowerSizeIndex].size) {
                    $scope.lowerSizeIndex = index;
                }
            });
        
        }
       
    };
    
    //Capture or update userName sent by the server
    /*socket.on('userName', function (data) {
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
    });
    */
}]);


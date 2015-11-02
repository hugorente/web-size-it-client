var appControllers = angular.module('appControllers', ['ngRoute', 'ui.bootstrap']);

appControllers.controller('displayCtrl', ['$scope', 'socket', function ($scope, socket) {
    'use strict';
    var team = [];
    $scope.team = team;
    ////Lower and higher values index within the team to identify the users that gives the related values
    $scope.higherRiskIndex = 0;
    $scope.lowerRiskIndex = 0;
    $scope.higherEffortIndex = 0;
    $scope.lowerEffortIndex = 0;
    $scope.higherComplexityIndex = 0;
    $scope.lowerComplexityIndex = 0;
    $scope.higherSizeIndex = 0;
    $scope.lowerSizeIndex = 0;
    //Lower and higher values
    $scope.higherRiskValue = '===';
    $scope.lowerRiskValue = '===';
    $scope.higherEffortValue = '===';
    $scope.lowerEffortValue = '===';
    $scope.higherComplexityValue = '===';
    $scope.lowerComplexityValue = '===';
    $scope.higherSizeValue = '===';
    $scope.lowerSizeValue = '===';
    //Lower and higher voters
    $scope.higherRiskVoters = [];
    $scope.lowerRiskVoters = [];
    $scope.higherEffortVoters = [];
    $scope.lowerEffortVoters = [];
    $scope.higherComplexityVoters = [];
    $scope.lowerComplexityVoters = [];
    $scope.higherSizeVoters = [];
    $scope.lowerSizeVoters = [];
    
    
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
        if ($scope.team[data.userId] === undefined) {
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
        if (team[data.userId].userId > -1) {
            console.log('******Team member disconnection******');
            console.log('Team member disconnection: ' + team[data.userId].userName);
            /* Remove the user
            team.splice(data.userId, 1);
            console.log('Connected team members are now: ' + team.length);
            $scope.team = team;
            */
            team[data.userId].connected = 'false';
            
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
        $scope.higherRiskVoters = [];
        $scope.lowerRiskVoters = [];
        $scope.higherEffortVoters = [];
        $scope.lowerEffortVoters = [];
        $scope.higherComplexityVoters = [];
        $scope.lowerComplexityVoters = [];
        $scope.higherSizeVoters = [];
        $scope.lowerSizeVoters = [];
        var index = 0;
        if (team.length > 1) {
            $scope.higherComplexityVoters = [];
            for (index; index < team.length; index = index + 1) {
                //Set the higher values index
                if (team[index].risk >= team[$scope.higherRiskIndex].risk) {
                    if (team[index].risk > team[$scope.higherRiskIndex].risk) {
                        $scope.higherRiskVoters = [];
                    }
                    team[$scope.higherRiskIndex].higherRisk = 'false';
                    $scope.higherRiskIndex = index;
                    team[$scope.higherRiskIndex].higherRisk = 'true';
                    $scope.higherRiskValue = team[$scope.higherRiskIndex].risk;
                    $scope.higherRiskVoters.push(team[$scope.higherRiskIndex].userName);
                }
                if (team[index].effort >= team[$scope.higherEffortIndex].effort) {
                    if (team[index].effort > team[$scope.higherEffortIndex].effort) {
                        $scope.higherEffortVoters = [];
                    }
                    team[$scope.higherEffortIndex].higherEffort = 'false';
                    $scope.higherEffortIndex = index;
                    team[$scope.higherEffortIndex].higherEffort = 'true';
                    $scope.higherEffortValue = team[$scope.higherEffortIndex].effort;
                    $scope.higherEffortVoters.push(team[$scope.higherEffortIndex].userName);
                }
                if (team[index].complexity >= team[$scope.higherComplexityIndex].complexity) {
                    if (team[index].complexity > team[$scope.higherComplexityIndex].complexity) {
                        $scope.higherComplexityVoters = [];
                    }
                    team[$scope.higherComplexityIndex].higherComplexity = 'false';
                    $scope.higherComplexityIndex = index;
                    team[$scope.higherComplexityIndex].higherComplexity = 'true';
                    $scope.higherComplexityValue = team[$scope.higherComplexityIndex].complexity;
                    $scope.higherComplexityVoters.push(team[$scope.higherComplexityIndex].userName);
                }
                if (team[index].size >= team[$scope.higherSizeIndex].size) {
                    if (team[index].size > team[$scope.higherSizeIndex].size) {
                        $scope.higherSizeVoters = [];
                    }
                    team[$scope.higherSizeIndex].higherSize = 'false';
                    $scope.higherSizeIndex = index;
                    team[$scope.higherSizeIndex].higherSize = 'true';
                    team.higherSizeValue = team[$scope.higherSizeIndex].size;
                    $scope.higherSizeVoters.push(team[$scope.higherSizeIndex].userName);
                }
                //Set the lower values index
                if (team[index].risk <= team[$scope.lowerRiskIndex].risk) {
                    if (team[index].risk > team[$scope.lowerRiskIndex].risk) {
                        $scope.lowerRiskVoters = [];
                    }
                    team[$scope.lowerRiskIndex].lowerRisk = 'false';
                    $scope.lowerRiskIndex = index;
                    team[$scope.lowerRiskIndex].lowerRisk = 'true';
                    $scope.lowerRiskValue = team[$scope.lowerRiskIndex].risk;
                    $scope.lowerRiskVoters.push(team[$scope.lowerRiskIndex].userName);
                }
                if (team[index].effort <= team[$scope.lowerEffortIndex].effort) {
                    if (team[index].effort > team[$scope.lowerEffortIndex].effort) {
                        $scope.lowerEffortVoters = [];
                    }
                    team[$scope.lowerEffortIndex].lowerEffort = 'false';
                    $scope.lowerEffortIndex = index;
                    team[$scope.lowerEffortIndex].lowerEffort = 'true';
                    $scope.lowerEffortValue = team[$scope.lowerEffortIndex].effort;
                    $scope.lowerEffortVoters.push(team[$scope.lowerEffortIndex].userName);
                }
                if (team[index].complexity <= team[$scope.lowerComplexityIndex].complexity) {
                    if (team[index].complexity < team[$scope.lowerComplexityIndex].complexity) {
                        $scope.lowerComplexityVoters = [];
                    }
                    team[$scope.lowerComplexityIndex].lowerComplexity = 'false';
                    $scope.lowerComplexityIndex = index;
                    team[$scope.lowerComplexityIndex].lowerComplexity = 'true';
                    $scope.lowerComplexityValue = team[$scope.lowerComplexityIndex].complexity;
                    $scope.lowerComplexityVoters.push(team[$scope.lowerComplexityIndex].userName);
                }
                if (team[index].size <= team[$scope.lowerSizeIndex].size) {
                    if (team[index].size <= team[$scope.lowerSizeIndex].size) {
                        $scope.lowerSizeVoters = [];
                    }
                    team[$scope.lowerSizeIndex].lowerSize = 'false';
                    $scope.lowerSizeIndex = index;
                    team[$scope.lowerSizeIndex].lowerSize = 'true';
                    $scope.lowerSizeValue = team[$scope.lowerSizeIndex].size;
                    $scope.lowerSizeVoters.push(team[$scope.lowerSizeIndex].userName);
                }
            }
            //CLeat the summury board if all the users has the same estimations
            if ($scope.lowerComplexityVoters.length === $scope.team.length) { 
                $scope.lowerComplexityVoters = [];
                $scope.lowerComplexityVoters.push('===');
            }
            if ($scope.higherComplexityVoters.length === $scope.team.length) { 
                $scope.higherComplexityVoters = [];
                $scope.higherComplexityVoters.push('===');
            }
            if ($scope.lowerEffortVoters.length === $scope.team.length) { 
                $scope.lowerEffortVoters = [];
                $scope.lowerEffortVoters.push('===');
            }
            if ($scope.higherEffortVoters.length === $scope.team.length) { 
                $scope.higherEffortVoters = [];
                $scope.higherEffortVoters.push('===');
            }
            if ($scope.lowerRiskVoters.length === $scope.team.length) { 
                $scope.lowerRiskVoters = [];
                $scope.lowerRiskVoters.push('===');
            }
            if ($scope.higherRiskVoters.length === $scope.team.length) { 
                $scope.higherRiskVoters = [];
                $scope.higherRiskVoters.push('===');
            } 
        }  
    };
}]);


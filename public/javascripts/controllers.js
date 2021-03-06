var timerServices = angular.module('timerServices', ['ngResource']);
timerServices.factory('Timer', ['$resource', function ($resource) {
        return $resource('timer/:action/', {}, {
            get: { method: 'GET', params: { action: 'get' } },
            set: { method: 'POST', params: { action: 'set' } }
        });
    }]);

var dudApp = angular.module('dudApp', ['ui.knob', 'angularMoment', 'timerServices']);

dudApp.controller('DudController', ['$scope', 'Timer', function ($scope, Timer) {
        
        $scope.startTimer = undefined;
        $scope.endTimer = undefined;
        
        var dudTimer = Timer.get(function (timer) {
            $scope.interval = timer.timer;
            $scope.startTimer = timer.sched.onDate;
            $scope.endTimer = timer.sched.offDate;
        });
        
        $scope.options = function (cb) {
            return {
                max: 60,
                fgColor: "#66CC66",
                thickness: .5,
                displayPrevious: true,
                release: function (value) {
                    $scope[cb] = value;
                }
            };
        }
        
        $scope.update = function () {
            console.log('Timer for ' + $scope.interval + ' minutes from now');
            Timer.set({ interval: $scope.interval }, function (timer) {
                $scope.startTimer = timer.sched.onDate;
                $scope.endTimer = timer.sched.offDate;
            });
        };
    }]);

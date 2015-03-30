var dudApp = angular.module('dudApp', ['ui.knob', 'angularMoment']);

dudApp.controller('DudController', ['$scope', '$http', 'DudService', function ($scope, $http, DudService) {

    var dudTimer = DudService.get();
    console.log("dudTimer: " + dudTimer);
    dudTimer = dudTimer || { onDate: new Date() };
//    $scope.hours = dudTimer.onDate.getHours();
//    $scope.minutes = dudTimer.onDate.getMinutes();
//    $scope.interval = 20; // dudTimer.sched.interval

    $scope.options = {
        max: 60,
        fgColor: "#66CC66",
        thickness: .5,
        displayPrevious: true,
        release: function (value) {
            $scope.interval = value;
        }
    };

    $scope.update = function () {
        DudService.update({
            "date": $scope.date,
            "interval": $scope.interval,
        });
    };
}]);

dudApp.service('DudService', ['$http', function ($http) {
    this.get = function() {
        $http.get('timer/').success(function (data) {
            console.log("recived: " + JSON.stringify(data));
            data.sched.onDate = (data.sched.onDate || new Date());
            return data.sched;
        });
    };

    this.update = function (data) {
        data.time = data.interval;
        $http.post('timer/set', data);
    };
}]);

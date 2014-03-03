var myapp = angular.module('myapp', []);

function TestController($scope, $http) {
    var url = 'http://bluewild.local/divelog_v3/test.php';
    console.log('--> calling: $http.get(' + url + ')');

    $http.get(url, {params: {id: '70'}})
         .success(function(data, status, headers, config) {
             $scope.items = data;
         })
         .error(function(data, status, headers, config) {
             alert("ERROR!");
         })

    var post_data = {email: 'captainmarkos@gmail.com'};
    var config = {params: {email: 'captainmarkos@gmail.com'}};
    console.log('--> calling: $http.post(' + url + ')');

    $http.post(url, post_data, config)
         .success(function(data, status, headers, config) {
             $scope.items = data;
         })
         .error(function(data, status, headers, config) {
             alert("ERROR!");
         })
}

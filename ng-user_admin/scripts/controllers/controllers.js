'use strict';


// A module is a collection of services, directives, filters, and configuration
// information (used to configure the $injector).

var app = angular.module('bluewild', ['bluewild.services']);

// Setup our mappings between URLs, templates & controllers.  Setup
// our route so the app can find it.

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'MainCtrl',
            templateUrl: 'views/home.html'})
        .when('/login', {
            controller: 'UserLoginCtrl',
            templateUrl: 'views/user_login.html'})
        .when('/user/:id', {
            controller: 'UserDisplayCtrl',
            templateUrl: 'views/user_form.html'})
        .when('/user_new', {
            controller: 'UserNewCtrl',
            templateUrl: 'views/user_form.html'})
        .when('/users', {                 // remove this route for prod
            controller: 'UserDisplayAllCtrl',
            templateUrl: 'views/user_list.html'})
        .otherwise({
            redirectTo: '/'});
}]);

app.controller('MainCtrl', ['$scope', '$route', '$location', 'User', 'flash',
    function($scope, $route, $location, User, flash) {

        console.log('-------------------------------------------');
        console.log('--> controller: MainCtrl');
        console.log('--> $location.path() : ' + $location.path());
        console.log('--> $route.current.templateUrl : ' + $route.current.templateUrl);

        $scope.flash = flash;

        // Implement a navigation menu, which shows the selected item.
        $scope.navmenu = function(page) {
            var current = $location.path().substring(1);
            return (page === current) ? 'navlink_selected' : 'navlink';
        };
}]);

app.controller('UserLoginCtrl', ['$scope', '$location', 'User', '$http', 'flash',
    function($scope, $location, User, $http, flash) {

        $scope.login_button = true;
        $scope.flash = flash;
        flash.set_message('sign in');

        // Implement a navigation menu, which shows the selected item.
        $scope.navmenu = function(page) {
            var current = $location.path().substring(1);
            return (page === current) ? 'navlink_selected' : 'navlink';
        };

        $scope.login = function() {
            var ajax_url = 'http://bluewild.local/api/users';
            var post_data = { email: $scope.user.email,
                              passwd: $scope.user.passwd };

            // Append to the url as params so it would become:
            // http://bluewild.local/api/users?action=login
            var config = { params: { action: 'login' } };

            $http.post(ajax_url, post_data, config)
                .success(function(response, status) {
                    if(!response.error) {
                        $scope.user = response;
                        flash.set_message('login success');
                        $location.path('/user/' + response.id);
                    }
                    else {
                        console.log('--> ERROR: ' + response.error);
                    }
                })
                .error(function(response, status) {
                    console.log('--> failed to perform post, status = ' + status);
                });
        };
}]);

app.controller('UserDisplayCtrl', ['$scope', '$route', '$location', 'User', 'flash',
    function($scope, $route, $location, User, flash) {

        var uid = $route.current.params.id;
        $scope.user = User.get({id: uid});

        $scope.delete_button = true;
        $scope.save_button = true;
        $scope.flash = flash;

        // Implement a navigation menu, which shows the selected item.
        $scope.navmenu = function(page) {
            var current = $location.path().substring(1).split('/')[0];
            console.log('--> navmenu() current = ' + page);
            return (page === current) ? 'navlink_selected' : 'navlink';
        };

        $scope.save = function() {
            $scope.user.$save(function(User) {
                flash.set_message('user updated');
                $location.path('/');
            });
        };

        $scope.remove = function() {
            $scope.user.$remove(function(User) {
                flash.set_message('user deleted');
                $location.path('/');
            });
        };
}]);

app.controller('UserNewCtrl', ['$scope', '$route', '$routeParams', '$location', 'User', 'flash',
    function($scope, $route, $routeParams, $location, User, flash) {

        $scope.delete_button = false;
        $scope.save_button = true;

        $scope.user = new User();
        $scope.flash = flash;

        $scope.save = function() {
            console.log('--> UserNewCtrl :: save() fired!');
            $scope.user.$save(function(user) { 
                console.log('--> $scope.user.$save() : user.id : ' + user.id);
                flash.set_message('new user created');
                $location.path('/user/' + user.id); 
            });
        };

        // Implement a navigation menu, which shows the selected item.
        $scope.navmenu = function(page) {
            var current = $location.path().substring(1);
            return (page === current) ? 'navlink_selected' : 'navlink';
        };
}]);


app.controller('UserDisplayAllCtrl', ['$scope', '$route', '$location', 'User',
    function($scope, $route, $location, User) {

        console.log('-------------------------------------------');
        console.log('--> controller: UserListCtrl');
        console.log('--> $location.path() : ' + $location.path());
        console.log('--> $route.current.templateUrl : ' + $route.current.templateUrl);

        $scope.users = User.query();

        // Implement a navigation menu, which shows the selected item.
        $scope.navmenu = function(page) {
            var current = $location.path().substring(1);
            return (page === current) ? 'navlink_selected' : 'navlink';
        };

}]);
 

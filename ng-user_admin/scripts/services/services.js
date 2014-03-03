// File: app/scripts/services/services.js

'use strict';

var services = angular.module('bluewild.services', ['ngResource']);


// Define User as a resource so we have a user service.
services.factory('User', ['$resource', function($resource) {
    return $resource('/api/users/:id', {id: '@id'});
}]);

// Handle a queue of messages and listen for route changes to provide a 
// message from the queue to the current page.
services.factory('flash', function($rootScope) {
    var queue = [];
    var current_message = '';

    $rootScope.$on("$routeChangeSuccess", function() {
        current_message = queue.shift() || '';
    });

    return {
        set_message: function(message) {
            queue.push(message);
        },
        get_message: function() {
            return current_message;
        }
    };
});


/*

What we want to achieve:

Resource Function               Method    URL                               Expected Return
---------------------           ------    --------------------              ---------------

User.get({id: 11})                 GET    /user/11                              single json
User.save({})                     POST    /user/user with post data             single json
User.save{id: 11})                POST    /user/11 with post data               single json
User.query()                       GET    /user                                  json array
User.remove({id: 11})           DELETE    /user/11                              single json
User.delete({id: 11})           DELETE    /user/11                              single json

*/

(function() {
    "use strict";
    var app;
    app = angular.module("textfeature", [ "ngRoute", "ngSanitize", "listControllers" ]);
    app.config([ "$routeProvider", function($routeProvider) {
        return $routeProvider.when("/lists", {
            templateUrl: "partials/list.html",
            controller: "ListListCtrl"
        }).when("/lists/:listId", {
            templateUrl: "partials/detail.html",
            controller: "ListDetailCtrl"
        }).otherwise({
            redirectTo: "/lists"
        });
    } ]);
}).call(this);
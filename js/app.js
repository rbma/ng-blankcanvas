(function() {
    "use strict";
    var app;
    app = angular.module("listfeature", [ "ngRoute", "ngSanitize", "listControllers", "listDirectives", "ui.utils", "duScroll", "ngProgress", "listServices" ]);
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
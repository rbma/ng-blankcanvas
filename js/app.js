(function() {
    "use strict";
    var app;
    app = angular.module("listfeature", [ "ngRoute", "ngSanitize", "listControllers", "listDirectives", "duScroll", "ng-contentful", "ngProgress", "listServices" ]);
    app.config([ "$routeProvider", "$locationProvider", "contentfulClientProvider", function($routeProvider, $locationProvider, contentfulClientProvider) {
        $routeProvider.when("/lists", {
            templateUrl: "partials/list.html",
            controller: "ListListCtrl"
        }).when("/lists/:listId", {
            templateUrl: "partials/detail.html",
            controller: "ListDetailCtrl"
        }).otherwise({
            redirectTo: "/lists"
        });
        contentfulClientProvider.setSpaceId("6s2rqhmim2vw");
        return contentfulClientProvider.setAccessToken("c74b04faaa839cf30d0fbf6d0fa5827984c15b39864d7fc3c48a6fe57ad6ad0d");
    } ]);
}).call(this);
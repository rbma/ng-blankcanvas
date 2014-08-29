(function() {
    "use strict";
    var listControllers;
    listControllers = angular.module("listControllers", []);
    listControllers.controller("ListListCtrl", [ "$scope", "$http", function($scope, $http) {
        $scope.lists = [];
        return $http.get("https://cdn.contentful.com/spaces/6s2rqhmim2vw/entries?content_type=1iKCsUgXpSuSouwuMIYACy&include=1&access_token=c74b04faaa839cf30d0fbf6d0fa5827984c15b39864d7fc3c48a6fe57ad6ad0d").success(function(data) {
            $scope.lists = data.items;
            return console.log($scope.lists);
        });
    } ]);
    listControllers.controller("ListDetailCtrl", [ "$scope", "$routeParams", "$http", "$location", "$anchorScroll", "$sce", function($scope, $routeParams, $http, $location, $anchorScroll, $sce) {
        var converter;
        converter = new Showdown.converter();
        $http.get("https://cdn.contentful.com/spaces/6s2rqhmim2vw/entries?sys.id=" + $routeParams.listId + "&include=10&access_token=c74b04faaa839cf30d0fbf6d0fa5827984c15b39864d7fc3c48a6fe57ad6ad0d").success(function(data) {
            $scope.list = data;
            console.log($scope.list);
            return $scope.list.items[0].fields.body = converter.makeHtml($scope.list.items[0].fields.body);
        });
        $scope.trust = function(body) {
            return $sce.trustAsHtml(body);
        };
        return $scope.gotoBottom = function() {
            $location.hash("bottom");
            return $anchorScroll();
        };
    } ]);
}).call(this);
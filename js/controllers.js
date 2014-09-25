(function() {
    "use strict";
    var client, listControllers;
    listControllers = angular.module("listControllers", []);
    client = contentful.createClient({
        accessToken: "c74b04faaa839cf30d0fbf6d0fa5827984c15b39864d7fc3c48a6fe57ad6ad0d",
        space: "6s2rqhmim2vw"
    });
    listControllers.controller("ListListCtrl", [ "$scope", "$http", function($scope, $http) {
        $scope.lists = "";
        return client.entries({
            content_type: "1iKCsUgXpSuSouwuMIYACy",
            include: 1
        }).done(function(data) {
            return $scope.$apply(function() {
                $scope.lists = data;
                return console.log($scope.lists);
            });
        });
    } ]);
    listControllers.controller("ListDetailCtrl", [ "$scope", "$routeParams", "$http", "$location", "$sce", "listService", function($scope, $routeParams, $http, $location, $sce, listService) {
        var converter;
        converter = new Showdown.converter();
        listService.progressInit();
        client.entries({
            "sys.id": $routeParams.listId,
            include: 10
        }).done(function(data) {
            $scope.$apply(function() {
                $scope.list = data[0];
                console.log($scope.list);
                return $scope.list.fields.body = converter.makeHtml($scope.list.fields.body);
            });
            return setTimeout(listService.removeSpinner, 2e3);
        });
        return $scope.trust = function(body) {
            return $sce.trustAsHtml(body);
        };
    } ]);
}).call(this);
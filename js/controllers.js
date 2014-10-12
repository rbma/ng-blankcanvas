(function() {
    "use strict";
    var listControllers;
    listControllers = angular.module("listControllers", []);
    listControllers.controller("ListListCtrl", [ "$scope", "$http", "contentfulClient", function($scope, $http, contentfulClient) {
        $scope.lists = "";
        return contentfulClient.entries({
            content_type: "1iKCsUgXpSuSouwuMIYACy",
            include: 1
        }).then(function(data) {
            return $scope.lists = data;
        });
    } ]);
    listControllers.controller("ListDetailCtrl", [ "$scope", "$routeParams", "$http", "$location", "$sce", "listService", "contentfulClient", "stickyService", function($scope, $routeParams, $http, $location, $sce, listService, contentfulClient, stickyService) {
        var converter;
        converter = new Showdown.converter();
        $scope.desktop = true;
        listService.progressInit();
        contentfulClient.entries({
            "sys.id": $routeParams.listId,
            include: 10
        }).then(function(data) {
            var item, _i, _len, _ref;
            $scope.list = data[0];
            console.log($scope.list);
            $scope.list.fields.body = converter.makeHtml($scope.list.fields.body);
            _ref = $scope.list.fields.individualListItems;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                item = _ref[_i];
                item.fields.body = converter.makeHtml(item.fields.body);
            }
            return listService.removeSpinner();
        });
        return $scope.trust = function(body) {
            return $sce.trustAsHtml(body);
        };
    } ]);
}).call(this);
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
    listControllers.controller("ListDetailCtrl", [ "$scope", "$routeParams", "$http", "$location", "$anchorScroll", "$sce", function($scope, $routeParams, $http, $location, $anchorScroll, $sce) {
        var converter;
        converter = new Showdown.converter();
        client.entries({
            "sys.id": $routeParams.listId,
            include: 10
        }).done(function(data) {
            var height, sendHeight;
            $scope.$apply(function() {
                $scope.list = data[0];
                console.log($scope.list);
                return $scope.list.fields.body = converter.makeHtml($scope.list.fields.body);
            });
            height = $(".list-wrapper").innerHeight();
            sendHeight = function(height) {
                var message, messageJSON;
                message = {
                    height: height
                };
                messageJSON = JSON.stringify(message);
                console.log(messageJSON);
                return window.parent.postMessage(messageJSON, "*");
            };
            sendHeight(height);
            return $(window).on("resize", function() {
                return sendHeight(height);
            });
        });
        $scope.trust = function(body) {
            return $sce.trustAsHtml(body);
        };
        return $scope.gotoBottom = function(order) {
            var old;
            old = $location.hash();
            $location.hash(order);
            $anchorScroll();
            return $location.hash(old);
        };
    } ]);
}).call(this);
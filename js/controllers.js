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
    listControllers.controller("ListDetailCtrl", [ "$scope", "$routeParams", "$http", "$location", "$anchorScroll", "$sce", "ngProgress", function($scope, $routeParams, $http, $location, $anchorScroll, $sce, ngProgress) {
        var addWaypoints, converter, removeSpinner;
        converter = new Showdown.converter();
        ngProgress.height("10px");
        ngProgress.color("#ffffff");
        ngProgress.start();
        removeSpinner = function() {
            ngProgress.complete();
            return $("#spinner").animate({
                opacity: 0
            }, 600, function() {
                return $("#spinner").remove();
            });
        };
        addWaypoints = function() {
            return $("a.item-order-link").waypoint({
                context: ".frame",
                offset: 20,
                handler: function(direction) {
                    var order;
                    if (direction === "down") {
                        order = $(this).data("order");
                        $(".sidebar-item").removeClass("active");
                        return $(".sidebar-item[data-order=" + order + "]").addClass("active");
                    } else {
                        order = $(this).data("order");
                        $(".sidebar-item").removeClass("active");
                        return $(".sidebar-item[data-order=" + order + "]").addClass("active");
                    }
                }
            });
        };
        client.entries({
            "sys.id": $routeParams.listId,
            include: 10
        }).done(function(data) {
            $scope.$apply(function() {
                $scope.list = data[0];
                console.log($scope.list);
                return $scope.list.fields.body = converter.makeHtml($scope.list.fields.body);
            });
            addWaypoints();
            return setTimeout(removeSpinner, 2e3);
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
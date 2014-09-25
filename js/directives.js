(function() {
    "use strict";
    var listDirectives;
    listDirectives = angular.module("listDirectives", []);
    listDirectives.directive("sendHeight", function() {
        var link;
        link = function($scope, element, attrs) {
            var height, reset, sendHeight;
            height = element.parent().innerHeight();
            reset = function() {
                height = element.parent().innerHeight();
                return sendHeight(height);
            };
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
                return reset();
            });
        };
        return {
            restrict: "A",
            replace: false,
            link: link
        };
    });
    listDirectives.directive("sticky", function() {
        var link;
        link = function($scope, element, attrs) {
            return element.waypoint({
                context: ".frame",
                handler: function(direction) {
                    if (direction === "down") {
                        return element.addClass("sticky");
                    } else {
                        return element.removeClass("sticky");
                    }
                }
            });
        };
        return {
            link: link
        };
    });
    listDirectives.directive("addWaypoint", function() {
        var link;
        link = function($scope, element, attrs) {
            return element.waypoint({
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
        return {
            link: link
        };
    });
}).call(this);
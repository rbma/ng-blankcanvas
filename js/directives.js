(function() {
    var listDirectives;
    listDirectives = angular.module("listDirectives", []);
    listDirectives.directive("sendHeight", function() {
        return {
            restrict: "A",
            replace: false,
            link: function() {
                var height, reset, sendHeight;
                height = $(".frame").innerHeight();
                console.log(height);
                reset = function() {
                    height = $(".frame").innerHeight();
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
            }
        };
    });
    listDirectives.directive("sticky", function() {
        return {
            restrict: "A",
            replace: false,
            link: function() {
                return $(".sidebar").waypoint({
                    context: ".frame",
                    handler: function(direction) {
                        if (direction === "down") {
                            return $(".sidebar").addClass("sticky");
                        } else {
                            return $(".sidebar").removeClass("sticky");
                        }
                    }
                });
            }
        };
    });
}).call(this);
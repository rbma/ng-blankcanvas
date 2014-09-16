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
                var currentlyMobile, mobile, prevWidth, reset, width;
                mobile = false;
                currentlyMobile = false;
                width = 0;
                prevWidth = reset = function() {
                    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                        mobile = true;
                    }
                    if ($(window).width() <= 1024) {
                        return mobile = true;
                    } else {
                        return mobile = false;
                    }
                };
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
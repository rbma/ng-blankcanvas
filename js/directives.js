(function() {
    var listDirectives;
    listDirectives = angular.module("listDirectives", []);
    listDirectives.directive("sendHeight", function() {
        return {
            restrict: "A",
            replace: false,
            link: function() {
                var height, sendHeight;
                $(".list-wrapper").css({
                    height: "800px"
                });
                height = $(".list-wrapper").innerHeight();
                $(".list-wrapper").css({
                    height: height
                });
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
            }
        };
    });
    listDirectives.directive("sticky", function() {
        return {
            restrict: "A",
            replace: false,
            link: function() {
                return $(".sidebar").waypoint(function(direction) {
                    if (direction === "down") {
                        return $(".sidebar").addClass("sticky");
                    } else {
                        return $(".sidebar").removeClass("sticky");
                    }
                });
            }
        };
    });
    listDirectives.directive("flag", function() {
        return {
            restrict: "A",
            replace: false,
            link: function() {
                return $(".list-titles span").waypoint(function(direction) {
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
                });
            }
        };
    });
}).call(this);
(function() {
    var listDirectives;
    listDirectives = angular.module("listDirectives", []);
    listDirectives.directive("sendHeight", function() {
        return {
            restrict: "A",
            replace: false,
            link: function() {
                var getHeight, parentDocHeight, sendHeight;
                parentDocHeight = parent.getDocumentHeight();
                console.log("Parent height: " + parentDocHeight);
                getHeight = function() {
                    return $(document).height();
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
                sendHeight(getHeight());
                return $(window).on("resize", function() {
                    return sendHeight(getHeight());
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
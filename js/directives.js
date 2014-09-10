(function() {
    var listDirectives;
    listDirectives = angular.module("listDirectives", []);
    listDirectives.directive("sticky", function() {
        return {
            restrict: "A",
            replace: false,
            link: function() {
                return $(".sidebar").waypoint(function(direction) {
                    if (direction === "down") {
                        alert("hit");
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
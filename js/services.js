(function() {
    "use strict";
    var listServices;
    listServices = angular.module("listServices", []);
    listServices.factory("listService", [ "ngProgress", function(ngProgress) {
        var progressInit, removeSpinner;
        progressInit = function() {
            ngProgress.height("10px");
            ngProgress.color("#ffffff");
            return ngProgress.start();
        };
        removeSpinner = function() {
            ngProgress.complete();
            return $("#spinner").animate({
                opacity: 0
            }, 600, function() {
                return $("#spinner").remove();
            });
        };
        return {
            progressInit: function() {
                return progressInit();
            },
            removeSpinner: function() {
                return removeSpinner();
            }
        };
    } ]);
    listServices.factory("stickyService", [ "$rootScope", "$window", function($rootScope, $window) {
        var getDevice;
        getDevice = function() {
            var width;
            width = $window.innerWidth;
            if (width < 1024) {
                return false;
            } else {
                return true;
            }
        };
        return {
            getDevice: function() {
                return getDevice();
            }
        };
    } ]);
}).call(this);
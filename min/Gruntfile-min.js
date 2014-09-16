module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        dentist: {
            build: {
                options: {
                    include_js: "js/app.min.js",
                    include_css: "css/app.css"
                },
                src: "index.html",
                dest_js: "dist/app.init.js",
                dest_css: "tmp/null",
                dest_html: "dist/index.html"
            }
        },
        concat: {
            index: {
                options: {
                    separator: ";"
                },
                src: [ "bower_components/angular-route/angular-route.min.js", "bower_components/angular-ui-utils/ui-utils.min.js", "bower_components/contentful/dist/contentful.js", "bower_components/angular-mocks/angular-mocks.js", "bower_components/angular-scroll/angular-scroll.min.js", "bower_components/showdown/src/showdown.js", "js/waypoints.min.js", "js/bower_components/ngprogress/build/ngProgress.min.js", "bower_components/imagesloaded/imagesloaded.pkgd.min.js", "bower_components/FitText.js/jquery.fittext.js", "js/app.js", "js/controllers.js", "js/directives.js" ],
                dest: "dist/app.concat.js"
            },
            css: {
                options: {
                    separator: "\n\n"
                },
                src: [ "css/main.css" ],
                dest: "dist/css/app.css"
            }
        },
        uglify: {
            options: {
                banner: "/* EDWEENA ENTERPRISES */\n"
            },
            index: {
                src: "dist/app.concat.js",
                dest: "dist/js/app.min.js"
            }
        },
        clean: {
            release: [ "dist/js/app.concat.js", "dist/js/app.init.js", "tmp/" ]
        },
        copy: {
            build: {
                files: [ {
                    nonull: true,
                    expand: true,
                    src: [ "fonts/*", "favicon.ico", "partials/*" ],
                    dest: "dist/"
                } ]
            }
        }
    });
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-dentist");
    grunt.registerTask("default", [ "dentist", "concat", "uglify", "copy", "clean" ]);
};
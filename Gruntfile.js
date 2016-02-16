module.exports = function(grunt) {

    // Global config
    var globalConfig = {
        path: {
            core: 'frontstart-data/core',
            dependencies: 'frontstart-data/dependencies',
            environment: 'frontstart-data/environment',
            develop: 'frontstart-develop',
            component: 'frontstart',
            www: 'frontstart-data/www'
        }
    };

    // Reusable targets
    var target = {
        concatJsFiles: {

            // Concat first all JS files (except folder prefixed with "-") from "core" and "initialize" folder, then "component theme*" folders, then all other "component" folders.
            // Output to main.js in "www" folder.
            '<%= globalConfig.path.www %>/<%= globalConfig.path.component %>/main.js': [
                '<%= globalConfig.path.core %>/environment.js',
                '<%= globalConfig.path.core %>/core.js',
                '<%= globalConfig.path.develop %>/<%= globalConfig.path.component %>/index/**/{index,*}.js',
                '<%= globalConfig.path.develop %>/<%= globalConfig.path.component %>/theme*/**/{index,*}.js',
                '<%= globalConfig.path.develop %>/<%= globalConfig.path.component %>/*/**/{index,*}.js',
                '!<%= globalConfig.path.develop %>/<%= globalConfig.path.component %>/-*/*.js']
            }
    };

    // Init Grunt config
    grunt.initConfig({

        // Include global config
        globalConfig: globalConfig,


        /**
         * Tasks
         */

        // Clean empty
        cleanempty: {
            www: {

                // Clean all empty folders in "www" folder.
                src: '<%= globalConfig.path.www %>/<%= globalConfig.path.component %>/**/*'
            }
        },

        // Concat
        concat: {

            // JS files
            develop: {
                options: { sourceMap: true },
                files: target.concatJsFiles
            },

            production: {
                options: {
                    separator: ';',
                    sourceMap: false
                },
                files: target.concatJsFiles
            }
        },

        // Concurrent
        concurrent: {
            develop: {

                // Compiling Compass is not triggered by normal watch task because Compass own watch task is faster. Thats why this tasks need to be concurrent.
                tasks: ['watch', 'sync:www'],
                options: { logConcurrentOutput: true }
            }
        },

        // Connect
        connect: {
            develop: {
                options: {
                    hostname: '*',
                    port: 8000,
                    useAvailablePort: true,
                    base: '<%= globalConfig.path.www %>'
                }
            },

            www: {
                options: {
                    hostname: '*',
                    port: 8000,
                    useAvailablePort: true,
                    base: '<%= globalConfig.path.www %>',
                    keepalive: true
                }
            }
        },

        // Copy
        copy: {
            develop: {
                expand: true,
                cwd: '<%= globalConfig.path.environment %>',
                src: 'develop.*',
                dest: '<%= globalConfig.path.core %>/',
                rename: function(dest, src) { return dest + src.replace(/develop/, 'environment'); }
            },

            production: {
                expand: true,
                cwd: '<%= globalConfig.path.environment %>',
                src: 'production.*',
                dest: '<%= globalConfig.path.core %>/',
                rename: function (dest, src) { return dest + src.replace(/production/, 'environment'); }
            },
        },

        // CSSmin
        cssmin: {
            dependencies: {
                files: {

                    // Output to dependencies.css in "www component" folder.
                    '<%= globalConfig.path.www %>/<%= globalConfig.path.component %>/dependencies.css':
                        '<%= globalConfig.path.dependencies %>/**/*.css'
                }
            }
        },

        // JSHint
        jshint: {
            options: { loopfunc: true },

            // Validate JS files
            src: [
                'Gruntfile.js',
                '<%= globalConfig.path.core %>/core.js',
                '<%= globalConfig.path.environment %>/*.js',
                '<%= globalConfig.path.develop %>/<%= globalConfig.path.component %>/*/**/*.js']
        },

        // Preprocess
        preprocess: {
            options: {
                context: {
                    ENV: 'production',
                    DEBUG: false
                },
                inline: true
            },

            // Prepocess all HTML files in "www" folder and all CSS en JS files in "www component" folder.
            files: {
                src: ['<%= globalConfig.path.www %>/**/*.html', '<%= globalConfig.path.www %>/<%= globalConfig.path.component %>/*/**/*.{css,js}']
            },
        },

        // Sass
        sass: {
            options: {
                includePaths: require('node-bourbon').includePaths,
                sourceMap: true
            },

            develop: {
                files: {
                    '<%= globalConfig.path.www %>/<%= globalConfig.path.component %>/main.css':
                        '<%= globalConfig.path.core %>/core.scss'
                }
            },

            production: {
                options: {
                    outputStyle: 'compressed'
                },
                files: {
                    '<%= globalConfig.path.www %>/<%= globalConfig.path.component %>/main.css':
                        '<%= globalConfig.path.core %>/core.scss'
                }
            }
        },

        sass_globbing: {
            components: {
                options: {
                    useSingleQuotes: false,
                    signature: '// Generated import for components'
                },
                files: {
                    '<%= globalConfig.path.core %>/components.scss': [


                        // Get first all SCSS index files
                        '<%= globalConfig.path.develop %>/<%= globalConfig.path.component %>/index/**/_index.scss',
                        '<%= globalConfig.path.develop %>/<%= globalConfig.path.component %>/theme*/**/_index.scss',
                        '<%= globalConfig.path.develop %>/<%= globalConfig.path.component %>/*/**/_index.scss',

                        // Get all other SCSS files
                        '<%= globalConfig.path.develop %>/<%= globalConfig.path.component %>/index/**/*.scss',
                        '<%= globalConfig.path.develop %>/<%= globalConfig.path.component %>/theme*/**/*.scss',
                        '<%= globalConfig.path.develop %>/<%= globalConfig.path.component %>/*/**/*.scss',

                        // Ignore folder prefixed with "-"
                        '!<%= globalConfig.path.develop %>/<%= globalConfig.path.component %>/-*/*.scss']
                }
            }
        },

        // Sync
        sync: {
            www: (function(){

                // When "www" is same as the "project root" folder.
                if(globalConfig.path.www === '.') {
                    return {
                        files: [{

                            // Sync all files (except folder prefixed with "-") from the "component" folder from "develop" to the "project root" folder excluding MD files and uncompiled files.
                            dot: false,
                            cwd: '<%= globalConfig.path.develop %>/<%= globalConfig.path.component %>',
                            src: ['**', '!**/-*/**/**/*.*', '!**/*.scss', '!**/*.js', '!**/*.md', '!bower.json', '!.bowerrc'],
                            dest: '<%= globalConfig.path.www %>/<%= globalConfig.path.component %>'
                        }],

                        // Compiled files does not exist in the develop folder. Therefore they are ignored in the www folder.
                        ignoreInDest: '*.*',
                        updateAndDelete: true,
                        verbose: true,
                    };

                } else {
                    return {
                        files: [{

                            // Sync all files (except folder prefixed with "-") from the "develop" to the "www" folder excluding MD files and uncompiled files.
                            dot: false,
                            cwd: '<%= globalConfig.path.develop %>',
                            src: ['**', '!**/-*/**', '!**/*.scss', '!**/*.js', '!**/*.md', '!bower.json', '!.bowerrc'],
                            dest: '<%= globalConfig.path.www %>'
                        }],

                        // Compiled files does not exist in the develop folder. Therefore they are ignored in the www folder.
                        ignoreInDest: '<%= globalConfig.path.component %>/*.*',
                        updateAndDelete: true,
                        verbose: true
                    };
                }
            }())
        },

        // Uglify
        uglify: {
            options: { mangle: false },

            dependencies: {
                files: {

                    // Output to dependencies.js in "www component" folder.
                    '<%= globalConfig.path.www %>/<%= globalConfig.path.component %>/dependencies.js':
                        '<%= globalConfig.path.dependencies %>/**/*.js'
                }
            },

            production: {
                files: {

                    // Uglify main.js in "www" folder.
                    '<%= globalConfig.path.www %>/<%= globalConfig.path.component %>/main.js':
                        '<%= globalConfig.path.www %>/<%= globalConfig.path.component %>/main.js'
                }
            }
        },

        // Watch
        watch: {
            options: {
                livereload: true,
                spawn: false
            },

            scss: {

                // Watch SCSS files for compiling in "develop component" folder.
                files: '<%= globalConfig.path.develop %>/<%= globalConfig.path.component %>/**/*.scss',
                tasks: ['sass_globbing:components', 'sass:develop']
            },

            js: {

                // Watch JS files for concatenating and validating in "develop component" folder.
                files: '<%= globalConfig.path.develop %>/<%= globalConfig.path.component %>/**/*.js',
                tasks: ['concat:develop', 'jshint']
            },

            sync:{

                // Watch all files for syncing and LiveReload except SCSS and JS files in "develop component" folder that should be compiled.
                files: ['<%= globalConfig.path.develop %>/**', '!<%= globalConfig.path.develop %>/<%= globalConfig.path.component %>/*/**/*.{scss,js}'],
                tasks: ['sync:www']
            }
        }
    });


    /**
     * Load tasks
     */

    grunt.loadNpmTasks('grunt-cleanempty');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-sass-globbing');
    grunt.loadNpmTasks('grunt-sync');


    /**
     * Register tasks
     */

    // Compress dependencies
    grunt.registerTask('compress:dependencies', [
        'cssmin:dependencies',
        'uglify:dependencies']);

    // www server and watch develop
    grunt.registerTask('server:develop', [
        'copy:develop',
        'concat:develop',
        'sass_globbing:components',
        'sass:develop',
        'jshint',
        'connect:develop',
        'concurrent:develop']);

    // www server
    grunt.registerTask('server', 'connect:www');

    // Build production
    grunt.registerTask('build:production', [
        'copy:production',
        'concat:production',
        'sass_globbing:components',
        'sass:production',
        'sync:www',
        'preprocess',
        'cleanempty:www',
        'uglify:production']);

    // Watch develop
    grunt.registerTask('watch:develop', [
        'copy:develop',
        'concat:develop',
        'sass_globbing:components',
        'sass:develop',
        'jshint',
        'concurrent:develop']);
};
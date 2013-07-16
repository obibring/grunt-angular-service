/*
 * grunt-angular-service
 * https://github.com/obibring/grunt-angular-service
 *
 * Copyright (c) 2013 Orr Bibring
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    ngservice: {
      default_options: {
        module: 'testModule',
        service: 'testService',
        files: {
          'tmp/default_options': ['test/fixtures/my-lib.js']
        }
      },
      with_define: {
        module: 'testModule',
        service: 'testService',
        define: true,
        files: {
          'tmp/with_define': ['test/fixtures/my-lib.js']
        }
      },
      with_dependencies: {
        module: 'testModule',
        service: 'testService',
        dependencies: ['dep1', 'dep2'],
        files: {
          'tmp/with_dependencies': ['test/fixtures/my-lib.js']
        }
      },
      with_define_and_dependencies: {
        module: 'testModule',
        service: 'testService',
        define: true,
        dependencies: ['dep1', 'dep2'],
        files: {
          'tmp/with_define_and_dependencies': ['test/fixtures/my-lib.js']
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'ngservice', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};

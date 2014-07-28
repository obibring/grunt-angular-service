/*
 * grunt-angular-service
 * https://github.com/obibring/grunt-angular-service
 *
 * Copyright (c) 2013 Orr Bibring
 * Licensed under the MIT license.
 */

/* Jshint directives below */
/*global module:true */

"use strict";

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      options: {
        camelcase: true,
        curly: true,
        eqeqeq: true,
        freeze: true,
        globalstrict: true,
        latedef: true,
        newcap: true,
        noarg: true,
        noempty: true,
        nonew: true,
        undef: true,
        unused: true,
      },
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      test: [
        'test/angular-service-test.js'
      ]
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    ngservice: {
      defaultOptions: {
        module: 'testModule',
        name: 'testService',
        files: {
          'tmp/defaultOptions.js': ['test/fixtures/my-lib.js']
        }
      },
      withDefine: {
        module: 'testModule',
        name: 'testService',
        defineModule: true,
        files: {
          'tmp/withDefine.js': ['test/fixtures/my-lib.js']
        }
      },
      withChoose: {
        module: 'testModule',
        name: 'testService',
        choose: 'chosen',
        files: {
          'tmp/withChoose.js': ['test/fixtures/my-lib.js']
        }
      },
      withDependencies: {
        module: 'testModule',
        name: 'testService',
        dependencies: ['dep1', 'dep2'],
        files: {
          'tmp/withDependencies.js': ['test/fixtures/my-lib.js']
        }
      },
      withDefineAndDependencies: {
        module: 'testModule',
        name: 'testService',
        defineModule: true,
        dependencies: ['dep1', 'dep2'],
        files: {
          'tmp/withDefineAndDependencies.js': ['test/fixtures/my-lib.js']
        }
      }
    },

    jsvalidate: {
      files: ['tmp/**/*']
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*-test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-jsvalidate');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', [
    'clean',
    'ngservice',
    'jsvalidate',
    'jshint:test',
    'nodeunit'
  ]);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};

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
      ],
      ngservices: {
        options: {
          globals: {
            angular: true,
            window: true
          },
          strict: false,
          sub: true, // allow bracket object dereferencing: x['key']
          undef: true,
          unused: false
        },
        src: ['tmp/*.js']
      },
      test: {
        options: {
          strict: false,
          undef: true,
          unused: true,
          globals: {
            expect: true,
            angular: true,
            describe: true,
            it: true
          }
        },
        src: ['test/spec/*.js']
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      files: ['tmp'],
    },

    // Configuration to be run (and then tested).
    ngservice: {
      windowMultiProperties: {
        exportStrategy: 'window',
        module: 'myTestModule1',
        name: 'test1Service',
        files: {
          'tmp/ng-window-lib-multi-property-no-choose.js': ['test/fixtures/window-lib-multi-property.js']
        }
      },
      windowSingleProperty: {
        exportStrategy: 'window',
        module: 'myTestModule2',
        name: 'test2Service',
        files: {
          'tmp/ng-window-lib-single-property.js': ['test/fixtures/window-lib-single-property.js']
        }
      },
      contextMultiProperties: {
        exportStrategy: 'context',
        module: 'myTestModule3',
        name: 'test3Service',
        files: {
          'tmp/ng-context-lib-multi-property-no-choose.js': ['test/fixtures/context-lib-multi-property.js']
        }
      },
      contextSingleProperty: {
        exportStrategy: 'context',
        module: 'myTestModule4',
        name: 'test4Service',
        files: {
          'tmp/ng-context-lib-single-property.js': ['test/fixtures/context-lib-single-property.js']
        }
      },
      chooseForWindow: {
        exportStrategy: 'window',
        module: 'myTestModule5',
        name: 'test5Service',
        choose: 'myExportedLib',
        files: {
          'tmp/ng-window-choose.js': ['test/fixtures/window-lib-multi-property.js']
        }
      },
      chooseForContext: {
        exportStrategy: 'context',
        module: 'myTestModule6',
        name: 'test6Service',
        choose: 'myExportedLib',
        files: {
          'tmp/ng-context-choose.js': ['test/fixtures/context-lib-multi-property.js']
        }
      },
      serviceDependency: {
        exportStrategy: 'window',
        module: '<%= ngservice.windowWithServiceDeps.module %>',
        name: 'five',
        files: {
          'tmp/ng-service-dependency.js': 'test/fixtures/service-dependency.js',
        },
      },
      windowWithServiceDeps: {
        exportStrategy: 'window',
        module: 'myTestModule7',
        name: 'test7Service',
        inject: ['<%= ngservice.serviceDependency.name %>'],
        files: {
          'tmp/ng-window-lib-with-deps.js': ['test/fixtures/window-lib-with-deps.js']
        }
      },
      serviceDependency2: {
        exportStrategy: 'window',
        module: '<%= ngservice.contextWithServiceDeps.module %>',
        name: 'five',
        files: {
          'tmp/ng-service-dependency2.js': 'test/fixtures/service-dependency.js',
        },
      },
      contextWithServiceDeps: {
        exportStrategy: 'context',
        name: 'test8Service',
        module: 'myTestModule8',
        inject: ['<%= ngservice.serviceDependency2.name %>'],
        files: {
          'tmp/ng-context-lib-with-deps.js': ['test/fixtures/context-lib-with-deps.js']
        }
      },
      windowWithModuleDeps: {
        exportStrategy: 'window',
        module: 'myDynamicModule',
        name: 'test9Service',
        defineModule: true,
        moduleDependencies: ['<%= ngservice.serviceDependency.module %>'],
        inject: ['<%= ngservice.serviceDependency.name %>'],
        files: {
          'tmp/ng-window-lib-with-module-deps.js': ['test/fixtures/window-lib-with-deps.js']
        }
      },
      contextWithModuleDeps: {
        exportStrategy: 'context',
        name: 'test10Service',
        module: 'myDynamicModule2',
        defineModule: true,
        moduleDependencies: ['<%= ngservice.serviceDependency2.module %>'],
        inject: ['<%= ngservice.serviceDependency2.name %>'],
        files: {
          'tmp/ng-context-lib-with-module-deps.js': ['test/fixtures/context-lib-with-deps.js']
        }
      },
      nodeMultiProperties: {
        exportStrategy: 'node',
        module: 'myTestModule9',
        name: 'test9Service',
        files: {
          'tmp/ng-node-lib-multi-property-no-choose.js': ['test/fixtures/node-lib-multi-property.js']
        }
      },
      nodeSingleProperty: {
        exportStrategy: 'node',
        module: 'myTestModule10',
        name: 'test10Service',
        files: {
          'tmp/ng-node-lib-single-property.js': ['test/fixtures/node-lib-single-property.js']
        }
      },
      serviceDependency3: {
        exportStrategy: 'window',
        module: '<%= ngservice.nodeWithServiceDeps.module %>',
        name: 'five',
        files: {
          'tmp/ng-service-dependency3.js': 'test/fixtures/service-dependency.js',
        },
      },
      nodeWithServiceDeps: {
        exportStrategy: 'node',
        name: 'test11Service',
        module: 'myTestModule11',
        inject: ['<%= ngservice.serviceDependency3.name %>'],
        files: {
          'tmp/ng-node-lib-with-deps.js': ['test/fixtures/node-lib-with-deps.js']
        }
      },
      chooseForNode: {
        exportStrategy: 'node',
        module: 'myTestModule12',
        name: 'test12Service',
        choose: 'myExportedLib',
        files: {
          'tmp/ng-node-choose.js': ['test/fixtures/node-lib-multi-property.js']
        }
      },
      nodeWithModuleDeps: {
        exportStrategy: 'node',
        name: 'test13Service',
        module: 'myDynamicModule3',
        defineModule: true,
        moduleDependencies: ['<%= ngservice.serviceDependency3.module %>'],
        inject: ['<%= ngservice.serviceDependency3.name %>'],
        files: {
          'tmp/ng-node-lib-with-module-deps.js': ['test/fixtures/node-lib-with-deps.js']
        }
      },
    },

    jsvalidate: {
      ngservice: {
        src: ['tasks/angular-service.js']
      },
      ngserviceOutput: {
        src: ['tmp/*.js']
      },
      test: {
        src: ['test/**/*.js']
      }
    },

    karma: {
      unit: {
        configFile: 'test/karma.conf.js'
      }
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-jsvalidate');
  grunt.loadNpmTasks('grunt-karma');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', [
    'clean',
    'ngservice',
    'jsvalidate',
    'karma'
  ]);

  grunt.registerTask('lint', [
    'jsvalidate',
    'jshint:all'
  ]);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};

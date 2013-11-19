/*
 * grunt-angular-service
 * https://github.com/obibring/grunt-angular-service
 *
 * Copyright (c) 2013 Orr Bibring
 * Licensed under the MIT license.
 */

 /*
 * 1. Read libraries.
 * 2. Check if libraries interact with global namespace (warn / throw).
 * 3.
 */
'use strict';
var _ = require('underscore');

var quoteWrap = function (dep) {
  // Wrap dependency in quotes.
  return "'" + dep + "'";
};

// Template that wraps JavaScript in angular factory definition.
//
// @param defineModule Boolean Whether to define a new module when creating
//    the service.
// @param dependencies Array An array of dppendencies injected
//    into the context of the library.
// @param choose String For libraries that export more than a single
//    property on their execution contexts, use this argument to
//    indicate which of the exported properties should be chosen
//    as the return value for the service.
//
var makeTemplate = function(defineModule, dependencies, choose) {

  var deps = dependencies || [];
  var defineStr = defineModule ? ', [' + deps.map(quoteWrap).join(', ') + ']' : '';
  var srvcStr = deps.length ? deps.map(quoteWrap).join(', ') + ', ' : '';

  var template =
    "(function(angular) {"+
    "  var isEmpty = function (obj) { " +
    "    for (var prop in obj) { " +
    "      if (obj.hasOwnProperty(prop)) { " +
    "        return false; " +
    "      } " +
    "    } " +
    "    return true; " +
    "  }; " +
    "  angular.module('<%= module %>'" + defineStr +  ")" +
    "    .factory('<%= name %>', [" + srvcStr + "function("+ deps.join(', ') +") {" +
    "      var module = {exports: {}}, exports = module.exports; " +
    "      var temp = function() {" +
    "        <%= src %>" +
    "      };";

  // Above, `src` may have dependencies. Thus, prior to executing `temp`
  // create an execution context injected with these dependencies.
  template += " var context = {}; ";

  // Keep track of which dependencies were injected into `context`.
  template += " var injected = {}; ";

  deps.forEach(function(dep){
    template += "context['" + dep + "'] = " + dep + ";";
    template += "injected['" + dep + "'] = true;";
  });

  template +=
    "      temp.call(context);" +
    // Export Strategy #1: Check if only a single property was added onto `context`.
    "      var addedProps = [];" +
    "      for (var prop in context) { " +
    "        if (context.hasOwnProperty(prop) && !injected.hasOwnProperty(prop)) { " +
    "           addedProps.push(prop);" +
    "        } " +
    "      }" +
    "      if (addedProps.length === 1) {" +
    "        return context[addedProps.pop()];";
  if (choose) {
    template +=
    "      } else if (context['" + choose + "'] !== undefined) { " +
    "        return context['" + choose + "']; ";
  }
  template +=
    // Export Strategy #2: Check for node style exports.
    "      } else if (!isEmpty(exports)) { ";
  if (choose) {
    template +=
    "       if (exports['" + choose + "'] !== undefined) { " +
    "         return exports['" + choose + "']; " +
    "       } ";
  }
  template +=
    "       return exports; " +
    "      } else {" +
    // `src` added more than a single property into `context`. Make no
    // assumptions and return the entire `context` object.
    "        return context;" +
    "      } " +
    "    }]);" +
    "  })(window.angular);";

  return template;
};

module.exports = function(grunt) {


  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('ngservice',
    'Generate AngularJS services from JavaScript libraries', function() {

        var warn = function (message) {
          grunt.log.warn(this.name + ": " + message);
        }.bind(this);

        var log = function (message) {
          grunt.log.writeln(this.name + ": " + message);
        }.bind(this);

        var fatal = function (message) {
          grunt.fatal(this.name + ": " + message);
        }.bind(this);

      var data = this.data;

      // Determine validity of `module` option.
      if (!_.has(data, 'module') || !_.isString(data.module)) {
        fatal('Invalid `module` option.');
      }

      // Determine validity of `name` option.
      if (!_.has(data, 'name') || !_.isString(data.name)) {
        fatal('Invalid `name` option.');
      }

      // Determine validity of `defineModule` option.
      if (_.has(data, 'defineModule') && !_.isBoolean(data.defineModule)) {
        fatal('Invalid `defineModule` option.');
      }

      var module = data.module;                       // Name of module.
      var defineModule = data.defineModule || false;  // Define the module?
      var dependencies = data.dependencies || [];     // Service dependencies.
      var name = data.name;                           // Name of service.
      var choose = data.choose;

      var sources = [];

      // Iterate over all specified file groups.
      this.files.forEach(function(f) {
        var src = f.src.filter(function(filepath) {
          // Warn on and remove invalid source files (if nonull was set).
          if (!grunt.file.exists(filepath)) {
            warn('Source file "' + filepath + '" not found.');
            return false;
          } else {
            return true;
          }
        }).map(function(filepath) {
          // Read file source.
          return grunt.file.read(filepath);
        }).forEach(function(srcString) {
          sources.push(srcString);
        });

        // If sources is empty, die.
        if (sources.length < 1) {
          fatal('No source files provided.');
        }

        var template = makeTemplate(defineModule, dependencies, choose);

        // Write the destination file.
        grunt.file.write(f.dest, _.template(template, {
          src: sources.join("\n"),
          module: module,
          name: name
        }));

        // Print a success message.
        log('File "' + f.dest + '" created.');

    });
  });

};

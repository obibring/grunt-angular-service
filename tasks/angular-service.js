/*
 * grunt-angular-service
 * https://github.com/obibring/grunt-angular-service
 *
 * Copyright (c) 2013 Orr Bibring
 * Licensed under the MIT license.
 */

/* Jshint directives below */
/*global module:true */
/*global require:true */

"use strict";
var _ = require('underscore');

var quoteWrap = function (dep) {
  // Wrap dependency in quotes.
  return "'" + dep + "'";
};

var DEFAULT_EXPORT_STRATEGY = 'defaule'
var VALID_EXPORT_STRATEGIES = ['context', 'exports', 'value', DEFAULT_EXPORT_STRATEGY];

function isValidExportStrategy (strategy) {
  return VALID_EXPORT_STRATEGIES.indexOf(strategy) > -1;
};

// Template that wraps JavaScript in angular factory definition.
//
// @param exportStrategy {String} There are many ways in which a JavaScript can
//   expose its API. By default, grunt-angular-service tries to make an educated
//   guess as to how the target library does so. If the default strategy
// @param defineModule {Boolean} Whether to define a new module when creating
//   the service.
// @param modDeps {Array} A list of dependencies to be passed as the second
//   argument to the module definition. `defineModule` must be set to `true`
//   for this to take effect.
// @param deps {Array} A list of dependencies that will be made available to
//   the target library as properties on `this`.
// @param choose {String} If `exportStrategy` is 'context', then
//
var makeTemplate = function(exportStrategy, defineModule, modDeps, deps, choose) {

  var defineStr = defineModule ? ', [' + modDeps.map(quoteWrap).join(', ') + ']' : '';
  var srvcStr = deps.length ? deps.map(quoteWrap).join(', ') + ', ' : '';

  if (!isValidExportStrategy(exportStrategy)) {
    throw new Error("Invalid `exportStrategy` argument.");
  }

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
    "    .<%= providerType %>('<%= name %>', [" + srvcStr + "function("+ deps.join(', ') +") {" +
    // Create a variable that shadows the global `module` provided by node.
    // Later, we inspect this shadowed object to see if the target library added
    // properties onto it.
    "      var exportsHash = {};" +
    "      var module = {exports: exportsHash}, exports = module.exports; " +
    // temp() is a wrapper function inside of which the target library's code
    // will be executed.
    "      var temp = function() {" +
    "        return <%= targetLibrarySourceCode %>" +
    "      };";

  // Above, `targetLibrarySourceCode` may have dependencies. Thus, prior to executing `temp`
  // create an execution context injected with these dependencies.
  template += " var context = {}; ";

  // Keep track of which dependencies were injected into `context`.
  template += " var injected = {}; ";

  // Loop through each dependency, and assign it as a property on the
  // context that the target library will execute in.
  deps.forEach(function(dep){
    template += "context['" + dep + "'] = " + dep + ";";
    template += "injected['" + dep + "'] = true;";
  });

  template +=
    // Execute the target library's code, with `this` set to the context
    // variable created above.
    "     var returnValue = temp.call(context);";

  // Export Strategy #1: `context`
  if (exportStrategy === 'context') {
    if (choose) {
      template +=
        " return context['" + choose + "']; ";
    } else {
      template +=
        " return context;";
    }
  }

  // Export Strategy #2: module.exports
  if (exportStrategy === 'exports') {
    if (choose) {
      template +=
        " return exports['" + choose + "']; ";
    } else {
      template +=
        " return exports;";
    }
  }

  // Export strategy #3: `value`
  if (exportStrategy === 'value') {
    if (choose) {
      template +=
        " return returnValue['" + choose + "']; ";
    } else {
      template +=
        " return returnValue;";
    }
  }

  /**
   * The default export strategy:
   *  1. If choose was passed and module.exports[choose] exists, return it.
   *  2. If choose was passed and context[choose] exists, return it.
   *  3. If choose was passed, and returnValue[choose] exists, return it.
   *  4. If choose was passed but checks 1-3 failed, return undefined.
   *  5. If returnValue is not null or undefined, return it.
   *  6. If module.exports was re-assigned, return module.exports.
   *  7. If module.exports has a single property, return the value of that property.
   *  8. If module.exports has more than a single property, return module.exports.
   *  9. If context has a single property, return the value of the single property.
   *  10. If context has more than a single property, return context.
   *  11. Return undefined.
  **/
  if (_.isUndefined(exportStrategy)) {
    if (choose) {
      template +=
        // Check 1.
        " if (!angular.isUndefined(module.exports['" + choose + "'])) {" +
        "   return module.exports['" + choose + "'];" +
        " }" +
        // Check 2
        " if (!angular.isUndefined(context['" + choose + "'])) {" +
        "   return context['" + choose + "'];" +
        " }" +
        // Check 3
        " if (!angular.isUndefined(returnValue['" + choose + "'])) {" +
        "   return returnValue['" + choose + "'];" +
        " }" +
        // Check 4
        " return undefined;";
    } else {
      template +=
        // Check 5
        " if (!angular.isUndefined(returnValue) && returnValue !== null) {" +
        "   return returnValue;" +
        " }" +
        // Check 6
        " if (angular.isObject(module.exports) && module.exports !== exportsHash) {" +
        "   return module.exports; " +
        " }" +
        " if (angular.isObject(module.exports) && !isEmpty(module.exports)) { " +
        "   var exportProps = [];" +
        "   angular.forEach(module.exports, function (prop, value) {" +
        "     exportProps.push(prop);" +
        "   });"+
        // Check 7
        "   if (exportProps.length === 1) {" +
        "     return module.exports[exportProps.pop()];" +
        "   }" +
        // Check 8
        "   return module.exports;" +
        " }" +
        // Remove all dependencies from `context` that were injected into it earlier.
        " angular.forEach(injected, function (dependency, junk) {" +
        "   delete context[dependency];" +
        " });" +
        " if (!isEmpty(context)) {" +
        "   var contextProps = [];" +
        "   angular.forEach(context, function (prop, value) {" +
        "     contextProps.push(prop);" +
        "   });"+
        // Check 9
        "   if (contextProps.length === 1) {" +
        "     return context[contextProps.pop()];" +
        "   }" +
        // Check 10
        "   return context;" +
        " }"+
        // Check 11
        " return undefined;";
    }
  }

  template +=
    "  }]);" +
    "})(window.angular);";

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

      var exportStrategy = data.exportStrategy || DEFAULT_EXPORT_STRATEGY;
      var providerType = data.provider || 'factory';       // Type of Angular provider to declare.
      var module = data.module;                            // Name of module.
      var defineModule = data.defineModule || false;       // Define the module?
      var modDeps = data.moduleDependencies || []; // Service dependencies.
      var deps = data.dependencies || [];          // Service dependencies.
      var name = data.name;                                // Name of service.
      var choose = data.choose;

      var sources = [];

      // Iterate over all specified file groups.
      this.files.forEach(function(f) {
        f.src.filter(function(filepath) {
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

        try {
          var template = makeTemplate(exportStrategy, defineModule, modDeps, deps, choose);
        } catch (e) {
          fatal(e.message);
        }

        // Write the destination file.
        grunt.file.write(f.dest, _.template(template, {
          providerType: providerType,
          targetLibrarySourceCode: sources.join("\n"),
          module: module,
          name: name
        }));

        // Print a success message.
        log('File "' + f.dest + '" created.');

    });
  });

};

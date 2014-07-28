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
var beautify = require('js-beautify').js_beautify;

var quoteWrap = function (dep) {
  // Wrap dependency in quotes.
  return "'" + dep + "'";
};

var VALID_EXPORT_STRATEGIES = ['window', 'context', 'node', 'value'];
var VALID_PROVIDERS = ['service', 'factory'];
var DEFAULT_PROVIDER = 'factory';

function isValidExportStrategy (strategy) {
  return VALID_EXPORT_STRATEGIES.indexOf(strategy) > -1;
}

function isValidProvider (provider) {
  return VALID_PROVIDERS.indexOf(provider) > -1;
}


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
// @param choose {String} If `exportStrategy` is 'this', then
//
var makeTemplate = function(exportStrategy, defineModule, modDeps, deps, choose) {

  var defineStr = defineModule ? ', [' + modDeps.map(quoteWrap).join(', ') + ']' : '';
  var srvcStr = deps.length ? deps.map(quoteWrap).join(', ') + ', ' : '';

  // Create the content for the service provider function. This is the code passed to
  // one of angular's provider methods ('service', 'factory', etc). Each exportStrategy
  // will set a different value for this body.
  var funcBody = "";

  if (exportStrategy === 'window') {
    funcBody +=
      "   var window = {};" +
      "   var injected = {};";

      // Loop through each dependency, and assign it as a property on the
    // context that the target library will execute in.
    deps.forEach(function(dep){
      funcBody +=
        " window['" + dep + "'] = " + dep + ";" +
        " injected['" + dep + "'] = true;";
    });

    funcBody +=
      "   <%= targetLibrarySourceCode %>";

    if (choose) {
      funcBody +=
        " return window['" + choose + "']; ";
    } else {
      // Check if the target library only exported a single value onto window.
      // If so, return that single value, otherwise return the entire mock
      // window object.
      funcBody +=
        " var propsAddedByTargetLib = [];" +
        " angular.forEach(window, function (val, prop) { " +
        "   if (angular.isUndefined(injected[prop])) { " +
        "     propsAddedByTargetLib.push(val); " +
        "   }" +
        " });" +
        " if (propsAddedByTargetLib.length === 1) {" +
        "   return propsAddedByTargetLib.pop();" +
        " } else { " +
        "   return window;" +
        " } ";
    }
  } // "window" exportStrategy

  // Export Strategy #1: `this`
  if (exportStrategy === 'context') {
    funcBody +=
      "   var temp = function() {" +
      "     <%= targetLibrarySourceCode %>" +
      "   };" +
      "   var context = {}; " + // Create the context we call our temporary function with.
      "   var injected = {}; "; // Keep track of dependencies injected into `context`.

    // Loop through each dependency, and assign it as a property on the
    // context that the target library will execute in.
    deps.forEach(function(dep){
      funcBody +=
        " context['" + dep + "'] = " + dep + ";" +
        " injected['" + dep + "'] = true;";
    });

    funcBody +=
      "   temp.call(context);";

    if (choose) {
      funcBody +=
        " return context['" + choose + "']; ";
    } else {
      // Check if the target library only exported a single value onto context.
      // If so, return that single value, otherwise return the entire context
      // object.
      funcBody +=
        " var propsAddedByTargetLib = [];" +
        " angular.forEach(context, function (val, prop) { " +
        "   if (angular.isUndefined(injected[prop])) { " +
        "     propsAddedByTargetLib.push(val);" +
        "   }" +
        " });" +
        " if (propsAddedByTargetLib.length === 1) {" +
        "   return propsAddedByTargetLib.pop();" +
        " } else { " +
        "   return context;" +
        " } ";
    }
  } // end `context` exportStrategy

  // Export Strategy #2: node
  if (exportStrategy === 'node') {
    funcBody +=
      "   var injected = {};";

    // Loop through each dependency, and assign it as a property on the
    // inject object to be used by our mock `require()` function.
    deps.forEach(function(dep){
      funcBody +=
        " injected['" + dep + "'] = " + dep + ";";
    });

    funcBody +=
      // Mock the require() function for providing dependencies to the target lib.
      "   var require = function (dependency) { " +
      "     return injected[dependency]; " +
      "   }" +
      // Create a variable that mocks the global `module` provided by node.
      // Later, we inspect this shadowed object to see if the target library added
      // properties onto it.
      "   var module = {exports: {}}, exports = module.exports; " +
      "   <%= targetLibrarySourceCode %>" +
      // If module.exports was set to something else, return it.
      "   if (!angular.isObject(module.exports)) { " +
      "     return module.exports;" +
      "   }";

    if (choose) {
      funcBody +=
        " return module.exports['" + choose + "']; ";
    } else {
      // Check if the target library only exported a single value onto context.
      // If so, return that single value, otherwise return the entire context
      // object.
      funcBody +=
        " var propsAddedByTargetLib = [];" +
        " angular.forEach(module.exports, function (val, prop) { " +
        "   if (angular.isUndefined(injected[prop])) { " +
        "     propsAddedByTargetLib.push(val);" +
        "   }" +
        " });" +
        " if (propsAddedByTargetLib.length === 1) {" +
        "   return propsAddedByTargetLib.pop();" +
        " } else { " +
        "   return module.exports;" +
        " } ";
    }
  } // end `exports` exportStrategy

  // Export strategy #3: `value`
  if (exportStrategy === 'value') {
    funcBody +=
      "   var returnValue = <%= targetLibrarySourceCode %>;";

    if (choose) {
      funcBody +=
        " return returnValue['" + choose + "']; ";
    } else {
      funcBody +=
        " return returnValue;";
    }
  } // end `value` exportStrategy

  var template =
    "(function(angular) {"+
    "  angular.module('<%= module %>'" + defineStr +  ")" +
    "    .<%= provider %>('<%= name %>', [" + srvcStr + "function("+ deps.join(', ') +") {" +
    "      " + funcBody +
    "    }]);" +
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

      if (!_.has(data, 'exportStrategy')) {
        fatal('`exportStrategy` setting not provided.');
      }

      // Determine validity of `module` option.
      if (!_.has(data, 'module') || !_.isString(data.module)) {
        fatal('Invalid `module` setting.');
      }

      // Determine validity of `name` option.
      if (!_.has(data, 'name') || !_.isString(data.name)) {
        fatal('Invalid `name` setting.');
      }

      // Determine validity of `defineModule` option.
      if (_.has(data, 'defineModule') && !_.isBoolean(data.defineModule)) {
        fatal('Invalid `defineModule` option.');
      }

      var exportStrategy = data.exportStrategy;
      var provider = data.provider || DEFAULT_PROVIDER;   // Type of Angular provider to declare.
      var module = data.module;                           // Name of module.
      var defineModule = data.defineModule || false;      // Define the module?
      var modDeps = data.moduleDependencies || [];        // Service dependencies.
      var deps = data.inject || [];                       // Service dependencies.
      var name = data.name;                               // Name of service.
      var choose = data.choose;
      var pretty = data.pretty || true;

      // If pretty is `true`, set it to default beautifier settings.
      if (pretty === true) {
        pretty = {indent_size: 2, indent_char: ' '};
      }

      if (!isValidExportStrategy(exportStrategy)) {
        fatal("Invalid export strategy. Must be one of: " + VALID_EXPORT_STRATEGIES.join(', '));
      }

      if (!isValidProvider(provider)) {
        fatal("Invalid provider. Must be one of: " + VALID_PROVIDERS.join(', '));
      }

      if (_.isString(deps)) {
        deps = [deps];
      }

      if (_.isString(modDeps)) {
        modDeps = [modDeps];
      }

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

        var template = makeTemplate(exportStrategy, defineModule, modDeps, deps, choose);
        var formatter = pretty ? beautify : function(src) { return src; };

        // Write the destination file.
        grunt.file.write(f.dest, formatter(_.template(template, {
          provider: provider,
          targetLibrarySourceCode: sources.join("\n"),
          module: module,
          name: name
        }), pretty));

        // Print a success message.
        log('File "' + f.dest + '" created.');

    });
  });

};

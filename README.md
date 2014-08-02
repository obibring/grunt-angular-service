# grunt-angular-service
[![Build Status](https://travis-ci.org/obibring/grunt-angular-service.svg)](https://travis-ci.org/obibring/grunt-angular-service)
[![Dependency Status](https://david-dm.org/obibring/grunt-angular-service.png)](https://david-dm.org/obibring/grunt-angular-service)
[![devDependency Status](https://david-dm.org/obibring/grunt-angular-service/dev-status.png)](https://david-dm.org/obibring/grunt-angular-service/dev-status)

Convert libraries to Angular services as part of your workflow.

`grunt-angular-service` wraps JavaScript code in calls to either
`angular.module().service()`, or `angular.module().factory`,
thereby creating code you can inject via Angular's dependency
injection.


## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out
the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how
to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use
Grunt plugins. Once you're familiar with that process, you may install this plugin
with this command:

```shell
npm install grunt-angular-service --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this
line of JavaScript:

```js
grunt.loadNpmTasks('grunt-angular-service');
```

## The "ngservice" task


### How it Works
  1. You provide `ngservice` a target library. This is the library to be wrapped
  by either `service()` or `factory()`.
  2. `Ngservice` creates a file containing your target library's code, plus a call to
  `angular.module().service()` or `angular.module().factory()`.
  3. When the file from step 2 is run, the target library's API is returned as the
  newly created service based on the `exportStrategy` setting you provide in the `ngservice`
  grunt task configuration.


### Use Cases
  1. You aren't using a script loader, and want angular style DI for all your
  non-Angular libraries.
  2. You have a node library you want to use client side with angular.
  3. You want to be able to mock non-Angular dependencies in an Angular way.

There are probably many more use cases. If any come to mind, please share.

## Overview
In your project's Gruntfile, add a section named `ngservice` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  ngservice: {
    exportStrategy: 'window',  // How the target library exposes its API.
    name: 'myLibService',      // First argument passed to angular.factory(), angular.service(), etc.
    module: 'myLibModule',     // Name of Module the service is being added to.
    defineModule: true,        // Define a new module?
    files: {
        'my_library_as_angular_service.js': 'my_library.js'
    }
  },
})
```

Will produce the file `my_library_as_angular_service.js`:

```js
angular.module('myLibModule', []).factory('myLibAsService', function() {
  // Your library here.
  // Your library's API returned here.
});
```

## Settings

### name
Type: `String`, Required

The name of the service being created.

### module
Type: `String`, Required

The name of the module to which the service is added. If creating a new module, set
`defineModule` to `true`.

### exportStrategy
> Informs `ngservice` how the target library exposes its API.

Type: `String` Required, Values: `window`, `context`, `node`

 * `window`: Target library sets API on window, ie: `window.someAttr = ...`
 * `context`: Target library sets API on `this`, ie: `this.someAttr = ...`
 * `node`: Target library sets API on `module.exports`, ie: `module.exports = ...`

For more detailed information, see [here](#export-strategies).

### inject
Type: `Array` or `String`

A list of dependencies injected into the provider function and
made available to the target library. This is needed if the target library depends
on other libraries that have also been converted to angular services using `ngservice`.

```javascript
// Below, dep1 and dep2 and injected.
angular.module('myModule').factory(['dep1', 'dep2', function(dep1, dep2){ ... }]);

  // If exportStrategy is window:
  window.dep1 = dep1;
  window.dep2 = dep2;

  // If exportStrtagey is context:
  this.dep1 = dep1;
  this.dep2 = dep2;

  // If exportStrategy is node:
  var require = function (dependency) {
    if (dependency === 'dep1') return dep1;
    if (dependency === 'dep2') return dep2;
  };

  // Target library source code goes here.

  // Target library API returned here.
```

### moduleDependencies
Type: `Array` or `String` Default Value: `None`

If the `inject` setting references dependencies from other modules, use this setting
to declare those other modules. *This setting only applies when `defineModule`
is set to `true`*.

```javascript
// The second argument to the module() method are the moduleDependencies.
angular.module('myModule', ['dependency1', 'dependency2'].factory(...);
```

### provider
Type: `String` Default: `factory`, Values: `factory`, `service`

The type of service to register with Angular.

### defineModule
Type: `Boolean` Default Value: `false`

Whether to define the module.

### choose
Type: `String`

Declare the name of a specific property to be used as the return value of the provider
function. Use this when you're only interested in exporting a portion of the
target library's API.


## Usage Examples

### Convert underscore.js to angular service
```js
grunt.initConfig({
  ngservice: {
    module: "somePreExistingModule",  // If this module doesn't exist, set defineModule: true
    name: "_",
    files: {
      'services/underscore_service.js': 'path/to/underscore.js',
    },
  },
})
```

### Convery Backbone.js to angular service (with underscore dependency)
In this contrived example, underscore.js and Backbone.js are both converted to angular services, with the former provided as a dependency to the latter.

```js
grunt.initConfig({
  ngservice: {
    underscore: {
      name: '_',
      module: 'ngUnderscore',
      defineModule: true,
      files: {
        'services/underscore_service.js': 'path/to/underscore.js',
      }
    },
    backbone: {
      name: 'Backbone',
      module: 'ngBackbone',
      defineModule: true,
      moduleDependencies: ['ngUnderscore'],
      inject: ['_'],
      files: {
        'services/backbone_service.js': 'path/to/backbone.js',
      }
    }
  }
})
```

#### Export Strategies

At its core, `ngservice` maps a target library's API to
the return value of `service()` or `factory()` provider function. To return the
correct value, `ngservice` must understand how the target library exports its API.

##### `'window'`
Use this option when the target library exposes its API by adding a property onto
`window`. *When this option is selected, references to `window` from within the
target library will point to a mock `window` object, not the browser's native `window`
object* (to prevent global namespace littering). Any dependencies listed in the
`inject` setting will be added onto the mock `window` object and hence made
available to the target library via `window[dependencyName]`.

##### `'context'`
Use this option when the target library exposes its API by adding properties onto
its context (onto `this`). If the library adds a multiple properties onto `this`, and
you're only interested one of them, use the `choose` setting to select
just the one property as the return value of the provider method.

##### `'node'`
Use this option when the target library uses node style
If the target library uses node style `module.exports`, use this option.
If the target library adds more than one property onto `module.exports` and you only
care to retrieve one of these properties, use the `choose` option.



## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality.

## Release History
_(Nothing yet)_

## Testing
`npm install`
`npm test`

## License
The MIT License

Copyright (c) 2013 Orr Bibring

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

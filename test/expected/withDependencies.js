(function(angular) {
  var isEmpty = function (obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  };
  angular.module('testModule').factory('testService', ['dep1', 'dep2', function(dep1, dep2) {
    var exportsHash = {};
    var module = {exports: exportsHash}, exports = module.exports;
    var temp = function() {
      return (function(root){
        root.myExportedLib = function(){ return 'hello world'; };
      })(this);
    };
    var context = {};
    var injected = {};
    context['dep1'] = dep1;
    injected['dep1'] = true;
    context['dep2'] = dep2;
    injected['dep2'] = true;
    var returnValue = temp.call(context);
    if (!angular.isUndefined(returnValue) && returnValue !== null) {
      return returnValue;
    }
    if (angular.isObject(module.exports) && module.exports !== exportsHash) {
      return module.exports;
    }
    if (angular.isObject(module.exports) && !isEmpty(module.exports)) {
      var exportProps = [];
      angular.forEach(module.exports, function (prop, value) {
        exportProps.push(prop);
      });
      if (exportProps.length === 1) {
        return module.exports[exportProps.pop()];
      }
      return module.exports;
    }
    angular.forEach(injected, function (dependency, junk) {
      delete context[dependency];
    });
    if (!isEmpty(context)) {
      var contextProps = [];
      angular.forEach(context, function (prop, value) {
        contextProps.push(prop);
      });
      if (contextProps.length === 1) {
        return context[contextProps.pop()];
      }
      return context;
    }
    return undefined;
  }]);
})(window.angular);

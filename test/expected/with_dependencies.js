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
    var module = {exports: {}}, exports = module.exports;
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
    if (!isEmpty(exports)) {
      var exportProps = [];
      angular.forEach(exports, function (prop, value) {
        exportProps.push(prop);
      });
      if (exportProps.length === 1) {
        return exports[exportProps.pop()];
      }
      return exports;
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

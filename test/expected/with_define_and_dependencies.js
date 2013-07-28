(function(angular) {
  var isEmpty = function (obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  };
  angular.module('testModule', ['dep1', 'dep2'])
    .factory('testService', ['dep1', 'dep2', function(dep1, dep2) {
      var module = {exports: {}}, exports = module.exports;
      function temp() {
        (function(root){
          root.myExportedLib = function(){ return 'hello world'; };
        })(this);
      }
      var context = {};
      var injected = {};
      context['dep1'] = dep1;
      injected['dep1'] = true;
      context['dep2'] = dep2;
      injected['dep2'] = true;
      temp.call(context);
      var addedProps = [];
      for (var prop in context) {
        if (context.hasOwnProperty(prop) && !injected.hasOwnProperty(prop)) {
          addedProps.push(prop);
        }
      }
      if (addedProps.length === 1) {
        return context[addedProps.pop()];
      } else if (!isEmpty(exports)) {
        return exports;
      } else {
        return context;
      }
    }]);
})(window.angular);

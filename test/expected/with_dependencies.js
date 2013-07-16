(function(angular) {
  angular.module('testModule')
    .factory('testService', ['dep1', 'dep2', function(dep1, dep2) {
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
      } else {
        return context;
      }
    }]);
})(window.angular);

(function(angular) {
  angular.module('testModule')
    .factory('testService', [function() {
      function temp() {
        (function(root){
          root.myExportedLib = function(){ return 'hello world'; };
        })(this);
      }
      var context = {};
      var injected = {};
      temp.call(context);
      var addedProps = [];
      for (var prop in context) {
        if (context.hasOwnProperty(prop) && !injected.hasOwnProperty(prop)) {
          addedProps.push(prop);
        }
      }
      if (addedProps.length === 1) {
        return context[addedProps.pop()];
      } else if (context['chosen'] !== undefined) {
        return context['chosen'];
      } else {
        return context;
      }
    }]);
})(window.angular);

(function(angular) {
  var isEmpty = function (obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  };
  angular.module('testModule', [])
    .factory('testService', [function() {
      var module = {exports: {}}, exports = module.exports;
      var temp = function() {
        (function(root){
          root.myExportedLib = function(){ return 'hello world'; };
        })(this);
      };
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
      } else if (!isEmpty(exports)) {
        return exports;
      } else {
        return context;
      }
    }]);
})(window.angular);

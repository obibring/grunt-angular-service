(function(angular) {
  var isEmpty = function (obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  };
  angular.module('testModule').factory('testService', [function() {
    var module = {exports: {}}, exports = module.exports;
    var temp = function() {
      return (function(root){
        root.myExportedLib = function(){ return 'hello world'; };
      })(this);
    };
    var context = {};
    var injected = {};
    var returnValue = temp.call(context);
    if (!angular.isUndefined(module.exports['chosen'])) {
      return module.exports['chosen'];
    }
    if (!angular.isUndefined(context['chosen'])) {
      return context['chosen'];
    }
    if (!angular.isUndefined(returnValue['chosen'])) {
      return returnValue['chosen'];
    }
    return undefined;
  }]);
})(window.angular);

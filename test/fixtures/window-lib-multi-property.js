// A library that adds more than one property onto window.
(function(root){
  window.myExportedLib = function(){ return 'hello world'; };
  window.mySecondProperty = 44;
})(this);

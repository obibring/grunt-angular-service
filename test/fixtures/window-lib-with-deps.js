// A library that adds a single property onto window and has dependencies
// window.adder.
window.add5ToValue = function(value) {
  // Below, window.adder will be set by ngservice.
  return window.five + value;
};

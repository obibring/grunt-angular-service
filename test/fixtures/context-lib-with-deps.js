// A library that adds a single property onto window and has dependencies
// window.adder.
five = this.five;
this.add5ToValue = function(value) {
  // Below, window.adder will be set by ngservice.
  return five + value;
};

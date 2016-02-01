const util = require('util');

const Parameter = require('./parameter.js');

var internals = {};

internals.Argument = function(command, options) {
  Parameter.apply(this, arguments);
};
util.inherits(internals.Argument, Parameter);

exports = module.exports = internals.Argument;
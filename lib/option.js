const util = require('util');

const Parameter = require('./parameter.js');

var internals = {};

internals.Option = function(command, name, options) {
  Parameter.apply(this, [
    command,
    options
  ]);
  this.name = name;

  this.short = options.short || null;
  this.long = options.long || null;
};
util.inherits(internals.Option, Parameter);

exports = module.exports = internals.Option;
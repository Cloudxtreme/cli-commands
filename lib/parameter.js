var internals = {};

internals.Parameter = function(command, options) {
  this.command = command;
  options = options || {};
  this.description = options.description || ''; // string
  this.type = options.type || null; // string
  this.pattern = options.pattern || null; // regex
  this.default = options.default || null; // value
  this.required = options.required || false; // boolean
  this.before = options.before || null; // function
  this.validator = options.before || null; // function
};

internals.Parameter.prototype.argument = function(options) {
  return this.command.arg(options);
};

internals.Parameter.prototype.option = function(name, options) {
  return this.command.option(name, options);
};

internals.Parameter.prototype.action = function(callback) {
  return this.command.action(callback);
};

exports = module.exports = internals.Parameter;
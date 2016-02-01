const Argument = require('./argument.js');
const Option = require('./option.js');

var internals = {};

internals.Command = function(name, options) {
  this.name = name;
  options = options || {};
  this.description = options.description || ''; // string
  this.options = options.options || {};
  // @todo: check if arguments is okay
  this.args = options.args || [];
};

internals.Command.prototype.arg = function(options) {
  var arg = new Argument(this, options);
  this.args.push(arg);
  return arg;
};

internals.Command.prototype.option = function(name, options) {
  var option = new Option(this, name, options);
  this.options[name] = option;
  return option;
};

internals.Command.prototype.action = function(callback) {
  this.action = callback;
  return this;
};

internals.Command.prototype.findOption = function(identifier, optionType) {
  optionType = optionType || 'short';
  for (var name in this.options) {
    if (!this.options.hasOwnProperty(name)) {
      continue;
    }
    var option = this.options[name];
    if (option[optionType] === identifier) {
      return name;
    }
  }
  return null;
};

exports = module.exports = internals.Command;
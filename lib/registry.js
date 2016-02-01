const readline = require('readline');

const Command = require('./command.js');
const Parser = require('./parser.js');

var internals = {};

internals.Registry = function (options) {
  var self = this;
  options = options || {};

  this.commands = {};
  this.parser = new Parser(this, options.parser);

  this.interface = readline.createInterface({
    input: options.input || process.stdin,
    output: options.output || process.stdout
    // @todo: other options like completer
  });
  this.interface.setPrompt(options.prompt || '> ');

  this.interface.on('line', function(line) {
    var result = self.parser.parse(line);
    if (!result) {
      throw new Error('Parsing error');
    }
    var command = self.commands[result.command];
    if (command.action && typeof command.action === 'function') {
      command.action(result.args, result.options);
    }
    self.interface.prompt();
  });
  self.interface.prompt();
};

internals.Registry.prototype.command = function (name, options) {
  var command = new Command(name, options);
  this.commands[name] = command;
  return command;
};

internals.Registry.prototype.handle = function(result) {

};

module.exports = exports = new internals.Registry();
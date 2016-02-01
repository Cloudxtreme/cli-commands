var internals = {};

internals.Parser = function(registry, options) {
  options = options || {};
  this.registry = registry;
  this.removeQuotes = options.removeQuotes || true;
};

internals.Parser.prototype.parse = function(line) {
  var self = this;
  line = line.replace(/\\\n/g, '');

  var result = {
    command: null,
    args: [],
    options: {}
  };

  var current = '';
  var quoteType = null;

  var isArg = false;
  var optionName = null;
  var optionType = null;

  var index = 0;

  function debug() {
    console.log({
      current: current,
      quoteType: quoteType,
      isArg: isArg,
      optionName: optionName,
      optionType: optionType,
      index: index
    });
  }
  // @todo: Handle options with - (dash) in their name
  // @todo: Handle multiple short options with one - (dash)

  function next() {
    if (!result.command) {
      result.command = current;
      current = '';
    } else if (isArg) {
      result.args.push(current);
      current = '';
      isArg = false;
    } else if (optionType) {
      if (!optionName) {
        optionName = self.findOptionName(current, optionType);
        current = '';
      } else {
        result.options[optionName] = current;
        optionName = null;
        optionType = null;
      }
    }
    if (index === line.length) {
      if (optionName) {
        result.options[optionName] = true;
      }
      return result;
    }
    return parse();
  }

  function parse() {
    if (index === line.length) {
      return next();
    }
    var char = line.charAt(index);
    index++;

    if (char === '\'' || char === '"') {
      if (!self.removeQuotes) {
        current += char;
      }
      if (quoteType && quoteType == char) {
        return next();
      } else {
        quoteType = char;
      }
    } else if (char === '-') {
      if (quoteType) {
        current += char;
        return parse();
      }
      if (!optionType) {
        optionType = 'short';
      } else {
        optionType = 'long';
      }
      isArg = false;
    } else if (char === ' ') {
      if (quoteType) {
        current += char;
      }
      if (!optionType) {
        isArg = true;
      }
      return next();
    } else {
      current += char;
    }
    return parse();
  }
  return parse();
};

internals.Parser.prototype.findOptionName = function(identifier, optionType) {
  for (var name in this.registry.commands) {
    if (!this.registry.commands.hasOwnProperty(name)) {
      continue;
    }
    var command = this.registry.commands[name];
    var option = command.findOption(identifier, optionType);
    if (option) {
      return option;
    }
  }
  return null;
};

exports = module.exports = internals.Parser;
const nearley = require("nearley");
const grammar = require("./grammar");
const tools   = require("./tools");

const getNearleyGrammar = () => 
  nearley.Grammar.fromCompiled(grammar);

const getNearleyParser = () => 
  new nearley.Parser(getNearleyGrammar());

const parse = (expression) => {
  const parser = getNearleyParser();
  parser.feed(expression);
  return tools.flattenDeep(parser.results)[0];
};

const evaluate = (expression, context) => parse(expression)(context);

module.exports = {
  getNearleyGrammar,
  getNearleyParser,
  parse,
  evaluate,
};

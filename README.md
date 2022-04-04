# eth-expresion-parser

Expression parser for Ethereum expressions.

This library allows you to evaluate expressions or conditions that may contain:
- Mathematical operators: `+`, `-`, `*`, `/`
- Comparisons operators: `<`, `>`, `<=`, `=>`, `==`, `!=`
- Boolean oparator: `&&`, `||`, `!`
- Parenthesis: `()`
- Ether denominations: `ether`, `gwei`, `wei`
- Single quoted strings: `'string'`
- Numbers: `20`, `0xdead`, `1e18`
- Booleans: `true`, `false`

It also has support for:
- Indexing: `array[3]`
- Member access: `object.property`, `obj.args`
- Function calls: `object.func()`, `ojb.print(1, 2, 3, "text")`
- Variable names: `myVariable`, `_var`

## Installation
```bash
npm install eth-expresion-parser
```

## Usage

To evaluate an expresion you should provide the expression as well as a `context` that contains
the value of all the variables contained in the expression.

```javascript
const parser = require("eth-expresion-parser");
const ethers = require("ethers");

const expr = "(1e18 == 0x1 ether) && (obj.sum(a, 2, d[1][0]) + 4 > 3 wei) && (b[2] == 'x')";

const context = {
    a: ethers.BigNumber.from(1),
    b: "text",
    d: [9, [3]],
    obj: {
        sum(a, b, c) {
            return a.add(b).add(c);
        },
    }
};

console.log(parser.evaluate(expr, context)); // true
```

If you are familiar with [nearley](https://nearley.js.org/docs/index), you can get the parser 
or the grammar and use them however you prefer.
```javascript
const parser = require("eth-expresion-parser");

const grammar = parser.getNearleyGrammar();
const _parser = parser.getNearleyParser();
```

You can also get the function to evaluate your expression if needed.
```javascript
const parser = require("eth-expresion-parser");

const expr = "a < b";

const evaluate = parser.parse(expr);

console.log(evaluate({a: "a", b: "b"})); // true
console.log(evaluate({a: "c", b: "a"})); // false
```

### Underlying Types
The types used for booleans and string are the `javascript` native ones, but in case of 
numbers the type used is [ethers.BigNumber](https://docs.ethers.io/v5/api/utils/bignumber/).

The usage of `ethers.BigNumber` as underlying type implies that all the numerical values used in 
the `context` must also be of type `ethers.BigNumber` in order to be able to recognize them correctly.

## Extra notes:
- There is not support for floating precision numbers.


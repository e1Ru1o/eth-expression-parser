# eth-expression-parser

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
- Function calls: `object.func()`, `obj.print(1, 2, 3, 'text')`
- Variable names: `myVariable`, `_var`

## Installation
```bash
npm install eth-expression-parser
```

## Usage

To evaluate an expression you should provide the expression as well as a `context` that contains
the value of all the variables contained in the expression.

```javascript
const { evaluate } = require("eth-expression-parser");
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

console.log(evaluate(expr, context)); // true
```

If you are familiar with [nearley](https://nearley.js.org/docs/index), you can get the parser 
or the grammar and use them however you prefer.
```javascript
const parser = require("eth-expression-parser");

const grammar = parser.getNearleyGrammar();
const _parser = parser.getNearleyParser();
```

You can also get the function to evaluate your expression if needed.
```javascript
const { parse, toBigNumber } = require("eth-expression-parser");

const expr = "a < b";

const evaluate = parse(expr);

console.log(evaluate({a: toBigNumber(1), b: toBigNumber(3)})); // true
console.log(evaluate({a: "c", b: "a"})); // false
```

### Underlying Types
The types used for booleans and string are the `javascript` native ones, but in case of 
numbers the type used is [ethers.BigNumber](https://docs.ethers.io/v5/api/utils/bignumber/).

The usage of `ethers.BigNumber` as underlying type implies that all the numerical values used in 
the `context` must also be of type `ethers.BigNumber` in order to be able to recognize them correctly.

You can also use any method of the underlying types due to the function calls support:
```javascript
const { evaluate } = require("eth-expression-parser");

const expr = "1.toHexString() == '0x01'";

console.log(evaluate(expr, {})); // true
```

## Extra notes:
- There is not support for floating precision numbers.

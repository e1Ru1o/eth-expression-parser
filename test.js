const { parse, toBigNumber, evaluate } = require("./src/index");

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
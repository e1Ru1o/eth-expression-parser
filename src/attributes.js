/*
 * The attributes should return a function that 
 * evalueates the node based on a context 
 * 
 * */ 

const ethers = require("ethers");
const tools  = require("./tools");

/*
 * Grammar attributes
 *
 */

const lte = ([f0,,,, f1]) => (context) => {
    const left  = tools.flattenDeep([f0])[0](context);
    const right = tools.flattenDeep([f1])[0](context);

    if(ethers.BigNumber.isBigNumber(left) || ethers.BigNumber.isBigNumber(right))
        return ethers.BigNumber.from(left).lte(ethers.BigNumber.from(right));
    
    return left <= right;
};

const gte = ([f0,,,, f1]) => (context) => {
    const left  = tools.flattenDeep([f0])[0](context);
    const right = tools.flattenDeep([f1])[0](context);

    if(ethers.BigNumber.isBigNumber(left) || ethers.BigNumber.isBigNumber(right))
        return ethers.BigNumber.from(left).gte(ethers.BigNumber.from(right));
    
    return left >= right;
};

const eq = ([f0,,,, f1]) => (context) => {
    const left  = tools.flattenDeep([f0])[0](context);
    const right = tools.flattenDeep([f1])[0](context);

    if(ethers.BigNumber.isBigNumber(left) || ethers.BigNumber.isBigNumber(right))
        return ethers.BigNumber.from(left).eq(ethers.BigNumber.from(right));
    
    return left === right;
};

const neq = ([f0,,,, f1]) => (context) => {
    const left  = tools.flattenDeep([f0])[0](context);
    const right = tools.flattenDeep([f1])[0](context);

    if(ethers.BigNumber.isBigNumber(left) || ethers.BigNumber.isBigNumber(right))
        return !ethers.BigNumber.from(left).eq(ethers.BigNumber.from(right));
    
    return left !== right;
};

const lt = ([f0,,,, f1]) => (context) => {
    const left  = tools.flattenDeep([f0])[0](context);
    const right = tools.flattenDeep([f1])[0](context);

    if(ethers.BigNumber.isBigNumber(left) || ethers.BigNumber.isBigNumber(right))
        return ethers.BigNumber.from(left).lt(ethers.BigNumber.from(right));
    
    return left < right;
};

const gt = ([f0,,,, f1]) => (context) => {
    const left  = tools.flattenDeep([f0])[0](context);
    const right = tools.flattenDeep([f1])[0](context);

    if(ethers.BigNumber.isBigNumber(left) || ethers.BigNumber.isBigNumber(right))
        return ethers.BigNumber.from(left).gt(ethers.BigNumber.from(right));
    
    return left > right;
};

const str = (data) => (context) => data.flat().slice(1, -1).join("");

const name = (data)=> (context) => data.flat().join("");

const variable = (data, _, reject) => {
    const name = data.flat().join("");
    if(["true", "false"].includes(name.toLowerCase()))
        return reject;
    return (context) => context[data.flat().join("")];
};

const num = (data)=> (context) => ethers.BigNumber.from(data.flat().join(""));

const negnum = ([, num]) => (context) => num(context).mul(-1);

const scientific = ([num0,,num1]) => (context) => {
    const a = ethers.BigNumber.from(num0.flat().join(""));
    const b = ethers.BigNumber.from(num1.flat().join(""));

    return a.mul(ethers.BigNumber.from(10).pow(b));
}

const unit = (unitValue) => ([value,]) => (context) => tools.flattenDeep(value)[0](context).mul(ethers.BigNumber.from(unitValue));

const ether = unit("1000000000000000000");
const gwei  = unit("1000000000");
const wei   = unit("1");

const add = ([f0,,,,f1]) => (context) => {
    const left  = tools.flattenDeep([f0])[0](context);
    const right = tools.flattenDeep([f1])[0](context);

    if(ethers.BigNumber.isBigNumber(left) || ethers.BigNumber.isBigNumber(right))
        return ethers.BigNumber.from(left).add(ethers.BigNumber.from(right));
    
    return left + right;
};

const sub = ([f0,,,,f1]) => (context) => {
    const left  = tools.flattenDeep([f0])[0](context);
    const right = tools.flattenDeep([f1])[0](context);

    if(ethers.BigNumber.isBigNumber(left) || ethers.BigNumber.isBigNumber(right))
        return ethers.BigNumber.from(left).sub(ethers.BigNumber.from(right));
    
    return left - right;
};

const mul = ([f0,,,,f1]) => (context) => {
    const left  = tools.flattenDeep([f0])[0](context);
    const right = tools.flattenDeep([f1])[0](context);
    
    return ethers.BigNumber.from(left).mul(ethers.BigNumber.from(right));
};

const div = ([f0,,,,f1]) => (context) => {
    const left  = tools.flattenDeep([f0])[0](context);
    const right = tools.flattenDeep([f1])[0](context);
    
    return ethers.BigNumber.from(left).div(ethers.BigNumber.from(right));
};

const and = ([f0,,,,f1]) => (context) => {
    const left  = tools.flattenDeep([f0])[0](context);
    const right = tools.flattenDeep([f1])[0](context);
    
    return left && right;
};

const or = ([f0,,,,f1]) => (context) => {
    const left  = tools.flattenDeep([f0])[0](context);
    const right = tools.flattenDeep([f1])[0](context);
    
    return left || right;
};

const id = (value) => (_) => (context) => value;

const _true = id(true);
const _false = id(false);

const neg = ([,,f]) => (context) => {
    const expr = tools.flattenDeep([f])[0](context);
    
    if(ethers.BigNumber.isBigNumber(expr))
        return expr.isZero();
    return !expr;
};

const indexer = ([f,,indexFunc]) => (context) => {
    const value = tools.flattenDeep([f])[0](context);
    const index = tools.flattenDeep([indexFunc])[0](context);

    return value[index.toNumber()];
};

const get = ([f,,,,memberFunc]) => (context) => {
    const value = tools.flattenDeep([f])[0](context);
    const property = tools.flattenDeep([memberFunc])[0](context);

    return value[property];
};

const call = ([f,,,,memberFunc,,,,,]) => (context) => {
    const value = tools.flattenDeep([f])[0](context);
    const property = tools.flattenDeep([memberFunc])[0](context);

    return value[property]();
};

const callWithParams = ([f,,,,memberFunc,,,,paramsFunc,,]) => (context) => {
    const value = tools.flattenDeep([f])[0](context);
    const property = tools.flattenDeep([memberFunc])[0](context);
    const params = tools.flattenDeep([paramsFunc]).map(p => p(context));

    return value[property](...params);
};

module.exports = {
    // comparison
    gte, lte, eq, neq, lt, gt,
    // types
    str, variable, num, negnum, scientific,
    // units
    ether, gwei, wei,
    // binary operands
    add, sub, mul, div, and, or,
    // unary operands
    neg,
    // defaults
    _true, _false,
    // processors
    indexer, get, name, call, callWithParams,
};

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

    if(tools.isBigNumber(left) || tools.isBigNumber(right))
        return tools.toBigNumber(left).lte(tools.toBigNumber(right));
    
    return left <= right;
};

const gte = ([f0,,,, f1]) => (context) => {
    const left  = tools.flattenDeep([f0])[0](context);
    const right = tools.flattenDeep([f1])[0](context);

    if(tools.isBigNumber(left) || tools.isBigNumber(right))
        return tools.toBigNumber(left).gte(tools.toBigNumber(right));
    
    return left >= right;
};

const eq = ([f0,,,, f1]) => (context) => {
    const left  = tools.flattenDeep([f0])[0](context);
    const right = tools.flattenDeep([f1])[0](context);

    if(tools.isBigNumber(left) || tools.isBigNumber(right))
        return tools.toBigNumber(left).eq(tools.toBigNumber(right));
    
    return left === right;
};

const neq = ([f0,,,, f1]) => (context) => {
    const left  = tools.flattenDeep([f0])[0](context);
    const right = tools.flattenDeep([f1])[0](context);

    if(tools.isBigNumber(left) || tools.isBigNumber(right))
        return !tools.toBigNumber(left).eq(tools.toBigNumber(right));
    
    return left !== right;
};

const lt = ([f0,,,, f1]) => (context) => {
    const left  = tools.flattenDeep([f0])[0](context);
    const right = tools.flattenDeep([f1])[0](context);

    if(tools.isBigNumber(left) || tools.isBigNumber(right))
        return tools.toBigNumber(left).lt(tools.toBigNumber(right));
    
    return left < right;
};

const gt = ([f0,,,, f1]) => (context) => {
    const left  = tools.flattenDeep([f0])[0](context);
    const right = tools.flattenDeep([f1])[0](context);

    if(tools.isBigNumber(left) || tools.isBigNumber(right))
        return tools.toBigNumber(left).gt(tools.toBigNumber(right));
    
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

const num = (data)=> (context) => tools.toBigNumber(data.flat().join(""));

const negnum = ([, num]) => (context) => num(context).mul(-1);

const scientific = ([num0,,num1]) => (context) => {
    const a = tools.toBigNumber(num0.flat().join(""));
    const b = tools.toBigNumber(num1.flat().join(""));

    return a.mul(tools.toBigNumber(10).pow(b));
}

const unit = (unitValue) => ([value,]) => (context) => tools.flattenDeep(value)[0](context).mul(tools.toBigNumber(unitValue));

const ether = unit("1000000000000000000");
const gwei  = unit("1000000000");
const wei   = unit("1");

const add = ([f0,,,,f1]) => (context) => {
    const left  = tools.flattenDeep([f0])[0](context);
    const right = tools.flattenDeep([f1])[0](context);

    if(tools.isBigNumber(left) || tools.isBigNumber(right))
        return tools.toBigNumber(left).add(tools.toBigNumber(right));
    
    return left + right;
};

const sub = ([f0,,,,f1]) => (context) => {
    const left  = tools.flattenDeep([f0])[0](context);
    const right = tools.flattenDeep([f1])[0](context);

    if(tools.isBigNumber(left) || tools.isBigNumber(right))
        return tools.toBigNumber(left).sub(tools.toBigNumber(right));
    
    return left - right;
};

const mul = ([f0,,,,f1]) => (context) => {
    const left  = tools.flattenDeep([f0])[0](context);
    const right = tools.flattenDeep([f1])[0](context);
    
    return tools.toBigNumber(left).mul(tools.toBigNumber(right));
};

const div = ([f0,,,,f1]) => (context) => {
    const left  = tools.flattenDeep([f0])[0](context);
    const right = tools.flattenDeep([f1])[0](context);
    
    return tools.toBigNumber(left).div(tools.toBigNumber(right));
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
    
    if(tools.isBigNumber(expr))
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

    const returnValue = value[property];
    if(typeof returnValue === 'function')
        return returnValue.bind(value);
    return returnValue;
};

const callable = ([f,,,,,]) => (context) => {
    const value = tools.flattenDeep([f])[0](context);

    return value();
};

const callableWithParams = ([f,,,,paramsFunc,,,]) => (context) => {
    const value = tools.flattenDeep([f])[0](context);
    const params = tools.flattenDeep([paramsFunc]).map(p => p(context));

    return value(...params);
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
    indexer, get, name, callable, callableWithParams,
};

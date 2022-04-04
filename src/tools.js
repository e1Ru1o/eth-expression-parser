const ethers = require("ethers");

function toBigNumber(value) {
    return ethers.BigNumber.from(value);
};

function isBigNumber(value) {
    return ethers.BigNumber.isBigNumber(value);
};

function flattenDeep(arr1) {
    return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
};

module.exports = {
    flattenDeep,
    toBigNumber,
    isBigNumber,
};

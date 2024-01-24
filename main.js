var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
function logFunc(arr) {
    return (arr[0] && (arr[1] || (arr[2] && (arr[3] || (arr[4] && (arr[5] || (arr[6] && (arr[7] || (arr[8] && arr[9]))))))))) ? 1 : 0;
}
function a(arr) {
    return !(!arr[0] || arr[1]) ? 1 : 0;
}
function b(arr) {
    return ((arr[0] || arr[1]) && (arr[0] || arr[2])) ? 1 : 0;
}
function c(arr) {
    return arr.reduce(function (partial, a) { return partial + a; }) >= 3 ? 1 : 0;
}
// function logFunc(arr:Array<number>):number {
//     return (arr[0] !== arr[1]) ? 1:0
// }
/**
 *
 * @param number number to represent as bits
 * @param pCount wanted number of bits given in array (leading zeros)
 * @returns Array of 0s and 1s
 */
function getBits(number, pCount) {
    var bits = number.toString(2).split("").map(function (val) { return val === '1' ? 1 : 0; });
    if (bits.length < pCount) {
        bits.unshift.apply(bits, Array(pCount - bits.length).fill(0));
    }
    return bits;
}
function getResultsReal(logFunc, paramCount) {
    var t = [];
    for (var i = 0; i < Math.pow(2, paramCount); i++) {
        var bits = getBits(i, paramCount);
        t.push(logFunc(bits));
        // console.log(logFunc(bits),bits)
    }
    return t;
}
function getSingleResultWeighed(weight, inp) {
    return weight * inp;
}
function adjustWeightsLine(w, ti, rowNum) {
    var bits = getBits(rowNum, w.length - 1);
    bits.splice(0, 0, 1);
    var row = 0;
    for (var j = 0; j < w.length; j++) {
        row += getSingleResultWeighed(w[j], bits[j]);
    }
    var y = row >= 0 ? 1 : 0;
    if (ti - y !== 0) {
        for (var j = 0; j < w.length; j++) {
            w[j] += bits[j] * (ti - y);
        }
    }
}
function getAllResultsWeighed(w) {
    var res = [];
    for (var i = 0; i < Math.pow(2, w.length - 1); i++) {
        var bits = getBits(i, w.length - 1);
        bits.splice(0, 0, 1);
        var row = 0;
        for (var j = 0; j < w.length; j++) {
            row += getSingleResultWeighed(w[j], bits[j]);
        }
        res.push(row >= 0 ? 1 : 0);
    }
    return res;
}
function adjustWeightsEpoch(w, t) {
    t.forEach(function (ti, i) {
        adjustWeightsLine(w, ti, i);
    });
}
function trainNode(logFunc, paramCount) {
    var t = getResultsReal(logFunc, paramCount);
    var w = Array(paramCount + 1).fill(0);
    var wold = Array(paramCount + 1).fill(1);
    var epochs = 0;
    while (!w.every(function (val, i) { return val === wold[i]; }) && epochs < 10000) {
        epochs++;
        wold = __spreadArray([], w, true);
        console.log(w);
        adjustWeightsEpoch(w, t);
    }
    var found = getAllResultsWeighed(w);
    console.log("expected result", t);
    console.log("Artificial Intelligence result: ", getAllResultsWeighed(w));
    console.log('found weights: ', w);
    console.log("in ".concat(epochs, " epochs"));
    console.log("THE RESULT IS: ".concat(found.every(function (val, i) { return val === t[i]; }) ? '' : 'NOT', " CORRECT"));
}
trainNode(a, 2);
trainNode(b, 3);
trainNode(c, 4);

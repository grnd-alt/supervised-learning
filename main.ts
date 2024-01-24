interface Array<T> {
    fill(value: T): Array<T>;
    reduce(value:T,value2: T): T;
}


function logFunc(arr:Array<number>):number {
    return (arr[0] && (arr[1] || (arr[2] && (arr[3] || (arr[4] && (arr[5] || (arr[6] && (arr[7] || (arr[8] && arr[9]))))))))
    ) ? 1:0
}


function a(arr:Array<number>):number{
    return !(!arr[0] || arr[1]) ? 1:0
}


function b(arr:Array<number>):number{
    return (
        (arr[0] || arr[1]) && (arr[0] || arr[2])
    ) ? 1:0
}

function c(arr:Array<number>):number{
    return arr.reduce((partial,a) => partial + a) >= 3 ? 1 : 0
}


/**
 * 
 * @param number number to represent as bits
 * @param pCount wanted number of bits given in array (leading zeros)
 * @returns Array of 0s and 1s
 */
function getBits(number: number,pCount: number):Array<number>{
    let bits = number.toString(2).split("").map((val: string)=>val === '1' ? 1:0)
    if (bits.length<pCount){
        bits.unshift(...Array(pCount-bits.length).fill(0))
    }
    return bits
}


/**
 * 
 * @param logFunc logical expression to execute
 * @param paramCount number of parameters for logFunc
 * @returns Array<number> of length 2**paramCount containing all results of logFunc
 */
function getResultsReal(logFunc: (arg0: number[]) => number,paramCount: number) {
    let t:Array<number> = []
    for (let i = 0; i<Math.pow(2,paramCount); i++) {
        let bits = getBits(i,paramCount)
        t.push(logFunc(bits))
        // console.log(logFunc(bits),bits)
    }
    return t
}

function getSingleResultWeighed(weight: number,inp: number) {
    return weight * inp;
}

/**
 * 
 * @param w weights to adjust
 * @param ti real calculated results at that line
 * @param rowNum number of row to adjust in
 */
function adjustWeightsLine(w:Array<number>,ti:number, rowNum: number) {
    let bits = getBits(rowNum,w.length-1)
    bits.splice(0,0,1)
    let row = 0
    for (let j = 0; j < w.length; j++) {
        row += getSingleResultWeighed(w[j],bits[j])
    }
    
    let y = row >= 0 ? 1:0
    if (ti-y !== 0) {
        for (let j = 0; j < w.length;j++){
            w[j] += bits[j] * (ti - y)
        }
    }
}

/**
 * @param w weights
 * @returns Array<number> array of all results calculated with getSingelResultWeighed
 */
function getAllResultsWeighed(w:Array<number>){
    let res:Array<number> = []
    for (let i = 0; i < Math.pow(2,w.length-1);i++) {
        let bits = getBits(i,w.length-1)
        bits.splice(0,0,1)
        let row = 0
        for (let j = 0; j < w.length; j++) {
            row += getSingleResultWeighed(w[j],bits[j])
        }
        res.push(row >= 0 ? 1:0)
    }
    return res
}


/**
 * @param w weights to adjust
 * @param t real results
 */
function adjustWeightsEpoch(w: number[],t: number[]) {
    t.forEach((ti,i) => {
        adjustWeightsLine(w,ti,i)
    })
}

function trainNode(logFunc: (arr: number[]) => number, paramCount:number) {
    let t = getResultsReal(logFunc,paramCount)
    let w = Array(paramCount+1).fill(0)
    let wold = [...w]
    let epochs:number = 0;
    while (!w.every((val,i) =>{return val ===wold[i] }) && epochs < 10000){
        epochs++;
        wold = [...w]
        console.log(w);
        adjustWeightsEpoch(w,t)
    }

    const found = getAllResultsWeighed(w);
    console.log(`expected result`,t)
    console.log(`Artificial Intelligence result: `,getAllResultsWeighed(w))
    console.log('found weights: ',w)
    console.log(`in ${epochs} epochs`)
    console.log(`THE RESULT IS: ${found.every((val,i) => {return val === t[i]})?'':'NOT'} CORRECT`)
}
trainNode(a,2)
trainNode(b,3)
trainNode(c,4)
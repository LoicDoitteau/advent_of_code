const { count } = require("console");

fs = require("fs");
fs.readFile("./2020/day_14/input.txt", 'utf8', (err, input) => {

    const instructions = input.split("\r\n");
    const maskRegex = /mask = (?<mask>(?:0|1|X){36})/;
    const valueRegex = /mem\[(?<address>\d+)\] = (?<value>\d+)/;
    let currentMask = [];
    const memory = {}

    const applyMask = (mask, value) => {
        let valueBin = value.toString(2).padStart(36, '0').split('');
        for (const bit of mask) {
            valueBin[bit.index] = bit.value;
        }

        let newValue = 0n;
        for (let i = 0n; i < valueBin.length; i++) {
            newValue += BigInt(valueBin[i]) * (2n ** (35n - i));
        }
        return newValue;
    }

    for (const instruction of instructions) {
        if (maskRegex.test(instruction)) {
            currentMask = maskRegex.exec(instruction)
                .groups
                .mask
                .split('')
                .reduce((acc, value, index) => {
                    if (value != 'X')
                        acc.push({ value, index });
                    return acc;
                }, []);
        } else {
            const { address, value } = valueRegex.exec(instruction).groups;
            memory[address] = applyMask(currentMask, BigInt(value));
        }
    }

    const response = Object.keys(memory).reduce((acc, address) => acc + memory[address], 0n);
    console.log(response);
});

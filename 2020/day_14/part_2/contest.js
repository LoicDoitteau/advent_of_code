const { count } = require("console");

fs = require("fs");
fs.readFile("./2020/day_14/input.txt", 'utf8', (err, input) => {

    const instructions = input.split("\r\n");
    const maskRegex = /mask = (?<mask>(?:0|1|X){36})/;
    const valueRegex = /mem\[(?<address>\d+)\] = (?<value>\d+)/;
    let currentMask = [];
    const memory = {}

    const applyMask = (mask, value) => {
        let valueBin = value.toString(2).padStart(36, '0');
        const values = [];

        const rec = (i, cur) => {
            if (i == mask.length) {
                let newValue = 0n;
                for (let j = 0n; j < cur.length; j++) {
                    newValue += BigInt(cur[j]) * (2n ** (35n - j));
                }
                values.push(newValue);
                return;
            }
            const char = mask[i];
            if (char == 'X') {
                rec(i + 1, cur + '0');
                rec(i + 1, cur + '1');
            } else if (char == '1') {
                rec(i + 1, cur + char);
            } else {
                rec(i + 1, cur + valueBin[i])
            }
        }

        rec(0, '');

        return values;
    }

    for (const instruction of instructions) {
        if (maskRegex.test(instruction)) {
            currentMask = maskRegex.exec(instruction).groups.mask;
        } else {
            const { address, value } = valueRegex.exec(instruction).groups;
            applyMask(currentMask, BigInt(address)).forEach(newAddress => memory[newAddress] = BigInt(value));
        }
    }

    const response = Object.keys(memory).reduce((acc, address) => acc + memory[address], 0n);
    console.log(response);
});

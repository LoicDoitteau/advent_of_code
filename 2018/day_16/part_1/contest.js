fs = require("fs");

fs.readFile("./2018/day_16/part_1/input.txt", 'utf8', (err, input) => {
    var p = /Before: \[(\d+), (\d+), (\d+), (\d+)\]\r\n(\d+) (\d+) (\d+) (\d+)\r\nAfter:  \[(\d+), (\d+), (\d+), (\d+)\]/gm;
    var r = 0;
    var m;
    var register;
    var instructions = {
        addr : (input1, input2, output) => register[output] = register[input1] + register[input2],
        addi : (input1, input2, output) => register[output] = register[input1] + input2,
        mulr : (input1, input2, output) => register[output] = register[input1] * register[input2],
        muli : (input1, input2, output) => register[output] = register[input1] * input2,
        banr : (input1, input2, output) => register[output] = register[input1] & register[input2],
        bani : (input1, input2, output) => register[output] = register[input1] & input2,
        borr : (input1, input2, output) => register[output] = register[input1] | register[input2],
        bori : (input1, input2, output) => register[output] = register[input1] | input2,
        setr : (input1, input2, output) => register[output] = register[input1],
        seti : (input1, input2, output) => register[output] = input1,
        gtir : (input1, input2, output) => register[output] = input1 > register[input2] ? 1 : 0,
        gtri : (input1, input2, output) => register[output] = register[input1] > input2 ? 1 : 0,
        gtrr : (input1, input2, output) => register[output] = register[input1] > register[input2] ? 1 : 0,
        eqtir : (input1, input2, output) => register[output] = input1 == register[input2] ? 1 : 0,
        eqtri : (input1, input2, output) => register[output] = register[input1] == input2 ? 1 : 0,
        eqtrr : (input1, input2, output) => register[output] = register[input1] == register[input2] ? 1 : 0,
    }
    while((m = p.exec(input)) != null) {
        var [, rb1, rb2, rb3, rb4, opcode, input1, input2, output, ra1, ra2, ra3, ra4] = m.map(Number);
        var registerBefore = [rb1, rb2, rb3, rb4];
        var registerAfter = [ra1, ra2, ra3, ra4];
        if(Object.keys(instructions).filter(instr => {
            register = registerBefore.slice();
            instructions[instr](input1, input2, output);
            return register.every((v, i) => v == registerAfter[i]);
        }).length >= 3) r++;
    }
    console.log(r);
});
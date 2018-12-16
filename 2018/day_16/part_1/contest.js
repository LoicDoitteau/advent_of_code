fs = require("fs");

fs.readFile("./2018/day_16/part_1/input.txt", 'utf8', (err, input) => {
    var p = /Before: \[(\d+), (\d+), (\d+), (\d+)\]\r\n(\d+) (\d+) (\d+) (\d+)\r\nAfter:  \[(\d+), (\d+), (\d+), (\d+)\]/gm;
    var r = 0;
    var m;
    var register;
    var instructions = {
        addr : (opcode, input1, input2, output) => register[output] = register[input1] + register[input2],
        addi : (opcode, input1, input2, output) => register[output] = register[input1] + input2,
        mulr : (opcode, input1, input2, output) => register[output] = register[input1] * register[input2],
        muli : (opcode, input1, input2, output) => register[output] = register[input1] * input2,
        banr : (opcode, input1, input2, output) => register[output] = register[input1] & register[input2],
        bani : (opcode, input1, input2, output) => register[output] = register[input1] & input2,
        borr : (opcode, input1, input2, output) => register[output] = register[input1] | register[input2],
        bori : (opcode, input1, input2, output) => register[output] = register[input1] | input2,
        setr : (opcode, input1, input2, output) => register[output] = register[input1],
        seti : (opcode, input1, input2, output) => register[output] = input1,
        gtir : (opcode, input1, input2, output) => register[output] = input1 > register[input2] ? 1 : 0,
        gtri : (opcode, input1, input2, output) => register[output] = register[input1] > input2 ? 1 : 0,
        gtrr : (opcode, input1, input2, output) => register[output] = register[input1] > register[input2] ? 1 : 0,
        eqtir : (opcode, input1, input2, output) => register[output] = input1 == register[input2] ? 1 : 0,
        eqtri : (opcode, input1, input2, output) => register[output] = register[input1] == input2 ? 1 : 0,
        eqtrr : (opcode, input1, input2, output) => register[output] = register[input1] == register[input2] ? 1 : 0,
    }
    while((m = p.exec(input)) != null) {
        var [, rb1, rb2, rb3, rb4, opcode, input1, input2, output, ra1, ra2, ra3, ra4] = m.map(Number);
        var registerBefore = [rb1, rb2, rb3, rb4];
        var registerAfter = [ra1, ra2, ra3, ra4];
        if(Object.keys(instructions).filter(instr => {
            register = registerBefore.slice();;
            instructions[instr](opcode, input1, input2, output);
            return register.every((v, i) => v == registerAfter[i]);
        }).length >= 3) r++;
    }
    console.log(r);
});
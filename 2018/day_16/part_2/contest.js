fs = require("fs");

fs.readFile("./2018/day_16/part_2/input.txt", 'utf8', (err, input) => {
    var p = /Before: \[(\d+), (\d+), (\d+), (\d+)\]\r\n(\d+) (\d+) (\d+) (\d+)\r\nAfter:  \[(\d+), (\d+), (\d+), (\d+)\]/gm;
    var m;
    var register;
    var assumptions = {};
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
        var assumption = [];
        Object.keys(instructions).forEach(instr => {
            register = registerBefore.slice();
            instructions[instr](input1, input2, output);
            if(register.every((v, i) => v == registerAfter[i])) assumption.push(instr);
        });
        if(assumptions[opcode] == undefined) assumptions[opcode] = assumption;
        else assumptions[opcode] = assumptions[opcode].filter(instr => assumption.indexOf(instr) != -1);
    }
    while(Object.keys(assumptions).some(opcode => assumptions[opcode].length > 1)) {
        var done = Object.keys(assumptions).reduce((acc, opcode) => {
            if(assumptions[opcode].length == 1) acc.push(assumptions[opcode][0]);
            return acc;
        }, []);
        Object.keys(assumptions).forEach(opcode => {
            if(assumptions[opcode].length > 1) assumptions[opcode] = assumptions[opcode].filter(instr => done.indexOf(instr) == -1);
        });
    }
    fs.readFile("./2018/day_16/part_2/input2.txt", 'utf8', (err2, prog) => {
        p = /(\d+) (\d+) (\d+) (\d+)/g;
        register = [0, 0, 0, 0];
        while((m = p.exec(prog)) != null) {
            var [, opcode, input1, input2, output] = m.map(Number);
            var instr = assumptions[opcode][0];
            instructions[instr](input1, input2, output);
        }
        console.log(register);
    });
});
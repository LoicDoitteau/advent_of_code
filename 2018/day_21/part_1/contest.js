fs = require("fs");

fs.readFile("./2018/day_21/part_1/input.txt", 'utf8', (err, input) => {
    var arr = input.split('\r\n');
    var register = [0, 0, 0, 0, 0, 0];
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
        eqir : (input1, input2, output) => register[output] = input1 == register[input2] ? 1 : 0,
        eqri : (input1, input2, output) => register[output] = register[input1] == input2 ? 1 : 0,
        eqrr : (input1, input2, output) => register[output] = register[input1] == register[input2] ? 1 : 0,
    };
    var ipr = Number(arr[0].match(/#ip (\d+)/)[1]);
    var ipv = 0;
    var program = arr.slice(1).map(s => {
        var [, instr, input1, input2, output] = s.match(/(\w+) (\d+) (\d+) (\d+)/);
        return {instr, p1 : Number(input1), p2 : Number(input2), p3 : Number(output)};
    });
    var i = 0;
    while(true) {
        if(ipv >= program.length) break;
        register[ipr] = ipv;
        if(program[ipv].instr == "eqrr") {
            console.log(register[4]);
            break;
        }
        instructions[program[ipv].instr](program[ipv].p1, program[ipv].p2, program[ipv].p3);
        ipv = register[ipr] + 1;
        i++;
    }
});
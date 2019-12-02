fs = require("fs");
fs.readFile("./2019/day_2/input.txt", 'utf8', (err, input) => {
    var intcode = input.split(',').map(Number);
    intcode[1] = 12;
    intcode[2] = 2;
    for(let i = 0; i < intcode.length; i += 4) {
        const opcode = intcode[i];
        if(opcode == 99) break;
        const k1 = intcode[i+1];
        const k2 = intcode[i+2];
        const k3 = intcode[i+3];
        if(opcode == 1) intcode[k3] = intcode[k1] + intcode[k2];
        else if(opcode == 2) intcode[k3] = intcode[k1] * intcode[k2];
    }
    console.log(intcode[0]);
});

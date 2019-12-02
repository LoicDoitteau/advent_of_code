fs = require("fs");
fs.readFile("./2019/day_2/input.txt", 'utf8', (err, input) => {
    const output = 19690720;
    let intcode = input.split(',').map(Number);
    for(let noun = 0; noun < 100; noun++){
        for(let verb = 0; verb < 100; verb++){
            intcodeCopy = intcode.slice();
            intcodeCopy[1] = noun;
            intcodeCopy[2] = verb;
            for(let i = 0; i < intcodeCopy.length; i += 4) {
                const opcode = intcodeCopy[i];
                if(opcode == 99) break;
                const k1 = intcodeCopy[i+1];
                const k2 = intcodeCopy[i+2];
                const k3 = intcodeCopy[i+3];
                if(opcode == 1) intcodeCopy[k3] = intcodeCopy[k1] + intcodeCopy[k2];
                else if(opcode == 2) intcodeCopy[k3] = intcodeCopy[k1] * intcodeCopy[k2];
            }
            if(intcodeCopy[0] == output){
                console.log(100 * noun + verb);
                return;
            }
        }
    }
});

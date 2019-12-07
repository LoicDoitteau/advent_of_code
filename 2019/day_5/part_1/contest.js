fs = require("fs");
fs.readFile("./2019/day_5/input.txt", 'utf8', (err, data) => {
    let intcode = data.split(',').map(Number);
    let pointer = 0;
    let input = 1;
    let output = 0;

    const modes = {
        "0" : value => intcode[value],
        "1" : value => value
    };

    const instructions = {
        "01" : parametersMode => {
            const value1 = modes[parametersMode[1]](intcode[pointer + 1]);
            const value2 = modes[parametersMode[0]](intcode[pointer + 2]);
            const value3 = intcode[pointer + 3];
            intcode[value3] = value1 + value2;
            pointer += 4;
        },
        "02" : parametersMode => {
            const value1 = modes[parametersMode[1]](intcode[pointer + 1]);
            const value2 = modes[parametersMode[0]](intcode[pointer + 2]);
            const value3 = intcode[pointer + 3];
            intcode[value3] = value1 * value2;
            pointer += 4;
        },
        "03" : () => {
            const value1 = intcode[pointer + 1];
            intcode[value1] = input;
            pointer += 2;
        },
        "04" : () => {
            const value1 = intcode[pointer + 1];
            output = intcode[value1];
            pointer += 2;
        }
    };


    while(true) {
        const program = intcode[pointer].toString().padStart(4, '0');
        let parameters = program.slice(0, program.length - 2);
        let opcode = program.slice(program.length - 2);

        if(opcode == "99") break;
        instructions[opcode](parameters);
    }

    console.log(output);
});

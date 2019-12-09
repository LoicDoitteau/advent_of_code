fs = require("fs");
fs.readFile("./2019/day_9/input.txt", 'utf8', (err, data) => {
    const startTime = new Date().getTime();
    let intcode = data.split(',').map(Number);
    let pointer = 0;
    let relativeBase = 0;
    let input = 1;
    let output = 0;

    const modes = {
        input : {
            "0" : value => intcode[value] || 0,
            "1" : value => value,
            "2" : (value, offset) => intcode[value + offset] || 0
        },
        
        output : {
            "0" : value => value,
            "2" : (value, offset) => value + offset
        }
    };

    const instructions = {
        "01" : parametersMode => {
            const value1 = modes.input[parametersMode[2]](intcode[pointer + 1] || 0, relativeBase);
            const value2 = modes.input[parametersMode[1]](intcode[pointer + 2] || 0, relativeBase);
            const value3 = modes.output[parametersMode[0]](intcode[pointer + 3] || 0, relativeBase);
            intcode[value3] = value1 + value2;
            pointer += 4;
        },
        "02" : parametersMode => {
            const value1 = modes.input[parametersMode[2]](intcode[pointer + 1] || 0, relativeBase);
            const value2 = modes.input[parametersMode[1]](intcode[pointer + 2] || 0, relativeBase);
            const value3 = modes.output[parametersMode[0]](intcode[pointer + 3] || 0, relativeBase);
            intcode[value3] = value1 * value2;
            pointer += 4;
        },
        "03" : parametersMode => {
            const value1 = modes.output[parametersMode[2]](intcode[pointer + 1] || 0, relativeBase);
            intcode[value1] = input;
            pointer += 2;
        },
        "04" : parametersMode => {
            const value1 = modes.input[parametersMode[2]](intcode[pointer + 1] || 0, relativeBase);
            output = value1;
            pointer += 2;
        },
        "05" : parametersMode => {
            const value1 = modes.input[parametersMode[2]](intcode[pointer + 1] || 0, relativeBase);
            const value2 = modes.input[parametersMode[1]](intcode[pointer + 2] || 0, relativeBase);
            if(value1 != 0) pointer = value2;
            else pointer += 3;
        },
        "06" : parametersMode => {
            const value1 = modes.input[parametersMode[2]](intcode[pointer + 1] || 0, relativeBase);
            const value2 = modes.input[parametersMode[1]](intcode[pointer + 2] || 0, relativeBase);
            if(value1 == 0) pointer = value2;
            else pointer += 3;
        },
        "07" : parametersMode => {
            const value1 = modes.input[parametersMode[2]](intcode[pointer + 1] || 0, relativeBase);
            const value2 = modes.input[parametersMode[1]](intcode[pointer + 2] || 0, relativeBase);
            const value3 = modes.output[parametersMode[0]](intcode[pointer + 3] || 0, relativeBase);
            intcode[value3] = value1 < value2 ? 1 : 0;
            pointer += 4;
        },
        "08" : parametersMode => {
            const value1 = modes.input[parametersMode[2]](intcode[pointer + 1] || 0, relativeBase);
            const value2 = modes.input[parametersMode[1]](intcode[pointer + 2] || 0, relativeBase);
            const value3 = modes.output[parametersMode[0]](intcode[pointer + 3] || 0, relativeBase);
            intcode[value3] = value1 == value2 ? 1 : 0;
            pointer += 4;
        },
        "09" : parametersMode => {
            const value1 = modes.input[parametersMode[2]](intcode[pointer + 1] || 0, relativeBase);
            relativeBase += value1;
            pointer += 2;
        }
    };


    while(true) {
        const program = intcode[pointer].toString().padStart(5, '0');
        let parameters = program.slice(0, program.length - 2);
        let opcode = program.slice(program.length - 2);

        if(opcode == "99") break;
        instructions[opcode](parameters);
    }

    console.log(output);
    const elapsedTime = new Date().getTime() - startTime;
    console.log(`Elapsed : ${elapsedTime} ms`);
});

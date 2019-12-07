fs = require("fs");
fs.readFile("./2019/day_7/input.txt", 'utf8', (err, data) => {
    const startTime = new Date().getTime();
    const intProgram = (...inputs) => { 
        let intcode = data.split(',').map(Number);
        let pointer = 0;
        let inputIndex = 0;
        let output = null;

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
                intcode[value1] = inputs[inputIndex];
                inputIndex = (inputIndex + 1) % inputs.length;
                pointer += 2;
            },
            "04" : () => {
                const value1 = intcode[pointer + 1];
                output = intcode[value1];
                pointer += 2;
            },
            "05" : parametersMode => {
                const value1 = modes[parametersMode[1]](intcode[pointer + 1]);
                const value2 = modes[parametersMode[0]](intcode[pointer + 2]);
                if(value1 != 0) pointer = value2;
                else pointer += 3;
            },
            "06" : parametersMode => {
                const value1 = modes[parametersMode[1]](intcode[pointer + 1]);
                const value2 = modes[parametersMode[0]](intcode[pointer + 2]);
                if(value1 == 0) pointer = value2;
                else pointer += 3;
            },
            "07" : parametersMode => {
                const value1 = modes[parametersMode[1]](intcode[pointer + 1]);
                const value2 = modes[parametersMode[0]](intcode[pointer + 2]);
                const value3 = intcode[pointer + 3];
                intcode[value3] = value1 < value2 ? 1 : 0;
                pointer += 4;
            },
            "08" : parametersMode => {
                const value1 = modes[parametersMode[1]](intcode[pointer + 1]);
                const value2 = modes[parametersMode[0]](intcode[pointer + 2]);
                const value3 = intcode[pointer + 3];
                intcode[value3] = value1 == value2 ? 1 : 0;
                pointer += 4;
            }
        };


        while(true) {
            const program = intcode[pointer].toString().padStart(4, '0');
            let parameters = program.slice(0, program.length - 2);
            let opcode = program.slice(program.length - 2);

            if(opcode == "99") return output;
            instructions[opcode](parameters);
        }
    };

    let rec = (input, phases) => {
        if(phases.length == 1) return intProgram(phases[0], input);
        
        return Math.max(...phases.map((phase, i) => {
            let newPhases = phases.slice();
            newPhases.splice(i, 1);
            return rec(intProgram(phase, input), newPhases);
        }));
    };

    const res = rec(0, [...Array(5).keys()]);
    console.log(res);
    const elapsedTime = new Date().getTime() - startTime;
    console.log(`Elapsed : ${elapsedTime} ms`);
});
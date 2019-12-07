fs = require("fs");
fs.readFile("./2019/day_7/input.txt", 'utf8', (err, data) => {
    const startTime = new Date().getTime();
    const states = {RUNNING : 0, HALTED : 1, STOPPED : 2};
    const intcode = data.split(',').map(Number);
    const intProgram = (pointer, intcode, ...inputs) => {
        let inputIndex = 0;
        let output = null;
        let state = states.RUNNING;

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
                inputIndex++;
                pointer += 2;
            },
            "04" : () => {
                const value1 = intcode[pointer + 1];
                output = intcode[value1];
                pointer += 2;
                state = states.HALTED;
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
            },
            "99" : () => {
                state = states.STOPPED;
            }
        };

        while(true) {
            const program = intcode[pointer].toString().padStart(4, '0');
            let parameters = program.slice(0, program.length - 2);
            let opcode = program.slice(program.length - 2);

            if(state != states.RUNNING)
            return {state, output, intcode, pointer};
            instructions[opcode](parameters);
        }
    };

    const getAllPhases = phases => {
        const rec = (sub, all, cur) => {
            if(sub.length == 0) all.push(cur);
            for (let i = 0; i < sub.length; i++) {
                const phase = sub[i];
                let newPhases = sub.slice();
                newPhases.splice(i, 1);
                let newCur = cur.slice();
                newCur.push(phase);
                rec(newPhases, all, newCur);
            }
            return all;
        };

        return rec(phases, [], []);
    };

    const getFeedback = (input, phases) => {
        let i = 0, j = 0;
        let signal = null;
        let statuses = {};
        while(true) {
            let pointer = statuses[i] ? statuses[i].pointer : 0;
            let code = statuses[i] ? statuses[i].intcode : intcode.slice();
            const status = signal != null? intProgram(pointer, code, input) : intProgram(pointer, code, phases[i], input);
            if(status.state == states.STOPPED) return signal;
            if(i == phases.length - 1) signal = status.output;
            statuses[i] = status;
            input = status.output;
            i = (i + 1) % phases.length;
        }
    }

    const res = Math.max(...getAllPhases([...Array(5).keys()].map(i => i + 5)).map(phases => getFeedback(0, phases)));

    console.log(res);
    const elapsedTime = new Date().getTime() - startTime;
    console.log(`Elapsed : ${elapsedTime} ms`);
});
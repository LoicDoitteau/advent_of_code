const fs = require("fs");
const rl = require('readline').createInterface({input: process.stdin, output: process.stdout});

(async () => {
    let data = fs.readFileSync("./2019/day_25/input.txt", 'utf8');   
    const startTime = new Date().getTime();
    const states = {RUNNING : 0, INPUT : 1, OUTPUT : 2, STOPPED : 3};
    const instructions = {
        NORTH : () => "north\n",
        SOUTH : () => "south\n",
        EAST : () => "east\n",
        WEST : () => "west\n",
        TAKE : item => `take ${item}\n`,
        DROP : item => `drop ${item}\n`,
        INVENTORY : () => "inv\n"
    };
    const NEW_LINE = 10;
    const INPUT_COMMAND = "Command?";
    const DEBUG = true;
    let res = null;

    function IntProgram() {
        this.pointer = 0;
        this.relativeBase = 0;
        this.intcode = data.split(',').map(Number);
        this.input = [];
        this.output = null;
        this.state = states.RUNNING;

        this.modes = {
            read : {
                "0" : value => this.intcode[value] || 0,
                "1" : value => value,
                "2" : (value, offset) => this.intcode[value + offset] || 0
            },
            
            write : {
                "0" : value => value,
                "2" : (value, offset) => value + offset
            }
        };

        this.instructions = {
            "01" : parametersMode => {
                const value1 = this.modes.read[parametersMode[2]](this.intcode[this.pointer + 1] || 0, this.relativeBase);
                const value2 = this.modes.read[parametersMode[1]](this.intcode[this.pointer + 2] || 0, this.relativeBase);
                const value3 = this.modes.write[parametersMode[0]](this.intcode[this.pointer + 3] || 0, this.relativeBase);
                this.intcode[value3] = value1 + value2;
                this.pointer += 4;
            },
            "02" : parametersMode => {
                const value1 = this.modes.read[parametersMode[2]](this.intcode[this.pointer + 1] || 0, this.relativeBase);
                const value2 = this.modes.read[parametersMode[1]](this.intcode[this.pointer + 2] || 0, this.relativeBase);
                const value3 = this.modes.write[parametersMode[0]](this.intcode[this.pointer + 3] || 0, this.relativeBase);
                this.intcode[value3] = value1 * value2;
                this.pointer += 4;
            },
            "03" : parametersMode => {
                const value1 = this.modes.write[parametersMode[2]](this.intcode[this.pointer + 1] || 0, this.relativeBase);
                this.intcode[value1] = this.input.shift();
                this.pointer += 2;
                this.state = states.INPUT;
            },
            "04" : parametersMode => {
                const value1 = this.modes.read[parametersMode[2]](this.intcode[this.pointer + 1] || 0, this.relativeBase);
                this.output = value1;
                this.pointer += 2;
                this.state = states.OUTPUT;
            },
            "05" : parametersMode => {
                const value1 = this.modes.read[parametersMode[2]](this.intcode[this.pointer + 1] || 0, this.relativeBase);
                const value2 = this.modes.read[parametersMode[1]](this.intcode[this.pointer + 2] || 0, this.relativeBase);
                if(value1 != 0) this.pointer = value2;
                else this.pointer += 3;
            },
            "06" : parametersMode => {
                const value1 = this.modes.read[parametersMode[2]](this.intcode[this.pointer + 1] || 0, this.relativeBase);
                const value2 = this.modes.read[parametersMode[1]](this.intcode[this.pointer + 2] || 0, this.relativeBase);
                if(value1 == 0) this.pointer = value2;
                else this.pointer += 3;
            },
            "07" : parametersMode => {
                const value1 = this.modes.read[parametersMode[2]](this.intcode[this.pointer + 1] || 0, this.relativeBase);
                const value2 = this.modes.read[parametersMode[1]](this.intcode[this.pointer + 2] || 0, this.relativeBase);
                const value3 = this.modes.write[parametersMode[0]](this.intcode[this.pointer + 3] || 0, this.relativeBase);
                this.intcode[value3] = value1 < value2 ? 1 : 0;
                this.pointer += 4;
            },
            "08" : parametersMode => {
                const value1 = this.modes.read[parametersMode[2]](this.intcode[this.pointer + 1] || 0, this.relativeBase);
                const value2 = this.modes.read[parametersMode[1]](this.intcode[this.pointer + 2] || 0, this.relativeBase);
                const value3 = this.modes.write[parametersMode[0]](this.intcode[this.pointer + 3] || 0, this.relativeBase);
                this.intcode[value3] = value1 == value2 ? 1 : 0;
                this.pointer += 4;
            },
            "09" : parametersMode => {
                const value1 = this.modes.read[parametersMode[2]](this.intcode[this.pointer + 1] || 0, this.relativeBase);
                this.relativeBase += value1;
                this.pointer += 2;
            },
            "99" : () => {
                this.state = states.STOPPED;
            }
        };

        return {
            memory : this.intcode,
            getInputLength : () => this.input.length,
            addInput : input => this.input.push(...input),
            process : (function* (self) {
                while(self.state != states.STOPPED) {
                    const program = self.intcode[self.pointer].toString().padStart(5, '0');
                    const parameters = program.slice(0, program.length - 2);
                    const opcode = program.slice(program.length - 2);
                    const instruction = self.instructions[opcode];

                    self.state = states.RUNNING;
                    instruction(parameters);
                    yield {state : self.state, output : self.output};
                }
            })(this)
        }
    }

    const encode = s => Array.prototype.map.call(s, c => c.charCodeAt(0));
    const decode = c => String.fromCharCode(...c);

    const askInput = query => {
        return new Promise(resolve => rl.question(query, answer => {
            resolve(answer);
        }));
    }

    const getCombinations = arr => {
        var comb = [];

        const rec = (arr, cur) => {
            if(arr.length == 0) {
                comb.push(cur);
                return;
            }

            const newArr = arr.slice();
            const current = newArr.shift();
            rec(newArr, cur);
            rec(newArr, [...cur, current]);
        }
        
        rec(arr, []);

        return comb;
    }

    const getPreInstructions = () => "east\ntake antenna\nnorth\nnorth\ntake asterisk\nsouth\nwest\nwest\ntake astronaut ice cream\neast\nsouth\ntake hologram\nnorth\neast\nsouth\neast\ntake ornament\nnorth\nwest\ntake fixed point\neast\nsouth\nwest\nwest\nsouth\nsouth\nsouth\ntake dark matter\nnorth\nwest\nnorth\ntake monolith\nnorth\nnorth\ninv\n";
    
    const getItems = () => ["antenna", "asterisk", "astronaut ice cream", "hologram", "ornament", "fixed point", "dark matter", "monolith"];
    
    const getResponse = async () => {
        let response = null;
        const items = getItems();
        const preInstructions = encode(getPreInstructions());
        const dropInstructions = encode(items.map(item => instructions.DROP(item)).join(''));
        // const combinations = getCombinations(items);
        const combinations = [getCombinations(items)[108]];

        const inputs = Object.keys(instructions).reduce((acc, key, i) => {
            acc[i] = key;
            return acc;
        }, {});

        let i = 0;
        for (const combo of combinations) {
            i++;
            const prog = new IntProgram();
            let codes = [];
            const takeInstructions = encode(combo.map(item => instructions.TAKE(item)).join(''));
            const allInstructions = [...preInstructions,  ...dropInstructions, ...takeInstructions, ...encode(instructions.EAST())];
            prog.addInput(allInstructions);

            for (const state of prog.process) {
                if(state.state == states.OUTPUT) {
                    if(state.output == NEW_LINE) {
                        const response = decode(codes);
                        // if(prog.getInputLength() == 0 && response.toLowerCase().includes("loud")) console.log(`${i}) ${response}`);
                        console.log(response);
                        if(response == INPUT_COMMAND && prog.getInputLength() == 0) {
                            const input = await askInput(Object.keys(inputs).reduce((acc, key) => acc + `${key} : ${inputs[key]}\n`, ""));
                            let parameter = null;
                            const instruction = instructions[inputs[input]];
                            if(instruction == instructions.TAKE || instruction == instructions.DROP) {
                                parameter = await askInput("Which item ? ");
                            }
                            prog.addInput(encode(instruction(parameter)));
                        }
                        codes = [];
                    }
                    else codes.push(state.output);
                }
                if(state.state == states.STOPPED) {
                    response = state.output;
                    break;
                }
            }
        }
        
        return response;
    }

    res = await getResponse();
    console.log(res);
    rl.close();
    const elapsedTime = new Date().getTime() - startTime;
    console.log(`Elapsed : ${elapsedTime} ms`);
})();
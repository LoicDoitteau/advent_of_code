fs = require("fs");
fs.readFile("./2019/day_17/input.txt", 'utf8', (err, data) => {
    const startTime = new Date().getTime();
    const states = {RUNNING : 0, HALTED : 1, STOPPED : 2};
    const dir = {
        94 : {
            MOVE : {dx : 0, dy : -1},
            LEFT : 60,
            RIGHT : 62
        },
        62 : {
            MOVE : {dx : 1, dy : 0},
            LEFT : 94,
            RIGHT : 118
        },
        118 : {
            MOVE : {dx : 0, dy : 1},
            LEFT : 62,
            RIGHT : 60
        },
        60 : {
            MOVE : {dx : -1, dy : 0},
            LEFT : 118,
            RIGHT : 94
        }
    }
    const ascii = {SCAFFOLD : 35, EMPTY : 46, NEW_LINE : 10, UP : 94, RIGHT : 62, DOWN : 118, LEFT : 60};
    const DEBUG = true;
    let res = null;

    function IntProgram() {
        this.pointer = 0;
        this.relativeBase = 0;
        this.intcode = data.split(',').map(Number);
        this.input = null;
        this.output = null;
        this.state = states.RUNNING;
        this.inputIndex = 0;

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
                this.intcode[value1] = this.input[this.inputIndex % this.input.length];
                this.inputIndex++;
                this.pointer += 2;
            },
            "04" : parametersMode => {
                const value1 = this.modes.read[parametersMode[2]](this.intcode[this.pointer + 1] || 0, this.relativeBase);
                this.output = value1;
                this.pointer += 2;
                this.state = states.HALTED;
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
            process : (value) => {
                this.input = value;
                this.state = states.RUNNING;
                while(true) {
                    const program = this.intcode[this.pointer].toString().padStart(5, '0');
                    let parameters = program.slice(0, program.length - 2);
                    let opcode = program.slice(program.length - 2);

                    if(this.state != states.RUNNING) return {state : this.state, output : this.output, index : this.inputIndex};
                    this.instructions[opcode](parameters);
                }
            }
        }
    }

    const getMap = () => {
        const grid = {};
        const bot = {};
        let x = 0, y = 0;
        const prog = new IntProgram();
        let string = "";

        while(true) {
            const state = prog.process();
            if(state.state == states.STOPPED) {
                if(DEBUG) console.log(string);
                return {grid, bot};
            }
            string += String.fromCharCode(state.output);
            if(state.output == ascii.NEW_LINE) {
                y++;
                x = 0;
            }
            else {
                if(!grid[y]) grid[y] = {};
                if(state.output == ascii.UP || state.output == ascii.RIGHT || state.output == ascii.DOWN || state.output == ascii.LEFT) {
                    grid[y][x] = ascii.SCAFFOLD;
                    bot.x = x;
                    bot.y = y;
                    bot.dir = dir[state.output]; 
                }
                else grid[y][x] = state.output;
                x++;
            }
        }
    }

    const getIntersections = map => {
        const intersections = [];
        const grid = map.grid;
        
        for (const y in grid) {
            const col = grid[y];
            for (const x in col) {
                const pos = {x : Number(x), y : Number(y)};
                const cell = col[x];
                if(grid[pos.y-1] && grid[pos.y+1] && cell == ascii.SCAFFOLD && grid[pos.y-1][pos.x] == ascii.SCAFFOLD && grid[pos.y+1][pos.x] == ascii.SCAFFOLD && grid[pos.y][pos.x-1] == ascii.SCAFFOLD && grid[pos.y][pos.x+1] == ascii.SCAFFOLD) {
                    intersections.push(pos);
                }
            }
        }
        return intersections;
    }

    const getAlignmentParameter = pos => Math.abs(pos.x) * Math.abs(pos.y);

    // L10 L10 R6 L10 L10 R6 R12 L12 L12 R12 L12 L12 L6 L10 R12 R12 R12 L12 L12 L6 L10 R12 R12 R12 L12 L12 L6 L10 R12 R12 L10 L10 R6
    // A : L10 L10 R6
    // B : R12 L12 L12
    // C : L6 L10 R12 R12
    // A A B B C B C B C A

    // TODO : Generic
    const getRoutine = () => "A,A,B,B,C,B,C,B,C,A\n";
    const getFunctionA = () => "L,10,L,10,R,6\n";
    const getFunctionB = () => "R,12,L,12,L,12\n"
    const getFunctionC = () => "L,6,L,10,R,12,R,12\n"
    const getWholeString = () => `${getRoutine()}${getFunctionA()}${getFunctionB()}${getFunctionC()}n\n`
    const encode = s => Array.prototype.map.call(s, c => c.charCodeAt(0));

    const collect = () => {
        const prog = new IntProgram();
        prog.memory[0] = 2;
        let state = null;

        const input = encode(getWholeString());
        while(true){
            state = prog.process(input);
            if(state.state == states.STOPPED) return state.output;
        }
    }

    res = collect();
    console.log(res);
    const elapsedTime = new Date().getTime() - startTime;
    console.log(`Elapsed : ${elapsedTime} ms`);
});

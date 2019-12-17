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
    const outputs = {SCAFFOLD : 35, EMPTY : 46, NEW_LINE : 10, UP : 94, RIGHT : 62, DOWN : 118, LEFT : 60};
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
            if(state.output == outputs.NEW_LINE) {
                y++;
                x = 0;
            }
            else {
                if(!grid[y]) grid[y] = {};
                if(state.output == outputs.UP || state.output == outputs.RIGHT || state.output == outputs.DOWN || state.output == outputs.LEFT) {
                    grid[y][x] = outputs.SCAFFOLD;
                    bot.x = x;
                    bot.y = y;
                    bot.dir = dir[state.output]; 
                }
                else grid[y][x] = state.output;
                x++;
            }
        }
    }

    const getPath = map => {
        path = "";
        const bot = {...map.bot};
        const grid = map.grid;
        let steps = 0;

        while(true) {
            if(!grid[bot.y + bot.dir.MOVE.dy] || grid[bot.y + bot.dir.MOVE.dy][bot.x + bot.dir.MOVE.dx] != outputs.SCAFFOLD) {
                const leftDir = dir[bot.dir.LEFT];
                const rightDir = dir[bot.dir.RIGHT];
                if(steps > 0) {
                    path += `${steps},`;
                    steps = 0;
                }
                if(grid[bot.y + leftDir.MOVE.dy] && grid[bot.y + leftDir.MOVE.dy][bot.x + leftDir.MOVE.dx] == outputs.SCAFFOLD) {
                    bot.dir = leftDir;
                    path += "L,";
                }
                else if(grid[bot.y + rightDir.MOVE.dy] && grid[bot.y + rightDir.MOVE.dy][bot.x + rightDir.MOVE.dx] == outputs.SCAFFOLD) {
                    bot.dir = rightDir;
                    path += "R,";
                }
                else break;
            }
            else {
                bot.x += bot.dir.MOVE.dx;
                bot.y += bot.dir.MOVE.dy;
                steps++;
            }
        }

        return path.substring(0, path.length - 1);
    }

    const splitPath = path => {
        for(let a = 1; a <= 20; a++) {
            for(let b = 1; b <= 20; b++) {
                for(let c = 1; c <= 20; c++) {
                    const functions = {};
                    let subPath = path;
                    functions.A = subPath.slice(0, a);
                    subPath = subPath.replace(new RegExp(`${functions.A},?`, "g"), "");
                    functions.B = subPath.slice(0, b);
                    subPath = subPath.replace(new RegExp(`${functions.B},?`, "g"), "");
                    functions.C = subPath.slice(0, c);
                    subPath = subPath.replace(new RegExp(`${functions.C},?`, "g"), "");
                    if(subPath.length == 0) {
                        let routine = path;
                        for (const key in functions) {
                            const func = functions[key];
                            routine = routine.replace(new RegExp(func, "g"), key);
                        }
                        return {routine, functions};
                    }
                }
            }
        }
    }

    const {routine, functions} = splitPath(getPath(getMap()));
    if(DEBUG) console.log(routine, functions);

    const getWholeString = () => `${routine}\n${functions.A}\n${functions.B}\n${functions.C}\nn\n`

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

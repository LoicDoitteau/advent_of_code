fs = require("fs");
fs.readFile("./2019/day_15/input.txt", 'utf8', (err, data) => {
    const startTime = new Date().getTime();
    const states = {RUNNING : 0, HALTED : 1, STOPPED : 2};
    const movements = {NORTH : {id : 1, dx : 0, dy : -1}, SOUTH : {id : 2, dx : 0, dy : 1}, WEST : {id : 3, dx : -1, dy : 0}, EAST : {id : 4, dx : 1, dy : 0}};
    const reverse_movements = {NORTH : movements.SOUTH, SOUTH : movements.NORTH, WEST : movements.EAST, EAST : movements.WEST};
    const tiles = {WALL : 0, EMPTY : 1, GOAL : 2};
    const DEBUG = false;
    let res = null;

    function IntProgram() {
        this.pointer = 0;
        this.relativeBase = 0;
        this.intcode = data.split(',').map(Number);
        this.input = null;
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
                this.intcode[value1] = this.input;
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
            process : (value) => {
                this.input = value;
                this.state = states.RUNNING;
                while(true) {
                    const program = this.intcode[this.pointer].toString().padStart(5, '0');
                    let parameters = program.slice(0, program.length - 2);
                    let opcode = program.slice(program.length - 2);

                    if(this.state != states.RUNNING) return {state : this.state, output : this.output};
                    this.instructions[opcode](parameters);
                }
            }
        }
    }

    const getPathLength = () => {
        const area = {0 : {0 : {type : tiles.EMPTY, visited : true}}};
        let pos = {x : 0, y : 0};
        const path = [];
        const prog = new IntProgram();

        while(true) {
            if(area[pos.x][pos.y].type == tiles.GOAL) return path.length;
            let moved = false;
            for (const dir in movements) {
                const movement = movements[dir];
                const newPos = {x : pos.x + movement.dx, y : pos.y + movement.dy};
                if(!area[newPos.x]) area[newPos.x] = {};
                if(!area[newPos.x][newPos.y]) area[newPos.x][newPos.y] = {};
                if(!area[newPos.x][newPos.y].visited) {
                    const state = prog.process(movement.id);
                    if(state.state == states.STOPPED) return null;
                    area[newPos.x][newPos.y] = {type : state.output, visited : true}
                    if(state.output != tiles.WALL) {
                        path.push(dir);
                        pos = newPos;
                        moved = true;
                        break;
                    }
                }
            }
            if(!moved) {
                if(path.length == 0) return null;
                const dir = path.pop();
                const movement = reverse_movements[dir];
                const newPos = {x : pos.x + movement.dx, y : pos.y + movement.dy};
                const state = prog.process(movement.id);
                if(state.state == states.STOPPED) return null;
                pos = newPos;
            }
        }
    }
    res = getPathLength();
    console.log(res);
    const elapsedTime = new Date().getTime() - startTime;
    console.log(`Elapsed : ${elapsedTime} ms`);
});

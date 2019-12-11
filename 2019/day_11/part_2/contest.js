fs = require("fs");
fs.readFile("./2019/day_11/input.txt", 'utf8', (err, data) => {
    const startTime = new Date().getTime();
    const states = {RUNNING : 0, HALTED : 1, STOPPED : 2};
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

    const dir = {
        UP : {
            MOVE : {dx : 0, dy : -1},
            LEFT : "LEFT",
            RIGHT : "RIGHT"
        },
        RIGHT : {
            MOVE : {dx : 1, dy : 0},
            LEFT : "UP",
            RIGHT : "DOWN"
        },
        DOWN : {
            MOVE : {dx : 0, dy : 1},
            LEFT : "RIGHT",
            RIGHT : "LEFT"
        },
        LEFT : {
            MOVE : {dx : -1, dy : 0},
            LEFT : "DOWN",
            RIGHT : "UP"
        }
    }

    const painted = {};
    const current = {x : 0, y : 0, dir : dir.UP};
    const prog = new IntProgram();

    let state = null;
    painted[0] = {0 : 1};
    let [minX, maxX, minY, maxY] = [null, null, null, null]; 
    do {
        let input = 0;
        if(painted[current.x] && painted[current.x][current.y]) input = painted[current.x][current.y];

        state = prog.process(input);
        if(!painted[current.x]) painted[current.x] = {};
        painted[current.x][current.y] = state.output;
        if(minX == null || current.x < minX) minX = current.x;
        if(minY == null || current.y < minY) minY = current.y;
        if(maxX == null || current.x > maxX) maxX = current.x;
        if(maxY == null || current.y > maxY) maxY = current.y;

        if(state.state != states.STOPPED) {
            state = prog.process(input);
            if(state.output == 0) current.dir = dir[current.dir.LEFT];
            else current.dir = dir[current.dir.RIGHT];
            current.x += current.dir.MOVE.dx;
            current.y += current.dir.MOVE.dy;
        }
    } while(state.state != states.STOPPED);

    let image = "";
    for(let y = minY; y <= maxY; y++) {
        for(let x = minX; x < maxX; x++) {
            let value = 0;
            if(painted[x] && painted[x][y]) value = painted[x][y]
            image += value == 0 ? "." : "#";
        }
        image += "\r\n";
    }

    fs.writeFile("./2019/day_11/part_2/image.txt", image, function(err) {
        if(err) return console.log(err);
        console.log("The file was saved!");
    });

    const elapsedTime = new Date().getTime() - startTime;
    console.log(`Elapsed : ${elapsedTime} ms`);
});

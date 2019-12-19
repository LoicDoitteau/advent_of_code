fs = require("fs");
fs.readFile("./2019/day_19/input.txt", 'utf8', (err, data) => {
    const startTime = new Date().getTime();
    const states = {RUNNING : 0, HALTED : 1, STOPPED : 2};
    const DEBUG = true;
    const RANGE_X = 100;
    const RANGE_Y = 100;
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

    const getShipPos = () => {
        let rows = [];
        let minX = 0;
        let y = 0;
        while(true) {
            let state;
            let counter = 0;
            let row = {};
            let x = minX;
            while(true) {
                const prog = new IntProgram();
                state = prog.process([x, y]);
                if(state.state == states.STOPPED) return null;
                if(counter == 0 && state.output == 1) {
                    row.start = x;
                    minX = x;
                }
                else if(counter > 0 && state.output == 0) {
                    row.range = counter;
                    rows.push(row);
                    break;
                }
                else if(counter == 0 && x > minX + 1000) {
                    rows.push(row);
                    break;
                }
                counter += state.output;
                x++;
            }
            if(y >= RANGE_Y - 1) {
                let currentRow = rows[y];
                let subRows = rows.slice(y - (RANGE_Y - 1), y + 1);
                if(subRows.every(row => row.range >= RANGE_X + currentRow.start - row.start))
                return {x : currentRow.start, y : y - (RANGE_Y - 1)};
            }
            y++;
        }
    }
    const pos = getShipPos();

    if(DEBUG) {
        let map = "";
        for(let y = pos.y - 10; y < pos.y + RANGE_Y + 10; y++) {
            let state;
            for(let x = pos.x - 10; x < pos.x + RANGE_X + 10; x++) {
                const prog = new IntProgram();
                state = prog.process([x, y]);
                if(state.state == states.STOPPED) break;
                map += state.output != 0 ? x >= pos.x && x < pos.x + RANGE_X && y >= pos.y && y < pos.y + RANGE_Y ? "O" : "#" : ".";
            }
            if(state.state == states.STOPPED) break;
            map += "\r\n";
        }
        fs.writeFile("./2019/day_19/part_2/output.txt", map, function(err) {
            if(err) return console.log(err);
            console.log("The file was saved!");
        });
    }

    res = pos.x * 10000 + pos.y;
    console.log(res);
    const elapsedTime = new Date().getTime() - startTime;
    console.log(`Elapsed : ${elapsedTime} ms`);
});

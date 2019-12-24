fs = require("fs");
fs.readFile("./2019/day_23/input.txt", 'utf8', (err, data) => {
    const startTime = new Date().getTime();
    const states = {RUNNING : 0, INPUT : 1, OUTPUT : 2, STOPPED : 3};
    const COMPUTERS_COUNT = 50;
    const ADDRESS = 255;
    const DEBUG = true;
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
            setInput : input => this.input = input,
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

    function Network() {
        this.computers = [];

        return {
            add : computer => this.computers.push(computer),
            send : (address, ...packet) => {
                const computer = this.computers.find(c => c.address == address);
                if(computer) computer.receive(packet);
            }
        }
    }
    
    function Computer(address, network) {
        this.prog = new IntProgram();
        this.network = network;
        this.address = address;
        this.packets = [];
        this.working = false;
        this.output = [];

        this.return = {
            address : this.address,
            boot : () => {
                if(!this.working) {
                    this.prog.setInput(this.address);
                    this.prog.process.next().value;
                    this.network.add(this.return);
                    this.working = true;
                }
            },
            work : () => {
                if(this.working) {
                    if(this.packets.length == 0) this.prog.setInput(-1);
                    else this.prog.setInput(this.packets[0]);

                    const step = this.prog.process.next();

                    if(step.done) this.working = false;
                    else {
                        const state = step.value;
                        if(state.state == states.INPUT) this.packets.shift();
                        else if(state.state == states.OUTPUT) this.output.push(state.output);

                        if(this.output.length == 3) {
                            const message = this.output.slice();
                            this.network.send(...message);
                            this.output = [];
                            return {working : this.working, message};
                        }
                    }
                }
                return {working : this.working};
            },
            receive : packet => this.packets.push(...packet)
        }

        return this.return;
    } 

    const getResponse = () => {
        const network = new Network();
        const computers = Array.from({length : COMPUTERS_COUNT}, (_, i) => new Computer(i, network));

        for (const computer of computers) {
            computer.boot();
        }

        while(true) {
            for (const computer of computers) {
                const state = computer.work();
                if(state.message && state.message[0] == ADDRESS) return state.message[2];
            }
        }
    }

    res = getResponse();
    console.log(res);
    const elapsedTime = new Date().getTime() - startTime;
    console.log(`Elapsed : ${elapsedTime} ms`);
});

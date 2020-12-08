fs = require("fs");
fs.readFile("./2020/day_8/input.txt", 'utf8', (err, input) => {
    
    const status = {
        END: 0,
        LOOP: 1,
        ERR: 2
    };

    function GameConsole() {
        this.accumulator = 0;
        this.pointer = 0;

        const operations = {
            acc: (val) => {
                this.accumulator += val;
                this.pointer++;
            },
            jmp: (val) => {
                this.pointer += val;
            },
            nop: () => {
                this.pointer++;
            }
        };

        return {
            boot: (instructions) => {
                this.accumulator = 0;
                this.pointer = 0;
                const done = new Set();

                while (true) {
                    if (this.pointer == instructions.length)
                        return { acc: this.accumulator, status: status.END };
                    if (this.pointer > instructions.length)
                        return { acc: this.accumulator, status: status.ERR };
                    if (done.has(this.pointer))
                        return { acc: this.accumulator, status: status.LOOP };
                    const { op, val } = instructions[this.pointer];
                    done.add(this.pointer);
                    operations[op](val);
                }
            }
        };
    }

    const instructions = input.split("\r\n").map(line => {
        const [ op, val ] = line.split(' ');
        return { op, val: Number(val) };
    });
    const game = new GameConsole();

    const fix = () => {
        const perm = {
            jmp: 'nop',
            nop: 'jmp' 
        };

        for (const instruction of instructions) {
            if (perm[instruction.op]) {
                instruction.op = perm[instruction.op];
                const res = game.boot(instructions);
                if (res.status == status.END)
                    return res.acc;
                instruction.op = perm[instruction.op];
            }
        }
    }

    const response = fix();
    console.log(response);
});
